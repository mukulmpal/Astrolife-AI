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

// ── NEW: Chara Dasha Antardasha ────────────────────────────────────────────────
export interface CharaDashaAD {
  mdSign: string;
  mdSignNum: number;
  adSign: string;
  adSignNum: number;
  years: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  daysRemaining: number;
  progressPercent: number;
}

// ── NEW: Jaimini Raja Yoga ─────────────────────────────────────────────────────
export interface JaiminiRajaYoga {
  name: string;
  description: string;
  strength: "Strong" | "Moderate";
  involved: string[]; // planets or arudhas involved
}

// ── NEW: Argala (planetary intervention) ──────────────────────────────────────
export interface ArgalaEntry {
  referenceSign: string;
  referenceSignNum: number;
  argalaHouses: { position: string; planets: string[]; type: "Argala" | "VirodhArgala" }[];
  netArgala: "Positive" | "Negative" | "Neutral";
  interpretation: string;
}

export interface JaiminiResult {
  karakas: Karaka[];
  arudhas: ArudhaPada[];
  aspects: JaiminiAspect[];
  charaDasha: CharaDashaPeriod[];
  currentDasha: CharaDashaPeriod | null;
  currentDashaAD: CharaDashaAD[];
  activeAD: CharaDashaAD | null;
  rajaYogas: JaiminiRajaYoga[];
  argala: ArgalaEntry[];
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

// ── Chara Dasha Antardasha ────────────────────────────────────────────────────
// Within a Mahadasha, the ADs cycle through all 12 signs in the same direction
// as the MD sequence. Each AD duration = MD total years / 12.

export function calculateCharaDashaAD(
  mdPeriod: CharaDashaPeriod,
  chart: ChartData
): CharaDashaAD[] {
  const lagnaNum    = Math.floor(md(chart.lagnaLon, 360) / 30);
  const isOddLagna  = lagnaNum % 2 === 0; // Aries=0,Gem=2,Leo=4,Lib=6,Sag=8,Aqr=10 → odd signs
  const adYears     = mdPeriod.years / 12; // equal-duration ADs
  const now         = new Date();
  const ads: CharaDashaAD[] = [];
  let cursor        = new Date(mdPeriod.startDate);

  for (let i = 0; i < 12; i++) {
    // AD starts from MD sign itself, progresses in lagna direction
    const adSignNum = isOddLagna
      ? md(mdPeriod.signNum + i, 12)
      : md(mdPeriod.signNum - i + 12, 12);
    const adStart   = new Date(cursor);
    const adEnd     = new Date(cursor.getTime() + adYears * 365.25 * 24 * 3600 * 1000);
    const isActive  = now >= adStart && now < adEnd;
    const totalMs   = adEnd.getTime() - adStart.getTime();
    const elapsedMs = now.getTime() - adStart.getTime();
    const daysRemaining = Math.max(0, Math.ceil((adEnd.getTime() - now.getTime()) / 86400000));
    const progressPercent = isActive
      ? Number(Math.min(100, (elapsedMs / totalMs) * 100).toFixed(1))
      : now >= adEnd ? 100 : 0;

    ads.push({
      mdSign: mdPeriod.sign,
      mdSignNum: mdPeriod.signNum,
      adSign: RASHIS[adSignNum],
      adSignNum,
      years: Number(adYears.toFixed(2)),
      startDate: adStart,
      endDate: adEnd,
      isActive,
      daysRemaining,
      progressPercent,
    });
    cursor = new Date(adEnd);
  }
  return ads;
}

// ── Jaimini Raja Yogas ────────────────────────────────────────────────────────
// Classical Raja Yogas from Jaimini Sutras

export function detectJaiminiRajaYogas(
  karakas: Karaka[],
  arudhas: ArudhaPada[],
  chart: ChartData
): JaiminiRajaYoga[] {
  const yogas: JaiminiRajaYoga[] = [];
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);

  const EXALTATION: Record<string, number> = {
    Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
  };
  const OWN_SIGNS: Record<string, number[]> = {
    Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
    Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
  };

  const ak  = karakas.find(k => k.role === "AK");
  const amk = karakas.find(k => k.role === "AmK");
  const pk  = karakas.find(k => k.role === "PK");
  const al  = arudhas.find(a => a.house === 1);
  const a10 = arudhas.find(a => a.house === 10);
  const ul  = arudhas.find(a => a.house === 12);
  const a7  = arudhas.find(a => a.house === 7);

  // 1. AK + AmK same sign (strongest Raja Yoga in Jaimini)
  if (ak && amk && ak.signNum === amk.signNum) {
    yogas.push({
      name: "AK-AmK Conjunction",
      description: `${ak.planet} (Atmakaraka) and ${amk.planet} (Amatyakaraka) are in the same sign ${ak.sign}. This is the pinnacle Jaimini Raja Yoga — soul purpose aligns directly with career and worldly success. Exceptional achievement is indicated.`,
      strength: "Strong",
      involved: [ak.planet, amk.planet],
    });
  }

  // 2. AK + AmK in mutual Rashi Drishti
  if (ak && amk && ak.signNum !== amk.signNum &&
    (doesSignAspect(ak.signNum, amk.signNum) || doesSignAspect(amk.signNum, ak.signNum))) {
    yogas.push({
      name: "AK-AmK Mutual Aspect",
      description: `${ak.planet} (AK) and ${amk.planet} (AmK) have mutual Jaimini aspect between ${ak.sign} and ${amk.sign}. Career and soul purpose support each other — authority and recognition come through dharmic work.`,
      strength: "Moderate",
      involved: [ak.planet, amk.planet],
    });
  }

  // 3. AK exalted
  if (ak && EXALTATION[ak.planet] === ak.signNum) {
    yogas.push({
      name: "Exalted Atmakaraka",
      description: `${ak.planet} (Atmakaraka) is exalted in ${ak.sign}. The soul has extraordinary clarity of purpose. Whatever this person chooses to accomplish, they do so with full spiritual backing. High status and recognition in life.`,
      strength: "Strong",
      involved: [ak.planet],
    });
  }

  // 4. AK in own sign
  if (ak && OWN_SIGNS[ak.planet]?.includes(ak.signNum)) {
    yogas.push({
      name: "AK in Own Sign",
      description: `${ak.planet} (Atmakaraka) is in own sign ${ak.sign}. Soul path is confident and self-directed. Success through authenticity — no pretense needed; the native achieves by being exactly who they are.`,
      strength: "Moderate",
      involved: [ak.planet],
    });
  }

  // 5. AmK in 1st or 10th from Lagna
  if (amk) {
    const amkHouseFromLagna = md(amk.signNum - lagnaNum, 12) + 1;
    if ([1, 10].includes(amkHouseFromLagna)) {
      yogas.push({
        name: "AmK in Power Position",
        description: `${amk.planet} (Amatyakaraka) is in H${amkHouseFromLagna} from Lagna — a cardinal house for career. Career planet occupies the house of body/authority (H1) or career itself (H10). Professional success and public recognition are strongly supported.`,
        strength: "Strong",
        involved: [amk.planet],
      });
    }
  }

  // 6. AL + A10 in same sign or mutual aspect
  if (al && a10) {
    if (al.signNum === a10.signNum) {
      yogas.push({
        name: "AL-A10 Conjunction",
        description: `Arudha Lagna (AL) and Rajya Pada (A10) are in the same sign ${al.sign}. Public image and career power merge — the native becomes famous through their work. Very strong indicator for public authority and recognition.`,
        strength: "Strong",
        involved: ["AL", "A10"],
      });
    } else if (doesSignAspect(al.signNum, a10.signNum) || doesSignAspect(a10.signNum, al.signNum)) {
      yogas.push({
        name: "AL aspects A10",
        description: `Arudha Lagna (${al.sign}) and Rajya Pada A10 (${a10.sign}) are in mutual Jaimini aspect. Public identity and career authority reinforce each other. The native's public face directly supports career advancement.`,
        strength: "Moderate",
        involved: ["AL", "A10"],
      });
    }
  }

  // 7. Atmakaraka in 5th from Lagna (Jaimini's special Raja Yoga)
  if (ak) {
    const akFromLagna = md(ak.signNum - lagnaNum, 12) + 1;
    if (akFromLagna === 5) {
      yogas.push({
        name: "AK in 5th (Jaimini RY)",
        description: `${ak.planet} (Atmakaraka) is in the 5th from Lagna. Jaimini specifically marks this as a Raja Yoga — the soul purpose operates through intelligence, creativity, and children. Authority through creative expression or education.`,
        strength: "Moderate",
        involved: [ak.planet],
      });
    }
  }

  // 8. UL and A7 in same sign — destined marriage and partnership
  if (ul && a7 && ul.signNum === a7.signNum) {
    yogas.push({
      name: "UL-A7 Conjunction",
      description: `Upapada Lagna (UL) and Darapada (A7) are in the same sign ${ul.sign}. Marriage is both destined and publicly visible — spouse brings status, and the partnership itself becomes a source of social recognition.`,
      strength: "Strong",
      involved: ["UL", "A7"],
    });
  }

  // 9. PK strong — fortune and father support
  if (pk && (EXALTATION[pk.planet] === pk.signNum || OWN_SIGNS[pk.planet]?.includes(pk.signNum))) {
    yogas.push({
      name: "Strong Pitrukaraka",
      description: `${pk.planet} (Pitrukaraka) is in ${pk.sign} — ${EXALTATION[pk.planet] === pk.signNum ? "exalted" : "own sign"}. Father and Guru give strong support. Fortune, dharma, and higher education are well-supported. Blessings from lineage and teachers compound over time.`,
      strength: "Moderate",
      involved: [pk.planet],
    });
  }

  return yogas;
}

// ── Argala (Planetary Interventions) ─────────────────────────────────────────
// Argala: planets in 2nd, 4th, 11th from a reference sign create positive intervention
// Virodha Argala: planets in 12th, 10th, 3rd counteract
// Net result determines if the reference house is helped or obstructed

export function calculateArgala(chart: ChartData): ArgalaEntry[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);

  // Check which planets occupy a given sign number
  function planetsInSign(signNum: number): string[] {
    const normalizedSign = md(signNum, 12);
    return ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"]
      .filter(p => {
        const pData = chart.planets[p];
        if (!pData) return false;
        return Math.floor(md(pData.lon, 360) / 30) === normalizedSign;
      });
  }

  // Argala houses (offsets from reference): 2nd, 4th, 11th = positive
  // Virodha houses: 12th, 10th, 3rd = counteractive
  const ARGALA_OFFSETS: { offset: number; type: "Argala" | "VirodhArgala"; position: string }[] = [
    { offset: 1,  type: "Argala",       position: "2nd" },
    { offset: 3,  type: "Argala",       position: "4th" },
    { offset: 10, type: "Argala",       position: "11th" },
    { offset: 11, type: "VirodhArgala", position: "12th" },
    { offset: 9,  type: "VirodhArgala", position: "10th" },
    { offset: 2,  type: "VirodhArgala", position: "3rd" },
  ];

  // Calculate Argala for key reference points: Lagna, AL, AK sign
  const lagnaSign = lagnaNum;
  const alOffset  = md(lagnaNum + 0, 12); // Lagna itself; AL computed via arudhas
  const karakas   = calculateKarakas(chart.planets);
  const akSignNum = karakas.find(k => k.role === "AK")?.signNum ?? lagnaNum;

  const referencePoints = [
    { sign: RASHIS[lagnaSign], signNum: lagnaSign },
    { sign: RASHIS[akSignNum], signNum: akSignNum },
  ];

  return referencePoints.map(ref => {
    const argalaHouses = ARGALA_OFFSETS.map(ao => ({
      position: ao.position,
      planets: planetsInSign(ref.signNum + ao.offset),
      type: ao.type,
    }));

    const argalaCount   = argalaHouses.filter(h => h.type === "Argala" && h.planets.length > 0).length;
    const virodhCount   = argalaHouses.filter(h => h.type === "VirodhArgala" && h.planets.length > 0).length;
    const argalaPlanets = argalaHouses.filter(h => h.type === "Argala").flatMap(h => h.planets);
    const virodhPlanets = argalaHouses.filter(h => h.type === "VirodhArgala").flatMap(h => h.planets);

    const netArgala: ArgalaEntry["netArgala"] =
      argalaCount > virodhCount ? "Positive" :
      virodhCount > argalaCount ? "Negative" : "Neutral";

    const interpretation = netArgala === "Positive"
      ? `${ref.sign} receives Argala support from ${argalaPlanets.join(", ")} in key positions. Events and people naturally help the significations of this reference point forward.`
      : netArgala === "Negative"
      ? `${ref.sign} faces Virodha Argala — ${virodhPlanets.join(", ")} in counteractive positions resist or delay outcomes. External resistance needs to be worked through.`
      : `${ref.sign} has balanced Argala and Virodha — support and resistance are roughly equal. Outcomes depend on timing, remedies, and personal effort.`;

    return {
      referenceSign: ref.sign,
      referenceSignNum: ref.signNum,
      argalaHouses,
      netArgala,
      interpretation,
    };
  });
}

// ── Master function ───────────────────────────────────────────────────────────

export function buildJaiminiChart(chart: ChartData): JaiminiResult {
  const karakas      = calculateKarakas(chart.planets);
  const arudhas      = calculateArudhas(chart);
  const aspects      = getJaiminiAspects();
  const charaDasha   = calculateCharaDasha(chart);
  const currentDasha = charaDasha.find(d => d.isActive) ?? null;

  // Chara Dasha Antardasha for the active MD (or first period if none active)
  const mdForAD        = currentDasha ?? charaDasha[0];
  const currentDashaAD = mdForAD ? calculateCharaDashaAD(mdForAD, chart) : [];
  const activeAD       = currentDashaAD.find(d => d.isActive) ?? null;

  const rajaYogas      = detectJaiminiRajaYogas(karakas, arudhas, chart);
  const argala         = calculateArgala(chart);
  const specialFindings = getJaiminiFindings(karakas, arudhas, chart);

  return {
    karakas, arudhas, aspects, charaDasha, currentDasha,
    currentDashaAD, activeAD,
    rajaYogas, argala,
    specialFindings,
  };
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
