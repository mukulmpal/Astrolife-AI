import { NextRequest, NextResponse } from "next/server";
import { buildAstroSoundChatContext } from "@/lib/astro-engine/astro-sound-chat-context";
import {
  getServerAiUsageState,
  incrementServerAiUsage,
} from "@/lib/server-usage";

export const runtime = "edge";
type LanguageMode = "hindi" | "english" | "hinglish";

function detectIntentSources(params: {
  messages: { role: string; content: string }[];
  hasChart: boolean;
  hasTransit: boolean;
  hasDailyFeed: boolean;
}) {
  const { messages, hasChart, hasTransit, hasDailyFeed } = params;
  const latestUser = [...messages].reverse().find((m) => m.role === "user")?.content?.toLowerCase() ?? "";
  const isTiming = /(today|now|current|this week|timing|kab|abhi|phase|window|gochar|transit)/i.test(latestUser);
  const isRemedy = /(remedy|upay|mantra|totka|daan|donate|fast|vrat|gem|stone)/i.test(latestUser);
  const isCareer = /(career|job|business|promotion|work|profession)/i.test(latestUser);
  const isRelationship = /(marriage|love|relationship|partner|shaadi|vivah)/i.test(latestUser);
  const isHealth = /(health|disease|medical|wellness|anxiety|stress|sleep)/i.test(latestUser);

  const ordered: string[] = [];
  const pushIf = (label: string, ok: boolean) => {
    if (ok && !ordered.includes(label)) ordered.push(label);
  };

  if (isTiming) {
    pushIf("Transit/Gochar", hasTransit);
    pushIf("Daily Feed", hasDailyFeed);
  }
  if (isRemedy) {
    pushIf("Daily Feed", hasDailyFeed);
    pushIf("Transit/Gochar", hasTransit);
  }
  if (isCareer || isRelationship || isHealth) {
    pushIf("Natal Chart", hasChart);
    pushIf("Transit/Gochar", hasTransit);
  }

  pushIf("Natal Chart", hasChart);
  pushIf("Transit/Gochar", hasTransit);
  pushIf("Daily Feed", hasDailyFeed);
  return ordered;
}

function buildSourceConfidence(params: {
  source: string;
  latestUser: string;
}) {
  const { source, latestUser } = params;
  const timing = /(today|now|current|this week|timing|kab|abhi|phase|window|gochar|transit)/i.test(latestUser);
  const remedy = /(remedy|upay|mantra|totka|daan|donate|fast|vrat|gem|stone)/i.test(latestUser);
  const deep = /(career|job|business|promotion|work|profession|marriage|love|relationship|partner|shaadi|vivah|health|disease|medical)/i.test(latestUser);

  if (source === "Transit/Gochar" && timing) return { confidence: "High", reason: "Current timing query detected." };
  if (source === "Daily Feed" && (timing || remedy)) return { confidence: "High", reason: "Today/remedy guidance query detected." };
  if (source === "Natal Chart" && deep) return { confidence: "High", reason: "Personal chart analysis query detected." };
  return { confidence: "Medium", reason: "Supportive context used." };
}

const AGENTS: Record<string, { name: string; emoji: string; system: string }> = {
  general: {
    name: "AstroLife AI",
    emoji: "✦",
    system: `You are AstroLife AI — the world's most advanced Vedic astrology assistant. 
You combine Vedic astrology, Lal Kitab, KP System, Nadi Jyotish, Transit/Gochar analysis, and modern psychology.
Be warm, insightful, emotionally intelligent, and deeply personalized.
Always give actionable insights. Use simple Hinglish when appropriate.
Use ✦ as bullet points. Keep responses concise but deeply meaningful — max 200 words.
End with a follow-up question to keep conversation going.`,
  },
  career: {
    name: "Career Agent",
    emoji: "📈",
    system: `You are the AstroLife Career Agent — a specialized Vedic astrology career counselor.
Focus on: 10th house, 10th lord, D-10 chart, Saturn, Sun, Mercury positions, and current transits over career houses.
Analyze: profession yogas, timing of career peaks, business vs job, foreign opportunities, and current Gochar support.
Be professional, ambitious, and strategic. Use ✦ for key points. Max 200 words.
End with a follow-up question.`,
  },
  marriage: {
    name: "Marriage Agent",
    emoji: "💑",
    system: `You are the AstroLife Marriage & Relationship Agent.
Focus on: 7th house, 7th lord, Venus, Jupiter, Navamsha (D-9) chart, and current Venus/Jupiter/Saturn/Rahu transits.
Analyze: marriage timing, compatibility patterns, relationship karma, Venus placement, and current relationship phase.
Be empathetic, romantic, and emotionally sensitive. Use ✦ for key points. Max 200 words.
End with a follow-up question.`,
  },
  karmic: {
    name: "Karmic Agent",
    emoji: "☯️",
    system: `You are the AstroLife Karmic Intelligence Agent — a deep spiritual guide.
Focus on: Rahu-Ketu axis, past life karma, soul lessons, 12th house, Saturn karmas, and current Saturn/Rahu/Ketu transits.
Be philosophical, deep, and spiritually illuminating. Speak like a wise sage.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  wealth: {
    name: "Wealth Agent",
    emoji: "💰",
    system: `You are the AstroLife Wealth & Finance Agent.
Focus on: 2nd house, 11th house, Dhana yogas, Jupiter, Venus, Mercury, and current transit support for income/savings.
Be practical, strategic, and financially focused.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  health: {
    name: "Health Agent",
    emoji: "🌿",
    system: `You are the AstroLife Medical Astrology Agent.
Focus on: 6th house, 8th house, Saturn, Mars, Sun, Moon, Rahu/Ketu, and sensitive current health transits.
Always add disclaimer: consult a real doctor for medical decisions.
Be caring, holistic, and wellness-focused. Use ✦ for key points. Max 200 words.`,
  },
  psychology: {
    name: "Psychology Agent",
    emoji: "🧠",
    system: `You are the AstroLife Psychology & Mind Agent.
Focus on: Moon sign, Moon nakshatra, Mercury, 4th house, emotional patterns, and current Moon/Saturn/Rahu transits.
Be deeply empathetic, psychologically insightful, non-judgmental.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  remedy: {
    name: "Remedy Agent",
    emoji: "🕯️",
    system: `You are the AstroLife Vedic Remedy Agent.
Specialize in: mantras, gemstones, charity, fasting, rituals, Lal Kitab remedies, and transit-based temporary remedies.
Give specific, practical, affordable remedies. Explain WHY each remedy works.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  lalkitab: {
    name: "Lal Kitab Agent",
    emoji: "📕",
    system: `You are the AstroLife Lal Kitab Specialist — master of the Red Book of astrology.
Focus on: Lal Kitab planetary placements, karmic debts (rin), simple remedies, and current transit triggers.
Be direct, practical, and remedy-focused. Emphasize simplicity of Lal Kitab remedies.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
  spiritual: {
    name: "Spiritual Agent",
    emoji: "🙏",
    system: `You are the AstroLife Spiritual Growth Agent.
Focus on: dharma (9th house), moksha (12th house), spiritual practices, guru yoga, Jupiter/Ketu/Saturn transits.
Be deeply spiritual, compassionate, and elevating. Speak from universal wisdom.
Use ✦ for key points. Max 200 words. End with a follow-up question.`,
  },
};

// ── GEMINI API ──
async function callGemini(
  systemPrompt: string,
  messages: { role: string; content: string }[]
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const geminiMessages = messages.map((m) => ({
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

  if (!res.ok) {
    throw new Error(data.error?.message || "Gemini error");
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ── GROQ API FALLBACK ──
async function callGroq(
  systemPrompt: string,
  messages: { role: string; content: string }[]
) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const url = "https://api.groq.com/openai/v1/chat/completions";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      max_tokens: 1024,
      temperature: 0.8,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Groq error");
  }

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
          error:
            usageState.reason === "login_required"
              ? "Please login to continue."
              : "Free AI limit reached. Upgrade to continue.",
          usage: usageState,
        },
        { status }
      );
    }

    const astroSoundRequestBody = await req.json();
    const {
      messages,
      agentId = "general",
      chartContext,
      transitContext,
      dailyFeedContext,
      languageMode = "hinglish",
    } = astroSoundRequestBody;

    const astroSoundSignalInput = JSON.stringify({
      agentId,
      languageMode,
      latestUserMessage: [...messages].reverse().find((m: { role: string; content: string }) => m.role === "user")?.content ?? "",
    });
    const astroSoundChatContext = buildAstroSoundChatContext(astroSoundSignalInput);

    const agent = AGENTS[agentId] || AGENTS.general;

    const chartBlock = chartContext
      ? `
USER'S BIRTH CHART:
${chartContext}

Use this natal chart as the permanent base of interpretation.
Always reference this chart data when answering personal astrology questions.
`
      : `
USER'S BIRTH CHART:
Not provided.

Ask the user for their birth details if birth chart data is required.
`;

    const transitBlock = transitContext
      ? `
CURRENT TRANSIT / GOCHAR CONTEXT:
${transitContext}

Use this transit context for current timing, near-term predictions, active alerts, opportunities, emotional state, career/money/love/health timing, and Sade Sati or Ashtama Shani style interpretations when relevant.

Important:
- If the user asks about "now", "today", "this week", "current phase", "timing", "career now", "relationship now", "health now", "money now", or "what should I do", prioritize this transit context along with the natal chart.
- Do not overstate certainty. Say "this indicates", "this may show", or "this period supports".
- Give practical advice and remedies when there are caution alerts.
`
      : `
CURRENT TRANSIT / GOCHAR CONTEXT:
Not provided.

If the user asks current timing questions, explain that transit data is needed for accurate timing.
`;

    const dailyFeedBlock = dailyFeedContext
      ? `
DAILY PERSONAL FEED (TODAY-FIRST CONTEXT):
${dailyFeedContext}

Use this as your top priority for "today/now/this week" guidance.
When user asks practical next steps, align advice with this feed first, then support with natal + transit reasoning.
`
      : `
DAILY PERSONAL FEED (TODAY-FIRST CONTEXT):
Not provided.
`;
    const langMode = (["hindi", "english", "hinglish"].includes(languageMode) ? languageMode : "hinglish") as LanguageMode;
    const languageBlock =
      langMode === "hindi"
        ? "LANGUAGE MODE: Hindi only (Devanagari script)."
        : langMode === "english"
          ? "LANGUAGE MODE: English only."
          : "LANGUAGE MODE: Natural Hinglish (Roman Hindi + English mix).";

    const systemPrompt = `
ASTRO_SOUND_CONTEXT_INJECTED:
${astroSoundChatContext}
${agent.system}

${chartBlock}

${transitBlock}

${dailyFeedBlock}

${languageBlock}

RESPONSE STYLE:
- Use simple, premium Hinglish when appropriate.
- Use ✦ as bullet points.
- Keep answers concise but useful.
- Avoid fear-based predictions.
- For health questions, always remind the user to consult a qualified doctor.
- For finance/legal decisions, keep advice practical and non-guaranteed.
- End with a helpful follow-up question unless the user asks for a direct final answer.

Sign off as: "${agent.emoji} ${agent.name}"`;

    let text = "";
    let usedModel = "gemini";

    try {
      text = await callGemini(systemPrompt, messages);
      usedModel = "gemini";
    } catch (geminiError) {
      console.warn("Gemini failed, trying Groq...", geminiError);

      try {
        text = await callGroq(systemPrompt, messages);
        usedModel = "groq";
      } catch (groqError) {
        console.error("Both APIs failed:", groqError);
        throw new Error("Both Gemini and Groq failed");
      }
    }

    const usage = await incrementServerAiUsage(usageState);
    const latestUser = [...messages].reverse().find((m: { role: string; content: string }) => m.role === "user")?.content ?? "";
    const sources = detectIntentSources({
      messages,
      hasChart: Boolean(chartContext),
      hasTransit: Boolean(transitContext),
      hasDailyFeed: Boolean(dailyFeedContext),
    });
    const sourceMeta = sources.map((source) => ({
      source,
      ...buildSourceConfidence({ source, latestUser }),
    }));

    return NextResponse.json({
      message: text,
      agent: agent.name,
      emoji: agent.emoji,
      model: usedModel,
      sources,
      sourceMeta,
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
