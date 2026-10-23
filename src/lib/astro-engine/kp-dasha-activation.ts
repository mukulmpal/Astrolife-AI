/**
 * ============================================================================
 * ASTROLIFE — KP DASHA ACTIVATION DECISION ENGINE (PHASE 2I-E-B)
 * ============================================================================
 * Evaluates whether the running Vimshottari Dasha hierarchy activates a
 * registered event rule in accordance with classical Krishnamurti Paddhati doctrine.
 *
 * Classical KP Principles:
 * 1. Natal Promise Prerequisite:
 *    "Dasha cannot deliver what the natal cuspal sub-lord has denied."
 *    If the natal cusp sub-lord denies or obstructs the event, Dasha activation
 *    is reported as PROMISE_DENIED regardless of Dasha lord beneficence.
 *
 * 2. Joint-Period Conjoined Significator Principle:
 *    Events fructify during the conjoined period of planets that signify the
 *    requisite houses (primary and supporting).
 *    - Mahadasha (MD): Establishes the macro-climate.
 *    - Antardasha (AD / Bhukti): Primary timing gatekeeper.
 *    - Pratyantardasha (PD / Anthara): Narrows the timing window.
 *
 * 3. Sub-period Detriment Veto:
 *    If an active sub-period lord (AD or PD) strongly signifies barrier or
 *    detriment houses (the 12th from the house of matter), the period is
 *    classified as OBSTRUCTED_WINDOW.
 *
 * 4. Zero Arbitrary Scores / Probabilities:
 *    Output is strictly classified into deterministic set-theoretic states.
 *    No probabilities, percentages, weights, or confidence scores exist.
 *
 * 5. Epistemological Reference Guard:
 *    If a rule is REFERENCE_PENDING, activation status is EVALUATION_PENDING.
 * ============================================================================
 */

import type { KPPlanet } from "./kp";
import type {
  SignificationGrade,
  SignificationStrength,
  KPEventPromiseResult,
} from "./kp-evidence-types";
import {
  KPEventRule,
  KP_EVENT_RULE_REGISTRY,
  EpistemologicalStatus,
} from "./kp-rule-registry";
import {
  KPDashaHierarchyEvidence,
  KPDashaEventEvidence,
  KPDashaLevel,
} from "./kp-dasha-evidence";

export type KPDashaTimingState =
  | "TIMING_ALIGNED"     // Natal promise supported + MD/AD/PD conjoined significators aligned without barrier veto
  | "OBSTRUCTED_WINDOW"   // Active sub-period lord vetoes event via strong barrier/detriment signification
  | "MIXED_WINDOW"        // Active lords signify both supporting and detriment houses
  | "NEUTRAL_WINDOW"      // Active lords do not signify houses relevant to the event
  | "PROMISE_DENIED"      // Natal cusp sub-lord denies the event; Dasha cannot override
  | "EVALUATION_PENDING"; // Rule is REFERENCE_PENDING; predictive verdict suppressed

export type KPDashaLevelRole =
  | "SUPPORTING"
  | "OBSTRUCTING"
  | "MIXED"
  | "NEUTRAL";

export interface KPDashaLevelActivation {
  level: KPDashaLevel;
  planet: KPPlanet;
  role: KPDashaLevelRole;
  supportingHousesMatched: number[];
  detrimentHousesMatched: number[];
  barrierHousesMatched: number[];
  significationStrength: SignificationStrength;
  startDate?: string;
  endDate?: string;
  causalReason: string;
}

export interface KPDashaActivationResult {
  ruleId: string;
  ruleName: string;
  ruleStatus: EpistemologicalStatus;
  canonicalSource: string;

  timingState: KPDashaTimingState;
  natalPromiseVerdict: string;

  evaluationWindow: {
    asOfDate: string;
    mahadashaSpan: { start?: string; end?: string; lord: KPPlanet };
    antardashaSpan: { start?: string; end?: string; lord: KPPlanet };
    pratyantardashaSpan: { start?: string; end?: string; lord: KPPlanet };
  };

  levels: {
    mahadasha: KPDashaLevelActivation;
    antardasha: KPDashaLevelActivation;
    pratyantardasha: KPDashaLevelActivation;
    sookshma: KPDashaLevelActivation;
    prana: KPDashaLevelActivation;
  };

  macroVerdict: {
    isFavorableWindow: boolean;
    primaryObstacle?: string;
    summary: string;
  };

  causalAuditTrail: string[];
}

/**
 * Determines the role of an individual Dasha lord for a specific event.
 */
function evaluateLevelRole(ev: KPDashaEventEvidence): {
  role: KPDashaLevelRole;
  reason: string;
} {
  const hasSupporting = ev.supportingHousesMatched.length > 0;
  const hasDetriment = ev.detrimentHousesMatched.length > 0;
  const hasBarrier = ev.barrierHousesMatched.length > 0;
  const hasNegative = hasDetriment || hasBarrier;

  if (hasSupporting && !hasNegative) {
    return {
      role: "SUPPORTING",
      reason: `${ev.dashaLevel} Lord ${ev.planet} signifies supporting houses [${ev.supportingHousesMatched.join(
        ", "
      )}] with zero negative signification.`,
    };
  }

  if (hasNegative && !hasSupporting) {
    const negHouses = [...ev.detrimentHousesMatched, ...ev.barrierHousesMatched];
    return {
      role: "OBSTRUCTING",
      reason: `${ev.dashaLevel} Lord ${ev.planet} signifies negative/barrier houses [${negHouses.join(
        ", "
      )}] with no supporting signification.`,
    };
  }

  if (hasSupporting && hasNegative) {
    return {
      role: "MIXED",
      reason: `${ev.dashaLevel} Lord ${ev.planet} signifies both supporting [${ev.supportingHousesMatched.join(
        ", "
      )}] and detriment/barrier houses [${[
        ...ev.detrimentHousesMatched,
        ...ev.barrierHousesMatched,
      ].join(", ")}].`,
    };
  }

  return {
    role: "NEUTRAL",
    reason: `${ev.dashaLevel} Lord ${ev.planet} does not signify houses relevant to this event.`,
  };
}

/**
 * Evaluates Dasha activation for a single event rule.
 */
export function evaluateDashaActivation(
  promiseResult: KPEventPromiseResult,
  dashaHierarchy: KPDashaHierarchyEvidence,
  rule: KPEventRule
): KPDashaActivationResult {
  const ruleEvidence = dashaHierarchy.eventEvidenceByRule[rule.id]?.levels;

  const promiseVerdict =
    promiseResult.verdict ??
    (promiseResult.status === "SUPPORTED" ||
    promiseResult.status === "OBSTRUCTED" ||
    promiseResult.status === "MIXED" ||
    promiseResult.status === "INCONCLUSIVE" ||
    promiseResult.status === "REFERENCE_PENDING"
      ? promiseResult.status
      : "INCONCLUSIVE");

  const auditTrail: string[] = [
    `Evaluation Date: ${dashaHierarchy.asOfDate}.`,
    `Event Rule: ${rule.name} (ID: ${rule.id}) [Status: ${rule.status}].`,
    `Canonical Reference: ${rule.canonicalSource}.`,
    `Natal Cusp ${promiseResult.primaryCusp} Promise Verdict: ${promiseVerdict}.`,
  ];

  // 1. Guard against unverified/pending rules
  if (rule.status === "Reference_Pending") {
    auditTrail.push(
      "Epistemological Guard: Rule status is REFERENCE_PENDING. Suppressing activation verdict."
    );

    const dummyLevel = (lvl: KPDashaLevel, planet: KPPlanet): KPDashaLevelActivation => ({
      level: lvl,
      planet,
      role: "NEUTRAL",
      supportingHousesMatched: [],
      detrimentHousesMatched: [],
      barrierHousesMatched: [],
      significationStrength: "NONE",
      causalReason: "Rule is Reference_Pending.",
    });

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      ruleStatus: rule.status,
      canonicalSource: rule.canonicalSource,
      timingState: "EVALUATION_PENDING",
      natalPromiseVerdict: promiseVerdict,
      evaluationWindow: {
        asOfDate: dashaHierarchy.asOfDate,
        mahadashaSpan: { lord: dashaHierarchy.hierarchy.mahadasha.planet },
        antardashaSpan: { lord: dashaHierarchy.hierarchy.antardasha.planet },
        pratyantardashaSpan: { lord: dashaHierarchy.hierarchy.pratyantardasha.planet },
      },
      levels: {
        mahadasha: dummyLevel("MAHADASHA", dashaHierarchy.hierarchy.mahadasha.planet),
        antardasha: dummyLevel("ANTARDASHA", dashaHierarchy.hierarchy.antardasha.planet),
        pratyantardasha: dummyLevel("PRATYANTARDASHA", dashaHierarchy.hierarchy.pratyantardasha.planet),
        sookshma: dummyLevel("SOOKSHMA", dashaHierarchy.hierarchy.sookshma.planet),
        prana: dummyLevel("PRANA", dashaHierarchy.hierarchy.prana.planet),
      },
      macroVerdict: {
        isFavorableWindow: false,
        summary: "Evaluation pending classical literature verification of this event rule.",
      },
      causalAuditTrail: auditTrail,
    };
  }

  // 2. Extract level evaluations
  const mdEv = ruleEvidence.mahadasha;
  const adEv = ruleEvidence.antardasha;
  const pdEv = ruleEvidence.pratyantardasha;
  const sdEv = ruleEvidence.sookshma;
  const pranaEv = ruleEvidence.prana;

  const mdRole = evaluateLevelRole(mdEv);
  const adRole = evaluateLevelRole(adEv);
  const pdRole = evaluateLevelRole(pdEv);
  const sdRole = evaluateLevelRole(sdEv);
  const pranaRole = evaluateLevelRole(pranaEv);

  const makeLevelActivation = (
    ev: KPDashaEventEvidence,
    roleData: { role: KPDashaLevelRole; reason: string }
  ): KPDashaLevelActivation => ({
    level: ev.dashaLevel,
    planet: ev.planet,
    role: roleData.role,
    supportingHousesMatched: ev.supportingHousesMatched,
    detrimentHousesMatched: ev.detrimentHousesMatched,
    barrierHousesMatched: ev.barrierHousesMatched,
    significationStrength: ev.significationStrength,
    startDate: ev.startDate,
    endDate: ev.endDate,
    causalReason: roleData.reason,
  });

  const levels: KPDashaActivationResult["levels"] = {
    mahadasha: makeLevelActivation(mdEv, mdRole),
    antardasha: makeLevelActivation(adEv, adRole),
    pratyantardasha: makeLevelActivation(pdEv, pdRole),
    sookshma: makeLevelActivation(sdEv, sdRole),
    prana: makeLevelActivation(pranaEv, pranaRole),
  };

  auditTrail.push(
    `Mahadasha [${mdEv.planet}]: ${mdRole.role} (${mdRole.reason})`,
    `Antardasha [${adEv.planet}]: ${adRole.role} (${adRole.reason})`,
    `Pratyantardasha [${pdEv.planet}]: ${pdRole.role} (${pdRole.reason})`,
    `Sookshma [${sdEv.planet}]: ${sdRole.role} (${sdRole.reason})`,
    `Prana [${pranaEv.planet}]: ${pranaRole.role} (${pranaRole.reason})`
  );

  // 3. Classical Decision Flow
  let timingState: KPDashaTimingState = "NEUTRAL_WINDOW";
  let primaryObstacle: string | undefined = undefined;
  let summary = "";

  // Guard: Natal Promise Prerequisite (Promise cannot be manufactured by Dasha alone)
  if (promiseVerdict === "OBSTRUCTED") {
    timingState = "PROMISE_DENIED";
    primaryObstacle = `Natal Cusp ${promiseResult.primaryCusp} sub-lord denies the event.`;
    summary = `Event is denied by natal cusp sub-lord. In KP doctrine, Dasha cannot deliver what the natal chart denies.`;
    auditTrail.push(`Decision: PROMISE_DENIED. ${summary}`);
  } else if (promiseVerdict === "INCONCLUSIVE") {
    timingState = "NEUTRAL_WINDOW";
    summary = `Natal cusp promise is inconclusive; current dasha cannot be confirmed for manifestation.`;
    auditTrail.push(`Decision: NEUTRAL_WINDOW. ${summary}`);
  } else {
    // Complete hierarchical evidence evaluation across MD, AD, PD, SD, and Prana
    const allSupportingMatched = [
      ...new Set([
        ...mdEv.supportingHousesMatched,
        ...adEv.supportingHousesMatched,
        ...pdEv.supportingHousesMatched,
        ...sdEv.supportingHousesMatched,
        ...pranaEv.supportingHousesMatched,
      ]),
    ];

    const allNegativeMatched = [
      ...new Set([
        ...mdEv.detrimentHousesMatched,
        ...mdEv.barrierHousesMatched,
        ...adEv.detrimentHousesMatched,
        ...adEv.barrierHousesMatched,
        ...pdEv.detrimentHousesMatched,
        ...pdEv.barrierHousesMatched,
        ...sdEv.detrimentHousesMatched,
        ...sdEv.barrierHousesMatched,
        ...pranaEv.detrimentHousesMatched,
        ...pranaEv.barrierHousesMatched,
      ]),
    ];

    const hasSupport = allSupportingMatched.length > 0;
    const hasNegative = allNegativeMatched.length > 0;

    auditTrail.push(
      `Hierarchical Supporting Houses Matched: [${
        hasSupport ? allSupportingMatched.join(", ") : "None"
      }].`,
      `Hierarchical Detriment/Barrier Houses Matched: [${
        hasNegative ? allNegativeMatched.join(", ") : "None"
      }].`
    );

    if (hasSupport && !hasNegative) {
      timingState = "TIMING_ALIGNED";
      summary = `Conjoined significators across the active Dasha hierarchy (MD [${mdEv.planet}], AD [${adEv.planet}], PD [${pdEv.planet}], SD [${sdEv.planet}]) support event manifestation with zero detrimental or barrier house connections.`;
    } else if (hasNegative && !hasSupport) {
      timingState = "OBSTRUCTED_WINDOW";
      primaryObstacle = `All active Dasha period lords signify solely detrimental or barrier houses [${allNegativeMatched.join(
        ", "
      )}] with zero supporting house connections.`;
      summary = `Active Dasha period lords signify solely detrimental or barrier houses for this event, with zero supporting significations across the period hierarchy.`;
    } else if (hasSupport && hasNegative) {
      timingState = "MIXED_WINDOW";
      primaryObstacle = `Dasha hierarchy contains mixed supporting houses [${allSupportingMatched.join(
        ", "
      )}] and adverse houses [${allNegativeMatched.join(", ")}].`;
      summary = `The running Dasha hierarchy contains conjoined supporting and detrimental significations. In classical KP doctrine (e.g. Predictive Stellar Astrology — 3), such periods produce mixed outcomes or distinct sub-period manifestations rather than an unconditional single-factor veto.`;
    } else {
      timingState = "NEUTRAL_WINDOW";
      summary = `Current Dasha lords do not activate the houses necessary for this event.`;
    }

    auditTrail.push(`Decision: ${timingState}. ${summary}`);
  }

  return {
    ruleId: rule.id,
    ruleName: rule.name,
    ruleStatus: rule.status,
    canonicalSource: rule.canonicalSource,
    timingState,
    natalPromiseVerdict: promiseVerdict,
    evaluationWindow: {
      asOfDate: dashaHierarchy.asOfDate,
      mahadashaSpan: {
        start: mdEv.startDate,
        end: mdEv.endDate,
        lord: mdEv.planet,
      },
      antardashaSpan: {
        start: adEv.startDate,
        end: adEv.endDate,
        lord: adEv.planet,
      },
      pratyantardashaSpan: {
        start: pdEv.startDate,
        end: pdEv.endDate,
        lord: pdEv.planet,
      },
    },
    levels,
    macroVerdict: {
      isFavorableWindow: timingState === "TIMING_ALIGNED",
      primaryObstacle,
      summary,
    },
    causalAuditTrail: auditTrail,
  };
}

/**
 * Evaluates Dasha activation across all registered KP event rules.
 */
export function evaluateAllDashaActivations(
  promiseResults: Record<string, KPEventPromiseResult>,
  dashaHierarchy: KPDashaHierarchyEvidence,
  rules: KPEventRule[] = Object.values(KP_EVENT_RULE_REGISTRY)
): Record<string, KPDashaActivationResult> {
  const results: Record<string, KPDashaActivationResult> = {};

  rules.forEach((rule) => {
    const promise = promiseResults[rule.id];
    if (promise) {
      results[rule.id] = evaluateDashaActivation(promise, dashaHierarchy, rule);
    }
  });

  return results;
}

