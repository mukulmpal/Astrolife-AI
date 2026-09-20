/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================================================
 * ASTROLIFE BENCHMARK HARNESS — TEST RUNNER
 * ============================================================================
 * Executes the actual AstroLife calculation engines against the defined benchmark
 * test cases and generates DIFFERENCE_REPORT.md.
 *
 * Usage:
 *   node --import jiti/register scripts/benchmarks/runner.ts
 * ============================================================================
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as calculationsModule from "../../src/lib/astro-engine/calculations";
import * as panchangModule from "../../src/lib/astro-engine/panchang";
import { BENCHMARK_TEST_CASES } from "./cases";
import {
  compareAngularMetric,
  compareCategoricalMetric,
  compareScalarMetric,
} from "./comparator";
import { generateDifferenceReportMarkdown } from "./report";
import type {
  BenchmarkRunReport,
  BenchmarkTestCase,
  CaseComparisonResult,
  EvaluationStatus,
  MetricComparisonResult,
} from "./schema";

// Robust interop resolution across TS module loaders (jiti, tsx, node-esm)
const calculateChart =
  (calculationsModule as any).calculateChart ??
  (calculationsModule as any).default?.calculateChart;

const calculatePanchang =
  (panchangModule as any).calculatePanchang ??
  (panchangModule as any).default?.calculatePanchang;

export function runSingleTestCase(testCase: BenchmarkTestCase): CaseComparisonResult {
  const startTime = Date.now();
  const metrics: MetricComparisonResult[] = [];

  try {
    // Execute actual AstroLife calculation
    const chart = calculateChart(
      `Benchmark-${testCase.id}`,
      testCase.birthDate,
      testCase.birthTime,
      "CustomCity",
      testCase.latitude,
      testCase.longitude,
      testCase.timezone
    );

    const panchangDate = new Date(`${testCase.birthDate}T12:00:00Z`);
    const panchang = calculatePanchang(panchangDate, testCase.timezone, {
      lat: testCase.latitude,
      lon: testCase.longitude,
    });

    // 1. Sun Longitude
    if (testCase.expected.sunLongitude !== undefined) {
      metrics.push(
        compareAngularMetric(
          "Sun Longitude",
          chart.planets.Sun?.lon,
          testCase.expected.sunLongitude,
          testCase.tolerances.planetaryLongitudeDeg ?? 0.01
        )
      );
    }

    // 2. Moon Longitude
    if (testCase.expected.moonLongitude !== undefined) {
      metrics.push(
        compareAngularMetric(
          "Moon Longitude",
          chart.planets.Moon?.lon,
          testCase.expected.moonLongitude,
          testCase.tolerances.planetaryLongitudeDeg ?? 0.01
        )
      );
    }

    // 3. Ascendant
    if (testCase.expected.ascendant !== undefined) {
      metrics.push(
        compareAngularMetric(
          "Ascendant (Lagna)",
          chart.lagnaLon,
          testCase.expected.ascendant,
          testCase.tolerances.ascendantLongitudeDeg ?? 0.02
        )
      );
    }

    // 4. Planet Longitudes (Mars, Mercury, Jupiter, Venus, Saturn)
    if (testCase.expected.planetLongitudes) {
      for (const [planet, expectedLon] of Object.entries(testCase.expected.planetLongitudes)) {
        metrics.push(
          compareAngularMetric(
            `${planet} Longitude`,
            chart.planets[planet]?.lon,
            expectedLon,
            testCase.tolerances.planetaryLongitudeDeg ?? 0.01
          )
        );
      }
    }

    // 5. Lunar Nodes (Rahu / Ketu)
    if (testCase.expected.rahuLongitude !== undefined) {
      metrics.push(
        compareAngularMetric(
          "Rahu Longitude",
          chart.planets.Rahu?.lon,
          testCase.expected.rahuLongitude,
          testCase.tolerances.nodeLongitudeDeg ?? 0.01
        )
      );
    }

    if (testCase.expected.ketuLongitude !== undefined) {
      metrics.push(
        compareAngularMetric(
          "Ketu Longitude",
          chart.planets.Ketu?.lon,
          testCase.expected.ketuLongitude,
          testCase.tolerances.nodeLongitudeDeg ?? 0.01
        )
      );
    }

    // 6. House Cusps
    if (testCase.expected.houseCusps) {
      for (const expectedCusp of testCase.expected.houseCusps) {
        const cuspsList = chart.houseCusps as Array<{ house: number; lon: number }> | undefined;
        const actualCusp = cuspsList?.find((h: { house: number; lon: number }) => h.house === expectedCusp.house);
        metrics.push(
          compareAngularMetric(
            `House ${expectedCusp.house} Cusp`,
            actualCusp?.lon,
            expectedCusp.longitude,
            testCase.tolerances.houseCuspLongitudeDeg ?? 0.02
          )
        );
      }
    }

    // 7. Nakshatra & Pada
    if (testCase.expected.nakshatra !== undefined) {
      metrics.push(
        compareCategoricalMetric(
          "Moon Nakshatra",
          chart.planets.Moon?.nakshatra,
          testCase.expected.nakshatra
        )
      );
    }

    if (testCase.expected.nakshatraPada !== undefined) {
      metrics.push(
        compareCategoricalMetric(
          "Moon Nakshatra Pada",
          chart.planets.Moon?.pada,
          testCase.expected.nakshatraPada
        )
      );
    }

    // 8. Tithi, Yoga, Karana
    if (testCase.expected.tithi !== undefined) {
      metrics.push(
        compareCategoricalMetric(
          "Panchang Tithi",
          panchang.tithi,
          testCase.expected.tithi
        )
      );
    }

    if (testCase.expected.yoga !== undefined) {
      metrics.push(
        compareCategoricalMetric(
          "Panchang Yoga",
          panchang.yoga,
          testCase.expected.yoga
        )
      );
    }

    if (testCase.expected.karana !== undefined) {
      metrics.push(
        compareCategoricalMetric(
          "Panchang Karana",
          panchang.karana,
          testCase.expected.karana
        )
      );
    }

    // 9. Dasha Balance Years
    if (testCase.expected.dashaBalanceYears !== undefined) {
      const firstDasha = chart.dashas?.[0];
      metrics.push(
        compareScalarMetric(
          "Initial Dasha Balance (Years)",
          firstDasha?.yrs,
          testCase.expected.dashaBalanceYears,
          testCase.tolerances.dashaBalanceYears ?? 0.05
        )
      );
    }

    // 10. Navamsha Placements
    if (testCase.expected.vargaPlacements) {
      for (const varga of testCase.expected.vargaPlacements) {
        if (varga.varga === "D9") {
          const actualD9Sign = chart.planets[varga.planet]?.navamsha;
          metrics.push(
            compareCategoricalMetric(
              `${varga.planet} D9 Navamsha Sign`,
              actualD9Sign,
              varga.sign
            )
          );
        }
      }
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    metrics.push({
      metricName: "Engine Execution",
      actual: "CRASH",
      expected: "SUCCESS",
      status: "FAIL",
      notes: `Engine threw an unhandled exception: ${errorMsg}`,
    });
  }

  const duration = Date.now() - startTime;

  // Determine overall case status
  let overallStatus: EvaluationStatus = "PASS";
  if (metrics.some((m) => m.status === "FAIL")) {
    overallStatus = "FAIL";
  } else if (metrics.some((m) => m.status === "REVIEW")) {
    overallStatus = "REVIEW";
  } else if (metrics.every((m) => m.status === "REFERENCE_PENDING")) {
    overallStatus = "REFERENCE_PENDING";
  }

  return {
    testCase,
    metrics,
    overallStatus,
    executionDurationMs: duration,
  };
}

export function runAllBenchmarks(): BenchmarkRunReport {
  const runTimestamp = new Date().toISOString();
  const caseResults: CaseComparisonResult[] = [];
  const criticalDiscrepancies: BenchmarkRunReport["criticalDiscrepancies"] = [];

  let totalMetrics = 0;
  let passed = 0;
  let failed = 0;
  let review = 0;
  let referencePending = 0;

  for (const testCase of BENCHMARK_TEST_CASES) {
    const result = runSingleTestCase(testCase);
    caseResults.push(result);

    for (const m of result.metrics) {
      totalMetrics += 1;
      if (m.status === "PASS") passed += 1;
      else if (m.status === "FAIL") {
        failed += 1;
        criticalDiscrepancies.push({
          caseId: testCase.id,
          category: testCase.category,
          metricName: m.metricName,
          expected: m.expected,
          actual: m.actual ?? "NULL",
          difference: m.difference ?? 999,
          tolerance: m.tolerance ?? 0,
          affectedSubsystem: m.metricName.includes("Longitude")
            ? "Ephemeris / Celestial Math"
            : m.metricName.includes("Lagna") || m.metricName.includes("Ascendant")
              ? "Ascendant / Sidereal Time"
              : m.metricName.includes("Cusp")
                ? "House System"
                : m.metricName.includes("Dasha")
                  ? "Vimshottari Engine"
                  : "General Subsystem",
        });
      } else if (m.status === "REVIEW") {
        review += 1;
      } else if (m.status === "REFERENCE_PENDING") {
        referencePending += 1;
      }
    }
  }

  const report: BenchmarkRunReport = {
    runTimestamp,
    engineName: "AstroLife Calculation Engine (calculations.ts)",
    engineVersion: "3.0.0-moshier",
    referenceSource: "Swiss Ephemeris v2.10.03 (DE431) [BASELINE PENDING]",
    summary: {
      totalCases: BENCHMARK_TEST_CASES.length,
      totalMetrics,
      passed,
      failed,
      review,
      referencePending,
    },
    caseResults,
    criticalDiscrepancies,
  };

  return report;
}

// Direct CLI entrypoint
if (process.argv[1]?.endsWith("runner.ts")) {
  console.log("\n=======================================================");
  console.log("   ASTROLIFE BENCHMARK HARNESS — PHASE 1 EXECUTION");
  console.log("=======================================================\n");

  const report = runAllBenchmarks();
  const markdown = generateDifferenceReportMarkdown(report);

  // Write DIFFERENCE_REPORT.md in root
  const rootReportPath = path.resolve(process.cwd(), "DIFFERENCE_REPORT.md");
  fs.writeFileSync(rootReportPath, markdown, "utf-8");
  console.log(`[✓] Generated: ${rootReportPath}`);

  // Write in output folder as well
  const outputDir = path.resolve(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const timestampedPath = path.join(outputDir, `benchmark-run-${Date.now()}.json`);
  fs.writeFileSync(timestampedPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`[✓] Raw JSON output saved to: ${timestampedPath}`);

  console.log("\n--- BENCHMARK RUN SUMMARY ---");
  console.log(`Total Cases:            ${report.summary.totalCases}`);
  console.log(`Total Metrics:          ${report.summary.totalMetrics}`);
  console.log(`Passed:                 ${report.summary.passed}`);
  console.log(`Failed:                 ${report.summary.failed}`);
  console.log(`In Review:              ${report.summary.review}`);
  console.log(`Reference Pending:      ${report.summary.referencePending}`);
  console.log("-----------------------------\n");
}
