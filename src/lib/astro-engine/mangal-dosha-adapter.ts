import type { ChartData, DashaEntry, PlanetData } from "./calculations";
import {
  calculateMangalDosha,
  compareMangalDosha,
  type ChartSnapshot,
  type MangalDoshaInput,
  type MangalDoshaResult,
  type ManglikCompatibilityResult,
  type PlanetName,
  type Sign,
} from "./mangal-dosha";

const PLANET_NAMES: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const RASHI_TO_SIGN: Record<string, Sign> = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

function asSign(value: unknown, fallback: Sign = 1): Sign {
  if (typeof value === "number") {
    const normalized = value >= 0 && value <= 11 ? value + 1 : value;
    if (normalized >= 1 && normalized <= 12) return normalized as Sign;
  }
  if (typeof value === "string") return RASHI_TO_SIGN[value] ?? fallback;
  return fallback;
}

function activePlanet(entries?: DashaEntry[]): PlanetName | undefined {
  const active = entries?.find((entry) => entry.active)?.planet;
  return PLANET_NAMES.includes(active as PlanetName) ? (active as PlanetName) : undefined;
}

function planetToSnapshot(planet: PlanetData | undefined) {
  if (!planet) return undefined;
  return {
    sign: asSign(planet.signNum, asSign(planet.sign)),
    degree: planet.degree,
    house: planet.house as Sign,
    retrograde: planet.retrograde,
    combust: planet.dignity === "Combust",
    nakshatraLord: PLANET_NAMES.includes(planet.nakshatraLord as PlanetName)
      ? (planet.nakshatraLord as PlanetName)
      : undefined,
    flags: {
      signSandhi: planet.degree <= 1 || planet.degree >= 29,
    },
  };
}

function getD9LagnaSign(lagnaLon: number): Sign {
  return asSign(Math.floor((lagnaLon % 360) / (360 / 108)));
}

function planetToNavamshaSnapshot(planet: PlanetData | undefined, d9Ascendant: Sign) {
  if (!planet?.navamsha) return undefined;
  const sign = asSign(planet.navamsha);
  return {
    sign,
    degree: 15,
    house: (((sign - d9Ascendant + 12) % 12) + 1) as Sign,
    retrograde: planet.retrograde,
    combust: planet.dignity === "Combust",
    nakshatraLord: PLANET_NAMES.includes(planet.nakshatraLord as PlanetName)
      ? (planet.nakshatraLord as PlanetName)
      : undefined,
    flags: {
      signSandhi: false,
    },
  };
}

export function chartToMangalSnapshot(chart: ChartData): ChartSnapshot {
  const planets: ChartSnapshot["planets"] = {};

  for (const planetName of PLANET_NAMES) {
    const placement = planetToSnapshot(chart.planets[planetName]);
    if (placement) planets[planetName] = placement;
  }

  const d9Ascendant = getD9LagnaSign(chart.lagnaLon);
  const navamshaPlanets: ChartSnapshot["planets"] = {};
  for (const planetName of PLANET_NAMES) {
    const placement = planetToNavamshaSnapshot(chart.planets[planetName], d9Ascendant);
    if (placement) navamshaPlanets[planetName] = placement;
  }

  return {
    ascendantSign: asSign(chart.lagnaNum, asSign(chart.lagnaRashi)),
    planets,
    navamsha: Object.keys(navamshaPlanets).length
      ? {
          ascendantSign: d9Ascendant,
          planets: navamshaPlanets,
        }
      : undefined,
  };
}

export function buildMangalDoshaInput(chart: ChartData): MangalDoshaInput {
  return {
    natal: chartToMangalSnapshot(chart),
    school: "expanded",
    includeTraditionalExceptions: true,
    dasha: {
      mahadasha: activePlanet(chart.dashas),
      antardasha: activePlanet(chart.antardasha),
    },
  };
}

function scoreTone(score: number) {
  if (score >= 76) return "strong";
  if (score >= 58) return "supportive";
  if (score >= 40) return "mixed";
  return "sensitive";
}

function topEvidence(result: MangalDoshaResult, limit = 5) {
  return [...result.evidence]
    .sort((a, b) => Math.abs(b.points) - Math.abs(a.points))
    .slice(0, limit);
}

export type MangalDoshaInsight = {
  title: string;
  summary: string;
  result: MangalDoshaResult;
  tone: "strong" | "supportive" | "mixed" | "sensitive";
  keyEvidence: ReturnType<typeof topEvidence>;
  productGuidance: string[];
};

export function buildMangalDoshaInsight(chart: ChartData): MangalDoshaInsight {
  const result = calculateMangalDosha(buildMangalDoshaInput(chart));
  const tone = scoreTone(result.scores.natalSeverity);
  const riskDomains = result.riskDomains.length ? result.riskDomains.slice(0, 4).join(", ") : "no dominant Mars stress domain";
  const current = result.scores.currentExpression === null
    ? "Current activation is not calculated from transits, so read this as natal potential."
    : `Current Mars expression is ${result.scores.currentExpression}/100 with ${result.activationLabel} activation.`;

  return {
    title: "Mangal Dosha Intelligence",
    result,
    tone,
    keyEvidence: topEvidence(result),
    summary:
      `${chart.name}'s Mars relationship pattern is ${result.severityLabel.toLowerCase()} ` +
      `with natal severity ${result.scores.natalSeverity}/100. Key domains: ${riskDomains}. ${current}`,
    productGuidance: [
      "Use this as a relationship pattern layer, not a fear verdict.",
      "Marriage judgment still needs 7th house, Venus, Jupiter, D9, dasha, transit and real compatibility.",
      result.scores.protection >= 35
        ? "Protection factors are meaningfully present, so avoid over-warning from Mars placement alone."
        : "Protection is limited; relationship timing and communication habits need more conscious handling.",
      result.scores.constructivePotential >= 65
        ? "Mars can become a strength through discipline, fitness, leadership, property action or crisis management."
        : "Mars works better when anger, speed and decision pressure are deliberately regulated.",
    ],
  };
}

export function compareMangalDoshaCharts(nativeChart: ChartData, partnerChart?: ChartData): ManglikCompatibilityResult | null {
  if (!partnerChart) return null;
  return compareMangalDosha(buildMangalDoshaInput(nativeChart), buildMangalDoshaInput(partnerChart));
}
