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
    system: `You are AstroLife AI — India's most advanced Vedic astrology assistant. Combine Vedic, Lal Kitab, KP, Nadi, Transit analysis. Be warm, insightful, personalized, and detailed. Use ✦ bullets and short explanatory sections. Aim for 500-800 words, with clear insight, key placements, and practical guidance. End with a follow-up question.`,
  },
  career: {
    name: "Career Agent", emoji: "📈",
    system: `You are AstroLife Career Agent. Focus: 10th house, D-10, Saturn, Sun, Mercury, career dashas. Analyze profession yogas, timing peaks, business vs job, and how the chart supports long-term career direction. Professional, strategic, and detailed. Use ✦ bullets and short sections. Aim for 500-800 words.`,
  },
  marriage: {
    name: "Marriage Agent", emoji: "💑",
    system: `You are AstroLife Marriage Agent using the AstroLife Marriage Trigger Engine. Focus: D1/D9 promise, 7th house, Venus, Jupiter, KP 2-7-11 validation, dasha activation and transit/event trigger windows. Do not attribute this to any external named marriage system. Analyze marriage timing, compatibility and relationship karma with empathy and practicality. Use ✦ bullets and short sections. Aim for 500-800 words.`,
  },
  karmic: {
    name: "Karmic Agent", emoji: "☯️",
    system: `You are AstroLife Karmic Intelligence Agent. Focus: Rahu-Ketu axis, past life karma, 12th house, Saturn karmas. Philosophical, spiritually illuminating, and detailed. Use ✦ bullets and short sections. Aim for 500-800 words.`,
  },
  wealth: {
    name: "Wealth Agent", emoji: "💰",
    system: `You are AstroLife Wealth Agent. Focus: 2nd, 11th house, Dhana yogas, Jupiter, Venus, Mercury transits. Practical, strategic, financially focused and detailed. Use ✦ bullets and short sections. Aim for 500-800 words.`,
  },
  health: {
    name: "Health Agent", emoji: "🌿",
    system: `You are AstroLife Medical Astrology Agent. Focus: 6th, 8th house, Saturn, Mars, Rahu/Ketu. Always add: consult a real doctor. Caring, holistic, and practical. Use ✦ bullets and short sections. Aim for 500-800 words.`,
  },
  psychology: {
    name: "Psychology Agent", emoji: "🧠",
    system: `You are AstroLife Psychology Agent. Focus: Moon sign, nakshatra, Mercury, 4th house. Analyze emotional patterns, mental strengths, and inner tendencies with empathy. Compassionate, therapeutic, and detailed. Use ✦ bullets and short sections. Aim for 500-800 words.`,
  },
  remedy: {
    name: "Remedy Agent", emoji: "🕯️",
    system: `You are AstroLife Vedic Remedy Agent. Specialize: mantras, gemstones, charity, rituals, fasting. Affordable, actionable, and practical. Use ✦ bullets and short sections. Aim for 500-800 words.`,
  },
  lalkitab: {
    name: "Lal Kitab Agent", emoji: "📕",
    system: `You are AstroLife Lal Kitab Specialist. Focus: house-wise planets, SP Bhagat remedies, donation timings, and daily practices. Practical, action-oriented, and detailed. Use ✦ bullets and short sections. Aim for 500-800 words.`,
  },
  spiritual: {
    name: "Spiritual Agent", emoji: "🙏",
    system: `You are AstroLife Spiritual Growth Agent. Focus: dharma (9th), moksha (12th), guru yoga, Jupiter/Ketu transits. Deeply spiritual, compassionate, and detailed. Use ✦ bullets and short sections. Aim for 500-800 words.`,
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

function parseApiKeys(rawValue: string | undefined): string[] {
  if (!rawValue) return [];

  return [...new Set(
    String(rawValue)
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean),
  )];
}

function collectApiKeysFromEnv(prefix: string): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 12; i++) {
    const value = process.env[`${prefix}_${i}`] ?? process.env[`${prefix}${i}`];
    if (value) keys.push(...parseApiKeys(value));
  }
  return keys;
}

function getGeminiApiKeys(): string[] {
  return [...new Set([
    ...parseApiKeys(process.env.GEMINI_API_KEYS),
    ...parseApiKeys(process.env.GEMINI_API_KEY),
    ...collectApiKeysFromEnv("GEMINI_API_KEY"),
  ])];
}

function ensureCompleteResponse(rawText: string): string {
  let text = rawText.trim();
  if (!text) return text;

  // Terminal characters that signify a complete sentence or thought
  const validTerminals = new Set([".", "?", "!", "।", '"', "'", "”", "’", "*", "\n"]);
  const lastChar = text.slice(-1);

  if (!validTerminals.has(lastChar)) {
    // Look for the last proper sentence terminator
    const punctPeriod = text.lastIndexOf(".");
    const punctHindi = text.lastIndexOf("।");
    const punctExcl = text.lastIndexOf("!");
    const punctQ = text.lastIndexOf("?");
    const bestPunct = Math.max(punctPeriod, punctHindi, punctExcl, punctQ);

    // If there is a clean sentence ending in the latter 70% of the message, trim trailing incomplete fragment
    if (bestPunct > text.length * 0.7) {
      text = text.slice(0, bestPunct + 1).trim();
    } else {
      // Otherwise cleanly append a period
      text = text + ".";
    }
  }

  return text;
}

async function callGemini(system: string, messages: { role: string; content: string }[]): Promise<string> {
  const apiKeys = getGeminiApiKeys();
  if (apiKeys.length === 0) throw new Error("Missing GEMINI_API_KEY / GEMINI_API_KEYS");

  let lastError: unknown = null;

  for (const apiKey of apiKeys) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
      const res = await fetchWithTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
          generationConfig: { temperature: 0.75, maxOutputTokens: 4000 },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        lastError = new Error(data.error?.message || "Gemini error");
        const retryable = [400, 401, 403, 429, 500, 503].includes(res.status);
        if (retryable && apiKeys.length > 1) {
          continue;
        }
        if (!retryable) throw lastError;
        throw lastError;
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return ensureCompleteResponse(text);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Gemini unavailable");
}


function getGroqApiKeys(): string[] {
  return [...new Set([
    ...parseApiKeys(process.env.GROQ_API_KEYS),
    ...parseApiKeys(process.env.GROQ_API_KEY),
    ...collectApiKeysFromEnv("GROQ_API_KEY"),
  ])];
}

function buildOfflineAstrologyFallback(agent: { name: string; emoji: string; system: string }, userQuestion: string, chartContext?: string, transitContext?: string, dailyFeedContext?: string): string {
  const chartSummary = chartContext ? chartContext.split(/\n+/).slice(0, 6).join("\n") : "Chart context not available yet.";
  const transitSummary = transitContext ? transitContext.split(/\n+/).slice(0, 4).join("\n") : "Transit context not yet loaded.";
  const query = userQuestion.trim() || "aapka kundli analysis";

  return [
    `${agent.emoji} ${agent.name} se brief insight`,
    "",
    `Aapka sawaal hai: "${query}". Is waqt AI provider temporary unavailable hai, lekin main aapko ek solid, structured astrology read deta hoon jo chart-based reasoning ke hisaab se useful hai.`,
    "",
    "✦ Core reading:",
    "- Aapka chart aur life pattern dikhata hai ki aapko decision-making, patience, aur inner clarity ke prati ek strong focus hai.",
    "- Agar aapke chart mein 7th house, Venus, Jupiter, Saturn ya Rahu-Ketu axis strong hai, toh relationships aur timing ke liye deep karmic pattern visible hota hai.",
    "- Aapke question ke basis par, sabse important baat yeh hai ki aapko apni life ke decision ko forced nahi, strategic aur calm approach se lena chahiye.",
    "",
    "✦ Key placements and pattern:",
    chartSummary.length > 0 ? `- Chart context: ${chartSummary}` : "- Chart context: Abhi detailed chart not available." ,
    transitSummary.length > 0 ? `- Current transit: ${transitSummary}` : "- Current transit: Abhi transit summary pending.",
    "- Agar 10th/7th house aur relevant dasha trigger active hain, toh career aur relationship dono field mein timing ka focus strong rahega.",
    "- Rahu-Ketu axis ko samajhna zaroori hai: kabhi it creates restlessness, kabhi growth. Energy ko discipline ke saath channelize karna important hai.",
    "",
    "✦ Timing guidance:",
    "- Jab dasha-antardasha aur transits saath milte hain, tab decisiveness aur commitment ka bahut bada effect hota hai.",
    "- Best window usually tab hota hai jab aap clear intent ke saath action lete ho, na ki impulsive pressure mein.",
    "- Relationship aur career dono ke liye patience aur purity important hai. Har result ko haste haste judge mat karo.",
    "",
    "✦ Practical steps:",
    "- Rozana 10-15 minutes meditation ya mantra chanting se mental clarity increase hogi.",
    "- Decision lene se pehle 48 ghante ka calm period rakho; emotion aur urgency ko alag karo.",
    "- Jo vastu ya log aapko drift kar rahe hain, unse distance rakho; only aligned actions follow through karo.",
    "- Agar kisi important relationship ya career move ke liye clarity chahiye, to chart-based event timing verify karna useful rahega.",
    "",
    "✦ Final insight:",
    "Aapka life path abhi ek transition stage mein hai. Intelligence aur inner discipline ka use karoge to aap stronger, calmer aur clearer decisions le paoge. Long-term growth aapke liye bigger hai than short-term urgency.",
    "",
    `${agent.emoji} ${agent.name} conclusion: Prakriti aur timing dono ko respect karke, aapko routine, patience, aur intention se kaam lena chahiye. Agar aap exact birth-chart analysis chahte ho, toh valid API key / fresh chart data se full AI report aayega.`,
  ].join("\n");
}

const GROQ_MODELS = [
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
];

async function callGroq(system: string, messages: { role: string; content: string }[]): Promise<string> {
  const apiKeys = getGroqApiKeys();
  if (apiKeys.length === 0) throw new Error("Missing GROQ_API_KEY / GROQ_API_KEYS");

  let lastError: unknown = null;

  for (const apiKey of apiKeys) {
    for (const model of GROQ_MODELS) {
      try {
        const res = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model,
            messages: [{ role: "system", content: system }, ...messages],
            max_tokens: 3500,
            temperature: 0.75,
          }),
        }, 14_000);

        const data = await res.json();
        if (!res.ok) {
          lastError = new Error(data.error?.message || "Groq error");
          // If model doesn't exist, try next model in loop
          continue;
        }

        const rawContent = data.choices?.[0]?.message?.content || "";
        if (rawContent) {
          return ensureCompleteResponse(rawContent);
        }
      } catch (error) {
        lastError = error;
      }
    }
  }

  throw lastError || new Error("Groq unavailable");
}


import fs from "fs/promises";
import path from "path";

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

async function saveQuestionToDisk(userId: string | null, agentId: string, question: string) {
  try {
    const base = path.join(process.cwd(), "data", "questions");
    await fs.mkdir(base, { recursive: true });
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const file = path.join(base, `${date}.ndjson`);
    const entry = {
      ts: new Date().toISOString(),
      userId: userId ?? null,
      agentId,
      question,
    };
    await fs.appendFile(file, JSON.stringify(entry) + "\n", { encoding: "utf8" });
  } catch (e) {
    // Non-fatal — log and continue
    console.error("saveQuestionToDisk error:", e);
  }
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
      `\nStyle: Premium Hinglish. Use structured sections with clear insight, key placements, and practical guidance. Aim for 450-650 words. Use ✦ bullets and short paragraphs. IMPORTANT: Ensure every sentence is 100% complete and never stop mid-sentence. Always provide full self-contained answers with a closing blessing or follow-up question. Sign off as: "${agent.emoji} ${agent.name}"`,
    ].join("");


    const systemPrompt = await buildUnifiedAstroLifeChatPrompt({
      existingPrompt: existingSystemPrompt,
      palmSessionId,
      userId: body.userId ?? null,
      includeRawEngineContext: false,
    });

    // Try Gemini first, fallback to Groq, then use graceful offline astrology answer.
    let text = "";
    let model = "gemini";
    try {
      text = await callGemini(systemPrompt, messages);
    } catch (e) {
      const geminiError = e instanceof Error ? e.message : String(e);
      monitor.warn("ai_chat.gemini_failed_groq_fallback", {
        agentId,
        errorName: e instanceof Error ? e.name : undefined,
        errorMessage: geminiError,
      });

      try {
        text = await callGroq(systemPrompt, messages);
        model = "groq";
      } catch (groqError) {
        monitor.warn("ai_chat.providers_unavailable_fallback", {
          agentId,
          geminiError,
          groqError: groqError instanceof Error ? groqError.message : String(groqError),
        });

        const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
        text = buildOfflineAstrologyFallback(agent, lastUserMsg?.content ?? "Aapka kundli analysis", chartContext, transitContext, dailyFeedContext);
        model = "offline-fallback";
      }
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
      // Write to disk for engagement analysis (non-blocking — errors logged inside)
      saveQuestionToDisk(body.userId ?? null, agentId, lastUserMsg.content).catch(() => {});
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
