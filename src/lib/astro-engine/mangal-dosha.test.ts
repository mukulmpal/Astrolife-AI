import assert from "node:assert/strict";
import {
  calculateMangalDosha,
  compareMangalDosha,
  type ChartSnapshot,
  type MangalDoshaInput,
} from "./mangal-dosha";

const basePlanets = {
  Sun: { sign: 5 as const, degree: 10 },
  Moon: { sign: 2 as const, degree: 12 },
  Mercury: { sign: 6 as const, degree: 15 },
  Jupiter: { sign: 9 as const, degree: 8 },
  Venus: { sign: 7 as const, degree: 18 },
  Saturn: { sign: 11 as const, degree: 20 },
  Rahu: { sign: 3 as const, degree: 5 },
  Ketu: { sign: 9 as const, degree: 5 },
};

function input(chart: ChartSnapshot, school: MangalDoshaInput["school"] = "expanded"): MangalDoshaInput {
  return { natal: chart, school, includeTraditionalExceptions: true };
}

// 1. Mars in H3: no structural Manglik under any school.
{
  const chart: ChartSnapshot = {
    ascendantSign: 1,
    planets: { ...basePlanets, Moon: { sign: 1, degree: 12 }, Venus: { sign: 1, degree: 18 }, Mars: { sign: 3, degree: 10 } },
  };
  const result = calculateMangalDosha(input(chart));
  assert.equal(result.engineVersion, "2.0.0");
  assert.equal(result.rulePackVersion, "MD-2026.06");
  assert.equal(result.calculationStatus, "partial");
  assert.equal(result.scoreConfidence, "medium");
  assert.equal(result.schoolDetections.core.present, false);
  assert.equal(result.schoolDetections.expanded.present, false);
  assert.equal(result.schoolDetections.extended.present, false);
  assert.equal(result.scores.structural, 0);
  assert.ok(result.gemstoneSafety.status.length > 0);
}

// 2. Cancer Ascendant, exalted yogakaraka Mars in H7: structural presence but strong protection.
{
  const chart: ChartSnapshot = {
    ascendantSign: 4,
    planets: { ...basePlanets, Mars: { sign: 10, degree: 28, shadbalaRatio: 1.25 } },
  };
  const result = calculateMangalDosha(input(chart));
  assert.equal(result.schoolDetections.core.present, true);
  assert.equal(result.functionalNature.label, "highly_supportive");
  assert.ok(result.cancellationFactors.some((factor) => factor.ruleId === "MD-CANCEL-MARS-EXALTED"));
  assert.ok(result.scores.marsPower >= 65);
  assert.ok(result.scores.protection >= 20);
  assert.notEqual(result.severityLabel, "Severe multi-factor Mars affliction");
}

// 3. H7 Mars tightly joined Rahu and Saturn, with D9 repetition: strong/severe pattern.
{
  const d9: ChartSnapshot = {
    ascendantSign: 1,
    planets: {
      ...basePlanets,
      Mars: { sign: 7, degree: 10 },
      Venus: { sign: 7, degree: 14 },
      Saturn: { sign: 7, degree: 12 },
      Rahu: { sign: 7, degree: 11 },
    },
  };
  const chart: ChartSnapshot = {
    ascendantSign: 1,
    planets: {
      ...basePlanets,
      Mars: { sign: 7, degree: 10, shadbalaRatio: 1.2 },
      Venus: { sign: 7, degree: 14 },
      Saturn: { sign: 7, degree: 12 },
      Rahu: { sign: 7, degree: 11 },
    },
    navamsha: d9,
  };
  const result = calculateMangalDosha(input(chart));
  assert.equal(result.traditionalConcentration.label, "Triguna Manglik");
  assert.ok(result.traditionalConcentration.associatedMalefics.includes("Saturn"));
  assert.ok(result.traditionalConcentration.associatedMalefics.includes("Rahu"));
  assert.ok(result.scores.marsAffliction >= 35);
  assert.ok(result.scores.marriageVulnerability >= 70);
  assert.ok(["Moderate Manglik", "Strong Manglik pattern", "Severe multi-factor Mars affliction"].includes(result.severityLabel));
}

// 4. H11 Mars appears only in the extended school and remains low weight.
{
  const chart: ChartSnapshot = {
    ascendantSign: 1,
    planets: { ...basePlanets, Moon: { sign: 1, degree: 12 }, Venus: { sign: 1, degree: 18 }, Mars: { sign: 11, degree: 10 } },
  };
  const result = calculateMangalDosha(input(chart, "extended"));
  assert.equal(result.schoolDetections.core.present, false);
  assert.equal(result.schoolDetections.expanded.present, false);
  assert.equal(result.schoolDetections.extended.present, true);
  assert.ok(result.scores.structural < 50);
}

// 5. Comparable intensity should produce a balanced compatibility label.
{
  const chartA: ChartSnapshot = {
    ascendantSign: 1,
    planets: { ...basePlanets, Mars: { sign: 4, degree: 10 } },
  };
  const chartB: ChartSnapshot = {
    ascendantSign: 7,
    planets: { ...basePlanets, Mars: { sign: 10, degree: 10 } },
  };
  const match = compareMangalDosha(input(chartA), input(chartB));
  assert.ok(match.balanceScore >= 50);
  assert.ok(match.domainCompatibility.length >= 4);
  assert.ok(match.expressionCompatibility.score >= 0);
  assert.ok(match.timingOverlap.score >= 0);
  assert.ok(match.remedyStrategy.length >= 3);
  assert.ok(match.disclaimer.length > 20);
}

// 6. Invalid input must not be silently interpreted as Non-Manglik.
{
  const chart = {
    ascendantSign: 1,
    planets: { Moon: { sign: 2, degree: 12 }, Venus: { sign: 7, degree: 18 } },
  } as ChartSnapshot;
  const result = calculateMangalDosha(input(chart));
  assert.equal(result.calculationStatus, "invalid");
  assert.equal(result.severityLabel, "Insufficient data for Manglik assessment");
  assert.ok(result.missingInputs.includes("natal.planets.Mars"));
  assert.equal(result.scoreConfidence, "limited");
  assert.equal(result.gemstoneSafety.status, "insufficient_data");
}

console.log("All Mangal Dosha engine tests passed.");
