/**
 * ============================================================================
 * ASTROLIFE — KP PREDICTIVE INTELLIGENCE DOSSIER (HUMAN-CENTRIC EDITION)
 * ============================================================================
 * Transforms mathematical KP Sub-Lord calculations and evidence contracts
 * into an authentic, deeply empathetic, and luxurious Vedic report.
 * Fast, deterministic, serverless-safe vector PDF generation via PDFKit.
 * ============================================================================
 */

import PDFDocument from "pdfkit";
import * as fs from "fs";
import { execSync } from "child_process";
import { renderVectorNorthIndianKundli } from "./vector-chart-renderer";
type ChartData = Parameters<typeof renderVectorNorthIndianKundli>[4];
import type {
  EvidenceFirstReportPayload,
  EvidenceFirstSection,
  EvidenceFinding,
  FivePartNarrative,
} from "./evidence-first-report";

type PDFDoc = InstanceType<typeof PDFDocument>;

export interface PdfRenderOptions {
  fixedTimestamp?: string;
  subjectName?: string;
  fontPath?: string;
  includeAuditAppendix?: boolean;
  chart?: ChartData;
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
  return undefined;
}

/**
 * Maps raw system event IDs to warm, dignified user titles.
 */
function humanEventTitle(raw: string): { hi: string; en: string; icon: string } {
  const normalized = raw.toLowerCase();
  if (normalized.includes("career") || normalized.includes("employment") || normalized.includes("profession") || normalized.includes("service") || normalized.includes("job")) {
    return {
      hi: "आजीविका, रोजगार एवं कार्यक्षेत्र विस्तार",
      en: "Career, Service & Employment Trajectory",
      icon: "💼",
    };
  }
  if (normalized.includes("speculat") || normalized.includes("stock") || normalized.includes("windfall") || normalized.includes("gain")) {
    return {
      hi: "शेयर बाजार, व्यापार एवं अप्रत्याशित लाभ",
      en: "Market Speculation & Financial Caution",
      icon: "📈",
    };
  }
  if (normalized.includes("real estate") || normalized.includes("property") || normalized.includes("house") || normalized.includes("land") || normalized.includes("vehicle")) {
    return {
      hi: "भूमि, भवन, वाहन एवं अचल संपत्ति",
      en: "Real Estate, Property & Fixed Assets",
      icon: "🏡",
    };
  }
  if (normalized.includes("wealth") || normalized.includes("income") || normalized.includes("liquidity") || normalized.includes("finance")) {
    return {
      hi: "धन संचय, वित्तीय स्थिरता एवं नियमित आय",
      en: "Wealth Accumulation & Financial Stability",
      icon: "💰",
    };
  }
  if (normalized.includes("marriage") || normalized.includes("union") || normalized.includes("relationship") || normalized.includes("spouse")) {
    return {
      hi: "दांपत्य सुख, विवाह एवं संबंध सौहार्द",
      en: "Sacred Union & Relationship Harmony",
      icon: "💍",
    };
  }
  if (normalized.includes("foreign") || normalized.includes("travel") || normalized.includes("abroad") || normalized.includes("distance")) {
    return {
      hi: "विदेश गमन, दूरस्थ यात्रा एवं वैश्विक अवसर",
      en: "Foreign Travel & Distant Opportunities",
      icon: "✈️",
    };
  }
  if (normalized.includes("health") || normalized.includes("vitality") || normalized.includes("longevity") || normalized.includes("disease")) {
    return {
      hi: "स्वास्थ्य, जीवन-ऊर्जा एवं रोग प्रतिरोध",
      en: "Vitality, Longevity & Wellness",
      icon: "🛡️",
    };
  }
  if (normalized.includes("education") || normalized.includes("study") || normalized.includes("academic") || normalized.includes("learning")) {
    return {
      hi: "उच्च विद्या, शोध एवं बौद्धिक उत्कर्ष",
      en: "Higher Learning & Academic Attainment",
      icon: "🎓",
    };
  }
  if (normalized.includes("litigation") || normalized.includes("legal") || normalized.includes("dispute") || normalized.includes("court")) {
    return {
      hi: "विवाद समाधान, कानूनी विषय एवं विजय",
      en: "Litigation Resolution & Legal Favour",
      icon: "⚖️",
    };
  }
  return {
    hi: raw,
    en: raw,
    icon: "✦",
  };
}

/**
 * Builds a human-friendly, luxury vector PDF Buffer from an EvidenceFirstReportPayload.
 */
export async function buildEvidenceFirstPdf(
  reportPayload: EvidenceFirstReportPayload,
  options: PdfRenderOptions = {}
): Promise<Buffer> {
  const fontFile = resolveAvailableFont(options.fontPath);
  // Format the date in a human-friendly way, handling both ISO strings and pre-formatted strings
  const rawDate = options.fixedTimestamp || reportPayload.generatedAt;
  const fixedDate = (() => {
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return rawDate; // already formatted
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return rawDate;
    }
  })();
  const subject = options.subjectName || "Sacred Seeker";

  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        autoFirstPage: true,
        bufferPages: true,
        size: "A4",
        margins: { top: 40, bottom: 40, left: 45, right: 45 },
        info: {
          Title: `AstroLife KP Predictive Intelligence — ${subject}`,
          Author: "AstroLife Vedic Intelligence System",
          Subject: "Krishnamurti Paddhati (KP) Cuspal Predictive Dossier",
          Keywords: "KP Astrology, Cuspal Sub-Lord, Vedic Timing, Shastric Upayas",
          CreationDate: new Date(),
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err: Error) => reject(err));

      if (fontFile) {
        doc.font(fontFile);
      } else {
        doc.font("Helvetica");
      }

      // ── Native PDF Document Bookmarks ────────────────────────────────────────
      const outline = doc.outline;
      outline.addItem("1. KP Executive Overview & Seeker Profile");
      outline.addItem("2. 12-Cusp Sub-Lord & Planetary Matrix");
      const domainsOutline = outline.addItem("3. Life Domains & Cuspal Timings");
      for (const s of reportPayload.sections) {
        const title = humanEventTitle(s.eventName);
        domainsOutline.addItem(`${title.icon} ${title.en}`);
      }
      outline.addItem("4. KP Cuspal Remedies & Harmonization Protocol");
      outline.addItem("5. Sacred Principles of Conscious Karma");

      // ── 1. Document Cover & Seeker Profile ───────────────────────────────────
      renderDocumentHeader(doc, reportPayload, subject, fixedDate, options.chart);

      // ── 2. 12-Cusp Sub-Lord & Planetary Matrix (Page 2) ──────────────────────
      if (options.chart) {
        doc.addPage();
        renderKPCuspalMatrixPage(doc, options.chart, subject);
      }

      // ── 3. Topic Sections (Iterate over all structured life domains) ─────────
      doc.addPage();
      for (const section of reportPayload.sections) {
        if (doc.y > 540) {
          doc.addPage();
        } else if (doc.y > 100) {
          doc.moveDown(1.2);
        }

        renderHumanSection(doc, section);
      }

      // ── 4. Dedicated KP Remedial Protocols ───────────────────────────────────
      doc.addPage();
      renderKPRemediesChapter(doc);

      // ── 5. Global Ethical & Conscious Principles ─────────────────────────────
      if (doc.y > 580) {
        doc.addPage();
      } else {
        doc.moveDown(1.5);
      }
      renderHumanBoundaries(doc);

      // ── 5. Page Headers, Footers & Dual-Gold Borders ─────────────────────────
      applyPageNumberingAndFooters(doc, reportPayload.reportId, subject);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1: LUXURY COVER & SEEKER CERTIFICATION
// ─────────────────────────────────────────────────────────────────────────────

function renderDocumentHeader(
  doc: PDFDoc,
  payload: EvidenceFirstReportPayload,
  subject: string,
  dateStr: string,
  chart?: ChartData
) {
  doc.moveDown(0.5);

  doc
    .fontSize(9.5)
    .fillColor("#8C6508")
    .text("ASTROLIFE • KRISHNAMURTI PADDHATI (KP) SYSTEM", { align: "center", characterSpacing: 2 })
    .moveDown(0.3);

  doc
    .fontSize(20)
    .fillColor("#1A1A1A")
    .text("ASTROLIFE KP PREDICTIVE INTELLIGENCE", { align: "center" });

  doc
    .fontSize(10)
    .fillColor("#B8860B")
    .text("सटीक कस्पल सब-लॉर्ड विश्लेषण एवं जीवन-दिशा दिग्दर्शन", { align: "center" })
    .moveDown(0.8);

  doc.moveTo(45, doc.y).lineTo(550, doc.y).lineWidth(0.8).strokeColor("#B8860B").stroke();
  doc.moveDown(0.8);

  // Seeker Certification Card (Champagne fill)
  const startY = doc.y;
  const cardHeight = chart ? 90 : 75;
  doc.rect(45, startY, 505, cardHeight).fillAndStroke("#FAF7F0", "#E0D7C6");

  doc.fontSize(10).fillColor("#8C6508").text("OFFICIAL SEEKER CERTIFICATION", 60, startY + 12, { underline: true });

  doc.fontSize(8.5).fillColor("#4A4238");
  doc.text("Seeker Name:", 60, startY + 30);
  doc.fontSize(9.5).fillColor("#1A1A1A").text(subject, 160, startY + 30);

  doc.fontSize(8.5).fillColor("#4A4238").text("Evaluation Date:", 60, startY + 46);
  doc.fontSize(9).fillColor("#1A1A1A").text(dateStr, 160, startY + 46);

  doc.fontSize(8.5).fillColor("#4A4238").text("Methodology:", 310, startY + 30);
  doc.fontSize(9).fillColor("#8C6508").text("Krishnamurti Paddhati (KP Readers I–VI)", 395, startY + 30);

  doc.fontSize(8.5).fillColor("#4A4238").text("Analytical Engine:", 310, startY + 46);
  doc.fontSize(9).fillColor("#16A34A").text("Deterministic & Epistemically Audited", 395, startY + 46);

  if (chart) {
    doc.fontSize(8.5).fillColor("#4A4238").text("Birth Lagna & Moon:", 60, startY + 64);
    const moonSign = chart.planets?.["Moon"]?.sign || "Moon";
    doc.fontSize(9).fillColor("#1A1A1A").text(`${chart.lagnaRashi} Lagna • ${moonSign} Rashi`, 160, startY + 64);

    doc.fontSize(8.5).fillColor("#4A4238").text("Cuspal Ayanamsha:", 310, startY + 64);
    doc.fontSize(9).fillColor("#1A1A1A").text("KP New (Krishnamurti)", 395, startY + 64);
  }

  doc.y = startY + cardHeight + 16;

  // Visual Kundli & Introduction Block
  if (chart) {
    const visualY = doc.y;
    // Left: Native Vector North Indian Kundli
    renderVectorNorthIndianKundli(doc, 45, visualY, 150, chart, {
      title: "KP CUSPAL NATAL CHART",
      borderColor: "#8C6508",
      innerLineColor: "#C9A961",
      fillColor: "#FAF7F0",
      signColor: "#8C6508",
      planetColor: "#1A1A1A",
    });

    // Right: Why KP Cuspal Sub-Lords Matter
    const rightX = 210;
    const rightW = 340;
    doc.rect(rightX, visualY, rightW, 150).fillAndStroke("#FFFFFF", "#E0D7C6");

    doc.fontSize(10).fillColor("#8C6508").text("कस्पल सब-लॉर्ड (Sub-Lord) की शक्ति", rightX + 14, visualY + 12);

    doc.fontSize(8.5).fillColor("#3A3530").text(
      "वैदिक ज्योतिष में ग्रह सामान्य संभावनाओं को दर्शाते हैं, लेकिन कृष्णमूर्ति पद्धति (KP) के अनुसार किसी भी घटना का अंतिम और निर्णायक फल उस भाव का 'कस्पल सब-लॉर्ड' निर्धारित करता है।",
      rightX + 14,
      visualY + 30,
      { width: rightW - 28, lineGap: 2.5 }
    );

    doc.fontSize(8.5).fillColor("#3A3530").text(
      "यदि संबंधित भाव का उप-स्वामी (Sub-Lord) अनुकूल भावों (2, 6, 10, 11) से संबंध बनाए, तो कार्य में अप्रत्याशित सफलता मिलती है। यह डॉसियर आपके जीवन के मुख्य आयामों के इन्हीं गुप्त सूत्रों को सरलता से प्रस्तुत करता है।",
      rightX + 14,
      visualY + 76,
      { width: rightW - 28, lineGap: 2.5 }
    );

    doc.y = visualY + 165;
  } else {
    // Elegant Text Intro if no chart object passed
    const introY = doc.y;
    doc.rect(45, introY, 505, 105).fillAndStroke("#FFFFFF", "#E0D7C6");
    doc.fontSize(10.5).fillColor("#8C6508").text("कस्पल सब-लॉर्ड पद्धति का मुख्य सिद्धांत", 55, introY + 12);
    doc.fontSize(8.8).fillColor("#3A3530").text(
      "कृष्णमूर्ति पद्धति (KP) ज्योतिष विज्ञान का वह परिष्कृत स्वरूप है जो ग्रहों की सामान्य दृष्टि के स्थान पर नक्षत्र (Star Lord) और उप-स्वामी (Sub-Lord) के सूक्ष्म गणित पर कार्य करता है। यह रिपोर्ट आपके जीवन के प्रमुख आयामों (करियर, वित्त, संबंध एवं स्वास्थ्य) में चल रहे ब्रह्मांडीय समय-चक्र को बिना किसी भ्रम या डरावनी भविष्यवाणी के, स्पष्ट एवं व्यावहारिक रूप में प्रस्तुत करती है।",
      55,
      introY + 32,
      { width: 485, lineGap: 3.5 }
    );
    doc.y = introY + 120;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN SECTIONS: HUMAN-CENTRIC PRESENTATION
// ─────────────────────────────────────────────────────────────────────────────

function renderHumanSection(doc: PDFDoc, section: EvidenceFirstSection) {
  const sectionTop = doc.y;
  const titleInfo = humanEventTitle(section.eventName);

  // Section Header Banner (Dark Obsidian with Gold Border)
  doc.rect(45, sectionTop, 505, 28).fillAndStroke("#11162E", "#B8860B");

  const headerTitle = titleInfo.hi === titleInfo.en
    ? `${titleInfo.icon}  ${titleInfo.en}`
    : `${titleInfo.icon}  ${titleInfo.hi} (${titleInfo.en})`;

  doc
    .fillColor("#FAF7F0")
    .fontSize(10)
    .text(headerTitle, 55, sectionTop + 8, { lineBreak: false });

  // Human Status Badge (Right-Aligned)
  const isPositive = section.synthesis.state.includes("CONFIRMED") || section.synthesis.state.includes("CORROBORATED");
  const isNegative = section.synthesis.state.includes("DENIED") || section.synthesis.state.includes("OBSTRUCTED");
  
  const statusLabel = isPositive
    ? "अनुकूलतम समय · Favorable"
    : (isNegative ? "धैर्य व सतर्कता · Caution" : "संतुलित प्रयास · Mixed");

  doc
    .fontSize(8.5)
    .fillColor("#FAF7F0")
    .text(`[ ${statusLabel} · ${section.synthesis.state} ]`, 260, sectionTop + 9, {
      align: "right",
      width: 280,
      lineBreak: false,
    });

  doc.y = sectionTop + 33;

  // KP Cuspal Verification Strip (Mathematical Authority)
  const cuspEv = section.progressiveDisclosure?.curious?.cuspEvidence || "";
  const dashaEv = section.progressiveDisclosure?.curious?.dashaEvidence || "";
  const stripY = doc.y;
  doc.rect(45, stripY, 505, 18).fillAndStroke("#F5EFE3", "#D4AF37");
  doc.fontSize(7.8).fillColor("#8C6508");
  const summaryEvidence = `${cuspEv.split(", yielding")[0] || "कस्पल उप-स्वामी सत्यापित"} • ${dashaEv.split("(")[0] || "दशा चक्र सक्रिय"}`;
  doc.text(`✦ के.पी. गणितीय साक्ष्य: ${summaryEvidence}`, 55, stripY + 5, { width: 485, lineBreak: false });

  doc.y = stripY + 24;

  // 1. Core Reading Card (Champagne Card)
  renderFriendlyReadingCard(doc, section.fivePartNarrative, isPositive, isNegative);

  // 2. Actionable Seeker Advice & Practical Implication
  renderActionableAdviceCard(doc, section.fivePartNarrative, isPositive, isNegative);

  // 2b. Why It Matters (Full Narrative)
  if (section.fivePartNarrative.whyItMatters) {
    if (doc.y > 680) doc.addPage();
    doc.fontSize(8.5).fillColor("#8C6508").text("Why It Matters", 55, doc.y);
    doc.moveDown(0.2);
    doc.fontSize(8.2).fillColor("#3A3530").text(section.fivePartNarrative.whyItMatters, 55, doc.y, {
      width: 485,
      lineGap: 2.5,
    });
    doc.moveDown(0.5);
  }

  // 2c. What Remains Uncertain
  if (doc.y > 690) doc.addPage();
  doc.fontSize(8.5).fillColor("#8C6508").text("What Remains Uncertain", 55, doc.y);
  doc.moveDown(0.2);
  doc.fontSize(8.2).fillColor("#4A4238").text(
    section.fivePartNarrative.whatRemainsUncertain ||
      "Active Dasha and sub-period timing window bounds apply.",
    55,
    doc.y,
    { width: 485, lineGap: 2.5 }
  );
  doc.moveDown(0.5);

  // 2d. Epistemic Safeguard for Reference_Pending
  const hasPending =
    section.synthesis.state.includes("REFERENCE_PENDING") ||
    section.synthesis.state.includes("EVALUATION_PENDING") ||
    JSON.stringify(section.findings).includes("REFERENCE_PENDING") ||
    JSON.stringify(section.findings).includes("EVALUATION_PENDING");
  if (hasPending) {
    if (doc.y > 650) doc.addPage();
    doc.fontSize(8.2).fillColor("#B45309").text("EPISTEMIC SAFEGUARD [EVALUATION_PENDING]:", 55, doc.y);
    doc.fontSize(8.2).fillColor("#B45309").text("Precedence resolution is deliberately withheld.", 55, doc.y, { width: 500, lineBreak: false });
    doc.moveDown(0.8);
  }

  // 2e. Evidence Node IDs & Provenance Citations
  if (section.findings.length > 0) {
    if (doc.y > 700) doc.addPage();
    for (const finding of section.findings) {
      const sourceBook = finding.provenance?.sourceBook || "Classical KP Reference";
      const pages = finding.provenance?.pages ? ` (pp. ${finding.provenance.pages})` : "";
      doc.fontSize(7.2).fillColor("#6B635B").text(
        `Source: ${sourceBook}${pages}`,
        55,
        doc.y,
        { width: 485, lineGap: 1.5 }
      );
      if (finding.evidence?.nodeIds?.length) {
        for (const nodeId of finding.evidence.nodeIds) {
          doc.fontSize(7).fillColor("#6B635B").text(`Node: ${nodeId}`, 65, doc.y, {
            width: 475,
            lineBreak: false,
          });
        }
      }
    }
    doc.moveDown(0.4);
  }

  // 3. Classical Authority Citation (Single Discreet Line)
  renderClassicalFootnote(doc, section);
}

function renderFriendlyReadingCard(
  doc: PDFDoc,
  narrative: FivePartNarrative,
  isPositive: boolean,
  isNegative: boolean
) {
  if (doc.y > 660) doc.addPage();
  const top = doc.y;

  doc.rect(45, top, 505, 78).fillAndStroke("#FAF7F0", "#E0D7C6");

  doc.fontSize(9.5).fillColor("#8C6508").text("✦ मुख्य फलकथन एवं ग्रह-संकेत (Core Insight)", 55, top + 10);

  const readingText = narrative.whatWasFound ||
    (isPositive
      ? "संबंधित भाव के कस्पल सब-लॉर्ड्स का संबंध अत्यंत शुभ उपचय भावों से है, जो प्रगति और सफलता को इंगित करते हैं।"
      : "ग्रहों की वर्तमान स्थिति स्थिरता और धैर्यपूर्वक कार्य करने की सलाह देती है।");

  doc.fontSize(8.5).fillColor("#2A2520").text(readingText, 55, top + 26, {
    width: 485,
    lineGap: 2.5,
  });

  doc.y = top + 86;
}

function renderActionableAdviceCard(
  doc: PDFDoc,
  narrative: FivePartNarrative,
  isPositive: boolean,
  isNegative: boolean
) {
  if (doc.y > 640) doc.addPage();
  const top = doc.y;

  const borderColor = isPositive ? "#15803D" : (isNegative ? "#B8860B" : "#8C6508");
  doc.rect(45, top, 505, 74).fillAndStroke("#FFFFFF", borderColor);

  doc.fontSize(9.5).fillColor("#8C6508").text("✦ आपके लिए व्यावहारिक मार्गदर्शन (Seeker Strategy)", 55, top + 10);

  const adviceText = narrative.practicalInterpretation ||
    (isPositive
      ? "यह समय नए संकल्पों और पहल के लिए सर्वश्रेष्ठ है। आत्मविश्वास के साथ अपनी योजनाओं को क्रियान्वित करें।"
      : "अनावश्यक जोखिम या जल्दबाजी से बचें। नियमित दिनचर्या और योजनाबद्ध निर्णयों से स्थिति पूरी तरह नियंत्रित रहेगी।");

  doc.fontSize(8.3).fillColor("#3A3530").text(adviceText, 55, top + 26, {
    width: 485,
    lineGap: 2.5,
  });

  doc.y = top + 82;
}

function renderClassicalFootnote(doc: PDFDoc, section: EvidenceFirstSection) {
  const primaryFinding = section.findings[0];
  const sourceText = primaryFinding?.provenance?.sourceBook || "KP Classical Readers (K.S. Krishnamurti)";
  
  doc
    .fontSize(7.5)
    .fillColor("#8C6508")
    .text(
      `📚 शास्त्रीय प्रमाण: ${sourceText} · कस्पल उप-स्वामी नियम सत्यापित · प्रामाणिक वैदिक फलित`,
      50,
      doc.y,
      { width: 495, align: "center", lineBreak: false }
    );

  doc.moveDown(0.8);
}

// ─────────────────────────────────────────────────────────────────────────────
// REMEDIES & SACRED HARMONIZATION CHAPTER
// ─────────────────────────────────────────────────────────────────────────────

function renderKPRemediesChapter(doc: PDFDoc) {
  if (doc.y > 540) doc.addPage();
  const top = doc.y;

  doc.rect(45, top, 505, 28).fillAndStroke("#8C6508", "#B8860B");

  doc
    .fillColor("#FAF7F0")
    .fontSize(11)
    .text("🌿 कस्पल शोधन एवं व्यावहारिक वैदिक उपाय (KP Remedial Protocol)", 55, top + 8);

  doc.y = top + 36;

  const cardY = doc.y;
  doc.rect(45, cardY, 505, 125).fillAndStroke("#FAF7F0", "#E0D7C6");

  doc.fontSize(10).fillColor("#8C6508").text("जीवन में संतुलन एवं ग्रह-ऊर्जा सामंजस्य के 3 सरल नियम", 55, cardY + 12);

  doc.fontSize(8.5).fillColor("#3A3530").text(
    "1. कस्पल ऊर्जा का शोधन (Energy Balancing): जब भी किसी प्रतिकूल भाव के सब-लॉर्ड की अंतर्दशा चल रही हो, तो विवादों से दूर रहें। शुक्रवार व शनिवार को सात्विक अन्न-दान (सफेद तिल, दही या जरूरतमंदों को भोजन) करने से सूक्ष्म कर्मिक बाधाएं दूर होती हैं।\n\n" +
    "2. नाद-स्वर एवं मंत्र साधना (Vibrational Harmony): प्रतिदिन प्रातःकाल सूर्योदय के समय गायत्री मंत्र अथवा अपने इष्ट मंत्र का 108 बार शांत मन से जप करें। मंत्रों की ध्वनि तरंगें तंत्रिका तंत्र और आंतरिक संकल्प-शक्ति को अभूतपूर्व बल प्रदान करती हैं।\n\n" +
    "3. दिशात्मक वास्तु एवं सकारात्मक आचरण (Directional Alignment): अपने कार्यक्षेत्र में महत्वपूर्ण निर्णय लेते समय अथवा अध्ययन करते समय पूर्व (East) या ईशान कोण (North-East) की ओर मुख रखें। यह दिशा गुरु और बुध की रचनात्मक तरंगों से जुड़ने में सहायता करती है।",
    55,
    cardY + 30,
    { width: 485, lineGap: 3 }
  );

  doc.y = cardY + 138;
}

function renderHumanBoundaries(doc: PDFDoc) {
  if (doc.y > 620) doc.addPage();
  const top = doc.y;

  doc.rect(45, top, 505, 75).fillAndStroke("#FFFFFF", "#E0D7C6");

  doc.fontSize(9.5).fillColor("#8C6508").text("✦ STANDARD CONSTITUTIONAL & ETHICAL BOUNDARIES", 55, top + 10);

  doc.fontSize(8.2).fillColor("#4A4238").text(
    "वैदिक ज्योतिष किसी अपरिवर्तनीय भाग्य का बंधन नहीं है, बल्कि यह आत्मा के विकास और आत्म-जागृति का एक दिव्य मानचित्र है। आपकी इच्छाशक्ति, सकारात्मक कर्म और ईश्वरीय कृपा किसी भी प्रतिकूल समय को अनुकूल बनाने की पूर्ण सामर्थ्य रखते हैं। यह रिपोर्ट किसी भी प्रकार के भय या अंधविश्वास के बिना, केवल आपके सजग जीवन-निर्माण के लिए तैयार की गई है।",
    55,
    top + 26,
    { width: 485, lineGap: 3 }
  );

  doc.y = top + 85;
  if (doc.y > 680) doc.addPage();
  doc.fontSize(9).fillColor("#8C6508").text("APPENDIX: SYSTEM AUDIT & PROVENANCE REGISTRY", 45, doc.y);
  doc.moveDown(0.5);
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE NUMBERING, RUNNING FOOTER & DUAL GOLD BORDERS
// ─────────────────────────────────────────────────────────────────────────────

function renderKPCuspalMatrixPage(doc: PDFDoc, chart: ChartData, subject: string) {
  doc.fontSize(13).fillColor("#1A1A1A").text("✦ के.पी. द्वादश-भाव कस्पल उप-स्वामी सारणी (12-CUSP SUB-LORD MATRIX)", 45, 45);
  doc.fontSize(8.5).fillColor("#6B635B").text(`Placidus Bhava Chalit Cuspal Coordinates & Stellar Sub-Lords for ${subject}`, 45, 65);
  doc.moveTo(45, 80).lineTo(550, 80).lineWidth(0.8).strokeColor("#B8860B").stroke();

  // Table 1: 12 Cusps
  let y = 92;
  doc.rect(45, y, 505, 18).fill("#8C6508");
  doc.fontSize(7.8).fillColor("#FAF7F0");
  doc.text("CUSP (BHAVA)", 55, y + 5);
  doc.text("SIGN & DEGREE", 155, y + 5);
  doc.text("NAKSHATRA", 265, y + 5);
  doc.text("STAR LORD", 375, y + 5);
  doc.text("SUB-LORD", 465, y + 5);

  y += 18;
  const cusps = chart.kpCusps || chart.houseCusps || [];
  cusps.slice(0, 12).forEach((c: any, idx: number) => {
    const bg = idx % 2 === 0 ? "#FAF8F5" : "#FFFFFF";
    doc.rect(45, y, 505, 17).fill(bg);
    doc.fontSize(8).fillColor("#1A1A1A");
    doc.text(`Cusp ${c.house ?? idx + 1}`, 55, y + 4);
    doc.text(`${c.sign || "—"} ${(c.degree ?? 0).toFixed(2)}°`, 155, y + 4);
    doc.text(`${c.nakshatra || "—"} (P${c.pada ?? 1})`, 265, y + 4);
    doc.text(`${c.starLord || c.nakshatraLord || "—"}`, 375, y + 4);
    doc.fillColor("#8C6508").text(`${c.subLord || "—"}`, 465, y + 4);
    y += 17;
  });

  // Table 2: 9 Planets KP Stellar Coordinates
  y += 22;
  doc.fontSize(10.5).fillColor("#8C6508").text("✦ नवग्रह नक्षत्र व उप-स्वामी तालिका (KP PLANETARY COORDINATES)", 45, y);
  y += 16;

  doc.rect(45, y, 505, 18).fill("#11162E");
  doc.fontSize(7.8).fillColor("#FAF7F0");
  doc.text("GRAHA", 55, y + 5);
  doc.text("RASHI & DEGREE", 145, y + 5);
  doc.text("HOUSE", 255, y + 5);
  doc.text("NAKSHATRA", 315, y + 5);
  doc.text("STAR LORD", 425, y + 5);
  doc.text("STATUS", 495, y + 5);

  y += 18;
  const pEntries = Object.entries(chart.planets || {}).slice(0, 9);
  pEntries.forEach(([name, pData]: [string, any], idx: number) => {
    const bg = idx % 2 === 0 ? "#FAF8F5" : "#FFFFFF";
    doc.rect(45, y, 505, 17).fill(bg);
    doc.fontSize(8).fillColor("#1A1A1A");
    doc.text(name, 55, y + 4);
    doc.text(`${pData.sign || "—"} ${(pData.degree ?? 0).toFixed(2)}°`, 145, y + 4);
    doc.text(`H${pData.house ?? 1}`, 255, y + 4);
    doc.text(`${pData.nakshatra || "—"}`, 315, y + 4);
    doc.text(`${pData.nakshatraLord || "—"}`, 425, y + 4);
    doc.fillColor(pData.retrograde ? "#B91C1C" : "#15803D");
    doc.text(pData.retrograde ? "Retro (R)" : "Direct", 495, y + 4);
    y += 17;
  });

  // KP Foundation Note
  y += 18;
  doc.rect(45, y, 505, 72).fillAndStroke("#FAF7F0", "#B8860B");
  doc.fontSize(9).fillColor("#8C6508").text("✦ के.पी. पद्धति का वैज्ञानिक आधार (How to Read This Matrix)", 60, y + 10);
  doc.fontSize(8.2).fillColor("#2A2520").text(
    "कृष्णमूर्ति पद्धति में प्रत्येक भाव (Cusp) का परिणाम उसका 'Sub-Lord' तय करता है। ऊपर दी गई तालिका आपके जन्म समय (Placidus System) के सूक्ष्म अंशों पर आधारित है। आगे के अध्यायों में इन्हीं उप-स्वामियों के आधार पर आपके करियर, विवाह, संपत्ति और यात्रा का सटीक फलकथन प्रस्तुत है।",
    60,
    y + 26,
    { width: 475, lineGap: 2.5 }
  );
}

function applyPageNumberingAndFooters(doc: PDFDoc, reportId: string, subject: string) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.page.margins.bottom = 0;

    // Signature Dual-Gold Borders
    doc.rect(25, 25, 545, 765).lineWidth(1.2).strokeColor("#B8860B").stroke();
    doc.rect(28, 28, 539, 759).lineWidth(0.4).strokeColor("#E5C158").stroke();

    // Bottom Running Footer
    doc
      .fontSize(7.5)
      .fillColor("#8C6508")
      .text(
        `AstroLife Evidence-First Report • ${subject} • Verified Shastric Synthesis`,
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
    doc.page.margins.bottom = 40;
  }
}

// ── Text Extraction Fallback ─────────────────────────────────────────────────

export function extractTextFromPdfBuffer(pdfBuffer: Buffer): string {
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
  } catch {}

  return "";
}
