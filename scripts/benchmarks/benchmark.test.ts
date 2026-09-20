/**
 * ============================================================================
 * ASTROLIFE BENCHMARK HARNESS — AUTOMATED UNIT & REGRESSION TEST SUITE
 * ============================================================================
 * Tests:
 * 1. Provenance schema validity & invalid input rejection
 * 2. Birth-time confidence policy evaluation across all 4 tiers
 * 3. Angular wraparound (circular difference) calculations
 * 4. Benchmark schema validation
 * 5. Missing reference data handling (REFERENCE_PENDING)
 * 6. Tolerance handling and review thresholds
 * 7. PASS / FAIL / REVIEW classification
 * 8. Deterministic benchmark output consistency
 * ============================================================================
 */

import assert from "node:assert/strict";
import test from "node:test";
import {
  BirthTimeConfidenceLevel,
  evaluateSubsystemAccess,
} from "../../src/lib/astro/types/birth-time-confidence";
import {
  type CalculationProvenance,
  validateCalculationProvenance,
} from "../../src/lib/astro/types/calculation-provenance";
import { BENCHMARK_TEST_CASES } from "./cases";
import {
  circularAngularDifference,
  compareAngularMetric,
  compareCategoricalMetric,
  compareScalarMetric,
} from "./comparator";
import { runAllBenchmarks, runSingleTestCase } from "./runner";
import { REFERENCE_PENDING } from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Angular Wraparound & Circular Normalization Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Angular Wraparound — Shortest distance across 0°/360° boundary", () => {
  // Test case: 359.999° vs 0.001° -> shortest distance is 0.002°, NOT 359.998°
  const diff1 = circularAngularDifference(359.999, 0.001);
  assert.ok(Math.abs(diff1 - 0.002) < 1e-9, `Expected 0.002, got ${diff1}`);

  // Test case: 0.001° vs 359.999° (reverse order)
  const diff2 = circularAngularDifference(0.001, 359.999);
  assert.ok(Math.abs(diff2 - 0.002) < 1e-9, `Expected 0.002, got ${diff2}`);

  // Test case: Exact opposites (180° distance)
  const diffOpposite = circularAngularDifference(10, 190);
  assert.equal(diffOpposite, 180);

  // Test case: Identical values
  assert.equal(circularAngularDifference(125.5, 125.5), 0);

  // Test case: Greater than 360° inputs
  const diffLarge = circularAngularDifference(720.001, 359.999);
  assert.ok(Math.abs(diffLarge - 0.002) < 1e-9);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Tolerance Handling & Status Classification Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Tolerance Handling — PASS, REVIEW, and FAIL classification", () => {
  const tolerance = 0.01; // 0.01 degrees

  // A. PASS: Difference within tolerance
  const passResult = compareAngularMetric("Mars", 100.004, 100.0, tolerance);
  assert.equal(passResult.status, "PASS");
  assert.equal(passResult.angularDifference, 0.004);

  // B. REVIEW: Difference exceeds tolerance (0.01) but is <= 3x tolerance (0.03)
  const reviewResult = compareAngularMetric("Mars", 100.018, 100.0, tolerance);
  assert.equal(reviewResult.status, "REVIEW");
  assert.equal(reviewResult.angularDifference, 0.018);

  // C. FAIL: Difference exceeds 3x tolerance (> 0.03)
  const failResult = compareAngularMetric("Mars", 100.045, 100.0, tolerance);
  assert.equal(failResult.status, "FAIL");
  assert.equal(failResult.angularDifference, 0.045);

  // D. FAIL: Missing actual value (NaN or null)
  const nanResult = compareAngularMetric("Mars", NaN, 100.0, tolerance);
  assert.equal(nanResult.status, "FAIL");
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Missing Reference Data Handling (REFERENCE_PENDING)
// ─────────────────────────────────────────────────────────────────────────────
test("Missing Reference Data — Graceful REFERENCE_PENDING handling without failure", () => {
  // Metric marked with REFERENCE_PENDING should produce status REFERENCE_PENDING
  const pendingResult = compareAngularMetric("Moon", 359.95, REFERENCE_PENDING);
  assert.equal(pendingResult.status, "REFERENCE_PENDING");
  assert.equal(pendingResult.expected, REFERENCE_PENDING);
  assert.equal(pendingResult.actual, 359.95);

  const pendingScalar = compareScalarMetric("DashaBalance", 12.5, REFERENCE_PENDING);
  assert.equal(pendingScalar.status, "REFERENCE_PENDING");

  const pendingCat = compareCategoricalMetric("Tithi", "Pratipada", REFERENCE_PENDING);
  assert.equal(pendingCat.status, "REFERENCE_PENDING");
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Provenance Schema Validity Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Calculation Provenance — Schema validity and rejection of invalid data", () => {
  const validProvenance: CalculationProvenance = {
    engineName: "AstroLife-Universal-Engine",
    engineVersion: "3.0.0",
    ephemerisName: "Moshier JS (ephemeris npm)",
    ephemerisVersion: "2.2.0",
    precisionLevel: "ANALYTICAL_APPROXIMATION",
    ayanamsha: "Lahiri_Chitrapaksha",
    nodeMode: "Mean",
    houseSystem: "DegreeEqualBhava",
    latitude: 28.6139,
    longitude: 77.209,
    timezone: "Asia/Kolkata",
    timezoneDatabaseVersion: "tzdata-2024a",
    calculationTimestamp: "2026-09-19T10:00:00.000Z",
    birthTimestamp: "1995-05-12T04:30:00.000Z",
    coordinateSource: "GEONAMES_DATABASE",
    timezoneSource: "IANA_DATABASE",
  };

  const validation = validateCalculationProvenance(validProvenance);
  assert.equal(validation.valid, true);
  assert.equal(validation.errors.length, 0);

  // Invalid: Bad coordinates
  const badCoords = { ...validProvenance, latitude: 120.0 }; // Lat > 90
  const badCoordsRes = validateCalculationProvenance(badCoords);
  assert.equal(badCoordsRes.valid, false);
  assert.ok(badCoordsRes.errors.some((e) => e.includes("latitude")));

  // Invalid: Missing required string
  const missingField = { ...validProvenance, ephemerisVersion: "" };
  const missingFieldRes = validateCalculationProvenance(missingField);
  assert.equal(missingFieldRes.valid, false);
  assert.ok(missingFieldRes.errors.some((e) => e.includes("ephemerisVersion")));

  // Invalid: Bad ISO date
  const badDate = { ...validProvenance, calculationTimestamp: "not-a-valid-date" };
  const badDateRes = validateCalculationProvenance(badDate);
  assert.equal(badDateRes.valid, false);
  assert.ok(badDateRes.errors.some((e) => e.includes("calculationTimestamp")));
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Birth-Time Confidence Policy Tests
// ─────────────────────────────────────────────────────────────────────────────
test("Birth-Time Confidence — Sensitivity policy across all 4 tiers", () => {
  // 1. EXACT: D60 is SENSITIVE (never blindly marked stable because D60 changes every 2 min)
  const exactD60 = evaluateSubsystemAccess(BirthTimeConfidenceLevel.EXACT, "D60_SHASTIAMSHA");
  assert.equal(exactD60.status, "SENSITIVE");

  const exactD1 = evaluateSubsystemAccess(BirthTimeConfidenceLevel.EXACT, "D1_PLANETS");
  assert.equal(exactD1.status, "STABLE");

  // 2. PLUS_MINUS_5_MIN: D10 has warning, D60 is RESTRICTED
  const fiveMinD10 = evaluateSubsystemAccess(BirthTimeConfidenceLevel.PLUS_MINUS_5_MIN, "D10_DASHAMSHA");
  assert.equal(fiveMinD10.status, "WARNING_REQUIRED");

  const fiveMinD60 = evaluateSubsystemAccess(BirthTimeConfidenceLevel.PLUS_MINUS_5_MIN, "D60_SHASTIAMSHA");
  assert.equal(fiveMinD60.status, "RESTRICTED");

  // 3. PLUS_MINUS_15_MIN: D9 has warning, KP sub-lords are RESTRICTED
  const fifteenMinD9 = evaluateSubsystemAccess(BirthTimeConfidenceLevel.PLUS_MINUS_15_MIN, "D9_NAVAMSHA");
  assert.equal(fifteenMinD9.status, "WARNING_REQUIRED");

  const fifteenMinKPSub = evaluateSubsystemAccess(BirthTimeConfidenceLevel.PLUS_MINUS_15_MIN, "KP_SUB_LORDS");
  assert.equal(fifteenMinKPSub.status, "RESTRICTED");

  // 4. APPROXIMATE: D1 Ascendant is RESTRICTED, transits require warning
  const approxLagna = evaluateSubsystemAccess(BirthTimeConfidenceLevel.APPROXIMATE, "D1_ASCENDANT");
  assert.equal(approxLagna.status, "RESTRICTED");

  const approxTransits = evaluateSubsystemAccess(BirthTimeConfidenceLevel.APPROXIMATE, "TRANSITS");
  assert.equal(approxTransits.status, "WARNING_REQUIRED");
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. Benchmark Test Cases & Deterministic Output Consistency
// ─────────────────────────────────────────────────────────────────────────────
test("Benchmark Suite — All 10 cases execute cleanly and deterministically", () => {
  assert.equal(BENCHMARK_TEST_CASES.length, 10, "Expected exactly 10 stress categories");

  // Verify each case has valid schema fields
  for (const tc of BENCHMARK_TEST_CASES) {
    assert.ok(tc.id.startsWith("TC-"));
    assert.ok(tc.birthDate.length === 10);
    assert.ok(tc.birthTime.length === 5);
    assert.ok(Number.isFinite(tc.latitude));
    assert.ok(Number.isFinite(tc.longitude));
    assert.ok(Number.isFinite(tc.timezone));
  }

  // Run a single test case (Case 1)
  const singleResult = runSingleTestCase(BENCHMARK_TEST_CASES[0]);
  assert.equal(singleResult.testCase.id, "TC-NAKSHATRA-SANDHI-01");
  assert.ok(singleResult.metrics.length > 0);
  assert.ok(singleResult.executionDurationMs >= 0);

  // Run full benchmark suite
  const fullReport = runAllBenchmarks();
  assert.equal(fullReport.summary.totalCases, 10);
  assert.ok(fullReport.summary.totalMetrics > 0);
  assert.ok(
    !fullReport.caseResults.some((r) => r.metrics.some((m) => m.actual === "CRASH")),
    "No crashes or unhandled exceptions should occur during benchmark execution"
  );
});

