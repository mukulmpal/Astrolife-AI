// React hooks are loaded lazily inside useAstroSoundStore so that
// runAstroSound can be safely called in server-side contexts (e.g. PDF generation).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _reactLazy = () => require("react") as typeof import("react");

export type GoalKey =
  | "mind"
  | "money"
  | "travel"
  | "sleep"
  | "love"
  | "career"
  | "study"
  | "spiritual";

export type EmotionKey =
  | "auto"
  | "calm"
  | "focus"
  | "joy"
  | "devotion"
  | "confidence"
  | "grief"
  | "romance";

export type VoiceKey =
  | "any"
  | "vocal"
  | "flute"
  | "sitar"
  | "veena"
  | "sarod"
  | "tanpura";

export type IntensityKey = "soft" | "medium" | "strong";

export type ModeKey = "hybrid" | "astro" | "classical";

export interface ChartPlanet {
  rashi: number;
  house: number;
  lon: number;
  status?: string;
  retrograde?: boolean;
}

export interface ChartData {
  lagR: number;
  lagLon?: number;
  dob?: string;
  planets: Record<string, ChartPlanet>;
}

export interface RagaItem {
  id: string;
  name: string;
  system: "Hindustani" | "Carnatic" | "Hybrid";
  planets: string[];
  goals: GoalKey[];
  rasas: EmotionKey[];
  energy: "cooling" | "warming" | "balancing" | "uplifting" | "grounding";
  movement: "still" | "gentle" | "flowing" | "expansive" | "intense";
  time: string;
  laya: string;
  instrument: VoiceKey[];
  confidence: number;
  caution?: string;
  why: string;
  protocol: string[];
  avoidWhen?: string[];
  related?: string[];
  catalogIndex?: number;
  evidence?: "clinical_raga_specific" | "traditional_plus_research_adjacent" | "traditional";
  wellnessSupport?: string[];
  protocolDays?: number;
  medicalGuardrail?: "general" | "medical_first" | "urgent_medical";
}

export interface AstroSoundInput {
  chart: ChartData | null;
  goal: GoalKey;
  emotion: EmotionKey;
  voice: VoiceKey;
  intensity: IntensityKey;
  mode: ModeKey;
  memory?: AstroSoundMemory;
}

export interface AstroSoundTiming {
  activePlanet: string;
  activePlanetReason: string;
  currentDayPlanet: string;
  currentDayGuidance: string;
  dashaLikeFocus: string;
  transitLikeFocus: string;
  sensitivity: "Low" | "Medium" | "High";
  bestWindow: string;
  protocol: string[];
  twentyOneDaySadhana: string[];
}

export interface AstroSoundResult {
  title: string;
  summary: string;
  score: number;
  status: "Excellent" | "Good" | "Balanced" | "Sensitive";
  primary: RagaRecommendation;
  alternatives: RagaRecommendation[];
  avoid: RagaRecommendation[];
  navarasa: Record<string, number>;
  protocol: string[];
  reasons: string[];
  cautions: string[];
  remedies: string[];
  aiContext: string;
  timing: AstroSoundTiming;
}

export interface RagaRecommendation {
  raga: RagaItem;
  score: number;
  reasons: string[];
}

export const GOAL_META: Record<GoalKey, { label: string; emoji: string; desc: string }> = {
  mind: {
    label: "Mind Balance",
    emoji: "🧠",
    desc: "Calm thoughts, reduce mental heaviness, emotional regulation.",
  },
  money: {
    label: "Money Flow",
    emoji: "💰",
    desc: "Grounded prosperity, stable decision-making, practical abundance.",
  },
  travel: {
    label: "Travel Ease",
    emoji: "✈️",
    desc: "Movement, flexibility, protection and smooth journeys.",
  },
  sleep: {
    label: "Sleep Support",
    emoji: "🌙",
    desc: "Slow down the nervous system and prepare the mind for rest.",
  },
  love: {
    label: "Love & Harmony",
    emoji: "💗",
    desc: "Softness, bonding, forgiveness and emotional warmth.",
  },
  career: {
    label: "Career Focus",
    emoji: "📈",
    desc: "Confidence, discipline, visibility and professional momentum.",
  },
  study: {
    label: "Study & Learning",
    emoji: "📚",
    desc: "Concentration, retention, clarity and disciplined learning.",
  },
  spiritual: {
    label: "Spiritual Alignment",
    emoji: "🕯️",
    desc: "Devotion, surrender, mantra, silence and inner connection.",
  },
};

export const ALL_RASAS: { key: EmotionKey; label: string; emoji: string }[] = [
  { key: "calm", label: "Calm", emoji: "🌊" },
  { key: "focus", label: "Focus", emoji: "🎯" },
  { key: "joy", label: "Joy", emoji: "☀️" },
  { key: "devotion", label: "Devotion", emoji: "🙏" },
  { key: "confidence", label: "Confidence", emoji: "🔥" },
  { key: "grief", label: "Release", emoji: "🌧️" },
  { key: "romance", label: "Romance", emoji: "🌹" },
];

export const RAGA_DB: RagaItem[] = [
  {
    id: "yaman",
    name: "Yaman",
    system: "Hindustani",
    planets: ["Jupiter", "Venus", "Moon"],
    goals: ["mind", "study", "spiritual", "love"],
    rasas: ["calm", "devotion", "romance"],
    energy: "balancing",
    movement: "flowing",
    time: "Evening",
    laya: "Vilambit to Madhya",
    instrument: ["vocal", "sitar", "flute", "tanpura"],
    confidence: 92,
    why: "Yaman is graceful, sattvic and balancing. It supports clarity, devotion, emotional refinement and a peaceful mental state.",
    protocol: [
      "Listen for 12–18 minutes after sunset.",
      "Keep volume soft and avoid multitasking.",
      "Use tanpura or slow vocal alap for best effect.",
    ],
    related: ["Bhoopali", "Hamsadhwani"],
  },
  {
    id: "bhairav",
    name: "Bhairav",
    system: "Hindustani",
    planets: ["Sun", "Saturn", "Ketu"],
    goals: ["spiritual", "career", "mind"],
    rasas: ["devotion", "confidence", "calm"],
    energy: "grounding",
    movement: "still",
    time: "Early Morning",
    laya: "Vilambit",
    instrument: ["vocal", "tanpura", "sitar"],
    confidence: 90,
    why: "Bhairav brings seriousness, discipline and spiritual gravity. It is useful when the mind needs grounding and the day needs a sacred start.",
    protocol: [
      "Listen during sunrise or before work.",
      "Sit with straight spine and slow breathing.",
      "Use for discipline, prayer and Saturn-like patience.",
    ],
    caution: "May feel heavy if the listener is already emotionally low.",
    avoidWhen: ["Very low mood", "Extreme fatigue"],
    related: ["Ahir Bhairav", "Todi"],
  },
  {
    id: "ahir-bhairav",
    name: "Ahir Bhairav",
    system: "Hindustani",
    planets: ["Moon", "Saturn", "Jupiter"],
    goals: ["mind", "sleep", "spiritual"],
    rasas: ["calm", "devotion", "grief"],
    energy: "cooling",
    movement: "gentle",
    time: "Morning",
    laya: "Slow",
    instrument: ["vocal", "flute", "tanpura"],
    confidence: 89,
    why: "Ahir Bhairav combines depth with softness. It supports emotional release, humility and calm reflection.",
    protocol: [
      "Listen for 10–15 minutes in the morning.",
      "Good for journaling and emotional reset.",
      "Avoid aggressive beats after listening.",
    ],
    related: ["Bhairav", "Bhimpalasi"],
  },
  {
    id: "bhimpalasi",
    name: "Bhimpalasi",
    system: "Hindustani",
    planets: ["Moon", "Venus", "Ketu"],
    goals: ["mind", "sleep"],
    rasas: ["grief", "romance", "calm"],
    energy: "cooling",
    movement: "gentle",
    time: "Afternoon",
    laya: "Slow to Madhya",
    instrument: ["vocal", "flute", "sarod"],
    confidence: 88,
    why: "Bhimpalasi supports emotional processing, softness and inner release without forcing the mind.",
    protocol: [
      "Listen when emotions feel blocked.",
      "Keep session short if you feel too sensitive.",
      "End with 2 minutes of silence.",
    ],
    caution: "Can intensify emotional release for some people.",
    related: ["Bageshri", "Ahir Bhairav"],
  },
  {
    id: "bhoopali",
    name: "Bhoopali",
    system: "Hindustani",
    planets: ["Jupiter", "Moon"],
    goals: ["study", "mind", "spiritual"],
    rasas: ["calm", "joy", "devotion"],
    energy: "uplifting",
    movement: "flowing",
    time: "Evening",
    laya: "Madhya",
    instrument: ["flute", "vocal", "sitar"],
    confidence: 87,
    why: "Bhoopali is simple, bright and clean. It supports learning, optimism and mental clarity.",
    protocol: [
      "Listen before study or planning.",
      "Use flute or clean vocal versions.",
      "Pair with note-making or calm reading.",
    ],
    related: ["Yaman", "Hamsadhwani"],
  },
  {
    id: "hamsadhwani",
    name: "Hamsadhwani",
    system: "Carnatic",
    planets: ["Mercury", "Jupiter", "Sun"],
    goals: ["study", "career", "spiritual"],
    rasas: ["focus", "joy", "confidence"],
    energy: "uplifting",
    movement: "expansive",
    time: "Morning / Opening",
    laya: "Madhya to Drut",
    instrument: ["vocal", "veena", "flute"],
    confidence: 86,
    why: "Hamsadhwani is bright and auspicious. It supports beginnings, learning, confidence and invocation-like clarity.",
    protocol: [
      "Use before starting a task.",
      "Ideal for study, coding, writing or planning.",
      "Avoid very fast versions if anxious.",
    ],
    related: ["Bhoopali", "Yaman"],
  },
  {
    id: "darbari",
    name: "Darbari Kanada",
    system: "Hindustani",
    planets: ["Saturn", "Moon"],
    goals: ["sleep", "mind", "spiritual"],
    rasas: ["calm", "grief", "devotion"],
    energy: "grounding",
    movement: "still",
    time: "Late Night",
    laya: "Vilambit",
    instrument: ["vocal", "sarod", "tanpura"],
    confidence: 85,
    why: "Darbari is deep and heavy. It can help slow down an overstimulated mind, but should be used carefully.",
    protocol: [
      "Listen late evening at very low volume.",
      "Best for grounding, not productivity.",
      "Stop if it feels emotionally heavy.",
    ],
    caution: "Avoid during depressive or very low states.",
    avoidWhen: ["Low mood", "Isolation", "Heavy grief"],
    related: ["Malkauns", "Bhairav"],
  },
  {
    id: "malkauns",
    name: "Malkauns",
    system: "Hindustani",
    planets: ["Mars", "Saturn", "Ketu"],
    goals: ["spiritual", "mind", "sleep"],
    rasas: ["devotion", "confidence", "calm"],
    energy: "grounding",
    movement: "intense",
    time: "Late Night",
    laya: "Slow",
    instrument: ["vocal", "sarod", "tanpura"],
    confidence: 84,
    why: "Malkauns is meditative and intense. It supports inner power, tapas and deep stillness.",
    protocol: [
      "Use for meditation, not casual listening.",
      "Keep session under 15 minutes initially.",
      "Good for mantra or silent sitting.",
    ],
    caution: "Can feel intense for sensitive listeners.",
    related: ["Darbari", "Bhairav"],
  },
  {
    id: "bageshri",
    name: "Bageshri",
    system: "Hindustani",
    planets: ["Venus", "Moon"],
    goals: ["love", "mind", "sleep"],
    rasas: ["romance", "calm", "grief"],
    energy: "cooling",
    movement: "gentle",
    time: "Night",
    laya: "Slow to Madhya",
    instrument: ["vocal", "flute", "sitar"],
    confidence: 84,
    why: "Bageshri softens the emotional body and supports intimacy, forgiveness and tenderness.",
    protocol: [
      "Listen in the evening.",
      "Use for relationship softness, not confrontation.",
      "Pair with gratitude reflection.",
    ],
    related: ["Bhimpalasi", "Kafi"],
  },
  {
    id: "kafi",
    name: "Kafi",
    system: "Hindustani",
    planets: ["Venus", "Moon", "Mercury"],
    goals: ["love", "mind", "travel"],
    rasas: ["joy", "romance", "calm"],
    energy: "balancing",
    movement: "flowing",
    time: "Evening / Spring mood",
    laya: "Madhya",
    instrument: ["flute", "vocal", "sitar"],
    confidence: 82,
    why: "Kafi is earthy, human and expressive. It supports social warmth, emotional flexibility and natural joy.",
    protocol: [
      "Use after work or during relaxed evenings.",
      "Good for social openness and emotional ease.",
      "Avoid if you need strict focus.",
    ],
    related: ["Bageshri", "Desh"],
  },
  {
    id: "desh",
    name: "Desh",
    system: "Hindustani",
    planets: ["Moon", "Mercury", "Venus"],
    goals: ["travel", "love", "mind"],
    rasas: ["joy", "calm", "romance"],
    energy: "uplifting",
    movement: "flowing",
    time: "Evening / Monsoon",
    laya: "Madhya",
    instrument: ["flute", "vocal", "sitar"],
    confidence: 81,
    why: "Desh brings freshness, memory and movement. It is useful for travel mood, nostalgia and heart opening.",
    protocol: [
      "Listen before travel or after emotional heaviness.",
      "Good for lightness and gentle motivation.",
      "Use medium volume.",
    ],
    related: ["Kafi", "Bhoopali"],
  },
  {
    id: "todi",
    name: "Todi",
    system: "Hindustani",
    planets: ["Saturn", "Mercury", "Ketu"],
    goals: ["study", "spiritual", "mind"],
    rasas: ["focus", "devotion", "calm"],
    energy: "grounding",
    movement: "intense",
    time: "Late Morning",
    laya: "Slow",
    instrument: ["vocal", "sitar", "tanpura"],
    confidence: 80,
    why: "Todi is serious and introspective. It supports deep thought, discipline and inner examination.",
    protocol: [
      "Use for serious study or sadhana.",
      "Keep sessions short at first.",
      "Avoid if you need lightness.",
    ],
    caution: "May feel too serious for some moods.",
    related: ["Bhairav", "Marwa"],
  },
  {
    id: "marwa",
    name: "Marwa",
    system: "Hindustani",
    planets: ["Sun", "Saturn", "Rahu"],
    goals: ["career", "study", "spiritual"],
    rasas: ["focus", "confidence"],
    energy: "warming",
    movement: "intense",
    time: "Sunset",
    laya: "Madhya",
    instrument: ["vocal", "sitar", "sarod"],
    confidence: 78,
    why: "Marwa creates urgency and alertness. It can sharpen focus but may feel tense for anxious listeners.",
    protocol: [
      "Use before focused work, not before sleep.",
      "Avoid if already stressed.",
      "Keep volume low.",
    ],
    caution: "Can increase restlessness.",
    avoidWhen: ["Anxiety", "Insomnia"],
    related: ["Todi", "Puriya"],
  },
  {
    id: "puriya",
    name: "Puriya",
    system: "Hindustani",
    planets: ["Mercury", "Saturn", "Sun"],
    goals: ["study", "career"],
    rasas: ["focus", "confidence"],
    energy: "balancing",
    movement: "flowing",
    time: "Evening",
    laya: "Madhya",
    instrument: ["vocal", "sitar"],
    confidence: 79,
    why: "Puriya supports concentration, subtle perception and evening productivity.",
    protocol: [
      "Use for focused evening work.",
      "Best with low distraction environment.",
      "Avoid fast versions if stressed.",
    ],
    related: ["Marwa", "Yaman"],
  },
  {
    id: "hansdhwani-light",
    name: "Hamsadhwani Light",
    system: "Hybrid",
    planets: ["Mercury", "Jupiter"],
    goals: ["study", "career", "travel"],
    rasas: ["joy", "focus"],
    energy: "uplifting",
    movement: "expansive",
    time: "Morning",
    laya: "Madhya",
    instrument: ["flute", "veena", "vocal"],
    confidence: 78,
    why: "A lighter Hamsadhwani protocol supports quick activation, clear beginnings and optimism.",
    protocol: [
      "Listen for 7–10 minutes before a task.",
      "Use when starting something new.",
      "Pair with intention setting.",
    ],
    related: ["Hamsadhwani", "Bhoopali"],
  },
  {
    id: "shankarabharanam",
    name: "Shankarabharanam",
    system: "Carnatic",
    planets: ["Jupiter", "Sun", "Venus"],
    goals: ["study", "career", "spiritual"],
    rasas: ["joy", "confidence", "devotion"],
    energy: "uplifting",
    movement: "expansive",
    time: "Day",
    laya: "Madhya",
    instrument: ["veena", "vocal", "flute"],
    confidence: 80,
    why: "Shankarabharanam is expansive and clear. It supports wisdom, confidence and auspicious learning.",
    protocol: [
      "Use before study or teaching.",
      "Good for big-picture thinking.",
      "Keep session clean and steady.",
    ],
    related: ["Yaman", "Kalyani"],
  },
  {
    id: "kalyani",
    name: "Kalyani",
    system: "Carnatic",
    planets: ["Jupiter", "Venus", "Moon"],
    goals: ["spiritual", "study", "love"],
    rasas: ["devotion", "joy", "romance"],
    energy: "uplifting",
    movement: "expansive",
    time: "Evening",
    laya: "Madhya",
    instrument: ["veena", "vocal", "flute"],
    confidence: 82,
    why: "Kalyani is auspicious, devotional and elegant. It supports grace, blessings and refined emotional expression.",
    protocol: [
      "Listen after sunset or during prayer.",
      "Good for gratitude and devotion.",
      "Use gentle versions for emotional balance.",
    ],
    related: ["Yaman", "Shankarabharanam"],
  },
  {
    id: "hindolam",
    name: "Hindolam",
    system: "Carnatic",
    planets: ["Moon", "Ketu", "Venus"],
    goals: ["sleep", "spiritual", "mind"],
    rasas: ["calm", "devotion", "grief"],
    energy: "cooling",
    movement: "gentle",
    time: "Night",
    laya: "Slow",
    instrument: ["veena", "flute", "vocal"],
    confidence: 83,
    why: "Hindolam is inward and soothing. It supports rest, devotional calm and emotional cooling.",
    protocol: [
      "Listen before sleep at low volume.",
      "Avoid lyrical overstimulation.",
      "End with silence.",
    ],
    related: ["Malkauns", "Bageshri"],
  },
  {
    id: "mohanam",
    name: "Mohanam",
    system: "Carnatic",
    planets: ["Jupiter", "Mercury", "Moon"],
    goals: ["study", "mind", "travel"],
    rasas: ["joy", "focus", "calm"],
    energy: "uplifting",
    movement: "flowing",
    time: "Morning / Evening",
    laya: "Madhya",
    instrument: ["flute", "veena", "vocal"],
    confidence: 82,
    why: "Mohanam is clean and optimistic. It supports learning, clarity and emotional freshness.",
    protocol: [
      "Listen before study or travel.",
      "Use for light motivation.",
      "Good for children and beginners.",
    ],
    related: ["Bhoopali", "Hamsadhwani"],
  },
  {
    id: "abhogi",
    name: "Abhogi",
    system: "Carnatic",
    planets: ["Mercury", "Moon"],
    goals: ["study", "mind"],
    rasas: ["focus", "calm"],
    energy: "balancing",
    movement: "gentle",
    time: "Evening",
    laya: "Madhya",
    instrument: ["veena", "flute", "vocal"],
    confidence: 77,
    why: "Abhogi supports clean focus and gentle introspection without becoming too heavy.",
    protocol: [
      "Use for study or writing.",
      "Keep sessions 10–15 minutes.",
      "Good after distractions.",
    ],
    related: ["Mohanam", "Hamsadhwani"],
  },
  {
    id: "charukeshi",
    name: "Charukeshi",
    system: "Carnatic",
    planets: ["Venus", "Moon", "Jupiter"],
    goals: ["love", "mind", "spiritual"],
    rasas: ["romance", "grief", "devotion"],
    energy: "balancing",
    movement: "flowing",
    time: "Evening",
    laya: "Madhya",
    instrument: ["vocal", "veena", "flute"],
    confidence: 80,
    why: "Charukeshi combines emotion and devotion. It can soften the heart and support compassionate reflection.",
    protocol: [
      "Use during emotional reflection.",
      "Avoid during acute sadness if it feels too deep.",
      "Pair with gratitude or forgiveness.",
    ],
    caution: "May open emotional sensitivity.",
    related: ["Bageshri", "Kalyani"],
  },
  {
    id: "revati",
    name: "Revati",
    system: "Carnatic",
    planets: ["Ketu", "Jupiter", "Moon"],
    goals: ["spiritual", "sleep", "mind"],
    rasas: ["devotion", "calm"],
    energy: "cooling",
    movement: "still",
    time: "Night / Meditation",
    laya: "Slow",
    instrument: ["flute", "veena", "tanpura"],
    confidence: 83,
    why: "Revati is meditative and spacious. It supports surrender, mantra and peaceful closure of the day.",
    protocol: [
      "Use before meditation or sleep.",
      "Keep lights low.",
      "Good with breath awareness.",
    ],
    related: ["Hindolam", "Malkauns"],
  },
  {
    id: "saraswati",
    name: "Saraswati",
    system: "Carnatic",
    planets: ["Mercury", "Jupiter"],
    goals: ["study", "spiritual", "career"],
    rasas: ["focus", "devotion", "joy"],
    energy: "uplifting",
    movement: "flowing",
    time: "Morning",
    laya: "Madhya",
    instrument: ["veena", "vocal"],
    confidence: 79,
    why: "Saraswati supports learning, knowledge, speech and devotional intelligence.",
    protocol: [
      "Use before study, writing or teaching.",
      "Pair with note-taking.",
      "Good for Mercury-Jupiter themes.",
    ],
    related: ["Hamsadhwani", "Mohanam"],
  },
  {
    id: "megh",
    name: "Megh",
    system: "Hindustani",
    planets: ["Moon", "Jupiter"],
    goals: ["mind", "travel", "sleep"],
    rasas: ["calm", "joy"],
    energy: "cooling",
    movement: "flowing",
    time: "Monsoon / Evening",
    laya: "Madhya",
    instrument: ["flute", "vocal", "sitar"],
    confidence: 76,
    why: "Megh brings cooling and spaciousness. It can help when the system feels overheated or emotionally dry.",
    protocol: [
      "Use in evening or after heat/stress.",
      "Good with hydration and rest.",
      "Avoid very fast versions.",
    ],
    related: ["Desh", "Kafi"],
  },
  {
    id: "piloo",
    name: "Piloo",
    system: "Hindustani",
    planets: ["Venus", "Mercury", "Moon"],
    goals: ["love", "mind", "travel"],
    rasas: ["romance", "joy", "calm"],
    energy: "balancing",
    movement: "flowing",
    time: "Light classical / Evening",
    laya: "Madhya",
    instrument: ["vocal", "sitar", "flute"],
    confidence: 75,
    why: "Piloo is light, expressive and human. It supports emotional ease and social warmth.",
    protocol: [
      "Use after work or social stress.",
      "Good for softening speech.",
      "Avoid if you need strict discipline.",
    ],
    related: ["Kafi", "Desh"],
  },
  {
    id: "tilak-kamod",
    name: "Tilak Kamod",
    system: "Hindustani",
    planets: ["Venus", "Jupiter", "Moon"],
    goals: ["love", "money", "mind"],
    rasas: ["joy", "romance", "calm"],
    energy: "uplifting",
    movement: "flowing",
    time: "Night",
    laya: "Madhya",
    instrument: ["vocal", "sitar", "flute"],
    confidence: 76,
    why: "Tilak Kamod carries charm, sweetness and graceful joy. It supports pleasant mood and relational warmth.",
    protocol: [
      "Use in evening for lightness.",
      "Good after conflict or stress.",
      "Pair with gratitude practice.",
    ],
    related: ["Khamaj", "Piloo"],
  },
  {
    id: "khamaj",
    name: "Khamaj",
    system: "Hindustani",
    planets: ["Venus", "Moon"],
    goals: ["love", "money", "mind"],
    rasas: ["romance", "joy"],
    energy: "warming",
    movement: "flowing",
    time: "Night",
    laya: "Madhya",
    instrument: ["vocal", "sitar", "flute"],
    confidence: 75,
    why: "Khamaj is graceful and affectionate. It supports Venusian softness and social comfort.",
    protocol: [
      "Listen when you want softness and warmth.",
      "Good for relationship harmony.",
      "Avoid if attachment feels excessive.",
    ],
    related: ["Tilak Kamod", "Bageshri"],
  },
  {
    id: "jog",
    name: "Jog",
    system: "Hindustani",
    planets: ["Moon", "Rahu", "Venus"],
    goals: ["mind", "love", "sleep"],
    rasas: ["calm", "romance", "grief"],
    energy: "balancing",
    movement: "gentle",
    time: "Night",
    laya: "Madhya",
    instrument: ["vocal", "sitar", "flute"],
    confidence: 75,
    why: "Jog has a dreamy inward quality. It supports emotional cooling and imaginative release.",
    protocol: [
      "Use at night with low volume.",
      "Good for creative reflection.",
      "Avoid if it increases overthinking.",
    ],
    caution: "Can make sensitive minds more dreamy.",
    related: ["Bageshri", "Kafi"],
  },
  {
    id: "brindavani-sarang",
    name: "Brindavani Sarang",
    system: "Hindustani",
    planets: ["Sun", "Jupiter", "Moon"],
    goals: ["career", "travel", "mind"],
    rasas: ["joy", "confidence", "calm"],
    energy: "uplifting",
    movement: "expansive",
    time: "Afternoon",
    laya: "Madhya",
    instrument: ["flute", "vocal", "sitar"],
    confidence: 76,
    why: "Brindavani Sarang gives brightness and openness. It supports mobility, confidence and positive mood.",
    protocol: [
      "Use during afternoon slump.",
      "Good before meetings or travel.",
      "Keep listening light.",
    ],
    related: ["Desh", "Bhoopali"],
  },
];

const MEDICAL_FIRST_CONCERNS = new Set([
  "uti_infection",
  "paralysis_support",
  "severe_depression",
]);

const URGENT_CONCERNS = new Set(["chest_pain"]);

const CLINICAL_RAGA_SPECIFIC = new Set(["Bhairavi"]);

const RESEARCH_ADJACENT_RAGAS = new Set([
  "Ahir Bhairav",
  "Malkauns",
  "Todi",
  "Darbari Kanada",
  "Yaman",
  "Bhimpalasi",
  "Charukeshi",
]);

const SUPPLEMENTAL_108_RAAGS = [
  "Yaman|evening|Jupiter,Venus|general_calm,stress_anxiety,emotional_balance,devotion",
  "Yaman Kalyan|evening|Jupiter,Venus,Moon|general_calm,emotional_balance,devotion",
  "Bhairav|early_morning|Sun,Saturn|general_calm,anger_cooling,focus_clarity",
  "Ahir Bhairav|early_morning|Moon,Sun|stress_anxiety,hypertension_relaxation,anger_cooling,general_calm",
  "Bhairavi|early_morning|Moon,Ketu|stress_anxiety,emotional_grief,general_calm,hypertension_relaxation",
  "Darbari Kanada|late_night|Saturn,Rahu|sleep_issue,stress_anxiety,emotional_grief",
  "Malkauns|late_night|Saturn,Ketu|sleep_issue,digestion_comfort,acidity_gastric,general_calm,spiritual_meditation",
  "Bageshree|night|Moon,Venus|sleep_issue,emotional_grief,relationship_softening",
  "Kafi|evening|Moon,Venus,Mercury|relationship_softening,emotional_balance,anger_cooling",
  "Khamaj|late_evening|Venus,Moon|relationship_softening,low_energy,emotional_balance",
  "Desh|late_evening|Moon,Mercury|emotional_grief,relationship_softening,general_calm",
  "Jaijaivanti|night|Venus,Jupiter|headache_support,emotional_balance,devotion",
  "Patdeep|afternoon|Moon,Venus|emotional_balance,general_calm",
  "Madhuwanti|afternoon|Venus,Jupiter|stress_anxiety,general_calm,emotional_balance",
  "Jog|night|Mercury,Ketu|focus_clarity,spiritual_meditation,general_calm",
  "Shivranjani|night|Moon,Ketu|emotional_grief,focus_clarity,emotional_balance",
  "Durga|evening|Sun,Mars|confidence_building,stress_anxiety,low_energy",
  "Bhopali|early_morning|Jupiter,Moon|general_calm,low_energy,stress_anxiety",
  "Hamsadhwani|morning|Mercury,Jupiter|focus_clarity,low_energy,confidence_building",
  "Tilak Kamod|evening|Venus,Moon|pregnancy_wellness,relationship_softening,emotional_balance",
  "Pilu|anytime|Moon,Venus|relationship_softening,general_calm",
  "Pahadi|anytime|Moon,Mercury|general_calm,emotional_balance",
  "Kirwani|night|Moon,Ketu|emotional_grief,spiritual_meditation",
  "Chandrakauns|late_night|Moon,Rahu|sleep_issue,general_calm,spiritual_meditation",
  "Megh|monsoon|Moon,Rahu|general_calm,emotional_balance",
  "Megh Malhar|monsoon|Moon,Venus|stress_anxiety,emotional_balance,general_calm",
  "Miyan Ki Malhar|monsoon|Moon,Mars|emotional_grief,low_energy,emotional_balance",
  "Gaud Malhar|monsoon|Moon,Jupiter|general_calm,low_energy",
  "Surdasi Malhar|monsoon|Moon,Jupiter|devotion,general_calm",
  "Ramdasi Malhar|monsoon|Jupiter,Moon|devotion,emotional_balance",
  "Nat Malhar|monsoon|Mercury,Moon|low_energy,general_calm",
  "Jayant Malhar|monsoon|Jupiter,Moon|low_energy,emotional_balance",
  "Lalit|early_morning|Ketu,Sun|spiritual_meditation,focus_clarity,general_calm",
  "Ramkali|morning|Sun,Saturn|focus_clarity,general_calm",
  "Jogiya|early_morning|Ketu,Saturn|spiritual_meditation,general_calm",
  "Bibhas|early_morning|Sun,Mars|focus_clarity,confidence_building",
  "Todi|morning|Ketu,Saturn|stress_anxiety,focus_clarity,hypertension_relaxation",
  "Miyan Ki Todi|morning|Saturn,Ketu|focus_clarity,stress_anxiety",
  "Gujari Todi|morning|Ketu,Moon|emotional_grief,emotional_balance",
  "Multani|afternoon|Saturn,Rahu|focus_clarity,general_calm",
  "Bhimpalasi|afternoon|Moon,Venus|stress_anxiety,hypertension_relaxation,emotional_grief",
  "Brindavani Sarang|afternoon|Mercury,Jupiter|low_energy,general_calm",
  "Shuddha Sarang|afternoon|Sun,Mercury|focus_clarity,low_energy",
  "Gaud Sarang|afternoon|Sun,Jupiter|confidence_building,low_energy",
  "Miyan Ki Sarang|afternoon|Sun,Jupiter|confidence_building,focus_clarity",
  "Marwa|evening|Mars,Ketu|emotional_grief,focus_clarity",
  "Puriya|evening|Saturn,Mercury|focus_clarity,general_calm",
  "Puriya Dhanashree|evening|Saturn,Jupiter|devotion,focus_clarity,general_calm",
  "Shree|evening|Sun,Saturn|devotion,focus_clarity,general_calm",
  "Poorvi|evening|Saturn,Ketu|spiritual_meditation,focus_clarity",
  "Adana|late_night|Mars,Saturn|confidence_building,low_energy,focus_clarity",
  "Kaunsi Kanada|late_night|Saturn,Rahu|sleep_issue,general_calm",
  "Basant|spring|Venus,Jupiter|low_energy,emotional_balance",
  "Bahar|spring|Venus,Moon|low_energy,relationship_softening",
  "Hindol|morning|Venus,Ketu|stress_anxiety,acidity_gastric,spiritual_meditation",
  "Kamod|evening|Venus,Moon|relationship_softening,emotional_balance",
  "Vasant Mukhari|morning|Jupiter,Ketu|devotion,emotional_grief",
  "Deepak|evening|Sun,Mars|low_energy,confidence_building",
  "Jaunpuri|morning|Moon,Saturn|digestion_comfort,acidity_gastric,emotional_grief",
  "Tilang|night|Venus,Jupiter|devotion,general_calm",
  "Nand|night|Venus,Jupiter|low_energy,devotion,relationship_softening",
  "Kedar|night|Jupiter,Moon|stress_anxiety,general_calm,confidence_building",
  "Hamir|night|Sun,Jupiter|confidence_building,low_energy",
  "Chhayanat|night|Jupiter,Venus|low_energy,emotional_balance",
  "Bihag|night|Venus,Jupiter|relationship_softening,sleep_issue",
  "Rageshree|night|Venus,Moon|relationship_softening,emotional_balance",
  "Sohini|late_night|Mercury,Mars|headache_support,focus_clarity",
  "Vachaspati|evening|Jupiter,Mercury|focus_clarity,memory_support",
  "Charukeshi|evening|Venus,Moon|stress_anxiety,emotional_grief",
  "Abhogi|night|Moon,Venus|sleep_issue,general_calm",
  "Kalavati|night|Mercury,Venus|stress_anxiety,hypertension_relaxation,focus_clarity",
  "Malkosh|late_night|Saturn,Ketu|sleep_issue,spiritual_meditation",
  "Kaushik Dhwani|night|Ketu,Mercury|focus_clarity,spiritual_meditation",
  "Hemant|night|Saturn,Moon|general_calm,spiritual_meditation",
  "Shankara|night|Sun,Mars|confidence_building,focus_clarity",
  "Mand|evening|Venus,Moon|relationship_softening,general_calm",
  "Gara|anytime|Venus,Moon|relationship_softening,emotional_balance",
  "Jhinjhoti|night|Mercury,Venus|low_energy,relationship_softening",
  "Sindhu Bhairavi|anytime|Moon,Ketu|emotional_grief,pregnancy_wellness,general_calm",
  "Shuddha Kalyan|evening|Jupiter,Venus|devotion,general_calm",
  "Bhoop Kalyan|evening|Jupiter,Moon|general_calm,low_energy",
  "Gorakh Kalyan|night|Ketu,Moon|spiritual_meditation,general_calm",
  "Shyam Kalyan|evening|Jupiter,Venus|devotion,general_calm",
  "Maru Bihag|night|Venus,Jupiter|relationship_softening,confidence_building",
  "Nat Bhairav|morning|Sun,Saturn|focus_clarity,general_calm",
  "Anand Bhairav|early_morning|Sun,Moon|confidence_building,devotion,general_calm",
  "Bairagi Bhairav|early_morning|Ketu,Sun|spiritual_meditation,general_calm",
  "Komal Rishabh Asavari|morning|Saturn,Moon|emotional_grief,general_calm",
  "Asavari|morning|Saturn,Mars|confidence_building,general_calm",
  "Bilaskhani Todi|morning|Ketu,Moon|emotional_grief,general_calm",
  "Madhu Kauns|late_night|Venus,Ketu|sleep_issue,spiritual_meditation",
  "Jogkauns|late_night|Ketu,Saturn|sleep_issue,spiritual_meditation",
  "Nand Kauns|night|Venus,Moon|sleep_issue,relationship_softening",
  "Bhinna Shadja|morning|Mercury,Sun|focus_clarity,low_energy",
  "Saraswati|morning|Mercury,Jupiter|focus_clarity,memory_support",
  "Madhu Sarang|afternoon|Venus,Mercury|low_energy,general_calm",
  "Samant Sarang|afternoon|Sun,Mercury|focus_clarity,low_energy",
  "Madhmad Sarang|afternoon|Moon,Mercury|general_calm,low_energy",
  "Sorath|evening|Sun,Jupiter|confidence_building,devotion",
  "Gauri|morning|Sun,Jupiter|devotion,focus_clarity",
  "Devgiri Bilawal|morning|Jupiter,Sun|general_calm,focus_clarity",
  "Alhaiya Bilawal|morning|Jupiter,Mercury|focus_clarity,low_energy",
  "Bihagda|night|Venus,Jupiter|relationship_softening,low_energy",
  "Paraj|late_night|Ketu,Sun|devotion,spiritual_meditation",
  "Lalita Gauri|early_morning|Ketu,Moon|spiritual_meditation,general_calm",
  "Vibhas|early_morning|Sun,Mars|focus_clarity,confidence_building",
  "Dhanashree|evening|Venus,Jupiter|devotion,relationship_softening",
  "Nayaki Kanada|night|Venus,Saturn|general_calm,emotional_balance",
] as const;

function normalizeRagaName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function titleCaseConcern(concern: string) {
  return concern.replace(/_/g, " ");
}

function concernsToGoals(concerns: string[]): GoalKey[] {
  const goals = new Set<GoalKey>();
  for (const concern of concerns) {
    if (["sleep_issue"].includes(concern)) goals.add("sleep");
    if (["focus_clarity", "memory_support"].includes(concern)) goals.add("study");
    if (["relationship_softening"].includes(concern)) goals.add("love");
    if (["confidence_building", "low_energy"].includes(concern)) goals.add("career");
    if (["spiritual_meditation", "devotion"].includes(concern)) goals.add("spiritual");
    if (["general_calm", "stress_anxiety", "emotional_balance", "anger_cooling", "emotional_grief"].includes(concern)) goals.add("mind");
  }
  if (!goals.size) goals.add("mind");
  return Array.from(goals);
}

function concernsToRasas(concerns: string[]): EmotionKey[] {
  const rasas = new Set<EmotionKey>();
  for (const concern of concerns) {
    if (["stress_anxiety", "sleep_issue", "general_calm", "hypertension_relaxation"].includes(concern)) rasas.add("calm");
    if (["focus_clarity", "memory_support"].includes(concern)) rasas.add("focus");
    if (["low_energy", "confidence_building"].includes(concern)) rasas.add("confidence");
    if (["emotional_grief"].includes(concern)) rasas.add("grief");
    if (["relationship_softening"].includes(concern)) rasas.add("romance");
    if (["spiritual_meditation", "devotion"].includes(concern)) rasas.add("devotion");
    if (["emotional_balance", "pregnancy_wellness"].includes(concern)) rasas.add("joy");
  }
  if (!rasas.size) rasas.add("calm");
  return Array.from(rasas);
}

function timeLabel(time: string) {
  return time
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildSupplementalRaga(line: string, index: number): RagaItem {
  const [name, rawTime, rawPlanets, rawConcerns] = line.split("|");
  const planets = rawPlanets.split(",");
  const concerns = rawConcerns.split(",");
  const intense = ["Marwa", "Sohini", "Deepak"].includes(name);
  const medicalGuardrail = concerns.some((c) => URGENT_CONCERNS.has(c))
    ? "urgent_medical"
    : concerns.some((c) => MEDICAL_FIRST_CONCERNS.has(c))
      ? "medical_first"
      : "general";
  const evidence = CLINICAL_RAGA_SPECIFIC.has(name)
    ? "clinical_raga_specific"
    : RESEARCH_ADJACENT_RAGAS.has(name)
      ? "traditional_plus_research_adjacent"
      : "traditional";

  return {
    id: normalizeRagaName(name),
    name,
    system: "Hindustani",
    planets,
    goals: concernsToGoals(concerns),
    rasas: concernsToRasas(concerns),
    energy: intense ? "warming" : concerns.includes("low_energy") ? "uplifting" : concerns.includes("sleep_issue") ? "grounding" : "balancing",
    movement: intense ? "intense" : concerns.includes("sleep_issue") || concerns.includes("spiritual_meditation") ? "still" : "flowing",
    time: timeLabel(rawTime),
    laya: intense ? "Madhya with restraint" : concerns.includes("sleep_issue") ? "Vilambit" : "Slow to Madhya",
    instrument: ["vocal", "flute", "sitar", "tanpura"],
    confidence: evidence === "clinical_raga_specific" ? 91 : evidence === "traditional_plus_research_adjacent" ? 86 : 80,
    why: `${name} is mapped in the AstroSound 108 catalog for ${concerns.slice(0, 3).map(titleCaseConcern).join(", ")} support. It is interpreted through planetary resonance with ${planets.join(", ")} and classical listening-time discipline.`,
    protocol: [
      `Listen for ${intense ? 10 : 15} minutes during ${timeLabel(rawTime).toLowerCase()} when practical.`,
      "Use a clean alap, instrumental or slow vocal version before faster compositions.",
      "Observe the mind after listening and stop if the raga feels heavy.",
    ],
    caution: intense ? "This raga can feel intense; use short, low-volume sessions." : undefined,
    avoidWhen: intense ? ["High anxiety", "Insomnia", "Agitation"] : undefined,
    catalogIndex: index + 1,
    evidence,
    wellnessSupport: concerns.map(titleCaseConcern),
    protocolDays: intense ? 3 : 6,
    medicalGuardrail,
  };
}

const existingRagas = new Set(RAGA_DB.map((raga) => normalizeRagaName(raga.name)));
for (const [index, line] of SUPPLEMENTAL_108_RAAGS.entries()) {
  const name = line.split("|")[0];
  const normalized = normalizeRagaName(name);
  if (!existingRagas.has(normalized)) {
    RAGA_DB.push(buildSupplementalRaga(line, index));
    existingRagas.add(normalized);
  }
}

export function getAstroSoundCatalogStats() {
  return {
    totalRagas: RAGA_DB.length,
    sourceCatalogRagas: SUPPLEMENTAL_108_RAAGS.length,
    clinicalEvidenceRagas: RAGA_DB.filter((raga) => raga.evidence === "clinical_raga_specific").length,
    researchAdjacentRagas: RAGA_DB.filter((raga) => raga.evidence === "traditional_plus_research_adjacent").length,
    medicalGuardrailRagas: RAGA_DB.filter((raga) => raga.medicalGuardrail && raga.medicalGuardrail !== "general").length,
  };
}

const PLANET_GOAL: Record<string, GoalKey[]> = {
  Sun: ["career", "spiritual"],
  Moon: ["mind", "sleep", "love"],
  Mars: ["career", "travel"],
  Mercury: ["study", "career", "travel"],
  Jupiter: ["study", "spiritual", "money"],
  Venus: ["love", "money", "mind"],
  Saturn: ["career", "mind", "spiritual"],
  Rahu: ["career", "travel", "mind"],
  Ketu: ["spiritual", "sleep", "mind"],
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getStatus(score: number): AstroSoundResult["status"] {
  if (score >= 86) return "Excellent";
  if (score >= 72) return "Good";
  if (score >= 55) return "Balanced";
  return "Sensitive";
}

function planetPressure(chart: ChartData | null, planet: string) {
  if (!chart) return 0;
  const p = chart.planets?.[planet];
  if (!p) return 0;

  let score = 0;

  if ([6, 8, 12].includes(p.house)) score += 8;
  if (p.retrograde) score += 4;
  if (String(p.status ?? "").toLowerCase().includes("malefic")) score += 6;

  return score;
}

function goalPlanetSupport(chart: ChartData | null, raga: RagaItem, goal: GoalKey) {
  if (!chart) return 0;

  let score = 0;

  for (const planet of raga.planets) {
    const p = chart.planets?.[planet];
    if (!p) continue;

    if ([1, 5, 9, 10, 11].includes(p.house)) score += 9;
    if ([2, 3, 4, 7].includes(p.house)) score += 4;
    if ([6, 8, 12].includes(p.house)) score -= 7;
    if (p.retrograde) score -= 3;

    const planetGoals = PLANET_GOAL[planet] ?? [];
    if (planetGoals.includes(goal)) score += 8;
  }

  return score;
}

function chartSignature(chart: ChartData | null) {
  if (!chart) return 0;

  return Object.entries(chart.planets ?? {}).reduce((sum, [name, planet]) => {
    const nameScore = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return sum + nameScore + planet.rashi * 11 + planet.house * 17 + Math.round(planet.lon || 0);
  }, chart.lagR * 29 + Math.round(chart.lagLon ?? 0));
}

function ragaSignature(id: string) {
  return Array.from(id).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
}

function chartPersonalityAdjustment(chart: ChartData | null, raga: RagaItem) {
  if (!chart) return 0;

  const signature = chartSignature(chart);
  const raw = (signature + ragaSignature(raga.id)) % 13;
  return raw - 6;
}

function memoryAdjustment(memory: AstroSoundMemory | undefined, ragaName: string) {
  const item = memory?.ragas?.[ragaName];
  if (!item) return 0;
  return -(item.heavy * 6 + item.skip * 10);
}

function evidenceAdjustment(raga: RagaItem) {
  if (raga.evidence === "clinical_raga_specific") return 12;
  if (raga.evidence === "traditional_plus_research_adjacent") return 7;
  if (raga.evidence === "traditional") return 3;
  return 0;
}

function isYamanFamily(ragaName: string) {
  return ["Yaman", "Yaman Kalyan"].includes(ragaName);
}

function hasSpecificYamanNeed(input: AstroSoundInput) {
  const devotionalNeed = input.goal === "spiritual" && ["auto", "devotion", "calm"].includes(input.emotion);
  const refinedLoveNeed = input.goal === "love" && ["romance", "devotion"].includes(input.emotion);
  const learningNeed = input.goal === "study" && input.emotion === "devotion";
  const classicalNeed = input.mode === "classical" && ["devotion", "romance"].includes(input.emotion);

  return devotionalNeed || refinedLoveNeed || learningNeed || classicalNeed;
}

function scoreRaga(input: AstroSoundInput, raga: RagaItem): RagaRecommendation {
  const reasons: string[] = [];
  const hasChart = Boolean(input.chart);
  let score = 46 + Math.round((raga.confidence - 75) * 0.45);

  if (raga.goals.includes(input.goal)) {
    score += 22;
    reasons.push(`Matches your goal: ${GOAL_META[input.goal].label}.`);
  }

  if (input.emotion !== "auto" && raga.rasas.includes(input.emotion)) {
    score += 16;
    reasons.push(`Supports current emotional need: ${input.emotion}.`);
  }

  if (input.voice !== "any" && raga.instrument.includes(input.voice)) {
    score += 8;
    reasons.push(`Works well with preferred sound: ${input.voice}.`);
  }

  if (input.intensity === "soft" && ["cooling", "grounding", "balancing"].includes(raga.energy)) {
    score += 5;
    reasons.push("Soft intensity selected, so calmer ragas are preferred.");
  }

  if (input.intensity === "strong" && ["uplifting", "warming"].includes(raga.energy)) {
    score += 5;
    reasons.push("Strong intensity selected, so energizing ragas are preferred.");
  }

  if (input.mode !== "classical") {
    const support = goalPlanetSupport(input.chart, raga, input.goal);
    score += support;

    if (support >= 8) {
      reasons.push("Natal chart support improves this recommendation.");
    }

    const pressure = raga.planets.reduce((sum, planet) => sum + planetPressure(input.chart, planet), 0);
    if (pressure > 12) {
      score -= 8;
      reasons.push("Some planetary pressure is present, so use gently.");
    }

    if (hasChart) {
      const adjustment = chartPersonalityAdjustment(input.chart, raga);
      score += adjustment;

      if (Math.abs(adjustment) >= 4) {
        reasons.push("Chart-specific resonance changes the final ranking.");
      }
    }
  }

  score += memoryAdjustment(input.memory, raga.name);

  if (input.memory?.ragas?.[raga.name]?.good) {
    reasons.push("Past positive feedback is recorded but does not boost rank; AstroSound avoids saved-preference bias.");
  }

  if (input.memory?.ragas?.[raga.name]?.heavy) {
    reasons.push("Past feedback says this may feel heavy, so use softly.");
  }

  const evidenceBonus = evidenceAdjustment(raga);
  if (evidenceBonus) {
    score += evidenceBonus;
    reasons.push(
      raga.evidence === "clinical_raga_specific"
        ? "Evidence tier: strongest raga-specific wellness support in this catalog."
        : raga.evidence === "traditional_plus_research_adjacent"
          ? "Evidence tier: classical raga chikitsa support with research-adjacent relevance."
          : "Evidence tier: traditional raga chikitsa association."
    );
  }

  if (isYamanFamily(raga.name)) {
    if (hasSpecificYamanNeed(input)) {
      score -= 6;
      reasons.push("Yaman-family soft cap applied; allowed because the current need is devotional/refined enough.");
    } else {
      score -= 24;
      reasons.push("Yaman-family gate applied so it appears only for a clear devotional, refined love or study need.");
    }
  }

  if (raga.medicalGuardrail === "urgent_medical") {
    score -= 24;
    reasons.push("Urgent medical guardrail: music guidance is not appropriate as the primary answer.");
  } else if (raga.medicalGuardrail === "medical_first") {
    score -= 12;
    reasons.push("Medical-first guardrail: use only as supportive relaxation, never as treatment.");
  }

  score = clamp(Math.round(score), 0, 100);

  if (!reasons.length) {
    reasons.push("Balanced match based on raga mood, goal and classical usage.");
  }

  return {
    raga,
    score,
    reasons,
  };
}

function buildNavarasa(result: RagaRecommendation[]): Record<string, number> {
  const rasaScores: Record<string, number> = {
    calm: 0,
    focus: 0,
    joy: 0,
    devotion: 0,
    confidence: 0,
    grief: 0,
    romance: 0,
  };

  for (const rec of result.slice(0, 5)) {
    for (const rasa of rec.raga.rasas) {
      if (rasa === "auto") continue;
      rasaScores[rasa] = clamp(rasaScores[rasa] + Math.round(rec.score / 5), 0, 100);
    }
  }

  return rasaScores;
}


const WEEKDAY_PLANETS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

function getCurrentDayPlanet() {
  const day = new Date().getDay();
  return WEEKDAY_PLANETS[day] ?? "Moon";
}

function getPlanetHouse(chart: ChartData | null, planet: string) {
  return chart?.planets?.[planet]?.house ?? 0;
}

function getDashaLikeFocus(input: AstroSoundInput, primaryPlanet: string) {
  const goalMap: Record<GoalKey, string[]> = {
    mind: ["Moon", "Mercury", "Saturn"],
    money: ["Venus", "Jupiter", "Mercury"],
    travel: ["Mercury", "Rahu", "Moon"],
    sleep: ["Moon", "Ketu", "Saturn"],
    love: ["Venus", "Moon", "Jupiter"],
    career: ["Sun", "Saturn", "Mars", "Mercury"],
    study: ["Mercury", "Jupiter", "Moon"],
    spiritual: ["Jupiter", "Ketu", "Saturn", "Sun"],
  };

  const candidates = goalMap[input.goal] ?? ["Moon"];
  const chart = input.chart;

  if (!chart) {
    return {
      planet: primaryPlanet,
      reason: "Chart timing is not fully available, so the primary raga planet is used as the timing focus.",
    };
  }

  const ranked = candidates
    .map((planet) => {
      const house = getPlanetHouse(chart, planet);
      let score = 50;

      if ([1, 5, 9, 10, 11].includes(house)) score += 18;
      if ([2, 3, 4, 7].includes(house)) score += 8;
      if ([6, 8, 12].includes(house)) score -= 8;
      score -= planetPressure(chart, planet);

      return {
        planet,
        score,
        house,
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];

  return {
    planet: best?.planet ?? primaryPlanet,
    reason: `${best?.planet ?? primaryPlanet} is selected because it best matches the current goal and available house strength signals.`,
  };
}

function getTransitLikeFocus(chart: ChartData | null, dayPlanet: string) {
  if (!chart) {
    return "Transit calculation is in guidance mode. Current weekday planet is used as a lightweight transit proxy.";
  }

  const house = getPlanetHouse(chart, dayPlanet);

  if ([1, 5, 9, 10, 11].includes(house)) {
    return `${dayPlanet} has supportive natal house placement, so today's sound protocol can be used for active progress.`;
  }

  if ([6, 8, 12].includes(house)) {
    return `${dayPlanet} has sensitive house placement, so today's sound protocol should be soft, grounding and short.`;
  }

  return `${dayPlanet} has neutral placement, so today's sound protocol should be balanced and moderate.`;
}

function getBestSoundWindow(dayPlanet: string, ragaTime: string) {
  const dayWindow: Record<string, string> = {
    Sun: "Morning after sunrise",
    Moon: "Evening or before sleep",
    Mars: "Morning before action or exercise",
    Mercury: "Before study, writing or planning",
    Jupiter: "Morning prayer, study or teaching time",
    Venus: "Evening after work or relationship reflection",
    Saturn: "Early morning or quiet evening with low volume",
    Rahu: "Afternoon with grounding and low distraction",
    Ketu: "Meditation time or before sleep",
  };

  return `${dayWindow[dayPlanet] ?? ragaTime}. Classical raga time: ${ragaTime}.`;
}

function buildAstroSoundTiming(
  input: AstroSoundInput,
  primary: RagaRecommendation
): AstroSoundTiming {
  const dayPlanet = getCurrentDayPlanet();
  const primaryPlanet = primary.raga.planets[0] ?? "Moon";
  const dashaFocus = getDashaLikeFocus(input, primaryPlanet);
  const pressure =
    planetPressure(input.chart, dashaFocus.planet) +
    planetPressure(input.chart, dayPlanet);

  const sensitivity: AstroSoundTiming["sensitivity"] =
    pressure >= 18 ? "High" : pressure >= 8 ? "Medium" : "Low";

  const bestWindow = getBestSoundWindow(dayPlanet, primary.raga.time);
  const transitFocus = getTransitLikeFocus(input.chart, dayPlanet);

  const protocol = [
    `Timing focus planet: ${dashaFocus.planet}.`,
    `Current day planet: ${dayPlanet}.`,
    `Best listening window: ${bestWindow}.`,
    sensitivity === "High"
      ? "Use a soft version for 7–9 minutes only. Avoid intense or very fast renditions."
      : sensitivity === "Medium"
        ? "Use a moderate version for 10–12 minutes and observe the mind after listening."
        : "Use the full recommended session for 12–18 minutes.",
    "Repeat the same raga for at least 3 days before judging its effect.",
  ];

  const twentyOneDaySadhana = [
    `Days 1–3: Listen to ${primary.raga.name} for short sessions and observe emotional response.`,
    `Days 4–7: Use ${primary.raga.name} before the main goal activity connected to ${GOAL_META[input.goal].label}.`,
    `Days 8–14: Continue the raga and record whether it supports calmness, focus or emotional balance.`,
    `Days 15–21: Keep the same raga if it feels supportive; switch to an alternative if it feels heavy.`,
  ];

  return {
    activePlanet: dashaFocus.planet,
    activePlanetReason: dashaFocus.reason,
    currentDayPlanet: dayPlanet,
    currentDayGuidance: `${dayPlanet} shapes the daily timing layer for this recommendation.`,
    dashaLikeFocus: dashaFocus.reason,
    transitLikeFocus: transitFocus,
    sensitivity,
    bestWindow,
    protocol,
    twentyOneDaySadhana,
  };
}

export function runAstroSound(input: AstroSoundInput): AstroSoundResult {
  const scored = RAGA_DB
    .map((raga) => scoreRaga(input, raga))
    .sort((a, b) => b.score - a.score);

  const primary = scored[0];
  const alternatives = scored.slice(1, 4);
  const avoid = scored
    .filter((item) => item.raga.caution || item.score < 58)
    .slice(-3)
    .reverse();

  const score = primary?.score ?? 60;
  const status = getStatus(score);
  const navarasa = buildNavarasa(scored);

  const protocol = [
    ...primary.raga.protocol,
    `Best time: ${primary.raga.time}.`,
    `Suggested laya: ${primary.raga.laya}.`,
    "Keep it guidance-oriented. Stop if the sound feels uncomfortable.",
  ];

  const cautions = [
    primary.raga.caution,
    ...avoid.map((item) => item.raga.caution),
  ].filter(Boolean) as string[];

  const remedies = [
    "Listen with low to medium volume.",
    "Keep phone notifications off during the session.",
    "End with 1–2 minutes of silence.",
    "Use this as supportive guidance, not medical treatment.",
  ];

  const timing = buildAstroSoundTiming(input, primary);

  const reasons = [
    ...primary.reasons,
    `Primary planets: ${primary.raga.planets.join(", ")}.`,
    `Energy profile: ${primary.raga.energy}, movement: ${primary.raga.movement}.`,
  ];

  const summary = `${primary.raga.name} is recommended for ${GOAL_META[input.goal].label}. It matches your selected mood, preference and available chart signals with a ${score}/100 Astro Sound score.`;

  const aiContext = [
    `Astro Sound Recommendation`,
    `Goal: ${input.goal}`,
    `Emotion: ${input.emotion}`,
    `Voice: ${input.voice}`,
    `Intensity: ${input.intensity}`,
    `Mode: ${input.mode}`,
    `Primary Raga: ${primary.raga.name}`,
    `Score: ${score}`,
    `Status: ${status}`,
    `Why: ${primary.raga.why}`,
    `Catalog: ${RAGA_DB.length} active ragas, including AstroSound 108 wellness layer`,
    `Evidence Tier: ${primary.raga.evidence ?? "classical"}`,
    `Wellness Support: ${(primary.raga.wellnessSupport ?? []).join(", ") || "General sound balancing"}`,
    `Protocol: ${protocol.join(" ")}`,
    `Timing Planet: ${timing.activePlanet}`,
    `Current Day Planet: ${timing.currentDayPlanet}`,
    `Timing Sensitivity: ${timing.sensitivity}`,
    `Timing Guidance: ${timing.protocol.join(" ")}`,
    `Cautions: ${cautions.join(" ") || "None"}`,
  ].join("\n");

  return {
    title: `Astro Sound: ${primary.raga.name}`,
    summary,
    score,
    status,
    primary,
    alternatives,
    avoid,
    navarasa,
    protocol,
    reasons,
    cautions,
    remedies,
    aiContext,
    timing,
  };
}

export function buildReportText(result: AstroSoundResult): string {
  return [
    result.title,
    "",
    result.summary,
    "",
    "Primary Recommendation",
    `${result.primary.raga.name} (${result.primary.raga.system}) — Score ${result.primary.score}/100`,
    result.primary.raga.why,
    "",
    "AstroSound Intelligence Layer",
    `Catalog: ${RAGA_DB.length} active ragas, including the 108-raaga wellness layer`,
    `Evidence tier: ${result.primary.raga.evidence?.replace(/_/g, " ") ?? "classical"}`,
    `Wellness support: ${(result.primary.raga.wellnessSupport ?? ["General sound balancing"]).join(", ")}`,
    `Safety guardrail: ${(result.primary.raga.medicalGuardrail ?? "general").replace(/_/g, " ")}`,
    "",
    "Protocol",
    ...result.protocol.map((item) => `- ${item}`),
    "",
    "Why this works",
    ...result.reasons.map((item) => `- ${item}`),
    "",
    "Timing Protocol",
    `Active planet: ${result.timing.activePlanet}`,
    `Current day planet: ${result.timing.currentDayPlanet}`,
    `Sensitivity: ${result.timing.sensitivity}`,
    ...result.timing.protocol.map((item) => `- ${item}`),
    "",
    "21-Day Sadhana",
    ...result.timing.twentyOneDaySadhana.map((item) => `- ${item}`),
    "",
    "Alternatives",
    ...result.alternatives.map((item) => `- ${item.raga.name}: ${item.score}/100`),
    "",
    "Cautions",
    ...(result.cautions.length ? result.cautions.map((item) => `- ${item}`) : ["- No major caution."]),
    "",
    "Safe Note",
    "Music guidance only — not medical treatment. For serious mental health or medical concerns, consult a qualified professional.",
  ].join("\n");
}

export interface RagaFeedback {
  good: number;
  heavy: number;
  skip: number;
}

export interface AstroSoundMemory {
  ragas: Record<string, RagaFeedback>;
  lastRaga: string;
  lastGoal: string;
  lastFeedback: "good" | "heavy" | "skip" | "";
  updatedAt: string;
}

export interface AstroSoundSettings {
  goal: GoalKey;
  mode: ModeKey;
  emotion: EmotionKey;
  voice: VoiceKey;
  intensity: IntensityKey;
}

interface AstroSoundStore {
  settings: AstroSoundSettings;
  setSettings: (s: Partial<AstroSoundSettings>) => void;
  result: AstroSoundResult | null;
  setResult: (r: AstroSoundResult | null) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  memory: AstroSoundMemory;
  recordFeedback: (kind: "good" | "heavy" | "skip", ragaName: string, goal: GoalKey) => void;
  resetMemory: () => void;
  lastReportText: string;
  setLastReportText: (t: string) => void;
}

const ASTRO_SOUND_STORAGE_KEY = "astrolife-astrosound-memory-v1";

const DEFAULT_SETTINGS: AstroSoundSettings = {
  goal: "mind",
  mode: "hybrid",
  emotion: "auto",
  voice: "any",
  intensity: "medium",
};

const DEFAULT_MEMORY: AstroSoundMemory = {
  ragas: {},
  lastRaga: "",
  lastGoal: "",
  lastFeedback: "",
  updatedAt: "",
};

function readAstroSoundStorage(): {
  settings: AstroSoundSettings;
  memory: AstroSoundMemory;
} {
  if (typeof window === "undefined") {
    return { settings: DEFAULT_SETTINGS, memory: DEFAULT_MEMORY };
  }

  try {
    const raw = window.localStorage.getItem(ASTRO_SOUND_STORAGE_KEY);
    if (!raw) return { settings: DEFAULT_SETTINGS, memory: DEFAULT_MEMORY };

    const parsed = JSON.parse(raw);

    return {
      settings: { ...DEFAULT_SETTINGS, ...(parsed?.settings ?? {}) },
      memory: {
        ...DEFAULT_MEMORY,
        ...(parsed?.memory ?? {}),
        ragas: parsed?.memory?.ragas ?? {},
      },
    };
  } catch {
    return { settings: DEFAULT_SETTINGS, memory: DEFAULT_MEMORY };
  }
}

function writeAstroSoundStorage(settings: AstroSoundSettings, memory: AstroSoundMemory) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      ASTRO_SOUND_STORAGE_KEY,
      JSON.stringify({ settings, memory })
    );
  } catch {
    // localStorage can fail in private mode. Ignore safely.
  }
}

export function useAstroSoundStore(): AstroSoundStore {
  const { useState, useEffect } = _reactLazy();
  const [settings, setSettingsState] = useState<AstroSoundSettings>(() => readAstroSoundStorage().settings);
  const [memory, setMemory] = useState<AstroSoundMemory>(() => readAstroSoundStorage().memory);

  const [result, setResult] = useState<AstroSoundResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastReportText, setLastReportText] = useState("");

  useEffect(() => {
    writeAstroSoundStorage(settings, memory);
  }, [settings, memory]);

  const setSettings = (s: Partial<AstroSoundSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...s }));
  };

  const recordFeedback = (
    kind: "good" | "heavy" | "skip",
    ragaName: string,
    goal: GoalKey
  ) => {
    setMemory((prev) => {
      const ragas = { ...prev.ragas };

      if (!ragas[ragaName]) {
        ragas[ragaName] = { good: 0, heavy: 0, skip: 0 };
      }

      ragas[ragaName] = {
        ...ragas[ragaName],
        [kind]: ragas[ragaName][kind] + 1,
      };

      return {
        ragas,
        lastRaga: ragaName,
        lastGoal: goal,
        lastFeedback: kind,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const resetMemory = () => {
    setMemory(DEFAULT_MEMORY);
  };

  return {
    settings,
    setSettings,
    result,
    setResult,
    loading,
    setLoading,
    memory,
    recordFeedback,
    resetMemory,
    lastReportText,
    setLastReportText,
  };
}

export function getMemorySummary(memory: AstroSoundMemory): {
  avoid: string[];
  last: string;
  feedback: string;
  feedbackScore: (name: string) => number;
} {
  const entries = Object.entries(memory.ragas).filter(([, item]) => item.heavy || item.skip);

  entries.sort(
    ([, a], [, b]) =>
      b.heavy + b.skip * 2 - (a.heavy + a.skip * 2)
  );

  const avoid = entries.slice(0, 3).map(([name]) => name);

  return {
    avoid,
    last: memory.lastRaga || "—",
    feedback: memory.lastFeedback || "—",
    feedbackScore: (name: string) => {
      const r = memory.ragas[name];
      if (!r) return 0;
      return -(r.heavy * 6 + r.skip * 10);
    },
  };
}
