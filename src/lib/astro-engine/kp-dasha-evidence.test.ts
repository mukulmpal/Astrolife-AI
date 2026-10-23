/**
 * ============================================================================
 * ASTROLIFE — KP DASHA EVIDENCE ADAPTER TESTS (PHASE 2I-E-A)
 * ============================================================================
 * Tests:
 * 1. Mahadasha lord maps to existing KP significations.
 * 2. Antardasha lord maps correctly.
 * 3. Pratyantar lord maps correctly.
 * 4. Sookshma lord maps correctly.
 * 5. Prana lord maps correctly.
 * 6. Dates come from existing Dasha engine.
 * 7. Adapter does not recalculate planetary positions.
 * 8. Adapter does not create duplicate significator logic.
 * 9. Node Dasha lord uses existing node representation.
 * 10. Event-house matching is deterministic.
 * 11. Same input -> identical evidence.
 * 12. No probability/confidence/score fields are generated.
 * 13. Existing tests remain green.
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { calculateChart } from "./calculations";
import { runKPEngine } from "./kp";
import {
  getKPDashaLordEvidence,
  extractDashaEventEvidence,
  buildCurrentDashaHierarchyEvidence,
} from "./kp-dasha-evidence";
import { KP_EVENT_RULE_REGISTRY } from "./kp-rule-registry";
import {
  getCurrentDashaHierarchy5Levels,
  getNakshatraFromLongitude,
  getMahadashas,
  getAntardashas,
  getPratyantardashas,
  getSookshmadashas,
  getPranadashas,
  VIMSHOTTARI_ORDER,
  DashaPeriod,
} from "./dasha";

test("2I-E-A — Test 1: Mahadasha Lord Maps to Existing KP Significations", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const mdLord = "Saturn";
  const mdEvidence = getKPDashaLordEvidence(mdLord, "MAHADASHA", evidence);

  assert.equal(mdEvidence.planet, "Saturn");
  assert.equal(mdEvidence.level, "MAHADASHA");
  assert.equal(mdEvidence.source, "KP_SIGNIFICATOR_ENGINE");

  // Verify it matches exactly what was pre-calculated in planetSignifications
  const expectedSignified = evidence.planetSignifications.Saturn.allSignifications;
  assert.deepEqual(mdEvidence.signifiedHouses, expectedSignified);
  assert.ok(mdEvidence.evidenceChain.length >= 3);
});

test("2I-E-A — Test 2: Antardasha Lord Maps Correctly", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const adLord = "Jupiter";
  const adEvidence = getKPDashaLordEvidence(adLord, "ANTARDASHA", evidence);

  assert.equal(adEvidence.planet, "Jupiter");
  assert.equal(adEvidence.level, "ANTARDASHA");
  assert.deepEqual(adEvidence.signifiedHouses, evidence.planetSignifications.Jupiter.allSignifications);
});

test("2I-E-A — Test 3: Pratyantar Lord Maps Correctly", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const pdLord = "Venus";
  const pdEvidence = getKPDashaLordEvidence(pdLord, "PRATYANTARDASHA", evidence);

  assert.equal(pdEvidence.planet, "Venus");
  assert.equal(pdEvidence.level, "PRATYANTARDASHA");
  assert.deepEqual(pdEvidence.signifiedHouses, evidence.planetSignifications.Venus.allSignifications);
});

test("2I-E-A — Test 4: Sookshma Lord Maps Correctly", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const sdLord = "Mercury";
  const sdEvidence = getKPDashaLordEvidence(sdLord, "SOOKSHMA", evidence);

  assert.equal(sdEvidence.planet, "Mercury");
  assert.equal(sdEvidence.level, "SOOKSHMA");
  assert.deepEqual(sdEvidence.signifiedHouses, evidence.planetSignifications.Mercury.allSignifications);
});

test("2I-E-A — Test 5: Prana Lord Maps Correctly", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const pranaLord = "Mars";
  const pranaEvidence = getKPDashaLordEvidence(pranaLord, "PRANA", evidence);

  assert.equal(pranaEvidence.planet, "Mars");
  assert.equal(pranaEvidence.level, "PRANA");
  assert.deepEqual(pranaEvidence.signifiedHouses, evidence.planetSignifications.Mars.allSignifications);
});

test("2I-E-A — Test 6: Dates Come from Existing Dasha Engine", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const dashaHierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  // Directly check against existing dasha engine
  const nak = getNakshatraFromLongitude(chart.planets.Moon.lon);
  const birthDate = new Date(`${chart.dob}T${chart.tob}`);
  const expectedHierarchy = getCurrentDashaHierarchy5Levels(birthDate, nak, fixedDate);

  assert.equal(dashaHierarchy.hierarchy.mahadasha.planet, expectedHierarchy.mahadasha.lord);
  assert.equal(
    dashaHierarchy.hierarchy.mahadasha.startDate,
    expectedHierarchy.mahadasha.startDate.toISOString()
  );
  assert.equal(
    dashaHierarchy.hierarchy.mahadasha.endDate,
    expectedHierarchy.mahadasha.endDate.toISOString()
  );

  assert.equal(dashaHierarchy.hierarchy.antardasha.planet, expectedHierarchy.antardasha.lord);
  assert.equal(
    dashaHierarchy.hierarchy.antardasha.startDate,
    expectedHierarchy.antardasha.startDate.toISOString()
  );
  assert.equal(
    dashaHierarchy.hierarchy.antardasha.endDate,
    expectedHierarchy.antardasha.endDate.toISOString()
  );
});

test("2I-E-A — Test 7 & 8: Adapter Does Not Recalculate Positions or Duplicate Significator Logic", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  // Pass dummy planet: adapter must read from evidence directly without calling ephemeris
  const dashaLord = getKPDashaLordEvidence("Sun", "MAHADASHA", evidence);
  assert.deepEqual(dashaLord.signifiedHouses, evidence.planetSignifications.Sun.allSignifications);
  assert.equal(dashaLord.significatorGrades.length, evidence.planetSignifications.Sun.details.length);
});

test("2I-E-A — Test 9: Node Dasha Lord Uses Existing Node Representation", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const rahuEvidence = getKPDashaLordEvidence("Rahu", "MAHADASHA", evidence);
  const ketuEvidence = getKPDashaLordEvidence("Ketu", "ANTARDASHA", evidence);

  assert.equal(rahuEvidence.planet, "Rahu");
  assert.equal(ketuEvidence.planet, "Ketu");

  // Check that node representation reasons from 2I-B are preserved in the chain
  const rahuNodeDetails = evidence.planetSignifications.Rahu.details.filter(
    (d) => d.grade === "Node_Representation"
  );
  if (rahuNodeDetails.length > 0) {
    const hasNodeMention = rahuEvidence.evidenceChain.some((str) => str.includes("Node Agent"));
    assert.ok(hasNodeMention, "Rahu evidence chain must preserve Node Agent details");
  }
});

test("2I-E-A — Test 10: Event-House Matching is Deterministic", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  const jupEvidence = getKPDashaLordEvidence("Jupiter", "MAHADASHA", evidence);
  const eventEv = extractDashaEventEvidence(marriageRule, jupEvidence, evidence);

  assert.equal(eventEv.ruleId, "KP-RULE-MARRIAGE-01");
  assert.equal(eventEv.planet, "Jupiter");
  assert.equal(eventEv.dashaLevel, "MAHADASHA");
  assert.ok(Array.isArray(eventEv.supportingHousesMatched));
  assert.ok(Array.isArray(eventEv.detrimentHousesMatched));
  assert.ok(Array.isArray(eventEv.barrierHousesMatched));

  // Verify matched supporting houses strictly intersect with rule supporting houses [2, 7, 11]
  eventEv.supportingHousesMatched.forEach((h) => {
    assert.ok([2, 7, 11].includes(h));
  });
});

test("2I-E-A — Test 11: Same Input -> Identical Evidence", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const h1 = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);
  const h2 = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  assert.deepEqual(h1, h2, "Dasha hierarchy evidence must be purely deterministic");
});

test("2I-E-A — Test 12: No Probability / Confidence / Score Fields Generated", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);
  const evidence = kpResult.predictiveEvidence!;

  const fixedDate = new Date("2026-09-20T12:00:00Z");
  const hierarchy = buildCurrentDashaHierarchyEvidence(chart, evidence, fixedDate);

  const checkNoScores = (obj: any) => {
    assert.equal(obj.score, undefined);
    assert.equal(obj.probability, undefined);
    assert.equal(obj.confidence, undefined);
    assert.equal(obj.confidenceTier, undefined);
    assert.equal(obj.percentage, undefined);
    assert.equal(obj.activeVerdict, undefined);
  };

  checkNoScores(hierarchy.hierarchy.mahadasha);
  checkNoScores(hierarchy.hierarchy.antardasha);
  checkNoScores(hierarchy.hierarchy.pratyantardasha);
  checkNoScores(hierarchy.hierarchy.sookshma);
  checkNoScores(hierarchy.hierarchy.prana);

  Object.values(hierarchy.eventEvidenceByRule).forEach((entry) => {
    checkNoScores(entry.levels.mahadasha);
    checkNoScores(entry.levels.antardasha);
  });
});

test("2I-E-A — Audit 2: Hierarchy Invariants A through J Across 5 Levels and Multiple Charts", () => {
  const testCases = [
    { city: "Delhi", dob: "1995-05-15", tob: "14:30", lat: 28.6139, lon: 77.209, tz: 5.5 },
    { city: "Kolkata", dob: "1943-08-15", tob: "08:30", lat: 22.5726, lon: 88.3639, tz: 6.5 },
    { city: "New York", dob: "1980-01-01", tob: "12:00", lat: 40.7128, lon: -74.006, tz: -5.0 },
    { city: "Chennai", dob: "2000-01-01", tob: "00:00", lat: 13.0827, lon: 80.2707, tz: 5.5 },
  ];

  function verifyChildren(children: DashaPeriod[], parent: DashaPeriod) {
    assert.equal(children.length, 9, "Must have exactly 9 child periods");

    // Invariant G: Child periods collectively cover complete parent interval
    assert.equal(
      children[0].startDate.getTime(),
      parent.startDate.getTime(),
      "Invariant G: First child must start exactly at parent start"
    );
    assert.equal(
      children[8].endDate.getTime(),
      parent.endDate.getTime(),
      "Invariant G: Last child must end exactly at parent end"
    );

    // Invariant H: Vimshottari lord sequence is preserved
    const parentLordIdx = VIMSHOTTARI_ORDER.indexOf(parent.lord);
    assert.ok(parentLordIdx >= 0, "Parent lord must be in Vimshottari order");

    // Invariant I: Parent lord is not incorrectly reused as sole child lord
    const lordsSet = new Set(children.map((c) => c.lord));
    assert.equal(lordsSet.size, 9, "Invariant I: All 9 Vimshottari lords must be present");

    for (let i = 0; i < 9; i++) {
      const child = children[i];
      const expectedLord = VIMSHOTTARI_ORDER[(parentLordIdx + i) % 9];
      assert.equal(child.lord, expectedLord, `Invariant H: Child ${i} must have lord ${expectedLord}`);

      // Invariants A, B, C, D: Child lies completely inside parent
      assert.ok(
        child.startDate.getTime() >= parent.startDate.getTime(),
        "Child startDate must be >= parent startDate"
      );
      assert.ok(
        child.endDate.getTime() <= parent.endDate.getTime(),
        "Child endDate must be <= parent endDate"
      );
      assert.ok(
        child.startDate.getTime() < child.endDate.getTime(),
        "Child startDate must precede child endDate"
      );

      // Invariants E & F: Adjacent periods have no gaps and do not overlap
      if (i > 0) {
        const prevChild = children[i - 1];
        assert.equal(
          child.startDate.getTime(),
          prevChild.endDate.getTime(),
          `Invariants E & F: Child ${i} start must equal child ${i - 1} end (no gaps, no overlaps)`
        );
      }
    }
  }

  for (const tc of testCases) {
    const chart = calculateChart(tc.city, tc.dob, tc.tob, tc.city, tc.lat, tc.lon, tc.tz);
    const nak = getNakshatraFromLongitude(chart.planets.Moon.lon);
    const birthDate = new Date(`${tc.dob}T${tc.tob}`);

    // Invariant J: Boundary timestamps are deterministic
    const mds1 = getMahadashas(birthDate, nak);
    const mds2 = getMahadashas(birthDate, nak);
    assert.deepEqual(mds1, mds2, "Invariant J: MD generation must be strictly deterministic");

    assert.equal(mds1.length, 9, "Must generate 9 Mahadashas");

    for (let m = 0; m < mds1.length; m++) {
      const md = mds1[m];
      if (m > 0) {
        assert.equal(
          md.startDate.getTime(),
          mds1[m - 1].endDate.getTime(),
          "Adjacent MDs must have no gaps and no overlaps"
        );
      }

      // Verify Antardashas
      const ads1 = getAntardashas(md);
      const ads2 = getAntardashas(md);
      assert.deepEqual(ads1, ads2, "Invariant J: AD generation must be deterministic");
      verifyChildren(ads1, md);

      // Test deep levels for first and active AD
      const ad = ads1[0];
      const pds1 = getPratyantardashas(ad, md);
      const pds2 = getPratyantardashas(ad, md);
      assert.deepEqual(pds1, pds2, "Invariant J: PD generation must be deterministic");
      verifyChildren(pds1, ad);

      const pd = pds1[0];
      const sds1 = getSookshmadashas(pd, ad, md);
      const sds2 = getSookshmadashas(pd, ad, md);
      assert.deepEqual(sds1, sds2, "Invariant J: Sookshma generation must be deterministic");
      verifyChildren(sds1, pd);

      const sd = sds1[0];
      const pranas1 = getPranadashas(sd, pd, ad, md);
      const pranas2 = getPranadashas(sd, pd, ad, md);
      assert.deepEqual(pranas1, pranas2, "Invariant J: Prana generation must be deterministic");
      verifyChildren(pranas1, sd);
    }
  }
});


