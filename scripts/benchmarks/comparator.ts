/**
 * ============================================================================
 * ASTROLIFE BENCHMARK HARNESS — COMPARISON ENGINE
 * ============================================================================
 * Performs mathematically rigorous, circular-aware comparisons between actual
 * AstroLife calculation results and reference baselines.
 * ============================================================================
 */

import {
  type EvaluationStatus,
  type MetricComparisonResult,
  REFERENCE_PENDING,
  type ReferencePending,
} from "./schema";

/**
 * Calculates the shortest angular distance on a circle [0, 360).
 * Handles circular wraparound correctly:
 * e.g., 359.999° vs 0.001° produces 0.002°, NOT 359.998°.
 */
export function circularAngularDifference(deg1: number, deg2: number): number {
  const norm1 = ((deg1 % 360) + 360) % 360;
  const norm2 = ((deg2 % 360) + 360) % 360;
  let diff = Math.abs(norm1 - norm2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Compares two angular values (in degrees) with circular normalization.
 */
export function compareAngularMetric(
  metricName: string,
  actual: number | null | undefined,
  expected: number | ReferencePending | undefined,
  toleranceDeg: number = 0.01,
  reviewThresholdMultiplier: number = 3
): MetricComparisonResult {
  if (expected === undefined) {
    return {
      metricName,
      actual: actual ?? null,
      expected: REFERENCE_PENDING,
      status: "REFERENCE_PENDING",
      notes: "Metric not configured in test case.",
    };
  }

  if (expected === REFERENCE_PENDING) {
    return {
      metricName,
      actual: actual !== undefined && actual !== null ? Number(actual.toFixed(6)) : null,
      expected: REFERENCE_PENDING,
      status: "REFERENCE_PENDING",
      notes: "Official external reference baseline pending collection.",
    };
  }

  if (actual === undefined || actual === null || isNaN(actual)) {
    return {
      metricName,
      actual: null,
      expected,
      status: "FAIL",
      notes: "Actual value is missing or NaN.",
    };
  }

  const angularDiff = circularAngularDifference(actual, expected);
  const roundedDiff = Number(angularDiff.toFixed(6));

  let status: EvaluationStatus = "PASS";
  let notes: string | undefined;

  if (angularDiff > toleranceDeg * reviewThresholdMultiplier) {
    status = "FAIL";
    notes = `Exceeds allowable tolerance (${toleranceDeg}°) by significant margin (${roundedDiff}°).`;
  } else if (angularDiff > toleranceDeg) {
    status = "REVIEW";
    notes = `Slight drift exceeding tolerance (${toleranceDeg}°), within review band (${roundedDiff}°).`;
  }

  return {
    metricName,
    actual: Number(actual.toFixed(6)),
    expected: Number(expected.toFixed(6)),
    difference: roundedDiff,
    angularDifference: roundedDiff,
    tolerance: toleranceDeg,
    status,
    notes,
  };
}

/**
 * Compares two scalar numeric values (e.g. Dasha balance years, speeds, or dates).
 */
export function compareScalarMetric(
  metricName: string,
  actual: number | null | undefined,
  expected: number | ReferencePending | undefined,
  tolerance: number = 0.001,
  reviewThresholdMultiplier: number = 3
): MetricComparisonResult {
  if (expected === undefined || expected === REFERENCE_PENDING) {
    return {
      metricName,
      actual: actual !== undefined && actual !== null ? Number(actual.toFixed(6)) : null,
      expected: REFERENCE_PENDING,
      status: "REFERENCE_PENDING",
      notes: "Reference value pending.",
    };
  }

  if (actual === undefined || actual === null || isNaN(actual)) {
    return {
      metricName,
      actual: null,
      expected,
      status: "FAIL",
      notes: "Actual value is missing or NaN.",
    };
  }

  const diff = Math.abs(actual - expected);
  const roundedDiff = Number(diff.toFixed(6));

  let status: EvaluationStatus = "PASS";
  let notes: string | undefined;

  if (diff > tolerance * reviewThresholdMultiplier) {
    status = "FAIL";
    notes = `Discrepancy (${roundedDiff}) exceeds tolerance (${tolerance}).`;
  } else if (diff > tolerance) {
    status = "REVIEW";
    notes = `Discrepancy (${roundedDiff}) in review range.`;
  }

  return {
    metricName,
    actual: Number(actual.toFixed(6)),
    expected: Number(expected.toFixed(6)),
    difference: roundedDiff,
    tolerance,
    status,
    notes,
  };
}

/**
 * Compares discrete categorical values (e.g. Nakshatra name, Pada number, Tithi, Yoga, Karana, Sign).
 */
export function compareCategoricalMetric(
  metricName: string,
  actual: string | number | null | undefined,
  expected: string | number | ReferencePending | undefined
): MetricComparisonResult {
  if (expected === undefined || expected === REFERENCE_PENDING) {
    return {
      metricName,
      actual: actual ?? null,
      expected: REFERENCE_PENDING,
      status: "REFERENCE_PENDING",
      notes: "Reference value pending.",
    };
  }

  if (actual === undefined || actual === null) {
    return {
      metricName,
      actual: null,
      expected,
      status: "FAIL",
      notes: "Actual categorical output is missing.",
    };
  }

  const matches = String(actual).trim().toLowerCase() === String(expected).trim().toLowerCase();

  return {
    metricName,
    actual,
    expected,
    status: matches ? "PASS" : "FAIL",
    notes: matches ? undefined : `Mismatch: expected '${expected}', got '${actual}'.`,
  };
}

