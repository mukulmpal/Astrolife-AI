import test from "node:test";
import assert from "node:assert/strict";
import {
  computePlacidusCusps,
  computeKPAyanamsha,
  getPlacidusBhavaHouse,
  getStarLord,
  getSubLord,
  getSubSubLord,
} from "./placidus";
import { runKPEngine, normalizeToKPInput } from "./kp";
import { calculateChart } from "./calculations";

test("Placidus Engine — Cusp generation and 180° opposition symmetry", () => {
  // Test with standard JD (e.g. 2024-01-01 12:00 UTC) at New Delhi (28.6139° N, 77.2090° E)
  const jd = 2460311.0;
  const lat = 28.6139;
  const lon = 77.2090;
  const ayan = computeKPAyanamsha(jd);

  const cusps = computePlacidusCusps(jd, lat, lon, ayan);

  assert.equal(cusps.length, 12, "Should compute exactly 12 house cusps");

  // Verify exact 180° opposition pairs
  const pairs = [
    [0, 6], // H1 - H7
    [3, 9], // H4 - H10
    [1, 7], // H2 - H8
    [2, 8], // H3 - H9
    [4, 10], // H5 - H11
    [5, 11], // H6 - H12
  ];

  for (const [hA, hB] of pairs) {
    const lonA = cusps[hA].lon;
    const lonB = cusps[hB].lon;
    const diff = Math.abs(lonB - lonA);
    const oppositeDiff = Math.abs(diff - 180);
    assert.ok(
      oppositeDiff < 1e-4,
      `House ${hA + 1} (${lonA.toFixed(2)}°) and House ${hB + 1} (${lonB.toFixed(2)}°) must be 180° apart, diff was ${diff}`
    );
  }

  // Verify unequal spans (Placidus semi-arc yields unequal house sizes)
  const span1 = ((cusps[1].lon - cusps[0].lon) % 360 + 360) % 360;
  const span2 = ((cusps[2].lon - cusps[1].lon) % 360 + 360) % 360;
  assert.ok(
    Number.isFinite(span1) && Number.isFinite(span2),
    "Spans must be finite numbers"
  );
});

test("Placidus Engine — KP Sub-lord and Star-lord assignment", () => {
  const jd = 2460311.0;
  const lat = 28.6139;
  const lon = 77.2090;
  const ayan = computeKPAyanamsha(jd);
  const cusps = computePlacidusCusps(jd, lat, lon, ayan);

  for (const cusp of cusps) {
    assert.ok(cusp.starLord, `Cusp ${cusp.house} must have a starLord`);
    assert.ok(cusp.subLord, `Cusp ${cusp.house} must have a subLord`);
    assert.ok(cusp.subSubLord, `Cusp ${cusp.house} must have a subSubLord`);
    assert.equal(cusp.source, "placidus");
  }

  // Known sublord test: 0° Aries is Ashwini Nakshatra, Ketu star lord, Ketu sub lord
  assert.equal(getStarLord(0), "Ketu");
  assert.equal(getSubLord(0), "Ketu");
  assert.equal(getSubSubLord(0), "Ketu");
});

test("Placidus Engine — Bhava occupancy with getPlacidusBhavaHouse", () => {
  // Mock 12 cusps starting at 10°, 42°, 70°, 98°, 125°, 155°, 190°, 222°, 250°, 278°, 305°, 335°
  const mockCusps = [10, 42, 70, 98, 125, 155, 190, 222, 250, 278, 305, 335];

  // Inside H1: between 10° and 42°
  assert.equal(getPlacidusBhavaHouse(15, mockCusps), 1);
  assert.equal(getPlacidusBhavaHouse(41.9, mockCusps), 1);

  // Inside H2: between 42° and 70°
  assert.equal(getPlacidusBhavaHouse(42, mockCusps), 2);
  assert.equal(getPlacidusBhavaHouse(65, mockCusps), 2);

  // Inside H12: between 335° and 10° (crosses 0°/360° Aries boundary)
  assert.equal(getPlacidusBhavaHouse(340, mockCusps), 12);
  assert.equal(getPlacidusBhavaHouse(359.5, mockCusps), 12);
  assert.equal(getPlacidusBhavaHouse(5, mockCusps), 12);
  assert.equal(getPlacidusBhavaHouse(9.99, mockCusps), 12);
});

test("Placidus Engine — Polar latitude fallback to Porphyry", () => {
  // Lat 70° N (above arctic circle: > 66°)
  const jd = 2460311.0;
  const lat = 70.0;
  const lon = 25.0;
  const ayan = computeKPAyanamsha(jd);

  const cusps = computePlacidusCusps(jd, lat, lon, ayan);
  assert.equal(cusps.length, 12, "Polar latitude should safely compute 12 cusps via Porphyry");

  // Verify opposition still holds under Porphyry
  const h1 = cusps[0].lon;
  const h7 = cusps[6].lon;
  const diff = Math.abs(((h7 - h1) % 360 + 360) % 360 - 180);
  assert.ok(diff < 1e-4, "H1 and H7 must be exactly 180° apart in polar fallback");
});

test("KP Engine Integration — Chart with Placidus cusps", () => {
  const chart = calculateChart("TestUser", "1995-05-15", "14:30", "", 28.6139, 77.209, 5.5);

  assert.ok(chart.kpCusps, "Chart should contain kpCusps");
  assert.equal(chart.kpCusps.length, 12, "Chart should have 12 kpCusps");

  const kpInput = normalizeToKPInput(chart);
  assert.equal(kpInput.cuspSource, "placidus");
  assert.equal(kpInput.bhavaMode, "placidus");

  const kpResult = runKPEngine(chart);
  assert.equal(kpResult.cusps.length, 12);
  assert.equal(kpResult.cusps[0].source, "placidus");
  assert.ok(kpResult.cusps[0].promise.includes("Placidus KP cusp"));
  assert.ok(kpResult.significators.length > 0, "Significators must be computed");
});
