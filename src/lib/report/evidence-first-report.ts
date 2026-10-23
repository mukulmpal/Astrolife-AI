/**
 * ============================================================================
 * ASTROLIFE — EVIDENCE-FIRST REPORT VIEW MODEL & ADAPTERS (PHASE 2K: SPRINT A)
 * ============================================================================
 * Canonical presentation view model transforming frozen KPPredictiveEvidenceContracts
 * into auditable, explainable report sections across PDF, Dashboard, and Chat.
 *
 * Constitutional Principles:
 * 1. Phase 2K may transform, organize, summarize, and explain evidence.
 *    It MUST NEVER create new predictive evidence or recalculate astrology.
 * 2. Single Source of Truth:
 *    KPPredictiveEvidenceContract -> Evidence-First View Model -> Presentation Surfaces.
 * 3. Five-Part UX Contract:
 *    Every section provides What was found, Why it matters, Which rule produced it,
 *    What is uncertain, and What we do NOT claim.
 * 4. Progressive Disclosure:
 *    Casual (L1) -> Curious (L2) -> Technical (L3), all anchored to the same evidence.
 * 5. Zero Prohibited Scoring:
 *    Absolute absence of percentages, confidence scores, probability tiers, or arbitrary ratings.
 * ============================================================================
 */

import type { ChartData } from "../astro-engine/calculations";
import type { KPEngineResult, KPPlanet } from "../astro-engine/kp";
import { KP_EVENT_RULE_REGISTRY } from "../astro-engine/kp-rule-registry";
import type { KPConflictState } from "../astro-engine/kp-conflict-resolver";
import {
  buildKPPredictiveEvidenceContract,
  type KPPredictiveEvidenceContract,
} from "../astro-engine/kp-production-contract";

// ── 1. Types & Presentation Contracts ───────────────────────────────────────

export interface EvidenceFinding {
  findingId: string;
  relationId: string;
  whatWasFound: string;
  whyItMatters: string;
  rule: {
    ruleId: string;
    ruleName: string;
    canonicalSource?: string;
  };
  evidence: {
    nodeIds: string[];
    facts: string[];
  };
  provenance: {
    sourceBook?: string;
    pages?: string;
    epistemologicalStatus: string;
  };
}

export interface FivePartNarrative {
  whatWasFound: string;
  whyItMatters: string;
  whichRuleProducedIt: string;
  whatIsUncertain: string;
  whatWeDoNotClaim: string;
  practicalInterpretation?: string;
}

export interface ProgressiveDisclosure {
  casual: {
    title: string;
    summary: string;
    practicalInterpretation: string;
    /** @deprecated Use practicalInterpretation instead */
    guidance: string;
  };
  curious: {
    cuspEvidence: string;
    dashaEvidence: string;
    transitEvidence: string;
    rpEvidence: string;
    whyAmISeeingThis: string;
  };
  technical: {
    contractVersion: string;
    nodeIds: string[];
    appliedRelations: string[];
    sourceCitations: string[];
    auditHash: string;
  };
}

export interface EvidenceFirstSection {
  sectionId: string;
  topicId: string;
  eventName: string;
  ruleCategory: string;
  synthesis: {
    state: KPConflictState;
    summary: string;
    timingState: string;
    manifestationType: string;
    delayVsDenial: string;
  };
  fivePartNarrative: FivePartNarrative;
  findings: EvidenceFinding[];
  uncertainty: {
    epistemicStatus: string;
    referencePending: boolean;
    limitations: string[];
  };
  boundaries: {
    notClaimed: string[];
  };
  progressiveDisclosure: ProgressiveDisclosure;
}

export interface EvidenceFirstReportPayload {
  reportId: string;
  generatedAt: string;
  sections: EvidenceFirstSection[];
  globalBoundaries: string[];
}

// ── 2. Standard Ethical & Non-Fatalist Boundaries ───────────────────────────

export const STANDARD_ETHICAL_BOUNDARIES = [
  "This interpretation does not guarantee an absolute, unalterable event; human agency, consciousness, and free will remain sovereign.",
  "No diagnostic medical claim is made; this analysis describes astrological timing indicators and does not replace qualified healthcare advice.",
  "No financial guarantee or investment warranty is provided; speculative activities carry independent real-world risks.",
  "Astrological indicators denote set-theoretic timing alignments rather than fatalistic predetermination.",
];

// ── 3. Presentation View Model Adapter ──────────────────────────────────────

/**
 * Transforms an immutable KPPredictiveEvidenceContract into a structured EvidenceFirstSection.
 * Pure presentation adapter: zero recalculation of astrology.
 */
export function buildEvidenceFirstSection(
  contract: KPPredictiveEvidenceContract
): EvidenceFirstSection {
  const isReferencePending = contract.ruleStatus === "Reference_Pending";

  // Build Individual Findings
  const findings: EvidenceFinding[] = contract.conflictFindings.map((cf, idx) => ({
    findingId: `FINDING-${contract.ruleId}-${idx + 1}`,
    relationId: cf.relationId,
    whatWasFound: `Precedence relation ${cf.relationId} was applied between ${cf.primaryLayer} and ${cf.subordinateLayer ?? "Downstream Timing"}.`,
    whyItMatters: cf.rationale || "Defines how conflicting layer signals resolve under classical Krishnamurti Paddhati principles.",
    rule: {
      ruleId: contract.ruleId,
      ruleName: contract.ruleName,
      canonicalSource: contract.canonicalSource,
    },
    evidence: {
      nodeIds: contract.authorizedEvidenceNodeIds,
      facts: [
        `Primary Cusp Sub-Lord: ${contract.primaryCuspSubLord}`,
        `Cusp Promise Verdict: ${contract.cuspPromiseVerdict}`,
        `Dasha Timing State: ${contract.dashaTimingState}`,
        `Transit State: ${contract.transitState}`,
        `Ruling Planets State: ${contract.rulingPlanetsState}`,
      ],
    },
    provenance: {
      sourceBook: cf.provenance.sourceBook || "Classical KP Reference",
      pages: cf.provenance.pages || "Passage pending verification",
      epistemologicalStatus: cf.provenance.verificationStatus || contract.ruleStatus,
    },
  }));

  // Part 1: What AstroLife Found
  let whatWasFound = "";
  switch (contract.synthesisDecision.state) {
    case "EVENT_DENIED_BY_NATAL_PROMISE":
      whatWasFound = `Under the evaluated ${contract.primaryCusp}th-cusp promise, ${contract.ruleName} is not promised in this chart. The cuspal sub-lord (${contract.primaryCuspSubLord}) connects to detrimental houses without requisite supporting houses.`;
      break;
    case "TIMING_OBSTRUCTED":
      whatWasFound = `The natal promise for ${contract.ruleName} is supported, but the active Dasha period is currently obstructed. Period lords signify barrier houses, preventing immediate event manifestation.`;
      break;
    case "MULTIPLE_MANIFESTATION":
      whatWasFound = `Dual significations are active for ${contract.ruleName}. Under classical principles, concurrent gain and expenditure manifest in their respective sub-periods rather than cancelling out.`;
      break;
    case "TIMING_MIXED_WINDOW":
      whatWasFound = `The current window for ${contract.ruleName} carries conjoined supportive and contrary significations, indicating mixed or qualified progress.`;
      break;
    case "TIMING_NEUTRAL":
      whatWasFound = `The matter of ${contract.ruleName} is not actively stimulated during the current period hierarchy. Active period lords do not connect to requisite event cusps.`;
      break;
    case "EVALUATION_PENDING":
      whatWasFound = `Evaluation for ${contract.ruleName} is strictly pending. Multi-layer conflict precedence for this modern topic lacks attested classical literature and cannot be authoritatively synthesized.`;
      break;
    default:
      whatWasFound = contract.synthesisDecision.summaryVerdict;
      break;
  }

  // Part 2: Why It Matters
  const whyItMatters = `The primary house of matter is Cusp ${contract.primaryCusp}, governed by Sub-Lord ${contract.primaryCuspSubLord}. Sub-lord significations (${contract.subLordSignifiedHouses.join(", ") || "None"}) determine the foundational promise (${contract.cuspPromiseVerdict}). Downstream timing is gated by Mahadasha Lord ${contract.activeDashaLords.mahadasha} and Antardasha Lord ${contract.activeDashaLords.antardasha} (${contract.dashaTimingState}), confirmed by Transits (${contract.transitState}), and corroborated by Ruling Planets (${contract.rulingPlanetsState}).`;

  // Part 3: Which Rule Produced It
  const whichRuleProducedIt = isReferencePending
    ? `Classified under ${contract.ruleId} (${contract.ruleName}). Synthesis halted under classical epistemic safeguard REL-10 (Missing Classical Precedence Rule).`
    : `Evaluated under ${contract.ruleId} (${contract.ruleName}). Canonical source: ${contract.canonicalSource}. Applied precedence: ${contract.conflictFindings.map((f) => `${f.relationId} (${f.provenance.sourceBook}, ${f.provenance.pages})`).join("; ") || "Direct alignment"}.`;

  // Part 4: What Is Uncertain
  const limitations: string[] = [
    `Classification status: ${contract.ruleStatus}.`,
    `Evaluation window: Reflects active Dasha lords (${contract.activeDashaLords.mahadasha} / ${contract.activeDashaLords.antardasha}) and current transit snapshot.`,
  ];
  if (isReferencePending) {
    limitations.push("Classical KP literature lacks attested classical literature and verified multi-layer precedence for modern intraday/speculative financial markets. Precedence resolution is deliberately withheld.");
  }
  const whatIsUncertain = isReferencePending
    ? "Predictive outcome is strictly uncertain because classical literature does not provide an attested conflict rule for modern speculative trading."
    : `This evaluation represents the active timing window under period lords ${contract.activeDashaLords.mahadasha}-${contract.activeDashaLords.antardasha}. Future sub-period shifts will alter the activation profile.`;

  // Part 5: What We Do NOT Claim
  const notClaimed: string[] = [
    ...STANDARD_ETHICAL_BOUNDARIES,
    `No certainty is claimed beyond the deterministic significators of Cusp ${contract.primaryCusp}.`,
  ];
  const whatWeDoNotClaim = "AstroLife does not guarantee events or fate. Astrological factors represent conditional tendencies, timing windows, and psychological rhythms. Personal discernment and ethical effort remain paramount.";

  const practicalInterpretation = isReferencePending
    ? "Approach this matter with practical prudence and personal discernment; astrological certainty cannot be claimed due to lack of classical literature for intraday speculation."
    : contract.synthesisDecision.summaryVerdict;

  const fivePartNarrative: FivePartNarrative = {
    whatWasFound,
    whyItMatters,
    whichRuleProducedIt,
    whatIsUncertain,
    whatWeDoNotClaim,
    practicalInterpretation,
  };

  // Progressive Disclosure: 3 User Levels
  const progressiveDisclosure: ProgressiveDisclosure = {
    casual: {
      title: contract.ruleName,
      summary: whatWasFound,
      practicalInterpretation: isReferencePending
        ? "Approach this matter with practical prudence and personal discernment; astrological certainty cannot be claimed due to lack of classical literature for intraday speculation."
        : contract.synthesisDecision.summaryVerdict,
      guidance: isReferencePending
        ? "Approach this matter with practical prudence and personal discernment; astrological certainty cannot be claimed due to lack of classical literature for intraday speculation."
        : contract.synthesisDecision.summaryVerdict,
    },
    curious: {
      cuspEvidence: `Cusp ${contract.primaryCusp} Sub-Lord ${contract.primaryCuspSubLord} signifies houses [${contract.subLordSignifiedHouses.join(", ")}], yielding verdict ${contract.cuspPromiseVerdict}.`,
      dashaEvidence: `Active running lords: MD ${contract.activeDashaLords.mahadasha}, AD ${contract.activeDashaLords.antardasha} (${contract.dashaTimingState}).`,
      transitEvidence: `Transit state: ${contract.transitState}. ${contract.transitSummary}`,
      rpEvidence: `Ruling Planets state: ${contract.rulingPlanetsState}. Matched lords: ${contract.rulingPlanetsMatchedLords.join(", ") || "None"}.`,
      whyAmISeeingThis: whyItMatters,
    },
    technical: {
      contractVersion: contract.contractVersion,
      nodeIds: contract.authorizedEvidenceNodeIds,
      appliedRelations: contract.conflictFindings.map((f) => f.relationId),
      sourceCitations: contract.conflictFindings.map((f) => `${f.relationId}: ${f.provenance.sourceBook}, ${f.provenance.pages}`),
      auditHash: `AUDIT-${contract.ruleId}-${contract.synthesisDecision.state}-${contract.conflictFindings.map((f) => f.relationId).join("-")}`,
    },
  };

  return {
    sectionId: `SECTION-${contract.ruleId}`,
    topicId: contract.ruleId,
    eventName: contract.ruleName,
    ruleCategory: contract.ruleCategory,
    synthesis: {
      state: contract.synthesisDecision.state,
      summary: contract.synthesisDecision.summaryVerdict,
      timingState: contract.dashaTimingState,
      manifestationType: contract.synthesisDecision.expectedManifestationType,
      delayVsDenial: contract.synthesisDecision.delayVsDenial,
    },
    fivePartNarrative,
    findings,
    uncertainty: {
      epistemicStatus: contract.ruleStatus,
      referencePending: isReferencePending,
      limitations,
    },
    boundaries: {
      notClaimed,
    },
    progressiveDisclosure,
  };
}

// ── 4. Comprehensive Report Payload Builder ─────────────────────────────────

const KEY_REPORT_RULE_IDS = [
  "KP-RULE-MARRIAGE-01",
  "KP-RULE-PROPERTY-ACQUISITION-01",
  "KP-RULE-CAREER-JOB-01",
  "KP-RULE-FOREIGN-TRAVEL-01",
  "KP-RULE-SPECULATIVE-GAINS-01",
];

/**
 * Builds the comprehensive Evidence-First Report payload from a calculated chart
 * and KPEngineResult across all key life areas.
 */
export function buildEvidenceFirstReport(
  chart: ChartData,
  kpResult: KPEngineResult
): EvidenceFirstReportPayload {
  const sections: EvidenceFirstSection[] = [];

  for (const ruleId of KEY_REPORT_RULE_IDS) {
    if (KP_EVENT_RULE_REGISTRY[ruleId]) {
      const contract = buildKPPredictiveEvidenceContract(chart, kpResult, ruleId);
      sections.push(buildEvidenceFirstSection(contract));
    }
  }

  return {
    reportId: `ASTROLIFE-EVIDENCE-REPORT-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    sections,
    globalBoundaries: STANDARD_ETHICAL_BOUNDARIES,
  };
}

// ── 5. Lossless Serialization & Deserialization ─────────────────────────────

export function serializeEvidenceFirstReport(payload: EvidenceFirstReportPayload): string {
  return JSON.stringify(payload, null, 2);
}

export function deserializeEvidenceFirstReport(json: string): EvidenceFirstReportPayload {
  const parsed = JSON.parse(json);
  if (!parsed.reportId || !Array.isArray(parsed.sections)) {
    throw new Error("Invalid EvidenceFirstReportPayload JSON format");
  }
  return parsed as EvidenceFirstReportPayload;
}

// ── 6. Presentation Surface Adapters (Semantic Identity Verification) ───────

/**
 * Adapts an EvidenceFirstSection for the PDF renderer design system.
 */
export function renderSectionForPdfAdapter(section: EvidenceFirstSection): Record<string, unknown> {
  return {
    component: "PdfEvidenceSection",
    id: section.sectionId,
    title: section.eventName,
    synthesisBadge: section.synthesis.state,
    whatWasFoundText: section.fivePartNarrative.whatWasFound,
    whyItMattersText: section.fivePartNarrative.whyItMatters,
    ruleCitationText: section.fivePartNarrative.whichRuleProducedIt,
    uncertaintyBox: section.fivePartNarrative.whatIsUncertain,
    boundariesNotice: section.fivePartNarrative.whatWeDoNotClaim,
    findingsCount: section.findings.length,
    underlyingState: section.synthesis.state,
    underlyingRelations: section.progressiveDisclosure.technical.appliedRelations,
    provenanceCitations: section.progressiveDisclosure.technical.sourceCitations,
  };
}

/**
 * Adapts an EvidenceFirstSection for the interactive Dashboard UI.
 */
export function renderSectionForDashboardAdapter(section: EvidenceFirstSection): Record<string, unknown> {
  return {
    component: "DashboardEvidenceDrawer",
    id: section.sectionId,
    eventName: section.eventName,
    stateChip: section.synthesis.state,
    casualView: section.progressiveDisclosure.casual,
    curiousView: section.progressiveDisclosure.curious,
    technicalView: section.progressiveDisclosure.technical,
    findings: section.findings,
    underlyingState: section.synthesis.state,
    underlyingRelations: section.progressiveDisclosure.technical.appliedRelations,
    provenanceCitations: section.progressiveDisclosure.technical.sourceCitations,
  };
}
