import { createAdminClient } from "@/lib/supabase/admin";
import { getServerAiUsageState, incrementServerAiUsage } from "@/lib/server-usage";
import { monitor } from "@/lib/server-monitoring";
import { NextRequest, NextResponse } from "next/server";

const AGENTS: Record<string, { name: string; emoji: string; system: string }> = {
  general: {
    name: "AstroLife AI", emoji: "✦",
    system: `You are AstroLife AI — India's most advanced Vedic astrology assistant. Combine Vedic, Lal Kitab, KP, Nadi, Transit analysis. Be warm, insightful, personalized. Use ✦ bullets. Max 200 words. End with a follow-up question.`,
  },
  career: {
    name: "Career Agent", emoji: "📈",
    system: `You are AstroLife Career Agent. Focus: 10th house, D-10, Saturn, Sun, Mercury, career dashas. Analyze: profession yogas, timing peaks, business vs job. Professional, strategic. ✦ bullets. Max 200 words.`,
  },
  marriage: {
    name: "Marriage Agent", emoji: "💑",
    system: `You are AstroLife Marriage Agent using the AstroLife Marriage Trigger Engine. Focus: D1/D9 promise, 7th house, Venus, Jupiter, KP 2-7-11 validation, dasha activation and transit/event trigger windows. Do not attribute this to any external named marriage system. Analyze marriage timing, compatibility and relationship karma. Empathetic, practical. ✦ bullets. Max 200 words.`,
  },
  karmic: {
    name: "Karmic Agent", emoji: "☯️",
    system: `You are AstroLife Karmic Intelligence Agent. Focus: Rahu-Ketu axis, past life karma, 12th house, Saturn karmas. Philosophical, spiritually illuminating. ✦ bullets. Max 200 words.`,
  },
  wealth: {
    name: "Wealth Agent", emoji: "💰",
    system: `You are AstroLife Wealth Agent. Focus: 2nd, 11th house, Dhana yogas, Jupiter, Venus, Mercury transits. Practical, strategic, financially focused. ✦ bullets. Max 200 words.`,
  },
  health: {
    name: "Health Agent", emoji: "🌿",
    system: `You are AstroLife Medical Astrology Agent. Focus: 6th, 8th house, Saturn, Mars, Rahu/Ketu. Always add: consult a real doctor. Caring, holistic. ✦ bullets. Max 200 words.`,
  },
  psychology: {
    name: "Psychology Agent", emoji: "🧠",
    system: `You are AstroLife Psychology Agent. Focus: Moon sign, nakshatra, Mercury, 4th house. Analyze emotional patterns, mental strengths. Compassionate, therapeutic. ✦ bullets. Max 200 words.`,
  },
  remedy: {
    name: "Remedy Agent", emoji: "🕯️",
    system: `You are AstroLife Vedic Remedy Agent. Specialize: mantras, gemstones, charity, rituals, fasting. Affordable, actionable. ✦ bullets. Max 200 words.`,
  },
  lalkitab: {
    name: "Lal Kitab Agent", emoji: "📕",
    system: `You are AstroLife Lal Kitab Specialist. Focus: house-wise planets, SP Bhagat remedies, donation timings, daily practices. Practical, action-oriented. ✦ bullets. Max 200 words.`,
  },
  spiritual: {
    name: "Spiritual Agent", emoji: "🙏",
    system: `You are AstroLife Spiritual Growth Agent. Focus: dharma (9th), moksha (12th), guru yoga, Jupiter/Ketu transits. Deeply spiritual, compassionate. ✦ bullets. Max 200 words.`,
  },
};

async function callGemini(system: string, messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { temperature: 0.8, maxOutputTokens: 1500 },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Gemini error");
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

async function callGroq(system: string, messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: system }, ...messages],
      max_tokens: 1024,
      temperature: 0.8,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Groq error");
  return data.choices?.[0]?.message?.content || "";
}

async function saveChatMessages(userId: string | null, sessionId: string, agentId: string, userMsg: string, aiMsg: string) {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("chat_messages").insert([
      { user_id: userId, session_id: sessionId, agent_id: agentId, role: "user", content: userMsg },
      { user_id: userId, session_id: sessionId, agent_id: agentId, role: "assistant", content: aiMsg },
    ]);
    if (error) console.error("chat save error:", error.message);
  } catch (e) { console.error("chat save exception:", e); }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, agentId = "general", chartContext, transitContext, dailyFeedContext, vargaContext } = await req.json();
    const agent = AGENTS[agentId] || AGENTS.general;
    const usageState = await getServerAiUsageState();

    if (!usageState.allowed) {
      monitor.warn("ai_chat.blocked", {
        agentId,
        reason: usageState.reason,
        tier: usageState.tier,
        used: usageState.used,
        limit: usageState.limit,
      });

      return NextResponse.json(
        {
          error: usageState.reason === "login_required"
            ? "Login required to use AstroLife AI."
            : "Your free AI question limit is finished. Please upgrade to continue.",
          usage: usageState,
        },
        { status: usageState.authenticated ? 402 : 401 },
      );
    }

    const systemPrompt = [
      agent.system,
      chartContext   ? `\nUSER'S BIRTH CHART:\n${chartContext}` : "",
      vargaContext   ? `\nSHODASHA VARGA INTELLIGENCE:\n${vargaContext}` : "",
      transitContext ? `\nCURRENT TRANSITS:\n${transitContext}` : "",
      dailyFeedContext ? `\nDAILY FEED:\n${dailyFeedContext}` : "",
      `\nStyle: Premium Hinglish. ✦ bullets. Max 200 words. Sign off as: "${agent.emoji} ${agent.name}"`,
    ].join("");

    // Try Gemini first, fallback to Groq
    let text = "";
    let model = "gemini";
    try {
      text = await callGemini(systemPrompt, messages);
    } catch (e) {
      monitor.warn("ai_chat.gemini_failed_groq_fallback", {
        agentId,
        errorName: e instanceof Error ? e.name : undefined,
        errorMessage: e instanceof Error ? e.message : String(e),
      });
      text = await callGroq(systemPrompt, messages);
      model = "groq";
    }

    const sources = [
      chartContext    ? "Natal Chart"     : null,
      vargaContext    ? "Shodasha Varga"   : null,
      transitContext  ? "Transit/Gochar"  : null,
      dailyFeedContext ? "Daily Feed"     : null,
    ].filter(Boolean);

    // Save to DB — always, even for anonymous users
    const lastUserMsg = [...(messages as { role: string; content: string }[])].reverse().find((m) => m.role === "user");
    if (lastUserMsg?.content) {
      const sid = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await saveChatMessages(null, sid, agentId, lastUserMsg.content, text);
    }

    const usage = await incrementServerAiUsage(usageState);
    monitor.info("ai_chat.generated", {
      agentId,
      model,
      tier: usage.tier,
      used: usage.used,
      limit: usage.limit,
      trackedOnServer: usage.trackedOnServer,
    });

    return NextResponse.json({ message: text, agent: agent.name, emoji: agent.emoji, model, sources, usage });
  } catch (error) {
    monitor.error("ai_chat.failed", error);
    return NextResponse.json({ error: "AI service unavailable. Please try again." }, { status: 500 });
  }
}
