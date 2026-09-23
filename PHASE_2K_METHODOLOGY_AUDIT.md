# Phase 2K Methodology Audit: Evidence-First Report Integration

**Status:** Approved Architectural Specification & Product-Contract Document  
**Governing Standard:** Deterministic Evidence Graph Sovereignty  
**Execution Phase:** Phase 2K — Sprint A (Foundation)  

---

## 1. Executive Summary & Product Vision

Phases 2I-A through 2I-J established and verified the core mathematical, causal, and boundary invariants of the AstroLife KP Predictive Stack:
- **Phase 2I-H**: Source-backed, rule-specific conflict resolution (`REL-01` to `REL-10`).
- **Phase 2I-I**: 14-point bidirectional evidence graph traceability across 5 canonical scenarios.
- **Phase 2I-J**: Sovereign consumer boundary ensuring that AI receives only the typed `KPPredictiveEvidenceContract` and cannot reason from raw astrological data.

With the underlying predictive engines formally **frozen**, Phase 2K transitions AstroLife from engine verification into the **Product and Report Experience Layer**:

> **Constitutional Invariant**:  
> Phase 2K may transform, organize, summarize, and explain evidence. It must NEVER create new predictive evidence or alter upstream engine states.

### The Product Milestone: *"Show Your Work"*
Rather than issuing opaque, unverifiable predictions or arbitrary percentage scores (*"82% chance of marriage"*), AstroLife becomes an explainable astrological intelligence system where every report conclusion answers:
$$\mathbf{\text{What was found}} \longrightarrow \mathbf{\text{Why it matters}} \longrightarrow \mathbf{\text{Which rule produced it}} \longrightarrow \mathbf{\text{What is uncertain}} \longrightarrow \mathbf{\text{What we do NOT claim}}$$

---

## 2. The Architectural Model: One Evidence Contract to Multiple Surfaces

To prevent presentation fragmentation (e.g., the PDF report, dashboard, and chat developing three diverging interpretations of the same birth chart), Phase 2K enforces a single canonical evidence pipeline:

```text
                  FROZEN PREDICTIVE FOUNDATION
                  (Calculations, Placidus, Significators, Dasha, Transits, RP)
                               │
                               ▼
                 KP PRODUCTION EVIDENCE CONTRACT
                 (kp-production-contract.ts — Phase 2I-J)
                               │
                               ▼
                  EVIDENCE-FIRST VIEW MODEL
                  (src/lib/report/evidence-first-report.ts)
                               │
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
     PDF REPORT            DASHBOARD             CHAT / AI
   (Report Engine)      (Interactive UI)     (Explainability)
          │                    │                    │
          └────────────────────┼────────────────────┘
                               ▼
                      EXPLAINABILITY LAYER
                               │
                               ▼
                   "WHY AM I SEEING THIS?"
             (3 Levels of Progressive Disclosure)
```

---

## 3. The Five-Part Report Section UX Contract

Every predictive and diagnostic section in the AstroLife report follows an identical five-part structure:

### Part 1: What AstroLife Found
Clear, compassionate, human-readable statement of the deterministic synthesis decision:
- **Example (Marriage)**: *"Under the evaluated 7th-cusp promise, legal partnership is not promised in this chart based on primary cuspal sub-lord significations."*
- **Forbidden**: Prohibited scores or probabilities (*"Marriage score: 18/100"* or *"82% chance"*).

### Part 2: Why It Matters
Transparent explanation of the causal chain leading from primary cusp to final synthesis:
$$\text{Primary Cusp} \longrightarrow \text{Sub-Lord} \longrightarrow \text{Significator Houses} \longrightarrow \text{Promise Verdict} \longrightarrow \text{Dasha Hierarchy} \longrightarrow \text{Transit} \longrightarrow \text{Ruling Planets} \longrightarrow \text{Conflict Precedence}$$
The user can see the exact role played by each layer.

### Part 3: Which Rule Produced It
Exact attribution to the classical literature and registered precedence relations:
- **Rule ID**: e.g., `KP-RULE-MARRIAGE-01`
- **Canonical Citation**: e.g., *Prof. K.S. Krishnamurti, KP Reader 3: "Predictive Stellar Astrology", pp. 145, 431.*
- **Conflict Relation**: e.g., `REL-01` (*Natal Promise Sovereignty over Dasha Activation*).
- **Rule**: Exact citations appear **only** when present in the production contract. No metadata is ever fabricated.

### Part 4: What Is Uncertain
Explicit disclosure of epistemological limitations:
- **Status Disclosure**: Identifies whether the rule is `Verified`, `Provisional`, or `Reference_Pending`.
- **Pending Notice**: If `Reference_Pending` (e.g., Speculative Trading under `REL-10`), explicitly states that classical multi-layer conflict precedence is pending verification.
- **Timing Range**: Explicitly outlines the active dasha window limits rather than claiming open-ended certainty.

### Part 5: What We Do NOT Claim (Ethical Boundaries)
Unambiguous statement of ethical and system invariants:
- Astrological indicators reflect set-theoretic tendencies and timing windows, not inescapable fatalism.
- No claim of medical diagnosis, death timing, or financial guarantees.
- Human choice, ethical action, and free will remain sovereign.

---

## 4. Progressive Disclosure: The Three User Levels

To deliver premium clarity for casual users without sacrificing rigorous auditability for scholars and astrologers, Phase 2K organizes explainability into three disclosure tiers:

```text
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 1: Casual User                                        │
│ • What AstroLife Found (Synthesis Decision)                │
│ • Why It Matters (Plain causal overview)                   │
│ • What to Keep in Mind (Ethical guidance & action plan)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ [Click: "See Evidence"]
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 2: Curious User ("Why Am I Seeing This?")             │
│ • Cusp Sub-Lord Significations                             │
│ • Active Dasha Lord Roles (MD / AD)                        │
│ • Transit Confirmation Trigger Points                      │
│ • Ruling Planets Corroboration Summary                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ [Click: "Technical Audit"]
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 3: Advanced Scholar / Auditor                         │
│ • Rule ID & Epistemic Status (Verified / Ref_Pending)       │
│ • Precedence Relation ID (REL-01 through REL-10)            │
│ • Authorized Evidence Node IDs & Trace Hashes              │
│ • Full Canonical Citation (Reader & exact page numbers)     │
│ • Upstream Layer State Immutability Verification           │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Phase 2K Implementation Roadmap

| Sprint | Focus Area | Deliverables |
|:---|:---|:---|
| **Sprint A** *(Current)* | **Foundation & View Models** | `EvidenceFirstSection`, `EvidenceFinding`, view model adapters, serialization, immutability & leakage guards |
| **Sprint B** | **Explainability Components** | Reusable `"Why Am I Seeing This?"` drawer, 3-level progressive disclosure UI |
| **Sprint C** | **AI Integration & Production Gate** | Contract $\to$ Prompt adapter, `validateConsumerNarrative` production gate, regeneration on failure |
| **Sprint D** | **PDF Design System & Generation** | Evidence-first PDF template, typography, page-break engine, clean provenance blocks |
| **Sprint E** | **Interactive Dashboard** | Deep-dive graph navigation, section-to-evidence links, rule provenance explorer |

---

## 6. Sprint A Scope & Acceptance Gate

### Sprint A Objectives:
1. Define the strongly typed **`EvidenceFirstSection`** and **`EvidenceFinding`** presentation models.
2. Implement **`buildEvidenceFirstReport(chart, kpResult)`**:
   - Iterates through the verified event rules in the KP registry.
   - Generates typed `KPPredictiveEvidenceContract` instances.
   - Adapts contracts into `EvidenceFirstSection` presentation objects.
3. Implement adapters for:
   - **Provenance Adapter**: Maps source literature, pages, and relation IDs safely.
   - **Uncertainty Adapter**: Detects `Reference_Pending` and documents boundaries.
   - **Ethical Boundary Adapter**: Automatically attaches standard non-fatalist disclaimers.
4. Comprehensive test harness: `evidence-first-report.test.ts`:
   - 100% data fidelity with underlying evidence contracts.
   - Absolute absence of numeric prediction scores, percentages, and confidence tiers.
   - Strict preservation of `Reference_Pending` and conflict relations.
   - Zero mutation of upstream calculation structures.

