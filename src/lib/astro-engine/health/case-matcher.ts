/**
 * ============================================================================
 * ASTROLIFE — CASE MATCHER & PATTERN RECOGNITION (PHASE 2I-MED)
 * ============================================================================
 * Compares natal chart health vectors and running dasha against ground-truth
 * classroom cases from the teacher transcript casebook.
 * ============================================================================
 */

import type { KPPlanet } from "../kp";
import type { MedicalCase } from "./types";
import { MEDICAL_CASEBOOK } from "./case-database";

export interface MatchCandidate {
  activePlanets: KPPlanet[];
  activeHouses: number[];
  cusp6CSL?: KPPlanet;
  mdLord?: KPPlanet;
  adLord?: KPPlanet;
}

export interface CaseMatchResult {
  matchedCase: MedicalCase;
  similarityScore: number; // 0..100
  matchReason: string;
}

export function matchTranscriptCases(candidate: MatchCandidate): CaseMatchResult[] {
  const results: CaseMatchResult[] = [];
  const candidatePlanets = new Set(candidate.activePlanets);
  const candidateHouses = new Set(candidate.activeHouses);

  for (const medicalCase of MEDICAL_CASEBOOK) {
    let score = 0;
    const reasons: string[] = [];

    // 1. Planetary overlap (30%)
    const casePlanets = medicalCase.chartSignifiers.primaryPlanets;
    const commonPlanets = casePlanets.filter((p) => candidatePlanets.has(p));
    if (commonPlanets.length > 0) {
      const pRatio = commonPlanets.length / casePlanets.length;
      score += pRatio * 35;
      reasons.push(`Shared astrological significators: ${commonPlanets.join(", ")}`);
    }

    // 2. House overlap (25%)
    const caseHouses = medicalCase.chartSignifiers.housesInvolved;
    const commonHouses = caseHouses.filter((h) => candidateHouses.has(h));
    if (commonHouses.length > 0) {
      const hRatio = commonHouses.length / caseHouses.length;
      score += hRatio * 25;
      reasons.push(`Activated house alignment: ${commonHouses.map((h) => `H${h}`).join(", ")}`);
    }

    // 3. 6th CSL match (20%)
    if (
      candidate.cusp6CSL &&
      medicalCase.chartSignifiers.cuspSubLords.cusp6CSL === candidate.cusp6CSL
    ) {
      score += 20;
      reasons.push(`Identical 6th Cusp Sub-Lord (${candidate.cusp6CSL})`);
    }

    // 4. Dasha overlap (20%)
    const caseDasha = medicalCase.chartSignifiers.dashaAtOnset;
    if (candidate.mdLord === caseDasha.mahadasha) {
      score += 10;
      reasons.push(`Same Mahadasha Lord (${candidate.mdLord})`);
    }
    if (candidate.adLord === caseDasha.antardasha) {
      score += 10;
      reasons.push(`Same Antardasha Lord (${candidate.adLord})`);
    }

    if (score >= 40) {
      results.push({
        matchedCase: medicalCase,
        similarityScore: Math.round(score),
        matchReason: reasons.join(" • "),
      });
    }
  }

  return results.sort((a, b) => b.similarityScore - a.similarityScore);
}
