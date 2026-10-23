/**
 * ============================================================================
 * ASTROLIFE — EVIDENCE-FIRST REPORT ADAPTER TESTS (PHASE 2K: SPRINT A)
 * ============================================================================
 * Verification suite for the canonical presentation view model and adapters.
 *
 * Test Matrix:
 * A. Contract mapping
 * B. Five-part section completeness
 * C. EvidenceFinding provenance preservation
 * D. Multiple findings / multiple relations
 * E. Reference_Pending propagation
 * F. Missing provenance handling
 * G. No numeric scoring introduced
 * H. No raw astronomical input leakage
 * I. No predictive-rule recalculation
 * J. Progressive-disclosure consistency
 * K. Serialization round-trip integrity
 * L. Immutable upstream evidence
 * M. Deterministic adapter output
 * S1. Semantic equivalence across PDF and Dashboard adapters
 * S2. Presentation wording decoupling invariant
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import { calculateChart } from "../astro-engine/calculations";
import { runKPEngine } from "../astro-engine/kp";
import { CANONICAL_AUDIT_CHART_PARAMS } from "../astro-engine/kp-evidence-graph-audit";
import {
  buildKPPredictiveEvidenceContract,
  type KPPredictiveEvidenceContract,
} from "../astro-engine/kp-production-contract";
import {
  buildEvidenceFirstSection,
  buildEvidenceFirstReport,
  serializeEvidenceFirstReport,
  deserializeEvidenceFirstReport,
  renderSectionForPdfAdapter,
  renderSectionForDashboardAdapter,
  STANDARD_ETHICAL_BOUNDARIES,
  type EvidenceFirstSection,
} from "./evidence-first-report";

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

// ── Test A: Contract Mapping ────────────────────────────────────────────────
test("2K Sprint A Test A — Contract mapping extracts complete typed section from evidence contract", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  assert.equal(section.sectionId, "SECTION-KP-RULE-MARRIAGE-01");
  assert.equal(section.topicId, "KP-RULE-MARRIAGE-01");
  assert.equal(section.eventName, contract.ruleName);
  assert.equal(section.synthesis.state, contract.synthesisDecision.state);
  assert.equal(section.synthesis.summary, contract.synthesisDecision.summaryVerdict);
  assert.equal(section.synthesis.timingState, contract.dashaTimingState);
  assert.equal(section.synthesis.manifestationType, contract.synthesisDecision.expectedManifestationType);
  assert.equal(section.synthesis.delayVsDenial, contract.synthesisDecision.delayVsDenial);
});

// ── Test B: Five-Part Section Completeness ───────────────────────────────────
test("2K Sprint A Test B — Five-part section completeness across all generated sections", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const report = buildEvidenceFirstReport(chart, kp);

  assert.ok(report.sections.length >= 5, "Must generate at least 5 key topic sections");

  for (const section of report.sections) {
    const { fivePartNarrative } = section;
    assert.ok(fivePartNarrative.whatWasFound.length > 20, "whatWasFound must be substantive");
    assert.ok(fivePartNarrative.whyItMatters.length > 20, "whyItMatters must explain causal chain");
    assert.ok(fivePartNarrative.whichRuleProducedIt.length > 20, "whichRuleProducedIt must cite rule/sources");
    assert.ok(fivePartNarrative.whatIsUncertain.length > 20, "whatIsUncertain must specify limitations");
    assert.ok(fivePartNarrative.whatWeDoNotClaim.length > 20, "whatWeDoNotClaim must state ethical boundaries");
  }
});

// ── Test C: EvidenceFinding Provenance Preservation ─────────────────────────
test("2K Sprint A Test C — EvidenceFinding provenance preserved without metadata loss", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  assert.ok(section.findings.length > 0, "Must have findings");

  for (const finding of section.findings) {
    assert.ok(finding.findingId.startsWith("FINDING-"));
    assert.ok(finding.relationId.startsWith("REL-"));
    assert.ok(finding.whatWasFound.length > 0);
    assert.ok(finding.whyItMatters.length > 0);
    assert.equal(finding.rule.ruleId, contract.ruleId);
    assert.ok(finding.provenance.sourceBook && finding.provenance.sourceBook.length > 0);
    assert.ok(finding.provenance.pages && finding.provenance.pages.length > 0);
    assert.ok(finding.provenance.epistemologicalStatus.length > 0);
    assert.ok(finding.evidence.nodeIds.length > 0);
    assert.ok(finding.evidence.facts.length > 0);
  }
});

// ── Test D: Multiple Findings / Multiple Relations ──────────────────────────
test("2K Sprint A Test D — Multiple findings and relations preserved in compound scenarios", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-PROPERTY-ACQUISITION-01");
  const section = buildEvidenceFirstSection(contract);

  assert.equal(section.synthesis.state, "MULTIPLE_MANIFESTATION");
  assert.ok(section.findings.length >= 1);
  assert.ok(section.findings.some((f) => f.relationId === "REL-08"));
});

// ── Test E: Reference_Pending Propagation ───────────────────────────────────
test("2K Sprint A Test E — Reference_Pending propagation strictly marks uncertainty", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-SPECULATIVE-GAINS-01");
  const section = buildEvidenceFirstSection(contract);

  assert.equal(section.uncertainty.epistemicStatus, "Reference_Pending");
  assert.equal(section.uncertainty.referencePending, true);
  assert.equal(section.synthesis.state, "EVALUATION_PENDING");
  assert.ok(section.fivePartNarrative.whichRuleProducedIt.includes("REL-10"));
  assert.ok(section.fivePartNarrative.whatIsUncertain.includes("uncertain"));
  assert.ok(section.uncertainty.limitations.some((l) => l.includes("lacks attested classical literature")));
});

// ── Test F: Missing Provenance Handling ─────────────────────────────────────
test("2K Sprint A Test F — Missing provenance handled safely without fabricating metadata", () => {
  // Deliberately construct contract with missing optional pages/book
  const sparseContract: KPPredictiveEvidenceContract = {
    contractVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    ruleId: "KP-RULE-TEST-01",
    ruleName: "Test Topic",
    ruleCategory: "Test",
    ruleStatus: "Provisional",
    canonicalSource: "Modern secondary literature",
    primaryCusp: 1,
    supportingHouses: [1, 11],
    detrimentHouses: [12],
    primaryCuspSubLord: "Jupiter",
    subLordSignifiedHouses: [1],
    cuspPromiseVerdict: "PROMISE_SUPPORTED",
    cuspPromiseReason: "Test promise",
    activeDashaLords: { mahadasha: "Sun", antardasha: "Moon" },
    dashaTimingState: "NEUTRAL_WINDOW",
    dashaMacroVerdict: "Test macro",
    transitState: "TRANSIT_NEUTRAL",
    transitSummary: "Test summary",
    rulingPlanetsState: "RP_NEUTRAL",
    rulingPlanetsMatchedLords: [],
    conflictFindings: [
      {
        relationId: "REL-10",
        precedenceRule: "Epistemic Guard",
        primaryLayer: "NATAL_PROMISE",
        rationale: "Testing fallback",
        provenance: {
          sourceBook: "",
          pages: "",
          verificationStatus: "",
        },
      },
    ],
    synthesisDecision: {
      state: "EVALUATION_PENDING",
      delayVsDenial: "PENDING",
      isFructificationExpected: false,
      expectedManifestationType: "PENDING",
      summaryVerdict: "Pending",
    },
    authorizedEvidenceNodeIds: ["NODE-1-TEST"],
    authorizedFacts: {},
  };

  const section = buildEvidenceFirstSection(sparseContract);
  assert.equal(section.findings[0].provenance.sourceBook, "Classical KP Reference");
  assert.equal(section.findings[0].provenance.pages, "Passage pending verification");
  assert.equal(section.findings[0].provenance.epistemologicalStatus, "Provisional");
});

// ── Test G: No Numeric Scoring Introduced ───────────────────────────────────
test("2K Sprint A Test G — Absolute absence of numerical prediction scores, percentages, and probabilities", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const report = buildEvidenceFirstReport(chart, kp);
  const serialized = serializeEvidenceFirstReport(report);

  // Assert absolute absence of prohibited scoring patterns
  assert.equal(/(\b\d+\s*%|\bprobability\b|\bscore:\s*\d+|\b\d+\/100\b)/i.test(serialized), false, "Must not introduce scores or percentages into view model");
});

// ── Test H: No Raw Astronomical Input Leakage ───────────────────────────────
test("2K Sprint A Test H — Raw astronomical coordinates do not leak ungrounded claims into presentation", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const report = buildEvidenceFirstReport(chart, kp);

  for (const section of report.sections) {
    const text = JSON.stringify(section);
    // Ensure no unrepresented divisional charts or un-evaluated doshas leak
    assert.equal(/navamsha\s+chart|d-9\s+chart|ashtakavarga\s+points|manglik\s+dosha/i.test(text), false);
  }
});

// ── Test I: No Predictive-Rule Recalculation ─────────────────────────────────
test("2K Sprint A Test I — View model strictly consumes pre-calculated contract without recalculation", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  // The synthesis state in the section must be identical to the contract
  assert.equal(section.synthesis.state, contract.synthesisDecision.state);
  assert.equal(section.synthesis.timingState, contract.dashaTimingState);
});

// ── Test J: Progressive Disclosure Consistency ──────────────────────────────
test("2K Sprint A Test J — Casual, Curious, and Technical levels all anchor to identical evidence", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-CAREER-JOB-01");
  const section = buildEvidenceFirstSection(contract);

  const { casual, curious, technical } = section.progressiveDisclosure;

  assert.equal(casual.title, contract.ruleName);
  assert.ok(curious.cuspEvidence.includes(contract.primaryCuspSubLord));
  assert.ok(curious.dashaEvidence.includes(contract.activeDashaLords.mahadasha));
  assert.equal(technical.contractVersion, contract.contractVersion);
  assert.deepEqual(technical.appliedRelations, contract.conflictFindings.map((f) => f.relationId));
  assert.ok(technical.auditHash.startsWith("AUDIT-KP-RULE-CAREER-JOB-01"));
});

// ── Test K: Serialization Round-Trip Lossless Integrity ─────────────────────
test("2K Sprint A Test K — Lossless JSON serialization and deserialization round-trip", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const report = buildEvidenceFirstReport(chart, kp);

  const serialized = serializeEvidenceFirstReport(report);
  const deserialized = deserializeEvidenceFirstReport(serialized);

  assert.equal(deserialized.reportId, report.reportId);
  assert.equal(deserialized.sections.length, report.sections.length);

  for (let i = 0; i < report.sections.length; i++) {
    assert.deepEqual(deserialized.sections[i].synthesis, report.sections[i].synthesis);
    assert.deepEqual(deserialized.sections[i].fivePartNarrative, report.sections[i].fivePartNarrative);
    assert.deepEqual(deserialized.sections[i].findings, report.sections[i].findings);
    assert.deepEqual(deserialized.sections[i].progressiveDisclosure, report.sections[i].progressiveDisclosure);
  }
});

// ── Test L: Upstream Immutability Guard ──────────────────────────────────────
test("2K Sprint A Test L — Generating report leaves upstream chart and KP engine structures bit-identical", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const chartBefore = JSON.stringify(chart);
  const kpBefore = JSON.stringify(kp);

  buildEvidenceFirstReport(chart, kp);

  assert.equal(JSON.stringify(chart), chartBefore);
  assert.equal(JSON.stringify(kp), kpBefore);
});

// ── Test M: Deterministic Adapter Output ────────────────────────────────────
test("2K Sprint A Test M — Repeated report view model generation is 100% deterministic", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");

  const s1 = buildEvidenceFirstSection(contract);
  const s2 = buildEvidenceFirstSection(contract);

  assert.deepEqual(s1, s2, "Repeated section transformation must be bit-identical");
});

// ── Special Test S1: Cross-Surface Semantic Equivalence (PDF & Dashboard) ───
test("2K Sprint A Special Test S1 — Same contract produces semantically identical evidence across PDF and Dashboard adapters", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const pdfOutput = renderSectionForPdfAdapter(section);
  const dashboardOutput = renderSectionForDashboardAdapter(section);

  assert.equal(pdfOutput.underlyingState, dashboardOutput.underlyingState);
  assert.deepEqual(pdfOutput.underlyingRelations, dashboardOutput.underlyingRelations);
  assert.deepEqual(pdfOutput.provenanceCitations, dashboardOutput.provenanceCitations);
  assert.equal(pdfOutput.underlyingState, "EVENT_DENIED_BY_NATAL_PROMISE");
});

// ── Special Test S2: Presentation Wording Decoupling Invariant ──────────────
test("2K Sprint A Special Test S2 — Changing presentation wording cannot mutate underlying synthesis state or provenance", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-PROPERTY-ACQUISITION-01");
  const section = buildEvidenceFirstSection(contract);

  const originalState = section.synthesis.state;
  const originalRelations = [...section.progressiveDisclosure.technical.appliedRelations];
  const originalProvenance = JSON.stringify(section.findings.map((f) => f.provenance));

  // Artificially modify presentation strings (simulating customized wording or translation)
  section.fivePartNarrative.whatWasFound = "Alternative compassionate translation of the property event.";
  section.fivePartNarrative.whyItMatters = "Modified conversational summary of Cusp 4 and Dasha dynamics.";

  // Underlying deterministic state and provenance must remain untouched
  assert.equal(section.synthesis.state, originalState);
  assert.deepEqual(section.progressiveDisclosure.technical.appliedRelations, originalRelations);
  assert.equal(JSON.stringify(section.findings.map((f) => f.provenance)), originalProvenance);
});
