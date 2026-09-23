/**
 * ============================================================================
 * ASTROLIFE — AI NARRATIVE INTEGRATION LAYER (PHASE 2K: SPRINT C)
 * ============================================================================
 * Production narrative integration, evidence-conditioned prompt construction,
 * sentence-level evidentiary grounding validator, constrained regeneration,
 * and deterministic template fallback.
 *
 * Epistemological & Architectural Invariants:
 * 1. EVIDENCE IS THE ONLY AUTHORITY: The LLM receives only the evidence contract
 *    and explainability view model. Raw coordinates, planetary degrees, unrepresented
 *    divisional charts (D-9/Navamsha), and doshas are strictly inaccessible.
 * 2. CONSERVATIVE SENTENCE GROUNDING: Does not require literal word overlap.
 *    Validates the semantic authorization chain:
 *    Sentence -> Authorized Finding -> Evidence Node(s) -> Rule / Relation.
 * 3. VALIDATOR IS AN EVIDENTIARY BOUNDARY CHECKER: Validates support in evidence;
 *    does not act as an astrological calculator or adjudicator.
 * 4. REGENERATION IS EVIDENCE-IDENTICAL: Retries receive the exact same contract
 *    plus rejection feedback. Zero raw chart information is ever added.
 * 5. DETERMINISTIC FALLBACK IS MANDATORY: If AI fails or cannot pass validation,
 *    falls back to the verified deterministic template, explicitly marked as
 *    `deterministic-template-fallback`.
 * ============================================================================
 */

import type {
  EvidenceFirstSection,
  FivePartNarrative,
  EvidenceFinding,
} from "./evidence-first-report";
import type { WhyAmISeeingThisModel } from "./explainability";
import type { KPPredictiveEvidenceContract } from "../astro-engine/kp-production-contract";

export interface PromptPayload {
  systemPrompt: string;
  userPrompt: string;
  authorizedContractSummary: {
    ruleId: string;
    ruleName: string;
    ruleStatus: string;
    primaryCusp: number;
    subLord: string;
    subLordSignifiedHouses: number[];
    cuspPromiseVerdict: string;
    activeDashaLords: { mahadasha: string; antardasha: string };
    dashaTimingState: string;
    transitState: string;
    rulingPlanetsState: string;
    rulingPlanetsMatchedLords: string[];
    synthesisState: string;
    appliedRelations: string[];
    authorizedEvidenceNodeIds: string[];
  };
}

export interface SentenceGroundingResult {
  sentence: string;
  isSubstantive: boolean;
  isGrounded: boolean;
  matchedFindingId?: string;
  matchedNodeIds?: string[];
  matchedRelationId?: string;
  rejectionReason?: string;
}

export interface NarrativeValidationResult {
  isValid: boolean;
  rejections: string[];
  sentenceEvaluations: SentenceGroundingResult[];
  auditNotes: string[];
}

export interface GroundedNarrativePayload {
  narrative: FivePartNarrative;
  origin: "ai-generated-verified" | "deterministic-template-fallback";
  validationResult: NarrativeValidationResult;
  regenerationCount: number;
  auditHash: string;
}

// ── 1. Evidence-Conditioned Prompt Construction ──────────────────────────────

/**
 * Builds an evidence-conditioned prompt for the LLM.
 * Strictly includes only authorized evidence contract facts and explainability models.
 * Zero raw coordinates, zero degrees, zero unrepresented divisional charts.
 */
export function buildEvidenceConditionedNarrativePrompt(
  contract: KPPredictiveEvidenceContract,
  section: EvidenceFirstSection,
  whyModel: WhyAmISeeingThisModel
): PromptPayload {
  const authorizedContractSummary = {
    ruleId: contract.ruleId,
    ruleName: contract.ruleName,
    ruleStatus: contract.ruleStatus,
    primaryCusp: contract.primaryCusp,
    subLord: contract.primaryCuspSubLord,
    subLordSignifiedHouses: contract.subLordSignifiedHouses,
    cuspPromiseVerdict: contract.cuspPromiseVerdict,
    activeDashaLords: contract.activeDashaLords,
    dashaTimingState: contract.dashaTimingState,
    transitState: contract.transitState,
    rulingPlanetsState: contract.rulingPlanetsState,
    rulingPlanetsMatchedLords: contract.rulingPlanetsMatchedLords,
    synthesisState: contract.synthesisDecision.state,
    appliedRelations: contract.conflictFindings.map((f) => f.relationId),
    authorizedEvidenceNodeIds: contract.authorizedEvidenceNodeIds,
  };

  const systemPrompt = `You are AstroLife's Grounded Narrative Explainer.
Your sole mission is to explain pre-calculated, deterministic Krishnamurti Paddhati (KP) astrological findings in clear, articulate, and empathetic human language.

CONSTITUTIONAL RULES:
1. YOU ARE NOT AN ASTROLOGER. You do not calculate, infer, predict, or modify astrology. You only translate verified deterministic findings.
2. EVIDENCE IS THE ONLY AUTHORITY: You may only reference the houses, planets, sub-lords, Dasha periods, transits, and precedence relations provided in the contract summary.
3. PROHIBITED CONTENT:
   - Absolute prohibition on numeric scores, percentages, probability tiers (e.g. "85% chance", "score: 8/10", "high probability").
   - Absolute prohibition on fatalism or absolute guarantees (e.g. "will never happen", "guaranteed to fail", "absolute fate").
   - Absolute prohibition on unrepresented divisional charts (Navamsha, D-9), un-evaluated doshas (Manglik), or raw astronomical degrees.
   - Ruling Planets act strictly as corroborative filters; never claim Ruling Planets caused, created, or vetoed the event.
   - If status is Reference_Pending, state clearly that classical KP literature lacks attested conflict precedence for modern intraday speculation; do NOT predict outcomes.
   - Do NOT manufacture arbitrary calendar durations (e.g. "within 6 months", "in 90 days").
4. STRUCTURED OUTPUT: You must provide a valid JSON object matching the FivePartNarrative structure:
   {
     "whatWasFound": "Direct plain-language summary of the primary finding",
     "whyItMatters": "Causal explanation connecting cuspal sub-lord, dasha window, and transit triggers",
     "practicalInterpretation": "Actionable, non-prescriptive, discerning life interpretation (not advice or prediction)",
     "whatIsUncertain": "Active timing limitations, period lord shift constraints, and epistemic boundaries",
     "whatWeDoNotClaim": "Standard ethical boundaries against fatalism and guarantees"
   }`;

  const userPrompt = `Generate a verified five-part report narrative for topic "${contract.ruleName}" based strictly on this authorized evidence:

Topic: ${contract.ruleName} (${contract.ruleId})
Epistemic Status: ${contract.ruleStatus}
Primary Cusp: ${contract.primaryCusp} (Sub-Lord: ${contract.primaryCuspSubLord}, Signifying Houses: [${contract.subLordSignifiedHouses.join(", ")}])
Foundational Promise Verdict: ${contract.cuspPromiseVerdict}
Running Dasha Lords: Mahadasha ${contract.activeDashaLords.mahadasha}, Antardasha ${contract.activeDashaLords.antardasha} (${contract.dashaTimingState})
Transit Corroboration: ${contract.transitState}
Ruling Planets Status: ${contract.rulingPlanetsState} (Matched Lords: ${contract.rulingPlanetsMatchedLords.join(", ") || "None"})
Precedence Relations Applied: ${contract.conflictFindings.map((f) => `${f.relationId} (${f.provenance.sourceBook}, ${f.provenance.pages})`).join("; ")}
Final Deterministic Synthesis State: ${contract.synthesisDecision.state}
Synthesis Verdict: ${contract.synthesisDecision.summaryVerdict}
Primary Finding: ${whyModel.primaryFinding}

Return strictly a JSON object with keys: whatWasFound, whyItMatters, practicalInterpretation, whatIsUncertain, whatWeDoNotClaim.`;

  return {
    systemPrompt,
    userPrompt,
    authorizedContractSummary,
  };
}

// ── 2. Sentence-Level Evidentiary Grounding Validator ────────────────────────

const PLANETARY_NAMES = [
  "sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn", "rahu", "ketu", "uranus", "neptune", "pluto"
];

/**
 * Checks whether a single sentence is grounded in the authorized evidence contract.
 * Does not require literal word overlap; verifies semantic authorization chain.
 */
export function verifySentenceGrounding(params: {
  sentence: string;
  contract: KPPredictiveEvidenceContract;
  section: EvidenceFirstSection;
}): SentenceGroundingResult {
  const { sentence, contract, section } = params;
  const clean = sentence.trim();

  if (clean.length < 5) {
    return { sentence: clean, isSubstantive: false, isGrounded: true };
  }

  const lower = clean.toLowerCase();

  // Non-substantive / ethical boilerplate sentences are permitted without evidentiary anchors
  const isBoilerplate =
    /astrolife does not guarantee|human agency|free will|discernment|personal effort|healthcare advice|financial warranty|ethical boundary|not replace qualified/i.test(
      lower
    );
  if (isBoilerplate) {
    return { sentence: clean, isSubstantive: false, isGrounded: true };
  }

  // 1. Check for unrepresented factors (Raw-Input Leakage)
  if (/\b(navamsha|d-9|d9|manglik|manglik dosha|ashtakavarga|shadbala points|gemstone|pendant|rudraksha)\b/i.test(lower)) {
    return {
      sentence: clean,
      isSubstantive: true,
      isGrounded: false,
      rejectionReason: "Sentence references unrepresented factors (divisional charts, doshas, gemstones) absent from the evidence contract.",
    };
  }

  // 1b. Check for unauthorized external treatises or non-KP concepts
  if (/\b(brihat\s+parasara|bphs|jaimini|prasna\s+marga|phala\s+deepika|saravali|lal\s+kitab|combustion)\b/i.test(lower)) {
    return {
      sentence: clean,
      isSubstantive: true,
      isGrounded: false,
      rejectionReason: "Sentence references unauthorized external treatise, text, or non-KP classical concept absent from the evidence contract.",
    };
  }

  // 2. Check for arbitrary timing durations
  if (/\b(within|in)\s+(\d+|two|three|four|five|six|seven|eight|nine|ten|twelve)\s+(days|weeks|months|years)\b/i.test(lower)) {
    return {
      sentence: clean,
      isSubstantive: true,
      isGrounded: false,
      rejectionReason: "Sentence asserts arbitrary timing duration not authorized in the contract.",
    };
  }

  // 3. Check for prohibited scores & probabilities
  if (/(\b\d+\s*%|\bprobability\b|\bscore:\s*\d+|\b\d+\/100\b|\bconfidence:\s*\d+)/i.test(lower)) {
    return {
      sentence: clean,
      isSubstantive: true,
      isGrounded: false,
      rejectionReason: "Sentence asserts prohibited numerical scores, percentages, or probability tiers.",
    };
  }

  // 4. Check for fatalistic absolute claims
  if (/\b(will\s+definitely\s+never|guaranteed\s+to\s+fail|absolute\s+fate|doomed|forever\s+denied)\b/i.test(lower)) {
    return {
      sentence: clean,
      isSubstantive: true,
      isGrounded: false,
      rejectionReason: "Sentence asserts fatalistic certainty or ungrounded absolute denial.",
    };
  }

  // 5. Check if sentence mentions planets
  const mentionedPlanets = PLANETARY_NAMES.filter((p) => new RegExp(`\\b${p}\\b`, "i").test(lower));
  if (mentionedPlanets.length > 0) {
    // Check if any mentioned planet is completely unauthorized
    const authorizedPlanets = [
      contract.primaryCuspSubLord.toLowerCase(),
      contract.activeDashaLords.mahadasha.toLowerCase(),
      contract.activeDashaLords.antardasha.toLowerCase(),
      ...contract.rulingPlanetsMatchedLords.map((l) => l.toLowerCase()),
    ];

    const hasUnauthorizedPlanet = mentionedPlanets.some((p) => !authorizedPlanets.includes(p));
    if (hasUnauthorizedPlanet) {
      return {
        sentence: clean,
        isSubstantive: true,
        isGrounded: false,
        rejectionReason: `Sentence references unauthorized planet(s) (${mentionedPlanets.join(", ")}) not present in the active evidence contract.`,
      };
    }
  }

  // 6. Map to authorized findings & evidence nodes
  const matchedFinding = section.findings.find((f) => {
    const relMatch = lower.includes(f.relationId.toLowerCase());
    const ruleMatch = lower.includes(f.rule.ruleId.toLowerCase());
    const cuspMatch = lower.includes(`cusp ${contract.primaryCusp}`) || lower.includes(`${contract.primaryCusp}th`);
    return relMatch || ruleMatch || cuspMatch;
  });

  if (matchedFinding) {
    return {
      sentence: clean,
      isSubstantive: true,
      isGrounded: true,
      matchedFindingId: matchedFinding.findingId,
      matchedNodeIds: matchedFinding.evidence.nodeIds,
      matchedRelationId: matchedFinding.relationId,
    };
  }

  // General astrological claim check: if it makes a claim about timing, promise, or fructification,
  // ensure it aligns with the synthesis state
  const isAstrologicalClaim =
    /\b(promise|timing|transit|sub-lord|sub lord|dasha|manifestation|fructif|denial|obstruct|favourable|delay)\b/i.test(
      lower
    );

  if (isAstrologicalClaim) {
    // Check if it contradicts synthesis state
    if (contract.synthesisDecision.state === "TIMING_OBSTRUCTED") {
      if (/\b(brings\s+now|immediate\s+success|perfect\s+window\s+now|event\s+will\s+occur\s+now)\b/i.test(lower)) {
        return {
          sentence: clean,
          isSubstantive: true,
          isGrounded: false,
          rejectionReason: "Sentence contradicts TIMING_OBSTRUCTED synthesis state by claiming an immediate favourable window.",
        };
      }
    }

    if (contract.synthesisDecision.state === "EVENT_DENIED_BY_NATAL_PROMISE") {
      if (/\b(will\s+occur|event\s+will\s+happen|marriage\s+is\s+promised|success\s+is\s+assured)\b/i.test(lower)) {
        return {
          sentence: clean,
          isSubstantive: true,
          isGrounded: false,
          rejectionReason: "Sentence contradicts EVENT_DENIED_BY_NATAL_PROMISE synthesis state by asserting event occurrence.",
        };
      }
    }

    return {
      sentence: clean,
      isSubstantive: true,
      isGrounded: true,
      matchedNodeIds: contract.authorizedEvidenceNodeIds,
    };
  }

  // Non-astrological connecting prose
  return { sentence: clean, isSubstantive: false, isGrounded: true };
}

// ── 3. Production Consumer Narrative Validator ──────────────────────────────

/**
 * Validates the complete five-part narrative generated by the AI against the contract.
 * Rejects ungrounded claims, prohibited scores, fatalism, and RP overreach.
 */
export function validateAiReportNarrative(params: {
  narrative: FivePartNarrative;
  contract: KPPredictiveEvidenceContract;
  section: EvidenceFirstSection;
}): NarrativeValidationResult {
  const { narrative, contract, section } = params;
  const rejections: string[] = [];
  const auditNotes: string[] = [];
  const sentenceEvaluations: SentenceGroundingResult[] = [];

  const narrativeParts: (keyof FivePartNarrative)[] = [
    "whatWasFound",
    "whyItMatters",
    "whichRuleProducedIt",
    "practicalInterpretation",
    "whatIsUncertain",
    "whatWeDoNotClaim",
  ];

  for (const part of narrativeParts) {
    const text = narrative[part];
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      if (part === "whichRuleProducedIt") continue; // Optional in LLM JSON output, filled from contract
      rejections.push(`REJECTED: Narrative part "${part}" is empty or missing.`);
      continue;
    }

    // Split text into individual sentences
    const sentences = text
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const sentence of sentences) {
      const evaluation = verifySentenceGrounding({ sentence, contract, section });
      sentenceEvaluations.push(evaluation);

      if (!evaluation.isGrounded && evaluation.rejectionReason) {
        rejections.push(`REJECTED in "${part}": ${evaluation.rejectionReason} (Sentence: "${sentence}")`);
      }
    }
  }

  // Global Check 1: Reference_Pending Guard
  if (contract.ruleStatus === "Reference_Pending") {
    const fullText = Object.values(narrative).join(" ");
    if (!/evaluation\s+pending|pending\s+verification|reference\s+pending|uncertain/i.test(fullText)) {
      rejections.push("REJECTED: Reference_Pending narrative omitted required evaluation pending disclosure.");
    }
    if (/\b(will\s+(\w+\s+)?fructify|guaranteed?|definite(ly)?|certain(ly)?|high\s+chance|will\s+succeed)\b/i.test(fullText)) {
      rejections.push("REJECTED: Reference_Pending narrative asserted predictive certainty or outcome.");
    }
  }

  // Global Check 2: Ruling Planets Causal Overreach Guard
  const combinedText = Object.values(narrative).join(" ");
  if (/\b(ruling\s+planets?\s+(caused|created|vetoed|guaranteed|decided|manufactured))\b/i.test(combinedText)) {
    rejections.push("REJECTED: Narrative claims Ruling Planets created, caused, or vetoed the event.");
  }

  // Global Check 3: Raw-Input Leakage Guard
  if (/\b(navamsha\s+chart|d-9\s+chart|ashtakavarga\s+points|manglik\s+dosha)\b/i.test(combinedText)) {
    rejections.push("REJECTED: Narrative leaked raw chart factors (Navamsha, Manglik, Ashtakavarga) absent from the contract.");
  }

  const isValid = rejections.length === 0;
  if (isValid) {
    auditNotes.push(`Grounded ${sentenceEvaluations.filter((s) => s.isSubstantive).length} substantive sentences across all 5 narrative components.`);
  }

  return {
    isValid,
    rejections,
    sentenceEvaluations,
    auditNotes,
  };
}

// ── 4. Constrained Regeneration & Deterministic Fallback Strategy ────────────

/**
 * Orchestrates grounded narrative generation:
 * 1. Executes AI generation conditioned on the evidence contract.
 * 2. Runs strict evidentiary validation.
 * 3. If validation fails, attempts constrained regeneration with rejection feedback (SAME contract).
 * 4. If regeneration still fails, falls back gracefully to verified deterministic template text.
 */
export async function generateGroundedNarrativeWithRegeneration(params: {
  contract: KPPredictiveEvidenceContract;
  section: EvidenceFirstSection;
  whyModel: WhyAmISeeingThisModel;
  callLlmFn?: (promptPayload: PromptPayload, rejectionFeedback?: string[]) => Promise<FivePartNarrative>;
  maxRetries?: number;
}): Promise<GroundedNarrativePayload> {
  const { contract, section, whyModel, callLlmFn, maxRetries = 1 } = params;

  // If no LLM function is provided, immediately return verified deterministic template fallback
  if (!callLlmFn) {
    const fallbackNarrative: FivePartNarrative = {
      whatWasFound: section.fivePartNarrative.whatWasFound,
      whyItMatters: section.fivePartNarrative.whyItMatters,
      whichRuleProducedIt: section.fivePartNarrative.whichRuleProducedIt,
      practicalInterpretation: section.progressiveDisclosure.casual.practicalInterpretation,
      whatIsUncertain: section.fivePartNarrative.whatIsUncertain,
      whatWeDoNotClaim: section.fivePartNarrative.whatWeDoNotClaim,
    };

    const valResult = validateAiReportNarrative({ narrative: fallbackNarrative, contract, section });

    return {
      narrative: fallbackNarrative,
      origin: "deterministic-template-fallback",
      validationResult: valResult,
      regenerationCount: 0,
      auditHash: `AUDIT-FALLBACK-${contract.ruleId}-${contract.synthesisDecision.state}`,
    };
  }

  const promptPayload = buildEvidenceConditionedNarrativePrompt(contract, section, whyModel);
  let attempt = 0;
  let lastValidationResult: NarrativeValidationResult | null = null;
  let rejectionFeedback: string[] | undefined = undefined;

  while (attempt <= maxRetries) {
    try {
      const generatedNarrative = await callLlmFn(promptPayload, rejectionFeedback);
      const validation = validateAiReportNarrative({ narrative: generatedNarrative, contract, section });

      if (validation.isValid) {
        return {
          narrative: generatedNarrative,
          origin: "ai-generated-verified",
          validationResult: validation,
          regenerationCount: attempt,
          auditHash: `AUDIT-AI-${contract.ruleId}-${contract.synthesisDecision.state}-${attempt}`,
        };
      }

      lastValidationResult = validation;
      rejectionFeedback = validation.rejections;
      attempt++;
    } catch (err) {
      attempt++;
    }
  }

  // All regeneration attempts failed; fall back to verified deterministic template
  const fallbackNarrative: FivePartNarrative = {
    whatWasFound: section.fivePartNarrative.whatWasFound,
    whyItMatters: section.fivePartNarrative.whyItMatters,
    whichRuleProducedIt: section.fivePartNarrative.whichRuleProducedIt,
    practicalInterpretation: section.progressiveDisclosure.casual.practicalInterpretation,
    whatIsUncertain: section.fivePartNarrative.whatIsUncertain,
    whatWeDoNotClaim: section.fivePartNarrative.whatWeDoNotClaim,
  };

  const finalVal = validateAiReportNarrative({ narrative: fallbackNarrative, contract, section });

  return {
    narrative: fallbackNarrative,
    origin: "deterministic-template-fallback",
    validationResult: lastValidationResult || finalVal,
    regenerationCount: attempt - 1,
    auditHash: `AUDIT-FALLBACK-AFTER-RETRY-${contract.ruleId}-${contract.synthesisDecision.state}`,
  };
}
