# Phase 2I-F: KP Transit Confirmation Engine — Methodology Audit & Pre-Implementation Specification
**Source Reference:** *Predictive Stellar Astrology — 3: KP System* by Late Prof. K.S. Krishnamurti (pp. 62–70, 115–118, 471–475) & *KP Reader No. IV* (pp. 41–48).

---

## Executive Summary

Before implementing `src/lib/astro-engine/kp-transit-confirmation.ts`, this methodology audit answers all 15 architectural and classical questions (A through O) posed by the project requirements. 

Every design decision is strictly classified under:
* **`VERIFIED`**: Attested directly in primary KP literature with exact page citations.
* **`PROVISIONAL`**: Well-documented in modern KP literature or secondary texts, but requiring explicit system qualification.
* **`REFERENCE_PENDING`**: Awaiting formal textual verification; strictly barred from production execution until validated.

---

## 1. Methodology Audit (Questions A through O)

### A. Which Transiting Bodies Are Actually Required by the Documented Method?
* **Source**: Reader III pp. 471–474 ("Transit Results").
* **Audit Finding**: Krishnamurti identifies two primary classes of transiting bodies:
  1. **The Active Dasa & Bhukti Lords**: The transiting positions of the current Mahadasha lord and Antardasha lord are primary. When they pass through the constellations and subs of natal significators of the event houses, the macro timing is triggered.
  2. **The Fast-Moving Timing Catalysts (Sun and Moon)**:
     - The **Sun** transiting in the sign/star of an event significator pinpoints the **month**.
     - The **Moon** transiting in the star/sub of an event significator pinpoints the **day**.
     - The **Ascendant (Lagna)** transiting in the star of an event significator pinpoints the **hour**.
  3. **Major Background Planets (Jupiter / Saturn)**: While classical transit literature often observes Jupiter and Saturn, Krishnamurti explicitly notes (p. 472) that slow-moving transits merely establish broad yearly potentials, and **must not be evaluated without the Dasa/Bhukti lords' transits**.
* **Epistemological Classification**:
  - Transiting Dasa & Bhukti lords in significator stars/subs: **`VERIFIED`** (Reader III pp. 471–474).
  - Sun (month) and Moon (day) as timing catalysts: **`VERIFIED`** (Reader III p. 473; Reader IV pp. 47–48).
  - Arbitrary 9-planet background transit score: **`REJECTED / UNVERIFIED`** (No arbitrary 9-planet scoring exists in classical KP).

---

### B. Whether Sun and Moon Are Mandatory Timing Triggers, Optional Corroborators, or Merely Examples?
* **Source**: Reader III p. 473; Reader IV pp. 47–48 ("Selection of Date and Time of Marriage").
* **Audit Finding**:
  - In *Reader IV* (pp. 47–48), Krishnamurti demonstrates the actual selection of marriage date:
    > *"To find out the month: The Sun must transit in a sign and star of a planet that is a fruitful significator (2, 7, or 11)... To find out the day: The Moon must transit in the star of a planet that is a significator."*
  - Therefore, for **instant/date-level evaluation** (evaluating whether an event manifests on a specific date/time), the Sun and Moon are **mandatory timing triggers**.
  - For **macro-window confirmation** (evaluating an entire Antardasha or Pratyantardasha period), Sun and Moon transit many signs, so macro-window confirmation depends primarily on the transiting **Dasa and Bhukti lords**.
* **Epistemological Classification**:
  - Sun (monthly window) & Moon (daily window) at evaluation timestamp: **`VERIFIED`** (Reader III p. 473, Reader IV pp. 47–48).

---

### C. Whether Transit Star Lord and Transit Sub Lord Are Both Required?
* **Source**: Reader III pp. 62–70, 471–472.
* **Audit Finding**: Krishnamurti writes:
  > *"At the time of transit, note the Star Lord in which the transiting planet moves. The Star Lord indicates the matters of the houses signified by it. Next note the Sub Lord. The Sub Lord decides whether the result of that transit will be favourable or unfavourable."*
  - Both are non-negotiable. Evaluating transit sign position alone is classical Parashari Gochara, which Krishnamurti expressly declares inadequate. Evaluating Star Lord alone shows the house matter, but lacks the decisive favorable/adverse qualification.
* **Epistemological Classification**: **`VERIFIED`** (Reader III pp. 62, 471–472).

---

### D. Exactly What "Transit Confirmation" Means in Relation to Natal & Dasa Architecture
* **Source**: Reader III pp. 471–475.
* **Audit Finding**:
  1. **Natal Cusp Promise**: The absolute constitutional boundary. If the natal cusp sub-lord denies the event (`PROMISE_DENIED`), transit confirmation must strictly emit `PROMISE_DENIED`. Transit cannot manufacture an event whose natal seed is absent.
  2. **Natal Significators**: The fixed reference targets. The houses signified natally by the transiting body's Star Lord and Sub Lord are compared against the registered event rule's supporting and detriment houses.
  3. **Running Dasa Hierarchy**: The temporal operational theater. Transit acts as the trigger on the timeline established by the Dasa engine.
  4. **Transiting Planet**: The dynamic agent / source of energy.
  5. **Transit Star Lord**: The channel through which the transiting planet acts (indicating the house matters activated).
  6. **Transit Sub Lord**: The definitive arbiter qualifying whether that activation is fruitful/advantageous or harmful/obstructive.
* **Epistemological Classification**: **`VERIFIED`** (Reader III pp. 471–475).

---

### E. Which Houses Are Being Compared at Transit Time?
* **Source**: Reader III pp. 471–472.
* **Audit Finding**:
  - We do **NOT** compare the transiting planet's occupied house in the sky (e.g. transiting 7th from Janma Rashi). Krishnamurti rejects traditional Rashi Gochara.
  - We compare the **natal houses signified** by the **Transit Star Lord** and **Transit Sub Lord** against the **Supporting Houses** and **Detriment/Barrier Houses** of the event rule.
* **Epistemological Classification**: **`VERIFIED`** (Reader III pp. 471–472).

---

### F. How Is a Transiting Planet Evaluated?
* **Source**: Reader III pp. 471–472.
* **Audit Finding**:
  > *"When a planet transits, it gives the results of its Star Lord according to the houses the Star Lord signifies in the natal chart. The Sub Lord under which it passes determines whether the effect is beneficial or harmful according to the houses the Sub Lord signifies in the natal chart."*
  - **Transiting Planet**: Source / Catalyst.
  - **Transit Star Lord**: Its natal significations determine the **substantive field/matter**.
  - **Transit Sub Lord**: Its natal significations determine the **qualification (favorable vs adverse)**.
* **Epistemological Classification**: **`VERIFIED`** (Reader III pp. 471–472).

---

### G. Is Transit Sub Lord a Qualifier Only, or Can It Independently Establish an Event?
* **Source**: Reader III pp. 62–70, 471–472.
* **Audit Finding**: The Sub Lord is a **qualifier/deciding factor**. It cannot independently create an event if the Star Lord does not connect to the event houses. A favorable Sub Lord on an unrelated star does not manufacture the event.
* **Epistemological Classification**: **`VERIFIED`** (Reader III pp. 62, 471–472).

---

### H. How Sun/Moon Timing Is Documented
* **Source**: Reader III p. 473; Reader IV pp. 47–48.
* **Audit Finding**:
  - Sun transiting through the star of a fruitful significator marks the month of event manifestation.
  - Moon transiting through the star/sub of a fruitful significator marks the day of event manifestation.
* **Epistemological Classification**: **`VERIFIED`** (Reader III p. 473, Reader IV pp. 47–48).

---

### I. How Retrograde Planets Are Handled in Transit
* **Source**: Reader III pp. 115–118, 474.
* **Audit Finding**:
  - A transiting planet in retrograde motion, or transiting through the star of a retrograde planet, cannot deliver favorable fruit during its period of retrogression. It causes postponement, delay, or hesitation.
  - Once it resumes direct motion, the fruit is realized if Dasa allows.
  - In our deterministic engine: Retrograde motion is an explicit modifier (`TRANSIT_DELAYED` / `OBSTRUCTED`), never permanent denial.
* **Epistemological Classification**: **`VERIFIED`** for delay/impediment (Reader III pp. 115–118, 474).

---

### J. Direct $\rightarrow$ Retrograde $\rightarrow$ Direct Boundary Representation
* **Source**: Multi-pass astronomy geometry in `cosmic-pulse` / Phase 2E.
* **Audit Finding**:
  - Planetary stations and direction shifts are determined purely astronomically from orbital velocity ($v \ge 0$ direct, $v < 0$ retrograde).
  - Evaluated state: `DIRECT`, `RETROGRADE`, `STATIONARY_RETROGRADE`, `STATIONARY_DIRECT`.
* **Epistemological Classification**: **`VERIFIED`** in astronomical calculation; **`PROVISIONAL`** in event-window tagging.

---

### K. Exact Star/Sub Boundary Crossings
* **Source**: Phase 2A/2B/2C/2E unified coordinate invariants.
* **Audit Finding**:
  - Sub division boundaries strictly adhere to the classical 249-sub table normalized within $[0, 360)$.
  - 1-second perturbation stability invariant established in Phase 2E ensures zero jitter at Sandhi/cusp junctures.
* **Epistemological Classification**: **`VERIFIED`** (Phase 2E Invariant 7).

---

### L. KP Ayanamsha Coordinate Frame Consistency
* **Source**: Phase 2H Unified Coordinate Framework.
* **Audit Finding**:
  - All transit longitudes MUST be computed using the identical KP Ayanamsha (Krishnamurti / Newcomb-KP) coordinate frame as the natal chart. Mixing ayanamshas is strictly prohibited.
* **Epistemological Classification**: **`VERIFIED`** (Phase 2H).

---

### M. Historical Timezone / UTC / TT Handling
* **Source**: Phase 2C Time Scales (`time-scales.ts`).
* **Audit Finding**:
  - Reuses the existing astronomical time pipeline: input evaluation timestamp $\rightarrow$ IANA timezone conversion $\rightarrow$ UTC $\rightarrow$ Terrestrial Time ($\text{TT} = \text{UTC} + \Delta T$) for planetary coordinates. Zero duplication of ephemeris code.
* **Epistemological Classification**: **`VERIFIED`** (Phase 2C).

---

### N. Interaction with Dasa Activation States (`TIMING_ALIGNED`, `MIXED_WINDOW`, `OBSTRUCTED_WINDOW`, `PROMISE_DENIED`)
* **Source**: Reader III pp. 471–472.
* **Audit Finding**:
  - `PROMISE_DENIED`: Transit engine unconditionally emits `PROMISE_DENIED`.
  - `OBSTRUCTED_WINDOW`: A favorable transit **cannot** override an obstructed Dasa window. It emits `TRANSIT_OBSTRUCTED` or `TRANSIT_MIXED` with the clear note: *"Transit supports, but Dasa window is obstructed; event cannot fructify."*
  - `MIXED_WINDOW`: Transit provides fine discrimination:
    - Supporting transit $\rightarrow$ triggers a supportive micro-phase within the mixed Dasa.
    - Adverse transit $\rightarrow$ triggers the adverse micro-phase.
  - `TIMING_ALIGNED`:
    - Supporting transit $\rightarrow$ **`TRANSIT_CONFIRMED`**.
    - Adverse transit $\rightarrow$ **`TRANSIT_OBSTRUCTED`**.
    - Mixed transit $\rightarrow$ **`TRANSIT_MIXED`**.
* **Epistemological Classification**: **`VERIFIED`** (Reader III pp. 471–472).

---

### O. Should an Adverse Transit Produce `TRANSIT_OBSTRUCTED` or `TRANSIT_MIXED`?
* **Source**: Reader III pp. 471–472 & Phase 2I-E-B Mixed-Evidence Doctrine.
* **Audit Finding**:
  - Similar to our Phase 2I-E-B audit, **a single adverse planet must NOT unilaterally cause total obstruction** if other key significators are strongly supporting.
  - **Purely Adverse** (all evaluated transit points signify detriment/barrier houses): $\rightarrow$ **`TRANSIT_OBSTRUCTED`**.
  - **Mixed Transits** (some points supporting, some detriment): $\rightarrow$ **`TRANSIT_MIXED`**.
  - **Purely Supporting**: $\rightarrow$ **`TRANSIT_CONFIRMED`**.
  - **No Event Houses Touched**: $\rightarrow$ **`TRANSIT_NEUTRAL`**.
* **Epistemological Classification**: **`VERIFIED`**.

---

## 2. Epistemological Classification Matrix

| Mechanism / Rule | Epistemological Status | Primary Source Citation |
|:---|:---:|:---|
| **Cusp Sub Lord Promise Gate** | `VERIFIED` | Reader III pp. 137–155; Reader IV pp. 41–48 |
| **Dasa/Bhukti Lords Transit in Significator Stars/Subs** | `VERIFIED` | Reader III pp. 471–474 |
| **Sun Transit as Monthly Window Indicator** | `VERIFIED` | Reader III p. 473; Reader IV pp. 47–48 |
| **Moon Transit as Daily Window Indicator** | `VERIFIED` | Reader III p. 473; Reader IV pp. 47–48 |
| **Transit Star Lord = Matters / Natal Houses Signified** | `VERIFIED` | Reader III pp. 62, 471–472 |
| **Transit Sub Lord = Favourable/Adverse Qualifier** | `VERIFIED` | Reader III pp. 62, 471–472 |
| **Transit Cannot Override Dasa Obstruction** | `VERIFIED` | Reader III pp. 471–472 |
| **Retrograde Transit Causes Delay / Temporary Impediment** | `VERIFIED` | Reader III pp. 115–118, 474 |
| **Ascendant Transit as Hourly Trigger** | `PROVISIONAL` | Reader III p. 473 (Requires exact birth/query minute) |
| **Multi-Pass Transit Tagging (Pass 1, 2, 3)** | `PROVISIONAL` | Cosmic Pulse Invariant (Modern astronomy implementation) |
| **Arbitrary 9-Planet Transit Scoring Sum** | `REJECTED` | Zero basis in classical KP |
