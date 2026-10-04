/**
 * ============================================================================
 * ASTROLIFE — TRANSIT RIPPLE 2.0 TRANSIT & RIPPLE CALCULATOR
 * ============================================================================
 * High-precision Swiss/Moshier Ephemeris calculation of Sidereal Lahiri
 * transits, Whole Sign house mapping, multi-house aspect intersection clustering,
 * and comprehensive Multi-Layer Navatara (Mahadasha x Antardasha x Daily Gochar).
 * ============================================================================
 */

import { calculateChart, type ChartData } from "../calculations";
import {
  calculateCountedPosition,
  calculateTaraNumber,
  CLASSICAL_TARAS,
} from "../navtara-engine";
import {
  computeDrishtiHitsForPlanet,
  HOUSE_NAMES,
  SIGN_NAMES,
  NAKSHATRA_NAMES,
} from "./aspect-profiles";
import type {
  NatalInput,
  TransitPlanet,
  TransitPlanetPosition,
  DrishtiHit,
  HouseClusterAnalysis,
  RahuKetuAspectProfile,
  CompleteNavataraIntelligence,
  DashaLordTaraInfo,
} from "./types";

export const ALL_TRANSIT_PLANETS: TransitPlanet[] = [
  "Saturn",
  "Jupiter",
  "Rahu",
  "Ketu",
  "Mars",
  "Sun",
  "Moon",
  "Venus",
  "Mercury",
];

function pad2(val: number): string {
  return String(val).padStart(2, "0");
}

export function getTodayDateString(timezone = 5.5): string {
  const now = new Date();
  const shifted = new Date(now.getTime() + timezone * 60 * 60 * 1000);
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`;
}

export function getSignIndexByName(name: string): number {
  const clean = (name || "").trim().toLowerCase();
  const idx = SIGN_NAMES.findIndex((s) => s.toLowerCase() === clean);
  return idx >= 0 ? idx : 0;
}

export interface TransitCalculationOptions {
  scanDate?: string; // YYYY-MM-DD (defaults to today)
  selectedPlanet?: TransitPlanet; // default "Saturn"
  rahuKetuProfile?: RahuKetuAspectProfile; // default "5_7_9"
  ephemerisTime?: string; // default "12:00:00"
}

export interface TransitCalculationOutput {
  scanDate: string;
  transitPositions: Record<TransitPlanet, TransitPlanetPosition>;
  allDrishtiHits: DrishtiHit[];
  houseClusters: Record<number, HouseClusterAnalysis>;
  hotspotHouses: number[];
  focalHouseNumber: number;
  selectedPlanet: TransitPlanet;
  selectedPlanetRipples: {
    epicenterHouse: number;
    aspectHouses: number[];
    drishtiHits: DrishtiHit[];
  };
  navataraIntelligence: CompleteNavataraIntelligence;
  navataraSync: CompleteNavataraIntelligence["dailyTransitMoon"];
  activeMahadasha: string;
  activeAntardasha: string;
  isDashaLordActiveInTransit: boolean;
}

export function calculateTransitRippleData(
  natal: NatalInput,
  options?: TransitCalculationOptions
): TransitCalculationOutput {
  const scanDate = options?.scanDate || getTodayDateString();
  const ephemTime = options?.ephemerisTime || "12:00:00";
  const selectedPlanet = options?.selectedPlanet || "Saturn";
  const rahuKetuProfile = options?.rahuKetuProfile || "5_7_9";

  const tzNum = Number(natal.timezone) || 5.5;

  // 1. Calculate Ephemeris for Transit Date
  const transitChart: ChartData = calculateChart(
    "Transit",
    scanDate,
    ephemTime,
    "TransitCity",
    natal.latitude,
    natal.longitude,
    tzNum
  );

  // 2. Map All 9 Planets into Sidereal Whole Sign Houses from Natal Lagna
  const transitPositions: Record<TransitPlanet, TransitPlanetPosition> = {} as any;

  for (const planet of ALL_TRANSIT_PLANETS) {
    const pData = transitChart.planets[planet];
    const lon = pData ? pData.lon : 0;
    const signIdx = Math.floor(lon / 30) % 12;
    const degInSign = lon % 30;
    const nakIdx = Math.floor(lon / (360 / 27)) % 27;

    // Whole Sign House formula from natal Lagna
    const house = (((signIdx - natal.lagnaSign) % 12) + 12) % 12 + 1;

    transitPositions[planet] = {
      planet,
      longitude: lon,
      signIndex: signIdx,
      signName: SIGN_NAMES[signIdx],
      degreeInSign: degInSign,
      speed: pData ? (pData.retrograde ? -0.1 : 0.5) : 0,
      isRetrograde: pData ? pData.retrograde : false,
      nakshatraIndex: nakIdx,
      nakshatraName: NAKSHATRA_NAMES[nakIdx],
      house,
    };
  }

  // 3. Compute Drishti Rays for All Planets
  const allDrishtiHits: DrishtiHit[] = [];
  for (const planet of ALL_TRANSIT_PLANETS) {
    const pos = transitPositions[planet];
    const hits = computeDrishtiHitsForPlanet(planet, pos.house, rahuKetuProfile);
    allDrishtiHits.push(...hits);
  }

  // 4. Cluster Analysis & Multi-Ray Hotspot Detection (Houses 1 to 12)
  const houseClusters: Record<number, HouseClusterAnalysis> = {};
  const hotspotHouses: number[] = [];

  for (let h = 1; h <= 12; h++) {
    const residents = ALL_TRANSIT_PLANETS.filter(
      (p) => transitPositions[p].house === h
    );
    const incoming = allDrishtiHits.filter((hit) => hit.targetHouse === h);
    const totalRays = residents.length + incoming.length;

    let intensityLevel: HouseClusterAnalysis["intensityLevel"] = "light";
    if (totalRays >= 4) intensityLevel = "critical";
    else if (totalRays >= 3) intensityLevel = "hotspot";
    else if (totalRays >= 2) intensityLevel = "active";

    const isHotspot = totalRays >= 2;
    if (isHotspot) {
      hotspotHouses.push(h);
    }

    houseClusters[h] = {
      house: h,
      residentPlanets: residents,
      incomingRays: incoming,
      totalRays,
      isHotspot,
      intensityLevel,
    };
  }

  // Sort hotspots by descending total ray intensity
  hotspotHouses.sort(
    (a, b) => houseClusters[b].totalRays - houseClusters[a].totalRays
  );

  // Determine focal house (primary hotspot, or selected planet's house if no cluster)
  const focalHouseNumber =
    hotspotHouses.length > 0
      ? hotspotHouses[0]
      : transitPositions[selectedPlanet]?.house || 1;

  // Selected planet ripples
  const selPos = transitPositions[selectedPlanet];
  const selHits = allDrishtiHits.filter(
    (hit) => hit.planet === selectedPlanet
  );
  const aspectHouses = Array.from(
    new Set(selHits.map((hit) => hit.targetHouse))
  ).sort((a, b) => a - b);

  const selectedPlanetRipples = {
    epicenterHouse: selPos?.house || 1,
    aspectHouses,
    drishtiHits: selHits,
  };

  // 5. Multi-Layer Navatara Intelligence (MD x AD x Daily Gochar)
  const birthNakId = natal.moonNakshatra; // 0 to 26
  const birthNakName = NAKSHATRA_NAMES[birthNakId] || "Anuradha";

  // Layer A: Daily Gochara Moon Tara
  const transitMoonNakId = transitPositions.Moon.nakshatraIndex;
  const transitMoonNakName = transitPositions.Moon.nakshatraName;
  const dailyTaraNum = calculateTaraNumber(birthNakId, transitMoonNakId);
  const dailyTaraDef = CLASSICAL_TARAS[dailyTaraNum] || CLASSICAL_TARAS[1];

  let dailyCategory: "favourable" | "caution" | "moderate" = "moderate";
  if ([2, 4, 6, 8, 9].includes(dailyTaraNum)) {
    dailyCategory = "favourable";
  } else if ([3, 5, 7].includes(dailyTaraNum)) {
    dailyCategory = "caution";
  }

  const dailyTransitMoon = {
    birthNakshatra: birthNakName,
    transitingMoonNakshatra: transitMoonNakName,
    taraNumber: dailyTaraNum,
    taraName: dailyTaraDef.name,
    category: dailyCategory,
    guidance: dailyTaraDef.signification,
  };

  // Calculate Natal Chart for Dasha Lords' Nakshatras
  const natalChart: ChartData = calculateChart(
    "Natal",
    natal.birthDate,
    natal.birthTime,
    "BirthCity",
    natal.latitude,
    natal.longitude,
    tzNum
  );

  const activeMahadasha = natal.activeMahadasha || "Jupiter";
  const activeAntardasha = natal.activeAntardasha || "Saturn";

  // Helper to build Dasha Lord Tara Info
  function evaluateLordTara(lordName: string): DashaLordTaraInfo {
    const pData = natalChart.planets[lordName];
    const lon = pData ? pData.lon : 0;
    const nakId = Math.floor(lon / (360 / 27)) % 27;
    const nakName = NAKSHATRA_NAMES[nakId] || "Pushya";
    const taraNum = calculateTaraNumber(birthNakId, nakId);
    const taraDef = CLASSICAL_TARAS[taraNum] || CLASSICAL_TARAS[1];

    let category: "favourable" | "caution" | "moderate" = "moderate";
    let statusTag = "Steady Continuity";

    if ([2, 4, 6, 8, 9].includes(taraNum)) {
      category = "favourable";
      statusTag =
        taraNum === 2
          ? "Sampat (Resource Expansion)"
          : taraNum === 4
          ? "Kshema (Security & Consolidation)"
          : taraNum === 6
          ? "Sadhaka (Execution Breakthrough)"
          : taraNum === 8
          ? "Mitra (Supportive Allies)"
          : "Parama Mitra (Supreme Grace)";
    } else if ([3, 5, 7].includes(taraNum)) {
      category = "caution";
      statusTag =
        taraNum === 3
          ? "Vipat (Tactical Safeguards)"
          : taraNum === 5
          ? "Pratyari (Diplomatic Restraint)"
          : "Vadha (Strategic Conservatism)";
    } else {
      statusTag = "Janma (Core Constitutional Focus)";
    }

    return {
      lord: lordName,
      nakshatraName: nakName,
      nakshatraId: nakId,
      taraNumber: taraNum,
      taraName: taraDef.name,
      category,
      signification: taraDef.signification,
      statusTag,
    };
  }

  // Layer B: Mahadasha Lord Navatara
  const mahadashaTara = evaluateLordTara(activeMahadasha);

  // Layer C: Antardasha Lord Navatara
  const antardashaTara = evaluateLordTara(activeAntardasha);

  // Tri-Layer Triangulation (MD x AD x Gochar)
  let pattern: CompleteNavataraIntelligence["triangulation"]["pattern"] =
    "DOUBLE_SUPPORT";
  let headline = "";
  let synthesisStory = "";

  const isMDGood = mahadashaTara.category === "favourable";
  const isADGood = antardashaTara.category === "favourable";
  const isDailyGood = dailyCategory === "favourable";

  if (isMDGood && isADGood && isDailyGood) {
    pattern = "TRIPLE_SUPPORT";
    headline = "त्रिगुणी शुभ समन्वय (Triple Auspicious Harmony)";
    synthesisStory = `Mahadasha Lord (${activeMahadasha}) operates through ${mahadashaTara.taraName} Tara, Antardasha Lord (${activeAntardasha}) operates through ${antardashaTara.taraName} Tara, and today's Moon Gochara resonates in ${dailyTransitMoon.taraName} Tara. This creates a synchronous triple-support window where macro planning, medium-term timing, and daily actions compound with minimal friction.`;
  } else if (!isMDGood && isADGood) {
    pattern = "RELIEF_WINDOW";
    headline = "राहत एवं समाधान की खिड़की (Constructive Relief Window)";
    synthesisStory = `While Mahadasha Lord (${activeMahadasha}) operates through ${mahadashaTara.taraName} Tara requiring defensive patience, the active Antardasha of ${activeAntardasha} brings supportive ${antardashaTara.taraName} Tara energy. This unlocks a tactical resolution window to settle outstanding hurdles with calm diligence.`;
  } else if (!isMDGood && !isADGood) {
    pattern = "HEIGHTENED_CAUTION";
    headline = "संरचनात्मक सजगता एवं धैर्य (Heightened Strategic Conservatism)";
    synthesisStory = `Both Mahadasha Lord (${activeMahadasha}) in ${mahadashaTara.taraName} Tara and Antardasha Lord (${activeAntardasha}) in ${antardashaTara.taraName} Tara advise measured conservatism. Rely on routine diligence, avoid speculative legal or financial stakes, and protect your inner rhythm.`;
  } else if (isMDGood && !isADGood) {
    pattern = "TACTICAL_PACE";
    headline = "रणनीतिक सामंजस्य (Strategic Tactical Calibration)";
    synthesisStory = `The overarching Mahadasha is blessed with ${mahadashaTara.taraName} Tara strength, though the current Antardasha of ${activeAntardasha} introduces ${antardashaTara.taraName} Tara friction. The big picture remains supportive, but daily commitments require meticulous documentation and grounded speech.`;
  } else {
    pattern = "DOUBLE_SUPPORT";
    headline = "सकारात्मक संवेग (Productive Continuity)";
    synthesisStory = `Your Dasha and Gochar operate with constructive baseline stability. Focus on steady, structured habits to compound lasting gains.`;
  }

  const navataraIntelligence: CompleteNavataraIntelligence = {
    dailyTransitMoon,
    mahadashaTara,
    antardashaTara,
    triangulation: {
      pattern,
      headline,
      synthesisStory,
    },
  };

  const isDashaLordActiveInTransit =
    selectedPlanet === activeMahadasha || selectedPlanet === activeAntardasha;

  return {
    scanDate,
    transitPositions,
    allDrishtiHits,
    houseClusters,
    hotspotHouses,
    focalHouseNumber,
    selectedPlanet,
    selectedPlanetRipples,
    navataraIntelligence,
    navataraSync: dailyTransitMoon,
    activeMahadasha,
    activeAntardasha,
    isDashaLordActiveInTransit,
  };
}

