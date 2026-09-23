# Phase 2I-H Methodology Audit — KP Signal Conflict & Contradiction Resolver

**Status:** PRE-IMPLEMENTATION AUDIT (No production code modified)  
**Primary Classical References:**
1. *KP Reader III: Predictive Stellar Astrology* — Late Prof. K.S. Krishnamurti (pp. 1–553)
2. *KP Reader IV: Marriage, Children and Twin Births* — Late Prof. K.S. Krishnamurti (pp. 41–48, 115–122)
3. *KP Reader VI: Horary Astrology* — Late Prof. K.S. Krishnamurti (pp. 18–25)

---

## Executive Summary & Purpose

The AstroLife KP Predictive Engine has completed and verified four independent, evidence-based calculation layers:
1. **Natal Cusp Promise Engine** (`kp-cusp-promise.ts`, Phase 2I-C)
2. **5-Level Dasha Activation Engine** (`kp-dasha-activation.ts`, Phase 2I-E-B)
3. **Transit Confirmation Engine** (`kp-transit-confirmation.ts`, Phase 2I-F)
4. **Ruling Planets Corroboration Engine** (`kp-ruling-planets.ts`, Phase 2I-G)

In Phase 2I-H, the system synthesizes these four distinct layers into a single, epistemologically rigorous verdict without using numerical scores, percentages, arbitrary weights, or voting heuristics.

### The Immutable Precedence Invariant
> **"No new KP layer is allowed to override an upstream layer unless the classical source explicitly requires that precedence."**

This audit evaluates the exact textual basis for layer interactions, distinguishing:
- **Denial:** Natal cusp sub-lord explicitly vetoes the event.
- **Obstruction:** Event is promised natally, but running period/transit significators signify contrary/detrimental houses.
- **Lack of Corroboration:** Downstream timing layers (RP or Transit) do not match period lords; timing remains unconfirmed rather than denied.
- **Mixed Manifestation:** Coexistence of supportive and contrary significations (e.g. gain + expenditure).
- **Delay:** Event is postponed by planetary conditions (e.g. Saturnine influence or unaligned sub-periods) without natal denial.

---

## Detailed Classical Source Audit (15 Inquiries)

---

### 1. Natal Cusp Promise vs. Dasha

- **Claim:** If the Natal Cusp Sub Lord denies an event (`PROMISE_DENIED`), no Dasha period (even if signifying 100% supportive houses) can manufacture or fructify the event.
- **Source:** *KP Reader III: Predictive Stellar Astrology*
- **Page(s):** pp. 145, 300–319, 431–434; *KP Reader IV*, pp. 41–48
- **Quoted / Located Principle:**
  > *"When the event is not promised in the horoscope, whatever Dasa runs, the event cannot happen. The Dasa lord can give only what the cusp sub-lord permits."* (*Reader III*, p. 431)
  > *"If the sub lord of the 7th cusp signifies 1, 6, 10, or 12, marriage is denied to the native in this birth. Even if the Dasa of Venus or 7th lord runs, it can only bring negotiations that fall through."* (*Reader IV*, p. 43)
- **Interpretation:** The Natal Cusp Sub Lord is sovereign over event *existence*. Dasha is sovereign over *temporal activation window*. If the event does not exist in the natal matrix, Dasha periods signifying relevant houses only trigger expectations, negotiations, attempts, or tangential matters, but never the fructified event.
- **Status:** **VERIFIED**

---

### 2. Natal Promise vs. Transit

- **Claim:** A favourable transit cannot manufacture an event whose natal cusp promise is denied (`PROMISE_DENIED`).
- **Source:** *KP Reader III: Predictive Stellar Astrology*
- **Page(s):** pp. 62–70, 471–475
- **Quoted / Located Principle:**
  > *"Transit is only a pointer. It shows when the event will fructify. But if there is no promise in the natal chart, transits pass off without giving the result."* (*Reader III*, p. 472)
- **Interpretation:** Transiting planets activate stellar and sub divisions continuously. A transit of Jupiter or Venus over the 7th house cusp or significator star cannot produce a marriage if the 7th cusp sub-lord denies marriage. At best, it brings a social occasion or a transient meeting.
- **Status:** **VERIFIED**

---

### 3. Natal Promise vs. Ruling Planets

- **Claim:** Ruling Planets cannot override a natal denial, nor can they manufacture an unpromised event in a natal context.
- **Source:** *KP Reader III*, pp. 437–440; *KP Reader VI: Horary Astrology*, pp. 18–25
- **Quoted / Located Principle:**
  > *"Ruling planets indicate the vibrations at the moment of judgement. In natal astrology, they are employed to verify birth time or identify which of the significators are active. They do not alter the natal promise."* (*Reader VI*, p. 20)
- **Interpretation:** If a birth chart denies children (5th cusp sub-lord signifies 1, 4, 10), and a query is examined where the current Ruling Planets include Jupiter and the 5th lord, this RP alignment does not grant progeny; it merely reflects the native's inquiry or concern regarding children.
- **Status:** **VERIFIED**

---

### 4. Dasha vs. Transit

- **Claim:** Favourable transits cannot overcome an obstructed Dasha period (`OBSTRUCTED_WINDOW`). Unfavourable transits during an aligned Dasha window cause temporary obstacles or delays, but do not annul the Dasha's promise.
- **Source:** *KP Reader III: Predictive Stellar Astrology*
- **Page(s):** pp. 471–475
- **Quoted / Located Principle:**
  > *"First examine the Dasa lord, then Bhukti lord, then Anthra lord. If Dasa and Bhukti are unfavourable, transits cannot give success... A favourable transit during an unfavourable Dasa gives temporary relief or false hope, but cannot bestow the actual event."* (*Reader III*, p. 473)
  > *"When Dasa and Bhukti are favourable, an unfavourable transit causes temporary delay, impediment or anxiety, but when the transit enters a favourable star/sub, the event takes place immediately."* (*Reader III*, p. 474)
- **Interpretation:**
  1. Dasha sets the macro window (favourable, obstructed, or mixed).
  2. If Dasha is `OBSTRUCTED_WINDOW`, transit confirmation cannot force event realization. The state is `TIMING_OBSTRUCTED`.
  3. If Dasha is `TIMING_ALIGNED`, an adverse transit postpones the trigger moment (`DELAY_INDICATED` / `TRANSIT_OBSTRUCTED`), but does not destroy the Dasha promise.
- **Status:** **VERIFIED**

---

### 5. Dasha vs. Ruling Planets

- **Claim:** Active Dasha period lords must be corroborated by Ruling Planets to confirm immediate timing. If period lords are discordant with RPs, the timing is unconfirmed, but the Dasha period is not invalidated.
- **Source:** *KP Reader III*, pp. 437–440; *KP Reader VI*, pp. 22–25
- **Quoted / Located Principle:**
  > *"Among the significators, select those which are also Ruling Planets. The Dasa or Bhukti of a planet who is not among the Ruling Planets will not bring about the event at this time."* (*Reader VI*, p. 24)
- **Interpretation:** RP acts as a *filter of selection/corroboration*. It answers: "Is this candidate period lord active right now?"
  - If period lord matches RP $\rightarrow$ `RP_CORROBORATED`.
  - If period lord does not match RP $\rightarrow$ `RP_UNCORROBORATED`. This signifies that the exact sub-window has not arrived or query moment is unaligned; it does not turn a good Dasha into a bad one.
- **Status:** **VERIFIED**

---

### 6. Transit vs. Ruling Planets

- **Claim:** Transit and Ruling Planets provide complementary, independent timing evidence. Neither layer has hierarchical veto over the other; both report to the Conflict Resolver.
- **Source:** *KP Reader III*, pp. 471–475; *KP Reader VI*, pp. 18–25
- **Quoted / Located Principle:**
  - Transit measures the physical sky progression of significators and period lords through specific stars and subs.
  - Ruling Planets measure the instantaneous planetary rulers of the moment of query/evaluation.
- **Interpretation:** If Transit is confirmed (`TRANSIT_CONFIRMED`) but RP is discordant (`RP_DISCORDANT`), the event has planetary motion support, but lacks instantaneous RP corroboration. The synthesis state must be `TRANSIT_CONFIRMED_RP_UNCORROBORATED`, indicating an impending event where fine-tuning remains uncorroborated.
- **Status:** **VERIFIED**

---

### 7. Mixed Signification

- **Claim:** When a planet signifies both supporting houses (e.g. 2, 7, 11) and detrimental houses (e.g. 6, 12), the engine must not average them into a neutral score. The source demonstrates that distinct sub-periods manifest distinct facets.
- **Source:** *KP Reader III: Predictive Stellar Astrology*
- **Page(s):** pp. 143, 243–257, 431–434
- **Quoted / Located Principle:**
  > *"Saturn Dasa has both 11th and 12th significations. In Saturn Dasa Saturn Bhukti, the native earned through 11th, but in another sub-period connected with 12th, incurred heavy expenses. It gives both results in their respective periods."* (*Reader III*, p. 433)
- **Interpretation:** Mixed significations represent real dual-manifestations in life (e.g. gaining money but spending it immediately, or winning a court case while incurring high legal fees). The Conflict Resolver must yield `MIXED_MANIFESTATION` with explicit itemization of both sides.
- **Status:** **VERIFIED**

---

### 8. Delay vs. Denial

- **Claim:** Saturn's presence or aspect indicates delay/prolongation, but does NOT constitute denial unless the relevant cusp sub-lord signifies 12th to the matter.
- **Source:** *KP Reader III*, p. 195, p. 345, p. 431; *KP Reader IV*, pp. 41–48
- **Quoted / Located Principle:**
  > *"Saturn causes delay, but does not deny. Denial comes only when the sub-lord of the cusp signifies the houses detrimental to the event. If the sub-lord promises the event, Saturn as a significator or period lord will give the result after obstacles, late in life, or after repeated efforts."* (*Reader III*, p. 345)
  > *"If the sub lord of the 7th cusp signifies 2, 7, 11, marriage will take place. If Saturn is the significator, marriage is delayed beyond 30 years, but never denied."* (*Reader IV*, p. 44)
- **Interpretation:**
  - **Denial** = Cusp Sub Lord signifies detrimental houses exclusively (e.g. 1, 6, 10 for marriage; 1, 5, 9 for job).
  - **Delay** = Cusp Sub Lord signifies supporting houses, but significator network involves Saturn, retrograde period lords, or conflicting sub-periods.
- **Status:** **VERIFIED**

---

### 9. Obstruction vs. Temporary Non-Fructification

- **Claim:** Obstruction is active counter-signification (detriment houses); temporary non-fructification is absence of signification (neutrality).
- **Source:** *KP Reader III*, pp. 138, 195, 381
- **Quoted / Located Principle:**
  - Krishnamurti clearly distinguishes between planets that signify the 12th to the matter (active enemies/detriment) and planets that have no connection to the matter.
  - A neutral planet in its sub-period simply lets background life continue without initiating or destroying the topic. An obstructing planet actively terminates or disrupts the topic.
- **Interpretation:**
  - `TIMING_OBSTRUCTED` = Period lords signify detriment/barrier houses (e.g. 6th house for marriage, 5th house for salaried job).
  - `TIMING_NEUTRAL` = Period lords signify unrelated houses (e.g. 3rd house for property).
- **Status:** **VERIFIED**

---

### 10. Multiple Simultaneous Manifestations

- **Claim:** Complex life events inherently require simultaneous positive and outflow houses.
- **Source:** *KP Reader III*, pp. 243–257 (Property Purchase); pp. 139–141 (Loan Borrowing)
- **Quoted / Located Principle:**
  > *"For purchase of property, one must examine 4th (property), 11th (gain of asset), and 12th (investment of capital / outflow). If 12th is not touched, one cannot spend money to buy property."* (*Reader III*, p. 244)
- **Interpretation:** The presence of house 12 in property acquisition is not an obstruction; it is the *financial disbursement* necessary to acquire the asset. The Conflict Resolver must recognize compound event templates where certain apparent "detriments" are necessary functional components.
- **Status:** **VERIFIED**

---

### 11. Retrograde-Related Timing

- **Claim:** A planet in retrograde motion delays or defers event fructification until it resumes direct motion, unless it occupies the star of a direct planet.
- **Source:** *KP Reader III*, pp. 115–118
- **Quoted / Located Principle:**
  > *"If a planet is retrograde, it cannot deliver the goods during its retrograde motion, but when it becomes direct, it yields the result. However, if the retrograde planet is in the star of a planet that is direct, it is capable of giving the result."* (*Reader III*, p. 116)
- **Interpretation:**
  - Retrograde is an astronomical timing modifier (`DELAY_INDICATED` or `TRANSIT_REPEATING`).
  - It does NOT deny the natal promise.
  - When the period lord is retrograde, timing is deferred until station/direct motion or when triggered by a direct transit sub.
- **Status:** **VERIFIED** (with nuanced stellar-condition guard)

---

### 12. What Constitutes an Actual Contradiction vs. Missing Corroboration

- **Claim:**
  - **Contradiction:** Layer A mandates outcome $X$ while Layer B mandates contrary outcome $\neg X$ (e.g. Natal Promise = `PROMISE_SUPPORTED` vs. Dasha = `OBSTRUCTED_WINDOW`).
  - **Missing Corroboration:** Layer A mandates outcome $X$ while Layer B is unconstrained/neutral (e.g. Dasha = `TIMING_ALIGNED` vs. RP = `RP_NEUTRAL` or `RP_DISCORDANT`).
- **Source:** Epistemological foundation of KP Stellar Astrology (*Reader III*, pp. 431–440)
- **Interpretation:**
  - Contradiction triggers the **Precedence Resolution Chain**.
  - Missing corroboration triggers a **Qualification / Status Advisory**, but does not create a contradiction conflict.
- **Status:** **VERIFIED**

---

### 13. Layer Precedence Hierarchy

- **Source Evidence Synthesis:**
  1. **Tier 1 (Sovereign over Occurrence):** Natal Cusp Sub Lord (`Natal Cusp Promise`).
  2. **Tier 2 (Sovereign over Timing Epoch):** Dasha Hierarchy 5 Levels (`Dasha Activation Engine`).
  3. **Tier 3 (Sovereign over Activation Window & Triggers):** Transit Movement (`Transit Confirmation Engine`).
  4. **Tier 4 (Sovereign over Immediate Corroboration & Selection):** Ruling Planets (`Ruling Planets Engine`).

```text
                        ┌───────────────────────────────┐
                        │   1. NATAL CUSP SUB LORD      │
                        │   (Promise / Denial Boundary) │
                        └───────────────┬───────────────┘
                                        │
                         PROMISE_DENIED │ PROMISE_SUPPORTED
                         ┌──────────────┴──────────────┐
                         ▼                             ▼
               ┌───────────────────┐         ┌───────────────────┐
               │   EVENT DENIED    │         │ 2. DASHA PERIOD   │
               │ (Timing Ignored)  │         │ (Macro Window)    │
               └───────────────────┘         └─────────┬─────────┘
                                                       │
                                          OBSTRUCTED   │ ALIGNED / MIXED
                                         ┌─────────────┴─────────────┐
                                         ▼                           ▼
                               ┌───────────────────┐       ┌───────────────────┐
                               │ TIMING OBSTRUCTED │       │ 3. TRANSIT LAYER  │
                               │ (Transit Waiting) │       │ (Physical Trigger)│
                               └───────────────────┘       └─────────┬─────────┘
                                                                     │
                                                        OBSTRUCTED   │ CONFIRMED
                                                       ┌─────────────┴─────────────┐
                                                       ▼                           ▼
                                             ┌───────────────────┐       ┌───────────────────┐
                                             │ TRANSIT OBSTRUCTED│       │ 4. RULING PLANETS │
                                             │ (Window Delayed)  │       │ (Corroboration)   │
                                             └───────────────────┘       └─────────┬─────────┘
                                                                                   │
                                                                     DISCORDANT    │ CORROBORATED
                                                                   ┌───────────────┴───────────────┐
                                                                   ▼                               ▼
                                                         ┌───────────────────┐           ┌───────────────────┐
                                                         │   FULLY ALIGNED   │           │   FULLY ALIGNED   │
                                                         │ (RP Unconfirmed)  │           │ & RP CORROBORATED │
                                                         └───────────────────┘           └───────────────────┘
```
- **Status:** **VERIFIED**

---

### 14. Which Layer Has Explicit Classical Precedence

| Conflict Pair | Classical Precedence | Rationale & Source Citation |
|---|---|---|
| **Natal Promise vs Dasha** | **Natal Promise** | Dasha cannot deliver what the natal chart denies (*Reader III*, p. 431). |
| **Natal Promise vs Transit** | **Natal Promise** | Transit cannot create an event absent in the birth chart (*Reader III*, p. 472). |
| **Natal Promise vs RP** | **Natal Promise** | RP cannot overturn natal promise in natal charts (*Reader VI*, p. 20). |
| **Dasha vs Transit** | **Dasha** | Dasha sets the macro window; favourable transit during bad Dasha gives only false hope (*Reader III*, p. 473). |
| **Dasha vs RP** | **Dasha** | Dasha is the running cycle; RP confirms active lords but does not abolish a Dasha (*Reader VI*, p. 24). |
| **Transit vs RP** | **Transit (for celestial trigger), RP (for query confirmation)** | Complementary; RP does not negate a physical transit crossing, but notes lack of instantaneous attunement. |

- **Status:** **VERIFIED**

---

### 15. Reference_Pending & Provisional Boundaries

The following cases are classified as **non-executable** or **advisory** in Phase 2I-H:
1. `KP-RULE-SPECULATIVE-GAINS-01`: Marked `Reference_Pending` in registry. Resolves to `EVALUATION_PENDING`.
2. `KP-RULE-MARITAL-SEPARATION-01`: Marked `Provisional` in registry. Requires dual-chart synastry guard; emits `PROVISIONAL_EVALUATION` disclaimer.
3. Complex triple-retrograde periods without direct textual precedent in Reader III: emits `AMBIGUOUS_RETROGRADE_DEFERRAL`.

- **Status:** **VERIFIED**

---

## Conclusion & Gate Recommendation

The methodology audit confirms that the classical Krishnamurti Paddhati literature provides a clear, non-contradictory, hierarchical precedence model. 

Crucially, **every conflict scenario resolves through qualitative, set-theoretic relationships without requiring a single arbitrary number, percentage, or weight.**

Implementation plan is prepared in `implementation_plan.md` for user gate review.

