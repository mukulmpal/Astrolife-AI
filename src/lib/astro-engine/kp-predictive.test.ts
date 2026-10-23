/**
 * ============================================================================
 * ASTROLIFE — KP PREDICTIVE ENGINE UNIT TESTS (PHASE 2I-A, 2I-B, 2I-C)
 * ============================================================================
 * Tests:
 * 1. 2I-A: KPPointEvidence data model normalization and completeness
 * 2. 2I-B: Classical 4-Fold Significators and Rahu/Ketu Node Representation
 * 3. 2I-C: Cusp Sub-Lord Promise Engine (SUPPORTED / OBSTRUCTED / MIXED)
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { calculateChart } from "./calculations";
import { runKPEngine, KPPlanet } from "./kp";
import {
  extractNodeRepresentations,
  build4FoldHouseSignificators,
} from "./kp-significators";
import {
  evaluateCuspPromise,
  evaluateAllCuspPromises,
} from "./kp-cusp-promise";

const ALL_KP_PLANETS: KPPlanet[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

test("2I-A — KPPointEvidence Data Model Completeness", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence;

  assert.ok(evidence, "predictiveEvidence must be attached to KPEngineResult");
  assert.ok(evidence.pointEvidence, "pointEvidence must exist");

  // Check 9 planets + Lagna + 12 Cusps = 22 points
  const points = evidence.pointEvidence;
  assert.ok(points["Lagna"], "Lagna must exist in pointEvidence");

  ALL_KP_PLANETS.forEach((planet) => {
    const p = points[planet];
    assert.ok(p, `Planet ${planet} must exist in pointEvidence`);
    assert.equal(p.type, "planet");
    assert.ok(p.longitude >= 0 && p.longitude < 360, "Longitude must be in [0, 360)");
    assert.ok(p.occupiedHouse >= 1 && p.occupiedHouse <= 12, "Occupied house must be 1..12");
    assert.ok(p.nakshatra.length > 0, "Nakshatra must be non-empty");
    assert.ok(ALL_KP_PLANETS.includes(p.starLord), "Star Lord must be a valid KP planet");
    assert.ok(ALL_KP_PLANETS.includes(p.subLord), "Sub Lord must be a valid KP planet");
    assert.ok(ALL_KP_PLANETS.includes(p.subSubLord), "Sub-Sub Lord must be a valid KP planet");
    assert.ok(Array.isArray(p.ownedHouses), "ownedHouses must be an array");
    assert.ok(Array.isArray(p.starLordOwnedHouses), "starLordOwnedHouses must be an array");
  });

  for (let h = 1; h <= 12; h++) {
    const c = points[`Cusp${h}`];
    assert.ok(c, `Cusp${h} must exist in pointEvidence`);
    assert.equal(c.type, "cusp");
    assert.equal(c.house, h);
    assert.ok(c.longitude >= 0 && c.longitude < 360);
    assert.ok(ALL_KP_PLANETS.includes(c.starLord));
    assert.ok(ALL_KP_PLANETS.includes(c.subLord));
    assert.ok(ALL_KP_PLANETS.includes(c.subSubLord));
  }
});

test("2I-B — Classical 4-Fold Significator Extraction & Integrity", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;
  const houseSignificators = evidence.houseSignificators;
  const planetSignifications = evidence.planetSignifications;

  assert.ok(houseSignificators, "houseSignificators must be populated");
  assert.ok(planetSignifications, "planetSignifications must be populated");

  // Validate all 12 houses have complete significator structure
  for (let h = 1; h <= 12; h++) {
    const hs = houseSignificators[h];
    assert.ok(hs, `House ${h} significators must exist`);
    assert.equal(hs.house, h);
    assert.ok(Array.isArray(hs.grade1Planets), "grade1Planets must be an array");
    assert.ok(Array.isArray(hs.grade2Planets), "grade2Planets must be an array");
    assert.ok(Array.isArray(hs.grade3Planets), "grade3Planets must be an array");
    assert.ok(Array.isArray(hs.grade4Planets), "grade4Planets must be an array");
    assert.ok(Array.isArray(hs.nodeAgents), "nodeAgents must be an array");
    assert.ok(Array.isArray(hs.allSignificators), "allSignificators must be an array");

    // Grade 2 verification: Occupants of house H
    hs.grade2Planets.forEach((occ) => {
      assert.equal(evidence.pointEvidence[occ].occupiedHouse, h, `${occ} must occupy house ${h}`);
    });

    // Grade 1 verification: Planets in star of occupants of house H
    hs.grade1Planets.forEach((p) => {
      const star = evidence.pointEvidence[p].starLord;
      assert.ok(hs.grade2Planets.includes(star), `${p}'s star lord ${star} must occupy house ${h}`);
    });

    // Grade 4 verification: House lord of house H
    if (hs.grade4Planets.length > 0) {
      const lord = hs.grade4Planets[0];
      assert.ok(evidence.pointEvidence[lord].ownedHouses.includes(h), `${lord} must own house ${h}`);
    }

    // Grade 3 verification: Planets in star of house lord
    hs.grade3Planets.forEach((p) => {
      const star = evidence.pointEvidence[p].starLord;
      assert.ok(hs.grade4Planets.includes(star), `${p}'s star lord ${star} must be lord of house ${h}`);
    });
  }

  // Validate planet significations mapping
  ALL_KP_PLANETS.forEach((planet) => {
    const ps = planetSignifications[planet];
    assert.ok(ps, `Significations for ${planet} must exist`);
    assert.equal(ps.planet, planet);
    assert.ok(Array.isArray(ps.strongSignifications));
    assert.ok(Array.isArray(ps.secondarySignifications));
    assert.ok(Array.isArray(ps.allSignifications));
    assert.ok(ps.details.length > 0, `${planet} must have detailed reasoning`);

    ps.details.forEach((d) => {
      assert.ok(d.house >= 1 && d.house <= 12);
      assert.ok(d.reason.length > 0);
      assert.ok(
        [
          "Grade_1_StarOfOccupant",
          "Grade_2_Occupant",
          "Grade_3_StarOfLord",
          "Grade_4_Lord",
          "Node_Representation",
        ].includes(d.grade)
      );
    });
  });
});

test("2I-B — Rahu & Ketu Node Representation Rules", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const pointEvidence = kpResult.predictiveEvidence!.pointEvidence;

  const nodeReps = extractNodeRepresentations(pointEvidence);
  assert.ok(nodeReps.Rahu, "Rahu representations must be computed");
  assert.ok(nodeReps.Ketu, "Ketu representations must be computed");

  // Sign lord and star lord must be represented
  assert.ok(nodeReps.Rahu.representedPlanets.includes(pointEvidence.Rahu.signLord));
  assert.ok(nodeReps.Rahu.representedPlanets.includes(pointEvidence.Rahu.starLord));
  assert.ok(nodeReps.Ketu.representedPlanets.includes(pointEvidence.Ketu.signLord));
  assert.ok(nodeReps.Ketu.representedPlanets.includes(pointEvidence.Ketu.starLord));
});

test("2I-C — Cusp Promise Engine Evaluates All 12 Cusps", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const cuspPromises = kpResult.predictiveEvidence!.cuspPromises;

  assert.ok(cuspPromises, "cuspPromises must be populated");

  for (let h = 1; h <= 12; h++) {
    const cp = cuspPromises[h];
    assert.ok(cp, `Cusp ${h} promise must exist`);
    assert.equal(cp.cuspHouse, h);
    assert.ok(ALL_KP_PLANETS.includes(cp.cuspSubLord));
    assert.ok(ALL_KP_PLANETS.includes(cp.cuspStarLord));
    assert.ok(Array.isArray(cp.signifiedHouses));
    assert.ok(Array.isArray(cp.favorableHouses));
    assert.ok(Array.isArray(cp.detrimentHouses));
    assert.ok(["SUPPORTED", "OBSTRUCTED", "MIXED"].includes(cp.status));
    assert.ok(cp.reason.length > 0, "Reason must be populated");
    assert.ok(cp.evidenceChain.length >= 4, "Evidence chain must be detailed");
  }

  // Marriage Cusp (7th house) specific check
  const cusp7 = cuspPromises[7];
  assert.ok(cusp7);
  // Favorable houses for marriage are 2, 7, 11
  cusp7.favorableHouses.forEach((fav) => {
    assert.ok([2, 7, 11].includes(fav), `Marriage favorable house must be in [2, 7, 11], got ${fav}`);
  });
  // Detriment houses for marriage are 1, 6, 10, 12
  cusp7.detrimentHouses.forEach((det) => {
    assert.ok(
      [1, 6, 10, 12].includes(det),
      `Marriage detriment house must be in [1, 6, 10, 12], got ${det}`
    );
  });
});

