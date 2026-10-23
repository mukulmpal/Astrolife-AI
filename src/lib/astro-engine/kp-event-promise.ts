/**
 * ============================================================================
 * ASTROLIFE — KP EVENT PROMISE EVALUATION ENGINE (PHASE 2I-D AUDITED)
 * ============================================================================
 * Evaluates event promises strictly through deterministic set-theoretic
 * intersection of Primary Cusp Sub-Lord 4-Fold Significations against
 * the canonical KP Rule Registry.
 *
 * Strict Architectural Guardrails:
 * 1. ZERO count-based "dominance" or heuristic comparisons.
 * 2. ZERO arbitrary numeric scores, percentages, or probability ratings.
 * 3. NO confidenceTier (High/Moderate/Low). Replaced with explicit
 *    significationStrength (GRADE_1, GRADE_2, GRADE_3, GRADE_4, MULTI_GRADE).
 * 4. REFERENCE_PENDING rules NEVER produce a predictive verdict; they return
 *    status "REFERENCE_PENDING".
 * 5. PROVISIONAL rules preserve explicit ruleStatus: "Provisional" provenance.
 * ============================================================================
 */

import type { KPPlanet } from "./kp";
import type {
  KPPredictiveEvidence,
  EventPromiseStatus,
  SignificationStrength,
  KPEventPromiseResult,
  SignificationDetail,
} from "./kp-evidence-types";
import {
  KPEventRule,
  KP_EVENT_RULE_REGISTRY,
  EpistemologicalStatus,
} from "./kp-rule-registry";

export type { EventPromiseStatus, SignificationStrength, KPEventPromiseResult };

/**
 * Derives the exact hierarchical grade of signification for matched houses.
 */
function deriveSignificationStrength(
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
      else if (d.grade === "Node_Representation") grades.add("GRADE_1"); // Nodes act with primary strength
    }
  });

  if (grades.size === 0) return "NONE";
  if (grades.size === 1) return Array.from(grades)[0] as SignificationStrength;
  return "MULTI_GRADE";
}

/**
 * Evaluates a specific KP Event Rule against a chart's predictive evidence.
 * Pure function: (rule, evidence) -> KPEventPromiseResult
 */
export function evaluateEventRule(
  rule: KPEventRule,
  evidence: KPPredictiveEvidence
): KPEventPromiseResult {
  const cuspKey = `Cusp${rule.primaryCusp}`;
  const cuspPoint = evidence.pointEvidence[cuspKey];

  const cuspLord: KPPlanet = (cuspPoint?.signLord as KPPlanet) ?? "Mars";
  const cuspStarLord: KPPlanet = (cuspPoint?.starLord as KPPlanet) ?? "Ketu";
  const cuspSubLord: KPPlanet = (cuspPoint?.subLord as KPPlanet) ?? "Mars";

  const subSignifications = evidence.planetSignifications[cuspSubLord];
  const signified = subSignifications?.allSignifications ?? [];
  const details = subSignifications?.details ?? [];

  // Deterministic set intersections
  const supportingHousesMatched = signified.filter((h) => rule.supportingHouses.includes(h));
  const facilitatingHousesMatched = signified.filter((h) => rule.facilitatingHouses.includes(h));
  const detrimentHousesMatched = signified.filter((h) => rule.detrimentHouses.includes(h));
  const barrierHousesMatched = signified.filter((h) => rule.barrierHouses.includes(h));

  // Extract relevant evidence details for matched houses
  const allMatchedHouses = [
    ...supportingHousesMatched,
    ...detrimentHousesMatched,
    ...barrierHousesMatched,
  ];
  const evidenceDetails = details.filter((d) => allMatchedHouses.includes(d.house));

  // Derive explicit signification strength for supporting houses (or negative houses if none)
  const significationStrength =
    supportingHousesMatched.length > 0
      ? deriveSignificationStrength(supportingHousesMatched, details)
      : deriveSignificationStrength(allMatchedHouses, details);

  // ──────────────────────────────────────────────────────────────────────────
  // STRICT EPISTEMOLOGICAL GUARD: REFERENCE_PENDING RULES
  // An unverified rule must NEVER issue a predictive verdict (SUPPORTED / OBSTRUCTED / MIXED).
  // ──────────────────────────────────────────────────────────────────────────
  if (rule.status === "Reference_Pending") {
    const status: EventPromiseStatus = "REFERENCE_PENDING";
    const summary = `${rule.name} has REFERENCE_PENDING status. Astrological methodology is undergoing empirical/literature calibration; no authoritative predictive conclusion is issued.`;
    const evidenceChain: string[] = [
      `Rule ID: ${rule.id} (${rule.name}) — Epistemological Status: [REFERENCE_PENDING].`,
      `Canonical Source: ${rule.canonicalSource}`,
      `Primary Cusp: House ${rule.primaryCusp} | Cusp Lord: ${cuspLord} | Star-Lord: ${cuspStarLord} | Sub-Lord: ${cuspSubLord}.`,
      `Sub-Lord ${cuspSubLord} signifies houses: [${signified.join(", ")}].`,
      `Audit Status: Predictive verdict suppressed pending formal reference verification.`,
    ];

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      category: rule.category,
      ruleStatus: rule.status,
      canonicalSource: rule.canonicalSource,
      primaryCusp: rule.primaryCusp,
      cuspLord,
      primaryCuspStarLord: cuspStarLord,
      primaryCuspSubLord: cuspSubLord,
      cuspSubLord,
      status,
      significationStrength,
      signifiedHouses: signified,
      supportingHousesMatched,
      facilitatingHousesMatched,
      detrimentHousesMatched,
      barrierHousesMatched,
      evidenceDetails,
      summary,
      evidenceChain,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DETERMINISTIC DECISION TREE (FOR VERIFIED AND PROVISIONAL RULES)
  // Strict Boolean Set Logic: ZERO count-based heuristic comparisons.
  // ──────────────────────────────────────────────────────────────────────────
  const hasSupport = supportingHousesMatched.length > 0;
  const hasBarriers = barrierHousesMatched.length > 0;
  const hasDetriment = detrimentHousesMatched.length > 0;
  const hasNegative = hasBarriers || hasDetriment;

  let status: EventPromiseStatus;
  let summary: string;

  if (hasSupport && !hasNegative) {
    // Favorable matches present, zero negative matches
    status = "SUPPORTED";
    summary = `${rule.name} is SUPPORTED. The ${rule.primaryCusp}th cusp sub-lord (${cuspSubLord}) signifies supporting houses [${supportingHousesMatched.join(
      ", "
    )}] with zero detriment or barrier houses.`;
  } else if (!hasSupport && hasNegative) {
    // Negative matches present with zero supporting matches
    status = "OBSTRUCTED";
    summary = `${rule.name} is OBSTRUCTED. The ${rule.primaryCusp}th cusp sub-lord (${cuspSubLord}) connects to obstructing houses [${(hasBarriers
      ? barrierHousesMatched
      : detrimentHousesMatched
    ).join(", ")}] with zero direct support for event houses.`;
  } else if (hasSupport && hasNegative) {
    // Both supporting and negative matches present: dual/mixed promise
    status = "MIXED";
    summary = `${rule.name} shows MIXED promise. The ${rule.primaryCusp}th cusp sub-lord (${cuspSubLord}) connects to supporting houses [${supportingHousesMatched.join(
      ", "
    )}], but also connects to obstructing houses [${(hasBarriers
      ? barrierHousesMatched
      : detrimentHousesMatched
    ).join(", ")}]. Outcome is subject to delays, conditions, or requires timing activation.`;
  } else {
    // Neither supporting nor negative matches present: sub-lord connects to neutral houses
    status = "INCONCLUSIVE";
    summary = `${rule.name} is INCONCLUSIVE at the natal root. The ${rule.primaryCusp}th cusp sub-lord (${cuspSubLord}) signifies neutral houses [${signified.join(
      ", "
    )}]. Event promise is latent and requires explicit period lord activation.`;
  }

  // Prepend provisional disclaimer if rule is Provisional
  if (rule.status === "Provisional") {
    summary = `[PROVISIONAL METHODOLOGY] ${summary}`;
  }

  // Construct transparent evidence chain
  const evidenceChain: string[] = [
    `Rule ID: ${rule.id} (${rule.name}) — Epistemological Status: [${rule.status}].`,
    `Canonical Source: ${rule.canonicalSource}`,
    `Primary Cusp: House ${rule.primaryCusp} | Cusp Lord: ${cuspLord} | Star-Lord: ${cuspStarLord} | Sub-Lord: ${cuspSubLord}.`,
    `Cusp Sub-Lord ${cuspSubLord} signifies houses: [${signified.join(", ")}].`,
    `Supporting houses required: [${rule.supportingHouses.join(", ")}] | Matched: [${
      supportingHousesMatched.length > 0 ? supportingHousesMatched.join(", ") : "None"
    }].`,
    `Detriment houses: [${rule.detrimentHouses.join(", ")}] | Matched: [${
      detrimentHousesMatched.length > 0 ? detrimentHousesMatched.join(", ") : "None"
    }].`,
    `Barrier houses: [${rule.barrierHouses.join(", ")}] | Matched: [${
      barrierHousesMatched.length > 0 ? barrierHousesMatched.join(", ") : "None"
    }].`,
    `Signification Strength: ${significationStrength}.`,
    `Promise Evaluation Verdict: ${status}.`,
  ];

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    category: rule.category,
    ruleStatus: rule.status,
    canonicalSource: rule.canonicalSource,
    primaryCusp: rule.primaryCusp,
    cuspLord,
    primaryCuspStarLord: cuspStarLord,
    primaryCuspSubLord: cuspSubLord,
    cuspSubLord,
    status,
    significationStrength,
    signifiedHouses: signified,
    supportingHousesMatched,
    facilitatingHousesMatched,
    detrimentHousesMatched,
    barrierHousesMatched,
    evidenceDetails,
    summary,
    evidenceChain,
  };
}

/**
 * Evaluates all registered KP Event Rules against the chart's predictive evidence.
 */
export function evaluateAllEventRules(
  evidence: KPPredictiveEvidence,
  filterStatus?: EpistemologicalStatus
): Record<string, KPEventPromiseResult> {
  const results: Record<string, KPEventPromiseResult> = {};

  Object.values(KP_EVENT_RULE_REGISTRY).forEach((rule) => {
    if (filterStatus && rule.status !== filterStatus) return;
    results[rule.id] = evaluateEventRule(rule, evidence);
  });

  return results;
}
