/**
 * ============================================================================
 * ASTROLIFE ASTRONOMICAL ENGINE — LUNAR BOUNDARY SENSITIVITY DETECTOR
 * ============================================================================
 * Detects whether the calculated Moon position lies within close proximity to
 * critical astrological sign/sub-division boundaries where small astronomical
 * residuals (< 1 arcminute) could flip categorical values:
 *
 * 1. Rashi / Sign Boundaries:
 *    Multiples of 30.0 degrees (e.g. 0°, 30°, 60°, ...).
 *
 * 2. Nakshatra Boundaries:
 *    Multiples of 13.3333333 degrees (13° 20').
 *
 * 3. Pada / Navamsha Boundaries:
 *    Multiples of 3.3333333 degrees (3° 20').
 *
 * 4. Gandanta Sandhi Zones:
 *    Critical junctions between Water and Fire signs (Revati-Ashwini 360°/0°,
 *    Ashlesha-Magha 120°, Jyeshtha-Mula 240°) with an expanded sensitivity
 *    window (± 0.8 degrees).
 * ============================================================================
 */

export interface LunarBoundarySensitivity {
  isSensitive: boolean;
  boundaryType?: "rashi" | "nakshatra" | "pada" | "navamsha" | "gandanta";
  distanceToBoundaryDeg: number;
  nearestBoundaryDeg: number;
  explanation?: string;
}

const _n = (x: number) => ((x % 360) + 360) % 360;

/**
 * Calculates minimum angular distance between a longitude and a grid of boundaries.
 */
function minDistanceToGrid(
  lon: number,
  gridStep: number
): { minDistance: number; nearestBoundary: number } {
  const norm = _n(lon);
  const stepIndex = Math.round(norm / gridStep);
  const nearest = (stepIndex * gridStep) % 360;
  let diff = Math.abs(norm - nearest);
  if (diff > 180) diff = 360 - diff;
  return { minDistance: diff, nearestBoundary: nearest };
}

/**
 * Detects whether the Moon is in an astrologically sensitive boundary zone.
 *
 * @param moonLon       Sidereal Moon longitude in degrees [0, 360)
 * @param thresholdDeg  Threshold in degrees (default 0.0333° = 2 arcminutes)
 */
export function detectMoonBoundarySensitivity(
  moonLon: number,
  thresholdDeg = 0.0333333
): LunarBoundarySensitivity {
  const norm = _n(moonLon);

  // 1. Gandanta Sandhi (0°, 120°, 240° ± 0.8°)
  const GANDANTA_CENTERS = [0, 120, 240];
  for (const center of GANDANTA_CENTERS) {
    let diff = Math.abs(norm - center);
    if (diff > 180) diff = 360 - diff;
    if (diff <= 0.8) {
      return {
        isSensitive: true,
        boundaryType: "gandanta",
        distanceToBoundaryDeg: diff,
        nearestBoundaryDeg: center,
        explanation: `Moon is within Gandanta sandhi zone (${diff.toFixed(4)}° from junction ${center}°)`,
      };
    }
  }

  // 2. Rashi Boundary (30° grid)
  const rashi = minDistanceToGrid(norm, 30.0);
  if (rashi.minDistance <= thresholdDeg) {
    return {
      isSensitive: true,
      boundaryType: "rashi",
      distanceToBoundaryDeg: rashi.minDistance,
      nearestBoundaryDeg: rashi.nearestBoundary,
      explanation: `Moon is within ${(thresholdDeg * 60).toFixed(1)}' of Rashi boundary at ${rashi.nearestBoundary}° (distance: ${(rashi.minDistance * 3600).toFixed(1)}")`,
    };
  }

  // 3. Nakshatra Boundary (13° 20' = 13.333333° grid)
  const nakshatraGrid = 360 / 27; // 13.333333333333334
  const nak = minDistanceToGrid(norm, nakshatraGrid);
  if (nak.minDistance <= thresholdDeg) {
    return {
      isSensitive: true,
      boundaryType: "nakshatra",
      distanceToBoundaryDeg: nak.minDistance,
      nearestBoundaryDeg: nak.nearestBoundary,
      explanation: `Moon is within ${(thresholdDeg * 60).toFixed(1)}' of Nakshatra boundary at ${nak.nearestBoundary.toFixed(2)}° (distance: ${(nak.minDistance * 3600).toFixed(1)}")`,
    };
  }

  // 4. Pada / Navamsha Boundary (3° 20' = 3.333333° grid)
  const padaGrid = 360 / 108; // 3.3333333333333335
  const pada = minDistanceToGrid(norm, padaGrid);
  if (pada.minDistance <= thresholdDeg) {
    return {
      isSensitive: true,
      boundaryType: "pada",
      distanceToBoundaryDeg: pada.minDistance,
      nearestBoundaryDeg: pada.nearestBoundary,
      explanation: `Moon is within ${(thresholdDeg * 60).toFixed(1)}' of Pada/Navamsha boundary at ${pada.nearestBoundary.toFixed(2)}° (distance: ${(pada.minDistance * 3600).toFixed(1)}")`,
    };
  }

  // Normal position
  return {
    isSensitive: false,
    distanceToBoundaryDeg: Math.min(
      rashi.minDistance,
      nak.minDistance,
      pada.minDistance
    ),
    nearestBoundaryDeg: pada.nearestBoundary,
    explanation: "Moon position is well clear of any sandhi/boundary thresholds",
  };
}

