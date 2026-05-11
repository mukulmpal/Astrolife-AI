import {
  CONSTRUCTION_RULES_V3,
  DIRECTION_PLANET_LINK,
  DIRECTIONS_V3,
  LAL_KITAB_SYMBOLIC_REMEDIES,
  MAKAN_AUKAT_RESULTS,
  PLOT_SHAPE_RULES_V3,
  REMEDIES_V3,
  ROOM_RULES_V3,
  type Domain,
} from "./knowledge-v3";

import {
  VASTU_ZONES_DEF,
  ZONE_REMEDIES,
  ZONE_ROOMS,
  ROOM_GUIDE,
  HOUSE_DIR_MAP,
  VASTU_PURUSHA_HEALTH_MAP,
} from "./zones";

import type { VastuZoneScore, VastuTransitAlert } from "./types";

type VastuRoomInput = {
  type: string;
  direction: string;
  name?: string;
};

type PlanetPositionData = {
  house: number;
  dignity?: string;
  retrograde?: boolean;
};

type VastuKundliInput = {
  weakPlanets?: string[];
  currentMahadasha?: string;
  currentAntardasha?: string;
  lalKitabHouses?: Record<string, string[]>;
  afflictions?: Record<string, unknown>;
  // When provided, enables 16-zone MahaVastu scoring + psych bridge + transit alerts
  planetPositions?: Record<string, PlanetPositionData>;
};

type VastuAnalyzeInput = {
  propertyType?: string;
  facing?: string;
  rooms?: VastuRoomInput[];
  kundli?: VastuKundliInput;
  features?: {
    northOpen?: boolean;
    eastOpen?: boolean;
    southWestHeavy?: boolean;
    brahmasthanOpen?: boolean;
    heavyMaterialZone?: string;
    temporaryWaterPitDirection?: string;
    southWestLow?: boolean;
  };
  measurements?: {
    shape?: string;
    lengthHasta?: number;
    widthHasta?: number;
  };
  options?: {
    includeLalKitab?: boolean;
    includeConstruction?: boolean;
  };
};

type Finding = {
  title: string;
  explanation: string;
  severity?: number;
  score?: number;
  remedies?: string[];
  system?: string;
};

type Recommendation = {
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  system: string;
  steps: string[];
  requiresKundli?: boolean;
};

type ScoreMap = {
  overall: number;
  wealth: number;
  health: number;
  relationship: number;
  career: number;
  children: number;
  spiritual: number;
  business: number;
  mentalPeace: number;
  construction: number;
};

function normalizeDirection(value?: string): string | null {
  if (!value) return null;

  const v = String(value).trim().toUpperCase().replace(/\s+/g, "_");
  const map: Record<string, string> = {
    NORTH: "N",
    N: "N",
    NORTHEAST: "NE",
    NORTH_EAST: "NE",
    NE: "NE",
    EAST: "E",
    E: "E",
    SOUTHEAST: "SE",
    SOUTH_EAST: "SE",
    SE: "SE",
    SOUTH: "S",
    S: "S",
    SOUTHWEST: "SW",
    SOUTH_WEST: "SW",
    SW: "SW",
    WEST: "W",
    W: "W",
    NORTHWEST: "NW",
    NORTH_WEST: "NW",
    NW: "NW",
    CENTER: "CENTER",
    CENTRE: "CENTER",
    BRAHMASTHAN: "CENTER",
    MARKAZ: "CENTER",
  };

  return map[v] || null;
}

function normalizePlanet(value?: string): string {
  const raw = String(value || "").trim();
  const lower = raw.toLowerCase();

  const map: Record<string, string> = {
    sun: "Sun",
    surya: "Sun",
    moon: "Moon",
    chandra: "Moon",
    mars: "Mars",
    mangal: "Mars",
    mercury: "Mercury",
    budh: "Mercury",
    jupiter: "Jupiter",
    guru: "Jupiter",
    venus: "Venus",
    shukra: "Venus",
    saturn: "Saturn",
    shani: "Saturn",
    rahu: "Rahu",
    ketu: "Ketu",
  };

  return map[lower] || raw;
}

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function priorityFromSeverity(severity: number): "low" | "medium" | "high" | "critical" {
  if (severity >= 9) return "critical";
  if (severity >= 7) return "high";
  if (severity >= 5) return "medium";
  return "low";
}

function emptyScores(): ScoreMap {
  return {
    overall: 86,
    wealth: 82,
    health: 82,
    relationship: 82,
    career: 82,
    children: 82,
    spiritual: 82,
    business: 82,
    mentalPeace: 82,
    construction: 82,
  };
}

function applyPenalty(scores: ScoreMap, domains: Domain[], severity: number) {
  const penalty = Math.max(2, severity * 2);
  scores.overall -= Math.round(penalty * 0.7);

  for (const domain of domains) {
    scores[domain] -= penalty;
  }
}

function applyBonus(scores: ScoreMap, domains: Domain[], value: number) {
  scores.overall += Math.round(value * 0.4);

  for (const domain of domains) {
    scores[domain] += value;
  }
}

function hasPlanetInKhana(kundli: VastuKundliInput | undefined, khana: number, planets: string[]) {
  const housePlanets = kundli?.lalKitabHouses?.[String(khana)] || [];
  const normalizedHouse = housePlanets.map(normalizePlanet);
  return planets.some((planet) => normalizedHouse.includes(normalizePlanet(planet)));
}

function getAstroSeverityBoost(direction: string, kundli?: VastuKundliInput) {
  if (!kundli) return { boost: 0, reasons: [] as string[] };

  const linkedPlanets = DIRECTION_PLANET_LINK[direction] || [];
  const weak = (kundli.weakPlanets || []).map(normalizePlanet);
  const currentMD = normalizePlanet(kundli.currentMahadasha);
  const currentAD = normalizePlanet(kundli.currentAntardasha);
  const reasons: string[] = [];
  let boost = 0;

  for (const planet of linkedPlanets) {
    if (weak.includes(planet)) {
      boost += 1.5;
      reasons.push(`${planet} is weak/afflicted in user chart`);
    }

    if (currentMD === planet) {
      boost += 1;
      reasons.push(`${planet} Mahadasha is active`);
    }

    if (currentAD === planet) {
      boost += 0.5;
      reasons.push(`${planet} Antardasha is active`);
    }
  }

  return { boost, reasons };
}

function chooseRemediesFor(roomType: string, direction: string): string[] {
  const remedies = new Set<string>();

  if (direction === "NE") remedies.add(REMEDIES_V3.ne_sensitive_correction.title);
  if (direction === "SW") remedies.add(REMEDIES_V3.sw_strengthen.title);
  if (direction === "CENTER") remedies.add(REMEDIES_V3.brahmasthan_opening.title);
  if (["toilet", "bathroom", "septic_tank"].includes(roomType)) {
    remedies.add(REMEDIES_V3.toilet_isolation.title);
  }
  if (roomType === "kitchen") remedies.add(REMEDIES_V3.agni_balance.title);

  remedies.add(REMEDIES_V3.keep_clean_light_open.title);
  remedies.add(REMEDIES_V3.behaviour_correction.title);

  return Array.from(remedies);
}

export function calculateMakanAukatV3(lengthHasta: number, widthHasta: number) {
  const raw = (lengthHasta + widthHasta) * 3 - 1;
  const remainderRaw = raw % 8;
  const remainder = remainderRaw === 0 ? 8 : remainderRaw;
  const result = MAKAN_AUKAT_RESULTS[remainder];

  return {
    raw,
    remainder,
    planets: result?.planets || [],
    nature: result?.nature || "inauspicious",
    message: result?.message || "No result mapping found.",
    isAuspicious: result?.nature === "auspicious",
    isInauspicious: result?.nature === "inauspicious",
  };
}

export const calculateMakanAukat = calculateMakanAukatV3;

function analyzeRooms(input: VastuAnalyzeInput, scores: ScoreMap) {
  const strengths: Finding[] = [];
  const defects: Finding[] = [];
  const recommendations: Recommendation[] = [];

  for (const room of input.rooms || []) {
    const direction = normalizeDirection(room.direction);
    if (!direction) continue;

    const roomType = String(room.type || "").trim();
    const rule = ROOM_RULES_V3.find((item) => item.room === roomType);
    const roomLabel = room.name || rule?.label || roomType;
    const directionName = DIRECTIONS_V3[direction]?.name || direction;

    if (!rule) {
      recommendations.push({
        title: `Manual review needed: ${roomLabel}`,
        priority: "medium",
        system: "vastu_intelligence",
        steps: [`No seeded rule found for room type "${roomType}". Add it in knowledge-v3.ts if common.`],
      });
      continue;
    }

    if (rule.ideal.includes(direction) || rule.good.includes(direction)) {
      const isIdeal = rule.ideal.includes(direction);
      const score = isIdeal ? 10 : 8;

      strengths.push({
        title: `${roomLabel} in ${directionName}`,
        explanation: isIdeal ? rule.idealMessage : `${rule.idealMessage} This is acceptable rather than perfect.`,
        score,
        system: rule.systems.join(", "),
      });

      applyBonus(scores, rule.domains, isIdeal ? 3 : 1);
      continue;
    }

    if (rule.caution.includes(direction)) {
      let severity = Math.max(4, rule.baseSeverity - 2);
      const astro = getAstroSeverityBoost(direction, input.kundli);
      severity = Math.min(10, severity + astro.boost);

      defects.push({
        title: `${roomLabel} in ${directionName} needs caution`,
        explanation: `${rule.cautionMessage}${astro.reasons.length ? ` Astro-Vastu note: ${astro.reasons.join("; ")}.` : ""}`,
        severity,
        remedies: chooseRemediesFor(roomType, direction),
        system: rule.systems.join(", "),
      });

      applyPenalty(scores, rule.domains, severity);

      recommendations.push({
        title: `Balance ${roomLabel} in ${directionName}`,
        priority: priorityFromSeverity(severity),
        system: "classical_vastu + modern_practical",
        steps: chooseRemediesFor(roomType, direction),
      });

      continue;
    }

    if (rule.avoid.includes(direction) || rule.criticalAvoid?.includes(direction)) {
      let severity = rule.criticalAvoid?.includes(direction) ? Math.max(9, rule.baseSeverity) : rule.baseSeverity;
      const astro = getAstroSeverityBoost(direction, input.kundli);
      severity = Math.min(10, severity + astro.boost);

      defects.push({
        title: `${roomLabel} in ${directionName}`,
        explanation: `${rule.defectMessage}${astro.reasons.length ? ` Astro-Vastu amplification: ${astro.reasons.join("; ")}.` : ""}`,
        severity,
        remedies: chooseRemediesFor(roomType, direction),
        system: rule.systems.join(", "),
      });

      applyPenalty(scores, rule.domains, severity);

      recommendations.push({
        title: `Correct ${roomLabel} in ${directionName}`,
        priority: priorityFromSeverity(severity),
        system: "classical_vastu + modern_practical",
        steps: chooseRemediesFor(roomType, direction),
      });
    }
  }

  return { strengths, defects, recommendations };
}

function analyzeAxis(input: VastuAnalyzeInput, scores: ScoreMap) {
  const strengths: Finding[] = [];
  const defects: Finding[] = [];
  const recommendations: Recommendation[] = [];
  const f = input.features || {};

  if (f.northOpen === true) {
    strengths.push({ title: "North is open/light", explanation: "North openness supports opportunity and business flow.", score: 8 });
    applyBonus(scores, ["wealth", "career", "business"], 2);
  } else if (f.northOpen === false) {
    const severity = 7;
    defects.push({
      title: "North is blocked/heavy",
      explanation: "North blockage may reduce opportunity, income flow and movement.",
      severity,
      remedies: ["Open/declutter North", "Improve light and air", "Avoid heavy blocked storage"],
    });
    applyPenalty(scores, ["wealth", "career", "business"], severity);
  }

  if (f.eastOpen === true) {
    strengths.push({ title: "East is open/light", explanation: "East openness supports morning light, vitality and positive orientation.", score: 8 });
    applyBonus(scores, ["health", "career", "mentalPeace"], 2);
  } else if (f.eastOpen === false) {
    const severity = 7;
    defects.push({
      title: "East is blocked/dark",
      explanation: "East blockage may affect vitality, positivity and initiative.",
      severity,
      remedies: ["Improve morning light", "Declutter East", "Avoid blind symbolic Sun remedy without kundli check"],
    });
    applyPenalty(scores, ["health", "career", "mentalPeace"], severity);
  }

  if (f.southWestHeavy === true) {
    strengths.push({ title: "South-West is stable/heavy", explanation: "South-West stability supports grounding, authority and relationship anchoring.", score: 9 });
    applyBonus(scores, ["relationship", "wealth", "business"], 3);
  } else if (f.southWestHeavy === false) {
    const severity = 8;
    defects.push({
      title: "South-West is weak/light",
      explanation: "Weak South-West can reduce stability, authority, marital grounding and asset holding.",
      severity,
      remedies: [REMEDIES_V3.sw_strengthen.title],
    });
    applyPenalty(scores, ["relationship", "wealth", "business"], severity);
  }

  if (f.brahmasthanOpen === true) {
    strengths.push({ title: "Brahmasthan is open", explanation: "Open center supports circulation, clarity and overall harmony.", score: 9 });
    applyBonus(scores, ["health", "mentalPeace", "spiritual"], 3);
  } else if (f.brahmasthanOpen === false) {
    const severity = 9;
    defects.push({
      title: "Brahmasthan is blocked/heavy",
      explanation: "Center blockage affects overall flow and should be treated as a critical correction area.",
      severity,
      remedies: [REMEDIES_V3.brahmasthan_opening.title],
    });
    applyPenalty(scores, ["health", "mentalPeace", "spiritual"], severity);
  }

  if (defects.length > 0) {
    recommendations.push({
      title: "Correct North/East openness and South/West stability axis",
      priority: "high",
      system: "classical_vastu + lal_kitab_makan_vastu",
      steps: [
        "Keep North and East more open, light and clean.",
        "Keep South and West comparatively stable, protected and heavier.",
        "Keep North-East clean and Brahmasthan open.",
      ],
    });
  }

  return { strengths, defects, recommendations };
}

function analyzePlot(input: VastuAnalyzeInput, scores: ScoreMap) {
  const strengths: Finding[] = [];
  const defects: Finding[] = [];
  const recommendations: Recommendation[] = [];
  const shape = String(input.measurements?.shape || "").toLowerCase();

  if (shape) {
    const rule = PLOT_SHAPE_RULES_V3.find((item) => item.shape === shape);

    if (rule?.status === "good") {
      strengths.push({ title: `Plot shape: ${shape}`, explanation: rule.message, score: 8 });
      applyBonus(scores, ["wealth", "health", "business"], 2);
    } else if (rule) {
      defects.push({
        title: `Plot shape needs correction: ${shape}`,
        explanation: rule.message,
        severity: rule.baseSeverity,
        remedies: ["Use zone-wise correction", "Avoid applying Makan Aukat if plot is not four-cornered", "Expert review recommended"],
      });
      applyPenalty(scores, ["wealth", "health", "business"], rule.baseSeverity);

      recommendations.push({
        title: "Plot geometry review",
        priority: priorityFromSeverity(rule.baseSeverity),
        system: "classical_vastu + lal_kitab_makan_vastu",
        steps: [rule.message, "Map missing/cut/extended zones.", "Apply corrections only after geometry confirmation."],
      });
    }
  }

  const length = Number(input.measurements?.lengthHasta);
  const width = Number(input.measurements?.widthHasta);
  const canUseAukat = ["square", "rectangle", ""].includes(shape);

  if (Number.isFinite(length) && Number.isFinite(width) && length > 0 && width > 0) {
    if (!canUseAukat) {
      recommendations.push({
        title: "Makan Aukat skipped",
        priority: "medium",
        system: "lal_kitab_makan_vastu",
        steps: ["Makan Aukat formula is for square/rectangle/four-corner property only."],
      });
    } else {
      const aukat = calculateMakanAukatV3(length, width);

      if (aukat.isAuspicious) {
        strengths.push({
          title: `Makan Aukat remainder ${aukat.remainder}`,
          explanation: `${aukat.message} Planet pair: ${aukat.planets.join(" + ")}.`,
          score: 8,
        });
        applyBonus(scores, ["wealth", "relationship", "business"], 2);
      } else {
        const severity = aukat.remainder === 8 ? 8 : 6;
        defects.push({
          title: `Makan Aukat remainder ${aukat.remainder}`,
          explanation: `${aukat.message} Planet pair: ${aukat.planets.join(" + ")}. Treat as Lal Kitab experimental layer, not classical Vastu.`,
          severity,
          remedies: [REMEDIES_V3.ketu_6_makan_aukat.title],
        });
        applyPenalty(scores, ["wealth", "relationship", "business"], severity);

        recommendations.push({
          title: "Lal Kitab Makan Aukat correction",
          priority: priorityFromSeverity(severity),
          system: "lal_kitab_makan_vastu",
          steps: REMEDIES_V3.ketu_6_makan_aukat.steps,
        });
      }
    }
  }

  return { strengths, defects, recommendations };
}

function analyzeLalKitab(input: VastuAnalyzeInput, scores: ScoreMap) {
  const strengths: Finding[] = [];
  const defects: Finding[] = [];
  const recommendations: Recommendation[] = [];

  if (!input.options?.includeLalKitab) return { strengths, defects, recommendations };

  const hasKundli = Boolean(input.kundli);

  for (const room of input.rooms || []) {
    const direction = normalizeDirection(room.direction);
    const type = String(room.type || "");

    if (direction === "SE" && ["bedroom", "master_bedroom", "kitchen"].includes(type)) {
      const label = room.name || type;
      recommendations.push({
        title: `Lal Kitab review: ${label} in South-East`,
        priority: hasKundli ? "medium" : "high",
        system: "lal_kitab_makan_vastu",
        requiresKundli: true,
        steps: [
          "Classical Vastu treats SE bedroom as caution because it is Agni/fire zone.",
          "Lal Kitab Makan Vastu maps SE to khana 12, where bedroom/kitchen can be conditionally useful.",
          "Do not mark this placement universally wrong; validate Venus/Mars/Jupiter and Rahu/Ketu/Saturn conditions.",
        ],
      });
    }
  }

  const eastSun = LAL_KITAB_SYMBOLIC_REMEDIES.find((item) => item.code === "LK_EAST_SUN_SYMBOL");

  if (eastSun) {
    if (!hasKundli) {
      recommendations.push({
        title: "Do not give East Sun symbol without Kundli",
        priority: "high",
        system: "lal_kitab_makan_vastu",
        requiresKundli: true,
        steps: eastSun.fallback,
      });
    } else if (hasPlanetInKhana(input.kundli, 1, eastSun.avoidIfPlanetsInKhana)) {
      defects.push({
        title: "East Sun/Ram symbol is not kundli-safe",
        explanation: "Lal Kitab khana 1 contains a planet that makes generic Sun activation risky. Use physical East cleanliness instead.",
        severity: 6,
        remedies: eastSun.fallback,
      });
      applyPenalty(scores, ["health", "career", "mentalPeace"], 4);
    } else {
      strengths.push({
        title: "East symbolic remedy appears kundli-safe",
        explanation: "No avoid-listed planet detected in Lal Kitab khana 1. Still treat symbolic activation as optional.",
        score: 6,
      });

      recommendations.push({
        title: "Optional East Sun/Ram symbolic activation",
        priority: "low",
        system: "lal_kitab_makan_vastu",
        requiresKundli: true,
        steps: [
          "Keep East clean and naturally bright first.",
          "Only then consider Copper Sun / Surya / Shri Ram symbolism.",
          "Avoid fear-based or miracle claims.",
        ],
      });
    }
  }

  recommendations.push({
    title: "Mind + Makan behavioural layer",
    priority: "medium",
    system: "lal_kitab_makan_vastu",
    steps: REMEDIES_V3.behaviour_correction.steps,
  });

  return { strengths, defects, recommendations };
}

function analyzeConstruction(input: VastuAnalyzeInput, scores: ScoreMap) {
  const strengths: Finding[] = [];
  const defects: Finding[] = [];
  const recommendations: Recommendation[] = [];

  if (!input.options?.includeConstruction) return { strengths, defects, recommendations };

  const materialZone = normalizeDirection(input.features?.heavyMaterialZone);

  if (materialZone && ["E", "N", "NE"].includes(materialZone)) {
    const rule = CONSTRUCTION_RULES_V3[0];
    defects.push({
      title: rule.title,
      explanation: `Heavy material detected in ${DIRECTIONS_V3[materialZone].name}. ${rule.effects.join(", ")} may increase.`,
      severity: rule.severity,
      remedies: rule.steps,
    });
    applyPenalty(scores, ["construction", "wealth", "business"], rule.severity);
  }

  if (input.features?.southWestLow) {
    const rule = CONSTRUCTION_RULES_V3[1];
    defects.push({
      title: rule.title,
      explanation: rule.effects.join(", "),
      severity: rule.severity,
      remedies: rule.steps,
    });
    applyPenalty(scores, ["construction", "wealth", "relationship"], rule.severity);
  }

  if (defects.length === 0) {
    strengths.push({
      title: "Construction module active",
      explanation: "No construction-stage defect was detected from provided construction inputs.",
      score: 7,
    });
  } else {
    recommendations.push({
      title: "Construction-stage correction",
      priority: "high",
      system: "lal_kitab_makan_vastu + modern_practical",
      steps: [
        "Do not dump heavy materials in East/North/NE.",
        "Keep heavy construction load in South/West/SW where possible.",
        "Protect North-East and Brahmasthan during construction.",
      ],
    });
  }

  return { strengths, defects, recommendations };
}

// ─────────────────────────────────────────────────────────────
// 16-ZONE MAHAVASTU KUNDLI ANALYSIS (from original AstroLife engine)
// Runs only when kundli.planetPositions is provided.
// ─────────────────────────────────────────────────────────────

const ALL_PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const BENEFICS    = ["Jupiter", "Venus", "Mercury", "Moon", "Sun"];
const MALEFICS    = ["Saturn", "Mars", "Rahu", "Ketu"];

function scoreVastuZone(
  zone: (typeof VASTU_ZONES_DEF)[number],
  positions: Record<string, PlanetPositionData>
): number {
  let score = 50;
  const h = zone.house;

  for (const planet of ALL_PLANETS) {
    const p = positions[planet];
    if (!p) continue;
    if (p.house === h) {
      if (BENEFICS.includes(planet))  score += 8;
      if (MALEFICS.includes(planet))  score -= 6;
      if (p.dignity?.includes("Exalted"))     score += 6;
      if (p.dignity?.includes("Debilitated")) score -= 8;
    }
  }

  const ruler = positions[zone.planet];
  if (ruler) {
    if ([1, 4, 7, 10].includes(ruler.house)) score += 7;
    if ([6, 8, 12].includes(ruler.house))    score -= 7;
    if (ruler.dignity?.includes("Exalted"))     score += 5;
    if (ruler.dignity?.includes("Debilitated")) score -= 8;
    if (ruler.retrograde) score -= 4;
  }

  return Math.min(92, Math.max(15, Math.round(score)));
}

function buildPsychBridgeFromPlanets(positions: Record<string, PlanetPositionData>): string[] {
  const insights: string[] = [];
  const sat  = positions.Saturn;
  const rahu = positions.Rahu;
  const moon = positions.Moon;
  const jup  = positions.Jupiter;
  const ven  = positions.Venus;
  const sun  = positions.Sun;

  if (sat?.house === 7 || sat?.house === 1)
    insights.push(`Saturn in H${sat.house} → West/East zone pressure → Fear of relationships, control patterns, difficulty trusting.`);
  if (rahu && rahu.house <= 6)
    insights.push(`Rahu in H${rahu.house} → SW/S zone obsession → Career/status obsession, ancestral karma, instability drive.`);
  if (moon && [12, 6, 8].includes(moon.house))
    insights.push(`Moon in H${moon.house} → Emotional zone weakness → Anxiety patterns, emotional memory loops, mother-related psychology.`);
  if (jup && [3, 6, 11].includes(jup.house))
    insights.push(`Jupiter in H${jup.house} → NE/N zone → Belief system needs rebuilding. Over-expansion tendency.`);
  if (ven && [6, 8, 12].includes(ven.house))
    insights.push(`Venus in H${ven.house} → SE/ESE weakness → Relationship and creative energy blocked. Social confidence issues.`);
  if (sun && [8, 12].includes(sun.house))
    insights.push(`Sun in H${sun.house} → East zone dimmed → Father/authority conflicts, identity confusion, self-confidence blocks.`);

  if (insights.length === 0)
    insights.push("No major Vastu-psychology stress patterns detected. Planetary configuration supports balanced zone energies.");

  return insights;
}

function buildTransitAlertsFromZones(
  zones: VastuZoneScore[],
  positions: Record<string, PlanetPositionData>
): VastuTransitAlert[] {
  const alerts: VastuTransitAlert[] = [];

  const effectMap: Record<string, string> = {
    Saturn: "structural issues, cold/damp, karmic delays",
    Mars:   "fire hazards, disputes, accidents",
    Rahu:   "leakages, hidden cracks, unusual events",
  };
  const stressRemedyMap: Record<string, string> = {
    Saturn: "Black sesame oil lamp in that zone every Saturday",
    Mars:   "Red triangular cloth in that zone every Tuesday",
    Rahu:   "Coal piece in that corner, Saturday ritual",
  };
  const boostRemedyMap: Record<string, string> = {
    Jupiter: "Yellow flowers, turmeric Thursday ritual",
    Venus:   "White flowers, crystal bowl with water Friday",
  };

  for (const planet of ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]) {
    const p = positions[planet];
    if (!p?.house) continue;

    const dirName = HOUSE_DIR_MAP[p.house];
    if (!dirName) continue;

    const zone = zones.find((z) => z.name === dirName || z.dir === dirName);
    if (!zone) continue;

    if (MALEFICS.includes(planet)) {
      alerts.push({
        planet,
        zone: zone.name,
        domain: zone.domain,
        effect: effectMap[planet] || "zone imbalance",
        remedy: stressRemedyMap[planet] || "Cleanse and energize zone",
        positive: false,
      });
    } else if (["Jupiter", "Venus"].includes(planet)) {
      alerts.push({
        planet,
        zone: zone.name,
        domain: zone.domain,
        effect: `${zone.domain} energized`,
        remedy: boostRemedyMap[planet] || "Enhance with natural elements",
        positive: true,
      });
    }
  }

  return alerts;
}

function analyzeZonesFromPlanets(
  positions: Record<string, PlanetPositionData>
): ReturnType<typeof buildZoneAnalysisResult> {
  const zones: VastuZoneScore[] = VASTU_ZONES_DEF.map((z) => {
    const score       = scoreVastuZone(z, positions);
    const status      = score >= 70 ? "Strong" : score >= 50 ? "Average" : "Weak";
    const statusColor = score >= 70 ? "#22c55e" : score >= 50 ? "#c8a030" : "#ef4444";
    const planetsHere = ALL_PLANETS.filter((p) => positions[p]?.house === z.house);
    const hasDosha    = score < 50 || planetsHere.some((p) => MALEFICS.includes(p));

    return {
      dir:         z.dir,
      name:        z.name,
      planet:      z.planet,
      element:     z.element,
      deity:       z.deity,
      domain:      z.domain,
      color:       z.color,
      house:       z.house,
      score,
      status,
      statusColor,
      planets:     planetsHere,
      remedy:      score < 50
                    ? `Critical: ${ZONE_REMEDIES[z.dir] ?? ""} + Worship ${z.deity} on ${z.planet} day.`
                    : (ZONE_REMEDIES[z.dir] ?? ""),
      roomIdeal:   ZONE_ROOMS[z.dir] ?? "",
      hasDosha,
    };
  });

  return buildZoneAnalysisResult(zones, positions);
}

function buildZoneAnalysisResult(zones: VastuZoneScore[], positions: Record<string, PlanetPositionData>) {
  const strongZones   = zones.filter((z) => z.status === "Strong");
  const weakZones     = zones.filter((z) => z.status === "Weak");
  const overallScore  = Math.round(zones.reduce((s, z) => s + z.score, 0) / zones.length);
  const transitAlerts = buildTransitAlertsFromZones(zones, positions);
  const psychBridge   = buildPsychBridgeFromPlanets(positions);

  const houseMap = Array.from({ length: 12 }, (_, i) => ({
    house:   i + 1,
    dir:     HOUSE_DIR_MAP[i + 1] ?? "",
    planets: ALL_PLANETS.filter((p) => positions[p]?.house === i + 1),
  }));

  return {
    zones,
    strongZones,
    weakZones,
    overallScore,
    transitAlerts,
    psychBridge,
    roomGuide:   ROOM_GUIDE,
    houseMap,
  };
}

// ─────────────────────────────────────────────────────────────
// 30/60/90 DAY CORRECTION PLAN
// ─────────────────────────────────────────────────────────────

type FindingWithSeverity = { title: string; severity?: number; remedies?: string[] };

function buildCorrectionPlan(defects: FindingWithSeverity[]): {
  thirtyDay: string[];
  sixtyDay: string[];
  ninetyDay: string[];
} {
  const critical  = defects.filter((d) => Number(d.severity ?? 0) >= 9);
  const high      = defects.filter((d) => Number(d.severity ?? 0) >= 7 && Number(d.severity ?? 0) < 9);
  const medium    = defects.filter((d) => Number(d.severity ?? 0) >= 5 && Number(d.severity ?? 0) < 7);

  const thirtyDay: string[] = [
    "Establish correct compass direction of the property using a magnetic compass.",
    "Deep clean and declutter the entire property — especially North-East, Brahmasthan and South-West.",
  ];
  for (const d of critical.slice(0, 3)) {
    thirtyDay.push(`Priority correction: ${d.title} — apply physical remedy first.`);
    if (d.remedies?.[0]) thirtyDay.push(`  → ${d.remedies[0]}`);
  }

  const sixtyDay: string[] = [
    "Review progress on critical fixes. Start high-priority corrections.",
    "Separate fire and water elements in the kitchen zone.",
    "Ensure master bedroom is in the most stable zone available.",
  ];
  for (const d of high.slice(0, 3)) {
    sixtyDay.push(`Address: ${d.title}`);
    if (d.remedies?.[0]) sixtyDay.push(`  → ${d.remedies[0]}`);
  }
  sixtyDay.push("Install simple no-demolition remedies (metal strips, colour correction, lighting) where structural change is not possible.");

  const ninetyDay: string[] = [
    "Review full property score improvement. Note any remaining medium-priority issues.",
  ];
  for (const d of medium.slice(0, 3)) {
    ninetyDay.push(`Fine-tune: ${d.title}`);
  }
  ninetyDay.push("Begin behavioural + routine corrections: sleep direction, food habits, study/work direction.");
  ninetyDay.push("Consider Kundli-safe symbolic remedies only after classical corrections are done.");
  ninetyDay.push("Schedule a re-evaluation of the Vastu score after implementing all corrections.");

  return { thirtyDay, sixtyDay, ninetyDay };
}

// ─────────────────────────────────────────────────────────────
// MIND + MAKAN ENERGY LOOP
// ─────────────────────────────────────────────────────────────

function buildMindMakan(defects: FindingWithSeverity[], rooms: { type: string; direction: string }[]): {
  physical: string[];
  behavioural: string[];
  routine: string[];
  emotional: string[];
  spiritual: string[];
} {
  const physical: string[] = [
    "Correct physical room placements before relying on symbolic remedies.",
    "Keep North and East sides lighter, cleaner and more open than South and West.",
    "Remove clutter from Brahmasthan (centre of property).",
  ];

  const hasKitchenDefect = defects.some((d) => d.title.toLowerCase().includes("kitchen"));
  const hasToiletNE      = rooms.some((r) => r.type === "toilet" && r.direction === "NE");
  const hasSWWeak        = defects.some((d) => d.title.toLowerCase().includes("south-west") || d.title.toLowerCase().includes("sw"));

  if (hasKitchenDefect)
    physical.push("Separate stove and sink in the kitchen to balance fire and water elements.");
  if (hasToiletNE)
    physical.push("North-East toilet must be kept absolutely dry, ventilated and isolated from worship areas.");
  if (hasSWWeak)
    physical.push("Stabilize South-West with heavy, stable furniture or storage. Avoid water or open gaps here.");

  const behavioural: string[] = [
    "House affects mind. Mind affects house. Remedies improve mental clarity, not guarantee money.",
    "Reduce harsh speech, anger, jealousy and domestic conflict — Agni tattva balancing.",
    "Avoid eating non-vegetarian food or consuming alcohol in the North-East zone.",
    "Do not keep broken, damaged or non-functional objects in the home.",
  ];

  const routine: string[] = [
    "Sleep with head in South or East direction for better rest.",
    "Sit facing East or North while studying, meditating or working.",
    "Wake up before sunrise and expose yourself to East morning light daily.",
    "Keep entrance area clean, bright and welcoming — it is the mouth of energy.",
  ];

  const emotional: string[] = [
    "If relationships are under pressure, first check South-West stability (master bedroom, SW zone).",
    "If anxiety or mental clarity is affected, first check North-East cleanliness.",
    "Vastu corrections create a supportive environment. Personal effort and conduct also matter equally.",
    "Avoid fear-based thinking about Vastu — most defects have practical, low-cost corrections.",
  ];

  const spiritual: string[] = [
    "Keep pooja room or meditation area in North-East or East, away from toilet/kitchen walls.",
    "Maintain daily cleaning ritual of the North-East corner.",
    "Avoid installing deity idols or spiritual objects without checking Lal Kitab kundli safety first.",
    "Use Vastu corrections as a tool for clarity and peace, not as a substitute for karma, effort and discipline.",
  ];

  return { physical, behavioural, routine, emotional, spiritual };
}

// ─────────────────────────────────────────────────────────────
// VASTU PURUSHA SYMBOLIC HEALTH MAP
// ─────────────────────────────────────────────────────────────

function buildVastuPurushaHealth(defects: FindingWithSeverity[]): {
  affectedZones: string[];
  observations: string[];
} {
  const directionSet = new Set<string>();
  for (const d of defects) {
    const dirMatch = d.title.match(/\b(North-East|NE|South-West|SW|East|West|North|South|Southeast|Northeast|Brahmasthan|Center|SE|NW|N|S|E|W)\b/i);
    if (dirMatch) directionSet.add(dirMatch[1].toUpperCase().replace("-", "").replace(" ", ""));
  }

  const SHORTHAND_MAP: Record<string, string> = {
    NORTHEAST: "NE", SOUTHWEST: "SW", NORTHWEST: "NW", SOUTHEAST: "SE",
    NORTH: "N", SOUTH: "S", EAST: "E", WEST: "W",
    CENTER: "CENTER", BRAHMASTHAN: "CENTER",
  };

  const normalizedZones = Array.from(directionSet).map((z) => SHORTHAND_MAP[z] || z);
  const uniqueZones     = [...new Set(normalizedZones)];

  const observations: string[] = [
    "Vastu Purusha maps spread across the property — different zones relate symbolically to body and life areas.",
  ];

  for (const zone of uniqueZones) {
    const entry = VASTU_PURUSHA_HEALTH_MAP[zone];
    if (entry) observations.push(entry.caution);
  }

  observations.push(
    "Use this as symbolic guidance only. Consult a doctor for health matters.",
    "Correcting these zones may improve mental environment, not directly cure disease.",
    'Phrase to use internally: "This zone may reflect pressure. Keep it light, clean and undisturbed."'
  );

  return {
    affectedZones: uniqueZones,
    observations,
  };
}

function uniqueRecommendations(items: Recommendation[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = `${item.title}-${item.system}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildSummary(scores: ScoreMap, defects: Finding[], strengths: Finding[]) {
  const critical = defects.filter((item) => Number(item.severity || 0) >= 9).length;
  const high = defects.filter((item) => Number(item.severity || 0) >= 7).length;

  if (critical > 0) {
    return `Vastu analysis found ${critical} critical issue(s) and ${high} high-priority issue(s). Correct North-East, South-West, toilets and Brahmasthan first. Overall score: ${scores.overall}.`;
  }

  if (high > 0) {
    return `Vastu analysis found ${high} high-priority issue(s). The property has usable strengths but needs practical correction. Overall score: ${scores.overall}.`;
  }

  return `Vastu analysis found a generally workable property pattern with ${strengths.length} strength(s). Continue with source-wise remedies and avoid fear-based corrections. Overall score: ${scores.overall}.`;
}

export function analyzeVastuPropertyV3(input: VastuAnalyzeInput) {
  const scores = emptyScores();

  const roomResult         = analyzeRooms(input, scores);
  const axisResult         = analyzeAxis(input, scores);
  const plotResult         = analyzePlot(input, scores);
  const lalKitabResult     = analyzeLalKitab(input, scores);
  const constructionResult = analyzeConstruction(input, scores);

  const strengths = [
    ...roomResult.strengths,
    ...axisResult.strengths,
    ...plotResult.strengths,
    ...lalKitabResult.strengths,
    ...constructionResult.strengths,
  ];

  const defects = [
    ...roomResult.defects,
    ...axisResult.defects,
    ...plotResult.defects,
    ...lalKitabResult.defects,
    ...constructionResult.defects,
  ].sort((a, b) => Number(b.severity || 0) - Number(a.severity || 0));

  const recommendations = uniqueRecommendations([
    ...roomResult.recommendations,
    ...axisResult.recommendations,
    ...plotResult.recommendations,
    ...lalKitabResult.recommendations,
    ...constructionResult.recommendations,
  ]);

  for (const key of Object.keys(scores) as Array<keyof ScoreMap>) {
    scores[key] = clamp(scores[key]);
  }

  // 16-zone MahaVastu analysis — runs only when planet positions are provided
  const zoneAnalysis = input.kundli?.planetPositions
    ? analyzeZonesFromPlanets(input.kundli.planetPositions)
    : undefined;

  // 30/60/90 day correction plan
  const correctionPlan = buildCorrectionPlan(defects);

  // Mind + Makan energy loop
  const mindMakan = buildMindMakan(defects, (input.rooms || []).map((r) => ({
    type:      String(r.type || ""),
    direction: String(r.direction || ""),
  })));

  // Vastu Purusha symbolic health observations
  const vastuPurushaHealth = buildVastuPurushaHealth(defects);

  return {
    engineVersion: "vastu-intelligence-v4.0-unified",
    summary: buildSummary(scores, defects, strengths),
    scores,
    strengths,
    defects,
    recommendations,
    // New unified sections
    zoneAnalysis,
    correctionPlan,
    mindMakan,
    vastuPurushaHealth,
    meta: {
      systems:            ["classical_vastu", "modern_practical", "mahavastu_remedy", "lal_kitab_makan_vastu"],
      policy:             "Lal Kitab Makan Vastu is separated from classical Vastu. Kundli-gated symbolic remedies are not given blindly.",
      inputRooms:         input.rooms?.length || 0,
      lalKitabEnabled:    Boolean(input.options?.includeLalKitab),
      constructionEnabled: Boolean(input.options?.includeConstruction),
      zoneAnalysisActive: Boolean(input.kundli?.planetPositions),
    },
  };
}

export const analyzeAdvancedVastuPropertyV3 = analyzeVastuPropertyV3;
export const analyzeLalKitabMakanVastuV3 = analyzeLalKitab;
export const analyzeConstructionVastuV3 = analyzeConstruction;
