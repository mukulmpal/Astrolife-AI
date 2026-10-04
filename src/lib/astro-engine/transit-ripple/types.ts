/**
 * ============================================================================
 * ASTROLIFE — TRANSIT RIPPLE 2.0 TYPE DEFINITIONS
 * ============================================================================
 * Clean architectural models with:
 * - Deterministic facts from calculation engine
 * - Conversational chapter narrative (ZERO numeric scores)
 * - Parashari drishti hits and multi-aspect cluster hotspots
 * - Multi-layer Navatara intelligence (Mahadasha x Antardasha x Daily Gochar)
 * ============================================================================
 */

export type TransitPlanet =
  | "Saturn"
  | "Jupiter"
  | "Rahu"
  | "Ketu"
  | "Mars"
  | "Sun"
  | "Moon"
  | "Venus"
  | "Mercury";

export type RahuKetuAspectProfile = "5_7_9" | "3_10" | "7_ONLY";

export interface NatalInput {
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  timezone: string;
  latitude: number;
  longitude: number;
  lagnaSign: number; // 0 to 11
  lagnaSignName?: string;
  moonLongitude: number;
  moonNakshatra: number; // 0 to 26
  activeMahadasha?: string;
  activeAntardasha?: string;
}

export interface TransitPlanetPosition {
  planet: TransitPlanet;
  longitude: number;
  signIndex: number; // 0 to 11
  signName: string;
  degreeInSign: number;
  speed: number;
  isRetrograde: boolean;
  nakshatraIndex: number; // 0 to 26
  nakshatraName: string;
  house: number; // 1 to 12 from Lagna (Whole Sign)
}

export interface AspectRule {
  offset: number; // e.g. 3, 4, 5, 7, 8, 9, 10
  name: string; // e.g. "3rd Drishti", "7th Drishti", "10th Drishti"
  nature: "special" | "full";
}

export interface DrishtiHit {
  planet: TransitPlanet;
  sourceHouse: number;
  targetHouse: number;
  aspectRule: AspectRule;
}

export interface HouseClusterAnalysis {
  house: number;
  residentPlanets: TransitPlanet[];
  incomingRays: DrishtiHit[];
  totalRays: number; // resident count + incoming aspect count
  isHotspot: boolean; // true if totalRays >= 2
  intensityLevel: "light" | "active" | "hotspot" | "critical";
}

export interface HouseImpactDetail {
  house: number;
  planet: TransitPlanet;
  roleTag: "Epicenter" | string; // e.g. "Epicenter", "10th Drishti", "7th Drishti"
  title: string;
  text: string;
  isHotspot: boolean;
  hitsCount: number;
}

export interface DashaLordTaraInfo {
  lord: string;
  nakshatraName: string;
  nakshatraId: number; // 0 to 26
  taraNumber: number; // 1 to 9
  taraName: string;
  category: "favourable" | "caution" | "moderate";
  signification: string;
  statusTag: string; // e.g. "Wealth & Inflow" or "Relief Window" or "High Friction"
}

export interface CompleteNavataraIntelligence {
  dailyTransitMoon: {
    birthNakshatra: string;
    transitingMoonNakshatra: string;
    taraNumber: number;
    taraName: string;
    category: "favourable" | "caution" | "moderate";
    guidance: string;
  };
  mahadashaTara: DashaLordTaraInfo;
  antardashaTara?: DashaLordTaraInfo;
  triangulation: {
    pattern:
      | "TRIPLE_SUPPORT"
      | "DOUBLE_SUPPORT"
      | "RELIEF_WINDOW"
      | "HEIGHTENED_CAUTION"
      | "TACTICAL_PACE";
    headline: string;
    synthesisStory: string;
  };
}

export interface ChapterNarrative {
  chapterTitle: string;
  dashaGocharFusion: string;
  activeMahadasha: string;
  activeAntardasha: string;
  isDashaLordActiveInTransit: boolean;
  focalHouseNumber: number; // The most activated house (hotspot)
  focalHouseName: string;
  houseImpacts: HouseImpactDetail[];
  defensiveCautions: string[]; // 🛡️ Kahan Sambhalna Hai
  offensiveOpportunities: string[]; // 🚀 Kahan Action Lena Hai
  navataraIntelligence: CompleteNavataraIntelligence;
  navataraSync: CompleteNavataraIntelligence["dailyTransitMoon"]; // backward compatibility
  sattvicUpaya: string[]; // 🧘 Practical daily lifestyle karma alignment
  language: "hinglish" | "english";
}

export interface TransitRippleResult {
  scanDate: string; // YYYY-MM-DD
  natal: NatalInput;
  transitPositions: Record<TransitPlanet, TransitPlanetPosition>;
  allDrishtiHits: DrishtiHit[];
  houseClusters: Record<number, HouseClusterAnalysis>;
  hotspotHouses: number[]; // houses with >= 2 or >= 3 rays
  selectedPlanet: TransitPlanet;
  selectedPlanetRipples: {
    epicenterHouse: number;
    aspectHouses: number[];
    drishtiHits: DrishtiHit[];
  };
  narrative: ChapterNarrative;
}

