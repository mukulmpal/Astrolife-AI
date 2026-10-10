import { computePlanets, getJD, type ChartData, type PlanetData } from "./calculations";

export type SpecialLagnaKey =
  | "AL" | "UL" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "A10" | "A11" | "A12"
  | "HL" | "GL" | "BL" | "SL" | "IL" | "PL";

export type SpecialLagnaCategory = "wealth" | "power" | "arudha" | "sree" | "sunrise" | "lagna";

export interface SpecialLagnaItem {
  key: SpecialLagnaKey;
  name: string;
  shortName: string;
  category: SpecialLagnaCategory;
  sign: string;
  signNum: number;
  house: number;
  longitude: number;
  degreeText: string;
  lord: string;
  lordHouse?: number;
  sourceHouse?: number;
  sourceSign?: string;
  meaning: string;
  interpretation: string;
  actionPlan: string[];
  occupants?: string[];
  aspectingPlanets?: string[];
}

export interface InduLagnaAnalysis {
  sign: string;
  signNum: number;
  house: number;
  lord: string;
  degreeText: string;
  lagna9thLord: string;
  lagna9thRays: number;
  moon9thLord: string;
  moon9thRays: number;
  totalRays: number;
  remainder: number;
  occupants: string[];
  aspectingPlanets: string[];
  kuberYogaTier: "Kuber Sovereign (Multi-Millionaire)" | "High Affluence & Prosperity" | "Self-Made Steady Wealth" | "Fluctuating / Expenditure Heavy";
  kuberYogaScore: number; // 0 to 100
  verdict: string;
  classicalReference: string;
  upay: string[];
}

export interface AlUlSynastry {
  alSign: string;
  alSignNum: number;
  ulSign: string;
  ulSignNum: number;
  distance: number;
  relationship: string;
  score: number; // 1 to 10
  verdict: string;
  transcriptAdvice: string;
  remedy: string;
}

export interface SpecialLagnaRajayoga {
  name: string;
  sanskritName: string;
  type: "Dhana-Raja Yoga" | "Fame & Authority" | "Marital Harmony" | "Wealth Inflow";
  strength: "Supreme" | "Strong" | "Moderate";
  description: string;
  involvedLagnas: string[];
  isFormed: boolean;
}

export interface ActiveDashaActivation {
  mahadashaLord: string;
  antardashaLord?: string;
  activatedLagnas: {
    lagnaKey: string;
    lagnaName: string;
    connection: "Occupies" | "Aspects" | "Rules";
    lifeImpact: string;
  }[];
  overallForecast: string;
}

export interface SpecialLagnaNarrative {
  title: string;
  storyIntro: string;
  publicImageStory: string;
  kuberWealthStory: string;
  powerAndAuthorityStory: string;
  marriageAndSanctuaryStory: string;
  pakaLagnaStory: string;
  mentorSynthesis: string;
}

export interface SpecialLagnaResult {
  items: SpecialLagnaItem[];
  wealthLagnas: SpecialLagnaItem[];
  powerLagnas: SpecialLagnaItem[];
  arudhaItems: SpecialLagnaItem[];
  sunriseItems: SpecialLagnaItem[];
  induLagna: InduLagnaAnalysis;
  sreeLagna: SpecialLagnaItem;
  pakaLagna: SpecialLagnaItem;
  horaLagna: SpecialLagnaItem;
  ghatiLagna: SpecialLagnaItem;
  bhavaLagna: SpecialLagnaItem;
  rajayogas: SpecialLagnaRajayoga[];
  alUlSynastry: AlUlSynastry;
  activeDashaActivation?: ActiveDashaActivation;
  narrative: SpecialLagnaNarrative;
  sunriseLocal: string;
  sunAtSunrise: number;
  minutesSinceSunrise: number;
  strongestPublicSignal: SpecialLagnaItem;
  summary: string;
  aiContext: string;
}

export const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const RASHI_ICONS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

export const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun",  5: "Mercury", 6: "Venus",  7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

// Ray values (Kalas) per Brihat Jataka (Varahamihira) & Jataka Parijata
export const PLANET_RAYS: Record<string, number> = {
  Sun: 30,
  Moon: 16,
  Mars: 6,
  Mercury: 8,
  Jupiter: 10,
  Venus: 12,
  Saturn: 1,
};

export const INDU_LAGNA_RAYS = PLANET_RAYS;

export const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
};

export const NATURAL_BENEFICS = ["Jupiter", "Venus", "Mercury", "Moon"];
export const NATURAL_MALEFICS = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"];

const META: Record<SpecialLagnaKey, Omit<SpecialLagnaItem, "sign" | "signNum" | "house" | "longitude" | "degreeText" | "lord" | "lordHouse" | "sourceHouse" | "sourceSign" | "occupants" | "aspectingPlanets">> = {
  AL: {
    key: "AL",
    name: "Arudha Lagna",
    shortName: "A1",
    category: "arudha",
    meaning: "Public image, visible personality, and how the world perceives the native.",
    interpretation: "Arudha Lagna shows the projected worldly self. It reflects your reputation, social status, branding, and the tangible mirror of your personality in society.",
    actionPlan: ["Align public image with core strengths.", "Protect reputation by avoiding impulsive public statements.", "Leverage AL sign qualities in branding and leadership."],
  },
  A1: {
    key: "A1",
    name: "Arudha Lagna",
    shortName: "A1",
    category: "arudha",
    meaning: "Public image, visible personality, and how the world perceives the native.",
    interpretation: "Arudha Lagna shows the projected worldly self. It reflects your reputation, social status, branding, and the tangible mirror of your personality in society.",
    actionPlan: ["Align public image with core strengths.", "Protect reputation by avoiding impulsive public statements.", "Leverage AL sign qualities in branding and leadership."],
  },
  A2: {
    key: "A2",
    name: "Dhana Pada",
    shortName: "A2",
    category: "arudha",
    meaning: "Perceived wealth, accumulated assets, vocal reputation, and family heritage.",
    interpretation: "A2 shows how your financial prosperity and family lineage appear externally. Vital for personal net-worth branding, liquid asset credibility, and speech impact.",
    actionPlan: ["Build tangible financial credibility.", "Maintain refined and truthful speech.", "Preserve and showcase family heritage responsibly."],
  },
  A3: {
    key: "A3",
    name: "Vikrama Pada (Bhratri Pada)",
    shortName: "A3",
    category: "arudha",
    meaning: "Initiative, visible courage, hands-on craft, digital media, and siblings.",
    interpretation: "A3 represents the worldly perception of your valor, enterprise, and technical execution. Indicates how colleagues and competitors view your fighting spirit.",
    actionPlan: ["Showcase practical initiatives and published work.", "Collaborate transparently with siblings and teammates.", "Channel courage into structured marketing outreach."],
  },
  A4: {
    key: "A4",
    name: "Matru / Sukha Pada",
    shortName: "A4",
    category: "arudha",
    meaning: "Landed property, luxury vehicles, domestic comforts, and mother's stature.",
    interpretation: "A4 reflects external perception of your fixed assets, domestic luxury, vehicles, and real-estate standing. Shows emotional security manifested physically.",
    actionPlan: ["Invest in quality landed properties and comfortable vehicles.", "Maintain domestic peace as a visible sanctuary.", "Honor maternal guidance."],
  },
  A5: {
    key: "A5",
    name: "Mantra / Putra Pada",
    shortName: "A5",
    category: "arudha",
    meaning: "Intellectual genius, creative output, disciples, and progeny fame.",
    interpretation: "A5 shows how your advisory wisdom, strategic intelligence, children, and creative masterpieces are acknowledged by the world.",
    actionPlan: ["Publish thought-leadership and creative works.", "Mentor disciples and students.", "Celebrate and guide progeny achievements."],
  },
  A6: {
    key: "A6",
    name: "Shatru / Rog Pada",
    shortName: "A6",
    category: "arudha",
    meaning: "Visible adversaries, debts, litigation, and competitive service arena.",
    interpretation: "A6 reflects the external perception of your challenges, legal battles, health discipline, and capacity to overcome opposition.",
    actionPlan: ["Maintain clean paperwork to avoid public litigation.", "Manage debt obligations proactively.", "Adopt a disciplined daily fitness regimen."],
  },
  A7: {
    key: "A7",
    name: "Dara Pada",
    shortName: "A7",
    category: "arudha",
    meaning: "Business alliances, trade partnerships, and public relationship perception.",
    interpretation: "A7 shows how commercial contracts, client networks, and marriage partnerships appear to external onlookers.",
    actionPlan: ["Structure bilateral agreements with crystal clarity.", "Choose public allies aligned with your long-term ethics.", "Maintain graceful public partnership conduct."],
  },
  A8: {
    key: "A8",
    name: "Mrityu / Randhra Pada",
    shortName: "A8",
    category: "arudha",
    meaning: "Sudden transformations, crisis management, occult depth, and longevity image.",
    interpretation: "A8 reveals how unexpected twists, inheritance matters, deep research, and resilience during crisis are perceived.",
    actionPlan: ["Develop crisis-turnaround frameworks.", "Maintain transparency in inheritance/unearned assets.", "Master stress-management practices."],
  },
  A9: {
    key: "A9",
    name: "Pitru / Bhagya Pada",
    shortName: "A9",
    category: "arudha",
    meaning: "Fortune, higher dharma, ethical reputation, and father's societal honor.",
    interpretation: "A9 reflects your visible alignment with moral truth, higher education, spiritual philanthropy, and divine luck in the public eye.",
    actionPlan: ["Uphold high ethical standards in public life.", "Participate in charitable and dharmic institutions.", "Revere mentors and fatherly figures."],
  },
  A10: {
    key: "A10",
    name: "Rajya / Karma Pada",
    shortName: "A10",
    category: "arudha",
    meaning: "Career prestige, executive authority, government standing, and professional legacy.",
    interpretation: "A10 represents professional visibility and the perception of your career power. A strong A10 guarantees prominent executive stature and public authority.",
    actionPlan: ["Position yourself for executive leadership.", "Build public proof of professional excellence.", "Cultivate constructive institutional relationships."],
  },
  A11: {
    key: "A11",
    name: "Labha Pada",
    shortName: "A11",
    category: "arudha",
    meaning: "Manifested cash flow, large social communities, high-volume gains, and fulfilled goals.",
    interpretation: "A11 shows the external manifestation of revenue, wealth scaling, institutional network gains, and elder sibling influence.",
    actionPlan: ["Build and scale professional communities.", "Diversify revenue channels.", "Maintain reciprocal goodwill within your network."],
  },
  A12: {
    key: "A12",
    name: "Upapada Lagna",
    shortName: "UL",
    category: "arudha",
    meaning: "Marriage durability, spouse reality, emotional sacrifice, and in-law lineage.",
    interpretation: "Upapada (A12) is the arudha of the 12th house (giving/sacrifice). It shows the true spiritual durability of marriage, the spouse's core nature, and marital karma.",
    actionPlan: ["Observe fasting on the weekday of the UL lord to dissolve marriage delays.", "Practice mutual patience and emotional sacrifice.", "Honor spouse's family heritage."],
  },
  UL: {
    key: "UL",
    name: "Upapada Lagna",
    shortName: "UL",
    category: "arudha",
    meaning: "Marriage durability, spouse reality, emotional sacrifice, and in-law lineage.",
    interpretation: "Upapada (A12) is the arudha of the 12th house (giving/sacrifice). It shows the true spiritual durability of marriage, the spouse's core nature, and marital karma.",
    actionPlan: ["Observe fasting on the weekday of the UL lord to dissolve marriage delays.", "Practice mutual patience and emotional sacrifice.", "Honor spouse's family heritage."],
  },
  IL: {
    key: "IL",
    name: "Indu Lagna",
    shortName: "IL",
    category: "wealth",
    meaning: "The Secret Moon-Wealth Lagna of Sage Varahamihira (Kuber Wealth Indicator).",
    interpretation: "Indu Lagna reveals the cosmic bank account and wealth-holding capacity. In Brihat Jataka, Sage Varahamihira declares that even a person born destitute becomes equal to Kubera (God of Wealth) if an exalted or benefic planet occupies Indu Lagna.",
    actionPlan: ["Activate Indu Lagna lord through specific mantra and charity.", "Track Jupiter and Saturn transits over Indu Lagna for wealth booms.", "Maintain ethical financial discipline."],
  },
  HL: {
    key: "HL",
    name: "Hora Lagna",
    shortName: "HL",
    category: "wealth",
    meaning: "Liquid cash flow, wealth instinct, earnings velocity, and material assets.",
    interpretation: "Calculated from the Sun at sunrise (moving 1 sign per hour). Hora Lagna governs monetary pulse, earning drive, and the ease with which wealth flows into your hands.",
    actionPlan: ["Leverage HL sign qualities in financial negotiation.", "Align investments with periods activating HL.", "Keep liquid treasury organized."],
  },
  GL: {
    key: "GL",
    name: "Ghati Lagna",
    shortName: "GL",
    category: "power",
    meaning: "Power, political authority, executive command, public charisma, and fame.",
    interpretation: "Calculated from sunrise (moving 1 sign every 24 minutes). Ghati Lagna is the apex indicator of leadership rank, government patronage, and commanding social influence.",
    actionPlan: ["Step up to executive roles when GL is activated.", "Cultivate strategic public diplomacy.", "Avoid misuse of power when GL is aspected by malefics."],
  },
  BL: {
    key: "BL",
    name: "Bhava Lagna",
    shortName: "BL",
    category: "power",
    meaning: "Embodied life force, practical execution, physical vitality, and daily temperament.",
    interpretation: "Moving from sunrise (1 sign per 48 minutes). Bhava Lagna reflects how chart energy is practically embodied into physical routines and day-to-day actions.",
    actionPlan: ["Align daily routine with BL sign's elemental nature.", "Sustain physical vitality through clean nutrition.", "Guard health during high-intensity periods."],
  },
  SL: {
    key: "SL",
    name: "Sree Lagna",
    shortName: "SL",
    category: "wealth",
    meaning: "Mahalakshmi's subtle grace, divine gifts, aesthetic abundance, and effortless fortune.",
    interpretation: "Calculated by adding the Moon's nakshatra progress to natal Lagna. Sree Lagna shows the divine channel through which luck, refined prosperity, and blessings arrive without friction.",
    actionPlan: ["Recite Sri Suktam or perform Friday Lakshmi stuti.", "Practice generous philanthropy.", "Cultivate an orderly, beautiful domestic atmosphere."],
  },
  PL: {
    key: "PL",
    name: "Paka Lagna",
    shortName: "PL",
    category: "power",
    meaning: "The Seat of Intelligence — where the Lagna Lord actively deploys conscious will.",
    interpretation: "Paka Lagna is the sign occupied by your Lagna Lord. While Lagna is the seed, Paka Lagna is the fruit — showing where your mental focus, stamina, and life initiatives bear fruit.",
    actionPlan: ["Concentrate career focus on Paka Lagna house affairs.", "Direct willpower consciously rather than drifting.", "Respect the sign lord of Paka Lagna."],
  },
};

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function signFromLon(lon: number): number {
  return Math.floor(mod(lon, 360) / 30);
}

function houseFromSign(lagnaNum: number, signNum: number): number {
  return mod(signNum - lagnaNum, 12) + 1;
}

function degreeText(lon: number): string {
  const normalized = mod(lon, 360);
  const degree = normalized % 30;
  const deg = Math.floor(degree);
  const min = Math.floor((degree - deg) * 60);
  return `${deg}° ${String(min).padStart(2, "0")}'`;
}

function decimalToTime(hours: number): string {
  const h = Math.floor(mod(hours, 24));
  const m = Math.round((mod(hours, 24) - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m === 60 ? 0 : m).padStart(2, "0")}`;
}

export function calcSunriseLocal(date: string, lat: number, lon: number, tz: number): number {
  const jd = getJD(date, "12:00", 0);
  const d2r = Math.PI / 180;
  const n = jd - 2451545.0;
  const l = mod(280.46 + 0.9856474 * n, 360);
  const g = mod(357.528 + 0.9856003 * n, 360);
  const lam = mod(l + 1.915 * Math.sin(g * d2r) + 0.02 * Math.sin(2 * g * d2r), 360);
  const eps = 23.439 - 0.0000004 * n;
  const sinDec = Math.sin(eps * d2r) * Math.sin(lam * d2r);
  const dec = Math.asin(sinDec) / d2r;
  const cosH =
    (Math.sin(-0.8333 * d2r) - Math.sin(lat * d2r) * Math.sin(dec * d2r)) /
    (Math.cos(lat * d2r) * Math.cos(dec * d2r));
  if (Math.abs(cosH) > 1) return 6;
  const h = Math.acos(cosH) / d2r;
  const ra = Math.atan2(Math.cos(eps * d2r) * Math.sin(lam * d2r), Math.cos(lam * d2r)) / d2r;
  const gmst = mod(6.697375 + 0.0657098242 * n, 24);
  const transit = mod(ra / 15 - lon / 15 - gmst, 24);
  return mod(transit - h / 15 + tz, 24);
}

function getPlanetsInSign(chart: ChartData, signNum: number): string[] {
  const norm = mod(signNum, 12);
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  return planets.filter((p) => {
    const d = chart.planets[p];
    if (!d) return false;
    return Math.floor(mod(d.lon, 360) / 30) === norm;
  });
}

function getAspectingPlanets(chart: ChartData, targetSignNum: number): string[] {
  const norm = mod(targetSignNum, 12);
  const aspecting: string[] = [];
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const p of planets) {
    const d = chart.planets[p];
    if (!d) continue;
    const pSign = Math.floor(mod(d.lon, 360) / 30);
    if (pSign === norm) continue; // Occupant, not aspecting

    const diff = mod(norm - pSign, 12); // Count forward from planet to target

    // All planets aspect 7th house (diff == 6)
    if (diff === 6) {
      aspecting.push(p);
      continue;
    }

    // Special aspects:
    // Mars: 4th (diff 3) and 8th (diff 7)
    if (p === "Mars" && (diff === 3 || diff === 7)) {
      aspecting.push(p);
      continue;
    }

    // Jupiter: 5th (diff 4) and 9th (diff 8)
    if (p === "Jupiter" && (diff === 4 || diff === 8)) {
      aspecting.push(p);
      continue;
    }

    // Saturn: 3rd (diff 2) and 10th (diff 9)
    if (p === "Saturn" && (diff === 2 || diff === 9)) {
      aspecting.push(p);
      continue;
    }

    // Rahu / Ketu: 5th (diff 4) and 9th (diff 8)
    if ((p === "Rahu" || p === "Ketu") && (diff === 4 || diff === 8)) {
      aspecting.push(p);
      continue;
    }
  }

  return aspecting;
}

function makeItem(
  key: SpecialLagnaKey,
  lon: number,
  chart: ChartData,
  extra?: Partial<SpecialLagnaItem>
): SpecialLagnaItem {
  const signNum = signFromLon(lon);
  const meta = META[key] ?? META.AL;
  const occupants = getPlanetsInSign(chart, signNum);
  const aspectingPlanets = getAspectingPlanets(chart, signNum);

  return {
    ...meta,
    key,
    sign: RASHIS[signNum],
    signNum,
    house: houseFromSign(chart.lagnaNum, signNum),
    longitude: Number(mod(lon, 360).toFixed(4)),
    degreeText: degreeText(lon),
    lord: SIGN_LORDS[signNum],
    occupants,
    aspectingPlanets,
    ...extra,
  };
}

// ── Classical Arudha Pada Calculation (12 Houses) ─────────────────────────────
export function calculateArudhaPada(sourceHouse: number, chart: ChartData): SpecialLagnaItem {
  const houseSign = mod(chart.lagnaNum + sourceHouse - 1, 12);
  const lord = SIGN_LORDS[houseSign];
  const lordPlanet = chart.planets[lord] as PlanetData | undefined;
  const lordSign = lordPlanet ? Math.floor(mod(lordPlanet.lon, 360) / 30) : houseSign;
  const distance = mod(lordSign - houseSign, 12) + 1;
  let arudhaSign = mod(lordSign + distance - 1, 12);
  const relative = mod(arudhaSign - houseSign, 12);

  // Exception rules: if Arudha falls in the same sign (1st) or 7th sign, shift by 10 (or add 9)
  if (relative === 0 || relative === 6) {
    arudhaSign = mod(arudhaSign + 9, 12);
  }

  const keyMap: Record<number, SpecialLagnaKey> = {
    1: "AL", 2: "A2", 3: "A3", 4: "A4", 5: "A5", 6: "A6",
    7: "A7", 8: "A8", 9: "A9", 10: "A10", 11: "A11", 12: "UL",
  };

  const key = keyMap[sourceHouse] ?? "AL";

  return makeItem(key, arudhaSign * 30 + 15, chart, {
    lord,
    lordHouse: lordPlanet ? houseFromSign(chart.lagnaNum, Math.floor(mod(lordPlanet.lon, 360) / 30)) : undefined,
    sourceHouse,
    sourceSign: RASHIS[houseSign],
  });
}

// ── Sree Lagna Calculation ───────────────────────────────────────────────────
export function calculateSreeLagnaLon(chart: ChartData): number {
  const moonLon = chart.planets.Moon?.lon ?? 0;
  const nakSpan = 360 / 27; // 13.333333°
  const nakStart = Math.floor(mod(moonLon, 360) / nakSpan) * nakSpan;
  const fraction = (mod(moonLon, 360) - nakStart) / nakSpan;
  return mod(chart.lagnaLon + fraction * 360, 360);
}

// ── Indu Lagna (The Moon Wealth Secret of Sage Varahamihira) ───────────────────
export function calculateInduLagna(chart: ChartData): InduLagnaAnalysis {
  // 1. 9th House from Lagna
  const lagna9thSignNum = mod(chart.lagnaNum + 8, 12);
  const lagna9thLord = SIGN_LORDS[lagna9thSignNum];
  const lagna9thRays = PLANET_RAYS[lagna9thLord] ?? 1;

  // 2. 9th House from Moon
  const moonLon = chart.planets.Moon?.lon ?? 0;
  const moonSignNum = Math.floor(mod(moonLon, 360) / 30);
  const moon9thSignNum = mod(moonSignNum + 8, 12);
  const moon9thLord = SIGN_LORDS[moon9thSignNum];
  const moon9thRays = PLANET_RAYS[moon9thLord] ?? 1;

  // 3. Sum of Rays & Modulo 12
  const totalRays = lagna9thRays + moon9thRays;
  let remainder = totalRays % 12;
  if (remainder === 0) remainder = 12;

  // 4. Count from Moon sign
  const induSignNum = mod(moonSignNum + remainder - 1, 12);
  const induSign = RASHIS[induSignNum];
  const induHouse = houseFromSign(chart.lagnaNum, induSignNum);
  const induLord = SIGN_LORDS[induSignNum];
  const degreeTxt = degreeText(moonLon);

  // 5. Occupants & Aspects
  const occupants = getPlanetsInSign(chart, induSignNum);
  const aspectingPlanets = getAspectingPlanets(chart, induSignNum);

  // 6. Kuber Yoga Scoring
  let score = 50;
  let hasExalted = false;
  let beneficCount = 0;
  let maleficCount = 0;

  for (const p of occupants) {
    if (EXALTATION_SIGNS[p] === induSignNum) {
      hasExalted = true;
      score += 40;
    } else if (NATURAL_BENEFICS.includes(p)) {
      beneficCount++;
      score += 20;
    } else if (NATURAL_MALEFICS.includes(p)) {
      maleficCount++;
      score -= 5;
    }
  }

  for (const p of aspectingPlanets) {
    if (NATURAL_BENEFICS.includes(p)) {
      beneficCount++;
      score += 12;
    } else if (NATURAL_MALEFICS.includes(p)) {
      maleficCount++;
      score -= 5;
    }
  }

  // Check Lord strength
  const induLordPlanet = chart.planets[induLord];
  if (induLordPlanet) {
    const lordSign = Math.floor(mod(induLordPlanet.lon, 360) / 30);
    if (EXALTATION_SIGNS[induLord] === lordSign) score += 15;
    if (lordSign === induSignNum) score += 10;
  }

  score = Math.max(30, Math.min(99, score));

  let kuberYogaTier: InduLagnaAnalysis["kuberYogaTier"];
  let verdict: string;

  if (hasExalted || (beneficCount >= 2 && maleficCount === 0)) {
    kuberYogaTier = "Kuber Sovereign (Multi-Millionaire)";
    verdict = `Supreme Kuber Yoga: Indu Lagna in ${induSign} (House ${induHouse}) is blessed by exalted or multiple natural benefics (${occupants.concat(aspectingPlanets).join(", ")}). The classical texts declare: 'Even a person born in a humble household rises to possess limitless treasury and multi-generational assets.'`;
  } else if (beneficCount > 0 || score >= 75) {
    kuberYogaTier = "High Affluence & Prosperity";
    verdict = `High Financial Inflow: Indu Lagna receives strong benefic reinforcement from ${beneficCount > 0 ? "benefics" : "strong disposition"}. Wealth flows steadily through career execution, smart investments, and asset compounding.`;
  } else if (maleficCount > 0 && beneficCount === 0) {
    kuberYogaTier = "Self-Made Steady Wealth";
    verdict = `Self-Made Financial Accumulation: Indu Lagna has malefic influence (${occupants.concat(aspectingPlanets).join(", ")}). Wealth is self-earned through relentless hard work and endurance rather than unearned luck. Financial caution during speculative periods is recommended.`;
  } else {
    kuberYogaTier = "Fluctuating / Expenditure Heavy";
    verdict = `Fluctuating Treasury: Indu Lagna requires conscious remedial discipline. While money is earned, leakages through unexpected expenditures occur. Strengthening ${induLord} will seal the wealth leaks.`;
  }

  const classicalReference = `Brihat Jataka & Jataka Parijata: Lagna 9th Lord (${lagna9thLord}) has ${lagna9thRays} rays; Moon 9th Lord (${moon9thLord}) has ${moon9thRays} rays. Total ${totalRays} rays % 12 yields remainder ${remainder}. Counting ${remainder} signs from Moon (${RASHIS[moonSignNum]}) arrives at ${induSign}.`;

  const upay = [
    `Indu Lagna Lord Remediation: Perform seva and chant the mantra of ${induLord} to stabilize and amplify the wealth stream.`,
    "Shri Suktam & Kanakadhara Stotram: Reciting Shri Suktam on Fridays directly energizes the cosmic treasury.",
    "Clean Financial Bookkeeping: Never leave financial accounts or bills disorderly; Mercury and Lakshmi thrive on mathematical clarity.",
  ];

  return {
    sign: induSign,
    signNum: induSignNum,
    house: induHouse,
    lord: induLord,
    degreeText: degreeTxt,
    lagna9thLord,
    lagna9thRays,
    moon9thLord,
    moon9thRays,
    totalRays,
    remainder,
    occupants,
    aspectingPlanets,
    kuberYogaTier,
    kuberYogaScore: score,
    verdict,
    classicalReference,
    upay,
  };
}

// ── AL-UL Synastry (Public Persona vs Marriage Reality) ───────────────────────
export function evaluateAlUlSynastry(al: SpecialLagnaItem, ul: SpecialLagnaItem): AlUlSynastry {
  const distance = mod(ul.signNum - al.signNum, 12) + 1;
  let relationship = "";
  let score = 5;
  let verdict = "";
  let transcriptAdvice = "";
  let remedy = "";

  if (distance === 1) {
    relationship = "1/1 Conjunction (Identity Merged)";
    score = 8.5;
    verdict = "Public persona and marital partner are deeply intertwined. Your spouse directly shapes your public image.";
    transcriptAdvice = "Maintain mutual respect as your marital conduct directly impacts your societal standing.";
    remedy = "Perform joint charitable donations on Thursdays.";
  } else if (distance === 7) {
    relationship = "1/7 Samasaptaka (Direct Harmony)";
    score = 9.0;
    verdict = "Classic complementary partnership. What the world sees outside matches the respectful commitment inside.";
    transcriptAdvice = "Marriage provides balance and grounding to the native's external ambition.";
    remedy = "Honor each other's career space and cultivate joint partnerships.";
  } else if (distance === 5 || distance === 9) {
    relationship = "5/9 Trikona (Spiritual Affinity)";
    score = 9.5;
    verdict = "Divine philosophical harmony. The marriage is fortified by mutual dharma, trust, and shared values.";
    transcriptAdvice = "Spouse acts as a natural advisor, bringing prosperity and ethical luck.";
    remedy = "Visit sacred pilgrim sites together.";
  } else if (distance === 3 || distance === 11) {
    relationship = "3/11 Upachaya (Growth & Effort)";
    score = 8.0;
    verdict = "Collaborative friendship. Both partners work together toward material prosperity and network expansion.";
    transcriptAdvice = "Financial gains compound when both partners support each other's ventures.";
    remedy = "Engage in shared hobby or creative projects.";
  } else if (distance === 6 || distance === 8) {
    relationship = "6/8 Shadashtaka (Internal Friction / Dual Perception)";
    score = 4.0;
    verdict = "Shadashtaka Friction: The public perceives a glamorous couple, but behind closed doors, differences in ideology or emotional expectations cause friction.";
    transcriptAdvice = "Jaimini Secret: When AL and UL are in 6/8, public image is shielded from domestic turbulence. Never let external family politics interfere in your marital sanctuary.";
    const weekdayMap: Record<string, string> = {
      Sun: "Sunday",
      Moon: "Monday",
      Mars: "Tuesday",
      Mercury: "Wednesday",
      Jupiter: "Thursday",
      Venus: "Friday",
      Saturn: "Saturday",
    };
    const ulDay = weekdayMap[ul.lord] ?? "Friday";
    remedy = `Fasting on ${ulDay} (weekday of Upapada Lord ${ul.lord}) or performing Friday Lakshmi Puja is the classical Parashara remedy to dissolve marital discord.`;
  } else {
    // 2/12
    relationship = "2/12 Dwirdwadasha (Resource Drainage)";
    score = 5.0;
    verdict = "Dwirdwadasha: High financial outlays on domestic responsibilities or physical distance between partners due to career travels.";
    transcriptAdvice = "Plan finances jointly and schedule deliberate quality time away from work.";
    remedy = "Donate yellow sweets or milk on Mondays to Shiva-Parvati temple.";
  }

  return {
    alSign: al.sign,
    alSignNum: al.signNum,
    ulSign: ul.sign,
    ulSignNum: ul.signNum,
    distance,
    relationship,
    score,
    verdict,
    transcriptAdvice,
    remedy,
  };
}

// ── Special Lagna Rajayoga Synthesizer ─────────────────────────────────────────
export function evaluateSpecialLagnaRajayogas(
  hl: SpecialLagnaItem,
  gl: SpecialLagnaItem,
  al: SpecialLagnaItem,
  a10: SpecialLagnaItem,
  sl: SpecialLagnaItem,
  il: InduLagnaAnalysis,
  chart: ChartData
): SpecialLagnaRajayoga[] {
  const yogas: SpecialLagnaRajayoga[] = [];

  // 1. Hora-Ghati Dhana-Raja Yoga (BPHS Ch. 5)
  const isHlGlConjunct = hl.signNum === gl.signNum;
  const isHlGlMutualAspect = mod(gl.signNum - hl.signNum, 12) === 6;
  const isLagnaAspectingBoth = mod(hl.signNum - chart.lagnaNum, 12) === 6 && mod(gl.signNum - chart.lagnaNum, 12) === 6;
  const isHlGlFormed = isHlGlConjunct || isHlGlMutualAspect || isLagnaAspectingBoth;

  yogas.push({
    name: "Hora-Ghati Dhana-Raja Yoga",
    sanskritName: "होरा-घटी धन-राजयोग",
    type: "Dhana-Raja Yoga",
    strength: isHlGlConjunct ? "Supreme" : "Strong",
    description: isHlGlFormed
      ? `As proclaimed by Maharishi Parashara in BPHS: Hora Lagna (${hl.sign}) and Ghati Lagna (${gl.sign}) connect through ${
          isHlGlConjunct ? "conjunction" : "mutual aspect"
        }. The native commands both immense liquid treasury and supreme governmental/executive authority.`
      : `Hora Lagna (${hl.sign}) and Ghati Lagna (${gl.sign}) operate in independent signs. Wealth and executive power develop through separate focused life chapters.`,
    involvedLagnas: ["HL", "GL"],
    isFormed: isHlGlFormed,
  });

  // 2. Indu Lagna Kuber Yoga
  const isKuberFormed = il.kuberYogaTier.includes("Kuber") || il.kuberYogaTier.includes("High Affluence");
  yogas.push({
    name: "Indu-Chandra Kuber Yoga",
    sanskritName: "इंदु-चंद्र कुबेर योग",
    type: "Wealth Inflow",
    strength: il.kuberYogaTier.includes("Kuber") ? "Supreme" : "Strong",
    description: isKuberFormed
      ? `Indu Lagna in ${il.sign} activates the ancient Kuber Wealth formula (${il.kuberYogaScore}/100). Benefic rays guarantee exceptional prosperity and legacy asset creation.`
      : `Indu Lagna in ${il.sign} provides self-earned steady wealth. Financial discipline compounds gains over time.`,
    involvedLagnas: ["IL"],
    isFormed: isKuberFormed,
  });

  // 3. Arudha-Rajya Sangam (AL + A10)
  const isAlA10Conjunct = al.signNum === a10.signNum;
  const isAlA10Aspect = mod(a10.signNum - al.signNum, 12) === 6;
  const isAlA10Formed = isAlA10Conjunct || isAlA10Aspect;
  yogas.push({
    name: "Arudha-Rajya Sangam (AL-A10)",
    sanskritName: "आरूढ़-राज्य संगम योग",
    type: "Fame & Authority",
    strength: isAlA10Conjunct ? "Supreme" : "Strong",
    description: isAlA10Formed
      ? `Arudha Lagna (${al.sign}) and Rajya Pada A10 (${a10.sign}) unite. Your societal image and professional authority merge seamlessly, granting commanding reputation.`
      : `Arudha Lagna and Rajya Pada operate across distinct signs, distinguishing your public persona from specific corporate positions.`,
    involvedLagnas: ["AL", "A10"],
    isFormed: isAlA10Formed,
  });

  // 4. Sree Lagna Mahalakshmi Yoga
  const isSlKendraTrikona = [1, 4, 5, 7, 9, 10].includes(sl.house);
  const isSlBeneficAssociated = (sl.occupants && sl.occupants.some((p) => NATURAL_BENEFICS.includes(p))) ||
    (sl.aspectingPlanets && sl.aspectingPlanets.some((p) => NATURAL_BENEFICS.includes(p)));
  const isSlYogaFormed = isSlKendraTrikona || Boolean(isSlBeneficAssociated);

  yogas.push({
    name: "Sree Lagna Mahalakshmi Yoga",
    sanskritName: "श्री लग्न महालक्ष्मी योग",
    type: "Wealth Inflow",
    strength: isSlKendraTrikona && isSlBeneficAssociated ? "Supreme" : "Strong",
    description: isSlYogaFormed
      ? `Sree Lagna sits auspiciously in House ${sl.house} (${sl.sign}). Divine grace of Mahalakshmi unlocks subtle fortune, aesthetic gifts, and unexpected material support.`
      : `Sree Lagna in House ${sl.house} brings fortune through conscious cultivation of beauty, cleanliness, and Sri Suktam stutis.`,
    involvedLagnas: ["SL"],
    isFormed: isSlYogaFormed,
  });

  return yogas;
}

// ── Active Dasha Activation ───────────────────────────────────────────────────
export function evaluateDashaActivation(
  chart: ChartData,
  specialItems: SpecialLagnaItem[]
): ActiveDashaActivation | undefined {
  const activeMD = chart.dashas?.find((d) => d.active) ?? chart.dashas?.[0];
  const activeAD = chart.antardasha?.find((a) => a.active);

  if (!activeMD) return undefined;

  const mdLord = activeMD.planet;
  const adLord = activeAD?.planet;
  const activated: ActiveDashaActivation["activatedLagnas"] = [];

  for (const item of specialItems) {
    if (item.lord === mdLord) {
      activated.push({
        lagnaKey: item.key,
        lagnaName: item.name,
        connection: "Rules",
        lifeImpact: `${item.name} (${item.sign}) is ruled by your active Mahadasha lord ${mdLord}. This period directly unfolds ${item.meaning.toLowerCase()}`,
      });
    } else if (item.occupants?.includes(mdLord)) {
      activated.push({
        lagnaKey: item.key,
        lagnaName: item.name,
        connection: "Occupies",
        lifeImpact: `Active Mahadasha lord ${mdLord} occupies ${item.name} (${item.sign}), triggering intense manifestation of ${item.meaning.toLowerCase()}`,
      });
    } else if (item.aspectingPlanets?.includes(mdLord)) {
      activated.push({
        lagnaKey: item.key,
        lagnaName: item.name,
        connection: "Aspects",
        lifeImpact: `Mahadasha lord ${mdLord} casts planetary drishti on ${item.name} (${item.sign}), stimulating this life department.`,
      });
    }
  }

  const overallForecast = activated.length > 0
    ? `Active ${mdLord} Mahadasha ${adLord ? `(${adLord} Antardasha)` : ""} directly activates ${activated.map((a) => a.lagnaKey).join(", ")}. Primary worldly focus is currently anchored in these sensitive points.`
    : `Active ${mdLord} Mahadasha operates through background houses; Special Lagna activations will intensify during sub-periods of ${specialItems.slice(0, 3).map((i) => i.lord).join(", ")}.`;

  return {
    mahadashaLord: mdLord,
    antardashaLord: adLord,
    activatedLagnas: activated,
    overallForecast,
  };
}

// ── Human Storytelling Narrative Generator ───────────────────────────────────
export function generateSpecialLagnaNarrative(
  chart: ChartData,
  al: SpecialLagnaItem,
  ul: SpecialLagnaItem,
  il: InduLagnaAnalysis,
  hl: SpecialLagnaItem,
  gl: SpecialLagnaItem,
  pl: SpecialLagnaItem,
  synastry: AlUlSynastry,
  rajayogas: SpecialLagnaRajayoga[]
): SpecialLagnaNarrative {
  const lagnaRashi = RASHIS[chart.lagnaNum] ?? chart.lagnaRashi ?? "Aries";
  const lagnaLord = SIGN_LORDS[chart.lagnaNum] ?? "Mars";

  const storyIntro = `जब आप इस दुनिया में आए, तो ईश्वर ने आपको ${lagnaRashi} लग्न का शरीर दिया — यह आपका मूल भौतिक अस्तित्व और स्वभाव है। लेकिन समाज आपको सीधे आपके भीतरी कक्ष में आकर नहीं देखता; समाज आपको आपकी सामाजिक प्रतिष्ठा और आभा (आरूढ़) के चश्मे से देखता है। वहीं ब्रह्मांडीय ऊर्जा आपको आपके गुप्त धन (इंदु लग्न) और अंतरात्मा के संकल्प (पाक लग्न) से परखती है।`;

  const publicImageStory = `आपका आरूढ़ लग्न (AL) ${al.sign} राशि में भाव ${al.house} पर स्थापित है, जिसके स्वामी ${al.lord} हैं। यह आपकी वह सामाजिक छवि है जो दुनिया के मानसपटल पर अंकित होती है। समाज में लोग आपको भाव ${al.house} के मुख्य गुणों — ${al.meaning} — के अनुरूप एक प्रभावशाली व्यक्तित्व के रूप में देखते हैं। ${al.occupants && al.occupants.length > 0 ? `आरूढ़ पर ${al.occupants.join(", ")} की उपस्थिति आपकी इस सामाजिक प्रतिष्ठा को विशिष्ट चमक प्रदान करती है।` : `आरूढ़ का शांत रहना आपको अनावश्यक सामाजिक दिखावे से मुक्त रखकर वास्तविक कर्म करने की स्वतंत्रता देता है।`}`;

  const kuberWealthStory = `कुबेर का गुप्त तिजोरी-कक्ष (इंदु लग्न): आचार्य वराहमिहिर के सूत्रानुसार आपके लग्न 9वें स्वामी (${il.lagna9thLord}) की ${il.lagna9thRays} किरणें और चंद्र 9वें स्वामी (${il.moon9thLord}) की ${il.moon9thRays} किरणें मिलकर कुल ${il.totalRays} किरणें बनाती हैं। इस गणित से आपका इंदु लग्न ${il.sign} (भाव ${il.house}) में प्रस्फुटित हुआ है। कुबेर योग स्कोर ${il.kuberYogaScore}/100 के साथ आपकी स्थिति '${il.kuberYogaTier}' की है। ${il.occupants.length > 0 ? `यहाँ ${il.occupants.join(", ")} का सान्निध्य यह दर्शाता है कि धन के नए स्रोत ईश्वरीय कृपा से सहज खुलेंगे।` : `यहाँ आपके अपने पुरुषार्थ, धैर्य और सुनियोजित निवेश से स्थायी संपत्ति का निर्माण होगा।`} याद रखें, आपके लिए धन केवल आमदनी नहीं, एक पवित्र प्रवाह है जिसे ${il.lord} की नियमित आराधना से निरंतर सशक्त रखा जा सकता है।`;

  const horaGhatiYoga = rajayogas.find((y) => y.name.includes("Hora-Ghati"));
  const powerAndAuthorityStory = `दौलत की गति और सत्ता की धुरी: आपकी दैनिक नकद आमदनी और लिक्विड कैशफ्लो की घड़ी 'होरा लग्न (HL)' ${hl.sign} (भाव ${hl.house}) में है, जबकि समाज में नेतृत्व, प्रशासनिक सम्मान और पद-प्रतिष्ठा का 'घटी लग्न (GL)' ${gl.sign} (भाव ${gl.house}) में स्थित है। ${horaGhatiYoga?.isFormed ? `महर्षि पराशर के अनुसार आपकी कुंडली में सर्वोच्च 'होरा-घटी धन-राजयोग' सक्रिय है — इसका अर्थ है कि आपके हाथ में आर्थिक समृद्धि और सामाजिक अधिकार दोनों एक साथ चलेंगे!` : `आपकी कुंडली में धन उपार्जन (HL) और सामाजिक सत्ता (GL) दोनों स्वतंत्र रास्तों से परिपक्व होते हैं, जिससे जीवन के विभिन्न अध्यायों में दोनों का पृथक-पृथक फल प्राप्त होता है।`}`;

  const marriageAndSanctuaryStory = `बाहर की शान बनाम दाम्पत्य का आंतरिक सच: आपका आरूढ़ लग्न (${al.sign}) समाज में आपकी दृश्यमान प्रतिष्ठा है और उपपद लग्न (${ul.sign}, भाव ${ul.house}) आपके वैवाहिक जीवन की अंतरंग सच्चाई है। इन दोनों के बीच ${synastry.distance} भावों की दूरी (${synastry.relationship}) है। ${synastry.distance === 6 || synastry.distance === 8 ? `जैमिनी का गोपनीय परामर्श है कि जब AL और UL में 6/8 (षडाष्टक) का अंतर हो, तो समाज को सब कुछ आदर्श दिखता है, किंतु घर के भीतर वैचारिक भिन्नता या संवाद की कमी रह सकती है। इसका स्वर्णिम नियम यह है कि अपने दांपत्य की बातें कभी किसी तीसरे व्यक्ति से साझा न करें। उपपद स्वामी ${ul.lord} के वार का व्रत और लक्ष्मी साधना इस दूरी को आत्मीय प्रेम में बदल देती है।` : `दोनों के मध्य सौहार्दपूर्ण संबंध यह प्रमाणित करता है कि जैसा आदर और समर्पण समाज को बाहर दिखाई देता है, वैसी ही भावनात्मक शांति और सामंजस्य घर की चारदीवारी के भीतर भी विद्यमान है।`}`;

  const pakaLagnaStory = `पाक लग्न (Paka Lagna) — बुद्धि और संकल्प का वास्तविक ठिकाना: आपका लग्नेश ${lagnaLord} अपनी यात्रा करके ${pl.sign} (भाव ${pl.house}) में विराजमान है। शास्त्र कहते हैं कि 'शरीर कहीं भी विचरण करे, व्यक्ति का मन, प्राण और प्राथमिक चिंताएं 24 घंटे उसी भाव में वास करती हैं जहाँ लग्नेश बैठा हो।' अतः आपके जीवन के सबसे महत्वपूर्ण निर्णय और मानसिक ऊर्जा भाव ${pl.house} (${pl.meaning}) से ही संचालित होंगे।`;

  const mentorSynthesis = `संक्षेप में कहें तो आपका जन्म लग्न आपकी जड़ है, इंदु लग्न आपका भूमिगत खज़ाना, आरूढ़ आपका सामाजिक वृक्ष, और उपपद आपका व्यक्तिगत घोंसला। जब इन सबको एक साथ रखकर देखा जाता है, तो जीवन की दिशा शीशे की तरह साफ़ हो जाती है।`;

  return {
    title: "मार्गदर्शक की ज़ुबानी — आपकी ज़िंदगी का आईना",
    storyIntro,
    publicImageStory,
    kuberWealthStory,
    powerAndAuthorityStory,
    marriageAndSanctuaryStory,
    pakaLagnaStory,
    mentorSynthesis,
  };
}

// ── Master Function ───────────────────────────────────────────────────────────
export function calculateSpecialLagnas(rawChart: ChartData): SpecialLagnaResult {
  const tob = rawChart.tob || (rawChart as any).meta?.tob || "12:00";
  const dob = rawChart.dob || (rawChart as any).meta?.dob || "1990-01-01";
  const lat = rawChart.lat ?? (rawChart as any).meta?.lat ?? 28.6139;
  const lon = rawChart.lon ?? (rawChart as any).meta?.lon ?? 77.2090;
  const tz = rawChart.tz ?? (rawChart as any).meta?.tz ?? 5.5;
  const lagnaLon = rawChart.lagnaLon ?? ((rawChart as any).lagna?.longitude ?? 0);
  const lagnaNum = rawChart.lagnaNum !== undefined
    ? rawChart.lagnaNum
    : (rawChart as any).lagna?.signNum !== undefined
      ? (rawChart as any).lagna.signNum - 1
      : Math.floor(mod(lagnaLon, 360) / 30);

  const chart: ChartData = {
    ...rawChart,
    tob,
    dob,
    lat,
    lon,
    tz,
    lagnaLon,
    lagnaNum,
  };

  const birthLocalParts = tob.split(":").map(Number);
  const birthLocal = (birthLocalParts[0] || 0) + (birthLocalParts[1] || 0) / 60;
  const sunriseLocalRaw = calcSunriseLocal(dob, lat, lon, tz);
  const minutesSinceSunrise = (birthLocal - sunriseLocalRaw + (birthLocal < sunriseLocalRaw ? 24 : 0)) * 60;
  const sunriseLocal = decimalToTime(sunriseLocalRaw);
  const sunAtSunrise = computePlanets(getJD(dob, sunriseLocal, tz)).Sun;

  // 1. Full 12 Arudha Padas
  const arudhaItems: SpecialLagnaItem[] = Array.from({ length: 12 }, (_, i) => {
    return calculateArudhaPada(i + 1, chart);
  });

  const al = arudhaItems[0];
  const ul = arudhaItems[11];
  const a10 = arudhaItems[9];

  // 2. Sunrise-based Lagnas
  const hl = makeItem("HL", sunAtSunrise + minutesSinceSunrise * 0.5, chart);
  const gl = makeItem("GL", sunAtSunrise + minutesSinceSunrise * 1.25, chart);
  const bl = makeItem("BL", sunAtSunrise + minutesSinceSunrise * 0.625, chart);

  const sunriseItems = [hl, gl, bl];

  // 3. Sree Lagna
  const sl = makeItem("SL", calculateSreeLagnaLon(chart), chart);

  // 4. Indu Lagna
  const induLagna = calculateInduLagna(chart);
  const ilItem = makeItem("IL", induLagna.signNum * 30 + 15, chart, {
    lord: induLagna.lord,
    occupants: induLagna.occupants,
    aspectingPlanets: induLagna.aspectingPlanets,
  });

  // 5. Paka Lagna (Seat of Lagna Lord)
  const lagnaLord = SIGN_LORDS[chart.lagnaNum];
  const lagnaLordData = chart.planets[lagnaLord];
  const pakaLon = lagnaLordData?.lon ?? chart.lagnaLon;
  const pakaLagna = makeItem("PL", pakaLon, chart, {
    lord: SIGN_LORDS[signFromLon(pakaLon)],
  });

  // Groupings
  const wealthLagnas = [ilItem, hl, sl];
  const powerLagnas = [gl, bl, pakaLagna];

  const items: SpecialLagnaItem[] = [
    ilItem,
    hl,
    gl,
    sl,
    pakaLagna,
    bl,
    ...arudhaItems,
  ];

  // 6. Rajayoga Synthesizer
  const rajayogas = evaluateSpecialLagnaRajayogas(hl, gl, al, a10, sl, induLagna, chart);

  // 7. AL-UL Synastry
  const alUlSynastry = evaluateAlUlSynastry(al, ul);

  // 8. Active Dasha Activation
  const activeDashaActivation = evaluateDashaActivation(chart, items);

  const strongestPublicSignal = a10;
  const summary = `Special Lagnas reveal: Indu Lagna in ${induLagna.sign} (${induLagna.kuberYogaTier}), Hora Lagna (Wealth) in ${hl.sign}, Ghati Lagna (Power) in ${gl.sign}, Sree Lagna in ${sl.sign}, Arudha Lagna (Public Image) in ${al.sign}, and Upapada (Marriage) in ${ul.sign}.`;

  // 9. Human Storytelling Narrative
  const narrative = generateSpecialLagnaNarrative(chart, al, ul, induLagna, hl, gl, pakaLagna, alUlSynastry, rajayogas);

  const aiContext = `${summary} AL-UL relationship is ${alUlSynastry.relationship}. Active Dasha (${activeDashaActivation?.mahadashaLord || "N/A"}) activates: ${activeDashaActivation?.activatedLagnas.map((a) => a.lagnaKey).join(", ") || "background houses"}.`;

  return {
    items,
    wealthLagnas,
    powerLagnas,
    arudhaItems,
    sunriseItems,
    induLagna,
    sreeLagna: sl,
    pakaLagna,
    horaLagna: hl,
    ghatiLagna: gl,
    bhavaLagna: bl,
    rajayogas,
    alUlSynastry,
    activeDashaActivation,
    narrative,
    sunriseLocal,
    sunAtSunrise: Number(sunAtSunrise.toFixed(4)),
    minutesSinceSunrise: Number(minutesSinceSunrise.toFixed(1)),
    strongestPublicSignal,
    summary,
    aiContext,
  };
}
