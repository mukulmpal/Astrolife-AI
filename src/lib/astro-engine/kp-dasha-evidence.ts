/**
 * ============================================================================
 * ASTROLIFE — KP DASHA EVIDENCE ADAPTER (PHASE 2I-E-A)
 * ============================================================================
 * Connects the deterministic Vimshottari Dasha engine to the KP Predictive
 * Evidence Model.
 *
 * Strict Architectural Boundaries:
 * 1. ZERO recalculation of dates — dates come exclusively from the existing
 *    Vimshottari Dasha engine (src/lib/astro-engine/dasha.ts).
 * 2. ZERO recalculation of planetary coordinates, nakshatras, sub-lords, or
 *    house significations — retrieved exclusively from Phase 2I-B kpEvidence.
 * 3. Supports all 5 Dasha levels:
 *    Mahadasha, Antardasha, Pratyantardasha, Sookshma, Prana.
 * 4. Special Node Handling: Rahu/Ketu node representation is preserved exactly
 *    as calculated by the KP Significator Engine.
 * 5. ZERO activation verdicts or numeric scores: This adapter produces pure
 *    DASHA EVIDENCE without predicting event fructification (which belongs to 2I-E-B).
 * ============================================================================
 */

import type { KPPlanet } from "./kp";
import type {
  KPPredictiveEvidence,
  SignificationGrade,
  SignificationStrength,
  SignificationDetail,
} from "./kp-evidence-types";
import {
  KPEventRule,
  KP_EVENT_RULE_REGISTRY,
  EpistemologicalStatus,
} from "./kp-rule-registry";
import {
  getNakshatraFromLongitude,
  getCurrentDashaHierarchy5Levels,
  DashaPeriod,
} from "./dasha";

export type KPDashaLevel =
  | "MAHADASHA"
  | "ANTARDASHA"
  | "PRATYANTARDASHA"
  | "SOOKSHMA"
  | "PRANA";

export interface KPDashaLordEvidence {
  planet: KPPlanet;
  level: KPDashaLevel;
  startDate?: string;
  endDate?: string;
  signifiedHouses: number[];
  significatorGrades: Array<{
    house: number;
    grade: SignificationGrade;
    reason: string;
  }>;
  significationStrength: SignificationStrength;
  source: "KP_SIGNIFICATOR_ENGINE";
  evidenceChain: string[];
}

export interface KPDashaEventEvidence {
  ruleId: string;
  ruleName: string;
  category: string;
  ruleStatus: EpistemologicalStatus;
  canonicalSource: string;

  dashaLevel: KPDashaLevel;
  planet: KPPlanet;
  startDate?: string;
  endDate?: string;

  signifiedHouses: number[];
  supportingHousesMatched: number[];
  facilitatingHousesMatched: number[];
  detrimentHousesMatched: number[];
  barrierHousesMatched: number[];

  evidenceDetails: SignificationDetail[];
  significationStrength: SignificationStrength;

  evidenceChain: string[];
}

export interface KPDashaHierarchyEvidence {
  asOfDate: string;
  hierarchy: {
    mahadasha: KPDashaLordEvidence;
    antardasha: KPDashaLordEvidence;
    pratyantardasha: KPDashaLordEvidence;
    sookshma: KPDashaLordEvidence;
    prana: KPDashaLordEvidence;
  };
  eventEvidenceByRule: Record<
    string,
    {
      ruleId: string;
      ruleName: string;
      ruleStatus: EpistemologicalStatus;
      levels: {
        mahadasha: KPDashaEventEvidence;
        antardasha: KPDashaEventEvidence;
        pratyantardasha: KPDashaEventEvidence;
        sookshma: KPDashaEventEvidence;
        prana: KPDashaEventEvidence;
      };
    }
  >;
}

/**
 * Normalizes any planet string into a canonical KPPlanet.
 */
function normalizeKPPlanet(planetStr: string): KPPlanet {
  const clean = planetStr.trim().toLowerCase();
  if (clean.includes("sun") || clean === "su") return "Sun";
  if (clean.includes("moo") || clean === "mo") return "Moon";
  if (clean.includes("mar") || clean === "ma") return "Mars";
  if (clean.includes("mer") || clean === "me") return "Mercury";
  if (clean.includes("jup") || clean === "ju") return "Jupiter";
  if (clean.includes("ven") || clean === "ve") return "Venus";
  if (clean.includes("sat") || clean === "sa") return "Saturn";
  if (clean.includes("rah") || clean === "ra") return "Rahu";
  if (clean.includes("ket") || clean === "ke") return "Ketu";
  return "Jupiter";
}

/**
 * Derives the explicit signification strength for a set of matched houses.
 */
function deriveStrength(
  matchedHouses: number[],
  details: SignificationDetail[]
): SignificationStrength {
  if (matchedHouses.length === 0) return "NONE";

  const grades = new Set<string>();
  details.forEach((d) => {
    if (matchedHouses.includes(d.house)) {
      if (d.grade === "Grade_1_StarOfOccupant") grades.add("GRADE_1");
      else if (d.grade === "Grade_2_Occupant") grades.add("GRADE_2");
      else if (d.grade === "Grade_3_StarOfLord") grades.add("GRADE_3");
      else if (d.grade === "Grade_4_Lord") grades.add("GRADE_4");
      else if (d.grade === "Node_Representation") grades.add("GRADE_1");
    }
  });

  if (grades.size === 0) return "NONE";
  if (grades.size === 1) return Array.from(grades)[0] as SignificationStrength;
  return "MULTI_GRADE";
}

/**
 * STEP 3 & 4 — DASHA -> KP SIGNIFICATOR ADAPTER
 * Retrieves the existing KP significations for a Dasha lord at a given level.
 * Strictly consumes upstream KP evidence; does not recalculate astronomy.
 */
export function getKPDashaLordEvidence(
  planetRaw: KPPlanet | string,
  level: KPDashaLevel,
  kpEvidence: KPPredictiveEvidence,
  dates?: { startDate?: string; endDate?: string }
): KPDashaLordEvidence {
  const planet = normalizeKPPlanet(planetRaw);
  const planetSig = kpEvidence.planetSignifications[planet];

  const signifiedHouses = planetSig?.allSignifications ?? [];
  const details = planetSig?.details ?? [];

  const significatorGrades = details.map((d) => ({
    house: d.house,
    grade: d.grade,
    reason: d.reason,
  }));

  const significationStrength = deriveStrength(signifiedHouses, details);

  const isNode = planet === "Rahu" || planet === "Ketu";
  const nodeEvidenceDetails = isNode
    ? details.filter((d) => d.grade === "Node_Representation")
    : [];

  const evidenceChain: string[] = [
    `Dasha Level: [${level}] | Lord: ${planet}.`,
    dates?.startDate && dates?.endDate
      ? `Period: ${dates.startDate} to ${dates.endDate}.`
      : "Period: Ongoing / Active window.",
    `KP Houses Signified: [${signifiedHouses.join(", ")}].`,
    `Signification Strength: ${significationStrength}.`,
  ];

  if (isNode && nodeEvidenceDetails.length > 0) {
    evidenceChain.push(
      `Node Agent Representation: ${nodeEvidenceDetails.map((d) => d.reason).join("; ")}.`
    );
  }

  return {
    planet,
    level,
    startDate: dates?.startDate,
    endDate: dates?.endDate,
    signifiedHouses,
    significatorGrades,
    significationStrength,
    source: "KP_SIGNIFICATOR_ENGINE",
    evidenceChain,
  };
}

/**
 * STEP 6 — EVENT RELATIONSHIP MODEL
 * Maps a Dasha Lord's evidence against a registered KP Event Rule.
 * Strictly does NOT issue activation verdicts or probabilities.
 */
export function extractDashaEventEvidence(
  rule: KPEventRule,
  dashaLordEvidence: KPDashaLordEvidence,
  kpEvidence: KPPredictiveEvidence
): KPDashaEventEvidence {
  const planet = dashaLordEvidence.planet;
  const planetSig = kpEvidence.planetSignifications[planet];
  const details = planetSig?.details ?? [];

  const signified = dashaLordEvidence.signifiedHouses;

  const supportingHousesMatched = signified.filter((h) => rule.supportingHouses.includes(h));
  const facilitatingHousesMatched = signified.filter((h) => rule.facilitatingHouses.includes(h));
  const detrimentHousesMatched = signified.filter((h) => rule.detrimentHouses.includes(h));
  const barrierHousesMatched = signified.filter((h) => rule.barrierHouses.includes(h));

  const allMatched = [
    ...supportingHousesMatched,
    ...detrimentHousesMatched,
    ...barrierHousesMatched,
  ];
  const evidenceDetails = details.filter((d) => allMatched.includes(d.house));

  const significationStrength =
    supportingHousesMatched.length > 0
      ? deriveStrength(supportingHousesMatched, details)
      : deriveStrength(allMatched, details);

  const evidenceChain: string[] = [
    `Rule ID: ${rule.id} (${rule.name}) [${rule.status}] ↔ ${dashaLordEvidence.level} Lord: ${planet}.`,
    `Canonical Source: ${rule.canonicalSource}`,
    `Dasha Lord ${planet} Signifies: [${signified.join(", ")}].`,
    `Event Supporting Houses Required: [${rule.supportingHouses.join(", ")}] | Matched: [${
      supportingHousesMatched.length > 0 ? supportingHousesMatched.join(", ") : "None"
    }].`,
    `Event Detriment Houses: [${rule.detrimentHouses.join(", ")}] | Matched: [${
      detrimentHousesMatched.length > 0 ? detrimentHousesMatched.join(", ") : "None"
    }].`,
    `Event Barrier Houses: [${rule.barrierHouses.join(", ")}] | Matched: [${
      barrierHousesMatched.length > 0 ? barrierHousesMatched.join(", ") : "None"
    }].`,
    `Matched Signification Strength: ${significationStrength}.`,
    `Status: DASHA_EVIDENCE_EXTRACTED (Timing activation verdict deferred to Phase 2I-E-B).`,
  ];

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    category: rule.category,
    ruleStatus: rule.status,
    canonicalSource: rule.canonicalSource,
    dashaLevel: dashaLordEvidence.level,
    planet,
    startDate: dashaLordEvidence.startDate,
    endDate: dashaLordEvidence.endDate,
    signifiedHouses: signified,
    supportingHousesMatched,
    facilitatingHousesMatched,
    detrimentHousesMatched,
    barrierHousesMatched,
    evidenceDetails,
    significationStrength,
    evidenceChain,
  };
}

/**
 * STEP 5 — BUILD COMPLETE 5-LEVEL DASHA HIERARCHY EVIDENCE
 * Extracts dates from the existing Dasha engine and maps all 5 levels to KP significations.
 */
export function buildCurrentDashaHierarchyEvidence(
  chart: any,
  kpEvidence: KPPredictiveEvidence,
  asOfDate: Date = new Date(),
  rules: KPEventRule[] = Object.values(KP_EVENT_RULE_REGISTRY)
): KPDashaHierarchyEvidence {
  const moonSidereal = chart?.planets?.Moon?.lon ?? 0;
  const nak = getNakshatraFromLongitude(moonSidereal);
  const birthDate = new Date(`${chart.dob}T${chart.tob}`);

  // Retrieve exact 5 levels from existing dasha.ts engine
  const hierarchy5 = getCurrentDashaHierarchy5Levels(birthDate, nak, asOfDate);

  const toDates = (p: DashaPeriod) => ({
    startDate: p.startDate.toISOString(),
    endDate: p.endDate.toISOString(),
  });

  const mdEvidence = getKPDashaLordEvidence(
    hierarchy5.mahadasha.lord,
    "MAHADASHA",
    kpEvidence,
    toDates(hierarchy5.mahadasha)
  );
  const adEvidence = getKPDashaLordEvidence(
    hierarchy5.antardasha.lord,
    "ANTARDASHA",
    kpEvidence,
    toDates(hierarchy5.antardasha)
  );
  const pdEvidence = getKPDashaLordEvidence(
    hierarchy5.pratyantardasha.lord,
    "PRATYANTARDASHA",
    kpEvidence,
    toDates(hierarchy5.pratyantardasha)
  );
  const sdEvidence = getKPDashaLordEvidence(
    hierarchy5.sookshma.lord,
    "SOOKSHMA",
    kpEvidence,
    toDates(hierarchy5.sookshma)
  );
  const pranaEvidence = getKPDashaLordEvidence(
    hierarchy5.prana.lord,
    "PRANA",
    kpEvidence,
    toDates(hierarchy5.prana)
  );

  const eventEvidenceByRule: KPDashaHierarchyEvidence["eventEvidenceByRule"] = {};

  rules.forEach((rule) => {
    eventEvidenceByRule[rule.id] = {
      ruleId: rule.id,
      ruleName: rule.name,
      ruleStatus: rule.status,
      levels: {
        mahadasha: extractDashaEventEvidence(rule, mdEvidence, kpEvidence),
        antardasha: extractDashaEventEvidence(rule, adEvidence, kpEvidence),
        pratyantardasha: extractDashaEventEvidence(rule, pdEvidence, kpEvidence),
        sookshma: extractDashaEventEvidence(rule, sdEvidence, kpEvidence),
        prana: extractDashaEventEvidence(rule, pranaEvidence, kpEvidence),
      },
    };
  });

  return {
    asOfDate: asOfDate.toISOString(),
    hierarchy: {
      mahadasha: mdEvidence,
      antardasha: adEvidence,
      pratyantardasha: pdEvidence,
      sookshma: sdEvidence,
      prana: pranaEvidence,
    },
    eventEvidenceByRule,
  };
}

