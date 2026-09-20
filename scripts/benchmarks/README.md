# AstroLife Benchmark Harness

> **Permanent Engineering Constitution:**  
> *Calculate precisely. Apply classical rules faithfully. Resolve conflicting signals intelligently. Explain transparently. Never manufacture certainty.*

---

## 1. Overview

The **AstroLife Benchmark Harness** is a reproducible verification suite designed to test the platform's astronomical and astrological calculations against rigorous edge cases and canonical reference data.

It operates under strict architectural isolation:
1. **Layer 1 (Astronomical Computation):** Julian day, obliquity, nutation, ayanamsha, planetary longitudes, speeds, lagna, and cusps.
2. **Layer 2 (Classical Systems):** Parashari, KP, Jaimini, Lal Kitab rules.
3. **No Fabricated Data:** The framework strictly differentiates between verified reference baselines and values marked `REFERENCE_PENDING`. It never invents expected values.

---

## 2. Directory Structure

```
scripts/benchmarks/
├── README.md                # This manual
├── schema.ts                # Strongly-typed benchmark case & result contracts
├── comparator.ts            # Circular angular difference & tolerance comparator
├── runner.ts                # Benchmark execution pipeline
├── report.ts                # Markdown difference report formatter
├── cases/                   # The 10 approved stress categories
│   ├── index.ts
│   ├── nakshatra-boundary.ts
│   ├── navamsha-boundary.ts
│   ├── cusp-boundary.ts
│   ├── historical-timezone.ts
│   ├── midnight.ts
│   ├── sunrise-sunset.ts
│   ├── retrograde-stationary.ts
│   ├── high-latitude.ts
│   ├── true-mean-node.ts
│   └── combustion-boundary.ts
└── output/                  # Raw JSON logs of benchmark runs
```

---

## 3. How to Run the Benchmark

From the project root:

```bash
node --import jiti/register scripts/benchmarks/runner.ts
```

This will:
1. Execute the current calculation engine (`src/lib/astro-engine/calculations.ts` and `panchang.ts`) against all 10 stress test cases.
2. Compare outputs using circular angular arithmetic (e.g. $359.999^\circ$ vs $0.001^\circ \implies 0.002^\circ$ difference, NOT $359.998^\circ$).
3. Generate or update **`DIFFERENCE_REPORT.md`** in the repository root.
4. Save timestamped execution telemetry in `scripts/benchmarks/output/`.

---

## 4. How to Run Automated Unit Tests

To run the automated test suite verifying the harness math, circular angular comparisons, provenance validation, and birth-time confidence policies:

```bash
node --import jiti/register --test scripts/benchmarks/benchmark.test.ts
```

---

## 5. Adding New Test Cases

1. Create a new file in `scripts/benchmarks/cases/<category-name>.ts`.
2. Define a `BenchmarkTestCase` implementing the schema from `schema.ts`.
3. If official Swiss Ephemeris / NASA JPL Horizons coordinates are not yet collected, mark the expected value as `REFERENCE_PENDING`.
4. Register the new case in `scripts/benchmarks/cases/index.ts`.
5. Re-run `node --import jiti/register scripts/benchmarks/runner.ts`.

---

## 6. Metric Evaluation States

* **✅ PASS:** Actual calculation matches the verified reference within the defined tolerance.
* **⚠️ REVIEW:** Difference exceeds strict tolerance but remains within the investigation band.
* **❌ FAIL:** Calculation crashed, was missing, or drifted beyond allowable limits.
* **⏳ REFERENCE_PENDING:** The actual calculation completed normally, but official external baseline figures are awaiting ingestion.

