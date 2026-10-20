// src/lib/astro-engine/__tests__/astro-vastu-hit-engine.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateCompoundDegree,
  check358Hit,
  runAstroVastuHitEngine,
  ASTRO_VASTU_SIGN_DIRECTIONS,
  SIGN_BODY_PART_MAPPINGS,
  HIT_DEFINITIONS,
} from "../astro-vastu-hit-engine";
import type { ChartData } from "../calculations";

describe("Astro-Vastu Hit Theory Computational Engine", () => {
  // ── 1. COMPOUND DEGREE TESTS ──────────────────────────────────────────────
  describe("Compound Degree Calculations", () => {
    it("should compute exact compound degrees using starting degrees", () => {
      // Aries: 0° base
      assert.equal(calculateCompoundDegree(1, 0), 0);
      assert.equal(calculateCompoundDegree(1, 25), 25);

      // Gemini: 60° base
      assert.equal(calculateCompoundDegree(3, 29), 89);

      // Sagittarius: 240° base
      assert.equal(calculateCompoundDegree(9, 25), 265);

      // Pisces: 330° base
      assert.equal(calculateCompoundDegree(12, 1.91), 331.91);

      // Scorpio: 210° base
      assert.equal(calculateCompoundDegree(8, 14), 224);
    });
  });

  // ── 2. "3 - 5 - 8" RULE ORB TESTS ─────────────────────────────────────────
  describe("The 3-5-8 Rule Orb Boundaries", () => {
    it("should evaluate 45° Bad Hit within ±3° [42° to 48°]", () => {
      assert.equal(check358Hit(0, 41.9), null);
      assert.equal(check358Hit(0, 42.0)?.hitDef.angle, 45);
      assert.equal(check358Hit(0, 45.0)?.hitDef.angle, 45);
      assert.equal(check358Hit(0, 48.0)?.hitDef.angle, 45);
      assert.equal(check358Hit(0, 48.1), null);
    });

    it("should evaluate 90° Dangerous Hit within ±5° [85° to 95°]", () => {
      assert.equal(check358Hit(0, 84.9), null);
      assert.equal(check358Hit(0, 85.0)?.hitDef.angle, 90);
      assert.equal(check358Hit(0, 90.0)?.hitDef.angle, 90);
      assert.equal(check358Hit(0, 95.0)?.hitDef.angle, 90);
      assert.equal(check358Hit(0, 95.1), null);
    });

    it("should evaluate 180° Killer Hit within ±8° [172° to 188°]", () => {
      assert.equal(check358Hit(0, 171.9), null);
      assert.equal(check358Hit(0, 172.0)?.hitDef.angle, 180);
      assert.equal(check358Hit(0, 180.0)?.hitDef.angle, 180);
      assert.equal(check358Hit(0, 188.0)?.hitDef.angle, 180);
      assert.equal(check358Hit(0, 188.1), null);
    });

    it("should evaluate 120° Protective Shield within ±8° [112° to 128°]", () => {
      assert.equal(check358Hit(0, 111.9), null);
      assert.equal(check358Hit(0, 112.0)?.hitDef.angle, 120);
      assert.equal(check358Hit(0, 120.0)?.hitDef.angle, 120);
      assert.equal(check358Hit(0, 128.0)?.hitDef.angle, 120);
      assert.equal(check358Hit(0, 128.1), null);
    });
  });

  // ── 3. SIGN TO DIRECTION & BODY PART MAPPING ──────────────────────────────
  describe("Sign to Direction & Body Parts", () => {
    it("should match authentic Astro-Vastu sign directions", () => {
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[1].direction, "East");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[2].direction, "North-West");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[3].direction, "North-North-West");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[4].direction, "North-East");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[5].direction, "East-North-East");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[6].direction, "North");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[7].direction, "West-South-West");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[8].direction, "South-South-West");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[9].direction, "North-East");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[10].direction, "South");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[11].direction, "West");
      assert.equal(ASTRO_VASTU_SIGN_DIRECTIONS[12].direction, "South-East");
    });

    it("should correctly map 12 signs to human body parts for dot therapy", () => {
      assert.equal(SIGN_BODY_PART_MAPPINGS[1].bodyPartEn, "Head & Face");
      assert.equal(SIGN_BODY_PART_MAPPINGS[6].bodyPartHi, "नाभि एवं नाभि के 2 इंच का क्षेत्र");
      assert.equal(SIGN_BODY_PART_MAPPINGS[10].bodyPartHi, "घुटने (स्त्री बायां, पुरुष दायां)");
      assert.equal(SIGN_BODY_PART_MAPPINGS[12].bodyPartEn, "Feet & Soles");
    });
  });

  // ── 4. LECTURE CASE STUDY 1: PRIYANKA JI (Mars 180° Killer Hit) ───────────
  describe("Case Study 1: Priyanka Ji (Mars 180° Hit on Lagna from Sagittarius)", () => {
    it("should detect Mars 180° Killer Hit on Gemini Lagna", () => {
      const priyankaChart = {
        name: "Priyanka",
        dob: "1998-02-04",
        tob: "16:46:00",
        city: "Solapur",
        lagnaRashi: "Gemini",
        lagnaNum: 3,
        lagnaLon: 89.0, // 29° Gemini -> compound: 60 + 29 = 89°
        dashas: [{ planet: "Mars", active: true, start: new Date("2024-01-01"), end: new Date("2031-01-01") }],
        planets: {
          Mars: {
            sign: "Sagittarius",
            signNum: 9,
            degree: 25,
            minutes: 0,
            house: 7,
            lon: 265,
            nakshatra: "Mula",
            nakshatraLord: "Ketu",
          },
        },
        houseCusps: [
          { house: 1, sign: "Gemini", signNum: 3, degree: 29, minutes: 0, lon: 89 },
        ],
      } as unknown as ChartData;

      const dossier = runAstroVastuHitEngine(priyankaChart);
      assert.ok(dossier);

      // Difference = 265 - 89 = 176° -> Falls into 180° Killer Hit (172° to 188°)
      const killerHit = dossier.killerHits180.find(h => h.sourceName === "Mars" && h.targetHouse === 1);
      assert.ok(killerHit, "Must detect 180° Killer Hit on House 1 (Lagna)");
      assert.equal(killerHit.exactDiff, 176);
      assert.equal(killerHit.orbDistance, 4);
    });
  });

  // ── 5. LECTURE CASE STUDY 2: SHIVANGI JI (Saturn 180° Hit on 7th House) ────
  describe("Case Study 2: Shivangi Ji (Saturn 180° Hit on 7th House from Scorpio)", () => {
    it("should detect Saturn 180° Killer Hit on Taurus 7th House and recommend Knee dot shifting", () => {
      const shivangiChart = {
        name: "Shivangi",
        dob: "1986-05-02",
        tob: "20:05:00",
        city: "Delhi",
        lagnaRashi: "Scorpio",
        lagnaNum: 8,
        lagnaLon: 224, // 14° Scorpio
        dashas: [{ planet: "Saturn", active: true, start: new Date("2020-01-01"), end: new Date("2039-01-01") }],
        planets: {
          Saturn: {
            sign: "Scorpio",
            signNum: 8,
            degree: 14,
            minutes: 0,
            house: 1,
            lon: 224,
            nakshatra: "Anuradha",
            nakshatraLord: "Saturn",
          },
        },
        houseCusps: [
          { house: 7, sign: "Taurus", signNum: 2, degree: 14, minutes: 0, lon: 44 },
        ],
      } as unknown as ChartData;

      const dossier = runAstroVastuHitEngine(shivangiChart);
      assert.ok(dossier);

      // Difference = 224 - 44 = 180° exact Killer Hit on 7th House
      const saturn7thHit = dossier.killerHits180.find(h => h.sourceName === "Saturn" && h.targetHouse === 7);
      assert.ok(saturn7thHit, "Must detect exact 180° Killer Hit on House 7");
      assert.equal(saturn7thHit.exactDiff, 180);

      // Check shifting prescription
      const shift = dossier.shiftingPrescriptions.find(s => s.problematicPlanet === "Saturn");
      assert.ok(shift, "Must provide shifting prescription for Saturn");
    });
  });

  // ── 6. REAL USER AUDIT: MUKUL'S CHART ──────────────────────────────────────
  describe("Mukul's Real Chart Audit", () => {
    it("should detect Traffic Police (Mars & Saturn) blocking Mercury Antardasha lord", () => {
      const mukulChart = {
        name: "Mukul Pal",
        dob: "1995-07-04",
        tob: "12:30:00",
        city: "Delhi",
        lagnaRashi: "Virgo",
        lagnaNum: 6,
        lagnaLon: 168.58,
        dashas: [{ planet: "Rahu", active: true, start: new Date("2017-05-14"), end: new Date("2035-05-14") }],
        antardasha: [{ planet: "Mercury", active: true, start: new Date("2025-04-26"), end: new Date("2027-11-13") }],
        planets: {
          Sun: { sign: "Gemini", signNum: 3, degree: 18, minutes: 4, house: 10, lon: 78.07, nakshatra: "Ardra", nakshatraLord: "Rahu" },
          Moon: { sign: "Leo", signNum: 5, degree: 29, minutes: 12, house: 12, lon: 149.20, nakshatra: "Uttara Phalguni", nakshatraLord: "Sun" },
          Mars: { sign: "Leo", signNum: 5, degree: 26, minutes: 15, house: 12, lon: 146.26, nakshatra: "Purva Phalguni", nakshatraLord: "Venus" },
          Mercury: { sign: "Taurus", signNum: 2, degree: 27, minutes: 43, house: 9, lon: 57.71, nakshatra: "Mrigashira", nakshatraLord: "Mars" },
          Jupiter: { sign: "Scorpio", signNum: 8, degree: 13, minutes: 16, house: 3, lon: 223.26, nakshatra: "Anuradha", nakshatraLord: "Saturn" },
          Venus: { sign: "Gemini", signNum: 3, degree: 5, minutes: 1, house: 10, lon: 65.01, nakshatra: "Mrigashira", nakshatraLord: "Mars" },
          Saturn: { sign: "Pisces", signNum: 12, degree: 1, minutes: 55, house: 7, lon: 331.91, nakshatra: "Purva Bhadrapada", nakshatraLord: "Jupiter" },
          Rahu: { sign: "Libra", signNum: 7, degree: 8, minutes: 13, house: 2, lon: 188.22, nakshatra: "Swati", nakshatraLord: "Rahu" },
          Ketu: { sign: "Aries", signNum: 1, degree: 8, minutes: 13, house: 8, lon: 8.22, nakshatra: "Ashwini", nakshatraLord: "Ketu" },
        },
      } as unknown as ChartData;

      const dossier = runAstroVastuHitEngine(mukulChart, new Date("2026-10-20"));
      assert.ok(dossier);

      // Traffic Police: Mars and Saturn hitting Mercury AD Lord with 90°
      const policeBlockers = dossier.trafficPoliceBlockades.map(b => b.blockingPlanet);
      assert.ok(policeBlockers.includes("Mars"), "Mars must be identified as blocking Traffic Police");
      assert.ok(policeBlockers.includes("Saturn"), "Saturn must be identified as blocking Traffic Police");

      // Verify Sun 180° Killer Hit on House 4
      const sunHitHouse4 = dossier.killerHits180.find(h => h.sourceName === "Sun" && h.targetHouse === 4);
      assert.ok(sunHitHouse4, "Sun in 10th must cast 180° Killer Hit on 4th House");

      // Verify Shifting Prescriptions now include blockers Mars, Saturn, and Sun!
      const shiftedPlanets = dossier.shiftingPrescriptions.map(s => s.problematicPlanet);
      assert.ok(shiftedPlanets.includes("Mars"), "Must prescribe shifting for blocking planet Mars");
      assert.ok(shiftedPlanets.includes("Saturn"), "Must prescribe shifting for blocking planet Saturn");
      assert.ok(shiftedPlanets.includes("Sun"), "Must prescribe shifting for Sun hitting 4th house");
    });
  });

  // ── 7. REAL USER AUDIT: MANISHA'S CHART ────────────────────────────────────
  describe("Manisha's Real Chart Audit", () => {
    it("should detect 5-planet Scorpio cluster in SSW and Mars MD 180° Hit on 4th House", () => {
      const manishaChart = {
        name: "Manisha",
        dob: "1993-12-06",
        tob: "12:30:00",
        city: "Delhi",
        lagnaRashi: "Aquarius",
        lagnaNum: 11,
        lagnaLon: 318.25,
        dashas: [{ planet: "Mars", active: true, start: new Date("2026-06-27"), end: new Date("2033-06-26") }],
        antardasha: [{ planet: "Mars", active: true, start: new Date("2026-06-27"), end: new Date("2026-11-23") }],
        planets: {
          Sun: { sign: "Scorpio", signNum: 8, degree: 20, minutes: 24, house: 10, lon: 230.40, nakshatra: "Jyeshtha", nakshatraLord: "Mercury" },
          Moon: { sign: "Leo", signNum: 5, degree: 15, minutes: 37, house: 7, lon: 135.62, nakshatra: "Purva Phalguni", nakshatraLord: "Venus" },
          Mars: { sign: "Scorpio", signNum: 8, degree: 25, minutes: 57, house: 10, lon: 235.95, nakshatra: "Jyeshtha", nakshatraLord: "Mercury" },
          Mercury: { sign: "Scorpio", signNum: 8, degree: 5, minutes: 6, house: 10, lon: 215.10, nakshatra: "Anuradha", nakshatraLord: "Saturn" },
          Jupiter: { sign: "Libra", signNum: 7, degree: 11, minutes: 30, house: 9, lon: 191.50, nakshatra: "Swati", nakshatraLord: "Rahu" },
          Venus: { sign: "Scorpio", signNum: 8, degree: 10, minutes: 22, house: 10, lon: 220.37, nakshatra: "Anuradha", nakshatraLord: "Saturn" },
          Saturn: { sign: "Aquarius", signNum: 11, degree: 1, minutes: 9, house: 1, lon: 301.15, nakshatra: "Dhanishtha", nakshatraLord: "Mars" },
          Rahu: { sign: "Scorpio", signNum: 8, degree: 8, minutes: 41, house: 10, lon: 218.68, nakshatra: "Anuradha", nakshatraLord: "Saturn" },
          Ketu: { sign: "Taurus", signNum: 2, degree: 8, minutes: 41, house: 4, lon: 38.68, nakshatra: "Krittika", nakshatraLord: "Sun" },
        },
      } as unknown as ChartData;

      const dossier = runAstroVastuHitEngine(manishaChart, new Date("2026-10-20"));
      assert.ok(dossier);

      // Verify active Dasha is Mars
      assert.equal(dossier.activeDasha.mahadasha, "Mars");

      // Verify Mars 180° Killer Hit on House 4 (Taurus)
      const marsHit4 = dossier.killerHits180.find(h => h.sourceName === "Mars" && h.targetHouse === 4);
      assert.ok(marsHit4, "Mars in 10th must cast 180° Hit on 4th House");

      // Verify Moon 180° Killer Hit on Lagna (House 1)
      const moonHitLagna = dossier.killerHits180.find(h => h.sourceName === "Moon" && h.targetHouse === 1);
      assert.ok(moonHitLagna, "Moon in 7th must cast 180° Hit on Lagna (House 1)");

      // Verify SSW Generic Vastu Conflict flagged
      const sswConflict = dossier.genericVastuConflicts.find(c => c.zoneCode === "SSW");
      assert.ok(sswConflict, "Must flag CRITICAL conflict for SSW zone because Scorpio holds 5 planets in 10th house");
      assert.equal(sswConflict.dangerLevel, "CRITICAL");
    });
  });

  // ── 8. 100% DYNAMIC CHART-DRIVEN BODY PART THERAPY MATRIX ──────────────────
  describe("100% Dynamic Chart-Driven 12-Sign Body Part Matrix", () => {
    it("should compute dynamic houses, occupants, and thread verdicts for Mukul (Virgo Lagna)", () => {
      const mukulChart = {
        name: "Mukul Pal",
        dob: "1995-07-04",
        tob: "12:30:00",
        city: "Delhi",
        lagnaRashi: "Virgo",
        lagnaNum: 6,
        lagnaLon: 168.58,
        dashas: [{ planet: "Rahu", active: true, start: new Date("2017-05-14"), end: new Date("2035-05-14") }],
        antardasha: [{ planet: "Mercury", active: true, start: new Date("2025-04-26"), end: new Date("2027-11-13") }],
        planets: {
          Sun: { sign: "Gemini", signNum: 3, degree: 18, minutes: 4, house: 10, lon: 78.07, nakshatra: "Ardra", nakshatraLord: "Rahu" },
          Moon: { sign: "Leo", signNum: 5, degree: 29, minutes: 12, house: 12, lon: 149.20, nakshatra: "Uttara Phalguni", nakshatraLord: "Sun" },
          Mars: { sign: "Leo", signNum: 5, degree: 26, minutes: 15, house: 12, lon: 146.26, nakshatra: "Purva Phalguni", nakshatraLord: "Venus" },
          Mercury: { sign: "Taurus", signNum: 2, degree: 27, minutes: 43, house: 9, lon: 57.71, nakshatra: "Mrigashira", nakshatraLord: "Mars" },
          Jupiter: { sign: "Scorpio", signNum: 8, degree: 13, minutes: 16, house: 3, lon: 223.26, nakshatra: "Anuradha", nakshatraLord: "Saturn" },
          Venus: { sign: "Gemini", signNum: 3, degree: 5, minutes: 1, house: 10, lon: 65.01, nakshatra: "Mrigashira", nakshatraLord: "Mars" },
          Saturn: { sign: "Pisces", signNum: 12, degree: 1, minutes: 55, house: 7, lon: 331.91, nakshatra: "Purva Bhadrapada", nakshatraLord: "Jupiter" },
          Rahu: { sign: "Libra", signNum: 7, degree: 8, minutes: 13, house: 2, lon: 188.22, nakshatra: "Swati", nakshatraLord: "Rahu" },
          Ketu: { sign: "Aries", signNum: 1, degree: 8, minutes: 13, house: 8, lon: 8.22, nakshatra: "Ashwini", nakshatraLord: "Ketu" },
        },
      } as unknown as ChartData;

      const dossier = runAstroVastuHitEngine(mukulChart, new Date("2026-10-20"));
      assert.ok(dossier.bodyPartRemedyRegistry);
      assert.equal(dossier.bodyPartRemedyRegistry.length, 12, "Must contain all 12 signs");

      // Sign 1 (Aries - Head): Should be 8th house for Virgo lagna
      const ariesRow = dossier.bodyPartRemedyRegistry.find(r => r.signNum === 1);
      assert.ok(ariesRow);
      assert.equal(ariesRow.houseNum, 8);
      assert.ok(ariesRow.isThreadHarmful, "Dusthana 8th house must mark thread as harmful");
      assert.ok(ariesRow.planetsInSign.some(p => p.name === "Ketu"));

      // Sign 2 (Taurus - Throat): 9th house, houses Mercury (active Antardasha Lord)
      const taurusRow = dossier.bodyPartRemedyRegistry.find(r => r.signNum === 2);
      assert.ok(taurusRow);
      assert.equal(taurusRow.houseNum, 9);
      const mercuryOccupant = taurusRow.planetsInSign.find(p => p.name === "Mercury");
      assert.ok(mercuryOccupant);
      assert.equal(mercuryOccupant.isDashaLord, true, "Mercury must be marked as active Dasha Lord");

      // Sign 3 (Gemini - Arms/Wrists): 10th house, houses Sun and Venus
      const geminiRow = dossier.bodyPartRemedyRegistry.find(r => r.signNum === 3);
      assert.ok(geminiRow);
      assert.equal(geminiRow.houseNum, 10);
      assert.equal(geminiRow.planetsInSign.length, 2, "Gemini must have 2 planets (Sun, Venus)");

      // Sign 12 (Pisces - Feet & Soles): MUST BE 7th house for Virgo Lagna!
      const piscesRow = dossier.bodyPartRemedyRegistry.find(r => r.signNum === 12);
      assert.ok(piscesRow);
      assert.equal(piscesRow.houseNum, 7, "Pisces (Sign 12) MUST be 7th House for Virgo Lagna!");
      assert.equal(piscesRow.isThreadHarmful, false, "House 7 is a Kendra house, not Dusthana");
      assert.ok(piscesRow.planetsInSign.some(p => p.name === "Saturn"), "Pisces holds Saturn");

      // Every item must have authentic dot substance and non-empty guidance
      for (const row of dossier.bodyPartRemedyRegistry) {
        assert.ok(row.dotSubstance.length > 0, `Sign ${row.signNum} dot substance must not be empty`);
        assert.ok(row.dotApplicationRules.length > 0, `Sign ${row.signNum} rules must not be empty`);
        assert.ok(row.threadVerdict.length > 0, `Sign ${row.signNum} thread verdict must not be empty`);
        assert.ok(row.statusVerdict.badgeText.length > 0, `Sign ${row.signNum} badge must not be empty`);
      }
    });

    it("should correctly resolve house 7 for Pisces when chart comes from calculateChart (0-indexed lagnaNum)", () => {
      // When chart has lagnaRashi: "Virgo", lagnaNum: 5 (0-indexed from dR), and houseCusps with signNum 0..11
      const chartWith0Indexed = {
        name: "Mukul Calc Chart",
        lagnaRashi: "Virgo",
        lagnaNum: 5, // 0-indexed Virgo from calculations.ts
        planets: {
          Saturn: { sign: "Pisces", signNum: 11, degree: 1, minutes: 55, house: 7 },
        },
        houseCusps: [
          { house: 1, sign: "Virgo", signNum: 5 },
          { house: 2, sign: "Libra", signNum: 6 },
          { house: 3, sign: "Scorpio", signNum: 7 },
          { house: 4, sign: "Sagittarius", signNum: 8 },
          { house: 5, sign: "Capricorn", signNum: 9 },
          { house: 6, sign: "Aquarius", signNum: 10 },
          { house: 7, sign: "Pisces", signNum: 11 },
          { house: 8, sign: "Aries", signNum: 0 },
          { house: 9, sign: "Taurus", signNum: 1 },
          { house: 10, sign: "Gemini", signNum: 2 },
          { house: 11, sign: "Cancer", signNum: 3 },
          { house: 12, sign: "Leo", signNum: 4 },
        ],
      } as unknown as ChartData;

      const dossier = runAstroVastuHitEngine(chartWith0Indexed);
      assert.ok(dossier);
      const piscesRow = dossier.bodyPartRemedyRegistry.find(r => r.signNum === 12);
      assert.ok(piscesRow);
      assert.equal(piscesRow.houseNum, 7, "Pisces MUST be resolved to House 7 even with 0-indexed input");
      assert.equal(piscesRow.houseNameHi, "सप्तम भाव (दांपत्य, साझेदारी व पेल्विक)");
      assert.equal(piscesRow.isThreadHarmful, false);
    });

    it("should synthesize critical hit status for afflicted body parts in Priyanka Ji's chart", () => {
      const priyankaChart = {
        name: "Priyanka",
        dob: "1994-11-28",
        tob: "18:45:00",
        city: "Delhi",
        lagnaRashi: "Gemini",
        lagnaNum: 3,
        lagnaLon: 89,
        dashas: [{ planet: "Mars", active: true, start: new Date("2020-01-01"), end: new Date("2027-01-01") }],
        planets: {
          Mars: {
            sign: "Sagittarius",
            signNum: 9,
            degree: 29,
            minutes: 0,
            house: 7,
            lon: 269,
            nakshatra: "Uttara Ashadha",
            nakshatraLord: "Sun",
          },
        },
        houseCusps: [
          { house: 1, sign: "Gemini", signNum: 3, degree: 29, minutes: 0, lon: 89 },
          { house: 7, sign: "Sagittarius", signNum: 9, degree: 29, minutes: 0, lon: 269 },
        ],
      } as unknown as ChartData;

      const dossier = runAstroVastuHitEngine(priyankaChart);
      const geminiRow = dossier.bodyPartRemedyRegistry.find(r => r.signNum === 3);
      assert.ok(geminiRow);
      assert.equal(geminiRow.houseNum, 1, "Gemini is Lagna for Priyanka");
      assert.equal(geminiRow.statusVerdict.statusType, "critical_hit", "Must detect Mars 180° killer hit on Gemini");
      assert.ok(geminiRow.statusVerdict.badgeText.includes("180°"), "Badge must display 180° hit");
    });
  });
});


