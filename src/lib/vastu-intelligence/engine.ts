import type {
  DirectionCode,
  MakanAukatResult,
  PlanetName,
  RoomInput,
  RoomType,
  VastuAnalyzeInput,
  VastuAnalysisResult,
  VastuDefect,
  VastuRecommendation,
  VastuScores,
  VastuStrength,
} from "./types";

import {
  CLASSICAL_ROOM_SCORES,
  DIRECTION_KNOWLEDGE,
  DOMAIN_WEIGHTS,
  ENGINE_VERSION,
  LAL_KITAB_DIRECTION_KHANA_MAP,
  ROOM_PLANET_MAP,
  SOURCE_POLICY,
} from "./knowledge";

const VALID_DIRECTIONS: DirectionCode[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "CENTER"];
const DEFAULT_OPTIONS = {
  includeClassical: true,
  includeModern: true,
  includeMahaVastuRemedies: true,
  includeLalKitab: false,
  includeConstruction: true,
  includeAukat: true,
  enableAstroAmplification: true,
};

function normalizeDirection(value?: string): DirectionCode {
  const raw = String(value || "CENTER").trim().toUpperCase().replace(/[-\s]/g, "_");
  const aliases: Record<string, DirectionCode> = {
    NORTH: "N",
    N: "N",
    NORTH_EAST: "NE",
    NORTHEAST: "NE",
    NE: "NE",
    EAST: "E",
    E: "E",
    SOUTH_EAST: "SE",
    SOUTHEAST: "SE",
    SE: "SE",
    SOUTH: "S",
    S: "S",
    SOUTH_WEST: "SW",
    SOUTHWEST: "SW",
    SW: "SW",
    WEST: "W",
    W: "W",
    NORTH_WEST: "NW",
    NORTHWEST: "NW",
    NW: "NW",
    CENTER: "CENTER",
    CENTRE: "CENTER",
    BRAHMASTHAN: "CENTER",
    MARKAZ: "CENTER",
  };
  return aliases[raw] || (VALID_DIRECTIONS.includes(raw as DirectionCode) ? (raw as DirectionCode) : "CENTER");
}

function normalizeRoomType(value?: string): RoomType {
  const raw = String(value || "other").trim().toLowerCase().replace(/[\s-]/g, "_");
  const aliases: Record<string, RoomType> = {
    entrance: "main_entrance",
    main_door: "main_entrance",
    door: "main_entrance",
    mandir: "pooja_room",
    temple: "pooja_room",
    puja: "pooja_room",
    pooja: "pooja_room",
    prayer: "pooja_room",
    masterbedroom: "master_bedroom",
    master_bed: "master_bedroom",
    children_room: "kids_room",
    child_room: "kids_room",
    kid_room: "kids_room",
    kids_bedroom: "kids_room",
    washroom: "toilet",
    wc: "toilet",
    bath: "bathroom",
    underground_tank: "underground_water",
    borewell: "underground_water",
    well: "underground_water",
    water_tank: "underground_water",
    overhead_water: "overhead_tank",
    pooja_room: "pooja_room",
    brahma_sthan: "brahmasthan",
    center: "brahmasthan",
  };
  return aliases[raw] || (raw as RoomType);
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function priorityFromSeverity(severity: number): VastuRecommendation["priority"] {
  if (severity >= 9) return "critical";
  if (severity >= 7) return "high";
  if (severity >= 4) return "medium";
  return "low";
}

function addPenalty(scores: VastuScores, domains: string[], severity: number): void {
  const penalty = Math.round(severity * 2.2);
  for (const domain of domains) {
    const key = domain as keyof VastuScores;
    if (scores[key] !== undefined) {
      scores[key] = clampScore(scores[key] - penalty);
    }
  }
}

function boostSeverityWithKundli(defect: VastuDefect, input: VastuAnalyzeInput): VastuDefect {
  const kundli = input.kundli;
  const options = { ...DEFAULT_OPTIONS, ...(input.options || {}) };
  if (!kundli || !options.enableAstroAmplification) return defect;

  let multiplier = 1;
  const weak = kundli.weakPlanets || [];
  const afflicted = kundli.afflictedPlanets || [];
  const dasha = [kundli.currentMahadasha, kundli.currentAntardasha].filter(Boolean) as PlanetName[];

  const directionPlanet = defect.direction ? DIRECTION_KNOWLEDGE[normalizeDirection(defect.direction)]?.planet : undefined;
  const roomPlanet = defect.room ? ROOM_PLANET_MAP[normalizeRoomType(defect.room)] : undefined;
  const linked = [directionPlanet, roomPlanet].filter((p): p is PlanetName => typeof p === "string" && p !== "Central Energy") as PlanetName[];

  if (linked.some((p) => weak.includes(p))) multiplier += 0.2;
  if (linked.some((p) => afflicted.includes(p))) multiplier += 0.25;
  if (linked.some((p) => dasha.includes(p))) multiplier += 0.15;

  if (defect.direction === "NE" && (weak.includes("Jupiter") || kundli.afflictions?.jupiterSevere)) multiplier += 0.15;
  if (defect.direction === "SE" && (afflicted.includes("Mars") || kundli.afflictions?.marsSevere)) multiplier += 0.12;
  if (defect.direction === "SW" && (afflicted.includes("Saturn") || kundli.afflictions?.saturnSevere)) multiplier += 0.15;
  if (defect.room?.includes("bedroom") && (afflicted.includes("Venus") || kundli.afflictions?.venusSevere)) multiplier += 0.12;

  const severity = Math.min(10, Math.max(defect.severity, Math.round(defect.baseSeverity * multiplier)));
  if (severity === defect.severity) return defect;

  return {
    ...defect,
    severity,
    explanation: `${defect.explanation} Kundli factors amplify this from ${defect.baseSeverity}/10 to ${severity}/10.`,
  };
}

function analyzeRoomClassical(room: RoomInput): { strengths: VastuStrength[]; defects: VastuDefect[]; recommendations: VastuRecommendation[] } {
  const type = normalizeRoomType(room.type);
  const direction = normalizeDirection(room.direction);
  const table = CLASSICAL_ROOM_SCORES[type];
  const suitability = table?.[direction];
  const name = room.name || type.replace(/_/g, " ");
  const strengths: VastuStrength[] = [];
  const defects: VastuDefect[] = [];
  const recommendations: VastuRecommendation[] = [];

  if (suitability === undefined) {
    return { strengths, defects, recommendations };
  }

  if (suitability >= 8) {
    strengths.push({
      title: `${name} in ${direction} is supportive`,
      explanation: `${name} aligns well with ${DIRECTION_KNOWLEDGE[direction].name} according to the classical/practical rule table.`,
      score: suitability,
      system: "classical_vastu",
      sourceTag: "classical_room_direction_score",
    });
    return { strengths, defects, recommendations };
  }

  if (suitability <= 3) {
    const baseSeverity = Math.max(4, 10 - suitability);
    const domains = DIRECTION_KNOWLEDGE[direction].domains;
    const defect: VastuDefect = {
      code: `CLASSICAL_${type.toUpperCase()}_${direction}_DEFECT`,
      title: `${name} in ${direction} needs correction`,
      explanation: `${name} is not well aligned with ${DIRECTION_KNOWLEDGE[direction].name}. This is a physical Vastu concern, independent of Lal Kitab rules.`,
      severity: baseSeverity,
      baseSeverity,
      direction,
      room: type,
      domains,
      remedies: buildPhysicalRemedies(type, direction),
      system: "classical_vastu",
      authorityLevel: "primary",
      sourceTag: "classical_room_direction_score",
    };
    defects.push(defect);
    recommendations.push({
      title: `Correct ${name} placement effect`,
      priority: priorityFromSeverity(baseSeverity),
      system: "classical_vastu",
      steps: buildPhysicalRemedies(type, direction),
    });
  }

  return { strengths, defects, recommendations };
}

function buildPhysicalRemedies(type: RoomType, direction: DirectionCode): string[] {
  if (type === "toilet" && direction === "NE") {
    return [
      "Keep the toilet absolutely dry, clean and ventilated.",
      "Avoid temple/pooja activity on a wall shared with this toilet.",
      "Use no-demolition isolation remedies only as secondary support; structural relocation is best if possible.",
      "Strengthen the remaining North-East with light, cleanliness and spiritual calm.",
    ];
  }
  if (type === "toilet" && direction === "CENTER") {
    return [
      "Treat this as a critical Brahmasthan defect; relocation is the strongest correction.",
      "Until relocation, keep it dry, bright, odour-free and visually isolated.",
      "Avoid heavy storage or clutter around the centre.",
    ];
  }
  if (type === "kitchen" && direction === "NE") {
    return [
      "Reduce fire intensity in North-East where possible.",
      "Keep North-East lighter, cleaner and more water/spiritual oriented.",
      "Shift active stove usage toward South-East if layout allows.",
    ];
  }
  if ((type === "master_bedroom" || type === "bedroom") && direction === "SE") {
    return [
      "Classical Vastu treats SE bedroom as a caution because of fire intensity.",
      "Reduce red, excess heat, electrical clutter and conflict triggers.",
      "Use Lal Kitab interpretation only after kundli validation; do not mix blindly.",
    ];
  }
  if (direction === "CENTER") {
    return [
      "Keep Brahmasthan open, light, clean and free from heavy load.",
      "Improve natural circulation around the centre.",
    ];
  }
  if (direction === "NE") {
    return [
      "Keep North-East clean, light, open and spiritually calm.",
      "Avoid heavy, dirty, fiery or waste-related use in this zone.",
    ];
  }
  if (direction === "SW") {
    return [
      "Stabilize South-West with weight, order and privacy.",
      "Avoid water leakage, excessive openness or instability in this zone.",
    ];
  }
  return [
    "Use functional relocation if possible.",
    "Keep the zone clean, ventilated and aligned with its natural element.",
    "Use no-demolition remedies only as secondary support, not as a miracle claim.",
  ];
}

export function canRecommendEastSunSymbol(input: VastuAnalyzeInput): { allowed: boolean; reason: string; requiresKundli: boolean } {
  const kundli = input.kundli;
  if (!kundli?.lalKitabHouses) {
    return {
      allowed: false,
      requiresKundli: true,
      reason: "East Sun/Ram/Copper Sun activation requires Lal Kitab khana validation. Without kundli, recommend only sunlight, cleanliness and openness.",
    };
  }

  const khana1 = kundli.lalKitabHouses["1"] || [];
  const blocked = khana1.filter((p) => ["Rahu", "Ketu", "Saturn", "Venus"].includes(p));
  if (blocked.length > 0 || kundli.afflictions?.sunSevere) {
    return {
      allowed: false,
      requiresKundli: true,
      reason: `Avoid East Sun symbolic activation because khana 1 has ${blocked.join(", ") || "severe Sun affliction"}.`,
    };
  }

  return {
    allowed: true,
    requiresKundli: true,
    reason: "Khana 1 does not show the blocked planets from the transcript-based safety rule. Symbolic Sun activation may be considered with caution.",
  };
}

function analyzeLalKitab(input: VastuAnalyzeInput): { strengths: VastuStrength[]; defects: VastuDefect[]; recommendations: VastuRecommendation[] } {
  const strengths: VastuStrength[] = [];
  const defects: VastuDefect[] = [];
  const recommendations: VastuRecommendation[] = [];
  const rooms = input.rooms || [];

  for (const room of rooms) {
    const type = normalizeRoomType(room.type);
    const direction = normalizeDirection(room.direction);
    const name = room.name || type.replace(/_/g, " ");

    if ((type === "bedroom" || type === "master_bedroom") && direction === "SE") {
      recommendations.push({
        title: "South-East bedroom is source-wise conditional",
        priority: "medium",
        system: "lal_kitab_makan_vastu",
        requiresKundli: true,
        caution: "Classical Vastu treats SE bedroom as caution; Lal Kitab Makan Vastu may allow it through khana 12 / Venus logic only after kundli validation.",
        steps: [
          "Do not mark this universally good or bad.",
          "Run Lal Kitab khana 12 and Venus/Mars/Jupiter safety checks.",
          "If kundli is unavailable, show it as conditional rather than final.",
        ],
      });
      strengths.push({
        title: `${name} in SE is conditionally explainable in Lal Kitab`,
        explanation: "SE maps to khana 12 in the Lal Kitab Makan Vastu layer, where bedroom/Venus activation may be useful only after kundli check.",
        score: 6,
        system: "lal_kitab_makan_vastu",
        sourceTag: "transcript_lal_kitab_khana_12",
      });
    }

    if (type === "kitchen" && direction === "SE") {
      strengths.push({
        title: "Kitchen in SE is strongly supported",
        explanation: "Classical Vastu supports SE as Agni zone; Lal Kitab also treats kitchen as a fixed Mars anchor and SE as khana 12 context.",
        score: 10,
        system: "integrated",
        sourceTag: "classical_plus_lal_kitab_agni_mars",
      });
    }
  }

  const eastSun = canRecommendEastSunSymbol(input);
  recommendations.push({
    title: eastSun.allowed ? "East Sun/Ram symbol may be considered" : "Avoid generic East Sun/Ram symbol",
    priority: eastSun.allowed ? "medium" : "high",
    system: "lal_kitab_makan_vastu",
    requiresKundli: true,
    caution: eastSun.reason,
    steps: eastSun.allowed
      ? [
          "Use only if the full Lal Kitab chart remains supportive.",
          "Prefer clean East, natural light and disciplined Sun-like conduct first.",
        ]
      : [
          "Do not recommend Copper Sun, Surya image or Shri Ram image as a generic remedy.",
          "Use safe physical correction: East openness, light, cleanliness and ventilation.",
        ],
  });

  return { strengths, defects, recommendations };
}

function analyzeAxisFeatures(input: VastuAnalyzeInput): { strengths: VastuStrength[]; defects: VastuDefect[]; recommendations: VastuRecommendation[] } {
  const f = input.features || {};
  const strengths: VastuStrength[] = [];
  const defects: VastuDefect[] = [];
  const recommendations: VastuRecommendation[] = [];

  if (f.northOpen && f.eastOpen) {
    strengths.push({
      title: "North and East openness is supportive",
      explanation: "The engine treats open, light and ventilated North/East as a shared Vastu foundation.",
      score: 9,
      system: "integrated",
      sourceTag: "north_east_axis_rule",
    });
  } else if (f.northOpen === false || f.eastOpen === false) {
    const blocked = f.northOpen === false ? "North" : "East";
    defects.push({
      code: `AXIS_${blocked.toUpperCase()}_BLOCKED`,
      title: `${blocked} side is blocked or heavy`,
      explanation: "North/East should ideally be more open, light, lower and ventilated than South/West.",
      severity: 7,
      baseSeverity: 7,
      direction: blocked === "North" ? "N" : "E",
      domains: blocked === "North" ? ["wealth", "business", "career"] : ["health", "mentalPeace", "career"],
      remedies: [
        `Reduce clutter and heaviness in ${blocked}.`,
        `Increase light, movement and usable openness in ${blocked}.`,
        "If outside conditions cannot be changed, improve internal layout benefit.",
      ],
      system: "integrated",
      authorityLevel: "secondary",
      sourceTag: "north_east_axis_rule",
    });
  }

  if (f.southWestHeavy) {
    strengths.push({
      title: "South-West heaviness supports stability",
      explanation: "Heavy, high and protected South/West/SW supports stability and privacy.",
      score: 9,
      system: "integrated",
      sourceTag: "south_west_stability_rule",
    });
  } else if (f.southWestHeavy === false) {
    defects.push({
      code: "SW_WEAK_LIGHT_OPEN",
      title: "South-West appears weak or too open",
      explanation: "South-West should function as a stability anchor. Weakness here can reduce relationship, asset and authority support.",
      severity: 8,
      baseSeverity: 8,
      direction: "SW",
      domains: ["relationship", "wealth", "health"],
      remedies: [
        "Add weight, privacy, order and stable use in South-West.",
        "Avoid water leakage, cuts or excessive openness in SW.",
      ],
      system: "integrated",
      authorityLevel: "primary",
      sourceTag: "south_west_stability_rule",
    });
  }

  if (f.brahmasthanOpen === false) {
    defects.push({
      code: "BRAHMASTHAN_BLOCKED",
      title: "Brahmasthan / centre is blocked",
      explanation: "The central zone distributes energy across the property. Heavy load, toilet, staircase or darkness here is a critical concern.",
      severity: 9,
      baseSeverity: 9,
      direction: "CENTER",
      room: "brahmasthan",
      domains: ["health", "mentalPeace", "spiritual"],
      remedies: [
        "Open, declutter and brighten the centre where possible.",
        "Avoid toilet, septic, heavy storage and dark blockage in the centre.",
        "If structural correction is impossible, improve circulation and visual openness around the centre.",
      ],
      system: "classical_vastu",
      authorityLevel: "primary",
      sourceTag: "brahmasthan_rule",
    });
  } else if (f.brahmasthanOpen) {
    strengths.push({
      title: "Brahmasthan is open",
      explanation: "An open and clean centre supports vitality, harmony and circulation.",
      score: 9,
      system: "classical_vastu",
      sourceTag: "brahmasthan_rule",
    });
  }

  if (f.climate === "cold" || f.climate === "mountain") {
    recommendations.push({
      title: "Climate exception applied",
      priority: "medium",
      system: "modern_practical_vastu",
      steps: [
        "In cold/mountain regions, South sunlight may be practically beneficial.",
        "Reduce strict South-opening penalties when heating and daylight are necessary.",
        "Balance practical architecture with Vastu rather than using rigid fear rules.",
      ],
    });
  }

  if (f.northNeighborHigher) {
    recommendations.push({
      title: "External North blockage noted",
      priority: "medium",
      system: "modern_practical_vastu",
      steps: [
        "A higher North neighbour can reduce the benefit of North openness.",
        "You may not control outside buildings, so improve internal North light, clarity and usability.",
      ],
    });
  }

  if (f.southNeighborLower) {
    recommendations.push({
      title: "External South weakness noted",
      priority: "medium",
      system: "modern_practical_vastu",
      steps: [
        "A lower South neighbour may reduce the stabilizing feel of the property.",
        "Strengthen internal South/South-West through mass, privacy and order.",
      ],
    });
  }

  return { strengths, defects, recommendations };
}

function analyzeConstruction(input: VastuAnalyzeInput): { defects: VastuDefect[]; recommendations: VastuRecommendation[] } {
  const f = input.features || {};
  const defects: VastuDefect[] = [];
  const recommendations: VastuRecommendation[] = [];
  const materialDirection = f.constructionMaterialDirection ? normalizeDirection(f.constructionMaterialDirection) : undefined;

  if (materialDirection && ["N", "E", "NE"].includes(materialDirection)) {
    defects.push({
      code: "CONSTRUCTION_MATERIAL_NE_AXIS",
      title: "Heavy construction material on North/East/NE axis",
      explanation: "Construction-stage Vastu prefers heavy material in South/West/SW, not North/East/NE.",
      severity: 7,
      baseSeverity: 7,
      direction: materialDirection,
      domains: ["construction", "wealth", "business"],
      remedies: [
        "Shift cement, bricks, iron, sand and heavy load toward South/West/SW where possible.",
        "Keep North/East usable for light, access, water and openness.",
      ],
      system: "lal_kitab_makan_vastu",
      authorityLevel: "experimental",
      sourceTag: "construction_stage_transcript_rule",
    });
  }

  if (f.southWestLowerThanNorthEast) {
    defects.push({
      code: "CONSTRUCTION_SW_LOWER_THAN_NE",
      title: "South-West lower/weaker than North-East",
      explanation: "For construction and commercial projects, a weak SW with heavier/higher NE can create instability and delays.",
      severity: 8,
      baseSeverity: 8,
      direction: "SW",
      domains: ["construction", "wealth", "business"],
      remedies: [
        "Increase mass, level, stability and privacy in SW where feasible.",
        "Avoid making NE heavy; keep NE clean and balanced.",
      ],
      system: "integrated",
      authorityLevel: "secondary",
      sourceTag: "construction_stage_sw_ne_case_pattern",
    });
  }

  if (defects.length > 0) {
    recommendations.push({
      title: "Construction-stage correction plan",
      priority: "high",
      system: "lal_kitab_makan_vastu",
      steps: [
        "Move heavy material to South/West/SW.",
        "Keep North/East/NE open, light and useful during construction.",
        "If centre is blocked by lift/stairs, improve circulation and consider effective-centre correction with expert review.",
      ],
    });
  }

  return { defects, recommendations };
}

export function calculateMakanAukat(lengthHasta: number, widthHasta: number, shape: string = "rectangle"): MakanAukatResult {
  const normalizedShape = shape.toLowerCase();
  if (!["square", "rectangle", "four_corner", "chaturasra"].includes(normalizedShape)) {
    return {
      applicable: false,
      reason: "Makan Aukat formula applies only to clean four-corner square/rectangular properties. Use separate rules for cut, flat, triangular or irregular property.",
    };
  }

  if (!Number.isFinite(lengthHasta) || !Number.isFinite(widthHasta) || lengthHasta <= 0 || widthHasta <= 0) {
    return {
      applicable: false,
      reason: "Valid lengthHasta and widthHasta are required. Use owner/user hasta measurement: middle finger to elbow.",
    };
  }

  const raw = (lengthHasta + widthHasta) * 3 - 1;
  const rem = raw % 8;
  const remainder = rem === 0 ? 8 : rem;
  const mapping: Record<number, { pair: PlanetName[]; interpretation: string; good: boolean }> = {
    1: { pair: ["Sun", "Jupiter"], interpretation: "Auspicious; raj-like support, authority and protection.", good: true },
    2: { pair: ["Jupiter", "Venus"], interpretation: "Problematic tendency; relationship, money and conduct discipline become important.", good: false },
    3: { pair: ["Jupiter", "Mars"], interpretation: "Generally useful but requires disciplined action and ethical conduct.", good: true },
    4: { pair: ["Moon", "Saturn"], interpretation: "Problematic tendency; emotional heaviness and delays may arise.", good: false },
    5: { pair: ["Sun", "Jupiter"], interpretation: "Auspicious; dignity, wisdom and family support.", good: true },
    6: { pair: ["Sun", "Saturn"], interpretation: "Problematic tendency; pressure, duty and health/career discipline required.", good: false },
    7: { pair: ["Moon", "Venus"], interpretation: "Auspicious; comfort, relationship and settlement support.", good: true },
    8: { pair: ["Mars", "Saturn"], interpretation: "Harsh/high-risk tendency; avoid fear, apply correction and discipline.", good: false },
  };

  const item = mapping[remainder];
  return {
    applicable: true,
    raw,
    remainder,
    isAuspicious: item.good,
    planetPair: item.pair,
    interpretation: item.interpretation,
    remedy: item.good
      ? ["Maintain cleanliness, ethical conduct and proper zone balance."]
      : ["Lal Kitab transcript-based suggestion: Ketu khana 6 style remedy may be considered.", "Examples: 3 bananas for 43 days in temple, dog feeding/service.", "Keep this experimental and do not promise guaranteed results."],
  };
}

function buildMakanAukat(input: VastuAnalyzeInput): MakanAukatResult | undefined {
  const m = input.measurements;
  if (!m) return undefined;
  const lengthHasta = m.lengthHasta ?? m.length;
  const widthHasta = m.widthHasta ?? m.width;
  if (lengthHasta === undefined || widthHasta === undefined) return undefined;
  return calculateMakanAukat(lengthHasta, widthHasta, m.shape || "rectangle");
}

function initializeScores(): VastuScores {
  return {
    overall: 100,
    wealth: 100,
    health: 100,
    relationship: 100,
    career: 100,
    children: 100,
    spiritual: 100,
    business: 100,
    mentalPeace: 100,
    construction: 100,
  };
}

function calculateScores(defects: VastuDefect[], strengths: VastuStrength[], makanAukat?: MakanAukatResult): VastuScores {
  const scores = initializeScores();
  let totalPenalty = 0;
  let totalBonus = 0;

  for (const defect of defects) {
    const penalty = defect.severity * 2.6;
    totalPenalty += penalty;
    addPenalty(scores, defect.domains, defect.severity);
  }

  for (const strength of strengths) {
    totalBonus += Math.min(6, strength.score / 2);
  }

  if (makanAukat?.applicable) {
    if (makanAukat.isAuspicious) totalBonus += 3;
    else totalPenalty += 5;
  }

  scores.overall = clampScore(100 - totalPenalty + totalBonus);
  for (const key of Object.keys(scores) as Array<keyof VastuScores>) {
    if (key !== "overall") {
      const domainDirections = DOMAIN_WEIGHTS[key] || [];
      const hasRelevantStrength = strengths.some((s) => {
        const direction = s.title.match(/\b(N|NE|E|SE|S|SW|W|NW|CENTER)\b/)?.[1];
        return direction ? domainDirections.includes(direction) : false;
      });
      if (hasRelevantStrength) scores[key] = clampScore(scores[key] + 3);
      scores[key] = clampScore(scores[key]);
    }
  }

  return scores;
}

function buildSummary(result: Pick<VastuAnalysisResult, "scores" | "defects" | "strengths">): string {
  const critical = result.defects.filter((d) => d.severity >= 9).length;
  const high = result.defects.filter((d) => d.severity >= 7).length;
  if (critical > 0) {
    return `Property score is ${result.scores.overall}/100 with ${critical} critical Vastu concern(s). Prioritize physical corrections first, then no-demolition remedies and kundli-safe symbolic remedies.`;
  }
  if (high > 0) {
    return `Property score is ${result.scores.overall}/100 with ${high} high-priority concern(s). The property has useful strengths, but selected zones need correction.`;
  }
  return `Property score is ${result.scores.overall}/100. The layout is broadly supportive with manageable improvements.`;
}

export function analyzeVastuProperty(input: VastuAnalyzeInput = {}): VastuAnalysisResult {
  const options = { ...DEFAULT_OPTIONS, ...(input.options || {}) };
  const rooms = input.rooms || [];
  let strengths: VastuStrength[] = [];
  let defects: VastuDefect[] = [];
  let recommendations: VastuRecommendation[] = [];

  if (options.includeClassical || options.includeModern) {
    for (const room of rooms) {
      const roomResult = analyzeRoomClassical(room);
      strengths = strengths.concat(roomResult.strengths);
      defects = defects.concat(roomResult.defects);
      recommendations = recommendations.concat(roomResult.recommendations);
    }
  }

  const axis = analyzeAxisFeatures(input);
  strengths = strengths.concat(axis.strengths);
  defects = defects.concat(axis.defects);
  recommendations = recommendations.concat(axis.recommendations);

  if (options.includeLalKitab) {
    const lal = analyzeLalKitab(input);
    strengths = strengths.concat(lal.strengths);
    defects = defects.concat(lal.defects);
    recommendations = recommendations.concat(lal.recommendations);
  }

  if (options.includeConstruction) {
    const construction = analyzeConstruction(input);
    defects = defects.concat(construction.defects);
    recommendations = recommendations.concat(construction.recommendations);
  }

  defects = defects.map((d) => boostSeverityWithKundli(d, input));

  const makanAukat = options.includeAukat ? buildMakanAukat(input) : undefined;
  if (makanAukat?.applicable && !makanAukat.isAuspicious) {
    recommendations.push({
      title: "Makan Aukat correction",
      priority: "medium",
      system: "lal_kitab_makan_vastu",
      requiresKundli: false,
      caution: "This is transcript-based Lal Kitab Makan Vastu logic. Treat as secondary/experimental, not a guaranteed result.",
      steps: makanAukat.remedy || [],
    });
  }

  const scores = calculateScores(defects, strengths, makanAukat);
  const result: VastuAnalysisResult = {
    engineVersion: ENGINE_VERSION,
    summary: buildSummary({ scores, defects, strengths }),
    scores,
    strengths,
    defects,
    recommendations,
    makanAukat,
    correctionPlan: {
      thirtyDay:  ["Identify and address critical defects (severity >= 9) first.", "Deep clean North-East and Brahmasthan.", "Establish compass orientation."],
      sixtyDay:   ["Apply high-priority corrections (severity >= 7).", "Separate fire and water zones in kitchen.", "Stabilize South-West."],
      ninetyDay:  ["Address medium defects and behavioural corrections.", "Evaluate Makan Aukat if applicable.", "Review no-demolition remedy options."],
    },
    mindMakan: {
      physical:    ["Keep North/East lighter and more open than South/West.", "Remove clutter from Brahmasthan.", "Correct critical room placements first."],
      behavioural: ["Reduce harsh speech, anger and domestic conflict.", "House affects mind; mind affects house.", "Remedies improve clarity, not guarantee wealth."],
      routine:     ["Sleep with head in South or East.", "Face East or North while working/studying.", "Wake before sunrise for morning light exposure."],
      emotional:   ["Check South-West stability first if relationships are under pressure.", "Check North-East cleanliness if mental peace is affected."],
      spiritual:   ["Keep pooja room in North-East or East, away from toilet walls.", "Maintain daily North-East cleaning ritual."],
    },
    vastuPurushaHealth: {
      affectedZones: [],
      observations:  ["Run v3 engine for detailed Vastu Purusha health observations."],
    },
    sourcePolicy: SOURCE_POLICY,
    nextSteps: [
      "Confirm compass orientation and room detection manually before final report.",
      "Apply physical corrections before symbolic remedies.",
      "Use Lal Kitab Makan Vastu only as a separate kundli-gated layer.",
      "Avoid fear-based claims; give practical no-demolition steps and behavioural guidance.",
    ],
  };

  return result;
}

export { LAL_KITAB_DIRECTION_KHANA_MAP, ROOM_PLANET_MAP };
