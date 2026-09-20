/**
 * ============================================================================
 * ASTROLIFE BENCHMARK HARNESS — SCHEMA DEFINITIONS
 * ============================================================================
 * Strongly-typed contracts for reference test cases and comparison evaluations.
 *
 * Directives:
 * - Differentiate between INPUT, EXPECTED, ACTUAL, DIFFERENCE, STATUS.
 * - Distinguish explicitly verified reference values from REFERENCE_PENDING.
 * - Circular angular difference handling.
 * ============================================================================
 */

import type { AyanamshaType, HouseSystemType, LunarNodeMode } from "../../src/lib/astro/types/calculation-provenance";

export const REFERENCE_PENDING = "REFERENCE_PENDING" as const;
export type ReferencePending = typeof REFERENCE_PENDING;

export type BenchmarkCategory =
  | "nakshatra-boundary"
  | "navamsha-boundary"
  | "cusp-boundary"
  | "historical-timezone"
  | "midnight-boundary"
  | "sunrise-sunset"
  | "retrograde-stationary"
  | "high-latitude"
  | "true-mean-node"
  | "combustion-boundary";

export type EvaluationStatus =
  | "PASS"
  | "FAIL"
  | "REVIEW"
  | "REFERENCE_PENDING";

export interface AngularQuantity {
  degrees: number;
}

export interface ExpectedVargaPlacement {
  varga: string; // e.g. "D9", "D10", "D60"
  planet: string;
  sign: string;
  signNum: number;
}

export interface BenchmarkExpectedOutputs {
  sunLongitude?: number | ReferencePending;
  moonLongitude?: number | ReferencePending;
  planetLongitudes?: Record<string, number | ReferencePending>;
  planetSpeeds?: Record<string, number | ReferencePending>;
  ascendant?: number | ReferencePending;
  houseCusps?: Array<{ house: number; longitude: number | ReferencePending }>;
  rahuLongitude?: number | ReferencePending;
  ketuLongitude?: number | ReferencePending;
  nakshatra?: string | ReferencePending;
  nakshatraPada?: number | ReferencePending;
  tithi?: string | ReferencePending;
  yoga?: string | ReferencePending;
  karana?: string | ReferencePending;
  dashaBalanceYears?: number | ReferencePending;
  vargaPlacements?: ExpectedVargaPlacement[];
}

export interface BenchmarkTolerances {
  /** Angular tolerance in decimal degrees (e.g. 0.01° = 36 arc-seconds) */
  planetaryLongitudeDeg?: number;
  ascendantLongitudeDeg?: number;
  houseCuspLongitudeDeg?: number;
  nodeLongitudeDeg?: number;
  dashaBalanceYears?: number;
}

export interface BenchmarkTestCase {
  id: string;
  category: BenchmarkCategory;
  description: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm (24-hour)
  latitude: number;
  longitude: number;
  timezone: number; // numeric offset in hours, e.g. 5.5
  timezoneSource: string;
  expectedReferenceSource: string; // e.g. "Swiss Ephemeris v2.10.03 (DE431)", "REFERENCE_PENDING"
  ayanamsha: AyanamshaType;
  nodeMode: LunarNodeMode;
  houseSystem: HouseSystemType;
  expected: BenchmarkExpectedOutputs;
  tolerances: BenchmarkTolerances;
  notes?: string[];
}

export interface MetricComparisonResult {
  metricName: string;
  expected: string | number | ReferencePending;
  actual: string | number | null;
  difference?: number;
  angularDifference?: number;
  tolerance?: number;
  status: EvaluationStatus;
  notes?: string;
}

export interface CaseComparisonResult {
  testCase: BenchmarkTestCase;
  metrics: MetricComparisonResult[];
  overallStatus: EvaluationStatus;
  executionDurationMs: number;
}

export interface BenchmarkRunReport {
  runTimestamp: string;
  engineName: string;
  engineVersion: string;
  referenceSource: string;
  summary: {
    totalCases: number;
    totalMetrics: number;
    passed: number;
    failed: number;
    review: number;
    referencePending: number;
  };
  caseResults: CaseComparisonResult[];
  criticalDiscrepancies: Array<{
    caseId: string;
    category: BenchmarkCategory;
    metricName: string;
    expected: string | number;
    actual: string | number;
    difference: number;
    tolerance: number;
    affectedSubsystem: string;
  }>;
}

