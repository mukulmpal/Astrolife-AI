/* eslint-disable @typescript-eslint/no-explicit-any */
// ══════════════════════════════════════════════════════════════
// ASTROLIFE — KP System Engine
// Krishnamurti Paddhati · Star Lord · Sub Lord · Cusp · Events
// ══════════════════════════════════════════════════════════════

import {
  computeKPAyanamsha,
  computePlacidusCusps,
  getPlacidusBhavaHouse,
} from "./placidus";
import {
  convertLongitudeBetweenAyanamshas,
  getAyanamshaForEpoch,
  SupportedAyanamsha,
} from "./calculations";
import type {
  KPPredictiveEvidence,
  KPPointEvidence,
} from "./kp-evidence-types";
import { build4FoldHouseSignificators } from "./kp-significators";
import { evaluateAllCuspPromises } from "./kp-cusp-promise";
import { evaluateAllEventRules } from "./kp-event-promise";
import { buildCurrentDashaHierarchyEvidence } from "./kp-dasha-evidence";

export * from "./kp-evidence-types";
export * from "./kp-significators";
export * from "./kp-cusp-promise";
export * from "./kp-rule-registry";
export * from "./kp-event-promise";
export * from "./kp-dasha-evidence";

export type KPPlanet =
  | "Ketu"
  | "Venus"
  | "Sun"
  | "Moon"
  | "Mars"
  | "Rahu"
  | "Jupiter"
  | "Saturn"
  | "Mercury";

export type KPPointName =
  | "Lagna"
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type EventTopic =
  | "career"
  | "marriage"
  | "child"
  | "health"
  | "wealth"
  | "travel"
  | "education"
  | "property"
  | "litigation"
  | "separation";

export interface KPCoordinateProvenance {
  sourceAyanamsha: string;
  targetAyanamsha: string;
  sourceAyanamshaValue: number;
  targetAyanamshaValue: number;
  deltaArcsec: number;
  epochJD: number;
  conversionMethod: string;
  unifiedFrame: boolean;
}

export interface KPPlanetInput {
  lon: number;
  sourceLon?: number;
  sourceAyanamsha?: string;
  kpAyanamsha?: string;
  conversionMethod?: string;
  house: number;
  rashiHouse: number;
  bhavaHouse: number;
  bhavaShift: number;
  rashi: number;
  rashiName: string;
  bhavaNote?: string;
  retrograde?: boolean;
}

export interface NatalKPInput {
  lagR: number;
  lagLon: number;
  planets: Record<string, KPPlanetInput>;
  cuspSource: "provided" | "degree-equal-bhava" | "whole-sign-fallback" | "placidus";
  bhavaMode: "provided" | "degree-equal-bhava" | "whole-sign" | "placidus";
  currentMD?: string;
  currentAD?: string;
  currentPD?: string;
  currentSD?: string;
  dashaPath?: string;
  rawSource?: any;
  coordinateProvenance?: KPCoordinateProvenance;
}

export interface KPRow {
  name: KPPointName;
  lon: number;
  sourceLon?: number;
  sourceAyanamsha?: string;
  kpAyanamsha?: string;
  conversionMethod?: string;
  degreeText: string;
  position: string;
  sign: string;
  signLord: string;
  house: number;
  rashiHouse: number;
  bhavaHouse: number;
  bhavaShift: number;
  bhavaNote: string;
  nakshatra: string;
  starLord: KPPlanet;
  pada: number;
  subLord: KPPlanet;
  subSubLord: KPPlanet;
  subLordPosition: string;
  subLordHouse: number;
  significance: string;
  significatorHouses: number[];
  isSignificantForTopic: boolean;
  topicHit: string;
  retrograde: boolean;
}

export interface KPCuspRow {
  house: number;
  lon: number;
  degreeText: string;
  sign: string;
  signLord: string;
  nakshatra: string;
  starLord: KPPlanet;
  pada: number;
  subLord: KPPlanet;
  subSubLord: KPPlanet;
  source: "provided" | "degree-equal-bhava" | "whole-sign-fallback" | "placidus";
  promise: string;
}

export interface SignificatorSet {
  topic: EventTopic;
  label: string;
  positiveHouses: number[];
  negativeHouses: number[];
  karaka: string;
  occupants: string[];
  lords: Array<{ house: number; lord: string }>;
  starLordLinks: string[];
  subLordLinks: string[];
  cuspSubLord: string;
  cuspPromise: string;
  score: number;
  verdict: "strong" | "moderate" | "weak" | "blocked";
  verdictNote: string;
  dashaLink: string;
  actionPlan: string[];
}

export interface KPForecastMonth {
  month: string;
  period: string;
  dashaLevel: string;
  focus: string;
  score: number;
  probability: "High" | "Medium" | "Low";
  outcome: "Positive" | "Mixed" | "Challenging";
  verdict: "strong" | "moderate" | "weak" | "blocked";
  eventHouses: number[];
  relationship: string;
  careerMoney: string;
  healthCaution: string;
  advice: string;
  caution: string;
}

export interface KPEngineResult {
  input: NatalKPInput;
  rows: KPRow[];
  cusps: KPCuspRow[];
  significators: SignificatorSet[];
  forecast: KPForecastMonth[];
  houseLords: Record<number, string>;
  topEventHints: Array<{ topic: string; color: string; note: string }>;
  subLordSummary: string;
  strongestEvent: SignificatorSet | null;
  weakestEvent: SignificatorSet | null;
  coordinateProvenance?: KPCoordinateProvenance;
  predictiveEvidence?: KPPredictiveEvidence;
}

const DASHA_ORDER: KPPlanet[] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

const DASHA_YEARS: Record<KPPlanet, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

const NAK_LORDS: KPPlanet[] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury",
];

const SIGN_LORD: Record<number, KPPlanet> = {
  0: "Mars",
  1: "Venus",
  2: "Mercury",
  3: "Moon",
  4: "Sun",
  5: "Mercury",
  6: "Venus",
  7: "Mars",
  8: "Jupiter",
  9: "Saturn",
  10: "Saturn",
  11: "Jupiter",
};

const RASHIS_EN = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const TOPIC_DEFS: Record<
  EventTopic,
  {
    label: string;
    positive: number[];
    negative: number[];
    karaka: string;
    desc: string;
    cuspHouse: number;
    actionPlan: string[];
  }
> = {
  career: {
    label: "💼 Career",
    positive: [2, 6, 10, 11],
    negative: [5, 8, 12],
    karaka: "Saturn / Sun / Mercury",
    desc: "Career event becomes stronger when 2-6-10-11 houses are connected through star lord, sub lord, dasha and 10th cusp.",
    cuspHouse: 10,
    actionPlan: [
      "Check 10th cusp sub lord for career promise.",
      "Use 2-6-10-11 periods for job, promotion and work growth.",
      "If 8/12 are heavy, upgrade skill and avoid sudden resignation.",
    ],
  },
  marriage: {
    label: "💍 Marriage",
    positive: [2, 7, 11],
    negative: [1, 6, 10, 12],
    karaka: "Venus / Jupiter",
    desc: "Marriage promise needs 2-7-11. Houses 6-8-12 can delay, conflict or create distance.",
    cuspHouse: 7,
    actionPlan: [
      "Check 7th cusp sub lord before final marriage timing.",
      "2-7-11 support shows settlement, family formation and agreement.",
      "If 6/8/12 dominate, focus on compatibility and patience.",
    ],
  },
  child: {
    label: "👶 Children",
    positive: [2, 5, 11],
    negative: [1, 4, 10],
    karaka: "Jupiter",
    desc: "Child-related outcomes are linked with 2-5-11 and the 5th cusp.",
    cuspHouse: 5,
    actionPlan: [
      "Check 5th cusp sub lord and Jupiter support.",
      "2-5-11 periods are favourable for child matters.",
      "Use medical and practical planning where needed.",
    ],
  },
  health: {
    label: "🏥 Health Sensitivity",
    positive: [1, 5, 11],
    negative: [6, 8, 12],
    karaka: "Sun / Moon / Lagna",
    desc: "This is preventive health guidance only. 6-8-12 pressure needs care, rest and professional advice.",
    cuspHouse: 1,
    actionPlan: [
      "Use this as preventive guidance, not diagnosis.",
      "If 6-8-12 dominate, strengthen routine and consult professionals.",
      "Recovery improves when 1/5/11 support is active.",
    ],
  },
  wealth: {
    label: "💰 Wealth",
    positive: [2, 5, 9, 11],
    negative: [6, 8, 12],
    karaka: "Jupiter / Venus",
    desc: "Money and gains improve when 2-5-9-11 are active and 8/12 are controlled.",
    cuspHouse: 2,
    actionPlan: [
      "Check 2nd and 11th cusp support for income.",
      "Avoid high-risk speculation if 8/12 dominate.",
      "Use strong 2-11 periods for savings and income growth.",
    ],
  },
  travel: {
    label: "✈️ Foreign / Travel",
    positive: [3, 9, 12],
    negative: [4, 10],
    karaka: "Moon / Rahu",
    desc: "Short travel is seen from 3rd, long distance from 9th, foreign settlement from 12th.",
    cuspHouse: 12,
    actionPlan: [
      "Check 9th and 12th cusp for foreign movement.",
      "3-9-12 support helps travel and relocation.",
      "4th house pressure can show emotional attachment to home.",
    ],
  },
  education: {
    label: "📚 Education",
    positive: [4, 5, 9, 11],
    negative: [6, 8, 12],
    karaka: "Mercury / Jupiter",
    desc: "Education success needs 4-5-9-11 with Mercury/Jupiter support.",
    cuspHouse: 4,
    actionPlan: [
      "Check 4th and 9th cusp sub lords.",
      "Use Mercury/Jupiter periods for study and exams.",
      "If 6/8/12 dominate, reduce distraction and improve discipline.",
    ],
  },
  property: {
    label: "🏠 Property",
    positive: [4, 11, 12],
    negative: [3, 6, 8],
    karaka: "Mars / Saturn / Venus",
    desc: "Property and vehicle matters need 4th house, gains from 11th and expense/settlement from 12th.",
    cuspHouse: 4,
    actionPlan: [
      "Check 4th cusp sub lord for property promise.",
      "Use 4-11 periods for purchase and 12th for payment/settlement.",
      "Verify legal documents carefully if 8th is active.",
    ],
  },
  litigation: {
    label: "⚖️ Litigation / Competition",
    positive: [6, 10, 11],
    negative: [8, 12],
    karaka: "Mars / Saturn",
    desc: "Competition and litigation success requires 6th house strength with 10th/11th support.",
    cuspHouse: 6,
    actionPlan: [
      "Keep documents clean and avoid emotional conflict.",
      "6-10-11 periods help defeat competition.",
      "If 8/12 dominate, expenses and hidden stress may rise.",
    ],
  },
  separation: {
    label: "🪐 Separation / Distance",
    positive: [6, 8, 12],
    negative: [2, 7, 11],
    karaka: "Saturn / Rahu / Ketu",
    desc: "Use this carefully. 6-8-12 can show distance, conflict or withdrawal, while 2-7-11 supports repair.",
    cuspHouse: 7,
    actionPlan: [
      "Do not use this as fear-based prediction.",
      "If 2-7-11 are stronger, relationship repair is possible.",
      "If 6-8-12 dominate, focus on maturity and communication.",
    ],
  },
};

export const KP_PLANET_COLORS: Record<string, string> = {
  Sun: "#f97316",
  Moon: "#c084fc",
  Mars: "#ef4444",
  Mercury: "#22c55e",
  Jupiter: "#f59e0b",
  Venus: "#ec4899",
  Saturn: "#60a5fa",
  Rahu: "#a78bfa",
  Ketu: "#fb7185",
  Lagna: "#fbbf24",
};

function md(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function safeNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeLon(value: unknown) {
  return md(safeNumber(value, 0), 360);
}

function signIndexFrom(value: unknown) {
  if (typeof value === "string") {
    const clean = value.trim().toLowerCase();

    const aliases: Record<string, string> = {
      mesh: "Aries",
      aries: "Aries",
      vrishabh: "Taurus",
      taurus: "Taurus",
      mithun: "Gemini",
      gemini: "Gemini",
      kark: "Cancer",
      cancer: "Cancer",
      simha: "Leo",
      leo: "Leo",
      kanya: "Virgo",
      virgo: "Virgo",
      tula: "Libra",
      libra: "Libra",
      vrishchik: "Scorpio",
      scorpio: "Scorpio",
      dhanu: "Sagittarius",
      sagittarius: "Sagittarius",
      makar: "Capricorn",
      capricorn: "Capricorn",
      kumbh: "Aquarius",
      aquarius: "Aquarius",
      meen: "Pisces",
      pisces: "Pisces",
    };

    const normalized = aliases[clean] ?? value;
    const found = RASHIS_EN.findIndex((rashi) => rashi.toLowerCase() === normalized.toLowerCase());
    if (found >= 0) return found;

    const numeric = Number(clean);
    if (Number.isFinite(numeric)) return signIndexFrom(numeric);
  }

  const n = safeNumber(value, 0);

  if (n >= 0 && n <= 11) return Math.round(n);
  if (n >= 1 && n <= 12) return Math.round(n - 1);

  return Math.floor(normalizeLon(n) / 30);
}

function getNakIndex(lon: number) {
  return Math.min(26, Math.floor(md(lon, 360) / (360 / 27)));
}

export function getNakshatra(lon: number): string {
  return NAKSHATRAS[getNakIndex(lon)] ?? "—";
}

export function getStarLord(lon: number): KPPlanet {
  return NAK_LORDS[getNakIndex(lon)] ?? "Ketu";
}

export function getPada(lon: number): number {
  const nakSize = 360 / 27;
  const rem = md(lon, 360) - getNakIndex(lon) * nakSize;
  return Math.min(4, Math.floor(rem / (nakSize / 4)) + 1);
}

export function getSubLord(lon: number): KPPlanet {
  const nakSize = 360 / 27;
  const lonN = md(lon, 360);
  const nakIdx = Math.floor(lonN / nakSize);
  const rem = lonN - nakIdx * nakSize;
  const starLord = NAK_LORDS[nakIdx] ?? "Ketu";
  const startIdx = DASHA_ORDER.indexOf(starLord);

  let acc = 0;

  for (let i = 0; i < 9; i += 1) {
    const subPlanet = DASHA_ORDER[(startIdx + i) % 9];
    const segSize = nakSize * (DASHA_YEARS[subPlanet] / 120);
    acc += segSize;

    if (rem <= acc + 1e-9) return subPlanet;
  }

  return starLord;
}

export function getSubSubLord(lon: number): KPPlanet {
  const nakSize = 360 / 27;
  const lonN = md(lon, 360);
  const nakIdx = Math.floor(lonN / nakSize);
  const rem = lonN - nakIdx * nakSize;
  const starLord = NAK_LORDS[nakIdx] ?? "Ketu";
  const startIdx = DASHA_ORDER.indexOf(starLord);

  let acc1 = 0;

  for (let i = 0; i < 9; i += 1) {
    const subPlanet = DASHA_ORDER[(startIdx + i) % 9];
    const segSize = nakSize * (DASHA_YEARS[subPlanet] / 120);

    if (rem <= acc1 + segSize + 1e-9) {
      const subRem = rem - acc1;
      const subStart = DASHA_ORDER.indexOf(subPlanet);
      let acc2 = 0;

      for (let j = 0; j < 9; j += 1) {
        const ssPlanet = DASHA_ORDER[(subStart + j) % 9];
        const ssSize = segSize * (DASHA_YEARS[ssPlanet] / 120);
        acc2 += ssSize;

        if (subRem <= acc2 + 1e-9) return ssPlanet;
      }

      return subPlanet;
    }

    acc1 += segSize;
  }

  return starLord;
}

export function buildHouseLords(lagR: number): Record<number, string> {
  const lords: Record<number, string> = {};

  for (let h = 1; h <= 12; h += 1) {
    lords[h] = SIGN_LORD[(lagR + h - 1) % 12] ?? "—";
  }

  return lords;
}

function absoluteDegreeText(lon: number) {
  return `${normalizeLon(lon).toFixed(2)}°`;
}

function houseFromLon(lagR: number, lon: number) {
  const sign = Math.floor(md(lon, 360) / 30);
  return md(sign - lagR, 12) + 1;
}

function getChartRoot(input: unknown) {
  const root = (input as Record<string, unknown> | null | undefined) ?? {};
  const rootChart = (root.chart as Record<string, unknown> | undefined) ?? undefined;
  const candidates = [
    root,
    rootChart,
    (rootChart?.chart as Record<string, unknown> | undefined) ?? undefined,
    root.rawChart as Record<string, unknown> | undefined,
    root.kundli as Record<string, unknown> | undefined,
    root.data as Record<string, unknown> | undefined,
    root.birthChart as Record<string, unknown> | undefined,
    root.rasiChart as Record<string, unknown> | undefined,
  ].filter((item): item is Record<string, unknown> => Boolean(item));

  // Prefer the object which actually contains planets/grahas and ascendant/lagna.
  const scored = candidates
    .map((item) => {
      let score = 0;
      if (item?.planets) score += 5;
      if (item?.grahas) score += 5;
      if (item?.planetData) score += 5;
      if (item?.planetaryPositions) score += 5;
      if (item?.ascendant || item?.lagna || item?.asc) score += 6;
      if (item?.lagnaSign || item?.lagnaRashi || item?.ascendantSign) score += 4;
      if (item?.moonSign || item?.nakshatra) score += 1;
      return { item, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored[0]?.item ?? root;
}

function readPlanet(source: unknown, planetName: string) {
  const root = getChartRoot(source);
  const src = (source as Record<string, unknown> | null | undefined) ?? {};
  const srcChart = (src.chart as Record<string, unknown> | undefined) ?? undefined;
  const lower = planetName.toLowerCase();

  const candidates = [
    root?.planets,
    root?.planetData,
    root?.grahas,
    root?.positions,
    root?.planetaryPositions,
    src?.planets,
    srcChart?.planets,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (Array.isArray(candidate)) {
      const found = candidate.find((item: unknown) => {
        const obj = (item as Record<string, unknown> | null) ?? {};
        const name = String(obj?.name ?? obj?.planet ?? obj?.graha ?? obj?.id ?? "").toLowerCase();
        return name === lower;
      });

      if (found) return found;
    }

    if (typeof candidate === "object") {
      const record = candidate as Record<string, unknown>;
      const found =
        record?.[planetName] ??
        record?.[lower] ??
        record?.[planetName.toUpperCase()];

      if (found) return found;
    }
  }

  return null;
}

function readAscendant(source: unknown) {
  const root = getChartRoot(source);
  const rootChart = (root?.chart as Record<string, unknown> | undefined) ?? undefined;
  const rootRashi = (root?.rashi as Record<string, unknown> | undefined) ?? undefined;
  const rootBasic = (root?.basic as Record<string, unknown> | undefined) ?? undefined;

  const direct =
    readPlanet(root, "Ascendant") ??
    readPlanet(root, "Lagna") ??
    root?.ascendant ??
    root?.lagna ??
    root?.asc ??
    root?.birthAscendant ??
    rootChart?.ascendant ??
    rootChart?.lagna;

  if (direct) return direct;

  const lagnaSign =
    root?.lagnaSign ??
    root?.lagnaRashi ??
    root?.ascendantSign ??
    root?.ascendantRashi ??
    rootRashi?.lagna ??
    rootBasic?.lagna;

  const lagnaDegree =
    root?.lagnaDegree ??
    root?.ascendantDegree ??
    root?.lagnaLongitude ??
    root?.ascendantLongitude ??
    root?.lagLon;

  if (lagnaSign || lagnaDegree !== undefined) {
    return {
      sign: lagnaSign,
      longitude: lagnaDegree,
      degree: lagnaDegree,
    };
  }

  return {};
}

function readLonFromPlanet(source: unknown, planetName: string) {
  const root = getChartRoot(source);
  const planet = planetName === "Lagna" ? readAscendant(root) : readPlanet(root, planetName);

  const signRaw =
    planet?.rashiName ??
    planet?.signName ??
    planet?.zodiacSign ??
    planet?.rashi ??
    planet?.sign ??
    planet?.rashiIndex ??
    planet?.signIndex;

  const sign = signIndexFrom(signRaw);

  const absoluteRaw =
    planet?.absoluteDegree ??
    planet?.absoluteDegrees ??
    planet?.fullDegree ??
    planet?.fullDegrees ??
    planet?.normDegree ??
    planet?.longitude ??
    planet?.lon ??
    planet?.lng ??
    planet?.siderealLongitude ??
    planet?.nirayanaLongitude;

  if (absoluteRaw !== undefined && absoluteRaw !== null) {
    const n = safeNumber(absoluteRaw, 0);

    // If longitude is 0 but sign is known, avoid false Aries fallback.
    if (n === 0 && sign >= 0 && sign <= 11) {
      const inner =
        safeNumber(
          planet?.degreeInSign ??
            planet?.signDegree ??
            planet?.degreesInSign ??
            planet?.rashiDegree ??
            planet?.rashiDegrees,
          0
        );
      return normalizeLon(sign * 30 + inner);
    }

    return normalizeLon(n);
  }

  const degreeRaw =
    planet?.degreeInSign ??
    planet?.signDegree ??
    planet?.degreesInSign ??
    planet?.rashiDegree ??
    planet?.rashiDegrees ??
    planet?.degree ??
    planet?.degrees ??
    planet?.deg;

  const degree = safeNumber(degreeRaw, 0);

  return normalizeLon(sign * 30 + degree);
}

function readCurrentDasha(source: unknown) {
  const root = getChartRoot(source);
  const src = (source as Record<string, unknown> | null | undefined) ?? {};
  const dasha =
    root?.currentDasha ??
    root?.dasha ??
    root?.vimshottari ??
    src?.currentDasha ??
    src?.dasha ??
    {};
  const dashaObj = (dasha as Record<string, unknown> | null | undefined) ?? {};

  const md =
    dashaObj?.mahadasha ??
    dashaObj?.mahaDasha ??
    dashaObj?.md ??
    dashaObj?.currentMD ??
    root?.currentMD ??
    src?.currentMD;

  const ad =
    dashaObj?.antardasha ??
    dashaObj?.antarDasha ??
    dashaObj?.ad ??
    dashaObj?.currentAD ??
    root?.currentAD ??
    src?.currentAD;
  const mdObj = (md as Record<string, unknown> | null | undefined) ?? {};
  const adObj = (ad as Record<string, unknown> | null | undefined) ?? {};

  return {
    currentMD: typeof md === "string" ? md : String(mdObj?.planet ?? mdObj?.name ?? ""),
    currentAD: typeof ad === "string" ? ad : String(adObj?.planet ?? adObj?.name ?? ""),
  };
}

export function normalizeToKPInput(input: unknown): NatalKPInput {
  const source = getChartRoot(input);
  const sourceObj = (source as Record<string, unknown> | null | undefined) ?? {};
  const inputObj = (input as Record<string, unknown> | null | undefined) ?? {};
  const asc = readAscendant(source);

  const explicitLagna =
    asc?.rashiName ??
    asc?.signName ??
    asc?.zodiacSign ??
    asc?.rashi ??
    asc?.sign ??
    sourceObj?.lagnaSign ??
    sourceObj?.lagnaRashi ??
    sourceObj?.ascendantSign ??
    sourceObj?.ascendantRashi ??
    inputObj?.lagnaSign ??
    inputObj?.lagnaRashi ??
    inputObj?.ascendantSign ??
    inputObj?.ascendantRashi;

  let lagR = signIndexFrom(explicitLagna);

  let lagLon = readLonFromPlanet(source, "Lagna");

  // Critical correction:
  // If app says Lagna is Virgo but lagLon came as 0, force Virgo longitude.
  if (explicitLagna !== undefined && explicitLagna !== null) {
    const signFromName = signIndexFrom(explicitLagna);
    if (signFromName >= 0 && signFromName <= 11) {
      lagR = signFromName;

      const inner =
        safeNumber(
          asc?.degreeInSign ??
            asc?.signDegree ??
            asc?.degreesInSign ??
            asc?.rashiDegree ??
            asc?.rashiDegrees,
          0
        );

      if (Math.floor(lagLon / 30) !== lagR) {
        lagLon = normalizeLon(lagR * 30 + inner);
      }
    }
  } else {
    lagR = Math.floor(lagLon / 30);
  }

  const planets: Record<string, KPPlanetInput> = {};
  const rawKpCusps = Array.isArray((sourceObj as any)?.kpCusps)
    ? (sourceObj as any).kpCusps
    : Array.isArray((inputObj as any)?.kpCusps)
      ? (inputObj as any).kpCusps
      : null;

  let placidusCusps = rawKpCusps;
  const jd = safeNumber((sourceObj as any)?.jd ?? (inputObj as any)?.jd, 2451545.0);
  if (!placidusCusps || placidusCusps.length < 12) {
    const lat = (sourceObj as any)?.lat ?? (inputObj as any)?.lat;
    const lonCoord =
      (sourceObj as any)?.lon ??
      (sourceObj as any)?.lng ??
      (inputObj as any)?.lon ??
      (inputObj as any)?.lng;
    if (jd > 0 && typeof lat === "number" && typeof lonCoord === "number") {
      const ayan = computeKPAyanamsha(jd);
      placidusCusps = computePlacidusCusps(jd, lat, lonCoord, ayan);
    }
  }

  const hasPlacidusCusps = Boolean(placidusCusps && placidusCusps.length >= 12);
  const placidusCuspLons: number[] = hasPlacidusCusps
    ? (placidusCusps as any[]).map((c) => normalizeLon(c.lon ?? c.longitude ?? 0))
    : [];

  if (hasPlacidusCusps && !(sourceObj as any).kpCusps) {
    (sourceObj as any).kpCusps = placidusCusps;
  }

  // Dynamic Multi-Ayanamsha Conversion for KP Engine
  // Converts planetary input from source frame (typically Lahiri) to KP Krishnamurti frame
  // using the exact epoch-dependent difference between the two models (no hardcoded offset constants).
  const sourceAyanamsha: SupportedAyanamsha =
    (sourceObj as any)?.ayanamsha === "KP_Krishnamurti" ||
    (inputObj as any)?.ayanamsha === "KP_Krishnamurti"
      ? "KP_Krishnamurti"
      : "Lahiri_Chitrapaksha";
  const targetAyanamsha: SupportedAyanamsha = "KP_Krishnamurti";
  const sourceAyanValue = getAyanamshaForEpoch(sourceAyanamsha, jd);
  const targetAyanValue = getAyanamshaForEpoch(targetAyanamsha, jd);
  const deltaArcsec = ((sourceAyanValue - targetAyanValue + 540) % 360 - 180) * 3600;
  const coordinateProvenance: KPCoordinateProvenance = {
    sourceAyanamsha,
    targetAyanamsha,
    sourceAyanamshaValue: sourceAyanValue,
    targetAyanamshaValue: targetAyanValue,
    deltaArcsec,
    epochJD: jd,
    conversionMethod: "epoch-dynamic-ayanamsha-conversion-v1",
    unifiedFrame: true,
  };

  // Align Lagna to KP frame if Placidus cusps are active
  if (hasPlacidusCusps && placidusCusps && placidusCusps.length > 0) {
    const rawCusp1 = placidusCusps[0].lon ?? placidusCusps[0].longitude;
    if (typeof rawCusp1 === "number" && Number.isFinite(rawCusp1)) {
      lagLon = normalizeLon(rawCusp1);
      lagR = Math.floor(lagLon / 30);
    }
  }

  const rawCusps = Array.isArray((sourceObj as any)?.houseCusps)
    ? (sourceObj as any).houseCusps
    : Array.isArray((inputObj as any)?.houseCusps)
      ? (inputObj as any).houseCusps
      : null;
  const hasDegreeBhavaCusps = Boolean(rawCusps && rawCusps.length >= 12);

  (["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as const).forEach(
    (planetName) => {
      const planet = readPlanet(source, planetName) ?? {};
      const rawLon = readLonFromPlanet(source, planetName);
      const kpLon = hasPlacidusCusps
        ? convertLongitudeBetweenAyanamshas(rawLon, sourceAyanamsha, targetAyanamsha, jd)
        : rawLon;
      const rashi = Math.floor(kpLon / 30);
      const rashiHouse = houseFromLon(lagR, kpLon);
      const bhavaHouse = hasPlacidusCusps
        ? getPlacidusBhavaHouse(kpLon, placidusCuspLons)
        : safeNumber(
            planet?.bhavaHouse ??
              planet?.chalitHouse ??
              planet?.houseBhava ??
              planet?.bhava,
            hasDegreeBhavaCusps ? md(Math.floor(md(kpLon - lagLon + 15, 360) / 30), 12) + 1 : rashiHouse
          );
      const normalizedBhavaHouse = Math.max(1, Math.min(12, Math.round(bhavaHouse)));
      const bhavaShift = normalizedBhavaHouse - rashiHouse;

      planets[planetName] = {
        lon: kpLon,
        sourceLon: rawLon,
        sourceAyanamsha,
        kpAyanamsha: targetAyanamsha,
        conversionMethod: coordinateProvenance.conversionMethod,
        house: normalizedBhavaHouse,
        rashiHouse,
        bhavaHouse: normalizedBhavaHouse,
        bhavaShift,
        rashi,
        rashiName: RASHIS_EN[rashi] ?? "Unknown",
        bhavaNote:
          typeof planet?.bhavaNote === "string"
            ? planet.bhavaNote
            : bhavaShift === 0
              ? "Same as Rashi house"
              : `Bhava Chalit shifts from H${rashiHouse} to H${normalizedBhavaHouse}`,
        retrograde: Boolean(planet?.retrograde ?? planet?.isRetrograde ?? planet?.R),
      };
    }
  );

  const dasha = readCurrentDasha(source) as any;

  return {
    lagR,
    lagLon,
    planets,
    cuspSource: hasPlacidusCusps
      ? "placidus"
      : hasDegreeBhavaCusps
        ? "degree-equal-bhava"
        : "whole-sign-fallback",
    bhavaMode: hasPlacidusCusps
      ? "placidus"
      : hasDegreeBhavaCusps
        ? "degree-equal-bhava"
        : "whole-sign",
    currentMD: dasha.currentMD || undefined,
    currentAD: dasha.currentAD || undefined,
    currentPD: dasha.currentPD || undefined,
    currentSD: dasha.currentSD || undefined,
    dashaPath: dasha.dashaPath || undefined,
    rawSource: source,
    coordinateProvenance,
  };
}

function lordHouse(lord: string, input: NatalKPInput) {
  const planet = input.planets[lord];

  return planet?.house ?? 0;
}

function buildKPRow(
  name: KPPointName,
  lon: number,
  house: number,
  input: NatalKPInput,
  retrograde = false,
  bhavaMeta?: Pick<
    KPPlanetInput,
    | "rashiHouse"
    | "bhavaHouse"
    | "bhavaShift"
    | "bhavaNote"
    | "sourceLon"
    | "sourceAyanamsha"
    | "kpAyanamsha"
    | "conversionMethod"
  >
): KPRow {
  const signIndex = Math.floor(md(lon, 360) / 30);
  const sign = RASHIS_EN[signIndex] ?? "Unknown";
  const signLord = SIGN_LORD[signIndex] ?? "Ketu";
  const nakshatra = getNakshatra(lon);
  const starLord = getStarLord(lon);
  const subLord = getSubLord(lon);
  const subSubLord = getSubSubLord(lon);
  const subLordHouse = lordHouse(subLord, input);
  const starLordHouse = lordHouse(starLord, input);

  const significatorHouses = [
    house,
    starLordHouse,
    subLordHouse,
    signIndex + 1,
  ].filter((item, index, array) => item >= 1 && item <= 12 && array.indexOf(item) === index);

  return {
    name,
    lon,
    sourceLon: bhavaMeta?.sourceLon ?? lon,
    sourceAyanamsha: bhavaMeta?.sourceAyanamsha,
    kpAyanamsha: bhavaMeta?.kpAyanamsha,
    conversionMethod: bhavaMeta?.conversionMethod,
    degreeText: absoluteDegreeText(lon),
    sign,
    signLord,
    house,
    rashiHouse: bhavaMeta?.rashiHouse ?? house,
    bhavaHouse: bhavaMeta?.bhavaHouse ?? house,
    bhavaShift: bhavaMeta?.bhavaShift ?? 0,
    bhavaNote: bhavaMeta?.bhavaNote ?? "Same as Rashi house",
    position: `${sign} H${house}`,
    nakshatra,
    starLord,
    pada: getPada(lon),
    subLord,
    subSubLord,
    subLordPosition: subLordHouse ? `H${subLordHouse}` : "—",
    subLordHouse,
    significance: significatorHouses.length ? `H${significatorHouses.join(" · H")}` : "—",
    significatorHouses,
    isSignificantForTopic: false,
    topicHit: "",
    retrograde,
  };
}


function buildRows(input: NatalKPInput): KPRow[] {
  const lagnaMeta = {
    rashiHouse: 1,
    bhavaHouse: 1,
    bhavaShift: 0,
    bhavaNote: "Lagna cusp",
    sourceLon: input.coordinateProvenance ? md(input.lagLon - (input.coordinateProvenance.deltaArcsec / 3600), 360) : input.lagLon,
    sourceAyanamsha: input.coordinateProvenance?.sourceAyanamsha,
    kpAyanamsha: input.coordinateProvenance?.targetAyanamsha,
    conversionMethod: input.coordinateProvenance?.conversionMethod,
  };

  const rows: KPRow[] = [
    buildKPRow("Lagna", input.lagLon, 1, input, false, lagnaMeta),
  ];

  (Object.keys(input.planets) as KPPointName[]).forEach((name) => {
    const planet = input.planets[name];

    if (!planet) return;

    rows.push(buildKPRow(name, planet.lon, planet.house, input, Boolean(planet.retrograde), planet));
  });

  return rows;
}

function buildCusps(input: NatalKPInput): KPCuspRow[] {
  const raw: any = input.rawSource ?? input;
  const possibleCusps =
    raw?.kpCusps ??
    raw?.cusps ??
    raw?.houseCusps ??
    raw?.houses ??
    raw?.bhavaCusps ??
    raw?.houseCuspData ??
    raw?.kp?.cusps ??
    raw?.kp?.houseCusps ??
    raw?.chart?.kpCusps ??
    raw?.chart?.cusps ??
    raw?.chart?.houseCusps;

  if (Array.isArray(possibleCusps) && possibleCusps.length >= 12) {
    return possibleCusps.slice(0, 12).map((cusp: any, index: number) => {
      const house = index + 1;
      const rawDegree =
        cusp?.lon ??
        cusp?.longitude ??
        cusp?.degree ??
        cusp?.degrees ??
        cusp?.absoluteDegree;

      const signRaw =
        cusp?.sign ??
        cusp?.rashi ??
        cusp?.signName ??
        cusp?.rashiName ??
        cusp?.signIndex ??
        cusp?.rashiIndex;

      let lon = normalizeLon(rawDegree ?? 0);

      if ((rawDegree === undefined || rawDegree === null || lon === 0) && signRaw !== undefined) {
        const signIndex = signIndexFrom(signRaw);
        const inner = safeNumber(cusp?.degreeInSign ?? cusp?.signDegree ?? cusp?.rashiDegree, 0);
        lon = normalizeLon(signIndex * 30 + inner);
      }

      const signIndex = Math.floor(lon / 30);
      const sign = RASHIS_EN[signIndex] ?? "Unknown";
      const starLord = getStarLord(lon);
      const subLord = getSubLord(lon);
      const subSubLord = getSubSubLord(lon);

      return {
        house,
        lon,
        degreeText: absoluteDegreeText(lon),
        sign,
        signLord: SIGN_LORD[signIndex] ?? "Ketu",
        nakshatra: getNakshatra(lon),
        starLord,
        pada: getPada(lon),
        subLord,
        subSubLord,
        source:
          cusp?.source === "placidus" || possibleCusps === raw?.kpCusps
            ? "placidus"
            : cusp?.source === "degree-equal-bhava"
              ? "degree-equal-bhava"
              : "provided",
        promise:
          cusp?.source === "placidus" || possibleCusps === raw?.kpCusps
            ? `Placidus KP cusp: ${sign} H${house}. Star lord ${starLord}, Sub lord ${subLord}, Sub-sub lord ${subSubLord}.`
            : cusp?.source === "degree-equal-bhava"
              ? `Degree-based Bhava cusp: ${sign} H${house}. Sub lord ${subLord}, sub-sub lord ${subSubLord}.`
              : `H${house} cusp is ruled by ${subLord} at sub level and ${subSubLord} at sub-sub level.`,
      };
    });
  }

  const generatedCusps = Array.isArray((input.rawSource as any)?.houseCusps)
    ? (input.rawSource as any).houseCusps
    : [];

  if (generatedCusps.length >= 12) {
    return generatedCusps.slice(0, 12).map((cusp: any, index: number) => {
      const house = index + 1;
      const lon = normalizeLon(cusp?.lon ?? cusp?.longitude ?? input.lagLon + index * 30);
      const signIndex = Math.floor(lon / 30);
      const sign = RASHIS_EN[signIndex] ?? "Unknown";
      const starLord = getStarLord(lon);
      const subLord = getSubLord(lon);
      const subSubLord = getSubSubLord(lon);

      return {
        house,
        lon,
        degreeText: absoluteDegreeText(lon),
        sign,
        signLord: SIGN_LORD[signIndex] ?? "Ketu",
        nakshatra: getNakshatra(lon),
        starLord,
        pada: getPada(lon),
        subLord,
        subSubLord,
        source: "degree-equal-bhava",
        promise: `Degree-based Bhava cusp: ${sign} H${house}. Sub lord ${subLord}, sub-sub lord ${subSubLord}.`,
      };
    });
  }

  // Fallback: whole-sign cusp from Lagna longitude.
  // This avoids Aries 0° fallback. Virgo Lagna creates Virgo H1, Libra H2, Leo H12.
  const safeLagnaLon =
    input.lagLon && input.lagLon > 0
      ? input.lagLon
      : normalizeLon(input.lagR * 30);

  return Array.from({ length: 12 }).map((_, index) => {
    const house = index + 1;
    const lon = normalizeLon(safeLagnaLon + index * 30);
    const signIndex = Math.floor(lon / 30);
    const sign = RASHIS_EN[signIndex] ?? "Unknown";
    const starLord = getStarLord(lon);
    const subLord = getSubLord(lon);
    const subSubLord = getSubSubLord(lon);

    return {
      house,
      lon,
      degreeText: absoluteDegreeText(lon),
      sign,
      signLord: SIGN_LORD[signIndex] ?? "Ketu",
      nakshatra: getNakshatra(lon),
      starLord,
      pada: getPada(lon),
      subLord,
      subSubLord,
      source: "whole-sign-fallback",
      promise: `Whole-sign fallback cusp: ${sign} H${house}. Sub lord ${subLord}, sub-sub lord ${subSubLord}. Exact KP cusp degree can be added when house cusp data is available.`,
    };
  });
}

function evaluateTopic(topic: EventTopic, input: NatalKPInput, rows: KPRow[], cusps: KPCuspRow[], houseLords: Record<number, string>): SignificatorSet {
  const def = TOPIC_DEFS[topic];
  const cusp = cusps.find((item) => item.house === def.cuspHouse) ?? cusps[0];

  const occupants = rows
    .filter((row) => row.name !== "Lagna" && def.positive.includes(row.house))
    .map((row) => row.name);

  const lords = def.positive.map((house) => ({
    house,
    lord: houseLords[house] ?? "—",
  }));

  const starLordLinks = rows
    .filter((row) => row.name !== "Lagna" && def.positive.includes(lordHouse(row.starLord, input)))
    .map((row) => `${row.name} → ${row.starLord}`);

  const subLordLinks = rows
    .filter((row) => row.name !== "Lagna" && def.positive.includes(row.subLordHouse))
    .map((row) => `${row.name} → ${row.subLord}`);

  const negativeLinks = rows.filter((row) => {
    return row.name !== "Lagna" && row.significatorHouses.some((house) => def.negative.includes(house));
  });

  const cuspSupport =
    def.positive.includes(lordHouse(cusp.subLord, input)) ||
    def.positive.includes(lordHouse(cusp.starLord, input)) ||
    def.positive.includes(cusp.house);

  const mdHit =
    input.currentMD && rows.some((row) => row.name === input.currentMD && row.significatorHouses.some((house) => def.positive.includes(house)));

  const adHit =
    input.currentAD && rows.some((row) => row.name === input.currentAD && row.significatorHouses.some((house) => def.positive.includes(house)));

  // KP shows possibility, not certainty.
  // Strong events are capped below 85 to avoid fake 100/100 certainty.
  let rawScore = 32;
  rawScore += Math.min(occupants.length, 3) * 6;
  rawScore += Math.min(starLordLinks.length, 4) * 5;
  rawScore += Math.min(subLordLinks.length, 4) * 6;
  rawScore += cuspSupport ? 12 : -7;
  rawScore += mdHit ? 6 : 0;
  rawScore += adHit ? 5 : 0;
  rawScore -= Math.min(negativeLinks.length, 5) * 4;

  const score = Math.max(18, Math.min(84, Math.round(rawScore)));

  const verdict: SignificatorSet["verdict"] =
    score >= 72 ? "strong" : score >= 55 ? "moderate" : score >= 38 ? "weak" : "blocked";

  const cuspPromise = cuspSupport
    ? `${def.cuspHouse}th cusp supports this event because its star/sub chain connects with required houses.`
    : `${def.cuspHouse}th cusp needs caution because sub-level support is not clearly aligned.`;

  const dashaLink =
    mdHit || adHit
      ? `Current dasha connection supports this topic. MD: ${input.currentMD || "—"}, AD: ${input.currentAD || "—"}.`
      : `Current dasha connection is not strongly visible. MD: ${input.currentMD || "—"}, AD: ${input.currentAD || "—"}.`;

  const verdictNote =
    verdict === "strong"
      ? `${def.label} has strong KP possibility through event houses ${def.positive.join("-")}.`
      : verdict === "moderate"
        ? `${def.label} has usable promise, but mixed support and caution houses must be checked.`
        : verdict === "weak"
          ? `${def.label} is latent or delayed; stronger dasha/transit trigger may be required.`
          : `${def.label} looks blocked or delayed because required KP support is weak.`;

  return {
    topic,
    label: def.label,
    positiveHouses: def.positive,
    negativeHouses: def.negative,
    karaka: def.karaka,
    occupants,
    lords,
    starLordLinks,
    subLordLinks,
    cuspSubLord: cusp.subLord,
    cuspPromise,
    score,
    verdict,
    verdictNote,
    dashaLink,
    actionPlan: def.actionPlan,
  };
}


function buildKPSixMonthForecast(significators: SignificatorSet[]): KPForecastMonth[] {
  const sorted = [...significators].sort((a, b) => b.score - a.score);
  const today = new Date();

  const pick = (topic: string) => {
    return significators.find((item) => item.topic === topic) ?? sorted[0];
  };

  return Array.from({ length: 6 }).map((_, index) => {
    const start = new Date(today.getFullYear(), today.getMonth() + index, 1);
    const end = new Date(today.getFullYear(), today.getMonth() + index + 1, 0);

    const event =
      index % 3 === 0
        ? pick("career")
        : index % 3 === 1
          ? pick("marriage")
          : sorted[index % Math.max(sorted.length, 1)];

    const month = start.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });

    const period = `${start.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} - ${end.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;

    const scoreShift = index === 0 ? 0 : index % 2 === 0 ? -5 : 4;
    const score = Math.max(18, Math.min(84, (event?.score ?? 50) + scoreShift));

    const verdict: KPForecastMonth["verdict"] =
      score >= 72 ? "strong" : score >= 55 ? "moderate" : score >= 38 ? "weak" : "blocked";

    const probability: KPForecastMonth["probability"] =
      score >= 68 ? "High" : score >= 52 ? "Medium" : "Low";

    const outcome: KPForecastMonth["outcome"] =
      verdict === "strong"
        ? "Positive"
        : verdict === "moderate"
          ? "Mixed"
          : "Challenging";

    const career = pick("career");
    const marriage = pick("marriage");
    const wealth = pick("wealth");
    const health = pick("health");

    return {
      month,
      period,
      dashaLevel: `KP event focus: ${event?.label ?? "General"} · Houses ${event?.positiveHouses?.join("-") ?? "—"}`,
      focus: event?.label ?? "General KP Timing",
      score,
      probability,
      outcome,
      verdict,
      eventHouses: event?.positiveHouses ?? [],
      relationship:
        marriage?.score >= 70
          ? `Relationship probability is ${probability}. Marriage/relationship houses 2-7-11 have usable support. Good for commitment discussion, repair, matchmaking or emotional clarity.`
          : `Relationship area needs patience. If 6-8-12 patterns are active, avoid harsh speech and do not force decisions.`,
      careerMoney:
        career?.score >= 70 || wealth?.score >= 70
          ? `Career/money trend is active. KP houses ${career?.positiveHouses.join("-") ?? "2-6-10-11"} support work, income, applications, interviews or financial planning.`
          : `Career/money needs preparation. Use this month for skill upgrade, documentation, savings discipline and planning.`,
      healthCaution:
        health?.score >= 70
          ? `Health sensitivity is active. Use preventive routine, rest and professional advice where needed. Astrology is not medical diagnosis.`
          : `General caution: keep sleep, food, stress and routine balanced. Avoid taking pressure unnecessarily.`,
      advice:
        verdict === "strong"
          ? `${event?.label ?? "This area"} has strong KP support. Use this month for active movement.`
          : verdict === "moderate"
            ? `${event?.label ?? "This area"} has mixed KP support. Move carefully and verify timing.`
            : verdict === "weak"
              ? `${event?.label ?? "This area"} is slower. Use this month for preparation.`
              : `${event?.label ?? "This area"} may face delay. Avoid forceful decisions.`,
      caution:
        verdict === "blocked"
          ? "Obstruction houses may dominate. Keep backup plans ready."
          : "Cross-check dasha, transit and real-life situation before final timing.",
    };
  });
}


export function runKPEngine(rawInput: unknown): KPEngineResult {
  const input = normalizeToKPInput(rawInput);
  const houseLords = buildHouseLords(input.lagR);
  let rows = buildRows(input);
  const cusps = buildCusps(input);

  const significators = (Object.keys(TOPIC_DEFS) as EventTopic[]).map((topic) =>
    evaluateTopic(topic, input, rows, cusps, houseLords)
  );

  const activeTopic = significators[0];

  rows = rows.map((row) => {
    const hit = activeTopic?.positiveHouses.some((house) => row.significatorHouses.includes(house)) ?? false;

    return {
      ...row,
      isSignificantForTopic: hit,
      topicHit: hit ? activeTopic.topic : "",
    };
  });

  const sorted = [...significators].sort((a, b) => b.score - a.score);
  const strongestEvent = sorted[0] ?? null;
  const weakestEvent = sorted[sorted.length - 1] ?? null;
  const forecast = buildKPSixMonthForecast(significators);

  // ──────────────────────────────────────────────────────────────────────────
  // PHASE 2I: PREDICTIVE ENGINE FOUNDATION (2I-A, 2I-B, 2I-C)
  // ──────────────────────────────────────────────────────────────────────────
  const kpHouseLords: Record<number, KPPlanet> = {};
  for (let h = 1; h <= 12; h++) {
    const c = cusps[h - 1];
    kpHouseLords[h] = (c?.signLord as KPPlanet) || (houseLords[h] as KPPlanet) || "Mars";
  }

  const planetOwnedHouses: Record<KPPlanet, number[]> = {
    Sun: [],
    Moon: [],
    Mars: [],
    Mercury: [],
    Jupiter: [],
    Venus: [],
    Saturn: [],
    Rahu: [],
    Ketu: [],
  };
  for (let h = 1; h <= 12; h++) {
    const lord = kpHouseLords[h];
    if (planetOwnedHouses[lord]) {
      planetOwnedHouses[lord].push(h);
    }
  }

  const pointEvidence: Record<string, KPPointEvidence> = {};

  const ALL_PLANETS: KPPlanet[] = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
    "Rahu",
    "Ketu",
  ];

  ALL_PLANETS.forEach((planetName) => {
    const pInput = input.planets[planetName];
    const pLon = pInput ? pInput.lon : 0;
    const signIdx = Math.floor(md(pLon, 360) / 30);
    const pStarLord = getStarLord(pLon);
    const pSubLord = getSubLord(pLon);
    const pSubSubLord = getSubSubLord(pLon);
    const pOccupied = pInput ? pInput.house : 0;

    pointEvidence[planetName] = {
      id: planetName,
      name: planetName,
      type: "planet",
      longitude: pLon,
      sign: RASHIS_EN[signIdx] ?? "Unknown",
      signLord: SIGN_LORD[signIdx] ?? "Ketu",
      signIndex: signIdx,
      nakshatra: getNakshatra(pLon),
      starLord: pStarLord,
      pada: getPada(pLon),
      subLord: pSubLord,
      subSubLord: pSubSubLord,
      house: pOccupied,
      houseLord: kpHouseLords[pOccupied] ?? "Mars",
      occupiedHouse: pOccupied,
      ownedHouses: planetOwnedHouses[planetName] ?? [],
      starLordOccupiedHouse: input.planets[pStarLord]?.house ?? 0,
      starLordOwnedHouses: planetOwnedHouses[pStarLord] ?? [],
      subLordOccupiedHouse: input.planets[pSubLord]?.house ?? 0,
      subLordOwnedHouses: planetOwnedHouses[pSubLord] ?? [],
      retrograde: Boolean(pInput?.retrograde),
    };
  });

  const lagLon = input.lagLon;
  const lagSignIdx = Math.floor(md(lagLon, 360) / 30);
  const lagStar = getStarLord(lagLon);
  const lagSub = getSubLord(lagLon);
  const lagSubSub = getSubSubLord(lagLon);
  pointEvidence["Lagna"] = {
    id: "Lagna",
    name: "Lagna",
    type: "lagna",
    longitude: lagLon,
    sign: RASHIS_EN[lagSignIdx] ?? "Unknown",
    signLord: SIGN_LORD[lagSignIdx] ?? "Ketu",
    signIndex: lagSignIdx,
    nakshatra: getNakshatra(lagLon),
    starLord: lagStar,
    pada: getPada(lagLon),
    subLord: lagSub,
    subSubLord: lagSubSub,
    house: 1,
    houseLord: kpHouseLords[1] ?? "Mars",
    occupiedHouse: 1,
    ownedHouses: [],
    starLordOccupiedHouse: input.planets[lagStar]?.house ?? 0,
    starLordOwnedHouses: planetOwnedHouses[lagStar] ?? [],
    subLordOccupiedHouse: input.planets[lagSub]?.house ?? 0,
    subLordOwnedHouses: planetOwnedHouses[lagSub] ?? [],
  };

  cusps.forEach((c) => {
    const cLon = c.lon;
    const cSignIdx = Math.floor(md(cLon, 360) / 30);
    pointEvidence[`Cusp${c.house}`] = {
      id: `Cusp${c.house}`,
      name: `Cusp ${c.house}`,
      type: "cusp",
      longitude: cLon,
      sign: c.sign,
      signLord: c.signLord as KPPlanet,
      signIndex: cSignIdx,
      nakshatra: c.nakshatra,
      starLord: c.starLord,
      pada: c.pada,
      subLord: c.subLord,
      subSubLord: c.subSubLord,
      house: c.house,
      houseLord: kpHouseLords[c.house] ?? "Mars",
      occupiedHouse: c.house,
      ownedHouses: [c.house],
      starLordOccupiedHouse: input.planets[c.starLord]?.house ?? 0,
      starLordOwnedHouses: planetOwnedHouses[c.starLord] ?? [],
      subLordOccupiedHouse: input.planets[c.subLord]?.house ?? 0,
      subLordOwnedHouses: planetOwnedHouses[c.subLord] ?? [],
    };
  });

  const { houseSignificators, planetSignifications } = build4FoldHouseSignificators(
    pointEvidence,
    kpHouseLords
  );

  const cuspPromises = evaluateAllCuspPromises(cusps, planetSignifications);

  const predictiveEvidence: KPPredictiveEvidence = {
    pointEvidence,
    houseSignificators,
    planetSignifications,
    cuspPromises,
  };

  const eventPromises = evaluateAllEventRules(predictiveEvidence);
  predictiveEvidence.eventPromises = eventPromises;

  const chartObj: any = getChartRoot(rawInput);
  if (chartObj?.dob && chartObj?.tob) {
    try {
      const dashaEvidence = buildCurrentDashaHierarchyEvidence(chartObj, predictiveEvidence);
      (predictiveEvidence as any).dashaEvidence = dashaEvidence;
    } catch {
      // Gracefully omit if birth dates cannot be parsed
    }
  }

  return {
    input,
    rows,
    cusps,
    significators,
    forecast,
    houseLords,
    strongestEvent,
    weakestEvent,
    topEventHints: sorted.slice(0, 4).map((item) => ({
      topic: item.label,
      color:
        item.verdict === "strong"
          ? "#4ade80"
          : item.verdict === "moderate"
            ? "#fbbf24"
            : item.verdict === "weak"
              ? "#94a3b8"
              : "#f87171",
      note: `${item.score}/100 · ${item.verdictNote}`,
    })),
    subLordSummary:
      "KP gives high importance to star lord and sub lord. The cusp sub lord shows whether an event is promised, while dasha and transit show when it may activate.",
    coordinateProvenance: input.coordinateProvenance,
    predictiveEvidence,
  };
}

export const calculateKpReport = runKPEngine;
export const calculateKPReport = runKPEngine;
export const calculateKp = runKPEngine;
export const getKpReport = runKPEngine;
export const analyzeKpEvents = runKPEngine;
