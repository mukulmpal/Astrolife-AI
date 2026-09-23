# PHASE 2K-D METHODOLOGY & ARCHITECTURAL AUDIT: PDF REPORT BUILDER

**Status:** GATE REVIEW ONLY — SPECIFICATION & AUDIT (DO NOT MODIFY PRODUCTION CODE)  
**Phase:** 2K Sprint D (PDF Report Builder)  
**Upstream Dependencies:**
- Phase 2I-J: KP Production Evidence Contract (`KPPredictiveEvidenceContract`) [FROZEN]
- Phase 2K-A: Evidence-First View Model (`EvidenceFirstReportPayload`, `EvidenceFirstSection`) [FROZEN]
- Phase 2K-B: Explainability & Inspection Layer (`explainability.ts`) [FROZEN]
- Phase 2K-C: AI Narrative Integration & Grounding (`ai-narrative-integration.ts`) [FROZEN]

---

## 1. Executive Summary & Epistemological Boundary

The **Phase 2K-D PDF Report Builder** is the presentation serialization surface responsible for transforming verified, grounded report payloads (`EvidenceFirstReportPayload` containing `EvidenceFirstSection` and `FivePartNarrative`) into document artifacts (PDF/A compatible structured documents).

### Constitutional Guardrails for 2K-D
1. **PRESENTATION-ONLY SURFACE**: The PDF builder is strictly a visual formatting engine. It is categorically prohibited from calculating planetary positions, determining cusps, evaluating significators, running Dasha math, checking transits, inspecting Ruling Planets, resolving conflicts, or modifying narrative phrasing.
2. **REPORT JSON IS THE SOLE SEMANTIC INPUT**: The renderer accepts only pre-computed, pre-validated `EvidenceFirstReportPayload` JSON. It has zero access to raw astronomical coordinates, ephemeris engines, or external databases.
3. **ZERO LLM CALLS DURING RENDERING**: The PDF renderer never invokes AI models, network endpoints, or generative prompts. All text in the PDF originates strictly from upstream deterministic templates or pre-validated grounded narratives from Phase 2K-C.
4. **SEMANTIC LOSSLESSNESS & TEXT EXTRACTION INTEGRITY**: Every substantive astrological fact, Rule ID, Relation ID, evidence node ID, source book citation, and uncertainty disclaimer present in the input JSON must be preserved and extractable via standard PDF text extraction tools (e.g. `pdf-parse`, `pdf2text`).
5. **ZERO PROHIBITED SCORING**: The PDF renderer must not introduce visual score meters, percentage progress bars, stars, rating badges, or confidence tiers.
6. **REFERENCE_PENDING & UNCERTAINTY PRESERVATION**: Topics bearing `Reference_Pending` (`REL-10`) or `Provisional` status must prominently render explicit uncertainty banners and withheld precedence notices.

---

## 2. End-to-End Presentation Architecture

```text
       FROZEN DETERMINISTIC FOUNDATION (2I-H, 2I-I, 2I-J)
                               │
                               ▼
               KPPredictiveEvidenceContract
                               │
                               ▼
                 Evidence-First View Model (2K-A)
                               │
                               ▼
                   Explainability Model (2K-B)
                               │
                               ▼
            AI Narrative Integration & Grounding (2K-C)
            [Validated & Verified FivePartNarrative]
                               │
                               ▼
                 EvidenceFirstReportPayload JSON
            [Sole Semantic Input to the PDF Builder]
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
 PDF Layout & Page Engine                       Document Schema
 (PdfEvidenceReportBuilder)              (Structure, Headers, Footers)
       │                                               │
       └───────────────────────┬───────────────────────┘
                               │
                               ▼
               Deterministic, Reproducible PDF
               ├── Semantic Losslessness
               ├── Provenance Breadcrumbs
               ├── Tripartite Boundary Cards
               └── Machine-Readable Metadata
```

---

## 3. Core Architectural Requirements & Technical Solutions

### 3.1 Report JSON as the Sole Semantic Input
- The PDF builder entry point is:
  `buildEvidenceFirstPdf(reportPayload: EvidenceFirstReportPayload, options?: PdfRenderOptions): Promise<Buffer>`
- `reportPayload` is treated as immutable (`Object.freeze` in tests). The builder cannot query chart calculation engines, API routes, or Supabase.

### 3.2 PDF Builder as Presentation-Only
- Strictly converts JSON fields into typography, layout blocks, borders, tables, and spacing.
- Any attempt to import `calculations.ts`, `kp.ts`, `placidus.ts`, `dasha-composer.ts`, or `kp-conflict-resolver.ts` from within the PDF builder is an immediate architectural violation.

### 3.3 Semantic Losslessness & Evidence Preservation
Every `EvidenceFirstSection` contains:
1. `eventName`, `topicId` (Rule ID), `ruleCategory`
2. `synthesis.state`, `synthesis.summary`, `timingState`, `manifestationType`, `delayVsDenial`
3. `fivePartNarrative` (`whatWasFound`, `whyItMatters`, `whichRuleProducedIt`, `practicalInterpretation`, `whatIsUncertain`, `whatWeDoNotClaim`)
4. `findings` (`findingId`, `relationId`, `rule`, `evidence.nodeIds`, `provenance`)
5. `uncertainty` (`epistemicStatus`, `referencePending`, `limitations`)
6. `boundaries` (`notClaimed`)
7. `progressiveDisclosure.technical` (`auditHash`, `nodeIds`, `appliedRelations`, `sourceCitations`)

**Losslessness Rule:** The generated PDF must contain extractable text matching all of these fields. If text extraction cannot find `auditHash`, `ruleId`, `relationId`, or canonical citations, the PDF is non-compliant.

### 3.4 Conflict-State Preservation
- The synthesis badge must reflect the exact enum: `EVENT_DENIED_BY_NATAL_PROMISE`, `TIMING_OBSTRUCTED`, `MULTIPLE_MANIFESTATION`, `TIMING_MIXED_WINDOW`, `TIMING_NEUTRAL`, `EVALUATION_PENDING`.
- No visual or textual flattening to binary "Good / Bad" or "Yes / No".

### 3.5 Reference_Pending & Uncertainty Preservation
- Sections with `referencePending === true` or `epistemicStatus === "Reference_Pending"` render an **Epistemic Safeguard Notice Box** with high visual priority:
  *"Evaluation Pending: Classical KP literature lacks attested conflict precedence for modern speculative trading. Precedence resolution is deliberately withheld."*
- Prohibits suppressing uncertainty warnings for layout convenience.

### 3.6 Absolute Absence of Scoring & Probabilities
- No numerical ratings (e.g. `8/10`, `85%`).
- No visual bar graphs representing "strength" or "probability".
- No color-coded green/red speedometers or star ratings.

### 3.7 Deterministic Rendering & Reproducible Output
- Identical JSON input rendered twice with the same fixed timestamp must yield bit-identical PDF text streams.
- Page counts, line wraps, and section bounding boxes must be deterministic.

### 3.8 Layout, Pagination & Page-Break Behavior
- **Section Integrity**: Each major topic section (e.g. Marriage, Career, Property) starts with clear headings.
- **Orphan / Widow Control**: Headings must never be orphaned at the bottom of a page without at least 3 lines of following narrative text.
- **Page Overflow**: Substantive sections with multiple findings flow gracefully across page breaks without clipping text or dropping footers.

### 3.9 Missing & Optional Field Resilience
- Sparse findings (missing pages or optional citations) fall back safely to `"Passage pending verification"` or `"Classical KP Reference"`.
- Empty arrays or missing notes render clean, non-crashing empty states without printing `undefined` or `null`.

### 3.10 Long Narrative Handling
- Multi-paragraph text in `whyItMatters` or `practicalInterpretation` flows cleanly with automatic text wrapping.
- Table columns adjust dynamically or wrap safely to prevent horizontal page overflow.

### 3.11 Unicode & Multilingual (Hindi / English) Support
- Proper font embedding supporting UTF-8 glyphs, Devanagari characters, Sanskrit astrological symbols, and standard Latin typography.
- No garbled text or replacement characters (``) in rendered output.

### 3.12 Header, Footer & Metadata Consistency
- **Header**: Report Title, AstroLife Identifier, Subject Name, Generation Date.
- **Footer**: Page Number (`Page X of Y`), Confidentiality Notice, Deterministic Report ID (`ASTROLIFE-EVIDENCE-REPORT-...`).
- **PDF Document Properties**: Title, Author ("AstroLife Deterministic Engine"), Producer, CreationDate, and Audit Metadata.

---

## 4. Required Verification Test Matrix (Categories A through O)

The Phase 2K-D test suite (`evidence-first-pdf.test.ts`) must implement and pass all 15 test categories:

| Category | Invariant Tested | Verification Method |
|:---|:---|:---|
| **A: Semantic Input Immutability** | Input JSON is unmutated by PDF rendering | Snapshot JSON string before/after; verify bit-identical |
| **B: Evidence Preservation** | All authorized evidence node IDs are preserved | Text extraction search for all `nodeIds` in document |
| **C: Provenance Preservation** | Classical source books and pages are present | Text extraction search for Reader III/IV citations |
| **D: Reference_Pending** | Epistemic guard rendered prominently for speculative topics | Extract text; assert presence of `EVALUATION_PENDING` disclaimer |
| **E: Uncertainty Preservation** | Active timing limitations and period lord bounds rendered | Extract text; assert presence of Dasha timing limitations |
| **F: Conflict-State Fidelity** | Synthesis states rendered verbatim without binary flattening | Extract text; verify `TIMING_OBSTRUCTED`, `MULTIPLE_MANIFESTATION` |
| **G: Zero Recalculation** | No planetary, cuspal, or rule math re-executed during render | Dependency audit; zero imports from calculation engines |
| **H: Deterministic Rendering** | Identical JSON + fixed timestamp = identical PDF output | Compare extracted text and page count across 2 runs |
| **I: Missing Optional Fields** | Sparse inputs render cleanly without `undefined` or crashes | Render fixture with missing pages; verify safe fallbacks |
| **J: Long Narrative Handling** | Multi-paragraph text renders without clipping or overflow | Render 500-word narrative; verify complete text extraction |
| **K: Pagination & Page Breaks** | Orphan-free page breaks and consistent headers/footers | Verify page count > 1; verify headers/footers on all pages |
| **L: Unicode & Multilingual** | Devanagari and Latin Unicode glyphs render cleanly | Render Hindi phrases; verify text extraction matches glyphs |
| **M: PDF Text Extraction** | All section headings and findings are machine-readable | Verify text parser extracts full semantic outline |
| **N: Repeated-Render Equivalence**| Output structure remains stable across repeated runs | Assert identical text structure across 10 iterations |
| **O: No Prohibited Scoring** | Absolute absence of percentages, scores, probability tiers | Regex search extracted PDF text for prohibited scoring patterns |

---

## 5. Technology Stack & Implementation Approach

### Selected PDF Generation Engine: `PDFKit` (Server-Side Pure Stream)
Why `PDFKit` over Headless Chrome/Puppeteer:
1. **Zero External Browser Dependency**: Runs purely inside Node.js without requiring Chromium binaries, avoiding Vercel cold-boot timeouts and sandbox EPERM issues.
2. **Deterministic Output**: Precise control over coordinates, font embeddings, line breaks, margins, and page events.
3. **High Performance**: Renders multi-page vector documents in < 150ms with minimal memory footprint.
4. **Machine-Readable Vector Text**: Generates searchable, accessible PDF/A conforming streams that guarantee text extraction fidelity.
5. **Unicode Support**: Supports TrueType fonts (e.g. Noto Sans / Roboto) for seamless Devanagari and Latin rendering.

---

## 6. Stop Condition & Gate Compliance

This methodology audit concludes Phase 2K-D design and architecture review. No production code has been modified. Awaiting formal user approval before creating `evidence-first-pdf.ts` and executing Sprint D implementation.

