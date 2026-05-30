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

export interface MonthlyTransitRipplePoint {
  date: string;
  planet: TransitRipplePlanet;
  sign: string;
  nakshatra: string;
  speed: "direct" | "retrograde";
  longitude: number;
  houseFromAscendant: number;
  houseFromMoon: number;
}

export interface MonthlyTransitNatalPoint {
  name: string;
  kind: "planet" | "cusp";
  longitude: number;
  sign: string;
  house: number;
  nakshatra?: string;
}

export interface MonthlyTransitRipplePayload {
  mode: "monthly";
  nativeName: string;
  ascendant: string;
  moonSign: string;
  currentMahadasha: string;
  currentAntardasha: string;
  startDate: string;
  endDate: string;
  periodLabel: string;
  includeMoonSignReading: boolean;
  transitPoints: MonthlyTransitRipplePoint[];
  natalPoints: MonthlyTransitNatalPoint[];
}

export interface MonthlyTransitRipplePayloadResult {
  payload: MonthlyTransitRipplePayload;
  meta: Omit<TransitRipplePayloadMeta, "transitLongitude"> & {
    daysScanned: number;
    planetsScanned: TransitRipplePlanet[];
  };
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

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function dateString(date: Date) {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function signIndex(sign: string) {
  return [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ].findIndex((item) => item === sign);
}

function houseFrom(baseSign: string, transitSign: string) {
  const base = signIndex(baseSign);
  const transit = signIndex(transitSign);
  if (base < 0 || transit < 0) return 1;
  return ((transit - base + 12) % 12) + 1;
}

const MONTHLY_TRANSIT_PLANETS: TransitRipplePlanet[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

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

export function buildMonthlyTransitRipplePayloadFromChart(
  chart: ChartData,
  days = 30,
): MonthlyTransitRipplePayloadResult {
  const moon = getPlanet(chart, "Moon");
  if (!moon) {
    throw new Error("Moon sign is missing from the saved birth chart.");
  }

  const currentMahadasha = activePlanet(chart.dashas, "Saturn");
  const currentAntardasha = activePlanet(chart.antardasha, "Mercury");
  const { date, time } = currentDateTimeForTimezone(chart.tz);
  const start = new Date(`${date}T00:00:00Z`);
  const clampedDays = Math.min(Math.max(days, 1), 45);
  const transitPoints: MonthlyTransitRipplePoint[] = [];
  const natalPoints: MonthlyTransitNatalPoint[] = [
    ...Object.entries(chart.planets).map(([name, planet]) => ({
      name,
      kind: "planet" as const,
      longitude: planet.lon,
      sign: planet.sign,
      house: planet.house,
      nakshatra: planet.nakshatra,
    })),
    ...chart.houseCusps.map((cusp) => ({
      name: `House ${cusp.house} cusp`,
      kind: "cusp" as const,
      longitude: cusp.lon,
      sign: cusp.sign,
      house: cusp.house,
      nakshatra: cusp.nakshatra,
    })),
  ];

  for (let offset = 0; offset <= clampedDays; offset += 1) {
    const scanDate = dateString(addDays(start, offset));
    const transitChart = calculateChart(
      `${chart.name} transit ${scanDate}`,
      scanDate,
      time,
      chart.city,
      chart.lat,
      chart.lon,
      chart.tz,
    );

    for (const planet of MONTHLY_TRANSIT_PLANETS) {
      const transit = getPlanet(transitChart, planet);
      if (!transit) continue;

      transitPoints.push({
        date: scanDate,
        planet,
        sign: transit.sign,
        nakshatra: transit.nakshatra,
        speed: transit.retrograde ? "retrograde" : "direct",
        longitude: transit.lon,
        houseFromAscendant: houseFrom(chart.lagnaRashi, transit.sign),
        houseFromMoon: houseFrom(moon.sign, transit.sign),
      });
    }
  }

  return {
    payload: {
      mode: "monthly",
      nativeName: chart.name || "AstroLife Native",
      ascendant: chart.lagnaRashi,
      moonSign: moon.sign,
      currentMahadasha,
      currentAntardasha,
      startDate: date,
      endDate: dateString(addDays(start, clampedDays)),
      periodLabel: `All major transits for the next ${clampedDays} days during ${currentMahadasha}-${currentAntardasha} dasha`,
      includeMoonSignReading: true,
      transitPoints,
      natalPoints,
    },
    meta: {
      source: "user-chart",
      chartName: chart.name,
      chartCity: chart.city,
      chartTimezone: chart.tz,
      generatedForDate: date,
      generatedForTime: time,
      daysScanned: clampedDays,
      planetsScanned: MONTHLY_TRANSIT_PLANETS,
    },
  };
}
