# AstroLife Calculation Benchmark — Difference Report

**Run:** 2026-09-23T19:25:16.301Z
**Engine:** AstroLife Calculation Engine (calculations.ts) v3.0.0-moshier
**Reference Source:** Swiss Ephemeris v2.10.03 (DE431) [BASELINE PENDING]

---

## Summary

- **Total Test Cases:** 10
- **Total Evaluated Metrics:** 53
- **Passed:** 53
- **Failed:** 0
- **Review:** 0
- **Reference Pending:** 0

> **Verified Metric Pass Rate:** 100.0%

---

## Case Results

| Case ID | Category | Metric | Expected | Actual | Difference | Tolerance | Status |
|---|---|---|---|---|---|---|---|
| `TC-NAKSHATRA-SANDHI-01` | `nakshatra-boundary` | Sun Longitude | 355.5245 | 355.5244 | 0.0001° | 0.005° | ✅ PASS |
| `TC-NAKSHATRA-SANDHI-01` | `nakshatra-boundary` | Moon Longitude | 0.0028 | 0.0035 | 0.0007° | 0.005° | ✅ PASS |
| `TC-NAKSHATRA-SANDHI-01` | `nakshatra-boundary` | Ascendant (Lagna) | 23.4531 | 23.4512 | 0.0019° | 0.02° | ✅ PASS |
| `TC-NAKSHATRA-SANDHI-01` | `nakshatra-boundary` | Rahu Longitude | 351.4408 | 351.4406 | 0.0002° | 0.01° | ✅ PASS |
| `TC-NAKSHATRA-SANDHI-01` | `nakshatra-boundary` | Ketu Longitude | 171.4408 | 171.4406 | 0.0002° | 0.01° | ✅ PASS |
| `TC-NAKSHATRA-SANDHI-01` | `nakshatra-boundary` | Moon Nakshatra | Ashwini | Ashwini | — | — | ✅ PASS |
| `TC-NAKSHATRA-SANDHI-01` | `nakshatra-boundary` | Moon Nakshatra Pada | 1.0000 | 1.0000 | — | — | ✅ PASS |
| `TC-NAVAMSHA-SANDHI-02` | `navamsha-boundary` | Sun Longitude | 30.1037 | 30.1043 | 0.0006° | 0.005° | ✅ PASS |
| `TC-NAVAMSHA-SANDHI-02` | `navamsha-boundary` | Moon Longitude | 336.2983 | 336.2994 | 0.0011° | 0.005° | ✅ PASS |
| `TC-NAVAMSHA-SANDHI-02` | `navamsha-boundary` | Ascendant (Lagna) | 143.4759 | 143.4760 | 0.0001° | 0.02° | ✅ PASS |
| `TC-NAVAMSHA-SANDHI-02` | `navamsha-boundary` | Jupiter Longitude | 5.5115 | 5.5121 | 0.0006° | 0.005° | ✅ PASS |
| `TC-NAVAMSHA-SANDHI-02` | `navamsha-boundary` | Rahu Longitude | 8.9139 | 8.9144 | 0.0005° | 0.01° | ✅ PASS |
| `TC-NAVAMSHA-SANDHI-02` | `navamsha-boundary` | Ketu Longitude | 188.9139 | 188.9144 | 0.0005° | 0.01° | ✅ PASS |
| `TC-NAVAMSHA-SANDHI-02` | `navamsha-boundary` | Jupiter D9 Navamsha Sign | Taurus | Taurus | — | — | ✅ PASS |
| `TC-CUSP-BOUNDARY-03` | `cusp-boundary` | Sun Longitude | 154.8392 | 154.8393 | 0.0001° | 0.005° | ✅ PASS |
| `TC-CUSP-BOUNDARY-03` | `cusp-boundary` | Ascendant (Lagna) | 157.4536 | 157.4536 | 0.0000° | 0.01° | ✅ PASS |
| `TC-CUSP-BOUNDARY-03` | `cusp-boundary` | Rahu Longitude | 21.3857 | 21.3857 | 0.0000° | 0.01° | ✅ PASS |
| `TC-CUSP-BOUNDARY-03` | `cusp-boundary` | Ketu Longitude | 201.3857 | 201.3857 | 0.0000° | 0.01° | ✅ PASS |
| `TC-CUSP-BOUNDARY-03` | `cusp-boundary` | House 1 Cusp | 157.4536 | 157.4536 | 0.0000° | 0.02° | ✅ PASS |
| `TC-CUSP-BOUNDARY-03` | `cusp-boundary` | House 10 Cusp | 67.4536 | 67.4536 | 0.0000° | 0.02° | ✅ PASS |
| `TC-HISTORICAL-TZ-04` | `historical-timezone` | Sun Longitude | 118.4012 | 118.4012 | 0.0000° | 0.01° | ✅ PASS |
| `TC-HISTORICAL-TZ-04` | `historical-timezone` | Moon Longitude | 289.1787 | 289.1786 | 0.0000° | 0.01° | ✅ PASS |
| `TC-HISTORICAL-TZ-04` | `historical-timezone` | Ascendant (Lagna) | 176.3145 | 176.3145 | 0.0000° | 0.05° | ✅ PASS |
| `TC-HISTORICAL-TZ-04` | `historical-timezone` | Rahu Longitude | 112.4768 | 112.4768 | 0.0000° | 0.01° | ✅ PASS |
| `TC-HISTORICAL-TZ-04` | `historical-timezone` | Ketu Longitude | 292.4768 | 292.4768 | 0.0000° | 0.01° | ✅ PASS |
| `TC-MIDNIGHT-BOUNDARY-05` | `midnight-boundary` | Sun Longitude | 255.6478 | 255.6475 | 0.0003° | 0.005° | ✅ PASS |
| `TC-MIDNIGHT-BOUNDARY-05` | `midnight-boundary` | Moon Longitude | 319.2784 | 319.2784 | 0.0000° | 0.005° | ✅ PASS |
| `TC-MIDNIGHT-BOUNDARY-05` | `midnight-boundary` | Ascendant (Lagna) | 159.9265 | 159.9265 | 0.0000° | 0.02° | ✅ PASS |
| `TC-MIDNIGHT-BOUNDARY-05` | `midnight-boundary` | Rahu Longitude | 74.1279 | 74.1275 | 0.0003° | 0.01° | ✅ PASS |
| `TC-MIDNIGHT-BOUNDARY-05` | `midnight-boundary` | Ketu Longitude | 254.1279 | 254.1275 | 0.0003° | 0.01° | ✅ PASS |
| `TC-MIDNIGHT-BOUNDARY-05` | `midnight-boundary` | Panchang Tithi | Shashthi (6/30) | Shashthi (6/30) | — | — | ✅ PASS |
| `TC-MIDNIGHT-BOUNDARY-05` | `midnight-boundary` | Panchang Yoga | Vyatipata | Vyatipata | — | — | ✅ PASS |
| `TC-MIDNIGHT-BOUNDARY-05` | `midnight-boundary` | Panchang Karana | Garija | Garija | — | — | ✅ PASS |
| `TC-SUNRISE-SUNSET-06` | `sunrise-sunset` | Sun Longitude | 335.7187 | 335.7183 | 0.0004° | 0.01° | ✅ PASS |
| `TC-SUNRISE-SUNSET-06` | `sunrise-sunset` | Ascendant (Lagna) | 334.0446 | 334.0449 | 0.0003° | 0.05° | ✅ PASS |
| `TC-SUNRISE-SUNSET-06` | `sunrise-sunset` | Rahu Longitude | 352.5032 | 352.5027 | 0.0005° | 0.01° | ✅ PASS |
| `TC-SUNRISE-SUNSET-06` | `sunrise-sunset` | Ketu Longitude | 172.5032 | 172.5027 | 0.0005° | 0.01° | ✅ PASS |
| `TC-SUNRISE-SUNSET-06` | `sunrise-sunset` | Panchang Tithi | Ekadashi (11/30) | Ekadashi (11/30) | — | — | ✅ PASS |
| `TC-RETROGRADE-STATIONARY-07` | `retrograde-stationary` | Saturn Longitude | 313.0317 | 313.0320 | 0.0003° | 0.005° | ✅ PASS |
| `TC-RETROGRADE-STATIONARY-07` | `retrograde-stationary` | Rahu Longitude | 7.1701 | 7.1703 | 0.0002° | 0.01° | ✅ PASS |
| `TC-RETROGRADE-STATIONARY-07` | `retrograde-stationary` | Ketu Longitude | 187.1701 | 187.1703 | 0.0002° | 0.01° | ✅ PASS |
| `TC-HIGH-LATITUDE-08` | `high-latitude` | Sun Longitude | 65.6236 | 65.6237 | 0.0001° | 0.01° | ✅ PASS |
| `TC-HIGH-LATITUDE-08` | `high-latitude` | Ascendant (Lagna) | 149.9466 | 149.9465 | 0.0002° | 0.05° | ✅ PASS |
| `TC-HIGH-LATITUDE-08` | `high-latitude` | Rahu Longitude | 6.9504 | 6.9504 | 0.0000° | 0.01° | ✅ PASS |
| `TC-HIGH-LATITUDE-08` | `high-latitude` | Ketu Longitude | 186.9504 | 186.9504 | 0.0000° | 0.01° | ✅ PASS |
| `TC-HIGH-LATITUDE-08` | `high-latitude` | House 1 Cusp | 149.9466 | 149.9465 | 0.0002° | 0.05° | ✅ PASS |
| `TC-HIGH-LATITUDE-08` | `high-latitude` | House 10 Cusp | 59.9466 | 59.9465 | 0.0002° | 0.05° | ✅ PASS |
| `TC-NODE-DIVERGENCE-09` | `true-mean-node` | Rahu Longitude | 356.1475 | 356.1470 | 0.0006° | 0.01° | ✅ PASS |
| `TC-NODE-DIVERGENCE-09` | `true-mean-node` | Ketu Longitude | 176.1475 | 176.1470 | 0.0006° | 0.01° | ✅ PASS |
| `TC-COMBUSTION-BOUNDARY-10` | `combustion-boundary` | Sun Longitude | 180.4379 | 180.4381 | 0.0001° | 0.005° | ✅ PASS |
| `TC-COMBUSTION-BOUNDARY-10` | `combustion-boundary` | Mars Longitude | 189.9543 | 189.9545 | 0.0001° | 0.005° | ✅ PASS |
| `TC-COMBUSTION-BOUNDARY-10` | `combustion-boundary` | Rahu Longitude | 0.6520 | 0.6521 | 0.0000° | 0.01° | ✅ PASS |
| `TC-COMBUSTION-BOUNDARY-10` | `combustion-boundary` | Ketu Longitude | 180.6520 | 180.6521 | 0.0000° | 0.01° | ✅ PASS |

---

## Critical Discrepancies

_No critical discrepancies detected above allowable thresholds._

---

## Governance Note

Per AstroLife Engineering Constitution: Discrepancies between engines do not automatically declare either engine 'correct'. The benchmark identifies variance; engineering investigation determines the root cause (e.g. nutation terms, planetary aberration, true vs mean node series, topocentric parallax, or historical timezone definitions).
