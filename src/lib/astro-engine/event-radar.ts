// src/lib/astro-engine/event-radar.ts

import {
    calculateTransitReport,
    NatalChartForTransit,
    TransitAreaScore,
    TransitAlert,
    TransitBase,
  } from "./transits";
import { assertEventRadarReportContract } from "./contracts";
  
  export type EventRadarArea =
    | "career"
    | "love"
    | "money"
    | "health"
    | "family"
    | "spirituality";
  
  export type EventRadarSignal =
    | "excellent"
    | "good"
    | "mixed"
    | "caution"
    | "sensitive";
  
  export interface EventRadarDay {
    date: string;
    weekday: string;
    label: string;
    overallScore: number;
    signal: EventRadarSignal;
    bestArea: EventRadarArea;
    cautionArea: EventRadarArea;
    areaScores: TransitAreaScore[];
    topAlerts: TransitAlert[];
    opportunities: TransitAlert[];
    scoreRationale: string[];
    advice: string;
    remedy: string;
    aiContext: string;
  }
  
  export interface EventRadarReport {
    generatedAt: string;
    base: TransitBase;
    days: EventRadarDay[];
    bestDay: EventRadarDay;
    cautionDay: EventRadarDay;
    summary: string;
    aiContext: string;
  }
  
  function formatDateLabel(date: Date): string {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }
  
  function formatWeekday(date: Date): string {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
    });
  }
  
  function clamp(value: number, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }
  
  function getSignal(score: number): EventRadarSignal {
    if (score >= 76) return "excellent";
    if (score >= 62) return "good";
    if (score >= 45) return "mixed";
    if (score >= 30) return "caution";
    return "sensitive";
  }
  
  function getSignalAdvice(signal: EventRadarSignal, bestArea: EventRadarArea) {
    if (signal === "excellent") {
      return `Strong day. Take bold action in ${bestArea}, pitch ideas, start important work, or make a clear decision.`;
    }
  
    if (signal === "good") {
      return `Supportive day. Move steadily in ${bestArea}, but avoid overconfidence.`;
    }
  
    if (signal === "mixed") {
      return `Balanced day. Good for planning, review and moderate action. Avoid extreme decisions.`;
    }
  
    if (signal === "caution") {
      return `Caution day. Slow down, double-check commitments, and avoid emotional or impulsive decisions.`;
    }
  
    return `Sensitive day. Keep schedule light, rest more, avoid conflict, and focus on remedies or inner clarity.`;
  }
  
  function getRemedy(signal: EventRadarSignal, alerts: TransitAlert[]) {
    const hasSaturn = alerts.some((a) => a.planets.includes("Saturn"));
    const hasMars = alerts.some((a) => a.planets.includes("Mars"));
    const hasRahu = alerts.some((a) => a.planets.includes("Rahu"));
    const hasMoon = alerts.some((a) => a.planets.includes("Moon"));
  
    if (hasSaturn) {
      return "Offer sesame oil diya or donate black sesame/food to needy. Practice patience and discipline.";
    }
  
    if (hasMars) {
      return "Avoid anger, drive carefully, chant Hanuman Chalisa or do physical exercise calmly.";
    }
  
    if (hasRahu) {
      return "Avoid confusion, addiction, overthinking and risky shortcuts. Feed stray dogs or meditate for grounding.";
    }
  
    if (hasMoon) {
      return "Keep emotional calm, hydrate well, call family, and chant Om Som Somaya Namah.";
    }
  
    if (signal === "excellent" || signal === "good") {
      return "Use the day actively. Offer gratitude, start with prayer, and take practical action.";
    }
  
    return "Keep actions simple. Light a diya, avoid arguments, and sleep on time.";
  }
  
  function averageAreaScore(areaScores: TransitAreaScore[]) {
    if (!areaScores.length) return 50;
  
    const total = areaScores.reduce((sum, area) => sum + area.score, 0);
    return Math.round(total / areaScores.length);
  }
  
  function getBestArea(areaScores: TransitAreaScore[]): EventRadarArea {
    const sorted = [...areaScores].sort((a, b) => b.score - a.score);
    return sorted[0]?.area ?? "career";
  }
  
  function getCautionArea(areaScores: TransitAreaScore[]): EventRadarArea {
    const sorted = [...areaScores].sort((a, b) => a.score - b.score);
    return sorted[0]?.area ?? "health";
  }
  
  function moonDailyBoost(dayIndex: number) {
    // Artificial smoothing based on Moon-like daily rhythm.
    // This makes 7-day radar more usable because slow planets do not change much daily.
    const cycle = [2, 5, 8, 12, 9, 6, 3];
    return cycle[dayIndex % cycle.length];
  }
  
  function normalizeOverallScore(params: {
    rawAverage: number;
    highAlerts: number;
    mediumAlerts: number;
    opportunities: number;
    dayIndex: number;
  }) {
    const { rawAverage, highAlerts, mediumAlerts, opportunities, dayIndex } = params;
  
    // Pull very low averages closer to practical user-facing range.
    // Example: raw 35 becomes around 47, not instantly "Sensitive".
    let score = 50 + (rawAverage - 50) * 0.65;
  
    // Softer penalties. Earlier penalties were too harsh.
    score -= highAlerts * 4;
    score -= mediumAlerts * 2;
  
    // Opportunities should visibly improve the day.
    score += opportunities * 5;
  
    // Moon-style daily rhythm for better 7-day variation.
    score += moonDailyBoost(dayIndex);
  
    return Math.round(clamp(score));
  }

  function buildScoreRationale(params: {
    rawAverage: number;
    highAlerts: number;
    mediumAlerts: number;
    opportunities: number;
    dayIndex: number;
    bestArea: EventRadarArea;
    cautionArea: EventRadarArea;
  }) {
    const rationale = [
      `Area average starts at ${params.rawAverage}/100; strongest area is ${params.bestArea}.`,
      `${params.highAlerts} high and ${params.mediumAlerts} medium caution alerts adjusted the score.`,
      `${params.opportunities} opportunity signals plus daily Moon rhythm added usable variation.`,
    ];

    if (params.bestArea !== params.cautionArea) {
      rationale.push(`Use ${params.bestArea} for action and keep ${params.cautionArea} lighter.`);
    }

    if (params.dayIndex === 0) {
      rationale.push("Today is weighted as the practical anchor for immediate planning.");
    }

    return rationale;
  }
  
  function buildDayAiContext(day: EventRadarDay) {
    const areaLines = day.areaScores
      .map((area) => `${area.area}: ${area.score}/100 — ${area.summary}`)
      .join("\n");
  
    const alertLines = day.topAlerts.length
      ? day.topAlerts
          .map(
            (alert) =>
              `${alert.severity.toUpperCase()}: ${alert.title} — ${alert.description}`
          )
          .join("\n")
      : "No major caution alert.";
  
    const opportunityLines = day.opportunities.length
      ? day.opportunities
          .map((alert) => `${alert.title} — ${alert.description}`)
          .join("\n")
      : "No major opportunity alert.";
  
    return `
  Event Radar Day: ${day.label} (${day.weekday})
  Overall Score: ${day.overallScore}/100
  Signal: ${day.signal}
  Best Area: ${day.bestArea}
  Caution Area: ${day.cautionArea}
  
  Area Scores:
  ${areaLines}
  
  Caution Alerts:
  ${alertLines}
  
  Opportunities:
  ${opportunityLines}
  
  Advice:
  ${day.advice}
  
  Remedy:
  ${day.remedy}

  Score Rationale:
  ${day.scoreRationale.join("\n")}
  `.trim();
  }
  
  function buildSummary(days: EventRadarDay[]) {
    const bestDay = [...days].sort((a, b) => b.overallScore - a.overallScore)[0];
    const cautionDay = [...days].sort((a, b) => a.overallScore - b.overallScore)[0];
  
    return `Best upcoming day is ${bestDay.label} for ${bestDay.bestArea}. Most sensitive day is ${cautionDay.label}, especially for ${cautionDay.cautionArea}. Use strong days for action and sensitive days for review, patience and remedies.`;
  }
  
  export function calculateEventRadarReport(params: {
    chart: NatalChartForTransit;
    startDate?: Date;
    days?: number;
    base?: TransitBase;
  }): EventRadarReport {
    const startDate = params.startDate ?? new Date();
    const totalDays = params.days ?? 7;
    const base = params.base ?? "moon";
  
    const radarDays: EventRadarDay[] = [];
  
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      date.setHours(12, 0, 0, 0);
  
      const transit = calculateTransitReport({
        chart: params.chart,
        date,
        base,
      });
  
      const cautionAlerts = transit.alerts
        .filter((alert) => alert.severity === "high" || alert.severity === "medium")
        .slice(0, 3);
  
      const opportunities = transit.alerts
        .filter((alert) => alert.type === "opportunity")
        .slice(0, 3);
  
      const highAlerts = cautionAlerts.filter((a) => a.severity === "high").length;
      const mediumAlerts = cautionAlerts.filter((a) => a.severity === "medium").length;
  
      const rawAverage = averageAreaScore(transit.areaScores);
  
      const overallScore = normalizeOverallScore({
        rawAverage,
        highAlerts,
        mediumAlerts,
        opportunities: opportunities.length,
        dayIndex: i,
      });
  
      const bestArea = getBestArea(transit.areaScores);
      const cautionArea = getCautionArea(transit.areaScores);
      const signal = getSignal(overallScore);
      const advice = getSignalAdvice(signal, bestArea);
      const remedy = getRemedy(signal, cautionAlerts);
      const scoreRationale = buildScoreRationale({
        rawAverage,
        highAlerts,
        mediumAlerts,
        opportunities: opportunities.length,
        dayIndex: i,
        bestArea,
        cautionArea,
      });
  
      const day: EventRadarDay = {
        date: date.toISOString(),
        weekday: formatWeekday(date),
        label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : formatDateLabel(date),
        overallScore,
        signal,
        bestArea,
        cautionArea,
        areaScores: transit.areaScores,
        topAlerts: cautionAlerts,
        opportunities,
        scoreRationale,
        advice,
        remedy,
        aiContext: "",
      };
  
      day.aiContext = buildDayAiContext(day);
      radarDays.push(day);
    }
  
    const bestDay = [...radarDays].sort((a, b) => b.overallScore - a.overallScore)[0];
    const cautionDay = [...radarDays].sort((a, b) => a.overallScore - b.overallScore)[0];
    const summary = buildSummary(radarDays);
  
    const report = {
      generatedAt: new Date().toISOString(),
      base,
      days: radarDays,
      bestDay,
      cautionDay,
      summary,
      aiContext: `
  Event Radar Report
  Base: ${base}
  Summary: ${summary}
  
  Days:
  ${radarDays.map((day) => day.aiContext).join("\n\n---\n\n")}
  `.trim(),
    };
    assertEventRadarReportContract(report);
    return report;
  }
