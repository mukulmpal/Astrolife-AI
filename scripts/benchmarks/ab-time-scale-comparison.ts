/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * ============================================================================
 * PHASE 2C — ISOLATED A/B TIME-SCALE BENCHMARK EXPERIMENT
 * ============================================================================
 * Compares three variants across all 10 benchmark test cases:
 *
 *   Variant A: Existing Moshier implementation (orbits evaluated at JD_UTC)
 *   Variant B: Moshier with TT time-scale correction (orbits at JD_TT = JD_UTC + Delta T, Lagna at JD_UT1)
 *   Variant C: Canonical Reference (NASA JPL DE441 + IAU Lahiri Ayanamsha)
 *
 * Usage:
 *   node --import jiti/register scripts/benchmarks/ab-time-scale-comparison.ts
 * ============================================================================
 */

import ephemeris from "ephemeris";
import {
  computeLagna,
  getJD,
  NAK,
} from "../../src/lib/astro-engine/calculations";
import {
  calculateDeltaT,
  jdToGregorian,
  utcToTT,
} from "../../src/lib/astro-engine/time-scales";
import { BENCHMARK_TEST_CASES } from "./cases";

const _r = (d: number) => (d * Math.PI) / 180;
const _n = (x: number) => ((x % 360) + 360) % 360;

function _nutation(T: number): number {
  const D = _n(297.85036 + 445267.11148 * T - 0.0019142 * T * T);
  const M = _n(357.52772 + 35999.05034 * T - 0.0001603 * T * T);
  const Mp = _n(134.96298 + 477198.867398 * T + 0.0086972 * T * T);
  const F = _n(93.27191 + 483202.017538 * T - 0.0036825 * T * T);
  const Om = _n(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  const terms: number[][] = [
    [-171996 - 174.2 * T, 0, 0, 0, 1],
    [-13187 - 1.6 * T, -2, 0, 0, 2, 2],
    [-2274 - 0.2 * T, 0, 0, 0, 2, 2],
    [2062 + 0.2 * T, 0, 0, 0, 0, 2],
    [1426 - 3.4 * T, 0, 1, 0, 0, 0],
    [712 + 0.1 * T, 1, 0, 0, 0, 0],
    [-517 + 1.2 * T, -2, 1, 0, 2, 2],
    [-386 - 0.4 * T, 0, 0, 1, 2, 2],
    [-301, 1, 0, 0, 2, 2],
  ];
  const args = [D, M, Mp, F, Om];
  let dpsi = 0;
  terms.forEach(([si, ...mults]) => {
    const arg = _r(mults.reduce((s, c, i) => s + c * args[i], 0));
    dpsi += si * Math.sin(arg);
  });
  return (dpsi * 0.0001) / 3600;
}

function lahiri(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const precession = 23.85045 + 1.3972 * T + 0.000139 * T * T - 0.0000001 * T * T * T;
  return precession + _nutation(T);
}

function _jdToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

function getNak(lon: number) {
  const i = Math.floor(_n(lon) / (360 / 27));
  const pada = Math.floor((_n(lon) % (360 / 27)) / (360 / 108)) + 1;
  return { name: NAK[i], pada, idx: i };
}

const _MOSHIER_BODY: Record<string, string> = {
  Sun: "sun",
  Moon: "moon",
  Mercury: "mercury",
  Venus: "venus",
  Mars: "mars",
  Jupiter: "jupiter",
  Saturn: "saturn",
};

function computePlanetsAtJD(jdPlanets: number, jdNodes: number): Record<string, number> {
  const ay = lahiri(jdPlanets);
  const sid = (lon: number) => _n(lon - ay);
  const T = (jdNodes - 2451545) / 36525;

  const observed = ephemeris.getAllPlanets(_jdToDate(jdPlanets), 0, 0, 0).observed;
  const out: Record<string, number> = {};
  for (const [name, key] of Object.entries(_MOSHIER_BODY)) {
    out[name] = sid(observed[key].apparentLongitudeDd);
  }

  // Rahu / Ketu
  const rahuTrop = _n(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  out.Rahu = sid(rahuTrop);
  out.Ketu = sid(_n(rahuTrop + 180));
  return out;
}

function angularDiff(actual: number, expected: number): number {
  return ((actual - expected + 540) % 360) - 180;
}

export function runABExperiment() {
  console.log("============================================================================");
  console.log("   PHASE 2C ISOLATED A/B TIME-SCALE BENCHMARK EXPERIMENT");
  console.log("   Variant A: Current Moshier (UTC for orbits)");
  console.log("   Variant B: Moshier with TT correction (TT for orbits, UT1 for Lagna)");
  console.log("   Variant C: Canonical Benchmark Reference (NASA JPL DE441 + IAU Lahiri)");
  console.log("============================================================================\n");

  const results: any[] = [];

  for (const tc of BENCHMARK_TEST_CASES) {
    const jdUTC = getJD(tc.birthDate, tc.birthTime, tc.timezone);
    const { year, month } = jdToGregorian(jdUTC);
    const { deltaTSec } = calculateDeltaT(year, month);
    const jdTT = utcToTT(jdUTC, deltaTSec);

    // Variant A: Current Moshier (all evaluated at jdUTC)
    const planetsA = computePlanetsAtJD(jdUTC, jdUTC);
    const lagnaA = computeLagna(jdUTC, tc.latitude, tc.longitude);
    const moonNakA = getNak(planetsA.Moon);

    // Variant B: TT for orbital ephemerides, UT1/UTC for Lagna & Earth rotation
    const planetsB = computePlanetsAtJD(jdTT, jdTT);
    const lagnaB = computeLagna(jdUTC, tc.latitude, tc.longitude);
    const moonNakB = getNak(planetsB.Moon);

    // Expected values
    const expMoon = tc.expected.moonLongitude;
    const expSun = tc.expected.sunLongitude;
    const expLagna = tc.expected.ascendant;
    const expRahu = tc.expected.rahuLongitude;
    const expJupiter = tc.expected.planetLongitudes?.Jupiter as number | undefined;
    const expSaturn = tc.expected.planetLongitudes?.Saturn as number | undefined;
    const expMars = tc.expected.planetLongitudes?.Mars as number | undefined;

    const caseData: any = {
      id: tc.id,
      category: tc.category,
      deltaTSec,
      date: tc.birthDate,
      time: tc.birthTime,
      moon: null,
      sun: null,
      lagna: null,
      otherPlanets: [],
    };

    // Moon Evaluation
    if (typeof expMoon === "number") {
      const deltaA_Moon = angularDiff(planetsA.Moon, expMoon);
      const deltaB_Moon = angularDiff(planetsB.Moon, expMoon);
      caseData.moon = {
        expected: expMoon,
        valA: planetsA.Moon,
        valB: planetsB.Moon,
        deltaA_arcsec: deltaA_Moon * 3600,
        deltaB_arcsec: deltaB_Moon * 3600,
        nakA: `${moonNakA.name} p${moonNakA.pada}`,
        nakB: `${moonNakB.name} p${moonNakB.pada}`,
        expNak: tc.expected.nakshatra ? `${tc.expected.nakshatra} p${tc.expected.nakshatraPada}` : undefined,
      };
    }

    // Sun Evaluation
    if (typeof expSun === "number") {
      const deltaA_Sun = angularDiff(planetsA.Sun, expSun);
      const deltaB_Sun = angularDiff(planetsB.Sun, expSun);
      caseData.sun = {
        expected: expSun,
        valA: planetsA.Sun,
        valB: planetsB.Sun,
        deltaA_arcsec: deltaA_Sun * 3600,
        deltaB_arcsec: deltaB_Sun * 3600,
      };
    }

    // Lagna Evaluation
    if (typeof expLagna === "number") {
      const deltaA_Lagna = angularDiff(lagnaA, expLagna);
      const deltaB_Lagna = angularDiff(lagnaB, expLagna);
      caseData.lagna = {
        expected: expLagna,
        valA: lagnaA,
        valB: lagnaB,
        deltaA_arcsec: deltaA_Lagna * 3600,
        deltaB_arcsec: deltaB_Lagna * 3600,
      };
    }

    // Other planets
    const checkPlanet = (name: string, expVal?: unknown) => {
      if (typeof expVal === "number") {
        const dA = angularDiff(planetsA[name], expVal);
        const dB = angularDiff(planetsB[name], expVal);
        caseData.otherPlanets.push({
          name,
          expected: expVal,
          valA: planetsA[name],
          valB: planetsB[name],
          deltaA_arcsec: dA * 3600,
          deltaB_arcsec: dB * 3600,
        });
      }
    };

    checkPlanet("Mars", expMars);
    checkPlanet("Jupiter", expJupiter);
    checkPlanet("Saturn", expSaturn);
    checkPlanet("Rahu", expRahu);

    results.push(caseData);
  }

  // Print Formatted Report
  console.log("-------------------------------------------------------------------------------------------------------------");
  console.log("CASE ID                  | METRIC    | EXP REF    | VARIANT A (UTC) | VARIANT B (TT)  | DELTA A (\") | DELTA B (\")");
  console.log("-------------------------------------------------------------------------------------------------------------");

  for (const r of results) {
    if (r.moon) {
      console.log(
        `${r.id.padEnd(24)} | Moon Lon  | ${r.moon.expected.toFixed(4).padStart(10)} | ${r.moon.valA.toFixed(4).padStart(15)} | ${r.moon.valB.toFixed(4).padStart(15)} | ${r.moon.deltaA_arcsec.toFixed(2).padStart(10)} | ${r.moon.deltaB_arcsec.toFixed(2).padStart(10)}`
      );
      if (r.moon.expNak) {
        console.log(
          `${"".padEnd(24)} | Moon Nak  | ${r.moon.expNak.padStart(10)} | ${r.moon.nakA.padStart(15)} | ${r.moon.nakB.padStart(15)} | ${r.moon.nakA === r.moon.expNak ? "MATCH" : "MISMATCH"} | ${r.moon.nakB === r.moon.expNak ? "MATCH" : "MISMATCH"}`
        );
      }
    }
    if (r.sun) {
      console.log(
        `${r.id.padEnd(24)} | Sun Lon   | ${r.sun.expected.toFixed(4).padStart(10)} | ${r.sun.valA.toFixed(4).padStart(15)} | ${r.sun.valB.toFixed(4).padStart(15)} | ${r.sun.deltaA_arcsec.toFixed(2).padStart(10)} | ${r.sun.deltaB_arcsec.toFixed(2).padStart(10)}`
      );
    }
    if (r.lagna) {
      console.log(
        `${r.id.padEnd(24)} | Lagna     | ${r.lagna.expected.toFixed(4).padStart(10)} | ${r.lagna.valA.toFixed(4).padStart(15)} | ${r.lagna.valB.toFixed(4).padStart(15)} | ${r.lagna.deltaA_arcsec.toFixed(2).padStart(10)} | ${r.lagna.deltaB_arcsec.toFixed(2).padStart(10)}`
      );
    }
    for (const p of r.otherPlanets) {
      console.log(
        `${r.id.padEnd(24)} | ${p.name.padEnd(9)} | ${p.expected.toFixed(4).padStart(10)} | ${p.valA.toFixed(4).padStart(15)} | ${p.valB.toFixed(4).padStart(15)} | ${p.deltaA_arcsec.toFixed(2).padStart(10)} | ${p.deltaB_arcsec.toFixed(2).padStart(10)}`
      );
    }
    console.log("-------------------------------------------------------------------------------------------------------------");
  }

  return results;
}

if (process.argv[1]?.endsWith("ab-time-scale-comparison.ts")) {
  runABExperiment();
}
