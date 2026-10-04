/**
 * ============================================================================
 * ASTROLIFE — TRANSIT RIPPLE 2.0 PUBLIC API
 * ============================================================================
 */

export * from "./types";
export * from "./aspect-profiles";
export * from "./transit-calculator";
export * from "./fusion-narrative";

import type {
  NatalInput,
  TransitPlanet,
  RahuKetuAspectProfile,
  TransitRippleResult,
} from "./types";
import { calculateTransitRippleData } from "./transit-calculator";
import { buildChapterNarrative } from "./fusion-narrative";

export function generateTransitRippleReport(
  natal: NatalInput,
  scanDate?: string,
  language: "hinglish" | "english" = "hinglish",
  selectedPlanet: TransitPlanet = "Saturn",
  rahuKetuProfile: RahuKetuAspectProfile = "5_7_9"
): TransitRippleResult {
  const calcOutput = calculateTransitRippleData(natal, {
    scanDate,
    selectedPlanet,
    rahuKetuProfile,
  });

  const narrative = buildChapterNarrative(calcOutput, language);

  return {
    scanDate: calcOutput.scanDate,
    natal,
    transitPositions: calcOutput.transitPositions,
    allDrishtiHits: calcOutput.allDrishtiHits,
    houseClusters: calcOutput.houseClusters,
    hotspotHouses: calcOutput.hotspotHouses,
    selectedPlanet,
    selectedPlanetRipples: calcOutput.selectedPlanetRipples,
    narrative,
  };
}

