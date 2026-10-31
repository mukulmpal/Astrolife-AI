import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateOuterPlanet,
  calculateProgressions,
  calculateProgressedArc,
  evaluateMotionState,
  calculateAlgebraicEventTiming,
  getTripleTransitStage,
  getHousePlacementWithBuffer,
  computeNatalOuterPlanets,
  computeD9OuterPlanets,
  OUTER_PLANETS_CONFIG,
  PLANETARY_COMBINATIONS_KB,
} from "../outer-planets-engine";

test("Outer Planets Engine — correctly maps Hindi names as INDRA, VARUN, YAM", () => {
  assert.equal(OUTER_PLANETS_CONFIG.URANUS.hindiName, "INDRA");
  assert.equal(OUTER_PLANETS_CONFIG.URANUS.devanagariName, "इंद्र");

  assert.equal(OUTER_PLANETS_CONFIG.NEPTUNE.hindiName, "VARUN");
  assert.equal(OUTER_PLANETS_CONFIG.NEPTUNE.devanagariName, "वरुण");

  assert.equal(OUTER_PLANETS_CONFIG.PLUTO.hindiName, "YAM");
  assert.equal(OUTER_PLANETS_CONFIG.PLUTO.devanagariName, "यम");
});

test("Outer Planets Engine — calculates Progressions by Averages & Symbolic Directions", () => {
  const natal = {
    Sun: 10.0,
    Moon: 40.0,
    URANUS: 100.0,
    NEPTUNE: 150.0,
    PLUTO: 200.0,
  };
  const natalMC = 270.0;
  const elapsedYears = 30;

  const res = calculateProgressions(natal, natalMC, elapsedYears);

  // 1. Symbolic directions: exactly +30°
  assert.equal(res.symbolicDirections.Sun, 40.0);
  assert.equal(res.symbolicDirections.Moon, 70.0);

  // 2. Progressed MC: 30 * (59' 8.17") ≈ 29.568° offset -> 270 + 29.568 = 299.568°
  assert.ok(Math.abs(res.progressedMC - 299.568) < 0.05);

  // 3. Progression by Averages
  const uranusArc50Yrs = calculateProgressedArc("URANUS", 50);
  assert.ok(Math.abs(uranusArc50Yrs - 0.58625) < 0.001);
});

test("Outer Planets Engine — detects Stationary and Retrograde motion states", () => {
  const sunLon = 0;
  // Ephemeris daily speed override
  const stationaryState = evaluateMotionState("URANUS", 100, sunLon, 0.0005);
  assert.equal(stationaryState, "STATIONARY");

  const retroState = evaluateMotionState("URANUS", 100, sunLon, -0.015);
  assert.equal(retroState, "RETROGRADE");

  // Elongation triggers (Uranus trigger at 257° and 103°)
  const retroByAngle = evaluateMotionState("URANUS", 280, sunLon);
  assert.equal(retroByAngle, "RETROGRADE");

  const stationByAngle = evaluateMotionState("URANUS", 257.5, sunLon);
  assert.equal(stationByAngle, "STATIONARY");
});

test("Outer Planets Engine — Decanate Vibration Boost", () => {
  // INDRA in Taurus (Sign 2), 1st Decanate (0° to 10°) has Decanate boost
  const tropicalLon = 29; // Taurus 5 deg sidereal when ayanamsa=24
  const ayanamsa = 24;   // 29 - 24 = 5 deg Aries (Rashi 1, no boost)
  const res1 = evaluateOuterPlanet("URANUS", tropicalLon, ayanamsa, 1, {}, 180, "sidereal");
  assert.equal(res1.hasSepharialVibrationBoost, false);

  // In Taurus 5 deg sidereal: tropicalLon = 35 + 24 = 59 deg
  const res2 = evaluateOuterPlanet("URANUS", 59, 24, 1, {}, 180, "sidereal");
  assert.equal(res2.rashiIndex, 2); // Taurus
  assert.equal(res2.decanate, 1);
  assert.equal(res2.hasSepharialVibrationBoost, true);
});

test("Outer Planets Engine — Stationary Multiplier (EXTREME_STATIONARY_PEAK) on tight orb", () => {
  // Transiting YAM (Pluto) at 200° over Natal Sun at 200.4° (0.4° orb, <= 1°)
  // Daily speed = 0.001 (Stationary)
  const natal = { Sun: 200.4 };
  const res = evaluateOuterPlanet("PLUTO", 200, 0, 1, natal, 90, "tropical", undefined, 0.001);

  assert.equal(res.activeTransits.length, 1);
  assert.equal(res.activeTransits[0].intensity, "EXTREME_STATIONARY_PEAK");
  assert.equal(res.activeTransits[0].natalPoint, "Sun");
  assert.ok(res.activeTransits[0].combinationInsight);
  assert.ok(res.activeTransits[0].combinationInsight?.gift.includes("Laser focus"));
});

test("Outer Planets Engine — Algebraic Event Timing", () => {
  // Two transits: one applying (-0.4°), one separating (+0.35°)
  const timing = calculateAlgebraicEventTiming([-0.4, 0.35]);
  assert.ok(Math.abs(timing.algebraicSumDeg - (-0.05)) < 0.001);
  assert.equal(timing.isEventPeakWindow, true);

  // Far from peak
  const farTiming = calculateAlgebraicEventTiming([-2.5, -1.8]);
  assert.equal(farTiming.isEventPeakWindow, false);
});

test("Outer Planets Engine — Triple Transit Retrograde Loop State Machine", () => {
  const p1 = getTripleTransitStage(1, "DIRECT");
  assert.equal(p1.stage, "PASS_1_INITIATION");

  const p2 = getTripleTransitStage(2, "RETROGRADE");
  assert.equal(p2.stage, "PASS_2_CRISIS_CULMINATION");

  const p3 = getTripleTransitStage(3, "DIRECT");
  assert.equal(p3.stage, "PASS_3_FINAL_RESOLUTION");
});

test("Outer Planets Engine — Next-House Cusp Buffer Rule (3.0° Pre-Ingress)", () => {
  // House 1 cusp: 0°, House 2 cusp: 30°
  const houseCusps = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  // At 28.5°, planet is in House 1, but within 1.5° (<= 3°) of House 2 cusp
  const res = getHousePlacementWithBuffer(28.5, houseCusps);
  assert.equal(res.currentHouse, 1);
  assert.equal(res.nextHouseBufferActive, 2);

  // At 20°, well inside House 1, no next house buffer
  const resFar = getHousePlacementWithBuffer(20, houseCusps);
  assert.equal(resFar.currentHouse, 1);
  assert.equal(resFar.nextHouseBufferActive, null);
});

test("Outer Planets Engine — Planetary Combinations Knowledge Base", () => {
  assert.ok(PLANETARY_COMBINATIONS_KB.PLUTO_MARS.gift.includes("superhuman drive"));
  assert.ok(PLANETARY_COMBINATIONS_KB.URANUS_MC_HARD.shadow.includes("Sudden unexpected troubles"));
  assert.ok(PLANETARY_COMBINATIONS_KB.SATURN_TRANSIT_NEPTUNE.gift.includes("Practical grounding"));
});

test("Outer Planets Engine — computeNatalOuterPlanets evaluated via Moshier Ephemeris", () => {
  // Epoch for 1995-10-25 14:30 UTC -> JD ~2450016.104
  const jd = 2450016.104;
  const lagnaNum = 11; // Aquarius
  const natalPlanets = { Sun: 188.5, Mars: 215.2, Jupiter: 228.1 };

  const { evaluations, chartDataMap } = computeNatalOuterPlanets(jd, lagnaNum, natalPlanets);

  assert.equal(evaluations.length, 3);
  const indra = evaluations.find((e) => e.planet === "URANUS");
  const varun = evaluations.find((e) => e.planet === "NEPTUNE");
  const yam = evaluations.find((e) => e.planet === "PLUTO");

  assert.ok(indra);
  assert.ok(varun);
  assert.ok(yam);

  assert.equal(indra?.hindiName, "INDRA");
  assert.equal(varun?.hindiName, "VARUN");
  assert.equal(yam?.hindiName, "YAM");

  // Check chartDataMap contains Indra, Varun, Yam
  assert.ok(chartDataMap.Indra);
  assert.ok(chartDataMap.Varun);
  assert.ok(chartDataMap.Yam);

  // Check accurate house mapping and signNum
  assert.equal(typeof chartDataMap.Indra.house, "number");
  assert.ok(chartDataMap.Indra.house >= 1 && chartDataMap.Indra.house <= 12);
  assert.equal(typeof chartDataMap.Indra.signNum, "number");
  assert.ok(chartDataMap.Indra.signNum >= 0 && chartDataMap.Indra.signNum <= 11);

  // Predictions are synthesized
  assert.ok(indra?.synthesis.includes("INDRA (Uranus)"));
  assert.ok(varun?.synthesis.includes("VARUN (Neptune)"));
  assert.ok(yam?.synthesis.includes("YAM (Pluto)"));
});

test("Outer Planets Engine — computeD9OuterPlanets mathematically matches D9 Navamsha placements", () => {
  // Mukul natal data:
  // D9 Lagna = Gemini (sign index 2)
  // Arun: 275.378° (05° Makara) -> D9 Aquarius (sign index 10) -> House 9
  // Varun: 270.707° (00° Makara) -> D9 Capricorn (sign index 9) -> House 8
  // Yam: 214.421° (04° Scorpio) -> D9 Leo (sign index 4) -> House 3
  const mockNatalMap = {
    Indra: { lon: 275.3786, retrograde: true },
    Varun: { lon: 270.7072, retrograde: true },
    Yam: { lon: 214.4217, retrograde: true },
  };

  const d9Outer = computeD9OuterPlanets(mockNatalMap, 2);

  assert.equal(d9Outer.Indra.house, 9);
  assert.equal(d9Outer.Indra.sign, "Aquarius");
  assert.equal(d9Outer.Indra.degree, 18);

  assert.equal(d9Outer.Varun.house, 8);
  assert.equal(d9Outer.Varun.sign, "Capricorn");
  assert.equal(d9Outer.Varun.degree, 6);

  assert.equal(d9Outer.Yam.house, 3);
  assert.equal(d9Outer.Yam.sign, "Leo");
  assert.equal(d9Outer.Yam.degree, 9);
});

