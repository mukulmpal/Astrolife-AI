// src/lib/astro-engine/__tests__/gps-astro-vastu-engine.test.ts
// ============================================================================
// GPS ASTRO-VASTU ENGINE & WEARABLE CONFLICT AUDIT TEST SUITE
// ============================================================================

import { describe, it } from "node:test";
import assert from "node:assert";
import {
  runGPSAstroVastuEngine,
  calculateGPSTargetHouse,
  MASTER_GPS_CODES,
} from "../gps-astro-vastu-engine";
import { auditUserWearables } from "../bio-wearable-audit-engine";
import {
  MASTER_45_DEVATAS,
  getDevatasByPlanet,
  MASTER_CLINICAL_PROBLEM_DIAGNOSTICS,
  resolveDominantZoneMetal,
  checkKPScriptEligibility,
  runAstroVastuHitEngine,
} from "../astro-vastu-hit-engine";
import type { ChartData } from "../calculations";

describe("Astro-Vastu GPS Astrology Computational Engine", () => {
  it("should verify authentic GPS codes for all 9 planets", () => {
    assert.strictEqual(MASTER_GPS_CODES.Sun.code, 10);
    assert.strictEqual(MASTER_GPS_CODES.Moon.code, 4);
    assert.strictEqual(MASTER_GPS_CODES.Mars.code, 10);
    assert.strictEqual(MASTER_GPS_CODES.Mercury.code, 1);
    assert.strictEqual(MASTER_GPS_CODES.Jupiter.code, 1);
    assert.strictEqual(MASTER_GPS_CODES.Venus.code, 4);
    assert.strictEqual(MASTER_GPS_CODES.Saturn.code, 7);
    assert.strictEqual(MASTER_GPS_CODES.Rahu.code, 7); // Shanivat Rahu
    assert.strictEqual(MASTER_GPS_CODES.Ketu.code, 10); // Kujavat Ketu
  });

  it("should compute exact reverse-counting target houses across all test combinations", () => {
    // Saturn in House 4 with Code 7 -> House 10
    assert.strictEqual(calculateGPSTargetHouse(4, 7), 10);
    // Venus in House 2 with Code 4 -> House 11
    assert.strictEqual(calculateGPSTargetHouse(2, 4), 11);
    // Sun in House 3 with Code 10 -> House 6
    assert.strictEqual(calculateGPSTargetHouse(3, 10), 6);
    // Mercury in House 1 with Code 1 -> House 1
    assert.strictEqual(calculateGPSTargetHouse(1, 1), 1);
    // Jupiter in House 2 with Code 1 -> House 2
    assert.strictEqual(calculateGPSTargetHouse(2, 1), 2);
  });

  it("Case Study 1 (Virgo Lagna): Profession & 10th House lord GPS Navigation", () => {
    const chart: ChartData = {
      name: "Case 1 - Virgo Lagna",
      lagnaNum: 5, // 0-indexed Virgo (5) = 6th sign
      lagnaRashi: "Virgo",
      planets: {
        Sun: { name: "Sun", house: 1, sign: "Virgo", degree: 10 },
        Moon: { name: "Moon", house: 9, sign: "Taurus", degree: 15 },
        Mars: { name: "Mars", house: 12, sign: "Leo", degree: 14 },
        Mercury: { name: "Mercury", house: 12, sign: "Leo", degree: 20 },
        Jupiter: { name: "Jupiter", house: 2, sign: "Libra", degree: 18 },
        Venus: { name: "Venus", house: 2, sign: "Libra", degree: 5 },
        Saturn: { name: "Saturn", house: 8, sign: "Aries", degree: 12 },
        Rahu: { name: "Rahu", house: 6, sign: "Aquarius", degree: 22 },
        Ketu: { name: "Ketu", house: 12, sign: "Leo", degree: 22 },
      }
    };

    const dossier = runGPSAstroVastuEngine(chart);
    assert.ok(dossier, "Dossier should generate cleanly");
    assert.strictEqual(dossier.lagnaSign, "Virgo");

    // 7th house has Pisces (Lord Jupiter, in 2nd house Libra)
    const q7 = dossier.queryAnalyses[7];
    assert.strictEqual(q7.houseLord, "Jupiter");
    assert.strictEqual(q7.placedHouse, 2);
    assert.strictEqual(q7.gpsCode, 1);
    assert.strictEqual(q7.targetHouse, 2); // stays in 2nd house
    assert.strictEqual(q7.targetDirectionCode, "WSW"); // Libra = WSW
    assert.ok(q7.clutterToInspect.some(c => c.includes("लोहा") || c.includes("औजार")));

    // 10th house has Gemini (Lord Mercury, in 12th house Leo)
    const q10 = dossier.queryAnalyses[10];
    assert.strictEqual(q10.houseLord, "Mercury");
    assert.strictEqual(q10.placedHouse, 12);
    assert.strictEqual(q10.gpsCode, 1);
    assert.strictEqual(q10.targetHouse, 12);
    assert.strictEqual(q10.targetDirectionCode, "ENE"); // Leo = ENE
  });

  it("Case Study 2 (Sangeeta Chart): Peace of Mind, Profession, & Peeda GPS navigation", () => {
    // Lagna Scorpio (8th sign), 8th house Gemini (lord Mercury in 1st Scorpio)
    // 4th house Aquarius (lord Saturn in 4th Aquarius)
    // 7th house Taurus (lord Venus in 2nd Sagittarius)
    const chart: ChartData = {
      name: "Case 2 - Scorpio Lagna",
      lagnaNum: 7, // Scorpio (8th sign)
      lagnaRashi: "Scorpio",
      planets: {
        Sun: { name: "Sun", house: 1, sign: "Scorpio", degree: 5 },
        Moon: { name: "Moon", house: 9, sign: "Cancer", degree: 12 },
        Mars: { name: "Mars", house: 11, sign: "Virgo", degree: 14 },
        Mercury: { name: "Mercury", house: 1, sign: "Scorpio", degree: 18 },
        Jupiter: { name: "Jupiter", house: 9, sign: "Cancer", degree: 20 },
        Venus: { name: "Venus", house: 2, sign: "Sagittarius", degree: 16 },
        Saturn: { name: "Saturn", house: 4, sign: "Aquarius", degree: 11 },
        Rahu: { name: "Rahu", house: 5, sign: "Pisces", degree: 4 },
        Ketu: { name: "Ketu", house: 11, sign: "Virgo", degree: 4 },
      }
    };

    const dossier = runGPSAstroVastuEngine(chart);
    assert.ok(dossier);

    // Peeda (8th house) -> Lord Mercury in 1st house, Code 1 -> Target House 1
    const q8 = dossier.queryAnalyses[8];
    assert.strictEqual(q8.houseLord, "Mercury");
    assert.strictEqual(q8.gpsCode, 1);
    assert.strictEqual(q8.targetHouse, 1);

    // Peace of Mind (4th house) -> Lord Saturn in 4th house, Code 7 -> Target House 10!
    const q4 = dossier.queryAnalyses[4];
    assert.strictEqual(q4.houseLord, "Saturn");
    assert.strictEqual(q4.placedHouse, 4);
    assert.strictEqual(q4.gpsCode, 7);
    assert.strictEqual(q4.targetHouse, 10); // 10th house Profession brings mental peace!

    // Profession (7th house) -> Lord Venus in 2nd house, Code 4 -> Target House 11!
    const q7 = dossier.queryAnalyses[7];
    assert.strictEqual(q7.houseLord, "Venus");
    assert.strictEqual(q7.placedHouse, 2);
    assert.strictEqual(q7.gpsCode, 4);
    assert.strictEqual(q7.targetHouse, 11);
    assert.strictEqual(q7.targetSign, "Virgo");
    assert.strictEqual(q7.targetDirectionCode, "N"); // Virgo = North!
    assert.ok(q7.activatingRemedy.includes("परफ्यूम"));
  });

  it("Case Study 3 (Leo Lagna): Self & Confidence GPS navigation with Roaring Lion in South", () => {
    // Leo Lagna (5th sign). 1st house lord Sun in 3rd house (Libra).
    const chart: ChartData = {
      name: "Case 3 - Leo Lagna",
      lagnaNum: 4, // 0-indexed Leo (5th sign)
      lagnaRashi: "Leo",
      planets: {
        Sun: { name: "Sun", house: 3, sign: "Libra", degree: 10 },
        Moon: { name: "Moon", house: 1, sign: "Leo", degree: 14 },
        Mars: { name: "Mars", house: 10, sign: "Taurus", degree: 18 },
        Mercury: { name: "Mercury", house: 3, sign: "Libra", degree: 12 },
        Jupiter: { name: "Jupiter", house: 7, sign: "Aquarius", degree: 8 },
        Venus: { name: "Venus", house: 3, sign: "Libra", degree: 22 },
        Saturn: { name: "Saturn", house: 6, sign: "Capricorn", degree: 15 },
        Rahu: { name: "Rahu", house: 12, sign: "Cancer", degree: 25 },
        Ketu: { name: "Ketu", house: 6, sign: "Capricorn", degree: 25 },
      }
    };

    const dossier = runGPSAstroVastuEngine(chart);
    assert.ok(dossier);

    // 1st house (Self / Confidence) -> Lord Sun in 3rd house, Code 10 -> Target House 6!
    const q1 = dossier.queryAnalyses[1];
    assert.strictEqual(q1.houseLord, "Sun");
    assert.strictEqual(q1.placedHouse, 3);
    assert.strictEqual(q1.gpsCode, 10);
    assert.strictEqual(q1.targetHouse, 6);
    assert.strictEqual(q1.targetSign, "Capricorn");
    assert.strictEqual(q1.targetDirectionCode, "S"); // Capricorn = South!
    assert.ok(q1.activatingRemedy.includes("दहाड़ते हुए शेर") || q1.activatingRemedy.includes("शेर"));
  });

  it("should auto-detect Ketu Cut-Zone and prescribe 24-hr Yellow Bulb and Roof Flag", () => {
    const chart: ChartData = {
      name: "Ketu NW Cut Zone",
      lagnaNum: 0,
      lagnaRashi: "Aries",
      planets: {
        Ketu: { name: "Ketu", house: 2, sign: "Taurus", degree: 14 }, // Taurus = NW (2nd sign)
        Rahu: { name: "Rahu", house: 8, sign: "Scorpio", degree: 14 }, // Scorpio = SSW (8th sign)
      }
    };

    const dossier = runGPSAstroVastuEngine(chart);
    assert.ok(dossier);
    assert.strictEqual(dossier.ketuCutZone.cutDirectionCode, "NW");
    assert.ok(dossier.ketuCutZone.correctiveRemedies.yellowBulb24Hr.includes("पीला बल्ब"));
    assert.ok(dossier.ketuCutZone.correctiveRemedies.roofCornerFlag.includes("झंडा") || dossier.ketuCutZone.correctiveRemedies.roofCornerFlag.includes("ध्वज"));
    assert.strictEqual(dossier.rahuExtendedZone.extendedDirectionCode, "SSW");
  });

  it("should audit Cat's Eye gemstone conflicts and recommend yellow socks / yellow thread", () => {
    const afflictedChart: ChartData = {
      name: "Moon Afflicted Child",
      lagnaNum: 3, // Cancer Lagna
      lagnaRashi: "Cancer",
      planets: {
        Moon: { name: "Moon", house: 12, sign: "Gemini", degree: 14 },
        Mercury: { name: "Mercury", house: 1, sign: "Cancer", degree: 10 },
        Ketu: { name: "Ketu", house: 12, sign: "Gemini", degree: 15 },
      }
    };

    const audit = auditUserWearables(afflictedChart, [
      { id: "1", location: "wrist_left", item: "cats_eye" },
      { id: "2", location: "neck", item: "yellow_thread" },
      { id: "3", location: "feet_soles", item: "yellow_socks" },
    ]);

    const catsEyeAudit = audit.itemsAudited.find(i => i.item === "cats_eye");
    assert.strictEqual(catsEyeAudit?.severity, "CRITICAL_REMOVE");
    assert.ok(catsEyeAudit?.astrologicalMechanism.includes("अनिद्रा") || catsEyeAudit?.badgeText.includes("अनिद्रा"));

    const yellowThreadAudit = audit.itemsAudited.find(i => i.item === "yellow_thread");
    assert.strictEqual(yellowThreadAudit?.severity, "SAFE_BENEFICIAL");

    const yellowSocksAudit = audit.itemsAudited.find(i => i.item === "yellow_socks");
    assert.strictEqual(yellowSocksAudit?.severity, "SAFE_BENEFICIAL");
  });

  describe("Shastric 45 Devatas, Clinical Diagnostics, Dominant-Word & KP Invariants", () => {
    it("should verify 45 Devatas distributed accurately across 9 planets", () => {
      assert.strictEqual(MASTER_45_DEVATAS.length, 45);

      const ketuDevatas = getDevatasByPlanet("Ketu");
      const venusDevatas = getDevatasByPlanet("Venus");
      const sunDevatas = getDevatasByPlanet("Sun");
      const moonDevatas = getDevatasByPlanet("Moon");
      const marsDevatas = getDevatasByPlanet("Mars");
      const rahuDevatas = getDevatasByPlanet("Rahu");
      const jupiterDevatas = getDevatasByPlanet("Jupiter");
      const saturnDevatas = getDevatasByPlanet("Saturn");
      const mercuryDevatas = getDevatasByPlanet("Mercury");

      assert.strictEqual(ketuDevatas.length, 4, "Ketu must have exactly 4 Devatas");
      assert.strictEqual(venusDevatas.length, 5, "Venus must have exactly 5 Devatas");
      assert.strictEqual(sunDevatas.length, 6, "Sun must have exactly 6 Devatas");
      assert.strictEqual(moonDevatas.length, 5, "Moon must have exactly 5 Devatas");
      assert.strictEqual(marsDevatas.length, 4, "Mars must have exactly 4 Devatas");
      assert.strictEqual(rahuDevatas.length, 6, "Rahu must have exactly 6 Devatas");
      assert.strictEqual(jupiterDevatas.length, 2, "Jupiter must have exactly 2 Devatas (Brahma + Jayanta)");
      assert.strictEqual(saturnDevatas.length, 6, "Saturn must have exactly 6 Devatas");
      assert.strictEqual(mercuryDevatas.length, 7, "Mercury must have exactly 7 Devatas");

      const total = 4 + 5 + 6 + 5 + 4 + 6 + 2 + 6 + 7;
      assert.strictEqual(total, 45);
    });

    it("should resolve hybrid toilet zones using the Dominant Word Rule", () => {
      // ESE + SE -> 'East' word occurs twice -> Stainless Steel strip
      const hybridEast = resolveDominantZoneMetal(["ESE", "SE"]);
      assert.strictEqual(hybridEast.dominantQuadrant, "East");
      assert.ok(hybridEast.metalStrip.includes("स्टेनलेस स्टील"));

      // SSW + SW -> 'South' / 'West' dominant
      const hybridWest = resolveDominantZoneMetal(["WSW", "W"]);
      assert.strictEqual(hybridWest.dominantQuadrant, "West");
      assert.ok(hybridWest.metalStrip.includes("कच्चा लोहा"));
    });

    it("should map clinical life problems to exact devatas and remedies", () => {
      const addiction = MASTER_CLINICAL_PROBLEM_DIAGNOSTICS.find(p => p.id === "DRUG_ALCOHOL_SUBSTANCE_ADDICTION");
      assert.strictEqual(addiction?.targetDevataId, "W8");
      assert.strictEqual(addiction?.governingPlanet, "Rahu");
      assert.strictEqual(addiction?.actionProtocol, "BLOCK_DEACTIVATE");
      assert.strictEqual(addiction?.springDirective, "CLOCKWISE_BLOCK");

      const election = MASTER_CLINICAL_PROBLEM_DIAGNOSTICS.find(p => p.id === "ELECTION_PUBLIC_ISOLATION");
      assert.strictEqual(election?.targetDevataId, "ARYAMA");
      assert.strictEqual(election?.governingPlanet, "Mars");
      assert.ok(election?.physicalRemedyHi.includes("गुड़"));

      const apparel = MASTER_CLINICAL_PROBLEM_DIAGNOSTICS.find(p => p.id === "APPAREL_BRAND_SAMPLE_REJECTION");
      assert.strictEqual(apparel?.targetDevataId, "N2");
      assert.strictEqual(apparel?.governingPlanet, "Rahu");
      assert.ok(apparel?.physicalRemedyHi.includes("दालचीनी"));

      const stalled = MASTER_CLINICAL_PROBLEM_DIAGNOSTICS.find(p => p.id === "FACTORY_CONSTRUCTION_STALLED");
      assert.strictEqual(stalled?.targetDevataId, "BRAHMA");
      assert.strictEqual(stalled?.governingPlanet, "Jupiter");
    });

    it("should enforce KP Script Eligibility: Rashi, Nakshatra, Sub-Lord only; Sub-Sub Lord prohibited", () => {
      const mockChart: ChartData = {
        name: "KP Test Seeker",
        lagnaNum: 0, // Aries
        lagnaRashi: "Aries",
        planets: {},
        houseCusps: [
          {
            house: 5,
            sign: "Leo", // Rashi Lord: Sun
            signNum: 5,
            degree: 12,
            minutes: 30,
            lon: 132.5,
            nakshatra: "Magha",
            nakshatraLord: "Ketu", // Nakshatra Lord: Ketu
            subLord: "Mercury", // Sub-Lord: Mercury
            subSubLord: "Venus", // Sub-Sub Lord: Venus
            pada: 4,
            source: "degree-equal-bhava",
          }
        ]
      };

      // 1. Sun is Rashi Lord of Leo -> Eligible
      const sunCheck = checkKPScriptEligibility(mockChart, "Sun", 5);
      assert.strictEqual(sunCheck.isEligible, true);
      assert.strictEqual(sunCheck.matchedLevel, "RASHI_LORD");

      // 2. Ketu is Nakshatra Lord -> Eligible
      const ketuCheck = checkKPScriptEligibility(mockChart, "Ketu", 5);
      assert.strictEqual(ketuCheck.isEligible, true);
      assert.strictEqual(ketuCheck.matchedLevel, "NAKSHATRA_LORD");

      // 3. Mercury is Sub-Lord -> Eligible
      const mercuryCheck = checkKPScriptEligibility(mockChart, "Mercury", 5);
      assert.strictEqual(mercuryCheck.isEligible, true);
      assert.strictEqual(mercuryCheck.matchedLevel, "SUB_LORD");

      // 4. Venus is Sub-Sub Lord only -> PROHIBITED
      const venusCheck = checkKPScriptEligibility(mockChart, "Venus", 5);
      assert.strictEqual(venusCheck.isEligible, false);
      assert.strictEqual(venusCheck.subSubLordOnly, true);
      assert.ok(venusCheck.reasonHi.includes("सब-सब लॉर्ड"));

      // 5. Mars is not in script -> Ineligible
      const marsCheck = checkKPScriptEligibility(mockChart, "Mars", 5);
      assert.strictEqual(marsCheck.isEligible, false);
      assert.ok(marsCheck.reasonHi.includes("अपात्र भाव"));
    });
  });
});

