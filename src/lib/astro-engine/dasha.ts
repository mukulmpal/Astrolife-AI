// src/lib/astro-engine/dasha.ts
// AstroLife — Complete Dasha + Navtara Engine
// Vimshottari system | Lahiri Ayanamsa | 3-level: Maha + Antar + Pratyantar

import type { ChartData } from "./calculations";

// ── CONSTANTS ────────────────────────────────────────────────────────────────

export const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra",
  "Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni",
  "Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha",
  "Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati",
] as const;
export type Nakshatra = typeof NAKSHATRAS[number];

export const VIMSHOTTARI_ORDER = [
  "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury",
] as const;
export type DashaLord = typeof VIMSHOTTARI_ORDER[number];

export const DASHA_YEARS: Record<DashaLord, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

export const NAKSHATRA_LORD: Record<Nakshatra, DashaLord> = {
  Ashwini: "Ketu",       Bharani: "Venus",     Krittika: "Sun",
  Rohini: "Moon",        Mrigashira: "Mars",   Ardra: "Rahu",
  Punarvasu: "Jupiter",  Pushya: "Saturn",     Ashlesha: "Mercury",
  Magha: "Ketu",         "Purva Phalguni": "Venus", "Uttara Phalguni": "Sun",
  Hasta: "Moon",         Chitra: "Mars",       Swati: "Rahu",
  Vishakha: "Jupiter",   Anuradha: "Saturn",   Jyeshtha: "Mercury",
  Mula: "Ketu",          "Purva Ashadha": "Venus", "Uttara Ashadha": "Sun",
  Shravana: "Moon",      Dhanishtha: "Mars",   Shatabhisha: "Rahu",
  "Purva Bhadrapada": "Jupiter", "Uttara Bhadrapada": "Saturn", Revati: "Mercury",
};

export const NAVTARA = [
  { num: 1, name: "Janma",        nature: "neutral",        meaning: "Self & Body",           icon: "☉" },
  { num: 2, name: "Sampat",       nature: "benefic",        meaning: "Wealth & Prosperity",   icon: "◆" },
  { num: 3, name: "Vipat",        nature: "malefic",        meaning: "Danger & Obstacles",    icon: "☠" },
  { num: 4, name: "Kshema",       nature: "benefic",        meaning: "Wellbeing & Comfort",   icon: "✦" },
  { num: 5, name: "Pratyak",      nature: "malefic",        meaning: "Impediments & Delays",  icon: "⚡" },
  { num: 6, name: "Sadhana",      nature: "benefic",        meaning: "Achievement & Success", icon: "★" },
  { num: 7, name: "Naidhana",     nature: "malefic",        meaning: "Loss & Endings",        icon: "☽" },
  { num: 8, name: "Mitra",        nature: "benefic",        meaning: "Friends & Support",     icon: "♥" },
  { num: 9, name: "Parama Mitra", nature: "highly_benefic", meaning: "Greatest Ally",         icon: "✿" },
] as const;

// ── TYPES ────────────────────────────────────────────────────────────────────

export interface NakshatraInfo {
  index: number;
  name: Nakshatra;
  pada: number;
  lord: DashaLord;
  longitude: number;
  degreeInNakshatra: number;
  completedPercent: number;
}

export interface DashaPeriod {
  lord: DashaLord;
  level: "mahadasha" | "antardasha" | "pratyantardasha";
  startDate: Date;
  endDate: Date;
  durationDays: number;
  isActive: boolean;
  progressPercent: number;
  daysRemaining: number;
  parent?: DashaLord;
  grandParent?: DashaLord;
}

export interface DashaTree {
  current: {
    mahadasha: DashaPeriod;
    antardasha: DashaPeriod;
    pratyantardasha: DashaPeriod;
  };
  timeline: DashaPeriod[];
  antardashas: DashaPeriod[];
  pratyantardashas: DashaPeriod[];
  birthNakshatra: NakshatraInfo;
}

export interface NavtaraResult {
  taraNum: number;
  taraName: string;
  nature: string;
  meaning: string;
  icon: string;
  janmaNakshatra: Nakshatra;
  todayNakshatra: string;
  cycleNumber: number;
  advice: string;
}

// ── NAKSHATRA ────────────────────────────────────────────────────────────────

export function getNakshatraFromLongitude(siderealLong: number): NakshatraInfo {
  const SPAN = 360 / 27;
  const index = Math.floor(siderealLong / SPAN) % 27;
  const degreeInNakshatra = siderealLong % SPAN;
  const pada = Math.min(Math.floor(degreeInNakshatra / (SPAN / 4)) + 1, 4);
  const name = NAKSHATRAS[index];
  return {
    index, name, pada,
    lord: NAKSHATRA_LORD[name],
    longitude: siderealLong,
    degreeInNakshatra,
    completedPercent: (degreeInNakshatra / SPAN) * 100,
  };
}

// ── DASHA ENGINE ─────────────────────────────────────────────────────────────

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const DASHA_TOTAL_YEARS = 120;

function makePeriod(
  lord: DashaLord,
  level: DashaPeriod["level"],
  startMs: number,
  endMs: number,
  parent?: DashaLord,
  grandParent?: DashaLord
): DashaPeriod {
  const now = Date.now();
  const isActive = now >= startMs && now < endMs;
  const durationDays = (endMs - startMs) / 86400000;
  const daysRemaining = isActive ? Math.max(0, Math.ceil((endMs - now) / 86400000)) : 0;
  const progressPercent = isActive
    ? Math.min(100, ((now - startMs) / (endMs - startMs)) * 100)
    : now >= endMs ? 100 : 0;
  return {
    lord, level, isActive, durationDays, daysRemaining, progressPercent,
    startDate: new Date(startMs),
    endDate: new Date(endMs),
    ...(parent ? { parent } : {}),
    ...(grandParent ? { grandParent } : {}),
  };
}

export function getMahadashas(birthDate: Date, nak: NakshatraInfo): DashaPeriod[] {
  const startIdx = VIMSHOTTARI_ORDER.indexOf(nak.lord);
  const completedFrac = nak.completedPercent / 100;
  const balanceYears = DASHA_YEARS[nak.lord] * (1 - completedFrac);

  const periods: DashaPeriod[] = [];
  let cursor = birthDate.getTime();

  const firstEnd = cursor + balanceYears * MS_PER_YEAR;
  periods.push(makePeriod(nak.lord, "mahadasha", cursor, firstEnd));
  cursor = firstEnd;

  for (let i = 1; i < 9; i++) {
    const lord = VIMSHOTTARI_ORDER[(startIdx + i) % 9];
    const end = cursor + DASHA_YEARS[lord] * MS_PER_YEAR;
    periods.push(makePeriod(lord, "mahadasha", cursor, end));
    cursor = end;
  }
  return periods;
}

export function getAntardashas(md: DashaPeriod): DashaPeriod[] {
  const mdStartIdx = VIMSHOTTARI_ORDER.indexOf(md.lord);
  const mdTotalMs = md.endDate.getTime() - md.startDate.getTime();
  const periods: DashaPeriod[] = [];
  let cursor = md.startDate.getTime();

  for (let i = 0; i < 9; i++) {
    const adLord = VIMSHOTTARI_ORDER[(mdStartIdx + i) % 9];
    const adYears = (DASHA_YEARS[md.lord] * DASHA_YEARS[adLord]) / DASHA_TOTAL_YEARS;
    const adMs = (adYears / DASHA_YEARS[md.lord]) * mdTotalMs;
    const end = cursor + adMs;
    periods.push(makePeriod(adLord, "antardasha", cursor, end, md.lord));
    cursor = end;
  }
  return periods;
}

export function getPratyantardashas(ad: DashaPeriod, md: DashaPeriod): DashaPeriod[] {
  const adStartIdx = VIMSHOTTARI_ORDER.indexOf(ad.lord);
  const adTotalMs = ad.endDate.getTime() - ad.startDate.getTime();
  const periods: DashaPeriod[] = [];
  let cursor = ad.startDate.getTime();

  for (let i = 0; i < 9; i++) {
    const pdLord = VIMSHOTTARI_ORDER[(adStartIdx + i) % 9];
    const pdMs = (DASHA_YEARS[pdLord] / DASHA_TOTAL_YEARS) * adTotalMs;
    const end = cursor + pdMs;
    periods.push(makePeriod(pdLord, "pratyantardasha", cursor, end, ad.lord, md.lord));
    cursor = end;
  }
  return periods;
}

export function buildDashaTree(birthDate: Date, nak: NakshatraInfo): DashaTree {
  const timeline = getMahadashas(birthDate, nak);
  const currentMD = timeline.find(p => p.isActive) ?? timeline[0];
  const antardashas = getAntardashas(currentMD);
  const currentAD = antardashas.find(p => p.isActive) ?? antardashas[0];
  const pratyantardashas = getPratyantardashas(currentAD, currentMD);
  const currentPD = pratyantardashas.find(p => p.isActive) ?? pratyantardashas[0];

  return {
    current: { mahadasha: currentMD, antardasha: currentAD, pratyantardasha: currentPD },
    timeline,
    antardashas,
    pratyantardashas,
    birthNakshatra: nak,
  };
}

// ── NAVTARA ──────────────────────────────────────────────────────────────────

const NAVTARA_ADVICE: Record<string, string> = {
  "Janma":        "Focus on self-care. Begin new ventures carefully.",
  "Sampat":       "Excellent for financial dealings, investments, and gains.",
  "Vipat":        "Avoid travel, new starts, and risky decisions today.",
  "Kshema":       "Good for health, family matters, and comfort.",
  "Pratyak":      "Delays likely. Be patient. Avoid confrontations.",
  "Sadhana":      "Best for focused work, skill development, and goals.",
  "Naidhana":     "Rest and reflect. Avoid major decisions and travel.",
  "Mitra":        "Good for social connections, partnerships, and meetings.",
  "Parama Mitra": "Outstanding day — pursue your most important goals.",
};

export function getNavtara(janmaNakshatra: Nakshatra, todayNakshatraName: string): NavtaraResult {
  const janmaIdx = NAKSHATRAS.indexOf(janmaNakshatra);
  const todayIdx = NAKSHATRAS.indexOf(todayNakshatraName as Nakshatra);
  let distance = todayIdx - janmaIdx;
  if (distance < 0) distance += 27;
  const taraPosition = distance % 9;
  const tara = NAVTARA[taraPosition];
  return {
    taraNum: taraPosition + 1,
    taraName: tara.name,
    nature: tara.nature,
    meaning: tara.meaning,
    icon: tara.icon,
    janmaNakshatra,
    todayNakshatra: todayNakshatraName,
    cycleNumber: Math.floor(distance / 9) + 1,
    advice: NAVTARA_ADVICE[tara.name] ?? "",
  };
}

// ── PLANET METADATA ──────────────────────────────────────────────────────────

export const LORD_COLOR: Record<DashaLord, string> = {
  Sun:     "#f97316",
  Moon:    "#e2e8f0",
  Mars:    "#ef4444",
  Mercury: "#22c55e",
  Jupiter: "#eab308",
  Venus:   "#ec4899",
  Saturn:  "#6366f1",
  Rahu:    "#8b5cf6",
  Ketu:    "#a78bfa",
};

export const LORD_ICON: Record<DashaLord, string> = {
  Sun: "☀", Moon: "☽", Mars: "♂", Mercury: "☿",
  Jupiter: "♃", Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

export const LORD_YEARS_DESC: Record<DashaLord, string> = {
  Sun: "6 years", Moon: "10 years", Mars: "7 years", Mercury: "17 years",
  Jupiter: "16 years", Venus: "20 years", Saturn: "19 years", Rahu: "18 years", Ketu: "7 years",
};

// ── BRIDGE: ChartData → DashaTree ────────────────────────────────────────────

export function buildDashaTreeFromChart(chart: ChartData): DashaTree {
  const moonSidereal = chart.planets.Moon.lon;
  const nak = getNakshatraFromLongitude(moonSidereal);
  const birthDate = new Date(`${chart.dob}T${chart.tob}`);
  return buildDashaTree(birthDate, nak);
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

export function formatDashaDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDaysRemaining(days: number): string {
  if (days > 365) {
    const yrs = Math.floor(days / 365);
    const mo  = Math.floor((days % 365) / 30);
    return mo > 0 ? `${yrs}y ${mo}m left` : `${yrs}y left`;
  }
  if (days > 30) return `${Math.floor(days / 30)}m ${days % 30}d left`;
  return `${days}d left`;
}
