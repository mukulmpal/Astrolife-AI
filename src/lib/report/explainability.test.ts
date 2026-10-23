/**
 * ============================================================================
 * ASTROLIFE — EXPLAINABILITY & EVIDENCE INSPECTION TESTS (PHASE 2K: SPRINT B)
 * ============================================================================
 * Comprehensive verification suite for the pure explainability layer,
 * progressive disclosure inspection (Casual, Curious, Technical),
 * 4-step navigation chains, boundary presentations, and immutability invariants.
 *
 * Test Matrix:
 * 1. Pure headless execution (independent of DOM, React, PDF)
 * 2. Same contract drives all explanations without divergence
 * 3. Zero predictive recalculation or astrological rule re-execution
 * 4. Absolute absence of numeric prediction scores, probabilities, or percentages
 * 5. Strict 4-step navigation chain (Finding -> Relation -> Rule -> Provenance)
 * 6. Zero fabricated provenance / safe fallback for sparse citations
 * 7. Reference_Pending end-to-end preservation with epistemic guard
 * 8. Technical tier exposes Rule ID, Relation ID, audit hash, and node IDs
 * 9. L1 wording enforces practicalInterpretation (no prescriptive directives)
 * 10. Boundary presentation strictly distinguishes the 3 mandatory categories:
 *     - What this evidence supports
 *     - What remains uncertain
 *     - What AstroLife does not claim
 * 11. Multi-tier semantic equivalence across Casual, Curious, and Technical
 * 12. Immutability invariant: Changing explanatory text cannot change state,
 *     findingId, relationId, ruleId, nodeIds, or provenance
 * 13. Determinism: Repeated generation produces bit-identical view models
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import { calculateChart } from "../astro-engine/calculations";
import { runKPEngine } from "../astro-engine/kp";
import { CANONICAL_AUDIT_CHART_PARAMS } from "../astro-engine/kp-evidence-graph-audit";
import { buildKPPredictiveEvidenceContract } from "../astro-engine/kp-production-contract";
import {
  buildEvidenceFirstSection,
  buildEvidenceFirstReport,
  type EvidenceFirstSection,
} from "./evidence-first-report";
import {
  buildWhyAmISeeingThis,
  buildEvidenceNavigationChain,
  buildBoundaryPresentation,
  buildEvidenceDrawerViewModel,
} from "./explainability";

function getCanonicalChartAndKP() {
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
  return { chart, kp };
}

// ── Test 1: Pure Headless Execution ─────────────────────────────────────────
test("2K-B Test 1 — Pure explainability functions execute headlessly without DOM or React", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const whyModel = buildWhyAmISeeingThis(section);
  const drawerModel = buildEvidenceDrawerViewModel(section);
  const boundaryModel = buildBoundaryPresentation(section);

  assert.ok(whyModel && typeof whyModel === "object");
  assert.ok(drawerModel && typeof drawerModel === "object");
  assert.ok(boundaryModel && typeof boundaryModel === "object");
  assert.equal(typeof window, "undefined", "Must run cleanly in pure headless Node environment");
});

// ── Test 2: Same Contract Drives All Explanations ───────────────────────────
test("2K-B Test 2 — Single source of truth: all models strictly derive from the evidence contract", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const whyModel = buildWhyAmISeeingThis(section);
  const drawerModel = buildEvidenceDrawerViewModel(section);

  assert.equal(whyModel.sectionId, section.sectionId);
  assert.equal(whyModel.topicName, section.eventName);
  assert.equal(drawerModel.synthesisState, contract.synthesisDecision.state);
  assert.equal(drawerModel.casual.title, contract.ruleName);
});

// ── Test 3: Zero Predictive Recalculation ───────────────────────────────────
test("2K-B Test 3 — Zero recalculation: view models do not modify or recalculate astrological state", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-PROPERTY-ACQUISITION-01");
  const section = buildEvidenceFirstSection(contract);

  const contractBefore = JSON.stringify(contract);
  const sectionBefore = JSON.stringify(section);

  buildWhyAmISeeingThis(section);
  buildEvidenceDrawerViewModel(section);
  buildBoundaryPresentation(section);

  assert.equal(JSON.stringify(contract), contractBefore, "Contract must remain bit-identical");
  assert.equal(JSON.stringify(section), sectionBefore, "Section must remain bit-identical");
});

// ── Test 4: Absolute Absence of Scores & Probabilities ──────────────────────
test("2K-B Test 4 — Absolute absence of numerical prediction scores, percentages, and probabilities", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const report = buildEvidenceFirstReport(chart, kp);

  for (const section of report.sections) {
    const drawerModel = buildEvidenceDrawerViewModel(section);
    const serialized = JSON.stringify(drawerModel);

    assert.equal(
      /(\b\d+\s*%|\bprobability\b|\bscore:\s*\d+|\b\d+\/100\b|\bconfidence:\s*\d+)/i.test(serialized),
      false,
      `Section ${section.sectionId} must not contain numerical scores or probabilities`
    );
  }
});

// ── Test 5: Strict 4-Step Navigation Chain ──────────────────────────────────
test("2K-B Test 5 — Every finding exposes a strict 4-step navigation chain (Finding -> Relation -> Rule -> Provenance)", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  assert.ok(section.findings.length > 0, "Must have at least one finding");

  for (const finding of section.findings) {
    const chain = buildEvidenceNavigationChain(finding);

    assert.equal(chain.findingId, finding.findingId);
    assert.equal(chain.steps.length, 4, "Must have exactly 4 navigation steps");

    // Step 1: Finding
    assert.equal(chain.steps[0].stepType, "FINDING");
    assert.equal(chain.steps[0].identifier, finding.findingId);

    // Step 2: Relation
    assert.equal(chain.steps[1].stepType, "RELATION");
    assert.equal(chain.steps[1].identifier, finding.relationId);
    assert.ok(chain.steps[1].identifier.startsWith("REL-"));

    // Step 3: Rule
    assert.equal(chain.steps[2].stepType, "RULE");
    assert.equal(chain.steps[2].identifier, finding.rule.ruleId);
    assert.ok(chain.steps[2].identifier.startsWith("KP-RULE-"));

    // Step 4: Canonical Provenance
    assert.equal(chain.steps[3].stepType, "PROVENANCE");
    assert.ok(chain.steps[3].citation?.sourceBook);
    assert.ok(chain.steps[3].citation?.status);
  }
});

// ── Test 6: Zero Fabricated Provenance ──────────────────────────────────────
test("2K-B Test 6 — Safe fallback for sparse provenance without fabricating citations", () => {
  const sparseFinding = {
    findingId: "FINDING-SPARSE-01",
    relationId: "REL-10",
    whatWasFound: "Observation without detailed citation",
    whyItMatters: "Causal rationale",
    rule: {
      ruleId: "KP-RULE-SPARSE-01",
      ruleName: "Sparse Topic",
      canonicalSource: "Provisional literature",
    },
    evidence: {
      nodeIds: ["NODE-SPARSE-01"],
      facts: [],
    },
    provenance: {
      sourceBook: "",
      pages: "",
      epistemologicalStatus: "Provisional",
    },
  };

  const chain = buildEvidenceNavigationChain(sparseFinding);
  const provStep = chain.steps[3];

  assert.equal(provStep.citation?.sourceBook, "");
  assert.equal(provStep.details.sourceBook, "Source attribution pending");
  assert.equal(provStep.details.pages, "Passage pending verification");
  assert.equal(provStep.citation?.status, "Provisional");
});

// ── Test 7: Reference_Pending End-to-End Preservation ───────────────────────
test("2K-B Test 7 — Reference_Pending end-to-end preservation with epistemic guard", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-SPECULATIVE-GAINS-01");
  const section = buildEvidenceFirstSection(contract);

  const whyModel = buildWhyAmISeeingThis(section);
  const boundaryModel = buildBoundaryPresentation(section);
  const drawerModel = buildEvidenceDrawerViewModel(section);

  assert.equal(whyModel.isReferencePending, true);
  assert.equal(boundaryModel.isReferencePending, true);
  assert.equal(boundaryModel.epistemicStatus, "Reference_Pending");
  assert.equal(drawerModel.synthesisState, "EVALUATION_PENDING");

  // Uncertainty disclosure must clearly explain the lack of classical literature
  const hasPendingDisclaimer = boundaryModel.whatRemainsUncertain.some((item) =>
    item.includes("modern intraday/speculative financial markets") || item.includes("uncertain")
  );
  assert.ok(hasPendingDisclaimer, "Must expose explicit uncertainty limitation for Reference_Pending");
});

// ── Test 8: Technical Mode Exposes Audit Metadata ───────────────────────────
test("2K-B Test 8 — Technical mode exposes contract version, Rule ID, Relation ID, audit hash, and node IDs", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-CAREER-JOB-01");
  const section = buildEvidenceFirstSection(contract);
  const drawerModel = buildEvidenceDrawerViewModel(section);

  assert.equal(drawerModel.technical.contractVersion, contract.contractVersion);
  assert.ok(drawerModel.technical.auditHash.startsWith("AUDIT-KP-RULE-CAREER-JOB-01"));
  assert.ok(drawerModel.technical.nodeIds.length > 0);
  assert.ok(drawerModel.technical.appliedRelations.length > 0);
  assert.ok(drawerModel.technical.navigationChains.length > 0);
});

// ── Test 9: L1 Wording Enforces Practical Interpretation ────────────────────
test("2K-B Test 9 — L1 Casual disclosure uses practicalInterpretation rather than prescriptive directives", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);
  const drawerModel = buildEvidenceDrawerViewModel(section);

  assert.ok(drawerModel.casual.practicalInterpretation.length > 0);
  // Ensure no prescriptive imperatives like "you must do" or "guaranteed"
  assert.equal(/you must\b|we guarantee|absolute destiny/i.test(drawerModel.casual.practicalInterpretation), false);
});

// ── Test 10: Boundary Presentation Distinguishes the 3 Mandatory Categories ─
test("2K-B Test 10 — BoundaryPresentation strictly distinguishes supports, uncertain, and not claimed", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);
  const boundaries = buildBoundaryPresentation(section);

  assert.ok(boundaries.whatThisEvidenceSupports.length > 0, "Must specify supported facts");
  assert.ok(boundaries.whatRemainsUncertain.length > 0, "Must specify active timing uncertainties");
  assert.ok(boundaries.whatAstroLifeIsNotClaiming.length > 0, "Must specify non-claimed ethical boundaries");

  // What is not claimed must include standard ethical disclaimers
  const hasEthicalBoundary = boundaries.whatAstroLifeIsNotClaiming.some((item) =>
    item.includes("does not guarantee") || item.includes("discernment")
  );
  assert.ok(hasEthicalBoundary, "Must retain ethical anti-fatalism disclaimer");
});

// ── Test 11: Multi-Tier Semantic Equivalence ────────────────────────────────
test("2K-B Test 11 — Casual, Curious, and Technical tiers remain semantically equivalent", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);
  const drawer = buildEvidenceDrawerViewModel(section);

  // All three levels must agree on the underlying state and primary finding
  assert.ok(drawer.casual.summary.includes(`${contract.primaryCusp}`) && drawer.casual.summary.includes(contract.ruleName));
  assert.ok(drawer.curious.cuspEvidence.includes(`Cusp ${contract.primaryCusp}`));
  assert.equal(drawer.synthesisState, contract.synthesisDecision.state);
  assert.ok(drawer.technical.appliedRelations.includes(contract.conflictFindings[0].relationId));
});

// ── Test 12: Presentation / State Immutability Invariant (Explicit Guard) ────
test("2K-B Test 12 (Explicit Invariant) — Changing explanatory text cannot mutate state, findingId, relationId, ruleId, nodeIds, or provenance", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-PROPERTY-ACQUISITION-01");
  const section = buildEvidenceFirstSection(contract);
  const drawer = buildEvidenceDrawerViewModel(section);

  // Snapshot immutable core identifiers
  const originalState = drawer.synthesisState;
  const originalFindingIds = drawer.technical.navigationChains.map((c) => c.findingId);
  const originalRelationIds = drawer.technical.navigationChains.map((c) => c.steps[1].identifier);
  const originalRuleIds = drawer.technical.navigationChains.map((c) => c.steps[2].identifier);
  const originalNodeIds = [...drawer.technical.nodeIds];
  const originalProvenanceCitations = JSON.stringify(drawer.technical.sourceCitations);

  // Mutate presentation strings (e.g. customized UI wording or translations)
  drawer.casual.summary = "Custom translated summary for mobile app.";
  drawer.casual.practicalInterpretation = "Customized practical interpretation text.";
  drawer.curious.whyAmISeeingThis = "Custom conversational explanation.";

  // Core architectural properties must remain unaltered
  assert.equal(drawer.synthesisState, originalState);
  assert.deepEqual(drawer.technical.navigationChains.map((c) => c.findingId), originalFindingIds);
  assert.deepEqual(drawer.technical.navigationChains.map((c) => c.steps[1].identifier), originalRelationIds);
  assert.deepEqual(drawer.technical.navigationChains.map((c) => c.steps[2].identifier), originalRuleIds);
  assert.deepEqual(drawer.technical.nodeIds, originalNodeIds);
  assert.equal(JSON.stringify(drawer.technical.sourceCitations), originalProvenanceCitations);
});

// ── Test 13: Deterministic Output ───────────────────────────────────────────
test("2K-B Test 13 — Repeated drawer and explainability generation is 100% deterministic", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const drawer1 = buildEvidenceDrawerViewModel(section);
  const drawer2 = buildEvidenceDrawerViewModel(section);

  assert.deepEqual(drawer1, drawer2, "Repeated view model generation must be bit-identical");
});
