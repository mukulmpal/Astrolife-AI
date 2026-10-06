/**
 * ============================================================================
 * ASTROLIFE — MARRIAGE INTELLIGENCE & D9 NAVAMSHA ENGINE
 * ============================================================================
 * Deep synthesis of KP Stellar Astrology, K.N. Rao Research, and Classical
 * Navamsha (D9) Marriage Varga Analysis.
 *
 * Capabilities:
 * 1. 7th Cusp Sub-Lord's Star Lord in 12 Bhavas (Where & How Marriage Occurs)
 * 2. 7th House Rashi Impact (Post-Marriage Psychological & Life Manifestation)
 * 3. D9 Navamsha 4-Pillar Health Audit (Houses 1, 4, 7, 12 & Bedroom Bliss)
 * 4. Dual / Second Marriage Analysis (Dual Signs 3, 6, 9, 12 & Mercury Rule)
 * 5. Renunciation / Sanyas & Denial Indicators (Saturn-Ketu, Ketu in 1/12)
 * 6. Intimacy / Orientation Dynamics (Saturn + Mercury + Venus in 5/7/12, NNW)
 * 7. Classical & Practical Remedial Guidance (Temple Shivalinga, WSW Venus, etc.)
 * ============================================================================
 */

import type { ChartData, PlanetData } from "./calculations";
import { runKPEngine, type KPRow, type KPCuspRow } from "./kp";

// ── Types & Interfaces ───────────────────────────────────────────────────────

export interface MeetingContextResult {
  house: number;
  circumstance: string;
  partnerNature: string;
  caution?: string;
  sourceStarLord: string;
  starLordHouse: number;
}

export interface Rashi7thImpactResult {
  signNumber: number;
  signName: string;
  lifeDomainActivated: string;
  behavioralDynamics: string;
  warningOrRemedy?: string;
}

export interface D9HouseAffliction {
  house: number;
  sign: string;
  planets: string[];
  severity: "clean" | "mild" | "moderate" | "severe";
  interpretation: string;
}

export interface D9MarriageAuditResult {
  d9LagnaSign: string;
  pillars: {
    h1NativeMindset: D9HouseAffliction;
    h4MaritalPeace: D9HouseAffliction;
    h7SpouseNature: D9HouseAffliction;
    h12BedroomBliss: D9HouseAffliction;
  };
  bedroomBlissStatus: "excellent" | "harmonious" | "strained" | "separate_bedrooms_risk";
  explosiveTemperamentRisk: boolean;
  overallD9Verdict: string;
}

export interface DualMarriageResult {
  hasDualSignPromise: boolean;
  subLordInDualSign: boolean;
  starLordInDualSignOrMercury: boolean;
  seventhSubLord: string;
  subLordSign: string;
  starLord: string;
  mercuryInvolvement: boolean;
  notes: string;
}

export interface SanyasDenialResult {
  denialIndicated: boolean;
  saturnKetu7thOr1st: boolean;
  ketu1stOr12th: boolean;
  activeSanyasDasha: boolean;
  interpretation: string;
}

export interface IntimacyOrientationResult {
  afflictionDetected: boolean;
  involvedPlanets: string[];
  involvedHouses: number[];
  vastuZone: string;
  interpretation: string;
}

export interface PunarbuYogaResult {
  detected: boolean;
  conditions: string[];
  severity: "none" | "mild" | "moderate" | "strong";
  effects: string;
  cancellationFactors: string[];
  isCancelled: boolean;
  remedy: string;
}

export interface SeparativeInfluenceAudit {
  afflictedHouses: Array<{
    house: number;
    houseName: string;
    separativePlanets: string[];
    severity: "clean" | "mild" | "moderate" | "severe";
  }>;
  seventhLordAfflicted: boolean;
  seventhLordSeparators: string[];
  totalSeparativeScore: number;
  interpretation: string;
}

export interface BarrenSignsAudit {
  lagnaInBarrenSign: boolean;
  seventhCuspInBarrenSign: boolean;
  venusInBarrenSign: boolean;
  barrenPlacements: string[];
  interpretation: string;
}

export interface MarriageDirectionResult {
  primaryDirection: string;
  primaryDirectionHindi: string;
  secondaryDirection: string;
  rationale: string;
}

export interface D1toD9CrossMapping {
  trikInD9: Array<{
    d1House: number;
    d1Rashi: string;
    d9House: number;
    frictionDomain: string;
  }>;
  wealthInD9: Array<{
    d1House: number;
    d1Rashi: string;
    d9House: number;
    growthDomain: string;
  }>;
  synthesis: string;
}

export interface MarriageRemedyItem {
  category: "Universal" | "Mars" | "Moon" | "Venus" | "Mercury" | "Sun" | "Desire_Fulfillment" | "Punarbu" | "Separative";
  title: string;
  procedure: string;
  caution?: string;
  astrologicalRationale: string;
}

export interface MarriageIntelligenceReport {
  meetingContext: MeetingContextResult;
  rashiImpact: Rashi7thImpactResult;
  d9Audit: D9MarriageAuditResult;
  dualMarriage: DualMarriageResult;
  sanyasDenial: SanyasDenialResult;
  intimacyAudit: IntimacyOrientationResult;
  punarbuYoga: PunarbuYogaResult;
  separativeAudit: SeparativeInfluenceAudit;
  barrenAudit: BarrenSignsAudit;
  marriageDirection: MarriageDirectionResult;
  d1ToD9Mapping: D1toD9CrossMapping;
  remedies: MarriageRemedyItem[];
  executiveSummary: string;
}

// ── Constants & Knowledge Base ───────────────────────────────────────────────

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

const SIGN_LORDS: Record<string, string> = {
  Aries:"Mars", Taurus:"Venus", Gemini:"Mercury", Cancer:"Moon",
  Leo:"Sun",   Virgo:"Mercury", Libra:"Venus",   Scorpio:"Mars",
  Sagittarius:"Jupiter", Capricorn:"Saturn", Aquarius:"Saturn", Pisces:"Jupiter",
};

const DUAL_SIGNS = [3, 6, 9, 12]; // Gemini, Virgo, Sagittarius, Pisces
const DUAL_SIGN_NAMES = ["Gemini", "Virgo", "Sagittarius", "Pisces"];

const MEETING_CONTEXT_MAP: Record<number, { circumstance: string; partnerNature: string; caution?: string }> = {
  1: {
    circumstance: "Meeting occurs at a social gathering, hospital, wedding ceremony, or through direct family network. Initiated by mutual attraction to education and graceful conduct, formalized via parents.",
    partnerNature: "Cultured, presentable, and well-educated. Relationship begins with strong mutual physical and intellectual rapport.",
  },
  2: {
    circumstance: "Marriage takes place within the extended family, close-knit community, or established financial circle.",
    partnerNature: "Financially solid, affluent, and supportive of household wealth. Brings financial prosperity to the marital union.",
  },
  3: {
    circumstance: "Alliance initiated via communication channels: matrimonial websites (Shaadi/BharatMatrimony), social media, classified ads, or through siblings/neighbors.",
    partnerNature: "Extremely hardworking, practical, and stands shoulder-to-shoulder with the native in business or career.",
  },
  4: {
    circumstance: "Spouse resides very close to the native's home (same street, colony, or immediate neighborhood). Strong maternal family backing.",
    partnerNature: "Domestic, nurturing, and family-oriented. Often preceded by an earlier pre-marital heartbreak or breakup.",
    caution: "High likelihood of a prior emotional breakup before the final solemnization.",
  },
  5: {
    circumstance: "Romantic love marriage (*Prem Vivah*). Intense attraction and emotional bonding (classic Laila-Majnu bond).",
    partnerNature: "Deeply loving, romantic, and devoted. High emotional affinity.",
    caution: "Purva Punya transfer: 5th house is 11th from 7th. Native's past-life fortune may transfer to the spouse; career requires grounded discipline.",
  },
  6: {
    circumstance: "Met at the workplace, service environment, corporate daily routine, or facilitated by maternal uncle and aunt (Mama-Mami).",
    partnerNature: "Calculative, analytical, and detail-oriented.",
    caution: "6th negates 7th (12th from 7th). High risk of constant auditing, micro-criticism, fault-finding, and legal/domestic disputes if unmanaged.",
  },
  7: {
    circumstance: "Traditional, lifelong magnetic union. Stone-fortress boundaries; enduring commitment from the start.",
    partnerNature: "Ideal life companion; mutual attraction remains steadfast throughout life.",
  },
  8: {
    circumstance: "Challenging inception; obstacles and crises begin right from the engagement / ring ceremony. If Rahu is present, points to inter-caste or unconventional marriage.",
    partnerNature: "Intense, transformative, secretive, or psychologically demanding.",
    caution: "High obstacle zone. Requires careful pre-marital verification and astrological remedies.",
  },
  9: {
    circumstance: "Rise of fortune (*Bhagyodaya*) after marriage. Spouse enters like Goddess Lakshmi. Facilitated by father, Guru, or during pilgrimages.",
    partnerNature: "Pious, highly religious, disciplined, and spiritually inclined. Initiates sacred journeys together.",
  },
  10: {
    circumstance: "Alliance forged inside the native's profession, trade, corporate industry, or commercial connections.",
    partnerNature: "Ambitious, career-oriented, and prestigious. Marriage brings major surge in reputation, fame, and business growth.",
  },
  11: {
    circumstance: "Love marriage within the native's friend circle or extended professional network. Fulfillment of heart's cherished desires.",
    partnerNature: "Affectionate, socially well-networked, and brings multifold financial gains.",
  },
  12: {
    circumstance: "Highly auspicious if marriage occurs in a foreign country, outside native state/region, or through distant travels.",
    partnerNature: "Spiritual or overseas connection; requires geographic relocation.",
    caution: "If native remains in the same hometown, 12th house can cause bedroom distance, disappointment, or separate sleeping quarters.",
  },
};

const RASHI_7TH_IMPACT_MAP: Record<number, { domain: string; dynamics: string; caution?: string }> = {
  1: {
    domain: "New Venture & Rebirth (Aries)",
    dynamics: "Marriage triggers a fresh personal startup, renewed independence, and a completely new lifestyle chapter.",
  },
  2: {
    domain: "Accumulation of Wealth (Taurus)",
    dynamics: "Continuous growth of family wealth, jewelry, liquid cash, and financial solidity post-marriage.",
  },
  3: {
    domain: "Travel, Communication & Effort (Gemini)",
    dynamics: "Spike in daily communication, multifold efforts, short journeys, and exploration of creative hobbies.",
  },
  4: {
    domain: "Real Estate & Domestic Serenity (Cancer)",
    dynamics: "Acquisition of real estate, luxury vehicles, domestic comforts, and pursuit of higher education.",
  },
  5: {
    domain: "Intellect, Entertainment & Children (Leo)",
    dynamics: "Flourishing creative intelligence, entertainment, proactive problem-solving, and joy through progeny.",
  },
  6: {
    domain: "Karmic Debt, Daily Discipline & Routine (Virgo)",
    dynamics: " heightened daily workload, awareness of life's purpose and duties, health focus.",
    caution: "Risk of health vulnerabilities or constant criticism in marital routine.",
  },
  7: {
    domain: "Public Partnerships & Social Appeal (Libra)",
    dynamics: "Expansion into business partnerships, balanced lifestyle, and ongoing opposite-sex attraction.",
  },
  8: {
    domain: "Metamorphosis & Hidden Pressures (Scorpio)",
    dynamics: "Sudden transformative challenges, administrative/tax/financial hurdles, or mysterious family trials.",
    caution: "Scorpio in 7th requires conscious emotional honesty; avoid secretive power struggles.",
  },
  9: {
    domain: "Spiritual Fortune & Divine Grace (Sagittarius)",
    dynamics: "Doors of destiny unlock; Guru's guidance, philosophical expansion, and ethical righteousness prevail.",
  },
  10: {
    domain: "Prestige, Fame & High Authority (Capricorn)",
    dynamics: "Rise in public rank, corporate elevation, government connections, and professional stability.",
  },
  11: {
    domain: "Worldwide Network & Desires (Aquarius)",
    dynamics: "Massive international social circle, constant profit and gain from ventures.",
    caution: "Unending desires and sky-high expectations can create underlying lack of personal contentment.",
  },
  12: {
    domain: "Foreign Lands, Investments & Solitude (Pisces)",
    dynamics: "Overseas relocation, foreign investments, or spiritual retreat.",
    caution: "Can induce physical lethargy, fatigue, or need for private space/bed rest.",
  },
};

// ── Navamsha (D9) Evaluation Helpers ─────────────────────────────────────────

const D9_STARTS = [0, 9, 6, 3, 0, 9, 6, 3, 0, 9, 6, 3];
const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

function getNavamshaSignNum(lon: number): number {
  const norm = ((lon % 360) + 360) % 360;
  const signIdx = Math.floor(norm / 30);
  const degInSign = norm % 30;
  const navPart = Math.floor(degInSign / (30 / 9));
  return (D9_STARTS[signIdx] + navPart) % 12;
}

// ── Research Helpers: Veluchamy (2022) & K.N. Rao Synthesis ─────────────────

/**
 * Detects Punarbu / Punarphoo Yoga (Moon-Saturn Connection)
 * Researched by Dr. S. Veluchamy & N. Karuna Moorthy (2022, VISTAS).
 * Causes delays, sudden renegotiations, hesitation, and pre-marital anxiety.
 */
export function detectPunarbuYoga(chart: ChartData, kpResult?: ReturnType<typeof runKPEngine>): PunarbuYogaResult {
  const moon = chart.planets["Moon"];
  const saturn = chart.planets["Saturn"];
  const jupiter = chart.planets["Jupiter"];
  const venus = chart.planets["Venus"];

  const conditions: string[] = [];
  const cancellationFactors: string[] = [];

  if (!moon || !saturn) {
    return {
      detected: false,
      conditions: [],
      severity: "none",
      effects: "Lunar and Saturnian coordinates insufficient for Punarbu analysis.",
      cancellationFactors: [],
      isCancelled: false,
      remedy: "",
    };
  }

  // 1. Moon in Saturn's Star
  const SATURN_STARS = ["Pushya", "Anuradha", "Uttara Bhadrapada", "Uttarabhadra"];
  if (SATURN_STARS.includes(moon.nakshatra) || moon.nakshatraLord === "Saturn") {
    conditions.push(`Moon in Saturn's Star (${moon.nakshatra})`);
  }

  // 2. Saturn in Moon's Star
  const MOON_STARS = ["Rohini", "Hasta", "Shravana"];
  if (MOON_STARS.includes(saturn.nakshatra) || saturn.nakshatraLord === "Moon") {
    conditions.push(`Saturn in Moon's Star (${saturn.nakshatra})`);
  }

  // 3. Moon & Saturn Conjunction
  if (moon.house === saturn.house && moon.house > 0) {
    conditions.push(`Moon and Saturn conjunct in House ${moon.house} (${moon.sign})`);
  }

  // 4. Mutual Aspects
  const diffH = ((saturn.house - moon.house + 12) % 12);
  if (diffH === 6) {
    conditions.push(`Moon and Saturn in 1-7 mutual opposition/aspect (Houses ${moon.house} & ${saturn.house})`);
  }
  const satToMoon = ((moon.house - saturn.house + 12) % 12);
  if ([2, 6, 9].includes(satToMoon)) {
    const aspName = satToMoon === 2 ? "3rd" : satToMoon === 6 ? "7th" : "10th";
    conditions.push(`Saturn casts special ${aspName} aspect on Moon`);
  }

  // 5. Moon in Saturn's sign, or Saturn in Cancer
  if (["Capricorn", "Aquarius"].includes(moon.sign)) {
    conditions.push(`Moon placed in Saturn's sign (${moon.sign})`);
  }
  if (saturn.sign === "Cancer") {
    conditions.push(`Saturn placed in Moon's sign (Cancer)`);
  }

  // 6. KP Sub-Lord connection
  if (kpResult && kpResult.rows) {
    const moonKP = kpResult.rows.find(r => r.name === "Moon");
    const satKP = kpResult.rows.find(r => r.name === "Saturn");
    if (moonKP?.subLord === "Saturn") conditions.push("Moon's KP Planet Sub-Lord is Saturn");
    if (satKP?.subLord === "Moon") conditions.push("Saturn's KP Planet Sub-Lord is Moon");
  }

  // Cancellations
  if (jupiter) {
    const jupToMoon = ((moon.house - jupiter.house + 12) % 12);
    if (jupiter.house === moon.house) cancellationFactors.push("Benefic Jupiter conjunct Moon");
    if ([4, 6, 8].includes(jupToMoon)) cancellationFactors.push("Benefic Jupiter aspects Moon via 5th/7th/9th drishti");
    const jupToSat = ((saturn.house - jupiter.house + 12) % 12);
    if (jupiter.house === saturn.house) cancellationFactors.push("Benefic Jupiter conjunct Saturn");
    if ([4, 6, 8].includes(jupToSat)) cancellationFactors.push("Benefic Jupiter aspects Saturn via 5th/7th/9th drishti");
  }
  if (venus && venus.house === moon.house) {
    cancellationFactors.push("Benefic Venus conjunct Moon");
  }

  const detected = conditions.length > 0;
  const isCancelled = cancellationFactors.length > 0;
  const severity: PunarbuYogaResult["severity"] =
    !detected ? "none" :
    conditions.length >= 3 ? "strong" :
    conditions.length === 2 ? "moderate" : "mild";

  const effects = detected
    ? (isCancelled
        ? "Punarbu / Punarphoo Yoga is present but significantly neutralized by Jupiterian/Venusian benefic aspects. Pre-marital delays or initial hesitation will dissolve smoothly prior to solemnization."
        : "Active Punarbu / Punarphoo Yoga: Indicates psychological hesitation, fear of broken engagements, renegotiations, or wedding date adjustments. Requires emotional patience.")
    : "No Punarbu Yoga detected; lunar-saturnian channels remain free of delay afflictions.";

  const remedy = detected
    ? "Perform raw milk & water Jalabhisheka on Shivalinga on Mondays and Saturdays. Drink water from a solid silver tumbler to strengthen lunar confidence and eliminate wedding anxiety."
    : "";

  return {
    detected,
    conditions,
    severity,
    effects,
    cancellationFactors,
    isCancelled,
    remedy,
  };
}

/**
 * Evaluates Separative Influences (Sun, Saturn, Rahu, Ketu, 12th Lord)
 * Across houses 1 (Self), 4 (Domestic bliss), 7 (Marriage), 10 (Honor), 12 (Bedroom).
 */
export function evaluateSeparativeInfluences(chart: ChartData): SeparativeInfluenceAudit {
  const HOUSE_NAMES: Record<number, string> = {
    1: "Lagna (Self & Vitality)",
    4: "4th House (Domestic Happiness & Peace)",
    7: "7th House (Kalatra / Marriage Axis)",
    10: "10th House (Status & Karma)",
    12: "12th House (Bedroom & Separation)",
  };

  const h12Sign = chart.houseCusps.find(h => h.house === 12)?.sign ?? "Pisces";
  const lord12 = SIGN_LORDS[h12Sign] ?? "Jupiter";

  const separativePlanetsList = Array.from(new Set(["Sun", "Saturn", "Rahu", "Ketu", lord12]));
  const targetHouses = [1, 4, 7, 10, 12];
  const afflictedHouses: SeparativeInfluenceAudit["afflictedHouses"] = [];

  let totalSeparativeScore = 0;

  for (const h of targetHouses) {
    const activeSeps: string[] = [];
    for (const pName of separativePlanetsList) {
      const p = chart.planets[pName];
      if (!p) continue;

      if (p.house === h) {
        activeSeps.push(`${pName} (occupying H${h})`);
        continue;
      }

      if (pName === "Sun" && ((h - p.house + 12) % 12) === 6) {
        activeSeps.push(`Sun (7th aspect from H${p.house})`);
      } else if (pName === "Saturn" && [2, 6, 9].includes((h - p.house + 12) % 12)) {
        const asp = ((h - p.house + 12) % 12) === 2 ? "3rd" : ((h - p.house + 12) % 12) === 6 ? "7th" : "10th";
        activeSeps.push(`Saturn (${asp} aspect from H${p.house})`);
      } else if (pName === lord12 && pName !== "Saturn" && pName !== "Sun") {
        if (((h - p.house + 12) % 12) === 6) {
          activeSeps.push(`12th Lord ${lord12} (7th aspect from H${p.house})`);
        }
      }
    }

    const count = activeSeps.length;
    const severity: "clean" | "mild" | "moderate" | "severe" =
      count === 0 ? "clean" :
      count === 1 ? "mild" :
      count === 2 ? "moderate" : "severe";

    if (count > 0) totalSeparativeScore += count;

    afflictedHouses.push({
      house: h,
      houseName: HOUSE_NAMES[h],
      separativePlanets: activeSeps,
      severity,
    });
  }

  // 7th Lord Affliction
  const h7Sign = chart.houseCusps.find(h => h.house === 7)?.sign ?? "Libra";
  const lord7 = SIGN_LORDS[h7Sign] ?? "Venus";
  const lord7Planet = chart.planets[lord7];
  const seventhLordSeparators: string[] = [];

  if (lord7Planet) {
    for (const pName of ["Sun", "Saturn", "Rahu", "Ketu", lord12]) {
      if (pName === lord7) continue;
      const p = chart.planets[pName];
      if (!p) continue;
      if (p.house === lord7Planet.house) {
        seventhLordSeparators.push(`${pName} (conjunction in H${p.house})`);
      } else if (pName === "Saturn" && [2, 6, 9].includes((lord7Planet.house - p.house + 12) % 12)) {
        seventhLordSeparators.push(`Saturn (aspects 7th lord ${lord7})`);
      } else if (pName === "Sun" && ((lord7Planet.house - p.house + 12) % 12) === 6) {
        seventhLordSeparators.push(`Sun (7th aspect onto 7th lord ${lord7})`);
      }
    }
  }

  const seventhLordAfflicted = seventhLordSeparators.length > 0;
  if (seventhLordAfflicted) totalSeparativeScore += seventhLordSeparators.length;

  const interpretation =
    totalSeparativeScore >= 4
      ? "Strong separative cluster detected across domestic/marital pillars. Pre-marital Astrological matching, clear mutual expectations, and regular grounding remedies are vital."
      : totalSeparativeScore >= 2
      ? "Moderate separative influences present. Minor temporary distance due to career or relocations likely, but core bond remains resilient."
      : "Separative influences are minimal. Domestic peace and marital stability are strongly protected.";

  return {
    afflictedHouses,
    seventhLordAfflicted,
    seventhLordSeparators,
    totalSeparativeScore,
    interpretation,
  };
}

/**
 * Evaluates Barren Signs (Gemini, Leo, Virgo) on Lagna, 7th Cusp, or Venus.
 */
export function evaluateBarrenSigns(chart: ChartData): BarrenSignsAudit {
  const BARREN_SIGNS = ["Gemini", "Leo", "Virgo"];
  const lagnaSign = chart.lagnaRashi;
  const h7Sign = chart.houseCusps.find(h => h.house === 7)?.sign ?? "";
  const venusSign = chart.planets.Venus?.sign ?? "";

  const lagnaInBarrenSign = BARREN_SIGNS.includes(lagnaSign);
  const seventhCuspInBarrenSign = BARREN_SIGNS.includes(h7Sign);
  const venusInBarrenSign = BARREN_SIGNS.includes(venusSign);

  const barrenPlacements: string[] = [];
  if (lagnaInBarrenSign) barrenPlacements.push(`Lagna in ${lagnaSign}`);
  if (seventhCuspInBarrenSign) barrenPlacements.push(`7th Cusp in ${h7Sign}`);
  if (venusInBarrenSign) barrenPlacements.push(`Venus in ${venusSign}`);

  const interpretation = barrenPlacements.length > 0
    ? `Barren sign signatures identified in ${barrenPlacements.join(", ")}. Can lead to initial emotional reserve, analytical hesitation, or delays in child conception unless balanced by fertile Jupiterian/lunar aspects.`
    : "No barren signs on core marital axes; natural emotional warmth and fertility flow unhindered.";

  return {
    lagnaInBarrenSign,
    seventhCuspInBarrenSign,
    venusInBarrenSign,
    barrenPlacements,
    interpretation,
  };
}

/**
 * Calculates Marriage Direction of Spouse
 * Male: 7th from natal Venus. Female: 7th from natal Mars.
 */
export function calculateMarriageDirection(
  chart: ChartData,
  gender: "male" | "female" = "male"
): MarriageDirectionResult {
  const DIRECTION_MAP: Record<string, { en: string; hi: string }> = {
    Aries:       { en: "East", hi: "पूर्व (East)" },
    Leo:         { en: "East", hi: "पूर्व (East)" },
    Sagittarius: { en: "East", hi: "पूर्व (East)" },
    Taurus:      { en: "South", hi: "दक्षिण (South)" },
    Virgo:       { en: "South", hi: "दक्षिण (South)" },
    Capricorn:   { en: "South", hi: "दक्षिण (South)" },
    Gemini:      { en: "West", hi: "पश्चिम (West)" },
    Libra:       { en: "West", hi: "पश्चिम (West)" },
    Aquarius:    { en: "West", hi: "पश्चिम (West)" },
    Cancer:      { en: "North", hi: "उत्तर (North)" },
    Scorpio:     { en: "North", hi: "उत्तर (North)" },
    Pisces:      { en: "North", hi: "उत्तर (North)" },
  };

  const karakaSign = gender === "male"
    ? (chart.planets.Venus?.sign ?? "Leo")
    : (chart.planets.Mars?.sign ?? "Aries");

  const karakaIdx = SIGNS.indexOf(karakaSign);
  const seventhFromKarakaSign = SIGNS[(karakaIdx + 6) % 12] ?? "Aries";

  const h7Sign = chart.houseCusps.find(h => h.house === 7)?.sign ?? "Libra";
  const lord7 = SIGN_LORDS[h7Sign] ?? "Venus";
  const lord7Sign = chart.planets[lord7]?.sign ?? h7Sign;

  const primDir = DIRECTION_MAP[seventhFromKarakaSign] ?? { en: "East", hi: "पूर्व" };
  const secDir  = DIRECTION_MAP[lord7Sign] ?? DIRECTION_MAP[h7Sign] ?? { en: "North", hi: "उत्तर" };

  return {
    primaryDirection: primDir.en,
    primaryDirectionHindi: primDir.hi,
    secondaryDirection: secDir.en,
    rationale: gender === "male"
      ? `7th from natal Venus (${karakaSign}) falls in ${seventhFromKarakaSign} (${primDir.en}). Secondary directional vector from 7th Lord (${lord7} in ${lord7Sign}) points ${secDir.en}.`
      : `7th from natal Mars (${karakaSign}) falls in ${seventhFromKarakaSign} (${primDir.en}). Secondary directional vector from 7th Lord (${lord7} in ${lord7Sign}) points ${secDir.en}.`,
  };
}

/**
 * Cross-maps D1 Trik houses (6, 8, 12) and Wealth houses (2, 11) into D9 Navamsha houses.
 */
export function mapD1toD9CrossImpact(chart: ChartData): D1toD9CrossMapping {
  const d1LagnaSign = chart.lagnaRashi;
  const d1Idx = SIGNS.indexOf(d1LagnaSign);

  const d9Num = Math.floor((chart.lagnaLon % 360) / (360 / 108)) % 12;
  const d9LagnaSign = SIGNS[d9Num] ?? "Aries";
  const d9Idx = SIGNS.indexOf(d9LagnaSign);

  function getD9HouseOfRashi(rashi: string): number {
    const rIdx = SIGNS.indexOf(rashi);
    if (rIdx < 0 || d9Idx < 0) return 1;
    return ((rIdx - d9Idx + 12) % 12) + 1;
  }

  // D1 Trik Houses: 6, 8, 12
  const d1H6Rashi = SIGNS[(d1Idx + 5) % 12];
  const d1H8Rashi = SIGNS[(d1Idx + 7) % 12];
  const d1H12Rashi = SIGNS[(d1Idx + 11) % 12];

  // D1 Wealth Houses: 2, 11
  const d1H2Rashi = SIGNS[(d1Idx + 1) % 12];
  const d1H11Rashi = SIGNS[(d1Idx + 10) % 12];

  const d9H_6 = getD9HouseOfRashi(d1H6Rashi);
  const d9H_8 = getD9HouseOfRashi(d1H8Rashi);
  const d9H_12 = getD9HouseOfRashi(d1H12Rashi);

  const d9H_2 = getD9HouseOfRashi(d1H2Rashi);
  const d9H_11 = getD9HouseOfRashi(d1H11Rashi);

  const DOMAINS: Record<number, string> = {
    1: "Identity & Physical Vitality",
    2: "Wealth Accumulation & Family Speech",
    3: "Effort, Sibling Dynamics & Courage",
    4: "Domestic Bliss, Vehicle & Home Sanctity",
    5: "Romance, Intelligence & Children",
    6: "Daily Routine, Debts & Micro-Critique",
    7: "Spousal Harmony & Business Partnership",
    8: "Sudden Transformations & In-law Relations",
    9: "Spiritual Fortune & Long Journeys",
    10: "Career Reputation & Social Authority",
    11: "Desire Fulfillment, Social Circles & Gains",
    12: "Bedroom Pleasure, Foreign Travel & Expenses",
  };

  const trikInD9 = [
    {
      d1House: 6,
      d1Rashi: d1H6Rashi,
      d9House: d9H_6,
      frictionDomain: `D1 6th House (${d1H6Rashi}) sits in D9 H${d9H_6}: Potential friction or micro-disputes around ${DOMAINS[d9H_6]}.`,
    },
    {
      d1House: 8,
      d1Rashi: d1H8Rashi,
      d9House: d9H_8,
      frictionDomain: `D1 8th House (${d1H8Rashi}) sits in D9 H${d9H_8}: Karmic deep transformation and hidden sensitivity in ${DOMAINS[d9H_8]}.`,
    },
    {
      d1House: 12,
      d1Rashi: d1H12Rashi,
      d9House: d9H_12,
      frictionDomain: `D1 12th House (${d1H12Rashi}) sits in D9 H${d9H_12}: Financial expenditure or detachment risks centered in ${DOMAINS[d9H_12]}.`,
    },
  ];

  const wealthInD9 = [
    {
      d1House: 2,
      d1Rashi: d1H2Rashi,
      d9House: d9H_2,
      growthDomain: `D1 2nd House (${d1H2Rashi}) falls in D9 H${d9H_2}: Marriage directly enriches ${DOMAINS[d9H_2]}.`,
    },
    {
      d1House: 11,
      d1Rashi: d1H11Rashi,
      d9House: d9H_11,
      growthDomain: `D1 11th House (${d1H11Rashi}) falls in D9 H${d9H_11}: Key source of marital desire fulfillment and expansion through ${DOMAINS[d9H_11]}.`,
    },
  ];

  const synthesis = `D1 Trik rashis manifest in D9 houses ${d9H_6}, ${d9H_8}, ${d9H_12}. Meanwhile, D1 Dhana/Labha rashis empower D9 houses ${d9H_2} & ${d9H_11}, creating post-marital financial and social elevation.`;

  return {
    trikInD9,
    wealthInD9,
    synthesis,
  };
}

// ── Master Evaluator Function ────────────────────────────────────────────────

export function evaluateMarriageIntelligence(chart: ChartData): MarriageIntelligenceReport {
  // 1. Run KP Engine to obtain KP Cusps and Planets with Placidus geometry
  const kpResult = runKPEngine(chart);
  const cusp7 = kpResult.cusps.find((c) => c.house === 7) || kpResult.cusps[6];

  // Identify 7th Cusp Sub-Lord
  const cusp7SubLord = cusp7?.subLord || "Venus";
  const subLordRow = kpResult.rows.find((r) => r.name === cusp7SubLord);

  // Identify Nakshatra Lord of 7th Sub-Lord
  const starLordOfSubLord = subLordRow?.starLord || "Ketu";
  const starLordRow = kpResult.rows.find((r) => r.name === starLordOfSubLord);
  const starLordHouse = starLordRow?.bhavaHouse || starLordRow?.house || 7;

  // Evaluate Meeting Context (Section 6 of Lecture)
  const meetingMeta = MEETING_CONTEXT_MAP[starLordHouse] || MEETING_CONTEXT_MAP[7];
  const meetingContext: MeetingContextResult = {
    house: starLordHouse,
    circumstance: meetingMeta.circumstance,
    partnerNature: meetingMeta.partnerNature,
    caution: meetingMeta.caution,
    sourceStarLord: starLordOfSubLord,
    starLordHouse,
  };

  // Evaluate 7th Rashi Impact (Section 7 of Lecture)
  const d1LagnaNum = chart.lagnaNum ?? 0;
  const d1SeventhRashiNum = ((d1LagnaNum + 6) % 12) + 1; // 1-indexed Rashi
  const rashiImpactMeta = RASHI_7TH_IMPACT_MAP[d1SeventhRashiNum] || RASHI_7TH_IMPACT_MAP[1];
  const rashiImpact: Rashi7thImpactResult = {
    signNumber: d1SeventhRashiNum,
    signName: RASHIS[d1SeventhRashiNum - 1],
    lifeDomainActivated: rashiImpactMeta.domain,
    behavioralDynamics: rashiImpactMeta.dynamics,
    warningOrRemedy: rashiImpactMeta.caution,
  };

  // Evaluate D9 Navamsha 4 Pillars (1, 4, 7, 12)
  const d9LagnaSignNum = getNavamshaSignNum(chart.lagnaLon);
  const d9LagnaSign = RASHIS[d9LagnaSignNum];

  // Map each planet into its D9 house relative to D9 Lagna
  const d9HousePlanets: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };

  Object.entries(chart.planets).forEach(([pName, pData]) => {
    const pD9SignNum = getNavamshaSignNum(pData.lon);
    const d9House = ((pD9SignNum - d9LagnaSignNum + 12) % 12) + 1;
    if (d9HousePlanets[d9House]) {
      d9HousePlanets[d9House].push(pName);
    }
  });

  function auditD9Pillar(houseNum: number, label: string): D9HouseAffliction {
    const signNum = (d9LagnaSignNum + houseNum - 1) % 12;
    const signName = RASHIS[signNum];
    const occupants = d9HousePlanets[houseNum] || [];

    const hasSun = occupants.includes("Sun");
    const hasMars = occupants.includes("Mars");
    const hasKetu = occupants.includes("Ketu");
    const hasRahu = occupants.includes("Rahu");
    const hasSaturn = occupants.includes("Saturn");
    const hasMoon = occupants.includes("Moon");
    const hasVenus = occupants.includes("Venus");
    const hasJupiter = occupants.includes("Jupiter");

    let severity: "clean" | "mild" | "moderate" | "severe" = "clean";
    const notes: string[] = [];

    if (houseNum === 12) {
      if ((hasSun && hasMars) || (hasMars && hasKetu) || (hasSun && hasKetu)) {
        severity = "severe";
        notes.push("Strong physical/emotional bedroom distance or distinct sleeping spaces (Sun/Mars/Ketu in D9 H12).");
      } else if (hasSun || hasMars || hasKetu) {
        severity = "moderate";
        notes.push("Ego clash or fiery tension causing periodic bedroom detachment (Sun/Mars/Ketu in D9 H12).");
      } else if (hasSaturn) {
        severity = "mild";
        notes.push("Reserved or delayed intimacy; disciplined bedroom habits.");
      } else {
        notes.push("Harmonious, undisturbed private quarters.");
      }
    } else if (houseNum === 4) {
      if (hasMars && hasRahu) {
        severity = "severe";
        notes.push("Volatile, explosive temperaments ('atom-bomb' clashes) disturbing domestic serenity.");
      } else if (hasMars) {
        severity = "moderate";
        notes.push("Commanding, domineering atmosphere within the home.");
      } else if (hasRahu) {
        severity = "mild";
        notes.push("Illusions, high expectations, or restless domestic environment.");
      } else {
        notes.push("Stable, peaceful domestic sanctuary.");
      }
    } else if (houseNum === 7) {
      if (hasMars && hasRahu) {
        severity = "severe";
        notes.push("Sudden friction and intense partnership power struggles.");
      } else if (hasSaturn && hasKetu) {
        severity = "moderate";
        notes.push("Renunciation tendencies or emotional detachment from partner.");
      } else if (hasSaturn) {
        severity = "mild";
        notes.push("Partner is mature, dutiful, and establishes rock-solid fortress-like boundaries.");
      } else {
        notes.push("Balanced partner disposition.");
      }
    } else {
      // House 1 (Lagna in D9)
      if (hasSun || hasMars) {
        severity = "moderate";
        notes.push("Native becomes more assertive, authoritative, or ego-conscious post-marriage.");
      } else if (hasMoon || hasVenus || hasJupiter) {
        severity = "clean";
        notes.push("Pleasant, adaptable, and graceful marital demeanor.");
      } else {
        notes.push("Balanced self-expression.");
      }
    }

    return {
      house: houseNum,
      sign: signName,
      planets: occupants,
      severity,
      interpretation: notes.join(" "),
    };
  }

  const h1Audit = auditD9Pillar(1, "Native Mindset");
  const h4Audit = auditD9Pillar(4, "Marital Peace");
  const h7Audit = auditD9Pillar(7, "Spouse Nature");
  const h12Audit = auditD9Pillar(12, "Bedroom Bliss");

  let bedroomStatus: D9MarriageAuditResult["bedroomBlissStatus"] = "harmonious";
  if (h12Audit.severity === "severe") bedroomStatus = "separate_bedrooms_risk";
  else if (h12Audit.severity === "moderate") bedroomStatus = "strained";
  else if (h12Audit.severity === "clean" && (h12Audit.planets.includes("Venus") || h12Audit.planets.includes("Jupiter"))) {
    bedroomStatus = "excellent";
  }

  const explosiveTemperament =
    (h4Audit.planets.includes("Mars") && h4Audit.planets.includes("Rahu")) ||
    (h7Audit.planets.includes("Mars") && h7Audit.planets.includes("Rahu"));

  const d9Audit: D9MarriageAuditResult = {
    d9LagnaSign,
    pillars: {
      h1NativeMindset: h1Audit,
      h4MaritalPeace: h4Audit,
      h7SpouseNature: h7Audit,
      h12BedroomBliss: h12Audit,
    },
    bedroomBlissStatus: bedroomStatus,
    explosiveTemperamentRisk: explosiveTemperament,
    overallD9Verdict:
      bedroomStatus === "separate_bedrooms_risk"
        ? "Caution: Malefic afflictions in D9 12th house require active mutual adjustments to maintain bedroom intimacy."
        : explosiveTemperament
        ? "Caution: Mars-Rahu in domestic angle warrants anger management and grounding remedies."
        : "Favorable D9 Navamsha structural alignment for marital longevity.",
  };

  // Evaluate Dual / Second Marriage (Section 10 of Lecture)
  const subLordPlanetData = chart.planets[cusp7SubLord];
  const subLordSignNum = subLordPlanetData?.signNum ?? 0;
  const subLordInDual = DUAL_SIGNS.includes(subLordSignNum + 1);

  const starLordPlanetData = chart.planets[starLordOfSubLord];
  const starLordSignNum = starLordPlanetData?.signNum ?? 0;
  const starLordInDual = DUAL_SIGNS.includes(starLordSignNum + 1);
  const mercuryInvolved =
    (cusp7SubLord as string) === "Mercury" ||
    (starLordOfSubLord as string) === "Mercury" ||
    ((subLordRow as unknown as { subLordHouse?: number })?.subLordHouse === 9 && (cusp7SubLord as string) === "Mercury");

  const hasDualPromise = subLordInDual && (starLordInDual || mercuryInvolved);
  const dualMarriage: DualMarriageResult = {
    hasDualSignPromise: hasDualPromise,
    subLordInDualSign: subLordInDual,
    starLordInDualSignOrMercury: starLordInDual || mercuryInvolved,
    seventhSubLord: cusp7SubLord,
    subLordSign: subLordPlanetData?.sign || "Unknown",
    starLord: starLordOfSubLord,
    mercuryInvolvement: mercuryInvolved,
    notes: hasDualPromise
      ? "7th Cusp Sub-Lord is located in a Dual Sign (3/6/9/12) with dual Star Lord or Mercury connection, opening the gateway for secondary marriage evaluation via the 9th house."
      : "Single enduring marriage structure promised at the 7th cuspal sub-lord tier.",
  };

  // Evaluate Sanyas / Denial (Saturn + Ketu in 1st/7th, Ketu in 1st/12th)
  const planetsIn1st = Object.entries(chart.planets).filter(([_, p]) => p.house === 1).map(([n]) => n);
  const planetsIn7th = Object.entries(chart.planets).filter(([_, p]) => p.house === 7).map(([n]) => n);
  const planetsIn12th = Object.entries(chart.planets).filter(([_, p]) => p.house === 12).map(([n]) => n);

  const satKetu7th = planetsIn7th.includes("Saturn") && planetsIn7th.includes("Ketu");
  const satKetu1st = planetsIn1st.includes("Saturn") && planetsIn1st.includes("Ketu");
  const ketu1or12 = planetsIn1st.includes("Ketu") || planetsIn12th.includes("Ketu");

  const activeMD = chart.dashas?.find((d) => d.active)?.planet;
  const activeSanyasDasha = activeMD === "Saturn" || activeMD === "Ketu";

  const denialIndicated = (satKetu7th || satKetu1st) && activeSanyasDasha;
  const sanyasDenial: SanyasDenialResult = {
    denialIndicated,
    saturnKetu7thOr1st: satKetu7th || satKetu1st,
    ketu1stOr12th: ketu1or12,
    activeSanyasDasha,
    interpretation: satKetu7th
      ? "Saturn + Ketu in the 7th house: Partner chosen will be detached from superficial appearances and deeply spiritual/genuine. Guard against emotional disengagement."
      : satKetu1st
      ? "Saturn + Ketu in the 1st house: Native possesses philosophical ascetic inclinations (*Vairagya*), requiring conscious desire cultivation for matrimony."
      : "No renunciation or strict marital denial signatures detected.",
  };

  // Evaluate Sexual Dissatisfaction / Orientation (Saturn + Mercury + Venus in 5/7/12)
  const satH = chart.planets["Saturn"]?.house;
  const merH = chart.planets["Mercury"]?.house;
  const venH = chart.planets["Venus"]?.house;

  const satVenMerConj = satH && merH && venH && satH === merH && merH === venH;
  const inSensitiveHouse = satH === 5 || satH === 7 || satH === 12;

  // Check trinal relationship between Saturn, Mercury, Venus
  const trineRel =
    satH && merH && venH &&
    ((satH - merH + 12) % 4 === 0) &&
    ((merH - venH + 12) % 4 === 0);

  const intimacyAfflicted = Boolean((satVenMerConj || trineRel) && inSensitiveHouse);
  const intimacyAudit: IntimacyOrientationResult = {
    afflictionDetected: intimacyAfflicted,
    involvedPlanets: ["Saturn", "Mercury", "Venus"],
    involvedHouses: [satH || 0, merH || 0, venH || 0].filter(Boolean),
    vastuZone: "NNW (North-North-West: Zone of Attraction & Intimacy)",
    interpretation: intimacyAfflicted
      ? "Saturn + Mercury + Venus combined influence across houses 5/7/12 indicates physical dissatisfaction, atypical attraction dynamics, or libido fluctuations. Clear the NNW Astro-Vastu zone of electronic clutter."
      : "Standard intimacy and attraction vectors active.",
  };

  // Evaluate Punarbu / Punarphoo Yoga (Dr. Veluchamy & Karuna Moorthy 2022)
  const punarbuYoga = detectPunarbuYoga(chart, kpResult);

  // Evaluate Separative Influences (Sun, Saturn, Rahu, Ketu, 12L)
  const separativeAudit = evaluateSeparativeInfluences(chart);

  // Evaluate Barren Signs (Gemini, Leo, Virgo on Lagna/7th/Venus)
  const barrenAudit = evaluateBarrenSigns(chart);

  // Calculate Spouse Direction
  const marriageDirection = calculateMarriageDirection(chart, "male");

  // D1 to D9 Cross-Mapping (Trik & Wealth rashis in D9 houses)
  const d1ToD9Mapping = mapD1toD9CrossImpact(chart);

  // Compile Practical Remedies (Section 11 of Lecture & Research Paper)
  const remedies: MarriageRemedyItem[] = [];

  // Universal Shivalinga worship (always applicable for marriage harmony)
  remedies.push({
    category: "Universal",
    title: "Shivalinga Temple Abhishekam",
    procedure: "Visit a consecrated Shiva temple on Mondays. Offer raw milk and clean water to the Shivalinga while chanting 'Om Namah Shivaya'.",
    caution: "STRICT WARNING: Never keep a Shivalinga or consecrated idol inside the household temple, as residential homes cannot uphold temple-grade ritual consecration.",
    astrologicalRationale: "The 7th house and marital union are energized and purified by Lord Shiva's unconditioned divine balance.",
  });

  // Punarbu Yoga Remedy
  if (punarbuYoga.detected) {
    remedies.push({
      category: "Punarbu",
      title: "Shivalinga Jalabhisheka & Solid Silver Glass (Punarbu Remedy)",
      procedure: punarbuYoga.remedy,
      caution: "Maintain calm resolve; avoid premature panic or abrupt cancellation of matrimonial talks during minor communication lags.",
      astrologicalRationale: "Saturn-Moon connection induces emotional hesitation; worship of Lord Shiva directly harmonizes Chandra (Moon) and Shani (Saturn).",
    });
  }

  // Separative Influences Remedy
  if (separativeAudit.totalSeparativeScore >= 3) {
    remedies.push({
      category: "Separative",
      title: "Grounding & Astro-Vastu Harmonization",
      procedure: "Place a brass or copper vessel with fresh water and flowers in the Northeast (Ishanya) corner. Both partners should consciously establish weekly communication check-ins.",
      astrologicalRationale: "Neutralizes separative tendencies of Sun/Saturn/Rahu across marital pillars (houses 4, 7, 10, 12).",
    });
  }

  // Mars Affliction / Manglik / D9 H4 or H12
  if (h4Audit.planets.includes("Mars") || h12Audit.planets.includes("Mars") || chart.planets["Mars"]?.house === 7) {
    remedies.push({
      category: "Mars",
      title: "Earth Element Burial & Cast Metal Kada",
      procedure: "Take an earthen pot, fill it with whole red lentils (Masoor Dal), dried red chilies, and pure honey. Tie with a clean red cloth and bury in virgin earth on a Tuesday. Additionally, wear a solid cast metal bracelet (Kada) with an inserted pure copper wire on the working hand.",
      astrologicalRationale: "Mars rules fiery aggression; burying it in the earth (Houses 2, 6, 10 earth triplicity) channels and grounds volatile excess energy.",
    });
  }

  // Moon Afflicted
  const moonData = chart.planets["Moon"];
  if (moonData?.dignity === "Debilitated" || planetsIn1st.includes("Moon") || moonData?.house === 6 || moonData?.house === 8) {
    remedies.push({
      category: "Moon",
      title: "Solid Silver Glass & Sandalwood Application",
      procedure: "Drink water and milk exclusively from a solid silver tumbler. Apply natural white sandalwood paste (Chandan) to the forehead daily upon waking.",
      astrologicalRationale: "Empowers the Lagna Lord and lunar emotional fortitude, stabilizing mood swings and emotional reactivity in marriage.",
    });
  }

  // Combust or Afflicted Venus
  const sunLon = chart.planets["Sun"]?.lon ?? 0;
  const venLon = chart.planets["Venus"]?.lon ?? 0;
  const venDiff = Math.abs(sunLon - venLon);
  const isVenCombust = venDiff <= 10 || venDiff >= 350;

  if (isVenCombust || h12Audit.severity !== "clean") {
    remedies.push({
      category: "Venus",
      title: "Curd Bath & WSW Floral Astro-Vastu Cure",
      procedure: "Bathe with fresh curd (yogurt) every Friday morning. In the West-South-West (WSW) zone of the home, hang a framed artwork depicting vibrant multi-colored flowers. Place high-grade branded perfumes beneath this artwork and apply daily.",
      astrologicalRationale: "Restores Venusian glow, aesthetic charm, and romantic vitality when depleted by combustion or 12th house distress.",
    });
  }

  // Combust or Afflicted Mercury
  const merLon = chart.planets["Mercury"]?.lon ?? 0;
  const merDiff = Math.abs(sunLon - merLon);
  const isMerCombust = merDiff <= 14 || merDiff >= 346;

  if (isMerCombust || starLordOfSubLord === "Mercury") {
    remedies.push({
      category: "Mercury",
      title: "Green Cardamom & Living Greenery",
      procedure: "Chew whole green cardamom regularly throughout the day. Introduce vibrant green foliage and potted plants in the living quarters. Dedicate time to reading books and eating fresh green salads.",
      astrologicalRationale: "Sharpens communicative empathy, dissolves fault-finding tendencies, and restores intellectual clarity.",
    });
  }

  // Sun in 12th House (D1 or D9)
  if (planetsIn12th.includes("Sun") || h12Audit.planets.includes("Sun")) {
    remedies.push({
      category: "Sun",
      title: "Surya Arghya & Worship of Lord Rama",
      procedure: "Offer fresh water to the rising morning Sun using a pure copper vessel (Arghya). Recite the Aditya Hridaya Stotram or offer daily prayers to Lord Rama.",
      astrologicalRationale: "Neutralizes ego friction and authority clashes, transforming solar heat into humble devotion and mutual respect.",
    });
  }

  // Unfulfilled Desires (Saturn-Ketu or weak 11th)
  if (chart.planets["Saturn"]?.house === 11 || planetsIn7th.includes("Saturn") || sanyasDenial.saturnKetu7thOr1st) {
    remedies.push({
      category: "Desire_Fulfillment",
      title: "Morning Empty-Stomach Banana Remedy",
      procedure: "Consume one ripe fresh banana every morning on a completely empty stomach.",
      astrologicalRationale: "Activates Jupiterian benefic nutrition to unblock stagnant desires and stimulate the fruition of 11th house fruits.",
    });
  }

  const executiveSummary = [
    `7th Cusp Sub-Lord is **${cusp7SubLord}**, situated in the Star of **${starLordOfSubLord}** (Bhava ${starLordHouse}).`,
    `**Meeting Circumstances**: ${meetingContext.circumstance}`,
    `**7th Rashi Manifestation**: ${rashiImpact.signName} (House 7) activates **${rashiImpact.lifeDomainActivated}**.`,
    `**Navamsha D9 Audit**: D9 Lagna is **${d9LagnaSign}**. Bedroom bliss index: **${bedroomStatus}**.`,
    punarbuYoga.detected
      ? `**Punarbu Alert**: ${punarbuYoga.effects}`
      : `**Punarbu Status**: Clear (no Saturn-Moon delay yoga).`,
    `**Spouse Direction Vector**: ${marriageDirection.primaryDirectionHindi}.`,
    d9Audit.overallD9Verdict,
  ].join(" ");

  return {
    meetingContext,
    rashiImpact,
    d9Audit,
    dualMarriage,
    sanyasDenial,
    intimacyAudit,
    punarbuYoga,
    separativeAudit,
    barrenAudit,
    marriageDirection,
    d1ToD9Mapping,
    remedies,
    executiveSummary,
  };
}
