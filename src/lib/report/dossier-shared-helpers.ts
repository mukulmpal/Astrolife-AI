/**
 * ============================================================================
 * ASTROLIFE — SHARED DOSSIER CORE HELPERS (M1 Single Source of Truth)
 * ============================================================================
 * Centralizes deterministic astrological lookups, longitude/DMS formatting,
 * active Mahadasha/Antardasha resolution (safe across JSON serialization),
 * House-indexed SAV accessors, 27-Nakshatra Ashtakoota metadata, gender
 * lateralization safety, North Indian SVG rendering, and rolling 12-month
 * dynamic transit radar computation.
 * ============================================================================
 */

import type { ChartData, DashaEntry, PlanetData, VedicPlanet } from "../astro-engine/calculations";
import { buildAntarDasha, computePlanets, getJD } from "../astro-engine/calculations";
import {
  getGenderLateralization,
  getPlanetaryDignity,
  type GenderLateralization,
} from "../astro/human-translator";
import type { PackageDossierOptions } from "./package-dossier-html-generator";

// ─────────────────────────────────────────────────────────────────────────────
// CANONICAL CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const SIGN_NAMES = [
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
] as const;

export const SIGN_GLYPHS = [
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
] as const;

export const SIGN_LORDS: Readonly<Record<string, VedicPlanet>> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

export const PLANET_ABBR: Readonly<Record<string, string>> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
  Ascendant: "As",
  Lagna: "As",
};

export const PLANET_SANSKRIT: Readonly<Record<string, string>> = {
  Sun: "Surya",
  Moon: "Chandra",
  Mars: "Mangal",
  Mercury: "Budha",
  Jupiter: "Guru",
  Venus: "Shukra",
  Saturn: "Shani",
  Rahu: "Rahu",
  Ketu: "Ketu",
};

export const PLANET_WEEKDAYS: Readonly<Record<string, string>> = {
  Sun: "Sunday",
  Moon: "Monday",
  Mars: "Tuesday",
  Mercury: "Wednesday",
  Jupiter: "Thursday",
  Venus: "Friday",
  Saturn: "Saturday",
  Rahu: "Saturday",
  Ketu: "Tuesday",
};

// North Indian Diamond Chart House Coordinates [cx, cy] for 360x360 SVG
const HOUSE_POSITIONS: Readonly<Record<number, readonly [number, number]>> = {
  1: [180, 110],
  2: [100, 55],
  3: [55, 100],
  4: [110, 180],
  5: [55, 260],
  6: [100, 305],
  7: [180, 250],
  8: [260, 305],
  9: [305, 260],
  10: [250, 180],
  11: [305, 100],
  12: [260, 55],
};

// ─────────────────────────────────────────────────────────────────────────────
// ESCAPING, LONGITUDE, HOUSE & DIGNITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function escapeHtml(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function getPlanetLon(
  pd?: (Partial<PlanetData> & { longitude?: number }) | null
): number {
  if (!pd) return 0;
  if (typeof pd.lon === "number" && Number.isFinite(pd.lon)) {
    return ((pd.lon % 360) + 360) % 360;
  }
  if (typeof pd.longitude === "number" && Number.isFinite(pd.longitude)) {
    return ((pd.longitude % 360) + 360) % 360;
  }
  let signIdx = 0;
  if (typeof pd.signNum === "number" && Number.isFinite(pd.signNum)) {
    signIdx = ((Math.trunc(pd.signNum) % 12) + 12) % 12;
  } else if (pd.sign) {
    const idx = SIGN_NAMES.findIndex(
      (s) => s.toLowerCase() === String(pd.sign).trim().toLowerCase()
    );
    if (idx !== -1) signIdx = idx;
  }
  const degInSign = (Number(pd.degree) || 0) + (Number(pd.minutes) || 0) / 60;
  return (((signIdx * 30 + degInSign) % 360) + 360) % 360;
}

export function formatDMS(deg: number): string {
  if (typeof deg !== "number" || !Number.isFinite(deg)) {
    return `0° 00' 00"`;
  }
  const degInSign = ((deg % 30) + 30) % 30;
  const clamped = Math.min(107999, Math.max(0, Math.round(degInSign * 3600)));
  const d = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = clamped % 60;
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

export function getHouseFromLagna(
  signNameOrIdx: string | number,
  lagnaNumber: number
): number {
  const cleanLagna = Number.isFinite(lagnaNumber)
    ? ((Math.trunc(lagnaNumber) % 12) + 12) % 12
    : 0;
  let signIdx = -1;
  if (typeof signNameOrIdx === "number" && Number.isFinite(signNameOrIdx)) {
    signIdx = ((Math.trunc(signNameOrIdx) % 12) + 12) % 12;
  } else {
    const clean = String(signNameOrIdx ?? "").trim().toLowerCase();
    signIdx = SIGN_NAMES.findIndex((s) => s.toLowerCase() === clean);
  }
  if (signIdx === -1) return 1;
  return ((signIdx - cleanLagna + 12) % 12) + 1;
}

export function getSignFromHouse(lagnaNumber: number, houseNum: number): string {
  const cleanLagna = Number.isFinite(lagnaNumber)
    ? ((Math.trunc(lagnaNumber) % 12) + 12) % 12
    : 0;
  const cleanHouse = Number.isFinite(houseNum) ? Math.trunc(houseNum) : 1;
  return SIGN_NAMES[((cleanLagna + (cleanHouse - 1)) % 12 + 12) % 12];
}

export function getPlanetSanskritName(planet: string): string {
  const key = Object.keys(PLANET_SANSKRIT).find(
    (k) => k.toLowerCase() === String(planet || "").trim().toLowerCase()
  );
  return key ? PLANET_SANSKRIT[key] : String(planet || "Graha");
}

export function getPlanetWeekday(planet: string): string {
  const key = Object.keys(PLANET_WEEKDAYS).find(
    (k) => k.toLowerCase() === String(planet || "").trim().toLowerCase()
  );
  return key ? PLANET_WEEKDAYS[key] : "Thursday";
}

const SIGN_LORDS_PLANETS: readonly string[] = [
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

export function computeClassicalDignity(
  planet: string,
  sign: string,
  lon?: number
): string {
  const pClean =
    SIGN_LORDS_PLANETS.find(
      (p) => p.toLowerCase() === String(planet || "").trim().toLowerCase()
    ) || String(planet || "").trim();
  const sClean =
    SIGN_NAMES.find(
      (s) => s.toLowerCase() === String(sign || "").trim().toLowerCase()
    ) || String(sign || "").trim();

  if (typeof lon === "number" && Number.isFinite(lon)) {
    const deg = ((lon % 30) + 30) % 30;
    if (
      (pClean === "Sun" && sClean === "Aries" && deg <= 10) ||
      (pClean === "Moon" && sClean === "Taurus" && deg <= 3) ||
      (pClean === "Mars" && sClean === "Capricorn" && deg <= 28) ||
      (pClean === "Mercury" && sClean === "Virgo" && deg <= 15) ||
      (pClean === "Jupiter" && sClean === "Cancer" && deg <= 5) ||
      (pClean === "Venus" && sClean === "Pisces" && deg <= 27) ||
      (pClean === "Saturn" && sClean === "Libra" && deg <= 20)
    ) {
      return "Param Uchcha (Deep Exaltation)";
    }
  }

  const base = getPlanetaryDignity(pClean, sClean);
  switch (base) {
    case "Exalted":
      return "Uchcha (Exalted)";
    case "Debilitated":
      return "Neecha (Debilitated)";
    case "Moolatrikona":
      return "Moolatrikona";
    case "Own":
      return "Swakshetra (Own Sign)";
    case "Friendly":
      return "Mitra Kshetra (Friendly)";
    case "Enemy":
      return "Shatru Kshetra (Enemy)";
    default:
      return "Sama Kshetra (Neutral)";
  }
}

export function isDusthanaLord(planet: string, lagnaNum: number): boolean {
  const pNorm = String(planet || "").trim().toLowerCase();
  const dusthanaHouses = [6, 8, 12];
  return dusthanaHouses.some((h) => {
    const sign = getSignFromHouse(lagnaNum, h);
    const lord = SIGN_LORDS[sign];
    return lord && lord.toLowerCase() === pNorm;
  });
}

export function getFunctionalBeneficLords(lagnaNum: number): string[] {
  const result: string[] = [];
  for (const h of [1, 5, 9]) {
    const sign = getSignFromHouse(lagnaNum, h);
    const lord = SIGN_LORDS[sign];
    if (lord && !isDusthanaLord(lord, lagnaNum) && !result.includes(lord)) {
      result.push(lord);
    }
  }
  // Ensure Lagna lord is always included first if all trikona lords somehow overlapped
  const lagnaLord = SIGN_LORDS[getSignFromHouse(lagnaNum, 1)];
  if (lagnaLord && !result.includes(lagnaLord)) {
    result.unshift(lagnaLord);
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE DASHA & AGE RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

export interface ActiveDashaState {
  activeDasha: string;
  activeAntar: string;
  activeMD?: DashaEntry;
  activeAD?: { planet: string; start: string; end: string };
  adSeq: DashaEntry[];
  mdStartYear: number;
  mdEndYear: number;
  adStartLabel: string;
  adEndLabel: string;
}

function toValidDate(val: unknown): Date | null {
  if (val instanceof Date) {
    return Number.isFinite(val.getTime()) ? val : null;
  }
  if (typeof val === "string" || typeof val === "number") {
    const d = new Date(val);
    return Number.isFinite(d.getTime()) ? d : null;
  }
  return null;
}

function formatMonthYear(val: unknown, fallback = "Current Cycle"): string {
  const d = toValidDate(val);
  if (!d) return fallback;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function getActiveDashaState(
  chart: ChartData,
  refDate: Date = new Date()
): ActiveDashaState {
  const refMs = refDate.getTime();
  const dashas = Array.isArray(chart?.dashas) ? chart.dashas : [];

  let activeMD = dashas.find((d) => {
    const s = toValidDate(d.start);
    const e = toValidDate(d.end);
    return s !== null && e !== null && refMs >= s.getTime() && refMs < e.getTime();
  });
  if (!activeMD) {
    activeMD = dashas.find((d) => d.active) || dashas[0];
  }

  const activeDasha =
    activeMD?.planet ||
    chart?.planets?.Moon?.nakshatraLord ||
    "Jupiter";

  let adSeq: DashaEntry[] = [];
  if (activeMD) {
    const mdStart = toValidDate(activeMD.start);
    const mdYrs = Number(activeMD.yrs);
    if (mdStart && Number.isFinite(mdYrs) && mdYrs > 0) {
      try {
        adSeq = buildAntarDasha(activeDasha, mdStart, mdYrs);
      } catch {
        adSeq = [];
      }
    }
  }
  if (adSeq.length === 0 && Array.isArray(chart?.antardasha)) {
    adSeq = chart.antardasha;
  }

  let activeADEntry = adSeq.find((a) => {
    const s = toValidDate(a.start);
    const e = toValidDate(a.end);
    return s !== null && e !== null && refMs >= s.getTime() && refMs < e.getTime();
  });
  if (!activeADEntry) {
    activeADEntry =
      adSeq.find((a) => a.active) ||
      (Array.isArray(chart?.antardasha)
        ? chart.antardasha.find((a) => a.active)
        : undefined) ||
      adSeq[0];
  }

  const activeAntar = activeADEntry?.planet || activeDasha;
  const mdStartDate = toValidDate(activeMD?.start);
  const mdEndDate = toValidDate(activeMD?.end);
  const mdStartYear = mdStartDate ? mdStartDate.getFullYear() : refDate.getFullYear();
  const mdEndYear = mdEndDate ? mdEndDate.getFullYear() : mdStartYear + 10;

  const adStartDate = toValidDate(activeADEntry?.start);
  const adEndDate = toValidDate(activeADEntry?.end);

  return {
    activeDasha,
    activeAntar,
    activeMD,
    activeAD:
      activeADEntry && adStartDate && adEndDate
        ? {
            planet: activeADEntry.planet,
            start: adStartDate.toISOString(),
            end: adEndDate.toISOString(),
          }
        : undefined,
    adSeq,
    mdStartYear,
    mdEndYear,
    adStartLabel: formatMonthYear(adStartDate, `${mdStartYear}`),
    adEndLabel: formatMonthYear(adEndDate, `${mdEndYear}`),
  };
}

export function getSeekerAge(
  dob?: string,
  refDate: Date = new Date()
): number | null {
  if (!dob || typeof dob !== "string") return null;
  const trimmed = dob.trim();
  if (!trimmed) return null;

  let birthYear: number;
  let birthMonth: number;
  let birthDay: number;

  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    birthYear = Number(isoMatch[1]);
    birthMonth = Number(isoMatch[2]);
    birthDay = Number(isoMatch[3]);
  } else {
    const parsed = new Date(trimmed);
    if (!Number.isFinite(parsed.getTime())) return null;
    birthYear = parsed.getFullYear();
    birthMonth = parsed.getMonth() + 1;
    birthDay = parsed.getDate();
  }

  if (
    !Number.isFinite(birthYear) ||
    !Number.isFinite(birthMonth) ||
    !Number.isFinite(birthDay) ||
    birthMonth < 1 ||
    birthMonth > 12 ||
    birthDay < 1 ||
    birthDay > 31
  ) {
    return null;
  }

  let age = refDate.getFullYear() - birthYear;
  const refMonth = refDate.getMonth() + 1;
  const refDay = refDate.getDate();
  if (refMonth < birthMonth || (refMonth === birthMonth && refDay < birthDay)) {
    age -= 1;
  }
  return age < 0 ? 0 : age;
}

// ─────────────────────────────────────────────────────────────────────────────
// GENDER RESOLUTION & SAFE LATERALIZATION
// ─────────────────────────────────────────────────────────────────────────────

export interface GenderLateralizationSafe extends GenderLateralization {
  resolvedGender: "male" | "female" | "neutral";
}

export function resolveGender(
  options?: Partial<PackageDossierOptions> | { gender?: string | null },
  chart?: (Partial<ChartData> & { gender?: string | null }) | null
): "male" | "female" | undefined {
  const raw = (options?.gender ?? chart?.gender ?? "")
    .toString()
    .toLowerCase()
    .trim();
  if (["female", "f", "woman", "स्त्री"].includes(raw)) return "female";
  if (["male", "m", "man", "पुरुष"].includes(raw)) return "male";
  return undefined;
}

export function getGenderLateralizationSafe(
  gender?: string
): GenderLateralizationSafe {
  const resolved = resolveGender({ gender });
  if (resolved === "female") {
    return {
      ...getGenderLateralization("female"),
      resolvedGender: "female",
    };
  }
  if (resolved === "male") {
    return {
      ...getGenderLateralization("male"),
      resolvedGender: "male",
    };
  }
  return {
    wrist: "Right / Left wrist (Male: Right · Female: Left)",
    side: "Right / Left side (Male: Right · Female: Left)",
    hand: "Right / Left hand (Male: Right · Female: Left)",
    sanskritTerm: "Dakshina / Vama Anga (दक्षिणाङ्ग / वामाङ्ग)",
    channel: "Solar Pingala / Lunar Ida Nadi",
    resolvedGender: "neutral",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HOUSE-INDEXED ASHTAKAVARGA SAV ACCESSOR
// ─────────────────────────────────────────────────────────────────────────────

export function getAkvHouseSav(
  akvRes:
    | {
        houses?: Array<{ house?: number; score?: number } | number>;
        sarva?: number[];
      }
    | null
    | undefined,
  lagnaNum: number
): number[] {
  const cleanLagna = Number.isFinite(lagnaNum)
    ? ((Math.trunc(lagnaNum) % 12) + 12) % 12
    : 0;

  if (Array.isArray(akvRes?.houses) && akvRes.houses.length === 12) {
    return Array.from({ length: 12 }, (_, idx) => {
      const targetHouse = idx + 1;
      const byHouse = akvRes.houses!.find(
        (item) => typeof item === "object" && item !== null && item.house === targetHouse
      );
      const entry = byHouse ?? akvRes.houses![idx];
      if (typeof entry === "number" && Number.isFinite(entry)) return entry;
      if (
        typeof entry === "object" &&
        entry !== null &&
        typeof entry.score === "number" &&
        Number.isFinite(entry.score)
      ) {
        return entry.score;
      }
      return 28;
    });
  }

  if (Array.isArray(akvRes?.sarva) && akvRes.sarva.length === 12) {
    return Array.from({ length: 12 }, (_, idx) => {
      const signIdx = ((cleanLagna + idx) % 12 + 12) % 12;
      const val = akvRes.sarva![signIdx];
      return typeof val === "number" && Number.isFinite(val) ? val : 28;
    });
  }

  return Array(12).fill(28);
}

// ─────────────────────────────────────────────────────────────────────────────
// 27-NAKSHATRA METADATA & ASHTAKOOTA COMPATIBILITY
// ─────────────────────────────────────────────────────────────────────────────

export interface NakshatraMetadata {
  name: string;
  gana: "Deva" | "Manushya" | "Rakshasa";
  yoni: string;
  nadi: "Adya" | "Madhya" | "Antya";
  ruler: VedicPlanet;
  compatibleNakshatras: string[];
}

interface BaseNakshatraSpec {
  name: string;
  gana: "Deva" | "Manushya" | "Rakshasa";
  yoni: string;
  nadi: "Adya" | "Madhya" | "Antya";
  ruler: VedicPlanet;
}

const BASE_NAKSHATRAS: readonly BaseNakshatraSpec[] = [
  { name: "Ashwini", gana: "Deva", yoni: "Ashwa", nadi: "Adya", ruler: "Ketu" },
  { name: "Bharani", gana: "Manushya", yoni: "Gaja", nadi: "Madhya", ruler: "Venus" },
  { name: "Krittika", gana: "Rakshasa", yoni: "Mesha", nadi: "Antya", ruler: "Sun" },
  { name: "Rohini", gana: "Manushya", yoni: "Sarpa", nadi: "Antya", ruler: "Moon" },
  { name: "Mrigashira", gana: "Deva", yoni: "Sarpa", nadi: "Madhya", ruler: "Mars" },
  { name: "Ardra", gana: "Manushya", yoni: "Shwana", nadi: "Adya", ruler: "Rahu" },
  { name: "Punarvasu", gana: "Deva", yoni: "Marjara", nadi: "Adya", ruler: "Jupiter" },
  { name: "Pushya", gana: "Deva", yoni: "Mesha", nadi: "Madhya", ruler: "Saturn" },
  { name: "Ashlesha", gana: "Rakshasa", yoni: "Marjara", nadi: "Antya", ruler: "Mercury" },
  { name: "Magha", gana: "Rakshasa", yoni: "Mushaka", nadi: "Antya", ruler: "Ketu" },
  { name: "Purva Phalguni", gana: "Manushya", yoni: "Mushaka", nadi: "Madhya", ruler: "Venus" },
  { name: "Uttara Phalguni", gana: "Manushya", yoni: "Gau", nadi: "Adya", ruler: "Sun" },
  { name: "Hasta", gana: "Deva", yoni: "Mahisha", nadi: "Adya", ruler: "Moon" },
  { name: "Chitra", gana: "Rakshasa", yoni: "Vyaghra", nadi: "Madhya", ruler: "Mars" },
  { name: "Swati", gana: "Deva", yoni: "Mahisha", nadi: "Antya", ruler: "Rahu" },
  { name: "Vishakha", gana: "Rakshasa", yoni: "Vyaghra", nadi: "Antya", ruler: "Jupiter" },
  { name: "Anuradha", gana: "Deva", yoni: "Mriga", nadi: "Madhya", ruler: "Saturn" },
  { name: "Jyeshtha", gana: "Rakshasa", yoni: "Mriga", nadi: "Adya", ruler: "Mercury" },
  { name: "Mula", gana: "Rakshasa", yoni: "Shwana", nadi: "Adya", ruler: "Ketu" },
  { name: "Purva Ashadha", gana: "Manushya", yoni: "Vanara", nadi: "Madhya", ruler: "Venus" },
  { name: "Uttara Ashadha", gana: "Manushya", yoni: "Nakula", nadi: "Antya", ruler: "Sun" },
  { name: "Shravana", gana: "Deva", yoni: "Vanara", nadi: "Antya", ruler: "Moon" },
  { name: "Dhanishtha", gana: "Rakshasa", yoni: "Simha", nadi: "Madhya", ruler: "Mars" },
  { name: "Shatabhisha", gana: "Rakshasa", yoni: "Ashwa", nadi: "Adya", ruler: "Rahu" },
  { name: "Purva Bhadrapada", gana: "Manushya", yoni: "Simha", nadi: "Adya", ruler: "Jupiter" },
  { name: "Uttara Bhadrapada", gana: "Manushya", yoni: "Gau", nadi: "Madhya", ruler: "Saturn" },
  { name: "Revati", gana: "Deva", yoni: "Gaja", nadi: "Antya", ruler: "Mercury" },
];

const SWORN_ENEMY_YONIS: ReadonlyArray<readonly [string, string]> = [
  ["Ashwa", "Mahisha"],
  ["Gaja", "Simha"],
  ["Mesha", "Vanara"],
  ["Sarpa", "Nakula"],
  ["Shwana", "Mriga"],
  ["Marjara", "Mushaka"],
  ["Gau", "Vyaghra"],
];

function isSwornEnemyYoni(y1: string, y2: string): boolean {
  return SWORN_ENEMY_YONIS.some(
    ([a, b]) => (a === y1 && b === y2) || (a === y2 && b === y1)
  );
}

function ganaCompatibilityScore(
  g1: BaseNakshatraSpec["gana"],
  g2: BaseNakshatraSpec["gana"]
): number {
  if (g1 === g2) return 6;
  if (
    (g1 === "Deva" && g2 === "Manushya") ||
    (g1 === "Manushya" && g2 === "Deva")
  ) {
    return 5;
  }
  return 0;
}

const SUPPORTIVE_TARAS = new Set([2, 4, 6, 8, 9]);

function computeCompatibleNakshatras(selfIdx: number): string[] {
  const self = BASE_NAKSHATRAS[selfIdx];
  const scored = BASE_NAKSHATRAS.map((cand, candIdx) => {
    if (candIdx === selfIdx) return null;
    if (cand.nadi === self.nadi) return null; // Never Nadi dosha
    if (isSwornEnemyYoni(self.yoni, cand.yoni)) return null; // Never sworn enemy Yoni

    const ganaPts = ganaCompatibilityScore(self.gana, cand.gana);
    const tara = ((candIdx - selfIdx + 27) % 27) % 9 + 1;
    const taraPts = SUPPORTIVE_TARAS.has(tara) ? 3 : 0;
    const sameYoniPts = cand.yoni === self.yoni ? 2 : 0;
    // Prefer same or non-clashing Gana strongly
    const score = ganaPts * 10 + taraPts * 3 + sameYoniPts;
    return { name: cand.name, ganaPts, taraPts, score };
  }).filter((item): item is NonNullable<typeof item> => item !== null && item.ganaPts > 0);

  scored.sort((a, b) => b.score - a.score || b.taraPts - a.taraPts);
  return scored.slice(0, 5).map((item) => item.name);
}

export const NAKSHATRA_METADATA: Readonly<Record<string, NakshatraMetadata>> =
  BASE_NAKSHATRAS.reduce<Record<string, NakshatraMetadata>>((acc, spec, idx) => {
    acc[spec.name] = {
      ...spec,
      compatibleNakshatras: computeCompatibleNakshatras(idx),
    };
    return acc;
  }, {});

export const NAKSHATRA_DATA = NAKSHATRA_METADATA;

const NAKSHATRA_NAME_ALIASES: Readonly<Record<string, string>> = {
  aswini: "Ashwini",
  ashwini: "Ashwini",
  bharani: "Bharani",
  krittika: "Krittika",
  rohini: "Rohini",
  mrigashira: "Mrigashira",
  mrigashirsha: "Mrigashira",
  mrigasira: "Mrigashira",
  ardra: "Ardra",
  ardhra: "Ardra",
  punarvasu: "Punarvasu",
  pushya: "Pushya",
  ashlesha: "Ashlesha",
  ashlesh: "Ashlesha",
  magha: "Magha",
  "purva phalguni": "Purva Phalguni",
  "uttara phalguni": "Uttara Phalguni",
  hasta: "Hasta",
  chitra: "Chitra",
  swati: "Swati",
  vishakha: "Vishakha",
  vishaka: "Vishakha",
  anuradha: "Anuradha",
  jyeshtha: "Jyeshtha",
  jyestha: "Jyeshtha",
  mula: "Mula",
  moola: "Mula",
  "purva ashadha": "Purva Ashadha",
  "purva ashadh": "Purva Ashadha",
  "uttara ashadha": "Uttara Ashadha",
  "uttara ashadh": "Uttara Ashadha",
  shravana: "Shravana",
  shravan: "Shravana",
  dhanishtha: "Dhanishtha",
  dhanishta: "Dhanishtha",
  shatabhisha: "Shatabhisha",
  shatbisha: "Shatabhisha",
  satabhisha: "Shatabhisha",
  "purva bhadrapada": "Purva Bhadrapada",
  "purva bhadra": "Purva Bhadrapada",
  "uttara bhadrapada": "Uttara Bhadrapada",
  "uttara bhadra": "Uttara Bhadrapada",
  revati: "Revati",
};

export function getNakshatraMetadata(nakshatra: string): NakshatraMetadata {
  const cleaned = String(nakshatra || "").toLowerCase().replace(/\s+/g, " ").trim();
  const canonical = NAKSHATRA_NAME_ALIASES[cleaned] || "Ashwini";
  return NAKSHATRA_METADATA[canonical];
}

// ─────────────────────────────────────────────────────────────────────────────
// NORTH INDIAN DIAMOND SVG RENDERER
// ─────────────────────────────────────────────────────────────────────────────

export interface NorthIndianSvgOptions {
  highlightHouses?: number[];
  showAs?: boolean;
  bgColor?: string;
}

export function renderNorthIndianSvg(
  chart: ChartData,
  customPlanets?: Record<
    string,
    { house?: number; sign?: string; retrograde?: boolean; isRetrograde?: boolean }
  >,
  customLagnaNum?: number,
  size = 340,
  opts: NorthIndianSvgOptions = {}
): string {
  const { highlightHouses = [], showAs = true, bgColor } = opts;
  const lagnaIndex =
    typeof customLagnaNum === "number" && Number.isFinite(customLagnaNum)
      ? ((Math.trunc(customLagnaNum) % 12) + 12) % 12
      : typeof chart?.lagnaNum === "number" && Number.isFinite(chart.lagnaNum)
      ? ((Math.trunc(chart.lagnaNum) % 12) + 12) % 12
      : 0;

  const houseContents: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseContents[h] = [];
  if (showAs) {
    houseContents[1].push("As");
  }

  const planetMap = customPlanets || chart?.planets || {};
  for (const [name, pd] of Object.entries(planetMap)) {
    if (!pd) continue;
    const abbr = PLANET_ABBR[name] || name.slice(0, 2);
    let house =
      typeof pd.house === "number" && pd.house >= 1 && pd.house <= 12
        ? Math.trunc(pd.house)
        : 0;
    if (!house && pd.sign) {
      house = getHouseFromLagna(pd.sign, lagnaIndex);
    }
    if (!house) house = 1;
    const isRetro = Boolean(pd.retrograde || (pd as { isRetrograde?: boolean }).isRetrograde);
    houseContents[house].push(abbr + (isRetro ? "(R)" : ""));
  }

  let highlightOverlays = "";
  if (highlightHouses.length > 0) {
    const highlightSet = new Set(highlightHouses);
    for (let h = 1; h <= 12; h++) {
      if (highlightSet.has(h)) {
        const [cx, cy] = HOUSE_POSITIONS[h];
        highlightOverlays += `<circle cx="${cx}" cy="${cy}" r="22" fill="rgba(201,169,97,0.14)" stroke="rgba(201,169,97,0.45)" stroke-width="0.6"/>`;
      }
    }
  }

  let labels = "";
  for (let h = 1; h <= 12; h++) {
    const [cx, cy] = HOUSE_POSITIONS[h];
    const items = houseContents[h];
    const signIdx = ((lagnaIndex + (h - 1)) % 12 + 12) % 12;
    const signNumber = signIdx + 1;

    labels += `<text x="${cx}" y="${cy - 12}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="600" fill="#8C7440">${signNumber}</text>`;

    items.forEach((item, i) => {
      const offsetY = (i - (items.length - 1) / 2) * 11;
      labels += `<text x="${cx}" y="${cy + 6 + offsetY}" text-anchor="middle" dominant-baseline="middle" font-family="'Inter',sans-serif" font-size="8.5" font-weight="700" fill="#C9A961">${escapeHtml(item)}</text>`;
    });
  }

  const bgRect = bgColor
    ? `<rect x="0" y="0" width="360" height="360" fill="${escapeHtml(bgColor)}"/>`
    : "";

  return `<svg width="${size}" height="${size}" viewBox="0 0 360 360" class="kundli-svg">
  ${bgRect}
  ${highlightOverlays}
  <g stroke="#C9A961" stroke-width="0.75" fill="none" opacity="0.65">
    <rect x="10" y="10" width="340" height="340"/>
    <polygon points="180,10 350,180 180,350 10,180"/>
    <line x1="10" y1="10" x2="350" y2="350"/>
    <line x1="350" y1="10" x2="10" y2="350"/>
  </g>
  ${labels}
</svg>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC ROLLING 12-MONTH TRANSIT RADAR
// ─────────────────────────────────────────────────────────────────────────────

export type RadarDomain = "union" | "wealth" | "vastu" | "trading" | "general";

export interface DynamicRadarMonth {
  monthIndex: number; // 1..12
  year: number;
  monthName: string;
  label: string;
  sunSign: string;
  sunHouse: number;
  jupiterSign: string;
  jupiterHouse: number;
  saturnSign: string;
  saturnHouse: number;
  primaryTransitText: string;
  headline: string;
  probability: number;
  badgeClass: "emerald" | "gold" | "amber";
  badgeLabel: string;
  narrative: string;
  favorableDates: string[];
}

export interface DynamicRollingRadarParams {
  lagnaNum: number;
  activeDasha: string;
  activeAntar: string;
  domain?: RadarDomain;
  refDate?: Date;
  akvHouseSav?: number[];
  cityTz?: number;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const HOUSE_SPHERE_LABELS: Readonly<Record<number, string>> = {
  1: "Core Vitality & Identity (1st Bhava)",
  2: "Treasury & Family Speech (2nd Bhava)",
  3: "Initiative & Skill Execution (3rd Bhava)",
  4: "Domestic Peace & Property (4th Bhava)",
  5: "Creative Intellect & Speculation (5th Bhava)",
  6: "Operational Discipline & Service (6th Bhava)",
  7: "Sacred Union & Partnerships (7th Bhava)",
  8: "Deep Research & Transformation (8th Bhava)",
  9: "Dharma & Strategic Fortune (9th Bhava)",
  10: "Executive Authority & Career (10th Bhava)",
  11: "Liquid Gains & Networks (11th Bhava)",
  12: "Subconscious Clearing & Global Ties (12th Bhava)",
};

export function buildDynamicRollingMonths(
  params: DynamicRollingRadarParams
): DynamicRadarMonth[] {
  const {
    lagnaNum,
    activeDasha,
    activeAntar,
    domain = "general",
    refDate = new Date(),
    akvHouseSav,
    cityTz = 5.5,
  } = params;

  const cleanLagna = Number.isFinite(lagnaNum)
    ? ((Math.trunc(lagnaNum) % 12) + 12) % 12
    : 0;
  const lagnaSign = SIGN_NAMES[cleanLagna];
  const months: DynamicRadarMonth[] = [];

  for (let m = 0; m < 12; m++) {
    const target = new Date(refDate.getFullYear(), refDate.getMonth() + m, 15);
    const year = target.getFullYear();
    const monthNum = target.getMonth() + 1;
    const monthName = MONTH_NAMES[target.getMonth()];
    const yyyyMmDd = `${year}-${String(monthNum).padStart(2, "0")}-15`;

    const jd = getJD(yyyyMmDd, "12:00", cityTz);
    const transitPlanets = computePlanets(jd);

    const sunSignIdx = Math.floor((((transitPlanets.Sun % 360) + 360) % 360) / 30);
    const jupSignIdx = Math.floor((((transitPlanets.Jupiter % 360) + 360) % 360) / 30);
    const satSignIdx = Math.floor((((transitPlanets.Saturn % 360) + 360) % 360) / 30);

    const sunSign = SIGN_NAMES[sunSignIdx];
    const jupiterSign = SIGN_NAMES[jupSignIdx];
    const saturnSign = SIGN_NAMES[satSignIdx];

    const sunHouse = getHouseFromLagna(sunSign, cleanLagna);
    const jupiterHouse = getHouseFromLagna(jupiterSign, cleanLagna);
    const saturnHouse = getHouseFromLagna(saturnSign, cleanLagna);

    const savBindus =
      Array.isArray(akvHouseSav) && akvHouseSav.length === 12
        ? akvHouseSav[sunHouse - 1] ?? 28
        : 28;

    let prob = 68;
    if ([1, 2, 4, 5, 7, 9, 10, 11].includes(sunHouse)) prob += 8;
    if ([6, 8, 12].includes(sunHouse)) prob -= 8;
    if ([1, 2, 5, 7, 9, 11].includes(jupiterHouse)) prob += 9;
    if ([3, 6, 10, 11].includes(saturnHouse)) prob += 5;
    if (savBindus >= 30) prob += 6;
    else if (savBindus <= 24) prob -= 6;
    const probability = Math.max(55, Math.min(96, prob));

    const badgeClass: "emerald" | "gold" | "amber" =
      probability >= 80 ? "emerald" : probability >= 68 ? "gold" : "amber";
    const badgeLabel =
      badgeClass === "emerald"
        ? `Peak Alignment (${probability}%)`
        : badgeClass === "gold"
        ? `Steady Momentum (${probability}%)`
        : `Audit & Consolidate (${probability}%)`;

    const sunSphere = HOUSE_SPHERE_LABELS[sunHouse] || `House ${sunHouse}`;
    const jupSphere = HOUSE_SPHERE_LABELS[jupiterHouse] || `House ${jupiterHouse}`;

    const domainPrefix =
      domain === "union"
        ? "Relational & Vivah Focus"
        : domain === "wealth"
        ? "Dhana & Capital Focus"
        : domain === "vastu"
        ? "Spatial & Elemental Focus"
        : domain === "trading"
        ? "Market Liquidity Focus"
        : "Life Alignment Focus";

    const headline = `${domainPrefix}: Sun in ${sunSign} (H${sunHouse}) · Guru in ${jupiterSign} (H${jupiterHouse})`;
    const primaryTransitText = `Sun ${sunSign} (H${sunHouse}) · Jupiter ${jupiterSign} (H${jupiterHouse}) · Saturn ${saturnSign} (H${saturnHouse})`;

    const narrative = `For ${lagnaSign} Lagna under ${activeDasha}–${activeAntar}, transit Sun activates ${sunSphere} (SAV ${savBindus} bindus) while Jupiter illuminates ${jupSphere} from ${jupiterSign} and Saturn anchors structural discipline through House ${saturnHouse} (${saturnSign}).`;

    const shortMon = monthName.slice(0, 3);
    const favorableDates = [
      `${shortMon} 05`,
      `${shortMon} 14`,
      `${shortMon} 23`,
    ];

    months.push({
      monthIndex: m + 1,
      year,
      monthName,
      label: `${monthName} ${year}`,
      sunSign,
      sunHouse,
      jupiterSign,
      jupiterHouse,
      saturnSign,
      saturnHouse,
      primaryTransitText,
      headline,
      probability,
      badgeClass,
      badgeLabel,
      narrative,
      favorableDates,
    });
  }

  return months;
}

export function renderDynamicRollingMonthRadar(
  params: DynamicRollingRadarParams
): string {
  const months = buildDynamicRollingMonths(params);
  return months
    .map((m) => {
      const badgeColor =
        m.badgeClass === "emerald"
          ? "#10B981"
          : m.badgeClass === "gold"
          ? "#C9A961"
          : "#F59E0B";
      return `
      <div class="luxury-card" style="padding:10px 12px;border-left:3px solid ${badgeColor};margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <strong style="color:var(--gold,#C9A961);font-size:11.5px;">${escapeHtml(m.label)}</strong>
          <span style="font-size:9px;font-weight:700;color:${badgeColor};text-transform:uppercase;">${escapeHtml(m.badgeLabel)}</span>
        </div>
        <div style="font-size:10px;font-weight:600;color:var(--ivory,#F4EFE6);margin-bottom:3px;">${escapeHtml(m.headline)}</div>
        <p style="font-size:9.5px;line-height:1.45;color:var(--ivory-dim,#C8C1B0);margin:0;">${escapeHtml(m.narrative)}</p>
      </div>`;
    })
    .join("");
}
