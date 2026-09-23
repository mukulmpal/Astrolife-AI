/**
 * ============================================================================
 * ASTROLIFE — KP PRODUCTION EVIDENCE CONTRACT TESTS (PHASE 2I-J)
 * ============================================================================
 * Verifies that the production consumer boundary strictly constrains AI
 * and report generation layers to the deterministic evidence contract:
 *
 * 1. Schema serialization completeness & typed boundary integrity
 * 2. Complete provenance preservation (source books, pages, relation IDs)
 * 3. Upstream chart immutability
 * 4. Adversarial Fixture 1: Upstream Divergence (Transit Confirmed vs Dasha Obstructed)
 * 5. Adversarial Fixture 2: Reference_Pending Certainty Guard (Speculative Gains)
 * 6. Raw-Input Leakage Test: Unrepresented chart facts rejected
 * 7. Claim-Specific Grounding: Ungrounded arbitrary timing claims rejected
 * 8. Prohibited Scoring Rejection (Percentages, scores, probability tiers)
 * 9. Ruling Planets Non-Creation Guard
 * 10. Conflict State Preservation (MULTIPLE_MANIFESTATION un-flattened)
 * 11. Deterministic Bit-Identical Repeat Execution
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import { calculateChart } from "./calculations";
import { runKPEngine } from "./kp";
import {
  buildKPPredictiveEvidenceContract,
  createExplainabilityPrompt,
  validateConsumerNarrative,
  type KPPredictiveEvidenceContract,
} from "./kp-production-contract";
import { CANONICAL_AUDIT_CHART_PARAMS } from "./kp-evidence-graph-audit";

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

// ── Test 1: Production Contract Serialization Completeness ───────────────────
test("2I-J Test 1 — Production contract contains complete typed evidence without data loss", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");

  assert.equal(contract.contractVersion, "1.0.0");
  assert.equal(contract.ruleId, "KP-RULE-MARRIAGE-01");
  assert.equal(contract.ruleStatus, "Verified");
  assert.equal(contract.primaryCusp, 7);
  assert.ok(contract.primaryCuspSubLord);
  assert.ok(Array.isArray(contract.supportingHouses));
  assert.ok(Array.isArray(contract.subLordSignifiedHouses));
  assert.ok(contract.activeDashaLords.mahadasha);
  assert.ok(contract.activeDashaLords.antardasha);
  assert.ok(contract.synthesisDecision.state);
  assert.ok(contract.authorizedEvidenceNodeIds.length >= 10);
  assert.ok(Object.keys(contract.authorizedFacts).length >= 15);
});

// ── Test 2: Provenance Preservation Through Contract Serialization ───────────
test("2I-J Test 2 — Canonical sources, pages, and relation IDs survive serialization", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");

  assert.ok(contract.canonicalSource.includes("KP Reader"));
  assert.ok(contract.conflictFindings.length > 0);

  for (const finding of contract.conflictFindings) {
    assert.ok(finding.relationId.startsWith("REL-"));
    assert.ok(finding.precedenceRule.length > 0);
    assert.ok(finding.provenance.sourceBook.length > 0);
    assert.ok(finding.provenance.pages.length > 0);
    assert.ok(finding.provenance.verificationStatus.length > 0);
  }
});

// ── Test 3: Upstream Immutability Guard ──────────────────────────────────────
test("2I-J Test 3 — Building contract leaves upstream chart and KP engine structures bit-identical", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const chartBefore = JSON.stringify(chart);
  const kpBefore = JSON.stringify(kp);

  buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-PROPERTY-ACQUISITION-01");

  assert.equal(JSON.stringify(chart), chartBefore, "ChartData must remain bit-identical");
  assert.equal(JSON.stringify(kp), kpBefore, "KPEngineResult must remain bit-identical");
});

// ── Test 4: Adversarial Fixture 1 — Upstream Divergence Trap ────────────────
test("2I-J Test 4 — Adversarial Fixture 1: Obstructed Dasha cannot be overridden by favorable Transit", () => {
  // Construct deliberate adversarial contract where transit is confirmed but dasha is obstructed
  const adversarialContract: KPPredictiveEvidenceContract = {
    contractVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    ruleId: "KP-RULE-MARRIAGE-01",
    ruleName: "Marriage & Partnership",
    ruleCategory: "Relationships",
    ruleStatus: "Verified",
    canonicalSource: 'KP Reader 3: "Predictive Stellar Astrology", p. 431.',
    primaryCusp: 7,
    supportingHouses: [2, 7, 11],
    detrimentHouses: [1, 6, 10, 12],
    primaryCuspSubLord: "Jupiter",
    subLordSignifiedHouses: [2, 7, 11],
    cuspPromiseVerdict: "PROMISE_SUPPORTED",
    cuspPromiseReason: "Sub-lord signifies 2, 7, 11",
    activeDashaLords: {
      mahadasha: "Saturn",
      antardasha: "Mars",
    },
    dashaTimingState: "OBSTRUCTED_WINDOW",
    dashaMacroVerdict: "Sub-period lord signifies barrier houses 6 and 12",
    transitState: "TRANSIT_CONFIRMED",
    transitSummary: "Sun and Jupiter transit supportive stars",
    rulingPlanetsState: "RP_DISCORDANT",
    rulingPlanetsMatchedLords: [],
    conflictFindings: [
      {
        relationId: "REL-05",
        precedenceRule: "Dasha Hierarchy Precedence over Transit Confirmation",
        primaryLayer: "Dasha Hierarchy (OBSTRUCTED_WINDOW)",
        subordinateLayer: "Transit Confirmation (TRANSIT_CONFIRMED)",
        rationale: "Reader III p. 474: Favourable transit cannot overcome an adverse Dasha period.",
        provenance: {
          sourceBook: "KP Reader III",
          pages: "pp. 471–475",
          verificationStatus: "Verified",
        },
      },
    ],
    synthesisDecision: {
      state: "TIMING_OBSTRUCTED",
      delayVsDenial: "UNOBSTRUCTED",
      isFructificationExpected: false,
      expectedManifestationType: "OBSTRUCTED_WINDOW",
      summaryVerdict: "Event timing is obstructed by active period lord significations.",
    },
    authorizedEvidenceNodeIds: ["NODE-1-ADVERSARIAL", "NODE-12-SYNTHESIS"],
    authorizedFacts: {
      RULE_ID: "KP-RULE-MARRIAGE-01",
      SYNTHESIS_STATE: "TIMING_OBSTRUCTED",
      PRIMARY_CUSP_SUB_LORD: "Jupiter",
    },
  };

  const explainabilityPrompt = createExplainabilityPrompt(adversarialContract);
  assert.ok(explainabilityPrompt.systemPrompt.includes("TIMING_OBSTRUCTED"));
  assert.ok(explainabilityPrompt.systemPrompt.includes("EXPLAIN ONLY, DO NOT RECALCULATE"));

  // Attempt 1: Adversarial narrative that falsely claims favorable transits trigger marriage now
  const invalidNarrative = "Although Dasha is challenging, the current transit of Jupiter is confirmed and brings marriage now!";
  const validation1 = validateConsumerNarrative({
    narrativeText: invalidNarrative,
    contract: adversarialContract,
  });
  assert.equal(validation1.isValid, false, "Must reject narrative claiming immediate window when TIMING_OBSTRUCTED");
  assert.ok(validation1.rejections.some((r) => r.includes("TIMING_OBSTRUCTED")));

  // Attempt 2: Disciplined narrative adhering to synthesis
  const validNarrative = "Based on rule KP-RULE-MARRIAGE-01, the synthesis state is TIMING_OBSTRUCTED. Under relation REL-05, favourable transit confirmation cannot bypass an obstructed Dasha period lord.";
  const validation2 = validateConsumerNarrative({
    narrativeText: validNarrative,
    contract: adversarialContract,
  });
  assert.equal(validation2.isValid, true, "Disciplined narrative matching synthesis must pass");
});

// ── Test 5: Adversarial Fixture 2 — Reference_Pending Certainty Trap ─────────
test("2I-J Test 5 — Adversarial Fixture 2: Reference_Pending strictly halts at EVALUATION_PENDING", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-SPECULATIVE-GAINS-01");

  assert.equal(contract.ruleStatus, "Reference_Pending");
  assert.equal(contract.synthesisDecision.state, "EVALUATION_PENDING");

  const prompt = createExplainabilityPrompt(contract);
  assert.ok(prompt.systemPrompt.includes("REFERENCE_PENDING"));
  assert.ok(prompt.systemPrompt.includes("EVALUATION_PENDING"));

  // Attempt 1: AI manufactures predictive optimism
  const optimisticClaim = "Intraday speculative gains will definitely fructify tomorrow with large profits.";
  const val1 = validateConsumerNarrative({
    narrativeText: optimisticClaim,
    contract,
  });
  assert.equal(val1.isValid, false, "Must reject predictive certainty on Reference_Pending");
  assert.ok(val1.rejections.some((r) => r.includes("Reference_Pending")));

  // Attempt 2: AI provides proper epistemic disclaimer
  const compliantText = "For KP-RULE-SPECULATIVE-GAINS-01, the topic is Reference_Pending in the registry. The synthesis is EVALUATION_PENDING under classical safeguard REL-10 because multi-layer conflict precedence for modern intraday trading is pending verification.";
  const val2 = validateConsumerNarrative({
    narrativeText: compliantText,
    contract,
  });
  assert.equal(val2.isValid, true, "Compliant Reference_Pending explanation must pass");
});

// ── Test 6: Raw-Input Leakage Test ──────────────────────────────────────────
test("2I-J Test 6 — Raw-Input Leakage: Information absent from evidence contract cannot be asserted", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");

  // Attempt to inject unrepresented divisional chart or dosha assertions
  const leakingNarrative = "Under KP-RULE-MARRIAGE-01, EVENT_DENIED_BY_NATAL_PROMISE is noted, and the Navamsha chart also exhibits strong Manglik Dosha.";
  const val = validateConsumerNarrative({
    narrativeText: leakingNarrative,
    contract,
  });

  assert.equal(val.isValid, false, "Must reject narrative with raw-input leakage");
  assert.ok(val.rejections.some((r) => r.includes("Raw-input leakage detected")));
});

// ── Test 7: Claim-Specific Grounding Guard ───────────────────────────────────
test("2I-J Test 7 — Claim-Specific Grounding: Ungrounded arbitrary timing claims are rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-CAREER-JOB-01");

  // Narrative manufactures specific date duration absent from contract
  const arbitraryTimingNarrative = "For KP-RULE-CAREER-JOB-01, the synthesis state is TIMING_NEUTRAL, but new employment will definitely materialize in six months.";
  const val = validateConsumerNarrative({
    narrativeText: arbitraryTimingNarrative,
    contract,
  });

  assert.equal(val.isValid, false, "Must reject ungrounded exact duration claims");
  assert.ok(val.rejections.some((r) => r.includes("arbitrary timing duration")));
});

// ── Test 8: Prohibited Scoring & Percentage Rejection ────────────────────────
test("2I-J Test 8 — Prohibited Scoring: Numerical scores, percentages, and probabilities rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-PROPERTY-ACQUISITION-01");

  const scoreStatements = [
    "Overall property acquisition likelihood is rated at 80%.",
    "Career and property probability is calculated as High.",
    "Property score: 75 out of 100.",
    "The overall score is 85/100 based on significator strength.",
  ];

  for (const stmt of scoreStatements) {
    const val = validateConsumerNarrative({ narrativeText: stmt, contract });
    assert.equal(val.isValid, false, `Must reject: "${stmt}"`);
    assert.ok(val.rejections.some((r) => r.includes("prohibited numerical score")));
  }
});

// ── Test 9: Ruling Planets Non-Creation / Non-Veto Guard ─────────────────────
test("2I-J Test 9 — Ruling Planets claimed as causing, producing, or vetoing the event is rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-FOREIGN-TRAVEL-01");

  const rpOverreachStatements = [
    "The Ruling Planets created the opportunity for foreign travel.",
    "Ruling Planets vetoed the trip despite favorable Dasha.",
    "The event was decided entirely by the active Ruling Planets.",
  ];

  for (const stmt of rpOverreachStatements) {
    const val = validateConsumerNarrative({ narrativeText: stmt, contract });
    assert.equal(val.isValid, false, `Must reject: "${stmt}"`);
    assert.ok(val.rejections.some((r) => r.includes("Ruling Planets claimed as creating")));
  }
});

// ── Test 10: Conflict State Preservation (No Binary Flattening) ─────────────
test("2I-J Test 10 — Conflict State Preservation: MULTIPLE_MANIFESTATION is preserved without flattening", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-PROPERTY-ACQUISITION-01");

  assert.equal(contract.synthesisDecision.state, "MULTIPLE_MANIFESTATION");
  assert.equal(contract.synthesisDecision.expectedManifestationType, "MIXED_GAIN_AND_EXPENSE");

  const compliantNarrative = "Under KP-RULE-PROPERTY-ACQUISITION-01, the synthesis decision is MULTIPLE_MANIFESTATION with MIXED_GAIN_AND_EXPENSE. Under classical precedent REL-08, dual significations produce concurrent asset gain and capital expenditure rather than a blanket cancellation.";
  const val = validateConsumerNarrative({
    narrativeText: compliantNarrative,
    contract,
  });

  assert.equal(val.isValid, true);
  assert.equal(val.rejections.length, 0);
});

// ── Test 11: Deterministic Bit-Identical Repeat Execution ────────────────────
test("2I-J Test 11 — Contract serialization and explainability prompt are 100% deterministic", () => {
  const { chart, kp } = getCanonicalChartAndKP();

  const c1 = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const c2 = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");

  // Omit generatedAt for strict payload comparison
  const { generatedAt: g1, ...rest1 } = c1;
  const { generatedAt: g2, ...rest2 } = c2;

  assert.deepEqual(rest1, rest2, "Repeated contract serialization must be bit-identical");

  const p1 = createExplainabilityPrompt(c1);
  const p2 = createExplainabilityPrompt(c2);

  assert.equal(p1.systemPrompt, p2.systemPrompt);
  assert.equal(p1.userMessage, p2.userMessage);
});
