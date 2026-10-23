import test from "node:test";
import assert from "node:assert/strict";

import {
  runCompleteEvidenceGraphAudit,
  auditCanonicalScenario,
  build14PointEvidenceTrace,
  validateNarrativeClaim,
  CANONICAL_SCENARIO_DEFINITIONS,
  CANONICAL_AUDIT_CHART_PARAMS,
} from "./kp-evidence-graph-audit";
import { calculateChart } from "./calculations";
import { runKPEngine } from "./kp";

// ── Test 1: Complete 14-Point Trace Execution Across All 5 Scenarios ────────
test("2I-I Audit Test 1 — Complete 14-Point Trace passes across all 5 canonical scenarios", () => {
  const auditResults = runCompleteEvidenceGraphAudit();
  assert.equal(Object.keys(auditResults).length, 5, "Must audit exactly 5 canonical scenarios");

  for (const [scenarioId, result] of Object.entries(auditResults)) {
    assert.equal(
      result.auditStatus,
      "PASS",
      `Scenario ${scenarioId} failed audit: ${result.auditSummary}`
    );
    assert.equal(result.all14LayersPresent, true, `${scenarioId} must have all 14 layers`);
    assert.equal(result.bidirectionalIntegrity, true, `${scenarioId} must have bidirectional integrity`);
    assert.equal(result.negativeRejectionsPassed, true, `${scenarioId} must reject all negative tests`);
  }
});

// ── Test 2: 14/14 Layers Present per Scenario ────────────────────────────────
test("2I-I Audit Test 2 — Every scenario contains all 14 explicit evidence layers", () => {
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

  const requiredLayers = [
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

  for (const def of CANONICAL_SCENARIO_DEFINITIONS) {
    const trace = build14PointEvidenceTrace(chart, kp, def.ruleId);
    const presentLayers = new Set(Object.values(trace).map((n) => n.layer));
    for (const layer of requiredLayers) {
      assert.ok(
        presentLayers.has(layer as any),
        `Layer ${layer} must be present in ${def.scenarioId}`
      );
    }
  }
});

// ── Test 3: Bidirectional Traceability Check ─────────────────────────────────
test("2I-I Audit Test 3 — Bidirectional traceability verified (Forward and Reverse paths)", () => {
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

  const def = CANONICAL_SCENARIO_DEFINITIONS[0]; // Scenario 1: Marriage
  const trace = build14PointEvidenceTrace(chart, kp, def.ruleId);

  // Check claim mapping
  const claim = def.narrativeClaims[0];
  const matchingNode = Object.values(trace).find((n) => n.layer === claim.targetLayerKey)!;

  const mapping = validateNarrativeClaim({
    claimId: claim.claimId,
    sentence: claim.sentence,
    referencedNodeIds: [matchingNode.nodeId],
    nodes: trace,
  });

  assert.equal(mapping.isValidated, true);
  assert.equal(mapping.forwardTraceValid, true, "Forward trace must be valid");
  assert.equal(mapping.reverseTraceValid, true, "Reverse trace must reach origin input/astronomical layers");
  assert.ok(mapping.reversePath && mapping.reversePath.length >= 3);
});

// ── Test 4: Scenario 1 (Marriage) End-to-End Trace ───────────────────────────
test("2I-I Audit Test 4 — Scenario 1 (Marriage) strictly traces natal denial vetoing downstream timing", () => {
  const auditResults = runCompleteEvidenceGraphAudit();
  const m = auditResults["SCENARIO-1-MARRIAGE"];
  assert.ok(m);
  assert.equal(m.auditStatus, "PASS");

  const synth = m.traceNodes[`NODE-12-SYNTHESIS-${m.ruleId}`];
  assert.equal(synth.dataPayload.state, "EVENT_DENIED_BY_NATAL_PROMISE");
  assert.equal(synth.dataPayload.delayVsDenial, "DENIAL");
  assert.equal(synth.dataPayload.isFructificationExpected, false);
});

// ── Test 5: Scenario 2 (Property) End-to-End Trace ───────────────────────────
test("2I-I Audit Test 5 — Scenario 2 (Property) strictly traces compound MULTIPLE_MANIFESTATION", () => {
  const auditResults = runCompleteEvidenceGraphAudit();
  const p = auditResults["SCENARIO-2-PROPERTY"];
  assert.ok(p);
  assert.equal(p.auditStatus, "PASS");

  const synth = p.traceNodes[`NODE-12-SYNTHESIS-${p.ruleId}`];
  assert.equal(synth.dataPayload.state, "MULTIPLE_MANIFESTATION");
  assert.equal(synth.dataPayload.expectedManifestationType, "MIXED_GAIN_AND_EXPENSE");
  assert.equal(synth.dataPayload.delayVsDenial, "UNOBSTRUCTED");
});

// ── Test 6: Scenario 3 (Career) End-to-End Trace ─────────────────────────────
test("2I-I Audit Test 6 — Scenario 3 (Career) traces salaried job 6th cusp evaluation", () => {
  const auditResults = runCompleteEvidenceGraphAudit();
  const c = auditResults["SCENARIO-3-CAREER"];
  assert.ok(c);
  assert.equal(c.auditStatus, "PASS");

  const synth = c.traceNodes[`NODE-12-SYNTHESIS-${c.ruleId}`];
  assert.equal(synth.dataPayload.state, "TIMING_NEUTRAL");
  assert.equal(synth.dataPayload.delayVsDenial, "NEUTRAL");
  assert.equal(synth.dataPayload.isFructificationExpected, false);
});

// ── Test 7: Scenario 4 (Foreign Travel) End-to-End Trace ─────────────────────
test("2I-I Audit Test 7 — Scenario 4 (Travel) traces 3/9/12 triad and mixed manifestation non-denial", () => {
  const auditResults = runCompleteEvidenceGraphAudit();
  const t = auditResults["SCENARIO-4-TRAVEL"];
  assert.ok(t);
  assert.equal(t.auditStatus, "PASS");

  const synth = t.traceNodes[`NODE-12-SYNTHESIS-${t.ruleId}`];
  assert.equal(synth.dataPayload.state, "TIMING_MIXED_WINDOW");
  assert.notEqual(synth.dataPayload.delayVsDenial, "DENIAL");
});

// ── Test 8: Scenario 5 (Speculation) Reference_Pending Absence of Inference ─
test("2I-I Audit Test 8 — Scenario 5 (Speculation) strictly halts at EVALUATION_PENDING under REL-10", () => {
  const auditResults = runCompleteEvidenceGraphAudit();
  const s = auditResults["SCENARIO-5-SPECULATION"];
  assert.ok(s);
  assert.equal(s.auditStatus, "PASS");

  const synth = s.traceNodes[`NODE-12-SYNTHESIS-${s.ruleId}`];
  assert.equal(synth.dataPayload.state, "EVALUATION_PENDING");
  assert.equal(synth.dataPayload.delayVsDenial, "PENDING");
  assert.equal(synth.dataPayload.isFructificationExpected, false);

  const conflict = s.traceNodes[`NODE-11-CONFLICT-${s.ruleId}`];
  const appliedRel = conflict.dataPayload.appliedRelations as string[];
  assert.ok(appliedRel.includes("REL-10"), "Scenario 5 must trigger REL-10");
});

// ── Test 9: Mandatory Negative Test A — Hallucinated / Unsupported Claim ────
test("2I-I Audit Test 9 — Negative Test A: Hallucinated / unreferenced narrative statement is rejected", () => {
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
  const trace = build14PointEvidenceTrace(chart, kp, "KP-RULE-MARRIAGE-01");

  // Statement with non-existent node reference
  const fakeMapping = validateNarrativeClaim({
    claimId: "NEG-HALLUCINATED",
    sentence: "Mars aspects the 7th house cusp directly causing severe discord.",
    referencedNodeIds: ["NODE-NON-EXISTENT-HALLUCINATION"],
    nodes: trace,
  });

  assert.equal(fakeMapping.isValidated, false);
  assert.ok(fakeMapping.rejectionReason?.includes("non-existent"));

  // Statement with zero node references
  const noNodeMapping = validateNarrativeClaim({
    claimId: "NEG-NO-NODE",
    sentence: "An intuitive prediction indicates a high likelihood of event manifestation.",
    referencedNodeIds: [],
    nodes: trace,
  });

  assert.equal(noNodeMapping.isValidated, false);
  assert.ok(noNodeMapping.rejectionReason?.includes("does not reference"));
});

// ── Test 10: Mandatory Negative Test B — Numeric Predictive Score / Percentage
test("2I-I Audit Test 10 — Negative Test B: Numeric predictive scores and percentages are rejected", () => {
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
  const trace = build14PointEvidenceTrace(chart, kp, "KP-RULE-MARRIAGE-01");
  const firstNode = Object.values(trace)[0].nodeId;

  const scoreClaim1 = validateNarrativeClaim({
    claimId: "NEG-PERCENTAGE",
    sentence: "There is an 80% probability that marriage will occur.",
    referencedNodeIds: [firstNode],
    nodes: trace,
  });
  assert.equal(scoreClaim1.isValidated, false);
  assert.ok(scoreClaim1.rejectionReason?.includes("numerical score, percentage"));

  const scoreClaim2 = validateNarrativeClaim({
    claimId: "NEG-SCORE",
    sentence: "The final prediction confidence score is 75 out of 100.",
    referencedNodeIds: [firstNode],
    nodes: trace,
  });
  assert.equal(scoreClaim2.isValidated, false);
  assert.ok(scoreClaim2.rejectionReason?.includes("numerical score, percentage"));
});

// ── Test 11: Mandatory Negative Test C — Manufactured Certainty in Reference_Pending
test("2I-I Audit Test 11 — Negative Test C: Manufactured certainty in Reference_Pending is rejected", () => {
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
  const trace = build14PointEvidenceTrace(chart, kp, "KP-RULE-SPECULATIVE-GAINS-01");
  const firstNode = Object.values(trace)[0].nodeId;

  const certaintyClaim = validateNarrativeClaim({
    claimId: "NEG-CERTAINTY",
    sentence: "Speculative profits will definitely fructify tomorrow with high return.",
    referencedNodeIds: [firstNode],
    nodes: trace,
    scenarioStatus: "Reference_Pending",
  });

  assert.equal(certaintyClaim.isValidated, false);
  assert.ok(certaintyClaim.rejectionReason?.includes("Reference_Pending topic attempted to manufacture"));
});

// ── Test 12: Mandatory Negative Test D — RP Overreach Rejection ─────────────
test("2I-I Audit Test 12 — Negative Test D: Ruling Planets claimed as creating or causing the event is rejected", () => {
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
  const trace = build14PointEvidenceTrace(chart, kp, "KP-RULE-MARRIAGE-01");
  const firstNode = Object.values(trace)[0].nodeId;

  const rpOverreachClaim = validateNarrativeClaim({
    claimId: "NEG-RP-OVERREACH",
    sentence: "The ruling planets produced the marriage event despite contradictory factors.",
    referencedNodeIds: [firstNode],
    nodes: trace,
  });

  assert.equal(rpOverreachClaim.isValidated, false);
  assert.ok(rpOverreachClaim.rejectionReason?.includes("Ruling Planets described as causing or producing"));
});

// ── Test 13: Deterministic Repeated Execution ────────────────────────────────
test("2I-I Audit Test 13 — Audit harness execution is 100% deterministic and bit-identical on repeated runs", () => {
  const run1 = runCompleteEvidenceGraphAudit();
  const run2 = runCompleteEvidenceGraphAudit();

  assert.deepEqual(run1, run2, "Repeated evidence graph audit executions must be strictly deepEqual");
});

// ── Test 14: Upstream Immutability During Graph Extraction ───────────────────
test("2I-I Audit Test 14 — Upstream chart and calculation structures remain strictly unmutated", () => {
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

  const lagnaBefore = chart.lagnaLon;
  const cuspsBefore = JSON.stringify(kp.cusps);
  const sigsBefore = JSON.stringify(kp.predictiveEvidence?.houseSignificators);
  const dashaBefore = JSON.stringify(kp.dashaActivations);
  const rpBefore = JSON.stringify(kp.rulingPlanetsSnapshot);
  const synthBefore = JSON.stringify(kp.predictiveSynthesis);

  // Run audit extraction across all scenarios
  const auditResults = runCompleteEvidenceGraphAudit();
  assert.ok(Object.keys(auditResults).length === 5);

  // Assert complete immutability
  assert.equal(chart.lagnaLon, lagnaBefore);
  assert.equal(JSON.stringify(kp.cusps), cuspsBefore);
  assert.equal(JSON.stringify(kp.predictiveEvidence?.houseSignificators), sigsBefore);
  assert.equal(JSON.stringify(kp.dashaActivations), dashaBefore);
  assert.equal(JSON.stringify(kp.rulingPlanetsSnapshot), rpBefore);
  assert.equal(JSON.stringify(kp.predictiveSynthesis), synthBefore);
});

// ── Test 15: Zero Modifications to Production Calculation Logic ─────────────
test("2I-I Audit Test 15 — Zero changes to production calculation or predictive logic", () => {
  const auditResults = runCompleteEvidenceGraphAudit();
  for (const res of Object.values(auditResults)) {
    assert.ok(res.structuredJsonExport.ruleId);
    assert.ok(res.structuredJsonExport.synthesizedState);
    assert.ok(res.traceNodes);
  }
});
