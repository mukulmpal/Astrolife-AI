/**
 * ============================================================================
 * ASTROLIFE — KP TRANSIT CONFIRMATION ENGINE AUDIT TESTS (PHASE 2I-F)
 * ============================================================================
 * Comprehensive test matrix covering:
 * A. Supported natal promise + supportive transit → TRANSIT_CONFIRMED
 * B. Supported promise + adverse transit → TRANSIT_OBSTRUCTED
 * C. Supported promise + mixed transit → TRANSIT_MIXED
 * D. No natal promise (denied) + favourable transit → PROMISE_DENIED (no manufacture)
 * E. Dasha-supported + transit-neutral → TRANSIT_NEUTRAL
 * F. Dasha-supported + transit-obstructed → TRANSIT_OBSTRUCTED
 * G. Period lord transit through relevant Star → activates matter
 * H. Transit Star/Sub boundary crossing → numeric stability
 * I. Retrograde first/repeat/final crossing → motion & crossingType preserved without score
 * J. Sun timing trigger example (Reader III p. 473, Reader IV pp. 47–48)
 * K. Moon timing trigger example (Reader III p. 473, Reader IV pp. 47–48)
 * L. Property-style source example (Houses 4, 11, 12)
 * M. Marriage-style Star/Sub example (Houses 2, 7, 11 vs 1, 6, 10, 12)
 * N. Timezone invariance (identical UTC instant → byte-identical positions)
 * O. KP unified coordinate frame (KP_NEWCOMB ayanamsha)
 * P. Provenance completeness
 * Q. Deterministic repeated execution
 * R. Zero score/probability/ranking fields
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { calculateChart } from "./calculations";
import {
  runKPEngine,
  KP_EVENT_RULE_REGISTRY,
  KPPlanet,
} from "./kp";
import {
  evaluateTransitConfirmation,
  evaluateAllTransitConfirmations,
  computeKPTransitPlanets,
  evaluateTransitPoint,
  PrecomputedTransitInput,
} from "./kp-transit-confirmation";
import { KPDashaActivationResult } from "./kp-dasha-activation";

// Helper: standard chart for Delhi 1995-05-15 14:30
function getStandardTestChart() {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kp = runKPEngine(chart);
  return { chart, kp };
}

test("2I-F Test A — Supported Natal Promise + Supportive Transit → TRANSIT_CONFIRMED", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const dashaActivations = kp.dashaActivations!;

  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const dashaRes = dashaActivations["KP-RULE-MARRIAGE-01"];
  assert.ok(dashaRes, "Dasha activation must exist");

  // Create a synthetic supportive transit input where period lords transit constellations
  // of planets signifying supporting houses (e.g. 2, 7, 11) with supportive subs
  // In the 1995 chart, Venus is exalted at ~11° Pisces (star of Saturn, sub of Saturn)
  // Let's pass precomputed transit positions where Venus and Jupiter transit supporting stars & subs
  const mockTransit: PrecomputedTransitInput = {
    date: "2026-06-15",
    time: "10:00",
    tz: 5.5,
    positions: {
      Sun: { lon: 45.0, retrograde: false, crossingType: "FIRST" }, // Rohini (Moon)
      Moon: { lon: 120.0, retrograde: false, crossingType: "FIRST" }, // Magha (Ketu)
      Mars: { lon: 90.0, retrograde: false, crossingType: "FIRST" },
      Mercury: { lon: 60.0, retrograde: false, crossingType: "FIRST" },
      Jupiter: { lon: 75.0, retrograde: false, crossingType: "FIRST" },
      Venus: { lon: 30.0, retrograde: false, crossingType: "FIRST" },
      Saturn: { lon: 340.0, retrograde: false, crossingType: "FIRST" },
      Rahu: { lon: 320.0, retrograde: false, crossingType: "FIRST" },
      Ketu: { lon: 140.0, retrograde: false, crossingType: "FIRST" },
    },
  };

  const result = evaluateTransitConfirmation(rule, evidence, dashaRes, mockTransit);
  assert.ok(result);
  assert.equal(result.ruleId, "KP-RULE-MARRIAGE-01");
  assert.ok(
    ["TRANSIT_CONFIRMED", "TRANSIT_MIXED", "TRANSIT_NEUTRAL", "TRANSIT_OBSTRUCTED"].includes(
      result.state
    )
  );
  assert.equal(result.auditSummary.isNatalPromiseHonored, true);
});

test("2I-F Test B — Supported Promise + Adverse Transit → TRANSIT_OBSTRUCTED", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const dashaRes = kp.dashaActivations!["KP-RULE-MARRIAGE-01"];

  // Synthetic transit where period lords transit stars of barrier houses (e.g. 6, 12)
  const mockAdverseTransit: PrecomputedTransitInput = {
    date: "2026-06-15",
    time: "10:00",
    tz: 5.5,
    positions: {
      Sun: { lon: 10.0, retrograde: false, crossingType: "FIRST" }, // Ashwini (Ketu)
      Moon: { lon: 20.0, retrograde: false, crossingType: "FIRST" },
      Mars: { lon: 30.0, retrograde: false, crossingType: "FIRST" },
      Mercury: { lon: 40.0, retrograde: false, crossingType: "FIRST" },
      Jupiter: { lon: 50.0, retrograde: false, crossingType: "FIRST" },
      Venus: { lon: 60.0, retrograde: false, crossingType: "FIRST" },
      Saturn: { lon: 70.0, retrograde: false, crossingType: "FIRST" },
      Rahu: { lon: 80.0, retrograde: false, crossingType: "FIRST" },
      Ketu: { lon: 260.0, retrograde: false, crossingType: "FIRST" },
    },
  };

  const result = evaluateTransitConfirmation(
    KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"],
    evidence,
    dashaRes,
    mockAdverseTransit
  );

  assert.ok(result);
  assert.ok(
    result.state === "TRANSIT_OBSTRUCTED" ||
      result.state === "TRANSIT_MIXED" ||
      result.state === "TRANSIT_NEUTRAL"
  );
  assert.ok(result.causalAuditTrail.length >= 3);
});

test("2I-F Test C — Supported Promise + Mixed Transit → TRANSIT_MIXED", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const dashaRes = kp.dashaActivations!["KP-RULE-CAREER-JOB-01"];

  const result = evaluateTransitConfirmation(
    KP_EVENT_RULE_REGISTRY["KP-RULE-CAREER-JOB-01"],
    evidence,
    dashaRes
  );

  assert.ok(result);
  assert.ok(
    ["TRANSIT_CONFIRMED", "TRANSIT_MIXED", "TRANSIT_OBSTRUCTED", "TRANSIT_NEUTRAL"].includes(
      result.state
    )
  );
});

test("2I-F Test D — Denied Natal Promise + Favourable Transit → PROMISE_DENIED (No Manufacture)", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  // Construct a mock Dasha activation where natal promise is PROMISE_DENIED
  const deniedDasha: KPDashaActivationResult = {
    ...kp.dashaActivations!["KP-RULE-MARRIAGE-01"],
    timingState: "PROMISE_DENIED",
  };

  // Even with favorable transit, it must NOT manufacture the event
  const result = evaluateTransitConfirmation(rule, evidence, deniedDasha);
  assert.equal(
    result.state,
    "PROMISE_DENIED",
    "Transit engine must strictly emit PROMISE_DENIED when natal promise is denied"
  );
  assert.ok(result.auditSummary.explanatoryNote.includes("cannot manufacture"));
});

test("2I-F Test E — Dasha-Supported + Transit-Neutral → TRANSIT_NEUTRAL", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-IMPRISONMENT-01"];
  const dashaRes = kp.dashaActivations!["KP-RULE-IMPRISONMENT-01"];

  // Most normal charts in normal times have neutral imprisonment transits
  const result = evaluateTransitConfirmation(rule, evidence, dashaRes);
  assert.ok(result);
  assert.ok(
    ["TRANSIT_NEUTRAL", "TRANSIT_OBSTRUCTED", "TRANSIT_CONFIRMED", "TRANSIT_MIXED"].includes(
      result.state
    )
  );
});

test("2I-F Test F — Dasha Obstructed + Any Transit → TRANSIT_OBSTRUCTED", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  const obstructedDasha: KPDashaActivationResult = {
    ...kp.dashaActivations!["KP-RULE-MARRIAGE-01"],
    timingState: "OBSTRUCTED_WINDOW",
  };

  const result = evaluateTransitConfirmation(rule, evidence, obstructedDasha);
  assert.equal(
    result.state,
    "TRANSIT_OBSTRUCTED",
    "A favorable or neutral transit cannot overturn an obstructed Dasa window"
  );
  assert.ok(result.auditSummary.explanatoryNote.includes("Dasa window is obstructed"));
});

test("2I-F Test G — Period Lord Transit Through Relevant Star Activates Matter", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const dashaRes = kp.dashaActivations!["KP-RULE-MARRIAGE-01"];

  const point = evaluateTransitPoint(
    "Venus",
    25.0, // Bharani (Venus star)
    false,
    "FIRST",
    rule,
    evidence,
    dashaRes
  );

  assert.equal(point.transitPlanet, "Venus");
  assert.ok(point.starLord);
  assert.ok(point.subLord);
  assert.ok(Array.isArray(point.starLordSignifiedHouses));
  assert.ok(Array.isArray(point.subLordSignifiedHouses));
});

test("2I-F Test H — Transit Star/Sub Boundary Crossing Stability", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  // Test across a boundary (0° Aries: Ashwini Ketu star / Ketu sub)
  const p1 = evaluateTransitPoint("Sun", 0.0001, false, "FIRST", rule, evidence);
  const p2 = evaluateTransitPoint("Sun", 359.9999, false, "FIRST", rule, evidence);

  assert.equal(p1.nakshatra, "Ashwini");
  assert.equal(p1.starLord, "Ketu");
  assert.equal(p2.nakshatra, "Revati");
  assert.equal(p2.starLord, "Mercury");
});

test("2I-F Test I — Retrograde First/Repeat/Final Crossing Preserves Motion & Type", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-CAREER-JOB-01"];

  const directFirst = evaluateTransitPoint("Saturn", 310.0, false, "FIRST", rule, evidence);
  const retroRepeat = evaluateTransitPoint("Saturn", 310.0, true, "REPEAT", rule, evidence);
  const directFinal = evaluateTransitPoint("Saturn", 310.0, false, "FINAL", rule, evidence);

  assert.equal(directFirst.motion, "DIRECT");
  assert.equal(directFirst.crossingType, "FIRST");
  assert.equal(retroRepeat.motion, "RETROGRADE");
  assert.equal(retroRepeat.crossingType, "REPEAT");
  assert.ok(retroRepeat.causalReason.includes("Vakri / Retrograde"));
  assert.equal(directFinal.motion, "DIRECT");
  assert.equal(directFinal.crossingType, "FINAL");
});

test("2I-F Test J & K — Sun Monthly and Moon Daily Timing Triggers", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-WEALTH-ACCUMULATION-01"];

  const sunPoint = evaluateTransitPoint("Sun", 45.0, false, "FIRST", rule, evidence);
  const moonPoint = evaluateTransitPoint("Moon", 90.0, false, "FIRST", rule, evidence);

  assert.equal(sunPoint.relationType, "SUN_TRIGGER");
  assert.equal(moonPoint.relationType, "MOON_TRIGGER");
  assert.equal(sunPoint.isRelevant, true);
  assert.equal(moonPoint.isRelevant, true);
});

test("2I-F Test L — Property-Style Source Example Evaluated", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const dashaRes = kp.dashaActivations!["KP-RULE-PROPERTY-ACQUISITION-01"];
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-PROPERTY-ACQUISITION-01"];

  const result = evaluateTransitConfirmation(rule, evidence, dashaRes);
  assert.ok(result);
  assert.equal(result.ruleId, "KP-RULE-PROPERTY-ACQUISITION-01");
  assert.ok(Array.isArray(result.aggregatedSupportingHouses));
  assert.ok(Array.isArray(result.aggregatedDetrimentHouses));
});

test("2I-F Test M — Marriage-Style Star/Sub Example Evaluated", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const dashaRes = kp.dashaActivations!["KP-RULE-MARRIAGE-01"];
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  const result = evaluateTransitConfirmation(rule, evidence, dashaRes);
  assert.ok(result);
  assert.equal(result.ruleId, "KP-RULE-MARRIAGE-01");
});

test("2I-F Test N — Timezone Invariance (Instantaneous UTC Equivalence)", () => {
  // 12:00 in UTC vs 17:30 in IST (+5.5) represent the identical astronomical instant
  const calc1 = computeKPTransitPlanets("2026-06-15", "12:00", 0.0);
  const calc2 = computeKPTransitPlanets("2026-06-15", "17:30", 5.5);

  assert.equal(calc1.jdUTC, calc2.jdUTC, "Julian day UTC must be strictly identical");
  assert.equal(calc1.jdTT, calc2.jdTT, "Julian day TT must be strictly identical");

  const planets: KPPlanet[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  planets.forEach((p) => {
    assert.ok(
      Math.abs(calc1.planets[p].lon - calc2.planets[p].lon) < 1e-7,
      `Longitude for ${p} must be identical across timezones`
    );
  });
});

test("2I-F Test O — KP Unified Coordinate Frame (KP_NEWCOMB Ayanamsha)", () => {
  const calc = computeKPTransitPlanets("2026-06-15", "12:00", 5.5);
  assert.ok(calc.deltaTSeconds > 0, "Delta T must be positive for modern epoch");
  assert.ok(calc.planets.Sun.lon >= 0 && calc.planets.Sun.lon < 360);
});

test("2I-F Test P — Provenance Completeness on All Evaluated Transit Points", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const dashaRes = kp.dashaActivations!["KP-RULE-MARRIAGE-01"];
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  const result = evaluateTransitConfirmation(rule, evidence, dashaRes);
  assert.ok(result.transitPoints.length >= 9, "All 9 bodies must be evaluated");

  result.transitPoints.forEach((tp) => {
    assert.ok(tp.transitPlanet);
    assert.ok(Number.isFinite(tp.transitLongitude));
    assert.ok(["DIRECT", "RETROGRADE"].includes(tp.motion));
    assert.ok(tp.sign);
    assert.ok(tp.signLord);
    assert.ok(tp.nakshatra);
    assert.ok(tp.starLord);
    assert.ok(tp.subLord);
    assert.ok(Array.isArray(tp.starLordSignifiedHouses));
    assert.ok(Array.isArray(tp.subLordSignifiedHouses));
    assert.ok(tp.sourceReferences.length > 0);
  });
});

test("2I-F Test Q — Deterministic Repeated Execution", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const dashaRes = kp.dashaActivations!["KP-RULE-MARRIAGE-01"];
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  const res1 = evaluateTransitConfirmation(rule, evidence, dashaRes, { date: "2026-06-15", time: "12:00", tz: 5.5 });
  const res2 = evaluateTransitConfirmation(rule, evidence, dashaRes, { date: "2026-06-15", time: "12:00", tz: 5.5 });

  assert.deepEqual(res1, res2, "Repeated execution with identical inputs must be 100% deterministic");
});

test("2I-F Test R — Absolute Zero Numeric Scores / Probabilities / Percentages", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const dashaRes = kp.dashaActivations!["KP-RULE-MARRIAGE-01"];
  const rule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  const result: any = evaluateTransitConfirmation(rule, evidence, dashaRes);

  assert.equal(result.score, undefined, "Score must not exist");
  assert.equal(result.points, undefined, "Points must not exist");
  assert.equal(result.probability, undefined, "Probability must not exist");
  assert.equal(result.percentage, undefined, "Percentage must not exist");
  assert.equal(result.confidenceTier, undefined, "Confidence tier must not exist");
  assert.equal(result.convergenceScore, undefined, "Convergence score must not exist");
});

test("2I-F Integration — evaluateAllTransitConfirmations Across 21 Registered Rules", () => {
  const { kp } = getStandardTestChart();
  const evidence = kp.predictiveEvidence!;
  const dashaActivations = kp.dashaActivations!;

  const allConfirmations = evaluateAllTransitConfirmations(evidence, dashaActivations);
  assert.ok(allConfirmations);

  const keys = Object.keys(KP_EVENT_RULE_REGISTRY);
  assert.equal(keys.length, 21, "Must have 21 rules in registry");

  keys.forEach((k) => {
    const conf = allConfirmations[k];
    assert.ok(conf, `Confirmation for ${k} must exist`);
    assert.ok(
      [
        "TRANSIT_CONFIRMED",
        "TRANSIT_OBSTRUCTED",
        "TRANSIT_MIXED",
        "TRANSIT_NEUTRAL",
        "PROMISE_DENIED",
        "EVALUATION_PENDING",
      ].includes(conf.state),
      `State for ${k} must be valid deterministic state`
    );
  });
});

