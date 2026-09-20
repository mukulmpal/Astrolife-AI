import type { ChartData } from "../calculations";
import type { PanchangResult } from "../panchang";
import type { PlanetName } from "../transits";
import type { CosmicPulseResult, PulseTrigger } from "./types";
import { detectPlanetaryConflicts, type PlanetCoord } from "./detectors/planetary-conflict";
import { detectTransitHits, type HitPair } from "./detectors/transit-hits";
import { detectDashaMilestones } from "./detectors/dasha-transitions";
import { calculateTaraBala } from "./detectors/tara-bala";
import { calculateChandraBala } from "./detectors/chandra-bala";
import { extractMicroTiming } from "./detectors/micro-timing";
import { generateMicroRemedy } from "./remedies/micro-remedies";
import { fuseTriggers } from "./fusion/trigger-fusion";
import { enrichWithEphemerisVelocities } from "./ephemeris-precision";

export * from "./types";
export * from "./detectors/planetary-conflict";
export * from "./detectors/transit-hits";
export * from "./detectors/dasha-transitions";
export * from "./detectors/tara-bala";
export * from "./detectors/chandra-bala";
export * from "./detectors/micro-timing";
export * from "./remedies/micro-remedies";
export * from "./fusion/trigger-fusion";
export * from "./ephemeris-precision";
export * from "./forecast";

const PLANET_NAMES: PlanetName[] = [
  "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
];

export interface CalculatePulseParams {
  chart: ChartData;
  panchang: PanchangResult;
  transitPlanetsCoords?: Array<{ name: PlanetName; longitude: number; house: number; speed?: number }>;
  currentDate?: Date;
}

export function calculateCosmicPulse({
  chart,
  panchang,
  transitPlanetsCoords,
  currentDate = new Date(),
}: CalculatePulseParams): CosmicPulseResult {
  // 1. Prepare raw planet coords for conflict detector
  const rawCoords: PlanetCoord[] = (transitPlanetsCoords && transitPlanetsCoords.length > 0)
    ? transitPlanetsCoords
    : PLANET_NAMES.map((name) => {
        const p = chart.planets?.[name] as unknown as Record<string, unknown> | undefined;
        const longitude =
          typeof p?.longitude === "number" ? p.longitude :
          typeof p?.lon === "number" ? p.lon :
          typeof p?.degree === "number" ? p.degree : 0;
        const house = typeof p?.house === "number" ? p.house : 1;
        const speed = typeof p?.speed === "number" ? p.speed : undefined;
        return { name, longitude, house, speed };
      });

  // Enrich with authoritative ephemeris instantaneous velocities
  const activePlanetCoords: PlanetCoord[] = enrichWithEphemerisVelocities(rawCoords, currentDate);

  // 2. Detect planetary conflicts (Samasaptaka 180° opposition & special aspects)
  const conflictTriggers = detectPlanetaryConflicts(activePlanetCoords);

  // 3. Detect transit hits on natal planets
  const hitPairs: HitPair[] = [];
  if (activePlanetCoords && activePlanetCoords.length > 0) {
    for (const tp of activePlanetCoords) {
      for (const npName of PLANET_NAMES) {
        const np = chart.planets?.[npName] as unknown as Record<string, unknown> | undefined;
        if (np) {
          const npLon =
            typeof np.longitude === "number" ? np.longitude :
            typeof np.lon === "number" ? np.lon :
            typeof np.degree === "number" ? np.degree : 0;
          const npHouse = typeof np.house === "number" ? np.house : 1;
          hitPairs.push({
            transitPlanet: tp.name,
            transitLongitude: tp.longitude,
            transitHouse: tp.house,
            natalPlanet: npName,
            natalLongitude: npLon,
            natalHouse: npHouse,
            transitSpeed: tp.speed,
          });
        }
      }
    }
  }
  const hitTriggers = detectTransitHits(hitPairs);

  // 4. Tara Bala Calculation
  const birthNakshatra = chart.planets?.Moon?.nakshatra || "Ashwini";
  const transitNakshatra = panchang.nakshatra || "Ashwini";
  const taraBala = calculateTaraBala(birthNakshatra, transitNakshatra);

  // 5. Chandra Bala Calculation
  const natalMoonSign = chart.planets?.Moon?.sign || "Aries";
  const transitMoonSign = panchang.moonSign || "Aries";
  const natalMoonIdx = Math.max(0, RASHIS.indexOf(natalMoonSign));
  const transitMoonIdx = Math.max(0, RASHIS.indexOf(transitMoonSign));
  const chandraBala = calculateChandraBala(natalMoonIdx, transitMoonIdx);

  // 6. Trigger Fusion (Cluster triggers, assign supporting signals, remove duplicates)
  const rawTriggers: PulseTrigger[] = [...conflictTriggers, ...hitTriggers];
  const { dominantTrigger, activeTriggers, upcomingTriggers } = fuseTriggers(
    rawTriggers,
    taraBala,
    chandraBala
  );

  // 7. Dasha Milestones (Sandhi / Shift)
  const dashaMilestone = detectDashaMilestones(
    (chart.dashas ?? []) as never,
    (chart.antardasha ?? []) as never,
    currentDate
  );

  // 8. Micro-Timing Windows
  const microTiming = extractMicroTiming(panchang);

  // 9. Micro-Remedy
  const microRemedy = generateMicroRemedy(dominantTrigger, taraBala, chandraBala);

  return {
    date: currentDate.toISOString().slice(0, 10),
    dominantTrigger,
    activeTriggers,
    upcomingTriggers,
    taraBala,
    chandraBala,
    microTiming,
    dashaMilestone,
    microRemedy,
  };
}

const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];
