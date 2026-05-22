import { calculateChart, type ChartData, type PlanetData } from "./calculations";

export type TransitRipplePlanet = "Saturn" | "Jupiter" | "Rahu" | "Ketu" | "Mars" | "Venus" | "Mercury" | "Sun" | "Moon";

export interface TransitRipplePayload {
  nativeName: string;
  ascendant: string;
  moonSign: string;
  transitPlanet: TransitRipplePlanet;
  transitSign: string;
  transitNakshatra: string;
  transitSpeed: "direct" | "retrograde";
  currentMahadasha: string;
  currentAntardasha: string;
  periodLabel: string;
  includeMoonSignReading: boolean;
}

export interface TransitRipplePayloadMeta {
  source: "user-chart";
  chartName: string;
  chartCity: string;
  chartTimezone: number;
  generatedForDate: string;
  generatedForTime: string;
  transitLongitude: number;
}

export interface TransitRipplePayloadResult {
  payload: TransitRipplePayload;
  meta: TransitRipplePayloadMeta;
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function currentDateTimeForTimezone(tz: number) {
  const now = new Date();
  const shifted = new Date(now.getTime() + tz * 60 * 60 * 1000);

  return {
    date: `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`,
    time: `${pad2(shifted.getUTCHours())}:${pad2(shifted.getUTCMinutes())}`,
  };
}

function activePlanet(periods: Array<{ planet: string; active?: boolean }> | undefined, fallback: string) {
  return periods?.find((period) => period.active)?.planet ?? periods?.[0]?.planet ?? fallback;
}

function getPlanet(chart: ChartData, planet: string): PlanetData | null {
  return chart.planets[planet] ?? null;
}

function buildPeriodLabel(planet: TransitRipplePlanet, transit: PlanetData, mahadasha: string, antardasha: string) {
  const motion = transit.retrograde ? "retrograde" : "direct";
  return `${planet} ${motion} transit in ${transit.sign} / ${transit.nakshatra} during ${mahadasha}-${antardasha} dasha`;
}

export function buildTransitRipplePayloadFromChart(
  chart: ChartData,
  transitPlanet: TransitRipplePlanet = "Saturn",
): TransitRipplePayloadResult {
  const moon = getPlanet(chart, "Moon");
  const { date, time } = currentDateTimeForTimezone(chart.tz);
  const transitChart = calculateChart(
    `${chart.name} current transit`,
    date,
    time,
    chart.city,
    chart.lat,
    chart.lon,
    chart.tz,
  );
  const transit = getPlanet(transitChart, transitPlanet);

  if (!moon) {
    throw new Error("Moon sign is missing from the saved birth chart.");
  }

  if (!transit) {
    throw new Error(`${transitPlanet} transit data could not be calculated.`);
  }

  const currentMahadasha = activePlanet(chart.dashas, "Saturn");
  const currentAntardasha = activePlanet(chart.antardasha, "Mercury");

  return {
    payload: {
      nativeName: chart.name || "AstroLife Native",
      ascendant: chart.lagnaRashi,
      moonSign: moon.sign,
      transitPlanet,
      transitSign: transit.sign,
      transitNakshatra: transit.nakshatra,
      transitSpeed: transit.retrograde ? "retrograde" : "direct",
      currentMahadasha,
      currentAntardasha,
      periodLabel: buildPeriodLabel(transitPlanet, transit, currentMahadasha, currentAntardasha),
      includeMoonSignReading: true,
    },
    meta: {
      source: "user-chart",
      chartName: chart.name,
      chartCity: chart.city,
      chartTimezone: chart.tz,
      generatedForDate: date,
      generatedForTime: time,
      transitLongitude: transit.lon,
    },
  };
}
