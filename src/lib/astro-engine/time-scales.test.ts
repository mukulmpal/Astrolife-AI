/**
 * ============================================================================
 * TIME-SCALES ARCHITECTURE UNIT TESTS
 * ============================================================================
 * Tests:
 * 1. Delta T values across historical & modern eras (1943, 2000, 2020, 2024)
 * 2. Explicit UTC / UT1 / TT conversion relationships
 * 3. Earth-rotation time scale isolation (Lagna uses UT1, planets use TT)
 * 4. Provenance contract compliance
 * ============================================================================
 */

import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateChart,
  computeLagna,
  getJD,
} from "./calculations";
import {
  buildTimeScaleProvenance,
  calculateDeltaT,
  jdToGregorian,
  utcToTT,
  utcToUT1,
} from "./time-scales";

test("TimeScales — Delta T calculation across historical & modern eras", () => {
  // 1943 (World War II era, British/Indian wartime)
  const dt1943 = calculateDeltaT(1943, 8);
  assert.ok(
    dt1943.deltaTSec >= 25.0 && dt1943.deltaTSec <= 27.5,
    `1943 Delta T expected ~26.2s, got ${dt1943.deltaTSec}`
  );
  assert.equal(dt1943.uncertaintySec, 1.0);
  assert.match(dt1943.historicalContext, /Pre-atomic GMT/);

  // 2000 (J2000 standard astronomical epoch)
  const dt2000 = calculateDeltaT(2000, 1);
  assert.ok(
    dt2000.deltaTSec >= 63.5 && dt2000.deltaTSec <= 64.5,
    `2000 Delta T expected ~63.8s, got ${dt2000.deltaTSec}`
  );

  // 2020 (Contemporary epoch)
  const dt2020 = calculateDeltaT(2020, 1);
  assert.ok(
    dt2020.deltaTSec >= 70.0 && dt2020.deltaTSec <= 73.0,
    `2020 Delta T expected ~71.6s, got ${dt2020.deltaTSec}`
  );

  // 2024 (Modern benchmark epoch)
  const dt2024 = calculateDeltaT(2024, 4);
  assert.ok(
    dt2024.deltaTSec >= 73.0 && dt2024.deltaTSec <= 75.0,
    `2024 Delta T expected ~74.0s, got ${dt2024.deltaTSec}`
  );
  assert.match(dt2024.historicalContext, /Modern UTC/);
});

test("TimeScales — Explicit UTC / UT1 / TT relationships", () => {
  const jdUTC = 2460409.5847222223; // 2024-04-09 02:02 UT
  const deltaT = 74.04; // seconds

  const jdTT = utcToTT(jdUTC, deltaT);
  const diffDays = jdTT - jdUTC;
  const diffSeconds = diffDays * 86400;
  assert.ok(
    Math.abs(diffSeconds - deltaT) < 1e-4,
    `Expected exact ${deltaT}s difference, got ${diffSeconds}`
  );

  // UT1 with estimated DUT1
  const dut1 = 0.25; // 250ms
  const jdUT1 = utcToUT1(jdUTC, dut1);
  assert.ok(
    Math.abs((jdUT1 - jdUTC) * 86400 - dut1) < 1e-4,
    `Expected exact ${dut1}s offset for UT1`
  );

  // Provenance builder
  const res = buildTimeScaleProvenance(jdUTC, 0.1);
  assert.equal(res.provenance.input, "UTC");
  assert.equal(res.provenance.planetaryEvaluation, "TT");
  assert.equal(res.provenance.rotationEvaluation, "UT1");
  assert.equal(res.provenance.dut1EstimatedSec, 0.1);
  assert.ok(res.provenance.deltaTSec > 70);
});

test("TimeScales — Gregorian calendar roundtrip from Julian Day", () => {
  const jd = getJD("2024-04-09", "07:32", 5.5);
  const cal = jdToGregorian(jd);
  assert.equal(cal.year, 2024);
  assert.equal(cal.month, 4);
  assert.equal(cal.day, 9);
  assert.equal(cal.hour, 2);
  assert.equal(cal.minute, 2);
});

test("TimeScales — Lagna is NOT shifted by Delta T while planets use TT", () => {
  const jdUTC = getJD("2024-04-09", "07:32", 5.5);
  const lat = 28.6139;
  const lon = 77.2090;

  // Lagna at UTC
  const lagnaUTC = computeLagna(jdUTC, lat, lon);

  // If someone incorrectly shifted Lagna by Delta T (~74s)
  const dtSec = 74.04;
  const jdShifted = jdUTC + dtSec / 86400;
  const lagnaShifted = computeLagna(jdShifted, lat, lon);

  const diffArcsec = Math.abs(lagnaShifted - lagnaUTC) * 3600;
  // Earth rotates at 15 arcsec/second. In 74s, it shifts by ~1110 arcseconds (~0.31 degrees)!
  assert.ok(
    diffArcsec > 1000,
    `Lagna should shift by >1000" if Delta T were wrongly applied, diff was ${diffArcsec}"`
  );

  // calculateChart must evaluate Lagna at jdUTC
  const chart = calculateChart("Test", "2024-04-09", "07:32", "New Delhi");
  assert.ok(
    Math.abs(chart.lagnaLon - lagnaUTC) < 1e-6,
    "calculateChart must evaluate Lagna at unshifted UT1/UTC"
  );
  assert.equal(chart.provenance?.timeScale.planetaryEvaluation, "TT");
  assert.equal(chart.provenance?.timeScale.rotationEvaluation, "UT1");
});
