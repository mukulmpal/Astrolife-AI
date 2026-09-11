/*
 * AstroLife Mangal Dosha Intelligence Engine
 * -------------------------------------------
 * Standalone, dependency-free TypeScript rule engine.
 *
 * Design goals:
 * - Explainable multi-source detection (Lagna, Moon, Venus)
 * - Separate structural presence, Mars power, affliction, marriage vulnerability,
 *   protection, timing activation, and constructive potential
 * - Preserve traditional rules without treating disputed cancellations as absolute
 * - Gender-neutral, non-fatalistic, and safe remedy guidance
 */

export type Sign = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type House = Sign;

export type PlanetName =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type ManglikSchool = "core" | "expanded" | "extended";
export type ReferencePoint = "Lagna" | "Moon" | "Venus";
export type Confidence = "high" | "medium" | "low" | "disputed";
export type CalculationStatus = "complete" | "partial" | "invalid";
export type SourceTier =
  | "classical_attributed"
  | "traditional_secondary"
  | "modern_interpretive"
  | "product_synthesis";

export interface PlanetPlacement {
  sign: Sign;
  degree: number;
  house?: House;
  retrograde?: boolean;
  combust?: boolean;
  shadbalaRatio?: number;
  nakshatraLord?: PlanetName;
  flags?: {
    gandanta?: boolean;
    signSandhi?: boolean;
    planetaryWarDefeated?: boolean;
    papakartari?: boolean;
    nakshatraLordAfflicted?: boolean;
    customAfflictionPoints?: number;
    customProtectionPoints?: number;
  };
}

export interface ChartSnapshot {
  ascendantSign: Sign;
  planets: Partial<Record<PlanetName, PlanetPlacement>>;
  navamsha?: ChartSnapshot;
}

export interface DashaState {
  mahadasha?: PlanetName;
  antardasha?: PlanetName;
  pratyantardasha?: PlanetName;
}

export interface TransitState {
  planets?: Partial<Record<PlanetName, PlanetPlacement>>;
}

export interface MangalDoshaInput {
  natal: ChartSnapshot;
  dasha?: DashaState;
  transits?: TransitState;
  school?: ManglikSchool;
  includeTraditionalExceptions?: boolean;
}

export interface RuleEvidence {
  ruleId: string;
  title: string;
  effect: "increase" | "decrease" | "information";
  points: number;
  confidence: Confidence;
  sourceTier: SourceTier;
  explanation: string;
  tradition?: "classical" | "muhurta" | "traditional" | "modern" | "astrolife_calibrated";
  sourceTitle?: string;
  sourcePage?: number;
  disputed?: boolean;
  safetyNote?: string;
}

export interface ReferenceHit {
  reference: ReferencePoint;
  house: House;
  referenceWeight: number;
  houseWeight: number;
  activeInSchool: boolean;
  reason: string;
}

export interface SchoolDetection {
  school: ManglikSchool;
  houses: readonly House[];
  present: boolean;
  hits: ReferenceHit[];
}

export interface ScoreBreakdown {
  structural: number;
  marsPower: number;
  marsAffliction: number;
  marriageVulnerability: number;
  protection: number;
  natalSeverity: number;
  constructivePotential: number;
  activation: number | null;
  currentExpression: number | null;
}

export interface RemedyRecommendation {
  category: "practical" | "spiritual" | "traditional_optional" | "gemstone";
  priority: "primary" | "secondary" | "optional";
  title: string;
  instruction: string;
  caution?: string;
  costBand?: "free" | "low" | "variable";
  effortLevel?: "easy" | "moderate" | "intensive";
  requiresExpert?: boolean;
  eligibleWhen?: string[];
  avoidWhen?: string[];
  confidence?: "practical" | "traditional" | "disputed";
  faithPreference?: string[];
  healthContraindications?: string[];
  legalEnvironmentalCheck?: boolean;
}

export type GemstoneSafetyStatus =
  | "eligible_for_expert_review"
  | "conditionally_eligible"
  | "not_recommended"
  | "insufficient_data";

export interface GemstoneSafety {
  status: GemstoneSafetyStatus;
  title: string;
  reasoning: string[];
  caution: string;
  requiresExpert: boolean;
}

export interface CancellationFactor {
  ruleId: string;
  title: string;
  effect: "protection" | "partial_mitigation" | "traditional_exception";
  points: number;
  confidence: "strong" | "moderate" | "disputed";
  explanation: string;
  hardCancellation: false;
}

export interface TraditionalConcentration {
  label: "None" | "Dviguna Manglik" | "Triguna Manglik" | "Bhauma Panchak";
  associatedMalefics: PlanetName[];
  explanation: string;
  modernInterpretation: string;
}

export interface MangalDoshaResult {
  engineVersion: string;
  rulePackVersion: string;
  scoreModelVersion: string;
  ayanamsha: string;
  houseSystem: string;
  generatedAt: string;
  calculationStatus: CalculationStatus;
  dataQualityScore: number;
  missingInputs: string[];
  warnings: string[];
  selectedSchool: ManglikSchool;
  schoolDetections: Record<ManglikSchool, SchoolDetection>;
  scores: ScoreBreakdown;
  severityLabel:
    | "Insufficient data for Manglik assessment"
    | "No meaningful Manglik influence"
    | "Mild Mars relationship influence"
    | "Conditional Manglik"
    | "Moderate Manglik"
    | "Strong Manglik pattern"
    | "Severe multi-factor Mars affliction";
  activationLabel: "not_calculated" | "dormant" | "low" | "moderate" | "high" | "peak";
  functionalNature: {
    score: number;
    label: "highly_supportive" | "supportive" | "mixed" | "challenging";
    explanation: string;
  };
  marsExpression:
    | "constructive_warrior"
    | "intense_but_manageable"
    | "dominating_or_explosive"
    | "frustrated_or_internalized"
    | "low_assertion";
  confirmationCount: number;
  scoreConfidence: "high" | "medium" | "limited";
  traditionalConcentration: TraditionalConcentration;
  cancellationFactors: CancellationFactor[];
  riskDomains: string[];
  constructiveThemes: string[];
  evidence: RuleEvidence[];
  gemstoneSafety: GemstoneSafety;
  remedies: RemedyRecommendation[];
  safetyNotes: string[];
}

export interface PartnerDomainCompatibility {
  domain: string;
  personAActive: boolean;
  personBActive: boolean;
  score: number;
  interpretation: string;
}

export interface TimingOverlap {
  score: number;
  label: "supportive_timing_buffer" | "manageable_timing_overlap" | "sensitive_overlap" | "high_pressure_overlap";
  sharedActivators: string[];
  interpretation: string;
}

export interface ExpressionCompatibility {
  score: number;
  label: "same_style" | "complementary" | "mixed" | "mismatch";
  interpretation: string;
}

export interface ManglikCompatibilityResult {
  personA: MangalDoshaResult;
  personB: MangalDoshaResult;
  severityDelta: number;
  balanceScore: number;
  structuralOverlapScore: number;
  traditionalPaapBalance: {
    personA: number;
    personB: number;
    difference: number;
  };
  label:
    | "well_balanced_mars_intensity"
    | "manageable_mars_difference"
    | "notable_mars_mismatch"
    | "major_mars_expression_mismatch";
  domainCompatibility: PartnerDomainCompatibility[];
  expressionCompatibility: ExpressionCompatibility;
  timingOverlap: TimingOverlap;
  remedyStrategy: string[];
  interpretation: string[];
  disclaimer: string;
}

export interface MangalDoshaRuleDescriptor {
  id: string;
  title: string;
  sourceTier: SourceTier;
  confidence: Confidence;
  hardCancellation: false;
  description: string;
}

export const ENGINE_VERSION = "2.0.0";
export const RULE_PACK_VERSION = "MD-2026.06";
export const SCORE_MODEL_VERSION = "MD-SCORE-2";
export const DEFAULT_AYANAMSHA = "Lahiri";
export const DEFAULT_HOUSE_SYSTEM = "Whole Sign";

export const SIGN_NAMES: Record<Sign, string> = {
  1: "Aries",
  2: "Taurus",
  3: "Gemini",
  4: "Cancer",
  5: "Leo",
  6: "Virgo",
  7: "Libra",
  8: "Scorpio",
  9: "Sagittarius",
  10: "Capricorn",
  11: "Aquarius",
  12: "Pisces",
};

export const SCHOOL_HOUSES: Record<ManglikSchool, readonly House[]> = {
  core: [1, 4, 7, 8, 12],
  expanded: [1, 2, 4, 7, 8, 12],
  extended: [1, 2, 4, 7, 8, 11, 12],
};

export const HOUSE_WEIGHTS: Record<House, number> = {
  1: 18,
  2: 15,
  3: 0,
  4: 22,
  5: 0,
  6: 0,
  7: 30,
  8: 24,
  9: 0,
  10: 0,
  11: 6,
  12: 20,
};

export const REFERENCE_WEIGHTS: Record<ReferencePoint, number> = {
  Lagna: 1,
  Moon: 0.75,
  Venus: 0.5,
};

export const HOUSE_DOMAINS: Partial<Record<House, string[]>> = {
  1: ["temperament", "reactivity", "self-assertion", "direct impact on partnership"],
  2: ["speech", "family climate", "shared values", "financial arguments"],
  4: ["domestic peace", "home", "property", "emotional security"],
  7: ["spouse", "partnership", "compromise", "power balance"],
  8: ["trust", "intimacy", "joint finances", "in-laws", "crisis response"],
  11: ["social expectations", "gains", "family expectations through networks"],
  12: ["privacy", "bed comfort", "suppressed anger", "expenses", "emotional distance"],
};

export const RULE_CATALOGUE: readonly MangalDoshaRuleDescriptor[] = [
  {
    id: "MD-STRUCT-CORE",
    title: "Core Manglik houses",
    sourceTier: "classical_attributed",
    confidence: "high",
    hardCancellation: false,
    description: "Mars in houses 1, 4, 7, 8, or 12 from Lagna is the core traditional definition.",
  },
  {
    id: "MD-STRUCT-EXPANDED",
    title: "Expanded Manglik houses",
    sourceTier: "traditional_secondary",
    confidence: "high",
    hardCancellation: false,
    description: "The expanded school additionally includes the 2nd house.",
  },
  {
    id: "MD-STRUCT-EXTENDED",
    title: "Extended Manglik houses",
    sourceTier: "traditional_secondary",
    confidence: "medium",
    hardCancellation: false,
    description: "The extended school additionally includes the 11th house, but treats it as the least impactful.",
  },
  {
    id: "MD-REF-LMV",
    title: "Lagna, Moon, and Venus references",
    sourceTier: "traditional_secondary",
    confidence: "medium",
    hardCancellation: false,
    description: "Evaluate from Lagna, Moon, and Venus with relative weights of 100%, 75%, and 50%.",
  },
  {
    id: "MD-D1-D9-CONFIRM",
    title: "D1 and Navamsha confirmation",
    sourceTier: "traditional_secondary",
    confidence: "high",
    hardCancellation: false,
    description: "Results become more serious when Mars afflicts the 7th house, 7th lord, and Venus in both D1 and D9 without benefic protection.",
  },
  {
    id: "MD-JUPITER-PROTECTION",
    title: "Jupiter protection",
    sourceTier: "traditional_secondary",
    confidence: "medium",
    hardCancellation: false,
    description: "Jupiter aspect or strong benefic support mitigates rather than erases the pattern.",
  },
  {
    id: "MD-SAME-LEVEL-MATCH",
    title: "Comparable Mars intensity",
    sourceTier: "traditional_secondary",
    confidence: "medium",
    hardCancellation: false,
    description: "Comparable Manglik intensity between partners may improve balance, but does not guarantee marital success.",
  },
  {
    id: "MD-AGE-28",
    title: "Mars maturity around age 28",
    sourceTier: "traditional_secondary",
    confidence: "low",
    hardCancellation: false,
    description: "Age 28 is treated as a maturity marker, never as automatic cancellation.",
  },
  {
    id: "MD-RAHU-CONJ-DISPUTED",
    title: "Mars-Rahu cancellation claim",
    sourceTier: "traditional_secondary",
    confidence: "disputed",
    hardCancellation: false,
    description: "Some lists call Mars-Rahu a cancellation; this engine treats close Mars-Rahu as an affliction because the sources conflict.",
  },
];

const SIGN_LORD: Record<Sign, PlanetName> = {
  1: "Mars",
  2: "Venus",
  3: "Mercury",
  4: "Moon",
  5: "Sun",
  6: "Mercury",
  7: "Venus",
  8: "Mars",
  9: "Jupiter",
  10: "Saturn",
  11: "Saturn",
  12: "Jupiter",
};

const OWN_SIGNS: Partial<Record<PlanetName, Sign[]>> = {
  Sun: [5],
  Moon: [4],
  Mars: [1, 8],
  Mercury: [3, 6],
  Jupiter: [9, 12],
  Venus: [2, 7],
  Saturn: [10, 11],
};

const EXALTATION_SIGN: Partial<Record<PlanetName, Sign>> = {
  Sun: 1,
  Moon: 2,
  Mars: 10,
  Mercury: 6,
  Jupiter: 4,
  Venus: 12,
  Saturn: 7,
};

const DEBILITATION_SIGN: Partial<Record<PlanetName, Sign>> = {
  Sun: 7,
  Moon: 8,
  Mars: 4,
  Mercury: 12,
  Jupiter: 10,
  Venus: 6,
  Saturn: 1,
};

const FUNCTIONAL_MARS: Record<Sign, { score: number; label: MangalDoshaResult["functionalNature"]["label"]; text: string }> = {
  1: { score: 80, label: "supportive", text: "Mars rules the Ascendant and 8th house: strong self-drive with a transformational edge." },
  2: { score: 25, label: "challenging", text: "Mars rules the 7th and 12th houses, so relationship and expenditure themes need care." },
  3: { score: 20, label: "challenging", text: "Mars rules the 6th and 11th houses, increasing conflict, competition, and expectation pressure." },
  4: { score: 100, label: "highly_supportive", text: "Mars is yogakaraka as lord of the 5th and 10th houses." },
  5: { score: 100, label: "highly_supportive", text: "Mars is yogakaraka as lord of the 4th and 9th houses." },
  6: { score: 20, label: "challenging", text: "Mars rules the 3rd and 8th houses, increasing intensity and sudden reactive patterns." },
  7: { score: 25, label: "challenging", text: "Mars rules the 2nd and 7th houses and can become maraka-like in relationship matters." },
  8: { score: 55, label: "mixed", text: "Mars rules the Ascendant and 6th house: protective yet competitive and conflict-prone when afflicted." },
  9: { score: 80, label: "supportive", text: "Mars rules the 5th and 12th houses, giving constructive intelligence with private intensity." },
  10: { score: 35, label: "challenging", text: "Mars rules the 4th and 11th houses: property and ambition can coexist with domestic pressure." },
  11: { score: 30, label: "challenging", text: "Mars rules the 3rd and 10th houses: career drive is high but relationship compromise may be low." },
  12: { score: 80, label: "supportive", text: "Mars rules the 2nd and 9th houses, supporting fortune while still affecting family speech and values." },
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Math.round(clamp(value));
}

function isValidSign(value: unknown): value is Sign {
  return typeof value === "number" && Number.isFinite(value) && value >= 1 && value <= 12 && Number.isInteger(value);
}

function isValidDegree(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value < 30;
}

function normalizeSign(value: number): Sign {
  return ((((value - 1) % 12) + 12) % 12 + 1) as Sign;
}

function validateChartSnapshot(input: MangalDoshaInput): {
  calculationStatus: CalculationStatus;
  dataQualityScore: number;
  missingInputs: string[];
  warnings: string[];
} {
  const missingInputs: string[] = [];
  const warnings: string[] = [];
  let score = 100;
  const natal = input.natal;

  if (!natal || !isValidSign(natal.ascendantSign)) {
    missingInputs.push("natal.ascendantSign");
    score -= 35;
  }

  const mars = natal?.planets?.Mars;
  if (!mars) {
    missingInputs.push("natal.planets.Mars");
    score -= 45;
  } else {
    if (!isValidSign(mars.sign)) {
      missingInputs.push("natal.planets.Mars.sign");
      score -= 25;
    }
    if (!isValidDegree(mars.degree)) {
      missingInputs.push("natal.planets.Mars.degree");
      score -= 10;
    }
  }

  for (const reference of ["Moon", "Venus"] as const) {
    const placement = natal?.planets?.[reference];
    if (!placement) {
      missingInputs.push(`natal.planets.${reference}`);
      score -= 10;
    } else {
      if (!isValidSign(placement.sign)) {
        missingInputs.push(`natal.planets.${reference}.sign`);
        score -= 8;
      }
      if (!isValidDegree(placement.degree)) {
        warnings.push(`${reference} degree is missing or outside 0-30; sign-based reference can still be used with lower confidence.`);
        score -= 3;
      }
    }
  }

  for (const [planet, placement] of Object.entries(natal?.planets ?? {}) as Array<[PlanetName, PlanetPlacement]>) {
    if (!isValidSign(placement.sign)) {
      warnings.push(`${planet} sign is invalid; rules depending on this planet are lower confidence.`);
      score -= 5;
    }
    if (!isValidDegree(placement.degree)) {
      warnings.push(`${planet} degree is missing or outside 0-30; close-orb rules are lower confidence.`);
      score -= 2;
    }
  }

  if (!natal?.navamsha) {
    warnings.push("Navamsha/D9 is unavailable; D9 confirmation and cancellation confidence are limited.");
    score -= 12;
  } else if (!natal.navamsha.planets.Mars) {
    warnings.push("D9 Mars is unavailable; Navamsha repetition cannot be fully validated.");
    score -= 8;
  }

  if (!input.dasha) {
    warnings.push("Dasha state is unavailable; activation score is natal-only.");
    score -= 5;
  }
  if (!input.transits) {
    warnings.push("Current transits are unavailable; live activation windows are partial.");
    score -= 5;
  }

  const finalScore = round(score);
  const hasCriticalMissing = missingInputs.includes("natal.ascendantSign") ||
    missingInputs.includes("natal.planets.Mars") ||
    missingInputs.includes("natal.planets.Mars.sign");
  const calculationStatus: CalculationStatus = hasCriticalMissing
    ? "invalid"
    : finalScore < 72 || warnings.length > 0 || missingInputs.length > 0
      ? "partial"
      : "complete";

  return {
    calculationStatus,
    dataQualityScore: finalScore,
    missingInputs,
    warnings,
  };
}

function houseFromSign(referenceSign: Sign, targetSign: Sign): House {
  return normalizeSign(targetSign - referenceSign + 1);
}

function houseSign(ascendantSign: Sign, house: House): Sign {
  return normalizeSign(ascendantSign + house - 1);
}

function getHouse(chart: ChartSnapshot, planet: PlanetName): House | null {
  const placement = chart.planets[planet];
  if (!placement) return null;
  return placement.house ?? houseFromSign(chart.ascendantSign, placement.sign);
}

function getHouseLord(chart: ChartSnapshot, house: House): PlanetName {
  return SIGN_LORD[houseSign(chart.ascendantSign, house)];
}

function longitude(placement: PlanetPlacement): number {
  return (placement.sign - 1) * 30 + clamp(placement.degree, 0, 29.999999);
}

function angularDistance(a: PlanetPlacement, b: PlanetPlacement): number {
  const direct = Math.abs(longitude(a) - longitude(b));
  return Math.min(direct, 360 - direct);
}

function conjunctionPoints(distance: number, maxPoints: number): number {
  if (distance <= 3) return maxPoints;
  if (distance <= 7) return maxPoints * 0.7;
  if (distance <= 12) return maxPoints * 0.4;
  if (distance <= 30) return maxPoints * 0.15;
  return 0;
}

function aspectOffsets(planet: PlanetName): readonly number[] {
  switch (planet) {
    case "Mars":
      return [4, 7, 8];
    case "Jupiter":
      return [5, 7, 9];
    case "Saturn":
      return [3, 7, 10];
    default:
      return [7];
  }
}

function aspectsHouse(chart: ChartSnapshot, planet: PlanetName, targetHouse: House): boolean {
  const from = getHouse(chart, planet);
  if (!from) return false;
  return aspectOffsets(planet).some((offset) => normalizeSign(from + offset - 1) === targetHouse);
}

function planetAspectsPlanet(chart: ChartSnapshot, from: PlanetName, to: PlanetName): boolean {
  const target = getHouse(chart, to);
  return target ? aspectsHouse(chart, from, target) : false;
}

function basicPlanetStrength(chart: ChartSnapshot, planet: PlanetName): number {
  const p = chart.planets[planet];
  if (!p) return 50;

  let score = 50;
  if (EXALTATION_SIGN[planet] === p.sign) score = 90;
  else if (OWN_SIGNS[planet]?.includes(p.sign)) score = 80;
  else if (DEBILITATION_SIGN[planet] === p.sign) score = 20;

  if (typeof p.shadbalaRatio === "number") {
    score = score * 0.65 + clamp(p.shadbalaRatio * 60, 0, 100) * 0.35;
  }
  if (p.combust) score -= 12;
  if (p.flags?.planetaryWarDefeated) score -= 18;
  if (p.flags?.signSandhi) score -= 8;
  return round(score);
}

function marsDignityPoints(mars: PlanetPlacement): { points: number; label: string } {
  if (mars.sign === 10) return { points: 25, label: "exalted" };
  if (mars.sign === 1 && mars.degree <= 12) return { points: 23, label: "moolatrikona" };
  if (mars.sign === 1 || mars.sign === 8) return { points: 21, label: "own_sign" };
  if ([5, 9, 12].includes(mars.sign)) return { points: 17, label: "friend_sign" };
  if ([2, 7, 11].includes(mars.sign)) return { points: 13, label: "neutral_sign" };
  if ([3, 6].includes(mars.sign)) return { points: 8, label: "enemy_sign" };
  if (mars.sign === 4) return { points: 4, label: "debilitated" };
  return { points: 12, label: "ordinary" };
}

function buildReferenceHits(chart: ChartSnapshot, school: ManglikSchool): ReferenceHit[] {
  const mars = chart.planets.Mars;
  if (!mars) return [];

  const references: Array<[ReferencePoint, Sign | null]> = [
    ["Lagna", chart.ascendantSign],
    ["Moon", chart.planets.Moon?.sign ?? null],
    ["Venus", chart.planets.Venus?.sign ?? null],
  ];

  return references.flatMap(([reference, sign]) => {
    if (!sign) return [];
    const house = houseFromSign(sign, mars.sign);
    const active = SCHOOL_HOUSES[school].includes(house);
    return [{
      reference,
      house,
      referenceWeight: REFERENCE_WEIGHTS[reference],
      houseWeight: HOUSE_WEIGHTS[house],
      activeInSchool: active,
      reason: active
        ? `Mars is in H${house} from ${reference}; this links Mars to a marriage-sensitive zone.`
        : `Mars is in H${house} from ${reference}; this is not active under the ${school} school.`,
    }];
  });
}

function schoolDetection(chart: ChartSnapshot, school: ManglikSchool): SchoolDetection {
  const hits = buildReferenceHits(chart, school);
  return {
    school,
    houses: SCHOOL_HOUSES[school],
    present: hits.some((hit) => hit.activeInSchool),
    hits,
  };
}

function structuralScore(hits: ReferenceHit[]): number {
  const active = hits.filter((hit) => hit.activeInSchool);
  if (active.length === 0) return 0;

  const strongest = Math.max(...active.map((hit) => hit.houseWeight * hit.referenceWeight));
  let score = (strongest / 30) * 70;
  const additionalReferences = Math.max(0, active.length - 1);
  score += Math.min(30, additionalReferences * 15);
  return round(score);
}

function calculateMarsPower(chart: ChartSnapshot, evidence: RuleEvidence[]): number {
  const mars = chart.planets.Mars;
  if (!mars) return 0;

  const dignity = marsDignityPoints(mars);
  let total = dignity.points;
  evidence.push({
    ruleId: "MD-POWER-DIGNITY",
    title: "Mars sign dignity",
    effect: "information",
    points: dignity.points,
    confidence: "high",
    sourceTier: "product_synthesis",
    explanation: `Mars is in ${SIGN_NAMES[mars.sign]} (${dignity.label}).`,
  });

  const shadbala = typeof mars.shadbalaRatio === "number"
    ? clamp(mars.shadbalaRatio * 14, 0, 20)
    : 10;
  total += shadbala;

  let d9Points = 7.5;
  const d9Mars = chart.navamsha?.planets.Mars;
  if (d9Mars) {
    const d9Dignity = marsDignityPoints(d9Mars);
    d9Points = (d9Dignity.points / 25) * 15;
    if (d9Mars.sign === mars.sign) d9Points = Math.min(15, d9Points + 3);
  }
  total += d9Points;

  const marsHouse = getHouse(chart, "Mars");
  total += marsHouse === 10 ? 10 : marsHouse && [1, 4, 7, 10].includes(marsHouse) ? 6 : 4;

  const dispositor = SIGN_LORD[mars.sign];
  total += (basicPlanetStrength(chart, dispositor) / 100) * 10;

  let avastha = 7;
  if (mars.combust) avastha -= 3;
  if (mars.flags?.planetaryWarDefeated) avastha -= 4;
  if (mars.flags?.signSandhi) avastha -= 2;
  if (mars.flags?.gandanta) avastha -= 2;
  if (mars.retrograde) avastha += 1;
  total += clamp(avastha, 0, 10);

  let support = 2;
  if (planetAspectsPlanet(chart, "Jupiter", "Mars")) support += 5;
  if (planetAspectsPlanet(chart, "Venus", "Mars")) support += 1;
  if (planetAspectsPlanet(chart, "Mercury", "Mars")) support += 1;
  total += clamp(support, 0, 10);

  return round(total);
}

function calculateAffliction(chart: ChartSnapshot, evidence: RuleEvidence[]): number {
  const mars = chart.planets.Mars;
  if (!mars) return 0;

  let score = 0;
  const conjunctionRules: Array<[PlanetName, number, Confidence, string]> = [
    ["Rahu", 20, "high", "Mars-Rahu intensifies impulsive, compulsive, or explosive expression."],
    ["Ketu", 16, "medium", "Mars-Ketu can make action abrupt, detached, or cutting."],
    ["Saturn", 18, "high", "Mars-Saturn combines acceleration and obstruction, increasing frustration."],
  ];

  for (const [planet, maxPoints, confidence, explanation] of conjunctionRules) {
    const other = chart.planets[planet];
    if (!other) continue;
    const points = conjunctionPoints(angularDistance(mars, other), maxPoints);
    if (points > 0) {
      score += points;
      evidence.push({
        ruleId: `MD-AFF-CONJ-${planet.toUpperCase()}`,
        title: `Mars-${planet} association`,
        effect: "increase",
        points: round(points),
        confidence,
        sourceTier: "product_synthesis",
        explanation,
      });
    }
  }

  if (planetAspectsPlanet(chart, "Saturn", "Mars")) {
    score += 10;
    evidence.push({
      ruleId: "MD-AFF-SATURN-ASPECT",
      title: "Saturn aspects Mars",
      effect: "increase",
      points: 10,
      confidence: "high",
      sourceTier: "product_synthesis",
      explanation: "Saturn's aspect can pressure Mars and produce delayed anger or repeated conflict cycles.",
    });
  }

  if (mars.combust) score += 6;
  if (mars.retrograde) score += 4;
  if (mars.flags?.papakartari) score += 8;
  if (mars.flags?.gandanta) score += 7;
  if (mars.flags?.signSandhi) score += 5;
  if (mars.flags?.planetaryWarDefeated) score += 8;
  if (mars.flags?.nakshatraLordAfflicted) score += 5;
  if (mars.flags?.customAfflictionPoints) score += mars.flags.customAfflictionPoints;

  const dispositor = SIGN_LORD[mars.sign];
  if (basicPlanetStrength(chart, dispositor) < 35) score += 8;

  return round(score);
}

function marsAffectsHouse(chart: ChartSnapshot, house: House): boolean {
  return getHouse(chart, "Mars") === house || aspectsHouse(chart, "Mars", house);
}

function marsAffectsPlanet(chart: ChartSnapshot, planet: PlanetName): boolean {
  const mars = chart.planets.Mars;
  const target = chart.planets[planet];
  if (!mars || !target) return false;
  return angularDistance(mars, target) <= 12 || planetAspectsPlanet(chart, "Mars", planet);
}

function calculateMarriageVulnerability(chart: ChartSnapshot, evidence: RuleEvidence[]): { score: number; confirmations: number } {
  const mars = chart.planets.Mars;
  if (!mars) return { score: 0, confirmations: 0 };

  let score = 0;
  let confirmations = 0;
  const seventhLord = getHouseLord(chart, 7);
  const eighthLord = getHouseLord(chart, 8);
  const secondLord = getHouseLord(chart, 2);

  const directSeventh = getHouse(chart, "Mars") === 7;
  const aspectsSeventh = aspectsHouse(chart, "Mars", 7);
  if (directSeventh) {
    score += 25;
    confirmations++;
  } else if (aspectsSeventh) {
    score += 20;
    confirmations++;
  }

  if (marsAffectsPlanet(chart, seventhLord)) {
    score += 20;
    confirmations++;
  }
  if (marsAffectsPlanet(chart, "Venus")) {
    score += 15;
    confirmations++;
  }
  if (marsAffectsHouse(chart, 8) || marsAffectsPlanet(chart, eighthLord)) {
    score += 12;
    confirmations++;
  }
  if (marsAffectsHouse(chart, 2) || marsAffectsPlanet(chart, secondLord)) {
    score += 10;
    confirmations++;
  }
  if (getHouse(chart, "Mars") === 12) {
    score += 8;
    confirmations++;
  }

  if (directSeventh || aspectsSeventh) {
    evidence.push({
      ruleId: "MD-VULN-H7",
      title: "Mars influences the 7th house",
      effect: "increase",
      points: directSeventh ? 25 : 20,
      confidence: "high",
      sourceTier: "classical_attributed",
      explanation: "The partnership house receives direct Mars pressure.",
    });
  }

  const d9 = chart.navamsha;
  if (d9?.planets.Mars) {
    const d9SeventhLord = getHouseLord(d9, 7);
    const d9Direct = getHouse(d9, "Mars") === 7;
    const d9Aspect = aspectsHouse(d9, "Mars", 7);
    const d9LordHit = marsAffectsPlanet(d9, d9SeventhLord);
    const d9VenusHit = marsAffectsPlanet(d9, "Venus");

    if (d9Direct || d9Aspect) {
      score += 18;
      confirmations++;
    }
    if (d9LordHit) {
      score += 16;
      confirmations++;
    }
    if (d9VenusHit) {
      score += 12;
      confirmations++;
    }

    if ((d9Direct || d9Aspect) && d9LordHit && d9VenusHit) {
      score += 15;
      evidence.push({
        ruleId: "MD-VULN-D9-TRIPLE",
        title: "D9 triple confirmation",
        effect: "increase",
        points: 15,
        confidence: "high",
        sourceTier: "traditional_secondary",
        explanation: "Mars simultaneously pressures the D9 7th house, 7th lord, and Venus.",
      });
    }
  }

  return { score: round(score), confirmations };
}

function isBeneficInKendraOrTrikona(chart: ChartSnapshot): boolean {
  const benefics: PlanetName[] = ["Jupiter", "Venus", "Mercury", "Moon"];
  return benefics.some((planet) => {
    const house = getHouse(chart, planet);
    return house ? [1, 4, 5, 7, 9, 10].includes(house) : false;
  });
}

function addCancellationEvidence(factor: CancellationFactor, evidence: RuleEvidence[]) {
  evidence.push({
    ruleId: factor.ruleId,
    title: factor.title,
    effect: "decrease",
    points: factor.points,
    confidence: factor.confidence === "strong" ? "high" : factor.confidence === "moderate" ? "medium" : "disputed",
    sourceTier: "traditional_secondary",
    tradition: "traditional",
    disputed: factor.confidence === "disputed",
    safetyNote: "This is mitigation, not hard cancellation.",
    explanation: factor.explanation,
  });
}

function findCancellationFactors(chart: ChartSnapshot): CancellationFactor[] {
  const mars = chart.planets.Mars;
  const marsHouse = getHouse(chart, "Mars");
  if (!mars || !marsHouse) return [];

  const factors: CancellationFactor[] = [];
  const add = (
    ruleId: string,
    title: string,
    points: number,
    explanation: string,
    confidence: CancellationFactor["confidence"] = "disputed",
    effect: CancellationFactor["effect"] = "partial_mitigation",
  ) => {
    factors.push({
      ruleId,
      title,
      points,
      effect,
      confidence,
      explanation,
      hardCancellation: false,
    });
  };

  const dignity = marsDignityPoints(mars);
  if (dignity.label === "exalted") {
    add("MD-CANCEL-MARS-EXALTED", "Exalted Mars mitigation", 10, "Mars is exalted, which can make its force disciplined and constructive.", "strong", "protection");
  } else if (dignity.label === "moolatrikona" || dignity.label === "own_sign") {
    add("MD-CANCEL-MARS-OWN-MT", "Own or moolatrikona Mars mitigation", 9, "Mars has sign dignity, so the raw dosha is moderated by cleaner self-expression.", "strong", "protection");
  } else if (dignity.label === "friend_sign") {
    add("MD-CANCEL-MARS-FRIEND", "Friendly-sign Mars mitigation", 4, "Mars is in a friend sign, which gives moderate behavioral manageability.", "moderate", "partial_mitigation");
  }

  const specificPairs: Array<[House, Sign[], string]> = [
    [1, [1, 5, 11], "Some traditions exempt Mars in Lagna in Aries, Leo, or Aquarius."],
    [2, [3, 6], "Some traditions exempt Mars in H2 in Gemini or Virgo."],
    [4, [1, 8], "Some traditions exempt Mars in H4 in Aries or Scorpio."],
    [7, [4, 10, 12], "Different traditions exempt Mars in H7 in Cancer, Capricorn, or Pisces."],
    [8, [4, 9, 11, 12], "Different traditions exempt Mars in H8 in Cancer, Sagittarius, Aquarius, or Pisces."],
    [12, [2, 3, 6, 7, 9], "Different traditions exempt Mars in H12 in Taurus, Gemini, Virgo, Libra, or Sagittarius."],
  ];

  for (const [house, signs, explanation] of specificPairs) {
    if (marsHouse === house && signs.includes(mars.sign)) {
      add("MD-TRAD-SIGN-HOUSE", "Traditional sign-house exception", 4, explanation, "disputed", "traditional_exception");
      break;
    }
  }

  if ([1, 4, 7, 10].includes(mars.sign)) {
    add("MD-TRAD-MOVABLE", "Movable-sign exception", 2, "A secondary tradition treats Mars in movable signs as mitigated.", "disputed", "traditional_exception");
  }

  const moon = chart.planets.Moon;
  const venus = chart.planets.Venus;
  if (moon && venus && getHouse(chart, "Moon") === 2 && getHouse(chart, "Venus") === 2) {
    add("MD-TRAD-MOON-VENUS-H2", "Moon and Venus in H2", 3, "A traditional list treats Moon-Venus in the 2nd as a mitigating factor.", "disputed", "traditional_exception");
  }

  if (planetAspectsPlanet(chart, "Jupiter", "Mars")) {
    add("MD-CANCEL-JUPITER-MARS-ASPECT", "Jupiter protects Mars", 12, "Jupiter's aspect adds judgment, restraint and dharmic moderation to Mars.", "moderate", "protection");
  }
  if (aspectsHouse(chart, "Jupiter", 7)) {
    add("MD-CANCEL-JUPITER-H7", "Jupiter protects the 7th house", 8, "Jupiter's aspect to the partnership house mitigates relationship heat.", "moderate", "protection");
  }
  if (basicPlanetStrength(chart, getHouseLord(chart, 7)) >= 65) {
    add("MD-CANCEL-STRONG-H7-LORD", "Strong 7th lord", 8, "A strong 7th lord increases the chart's relationship resilience.", "moderate", "partial_mitigation");
  }
  if (getHouse(chart, getHouseLord(chart, 7)) === 7) {
    add("MD-CANCEL-H7-LORD-OWN-HOUSE", "7th lord anchored in 7th", 7, "The 7th lord directly supports the partnership house.", "moderate", "partial_mitigation");
  }
  if (basicPlanetStrength(chart, "Venus") >= 65) {
    add("MD-CANCEL-STRONG-VENUS", "Strong Venus protection", 7, "Strong Venus supports relationship repair, attraction and harmony.", "moderate", "partial_mitigation");
  }
  if (isBeneficInKendraOrTrikona(chart)) {
    add("MD-CANCEL-BENEFIC-KENDRA-TRIKONA", "Benefic support in Kendra/Trikona", 5, "Benefic angular or trinal support softens harsh Mars expression.", "moderate", "partial_mitigation");
  }

  if (getHouse(chart, "Saturn") === 11) {
    add("MD-TRAD-SATURN-H11", "Saturn in H11", 2, "A traditional list treats Saturn in the 11th as protective.", "disputed", "traditional_exception");
  }
  if (getHouse(chart, "Rahu") === 6) {
    add("MD-TRAD-RAHU-H6", "Rahu in H6", 2, "A traditional list treats Rahu in the 6th as protective.", "disputed", "traditional_exception");
  }

  const d9 = chart.navamsha;
  if (d9) {
    const d9SeventhLord = getHouseLord(d9, 7);
    if (basicPlanetStrength(d9, d9SeventhLord) >= 65) {
      add("MD-CANCEL-D9-H7-LORD", "D9 7th lord strength", 6, "Navamsha 7th lord strength reduces confidence in severe warnings.", "moderate", "partial_mitigation");
    }
    if (basicPlanetStrength(d9, "Venus") >= 65) {
      add("MD-CANCEL-D9-VENUS", "D9 Venus strength", 5, "Navamsha Venus supports the relationship container.", "moderate", "partial_mitigation");
    }
  }

  return factors;
}

function traditionalExceptionPoints(chart: ChartSnapshot, evidence: RuleEvidence[]): number {
  const factors = findCancellationFactors(chart);
  for (const factor of factors) addCancellationEvidence(factor, evidence);
  return factors.reduce((sum, factor) => sum + factor.points, 0);
}

function calculateProtection(
  chart: ChartSnapshot,
  includeTraditionalExceptions: boolean,
  evidence: RuleEvidence[],
): number {
  const mars = chart.planets.Mars;
  if (!mars) return 0;

  let score = 0;

  const functional = FUNCTIONAL_MARS[chart.ascendantSign];
  if (functional.score >= 95) score += 12;
  else if (functional.score >= 70) score += 8;
  else if (functional.score >= 50) score += 4;

  if (mars.flags?.customProtectionPoints) score += mars.flags.customProtectionPoints;
  if (includeTraditionalExceptions) score += traditionalExceptionPoints(chart, evidence);

  return round(score);
}

function calculateActivation(input: MangalDoshaInput): number | null {
  if (!input.dasha && !input.transits) return null;

  const chart = input.natal;
  const mars = chart.planets.Mars;
  if (!mars) return 0;

  const seventhLord = getHouseLord(chart, 7);
  const eighthLord = getHouseLord(chart, 8);
  const dispositor = SIGN_LORD[mars.sign];
  let score = 0;

  const dasha = input.dasha;
  if (dasha) {
    if (dasha.mahadasha === "Mars") score += 35;
    if (dasha.antardasha === "Mars") score += 25;
    if (dasha.pratyantardasha === "Mars") score += 15;

    if (dasha.mahadasha === seventhLord) score += 20;
    if (dasha.antardasha === seventhLord) score += 15;
    if (dasha.mahadasha === "Venus") score += 15;
    if (dasha.antardasha === "Venus") score += 10;
    if (dasha.mahadasha === eighthLord) score += 10;
    if (dasha.antardasha === eighthLord) score += 8;
    if (dasha.mahadasha === dispositor) score += 10;
    if (dasha.antardasha === dispositor) score += 6;
  }

  const transits = input.transits?.planets;
  if (transits) {
    const transitMars = transits.Mars;
    if (transitMars) {
      const house = houseFromSign(chart.ascendantSign, transitMars.sign);
      if (SCHOOL_HOUSES.expanded.includes(house)) score += 10;
    }

    for (const planet of ["Saturn", "Rahu", "Ketu"] as const) {
      const transit = transits[planet];
      if (transit && angularDistance(transit, mars) <= 3) score += 12;
      const natalVenus = chart.planets.Venus;
      if (transit && natalVenus && angularDistance(transit, natalVenus) <= 3) score += 8;
    }
  }

  return round(score);
}

function severityLabel(score: number, confirmations: number): MangalDoshaResult["severityLabel"] {
  if (score < 15) return "No meaningful Manglik influence";
  if (score < 30) return "Mild Mars relationship influence";
  if (score < 45) return "Conditional Manglik";
  if (score < 60) return "Moderate Manglik";
  if (score < 75 || confirmations < 4) return "Strong Manglik pattern";
  return "Severe multi-factor Mars affliction";
}

function activationLabel(score: number | null): MangalDoshaResult["activationLabel"] {
  if (score === null) return "not_calculated";
  if (score < 10) return "dormant";
  if (score < 30) return "low";
  if (score < 55) return "moderate";
  if (score < 80) return "high";
  return "peak";
}

function marsExpression(power: number, affliction: number): MangalDoshaResult["marsExpression"] {
  if (power >= 65 && affliction < 35) return "constructive_warrior";
  if (power >= 65 && affliction < 60) return "intense_but_manageable";
  if (power >= 65 && affliction >= 60) return "dominating_or_explosive";
  if (power < 45 && affliction >= 45) return "frustrated_or_internalized";
  return "low_assertion";
}

function riskDomainsFromHits(hits: ReferenceHit[]): string[] {
  const domains = new Set<string>();
  for (const hit of hits.filter((item) => item.activeInSchool)) {
    for (const domain of HOUSE_DOMAINS[hit.house] ?? []) domains.add(domain);
  }
  return [...domains];
}

function constructiveThemesForMars(chart: ChartSnapshot, power: number, affliction: number): string[] {
  const mars = chart.planets.Mars;
  const themes = new Set<string>(["courage", "initiative", "physical drive", "problem-solving under pressure"]);
  const marsHouse = getHouse(chart, "Mars");
  if (marsHouse === 4 || mars?.sign === 4 || mars?.sign === 10) {
    themes.add("property, construction, or technical execution");
  }
  if ([1, 5, 10].includes(marsHouse ?? 0)) themes.add("leadership");
  if (power >= 65) themes.add("high execution capacity");
  if (affliction < 35) themes.add("protective and disciplined use of energy");
  return [...themes];
}

function marsAssociatedMalefics(chart: ChartSnapshot): PlanetName[] {
  const mars = chart.planets.Mars;
  if (!mars) return [];
  const malefics: PlanetName[] = ["Sun", "Saturn", "Rahu", "Ketu"];
  return malefics.filter((planet) => {
    const placement = chart.planets[planet];
    if (!placement) return false;
    return placement.sign === mars.sign || angularDistance(mars, placement) <= 12 || planetAspectsPlanet(chart, planet, "Mars");
  });
}

function traditionalConcentration(chart: ChartSnapshot): TraditionalConcentration {
  const associatedMalefics = marsAssociatedMalefics(chart);
  const count = associatedMalefics.length;
  const label: TraditionalConcentration["label"] =
    count >= 4 ? "Bhauma Panchak" :
    count >= 2 ? "Triguna Manglik" :
    count >= 1 ? "Dviguna Manglik" :
    "None";
  const joined = associatedMalefics.length ? associatedMalefics.join(", ") : "no close malefic association";
  return {
    label,
    associatedMalefics,
    explanation: label === "None"
      ? "Mars is not concentrated with additional classical malefic pressure."
      : `${label} tag because Mars is associated with ${joined}.`,
    modernInterpretation: label === "Bhauma Panchak"
      ? "Very concentrated Mars pressure; avoid impulsive escalation and treat relationship conflict protocols as mandatory."
      : label === "Triguna Manglik"
        ? "Obstruction plus impulsive escalation can appear together; disciplined repair habits matter."
        : label === "Dviguna Manglik"
          ? "One additional malefic colors Mars expression; the trigger style should be named and managed."
          : "No special concentration tag beyond normal Mars scoring.",
  };
}

function scoreConfidence(status: CalculationStatus, validationScore: number): MangalDoshaResult["scoreConfidence"] {
  if (status === "complete" && validationScore >= 88) return "high";
  if (status !== "invalid" && validationScore >= 70) return "medium";
  return "limited";
}

function buildGemstoneSafety(
  resultCore: Pick<MangalDoshaResult, "scores" | "functionalNature" | "scoreConfidence">,
): GemstoneSafety {
  const { marsPower, marsAffliction, protection, natalSeverity } = resultCore.scores;

  if (resultCore.scoreConfidence === "limited") {
    return {
      status: "insufficient_data",
      title: "Gemstone decision blocked",
      reasoning: [
        "AstroLife does not have enough verified chart quality to judge whether Mars should be strengthened.",
        "Use practical and spiritual regulation first; do not prescribe red coral from partial data.",
      ],
      caution: "Gemstones amplify planetary patterns and should not be used as a generic Manglik remedy.",
      requiresExpert: true,
    };
  }

  if (
    resultCore.functionalNature.score >= 70 &&
    marsPower < 45 &&
    marsAffliction < 35 &&
    protection >= 20
  ) {
    return {
      status: "eligible_for_expert_review",
      title: "Red coral may be reviewed by an expert",
      reasoning: [
        "Mars appears functionally supportive and not heavily afflicted.",
        "Protection factors are present, so strengthening Mars may be considered only after full chart review.",
      ],
      caution: "Confirm lordship, maraka/dusthana role, Shadbala, D9, dasha and current transit before wearing coral.",
      requiresExpert: true,
    };
  }

  if (resultCore.functionalNature.score >= 60 && marsAffliction < 45 && natalSeverity < 45) {
    return {
      status: "conditionally_eligible",
      title: "Gemstone is conditional, not automatic",
      reasoning: [
        "Mars has some supportive potential, but the relationship score is not clean enough for automatic strengthening.",
        "A softer Mars discipline is safer unless a qualified astrologer confirms suitability.",
      ],
      caution: "Avoid self-prescribing coral during difficult Mars, Rahu, Saturn or maraka periods.",
      requiresExpert: true,
    };
  }

  return {
    status: "not_recommended",
    title: "Red coral not recommended by default",
    reasoning: [
      "The chart shows enough Mars pressure or affliction that strengthening Mars could intensify conflict patterns.",
      "Correction should focus on regulation, repair habits, timing awareness and optional cultural remedies.",
    ],
    caution: "A gemstone amplifies a planet; Manglik Dosha alone is not a reason to wear red coral.",
    requiresExpert: true,
  };
}

function buildRemedies(
  resultCore: Pick<MangalDoshaResult, "scores" | "functionalNature" | "riskDomains" | "scoreConfidence">,
  gemstoneSafety: GemstoneSafety,
): RemedyRecommendation[] {
  const remedies: RemedyRecommendation[] = [];

  remedies.push({
    category: "practical",
    priority: "primary",
    title: "Mars channeling routine",
    instruction: "Use regular exercise, disciplined work, and a pause-before-reaction rule to discharge excess Mars energy constructively.",
    costBand: "free",
    effortLevel: "moderate",
    requiresExpert: false,
    confidence: "practical",
    eligibleWhen: ["High Mars power", "anger escalation", "restlessness", "impulsive decisions"],
  });

  if (resultCore.riskDomains.includes("speech") || resultCore.riskDomains.includes("family climate")) {
    remedies.push({
      category: "practical",
      priority: "primary",
      title: "Speech and family protocol",
      instruction: "Do not discuss money or family conflict while angry. Use a 20-minute cooling period and written financial agreements.",
      costBand: "free",
      effortLevel: "moderate",
      requiresExpert: false,
      confidence: "practical",
      eligibleWhen: ["Mars affects speech/family domains", "2nd house or family climate risk"],
    });
  }
  if (resultCore.riskDomains.includes("spouse") || resultCore.riskDomains.includes("partnership")) {
    remedies.push({
      category: "practical",
      priority: "primary",
      title: "Partnership conflict protocol",
      instruction: "Create rules for shared decisions, fair disagreement, and repair after conflict. Use professional counseling when patterns repeat.",
      costBand: "variable",
      effortLevel: "intensive",
      requiresExpert: false,
      confidence: "practical",
      eligibleWhen: ["Mars affects spouse/partnership domains", "7th house or D9 repetition"],
    });
  }
  if (resultCore.riskDomains.includes("privacy") || resultCore.riskDomains.includes("bed comfort")) {
    remedies.push({
      category: "practical",
      priority: "primary",
      title: "Private-life communication",
      instruction: "Discuss intimacy, sleep, privacy, and spending expectations directly instead of allowing resentment to accumulate.",
      costBand: "free",
      effortLevel: "moderate",
      requiresExpert: false,
      confidence: "practical",
      eligibleWhen: ["Mars affects 12th house/privacy domains", "sleep, spending or intimacy friction"],
    });
  }

  remedies.push({
    category: "spiritual",
    priority: "secondary",
    title: "Simple Tuesday practice",
    instruction: "Use a simple Hanuman, Kartikeya/Subrahmanya, or Mangal prayer according to personal faith. A short Mangal mantra practice may be used as discipline, not as a guaranteed cure.",
    caution: "Fasting is optional and should be avoided or medically reviewed during pregnancy, diabetes, eating disorders, or medication-sensitive conditions.",
    costBand: "free",
    effortLevel: "easy",
    requiresExpert: false,
    confidence: "traditional",
    faithPreference: ["Hanuman", "Kartikeya", "Subrahmanya", "Mangal"],
    healthContraindications: ["pregnancy", "diabetes", "eating disorder history", "medication-sensitive conditions"],
  });

  remedies.push({
    category: "traditional_optional",
    priority: "optional",
    title: "Optional cultural ritual",
    instruction: "Mangala Gauri, Navagraha/Mangal shanti, or a culturally accepted pre-marriage ritual may be performed for spiritual reassurance.",
    caution: "These are optional traditions, not proof of cancellation and not a substitute for compatibility assessment or counseling.",
    costBand: "variable",
    effortLevel: "moderate",
    requiresExpert: true,
    confidence: "traditional",
    legalEnvironmentalCheck: true,
    eligibleWhen: ["Family wants a traditional reassurance layer", "Pre-marriage cultural ritual is meaningful to the user"],
    avoidWhen: ["User does not consent", "Ritual pressure creates fear or coercion"],
  });

  remedies.push({
    category: "gemstone",
    priority: gemstoneSafety.status === "eligible_for_expert_review" ? "optional" : "secondary",
    title: gemstoneSafety.title,
    instruction: gemstoneSafety.reasoning.join(" "),
    caution: gemstoneSafety.caution,
    costBand: "variable",
    effortLevel: "easy",
    requiresExpert: gemstoneSafety.requiresExpert,
    confidence: gemstoneSafety.status === "not_recommended" ? "practical" : "traditional",
    eligibleWhen: gemstoneSafety.status === "eligible_for_expert_review"
      ? ["Supportive Mars", "low affliction", "full expert chart review completed"]
      : ["Only after qualified chart review"],
    avoidWhen: [
      "High Mars affliction",
      "Severe Manglik pressure",
      "Mars maraka/dusthana risk",
      "No expert review",
    ],
  });

  return remedies;
}

function emptySchoolDetections(input: MangalDoshaInput): Record<ManglikSchool, SchoolDetection> {
  const fallbackChart: ChartSnapshot = {
    ascendantSign: isValidSign(input.natal?.ascendantSign) ? input.natal.ascendantSign : 1,
    planets: input.natal?.planets ?? {},
  };
  return {
    core: schoolDetection(fallbackChart, "core"),
    expanded: schoolDetection(fallbackChart, "expanded"),
    extended: schoolDetection(fallbackChart, "extended"),
  };
}

function invalidResult(
  input: MangalDoshaInput,
  validation: ReturnType<typeof validateChartSnapshot>,
): MangalDoshaResult {
  const selectedSchool = input.school ?? "expanded";
  const scores: ScoreBreakdown = {
    structural: 0,
    marsPower: 0,
    marsAffliction: 0,
    marriageVulnerability: 0,
    protection: 0,
    natalSeverity: 0,
    constructivePotential: 0,
    activation: null,
    currentExpression: null,
  };
  return {
    engineVersion: ENGINE_VERSION,
    rulePackVersion: RULE_PACK_VERSION,
    scoreModelVersion: SCORE_MODEL_VERSION,
    ayanamsha: DEFAULT_AYANAMSHA,
    houseSystem: DEFAULT_HOUSE_SYSTEM,
    generatedAt: new Date().toISOString(),
    calculationStatus: "invalid",
    dataQualityScore: validation.dataQualityScore,
    missingInputs: validation.missingInputs,
    warnings: validation.warnings,
    selectedSchool,
    schoolDetections: emptySchoolDetections(input),
    scores,
    severityLabel: "Insufficient data for Manglik assessment",
    activationLabel: "not_calculated",
    functionalNature: {
      score: 0,
      label: "mixed",
      explanation: "Functional Mars cannot be judged until valid Ascendant and Mars data are present.",
    },
    marsExpression: "low_assertion",
    confirmationCount: 0,
    scoreConfidence: "limited",
    traditionalConcentration: {
      label: "None",
      associatedMalefics: [],
      explanation: "Traditional concentration cannot be judged with invalid input.",
      modernInterpretation: "Fix the missing birth-chart inputs before interpreting Mangal Dosha.",
    },
    cancellationFactors: [],
    riskDomains: [],
    constructiveThemes: [],
    evidence: [{
      ruleId: "MD-QUALITY-INVALID",
      title: "Insufficient calculation data",
      effect: "information",
      points: 0,
      confidence: "high",
      sourceTier: "product_synthesis",
      tradition: "astrolife_calibrated",
      explanation: `Missing critical inputs: ${validation.missingInputs.join(", ") || "unknown"}.`,
    }],
    gemstoneSafety: {
      status: "insufficient_data",
      title: "Gemstone decision blocked",
      reasoning: [
        "Critical chart data is missing, so Mars strengthening cannot be judged responsibly.",
        "Fix the birth-chart inputs before considering any gemstone suggestion.",
      ],
      caution: "Do not prescribe red coral from incomplete data.",
      requiresExpert: true,
    },
    remedies: [],
    safetyNotes: [
      "AstroLife did not mark this chart as Non-Manglik because critical calculation data is missing.",
      "Provide valid Ascendant and Mars data before using relationship or remedy guidance.",
    ],
  };
}

export function calculateMangalDosha(input: MangalDoshaInput): MangalDoshaResult {
  const validation = validateChartSnapshot(input);
  if (validation.calculationStatus === "invalid") {
    return invalidResult(input, validation);
  }

  const selectedSchool = input.school ?? "expanded";
  const includeTraditionalExceptions = input.includeTraditionalExceptions ?? true;
  const evidence: RuleEvidence[] = [];
  const cancellationFactors = includeTraditionalExceptions ? findCancellationFactors(input.natal) : [];

  const schoolDetections: Record<ManglikSchool, SchoolDetection> = {
    core: schoolDetection(input.natal, "core"),
    expanded: schoolDetection(input.natal, "expanded"),
    extended: schoolDetection(input.natal, "extended"),
  };

  const selectedHits = schoolDetections[selectedSchool].hits;
  const structural = structuralScore(selectedHits);
  const marsPower = calculateMarsPower(input.natal, evidence);
  const marsAffliction = calculateAffliction(input.natal, evidence);
  const vulnerability = calculateMarriageVulnerability(input.natal, evidence);
  const protection = calculateProtection(input.natal, includeTraditionalExceptions, evidence);
  const activation = calculateActivation(input);

  const functionalBase = FUNCTIONAL_MARS[input.natal.ascendantSign];
  const functionalNature: MangalDoshaResult["functionalNature"] = {
    score: functionalBase.score,
    label: functionalBase.label,
    explanation: functionalBase.text,
  };
  const interaction = (marsPower * marsAffliction) / 100;
  const natalSeverity = round(
    0.35 * structural +
    0.25 * marsAffliction +
    0.25 * vulnerability.score +
    0.15 * interaction -
    0.35 * protection,
  );

  const constructivePotential = round(
    0.55 * marsPower +
    0.25 * (100 - marsAffliction) +
    0.2 * functionalNature.score,
  );

  const currentExpression = activation === null
    ? null
    : round(natalSeverity * (0.45 + 0.55 * (activation / 100)));

  const scores: ScoreBreakdown = {
    structural,
    marsPower,
    marsAffliction,
    marriageVulnerability: vulnerability.score,
    protection,
    natalSeverity,
    constructivePotential,
    activation,
    currentExpression,
  };

  const riskDomains = riskDomainsFromHits(selectedHits);
  const confidence = scoreConfidence(validation.calculationStatus, validation.dataQualityScore);
  const resultCore = { scores, functionalNature, riskDomains, scoreConfidence: confidence };
  const gemstoneSafety = buildGemstoneSafety(resultCore);

  return {
    engineVersion: ENGINE_VERSION,
    rulePackVersion: RULE_PACK_VERSION,
    scoreModelVersion: SCORE_MODEL_VERSION,
    ayanamsha: DEFAULT_AYANAMSHA,
    houseSystem: DEFAULT_HOUSE_SYSTEM,
    generatedAt: new Date().toISOString(),
    calculationStatus: validation.calculationStatus,
    dataQualityScore: validation.dataQualityScore,
    missingInputs: validation.missingInputs,
    warnings: validation.warnings,
    selectedSchool,
    schoolDetections,
    scores,
    severityLabel: severityLabel(natalSeverity, vulnerability.confirmations),
    activationLabel: activationLabel(activation),
    functionalNature,
    marsExpression: marsExpression(marsPower, marsAffliction),
    confirmationCount: vulnerability.confirmations,
    scoreConfidence: confidence,
    traditionalConcentration: traditionalConcentration(input.natal),
    cancellationFactors,
    riskDomains,
    constructiveThemes: constructiveThemesForMars(input.natal, marsPower, marsAffliction),
    evidence,
    gemstoneSafety,
    remedies: buildRemedies(resultCore, gemstoneSafety),
    safetyNotes: [
      "Manglik Dosha is not a medical diagnosis and has no valid relationship to blood-group or Rh-factor matching.",
      "Do not predict death, widowhood, violence, infertility, or divorce from Mars placement alone.",
      "Age 28 is a maturity marker in some traditions, not an automatic cancellation date.",
      "Both partners being Manglik can improve Mars-level balance but cannot guarantee a successful marriage.",
      "The complete marriage judgment must also include the 7th house, 7th lord, Venus, D9, dashas, transits, and real-life compatibility.",
    ],
  };
}

function activeStructuralHouses(result: MangalDoshaResult): Set<number> {
  return new Set(
    result.schoolDetections[result.selectedSchool].hits
      .filter((hit) => hit.activeInSchool)
      .map((hit) => hit.house),
  );
}

function jaccardScore(a: Set<number>, b: Set<number>): number {
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 100;
  const intersection = [...a].filter((value) => b.has(value)).length;
  return round((intersection / union.size) * 100);
}

function traditionalPaapCount(chart: ChartSnapshot): number {
  const sensitive = new Set<House>([1, 2, 4, 7, 8, 12]);
  const malefics: PlanetName[] = ["Sun", "Saturn", "Mars", "Rahu", "Ketu"];
  let count = 0;

  for (const referenceSign of [chart.ascendantSign, chart.planets.Moon?.sign].filter(Boolean) as Sign[]) {
    for (const planet of malefics) {
      const p = chart.planets[planet];
      if (p && sensitive.has(houseFromSign(referenceSign, p.sign))) count++;
    }
  }
  return count;
}

const PARTNER_DOMAIN_RULES: Array<{ domain: string; keywords: string[]; cleanText: string; oneActiveText: string; bothActiveText: string }> = [
  {
    domain: "Speech and family climate",
    keywords: ["speech", "family climate", "shared values", "financial arguments"],
    cleanText: "Low Mars pressure in speech and family climate. This supports easier everyday coordination.",
    oneActiveText: "One chart carries sharper speech/family pressure. Agreements should be written before conflict starts.",
    bothActiveText: "Both charts can react through speech or family climate. This is understandable but needs clear conflict rules.",
  },
  {
    domain: "Domestic peace and property",
    keywords: ["domestic peace", "home", "property", "emotional security"],
    cleanText: "Home and property matters are not the main Mars trigger.",
    oneActiveText: "One partner may feel domestic tension faster. Space, home roles and property decisions need clarity.",
    bothActiveText: "Both charts activate domestic Mars. Home decisions should be planned calmly, not decided during anger.",
  },
  {
    domain: "Partnership power balance",
    keywords: ["spouse", "partnership", "compromise", "power balance"],
    cleanText: "Partnership power balance is not heavily Mars-loaded.",
    oneActiveText: "One chart brings stronger direct partnership Mars. The couple needs explicit decision and repair rules.",
    bothActiveText: "Both charts activate partnership Mars. This can create attraction and drive, but ego clashes need discipline.",
  },
  {
    domain: "Trust and joint finances",
    keywords: ["trust", "intimacy", "joint finances", "in-laws", "crisis response"],
    cleanText: "Trust, intimacy and joint finances have lower Mars pressure.",
    oneActiveText: "One partner may experience trust or joint-finance pressure more sharply. Transparency matters.",
    bothActiveText: "Both charts can feel crisis/trust pressure. Avoid secrecy and keep financial expectations documented.",
  },
  {
    domain: "Privacy and emotional distance",
    keywords: ["privacy", "bed comfort", "suppressed anger", "expenses", "emotional distance"],
    cleanText: "Privacy, sleep and emotional distance are not major Mars triggers.",
    oneActiveText: "One partner may withdraw or suppress anger. Regular private check-ins are important.",
    bothActiveText: "Both charts can suppress or distance under pressure. Repair conversations should be scheduled, not avoided.",
  },
  {
    domain: "Social and family expectations",
    keywords: ["social expectations", "gains", "family expectations through networks"],
    cleanText: "Social/family expectation pressure is not strongly Mars-loaded.",
    oneActiveText: "One chart may feel outside expectations more strongly. Boundaries with relatives and networks help.",
    bothActiveText: "Both charts can be triggered by social/family expectation pressure. Decide boundaries as a couple.",
  },
];

function hasDomain(result: MangalDoshaResult, keywords: string[]): boolean {
  return result.riskDomains.some((domain) => keywords.includes(domain));
}

function partnerDomainCompatibility(personA: MangalDoshaResult, personB: MangalDoshaResult): PartnerDomainCompatibility[] {
  return PARTNER_DOMAIN_RULES.map((rule) => {
    const personAActive = hasDomain(personA, rule.keywords);
    const personBActive = hasDomain(personB, rule.keywords);
    let score = 84;
    let interpretation = rule.cleanText;

    if (personAActive && personBActive) {
      score = Math.max(42, 76 - Math.round((personA.scores.natalSeverity + personB.scores.natalSeverity) / 12));
      interpretation = rule.bothActiveText;
    } else if (personAActive || personBActive) {
      score = Math.max(48, 68 - Math.round(Math.max(personA.scores.natalSeverity, personB.scores.natalSeverity) / 15));
      interpretation = rule.oneActiveText;
    }

    return {
      domain: rule.domain,
      personAActive,
      personBActive,
      score,
      interpretation,
    };
  });
}

function expressionCompatibility(personA: MangalDoshaResult, personB: MangalDoshaResult): ExpressionCompatibility {
  const pair = new Set([personA.marsExpression, personB.marsExpression]);
  if (personA.marsExpression === personB.marsExpression) {
    return {
      score: 78,
      label: "same_style",
      interpretation: "Both partners express Mars in a similar style. This improves recognition, but repeated patterns still need repair habits.",
    };
  }
  if (
    pair.has("constructive_warrior") &&
    (pair.has("intense_but_manageable") || pair.has("low_assertion"))
  ) {
    return {
      score: 74,
      label: "complementary",
      interpretation: "One chart can channel Mars more constructively, which may stabilize the other if respect and listening are present.",
    };
  }
  if (
    pair.has("dominating_or_explosive") &&
    (pair.has("frustrated_or_internalized") || pair.has("low_assertion"))
  ) {
    return {
      score: 42,
      label: "mismatch",
      interpretation: "One partner may push while the other shuts down. This needs strong boundaries and direct communication practice.",
    };
  }
  return {
    score: 60,
    label: "mixed",
    interpretation: "The Mars styles are mixed. Compatibility depends on how quickly both partners repair after conflict.",
  };
}

function activePeriodNames(input: MangalDoshaInput): string[] {
  const names = new Set<string>();
  const md = input.dasha?.mahadasha;
  const ad = input.dasha?.antardasha;
  if (md) names.add(md);
  if (ad) names.add(ad);
  if (input.transits?.planets?.Mars) names.add("Mars transit active");
  if (input.transits?.planets?.Saturn) names.add("Saturn transit active");
  if (input.transits?.planets?.Rahu || input.transits?.planets?.Ketu) names.add("Rahu/Ketu transit active");
  return [...names];
}

function timingOverlap(personAInput: MangalDoshaInput, personBInput: MangalDoshaInput, personA: MangalDoshaResult, personB: MangalDoshaResult): TimingOverlap {
  const aNames = activePeriodNames(personAInput);
  const bNames = activePeriodNames(personBInput);
  const sharedActivators = aNames.filter((name) => bNames.includes(name));
  const aActivation = personA.scores.activation ?? 0;
  const bActivation = personB.scores.activation ?? 0;
  const averageActivation = round((aActivation + bActivation) / 2);

  if (aActivation >= 55 && bActivation >= 55) {
    return {
      score: Math.max(25, 58 - Math.round(averageActivation / 3)),
      label: "high_pressure_overlap",
      sharedActivators,
      interpretation: "Both charts show active Mars pressure at the same time. Avoid rushing major relationship decisions during heated periods.",
    };
  }
  if (aActivation >= 55 || bActivation >= 55 || sharedActivators.length >= 2) {
    return {
      score: 56,
      label: "sensitive_overlap",
      sharedActivators,
      interpretation: "One chart is more activated or the couple shares timing triggers. Use slower decisions and more direct communication.",
    };
  }
  if (aActivation >= 25 || bActivation >= 25 || sharedActivators.length === 1) {
    return {
      score: 68,
      label: "manageable_timing_overlap",
      sharedActivators,
      interpretation: "Timing pressure is present but manageable. Use this period for planning, not impulsive confrontation.",
    };
  }
  return {
    score: 82,
    label: "supportive_timing_buffer",
    sharedActivators,
    interpretation: "There is no strong shared Mars timing pressure. This gives the couple more room to work on compatibility calmly.",
  };
}

function compatibilityRemedyStrategy(
  domainCompatibility: PartnerDomainCompatibility[],
  expression: ExpressionCompatibility,
  timing: TimingOverlap,
): string[] {
  const weakestDomains = [...domainCompatibility].sort((a, b) => a.score - b.score).slice(0, 2);
  const strategy = weakestDomains.map((domain) => `${domain.domain}: ${domain.interpretation}`);

  if (expression.score < 55) {
    strategy.push("Conflict expression: use pause rules, no shouting, no silent treatment, and repair the same day when possible.");
  } else {
    strategy.push("Conflict expression: keep the current strengths, but define how both partners apologize and restart after disagreement.");
  }

  if (timing.score < 60) {
    strategy.push("Timing: avoid wedding-date finalization, property decisions or ultimatums during simultaneous Mars/Saturn/Rahu pressure.");
  } else {
    strategy.push("Timing: use calmer periods for serious planning, counseling and family alignment.");
  }

  return strategy;
}

export function compareMangalDosha(
  personAInput: MangalDoshaInput,
  personBInput: MangalDoshaInput,
): ManglikCompatibilityResult {
  const personA = calculateMangalDosha(personAInput);
  const personB = calculateMangalDosha(personBInput);
  const severityDelta = Math.abs(personA.scores.natalSeverity - personB.scores.natalSeverity);
  const structuralOverlapScore = jaccardScore(activeStructuralHouses(personA), activeStructuralHouses(personB));
  const domainCompatibility = partnerDomainCompatibility(personA, personB);
  const expressionFit = expressionCompatibility(personA, personB);
  const timingFit = timingOverlap(personAInput, personBInput, personA, personB);

  const expressionPenalty = personA.marsExpression === personB.marsExpression ? 0 : 8;
  const balanceScore = round(100 - severityDelta * 1.25 - expressionPenalty + structuralOverlapScore * 0.08);

  let label: ManglikCompatibilityResult["label"];
  if (severityDelta <= 10 && balanceScore >= 80) label = "well_balanced_mars_intensity";
  else if (severityDelta <= 25 && balanceScore >= 60) label = "manageable_mars_difference";
  else if (severityDelta <= 40) label = "notable_mars_mismatch";
  else label = "major_mars_expression_mismatch";

  const paapA = traditionalPaapCount(personAInput.natal);
  const paapB = traditionalPaapCount(personBInput.natal);
  const interpretation: string[] = [];

  if (severityDelta <= 10) interpretation.push("Both charts carry broadly comparable Mars intensity.");
  else interpretation.push("The partners carry noticeably different levels of Mars-related relationship pressure.");

  if (structuralOverlapScore >= 50) {
    interpretation.push("The main Mars conflict domains overlap, which can improve mutual understanding but may also amplify the same trigger.");
  } else {
    interpretation.push("The Mars patterns operate through different life domains; equal percentages would not mean identical relationship needs.");
  }

  if (personA.marsExpression !== personB.marsExpression) {
    interpretation.push("The partners express Mars differently; conflict style and repair habits should be assessed directly.");
  }

  return {
    personA,
    personB,
    severityDelta,
    balanceScore,
    structuralOverlapScore,
    traditionalPaapBalance: {
      personA: paapA,
      personB: paapB,
      difference: Math.abs(paapA - paapB),
    },
    label,
    domainCompatibility,
    expressionCompatibility: expressionFit,
    timingOverlap: timingFit,
    remedyStrategy: compatibilityRemedyStrategy(domainCompatibility, expressionFit, timingFit),
    interpretation,
    disclaimer: "This is a Mars-balance analysis only. It is not a complete marriage compatibility verdict and must not override consent, safety, values, health, or practical relationship assessment.",
  };
}
