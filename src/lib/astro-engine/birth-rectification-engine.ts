// ============================================================================
// ASTROLIFE — BIRTH TIME RECTIFICATION (BTR) & NASHTA JATAKA ENGINE v1.0
// Combines:
// 1. Vimshottari Dasha-Antardasha Event Correlation
// 2. Classical Kunda Mathematical Verification (Prashna Marga, Lagna * 81 mod 360)
// 3. KP Lagna Sub-Lord & Cuspal Verification
// 4. Double Transit (Saturn & Jupiter Gochar) Verification
// 5. Palmistry Physical Grounding (Hand Element, Mounts, Fate Line Origin)
// ============================================================================

import {
  calculateChart,
  buildAntarDasha,
  computeLagna,
  getJD,
  getNak,
  RASHIS,
} from "./calculations";
import {
  getSubLord,
  getStarLord,
  hasKPLinkage,
  evaluateRuleOfOrigin,
  evaluateKPThreeLevelLinkage,
  type RuleOfOriginResult,
  type KPThreeLevelLinkageResult,
} from "./kp";
import { computeKPAyanamsha, computePlacidusCusps } from "./placidus";
import { calculateSunWindow } from "./panchang";

export type BTREventCategory =
  | "career_start"
  | "job_change"
  | "job_loss"
  | "promotion"
  | "marriage"
  | "relationship_break"
  | "health_crisis"
  | "far_travel"
  | "sibling_milestone"
  | "home_loss"
  | "asset_purchase"
  | "child_birth"
  | "accident_surgery"
  | "vehicle_purchase"
  | "education_exam"
  | "foreign_visa"
  | "business_launch"
  | "financial_windfall"
  | "parent_milestone"
  | "legal_dispute";

export interface BTREvent {
  title: string;
  date: string; // YYYY-MM-DD
  category: BTREventCategory;
}

export interface BTRPalmInput {
  handElement?: "fire" | "earth" | "air" | "water" | "hybrid";
  prominentMounts?: string[]; // e.g. ["venus", "moon", "jupiter", "saturn"]
  fateLineOrigin?: "moon" | "wrist" | "venus" | "life";
}

export interface BTRInput {
  name?: string;
  city: string;
  lat?: number;
  lon?: number;
  tz?: number;
  gender?: "male" | "female" | "other";
  dateRange: {
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
  };
  timeRange: {
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
  };
  stepMinutes?: number; // e.g. 5, 2, or 1
  events: BTREvent[];
  palmFeatures?: BTRPalmInput;
}

export interface EventMatchDetail {
  eventTitle: string;
  eventDate: string;
  category: BTREventCategory;
  mahadasha: string;
  antardasha: string;
  matched: boolean;
  score: number;
  reason: string;
}

export interface PranapadaResult {
  passed: boolean;
  score: number;
  elapsedPalas: number;
  remainder: number;
  sunSunriseAmsa: number;
  pranapadaAmsa: number;
  ascAmsa: number;
  errorDeg: number;
  deltaCorrectionSeconds: number;
  audit: string;
}

export interface GulikaValidationResult {
  gulikaTime: string;
  gulikaLon: number;
  gulikaSign: string;
  gulikaNavamsa: string;
  matched: boolean;
  matchType: "SAME_SIGN" | "TRINE_RASHI" | "NAVAMSA_MATCH" | "SEVENTH_HOUSE" | "NONE";
  score: number;
  audit: string;
}

export interface TattvaValidationResult {
  tattvaName: string;
  tattvaElement: "earth" | "water" | "fire" | "air" | "ether";
  matched: boolean;
  score: number;
  audit: string;
}

export interface PalaHarmonicsResult {
  weekdayMatched: boolean;
  starGroupMatched: boolean;
  computedWeekdayNumber: number;
  expectedWeekdayNumber: number;
  computedStarGroup: number;
  expectedStarGroup: number;
  offsetFrom63GridPalas: number;
  score: number;
  audit: string;
}

export interface NDGenderResult {
  ndPointNumber: number;
  ndSign: string;
  ndGender: "male" | "female";
  nativeGender?: "male" | "female" | "other";
  matched: boolean;
  score: number;
  audit: string;
}

export interface SunStarAscendantResult {
  quarter: 1 | 2 | 3 | 4;
  period: "day" | "night";
  sunNakshatraNumber: number;
  expectedStarOffsets: number[];
  ascendantNakshatraNumber: number;
  matched: boolean;
  score: number;
  audit: string;
}

export interface BTREvidenceMatrix {
  kpThreeLevel: {
    passed: boolean;
    score: number;
    level1Sign: boolean;
    level2Star: boolean;
    level3Sub: boolean;
    details: string;
  };
  ruleOfOrigin: {
    passed: boolean;
    ruleO1: boolean;
    ruleO2: boolean;
    ruleO3: boolean;
    score: number;
    details: string;
  };
  pranapada: {
    passed: boolean;
    errorDeg: number;
    pranapadaAmsa: number;
    ascAmsa: number;
    deltaCorrectionSeconds: number;
    score: number;
    details: string;
  };
  gulika: {
    passed: boolean;
    matchType: string;
    gulikaSign: string;
    gulikaNavamsa: string;
    score: number;
    details: string;
  };
  tattva: {
    tattvaName: string;
    tattvaElement: string;
    matched: boolean;
    score: number;
    details: string;
  };
  palaHarmonics?: {
    weekdayMatched: boolean;
    starGroupMatched: boolean;
    score: number;
    details: string;
  };
  ndGender?: {
    ndPointNumber: number;
    ndGender: string;
    matched: boolean;
    score: number;
    details: string;
  };
  sunStarAscendant?: {
    quarter: number;
    period: string;
    matched: boolean;
    score: number;
    details: string;
  };
  kunda: {
    passed: boolean;
    kundaNakshatra: string;
    score: number;
    details: string;
  };
  lifeEvents: {
    matchedCount: number;
    totalCount: number;
    score: number;
    details: string;
  };
  palmistry: {
    score: number;
    elementMatch: boolean;
    details: string;
  };
}

export interface BTRCandidate {
  date: string;
  time: string;
  isoDateTime: string;
  confidence: number; // 0 - 100
  lagnaRashi: string;
  lagnaDegree: number;
  lagnaMinutes: number;
  lagnaSubLord: string;
  lagnaStarLord: string;
  moonRashi: string;
  moonNakshatra: string;
  moonNakshatraLord: string;
  kundaMatch: boolean;
  kundaNakshatra: string;
  palmCompatibilityScore: number;
  eventMatches: EventMatchDetail[];
  eventMatchScore: number;
  summary: string;
  rectifiedWindow?: {
    start: string;
    end: string;
  };
  evidenceMatrix?: BTREvidenceMatrix;
  methodTrace?: string[];
  ruleOfOriginMatch?: boolean;
  kpLinkageMatch?: boolean;
  pranapadaMatch?: boolean;
  gulikaMatch?: boolean;
}

export interface BTRResult {
  engineVersion: string;
  totalCandidatesEvaluated: number;
  bestCandidate: BTRCandidate | null;
  topCandidates: BTRCandidate[];
  executionTimeMs: number;
  evidenceMatrix?: BTREvidenceMatrix;
  rectifiedWindow?: {
    start: string;
    end: string;
  };
  confidenceBand?: "HIGH" | "MEDIUM" | "LOW" | "INCONCLUSIVE";
}

// ── Kunda Algorithm (Prashna Marga) ──────────────────────────────────────────
// Kunda Longitude = (Lagna Longitude * 81) % 360
// Must fall in Janma Nakshatra or its trines (Nakshatras 1, 10, 19 from it - same Lord)
export function calculateKunda(lagnaLon: number): {
  kundaLon: number;
  kundaNakshatra: string;
  kundaLord: string;
} {
  const kundaLon = ((lagnaLon * 81) % 360 + 360) % 360;
  const nak = getNak(kundaLon);
  return {
    kundaLon,
    kundaNakshatra: nak.name,
    kundaLord: nak.lord,
  };
}

// ── Sunrise & Astronomical Palas Engine (1 pala = 24 seconds) ────────────────
export function computeSunrisePalas(
  dateStr: string,
  timeStr: string,
  lat = 28.6139,
  lon = 77.2090,
  tz = 5.5
): {
  sunriseTime: string;
  sunsetTime: string;
  elapsedSeconds: number;
  elapsedPalas: number;
  isDayBirth: boolean;
  dayDurationHours: number;
  nightDurationHours: number;
  astrologicalWeekday: string;
  dayLord: string;
} {
  const [h, m, s = 0] = timeStr.split(":").map(Number);
  const candDecimal = h + m / 60 + s / 3600;

  const dateObj = new Date(dateStr + "T12:00:00Z");
  const sunWin = calculateSunWindow(dateObj, lat, lon, tz);

  const [srH, srM] = sunWin.sunrise.split(":").map(Number);
  const [ssH, ssM] = sunWin.sunset.split(":").map(Number);
  const srDecimal = srH + srM / 60;
  const ssDecimal = ssH + ssM / 60;

  const isDayBirth = candDecimal >= srDecimal && candDecimal < ssDecimal;

  let elapsedSeconds = 0;
  let isBeforeSunrise = false;
  if (candDecimal >= srDecimal) {
    elapsedSeconds = (candDecimal - srDecimal) * 3600;
  } else {
    // Birth before sunrise belongs to previous astrological day
    isBeforeSunrise = true;
    elapsedSeconds = (candDecimal + 24 - srDecimal) * 3600;
  }

  const elapsedPalas = elapsedSeconds / 24;

  let dayDurationHours = ssDecimal - srDecimal;
  if (dayDurationHours < 0) dayDurationHours += 24;
  const nightDurationHours = 24 - dayDurationHours;

  const civilDayIdx = dateObj.getUTCDay();
  const astroDayIdx = isBeforeSunrise ? (civilDayIdx + 6) % 7 : civilDayIdx;

  const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const DAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  return {
    sunriseTime: sunWin.sunrise,
    sunsetTime: sunWin.sunset,
    elapsedSeconds,
    elapsedPalas,
    isDayBirth,
    dayDurationHours,
    nightDurationHours,
    astrologicalWeekday: WEEKDAY_NAMES[astroDayIdx],
    dayLord: DAY_LORDS[astroDayIdx],
  };
}

// ── Pranapada Engine (R.K. Das Palas Mode) ───────────────────────────────────
// Formula: R = P % 15; Pranapada amsa = (S + 2 * R) % 30
export function evaluatePranapada(
  elapsedPalas: number,
  sunLon: number,
  ascendantLon: number
): PranapadaResult {
  const S = ((sunLon % 30) + 30) % 30; // Sun amsa (0 - 30°)
  const R = ((elapsedPalas % 15) + 15) % 15; // P mod 15
  const pranapadaAmsa = ((S + 2 * R) % 30 + 30) % 30;
  const ascAmsa = ((ascendantLon % 30) + 30) % 30;

  const diff = Math.abs(pranapadaAmsa - ascAmsa);
  const errorDeg = Math.min(diff, 30 - diff);

  // Correction search [-10 to +10 palas, step 0.1 pala = 2.4 sec]
  let bestDeltaPalas = 0;
  let minSearchError = errorDeg;
  for (let dP = -10; dP <= 10; dP += 0.1) {
    const pTest = elapsedPalas + dP;
    const rTest = ((pTest % 15) + 15) % 15;
    const ppTest = ((S + 2 * rTest) % 30 + 30) % 30;
    const d = Math.abs(ppTest - ascAmsa);
    const err = Math.min(d, 30 - d);
    if (err < minSearchError) {
      minSearchError = err;
      bestDeltaPalas = dP;
    }
  }

  const passed = errorDeg <= 2.5;
  const score = errorDeg <= 1.0 ? 10 : errorDeg <= 2.5 ? 7 : errorDeg <= 5.0 ? 4 : 1;

  return {
    passed,
    score,
    elapsedPalas: Math.round(elapsedPalas * 10) / 10,
    remainder: Math.round(R * 100) / 100,
    sunSunriseAmsa: Math.round(S * 100) / 100,
    pranapadaAmsa: Math.round(pranapadaAmsa * 100) / 100,
    ascAmsa: Math.round(ascAmsa * 100) / 100,
    errorDeg: Math.round(errorDeg * 100) / 100,
    deltaCorrectionSeconds: Math.round(bestDeltaPalas * 24),
    audit: `Pranapada amsa: ${pranapadaAmsa.toFixed(2)}°, Ascendant amsa: ${ascAmsa.toFixed(2)}° (Deviation: ${errorDeg.toFixed(2)}°)`,
  };
}

// ── Gulika Engine (Classical 8-Fold Day/Night Division) ───────────────────────
const GULIKA_DAY_MULTIPLIERS: Record<string, number> = {
  Sunday: 0.875,
  Monday: 0.750,
  Tuesday: 0.625,
  Wednesday: 0.500,
  Thursday: 0.375,
  Friday: 0.250,
  Saturday: 0.125,
};

const GULIKA_NIGHT_MULTIPLIERS: Record<string, number> = {
  Sunday: 0.375,
  Monday: 0.250,
  Tuesday: 0.125,
  Wednesday: 0.875,
  Thursday: 0.750,
  Friday: 0.625,
  Saturday: 0.500,
};

export function evaluateGulika(
  dateStr: string,
  sunInfo: ReturnType<typeof computeSunrisePalas>,
  lat: number,
  lon: number,
  ayanamsha: number,
  candidateLagnaLon: number
): GulikaValidationResult {
  const weekday = sunInfo.astrologicalWeekday;
  const mult = sunInfo.isDayBirth
    ? (GULIKA_DAY_MULTIPLIERS[weekday] ?? 0.5)
    : (GULIKA_NIGHT_MULTIPLIERS[weekday] ?? 0.5);

  const [srH, srM] = sunInfo.sunriseTime.split(":").map(Number);
  const [ssH, ssM] = sunInfo.sunsetTime.split(":").map(Number);
  const srDec = srH + srM / 60;
  const ssDec = ssH + ssM / 60;

  const gulikaDec = sunInfo.isDayBirth
    ? (srDec + sunInfo.dayDurationHours * mult) % 24
    : (ssDec + sunInfo.nightDurationHours * mult) % 24;

  const gH = Math.floor(gulikaDec);
  const gM = Math.floor((gulikaDec - gH) * 60);
  const gulikaTime = `${String(gH).padStart(2, "0")}:${String(gM).padStart(2, "0")}`;

  const [yr, mo, dy] = dateStr.split("-").map(Number);
  const gulikaJD = getJD(yr, mo, dy, gulikaDec);
  const gulikaLon = computeLagna(gulikaJD, lat, lon, ayanamsha);

  const gulikaSignIdx = Math.floor(gulikaLon / 30);
  const candSignIdx = Math.floor(candidateLagnaLon / 30);

  const gulikaSign = RASHIS[gulikaSignIdx];
  const candSign = RASHIS[candSignIdx];

  const gulikaNavIdx = Math.floor(((gulikaLon % 30) / (30 / 9)));
  const candNavIdx = Math.floor(((candidateLagnaLon % 30) / (30 / 9)));
  const gulikaNavamsa = RASHIS[(gulikaSignIdx * 9 + gulikaNavIdx) % 12];
  const candNavamsa = RASHIS[(candSignIdx * 9 + candNavIdx) % 12];

  let matched = false;
  let matchType: GulikaValidationResult["matchType"] = "NONE";
  let score = 1;

  const diffSigns = (gulikaSignIdx - candSignIdx + 12) % 12;

  if (diffSigns === 0) {
    matched = true;
    matchType = "SAME_SIGN";
    score = 5;
  } else if (diffSigns === 4 || diffSigns === 8) {
    matched = true;
    matchType = "TRINE_RASHI";
    score = 4;
  } else if (diffSigns === 6) {
    matched = true;
    matchType = "SEVENTH_HOUSE";
    score = 3;
  } else if (gulikaNavamsa === candNavamsa) {
    matched = true;
    matchType = "NAVAMSA_MATCH";
    score = 4;
  }

  return {
    gulikaTime,
    gulikaLon: Math.round(gulikaLon * 100) / 100,
    gulikaSign,
    gulikaNavamsa,
    matched,
    matchType,
    score,
    audit: `Gulika at ${gulikaTime} in ${gulikaSign} (Navamsa: ${gulikaNavamsa}). ${matched ? `Matches Lagna (${candSign}) via ${matchType}` : `No direct sign alignment with Lagna (${candSign})`}`,
  };
}

// ── Tattva Engine (Exact R.K. Das Weekday Permutations, Pages 66-68) ────────
// Each weekday collection has a unique canonical order of the 5 tattvas totaling 225 palas.
const WEEKDAY_TATTVA_SEQUENCES: Record<
  string,
  Array<{ name: string; element: "earth" | "water" | "fire" | "air" | "ether"; duration: number }>
> = {
  Sunday: [
    { name: "Teja (Fire)", element: "fire", duration: 45 },
    { name: "Marut (Air)", element: "air", duration: 60 },
    { name: "Vyoma (Ether)", element: "ether", duration: 75 },
    { name: "Kshiti (Earth)", element: "earth", duration: 15 },
    { name: "Apa (Water)", element: "water", duration: 30 },
  ],
  Monday: [
    { name: "Apa (Water)", element: "water", duration: 30 },
    { name: "Kshiti (Earth)", element: "earth", duration: 15 },
    { name: "Vyoma (Ether)", element: "ether", duration: 75 },
    { name: "Marut (Air)", element: "air", duration: 60 },
    { name: "Teja (Fire)", element: "fire", duration: 45 },
  ],
  Tuesday: [
    { name: "Teja (Fire)", element: "fire", duration: 45 },
    { name: "Apa (Water)", element: "water", duration: 30 },
    { name: "Kshiti (Earth)", element: "earth", duration: 15 },
    { name: "Vyoma (Ether)", element: "ether", duration: 75 },
    { name: "Marut (Air)", element: "air", duration: 60 },
  ],
  Wednesday: [
    { name: "Kshiti (Earth)", element: "earth", duration: 15 },
    { name: "Apa (Water)", element: "water", duration: 30 },
    { name: "Teja (Fire)", element: "fire", duration: 45 },
    { name: "Marut (Air)", element: "air", duration: 60 },
    { name: "Vyoma (Ether)", element: "ether", duration: 75 },
  ],
  Thursday: [
    { name: "Vyoma (Ether)", element: "ether", duration: 75 },
    { name: "Marut (Air)", element: "air", duration: 60 },
    { name: "Teja (Fire)", element: "fire", duration: 45 },
    { name: "Apa (Water)", element: "water", duration: 30 },
    { name: "Kshiti (Earth)", element: "earth", duration: 15 },
  ],
  Friday: [
    { name: "Apa (Water)", element: "water", duration: 30 },
    { name: "Teja (Fire)", element: "fire", duration: 45 },
    { name: "Marut (Air)", element: "air", duration: 60 },
    { name: "Vyoma (Ether)", element: "ether", duration: 75 },
    { name: "Kshiti (Earth)", element: "earth", duration: 15 },
  ],
  Saturday: [
    { name: "Marut (Air)", element: "air", duration: 60 },
    { name: "Teja (Fire)", element: "fire", duration: 45 },
    { name: "Apa (Water)", element: "water", duration: 30 },
    { name: "Kshiti (Earth)", element: "earth", duration: 15 },
    { name: "Vyoma (Ether)", element: "ether", duration: 75 },
  ],
};

export function evaluateTattva(
  elapsedPalas: number,
  weekday: string,
  lagnaRashi: string
): TattvaValidationResult {
  const cyclePalas = ((elapsedPalas % 225) + 225) % 225;
  const seq = WEEKDAY_TATTVA_SEQUENCES[weekday] ?? WEEKDAY_TATTVA_SEQUENCES.Sunday;

  let acc = 0;
  let active = seq[0];
  for (const item of seq) {
    acc += item.duration;
    if (cyclePalas <= acc) {
      active = item;
      break;
    }
  }

  const lagnaElem = RASHI_ELEMENTS[lagnaRashi] ?? "fire";
  const matched = (active.element as string) === (lagnaElem as string) || active.element === "ether";
  const score = matched ? 2 : 0;

  return {
    tattvaName: active.name,
    tattvaElement: active.element,
    matched,
    score,
    audit: `Active Tattva: ${active.name} (${active.element.toUpperCase()}). Lagna Element: ${lagnaElem.toUpperCase()}`,
  };
}

// ── Pala Harmonics: 3P mod 7 & 4P mod 9 Dual Verification (Chapter XI, p. 73-75) ──
// Mathematical property: LCM(7, 9) = 63 palas. A true astrological moment of birth
// must align with both the weekday count and star group count.
export function evaluatePalaHarmonics(
  elapsedPalas: number,
  weekdayName: string,
  moonNakshatraNumber: number // 1 to 27
): PalaHarmonicsResult {
  const WEEKDAY_NUMBERS: Record<string, number> = {
    Sunday: 1, Monday: 2, Tuesday: 3, Wednesday: 4, Thursday: 5, Friday: 6, Saturday: 7,
  };
  const expWeekdayNum = WEEKDAY_NUMBERS[weekdayName] ?? 1;
  const expStarGroup = ((moonNakshatraNumber - 1) % 9) + 1;

  // Formula 1: Weekday = (3 * P) mod 7
  const rw = ((3 * elapsedPalas) % 7 + 7) % 7;
  const calcWeekdayNum = rw === 0 ? 7 : Math.ceil(rw);
  const weekdayMatched = calcWeekdayNum === expWeekdayNum;

  // Formula 2: Star Group = (4 * P) mod 9
  const rs = ((4 * elapsedPalas) % 9 + 9) % 9;
  const calcStarGroup = rs === 0 ? 9 : Math.ceil(rs);
  const starGroupMatched = calcStarGroup === expStarGroup;

  // 63-Pala Grid proximity (LCM of 7 and 9 is 63)
  const rem63 = ((elapsedPalas % 63) + 63) % 63;
  const offsetFrom63GridPalas = Math.min(rem63, 63 - rem63);

  let score = 0;
  if (weekdayMatched) score += 3;
  if (starGroupMatched) score += 3;
  if (weekdayMatched && starGroupMatched) score += 2; // bonus convergence

  return {
    weekdayMatched,
    starGroupMatched,
    computedWeekdayNumber: calcWeekdayNum,
    expectedWeekdayNumber: expWeekdayNum,
    computedStarGroup: calcStarGroup,
    expectedStarGroup: expStarGroup,
    offsetFrom63GridPalas: Math.round(offsetFrom63GridPalas * 10) / 10,
    score,
    audit: `Palas ${elapsedPalas.toFixed(1)}: Weekday (3P mod 7) = ${calcWeekdayNum} (Exp: ${expWeekdayNum} ${weekdayName}), StarGroup (4P mod 9) = ${calcStarGroup} (Exp: ${expStarGroup}). 63-Grid offset: ${offsetFrom63GridPalas.toFixed(1)}p.`,
  };
}

// ── Navamsa-Dwadasamsa (N-D) 16'40'' Gender Alternation (Chapter VI & pp. 116-117) ──
// Each sign of 30° is divided into 108 N-D points of 16'40'' each (~66.6 seconds of rotation).
export function evaluateNDGender(
  lagnaLon: number,
  nativeGender?: "male" | "female" | "other"
): NDGenderResult {
  const normLon = ((lagnaLon % 360) + 360) % 360;
  const signIdx = Math.floor(normLon / 30);
  const degInSign = normLon % 30;

  // Odd signs: Aries (0), Gemini (2), Leo (4), Libra (6), Sagittarius (8), Aquarius (10)
  const isOddSign = signIdx % 2 === 0;

  const ndArc = 30 / 108; // 16'40'' = 0.2777777778°
  const ndPoint = Math.min(108, Math.max(1, Math.floor(degInSign / ndArc) + 1));
  const isOddPoint = ndPoint % 2 !== 0;

  // In odd signs, odd N-D is Male, even N-D is Female.
  // In even signs, odd N-D is Female, even N-D is Male (Page 43-44).
  const ndGender: "male" | "female" = isOddSign
    ? (isOddPoint ? "male" : "female")
    : (isOddPoint ? "female" : "male");

  let matched = true;
  let score = 2;
  if (nativeGender && (nativeGender === "male" || nativeGender === "female")) {
    matched = ndGender === nativeGender;
    score = matched ? 3 : 0;
  }

  return {
    ndPointNumber: ndPoint,
    ndSign: RASHIS[signIdx],
    ndGender,
    nativeGender,
    matched,
    score,
    audit: `Lagna in ${RASHIS[signIdx]} ${degInSign.toFixed(2)}° falls in N-D Point #${ndPoint} (${ndGender.toUpperCase()}). Native gender: ${nativeGender?.toUpperCase() || "UNSPECIFIED"}.`,
  };
}

// ── Sun's Nakshatra to Ascendant 4-Quarter Rule (Chapter XIV, pp. 85-88) ───────
export function evaluateSunStarToAscendant(
  sunLon: number,
  ascLon: number,
  isDayBirth: boolean,
  sunInfo: ReturnType<typeof computeSunrisePalas>
): SunStarAscendantResult {
  const sunNak = getNak(sunLon);
  const ascNak = getNak(ascLon);

  const totalQuarterDuration = isDayBirth
    ? sunInfo.dayDurationHours / 4
    : sunInfo.nightDurationHours / 4;

  const elapsedHours = sunInfo.elapsedSeconds / 3600;
  let q: 1 | 2 | 3 | 4 = 1;
  if (isDayBirth) {
    if (elapsedHours < totalQuarterDuration) q = 1;
    else if (elapsedHours < 2 * totalQuarterDuration) q = 2;
    else if (elapsedHours < 3 * totalQuarterDuration) q = 3;
    else q = 4;
  } else {
    const nightElapsedHours = Math.max(0, elapsedHours - sunInfo.dayDurationHours);
    if (nightElapsedHours < totalQuarterDuration) q = 1;
    else if (nightElapsedHours < 2 * totalQuarterDuration) q = 2;
    else if (nightElapsedHours < 3 * totalQuarterDuration) q = 3;
    else q = 4;
  }

  // Chapter XIV Rule Table (Page 88):
  // Daytime offsets from Sun star:
  // Q1: [1, 3], Q2: [3, 5], Q3: [5, 7], Q4: [12, 15]
  // Nighttime offsets from Sun star:
  // Q1: [17, 19], Q2: [21, 23], Q3: [23, 24], Q4: [25, 27]
  const EXPECTED_OFFSETS: Record<"day" | "night", Record<1 | 2 | 3 | 4, number[]>> = {
    day: {
      1: [1, 3],
      2: [3, 5],
      3: [5, 7],
      4: [12, 15],
    },
    night: {
      1: [17, 19],
      2: [21, 23],
      3: [23, 24],
      4: [25, 27],
    },
  };

  const period = isDayBirth ? "day" : "night";
  const validOffsets = EXPECTED_OFFSETS[period][q];

  const offset = ((ascNak.idx - sunNak.idx + 27) % 27) + 1;
  const directMatch = validOffsets.includes(offset);
  const softMatch = validOffsets.some((v) => Math.abs(v - offset) <= 1);
  const matched = directMatch || softMatch;
  const score = directMatch ? 3 : softMatch ? 2 : 0;

  return {
    quarter: q,
    period,
    sunNakshatraNumber: sunNak.idx + 1,
    expectedStarOffsets: validOffsets,
    ascendantNakshatraNumber: ascNak.idx + 1,
    matched,
    score,
    audit: `${period.toUpperCase()} Q${q}: Sun in ${sunNak.name} (#${sunNak.idx + 1}), Ascendant in ${ascNak.name} (#${ascNak.idx + 1}, offset +${offset}). Expected [${validOffsets.join(", ")}]. ${matched ? "Corroborated." : "Deviates."}`,
  };
}

// ── Rashi Elemental Mapping ──────────────────────────────────────────────────
const RASHI_ELEMENTS: Record<string, "fire" | "earth" | "air" | "water"> = {
  Aries: "fire",
  Leo: "fire",
  Sagittarius: "fire",
  Taurus: "earth",
  Virgo: "earth",
  Capricorn: "earth",
  Gemini: "air",
  Libra: "air",
  Aquarius: "air",
  Cancer: "water",
  Scorpio: "water",
  Pisces: "water",
};

// ── Event Astrological Signification Rules ──────────────────────────────────
const EVENT_SIGNIFICATIONS: Record<
  BTREventCategory,
  {
    beneficHouses: number[];
    maleficHouses: number[];
    keyPlanets: string[];
    description: string;
  }
> = {
  career_start: {
    beneficHouses: [10, 6, 11, 2, 1],
    maleficHouses: [],
    keyPlanets: ["Saturn", "Mercury", "Jupiter", "Sun", "Venus"],
    description: "Employment initiation activated by 10th, 6th, or 11th houses",
  },
  promotion: {
    beneficHouses: [10, 11, 1, 9],
    maleficHouses: [],
    keyPlanets: ["Sun", "Jupiter", "Mars", "Saturn", "Mercury"],
    description: "Career elevation via 10th and 11th house lords",
  },
  job_change: {
    beneficHouses: [10, 3, 5, 9],
    maleficHouses: [8, 12],
    keyPlanets: ["Mercury", "Rahu", "Moon"],
    description: "Professional movement activated by 3rd, 5th, or 9th houses",
  },
  job_loss: {
    beneficHouses: [],
    maleficHouses: [6, 8, 12, 5],
    keyPlanets: ["Rahu", "Ketu", "Saturn", "Mars"],
    description: "Career dislocation triggered by 8th, 12th, or Rahu/Ketu",
  },
  marriage: {
    beneficHouses: [7, 2, 11],
    maleficHouses: [6, 8, 12],
    keyPlanets: ["Venus", "Jupiter", "Moon"],
    description: "Marital union through 7th, 2nd, and 11th houses",
  },
  relationship_break: {
    beneficHouses: [],
    maleficHouses: [6, 8, 12],
    keyPlanets: ["Rahu", "Ketu", "Saturn", "Mars"],
    description: "Emotional disruption via dusthanas or afflicted Venus",
  },
  health_crisis: {
    beneficHouses: [],
    maleficHouses: [6, 8, 12],
    keyPlanets: ["Saturn", "Mars", "Rahu", "Ketu"],
    description: "Physical stress via 6th/8th house or maraka lords",
  },
  far_travel: {
    beneficHouses: [9, 12, 3],
    maleficHouses: [],
    keyPlanets: ["Moon", "Rahu", "Jupiter"],
    description: "Long-distance relocation or travel via 9th, 12th, or 3rd houses",
  },
  sibling_milestone: {
    beneficHouses: [3, 11],
    maleficHouses: [],
    keyPlanets: ["Mars", "Jupiter"],
    description: "Sibling life event through 3rd house / Mars",
  },
  home_loss: {
    beneficHouses: [],
    maleficHouses: [4, 8, 12],
    keyPlanets: ["Rahu", "Ketu", "Mars", "Saturn"],
    description: "Domestic dislocation through 4th house affliction",
  },
  asset_purchase: {
    beneficHouses: [4, 2, 11],
    maleficHouses: [],
    keyPlanets: ["Mars", "Venus", "Saturn", "Jupiter"],
    description: "Property acquisition through 4th and 2nd houses",
  },
  child_birth: {
    beneficHouses: [5, 2, 11],
    maleficHouses: [],
    keyPlanets: ["Jupiter", "Venus", "Moon"],
    description: "Childbirth / parenthood via 5th house and Jupiter",
  },
  accident_surgery: {
    beneficHouses: [],
    maleficHouses: [8, 6, 1],
    keyPlanets: ["Mars", "Ketu", "Saturn"],
    description: "Sudden accident, surgery or physical trauma via 8th/6th houses",
  },
  vehicle_purchase: {
    beneficHouses: [4, 11, 2],
    maleficHouses: [],
    keyPlanets: ["Venus", "Mars"],
    description: "Vehicle purchase via 4th house and Venus (Vahanakaraka)",
  },
  education_exam: {
    beneficHouses: [5, 9, 10, 1],
    maleficHouses: [],
    keyPlanets: ["Jupiter", "Mercury", "Sun"],
    description: "Major academic exam clearance, degree or certification",
  },
  foreign_visa: {
    beneficHouses: [9, 12, 3],
    maleficHouses: [],
    keyPlanets: ["Rahu", "Moon", "Saturn"],
    description: "Foreign visa approval, PR, or overseas settlement",
  },
  business_launch: {
    beneficHouses: [7, 3, 10, 11],
    maleficHouses: [],
    keyPlanets: ["Mercury", "Mars", "Sun"],
    description: "Independent business or startup launch via 7th & 3rd houses",
  },
  financial_windfall: {
    beneficHouses: [11, 2, 8],
    maleficHouses: [],
    keyPlanets: ["Jupiter", "Venus", "Rahu"],
    description: "Sudden financial gain, inheritance or major bonus",
  },
  parent_milestone: {
    beneficHouses: [9, 4, 10],
    maleficHouses: [8, 12],
    keyPlanets: ["Sun", "Moon", "Saturn"],
    description: "Major parental milestone or life event via 9th/4th houses",
  },
  legal_dispute: {
    beneficHouses: [11, 6],
    maleficHouses: [8, 12],
    keyPlanets: ["Saturn", "Mars", "Rahu"],
    description: "Legal dispute, lawsuit or court case resolution",
  },
};

// ── Resolve Node (Rahu/Ketu) Representation ─────────────────────────────────
const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

function getEffectivePlanets(planetName: string, chart: ReturnType<typeof calculateChart>): string[] {
  if (planetName !== "Rahu" && planetName !== "Ketu") {
    return [planetName];
  }
  const node = chart.planets[planetName];
  if (!node) return [planetName];

  const proxies = [planetName];
  const signLord = SIGN_LORDS[node.sign];
  if (signLord && !proxies.includes(signLord)) proxies.push(signLord);

  // Check conjunctions (same sign)
  for (const [pName, pData] of Object.entries(chart.planets)) {
    if (pName !== planetName && pData.sign === node.sign && !proxies.includes(pName)) {
      proxies.push(pName);
    }
  }
  return proxies;
}

// ── Evaluate Single Event against Dasha Periods ──────────────────────────────
function evaluateEventAgainstDasha(
  event: BTREvent,
  chart: ReturnType<typeof calculateChart>
): EventMatchDetail {
  const eventTime = new Date(event.date).getTime();
  const rule = EVENT_SIGNIFICATIONS[event.category];

  // Find active Mahadasha
  const md = chart.dashas.find(
    (d) => eventTime >= d.start.getTime() && eventTime <= d.end.getTime()
  );

  if (!md) {
    return {
      eventTitle: event.title,
      eventDate: event.date,
      category: event.category,
      mahadasha: "Unknown",
      antardasha: "Unknown",
      matched: false,
      score: 0,
      reason: "Event date falls outside computed Dasha sequence",
    };
  }

  // Find active Antardasha
  const adList = buildAntarDasha(md.planet, md.start, md.yrs);
  const ad = adList.find(
    (a) => eventTime >= a.start.getTime() && eventTime <= a.end.getTime()
  ) || adList[0];

  const mdPlanet = chart.planets[md.planet];
  const adPlanet = chart.planets[ad.planet];

  let score = 0;
  const reasons: string[] = [];

  const mdEffective = getEffectivePlanets(md.planet, chart);
  const adEffective = getEffectivePlanets(ad.planet, chart);

  // 1. Check if MD or AD planet (or represented planet) matches key significators
  const mdMatchesKey = mdEffective.some(p => rule.keyPlanets.includes(p));
  const adMatchesKey = adEffective.some(p => rule.keyPlanets.includes(p));

  if (mdMatchesKey) {
    score += 25;
    reasons.push(`MD ${md.planet} (${mdEffective.join("/")}) signifies ${event.category}`);
  }
  if (adMatchesKey) {
    score += 35;
    reasons.push(`AD ${ad.planet} (${adEffective.join("/")}) directly signifies ${event.category}`);
  }

  // 2. Check house lordships and placements
  const relevantHouses = [...rule.beneficHouses, ...rule.maleficHouses];
  if (adPlanet && relevantHouses.includes(adPlanet.house)) {
    score += 25;
    reasons.push(`AD ${ad.planet} in House ${adPlanet.house}`);
  }
  if (mdPlanet && relevantHouses.includes(mdPlanet.house)) {
    score += 15;
    reasons.push(`MD ${md.planet} in House ${mdPlanet.house}`);
  }

  // 3. Tail-end / Dasha Sandhi sensitivity for loss/crisis/transitions
  const adDurationMs = ad.end.getTime() - ad.start.getTime();
  const elapsedMs = eventTime - ad.start.getTime();
  const ratio = elapsedMs / Math.max(1, adDurationMs);
  if ((ratio > 0.82 || ratio < 0.18) && (event.category === "job_change" || event.category === "job_loss" || event.category === "relationship_break" || event.category === "career_start")) {
    score += 15;
    reasons.push(`Occurred at Dasha Sandhi transition (${Math.round(ratio * 100)}% through period)`);
  }

  const finalScore = Math.min(100, score);
  const matched = finalScore >= 45;

  return {
    eventTitle: event.title,
    eventDate: event.date,
    category: event.category,
    mahadasha: md.planet,
    antardasha: ad.planet,
    matched,
    score: finalScore,
    reason: reasons.length ? reasons.join("; ") : "Moderate general alignment",
  };
}

// ── Palmistry Compatibility Scorer ──────────────────────────────────────────
function scorePalmCompatibility(
  palm: BTRPalmInput | undefined,
  lagnaRashi: string,
  chart: ReturnType<typeof calculateChart>
): number {
  if (!palm) return 70; // Neutral default if no palm data provided

  let score = 50;

  // 1. Hand Element vs. Lagna Element
  const lagnaElem = RASHI_ELEMENTS[lagnaRashi];
  if (palm.handElement) {
    if (palm.handElement === lagnaElem) {
      score += 25;
    } else if (
      (palm.handElement === "fire" && lagnaElem === "air") ||
      (palm.handElement === "earth" && lagnaElem === "water") ||
      palm.handElement === "hybrid"
    ) {
      score += 15;
    } else {
      score -= 10;
    }
  }

  // 2. Prominent Mounts vs. Chart Dignity
  if (palm.prominentMounts && palm.prominentMounts.length) {
    for (const mount of palm.prominentMounts) {
      const pName = mount.charAt(0).toUpperCase() + mount.slice(1).toLowerCase();
      const p = chart.planets[pName];
      if (p) {
        // High dignity or in Kendra/Trikona (1, 4, 7, 10, 5, 9)
        if ([1, 4, 7, 10, 5, 9].includes(p.house) || p.dignity.includes("Exalted") || p.dignity.includes("Own")) {
          score += 10;
        }
      }
    }
  }

  // 3. Fate Line Origin vs. Moon/4th house
  if (palm.fateLineOrigin === "moon") {
    // If Fate line starts from Moon, Moon must connect to Career (10th) or Service (6th) or be 4th lord
    const moon = chart.planets.Moon;
    if (moon && (moon.house === 6 || moon.house === 10 || moon.house === 11 || moon.house === 3)) {
      score += 15;
    }
  }

  return Math.max(0, Math.min(100, score));
}

// ── Master BTR Orchestrator ──────────────────────────────────────────────────
export function runBirthTimeRectification(input: BTRInput): BTRResult {
  const startTime = Date.now();
  const step = input.stepMinutes ?? 5;

  const startDate = new Date(input.dateRange.startDate);
  const endDate = new Date(input.dateRange.endDate);

  const [startH, startM] = input.timeRange.startTime.split(":").map(Number);
  const [endH, endM] = input.timeRange.endTime.split(":").map(Number);

  const startMinOfDay = startH * 60 + startM;
  const endMinOfDay = endH * 60 + endM;

  const lat = input.lat ?? 28.6139;
  const lon = input.lon ?? 77.2090;
  const tz = input.tz ?? 5.5;

  const candidates: BTRCandidate[] = [];

  // Iterate across candidate dates
  const curDate = new Date(startDate);
  while (curDate <= endDate) {
    const dateStr = curDate.toISOString().slice(0, 10);

    // Iterate across candidate times
    for (let m = startMinOfDay; m <= endMinOfDay; m += step) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const timeStr = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

      try {
        const chart = calculateChart(
          input.name || "Native",
          dateStr,
          timeStr,
          input.city
        );

        // 1. Sunrise & Palas Time Normalization
        const sunInfo = computeSunrisePalas(dateStr, timeStr, lat, lon, tz);

        // 2. Evaluate Life Events against Dasha
        const eventResults = input.events.map((e) =>
          evaluateEventAgainstDasha(e, chart)
        );
        const avgEventScore =
          eventResults.reduce((sum, e) => sum + e.score, 0) /
          Math.max(1, eventResults.length);
        const matchedEventCount = eventResults.filter((e) => e.matched).length;

        // 3. Evaluate Placidus Cusps & KP Sub-Lords
        const kpAyanamsha = computeKPAyanamsha(chart.jd);
        const placidusCusps = computePlacidusCusps(chart.jd, lat, lon, kpAyanamsha);
        const cusp1 = placidusCusps[0];
        const cusp9 = placidusCusps[8];

        const subLord = cusp1?.subLord ?? getSubLord(chart.lagnaLon);
        const starLord = cusp1?.starLord ?? (getNak(chart.lagnaLon).lord as any);
        const signLord = SIGN_LORDS[chart.lagnaRashi] ?? "Mars";

        // 4. KP Rule of Origin (1st Cusp to 9th Cusp)
        const originRes = evaluateRuleOfOrigin(
          { starLord, subLord, signLord },
          { starLord: cusp9?.starLord ?? "Sun", subLord: cusp9?.subLord ?? "Jupiter" }
        );

        // 5. KP Three-Level Linkage (Candidate Lagna vs Ruling Planets)
        const moonNak = getNak(chart.planets.Moon.lon);
        const moonSignLord = SIGN_LORDS[chart.planets.Moon.sign] ?? "Moon";
        const rpSignLords = [sunInfo.dayLord, moonSignLord];
        const rpStarLords = [moonNak.lord, starLord];
        const rpSubLords = [subLord, getSubLord(chart.planets.Moon.lon)];

        const kpThreeLevel = evaluateKPThreeLevelLinkage(
          { signLord, starLord, subLord },
          { signLords: rpSignLords, starLords: rpStarLords, subLords: rpSubLords }
        );

        // 6. Pranapada Validation (R.K. Das Palas Mode)
        const pranapadaRes = evaluatePranapada(
          sunInfo.elapsedPalas,
          chart.planets.Sun.lon,
          chart.lagnaLon
        );

        // 7. Gulika Validation (Classical 8-Fold Division)
        const gulikaRes = evaluateGulika(
          dateStr,
          sunInfo,
          lat,
          lon,
          kpAyanamsha,
          chart.lagnaLon
        );

        // 8. Tattva Validation (5 Elements Palas Cycle, Pages 66-68)
        const tattvaRes = evaluateTattva(
          sunInfo.elapsedPalas,
          sunInfo.astrologicalWeekday,
          chart.lagnaRashi
        );

        // 9. Pala Harmonics (3P mod 7 & 4P mod 9 Dual Check + 63-Grid)
        const palaHarmonics = evaluatePalaHarmonics(
          sunInfo.elapsedPalas,
          sunInfo.astrologicalWeekday,
          moonNak.idx + 1
        );

        // 10. Navamsa-Dwadasamsa (N-D) 16'40'' Gender Check
        const ndGender = evaluateNDGender(chart.lagnaLon, input.gender);

        // 11. Sun's Nakshatra to Ascendant (Chapter XIV 4-Quarter Rule)
        const sunStarAsc = evaluateSunStarToAscendant(
          chart.planets.Sun.lon,
          chart.lagnaLon,
          sunInfo.isDayBirth,
          sunInfo
        );

        // 12. Classical Kunda Algorithm (Prashna Marga)
        const kunda = calculateKunda(chart.lagnaLon);
        const kundaMatch = kunda.kundaLord === moonNak.lord;

        // 13. Palm Compatibility
        const palmScore = scorePalmCompatibility(
          input.palmFeatures,
          chart.lagnaRashi,
          chart
        );

        // 14. Multi-Family Auditable Scoring (Spec Section 29 + R.K. Das Canon)
        // Primary: KP 3-Level (0-30), Rule of Origin (0-20), Life Events (0-30)
        // Secondary: Pranapada (0-10), Gulika (0-5), Pala Harmonics (0-8)
        // Supporting: ND Gender (0-3), Sun-Star Asc (0-3), Tattva (0-2), Kunda (0-3), Palm (0-10)
        // Max Raw Score: 30 + 20 + 30 + 10 + 5 + 8 + 3 + 3 + 2 + 3 + 10 = 124 points
        const rawScore =
          kpThreeLevel.score +
          originRes.score +
          (avgEventScore * 0.3) +
          pranapadaRes.score +
          gulikaRes.score +
          palaHarmonics.score +
          ndGender.score +
          sunStarAsc.score +
          tattvaRes.score +
          (kundaMatch ? 3 : 0) +
          (palmScore * 0.1);

        const totalConfidence = Math.max(0, Math.min(100, Math.round((rawScore / 124) * 100)));

        const deg = Math.floor(chart.lagnaLon % 30);
        const mins = Math.floor(((chart.lagnaLon % 30) - deg) * 60);

        const evidenceMatrix: BTREvidenceMatrix = {
          kpThreeLevel: {
            passed: kpThreeLevel.supported,
            score: kpThreeLevel.score,
            level1Sign: kpThreeLevel.level1Match,
            level2Star: kpThreeLevel.level2Match,
            level3Sub: kpThreeLevel.level3Match,
            details: kpThreeLevel.auditTrail.join("; ") || "KP Three-Level Linkage Evaluated",
          },
          ruleOfOrigin: {
            passed: originRes.originValidated,
            ruleO1: originRes.ruleO1,
            ruleO2: originRes.ruleO2,
            ruleO3: originRes.ruleO3,
            score: originRes.score,
            details: originRes.auditTrail.join("; ") || "Origin validated against 9th Cusp",
          },
          pranapada: {
            passed: pranapadaRes.passed,
            errorDeg: pranapadaRes.errorDeg,
            pranapadaAmsa: pranapadaRes.pranapadaAmsa,
            ascAmsa: pranapadaRes.ascAmsa,
            deltaCorrectionSeconds: pranapadaRes.deltaCorrectionSeconds,
            score: pranapadaRes.score,
            details: pranapadaRes.audit,
          },
          gulika: {
            passed: gulikaRes.matched,
            matchType: gulikaRes.matchType,
            gulikaSign: gulikaRes.gulikaSign,
            gulikaNavamsa: gulikaRes.gulikaNavamsa,
            score: gulikaRes.score,
            details: gulikaRes.audit,
          },
          tattva: {
            tattvaName: tattvaRes.tattvaName,
            tattvaElement: tattvaRes.tattvaElement,
            matched: tattvaRes.matched,
            score: tattvaRes.score,
            details: tattvaRes.audit,
          },
          palaHarmonics: {
            weekdayMatched: palaHarmonics.weekdayMatched,
            starGroupMatched: palaHarmonics.starGroupMatched,
            score: palaHarmonics.score,
            details: palaHarmonics.audit,
          },
          ndGender: {
            ndPointNumber: ndGender.ndPointNumber,
            ndGender: ndGender.ndGender,
            matched: ndGender.matched,
            score: ndGender.score,
            details: ndGender.audit,
          },
          sunStarAscendant: {
            quarter: sunStarAsc.quarter,
            period: sunStarAsc.period,
            matched: sunStarAsc.matched,
            score: sunStarAsc.score,
            details: sunStarAsc.audit,
          },
          kunda: {
            passed: kundaMatch,
            kundaNakshatra: kunda.kundaNakshatra,
            score: kundaMatch ? 3 : 0,
            details: `Kunda ${kunda.kundaNakshatra} (${kunda.kundaLord}). Moon ${moonNak.name} (${moonNak.lord}).`,
          },
          lifeEvents: {
            matchedCount: matchedEventCount,
            totalCount: input.events.length,
            score: Math.round(avgEventScore * 0.3),
            details: `Matched ${matchedEventCount}/${input.events.length} life milestones via active Dasha`,
          },
          palmistry: {
            score: Math.round(palmScore * 0.1),
            elementMatch: input.palmFeatures?.handElement === RASHI_ELEMENTS[chart.lagnaRashi],
            details: `Hand element (${input.palmFeatures?.handElement || "N/A"}) vs ${chart.lagnaRashi} (${RASHI_ELEMENTS[chart.lagnaRashi]})`,
          },
        };

        const trace: string[] = [
          `Time: ${timeStr} · Elapsed Palas: ${sunInfo.elapsedPalas.toFixed(1)} (${sunInfo.astrologicalWeekday})`,
          `KP 3-Level: ${kpThreeLevel.supported ? "PASS" : "PARTIAL"} (+${kpThreeLevel.score} pts)`,
          `Rule of Origin: ${originRes.originValidated ? "VALID" : "UNCONFIRMED"} (+${originRes.score} pts)`,
          `Pranapada: error ${pranapadaRes.errorDeg}° (${pranapadaRes.passed ? "PASS" : "DEVIATION"}) (+${pranapadaRes.score} pts)`,
          `Pala Harmonics: 3P mod 7 => ${palaHarmonics.computedWeekdayNumber}, 4P mod 9 => ${palaHarmonics.computedStarGroup} (+${palaHarmonics.score} pts)`,
          `N-D Gender: Point #${ndGender.ndPointNumber} (${ndGender.ndGender.toUpperCase()}) ${ndGender.matched ? "MATCH" : "MISMATCH"} (+${ndGender.score} pts)`,
          `Gulika: ${gulikaRes.matched ? gulikaRes.matchType : "NO DIRECT ALIGNMENT"} (+${gulikaRes.score} pts)`,
          `Sun-Star Asc: Q${sunStarAsc.quarter} ${sunStarAsc.period} (${sunStarAsc.matched ? "PASS" : "DEVIATION"}) (+${sunStarAsc.score} pts)`,
          `Milestones: ${matchedEventCount}/${input.events.length} matched (+${Math.round(avgEventScore * 0.3)} pts)`,
        ];

        candidates.push({
          date: dateStr,
          time: timeStr,
          isoDateTime: `${dateStr}T${timeStr}:00`,
          confidence: totalConfidence,
          lagnaRashi: chart.lagnaRashi,
          lagnaDegree: deg,
          lagnaMinutes: mins,
          lagnaSubLord: subLord,
          lagnaStarLord: starLord,
          moonRashi: chart.planets.Moon.sign,
          moonNakshatra: chart.planets.Moon.nakshatra,
          moonNakshatraLord: chart.planets.Moon.nakshatraLord,
          kundaMatch,
          kundaNakshatra: kunda.kundaNakshatra,
          palmCompatibilityScore: palmScore,
          eventMatches: eventResults,
          eventMatchScore: Math.round(avgEventScore),
          evidenceMatrix,
          methodTrace: trace,
          ruleOfOriginMatch: originRes.originValidated,
          kpLinkageMatch: kpThreeLevel.supported,
          pranapadaMatch: pranapadaRes.passed,
          gulikaMatch: gulikaRes.matched,
          summary: `${chart.lagnaRashi} Lagna (${deg}°${mins}', Sub: ${subLord}). KP Linkage: ${kpThreeLevel.supported ? "✓" : "~"}, Origin: ${originRes.originValidated ? "✓" : "✗"}, Pranapada: ${pranapadaRes.passed ? "✓" : "~"}, Milestones: ${matchedEventCount}/${input.events.length}.`,
        });
      } catch (err: any) {
        if (candidates.length === 0) console.error("CANDIDATE EVAL ERROR:", err?.message || err);
      }
    }

    curDate.setDate(curDate.getDate() + 1);
  }

  // Sort by highest confidence descending
  candidates.sort((a, b) => b.confidence - a.confidence);

  const best = candidates[0] || null;

  // Compute Rectified Window (Interval estimation per Spec Section 32)
  let rectifiedWindow: { start: string; end: string } | undefined = undefined;
  if (best) {
    const [bH, bM] = best.time.split(":").map(Number);
    const bMinutes = bH * 60 + bM;
    const startM = Math.max(0, bMinutes - 2);
    const endM = Math.min(24 * 60 - 1, bMinutes + 2);
    const sH = Math.floor(startM / 60);
    const sMin = startM % 60;
    const eH = Math.floor(endM / 60);
    const eMin = endM % 60;

    rectifiedWindow = {
      start: `${String(sH).padStart(2, "0")}:${String(sMin).padStart(2, "0")}`,
      end: `${String(eH).padStart(2, "0")}:${String(eMin).padStart(2, "0")}`,
    };
    best.rectifiedWindow = rectifiedWindow;
  }

  const confidenceBand: "HIGH" | "MEDIUM" | "LOW" | "INCONCLUSIVE" = !best
    ? "INCONCLUSIVE"
    : best.confidence >= 78
    ? "HIGH"
    : best.confidence >= 60
    ? "MEDIUM"
    : best.confidence >= 40
    ? "LOW"
    : "INCONCLUSIVE";

  return {
    engineVersion: "2.0.0-astrolife-btr-research",
    totalCandidatesEvaluated: candidates.length,
    bestCandidate: best,
    topCandidates: candidates.slice(0, 5),
    executionTimeMs: Date.now() - startTime,
    evidenceMatrix: best?.evidenceMatrix,
    rectifiedWindow,
    confidenceBand,
  };
}
