/**
 * ============================================================================
 * ASTROLIFE — KP PREDICTIVE EVIDENCE ENGINE TYPES (PHASE 2I-A)
 * ============================================================================
 * Normalized data structures separating raw astronomical calculation from
 * deterministic predictive evidence.
 * ============================================================================
 */

import type { KPPlanet, KPPointName } from "./kp";

export type KPPointType = "planet" | "cusp" | "lagna";

export interface KPPointEvidence {
  id: string;
  name: KPPointName | string;
  type: KPPointType;
  longitude: number; // in KP unified coordinate frame [0, 360)
  sign: string;
  signLord: KPPlanet;
  signIndex: number; // 0..11
  nakshatra: string;
  starLord: KPPlanet;
  pada: number;
  subLord: KPPlanet;
  subSubLord: KPPlanet;

  // House context
  house: number; // occupied Placidus bhava (1..12)
  houseLord: KPPlanet; // lord of the cusp of this house
  occupiedHouse: number; // 1..12
  ownedHouses: number[]; // houses where this planet is sign lord of the cusp

  // Star lord's placement
  starLordOccupiedHouse: number;
  starLordOwnedHouses: number[];

  // Sub lord's placement
  subLordOccupiedHouse: number;
  subLordOwnedHouses: number[];

  retrograde?: boolean;
}

/**
 * The 4 Classical Grades of KP Significations:
 * Grade 1 (Level A - Strongest): Planet in the Star of an Occupant of House H
 * Grade 2 (Level B): Occupant of House H
 * Grade 3 (Level C): Planet in the Star of the Lord of House H
 * Grade 4 (Level D - Weakest): Lord of House H
 * Node_Representation: Rahu/Ketu acting as an agent for the planet/house
 */
export type SignificationGrade =
  | "Grade_1_StarOfOccupant"
  | "Grade_2_Occupant"
  | "Grade_3_StarOfLord"
  | "Grade_4_Lord"
  | "Node_Representation";

export interface SignificationDetail {
  house: number;
  grade: SignificationGrade;
  reason: string;
}

export interface PlanetSignifications {
  planet: KPPlanet;
  strongSignifications: number[]; // Grades 1 & 2 (and strong node agents)
  secondarySignifications: number[]; // Grades 3 & 4
  allSignifications: number[]; // Deduplicated houses in order of strength
  details: SignificationDetail[];
}

export interface HouseSignificators {
  house: number;
  grade1Planets: KPPlanet[]; // Planets in star of occupants
  grade2Planets: KPPlanet[]; // Occupants
  grade3Planets: KPPlanet[]; // Planets in star of house lord
  grade4Planets: KPPlanet[]; // House lord
  nodeAgents: Array<{ node: "Rahu" | "Ketu"; representingPlanet: KPPlanet; reason: string }>;
  allSignificators: KPPlanet[]; // Sorted from strongest (Grade 1) to weakest (Grade 4)
}

export type CuspPromiseStatus = "SUPPORTED" | "OBSTRUCTED" | "MIXED";

export interface CuspPromiseEvidence {
  cuspHouse: number;
  cuspSubLord: KPPlanet;
  cuspStarLord: KPPlanet;
  signifiedHouses: number[];
  favorableHouses: number[];
  detrimentHouses: number[];
  status: CuspPromiseStatus;
  primarySupport: boolean;
  detrimentPresent: boolean;
  reason: string;
  evidenceChain: string[];
}

export type EventPromiseStatus =
  | "SUPPORTED"
  | "OBSTRUCTED"
  | "MIXED"
  | "INCONCLUSIVE"
  | "REFERENCE_PENDING";

export type SignificationStrength =
  | "GRADE_1"
  | "GRADE_2"
  | "GRADE_3"
  | "GRADE_4"
  | "MULTI_GRADE"
  | "NONE";

export interface KPEventPromiseResult {
  ruleId: string;
  ruleName: string;
  category: string;
  ruleStatus: "Verified" | "Provisional" | "Reference_Pending";
  canonicalSource: string;

  primaryCusp: number;
  cuspLord: KPPlanet;
  primaryCuspStarLord: KPPlanet;
  primaryCuspSubLord: KPPlanet;
  cuspSubLord?: KPPlanet; // convenience alias

  status: EventPromiseStatus;
  significationStrength: SignificationStrength;

  signifiedHouses: number[];
  supportingHousesMatched: number[];
  facilitatingHousesMatched: number[];
  detrimentHousesMatched: number[];
  barrierHousesMatched: number[];

  evidenceDetails: SignificationDetail[];

  summary: string;
  evidenceChain: string[];
}

export interface KPPredictiveEvidence {
  pointEvidence: Record<string, KPPointEvidence>;
  houseSignificators: Record<number, HouseSignificators>;
  planetSignifications: Record<KPPlanet, PlanetSignifications>;
  cuspPromises: Record<number, CuspPromiseEvidence>;
  eventPromises?: Record<string, KPEventPromiseResult>;
}

