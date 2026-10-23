/**
 * ============================================================================
 * ASTROLIFE — BACKWARD COMPATIBILITY ADAPTER
 * ============================================================================
 * Adapts the modern rich 5-domain narrative structure into the legacy
 * ChapterNarrative interface while maintaining zero-breakage across existing UI.
 * ============================================================================
 */

import type { ChapterNarrative } from "./types";
import type { LifeDomain } from "./real-life-matrix";

export interface DomainNarrativeBlock {
  domain: LifeDomain;
  domainName: string;
  icon: string;
  paragraph: string;
}

export interface TodayPulseData {
  scanDate: string;
  taraName: string;
  taraNumber: number;
  moonNakshatra: string;
  seasonTag: string;
  headline: string;
}

export interface FocalHotspotStory {
  house: number;
  title: string;
  paragraph: string;
  whyItMatters: string;
}

export interface ShastraProofData {
  epicenter: {
    planet: string;
    house: number;
    sign: number;
    signName: string;
    degrees: number;
  };
  aspectRays: Array<{
    targetHouse: number;
    rule: string;
    isHotspot: boolean;
  }>;
  activeMahadasha: string;
  activeAntardasha: string;
  navataraCalculation: string;
}

export interface RichChapterNarrative extends ChapterNarrative {
  todayPulse: TodayPulseData;
  focalHotspotStory: FocalHotspotStory;
  domainCautions: DomainNarrativeBlock[];
  domainActions: DomainNarrativeBlock[];
  shastraProof: ShastraProofData;
}

/**
 * Ensures a RichChapterNarrative safely satisfies all ChapterNarrative properties.
 */
export function toLegacyChapterNarrative(
  rich: RichChapterNarrative
): ChapterNarrative {
  // If defensiveCautions or offensiveOpportunities are empty, map from domains
  const defensiveCautions =
    rich.defensiveCautions && rich.defensiveCautions.length > 0
      ? rich.defensiveCautions
      : rich.domainCautions.map(
          (dc) => `${dc.icon} ${dc.domainName}: ${dc.paragraph}`
        );

  const offensiveOpportunities =
    rich.offensiveOpportunities && rich.offensiveOpportunities.length > 0
      ? rich.offensiveOpportunities
      : rich.domainActions.map(
          (da) => `${da.icon} ${da.domainName}: ${da.paragraph}`
        );

  return {
    ...rich,
    defensiveCautions,
    offensiveOpportunities,
  };
}
