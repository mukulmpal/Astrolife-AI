# PHASE 2H: KP UNIFIED COORDINATE CONVERSION REPORT

**Document Type:** Astronomical Engine Architecture & Verification Report  
**Phase:** 2H — KP Unified Coordinate Conversion  
**Date:** September 20, 2026  
**Status:** **KP coordinate-frame consistency validated against the Phase 2G methodology decision and project regression suite.**  
**Applies To:** AstroLife Astrological Engine (`src/lib/astro-engine/calculations.ts`, `src/lib/astro-engine/kp.ts`, `src/lib/astro-engine/placidus.ts`)

---

## 1. Problem Description

Prior to Phase 2H, AstroLife's engine suffered from an architectural coordinate split between the Parashari chart engine and the KP engine:

1. **Parashari Chart Engine:** Built on Swiss Ephemeris / Moshier planetary models referenced to the **Chitrapaksha / Lahiri** ayanamsha ($A_{\text{Lahiri}}$) calibrated to the canonical Saha Committee standard ($23^\circ 51' 11.49''$ at J2000.0).
2. **KP Engine Cusps:** Generated Placidus house cusps natively using the **Krishnamurti** ayanamsha ($A_{\text{KP}}$) per K.S. Krishnamurti's canonical 1900 baseline ($22^\circ 22' 33''$).
3. **The Hybrid Anomaly:** The KP engine was consuming the raw Lahiri planetary positions directly from the chart object to calculate planet Star Lords, Sub Lords, and Sub-Sub Lords, while evaluating house cusps in the KP coordinate frame. 

Because $A_{\text{Lahiri}} - A_{\text{KP}} \approx +5' 53''$ ($\sim 353$ arcseconds), the planets and cusps were situated in two different sidereal frames displaced by nearly 6 arcminutes. While this discrepancy was invisible for celestial bodies deep within a sub division, it caused false Sub-Lord transitions for points situated within $\sim 353''$ of a sub boundary. Furthermore, house occupancy comparisons evaluating Lahiri planet coordinates against KP Placidus cusps suffered a $5' 53''$ spatial skew.

---

## 2. Phase 2G Evidence Decision

In Phase 2G, a forensic methodology audit established the classical and contemporary consensus for Krishnamurti Padhdhati (KP):

- **Canonical Rule of KP:** In authentic Krishnamurti Padhdhati, **all astronomical points**—including the 12 Placidus house cusps, the 9 planets, Rahu/Ketu, and the Ascendant—must reside strictly in the **Krishnamurti (KP) coordinate frame**.
- **Star Lord, Sub Lord & Sub-Sub Lord Integrity:** A planet's Star Lord and Sub Lord in KP are derived by dividing the sidereal zodiac into 27 stellar zones and 249 sub-zones. These divisions are geometrically bound to the KP zero-point. Feeding a Lahiri longitude into KP sub tables violates the mathematical premise of KP sub-division.
- **Architectural Separation:** The user reaffirmed that AstroLife's primary Parashari engine (Rashi, Navamsha, Vargas, Vimshottari Dasha, and the 53/53 JPL DE441 reference benchmark) must remain 100% Lahiri-based. Therefore, the resolution required a localized, dynamic conversion layer within the KP ingestion pipeline rather than mutating the core planetary engine.

---

## 3. Existing Hybrid Architecture (Pre-2H)

The pre-2H execution flow exhibited the following hybrid structure:

```
[Civil Birth Data] 
       │
       ▼
[calculateChart()] 
       │
       ├─► Planets: Tropical Longitude - A_Lahiri(JD)  ──────► [Lahiri Frame: λ_Lahiri]
       │                                                              │
       ├─► Placidus Cusps: RAMC / Lat - A_KP(JD)       ──────► [KP Frame: λ_KP]
       │                                                              │
       ▼                                                              ▼
[runKPEngine()] ◄─────────────────────────────────────────────────────┘
       │
       ├─► Cusp Sub-Lords:    Evaluated from λ_KP     (KP Frame)
       ├─► Planet Sub-Lords:  Evaluated from λ_Lahiri (Lahiri Frame) ⚠️ MISMATCH
       └─► Bhava Occupancy:   Compared λ_Lahiri against λ_KP cusps   ⚠️ 5'53" SKEW
```

### Consequences of Pre-2H Hybrid System:
1. **Coordinate Incoherence:** The KP report operated with two different origins simultaneously.
2. **Sub-Lord Drift:** In 4 benchmark charts audited in Phase 2F, 3 out of 40 examined points (7.5%) flipped Sub-Lords across boundaries.
3. **Cusp 1 vs Lagna Row Discrepancy:** In TC-05, the Lagna row had Sub-Lord Venus (from Lahiri $159.9265^\circ$) whereas Cusp 1 had Sub-Lord Moon (from KP $160.0267^\circ$).

---

## 4. New Unified KP Architecture (Phase 2H)

Under Phase 2H, the engine maintains strict modular boundaries. General chart properties remain 100% Lahiri, while the KP ingestion layer dynamically transforms planetary coordinates into the KP coordinate frame:

```
[Civil Birth Data]
       │
       ▼
[calculateChart()] ──► General Chart: planets, Vargas, Dashas, Parashari (100% Lahiri)
       │
       ▼
[normalizeToKPInput()] (Ingestion Boundary)
       │
       ├─► Determines Chart Epoch (JD)
       ├─► Computes exact A_Lahiri(JD) and A_KP(JD)
       ├─► Converts Planets: λ_KP = λ_Lahiri + A_Lahiri(JD) - A_KP(JD)
       ├─► Aligns Lagna to Cusp 1: lagLon = Cusp 1 KP longitude
       ├─► Computes Bhava Occupancy: getPlacidusBhavaHouse(λ_KP, placidusCuspLons)
       └─► Generates KPCoordinateProvenance metadata
       │
       ▼
[runKPEngine()]
       │
       ├─► KP Cusps:               λ_KP ──► Cusp Star, Sub, Sub-Sub Lord
       ├─► KP Planets:             λ_KP ──► Planet Star, Sub, Sub-Sub Lord
       ├─► Bhava Shifts:           λ_KP compared against Placidus cusps (zero skew)
       ├─► KP Significators:       Unified KP frame (Houses I–XII, 4 levels)
       └─► Coordinate Provenance:  Attached to KPEngineResult
```

Both Cusps and Planets now reside in the unified KP sidereal frame.

---

## 5. Exact Conversion Methodology

The conversion operates dynamically through two new pure astronomical functions in `src/lib/astro-engine/calculations.ts`:

### 5.1. Epoch Ayanamsha Retrieval
```typescript
export type SupportedAyanamsha = "Lahiri_Chitrapaksha" | "KP_Krishnamurti";

export function getAyanamshaForEpoch(ayanamsha: SupportedAyanamsha, jd: number): number {
  if (ayanamsha === "KP_Krishnamurti") {
    return computeKPAyanamsha(jd);
  }
  return lahiri(jd);
}
```

### 5.2. Bi-directional Coordinate Transformation
Given a planetary longitude $\lambda_{\text{from}}$ referenced to ayanamsha $A_{\text{from}}(JD)$:
1. Restore the true tropical longitude:
   $$\lambda_{\text{trop}} = (\lambda_{\text{from}} + A_{\text{from}}(JD)) \pmod{360^\circ}$$
2. Re-project into the target sidereal frame $A_{\text{to}}(JD)$:
   $$\lambda_{\text{to}} = (\lambda_{\text{trop}} - A_{\text{to}}(JD)) \pmod{360^\circ}$$

```typescript
export function convertLongitudeBetweenAyanamshas(
  longitude: number,
  fromAyanamsha: SupportedAyanamsha,
  toAyanamsha: SupportedAyanamsha,
  jd: number
): number {
  if (fromAyanamsha === toAyanamsha) return ((longitude % 360) + 360) % 360;
  const fromAyan = getAyanamshaForEpoch(fromAyanamsha, jd);
  const toAyan = getAyanamshaForEpoch(toAyanamsha, jd);
  const tropical = ((longitude + fromAyan) % 360 + 360) % 360;
  return ((tropical - toAyan) % 360 + 360) % 360;
}
```

---

## 6. Why a Hard-coded 353" Offset Was Rejected

A hard-coded constant (such as $+0.098056^\circ$, $+353''$, or $+5' 53''$) was explicitly rejected due to astronomical drift between the two models:

1. **Precession Rate Divergence:**
   - Lahiri ayanamsha uses the modern IAU precession model ($50.290966''$ / year with cubic $T$ terms) combined with IAU 1980 nutation projection.
   - KP ayanamsha uses the classical Newcomb constant ($50.2388475''$ / year) with linear epoch scaling from 1900.0.
2. **Epoch-Dependent Delta:**
   Evaluating $\Delta A(JD) = A_{\text{Lahiri}}(JD) - A_{\text{KP}}(JD)$ across historical and modern eras demonstrates continuous divergence:

   | Epoch / Date | $A_{\text{Lahiri}}$ | $A_{\text{KP}}$ | $\Delta A$ (Arcseconds) | $\Delta A$ (Degrees) |
   |:---|:---:|:---:|:---:|:---:|
   | **1900-01-01** | $22.466755^\circ$ | $22.375833^\circ$ | $+327.31''$ | $+0.090920^\circ$ |
   | **1943-08-15** | $23.072228^\circ$ | $22.974609^\circ$ | $+351.43''$ | $+0.097619^\circ$ |
   | **2000-01-01** | $23.853194^\circ$ | $23.754777^\circ$ | $+354.30''$ | $+0.098417^\circ$ |
   | **2020-01-01** | $24.128373^\circ$ | $24.031812^\circ$ | $+347.62''$ | $+0.096561^\circ$ |
   | **2024-04-09** | $24.190878^\circ$ | $24.091501^\circ$ | $+357.76''$ | $+0.099377^\circ$ |
   | **2050-01-01** | $24.551214^\circ$ | $24.452667^\circ$ | $+354.77''$ | $+0.098547^\circ$ |

A static offset of $353''$ would introduce an epoch error of up to $26''$ in historical charts and up to $5''$ in modern charts, which could trigger spurious sub-boundary flips. Dynamic calculation guarantees epoch-exact synchronization.

---

## 7. Before / After Boundary-Sensitive Cases

### 7.1. Benchmark Real-World Flips Resolved

| Chart / Point | Pre-2H Longitude Used | Pre-2H Sub-Lord | Phase 2H Unified KP Longitude | Phase 2H Sub-Lord | Resolution |
|:---|:---:|:---:|:---:|:---:|:---|
| **TC-02: Jupiter** | $5.5121^\circ$ (Lahiri) | **Mars** | $5.6102^\circ$ (KP) | **Rahu** | Matches canonical KP frame; eliminates $353.2''$ error. |
| **TC-05: Saturn** | $267.2398^\circ$ (Lahiri) | **Sun** | $267.3363^\circ$ (KP) | **Moon** | Crosses $267^\circ 20' 00''$ boundary into Moon sub; correct in KP. |
| **TC-05: Lagna / Cusp 1** | $159.9265^\circ$ (Lagna) vs $160.0267^\circ$ (Cusp 1) | **Venus** (Lagna) / **Moon** (Cusp 1) | $160.0267^\circ$ (Both) | **Moon** (Both) | Internal conflict resolved: Lagna row and Cusp 1 now identical. |

### 7.2. Critical Sub-Lord Boundary Stress Harness (Phase 6)

The automated boundary harness (`scripts/benchmarks/kp-ayanamsha-boundary-validation.ts`) verified synthetic boundary straddle cases:

```
Test CRIT-01: Ashwini Ketu/Venus Sub Boundary (0° 46' 40" = 0.777778°)
  Lahiri Lon:   0.711734° -> Sub: Ketu (Ashwini)
  KP Lon:       0.811111° -> Sub: Venus (Ashwini)
  Production KP Row Sub: Venus [Evaluated from KP longitude] ✓ PASS

Test CRIT-02: Ashwini Venus/Sun Sub Boundary (3° 00' 00" = 3.000000°)
  Lahiri Lon:   2.933956° -> Sub: Venus (Ashwini)
  KP Lon:       3.033333° -> Sub: Sun (Ashwini)
  Production KP Row Sub: Sun [Evaluated from KP longitude] ✓ PASS

Test CRIT-03: Ashwini Sun/Moon Sub Boundary (3° 40' 00" = 3.666667°)
  Lahiri Lon:   3.600623° -> Sub: Sun (Ashwini)
  KP Lon:       3.700000° -> Sub: Moon (Ashwini)
  Production KP Row Sub: Moon [Evaluated from KP longitude] ✓ PASS

Test CRIT-04: Zodiac 0° Aries Revati/Ashwini Sandhi (0° 00' 00")
  Lahiri Lon:   359.933956° -> Sub: Saturn (Revati)
  KP Lon:       0.033333° -> Sub: Ketu (Ashwini)
  Production KP Row Sub: Ketu [Evaluated from KP longitude] ✓ PASS
```

In all critical test points, production KP evaluated the Sub-Lord strictly from the converted KP longitude, eliminating the prior hybrid bleed.

---

## 8. Regression Suite Results

All automated verification suites were executed against the modified codebase:

1. **Unit & Engine Test Suite (`npm test`):**
   - **51 / 51 tests PASS** (0 failed, 0 skipped).
   - Confirms:
     - Canonical Saha Committee Lahiri baseline preservation.
     - Modern and historical epoch validation.
     - 10/10 KP End-to-End Scenarios pass.
     - 10/10 KP Mathematical Invariants pass.
     - Placidus cusp 180° opposition symmetry and Polar fallbacks.
     - Panchang, Mangal Dosha, and Time Scales test suites.

2. **Canonical Reference Benchmark Suite (`npm run benchmark:run`):**
   - **53 / 53 metrics PASS** (0 FAIL, 0 REVIEW, 0 PENDING).
   - Validates that `calculateChart().planets` remains strictly Lahiri and retains identical JPL DE441 alignment.

3. **Next.js Production Build (`npm run build`):**
   - **79 / 79 static & dynamic routes compiled cleanly** (0 TypeScript errors, 0 build failures).

---

## 9. Provenance Metadata Changes

To ensure complete transparency and enable client auditing, the KP engine output now attaches explicit coordinate provenance:

### 9.1. In `KPEngineResult` & `NatalKPInput`
```typescript
export interface KPCoordinateProvenance {
  sourceAyanamsha: string;         // e.g., "Lahiri_Chitrapaksha"
  targetAyanamsha: string;         // e.g., "KP_Krishnamurti"
  sourceAyanamshaValue: number;    // e.g., 24.190878°
  targetAyanamshaValue: number;    // e.g., 24.091501°
  deltaArcsec: number;             // e.g., 357.76"
  epochJD: number;                 // Julian Day of chart
  conversionMethod: string;        // "dynamic_epoch_conversion"
  unifiedFrame: boolean;           // true
}
```

### 9.2. In Individual Planet & Cusp Rows (`KPRow`)
Each KP row in `result.rows` now provides both coordinate traces:
- `lon`: Converted KP longitude ($^\circ$) used for Star Lord, Sub Lord, Sub-Sub Lord, and Bhava occupancy.
- `sourceLon`: Original raw input longitude from the chart ($^\circ$, typically Lahiri).
- `sourceAyanamsha`: Identifier of input frame (e.g., `"Lahiri_Chitrapaksha"`).
- `kpAyanamsha`: Identifier of KP frame (`"KP_Krishnamurti"`).
- `conversionMethod`: `"dynamic_epoch_conversion"`.

---

## 10. Remaining Limitations & Non-Goals

1. **Non-Goal: Full Swiss Ephemeris C-Library Integration:**
   Phase 2H intentionally retains the pure TypeScript Moshier planetary model with dynamic time scales (TT/UT1) and IAU 1980 nutation. Swiss Ephemeris migration remains unnecessary as all 53 canonical benchmark metrics pass.
2. **Polar Latitude Limitation (Placidus):**
   For geographic latitudes $|lat| \ge 66.5^\circ$, Placidus house cusp division fails due to the diurnal circle not intersecting the horizon. AstroLife's engine automatically falls back to Porphyry cusp division in polar regions while maintaining KP ayanamsha.
3. **True Node vs. Mean Node:**
   Standard KP tradition utilizes Mean Rahu/Ketu. True Node calculations are supported but require conscious selection by the practitioner.
4. **Out of Scope for Phase 2H:**
   No changes were made to Jaimini Karakas, Lal Kitab Varshaphala, Ashtakavarga, or Parashari Shadbala.

---

## Conclusion

Phase 2H successfully establishes a mathematically unified coordinate frame across the entire KP pipeline without corrupting or modifying the Parashari chart engine. All KP cusps, planet longitudes, Nakshatras, Star Lords, Sub Lords, and house occupancies now operate cohesively in the Krishnamurti coordinate frame.

**Final Certification Status:**  
*KP coordinate-frame consistency validated against the Phase 2G methodology decision and project regression suite.*
