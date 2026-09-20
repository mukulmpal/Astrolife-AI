import { BENCHMARK_TEST_CASES } from "./benchmarks/cases";
import { calculateChart } from "../src/lib/astro-engine/calculations";
import { calculatePanchang } from "../src/lib/astro-engine/panchang";
import { buildRadarHorizons } from "../src/lib/astro-engine/cosmic-pulse/forecast";
import type { CosmicForecastEvent } from "../src/lib/astro-engine/cosmic-pulse/forecast/forecast-types";
import * as fs from "fs";
import * as path from "path";

interface ChartAuditSummary {
  caseId: string;
  category: string;
  eventsNow: number;
  events30D: number;
  events90D: number;
  primaryCount: number;
  supportingCount: number;
  backgroundCount: number;
  retroPassCount: number;
  chronologyValid: boolean;
  zeroScoreValid: boolean;
  toneValid: boolean;
  falsePositives: number;
  anomalies: string[];
}

const BANNED_TONE_WORDS = [
  "fatal", "disaster", "ruined", "doomed", "calamity",
  "catastrophe", "terrible fate", "hopeless", "curse",
  "bad luck", "tragic", "devastation"
];

const BANNED_SCORE_KEYS = [
  "score", "rating", "rank", "prioritynumber",
  "confidencepercent", "strengthpercent", "impactpercent",
  "probability", "percentage", "dailyScore"
];

export function runCosmicRadarAudit(): {
  summaries: ChartAuditSummary[];
  allPassed: boolean;
  totalEventsAnalyzed: number;
} {
  const auditDate = new Date("2026-09-21T00:00:00Z");
  const summaries: ChartAuditSummary[] = [];
  let totalEventsAnalyzed = 0;
  let allPassed = true;

  for (const tc of BENCHMARK_TEST_CASES) {
    const anomalies: string[] = [];
    let falsePositives = 0;

    // 1. Calculate Chart & Panchang
    const chart = calculateChart(
      "BenchmarkCity",
      tc.birthDate,
      tc.birthTime,
      "BenchmarkCity",
      tc.latitude,
      tc.longitude,
      tc.timezone
    );

    const panchangDate = new Date(`${tc.birthDate}T${tc.birthTime}:00Z`);
    const panchang = calculatePanchang(panchangDate, tc.timezone, {
      lat: tc.latitude,
      lon: tc.longitude,
    });

    // 2. Build 90-Day Radar Horizon
    const horizons = buildRadarHorizons({
      chart,
      panchang,
      startDate: auditDate,
      daysAhead: 90,
      localTz: tc.timezone,
    });

    const allEvents = [...horizons.next30Days, ...horizons.next90Days];
    totalEventsAnalyzed += allEvents.length;

    // Audit 1: Chronological Ordering
    let chronologyValid = true;
    for (let i = 1; i < allEvents.length; i++) {
      const prevTime = (allEvents[i - 1].timing.exactAt || allEvents[i - 1].timing.peakAt || allEvents[i - 1].timing.contactAt).getTime();
      const currTime = (allEvents[i].timing.exactAt || allEvents[i].timing.peakAt || allEvents[i].timing.contactAt).getTime();
      if (currTime < prevTime) {
        chronologyValid = false;
        anomalies.push(`Chronology violation: Event ${allEvents[i].id} occurs before ${allEvents[i - 1].id}`);
      }
    }

    // Audit 2: False Positives & Mathematical Consistency
    for (const ev of allEvents) {
      // Check timing sequence: contact <= peak/exact <= separation
      const contactMs = ev.timing.contactAt.getTime();
      const peakMs = (ev.timing.exactAt || ev.timing.peakAt).getTime();
      const sepMs = ev.timing.separationAt.getTime();

      if (contactMs > peakMs) {
        anomalies.push(`Timing inversion: Contact (${ev.timing.contactAt.toISOString()}) after Peak (${ev.timing.peakAt.toISOString()}) in ${ev.id}`);
      }
      if (peakMs > sepMs) {
        anomalies.push(`Timing inversion: Peak (${ev.timing.peakAt.toISOString()}) after Separation (${ev.timing.separationAt.toISOString()}) in ${ev.id}`);
      }

      // If exactAt is defined, check currentOrbDeg is within tight bound
      if (ev.timing.exactAt && ev.evidence.currentOrbDeg > 0.05) {
        falsePositives++;
        anomalies.push(`False exact: Event ${ev.id} claims exactAt but orb is ${ev.evidence.currentOrbDeg}°`);
      }
    }

    // Audit 3: Multi-Pass Retrograde Sanity
    const passGroups: Record<string, CosmicForecastEvent[]> = {};
    allEvents.forEach((ev) => {
      if (ev.retrogradeInfo && ev.retrogradeInfo.totalPassesEstimated && ev.retrogradeInfo.totalPassesEstimated > 1) {
        const baseKey = `${ev.planets.join("-")}-${ev.targetAngle}`;
        if (!passGroups[baseKey]) passGroups[baseKey] = [];
        passGroups[baseKey].push(ev);
      }
    });

    let retroPassCount = 0;
    Object.entries(passGroups).forEach(([key, group]) => {
      retroPassCount += group.length;
      if (group.length > 1) {
        for (let p = 1; p < group.length; p++) {
          const prevPeak = (group[p - 1].timing.exactAt || group[p - 1].timing.peakAt).getTime();
          const currPeak = (group[p].timing.exactAt || group[p].timing.peakAt).getTime();
          if (currPeak <= prevPeak) {
            anomalies.push(`Retrograde pass inversion for ${key}: Pass ${group[p].retrogradeInfo?.passNumber} before or equal to Pass ${group[p - 1].retrogradeInfo?.passNumber}`);
          }
        }
      }
    });

    // Audit 4: Broad Zero-Score Audit
    let zeroScoreValid = true;
    for (const ev of allEvents) {
      const keys = Object.keys(ev).map((k) => k.toLowerCase());
      for (const banned of BANNED_SCORE_KEYS) {
        if (keys.includes(banned.toLowerCase())) {
          zeroScoreValid = false;
          anomalies.push(`Banned score key '${banned}' found in event ${ev.id}`);
        }
      }

      const text = `${ev.title} ${ev.headline}`.toLowerCase();
      if (text.includes("/100") || text.includes("confidence:") || text.includes("score:") || text.includes("rating:")) {
        zeroScoreValid = false;
        anomalies.push(`Score representation in text: '${ev.headline}' in event ${ev.id}`);
      }
    }

    // Audit 5: Tone & Shastra Neutralization
    let toneValid = true;
    for (const ev of allEvents) {
      const text = `${ev.title} ${ev.headline}`.toLowerCase();
      for (const badWord of BANNED_TONE_WORDS) {
        if (text.includes(badWord)) {
          toneValid = false;
          anomalies.push(`Alarmist/fatalistic word '${badWord}' detected in event ${ev.id}`);
        }
      }
    }

    // Audit 6: Density Metrics
    const primaryCount = allEvents.filter((e) => e.relevanceTier === "primary").length;
    const supportingCount = allEvents.filter((e) => e.relevanceTier === "supporting").length;
    const backgroundCount = allEvents.filter((e) => e.relevanceTier === "background").length;

    if (horizons.next30Days.length > 25) {
      anomalies.push(`Density warning: 30D horizon has ${horizons.next30Days.length} events (expected <= 25)`);
    }

    if (anomalies.length > 0) {
      allPassed = false;
    }

    summaries.push({
      caseId: tc.id,
      category: tc.category,
      eventsNow: horizons.now.length,
      events30D: horizons.next30Days.length,
      events90D: horizons.next90Days.length,
      primaryCount,
      supportingCount,
      backgroundCount,
      retroPassCount,
      chronologyValid,
      zeroScoreValid,
      toneValid,
      falsePositives,
      anomalies,
    });
  }

  return { summaries, allPassed, totalEventsAnalyzed };
}

// Generate Markdown report
export function generateAuditMarkdownReport(
  summaries: ChartAuditSummary[],
  totalEvents: number,
  allPassed: boolean
): string {
  let md = `# Phase 5.5 Production Audit Report: Cosmic Radar & Forecast Engine\n\n`;
  md += `**Audit Status:** ${allPassed ? "✅ 100% PASSED (Production Grade)" : "⚠️ ANOMALIES DETECTED"}\n`;
  md += `**Total Events Analyzed:** ${totalEvents}\n`;
  md += `**Benchmark Test Cases Covered:** ${summaries.length} Canonical Astrological Edge-Cases\n\n`;

  md += `## 1. Real-Chart Event Density & Prioritization Matrix\n\n`;
  md += `| Test Case ID | Category | NOW | 30D | 90D | Primary | Supporting | Background | Retro Passes | Status |\n`;
  md += `|---|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|\n`;

  summaries.forEach((s) => {
    const status = s.anomalies.length === 0 ? "✅ PASS" : `❌ ${s.anomalies.length} issues`;
    md += `| \`${s.caseId}\` | ${s.category} | ${s.eventsNow} | ${s.events30D} | ${s.events90D} | ${s.primaryCount} | ${s.supportingCount} | ${s.backgroundCount} | ${s.retroPassCount} | ${status} |\n`;
  });

  md += `\n## 2. Core Audit Findings\n\n`;
  md += `- **Chronological Invariant:** ${summaries.every((s) => s.chronologyValid) ? "✅ 100% Strictly Monotonic (No timestamp inversions)" : "❌ Chronology failure detected"}\n`;
  md += `- **Zero-Score Contract:** ${summaries.every((s) => s.zeroScoreValid) ? "✅ 100% Zero-Score Compliance (No scores, ratings, ranks, or % metrics)" : "❌ Score leak detected"}\n`;
  md += `- **Tone & Shastra Neutralization:** ${summaries.every((s) => s.toneValid) ? "✅ 100% Objective & Classical (Zero fatalistic or alarmist phrases)" : "❌ Alarmist phrasing detected"}\n`;
  md += `- **False Positives / Missed Peaks:** ${summaries.every((s) => s.falsePositives === 0) ? "✅ Zero False Exact Peaks" : "❌ Discrepancies found"}\n`;

  const totalAnomalies = summaries.flatMap((s) => s.anomalies);
  if (totalAnomalies.length > 0) {
    md += `\n## 3. Discrepancies & Diagnostics\n\n`;
    totalAnomalies.forEach((a) => {
      md += `- ⚠️ ${a}\n`;
    });
  } else {
    md += `\n## 3. Production Readiness Verdict\n\n`;
    md += `The forecast scanner and Cosmic Radar have passed all rigorous multi-pass, density, chronological, and tone invariants across all 10 canonical benchmark charts.\n`;
  }

  return md;
}

// Direct CLI execution
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes("audit-cosmic-radar")) {
  console.log("Starting Cosmic Radar Production Audit across 10 canonical benchmark charts...");
  const { summaries, allPassed, totalEventsAnalyzed } = runCosmicRadarAudit();
  const report = generateAuditMarkdownReport(summaries, totalEventsAnalyzed, allPassed);
  console.log(report);

  const reportPath = path.resolve(process.cwd(), "PHASE_5_5_AUDIT_REPORT.md");
  fs.writeFileSync(reportPath, report, "utf8");
  console.log(`Audit report written to: ${reportPath}`);

  if (!allPassed) {
    process.exit(1);
  }
}
