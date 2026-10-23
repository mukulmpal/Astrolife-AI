/**
 * ============================================================================
 * LAHIRI AYANAMSHA & IAU 1980 NUTATION UNIT TESTS
 * ============================================================================
 * Tests:
 * 1. Nutation principal term mapping to Omega (ascending node)
 * 2. Canonical Saha Committee / Indian Astronomical Ephemeris J2000 baseline
 * 3. Modern date ayanamsha validation (2024)
 * 4. Historical date ayanamsha validation (1943)
 * 5. Case 5 midnight boundary chart accuracy (Moon, Sun, Lagna)
 * 6. Case 1 nakshatra boundary chart accuracy (Ashwini, Pada 1)
 * 7. Case 2 navamsha boundary chart accuracy (Jupiter D9 Taurus)
 * ============================================================================
 */

import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateChart,
  getJD,
  lahiri,
} from "./calculations";

test("Ayanamsha — Canonical Saha Committee J2000.0 baseline", () => {
  // Epoch J2000.0: 2000-01-01 12:00:00 TT (JD 2451545.0)
  // Saha Committee / Indian Astronomical Ephemeris baseline at J2000.0:
  // 23° 51' 11.5" = 23.853194°
  const j2000 = 2451545.0;
  const ayanJ2000 = lahiri(j2000);

  // Mean ayanamsha (precession only at T=0) is 23.853194°.
  // True ayanamsha includes nutation of date (~ -0.0036° / -12.9" at J2000.0).
  // Therefore true ayanamsha should be ~23.8496° (within 0.005° of baseline).
  assert.ok(
    Math.abs(ayanJ2000 - 23.8496) < 0.001,
    `Expected true ayanamsha at J2000.0 to be ~23.8496°, got ${ayanJ2000.toFixed(6)}°`
  );
});

test("Ayanamsha — Modern epoch validation (2024-04-09)", () => {
  const jdUTC = getJD("2024-04-09", "07:32", 5.5);
  // Delta T ~ 74.04s -> JD_TT
  const jdTT = jdUTC + 74.04 / 86400;
  const ayan2024 = lahiri(jdTT);

  // Canonical IAU Lahiri for 2024-04-09 is 24.1907° (24° 11' 26.6")
  assert.ok(
    Math.abs(ayan2024 - 24.1907) < 0.001,
    `Expected 2024 Lahiri ayanamsha ~24.1907°, got ${ayan2024.toFixed(6)}°`
  );
});

test("Ayanamsha — Historical epoch validation (1943-08-15)", () => {
  const jdUTC = getJD("1943-08-15", "10:30", 6.5);
  // Delta T ~ 26.2s -> JD_TT
  const jdTT = jdUTC + 26.2 / 86400;
  const ayan1943 = lahiri(jdTT);

  // Canonical IAU Lahiri for 1943-08-15 is 23.0628° (23° 03' 46.4")
  assert.ok(
    Math.abs(ayan1943 - 23.0628) < 0.001,
    `Expected 1943 Lahiri ayanamsha ~23.0628°, got ${ayan1943.toFixed(6)}°`
  );
});

test("Chart Engine — Case 1 Nakshatra Boundary (TC-NAKSHATRA-SANDHI-01)", () => {
  const chart = calculateChart(
    "Case-1",
    "2024-04-09",
    "07:32",
    "New Delhi",
    28.6139,
    77.209,
    5.5
  );

  // Moon must be in Aries (Mesha), Ashwini Pada 1
  assert.equal(chart.planets.Moon.sign, "Aries");
  assert.equal(chart.planets.Moon.nakshatra, "Ashwini");
  assert.equal(chart.planets.Moon.pada, 1);
  assert.ok(
    Math.abs(chart.planets.Moon.lon - 0.0028) < 0.005,
    `Expected Moon lon ~0.0028°, got ${chart.planets.Moon.lon.toFixed(6)}°`
  );

  // Sun must match JPL DE441 reference (355.5245°)
  assert.ok(
    Math.abs(chart.planets.Sun.lon - 355.5245) < 0.005,
    `Expected Sun lon ~355.5245°, got ${chart.planets.Sun.lon.toFixed(6)}°`
  );

  // First Mahadasha must be Ketu (Ashwini lord)
  assert.equal(chart.dashas[0].planet, "Ketu");
});

test("Chart Engine — Case 2 Navamsha Boundary (TC-NAVAMSHA-SANDHI-02)", () => {
  const chart = calculateChart(
    "Case-2",
    "2023-05-15",
    "14:15",
    "Mumbai",
    19.076,
    72.8777,
    5.5
  );

  // Moon must match JPL DE441 reference (336.2983°)
  assert.ok(
    Math.abs(chart.planets.Moon.lon - 336.2983) < 0.005,
    `Expected Moon lon ~336.2983°, got ${chart.planets.Moon.lon.toFixed(6)}°`
  );

  // Jupiter must be in Taurus Navamsha
  assert.equal(chart.planets.Jupiter.navamsha, "Taurus");
});

test("Chart Engine — Case 5 Midnight Boundary (TC-MIDNIGHT-BOUNDARY-05)", () => {
  const chart = calculateChart(
    "Case-5",
    "2020-01-01",
    "00:00",
    "New Delhi",
    28.6139,
    77.209,
    5.5
  );

  // Moon must match JPL DE441 reference (319.2784°)
  assert.ok(
    Math.abs(chart.planets.Moon.lon - 319.2784) < 0.005,
    `Expected Moon lon ~319.2784°, got ${chart.planets.Moon.lon.toFixed(6)}°`
  );

  // Sun must match JPL DE441 reference (255.6478°)
  assert.ok(
    Math.abs(chart.planets.Sun.lon - 255.6478) < 0.005,
    `Expected Sun lon ~255.6478°, got ${chart.planets.Sun.lon.toFixed(6)}°`
  );

  // Lagna must match reference (159.9265°)
  assert.ok(
    Math.abs(chart.lagnaLon - 159.9265) < 0.02,
    `Expected Lagna lon ~159.9265°, got ${chart.lagnaLon.toFixed(6)}°`
  );
});

