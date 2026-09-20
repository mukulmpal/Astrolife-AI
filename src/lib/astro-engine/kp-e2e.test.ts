/**
 * ============================================================================
 * ASTROLIFE — PHASE 2E: KP PIPELINE END-TO-END VALIDATION TESTS
 * ============================================================================
 * Tests:
 * 1. 10 Comprehensive Chart Scenarios (Mid-Lat, Polar, Historical, Boundary, etc.)
 * 2. 10 Mathematical Invariants of KP Astrological Computation
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import { calculateChart, getJD } from "./calculations";
import {
  computePlacidusCusps,
  computeKPAyanamsha,
  getPlacidusBhavaHouse,
  getStarLord,
  getSubLord,
  getSubSubLord,
  getPada,
} from "./placidus";
import {
  runKPEngine,
  normalizeToKPInput,
  getNakshatra,
  KPPlanet,
} from "./kp";

const VALID_KP_PLANETS: KPPlanet[] = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
];

test("KP E2E — Scenario 1: Normal Mid-Latitude Chart (New Delhi)", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const kpInput = normalizeToKPInput(chart);
  const kpResult = runKPEngine(chart);

  assert.equal(kpInput.cuspSource, "placidus");
  assert.equal(kpInput.bhavaMode, "placidus");
  assert.equal(kpResult.cusps.length, 12);
  assert.equal(kpResult.rows.length, 10); // Lagna + 9 planets

  // Check 180° opposition pairs
  for (let i = 0; i < 6; i++) {
    const diff = Math.abs(((kpResult.cusps[i + 6].lon - kpResult.cusps[i].lon) % 360 + 360) % 360 - 180);
    assert.ok(diff < 1e-4, `Cusp pair ${i + 1}-${i + 7} must be 180° apart`);
  }
});

test("KP E2E — Scenario 2: High-Latitude Polar Fallback (Tromsø, Norway, 69.65° N)", () => {
  const chart = calculateChart("Tromso", "2024-06-21", "12:00", "Tromso", 69.6492, 18.9553, 2.0);
  const kpInput = normalizeToKPInput(chart);
  const kpResult = runKPEngine(chart);

  assert.equal(kpInput.cuspSource, "placidus");
  assert.equal(kpResult.cusps.length, 12);

  // Opposition symmetry preserved under Porphyry polar fallback
  for (let i = 0; i < 6; i++) {
    const diff = Math.abs(((kpResult.cusps[i + 6].lon - kpResult.cusps[i].lon) % 360 + 360) % 360 - 180);
    assert.ok(diff < 1e-4, `Polar fallback cusp pair ${i + 1}-${i + 7} must be 180° apart`);
  }
});

test("KP E2E — Scenario 3: Historical Indian Timezone (1943 Kolkata, War Time +6.5h)", () => {
  const chart = calculateChart("Kolkata", "1943-08-15", "10:30", "Kolkata", 22.5726, 88.3639, 6.5);
  const kpResult = runKPEngine(chart);

  assert.equal(kpResult.cusps.length, 12);
  assert.ok(Number.isFinite(chart.jd));
  assert.ok(kpResult.significators.length > 0);
});

test("KP E2E — Scenario 4: Exact Cusp Boundary (Sandhi Stress Test)", () => {
  const cusps = [10, 40, 70, 100, 130, 160, 190, 220, 250, 280, 310, 340];
  // Exactly at boundary
  assert.equal(getPlacidusBhavaHouse(10.0, cusps), 1);
  assert.equal(getPlacidusBhavaHouse(9.999999, cusps), 12);
  assert.equal(getPlacidusBhavaHouse(40.0, cusps), 2);
  assert.equal(getPlacidusBhavaHouse(39.999999, cusps), 1);
});

test("KP E2E — Scenario 5: Exact Nakshatra Boundary (0° Aries Ashwini / Revati Sandhi)", () => {
  // 0° Aries is Ashwini Pada 1, ruled by Ketu star, Ketu sub
  assert.equal(getNakshatra(0.0001), "Ashwini");
  assert.equal(getPada(0.0001), 1);
  assert.equal(getStarLord(0.0001), "Ketu");
  assert.equal(getSubLord(0.0001), "Ketu");

  // 359.9999° is Revati Pada 4, ruled by Mercury star, Mercury sub
  assert.equal(getNakshatra(359.9999), "Revati");
  assert.equal(getPada(359.9999), 4);
  assert.equal(getStarLord(359.9999), "Mercury");
});

test("KP E2E — Scenario 6: Retrograde Motion & Bhava Shifts", () => {
  const chart = calculateChart("Retro", "2023-10-15", "22:15", "Mumbai", 19.076, 72.8777, 5.5);
  const kpResult = runKPEngine(chart);

  const saturnRow = kpResult.rows.find((r) => r.name === "Saturn");
  assert.ok(saturnRow);
  assert.equal(saturnRow.retrograde, true);
});

test("KP E2E — Scenario 7: Rahu/Ketu Mean Node Symmetry", () => {
  const chart = calculateChart("Nodes", "2020-01-01", "00:00", "Delhi", 28.6139, 77.209, 5.5);
  const diff = Math.abs(((chart.planets.Ketu.lon - chart.planets.Rahu.lon) % 360 + 360) % 360 - 180);
  assert.ok(diff < 1e-4, "Rahu and Ketu must maintain exact 180° opposition");
});

test("KP E2E — Scenario 8: Midnight Rollover (00:00:00 Civil Boundary)", () => {
  const chart = calculateChart("Midnight", "2020-01-01", "00:00", "Delhi", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);

  assert.equal(kpResult.cusps.length, 12);
  assert.ok(kpResult.cusps[0].lon >= 0 && kpResult.cusps[0].lon < 360);
});

test("KP E2E — Scenario 9: Indian Geographic Diversity (Chennai vs Mumbai)", () => {
  const chartChennai = calculateChart("Chennai", "2022-08-15", "06:00", "Chennai", 13.0827, 80.2707, 5.5);
  const chartMumbai = calculateChart("Mumbai", "2022-08-15", "06:00", "Mumbai", 19.076, 72.8777, 5.5);

  // Both must be valid KP charts with different local Ascendants
  assert.notEqual(chartChennai.kpCusps![0].lon, chartMumbai.kpCusps![0].lon);
  assert.equal(chartChennai.kpCusps!.length, 12);
  assert.equal(chartMumbai.kpCusps!.length, 12);
});

test("KP E2E — Scenario 10: Non-Indian Timezone (New York, UTC -5)", () => {
  const chartNY = calculateChart("NY", "2021-11-04", "08:45", "New York", 40.7128, -74.006, -5.0);
  const kpResult = runKPEngine(chartNY);

  assert.equal(kpResult.cusps.length, 12);
  assert.equal(kpResult.input.cuspSource, "placidus");
});

test("KP Invariant 1 — Cusp Longitude Strict Normalization [0, 360)", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "City", 28.6139, 77.209, 5.5);
  for (const cusp of chart.kpCusps!) {
    assert.ok(cusp.lon >= 0 && cusp.lon < 360, `Cusp ${cusp.house} longitude ${cusp.lon} out of [0, 360)`);
    assert.ok(Number.isFinite(cusp.lon), `Cusp ${cusp.house} longitude must be finite`);
  }
});

test("KP Invariant 2 — Sequential Cyclic House Partition", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "City", 28.6139, 77.209, 5.5);
  const cusps = chart.kpCusps!.map((c) => c.lon);
  let totalArc = 0;
  for (let i = 0; i < 12; i++) {
    const arc = ((cusps[(i + 1) % 12] - cusps[i]) % 360 + 360) % 360;
    totalArc += arc;
    assert.ok(arc > 0 && arc < 180, `House ${i + 1} arc ${arc}° must be strictly positive and convex`);
  }
  assert.ok(Math.abs(totalArc - 360) < 1e-4, `Total house arcs must sum to 360°`);
});

test("KP Invariant 3 — Exact Single-House Planet Partition Completeness", () => {
  const cusps = [15.2, 43.1, 71.8, 101.4, 132.5, 164.2, 195.2, 223.1, 251.8, 281.4, 312.5, 344.2];
  for (let deg = 0; deg < 360; deg += 0.5) {
    const house = getPlacidusBhavaHouse(deg, cusps);
    assert.ok(house >= 1 && house <= 12 && Number.isInteger(house));
  }
});

test("KP Invariant 4 — Nakshatra, Pada & Sub-Lord Completeness", () => {
  for (let lon = 0; lon < 360; lon += 1.0) {
    const nak = getNakshatra(lon);
    const pada = getPada(lon);
    const star = getStarLord(lon);
    const sub = getSubLord(lon);
    const subsub = getSubSubLord(lon);

    assert.ok(nak && nak.length > 0);
    assert.ok(pada >= 1 && pada <= 4);
    assert.ok(VALID_KP_PLANETS.includes(star));
    assert.ok(VALID_KP_PLANETS.includes(sub));
    assert.ok(VALID_KP_PLANETS.includes(subsub));
  }
});

test("KP Invariant 5 — Cusp Sub-Lord Derivation Consistency", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "City", 28.6139, 77.209, 5.5);
  for (const cusp of chart.kpCusps!) {
    assert.equal(cusp.starLord, getStarLord(cusp.lon));
    assert.equal(cusp.subLord, getSubLord(cusp.lon));
    assert.equal(cusp.subSubLord, getSubSubLord(cusp.lon));
  }
});

test("KP Invariant 6 — Timezone Representation Invariance (UTC Instant Invariance)", () => {
  const lat = 28.6139;
  const lon = 77.209;
  const chartUTC = calculateChart("UTC", "1990-06-01", "12:00", "City", lat, lon, 0);
  const chartIST = calculateChart("IST", "1990-06-01", "17:30", "City", lat, lon, 5.5);
  const chartEDT = calculateChart("EDT", "1990-06-01", "08:00", "City", lat, lon, -4);

  for (const p of ["Sun", "Moon", "Mars", "Jupiter", "Saturn"] as const) {
    assert.ok(Math.abs(chartUTC.planets[p].lon - chartIST.planets[p].lon) < 1e-6);
    assert.ok(Math.abs(chartUTC.planets[p].lon - chartEDT.planets[p].lon) < 1e-6);
  }

  for (let i = 0; i < 12; i++) {
    assert.ok(Math.abs(chartUTC.kpCusps![i].lon - chartIST.kpCusps![i].lon) < 1e-6);
    assert.ok(Math.abs(chartUTC.kpCusps![i].lon - chartEDT.kpCusps![i].lon) < 1e-6);
  }
});

test("KP Invariant 7 — Continuous Boundary Transitions (1-second perturbation stability)", () => {
  const jd0 = getJD("2024-04-09", "07:32", 5.5);
  const jd1s = jd0 + 1 / 86400;
  const ayan = computeKPAyanamsha(jd0);
  const cusps0 = computePlacidusCusps(jd0, 28.6139, 77.209, ayan);
  const cusps1s = computePlacidusCusps(jd1s, 28.6139, 77.209, ayan);

  const cusp1Diff = Math.abs(cusps1s[0].lon - cusps0[0].lon);
  const expectedRate = 0.004167; // ~15 arcsec/sec
  assert.ok(
    Math.abs(cusp1Diff - expectedRate) < 0.002,
    `Cusp movement was ${cusp1Diff}°, expected ~${expectedRate}°`
  );
});

test("KP Invariant 8 — Significator Structure & Score Bounding", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "City", 28.6139, 77.209, 5.5);
  const kpResult = runKPEngine(chart);

  assert.equal(kpResult.significators.length, 10);
  for (const sig of kpResult.significators) {
    assert.ok(sig.score >= 18 && sig.score <= 84, `Score ${sig.score} must be within [18, 84]`);
    assert.ok(["strong", "moderate", "weak", "blocked"].includes(sig.verdict));
    assert.ok(sig.actionPlan.length > 0);
    assert.ok(sig.cuspPromise.length > 0);
  }
});

test("KP Invariant 9 — High-Latitude Polar Fallback Symmetry", () => {
  const polarCusps = computePlacidusCusps(2460311.0, 70.0, 25.0, computeKPAyanamsha(2460311.0));
  for (let i = 0; i < 6; i++) {
    const diff = Math.abs(((polarCusps[i + 6].lon - polarCusps[i].lon) % 360 + 360) % 360 - 180);
    assert.ok(diff < 1e-4, `Polar opposition pair ${i + 1}-${i + 7} must be 180° apart`);
  }
});

test("KP Invariant 10 — Mean Lunar Node Mode Consistency", () => {
  const chart = calculateChart("Delhi", "1995-05-15", "14:30", "City", 28.6139, 77.209, 5.5);
  const rahuLon = chart.planets.Rahu.lon;
  const ketuLon = chart.planets.Ketu.lon;
  const nodeDiff = Math.abs(((ketuLon - rahuLon) % 360 + 360) % 360 - 180);
  assert.ok(nodeDiff < 1e-4, "Rahu/Ketu mean nodes must maintain exact 180° opposition");
});
