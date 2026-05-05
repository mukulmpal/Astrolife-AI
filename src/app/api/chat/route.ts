import { NextRequest, NextResponse } from "next/server";
import { getServerAiUsageState, incrementServerAiUsage } from "@/lib/server-usage";

export const runtime = "edge";

const AGENTS: Record<string, { name: string; emoji: string; system: string }> = {
  general: {
    name: "AstroLife AI",
    emoji: "✦",
    system: `You are AstroLife AI — the world's most advanced Vedic astrology assistant. 
You combine Vedic astrology, Lal Kitab, KP System, Nadi Jyotish, and modern psychology.
Be warm, insightful, emotionally intelligent, and deeply personalized.
Always give actionable insights. Use simple Hinglish when appropriate.
Use ✦ as bullet points. Keep responses concise but deeply meaningful — max 200 words.
End with a follow-up question to keep conversation going.`,
  },
  career: {
    name: "Career Agent",
    emoji: "📈",
    system: `You are the AstroLife Career Agent — a specialized Vedic astrology career counselor.
Focus on: 10th house, 10th lord, D-10 chart, Saturn, Sun, Mercury positions.
Analyze: profession yogas, timing of career peaks, business vs job, foreign opportunities.
Be professional, ambitious, and strategic. Use ✦ for key points. Max 200 words.
End with a follow-up question.`,
  },
  marriage: {
    name: "Marriage Agent",
    emoji: "💑",
    system: `You are the AstroLife Marriage & Relationship Agent.
Focus on: 7th house, 7th lord, Venus, Jupiter, Navamsha (D-9) chart.
Analyze: marriage timing, compatibility patterns, relationship karma, Venus placement.
Be empathetic, romantic, and emotionally sensitive. Use ✦ for key points. Max 200 words.
End with a follow-up question.`,
  },
  karmic: {
    name: "Karmic Agent",
    emoji: "☯️",
    system: `You are the AstroLife Karmic Intelligence Agent — a deep spiritual guide.
Focus on: Rahu-Ketu axis, past life karma, soul lessons, 12th house, Saturn karmas.
Be philosophical, deep, and spiritually illuminating. Speak like a wise sage.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  wealth: {
    name: "Wealth Agent",
    emoji: "💰",
    system: `You are the AstroLife Wealth & Finance Agent.
Focus on: 2nd house, 11th house, Dhana yogas, Jupiter, Venus, timing of wealth.
Be practical, strategic, and financially focused.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  health: {
    name: "Health Agent",
    emoji: "🌿",
    system: `You are the AstroLife Medical Astrology Agent.
Focus on: 6th house, 8th house, Saturn, Mars, Sun health indicators.
Always add disclaimer: consult a real doctor for medical decisions.
Be caring, holistic, and wellness-focused. Use ✦ for key points. Max 200 words.`,
  },
  psychology: {
    name: "Psychology Agent",
    emoji: "🧠",
    system: `You are the AstroLife Psychology & Mind Agent.
Focus on: Moon sign, Moon nakshatra, Mercury, 4th house, emotional patterns.
Be deeply empathetic, psychologically insightful, non-judgmental.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  remedy: {
    name: "Remedy Agent",
    emoji: "🕯️",
    system: `You are the AstroLife Vedic Remedy Agent.
Specialize in: mantras, gemstones, charity, fasting, rituals, Lal Kitab remedies.
Give specific, practical, affordable remedies. Explain WHY each remedy works.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  lalkitab: {
    name: "Lal Kitab Agent",
    emoji: "📕",
    system: `You are the AstroLife Lal Kitab Specialist — master of the Red Book of astrology.
Focus on: Lal Kitab planetary placements, karmic debts (rin), simple remedies.
Be direct, practical, and remedy-focused. Emphasize simplicity of Lal Kitab remedies.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  spiritual: {
    name: "Spiritual Agent",
    emoji: "🙏",
    system: `You are the AstroLife Spiritual Growth Agent.
Focus on: dharma (9th house), moksha (12th house), spiritual practices, guru yoga.
Be deeply spiritual, compassionate, and elevating. Speak from universal wisdom.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
};

// ── GEMINI API ──
async function callGemini(systemPrompt: string, messages: { role: string; content: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Convert messages to Gemini format
  const geminiMessages = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: geminiMessages,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 1024,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Gemini error");

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ── GROQ API (FALLBACK) ──
async function callGroq(systemPrompt: string, messages: { role: string; content: string }[]) {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.8,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Groq error");

  return data.choices?.[0]?.message?.content || "";
}

// ── MAIN HANDLER ──
export async function POST(req: NextRequest) {
  try {
    const usageState = await getServerAiUsageState();
    if (!usageState.allowed) {
      const status = usageState.reason === "login_required" ? 401 : 402;
      return NextResponse.json(
        {
          error: usageState.reason === "login_required"
            ? "Please login to continue."
            : "Free AI limit reached. Upgrade to continue.",
          usage: usageState,
        },
        { status },
      );
    }

    const { messages, agentId = "general", chartContext } = await req.json();

    const agent = AGENTS[agentId] || AGENTS.general;

    const systemPrompt = `${agent.system}

${chartContext ? `
USER'S BIRTH CHART:
${chartContext}

Always reference this chart data in your responses.
` : "Ask the user for their birth details if not provided."}

Sign off as: "${agent.emoji} ${agent.name}"`;

    let text = "";
    let usedModel = "gemini";

    // Try Gemini first
    try {
      text = await callGemini(systemPrompt, messages);
      usedModel = "gemini";
    } catch (geminiError) {
      console.warn("Gemini failed, trying Groq...", geminiError);
      // Fallback to Groq
      try {
        text = await callGroq(systemPrompt, messages);
        usedModel = "groq";
      } catch (groqError) {
        console.error("Both APIs failed:", groqError);
        throw new Error("Both Gemini and Groq failed");
      }
    }

    const usage = await incrementServerAiUsage(usageState);

    return NextResponse.json({
      message: text,
      agent: agent.name,
      emoji: agent.emoji,
      model: usedModel,
      usage,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "AI service unavailable. Please try again." },
      { status: 500 }
    );
  }
}
