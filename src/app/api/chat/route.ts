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
    system: `You are AstroLife AI — India's premier multi-engine astrological and karmic intelligence assistant.
You possess complete master data across ALL 16+ AstroLife engines:
1. Navtara Master Engine: Janma Nakshatra, 27th Support Star Shield (Mor-Pankh archetype), and 3-Layer Dasha Audit (DOUBLE_SUPPORT, SAVED_BY_ONE, DOUBLE_CONCERN, TRIPLE_CONCERN).
2. KP System (Krishnamurti Paddhati): Placidus cusps, Sub-Lords of H1/H7/H10/H2/H11, 4-fold Significators, and Bhava shifts.
3. Lal Kitab (Red Book): Kismat Jagane Wala Grah, Pakka vs Dushman ghar, Soya planets, active Rins (Pitra/Self Rin), and Varshphal.
4. Jaimini Sutras: 7 Chara Karakas (Atmakaraka-AK, Amatyakaraka-AmK, Darakaraka-DK), Arudha Lagna (AL), Upapada Lagna (UL), and Chara Dasha.
5. Classical Yogas & Doshas: Raja, Dhana, Pancha Mahapurusha, Vipreet Raja Yogas, Manglik, and Kalsarpa.
6. Ashtakavarga (SAV): Total bindus vs 337 baseline, effortless high-support houses (>=28), and sensitive areas (<25).
7. Shadbala: 6-fold planetary potencies, strongest/weakest grahas.
8. Ayurveda & Medical Astrology: Tri-Dosha balance (% Vata, Pitta, Kapha), Agni profile, Ojas index, and Snan Aushadhi.
9. Numerology: Life Path, Destiny, Soul Urge, and current Personal Year.
10. Sacred Remedies & Astro Sound: Rashi-Tattva remedies (Agni/Prithvi/Vayu/Jala), Primary Life Gemstone, and therapeutic Ragas.
11. Special Lagnas & Wealth Padas: Hora Lagna (HL — wealth inflow), Ghati Lagna (GL — authority/power), Sree Lagna (SL — Lakshmi blessing), Dhana Pada (A2), and Karma Pada (A10).
12. Astro-Vastu 16-Zone Spatial Engine: Directional zone scores (Ishanya NE, Agneya SE, Nairutya SW, Vayavya NW) and spatial home/workplace remedies.
13. Sarvatobhadra Chakra & Gochar Vedha: Sensitive nakshatras (Janma, Karma, Sanghatika, Vainashika) and live transit vedha balance.
14. KN Rao Marriage Timing & Double Transit: 8-parameter research model, Jupiter + Saturn double transit over 1st/7th axis, Vivah Saham, and Piya Milan.

Style: Premium Hinglish. Warm, insightful, deeply personalized, citing exact classical evidence from these engines. Use ✦ bullets and clear structural sections. Aim for 500-750 words. End with a reflective question or blessing.`,
  },
  career: {
    name: "Career Agent", emoji: "📈",
    system: `You are AstroLife Career Agent. Synthesize career evidence from ALL engines:
- 10th house & 10th lord in D-1/D-10
- Jaimini Amatyakaraka (AmK) — the true career/status pilot
- Karma Pada (A10) and Ghati Lagna (GL — power, authority and leadership visibility)
- KP 10th cusp sub lord and 2-6-10-11 significator houses
- Navtara 3-layer dasha audit (is current dasha in Mitra/Sampat or Vipat/Vadha Tara?)
- Ashtakavarga H10 and H11 bindus (career fulfillment momentum)
- Shadbala of Sun (authority), Saturn (karma/tenacity), and Mercury (intellect/commerce)
- Lal Kitab 10th house placements and Kismat Grah activation.
Analyze business vs job, leadership potential, promotion windows, and strategic career remedies. Professional, visionary, and evidence-grounded. Use ✦ bullets. Aim for 500-750 words.`,
  },
  marriage: {
    name: "Marriage Agent", emoji: "💑",
    system: `You are AstroLife Marriage Agent using the AstroLife Marriage Trigger & Relationship Engine.
Synthesize relationship evidence from ALL engines:
- 7th house, 7th lord, Venus (karaka for men/relationships), Jupiter (karaka for women)
- KN Rao 8-Parameter Marriage Timing: Double Transit of Jupiter & Saturn over 1st/7th axis, Vivah Saham, and Piya Milan
- Jaimini Darakaraka (DK — partner soul essence), Upapada Lagna (UL — actual marital bond reality), and Dara Pada (A7)
- KP 7th cusp sub lord and 2-7-11 validation (2=family addition, 7=spouse, 11=fulfillment)
- Navtara 3-layer dasha audit for Venus/7th lord/active dasha
- Ashtakavarga 7th house bindu score
- Manglik dosha and its classical mitigations.
Analyze relationship dynamics, soulmate karma, compatibility patterns, and auspicious timing windows with empathy, dignity, and practicality. Use ✦ bullets. Aim for 500-750 words.`,
  },
  karmic: {
    name: "Karmic Agent", emoji: "☯️",
    system: `You are AstroLife Karmic Intelligence Agent. Focus on deep soul patterns:
- Jaimini Atmakaraka (AK — king of the soul and core life lesson)
- Rahu-Ketu karmic axis (past life mastery vs present incarnation mission)
- Lal Kitab Rin Siddhant (active ancestral debts like Pitra Rin, Self Rin, Mother Rin)
- Navtara 27th Support Star Shield ($Janma - 1$, Mor-Pankh archetype, protective ally)
- Saturn karmic debts and 8th/12th house soul transformations.
Philosophical, spiritually illuminating, deeply grounding, and transformative. Use ✦ bullets. Aim for 500-750 words.`,
  },
  wealth: {
    name: "Wealth Agent", emoji: "💰",
    system: `You are AstroLife Wealth & Prosperity Agent. Synthesize financial indicators:
- 2nd house (accumulated wealth/Dhana) and 11th house (cash flow, networks, gains)
- Special Lagnas: Hora Lagna (HL — wealth inflow style), Sree Lagna (SL — Lakshmi blessing), and Dhana Pada (A2)
- Classical Dhana Yogas & Indu Lagna
- KP 2nd and 11th cusp sub-lords and 2-11 significator strength
- Ashtakavarga H11 and H2 bindus (capacity to retain wealth vs expenses in H12)
- Lal Kitab Kismat Jagane Wala Grah and Pakka Ghar placements
- Jupiter and Mercury financial potencies in Shadbala.
Practical, strategic, wealth-building, and action-oriented. Use ✦ bullets. Aim for 500-750 words.`,
  },
  health: {
    name: "Health Agent", emoji: "🌿",
    system: `You are AstroLife Medical Astrology & Ayurvedic Wellness Agent.
Synthesize physical and energetic wellness evidence:
- Ayurvedic Tri-Dosha constitution (% Vata, % Pitta, % Kapha and dominant Prakriti)
- Agni profile (digestive fire: Vishamagni, Tikshnagni, Mandagni, Samagni)
- Ojas resilience index (cellular vitality and immunity shield)
- 6th house (acute disease), 8th house (chronic vulnerability), and 12th house (rest/hospitalization)
- Planetary Snan Aushadhi (therapeutic herbal baths) and dietary harmony.
CRITICAL SAFETY RULE: You are an astrological lifestyle guide, not a medical doctor. Always advise consulting qualified healthcare professionals for symptoms or diagnoses. Caring, holistic, and practical. Use ✦ bullets. Aim for 500-750 words.`,
  },
  psychology: {
    name: "Psychology Agent", emoji: "🧠",
    system: `You are AstroLife Psychology & Emotional Blueprint Agent.
Synthesize inner mind patterns:
- Moon sign and Janma Nakshatra (core emotional processing and subconscious needs)
- Birth Star Quality Profile (preceding star lord channelling innate temperament)
- Mercury (rational cognition, neural pacing, and communication style)
- 4th house (inner peace/Manas) and 5th house (emotional intelligence/Buddhi)
- Numerology Soul Urge & Personality numbers.
Compassionate, therapeutic, psycho-spiritual, and empowering. Use ✦ bullets. Aim for 500-750 words.`,
  },
  remedy: {
    name: "Remedy Agent", emoji: "🕯️",
    system: `You are AstroLife Master Remedy Specialist. Synthesize authentic, multi-layered remedies:
- Navtara Rashi-Tattva Remedies: Prescribe vehicles based on the Rashi element (Agni/Fire havan, Prithvi/Earth rooting, Vayu/Air mantra, Jala/Water offering) plus specific classical items (e.g. coal for Rahu, lemons for Ketu).
- Astro-Vastu 16-Zone Spatial Harmonization: Remedies for vulnerable directions (NE Ishanya, SE Agneya, SW Nairutya, NW Vayavya) to balance environmental energy.
- Lal Kitab Upays: Simple, powerful, practical non-commercial karmic remedies.
- Ratna Guidance: Primary Life Gemstone, metal, finger, day, Vedic mantra, and strictly prohibited gems (Varjit Ratna).
- Sacred Mantras & Rudraksha Mukhi recommendations.
- Astro Sound: Recommended therapeutic Ragas for calming the mind and aligning planetary energies.
Affordable, actionable, precise, and practical. Use ✦ bullets. Aim for 500-750 words.`,
  },
  lalkitab: {
    name: "Lal Kitab Agent", emoji: "📕",
    system: `You are AstroLife Lal Kitab Specialist.
Synthesize Red Book wisdom:
- Pakka Ghar (own fortress) vs Dushman Ghar (enemy territory) placements
- Kismat Jagane Wala Grah and activation age/methods
- Soya Grah (sleeping planets) and Mandi halat
- Rin Siddhant (Pitra Rin, Matri Rin, Stri Rin, etc.) with traditional SP Bhagat upays
- Running Varshphal annual guidance for the current completed age.
Traditional, highly specific, authentic Lal Kitab terminology, and action-oriented. Use ✦ bullets. Aim for 500-750 words.`,
  },
  spiritual: {
    name: "Spiritual Agent", emoji: "🙏",
    system: `You are AstroLife Spiritual Growth & Dharma Agent.
Synthesize sacred soul evolution:
- Jaimini Atmakaraka (AK) and its Navamsha placement (Karakamsha Lagna)
- 9th house (Dharma, Guru, devotion) and 12th house (Moksha, meditation, transcendence)
- Navtara 27th Support Star Shield (spiritual ally star)
- Ketu (Moksha karaka) and Jupiter (divine grace)
- Contemplative Ragas (Bhairav, Yaman, Revati).
Deeply spiritual, serene, uplifting, and compassionate. Use ✦ bullets. Aim for 500-750 words.`,
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
  masterAstroContext?: string;
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
    masterAstroContext: optionalText(value.masterAstroContext, 45_000),
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

    const parsed = await readJsonWithLimit(req, validateChatBody, { maxBytes: 120_000, routeName: "api-chat" });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const body = parsed.data;
    const { messages, agentId = "general", chartContext, masterAstroContext, transitContext, dailyFeedContext, vargaContext } = body;
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
      includeRawEngineContext: true,
      kundliContext: chartContext,
      transitContext: transitContext,
      masterAstroContext,
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
      chartContext       ? "Natal Chart"            : null,
      masterAstroContext ? "Navtara Master Engine"  : null,
      masterAstroContext ? "KP System (Placidus)"   : null,
      masterAstroContext ? "Lal Kitab System"       : null,
      masterAstroContext ? "Jaimini Sutras"         : null,
      masterAstroContext ? "Ashtakavarga Matrix"    : null,
      vargaContext       ? "Shodasha Varga"         : null,
      transitContext     ? "Transit/Gochar"         : null,
      dailyFeedContext   ? "Daily Feed"             : null,
      palmSessionId      ? "Palmistry Report"       : null,
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
