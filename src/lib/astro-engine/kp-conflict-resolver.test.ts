import test from "node:test";
import assert from "node:assert/strict";

import {
  resolvePredictiveConflict,
  resolveAllPredictiveConflicts,
  type KPPredictiveSynthesisResult,
  type KPConflictFinding,
} from "./kp-conflict-resolver";
import {
  KP_EVENT_RULE_REGISTRY,
  type KPEventRule,
} from "./kp-rule-registry";
import {
  calculateChart,
} from "./calculations";
import { runKPEngine } from "./kp";
import type { KPDashaActivationResult } from "./kp-dasha-activation";
import type { KPTransitConfirmationResult } from "./kp-transit-confirmation";
import type { KPRulingPlanetsConfirmationResult } from "./kp-ruling-planets";

// Standard canonical chart for test fixture: New Delhi, 1990-05-15, 14:30 IST
const TEST_DOB = "1990-05-15";
const TEST_TOB = "14:30";
const TEST_TZ = 5.5;
const TEST_LAT = 28.6139;
const TEST_LON = 77.2090;

function getMarriageRule(): KPEventRule {
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  assert.ok(rule, "KP-RULE-MARRIAGE-01 must exist");
  return rule;
}

function getPropertyRule(): KPEventRule {
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-PROPERTY-ACQUISITION-01"];
  assert.ok(rule, "KP-RULE-PROPERTY-ACQUISITION-01 must exist");
  return rule;
}

function getSpeculationRule(): KPEventRule {
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-SPECULATIVE-GAINS-01"];
  assert.ok(rule, "KP-RULE-SPECULATIVE-GAINS-01 must exist");
  return rule;
}

// ── Test A: Natal Denied + Dasha Supportive ──────────────────────────────────
test("2I-H Test A — Natal denied + Dasha supportive => EVENT_DENIED_BY_NATAL_PROMISE (REL-01)", () => {
  const rule = getMarriageRule();
  const mockDasha: KPDashaActivationResult = {
    ruleId: rule.id,
    ruleName: rule.name,
    ruleStatus: "Verified",
    canonicalSource: rule.canonicalSource,
    timingState: "TIMING_ALIGNED",
    natalPromiseVerdict: "PROMISE_DENIED",
    evaluationWindow: { asOfDate: "2026-06-15", mahadashaSpan: { lord: "Venus" }, antardashaSpan: { lord: "Jupiter" }, pratyantardashaSpan: { lord: "Mercury" } },
    levels: {
      mahadasha: { level: "MAHADASHA", planet: "Venus", role: "SUPPORTING", supportingHousesMatched: [2, 7, 11], detrimentHousesMatched: [], barrierHousesMatched: [], significationStrength: "GRADE_1", causalReason: "test" },
      antardasha: { level: "ANTARDASHA", planet: "Jupiter", role: "SUPPORTING", supportingHousesMatched: [2, 7, 11], detrimentHousesMatched: [], barrierHousesMatched: [], significationStrength: "GRADE_2", causalReason: "test" },
      pratyantardasha: { level: "PRATYANTARDASHA", planet: "Mercury", role: "SUPPORTING", supportingHousesMatched: [2, 7, 11], detrimentHousesMatched: [], barrierHousesMatched: [], significationStrength: "GRADE_3", causalReason: "test" },
      sookshma: { level: "SOOKSHMA", planet: "Sun", role: "SUPPORTING", supportingHousesMatched: [2], detrimentHousesMatched: [], barrierHousesMatched: [], significationStrength: "GRADE_4", causalReason: "test" },
      prana: { level: "PRANA", planet: "Moon", role: "SUPPORTING", supportingHousesMatched: [11], detrimentHousesMatched: [], barrierHousesMatched: [], significationStrength: "GRADE_4", causalReason: "test" },
    },
    macroVerdict: { isFavorableWindow: true, summary: "Dasha aligned" },
    causalAuditTrail: [],
  };

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_DENIED",
    dashaActivation: mockDasha,
  });

  assert.equal(res.state, "EVENT_DENIED_BY_NATAL_PROMISE");
  assert.equal(res.delayVsDenial, "DENIAL");
  assert.equal(res.isFructificationExpected, false);
  assert.equal(res.expectedManifestationType, "DENIAL");
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-01"));
});

// ── Test B: Natal Denied + Transit Supportive ────────────────────────────────
test("2I-H Test B — Natal denied + Transit supportive => EVENT_DENIED_BY_NATAL_PROMISE (REL-02)", () => {
  const rule = getMarriageRule();
  const mockTransit = {
    ruleId: rule.id,
    eventName: rule.name,
    canonicalSource: rule.canonicalSource,
    status: "Verified",
    natalPromiseStatus: "PROMISE_DENIED",
    dashaActivationState: "NEUTRAL_WINDOW",
    state: "TRANSIT_CONFIRMED",
  } as unknown as KPTransitConfirmationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_DENIED",
    transitConfirmation: mockTransit,
  });

  assert.equal(res.state, "EVENT_DENIED_BY_NATAL_PROMISE");
  assert.equal(res.isFructificationExpected, false);
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-02"));
});

// ── Test C: Natal Denied + RP Corroborated ───────────────────────────────────
test("2I-H Test C — Natal denied + RP corroborated => EVENT_DENIED_BY_NATAL_PROMISE (REL-03)", () => {
  const rule = getMarriageRule();
  const mockRP = {
    ruleId: rule.id,
    state: "RP_CORROBORATED",
  } as unknown as KPRulingPlanetsConfirmationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_DENIED",
    rulingPlanetsConfirmation: mockRP,
  });

  assert.equal(res.state, "EVENT_DENIED_BY_NATAL_PROMISE");
  assert.equal(res.isFructificationExpected, false);
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-03"));
});

// ── Test D: Natal Supported + Dasha Obstructed ───────────────────────────────
test("2I-H Test D — Natal supported + Dasha obstructed => TIMING_OBSTRUCTED (REL-04)", () => {
  const rule = getMarriageRule();
  const mockDasha = {
    ruleId: rule.id,
    timingState: "OBSTRUCTED_WINDOW",
    natalPromiseVerdict: "PROMISE_SUPPORTED",
  } as unknown as KPDashaActivationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: mockDasha,
  });

  assert.equal(res.state, "TIMING_OBSTRUCTED");
  assert.equal(res.delayVsDenial, "UNOBSTRUCTED"); // Not denied natally
  assert.equal(res.isFructificationExpected, false);
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-04"));
});

// ── Test E: Natal Supported + Transit Obstructed ─────────────────────────────
test("2I-H Test E — Natal supported + Transit obstructed => TIMING_ALIGNED_TRANSIT_OBSTRUCTED (REL-06)", () => {
  const rule = getMarriageRule();
  const mockDasha = {
    ruleId: rule.id,
    timingState: "TIMING_ALIGNED",
    natalPromiseVerdict: "PROMISE_SUPPORTED",
  } as unknown as KPDashaActivationResult;
  const mockTransit = {
    ruleId: rule.id,
    state: "TRANSIT_OBSTRUCTED",
  } as unknown as KPTransitConfirmationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: mockDasha,
    transitConfirmation: mockTransit,
  });

  assert.equal(res.state, "TIMING_ALIGNED_TRANSIT_OBSTRUCTED");
  assert.equal(res.delayVsDenial, "DELAY");
  assert.equal(res.isFructificationExpected, false); // Blocked until transit clears
  assert.equal(res.expectedManifestationType, "POSTPONEMENT");
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-06"));
});

// ── Test F: Natal Supported + RP Discordant ──────────────────────────────────
test("2I-H Test F — Natal supported + RP discordant => TIMING_ALIGNED_RP_UNCORROBORATED (REL-07)", () => {
  const rule = getMarriageRule();
  const mockDasha = {
    ruleId: rule.id,
    timingState: "TIMING_ALIGNED",
    natalPromiseVerdict: "PROMISE_SUPPORTED",
  } as unknown as KPDashaActivationResult;
  const mockTransit = {
    ruleId: rule.id,
    state: "TRANSIT_CONFIRMED",
  } as unknown as KPTransitConfirmationResult;
  const mockRP = {
    ruleId: rule.id,
    state: "RP_DISCORDANT",
  } as unknown as KPRulingPlanetsConfirmationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: mockDasha,
    transitConfirmation: mockTransit,
    rulingPlanetsConfirmation: mockRP,
  });

  // RP_DISCORDANT must NEVER become denial!
  assert.equal(res.state, "TIMING_ALIGNED_RP_UNCORROBORATED");
  assert.notEqual(res.delayVsDenial, "DENIAL");
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-07"));
});

// ── Test G: Dasha Mixed + Transit Supportive ─────────────────────────────────
test("2I-H Test G — Dasha mixed + Transit supportive => TIMING_MIXED_WINDOW (REL-08)", () => {
  const rule = getMarriageRule();
  const mockDasha = {
    ruleId: rule.id,
    timingState: "MIXED_WINDOW",
    natalPromiseVerdict: "PROMISE_SUPPORTED",
  } as unknown as KPDashaActivationResult;
  const mockTransit = {
    ruleId: rule.id,
    state: "TRANSIT_CONFIRMED",
  } as unknown as KPTransitConfirmationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: mockDasha,
    transitConfirmation: mockTransit,
  });

  assert.equal(res.state, "TIMING_MIXED_WINDOW");
  assert.equal(res.isFructificationExpected, true);
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-08"));
});

// ── Test H: Dasha Supportive + Transit Mixed ─────────────────────────────────
test("2I-H Test H — Dasha supportive + Transit mixed => TIMING_MIXED_WINDOW or tension preserved", () => {
  const rule = getMarriageRule();
  const mockDasha = {
    ruleId: rule.id,
    timingState: "MIXED_WINDOW",
    natalPromiseVerdict: "PROMISE_SUPPORTED",
  } as unknown as KPDashaActivationResult;
  const mockTransit = {
    ruleId: rule.id,
    state: "TRANSIT_MIXED",
  } as unknown as KPTransitConfirmationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: mockDasha,
    transitConfirmation: mockTransit,
  });

  assert.ok(["TIMING_MIXED_WINDOW", "MULTIPLE_MANIFESTATION"].includes(res.state));
});

// ── Test I: Transit Supportive + RP Discordant ───────────────────────────────
test("2I-H Test I — Transit supportive + RP discordant => TIMING_ALIGNED_RP_UNCORROBORATED", () => {
  const rule = getMarriageRule();
  const mockDasha = {
    ruleId: rule.id,
    timingState: "TIMING_ALIGNED",
    natalPromiseVerdict: "PROMISE_SUPPORTED",
  } as unknown as KPDashaActivationResult;
  const mockTransit = {
    ruleId: rule.id,
    state: "TRANSIT_CONFIRMED",
  } as unknown as KPTransitConfirmationResult;
  const mockRP = {
    ruleId: rule.id,
    state: "RP_DISCORDANT",
  } as unknown as KPRulingPlanetsConfirmationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: mockDasha,
    transitConfirmation: mockTransit,
    rulingPlanetsConfirmation: mockRP,
  });

  assert.equal(res.state, "TIMING_ALIGNED_RP_UNCORROBORATED");
  assert.equal(res.isFructificationExpected, true); // Period and transit support, RP uncorroborated
});

// ── Test J: Saturn / Delay Candidate (Source-Supported) ──────────────────────
test("2I-H Test J — Saturn delay candidate in Marriage (Reader IV p. 44) => DELAY_INDICATED (REL-09)", () => {
  const rule = getMarriageRule();
  // Saturn as running period lord in marriage
  const mockDasha = {
    ruleId: rule.id,
    timingState: "TIMING_ALIGNED",
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    levels: {
      mahadasha: { level: "MAHADASHA", planet: "Saturn", role: "SUPPORTING", supportingHousesMatched: [2, 7, 11] },
      antardasha: { level: "ANTARDASHA", planet: "Saturn", role: "SUPPORTING", supportingHousesMatched: [2, 7, 11] },
    },
  } as unknown as KPDashaActivationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: mockDasha,
  });

  assert.equal(res.state, "DELAY_INDICATED");
  assert.equal(res.delayVsDenial, "DELAY");
  assert.equal(res.expectedManifestationType, "POSTPONEMENT");
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-09"));
});

// ── Test K: Mixed 11th + 12th Significations ─────────────────────────────────
test("2I-H Test K — Mixed 11th + 12th significations => itemized dual manifestation without score averaging", () => {
  const rule = getPropertyRule();
  const mockDasha = {
    ruleId: rule.id,
    timingState: "MIXED_WINDOW",
    natalPromiseVerdict: "PROMISE_SUPPORTED",
  } as unknown as KPDashaActivationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: mockDasha,
  });

  assert.equal(res.state, "MULTIPLE_MANIFESTATION");
  assert.equal(res.expectedManifestationType, "MIXED_GAIN_AND_EXPENSE");
});

// ── Test L: Simultaneous Gain + Expenditure (Property Acquisition) ───────────
test("2I-H Test L — Property purchase with 12th house (outflow) recognized as MULTIPLE_MANIFESTATION", () => {
  const rule = getPropertyRule();
  const mockDasha = {
    ruleId: rule.id,
    timingState: "MIXED_WINDOW",
    natalPromiseVerdict: "PROMISE_SUPPORTED",
  } as unknown as KPDashaActivationResult;

  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: mockDasha,
  });

  assert.equal(res.state, "MULTIPLE_MANIFESTATION");
  assert.equal(res.expectedManifestationType, "MIXED_GAIN_AND_EXPENSE");
});

// ── Test M: Genuine Contradiction vs Missing Evidence ────────────────────────
test("2I-H Test M — Genuine contradiction vs missing corroboration distinguished", () => {
  const rule = getMarriageRule();

  // Contradiction: Supported natal promise vs Obstructed Dasha
  const contradictionRes = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: { timingState: "OBSTRUCTED_WINDOW" } as unknown as KPDashaActivationResult,
  });
  assert.equal(contradictionRes.state, "TIMING_OBSTRUCTED");
  assert.ok(contradictionRes.conflictFindings.some((f) => f.conflictType === "DASHA_TRANSIT_TENSION"));

  // Missing evidence / Neutral context
  const neutralRes = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: { timingState: "NEUTRAL_WINDOW" } as unknown as KPDashaActivationResult,
  });
  assert.equal(neutralRes.state, "TIMING_NEUTRAL");
});

// ── Test N: All Four Layers Aligned ──────────────────────────────────────────
test("2I-H Test N — All four layers aligned => TIMING_ALIGNED_RP_CORROBORATED (Convergence)", () => {
  const rule = getMarriageRule();
  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: { timingState: "TIMING_ALIGNED" } as unknown as KPDashaActivationResult,
    transitConfirmation: { state: "TRANSIT_CONFIRMED" } as unknown as KPTransitConfirmationResult,
    rulingPlanetsConfirmation: { state: "RP_CORROBORATED" } as unknown as KPRulingPlanetsConfirmationResult,
  });

  assert.equal(res.state, "TIMING_ALIGNED_RP_CORROBORATED");
  assert.equal(res.delayVsDenial, "UNOBSTRUCTED");
  assert.equal(res.isFructificationExpected, true);
  assert.equal(res.expectedManifestationType, "FRUCTIFICATION");
});

// ── Test O: All Four Layers Disagree ─────────────────────────────────────────
test("2I-H Test O — All four layers disagree => Resolved strictly via rule-specific relations without exception", () => {
  const rule = getMarriageRule();
  // Natal Denied, Dasha Aligned, Transit Obstructed, RP Corroborated
  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_DENIED",
    dashaActivation: { timingState: "TIMING_ALIGNED" } as unknown as KPDashaActivationResult,
    transitConfirmation: { state: "TRANSIT_OBSTRUCTED" } as unknown as KPTransitConfirmationResult,
    rulingPlanetsConfirmation: { state: "RP_CORROBORATED" } as unknown as KPRulingPlanetsConfirmationResult,
  });

  // Natal denial MUST govern all downstream disagreements
  assert.equal(res.state, "EVENT_DENIED_BY_NATAL_PROMISE");
  assert.equal(res.delayVsDenial, "DENIAL");
  assert.equal(res.isFructificationExpected, false);
});

// ── Test P: Insufficient / Reference-Pending Evidence ────────────────────────
test("2I-H Test P — Reference_Pending rule (Speculative Gains) strictly produces EVALUATION_PENDING (REL-10)", () => {
  const rule = getSpeculationRule();
  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: { timingState: "TIMING_ALIGNED" } as unknown as KPDashaActivationResult,
  });

  assert.equal(res.state, "EVALUATION_PENDING");
  assert.equal(res.delayVsDenial, "PENDING");
  assert.equal(res.isFructificationExpected, false);
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-10"));
});

// ── Test Q: Deterministic Repeated Execution ─────────────────────────────────
test("2I-H Test Q — Deterministic repeated execution yields bit-identical synthesis results", () => {
  const rule = getMarriageRule();
  const params = {
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: { timingState: "TIMING_ALIGNED" } as unknown as KPDashaActivationResult,
    transitConfirmation: { state: "TRANSIT_CONFIRMED" } as unknown as KPTransitConfirmationResult,
    rulingPlanetsConfirmation: { state: "RP_CORROBORATED" } as unknown as KPRulingPlanetsConfirmationResult,
  };

  const run1 = resolvePredictiveConflict(params);
  const run2 = resolvePredictiveConflict(params);

  assert.deepEqual(run1, run2, "Repeated execution on identical inputs must be strictly deepEqual");
});

// ── Test R: Upstream Layers Remain Immutable ─────────────────────────────────
test("2I-H Test R — Upstream layers remain strictly immutable and unmutated", () => {
  const chart = calculateChart("Test Subject", TEST_DOB, TEST_TOB, "New Delhi", TEST_LAT, TEST_LON, TEST_TZ);
  const kp = runKPEngine(chart);

  const cuspPromisesBefore = JSON.stringify(kp.predictiveEvidence?.cuspPromises);
  const dashaActivationsBefore = JSON.stringify(kp.dashaActivations);
  const transitConfirmationsBefore = JSON.stringify(kp.transitConfirmations);
  const rulingPlanetsBefore = JSON.stringify(kp.rulingPlanetsSnapshot);

  // Run the conflict resolver across all rules
  const synthesis = resolveAllPredictiveConflicts({
    eventPromises: kp.eventPromises,
    dashaActivations: kp.dashaActivations,
    transitConfirmations: kp.transitConfirmations,
    rulingPlanetsConfirmations: kp.rulingPlanetsConfirmations,
    rpSnapshot: kp.rulingPlanetsSnapshot,
  });

  assert.ok(Object.keys(synthesis).length >= 21);

  // Assert upstream objects were not mutated in any property
  assert.equal(JSON.stringify(kp.predictiveEvidence?.cuspPromises), cuspPromisesBefore);
  assert.equal(JSON.stringify(kp.dashaActivations), dashaActivationsBefore);
  assert.equal(JSON.stringify(kp.transitConfirmations), transitConfirmationsBefore);
  assert.equal(JSON.stringify(kp.rulingPlanetsSnapshot), rulingPlanetsBefore);
});

// ── Test S: Absolute Absence of Scores, Weights, Probabilities, & Rankings ───
test("2I-H Test S — Absolute absence of numeric scores, percentages, weights, and confidence tiers", () => {
  const rule = getMarriageRule();
  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: { timingState: "TIMING_ALIGNED" } as unknown as KPDashaActivationResult,
    transitConfirmation: { state: "TRANSIT_CONFIRMED" } as unknown as KPTransitConfirmationResult,
    rulingPlanetsConfirmation: { state: "RP_CORROBORATED" } as unknown as KPRulingPlanetsConfirmationResult,
  });

  const json = JSON.stringify(res);
  assert.doesNotMatch(json, /"score"/i, "No score field allowed");
  assert.doesNotMatch(json, /"weight"/i, "No weight field allowed");
  assert.doesNotMatch(json, /"probability"/i, "No probability field allowed");
  assert.doesNotMatch(json, /"percentage"/i, "No percentage field allowed");
  assert.doesNotMatch(json, /"tier"/i, "No tier field allowed");
});

// ── Test T: Provenance Survives Synthesis ────────────────────────────────────
test("2I-H Test T — Provenance completeness and exact classical Reader citations survive synthesis", () => {
  const rule = getMarriageRule();
  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_DENIED",
    dashaActivation: { timingState: "TIMING_ALIGNED" } as unknown as KPDashaActivationResult,
  });

  assert.ok(res.provenance.readerReferences.length > 0);
  assert.equal(res.provenance.epistemologicalStatus, "Verified");
  assert.ok(res.conflictFindings.length > 0);
  res.conflictFindings.forEach((f) => {
    assert.ok(f.provenance.sourceBook);
    assert.ok(f.provenance.pages);
    assert.ok(f.provenance.quoteOrLocatedPrinciple);
  });
});

// ── Test U: Resolver Idempotence ─────────────────────────────────────────────
test("2I-H Test U — Resolver Idempotence: Multiple invocations on same inputs yield bit-identical output", () => {
  const rule = getMarriageRule();
  const input = {
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    dashaActivation: {
      timingState: "OBSTRUCTED_WINDOW",
      natalPromiseVerdict: "PROMISE_SUPPORTED",
    } as unknown as KPDashaActivationResult,
    transitConfirmation: {
      state: "TRANSIT_CONFIRMED",
    } as unknown as KPTransitConfirmationResult,
  };

  const output1 = resolvePredictiveConflict(input);
  const output2 = resolvePredictiveConflict(input);
  const output3 = resolvePredictiveConflict(input);

  assert.deepEqual(output1, output2);
  assert.deepEqual(output2, output3);
});

// ── Test V: Finding Provenance Integrity ─────────────────────────────────────
test("2I-H Test V — Finding Provenance Integrity: Every finding contains non-empty source citations and principles", () => {
  const rule = getMarriageRule();
  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_DENIED",
    dashaActivation: { timingState: "TIMING_ALIGNED" } as unknown as KPDashaActivationResult,
    transitConfirmation: { state: "TRANSIT_CONFIRMED" } as unknown as KPTransitConfirmationResult,
    rulingPlanetsConfirmation: { state: "RP_CORROBORATED" } as unknown as KPRulingPlanetsConfirmationResult,
  });

  assert.ok(res.conflictFindings.length >= 3, "Must record REL-01, REL-02, and REL-03 findings");
  for (const finding of res.conflictFindings) {
    assert.ok(finding.findingId.length > 0, "Finding ID must be non-empty");
    assert.ok(finding.precedenceRule.length > 0, "Precedence rule must be non-empty");
    assert.ok(finding.rationale.length > 0, "Rationale must be non-empty");
    assert.ok(finding.provenance.sourceBook.length > 0, "sourceBook must be non-empty");
    assert.ok(finding.provenance.pages.length > 0, "pages must be non-empty");
    assert.ok(finding.provenance.quoteOrLocatedPrinciple.length > 0, "quoteOrLocatedPrinciple must be non-empty");
    assert.ok(["Verified", "Provisional", "Reference_Pending"].includes(finding.provenance.epistemologicalStatus));
  }
});

// ── Test W: Unsupported Precedence => REFERENCE_PENDING ─────────────────────
test("2I-H Test W — Unsupported Precedence strictly triggers REL-10 and outputs EVALUATION_PENDING", () => {
  const rule = getMarriageRule();
  // Force an unsupported conflict configuration
  const res = resolvePredictiveConflict({
    rule,
    natalPromiseVerdict: "PROMISE_SUPPORTED",
    forceUnsupportedConflict: true,
  });

  assert.equal(res.state, "EVALUATION_PENDING");
  assert.equal(res.delayVsDenial, "PENDING");
  assert.equal(res.isFructificationExpected, false);
  assert.equal(res.expectedManifestationType, "PENDING");
  assert.ok(res.conflictFindings.some((f) => f.relationId === "REL-10"));
  const rel10Finding = res.conflictFindings.find((f) => f.relationId === "REL-10");
  assert.equal(rel10Finding?.provenance.epistemologicalStatus, "Reference_Pending");
});

