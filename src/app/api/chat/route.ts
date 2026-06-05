import { createAdminClient } from "@/lib/supabase/admin";
import { getServerAiUsageState, incrementServerAiUsage } from "@/lib/server-usage";
import { monitor } from "@/lib/server-monitoring";
import { buildUnifiedAstroLifeChatPrompt } from "@/lib/ai-chat/astrolife-unified-context";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import {
  fail,
  isRecord,
  ok,
  optionalText,
  readJsonWithLimit,
  sanitizeText,
  validationErrorResponse,
  type ValidationResult,
} from "@/lib/validation/api";

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

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 18_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callGemini(system: string, messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const res = await fetchWithTimeout(url, {
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
  const res = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: system }, ...messages],
      max_tokens: 1024,
      temperature: 0.8,
    }),
  }, 12_000);
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

type ChatMessage = { role: "user" | "assistant"; content: string };
type ChatRequestBody = {
  messages: ChatMessage[];
  agentId: string;
  chartContext?: string;
  transitContext?: string;
  dailyFeedContext?: string;
  vargaContext?: string;
  palmSessionId?: string;
  userId?: string;
};

function validateChatBody(value: unknown): ValidationResult<ChatRequestBody> {
  if (!isRecord(value)) return fail("Chat payload must be an object.");
  const issues: string[] = [];
  const rawMessages = value.messages;

  if (!Array.isArray(rawMessages) || rawMessages.length < 1 || rawMessages.length > 20) {
    issues.push("messages must contain 1-20 items.");
  }

  const messages: ChatMessage[] = [];
  if (Array.isArray(rawMessages)) {
    for (const item of rawMessages.slice(0, 20)) {
      if (!isRecord(item)) {
        issues.push("Each message must be an object.");
        continue;
      }
      const role = item.role;
      const content = sanitizeText(item.content, 4_000);
      if (role !== "user" && role !== "assistant") issues.push("Message role must be user or assistant.");
      if (!content) issues.push("Message content is required and must be under 4000 characters.");
      if ((role === "user" || role === "assistant") && content) messages.push({ role, content });
    }
  }

  const agentId = typeof value.agentId === "string" && AGENTS[value.agentId] ? value.agentId : "general";
  const body: ChatRequestBody = {
    messages,
    agentId,
    chartContext: optionalText(value.chartContext, 20_000),
    transitContext: optionalText(value.transitContext, 12_000),
    dailyFeedContext: optionalText(value.dailyFeedContext, 12_000),
    vargaContext: optionalText(value.vargaContext, 20_000),
    palmSessionId: optionalText(value.palmSessionId, 120),
    userId: optionalText(value.userId, 120),
  };

  if (issues.length) return fail("Invalid chat payload.", issues.slice(0, 8));
  return ok(body);
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "api-chat", limit: 30, windowMs: 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateChatBody, { maxBytes: 90_000, routeName: "api-chat" });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const body = parsed.data;
    const { messages, agentId = "general", chartContext, transitContext, dailyFeedContext, vargaContext } = body;
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

    const requestUrl = new URL(req.url);
    const palmSessionId = body.palmSessionId ?? requestUrl.searchParams.get("palmSessionId");

    const existingSystemPrompt = [
      agent.system,
      chartContext   ? `\nUSER'S BIRTH CHART:\n${chartContext}` : "",
      vargaContext   ? `\nSHODASHA VARGA INTELLIGENCE:\n${vargaContext}` : "",
      transitContext ? `\nCURRENT TRANSITS:\n${transitContext}` : "",
      dailyFeedContext ? `\nDAILY FEED:\n${dailyFeedContext}` : "",
      `\nStyle: Premium Hinglish. ✦ bullets. Max 200 words. Sign off as: "${agent.emoji} ${agent.name}"`,
    ].join("");

    const systemPrompt = await buildUnifiedAstroLifeChatPrompt({
      existingPrompt: existingSystemPrompt,
      palmSessionId,
      userId: body.userId ?? null,
      includeRawEngineContext: false,
    });

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
      palmSessionId ? "Palmistry Report" : null,
    ].filter(Boolean);

    // Save to DB — always, even for anonymous users
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
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
