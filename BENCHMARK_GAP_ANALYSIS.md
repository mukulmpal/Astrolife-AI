# AstroLife — Benchmark Stress Category Gap Analysis
**Document:** `BENCHMARK_GAP_ANALYSIS.md`  
**Date:** 2026-09-19  
**Role:** Senior Astrology Systems Engineer  
**Status:** Canonical Reference

---

## 1. Executive Purpose

To achieve mathematical and astrological reliability, AstroLife requires an automated benchmark suite that tests calculations against difficult boundary conditions. 

Earlier preliminary audits casually referenced "15 stress categories," but only **10 categories** were rigorously specified in our engineering requirements. In accordance with our permanent engineering constitution (*"Never manufacture certainty"*), we do not fabricate or silently implement unverified categories. 

This document defines:
1. The **10 confirmed and approved stress categories** implemented in the Phase 1 benchmark harness.
2. A formal proposal for **additional candidate categories** (completing the 15), detailing why they matter, whether they should be included, and what reference data is required before implementation.

---

## 2. The 10 Confirmed & Implemented Stress Categories

| Category ID | Category Name | Description & Boundary Condition | Why It Matters |
|---|---|---|---|
| `nakshatra-boundary` | **Nakshatra Sandhi / Boundary** | Planetary longitudes within $\pm 0.05^\circ$ ($\pm 3'$) of a $13^\circ 20'$ nakshatra boundary (e.g., $13^\circ 19'$ vs $13^\circ 21'$). | Nakshatra lord determines the entire Vimshottari Mahadasha sequence and initial balance of years. A $1'$ error can misstate birth dasha balance by months. |
| `navamsha-boundary` | **Navamsha Boundary** | Planetary longitudes within $\pm 0.02^\circ$ ($\pm 1.2'$) of a $3^\circ 20'$ ($200'$) division boundary. | Navamsha (D9) sign determines marital and dharma strength, Pushkaramsha, and Vargottama status. Even a tiny mathematical drift flips the D9 sign. |
| `cusp-boundary` | **Cusp / Bhava Boundary** | Ascendant or house cusps within $\pm 0.05^\circ$ of a sign or KP sub-lord boundary. | Determines whether a planet is located in House $N$ or House $N+1$ in Bhava Chalit and alters KP cuspal sub-lords. |
| `historical-timezone` | **Historical DST / War Time** | Births during historical Daylight Saving Time shifts (e.g., Indian War Time 1942–1945 at UTC+6:30, US/UK summer time changes). | Missing historical DST shifts local clock time by 1 hour (or 30 minutes in India War Time), causing a catastrophic $\sim 15^\circ$ error in the Ascendant. |
| `midnight-boundary` | **Midnight Date Boundary** | Births occurring at 23:59:59, 00:00:00, and 00:00:01 across UTC and local dates. | Tests Julian Day continuity, day rollover, day-of-week (Vara) assignment, and prevents off-by-one calendar day bugs. |
| `sunrise-sunset` | **Sunrise / Sunset Boundary** | Births occurring within $\pm 2$ minutes of local astronomical sunrise or sunset. | Determines Hindu solar day (Vara begins at sunrise, not midnight), Dina/Ratri Hora, Chaughadia, and Ishta Kaala / Dina-Ratri birth classification. |
| `retrograde-stationary` | **Retrograde / Stationary Point** | Planets at their stationary stations ($|\text{speed}| < 0.001^\circ/\text{day}$) before reversing direction. | Tests velocity sign transitions, retrograde flags, and Cheshta Bala calculations in Shadbala. |
| `high-latitude` | **High Latitude** | Birth locations above $60^\circ$ N/S (e.g., Reykjavik, Tromsø, Fairbanks). | Traditional house systems and quadrant systems (Placidus, Sripati) breakdown or experience intercepted signs near polar circles. |
| `true-mean-node` | **True Node vs. Mean Node** | Periods of maximum divergence between osculating (True) lunar node and analytical (Mean) node (up to $1.75^\circ$). | Evaluates the delta between current mean node output and true node standards, alerting users to nakshatra and sign shifts. |
| `combustion-boundary` | **Combustion Boundary** | Planets within $\pm 0.1^\circ$ of the classical combustion orb threshold from the Sun (e.g., Mars at $17^\circ$, Jupiter at $11^\circ$, Saturn at $15^\circ$). | Combustion radically alters planetary dignity, Shadbala, and predictive interpretation. Threshold edges must be deterministic. |

---

## 3. Proposed Additional Categories (Gap Analysis for Categories 11–15)

The following 5 categories are proposed to complete a comprehensive 15-category suite. **They are marked as PENDING REVIEW and will not be executed until approved and verified with reference data.**

### Candidate 11: Gandanta Transition (Riksha Sandhi)
* **Definition:** Planets placed in the final $3^\circ 20'$ of water signs (Cancer, Scorpio, Pisces) transitioning into the first $3^\circ 20'$ of fire signs (Leo, Sagittarius, Aries). Specifically, the critical junction of Revati-Ashwini, Ashlesha-Magha, and Jyeshtha-Mula within $\pm 0^\circ 48'$ (one Pada).
* **Why It Matters:** In Vedic astrology, Gandanta is a major spiritual and psychological vulnerability zone. If an ephemeris drifts across this water-fire junction, it erroneously flags or removes Gandanta dosha.
* **Inclusion Status:** **Recommended for Phase 2 inclusion.**
* **Required Reference Data:** Exact sidereal longitudes across Ashlesha/Magha and Jyeshtha/Mula computed via Swiss Ephemeris Lahiri Chitrapaksha.

### Candidate 12: Polar Interception / Arctic Ascendant Singularity
* **Definition:** Extreme latitudes ($> 66.5^\circ$ N/S) where the ecliptic does not intersect the local horizon, or where the Ascendant can move backwards or jump instantaneously at certain sidereal times.
* **Why It Matters:** Most standard astronomical algorithms divide by zero or produce `NaN` when calculating the Ascendant at polar latitudes.
* **Inclusion Status:** **Recommended as an edge-case robustness test for system crash prevention.**
* **Required Reference Data:** High-latitude astronomical ephemeris standards (e.g., JPL Horizons / Swiss Ephemeris polar ascendant handling).

### Candidate 13: Planetary War (Graha Yuddha) Boundary
* **Definition:** Conjunction between two true planets (Mars, Mercury, Jupiter, Venus, Saturn) within an orb of $\le 1^\circ$ ($60'$) in geocentric apparent longitude.
* **Why It Matters:** In Graha Yuddha, one planet is declared the victor based on northern latitude/apparent brightness, stripping the defeated planet of its functional power in Shadbala. Boundary cases near $1^\circ 00' 01''$ vs $0^\circ 59' 59''$ dictate the entire yoga outcome.
* **Inclusion Status:** **Recommended for Phase 2 inclusion.**
* **Required Reference Data:** Both celestial longitude and celestial latitude (declination/latitude) from Swiss Ephemeris to verify the exact distance vector.

### Candidate 14: Leap Year / Leap Second / Century Boundary
* **Definition:** Birth timestamps at February 29 23:59:59 on leap years (e.g., 2000-02-29, 2024-02-29), century non-leap years (1900-02-28 / 1900-03-01), and Julian/Gregorian calendar switch boundaries.
* **Why It Matters:** Verifies that Julian Day number calculation handles leap day arithmetic flawlessly without drifting by 1 full day.
* **Inclusion Status:** **Recommended for inclusion in calendar/time suite.**
* **Required Reference Data:** US Naval Observatory / Astronomical Almanac standard Julian Day figures.

### Candidate 15: Fast-Moving Moon / Perigee vs. Apogee Velocity Extremes
* **Definition:** Moon at extreme orbital velocity: perigee ($\approx 15.3^\circ/\text{day}$) versus apogee ($\approx 11.8^\circ/\text{day}$).
* **Why It Matters:** The Moon moves roughly $1'$ every 2 minutes. When near perigee, small birth time errors propagate much faster into Nakshatra and Vimshottari dasha balances.
* **Inclusion Status:** **Recommended for dasha calibration testing.**
* **Required Reference Data:** Moon apparent daily motion vector from NASA JPL Horizons.

---

## 4. Governance & Decision Summary

1. **Current Active Baseline:** Only the **10 confirmed categories** are implemented in `scripts/benchmarks/cases/`.
2. **Pending Candidates:** Candidates 11 through 15 are formally documented here and held in `PENDING_REVIEW` state until reference datasets are collected from an authoritative external ephemeris.
3. **Integrity Rule:** Under no circumstances will test cases be seeded with synthetic or imagined expected values. Unverified reference values will remain marked as `REFERENCE_PENDING`.

