/**
 * ============================================================================
 * ASTROLIFE — TRANSIT RIPPLE 2.0 PUBLIC API
 * ============================================================================
 */

export * from "./types";
export * from "./aspect-profiles";
export * from "./transit-calculator";
export * from "./fusion-narrative";
export * from "./adapter";
export * from "./cache-strategy";
export * from "./language-safety";
export * from "./real-life-matrix";
export * from "./remedies-matrix";
export * from "./dasha-tara-modifiers";

import type {
  NatalInput,
  TransitPlanet,
  RahuKetuAspectProfile,
  TransitRippleResult,
} from "./types";
import { calculateTransitRippleData } from "./transit-calculator";
import { buildChapterNarrative } from "./fusion-narrative";
import { transitRippleCache } from "./cache-strategy";

export function generateTransitRippleReport(
  natal: NatalInput,
  scanDate?: string,
  language: "hinglish" | "english" = "hinglish",
  selectedPlanet: TransitPlanet = "Saturn",
  rahuKetuProfile: RahuKetuAspectProfile = "5_7_9"
): TransitRippleResult {
  const chartId = `${natal.birthDate}_${natal.birthTime}_${natal.lagnaSign}_${natal.activeMahadasha || ""}_${natal.activeAntardasha || ""}`;
  const effectiveDate = scanDate || new Date().toISOString().split("T")[0];
  const cacheKey = transitRippleCache.buildKey(
    chartId,
    effectiveDate,
    selectedPlanet,
    language
  );

  const cached = transitRippleCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const calcOutput = calculateTransitRippleData(natal, {
    scanDate: effectiveDate,
    selectedPlanet,
    rahuKetuProfile,
  });

  const narrative = buildChapterNarrative(calcOutput, language);

  const result: TransitRippleResult = {
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

  transitRippleCache.set(cacheKey, result);
  return result;
}
