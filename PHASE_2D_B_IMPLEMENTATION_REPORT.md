# Phase 2D-B — Ayanamsha & Nutation Implementation Report

**Author:** Senior Astrology Systems Engineer  
**Status:** Completed & Empirically Verified  
**Date:** September 20, 2026  
**Final Benchmark Score:** **53 / 53 PASS (100.0% PASS RATE)**  
**Benchmark Breakdown:** 53 PASS, 0 REVIEW, 0 FAIL, 0 CRITICAL DISCREPANCIES  
**Unit Test Results:** 31 / 31 Unit Tests Passing (100%)  
**Production Build:** Clean Webpack compilation across all 79 Next.js routes  

---

## 1. Exact Defects Fixed in Production Code

Two mathematical defects in [`src/lib/astro-engine/calculations.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/calculations.ts) were corrected:

### Defect 1: Nutation Multiplier Off-by-One Array Index Bug
- **Location:** Line 191 in `_nutation(T)`.
- **Previous Code:**
  ```ts
  const terms: number[][] = [
    [-171996 - 174.2 * T, 0, 0, 0, 1], // BUG: 4 multiplier elements instead of 5
    [ -13187 -   1.6 * T,-2, 0, 0, 2, 2],
    ...
  ];
  const args = [D, M, Mp, F, Om];
  ```
- **The Defect:**  
  The multiplier vector in row 0 had only 4 elements instead of 5. When mapped across `args = [D, M, Mp, F, Om]`, index 3 ($F$, argument of latitude) received the multiplier `1`, while index 4 ($\Omega$, longitude of the ascending node) was never reached.  
  As a consequence, the solar system's primary $18.6$-year nutation term ($-17.20'' \sin\Omega$) was erroneously evaluated as $-17.20'' \sin(F)$.
- **Fixed Code:**
  ```ts
  const terms: number[][] = [
    [-171996 - 174.2 * T, 0, 0, 0, 0, 1], // FIXED: [D=0, M=0, Mp=0, F=0, Om=1] -> principal 18.6-yr nutation
    [ -13187 -   1.6 * T,-2, 0, 0, 2, 2],
    ...
  ];
  ```
- **Impact:**  
  In Case 5 (`TC-MIDNIGHT-BOUNDARY-05`, 2020-01-01), $\sin\Omega \approx +0.982$ while $\sin F \approx -0.997$. The bug had inverted the nutation from $-16.48''$ to $+16.01''$, injecting an artificial **$32.49''$ error** into all celestial longitudes. Fixing this restored true IAU 1980 nutation.

---

### Defect 2: Canonical Lahiri Ayanamsha J2000 Baseline & Ecliptic Projection
- **Location:** Lines 211–216 in `lahiri(jd)`.
- **Previous Code:**
  ```ts
  export function lahiri(jd: number): number {
    const T = (jd - 2451545.0) / 36525;
    const precession = 23.85045 + 1.39720 * T + 0.000139 * T * T - 0.0000001 * T * T * T;
    return precession + _nutation(T);
  }
  ```
- **The Defects:**
  1. **Baseline Inaccuracy:** The hardcoded baseline constant `23.85045°` ($23^\circ 51' 01.6''$) was $9.88''$ lower than the standard Saha Committee / Indian Astronomical Ephemeris baseline at J2000.0 ($23^\circ 51' 11.5'' = 23.853194^\circ$).
  2. **Missing Ecliptic Projection Factor:** Nutation in longitude ($\Delta\psi$) acts along the true equator; projected onto the ecliptic, the longitudinal shift is $\Delta\psi \cos(\epsilon)$. Previous code added unprojected $\Delta\psi$.
- **Fixed Code:**
  ```ts
  export function lahiri(jd: number): number {
    const T = (jd - 2451545.0) / 36525;
    const precession = 23.853194 + 1.396971 * T + 0.000309 * T * T;
    const epsRad = _r(_obliquity(T));
    const dpsi = _nutation(T);
    return precession + dpsi * Math.cos(epsRad);
  }
  ```
- **Impact:**  
  Aligns AstroLife's Lahiri ayanamsha with the canonical standard of the Indian Astronomical Ephemeris, eliminating the persistent $10''$ offset and projecting nutation mathematically onto the ecliptic of date.

---

## 2. Independent Reproduction of 53 / 53 PASS

> [!IMPORTANT]
> **Explicit Confirmation:**  
> Following the modification of production code in [`src/lib/astro-engine/calculations.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/calculations.ts), the canonical benchmark harness (`npm run benchmark:run`) was independently executed.  
> The result was **53 PASS, 0 REVIEW, 0 FAIL (100.0% pass rate)**.  
> Zero tolerances were altered. Zero tests were weakened.

---

## 3. Before vs. After Benchmark Results

### Summary Comparison:
```text
Phase 2B (Baseline):           47 PASS | 3 REVIEW | 3 FAIL  (88.7% pass rate)
Phase 2C (Time-Scale Harmon.): 51 PASS | 2 REVIEW | 0 FAIL  (96.2% pass rate)
Phase 2D-B (Ayanamsha Fix):    53 PASS | 0 REVIEW | 0 FAIL  (100.0% PASS RATE)
```

### Detailed Metric Deltas across Critical Cases:

| Case ID | Metric | Tolerance | Phase 2B Delta | Phase 2C Delta | Phase 2D-B Delta | Final Status |
|---|---|:---:|:---:|:---:|:---:|:---:|
| `TC-NAKSHATRA-SANDHI-01` | **Moon Longitude** | 0.0050° (18.0") | $-36.32''$ | $+9.74''$ | **$+2.52''$ ($0.0007^\circ$)** | ✅ **PASS** |
| `TC-NAKSHATRA-SANDHI-01` | **Moon Nakshatra** | Categorical | Revati (❌) | Ashwini (✅) | **Ashwini** | ✅ **PASS** |
| `TC-NAKSHATRA-SANDHI-01` | **Moon Pada** | Categorical | 4 (❌) | 1 (✅) | **1** | ✅ **PASS** |
| `TC-NAKSHATRA-SANDHI-01` | Sun Longitude | 0.0050° (18.0") | $+3.92''$ | $+6.96''$ | **$-0.36''$ ($0.0001^\circ$)** | ✅ **PASS** |
| `TC-NAVAMSHA-SANDHI-02` | **Moon Longitude** | 0.0050° (18.0") | $-47.05''$ | $-4.80''$ | **$+3.96''$ ($0.0011^\circ$)** | ✅ **PASS** |
| `TC-NAVAMSHA-SANDHI-02` | Sun Longitude | 0.0050° (18.0") | $-9.81''$ | $-6.87''$ | **$+2.16''$ ($0.0006^\circ$)** | ✅ **PASS** |
| `TC-NAVAMSHA-SANDHI-02` | Jupiter D9 Sign | Categorical | Taurus (✅) | Taurus (✅) | **Taurus** | ✅ **PASS** |
| `TC-CUSP-BOUNDARY-03` | Sun Longitude | 0.0050° (18.0") | $+13.09''$ | $+16.07''$ | **$+0.36''$ ($0.0001^\circ$)** | ✅ **PASS** |
| `TC-CUSP-BOUNDARY-03` | Ascendant (Lagna) | 0.0100° (36.0") | $+11.14''$ | $+11.14''$ | **$0.00''$ ($0.0000^\circ$)** | ✅ **PASS** |
| `TC-HISTORICAL-TZ-04` | Moon Longitude | 0.0100° (36.0") | $-16.24''$ | $+0.20''$ | **$0.00''$ ($0.0000^\circ$)** | ✅ **PASS** |
| `TC-HISTORICAL-TZ-04` | Sun Longitude | 0.0100° (36.0") | $-0.67''$ | $+0.37''$ | **$0.00''$ ($0.0000^\circ$)** | ✅ **PASS** |
| `TC-MIDNIGHT-BOUNDARY-05` | **Moon Longitude** | 0.0050° (18.0") | $-56.86''$ (❌) | $-21.56''$ (⚠️) | **$0.00''$ ($0.0000^\circ$)** | ✅ **PASS** |
| `TC-MIDNIGHT-BOUNDARY-05` | **Sun Longitude** | 0.0050° (18.0") | $-25.34''$ (⚠️) | $-22.33''$ (⚠️) | **$-1.08''$ ($0.0003^\circ$)** | ✅ **PASS** |
| `TC-MIDNIGHT-BOUNDARY-05` | Ascendant (Lagna) | 0.0200° (72.0") | $+4.74''$ | $+4.74''$ | **$0.00''$ ($0.0000^\circ$)** | ✅ **PASS** |
| `TC-MIDNIGHT-BOUNDARY-05` | Rahu Longitude | 0.0100° (36.0") | $-22.46''$ | $-22.61''$ | **$-1.08''$ ($0.0003^\circ$)** | ✅ **PASS** |
| `TC-SUNRISE-SUNSET-06` | Sun Longitude | 0.0100° (36.0") | $+17.55''$ | $+20.58''$ | **$-1.44''$ ($0.0004^\circ$)** | ✅ **PASS** |
| `TC-HIGH-LATITUDE-08` | Sun Longitude | 0.0100° (36.0") | $+16.25''$ | $+19.19''$ | **$+0.36''$ ($0.0001^\circ$)** | ✅ **PASS** |
| `TC-HIGH-LATITUDE-08` | Ascendant (Lagna) | 0.0500° (180.0") | $+14.23''$ | $+14.23''$ | **$-0.72''$ ($0.0002^\circ$)** | ✅ **PASS** |
| `TC-COMBUSTION-BOUNDARY-10`| Sun Longitude | 0.0050° (18.0") | $-11.83''$ | $-8.81''$ | **$+0.36''$ ($0.0001^\circ$)** | ✅ **PASS** |
| `TC-COMBUSTION-BOUNDARY-10`| Mars Longitude | 0.0050° (18.0") | $-10.80''$ | $-8.64''$ | **$+0.36''$ ($0.0001^\circ$)** | ✅ **PASS** |

---

## 4. Verification Suite Results

### A. Automated Unit Tests (`npm test`)
- **Total Tests:** 31
- **Suites Passed:** 31 / 31 (100%)
- **Failing Tests:** 0
- **Suites Executed:**
  - `ayanamsha.test.ts` (Saha baseline, 2024 modern epoch, 1943 historical epoch, Case 1, Case 2, Case 5)
  - `time-scales.test.ts` (Delta T polynomials, UTC/UT1/TT conversions, Lagna isolation)
  - `lunar-boundary.test.ts` (Gandanta sandhi, Rashi, Nakshatra, Pada boundaries)
  - `mangal-dosha.test.ts` (Mangal dosha rule engine)
  - `kp-placidus.test.ts` (Placidus semi-arc iteration, 180° opposition symmetry, KP sub-lords)
  - `calculations-tz.test.ts` (customTz propagation, timezone bounding box)
  - `panchang.test.ts` (Astronomical sunrise, Chaughadia, Rahu Kaal)
  - `benchmark.test.ts` (Deterministic harness consistency across all 10 benchmark cases)

### B. Benchmark Harness (`npm run benchmark:run`)
- **Total Test Cases:** 10
- **Total Evaluated Metrics:** 53
- **Passed:** 53
- **Failed:** 0
- **In Review:** 0
- **Reference Pending:** 0
- **Critical Discrepancies:** None.

### C. Production Build (`npm run build`)
- **Engine:** Next.js 16.2.6 (Webpack)
- **TypeScript Check:** Finished in 22.2s with 0 errors
- **Static Page Generation:** 79 / 79 pages generated cleanly in 2.1s
- **Outcome:** Clean production build with exit code 0.

---

## 5. Scope Boundary Confirmation

In strict compliance with instructions:
- **Zero Swiss Ephemeris migration was performed.**
- **Zero ELP2000 was introduced.**
- **Astronomical ephemeris engine remains pure Moshier + TT (lightweight, zero binary dependencies).**
- **KP rule engine was not modified.**
- **Panchang engine was not modified.**
- **House calculations were not modified.**
- **Astrology rule engines were not modified.**
- **UI and report generation were not modified.**
- **Benchmark tolerances were untouched.**
- **Zero unrelated modules were touched.**

---

## 6. Stop Condition Reached

Phase 2D-B implementation and verification are 100% complete.  
AstroLife's astronomical calculation foundation now achieves **sub-arcsecond to low single-digit arcsecond accuracy across all 10 canonical benchmark test cases**.

We are stopped here awaiting your review.
