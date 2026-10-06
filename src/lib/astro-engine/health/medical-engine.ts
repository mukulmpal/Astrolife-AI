/**
 * ============================================================================
 * ASTROLIFE — HEALTH & ASTRO-MEDICAL INTELLIGENCE ENGINE (ORCHESTRATOR)
 * ============================================================================
 * Master 16-Step Pipeline:
 * - KP Cuspal Sub-Lord hierarchy (1, 6, 8, 12 vs 1, 5, 11)
 * - Deterministic scoring & repetition ladder
 * - Dasha-driven health vector & upcoming "Arogya Windows"
 * - Non-invasive traditional remedies (Dana, Dinacharya, Mantras, Modalities)
 * - Explainable case matching from transcript casebook
 * - Absolute clinical guardrails & emergency symptom triage
 * ============================================================================
 */

import type { KPPlanet } from "../kp";
import type {
  KPPredictiveEvidence,
} from "../kp-evidence-types";
import type {
  ExplainabilityChain,
  MedicalEngineResult,
  MedicalRule,
  PersonalCureModality,
} from "./types";
import {
  evaluateMedicalSafety,
  CANONICAL_MEDICAL_DISCLAIMERS,
} from "./safety-guardrails";
import { MEDICAL_RULE_REGISTRY } from "./rule-registry";
import {
  computeHealthScorecard,
  computeDomainAssessments,
} from "./scoring-engine";
import { computeDashaHealthVector } from "./dasha-health-calculator";
import { matchTranscriptCases } from "./case-matcher";
import {
  TRADITIONAL_TREATMENT_MODALITIES,
  SIXTEEN_DAY_REMEDY_PROTOCOLS,
  SPECIAL_TRANSCRIPT_RULES,
} from "./constants";

export interface MedicalEngineOptions {
  userQuery?: string;
  asOfDate?: string;
}

export function runMedicalEngine(
  predictiveEvidence: KPPredictiveEvidence,
  options?: MedicalEngineOptions
): MedicalEngineResult {
  // ── STEP 1: EMERGENCY SAFETY SCAN ─────────────────────────────────────────
  const safetyCheck = evaluateMedicalSafety(options?.userQuery);
  if (safetyCheck.isEmergency) {
    return {
      scorecard: {
        constitutionalVitality: 50,
        diseaseSensitivity: 50,
        chronicityFactor: 50,
        confinementIndex: 50,
        recoveryResilience: 50,
        dashaActivationLoad: 50,
        repetitionConfidence: "Low",
      },
      dashaHealth: {
        mahadasha: "Jupiter",
        antardasha: "Jupiter",
        activeDomains: [],
        activeBodySystems: [],
        healthHousesSignified: [],
        recoveryHousesSignified: [],
        phaseNature: "Neutral_Maintenance",
        doshaTendency: "Tridosha",
        recommendedRemedies: [],
      },
      domainAssessments: [],
      recoveryAnalysis: {
        potential: "Low",
        supportiveHouses: [],
        summary: "Emergency alert active. Medical consultation required.",
      },
      explainability: {
        conclusion: "Execution halted due to clinical safety protocol.",
        cuspEvidence: [],
        dashaEvidence: [],
        repetitionEvidence: [],
        caseMatches: [],
      },
      matchedCases: [],
      curatedRemedies: [],
      safetyDisclaimers: CANONICAL_MEDICAL_DISCLAIMERS,
      isEmergencyInterrupted: true,
      emergencyAlert: safetyCheck.emergencyMessage,
    };
  }

  // ── STEP 2 & 3: EXTRACT KP CUSPS & CUSPAL SUB-LORDS ───────────────────────
  const c1Promise = predictiveEvidence.cuspPromises?.[1];
  const c5Promise = predictiveEvidence.cuspPromises?.[5];
  const c6Promise = predictiveEvidence.cuspPromises?.[6];
  const c8Promise = predictiveEvidence.cuspPromises?.[8];
  const c12Promise = predictiveEvidence.cuspPromises?.[12];

  const cusp1CSL: KPPlanet = c1Promise?.cuspSubLord || "Sun";
  const cusp5CSL: KPPlanet = c5Promise?.cuspSubLord || "Jupiter";
  const cusp6CSL: KPPlanet = c6Promise?.cuspSubLord || "Venus";
  const cusp8CSL: KPPlanet = c8Promise?.cuspSubLord || "Saturn";
  const cusp12CSL: KPPlanet = c12Promise?.cuspSubLord || "Rahu";

  const c5CslPoint = predictiveEvidence.pointEvidence?.[cusp5CSL];
  const c5CslStarLord: KPPlanet = (c5CslPoint?.starLord as KPPlanet) || c5Promise?.cuspStarLord || "Jupiter";

  // ── STEP 4: RETRIEVE 4-FOLD HOUSE SIGNIFICATIONS ─────────────────────────
  const getSignifications = (p: KPPlanet): number[] => {
    return predictiveEvidence.planetSignifications?.[p]?.allSignifications || [];
  };

  const cusp1Significations = c1Promise?.signifiedHouses || getSignifications(cusp1CSL);
  const cusp5Significations = c5Promise?.signifiedHouses || getSignifications(cusp5CSL);
  const cusp6Significations = c6Promise?.signifiedHouses || getSignifications(cusp6CSL);
  const cusp8Significations = c8Promise?.signifiedHouses || getSignifications(cusp8CSL);
  const cusp12Significations = c12Promise?.signifiedHouses || getSignifications(cusp12CSL);

  // ── STEP 5: RETRIEVE RUNNING DASHA HIERARCHY ──────────────────────────────
  const dashaHierarchy = predictiveEvidence.dashaEvidence?.hierarchy;
  const mdLord: KPPlanet = dashaHierarchy?.mahadasha?.planet || "Jupiter";
  const adLord: KPPlanet = dashaHierarchy?.antardasha?.planet || "Saturn";
  const pdLord: KPPlanet | undefined = dashaHierarchy?.pratyantardasha?.planet;

  const mdSignifications = dashaHierarchy?.mahadasha?.signifiedHouses || getSignifications(mdLord);
  const adSignifications = dashaHierarchy?.antardasha?.signifiedHouses || getSignifications(adLord);

  // ── STEP 6 & 7: EVALUATE ACTIVE MEDICAL RULES & COMBINATIONS ─────────────
  const activeRuleIds: string[] = [];
  const triggeredRules: MedicalRule[] = [];

  // Check 1st Cusp patterns
  if (cusp1Significations.includes(1) && cusp1Significations.includes(11)) {
    activeRuleIds.push("KP-MED-CUSP1-VITALITY-A");
  } else if (cusp1Significations.includes(6) && cusp1Significations.includes(8)) {
    activeRuleIds.push("KP-MED-CUSP1-PROLONGED-C");
  } else if (cusp1Significations.includes(6) && cusp1Significations.includes(12)) {
    activeRuleIds.push("KP-MED-CUSP1-DEPLETION-D");
  } else if (cusp1Significations.includes(6)) {
    activeRuleIds.push("KP-MED-CUSP1-SUSCEPTIBILITY-B");
  }

  // Check 5 & 11 Recovery rule
  const combinedRecovery = [
    ...cusp1Significations,
    ...cusp6Significations,
    ...adSignifications,
  ];
  if (combinedRecovery.includes(5) && combinedRecovery.includes(11)) {
    activeRuleIds.push("KP-MED-RECOVERY-ACTIVE-01");
  }

  // Check Surgery context (8 + 12 + Mars / Ketu)
  const isSurgeryCandidate =
    (cusp8Significations.includes(8) || cusp8Significations.includes(12)) &&
    ([cusp6CSL, cusp8CSL, mdLord, adLord].includes("Mars") ||
      [cusp6CSL, cusp8CSL, mdLord, adLord].includes("Ketu"));
  if (isSurgeryCandidate) {
    activeRuleIds.push("KP-MED-SURGERY-INTERVENTION-01");
  }

  // Check Combination Rules
  const activePlanetsInContext = new Set<KPPlanet>([
    cusp1CSL,
    cusp6CSL,
    cusp8CSL,
    cusp12CSL,
    mdLord,
    adLord,
  ]);

  if (activePlanetsInContext.has("Venus") && activePlanetsInContext.has("Saturn")) {
    activeRuleIds.push("COMB-VEN-SAT-NEPHROLITHIASIS");
  }
  if (activePlanetsInContext.has("Venus") && activePlanetsInContext.has("Mercury")) {
    activeRuleIds.push("COMB-VEN-MERC-SKIN-ALLERGY");
  }
  if (
    activePlanetsInContext.has("Venus") &&
    activePlanetsInContext.has("Mars") &&
    activePlanetsInContext.has("Rahu")
  ) {
    activeRuleIds.push("COMB-VEN-MARS-RAHU-RENAL-STRESS");
  }
  if (activePlanetsInContext.has("Mercury") && activePlanetsInContext.has("Rahu")) {
    activeRuleIds.push("COMB-MERC-RAHU-PULMONARY-INFECTION");
  }
  if (
    activePlanetsInContext.has("Mercury") &&
    activePlanetsInContext.has("Saturn") &&
    activePlanetsInContext.has("Mars")
  ) {
    activeRuleIds.push("COMB-MERC-SAT-MARS-NEUROMUSCULAR");
  }
  if (
    activePlanetsInContext.has("Jupiter") &&
    activePlanetsInContext.has("Mars") &&
    activePlanetsInContext.has("Rahu")
  ) {
    activeRuleIds.push("COMB-JUP-MARS-RAHU-HYPERPLASIA");
  }
  if (activePlanetsInContext.has("Jupiter") && activePlanetsInContext.has("Mars")) {
    activeRuleIds.push("COMB-JUP-MARS-INFLAMMATORY-GROWTH");
  }
  if (activePlanetsInContext.has("Mars") && activePlanetsInContext.has("Moon")) {
    activeRuleIds.push("COMB-MARS-MOON-BP-FLUCTUATION");
  }
  if (
    activePlanetsInContext.has("Saturn") &&
    activePlanetsInContext.has("Ketu") &&
    activePlanetsInContext.has("Sun")
  ) {
    activeRuleIds.push("COMB-SAT-KETU-SPINAL-ACIDITY");
  }
  if (activePlanetsInContext.has("Jupiter") && activePlanetsInContext.has("Venus")) {
    activeRuleIds.push("COMB-JUP-VEN-DIABETES");
  }
  if (activePlanetsInContext.has("Mercury") && activePlanetsInContext.has("Moon")) {
    activeRuleIds.push("COMB-MERC-MOON-PSYCH-HOSPITAL");
  }
  if (activePlanetsInContext.has("Mercury") && activePlanetsInContext.has("Ketu")) {
    activeRuleIds.push("COMB-MERC-KETU-NERVOUS-SHRINK");
  }
  if (activePlanetsInContext.has("Venus") && activePlanetsInContext.has("Jupiter")) {
    activeRuleIds.push("COMB-VEN-JUP-KIDNEY-ENLARGE");
  }
  if (activePlanetsInContext.has("Venus") && activePlanetsInContext.has("Ketu")) {
    activeRuleIds.push("COMB-VEN-KETU-KIDNEY-SHRINK");
  }
  if (
    activePlanetsInContext.has("Jupiter") &&
    activePlanetsInContext.has("Venus") &&
    activePlanetsInContext.has("Saturn")
  ) {
    activeRuleIds.push("COMB-JUP-VEN-SAT-GALLSTONE");
  }
  if (activePlanetsInContext.has("Jupiter") && activePlanetsInContext.has("Ketu")) {
    activeRuleIds.push("COMB-JUP-KETU-LIVER-SHRINK");
  }
  if (activePlanetsInContext.has("Saturn") && activePlanetsInContext.has("Ketu")) {
    activeRuleIds.push("COMB-SAT-KETU-CYSTS");
  }
  if (activePlanetsInContext.has("Saturn") && activePlanetsInContext.has("Mars")) {
    activeRuleIds.push("COMB-SAT-MARS-KNEE-PAIN");
  }
  if (activePlanetsInContext.has("Sun") && activePlanetsInContext.has("Jupiter")) {
    activeRuleIds.push("COMB-SUN-JUP-HYPERTENSION-BONE");
  }
  if (activePlanetsInContext.has("Moon") && activePlanetsInContext.has("Rahu")) {
    activeRuleIds.push("COMB-MOON-RAHU-DEPRESSION");
  }

  for (const rid of activeRuleIds) {
    if (MEDICAL_RULE_REGISTRY[rid]) {
      triggeredRules.push(MEDICAL_RULE_REGISTRY[rid]);
    }
  }

  // ── STEP 8: SCORECARD COMPUTATION ─────────────────────────────────────────
  const scorecard = computeHealthScorecard({
    cusp1CSL,
    cusp6CSL,
    cusp8CSL,
    cusp12CSL,
    cusp1Significations,
    cusp6Significations,
    cusp8Significations,
    cusp12Significations,
    mdLord,
    adLord,
    mdSignifications,
    adSignifications,
    activeRuleIds,
  });

  // ── STEP 9: DASHA HEALTH VECTOR & REMEDIES ────────────────────────────────
  const dashaHealth = computeDashaHealthVector({
    mahadashaLord: mdLord,
    antardashaLord: adLord,
    pratyantarLord: pdLord,
    mdStartDate: dashaHierarchy?.mahadasha?.startDate,
    mdEndDate: dashaHierarchy?.mahadasha?.endDate,
    adStartDate: dashaHierarchy?.antardasha?.startDate,
    adEndDate: dashaHierarchy?.antardasha?.endDate,
    mdSignifiedHouses: mdSignifications,
    adSignifiedHouses: adSignifications,
  });

  // ── STEP 10: DOMAIN ASSESSMENTS ───────────────────────────────────────────
  const domainAssessments = computeDomainAssessments(
    activeRuleIds,
    cusp6CSL,
    mdLord,
    adLord
  );

  // ── STEP 11: RECOVERY ANALYSIS ────────────────────────────────────────────
  const supportiveHouses = Array.from(
    new Set([
      ...cusp1Significations.filter((h) => [1, 5, 11].includes(h)),
      ...cusp6Significations.filter((h) => [5, 11].includes(h)),
      ...adSignifications.filter((h) => [1, 5, 11].includes(h)),
    ])
  );

  let recoveryPotential: "High" | "Moderate" | "Low" = "Moderate";
  let recoverySummary = "";
  if (scorecard.recoveryResilience >= 70) {
    recoveryPotential = "High";
    recoverySummary =
      "Strong activation of houses 1, 5, and 11 provides robust traditional restorative support. The body is expected to respond favorably to timely clinical interventions and disciplined recuperative care.";
  } else if (scorecard.recoveryResilience >= 45) {
    recoveryPotential = "Moderate";
    recoverySummary =
      "Balanced recovery potential. Adherence to medical protocols and consistent lifestyle habits will support steady convalescence.";
  } else {
    recoveryPotential = "Low";
    recoverySummary =
      "Recovery houses require patient cultivation. Heightened clinical vigilance and adherence to prescribed physician regimens are strongly advised.";
  }

  // ── STEP 12: MATCH TRANSCRIPT CASES ───────────────────────────────────────
  const activeHousesInvolved = Array.from(
    new Set([
      ...cusp1Significations,
      ...cusp6Significations,
      ...cusp8Significations,
      ...cusp12Significations,
      ...adSignifications,
    ])
  );

  const matchedCasesData = matchTranscriptCases({
    activePlanets: Array.from(activePlanetsInContext),
    activeHouses: activeHousesInvolved,
    cusp6CSL,
    mdLord,
    adLord,
  });

  const matchedCases = matchedCasesData.slice(0, 3).map((m) => m.matchedCase);

  // ── STEP 13: EXPLAINABILITY CHAIN ─────────────────────────────────────────
  const cuspEvidence = [
    `1st Cusp Sub-Lord (${cusp1CSL}) signifies Houses: [${cusp1Significations.join(", ")}].`,
    `6th Cusp Sub-Lord (${cusp6CSL}) signifies Houses: [${cusp6Significations.join(", ")}], establishing primary bodily sensitivity.`,
    `8th Cusp Sub-Lord (${cusp8CSL}) signifies Houses: [${cusp8Significations.join(", ")}], indicating depth/chronicity.`,
    `12th Cusp Sub-Lord (${cusp12CSL}) signifies Houses: [${cusp12Significations.join(", ")}], detailing hospital confinement or expenditure.`,
  ];

  const dashaEvidence = [
    `Running Mahadasha Lord ${mdLord} signifies Houses: [${mdSignifications.join(", ")}].`,
    `Running Antardasha Lord ${adLord} signifies Houses: [${adSignifications.join(", ")}].`,
    `Dasha phase categorized as: ${dashaHealth.phaseNature.replace(/_/g, " ")}.`,
  ];

  const repetitionEvidence = [
    `Repetition pattern strength: ${scorecard.repetitionConfidence.replace(/_/g, " ")}.`,
    `${triggeredRules.length} medical astrological pattern rules verified in natal and timing graph.`,
  ];

  // Traditional treatment modality lookup
  const modalityRecord = TRADITIONAL_TREATMENT_MODALITIES[cusp6CSL] || TRADITIONAL_TREATMENT_MODALITIES[adLord];

  const explainability: ExplainabilityChain = {
    conclusion: `Chart and Dasha reflect traditional focus on ${
      domainAssessments[0]?.label || "General Vitality"
    } with ${scorecard.repetitionConfidence.replace(/_/g, " ")} pattern confidence.`,
    cuspEvidence,
    dashaEvidence,
    repetitionEvidence,
    caseMatches: matchedCasesData.slice(0, 3).map((m) => ({
      caseId: m.matchedCase.id,
      title: m.matchedCase.title,
      matchScore: m.similarityScore,
      reason: m.matchReason,
    })),
    modalitySymbolism: modalityRecord
      ? {
          planet: cusp6CSL,
          modality: modalityRecord.modality,
          rationale: modalityRecord.rationale,
        }
      : undefined,
  };

  // ── STEP 14: CURATED REMEDIES ─────────────────────────────────────────────
  const curatedRemedies = [...dashaHealth.recommendedRemedies];

  // ── STEP 14B: 16-DAY REMEDY PROTOCOLS (TRANSCRIPT RULES) ─────────────────
  const protocolPlanets = Array.from(new Set<KPPlanet>([adLord, cusp6CSL, mdLord]));
  const sixteenDayProtocols = protocolPlanets
    .map((p) => SIXTEEN_DAY_REMEDY_PROTOCOLS[p])
    .filter(Boolean);

  // ── STEP 14C: SPECIAL TRANSCRIPT GUIDELINES ──────────────────────────────
  const specialGuidelines: SpecialTranscriptGuideline[] = [];
  if (cusp1CSL === "Saturn" || cusp1CSL === "Rahu") {
    const r = SPECIAL_TRANSCRIPT_RULES.find((x) => x.id === "RULE-SAT-RAHU-1ST-HOUSE");
    if (r) specialGuidelines.push(r);
  }
  if (cusp6CSL === "Moon" || cusp6Significations.includes(6)) {
    const r = SPECIAL_TRANSCRIPT_RULES.find((x) => x.id === "RULE-MOON-6TH-INJECTION");
    if (r) specialGuidelines.push(r);
  }
  if (cusp12Significations.includes(12) || cusp1Significations.includes(2)) {
    const r = SPECIAL_TRANSCRIPT_RULES.find((x) => x.id === "RULE-OCULAR-2ND-12TH");
    if (r) specialGuidelines.push(r);
  }
  const sevaRule = SPECIAL_TRANSCRIPT_RULES.find((x) => x.id === "RULE-MEDICAL-ASTRO-SEVA");
  if (sevaRule) specialGuidelines.push(sevaRule);

  // ── STEP 14D: PERSONALIZED 5TH HOUSE TREATMENT MODALITY ───────────────────
  const cureRecord = TRADITIONAL_TREATMENT_MODALITIES[c5CslStarLord] || TRADITIONAL_TREATMENT_MODALITIES[cusp5CSL];
  const personalCureModality: PersonalCureModality = {
    cusp5CSL,
    cslStarLord: c5CslStarLord,
    recommendedModality: cureRecord?.modality || "Allopathy / आधुनिक चिकित्सा",
    treatmentLine: `${c5CslStarLord} (5th CSL ${cusp5CSL} का नक्षत्र स्वामी)`,
    rationale: cureRecord?.rationale || "5वां भाव रोगमुक्ति और प्राकृतिक आरोग्य का मुख्य भाव है।",
    specialCaution:
      cusp6CSL === "Moon" || cusp6Significations.includes(6)
        ? "विशेष सावधानी (Transcript Rule): 6th भाव का चन्द्रमा इंजेक्शन / पैरेंट्रल सुई से तीव्र एलर्जी या रिएक्शन का संकेत देता है; ओरल सिरप व तरल औषधियां अधिक अनुकूल रहती हैं।"
        : undefined,
  };

  // ── STEP 15 & 16: ASSEMBLE RESULT ─────────────────────────────────────────
  return {
    scorecard,
    dashaHealth,
    domainAssessments: domainAssessments.slice(0, 5),
    recoveryAnalysis: {
      potential: recoveryPotential,
      supportiveHouses,
      summary: recoverySummary,
    },
    explainability,
    matchedCases,
    curatedRemedies,
    sixteenDayProtocols,
    specialGuidelines,
    personalCureModality,
    safetyDisclaimers: CANONICAL_MEDICAL_DISCLAIMERS,
    isEmergencyInterrupted: false,
  };
}
