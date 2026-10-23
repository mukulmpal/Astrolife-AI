import type { DivChart, DivPlanet } from "@/lib/astro-engine/divisional";

export type Language = "hinglish" | "hindi" | "english";
export type Planet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";
export type VargaChartName =
  | "D1"
  | "D2"
  | "D3"
  | "D4"
  | "D7"
  | "D9"
  | "D10"
  | "D12"
  | "D16"
  | "D20"
  | "D24"
  | "D27"
  | "D30"
  | "D40"
  | "D45"
  | "D60";

export type VargaDomain =
  | "life_foundation"
  | "wealth_resources"
  | "siblings_courage"
  | "property_home"
  | "children_lineage"
  | "marriage_dharma"
  | "career_status"
  | "parents_ancestors"
  | "comforts_vehicles"
  | "spirituality_sadhana"
  | "education_learning"
  | "strength_resilience"
  | "sensitive_challenges"
  | "maternal_lineage"
  | "paternal_character"
  | "deep_karma";

export type VargaLabel =
  | "excellent_support"
  | "strong_support"
  | "supportive"
  | "mixed"
  | "needs_patience"
  | "needs_careful_handling";

export type SensitivityLevel = "normal" | "mild_sensitive" | "premium_sensitive";

export type DashaInput = {
  mahadasha?: Planet;
  antardasha?: Planet;
  pratyantardasha?: Planet;
};

export type ShodashaVargaInput = {
  language?: Language;
  birthTimeConfidence?: number;
  dasha?: DashaInput;
  charts: DivChart[];
};

export type VargaKeyHouse = {
  house: number;
  meaning: string;
  weight: number;
  sensitivity: SensitivityLevel;
};

export type VargaConfig = {
  chart: VargaChartName;
  domain: VargaDomain;
  title: string;
  shortName: string;
  lagnaMeaning: string;
  lagneshMeaning: string;
  keyHouses: VargaKeyHouse[];
  karakas: Planet[];
  supportiveHouses: number[];
  pressureHouses: number[];
  kpPositiveHouses?: number[];
  kpCautionHouses?: number[];
  requiredBirthTimeConfidence: number;
  description: string;
};

export type VargaSectionResult = {
  chart: VargaChartName;
  domain: VargaDomain;
  title: string;
  shortName: string;
  score: number;
  label: VargaLabel;
  reliability: number;
  confidenceText: string;
  paragraph: string;
  indicators: string[];
  recommendations: string[];
  activatedByDasha: Planet[];
  sensitivity: SensitivityLevel;
  kpPositiveHouses: number[];
  kpCautionHouses: number[];
};

export type UniversalVargaResult = {
  system: "AstroLife Universal Shodasha Varga Intelligence";
  overallScore: number;
  overallLabel: VargaLabel;
  overallNarrative: string;
  sections: VargaSectionResult[];
  strongestAreas: VargaSectionResult[];
  growthAreas: VargaSectionResult[];
  premiumSensitiveAreas: VargaSectionResult[];
  pdfReadyParagraphs: string[];
  chatContext: string;
  guidanceBoundary: string;
};

const SHODASHA_ORDER: VargaChartName[] = [
  "D1",
  "D2",
  "D3",
  "D4",
  "D7",
  "D9",
  "D10",
  "D12",
  "D16",
  "D20",
  "D24",
  "D27",
  "D30",
  "D40",
  "D45",
  "D60",
];

const BENEFICS = new Set<Planet>(["Jupiter", "Venus", "Mercury", "Moon"]);
const PRESSURE_PLANETS = new Set<Planet>(["Sun", "Mars", "Saturn", "Rahu", "Ketu"]);
const PLANETS = new Set<Planet>(["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]);

const PLANET_MEANING: Record<Planet, string> = {
  Sun: "authority, vitality, fatherly guidance and public confidence",
  Moon: "mind, motherly care, emotional stability and nourishment",
  Mars: "courage, land, action, siblings and conflict handling",
  Mercury: "intellect, speech, business, documents and learning",
  Jupiter: "wisdom, children, teachers, dharma and blessings",
  Venus: "marriage, comfort, beauty, relationship harmony and luxury",
  Saturn: "discipline, delay, responsibility, service and endurance",
  Rahu: "ambition, foreign influence, technology and unconventional rise",
  Ketu: "detachment, intuition, research, simplification and moksha",
};

export const shodashaVargaConfigs: Record<VargaChartName, VargaConfig> = {
  D1: {
    chart: "D1",
    domain: "life_foundation",
    title: "D1 Rashi - Main Life Foundation",
    shortName: "Life Foundation",
    lagnaMeaning: "body, personality, life direction and base promise",
    lagneshMeaning: "capacity to deliver the whole chart",
    keyHouses: [
      { house: 1, meaning: "self and body", weight: 14, sensitivity: "normal" },
      { house: 4, meaning: "home and emotional foundation", weight: 10, sensitivity: "normal" },
      { house: 7, meaning: "relationships and public dealings", weight: 10, sensitivity: "normal" },
      { house: 10, meaning: "karma and profession", weight: 12, sensitivity: "normal" },
      { house: 8, meaning: "transformation and vulnerable zone", weight: 8, sensitivity: "mild_sensitive" },
      { house: 12, meaning: "expenses, isolation and release", weight: 7, sensitivity: "mild_sensitive" },
    ],
    karakas: ["Sun", "Moon", "Jupiter", "Saturn"],
    supportiveHouses: [1, 5, 9, 10, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [1, 5, 9, 10, 11],
    kpCautionHouses: [6, 8, 12],
    requiredBirthTimeConfidence: 40,
    description: "D1 is the base promise. Every divisional judgement is read through this foundation.",
  },
  D2: {
    chart: "D2",
    domain: "wealth_resources",
    title: "D2 Hora - Wealth & Resource Capacity",
    shortName: "Wealth",
    lagnaMeaning: "earning instinct and money identity",
    lagneshMeaning: "capacity to retain wealth and use resources wisely",
    keyHouses: [
      { house: 1, meaning: "wealth identity", weight: 10, sensitivity: "normal" },
      { house: 2, meaning: "stored wealth and family resources", weight: 14, sensitivity: "normal" },
      { house: 5, meaning: "judgement and merit", weight: 9, sensitivity: "normal" },
      { house: 9, meaning: "fortune in resources", weight: 10, sensitivity: "normal" },
      { house: 11, meaning: "income and gains", weight: 14, sensitivity: "normal" },
      { house: 12, meaning: "resource leakage", weight: 8, sensitivity: "mild_sensitive" },
    ],
    karakas: ["Jupiter", "Venus", "Mercury", "Moon"],
    supportiveHouses: [1, 2, 5, 9, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [2, 5, 9, 11],
    kpCautionHouses: [6, 8, 12],
    requiredBirthTimeConfidence: 55,
    description: "D2 shows wealth capacity, saving style, resource stability and earning attitude.",
  },
  D3: {
    chart: "D3",
    domain: "siblings_courage",
    title: "D3 Drekkana - Siblings, Courage & Self-Effort",
    shortName: "Courage",
    lagnaMeaning: "courage identity and sibling pattern",
    lagneshMeaning: "capacity to act, compete and sustain effort",
    keyHouses: [
      { house: 1, meaning: "self-effort", weight: 10, sensitivity: "normal" },
      { house: 3, meaning: "courage, skills and younger siblings", weight: 15, sensitivity: "normal" },
      { house: 6, meaning: "competition and conflict handling", weight: 8, sensitivity: "mild_sensitive" },
      { house: 10, meaning: "effort converted into action", weight: 8, sensitivity: "normal" },
      { house: 11, meaning: "elder siblings and network support", weight: 12, sensitivity: "normal" },
    ],
    karakas: ["Mars", "Mercury", "Saturn"],
    supportiveHouses: [1, 3, 6, 10, 11],
    pressureHouses: [8, 12],
    kpPositiveHouses: [3, 6, 10, 11],
    kpCautionHouses: [8, 12],
    requiredBirthTimeConfidence: 60,
    description: "D3 reads siblings, courage, personal effort, competition and practical skill.",
  },
  D4: {
    chart: "D4",
    domain: "property_home",
    title: "D4 Chaturthamsha - Property, Home & Fixed Assets",
    shortName: "Property",
    lagnaMeaning: "property capacity and home stability",
    lagneshMeaning: "capacity to acquire, maintain and protect assets",
    keyHouses: [
      { house: 1, meaning: "asset capacity", weight: 10, sensitivity: "normal" },
      { house: 4, meaning: "home, land, vehicles and peace", weight: 16, sensitivity: "normal" },
      { house: 8, meaning: "inheritance and sudden property events", weight: 12, sensitivity: "premium_sensitive" },
      { house: 10, meaning: "real-estate action", weight: 8, sensitivity: "normal" },
      { house: 12, meaning: "sale, relocation or distance", weight: 12, sensitivity: "premium_sensitive" },
    ],
    karakas: ["Mars", "Moon", "Venus", "Saturn"],
    supportiveHouses: [1, 4, 5, 9, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [4, 11],
    kpCautionHouses: [6, 8, 12],
    requiredBirthTimeConfidence: 65,
    description: "D4 explains property, home, vehicles, ancestral assets and residential stability.",
  },
  D7: {
    chart: "D7",
    domain: "children_lineage",
    title: "D7 Saptamsha - Children, Parenting & Lineage",
    shortName: "Children",
    lagnaMeaning: "lineage readiness and parenting orientation",
    lagneshMeaning: "capacity to deliver children-related promise",
    keyHouses: [
      { house: 1, meaning: "lineage readiness", weight: 10, sensitivity: "normal" },
      { house: 2, meaning: "family expansion", weight: 10, sensitivity: "normal" },
      { house: 5, meaning: "children and creativity", weight: 18, sensitivity: "mild_sensitive" },
      { house: 9, meaning: "blessings of lineage", weight: 10, sensitivity: "normal" },
      { house: 11, meaning: "fulfilment and support", weight: 10, sensitivity: "normal" },
      { house: 8, meaning: "children-delay or patience zone", weight: 10, sensitivity: "premium_sensitive" },
    ],
    karakas: ["Jupiter", "Moon", "Venus"],
    supportiveHouses: [1, 2, 5, 9, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [2, 5, 11],
    kpCautionHouses: [1, 4, 6, 8, 10, 12],
    requiredBirthTimeConfidence: 70,
    description: "D7 is the children, parenting, creative legacy and family-expansion chart.",
  },
  D9: {
    chart: "D9",
    domain: "marriage_dharma",
    title: "D9 Navamsha - Marriage, Dharma & Maturity",
    shortName: "Marriage",
    lagnaMeaning: "marriage readiness, dharma and inner maturity",
    lagneshMeaning: "capacity to deliver marriage and dharmic promise",
    keyHouses: [
      { house: 1, meaning: "inner maturity", weight: 12, sensitivity: "normal" },
      { house: 2, meaning: "family speech after marriage", weight: 8, sensitivity: "normal" },
      { house: 4, meaning: "domestic happiness", weight: 12, sensitivity: "normal" },
      { house: 7, meaning: "spouse and marriage condition", weight: 18, sensitivity: "normal" },
      { house: 8, meaning: "continuity and sensitive adjustment", weight: 14, sensitivity: "premium_sensitive" },
      { house: 9, meaning: "dharma and duties", weight: 10, sensitivity: "normal" },
      { house: 12, meaning: "distance or foreign relationship theme", weight: 8, sensitivity: "mild_sensitive" },
    ],
    karakas: ["Venus", "Jupiter", "Moon"],
    supportiveHouses: [1, 4, 5, 7, 9, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [2, 7, 11],
    kpCautionHouses: [6, 8, 12],
    requiredBirthTimeConfidence: 65,
    description: "D9 refines marriage, dharma, maturity, spouse quality and the deeper promise of planets.",
  },
  D10: {
    chart: "D10",
    domain: "career_status",
    title: "D10 Dashamsha - Career, Karma & Status",
    shortName: "Career",
    lagnaMeaning: "career identity and public karma",
    lagneshMeaning: "capacity to deliver profession and reputation",
    keyHouses: [
      { house: 1, meaning: "career identity", weight: 10, sensitivity: "normal" },
      { house: 2, meaning: "income through profession", weight: 10, sensitivity: "normal" },
      { house: 6, meaning: "job, service and competition", weight: 12, sensitivity: "normal" },
      { house: 7, meaning: "business, clients and public dealings", weight: 10, sensitivity: "normal" },
      { house: 10, meaning: "profession and authority", weight: 18, sensitivity: "normal" },
      { house: 11, meaning: "career gains and networks", weight: 14, sensitivity: "normal" },
    ],
    karakas: ["Sun", "Saturn", "Mercury", "Jupiter", "Rahu"],
    supportiveHouses: [1, 2, 6, 10, 11],
    pressureHouses: [8, 12],
    kpPositiveHouses: [2, 6, 10, 11],
    kpCautionHouses: [8, 12],
    requiredBirthTimeConfidence: 65,
    description: "D10 shows career delivery, professional authority, job/business direction and reputation.",
  },
  D12: {
    chart: "D12",
    domain: "parents_ancestors",
    title: "D12 Dwadashamsha - Parents, Ancestry & Family Lineage",
    shortName: "Ancestry",
    lagnaMeaning: "inherited family conditioning",
    lagneshMeaning: "capacity to process family karma maturely",
    keyHouses: [
      { house: 1, meaning: "ancestral imprint on self", weight: 10, sensitivity: "normal" },
      { house: 4, meaning: "mother line and home conditioning", weight: 14, sensitivity: "mild_sensitive" },
      { house: 8, meaning: "hidden ancestral residue", weight: 14, sensitivity: "premium_sensitive" },
      { house: 9, meaning: "father line and lineage blessings", weight: 14, sensitivity: "mild_sensitive" },
      { house: 12, meaning: "ancestral release", weight: 10, sensitivity: "premium_sensitive" },
    ],
    karakas: ["Sun", "Moon", "Saturn", "Rahu", "Ketu"],
    supportiveHouses: [1, 4, 5, 9, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [4, 9],
    kpCautionHouses: [6, 8, 12],
    requiredBirthTimeConfidence: 70,
    description: "D12 reads parents, mother-line, father-line, ancestral habits and repeated family patterns.",
  },
  D16: {
    chart: "D16",
    domain: "comforts_vehicles",
    title: "D16 Shodashamsha - Comforts, Vehicles & Lifestyle Happiness",
    shortName: "Comforts",
    lagnaMeaning: "comfort identity and lifestyle orientation",
    lagneshMeaning: "capacity to enjoy comforts without instability",
    keyHouses: [
      { house: 1, meaning: "comfort identity", weight: 10, sensitivity: "normal" },
      { house: 4, meaning: "vehicles and home comfort", weight: 16, sensitivity: "normal" },
      { house: 8, meaning: "repair or sudden vehicle sensitivity", weight: 10, sensitivity: "premium_sensitive" },
      { house: 11, meaning: "comfort gains", weight: 10, sensitivity: "normal" },
      { house: 12, meaning: "luxury expense", weight: 10, sensitivity: "mild_sensitive" },
    ],
    karakas: ["Venus", "Moon", "Mars", "Saturn"],
    supportiveHouses: [1, 4, 5, 9, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [4, 11],
    kpCautionHouses: [6, 8, 12],
    requiredBirthTimeConfidence: 75,
    description: "D16 explains vehicles, comforts, lifestyle stability, luxury and comfort responsibility.",
  },
  D20: {
    chart: "D20",
    domain: "spirituality_sadhana",
    title: "D20 Vimshamsha - Spirituality, Sadhana & Inner Path",
    shortName: "Sadhana",
    lagnaMeaning: "spiritual identity and sadhana orientation",
    lagneshMeaning: "capacity to sustain spiritual discipline",
    keyHouses: [
      { house: 1, meaning: "spiritual identity", weight: 10, sensitivity: "normal" },
      { house: 5, meaning: "mantra and purva punya", weight: 14, sensitivity: "normal" },
      { house: 8, meaning: "occult depth and transformation", weight: 12, sensitivity: "mild_sensitive" },
      { house: 9, meaning: "guru and dharma", weight: 16, sensitivity: "normal" },
      { house: 12, meaning: "moksha and surrender", weight: 14, sensitivity: "mild_sensitive" },
    ],
    karakas: ["Jupiter", "Ketu", "Saturn", "Moon"],
    supportiveHouses: [1, 4, 5, 8, 9, 12],
    pressureHouses: [6],
    kpPositiveHouses: [4, 8, 9, 12],
    kpCautionHouses: [6],
    requiredBirthTimeConfidence: 80,
    description: "D20 shows spiritual practice, mantra, devotion, guru connection and inner discipline.",
  },
  D24: {
    chart: "D24",
    domain: "education_learning",
    title: "D24 Chaturvimshamsha - Education, Learning & Knowledge",
    shortName: "Education",
    lagnaMeaning: "learning identity and academic orientation",
    lagneshMeaning: "capacity to complete education and absorb knowledge",
    keyHouses: [
      { house: 1, meaning: "learning identity", weight: 10, sensitivity: "normal" },
      { house: 2, meaning: "memory and knowledge storage", weight: 10, sensitivity: "normal" },
      { house: 4, meaning: "formal education", weight: 14, sensitivity: "normal" },
      { house: 5, meaning: "intelligence and merit", weight: 16, sensitivity: "normal" },
      { house: 9, meaning: "higher education and teachers", weight: 14, sensitivity: "normal" },
      { house: 10, meaning: "knowledge applied to profession", weight: 8, sensitivity: "normal" },
    ],
    karakas: ["Mercury", "Jupiter", "Moon", "Sun"],
    supportiveHouses: [1, 2, 4, 5, 9, 10, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [2, 4, 5, 9, 11],
    kpCautionHouses: [6, 8, 12],
    requiredBirthTimeConfidence: 80,
    description: "D24 reads education, learning style, degree completion, teachers and applied knowledge.",
  },
  D27: {
    chart: "D27",
    domain: "strength_resilience",
    title: "D27 Bhamsha - Strength, Weakness & Resilience",
    shortName: "Resilience",
    lagnaMeaning: "inner strength and endurance identity",
    lagneshMeaning: "capacity to recover from pressure",
    keyHouses: [
      { house: 1, meaning: "resilience identity", weight: 12, sensitivity: "normal" },
      { house: 3, meaning: "courage and effort", weight: 12, sensitivity: "normal" },
      { house: 6, meaning: "resistance under pressure", weight: 10, sensitivity: "normal" },
      { house: 8, meaning: "deep stress response", weight: 10, sensitivity: "mild_sensitive" },
      { house: 10, meaning: "strength in action", weight: 8, sensitivity: "normal" },
    ],
    karakas: ["Mars", "Saturn", "Sun", "Ketu"],
    supportiveHouses: [1, 3, 6, 10, 11],
    pressureHouses: [8, 12],
    kpPositiveHouses: [1, 3, 6, 10],
    kpCautionHouses: [8, 12],
    requiredBirthTimeConfidence: 82,
    description: "D27 shows innate resilience, physical-mental toughness and pressure-handling ability.",
  },
  D30: {
    chart: "D30",
    domain: "sensitive_challenges",
    title: "D30 Trimshamsha - Obstacles, Vulnerabilities & Correction",
    shortName: "Challenge Repair",
    lagnaMeaning: "sensitive challenge pattern",
    lagneshMeaning: "capacity to handle obstacles with maturity",
    keyHouses: [
      { house: 1, meaning: "personal vulnerability", weight: 12, sensitivity: "premium_sensitive" },
      { house: 6, meaning: "conflict and disease pressure", weight: 12, sensitivity: "premium_sensitive" },
      { house: 8, meaning: "deep obstruction", weight: 14, sensitivity: "premium_sensitive" },
      { house: 12, meaning: "loss, isolation or expense", weight: 12, sensitivity: "premium_sensitive" },
    ],
    karakas: ["Saturn", "Mars", "Rahu", "Ketu"],
    supportiveHouses: [3, 6, 10, 11],
    pressureHouses: [1, 8, 12],
    kpPositiveHouses: [3, 6, 10, 11],
    kpCautionHouses: [1, 8, 12],
    requiredBirthTimeConfidence: 85,
    description: "D30 is a correction chart for obstacles, vulnerable areas and maturity-based remedies.",
  },
  D40: {
    chart: "D40",
    domain: "maternal_lineage",
    title: "D40 Khavedamsha - Maternal Blessings & Subtle Auspiciousness",
    shortName: "Maternal Karma",
    lagnaMeaning: "subtle auspiciousness from maternal lineage",
    lagneshMeaning: "capacity to receive and carry maternal blessings",
    keyHouses: [
      { house: 1, meaning: "maternal imprint", weight: 10, sensitivity: "mild_sensitive" },
      { house: 4, meaning: "mother-line comfort", weight: 14, sensitivity: "mild_sensitive" },
      { house: 8, meaning: "hidden maternal residue", weight: 12, sensitivity: "premium_sensitive" },
      { house: 9, meaning: "blessings and dharma", weight: 12, sensitivity: "normal" },
    ],
    karakas: ["Moon", "Venus", "Jupiter", "Saturn"],
    supportiveHouses: [1, 4, 5, 9, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [4, 9, 11],
    kpCautionHouses: [6, 8, 12],
    requiredBirthTimeConfidence: 90,
    description: "D40 refines maternal blessings, subtle auspiciousness and family-line support.",
  },
  D45: {
    chart: "D45",
    domain: "paternal_character",
    title: "D45 Akshavedamsha - Character, Values & Paternal Imprint",
    shortName: "Character",
    lagnaMeaning: "character quality and inherited value system",
    lagneshMeaning: "capacity to live values under pressure",
    keyHouses: [
      { house: 1, meaning: "character imprint", weight: 12, sensitivity: "normal" },
      { house: 5, meaning: "virtue and refinement", weight: 10, sensitivity: "normal" },
      { house: 9, meaning: "paternal dharma and values", weight: 14, sensitivity: "mild_sensitive" },
      { house: 10, meaning: "public integrity", weight: 10, sensitivity: "normal" },
    ],
    karakas: ["Sun", "Jupiter", "Saturn", "Mercury"],
    supportiveHouses: [1, 5, 9, 10, 11],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [1, 5, 9, 10],
    kpCautionHouses: [6, 8, 12],
    requiredBirthTimeConfidence: 90,
    description: "D45 shows character quality, inherited values, public integrity and moral refinement.",
  },
  D60: {
    chart: "D60",
    domain: "deep_karma",
    title: "D60 Shastiamsha - Deep Karma & Past-Life Residue",
    shortName: "Deep Karma",
    lagnaMeaning: "deep karmic seed carried into this birth",
    lagneshMeaning: "capacity to digest subtle karmic lessons",
    keyHouses: [
      { house: 1, meaning: "deep karmic identity", weight: 14, sensitivity: "premium_sensitive" },
      { house: 5, meaning: "past merit", weight: 10, sensitivity: "mild_sensitive" },
      { house: 8, meaning: "deep karmic transformation", weight: 16, sensitivity: "premium_sensitive" },
      { house: 9, meaning: "past dharma", weight: 12, sensitivity: "mild_sensitive" },
      { house: 12, meaning: "release and moksha", weight: 12, sensitivity: "premium_sensitive" },
    ],
    karakas: ["Saturn", "Ketu", "Jupiter", "Rahu"],
    supportiveHouses: [1, 5, 9, 12],
    pressureHouses: [6, 8, 12],
    kpPositiveHouses: [5, 9, 12],
    kpCautionHouses: [6, 8],
    requiredBirthTimeConfidence: 95,
    description: "D60 is the most sensitive refinement chart. It should be read softly unless birth time is rectified.",
  },
};

function asPlanet(value: string): Planet | null {
  return PLANETS.has(value as Planet) ? value as Planet : null;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function labelFromScore(score: number): VargaLabel {
  if (score >= 82) return "excellent_support";
  if (score >= 72) return "strong_support";
  if (score >= 62) return "supportive";
  if (score >= 50) return "mixed";
  if (score >= 38) return "needs_patience";
  return "needs_careful_handling";
}

export function formatVargaLabel(label: VargaLabel): string {
  return label.replaceAll("_", " ");
}

function planetStrength(planet: DivPlanet): number {
  if (planet.dignity === "Exalted") return 16;
  if (planet.dignity === "Own") return 12;
  if (planet.dignity === "Debilitated") return -14;
  if (planet.inLagna) return 5;
  return 0;
}

function sensitivityRank(level: SensitivityLevel): number {
  if (level === "premium_sensitive") return 3;
  if (level === "mild_sensitive") return 2;
  return 1;
}

function getSensitivity(config: VargaConfig, planets: DivPlanet[]): SensitivityLevel {
  const keySensitive = config.keyHouses.reduce<SensitivityLevel>((highest, house) => (
    sensitivityRank(house.sensitivity) > sensitivityRank(highest) ? house.sensitivity : highest
  ), "normal");
  const hasPressureOnSensitive = planets.some((planet) => {
    const keyHouse = config.keyHouses.find((item) => item.house === planet.house);
    return keyHouse?.sensitivity === "premium_sensitive" && PRESSURE_PLANETS.has(planet.planet as Planet);
  });
  return hasPressureOnSensitive ? "premium_sensitive" : keySensitive;
}

function reliabilityFor(config: VargaConfig, birthTimeConfidence: number): number {
  const penalty = Math.max(0, config.requiredBirthTimeConfidence - birthTimeConfidence);
  return clamp(birthTimeConfidence - penalty * 0.9);
}

function confidenceText(reliability: number, sensitivity: SensitivityLevel): string {
  if (reliability >= 88 && sensitivity === "normal") return "High confidence";
  if (reliability >= 75) return "Good confidence";
  if (sensitivity === "premium_sensitive") return "Birth-time sensitive";
  return "Use as refinement";
}

function scoreChart(chart: DivChart, config: VargaConfig, d1?: DivChart, dasha?: DashaInput) {
  let score = 50;
  const indicators: string[] = [];
  const recommendations: string[] = [];
  const activatedByDasha: Planet[] = [];

  const lagnaPlanets = chart.planets.filter((planet) => planet.house === 1);
  if (lagnaPlanets.length) {
    const names = lagnaPlanets.map((planet) => planet.planet).join(", ");
    indicators.push(`${names} influence ${config.chart} Lagna, so this domain becomes visible in personality and life decisions.`);
    score += lagnaPlanets.reduce((sum, planet) => sum + (BENEFICS.has(planet.planet as Planet) ? 5 : PRESSURE_PLANETS.has(planet.planet as Planet) ? -2 : 0), 0);
  }

  for (const keyHouse of config.keyHouses) {
    const occupants = chart.planets.filter((planet) => planet.house === keyHouse.house);
    if (!occupants.length) continue;
    const names = occupants.map((planet) => planet.planet).join(", ");
    indicators.push(`House ${keyHouse.house} is active through ${names}; this directly touches ${keyHouse.meaning}.`);
    const beneficCount = occupants.filter((planet) => BENEFICS.has(planet.planet as Planet)).length;
    const pressureCount = occupants.filter((planet) => PRESSURE_PLANETS.has(planet.planet as Planet)).length;
    score += beneficCount * Math.min(8, keyHouse.weight);
    score -= pressureCount * Math.min(5, keyHouse.weight);
  }

  for (const planet of chart.planets) {
    const strength = planetStrength(planet);
    if (strength) {
      score += config.karakas.includes(planet.planet as Planet) ? strength : Math.round(strength * 0.55);
    }
  }

  for (const karaka of config.karakas) {
    const placement = chart.planets.find((planet) => planet.planet === karaka);
    if (!placement) continue;
    if (placement.dignity === "Exalted" || placement.dignity === "Own") {
      indicators.push(`${karaka} is strong in ${config.chart}; because ${karaka} represents ${PLANET_MEANING[karaka]}, this supports the domain.`);
    }
    if (placement.dignity === "Debilitated") {
      indicators.push(`${karaka} is weak in ${config.chart}; the domain needs maturity, patience and practical correction.`);
      recommendations.push(`For ${karaka}, prefer disciplined conduct and soft remedies before intense gemstone or donation decisions.`);
    }
  }

  if (d1) {
    const d1Strong = d1.planets.filter((planet) => planet.dignity === "Exalted" || planet.dignity === "Own");
    const confirmed = d1Strong.filter((planet) => chart.planets.some((item) => item.planet === planet.planet && (item.dignity === "Exalted" || item.dignity === "Own" || item.house === 1)));
    if (confirmed.length) {
      score += Math.min(12, confirmed.length * 4);
      indicators.push(`D1 promise is confirmed by ${confirmed.map((planet) => planet.planet).join(", ")} in ${config.chart}; results become more dependable.`);
    }
  }

  const dashaPlanets = [dasha?.mahadasha, dasha?.antardasha, dasha?.pratyantardasha].filter(Boolean) as Planet[];
  for (const planet of dashaPlanets) {
    const placement = chart.planets.find((item) => item.planet === planet);
    if (!placement) continue;
    activatedByDasha.push(planet);
    score += config.karakas.includes(planet) ? 7 : 3;
  }

  if (activatedByDasha.length) {
    indicators.push(`Current dasha activates ${activatedByDasha.join(", ")} in ${config.chart}, so this area is not theoretical; it is timing-relevant now.`);
  }

  const pressurePlanets = chart.planets.filter((planet) => config.pressureHouses.includes(planet.house));
  if (pressurePlanets.length) {
    recommendations.push(`${pressurePlanets.map((planet) => planet.planet).join(", ")} sit in pressure houses of ${config.chart}; act slowly, avoid fear decisions and use practical discipline.`);
  }

  if (!recommendations.length) {
    recommendations.push(`Use ${config.chart} as a refinement layer: first confirm D1 promise, then read dasha, then act according to timing.`);
  }

  return {
    score: clamp(score),
    indicators: indicators.slice(0, 6),
    recommendations: recommendations.slice(0, 4),
    activatedByDasha: Array.from(new Set(activatedByDasha)),
  };
}

function buildParagraph(
  chart: DivChart,
  config: VargaConfig,
  score: number,
  label: VargaLabel,
  indicators: string[],
  activatedByDasha: Planet[],
  reliability: number,
): string {
  const activeLine = activatedByDasha.length
    ? ` Current dasha activates ${activatedByDasha.join(", ")}, so this varga deserves extra attention in the present period.`
    : " When its planets run in dasha or connect with major transits, this varga becomes more visible.";
  const indicatorLine = indicators.length
    ? ` The main observed indicators are: ${indicators.slice(0, 3).join(" ")}`
    : ` The chart is balanced enough to be read through its lagna, key houses and karaka planets.`;

  return `${config.title} studies ${config.description.toLowerCase()} In this chart the ${chart.lagna} ${config.chart} Lagna shows ${config.lagnaMeaning}, while the key-house pattern gives a ${formatVargaLabel(label)} result with ${score}/100 strength.${indicatorLine}${activeLine} Reliability is ${reliability}/100, so the reading should be used as a practical refinement of the birth chart rather than a detached prediction.`;
}

export function analyzeUniversalShodashaVarga(input: ShodashaVargaInput): UniversalVargaResult {
  const birthTimeConfidence = input.birthTimeConfidence ?? 82;
  const chartsByKey = new Map(input.charts.map((chart) => [chart.key, chart]));
  const d1 = chartsByKey.get("D1");

  const sections = SHODASHA_ORDER
    .map((key): VargaSectionResult | null => {
      const chart = chartsByKey.get(key);
      if (!chart) return null;
      const config = shodashaVargaConfigs[key];
      const scored = scoreChart(chart, config, d1, input.dasha);
      const label = labelFromScore(scored.score);
      const sensitivity = getSensitivity(config, chart.planets);
      const reliability = reliabilityFor(config, birthTimeConfidence);
      return {
        chart: key,
        domain: config.domain,
        title: config.title,
        shortName: config.shortName,
        score: scored.score,
        label,
        reliability,
        confidenceText: confidenceText(reliability, sensitivity),
        paragraph: buildParagraph(chart, config, scored.score, label, scored.indicators, scored.activatedByDasha, reliability),
        indicators: scored.indicators,
        recommendations: scored.recommendations,
        activatedByDasha: scored.activatedByDasha,
        sensitivity,
        kpPositiveHouses: config.kpPositiveHouses ?? [],
        kpCautionHouses: config.kpCautionHouses ?? [],
      };
    })
    .filter(Boolean) as VargaSectionResult[];

  const overallScore = clamp(sections.reduce((sum, section) => sum + section.score, 0) / Math.max(1, sections.length));
  const overallLabel = labelFromScore(overallScore);
  const strongestAreas = [...sections].sort((a, b) => b.score - a.score).slice(0, 4);
  const growthAreas = [...sections].sort((a, b) => a.score - b.score).slice(0, 4);
  const premiumSensitiveAreas = sections.filter((section) => section.sensitivity === "premium_sensitive" || section.reliability < 75);

  const overallNarrative = `AstroLife Universal Shodasha Varga reading gives an overall ${overallScore}/100 ${formatVargaLabel(overallLabel)} pattern. Strongest support appears through ${strongestAreas.map((section) => section.shortName).join(", ") || "balanced domains"}. Growth areas are ${growthAreas.map((section) => section.shortName).join(", ") || "not strongly marked"}. This system first respects D1 promise, then checks the relevant varga, then gives extra weight to dasha activation and birth-time confidence.`;

  const pdfReadyParagraphs = [
    overallNarrative,
    ...strongestAreas.map((section) => section.paragraph),
    ...growthAreas.map((section) => section.paragraph),
  ];

  const chatContext = [
    `Universal Shodasha Varga score: ${overallScore}/100 ${formatVargaLabel(overallLabel)}.`,
    `Strongest: ${strongestAreas.map((section) => `${section.chart} ${section.shortName} ${section.score}`).join("; ")}.`,
    `Growth: ${growthAreas.map((section) => `${section.chart} ${section.shortName} ${section.score}`).join("; ")}.`,
    `Sensitive: ${premiumSensitiveAreas.map((section) => `${section.chart} ${section.shortName}`).join(", ") || "none prominent"}.`,
  ].join(" ");

  return {
    system: "AstroLife Universal Shodasha Varga Intelligence",
    overallScore,
    overallLabel,
    overallNarrative,
    sections,
    strongestAreas,
    growthAreas,
    premiumSensitiveAreas,
    pdfReadyParagraphs,
    chatContext,
    guidanceBoundary: "D40, D45 and D60 are birth-time sensitive, so their wording is used as refinement. Final life decisions should rely on D1 promise, dasha and repeated confirmation.",
  };
}

export function extractDashaInput(chart: unknown): DashaInput | undefined {
  if (!chart || typeof chart !== "object") return undefined;
  const raw = chart as Record<string, unknown>;
  const dashas = Array.isArray(raw.dashas) ? raw.dashas as Array<Record<string, unknown>> : [];
  const antardasha = Array.isArray(raw.antardasha) ? raw.antardasha as Array<Record<string, unknown>> : [];
  const md = dashas.find((entry) => entry.active) ?? dashas[0];
  const ad = antardasha.find((entry) => entry.active) ?? antardasha[0];
  const mahadasha = typeof md?.planet === "string" ? asPlanet(md.planet) : null;
  const antar = typeof ad?.planet === "string" ? asPlanet(ad.planet) : null;

  if (!mahadasha && !antar) return undefined;
  return {
    mahadasha: mahadasha ?? undefined,
    antardasha: antar ?? undefined,
  };
}

