/**
 * ============================================================================
 * ASTROLIFE — HEALTH & ASTRO-MEDICAL INTELLIGENCE ENGINE TESTS
 * ============================================================================
 * Comprehensive Verification Suite:
 * 1. Emergency safety interception on red-flag keywords
 * 2. Deterministic 7-dimension scoring within [0, 100]
 * 3. Dasha-driven health vector & safe remedies generation
 * 4. Casebook matching against transcript reference cases
 * 5. Full end-to-end execution with live calculated natal chart
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { calculateChart } from "../calculations";
import { runKPEngine } from "../kp";
import {
  runMedicalEngine,
  evaluateMedicalSafety,
  computeHealthScorecard,
  computeDashaHealthVector,
  matchTranscriptCases,
  PLANETARY_SAFE_REMEDIES,
  MEDICAL_CASEBOOK,
  SIXTEEN_DAY_REMEDY_PROTOCOLS,
} from "./index";

test("Health Engine 1: Emergency red-flag safety interception", () => {
  const emergency1 = evaluateMedicalSafety("User reports sudden severe chest pain and breathlessness");
  assert.equal(emergency1.isEmergency, true);
  assert.ok(emergency1.emergencyMessage?.includes("🚨 URGENT CLINICAL MEDICAL ALERT"));

  const emergency2 = evaluateMedicalSafety("I am feeling suicidal");
  assert.equal(emergency2.isEmergency, true);

  const safeQuery = evaluateMedicalSafety("What is my astrological health profile during Jupiter dasha?");
  assert.equal(safeQuery.isEmergency, false);
});

test("Health Engine 2: Planetary Safe Remedies completeness", () => {
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as const;
  for (const p of planets) {
    const remedies = PLANETARY_SAFE_REMEDIES[p];
    assert.ok(remedies && remedies.length >= 2, `Remedies must exist for planet ${p}`);
    for (const rem of remedies) {
      assert.ok(rem.id);
      assert.ok(rem.title);
      assert.ok(rem.description);
      assert.ok(rem.actionableSteps.length > 0);
      assert.ok(rem.safetyNote);
    }
  }
});

test("Health Engine 3: Deterministic Scorecard boundaries and clamp", () => {
  const scorecard = computeHealthScorecard({
    cusp1CSL: "Sun",
    cusp6CSL: "Venus",
    cusp8CSL: "Saturn",
    cusp12CSL: "Rahu",
    cusp1Significations: [1, 5, 11],
    cusp6Significations: [6, 8],
    cusp8Significations: [8, 12],
    cusp12Significations: [12, 6],
    mdLord: "Venus",
    adLord: "Saturn",
    mdSignifications: [6, 8],
    adSignifications: [6, 8, 12],
    activeRuleIds: ["COMB-VEN-SAT-NEPHROLITHIASIS"],
  });

  assert.ok(scorecard.constitutionalVitality >= 0 && scorecard.constitutionalVitality <= 100);
  assert.ok(scorecard.diseaseSensitivity >= 0 && scorecard.diseaseSensitivity <= 100);
  assert.ok(scorecard.chronicityFactor >= 0 && scorecard.chronicityFactor <= 100);
  assert.ok(scorecard.confinementIndex >= 0 && scorecard.confinementIndex <= 100);
  assert.ok(scorecard.recoveryResilience >= 0 && scorecard.recoveryResilience <= 100);
  assert.ok(scorecard.dashaActivationLoad >= 0 && scorecard.dashaActivationLoad <= 100);
  assert.ok(["Low", "Moderate", "Strong", "Very_Strong_Traditional_Pattern"].includes(scorecard.repetitionConfidence));
});

test("Health Engine 4: Dasha Health Vector generates targeted remedies", () => {
  const dashaVector = computeDashaHealthVector({
    mahadashaLord: "Rahu",
    antardashaLord: "Mercury",
    mdSignifiedHouses: [6, 8],
    adSignifiedHouses: [6],
    nextAntardashaLord: "Jupiter",
    nextAdStartDate: "2027-04-15",
    nextAdSignifiedHouses: [5, 11],
  });

  assert.equal(dashaVector.mahadasha, "Rahu");
  assert.equal(dashaVector.antardasha, "Mercury");
  assert.ok(dashaVector.activeDomains.includes("respiratory") || dashaVector.activeDomains.includes("neurological"));
  assert.ok(dashaVector.recommendedRemedies.length > 0, "Must provide curated safe remedies");
  assert.ok(dashaVector.upcomingTransition, "Upcoming transition must be computed");
  assert.equal(dashaVector.upcomingTransition?.isRecoveryWindow, true, "Jupiter 5/11 must be marked as recovery window");
});

test("Health Engine 5: Transcript Case Matching", () => {
  assert.ok(MEDICAL_CASEBOOK.length >= 5, "Casebook must have verified classroom cases");
  const matches = matchTranscriptCases({
    activePlanets: ["Venus", "Mercury"],
    activeHouses: [6, 1],
    cusp6CSL: "Venus",
    mdLord: "Venus",
    adLord: "Mercury",
  });

  assert.ok(matches.length > 0, "Must match at least one transcript case");
  assert.equal(matches[0].matchedCase.id, "CASE-MED-001");
  assert.ok(matches[0].similarityScore >= 70);
});

test("Health Engine 6: End-to-End Orchestrator with Natal Chart", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  assert.ok(evidence, "KP predictive evidence must exist");

  const result = runMedicalEngine(evidence, {
    userQuery: "How does my health look in the current planetary period?",
  });

  assert.equal(result.isEmergencyInterrupted, false);
  assert.ok(result.scorecard);
  assert.ok(result.dashaHealth);
  assert.ok(result.dashaHealth.recommendedRemedies.length > 0, "Dasha health must provide remedies");
  assert.ok(result.domainAssessments.length > 0);
  assert.ok(result.explainability.cuspEvidence.length > 0);
  assert.ok(result.explainability.dashaEvidence.length > 0);
  assert.ok(result.safetyDisclaimers.length >= 4);
  assert.ok(result.sixteenDayProtocols && result.sixteenDayProtocols.length > 0, "Must provide 16-day protocols");
  assert.ok(result.specialGuidelines && result.specialGuidelines.length > 0, "Must provide special transcript rules");
  assert.ok(result.personalCureModality, "Must provide personalized 5th house cure modality");
  assert.ok(result.personalCureModality.cusp5CSL);
  assert.ok(result.personalCureModality.cslStarLord);
  assert.ok(result.personalCureModality.recommendedModality);
  assert.ok(result.personalCureModality.rationale);
});

test("Health Engine 7: 16-Day Protocols & Special Rules Verification", () => {
  assert.equal(MEDICAL_CASEBOOK.length, 20, "Must have exactly 20 transcript cases");
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as const;
  for (const p of planets) {
    const proto = SIXTEEN_DAY_REMEDY_PROTOCOLS[p];
    assert.ok(proto, `16-day protocol must exist for ${p}`);
    assert.equal(proto.packetCount, 16, "Packet count must be exactly 16");
    assert.ok(proto.clothColor);
    assert.ok(proto.material);
    assert.ok(proto.burnMethod);
    assert.ok(["Kitchen Sink", "Toilet Flush"].includes(proto.disposalDestination));
    assert.ok(proto.strictFoodAvoidance);
  }

  // Strict flush rule check
  assert.equal(SIXTEEN_DAY_REMEDY_PROTOCOLS.Saturn.disposalDestination, "Toilet Flush");
  assert.equal(SIXTEEN_DAY_REMEDY_PROTOCOLS.Rahu.disposalDestination, "Toilet Flush");
  assert.equal(SIXTEEN_DAY_REMEDY_PROTOCOLS.Ketu.disposalDestination, "Toilet Flush");
  assert.equal(SIXTEEN_DAY_REMEDY_PROTOCOLS.Sun.disposalDestination, "Kitchen Sink");
});
