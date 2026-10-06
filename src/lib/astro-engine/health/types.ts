/**
 * ============================================================================
 * ASTROLIFE — HEALTH & ASTRO-MEDICAL INTELLIGENCE ENGINE TYPES
 * ============================================================================
 * Core type definitions for multi-layer medical astrology:
 * - KP Cuspal Sub-Lord hierarchy (1st, 6th, 8th, 12th vs 1st, 5th, 11th)
 * - Planetary medical knowledge graph & body domains
 * - Dasha timing & health vector activation
 * - Non-invasive, safe traditional remedies (Karmic Dana, Dinacharya, Mantras)
 * - Emergency safety guardrails & non-diagnostic boundaries
 * - Live transcript casebook reference structures
 * ============================================================================
 */

import type { KPPlanet } from "../kp";

export type DoshaType = "Vata" | "Pitta" | "Kapha" | "Tridosha" | "Vata-Pitta" | "Pitta-Kapha" | "Vata-Kapha";

export type HealthCategory =
  | "constitution"      // 1st house vitality, defense, resilience
  | "disease_domain"    // 6th house acute illness, susceptibility
  | "chronicity"        // 8th house complications, chronic conditions, crisis
  | "hospitalization"   // 12th house inpatient, confinement, vital drain
  | "recovery"          // 1, 5, 11 relief, cure, convalescence, treatment gains
  | "surgery"           // 8 + Mars + Ketu surgical intervention context
  | "combination"       // Multi-planet conjunctions/aspects
  | "dosha";            // Ayurvedic dosha balance

export type HealthDomain =
  | "cardiovascular"    // Heart, BP fluctuation, circulation, pulse
  | "respiratory"       // Lungs, bronchi, asthma, cough, tonsils
  | "neurological"      // Central/peripheral nervous system, brain, paralysis
  | "musculoskeletal"   // Spine, bones, joints, arthritis, calcium
  | "hematological"     // Blood, hemoglobin, acute inflammation, marrow
  | "renal_urinary"     // Kidneys, filtration, stones, urinary tract
  | "reproductive"      // Reproductive organs, hormonal glands
  | "dermatological"    // Skin texture, eczema, allergy, rashes
  | "digestive"         // Stomach, digestive fire, acidity, liver, gallbladder
  | "metabolic"         // Pancreas, sugar/diabetes, obesity, thyroid, hyperplasia
  | "ophthalmology"     // Eyes, vision, retina
  | "mental_emotional"; // Sleep, stress, psychiatric anxiety, psychosomatic

export type RemedyType =
  | "karmic_charity"          // Dana: medicine for the needy, animal care, food
  | "ayurvedic_lifestyle"     // Dinacharya, hydration, cold/heat protection
  | "mantra_meditation"       // Sound vibration, Maha Mrityunjaya, breathwork
  | "treatment_modality"      // Traditional symbolism of medical discipline (Allopathy, Ayurveda, etc.)
  | "dietary_guideline"       // Dosha balancing food and water habits
  | "clinical_vigilance";     // Timely checkups, doctor consultations, routine tests

export interface HealthRemedy {
  id: string;
  title: string;
  type: RemedyType;
  planet?: KPPlanet;
  domain?: HealthDomain;
  doshaAffinity?: DoshaType;
  description: string;
  actionableSteps: string[];
  traditionalRationale: string;
  safetyNote: string;
}

export interface SixteenDayRemedyProtocol {
  planet: KPPlanet;
  clothColor: string;
  material: string;
  packetCount: number; // Always 16
  burnMethod: string;
  disposalDestination: "Kitchen Sink" | "Toilet Flush";
  disposalDetails: string;
  recommendedTiming: string;
  strictFoodAvoidance: string;
  specialConditionNotes?: string;
}

export interface SpecialTranscriptGuideline {
  id: string;
  title: string;
  condition: string;
  traditionalRule: string;
  actionableAdvice: string;
}

export interface MedicalRule {
  id: string;
  name: string;
  category: HealthCategory;
  domain: HealthDomain;
  targetHouses: number[];
  favorableRecoveryHouses?: number[];
  planets: KPPlanet[];
  requiredConditions?: {
    cuspSubLordOf?: number[];
    starLordHouses?: number[];
    minPlanetsMatching?: number;
  };
  doshaAffinity?: DoshaType;
  traditionalInterpretation: string;
  clinicalGuidance: string;
  severityWeight: number; // 1 to 10
  recoveryEffect: number; // -5 to +10
  status: "Canon_KP" | "Transcript_Verified" | "Traditional_Classical";
  medicalSafety: "Non_Diagnostic" | "High_Sensitivity_Advisory";
}

export interface MedicalCase {
  id: string;
  title: string;
  source: "Transcript_Classroom_Case" | "KP_Reader_Case";
  reportedSymptoms: string[];
  bodySystems: HealthDomain[];
  chartSignifiers: {
    primaryPlanets: KPPlanet[];
    housesInvolved: number[];
    cuspSubLords: {
      cusp1CSL?: KPPlanet;
      cusp6CSL?: KPPlanet;
      cusp8CSL?: KPPlanet;
      cusp12CSL?: KPPlanet;
    };
    dashaAtOnset: {
      mahadasha: KPPlanet;
      antardasha: KPPlanet;
      pratyantar?: KPPlanet;
    };
  };
  combinationRulesTriggered: string[];
  teacherInterpretation: string;
  remedySymbolism?: string;
  caseOutcomeNotes?: string;
  relevanceConfidence: number;
}

export type RepetitionConfidenceLevel =
  | "Low"
  | "Moderate"
  | "Strong"
  | "Very_Strong_Traditional_Pattern";

export interface HealthScorecard {
  constitutionalVitality: number; // 0..100: Resilience & natural defense
  diseaseSensitivity: number;     // 0..100: 6th cusp & pathogenic activation
  chronicityFactor: number;       // 0..100: 8th cusp & persistence tendency
  confinementIndex: number;       // 0..100: 12th cusp & bed-rest / medical drain
  recoveryResilience: number;     // 0..100: 1, 5, 11 healing & treatment response
  dashaActivationLoad: number;    // 0..100: How intensely current MD/AD touches 6/8/12
  repetitionConfidence: RepetitionConfidenceLevel;
}

export type DashaPhaseNature =
  | "Recovery_Dominant"
  | "Neutral_Maintenance"
  | "Vigilance_Recommended"
  | "High_Stress_Watch";

export interface DashaHealthVector {
  mahadasha: KPPlanet;
  antardasha: KPPlanet;
  pratyantar?: KPPlanet;
  mdStartDate?: string;
  mdEndDate?: string;
  adStartDate?: string;
  adEndDate?: string;
  activeDomains: HealthDomain[];
  activeBodySystems: string[];
  healthHousesSignified: number[];
  recoveryHousesSignified: number[];
  phaseNature: DashaPhaseNature;
  doshaTendency: DoshaType;
  recommendedRemedies: HealthRemedy[];
  upcomingTransition?: {
    nextAntardasha: KPPlanet;
    startDate: string;
    expectedShift: string;
    isRecoveryWindow: boolean;
  };
}

export interface ExplainabilityChain {
  conclusion: string;
  cuspEvidence: string[];
  dashaEvidence: string[];
  repetitionEvidence: string[];
  caseMatches: Array<{
    caseId: string;
    title: string;
    matchScore: number;
    reason: string;
  }>;
  modalitySymbolism?: {
    planet: KPPlanet;
    modality: string;
    rationale: string;
  };
}

export interface DomainHealthAssessment {
  domain: HealthDomain;
  label: string;
  organSystems: string[];
  score: number;
  dosha: DoshaType;
  traditionalThemes: string[];
  activeRules: string[];
}

export interface PersonalCureModality {
  cusp5CSL: KPPlanet;
  cslStarLord: KPPlanet;
  recommendedModality: string;
  treatmentLine: string;
  rationale: string;
  specialCaution?: string;
}

export interface MedicalEngineResult {
  scorecard: HealthScorecard;
  dashaHealth: DashaHealthVector;
  domainAssessments: DomainHealthAssessment[];
  recoveryAnalysis: {
    potential: "High" | "Moderate" | "Low";
    supportiveHouses: number[];
    summary: string;
  };
  explainability: ExplainabilityChain;
  matchedCases: MedicalCase[];
  curatedRemedies: HealthRemedy[];
  sixteenDayProtocols?: SixteenDayRemedyProtocol[];
  specialGuidelines?: SpecialTranscriptGuideline[];
  personalCureModality?: PersonalCureModality;
  safetyDisclaimers: string[];
  isEmergencyInterrupted: boolean;
  emergencyAlert?: string;
}
