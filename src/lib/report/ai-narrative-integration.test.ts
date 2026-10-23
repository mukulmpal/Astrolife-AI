/**
 * ============================================================================
 * ASTROLIFE — AI NARRATIVE INTEGRATION TESTS (PHASE 2K: SPRINT C)
 * ============================================================================
 * Verification suite for evidence-conditioned prompting, sentence-level
 * evidentiary grounding, consumer narrative validation, constrained
 * regeneration, and deterministic fallback.
 *
 * Test Matrix:
 * Test A: Evidence-only prompt construction (no raw chart data)
 * Test B: Raw chart leakage rejection (Navamsha, Manglik, raw degrees)
 * Test C: Unsupported sentence rejection (unauthorized planets/houses)
 * Test D: Supported paraphrase acceptance (semantic authorization without word-match)
 * Test E: Rule/Relation grounding (Finding -> Relation -> Node -> Contract)
 * Test F: Fabricated citation rejection
 * Test G: Numeric score/probability rejection
 * Test H: Fatalistic language rejection
 * Test I: Ruling Planets causal-overreach rejection
 * Test J: Reference_Pending certainty rejection
 * Test K: Arbitrary-duration rejection
 * Test L: Same-contract regeneration (retries receive identical contract)
 * Test M: Deterministic fallback (activates when AI fails or cannot pass validation)
 * Test N: Fallback provenance (explicitly marked as deterministic-template-fallback)
 * Test O: Sentence -> Finding -> Node trace completeness
 * Test P: Presentation state immutability
 * Test Q: Prompt determinism
 * Adversarial Test 1: "Your marriage will definitely never happen" on OBSTRUCTED -> REJECT
 * Adversarial Test 2: "This evidence indicates timing obstruction within the evaluated period; it does not establish that the underlying event is impossible." -> ACCEPT
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";

import { calculateChart } from "../astro-engine/calculations";
import { runKPEngine } from "../astro-engine/kp";
import { CANONICAL_AUDIT_CHART_PARAMS } from "../astro-engine/kp-evidence-graph-audit";
import { buildKPPredictiveEvidenceContract } from "../astro-engine/kp-production-contract";
import {
  buildEvidenceFirstSection,
  type EvidenceFirstSection,
  type FivePartNarrative,
} from "./evidence-first-report";
import { buildWhyAmISeeingThis } from "./explainability";
import {
  buildEvidenceConditionedNarrativePrompt,
  verifySentenceGrounding,
  validateAiReportNarrative,
  generateGroundedNarrativeWithRegeneration,
  type PromptPayload,
} from "./ai-narrative-integration";

function getCanonicalChartAndKP() {
  const chart = calculateChart(
    CANONICAL_AUDIT_CHART_PARAMS.name,
    CANONICAL_AUDIT_CHART_PARAMS.dob,
    CANONICAL_AUDIT_CHART_PARAMS.tob,
    CANONICAL_AUDIT_CHART_PARAMS.city,
    CANONICAL_AUDIT_CHART_PARAMS.lat,
    CANONICAL_AUDIT_CHART_PARAMS.lon,
    CANONICAL_AUDIT_CHART_PARAMS.tz
  );
  const kp = runKPEngine(chart);
  return { chart, kp };
}

// ── Test A: Evidence-Only Prompt Construction ───────────────────────────────
test("2K-C Test A — Evidence-only prompt construction excludes raw chart data", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);
  const whyModel = buildWhyAmISeeingThis(section);

  const promptPayload = buildEvidenceConditionedNarrativePrompt(contract, section, whyModel);

  // Assert absolute absence of raw coordinate/ephemeris leakage in user context prompt
  assert.equal(/latitude|longitude|timezone|ayanamsha\s+value|julian\s+day/i.test(promptPayload.userPrompt), false);
  assert.equal(/navamsha|d-9|manglik|ashtakavarga/i.test(promptPayload.userPrompt), false);

  // Assert system prompt establishes hard evidentiary constraints
  assert.ok(promptPayload.systemPrompt.includes("EVIDENCE IS THE ONLY AUTHORITY"));
  assert.ok(promptPayload.systemPrompt.includes("YOU ARE NOT AN ASTROLOGER"));
  assert.ok(promptPayload.userPrompt.includes(contract.ruleId));
  assert.ok(promptPayload.userPrompt.includes(contract.primaryCuspSubLord));
});

// ── Test B: Raw Chart Leakage Rejection ──────────────────────────────────────
test("2K-C Test B — Raw chart leakage (Navamsha, Manglik dosha) is rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const leakingNarrative: FivePartNarrative = {
    whatWasFound: "The marriage promise is evaluated, but Navamsha chart D-9 shows an afflicted 7th lord.",
    whyItMatters: "Manglik dosha further complicates the marital timeline.",
    whichRuleProducedIt: "KP-RULE-MARRIAGE-01",
    practicalInterpretation: "Focus on personal discernment.",
    whatIsUncertain: "The active sub-period window remains in transition.",
    whatWeDoNotClaim: "AstroLife does not guarantee fate.",
  };

  const validation = validateAiReportNarrative({ narrative: leakingNarrative, contract, section });
  assert.equal(validation.isValid, false);
  assert.ok(validation.rejections.some((r) => r.includes("unrepresented factors") || r.includes("raw chart factors")));
});

// ── Test C: Unsupported Sentence Rejection ──────────────────────────────────
test("2K-C Test C — Unsupported sentences introducing unauthorized planets are rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  // Invent a claim about Jupiter when Jupiter is not in active contract
  const unauthorizedSentence = "Jupiter in 9th house brings great spiritual favor to this marriage.";
  const result = verifySentenceGrounding({ sentence: unauthorizedSentence, contract, section });

  assert.equal(result.isGrounded, false);
  assert.ok(result.rejectionReason?.includes("unauthorized planet"));
});

// ── Test D: Supported Paraphrase Acceptance ──────────────────────────────────
test("2K-C Test D — Supported paraphrases are accepted without requiring literal word match", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  // Paraphrase of Cusp 7 promise denial
  const paraphrasedSentence = `Under classical KP principles, the 7th-cusp sub-lord connects to contrary houses, preventing the foundational promise of legal union.`;
  const result = verifySentenceGrounding({ sentence: paraphrasedSentence, contract, section });

  assert.equal(result.isGrounded, true);
  assert.ok(result.matchedFindingId || result.matchedNodeIds);
});

// ── Test E: Rule/Relation Grounding ──────────────────────────────────────────
test("2K-C Test E — Sentences explicitly citing relation IDs map to authorized finding nodes", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const relationId = contract.conflictFindings[0]?.relationId || "REL-01";
  const sentence = `According to ${relationId}, the natal cusp sub-lord takes precedence over supportive downstream periods.`;
  const result = verifySentenceGrounding({ sentence, contract, section });

  assert.equal(result.isGrounded, true);
  assert.equal(result.matchedRelationId, relationId);
  assert.ok(result.matchedNodeIds && result.matchedNodeIds.length > 0);
});

// ── Test F: Fabricated Citation Rejection ────────────────────────────────────
test("2K-C Test F — Fabricated citations or ungrounded external texts are rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const sentence = "As stated in Brihat Parasara Hora Sastra Chapter 12 on planetary combustion, this brings delay.";
  const result = verifySentenceGrounding({ sentence, contract, section });

  assert.equal(result.isGrounded, false);
});

// ── Test G: Numeric Score / Probability Rejection ───────────────────────────
test("2K-C Test G — Numeric prediction scores, percentages, and probability tiers are rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const scoredNarrative: FivePartNarrative = {
    whatWasFound: "The marriage promise has an 85% probability of manifestation with a score: 9/10.",
    whyItMatters: "Sub-lord significations are aligned.",
    whichRuleProducedIt: "KP-RULE-MARRIAGE-01",
    practicalInterpretation: "Proceed with practical efforts.",
    whatIsUncertain: "The current Dasha timing window.",
    whatWeDoNotClaim: "AstroLife does not guarantee fate.",
  };

  const validation = validateAiReportNarrative({ narrative: scoredNarrative, contract, section });
  assert.equal(validation.isValid, false);
  assert.ok(validation.rejections.some((r) => r.includes("prohibited numerical score")));
});

// ── Test H: Fatalistic Language Rejection ────────────────────────────────────
test("2K-C Test H — Fatalistic language and absolute guarantees are rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const fatalisticSentence = "Your marriage will definitely never happen due to absolute fate.";
  const result = verifySentenceGrounding({ sentence: fatalisticSentence, contract, section });

  assert.equal(result.isGrounded, false);
  assert.ok(result.rejectionReason?.includes("fatalistic certainty"));
});

// ── Test I: Ruling Planets Causal Overreach Rejection ───────────────────────
test("2K-C Test I — Claims that Ruling Planets caused or vetoed an event are rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const overreachNarrative: FivePartNarrative = {
    whatWasFound: "The Ruling Planets caused the event to fail and vetoed the marriage outcome.",
    whyItMatters: "The RP lords were discordant with the ascendant.",
    whichRuleProducedIt: "KP-RULE-MARRIAGE-01",
    practicalInterpretation: "Patience is advised.",
    whatIsUncertain: "The timing window.",
    whatWeDoNotClaim: "No absolute guarantees.",
  };

  const validation = validateAiReportNarrative({ narrative: overreachNarrative, contract, section });
  assert.equal(validation.isValid, false);
  assert.ok(validation.rejections.some((r) => r.includes("Ruling Planets created, caused, or vetoed")));
});

// ── Test J: Reference_Pending Certainty Rejection ───────────────────────────
test("2K-C Test J — Reference_Pending topic asserting predictive certainty is rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-SPECULATIVE-GAINS-01");
  const section = buildEvidenceFirstSection(contract);

  const speculativeCertaintyNarrative: FivePartNarrative = {
    whatWasFound: "Intraday speculative gains will definitely fructify with high profit.",
    whyItMatters: "5th and 11th houses are active.",
    whichRuleProducedIt: "KP-RULE-SPECULATIVE-GAINS-01",
    practicalInterpretation: "Invest aggressively.",
    whatIsUncertain: "Market fluctuations.",
    whatWeDoNotClaim: "No warranties.",
  };

  const validation = validateAiReportNarrative({ narrative: speculativeCertaintyNarrative, contract, section });
  assert.equal(validation.isValid, false);
  assert.ok(validation.rejections.some((r) => r.includes("Reference_Pending")));
});

// ── Test K: Arbitrary Duration Rejection ────────────────────────────────────
test("2K-C Test K — Arbitrary timing duration claims (e.g. 'within 6 months') are rejected", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const arbitraryDurationSentence = "Marriage will occur within 6 months as transits shift.";
  const result = verifySentenceGrounding({ sentence: arbitraryDurationSentence, contract, section });

  assert.equal(result.isGrounded, false);
  assert.ok(result.rejectionReason?.includes("arbitrary timing duration"));
});

// ── Test L: Same-Contract Regeneration ──────────────────────────────────────
test("2K-C Test L — Regeneration on validation failure receives the exact same contract plus feedback", async () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-PROPERTY-ACQUISITION-01");
  const section = buildEvidenceFirstSection(contract);
  const whyModel = buildWhyAmISeeingThis(section);

  let attemptCount = 0;
  const contractsReceived: string[] = [];
  const feedbackReceived: string[][] = [];

  const mockLlmWithCorrection = async (payload: PromptPayload, rejectionFeedback?: string[]): Promise<FivePartNarrative> => {
    attemptCount++;
    contractsReceived.push(JSON.stringify(payload.authorizedContractSummary));
    if (rejectionFeedback) {
      feedbackReceived.push(rejectionFeedback);
    }

    // Attempt 1: Fail intentionally with a score
    if (attemptCount === 1) {
      return {
        whatWasFound: "Property acquisition score is 95% favorable.",
        whyItMatters: "4th house sub-lord signifies gains.",
        whichRuleProducedIt: "KP-RULE-PROPERTY-ACQUISITION-01",
        practicalInterpretation: "Proceed with property plans.",
        whatIsUncertain: "Sub-period timing shifts.",
        whatWeDoNotClaim: "AstroLife does not guarantee events.",
      };
    }

    // Attempt 2: Corrected valid response
    return {
      whatWasFound: section.fivePartNarrative.whatWasFound,
      whyItMatters: section.fivePartNarrative.whyItMatters,
      whichRuleProducedIt: section.fivePartNarrative.whichRuleProducedIt,
      practicalInterpretation: section.progressiveDisclosure.casual.practicalInterpretation,
      whatIsUncertain: section.fivePartNarrative.whatIsUncertain,
      whatWeDoNotClaim: section.fivePartNarrative.whatWeDoNotClaim,
    };
  };

  const result = await generateGroundedNarrativeWithRegeneration({
    contract,
    section,
    whyModel,
    callLlmFn: mockLlmWithCorrection,
    maxRetries: 1,
  });

  assert.equal(attemptCount, 2, "Must retry once upon validation failure");
  assert.equal(result.origin, "ai-generated-verified");
  assert.equal(result.validationResult.isValid, true);
  assert.equal(contractsReceived[0], contractsReceived[1], "Both attempts must receive the identical contract");
  assert.ok(feedbackReceived.length > 0, "Second attempt must receive rejection feedback");
});

// ── Test M & N: Deterministic Fallback & Provenance ──────────────────────────
test("2K-C Test M & N — Deterministic fallback activates when AI fails and is marked with fallback provenance", async () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);
  const whyModel = buildWhyAmISeeingThis(section);

  // Mock an LLM that repeatedly generates invalid text
  const failingLlm = async (): Promise<FivePartNarrative> => ({
    whatWasFound: "100% guaranteed success in 3 months with score 10/10.",
    whyItMatters: "Manglik dosha in Navamsha D-9.",
    whichRuleProducedIt: "KP-RULE-MARRIAGE-01",
    practicalInterpretation: "No doubts.",
    whatIsUncertain: "None.",
    whatWeDoNotClaim: "Guaranteed fate.",
  });

  const result = await generateGroundedNarrativeWithRegeneration({
    contract,
    section,
    whyModel,
    callLlmFn: failingLlm,
    maxRetries: 1,
  });

  assert.equal(result.origin, "deterministic-template-fallback", "Must fall back to deterministic template");
  assert.ok(result.narrative.whatWasFound.includes(contract.primaryCuspSubLord) || result.narrative.whatWasFound.includes("Cusp 7") || result.narrative.whatWasFound.includes("7th-cusp"));
  assert.ok(result.auditHash.startsWith("AUDIT-FALLBACK-AFTER-RETRY"));
});

// ── Test O: Sentence -> Finding -> Node Trace ───────────────────────────────
test("2K-C Test O — Traceability completeness: grounded sentences trace to finding and authorized nodes", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-CAREER-JOB-01");
  const section = buildEvidenceFirstSection(contract);

  const sentence = `The foundational promise for ${contract.ruleName} is governed by Cusp ${contract.primaryCusp} Sub-Lord ${contract.primaryCuspSubLord}.`;
  const evaluation = verifySentenceGrounding({ sentence, contract, section });

  assert.equal(evaluation.isGrounded, true);
  assert.ok(evaluation.matchedNodeIds && evaluation.matchedNodeIds.length > 0);
});

// ── Test P: Presentation State Immutability ─────────────────────────────────
test("2K-C Test P — Narrative generation and validation leaves contract and section bit-identical", async () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);
  const whyModel = buildWhyAmISeeingThis(section);

  const contractBefore = JSON.stringify(contract);
  const sectionBefore = JSON.stringify(section);

  await generateGroundedNarrativeWithRegeneration({
    contract,
    section,
    whyModel,
  });

  assert.equal(JSON.stringify(contract), contractBefore);
  assert.equal(JSON.stringify(section), sectionBefore);
});

// ── Test Q: Prompt Determinism ──────────────────────────────────────────────
test("2K-C Test Q — Prompt payload construction is 100% deterministic", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);
  const whyModel = buildWhyAmISeeingThis(section);

  const p1 = buildEvidenceConditionedNarrativePrompt(contract, section, whyModel);
  const p2 = buildEvidenceConditionedNarrativePrompt(contract, section, whyModel);

  assert.deepEqual(p1, p2, "Prompt generation must be bit-identical");
});

// ── Adversarial Test 1 ──────────────────────────────────────────────────────
test("2K-C Adversarial Test 1 — 'Your marriage will definitely never happen' on OBSTRUCTED must be REJECTED", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const adversarialSentence = "Your marriage will definitely never happen due to the planetary obstruction.";
  const result = verifySentenceGrounding({ sentence: adversarialSentence, contract, section });

  assert.equal(result.isGrounded, false, "Must reject fatalistic denial claim");
  assert.ok(result.rejectionReason?.includes("fatalistic certainty"));
});

// ── Adversarial Test 2 ──────────────────────────────────────────────────────
test("2K-C Adversarial Test 2 — Measured timing explanation acknowledging obstruction without permanent denial must be ACCEPTED", () => {
  const { chart, kp } = getCanonicalChartAndKP();
  const contract = buildKPPredictiveEvidenceContract(chart, kp, "KP-RULE-MARRIAGE-01");
  const section = buildEvidenceFirstSection(contract);

  const groundedSentence = "This evidence indicates timing obstruction within the evaluated period; it does not establish that the underlying event is impossible.";
  const result = verifySentenceGrounding({ sentence: groundedSentence, contract, section });

  assert.equal(result.isGrounded, true, "Must accept measured timing explanation that is grounded");
});
