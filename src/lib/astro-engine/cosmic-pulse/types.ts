import type { PlanetName } from "../transits";
export type { PlanetName };

export type TriggerSeverity = "critical" | "caution" | "opportunity" | "horizon" | "info";

export type AspectLifecycle = "approaching" | "peak" | "separating";

export type LifeArea =
  | "career"
  | "wealth"
  | "relationships"
  | "health"
  | "spirituality"
  | "home"
  | "education"
  | "mindset";

export interface EducationalConcept {
  title: string;
  sanskritTerm?: string;
  howItWorks: string;
  whyItMatters: string;
  classicalRule: string;
}

export interface AspectEvidence {
  aspectType: string;
  planetA: PlanetName;
  planetB: PlanetName;
  longitudeA: number;
  longitudeB: number;
  exactAspectDeg: number;
  currentOrbDeg: number;
  isApplying: boolean;
  shastraReference: string;
}

export interface PulseTrigger {
  id: string;
  title: string;
  headline: string;
  severity: TriggerSeverity;
  lifecycle: AspectLifecycle;
  primaryPlanets: PlanetName[];
  lifeAreas: LifeArea[];
  activatedHouses: number[];
  orbDescription: string;
  evidence: AspectEvidence;
  learning: EducationalConcept;
  guidance: string;
  action: string;
  precaution?: string;
  supportingSignals?: string[];
}

export type TaraType =
  | "Janma"
  | "Sampat"
  | "Vipat"
  | "Kshema"
  | "Pratyak"
  | "Sadhana"
  | "Naidhana"
  | "Mitra"
  | "Parama Mitra";

export interface TaraBalaModifier {
  number: number;
  name: TaraType;
  quality: "supportive" | "caution" | "neutral";
  birthNakshatra: string;
  transitNakshatra: string;
  guidance: string;
  learning: EducationalConcept;
}

export interface ChandraBalaModifier {
  houseFromNatalMoon: number;
  natalMoonSign: string;
  transitMoonSign: string;
  isSupportive: boolean;
  isAshtamaChandra: boolean;
  guidance: string;
  learning: EducationalConcept;
}

export interface MicroTimingWindow {
  actionWindow: {
    name: string;
    start: string;
    end: string;
    guidance: string;
  };
  avoidWindow: {
    name: string;
    start: string;
    end: string;
    guidance: string;
  };
  learning: EducationalConcept;
}

export interface DashaMilestone {
  type: "mahadasha_sandhi" | "antardasha_shift" | "active_flow";
  currentLord: string;
  nextLord?: string;
  daysRemaining: number;
  transitionDate: string;
  headline: string;
  guidance: string;
  learning: EducationalConcept;
}

export interface CosmicPulseResult {
  date: string;
  dominantTrigger: PulseTrigger | null;
  activeTriggers: PulseTrigger[];
  upcomingTriggers: PulseTrigger[];
  taraBala: TaraBalaModifier;
  chandraBala: ChandraBalaModifier;
  microTiming: MicroTimingWindow;
  dashaMilestone: DashaMilestone | null;
  microRemedy: {
    behavioralReset: string;
    traditionalUpaya: string;
    durationMinutes: number;
  };
}

