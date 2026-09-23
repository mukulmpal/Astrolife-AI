/**
 * ============================================================================
 * ASTROLIFE — EXPLAINABILITY & EVIDENCE INSPECTION LAYER (PHASE 2K: SPRINT B)
 * ============================================================================
 * Pure, deterministic presentation adapter for evidence-first explainability,
 * progressive disclosure inspection, provenance chain navigation, and boundary
 * presentation.
 *
 * Epistemological & Architecture Invariants:
 * 1. PURE FUNCTIONS ONLY: Zero React, DOM, or UI framework dependencies.
 * 2. SINGLE SOURCE OF TRUTH: Strictly consumes EvidenceFirstSection / EvidenceFinding.
 * 3. NO ASTROLOGY CALCULATIONS: Zero planetary or house math re-executed.
 * 4. STRICT 1-WAY NAVIGATION: Finding -> REL-XX -> KP-RULE-XX -> Provenance.
 * 5. NO FABRICATED PROVENANCE: Strictly reflects verified contract citations.
 * 6. NO NUMERICAL SCORING: No probabilities, percentages, or arbitrary weights.
 * 7. DECOUPLING INVARIANT: Formatting/text edits cannot mutate underlying state.
 * 8. REFERENCE_PENDING: Retains explicit epistemic disclaimer end-to-end.
 * ============================================================================
 */

import type {
  EvidenceFirstSection,
  EvidenceFinding,
} from "./evidence-first-report";
import type { KPConflictState } from "../astro-engine/kp-conflict-resolver";

/**
 * Structured model for "Why am I seeing this?" explanatory inspection.
 */
export interface WhyAmISeeingThisModel {
  sectionId: string;
  topicName: string;
  primaryFinding: string;
  causalChain: {
    primaryCuspSubLordEvidence: string;
    dashaContext: string;
    transitContext: string;
    rulingPlanetsContext: string;
    synthesisVerdict: string;
  };
  plainLanguageExplanation: string;
  relationSummary: string;
  isReferencePending: boolean;
}

/**
 * Step in the strictly one-way evidence navigation chain.
 */
export interface EvidenceNavigationStep {
  stepType: "FINDING" | "RELATION" | "RULE" | "PROVENANCE";
  identifier: string;
  label: string;
  details: Record<string, string | number | boolean | string[]>;
  citation?: {
    sourceBook?: string;
    pages?: string;
    status: string;
  };
}

/**
 * Full 4-step traceable chain for any single finding:
 * Finding -> Relation (REL-XX) -> Rule (KP-RULE-XX) -> Canonical Provenance.
 */
export interface EvidenceNavigationChain {
  findingId: string;
  steps: [
    EvidenceNavigationStep, // 1: Finding
    EvidenceNavigationStep, // 2: Relation
    EvidenceNavigationStep, // 3: Rule
    EvidenceNavigationStep  // 4: Provenance
  ];
}

/**
 * Three-part boundary presentation separating what is supported,
 * what remains uncertain, and what AstroLife explicitly does NOT claim.
 */
export interface BoundaryPresentationModel {
  whatThisEvidenceSupports: string[];
  whatRemainsUncertain: string[];
  whatAstroLifeIsNotClaiming: string[];
  epistemicStatus: string;
  isReferencePending: boolean;
}

/**
 * Complete progressive disclosure view model for the Evidence Drawer.
 */
export interface EvidenceDrawerViewModel {
  sectionId: string;
  eventName: string;
  synthesisState: KPConflictState;
  casual: {
    title: string;
    summary: string;
    practicalInterpretation: string;
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
    navigationChains: EvidenceNavigationChain[];
  };
  boundaries: BoundaryPresentationModel;
}

/**
 * Builds the "Why am I seeing this?" explanatory view model from an EvidenceFirstSection.
 * Pure deterministic adapter: does not re-compute or alter any upstream evidence.
 */
export function buildWhyAmISeeingThis(section: EvidenceFirstSection): WhyAmISeeingThisModel {
  const isPending = section.uncertainty.referencePending;
  const primaryFinding = section.findings[0]?.whatWasFound || section.fivePartNarrative.whatWasFound;

  return {
    sectionId: section.sectionId,
    topicName: section.eventName,
    primaryFinding,
    causalChain: {
      primaryCuspSubLordEvidence: section.progressiveDisclosure.curious.cuspEvidence,
      dashaContext: section.progressiveDisclosure.curious.dashaEvidence,
      transitContext: section.progressiveDisclosure.curious.transitEvidence,
      rulingPlanetsContext: section.progressiveDisclosure.curious.rpEvidence,
      synthesisVerdict: section.synthesis.summary,
    },
    plainLanguageExplanation: section.fivePartNarrative.whyItMatters,
    relationSummary: section.fivePartNarrative.whichRuleProducedIt,
    isReferencePending: isPending,
  };
}

/**
 * Builds a strict 4-step navigation chain for a given finding:
 * Finding -> Relation (REL-XX) -> Rule (KP-RULE-XX) -> Canonical Provenance.
 *
 * Invariant: Never manufactures citations if missing from upstream contract.
 */
export function buildEvidenceNavigationChain(finding: EvidenceFinding): EvidenceNavigationChain {
  const step1Finding: EvidenceNavigationStep = {
    stepType: "FINDING",
    identifier: finding.findingId,
    label: "Observed Finding",
    details: {
      whatWasFound: finding.whatWasFound,
      whyItMatters: finding.whyItMatters,
      evidenceNodeCount: finding.evidence.nodeIds.length,
      nodeIds: finding.evidence.nodeIds,
    },
  };

  const step2Relation: EvidenceNavigationStep = {
    stepType: "RELATION",
    identifier: finding.relationId,
    label: `Precedence Relation ${finding.relationId}`,
    details: {
      relationId: finding.relationId,
      appliedRationale: finding.whyItMatters,
    },
  };

  const step3Rule: EvidenceNavigationStep = {
    stepType: "RULE",
    identifier: finding.rule.ruleId,
    label: finding.rule.ruleName,
    details: {
      ruleId: finding.rule.ruleId,
      ruleName: finding.rule.ruleName,
      canonicalSource: finding.rule.canonicalSource || "Classical KP Literature",
      status: finding.provenance.epistemologicalStatus,
    },
  };

  const step4Provenance: EvidenceNavigationStep = {
    stepType: "PROVENANCE",
    identifier: `PROVENANCE-${finding.rule.ruleId}-${finding.relationId}`,
    label: finding.provenance.sourceBook || "Classical Reference",
    details: {
      sourceBook: finding.provenance.sourceBook || "Source attribution pending",
      pages: finding.provenance.pages || "Passage pending verification",
      epistemologicalStatus: finding.provenance.epistemologicalStatus,
    },
    citation: {
      sourceBook: finding.provenance.sourceBook,
      pages: finding.provenance.pages,
      status: finding.provenance.epistemologicalStatus,
    },
  };

  return {
    findingId: finding.findingId,
    steps: [step1Finding, step2Relation, step3Rule, step4Provenance],
  };
}

/**
 * Builds the structured three-part boundary presentation:
 * 1. What this evidence supports
 * 2. What remains uncertain
 * 3. What AstroLife does NOT claim
 */
export function buildBoundaryPresentation(section: EvidenceFirstSection): BoundaryPresentationModel {
  const isPending = section.uncertainty.referencePending;

  // 1. What this evidence supports
  const whatThisEvidenceSupports: string[] = [
    section.fivePartNarrative.whatWasFound,
    section.synthesis.summary,
  ];
  if (!isPending) {
    whatThisEvidenceSupports.push(
      `Cuspal sub-lord significations consistent with state: ${section.synthesis.state}.`
    );
  }

  // 2. What remains uncertain
  const whatRemainsUncertain: string[] = [
    section.fivePartNarrative.whatIsUncertain,
    ...section.uncertainty.limitations,
  ];

  // 3. What AstroLife does NOT claim
  const whatAstroLifeIsNotClaiming: string[] = [
    section.fivePartNarrative.whatWeDoNotClaim,
    ...(section.boundaries?.notClaimed || []),
  ];

  return {
    whatThisEvidenceSupports,
    whatRemainsUncertain,
    whatAstroLifeIsNotClaiming,
    epistemicStatus: section.uncertainty.epistemicStatus,
    isReferencePending: isPending,
  };
}

/**
 * Builds the complete Evidence Drawer view model for progressive disclosure.
 * Anchors Casual (L1), Curious (L2), and Technical (L3) to the identical evidence set.
 */
export function buildEvidenceDrawerViewModel(section: EvidenceFirstSection): EvidenceDrawerViewModel {
  const boundaries = buildBoundaryPresentation(section);
  const navigationChains = section.findings.map(buildEvidenceNavigationChain);

  return {
    sectionId: section.sectionId,
    eventName: section.eventName,
    synthesisState: section.synthesis.state,
    casual: {
      title: section.progressiveDisclosure.casual.title,
      summary: section.progressiveDisclosure.casual.summary,
      practicalInterpretation: section.progressiveDisclosure.casual.practicalInterpretation,
    },
    curious: {
      cuspEvidence: section.progressiveDisclosure.curious.cuspEvidence,
      dashaEvidence: section.progressiveDisclosure.curious.dashaEvidence,
      transitEvidence: section.progressiveDisclosure.curious.transitEvidence,
      rpEvidence: section.progressiveDisclosure.curious.rpEvidence,
      whyAmISeeingThis: section.progressiveDisclosure.curious.whyAmISeeingThis,
    },
    technical: {
      contractVersion: section.progressiveDisclosure.technical.contractVersion,
      nodeIds: [...section.progressiveDisclosure.technical.nodeIds],
      appliedRelations: [...section.progressiveDisclosure.technical.appliedRelations],
      sourceCitations: [...section.progressiveDisclosure.technical.sourceCitations],
      auditHash: section.progressiveDisclosure.technical.auditHash,
      navigationChains,
    },
    boundaries,
  };
}
