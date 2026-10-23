// src/lib/astro-engine/transit-trigger.ts
// AstroLife — Authentic Dasha Transit Activation & Tara-Bala Engine
// Computes Sun & Jupiter activation windows for Exaltation / Debilitation signs
// and evaluates Transit Graha Tara Bala against Birth Star.

import {
  CLASSICAL_TARAS,
  calculateTaraNumber,
  calculateCountedPosition,
  getParyayaByPosition,
  type TaraDefinition,
} from "./navtara-engine";
import { getNakshatraById, type NakshatraData } from "./nakshatra-data";
import { resolveNakshatraCoordinate, type SupportedAyanamsha } from "./ayanamsa-config";
import type { DashaLord } from "./dasha";

// ── Classical Planetary Dignity Signs ────────────────────────────────────────

export interface PlanetDignitySigns {
  planet: DashaLord;
  exaltationSign: string;
  exaltationRashiNum: number; // 0 to 11
  debilitationSign: string;
  debilitationRashiNum: number; // 0 to 11
  naturalBenefic: boolean;
}

export const PLANET_DIGNITIES: Record<DashaLord, PlanetDignitySigns> = {
  Sun: {
    planet: "Sun",
    exaltationSign: "Aries (Mesha)",
    exaltationRashiNum: 0,
    debilitationSign: "Libra (Tula)",
    debilitationRashiNum: 6,
    naturalBenefic: false,
  },
  Moon: {
    planet: "Moon",
    exaltationSign: "Taurus (Vrishabha)",
    exaltationRashiNum: 1,
    debilitationSign: "Scorpio (Vrishchika)",
    debilitationRashiNum: 7,
    naturalBenefic: true,
  },
  Mars: {
    planet: "Mars",
    exaltationSign: "Capricorn (Makara)",
    exaltationRashiNum: 9,
    debilitationSign: "Cancer (Karka)",
    debilitationRashiNum: 3,
    naturalBenefic: false,
  },
  Mercury: {
    planet: "Mercury",
    exaltationSign: "Virgo (Kanya)",
    exaltationRashiNum: 5,
    debilitationSign: "Pisces (Meena)",
    debilitationRashiNum: 11,
    naturalBenefic: true,
  },
  Jupiter: {
    planet: "Jupiter",
    exaltationSign: "Cancer (Karka)",
    exaltationRashiNum: 3,
    debilitationSign: "Capricorn (Makara)",
    debilitationRashiNum: 9,
    naturalBenefic: true,
  },
  Venus: {
    planet: "Venus",
    exaltationSign: "Pisces (Meena)",
    exaltationRashiNum: 11,
    debilitationSign: "Virgo (Kanya)",
    debilitationRashiNum: 5,
    naturalBenefic: true,
  },
  Saturn: {
    planet: "Saturn",
    exaltationSign: "Libra (Tula)",
    exaltationRashiNum: 6,
    debilitationSign: "Aries (Mesha)",
    debilitationRashiNum: 0,
    naturalBenefic: false,
  },
  Rahu: {
    planet: "Rahu",
    exaltationSign: "Taurus (Vrishabha) / Gemini",
    exaltationRashiNum: 1,
    debilitationSign: "Scorpio (Vrishchika) / Sagittarius",
    debilitationRashiNum: 7,
    naturalBenefic: false,
  },
  Ketu: {
    planet: "Ketu",
    exaltationSign: "Scorpio (Vrishchika) / Sagittarius",
    exaltationRashiNum: 7,
    debilitationSign: "Taurus (Vrishabha) / Gemini",
    debilitationRashiNum: 1,
    naturalBenefic: false,
  },
};

export interface DashaTransitWindow {
  dashaLord: DashaLord;
  windowType: "ACTIVATION_WINDOW" | "CAUTION_WINDOW";
  triggerPlanet: "Sun" | "Jupiter";
  targetSign: string;
  targetRashiNum: number;
  expectedDuration: string;
  sourceDirective: string;
  strategicGuidance: string;
}

export interface TransitGrahaTaraBala {
  planet: string;
  transitLongitude: number;
  nakshatra: NakshatraData;
  pada: number;
  taraNum: number;
  tara: TaraDefinition;
  countedPosition: number;
  paryayaIntensity: "Base" | "Moderate" | "Peak";
  activityContext: "Execution / Progress" | "Caution / Deliberation" | "Grounding / Foundation";
}

/**
 * Computes the Dasha Activation & Caution Windows for a given Dasha Lord.
 */
export function evaluateDashaActivationWindows(
  dashaLord: DashaLord,
  isDashaConcern: boolean
): DashaTransitWindow[] {
  const dignity = PLANET_DIGNITIES[dashaLord];
  if (!dignity) return [];

  const windows: DashaTransitWindow[] = [];

  // Exaltation Trigger
  windows.push({
    dashaLord,
    windowType: "ACTIVATION_WINDOW",
    triggerPlanet: "Sun",
    targetSign: dignity.exaltationSign,
    targetRashiNum: dignity.exaltationRashiNum,
    expectedDuration: "1 Month (Annual transit)",
    sourceDirective: `Sun transit into ${dashaLord}'s exaltation sign (${dignity.exaltationSign}) illuminates the active dasha promise.`,
    strategicGuidance: isDashaConcern
      ? "Temporary solar reprieve and governmental or leadership clarity during an otherwise demanding dasha."
      : "Prime 30-day window for high-stakes decisions, leadership elevation, launches and decisive breakthroughs.",
  });

  windows.push({
    dashaLord,
    windowType: "ACTIVATION_WINDOW",
    triggerPlanet: "Jupiter",
    targetSign: dignity.exaltationSign,
    targetRashiNum: dignity.exaltationRashiNum,
    expectedDuration: "Approximately 1 Year (Every 12 years)",
    sourceDirective: `Jupiter transit into ${dashaLord}'s exaltation sign (${dignity.exaltationSign}) expands the highest dharmic potential of the period.`,
    strategicGuidance: isDashaConcern
      ? "Significant grace period providing structural mentors, judicial relief and moral protection against crisis."
      : "Golden Milestone Window: Long-term expansion, fortune, social prestige and compounding material success.",
  });

  // Debilitation Trigger
  windows.push({
    dashaLord,
    windowType: "CAUTION_WINDOW",
    triggerPlanet: "Sun",
    targetSign: dignity.debilitationSign,
    targetRashiNum: dignity.debilitationRashiNum,
    expectedDuration: "1 Month (Annual transit)",
    sourceDirective: `Sun transit into ${dashaLord}'s debilitation sign (${dignity.debilitationSign}) exposes systemic vulnerabilities.`,
    strategicGuidance: isDashaConcern
      ? "Peak Caution Phase: Avoid legal friction, aggressive confrontations or unvetted contracts during this 30-day window."
      : "Moderate friction: Energy levels may dip; avoid over-promising or engaging in bureaucratic entanglements.",
  });

  windows.push({
    dashaLord,
    windowType: "CAUTION_WINDOW",
    triggerPlanet: "Jupiter",
    targetSign: dignity.debilitationSign,
    targetRashiNum: dignity.debilitationRashiNum,
    expectedDuration: "Approximately 1 Year",
    sourceDirective: `Jupiter transit into ${dashaLord}'s debilitation sign (${dignity.debilitationSign}) limits external expansion.`,
    strategicGuidance:
      "Defensive consolidation phase: Prioritize debt reduction, internal audits, quiet competence and protective remedies.",
  });

  return windows;
}

/**
 * Evaluates Tara Bala for any transiting planet against the native's Birth Nakshatra.
 */
export function evaluateTransitGrahaTaraBala(
  planetName: string,
  transitLongitude: number,
  birthNakshatraId: number,
  jd: number,
  ayanamsa: SupportedAyanamsha = "Lahiri_Chitrapaksha"
): TransitGrahaTaraBala {
  const coord = resolveNakshatraCoordinate(transitLongitude, jd, ayanamsa);
  const nak = coord.nakshatra;
  const countedPos = calculateCountedPosition(birthNakshatraId, nak.id);
  const taraNum = calculateTaraNumber(birthNakshatraId, nak.id);
  const tara = CLASSICAL_TARAS[taraNum];
  const { paryayaIntensity } = getParyayaByPosition(countedPos);

  let activityContext: TransitGrahaTaraBala["activityContext"];
  if ([2, 4, 6, 8, 9].includes(taraNum)) {
    activityContext = "Execution / Progress";
  } else if ([3, 5, 7].includes(taraNum)) {
    activityContext = "Caution / Deliberation";
  } else {
    activityContext = "Grounding / Foundation";
  }

  return {
    planet: planetName,
    transitLongitude,
    nakshatra: nak,
    pada: coord.pada,
    taraNum,
    tara,
    countedPosition: countedPos,
    paryayaIntensity,
    activityContext,
  };
}
