// ============================================================
// ASTROLIFE FAMILY & RELATIONSHIP MEDICAL EVENT ENGINE v2.0
// Ported from: MED/astrolife_medical_relationship_engine.py
// Principles: Bhavat Bhavam (Derived Houses), Vedic Aspects,
//             Dasha (MD/AD/PD) Convergence, Karaka Vulnerability,
//             Future Transit Window Scanning, Medical Safe Tone
// ============================================================

import { type ChartData, type PlanetData, computePlanets, getJD } from "./calculations";
import { getCurrentDashaHierarchy5Levels, getNakshatraFromLongitude, NAVTARA } from "./dasha";

export type FamilyMemberKey =
  | "Self"
  | "Father"
  | "Mother"
  | "Spouse"
  | "Children"
  | "Younger sibling"
  | "Elder sibling";

export interface RelationshipConfig {
  name: FamilyMemberKey;
  primaryHouse: number;
  karaka: string;
  hindiTitle: string;
  description: string;
}

export interface DerivedHealthHouses {
  "1": number;  // Physical vitality / Ascendant of relationship
  "2": number;  // Primary Maraka Sthana (2nd House)
  "6": number;  // Acute disease / inflammation
  "7": number;  // Primary Maraka Sthana (7th House)
  "8": number;  // Chronic vulnerability / longevity
  "12": number; // Hospitalization / recuperation
}

export interface HitRecord {
  relationship: string;
  layer: "Dasha" | "Transit" | "Transit Aspect" | "Karaka Transit" | "Karaka Aspect" | "Dignity" | "Research hypothesis" | "Marakesh Dasha" | "Vyaya Dasha" | "Roga Dasha" | "Ayu/Crisis Dasha" | "Maraka-12H Exit Convergence";
  planet: string;
  reason: string;
  score: number;
  targetHouses: number[];
}

export interface FamilyMedicalScanResult {
  memberKey: FamilyMemberKey;
  memberTitle: string;
  hindiTitle: string;
  primaryHouse: number;
  karaka: string;
  derivedHouses: DerivedHealthHouses;
  activeDasha: {
    mahadasha: string;
    antardasha: string;
    pratyantar?: string;
  };
  score: number;
  windowLabel: "Extreme Maraka & Critical Emergency Alert" | "High-convergence research alert" | "Moderate signal" | "Background / low signal";
  hits: HitRecord[];
  layersActive: string[];
  keyPrecautions: string[];
  traditionalUpays: string[];
  summaryMessage: string;
}

export interface FutureHealthWindow {
  startDate: string;
  endDate: string;
  memberKey: FamilyMemberKey;
  score: number;
  label: "Extreme Maraka & Critical Emergency Alert" | "High-convergence research alert" | "Moderate signal" | "Background / low signal";
  triggerSummary: string;
  actionablePrecaution: string;
}

// ── Default Family Relationships Definition ─────────────────────────────
export const FAMILY_RELATIONSHIPS: Record<FamilyMemberKey, RelationshipConfig> = {
  Self: {
    name: "Self",
    primaryHouse: 1,
    karaka: "Sun",
    hindiTitle: "स्वयं (Self)",
    description: "Physical body, overall stamina, core immunity, and vital longevity.",
  },
  Father: {
    name: "Father",
    primaryHouse: 9,
    karaka: "Sun",
    hindiTitle: "पिता (Father)",
    description: "Father's physical vitality (9H), paternal health challenges (2H), and longevity (4H).",
  },
  Mother: {
    name: "Mother",
    primaryHouse: 4,
    karaka: "Moon",
    hindiTitle: "माता (Mother)",
    description: "Mother's physical constitution (4H), maternal ailments (9H), and chronic recovery (11H).",
  },
  Spouse: {
    name: "Spouse",
    primaryHouse: 7,
    karaka: "Venus",
    hindiTitle: "जीवनसाथी (Spouse / Partner)",
    description: "Partner's general constitution (7H), health vulnerabilities (12H), and acute stress (2H).",
  },
  Children: {
    name: "Children",
    primaryHouse: 5,
    karaka: "Jupiter",
    hindiTitle: "संतान (Children)",
    description: "Progeny vitality (5H), children's seasonal illnesses (10H), and recuperation (12H).",
  },
  "Younger sibling": {
    name: "Younger sibling",
    primaryHouse: 3,
    karaka: "Mars",
    hindiTitle: "छोटा भाई/बहन (Younger Sibling)",
    description: "Younger sibling constitution (3H), acute strain (8H), and chronic fatigue (10H).",
  },
  "Elder sibling": {
    name: "Elder sibling",
    primaryHouse: 11,
    karaka: "Jupiter",
    hindiTitle: "बड़ा भाई/बहन (Elder Sibling)",
    description: "Elder sibling constitution (11H), ailments (4H), and chronic health patterns (6H).",
  },
};

// ── Weights from astrolife_medical_relationship_engine.py ──────────────
const WEIGHTS = {
  maraka_dual_md: 22,
  maraka_dual_ad: 18,
  maraka_dual_pd: 12,
  maraka_single_md: 12,
  maraka_single_ad: 10,
  maraka_single_pd: 6,
  maraka_12_exit_convergence: 16,
  dasha_primary: 8,
  dasha_6: 6,
  dasha_8: 9,
  dasha_12: 8,
  malefic_in_6_8_12: 6,
  malefic_aspect_6_8_12: 5,
  karaka_8: 5,
  combust_dasha: 3,
  convergence_bonus: 10,
  mars_rahu_accident_hypothesis: 8,
  mercury_neuro_hypothesis: 8,
  saturn_severity_hypothesis: 6,
};

// Vedic Aspect Helper
const VEDIC_ASPECTS: Record<string, number[]> = {
  Sun: [7], Moon: [7], Mercury: [7], Venus: [7],
  Mars: [4, 7, 8],
  Jupiter: [5, 7, 9],
  Saturn: [3, 7, 10],
  Rahu: [5, 7, 9],
  Ketu: [5, 7, 9],
};

function aspectsHouse(planet: string, sourceHouse: number, targetHouse: number): boolean {
  const dist = ((targetHouse - sourceHouse + 12) % 12) + 1;
  const list = VEDIC_ASPECTS[planet] || [7];
  return list.includes(dist);
}

// Derived Houses Calculator
export function calculateDerivedHouses(primaryHouse: number): DerivedHealthHouses {
  return {
    "1": primaryHouse,
    "2": ((primaryHouse - 1 + 1) % 12) + 1,
    "6": ((primaryHouse - 1 + 5) % 12) + 1,
    "7": ((primaryHouse - 1 + 6) % 12) + 1,
    "8": ((primaryHouse - 1 + 7) % 12) + 1,
    "12": ((primaryHouse - 1 + 11) % 12) + 1,
  };
}

const SIGN_LORDS: Record<number, string> = {
  0: "Mars", 1: "Venus", 2: "Mercury", 3: "Moon",
  4: "Sun", 5: "Mercury", 6: "Venus", 7: "Mars",
  8: "Jupiter", 9: "Saturn", 10: "Saturn", 11: "Jupiter",
};

// House Signification map from chart (Ruler + Occupant)
function buildSignificationMap(chart: ChartData): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  const lagnaNum = chart.lagnaNum;
  const planets = chart.planets;

  const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  PLANET_NAMES.forEach(p => {
    const houses = new Set<number>();
    if (planets[p]) {
      houses.add(planets[p].house);
    }
    // Rulerships
    for (let h = 1; h <= 12; h++) {
      const sNum = (lagnaNum + (h - 1)) % 12;
      if (SIGN_LORDS[sNum] === p) {
        houses.add(h);
      }
    }
    result[p] = Array.from(houses).sort((a, b) => a - b);
  });

  return result;
}

// ── Core Relationship Health Scanner ───────────────────────────────────
export function scanFamilyMemberHealth(
  chart: ChartData,
  memberKey: FamilyMemberKey,
  targetDate: Date = new Date(),
  transitOverrides?: Record<string, { house: number; lon: number }>
): FamilyMedicalScanResult {
  const config = FAMILY_RELATIONSHIPS[memberKey] || FAMILY_RELATIONSHIPS.Self;
  const derived = calculateDerivedHouses(config.primaryHouse);
  const significations = buildSignificationMap(chart);
  const planets = chart.planets;

  // Active Dasha with full 3-level calculation
  let mdPlanet = "Mars";
  let adPlanet = "Mars";
  let pdPlanet: string | undefined = undefined;

  try {
    const birthDate = new Date(`${chart.dob}T${chart.tob}`);
    const moonNak = getNakshatraFromLongitude(chart.planets.Moon.lon);
    const dHierarchy = getCurrentDashaHierarchy5Levels(birthDate, moonNak, targetDate);
    mdPlanet = dHierarchy.mahadasha.lord;
    adPlanet = dHierarchy.antardasha.lord;
    pdPlanet = dHierarchy.pratyantardasha.lord;
  } catch {
    const activeMD = chart.dashas?.find(d => d.start <= targetDate && d.end > targetDate);
    const activeAD = chart.antardasha?.find(d => d.start <= targetDate && d.end > targetDate);
    mdPlanet = activeMD?.planet || "Moon";
    adPlanet = activeAD?.planet || "Mars";
  }

  // Active Transits: use provided overrides or compute accurate sidereal transits for targetDate
  let activeTransits: Record<string, { house: number; lon: number }> = transitOverrides || {};
  if (!transitOverrides) {
    try {
      const dateStr = targetDate.toISOString().split("T")[0];
      const jd = getJD(dateStr, "12:00", chart.tz ?? 5.5);
      const raw = computePlanets(jd);
      const lagnaSign = chart.lagnaNum;
      activeTransits = {};
      Object.entries(raw).forEach(([p, lon]) => {
        const pSign = Math.floor(lon / 30);
        const h = ((pSign - lagnaSign + 12) % 12) + 1;
        activeTransits[p] = { house: h, lon };
      });
    } catch {
      activeTransits = {};
      Object.entries(planets).forEach(([p, pd]) => {
        activeTransits[p] = { house: pd.house, lon: pd.lon };
      });
    }
  }

  const hits: HitRecord[] = [];

  // Identify relationship house lords per Parashari Bhavat Bhavam
  const lagnaNum = chart.lagnaNum;
  const getLordOfHouse = (h: number) => {
    const signIdx = (lagnaNum + h - 1) % 12;
    return SIGN_LORDS[signIdx];
  };

  const maraka2Lord = getLordOfHouse(derived["2"]);
  const maraka7Lord = getLordOfHouse(derived["7"]);
  const lagnaLord = getLordOfHouse(derived["1"]);
  const rogaLord = getLordOfHouse(derived["6"]);
  const ayuLord = getLordOfHouse(derived["8"]);
  const vyayaLord = getLordOfHouse(derived["12"]);

  let hasDualMarakaActive = false;
  let hasSingleMarakaActive = false;
  let has12HActive = false;

  // Layer 1: Dasha Significations (MD, AD, PD) with Marakesh Priority
  const dashaLevels: { lord: string; level: string; weightMul: number }[] = [
    { lord: mdPlanet, level: "MD", weightMul: 1.0 },
    { lord: adPlanet, level: "AD", weightMul: 0.8 },
  ];
  if (pdPlanet) {
    dashaLevels.push({ lord: pdPlanet, level: "PD", weightMul: 0.6 });
  }

  dashaLevels.forEach(({ lord, level, weightMul }) => {
    const isDual = lord === maraka2Lord && lord === maraka7Lord;
    const isSingle = (lord === maraka2Lord || lord === maraka7Lord) && !isDual;

    // 1. Classical Maraka Evaluation (Highest Priority)
    if (isDual) {
      hasDualMarakaActive = true;
      const pts = Math.round(WEIGHTS.maraka_dual_md * weightMul);
      hits.push({
        relationship: config.name,
        layer: "Marakesh Dasha",
        planet: lord,
        reason: `${level} ${lord} is PARAM DUAL MARAKA (rules BOTH 2H & 7H Maraka Sthanas) for ${config.name} — Extreme life-threatening / emergency trauma indicator`,
        score: pts,
        targetHouses: [derived["2"], derived["7"]],
      });
    } else if (isSingle) {
      hasSingleMarakaActive = true;
      const pts = lord === vyayaLord ? Math.round(10 * weightMul) : Math.round(WEIGHTS.maraka_single_md * weightMul);
      hits.push({
        relationship: config.name,
        layer: "Marakesh Dasha",
        planet: lord,
        reason: `${level} ${lord} is Maraka Lord (rules Maraka Sthana) for ${config.name} — acute physical crisis & vitality endangerment`,
        score: pts,
        targetHouses: [lord === maraka2Lord ? derived["2"] : derived["7"]],
      });
    }

    // 2. 12th House (Vyaya / Hospitalization / Exit)
    if (lord === vyayaLord) {
      has12HActive = true;
      hits.push({
        relationship: config.name,
        layer: "Vyaya Dasha",
        planet: lord,
        reason: `${level} ${lord} signifies ${config.name}'s hospitalization/life-exit house H${derived["12"]}`,
        score: Math.round(WEIGHTS.dasha_12 * weightMul),
        targetHouses: [derived["12"]],
      });
    }

    // 3. 8th House (Ayu / Longevity & Chronic Crisis)
    if (lord === ayuLord) {
      hits.push({
        relationship: config.name,
        layer: "Ayu/Crisis Dasha",
        planet: lord,
        reason: `${level} ${lord} is 8th Lord (Randhra / Longevity & Sudden Crisis) for ${config.name}`,
        score: Math.round(WEIGHTS.dasha_8 * weightMul),
        targetHouses: [derived["8"]],
      });
    }

    // 4. 6th House (Roga / Acute Disease & Inflammation)
    if (lord === rogaLord) {
      hits.push({
        relationship: config.name,
        layer: "Roga Dasha",
        planet: lord,
        reason: `${level} ${lord} is 6th Lord (Roga / Acute Disease & Inflammation) for ${config.name}`,
        score: Math.round(WEIGHTS.dasha_6 * weightMul),
        targetHouses: [derived["6"]],
      });
    }

    if (planets[lord]?.dignity === "Debilitated") {
      hits.push({
        relationship: config.name,
        layer: "Dignity",
        planet: lord,
        reason: `Active Dasha lord ${lord} is in debilitated dignity`,
        score: WEIGHTS.combust_dasha,
        targetHouses: [],
      });
    }
  });

  // Maraka + 12H Exit Convergence (Extreme Fatal ICU Pattern)
  if (hasDualMarakaActive && (has12HActive || (activeTransits[pdPlanet || ""]?.house === derived["12"]))) {
    hits.push({
      relationship: config.name,
      layer: "Maraka-12H Exit Convergence",
      planet: mdPlanet,
      reason: `Param Dual Maraka Lord + 12th House (Hospitalization / Exit) active simultaneously for ${config.name} — Extreme critical emergency / ICU candidate`,
      score: WEIGHTS.maraka_12_exit_convergence,
      targetHouses: [derived["2"], derived["7"], derived["12"]],
    });
  }

  // Layer 1b: Navtara Vulnerability
  try {
    const moonNak = getNakshatraFromLongitude(chart.planets.Moon.lon);
    [mdPlanet, adPlanet, ...(pdPlanet ? [pdPlanet] : [])].forEach(lord => {
      const pLon = planets[lord]?.lon ?? 0;
      const pNak = getNakshatraFromLongitude(pLon);
      const diff = ((pNak.index - moonNak.index) % 9 + 9) % 9;
      const tara = NAVTARA[diff];
      if (tara.name === "Naidhana" || tara.name === "Vipat") {
        hits.push({
          relationship: config.name,
          layer: "Dasha",
          planet: lord,
          reason: `Dasha lord ${lord} in ${tara.name} Tara (${tara.meaning}): Acute vulnerability alignment`,
          score: tara.name === "Naidhana" ? 7 : 5,
          targetHouses: [derived["8"]],
        });
      }
    });
  } catch {
    // ignore
  }

  // Layer 2: Malefic Influences on Derived 6/8/12 (Transits)
  const malefics = ["Mars", "Saturn", "Rahu", "Ketu"];
  const targetDusthanas = [derived["6"], derived["8"], derived["12"]];

  malefics.forEach(mal => {
    const pos = activeTransits[mal];
    if (!pos) return;

    if (targetDusthanas.includes(pos.house)) {
      hits.push({
        relationship: config.name,
        layer: "Transit",
        planet: mal,
        reason: `${mal} occupies ${config.name}'s derived dusthana H${pos.house}`,
        score: WEIGHTS.malefic_in_6_8_12,
        targetHouses: [pos.house],
      });
    }

    targetDusthanas.forEach(targetH => {
      if (aspectsHouse(mal, pos.house, targetH)) {
        hits.push({
          relationship: config.name,
          layer: "Transit Aspect",
          planet: mal,
          reason: `${mal} casts Vedic aspect → ${config.name}'s derived house H${targetH}`,
          score: WEIGHTS.malefic_aspect_6_8_12,
          targetHouses: [targetH],
        });
      }
    });
  });

  // Layer 3: Relationship Karaka to Derived 8H
  if (config.karaka && planets[config.karaka]) {
    const kPos = activeTransits[config.karaka] || { house: planets[config.karaka].house, lon: planets[config.karaka].lon };
    if (kPos.house === derived["8"]) {
      hits.push({
        relationship: config.name,
        layer: "Karaka Transit",
        planet: config.karaka,
        reason: `Natural karaka ${config.karaka} occupies ${config.name}'s derived 8H H${derived["8"]}`,
        score: WEIGHTS.karaka_8,
        targetHouses: [derived["8"]],
      });
    }
    if (aspectsHouse(config.karaka, kPos.house, derived["8"])) {
      hits.push({
        relationship: config.name,
        layer: "Karaka Aspect",
        planet: config.karaka,
        reason: `Natural karaka ${config.karaka} aspects ${config.name}'s derived 8H H${derived["8"]}`,
        score: WEIGHTS.karaka_8,
        targetHouses: [derived["8"]],
      });
    }
  }

  // Layer 4: Father Clinical Research Hypotheses
  if (config.name === "Father") {
    const marsPos = activeTransits["Mars"];
    const rahuPos = activeTransits["Rahu"];
    const mercPos = activeTransits["Mercury"];
    const satPos = activeTransits["Saturn"];

    // 1. Mars acute accident trigger
    if (marsPos && (marsPos.house === derived["8"] || aspectsHouse("Mars", marsPos.house, derived["8"]))) {
      hits.push({
        relationship: "Father",
        layer: "Research hypothesis",
        planet: "Mars",
        reason: "Mars acute/accident candidate with Father-derived 8H involvement",
        score: WEIGHTS.mars_rahu_accident_hypothesis,
        targetHouses: [derived["8"]],
      });
    }

    // 2. Mercury PD + Derived 12H / 8H: neurological / hemorrhage candidate
    if (mercPos && pdPlanet === "Mercury" && (mercPos.house === derived["12"] || mercPos.house === derived["8"] || aspectsHouse("Mercury", mercPos.house, derived["8"]))) {
      hits.push({
        relationship: "Father",
        layer: "Research hypothesis",
        planet: "Mercury",
        reason: "Mercury PD active + transit in Father's 12H (Hospitalization) / 8H: Neurological / hemorrhage sensitivity marker",
        score: WEIGHTS.mercury_neuro_hypothesis,
        targetHouses: [derived["12"], derived["8"]],
      });
    }

    // 3. Saturn prolonged severity in derived 6H / 8H
    if (satPos && (satPos.house === derived["6"] || satPos.house === derived["8"] || aspectsHouse("Saturn", satPos.house, derived["8"]))) {
      hits.push({
        relationship: "Father",
        layer: "Research hypothesis",
        planet: "Saturn",
        reason: `Saturn in/aspecting Father's derived ${satPos.house === derived["6"] ? "6H (Roga)" : "8H (Crisis)"}: High-severity clinical marker`,
        score: WEIGHTS.saturn_severity_hypothesis,
        targetHouses: [derived["6"], derived["8"]],
      });
    }
  }

  // Deduplicate hits
  const uniqueHits: HitRecord[] = [];
  const seen = new Set<string>();
  hits.forEach(h => {
    const k = `${h.layer}-${h.planet}-${h.targetHouses.join(",")}-${h.reason}`;
    if (!seen.has(k)) {
      seen.add(k);
      uniqueHits.push(h);
    }
  });

  const layers = Array.from(new Set(uniqueHits.map(h => h.layer)));
  let rawScore = uniqueHits.reduce((sum, h) => sum + h.score, 0);

  // Convergence bonus if multiple independent layers active
  const hasPrimary = uniqueHits.some(h => h.targetHouses.includes(derived["1"]));
  const hasDusthana = uniqueHits.some(h => h.targetHouses.some(t => [derived["6"], derived["8"], derived["12"]].includes(t)));
  if (hasPrimary && hasDusthana && layers.length >= 2) {
    rawScore += WEIGHTS.convergence_bonus;
  }

  // Lagna Raksha Shield (Tanu Bhava Protection)
  // When active Dasha planet is the Lagna Lord (e.g. Venus for Mother) and NO Dual Maraka is active:
  const isLagnaLordActive = dashaLevels.some(d => d.lord === lagnaLord);
  if (isLagnaLordActive && !hasDualMarakaActive) {
    // Lagna Lord protects vitality: dampens mortality, classifies as Curable Sickness (Roga)
    rawScore = Math.min(48, Math.round(rawScore * 0.55));
  }

  const score = Math.min(100, Math.max(5, rawScore));
  const windowLabel: FamilyMedicalScanResult["windowLabel"] =
    score >= 70
      ? "Extreme Maraka & Critical Emergency Alert"
      : score >= 40
      ? "High-convergence research alert"
      : score >= 20
      ? "Moderate signal"
      : "Background / low signal";

  // Precaution Prompts
  const keyPrecautions: string[] = [];
  if (windowLabel === "Extreme Maraka & Critical Emergency Alert" || windowLabel === "High-convergence research alert") {
    if (windowLabel === "Extreme Maraka & Critical Emergency Alert") {
      keyPrecautions.push(`CRITICAL MARAKA ALERT: Extreme physiological & trauma sensitivity active for ${config.name}. Keep emergency medical contacts on immediate standby.`);
    }
    keyPrecautions.push(`Prioritize proactive health checkups for ${config.name}, particularly covering derived 6H/8H zones.`);
    keyPrecautions.push(`Avoid high-speed travel or sharp physical exertion during active Mars/Rahu/Saturn alignment days.`);
    keyPrecautions.push("Do not ignore minor recurring fatigue or gastrointestinal/respiratory complaints.");
  } else if (windowLabel === "Moderate signal") {
    keyPrecautions.push(`Support ${config.name}'s daily routine with timely meals, balanced hydration, and adequate rest.`);
    keyPrecautions.push("Keep emergency medication and primary physician contact information handy.");
  } else {
    keyPrecautions.push(`Constitutional vitality for ${config.name} appears steady with manageable background indicators.`);
    keyPrecautions.push("Maintain standard seasonal health habits and routine physical activity.");
  }

  const traditionalUpays = [
    `Mahamrityunjaya Japa for ${config.name}'s long-term Ojas and protective vitality.`,
    `Water/food donation on the weekday of ${config.karaka} (e.g. Sunday for Sun/Father, Monday for Moon/Mother).`,
    `Respectful service to ${config.name} actively harmonizes the Bhavat Bhavam energetic field.`,
  ];

  const summaryMessage =
    windowLabel === "Extreme Maraka & Critical Emergency Alert"
      ? `🚨 EXTREME CRITICAL MARAKA ALERT for ${config.name} (${score}/100): High acute emergency/ICU sensitivity. Immediate clinical preparedness essential.`
      : windowLabel === "High-convergence research alert"
      ? `Elevated astrological convergence detected for ${config.name} (${score}/100). Focus on preventative wellness and gentle pacing.`
      : windowLabel === "Moderate signal"
      ? `Moderate sensitivity markers for ${config.name} (${score}/100). Keep routine consistent.`
      : `Stable vitality indicators for ${config.name} (${score}/100). Normal seasonal care recommended.`;

  return {
    memberKey,
    memberTitle: config.name,
    hindiTitle: config.hindiTitle,
    primaryHouse: config.primaryHouse,
    karaka: config.karaka,
    derivedHouses: derived,
    activeDasha: {
      mahadasha: mdPlanet,
      antardasha: adPlanet,
      pratyantar: pdPlanet,
    },
    score,
    windowLabel,
    hits: uniqueHits,
    layersActive: layers,
    keyPrecautions,
    traditionalUpays,
    summaryMessage,
  };
}

// ── Future Transit Window Scanner (Add-on 2: Timeline Scanning) ─────────
export function scanFutureHealthWindows(
  chart: ChartData,
  memberKey: FamilyMemberKey,
  daysSpan: number = 180,
  startDate: Date = new Date()
): FutureHealthWindow[] {
  const windows: FutureHealthWindow[] = [];
  const baseDate = startDate;
  const stepDays = 15; // Scan every 15 days

  for (let d = 0; d < daysSpan; d += stepDays) {
    const scanDate = new Date(baseDate.getTime() + d * 86400000);
    const dateStr = scanDate.toISOString().split("T")[0];

    // Quick approximate transit shift for scanning
    const result = scanFamilyMemberHealth(chart, memberKey, scanDate);

    if (result.score >= 25) {
      const endDate = new Date(scanDate.getTime() + 14 * 86400000).toISOString().split("T")[0];
      const triggers = result.hits.slice(0, 2).map(h => `${h.planet} (${h.layer})`).join(", ");

      windows.push({
        startDate: dateStr,
        endDate,
        memberKey,
        score: result.score,
        label: result.windowLabel,
        triggerSummary: triggers || "Multi-layer Dasha/Dusthana convergence",
        actionablePrecaution: result.keyPrecautions[0] || "Maintain regular routine and checkups.",
      });
    }
  }

  // Deduplicate and return top 4 windows
  return windows.slice(0, 4);
}
