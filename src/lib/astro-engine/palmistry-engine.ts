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
// Normalized image coordinate: x and y are percentages (0-100) of the
// uploaded image width/height. x=0 is the left edge, y=0 is the top edge.
// These let the UI draw the line/mount overlays exactly where they appear
// on the user's real palm, so the analysis feels genuine.
export interface Point {
  x: number;
  y: number;
}

export interface PalmLineReading {
  id: PalmLineId;
  name: string;
  sanskrit: string;
  color: string;
  confidence: number;      // 0-100
  summary: string;         // one-line
  detail: string;          // 2-3 sentences
  points?: Point[];        // traced path of this line in the actual image
}

export interface MountReading {
  id: PalmMountId;
  name: string;
  score: number;           // 0-100
  keywords: string;        // "ambition, leadership, confidence"
  summary: string;
  pos?: Point;             // mount center in the actual image
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

// ── Overlay geometry (normalized 0-100 image space) ───────────
// Fallback line traces + mount centres for a RIGHT hand, used only when the
// model does not return per-image coordinates. The UI mirrors these for a
// left hand. Model-detected `points`/`pos` always take priority.
export const FALLBACK_LINE_POINTS: Record<PalmLineId, Point[]> = {
  heart:   [{ x: 16.7, y: 31.0 }, { x: 36.7, y: 25.3 }, { x: 58.3, y: 26.3 }, { x: 83.3, y: 31.6 }],
  head:    [{ x: 19.3, y: 42.0 }, { x: 40.0, y: 39.5 }, { x: 63.3, y: 44.2 }, { x: 81.7, y: 46.8 }],
  life:    [{ x: 23.3, y: 33.7 }, { x: 24.0, y: 52.6 }, { x: 36.7, y: 71.0 }, { x: 50.0, y: 86.8 }],
  fate:    [{ x: 56.0, y: 86.8 }, { x: 57.3, y: 65.8 }, { x: 56.7, y: 47.4 }, { x: 54.0, y: 31.6 }],
  sun:     [{ x: 70.0, y: 86.8 }, { x: 71.3, y: 68.4 }, { x: 72.0, y: 52.6 }, { x: 71.3, y: 39.5 }],
  mercury: [{ x: 80.0, y: 86.8 }, { x: 82.0, y: 71.0 }, { x: 81.3, y: 57.9 }, { x: 78.7, y: 46.8 }],
};

export const FALLBACK_MOUNT_POS: Record<PalmMountId, Point> = {
  jupiter:   { x: 16, y: 24 },
  saturn:    { x: 42, y: 14 },
  sun:       { x: 66, y: 18 },
  mercury:   { x: 86, y: 30 },
  venus:     { x: 14, y: 74 },
  moon:      { x: 84, y: 76 },
  upperMars: { x: 88, y: 52 },
  lowerMars: { x: 12, y: 50 },
};

// Mirror a normalized point horizontally (for left vs right hand).
export function mirrorX(p: Point, mirror: boolean): Point {
  return mirror ? { x: 100 - p.x, y: p.y } : p;
}

// Build a smooth SVG path (Catmull-Rom → cubic bezier) through points in
// 0-100 space. Render the SVG with viewBox "0 0 100 100" preserveAspectRatio="none".
export function buildLinePath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

// ── Prompt builder ────────────────────────────────────────────
export function buildPalmistryPrompt(birth?: BirthContext): string {
  const birthBlock =
    birth && (birth.name || birth.dob)
      ? `\nThe seeker's birth details (use ONLY to enrich the "AI Palm + Birth Chart Correlation" advanced insight; do not fabricate a full kundli): name=${birth.name || "-"}, dob=${birth.dob || "-"}, tob=${birth.tob || "-"}, place=${birth.city || "-"}.`
      : "";

  return `You are AstroLife's AI Palm Intelligence Engine — a world-class palmistry researcher, Samudrika Shastra expert, behavioral psychology analyst, product-grade report writer, and computer vision interpreter.

You will be shown a photograph of a human palm. Analyse the lines, mounts, fingers, and overall hand shape that you can actually observe. Where a feature is unclear in the image, infer the most probable reading and lower its confidence accordingly — never refuse.

SPATIAL GROUNDING (critical for an authentic report): You must locate each major line and each mount AS THEY ACTUALLY APPEAR in this specific image. For every line, trace its real path as a series of points. For every mount, give its real centre. Use a coordinate system where x and y are percentages from 0 to 100: x=0 is the LEFT edge of the image, x=100 the RIGHT edge; y=0 is the TOP edge, y=100 the BOTTOM edge.

STEP 1 — DETERMINE THE HAND (do this before any coordinates, get it right):
- The thumb is the short, thick digit set lower and apart from the four long fingers.
- With the palm facing the camera: if the thumb is on the RIGHT side of the image, it is a LEFT hand. If the thumb is on the LEFT side of the image, it is a RIGHT hand.
- Report this in meta.hand. Double-check by the thumb side — this single fact controls which side everything sits on.

STEP 2 — ANCHOR EVERYTHING TO WHAT YOU SEE (these constraints MUST hold, or your hand call was wrong — recheck it):
- The THUMB, the Venus mount (ball of the thumb) and the Life line all sit on the SAME side as the thumb. So x of the Venus mount and the Life line must be on the thumb side of the palm.
- The Moon mount sits on the side OPPOSITE the thumb (outer edge), near the bottom.
- The four finger mounts sit just below their fingers, in this order across the hand: Jupiter below the index finger (the finger nearest the thumb), then Saturn (middle), Sun (ring), Mercury (little finger, far from the thumb). On a LEFT hand the index/Jupiter is on the RIGHT; on a RIGHT hand it is on the LEFT.
- Coordinates must match the REAL photo, never a generic left-or-right template.

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
    { "id": "heart"|"head"|"life"|"fate"|"sun"|"mercury", "confidence": number, "summary": string, "detail": string, "points": [[x,y], ...] }
  ],                                          // all 6 lines, confidence 0-100. "points": 4-8 [x,y] pairs (percent 0-100) tracing the line as seen in THIS image, ordered start→end. Omit a line's points only if that line is genuinely not visible.
  "mounts": [
    { "id": "jupiter"|"saturn"|"sun"|"mercury"|"venus"|"moon"|"upperMars"|"lowerMars", "score": number, "keywords": string, "summary": string, "pos": [x,y] }
  ],                                          // all 8 mounts, score 0-100. "pos": [x,y] percent (0-100) centre of the mount region in THIS image.
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

function clampPct(n: unknown): number | null {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return null;
  return Math.max(0, Math.min(100, v));
}

// Accept a point as [x,y] or {x,y}; returns null when invalid.
function parsePoint(v: unknown): Point | null {
  if (Array.isArray(v) && v.length >= 2) {
    const x = clampPct(v[0]); const y = clampPct(v[1]);
    return x !== null && y !== null ? { x, y } : null;
  }
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const x = clampPct(o.x); const y = clampPct(o.y);
    return x !== null && y !== null ? { x, y } : null;
  }
  return null;
}

// A line needs at least 2 valid points to be drawable.
function parsePoints(v: unknown): Point[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const pts = v.map(parsePoint).filter((p): p is Point => p !== null);
  return pts.length >= 2 ? pts : undefined;
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
      points: parsePoints(l.points),
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
      pos: parsePoint(m.pos) ?? undefined,
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
