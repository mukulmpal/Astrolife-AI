import type { ChartData } from "./calculations";

// ── Types ──────────────────────────────────────────────────────────────────────

export type KarakaRole = "AK" | "AmK" | "BK" | "MK" | "PK" | "GK" | "DK";

export interface Karaka {
  role: KarakaRole;
  planet: string;
  degreeInSign: number;
  signNum: number;
  sign: string;
  meaning: string;
}

export interface ArudhaPada {
  house: number;
  name: string;
  shortName: string;
  signNum: number;
  sign: string;
  meaning: string;
}

export interface JaiminiAspect {
  fromSign: number;
  toSigns: number[];
}

export interface CharaDashaPeriod {
  sign: string;
  signNum: number;
  years: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  daysRemaining: number;
  progressPercent: number;
}

export interface JaiminiResult {
  karakas: Karaka[];
  arudhas: ArudhaPada[];
  aspects: JaiminiAspect[];
  charaDasha: CharaDashaPeriod[];
  currentDasha: CharaDashaPeriod | null;
  specialFindings: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const RASHI_ICONS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

export { RASHI_ICONS };

const KARAKA_ROLES: KarakaRole[] = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];

const KARAKA_MEANINGS: Record<KarakaRole, string> = {
  AK:  "Atmakaraka — Soul significator, core spiritual purpose",
  AmK: "Amatyakaraka — Career, profession, key advisers",
  BK:  "Bhratrukaraka — Siblings, courage, co-workers",
  MK:  "Matrukaraka — Mother, home, mind, emotional roots",
  PK:  "Pitrukaraka — Father, dharma, fortune, guru",
  GK:  "Gnatikaraka — Relatives, obstacles, chronic issues",
  DK:  "Darakaraka — Spouse, partnerships, key relationships",
};

const KARAKA_ICONS: Record<KarakaRole, string> = {
  AK: "☀", AmK: "🪐", BK: "♂", MK: "☽", PK: "♃", GK: "☿", DK: "♀",
};

export { KARAKA_ICONS };

const ARUDHA_META: Record<number, { name: string; shortName: string; meaning: string }> = {
  1:  { name: "Lagna Arudha",  shortName: "AL",  meaning: "Public image, how the world perceives you" },
  2:  { name: "Dhana Pada",    shortName: "A2",  meaning: "Wealth perception, face value, resources" },
  3:  { name: "Vikrama Pada",  shortName: "A3",  meaning: "Efforts, courage, initiative" },
  4:  { name: "Matru Pada",    shortName: "A4",  meaning: "Property, vehicles, mother" },
  5:  { name: "Mantra Pada",   shortName: "A5",  meaning: "Children, intelligence, creativity" },
  6:  { name: "Shatru Pada",   shortName: "A6",  meaning: "Enemies, debts, disease perception" },
  7:  { name: "Dara Pada",     shortName: "A7",  meaning: "Spouse, partnerships, social life" },
  8:  { name: "Mrityu Pada",   shortName: "A8",  meaning: "Obstacles, longevity, hidden matters" },
  9:  { name: "Pitru Pada",    shortName: "A9",  meaning: "Father, dharma, fortune, spiritual path" },
  10: { name: "Rajya Pada",    shortName: "A10", meaning: "Career, authority, public power" },
  11: { name: "Labha Pada",    shortName: "A11", meaning: "Gains, income, social network" },
  12: { name: "Upapada Lagna", shortName: "UL",  meaning: "Spouse quality, marriage, liberation" },
};

// Jaimini sign lords — Ketu for Scorpio, Saturn for Aquarius
const JAIMINI_LORD: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun",  5: "Mercury", 6: "Venus",  7: "Ketu",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

// Rashi Drishti — movable ↔ fixed (minus adjacent), dual ↔ all duals
const JAIMINI_ASPECTS: Record<number, number[]> = {
  0:  [4, 7, 10],   // Aries → Leo, Scorpio, Aquarius
  1:  [0, 6, 9],    // Taurus → Aries, Libra, Capricorn
  2:  [5, 8, 11],   // Gemini → Virgo, Sagittarius, Pisces
  3:  [1, 7, 10],   // Cancer → Taurus, Scorpio, Aquarius
  4:  [0, 3, 9],    // Leo → Aries, Cancer, Capricorn
  5:  [2, 8, 11],   // Virgo → Gemini, Sagittarius, Pisces
  6:  [1, 4, 10],   // Libra → Taurus, Leo, Aquarius
  7:  [0, 3, 6],    // Scorpio → Aries, Cancer, Libra
  8:  [2, 5, 11],   // Sagittarius → Gemini, Virgo, Pisces
  9:  [1, 4, 7],    // Capricorn → Taurus, Leo, Scorpio
  10: [3, 6, 9],    // Aquarius → Cancer, Libra, Capricorn
  11: [2, 5, 8],    // Pisces → Gemini, Virgo, Sagittarius
};

// Sign colors for UI
const SIGN_COLOR: Record<number, string> = {
  0: "#ef4444", 1: "#a78bfa", 2: "#22c55e", 3: "#38bdf8",
  4: "#f97316", 5: "#84cc16", 6: "#ec4899", 7: "#dc2626",
  8: "#f59e0b", 9: "#64748b", 10: "#6366f1", 11: "#06b6d4",
};

export { SIGN_COLOR };

// ── Helpers ───────────────────────────────────────────────────────────────────

function md(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// ── Chara Karakas ─────────────────────────────────────────────────────────────

export function calculateKarakas(planets: ChartData["planets"]): Karaka[] {
  const GRAHA = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const sorted = GRAHA
    .filter(p => planets[p])
    .map(p => {
      const lon = planets[p].lon;
      const deg = md(lon, 360) % 30;
      return { planet: p, degreeInSign: deg, signNum: Math.floor(md(lon, 360) / 30) };
    })
    .sort((a, b) => b.degreeInSign - a.degreeInSign);

  return sorted.map((e, i) => ({
    role: KARAKA_ROLES[i],
    planet: e.planet,
    degreeInSign: Number(e.degreeInSign.toFixed(2)),
    signNum: e.signNum,
    sign: RASHIS[e.signNum],
    meaning: KARAKA_MEANINGS[KARAKA_ROLES[i]],
  }));
}

// ── Arudha Padas ──────────────────────────────────────────────────────────────

function lordSignNum(signNum: number, planets: ChartData["planets"]): number {
  const lord = JAIMINI_LORD[signNum];
  if (!planets[lord]) return signNum;
  return Math.floor(md(planets[lord].lon, 360) / 30);
}

function calcArudha(houseSign: number, lordSign: number): number {
  const D = md(lordSign - houseSign, 12) || 12;
  let a = md(lordSign + D - 1, 12);
  if (a === houseSign)         a = md(houseSign + 9, 12);
  else if (a === md(houseSign + 6, 12)) a = md(houseSign + 3, 12);
  return a;
}

export function calculateArudhas(chart: ChartData): ArudhaPada[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  return Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    const houseSign = md(lagnaNum + i, 12);
    const arudhaSign = calcArudha(houseSign, lordSignNum(houseSign, chart.planets));
    const meta = ARUDHA_META[h];
    return {
      house: h,
      name: meta.name,
      shortName: meta.shortName,
      signNum: arudhaSign,
      sign: RASHIS[arudhaSign],
      meaning: meta.meaning,
    };
  });
}

// ── Jaimini Aspects ───────────────────────────────────────────────────────────

export function getJaiminiAspects(): JaiminiAspect[] {
  return Object.entries(JAIMINI_ASPECTS).map(([from, to]) => ({
    fromSign: Number(from),
    toSigns: to,
  }));
}

export function doesSignAspect(fromSign: number, toSign: number): boolean {
  return JAIMINI_ASPECTS[fromSign]?.includes(toSign) ?? false;
}

// ── Chara Dasha ───────────────────────────────────────────────────────────────

function charaDashaYears(signNum: number, planets: ChartData["planets"]): number {
  const lord = JAIMINI_LORD[signNum];
  const lordPlanet = planets[lord];
  if (!lordPlanet) return 10;
  const lordSign = Math.floor(md(lordPlanet.lon, 360) / 30);
  const isOddSign = signNum % 2 === 0; // 0,2,4,6,8,10 = Aries,Gem,Leo,Lib,Sag,Aqr = odd signs
  const count = isOddSign
    ? md(lordSign - signNum, 12) || 12
    : md(signNum - lordSign, 12) || 12;
  return count;
}

export function calculateCharaDasha(chart: ChartData): CharaDashaPeriod[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const isOddLagna = lagnaNum % 2 === 0;
  const birthDate = new Date(`${chart.dob}T${chart.tob ?? "12:00"}`);
  const now = new Date();

  const periods: CharaDashaPeriod[] = [];
  let cursor = new Date(birthDate);

  for (let i = 0; i < 12; i++) {
    const signNum = isOddLagna ? md(lagnaNum + i, 12) : md(lagnaNum - i + 12, 12);
    const yrs = charaDashaYears(signNum, chart.planets);
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setFullYear(end.getFullYear() + yrs);
    const isActive = now >= start && now < end;
    const totalMs = end.getTime() - start.getTime();
    const elapsedMs = now.getTime() - start.getTime();
    const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));
    const progressPercent = isActive
      ? Number(Math.min(100, (elapsedMs / totalMs) * 100).toFixed(1))
      : now >= end ? 100 : 0;
    periods.push({ sign: RASHIS[signNum], signNum, years: yrs, startDate: start, endDate: end, isActive, daysRemaining, progressPercent });
    cursor = end;
  }
  return periods;
}

// ── Special Findings ──────────────────────────────────────────────────────────

export function getJaiminiFindings(karakas: Karaka[], arudhas: ArudhaPada[], chart: ChartData): string[] {
  const findings: string[] = [];
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const ak = karakas.find(k => k.role === "AK");
  const amk = karakas.find(k => k.role === "AmK");
  const al = arudhas.find(a => a.house === 1);
  const a7 = arudhas.find(a => a.house === 7);
  const a10 = arudhas.find(a => a.house === 10);
  const ul = arudhas.find(a => a.house === 12);

  const EXALTATION: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
  const OWN_SIGNS: Record<string, number[]> = {
    Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
  };

  if (ak) {
    if (EXALTATION[ak.planet] === ak.signNum)
      findings.push(`${ak.planet} (Atmakaraka) is exalted in ${ak.sign} — exceptional soul strength and spiritual clarity.`);
    if (OWN_SIGNS[ak.planet]?.includes(ak.signNum))
      findings.push(`${ak.planet} (Atmakaraka) in own sign — the soul path is firmly supported.`);
    if (ak.signNum === md(lagnaNum + 6, 12))
      findings.push("Atmakaraka in 7th from Lagna — Jaimini Rajayoga; soul purpose through partnerships.");
    if (amk && ak.signNum === amk.signNum)
      findings.push("AK and AmK in the same sign — career aligned with soul purpose (Jaimini Raja Yoga).");
  }

  if (al && a10) {
    if (al.signNum === a10.signNum)
      findings.push("AL and A10 conjunct — public identity and career authority merge powerfully.");
    else if (doesSignAspect(al.signNum, a10.signNum) || doesSignAspect(a10.signNum, al.signNum))
      findings.push("AL aspects A10 — public persona strongly supports career visibility.");
  }

  if (a7 && ul && a7.signNum === ul.signNum)
    findings.push("Darapada (A7) and Upapada Lagna (UL) in same sign — destined, lasting partnership.");

  // AL in a trine or kendra from lagna → strong public presence
  const alOffset = al ? md(al.signNum - lagnaNum, 12) : -1;
  if ([0, 3, 6, 9, 4, 8].includes(alOffset))
    findings.push("Arudha Lagna in kendra or trikona from Lagna — strong public presence and social influence.");

  return findings;
}

// ── Master function ───────────────────────────────────────────────────────────

export function buildJaiminiChart(chart: ChartData): JaiminiResult {
  const karakas = calculateKarakas(chart.planets);
  const arudhas = calculateArudhas(chart);
  const aspects = getJaiminiAspects();
  const charaDasha = calculateCharaDasha(chart);
  const currentDasha = charaDasha.find(d => d.isActive) ?? null;
  const specialFindings = getJaiminiFindings(karakas, arudhas, chart);
  return { karakas, arudhas, aspects, charaDasha, currentDasha, specialFindings };
}

export function formatCharaDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

export function formatCharaDaysRemaining(days: number): string {
  if (days <= 0) return "Ended";
  if (days < 365) return `${days}d left`;
  const yrs = Math.floor(days / 365);
  const rem = days % 365;
  return rem > 30 ? `${yrs}y ${Math.floor(rem / 30)}m left` : `${yrs}y left`;
}
