/**
 * ============================================================================
 * ASTROLIFE — KP RULE REGISTRY & EVENT PROMISE AUDIT TESTS (PHASE 2I-D)
 * ============================================================================
 * Strict Auditing Suite covering:
 * 1. Absence of confidenceTier (High/Moderate/Low) in event conclusions
 * 2. Explicit significationStrength (GRADE_1, GRADE_2, GRADE_3, GRADE_4, MULTI_GRADE)
 * 3. Absolute absence of hidden numeric scores or count-based dominance heuristics
 * 4. Deterministic boolean set decision tree (SUPPORTED, OBSTRUCTED, MIXED, INCONCLUSIVE)
 * 5. Strict Reference_Pending guard (must return status "REFERENCE_PENDING")
 * 6. Provisional rules preserve provenance and clear disclaimer
 * 7. Verified rules have exact foundational Reader citations
 * 8. Legacy TOPIC_DEFS isolation (cannot override registry)
 * 9. Determinism: Same evidence + same rule = strictly identical output
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { calculateChart } from "./calculations";
import { runKPEngine } from "./kp";
import {
  KP_EVENT_RULE_REGISTRY,
  getRulesByStatus,
  getRulesByCategory,
} from "./kp-rule-registry";
import { evaluateAllEventRules, evaluateEventRule } from "./kp-event-promise";

test("2I-D Audit 1 — No confidenceTier (High/Moderate/Low) in Event Results", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  assert.ok(evidence.eventPromises, "eventPromises must exist");

  Object.values(evidence.eventPromises).forEach((res: any) => {
    assert.equal(res.confidenceTier, undefined, `confidenceTier must NOT exist on rule ${res.ruleId}`);
    assert.ok(
      ["GRADE_1", "GRADE_2", "GRADE_3", "GRADE_4", "MULTI_GRADE", "NONE"].includes(
        res.significationStrength
      ),
      `significationStrength must be explicit grade metadata on ${res.ruleId}`
    );
  });
});

test("2I-D Audit 2 — Explicit SignificationStrength and Evidence Details Preserved", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const marriageRes = evidence.eventPromises!["KP-RULE-MARRIAGE-01"];
  assert.ok(marriageRes);
  assert.ok(marriageRes.significationStrength);
  assert.ok(Array.isArray(marriageRes.evidenceDetails));
  assert.ok(Array.isArray(marriageRes.supportingHousesMatched));
  assert.ok(Array.isArray(marriageRes.detrimentHousesMatched));
  assert.ok(Array.isArray(marriageRes.barrierHousesMatched));
  assert.ok(marriageRes.cuspLord);
  assert.ok(marriageRes.primaryCuspSubLord);
  assert.ok(marriageRes.primaryCuspStarLord);

  // If supporting houses are matched, each detail must have an explicit astrological grade and reason
  if (marriageRes.supportingHousesMatched!.length > 0) {
    const matchedDetails = marriageRes.evidenceDetails.filter((d) =>
      marriageRes.supportingHousesMatched!.includes(d.house)
    );
    assert.ok(matchedDetails.length > 0, "Matched supporting houses must have traceable details");
    matchedDetails.forEach((d) => {
      assert.ok(
        [
          "Grade_1_StarOfOccupant",
          "Grade_2_Occupant",
          "Grade_3_StarOfLord",
          "Grade_4_Lord",
          "Node_Representation",
        ].includes(d.grade)
      );
      assert.ok(d.reason.length > 10, "Reason must be descriptive");
    });
  }
});

test("2I-D Audit 3 — Zero Hidden Numeric Scoring & Zero Count-Based Dominance", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  Object.values(evidence.eventPromises!).forEach((res: any) => {
    // Assert zero numeric score properties
    assert.equal(res.score, undefined, `Rule ${res.ruleId} must NOT contain score`);
    assert.equal(res.points, undefined, `Rule ${res.ruleId} must NOT contain points`);
    assert.equal(res.probability, undefined, `Rule ${res.ruleId} must NOT contain probability`);
    assert.equal(res.percentage, undefined, `Rule ${res.ruleId} must NOT contain percentage`);
  });
});

test("2I-D Audit 4 — Strict Reference_Pending Guard (No Normal Predictive Verdict)", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const specRule = KP_EVENT_RULE_REGISTRY["KP-RULE-SPECULATIVE-GAINS-01"];
  assert.equal(specRule.status, "Reference_Pending");

  const specResult = evidence.eventPromises!["KP-RULE-SPECULATIVE-GAINS-01"];
  assert.ok(specResult);
  // Must NOT produce SUPPORTED, OBSTRUCTED, or MIXED
  assert.equal(
    specResult.status,
    "REFERENCE_PENDING",
    "Reference_Pending rule MUST return status REFERENCE_PENDING"
  );
  assert.ok(specResult.summary!.includes("REFERENCE_PENDING"));
});

test("2I-D Audit 5 — Provisional Rules Preserve Provenance and Disclaimer", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const separationRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARITAL-SEPARATION-01"];
  assert.equal(separationRule.status, "Provisional");

  const separationResult = evidence.eventPromises!["KP-RULE-MARITAL-SEPARATION-01"];
  assert.ok(separationResult);
  assert.equal(separationResult.ruleStatus, "Provisional");
  assert.ok(separationResult.summary!.includes("[PROVISIONAL METHODOLOGY]"));
});

test("2I-D Audit 6 — Verified Rules Have Exact Foundational Reader Citations", () => {
  const verifiedRules = getRulesByStatus("Verified");
  assert.ok(verifiedRules.length >= 19, `Expected at least 19 Verified rules, got ${verifiedRules.length}`);

  verifiedRules.forEach((rule) => {
    assert.equal(rule.status, "Verified");
    const src = rule.canonicalSource;
    assert.ok(src.includes("KP Reader"), `Verified rule ${rule.id} must cite KP Reader, got: ${src}`);
    assert.ok(src.includes("pp.") || src.includes("p."), `Must cite specific pages, got: ${src}`);
  });
});

test("2I-D Audit 6b — Newly Attested Reader III Rules Are Verified & Evaluated", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const newReaderIIIRules = [
    "KP-RULE-BUSINESS-TRADE-01",
    "KP-RULE-HIGHER-EDUCATION-01",
    "KP-RULE-SERVICE-TERMINATION-01",
    "KP-RULE-SERVICE-REINSTATEMENT-01",
    "KP-RULE-PROPERTY-DISPOSAL-01",
    "KP-RULE-IMPRISONMENT-01",
    "KP-RULE-IMPRISONMENT-RELEASE-01",
    "KP-RULE-SCHOLARSHIP-01",
    "KP-RULE-VEHICLE-ACQUISITION-01",
    "KP-RULE-LOAN-BORROWING-01",
    "KP-RULE-HOSPITALIZATION-01",
  ];

  newReaderIIIRules.forEach((ruleId) => {
    const rule = KP_EVENT_RULE_REGISTRY[ruleId];
    assert.ok(rule, `Rule ${ruleId} must exist`);
    assert.equal(rule.status, "Verified", `Rule ${ruleId} must be Verified`);
    assert.ok(rule.canonicalSource.includes("Reader 3"), `Rule ${ruleId} must cite Reader 3`);

    const promise = evidence.eventPromises![ruleId];
    assert.ok(promise, `Promise evaluation for ${ruleId} must exist`);
    assert.equal(promise.ruleStatus, "Verified");
    assert.ok(
      ["SUPPORTED", "OBSTRUCTED", "MIXED", "INCONCLUSIVE"].includes(promise.status),
      `Status for ${ruleId} must be a valid deterministic outcome`
    );
  });
});

test("2I-D Audit 7 — Legacy TOPIC_DEFS Cannot Override Registry", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);

  // Legacy significators exist for backward compatibility
  assert.ok(kpResult.significators.length > 0);

  // But predictiveEvidence.eventPromises strictly sources from KP_EVENT_RULE_REGISTRY
  const eventPromises = kpResult.predictiveEvidence!.eventPromises!;
  const registryKeys = Object.keys(KP_EVENT_RULE_REGISTRY);

  registryKeys.forEach((key) => {
    assert.ok(eventPromises[key], `Event promise for ${key} must exist in eventPromises`);
    assert.equal(eventPromises[key].ruleId, key);
  });
});

test("2I-D Audit 8 — Determinism: Same Evidence + Same Rule = Identical Output", () => {
  const chart1 = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const chart2 = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);

  const res1 = runKPEngine(chart1).predictiveEvidence!.eventPromises!;
  const res2 = runKPEngine(chart2).predictiveEvidence!.eventPromises!;

  assert.deepEqual(res1, res2, "Execution must be 100% deterministic and pure");
});
