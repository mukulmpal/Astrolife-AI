import type { RetrogradePassInfo } from "./forecast-types";
import { computeEphemerisVelocity } from "../ephemeris-precision";
import type { PlanetName } from "../../transits";

export interface MotionSegment {
  jdStart: number;
  jdEnd: number;
  isRetrograde: boolean;
}

/**
 * Segments an active orb time window by planetary direction (direct vs retrograde).
 * If a planet turns retrograde while inside or adjacent to the orb window,
 * this splits the transit into distinct passes (e.g. Pass 1 Direct, Pass 2 Retrograde, Pass 3 Direct).
 */
export function segmentPassesByDirection(
  planet: PlanetName,
  jdStart: number,
  jdEnd: number,
  stepDays = 0.5
): MotionSegment[] {
  const segments: MotionSegment[] = [];

  let currentStart = jdStart;
  let currentVel = computeEphemerisVelocity(planet, jdStart).velocity;
  let currentIsRetro = currentVel < 0;

  for (let t = jdStart + stepDays; t <= jdEnd; t += stepDays) {
    const vel = computeEphemerisVelocity(planet, t).velocity;
    const isRetro = vel < 0;

    if (isRetro !== currentIsRetro) {
      // Direction reversal detected (Station)
      segments.push({
        jdStart: currentStart,
        jdEnd: t,
        isRetrograde: currentIsRetro,
      });
      currentStart = t;
      currentIsRetro = isRetro;
    }
  }

  segments.push({
    jdStart: currentStart,
    jdEnd,
    isRetrograde: currentIsRetro,
  });

  return segments;
}

/**
 * Builds RetrogradePassInfo for a specific event pass.
 */
export function buildRetrogradePassInfo(
  isRetrograde: boolean,
  passIndex: number,
  totalPasses: number
): RetrogradePassInfo {
  return {
    isRetrograde,
    passNumber: passIndex + 1,
    totalPassesEstimated: totalPasses > 1 ? totalPasses : 1,
  };
}

