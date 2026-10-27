// src/lib/astro-engine/__tests__/goal-house-activation.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateGoalHouseActivation,
  evaluateAllGoalActivations,
  evaluateLagnaMandatoryShield,
  evaluatePartnershipRiskAudit,
  evaluatePlanetToHouseHits,
  evaluateTransitDashaConcurrency,
  getDevataFloorHardwareProtocols,
  getVirtualDoorProtocol,
  MASTER_LECTURE_CASE_STUDIES,
} from "../goal-house-activation-engine";
import type { ChartData } from "../calculations";

// Mock Gemini Lagna Chart (Lagna = 18° Gemini = Sign 3)
const mockGeminiChart: ChartData = {
  name: "Test Gemini Native",
  dob: "1990-05-15",
  tob: "08:30",
  city: "Delhi",
  lat: 28.6139,
  lon: 77.209,
  tz: 5.5,
  jd: 2448026.5,
  lagnaLon: 78.0, // 18° Gemini
  lagnaRashi: "Gemini",
  lagnaNum: 3,
  houseSystem: "degree-equal-bhava",
  planets: {
    Sun: { name: "Sun", lon: 30.5, sign: "Taurus", signNum: 2, degree: 0.5, minutes: 30, house: 12 } as any,
    Moon: { name: "Moon", lon: 275.0, sign: "Capricorn", signNum: 10, degree: 5.0, minutes: 0, house: 8 } as any,
    Mars: { name: "Mars", lon: 258.0, sign: "Sagittarius", signNum: 9, degree: 18.0, minutes: 0, house: 7 } as any, // Exactly 180° from Lagna 78°!
    Mercury: { name: "Mercury", lon: 45.0, sign: "Taurus", signNum: 2, degree: 15.0, minutes: 0, house: 12 } as any,
    Jupiter: { name: "Jupiter", lon: 198.0, sign: "Libra", signNum: 7, degree: 18.0, minutes: 0, house: 5 } as any, // 7th lord (Jupiter for Gemini) in 5th house!
    Venus: { name: "Venus", lon: 350.0, sign: "Pisces", signNum: 12, degree: 20.0, minutes: 0, house: 10 } as any,
    Saturn: { name: "Saturn", lon: 290.0, sign: "Capricorn", signNum: 10, degree: 20.0, minutes: 0, house: 8 } as any,
    Rahu: { name: "Rahu", lon: 295.0, sign: "Capricorn", signNum: 10, degree: 25.0, minutes: 0, house: 8 } as any,
    Ketu: { name: "Ketu", lon: 115.0, sign: "Cancer", signNum: 4, degree: 25.0, minutes: 0, house: 2 } as any,
  },
  houseCusps: [
    { house: 1, lon: 78.0, sign: "Gemini", signNum: 3, degree: 18, minutes: 0, nakshatra: "Ardra", nakshatraLord: "Rahu", pada: 4, source: "degree-equal-bhava" },
    { house: 2, lon: 108.0, sign: "Cancer", signNum: 4, degree: 18, minutes: 0, nakshatra: "Ashlesha", nakshatraLord: "Mercury", pada: 1, source: "degree-equal-bhava" },
    { house: 3, lon: 138.0, sign: "Leo", signNum: 5, degree: 18, minutes: 0, nakshatra: "Purva Phalguni", nakshatraLord: "Venus", pada: 2, source: "degree-equal-bhava" },
    { house: 4, lon: 168.0, sign: "Virgo", signNum: 6, degree: 18, minutes: 0, nakshatra: "Hasta", nakshatraLord: "Moon", pada: 3, source: "degree-equal-bhava" },
    { house: 5, lon: 198.0, sign: "Libra", signNum: 7, degree: 18, minutes: 0, nakshatra: "Swati", nakshatraLord: "Rahu", pada: 4, source: "degree-equal-bhava" },
    { house: 6, lon: 228.0, sign: "Scorpio", signNum: 8, degree: 18, minutes: 0, nakshatra: "Jyeshtha", nakshatraLord: "Mercury", pada: 1, source: "degree-equal-bhava" },
    { house: 7, lon: 258.0, sign: "Sagittarius", signNum: 9, degree: 18, minutes: 0, nakshatra: "Purva Ashadha", nakshatraLord: "Venus", pada: 2, source: "degree-equal-bhava" },
    { house: 8, lon: 288.0, sign: "Capricorn", signNum: 10, degree: 18, minutes: 0, nakshatra: "Shravana", nakshatraLord: "Moon", pada: 3, source: "degree-equal-bhava" },
    { house: 9, lon: 318.0, sign: "Aquarius", signNum: 11, degree: 18, minutes: 0, nakshatra: "Shatabhisha", nakshatraLord: "Rahu", pada: 4, source: "degree-equal-bhava" },
    { house: 10, lon: 348.0, sign: "Pisces", signNum: 12, degree: 18, minutes: 0, nakshatra: "Uttara Bhadrapada", nakshatraLord: "Saturn", pada: 1, source: "degree-equal-bhava" },
    { house: 11, lon: 18.0, sign: "Aries", signNum: 1, degree: 18, minutes: 0, nakshatra: "Bharani", nakshatraLord: "Venus", pada: 2, source: "degree-equal-bhava" },
    { house: 12, lon: 48.0, sign: "Taurus", signNum: 2, degree: 18, minutes: 0, nakshatra: "Rohini", nakshatraLord: "Moon", pada: 3, source: "degree-equal-bhava" },
  ],
  dashas: [],
  antardasha: [],
};

// Manjula Chart Mock (Sagittarius Lagna 23° = 263°, 6th Cusp = Taurus 29° = 59°, Rahu = Scorpio 25° = 235°)
const mockManjulaChart: ChartData = {
  name: "Manjula Property Case",
  dob: "1975-11-20",
  tob: "09:00",
  city: "Jaipur",
  lat: 26.9124,
  lon: 75.7873,
  tz: 5.5,
  jd: 2442736.5,
  lagnaLon: 263.0, // 23° Sagittarius
  lagnaRashi: "Sagittarius",
  lagnaNum: 9,
  houseSystem: "degree-equal-bhava",
  planets: {
    Rahu: { name: "Rahu", lon: 235.0, sign: "Scorpio", signNum: 8, degree: 25.0, minutes: 0, house: 12 } as any, // 235°
  },
  houseCusps: [
    { house: 1, lon: 263.0, sign: "Sagittarius", signNum: 9, degree: 23, minutes: 0, nakshatra: "Purva Ashadha", nakshatraLord: "Venus", pada: 3, source: "degree-equal-bhava" },
    { house: 6, lon: 59.0, sign: "Taurus", signNum: 2, degree: 29, minutes: 0, nakshatra: "Mrigashira", nakshatraLord: "Mars", pada: 2, source: "degree-equal-bhava" },
  ],
  dashas: [],
  antardasha: [],
};

test("Goal House Activation Engine — Foreign Travel, Property, and Health", async (t) => {
  await t.test("1. Foreign Travel: auto-calculates 3, 9, 12 and strictly warns against 11", () => {
    const res = evaluateGoalHouseActivation(mockGeminiChart, "foreign_travel");
    assert.equal(res.goalId, "foreign_travel");
    assert.deepEqual(res.primaryHouses, [3, 9, 12]);
    assert.equal(res.houseDetails.length, 3);

    // Verify 3rd house is Leo (Sign 5), ENE direction
    const h3 = res.houseDetails.find((h) => h.house === 3);
    assert.ok(h3);
    assert.equal(h3.houseSign, "Leo");
    assert.equal(h3.directionCode, "ENE");
    assert.match(h3.activationObjectiveHi, /वीज़ा दस्तावेज़/);

    // Verify 9th house is Aquarius (Sign 11), West direction
    const h9 = res.houseDetails.find((h) => h.house === 9);
    assert.ok(h9);
    assert.equal(h9.houseSign, "Aquarius");
    assert.equal(h9.directionCode, "W");

    // Verify 12th house is Taurus (Sign 2), NW direction
    const h12 = res.houseDetails.find((h) => h.house === 12);
    assert.ok(h12);
    assert.equal(h12.houseSign, "Taurus");
    assert.equal(h12.directionCode, "NW");

    // Verify STRICT 11th House Negation Warning
    assert.ok(res.negationHouseWarning);
    assert.equal(res.negationHouseWarning.house, 11);
    assert.match(res.negationHouseWarning.warningHi, /11वें भाव को भूलकर भी सक्रिय न करें/);
    assert.match(res.negationHouseWarning.reasonHi, /द्वादश भाव \(विदेश निवास\) का 12वां/);
  });

  await t.test("2. Property Purchase (Buy 4 & 11) vs Property Sale (Sell 3, 10, 7)", () => {
    const buyRes = evaluateGoalHouseActivation(mockGeminiChart, "property_purchase");
    assert.deepEqual(buyRes.primaryHouses, [4, 11]);
    const h4 = buyRes.houseDetails.find((h) => h.house === 4);
    assert.equal(h4?.houseSign, "Virgo");
    assert.equal(h4?.directionCode, "N");

    const sellRes = evaluateGoalHouseActivation(mockGeminiChart, "property_sale");
    assert.deepEqual(sellRes.primaryHouses, [3, 10, 7]);
    assert.match(sellRes.shastricVerdictHi, /मात्र 3 और 10 के ज़ोन सक्रिय करने से/);
  });

  await t.test("3. De-Addiction W8 Betel Nut & Savitra Impulse Control", () => {
    const addRes = evaluateGoalHouseActivation(mockGeminiChart, "addiction_relief");
    assert.deepEqual(addRes.primaryHouses, [2, 8]);
    assert.ok(addRes.specificHardwareRemedy);
    assert.match(addRes.specificHardwareRemedy.titleHi, /W8 पद सुपारी निष्कासन एवं सावित्रा सक्रियण/);
    assert.match(addRes.specificHardwareRemedy.materialsHi.join(" "), /साबुत गोल सुपारी/);
  });

  await t.test("4. High BP & Anger Grounding (25g Silver Kada + Kitchen Floor)", () => {
    const bpRes = evaluateGoalHouseActivation(mockGeminiChart, "high_bp_anger_calm");
    assert.ok(bpRes.specificHardwareRemedy);
    assert.match(bpRes.specificHardwareRemedy.materialsHi.join(" "), /25 ग्राम मशीन-निर्मित चांदी का कड़ा/);
    assert.match(bpRes.specificHardwareRemedy.materialsHi.join(" "), /तांबे \(कॉपर\) की पतली तार/);
    assert.match(bpRes.specificHardwareRemedy.procedureStepsHi.join(" "), /रसोईघर \(Kitchen\) की नंगी फर्श पर बैठकर भोजन करें/);
    assert.match(bpRes.specificHardwareRemedy.procedureStepsHi.join(" "), /बाएं हाथ \(Left Hand\)/);
  });

  await t.test("5. Partnership Risk Audit (Jachika Rule: 7th Lord in 5th House)", () => {
    // In mockGeminiChart, 7th lord is Jupiter, placed in 5th house Libra!
    const risk = evaluatePartnershipRiskAudit(mockGeminiChart);
    assert.equal(risk.seventhHouseLord, "Jupiter");
    assert.equal(risk.seventhLordPlacementHouse, 5);
    assert.equal(risk.isSeventhLordInFifth, true);
    assert.equal(risk.riskSeverity, "HIGH_CRITICAL_RISK");
    assert.equal(risk.partnerProfitAdvantage, true);
    assert.equal(risk.nativeRecoveryNegated, true);
    assert.equal(risk.spouseNameBusinessSafe, false);
    assert.match(risk.verdictHi, /सप्तमेश पंचम में बैठकर पार्टनर को 11वें का पूर्ण लाभ दे रहा है/);
  });

  await t.test("6. Lagna Mandatory Shield: Mars 180° Killer Hit & Venus 90° Hit on Gemini Lagna", () => {
    // In mockGeminiChart: Lagna = 18° Gemini (78°), Mars = 18° Sagittarius (258°) -> 180°!
    // Venus = 20° Pisces (350°) -> 88° (90° hit within ±5°)!
    const shield = evaluateLagnaMandatoryShield(mockGeminiChart);
    assert.equal(shield.isLagnaUnderHit, true);
    assert.equal(shield.urgentActionRequired, true);
    assert.equal(shield.criticalHits.length, 2);
    assert.ok(shield.criticalHits.some((h) => h.planetName === "Mars" && h.angleType === 180));
    assert.ok(shield.criticalHits.some((h) => h.planetName === "Venus" && h.angleType === 90));
    assert.match(shield.shieldBannerHi, /उच्च-प्राथमिकता लग्न सुरक्षा शील्ड/);
  });

  await t.test("7. Planet-to-House Hit Calculation: Manjula Case (Rahu 176° hit on 6th cusp)", () => {
    // Rahu at 235° Scorpio, 6th cusp at 59° Taurus -> diff = 176° (falls in [172°-188°] 180° Killer Hit)
    const cuspHits = evaluatePlanetToHouseHits(mockManjulaChart);
    const rahuHit = cuspHits.find((h) => h.planetName === "Rahu" && h.house === 6);
    assert.ok(rahuHit, "Rahu 180° hit on 6th house cusp must be detected");
    assert.equal(rahuHit.angleType, 180);
    assert.equal(rahuHit.exactDiff, 176);
    assert.equal(rahuHit.severity, "CRITICAL_KILLER");
    assert.match(rahuHit.impactCategoryHi, /कोर्ट-कचहरी, ज़मीन विवाद या असाध्य रोग/);
  });

  await t.test("8. 45 Devtas Floor Hardware Protocols & Virtual Door", () => {
    const protocols = getDevataFloorHardwareProtocols();
    assert.equal(protocols.excavationStandard.dimensions, "4 इंच × 4 इंच (4'' × 4'')");
    assert.match(protocols.noDrillingAlternative.methodName, /डबल-साइडेड हेवी टेप/);
    assert.match(protocols.springMechanics.boostEnergy, /एंटी-क्लॉकवाइज स्प्रिंग/);

    const naga = protocols.sacredDevataOfferings.find((d) => d.devata.includes("नागा"));
    assert.ok(naga);
    assert.match(naga.foodOrMaterialHi, /दालचीनी/);

    const door = getVirtualDoorProtocol();
    assert.match(door.installationHeight, /6 फीट/);
  });

  await t.test("9. Master evaluateAllGoalActivations executes all 10 goals deterministically", () => {
    const all = evaluateAllGoalActivations(mockGeminiChart);
    assert.equal(Object.keys(all).length, 10);
    assert.ok(all.foreign_travel);
    assert.ok(all.property_purchase);
    assert.ok(all.property_sale);
    assert.ok(all.partnership_risk_audit);
    assert.ok(all.lagna_mandatory_shield);
  });

  await t.test("10. Transit + Dasha Concurrency Filter: Highlights active MD/AD planets", () => {
    // When Rahu MD and Jupiter AD are active, transiting Rahu (Aquarius) and Jupiter (Gemini) are HIGH_PHYSICAL_TRIGGER
    const audit = evaluateTransitDashaConcurrency(mockGeminiChart);
    assert.ok(audit.items.length >= 7);
    const activeItems = audit.items.filter((i) => i.isActiveInDasha);
    assert.ok(activeItems.length > 0, "Active dasha planets must have triggers");
    for (const item of activeItems) {
      assert.equal(item.triggerSeverity, "HIGH_PHYSICAL_TRIGGER");
      assert.ok(item.physicalObjectPullHi.length > 0);
      assert.match(item.directionalGuidanceHi, /गोचर-दशा सक्रिय ट्रिगर/);
    }
  });

  await t.test("11. Master Lecture Case Studies Bank: Integrity of all 8 cases", () => {
    assert.equal(MASTER_LECTURE_CASE_STUDIES.length, 8);
    const expectedIds = [
      "case_chirag",
      "case_manjula",
      "case_shashi",
      "case_atul_wife",
      "case_parul",
      "case_deepak",
      "case_aarti",
      "case_jachika",
    ];
    for (const id of expectedIds) {
      const found = MASTER_LECTURE_CASE_STUDIES.find((c) => c.id === id);
      assert.ok(found, `Case study ${id} must exist in bank`);
      assert.ok(found.problemStatementHi.length > 10);
      assert.ok(found.physicalVastuFaultHi.length > 10);
      assert.ok(found.shastricRemedyHi.length > 10);
      assert.ok(found.resultOutcomeHi.length > 5);
    }
  });
});
