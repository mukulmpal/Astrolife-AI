/**
 * ============================================================================
 * LUNAR BOUNDARY SENSITIVITY DETECTOR UNIT TESTS
 * ============================================================================
 * Tests:
 * 1. Exact Rashi boundary detection (e.g. 29.99° vs 30.01°)
 * 2. Exact Nakshatra boundary detection (e.g. 13.33° Ashwini-Bharani junction)
 * 3. Exact Pada / Navamsha boundary detection (3.33° grid)
 * 4. Gandanta sandhi detection (0° Aries/Revati, 120° Leo/Ashlesha, 240° Sagittarius/Jyeshtha)
 * 5. Normal Moon position clear of boundaries
 * ============================================================================
 */

import assert from "node:assert/strict";
import test from "node:test";
import { detectMoonBoundarySensitivity } from "./lunar-boundary";

test("LunarBoundary — Gandanta sandhi detection at critical water-fire junctures", () => {
  // Revati - Ashwini sandhi (359.8° -> 0.2°)
  const g1 = detectMoonBoundarySensitivity(359.95);
  assert.equal(g1.isSensitive, true);
  assert.equal(g1.boundaryType, "gandanta");
  assert.ok(g1.distanceToBoundaryDeg <= 0.8);

  const g2 = detectMoonBoundarySensitivity(0.05);
  assert.equal(g2.isSensitive, true);
  assert.equal(g2.boundaryType, "gandanta");

  // Ashlesha - Magha sandhi (119.5° -> 120.5°)
  const g3 = detectMoonBoundarySensitivity(119.7);
  assert.equal(g3.isSensitive, true);
  assert.equal(g3.boundaryType, "gandanta");
  assert.equal(g3.nearestBoundaryDeg, 120);

  // Jyeshtha - Mula sandhi (239.5° -> 240.5°)
  const g4 = detectMoonBoundarySensitivity(240.3);
  assert.equal(g4.isSensitive, true);
  assert.equal(g4.boundaryType, "gandanta");
  assert.equal(g4.nearestBoundaryDeg, 240);
});

test("LunarBoundary — Rashi boundary detection within threshold", () => {
  // Taurus/Gemini boundary is 60.0°
  const r1 = detectMoonBoundarySensitivity(59.98, 0.0333); // within 0.02° < 0.0333°
  assert.equal(r1.isSensitive, true);
  assert.equal(r1.boundaryType, "rashi");
  assert.equal(r1.nearestBoundaryDeg, 60);

  const r2 = detectMoonBoundarySensitivity(60.01, 0.0333);
  assert.equal(r2.isSensitive, true);
  assert.equal(r2.boundaryType, "rashi");
});

test("LunarBoundary — Nakshatra boundary detection within threshold", () => {
  // Boundary between Nakshatra 1 (Ashwini) and 2 (Bharani) is 13.333333° (13° 20')
  const n1 = detectMoonBoundarySensitivity(13.330, 0.0333);
  assert.equal(n1.isSensitive, true);
  assert.equal(n1.boundaryType, "nakshatra");

  // Boundary between Nakshatra 2 (Bharani) and 3 (Krittika) is 26.666667° (26° 40')
  const n2 = detectMoonBoundarySensitivity(26.670, 0.0333);
  assert.equal(n2.isSensitive, true);
  assert.equal(n2.boundaryType, "nakshatra");
});

test("LunarBoundary — Pada / Navamsha boundary detection within threshold", () => {
  // Pada 1 to Pada 2 boundary is 3.333333° (3° 20')
  const p1 = detectMoonBoundarySensitivity(3.330, 0.0333);
  assert.equal(p1.isSensitive, true);
  assert.equal(p1.boundaryType, "pada");

  // Pada 2 to Pada 3 boundary is 6.666667° (6° 40')
  const p2 = detectMoonBoundarySensitivity(6.660, 0.0333);
  assert.equal(p2.isSensitive, true);
  assert.equal(p2.boundaryType, "pada");
});

test("LunarBoundary — Normal non-boundary Moon position", () => {
  // Mid-sign, mid-nakshatra: 15.0° (Bharani Pada 1 mid-range)
  const norm = detectMoonBoundarySensitivity(15.0, 0.0333);
  assert.equal(norm.isSensitive, false);
  assert.ok(norm.distanceToBoundaryDeg > 0.0333);
  assert.match(norm.explanation || "", /well clear/);
});

