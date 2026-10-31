// src/lib/astro-engine/__tests__/navtara-problem-solver.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateLifeProblemNavtaraDossier } from "../navtara-problem-solver";
import type { ChartData } from "../calculations";

describe("Navtara 6-Life Problem Solver Engine", () => {
  const mockChart: ChartData = {
    name: "Mukul",
    dob: "1995-07-04",
    tob: "12:34",
    city: "Delhi",
    lat: 28.6139,
    lon: 77.209,
    tz: 5.5,
    jd: 2449903.79,
    lagnaLon: 169.44, // Virgo
    lagnaRashi: "Virgo",
    lagnaNum: 5, // 0-indexed: Virgo is 5
    houseSystem: "degree-equal-bhava",
    houseCusps: [],
    planets: {
      Sun: { lon: 78, sign: "Gemini", signNum: 2, degree: 18, minutes: 4, house: 10, rashiHouse: 10, bhavaHouse: 10, bhavaShift: 0, bhavaNote: "", nakshatra: "Ardra", nakshatraLord: "Rahu", pada: 4, retrograde: false, dignity: "Normal", navamsha: "Pisces" },
      Moon: { lon: 149, sign: "Leo", signNum: 4, degree: 29, minutes: 13, house: 12, rashiHouse: 12, bhavaHouse: 12, bhavaShift: 0, bhavaNote: "", nakshatra: "Uttara Phalguni", nakshatraLord: "Sun", pada: 1, retrograde: false, dignity: "Normal", navamsha: "Sagittarius" },
      Mars: { lon: 146, sign: "Leo", signNum: 4, degree: 26, minutes: 24, house: 12, rashiHouse: 12, bhavaHouse: 12, bhavaShift: 0, bhavaNote: "", nakshatra: "Purva Phalguni", nakshatraLord: "Venus", pada: 4, retrograde: false, dignity: "Normal", navamsha: "Scorpio" },
      Mercury: { lon: 56, sign: "Taurus", signNum: 1, degree: 26, minutes: 54, house: 9, rashiHouse: 9, bhavaHouse: 9, bhavaShift: 0, bhavaNote: "", nakshatra: "Mrigashira", nakshatraLord: "Mars", pada: 2, retrograde: false, dignity: "Friend", navamsha: "Virgo" },
      Jupiter: { lon: 223, sign: "Scorpio", signNum: 7, degree: 13, minutes: 2, house: 3, rashiHouse: 3, bhavaHouse: 3, bhavaShift: 0, bhavaNote: "", nakshatra: "Anuradha", nakshatraLord: "Saturn", pada: 4, retrograde: true, dignity: "Friend", navamsha: "Scorpio" },
      Venus: { lon: 65, sign: "Gemini", signNum: 2, degree: 5, minutes: 1, house: 10, rashiHouse: 10, bhavaHouse: 10, bhavaShift: 0, bhavaNote: "", nakshatra: "Mrigashira", nakshatraLord: "Mars", pada: 4, retrograde: false, dignity: "Friend", navamsha: "Scorpio" },
      Saturn: { lon: 330, sign: "Pisces", signNum: 11, degree: 0, minutes: 57, house: 7, rashiHouse: 7, bhavaHouse: 7, bhavaShift: 0, bhavaNote: "", nakshatra: "Purva Bhadrapada", nakshatraLord: "Jupiter", pada: 4, retrograde: false, dignity: "Neutral", navamsha: "Cancer" },
      Rahu: { lon: 188, sign: "Libra", signNum: 6, degree: 8, minutes: 13, house: 2, rashiHouse: 2, bhavaHouse: 2, bhavaShift: 0, bhavaNote: "", nakshatra: "Swati", nakshatraLord: "Rahu", pada: 1, retrograde: true, dignity: "Exalted", navamsha: "Sagittarius" },
      Ketu: { lon: 8, sign: "Aries", signNum: 0, degree: 8, minutes: 13, house: 8, rashiHouse: 8, bhavaHouse: 8, bhavaShift: 0, bhavaNote: "", nakshatra: "Ashwini", nakshatraLord: "Ketu", pada: 3, retrograde: true, dignity: "Exalted", navamsha: "Gemini" },
    },
    dashas: [{ planet: "Rahu", active: true, start: new Date(), end: new Date(), yrs: 18 }],
    antardasha: [{ planet: "Mercury", active: true, start: new Date(), end: new Date(), yrs: 3 }],
  };

  it("evaluates exactly 6 Life Problem Domains", () => {
    const report = evaluateLifeProblemNavtaraDossier(mockChart, "Rahu", "Mercury");
    assert.equal(report.problems.length, 6);
    const ids = report.problems.map((p) => p.id);
    assert.deepEqual(ids, ["marriage", "career", "health", "wealth", "children", "mental_peace"]);
  });

  it("calculates 3 Atimitra stars (Paryayas 1, 2, 3) for each problem karyesh", () => {
    const report = evaluateLifeProblemNavtaraDossier(mockChart, "Rahu", "Mercury");
    for (const prob of report.problems) {
      assert.equal(prob.karyeshAtimitraStars.length, 3);
      assert.equal(prob.karyeshAtimitraStars[0].paryaya, "Prathama");
      assert.equal(prob.karyeshAtimitraStars[1].paryaya, "Dvitiya");
      assert.equal(prob.karyeshAtimitraStars[2].paryaya, "Tritiya");
    }
  });

  it("computes Marriage karyesh as Jupiter for Virgo Lagna", () => {
    const report = evaluateLifeProblemNavtaraDossier(mockChart, "Rahu", "Mercury");
    const marriage = report.problems.find((p) => p.id === "marriage")!;
    assert.equal(marriage.karyeshLord, "Jupiter");
    assert.equal(marriage.houseSign, "Pisces");
    assert.ok(marriage.dashaContext.bridgeStar);
    assert.ok(marriage.actionableRemedy.deityUpasana.length > 0);
  });

  it("generates comprehensive summary with most promising and care domains", () => {
    const report = evaluateLifeProblemNavtaraDossier(mockChart, "Rahu", "Mercury");
    assert.ok(report.summary.mostPromisingArea);
    assert.ok(report.summary.areaNeedingCare);
    assert.ok(report.summary.activeDashaLabel.includes("महादशा"));
  });
});

