/**
 * ============================================================================
 * ASTROLIFE — KP DASHA ACTIVATION DECISION ENGINE TESTS (PHASE 2I-E-B)
 * SOURCE-ALIGNMENT SUITE (Predictive Stellar Astrology — 3: KP System)
 * ============================================================================
 * Source-Alignment Invariants Verified:
 * A. Supporting MD + adverse AD -> MIXED_WINDOW (no unconditional veto).
 * B. Adverse MD + supporting AD -> MIXED_WINDOW.
 * C. Supporting MD + AD + PD + SD -> TIMING_ALIGNED.
 * D. Mixed supporting/detriment houses at one level remain MIXED_WINDOW.
 * E. A single 12th-house or detriment connection does NOT produce PROMISE_DENIED.
 * F. Existing cusp promise denial produces PROMISE_DENIED.
 * G. Property-style multi-level combination (2, 4, 11) is representable.
 * H. Five-level hierarchy remains intact (MD, AD, PD, SD, Prana).
 * I. Zero score, probability, percentage, or confidence ranking is introduced.
 * J. Deterministic repeatability and engine integration.
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { calculateChart } from "./calculations";
import { runKPEngine } from "./kp";
import {
  evaluateDashaActivation,
  evaluateAllDashaActivations,
  KPDashaTimingState,
} from "./kp-dasha-activation";
import {
  KP_EVENT_RULE_REGISTRY,
  KPEventRule,
} from "./kp-rule-registry";
import type { KPEventPromiseResult } from "./kp-evidence-types";
import { buildCurrentDashaHierarchyEvidence } from "./kp-dasha-evidence";

// Shared baseline supported promise for tests
function getMockSupportedPromise(rule: KPEventRule): KPEventPromiseResult {
  return {
    ruleId: rule.id,
    ruleName: rule.name,
    category: rule.category,
    primaryCusp: rule.primaryCusp,
    cuspLord: "Mars",
    primaryCuspStarLord: "Saturn",
    primaryCuspSubLord: "Venus",
    cuspSubLord: "Venus",
    signifiedHouses: rule.supportingHouses,
    supportingHousesMatched: rule.supportingHouses,
    facilitatingHousesMatched: [],
    detrimentHousesMatched: [],
    barrierHousesMatched: [],
    evidenceDetails: [],
    significationStrength: "GRADE_1",
    verdict: "SUPPORTED",
    status: "SUPPORTED",
    ruleStatus: "Verified",
    canonicalSource: rule.canonicalSource,
    summary: "Mock supported promise",
    evidenceChain: [],
  };
}

test("2I-E-B — Test F: Existing Cusp Promise Denial Produces PROMISE_DENIED", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  const deniedPromise: KPEventPromiseResult = {
    ruleId: marriageRule.id,
    ruleName: marriageRule.name,
    category: marriageRule.category,
    primaryCusp: 7,
    cuspLord: "Mars",
    primaryCuspStarLord: "Saturn",
    primaryCuspSubLord: "Mercury",
    cuspSubLord: "Mercury",
    signifiedHouses: [1, 6, 10],
    supportingHousesMatched: [],
    facilitatingHousesMatched: [],
    detrimentHousesMatched: [1, 6],
    barrierHousesMatched: [10],
    evidenceDetails: [],
    significationStrength: "GRADE_2",
    verdict: "OBSTRUCTED",
    status: "OBSTRUCTED",
    ruleStatus: "Verified",
    canonicalSource: marriageRule.canonicalSource,
    summary: "Mock denied promise",
    evidenceChain: [],
  };

  const result = evaluateDashaActivation(deniedPromise, dashaHierarchy, marriageRule);

  assert.equal(result.timingState, "PROMISE_DENIED");
  assert.equal(result.macroVerdict.isFavorableWindow, false);
  assert.ok(result.macroVerdict.primaryObstacle?.includes("sub-lord denies"));
  assert.ok(result.macroVerdict.summary.includes("Dasha cannot deliver what the natal chart denies"));
});

test("2I-E-B — Test C & H: Supporting MD + AD + PD + SD -> TIMING_ALIGNED with 5-Level Hierarchy", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const supportedPromise = getMockSupportedPromise(marriageRule);

  const alignedHierarchy = JSON.parse(JSON.stringify(dashaHierarchy));
  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.supportingHousesMatched = [7];
  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.detrimentHousesMatched = [];
  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.barrierHousesMatched = [];

  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.supportingHousesMatched = [2, 11];
  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.detrimentHousesMatched = [];
  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.barrierHousesMatched = [];

  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.pratyantardasha.supportingHousesMatched = [7];
  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.pratyantardasha.detrimentHousesMatched = [];
  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.pratyantardasha.barrierHousesMatched = [];

  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.sookshma.supportingHousesMatched = [11];
  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.sookshma.detrimentHousesMatched = [];
  alignedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.sookshma.barrierHousesMatched = [];

  const result = evaluateDashaActivation(supportedPromise, alignedHierarchy, marriageRule);

  assert.equal(result.timingState, "TIMING_ALIGNED");
  assert.equal(result.macroVerdict.isFavorableWindow, true);
  assert.equal(result.levels.mahadasha.role, "SUPPORTING");
  assert.equal(result.levels.antardasha.role, "SUPPORTING");
  assert.equal(result.levels.pratyantardasha.role, "SUPPORTING");
  assert.equal(result.levels.sookshma.role, "SUPPORTING");
  assert.ok(result.levels.prana !== undefined, "Five-level hierarchy must be preserved");
});

test("2I-E-B — Test A: Source-Alignment A (Supporting MD + Adverse AD -> MIXED_WINDOW)", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const supportedPromise = getMockSupportedPromise(marriageRule);

  // MD supports [7], but AD has adverse [1, 6] with zero supporting
  const testHierarchy = JSON.parse(JSON.stringify(dashaHierarchy));
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.supportingHousesMatched = [7];
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.detrimentHousesMatched = [];
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.barrierHousesMatched = [];

  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.supportingHousesMatched = [];
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.detrimentHousesMatched = [1, 6];
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.barrierHousesMatched = [10];

  const result = evaluateDashaActivation(supportedPromise, testHierarchy, marriageRule);

  // Under relaxed source-aligned KP rules, this must be MIXED_WINDOW, not an unconditional OBSTRUCTED_WINDOW veto
  assert.equal(result.timingState, "MIXED_WINDOW");
  assert.equal(result.macroVerdict.isFavorableWindow, false);
  assert.equal(result.levels.mahadasha.role, "SUPPORTING");
  assert.equal(result.levels.antardasha.role, "OBSTRUCTING");
});

test("2I-E-B — Test B: Source-Alignment B (Adverse MD + Supporting AD -> MIXED_WINDOW)", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const supportedPromise = getMockSupportedPromise(marriageRule);

  // MD has adverse [1, 6], but AD supports [7, 11]
  const testHierarchy = JSON.parse(JSON.stringify(dashaHierarchy));
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.supportingHousesMatched = [];
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.detrimentHousesMatched = [1, 6];
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.barrierHousesMatched = [];

  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.supportingHousesMatched = [7, 11];
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.detrimentHousesMatched = [];
  testHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.barrierHousesMatched = [];

  const result = evaluateDashaActivation(supportedPromise, testHierarchy, marriageRule);

  assert.equal(result.timingState, "MIXED_WINDOW");
  assert.equal(result.macroVerdict.isFavorableWindow, false);
  assert.equal(result.levels.mahadasha.role, "OBSTRUCTING");
  assert.equal(result.levels.antardasha.role, "SUPPORTING");
});

test("2I-E-B — Test D: Mixed Supporting/Detriment Houses at One Level Remain MIXED_WINDOW", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const supportedPromise = getMockSupportedPromise(marriageRule);

  // AD has both supporting [7] and detriment [6]
  const mixedHierarchy = JSON.parse(JSON.stringify(dashaHierarchy));
  mixedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.supportingHousesMatched = [7];
  mixedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.detrimentHousesMatched = [6];
  mixedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.barrierHousesMatched = [];

  const result = evaluateDashaActivation(supportedPromise, mixedHierarchy, marriageRule);

  assert.equal(result.timingState, "MIXED_WINDOW");
  assert.equal(result.macroVerdict.isFavorableWindow, false);
  assert.equal(result.levels.antardasha.role, "MIXED");
});

test("2I-E-B — Test E: Single 12th-House Connection Does NOT Produce PROMISE_DENIED or Pure OBSTRUCTED", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const propertyRule = KP_EVENT_RULE_REGISTRY["KP-RULE-PROPERTY-01"]; // primary cusp 4
  const supportedPromise = getMockSupportedPromise(propertyRule);

  // Planet signifies house 4 and 11, but also house 12
  const testHierarchy = JSON.parse(JSON.stringify(dashaHierarchy));
  testHierarchy.eventEvidenceByRule[propertyRule.id].levels.mahadasha.supportingHousesMatched = [4, 11];
  testHierarchy.eventEvidenceByRule[propertyRule.id].levels.mahadasha.detrimentHousesMatched = [12];

  const result = evaluateDashaActivation(supportedPromise, testHierarchy, propertyRule);

  // Must NOT produce PROMISE_DENIED (promise is supported) and must NOT produce OBSTRUCTED_WINDOW (it is MIXED)
  assert.notEqual(result.timingState, "PROMISE_DENIED");
  assert.notEqual(result.timingState, "OBSTRUCTED_WINDOW");
  assert.equal(result.timingState, "MIXED_WINDOW");
});

test("2I-E-B — Test G: Property-Style Multi-Level Combination (Moon MD + Venus AD + Mars PD + Saturn SD)", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const propertyRule = KP_EVENT_RULE_REGISTRY["KP-RULE-PROPERTY-01"];
  const supportedPromise = getMockSupportedPromise(propertyRule);

  // Classical KP example: Moon Dasa (4), Venus Bhukti (11), Mars Anthra (4), Saturn Sookshma (2, 4)
  const propHierarchy = JSON.parse(JSON.stringify(dashaHierarchy));
  propHierarchy.hierarchy.mahadasha.planet = "Moon";
  propHierarchy.hierarchy.antardasha.planet = "Venus";
  propHierarchy.hierarchy.pratyantardasha.planet = "Mars";
  propHierarchy.hierarchy.sookshma.planet = "Saturn";

  propHierarchy.eventEvidenceByRule[propertyRule.id].levels.mahadasha.supportingHousesMatched = [4];
  propHierarchy.eventEvidenceByRule[propertyRule.id].levels.mahadasha.detrimentHousesMatched = [];

  propHierarchy.eventEvidenceByRule[propertyRule.id].levels.antardasha.supportingHousesMatched = [11];
  propHierarchy.eventEvidenceByRule[propertyRule.id].levels.antardasha.detrimentHousesMatched = [];

  propHierarchy.eventEvidenceByRule[propertyRule.id].levels.pratyantardasha.supportingHousesMatched = [4];
  propHierarchy.eventEvidenceByRule[propertyRule.id].levels.pratyantardasha.detrimentHousesMatched = [];

  propHierarchy.eventEvidenceByRule[propertyRule.id].levels.sookshma.supportingHousesMatched = [2, 4];
  propHierarchy.eventEvidenceByRule[propertyRule.id].levels.sookshma.detrimentHousesMatched = [];

  const result = evaluateDashaActivation(supportedPromise, propHierarchy, propertyRule);

  assert.equal(result.timingState, "TIMING_ALIGNED");
  assert.equal(result.macroVerdict.isFavorableWindow, true);
  assert.equal(result.levels.mahadasha.role, "SUPPORTING");
  assert.equal(result.levels.antardasha.role, "SUPPORTING");
  assert.equal(result.levels.pratyantardasha.role, "SUPPORTING");
  assert.equal(result.levels.sookshma.role, "SUPPORTING");
});

test("2I-E-B — Test: Complete Hierarchical Obstruction Produces OBSTRUCTED_WINDOW", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const supportedPromise = getMockSupportedPromise(marriageRule);

  // All active lords signify solely detriment/barrier houses
  const obstructedHierarchy = JSON.parse(JSON.stringify(dashaHierarchy));
  obstructedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.supportingHousesMatched = [];
  obstructedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.detrimentHousesMatched = [1, 6];
  obstructedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.barrierHousesMatched = [10];

  obstructedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.supportingHousesMatched = [];
  obstructedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.detrimentHousesMatched = [1];
  obstructedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.barrierHousesMatched = [6];

  obstructedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.pratyantardasha.supportingHousesMatched = [];
  obstructedHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.pratyantardasha.detrimentHousesMatched = [1, 6];

  const result = evaluateDashaActivation(supportedPromise, obstructedHierarchy, marriageRule);

  assert.equal(result.timingState, "OBSTRUCTED_WINDOW");
  assert.equal(result.macroVerdict.isFavorableWindow, false);
  assert.equal(result.levels.mahadasha.role, "OBSTRUCTING");
  assert.equal(result.levels.antardasha.role, "OBSTRUCTING");
  assert.ok(result.macroVerdict.primaryObstacle?.includes("detrimental or barrier houses"));
});

test("2I-E-B — Test: Neutral Period Produces NEUTRAL_WINDOW", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const supportedPromise = getMockSupportedPromise(marriageRule);

  const neutralHierarchy = JSON.parse(JSON.stringify(dashaHierarchy));
  neutralHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.supportingHousesMatched = [];
  neutralHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.detrimentHousesMatched = [];
  neutralHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.mahadasha.barrierHousesMatched = [];

  neutralHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.supportingHousesMatched = [];
  neutralHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.detrimentHousesMatched = [];
  neutralHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.antardasha.barrierHousesMatched = [];

  neutralHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.pratyantardasha.supportingHousesMatched = [];
  neutralHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.pratyantardasha.detrimentHousesMatched = [];
  neutralHierarchy.eventEvidenceByRule["KP-RULE-MARRIAGE-01"].levels.pratyantardasha.barrierHousesMatched = [];

  const result = evaluateDashaActivation(supportedPromise, neutralHierarchy, marriageRule);

  assert.equal(result.timingState, "NEUTRAL_WINDOW");
  assert.equal(result.macroVerdict.isFavorableWindow, false);
});

test("2I-E-B — Test: Strict Reference_Pending Guard Produces EVALUATION_PENDING", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const pendingRule = KP_EVENT_RULE_REGISTRY["KP-RULE-SPECULATIVE-GAINS-01"];
  assert.equal(pendingRule.status, "Reference_Pending");

  const promise: KPEventPromiseResult = {
    ruleId: pendingRule.id,
    ruleName: pendingRule.name,
    category: pendingRule.category,
    primaryCusp: 5,
    cuspLord: "Sun",
    primaryCuspStarLord: "Ketu",
    primaryCuspSubLord: "Venus",
    cuspSubLord: "Venus",
    signifiedHouses: [2, 5, 11],
    supportingHousesMatched: [2, 5, 11],
    facilitatingHousesMatched: [],
    detrimentHousesMatched: [],
    barrierHousesMatched: [],
    evidenceDetails: [],
    significationStrength: "GRADE_1",
    verdict: "REFERENCE_PENDING",
    status: "REFERENCE_PENDING",
    ruleStatus: "Reference_Pending",
    canonicalSource: pendingRule.canonicalSource,
    summary: "Mock pending promise",
    evidenceChain: [],
  };

  const result = evaluateDashaActivation(promise, dashaHierarchy, pendingRule);

  assert.equal(result.timingState, "EVALUATION_PENDING");
  assert.equal(result.macroVerdict.isFavorableWindow, false);
  assert.ok(result.macroVerdict.summary.includes("pending classical literature verification"));
});

test("2I-E-B — Test I: Complete Absence of Scores, Percentages, Probabilities, and Rankings", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const promise = kpResult.eventPromises?.[marriageRule.id] || getMockSupportedPromise(marriageRule);

  const result = evaluateDashaActivation(promise, dashaHierarchy, marriageRule);

  const checkNoScores = (obj: any) => {
    assert.equal(obj.score, undefined);
    assert.equal(obj.probability, undefined);
    assert.equal(obj.confidence, undefined);
    assert.equal(obj.confidenceTier, undefined);
    assert.equal(obj.percentage, undefined);
    assert.equal(obj.weight, undefined);
    assert.equal(obj.ranking, undefined);
  };

  checkNoScores(result);
  checkNoScores(result.macroVerdict);
  checkNoScores(result.levels.mahadasha);
  checkNoScores(result.levels.antardasha);
  checkNoScores(result.levels.pratyantardasha);
  checkNoScores(result.levels.sookshma);
  checkNoScores(result.levels.prana);
});

test("2I-E-B — Test J: Deterministic Repeatability", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const promise = getMockSupportedPromise(marriageRule);

  const res1 = evaluateDashaActivation(promise, dashaHierarchy, marriageRule);
  const res2 = evaluateDashaActivation(promise, dashaHierarchy, marriageRule);

  assert.deepEqual(res1, res2, "Dasha activation evaluation must be 100% deterministic");
});

test("2I-E-B — Test: Integration with Full KP Engine Flow", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);

  assert.ok(kpResult.predictiveEvidence);
  assert.ok(kpResult.predictiveEvidence.dashaEvidence);
  assert.ok(kpResult.eventPromises);

  const activations = evaluateAllDashaActivations(
    kpResult.eventPromises,
    kpResult.predictiveEvidence.dashaEvidence
  );

  assert.ok(Object.keys(activations).length >= 8);
  for (const [ruleId, act] of Object.entries(activations)) {
    assert.equal(act.ruleId, ruleId);
    assert.ok(
      [
        "TIMING_ALIGNED",
        "OBSTRUCTED_WINDOW",
        "MIXED_WINDOW",
        "NEUTRAL_WINDOW",
        "PROMISE_DENIED",
        "EVALUATION_PENDING",
      ].includes(act.timingState)
    );
  }
});
