import { computePlanets } from "../calculations";
import type { PlanetName } from "../transits";

export interface EphemerisVelocity {
  planet: PlanetName;
  velocity: number;      // Signed daily velocity (degrees/day), negative = retrograde
  speed: number;         // Absolute daily speed (|velocity|)
  isRetrograde: boolean; // True if moving backwards in zodiac
}

const PLANETS_LIST: PlanetName[] = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
];

/**
 * Converts a standard JavaScript Date to Julian Day (UT).
 * 2440587.5 is the Unix epoch (1970-01-01T00:00:00Z).
 */
export function dateToJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/**
 * Computes exact instantaneous apparent planetary velocities using the authoritative
 * Moshier / planetary ephemeris core.
 * Uses central difference derivative dλ/dt over dt = 0.005 day (7.2 minutes).
 */
export function computeAllEphemerisVelocities(
  jd: number
): Record<PlanetName, EphemerisVelocity> {
  const dt = 0.005; // 7.2 minutes
  const p1 = computePlanets(jd - dt);
  const p2 = computePlanets(jd + dt);

  const result = {} as Record<PlanetName, EphemerisVelocity>;

  for (const planet of PLANETS_LIST) {
    const lon1 = p1[planet] ?? 0;
    const lon2 = p2[planet] ?? 0;

    let dLon = lon2 - lon1;
    // Shortest angular difference across 0°/360° boundary
    while (dLon > 180) dLon -= 360;
    while (dLon < -180) dLon += 360;

    // Daily rate of motion (derivative over 2 * dt = 0.01 day)
    const velocity = Number((dLon / (2 * dt)).toFixed(6));
    const speed = Math.abs(velocity);
    const isRetrograde = velocity < 0;

    result[planet] = {
      planet,
      velocity,
      speed,
      isRetrograde,
    };
  }

  return result;
}

/**
 * Computes exact instantaneous ephemeris velocity for a single planet.
 */
export function computeEphemerisVelocity(
  planet: PlanetName,
  jd: number
): EphemerisVelocity {
  const all = computeAllEphemerisVelocities(jd);
  return all[planet];
}

/**
 * Enriches a list of planetary coordinates with real instantaneous ephemeris velocities.
 * If coordinate already has an explicit speed, preserves it; otherwise populates
 * the signed daily motion from the authoritative ephemeris.
 */
export function enrichWithEphemerisVelocities(
  coords: Array<{ name: PlanetName; longitude: number; house: number; speed?: number }>,
  date: Date
): Array<{ name: PlanetName; longitude: number; house: number; speed: number; isRetrograde?: boolean }> {
  const jd = dateToJulianDay(date);
  const velocities = computeAllEphemerisVelocities(jd);

  return coords.map((c) => {
    const ephem = velocities[c.name];
    const speed = (c.speed !== undefined && Number.isFinite(c.speed))
      ? c.speed
      : (ephem ? ephem.velocity : 1.0);

    return {
      ...c,
      speed,
      isRetrograde: ephem?.isRetrograde ?? (speed < 0),
    };
  });
}
