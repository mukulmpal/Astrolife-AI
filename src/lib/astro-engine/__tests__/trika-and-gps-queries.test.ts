// src/lib/astro-engine/__tests__/trika-and-gps-queries.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  calculatePlotDualGridDecomposition,
} from "../plot-geometry-dual-grid";
import {
  getTrikaBhavaRemedyAnalysis,
  MASTER_6TH_HOUSE_PLANTS,
  MASTER_8TH_HOUSE_FRUITS,
  MASTER_12TH_HOUSE_VOLUNTARY_TITHES,
} from "../trika-remedies-engine";
import {
  calculateQueryGPSAnalysis,
  MASTER_CORE_QUERIES,
} from "../gps-query-engine";
import {
  auditKitchenMicroGrid,
  auditEmergencyMedicalVastuAlerts,
  auditWallClockZone,
  evaluateNavtaraHitPrecedence,
} from "../micro-vastu-auditor";

describe("Plot Geometry & Dual-Grid Engine", () => {
  it("should handle regular rectangular plot with single center and no brass strip", () => {
    const result = calculatePlotDualGridDecomposition({
      lengthFeet: 50,
      widthFeet: 30,
    });
    assert.equal(result.isDualGridRequired, false);
    assert.equal(result.shapeCategory, "regular_rectangle");
    assert.equal(result.blocks.length, 1);
    assert.equal(result.demarcationStrip, null);
    assert.equal(result.totalAreaSqFt, 1500);
  });

  it("should handle mild cut plot with imaginary squaring and cut remedies", () => {
    const result = calculatePlotDualGridDecomposition({
      lengthFeet: 50,
      widthFeet: 40,
      cutLengthFeet: 10,
      cutWidthFeet: 10, // 100 sq ft out of 2000 = 5% cut (mild)
      cutLocation: "NE",
    });
    assert.equal(result.isDualGridRequired, false);
    assert.equal(result.shapeCategory, "mild_cut");
    assert.equal(result.remediesForCutExtendedZonesHi.length > 0, true);
    assert.match(result.remediesForCutExtendedZonesHi[0].lowCostCureHi, /दर्पण|पीला/);
  });

  it("should decompose severe L-shape plot into Block A & Block B with embedded brass strip", () => {
    const result = calculatePlotDualGridDecomposition({
      lengthFeet: 60,
      widthFeet: 40,
      cutLengthFeet: 30,
      cutWidthFeet: 25, // 750 sq ft out of 2400 = 31.25% cut (severe L-Shape)
      cutLocation: "NE",
    });
    assert.equal(result.isDualGridRequired, true);
    assert.equal(result.shapeCategory, "l_shape_dual_block");
    assert.equal(result.blocks.length, 2);
    assert.ok(result.demarcationStrip);
    assert.equal(result.demarcationStrip.material, "Brass");
    assert.match(result.demarcationStrip.materialHi, /पीतल की पत्ती/);
    assert.equal(result.demarcationStrip.thicknessMm, 3.5);
    assert.equal(result.demarcationStrip.depthMm, 12);
  });
});

describe("Trika Bhava Remedy Matrix Engine (6th, 8th, 12th Houses)", () => {
  it("should provide living plant in earthen pot for Rahu and Ketu in 6th house", () => {
    const rahuPlant = MASTER_6TH_HOUSE_PLANTS["Rahu"];
    assert.match(rahuPlant.plantNameHi, /चंदन/);
    assert.match(rahuPlant.mediumSpecificationHi, /मिट्टी के गमले/);

    const ketuPlant = MASTER_6TH_HOUSE_PLANTS["Ketu"];
    assert.match(ketuPlant.plantNameHi, /केले/);
    assert.match(ketuPlant.wateringProtocolHi, /हल्दी/);
    assert.match(ketuPlant.targetAilmentDebtHi, /फंसा हुआ धन/);
  });

  it("should provide whole fruit daan for 8th house afflictions", () => {
    const marsFruit = MASTER_8TH_HOUSE_FRUITS["Mars"];
    assert.match(marsFruit.fruitOrFoodHi, /8 साबुत ताजे अनार/);
    assert.match(marsFruit.donationVenueHi, /हनुमान मंदिर/);

    const rahuFruit = MASTER_8TH_HOUSE_FRUITS["Rahu"];
    assert.match(rahuFruit.fruitOrFoodHi, /अनानास|नारियल/);

    const saturnRemedy = MASTER_8TH_HOUSE_FRUITS["Saturn"];
    assert.match(saturnRemedy.fruitOrFoodHi, /बादाम|जूता-चप्पल सफाई/);
  });

  it("should provide KP voluntary tithe for 12th house planets to prevent involuntary hospital/police drains", () => {
    const analysis = getTrikaBhavaRemedyAnalysis({
      house6Planet: "Ketu",
      house8Planet: "Mars",
      house12Planet: "Jupiter",
    });
    assert.ok(analysis.chartSpecificPrescription);
    assert.equal(analysis.chartSpecificPrescription.house6Planet, "Ketu");
    assert.match(analysis.chartSpecificPrescription.activePlantRemedy?.plantNameHi || "", /केले/);

    const jupiterTithe = MASTER_12TH_HOUSE_VOLUNTARY_TITHES["Jupiter"];
    assert.match(jupiterTithe.voluntaryActionHi, /पुस्तकों|तीर्थ/);
    assert.match(jupiterTithe.preventedInvoluntaryDrainHi, /आईसीयू|वकीलों/);
  });
});

describe("6 Core Life Queries Reverse-Counting GPS Engine", () => {
  it("should calculate career stagnation (10th house) reverse trigger and origin correctly for Aries Lagna (1)", () => {
    // For Aries Lagna (1):
    // Target 10th house = Capricorn (10), Lord = Saturn, GPS Code = 7
    // 4-sec reverse count: 10 - 3 = 7th house (Libra)
    // Origin house: ((10 - 1 - 7 + 120) mod 12) + 1 = 3rd house (Gemini)
    const res = calculateQueryGPSAnalysis("career_stagnation", 1);
    assert.equal(res.targetHouse, 10);
    assert.equal(res.houseSignNum, 10);
    assert.equal(res.houseLord, "Saturn");
    assert.equal(res.gpsCode, 7);
    assert.equal(res.triggerHouse, 7);
    assert.equal(res.originHouse, 3);
    assert.match(res.mathematicalProofHi, /शास्त्रीय सूत्र/);
  });

  it("should calculate peeda chronic (8th house) with Saturn seva remedy", () => {
    const res = calculateQueryGPSAnalysis("peeda_chronic", 1);
    assert.equal(res.targetHouse, 8);
    assert.match(res.lowCostActivatingRemedyHi, /जूता-चप्पल सफाई सेवा/);
  });

  it("should calculate roga health (6th house) with NW heating and cervical diagnostic", () => {
    const res = calculateQueryGPSAnalysis("roga_health", 6); // Virgo Lagna
    assert.equal(res.targetHouse, 6);
    assert.ok(res.clutterItemsToInspectHi.some(c => c.includes("उत्तर-पश्चिम (NW) में हीटर")));
  });

  it("should calculate dhana liquidity (2nd house) and vyaya drainage (12th house)", () => {
    const dhana = calculateQueryGPSAnalysis("dhana_liquidity", 1);
    assert.equal(dhana.targetHouse, 2);
    assert.match(dhana.lowCostActivatingRemedyHi, /सोने के रंग के फ्रेम/);

    const vyaya = calculateQueryGPSAnalysis("vyaya_drainage", 1);
    assert.equal(vyaya.targetHouse, 12);
    assert.ok(vyaya.clutterItemsToInspectHi.some(c => c.includes("सौंदर्य प्रसाधन")));
  });
});

describe("Micro-Vastu Auditor & Emergency Medical Guard", () => {
  it("should detect kitchen fire-water clash when stove and sink are close on same counter", () => {
    const clash = auditKitchenMicroGrid({
      stoveZoneWithinKitchen: "SE",
      sinkZoneWithinKitchen: "SE",
      areStoveAndSinkOnSameCounter: true,
      distanceBetweenStoveAndSinkFeet: 2,
    });
    assert.equal(clash.hasFireWaterClash, true);
    assert.match(clash.lowCostRemedyHi, /लकड़ी की चॉपिंग बोर्ड|हरी मार्बल/);
  });

  it("should raise CRITICAL_EMERGENCY medical alert for stove or toilet in North-East (NE)", () => {
    const alerts = auditEmergencyMedicalVastuAlerts([
      { type: "kitchen_stove", direction: "NE" },
      { type: "toilet", direction: "NE" },
    ]);
    assert.equal(alerts.length, 2);
    assert.equal(alerts[0].severity, "CRITICAL_EMERGENCY");
    assert.match(alerts[0].medicalHazardsHi[0], /उच्च रक्तचाप|ब्रेन स्ट्रोक/);
    assert.match(alerts[0].zeroRemedyDisclaimerHi, /कोई भी रंगीन टेप, पिरामिड.*उपचार सम्भव नहीं है/);
  });

  it("should evaluate Wall Clock zones correctly", () => {
    const sswClock = auditWallClockZone("SSW");
    assert.equal(sswClock.status, "HAZARDOUS");
    assert.match(sswClock.effectHi, /विसर्जन/);

    const northClock = auditWallClockZone("N");
    assert.equal(northClock.status, "AUSPICIOUS");
    assert.match(northClock.effectHi, /कुबेर/);
  });

  it("should enforce Navtara-Hit Precedence override when a benefic Tara planet has active 180° Killer Hit", () => {
    // Mock chart with Moon in Ashwini (1), Venus in Revati (27 - Parama Mitra)
    // and an active 180° hit by Venus
    const mockChart = {
      moonNakshatraNumber: 1,
      moonNakshatraName: "Ashwini",
      planets: [
        { name: "Venus", nakshatra: 27, nakshatraName: "Revati" },
      ],
    };
    const mockDossier: any = {
      killerHits180: [
        { sourceName: "Venus", targetName: "Ascendant", angle: 180, hitDef: { name: "180° Killer Hit" } },
      ],
      dangerousHits90: [],
    };

    const precedence = evaluateNavtaraHitPrecedence(mockChart, mockDossier);
    assert.equal(precedence.length, 1);
    assert.equal(precedence[0].countedPosition, 27);
    assert.equal(precedence[0].precedenceVerdict, "PROHIBITED_ACTIVATION");
    assert.match(precedence[0].warningNoticeHi, /नवतारा-हिट वरीयता नियम/);
    assert.match(precedence[0].actionProtocolHi, /11वें भाव/);
  });
});
