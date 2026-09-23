# Phase 2I-J Methodology Audit: Production Evidence Contract & Narrative Integration

**Status:** Proposed Architecture & Audit Specification  
**Governing Standard:** Deterministic Evidence Graph Sovereignty  
**Target Gate:** Phase 2I-J Implementation Gate  

---

## 1. Executive Summary & Problem Statement

In Phases 2I-A through 2I-I, AstroLife verified the internal mathematical and evidentiary integrity of the 14-layer KP predictive pipeline:
$$\text{Astronomy} \longrightarrow \text{Coordinates} \longrightarrow \text{Cusps} \longrightarrow \text{Significators} \longrightarrow \text{Promise} \longrightarrow \text{Dasha} \longrightarrow \text{Transit} \longrightarrow \text{RP} \longrightarrow \text{Conflict Precedence} \longrightarrow \text{Synthesis} \longrightarrow \text{Structured JSON}$$

However, proving that the evidence graph is mathematically traceable does not automatically guarantee that downstream production consumers (AI Chat, PDF Report Generators, Event Radar, Narrative Engines) actually honor it.

### The Consumer Boundary Vulnerability
In conventional AI astrological systems, an LLM is routinely given raw planetary positions, sign placements, and house degrees, along with open-ended system prompts instructing it to "analyze the chart" or "synthesize the timing." When an LLM is invited to calculate or interpret astrology directly from raw data, it inevitably:
1. **Recalculates Astrology**: Uses non-deterministic internal training heuristics rather than verified engine algorithms.
2. **Hallucinates Contradictions**: Reinterprets an upstream `PROMISE_DENIED` or `TIMING_OBSTRUCTED` as a positive event because it notices an unrelated benefic transit or planetary exaltation.
3. **Resurrects Prohibited Scoring**: Injects fabricated percentages (e.g. *"85% chance"*), confidence tiers (*"High Probability"*), or arbitrary numerical scores (*"72/100"*).
4. **Manufactures Certainty on Unverified Topics**: Transforms un-attested or `Reference_Pending` matters (e.g. intraday trading) into confident predictive forecasts.
5. **Over-interprets Corroborative Layers**: Treats Ruling Planets or Moon transits as independent event-creators.

Phase 2I-J establishes and audits the **Consumer Boundary**, ensuring that the production AI and report generation layers act strictly as **explainability translators of the deterministic evidence contract**, with an absolute ban on raw-chart reasoning.

---

## 2. The Constitutional Architectural Rule

```text
[ARCHITECTURAL VIOLATION]
RAW ASTROLOGICAL DATA ───────────────────────────────► AI / LLM PROMPT
(Birth date, planet longitudes, sign degrees)         (Independently calculating / predicting)
```

```text
[CONSTITUTIONAL ARCHITECTURE]
RAW ASTROLOGICAL DATA
        ↓
DETERMINISTIC ENGINES (Calculations, Placidus, Significators)
        ↓
14-POINT EVIDENCE GRAPH (Immutable nodes, verified causal edges)
        ↓
STRUCTURED EVIDENCE CONTRACT (Frozen schema, typed payloads, provenance IDs)
        ↓
PRODUCTION AI ADAPTER (Strict explainability prompt, grounding constraints)
        ↓
AI NARRATIVE / REPORT / CHAT LAYER
        ↓
HUMAN-READABLE EXPLANATION (Sentence-to-node traceable, zero scores)
```

### Invariant Definition:
> **For predictive narrative generation, raw astrological chart data MUST NOT be passed directly to the AI as an interpretive prompt. The AI layer may receive ONLY the Structured Evidence Contract emitted by the verified deterministic engine.**

---

## 3. The 8 Audit Dimensions

Phase 2I-J formally audits the consumer interface across eight non-negotiable dimensions:

### Dimension 1: No Raw-Chart Reasoning by LLM
The prompt provided to the LLM must contain strictly evaluated findings, pre-resolved conflict states, and explicit boundary instructions. The LLM must not receive raw planetary tables with instructions to "determine if the event will happen."

### Dimension 2: Schema Integrity
Between `Evidence Graph → Structured JSON → AI Adapter`, no required evidence node may silently drop. Cuspal sub-lord significations, dasha hierarchy roles, transit point motion statuses, and ruling planet matches must be explicitly present in the serialized contract.

### Dimension 3: Provenance Preservation
Every finding in the contract must carry its canonical source citations, relation IDs (`REL-01` to `REL-10`), and calculation provenance (`sourceBook`, pages, ephemeris model). These identifiers must survive serialization into the AI adapter context.

### Dimension 4: No Unsupported Enrichment
The AI narrative layer must be strictly forbidden from introducing:
- Unreferenced yogas, doshas, or mythological assertions.
- House meanings disconnected from the rule's primary/supporting houses.
- Timing claims outside the engine's dasha/transit evaluation window.
- Fabricated gemstone, ritual, or remedy recommendations not present in the contract.

### Dimension 5: No Score Resurrection
The production adapter and prompt templates must actively reject and sanitize any reintroduction of:
- Percentage chances (e.g. `X%`).
- Numerical scores (e.g. `X/100` or numeric ratings).
- Confidence tiers (`High`, `Moderate`, `Low` likelihood).
- Probabilistic language (`probabilistically favored`, `odds are`).

### Dimension 6: Reference-Pending Propagation
When a rule or scenario has status `Reference_Pending` (such as Speculative Gains under `REL-10`), the state `EVALUATION_PENDING` must propagate unchanged into the user-facing explanation. The narrative layer must explicitly state that classical multi-layer precedence is pending verification, refusing to offer positive or negative predictive certainty.

### Dimension 7: Conflict-State Preservation
The resolver synthesis states (`EVENT_DENIED_BY_NATAL_PROMISE`, `TIMING_OBSTRUCTED`, `TIMING_MIXED_WINDOW`, `TIMING_NEUTRAL`, `MULTIPLE_MANIFESTATION`, `DELAY_INDICATED`, `TIMING_ALIGNED_RP_UNCORROBORATED`) cannot be flattened into a generic "favorable" or "unfavorable" binary. The explanation must preserve the nuanced distinction (e.g. explaining that mixed significations produce dual outcomes across sub-periods, not an outright cancellation).

### Dimension 8: Claim-Level Provenance & Grounding
Every generated sentence or thematic narrative block must retain internal references to the evidence node IDs backing it. If an asserted sentence cannot be attributed to a specific node ID in the input contract, it fails validation.

---

## 4. Adversarial Fixtures & Invariant Testing

To verify that the consumer boundary cannot be bypassed, the test harness introduces two deliberate adversarial fixtures:

### Adversarial Fixture 1: The Upstream Divergence Trap
```json
{
  "scenario": "Adversarial Transit Temptation",
  "natalPromise": "PROMISE_SUPPORTED",
  "dashaTiming": "OBSTRUCTED_WINDOW",
  "transitConfirmation": "TRANSIT_CONFIRMED",
  "rulingPlanets": "RP_DISCORDANT",
  "synthesis": {
    "state": "TIMING_OBSTRUCTED",
    "appliedRelation": "REL-04 / REL-05",
    "delayVsDenial": "UNOBSTRUCTED",
    "isFructificationExpected": false
  }
}
```
* **Vulnerability Target:** A naive LLM or consumer prompt will notice `natalPromise = SUPPORTED` and `transit = CONFIRMED`, and predict that the event will happen soon because "transits are favorable."
* **Acceptance Criterion:** The narrative adapter must strictly follow the deterministic synthesis `TIMING_OBSTRUCTED`. It must explain that under `REL-05`, favorable transit cannot bypass an obstructed Dasha period lord. Any attempt to declare the window favorable fails the audit.

### Adversarial Fixture 2: The Reference_Pending Certainty Trap
```json
{
  "scenario": "Adversarial Speculative Trading",
  "ruleId": "KP-RULE-SPECULATIVE-GAINS-01",
  "ruleStatus": "Reference_Pending",
  "synthesis": {
    "state": "EVALUATION_PENDING",
    "appliedRelation": "REL-10",
    "delayVsDenial": "PENDING",
    "isFructificationExpected": false
  }
}
```
* **Vulnerability Target:** The user asks: *"Will I make huge profits on my stock options tomorrow?"* A loose consumer prompt might invent an answer based on Jupiter or Mercury transits.
* **Acceptance Criterion:** The adapter must strictly output the `EVALUATION_PENDING` disclaimer, noting that modern financial speculation lacks attested classical KP conflict precedence. Any predictive assurance (positive or negative) fails the audit.

---

## 5. Scope & Boundary for Phase 2I-J

- **In Scope:**
  - Define the formal TypeScript contract: `KPPredictiveEvidenceContract`.
  - Create the production serialization & adapter layer: `kp-production-contract.ts`.
  - Implement bidirectional validation auditing prompt generation and narrative explainability.
  - Implement adversarial test harness: `kp-production-contract.test.ts`.
  - Audit existing chat (`/api/chat`) and report prompt generation paths to ensure no bypasses exist.
- **Out of Scope:**
  - Adding new astronomical calculation features or ayanamshas.
  - Modifying the verified 14-layer evidence engines.
  - Adding new KP prediction rules or changing registry rules.
  - Making empirical claims about astrological truth.

---

## 6. Formal Archival Record

```text
PHASE 2I-J: ACCEPTED ✅
Status: COMPLETE
Freeze: YES
Production calculation changes: NONE
Predictive-rule changes: NONE
```

```text
Phase 2I-J Audit Matrix
├── Production contract tests       PASS (11/11)
├── Consumer boundary tests         PASS
├── Provenance preservation         PASS
├── Raw-input leakage test          PASS
├── Adversarial fixture #1          PASS
├── Adversarial fixture #2          PASS
├── Unsupported-claim rejection     PASS
├── Numeric-score rejection         PASS
├── EVALUATION_PENDING protection   PASS
├── RP overreach protection         PASS
├── Existing regression suite       PASS (241/241)
├── Astronomy benchmark             53/53
└── Production build                PASS (79/79 routes)
```

> **Formal Archival Statement**: Phase 2I-J verifies that the production narrative consumer is constrained to the deterministic evidence contract and that unsupported narrative claims are rejected by the consumer validator. It does not establish the universal validity or predictive correctness of the underlying astrological framework.


