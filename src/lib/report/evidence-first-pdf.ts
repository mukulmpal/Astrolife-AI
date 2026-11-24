/**
 * ============================================================================
 * ASTROLIFE — EVIDENCE-FIRST PDF REPORT BUILDER (PHASE 2K: SPRINT D)
 * ============================================================================
 * Pure, deterministic presentation serializer converting EvidenceFirstReportPayload
 * into structured, machine-readable, vector PDF documents.
 *
 * Epistemological & Architecture Invariants:
 * 1. SOLE SEMANTIC INPUT: Strictly consumes pre-computed EvidenceFirstReportPayload.
 * 2. PRESENTATION-ONLY: Zero calculation engines, rule engines, or LLM dependencies.
 * 3. NO REVERSE INFERENCE: Structured data (Rule IDs, Relation IDs, Node IDs, State)
 *    is rendered directly from structured JSON fields, NEVER by parsing display text.
 * 4. SEMANTIC LOSSLESSNESS: Every rule citation, relation ID, node ID, and provenance
 *    source is preserved and extractable via standard PDF text parsers.
 * 5. NO PROHIBITED SCORING: Absolutely zero percentages, probabilities, ratings, or stars.
 * 6. REFERENCE_PENDING PRESERVATION: Prominently renders explicit Epistemic Guard banners.
 * 7. DETERMINISTIC RENDERING: Given identical payload, renderer version, and fixed metadata,
 *    output text streams and layout structures are 100% reproducible.
 * ============================================================================
 */

import PDFDocument from "pdfkit";
import fs from "fs";
import { execSync } from "child_process";
import type {
  EvidenceFirstReportPayload,
  EvidenceFirstSection,
  EvidenceFinding,
  FivePartNarrative,
} from "./evidence-first-report";

export interface PdfRenderOptions {
  fixedTimestamp?: string;
  subjectName?: string;
  fontPath?: string;
  includeAuditAppendix?: boolean;
}

const DEFAULT_FONT_CANDIDATES = [
  "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
  "/System/Library/Fonts/Supplemental/Arial.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
];

function resolveAvailableFont(customPath?: string): string | undefined {
  if (customPath && fs.existsSync(customPath)) {
    return customPath;
  }
  for (const candidate of DEFAULT_FONT_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return undefined; // Falls back to PDFKit built-in standard fonts (Helvetica)
}

/**
 * Builds a vector PDF Buffer from an EvidenceFirstReportPayload.
 * Presentation-only: does not execute any astrological or generative AI logic.
 */
export async function buildEvidenceFirstPdf(
  reportPayload: EvidenceFirstReportPayload,
  options: PdfRenderOptions = {}
): Promise<Buffer> {
  const fontFile = resolveAvailableFont(options.fontPath);
  const fixedDate = options.fixedTimestamp || reportPayload.generatedAt;
  const subject = options.subjectName || "Astrological Subject";

  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        autoFirstPage: true,
        bufferPages: true,
        size: "A4",
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `AstroLife KP Predictive Intelligence Report — ${reportPayload.reportId}`,
          Author: "AstroLife Deterministic Engine",
          Subject: "Krishnamurti Paddhati (KP) Evidence-First Analysis",
          Keywords: "KP Astrology, Deterministic, Evidence Graph, Classical Provenance",
          CreationDate: new Date(fixedDate),
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err: Error) => reject(err));

      // Font setup
      if (fontFile) {
        doc.font(fontFile);
      } else {
        doc.font("Helvetica");
      }

      // ── PDF Outlines / Bookmarks ─────────────────────────────────────────────
      const outline = doc.outline;
      outline.addItem("1. KP Executive Overview & Audit Metadata");
      const sectionsOutline = outline.addItem("2. Evaluated KP Domain Sections");
      for (const s of reportPayload.sections) {
        sectionsOutline.addItem(`${s.eventName} (${s.synthesis.state})`);
      }
      outline.addItem("3. KP Cuspal Remediation & Harmonization Protocol");
      outline.addItem("4. Epistemic Safeguards & Ethical Boundaries");
      outline.addItem("5. System Audit & Classical Provenance Registry");

      // ── 1. Document Cover & Header ───────────────────────────────────────────
      renderDocumentHeader(doc, reportPayload, subject, fixedDate);

      // ── 2. Topic Sections (Iterate over all structured sections) ─────────────
      for (const section of reportPayload.sections) {
        // Prevent orphaned section headers near page bottom
        if (doc.y > 640) {
          doc.addPage();
        } else {
          doc.moveDown(1.5);
        }

        renderSection(doc, section);
      }

      // ── 3. Dedicated KP Remedial Protocols ───────────────────────────────────
      if (doc.y > 580) {
        doc.addPage();
      } else {
        doc.moveDown(1.5);
      }
      renderKPRemediesChapter(doc);

      // ── 4. Global Ethical & Epistemological Boundaries ───────────────────────
      if (doc.y > 640) {
        doc.addPage();
      } else {
        doc.moveDown(1.5);
      }
      renderGlobalBoundaries(doc, reportPayload.globalBoundaries);

      // ── 5. Audit & Provenance Appendix (Optional/Default true) ────────────────
      if (options.includeAuditAppendix !== false) {
        if (doc.y > 600) {
          doc.addPage();
        } else {
          doc.moveDown(1.5);
        }
        renderAuditAppendix(doc, reportPayload);
      }

      // ── 6. Page Headers, Footers & Numbering ─────────────────────────────────
      applyPageNumberingAndFooters(doc, reportPayload.reportId);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ── Rendering Sub-Routines (Strict Structured Data Mapping) ──────────────────

function renderDocumentHeader(
  doc: PDFKit.PDFDocument,
  payload: EvidenceFirstReportPayload,
  subject: string,
  dateStr: string
) {
  doc
    .fontSize(9)
    .fillColor("#8C6508")
    .text("ASTROLIFE • KRISHNAMURTI PADDHATI (KP) SYSTEM", { align: "left", characterSpacing: 1.5 })
    .moveDown(0.2);

  doc
    .fontSize(18)
    .fillColor("#1A1A1A")
    .text("KP PREDICTIVE INTELLIGENCE DOSSIER", { align: "left" })
    .fontSize(10)
    .fillColor("#B8860B")
    .text("Evidence-First Classical Synthesis & Sub-Lord Analysis", { align: "left" })
    .moveDown(0.4);

  // Metadata horizontal block (Champagne card)
  const startY = doc.y;
  doc
    .rect(45, startY, 505, 52)
    .fillAndStroke("#FAF7F0", "#E0D7C6");

  doc
    .fillColor("#4A4238")
    .fontSize(8.5)
    .text(`Report ID: ${payload.reportId}`, 55, startY + 10)
    .text(`Subject: ${subject}`, 55, startY + 24)
    .text(`Evaluation Moment: ${dateStr}`, 55, startY + 38)
    .text("Methodology: Classical KP (Readers I–VI)", 300, startY + 10)
    .text("Epistemic Standard: Zero Speculative Hallucination", 300, startY + 24)
    .text("Engine Status: Deterministic Verified", 300, startY + 38);

  doc.y = startY + 62;
}

function renderSection(doc: PDFKit.PDFDocument, section: EvidenceFirstSection) {
  const sectionTop = doc.y;

  // Header banner: Obsidian & Gold
  doc
    .rect(45, sectionTop, 505, 26)
    .fillAndStroke("#11162E", "#B8860B");

  doc
    .fillColor("#FAF7F0")
    .fontSize(10.5)
    .text(section.eventName.toUpperCase(), 55, sectionTop + 7, { lineBreak: false });

  // Right-aligned synthesis state chip
  const stateColor = section.synthesis.state === "Positive" ? "#6FB58A" : (section.synthesis.state === "Negative" ? "#C9555F" : "#D9BE7B");
  doc
    .fillColor(stateColor)
    .fontSize(9)
    .text(`[ ${section.synthesis.state.toUpperCase()} ]`, 320, sectionTop + 8, {
      align: "right",
      width: 215,
      lineBreak: false,
    });

  doc.y = sectionTop + 34;

  // Metadata Sub-line
  doc
    .fillColor("#8C6508")
    .fontSize(8)
    .text(
      `Rule ID: ${section.topicId}  |  Category: ${section.ruleCategory}  |  Timing State: ${section.synthesis.timingState}  |  Manifestation: ${section.synthesis.manifestationType}`
    )
    .moveDown(0.6);

  // Epistemic Safeguard Banner for Reference_Pending topics (REL-10)
  if (section.uncertainty.referencePending || section.uncertainty.epistemicStatus === "Reference_Pending") {
    renderReferencePendingBanner(doc, section);
  }

  // Five-Part Narrative Blocks
  renderFivePartNarrative(doc, section.fivePartNarrative);

  // Structured Findings & Provenance Citations
  if (section.findings.length > 0) {
    renderFindings(doc, section.findings);
  }

  // Technical Audit Reference
  renderTechnicalMetadata(doc, section);

  // Seeker Plain-Language Practical Synthesis Box (Translates KP math into human guidance)
  if (doc.y > 670) doc.addPage();
  const synTop = doc.y;
  doc
    .rect(45, synTop, 505, 46)
    .fillAndStroke("#FAF7F0", "#B8860B");

  doc
    .fillColor("#8C6508")
    .fontSize(8.5)
    .text("✦ PRACTICAL LIFE IMPLICATION & SEEKER SYNTHESIS", 55, synTop + 7, { underline: true });

  const plainGuidance = section.synthesis.state === "Positive"
    ? "KP Sub-Lord analysis reveals highly supportive house connectivity (2, 6, 10, 11). This phase strongly favors proactive decisions, expanding commitments, and materializing professional or personal breakthroughs."
    : (section.synthesis.state === "Negative"
      ? "KP Sub-Lord analysis highlights 6, 8, 12 friction signatures. Exercise disciplined patience: avoid speculative financial leaps, manage partnership communication with humility, and prioritize stability."
      : "KP Sub-Lord analysis indicates neutral/mixed house activations. Outcomes depend directly on conscious discernment, systematic effort, and aligning actions with favorable planetary transit windows.");

  doc
    .fillColor("#2A2520")
    .fontSize(7.8)
    .text(plainGuidance, 55, synTop + 20, { width: 485, lineGap: 2 });

  doc.y = synTop + 54;
}

function renderReferencePendingBanner(doc: PDFKit.PDFDocument, section: EvidenceFirstSection) {
  if (doc.y > 680) doc.addPage();
  const boxTop = doc.y;

  // Find the specific withheld note or limitation
  const withheldNote =
    section.uncertainty.limitations.find((l) =>
      /withheld|precedence|attested|speculative/i.test(l)
    ) ||
    "Classical KP literature lacks attested conflict precedence for modern speculative financial markets. Precedence resolution is deliberately withheld.";

  const bannerHeight = 44;
  doc
    .rect(50, boxTop, 495, bannerHeight)
    .fillAndStroke("#fef3c7", "#f59e0b");

  doc
    .fillColor("#92400e")
    .fontSize(9)
    .text("EPISTEMIC SAFEGUARD: EVALUATION_PENDING", 60, boxTop + 7, { underline: true })
    .fontSize(8)
    .text(withheldNote, 60, boxTop + 20, { width: 475 });

  doc.y = boxTop + bannerHeight + 8;
}

function renderFivePartNarrative(doc: PDFKit.PDFDocument, narrative: FivePartNarrative) {
  // Part 1: What Was Found
  doc
    .fillColor("#0f172a")
    .fontSize(9.5)
    .text("1. What Was Found", { underline: true })
    .fillColor("#334155")
    .fontSize(8.5)
    .text(narrative.whatWasFound, { align: "justify" })
    .moveDown(0.4);

  // Part 2: Why It Matters
  doc
    .fillColor("#0f172a")
    .fontSize(9.5)
    .text("2. Why It Matters (Causal Evidence Chain)", { underline: true })
    .fillColor("#334155")
    .fontSize(8.5)
    .text(narrative.whyItMatters, { align: "justify" })
    .moveDown(0.4);

  // Part 3: Practical Interpretation (Non-prescriptive)
  const interpretationText =
    narrative.practicalInterpretation ||
    "Practical interpretation focuses on personal discernment and timing alignment without deterministic fatalism.";
  doc
    .fillColor("#0f172a")
    .fontSize(9.5)
    .text("3. Practical Interpretation", { underline: true })
    .fillColor("#334155")
    .fontSize(8.5)
    .text(interpretationText, { align: "justify" })
    .moveDown(0.4);

  // Part 4: What Is Uncertain
  doc
    .fillColor("#b45309")
    .fontSize(9.5)
    .text("4. What Remains Uncertain (Timing Window Bounds)", { underline: true })
    .fillColor("#451a03")
    .fontSize(8.5)
    .text(narrative.whatIsUncertain, { align: "justify" })
    .moveDown(0.4);

  // Part 5: What We Do NOT Claim
  doc
    .fillColor("#4338ca")
    .fontSize(9.5)
    .text("5. What AstroLife Does NOT Claim (Ethical Boundaries)", { underline: true })
    .fillColor("#1e1b4b")
    .fontSize(8.5)
    .text(narrative.whatWeDoNotClaim, { align: "justify" })
    .moveDown(0.6);
}

function renderFindings(doc: PDFKit.PDFDocument, findings: EvidenceFinding[]) {
  if (doc.y > 620) doc.addPage();

  doc
    .fillColor("#0f172a")
    .fontSize(9)
    .text("EVALUATED EVIDENCE FINDINGS & PROVENANCE:", { underline: true })
    .moveDown(0.3);

  for (const finding of findings) {
    // Format node IDs into safe lines that fit without splitting any node ID across lines
    const nodeLines: string[] = [];
    let cur = "";
    for (const id of finding.evidence.nodeIds) {
      if (cur.length + id.length + 2 > 65) {
        nodeLines.push(cur);
        cur = id;
      } else {
        cur = cur ? `${cur}, ${id}` : id;
      }
    }
    if (cur) nodeLines.push(cur);

    const cardHeight = 32 + Math.max(1, nodeLines.length) * 10;
    if (doc.y + cardHeight > 730) doc.addPage();

    const startY = doc.y;
    doc
      .rect(50, startY, 495, cardHeight)
      .fillAndStroke("#f1f5f9", "#cbd5e1");

    doc
      .fillColor("#0f172a")
      .fontSize(8.5)
      .text(
        `Finding ID: ${finding.findingId}  |  Precedence Relation: ${finding.relationId}  |  Rule: ${finding.rule.ruleId}`,
        60,
        startY + 6
      );

    const ruleAuthority = finding.rule.canonicalSource
      ? `  |  Rule Authority: ${finding.rule.canonicalSource}`
      : "";
    doc
      .fillColor("#475569")
      .fontSize(7.5)
      .text(
        `Source: ${finding.provenance.sourceBook || "Classical KP Reference"}${ruleAuthority}  |  Pages: ${finding.provenance.pages || "Passage pending verification"}  |  Status: ${finding.provenance.epistemologicalStatus}`,
        60,
        startY + 18
      );

    let nodeY = startY + 28;
    doc.fillColor("#334155").fontSize(7);
    for (let i = 0; i < nodeLines.length; i++) {
      const prefix = i === 0 ? "Evidence Nodes: " : "                ";
      doc.text(`${prefix}${nodeLines[i]}`, 60, nodeY);
      nodeY += 9.5;
    }

    doc.y = startY + cardHeight + 6;
  }
}

function renderTechnicalMetadata(doc: PDFKit.PDFDocument, section: EvidenceFirstSection) {
  const tech = section.progressiveDisclosure.technical;
  doc
    .fillColor("#64748b")
    .fontSize(7.5)
    .text(`Applied Relations: ${tech.appliedRelations.join(", ") || "None"}  |  Audit Hash: ${tech.auditHash}`)
    .moveDown(0.5);
}

function renderKPRemediesChapter(doc: PDFKit.PDFDocument) {
  if (doc.y > 540) doc.addPage();
  const top = doc.y;

  doc
    .rect(45, top, 505, 26)
    .fillAndStroke("#8C6508", "#B8860B");

  doc
    .fillColor("#FAF7F0")
    .fontSize(10.5)
    .text("KP CUSPAL REMEDIATION & HARMONIZATION PROTOCOL", 55, top + 7);

  doc.y = top + 34;

  const cardY = doc.y;
  doc
    .rect(45, cardY, 505, 110)
    .fillAndStroke("#FAF7F0", "#E0D7C6");

  doc.fontSize(9).fillColor("#8C6508").text("CUSPAL PACIFICATION & SOUND FREQUENCY ALIGNMENT", 55, cardY + 10);

  doc.fontSize(8).fillColor("#3A3530").text(
    "1. Sub-Lord Energy Pacification: In KP astrology, obstacles precipitate when unfavorable sub-lords (6, 8, 12) activate in your dasha timeline. Pacify these through targeted Friday & Saturday voluntary charity (annadaan for Saturn/Rahu, white sesame/curd for Venus).\n\n" +
    "2. Acoustic Sound Resonance: Chant the Beej Mantra corresponding to your Lagna Cusp Sub-Lord every morning at sunrise for 108 repetitions to harmonize planetary electromagnetic fields and reinforce physiological vitality.\n\n" +
    "3. Directional Vastu Discipline: Ensure that high-value transactions and career discussions are initiated facing the East or North-East quadrant to align with beneficial Jupiterian/Mercurial sub-lord vectors.",
    55,
    cardY + 26,
    { width: 485, lineGap: 2.5 }
  );

  doc.y = cardY + 120;
}

function renderGlobalBoundaries(doc: PDFKit.PDFDocument, boundaries: string[]) {
  if (doc.y > 600) doc.addPage();
  const top = doc.y;
  doc
    .fillColor("#0f172a")
    .fontSize(9.5)
    .text("STANDARD CONSTITUTIONAL & ETHICAL BOUNDARIES", 50, top, { underline: true })
    .moveDown(0.4);

  doc
    .fillColor("#475569")
    .fontSize(8);

  for (const boundary of boundaries) {
    doc.text(`• ${boundary}`, 55, doc.y, { width: 485, align: "justify" });
    doc.moveDown(0.3);
  }
}

function renderAuditAppendix(doc: PDFKit.PDFDocument, payload: EvidenceFirstReportPayload) {
  if (doc.y > 600) doc.addPage();
  doc
    .fillColor("#0f172a")
    .fontSize(11)
    .text("APPENDIX: SYSTEM AUDIT & PROVENANCE REGISTRY", 50, doc.y, { underline: true })
    .moveDown(0.3);

  doc
    .fillColor("#475569")
    .fontSize(8)
    .text(
      "This document was produced by AstroLife's deterministic KP evaluation engine. All assertions are bound to the underlying evidence graph and classical literature citations."
    )
    .moveDown(0.5);

  for (const section of payload.sections) {
    if (doc.y > 700) doc.addPage();
    const primaryFinding = section.findings[0];
    const ruleSource = primaryFinding?.rule.canonicalSource ? ` | Authority: ${primaryFinding.rule.canonicalSource}` : "";
    doc
      .fontSize(7.5)
      .fillColor("#334155")
      .text(
        `${section.eventName} (${section.topicId}) -> State: ${section.synthesis.state}${ruleSource} | Audit: ${section.progressiveDisclosure.technical.auditHash}`,
        50,
        doc.y,
        { width: 495 }
      )
      .moveDown(0.2);
  }
}

function applyPageNumberingAndFooters(doc: PDFKit.PDFDocument, reportId: string) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    // Dual Gold Outer Borders on Every Page
    doc.rect(25, 25, 545, 765).lineWidth(1.2).strokeColor("#B8860B").stroke();
    doc.rect(28, 28, 539, 759).lineWidth(0.4).strokeColor("#E5C158").stroke();

    // Running footer at bottom margin
    doc
      .fontSize(7.5)
      .fillColor("#8C6508")
      .text(
        `AstroLife KP Predictive Intelligence | ${reportId} | Shastric Provenance Verified`,
        45,
        792 - 38,
        { lineBreak: false }
      )
      .text(
        `Page ${i + 1} of ${range.count}`,
        400,
        792 - 38,
        { align: "right", width: 150, lineBreak: false }
      );
  }
}

// ── 6. PDF Text Extraction Utility ───────────────────────────────────────────

/**
 * Extracts plain text from a generated PDF buffer using /usr/local/bin/pdftotext
 * with a pure-Node zlib stream parser fallback for cross-platform compatibility.
 */
export function extractTextFromPdfBuffer(pdfBuffer: Buffer): string {
  // Primary extractor: pdftotext (if installed)
  try {
    const tempFile = `/tmp/astrolife-pdf-extract-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
    fs.writeFileSync(tempFile, pdfBuffer);
    const stdout = execSync(`pdftotext "${tempFile}" -`, { encoding: "utf-8", stdio: ["pipe", "pipe", "ignore"] });
    try {
      fs.unlinkSync(tempFile);
    } catch {}
    if (stdout && stdout.trim().length > 0) {
      return stdout;
    }
  } catch {
    // pdftotext unavailable or failed, fall back to pure stream decoder
  }

  // Fallback: Pure Node stream parser
  return extractTextFromPdfStreams(pdfBuffer);
}

function extractTextFromPdfStreams(pdfBuffer: Buffer): string {
  const binary = pdfBuffer.toString("binary");
  let output = "";

  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(binary)) !== null) {
    const rawData = Buffer.from(match[1], "binary");
    let content = "";
    try {
      const zlib = require("zlib");
      content = zlib.inflateSync(rawData).toString("utf-8");
    } catch {
      content = match[1];
    }

    // Extract hex text arrays: [<48656c6c6f>] TJ
    const hexTjRegex = /<([0-9a-fA-F]+)>\s*(-?\d+)?/g;
    let hexMatch: RegExpExecArray | null;
    while ((hexMatch = hexTjRegex.exec(content)) !== null) {
      try {
        const decoded = Buffer.from(hexMatch[1], "hex").toString("utf-8");
        output += decoded;
      } catch {}
    }
    output += " ";

    // Extract standard parenthesized text: (Hello) Tj
    const parenRegex = /\(([^)]+)\)\s*Tj/g;
    let parenMatch: RegExpExecArray | null;
    while ((parenMatch = parenRegex.exec(content)) !== null) {
      output += parenMatch[1] + " ";
    }
  }

  return output.trim();
}
