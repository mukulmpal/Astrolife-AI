import type { PlanetName } from "@/lib/astro-engine/transits";

const TRANSIT_PLANETS: PlanetName[] = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

type GenericRecord = Record<string, unknown>;
type PlanetLike = {
  longitude?: number;
  lon?: number;
  lng?: number;
  degree?: number;
  absoluteDegree?: number;
  siderealLongitude?: number;
  rashi?: number | string;
  sign?: number | string;
  signIndex?: number | string;
  rashiIndex?: number | string;
  zodiacSign?: number | string;
  house?: number;
  rashiName?: string;
  signName?: string;
  nakshatra?: string;
  retrograde?: boolean;
  isRetrograde?: boolean;
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function toRashi(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 0 && value <= 11) return value;
    if (value >= 1 && value <= 12) return value - 1;
    return Math.floor(mod(value, 360) / 30);
  }
  return 0;
}

function getPlanetData(raw: GenericRecord, planet: PlanetName): PlanetLike {
  const lower = planet.toLowerCase();
  const buckets = ["planets", "planetData", "grahas"] as const;

  for (const key of buckets) {
    const container = raw[key] as GenericRecord | undefined;
    if (!container) continue;
    const item = (container[planet] ?? container[lower]) as PlanetLike | undefined;
    if (item) return item;
  }
  return {};
}

export function normalizeChartForTransit(rawChartInput: unknown) {
  const root = (rawChartInput ?? {}) as GenericRecord;
  const raw = ((root.chart as GenericRecord | undefined) ?? root) as GenericRecord;

  const asc = raw.ascendant as GenericRecord | undefined;
  const lagna = raw.lagna as GenericRecord | undefined;
  const houses = raw.houses as Array<GenericRecord> | undefined;
  const lagnaRaw =
    raw.lagR ??
    raw.lagnaRashi ??
    raw.ascendantRashi ??
    asc?.rashi ??
    asc?.sign ??
    lagna?.rashi ??
    lagna?.sign ??
    houses?.[0]?.rashi ??
    houses?.[1]?.rashi ??
    0;
  const lagR = toRashi(lagnaRaw);

  const planets = TRANSIT_PLANETS.reduce((acc, planet) => {
    const data = getPlanetData(raw, planet);
    const longitude =
      data.longitude ??
      data.lon ??
      data.lng ??
      data.degree ??
      data.absoluteDegree ??
      data.siderealLongitude ??
      0;
    const rashi = toRashi(data.rashi ?? data.sign ?? data.signIndex ?? data.rashiIndex ?? data.zodiacSign ?? longitude);
    const house =
      typeof data.house === "number" && Number.isFinite(data.house)
        ? data.house >= 1 && data.house <= 12
          ? data.house
          : mod(data.house - 1, 12) + 1
        : mod(rashi - lagR, 12) + 1;

    acc[planet] = {
      longitude,
      rashi,
      house,
      rashiName: data.rashiName ?? data.signName,
      nakshatra: data.nakshatra,
      retrograde: Boolean(data.retrograde ?? data.isRetrograde),
    };
    return acc;
  }, {} as Record<PlanetName, { longitude: number; rashi: number; house: number; rashiName?: string; nakshatra?: string; retrograde: boolean }>);

  return {
    tz: (raw.tz as number | undefined) ?? (raw.timezone as number | undefined) ?? 5.5,
    lagR,
    planets,
  };
}
