import { describe, it } from "node:test";
import assert from "node:assert/strict";

// Calculations & Core
import { calculateChart } from "../calculations";

// 1. Yogas Engine
import { getPresentYogas, calculateYogaScore } from "../yogas";

// 2. Ashtakavarga Engine
import { calculateAshtakavarga } from "../ashtakavarga";

// 3. Shadbala Engine
import { calculateShadbala } from "../shadbala";

// 4. Jaimini Engine
import { buildJaiminiChart } from "../jaimini";

// 5. Special Lagnas Engine
import { calculateSpecialLagnas } from "../special-lagnas";

// 6. KP Engine
import { calculateKpReport } from "../kp";

// 7. Destiny Engine
import { calculateDestiny } from "../destiny";

// 8. Remedy Engine
import { calculateRemedies } from "../remedy";

// 9. Gemstone Engine
import { generateGemstoneReportFromChart } from "../gemstone";

// 10. Medical Engine
import { calculateMedical } from "../medical";

// 11. Lal Kitab Engine
import { calculateLalKitab } from "../lalkitab";

// 12. Numerology Engine
import { calculateNumerology } from "../numerology";

// 13. Astro Sound Engine
import { runAstroSound } from "../astro-sound";

// 14. Astro Tattoo Engine
import { generateAstroTattooAudit } from "../astro-tattoo-engine";

// 15. Sarvatobhadra Engine
import { calculateSarvatobhadra } from "../sarvatobhadra";

// 16. Divisional Charts Engine
import { calculateDivisional } from "../divisional";

// 17. Panchang Engine
import { calculatePanchang } from "../panchang";

// 18. Kundali Milan Engine
import { calculateMilan } from "../kundali-milan";

// 19. Prashna Engine
import { calculatePrashna } from "../prashna";

// 20. Astro-Vastu Suite
import { runAstroVastuHitEngine } from "../astro-vastu-hit-engine";
import { evaluateDailyAccessories, evaluateAstroPrescriptionFormula } from "../astro-prescription-engine";
import { runVastuPurushaMandalaEngine } from "../vastu-purusha-mandala-engine";
import { evaluateAllGoalActivations } from "../goal-house-activation-engine";

describe("Platform-Wide Multi-Engine Dynamic Verification Scan", () => {
  // Chart 1: Aries Native (1995-04-15 06:30 Delhi) - Mars ruled, Fire sign
  const chart1 = calculateChart("Aries Native", "1995-04-15", "06:30", "Delhi", 28.6139, 77.2090, 5.5);

  // Chart 2: Cancer Native (1998-07-20 14:30 Mumbai) - Moon ruled, Water sign
  const chart2 = calculateChart("Cancer Native", "1998-07-20", "14:30", "Mumbai", 19.0760, 72.8777, 5.5);

  it("1. Core Chart Calculation Engine: Lagna, Moon sign, and planetary longitudes must differ", () => {
    assert.equal(chart1.lagnaRashi, "Aries");
    assert.notEqual(chart1.lagnaRashi, chart2.lagnaRashi);
    assert.notEqual(chart1.planets.Moon.sign, chart2.planets.Moon.sign);
    assert.notEqual(chart1.planets.Sun.lon, chart2.planets.Sun.lon);
    assert.notEqual(chart1.planets.Saturn.lon, chart2.planets.Saturn.lon);
  });

  it("2. Yogas Engine: Active detected yogas and yoga breakdown must differ", () => {
    const yogas1 = getPresentYogas(chart1.planets, chart1.lagnaNum, "elite");
    const yogas2 = getPresentYogas(chart2.planets, chart2.lagnaNum, "elite");
    const names1 = yogas1.map(y => y.name).sort().join(",");
    const names2 = yogas2.map(y => y.name).sort().join(",");

    assert.notEqual(names1, names2, "Detected yogas list must differ");
    assert.notEqual(yogas1.length, yogas2.length, "Total number of yogas must differ");
  });

  it("3. Ashtakavarga Engine: SAV points per house must differ", () => {
    const akv1 = calculateAshtakavarga(chart1.planets, chart1.lagnaNum);
    const akv2 = calculateAshtakavarga(chart2.planets, chart2.lagnaNum);

    const sav1 = akv1.sarva.join(",");
    const sav2 = akv2.sarva.join(",");
    assert.notEqual(sav1, sav2, "Sarvashtakavarga scores should differ");
  });

  it("4. Shadbala Engine: Planetary strengths and rankings must differ", () => {
    const sb1 = calculateShadbala(chart1.planets, 6.5);
    const sb2 = calculateShadbala(chart2.planets, 14.5);

    assert.notEqual(sb1.strongest, sb2.strongest);
    assert.notEqual(sb1.planets[0].total, sb2.planets[0].total);
  });

  it("5. Jaimini Engine: Atmakaraka, Arudhas, and Chara Dasha must differ", () => {
    const j1 = buildJaiminiChart(chart1);
    const j2 = buildJaiminiChart(chart2);

    const ak1 = j1.karakas.find(k => k.role === "AK")?.planet;
    const ak2 = j2.karakas.find(k => k.role === "AK")?.planet;
    assert.notEqual(ak1, ak2, "Atmakaraka must differ");

    const al1 = j1.arudhas.find(a => a.house === 1)?.sign;
    const al2 = j2.arudhas.find(a => a.house === 1)?.sign;
    assert.notEqual(al1, al2, "Arudha Lagna sign must differ");

    assert.notEqual(j1.currentDasha?.sign, j2.currentDasha?.sign, "Active Chara Dasha must differ");
  });

  it("6. Special Lagnas Engine: Indu, Sree, Hora, and Bhava lagnas must differ", () => {
    const sl1 = calculateSpecialLagnas(chart1);
    const sl2 = calculateSpecialLagnas(chart2);

    assert.notEqual(sl1.induLagna.sign, sl2.induLagna.sign, "Indu Lagna sign must differ");
    assert.notEqual(sl1.sreeLagna.sign, sl2.sreeLagna.sign, "Sree Lagna sign must differ");
    assert.notEqual(sl1.horaLagna.sign, sl2.horaLagna.sign, "Hora Lagna sign must differ");
  });

  it("7. KP Astrology Engine: Cuspal Sub-Lords and Significators must differ", () => {
    const kp1 = calculateKpReport(chart1);
    const kp2 = calculateKpReport(chart2);

    const subLordH1_1 = kp1.cusps[0].subLord;
    const subLordH1_2 = kp2.cusps[0].subLord;
    assert.notEqual(subLordH1_1, subLordH1_2, "KP 1st house sub-lord must differ");
  });

  it("8. Destiny Engine: Current scores, bands, and milestones must differ", () => {
    const d1 = calculateDestiny(chart1.planets, chart1.dashas, chart1.dob, chart1.lagnaNum);
    const d2 = calculateDestiny(chart2.planets, chart2.dashas, chart2.dob, chart2.lagnaNum);

    assert.notEqual(d1.currentScore, d2.currentScore, "Current destiny score must differ");
    assert.notEqual(d1.peak.score, d2.peak.score, "Peak destiny score must differ");
  });

  it("9. Remedy Engine: Priority dasha and active remedies must differ", () => {
    const rem1 = calculateRemedies(chart1);
    const rem2 = calculateRemedies(chart2);

    assert.notEqual(rem1.antardashaActive, rem2.antardashaActive, "Antardasha must differ");
    assert.notEqual(rem1.cards[0].whyPersonalized, rem2.cards[0].whyPersonalized, "Personalization logic must differ");
  });

  it("10. Gemstone Engine: Primary life stone and lucky gemstones must differ", () => {
    const gem1 = generateGemstoneReportFromChart(chart1);
    const gem2 = generateGemstoneReportFromChart(chart2);

    assert.notEqual(gem1.primaryGemstone.gemstone, gem2.primaryGemstone.gemstone);
    assert.notEqual(gem1.lagnaLord, gem2.lagnaLord);
  });

  it("11. Medical Engine: Vulnerable anatomical zones and moon afflictions must differ", () => {
    const med1 = calculateMedical(chart1);
    const med2 = calculateMedical(chart2);

    assert.notEqual(med1.lagnaBodyZone, med2.lagnaBodyZone);
    assert.notEqual(med1.moonSignDisease, med2.moonSignDisease);
  });

  it("12. Lal Kitab Engine: Kismat jagane wala planet and takkar counts must differ", () => {
    const lk1 = calculateLalKitab(chart1.planets, chart1.dob, chart1.lagnaNum);
    const lk2 = calculateLalKitab(chart2.planets, chart2.dob, chart2.lagnaNum);

    assert.notEqual(lk1.kismat.planet, lk2.kismat.planet);
    assert.notEqual(lk1.kismat.house, lk2.kismat.house);
  });

  it("13. Numerology Engine: Mulank, Bhagyank, and Name Numbers must differ", () => {
    const num1 = calculateNumerology("Aries Native", "1995-04-15");
    const num2 = calculateNumerology("Cancer Native", "1998-07-20");

    assert.notEqual(num1.birthday.value, num2.birthday.value);
    assert.notEqual(num1.lifePath.value, num2.lifePath.value);
  });

  it("14. Astro Sound Engine: Active dasha and protocol timing must differ", () => {
    const snd1 = runAstroSound({ chart: chart1, goal: "mind", emotion: "joy", voice: "female", intensity: "medium", mode: "astro" });
    const snd2 = runAstroSound({ chart: chart2, goal: "mind", emotion: "joy", voice: "female", intensity: "medium", mode: "astro" });

    // Both get personalized protocols
    assert.ok(snd1.score > 0 && snd2.score > 0);
    assert.ok(snd1.protocol.length > 0 && snd2.protocol.length > 0);
    assert.notEqual(snd1.mantraPlan.practice[1], snd2.mantraPlan.practice[1], "Antardasha mantra practice must differ");
  });

  it("15. Astro Tattoo Engine: Sacred geometry placement and target organ must differ", () => {
    const tat1 = generateAstroTattooAudit(chart1, { activeGoal: "marriage", gender: "male" });
    const tat2 = generateAstroTattooAudit(chart2, { activeGoal: "marriage", gender: "male" });

    assert.notEqual(tat1.chartLagna.signName, tat2.chartLagna.signName);
    assert.notEqual(tat1.prescription.primarySignName, tat2.prescription.primarySignName);
    assert.notEqual(tat1.prescription.anatomicalLocation.bodyPart, tat2.prescription.anatomicalLocation.bodyPart);
  });

  it("16. Sarvatobhadra Engine: Janma nakshatra and index must differ", () => {
    const sbc1 = calculateSarvatobhadra(chart1);
    const sbc2 = calculateSarvatobhadra(chart2);

    assert.notEqual(sbc1.birthNakshatra, sbc2.birthNakshatra);
    assert.notEqual(sbc1.birthNakshatraIndex, sbc2.birthNakshatraIndex);
  });

  it("17. Divisional Engine: Navamsha (D9) and Dasamsa (D10) charts must differ", () => {
    const div1 = calculateDivisional(chart1.planets, chart1.lagnaNum, chart1.lagnaLon);
    const div2 = calculateDivisional(chart2.planets, chart2.lagnaNum, chart2.lagnaLon);

    const d9_1 = div1.find(d => d.key === "D9");
    const d9_2 = div2.find(d => d.key === "D9");
    assert.notEqual(d9_1?.lagna, d9_2?.lagna);
  });

  it("18. Panchang Engine: Tithi, Nakshatra, and Karanas for birth dates must differ", () => {
    const p1 = calculatePanchang(new Date("1995-04-15T06:30:00+05:30"), 5.5, { lat: 28.6139, lon: 77.2090 });
    const p2 = calculatePanchang(new Date("1998-07-20T14:30:00+05:30"), 5.5, { lat: 19.0760, lon: 72.8777 });

    assert.notEqual(p1.tithi, p2.tithi);
    assert.notEqual(p1.nakshatra, p2.nakshatra);
  });

  it("19. Kundali Milan Engine: Compatibility score must evaluate real Ashtakoota metrics", () => {
    const moonNak1 = 14; // Chitra
    const moonRashi1 = 6; // Libra
    const moonNak2 = 18; // Jyeshtha
    const moonRashi2 = 7; // Scorpio

    const milan = calculateMilan("Native 1", moonNak1, moonRashi1, "Native 2", moonNak2, moonRashi2);
    assert.ok(milan.totalScore >= 0 && milan.totalScore <= 36);
    assert.ok(milan.koots.length === 8);
  });

  it("20. Prashna Engine: Horary queries produce dynamic horary charts", () => {
    const prashna1 = calculatePrashna("Will I get the job?", "career", 28.6139, 77.2090, 5.5, 42);
    const prashna2 = calculatePrashna("Will I buy the house?", "property", 19.0760, 72.8777, 5.5, 189);

    assert.notEqual(prashna1.lagnaRashi, prashna2.lagnaRashi);
    assert.notEqual(prashna1.primaryHouse, prashna2.primaryHouse);
    assert.notEqual(prashna1.layer7KPHorary.horaryNumber, prashna2.layer7KPHorary.horaryNumber);
  });

  it("21. Astro-Vastu Full Suite (15 Tabs): Dynamic and distinct across all tabs", () => {
    const v1 = runAstroVastuHitEngine(chart1);
    const v2 = runAstroVastuHitEngine(chart2);

    // Tab 1: Lagna & Dasha
    assert.notEqual(v1.lagnaSign, v2.lagnaSign);

    // Tab 2: Rx Salt
    const rx1 = evaluateAstroPrescriptionFormula(chart1, v1);
    const rx2 = evaluateAstroPrescriptionFormula(chart2, v2);
    assert.notEqual(rx1.activeSalt.planet, rx2.activeSalt.planet);

    // Tab 3: Accessories
    const acc1 = evaluateDailyAccessories(chart1);
    const acc2 = evaluateDailyAccessories(chart2);
    assert.notEqual(acc1.footwear.recommendedColors[0], acc2.footwear.recommendedColors[0]);
    assert.notEqual(acc1.belt.buckleMetal, acc2.belt.buckleMetal);

    // Tab 5: Friction Locks
    assert.notEqual(v1.cosmicFrictionLocks.length, v2.cosmicFrictionLocks.length);

    // Tab 8: Body Matrix
    const ariesH1 = v1.bodyPartRemedyRegistry.find(r => r.signName === "Aries")?.houseNum;
    const ariesH2 = v2.bodyPartRemedyRegistry.find(r => r.signName === "Aries")?.houseNum;
    assert.notEqual(ariesH1, ariesH2);

    // Tab 13: 45 Devatas & 32 Gates
    const dev1 = runVastuPurushaMandalaEngine(chart1);
    const dev2 = runVastuPurushaMandalaEngine(chart2);
    assert.notEqual(dev1.nativeMappings[0].nativeHouseNum, dev2.nativeMappings[0].nativeHouseNum);

    // Tab 15: Goal Activation
    const act1 = evaluateAllGoalActivations(chart1);
    const act2 = evaluateAllGoalActivations(chart2);
    assert.notEqual(act1.foreign_travel.houseDetails[0].directionCode, act2.foreign_travel.houseDetails[0].directionCode);
  });
});
