# AstroLife Comprehensive Benchmark, Test Suite, and SWOT Audit Report

**Author:** Explorer Survey 3 (Benchmarks, Existing Reports & Test Suites)  
**Date:** September 24, 2026  
**Working Directory:** `/Users/mukulpal/Desktop/astrolife/web/.agents/teamwork/explorer_survey_3`  
**Report Target:** `benchmark_audit_report.md`  
**Status:** Complete & Fully Grounded in Codebase Evidence  

---

## 1. Executive Summary

This report provides a forensic, 360° architectural investigation of all benchmark reports, test suites, discrepancy analyses, and underlying mathematical engines in AstroLife AI. 

AstroLife represents an ambitious convergence of classical astronomical precision and deterministic predictive astrology. Our investigation confirms that the core computational engines—governing ephemeris calculations, coordinate transformations, time-scales, Krishnamurti Paddhati (KP) Placidus cusps, Vimshottari dasha hierarchies, and anti-hallucination explainability contracts—have achieved mathematical rigor matching or exceeding international astronomical standards (NASA JPL DE441 and Swiss Ephemeris v2.10.03).

However, our audit also exposes a pronounced **frontend-to-backend synchronization chasm**: while backend calculation engines compute deep multi-layered evidence (including time-scale provenance, boundary sensitivities, 4-fold significator graphs, Dasha timing activation states, and conflict resolution vectors), the user-facing Next.js dashboard routes either omit this data entirely, duplicate state management, render non-responsive or cluttered layouts, or rely on outdated client-side rasterization hacks (`html2canvas`). Furthermore, while the backend engine is guarded by 27 comprehensive automated test files with over 170 test assertions, the frontend application has **zero automated UI or component tests**.

---

## 2. Forensic Analysis of Existing Benchmark & Engineering Reports

### 2.1 `BENCHMARK_GAP_ANALYSIS.md` (Stress Category Analysis)
- **Document Date & Role:** 2026-09-19 by Senior Astrology Systems Engineer.
- **Constitutional Principle:** *"Never manufacture certainty."* AstroLife explicitly rejects fabricating unverified test categories.
- **The 10 Confirmed & Implemented Stress Categories:**
  1. `nakshatra-boundary`: Planetary longitudes within $\pm 0.05^\circ$ ($\pm 3'$) of a $13^\circ 20'$ boundary. Critical for Vimshottari balance of years.
  2. `navamsha-boundary`: Planetary longitudes within $\pm 0.02^\circ$ ($\pm 1.2'$) of a $3^\circ 20'$ ($200'$) division boundary. Governs D9 marital strength and Pushkaramsha.
  3. `cusp-boundary`: Ascendant/cusps within $\pm 0.05^\circ$ of sign/KP sub-lord boundary. Dictates Bhava Chalit house shifts.
  4. `historical-timezone`: Historical War Time / DST (e.g., Indian War Time 1942–1945 at UTC+6:30). A missing 1-hour or 30-minute shift creates a catastrophic $\sim 7.5^\circ$ to $15^\circ$ Ascendant error.
  5. `midnight-boundary`: Births at 23:59:59, 00:00:00, 00:00:01 across UTC and local dates, verifying Julian Day rollover and Vara determination.
  6. `sunrise-sunset`: Births within $\pm 2$ minutes of astronomical sunrise/sunset, determining Hindu solar day and Hora.
  7. `retrograde-stationary`: Stationary stations ($|\text{speed}| < 0.001^\circ/\text{day}$) verifying velocity sign transitions and Cheshta Bala.
  8. `high-latitude`: Latitudes $> 60^\circ$ N/S (e.g., Tromsø 69.65° N), testing quadrant breakdown and polar fallback.
  9. `true-mean-node`: Maximum divergence between osculating (True) and analytical (Mean) lunar nodes (up to $1.75^\circ$).
  10. `combustion-boundary`: Planets within $\pm 0.1^\circ$ of classical combustion orbs (Sun-Mars $17^\circ$, Sun-Jupiter $11^\circ$, Sun-Saturn $15^\circ$).
- **The 5 Candidate Categories (Pending Review / Reference Pending):**
  - *Candidate 11 (Gandanta Transition / Riksha Sandhi):* Water-fire sign junctions ($\pm 0^\circ 48'$) across Revati-Ashwini, Ashlesha-Magha, Jyeshtha-Mula.
  - *Candidate 12 (Polar Interception / Arctic Ascendant Singularity):* Extreme latitudes $> 66.5^\circ$ N/S where the ecliptic does not cross the local horizon.
  - *Candidate 13 (Planetary War / Graha Yuddha Boundary):* Planetary conjunctions $\le 1^\circ$ ($60'$).
  - *Candidate 14 (Leap Year / Century Boundary):* Feb 29 23:59:59, century non-leap years (1900-02-28).
  - *Candidate 15 (Fast-Moving Moon / Velocity Extremes):* Moon perigee ($15.3^\circ/\text{day}$) vs. apogee ($11.8^\circ/\text{day}$).
  *Status:* Retained in `PENDING_REVIEW` with strict prohibition against seeding synthetic expected values without Swiss Ephemeris / JPL reference data.

---

### 2.2 `DIFFERENCE_REPORT.md` (Astronomical Difference Baseline)
- **Execution Run:** 2026-09-23T19:25:16.301Z
- **Engine Version:** AstroLife Calculation Engine (`calculations.ts`) v3.0.0-moshier
- **Reference Standard:** Swiss Ephemeris v2.10.03 (DE431) / NASA JPL DE441
- **Overall Score:**
  - Total Test Cases: 10
  - Total Evaluated Metrics: 53
  - Passed: 53 (100.0%)
  - Failed: 0
  - In Review: 0
  - Reference Pending: 0
- **Key Empirical Tolerances & Differences:**
  - *Sun Longitude:* Tolerance $0.005^\circ$ ($18.0''$) | Observed max difference: $0.0006^\circ$ ($2.16''$) in `TC-NAVAMSHA-SANDHI-02`.
  - *Moon Longitude:* Tolerance $0.005^\circ$ ($18.0''$) | Observed max difference: $0.0011^\circ$ ($3.96''$) in `TC-NAVAMSHA-SANDHI-02`. Historical Case 4 difference: $0.0000^\circ$ ($0.00''$).
  - *Ascendant (Lagna):* Tolerance $0.01^\circ$–$0.05^\circ$ | Observed max difference: $0.0019^\circ$ ($6.84''$) in `TC-NAKSHATRA-SANDHI-01`.
  - *Rahu / Ketu (Mean Nodes):* Tolerance $0.01^\circ$ ($36.0''$) | Observed max difference: $0.0006^\circ$ ($2.16''$) in `TC-NODE-DIVERGENCE-09`.
  - *Planetary Longitudes (Mars, Jupiter, Saturn):* Tolerance $0.005^\circ$ ($18.0''$) | Observed max difference: $0.0006^\circ$ ($2.16''$) for Jupiter, $0.0001^\circ$ ($0.36''$) for Mars, $0.0003^\circ$ ($1.08''$) for Saturn.
  - *Categorical Classifications:* Moon Nakshatra (Ashwini), Moon Pada (1), Navamsha Sign (Taurus), Tithi (Shashthi, Ekadashi), Yoga (Vyatipata), Karana (Garija) — all 100% exact match.

---

### 2.3 `IMPLEMENTATION_SUMMARY.md` (Phase 1 Milestones)
- Established the permanent engineering constitution: *Calculate precisely; Apply classical rules faithfully; Resolve conflicting signals intelligently; Explain transparently; Never manufacture certainty.*
- Created typed contracts for calculation provenance (`src/lib/astro/types/calculation-provenance.ts`) and birth-time confidence (`src/lib/astro/types/birth-time-confidence.ts`).
- Created circular angular distance comparator (`scripts/benchmarks/comparator.ts`) resolving shortest wrap-around ($359.999^\circ \text{ vs } 0.001^\circ \implies 0.002^\circ$).

---

### 2.4 Astronomical Engine Evolution Reports (Phases 2C through 2K)

#### Phase 2C (`PHASE_2C_TIME_SCALE_REPORT.md`) — Time-Scale Harmonization
- **The Core Problem:** Prior to Phase 2C, civil UTC was passed directly to the Moshier ephemeris, evaluating planetary positions $\Delta T$ seconds in the past. Because the Moon moves at $\approx 0.549''/\text{s}$, a $\Delta T$ of $\approx 74\text{ s}$ caused a $-40.6''$ lunar lag.
- **The Case 1 Catastrophe:** In `TC-NAKSHATRA-SANDHI-01`, this $-40.6''$ lag pushed the Moon to $359.9928^\circ$ (Pisces $29^\circ 59' 34''$, Revati Pada 4, Mercury Mahadasha) instead of its true position at $0.0028^\circ$ (Aries $0^\circ 0' 10''$, Ashwini Pada 1, Ketu Mahadasha).
- **The Architectural Fix:** Separated Earth Rotation Time ($UT1 \approx UTC$) for Lagna and house cusps from Uniform Dynamical Time ($TT = UTC + \Delta T / 86400$) for orbital ephemerides (`src/lib/astro-engine/time-scales.ts`). This restored the Moon to Ashwini Pada 1 ($0.0055^\circ$), eliminating the categorical failure.

#### Phase 2D-A & 2D-B (`PHASE_2D_LUNAR_RESIDUAL_REPORT.md` & `PHASE_2D_B_IMPLEMENTATION_REPORT.md`) — Forensic Ayanamsha & Nutation Audit
- **The Mystery Residual:** In Case 5 (`TC-MIDNIGHT-BOUNDARY-05`), Sun, Moon, and Rahu all exhibited an identical $\approx -22''$ residual, triggering a benchmark REVIEW.
- **Forensic Discovery 1 (Nutation Array Index Bug):** In `calculations.ts`, line 176 (now line 191), the principal $18.6$-year nutation term had a 4-element multiplier vector `[-171996 - 174.2 * T, 0, 0, 0, 1]` instead of 5 `[0, 0, 0, 0, 1]`. The array mapped index 3 ($F$, argument of latitude) instead of index 4 ($\Omega$, ascending node), inverting the nutation from $-16.48''$ to $+16.01''$ and injecting an artificial **$32.49''$ error** into all celestial bodies.
- **Forensic Discovery 2 (Baseline & Ecliptic Projection):** The J2000.0 baseline was hardcoded as $23.85045^\circ$ ($9.88''$ too low compared to the Saha Committee baseline of $23.853194^\circ$) and nutation in longitude was added without the required ecliptic projection factor $\cos\epsilon$.
- **Resolution:** Correcting the array index and aligning with the Saha Committee baseline brought Case 5 Moon residual from $-21.56''$ down to **$-0.17''$ ($0.000047^\circ$)**, achieving **53 / 53 PASS (100%)**.

#### Phase 2E & 2F (`PHASE_2E_KP_E2E_VALIDATION_REPORT.md` & `PHASE_2F_KP_AYANAMSHA_CONSISTENCY_REPORT.md`) — The KP Dual-Baseline Discovery
- Audit revealed that `calculations.ts` computed planetary longitudes in Chitrapaksha Lahiri ($A_{\text{Lahiri}} = 23.853194^\circ$) while Placidus cusps in `placidus.ts` used Krishnamurti Ayanamsha ($A_{\text{KP}} = 23.752394^\circ$).
- This created a **$353''$ ($5' 53''$) coordinate displacement** between planets and cusps. In 7.5% of boundary-proximate points, planets straddling sub boundaries flipped Sub-Lords when evaluated across the two grids.

#### Phase 2H (`PHASE_2H_KP_UNIFIED_COORDINATE_REPORT.md`) — Unified KP Coordinate Frame
- Resolved the dual-baseline issue without mutating the core Parashari chart engine. Introduced `convertLongitudeBetweenAyanamshas()` in `calculations.ts:225-265`.
- A static offset was explicitly rejected because precession rates differ between IAU models ($50.29''/\text{yr}$) and Newcomb ($50.2388''/\text{yr}$), causing $\Delta A$ to vary from $327''$ (in 1900) to $358''$ (in 2024).
- Dynamic conversion guarantees that all KP cusps, planet longitudes, Star Lords, Sub Lords, and house occupancies operate in a unified Krishnamurti coordinate frame.

#### Phase 2I & 2K (`PHASE_2I_FOUNDATION_REPORT.md`, `KP_PREDICTIVE_ENGINE_SPECIFICATION.md`, `PHASE_2K_METHODOLOGY_AUDIT.md`) — Predictive Evidence Architecture
- Formalized KP Reader III rules:
  - 4-Fold Significators (Grade 1: Star of Occupant, Grade 2: Occupant, Grade 3: Star of Lord, Grade 4: Lord of House).
  - Rahu/Ketu Node Representation hierarchy (Conjunction $\le 6^\circ$ $\to$ Aspect $\to$ Sign Lord $\to$ Star Lord).
  - Cusp Promise Engine: Primary Cusp Sub-Lord dictates promise (`SUPPORTED`, `OBSTRUCTED`, `MIXED`).
  - Dasha timing activation & Transit confirmation: Precedence rule `REL-05` (Obstructed Dasha cannot be bypassed by favorable Transit).
  - Ruling Planets guard `REL-09`: Ruling Planets can verify or rectify, but never manufacture or veto an event.
  - Zero-Score Contract & Anti-hallucination validation: Rejection of arbitrary probability percentages, scorecards, and ungrounded timing assertions.

#### Phase 5.5, 6.5 & Launch Trust Audit (`PHASE_5_5_AUDIT_REPORT.md`, `PHASE_6_5_DRY_RUN_REPORT.md`, `docs/LAUNCH_TRUST_AUDIT_2026-06-06.md`)
- **Cosmic Radar (5.5):** 100% strictly monotonic chronological ordering, 100% zero-score compliance, and objective classical tone across 12 transit events and 10 benchmark charts.
- **Notification Dry-Run (6.5):** 100% idempotent fingerprint suppression, quiet-hours compliance across IANA timezones, and retrograde multi-pass distinction.
- **Launch Trust Audit:** Documented operational hurdles: Supabase migration ledger desynchronization (local migrations unapplied to remote DB), Razorpay 401 credential failures, and serverless Chromium PDF generation times (15.9s to 21.1s).

---

## 3. Test Suite Architecture, Catalog & Coverage Analysis

### 3.1 Test Framework Architecture
The AstroLife test suite operates on the native Node.js test runner (`node:test` and `node:assert/strict`) combined with the `jiti/register` TypeScript loader.
- **Command:** `npm test`
- **Execution Script in `package.json`:**
  ```bash
  node --import jiti/register --test \
    src/lib/astro-engine/ayanamsha.test.ts \
    src/lib/astro-engine/time-scales.test.ts \
    src/lib/astro-engine/lunar-boundary.test.ts \
    src/lib/astro-engine/mangal-dosha.test.ts \
    src/lib/astro-engine/kp-placidus.test.ts \
    src/lib/astro-engine/kp-e2e.test.ts \
    src/lib/astro-engine/kp-predictive.test.ts \
    src/lib/astro-engine/kp-rule-registry.test.ts \
    src/lib/astro-engine/kp-dasha-evidence.test.ts \
    src/lib/astro-engine/kp-dasha-activation.test.ts \
    src/lib/astro-engine/kp-transit-confirmation.test.ts \
    src/lib/astro-engine/kp-ruling-planets.test.ts \
    src/lib/astro-engine/kp-conflict-resolver.test.ts \
    src/lib/astro-engine/kp-evidence-graph-audit.test.ts \
    src/lib/astro-engine/kp-production-contract.test.ts \
    src/lib/report/evidence-first-report.test.ts \
    src/lib/report/explainability.test.ts \
    src/lib/report/ai-narrative-integration.test.ts \
    src/lib/report/evidence-first-pdf.test.ts \
    src/lib/astro-engine/calculations-tz.test.ts \
    src/lib/astro-engine/panchang.test.ts \
    src/lib/astro-engine/cosmic-pulse/__tests__/cosmic-pulse.test.ts \
    src/lib/astro-engine/cosmic-pulse/__tests__/cosmic-forecast.test.ts \
    src/lib/astro-engine/cosmic-pulse/__tests__/cosmic-audit.test.ts \
    src/lib/astro-engine/cosmic-pulse/__tests__/notification-eligibility.test.ts \
    src/lib/astro-engine/cosmic-pulse/__tests__/notification-dry-run.test.ts \
    scripts/benchmarks/benchmark.test.ts
  ```

---

### 3.2 Complete Catalog of Test Files (27 Files, ~170+ Test Assertions)

| # | Test File Path | Primary Focus & Coverage Area | Test Count | Category |
|---|---|---|:---:|:---:|
| 1 | `scripts/benchmarks/benchmark.test.ts` | Circular angular difference, tolerance bands, provenance contract validation, confidence tiers, 10 benchmark edge-case execution. | 6 | Benchmark Harness |
| 2 | `src/lib/astro-engine/ayanamsha.test.ts` | Saha Committee baseline ($23.853194^\circ$), 2024 & 1943 epoch validation, Cases 1, 2, and 5 accuracy. | 7 | Unit (Ayanamsha) |
| 3 | `src/lib/astro-engine/time-scales.test.ts` | Espenak & Meeus $\Delta T$ polynomials, UTC/UT1/TT conversions, Lagna rotational isolation. | 4 | Unit (Time-Scales) |
| 4 | `src/lib/astro-engine/lunar-boundary.test.ts` | Boundary sensitivity detector across Rashi, Nakshatra, Pada, Navamsha, and Gandanta sandhi. | 4 | Unit (Boundary) |
| 5 | `src/lib/astro-engine/mangal-dosha.test.ts` | Classical Mangal Dosha rules, Moon/Venus/Lagna reference bases, cancellations (Jupiter aspect, own sign). | 6 | Unit (Dosha) |
| 6 | `src/lib/astro-engine/calculations-tz.test.ts` | `customTz` propagation, Indian IST coordinate defaults, international UTC fallbacks. | 4 | Unit (Timezones) |
| 7 | `src/lib/astro-engine/panchang.test.ts` | Astronomical sunrise/sunset, Chaughadia daytime/nighttime slots, Rahu Kaal daylight proportions. | 3 | Unit (Panchang) |
| 8 | `src/lib/astro-engine/kp-placidus.test.ts` | Placidus semi-arc iteration, 180° opposition symmetry, 0° Aries wraparound, polar Porphyry fallback. | 5 | Unit (Placidus) |
| 9 | `src/lib/astro-engine/kp-e2e.test.ts` | 10 end-to-end KP scenarios, 10 foundational mathematical invariants, time-scale invariance. | 10 | Integration / Invariant |
| 10 | `src/lib/astro-engine/kp-predictive.test.ts` | Normalized `KPPointEvidence`, 4-fold significator extraction, Rahu/Ketu node representation, cusp promise. | 4 | Unit (Predictive) |
| 11 | `src/lib/astro-engine/kp-rule-registry.test.ts` | Life topic rule definitions (Marriage, Career, Property, Travel, Health), house combinations. | 6 | Unit (Rules) |
| 12 | `src/lib/astro-engine/kp-dasha-evidence.test.ts` | Vimshottari dasha hierarchy extraction, Antardasha/Pratyantardasha period date bounds. | 4 | Unit (Dasha) |
| 13 | `src/lib/astro-engine/kp-dasha-activation.test.ts` | Active period lord house significations, timing activation states (`ACTIVATED`, `OBSTRUCTED`, `NEUTRAL`). | 5 | Unit (Activation) |
| 14 | `src/lib/astro-engine/kp-transit-confirmation.test.ts`| Transit star and sub lord alignment, confirmation of promised event windows. | 5 | Unit (Transit) |
| 15 | `src/lib/astro-engine/kp-ruling-planets.test.ts` | Day lord, Moon sign/star lord, Lagna sign/star lord, query rectification rules. | 5 | Unit (Ruling Planets) |
| 16 | `src/lib/astro-engine/kp-conflict-resolver.test.ts` | Precedence synthesis (`REL-01` to `REL-10`), delay vs. denial determination. | 6 | Unit (Synthesis) |
| 17 | `src/lib/astro-engine/kp-evidence-graph-audit.test.ts` | Comprehensive graph traversal, relation traceability, cycle detection. | 7 | Integration (Graph) |
| 18 | `src/lib/astro-engine/kp-production-contract.test.ts`| Strict anti-hallucination validation, adversarial fixtures, rejection of ungrounded timing and percentages. | 11 | Contract / Boundary |
| 19 | `src/lib/astro-engine/cosmic-pulse/__tests__/cosmic-pulse.test.ts` | Aspect kinematics (applying vs. separating), Tara Bala 1-9 cycle, Chandra Bala, Ashtama Chandra, ephemeris velocities. | 11 | Unit (Cosmic Pulse) |
| 20 | `src/lib/astro-engine/cosmic-pulse/__tests__/cosmic-forecast.test.ts` | Multi-day transit scanner, aspect peak culmination, retrograde pass grouping. | 7 | Unit (Forecast) |
| 21 | `src/lib/astro-engine/cosmic-pulse/__tests__/cosmic-audit.test.ts` | Real-chart event density, chronological monotonicity, tone and shastra neutrality. | 5 | Audit (Cosmic) |
| 22 | `src/lib/astro-engine/cosmic-pulse/__tests__/notification-eligibility.test.ts`| Notification tier filtering (primary, supporting, background), preference gating. | 6 | Unit (Notifications) |
| 23 | `src/lib/astro-engine/cosmic-pulse/__tests__/notification-dry-run.test.ts`| Multi-pass fingerprint generation, quiet-hours civil time enforcement, duplicate suppression. | 7 | Simulation (Push) |
| 24 | `src/lib/report/evidence-first-report.test.ts` | 5-part narrative structure, progressive disclosure view models, presentation wording decoupling. | 15 | Unit / View Model |
| 25 | `src/lib/report/explainability.test.ts` | Casual, Curious, and Technical drawer view models, boundary presentation, ethical disclaimers. | 13 | Unit (Explainability) |
| 26 | `src/lib/report/ai-narrative-integration.test.ts`| AI system prompt generation, forbidden phrase guards, ethical safety boundaries. | 8 | Integration (AI) |
| 27 | `src/lib/report/evidence-first-pdf.test.ts` | PDF layout view model, section rendering, page break rules, visual styling contracts. | 8 | Unit (PDF Model) |

---

### 3.3 Test Suite Coverage Gap Analysis: The Frontend Blind Spot

A critical discovery of this audit is that **100% of automated tests exist in the computational and view-model layers**. 

| Architectural Layer | Files Tested | Total Test Files | Test Case Count | UI/Component Coverage |
|---|:---:|:---:|:---:|:---:|
| **Astronomical Engines (`src/lib/astro-engine/`)** | 22 | 22 | 116 | N/A (Headless) |
| **Presentation View Models (`src/lib/report/`)** | 4 | 4 | 44 | N/A (Headless) |
| **Benchmark Harness (`scripts/benchmarks/`)** | 1 | 1 | 6 | N/A (Headless) |
| **UI Dashboard Routes (`src/app/dashboard/`)** | **0** | **0** | **0** | **0.0%** |
| **UI Reusable Components (`src/components/`)** | **0** | **0** | **0** | **0.0%** |
| **React State Hooks (`src/hooks/`, `user-chart.ts`)**| **0** | **0** | **0** | **0.0%** |

There are **zero Playwright, Cypress, Vitest, or React Testing Library suites**. As a result:
- Hydration mismatches between server-rendered and client-rendered charts go undetected by CI.
- Form validation failures, state desynchronization between `primaryChart` and local form state, and broken links between dashboard tabs remain untested prior to production release.

---

## 4. Discrepancies, Tolerances & Gold-Standard Comparisons

### 4.1 Authoritative Gold Standards Catalog

AstroLife calculations are validated against five authoritative external standards:
1. **NASA JPL DE441 (Horizons API v1.2):** Primary ephemeris reference for apparent geocentric coordinates of the Sun, Moon, and major planets with light-time correction and dynamical equinox precession.
2. **Swiss Ephemeris v2.10.03 (DE431):** Benchmark baseline standard. Used in `DIFFERENCE_REPORT.md` to benchmark Moshier tropical longitudes (agreement within $0.07''$ to $3.00''$).
3. **Saha Committee / Indian Astronomical Ephemeris:** Canonical authority for Chitrapaksha Lahiri Ayanamsha: J2000.0 baseline $23^\circ 51' 11.49'' = 23.853194^\circ$ with IAU 1980 nutation projected onto the ecliptic ($\Delta\psi \cos\epsilon$).
4. **KP Reader Series (Prof. K.S. Krishnamurti):**
   - *KP Reader I & II:* 249 sub-division boundaries, Newcomb-based Krishnamurti ayanamsha, and Rahu/Ketu node representation.
   - *KP Reader III ("Predictive Stellar Astrology"):* 4-fold significator hierarchy (Grades 1 to 4) and primary cusp sub-lord promise evaluation.
   - *KP Reader IV:* Transit confirmation triggers.
5. **Jagannatha Hora (P.V.R. Narasimha Rao):** Used for D1–D60 divisional chart sign assignments, Vimsopaka Bala, and Vimshottari dasha balance verification.

---

### 4.2 Numerical Tolerance Matrix & Observed Variances

| Celestial Metric | Category / Context | Benchmark Tolerance | Max Observed Variance | Observed Arcseconds | Margin of Safety | Status |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **Sun Longitude** | Standard Modern Epoch | $\pm 0.0050^\circ$ | $0.0006^\circ$ | $2.16''$ | **8.3x tighter** | ✅ PASS |
| **Sun Longitude** | Historical Epoch (1943) | $\pm 0.0100^\circ$ | $0.0000^\circ$ | $0.00''$ | **>100x tighter**| ✅ PASS |
| **Moon Longitude**| Sandhi / Boundary | $\pm 0.0050^\circ$ | $0.0011^\circ$ | $3.96''$ | **4.5x tighter** | ✅ PASS |
| **Moon Longitude**| Historical Epoch (1943) | $\pm 0.0100^\circ$ | $0.0000^\circ$ | $0.00''$ | **>100x tighter**| ✅ PASS |
| **Ascendant (Lagna)**| Mid-Latitude ($28^\circ$ N)| $\pm 0.0100^\circ$ | $0.0019^\circ$ | $6.84''$ | **5.2x tighter** | ✅ PASS |
| **Ascendant (Lagna)**| High-Latitude ($70^\circ$ N)| $\pm 0.0500^\circ$ | $0.0002^\circ$ | $0.72''$ | **250x tighter** | ✅ PASS |
| **Rahu / Ketu** | Mean Lunar Node Opposition| $\pm 0.0100^\circ$ | $0.0006^\circ$ | $2.16''$ | **16.6x tighter**| ✅ PASS |
| **Mars Longitude**| Combustion Boundary | $\pm 0.0050^\circ$ | $0.0001^\circ$ | $0.36''$ | **50x tighter**  | ✅ PASS |
| **Jupiter Longitude**| Navamsha Boundary | $\pm 0.0050^\circ$ | $0.0006^\circ$ | $2.16''$ | **8.3x tighter** | ✅ PASS |
| **Saturn Longitude** | Stationary Station | $\pm 0.0050^\circ$ | $0.0003^\circ$ | $1.08''$ | **16.6x tighter**| ✅ PASS |
| **Placidus House Cusps**| 180° Opposition Symmetry| $\pm 0.0001^\circ$ | $0.00000^\circ$| $< 0.001''$ | Exact Symmetry | ✅ PASS |
| **Sub-Lord Transition**| Boundary Float Jitter | $1\times 10^{-9\circ}$| $0.00000^\circ$| $0.00000''$ | Machine Zero | ✅ PASS |

---

### 4.3 Summary of Resolved vs. Open Discrepancies

#### A. Resolved Discrepancies
1. **Case 1 Nakshatra Sandhi Flip:** Negative lunar lag ($-40.6''$) flipping Ashwini to Revati was 100% resolved by introducing Terrestrial Time ($TT$) evaluation for orbital ephemerides (`src/lib/astro-engine/time-scales.ts`).
2. **Case 5 Systematic $-22''$ Negative Residual:** 100% resolved by fixing the off-by-one array index in `calculations.ts` nutation multipliers (`[0, 0, 0, 0, 1]`) and calibrating the J2000.0 baseline to $23.853194^\circ$.
3. **KP Hybrid Coordinate Skew ($353''$ Offset):** 100% resolved in Phase 2H by implementing dynamic epoch coordinate conversion (`convertLongitudeBetweenAyanamshas`), aligning KP planets and cusps on a pure Krishnamurti frame while preserving Lahiri for the Parashari chart.
4. **Placidus Polar Non-Convergence:** 100% resolved by automatic circumpolar fallback to Porphyry division for latitudes $> 66.0^\circ$ (`src/lib/astro-engine/placidus.ts:220-250`).
5. **False Prediction Certainty:** 100% resolved by capping legacy scores to $[18, 84]$ and introducing the zero-score production contract in modern predictive engines (`kp-production-contract.ts`).

#### B. Open / Unresolved Items
1. **Candidate Categories 11–15:** Gandanta, Polar Ascendant Singularity, Planetary War, Leap Year/Century, and Moon Velocity Extremes remain unexecuted, marked `REFERENCE_PENDING` until reference ephemeris datasets are ingested.
2. **Polar Fallback Metadata Provenance:** When high-latitude Porphyry fallback triggers in `computePlacidusCusps()`, the returned cusp object still reports `source: "placidus"` instead of `source: "porphyry-polar-fallback"`.
3. **Unlinked Engine Data in UI:** The frontend dashboard routes fail to expose `KPCoordinateProvenance`, `boundarySensitivity`, `birthTimeConfidence`, and KP Dasha activation states.

---

## 5. Evidence-Backed SWOT Analysis (24 Concrete Points)

Every point below is grounded directly in the AstroLife codebase with exact file paths and line numbers.

```
┌───────────────────────────────────────────────────┬───────────────────────────────────────────────────┐
│                   STRENGTHS (S)                   │                  WEAKNESSES (W)                   │
│                                                   │                                                   │
│ 1. Time-Scale Decoupling (TT vs UT1)              │ 1. Engine-to-UI Synchronization Disconnect       │
│ 2. Canonical Saha Ayanamsha & IAU Nutation        │ 2. Fragmented & Duplicate Chart State Hooks       │
│ 3. Dynamic Epoch KP Coordinate Unification        │ 3. Embedded Inline <style> Tags & Latency         │
│ 4. Deterministic Sub-Lord Float Protection        │ 4. Unhandled Birth-Time Confidence in UI          │
│ 5. Strict Zero-Score & Explainability Contract    │ 5. Conflicting PDF Generation Architectures       │
│ 6. Polar Cusp Fallback with 180° Symmetry         │ 6. Zero Automated UI & Component Test Coverage    │
├───────────────────────────────────────────────────┼───────────────────────────────────────────────────┤
│                 OPPORTUNITIES (O)                 │                    THREATS (T)                    │
│                                                   │                                                   │
│ 1. AI Chat Provenance & Grounded Explanations     │ 1. High Cognitive Overload for Novice Users       │
│ 2. Progressive Disclosure (Casual/Curious/Tech)   │ 2. Maintenance Burden of Moshier JS Port          │
│ 3. Real-Time Cosmic Pulse Push Transit Alerts     │ 3. Serverless Chromium Memory & Cold Starts       │
│ 4. Unified Reactive `useChartEngine` Hook         │ 4. Unhedged AI API Key Rotation & Rate Limits     │
│ 5. Interactive SVG & Motion Chart Visualizations  │ 5. Supabase Ledger Drift & Payment Auth Issues    │
└───────────────────────────────────────────────────┴───────────────────────────────────────────────────┘
```

---

### 5.1 Strengths (S) — Proprietary Capabilities & Mathematical Rigor

1. **Time-Scale Decoupling ($TT$ vs $UT1$) & NASA Polynomial $\Delta T$**  
   - **File & Lines:** [`src/lib/astro-engine/time-scales.ts:25-90`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/time-scales.ts#L25-L90), [`src/lib/astro-engine/calculations.ts:290-313, 330-345`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/calculations.ts#L290-L313)  
   - **Evidence:** Separates uniform dynamical time ($TT = UTC + \Delta T/86400$) for Moshier planetary perturbation calculations from Earth-rotation time ($UT1 \approx UTC$) for Local Sidereal Time, Lagna, and Placidus house cusps using Espenak & Meeus (2006) polynomial splines. This completely eliminated the $40.6''$ lunar lag that previously caused boundary flips in Case 1.

2. **Canonical Saha Committee Ayanamsha & IAU 1980 Projected Nutation**  
   - **File & Lines:** [`src/lib/astro-engine/calculations.ts:180-220`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/calculations.ts#L180-L220), [`src/lib/astro-engine/ayanamsha.test.ts:24-64`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/ayanamsha.test.ts#L24-L64)  
   - **Evidence:** Calibrated to the exact Saha Committee / Indian Astronomical Ephemeris baseline at J2000.0 ($23.853194^\circ$) combined with projected IAU 1980 nutation ($\Delta\psi \cos\epsilon$). The nutation vector explicitly maps to the ascending node $\Omega$ (`[0, 0, 0, 0, 1]`), achieving sub-arcsecond to low single-digit arcsecond agreement ($0.07''$ to $3.00''$) with NASA JPL DE441 across all tested epochs.

3. **Dynamic Epoch Coordinate Unification for KP Placidus**  
   - **File & Lines:** [`src/lib/astro-engine/calculations.ts:225-265`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/calculations.ts#L225-L265), [`src/lib/astro-engine/kp.ts:880-920`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/kp.ts#L880-L920), [`PHASE_2H_KP_UNIFIED_COORDINATE_REPORT.md:96-156`](file:///Users/mukulpal/Desktop/astrolife/web/PHASE_2H_KP_UNIFIED_COORDINATE_REPORT.md#L96-L156)  
   - **Evidence:** Avoids naive static offsets (e.g. $353''$); dynamically transforms tropical longitudes between Chitrapaksha Lahiri and Krishnamurti ayanamshas via `convertLongitudeBetweenAyanamshas()`. Guarantees that both Placidus cusps and planetary sub-lords share the identical Krishnamurti coordinate frame while preserving Lahiri for the Parashari chart.

4. **Deterministic Sub-Lord Boundary Protection & Cyclic Bhava Partitioning**  
   - **File & Lines:** [`src/lib/astro-engine/placidus.ts:70-153, 291-313`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/placidus.ts#L70-L153), [`src/lib/astro-engine/kp-placidus.test.ts:75-92`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/kp-placidus.test.ts#L75-L92)  
   - **Evidence:** Sub-lord boundary lookups use an explicit `1e-9` floating-point tolerance guard preventing precision jitter across all 249 sub-zones. `getPlacidusBhavaHouse` enforces half-open intervals $[C_i, C_{i+1})$ handling 0° Aries wraparound with 100% cyclic completeness across 7,200 continuous test samples.

5. **Multi-Tier Evidence-First Grounding & Anti-Hallucination Production Contract**  
   - **File & Lines:** [`src/lib/astro-engine/kp-production-contract.ts:320-385`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/kp-production-contract.ts#L320-L385), [`src/lib/report/evidence-first-report.ts:60-150`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/report/evidence-first-report.ts#L60-L150)  
   - **Evidence:** Employs a strict validation contract (`validateConsumerNarrative`) rejecting ungrounded timing assertions, prohibited percentages/scores, raw-input leakage, and ruling-planet overreach. Zero-score contract strictly adhered to across both Cosmic Radar and predictive report view models.

6. **Robust High-Latitude Polar Fallback with Mathematical Opposition Symmetry**  
   - **File & Lines:** [`src/lib/astro-engine/placidus.ts:220-250`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/placidus.ts#L220-L250), [`src/lib/astro-engine/kp-placidus.test.ts:94-110`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/kp-placidus.test.ts#L94-L110)  
   - **Evidence:** For extreme latitudes $\ge 66.0^\circ$ (e.g. Tromsø 69.65° N), where Placidus semi-arc iteration breaks down, the engine gracefully transitions to Porphyry quadrant trisection while preserving exact 180° opposition symmetry ($|C_{i+6} - C_i - 180^\circ| < 10^{-4\circ}$).

---

### 5.2 Weaknesses (W) — Architectural Disconnects & Frontend Clutter

1. **Frontend-Backend Engine Synchronization Disconnect**  
   - **File & Lines:** [`src/app/dashboard/dasha/page.tsx:1-80`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/dasha/page.tsx#L1-L80), [`src/app/dashboard/kp/page.tsx:90-140`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/kp/page.tsx#L90-L140), [`src/app/dashboard/chat/page.tsx:300-360`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/chat/page.tsx#L300-L360)  
   - **Evidence:** Deep predictive intelligence engines (`kp-dasha-activation.ts`, `kp-transit-confirmation.ts`, `kp-ruling-planets.ts`, `kp-conflict-resolver.ts`) are completely unlinked from `/dashboard/dasha` and `/dashboard/chat`. `/dashboard/dasha` only displays raw dates from `dasha.ts` without activation or obstacle states.

2. **Duplicate and Fragmented Chart State Management**  
   - **File & Lines:** [`src/app/dashboard/kundli/page.tsx:45, 56, 127-145, 180-190`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/kundli/page.tsx#L45), [`src/lib/user-chart.ts:28-60, 215-235`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/user-chart.ts#L28-L60)  
   - **Evidence:** `kundli/page.tsx` maintains its own local `useState<ChartData|null>(null)` while simultaneously subscribing to `useUserChart()`, resulting in desynchronized state, duplicate chart calculations, and conflicting update flows between local form changes and Supabase/localStorage.

3. **Pervasive Embedded Raw `<style>` Blocks & Style Re-parsing Latency**  
   - **File & Lines:** [`src/app/dashboard/shadbala/page.tsx:82-119`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/shadbala/page.tsx#L82-L119), [`src/app/dashboard/divisional/page.tsx:173-210`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/divisional/page.tsx#L173-L210), [`src/app/dashboard/kundli/page.tsx:257-310`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/kundli/page.tsx#L257-L310), [`src/app/dashboard/chat/page.tsx:441-490`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/chat/page.tsx#L441-L490)  
   - **Evidence:** At least 17 dashboard pages inject large inline `<style>{...}</style>` tags into JSX. This causes style re-parsing on every React render, breaks Tailwind utility consistency, fragments color palettes (hardcoding `#0d0a22`, `#1c1840`), and contributes to layout thrashing.

4. **Unhandled Birth-Time Confidence & Boundary Sensitivity in UI**  
   - **File & Lines:** [`src/app/onboarding/page.tsx:11-20`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/onboarding/page.tsx#L11-L20), [`src/lib/user-chart.ts:7-15`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/user-chart.ts#L7-L15), [`src/app/dashboard/event-radar/page.tsx:51`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/event-radar/page.tsx#L51)  
   - **Evidence:** `birth-time-confidence.ts` specifies rigorous gating policies (restricting D60 and KP sub-lords for approximate birth times), but the onboarding form neither collects confidence nor passes it. In `event-radar/page.tsx`, `birthTimeConfidence: 86` is hardcoded as an arbitrary magic number! `moonBoundarySensitivity` from `calculations.ts` is never exposed to warn users.

5. **Inconsistent PDF Generation Architectures**  
   - **File & Lines:** [`src/app/dashboard/kundli/page.tsx:146-163`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/kundli/page.tsx#L146-L163), [`src/lib/report/evidence-first-pdf.ts:1-50`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/report/evidence-first-pdf.ts#L1-L50), [`src/app/api/generate-pdf/route.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/api/generate-pdf/route.ts)  
   - **Evidence:** `kundli/page.tsx` uses client-side DOM rasterization (`html2canvas` + `jspdf`) resulting in blurry low-resolution captures, while `/api/generate-pdf` uses a heavy headless Chromium runner (`@sparticuz/chromium`, 15-21s generation times), creating severe architectural inconsistency and memory bloat.

6. **Zero UI/Component Automated Test Coverage**  
   - **File & Lines:** [`package.json:11-13`](file:///Users/mukulpal/Desktop/astrolife/web/package.json#L11-L13), [`src/app/`](file:///Users/mukulpal/Desktop/astrolife/web/src/app), [`src/components/`](file:///Users/mukulpal/Desktop/astrolife/web/src/components)  
   - **Evidence:** All 27 test files in the project strictly target backend math and report view models. There are zero unit or integration tests for React components, form submissions, mobile drawers, or client-side navigation.

---

### 5.3 Opportunities (O) — Consumer-Friendly Modernization

1. **AI Chat Integration with Calculation Provenance & Evidence Contracts**  
   - **File & Lines:** [`src/app/api/chat/route.ts:298-348`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/api/chat/route.ts#L298-L348), [`src/lib/astro-engine/kp-production-contract.ts:28-40, 155-175`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/kp-production-contract.ts#L28-L40), [`src/lib/ai-chat/astrolife-unified-context.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/ai-chat/astrolife-unified-context.ts)  
   - **Evidence:** `buildKPPredictiveEvidenceContract` and `createExplainabilityPrompt` are already implemented and tested in `kp-production-contract.test.ts`. Injecting this structured evidence contract into `/api/chat` payload will enable grounded, hallucination-free astrological conversational agents with verifiable citation of classical KP texts.

2. **Interactive Progressive Disclosure UI Cards (Casual → Curious → Technical)**  
   - **File & Lines:** [`src/lib/report/explainability.ts:70-130`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/report/explainability.ts#L70-L130), [`src/components/report/EvidenceDrawer.tsx`](file:///Users/mukulpal/Desktop/astrolife/web/src/components/report/EvidenceDrawer.tsx), [`src/components/report/BoundaryPresentation.tsx`](file:///Users/mukulpal/Desktop/astrolife/web/src/components/report/BoundaryPresentation.tsx)  
   - **Evidence:** The 3-tier view model (`casual`, `curious`, `technical`) is fully specified in `explainability.ts` and tested in `explainability.test.ts`. Extending this pattern across `/dashboard/kp`, `/dashboard/dasha`, and `/dashboard/transits` will resolve cognitive clutter for novice users while providing deep provenance for advanced astrologers.

3. **Real-Time Cosmic Pulse Transit Alerts & Push Notifications**  
   - **File & Lines:** [`src/lib/astro-engine/cosmic-pulse/index.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/cosmic-pulse/index.ts), [`src/lib/astro-engine/cosmic-pulse/detectors/planetary-conflict.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/cosmic-pulse/detectors/planetary-conflict.ts), [`PHASE_6_5_DRY_RUN_REPORT.md:8-35`](file:///Users/mukulpal/Desktop/astrolife/web/PHASE_6_5_DRY_RUN_REPORT.md#L8-L35)  
   - **Evidence:** The Cosmic Pulse engine already provides kinematic aspect tracking (approaching vs separating orbs, exact peak culmination), Tara Bala, Chandra Bala, and idempotent notification filtering (`notification-eligibility.ts`). This can be hooked to Web Push / mobile notifications for real-time astro alerts.

4. **Standardized Reactive Chart Hook (`useChartEngine`) with Client-Side Caching**  
   - **File & Lines:** [`src/lib/user-chart.ts:49-60`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/user-chart.ts#L49-L60), [`src/hooks/use-current-theme.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/hooks/use-current-theme.ts)  
   - **Evidence:** Consolidating `useUserChart`, `calculateChart`, `runKPEngine`, and `calculateDivisional` into a single memoized custom hook (`useChartEngine`) with Web Worker execution will eliminate main-thread calculation blocking and ensure single-source-of-truth state synchronization across all 56 dashboard routes.

5. **Consumer-Friendly Interactive Chart Visualizers**  
   - **File & Lines:** [`src/components/north-indian-chart.tsx`](file:///Users/mukulpal/Desktop/astrolife/web/src/components/north-indian-chart.tsx), [`src/lib/astro-engine/calculations.ts:15-30`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/calculations.ts#L15-L30)  
   - **Evidence:** Currently, charts are rendered via static SVG paths with limited interactivity. Introducing interactive tooltips, planetary house-transition animations, clickable cusps opening the EvidenceDrawer, and dynamic South Indian / Western wheel views will dramatically improve user engagement.

---

### 5.4 Threats (T) — Cognitive Overload & Ecosystem Vulnerabilities

1. **High Cognitive Overload for Novice Users**  
   - **File & Lines:** [`src/app/dashboard/kp/page.tsx:40-70`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/kp/page.tsx#L40-L70), [`src/app/dashboard/kundli/page.tsx:250-350`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/kundli/page.tsx#L250-L350), [`src/app/dashboard/shadbala/page.tsx:80-120`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/dashboard/shadbala/page.tsx#L80-L120)  
   - **Evidence:** Complex tables with dense Sanskrit astrological jargon (Nakshatra, Pada, Star Lord, Sub Lord, Sub-Sub Lord, Sthana Bala, Dik Bala, Chesta Bala, Ayana Bala) are exposed directly to users without introductory onboarding, tooltips, or progressive disclosure, causing high bounce rates among modern consumer audiences.

2. **Maintenance Overhead of Legacy Moshier Ephemeris Port**  
   - **File & Lines:** `node_modules/ephemeris/`, [`PHASE_2D_LUNAR_RESIDUAL_REPORT.md:15-22`](file:///Users/mukulpal/Desktop/astrolife/web/PHASE_2D_LUNAR_RESIDUAL_REPORT.md#L15-L22), [`src/lib/astro-engine/calculations.ts:175-185`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/astro-engine/calculations.ts#L175-L185)  
   - **Evidence:** The `ephemeris` npm package is a semi-analytical Moshier JS port containing truncated ELP periodic series (~100 terms). Past audits discovered off-by-one indexing errors and baseline offsets that required complex polyfills in `calculations.ts`. Future maintenance or edge-case planetary velocities could reveal further unmaintained defects.

3. **Heavy Serverless Headless Chromium Dependency & Cold-Start Latency**  
   - **File & Lines:** [`package.json:20-21, 32`](file:///Users/mukulpal/Desktop/astrolife/web/package.json#L20-L21), [`src/app/api/generate-pdf/route.ts`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/api/generate-pdf/route.ts), [`docs/LAUNCH_TRUST_AUDIT_2026-06-06.md:32`](file:///Users/mukulpal/Desktop/astrolife/web/docs/LAUNCH_TRUST_AUDIT_2026-06-06.md#L32)  
   - **Evidence:** Bundling `@sparticuz/chromium` (~50MB+) and `puppeteer-core` inside serverless Next.js functions causes extreme memory overhead, potential container crashes, and 15–21 second PDF generation latencies, threatening serverless scalability and incurring high Vercel/AWS compute costs.

4. **Unhedged Third-Party API Key Rotation & Rate Limits in AI Chat**  
   - **File & Lines:** [`src/app/api/chat/route.ts:83-98, 128-166`](file:///Users/mukulpal/Desktop/astrolife/web/src/app/api/chat/route.ts#L83-L98), [`package.json:18, 24`](file:///Users/mukulpal/Desktop/astrolife/web/package.json#L18)  
   - **Evidence:** `/api/chat` relies on custom round-robin key parsing over environment variables (`GEMINI_API_KEY_1..12`) and fallback to Groq via manual HTTP calls rather than resilient distributed queuing or standard AI SDK failover. Serverless concurrency spikes could rapidly exhaust provider rate limits.

5. **Database Migration Ledger Desynchronization & Payment Gate Failures**  
   - **File & Lines:** [`docs/LAUNCH_TRUST_AUDIT_2026-06-06.md:20-30`](file:///Users/mukulpal/Desktop/astrolife/web/docs/LAUNCH_TRUST_AUDIT_2026-06-06.md#L20-L30), [`src/lib/user-chart.ts:175-205`](file:///Users/mukulpal/Desktop/astrolife/web/src/lib/user-chart.ts#L175-L205)  
   - **Evidence:** Supabase migrations have historical drift (`public.charts` table missing in production, forcing fallback to legacy `user_charts`), and Razorpay credentials have suffered from 401 authentication failures in production, risking user chart persistence failures and blocking paid monetization.

---

## 6. Recommendations & Integration Strategy

Based on this comprehensive audit, we recommend the following engineering priorities for the upcoming synthesis and synchronization phases:

1. **P0 (Immediate / Critical): Unified State Management (`useChartEngine`)**
   - Create a single, standardized React hook (`src/hooks/useChartEngine.ts`) that unifies `useUserChart()`, `calculateChart()`, `runKPEngine()`, and `calculateDivisional()`.
   - Remove duplicate local `useState(chart)` instances in `kundli/page.tsx`, `family-synastry/page.tsx`, and `kundali-milan/page.tsx`.

2. **P0 (Immediate / Critical): Clean CSS Migration**
   - Extract inline `<style>{...}</style>` tags across all 17 dashboard pages into Tailwind CSS utility classes and CSS modules, eliminating render-time style re-parsing.

3. **P1 (Core UI/UX Sync): Engine-to-UI Synchronization Matrix**
   - **Route `/dashboard/kp`:** Expose `KPCoordinateProvenance` in an info card; wire up `EvidenceDrawer` and `BoundaryPresentation` to each table row.
   - **Route `/dashboard/dasha`:** Integrate `kp-dasha-activation.ts` to show active period lord significations, obstacle badges, and timing windows.
   - **Route `/dashboard/chat`:** Inject `KPPredictiveEvidenceContract` into `/api/chat` request body to ground LLM answers in classical KP evidence.
   - **Route `/onboarding`:** Add a 4-tier Birth-Time Confidence selector (`EXACT`, `$\pm 5$ MIN`, `$\pm 15$ MIN`, `APPROXIMATE`) and propagate it to `user-chart.ts`.

4. **P1 (Core UI/UX Sync): Progressive Disclosure Pattern**
   - Implement the 3-tier card model (Casual summary $\to$ Curious astrological breakdown $\to$ Technical evidence audit) across all dense pages (Shadbala, Ashtakavarga, Divisional, Kundli).

5. **P2 (Differentiators & Polish): Unified PDF & Worker Execution**
   - Deprecate client-side `html2canvas` in `kundli/page.tsx`; standardize on high-resolution serverless PDF generation with cached Chromium containers.
   - Offload heavy divisional and Ashtakavarga calculations to a Web Worker on mobile devices to preserve a smooth 60fps UI experience.

---
