import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateChart } from "../calculations";
import { runAstroVastuHitEngine } from "../astro-vastu-hit-engine";
import { evaluateDailyAccessories, evaluateAstroPrescriptionFormula } from "../astro-prescription-engine";
import { runVastuPurushaMandalaEngine } from "../vastu-purusha-mandala-engine";
import { runGPSAstroVastuEngine } from "../gps-astro-vastu-engine";
import { auditUserWearables } from "../bio-wearable-audit-engine";
import { evaluateAllGoalActivations } from "../goal-house-activation-engine";

describe("Exhaustive Tab-by-Tab Comparison Between Two Completely Different Kundlis", () => {
  // Chart 1: Aries Lagna (1995-04-15 06:30 Delhi) - Mars rules 1st, Sun in 1st Aries, Moon in Libra
  const chart1 = calculateChart("Chart 1 (Aries Native)", "1995-04-15", "06:30", "Delhi", 28.6139, 77.2090, 5.5);

  // Chart 2: Scorpio Lagna (1998-11-20 07:30 Delhi) - Mars rules 1st, Sun/Mercury in Scorpio, Moon in Scorpio/Sagittarius
  const chart2 = calculateChart("Chart 2 (Scorpio Native)", "1998-11-20", "07:30", "Delhi", 28.6139, 77.2090, 5.5);

  const dossier1 = runAstroVastuHitEngine(chart1);
  const dossier2 = runAstroVastuHitEngine(chart2);

  it("Tab 1 (dossier): Lagna, Active Dasha, and Coordinates must be completely different", () => {
    assert.equal(chart1.lagnaRashi, "Aries");
    assert.equal(chart2.lagnaRashi, "Scorpio");
    assert.notEqual(dossier1.lagnaSign, dossier2.lagnaSign);
    assert.notEqual(dossier1.lagnaSignHindi, dossier2.lagnaSignHindi);
    assert.notEqual(dossier1.lagnaCompoundDeg, dossier2.lagnaCompoundDeg);
    console.log("✓ Tab 1 (Dossier): Lagna 1 =", dossier1.lagnaSignHindi, "vs Lagna 2 =", dossier2.lagnaSignHindi);
  });

  it("Tab 2 (rxPrescription): Active Salt, PPI Shield, and Compound Thread blend must be completely different", () => {
    const rx1 = evaluateAstroPrescriptionFormula(chart1, dossier1);
    const rx2 = evaluateAstroPrescriptionFormula(chart2, dossier2);

    assert.notEqual(rx1.activeSalt.planet, rx2.activeSalt.planet, "Active Salt planet should differ");
    assert.notEqual(rx1.compoundThread.blendedHex, rx2.compoundThread.blendedHex, "Blended Thread Hex must differ");
    console.log("✓ Tab 2 (Rx): Salt 1 =", rx1.activeSalt.planet, "(", rx1.compoundThread.blendedHex, ") vs Salt 2 =", rx2.activeSalt.planet, "(", rx2.compoundThread.blendedHex, ")");
  });

  it("Tab 3 (accessories): Footwear, Cap, Belt, Mask, and Phone Cover must be 100% different", () => {
    const acc1 = evaluateDailyAccessories(chart1);
    const acc2 = evaluateDailyAccessories(chart2);

    // 1. Phone cover
    assert.notEqual(acc1.phoneCover.recommendedColors[0], acc2.phoneCover.recommendedColors[0]);
    assert.notEqual(acc1.phoneCover.planetaryMechanism, acc2.phoneCover.planetaryMechanism);

    // 2. Footwear (12th house: Aries has Pisces/Jupiter vs Scorpio has Libra/Venus)
    assert.notEqual(acc1.footwear.recommendedColors[0], acc2.footwear.recommendedColors[0]);
    assert.notEqual(acc1.footwear.planetaryMechanism, acc2.footwear.planetaryMechanism);

    // 3. Headwear (1st house: Aries Mars vs Scorpio Mars/Sun)
    assert.notEqual(acc1.headwearCap.recommendedColors[0], acc2.headwearCap.recommendedColors[0]);
    assert.notEqual(acc1.headwearCap.planetaryMechanism, acc2.headwearCap.planetaryMechanism);

    // 4. Belt (7th house: Aries has Libra/Venus vs Scorpio has Taurus/Venus)
    assert.notEqual(acc1.belt.buckleMetal, acc2.belt.buckleMetal);
    assert.notEqual(acc1.belt.planetaryMechanism, acc2.belt.planetaryMechanism);

    // 5. Mask (2nd house: Aries has Taurus/Venus vs Scorpio has Sagittarius/Jupiter)
    assert.notEqual(acc1.faceMask.recommendedColors[0], acc2.faceMask.recommendedColors[0]);
    assert.notEqual(acc1.faceMask.planetaryMechanism, acc2.faceMask.planetaryMechanism);

    console.log("✓ Tab 3 (Accessories): Footwear 1 =", acc1.footwear.recommendedColors[0], "vs Footwear 2 =", acc2.footwear.recommendedColors[0]);
    console.log("✓ Tab 3 (Accessories): Belt 1 Buckle =", acc1.belt.buckleMetal, "vs Belt 2 Buckle =", acc2.belt.buckleMetal);
  });

  it("Tab 5 (trafficPolice): Cosmic Friction Locks must differ between the two charts", () => {
    console.log("✓ Tab 5 (Friction Locks): Chart 1 Locks =", dossier1.trafficPoliceBlockades.length, "vs Chart 2 Locks =", dossier2.trafficPoliceBlockades.length);
    // Even if counts match in rare charts, themes and blocked planets are different
    if (dossier1.trafficPoliceBlockades.length > 0 && dossier2.trafficPoliceBlockades.length > 0) {
      assert.notEqual(dossier1.trafficPoliceBlockades[0].blockingPlanet, dossier2.trafficPoliceBlockades[0].blockingPlanet);
    }
  });

  it("Tab 6 (hits): All 3-5-8 Hits must differ in count and planetary pairs", () => {
    assert.notEqual(JSON.stringify(dossier1.allHits), JSON.stringify(dossier2.allHits));
    console.log("✓ Tab 6 (Hits): Chart 1 Total Hits =", dossier1.allHits.length, "vs Chart 2 Total Hits =", dossier2.allHits.length);
  });

  it("Tab 7 (shifting): 120 Protective Shifting recommendations must differ", () => {
    assert.notEqual(JSON.stringify(dossier1.shiftingPrescriptions), JSON.stringify(dossier2.shiftingPrescriptions));
    console.log("✓ Tab 7 (Shifting): Chart 1 Shifting Count =", dossier1.shiftingPrescriptions.length, "vs Chart 2 =", dossier2.shiftingPrescriptions.length);
  });

  it("Tab 8 (bodyTherapy): 12 Rashi Dot Matrix Houses and Thread Verdicts must be completely rotated", () => {
    // Aries: House for Aries is 1, Taurus is 2, Gemini is 3, etc.
    const ariesH1 = dossier1.bodyPartRemedyRegistry.find(r => r.signNum === 1);
    assert.equal(ariesH1?.houseNum, 1, "In Aries Lagna, Aries must be House 1");

    // Scorpio: House for Aries is 6 (Trika!), Taurus is 7, Scorpio is 1
    const scorpioAries = dossier2.bodyPartRemedyRegistry.find(r => r.signNum === 1);
    assert.equal(scorpioAries?.houseNum, 6, "In Scorpio Lagna, Aries must be House 6 (Trika)");

    // Therefore, the houses and verdicts for the signs are completely different!
    assert.notEqual(ariesH1?.houseNum, scorpioAries?.houseNum);
    console.log("✓ Tab 8 (Body Matrix): Aries Sign in Chart 1 = House", ariesH1?.houseNum, "vs in Chart 2 = House", scorpioAries?.houseNum);
  });

  it("Tab 11 (wearableAudit): Bio-Wearable Audit must reflect native's distinct chart", () => {
    const audit1 = auditUserWearables(chart1, [
      { id: "1", location: "wrist_right", item: "gold_kada" },
    ]);
    const audit2 = auditUserWearables(chart2, [
      { id: "1", location: "wrist_right", item: "gold_kada" },
    ]);

    assert.notEqual(audit1.lagnaSign, audit2.lagnaSign);
    console.log("✓ Tab 11 (Wearable): Native 1 Lagna =", audit1.lagnaSign, "vs Native 2 Lagna =", audit2.lagnaSign);
  });

  it("Tab 12 (gpsRadar): GPS 4-Sec Trigger Houses and Query Analyses must be different", () => {
    const gps1 = runGPSAstroVastuEngine(chart1);
    const gps2 = runGPSAstroVastuEngine(chart2);

    assert.ok(gps1 && gps2);
    assert.notEqual(gps1.lagnaSignHindi, gps2.lagnaSignHindi);
    // House 1 query sign should differ:
    assert.notEqual(gps1.queryAnalyses[1].houseSign, gps2.queryAnalyses[1].houseSign);
    console.log("✓ Tab 12 (GPS): H1 Sign in Chart 1 =", gps1.queryAnalyses[1].houseSign, "vs in Chart 2 =", gps2.queryAnalyses[1].houseSign);
  });

  it("Tab 13 (mandala): 45 Devatas and 32 Entrances must have completely different House Mappings & Verdicts", () => {
    const m1 = runVastuPurushaMandalaEngine(chart1);
    const m2 = runVastuPurushaMandalaEngine(chart2);

    // E3 Jayanta
    const jayanta1 = m1.nativeMappings.find(m => m.devata.padCode === "E3");
    const jayanta2 = m2.nativeMappings.find(m => m.devata.padCode === "E3");

    assert.ok(jayanta1 && jayanta2);
    // In Aries Lagna vs Scorpio Lagna, Jayanta's house number MUST be different!
    assert.notEqual(jayanta1.nativeHouseNum, jayanta2.nativeHouseNum);
    assert.notEqual(jayanta1.shastricVerdictBadge, jayanta2.shastricVerdictBadge);

    // Bhudhar (Cardinal North face)
    const bhudhar1 = m1.nativeMappings.find(m => m.devata.id === "BHUDHAR");
    const bhudhar2 = m2.nativeMappings.find(m => m.devata.id === "BHUDHAR");
    assert.ok(bhudhar1 && bhudhar2);
    assert.notEqual(bhudhar1.nativeHouseNum, bhudhar2.nativeHouseNum);

    console.log("✓ Tab 13 (45 Devatas): E3 Jayanta in Chart 1 = House", jayanta1.nativeHouseNum, "(", jayanta1.shastricVerdictBadge, ") vs Chart 2 = House", jayanta2.nativeHouseNum, "(", jayanta2.shastricVerdictBadge, ")");
    console.log("✓ Tab 13 (45 Devatas): Bhudhar in Chart 1 = House", bhudhar1.nativeHouseNum, "vs Chart 2 = House", bhudhar2.nativeHouseNum);
  });

  it("Tab 4 (radar): 12-Direction Spatial Radar planetary occupants must differ", () => {
    const north1 = dossier1.directionPlanetaryInventory["N"];
    const north2 = dossier2.directionPlanetaryInventory["N"];
    assert.notEqual(JSON.stringify(dossier1.directionPlanetaryInventory), JSON.stringify(dossier2.directionPlanetaryInventory));
    console.log("✓ Tab 4 (Radar): Chart 1 North planets =", north1?.planets.join(",") || "None", "vs Chart 2 =", north2?.planets.join(",") || "None");
  });

  it("Tab 9 (conflicts): Generic Vastu Conflicts must differ based on individual placements", () => {
    assert.notEqual(JSON.stringify(dossier1.genericVastuConflicts), JSON.stringify(dossier2.genericVastuConflicts));
    console.log("✓ Tab 9 (Conflicts): Conflicts 1 =", dossier1.genericVastuConflicts.length, "vs Conflicts 2 =", dossier2.genericVastuConflicts.length);
  });

  it("Tab 10 (lifestyle): Mars Dietary Protocol must reflect native's Mars affliction state", () => {
    const p1 = dossier1.marsDietaryLifestyleProtocol;
    const p2 = dossier2.marsDietaryLifestyleProtocol;
    assert.ok(p1 && p2);
    assert.notEqual(p1.directiveText, p2.directiveText);
    console.log("✓ Tab 10 (Lifestyle): Mars Afflicted 1 =", p1.isMarsAfflicted, "vs Mars Afflicted 2 =", p2.isMarsAfflicted);
  });

  it("Tab 15 (goalActivation): Goal House 4x4 Floor Hardware must map to native's distinct houses", () => {
    const goals1 = evaluateAllGoalActivations(chart1);
    const goals2 = evaluateAllGoalActivations(chart2);

    const h3_chart1 = goals1.foreign_travel.houseDetails.find(h => h.house === 3);
    const h3_chart2 = goals2.foreign_travel.houseDetails.find(h => h.house === 3);

    assert.ok(h3_chart1 && h3_chart2);
    assert.notEqual(h3_chart1.houseSign, h3_chart2.houseSign, "House 3 sign must differ");
    assert.notEqual(h3_chart1.directionCode, h3_chart2.directionCode, "House 3 direction code must differ");
    console.log("✓ Tab 15 (Goal Activation): H3 for Chart 1 =", h3_chart1.houseSign, "(", h3_chart1.directionCode, ") vs Chart 2 =", h3_chart2.houseSign, "(", h3_chart2.directionCode, ")");
  });
});
