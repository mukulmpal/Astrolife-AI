/**
 * ============================================================================
 * ASTROLIFE — KP PRODUCTION EVIDENCE CONTRACT & CONSUMER ADAPTER (PHASE 2I-J)
 * ============================================================================
 * Defines the immutable, typed production contract and explainability adapter
 * that acts as the sovereign boundary between deterministic evidence graphs
 * and production consumers (AI Chat, PDF Reports, Event Radar, UI Narratives).
 *
 * Constitutional Architectural Principle:
 * RAW ASTROLOGICAL DATA -> AI is an architectural violation for predictive narrative generation.
 * Permitted Interface:
 * RAW DATA -> DETERMINISTIC ENGINES -> EVIDENCE GRAPH -> STRUCTURED CONTRACT -> AI NARRATIVE
 *
 * Epistemological Principle:
 * "Phase 2I-J verifies that the production narrative consumer is constrained
 * to the deterministic evidence contract. It does not establish the universal
 * validity or predictive correctness of the underlying astrological framework."
 * ============================================================================
 */

import type { ChartData } from "./calculations";
import type { KPEngineResult, KPPlanet } from "./kp";
import {
  KP_EVENT_RULE_REGISTRY,
  type KPEventRule,
  type EpistemologicalStatus,
} from "./kp-rule-registry";
import type {
  KPConflictFinding,
  KPConflictState,
  KPPrecedenceRelationId,
  KPPredictiveSynthesisResult,
} from "./kp-conflict-resolver";
import type { KPDashaTimingState } from "./kp-dasha-activation";
import type { TransitConfirmationState } from "./kp-transit-confirmation";
import type { RulingPlanetCorroborationState } from "./kp-ruling-planets";

// ── 1. Typed Production Evidence Contract ───────────────────────────────────

export interface KPPredictiveEvidenceContract {
  contractVersion: "1.0.0";
  generatedAt: string;

  // Metadata & Epistemic Status
  ruleId: string;
  ruleName: string;
  ruleCategory: string;
  ruleStatus: EpistemologicalStatus;
  canonicalSource: string;

  // Cusp & Significator Evidence
  primaryCusp: number;
  supportingHouses: number[];
  detrimentHouses: number[];
  primaryCuspSubLord: KPPlanet;
  subLordSignifiedHouses: number[];
  cuspPromiseVerdict: "PROMISE_SUPPORTED" | "PROMISE_OBSTRUCTED" | "PROMISE_DENIED" | "INCONCLUSIVE";
  cuspPromiseReason: string;

  // Dasha Timing Evidence
  activeDashaLords: {
    mahadasha: KPPlanet;
    antardasha: KPPlanet;
    pratyantardasha?: KPPlanet;
  };
  dashaTimingState: KPDashaTimingState;
  dashaMacroVerdict: string;

  // Transit Evidence
  transitState: TransitConfirmationState;
  transitSummary: string;

  // Ruling Planets Evidence
  rulingPlanetsState: RulingPlanetCorroborationState;
  rulingPlanetsMatchedLords: KPPlanet[];

  // Conflict Precedence & Synthesis (Authoritative)
  conflictFindings: Array<{
    relationId: KPPrecedenceRelationId;
    precedenceRule: string;
    primaryLayer: string;
    subordinateLayer?: string;
    rationale: string;
    provenance: {
      sourceBook: string;
      pages: string;
      verificationStatus: string;
    };
  }>;

  synthesisDecision: {
    state: KPConflictState;
    delayVsDenial: "UNOBSTRUCTED" | "DELAY" | "DENIAL" | "PENDING" | "NEUTRAL";
    isFructificationExpected: boolean;
    expectedManifestationType: string;
    summaryVerdict: string;
  };

  // Traceability & Leakage Guard
  authorizedEvidenceNodeIds: string[];
  authorizedFacts: Record<string, string>;
}

// ── 2. Contract Builder ─────────────────────────────────────────────────────

/**
 * Deterministically constructs the production evidence contract from calculated
 * chart and KP engine outputs for a specific event rule.
 */
export function buildKPPredictiveEvidenceContract(
  chart: ChartData,
  kpResult: KPEngineResult,
  ruleId: string
): KPPredictiveEvidenceContract {
  const rule = KP_EVENT_RULE_REGISTRY[ruleId];
  if (!rule) {
    throw new Error(`Rule ID ${ruleId} not found in KP_EVENT_RULE_REGISTRY`);
  }

  const pe = kpResult.predictiveEvidence;
  if (!pe) {
    throw new Error("KPEngineResult missing predictiveEvidence layer");
  }

  const primaryCuspData = kpResult.cusps.find((c) => c.house === rule.primaryCusp);
  const primaryCuspSubLord = (primaryCuspData?.subLord ?? "Jupiter") as KPPlanet;
  const subLordDetails = pe.planetSignifications[primaryCuspSubLord];
  const cuspPromiseData = pe.cuspPromises[rule.primaryCusp];
  const cuspPromiseVerdict = (cuspPromiseData?.status ?? "INCONCLUSIVE") as
    | "PROMISE_SUPPORTED"
    | "PROMISE_OBSTRUCTED"
    | "PROMISE_DENIED"
    | "INCONCLUSIVE";

  const dashaActivation = kpResult.dashaActivations?.[ruleId];
  const activeDashaLords = {
    mahadasha: (dashaActivation?.levels?.mahadasha?.planet ?? "Ketu") as KPPlanet,
    antardasha: (dashaActivation?.levels?.antardasha?.planet ?? "Venus") as KPPlanet,
    pratyantardasha: dashaActivation?.levels?.pratyantardasha?.planet as KPPlanet | undefined,
  };

  const transitConfirmation = kpResult.transitConfirmations?.[ruleId];
  const rpConfirmation = kpResult.rulingPlanetsConfirmations?.[ruleId];
  const synthesis = kpResult.predictiveSynthesis?.[ruleId] as KPPredictiveSynthesisResult | undefined;

  if (!synthesis) {
    throw new Error(`Predictive synthesis for rule ${ruleId} not found in KPEngineResult`);
  }

  const conflictFindings = (synthesis.conflictFindings ?? []).map((f: KPConflictFinding) => ({
    relationId: f.relationId,
    precedenceRule: f.precedenceRule,
    primaryLayer: f.primaryLayer,
    subordinateLayer: f.subordinateLayer,
    rationale: f.rationale,
    provenance: {
      sourceBook: f.provenance.sourceBook,
      pages: f.provenance.pages,
      verificationStatus: f.provenance.epistemologicalStatus,
    },
  }));

  const authorizedEvidenceNodeIds = [
    `NODE-1-INPUT-${ruleId}`,
    `NODE-3-COORD-${ruleId}`,
    `NODE-4-CUSPS-${ruleId}`,
    `NODE-5-SIGNIFICATORS-${ruleId}`,
    `NODE-6-PROMISE-${ruleId}`,
    `NODE-7-RULE-${ruleId}`,
    `NODE-8-DASHA-${ruleId}`,
    `NODE-9-TRANSIT-${ruleId}`,
    `NODE-10-RP-${ruleId}`,
    `NODE-11-CONFLICT-${ruleId}`,
    `NODE-12-SYNTHESIS-${ruleId}`,
    `NODE-13-STRUCTURED-EXPORT-${ruleId}`,
  ];

  const authorizedFacts: Record<string, string> = {
    RULE_ID: rule.id,
    RULE_NAME: rule.name,
    RULE_STATUS: rule.status,
    CANONICAL_SOURCE: rule.canonicalSource,
    PRIMARY_CUSP: String(rule.primaryCusp),
    SUPPORTING_HOUSES: rule.supportingHouses.join(", "),
    DETRIMENT_HOUSES: rule.detrimentHouses.join(", "),
    PRIMARY_CUSP_SUB_LORD: primaryCuspSubLord,
    CUSP_PROMISE_VERDICT: cuspPromiseVerdict,
    SUB_LORD_SIGNIFIED_HOUSES: (subLordDetails?.allSignifications ?? []).join(", "),
    MAHADASHA_LORD: activeDashaLords.mahadasha,
    ANTARDASHA_LORD: activeDashaLords.antardasha,
    DASHA_TIMING_STATE: dashaActivation?.timingState ?? "NEUTRAL_WINDOW",
    TRANSIT_STATE: transitConfirmation?.state ?? "TRANSIT_NEUTRAL",
    RP_STATE: rpConfirmation?.state ?? "RP_NEUTRAL",
    RP_MATCHED_LORDS: (rpConfirmation?.matchedCoreLords ?? []).join(", "),
    SYNTHESIS_STATE: synthesis.state,
    DELAY_VS_DENIAL: synthesis.delayVsDenial,
    IS_FRUCTIFICATION_EXPECTED: String(synthesis.isFructificationExpected),
    EXPECTED_MANIFESTATION: synthesis.expectedManifestationType,
    APPLIED_RELATIONS: conflictFindings.map((f) => f.relationId).join(", "),
  };

  return {
    contractVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    ruleId: rule.id,
    ruleName: rule.name,
    ruleCategory: rule.category,
    ruleStatus: rule.status,
    canonicalSource: rule.canonicalSource,
    primaryCusp: rule.primaryCusp,
    supportingHouses: rule.supportingHouses,
    detrimentHouses: rule.detrimentHouses,
    primaryCuspSubLord,
    subLordSignifiedHouses: subLordDetails?.allSignifications ?? [],
    cuspPromiseVerdict,
    cuspPromiseReason: cuspPromiseData?.reason ?? "",
    activeDashaLords,
    dashaTimingState: (dashaActivation?.timingState ?? "NEUTRAL_WINDOW") as KPDashaTimingState,
    dashaMacroVerdict: dashaActivation?.macroVerdict?.summary ?? "",
    transitState: (transitConfirmation?.state ?? "TRANSIT_NEUTRAL") as TransitConfirmationState,
    transitSummary: transitConfirmation?.auditSummary ?? "",
    rulingPlanetsState: (rpConfirmation?.state ?? "RP_NEUTRAL") as RulingPlanetCorroborationState,
    rulingPlanetsMatchedLords: (rpConfirmation?.matchedCoreLords ?? []) as KPPlanet[],
    conflictFindings,
    synthesisDecision: {
      state: synthesis.state,
      delayVsDenial: synthesis.delayVsDenial,
      isFructificationExpected: synthesis.isFructificationExpected,
      expectedManifestationType: synthesis.expectedManifestationType,
      summaryVerdict: synthesis.summaryVerdict,
    },
    authorizedEvidenceNodeIds,
    authorizedFacts,
  };
}

// ── 3. Explainability Prompt Builder ────────────────────────────────────────

export interface ExplainabilityPromptPayload {
  systemPrompt: string;
  userMessage: string;
  contractJson: string;
}

/**
 * Builds the strictly bounded explainability prompt for downstream AI layers.
 * Prohibits raw-chart recalculation, numeric scoring, and unauthorized inference.
 */
export function createExplainabilityPrompt(
  contract: KPPredictiveEvidenceContract
): ExplainabilityPromptPayload {
  const isReferencePending = contract.ruleStatus === "Reference_Pending";

  const systemPrompt = `You are the AstroLife Explainability Adapter.
Your SOLE purpose is to explain the pre-calculated, deterministic KP evidence contract supplied below to the user in clear, empathetic, and disciplined language.

MANDATORY CONSTITUTIONAL RULES:
1. EXPLAIN ONLY, DO NOT RECALCULATE:
   - You MUST NOT re-evaluate planetary positions, houses, or aspects.
   - You MUST adopt the supplied synthesis state "${contract.synthesisDecision.state}" as sovereign and final.
   - Under no circumstances may you alter or contradict the synthesis verdict.

2. ABSOLUTE PROHIBITION ON NUMERIC PREDICTION & SCORES:
   - DO NOT provide percentages (e.g., "85% chance").
   - DO NOT provide numeric scores (e.g., "75/100" or "Grade 8").
   - DO NOT provide probability tiers ("High/Moderate/Low probability").
   - DO NOT use probabilistic gambling or certainty language ("odds are", "guaranteed to happen").

3. EPISTEMIC STATUS & REFERENCE_PENDING DISCIPLINE:
   ${
     isReferencePending
       ? `- CRITICAL: This topic ("${contract.ruleName}") has status REFERENCE_PENDING in the classical KP Rule Registry.
   - The synthesis state is strictly EVALUATION_PENDING under classical safeguard REL-10.
   - You MUST state that classical multi-layer precedence is pending verification and refuse to provide predictive confirmation or denial.
   - You MUST NOT manufacture predictive certainty or forecast outcomes.`
       : `- Explain the rule based on classical KP Reader principles citing the applicable relation IDs (${contract.conflictFindings.map((f) => f.relationId).join(", ")}).`
   }

4. RULING PLANETS INVARIANT:
   - Ruling Planets act strictly as corroborative filters.
   - You MUST NOT describe Ruling Planets as creating, producing, causing, or vetoing the event.

5. RAW-INPUT LEAKAGE PROHIBITION:
   - You MUST NOT introduce yogas, doshas, gemstones, remedies, or astrological factors not explicitly present in the evidence contract.
   - You MUST NOT manufacture arbitrary timing dates (e.g. "within 6 months") unless a deterministic timing window is provided in the contract.`;

  const userMessage = `Please explain the KP astrological timing and promise evaluation for "${contract.ruleName}" based on the following structured evidence:

Topic: ${contract.ruleName} (Rule ID: ${contract.ruleId})
Epistemic Status: ${contract.ruleStatus}
Primary Cusp: House ${contract.primaryCusp} (Governed by Sub-Lord ${contract.primaryCuspSubLord})
Cusp Promise Verdict: ${contract.cuspPromiseVerdict} (${contract.cuspPromiseReason})
Active Dasha Lords: MD ${contract.activeDashaLords.mahadasha}, AD ${contract.activeDashaLords.antardasha}
Dasha Window State: ${contract.dashaTimingState}
Transit Confirmation State: ${contract.transitState}
Ruling Planets Corroboration: ${contract.rulingPlanetsState} (Matched Lords: ${contract.rulingPlanetsMatchedLords.join(", ") || "None"})
Precedence Relations Applied: ${contract.conflictFindings.map((f) => `${f.relationId} (${f.provenance.sourceBook}, ${f.provenance.pages})`).join("; ")}
Final Deterministic Synthesis: ${contract.synthesisDecision.state}
Timing Outcome: ${contract.synthesisDecision.delayVsDenial}
Expected Manifestation: ${contract.synthesisDecision.expectedManifestationType}
Engine Summary: ${contract.synthesisDecision.summaryVerdict}

Provide a coherent 2-3 paragraph explanation of why this conclusion was reached based strictly on these facts.`;

  return {
    systemPrompt,
    userMessage,
    contractJson: JSON.stringify(contract, null, 2),
  };
}

// ── 4. Consumer Narrative Runtime Validator ─────────────────────────────────

export interface NarrativeValidationResult {
  isValid: boolean;
  rejections: string[];
  groundedClaimsCount: number;
  auditNotes: string[];
}

/**
 * Validates consumer-generated narrative text against the evidence contract.
 * Rejects unreferenced claims, numeric scores, manufactured certainty, and RP overreach.
 */
export function validateConsumerNarrative(params: {
  narrativeText: string;
  contract: KPPredictiveEvidenceContract;
  claimedEvidenceIds?: string[];
}): NarrativeValidationResult {
  const { narrativeText, contract, claimedEvidenceIds } = params;
  const rejections: string[] = [];
  const auditNotes: string[] = [];
  let groundedClaimsCount = 0;

  // 1. Prohibited Scoring & Probabilities Guard
  if (/(\b\d+\s*%|\bpercentage\b|\bprobability\b|\bscore\b|\b\d+\/100\b)/i.test(narrativeText)) {
    rejections.push("REJECTED: Narrative contains prohibited numerical score, percentage, or probability tier.");
  }

  // 2. Reference_Pending Protection
  if (contract.ruleStatus === "Reference_Pending") {
    if (/\b(will\s+(\w+\s+)?fructify|guaranteed?|definite(ly)?|certain(ly)?|high\s+chance|expected\s+soon|will\s+succeed|will\s+fail)\b/i.test(narrativeText)) {
      rejections.push("REJECTED: Reference_Pending topic attempted to assert predictive certainty or outcome.");
    }
    if (!/evaluation\s+pending|pending\s+verification|reference\s+pending/i.test(narrativeText)) {
      rejections.push("REJECTED: Reference_Pending narrative omitted required evaluation pending disclosure.");
    }
  }

  // 3. Synthesis State Fidelity
  if (contract.synthesisDecision.state === "EVENT_DENIED_BY_NATAL_PROMISE") {
    if (/\b(will\s+occur|event\s+will\s+happen|marriage\s+is\s+promised|success\s+is\s+assured)\b/i.test(narrativeText)) {
      rejections.push("REJECTED: Narrative asserts event occurrence despite EVENT_DENIED_BY_NATAL_PROMISE synthesis.");
    }
  }

  if (contract.synthesisDecision.state === "TIMING_OBSTRUCTED") {
    if (/\b(brings?\s+(\w+\s+){0,3}(now|soon)|currently\s+favo[u]?rable|perfect\s+time|now\s+is\s+the\s+time|immediate\s+fructification|event\s+will\s+happen\s+now)\b/i.test(narrativeText)) {
      rejections.push("REJECTED: Narrative claims favourable immediate window despite TIMING_OBSTRUCTED synthesis.");
    }
  }

  // 4. Ruling Planets Invariant (Non-Creation / Non-Veto)
  if (/\b(ruling\s+planets?\s+(caused|created|guaranteed|produced|decided|denied|vetoed|cancelled|prevented)|(caused|created|guaranteed|produced|decided|denied|vetoed|cancelled|prevented)(\s+\w+){0,4}\s+by\s+(the\s+)?(active\s+)?ruling\s+planets?)\b/i.test(narrativeText)) {
    rejections.push("REJECTED: Ruling Planets claimed as creating, causing, or vetoing the event.");
  }

  // 5. Raw-Input Leakage Guard: Unrepresented Divisional / Astrological Facts
  // If text mentions D-9, Navamsha chart, Ashtakavarga, or specific divisional yogas not in contract
  if (/\b(navamsha\s+chart|d-9\s+chart|ashtakavarga\s+points|manglik\s+dosha|kaal\s+sarp)\b/i.test(narrativeText)) {
    rejections.push("REJECTED: Raw-input leakage detected. Narrative references astrological factors absent from evidence contract.");
  }

  // 6. Arbitrary Exact Timing Guard (Claim-specific grounding)
  // Rejects arbitrary claims like "in six months", "within 30 days" without contract backing
  if (/\b(in\s+(six|6|two|2|three|3|five|5)\s+months|within\s+\d+\s+days|next\s+tuesday)\b/i.test(narrativeText)) {
    rejections.push("REJECTED: Narrative asserts ungrounded arbitrary timing duration not authorized by contract.");
  }

  // 7. Claim-Level Provenance & Evidence Node Verification
  if (claimedEvidenceIds && claimedEvidenceIds.length > 0) {
    for (const id of claimedEvidenceIds) {
      if (!contract.authorizedEvidenceNodeIds.includes(id)) {
        rejections.push(`REJECTED: Claim cites unauthorized or missing evidence node ID '${id}'.`);
      } else {
        groundedClaimsCount++;
      }
    }
  } else {
    // Check if contract synthesis state or ruleId is reflected in text
    if (narrativeText.includes(contract.ruleId) || narrativeText.includes(contract.synthesisDecision.state) || narrativeText.includes(contract.primaryCuspSubLord)) {
      groundedClaimsCount++;
      auditNotes.push("Contract core facts acknowledged in narrative text.");
    }
  }

  return {
    isValid: rejections.length === 0,
    rejections,
    groundedClaimsCount,
    auditNotes,
  };
}
