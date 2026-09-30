// src/lib/astro-engine/ayanamsa-config.ts
// AstroLife — Precision Ayanamsa Configuration & Boundary Detection Engine
// Seamlessly interfaces Lahiri (Chitrapaksha) and KP (Krishnamurti) frames

import {
  computeKPAyanamsha,
} from "./placidus";
import {
  lahiri,
  convertLongitudeBetweenAyanamshas,
  SupportedAyanamsha,
} from "./calculations";
import {
  NAKSHATRA_DATA,
  getNakshatraById,
  type NakshatraData,
} from "./nakshatra-data";

export type { SupportedAyanamsha };

export interface BoundaryAlert {
  isNearBoundary: boolean;
  distanceArcMin: number;
  thresholdArcMin: number;
  lahiriNakshatra: NakshatraData;
  kpNakshatra: NakshatraData;
  shiftsAyanamsa: boolean;
  alertText?: string;
}

export interface NakshatraCoordinate {
  nakshatra: NakshatraData;
  pada: number;
  degreeInNakshatra: number;
  minutesInNakshatra: number;
  secondsInNakshatra: number;
  adjustedLongitude: number;
  boundary: BoundaryAlert;
}

const NAK_SPAN = 360 / 27; // 13.333333333333334° (13°20')
const PADA_SPAN = NAK_SPAN / 4; // 3.3333333333333335° (3°20')

const _n = (deg: number) => ((deg % 360) + 360) % 360;

/**
 * Calculates current epoch Ayanamsa values and the exact difference in arcminutes.
 */
export function getAyanamsaComparison(jd: number): {
  lahiriDeg: number;
  kpDeg: number;
  offsetArcMin: number;
} {
  const lahiriDeg = lahiri(jd);
  const kpDeg = computeKPAyanamsha(jd);
  const diffDeg = lahiriDeg - kpDeg;
  return {
    lahiriDeg,
    kpDeg,
    offsetArcMin: diffDeg * 60,
  };
}

/**
 * Evaluates proximity to the nearest Nakshatra boundary and checks if Ayanamsa shift alters the star.
 * @param lahiriLon Sidereal longitude in Lahiri Chitrapaksha (0-360)
 * @param jd Julian Day of chart epoch
 * @param thresholdArcMin Proximity threshold in arcminutes (default: 15' = 0.25°)
 */
export function evaluateBoundaryProximity(
  lahiriLon: number,
  jd: number,
  thresholdArcMin = 15
): BoundaryAlert {
  const normLahiri = _n(lahiriLon);
  const kpLon = convertLongitudeBetweenAyanamshas(
    normLahiri,
    "Lahiri_Chitrapaksha",
    "KP_Krishnamurti",
    jd
  );

  const lahiriIdx = Math.floor(normLahiri / NAK_SPAN);
  const kpIdx = Math.floor(kpLon / NAK_SPAN);

  const lahiriNak = getNakshatraById(lahiriIdx + 1);
  const kpNak = getNakshatraById(kpIdx + 1);

  // Distance to nearest boundary (either start of current nakshatra or start of next)
  const rem = normLahiri % NAK_SPAN;
  const distToStart = rem;
  const distToEnd = NAK_SPAN - rem;
  const minDistDeg = Math.min(distToStart, distToEnd);
  const distanceArcMin = minDistDeg * 60;

  const isNearBoundary = distanceArcMin <= thresholdArcMin;
  const shiftsAyanamsa = lahiriNak.id !== kpNak.id;

  let alertText: string | undefined;
  if (isNearBoundary) {
    if (shiftsAyanamsa) {
      alertText = `Boundary Sensitivity: Degree is within ${distanceArcMin.toFixed(1)}' of the star boundary. In Lahiri it falls in ${lahiriNak.name} (${lahiriNak.lord}), while in KP Ayanamsha it shifts to ${kpNak.name} (${kpNak.lord}).`;
    } else {
      alertText = `Boundary Sensitivity: Position is within ${distanceArcMin.toFixed(1)}' of the cusp edge, but remains in ${lahiriNak.name} in both Lahiri and KP frames.`;
    }
  }

  return {
    isNearBoundary,
    distanceArcMin,
    thresholdArcMin,
    lahiriNakshatra: lahiriNak,
    kpNakshatra: kpNak,
    shiftsAyanamsa,
    alertText,
  };
}

/**
 * Resolves full Nakshatra coordinate for any longitude under the requested Ayanamsa frame.
 */
export function resolveNakshatraCoordinate(
  lahiriLon: number,
  jd: number,
  targetAyanamsa: SupportedAyanamsha = "Lahiri_Chitrapaksha",
  thresholdArcMin = 15
): NakshatraCoordinate {
  const adjustedLon =
    targetAyanamsa === "Lahiri_Chitrapaksha"
      ? _n(lahiriLon)
      : convertLongitudeBetweenAyanamshas(
          _n(lahiriLon),
          "Lahiri_Chitrapaksha",
          "KP_Krishnamurti",
          jd
        );

  const nakIdx = Math.min(26, Math.floor(adjustedLon / NAK_SPAN));
  const nakshatra = getNakshatraById(nakIdx + 1);

  const degInNak = adjustedLon - nakIdx * NAK_SPAN;
  const pada = Math.min(4, Math.floor(degInNak / PADA_SPAN) + 1);

  const totalMinutes = degInNak * 60;
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.floor((totalMinutes * 60) % 60);

  const boundary = evaluateBoundaryProximity(lahiriLon, jd, thresholdArcMin);

  return {
    nakshatra,
    pada,
    degreeInNakshatra: degInNak,
    minutesInNakshatra: minutes,
    secondsInNakshatra: seconds,
    adjustedLongitude: adjustedLon,
    boundary,
  };
}
