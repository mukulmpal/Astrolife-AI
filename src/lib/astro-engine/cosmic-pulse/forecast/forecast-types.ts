import type { PlanetName } from "../../transits";
import type { TriggerSeverity, LifeArea, AspectEvidence, PulseTrigger } from "../types";

export type CosmicEventType =
  | "transit_hit"
  | "planetary_aspect"
  | "dasha_milestone"
  | "retrograde_station";

export type EventRelevanceTier = "primary" | "supporting" | "background";

export interface ContactTiming {
  contactAt: Date;      // Moment aspect enters the defined orb threshold
  exactAt?: Date;       // Moment aspect reaches mathematical 0°00' error
  peakAt: Date;         // Moment of minimum angular separation
  separationAt: Date;   // Moment aspect exits defined orb threshold
}

export interface RetrogradePassInfo {
  isRetrograde: boolean;
  passNumber: number;            // 1 = first pass, 2 = retrograde second pass, 3 = third direct pass
  totalPassesEstimated?: number; // Estimated 1 or 3
}

export interface CalculationProvenance {
  calculationBasis: string[];
  searchIntervalDays: number;
  numericalRefinementMethod: string;
  localTz: number;
}

export interface CosmicForecastEvent {
  id: string;
  type: CosmicEventType;
  title: string;
  headline: string;
  planets: PlanetName[];
  aspectType: string;
  targetAngle: number;
  natalHouse?: number;
  transitHouse?: number;
  lifeAreas: LifeArea[];
  severity: TriggerSeverity;
  timing: ContactTiming;
  retrogradeInfo?: RetrogradePassInfo;
  relevanceTier: EventRelevanceTier;
  evidence: AspectEvidence;
  provenance: CalculationProvenance;
  dashaContext?: {
    mahadasha: string;
    antardasha?: string;
  };
}

export interface RadarHorizon {
  generatedAt: string;
  now: PulseTrigger[];
  next30Days: CosmicForecastEvent[];
  next90Days: CosmicForecastEvent[];
  relevanceCounts?: {
    primary: number;
    supporting: number;
    background: number;
  };
}

