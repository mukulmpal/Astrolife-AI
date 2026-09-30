// src/lib/astro-engine/__tests__/navtara.test.ts
// Comprehensive Test Suite for AstroLife Navtara Intelligence System
// Verifies 5 Known Classical Cases, Boundary Proximity, 3-Layer Dasha Audit, and Rule Traces.

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  calculateTaraNumber,
  calculateCountedPosition,
  getParyayaByPosition,
  get27thSupportStar,
  getBirthStarQualityProfile,
  build27NavtaraChakra,
  auditDashaNavtara,
  runNavtaraIntelligence,
} from "../navtara-engine";
import {
  evaluateBoundaryProximity,
  resolveNakshatraCoordinate,
} from "../ayanamsa-config";
import {
  resolvePlanetTattvaRemedy,
} from "../navtara-remedies";
import {
  evaluateDashaActivationWindows,
  evaluateTransitGrahaTaraBala,
} from "../transit-trigger";
import { getNakshatraById, getNakshatraByName } from "../nakshatra-data";
import type { ChartData } from "../calculations";

describe("Navtara Master Engine — 5 Known Cases & Core Precision", () => {
  // ── Case 1: Lord Krishna (Rohini Janma Nakshatra) ──────────────────────────
  it("Case 1 — Lord Krishna: Rohini Janma Star -> 27th Star Krittika (Mor-Pankh)", () => {
    const rohini = getNakshatraByName("Rohini");
    assert.ok(rohini, "Rohini nakshatra must exist");
    assert.equal(rohini.id, 4);

    const supportStar = get27thSupportStar(rohini.id);
    assert.equal(supportStar.countedPosition, 27);
    assert.equal(supportStar.nakshatra.name, "Krittika");
    assert.equal(supportStar.nakshatra.id, 3);
    assert.equal(supportStar.nakshatra.bird, "Peacock (Mayura)");
    assert.equal(supportStar.tara.name, "Parama Mitra");

    // Quality Profile: Rohini native reflects Krittika (Sun) lord
    const quality = getBirthStarQualityProfile(rohini.id);
    assert.equal(quality.channellingLord, "Sun");
    assert.ok(quality.temperamentTitle.includes("Sovereign"));
  });

  // ── Case 2: Yogesh Ji (Ashlesha Janma -> Rahu MD & Rahu NL -> Double Concern)
  it("Case 2 — Yogesh Ji: Ashlesha Janma Star with Rahu MD & Rahu Star Lord yields DOUBLE_CONCERN", () => {
    const ashlesha = getNakshatraByName("Ashlesha");
    assert.ok(ashlesha, "Ashlesha must exist");
    assert.equal(ashlesha.id, 9); // Mercury ruled

    // Ashlesha is #9. Rahu sits in Swati (#15, Rahu ruled)
    // Counting from Ashlesha (9) to Swati (15): (15 - 9) = 6 -> Tara #7 (Vadha)!
    const taraNum = calculateTaraNumber(ashlesha.id, 15);
    assert.equal(taraNum, 7, "Swati from Ashlesha must be Tara #7 (Vadha)");

    // Mock Chart with Ashlesha Moon and Swati Rahu
    const mockChart: ChartData = {
      name: "Yogesh Ji Mock",
      dob: "1975-08-10",
      tob: "14:00",
      city: "Delhi",
      lat: 28.6139,
      lon: 77.209,
      tz: 5.5,
      jd: 2442635.0,
      lagnaLon: 210.0,
      lagnaRashi: "Scorpio",
      lagnaNum: 7,
      planets: {
        Moon: { longitude: 115.0, rashi: "Cancer", house: 9, isRetrograde: false }, // Ashlesha
        Rahu: { longitude: 195.0, rashi: "Libra", house: 12, isRetrograde: false }, // Swati (Rahu NL)
      },
      houseCusps: [],
      houseSystem: "degree-equal-bhava",
      dashas: [{ planet: "Rahu", start: new Date("2016-01-01"), end: new Date("2034-01-01"), yrs: 18, active: true }],
      antardasha: [],
    };

    const audit = auditDashaNavtara(ashlesha.id, mockChart, "Lahiri_Chitrapaksha", "Rahu");
    assert.equal(audit.pattern, "DOUBLE_CONCERN", "Pattern must be DOUBLE_CONCERN when both are Vadha");
    assert.equal(audit.patternSeverity, "Concern");
    assert.equal(audit.layers[0].tara.name, "Vadha");
    assert.equal(audit.layers[1].tara.name, "Vadha");
    // Layer 3 should be skipped since Rahu's NL is Rahu (no redundant 3rd layer)
    assert.equal(audit.layers.length, 2, "3rd layer must be omitted when NL === NL's Lord");
  });

  // ── Case 3: Mukul (Uttara Phalguni Janma Nakshatra) ────────────────────────
  it("Case 3 — Mukul: Uttara Phalguni (#12) -> 27th Star Purva Phalguni (#11)", () => {
    const up = getNakshatraByName("Uttara Phalguni");
    assert.ok(up, "Uttara Phalguni must exist");
    assert.equal(up.id, 12);

    const supportStar = get27thSupportStar(up.id);
    assert.equal(supportStar.nakshatra.name, "Purva Phalguni");
    assert.equal(supportStar.nakshatra.id, 11);
    assert.equal(supportStar.nakshatra.lord, "Venus");
    assert.equal(supportStar.anchors.tree, "Palash / Flame of the Forest (Butea monosperma)");
    assert.equal(supportStar.anchors.bird, "Chakor / Francolin Partridge");

    const quality = getBirthStarQualityProfile(up.id);
    assert.equal(quality.channellingLord, "Venus");
    assert.ok(quality.temperamentTitle.includes("Harmonizer"));
  });

  // ── Case 4: Manisha Chart (Purva Phalguni Moon, Sun in Jyeshtha) ───────────
  it("Case 4 — Manisha Chart: Purva Phalguni Moon with Sun in Jyeshtha", () => {
    // Manisha: DOB 6 Dec 1993, 12:45 PM. Moon at Leo ~15.63° (Purva Phalguni), Sun at Scorpio 20.40° (Jyeshtha)
    const mockManishaChart: ChartData = {
      name: "Manisha",
      dob: "1993-12-06",
      tob: "12:45",
      city: "Jaipur",
      lat: 26.9124,
      lon: 75.7873,
      tz: 5.5,
      jd: 2449328.802083,
      lagnaLon: 318.35,
      lagnaRashi: "Aquarius",
      lagnaNum: 10,
      planets: {
        Moon: { longitude: 135.73, rashi: "Leo", house: 7, isRetrograde: false }, // Purva Phalguni #11
        Sun: { longitude: 230.51, rashi: "Scorpio", house: 10, isRetrograde: false }, // Jyeshtha #18
        Mars: { longitude: 236.07, rashi: "Scorpio", house: 10, isRetrograde: false }, // Jyeshtha #18
        Mercury: { longitude: 215.21, rashi: "Scorpio", house: 10, isRetrograde: false }, // Anuradha #17
      },
      houseCusps: [],
      houseSystem: "degree-equal-bhava",
      dashas: [{ planet: "Mars", start: new Date("2020-01-01"), end: new Date("2027-01-01"), yrs: 7, active: true }],
      antardasha: [],
    };

    const intel = runNavtaraIntelligence(mockManishaChart, "Lahiri_Chitrapaksha");
    assert.equal(intel.birthNakshatra.name, "Purva Phalguni");
    assert.equal(intel.birthNakshatra.id, 11);
    assert.equal(intel.supportStarShield.nakshatra.name, "Magha"); // #10
    assert.equal(intel.supportStarShield.nakshatra.lord, "Ketu");

    // Sun at 230.51° (Scorpio 20°30') is well inside Jyeshtha (16°40' - 30°00')
    const sunCoord = resolveNakshatraCoordinate(230.51, mockManishaChart.jd, "Lahiri_Chitrapaksha");
    assert.equal(sunCoord.nakshatra.name, "Jyeshtha");
    assert.equal(sunCoord.boundary.isNearBoundary, false, "Sun is ~3.8° from border, not near boundary");
  });

  // ── Case 5: Boundary Sensitivity & Proximity Detection ────────────────────
  it("Case 5 — Boundary Proximity: Detects planets within 15' threshold", () => {
    // 13.333333° is the exact boundary between Ashwini and Bharani
    // Place a planet 5 arcminutes before the border: 13.333333° - (5/60)° = 13.25°
    const nearBoundaryLon = 13.333333 - 5 / 60;
    const jd = 2451545.0; // J2000.0

    const boundary = evaluateBoundaryProximity(nearBoundaryLon, jd, 15);
    assert.equal(boundary.isNearBoundary, true, "Must flag near-boundary for 5' distance");
    assert.ok(boundary.distanceArcMin <= 5.1 && boundary.distanceArcMin >= 4.9);
    assert.ok(boundary.alertText?.includes("Boundary Sensitivity"));
  });

  // ── Mathematical Integrity & Absence of Arbitrary Multipliers ─────────────
  it("Mathematical Integrity: Paryayas use qualitative intensity tiers (Base, Moderate, Peak), not fake multipliers", () => {
    const chakra = build27NavtaraChakra(1); // Ashwini birth
    assert.equal(chakra.length, 27);

    // Positions 1-9: Prathama -> Base
    for (let i = 0; i < 9; i++) {
      assert.equal(chakra[i].paryaya, "Prathama");
      assert.equal(chakra[i].paryayaIntensity, "Base");
    }

    // Positions 10-18: Dvitiya -> Moderate
    for (let i = 9; i < 18; i++) {
      assert.equal(chakra[i].paryaya, "Dvitiya");
      assert.equal(chakra[i].paryayaIntensity, "Moderate");
    }

    // Positions 19-27: Tritiya -> Peak
    for (let i = 18; i < 27; i++) {
      assert.equal(chakra[i].paryaya, "Tritiya");
      assert.equal(chakra[i].paryayaIntensity, "Peak");
    }
  });

  // ── Rashi-Tattva Remedies Integrity ───────────────────────────────────────
  it("Remedies Engine: Rashi dictates elemental vector (Agni/Prithvi/Vayu/Jala), not house", () => {
    // Saturn in Aries (Sign 0, Fire) in House 10
    const fireRemedy = resolvePlanetTattvaRemedy("Saturn", "Aries", 0, 10);
    assert.equal(fireRemedy.tattva, "Agni");
    assert.ok(fireRemedy.tattvaVector.elementalAction.includes("Havan"));

    // Saturn in Scorpio (Sign 7, Water) in House 10
    const waterRemedy = resolvePlanetTattvaRemedy("Saturn", "Scorpio", 7, 10, 9);
    assert.equal(waterRemedy.tattva, "Jala");
    assert.ok(waterRemedy.tattvaVector.elementalAction.includes("Jal Pravah"));
    assert.ok(waterRemedy.domainSignificance.includes("H10"));
    assert.ok(waterRemedy.domainSignificance.includes("H9"));
  });

  // ── Transit Activation Windows ────────────────────────────────────────────
  it("Transit Triggers: Evaluates Sun and Jupiter activation windows for Dasha Lord", () => {
    const windows = evaluateDashaActivationWindows("Saturn", false);
    assert.equal(windows.length, 4);

    const sunActivation = windows.find((w) => w.triggerPlanet === "Sun" && w.windowType === "ACTIVATION_WINDOW");
    assert.ok(sunActivation);
    assert.ok(sunActivation.targetSign.includes("Libra")); // Saturn exalted in Libra

    const jupCaution = windows.find((w) => w.triggerPlanet === "Jupiter" && w.windowType === "CAUTION_WINDOW");
    assert.ok(jupCaution);
    assert.ok(jupCaution.targetSign.includes("Aries")); // Saturn debilitated in Aries
  });
});
