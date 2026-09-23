# Phase 2I-G: KP Ruling Planets Engine — Methodology Audit & Pre-Implementation Specification
**Source Reference:** *Predictive Stellar Astrology — 3: KP System* by Late Prof. K.S. Krishnamurti (pp. 125, 437–470), *KP Reader No. VI: Horary Astrology* (pp. 18–25), and *KP Master Specification* Section 4.1.

---

## Executive Summary

Before proposing production code for `src/lib/astro-engine/kp-ruling-planets.ts`, this methodology audit establishes the exact classical foundations of **Ruling Planets (RP)** in Krishnamurti Paddhati.

### Guiding Architectural Tenet
> **Ruling Planets act strictly as an evidentiary filter and corroborator.**
> They do **not** replace or override the Natal Cusp Promise (Phase 2I-C), the 5-Level Dasha Activation (Phase 2I-E-B), or the Transit Confirmation (Phase 2I-F).
> They do **not** use arbitrary numeric scores, weighted sums, or percentage probabilities.

---

## 1. Classical Methodology Audit

### A. Exactly Which Astronomical and KP Points Generate the Ruling Planets?
* **Source**: *KP Reader III* pp. 437–440 ("Ruling Planets"); *KP Reader VI* pp. 18–25.
* **Classical Formulation**:
  At the moment of query, judgement, or evaluation, the primary Ruling Planets are:
  1. **Ascendant Star Lord (Lagna Nakshatra Lord)**: Lord of the constellation rising on the eastern horizon at the evaluation location.
  2. **Ascendant Sign Lord (Lagna Rashi Lord)**: Lord of the zodiac sign rising on the eastern horizon.
  3. **Moon Star Lord (Chandra Nakshatra Lord)**: Lord of the constellation occupied by the Moon at the evaluation instant.
  4. **Moon Sign Lord (Chandra Rashi Lord)**: Lord of the zodiac sign occupied by the Moon.
  5. **Day Lord (Vara Lord)**: Planetary ruler of the astronomical weekday.
* **Refined Sub-Lord Points**:
  6. **Ascendant Sub Lord (Lagna Sub Lord)**: Lord of the sub-division rising in the Ascendant (Reader VI pp. 22–25).
  7. **Moon Sub Lord**: Lord of the sub-division occupied by the Moon.
* **Node Agents (Rahu & Ketu)**:
  - If Rahu or Ketu conjoins an RP, is aspected by an RP, or occupies the sign of an RP, the node represents that planet and is added to the ruling set, classically described as acting with equal or superior strength (Reader III p. 125, 438).
* **Epistemological Classification**:
  - Primary 5 RPs + Node representation: **`VERIFIED`** (Reader III pp. 437–440).
  - Ascendant Sub Lord & Moon Sub Lord: **`VERIFIED`** (Reader VI pp. 22–25).

---

### B. What Is the Exact Moment and Coordinate Frame of Evaluation?
* **Source**: *Reader III* pp. 437–438; *Reader VI* pp. 18–20.
* **Audit Finding**:
  - **Prashna / Query Work**: Exact timestamp ($t_{\text{query}}$) and latitude/longitude of the querent/astrologer.
  - **Natal Verification**: Exact timestamp ($t_{\text{analysis}}$) when the event timing or rectification hypothesis is examined.
  - **Coordinate Frame**: Must strictly reuse the project's **KP Unified Coordinate Frame (`KP_NEWCOMB` Ayanamsha)** with Placidus semi-arc Ascendant calculation.
* **Epistemological Classification**: **`VERIFIED`**.

---

### C. How Is the Day Lord (Vara Lord) Determined?
* **Source**: *Reader III* p. 438.
* **Audit Finding**:
  - The day begins at **local astronomical sunrise**, not civil midnight ($00:00:00$).
  - For example, 03:00 AM on a Tuesday before sunrise belongs to Monday (ruled by the **Moon**).
  - Day lord mapping:
    - Sunday: Sun
    - Monday: Moon
    - Tuesday: Mars
    - Wednesday: Mercury
    - Thursday: Jupiter
    - Friday: Venus
    - Saturday: Saturn
  - Our engine reuses `calculateSunrise` from `src/lib/astro-engine/panchang.ts`.
* **Epistemological Classification**: **`VERIFIED`** (Reader III p. 438).

---

### D. What Is the Classical Order of Strength Among Ruling Planets?
* **Source**: *Reader III* p. 438; *Reader VI* p. 21.
* **Audit Finding**:
  Krishnamurti specifies the core hierarchical sequence of strength for RP selection:
  $$\text{Ascendant Star Lord} > \text{Ascendant Sign Lord} > \text{Moon Star Lord} > \text{Moon Sign Lord} > \text{Day Lord}$$
  with Ascendant Sub Lord & Moon Sub Lord retained strictly as **secondary refinement evidence** (*Reader VI* pp. 22–25).
  - **Critical Boundary**:
    - Distinguish `coreRulingPlanets` (the classical 5 pillars) from `secondaryRulingPlanets` (sub-lords). They must NOT be flattened into "equal" ruling planets.
    - Zero numeric scores, weights, or majority voting (e.g. not 4 out of 5, not 5/7 strong vs 3/7 weak).
* **Epistemological Classification**: **`VERIFIED`** (Qualitative hierarchy and provenance).

---

### E. How Do Retrograde Ruling Planets Behave?
* **Source**: *Reader III* pp. 438–439; *Reader VI* p. 22.
* **Audit Finding**:
  - **Guardrail Enforced**: Do NOT implement a blanket rule that "retrograde RP = eliminated/deferred".
  - There are distinct concepts that must not be conflated:
    1. Retrograde RP
    2. Retrograde transit
    3. Planet occupying a retrograde planet's Star
    4. Retrograde planet's own Star/Sub
  - Model motion and timing as distinct orthogonal attributes:
    - `motionStatus`: `"DIRECT" | "RETROGRADE"`
    - `timingStatus`: `"ACTIVE" | "DEFERRED" | "REFERENCE_PENDING"`
  - Only assign `DEFERRED` where the reviewed source explicitly dictates that exact condition (e.g., direct query timing).
* **Epistemological Classification**: **`VERIFIED`** (Source-bounded deferral).

---

### F. How Are Rahu and Ketu Treated?
* **Source**: *Reader III* pp. 125, 438.
* **Audit Finding**:
  - Nodes do **not** automatically become Ruling Planets.
  - Nodes represent planets through an explicit representation chain:
    $$\text{Node (Rahu/Ketu)} \rightarrow \text{Representation Mechanism (Sign Lord / Conjunction / Aspect)} \rightarrow \text{Represented Core/Secondary RP} \rightarrow \text{RP Evidence}$$
  - The data model preserves the representation chain explicitly (`nodeRepresentations`) rather than flattening nodes into an undifferentiated list.
* **Epistemological Classification**: **`VERIFIED`** (Explicit representation chain).

---

### G. How Do Ruling Planets Interact with Natal Promise, Dasha, and Transit Evidence?
* **Source**: *Reader III* pp. 437–440, 471–475; *Master Specification* Section 4.1.
* **Audit Finding**:
  1. **RP Is Strictly a Filter/Corroborator, NOT an Event Creator or Denier**:
     - `PROMISE_DENIED` belongs sovereignly to the Natal Cusp Promise layer. The RP engine itself does NOT generate `PROMISE_DENIED`.
     - RP absence or discordance does NOT mean the event is denied.
  2. **Deterministic Corroboration States**:
     - `RP_CORROBORATED`: One or more relevant period/transit significators match the active RP evidence set without contradiction.
     - `RP_PARTIAL`: Partial overlap between active period/transit lords and RP evidence.
     - `RP_DISCORDANT`: Active period/transit significators absent from RP evidence set.
     - `RP_NEUTRAL`: Evaluation context unconstrained or no relevant period lord specified.
     - `EVALUATION_PENDING`: Upstream event rule is `REFERENCE_PENDING`.
  3. **Calculation Context**:
     - Explicit `RulingPlanetContext = "NATAL" | "PRASHNA"` with explicit calculation timestamp.
* **Epistemological Classification**: **`VERIFIED`** (Strict corroboration filter).

---

## 2. Epistemological Classification Matrix for Phase 2I-G

| Component / Mechanism | Epistemological Status | Primary Source Citation |
|:---|:---:|:---|
| **5 Primary Ruling Planets** (Asc Star/Sign, Moon Star/Sign, Day Lord) | `VERIFIED` | Reader III pp. 437–440 |
| **Node Representation Chain** (Rahu & Ketu as representational agents) | `VERIFIED` | Reader III pp. 125, 438 |
| **Astronomical Sunrise for Day Lord (Vara)** | `VERIFIED` | Reader III p. 438 |
| **Motion Status & Source-Bounded Deferral (No Universal Deferral)** | `VERIFIED` | Reader III pp. 438–439 |
| **Sub-Lord Refinement** (Asc Sub Lord, Moon Sub Lord as secondary evidence) | `VERIFIED` | Reader VI pp. 22–25 |
| **Classical Order of Strength** (Asc Star > Asc Sign > Moon Star > Moon Sign > Day Lord) | `VERIFIED` | Reader III p. 438; Reader VI p. 21 |
| **RP as Corroborator / Filter of Dasa & Transits** | `VERIFIED` | Reader III pp. 437–440, 471–475 |
| **Arbitrary Numeric Weighted Scoring Sum of RPs** | `REJECTED` | Zero classical basis |

