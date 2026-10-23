/**
 * ============================================================================
 * ASTROLIFE — DASHA HEALTH & REMEDIAL TIMELINE CALCULATOR
 * ============================================================================
 * Calculates health activations strictly synchronized with running Vimshottari
 * Dasha periods:
 * 1. Analyzes Mahadasha, Antardasha, and Pratyantardasha health house signatures
 * 2. Identifies target biological systems, organs, and dosha balance
 * 3. Categorizes phase nature (Recovery_Dominant vs High_Stress_Watch)
 * 4. Generates curated, safe, non-invasive remedies (Dana, Dinacharya, Mantras)
 * 5. Identifies upcoming "Arogya Windows" (recovery transitions)
 * ============================================================================
 */

import type { KPPlanet } from "../kp";
import type {
  DashaHealthVector,
  DashaPhaseNature,
  DoshaType,
  HealthDomain,
  HealthRemedy,
} from "./types";
import {
  PLANETARY_MEDICAL_DICTIONARY,
  PLANETARY_SAFE_REMEDIES,
  TRADITIONAL_TREATMENT_MODALITIES,
} from "./constants";

export interface DashaCalculationInput {
  mahadashaLord: KPPlanet;
  antardashaLord: KPPlanet;
  pratyantarLord?: KPPlanet;
  mdStartDate?: string;
  mdEndDate?: string;
  adStartDate?: string;
  adEndDate?: string;
  mdSignifiedHouses: number[];
  adSignifiedHouses: number[];
  nextAntardashaLord?: KPPlanet;
  nextAdStartDate?: string;
  nextAdSignifiedHouses?: number[];
}

export function computeDashaHealthVector(input: DashaCalculationInput): DashaHealthVector {
  const md = input.mahadashaLord;
  const ad = input.antardashaLord;

  const mdProfile = PLANETARY_MEDICAL_DICTIONARY[md];
  const adProfile = PLANETARY_MEDICAL_DICTIONARY[ad];

  // 1. Identify active domains and organ systems
  const domainSet = new Set<HealthDomain>();
  const bodySystemSet = new Set<string>();

  if (adProfile) {
    adProfile.associatedDomains.forEach((d) => domainSet.add(d));
    adProfile.rulingOrgans.forEach((o) => bodySystemSet.add(o));
  }
  if (mdProfile) {
    mdProfile.associatedDomains.forEach((d) => domainSet.add(d));
    mdProfile.rulingOrgans.forEach((o) => bodySystemSet.add(o));
  }

  // 2. Health vs Recovery Houses Signified
  const combinedHouses = Array.from(
    new Set([...input.mdSignifiedHouses, ...input.adSignifiedHouses])
  );
  const healthHouses = combinedHouses.filter((h) => [6, 8, 12].includes(h));
  const recoveryHouses = combinedHouses.filter((h) => [1, 5, 11].includes(h));

  // 3. Phase Nature
  let phaseNature: DashaPhaseNature = "Neutral_Maintenance";
  const has6 = healthHouses.includes(6);
  const has8 = healthHouses.includes(8);
  const has12 = healthHouses.includes(12);
  const has5or11 = recoveryHouses.includes(5) || recoveryHouses.includes(11);

  if (has6 && (has8 || has12)) {
    phaseNature = "High_Stress_Watch";
  } else if (has6 || has8 || has12) {
    phaseNature = "Vigilance_Recommended";
  } else if (has5or11) {
    phaseNature = "Recovery_Dominant";
  }

  // 4. Primary Dosha Tendency
  let doshaTendency: DoshaType = "Tridosha";
  if (adProfile) {
    doshaTendency = adProfile.primaryDosha;
  }

  // 5. Curated Remedies for running Antardasha (primary) and Mahadasha
  const recommendedRemedies: HealthRemedy[] = [];

  // Antardasha remedies (specific manifestation)
  const adRemedies = PLANETARY_SAFE_REMEDIES[ad] || [];
  recommendedRemedies.push(...adRemedies);

  // Mahadasha karmic charity (backdrop balance)
  const mdRemedies = PLANETARY_SAFE_REMEDIES[md] || [];
  const mdCharity = mdRemedies.find((r) => r.type === "karmic_charity");
  if (mdCharity && !recommendedRemedies.some((r) => r.id === mdCharity.id)) {
    recommendedRemedies.push(mdCharity);
  }

  // Add Traditional Treatment Modality remedy as an advisory alignment
  const adModality = TRADITIONAL_TREATMENT_MODALITIES[ad];
  if (adModality) {
    recommendedRemedies.push({
      id: `REM-MODALITY-${ad.toUpperCase()}`,
      title: `Traditional Therapeutic Modality: ${adModality.modality}`,
      type: "treatment_modality",
      planet: ad,
      description: `In traditional KP medical symbolism, periods influenced by ${ad} align symbolically with ${adModality.modality}.`,
      actionableSteps: [
        `Consider integrative support aligned with ${adModality.modality} alongside primary clinical medical advice.`,
        "Always keep licensed medical doctors as your primary healthcare guide.",
      ],
      traditionalRationale: adModality.rationale,
      safetyNote: "Educational and traditional symbolism only. Not an empirical prescription.",
    });
  }

  // 6. Upcoming Transition / Arogya Window
  let upcomingTransition: DashaHealthVector["upcomingTransition"] | undefined;
  if (input.nextAntardashaLord && input.nextAdStartDate) {
    const nextLord = input.nextAntardashaLord;
    const nextHouses = input.nextAdSignifiedHouses || [];
    const isRecovery = nextHouses.includes(5) || nextHouses.includes(11);
    const nextProfile = PLANETARY_MEDICAL_DICTIONARY[nextLord];

    let expectedShift = `Transition into ${nextLord} Antardasha focusing on ${
      nextProfile?.associatedDomains.join(", ") || "general vitality"
    }.`;
    if (isRecovery) {
      expectedShift += ` This marks an astrological 'Arogya Window' supporting recuperation and treatment gains.`;
    }

    upcomingTransition = {
      nextAntardasha: nextLord,
      startDate: input.nextAdStartDate,
      expectedShift,
      isRecoveryWindow: isRecovery,
    };
  }

  return {
    mahadasha: md,
    antardasha: ad,
    pratyantar: input.pratyantarLord,
    mdStartDate: input.mdStartDate,
    mdEndDate: input.mdEndDate,
    adStartDate: input.adStartDate,
    adEndDate: input.adEndDate,
    activeDomains: Array.from(domainSet),
    activeBodySystems: Array.from(bodySystemSet).slice(0, 5),
    healthHousesSignified: healthHouses,
    recoveryHousesSignified: recoveryHouses,
    phaseNature,
    doshaTendency,
    recommendedRemedies,
    upcomingTransition,
  };
}
