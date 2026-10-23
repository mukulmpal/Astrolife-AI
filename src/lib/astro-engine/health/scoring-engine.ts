/**
 * ============================================================================
 * ASTROLIFE — HEALTH SCORING & REPETITION ENGINE (PHASE 2I-MED)
 * ============================================================================
 * Strictly deterministic, explainable mathematical scoring:
 * - 7 Core Dimensions (Vitality, Sensitivity, Chronicity, Confinement, Recovery, Dasha, Repetition)
 * - Multi-hit repetition ladder (Low -> Moderate -> Strong -> Very Strong)
 * - Domain-level vulnerability calculations
 * - Zero black-box magic numbers
 * ============================================================================
 */

import type { KPPlanet } from "../kp";
import type {
  DomainHealthAssessment,
  HealthDomain,
  HealthScorecard,
  RepetitionConfidenceLevel,
} from "./types";
import {
  PLANETARY_MEDICAL_DICTIONARY,
} from "./constants";
import { MEDICAL_RULE_REGISTRY } from "./rule-registry";

export interface ScoringInput {
  cusp1CSL: KPPlanet;
  cusp6CSL: KPPlanet;
  cusp8CSL: KPPlanet;
  cusp12CSL: KPPlanet;
  cusp1Significations: number[];
  cusp6Significations: number[];
  cusp8Significations: number[];
  cusp12Significations: number[];
  mdLord: KPPlanet;
  adLord: KPPlanet;
  mdSignifications: number[];
  adSignifications: number[];
  activeRuleIds: string[];
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

export function computeHealthScorecard(input: ScoringInput): HealthScorecard {
  // 1. Constitutional Vitality (1st Cusp)
  // Base 60. Increased by 1, 5, 11; reduced by 6, 8, 12
  let vitality = 60;
  const c1Signs = new Set(input.cusp1Significations);
  if (c1Signs.has(1)) vitality += 10;
  if (c1Signs.has(5)) vitality += 12;
  if (c1Signs.has(11)) vitality += 14;
  if (c1Signs.has(6)) vitality -= 12;
  if (c1Signs.has(8)) vitality -= 14;
  if (c1Signs.has(12)) vitality -= 10;
  const constitutionalVitality = clamp(vitality);

  // 2. Disease Sensitivity (6th Cusp)
  // Base 30. Higher if 6th CSL strongly links to 6, 8, 12 or running Dasha touches 6
  let disease = 30;
  const c6Signs = new Set(input.cusp6Significations);
  if (c6Signs.has(6)) disease += 25;
  if (c6Signs.has(8)) disease += 15;
  if (c6Signs.has(12)) disease += 12;
  if (c6Signs.has(5) || c6Signs.has(11)) disease -= 18; // 5/11 mitigates disease
  if (input.mdSignifications.includes(6)) disease += 12;
  if (input.adSignifications.includes(6)) disease += 14;
  const diseaseSensitivity = clamp(disease);

  // 3. Chronicity Factor (8th Cusp)
  // Base 20. Activated by 8th cusp links and Saturn / Rahu / Ketu involvement
  let chronicity = 20;
  const c8Signs = new Set(input.cusp8Significations);
  if (c8Signs.has(8)) chronicity += 28;
  if (c8Signs.has(6)) chronicity += 14;
  if (c8Signs.has(12)) chronicity += 12;
  if (["Saturn", "Rahu", "Ketu"].includes(input.cusp8CSL)) chronicity += 10;
  if (input.mdSignifications.includes(8)) chronicity += 10;
  if (input.adSignifications.includes(8)) chronicity += 12;
  const chronicityFactor = clamp(chronicity);

  // 4. Confinement Index (12th Cusp)
  // Base 15. Hospitalization / bed-rest / medical expense
  let confinement = 15;
  const c12Signs = new Set(input.cusp12Significations);
  if (c12Signs.has(12)) confinement += 30;
  if (c12Signs.has(6)) confinement += 16;
  if (c12Signs.has(8)) confinement += 14;
  if (c12Signs.has(11)) confinement -= 20; // 11 = discharge from hospital
  if (input.mdSignifications.includes(12)) confinement += 12;
  if (input.adSignifications.includes(12)) confinement += 15;
  const confinementIndex = clamp(confinement);

  // 5. Recovery Resilience (1, 5, 11)
  // Base 45. 5th (cure) + 11th (discharge / complete recovery)
  let recovery = 45;
  const allAfflictions = [
    ...input.cusp1Significations,
    ...input.cusp6Significations,
    ...input.mdSignifications,
    ...input.adSignifications,
  ];
  const count5 = allAfflictions.filter((h) => h === 5).length;
  const count11 = allAfflictions.filter((h) => h === 11).length;
  const count1 = allAfflictions.filter((h) => h === 1).length;
  recovery += count5 * 10 + count11 * 12 + count1 * 6;
  if (["Jupiter", "Venus", "Moon"].includes(input.cusp1CSL)) recovery += 8;
  const recoveryResilience = clamp(recovery);

  // 6. Current Dasha Activation Load
  // How strongly MD & AD trigger 6, 8, 12
  let dashaLoad = 20;
  const mdHas6812 = input.mdSignifications.some((h) => [6, 8, 12].includes(h));
  const adHas6812 = input.adSignifications.some((h) => [6, 8, 12].includes(h));
  if (mdHas6812) dashaLoad += 30;
  if (adHas6812) dashaLoad += 35;
  if (input.adSignifications.includes(6) && input.adSignifications.includes(8)) dashaLoad += 15;
  const dashaActivationLoad = clamp(dashaLoad);

  // 7. Repetition Confidence Level
  // Multi-hit repetition ladder
  let repetitionHits = 0;
  if (c6Signs.has(6)) repetitionHits++;
  if (input.cusp6CSL === input.mdLord || input.cusp6CSL === input.adLord) repetitionHits += 2;
  if (input.activeRuleIds.length >= 2) repetitionHits++;
  if (input.activeRuleIds.length >= 4) repetitionHits++;
  if (dashaActivationLoad >= 65 && diseaseSensitivity >= 55) repetitionHits += 2;

  let repetitionConfidence: RepetitionConfidenceLevel = "Low";
  if (repetitionHits >= 6) {
    repetitionConfidence = "Very_Strong_Traditional_Pattern";
  } else if (repetitionHits >= 4) {
    repetitionConfidence = "Strong";
  } else if (repetitionHits >= 2) {
    repetitionConfidence = "Moderate";
  }

  return {
    constitutionalVitality,
    diseaseSensitivity,
    chronicityFactor,
    confinementIndex,
    recoveryResilience,
    dashaActivationLoad,
    repetitionConfidence,
  };
}

export function computeDomainAssessments(
  activeRuleIds: string[],
  c6Lord: KPPlanet,
  mdLord: KPPlanet,
  adLord: KPPlanet
): DomainHealthAssessment[] {
  const domainScoreMap: Record<
    HealthDomain,
    { score: number; rules: string[]; organs: Set<string>; themes: Set<string> }
  > = {
    cardiovascular: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    respiratory: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    neurological: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    musculoskeletal: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    hematological: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    renal_urinary: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    reproductive: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    dermatological: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    digestive: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    metabolic: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    ophthalmology: { score: 10, rules: [], organs: new Set(), themes: new Set() },
    mental_emotional: { score: 10, rules: [], organs: new Set(), themes: new Set() },
  };

  // 1. Seed from 6th cusp lord and running dasha lords
  const primaryPlanets = [c6Lord, mdLord, adLord];
  for (const p of primaryPlanets) {
    const profile = PLANETARY_MEDICAL_DICTIONARY[p];
    if (profile) {
      for (const dom of profile.associatedDomains) {
        const entry = domainScoreMap[dom];
        if (entry) {
          entry.score += 15;
          profile.rulingOrgans.forEach((org) => entry.organs.add(org));
          profile.traditionalPathologies.forEach((pat) => entry.themes.add(pat));
        }
      }
    }
  }

  // 2. Add points from triggered rules
  for (const ruleId of activeRuleIds) {
    const rule = MEDICAL_RULE_REGISTRY[ruleId];
    if (rule) {
      const entry = domainScoreMap[rule.domain];
      if (entry) {
        entry.score += rule.severityWeight * 6;
        entry.rules.push(rule.id);
        entry.themes.add(rule.name);
      }
    }
  }

  const results: DomainHealthAssessment[] = [];
  const domainLabels: Record<HealthDomain, string> = {
    cardiovascular: "Cardiovascular & Hemodynamic System",
    respiratory: "Respiratory & Pulmonary Tract",
    neurological: "Neurological & Motor Coordination",
    musculoskeletal: "Musculoskeletal & Skeletal Structure",
    hematological: "Hematological & Inflammatory Balance",
    renal_urinary: "Renal & Urinary Filtration",
    reproductive: "Reproductive & Endocrine Glands",
    dermatological: "Dermatological & Cutaneous Texture",
    digestive: "Digestive & Hepato-Biliary System",
    metabolic: "Metabolic, Pancreatic & Cellular Balance",
    ophthalmology: "Ophthalmology & Visual Acuity",
    mental_emotional: "Mental, Emotional & Sleep Architecture",
  };

  for (const [domKey, data] of Object.entries(domainScoreMap) as Array<
    [HealthDomain, typeof domainScoreMap[HealthDomain]]
  >) {
    results.push({
      domain: domKey,
      label: domainLabels[domKey],
      organSystems: Array.from(data.organs).slice(0, 4),
      score: clamp(data.score),
      dosha: "Tridosha",
      traditionalThemes: Array.from(data.themes).slice(0, 3),
      activeRules: data.rules,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}
