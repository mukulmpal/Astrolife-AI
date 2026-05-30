// ── AstroLife Palmistry AI Engine ─────────────────────────────
// Classical (K.N. Rao / Samudrika Shastra) palm analysis from an
// uploaded image, structured for a premium report UI.

export const PALM_LINES = [
  { id: "heart",   name: "Heart Line",   sanskrit: "Hridaya Rekha",   color: "#ef4444" },
  { id: "head",    name: "Head Line",    sanskrit: "Mastishk Rekha",  color: "#60a5fa" },
  { id: "life",    name: "Life Line",    sanskrit: "Ayu Rekha",       color: "#22c55e" },
  { id: "fate",    name: "Fate Line",    sanskrit: "Bhagya Rekha",    color: "#c8a030" },
  { id: "sun",     name: "Sun Line",     sanskrit: "Surya Rekha",     color: "#a855f7" },
  { id: "mercury", name: "Mercury Line", sanskrit: "Budh Rekha",      color: "#2dd4bf" },
] as const;

export type PalmLineId = (typeof PALM_LINES)[number]["id"];

export const PALM_MOUNTS = [
  { id: "jupiter",   name: "Mount of Jupiter" },
  { id: "saturn",    name: "Mount of Saturn" },
  { id: "sun",       name: "Mount of Sun / Apollo" },
  { id: "mercury",   name: "Mount of Mercury" },
  { id: "venus",     name: "Mount of Venus" },
  { id: "moon",      name: "Mount of Moon" },
  { id: "upperMars", name: "Upper Mars" },
  { id: "lowerMars", name: "Lower Mars" },
] as const;

export type PalmMountId = (typeof PALM_MOUNTS)[number]["id"];

// ── Report shape ──────────────────────────────────────────────
export interface PalmLineReading {
  id: PalmLineId;
  name: string;
  sanskrit: string;
  color: string;
  confidence: number;      // 0-100
  summary: string;         // one-line
  detail: string;          // 2-3 sentences
}

export interface MountReading {
  id: PalmMountId;
  name: string;
  score: number;           // 0-100
  keywords: string;        // "ambition, leadership, confidence"
  summary: string;
}

export interface FingerReading {
  id: string;
  name: string;            // "Index Finger / Jupiter"
  planet: string;
  keywords: string[];
  summary: string;
}

export interface PredictionCard {
  id: string;
  title: string;
  summary: string;
  strength: number;        // 0-100
  opportunities: string[];
  warnings: string[];
  aiInsight: string;
}

export interface TimelinePhase {
  range: string;           // "28-35 Years"
  title: string;
  summary: string;
}

export interface AdvancedInsight {
  title: string;
  body: string;
}

export interface MetricScore {
  label: string;
  value: number;           // 0-100
}

export interface PalmGeometryProfile {
  handType: string;
  palmShape: string;
  fingerProportion: string;
  thumbAngle: string;
  palmWidth: string;
  palmLength: string;
  confidence: number;
  reasoning: string;
}

export interface PalmIntelligenceSection {
  id: string;
  title: string;
  score: number;
  confidence: number;
  reasoning: string;
  interpretation: string;
  recommendation: string;
  signals: string[];
}

export interface AstroSoundPalmRecommendation {
  title: string;
  ragas: string[];
  reason: string;
  practice: string;
}

export interface LuckProfile {
  numbers: number[];
  days: string[];
  colors: string[];
  gemstones: string[];
  directions: string[];
  careerFields: string[];
}

export interface PalmistryReport {
  meta: {
    hand: "right" | "left" | "unknown";
    imageQuality: "high" | "medium" | "low";
    disclaimer: string;
  };
  overallImpression: {
    headline: string;
    summary: string;
    metrics: MetricScore[];
  };
  lines: PalmLineReading[];
  mounts: MountReading[];
  fingers: FingerReading[];
  predictions: PredictionCard[];
  timeline: TimelinePhase[];
  luck: LuckProfile;
  scoreboard: MetricScore[];
  advancedInsights: AdvancedInsight[];
  palmGeometry: PalmGeometryProfile;
  intelligenceSections: PalmIntelligenceSection[];
  astroSoundRecommendations: AstroSoundPalmRecommendation[];
  growthPlan: string[];
  palmKundliCorrelation: {
    alignmentScore: number;
    confidence: number;
    summary: string;
    matches: string[];
    gaps: string[];
  };
  finalIntelligenceScore: {
    score: number;
    confidence: number;
    summary: string;
  };
}

export interface BirthContext {
  name?: string;
  dob?: string;
  tob?: string;
  city?: string;
}

const DISCLAIMER =
  "Palmistry is a traditional art for self-reflection and guidance, not a deterministic prediction. Use these insights as perspective, not certainty.";

// ── Prompt builder ────────────────────────────────────────────
export function buildPalmistryPrompt(birth?: BirthContext): string {
  const birthBlock =
    birth && (birth.name || birth.dob)
      ? `\nThe seeker's birth details (use ONLY to enrich the "AI Palm + Birth Chart Correlation" advanced insight; do not fabricate a full kundli): name=${birth.name || "-"}, dob=${birth.dob || "-"}, tob=${birth.tob || "-"}, place=${birth.city || "-"}.`
      : "";

  return `You are AstroLife's AI Palm Intelligence Engine — a world-class palmistry researcher, Samudrika Shastra expert, behavioral psychology analyst, product-grade report writer, and computer vision interpreter.

You will be shown a photograph of a human palm. Analyse the lines, mounts, fingers, and overall hand shape that you can actually observe. Where a feature is unclear in the image, infer the most probable reading and lower its confidence accordingly — never refuse.

Core philosophy:
- Palm is pattern recognition, not fixed prediction.
- Use probability, confidence, reasoning and practical recommendations.
- Never claim absolute certainty.
- Do not diagnose disease, give legal/financial certainty, or predict exact marriage dates.
- Make the report feel like Apple Health + Bloomberg Intelligence + luxury wealth management, not a generic fortune-telling note.

Cover all modules:
- Lines: Heart (Hridaya), Head (Mastishk), Life (Ayu), Fate (Bhagya), Sun (Surya), Mercury (Budh)
- Mounts: Jupiter, Saturn, Sun/Apollo, Mercury, Venus, Moon, Upper Mars, Lower Mars
- Fingers: Index/Jupiter, Middle/Saturn, Ring/Sun, Little/Mercury, Thumb
- Palm geometry: hand type, palm shape, finger proportions, thumb angle, palm width/length
- Personality architecture, career, relationship, vitality, wealth, timeline, karmic marks, marriage tendency, foreign/travel indicators, entrepreneurship, spirituality, AI remedies, AstroSound, and Palm + Kundli correlation${birthBlock}

LANGUAGE: Premium Hinglish/English mix, mostly English, concise but descriptive. Confident, calm, practical, luxury intelligence tone. No fear language. No disclaimers inside the fields.

Every major insight must include: score, confidence, reasoning, interpretation, recommendation.

Respond with ONLY a JSON object (no markdown, no code fences) matching EXACTLY this TypeScript shape:

{
  "meta": { "hand": "right" | "left" | "unknown", "imageQuality": "high" | "medium" | "low" },
  "palmGeometry": {
    "handType": string,
    "palmShape": string,
    "fingerProportion": string,
    "thumbAngle": string,
    "palmWidth": string,
    "palmLength": string,
    "confidence": number,
    "reasoning": string
  },
  "overallImpression": {
    "headline": string,                       // short, e.g. "Self-made leader with deep emotional core"
    "summary": string,                        // 2-3 sentence Hinglish overview
    "metrics": [ { "label": string, "value": number } ]   // 4 items, value 0-100, e.g. Emotional Depth, Practical Intelligence, Resilience, Self-Made Success
  },
  "lines": [
    { "id": "heart"|"head"|"life"|"fate"|"sun"|"mercury", "confidence": number, "summary": string, "detail": string }
  ],                                          // all 6 lines, confidence 0-100
  "mounts": [
    { "id": "jupiter"|"saturn"|"sun"|"mercury"|"venus"|"moon"|"upperMars"|"lowerMars", "score": number, "keywords": string, "summary": string }
  ],                                          // all 8 mounts, score 0-100
  "fingers": [
    { "id": string, "name": string, "planet": string, "keywords": [string], "summary": string }
  ],                                          // 5 fingers incl. thumb
  "predictions": [
    { "id": string, "title": string, "summary": string, "strength": number, "opportunities": [string], "warnings": [string], "aiInsight": string }
  ],                                          // exactly 5: Career & Finance, Love & Relationships, Health & Vitality, Personality Traits, Life Purpose
  "timeline": [
    { "range": string, "title": string, "summary": string }
  ],                                          // 5 phases: 0-20, 20-28, 28-35, 35-50, 50+ years
  "luck": {
    "numbers": [number], "days": [string], "colors": [string],
    "gemstones": [string], "directions": [string], "careerFields": [string]
  },
  "scoreboard": [ { "label": string, "value": number } ],   // 7 items: Leadership, Business, Creativity, Relationship, Health, Wealth, Spiritual
  "advancedInsights": [ { "title": string, "body": string } ]   // 8-12 items: Palm + Birth Chart Correlation, Karmic Indicators, Wealth Indicators, Marriage Indicators, Foreign Settlement, Entrepreneurship, Spiritual Awakening, Health Risk Zones, AI Remedies, AstroSound Recommendation
  ,
  "intelligenceSections": [
    {
      "id": string,
      "title": string,
      "score": number,
      "confidence": number,
      "reasoning": string,
      "interpretation": string,
      "recommendation": string,
      "signals": [string]
    }
  ], // exactly 15 module sections: personality, career, relationship, vitality, wealth, timeline, karmic, marriage, foreign, entrepreneurship, spiritual, palm_kundli, astrosound, ai_remedy, final_score
  "astroSoundRecommendations": [
    { "title": string, "ragas": [string], "reason": string, "practice": string }
  ],
  "growthPlan": [string],
  "palmKundliCorrelation": {
    "alignmentScore": number,
    "confidence": number,
    "summary": string,
    "matches": [string],
    "gaps": [string]
  },
  "finalIntelligenceScore": {
    "score": number,
    "confidence": number,
    "summary": string
  }
}

Return realistic, specific, varied numbers grounded in what the palm shows. Output ONLY the JSON.`;
}

// ── Defensive parsing ─────────────────────────────────────────
function clampScore(n: unknown, fallback = 75): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function strArr(v: unknown, fallback: string[] = []): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean);
  if (typeof v === "string" && v.trim()) return v.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  return fallback;
}

function numArr(v: unknown, fallback: number[] = []): number[] {
  if (Array.isArray(v)) return v.map((x) => Number(x)).filter((n) => Number.isFinite(n));
  return fallback;
}

function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

function asArr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

const FINGER_FALLBACK = [
  { id: "jupiter", name: "Index Finger / Jupiter", planet: "Jupiter", keywords: ["Leadership", "Ambition", "Confidence"] },
  { id: "saturn", name: "Middle Finger / Saturn", planet: "Saturn", keywords: ["Discipline", "Responsibility", "Wisdom"] },
  { id: "sun", name: "Ring Finger / Sun", planet: "Sun", keywords: ["Creativity", "Fame", "Recognition"] },
  { id: "mercury", name: "Little Finger / Mercury", planet: "Mercury", keywords: ["Communication", "Business", "Intelligence"] },
  { id: "thumb", name: "Thumb", planet: "Mars/Will", keywords: ["Willpower", "Logic", "Independence"] },
];

const PREDICTION_FALLBACK = [
  { id: "career", title: "Career & Finance" },
  { id: "love", title: "Love & Relationships" },
  { id: "health", title: "Health & Vitality" },
  { id: "personality", title: "Personality Traits" },
  { id: "purpose", title: "Life Purpose" },
];

const TIMELINE_RANGES = ["0–20 Years", "20–28 Years", "28–35 Years", "35–50 Years", "50+ Years"];
const INTELLIGENCE_FALLBACK = [
  { id: "personality", title: "Personality Blueprint", score: 82, confidence: 76 },
  { id: "career", title: "Career Blueprint", score: 80, confidence: 74 },
  { id: "relationship", title: "Relationship Blueprint", score: 78, confidence: 72 },
  { id: "vitality", title: "Health & Vitality", score: 76, confidence: 70 },
  { id: "wealth", title: "Wealth Intelligence", score: 79, confidence: 72 },
  { id: "timeline", title: "Life Timeline", score: 77, confidence: 68 },
  { id: "karmic", title: "Karmic Indicators", score: 75, confidence: 66 },
  { id: "marriage", title: "Marriage Indicators", score: 76, confidence: 68 },
  { id: "foreign", title: "Foreign Settlement Indicators", score: 72, confidence: 64 },
  { id: "entrepreneurship", title: "Entrepreneurship Potential", score: 81, confidence: 74 },
  { id: "spiritual", title: "Spiritual Intelligence", score: 78, confidence: 70 },
  { id: "palm_kundli", title: "Palm + Kundli Correlation", score: 74, confidence: 62 },
  { id: "astrosound", title: "AstroSound Recommendations", score: 78, confidence: 70 },
  { id: "ai_remedy", title: "AI Growth Remedies", score: 82, confidence: 78 },
  { id: "final_score", title: "Final AI Intelligence Score", score: 80, confidence: 72 },
];

export function parsePalmistryReport(raw: unknown): PalmistryReport {
  const r = asObj(raw);

  // Lines — guarantee all 6 in canonical order
  const lineById = new Map<string, Record<string, unknown>>(
    asArr(r.lines).map((l) => [str(asObj(l).id), asObj(l)])
  );
  const lines: PalmLineReading[] = PALM_LINES.map((def) => {
    const l = lineById.get(def.id) ?? {};
    return {
      id: def.id,
      name: def.name,
      sanskrit: def.sanskrit,
      color: def.color,
      confidence: clampScore(l.confidence, 80),
      summary: str(l.summary, `${def.name} reading pending clearer image.`),
      detail: str(l.detail, str(l.summary, "")),
    };
  });

  // Mounts — guarantee all 8
  const mountById = new Map<string, Record<string, unknown>>(
    asArr(r.mounts).map((m) => [str(asObj(m).id), asObj(m)])
  );
  const mounts: MountReading[] = PALM_MOUNTS.map((def) => {
    const m = mountById.get(def.id) ?? {};
    return {
      id: def.id,
      name: def.name,
      score: clampScore(m.score, 78),
      keywords: str(m.keywords, ""),
      summary: str(m.summary, ""),
    };
  });

  // Fingers
  const rawFingers = asArr(r.fingers);
  const fingerSource = rawFingers.length ? rawFingers : FINGER_FALLBACK;
  const fingers: FingerReading[] = fingerSource.map((raw, i) => {
    const f = asObj(raw);
    const fb = FINGER_FALLBACK[i] || FINGER_FALLBACK[0];
    return {
      id: str(f.id, fb.id),
      name: str(f.name, fb.name),
      planet: str(f.planet, fb.planet),
      keywords: strArr(f.keywords, fb.keywords),
      summary: str(f.summary, ""),
    };
  });

  // Predictions — guarantee 5 canonical
  const rawPred = asArr(r.predictions);
  const predictions: PredictionCard[] = PREDICTION_FALLBACK.map((def, i) => {
    const p = asObj(rawPred[i] ?? rawPred.find((x) => str(asObj(x).id) === def.id));
    return {
      id: def.id,
      title: str(p.title, def.title),
      summary: str(p.summary, ""),
      strength: clampScore(p.strength, 80),
      opportunities: strArr(p.opportunities),
      warnings: strArr(p.warnings),
      aiInsight: str(p.aiInsight, ""),
    };
  });

  // Timeline — guarantee 5 phases
  const rawTimeline = asArr(r.timeline);
  const timeline: TimelinePhase[] = TIMELINE_RANGES.map((range, i) => {
    const t = asObj(rawTimeline[i]);
    return {
      range: str(t.range, range),
      title: str(t.title, ""),
      summary: str(t.summary, ""),
    };
  });

  // Overall impression
  const oi = asObj(r.overallImpression);
  const metrics: MetricScore[] = asArr(oi.metrics).map((raw) => {
    const m = asObj(raw);
    return { label: str(m.label, "Trait"), value: clampScore(m.value, 80) };
  });

  // Scoreboard
  const scoreboard: MetricScore[] = asArr(r.scoreboard).map((raw) => {
    const s = asObj(raw);
    return { label: str(s.label, "Score"), value: clampScore(s.value, 80) };
  });

  // Luck
  const luckRaw = asObj(r.luck);
  const luck: LuckProfile = {
    numbers: numArr(luckRaw.numbers, [3, 5, 8]),
    days: strArr(luckRaw.days, ["Wednesday", "Friday", "Sunday"]),
    colors: strArr(luckRaw.colors, ["Gold", "Emerald", "Deep Blue"]),
    gemstones: strArr(luckRaw.gemstones, ["Yellow Sapphire", "Emerald", "Citrine"]),
    directions: strArr(luckRaw.directions, ["East", "North-East"]),
    careerFields: strArr(luckRaw.careerFields, ["Business", "Media", "Consulting"]),
  };

  // Advanced insights
  const advancedInsights: AdvancedInsight[] = asArr(r.advancedInsights)
    .map((raw) => { const a = asObj(raw); return { title: str(a.title), body: str(a.body) }; })
    .filter((a) => a.title && a.body);

  const geometryRaw = asObj(r.palmGeometry);
  const palmGeometry: PalmGeometryProfile = {
    handType: str(geometryRaw.handType, "Balanced practical-intuitive hand"),
    palmShape: str(geometryRaw.palmShape, "Moderate rectangular palm"),
    fingerProportion: str(geometryRaw.fingerProportion, "Balanced finger proportion"),
    thumbAngle: str(geometryRaw.thumbAngle, "Moderate open thumb angle"),
    palmWidth: str(geometryRaw.palmWidth, "Medium"),
    palmLength: str(geometryRaw.palmLength, "Medium"),
    confidence: clampScore(geometryRaw.confidence, 68),
    reasoning: str(geometryRaw.reasoning, "Geometry confidence is based on visible palm shape, finger proportions and thumb posture in the uploaded image."),
  };

  const sectionById = new Map<string, Record<string, unknown>>(
    asArr(r.intelligenceSections).map((section) => [str(asObj(section).id), asObj(section)])
  );
  const intelligenceSections: PalmIntelligenceSection[] = INTELLIGENCE_FALLBACK.map((def) => {
    const section = sectionById.get(def.id) ?? {};
    const score = clampScore(section.score, def.score);
    const confidence = clampScore(section.confidence, def.confidence);
    return {
      id: def.id,
      title: str(section.title, def.title),
      score,
      confidence,
      reasoning: str(section.reasoning, `This module blends visible palm structure, line clarity, mount strength and finger indicators. Confidence is ${confidence} because palm image analysis is probabilistic.`),
      interpretation: str(section.interpretation, `${def.title} appears moderately active. Treat this as a behavioral tendency, not a fixed outcome.`),
      recommendation: str(section.recommendation, "Use the strength consciously, keep decisions practical, and review this pattern after uploading a clearer palm image or future palm snapshot."),
      signals: strArr(section.signals, ["Line clarity", "Mount balance", "Finger proportion"]),
    };
  });

  const astroSoundRecommendations: AstroSoundPalmRecommendation[] = asArr(r.astroSoundRecommendations)
    .map((raw) => {
      const item = asObj(raw);
      return {
        title: str(item.title, "Balance & Focus"),
        ragas: strArr(item.ragas, ["Yaman", "Bhoopali"]),
        reason: str(item.reason, "Recommended to support mental steadiness and reflective clarity."),
        practice: str(item.practice, "Listen for 12 minutes during evening wind-down or focused journaling."),
      };
    })
    .filter((item) => item.title && item.ragas.length)
    .slice(0, 4);

  const palmKundliRaw = asObj(r.palmKundliCorrelation);
  const palmKundliCorrelation = {
    alignmentScore: clampScore(palmKundliRaw.alignmentScore, 72),
    confidence: clampScore(palmKundliRaw.confidence, 58),
    summary: str(
      palmKundliRaw.summary,
      "Palm and Kundli correlation requires both a clear palm image and saved birth chart. This score is a cautious alignment estimate."
    ),
    matches: strArr(palmKundliRaw.matches, ["Visible palm strengths can be compared with chart planet strengths when birth chart is available."]),
    gaps: strArr(palmKundliRaw.gaps, ["Upload clearer palm snapshots over time for evolution tracking."]),
  };

  const finalRaw = asObj(r.finalIntelligenceScore);
  const finalIntelligenceScore = {
    score: clampScore(finalRaw.score, Math.round(scoreboard.reduce((sum, item) => sum + item.value, 0) / Math.max(1, scoreboard.length))),
    confidence: clampScore(finalRaw.confidence, 72),
    summary: str(finalRaw.summary, "Final score blends palm geometry, major lines, mounts, fingers and behavioral intelligence modules."),
  };

  const meta = asObj(r.meta);
  const handStr = str(meta.hand);
  const hand: PalmistryReport["meta"]["hand"] =
    handStr === "right" || handStr === "left" ? handStr : "unknown";
  const qualityStr = str(meta.imageQuality);
  const imageQuality: PalmistryReport["meta"]["imageQuality"] =
    qualityStr === "high" || qualityStr === "low" ? qualityStr : "medium";

  return {
    meta: { hand, imageQuality, disclaimer: DISCLAIMER },
    overallImpression: {
      headline: str(oi.headline, "Your Palm Story"),
      summary: str(oi.summary, ""),
      metrics: metrics.length ? metrics : [
        { label: "Emotional Depth", value: 88 },
        { label: "Practical Intelligence", value: 85 },
        { label: "Resilience", value: 84 },
        { label: "Self-Made Success", value: 82 },
      ],
    },
    lines,
    mounts,
    fingers,
    predictions,
    timeline,
    luck,
    scoreboard: scoreboard.length ? scoreboard : [
      { label: "Leadership", value: 85 },
      { label: "Business", value: 83 },
      { label: "Creativity", value: 78 },
      { label: "Relationship", value: 82 },
      { label: "Health", value: 78 },
      { label: "Wealth", value: 82 },
      { label: "Spiritual", value: 80 },
    ],
    advancedInsights,
    palmGeometry,
    intelligenceSections,
    astroSoundRecommendations: astroSoundRecommendations.length ? astroSoundRecommendations : [
      { title: "Stress Balance", ragas: ["Yaman", "Bhoopali"], reason: "Supports calm focus and emotional regulation.", practice: "12 minutes after sunset with slow breathing." },
      { title: "Creative Flow", ragas: ["Kirwani", "Megh Malhar"], reason: "Supports creative imagination and reflective depth.", practice: "Use during journaling, design work or ideation." },
    ],
    growthPlan: strArr(r.growthPlan, [
      "Pick one behavioral pattern from the report and track it for 21 days.",
      "Use communication and sleep discipline before making major life decisions.",
      "Re-upload palm snapshots every 90 days to compare visible evolution.",
      "Use AstroSound recommendations as reflective support, not treatment.",
    ]).slice(0, 8),
    palmKundliCorrelation,
    finalIntelligenceScore,
  };
}

// Extract a JSON object from a possibly-noisy model response.
export function extractJson(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first >= 0 && last > first) {
      try {
        return JSON.parse(trimmed.slice(first, last + 1));
      } catch {
        return {};
      }
    }
    return {};
  }
}
