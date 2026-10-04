import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateTargetHouse,
  computeDrishtiHitsForPlanet,
  getPlanetAspectRules,
} from "../aspect-profiles";

test("calculateTargetHouse: Standard inclusive Vedic counting", () => {
  // From H5, 3rd aspect reaches H7: ((5-1 + 2) % 12) + 1 = 7
  assert.equal(calculateTargetHouse(5, 3), 7);

  // From H5, 7th aspect reaches H11: ((5-1 + 6) % 12) + 1 = 11
  assert.equal(calculateTargetHouse(5, 7), 11);

  // From H5, 10th aspect reaches H2: ((5-1 + 9) % 12) + 1 = 2
  assert.equal(calculateTargetHouse(5, 10), 2);

  // From H1, 7th aspect reaches H7
  assert.equal(calculateTargetHouse(1, 7), 7);

  // From H12, 2nd house reaches H1
  assert.equal(calculateTargetHouse(12, 2), 1);
});

test("computeDrishtiHitsForPlanet: Verifies triple-aspect overlap on House 2 (Dhana Bhava)", () => {
  // Saturn in H5
  const satHits = computeDrishtiHitsForPlanet("Saturn", 5);
  const satTargetHouses = satHits.map((h) => h.targetHouse);
  assert.deepEqual(satTargetHouses, [7, 11, 2]);

  // Jupiter in H8
  const jupHits = computeDrishtiHitsForPlanet("Jupiter", 8);
  const jupTargetHouses = jupHits.map((h) => h.targetHouse);
  assert.deepEqual(jupTargetHouses, [12, 2, 4]);

  // Ketu in H10 (5/7/9 profile)
  const ketuHits = computeDrishtiHitsForPlanet("Ketu", 10, "5_7_9");
  const ketuTargetHouses = ketuHits.map((h) => h.targetHouse);
  assert.deepEqual(ketuTargetHouses, [2, 4, 6]);

  // Notice all three hit House 2 (Dhana Bhava)!
  assert.ok(satTargetHouses.includes(2));
  assert.ok(jupTargetHouses.includes(2));
  assert.ok(ketuTargetHouses.includes(2));
});

test("getPlanetAspectRules: Supports configurable Rahu/Ketu models", () => {
  const defaultRules = getPlanetAspectRules("Rahu", "5_7_9");
  assert.equal(defaultRules.length, 3);
  assert.deepEqual(
    defaultRules.map((r) => r.offset),
    [5, 7, 9]
  );

  const classicRules = getPlanetAspectRules("Rahu", "7_ONLY");
  assert.equal(classicRules.length, 1);
  assert.equal(classicRules[0].offset, 7);
});

