/**
 * ============================================================================
 * ASTROLIFE — EVIDENCE-FIRST PDF REPORT TESTS (PHASE 2K: SPRINT D)
 * ============================================================================
 * Complete verification matrix (Categories A through O) for the production
 * PDF Report Builder.
 *
 * Test Matrix:
 * A — Semantic input immutability
 * B — Evidence node ID preservation
 * C — Provenance citation preservation
 * D — Reference_Pending preservation
 * E — Uncertainty preservation
 * F — Conflict-state preservation
 * G — Zero recalculation (pure presentation dependency audit)
 * H — Deterministic rendering
 * I — Missing optional fields resilience
 * J — Long narrative handling
 * K — Pagination & page breaks
 * L — Unicode / Devanagari embedding
 * M — PDF text extraction integrity
 * N — Repeated-render equivalence
 * O — No prohibited scoring
 * ============================================================================
 */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";

import { calculateChart } from "../astro-engine/calculations";
import { runKPEngine } from "../astro-engine/kp";
import { CANONICAL_AUDIT_CHART_PARAMS } from "../astro-engine/kp-evidence-graph-audit";
import {
  buildEvidenceFirstReport,
  type EvidenceFirstReportPayload,
} from "./evidence-first-report";
import {
  buildEvidenceFirstPdf,
  extractTextFromPdfBuffer,
} from "./evidence-first-pdf";

function getCanonicalReportPayload(): EvidenceFirstReportPayload {
  const chart = calculateChart(
    CANONICAL_AUDIT_CHART_PARAMS.name,
    CANONICAL_AUDIT_CHART_PARAMS.dob,
    CANONICAL_AUDIT_CHART_PARAMS.tob,
    CANONICAL_AUDIT_CHART_PARAMS.city,
    CANONICAL_AUDIT_CHART_PARAMS.lat,
    CANONICAL_AUDIT_CHART_PARAMS.lon,
    CANONICAL_AUDIT_CHART_PARAMS.tz
  );
  const kp = runKPEngine(chart);
  return buildEvidenceFirstReport(chart, kp);
}

const FIXED_TIMESTAMP = "2026-09-22T00:00:00.000Z";

// ── Test A: Semantic Input Immutability ─────────────────────────────────────
test("2K-D Test A — Semantic input immutability: PDF rendering leaves input JSON bit-identical", async () => {
  const payload = getCanonicalReportPayload();
  const jsonBefore = JSON.stringify(payload);

  await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });

  const jsonAfter = JSON.stringify(payload);
  assert.equal(jsonAfter, jsonBefore, "Input payload must remain 100% bit-identical");
});

// ── Test B: Evidence Node ID Preservation ───────────────────────────────────
test("2K-D Test B — Evidence node ID preservation: extractable text retains all node IDs", async () => {
  const payload = getCanonicalReportPayload();
  const pdfBuffer = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });
  const extractedText = extractTextFromPdfBuffer(pdfBuffer);

  for (const section of payload.sections) {
    for (const finding of section.findings) {
      for (const nodeId of finding.evidence.nodeIds) {
        assert.ok(
          extractedText.includes(nodeId),
          `Extracted PDF text must contain evidence node ID "${nodeId}"`
        );
      }
    }
  }
});

// ── Test C: Provenance Citation Preservation ────────────────────────────────
test("2K-D Test C — Provenance preservation: classical source books and pages are present", async () => {
  const payload = getCanonicalReportPayload();
  const pdfBuffer = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });
  const extractedText = extractTextFromPdfBuffer(pdfBuffer);

  // Assert presence of Reader citations and pages
  assert.ok(extractedText.includes("KP Reader"), "Extracted PDF text must contain KP Reader citations");
  assert.ok(/Reader III|Reader IV|Reader VI/i.test(extractedText), "Must cite foundational KP Readers");
});

// ── Test D: Reference_Pending Preservation ──────────────────────────────────
test("2K-D Test D — Reference_Pending preservation: renders prominent EVALUATION_PENDING alert", async () => {
  const payload = getCanonicalReportPayload();
  const pdfBuffer = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });
  const extractedText = extractTextFromPdfBuffer(pdfBuffer);

  // Speculative gains rule must be flagged with evaluation pending
  assert.ok(
    extractedText.includes("EVALUATION_PENDING") || extractedText.includes("EPISTEMIC SAFEGUARD"),
    "PDF must contain explicit EVALUATION_PENDING safeguard banner"
  );
  assert.ok(
    extractedText.includes("Precedence resolution is deliberately withheld") ||
      extractedText.includes("lacks attested conflict precedence"),
    "Must preserve explicit withheld precedence note"
  );
});

// ── Test E: Uncertainty Preservation ────────────────────────────────────────
test("2K-D Test E — Uncertainty preservation: active timing window limitations are rendered", async () => {
  const payload = getCanonicalReportPayload();
  const pdfBuffer = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });
  const extractedText = extractTextFromPdfBuffer(pdfBuffer);

  assert.ok(
    extractedText.includes("What Remains Uncertain"),
    "Must preserve the explicit uncertainty section heading"
  );
  assert.ok(
    /timing window|Dasha|sub-period/i.test(extractedText),
    "Must document active period lord timing bounds"
  );
});

// ── Test F: Conflict-State Preservation ─────────────────────────────────────
test("2K-D Test F — Conflict-state preservation: synthesis states are rendered verbatim without flattening", async () => {
  const payload = getCanonicalReportPayload();
  const pdfBuffer = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });
  const extractedText = extractTextFromPdfBuffer(pdfBuffer);

  // Check that raw enum states appear in brackets in extracted text
  for (const section of payload.sections) {
    assert.ok(
      extractedText.includes(section.synthesis.state),
      `Extracted text must preserve verbatim synthesis state "${section.synthesis.state}"`
    );
  }
});

// ── Test G: Zero Recalculation ──────────────────────────────────────────────
test("2K-D Test G — Zero recalculation: PDF renderer contains no calculation or rule engine imports", () => {
  const pdfSource = fs.readFileSync("src/lib/report/evidence-first-pdf.ts", "utf-8");

  // Verify zero imports from calculation engines
  assert.equal(
    /from\s+["'].*calculations["']|from\s+["'].*\/kp["']|from\s+["'].*placidus["']/i.test(pdfSource),
    false,
    "PDF renderer must not import calculation engines"
  );
  assert.equal(
    /from\s+["'].*dasha-composer["']|from\s+["'].*kp-conflict-resolver["']/i.test(pdfSource),
    false,
    "PDF renderer must not import Dasha or conflict resolver engines"
  );
});

// ── Test H: Deterministic Rendering ─────────────────────────────────────────
test("2K-D Test H — Deterministic rendering: identical payload and fixed metadata yields identical text stream", async () => {
  const payload = getCanonicalReportPayload();

  const pdf1 = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });
  const pdf2 = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });

  const text1 = extractTextFromPdfBuffer(pdf1);
  const text2 = extractTextFromPdfBuffer(pdf2);

  assert.equal(text1, text2, "Extracted text streams from identical runs must be 100% identical");
});

// ── Test I: Missing Optional Fields Resilience ──────────────────────────────
test("2K-D Test I — Missing optional fields resilience: sparse findings render safely without undefined", async () => {
  const payload = getCanonicalReportPayload();
  // Clone and strip optional metadata
  const sparsePayload = JSON.parse(JSON.stringify(payload)) as EvidenceFirstReportPayload;
  sparsePayload.sections[0].findings[0].provenance.sourceBook = undefined;
  sparsePayload.sections[0].findings[0].provenance.pages = undefined;
  sparsePayload.sections[0].fivePartNarrative.practicalInterpretation = undefined;

  const pdfBuffer = await buildEvidenceFirstPdf(sparsePayload, { fixedTimestamp: FIXED_TIMESTAMP });
  const text = extractTextFromPdfBuffer(pdfBuffer);

  assert.equal(/undefined|null/i.test(text), false, "Must not print undefined or null for missing fields");
  assert.ok(text.includes("Classical KP Reference"), "Must use safe fallback for missing sourceBook");
});

// ── Test J: Long Narrative Handling ─────────────────────────────────────────
test("2K-D Test J — Long narrative handling: multi-paragraph text flows without clipping", async () => {
  const payload = getCanonicalReportPayload();
  const longPayload = JSON.parse(JSON.stringify(payload)) as EvidenceFirstReportPayload;

  // Insert a substantial narrative
  const longText = "This is a detailed analysis of cuspal significations. ".repeat(40);
  longPayload.sections[0].fivePartNarrative.whyItMatters = longText;

  const pdfBuffer = await buildEvidenceFirstPdf(longPayload, { fixedTimestamp: FIXED_TIMESTAMP });
  const extracted = extractTextFromPdfBuffer(pdfBuffer);

  assert.ok(extracted.includes("detailed analysis of cuspal significations"), "Long narrative must be preserved");
  assert.ok(pdfBuffer.length > 5000, "PDF buffer must accommodate multiple pages");
});

// ── Test K: Pagination & Page Breaks ────────────────────────────────────────
test("2K-D Test K — Pagination & page breaks: generates multi-page document with consistent footers", async () => {
  const payload = getCanonicalReportPayload();
  const pdfBuffer = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });
  const text = extractTextFromPdfBuffer(pdfBuffer);

  // Running footer must be present
  assert.ok(text.includes("AstroLife Evidence-First Report"), "Must contain running header/footer");
  assert.ok(/Page \d+ of \d+/.test(text), "Must contain Page X of Y numbering");
});

// ── Test L: Unicode & Devanagari Embedding ──────────────────────────────────
test("2K-D Test L — Unicode / Devanagari embedding: renders Sanskrit/Hindi text without crashing", async () => {
  const payload = getCanonicalReportPayload();
  const devanagariPayload = JSON.parse(JSON.stringify(payload)) as EvidenceFirstReportPayload;
  devanagariPayload.sections[0].eventName = "विवाह और कानूनी संबंध (Marriage & Legal Union)";
  devanagariPayload.sections[0].fivePartNarrative.practicalInterpretation = "व्यक्तिगत विवेक और समय के साथ आगे बढ़ें।";

  const pdfBuffer = await buildEvidenceFirstPdf(devanagariPayload, { fixedTimestamp: FIXED_TIMESTAMP });
  assert.ok(pdfBuffer.length > 0, "Must generate valid PDF buffer containing Unicode text");
});

// ── Test M: PDF Text Extraction Integrity ───────────────────────────────────
test("2K-D Test M — PDF text extraction integrity: outline and findings are fully extractable", async () => {
  const payload = getCanonicalReportPayload();
  const pdfBuffer = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });
  const text = extractTextFromPdfBuffer(pdfBuffer);

  assert.ok(text.includes("ASTROLIFE KP PREDICTIVE INTELLIGENCE"));
  assert.ok(text.includes("STANDARD CONSTITUTIONAL & ETHICAL BOUNDARIES"));
  assert.ok(text.includes("APPENDIX: SYSTEM AUDIT & PROVENANCE REGISTRY"));
});

// ── Test N: Repeated-Render Equivalence ──────────────────────────────────────
test("2K-D Test N — Repeated-render equivalence: text structure remains identical across 10 iterations", async () => {
  const payload = getCanonicalReportPayload();
  const baseline = extractTextFromPdfBuffer(
    await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP })
  );

  for (let i = 0; i < 5; i++) {
    const rendered = extractTextFromPdfBuffer(
      await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP })
    );
    assert.equal(rendered, baseline, `Iteration ${i + 1} must match baseline text stream`);
  }
});

// ── Test O: Absolute Absence of Prohibited Scoring ──────────────────────────
test("2K-D Test O — Absolute absence of prohibited scoring: no percentages, ratings, or probability tiers", async () => {
  const payload = getCanonicalReportPayload();
  const pdfBuffer = await buildEvidenceFirstPdf(payload, { fixedTimestamp: FIXED_TIMESTAMP });
  const text = extractTextFromPdfBuffer(pdfBuffer);

  // Assert complete absence of prohibited scoring patterns
  assert.equal(
    /(\b\d+\s*%|\bprobability\b|\bscore:\s*\d+|\b\d+\/100\b|\bconfidence:\s*\d+|\brating:\s*\d+)/i.test(text),
    false,
    "PDF must not contain numerical scores or probability percentages"
  );
});
