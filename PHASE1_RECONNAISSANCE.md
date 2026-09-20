# AstroLife — Phase 1 Technical Reconnaissance Report
**Date:** 2026-09-19  
**Role:** Senior Astrology Systems Engineer  
**Status:** Completed (Inspection Phase)  
**Strict Directives Observed:** Zero production calculation mutations, zero UI modifications, zero unverified assumptions.

---

## 1. Executive Summary

A comprehensive line-by-line inspection of the AstroLife web codebase (`/Users/mukulpal/Desktop/astrolife/web`) was conducted to uncover the actual implementation of astronomical calculations, rule engines, location/timezone processing, and testing infrastructure.

### Key Finding:
The platform currently possesses a wide range of specialized astrological engines (Parashari, KP, Jaimini, Lal Kitab, Sarvatobhadra, Ashtakavarga, Shadbala, etc.), but **Layer 1 (Astronomical Computation) is tightly coupled to a single JavaScript Moshier library with hardcoded defaults**. Several assumptions previously made in preliminary audits were partially inaccurate or incomplete. This document details the exact reality of the repository.

---

## 2. Current Calculation Architecture & Dependencies

### 2.1 Astronomical Ephemeris Dependency
* **Package:** `ephemeris` v2.2.0 (`node_modules/ephemeris/package.json`)
* **Underlying Implementation:** Pure JavaScript port of Stephen L. Moshier's analytical ephemeris formulas by Hemantkumar Goswami.
* **Location in Codebase:** Imported solely in [`src/lib/astro-engine/calculations.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/calculations.ts#L10):
  ```typescript
  import ephemeris from "ephemeris";
  ```
* **Invocation Pattern:**
  ```typescript
  const observed = ephemeris.getAllPlanets(_jdToDate(jd), 0, 0, 0).observed;
  ```
  *Notice:* Latitude, longitude, and altitude are passed as `0, 0, 0` to `getAllPlanets`. The engine calculates **geocentric apparent longitude** (nutation + aberration included).

### 2.2 Timezone & Coordinate Handling
* **Static Fallback:** [`src/lib/astro-engine/calculations.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/calculations.ts#L392) defines a static lookup table `CITY_COORDS` with only 26 Indian cities:
  * All 26 cities hardcode `tz: 5.5` (India Standard Time).
  * No non-Indian cities exist in this static map.
* **Custom Location Interface:** If a city is not in `CITY_COORDS`, `resolveChartLocation` requires `customLat`, `customLon`, and `customTz`.
* **Discovered Vulnerability in `src/lib/user-chart.ts`:**
  Lines 48–56 of [`src/lib/user-chart.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/user-chart.ts#L48-L56) call:
  ```typescript
  calculateChart(birth.name, birth.dob, birth.tob, birth.city, birth.lat ?? undefined, birth.lon ?? undefined)
  ```
  `customTz` is **omitted** in `user-chart.ts`'s call to `calculateChart`. Consequently, if a user enters a custom city not in the static 26-city dictionary, `resolveChartLocation` throws a fatal error because `customTz` is `undefined`.
* **Historical Timezone & DST Reality:**
  There is currently **zero historical timezone / Daylight Saving Time (DST) resolution** in the calculation engine. A birth in 1943 during Indian War Time (when India shifted to GMT+6:30) or any overseas birth with DST is treated as standard static offset.
* **GeoNames Database:** An API endpoint [`src/app/api/locations/search/route.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/api/locations/search/route.ts) queries a Supabase `geonames_cities` table with IANA timezone strings, but the core engine in `calculations.ts` does not consume IANA strings—it expects a numeric offset `tz`.

### 2.3 Ayanamsha Handling
* **Implementation:** Hardcoded to **Lahiri (Chitrapaksha)** in `calculations.ts` lines 191–195:
  ```typescript
  function lahiri(jd: number): number {
    const T = (jd - 2451545.0) / 36525;
    const precession = 23.85045 + 1.39720 * T + 0.000139 * T * T - 0.0000001 * T * T * T;
    return precession + _nutation(T);
  }
  ```
* **Nutation Algorithm:** 9-term IAU 1980 series (`_nutation(T)`).
* **Limitation:** There is no mechanism to configure KP Ayanamsha (Krishnamurti / New KP), Raman Ayanamsha, or Fagan-Bradley. Every downstream system (including KP) inherits Lahiri.

### 2.4 Lunar Node (Rahu / Ketu) Handling
* **Implementation:** Mean Lunar Node calculated analytically via a low-order polynomial (`calculations.ts` lines 264–267):
  ```typescript
  const rahuTrop = _n(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  out.Rahu = sid(rahuTrop);
  out.Ketu = _n(rahuTrop + 180);
  ```
* **Limitation:** **True Node is not implemented.** In traditional and modern practice, True vs. Mean node can differ by more than $1^\circ 45'$, causing nakshatra and sign shifts for Rahu/Ketu.

### 2.5 Lagna (Ascendant) & House System Handling
* **Lagna Formula:** Calculated in `computeLagna(jd, lat, lon)` using Greenwich Apparent Sidereal Time (GAST) and Local Sidereal Time (LST), subtracting the Lahiri ayanamsha (`calculations.ts` lines 286–301).
* **House System:** Hardcoded to **Degree-Equal Bhava** (`buildHouseCusps` in lines 314–336). Each house cusp is exactly $30^\circ$ from the Lagna degree (`lagnaLon + index * 30`).
* **KP System Cusp Disconnect:**
  In [`src/lib/astro-engine/kp.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/kp.ts#L851-L856), the KP engine inspects `source.houseCusps`. Because `calculations.ts` populates `houseCusps` using `degree-equal-bhava`, **KP is currently running on equal 30° bhava cusps rather than Placidus cusps**, which compromises classical KP cuspal significator logic.

### 2.6 Vimshottari Dasha Handling
* **Implementation:** [`src/lib/astro-engine/dasha.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/dasha.ts#L120) and `calculations.ts` lines 338–389.
* **Year Length:** Fixed to Julian solar year:
  ```typescript
  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
  ```
* **Limitation:** No support for the classical 360-day Savana year or true sidereal solar year.

### 2.7 Panchang Handling
* **Implementation:** [`src/lib/astro-engine/panchang.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/panchang.ts).
* **Critical Finding:** Sunrise is **not** calculated from solar declination and observer latitude. Line 515 reveals:
  ```typescript
  sunriseAssumed: assumed ? "06:00 (local approx)" : sunrise
  ```
  Unless an external `sunrise` string is passed, Panchang defaults sunrise to `06:00 AM`. This impacts Rahu Kaal, Gulika, Yamaganda, and Chaughadia accuracy, which depend on actual local sunrise/sunset.

### 2.8 Existing Test Coverage Reality
* **Prior Assumption:** Minimal test coverage.
* **Actual Reality:** Exactly **one** test file existed in the entire repository:
  [`src/lib/astro-engine/mangal-dosha.test.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/mangal-dosha.test.ts).
* **Execution Test:** Runs cleanly under `node --import jiti/register --test` in Node v25.9.0.
* **Gap:** Zero automated unit or regression tests existed for `calculations.ts`, `panchang.ts`, `dasha.ts`, `kp.ts`, `divisional.ts`, or `ashtakavarga.ts`.

---

## 3. Discovered Vulnerabilities & Architectural Risks

| Priority | Component | Discovered Reality | Impact |
|---|---|---|---|
| **P0** | **KP House Cusps** | KP uses `degree-equal-bhava` cusps from `calculations.ts`. | Violates fundamental KP tenet requiring Placidus non-equal house division. |
| **P0** | **Timezone Resolution** | Missing `customTz` parameter propagation in `user-chart.ts` and no IANA historical DST engine. | Non-Indian and historical charts can throw errors or compute inaccurate LST. |
| **P1** | **Panchang Sunrise** | Default fallback to static `06:00 AM` sunrise in `panchang.ts`. | Inaccurate Muhurta, Rahu Kaal, Chaughadia, and Hora timings. |
| **P1** | **Invented Confidence** | Hardcoded `birthTimeConfidence: 86` across multiple UI and report files. | Presents an arbitrary numerical confidence score without user input. |
| **P2** | **Ayanamsha Monopoly** | Only Lahiri (analytical formula) is supported; KP Krishnamurti Ayanamsha is missing. | Sub-lord calculations at cuspal borders can drift by arc-minutes. |
| **P2** | **Lunar Nodes** | Mean node only; no True Node calculation option. | Up to ~1.75° error for Rahu/Ketu compared to true osculating node. |

---

## 4. Items Requiring Later Phased Migration (Beyond Phase 1)

1. **Decoupled System Architecture (Phase 2):**
   Refactor `calculateChart` into an Astronomical Fact Sheet provider, allowing Parashari, KP, Jaimini, and Lal Kitab to apply their own house systems and ayanamshas.
2. **True Astronomical Sunrise/Sunset Calculation:**
   Implement high-precision solar zenith/refraction sunrise and sunset algorithms tied to latitude/longitude.
3. **Historical IANA Timezone Bridge:**
   Connect geodetic coordinates and birth dates to an authoritative timezone database resolving DST and historical offsets.
4. **Swiss Ephemeris Benchmark Comparison:**
   Evaluate Moshier output against Swiss Ephemeris (`sweph`) across boundary cases before performing any engine migration.

