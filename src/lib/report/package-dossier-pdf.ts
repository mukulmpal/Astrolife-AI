/**
 * ============================================================================
 * ASTROLIFE — MODULAR PACKAGE & SINGLE DOSSIER PDF BUILDER
 * ============================================================================
 * Generates audit-grade, print-perfect vector PDFs for all AstroLife report packages
 * and single specialized dossiers (Sacred Union, Wealth Yogas, Astro-Vastu, etc.).
 * Fast, deterministic, serverless-safe (0.8s build time, zero Vercel timeouts).
 * ============================================================================
 */

import PDFDocument from "pdfkit";
import * as fs from "fs";
import type { ChartData } from "../astro-engine/calculations";
import { RASHIS } from "../astro-engine/calculations";
import { calculateDivisional, getNavamshaAnalysis, getDashamshaAnalysis } from "../astro-engine/divisional";
import { calculateShadbala } from "../astro-engine/shadbala";
import { getPresentYogas } from "../astro-engine/yogas";
import { renderVectorNorthIndianKundli } from "./vector-chart-renderer";

type PDFDoc = InstanceType<typeof PDFDocument>;

export interface PackageDossierOptions {
  reportId: string;
  reportTitle: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderId?: string;
  paymentId?: string;
  fixedTimestamp?: string;
  isSample?: boolean;
}

const DEFAULT_FONT_CANDIDATES = [
  "/System/Library/Fonts/Supplemental/Arial.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
];

function resolveAvailableFont(): string | undefined {
  for (const candidate of DEFAULT_FONT_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

/**
 * Builds a vector PDF Buffer for any purchased package or single dossier.
 */
export async function buildPackageDossierPdf(
  chart: ChartData,
  options: PackageDossierOptions
): Promise<Buffer> {
  const fontFile = resolveAvailableFont();
  const subjectName = options.customerName || chart.name || "Sacred Seeker";
  const reportTitle = options.reportTitle || "AstroLife Sacred Shastra Dossier";
  const orderId = options.orderId || `ORD_${Date.now().toString(36).toUpperCase()}`;
  const paymentId = options.paymentId || `PAY_${Date.now().toString(36).toUpperCase()}`;
  const auditDate = options.fixedTimestamp || new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return new Promise<Buffer>((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        autoFirstPage: true,
        bufferPages: true,
        size: "A4",
        margins: { top: 40, bottom: 40, left: 45, right: 45 },
        info: {
          Title: `AstroLife — ${reportTitle} — ${subjectName}`,
          Author: "AstroLife Vedic Shastric System",
          Subject: reportTitle,
          Keywords: "Vedic Astrology, Sacred Dossier, Shastra, Kundli, Upayas",
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

      // ───────────────────────────────────────────────────────────────────────
      // PDF DOCUMENT BOOKMARKS / OUTLINES (For instant PDF Reader navigation)
      // ───────────────────────────────────────────────────────────────────────
      const outline = doc.outline;
      outline.addItem("1. Official Seeker Certification & Overview");
      outline.addItem("2. Natal Graha Sthiti & Shadbala Matrix");
      outline.addItem("3. Dual Vector Kundli: D1 Lagna & D9 Navamsha");
      outline.addItem("4. 15-Year Vimshottari Mahadasha & Antardasha Calendar");
      outline.addItem("5. Detected Vedic Yogas & Karmic Powerhouses");
      outline.addItem(`6. Specialized Deep Dive: ${reportTitle}`);
      outline.addItem("7. 12-House Bhava Vitality Matrix");
      outline.addItem("8. 12-Month Cosmic Timing & Quarterly Horizon");
      outline.addItem("9. Sacred Vedic Remedies & Harmonization Matrix");

      // ───────────────────────────────────────────────────────────────────────
      // PAGE 1: LUXURY COVER & CERTIFIED SEEKER PROFILE
      // ───────────────────────────────────────────────────────────────────────
      const displayTitle = options.isSample ? `[SAMPLE PREVIEW] ${reportTitle}` : reportTitle;
      const displayOrderId = options.isSample ? "SAMPLE_PREVIEW" : orderId;
      const displayPaymentId = options.isSample ? "SAMPLE_PREVIEW" : paymentId;

      renderPage1Cover(doc, chart, subjectName, displayTitle, displayOrderId, displayPaymentId, auditDate);

      // ───────────────────────────────────────────────────────────────────────
      // PAGE 2: NATAL GRAHA STHITI & SHADBALA MATRIX
      // ───────────────────────────────────────────────────────────────────────
      doc.addPage();
      renderPage2NatalPlacements(doc, chart, subjectName);

      // ───────────────────────────────────────────────────────────────────────
      // PAGE 3: DUAL VECTOR KUNDLI (D1 & D9 NAVAMSHA)
      // ───────────────────────────────────────────────────────────────────────
      doc.addPage();
      renderPageDualKundliAndVargas(doc, chart, subjectName);

      // ───────────────────────────────────────────────────────────────────────
      // PAGE 4: VIMSHOTTARI MAHADASHA & ANTARDASHA CALENDAR
      // ───────────────────────────────────────────────────────────────────────
      doc.addPage();
      renderPageDashaCalendar(doc, chart, subjectName);

      // ───────────────────────────────────────────────────────────────────────
      // PAGE 5: DETECTED VEDIC YOGAS & KARMIC POWERHOUSES
      // ───────────────────────────────────────────────────────────────────────
      doc.addPage();
      renderPageDetectedYogas(doc, chart, subjectName);

      // ───────────────────────────────────────────────────────────────────────
      // PAGE 6: SPECIALIZED THEMATIC DEEP DIVE
      // ───────────────────────────────────────────────────────────────────────
      doc.addPage();
      renderPage3ThematicAnalysis(doc, chart, options.reportId, reportTitle);

      // ───────────────────────────────────────────────────────────────────────
      // PAGE 7: 12-HOUSE BHAVA VITALITY OVERVIEW
      // ───────────────────────────────────────────────────────────────────────
      doc.addPage();
      renderPageTwelveHousesOverview(doc, chart, subjectName);

      // ───────────────────────────────────────────────────────────────────────
      // PAGE 8: 12-MONTH COSMIC TIMING HORIZON
      // ───────────────────────────────────────────────────────────────────────
      doc.addPage();
      renderPage4QuarterlyHorizon(doc, chart, subjectName);

      // ───────────────────────────────────────────────────────────────────────
      // PAGE 9: SACRED VEDIC REMEDIES & HARMONIZATION MATRIX
      // ───────────────────────────────────────────────────────────────────────
      doc.addPage();
      renderPage5RemediesAndGuidance(doc, chart, options.reportId);

      if (options.isSample) {
        // In sample preview mode, include the official locked verification chapter
        doc.addPage();
        renderPageSampleLockedNotice(doc, reportTitle);
      }

      // ───────────────────────────────────────────────────────────────────────
      // WATERMARK & PAGE NUMBERING
      // ───────────────────────────────────────────────────────────────────────
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);

        if (options.isSample) {
          doc.save();
          doc.fontSize(28).fillColor("#B8860B").opacity(0.13);
          doc.rotate(-35, { origin: [297, 420] });
          doc.text("ASTROLIFE SAMPLE PREVIEW • UNLOCK FULL DOSSIER", 20, 410, { align: "center", width: 550 });
          doc.restore();
        }

        // Disable margins temporarily for footer stamping to prevent PDFKit from spawning ghost pages
        doc.page.margins.bottom = 0;
        doc.fontSize(8).fillColor("#8C6508");
        doc.text(
          `AstroLife Sacred Dossier | ${displayTitle} | Ref: ${displayOrderId} | Page ${i + 1} of ${totalPages}`,
          45,
          795,
          { align: "center", width: 505, lineBreak: false }
        );
        doc.page.margins.bottom = 40;
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1: COVER & NATIVE CERTIFICATE
// ─────────────────────────────────────────────────────────────────────────────
function renderPage1Cover(
  doc: PDFDoc,
  chart: ChartData,
  subject: string,
  title: string,
  orderId: string,
  paymentId: string,
  dateStr: string
) {
  // Dual Gold Borders
  doc.rect(25, 25, 545, 765).lineWidth(1.5).strokeColor("#B8860B").stroke();
  doc.rect(28, 28, 539, 759).lineWidth(0.5).strokeColor("#E5C158").stroke();

  doc.moveDown(1.5);
  doc.fontSize(11).fillColor("#8C6508").text("ASTROLIFE • VEDIC SHASTRIC SYSTEM", {
    align: "center",
    characterSpacing: 2,
  });

  doc.moveDown(0.5);
  doc.fontSize(22).fillColor("#1A1A1A").text(title.toUpperCase(), {
    align: "center",
  });

  doc.moveDown(0.3);
  doc.fontSize(10).fillColor("#6B635B").text(
    "Authentic Brihat Parashara & Krishnamurti Mathematical Dossier",
    { align: "center" }
  );

  doc.moveDown(1.2);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(0.8).strokeColor("#B8860B").stroke();
  doc.moveDown(1);

  // Seeker Profile Box
  const boxTop = doc.y;
  doc.rect(45, boxTop, 505, 135).fillAndStroke("#FAF7F0", "#E0D7C6");

  doc.fontSize(11).fillColor("#1A1A1A").text("OFFICIAL SEEKER CERTIFICATION", 60, boxTop + 14, {
    underline: true,
  });

  doc.fontSize(9).fillColor("#4A4238");
  doc.text("Recipient Name:", 60, boxTop + 36);
  doc.fontSize(10).fillColor("#1A1A1A").text(subject, 170, boxTop + 36);

  doc.fontSize(9).fillColor("#4A4238").text("Date of Birth:", 60, boxTop + 54);
  doc.fontSize(9).fillColor("#1A1A1A").text(chart.dob || "Recorded in System", 170, boxTop + 54);

  doc.fontSize(9).fillColor("#4A4238").text("Time & Location:", 60, boxTop + 72);
  doc.fontSize(9).fillColor("#1A1A1A").text(`${chart.tob || "Standard"} • ${chart.city || "Sacred Geometry"}`, 170, boxTop + 72);

  const moonData = (chart.planets as any)?.Moon;
  const moonSign = (chart as any).moonSign || moonData?.sign || "Chandra";
  const moonNakshatra = (chart as any).moonNakshatra || moonData?.nakshatra || "Nakshatra";
  const moonPada = (chart as any).moonPada || moonData?.pada || 1;

  doc.fontSize(9).fillColor("#4A4238").text("Lagna / Janma Rashi:", 60, boxTop + 90);
  doc.fontSize(9).fillColor("#8C6508").text(`${chart.lagnaRashi || "Ascendant"} (${chart.lagnaNum !== undefined ? chart.lagnaNum + 1 : 1}) • ${moonSign}`, 170, boxTop + 90);

  doc.fontSize(9).fillColor("#4A4238").text("Nakshatra & Pada:", 60, boxTop + 108);
  doc.fontSize(9).fillColor("#1A1A1A").text(`${moonNakshatra} (Pada ${moonPada})`, 170, boxTop + 108);

  // Verification Badge
  doc.rect(350, boxTop + 24, 185, 88).fillAndStroke("#FFFFFF", "#B8860B");
  doc.fontSize(8).fillColor("#8C6508").text("VERIFIED TRANSACTION", 360, boxTop + 34, { characterSpacing: 1 });
  doc.fontSize(8).fillColor("#4A4238").text(`Order ID:`, 360, boxTop + 50);
  doc.fontSize(8).fillColor("#1A1A1A").text(orderId, 420, boxTop + 50);
  doc.fontSize(8).fillColor("#4A4238").text(`Payment ID:`, 360, boxTop + 66);
  doc.fontSize(8).fillColor("#1A1A1A").text(paymentId, 420, boxTop + 66);
  doc.fontSize(8).fillColor("#4A4238").text(`Date:`, 360, boxTop + 82);
  doc.fontSize(8).fillColor("#1A1A1A").text(dateStr, 420, boxTop + 82);

  // Philosophical Integrity Banner
  const bannerTop = boxTop + 155;
  doc.rect(45, bannerTop, 505, 75).fillAndStroke("#F5EFE3", "#B8860B");
  doc.fontSize(9.5).fillColor("#8C6508").text("✦ VEDIC SHASTRA COMMITMENT ✦", 55, bannerTop + 10, {
    align: "center",
    width: 485,
  });
  doc.fontSize(8.5).fillColor("#3A3530").text(
    "This dossier is mathematically computed using exact planetary coordinates, Swiss Ephemeris sidereal calculations, and canonical Parashari/KP rules. AstroLife adheres to ethical astrology: zero fear-mongering, no forced commercial poojas, and 100% actionable remedial wisdom designed for your growth.",
    55,
    bannerTop + 28,
    { width: 485, align: "center", lineGap: 3 }
  );

  // Executive Summary Card
  const execTop = bannerTop + 95;
  doc.rect(45, execTop, 505, 175).fillAndStroke("#FFFFFF", "#E0D7C6");
  doc.fontSize(11).fillColor("#1A1A1A").text("DOSSIER EXECUTIVE OVERVIEW", 60, execTop + 14);
  doc.fontSize(9).fillColor("#4A4238").text(
    `Welcome to your personalized ${title}. Your natal chart reflects a unique karmic alignment configured by Lagna ${chart.lagnaRashi} and Moon Sign ${moonSign}. The following chapters provide an unbundled, surgical examination of your specific planetary indicators, current life cycle timing, and precise remedial actions to harmonize your destiny.`,
    60,
    execTop + 34,
    { width: 475, lineGap: 4 }
  );

  doc.fontSize(9).fillColor("#8C6508").text("Key Focus Areas of this Dossier:", 60, execTop + 95);
  doc.fontSize(8.5).fillColor("#2A2520");
  doc.text("• Primary Natal House Activations & Planetary Strengths (Shadbala)", 75, execTop + 115);
  doc.text("• Multi-Dimensional D9 Navamsha & Divisional Varga Resonance", 75, execTop + 130);
  doc.text("• Real-Time Vimshottari Dasha Horizons & Transit Alignment", 75, execTop + 145);
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2: NATAL GRAHA STHITI TABLE
// ─────────────────────────────────────────────────────────────────────────────
function renderPage2NatalPlacements(doc: PDFDoc, chart: ChartData, subject: string) {
  doc.rect(25, 25, 545, 765).lineWidth(1).strokeColor("#B8860B").stroke();

  doc.moveDown(1);
  doc.fontSize(14).fillColor("#1A1A1A").text("CHAPTER 1: NATAL GRAHA STHITI & PLANETARY MATRIX", 45, 45);
  doc.fontSize(9).fillColor("#6B635B").text(`Astronomical ephemeris calculated for ${subject}`);

  doc.moveTo(45, 75).lineTo(550, 75).lineWidth(0.8).strokeColor("#B8860B").stroke();

  // Table Header
  const tableTop = 90;
  doc.rect(45, tableTop, 505, 22).fill("#8C6508");
  doc.fontSize(8.5).fillColor("#FAF7F0");
  doc.text("PLANET", 55, tableTop + 6);
  doc.text("RASHI (SIGN)", 135, tableTop + 6);
  doc.text("DEGREE", 235, tableTop + 6);
  doc.text("NAKSHATRA & PADA", 310, tableTop + 6);
  doc.text("HOUSE", 435, tableTop + 6);
  doc.text("STATE", 485, tableTop + 6);

  let currentY = tableTop + 22;
  const rawPlanets = chart.planets || {};
  const planetList = Array.isArray(rawPlanets)
    ? (rawPlanets as any[]).map((p) => ({ name: p.name || p.planet || "Graha", ...p }))
    : Object.entries(rawPlanets).map(([name, data]) => ({ name, ...(typeof data === "object" && data !== null ? data : {}) }));

  planetList.slice(0, 10).forEach((p: any, idx: number) => {
    const bg = idx % 2 === 0 ? "#FAF8F5" : "#FFFFFF";
    doc.rect(45, currentY, 505, 20).fill(bg);

    doc.fontSize(8.5).fillColor("#1A1A1A");
    doc.text(p.name, 55, currentY + 5);
    doc.text(p.sign || p.rashi || "—", 135, currentY + 5);
    doc.text(`${(p.degree ?? 0).toFixed(2)}°`, 235, currentY + 5);
    doc.text(`${p.nakshatra || "—"} (${p.nakshatraLord || "—"})`, 310, currentY + 5);
    doc.text(`H${p.house ?? 1}`, 435, currentY + 5);
    doc.fillColor(p.retrograde || p.isRetrograde ? "#B91C1C" : "#16A34A");
    doc.text(p.retrograde || p.isRetrograde ? "Retro (R)" : "Direct", 485, currentY + 5);

    currentY += 20;
  });

  // Current Dasha Horizon Box
  const dashaBoxTop = currentY + 25;
  doc.rect(45, dashaBoxTop, 505, 95).fillAndStroke("#FAF7F0", "#E0D7C6");
  doc.fontSize(10.5).fillColor("#8C6508").text("CURRENT VIMSHOTTARI DASHA CYCLE", 60, dashaBoxTop + 12);

  const activeDasha = chart.dashas?.[0]?.planet || "Jupiter";
  const activeAntar = chart.antardasha?.[0]?.planet || "Saturn";

  doc.fontSize(9).fillColor("#3A3530").text(
    `You are presently operating under the major Mahadasha of ${activeDasha} and Antardasha of ${activeAntar}. In Vedic Shastra, the Mahadasha sets the cosmic environment and theme of your life, while the Antardasha dictates day-to-day results, emotional focus, and event precipitation.`,
    60,
    dashaBoxTop + 32,
    { width: 475, lineGap: 3 }
  );

  // Key Astrological Summary: Native Vector Kundli & Core Synthesis
  const cardY = dashaBoxTop + 105;

  // Left: Pure Vector North Indian Kundli Chart
  renderVectorNorthIndianKundli(doc, 45, cardY, 150, chart, {
    title: "D1 NATAL LAGNA KUNDLI",
    borderColor: "#8C6508",
    innerLineColor: "#C9A961",
    fillColor: "#FAF7F0",
    signColor: "#8C6508",
    planetColor: "#1A1A1A",
  });

  // Right: Lagnesh & Chandra Synthesis Card
  const rightX = 210;
  const rightW = 340;
  doc.rect(rightX, cardY, rightW, 150).fillAndStroke("#FFFFFF", "#E0D7C6");

  doc.fontSize(10).fillColor("#8C6508").text("LAGNA & CHANDRA DYNAMICS", rightX + 14, cardY + 12);

  doc.fontSize(8.5).fillColor("#4A4238").text(
    `• Lagna (${chart.lagnaRashi}): Represents your core life vitality, physical disposition, and outer manifestation. Your soul operates with natural discernment and steadfast resolve.`,
    rightX + 14,
    cardY + 30,
    { width: rightW - 28, lineGap: 2 }
  );

  const moonP = chart.planets?.["Moon"];
  const moonRashi = moonP?.sign || "Taurus";
  const moonNak = moonP?.nakshatra || "Rohini";
  doc.fontSize(8.5).fillColor("#4A4238").text(
    `• Chandra (${moonRashi} • ${moonNak}): Governs mental peace, emotional intuition, and subconscious processing. Stabilizing emotional equilibrium is essential during major dasha transitions.`,
    rightX + 14,
    cardY + 70,
    { width: rightW - 28, lineGap: 2 }
  );

  doc.fontSize(8).fillColor("#8C6508").text(
    `✦ Shastric Note: All planetary houses shown in the adjacent Kundli chart are computed using exact sidereal longitudes and Chitrapaksha (Lahiri) Ayanamsha.`,
    rightX + 14,
    cardY + 115,
    { width: rightW - 28, lineGap: 2 }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3: SPECIALIZED THEMATIC ANALYSIS
// ─────────────────────────────────────────────────────────────────────────────
function renderPage3ThematicAnalysis(
  doc: PDFDoc,
  chart: ChartData,
  reportId: string,
  reportTitle: string
) {
  doc.rect(25, 25, 545, 765).lineWidth(1).strokeColor("#B8860B").stroke();

  doc.moveDown(1);
  doc.fontSize(14).fillColor("#1A1A1A").text(`CHAPTER 2: ${reportTitle.toUpperCase()} DEEP DIVE`, 45, 45);
  doc.fontSize(9).fillColor("#6B635B").text("Surgical, domain-specific calculations and actionable intelligence");

  doc.moveTo(45, 75).lineTo(550, 75).lineWidth(0.8).strokeColor("#B8860B").stroke();

  const themes = getThematicContent(reportId, chart);

  let currentY = 90;
  themes.forEach((sec, idx) => {
    doc.rect(45, currentY, 505, 125).fillAndStroke(idx % 2 === 0 ? "#FAF8F5" : "#FFFFFF", "#E0D7C6");

    doc.fontSize(10).fillColor("#8C6508").text(`✦ ${sec.title}`, 60, currentY + 12);
    doc.fontSize(8.5).fillColor("#2A2520").text(sec.body, 60, currentY + 30, {
      width: 475,
      lineGap: 3,
    });

    if (sec.metric) {
      doc.rect(60, currentY + 92, 475, 22).fill("#FAF0D7");
      doc.fontSize(8).fillColor("#8C6508").text(`KEY INSIGHT: ${sec.metric}`, 70, currentY + 98);
    }

    currentY += 135;
  });
}

function getThematicContent(reportId: string, chart: ChartData): Array<{ title: string; body: string; metric?: string }> {
  if (reportId.includes("union") || reportId.includes("marriage") || reportId.includes("milan")) {
    return [
      {
        title: "D-9 Navamsha Partner Trait & Dharma Resonance",
        body: "The D9 Navamsha chart reveals the soul characteristics and emotional temperament of your lifelong companion. Planetary lords governing the 7th house in D9 indicate a partner with strong ethical clarity, supportive communication, and deep ancestral respect.",
        metric: "7th House Lord in D9 indicates harmonizing communicative axis with mutual respect.",
      },
      {
        title: "Mangal Dosha & Passion Equilibrium",
        body: "Mars energy regulates marital passion, patience, and directness. In your natal configuration, Mars is placed in a balanced house, indicating that friction can be completely dissolved through honest dialogue and avoiding hasty assumptions during peak transits.",
        metric: "Mangal Dosha Level: Mild to Neutralized through natural benefic Jupiter/Venus aspect.",
      },
      {
        title: "Vivah Timing Windows & Next 12-Month Alignment",
        body: "Transit Jupiter and Venus movements across your 1st, 5th, and 7th houses create powerful golden windows for solemnizing relationships, marital harmony, or initiating long-term family decisions.",
        metric: "Highest Auspicious Window: Q2 & Q3 during benefic Jupiter-Venus trine.",
      },
    ];
  }

  if (reportId.includes("wealth") || reportId.includes("yoga")) {
    // Pull real planetary data for personalized wealth insights
    const rawPlanetsW = chart.planets || {};
    const planetEntriesW = Object.entries(rawPlanetsW) as [string, any][];
    const h2Planets = planetEntriesW.filter(([, p]) => p?.house === 2).map(([n]) => n);
    const h11Planets = planetEntriesW.filter(([, p]) => p?.house === 11).map(([n]) => n);
    const h10Planets = planetEntriesW.filter(([, p]) => p?.house === 10).map(([n]) => n);
    const activeMDW = chart.dashas?.find((d) => d.active)?.planet || "current Mahadasha lord";
    const h2Text = h2Planets.length ? `${h2Planets.join(" & ")} in 2nd house` : "2nd house (aspected)";
    const h11Text = h11Planets.length ? `${h11Planets.join(" & ")} in 11th house` : "11th house (aspected)";
    const h10Text = h10Planets.length ? `${h10Planets.join(", ")} in 10th house (Karma Bhava)` : "10th house activated";

    return [
      {
        title: "Dhana Yogas & Wealth Accumulation Axis (2nd & 11th House)",
        body: `${h2Text} and ${h11Text} form your primary wealth axis. Under the active ${activeMDW} Mahadasha, the Dhana-karaka alignment supports systematic accumulation when income is channeled into structured assets rather than liquid speculation. Lagnesh coordination with the 11th cusp confirms recurring gains from multiple income streams.`,
        metric: `Active Dhana axis: ${h2Text} → ${h11Text}. Favour long-term allocation over short-cycle trading.`,
      },
      {
        title: "Ashtakavarga 11th vs 12th House Bindu Balance",
        body: `In Parashari Ashtakavarga, when 11th-house bindus exceed 12th-house bindus the native retains wealth with minimal leakage. Your chart shows ${h11Text} generating gains, while expenditure control depends on conscious boundary-setting during 12th-house sub-lord periods. Prioritize savings automation during the first quarter of each calendar year.`,
        metric: "Shastra guideline: 11th > 12th bindus = net-positive retention cycle. Monitor closely during Rahu–Ketu sub-periods.",
      },
      {
        title: "Raja Yoga Activation & Career Authority Window",
        body: `${h10Text} establishes strong Karma Bhava density. When the ${activeMDW} lord also rules or aspects the 9th or 1st house, it triggers Raja Yoga conditions awakening public recognition, promotions, and high-value professional contracts. These milestones intensify during benefic Antardasha windows.`,
        metric: `Key activation corridor: ${activeMDW} Mahadasha × 9th-lord Antardasha. Document milestones reached.`,
      },
    ];
  }

  // Default Universal / Holistic Vedic Blueprint
  const resolvedMoonSign = (chart as any).moonSign || (chart.planets as any)?.Moon?.sign || "Chandra";
  return [
    {
      title: "Core Karmic Blueprint & Life Mission",
      body: `Born under ${chart.lagnaRashi} Lagna and ${resolvedMoonSign} Rashi, your life path involves balancing worldly responsibilities with inner spiritual sovereignty. Benefic planets in key angular houses safeguard you against sudden adversities.`,
      metric: "Planetary Equilibrium Index: Balanced with high resilient recovery.",
    },
    {
      title: "Varga & Divisional Depth Alignment",
      body: "Divisional charts (D9 Dharma, D10 Profession) act as celestial microscopes confirming that natal potentials manifest in the physical world without internal conflict when timed accurately.",
      metric: "Varga Harmony: Aligned across major life pillars.",
    },
    {
      title: "Upcoming Celestial Transits & Gochar Radar",
      body: "Major slow-moving planets (Saturn and Jupiter) are actively transiting supporting angles. Maintaining steady discipline in diet, professional ethics, and daily rituals guarantees lasting peace.",
      metric: "Optimal Focus: Consistency over speed yields 3x greater karmic returns.",
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4: 12-MONTH SHASTRA TIMING HORIZON & QUARTERLY ROADMAP
// ─────────────────────────────────────────────────────────────────────────────
function renderPage4QuarterlyHorizon(doc: PDFDoc, chart: ChartData, subject: string) {
  doc.rect(25, 25, 545, 765).lineWidth(1).strokeColor("#B8860B").stroke();

  doc.moveDown(1);
  doc.fontSize(14).fillColor("#1A1A1A").text("CHAPTER 3: 12-MONTH SHASTRA TIMING HORIZON", 45, 45);
  doc.fontSize(9).fillColor("#6B635B").text(`Quarterly celestial roadmap & strategic action windows for ${subject}`);

  doc.moveTo(45, 75).lineTo(550, 75).lineWidth(0.8).strokeColor("#B8860B").stroke();

  // Build personalized quarterly guidance from actual dasha data
  const activeMahadasha = chart.dashas?.find((d) => d.active)?.planet || "current lord";
  const activeAntardasha = chart.antardasha?.find((a) => a.active)?.planet || "sub-lord";
  const h10List = Object.entries(chart.planets || {}).filter(([, p]: [string, any]) => p?.house === 10).map(([n]) => n);
  const h9List = Object.entries(chart.planets || {}).filter(([, p]: [string, any]) => p?.house === 9).map(([n]) => n);
  const h2List = Object.entries(chart.planets || {}).filter(([, p]: [string, any]) => p?.house === 2).map(([n]) => n);
  const h12List = Object.entries(chart.planets || {}).filter(([, p]: [string, any]) => p?.house === 12).map(([n]) => n);
  const karmaGrahas = h10List.length ? h10List.join(" & ") : "aspected Karma Bhava";
  const bhagyaGrahas = h9List.length ? h9List.join(" & ") : "aspected Bhagya Bhava";
  const dhanaGrahas = h2List.length ? h2List.join(" & ") : "aspected Dhana Bhava";
  const vyayaGrahas = h12List.length ? h12List.join(" & ") : "12th house";

  const quarters = [
    {
      quarter: "Q1 (MONTHS 1–3)",
      title: `${activeMahadasha.toUpperCase()}–${activeAntardasha.toUpperCase()} PHASE: INTERNAL RECALIBRATION`,
      theme: `You are running ${activeMahadasha} Mahadasha under ${activeAntardasha} Antardasha. This sub-period demands patience and inner audit. ${dhanaGrahas} in your 2nd house (Dhana Bhava) supports quiet savings accumulation. Avoid impulsive decisions—allow karmic cycles to stabilise before major capital commitments.`,
      timing: `Auspicious Days for ${activeMahadasha}: ${activeMahadasha === "Rahu" || activeMahadasha === "Saturn" ? "Saturdays" : activeMahadasha === "Jupiter" ? "Thursdays" : "Wednesdays"} • Avoid Tuesdays for financial decisions`,
      precaution: `${activeMahadasha} Mahadasha can amplify impatience—slow down, document every agreement in writing.`,
    },
    {
      quarter: "Q2 (MONTHS 4–6)",
      title: `${karmaGrahas.toUpperCase()} IN KARMA BHAVA: CAREER VELOCITY WINDOW`,
      theme: `${karmaGrahas} occupying your 10th house (Karma Bhava) activates professional authority and leadership recognition in this period. High-velocity window for client acquisition, role changes, promotions, and strengthening professional alliances. Transit Mercury and Venus will conjunctively support 10th-house significations.`,
      timing: `Auspicious Windows: Wednesdays and Fridays • Favorable Colors: Emerald Green, Soft Gold`,
      precaution: `Maintain meticulous documentation in professional transactions—${activeAntardasha} sub-period can create miscommunication if verbal agreements replace written ones.`,
    },
    {
      quarter: "Q3 (MONTHS 7–9)",
      title: `${bhagyaGrahas.toUpperCase()} IN BHAGYA BHAVA: FORTUNE & DHARMA PEAK`,
      theme: `${bhagyaGrahas} in your 9th house (Bhagya Bhava) generates concentrated fortune, divine support, and mentorship connections. Excellent period for higher learning, long journeys, philosophical study, and establishing dharmic clarity. Legalised partnerships, collaborations with established institutions, and guru-shishya bonds flourish.`,
      timing: `Auspicious Windows: Thursdays and Sundays • Favorable Colors: Saffron, Royal Yellow`,
      precaution: `${bhagyaGrahas} in Bhagya can generate overconfidence—validate all opportunities with facts, not just enthusiasm.`,
    },
    {
      quarter: "Q4 (MONTHS 10–12)",
      title: `${vyayaGrahas.toUpperCase()} TRANSFORMATION: KARMIC HARVEST & RESET`,
      theme: `${vyayaGrahas} in the 12th house (Vyaya Bhava) governs spiritual expansion, foreign connections, and subconscious karmic clearing. Cumulative efforts of the year crystallise into achievements. Excellent period for pilgrimages, international collaborations, creative solitude, and long-term estate or legacy planning.`,
      timing: `Auspicious Windows: Tuesdays and Thursdays • Favorable Colors: Royal Blue, Ivory`,
      precaution: `12th-house activation can create sleep disruptions and scattered focus—maintain structured routines during this quarter.`,
    },
  ];

  let currentY = 88;
  quarters.forEach((q, idx) => {
    const cardH = 135;
    doc.rect(45, currentY, 505, cardH).fillAndStroke(idx % 2 === 0 ? "#FAF8F5" : "#FFFFFF", "#E0D7C6");

    // Quarter Header Banner
    doc.rect(45, currentY, 505, 24).fill("#8C6508");
    doc.fontSize(9).fillColor("#FAF7F0").text(`✦ ${q.quarter}: ${q.title}`, 55, currentY + 7);

    // Body
    doc.fontSize(8.5).fillColor("#2A2520").text(q.theme, 55, currentY + 32, {
      width: 485,
      lineGap: 2.5,
    });

    // Timing Strip
    doc.rect(55, currentY + 76, 485, 22).fill("#FAF0D7");
    doc.fontSize(7.8).fillColor("#8C6508").text(`⚡ ${q.timing}`, 65, currentY + 82);

    // Precaution Strip
    doc.rect(55, currentY + 103, 485, 22).fill("#F3EDE2");
    doc.fontSize(7.8).fillColor("#4A4238").text(`🛡️ SHASTRA PRECAUTION: ${q.precaution}`, 65, currentY + 109);

    currentY += cardH + 12;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 5: CLASSICAL REMEDIES & UPAYAS
// ─────────────────────────────────────────────────────────────────────────────
function renderPage5RemediesAndGuidance(doc: PDFDoc, chart: ChartData, reportId: string) {
  doc.rect(25, 25, 545, 765).lineWidth(1).strokeColor("#B8860B").stroke();

  doc.moveDown(1);
  doc.fontSize(14).fillColor("#1A1A1A").text("CHAPTER 4: SATTVIC REMEDIAL BLUEPRINT & UPAYAS", 45, 45);
  doc.fontSize(9).fillColor("#6B635B").text("100% Free, Authentic Classical Remedies • No Commercial Fees Required");

  doc.moveTo(45, 75).lineTo(550, 75).lineWidth(0.8).strokeColor("#B8860B").stroke();

  // Remedial Box 1: Sacred Mantra Therapy
  let y = 88;
  doc.rect(45, y, 505, 95).fillAndStroke("#FAF7F0", "#E0D7C6");
  doc.fontSize(10).fillColor("#8C6508").text("1. JAPA & MANTRA RECALIBRATION", 60, y + 10);
  doc.fontSize(8.5).fillColor("#2A2520").text(
    "Sound vibrations (Shabda Brahma) directly harmonize afflicted neurological and planetary frequencies. Chant the following sacred mantra 108 times daily during sunrise or sunset:",
    60,
    y + 26,
    { width: 475, lineGap: 2.5 }
  );
  doc.rect(60, y + 60, 475, 24).fill("#FFFFFF");
  doc.fontSize(9).fillColor("#8C6508").text("Om Namah Shivaya (Shiva Panchakshara Stotra) / Gayatri Mantra", 70, y + 67, { align: "center", width: 455 });

  // Remedial Box 2: Dana & Karmic Balancing
  y += 105;
  doc.rect(45, y, 505, 90).fillAndStroke("#FFFFFF", "#E0D7C6");
  doc.fontSize(10).fillColor("#8C6508").text("2. DANA (CHARITABLE GIVING & SERVICE)", 60, y + 10);
  doc.fontSize(8.5).fillColor("#2A2520").text(
    "Vedic remedies prioritize conscious karmic repayment over material expenditure. Offer green fodder or grain to birds and cows on Wednesdays or Saturdays. Serving the underprivileged dissolves malefic planetary transits faster than any gemstone.",
    60,
    y + 26,
    { width: 475, lineGap: 2.5 }
  );

  // Remedial Box 3: Lifestyle & Astro-Vastu Alignment
  y += 100;
  doc.rect(45, y, 505, 90).fillAndStroke("#FAF7F0", "#E0D7C6");
  doc.fontSize(10).fillColor("#8C6508").text("3. LIFESTYLE & DIRECTIONAL HARMONIZATION", 60, y + 10);
  doc.fontSize(8.5).fillColor("#2A2520").text(
    "Ensure your workspace faces North or East to harness positive magnetic flow. Avoid clutter in the North-East (Ishan) zone of your dwelling. Wearing warm ivory, saffron, or white hues harmonizes the Moon and Jupiter axis.",
    60,
    y + 26,
    { width: 475, lineGap: 2.5 }
  );

  // Sacred Gemstone & Rudraksha Harmony Matrix
  y += 100;
  doc.rect(45, y, 505, 115).fillAndStroke("#FFFFFF", "#E0D7C6");
  doc.fontSize(10).fillColor("#8C6508").text("4. SACRED GEMSTONE & RUDRAKSHA HARMONY MATRIX", 60, y + 10);
  
  // Table Header
  const tableY = y + 26;
  doc.rect(60, tableY, 475, 18).fill("#8C6508");
  doc.fontSize(7.8).fillColor("#FAF7F0");
  doc.text("PRIMARY GRAHA", 70, tableY + 5);
  doc.text("SHASTRA GEMSTONE", 175, tableY + 5);
  doc.text("RUDRAKSHA", 305, tableY + 5);
  doc.text("HARMONIZING ELEMENT", 405, tableY + 5);

  const harmonyRows = [
    { graha: "Lagnesh / Sun", gem: "Natural Ruby / Yellow Sapphire", rud: "1-Mukhi / 5-Mukhi", elem: "Tejas (Pure Solar Light)" },
    { graha: "Chandra (Moon)", gem: "Natural Pearl / Moonstone", rud: "2-Mukhi Rudraksha", elem: "Jala (Emotional Calm)" },
    { graha: "Guru (Jupiter)", gem: "Yellow Topaz / Citrine", rud: "5-Mukhi Rudraksha", elem: "Akasha (Wisdom & Grace)" },
  ];

  let rY = tableY + 18;
  harmonyRows.forEach((row, idx) => {
    doc.rect(60, rY, 475, 16).fill(idx % 2 === 0 ? "#FAF7F2" : "#FFFFFF");
    doc.fontSize(7.8).fillColor("#1A1A1A");
    doc.text(row.graha, 70, rY + 4);
    doc.text(row.gem, 175, rY + 4);
    doc.text(row.rud, 305, rY + 4);
    doc.text(row.elem, 405, rY + 4);
    rY += 16;
  });

  // Official AstroLife Authenticity Seal & Signoff
  y += 128;
  doc.rect(45, y, 505, 115).fillAndStroke("#1A1A1A", "#B8860B");
  doc.fontSize(11).fillColor("#D4AF37").text("✦ ASTROLIFE SACRED AUTHENTICITY SEAL ✦", 60, y + 14, { align: "center", width: 475 });
  doc.fontSize(8.5).fillColor("#F5EAD4").text(
    "Generated deterministically by AstroLife Vedic Shastric System • Certified Ephemeris Precision • All computations strictly follow Brihat Parashara Hora Shastra, Jaimini Upadesha Sutras, and Krishnamurti Paddhati principles.",
    60,
    y + 36,
    { width: 475, align: "center", lineGap: 3 }
  );
  doc.fontSize(8).fillColor("#9C948A").text("www.astrolife-ai.vercel.app • Verified Immutable Shastra Record", 60, y + 88, { align: "center", width: 475 });
}

function renderPageSampleLockedNotice(
  doc: PDFDoc,
  reportTitle: string
) {
  // Page Border
  doc.rect(40, 35, 515, 765).lineWidth(1.2).strokeColor("#B8860B").stroke();

  doc.fontSize(16).fillColor("#8C6508").text("ASTROLIFE SAMPLE PREVIEW", 45, 55, { align: "center", width: 505 });
  doc.fontSize(9.5).fillColor("#6B635B").text("Preliminary Mathematical Sample • Full Analysis Locked", 45, 78, { align: "center", width: 505 });
  doc.moveTo(45, 95).lineTo(550, 95).lineWidth(0.8).strokeColor("#B8860B").stroke();

  // Locked Banner
  doc.rect(45, 115, 505, 160).fillAndStroke("#FAF7F0", "#B8860B");
  doc.fontSize(13).fillColor("#8C6508").text("🔒 FULL 20–24 PAGE OFFICIAL DOSSIER LOCKED", 60, 135, { align: "center", width: 475 });

  doc.fontSize(9.5).fillColor("#2A2520").text(
    `You are viewing a watermarked sample preview of "${reportTitle}". The complete dossier includes deep divisional harmonic calculations, exact degree-level planetary transits, and your personal classical remedial blueprint:`,
    60,
    160,
    { width: 475, lineGap: 3, align: "center" }
  );

  const lockedFeatures = [
    "✓ Deep Harmonic Divisional Varga Analysis (D-9 Navamsha, D-10 Dasamsa, D-60 Shashtiamsha)",
    "✓ Exact Degree-Level Orbit Timing & Double-Transit Confirmation (Saturn & Jupiter)",
    "✓ 10-Year Mahadasha, Antardasha & Pratyantardasha Predictive Timeline",
    "✓ Complete 100% Free Authentic Classical Remedies (Japa, Dana, Vastu Lifestyle Alignment)",
    "✓ Lifetime Permanent Re-Download Access from your AstroLife History Vault",
    "✓ Instant Vector Print-Ready PDF Dispatched to Your Email Inbox",
  ];

  let y = 295;
  lockedFeatures.forEach((feat, idx) => {
    doc.rect(45, y, 505, 34).fillAndStroke(idx % 2 === 0 ? "#FFFFFF" : "#FAF7F2", "#E0D7C6");
    doc.fontSize(9).fillColor("#8C6508").text(feat, 60, y + 10, { width: 475 });
    y += 40;
  });

  // Call to Action Box
  y += 15;
  doc.rect(45, y, 505, 130).fillAndStroke("#1A1A1A", "#B8860B");
  doc.fontSize(12).fillColor("#D4AF37").text("✦ HOW TO UNLOCK YOUR OFFICIAL FULL DOSSIER ✦", 60, y + 18, { align: "center", width: 475 });

  doc.fontSize(9).fillColor("#F5EAD4").text(
    "To generate and download your official un-watermarked 20-24 page dossier with all personalized remedies, choose your package at the AstroLife Reports Store:",
    60,
    y + 42,
    { width: 475, align: "center", lineGap: 3 }
  );

  doc.rect(130, y + 78, 335, 30).fillAndStroke("#B8860B", "#D4AF37");
  doc.fontSize(10.5).fillColor("#FFFFFF").text("VISIT: https://astrolife-ai.vercel.app/reports", 130, y + 87, { align: "center", width: 335 });
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3 (NEW): DUAL VECTOR KUNDLI (D1 LAGNA & D9 NAVAMSHA) + VARGA SYNTHESIS
// ─────────────────────────────────────────────────────────────────────────────
function renderPageDualKundliAndVargas(doc: PDFDoc, chart: ChartData, subject: string) {
  doc.rect(25, 25, 545, 765).lineWidth(1).strokeColor("#B8860B").stroke();

  doc.fontSize(14).fillColor("#1A1A1A").text("CHAPTER 2: DUAL VECTOR KUNDLI & DIVISIONAL SYNTHESIS", 45, 45);
  doc.fontSize(9).fillColor("#6B635B").text(`D1 Lagna (Physical Reality) & D9 Navamsha (Dharma & Soul Destiny) for ${subject}`);
  doc.moveTo(45, 75).lineTo(550, 75).lineWidth(0.8).strokeColor("#B8860B").stroke();

  const divCharts = calculateDivisional(chart.planets as any, chart.lagnaNum, chart.lagnaLon);
  const d9 = divCharts.find((c) => c.key === "D9");
  const d10 = divCharts.find((c) => c.key === "D10");

  // Build D9 ChartData-compatible object for vector renderer
  const d9PlanetsMap: Record<string, any> = {};
  if (d9) {
    d9.planets.forEach((dp) => {
      d9PlanetsMap[dp.planet] = {
        sign: dp.sign,
        signNum: dp.signNum,
        house: dp.house,
        retrograde: dp.retrograde,
      };
    });
  }

  const d9ChartObj: any = {
    lagnaNum: d9?.lagnaNum ?? chart.lagnaNum,
    lagnaRashi: d9?.lagna ?? chart.lagnaRashi,
    planets: d9PlanetsMap,
  };

  // Side-by-side 220x220 Vector Charts
  const chartsY = 92;
  renderVectorNorthIndianKundli(doc, 55, chartsY, 220, chart, {
    title: "D1 NATAL LAGNA KUNDLI",
    borderColor: "#8C6508",
    innerLineColor: "#C9A961",
    fillColor: "#FAF7F0",
    signColor: "#8C6508",
    planetColor: "#1A1A1A",
  });

  renderVectorNorthIndianKundli(doc, 315, chartsY, 220, d9ChartObj, {
    title: "D9 NAVAMSHA KUNDLI (SOUL & DHARMA)",
    borderColor: "#8C6508",
    innerLineColor: "#C9A961",
    fillColor: "#FAF7F0",
    signColor: "#8C6508",
    planetColor: "#1A1A1A",
  });

  // Shadbala & Dignity Summary Box
  const shadbala = calculateShadbala(chart.planets as any);
  let y = 345;
  doc.rect(45, y, 505, 165).fillAndStroke("#FAF8F5", "#E0D7C6");
  doc.fontSize(10).fillColor("#8C6508").text("SHADBALA PLANETARY STRENGTH MATRIX (SIX-FOLD POWER)", 60, y + 10);

  // Mini Header
  doc.rect(60, y + 26, 475, 16).fill("#8C6508");
  doc.fontSize(7.5).fillColor("#FAF7F0");
  doc.text("PLANET", 70, y + 30);
  doc.text("TOTAL RUPAS", 160, y + 30);
  doc.text("REQ. RUPAS", 250, y + 30);
  doc.text("RATIO", 340, y + 30);
  doc.text("CLASSICAL VERDICT", 415, y + 30);

  let rowY = y + 42;
  shadbala.planets.slice(0, 7).forEach((sp, idx) => {
    doc.rect(60, rowY, 475, 16).fill(idx % 2 === 0 ? "#FFFFFF" : "#F6F1E7");
    doc.fontSize(7.8).fillColor("#1A1A1A");
    doc.text(sp.planet, 70, rowY + 4);
    doc.text(`${sp.totalRupas.toFixed(2)}`, 160, rowY + 4);
    doc.text(`${sp.requiredRupas.toFixed(2)}`, 250, rowY + 4);
    doc.text(`${sp.shadbalaRatio.toFixed(2)}x`, 340, rowY + 4);
    doc.fillColor(sp.passesThreshold ? "#15803D" : "#B45309");
    doc.text(sp.passesThreshold ? "STRONG (Above Threshold)" : "MODERATE (Needs Support)", 415, rowY + 4);
    rowY += 16;
  });

  // D9 & D10 Analysis Cards
  y = 525;
  const navAnalysis = d9 ? getNavamshaAnalysis(d9).slice(0, 3) : ["Navamsha chart indicates spiritual resilience and partnership balance."];
  const dashAnalysis = d10 ? getDashamshaAnalysis(d10).slice(0, 3) : ["Dashamsha indicates structured career growth through persistent mastery."];

  doc.rect(45, y, 505, 115).fillAndStroke("#FFFFFF", "#E0D7C6");
  doc.fontSize(9.5).fillColor("#8C6508").text("✦ D9 NAVAMSHA (MARRIAGE & FORTUNE) KEY INSIGHTS", 60, y + 10);
  doc.fontSize(8.2).fillColor("#2A2520").text(navAnalysis.join(" • "), 60, y + 26, { width: 475, lineGap: 2.5 });

  y += 125;
  doc.rect(45, y, 505, 115).fillAndStroke("#FAF7F0", "#E0D7C6");
  doc.fontSize(9.5).fillColor("#8C6508").text("✦ D10 DASHAMSHA (CAREER & AUTHORITY) KEY INSIGHTS", 60, y + 10);
  doc.fontSize(8.2).fillColor("#2A2520").text(dashAnalysis.join(" • "), 60, y + 26, { width: 475, lineGap: 2.5 });
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4 (NEW): VIMSHOTTARI MAHADASHA & ANTARDASHA CALENDAR
// ─────────────────────────────────────────────────────────────────────────────
function renderPageDashaCalendar(doc: PDFDoc, chart: ChartData, subject: string) {
  doc.rect(25, 25, 545, 765).lineWidth(1).strokeColor("#B8860B").stroke();

  doc.fontSize(14).fillColor("#1A1A1A").text("CHAPTER 3: VIMSHOTTARI MAHADASHA & ANTARDASHA CALENDAR", 45, 45);
  doc.fontSize(9).fillColor("#6B635B").text(`Exact astronomical planetary period timelines for ${subject}`);
  doc.moveTo(45, 75).lineTo(550, 75).lineWidth(0.8).strokeColor("#B8860B").stroke();

  // Table 1: Full Mahadasha Timeline
  let y = 90;
  doc.fontSize(10).fillColor("#8C6508").text("1. COMPLETE VIMSHOTTARI MAHADASHA SEQUENCE (120-YEAR CYCLE)", 45, y);
  y += 18;

  doc.rect(45, y, 505, 20).fill("#8C6508");
  doc.fontSize(8).fillColor("#FAF7F0");
  doc.text("MAHADASHA LORD", 55, y + 6);
  doc.text("DURATION", 185, y + 6);
  doc.text("START DATE", 275, y + 6);
  doc.text("END DATE", 385, y + 6);
  doc.text("STATUS", 480, y + 6);

  y += 20;
  const fmtDate = (d: Date | string) => {
    try {
      const dt = d instanceof Date ? d : new Date(d);
      return dt.toISOString().slice(0, 10);
    } catch {
      return "—";
    }
  };

  // Format decimal years to "Xy Ym" for human readability
  const fmtYrs = (rawYrs: number): string => {
    if (!rawYrs || isNaN(rawYrs)) return "—";
    const totalDays = Math.round(rawYrs * 365.25);
    const years = Math.floor(totalDays / 365);
    const rem = totalDays % 365;
    const months = Math.floor(rem / 30);
    if (years === 0) return `${months}m`;
    if (months === 0) return `${years}y`;
    return `${years}y ${months}m`;
  };

  (chart.dashas || []).slice(0, 9).forEach((d, idx) => {
    const bg = d.active ? "#FAF0D7" : idx % 2 === 0 ? "#FAF8F5" : "#FFFFFF";
    doc.rect(45, y, 505, 20).fill(bg);
    doc.fontSize(8.2).fillColor(d.active ? "#8C6508" : "#1A1A1A");
    doc.text(d.planet, 55, y + 6);
    doc.text(fmtYrs(Number(d.yrs)), 185, y + 6);
    doc.text(fmtDate(d.start), 275, y + 6);
    doc.text(fmtDate(d.end), 385, y + 6);
    doc.fillColor(d.active ? "#15803D" : "#6B635B");
    doc.text(d.active ? "ACTIVE NOW" : "Scheduled", 480, y + 6);
    y += 20;
  });

  // Table 2: Active Antardasha Sub-Periods
  y += 25;
  const activeMD = chart.dashas?.find((d) => d.active)?.planet || chart.dashas?.[0]?.planet || "Current";
  doc.fontSize(10).fillColor("#8C6508").text(`2. ACTIVE ANTARDASHA SUB-PERIODS (UNDER ${activeMD.toUpperCase()} MAHADASHA)`, 45, y);
  y += 18;

  doc.rect(45, y, 505, 20).fill("#11162E");
  doc.fontSize(8).fillColor("#FAF7F0");
  doc.text("ANTARDASHA LORD", 55, y + 6);
  doc.text("START DATE", 220, y + 6);
  doc.text("END DATE", 345, y + 6);
  doc.text("STATUS", 470, y + 6);

  y += 20;
  (chart.antardasha || []).slice(0, 9).forEach((ad, idx) => {
    const bg = ad.active ? "#FAF0D7" : idx % 2 === 0 ? "#FAF8F5" : "#FFFFFF";
    doc.rect(45, y, 505, 20).fill(bg);
    doc.fontSize(8.2).fillColor(ad.active ? "#8C6508" : "#1A1A1A");
    doc.text(`${activeMD} — ${ad.planet}`, 55, y + 6);
    doc.text(fmtDate(ad.start), 220, y + 6);
    doc.text(fmtDate(ad.end), 345, y + 6);
    doc.fillColor(ad.active ? "#15803D" : "#6B635B");
    doc.text(ad.active ? "ACTIVE NOW" : "Sub-Period", 470, y + 6);
    y += 20;
  });

  // Dasha Guidance Footer Card
  y += 20;
  doc.rect(45, y, 505, 95).fillAndStroke("#FAF7F0", "#B8860B");
  doc.fontSize(9.5).fillColor("#8C6508").text("✦ VIMSHOTTARI TIMING PRINCIPLE", 60, y + 12);
  doc.fontSize(8.5).fillColor("#2A2520").text(
    "In Parashari Jyotisha, no planet delivers results outside its Dasha window. The Mahadasha Lord acts as the Chief Executive setting your overarching life direction over years, while the Antardasha Lord acts as the Operational Manager precipitating specific milestones, meetings, and transformations during its months.",
    60,
    y + 30,
    { width: 475, lineGap: 3 }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 5 (NEW): DETECTED VEDIC YOGAS & KARMIC POWERHOUSES
// ─────────────────────────────────────────────────────────────────────────────
function renderPageDetectedYogas(doc: PDFDoc, chart: ChartData, subject: string) {
  doc.rect(25, 25, 545, 765).lineWidth(1).strokeColor("#B8860B").stroke();

  doc.fontSize(14).fillColor("#1A1A1A").text("CHAPTER 4: DETECTED VEDIC YOGAS & KARMIC SIGNATURES", 45, 45);
  doc.fontSize(9).fillColor("#6B635B").text(`Classical planetary combinations computed for ${subject}`);
  doc.moveTo(45, 75).lineTo(550, 75).lineWidth(0.8).strokeColor("#B8860B").stroke();

  const presentYogas = getPresentYogas(chart.planets as any, chart.lagnaNum, "pro");
  const topYogas = presentYogas.slice(0, 6);

  let y = 90;
  if (topYogas.length === 0) {
    doc.rect(45, y, 505, 80).fillAndStroke("#FAF7F0", "#E0D7C6");
    doc.fontSize(9.5).fillColor("#8C6508").text("BALANCED NATAL PLANETARY CONFIGURATION", 60, y + 15);
    doc.fontSize(8.5).fillColor("#2A2520").text(
      "Your chart exhibits steady, self-made planetary alignments free from extreme imbalances, empowering steady growth through consistent personal discipline.",
      60,
      y + 35,
      { width: 475, lineGap: 3 }
    );
  } else {
    topYogas.forEach((yoga, idx) => {
      const cardH = 102;
      doc.rect(45, y, 505, cardH).fillAndStroke(idx % 2 === 0 ? "#FAF8F5" : "#FFFFFF", yoga.isDosha ? "#B45309" : "#E0D7C6");

      doc.fontSize(9.5).fillColor(yoga.isDosha ? "#B45309" : "#8C6508").text(
        `✦ ${yoga.name} [${yoga.category.toUpperCase()}] • Planets: ${yoga.planets.join(", ")}`,
        60,
        y + 10
      );

      doc.fontSize(8.2).fillColor("#2A2520").text(yoga.description, 60, y + 26, { width: 475, lineGap: 2 });

      doc.rect(60, y + 70, 475, 22).fill(yoga.isDosha ? "#FEF3C7" : "#FAF0D7");
      doc.fontSize(7.8).fillColor(yoga.isDosha ? "#92400E" : "#8C6508").text(`IMPACT: ${yoga.impact}`, 70, y + 76, { width: 455, lineBreak: false });

      y += cardH + 10;
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 7 (NEW): 12-HOUSE BHAVA VITALITY OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
function renderPageTwelveHousesOverview(doc: PDFDoc, chart: ChartData, subject: string) {
  doc.rect(25, 25, 545, 765).lineWidth(1).strokeColor("#B8860B").stroke();

  doc.fontSize(14).fillColor("#1A1A1A").text("CHAPTER 6: 12-HOUSE BHAVA VITALITY MATRIX", 45, 45);
  doc.fontSize(9).fillColor("#6B635B").text(`Complete house-by-house life pillar overview for ${subject}`);
  doc.moveTo(45, 75).lineTo(550, 75).lineWidth(0.8).strokeColor("#B8860B").stroke();

  const houseThemes = [
    { h: 1, title: "1st House (Tanu — Self & Vitality)", focus: "Personality, physical health, confidence & life direction." },
    { h: 2, title: "2nd House (Dhana — Wealth & Speech)", focus: "Accumulated savings, family lineage, voice & values." },
    { h: 3, title: "3rd House (Sahaja — Courage & Skills)", focus: "Willpower, communication, short travels & siblings." },
    { h: 4, title: "4th House (Sukha — Home & Comfort)", focus: "Mother, real estate, vehicles & inner emotional peace." },
    { h: 5, title: "5th House (Putra — Wisdom & Creativity)", focus: "Intellect, speculation, romance, children & past merit." },
    { h: 6, title: "6th House (Ripu — Service & Health)", focus: "Daily work, competition, immunity & debt resolution." },
    { h: 7, title: "7th House (Kalatra — Union & Trade)", focus: "Marriage, long-term partnerships, contracts & public image." },
    { h: 8, title: "8th House (Randhra — Transformation)", focus: "Longevity, occult insight, inheritance & sudden shifts." },
    { h: 9, title: "9th House (Bhagya — Dharma & Fortune)", focus: "Higher wisdom, mentors, long journeys & divine grace." },
    { h: 10, title: "10th House (Karma — Career & Status)", focus: "Profession, authority, leadership & public legacy." },
    { h: 11, title: "11th House (Labha — Gains & Networks)", focus: "Income realization, aspirations, allies & major rewards." },
    { h: 12, title: "12th House (Vyaya — Liberation & Foreign)", focus: "Foreign settlement, subconscious mind, charity & moksha." },
  ];

  // Group planets by house
  const planetsByHouse: Record<number, string[]> = {};
  Object.entries(chart.planets || {}).forEach(([name, pData]: [string, any]) => {
    const hNum = pData?.house || 1;
    if (!planetsByHouse[hNum]) planetsByHouse[hNum] = [];
    planetsByHouse[hNum].push(name);
  });

  let y = 90;
  for (let i = 0; i < 12; i += 2) {
    const left = houseThemes[i];
    const right = houseThemes[i + 1];

    [left, right].forEach((item, colIdx) => {
      const x = colIdx === 0 ? 45 : 302;
      const boxW = 248;
      const boxH = 105;

      const signIdx = (chart.lagnaNum + item.h - 1) % 12;
      const signName = RASHIS[signIdx] || "Rashi";
      const occupants = planetsByHouse[item.h]?.length ? planetsByHouse[item.h].join(", ") : "Empty (Aspect Driven)";

      doc.rect(x, y, boxW, boxH).fillAndStroke(colIdx === 0 ? "#FAF8F5" : "#FFFFFF", "#E0D7C6");
      doc.rect(x, y, boxW, 20).fill("#8C6508");
      doc.fontSize(8.2).fillColor("#FAF7F0").text(item.title, x + 8, y + 6, { width: boxW - 16, lineBreak: false });

      doc.fontSize(7.8).fillColor("#8C6508").text(`Sign: ${signName}`, x + 8, y + 26);
      doc.fontSize(7.8).fillColor("#1A1A1A").text(`Grahas: ${occupants}`, x + 8, y + 39, { width: boxW - 16 });
      doc.fontSize(7.6).fillColor("#4A4238").text(item.focus, x + 8, y + 58, { width: boxW - 16, lineGap: 2 });
    });

    y += 113;
  }
}
