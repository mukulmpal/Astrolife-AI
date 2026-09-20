/**
 * ============================================================================
 * ASTROLIFE BENCHMARK HARNESS — REPORT GENERATOR
 * ============================================================================
 * Formats benchmark comparison results into markdown (DIFFERENCE_REPORT.md)
 * and structured summary reports.
 * ============================================================================
 */

import type { BenchmarkRunReport } from "./schema";

export function generateDifferenceReportMarkdown(report: BenchmarkRunReport): string {
  const { runTimestamp, engineName, engineVersion, referenceSource, summary, caseResults, criticalDiscrepancies } = report;

  const lines: string[] = [];

  lines.push("# AstroLife Calculation Benchmark — Difference Report");
  lines.push("");
  lines.push(`**Run:** ${runTimestamp}`);
  lines.push(`**Engine:** ${engineName} v${engineVersion}`);
  lines.push(`**Reference Source:** ${referenceSource}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Total Test Cases:** ${summary.totalCases}`);
  lines.push(`- **Total Evaluated Metrics:** ${summary.totalMetrics}`);
  lines.push(`- **Passed:** ${summary.passed}`);
  lines.push(`- **Failed:** ${summary.failed}`);
  lines.push(`- **Review:** ${summary.review}`);
  lines.push(`- **Reference Pending:** ${summary.referencePending}`);
  lines.push("");

  const passRate = summary.totalMetrics > 0
    ? ((summary.passed / (summary.totalMetrics - summary.referencePending || 1)) * 100).toFixed(1)
    : "0.0";
  lines.push(`> **Verified Metric Pass Rate:** ${summary.passed + summary.failed > 0 ? passRate + "%" : "Pending Reference Baselines"}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Case Results");
  lines.push("");
  lines.push("| Case ID | Category | Metric | Expected | Actual | Difference | Tolerance | Status |");
  lines.push("|---|---|---|---|---|---|---|---|");

  for (const c of caseResults) {
    for (const m of c.metrics) {
      const diffStr = m.angularDifference !== undefined
        ? `${m.angularDifference.toFixed(4)}°`
        : m.difference !== undefined
          ? `${m.difference.toFixed(4)}`
          : "—";

      const tolStr = m.tolerance !== undefined
        ? m.angularDifference !== undefined
          ? `${m.tolerance}°`
          : `${m.tolerance}`
        : "—";

      const expectedStr = m.expected === "REFERENCE_PENDING"
        ? "PENDING"
        : typeof m.expected === "number"
          ? `${m.expected.toFixed(4)}`
          : String(m.expected);

      const actualStr = m.actual !== null
        ? typeof m.actual === "number"
          ? `${m.actual.toFixed(4)}`
          : String(m.actual)
        : "NULL";

      const statusBadge =
        m.status === "PASS"
          ? "✅ PASS"
          : m.status === "FAIL"
            ? "❌ FAIL"
            : m.status === "REVIEW"
              ? "⚠️ REVIEW"
              : "⏳ PENDING";

      lines.push(`| \`${c.testCase.id}\` | \`${c.testCase.category}\` | ${m.metricName} | ${expectedStr} | ${actualStr} | ${diffStr} | ${tolStr} | ${statusBadge} |`);
    }
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Critical Discrepancies");
  lines.push("");

  if (criticalDiscrepancies.length === 0) {
    lines.push("_No critical discrepancies detected above allowable thresholds._");
  } else {
    for (const d of criticalDiscrepancies) {
      lines.push(`### Discrepancy: \`${d.caseId}\` — ${d.metricName}`);
      lines.push(`- **Category:** \`${d.category}\``);
      lines.push(`- **Affected Subsystem:** ${d.affectedSubsystem}`);
      lines.push(`- **Expected (Reference):** \`${d.expected}\``);
      lines.push(`- **Actual (AstroLife):** \`${d.actual}\``);
      lines.push(`- **Difference:** \`${d.difference.toFixed(6)}\``);
      lines.push(`- **Allowable Tolerance:** \`${d.tolerance}\``);
      lines.push("");
    }
  }

  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("## Governance Note");
  lines.push("");
  lines.push("Per AstroLife Engineering Constitution: Discrepancies between engines do not automatically declare either engine 'correct'. The benchmark identifies variance; engineering investigation determines the root cause (e.g. nutation terms, planetary aberration, true vs mean node series, topocentric parallax, or historical timezone definitions).");
  lines.push("");

  return lines.join("\n");
}

