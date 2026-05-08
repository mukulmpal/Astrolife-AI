"use client";

import { calculateAshtakavarga } from "@/lib/astro-engine/ashtakavarga";
import { normalizeChartForTransit } from "@/lib/astro-engine/chart-normalize";
import type { ChartData } from "@/lib/astro-engine/calculations";
import { calculateDestiny } from "@/lib/astro-engine/destiny";
import { calculateDivisional, getDashamshaAnalysis, getNavamshaAnalysis } from "@/lib/astro-engine/divisional";
import { calculateEventRadarReport } from "@/lib/astro-engine/event-radar";
import { generateGemstoneReportFromChart } from "@/lib/astro-engine/gemstone";
import { calculateKpReport } from "@/lib/astro-engine/kp";
import { calculateLalKitab } from "@/lib/astro-engine/lalkitab";
import { calculateMedical } from "@/lib/astro-engine/medical";
import { calculateNumerology } from "@/lib/astro-engine/numerology";
import { calculatePanchang } from "@/lib/astro-engine/panchang";
import { calculatePsychology } from "@/lib/astro-engine/psychology";
import { calculateRemedies } from "@/lib/astro-engine/remedy";
import { calculateSarvatobhadra } from "@/lib/astro-engine/sarvatobhadra";
import { calculateShadbala } from "@/lib/astro-engine/shadbala";
import { calculateSpecialLagnas } from "@/lib/astro-engine/special-lagnas";
import { calculateTransitReport } from "@/lib/astro-engine/transits";
import { calculateVastu } from "@/lib/astro-engine/vastu";

type LineBuilder = () => string | string[] | null | undefined;

function compact(value: unknown, fallback = "Not available") {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function joinItems(items: unknown[], limit = 3) {
  return items.map((item) => compact(item, "")).filter(Boolean).slice(0, limit).join(", ");
}

function activeDasha(chart: ChartData) {
  const md = chart.dashas.find((entry) => entry.active) ?? chart.dashas[0];
  const ad = chart.antardasha.find((entry) => entry.active) ?? chart.antardasha[0];
  return {
    md: md ? `${md.planet} MD (${md.start.getFullYear()}-${md.end.getFullYear()})` : "Unknown MD",
    ad: ad ? `${ad.planet} AD (${ad.start.getFullYear()}-${ad.end.getFullYear()})` : "Unknown AD",
  };
}

function safeLines(title: string, build: LineBuilder) {
  try {
    const result = build();
    const lines = Array.isArray(result) ? result : result ? [result] : [];
    if (!lines.length) return [`${title}: Not enough data.`];
    return lines.map((line) => `${title}: ${line}`);
  } catch (error) {
    console.warn(`AI engine context skipped ${title}:`, error);
    return [`${title}: Engine could not be summarized safely.`];
  }
}

export function buildAiEngineContext(chart: ChartData): string {
  const dasha = activeDasha(chart);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const lines: string[] = [
    "FULL ASTROLIFE ENGINE SUMMARY:",
    `Chart: ${chart.name}, ${chart.dob} ${chart.tob}, ${chart.city}. Lagna ${chart.lagnaRashi}. Moon ${chart.planets.Moon?.sign ?? "unknown"} ${chart.planets.Moon?.nakshatra ?? ""}.`,
    `Dasha: ${dasha.md}; ${dasha.ad}.`,
  ];

  lines.push(...safeLines("Shadbala", () => {
    const s = calculateShadbala(chart.planets);
    const strongest = s.planets.find((planet) => planet.planet === s.strongest);
    const weakest = s.planets.find((planet) => planet.planet === s.weakest);
    return `${s.summary} Strongest ${s.strongest} (${strongest?.percentage ?? "n/a"}%). Weakest ${s.weakest} (${weakest?.percentage ?? "n/a"}%). Avg ${s.avgStrength}%.`;
  }));

  lines.push(...safeLines("Ashtakavarga", () => {
    const a = calculateAshtakavarga(chart.planets, chart.lagnaNum);
    return a.aiContext;
  }));

  lines.push(...safeLines("Lal Kitab", () => {
    const lk = calculateLalKitab(chart.planets, chart.dob);
    const rin = lk.rins.slice(0, 3).map((item) => `${item.planet} H${item.house}: ${item.rin}`).join("; ");
    const upaya = lk.rins.slice(0, 2).map((item) => item.upaya).join("; ");
    return `${lk.summary} Pitra Rin: ${lk.hasPitraRin ? "possible" : "not strongly indicated"}. Top rin: ${rin || "none strong"}. Upaya: ${upaya || "simple discipline and charity"}.`;
  }));

  lines.push(...safeLines("Psychology", () => {
    const p = calculatePsychology(chart.planets);
    const strong = p.planets.filter((item) => item.status === "Strong").slice(0, 3).map((item) => item.planet);
    const weak = p.planets.filter((item) => item.status === "Weak/Blocked").slice(0, 3).map((item) => item.planet);
    return `${p.pattern.name}; anxiety index ${p.pattern.anxietyIdx}. ${p.summary} Strong functions: ${joinItems(strong)}. Sensitive functions: ${joinItems(weak)}.`;
  }));

  lines.push(...safeLines("Destiny", () => {
    const d = calculateDestiny(chart.planets, chart.dashas, chart.dob);
    const strongest = [...d.areas].sort((a, b) => b.score - a.score)[0];
    const weakest = [...d.areas].sort((a, b) => a.score - b.score)[0];
    return `Current score ${d.currentScore}/100 in ${d.currentDasha} MD. Strongest area ${strongest?.name ?? "n/a"} ${strongest?.score ?? ""}. Weakest area ${weakest?.name ?? "n/a"} ${weakest?.score ?? ""}. ${d.summary}`;
  }));

  lines.push(...safeLines("Divisional", () => {
    const divs = calculateDivisional(chart.planets, chart.lagnaNum, chart.lagnaLon);
    const d9 = divs.find((item) => item.key === "D9");
    const d10 = divs.find((item) => item.key === "D10");
    return [
      `D9/Navamsha: ${d9 ? getNavamshaAnalysis(d9).join(" ") : "not available"}`,
      `D10/Dashamsha: ${d10 ? getDashamshaAnalysis(d10).join(" ") : "not available"}`,
    ];
  }));

  lines.push(...safeLines("Special Lagnas", () => {
    const s = calculateSpecialLagnas(chart);
    return s.aiContext;
  }));

  lines.push(...safeLines("KP", () => {
    const kp = calculateKpReport(chart);
    const top = kp.topEventHints.map((item) => `${item.topic}: ${item.note}`).join("; ");
    const forecast = kp.forecast.slice(0, 2).map((item) => `${item.month} ${item.focus} ${item.score}/100`).join("; ");
    const shifted = kp.rows
      .filter((row) => row.name !== "Lagna" && row.bhavaShift !== 0)
      .slice(0, 4)
      .map((row) => `${row.name} Rashi H${row.rashiHouse} -> Bhava H${row.bhavaHouse}`)
      .join("; ");
    const cuspMode = `Cusp source ${kp.input.cuspSource}, house mode ${kp.input.bhavaMode}`;
    return `${cuspMode}. ${shifted ? `Bhava shifts: ${shifted}.` : "No major Bhava Chalit shifts in the top planets."} Top event signals: ${top || "not available"}. Near forecast: ${forecast || "not available"}.`;
  }));

  lines.push(...safeLines("Gemstone", () => {
    const g = generateGemstoneReportFromChart(chart);
    const avoid = g.avoidGemstones.slice(0, 3).map((item) => `${item.gemstone}/${item.planet}`).join(", ");
    return `Primary ${g.primaryGemstone.gemstone} for ${g.primaryGemstone.planet}, score ${g.primaryGemstone.score}/100. Current dasha ${g.currentDasha}. Avoid/caution: ${avoid || "none listed"}. Safety: confirm before wearing expensive stones.`;
  }));

  lines.push(...safeLines("Medical Astrology", () => {
    const m = calculateMedical(chart);
    const alerts = m.alerts
      .slice(0, 4)
      .map((item) => `${item.planet} H${item.house}: ${item.disease} (${item.severity})`);
    const scores = Object.entries(m.scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([key, value]) => `${key} ${value}/100`);
    return `Constitution ${m.lagnaSign}: ${m.prakriti} Top concern zones: ${joinItems(m.topConcerns)}. Risk scores: ${scores.join(", ") || "not elevated"}. Accident risk ${m.accidentRisk}/100. Alerts: ${alerts.join("; ") || "none major"}. Always add soft medical disclaimer.`;
  }));

  lines.push(...safeLines("Remedy Engine", () => {
    const r = calculateRemedies(chart);
    const top = r.cards
      .slice(0, 5)
      .map((item) => `${item.planet} H${item.house} ${item.priority}: ${item.practice}`);
    return `Urgent remedies ${r.urgentCount}. Top priority ${r.topPriority ? `${r.topPriority.planet} H${r.topPriority.house}` : "none"}. Remedies: ${top.join("; ") || "simple daily discipline"}. Prefer affordable behavioural, mantra and charity remedies before costly gemstones.`;
  }));

  lines.push(...safeLines("Sarvatobhadra", () => {
    const s = calculateSarvatobhadra(chart);
    const alerts = s.vedhaAlerts
      .slice(0, 5)
      .map((item) => `${item.planet} on ${item.nakshatra}: ${item.description} (${item.severity})`);
    return `Janma nakshatra ${s.birthNakshatra}. Active vedha alerts ${s.vedhaAlerts.length}. ${alerts.length ? `Vedhas: ${alerts.join("; ")}.` : "No major vedha alerts today."}`;
  }));

  lines.push(...safeLines("Numerology", () => {
    const n = calculateNumerology(chart.name, chart.dob);
    return `Life Path ${n.lifePath.value} (${n.lifePath.archetype}), Destiny ${n.destiny.value}, Personal Year ${n.personalYear.value}. ${n.summary}`;
  }));

  lines.push(...safeLines("Vastu", () => {
    const v = calculateVastu(chart.planets);
    const strong = v.strongZones.slice(0, 3).map((zone) => zone.name);
    const weak = v.weakZones.slice(0, 3).map((zone) => zone.name);
    return `Score ${v.overallScore}/100. Strong zones: ${joinItems(strong)}. Weak zones: ${joinItems(weak)}.`;
  }));

  lines.push(...safeLines("Transit/Event Radar", () => {
    const transitChart = normalizeChartForTransit(chart);
    const transit = calculateTransitReport({ chart: transitChart, base: "moon", date: today });
    const radar = calculateEventRadarReport({ chart: transitChart, startDate: today, days: 7, base: "moon" });
    const topArea = [...transit.areaScores].sort((a, b) => b.score - a.score)[0];
    const cautions = transit.alerts.filter((item) => item.severity === "high" || item.severity === "medium").slice(0, 3).map((item) => item.title);
    return `Current best area ${topArea?.area ?? "n/a"} ${topArea?.score ?? ""}/100. Alerts: ${joinItems(cautions) || "none major"}. Best day ${radar.bestDay.label}; caution day ${radar.cautionDay.label}.`;
  }));

  lines.push(...safeLines("Panchang Today", () => {
    const p = calculatePanchang(today, chart.tz, { lat: chart.lat, lon: chart.lon });
    return p.aiContext;
  }));

  lines.push(
    "Prashna: Use the Prashna engine concept only when the user asks a specific time-bound question. It needs the exact current question moment, topic and location/timezone; do not mix Prashna judgment into general natal answers unless the user asks a Prashna-style question."
  );

  lines.push(
    "Instruction: Use this full engine summary as the complete background map. Do not mention every engine in every answer; synthesize only the relevant signals."
  );

  return lines.join("\n");
}
