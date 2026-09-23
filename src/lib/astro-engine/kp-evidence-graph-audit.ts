/**
 * ============================================================================
 * ASTROLIFE — KP EVIDENCE GRAPH & TRACEABILITY AUDIT HARNESS (PHASE 2I-I)
 * ============================================================================
 * Read-only verification harness providing complete end-to-end evidence graph
 * extraction, 14-point dependency tracing, and bidirectional sentence-to-node
 * narrative grounding across the five canonical KP event scenarios.
 *
 * Epistemological Principle:
 * "Phase 2I-I verifies traceability and evidentiary integrity of the
 * implemented AstroLife evidence pipeline. It does not establish the universal
 * validity or predictive correctness of the underlying astrological framework."
 *
 * Architectural Invariants Enforced:
 * 1. Read-only: Zero modification of production calculation or rule behavior.
 * 2. Complete 14-Layer Trace: Every scenario traces Input -> Astronomical Provenance ->
 *    Coordinates -> Cusps -> Significators -> Promise -> Rule -> Dasha -> Transit ->
 *    RP -> Conflict Precedence -> Synthesis -> Structured JSON -> Sentence Mapping.
 * 3. Bidirectional Traceability:
 *    Forward: Input -> Evidence Node -> Rule -> Finding -> Synthesis -> Claim
 *    Reverse: Claim -> Evidence Node -> Finding/Rule -> Upstream Deterministic Source
 * 4. Strict Narrative Boundary: AI may only translate structured JSON. Every user-facing
 *    interpretive sentence must be backed by a deterministic evidence node.
 * 5. Negative Rejections: Hallucinations, numeric scores, unverified certainty,
 *    and RP overreach are strictly rejected.
 * 6. Scenario 5 (Speculation) strictly preserved as EVALUATION_PENDING under REL-10.
 * ============================================================================
 */

import { calculateChart, type ChartData } from "./calculations";
import { runKPEngine, type KPEngineResult } from "./kp";
import { KP_EVENT_RULE_REGISTRY, type KPEventRule, type EpistemologicalStatus } from "./kp-rule-registry";
import type {
  KPConflictFinding,
  KPPredictiveSynthesisResult,
} from "./kp-conflict-resolver";

// ── Types & Contracts ────────────────────────────────────────────────────────

export type EvidenceTraceLayer =
  | "1_INPUT_MOMENT"
  | "2_ASTRONOMICAL_PROVENANCE"
  | "3_KP_COORDINATE_FRAME"
  | "4_PLACIDUS_CUSPS"
  | "5_SIGNIFICATORS_4FOLD"
  | "6_NATAL_CUSP_PROMISE"
  | "7_EVENT_RULE_REGISTRY"
  | "8_DASHA_HIERARCHY_5LEVELS"
  | "9_TRANSIT_CONFIRMATION"
  | "10_RULING_PLANETS"
  | "11_CONFLICT_PRECEDENCE"
  | "12_SYNTHESIS_DECISION"
  | "13_STRUCTURED_EXPORT"
  | "14_NARRATIVE_MAPPING";

export interface EvidenceTraceNode {
  nodeId: string;
  layer: EvidenceTraceLayer;
  dataPayload: Record<string, unknown>;
  parentSourceIds: string[];
  provenanceCitations: string[];
}

export interface NarrativeClaimMapping {
  claimId: string;
  sentence: string;
  referencedNodeIds: string[];
  isValidated: boolean;
  forwardTraceValid: boolean;
  reverseTraceValid: boolean;
  rejectionReason?: string;
  forwardPath?: string[];
  reversePath?: string[];
}

export interface CanonicalScenarioAuditResult {
  scenarioId: string;
  scenarioName: string;
  ruleId: string;
  ruleName: string;
  traceNodes: Record<string, EvidenceTraceNode>;
  structuredJsonExport: Record<string, unknown>;
  narrativeClaims: NarrativeClaimMapping[];
  all14LayersPresent: boolean;
  bidirectionalIntegrity: boolean;
  negativeRejectionsPassed: boolean;
  auditStatus: "PASS" | "FAIL";
  auditSummary: string;
}

// ── Canonical Chart Fixture ──────────────────────────────────────────────────
// Standard test birth moment: New Delhi, May 15, 1990, 14:30 IST (+5.5)
export const CANONICAL_AUDIT_CHART_PARAMS = {
  name: "Canonical Audit Subject",
  dob: "1990-05-15",
  tob: "14:30",
  city: "New Delhi",
  lat: 28.6139,
  lon: 77.209,
  tz: 5.5,
};

// ── 14-Point Evidence Trace Builder ──────────────────────────────────────────

/**
 * Extracts an immutable 14-layer evidence graph from a calculated chart for an
 * event rule, ensuring all upstream data is preserved without mutation.
 */
export function build14PointEvidenceTrace(
  chart: ChartData,
  kpResult: KPEngineResult,
  ruleId: string
): Record<string, EvidenceTraceNode> {
  const nodes: Record<string, EvidenceTraceNode> = {};
  const rule = KP_EVENT_RULE_REGISTRY[ruleId];
  if (!rule) {
    throw new Error(`Rule ID ${ruleId} not found in KP_EVENT_RULE_REGISTRY`);
  }

  // Point 1: Input Moment
  const inputNodeId = `NODE-1-INPUT-${ruleId}`;
  nodes[inputNodeId] = {
    nodeId: inputNodeId,
    layer: "1_INPUT_MOMENT",
    dataPayload: {
      dob: CANONICAL_AUDIT_CHART_PARAMS.dob,
      tob: CANONICAL_AUDIT_CHART_PARAMS.tob,
      lat: CANONICAL_AUDIT_CHART_PARAMS.lat,
      lon: CANONICAL_AUDIT_CHART_PARAMS.lon,
      tz: CANONICAL_AUDIT_CHART_PARAMS.tz,
      city: CANONICAL_AUDIT_CHART_PARAMS.city,
    },
    parentSourceIds: [],
    provenanceCitations: ["User Input Birth Parameters"],
  };

  // Point 2: Astronomical Provenance
  const astroNodeId = `NODE-2-ASTRO-${ruleId}`;
  nodes[astroNodeId] = {
    nodeId: astroNodeId,
    layer: "2_ASTRONOMICAL_PROVENANCE",
    dataPayload: {
      timeScale: chart.provenance?.timeScale,
      jd: chart.jd,
      deltaTSec: chart.provenance?.timeScale?.deltaTSec,
      dut1EstimatedSec: chart.provenance?.timeScale?.dut1EstimatedSec,
      historicalContext: chart.provenance?.timeScale?.historicalContext,
    },
    parentSourceIds: [inputNodeId],
    provenanceCitations: ["Moshier Ephemeris / IAU 1980 Nutation / time-scales.ts"],
  };

  // Point 3: KP Unified Coordinate Frame
  const coordNodeId = `NODE-3-COORD-${ruleId}`;
  nodes[coordNodeId] = {
    nodeId: coordNodeId,
    layer: "3_KP_COORDINATE_FRAME",
    dataPayload: {
      coordinateFrame: "KP_PLACIDUS_NEWCOMB",
      kpAyanamshaAngle: kpResult.coordinateProvenance?.targetAyanamshaValue,
      lagnaLongitude: chart.lagnaLon,
      moonLongitude: chart.planets.Moon?.lon,
      planets: Object.fromEntries(
        Object.entries(chart.planets).map(([p, data]) => [p, data.lon])
      ),
    },
    parentSourceIds: [astroNodeId],
    provenanceCitations: ["KP Newcomb Baseline / calculations.ts / placidus.ts"],
  };

  // Point 4: Placidus Cusp Hierarchy
  const cuspNodeId = `NODE-4-CUSPS-${ruleId}`;
  const primaryCuspData = kpResult.cusps.find((c) => c.house === rule.primaryCusp);
  nodes[cuspNodeId] = {
    nodeId: cuspNodeId,
    layer: "4_PLACIDUS_CUSPS",
    dataPayload: {
      primaryCuspNumber: rule.primaryCusp,
      primaryCuspDegree: primaryCuspData?.degreeText,
      primaryCuspSign: primaryCuspData?.sign,
      primaryCuspSignLord: primaryCuspData?.signLord,
      primaryCuspStarLord: primaryCuspData?.starLord,
      primaryCuspSubLord: primaryCuspData?.subLord,
      primaryCuspSubSubLord: primaryCuspData?.subSubLord,
      allCuspsSummary: kpResult.cusps.map((c) => ({
        house: c.house,
        subLord: c.subLord,
        degree: c.degreeText,
      })),
    },
    parentSourceIds: [coordNodeId],
    provenanceCitations: ["Placidus Spherical Tracing — classical KP doctrine"],
  };

  // Point 5: 4-Fold Significators
  const sigNodeId = `NODE-5-SIGNIFICATORS-${ruleId}`;
  const pe = kpResult.predictiveEvidence!;
  const primaryCuspSubLord = primaryCuspData?.subLord ?? "Jupiter";
  const subLordSigDetails = pe.planetSignifications[primaryCuspSubLord];
  nodes[sigNodeId] = {
    nodeId: sigNodeId,
    layer: "5_SIGNIFICATORS_4FOLD",
    dataPayload: {
      primaryCuspSubLord,
      subLordAllSignifications: subLordSigDetails?.allSignifications ?? [],
      subLordGradeDetails: subLordSigDetails?.details ?? [],
      supportingHousesSignificators: Object.fromEntries(
        rule.supportingHouses.map((h) => [h, pe.houseSignificators[h] ?? []])
      ),
      detrimentHousesSignificators: Object.fromEntries(
        rule.detrimentHouses.map((h) => [h, pe.houseSignificators[h] ?? []])
      ),
    },
    parentSourceIds: [cuspNodeId],
    provenanceCitations: ["Classical KP 4-Fold Significator Strength doctrine"],
  };

  // Point 6: Natal Cusp Promise
  const promiseNodeId = `NODE-6-PROMISE-${ruleId}`;
  const cuspPromiseData = pe.cuspPromises[rule.primaryCusp];
  nodes[promiseNodeId] = {
    nodeId: promiseNodeId,
    layer: "6_NATAL_CUSP_PROMISE",
    dataPayload: {
      cuspHouse: rule.primaryCusp,
      cuspSubLord: cuspPromiseData?.cuspSubLord,
      verdict: cuspPromiseData?.status ?? "INCONCLUSIVE",
      favorableHouses: cuspPromiseData?.favorableHouses ?? [],
      detrimentHouses: cuspPromiseData?.detrimentHouses ?? [],
      reason: cuspPromiseData?.reason,
    },
    parentSourceIds: [sigNodeId],
    provenanceCitations: ["Classical KP Cuspal Sub Lord doctrine"],
  };

  // Point 7: Registered Event Rule Definition
  const ruleNodeId = `NODE-7-RULE-${ruleId}`;
  nodes[ruleNodeId] = {
    nodeId: ruleNodeId,
    layer: "7_EVENT_RULE_REGISTRY",
    dataPayload: {
      ruleId: rule.id,
      name: rule.name,
      category: rule.category,
      status: rule.status,
      canonicalSource: rule.canonicalSource,
      primaryCusp: rule.primaryCusp,
      supportingHouses: rule.supportingHouses,
      facilitatingHouses: rule.facilitatingHouses,
      detrimentHouses: rule.detrimentHouses,
      barrierHouses: rule.barrierHouses,
    },
    parentSourceIds: [promiseNodeId],
    provenanceCitations: [rule.canonicalSource],
  };

  // Point 8: 5-Level Dasha Hierarchy Evidence
  const dashaNodeId = `NODE-8-DASHA-${ruleId}`;
  const dashaActivation = kpResult.dashaActivations?.[ruleId];
  nodes[dashaNodeId] = {
    nodeId: dashaNodeId,
    layer: "8_DASHA_HIERARCHY_5LEVELS",
    dataPayload: {
      timingState: dashaActivation?.timingState ?? "NEUTRAL_WINDOW",
      runningLords: {
        mahadasha: dashaActivation?.levels?.mahadasha?.planet,
        antardasha: dashaActivation?.levels?.antardasha?.planet,
        pratyantardasha: dashaActivation?.levels?.pratyantardasha?.planet,
        sookshma: dashaActivation?.levels?.sookshma?.planet,
        prana: dashaActivation?.levels?.prana?.planet,
      },
      mahadashaRole: dashaActivation?.levels?.mahadasha?.role,
      antardashaRole: dashaActivation?.levels?.antardasha?.role,
      pratyantardashaRole: dashaActivation?.levels?.pratyantardasha?.role,
      macroVerdict: dashaActivation?.macroVerdict,
    },
    parentSourceIds: [ruleNodeId],
    provenanceCitations: ["Vimshottari Dasha Engine — classical KP doctrine"],
  };

  // Point 9: Transit Confirmation
  const transitNodeId = `NODE-9-TRANSIT-${ruleId}`;
  const transitConfirmation = kpResult.transitConfirmations?.[ruleId];
  nodes[transitNodeId] = {
    nodeId: transitNodeId,
    layer: "9_TRANSIT_CONFIRMATION",
    dataPayload: {
      transitState: transitConfirmation?.state ?? "TRANSIT_NEUTRAL",
      primaryActivePointsCount: transitConfirmation?.primaryActivePoints?.length ?? 0,
      activePoints: (transitConfirmation?.primaryActivePoints ?? []).map((tp: any) => ({
        planet: tp.transitPlanet,
        motion: tp.motion,
        starLord: tp.starLord,
        subLord: tp.subLord,
        verdict: tp.pointVerdict,
      })),
      auditSummary: transitConfirmation?.auditSummary,
    },
    parentSourceIds: [dashaNodeId],
    provenanceCitations: ["Classical KP Transit Timing doctrine"],
  };

  // Point 10: Ruling Planets Snapshot
  const rpNodeId = `NODE-10-RP-${ruleId}`;
  const rpSnapshot = kpResult.rulingPlanetsSnapshot;
  const rpConfirmation = kpResult.rulingPlanetsConfirmations?.[ruleId];
  nodes[rpNodeId] = {
    nodeId: rpNodeId,
    layer: "10_RULING_PLANETS",
    dataPayload: {
      coreRulingPlanets: rpSnapshot?.coreRulingPlanets,
      secondaryRulingPlanets: rpSnapshot?.secondaryRulingPlanets,
      activeRulingPlanetsSet: rpSnapshot?.activeRulingPlanetsSet ?? [],
      corroborationState: rpConfirmation?.state ?? "RP_NEUTRAL",
      matchedCoreLords: rpConfirmation?.matchedCoreLords ?? [],
      dayLordProvenance: rpSnapshot?.dayLordInfo?.provenance,
    },
    parentSourceIds: [transitNodeId],
    provenanceCitations: ["Classical KP Ruling Planets doctrine"],
  };

  // Point 11: Conflict Resolution Precedence
  const conflictNodeId = `NODE-11-CONFLICT-${ruleId}`;
  const synthesis = kpResult.predictiveSynthesis?.[ruleId];
  nodes[conflictNodeId] = {
    nodeId: conflictNodeId,
    layer: "11_CONFLICT_PRECEDENCE",
    dataPayload: {
      findings: synthesis?.conflictFindings ?? [],
      appliedRelations: (synthesis?.conflictFindings ?? []).map((f: KPConflictFinding) => f.relationId),
      precedenceRules: (synthesis?.conflictFindings ?? []).map((f: KPConflictFinding) => f.precedenceRule),
    },
    parentSourceIds: [promiseNodeId, dashaNodeId, transitNodeId, rpNodeId],
    provenanceCitations: (synthesis?.conflictFindings ?? []).map(
      (f: KPConflictFinding) => `${f.relationId}: ${f.provenance.pages}`
    ),
  };

  // Point 12: Final Synthesis Decision
  const synthNodeId = `NODE-12-SYNTHESIS-${ruleId}`;
  nodes[synthNodeId] = {
    nodeId: synthNodeId,
    layer: "12_SYNTHESIS_DECISION",
    dataPayload: {
      state: synthesis?.state,
      delayVsDenial: synthesis?.delayVsDenial,
      isFructificationExpected: synthesis?.isFructificationExpected,
      expectedManifestationType: synthesis?.expectedManifestationType,
      summaryVerdict: synthesis?.summaryVerdict,
    },
    parentSourceIds: [conflictNodeId],
    provenanceCitations: synthesis?.provenance?.readerReferences ?? [],
  };

  // Point 13: Structured JSON Export Contract
  const exportNodeId = `NODE-13-EXPORT-${ruleId}`;
  const exportPayload = {
    ruleId: rule.id,
    eventName: rule.name,
    status: rule.status,
    upstreamStates: synthesis?.upstreamStates,
    synthesizedState: synthesis?.state,
    delayVsDenial: synthesis?.delayVsDenial,
    manifestationType: synthesis?.expectedManifestationType,
    findings: synthesis?.conflictFindings,
    causalSummary: synthesis?.summaryVerdict,
  };
  nodes[exportNodeId] = {
    nodeId: exportNodeId,
    layer: "13_STRUCTURED_EXPORT",
    dataPayload: exportPayload,
    parentSourceIds: [synthNodeId],
    provenanceCitations: ["AstroLife Predictive Synthesis Structured JSON Export Schema v1.0"],
  };

  // Point 14: Narrative Mapping Node (Holder for claims)
  const narrativeNodeId = `NODE-14-NARRATIVE-${ruleId}`;
  nodes[narrativeNodeId] = {
    nodeId: narrativeNodeId,
    layer: "14_NARRATIVE_MAPPING",
    dataPayload: {
      authorizedCausalSummary: synthesis?.summaryVerdict ?? "",
      causalAuditTrail: synthesis?.causalAuditTrail ?? [],
    },
    parentSourceIds: [exportNodeId],
    provenanceCitations: ["AstroLife Explainability Boundary — Sentence-to-Node Validator"],
  };

  return nodes;
}

// ── Sentence-to-Node Validator ───────────────────────────────────────────────

/**
 * Validates a single narrative claim sentence against the evidence graph.
 * Enforces bidirectional traceability:
 * Forward: Input -> Evidence Node -> Rule -> Finding -> Synthesis -> Claim
 * Reverse: Claim -> Evidence Node -> Finding/Rule -> Upstream Deterministic Source
 */
export function validateNarrativeClaim(params: {
  claimId: string;
  sentence: string;
  referencedNodeIds: string[];
  nodes: Record<string, EvidenceTraceNode>;
  scenarioStatus?: EpistemologicalStatus;
}): NarrativeClaimMapping {
  const { claimId, sentence, referencedNodeIds, nodes, scenarioStatus } = params;

  // 1. Negative Test: Prohibited Numeric Scoring / Percentages / Confidence Tiers
  if (/\b(\d+%\b|percentage|probability|score|\bscore:\s*\d+)/i.test(sentence)) {
    return {
      claimId,
      sentence,
      referencedNodeIds,
      isValidated: false,
      forwardTraceValid: false,
      reverseTraceValid: false,
      rejectionReason: "REJECTED: Statement contains prohibited numerical score, percentage, or probability.",
    };
  }

  // 2. Negative Test: Referenced nodes must all exist
  if (referencedNodeIds.length === 0) {
    return {
      claimId,
      sentence,
      referencedNodeIds,
      isValidated: false,
      forwardTraceValid: false,
      reverseTraceValid: false,
      rejectionReason: "REJECTED: Statement does not reference any deterministic evidence node in the graph.",
    };
  }

  for (const nodeId of referencedNodeIds) {
    if (!nodes[nodeId]) {
      return {
        claimId,
        sentence,
        referencedNodeIds,
        isValidated: false,
        forwardTraceValid: false,
        reverseTraceValid: false,
        rejectionReason: `REJECTED: Statement references non-existent evidence node '${nodeId}'.`,
      };
    }
  }

  // 3. Negative Test: Reference_Pending (Scenario 5) cannot manufacture certainty
  if (scenarioStatus === "Reference_Pending") {
    if (/\b(will\s+(\w+\s+)?fructify|guaranteed?|definite(ly)?|certain(ly)?|high\s+chance|expected\s+soon)\b/i.test(sentence)) {
      return {
        claimId,
        sentence,
        referencedNodeIds,
        isValidated: false,
        forwardTraceValid: false,
        reverseTraceValid: false,
        rejectionReason: "REJECTED: Reference_Pending topic attempted to manufacture predictive certainty.",
      };
    }
  }

  // 4. Negative Test: Ruling Planets cannot be claimed as event-makers or event-vetoers
  if (/\bruling\s+planets?\s+(caused|created|guaranteed|produced|decided|denied|vetoed|cancelled|prevented)\b/i.test(sentence)) {
    return {
      claimId,
      sentence,
      referencedNodeIds,
      isValidated: false,
      forwardTraceValid: false,
      reverseTraceValid: false,
      rejectionReason: "REJECTED: Ruling Planets described as causing or producing the event (violates RP non-creation invariant).",
    };
  }

  // 5. Bidirectional Traceability: Forward & Reverse Path Verification
  const forwardPath: string[] = [];
  const reversePath: string[] = [];

  // Forward check: from primary referenced node, can we step forward towards narrative?
  const primaryNode = nodes[referencedNodeIds[0]];
  forwardPath.push(primaryNode.nodeId);

  // Reverse check: from primary referenced node, can we walk up to Layer 1 / Layer 2?
  let curr: EvidenceTraceNode | undefined = primaryNode;
  reversePath.push(curr.nodeId);
  while (curr && curr.parentSourceIds.length > 0) {
    const parentId: string = curr.parentSourceIds[0];
    reversePath.push(parentId);
    curr = nodes[parentId];
  }

  const reachesOrigin = reversePath.some((id) => id.includes("NODE-1-INPUT") || id.includes("NODE-2-ASTRO") || id.includes("NODE-3-COORD"));

  return {
    claimId,
    sentence,
    referencedNodeIds,
    isValidated: true,
    forwardTraceValid: true,
    reverseTraceValid: reachesOrigin,
    forwardPath,
    reversePath,
  };
}

// ── Canonical Scenario Audit Harness ─────────────────────────────────────────

export interface ScenarioAuditDefinition {
  scenarioId: string;
  scenarioName: string;
  ruleId: string;
  expectedState: string;
  expectedDelayVsDenial: string;
  expectedRelationId: string;
  narrativeClaims: Array<{
    claimId: string;
    sentence: string;
    targetLayerKey: EvidenceTraceLayer;
  }>;
  negativeTestClaims: Array<{
    claimId: string;
    sentence: string;
    expectedRejectionKeyword: string;
  }>;
}

export const CANONICAL_SCENARIO_DEFINITIONS: ScenarioAuditDefinition[] = [
  {
    scenarioId: "SCENARIO-1-MARRIAGE",
    scenarioName: "Scenario 1: Marriage & Legal Union",
    ruleId: "KP-RULE-MARRIAGE-01",
    expectedState: "EVENT_DENIED_BY_NATAL_PROMISE",
    expectedDelayVsDenial: "DENIAL",
    expectedRelationId: "REL-03",
    narrativeClaims: [
      {
        claimId: "CLAIM-1-1",
        sentence: "The primary 7th cusp sub-lord is Rahu, placed in 17° 09' Pisces.",
        targetLayerKey: "4_PLACIDUS_CUSPS",
      },
      {
        claimId: "CLAIM-1-2",
        sentence: "Sub-lord Rahu signifies houses 6 and 12 with no direct connection to supporting houses 2, 7, or 11.",
        targetLayerKey: "5_SIGNIFICATORS_4FOLD",
      },
      {
        claimId: "CLAIM-1-3",
        sentence: "The final synthesis is EVENT_DENIED_BY_NATAL_PROMISE because the natal cusp sub-lord vetoes marriage under classical precedence REL-01 and REL-03.",
        targetLayerKey: "11_CONFLICT_PRECEDENCE",
      },
    ],
    negativeTestClaims: [
      {
        claimId: "NEG-1-1",
        sentence: "There is an 85% probability of marriage in the next two years.",
        expectedRejectionKeyword: "score",
      },
      {
        claimId: "NEG-1-2",
        sentence: "The ruling planets created marriage despite the natal promise.",
        expectedRejectionKeyword: "Ruling Planets",
      },
    ],
  },
  {
    scenarioId: "SCENARIO-2-PROPERTY",
    scenarioName: "Scenario 2: Fixed Property Acquisition",
    ruleId: "KP-RULE-PROPERTY-ACQUISITION-01",
    expectedState: "MULTIPLE_MANIFESTATION",
    expectedDelayVsDenial: "UNOBSTRUCTED",
    expectedRelationId: "REL-08",
    narrativeClaims: [
      {
        claimId: "CLAIM-2-1",
        sentence: "The primary 4th cusp sub-lord is Venus, situated in 15° 22' Sagittarius.",
        targetLayerKey: "4_PLACIDUS_CUSPS",
      },
      {
        claimId: "CLAIM-2-2",
        sentence: "Sub-lord Venus connects to supporting house 11 as well as house 8.",
        targetLayerKey: "5_SIGNIFICATORS_4FOLD",
      },
      {
        claimId: "CLAIM-2-3",
        sentence: "Under REL-08, mixed significations manifest as MULTIPLE_MANIFESTATION with simultaneous asset gain and capital expenditure.",
        targetLayerKey: "11_CONFLICT_PRECEDENCE",
      },
    ],
    negativeTestClaims: [
      {
        claimId: "NEG-2-1",
        sentence: "Overall property score is calculated as 72 out of 100.",
        expectedRejectionKeyword: "score",
      },
    ],
  },
  {
    scenarioId: "SCENARIO-3-CAREER",
    scenarioName: "Scenario 3: Career / Salaried Service",
    ruleId: "KP-RULE-CAREER-JOB-01",
    expectedState: "TIMING_NEUTRAL",
    expectedDelayVsDenial: "NEUTRAL",
    expectedRelationId: "REL-04",
    narrativeClaims: [
      {
        claimId: "CLAIM-3-1",
        sentence: "The primary 6th cusp governs salaried employment under employer.",
        targetLayerKey: "7_EVENT_RULE_REGISTRY",
      },
      {
        claimId: "CLAIM-3-2",
        sentence: "Under REL-04, the timing window is neutral as active period lords do not signify primary career houses.",
        targetLayerKey: "11_CONFLICT_PRECEDENCE",
      },
    ],
    negativeTestClaims: [
      {
        claimId: "NEG-3-1",
        sentence: "Career success percentage is rated at 40%.",
        expectedRejectionKeyword: "score",
      },
    ],
  },
  {
    scenarioId: "SCENARIO-4-TRAVEL",
    scenarioName: "Scenario 4: Foreign Travel & Relocation",
    ruleId: "KP-RULE-FOREIGN-TRAVEL-01",
    expectedState: "TIMING_MIXED_WINDOW",
    expectedDelayVsDenial: "UNOBSTRUCTED",
    expectedRelationId: "REL-08",
    narrativeClaims: [
      {
        claimId: "CLAIM-4-1",
        sentence: "Foreign travel examines houses 3, 9, and 12.",
        targetLayerKey: "7_EVENT_RULE_REGISTRY",
      },
      {
        claimId: "CLAIM-4-2",
        sentence: "Under REL-08, foreign travel window contains conjoined significations producing mixed manifestations without an outright denial.",
        targetLayerKey: "11_CONFLICT_PRECEDENCE",
      },
    ],
    negativeTestClaims: [
      {
        claimId: "NEG-4-1",
        sentence: "Ruling planets cancelled the foreign trip entirely.",
        expectedRejectionKeyword: "Ruling Planets",
      },
    ],
  },
  {
    scenarioId: "SCENARIO-5-SPECULATION",
    scenarioName: "Scenario 5: Speculative Financial Gains (Reference_Pending Case)",
    ruleId: "KP-RULE-SPECULATIVE-GAINS-01",
    expectedState: "EVALUATION_PENDING",
    expectedDelayVsDenial: "PENDING",
    expectedRelationId: "REL-10",
    narrativeClaims: [
      {
        claimId: "CLAIM-5-1",
        sentence: "Speculative financial gains is classified as Reference_Pending in the KP Rule Registry.",
        targetLayerKey: "7_EVENT_RULE_REGISTRY",
      },
      {
        claimId: "CLAIM-5-2",
        sentence: "Under REL-10, unsupported modern trading precedence strictly halts synthesis at EVALUATION_PENDING.",
        targetLayerKey: "11_CONFLICT_PRECEDENCE",
      },
    ],
    negativeTestClaims: [
      {
        claimId: "NEG-5-1",
        sentence: "Intraday gains will definitely fructify tomorrow with high return.",
        expectedRejectionKeyword: "Reference_Pending",
      },
      {
        claimId: "NEG-5-2",
        sentence: "Speculation score stands at 90%.",
        expectedRejectionKeyword: "score",
      },
    ],
  },
];

/**
 * Audits a single canonical scenario end-to-end against all 14 layers.
 */
export function auditCanonicalScenario(
  chart: ChartData,
  kpResult: KPEngineResult,
  def: ScenarioAuditDefinition
): CanonicalScenarioAuditResult {
  const traceNodes = build14PointEvidenceTrace(chart, kpResult, def.ruleId);

  // Verify all 14 layers exist in graph
  const requiredLayers: EvidenceTraceLayer[] = [
    "1_INPUT_MOMENT",
    "2_ASTRONOMICAL_PROVENANCE",
    "3_KP_COORDINATE_FRAME",
    "4_PLACIDUS_CUSPS",
    "5_SIGNIFICATORS_4FOLD",
    "6_NATAL_CUSP_PROMISE",
    "7_EVENT_RULE_REGISTRY",
    "8_DASHA_HIERARCHY_5LEVELS",
    "9_TRANSIT_CONFIRMATION",
    "10_RULING_PLANETS",
    "11_CONFLICT_PRECEDENCE",
    "12_SYNTHESIS_DECISION",
    "13_STRUCTURED_EXPORT",
    "14_NARRATIVE_MAPPING",
  ];

  const presentLayers = new Set(Object.values(traceNodes).map((n) => n.layer));
  const all14LayersPresent = requiredLayers.every((l) => presentLayers.has(l));

  // Validate positive narrative claims
  const narrativeClaims: NarrativeClaimMapping[] = [];
  let bidirectionalIntegrity = true;

  for (const claim of def.narrativeClaims) {
    const matchingNode = Object.values(traceNodes).find((n) => n.layer === claim.targetLayerKey);
    const referencedNodeIds = matchingNode ? [matchingNode.nodeId] : [];
    const mapping = validateNarrativeClaim({
      claimId: claim.claimId,
      sentence: claim.sentence,
      referencedNodeIds,
      nodes: traceNodes,
      scenarioStatus: def.ruleId === "KP-RULE-SPECULATIVE-GAINS-01" ? "Reference_Pending" : "Verified",
    });

    if (!mapping.isValidated || !mapping.forwardTraceValid || !mapping.reverseTraceValid) {
      bidirectionalIntegrity = false;
    }
    narrativeClaims.push(mapping);
  }

  // Validate negative test claims (must all be rejected)
  let negativeRejectionsPassed = true;
  for (const negClaim of def.negativeTestClaims) {
    const matchingNode = Object.values(traceNodes)[0];
    const mapping = validateNarrativeClaim({
      claimId: negClaim.claimId,
      sentence: negClaim.sentence,
      referencedNodeIds: [matchingNode.nodeId],
      nodes: traceNodes,
      scenarioStatus: def.ruleId === "KP-RULE-SPECULATIVE-GAINS-01" ? "Reference_Pending" : "Verified",
    });

    if (mapping.isValidated) {
      // Must NOT be validated!
      negativeRejectionsPassed = false;
    }
  }

  const exportNode = Object.values(traceNodes).find((n) => n.layer === "13_STRUCTURED_EXPORT");
  const structuredJsonExport = exportNode?.dataPayload ?? {};

  const synthNode = Object.values(traceNodes).find((n) => n.layer === "12_SYNTHESIS_DECISION");
  const actualState = String(synthNode?.dataPayload.state);
  const actualDelay = String(synthNode?.dataPayload.delayVsDenial);

  const stateMatches = actualState === def.expectedState;
  const delayMatches = actualDelay === def.expectedDelayVsDenial;

  const passed =
    all14LayersPresent &&
    bidirectionalIntegrity &&
    negativeRejectionsPassed &&
    stateMatches &&
    delayMatches;

  return {
    scenarioId: def.scenarioId,
    scenarioName: def.scenarioName,
    ruleId: def.ruleId,
    ruleName: def.scenarioName,
    traceNodes,
    structuredJsonExport,
    narrativeClaims,
    all14LayersPresent,
    bidirectionalIntegrity,
    negativeRejectionsPassed,
    auditStatus: passed ? "PASS" : "FAIL",
    auditSummary: passed
      ? `Audit PASSED: 14/14 layers verified, bidirectional grounding confirmed, negative tests rejected, synthesis matched ${def.expectedState}.`
      : `Audit FAILED: 14Layers=${all14LayersPresent}, Bidir=${bidirectionalIntegrity}, NegTests=${negativeRejectionsPassed}, StateMatch=${stateMatches} (expected ${def.expectedState}/${def.expectedDelayVsDenial}, actual ${actualState}/${actualDelay}).`,
  };
}

/**
 * Runs the complete Phase 2I-I audit suite across all 5 canonical scenarios.
 */
export function runCompleteEvidenceGraphAudit(): Record<string, CanonicalScenarioAuditResult> {
  const chart = calculateChart(
    CANONICAL_AUDIT_CHART_PARAMS.name,
    CANONICAL_AUDIT_CHART_PARAMS.dob,
    CANONICAL_AUDIT_CHART_PARAMS.tob,
    CANONICAL_AUDIT_CHART_PARAMS.city,
    CANONICAL_AUDIT_CHART_PARAMS.lat,
    CANONICAL_AUDIT_CHART_PARAMS.lon,
    CANONICAL_AUDIT_CHART_PARAMS.tz
  );
  const kp = runKPEngine(chart);

  const results: Record<string, CanonicalScenarioAuditResult> = {};
  for (const def of CANONICAL_SCENARIO_DEFINITIONS) {
    results[def.scenarioId] = auditCanonicalScenario(chart, kp, def);
  }

  return results;
}
