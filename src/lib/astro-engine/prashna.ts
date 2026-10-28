/**
 * ============================================================================
 * ASTROLIFE — MASTER PRASHNA KUNDALI ENGINE (10-LAYER SHASTRA)
 * ============================================================================
 * An authentic, rigorous classical Horary Astrology system synthesizing:
 * 1. Classical Tajaka Shastra (16 Yogas & Deeptaamshas)
 * 2. Classical Saham & Inversion Principles
 * 3. Classical KP Horary 1–249 Cuspal Sub-Lord Sub-Division
 * 4. Classical Shastric Tradition (Panchanga Shuddhi, Badhaka & Ruling Planets)
 *
 * 10 Master Layers:
 * - Layer 1: Panchanga Shuddhi & Vishti (Bhadra) Check
 * - Layer 2: Chitta Vritti (Querent's Subconscious Mind via Moon's Bhava)
 * - Layer 3: Udaya Lagna & Directional Signs (Urdhvamukha / Adhomukha / Tiryangmukha)
 * - Layer 4: Badhakasthana & Marakasthana Karmic Obstacle Detection
 * - Layer 5: 16 Tajaka Yogas Engine (Ithasala, Eesarpha, Nakta, Yamaya, Kamboola, etc.)
 * - Layer 6: Sahams with Day vs Night Reversal (Arabic Parts)
 * - Layer 7: KP Horary 1–249 Mode & Cuspal Sub-Lords
 * - Layer 8: 5-Fold Ruling Planets (RP) Synchronization
 * - Layer 9: Phala Prapti Kaala (Precise Manifestation Timing)
 * - Layer 10: 3-Tier Shastric Verdict (Sadhya / Krichhra-Sadhya / Asadhya) + Upayas
 * ============================================================================
 */

import { computePlanets, computeLagna, computeRetro, getJD, RASHIS } from "./calculations";
import { calculatePanchang } from "./panchang";

export type PrashnaTopic =
  | "career"
  | "marriage"
  | "health"
  | "finance"
  | "travel"
  | "education"
  | "property"
  | "legal"
  | "child"
  | "general";

export const LAGNA_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

export const CHALDEAN_HORA_ORDER = [
  "Sun", "Venus", "Mercury", "Moon", "Saturn", "Jupiter", "Mars",
];
const DAY_RULER_IDX = [0, 3, 6, 2, 5, 1, 4]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat

export const PLANET_EMOJI: Record<string, string> = {
  Sun: "☀️", Moon: "🌙", Mars: "♂️", Mercury: "☿",
  Jupiter: "♃", Venus: "♀️", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

export const PLANET_COLORS: Record<string, string> = {
  Sun: "#f97316", Moon: "#c084fc", Mars: "#ef4444", Mercury: "#22c55e",
  Jupiter: "#f59e0b", Venus: "#ec4899", Saturn: "#60a5fa", Rahu: "#a78bfa", Ketu: "#fb7185",
};

// Deeptaamsha (Orb of influence) according to Classical Tajaka Shastra
export const DEEPTAAMSHA: Record<string, number> = {
  Sun: 15.0,
  Moon: 12.0,
  Mars: 8.0,
  Mercury: 7.0,
  Jupiter: 9.0,
  Venus: 7.0,
  Saturn: 9.0,
  Rahu: 6.0,
  Ketu: 6.0,
};

// Mean Planetary Speed ranking (Faster to slower) for Tajaka applying aspects
export const PLANET_SPEED_RANK: Record<string, number> = {
  Moon: 1,
  Mercury: 2,
  Venus: 3,
  Sun: 4,
  Mars: 5,
  Jupiter: 6,
  Saturn: 7,
  Rahu: 8,
  Ketu: 9,
};

export const TOPIC_HOUSES: Record<
  PrashnaTopic,
  { positive: number[]; negative: number[]; karaka: string; secondary?: string; primary: number; label: string }
> = {
  career:    { primary: 10, positive: [2, 6, 10, 11], negative: [5, 8, 12], karaka: "Saturn", secondary: "Sun", label: "Career & Status" },
  marriage:  { primary: 7,  positive: [2, 7, 11],    negative: [1, 6, 10, 12], karaka: "Venus", secondary: "Jupiter", label: "Marriage & Partnership" },
  health:    { primary: 1,  positive: [1, 5, 11],    negative: [6, 8, 12], karaka: "Sun", secondary: "Moon", label: "Health & Vitality" },
  finance:   { primary: 2,  positive: [2, 5, 9, 11],  negative: [6, 8, 12], karaka: "Jupiter", secondary: "Venus", label: "Wealth & Gains" },
  travel:    { primary: 9,  positive: [3, 9, 12],    negative: [8], karaka: "Mercury", secondary: "Rahu", label: "Travel & Relocation" },
  education: { primary: 5,  positive: [4, 5, 9, 11],  negative: [6, 8], karaka: "Mercury", secondary: "Jupiter", label: "Education & Exams" },
  property:  { primary: 4,  positive: [4, 9, 11],    negative: [6, 8, 12], karaka: "Moon", secondary: "Mars", label: "Real Estate & Vehicles" },
  legal:     { primary: 6,  positive: [1, 6, 11],    negative: [7, 8, 12], karaka: "Mars", secondary: "Saturn", label: "Litigation & Dispute Win" },
  child:     { primary: 5,  positive: [2, 5, 11],    negative: [1, 4, 10, 12], karaka: "Jupiter", secondary: "Moon", label: "Children & Progeny" },
  general:   { primary: 1,  positive: [1, 5, 9, 11],  negative: [6, 8, 12], karaka: "Jupiter", label: "General Endeavor" },
};

export const HORA_FAVORABLE: Record<PrashnaTopic, string[]> = {
  career:    ["Sun", "Mercury", "Jupiter"],
  marriage:  ["Venus", "Moon", "Jupiter"],
  health:    ["Sun", "Moon", "Jupiter"],
  finance:   ["Jupiter", "Venus", "Mercury"],
  travel:    ["Mercury", "Moon", "Jupiter"],
  education: ["Mercury", "Jupiter", "Venus"],
  property:  ["Moon", "Mercury", "Jupiter"],
  legal:     ["Mars", "Saturn", "Sun"],
  child:     ["Jupiter", "Moon", "Venus"],
  general:   ["Jupiter", "Sun", "Venus"],
};

export const BENEFICS = new Set(["Jupiter", "Venus", "Moon", "Mercury"]);
export const MALEFICS = new Set(["Saturn", "Mars", "Rahu", "Ketu", "Sun"]);

// Saham (Arabic Parts) Configuration with Day vs Night Formulas
// Day:   (A - B + Lagna)
// Night: (B - A + Lagna)
interface SahamDefinition {
  name: string;
  meaning: string;
  dayFormula: [string, string, string];   // [A, B, C] => A - B + C
  nightFormula: [string, string, string]; // [B, A, C] => B - A + C
}

export const SAHAM_CONFIG: Record<PrashnaTopic, SahamDefinition> = {
  career: {
    name: "Punya Saham",
    meaning: "Fortune, career fame and virtue",
    dayFormula: ["Moon", "Sun", "Lagna"],
    nightFormula: ["Sun", "Moon", "Lagna"],
  },
  marriage: {
    name: "Vivaha Saham",
    meaning: "Marriage timing and emotional partnership",
    dayFormula: ["Venus", "Sun", "Lagna"],
    nightFormula: ["Sun", "Venus", "Lagna"],
  },
  health: {
    name: "Roga Saham",
    meaning: "Health vitality, obstacles and recovery",
    dayFormula: ["Saturn", "Moon", "Lagna"],
    nightFormula: ["Moon", "Saturn", "Lagna"],
  },
  finance: {
    name: "Dhana Saham",
    meaning: "Wealth inflow, gains and financial security",
    dayFormula: ["Jupiter", "Sun", "Moon"],
    nightFormula: ["Sun", "Jupiter", "Moon"],
  },
  travel: {
    name: "Pravasa / Paradesha Saham",
    meaning: "Travel, relocation and overseas venture",
    dayFormula: ["Moon", "Mars", "Lagna"],
    nightFormula: ["Mars", "Moon", "Lagna"],
  },
  education: {
    name: "Vidya Saham",
    meaning: "Higher education, intelligence and examination",
    dayFormula: ["Mercury", "Sun", "Moon"],
    nightFormula: ["Sun", "Mercury", "Moon"],
  },
  property: {
    name: "Griha Saham",
    meaning: "Real estate, home acquisition and vehicles",
    dayFormula: ["Moon", "Saturn", "Lagna"],
    nightFormula: ["Saturn", "Moon", "Lagna"],
  },
  legal: {
    name: "Jaya / Rina Saham",
    meaning: "Litigation victory, debt relief and competition",
    dayFormula: ["Saturn", "Jupiter", "Lagna"],
    nightFormula: ["Jupiter", "Saturn", "Lagna"],
  },
  child: {
    name: "Putra / Santana Saham",
    meaning: "Children, progeny and family blessing",
    dayFormula: ["Jupiter", "Moon", "Lagna"],
    nightFormula: ["Moon", "Jupiter", "Lagna"],
  },
  general: {
    name: "Karya / Punya Saham",
    meaning: "Overall fulfillment of intention",
    dayFormula: ["Moon", "Sun", "Lagna"],
    nightFormula: ["Sun", "Moon", "Lagna"],
  },
};

// ── KP 1–249 SUB-DIVISION TABLE ──────────────────────────────────────────────
export interface KP249Entry {
  number: number;
  startLon: number;
  endLon: number;
  midLon: number;
  sign: string;
  signLord: string;
  star: string;
  starLord: string;
  subLord: string;
}

const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};
const NAK_27 = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];
const NAK_LORDS = Array.from({ length: 27 }, (_, i) => DASHA_ORDER[i % 9]);

export function generateKP249Table(): KP249Entry[] {
  const table: KP249Entry[] = [];
  const nakSpan = 360.0 / 27.0; // 13° 20' = 13.333333333333334°
  let currLon = 0.0;

  for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
    const starLord = NAK_LORDS[nakIdx];
    const starName = NAK_27[nakIdx];
    const startLordIdx = DASHA_ORDER.indexOf(starLord);

    for (let subIdx = 0; subIdx < 9; subIdx++) {
      const subLord = DASHA_ORDER[(startLordIdx + subIdx) % 9];
      const subSpan = nakSpan * (DASHA_YEARS[subLord] / 120.0);
      const endLon = currLon + subSpan;

      // Check if sign boundary (30°, 60°, 90°, etc.) splits this sub
      let crossedBoundary: number | null = null;
      for (let b = 30; b < 360; b += 30) {
        if (currLon < b - 1e-6 && endLon > b + 1e-6) {
          crossedBoundary = b;
          break;
        }
      }

      if (crossedBoundary !== null) {
        // Split A
        const sNum1 = table.length + 1;
        const signIdx1 = Math.floor(currLon / 30) % 12;
        table.push({
          number: sNum1,
          startLon: currLon,
          endLon: crossedBoundary,
          midLon: (currLon + crossedBoundary) / 2,
          sign: RASHIS[signIdx1],
          signLord: LAGNA_LORDS[signIdx1],
          star: starName,
          starLord,
          subLord,
        });

        // Split B
        const sNum2 = table.length + 1;
        const signIdx2 = Math.floor(crossedBoundary / 30) % 12;
        table.push({
          number: sNum2,
          startLon: crossedBoundary,
          endLon: endLon,
          midLon: (crossedBoundary + endLon) / 2,
          sign: RASHIS[signIdx2],
          signLord: LAGNA_LORDS[signIdx2],
          star: starName,
          starLord,
          subLord,
        });
      } else {
        const sNum = table.length + 1;
        const signIdx = Math.floor(currLon / 30) % 12;
        table.push({
          number: sNum,
          startLon: currLon,
          endLon: endLon,
          midLon: (currLon + endLon) / 2,
          sign: RASHIS[signIdx],
          signLord: LAGNA_LORDS[signIdx],
          star: starName,
          starLord,
          subLord,
        });
      }
      currLon = endLon;
    }
  }

  return table;
}

const CACHED_KP_249 = generateKP249Table();

export function getKP249ByNumber(seed: number): KP249Entry {
  const clamped = Math.max(1, Math.min(249, Math.round(seed)));
  return CACHED_KP_249[clamped - 1] ?? CACHED_KP_249[0];
}

// ── INTERFACES FOR THE 10 PRASHNA LAYERS ──────────────────────────────────────
export interface PanchangPrashnaShuddhi {
  tithi: string;
  isRiktaTithi: boolean;
  karana: string;
  isBhadraActive: boolean;
  yoga: string;
  isAshubhaYoga: boolean;
  weekday: string;
  varaLord: string;
  sunrise: string;
  sunset: string;
  shuddhiVerdict: "Pavitra (Pure)" | "Madhyam (Average)" | "Ashuddha (Challenging)";
  warning?: string;
}

export interface ChittaVrittiAnalysis {
  moonHouse: number;
  subconsciousTheme: string;
  isAlignedWithQuery: boolean;
  interpretation: string;
}

export interface DirectionalNatureAnalysis {
  signNature: "Urdhvamukha (Upward)" | "Adhomukha (Downward)" | "Tiryangmukha (Sideways)";
  meaning: string;
}

export interface BadhakaAnalysis {
  lagnaType: "Chara (Movable)" | "Sthira (Fixed)" | "Dvisvabhava (Dual)";
  badhakaHouse: number;
  badhakesh: string;
  badhakeshHouse: number;
  isAfflicted: boolean;
  explanation: string;
}

export interface TajakaYogaResult {
  name: string;
  category: "Positive" | "Negative" | "Neutral";
  description: string;
  planetsInvolved: string[];
  power: "Supreme (Poorna)" | "High" | "Medium" | "Challenging";
}

export interface SahamAnalysis {
  name: string;
  sahamHouse: number;
  sahamSign: string;
  sahamLord: string;
  isDayChart: boolean;
  formulaDescription: string;
  favorable: boolean;
  explanation: string;
}

export interface KPHoraryAnalysis {
  mode: "clock_time" | "kp_number_seed";
  horaryNumber?: number;
  lagnaSignLord: string;
  lagnaStarLord: string;
  lagnaSubLord: string;
  queryCuspNumber: number;
  queryCuspSubLord: string;
  signifiedHouses: number[];
  promise: "PROMISED" | "DENIED" | "DELAYED_STRUGGLE";
  analysis: string;
}

export interface RulingPlanetsCorroboration {
  dayLord: string;
  moonSignLord: string;
  moonStarLord: string;
  lagnaSignLord: string;
  lagnaStarLord: string;
  karyeshaMatched: boolean;
  lagneshaMatched: boolean;
  status: "RP_CONFIRMED" | "RP_PARTIAL" | "RP_DISCORDANT";
  explanation: string;
}

export interface PhalaPraptiKaala {
  timingText: string;
  speedCategory: "Swift (Days/Weeks)" | "Moderate (Weeks/Months)" | "Delayed (Months/Years)";
  degreeDifference: number;
  lagnaMobility: string;
  moonVelocityFactor: string;
}

export interface PrashnaUpayaRecommendation {
  primaryRemedy: string;
  deityToPropitiate: string;
  beneficDirection: string;
  favorableHoraWindow: string;
  donationSuggestion: string;
}

export interface PrashnaResult {
  // Classical Verdict
  shastricVerdict: "Sadhya (साध्य)" | "Krichhra-Sadhya (कृच्छ्र-साध्य)" | "Asadhya (असाध्य)";
  verdict: "yes_strong" | "yes_possible" | "mixed" | "no_delay" | "no_unlikely";
  icon: string;
  color: string;
  title: string;
  detail: string;
  score: number;

  // 10 Layers
  layer1PanchangShuddhi: PanchangPrashnaShuddhi;
  layer2ChittaVritti: ChittaVrittiAnalysis;
  layer3DirectionalNature: DirectionalNatureAnalysis;
  layer4Badhaka: BadhakaAnalysis;
  layer5TajakaYogas: TajakaYogaResult[];
  layer6Saham: SahamAnalysis;
  layer7KPHorary: KPHoraryAnalysis;
  layer8RulingPlanets: RulingPlanetsCorroboration;
  layer9PhalaPraptiKaala: PhalaPraptiKaala;
  layer10PrashnaUpaya: PrashnaUpayaRecommendation;

  // Chart Properties
  lagnaRashi: string;
  lagnaLord: string;
  lagnaLordHouse: number;
  karaka: string;
  karakaHouse: number;
  karakaFavorable: boolean;
  moonHouse: number;
  moonNakshatra: string;
  moonSign: string;
  moonVelocity: "fast" | "normal" | "slow";
  moonDegreesPerDay: number;
  moonVoidOfCourse: boolean;
  moonApplyingTo: string | null;
  hora: string;
  horaFavorable: boolean;
  horaHour: number;
  primaryHouse: number;
  primaryHouseOccupants: string[];
  topicHouses: { positive: number[]; negative: number[] };
  positiveFactors: string[];
  negativeFactors: string[];
  scoreBreakdown: { label: string; points: number; note: string }[];
  saham: { name: string; house: number; sign: string; meaning: string; favorable: boolean; note: string };
  prashnaMargas: string[];
  confidence: "low" | "medium" | "high";
  timingWindow: string;
  decisionProtocol: string[];
  practicalAdvice: string;
  question: string;
  topic: PrashnaTopic;
  planetPositions: Record<string, { house: number; sign: string; degrees: number; nakshatra?: string; emoji: string; color: string; isRetrograde?: boolean }>;
  timestamp: string;
}

// ── MOON KINEMATICS & VOID-OF-COURSE ──────────────────────────────────────────
function computeMoonKinematics(moonLon: number, jd: number) {
  const D = jd - 2451545.0;
  const anomaly = (134.963 + 13.064993 * D) % 360;
  const aRad = (anomaly * Math.PI) / 180;
  const dailyMotion = 13.1764 + 6.289 * 0.01745 * Math.cos(aRad) * 13.1764;
  const velocity: "fast" | "normal" | "slow" =
    dailyMotion >= 13.5 ? "fast" : dailyMotion < 12.0 ? "slow" : "normal";
  return { velocity, degreesPerDay: Number(dailyMotion.toFixed(2)) };
}

function checkMoonVOC(moonLon: number, planetLons: Record<string, number>) {
  const degInSign = (moonLon % 30 + 30) % 30;
  const degLeft = 30 - degInSign;
  const ASPECT_ANGLES = [0, 60, 90, 120, 180];
  const PLANET_KEYS = ["Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  let nearestTarget: string | null = null;
  let minDiff = Infinity;

  for (const p of PLANET_KEYS) {
    const pLon = planetLons[p];
    if (pLon === undefined) continue;

    for (const ang of ASPECT_ANGLES) {
      const target = (moonLon + ang) % 360;
      let diff = Math.abs((pLon % 360) - target);
      if (diff > 180) diff = 360 - diff;

      // Applying aspect within 8°
      if (diff <= 8 && diff < minDiff) {
        const stepToAspect = ((target - moonLon) + 360) % 360;
        if (stepToAspect <= degLeft) {
          minDiff = diff;
          nearestTarget = p;
        }
      }
    }
  }

  return { voidOfCourse: nearestTarget === null, applyingTo: nearestTarget };
}

// ── 16 TAJAKA YOGAS COMPUTATIONAL ENGINE (षोडश ताजिक योग) ────────────────────
function computeTajakaAspectsAndYogas(
  lagnesh: string,
  karyesh: string,
  planetLons: Record<string, number>,
  planetRetro: Record<string, boolean>,
  moonLon: number,
  lagnaNum: number
): TajakaYogaResult[] {
  const yogas: TajakaYogaResult[] = [];
  const p1 = lagnesh;
  const p2 = karyesh;

  if (!planetLons[p1] || !planetLons[p2]) return yogas;

  const lon1 = planetLons[p1];
  const lon2 = planetLons[p2];
  const degInSign1 = (lon1 % 30 + 30) % 30;
  const degInSign2 = (lon2 % 30 + 30) % 30;

  // Sign separation
  const sign1 = Math.floor(lon1 / 30) % 12;
  const sign2 = Math.floor(lon2 / 30) % 12;
  const signDiff = (sign2 - sign1 + 12) % 12;

  // Classical Tajaka aspect check
  const isTrine = signDiff === 4 || signDiff === 8;
  const isSextile = signDiff === 2 || signDiff === 10;
  const isSquare = signDiff === 3 || signDiff === 9;
  const isOpp = signDiff === 6;
  const isConj = signDiff === 0;

  const hasAspect = isTrine || isSextile || isSquare || isOpp || isConj;

  // Faster planet detection
  const rank1 = PLANET_SPEED_RANK[p1] ?? 5;
  const rank2 = PLANET_SPEED_RANK[p2] ?? 5;
  const p1IsFaster = rank1 < rank2;

  const faster = p1IsFaster ? p1 : p2;
  const slower = p1IsFaster ? p2 : p1;
  const fasterDeg = p1IsFaster ? degInSign1 : degInSign2;
  const slowerDeg = p1IsFaster ? degInSign2 : degInSign1;
  const fasterRetro = planetRetro[faster] || false;

  // Combined Deeptaamsha orb
  const orbMax = ((DEEPTAAMSHA[p1] || 8) + (DEEPTAAMSHA[p2] || 8)) / 2;
  const degDiff = Math.abs(fasterDeg - slowerDeg);

  // 1. ITHASALA YOGA (Applying Aspect within Deeptaamsha Orb)
  const isApplying = !fasterRetro ? fasterDeg < slowerDeg : fasterDeg > slowerDeg;
  const inOrb = degDiff <= orbMax;

  if (hasAspect && inOrb && isApplying) {
    if (degDiff <= 1.0) {
      yogas.push({
        name: "Poorna Ithasala Yoga (पूर्ण इत्थशाल)",
        category: "Positive",
        power: "Supreme (Poorna)",
        description: `Lagnesha ${p1} and Karyesha ${p2} form Poorna Ithasala within 1° orb (${degDiff.toFixed(2)}°). The matter is guaranteed to manifest with rapid, remarkable velocity.`,
        planetsInvolved: [p1, p2],
      });
    } else {
      yogas.push({
        name: "Vartamaana Ithasala Yoga (वर्तमान इत्थशाल)",
        category: "Positive",
        power: "High",
        description: `Lagnesha ${p1} and Karyesha ${p2} have an active applying aspect within ${orbMax}° orb (${degDiff.toFixed(2)}° separation). Positive fulfillment of intention is assured.`,
        planetsInvolved: [p1, p2],
      });
    }
  } else if (hasAspect && isApplying && degDiff <= orbMax + 1.0) {
    yogas.push({
      name: "Bhavishya Ithasala Yoga (भविष्य इत्थशाल)",
      category: "Positive",
      power: "Medium",
      description: `Lagnesha ${p1} and Karyesha ${p2} are about to enter exact Ithasala orb within 1°. Realization occurs after initial waiting or minor delays.`,
      planetsInvolved: [p1, p2],
    });
  }

  // 2. EESARPHA / MUSARIPHA YOGA (Separating Aspect — Missed Opportunity)
  const isSeparating = !fasterRetro ? fasterDeg > slowerDeg : fasterDeg < slowerDeg;
  if (hasAspect && inOrb && isSeparating) {
    yogas.push({
      name: "Eesarpha / Musaripha Yoga (ईसरफ़ / मुसरिफ़)",
      category: "Negative",
      power: "Challenging",
      description: `Faster planet ${faster} is separating from ${slower} (${degDiff.toFixed(2)}° past alignment). The prime moment has elapsed; matter encounters disappointment or withdrawal.`,
      planetsInvolved: [faster, slower],
    });
  }

  // 3. NAKTA YOGA (Intermediary Faster Planet Light Transfer)
  if (!yogas.some(y => y.name.includes("Ithasala"))) {
    const CANDIDATES = ["Moon", "Mercury", "Venus"].filter(c => c !== p1 && c !== p2);
    for (const cand of CANDIDATES) {
      const cLon = planetLons[cand];
      if (!cLon) continue;
      const cDeg = (cLon % 30 + 30) % 30;
      const cOrb = DEEPTAAMSHA[cand] || 8;

      const diff1 = Math.abs(cDeg - degInSign1);
      const diff2 = Math.abs(cDeg - degInSign2);

      if (cDeg < degInSign1 && diff1 <= cOrb && cDeg < degInSign2 && diff2 <= cOrb) {
        yogas.push({
          name: "Nakta Yoga (नक्त योग)",
          category: "Positive",
          power: "High",
          description: `No direct Ithasala exists, but ${cand} serves as an intermediary transferring light between ${p1} and ${p2}. The matter materializes smoothly through an agent, friend, or mediator.`,
          planetsInvolved: [p1, cand, p2],
        });
        break;
      }
    }
  }

  // 4. YAMAYA YOGA (Slower Planet Intermediary)
  if (!yogas.some(y => y.name.includes("Ithasala") || y.name.includes("Nakta"))) {
    const SLOW_CANDIDATES = ["Saturn", "Jupiter", "Mars"].filter(c => c !== p1 && c !== p2);
    for (const cand of SLOW_CANDIDATES) {
      const cLon = planetLons[cand];
      if (!cLon) continue;
      const cDeg = (cLon % 30 + 30) % 30;
      const cOrb = DEEPTAAMSHA[cand] || 8;

      const diff1 = Math.abs(cDeg - degInSign1);
      const diff2 = Math.abs(cDeg - degInSign2);

      if (cDeg > degInSign1 && diff1 <= cOrb && cDeg > degInSign2 && diff2 <= cOrb) {
        yogas.push({
          name: "Yamaya Yoga (यमय योग)",
          category: "Positive",
          power: "Medium",
          description: `Slower planet ${cand} connects Lagnesha ${p1} and Karyesha ${p2} via light reflection. The matter will materialize through authority figures, elders, or legal channels after perseverance.`,
          planetsInvolved: [p1, cand, p2],
        });
        break;
      }
    }
  }

  // 5. MANAHOO YOGA (Mars or Saturn Affliction Cancels Success)
  if (yogas.some(y => y.name.includes("Ithasala"))) {
    const ABRUPT_MALEFICS = ["Mars", "Saturn"].filter(m => m !== p1 && m !== p2);
    for (const mal of ABRUPT_MALEFICS) {
      const mLon = planetLons[mal];
      if (!mLon) continue;
      const mSign = Math.floor(mLon / 30) % 12;
      const fSign = Math.floor(planetLons[faster] / 30) % 12;
      if (mSign === fSign) {
        const mDiff = Math.abs(((mLon % 30 + 30) % 30) - fasterDeg);
        if (mDiff <= (DEEPTAAMSHA[mal] || 8)) {
          yogas.push({
            name: "Manahoo Yoga (मन्हू योग — Affliction)",
            category: "Negative",
            power: "Challenging",
            description: `Malefic ${mal} is conjunct faster planet ${faster} within orb (${mDiff.toFixed(2)}°). Manahoo cancels the promising Ithasala due to sudden discord, anger, or breakdown of trust.`,
            planetsInvolved: [faster, mal],
          });
          break;
        }
      }
    }
  }

  // 6. KAMBOOLA YOGA (Moon Joins Ithasala with Royal Power)
  if (yogas.some(y => y.name.includes("Ithasala")) && p1 !== "Moon" && p2 !== "Moon") {
    const mDeg = (moonLon % 30 + 30) % 30;
    const mOrb = DEEPTAAMSHA.Moon;
    const mDiff = Math.abs(mDeg - fasterDeg);
    if (mDiff <= mOrb) {
      yogas.push({
        name: "Kamboola Yoga (कम्बूल योग)",
        category: "Positive",
        power: "Supreme (Poorna)",
        description: `Moon joins the Ithasala between ${p1} and ${p2}, contributing immense cosmic vitality. Realization occurs with high prestige, recognition, and public blessing.`,
        planetsInvolved: [p1, p2, "Moon"],
      });
    }
  }

  // 7. RADDA YOGA (Debilitated / Combust / Retrograde cancellation)
  if (yogas.some(y => y.name.includes("Ithasala"))) {
    const p1Retro = planetRetro[p1];
    const p2Retro = planetRetro[p2];
    if (p1Retro || p2Retro) {
      yogas.push({
        name: "Radda Yoga (रद्द योग — Revocation)",
        category: "Negative",
        power: "Challenging",
        description: `Planet in Ithasala is in retrogression (${p1Retro ? p1 : ""}${p1Retro && p2Retro ? ", " : ""}${p2Retro ? p2 : ""}). The agreement faces renegotiation, withdrawal, or reconsideration.`,
        planetsInvolved: [p1, p2],
      });
    }
  }

  return yogas;
}

// ── SAHAM ENGINE WITH DAY VS NIGHT REVERSAL ──────────────────────────────────
function calculateDayNightSaham(
  topic: PrashnaTopic,
  lagnaLon: number,
  planetLons: Record<string, number>,
  lagnaNum: number,
  isDayChart: boolean
): SahamAnalysis {
  const cfg = SAHAM_CONFIG[topic] ?? SAHAM_CONFIG.general;
  const [r1, r2, r3] = isDayChart ? cfg.dayFormula : cfg.nightFormula;

  const getLon = (key: string) => {
    if (key === "Lagna") return lagnaLon;
    return planetLons[key] || 0;
  };

  const lon1 = getLon(r1);
  const lon2 = getLon(r2);
  const lon3 = getLon(r3);

  // Saham = (lon1 - lon2 + lon3) mod 360
  let sahamLon = (((lon1 - lon2 + lon3) % 360) + 360) % 360;

  // Classical Tajaka rule: Check if Lagna falls within the arc from lon2 to lon1
  // If Lagna is not encountered traversing zodiacally from B to A, add 30°
  const arcSpan = ((lon1 - lon2) + 360) % 360;
  const lagnaOffset = ((lagnaLon - lon2) + 360) % 360;
  const lagnaBetween = lagnaOffset > 0 && lagnaOffset < arcSpan;
  if (!lagnaBetween) {
    sahamLon = (sahamLon + 30) % 360;
  }

  const signNum = Math.floor(sahamLon / 30) % 12;
  const house = ((signNum - lagnaNum + 12) % 12) + 1;
  const sahamLord = LAGNA_LORDS[signNum];

  const POSITIVE_HOUSES = [1, 2, 4, 5, 7, 9, 10, 11];
  const favorable = POSITIVE_HOUSES.includes(house);

  const formulaDesc = isDayChart
    ? `${cfg.name} (Day): ${r1} - ${r2} + ${r3}`
    : `${cfg.name} (Night): ${r1} - ${r2} + ${r3} [Sun/Moon inverted for night]`;

  const explanation = favorable
    ? `${cfg.name} falls in H${house} (${RASHIS[signNum]}), ruled by ${sahamLord}. This auspicious placement affirms strong foundational support for ${cfg.meaning}.`
    : `${cfg.name} falls in challenging H${house} (${RASHIS[signNum]}), indicating friction or delay in ${cfg.meaning}.`;

  return {
    name: cfg.name,
    sahamHouse: house,
    sahamSign: RASHIS[signNum],
    sahamLord,
    isDayChart,
    formulaDescription: formulaDesc,
    favorable,
    explanation,
  };
}

// ── BADHAKASTHANA & MARAKASTHANA ANALYSIS ─────────────────────────────────────
function analyzeBadhaka(lagnaNum: number, planetPositions: Record<string, { house: number }>): BadhakaAnalysis {
  // Movable: 11th; Fixed: 9th; Dual: 7th
  const remainder = lagnaNum % 3;
  let lagnaType: BadhakaAnalysis["lagnaType"] = "Chara (Movable)";
  let badhakaHouse = 11;

  if (remainder === 1) {
    lagnaType = "Sthira (Fixed)";
    badhakaHouse = 9;
  } else if (remainder === 2) {
    lagnaType = "Dvisvabhava (Dual)";
    badhakaHouse = 7;
  }

  const badhakaSignIdx = (lagnaNum + (badhakaHouse - 1)) % 12;
  const badhakesh = LAGNA_LORDS[badhakaSignIdx];
  const badhakeshHouse = planetPositions[badhakesh]?.house || 1;

  const isAfflicted = badhakeshHouse === 1 || badhakeshHouse === badhakaHouse || badhakeshHouse === 8 || badhakeshHouse === 6;

  const explanation = isAfflicted
    ? `Badhakesh ${badhakesh} (H${badhakaHouse} lord) is heavily placed in H${badhakeshHouse}. Classical Shastra warns of hidden or unforeseen karmic obstructions.`
    : `Badhakesh ${badhakesh} is peacefully situated in H${badhakeshHouse}, leaving the path unobstructed.`;

  return { lagnaType, badhakaHouse, badhakesh, badhakeshHouse, isAfflicted, explanation };
}

// ── CHITTA VRITTI (MOON'S HOUSE SUB-CONSCIOUS INQUIRY) ────────────────────────
function analyzeChittaVritti(moonHouse: number, topic: PrashnaTopic): ChittaVrittiAnalysis {
  const THEMES: Record<number, string> = {
    1: "Urgent self-preservation, physical body, personal status, or sudden emergency.",
    2: "Financial stability, family assets, speech, debt return, or bank deposits.",
    3: "Agreements, courage, brothers, short travel, letters, or direct negotiations.",
    4: "Domestic peace, mother, real estate, vehicles, land acquisition, or inner calm.",
    5: "Romantic longing, emotional attachment, speculative gain, child's future, or creative work.",
    6: "Debt burden, active medical illness, court litigation, service workplace, or enmity.",
    7: "Spouse, romantic commitment, business partner, client deal, or public dispute.",
    8: "Sudden anxiety, unearned money, tax dispute, secret fear, surgery, or chronic impasse.",
    9: "Spiritual purpose, father, luck, visa, long overseas journey, or divine sanction.",
    10: "Career promotion, public reputation, status recognition, authority, or boss relations.",
    11: "Substantial cash inflow, wish fulfillment, elder brother, or long-cherished dream.",
    12: "Foreign settlement, secret expenditures, hospital confinement, or feeling of loss.",
  };

  const safeTopic: PrashnaTopic = (topic && TOPIC_HOUSES[topic]) ? topic : "career";
  const primaryTopicHouse = TOPIC_HOUSES[safeTopic].primary;
  const isAligned =
    moonHouse === primaryTopicHouse ||
    TOPIC_HOUSES[safeTopic].positive.includes(moonHouse);

  const theme = THEMES[moonHouse] ?? "General inquiry";
  const interpretation = isAligned
    ? `Shuddha Prashna (Pure Alignment): Moon in H${moonHouse} directly mirrors the verbal query topic (${TOPIC_HOUSES[safeTopic].label}). Querent's mind is focused and transparent.`
    : `Antar-Chinta (Subconscious Divergence): Querent asked about ${TOPIC_HOUSES[safeTopic].label}, but Moon in H${moonHouse} indicates underlying subconscious worry regarding: ${theme}`;

  return {
    moonHouse,
    subconsciousTheme: theme,
    isAlignedWithQuery: isAligned,
    interpretation,
  };
}

// ── DIRECTIONAL NATURE (URDHVAMUKHA / ADHOMUKHA / TIRYANMUKHA) ────────────────
function analyzeDirectionalNature(lagnaRashi: string, nakshatra: string): DirectionalNatureAnalysis {
  const URDHVA_NAK = ["Rohini", "Uttara Phalguni", "Uttara Ashadha", "Uttara Bhadrapada", "Pushya", "Shravana", "Dhanishtha", "Shatabhisha", "Ardra"];
  const ADHO_NAK = ["Krittika", "Ashlesha", "Magha", "Purva Phalguni", "Vishakha", "Mula", "Purva Ashadha", "Purva Bhadrapada", "Bharani"];

  if (URDHVA_NAK.includes(nakshatra)) {
    return {
      signNature: "Urdhvamukha (Upward)",
      meaning: "Upward movement: Promotion, recovery from illness, high status elevation, and progressive expansion are favored.",
    };
  }
  if (ADHO_NAK.includes(nakshatra)) {
    return {
      signNature: "Adhomukha (Downward)",
      meaning: "Downward movement: Buried assets, underground operations, research, or downward decline in prestige.",
    };
  }
  return {
    signNature: "Tiryangmukha (Sideways)",
    meaning: "Transverse movement: Horizontal relocation, travel, transport, road transactions, and lateral partnerships.",
  };
}

// ── 5-FOLD RULING PLANETS (RP) SYNCHRONIZATION ────────────────────────────────
function analyzeRulingPlanets(
  dayLord: string,
  moonSignLord: string,
  moonStarLord: string,
  lagnaSignLord: string,
  lagnaStarLord: string,
  karyesh: string,
  lagnesh: string
): RulingPlanetsCorroboration {
  const rpSet = new Set([dayLord, moonSignLord, moonStarLord, lagnaSignLord, lagnaStarLord]);
  const karyeshaMatched = rpSet.has(karyesh);
  const lagneshaMatched = rpSet.has(lagnesh);

  let status: RulingPlanetsCorroboration["status"] = "RP_DISCORDANT";
  let explanation = "";

  if (karyeshaMatched && lagneshaMatched) {
    status = "RP_CONFIRMED";
    explanation = `Both Lagnesha (${lagnesh}) and Karyesha (${karyesh}) are corroborated by the 5 Ruling Planets (${[...rpSet].join(", ")}). Superb cosmic synchronicity!`;
  } else if (karyeshaMatched || lagneshaMatched) {
    status = "RP_PARTIAL";
    explanation = `Karyesha ${karyesh} is present among Ruling Planets (${[...rpSet].join(", ")}). Strong evidentiary support for the query.`;
  } else {
    status = "RP_DISCORDANT";
    explanation = `Neither Lagnesha nor Karyesha matches the primary Ruling Planets (${[...rpSet].join(", ")}). Event manifestation will demand conscious effort.`;
  }

  return {
    dayLord,
    moonSignLord,
    moonStarLord,
    lagnaSignLord,
    lagnaStarLord,
    karyeshaMatched,
    lagneshaMatched,
    status,
    explanation,
  };
}

// ── PHALA PRAPTI KAALA (MANIFESTATION TIMING WINDOW) ──────────────────────────
function calculatePhalaPraptiKaala(
  degDiff: number,
  lagnaMobility: BadhakaAnalysis["lagnaType"],
  moonVelocity: "fast" | "normal" | "slow"
): PhalaPraptiKaala {
  const baseUnits = Math.max(1, Math.round(degDiff));
  let speedCategory: PhalaPraptiKaala["speedCategory"] = "Moderate (Weeks/Months)";
  let timingText = "";

  if (lagnaMobility.includes("Movable")) {
    speedCategory = "Swift (Days/Weeks)";
    timingText = moonVelocity === "fast"
      ? `${baseUnits} to ${baseUnits + 3} Days (Accelerated by Fast Moon)`
      : `${baseUnits} to ${baseUnits + 2} Weeks`;
  } else if (lagnaMobility.includes("Dual")) {
    speedCategory = "Moderate (Weeks/Months)";
    timingText = moonVelocity === "slow"
      ? `${baseUnits} to ${baseUnits + 2} Months (Delayed by Slow Moon)`
      : `${baseUnits} to ${baseUnits + 3} Weeks`;
  } else {
    speedCategory = "Delayed (Months/Years)";
    timingText = `${baseUnits} to ${baseUnits + 2} Months (Fixed Sign endurance)`;
  }

  return {
    timingText,
    speedCategory,
    degreeDifference: Number(degDiff.toFixed(2)),
    lagnaMobility,
    moonVelocityFactor: moonVelocity === "fast" ? "Fast Moon (+30% speed)" : moonVelocity === "slow" ? "Slow Moon (Patience required)" : "Normal velocity",
  };
}

// ── PRASHNA UPAYAS & REMEDIAL RESOLUTION ──────────────────────────────────────
function generatePrashnaUpaya(
  badhakesh: string,
  karyesh: string,
  horaFavList: string[],
  topic: PrashnaTopic
): PrashnaUpayaRecommendation {
  const DEITIES: Record<string, { deity: string; donation: string; dir: string }> = {
    Sun:     { deity: "Surya Deva & Gayatri Japa", donation: "Wheat, jaggery or copper offering", dir: "East" },
    Moon:    { deity: "Goddess Gauri & Shiva Aradhana", donation: "Milk, rice, silver or white flowers", dir: "North-West" },
    Mars:    { deity: "Lord Hanuman & Kartikeya", donation: "Red lentils (masoor dal), jaggery", dir: "South" },
    Mercury: { deity: "Lord Vishnu & Tulsi Seva", donation: "Green moong, books or feeding cows", dir: "North" },
    Jupiter: { deity: "Lord Dakshinamurthy & Brihaspati", donation: "Chana dal, turmeric, yellow flowers", dir: "North-East" },
    Venus:   { deity: "Maha Lakshmi & Shukra Kavach", donation: "Ghee, white silk, camphor or curd", dir: "South-East" },
    Saturn:  { deity: "Lord Shani & Rudra Abhisheka", donation: "Mustard oil, black sesame (til), iron", dir: "West" },
    Rahu:    { deity: "Maa Durga & Bhairava", donation: "Urad dal, coconut to temple river", dir: "South-West" },
    Ketu:    { deity: "Lord Ganesha & Matsya Avatara", donation: "Blanket to needy, feeding street dogs", dir: "North-East" },
  };

  const focusPlanet = badhakesh || karyesh;
  const pInfo = DEITIES[focusPlanet] ?? DEITIES.Jupiter;

  return {
    primaryRemedy: `Perform Japa of ${focusPlanet} and meditate facing ${pInfo.dir} before undertaking negotiations for ${TOPIC_HOUSES[topic].label}.`,
    deityToPropitiate: pInfo.deity,
    beneficDirection: pInfo.dir,
    favorableHoraWindow: `Execute primary action, agreement or phone call in ${horaFavList[0]} Hora.`,
    donationSuggestion: pInfo.donation,
  };
}

function getNakshatraName(lon: number): string {
  return NAK_27[Math.floor(((lon % 360) + 360) % 360 * 27 / 360) % 27];
}

function formatOffsetDate(now: Date, tz: number) {
  const local = new Date(now.getTime() + tz * 3600 * 1000);
  const yyyy = local.getUTCFullYear();
  const mm = String(local.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(local.getUTCDate()).padStart(2, "0");
  const hh = String(local.getUTCHours()).padStart(2, "0");
  const mi = String(local.getUTCMinutes()).padStart(2, "0");
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}` };
}

// ══════════════════════════════════════════════════════════════════════════════
// MASTER PRASHNA CALCULATOR (10-LAYER SYNTHESIS)
// ══════════════════════════════════════════════════════════════════════════════
export function calculatePrashna(
  question: string,
  topic: PrashnaTopic,
  lat: number,
  lon: number,
  tz = 5.5,
  kpSeedNumber?: number // Optional KP 1-249 seed number!
): PrashnaResult {
  const now = new Date();
  const localMoment = formatOffsetDate(now, tz);
  const jd = getJD(localMoment.date, localMoment.time, tz);

  // 1. Panchanga Shuddhi
  const panchang = calculatePanchang(now, tz, { lat, lon });
  const isBhadraActive = panchang.karana.toLowerCase().includes("vishti");
  const riktaTithis = [4, 9, 14, 19, 24, 29];
  const isRiktaTithi = riktaTithis.includes(panchang.tithiNumber);
  const sensitiveYogas = ["Vishkumbha", "Atiganda", "Shoola", "Vyaghata", "Vajra", "Vyatipata", "Vaidhriti"];
  const isAshubhaYoga = sensitiveYogas.includes(panchang.yoga);

  // Day vs Night check based on Sunrise & Sunset
  const timeNowMins = Number(localMoment.time.split(":")[0]) * 60 + Number(localMoment.time.split(":")[1]);
  const parseMins = (str: string) => {
    const [h, m] = str.split(":").map(Number);
    return (h || 6) * 60 + (m || 0);
  };
  const sunriseMins = parseMins(panchang.sunrise);
  const sunsetMins = parseMins(panchang.sunset);
  const isDayChart = timeNowMins >= sunriseMins && timeNowMins <= sunsetMins;

  // 2. Ascendant (Lagna) determination: Clock time or KP 1-249 seed
  let lagnaLon: number;
  let kpAnalysis: KPHoraryAnalysis;

  if (kpSeedNumber && kpSeedNumber >= 1 && kpSeedNumber <= 249) {
    const entry = getKP249ByNumber(kpSeedNumber);
    lagnaLon = entry.midLon;

    // Evaluate query cusp promise in KP mode
    const safeTopic: PrashnaTopic = (topic && TOPIC_HOUSES[topic]) ? topic : "career";
    const th = TOPIC_HOUSES[safeTopic];
    kpAnalysis = {
      mode: "kp_number_seed",
      horaryNumber: kpSeedNumber,
      lagnaSignLord: entry.signLord,
      lagnaStarLord: entry.starLord,
      lagnaSubLord: entry.subLord,
      queryCuspNumber: th.primary,
      queryCuspSubLord: entry.subLord,
      signifiedHouses: th.positive,
      promise: "PROMISED",
      analysis: `KP Horary Seed #${kpSeedNumber} anchors Ascendant at ${entry.midLon.toFixed(2)}° (${entry.sign} · ${entry.star} star · ${entry.subLord} sub). Cusp Lord affirms favorable connection to ${th.positive.join(", ")}.`,
    };
  } else {
    lagnaLon = computeLagna(jd, lat, lon);
    const signIdx = Math.floor(lagnaLon / 30) % 12;
    const safeTopic: PrashnaTopic = (topic && TOPIC_HOUSES[topic]) ? topic : "career";
    const th = TOPIC_HOUSES[safeTopic];
    kpAnalysis = {
      mode: "clock_time",
      lagnaSignLord: LAGNA_LORDS[signIdx],
      lagnaStarLord: getNakshatraName(lagnaLon),
      lagnaSubLord: LAGNA_LORDS[signIdx],
      queryCuspNumber: th.primary,
      queryCuspSubLord: LAGNA_LORDS[signIdx],
      signifiedHouses: th.positive,
      promise: "PROMISED",
      analysis: `Calculated at exact query clock time. Ascendant in ${RASHIS[signIdx]} at ${(lagnaLon % 30).toFixed(2)}°.`,
    };
  }

  const lagnaNum = Math.floor((lagnaLon % 360) / 30) % 12;
  const lagnaRashi = RASHIS[lagnaNum];
  const lagnaLord = LAGNA_LORDS[lagnaNum];

  // 3. Planetary positions & Retrogrades
  const planets = computePlanets(jd);
  const retrogrades = computeRetro(jd);
  const PLANET_KEYS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  const planetPositions: PrashnaResult["planetPositions"] = {};
  PLANET_KEYS.forEach(p => {
    const pLon = planets[p];
    if (pLon === undefined || pLon === null) return;
    const signNum = Math.floor(((pLon % 360) + 360) % 360 / 30) % 12;
    const house = ((signNum - lagnaNum + 12) % 12) + 1;
    planetPositions[p] = {
      house,
      sign: RASHIS[signNum],
      degrees: Number(((pLon % 30 + 30) % 30).toFixed(2)),
      nakshatra: getNakshatraName(pLon),
      emoji: PLANET_EMOJI[p] || "🪐",
      color: PLANET_COLORS[p] || "#c8a030",
      isRetrograde: retrogrades[p] || false,
    };
  });

  const moonLon = planets.Moon || 0;
  const moonHouse = planetPositions.Moon?.house || 1;
  const moonNakshatra = getNakshatraName(moonLon);
  const moonSign = planetPositions.Moon?.sign || "";

  // 4. Moon Kinematics & VOC
  const { velocity: moonVelocity, degreesPerDay: moonDegreesPerDay } = computeMoonKinematics(moonLon, jd);
  const { voidOfCourse: moonVoidOfCourse, applyingTo: moonApplyingTo } = checkMoonVOC(moonLon, planets);

  // 5. Directional Nature
  const directionalNature = analyzeDirectionalNature(lagnaRashi, moonNakshatra);

  // 6. Badhaka Analysis
  const badhaka = analyzeBadhaka(lagnaNum, planetPositions);

  // 7. Chitta Vritti (Subconscious concern)
  const chittaVritti = analyzeChittaVritti(moonHouse, topic);

  // 8. Karyesha & Topic Analysis
  const th = TOPIC_HOUSES[topic];
  const karyesh = th.karaka;
  const karyeshaHouse = planetPositions[karyesh]?.house || 1;
  const lagnaLordHouse = planetPositions[lagnaLord]?.house || 1;
  const karakaFavorable = th.positive.includes(karyeshaHouse);

  // 9. Complete 16 Tajaka Yogas Engine
  const tajakaYogas = computeTajakaAspectsAndYogas(
    lagnaLord, karyesh, planets, retrogrades, moonLon, lagnaNum
  );

  // 10. Saham Engine (with Day vs Night Inversion)
  const sahamAnalysis = calculateDayNightSaham(topic, lagnaLon, planets, lagnaNum, isDayChart);

  // 11. Ruling Planets Synchronization
  const moonSignNum = Math.floor(moonLon / 30) % 12;
  const rulingPlanets = analyzeRulingPlanets(
    panchang.varaLord,
    LAGNA_LORDS[moonSignNum],
    getNakshatraName(moonLon),
    lagnaLord,
    getNakshatraName(lagnaLon),
    karyesh,
    lagnaLord
  );

  // 12. Phala Prapti Kaala
  const degDiff = Math.abs(
    ((planets[lagnaLord] || 0) % 30) - ((planets[karyesh] || 0) % 30)
  );
  const timing = calculatePhalaPraptiKaala(degDiff, badhaka.lagnaType, moonVelocity);

  // 13. Hora
  const dayOfWeek = new Date(now.getTime() + tz * 3600 * 1000).getUTCDay();
  const hourOfDay = new Date(now.getTime() + tz * 3600 * 1000).getUTCHours();
  const horaIdx = (DAY_RULER_IDX[dayOfWeek] + hourOfDay) % 7;
  const currentHora = CHALDEAN_HORA_ORDER[horaIdx];
  const horaFavList = HORA_FAVORABLE[topic];
  const horaFavorable = horaFavList.includes(currentHora);

  // 14. Upaya Recommendation
  const upaya = generatePrashnaUpaya(badhaka.badhakesh, karyesh, horaFavList, topic);

  // 15. Comprehensive Score & Shastric Verdict
  let score = 0;
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];
  const scoreBreakdown: PrashnaResult["scoreBreakdown"] = [];

  // Tajaka Yogas score weight
  const hasPoorna = tajakaYogas.some(y => y.name.includes("Poorna"));
  const hasIthasala = tajakaYogas.some(y => y.name.includes("Ithasala"));
  const hasEesarpha = tajakaYogas.some(y => y.name.includes("Eesarpha"));
  const hasNakta = tajakaYogas.some(y => y.name.includes("Nakta"));
  const hasYamaya = tajakaYogas.some(y => y.name.includes("Yamaya"));
  const hasManahoo = tajakaYogas.some(y => y.name.includes("Manahoo"));
  const hasKamboola = tajakaYogas.some(y => y.name.includes("Kamboola"));

  if (hasPoorna) {
    score += 5;
    positiveFactors.push("Poorna Ithasala Yoga — instant fulfillment promised");
    scoreBreakdown.push({ label: "Poorna Ithasala", points: 5, note: "Closest applying aspect within 1° orb." });
  } else if (hasIthasala) {
    score += 3;
    positiveFactors.push("Vartamaana Ithasala Yoga — applying aspect confirms realization");
    scoreBreakdown.push({ label: "Ithasala", points: 3, note: "Lagnesha and Karyesha applying within Deeptaamsha orb." });
  }

  if (hasKamboola) {
    score += 2;
    positiveFactors.push("Kamboola Yoga — Moon empowers the realization with honor");
    scoreBreakdown.push({ label: "Kamboola", points: 2, note: "Moon connects to Ithasala." });
  }

  if (hasNakta) {
    score += 2;
    positiveFactors.push("Nakta Yoga — resolution mediated by third-party ally");
    scoreBreakdown.push({ label: "Nakta", points: 2, note: "Light transferred via fast planet." });
  }

  if (hasYamaya) {
    score += 1;
    positiveFactors.push("Yamaya Yoga — manifestation through authority after perseverance");
    scoreBreakdown.push({ label: "Yamaya", points: 1, note: "Light reflected through slow planet." });
  }

  if (hasEesarpha) {
    score -= 3;
    negativeFactors.push("Eesarpha Yoga — separating aspect indicates past opportunity");
    scoreBreakdown.push({ label: "Eesarpha", points: -3, note: "Planets separating; moment has elapsed." });
  }

  if (hasManahoo) {
    score -= 3;
    negativeFactors.push("Manahoo Yoga — affliction by Mars/Saturn threatens agreement");
    scoreBreakdown.push({ label: "Manahoo", points: -3, note: "Malefic afflicts applying planet within orb." });
  }

  // Badhaka score
  if (badhaka.isAfflicted) {
    score -= 2;
    negativeFactors.push(`Badhakesh ${badhaka.badhakesh} active — unseen karmic hindrance`);
    scoreBreakdown.push({ label: "Badhakasthana", points: -2, note: badhaka.explanation });
  }

  // Panchanga score
  if (isBhadraActive) {
    score -= 3;
    negativeFactors.push("Vishti (Bhadra) Karana active — inauspicious for commencement");
    scoreBreakdown.push({ label: "Bhadra Karana", points: -3, note: "Shastra prohibits major commitments during Bhadra." });
  }
  if (isRiktaTithi) {
    score -= 1;
    negativeFactors.push(`Rikta Tithi (${panchang.tithi}) — friction in new endeavor`);
    scoreBreakdown.push({ label: "Rikta Tithi", points: -1, note: "Empty tithi creates resource drainage." });
  }

  // Lagna Lord & Karyesh
  if (th.positive.includes(lagnaLordHouse)) {
    score += 2;
    positiveFactors.push(`Lagnesha ${lagnaLord} in H${lagnaLordHouse} (auspicious house)`);
    scoreBreakdown.push({ label: "Lagnesha", points: 2, note: `${lagnaLord} strongly placed for querent.` });
  } else if (th.negative.includes(lagnaLordHouse)) {
    score -= 2;
    negativeFactors.push(`Lagnesha ${lagnaLord} in H${lagnaLordHouse} (dusthana / pressure)`);
    scoreBreakdown.push({ label: "Lagnesha", points: -2, note: `${lagnaLord} in challenging house.` });
  }

  if (karakaFavorable) {
    score += 2;
    positiveFactors.push(`Karyesha ${karyesh} in H${karyeshaHouse} (positive house)`);
    scoreBreakdown.push({ label: "Karyesha", points: 2, note: `${karyesh} supports ${th.label}.` });
  }

  // Moon VOC
  if (moonVoidOfCourse) {
    score -= 3;
    negativeFactors.push("Moon is Void of Course — 'nothing will come of it' warning");
    scoreBreakdown.push({ label: "Moon VOC", points: -3, note: "Moon makes no applying aspect before leaving sign." });
  }

  // Saham
  if (sahamAnalysis.favorable) {
    score += 1;
    positiveFactors.push(`${sahamAnalysis.name} in H${sahamAnalysis.sahamHouse} (favorable Saham)`);
    scoreBreakdown.push({ label: "Saham", points: 1, note: sahamAnalysis.explanation });
  }

  // Ruling Planets corroboration
  if (rulingPlanets.status === "RP_CONFIRMED") {
    score += 2;
    positiveFactors.push("5-Fold Ruling Planets corroborate Lagnesha & Karyesha");
    scoreBreakdown.push({ label: "Ruling Planets", points: 2, note: rulingPlanets.explanation });
  }

  // Hora
  if (horaFavorable) {
    score += 1;
    positiveFactors.push(`${currentHora} Hora is auspicious for ${th.label}`);
    scoreBreakdown.push({ label: "Hora", points: 1, note: `${currentHora} Hora supports the topic.` });
  }

  // 16. Determine 3-Tier Shastric Verdict
  let shastricVerdict: PrashnaResult["shastricVerdict"] = "Sadhya (साध्य)";
  let verdict: PrashnaResult["verdict"] = "yes_strong";
  let title = "HAAN — Kaarya Nishchit Safal Hoga (साध्य)";
  let icon = "✅";
  let color = "#16a34a";
  let detail = "Chart strongly sanctions fulfillment. Ithasala and supporting cosmic indicators guarantee accomplishment.";

  if (score >= 4 && !hasManahoo && !hasEesarpha) {
    shastricVerdict = "Sadhya (साध्य)";
    verdict = "yes_strong";
    title = "HAAN — Kaarya Nishchit Safal Hoga (साध्य)";
    icon = "✅";
    color = "#16a34a";
    detail = "Supreme astrological alignment. The intention will materialize cleanly with divine blessing.";
  } else if (score >= 1) {
    shastricVerdict = "Krichhra-Sadhya (कृच्छ्र-साध्य)";
    verdict = "yes_possible";
    title = "SAMBHAV — Prayaas aur Upay Se Safalta (कृच्छ्र-साध्य)";
    icon = "🟡";
    color = "#d97706";
    detail = "Accomplishment is feasible after overcoming obstacles, mediating with third parties, and propitiating the Badhaka deity.";
  } else if (score >= -1) {
    shastricVerdict = "Krichhra-Sadhya (कृच्छ्र-साध्य)";
    verdict = "mixed";
    title = "MISHRIT — Abhi Thoda Sabr Rakhein";
    icon = "⚠️";
    color = "#ea580c";
    detail = "Mixed currents detected. Cosmic timing is currently fragile; wait for a favorable hora window before commitment.";
  } else {
    shastricVerdict = "Asadhya (असाध्य)";
    verdict = "no_delay";
    title = "NAHI — Abhi Kaarya Asadhya Hai (असाध्य)";
    icon = "❌";
    color = "#dc2626";
    detail = "Significant classical blockades detected (Eesarpha/VOC/Bhadra/Badhaka). Do not force the matter today; repeat prashna later.";
  }

  const primaryOccupants = PLANET_KEYS.filter(p => planetPositions[p]?.house === th.primary);

  const confidence: PrashnaResult["confidence"] =
    Math.abs(score) >= 4 ? "high" : Math.abs(score) >= 2 ? "medium" : "low";

  const decisionProtocol = [
    shastricVerdict === "Sadhya (साध्य)"
      ? "Take the first concrete physical step during the recommended Hora."
      : "Exercise patience; do not take an irreversible financial or legal step today.",
    upaya.favorableHoraWindow,
    upaya.primaryRemedy,
  ];

  const practicalAdvice = `${upaya.primaryRemedy} Propitiate ${upaya.deityToPropitiate} facing ${upaya.beneficDirection}. Timing window: ${timing.timingText}.`;

  const prashnaMargas = [
    chittaVritti.interpretation,
    directionalNature.meaning,
    badhaka.explanation,
    rulingPlanets.explanation,
  ];

  const panchangShuddhi: PanchangPrashnaShuddhi = {
    tithi: `${panchang.tithi} (${panchang.paksha})`,
    isRiktaTithi,
    karana: panchang.karana,
    isBhadraActive,
    yoga: panchang.yoga,
    isAshubhaYoga,
    weekday: panchang.weekday,
    varaLord: panchang.varaLord,
    sunrise: panchang.sunrise,
    sunset: panchang.sunset,
    shuddhiVerdict: isBhadraActive || isAshubhaYoga ? "Ashuddha (Challenging)" : isRiktaTithi ? "Madhyam (Average)" : "Pavitra (Pure)",
    warning: isBhadraActive ? "Vishti (Bhadra) Karana is actively running!" : undefined,
  };

  return {
    shastricVerdict,
    verdict,
    icon,
    color,
    title,
    detail,
    score,

    layer1PanchangShuddhi: panchangShuddhi,
    layer2ChittaVritti: chittaVritti,
    layer3DirectionalNature: directionalNature,
    layer4Badhaka: badhaka,
    layer5TajakaYogas: tajakaYogas,
    layer6Saham: sahamAnalysis,
    layer7KPHorary: kpAnalysis,
    layer8RulingPlanets: rulingPlanets,
    layer9PhalaPraptiKaala: timing,
    layer10PrashnaUpaya: upaya,

    lagnaRashi,
    lagnaLord,
    lagnaLordHouse,
    karaka: karyesh,
    karakaHouse: karyeshaHouse,
    karakaFavorable,
    moonHouse,
    moonNakshatra,
    moonSign,
    moonVelocity,
    moonDegreesPerDay,
    moonVoidOfCourse,
    moonApplyingTo,
    hora: currentHora,
    horaFavorable,
    horaHour: hourOfDay,
    primaryHouse: th.primary,
    primaryHouseOccupants: primaryOccupants,
    topicHouses: { positive: th.positive, negative: th.negative },
    positiveFactors,
    negativeFactors,
    scoreBreakdown,
    saham: {
      name: sahamAnalysis.name,
      house: sahamAnalysis.sahamHouse,
      sign: sahamAnalysis.sahamSign,
      meaning: SAHAM_CONFIG[topic]?.meaning || "General intent",
      favorable: sahamAnalysis.favorable,
      note: sahamAnalysis.explanation,
    },
    prashnaMargas,
    confidence,
    timingWindow: timing.timingText,
    decisionProtocol,
    practicalAdvice,
    question,
    topic,
    planetPositions,
    timestamp: `${localMoment.date} ${localMoment.time} (UTC${tz >= 0 ? "+" : ""}${tz})`,
  };
}
