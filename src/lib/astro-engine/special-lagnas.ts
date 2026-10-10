import { computePlanets, getJD, type ChartData, type PlanetData } from "./calculations";

export type SpecialLagnaKey =
  | "AL" | "UL" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8" | "A9" | "A10" | "A11" | "A12"
  | "HL" | "GL" | "BL" | "SL" | "IL" | "PL" | "VL" | "PP";

export type SpecialLagnaCategory = "wealth" | "power" | "arudha" | "sree" | "sunrise" | "lagna" | "social" | "vitality";

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
  secondFromUlSign: string;
  secondFromUlHouse: number;
  secondFromUlOccupants: string[];
  seventhFromUlSign: string;
  seventhFromUlHouse: number;
  seventhFromUlOccupants: string[];
  isUlIn12thFromAl: boolean;
  maritalWealthInsight: string;
  spouseNatureInsight: string;
}

export interface VarnadaLagnaAnalysis {
  sign: string;
  signNum: number;
  house: number;
  lord: string;
  degreeText: string;
  varna: "Kshatriya (Leadership & Governance)" | "Brahmin (Knowledge & Healing)" | "Vaishya (Commerce & Trade)" | "Shudra (Execution & Craftsmanship)";
  element: "Fire" | "Water" | "Air" | "Earth";
  careerInclination: string;
  sustainingHouse11thSign: string;
  sustainingHouse11thHouse: number;
  sustainingPlanets: string[];
  isSpiritualOrTeacherBlessing: boolean;
  actionGuidance: string[];
}

export interface PranapadaLagnaAnalysis {
  sign: string;
  signNum: number;
  house: number;
  lord: string;
  degreeText: string;
  vitalityStatus: "Robust Life Force" | "Moderate Stamina" | "Sensitive Vitality";
  pranaInterpretation: string;
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
  varnaAndCareerStory: string;
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
  varnadaLagna: VarnadaLagnaAnalysis;
  pranapadaLagna: PranapadaLagnaAnalysis;
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
  VL: {
    key: "VL",
    name: "Varnada Lagna",
    shortName: "VL",
    category: "social",
    meaning: "Jaimini social vocation, socio-economic archetype, and sustaining livelihood.",
    interpretation: "Varnada Lagna reveals your soul's karmic vocation and social duties in society. The 11th house from Varnada Lagna shows your sustained livelihood and financial longevity.",
    actionPlan: ["Align professional activities with your Varnada elemental archetype.", "Nurture 11th from VL planets to stabilize lifelong income.", "Balance duty (Dharma) with practical commerce."],
  },
  PP: {
    key: "PP",
    name: "Pranapada Lagna",
    shortName: "PP",
    category: "vitality",
    meaning: "Vital breath (Prana), cellular stamina, and respiratory life-force anchor.",
    interpretation: "Moving from sunrise, Pranapada Lagna reflects the rhythm of prana and respiratory vitality entering the physical body at the time of birth.",
    actionPlan: ["Incorporate daily pranayama and breathwork.", "Protect respiratory and cardiovascular health.", "Respect natural diurnal sleep-wake rhythms."],
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

// ── Varnada Lagna (Jaimini Social Vocation & Livelihood) ───────────────────────
export function calculateVarnadaLagna(chart: ChartData, hl: SpecialLagnaItem): VarnadaLagnaAnalysis {
  const lagnaSign = chart.lagnaNum + 1; // 1 to 12
  const hlSign = hl.signNum + 1; // 1 to 12

  // Step 1: Calculate A
  let A: number;
  if (lagnaSign % 2 === 1) {
    A = lagnaSign; // Odd: count from Aries
  } else {
    A = 12 - lagnaSign + 1; // Even: count from Pisces
  }

  // Step 2: Calculate B
  let B: number;
  if (hlSign % 2 === 1) {
    B = hlSign; // Odd: count from Aries
  } else {
    B = 12 - hlSign + 1; // Even: count from Pisces
  }

  // Step 3: Calculate C
  let C: number;
  if ((lagnaSign % 2) === (hlSign % 2)) {
    C = (A + B) % 12;
  } else {
    C = Math.abs(A - B) % 12;
  }
  if (C === 0) C = 12;

  // Step 4: Count from Aries or Pisces
  let vlSign1Based: number;
  if (lagnaSign % 2 === 1) {
    vlSign1Based = C; // From Aries
  } else {
    vlSign1Based = 12 - C + 1; // From Pisces
  }

  const vlSignNum = vlSign1Based - 1; // 0-indexed (0=Aries, 1=Taurus...)
  const vlSign = RASHIS[vlSignNum];
  const vlHouse = houseFromSign(chart.lagnaNum, vlSignNum);
  const vlLord = SIGN_LORDS[vlSignNum];

  // Varna & Element Classification
  let varna: "Kshatriya (Leadership & Governance)" | "Brahmin (Knowledge & Healing)" | "Vaishya (Commerce & Trade)" | "Shudra (Execution & Craftsmanship)";
  let element: "Fire" | "Water" | "Air" | "Earth";
  let careerInclination: string;

  if (vlSignNum === 0 || vlSignNum === 4 || vlSignNum === 8) {
    varna = "Kshatriya (Leadership & Governance)";
    element = "Fire";
    careerInclination = "Governance, administration, defense, law enforcement, executive leadership, and policy-making.";
  } else if (vlSignNum === 3 || vlSignNum === 7 || vlSignNum === 11) {
    varna = "Brahmin (Knowledge & Healing)";
    element = "Water";
    careerInclination = "Knowledge transfer, consulting, spiritual / occult guidance, teaching, research, medicine, and advisory councils.";
  } else if (vlSignNum === 2 || vlSignNum === 6 || vlSignNum === 10) {
    varna = "Vaishya (Commerce & Trade)";
    element = "Air";
    careerInclination = "Commerce, trade, financial markets, media, networking, entrepreneurship, and commercial partnerships.";
  } else {
    varna = "Shudra (Execution & Craftsmanship)";
    element = "Earth";
    careerInclination = "Practical execution, technology infrastructure, operations architecture, skilled craftsmanship, and operational service delivery.";
  }

  // 11th House from Varnada Lagna (sustaining livelihood)
  const sustainingSignNum = mod(vlSignNum + 10, 12);
  const sustainingHouse11thSign = RASHIS[sustainingSignNum];
  const sustainingHouse11thHouse = houseFromSign(chart.lagnaNum, sustainingSignNum);
  const sustainingPlanets = getPlanetsInSign(chart, sustainingSignNum);
  const sustainingAspecting = getAspectingPlanets(chart, sustainingSignNum);

  const hasJupiterOrVenus =
    sustainingPlanets.includes("Jupiter") ||
    sustainingPlanets.includes("Venus") ||
    sustainingAspecting.includes("Jupiter") ||
    sustainingAspecting.includes("Venus");

  const isSpiritualOrTeacherBlessing = Boolean(hasJupiterOrVenus);

  const actionGuidance = [
    `Honor your innate ${varna} vocation archetype: direct major career decisions toward ${careerInclination}`,
    isSpiritualOrTeacherBlessing
      ? "Maharishi Jaimini's Sacred Blessing: Jupiter/Venus directly energizes your 11th house from Varnada Lagna. You possess a natural divine gift as an astrologer, spiritual guide, counselor, or teacher."
      : `Your sustaining livelihood compounds through ${sustainingHouse11thSign} (House ${sustainingHouse11thHouse}). Align long-term financial streams with these house significations.`,
    `Remediation of ${vlLord} (Varnada Lagna Lord) stabilizes professional standing and protects against career stagnation.`,
  ];

  return {
    sign: vlSign,
    signNum: vlSignNum,
    house: vlHouse,
    lord: vlLord,
    degreeText: degreeText(vlSignNum * 30 + 15),
    varna,
    element,
    careerInclination,
    sustainingHouse11thSign,
    sustainingHouse11thHouse,
    sustainingPlanets,
    isSpiritualOrTeacherBlessing,
    actionGuidance,
  };
}

// ── Pranapada Lagna (Life Force & Cellular Stamina) ───────────────────────────
export function calculatePranapadaLagna(
  sunAtSunrise: number,
  minutesSinceSunrise: number,
  chart: ChartData
): PranapadaLagnaAnalysis {
  const ppLon = mod(sunAtSunrise + minutesSinceSunrise * 2.0, 360);
  const signNum = signFromLon(ppLon);
  const sign = RASHIS[signNum];
  const house = houseFromSign(chart.lagnaNum, signNum);
  const lord = SIGN_LORDS[signNum];
  const occupants = getPlanetsInSign(chart, signNum);

  const isKendraTrikona = [1, 4, 5, 7, 9, 10].includes(house);
  const hasBenefics = occupants.some((p) => NATURAL_BENEFICS.includes(p));
  const hasMalefics = occupants.some((p) => NATURAL_MALEFICS.includes(p));

  let vitalityStatus: "Robust Life Force" | "Moderate Stamina" | "Sensitive Vitality";
  let pranaInterpretation: string;

  if (isKendraTrikona && !hasMalefics) {
    vitalityStatus = "Robust Life Force";
    pranaInterpretation = `Pranapada Lagna sits auspiciously in ${sign} (House ${house}). Your cellular prana is resilient, conferring steady physical endurance and prompt recuperation from stress.`;
  } else if ([6, 8, 12].includes(house) || (hasMalefics && !hasBenefics)) {
    vitalityStatus = "Sensitive Vitality";
    pranaInterpretation = `Pranapada Lagna in ${sign} (House ${house}) reflects sensitive vitality. Respiratory rhythm and stamina fluctuate with fatigue; daily pranayama and regular sleep schedules act as vital shields.`;
  } else {
    vitalityStatus = "Moderate Stamina";
    pranaInterpretation = `Pranapada Lagna in ${sign} (House ${house}) offers adaptable life force. Consistent hydration, light exercise, and conscious breath control keep your stamina peak.`;
  }

  return {
    sign,
    signNum,
    house,
    lord,
    degreeText: degreeText(ppLon),
    vitalityStatus,
    pranaInterpretation,
  };
}

// ── AL-UL Synastry (Public Persona vs Marriage Reality) ───────────────────────
export function evaluateAlUlSynastry(al: SpecialLagnaItem, ul: SpecialLagnaItem, chart?: ChartData): AlUlSynastry {
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

  // Classical 2nd and 7th from Upapada Lagna
  const secondSignNum = mod(ul.signNum + 1, 12);
  const secondFromUlSign = RASHIS[secondSignNum];
  const secondFromUlHouse = chart ? houseFromSign(chart.lagnaNum, secondSignNum) : secondSignNum + 1;
  const secondFromUlOccupants = chart ? getPlanetsInSign(chart, secondSignNum) : [];

  const seventhSignNum = mod(ul.signNum + 6, 12);
  const seventhFromUlSign = RASHIS[seventhSignNum];
  const seventhFromUlHouse = chart ? houseFromSign(chart.lagnaNum, seventhSignNum) : seventhSignNum + 1;
  const seventhFromUlOccupants = chart ? getPlanetsInSign(chart, seventhSignNum) : [];

  // Jaimini Special Rule: Upapada in 12th from Arudha Lagna (distance 12 from AL)
  const isUlIn12thFromAl = mod(ul.signNum - al.signNum, 12) === 11;

  let maritalWealthInsight = `The 2nd from Upapada (${secondFromUlSign}) governs marital stability and wealth sustenance.`;
  if (secondFromUlOccupants.some((p) => NATURAL_BENEFICS.includes(p))) {
    maritalWealthInsight += ` Benefic presence (${secondFromUlOccupants.join(", ")}) preserves family wealth, harmony, and lasting marriage fidelity.`;
  } else if (secondFromUlOccupants.some((p) => NATURAL_MALEFICS.includes(p))) {
    maritalWealthInsight += ` Malefic presence (${secondFromUlOccupants.join(", ")}) calls for disciplined financial communication between partners.`;
  } else {
    maritalWealthInsight += ` Ruled by ${SIGN_LORDS[secondSignNum]}, marital assets compound steadily through planned mutual savings.`;
  }

  let spouseNatureInsight = `The 7th from Upapada (${seventhFromUlSign}) indicates the spouse's core temperament.`;
  if (seventhFromUlOccupants.length > 0) {
    spouseNatureInsight += ` Influenced by ${seventhFromUlOccupants.join(", ")}, reflecting a dynamic, expressive partner.`;
  } else {
    spouseNatureInsight += ` Ruled by ${SIGN_LORDS[seventhSignNum]}, pointing to an observant, supportive companion.`;
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
    secondFromUlSign,
    secondFromUlHouse,
    secondFromUlOccupants,
    seventhFromUlSign,
    seventhFromUlHouse,
    seventhFromUlOccupants,
    isUlIn12thFromAl,
    maritalWealthInsight,
    spouseNatureInsight,
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

  // 5. Jaimini Supreme Triple Raja Yoga (JL + HL + GL)
  const aspectingJL = getAspectingPlanets(chart, chart.lagnaNum);
  const aspectingHL = getAspectingPlanets(chart, hl.signNum);
  const aspectingGL = getAspectingPlanets(chart, gl.signNum);

  const tripleAspectPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].filter(
    (p) => aspectingJL.includes(p) && aspectingHL.includes(p) && aspectingGL.includes(p)
  );

  const occupantsJL = getPlanetsInSign(chart, chart.lagnaNum);
  const occupantsHL = getPlanetsInSign(chart, hl.signNum);
  const occupantsGL = getPlanetsInSign(chart, gl.signNum);

  const tripleConnectors = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].filter(
    (p) =>
      (aspectingJL.includes(p) || occupantsJL.includes(p)) &&
      (aspectingHL.includes(p) || occupantsHL.includes(p)) &&
      (aspectingGL.includes(p) || occupantsGL.includes(p))
  );

  const isTripleYogaFormed = tripleAspectPlanets.length > 0 || tripleConnectors.length > 0;
  const keyPlanet = tripleAspectPlanets[0] || tripleConnectors[0];

  yogas.push({
    name: "Jaimini Supreme Triple Raja Yoga (JL-HL-GL)",
    sanskritName: "जैमिनी त्रि-लग्न महा-राजयोग",
    type: "Fame & Authority",
    strength: "Supreme",
    description: isTripleYogaFormed
      ? `Jaimini's Pinnacle Raja Yoga Formed! Planet ${keyPlanet} connects simultaneously with Janma Lagna (${RASHIS[chart.lagnaNum]}), Hora Lagna (${hl.sign}), and Ghati Lagna (${gl.sign}). Classical sutras state: 'The native commands sovereign authority, widespread fame, and immense wealth resembling a king.'`
      : `Janma Lagna (${RASHIS[chart.lagnaNum]}), Hora Lagna (${hl.sign}), and Ghati Lagna (${gl.sign}) are governed independently. Success unfolds through sustained individual effort across wealth and administrative domains.`,
    involvedLagnas: ["JL", "HL", "GL"],
    isFormed: isTripleYogaFormed,
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
  rajayogas: SpecialLagnaRajayoga[],
  vl?: VarnadaLagnaAnalysis
): SpecialLagnaNarrative {
  const lagnaRashi = RASHIS[chart.lagnaNum] ?? chart.lagnaRashi ?? "Aries";
  const lagnaLord = SIGN_LORDS[chart.lagnaNum] ?? "Mars";

  const storyIntro = `सुनिए, जब आप इस दुनिया में पैदा हुए, तो विधाता ने आपको ${lagnaRashi} लग्न का यह भौतिक शरीर सौंपा। यह आपका वह निजी मकान है जिसकी चारदीवारी में आप अकेले में रोते, हंसते और अपने सपने बुनते हैं। लेकिन क्या इस दुनिया में कभी किसी ने आपके बेडरूम के अंदर झांककर आपको परखा है? कभी नहीं!\n\nसमाज आपको आपके ड्राइंग रूम की शान, आपकी शोहरत और आपके मुखौटे से आंकता है। वहीं दूसरी तरफ, ऊपर बैठा ईश्वर आपको आपके बैंक खाते से नहीं, बल्कि आपके पूर्वजन्म के संचित पुण्यों, आपकी गुप्त दौलत और आपकी चेतना के तराजू से तोलता है।\n\nबस इसी सांसारिक माया और रूहानी सच के बीच के फासले को पाटने के लिए महर्षि पराशर और महर्षि जैमिनी ने 'विशेष लग्नों' की रचना की थी। आइए, आज एक कप चाय के साथ अपनी ही ज़िंदगी के इस गुप्त नक्शे को एक कहानी की तरह समझते हैं।`;

  const publicImageStory = `सबसे पहले ज़रा अपने आरूढ़ लग्न (AL) के आईने में खुद को देखिए। आपका आरूढ़ लग्न ${al.sign} राशि में बैठा है, जो आपकी कुंडली का भाव ${al.house} बनता है, और इसके अधिपति ${al.lord} हैं। कभी आपने गौर किया है कि आप अपने दिल में चाहे कितनी भी बेचैनी महसूस कर रहे हों, चाहे किसी दिन आपकी जेब में पैसे कम हों या आप किसी पारिवारिक उलझन में फंसे हों — लेकिन जैसे ही आप चार लोगों के बीच कदम रखते हैं, लोगों का आपके प्रति नज़रिया एकदम बदल जाता है?\n\nलोग आपके चेहरे पर वह नहीं देख पाते जो आप असल में अंदर महसूस कर रहे हैं; वे वही देखते हैं जो आपका आरूढ़ लग्न उनके सामने प्रोजेक्ट करता है। समाज की नज़रों में आपका व्यक्तित्व भाव ${al.house} के मुख्य गुणों — यानी ${al.meaning} — से परिभाषित होता है। लोग मानते हैं कि आप इस क्षेत्र के स्वाभाविक खिलाड़ी हैं और आपके भीतर एक अदम्य गरिमा है।\n\n${al.occupants && al.occupants.length > 0 ? `खास बात यह है कि आपके आरूढ़ लग्न पर ${al.occupants.join(", ")} की ऊर्जा विराजमान है। यह ग्रह आपके सामाजिक आभा-मंडल को एक खास चमक देता है — लोग आपको दूर से देखकर ही समझ जाते हैं कि आपके भीतर कोई असाधारण बात है, और यही वजह है कि आपकी गैर-मौजूदगी में भी लोग आपकी साख का सम्मान करते हैं।` : `आपके आरूढ़ पर किसी क्रूर या तामसिक ग्रह का सीधा दबाव न होना एक वरदान है। इसका अर्थ यह है कि आपको दुनिया को प्रभावित करने के लिए कोई झूठा मुखौटा ओढ़ने की आवश्यकता नहीं है; आप जैसे हैं, वैसे ही स्वाभाविक रूप से समाज में अपनी जगह बना लेते हैं।`}`;

  const kuberWealthStory = `अब ज़रा अपनी ज़िंदगी के उस गुप्त दरवाज़े पर चलिए जिसे हम 'कुबेर का तिजोरी-कक्ष' या इंदु लग्न कहते हैं। आपने दुनिया में ऐसे लाखों लोगों को देखा होगा जो सुबह 6 बजे से रात 11 बजे तक पसीना बहाते हैं, लेकिन महीने के अंत में उनकी जेब खाली रह जाती है। वहीं कुछ ऐसे लोग भी होते हैं जो जिस काम में हाथ डालते हैं, वो सोना बन जाता है। लोग इसे केवल 'अंधी किस्मत' कहकर आगे बढ़ जाते हैं, लेकिन ऋषि वराहमिहिर ने 1500 वर्ष पूर्व 'बृहत् जातक' में स्पष्ट किया था कि यह किस्मत नहीं, बल्कि ब्रह्मांडीय किरणों (Kalas) का एक निश्चित ईश्वरीय गणित है।\n\nआपकी कुंडली में आपके जन्म लग्न के भाग्येश (${il.lagna9thLord}) के हिस्से की ${il.lagna9thRays} किरणें और आपके मन यानी चंद्रमा के भाग्येश (${il.moon9thLord}) के हिस्से की ${il.moon9thRays} किरणें जब ब्रह्मांड के 12 खानों में गूंजती हैं, तो उनका कुल योग ${il.totalRays} बनता है। इस पवित्र भागफल से आपका इंदु लग्न ${il.sign} राशि (भाव ${il.house}) में स्थापित हुआ है। कुबेर योग की इस कसौटी पर आपका स्कोर ${il.kuberYogaScore}/100 दर्ज हुआ है, जो आपको सीधे '${il.kuberYogaTier}' की श्रेणी में खड़ा करता है।\n\n${il.occupants.length > 0 ? `सबसे खूबसूरत बात यह है कि आपके इंदु लग्न की तिजोरी में ${il.occupants.join(", ")} जैसे ग्रहों का प्रत्यक्ष वास या सान्निध्य है। प्राचीन संहिताएं कहती हैं कि ऐसे जातक के जीवन में जब भी धन का बड़ा संकट आता है, तो ब्रह्मांड किसी न किसी अप्रत्याशित द्वार से उसके लिए साधन खड़े कर देता है।` : `यहाँ की सादगी यह संदेश देती है कि आपके पास कोई बिना मेहनत का जुआ या अनपेक्षित वसीयत नहीं, बल्कि आपके अपने आत्म-सम्मान, कड़े अनुशासन और सुनियोजित निवेश से खड़ा हुआ एक ऐसा साम्राज्य होगा जो पीढ़ियों तक आपका नाम रोशन करेगा।`} याद रखिए, आपके लिए धन केवल बैंक बैलेंस नहीं, एक दिव्य ऊर्जा है। जब भी आप ${il.lord} के सम्मान में सेवा या दान करेंगे, आपके घर की तिजोरी में बरकत अपने आप खिंची चली आएगी।`;

  const horaGhatiYoga = rajayogas.find((y) => y.name.includes("Hora-Ghati"));
  const powerAndAuthorityStory = `ज़िंदगी में सिर्फ तिजोरी में पैसा होना ही काफी नहीं होता; एक इंसान की असली ताकत इस बात से तय होती है कि संकट के समय उसके हाथ में कितनी तेज़ी से लिक्विड कैश आता है और समाज में जब वह खड़ा होता है तो कितने लोग उसके आदर में अपना सर झुकाते हैं। महर्षि पराशर ने इन दोनों चीज़ों को मापने के लिए सूर्योदय की पहली किरण से दो अलग-अलग घड़ियां बनाई थीं — एक होरा लग्न (HL) और दूसरी घटी लग्न (GL)।\n\nआपकी रोज़मर्रा की नकद आमदनी, पैसे की आवक की रफ्तार और आर्थिक अंतर्ज्ञान का पहिया 'होरा लग्न (HL)' ${hl.sign} राशि (भाव ${hl.house}) में घूम रहा है। इसका सीधा अर्थ यह है कि जब भी आपको तत्काल धन की आवश्यकता होगी, तो आपका भाग्य भाव ${hl.house} के माध्यम से अचानक तरलता पैदा करेगा। वहीं दूसरी ओर, आपकी सामाजिक सत्ता, प्रशासनिक मुहर, हुकूमत और लोगों से अपनी बात मनवाने की ताकत का केंद्र 'घटी लग्न (GL)' ${gl.sign} राशि (भाव ${gl.house}) में विराजमान है।\n\n${horaGhatiYoga?.isFormed ? `और यहाँ पराशर ऋषि की सबसे दुर्लभ भविष्यवाणी सत्य होती है! आपकी कुंडली में होरा लग्न और घटी लग्न आपस में दृष्टि या युति का संबंध बनाकर सर्वोच्च 'होरा-घटी धन-राजयोग' की रचना कर रहे हैं। शास्त्र कहते हैं कि ऐसा जातक न केवल अपार संपदा का स्वामी बनता है, बल्कि उसके हाथों में सत्ता की ऐसी चाबी आती है जिससे वह सैकड़ों लोगों के जीवन की दिशा तय कर सकता है।` : `आपकी कुंडली में धन उपार्जन (HL) और सामाजिक सत्ता (GL) दोनों अलग-अलग धुरियों पर विकसित होते हैं। इसका अर्थ यह है कि जीवन का एक दौर ऐसा आएगा जब आप केवल संपत्ति और संपत्तियों के निर्माण पर ध्यान केंद्रित करेंगे, और उसके बाद का अगला अध्याय आपको समाज में प्रतिष्ठा, पद और निर्णायक सत्ता के शिखर पर ले जाएगा।`}`;

  const marriageAndSanctuaryStory = `अब आइए उस नाज़ुक और सबसे गहरे सत्य पर, जिसे इंसान अक्सर समाज से ही नहीं, कभी-कभी खुद से भी छुपाने की कोशिश करता है — आपका दांपत्य और आपके घर की चारदीवारी का सच। आपका आरूढ़ लग्न (${al.sign}) वह सामाजिक फ्रेम है जो बाहर शादी-ब्याह या पार्टियों में दिखता है जहाँ लोग कहते हैं कि क्या शानदार जोड़ी है। लेकिन जब रात को घर का दरवाज़ा बंद होता है और आप अपने हमसफर के साथ एकांत में बैठते हैं, तब जो यथार्थ सांस लेता है, उसे महर्षि जैमिनी ने 'उपपद लग्न (UL)' कहा है, जो आपकी कुंडली में ${ul.sign} (भाव ${ul.house}) में स्थित है।\n\nआपकी सामाजिक छवि (AL) और आपकी वैवाहिक सच्चाई (UL) के बीच की दूरी ${synastry.distance} भावों की है, जिसे ज्योतिष में '${synastry.relationship}' कहा जाता है।\n\n${synastry.distance === 6 || synastry.distance === 8 ? `जैमिनी ज्योतिष का एक बहुत बड़ा और अचूक गोपनीय नियम है: जब आरूढ़ और उपपद के बीच 6/8 (षडाष्टक) का अंतर होता है, तो समाज को बाहर से सब कुछ बहुत भव्य और परिपूर्ण दिखाई देता है, लेकिन कमरे के भीतर दोनों साथियों के स्वभाव, सोच या प्राथमिकताओं में जमीन-आसमान का अंतर हो सकता है। एक साथी का झुकाव पूर्व की ओर होता है तो दूसरे का पश्चिम की ओर।\n\nयहाँ मार्गदर्शक का सबसे बड़ा स्वर्णिम नियम यह है: 'अपने दांपत्य की छोटी से छोटी बात भी कभी किसी तीसरे इंसान, मित्र या मायके-ससुराल के रिश्तेदारों के कानों तक न पहुँचने दें।' बाहर वालों की राय आपके रिश्ते में ज़हर घोल सकती है। और इसके लिए पराशर ऋषि का अचूक उपाय है — उपपद के स्वामी ${ul.lord} के विशिष्ट वार (${synastry.remedy.includes("Sunday") ? "रविवार" : synastry.remedy.includes("Monday") ? "सोमवार" : synastry.remedy.includes("Tuesday") ? "मंगलवार" : synastry.remedy.includes("Wednesday") ? "बुधवार" : synastry.remedy.includes("Thursday") ? "गुरुवार" : synastry.remedy.includes("Friday") ? "शुक्रवार" : "शनिवार"}) को नमक-रहित या सात्विक उपवास रखना अथवा शुक्रवार को महालक्ष्मी का ध्यान करना। यह उपाय दोनों हृदयों के बीच की दीवार को तोड़कर आत्मीय प्रेम का संचार कर देता है।` : `इन दोनों के बीच का यह सामंजस्य इस बात का प्रमाण है कि जैसा प्रेम, आदर और शालीनता बाहर समाज को दिखाई देती है, वैसी ही पवित्र शांति और एक-दूसरे के प्रति समर्पण आपके बेडरूम के भीतर भी धड़कता है। आपका जीवनसाथी आपकी सामाजिक छवि का विरोधी नहीं, बल्कि आपकी ढाल बनकर खड़ा रहता है।`}`;

  const pakaLagnaStory = `शास्त्रों में एक अमर श्लोक आता है — 'यत्र लग्नेश्वरो याति, तत्र जीवस्य चेतना।' यानी इंसान का शरीर चाहे जहाँ भी विचरण कर रहा हो, उसकी चेतना और प्राण वहीं वास करते हैं जहाँ उसका लग्नेश जाकर बैठता है। आपका जन्म लग्न तो सिर्फ वह भौतिक गाड़ी है जिसमें आप सवार हैं, लेकिन उस गाड़ी का ड्राइवर, उसकी संपूर्ण इच्छाशक्ति, उसकी 24 घंटे की चिंताएँ और उसकी मानसिक एकाग्रता का ठिकाना 'पाक लग्न' है — और आपकी कुंडली में आपके लग्नेश ${lagnaLord} अपनी यात्रा करके ${pl.sign} राशि (भाव ${pl.house}) में विराजमान हैं।\n\nइसका सीधा, व्यावहारिक अर्थ यह है कि आप अपनी आँखों से दुनिया को चाहे जिस रूप में देखें, लेकिन जब भी जीवन में कोई बड़ा मोड़ आएगा — जब बात आत्म-सम्मान, भविष्य के निर्णय या आंतरिक संतुष्टि की होगी — तो आपकी बुद्धि भाव ${pl.house} के विषयों (${pl.meaning}) की ओर ही मुड़ेगी। जब तक भाव ${pl.house} के कार्य सिद्ध नहीं होते, आपका मन कभी पूरी तरह शांत नहीं बैठ सकता। अपने लग्नेश की इस पुकार को पहचानना ही आपकी आत्म-जागृति का पहला कदम है।`;

  const varnaAndCareerStory = vl
    ? `महर्षि जैमिनी ने एक अत्यंत क्रांतिकारी सत्य उजागर किया था — उन्होंने कहा कि समाज में आपका वास्तविक दायित्व और सम्मान इस बात से तय नहीं होता कि आप किस कुल में पैदा हुए, बल्कि इससे तय होता है कि आपकी आत्मा का 'वर्णद लग्न (VL)' किस तत्व को धारण किए हुए है। आपकी कुंडली में वर्णद लग्न ${vl.sign} राशि (भाव ${vl.house}) में स्थापित हुआ है, जो आपको '${vl.varna}' (${vl.element} तत्व) का स्वरूप प्रदान करता है।\n\nइसका गहरा अर्थ यह है कि आपकी आत्मा की स्वाभाविक कार्यशैली और आंतरिक प्रेरणा '${vl.careerInclination}' की ओर बहती है। जब भी आप इस नैसर्गिक दिशा के विपरीत काम करेंगे, तो आपको थकान और असंतोष महसूस होगा; लेकिन जैसे ही आप अपने इस वर्ण के अनुकूल दायित्व संभालेंगे, आपके काम में एक स्वाभाविक निपुणता और समाज में प्रतिष्ठा प्रकट होगी।\n\nऔर सबसे बड़ी बात — महर्षि जैमिनी ने बताया कि इंसान को जीवनभर पोषण और निरंतर आजीविका कहाँ से प्राप्त होगी, इसका रहस्य वर्णद लग्न से 11वें भाव में छिपा होता है। आपकी कुंडली में यह पोषणकारी भाव ${vl.sustainingHouse11thSign} राशि (भाव ${vl.sustainingHouse11thHouse}) में पड़ता है। ${vl.isSpiritualOrTeacherBlessing ? `यहाँ महर्षि जैमिनी का एक अत्यंत दुर्लभ वरदान उपस्थित है — आपके इस पोषण भाव पर देवगुरु बृहस्पति अथवा दैत्यगुरु शुक्र का पावन प्रभाव है। शास्त्र घोषणा करते हैं कि ऐसा जातक यदि ज्ञान, परामर्श, शिक्षण, अध्यात्म, हीलिंग या ज्योतिष के क्षेत्र में कदम रखता है, तो समाज उसे श्रद्धा से सिर-आंखों पर बिठाता है और धन उसके पीछे-पीछे चला आता है।` : `यह भाव बताता है कि जब भी आप ${vl.sustainingHouse11thSign} के व्यावहारिक गुणों और संपर्कों को सक्रिय करेंगे, आपके जीवन की आर्थिक रीढ़ सदैव मज़बूत और स्थिर बनी रहेगी।`}`
    : `वर्णद लग्न (VL) आपकी सामाजिक भूमिका और उस कार्यक्षेत्र को उजागर करता है जो जीवनभर आपकी आजीविका को संबल प्रदान करता है।`;

  const mentorSynthesis = `संक्षेप में कहें तो मेरे भाई — आपका जन्म लग्न वह ज़मीन है जिस पर आप खड़े हैं, इंदु लग्न आपकी ज़मीन के नीचे दबा हुआ कुबेर का अमृत-कलश है, वर्णद लग्न वह कर्म-यज्ञ है जो आपको सामाजिक पहचान और अनवरत आजीविका देता है, आरूढ़ लग्न वह विशाल वृक्ष है जिसकी छाया समाज पर पड़ती है, और उपपद लग्न वह घोंसला है जिसमें आपकी आत्मा विश्राम पाती है।\n\nजब एक इंसान अपने इन सभी आयामों को एक साथ समझ लेता है, तो जीवन की सारी उलझनें धूप में कोहरे की तरह छंट जाती हैं। अब आपके पास केवल नक्षत्रों के नाम नहीं, बल्कि अपनी तकदीर को संवारने का पूरा दिशा-निर्देश है।`;

  return {
    title: "मार्गदर्शक की ज़ुबानी — आपकी ज़िंदगी का आईना",
    storyIntro,
    publicImageStory,
    kuberWealthStory,
    powerAndAuthorityStory,
    marriageAndSanctuaryStory,
    pakaLagnaStory,
    varnaAndCareerStory,
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

  // 6. Varnada Lagna (Jaimini Social Vocation & Sustaining Livelihood)
  const varnadaLagna = calculateVarnadaLagna(chart, hl);
  const vlItem = makeItem("VL", varnadaLagna.signNum * 30 + 15, chart, {
    lord: varnadaLagna.lord,
    category: "social",
  });

  // 7. Pranapada Lagna (Life Force & Cellular Stamina)
  const pranapadaLagna = calculatePranapadaLagna(sunAtSunrise, minutesSinceSunrise, chart);
  const ppItem = makeItem("PP", pranapadaLagna.signNum * 30 + 15, chart, {
    lord: pranapadaLagna.lord,
    category: "vitality",
  });

  // Groupings
  const wealthLagnas = [ilItem, hl, sl];
  const powerLagnas = [gl, bl, pakaLagna, vlItem, ppItem];

  const items: SpecialLagnaItem[] = [
    ilItem,
    hl,
    gl,
    sl,
    pakaLagna,
    bl,
    vlItem,
    ppItem,
    ...arudhaItems,
  ];

  // 8. Rajayoga Synthesizer
  const rajayogas = evaluateSpecialLagnaRajayogas(hl, gl, al, a10, sl, induLagna, chart);

  // 9. AL-UL Synastry
  const alUlSynastry = evaluateAlUlSynastry(al, ul, chart);

  // 10. Active Dasha Activation
  const activeDashaActivation = evaluateDashaActivation(chart, items);

  const strongestPublicSignal = a10;
  const summary = `Special Lagnas reveal: Indu Lagna in ${induLagna.sign} (${induLagna.kuberYogaTier}), Hora Lagna (Wealth) in ${hl.sign}, Ghati Lagna (Power) in ${gl.sign}, Sree Lagna in ${sl.sign}, Arudha Lagna (Public Image) in ${al.sign}, Upapada (Marriage) in ${ul.sign}, and Varnada Lagna (${varnadaLagna.varna}) in ${varnadaLagna.sign}.`;

  // 11. Human Storytelling Narrative
  const narrative = generateSpecialLagnaNarrative(chart, al, ul, induLagna, hl, gl, pakaLagna, alUlSynastry, rajayogas, varnadaLagna);

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
    varnadaLagna,
    pranapadaLagna,
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
