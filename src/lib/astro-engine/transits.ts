import { assertTransitReportContract } from "./contracts";
import {
  PLANETS as CORE_PLANETS,
  RASHIS_EN,
  runTransitEngine,
  type NatalChartInput,
  type TransitBase,
} from "./transit";

export type { TransitBase };

export type PlanetName =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

export type TransitEffect = "favorable" | "caution" | "neutral";

export interface NatalPlanet {
  longitude?: number;
  rashi: number;
  house: number;
  rashiName?: string;
  nakshatra?: string;
  retrograde?: boolean;
}

export interface NatalChartForTransit {
  tz?: number;
  lagR: number;
  planets: Record<PlanetName, NatalPlanet>;
}

export interface TransitPlanetResult {
  planet: PlanetName;
  longitude: number;
  rashi: number;
  rashiName: string;
  degreeInRashi: number;
  houseFromBase: number;
  base: TransitBase;
  baseLabel: "Lagna" | "Moon";
  retrograde: boolean;
  effect: TransitEffect;
  label: string;
  note: string;
  natalHouse: number;
  natalRashi: number;
  natalHitPlanets: PlanetName[];
  score: number;
}

export interface TransitAlert {
  type:
    | "sade_sati"
    | "ashtama_shani"
    | "danger"
    | "opportunity"
    | "health"
    | "cross_hit";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  planets: PlanetName[];
  house?: number;
}

export interface TransitAreaScore {
  area: "career" | "love" | "money" | "health" | "family" | "spirituality";
  score: number;
  summary: string;
}

export interface TransitReport {
  date: string;
  base: TransitBase;
  baseLabel: "Lagna" | "Moon";
  planets: TransitPlanetResult[];
  alerts: TransitAlert[];
  areaScores: TransitAreaScore[];
  summary: string;
  aiContext: string;
}

const PLANETS = CORE_PLANETS as PlanetName[];
const MALEFICS: PlanetName[] = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"];

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function normalizeRashi(value: number): number {
  if (value >= 0 && value <= 11) return value;
  if (value >= 1 && value <= 12) return value - 1;
  return Math.floor(mod(value, 360) / 30);
}

function buildCoreInput(chart: NatalChartForTransit): { input: NatalChartInput; missingLongitudePlanets: PlanetName[] } {
  const missingLongitudePlanets: PlanetName[] = [];
  const planets = PLANETS.reduce((acc, planet) => {
    const p = chart.planets[planet];
    const rashi = normalizeRashi(p.rashi);
    const hasPreciseLongitude = typeof p.longitude === "number" && Number.isFinite(p.longitude);
    const lon = hasPreciseLongitude ? p.longitude : rashi * 30;
    if (!hasPreciseLongitude) missingLongitudePlanets.push(planet);
    acc[planet] = {
      rashi,
      house: p.house,
      lon,
      retrograde: Boolean(p.retrograde),
      nakshatra: p.nakshatra,
    };
    return acc;
  }, {} as NatalChartInput["planets"]);

  return {
    input: {
      lagR: normalizeRashi(chart.lagR),
      tz: chart.tz ?? 5.5,
      planets,
    },
    missingLongitudePlanets,
  };
}

function scorePlanet(effect: TransitEffect, house: number, retrograde: boolean): number {
  let score = 50;
  if (effect === "favorable") score += 20;
  if (effect === "caution") score -= 18;
  if ([6, 8, 12].includes(house)) score -= 6;
  if ([3, 6, 10, 11].includes(house)) score += 5;
  if (retrograde) score -= 4;
  return Math.max(0, Math.min(100, score));
}

function scoreSummary(score: number): string {
  if (score >= 70) return "Strong window. Take action.";
  if (score >= 55) return "Mixed-positive. Move steadily.";
  if (score >= 40) return "Average. Avoid over-risk.";
  return "Sensitive period. Use patience and remedies.";
}

function areaScores(planets: TransitPlanetResult[]): TransitAreaScore[] {
  const byPlanet = Object.fromEntries(planets.map((p) => [p.planet, p])) as Record<PlanetName, TransitPlanetResult>;

  const weighted = (items: Array<[PlanetName, number]>) => {
    const total = items.reduce((sum, [planet, weight]) => sum + (byPlanet[planet]?.score ?? 50) * weight, 0);
    const w = items.reduce((sum, [, weight]) => sum + weight, 0);
    return Math.round(total / w);
  };

  const result: TransitAreaScore[] = [
    { area: "career", score: weighted([["Sun", 1], ["Saturn", 1.2], ["Mercury", 1], ["Jupiter", 1]]), summary: "" },
    { area: "love", score: weighted([["Venus", 1.3], ["Jupiter", 1], ["Moon", 0.8], ["Mars", 0.6]]), summary: "" },
    { area: "money", score: weighted([["Jupiter", 1.3], ["Venus", 1], ["Mercury", 1], ["Saturn", 0.7]]), summary: "" },
    { area: "health", score: weighted([["Sun", 1], ["Moon", 1.2], ["Saturn", 1.2], ["Mars", 1]]), summary: "" },
    { area: "family", score: weighted([["Moon", 1.2], ["Venus", 1], ["Jupiter", 1], ["Sun", 0.7]]), summary: "" },
    { area: "spirituality", score: weighted([["Jupiter", 1.3], ["Ketu", 1], ["Saturn", 0.8], ["Moon", 0.7]]), summary: "" },
  ];

  return result.map((item) => ({ ...item, summary: scoreSummary(item.score) }));
}

function buildAiContext(report: Omit<TransitReport, "aiContext">): string {
  const planetLines = report.planets
    .map(
      (p) =>
        `${p.planet}: ${p.rashiName} ${p.degreeInRashi}°, H${p.houseFromBase} from ${p.baseLabel}, ${p.effect}, score ${p.score}. ${p.note}`
    )
    .join("\n");

  const alertLines = report.alerts.length
    ? report.alerts.map((a) => `${a.severity.toUpperCase()}: ${a.title} — ${a.description}`).join("\n")
    : "No major alerts.";

  const areaLines = report.areaScores.map((a) => `${a.area}: ${a.score}/100 — ${a.summary}`).join("\n");

  return `
Transit Report (${report.date})
Base: ${report.baseLabel}

Planets:
${planetLines}

Alerts:
${alertLines}

Area Scores:
${areaLines}

Summary:
${report.summary}
`.trim();
}

export function calculateTransitReport(params: {
  chart: NatalChartForTransit;
  date?: Date;
  base?: TransitBase;
}): TransitReport {
  const date = params.date ?? new Date();
  const base = params.base ?? "lagna";
  const { input: coreInput, missingLongitudePlanets } = buildCoreInput(params.chart);
  const dateStr = date.toISOString().split("T")[0];
  const core = runTransitEngine(coreInput, base, dateStr);
  const baseLabel = base === "lagna" ? "Lagna" : "Moon";

  const planets: TransitPlanetResult[] = core.planets.map((p) => {
    const planet = p.planet as PlanetName;
    const natal = params.chart.planets[planet];
    const natalHitPlanets = PLANETS.filter((name) => {
      if (name === planet) return false;
      return params.chart.planets[name]?.house === p.houseFromBase;
    });
    const effect = p.effect as TransitEffect;

    return {
      planet,
      longitude: p.transitLon,
      rashi: p.transitRashi,
      rashiName: RASHIS_EN[p.transitRashi] ?? p.transitRashiName,
      degreeInRashi: Number.parseFloat(p.transitDeg.replace("°", "")),
      houseFromBase: p.houseFromBase,
      base,
      baseLabel,
      retrograde: p.isRetro,
      effect,
      label: p.effectLabel,
      note: p.note,
      natalHouse: natal?.house ?? p.houseFromBase,
      natalRashi: natal ? normalizeRashi(natal.rashi) : p.transitRashi,
      natalHitPlanets,
      score: scorePlanet(effect, p.houseFromBase, p.isRetro),
    };
  });

  const alerts: TransitAlert[] = core.zoneAlerts.map((a) => ({
    type:
      a.type === "sade_sati"
        ? "sade_sati"
        : a.type === "kantak"
          ? "ashtama_shani"
          : a.type === "opportunity"
            ? "opportunity"
            : a.type === "mixed"
              ? "health"
              : a.type === "rahu_return"
                ? "cross_hit"
                : a.type === "active"
                  ? "danger"
                  : "health",
    title: a.title,
    description: a.para,
    severity: a.severity,
    planets: (a.planets.filter((p) => PLANETS.includes(p as PlanetName)) as PlanetName[]),
    house: a.house,
  }));

  if (missingLongitudePlanets.length > 0) {
    alerts.push({
      type: "health",
      title: "Natal precision warning",
      description: `Exact longitudes missing for: ${missingLongitudePlanets.join(", ")}. Degree-level predictions may be softer until precise chart data is available.`,
      severity: "low",
      planets: missingLongitudePlanets,
    });
  }

  for (const conj of core.degreeConjunctions) {
    alerts.push({
      type: "cross_hit",
      title: `${conj.transitPlanet} conjunct natal ${conj.natalPlanet}`,
      description: conj.description,
      severity: MALEFICS.includes(conj.transitPlanet as PlanetName) ? "high" : "medium",
      planets: [conj.transitPlanet as PlanetName, conj.natalPlanet as PlanetName],
    });
  }

  const scores = areaScores(planets);
  const reportWithoutContext = {
    date: date.toISOString(),
    base,
    baseLabel: baseLabel as "Lagna" | "Moon",
    planets,
    alerts,
    areaScores: scores,
    summary: core.summary,
  };

  const report: TransitReport = {
    ...reportWithoutContext,
    aiContext: buildAiContext(reportWithoutContext),
  };

  assertTransitReportContract(report);
  return report;
}
