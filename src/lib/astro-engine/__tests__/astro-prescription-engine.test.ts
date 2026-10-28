// src/lib/astro-engine/__tests__/astro-prescription-engine.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateDailyAccessories,
  evaluateAstroPrescriptionFormula,
  getCompoundThreadColorBlend,
  computeDegreeChromaticModulation,
} from "../astro-prescription-engine";
import { runAstroVastuHitEngine } from "../astro-vastu-hit-engine";
import type { ChartData } from "../calculations";

describe("Astro-Pharmacological Prescription Engine (Dynamic & Non-Hardcoded)", () => {
  it("should calculate distinct base hues and hex codes for different planets", () => {
    const sunMod = computeDegreeChromaticModulation("Sun", { degree: 15, minutes: 0 } as any);
    assert.equal(sunMod.baseHue, 24);
    assert.ok(sunMod.hexCode.startsWith("#"));

    const marsMod = computeDegreeChromaticModulation("Mars", { degree: 15, minutes: 0 } as any);
    assert.equal(marsMod.baseHue, 0);

    const jupiterMod = computeDegreeChromaticModulation("Jupiter", { degree: 15, minutes: 0 } as any);
    assert.equal(jupiterMod.baseHue, 48);

    const saturnMod = computeDegreeChromaticModulation("Saturn", { degree: 15, minutes: 0 } as any);
    assert.equal(saturnMod.baseHue, 220);

    const mercuryMod = computeDegreeChromaticModulation("Mercury", { degree: 15, minutes: 0 } as any);
    assert.equal(mercuryMod.baseHue, 142);
    // None of Sun, Mars, Jupiter, Saturn should have hue 84 (Lime Green)!
    assert.notEqual(sunMod.baseHue, 84);
    assert.notEqual(marsMod.baseHue, 84);
    assert.notEqual(saturnMod.baseHue, 84);
  });

  it("should dynamically blend compound thread colors for different planet pairs", () => {
    // Sun + Jupiter -> Honey Saffron (#F59E0B), NOT Lime Green!
    const sunJup = getCompoundThreadColorBlend("Sun", "Jupiter");
    assert.equal(sunJup.blendedHex, "#F59E0B");
    assert.ok(sunJup.blendedColorName.includes("Honey Saffron"));

    // Moon + Jupiter -> Gajakesari Cream (#FEF08A), NOT Lime Green!
    const moonJup = getCompoundThreadColorBlend("Moon", "Jupiter");
    assert.equal(moonJup.blendedHex, "#FEF08A");
    assert.ok(moonJup.blendedColorName.includes("Gajakesari"));

    // Mars + Jupiter -> Saffron Coral (#EA580C)
    const marsJup = getCompoundThreadColorBlend("Mars", "Jupiter");
    assert.equal(marsJup.blendedHex, "#EA580C");

    // Saturn + Jupiter -> Royal Indigo (#1D4ED8)
    const satJup = getCompoundThreadColorBlend("Saturn", "Jupiter");
    assert.equal(satJup.blendedHex, "#1D4ED8");

    // Mercury + Jupiter -> Lime Green / Parrot Green (#84CC16)
    const mercJup = getCompoundThreadColorBlend("Mercury", "Jupiter");
    assert.equal(mercJup.blendedHex, "#84CC16");
  });

  it("should generate 100% chart-driven phone cover and wallet specs across different Lagnas", () => {
    // 1. Leo Lagna native (Sun rules 1st, Venus rules 3rd Libra)
    const leoChart = {
      name: "Leo Native",
      lagnaRashi: "Leo",
      lagnaNum: 4,
      dashas: [{ planet: "Sun", active: true, start: new Date("2024-01-01"), end: new Date("2030-01-01") }],
      planets: {
        Sun: { sign: "Leo", signNum: 5, degree: 15, minutes: 0, house: 1, lon: 135 },
        Moon: { sign: "Aries", signNum: 1, degree: 10, minutes: 0, house: 9, lon: 10, nakshatra: "Ashwini" },
      }
    } as unknown as ChartData;

    const leoAcc = evaluateDailyAccessories(leoChart);
    // Leo 3rd house is Libra (Venus) -> Pastel Rose, Champagne, Soft Silver, Tan (NOT Lime Green!)
    assert.ok(leoAcc.phoneCover.recommendedColors.some(c => c.includes("Pastel") || c.includes("Champagne")));
    assert.ok(!leoAcc.phoneCover.recommendedColors[0].includes("Lime Green"));

    // 2. Scorpio Lagna native (Mars rules 1st, Saturn rules 3rd Capricorn)
    const scorpioChart = {
      name: "Scorpio Native",
      lagnaRashi: "Scorpio",
      lagnaNum: 7,
      dashas: [{ planet: "Mars", active: true, start: new Date("2024-01-01"), end: new Date("2031-01-01") }],
      planets: {
        Mars: { sign: "Scorpio", signNum: 8, degree: 18, minutes: 0, house: 1, lon: 228 },
        Moon: { sign: "Taurus", signNum: 2, degree: 5, minutes: 0, house: 7, lon: 35, nakshatra: "Krittika" },
      }
    } as unknown as ChartData;

    const scorpioAcc = evaluateDailyAccessories(scorpioChart);
    // Scorpio 3rd house is Capricorn (Saturn) -> Steel Blue, Dark Slate, Classic Navy (NOT Lime Green!)
    assert.ok(scorpioAcc.phoneCover.recommendedColors.some(c => c.includes("Steel Blue") || c.includes("Slate")));
    assert.ok(!scorpioAcc.phoneCover.recommendedColors[0].includes("Lime Green"));

    // 3. Sagittarius Lagna native (Jupiter rules 1st, Saturn/Rahu rules 3rd Aquarius)
    const sagChart = {
      name: "Sagittarius Native",
      lagnaRashi: "Sagittarius",
      lagnaNum: 8,
      dashas: [{ planet: "Jupiter", active: true, start: new Date("2024-01-01"), end: new Date("2040-01-01") }],
      planets: {
        Jupiter: { sign: "Sagittarius", signNum: 9, degree: 12, minutes: 0, house: 1, lon: 252 },
        Moon: { sign: "Cancer", signNum: 4, degree: 20, minutes: 0, house: 8, lon: 110, nakshatra: "Pushya" },
      }
    } as unknown as ChartData;

    const sagAcc = evaluateDailyAccessories(sagChart);
    assert.ok(sagAcc.phoneCover.recommendedColors.some(c => c.includes("Royal Navy") || c.includes("Cobalt")));
    assert.ok(!sagAcc.phoneCover.recommendedColors[0].includes("Lime Green"));
  });

  it("should generate completely different master prescriptions for Sun Dasha vs Saturn Dasha", () => {
    // Chart A: Sun Mahadasha in Leo Lagna
    const sunChart = {
      name: "Solar Executive",
      lagnaRashi: "Leo",
      lagnaNum: 4,
      lagnaLon: 135,
      dashas: [{ planet: "Sun", active: true, start: new Date("2020-01-01"), end: new Date("2026-01-01") }],
      antardasha: [{ planet: "Jupiter", active: true, start: new Date("2025-01-01"), end: new Date("2026-01-01") }],
      planets: {
        Sun: { sign: "Leo", signNum: 5, degree: 14, minutes: 0, house: 1, lon: 134, nakshatra: "Purva Phalguni" },
        Moon: { sign: "Aries", signNum: 1, degree: 12, minutes: 0, house: 9, lon: 12, nakshatra: "Ashwini" },
        Jupiter: { sign: "Sagittarius", signNum: 9, degree: 16, minutes: 0, house: 5, lon: 256, nakshatra: "Purva Ashadha" },
      },
      houseCusps: [
        { house: 1, sign: "Leo", signNum: 5, lon: 135 },
      ]
    } as unknown as ChartData;

    const sunDossier = runAstroVastuHitEngine(sunChart);
    const sunRx = evaluateAstroPrescriptionFormula(sunChart, sunDossier);

    // Active salt should be Jupiter or Sun (NOT Mercury!)
    assert.ok(["Jupiter", "Sun"].includes(sunRx.activeSalt.planet));
    // Blended hex should be Honey Saffron (#F59E0B) or Golden Amber, NOT Lime Green (#84CC16)!
    assert.equal(sunRx.compoundThread.blendedHex, "#F59E0B");
    assert.ok(sunRx.compoundThread.blendedColorName.includes("Honey Saffron"));

    // Chart B: Saturn Mahadasha in Capricorn Lagna
    const saturnChart = {
      name: "Saturnian Architect",
      lagnaRashi: "Capricorn",
      lagnaNum: 9,
      lagnaLon: 280,
      dashas: [{ planet: "Saturn", active: true, start: new Date("2020-01-01"), end: new Date("2039-01-01") }],
      antardasha: [{ planet: "Saturn", active: true, start: new Date("2020-01-01"), end: new Date("2023-01-01") }],
      planets: {
        Saturn: { sign: "Capricorn", signNum: 10, degree: 15, minutes: 0, house: 1, lon: 285, nakshatra: "Shravana" },
        Moon: { sign: "Aries", signNum: 1, degree: 15, minutes: 0, house: 4, lon: 15, nakshatra: "Bharani" },
        Jupiter: { sign: "Taurus", signNum: 2, degree: 15, minutes: 0, house: 5, lon: 45, nakshatra: "Rohini" },
      },
      houseCusps: [
        { house: 1, sign: "Capricorn", signNum: 10, lon: 280 },
      ]
    } as unknown as ChartData;

    const saturnDossier = runAstroVastuHitEngine(saturnChart);
    const saturnRx = evaluateAstroPrescriptionFormula(saturnChart, saturnDossier);

    assert.equal(saturnRx.activeSalt.planet, "Saturn");
    // Blended hex should be Royal Indigo (#1D4ED8), NOT Lime Green (#84CC16)!
    assert.equal(saturnRx.compoundThread.blendedHex, "#1D4ED8");
    assert.ok(saturnRx.compoundThread.blendedColorName.includes("Royal Indigo"));
  });

  it("should generate completely distinct footwear, cap, belt, and mask across all 12 Lagnas", () => {
    const rashiNames = [
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];

    const allAccs = rashiNames.map((rashi, idx) => {
      const chart = {
        name: `${rashi} Native`,
        lagnaRashi: rashi,
        lagnaNum: idx,
        dashas: [{ planet: "Jupiter", active: true, start: new Date("2024-01-01"), end: new Date("2036-01-01") }],
        planets: {
          Jupiter: { sign: rashi, signNum: idx + 1, degree: 15, minutes: 0, house: 1, lon: idx * 30 + 15 },
          Moon: { sign: "Aries", signNum: 1, degree: 10, minutes: 0, house: 1, lon: 10, nakshatra: "Ashwini" },
        }
      } as unknown as ChartData;
      return evaluateDailyAccessories(chart);
    });

    // Check that footwear mechanism mentions different 12th house signs
    const footMechanisms = allAccs.map(a => a.footwear.planetaryMechanism);
    assert.equal(new Set(footMechanisms).size, 12, "All 12 Lagnas must have unique footwear mechanisms");

    // Check that belt buckle metals are tailored to 7th houses
    const beltBuckles = allAccs.map(a => a.belt.buckleMetal);
    assert.ok(beltBuckles.some(b => b.includes("सिल्वर")));
    assert.ok(beltBuckles.some(b => b.includes("ब्रास") || b.includes("पीतल")));
    assert.ok(beltBuckles.some(b => b.includes("स्टील")));

    // Check that face mask fabrics and mechanisms are tailored
    const maskMechanisms = allAccs.map(a => a.faceMask.planetaryMechanism);
    assert.equal(new Set(maskMechanisms).size, 12, "All 12 Lagnas must have unique face mask mechanisms");
  });

  it("should accurately resolve Hindi and Sanskrit lagna names without defaulting to Aries", () => {
    const hindiChart = {
      name: "मिथुन जातक",
      lagnaRashi: "मिथुन",
      dashas: [{ planet: "Mercury", active: true, start: new Date("2024-01-01"), end: new Date("2030-01-01") }],
      planets: {
        Mercury: { sign: "Gemini", signNum: 3, degree: 10, minutes: 0, house: 1, lon: 70 },
      }
    } as unknown as ChartData;

    const acc = evaluateDailyAccessories(hindiChart);
    // Gemini 3rd house is Leo (Sun) -> Amber Gold, Copper Tan
    assert.ok(acc.phoneCover.recommendedColors.some(c => c.includes("Amber Gold") || c.includes("Copper Tan")));
    // Gemini 12th house is Taurus (Venus) -> Ivory Cream
    assert.ok(acc.footwear.recommendedColors.some(c => c.includes("Ivory Cream")));

    const sanskritChart = {
      name: "Kanya Native",
      lagnaRashi: "Kanya",
      dashas: [{ planet: "Mercury", active: true, start: new Date("2024-01-01"), end: new Date("2030-01-01") }],
      planets: {
        Mercury: { sign: "Virgo", signNum: 6, degree: 10, minutes: 0, house: 1, lon: 160 },
      }
    } as unknown as ChartData;

    const accKanya = evaluateDailyAccessories(sanskritChart);
    // Virgo 3rd house is Scorpio (Mars) -> Terracotta Tan
    assert.ok(accKanya.phoneCover.recommendedColors.some(c => c.includes("Terracotta Tan")));
    // Virgo 12th house is Leo (Sun) -> Golden Amber
    assert.ok(accKanya.footwear.recommendedColors.some(c => c.includes("Golden Amber")));
  });
});
