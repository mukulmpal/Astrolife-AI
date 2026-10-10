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
  signifies: string;
  notes: string;
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
  isSavyaSign: boolean;
  isGkSign: boolean;
  isDkSign: boolean;
  isAkSign: boolean;
  isAmkSign: boolean;
}

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

export interface JaiminiRajaYoga {
  name: string;
  description: string;
  strength: "Strong" | "Moderate";
  involved: string[]; // planets or arudhas involved
}

export interface ArgalaEntry {
  referenceSign: string;
  referenceSignNum: number;
  argalaHouses: { position: string; planets: string[]; type: "Argala" | "VirodhArgala" }[];
  netArgala: "Positive" | "Negative" | "Neutral";
  interpretation: string;
}

// ── NEW: Karakamsha Kundali Types ─────────────────────────────────────────────
export interface KarakamshaHouse {
  house: number; // 1 to 12 from Karakamsha Lagna
  sign: string;
  signNum: number;
  planets: string[];
  theme: string;
  significance: string;
}

export interface KarakamshaKundali {
  akPlanet: string;
  akSign: string;
  akSignNum: number;
  karakamshaLagna: string;
  houses: KarakamshaHouse[];
  staticAnalysis: {
    soulPurpose: string;
    wealthSource: string;
    familyNature: string;
    spousePersona: string;
    careerDestiny: string;
    lifeChallenges: string;
  };
}

// ── NEW: GK (Gnatikaraka) Analysis ────────────────────────────────────────────
export interface GkAnalysis {
  gkPlanet: string;
  gkSign: string;
  gkSignNum: number;
  degreeInSign: number;
  gkHouseFromLagna: number;
  houseProblem: string;
  diseases: string[];
  remedies: string[];
  timingDashaSigns: string[];
  isCurrentDashaAfflicted: boolean;
  activeDashaWarning?: string;
  crossVerificationNote: string;
}

// ── NEW: DK (Darakaraka) Analysis ────────────────────────────────────────────
export interface DkAnalysis {
  dkPlanet: string;
  dkSign: string;
  dkSignNum: number;
  degreeInSign: number;
  dkHouseFromLagna: number;
  spousePersona: string;
  spouseTraits: string[];
  marriageTimingSigns: string[];
  isCurrentDashaMarriageWindow: boolean;
  marriageTimingNote: string;
}

// ── NEW: AK & AmK Analysis ────────────────────────────────────────────────────
export interface AkAmkAnalysis {
  akPlanet: string;
  akSign: string;
  akSignNum: number;
  akHouseFromLagna: number;
  akStatus: "Favorable (1/10/11)" | "Challenging (8/12)" | "Moderate";
  akQuality: string;
  akFameTimingSigns: string[];
  isCurrentDashaAk: boolean;
  amkPlanet: string;
  amkSign: string;
  amkSignNum: number;
  amkHouseFromLagna: number;
  amkStatus: "Favorable (1/10/11)" | "Challenging (6/8/12)" | "Moderate";
  amkCareerField: string;
  amkGrowthTimingSigns: string[];
  isCurrentDashaAmk: boolean;
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
  direction: "Savya" | "Apasavya";
  directionReason: string;
  karakamsha: KarakamshaKundali;
  gkAnalysis: GkAnalysis;
  dkAnalysis: DkAnalysis;
  akAmkAnalysis: AkAmkAnalysis;
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const RASHI_ICONS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

export const KARAKA_ROLES: KarakaRole[] = ["AK", "AmK", "BK", "MK", "PK", "GK", "DK"];

export const KARAKA_MEANINGS: Record<KarakaRole, string> = {
  AK:  "Atmakaraka — Soul, name, fame, status, character (1st house significator)",
  AmK: "Amatyakaraka — Profession, business, money, career (2nd, 10th, 11th)",
  BK:  "Bhratrikaraka — Siblings, courage, efforts, hobbies, travel, marketing (3rd house)",
  MK:  "Matrikaraka — Mother, parents, home, domestic life, education (4th house)",
  PK:  "Putrakaraka — Intellect, brain, children, past life good karma (5th house)",
  GK:  "Gnatikaraka — Problems, diseases, debts, enemies (6th house — SABSE IMPORTANT)",
  DK:  "Darakaraka — Life partner, marriage, spouse, partnerships (7th house)",
};

export const KARAKA_SIGNIFIES: Record<KarakaRole, string> = {
  AK:  "1st House — Soul essence, self-respect, personal status, health and life path",
  AmK: "2nd, 10th & 11th Houses — Career authority, financial earning, advisors, vocation",
  BK:  "3rd House — Younger siblings, courage, personal drive, hobbies, short travels",
  MK:  "4th House — Mother, parents, domestic peace, vehicles, land, emotional stability",
  PK:  "5th House — Children, sharp intellect, creative foresight, past life merits",
  GK:  "6th House — Obstacles, debts, enemies, litigation, health vulnerabilities",
  DK:  "7th House — Spouse persona, marriage timing, business contracts, long-term partners",
};

export const KARAKA_ICONS: Record<KarakaRole, string> = {
  AK: "👑", AmK: "💼", BK: "🛡️", MK: "🏡", PK: "💡", GK: "⚡", DK: "💍",
};

export const ARUDHA_META: Record<number, { name: string; shortName: string; meaning: string }> = {
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

// Jaimini sign lords — Mars for Scorpio, Saturn for Aquarius (Rahu/Ketu excluded per transcript)
export const JAIMINI_LORD: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun",  5: "Mercury", 6: "Venus",  7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

// Rashi Drishti — movable ↔ fixed (minus adjacent), dual ↔ all duals
export const JAIMINI_ASPECTS: Record<number, number[]> = {
  0:  [4, 7, 10],   // Aries → Leo, Scorpio, Aquarius (skips Taurus)
  1:  [3, 6, 9],    // Taurus → Cancer, Libra, Capricorn (skips Aries)
  2:  [5, 8, 11],   // Gemini → Virgo, Sagittarius, Pisces
  3:  [1, 7, 10],   // Cancer → Taurus, Scorpio, Aquarius (skips Leo)
  4:  [0, 6, 9],    // Leo → Aries, Libra, Capricorn (skips Cancer)
  5:  [2, 8, 11],   // Virgo → Gemini, Sagittarius, Pisces
  6:  [1, 4, 10],   // Libra → Taurus, Leo, Aquarius (skips Scorpio)
  7:  [0, 3, 9],    // Scorpio → Aries, Cancer, Capricorn (skips Libra)
  8:  [2, 5, 11],   // Sagittarius → Gemini, Virgo, Pisces
  9:  [1, 4, 7],    // Capricorn → Taurus, Leo, Scorpio (skips Aquarius)
  10: [0, 3, 6],    // Aquarius → Aries, Cancer, Libra (skips Capricorn)
  11: [2, 5, 8],    // Pisces → Gemini, Virgo, Sagittarius
};

export const SIGN_COLOR: Record<number, string> = {
  0: "#ef4444", 1: "#a78bfa", 2: "#22c55e", 3: "#38bdf8",
  4: "#f97316", 5: "#84cc16", 6: "#ec4899", 7: "#dc2626",
  8: "#f59e0b", 9: "#64748b", 10: "#6366f1", 11: "#06b6d4",
};

// Savya (Direct/Clockwise) and Apasavya (Reverse/Anti-Clockwise) Signs
// Savya: 1, 2, 3, 7, 8, 9 (0-indexed: 0, 1, 2, 6, 7, 8)
// Apasavya: 4, 5, 6, 10, 11, 12 (0-indexed: 3, 4, 5, 9, 10, 11)
export const SAVYA_SIGNS = [0, 1, 2, 6, 7, 8];
export const APASAVYA_SIGNS = [3, 4, 5, 9, 10, 11];

// ── GK Knowledge Base (From Transcript) ───────────────────────────────────────
export const GK_HOUSE_PROBLEMS: Record<number, string> = {
  1: "Bimariyan, physical stamina drops, health and vitality issues (Tan-bhav affliction)",
  2: "Paisa jo save kiya wo bhi nikal dega — accumulated wealth & family savings drain",
  3: "Chhote bhai-behen se problem, initiative drops, courage & travel stress",
  4: "Ghar/maa se problem, domestic friction, mental peace disruption, property disputes",
  5: "Bachchon se problem, brain fatigue, wrong investment decisions & speculative losses",
  6: "Rog, shatru, karz — disease flares, litigation pressure, workplace rivalry, debt stress",
  7: "Life partner se problem, marital strain, legal or business partnership friction",
  8: "Duniya bhar ki peeda — chronic delays, unexpected obstacles, health trauma, accident risk",
  9: "Bhagya me rukavat, father/guru relations friction, spiritual confusion",
  10: "Profession me allegation, false charges, reputation hit, name/fame ki dhajjiyan",
  11: "Friends circle se dhokha, sudden profit interruptions, social disappointment",
  12: "Kharcha badhega, hospital bills, sleep deprivation, sudden losses, jail/legal anxiety",
};

export const GK_PLANET_DISEASES: Record<string, string[]> = {
  Sun: ["Heart ailments", "Eye problems", "Bone/calcium weakness", "Acidity & bile flare"],
  Moon: ["Depression", "Sleeplessness / insomnia", "Mental stress & anxiety", "Water retention & cough"],
  Mars: ["High BP", "Accidents & surgery", "Muscular & body pain", "Blood infections / cuts"],
  Mercury: ["Memory weakness", "Nervous system distress", "Respiratory & skin allergies", "Speech hesitation"],
  Jupiter: ["Liver complications", "Asthma & bronchial trouble", "Cancerous growth tendencies", "Obesity & wrong judgments"],
  Venus: ["Kidney problems", "Diabetes", "Skin diseases", "Reproductive / urinary friction"],
  Saturn: ["Gas / Vata accumulation", "Severe joint pain", "Knee pain & mobility trouble", "Vascular blockages"],
};

export const GK_PLANET_REMEDIES: Record<string, string[]> = {
  Sun: [
    "Sunday ko needy logon ko gehun (wheat) ka daan karein.",
    "Gareeb mareezon ko dawaiyon (medicines) me madad karein.",
    "Daily morning Surya Gayatri mantra ya Aditya Hridaya Stotra ka paath karein.",
  ],
  Moon: [
    "Gareeb parivaaron ko annadaan (free food) bhent karein.",
    "Mata (mother) ki nitya seva karein aur unka aashirwad lein.",
    "Chandi ke bartan se paani piyein; shivling par kachha doodh arpit karein.",
  ],
  Mars: [
    "North-East (Ishan kon) me Panchmukhi Hanuman ji ki photo/murti sthapit karein aur nitya darshan karein.",
    "Daily exercise ya gym join karein — physical energy ko canalize karein.",
    "Mangalwar ko Hanuman Chalisa ka paath aur laal masoor daal daan karein.",
  ],
  Mercury: [
    "Parindey (birds) ko nitya hari moong daal daalein.",
    "Green parrot (tota) ki seva karein ya pinjre se azaad karein.",
    "Ganesh ji ko durva arpit karein aur gay ko hara chara khilayein.",
  ],
  Jupiter: [
    "Brihaspativar (Thursday) ko chana daal aur haldi mandir me daan karein.",
    "Guruon, shikshakon aur buzurgon ka hridaya se aadar-samman karein.",
    "Bina loan liye honest, transparent decisions lein — shortcut se bachein.",
  ],
  Venus: [
    "Kitchen sink me thoda sa dahi (curd) regular bahayein — Shukra dosh shant hota hai.",
    "Gareebon me aloo (potato) ka langar ya bhojan batein.",
    "Mandir ya suhagin striyon ko itra (perfume) ya safed vastra daan karein.",
  ],
  Saturn: [
    "Kali sabut urad daal + sarson tel ka daan lagatar 16-17 din karein.",
    "Gareeb labour, safai karmachariyon aur physically challenged logon ki seva karein.",
    "Gas aur joint pain ke liye ayurvedic Vata-shamak aahar aur routine apnayein.",
  ],
};

// ── DK Spouse Persona Knowledge Base ──────────────────────────────────────────
export const DK_SPOUSE_PERSONAS: Record<string, { persona: string; traits: string[] }> = {
  Sun: {
    persona: "Authoritative, dignified, and status-conscious partner with royal demeanor",
    traits: ["Natural leadership", "High self-respect & integrity", "Connected to administration/governance", "Expects dignity and respect"],
  },
  Moon: {
    persona: "Deeply emotional, gentle, caring, and nurturing life partner",
    traits: ["High emotional empathy", "Home-oriented and domestic", "Enjoys travel and water bodies", "Intuitive and compassionate"],
  },
  Mars: {
    persona: "Bold, energetic, property-loving, and fiercely protective partner",
    traits: ["Active & sports/fitness oriented", "Decisive & action-driven", "Interest in land/property", "Strong, direct communication"],
  },
  Mercury: {
    persona: "Youthful, intelligent, witty, and highly communicative spouse",
    traits: ["Analytical & quick-witted", "Business/commercial acumen", "Great conversationalist", "Adaptable & social"],
  },
  Jupiter: {
    persona: "Spiritual, wise, knowledgeable advisor and dharmic partner",
    traits: ["Natural teacher & solution provider", "Respects traditions & dharma", "Mature wisdom & sound counsel", "Fond of books and sacred studies"],
  },
  Venus: {
    persona: "Graceful, luxury-loving, artistic, and aesthetic life partner",
    traits: ["Sophisticated aesthetic sense", "Values financial abundance & luxury", "Charming & romantic nature", "Brings beauty & harmony to home"],
  },
  Saturn: {
    persona: "Disciplined, grounded, hardworking, mature, and duty-bound spouse",
    traits: ["Strong work ethic", "Patient and realistic mindset", "Loyal and dependable", "Supports through life hardships"],
  },
};

// ── AK Soul Attributes Knowledge Base ─────────────────────────────────────────
export const AK_SOUL_ATTRIBUTES: Record<string, { quality: string; description: string }> = {
  Sun: {
    quality: "Supreme Character, Status & Truth",
    description: "Soul purpose revolves around truth, integrity, authority, father lineage, and social status. Success comes through honour rather than compromise.",
  },
  Moon: {
    quality: "Compassion, Public Connection & Emotional Mastery",
    description: "Soul grows through maternal devotion, public empathy, emotional resilience, mind control, and adaptability.",
  },
  Mars: {
    quality: "Courage, Physical Energy & Righteous Action",
    description: "Soul evolves through physical courage, defending others, real-estate discipline, and canalizing raw power into dharma.",
  },
  Mercury: {
    quality: "Intellect, Communication & Commercial Wisdom",
    description: "Soul expresses through intellectual discrimination, truthful speech, literature, business mastery, and friendship.",
  },
  Jupiter: {
    quality: "Supreme Wisdom, Teaching & Purity (Solution Provider)",
    description: "Soul is born to advise, mentor, teach, and provide solutions. Never relies on loans or shortcuts; upholds 100% purity and dharmic knowledge.",
  },
  Venus: {
    quality: "Refinement, Unconditional Love & Pure Prosperity",
    description: "Soul evolves through aesthetic harmony, relationship devotion, overcoming superficial lust, and cultivating spiritual grace.",
  },
  Saturn: {
    quality: "Humility, Duty, Truthful Labour & Patience",
    description: "Soul path is grounded in patience, hard work, serving the downtrodden, and mastering worldly detachment through perseverance.",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function md(n: number, m: number): number {
  return ((n % m) + m) % m;
}

// ── Chara Karakas (Degree-Wise, Strictly Excludes Rahu/Ketu) ───────────────────

export function calculateKarakas(planets: ChartData["planets"]): Karaka[] {
  // Strictly 7 planets per classical Jaimini & lecture transcript
  const GRAHA = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const sorted = GRAHA
    .filter(p => planets[p])
    .map(p => {
      const lon = planets[p].lon;
      const deg = md(lon, 360) % 30;
      return { planet: p, degreeInSign: deg, signNum: Math.floor(md(lon, 360) / 30) };
    })
    .sort((a, b) => b.degreeInSign - a.degreeInSign);

  return sorted.map((e, i) => {
    const role = KARAKA_ROLES[i];
    return {
      role,
      planet: e.planet,
      degreeInSign: Number(e.degreeInSign.toFixed(2)),
      signNum: e.signNum,
      sign: RASHIS[e.signNum],
      meaning: KARAKA_MEANINGS[role],
      signifies: KARAKA_SIGNIFIES[role],
      notes: role === "GK"
        ? "SABSE IMPORTANT: Bimari, dushman, karz, aur life ke roadblocks ka time batata hai"
        : role === "AK"
        ? "Soul essence, character and public status"
        : role === "DK"
        ? "Life partner characteristics and marriage timing"
        : "",
    };
  });
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
  if (a === houseSign)                  a = md(houseSign + 9, 12);
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
  if (fromSign === toSign) return false;
  return JAIMINI_ASPECTS[fromSign]?.includes(toSign) ?? false;
}

// ── Chara Dasha Direction & Years ─────────────────────────────────────────────

export function getCharaDashaDirection(lagnaNum: number): {
  direction: "Savya" | "Apasavya";
  isDirect: boolean;
  ninthSignNum: number;
  reason: string;
} {
  // Classical Jaimini 9th House Confirmation Rule:
  // For signs [0, 1, 2] (Aries, Taurus, Gemini) -> 9th house is counted forward: L + 8
  // For signs [3, 4, 5] (Cancer, Leo, Virgo) -> 9th house is counted backward: L - 8
  // For signs [6, 7, 8] (Libra, Scorpio, Sagittarius) -> 9th house is counted backward: L - 8
  // For signs [9, 10, 11] (Capricorn, Aquarius, Pisces) -> 9th house is counted forward: L + 8
  let ninthSignNum: number;
  if ([0, 1, 2, 9, 10, 11].includes(lagnaNum)) {
    ninthSignNum = md(lagnaNum + 8, 12);
  } else {
    ninthSignNum = md(lagnaNum - 8, 12);
  }

  // Confirmation rule from lecture:
  // "Lagna se shuru, 9th house se confirm karo. Agar 9th house Savya hai to Savya, Apasavya hai to Apasavya"
  const isNinthSavya = SAVYA_SIGNS.includes(ninthSignNum);
  const direction: "Savya" | "Apasavya" = isNinthSavya ? "Savya" : "Apasavya";
  const isDirect = direction === "Savya";

  const reason = `Lagna is ${RASHIS[lagnaNum]}. 9th house confirmation yields ${RASHIS[ninthSignNum]} (${isNinthSavya ? "Savya" : "Apasavya"}), directing dasha sequence ${direction} (${isDirect ? "Clockwise" : "Anti-clockwise"}).`;

  return { direction, isDirect, ninthSignNum, reason };
}

export function charaDashaYears(signNum: number, planets: ChartData["planets"]): number {
  const lord = JAIMINI_LORD[signNum];
  const lordPlanet = planets[lord];
  if (!lordPlanet) return 10;
  const lordSign = Math.floor(md(lordPlanet.lon, 360) / 30);

  // If lord is in the same sign (own sign) -> gets full 12 years
  if (lordSign === signNum) return 12;

  // Sign Savya vs Apasavya counting rule:
  // Savya signs: Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius (0, 1, 2, 6, 7, 8)
  // Apasavya signs: Cancer, Leo, Virgo, Capricorn, Aquarius, Pisces (3, 4, 5, 9, 10, 11)
  const isSavya = SAVYA_SIGNS.includes(signNum);

  if (isSavya) {
    // Count forward from sign to lord's sign
    const houseDist = md(lordSign - signNum, 12) + 1;
    return houseDist === 1 ? 12 : houseDist;
  } else {
    // Count reverse from sign to lord's sign
    const houseDist = md(signNum - lordSign, 12) + 1;
    return houseDist === 1 ? 12 : houseDist;
  }
}

export function calculateCharaDasha(
  chart: ChartData,
  karakasInput?: Karaka[]
): CharaDashaPeriod[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const { isDirect } = getCharaDashaDirection(lagnaNum);
  const birthDate = new Date(`${chart.dob}T${chart.tob ?? "12:00"}`);
  const now = new Date();

  const karakas = karakasInput ?? calculateKarakas(chart.planets);
  const gk = karakas.find(k => k.role === "GK");
  const dk = karakas.find(k => k.role === "DK");
  const ak = karakas.find(k => k.role === "AK");
  const amk = karakas.find(k => k.role === "AmK");

  const periods: CharaDashaPeriod[] = [];
  let cursor = new Date(birthDate);

  for (let i = 0; i < 12; i++) {
    const signNum = isDirect ? md(lagnaNum + i, 12) : md(lagnaNum - i, 12);
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

    periods.push({
      sign: RASHIS[signNum],
      signNum,
      years: yrs,
      startDate: start,
      endDate: end,
      isActive,
      daysRemaining,
      progressPercent,
      isSavyaSign: SAVYA_SIGNS.includes(signNum),
      isGkSign: gk ? gk.signNum === signNum : false,
      isDkSign: dk ? dk.signNum === signNum : false,
      isAkSign: ak ? ak.signNum === signNum : false,
      isAmkSign: amk ? amk.signNum === signNum : false,
    });
    cursor = end;
  }
  return periods;
}

// ── Chara Dasha Antardasha ────────────────────────────────────────────────────

export function calculateCharaDashaAD(
  mdPeriod: CharaDashaPeriod,
  chart: ChartData
): CharaDashaAD[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const { isDirect } = getCharaDashaDirection(lagnaNum);
  const adYears = mdPeriod.years / 12;
  const now = new Date();
  const ads: CharaDashaAD[] = [];
  let cursor = new Date(mdPeriod.startDate);

  for (let i = 0; i < 12; i++) {
    // AD starts from MD sign itself, progresses in Lagna's verified direction
    const adSignNum = isDirect
      ? md(mdPeriod.signNum + i, 12)
      : md(mdPeriod.signNum - i, 12);

    const adStart = new Date(cursor);
    const adEnd = new Date(cursor.getTime() + adYears * 365.25 * 24 * 3600 * 1000);
    const isActive = now >= adStart && now < adEnd;
    const totalMs = adEnd.getTime() - adStart.getTime();
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

// ── Karakamsha Kundali ────────────────────────────────────────────────────────

export function calculateKarakamsha(
  chart: ChartData,
  karakas: Karaka[]
): KarakamshaKundali {
  const ak = karakas.find(k => k.role === "AK") ?? karakas[0];
  const akSignNum = ak.signNum;
  const akPlanet = ak.planet;
  const akSign = RASHIS[akSignNum];

  function planetsInSign(sNum: number): string[] {
    const normalized = md(sNum, 12);
    return ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].filter(p => {
      const data = chart.planets[p];
      if (!data) return false;
      return Math.floor(md(data.lon, 360) / 30) === normalized;
    });
  }

  const THEMES: Record<number, { theme: string; significance: string }> = {
    1:  { theme: "Soul Character & Atma Swabhava", significance: "Inherent spiritual identity, physical vitality, self-respect and willpower" },
    2:  { theme: "Source of Wealth & Family Culture", significance: "Speech quality, financial accumulation, inherited mindset and resources" },
    3:  { theme: "Courage, Skills & Initiatives", significance: "Artistic/technical skills, younger siblings, marketing ability, short travels" },
    4:  { theme: "Inner Peace & Domestic Roots", significance: "Mother, real estate, emotional tranquility, mental peace and luxury" },
    5:  { theme: "Intellect, Disciples & Purva Punya", significance: "Sharp intellect, advisory role, children, past life merit and mantra siddhi" },
    6:  { theme: "Karmic Hurdles & Healing Capacity", significance: "Enemies, debts, chronic vulnerabilities, litigation, and service capacity" },
    7:  { theme: "Spouse Persona & Partnerships", significance: "Spouse nature, business alliances, marital bond, and public dealings" },
    8:  { theme: "Occult Depth & Transformations", significance: "Longevity, research ability, sudden events, deep spiritual introspection" },
    9:  { theme: "Dharma, Divine Grace & Guru", significance: "Higher philosophy, teachers, divine blessings, pilgrimage, and fortune" },
    10: { theme: "Worldly Authority & Career Zenith", significance: "Professional authority, highest worldly deeds, status and social impact" },
    11: { theme: "Major Gains & Life Fulfillment", significance: "Elder siblings, financial prosperity, realization of life desires" },
    12: { theme: "Moksha & Spiritual Solitude", significance: "Moksha orientation, charity, foreign connections, and spiritual detachment" },
  };

  const houses: KarakamshaHouse[] = Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    const signNum = md(akSignNum + i, 12);
    const occupants = planetsInSign(signNum);
    const meta = THEMES[h];
    return {
      house: h,
      sign: RASHIS[signNum],
      signNum,
      planets: occupants,
      theme: meta.theme,
      significance: meta.significance,
    };
  });

  // Interpretations based on transcript rules:
  const akAttr = AK_SOUL_ATTRIBUTES[akPlanet] ?? { quality: "Soul Focus", description: "Spiritual development" };
  const h2Planets = houses[1].planets;
  const h7Planets = houses[6].planets;
  const h10Planets = houses[9].planets;

  const wealthSource = h2Planets.length > 0
    ? `Wealth generated through ${h2Planets.join(", ")} significations placed in 2nd from Karakamsha (${houses[1].sign}).`
    : `Wealth governed by ${JAIMINI_LORD[houses[1].signNum]} ruling the 2nd from Karakamsha.`;

  const spousePersona = h7Planets.length > 0
    ? `Spouse characteristics influenced by ${h7Planets.join(", ")} in 7th from Karakamsha (${houses[6].sign}).`
    : `Spouse dynamic shaped by ${houses[6].sign} in 7th from Karakamsha.`;

  const careerDestiny = h10Planets.length > 0
    ? `Career zenith anchored by ${h10Planets.join(", ")} occupying 10th from Karakamsha (${houses[9].sign}).`
    : `Professional authority steered by ${JAIMINI_LORD[houses[9].signNum]} presiding over 10th from Karakamsha.`;

  return {
    akPlanet,
    akSign,
    akSignNum,
    karakamshaLagna: akSign,
    houses,
    staticAnalysis: {
      soulPurpose: `${akPlanet} as Atmakaraka defines the soul core: ${akAttr.quality}. ${akAttr.description}`,
      wealthSource,
      familyNature: `Family foundations and domestic roots governed by ${houses[3].sign} (4th from Karakamsha) with ${houses[3].planets.length ? houses[3].planets.join(", ") : "peaceful vacancy"}.`,
      spousePersona,
      careerDestiny,
      lifeChallenges: `Karmic friction points reflected in 6th & 8th from Karakamsha (${houses[5].sign} & ${houses[7].sign}).`,
    },
  };
}

// ── GK Deep Analysis & Problem Radar ──────────────────────────────────────────

export function evaluateGkAnalysis(
  chart: ChartData,
  karakas: Karaka[],
  charaDasha: CharaDashaPeriod[]
): GkAnalysis {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const gk = karakas.find(k => k.role === "GK") ?? karakas[5];
  const gkHouse = md(gk.signNum - lagnaNum, 12) + 1;

  const houseProblem = GK_HOUSE_PROBLEMS[gkHouse] ?? "General obstacles and testing period";
  const diseases = GK_PLANET_DISEASES[gk.planet] ?? ["Health vulnerability and fatigue"];
  const remedies = GK_PLANET_REMEDIES[gk.planet] ?? ["Regular prayer and charity on suitable day"];

  // Dasha signs that activate GK: GK's own sign + signs that have Jaimini Rashi Drishti on GK's sign
  const aspectingSigns = JAIMINI_ASPECTS[gk.signNum] ?? [];
  const timingDashaSigns = [gk.sign, ...aspectingSigns.map(s => RASHIS[s])];

  const currentDasha = charaDasha.find(d => d.isActive) ?? null;
  const isCurrentDashaAfflicted = Boolean(
    currentDasha && (currentDasha.signNum === gk.signNum || doesSignAspect(currentDasha.signNum, gk.signNum))
  );

  let activeDashaWarning: string | undefined;
  if (isCurrentDashaAfflicted && currentDasha) {
    activeDashaWarning = `CRITICAL JAIMINI WARNING: Active Chara Dasha (${currentDasha.sign}) ${
      currentDasha.signNum === gk.signNum ? "IS the Gnatikaraka (GK) sign" : "aspects the Gnatikaraka (GK) sign"
    }. GK represents problem, rog, karz, and obstacles. Watch for: ${houseProblem}. Follow the prescribed remedies immediately.`;
  }

  const crossVerificationNote = `In Jaimini, GK (${gk.planet} in H${gkHouse} / ${gk.sign}) acts as the karmic testing agent. Any Vimshottari Mahadasha/Antardasha involving 6th/8th/12th lords running parallel to this GK Chara Dasha will double the obstacle intensity.`;

  return {
    gkPlanet: gk.planet,
    gkSign: gk.sign,
    gkSignNum: gk.signNum,
    degreeInSign: gk.degreeInSign,
    gkHouseFromLagna: gkHouse,
    houseProblem,
    diseases,
    remedies,
    timingDashaSigns,
    isCurrentDashaAfflicted,
    activeDashaWarning,
    crossVerificationNote,
  };
}

// ── DK Analysis & Marriage Timing ─────────────────────────────────────────────

export function evaluateDkAnalysis(
  chart: ChartData,
  karakas: Karaka[],
  charaDasha: CharaDashaPeriod[]
): DkAnalysis {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const dk = karakas.find(k => k.role === "DK") ?? karakas[6];
  const dkHouse = md(dk.signNum - lagnaNum, 12) + 1;

  const personaMeta = DK_SPOUSE_PERSONAS[dk.planet] ?? {
    persona: "Supportive and committed life partner",
    traits: ["Devotion", "Partnership mindset", "Patience"],
  };

  // Marriage timing signs in Jaimini Chara Dasha:
  // 1. DK sign
  // 2. 7th house sign from Lagna
  // 3. Signs aspecting DK or Upapada Lagna (UL)
  const seventhHouseSignNum = md(lagnaNum + 6, 12);
  const aspectingDkSigns = JAIMINI_ASPECTS[dk.signNum] ?? [];
  const timingSignsSet = new Set([
    dk.sign,
    RASHIS[seventhHouseSignNum],
    ...aspectingDkSigns.map(s => RASHIS[s]),
  ]);
  const marriageTimingSigns = Array.from(timingSignsSet);

  const currentDasha = charaDasha.find(d => d.isActive) ?? null;
  const isCurrentDashaMarriageWindow = Boolean(
    currentDasha && (currentDasha.signNum === dk.signNum || currentDasha.signNum === seventhHouseSignNum || doesSignAspect(currentDasha.signNum, dk.signNum))
  );

  const marriageTimingNote = isCurrentDashaMarriageWindow
    ? `Active Chara Dasha (${currentDasha?.sign}) directly activates Darakaraka (DK) or 7th house axis. This marks a high-probability marriage/relationship manifestation window.`
    : `Marriage and key partnership commitments will naturally align during Chara Dashas of: ${marriageTimingSigns.join(", ")}.`;

  return {
    dkPlanet: dk.planet,
    dkSign: dk.sign,
    dkSignNum: dk.signNum,
    degreeInSign: dk.degreeInSign,
    dkHouseFromLagna: dkHouse,
    spousePersona: personaMeta.persona,
    spouseTraits: personaMeta.traits,
    marriageTimingSigns,
    isCurrentDashaMarriageWindow,
    marriageTimingNote,
  };
}

// ── AK & AmK Status & Growth Trajectory ────────────────────────────────────────

export function evaluateAkAmkAnalysis(
  chart: ChartData,
  karakas: Karaka[],
  charaDasha: CharaDashaPeriod[]
): AkAmkAnalysis {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const ak = karakas.find(k => k.role === "AK") ?? karakas[0];
  const amk = karakas.find(k => k.role === "AmK") ?? karakas[1];

  const akHouse = md(ak.signNum - lagnaNum, 12) + 1;
  const amkHouse = md(amk.signNum - lagnaNum, 12) + 1;

  const akStatus: AkAmkAnalysis["akStatus"] = [1, 10, 11].includes(akHouse)
    ? "Favorable (1/10/11)"
    : [8, 12].includes(akHouse)
    ? "Challenging (8/12)"
    : "Moderate";

  const amkStatus: AkAmkAnalysis["amkStatus"] = [1, 10, 11].includes(amkHouse)
    ? "Favorable (1/10/11)"
    : [6, 8, 12].includes(amkHouse)
    ? "Challenging (6/8/12)"
    : "Moderate";

  const akQuality = AK_SOUL_ATTRIBUTES[ak.planet]?.quality ?? "Soul Evolution";

  const CAREER_MAP: Record<string, string> = {
    Sun: "Governance, leadership, administration, high public standing",
    Moon: "Public dealing, hospitality, travel, psychological care, FMCG",
    Mars: "Engineering, defense/police, real estate, surgery, sports",
    Mercury: "Trading, IT, communications, analytical finance, media",
    Jupiter: "Advisory, legal, teaching, spiritual mentorship, banking",
    Venus: "Luxury trade, creative arts, media, high-end hospitality, design",
    Saturn: "Heavy industry, law enforcement, service sector, infrastructure",
  };

  const amkCareerField = CAREER_MAP[amk.planet] ?? "Professional vocation";

  const akFameTimingSigns = [ak.sign, ...JAIMINI_ASPECTS[ak.signNum].map(s => RASHIS[s])];
  const amkGrowthTimingSigns = [amk.sign, ...JAIMINI_ASPECTS[amk.signNum].map(s => RASHIS[s])];

  const currentDasha = charaDasha.find(d => d.isActive) ?? null;
  const isCurrentDashaAk = Boolean(currentDasha && currentDasha.signNum === ak.signNum);
  const isCurrentDashaAmk = Boolean(currentDasha && currentDasha.signNum === amk.signNum);

  return {
    akPlanet: ak.planet,
    akSign: ak.sign,
    akSignNum: ak.signNum,
    akHouseFromLagna: akHouse,
    akStatus,
    akQuality,
    akFameTimingSigns,
    isCurrentDashaAk,
    amkPlanet: amk.planet,
    amkSign: amk.sign,
    amkSignNum: amk.signNum,
    amkHouseFromLagna: amkHouse,
    amkStatus,
    amkCareerField,
    amkGrowthTimingSigns,
    isCurrentDashaAmk,
  };
}

// ── Special Findings ──────────────────────────────────────────────────────────

export function getJaiminiFindings(
  karakas: Karaka[],
  arudhas: ArudhaPada[],
  chart: ChartData
): string[] {
  const findings: string[] = [];
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const ak = karakas.find(k => k.role === "AK");
  const amk = karakas.find(k => k.role === "AmK");
  const gk = karakas.find(k => k.role === "GK");
  const dk = karakas.find(k => k.role === "DK");
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
      findings.push("Atmakaraka in 7th from Lagna — Jaimini Rajayoga; soul purpose unfolds through partnerships.");
    if (amk && ak.signNum === amk.signNum)
      findings.push("AK and AmK in the same sign — career aligns directly with soul purpose (Jaimini Raja Yoga).");
  }

  if (gk) {
    const gkHouse = md(gk.signNum - lagnaNum, 12) + 1;
    findings.push(`Gnatikaraka (GK) is ${gk.planet} in House ${gkHouse} (${gk.sign}) — primary karmic obstacle indicator requiring targeted remedies.`);
  }

  if (dk) {
    findings.push(`Darakaraka (DK) is ${dk.planet} in ${dk.sign} — marriage manifestation activates during ${dk.sign} Chara Dasha.`);
  }

  if (al && a10) {
    if (al.signNum === a10.signNum)
      findings.push("AL and A10 conjunct — public identity and career authority merge powerfully.");
    else if (doesSignAspect(al.signNum, a10.signNum) || doesSignAspect(a10.signNum, al.signNum))
      findings.push("AL aspects A10 — public persona strongly supports career visibility.");
  }

  if (a7 && ul && a7.signNum === ul.signNum)
    findings.push("Darapada (A7) and Upapada Lagna (UL) in same sign — destined, lasting partnership.");

  const alOffset = al ? md(al.signNum - lagnaNum, 12) : -1;
  if ([0, 3, 6, 9, 4, 8].includes(alOffset))
    findings.push("Arudha Lagna in kendra or trikona from Lagna — strong public presence and social influence.");

  return findings;
}

// ── Jaimini Raja Yogas ────────────────────────────────────────────────────────

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

  if (ak && amk && ak.signNum === amk.signNum) {
    yogas.push({
      name: "AK-AmK Conjunction",
      description: `${ak.planet} (Atmakaraka) and ${amk.planet} (Amatyakaraka) are in the same sign ${ak.sign}. This is the pinnacle Jaimini Raja Yoga — soul purpose aligns directly with career and worldly success. Exceptional achievement is indicated.`,
      strength: "Strong",
      involved: [ak.planet, amk.planet],
    });
  }

  if (ak && amk && ak.signNum !== amk.signNum &&
    (doesSignAspect(ak.signNum, amk.signNum) || doesSignAspect(amk.signNum, ak.signNum))) {
    yogas.push({
      name: "AK-AmK Mutual Aspect",
      description: `${ak.planet} (AK) and ${amk.planet} (AmK) have mutual Jaimini aspect between ${ak.sign} and ${amk.sign}. Career and soul purpose support each other — authority and recognition come through dharmic work.`,
      strength: "Moderate",
      involved: [ak.planet, amk.planet],
    });
  }

  if (ak && EXALTATION[ak.planet] === ak.signNum) {
    yogas.push({
      name: "Exalted Atmakaraka",
      description: `${ak.planet} (Atmakaraka) is exalted in ${ak.sign}. The soul has extraordinary clarity of purpose. High status and recognition in life.`,
      strength: "Strong",
      involved: [ak.planet],
    });
  }

  if (ak && OWN_SIGNS[ak.planet]?.includes(ak.signNum)) {
    yogas.push({
      name: "AK in Own Sign",
      description: `${ak.planet} (Atmakaraka) is in own sign ${ak.sign}. Soul path is confident and self-directed. Success through authenticity.`,
      strength: "Moderate",
      involved: [ak.planet],
    });
  }

  if (amk) {
    const amkHouseFromLagna = md(amk.signNum - lagnaNum, 12) + 1;
    if ([1, 10].includes(amkHouseFromLagna)) {
      yogas.push({
        name: "AmK in Power Position",
        description: `${amk.planet} (Amatyakaraka) is in H${amkHouseFromLagna} from Lagna — a cardinal house for career. Professional success and public recognition are strongly supported.`,
        strength: "Strong",
        involved: [amk.planet],
      });
    }
  }

  if (al && a10) {
    if (al.signNum === a10.signNum) {
      yogas.push({
        name: "AL-A10 Conjunction",
        description: `Arudha Lagna (AL) and Rajya Pada (A10) are in the same sign ${al.sign}. Public image and career power merge — public authority and recognition.`,
        strength: "Strong",
        involved: ["AL", "A10"],
      });
    } else if (doesSignAspect(al.signNum, a10.signNum) || doesSignAspect(a10.signNum, al.signNum)) {
      yogas.push({
        name: "AL aspects A10",
        description: `Arudha Lagna (${al.sign}) and Rajya Pada A10 (${a10.sign}) are in mutual Jaimini aspect. Public identity and career authority reinforce each other.`,
        strength: "Moderate",
        involved: ["AL", "A10"],
      });
    }
  }

  if (ak) {
    const akFromLagna = md(ak.signNum - lagnaNum, 12) + 1;
    if (akFromLagna === 5) {
      yogas.push({
        name: "AK in 5th (Jaimini RY)",
        description: `${ak.planet} (Atmakaraka) is in the 5th from Lagna. Jaimini specifically marks this as a Raja Yoga — the soul purpose operates through intelligence, creativity, and past life merits.`,
        strength: "Moderate",
        involved: [ak.planet],
      });
    }
  }

  if (ul && a7 && ul.signNum === a7.signNum) {
    yogas.push({
      name: "UL-A7 Conjunction",
      description: `Upapada Lagna (UL) and Darapada (A7) are in the same sign ${ul.sign}. Marriage is both destined and publicly visible — spouse brings status.`,
      strength: "Strong",
      involved: ["UL", "A7"],
    });
  }

  if (pk && (EXALTATION[pk.planet] === pk.signNum || OWN_SIGNS[pk.planet]?.includes(pk.signNum))) {
    yogas.push({
      name: "Strong Putrakaraka",
      description: `${pk.planet} (Putrakaraka) is in ${pk.sign} — ${EXALTATION[pk.planet] === pk.signNum ? "exalted" : "own sign"}. High intelligence, creative foresight, and blessings through progeny.`,
      strength: "Moderate",
      involved: [pk.planet],
    });
  }

  return yogas;
}

// ── Argala (Planetary Interventions) ─────────────────────────────────────────

export function calculateArgala(chart: ChartData): ArgalaEntry[] {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);

  function planetsInSign(signNum: number): string[] {
    const normalizedSign = md(signNum, 12);
    return ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"]
      .filter(p => {
        const pData = chart.planets[p];
        if (!pData) return false;
        return Math.floor(md(pData.lon, 360) / 30) === normalizedSign;
      });
  }

  const ARGALA_OFFSETS: { offset: number; type: "Argala" | "VirodhArgala"; position: string }[] = [
    { offset: 1,  type: "Argala",       position: "2nd" },
    { offset: 3,  type: "Argala",       position: "4th" },
    { offset: 10, type: "Argala",       position: "11th" },
    { offset: 11, type: "VirodhArgala", position: "12th" },
    { offset: 9,  type: "VirodhArgala", position: "10th" },
    { offset: 2,  type: "VirodhArgala", position: "3rd" },
  ];

  const karakas = calculateKarakas(chart.planets);
  const akSignNum = karakas.find(k => k.role === "AK")?.signNum ?? lagnaNum;

  const referencePoints = [
    { sign: RASHIS[lagnaNum], signNum: lagnaNum },
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

// ── Master Function (Layer 4 Foundation) ──────────────────────────────────────

export function buildJaiminiChart(chart: ChartData): JaiminiResult {
  const lagnaNum = Math.floor(md(chart.lagnaLon, 360) / 30);
  const karakas = calculateKarakas(chart.planets);
  const arudhas = calculateArudhas(chart);
  const aspects = getJaiminiAspects();

  const { direction, reason: directionReason } = getCharaDashaDirection(lagnaNum);
  const charaDasha = calculateCharaDasha(chart, karakas);
  const currentDasha = charaDasha.find(d => d.isActive) ?? null;

  const mdForAD = currentDasha ?? charaDasha[0];
  const currentDashaAD = mdForAD ? calculateCharaDashaAD(mdForAD, chart) : [];
  const activeAD = currentDashaAD.find(d => d.isActive) ?? null;

  const rajaYogas = detectJaiminiRajaYogas(karakas, arudhas, chart);
  const argala = calculateArgala(chart);
  const specialFindings = getJaiminiFindings(karakas, arudhas, chart);

  const karakamsha = calculateKarakamsha(chart, karakas);
  const gkAnalysis = evaluateGkAnalysis(chart, karakas, charaDasha);
  const dkAnalysis = evaluateDkAnalysis(chart, karakas, charaDasha);
  const akAmkAnalysis = evaluateAkAmkAnalysis(chart, karakas, charaDasha);

  return {
    karakas,
    arudhas,
    aspects,
    charaDasha,
    currentDasha,
    currentDashaAD,
    activeAD,
    rajaYogas,
    argala,
    specialFindings,
    direction,
    directionReason,
    karakamsha,
    gkAnalysis,
    dkAnalysis,
    akAmkAnalysis,
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
