import jsPDF from "jspdf";
import { downloadReportAsPDF } from "./report-html-generator";
import type { ChartData } from "./astro-engine/calculations";
import { calculateRemedies } from "./astro-engine/remedy";
import { calculateMedical } from "./astro-engine/medical";
import { calculatePsychology } from "./astro-engine/psychology";
import { detectYogas } from "./astro-engine/yogas";
import { calculateShadbala } from "./astro-engine/shadbala";
import { calculateLalKitab } from "./astro-engine/lalkitab";
import { calculateNumerology } from "./astro-engine/numerology";
import { calculateAshtakavarga } from "./astro-engine/ashtakavarga";
import { calculateDivisional, getRasiAnalysis, getHoraAnalysis, getDrekkanaAnalysis, getSaptamsaAnalysis } from "./astro-engine/divisional";
import { generateGemstoneReportFromChart } from "./astro-engine/gemstone";
import { calculateKarakas, calculateArudhas, calculateCharaDasha } from "./astro-engine/jaimini";
import { runTransitEngine } from "./astro-engine/transit";
import { calculateDestiny } from "./astro-engine/destiny";
import { getMahadashaInterpretation, getAntardashaInterpretation } from "./astro-engine/dasha-interpretations";
import { PLANET_HOUSE_RULES, HOME_OMEN_RULES, HOUSE_WISE_OMENS, RIN_RULES, COMBINATION_RULES } from "./astro-engine/lalkitab-knowledge";
import { composeVedicParagraph, composeLKParagraph, composePsychOmenParagraph, composeUpcomingMDParagraph } from "./astro-engine/dasha-composer";

export type ReportPalette = "midnight" | "saffron" | "ivory" | "forest" | "maroon";
export type ReportCover   = "wheel" | "lagnalord";

export interface ReportOptions {
  type: "full" | "kundli" | "remedy" | "medical" | "destiny";
  palette?: ReportPalette;
  cover?: ReportCover;
  includeAnalysis?: boolean;
  resolution?: number;
}

// ── Palette token sets (from design_handoff_pdf_toggle/styles.css) ─────────
type RGB = readonly [number, number, number];
interface PaletteTokens {
  bg:         RGB;  // cover / dark page background
  surface:    RGB;  // card / section surface
  gold:       RGB;  // primary accent — gold/brass
  goldBright: RGB;  // highlighted gold
  goldDim:    RGB;  // subdued gold
  ivory:      RGB;  // body text (may invert in light palette)
  ivoryDim:   RGB;  // secondary text
  ivoryMute:  RGB;  // muted text
  saffron:    RGB;  // accent 2
  light:      boolean; // true for ivory palette (light bg)
}

const PALETTES: Record<ReportPalette, PaletteTokens> = {
  midnight: {
    bg:         [10,  14,  31],
    surface:    [17,  22,  46],
    gold:       [201, 169,  97],
    goldBright: [217, 190, 123],
    goldDim:    [140, 116,  64],
    ivory:      [244, 239, 230],
    ivoryDim:   [200, 193, 176],
    ivoryMute:  [138, 132, 116],
    saffron:    [232, 146,  60],
    light:      false,
  },
  saffron: {
    bg:         [26,  15,  10],
    surface:    [42,  24,  12],
    gold:       [232, 146,  60],
    goldBright: [244, 168,  90],
    goldDim:    [148,  89,  31],
    ivory:      [250, 239, 224],
    ivoryDim:   [217, 197, 168],
    ivoryMute:  [155, 131, 102],
    saffron:    [244, 168,  90],
    light:      false,
  },
  ivory: {
    bg:         [242, 236, 223],  // light parchment
    surface:    [236, 229, 211],
    gold:       [140, 116,  64],
    goldBright: [163, 136,  81],
    goldDim:    [120,  96,  48],
    ivory:      [26,  31,  58],   // INVERTED — dark navy as body text
    ivoryDim:   [26,  31,  58],
    ivoryMute:  [80,  86, 120],
    saffron:    [180, 130,  60],
    light:      true,
  },
  forest: {
    bg:         [10,  24,  18],
    surface:    [18,  42,  31],
    gold:       [201, 169,  97],
    goldBright: [227, 201, 122],
    goldDim:    [140, 116,  64],
    ivory:      [240, 235, 222],
    ivoryDim:   [191, 184, 159],
    ivoryMute:  [124, 119, 101],
    saffron:    [232, 196, 106],
    light:      false,
  },
  maroon: {
    bg:         [26,   8,  12],
    surface:    [42,  15,  21],
    gold:       [212, 166,  86],
    goldBright: [234, 194, 117],
    goldDim:    [142, 111,  57],
    ivory:      [244, 236, 216],
    ivoryDim:   [207, 195, 166],
    ivoryMute:  [138, 126, 102],
    saffron:    [232, 146,  60],
    light:      false,
  },
};

// ── PDF Helpers ────────────────────────────────────────────────

const GOLD     = [200, 160, 48]  as const;
const BLACK    = [20,  20,  20]  as const;
const GRAY     = [100, 100, 100] as const;
const LIGHT    = [150, 150, 150] as const;
const WHITE    = [255, 255, 255] as const;
const DARK_BG  = [15,  15,  30]  as const;
const INK      = [9,    6,  26]  as const;
const SOFT_BG  = [251, 247, 239] as const;
const LINE     = [233, 223, 202] as const;
const ROW_ALT  = [245, 245, 250] as const;

// Section header colors (inspired by Python reportlab design)
const SC_BIRTH   = [102, 126, 234] as const;
const SC_PLANETS = [52,  152, 219] as const;
const SC_HOUSES  = [39,  174,  96] as const;
const SC_DASHA   = [243, 156,  18] as const;
const SC_YOGA    = [231,  76,  60] as const;
const SC_SHAKTI  = [155,  89, 182] as const;
const SC_PSYCH   = [26,  188, 156] as const;
const SC_LALKITAB= [230, 126,  34] as const;
const SC_REMEDY  = [230, 126,  34] as const;
const SC_MEDICAL = [192,  57,  43] as const;
const SC_NUMER   = [52,   73,  94] as const;
const SC_ASHTA   = [22,  160, 133] as const;
const SC_DIV     = [142,  68, 173] as const;
const SC_GEM     = [243, 156,  18] as const;
const SC_JAIMINI = [41,  128, 185] as const;
const SC_TRANSIT = [39,  174,  96] as const;
const SC_DESTINY = [211,  84,   0] as const;
const SC_LIFE    = [102, 126, 234] as const;
const SC_ANNUAL  = [22,  160, 133] as const;
const SC_CONC    = [102, 126, 234] as const;
const SC_VASTU   = [230, 126,  34] as const;

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
  Asc: "As",
};

const PLANET_RGB: Record<string, readonly [number, number, number]> = {
  Sun: [249, 115, 22],
  Moon: [168, 85, 247],
  Mars: [239, 68, 68],
  Mercury: [34, 197, 94],
  Jupiter: [217, 119, 6],
  Venus: [236, 72, 153],
  Saturn: [59, 130, 246],
  Rahu: [124, 58, 237],
  Ketu: [244, 63, 94],
  Asc: GOLD,
};

const RASHI_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

class PDFBuilder {
  pdf: jsPDF;
  y: number;
  pageW: number;
  pageH: number;
  margin = 15;
  pal: PaletteTokens;

  constructor(palette: ReportPalette = "midnight") {
    this.pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    this.pageW = this.pdf.internal.pageSize.getWidth();
    this.pageH = this.pdf.internal.pageSize.getHeight();
    this.y = 20;
    this.pal = PALETTES[palette] ?? PALETTES.midnight;
  }

  checkPage(needed = 12) {
    if (this.y + needed > this.pageH - 18) {
      this.pdf.addPage();
      this.y = 20;
      return true;
    }
    return false;
  }

  newPage() {
    this.pdf.addPage();
    this.y = 20;
  }

  // Palette-aware accent colour for headings/subheaders
  gold() { this.pdf.setTextColor(...this.pal.gold); }
  black() { this.pdf.setTextColor(...BLACK); }
  gray() { this.pdf.setTextColor(...GRAY); }
  light() { this.pdf.setTextColor(...LIGHT); }

  fitText(text: string, x: number, y: number, maxW: number, size = 9, style: "normal" | "bold" = "normal") {
    this.pdf.setFont("helvetica", style);
    this.pdf.setFontSize(size);
    let value = text || "—";
    while (this.pdf.getTextWidth(value) > maxW && value.length > 4) {
      value = `${value.slice(0, -4)}...`;
    }
    this.pdf.text(value, x, y);
  }

  chip(text: string, x: number, y: number) {
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(7.5);
    const w = Math.min(this.pdf.getTextWidth(text) + 10, 42);
    this.pdf.setFillColor(236, 196, 86);
    this.pdf.setDrawColor(219, 177, 57);
    this.pdf.roundedRect(x, y - 4, w, 7, 3.5, 3.5, "FD");
    this.pdf.setTextColor(...INK);
    this.pdf.text(text, x + 5, y + 1);
    this.pdf.setFont("helvetica", "normal");
    return x + w + 4;
  }

  keyValueGrid(items: Array<[string, string]>, cols = 2) {
    const gap = 5;
    const cellW = (this.pageW - this.margin * 2 - gap * (cols - 1)) / cols;
    const cellH = 16;
    const rows = Math.ceil(items.length / cols);
    this.checkPage(rows * (cellH + 4) + 4);
    items.forEach(([key, value], index) => {
      const x = this.margin + (index % cols) * (cellW + gap);
      const y = this.y + Math.floor(index / cols) * (cellH + 4);
      this.pdf.setFillColor(255, 253, 248);
      this.pdf.setDrawColor(...LINE);
      this.pdf.roundedRect(x, y, cellW, cellH, 3, 3, "FD");
      this.pdf.setTextColor(...GRAY);
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setFontSize(6.8);
      this.pdf.text(key.toUpperCase(), x + 4, y + 5);
      this.pdf.setTextColor(...INK);
      this.fitText(value, x + 4, y + 12, cellW - 8, 9, "bold");
    });
    this.y += rows * (cellH + 4) + 2;
  }

  tocRow(index: number, title: string) {
    this.checkPage(9);
    this.pdf.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 253 : 246, index % 2 === 0 ? 248 : 232);
    this.pdf.setDrawColor(...LINE);
    this.pdf.roundedRect(this.margin, this.y - 5, this.pageW - this.margin * 2, 8, 2, 2, "FD");
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(...GOLD);
    this.pdf.text(String(index + 1).padStart(2, "0"), this.margin + 4, this.y);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setTextColor(...INK);
    this.pdf.text(title.replace(/^\d+\.\s*/, ""), this.margin + 17, this.y);
    this.y += 9;
  }

  signalCard(title: string, value: string, note: string, color: readonly [number, number, number] = GOLD) {
    this.checkPage(23);
    this.pdf.setFillColor(255, 253, 248);
    this.pdf.setDrawColor(...LINE);
    this.pdf.roundedRect(this.margin, this.y - 3, this.pageW - this.margin * 2, 20, 4, 4, "FD");
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(this.margin, this.y - 3, 3, 20, 1.5, 1.5, "F");
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(...GRAY);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(title.toUpperCase(), this.margin + 8, this.y + 3);
    this.pdf.setFontSize(13);
    this.pdf.setTextColor(...color);
    this.fitText(value, this.margin + 8, this.y + 11, 58, 13, "bold");
    this.pdf.setTextColor(...BLACK);
    const lines = this.pdf.splitTextToSize(note, this.pageW - this.margin * 2 - 78);
    this.pdf.setFontSize(8);
    lines.slice(0, 2).forEach((line: string, i: number) => {
      this.pdf.text(line, this.margin + 72, this.y + 5 + i * 5);
    });
    this.y += 24;
  }

  drawNorthIndianChart(chart: ChartData, x: number, y: number, size: number) {
    const half = size / 2;
    this.pdf.setFillColor(8, 5, 26);
    this.pdf.setDrawColor(...GOLD);
    this.pdf.roundedRect(x, y, size, size, 4, 4, "FD");

    this.pdf.setDrawColor(95, 79, 137);
    this.pdf.setLineWidth(0.35);
    this.pdf.line(x, y, x + size, y + size);
    this.pdf.line(x + size, y, x, y + size);
    this.pdf.line(x + half, y, x + size, y + half);
    this.pdf.line(x + size, y + half, x + half, y + size);
    this.pdf.line(x + half, y + size, x, y + half);
    this.pdf.line(x, y + half, x + half, y);

    const houses = [
      [1, size / 2, size / 4], [2, size / 4, size / 8], [3, size / 8, size / 4], [4, size / 4, size / 2],
      [5, size / 8, (3 * size) / 4], [6, size / 4, (7 * size) / 8], [7, size / 2, (3 * size) / 4],
      [8, (3 * size) / 4, (7 * size) / 8], [9, (7 * size) / 8, (3 * size) / 4], [10, (3 * size) / 4, size / 2],
      [11, (7 * size) / 8, size / 4], [12, (3 * size) / 4, size / 8],
    ];

    const planetsByHouse: Record<number, string[]> = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i + 1, []]));
    planetsByHouse[1].push("Asc");
    Object.entries(chart.planets).forEach(([planet, data]) => {
      if (data.house >= 1 && data.house <= 12) planetsByHouse[data.house].push(planet);
    });

    houses.forEach(([house, hx, hy]) => {
      const houseNum = Number(house);
      const cx = x + Number(hx);
      const cy = y + Number(hy);
      const rashiNum = ((chart.lagnaNum + houseNum - 1) % 12) + 1;
      const labelColor: readonly [number, number, number] = houseNum === 1 ? GOLD : LIGHT;
      this.pdf.setTextColor(...labelColor);
      this.pdf.setFont("helvetica", houseNum === 1 ? "bold" : "normal");
      this.pdf.setFontSize(6.8);
      this.pdf.text(String(rashiNum), cx, cy - 4, { align: "center" });
      const planets = planetsByHouse[houseNum].slice(0, 4);
      planets.forEach((planet, index) => {
        const rgb = PLANET_RGB[planet] ?? WHITE;
        this.pdf.setTextColor(...rgb);
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setFontSize(6.4);
        const offset = (index - (planets.length - 1) / 2) * 7;
        this.pdf.text(PLANET_SYMBOLS[planet] ?? planet.slice(0, 2), cx + offset, cy + 4, { align: "center" });
      });
    });
    this.pdf.setTextColor(...BLACK);
    this.pdf.setFont("helvetica", "normal");
  }

  sectionHeader(title: string, addNewPage = true) {
    if (addNewPage) this.newPage();
    const color: readonly [number, number, number] =
      title.includes("CONTENTS")        ? GOLD :
      title.includes("BIRTH")           ? SC_BIRTH :
      title.includes("PLANET")          ? SC_PLANETS :
      title.includes("HOUSE")           ? SC_HOUSES :
      title.includes("DASHA")           ? SC_DASHA :
      title.includes("YOGA")            ? SC_YOGA :
      title.includes("SHADBALA")        ? SC_SHAKTI :
      title.includes("PSYCHOLOGY BRIDGE") ? SC_VASTU :
      title.includes("PSYCHOLOGY")      ? SC_PSYCH :
      title.includes("LAL KITAB")       ? SC_LALKITAB :
      title.includes("REMEDY")          ? SC_REMEDY :
      title.includes("MEDICAL")         ? SC_MEDICAL :
      title.includes("NUMEROLOG")       ? SC_NUMER :
      title.includes("ASHTAKAVARGA")    ? SC_ASHTA :
      title.includes("DIVISIONAL")      ? SC_DIV :
      title.includes("GEMSTONE")        ? SC_GEM :
      title.includes("JAIMINI")         ? SC_JAIMINI :
      title.includes("TRANSIT")         ? SC_TRANSIT :
      title.includes("DESTINY")         ? SC_DESTINY :
      title.includes("LIFE AREA")       ? SC_LIFE :
      title.includes("ANNUAL")          ? SC_ANNUAL :
      title.includes("CONCLUSION")      ? SC_CONC :
      SC_VASTU;
    const isGold = color === GOLD;
    const textRgb: readonly [number, number, number] = isGold ? DARK_BG : WHITE;
    this.pdf.setFillColor(...color);
    this.pdf.rect(this.margin, this.y - 5, this.pageW - this.margin * 2, 12, "F");
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(...textRgb);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(title, this.margin + 4, this.y + 3);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setTextColor(...BLACK);
    this.y += 14;
  }

  // Styled table with colored header row and alternating row backgrounds
  styledTable(
    headers: string[],
    rows: string[][],
    colXs: number[],
    headerColor: readonly [number, number, number] = GOLD
  ) {
    const rowH = 6.5;
    const tableW = this.pageW - this.margin * 2;
    this.checkPage(rowH * (rows.length + 2) + 4);

    // Header row
    this.pdf.setFillColor(...headerColor);
    this.pdf.rect(this.margin, this.y - 4, tableW, rowH + 2, "F");
    this.pdf.setFontSize(8.5);
    this.pdf.setTextColor(...WHITE);
    this.pdf.setFont("helvetica", "bold");
    headers.forEach((h, i) => this.pdf.text(h, colXs[i], this.y));
    this.pdf.setFont("helvetica", "normal");
    this.y += rowH + 2;

    // Data rows
    rows.forEach((row, ri) => {
      this.checkPage(rowH + 1);
      if (ri % 2 === 0) {
        this.pdf.setFillColor(...ROW_ALT);
        this.pdf.rect(this.margin, this.y - 4, tableW, rowH + 1, "F");
      }
      this.pdf.setFontSize(8.5);
      this.pdf.setTextColor(...BLACK);
      row.forEach((cell, ci) => this.pdf.text(cell.substring(0, 32), colXs[ci], this.y));
      this.y += rowH;
    });
    this.y += 4;
  }

  // Row of colored stat boxes (e.g. yoga counts)
  statBoxRow(stats: Array<{ label: string; value: string; color: readonly [number, number, number] }>) {
    const n = stats.length;
    const boxW = (this.pageW - this.margin * 2) / n;
    const hdrH = 8;
    const valH = 14;
    this.checkPage(hdrH + valH + 6);

    stats.forEach((stat, i) => {
      const x = this.margin + i * boxW;
      // Label band
      this.pdf.setFillColor(...stat.color);
      this.pdf.rect(x, this.y, boxW - 1, hdrH, "F");
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(...WHITE);
      this.pdf.setFont("helvetica", "bold");
      this.pdf.text(stat.label, x + (boxW - 1) / 2, this.y + 5.5, { align: "center" });
      // Value band
      this.pdf.setFillColor(...ROW_ALT);
      this.pdf.rect(x, this.y + hdrH, boxW - 1, valH, "F");
      this.pdf.setFontSize(16);
      this.pdf.setTextColor(...stat.color);
      this.pdf.setFont("helvetica", "bold");
      this.pdf.text(stat.value, x + (boxW - 1) / 2, this.y + hdrH + 10, { align: "center" });
      this.pdf.setFont("helvetica", "normal");
    });
    this.pdf.setTextColor(...BLACK);
    this.y += hdrH + valH + 5;
  }

  // Horizontal score bar
  scoreBar(label: string, score: number, total: number, color: readonly [number, number, number] = GOLD) {
    this.checkPage(10);
    const trackW = 60;
    const barW = (score / total) * trackW;
    const labelX = this.margin;
    const scoreX = this.margin + 60;
    const barX = this.margin + 76;
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(...BLACK);
    this.pdf.text(label, labelX, this.y);
    this.pdf.setTextColor(...color);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(`${score}/${total}`, scoreX, this.y);
    this.pdf.setFont("helvetica", "normal");
    // Track
    this.pdf.setFillColor(220, 220, 230);
    this.pdf.roundedRect(barX, this.y - 4, trackW, 5, 1, 1, "F");
    // Fill
    this.pdf.setFillColor(...color);
    this.pdf.roundedRect(barX, this.y - 4, barW, 5, 1, 1, "F");
    this.pdf.setTextColor(...BLACK);
    this.y += 7;
  }

  subHeader(title: string) {
    this.checkPage(10);
    this.pdf.setFontSize(11);
    this.gold();
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(title, this.margin, this.y);
    this.pdf.setFont("helvetica", "normal");
    this.y += 8;
  }

  line(text: string, indent = 0, size = 9) {
    this.checkPage(7);
    const maxW = this.pageW - this.margin * 2 - indent;
    const lines = this.pdf.splitTextToSize(text, maxW);
    this.pdf.setFontSize(size);
    this.black();
    lines.forEach((l: string) => {
      this.checkPage(6);
      this.pdf.text(l, this.margin + indent, this.y);
      this.y += 5.5;
    });
  }

  bullet(text: string, indent = 5) {
    this.checkPage(7);
    const maxW = this.pageW - this.margin * 2 - indent - 4;
    const lines = this.pdf.splitTextToSize(text, maxW);
    this.pdf.setFontSize(9);
    this.black();
    this.pdf.text("•", this.margin + indent, this.y);
    lines.forEach((l: string) => {
      this.checkPage(6);
      this.pdf.text(l, this.margin + indent + 4, this.y);
      this.y += 5.5;
    });
  }

  keyValue(key: string, value: string, indent = 0) {
    this.checkPage(7);
    this.pdf.setFontSize(9);
    this.gold();
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(`${key}:`, this.margin + indent, this.y);
    this.pdf.setFont("helvetica", "normal");
    this.black();
    const keyWidth = this.pdf.getTextWidth(`${key}: `);
    const maxW = this.pageW - this.margin * 2 - indent - keyWidth;
    const lines = this.pdf.splitTextToSize(value, maxW);
    lines.forEach((l: string, i: number) => {
      this.pdf.text(l, this.margin + indent + keyWidth, i === 0 ? this.y : this.y);
      if (i === 0 && lines.length > 1) { this.y += 5.5; return; }
    });
    this.y += 5.5;
    if (lines.length > 1) {
      lines.slice(1).forEach((l: string) => {
        this.checkPage(6);
        this.pdf.text(l, this.margin + indent + keyWidth, this.y);
        this.y += 5.5;
      });
    }
  }

  divider() {
    this.checkPage(5);
    this.pdf.setDrawColor(...GOLD);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margin, this.y, this.pageW - this.margin, this.y);
    this.y += 4;
  }

  spacer(h = 4) { this.y += h; }

  // Flowing prose paragraph — used for dasha interpretations
  para(text: string, size = 9.5) {
    const maxW = this.pageW - this.margin * 2;
    const lines = this.pdf.splitTextToSize(text.trim(), maxW);
    this.pdf.setFontSize(size);
    this.black();
    this.pdf.setFont("helvetica", "normal");
    lines.forEach((l: string) => {
      this.checkPage(7);
      this.pdf.text(l, this.margin, this.y);
      this.y += 5.6;
    });
    this.y += 3;
  }

  // Render a labelled paragraph for dasha life-area sections
  // icon param kept for call-site compatibility but NOT rendered (jsPDF Helvetica can't render emoji)
  lifeAreaPara(
    _icon: string,
    label: string,
    text: string,
    labelColor: readonly [number, number, number] = SC_DASHA
  ) {
    this.checkPage(22);
    // Label badge — ASCII only, no emoji, capped at 90mm
    const badgeLabel = label.toUpperCase();
    this.pdf.setFontSize(8);
    const rawW = this.pdf.getTextWidth(`  ${badgeLabel}  `);
    const badgeW = Math.min(rawW + 4, 90);
    this.pdf.setFillColor(...labelColor);
    this.pdf.roundedRect(this.margin, this.y - 4, badgeW, 6.5, 1, 1, "F");
    this.pdf.setTextColor(...WHITE);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(badgeLabel, this.margin + 3, this.y);
    this.pdf.setFont("helvetica", "normal");
    this.y += 6;
    // Paragraph text — indented, line height 5.2
    const maxW = this.pageW - this.margin * 2 - 8;
    const lines = this.pdf.splitTextToSize(text.trim(), maxW);
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(...BLACK);
    lines.forEach((l: string) => {
      this.checkPage(6);
      this.pdf.text(l, this.margin + 5, this.y);
      this.y += 5.2;
    });
    this.y += 4;
  }

  // Two-column row
  twoCol(left: string, right: string) {
    this.checkPage(7);
    this.pdf.setFontSize(9);
    this.black();
    const half = (this.pageW - this.margin * 2) / 2;
    this.pdf.text(left, this.margin, this.y);
    this.pdf.text(right, this.margin + half, this.y);
    this.y += 5.5;
  }

  // Three-column row
  threeCol(a: string, b: string, c: string) {
    this.checkPage(7);
    this.pdf.setFontSize(8.5);
    this.black();
    const third = (this.pageW - this.margin * 2) / 3;
    this.pdf.text(a.substring(0, 30), this.margin, this.y);
    this.pdf.text(b.substring(0, 25), this.margin + third, this.y);
    this.pdf.text(c.substring(0, 25), this.margin + third * 2, this.y);
    this.y += 5.5;
  }

  addFooters(totalPages: number) {
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(7.5);
      this.pdf.setTextColor(...LIGHT);
      this.pdf.text(
        "Astrology is guidance-oriented. Use practical judgment for final decisions.",
        this.margin, this.pageH - 8
      );
      this.pdf.text("AstroLife AI", this.pageW / 2, this.pageH - 8, { align: "center" });
      this.pdf.text(`Page ${i} of ${totalPages}`, this.pageW - this.margin, this.pageH - 8, { align: "right" });
      this.pdf.setDrawColor(...GOLD);
      this.pdf.setLineWidth(0.2);
      this.pdf.line(this.margin, this.pageH - 12, this.pageW - this.margin, this.pageH - 12);
    }
  }

  output() { return this.pdf.output("blob"); }
}

// ── SAFE ENGINE CALL ───────────────────────────────────────────
function safeCall<T>(fn: () => T, fallback: T): T {
  try { return fn(); } catch { return fallback; }
}

// ── Cover helpers ──────────────────────────────────────────────────────────
const ZODIAC_NAMES  = ["ARIES","TAURUS","GEMINI","CANCER","LEO","VIRGO",
                        "LIBRA","SCORPIO","SAGIT","CAPRI","AQUAR","PISCES"];

// Lagna-lord mapping for lagnalord cover
const LAGNA_LORD: Record<string, { name: string; deity: string; devaSymbol: string }> = {
  Aries:       { name: "Mars",    deity: "Mangal",  devaSymbol: "MA" },
  Taurus:      { name: "Venus",   deity: "Shukra",  devaSymbol: "SH" },
  Gemini:      { name: "Mercury", deity: "Budha",   devaSymbol: "BU" },
  Cancer:      { name: "Moon",    deity: "Chandra",  devaSymbol: "CH" },
  Leo:         { name: "Sun",     deity: "Surya",   devaSymbol: "SU" },
  Virgo:       { name: "Mercury", deity: "Budha",   devaSymbol: "BU" },
  Libra:       { name: "Venus",   deity: "Shukra",  devaSymbol: "SH" },
  Scorpio:     { name: "Mars",    deity: "Mangal",  devaSymbol: "MA" },
  Sagittarius: { name: "Jupiter", deity: "Brihaspati", devaSymbol: "BR" },
  Capricorn:   { name: "Saturn",  deity: "Shani",   devaSymbol: "SN" },
  Aquarius:    { name: "Saturn",  deity: "Shani",   devaSymbol: "SN" },
  Pisces:      { name: "Jupiter", deity: "Brihaspati", devaSymbol: "BR" },
};

// Sanskrit cardinal labels for lagnalord cover
const DEVANAGARI_CARDINAL: Record<string, string[]> = {
  Mars:    ["मंगल", "लग्न", "बल", "मन्त्र"],
  Venus:   ["शुक्र", "लग्न", "प्रेम", "मन्त्र"],
  Mercury: ["बुध",  "लग्न", "बुद्धि", "मन्त्र"],
  Moon:    ["चन्द्र","लग्न", "मन", "मन्त्र"],
  Sun:     ["सूर्य", "लग्न", "तेज", "मन्त्र"],
  Jupiter: ["बृहस्पति","लग्न","ज्ञान","मन्त्र"],
  Saturn:  ["शनि",  "लग्न", "कर्म", "मन्त्र"],
  Rahu:    ["राहु", "लग्न", "छाया", "मन्त्र"],
  Ketu:    ["केतु", "लग्न", "मोक्ष", "मन्त्र"],
};

function drawCoverNativeLine(b: PDFBuilder, chart: ChartData, y: number) {
  const pal = b.pal;
  const sunSign  = chart.planets.Sun?.sign  ?? "—";
  const moonSign = chart.planets.Moon?.sign ?? "—";
  const moonNak  = chart.planets.Moon?.nakshatra ?? "—";

  // "prepared exclusively for" line
  b.pdf.setFontSize(8.5);
  b.pdf.setTextColor(...pal.ivoryMute);
  b.pdf.setFont("helvetica", "italic");
  b.pdf.text("prepared exclusively for", b.pageW / 2, y, { align: "center" });

  // Name
  b.pdf.setFontSize(22);
  b.pdf.setTextColor(...pal.ivory);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text(chart.name, b.pageW / 2, y + 10, { align: "center" });

  // Glyph row — Lagna · Moon · Sun · Nakshatra
  b.pdf.setFontSize(8);
  b.pdf.setTextColor(...pal.gold);
  b.pdf.setFont("helvetica", "normal");
  const glyphLine = `${chart.lagnaRashi} Ascendant  ·  ${sunSign} Sun  ·  ${moonSign} Moon  ·  ${moonNak} Nakshatra`;
  b.pdf.text(glyphLine, b.pageW / 2, y + 19, { align: "center" });
}

function drawOrnamentalRule(b: PDFBuilder, y: number, width = 60) {
  const cx = b.pageW / 2;
  b.pdf.setDrawColor(...b.pal.gold);
  b.pdf.setLineWidth(0.25);
  b.pdf.line(cx - width / 2, y, cx - 6, y);
  b.pdf.line(cx + 6,         y, cx + width / 2, y);
  b.pdf.setFontSize(10);
  b.pdf.setTextColor(...b.pal.gold);
  b.pdf.text("◆", cx, y + 1.5, { align: "center" });
}

// ── COVER A: Zodiac Wheel ─────────────────────────────────────────────────
function drawWheelCover(b: PDFBuilder, chart: ChartData) {
  const pal = b.pal;
  const cx = b.pageW / 2;
  const cy = b.pageH * 0.42;

  // Full page background
  b.pdf.setFillColor(...pal.bg);
  b.pdf.rect(0, 0, b.pageW, b.pageH, "F");

  // Zodiac wheel — 3 concentric rings, very low opacity via fill trick
  b.pdf.setDrawColor(...pal.goldDim);
  b.pdf.setLineWidth(0.3);
  [52, 46, 45].forEach(r => b.pdf.circle(cx, cy, r, "S"));

  // Inner constellation rings
  b.pdf.setLineWidth(0.15);
  [32, 26].forEach(r => b.pdf.circle(cx, cy, r, "S"));

  // 12 radial dividers + zodiac labels around outer ring
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x1 = cx + 26 * Math.cos(angle);
    const y1 = cy + 26 * Math.sin(angle);
    const x2 = cx + 52 * Math.cos(angle);
    const y2 = cy + 52 * Math.sin(angle);
    b.pdf.line(x1, y1, x2, y2);

    // Zodiac glyph label
    const labelR = 58;
    const lx = cx + labelR * Math.cos(angle + 15 * Math.PI / 180);
    const ly = cy + labelR * Math.sin(angle + 15 * Math.PI / 180);
    b.pdf.setFontSize(6);
    b.pdf.setTextColor(...pal.goldDim);
    b.pdf.text(ZODIAC_NAMES[i], lx, ly, { align: "center" });
  }

  // Brand wordmark top
  b.pdf.setFontSize(11);
  b.pdf.setTextColor(...pal.gold);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text("AstroLife", b.margin, 18);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.setFontSize(7.5);
  b.pdf.setTextColor(...pal.ivoryMute);
  b.pdf.text("COSMIC BLUEPRINT  ·  VEDIC ASTROLOGY REPORT", b.pageW - b.margin, 18, { align: "right" });

  // Top hairline rule
  b.pdf.setDrawColor(...pal.gold);
  b.pdf.setLineWidth(0.2);
  b.pdf.line(b.margin, 22, b.pageW - b.margin, 22);

  // "Your / Cosmic / Blueprint" title stack — centred in wheel zone
  const titleY = cy - 22;
  b.pdf.setFontSize(36);
  b.pdf.setTextColor(...pal.ivory);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.text("Your", cx, titleY, { align: "center" });

  b.pdf.setFontSize(44);
  b.pdf.setTextColor(...pal.goldBright);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text("Cosmic", cx, titleY + 16, { align: "center" });

  b.pdf.setFontSize(36);
  b.pdf.setTextColor(...pal.ivory);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.text("Blueprint", cx, titleY + 30, { align: "center" });

  // Ornamental rule below title
  drawOrnamentalRule(b, cy + 38, 56);

  // Native line at bottom
  drawCoverNativeLine(b, chart, b.pageH - 48);

  // Bottom hairline
  b.pdf.setDrawColor(...pal.goldDim);
  b.pdf.setLineWidth(0.2);
  b.pdf.line(b.margin, b.pageH - 28, b.pageW - b.margin, b.pageH - 28);

  // Generated date
  b.pdf.setFontSize(7);
  b.pdf.setTextColor(...pal.ivoryMute);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.text(
    `Generated ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
    b.pageW / 2, b.pageH - 22, { align: "center" }
  );
}

// ── COVER B: Lagna Lord Mandala ───────────────────────────────────────────
function drawLagnaLordCover(b: PDFBuilder, chart: ChartData) {
  const pal  = b.pal;
  const cx   = b.pageW / 2;
  const lord = LAGNA_LORD[chart.lagnaRashi] ?? LAGNA_LORD.Aries;
  const cardinals = DEVANAGARI_CARDINAL[lord.name] ?? DEVANAGARI_CARDINAL.Mercury;

  // Background
  b.pdf.setFillColor(...pal.bg);
  b.pdf.rect(0, 0, b.pageW, b.pageH, "F");

  // Brand rail
  b.pdf.setFontSize(11);
  b.pdf.setTextColor(...pal.gold);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text("AstroLife", b.margin, 18);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.setFontSize(7.5);
  b.pdf.setTextColor(...pal.ivoryMute);
  b.pdf.text("COSMIC BLUEPRINT  ·  VEDIC ASTROLOGY REPORT", b.pageW - b.margin, 18, { align: "right" });
  b.pdf.setDrawColor(...pal.gold);
  b.pdf.setLineWidth(0.2);
  b.pdf.line(b.margin, 22, b.pageW - b.margin, 22);

  // Eyebrow above mandala
  const mcy = b.pageH * 0.42;
  b.pdf.setFontSize(8);
  b.pdf.setTextColor(...pal.gold);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text(`${chart.name.toUpperCase()}  ·  ${chart.lagnaRashi.toUpperCase()} ASCENDANT`, cx, mcy - 68, { align: "center" });

  // Mandala — outer ring, inner ring, cross lines
  b.pdf.setDrawColor(...pal.gold);
  b.pdf.setLineWidth(0.5);
  b.pdf.circle(cx, mcy, 38, "S");
  b.pdf.setLineWidth(0.2);
  b.pdf.circle(cx, mcy, 35, "S");

  // Four petal arcs (simplified as short arcs via lines at 45°)
  [0, 90, 180, 270].forEach(deg => {
    const rad = deg * Math.PI / 180;
    const x1 = cx + 22 * Math.cos(rad);
    const y1 = mcy + 22 * Math.sin(rad);
    const x2 = cx + 34 * Math.cos(rad);
    const y2 = mcy + 34 * Math.sin(rad);
    b.pdf.setDrawColor(...pal.goldDim);
    b.pdf.setLineWidth(0.3);
    b.pdf.line(x1, y1, x2, y2);
  });

  // Inner double circle
  b.pdf.setDrawColor(...pal.gold);
  b.pdf.setLineWidth(0.4);
  b.pdf.circle(cx, mcy, 18, "S");
  b.pdf.setLineWidth(0.2);
  b.pdf.circle(cx, mcy, 14, "S");

  // Lord initials in centre
  b.pdf.setFontSize(16);
  b.pdf.setTextColor(...pal.goldBright);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text(lord.devaSymbol, cx, mcy + 5, { align: "center" });

  // Cardinal Sanskrit labels (top / right / bottom / left)
  const cardinalPos = [
    { x: cx,      y: mcy - 44 },
    { x: cx + 48, y: mcy + 2  },
    { x: cx,      y: mcy + 48 },
    { x: cx - 48, y: mcy + 2  },
  ];
  b.pdf.setFontSize(8);
  b.pdf.setTextColor(...pal.gold);
  b.pdf.setFont("helvetica", "normal");
  cardinals.forEach((label, i) => {
    b.pdf.text(label, cardinalPos[i].x, cardinalPos[i].y, { align: "center" });
  });

  // Lord name + deity below mandala
  b.pdf.setFontSize(14);
  b.pdf.setTextColor(...pal.ivory);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text(`${lord.name} — Lagna Lord`, cx, mcy + 56, { align: "center" });

  b.pdf.setFontSize(9);
  b.pdf.setTextColor(...pal.gold);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.text(lord.deity, cx, mcy + 64, { align: "center" });

  // Ornamental rule
  drawOrnamentalRule(b, mcy + 72, 52);

  // Title stack
  const titleY = mcy + 86;
  b.pdf.setFontSize(32);
  b.pdf.setTextColor(...pal.ivory);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.text("Your", cx, titleY, { align: "center" });
  b.pdf.setFontSize(40);
  b.pdf.setTextColor(...pal.goldBright);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text("Cosmic Blueprint", cx, titleY + 14, { align: "center" });

  // Native line
  drawCoverNativeLine(b, chart, b.pageH - 48);

  // Bottom rule + date
  b.pdf.setDrawColor(...pal.goldDim);
  b.pdf.setLineWidth(0.2);
  b.pdf.line(b.margin, b.pageH - 28, b.pageW - b.margin, b.pageH - 28);
  b.pdf.setFontSize(7);
  b.pdf.setTextColor(...pal.ivoryMute);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.text(
    `Generated ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
    b.pageW / 2, b.pageH - 22, { align: "center" }
  );
}

// Palette-aware premium cover dispatcher
function drawPremiumCover(b: PDFBuilder, chart: ChartData, cover: ReportCover = "wheel") {
  if (cover === "lagnalord") {
    drawLagnaLordCover(b, chart);
  } else {
    drawWheelCover(b, chart);
  }
}

function samplePage(b: PDFBuilder, section: string) {
  b.pdf.addPage();
  b.y = 26;
  b.pdf.setFillColor(...SOFT_BG);
  b.pdf.rect(0, 0, b.pageW, b.pageH, "F");
  b.pdf.setTextColor(...INK);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.setFontSize(8);
  b.pdf.text("AstroLife Premium Report", b.margin, 13);
  b.pdf.setTextColor(...GRAY);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.setFontSize(7);
  b.pdf.text(section, b.pageW - b.margin, 13, { align: "right" });
  b.pdf.setDrawColor(...LINE);
  b.pdf.line(b.margin, 17, b.pageW - b.margin, 17);
}

function sampleSectionTitle(
  b: PDFBuilder,
  kicker: string,
  title: string,
  score?: number
) {
  b.pdf.setTextColor(...GOLD);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.setFontSize(8);
  b.pdf.text(kicker.toUpperCase(), b.margin, b.y);
  b.y += 11;
  b.pdf.setTextColor(...INK);
  b.pdf.setFontSize(23);
  b.fitText(title, b.margin, b.y, score === undefined ? b.pageW - b.margin * 2 : b.pageW - b.margin * 2 - 45, 23, "bold");
  if (score !== undefined) {
    b.pdf.setFillColor(245, 236, 214);
    b.pdf.setDrawColor(232, 207, 139);
    b.pdf.roundedRect(b.pageW - b.margin - 40, b.y - 12, 40, 18, 7, 7, "FD");
    b.pdf.setTextColor(...GOLD);
    b.pdf.setFontSize(6.5);
    b.pdf.text("ASTROLIFE SIGNAL", b.pageW - b.margin - 20, b.y - 5, { align: "center" });
    b.pdf.setFontSize(11);
    b.pdf.text(String(score), b.pageW - b.margin - 20, b.y + 2, { align: "center" });
  }
  b.y += 14;
}

function samplePara(b: PDFBuilder, text: string, maxWidth = b.pageW - b.margin * 2, x = b.margin) {
  const lines = b.pdf.splitTextToSize(text.trim(), maxWidth);
  b.pdf.setTextColor(43, 36, 56);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.setFontSize(9.2);
  lines.forEach((line: string) => {
    b.pdf.text(line, x, b.y);
    b.y += 5.7;
  });
}

function sampleBulletBox(
  b: PDFBuilder,
  title: string,
  bullets: string[],
  x: number,
  y: number,
  w: number,
  h = 47
) {
  b.pdf.setFillColor(...WHITE);
  b.pdf.setDrawColor(...LINE);
  b.pdf.roundedRect(x, y, w, h, 5, 5, "FD");
  b.pdf.setTextColor(...INK);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.setFontSize(9.5);
  b.pdf.text(title, x + 6, y + 10);
  let yy = y + 18;
  b.pdf.setFont("helvetica", "normal");
  b.pdf.setFontSize(7.8);
  bullets.slice(0, 4).forEach((item) => {
    b.pdf.setFillColor(...GOLD);
    b.pdf.circle(x + 8, yy - 1.6, 1, "F");
    b.pdf.setTextColor(58, 50, 72);
    const line = b.pdf.splitTextToSize(item, w - 18)[0] ?? item;
    b.pdf.text(line, x + 12, yy);
    yy += 7;
  });
}

function sampleTable(
  b: PDFBuilder,
  headers: string[],
  rows: string[][],
  widths: number[]
) {
  const x = b.margin;
  const w = b.pageW - b.margin * 2;
  const rowH = 9;
  b.pdf.setFillColor(...GOLD);
  b.pdf.roundedRect(x, b.y, w, rowH, 3, 3, "F");
  b.pdf.setTextColor(...WHITE);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.setFontSize(7.3);
  let cx = x;
  headers.forEach((header, i) => {
    b.pdf.text(header, cx + 3, b.y + 6);
    cx += w * widths[i];
  });
  b.y += rowH;
  b.pdf.setFont("helvetica", "normal");
  rows.forEach((row, ri) => {
    b.pdf.setFillColor(ri % 2 === 0 ? 255 : 248, ri % 2 === 0 ? 253 : 241, ri % 2 === 0 ? 248 : 225);
    b.pdf.rect(x, b.y, w, rowH, "F");
    cx = x;
    row.forEach((value, i) => {
      b.pdf.setTextColor(...INK);
      b.fitText(value, cx + 3, b.y + 6, w * widths[i] - 6, 7.2);
      cx += w * widths[i];
    });
    b.y += rowH;
  });
  b.y += 8;
}

function sampleContentPage(
  b: PDFBuilder,
  title: string,
  kicker: string,
  body: string,
  quickSummary: string[],
  actionPlan: string[],
  remedy: string[],
  score: number
) {
  samplePage(b, title);
  sampleSectionTitle(b, kicker, title, score);
  samplePara(b, body);
  b.y += 8;
  const colW = (b.pageW - b.margin * 2 - 8) / 2;
  const boxY = b.y;
  sampleBulletBox(b, "Quick Summary", quickSummary, b.margin, boxY, colW);
  sampleBulletBox(b, "Action Plan", actionPlan, b.margin + colW + 8, boxY, colW);
  b.y = boxY + 58;
  b.pdf.setFillColor(248, 241, 220);
  b.pdf.setDrawColor(232, 207, 139);
  b.pdf.roundedRect(b.margin, b.y, b.pageW - b.margin * 2, 36, 5, 5, "FD");
  b.pdf.setTextColor(...GOLD);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.setFontSize(10);
  b.pdf.text("Remedy / Alignment", b.margin + 7, b.y + 11);
  b.pdf.setTextColor(58, 50, 72);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.setFontSize(8);
  remedy.slice(0, 3).forEach((line, index) => {
    b.pdf.text(`- ${line}`, b.margin + 9, b.y + 20 + index * 6);
  });
}

export function getSampleStyleReport(chart: ChartData, options: ReportOptions): Blob {
  const b = new PDFBuilder(options.palette ?? "midnight");
  b.pdf.setProperties({
    title: "AstroLife Premium Kundli Report",
    subject: "Premium Kundli Dossier",
    author: "AstroLife AI",
  });

  drawPremiumCover(b, chart, options.cover ?? "wheel");

  const planetOrder = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const now = new Date();
  const moon = chart.planets.Moon;
  const sun = chart.planets.Sun;
  const currentMD = chart.dashas.find(d => new Date(d.start) <= now && now < new Date(d.end));
  const currentAD = chart.antardasha?.find(d => new Date(d.start) <= now && now < new Date(d.end));
  const psych = safeCall(() => calculatePsychology(chart.planets), null);
  const medical = safeCall(() => calculateMedical(chart), null);
  const remedies = safeCall(() => calculateRemedies(chart), null);
  const destiny = safeCall(() => calculateDestiny(chart.planets, chart.dashas, chart.dob), null);

  samplePage(b, "Before You Read");
  sampleSectionTitle(b, "Spiritual opening and responsible guidance", "Before You Read");
  samplePara(b, "This report is prepared using principles of Vedic astrology, planetary positions, dasha periods, transits, yogas, doshas and AI-assisted interpretation. Astrology is a symbolic guidance system. It helps you understand tendencies, timing patterns, strengths, challenges and possible life directions.");
  b.y += 6;
  const colW = (b.pageW - b.margin * 2 - 8) / 2;
  sampleBulletBox(b, "How to Use", [
    "Read slowly and reflect on repeated themes.",
    "Use predictions as guidance, not fixed destiny.",
    "Compare dasha, transit and life situation together.",
    "Focus on remedies, action plan and self-awareness.",
  ], b.margin, b.y, colW);
  sampleBulletBox(b, "Core Principle", [
    "Awareness improves karma.",
    "Discipline strengthens weak areas.",
    "Remedies work best with right action.",
    "Free will remains important.",
  ], b.margin + colW + 8, b.y, colW);

  samplePage(b, "Table of Contents");
  sampleSectionTitle(b, "Report navigation", "Table of Contents");
  [
    "Cover Page",
    "Disclaimer & Spiritual Opening",
    "Birth Details",
    "Planetary Positions",
    "Lagna Chart",
    "Panchang Details",
    "Personality & Life Pattern",
    "Career & Public Life",
    "Health & Vitality",
    "Dasha Timeline",
    "Remedies & Final Guidance",
  ].forEach((entry, index) => b.tocRow(index, entry));

  samplePage(b, "Birth Details");
  sampleSectionTitle(b, "Native profile and panchang snapshot", "Birth Details");
  b.keyValueGrid([
    ["Name", chart.name],
    ["Date of Birth", chart.dob],
    ["Time of Birth", chart.tob],
    ["Birth Place", chart.city],
    ["Latitude", chart.lat.toFixed(5)],
    ["Longitude", chart.lon.toFixed(5)],
    ["Timezone", `UTC ${chart.tz >= 0 ? "+" : ""}${chart.tz}`],
    ["Current Dasha", `${currentMD?.planet ?? "Unknown"} > ${currentAD?.planet ?? "Unknown"}`],
    ["Lagna", chart.lagnaRashi],
    ["Moon Sign", moon?.sign ?? "Unknown"],
    ["Nakshatra", moon?.nakshatra ?? "Unknown"],
    ["Ayanamsha", "Lahiri"],
  ], 3);
  samplePara(b, "Birth details are the foundation of the horoscope. Even a small difference in time or place can change the ascendant, house positions, divisional chart details and timing calculations. This report uses the available birth fields to create a practical premium dossier.");

  samplePage(b, "Planetary Positions");
  sampleSectionTitle(b, "Graha position table", "Planetary Positions");
  sampleTable(
    b,
    ["Planet", "Sign", "Degree", "Nakshatra", "House", "Status"],
    planetOrder.filter(p => chart.planets[p]).map(p => {
      const pd = chart.planets[p];
      return [
        p,
        pd.sign,
        `${(pd.lon % 30).toFixed(2)} deg`,
        pd.nakshatra,
        String(pd.house),
        pd.dignity || (pd.retrograde ? "Retrograde" : "Neutral"),
      ];
    }),
    [0.14, 0.16, 0.15, 0.25, 0.1, 0.2]
  );
  samplePara(b, "Planetary positions show where the main forces of the horoscope are placed. A planet's sign shows expression style, its house shows the life area where it becomes active, and its nakshatra reveals a deeper psychological and karmic layer.");

  samplePage(b, "Lagna Chart");
  sampleSectionTitle(b, "North Indian chart visual", "Lagna Chart");
  b.drawNorthIndianChart(chart, b.margin, b.y, 102);
  const chartTextX = b.margin + 114;
  const savedY = b.y;
  b.y += 5;
  samplePara(b, "The Lagna chart is the main birth chart. It shows the physical life path, event manifestation, body, identity and worldly responsibilities. Repeated patterns across Lagna, Moon and Navamsha should be treated as important.", b.pageW - chartTextX - b.margin, chartTextX);
  b.y += 8;
  sampleBulletBox(b, "Chart Notes", [
    "Lagna is the anchor of the horoscope.",
    "House placement shows life area activation.",
    "Dasha and transit decide timing.",
    "Strength decides how easily results manifest.",
  ], chartTextX, b.y, b.pageW - chartTextX - b.margin, 48);
  b.y = savedY + 112;

  samplePage(b, "Panchang Details");
  sampleSectionTitle(b, "Birth-time spiritual signature", "Panchang Details", 73);
  b.keyValueGrid([
    ["Nakshatra", moon?.nakshatra ?? "Unknown"],
    ["Nakshatra Lord", moon?.nakshatraLord ?? "Unknown"],
    ["Pada", String(moon?.pada ?? "—")],
    ["Weekday", new Date(chart.dob).toLocaleDateString("en-IN", { weekday: "long" })],
    ["Sun Sign", sun?.sign ?? "Unknown"],
    ["Moon Sign", moon?.sign ?? "Unknown"],
    ["Lagna", chart.lagnaRashi],
    ["Current MD", currentMD?.planet ?? "Unknown"],
    ["Current AD", currentAD?.planet ?? "Unknown"],
  ], 3);

  const commonBody = "This section combines traditional Jyotish mechanics with modern AstroLife guidance. The chart indicates that life improves when awareness is combined with disciplined action. Some karmic planets can create pressure, delay or transformation, but the same pressure can mature into skill, wisdom and long-term achievement.";
  const commonSummary = ["Repeated chart themes matter most.", "Do not judge one planet in isolation.", "Dasha activates the promise.", "Transit gives current timing."];
  const commonAction = ["Track recurring life themes.", "Use timing for planning.", "Avoid fear-based decisions.", "Choose practical remedies."];
  const commonRemedy = ["Keep a stable daily routine.", "Begin important days with grounding practice.", "Respect teachers, elders and mentors."];

  sampleContentPage(
    b,
    "Personality & Life Pattern",
    "How Lagna, Moon and planetary pattern shape your nature",
    psych?.summary ? `${psych.summary} ${psych.pattern?.desc ?? ""}` : commonBody,
    psych?.dominantFunctions?.length ? psych.dominantFunctions.slice(0, 4) : commonSummary,
    psych?.growthPlan?.length ? psych.growthPlan.slice(0, 4) : commonAction,
    psych?.stabilizers?.length ? psych.stabilizers.slice(0, 3) : commonRemedy,
    76
  );

  sampleContentPage(
    b,
    "Career & Public Life",
    "Professional karma, authority and recognition",
    `${commonBody} For this chart, the 10th house sign is ${RASHI_NAMES[(chart.lagnaNum + 9) % 12]}, and current dasha ${currentMD?.planet ?? "Unknown"} shows which professional themes are active now.`,
    getLifeAreaAnalysis("career", chart).slice(0, 4),
    ["Use strong dasha periods for launches.", "Document commitments clearly.", "Build authority through consistent output.", "Avoid comparison-driven decisions."],
    ["Offer service to mentors or elders.", "Start work with a short grounding prayer.", "Keep workplace ethics clean."],
    78
  );

  sampleContentPage(
    b,
    "Health & Vitality",
    "Body rhythm, stress patterns and preventive awareness",
    medical ? `Overall health sensitivity is ${medical.riskLevel}. ${medical.prakriti} This is preventive awareness, not diagnosis; medical symptoms must be checked by qualified doctors.` : commonBody,
    medical?.topConcerns?.length ? medical.topConcerns.map(c => `${c} sensitivity requires awareness.`).slice(0, 4) : getLifeAreaAnalysis("health", chart).slice(0, 4),
    medical?.preventiveRoutine?.length ? medical.preventiveRoutine.slice(0, 4) : commonAction,
    ["Maintain sleep, digestion and hydration routine.", "Use astrology as prevention, not diagnosis.", "Consult qualified doctors for symptoms."],
    medical?.riskLevel === "high" ? 64 : medical?.riskLevel === "moderate" ? 72 : 81
  );

  sampleContentPage(
    b,
    "Dasha Timeline",
    "Planetary period activation and timing",
    destiny?.summary ?? `Current Mahadasha is ${currentMD?.planet ?? "Unknown"} and current Antardasha is ${currentAD?.planet ?? "Unknown"}. Dasha decides when the chart promise becomes active.`,
    destiny?.nextMilestones?.length ? destiny.nextMilestones.slice(0, 4).map(m => `${m.year}: ${m.score}/100 ${m.trend}`) : commonSummary,
    destiny?.actionPlan?.length ? destiny.actionPlan.slice(0, 4) : commonAction,
    remedies?.cards?.slice(0, 3).map(r => `${r.planet}: ${r.donate || r.mantra}`) ?? commonRemedy,
    destiny?.currentScore ?? 74
  );

  sampleContentPage(
    b,
    "Remedies & Final Guidance",
    "Karmic alignment, mantra and practical correction",
    "The most important message of this report is that timing and effort must work together. Favourable timing without effort gives little result, and effort without timing may feel delayed. Remedies are most useful when they support disciplined action.",
    remedies?.cards?.slice(0, 4).map(r => `${r.planet}: ${r.priority} priority`) ?? commonSummary,
    ["Read the report once without rushing.", "Pick only the top two remedies first.", "Review progress every 30 days.", "Use AstroLife AI for deeper timing questions."],
    remedies?.cards?.slice(0, 3).map(r => `${r.day || "Weekly"}: ${r.donate || r.mantra}`) ?? commonRemedy,
    81
  );

  b.addFooters(b.pdf.getNumberOfPages());
  return b.output();
}

// ── MAIN REPORT ────────────────────────────────────────────────
export async function generatePDFReport(
  chart: ChartData,
  options: ReportOptions = { type: "full" }
): Promise<Blob> {
  return generateLegacyPDFReport(chart, options);
}

export async function generateLegacyPDFReport(
  chart: ChartData,
  options: ReportOptions = { type: "full" }
): Promise<Blob> {
  const b = new PDFBuilder(options.palette ?? "midnight");

  // ═══════════════════════════════════════════════════════════════
  // COVER PAGE — palette-aware, dual cover style
  // ═══════════════════════════════════════════════════════════════
  drawPremiumCover(b, chart, options.cover ?? "wheel");

  // ═══════════════════════════════════════════════════════════════
  // TABLE OF CONTENTS
  // ═══════════════════════════════════════════════════════════════
  b.newPage();
  b.sectionHeader("TABLE OF CONTENTS", false);
  b.spacer(4);

  const tocEntries = [
    "1.  Birth Information & Lagna Details",
    "2.  Complete Planetary Positions",
    "3.  House (Bhava) Analysis",
    "4.  Vimshottari Dasha System",
    "5.  Yoga Analysis (All Yogas & Doshas)",
    "6.  Shadbala – Planetary Strengths",
    "7.  Psychology & Personality Profile",
    "8.  Lal Kitab Predictions & Remedies",
    "9.  Remedy Engine – Complete Prescription",
    "10. Medical Astrology Analysis",
    "11. Numerology Profile",
    "12. Ashtakavarga – Bindu Analysis",
    "13. Divisional Charts Analysis (D1–D12)",
    "14. Gemstone & Rudraksha Recommendations",
    "15. Jaimini Astrology – Karakas & Chara Dasha",
    "16. Current Transits & Sade Sati",
    "17. Destiny Curve – Life Peaks & Valleys",
    "18. Life Area Predictions (Career, Love, Finance, Health, Spiritual)",
    "19. Annual Forecast (3-Year Outlook)",
    "20. Conclusion & Final Guidance",
  ];

  tocEntries.forEach((entry, index) => b.tocRow(index, entry));

  // ═══════════════════════════════════════════════════════════════
  // SECTION 1: BIRTH INFORMATION
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 1 — BIRTH INFORMATION & LAGNA DETAILS");

  const sunSign  = chart.planets.Sun?.sign  ?? "—";
  const moonSign = chart.planets.Moon?.sign ?? "—";
  const moonNak  = chart.planets.Moon?.nakshatra ?? "—";

  b.subHeader("Personal Details");
  b.keyValueGrid([
    ["Full Name", chart.name],
    ["Date of Birth", chart.dob],
    ["Time of Birth", chart.tob],
    ["Birth City", chart.city],
    ["Latitude", `${chart.lat.toFixed(4)}°`],
    ["Longitude", `${chart.lon.toFixed(4)}°`],
    ["Timezone", `UTC ${chart.tz >= 0 ? "+" : ""}${chart.tz}`],
    ["Julian Day", chart.jd.toFixed(5)],
  ], 2);
  b.spacer(4);

  b.signalCard("Lagna", chart.lagnaRashi, `Ascendant sets body, identity, temperament and the main life direction. Sun: ${sunSign}.`, SC_BIRTH);
  b.signalCard("Moon Signature", `${moonSign} / ${moonNak}`, "Moon sign and birth nakshatra anchor emotional nature, timing and lived experience.", SC_PSYCH);

  b.subHeader("Ascendant (Lagna) Analysis");
  b.keyValue("Lagna Sign", chart.lagnaRashi);
  b.keyValue("Lagna Degree", `${chart.lagnaLon.toFixed(4)}°`);
  b.keyValue("Lagna House Number", String(chart.lagnaNum + 1));

  const lagnaTraits: Record<string, string> = {
    Aries: "Fiery, courageous, pioneering, impulsive, natural leader. Ruled by Mars.",
    Taurus: "Stable, patient, sensual, stubborn, fond of luxury. Ruled by Venus.",
    Gemini: "Curious, communicative, versatile, restless, witty. Ruled by Mercury.",
    Cancer: "Emotional, nurturing, intuitive, protective, home-loving. Ruled by Moon.",
    Leo: "Regal, generous, dramatic, proud, creative. Ruled by Sun.",
    Virgo: "Analytical, perfectionist, service-oriented, detail-focused. Ruled by Mercury.",
    Libra: "Balanced, diplomatic, aesthetic, indecisive, social. Ruled by Venus.",
    Scorpio: "Intense, secretive, transformative, powerful, magnetic. Ruled by Mars/Ketu.",
    Sagittarius: "Philosophical, optimistic, adventurous, freedom-loving. Ruled by Jupiter.",
    Capricorn: "Disciplined, ambitious, responsible, practical, authoritative. Ruled by Saturn.",
    Aquarius: "Innovative, humanitarian, detached, idealistic, unconventional. Ruled by Saturn/Rahu.",
    Pisces: "Spiritual, compassionate, dreamy, intuitive, artistic. Ruled by Jupiter.",
  };
  b.spacer(2);
  b.line(`Lagna Interpretation: ${lagnaTraits[chart.lagnaRashi] ?? "A complex chart with multiple influences."}`);
  b.spacer(4);

  // Moon sign & nakshatra
  const moon = chart.planets["Moon"];
  if (moon) {
    b.subHeader("Moon Sign & Nakshatra");
    b.keyValue("Moon Sign (Janma Rashi)", moon.sign);
    b.keyValue("Birth Nakshatra", moon.nakshatra);
    b.keyValue("Moon House", `${moon.house}th House`);
    b.keyValue("Moon Degree", `${moon.lon.toFixed(2)}°`);
    if (moon.dignity) b.keyValue("Moon Dignity", moon.dignity);
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 2: PLANETARY POSITIONS
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 2 — COMPLETE PLANETARY POSITIONS");

  b.subHeader("All 9 Planets — Sign, House, Nakshatra, Dignity");
  b.spacer(2);

  const planetOrder = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planetRows = planetOrder
    .filter(p => chart.planets[p])
    .map(p => {
      const pd = chart.planets[p]!;
      const dignity = pd.dignity
        ? (pd.dignity.substring(0, 16) + (pd.retrograde ? " ℞" : ""))
        : (pd.retrograde ? "Neutral ℞" : "Neutral");
      return [p, pd.sign, `H${pd.house}`, `${(pd.lon % 30).toFixed(1)}°`, pd.nakshatra ?? "—", dignity];
    });
  const col1 = b.margin, col2 = col1 + 22, col3 = col2 + 28, col4 = col3 + 18, col5 = col4 + 30, col6 = col5 + 32;
  b.styledTable(
    ["Planet", "Sign", "House", "Degree", "Nakshatra", "Dignity"],
    planetRows,
    [col1, col2, col3, col4, col5, col6],
    SC_PLANETS
  );

  b.sectionHeader("SECTION 2B — LAGNA CHART VISUAL");
  b.line("This North Indian style chart gives a quick visual map of house occupation. Ascendant is marked as As, and planets use two-letter abbreviations so the PDF stays readable.");
  b.spacer(4);
  b.drawNorthIndianChart(chart, b.margin, b.y, 92);
  const visualX = b.margin + 104;
  const chartNotes = [
    ["Chart Style", "North Indian"],
    ["Lagna Rashi", chart.lagnaRashi],
    ["Lagna Number", String(chart.lagnaNum + 1)],
    ["First House Sign", RASHI_NAMES[chart.lagnaNum] ?? chart.lagnaRashi],
    ["Reading Rule", "House position first, then sign and lord"],
    ["Timing Rule", "Dasha activates the promise"],
  ];
  const savedY = b.y;
  b.y += 4;
  chartNotes.forEach(([key, value]) => {
    b.pdf.setFontSize(8);
    b.pdf.setTextColor(...GOLD);
    b.pdf.setFont("helvetica", "bold");
    b.pdf.text(`${key}:`, visualX, b.y);
    b.pdf.setFont("helvetica", "normal");
    b.pdf.setTextColor(...BLACK);
    b.fitText(value, visualX + 30, b.y, b.pageW - visualX - b.margin - 30, 8);
    b.y += 7;
  });
  b.y = Math.max(savedY + 100, b.y + 4);

  b.spacer(6);
  b.subHeader("Planetary Interpretation Details");
  planetOrder.forEach(p => {
    const pd = chart.planets[p];
    if (!pd) return;
    b.checkPage(15);
    b.pdf.setFontSize(9.5);
    b.gold();
    b.pdf.setFont("helvetica", "bold");
    b.pdf.text(`${p} in ${pd.sign} (House ${pd.house})${pd.retrograde ? " ℞ Retrograde" : ""}`, b.margin, b.y);
    b.pdf.setFont("helvetica", "normal");
    b.y += 6;
    b.pdf.setFontSize(8.5);
    b.black();
    const desc = getPlanetHouseDesc(p, pd.house, pd.sign);
    const lines = b.pdf.splitTextToSize(desc, b.pageW - b.margin * 2 - 5);
    lines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 3, b.y); b.y += 5; });
    b.y += 3;
  });

  // ═══════════════════════════════════════════════════════════════
  // SECTION 3: HOUSE ANALYSIS
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 3 — HOUSE (BHAVA) ANALYSIS");

  const HOUSE_MEANINGS: Record<number, { name: string; rules: string; karak: string }> = {
    1: { name: "Lagna / Tanu Bhava", rules: "Self, personality, physical body, health, vitality, appearance, life path", karak: "Sun" },
    2: { name: "Dhana Bhava", rules: "Wealth, family, speech, food, early education, face, right eye, accumulated assets", karak: "Jupiter" },
    3: { name: "Sahaja Bhava", rules: "Siblings, communication, courage, short travels, skills, arms, media", karak: "Mars" },
    4: { name: "Sukha Bhava", rules: "Mother, home, comforts, property, vehicles, education, emotions, heart", karak: "Moon" },
    5: { name: "Putra Bhava", rules: "Children, intelligence, creativity, romance, past life merits, speculation, mantra", karak: "Jupiter" },
    6: { name: "Shatru Bhava", rules: "Enemies, disease, debts, service, daily work, litigation, maternal uncle", karak: "Mars/Saturn" },
    7: { name: "Yuvati Bhava", rules: "Marriage, spouse, partnerships, business deals, public relations, foreign travel", karak: "Venus" },
    8: { name: "Ayur Bhava", rules: "Longevity, sudden events, occult, transformation, inheritance, hidden matters", karak: "Saturn" },
    9: { name: "Dharma Bhava", rules: "Fortune, spirituality, higher education, father, long journeys, religion, guru", karak: "Jupiter" },
    10: { name: "Karma Bhava", rules: "Career, profession, status, authority, father, government, public standing", karak: "Mercury/Sun" },
    11: { name: "Labha Bhava", rules: "Gains, income, friends, aspirations, elder siblings, left ear, fulfillment of desires", karak: "Jupiter" },
    12: { name: "Vyaya Bhava", rules: "Losses, expenses, foreign lands, moksha, bed pleasures, hospitals, isolation", karak: "Saturn/Ketu" },
  };

  for (let h = 1; h <= 12; h++) {
    b.checkPage(20);
    // Find planets in this house
    const planetsInHouse = planetOrder.filter(p => chart.planets[p]?.house === h);
    const houseSignIdx = (chart.lagnaNum + h - 1) % 12;
    const RASHIS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    const houseSign = RASHIS[houseSignIdx];

    b.pdf.setFontSize(10);
    b.gold();
    b.pdf.setFont("helvetica", "bold");
    b.pdf.text(`House ${h} — ${HOUSE_MEANINGS[h].name} (${houseSign})`, b.margin, b.y);
    b.pdf.setFont("helvetica", "normal");
    b.y += 6;

    b.pdf.setFontSize(8.5);
    b.gray();
    b.pdf.text(`Rules: ${HOUSE_MEANINGS[h].rules}`, b.margin + 3, b.y);
    b.y += 5;
    b.pdf.text(`Karaka (Significator): ${HOUSE_MEANINGS[h].karak}`, b.margin + 3, b.y);
    b.y += 5;

    b.black();
    if (planetsInHouse.length > 0) {
      b.pdf.text(`Occupants: ${planetsInHouse.join(", ")}`, b.margin + 3, b.y);
    } else {
      b.gray();
      b.pdf.text("Occupants: None (empty house — judge by lord)", b.margin + 3, b.y);
      b.black();
    }
    b.y += 8;
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 4: DASHA SYSTEM
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 4 — VIMSHOTTARI DASHA SYSTEM");

  b.subHeader("Complete Mahadasha Sequence");
  b.line("The Vimshottari Dasha system is a 120-year planetary period cycle based on birth Nakshatra. Each planet governs a specific number of years and shapes life themes during its period.");
  b.spacer(4);

  const now = new Date();
  let currentMD: (typeof chart.dashas)[0] | null = null;

  const dashaRows = chart.dashas.map(d => {
    const start = new Date(d.start);
    const end = new Date(d.end);
    const isActive = start <= now && now < end;
    if (isActive) currentMD = d;
    return [
      d.planet,
      `${d.yrs} yrs`,
      start.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      end.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      isActive ? "◀ ACTIVE" : end < now ? "Completed" : "Future",
    ];
  });
  b.styledTable(
    ["Planet", "Duration", "Start Date", "End Date", "Status"],
    dashaRows,
    [b.margin, b.margin + 25, b.margin + 50, b.margin + 90, b.margin + 130],
    SC_DASHA
  );

  b.spacer(4);

  // Current period analysis
  b.subHeader("Current Active Period Analysis");
  if (currentMD) {
    const md = currentMD as typeof chart.dashas[0];
    b.keyValue("Active Mahadasha", `${md.planet} Mahadasha`);
    b.keyValue("Period Ends", new Date(md.end).toLocaleDateString("en-IN", { year: "numeric", month: "long" }));
    const mdPD = chart.planets[md.planet];
    if (mdPD) {
      b.keyValue("Mahadasha Lord Position", `${mdPD.sign}, ${mdPD.house}th House`);
      if (mdPD.dignity) b.keyValue("Mahadasha Lord Dignity", mdPD.dignity);
    }
    b.spacer(6);

    // ── Load all knowledge sources ──────────────────────────────
    const mdHouse      = mdPD?.house ?? 1;
    const mdSign       = mdPD?.sign  ?? "";
    const mdDignity    = mdPD?.dignity;
    const mdInterp     = getMahadashaInterpretation(md.planet, mdHouse, mdDignity);
    const lkRule       = PLANET_HOUSE_RULES[md.planet]?.[mdHouse];
    const homeOmenRule = HOME_OMEN_RULES.find(r => r.planet === md.planet);
    const houseZone    = HOUSE_WISE_OMENS.find(h => h.house === mdHouse);
    const activeCombos = COMBINATION_RULES.filter(c => c.planets.includes(md.planet)).slice(0, 2);
    const activeRins   = RIN_RULES.filter(r => r.planets.includes(md.planet));

    b.subHeader(`${md.planet} Mahadasha — Vedic Analysis`);
    b.para(composeVedicParagraph(md.planet, mdHouse, mdSign, md.yrs, mdInterp, mdDignity));

    b.subHeader(`${md.planet} Mahadasha — Lal Kitab Analysis`);
    b.para(composeLKParagraph(md.planet, mdHouse, mdSign, md.yrs, lkRule));

    b.subHeader(`${md.planet} Mahadasha — Environmental, Psychological & Karmic Reading`);
    b.para(composePsychOmenParagraph(md.planet, mdHouse, lkRule, homeOmenRule, houseZone, activeCombos, activeRins));

    b.spacer(4);
  }

  // Antardasha table + interpretation
  b.subHeader("Current Antardasha (Sub-Periods)");
  let currentAD: (typeof chart.antardasha)[0] | null = null;
  if (chart.antardasha && chart.antardasha.length > 0) {
    const adRows = chart.antardasha.slice(0, 20).map(ad => {
      const start = new Date(ad.start);
      const end = new Date(ad.end);
      const isActive = start <= now && now < end;
      if (isActive) currentAD = ad;
      return [
        ad.planet,
        start.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        end.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        isActive ? "◀ ACTIVE" : end < now ? "Done" : "Upcoming",
      ];
    });
    b.styledTable(
      ["Sub-Lord", "Start", "End", "Status"],
      adRows,
      [b.margin, b.margin + 30, b.margin + 80, b.margin + 130],
      SC_DASHA
    );
    b.spacer(4);

    // ── Active Antardasha interpretation ───────────────────────────
    if (currentAD && currentMD) {
      const ad = currentAD as typeof chart.antardasha[0];
      const md = currentMD as typeof chart.dashas[0];
      const adInterp = getAntardashaInterpretation(md.planet, ad.planet);
      b.subHeader(`${md.planet}–${ad.planet} Antardasha Interpretation`);
      b.lifeAreaPara("☀", "Overview", adInterp.overview, SC_DASHA);
      b.lifeAreaPara("⚡", "Effects & Themes", adInterp.effect, SC_PLANETS);
      if (adInterp.remedies && adInterp.remedies.length > 0) {
        b.checkPage(10);
        b.pdf.setFontSize(9);
        b.pdf.setTextColor(...SC_REMEDY);
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text("REMEDIES", b.margin, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.pdf.setTextColor(...BLACK);
        b.y += 6;
        adInterp.remedies.forEach(r => b.bullet(r));
      }
      b.spacer(6);
    }
  }

  // ── Upcoming Mahadasha Previews ───────────────────────────────────
  const upcomingMDs = chart.dashas.filter(d => new Date(d.start) > now).slice(0, 3);
  if (upcomingMDs.length > 0) {
    b.subHeader("Upcoming Mahadasha Periods — Preview");
    b.line("A comprehensive preview of the next three Mahadasha periods to help you plan your life trajectory.");
    b.spacer(4);
    upcomingMDs.forEach(umd => {
      const umdPD      = chart.planets[umd.planet];
      const umdHouse   = umdPD?.house ?? 1;
      const umdSign    = umdPD?.sign  ?? "";
      const umdDignity = umdPD?.dignity;
      const umdInterp  = getMahadashaInterpretation(umd.planet, umdHouse, umdDignity);
      const uLkRule    = PLANET_HOUSE_RULES[umd.planet]?.[umdHouse];
      const startYear  = new Date(umd.start).getFullYear();
      const endYear    = new Date(umd.end).getFullYear();

      b.checkPage(20);
      b.pdf.setFontSize(10.5);
      b.pdf.setTextColor(...SC_DASHA);
      b.pdf.setFont("helvetica", "bold");
      b.pdf.text(`${umd.planet} Mahadasha  (${startYear} – ${endYear})  |  ${umd.yrs} years`, b.margin, b.y);
      b.pdf.setFont("helvetica", "normal");
      b.pdf.setTextColor(...BLACK);
      b.y += 7;

      b.para(composeUpcomingMDParagraph(
        umd.planet, umdHouse, umdSign, umd.yrs,
        startYear, endYear, umdInterp, uLkRule, umdDignity
      ));
      b.spacer(4);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 5: YOGAS
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 5 — YOGA ANALYSIS (ALL YOGAS & DOSHAS)");
  b.line("Yogas are planetary combinations in Vedic astrology that indicate specific karmic patterns, abilities, and life outcomes. Below is your complete yoga profile.");
  b.spacer(4);

  const yogas = safeCall(() => detectYogas(chart.planets, chart.lagnaNum, "premium"), []);

  if (yogas && yogas.length > 0) {
    // Group by category using actual YogaCategory values
    const rajYogas = yogas.filter(y => y.category === "Pancha Mahapurusha" || y.category === "Raja Yogas");
    const dhanaYogas = yogas.filter(y => y.category === "Dhana Yogas");
    const doshas = yogas.filter(y => y.category === "Doshas" || y.isDosha === true);
    const otherYogas = yogas.filter(y => !rajYogas.includes(y) && !dhanaYogas.includes(y) && !doshas.includes(y));

    b.statBoxRow([
      { label: "TOTAL YOGAS",  value: String(yogas.length),       color: SC_SHAKTI  },
      { label: "RAJ YOGAS",    value: String(rajYogas.length),    color: SC_BIRTH   },
      { label: "DHANA YOGAS",  value: String(dhanaYogas.length),  color: SC_HOUSES  },
      { label: "DOSHAS",       value: String(doshas.length),      color: SC_YOGA    },
    ]);
    b.spacer(6);

    const renderYogaGroup = (title: string, list: typeof yogas) => {
      if (list.length === 0) return;
      b.subHeader(title);
      list.forEach(yoga => {
        b.checkPage(18);
        b.pdf.setFontSize(9.5);
        b.gold();
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text(`▸ ${yoga.name}`, b.margin + 2, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.y += 6;
        if (yoga.description) {
          const lines = b.pdf.splitTextToSize(yoga.description, b.pageW - b.margin * 2 - 8);
          b.pdf.setFontSize(8.5);
          b.black();
          lines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 6, b.y); b.y += 5; });
        }
        if (yoga.impact) {
          b.pdf.setFontSize(8);
          b.pdf.setTextColor(0, 120, 180);
          const elines = b.pdf.splitTextToSize(`Impact: ${yoga.impact}`, b.pageW - b.margin * 2 - 8);
          elines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 6, b.y); b.y += 5; });
          b.black();
        }
        if (yoga.score) {
          b.pdf.setFontSize(8);
          b.gray();
          b.pdf.text(`Strength Score: ${yoga.score}/10`, b.margin + 6, b.y);
          b.y += 5;
          b.black();
        }
        b.y += 3;
      });
    };

    renderYogaGroup("Raj Yogas (Power & Authority)", rajYogas);
    renderYogaGroup("Dhana Yogas (Wealth & Prosperity)", dhanaYogas);
    renderYogaGroup("Doshas (Challenges to Overcome)", doshas);
    renderYogaGroup("Special & Other Yogas", otherYogas);
  } else {
    b.line("Yoga analysis could not be computed. Please verify birth data.");
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 6: SHADBALA
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 6 — SHADBALA (SIX-FOLD PLANETARY STRENGTH)");
  b.line("Shadbala measures planetary strength across six dimensions. Higher strength = more power to deliver its significations. Minimum required strength varies by planet.");
  b.spacer(4);

  const shadbala = safeCall(() => calculateShadbala(chart.planets), null);
  if (shadbala) {
    b.keyValue("Strongest Planet", shadbala.strongest);
    b.keyValue("Weakest Planet", shadbala.weakest);
    b.keyValue("Average Strength", `${shadbala.avgStrength?.toFixed(2) ?? "—"}/6`);
    b.spacer(2);
    b.line(shadbala.summary ?? "");
    b.spacer(6);

    b.subHeader("Individual Planet Strengths");
    b.pdf.setFontSize(8.5);
    b.pdf.setTextColor(...GOLD);
    b.pdf.setFont("helvetica", "bold");
    b.pdf.text("Planet", b.margin, b.y);
    b.pdf.text("Sign", b.margin + 22, b.y);
    b.pdf.text("Sthana", b.margin + 45, b.y);
    b.pdf.text("Dig", b.margin + 62, b.y);
    b.pdf.text("Kala", b.margin + 76, b.y);
    b.pdf.text("Cheshta", b.margin + 90, b.y);
    b.pdf.text("Total", b.margin + 112, b.y);
    b.pdf.text("Grade", b.margin + 130, b.y);
    b.pdf.setFont("helvetica", "normal");
    b.y += 5;
    b.divider();

    shadbala.planets?.forEach((p: { planet: string; sign: string; sthanaBala: number; digBala: number; kalaBala: number; cheshtaBala: number }) => {
      b.checkPage(7);
      const total = ((p.sthanaBala + p.digBala + p.kalaBala + p.cheshtaBala) / 4);
      const grade = total >= 5 ? "Excellent" : total >= 3.5 ? "Good" : total >= 2.5 ? "Average" : "Weak";
      b.pdf.setFontSize(8.5);
      b.black();
      b.pdf.text(p.planet, b.margin, b.y);
      b.pdf.text(p.sign.substring(0, 10), b.margin + 22, b.y);
      b.pdf.text(p.sthanaBala?.toFixed(1) ?? "—", b.margin + 45, b.y);
      b.pdf.text(p.digBala?.toFixed(1) ?? "—", b.margin + 62, b.y);
      b.pdf.text(p.kalaBala?.toFixed(1) ?? "—", b.margin + 76, b.y);
      b.pdf.text(p.cheshtaBala?.toFixed(1) ?? "—", b.margin + 90, b.y);
      b.pdf.text(total.toFixed(2), b.margin + 112, b.y);
      if (grade === "Excellent") b.pdf.setTextColor(0, 150, 80);
      else if (grade === "Weak") b.pdf.setTextColor(200, 50, 50);
      else b.gray();
      b.pdf.text(grade, b.margin + 130, b.y);
      b.black();
      b.y += 6;
    });

    b.spacer(6);
    b.subHeader("Planetary Strength Interpretation");
    shadbala.planets?.forEach((p: { planet: string; sign: string; sthanaBala: number; digBala: number; kalaBala: number; cheshtaBala: number }) => {
      b.checkPage(12);
      const total = ((p.sthanaBala + p.digBala + p.kalaBala + p.cheshtaBala) / 4);
      const interp = total >= 5
        ? `${p.planet} is exceptionally strong. Its significations — ${getSignifications(p.planet)} — will flourish powerfully in your life.`
        : total >= 3.5
          ? `${p.planet} is well-placed with good strength. Expect positive results in ${getSignifications(p.planet)}.`
          : total >= 2.5
            ? `${p.planet} has average strength. Results in ${getSignifications(p.planet)} will be mixed.`
            : `${p.planet} is weak. Areas governed by this planet — ${getSignifications(p.planet)} — may face challenges. Strengthen via remedies.`;
      b.bullet(interp);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 7: PSYCHOLOGY
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 7 — PSYCHOLOGY & PERSONALITY PROFILE");

  const psych = safeCall(() => calculatePsychology(chart.planets), null);
  if (psych) {
    b.line(psych.summary ?? "");
    b.spacer(4);

    if (psych.pattern) {
      b.subHeader("Core Psychological Pattern");
      b.keyValue("Pattern", psych.pattern.name ?? "");
      b.line(psych.pattern.desc ?? "");
    }
    b.spacer(4);

    if (psych.dominantFunctions?.length) {
      b.subHeader("Dominant Functions");
      psych.dominantFunctions.forEach((item) => b.bullet(item));
    }

    if (psych.riskFlags?.length) {
      b.subHeader("Psychological Risk Flags");
      psych.riskFlags.slice(0, 5).forEach((flag) => {
        b.bullet(`${flag.title} [${flag.severity}]: ${flag.detail}`);
      });
    }

    if (psych.growthPlan?.length) {
      b.subHeader("Growth Plan");
      psych.growthPlan.slice(0, 5).forEach((item) => b.bullet(item));
    }

    b.subHeader("Planetary Psychological Influences");
    psych.planets?.forEach(p => {
      b.checkPage(15);
      b.pdf.setFontSize(9.5);
      b.gold();
      b.pdf.setFont("helvetica", "bold");
      b.pdf.text(`${p.planet} (${p.sign} H${p.house}) [${p.status}]:`, b.margin + 2, b.y);
      b.pdf.setFont("helvetica", "normal");
      b.y += 5.5;
      b.pdf.setFontSize(8.5);
      b.black();
      const tLines = b.pdf.splitTextToSize(p.trait ?? "", b.pageW - b.margin * 2 - 6);
      tLines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 6, b.y); b.y += 5; });
      if (p.weak) {
        b.pdf.setFontSize(8);
        b.pdf.setTextColor(160, 80, 80);
        const sLines = b.pdf.splitTextToSize(`Shadow: ${p.weak}`, b.pageW - b.margin * 2 - 6);
        sLines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 6, b.y); b.y += 5; });
        b.black();
      }
      b.y += 3;
    });

    const strongPlanets = psych.planets?.filter(p => p.status === "Strong") ?? [];
    const weakPlanets = psych.planets?.filter(p => p.status === "Weak/Blocked") ?? [];
    if (strongPlanets.length) {
      b.subHeader("Key Psychological Strengths");
      strongPlanets.forEach(p => b.bullet(`${p.planet}: ${p.strong}`));
    }
    if (weakPlanets.length) {
      b.subHeader("Areas for Growth");
      weakPlanets.forEach(p => b.bullet(`${p.planet}: ${p.weak}`));
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 8: LAL KITAB
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 8 — LAL KITAB PREDICTIONS & REMEDIES");
  b.line("Lal Kitab is a unique system of Vedic astrology that offers powerful yet simple remedies. It focuses on the karmic debts and practical solutions for life challenges.");
  b.spacer(4);

  const lalkitab = safeCall(() => calculateLalKitab(chart.planets, chart.dob), null);
  if (lalkitab) {
    b.line(lalkitab.summary ?? "");
    b.spacer(4);

    if (lalkitab.planets?.length) {
      b.subHeader("Planet-wise Lal Kitab Analysis");
      lalkitab.planets.forEach(p => {
        b.checkPage(22);
        b.pdf.setFontSize(10);
        b.gold();
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text(`${p.planet} in House ${p.house} (${p.sign}) [${p.statusLabel}]`, b.margin + 2, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.y += 6;

        if (p.nishani) {
          b.pdf.setFontSize(8.5);
          b.black();
          const plines = b.pdf.splitTextToSize(p.nishani, b.pageW - b.margin * 2 - 6);
          plines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 4, b.y); b.y += 5; });
        }

        b.pdf.setFontSize(8.5);
        b.pdf.setTextColor(0, 130, 80);
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text("Upaya (Remedy):", b.margin + 4, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.y += 5.5;
        const ulines = b.pdf.splitTextToSize(p.upaya, b.pageW - b.margin * 2 - 8);
        ulines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 8, b.y); b.y += 5; });
        if (p.rin) {
          b.pdf.setFontSize(8);
          b.pdf.setTextColor(160, 80, 80);
          b.pdf.text(`Karmic Debt: ${p.rin}`, b.margin + 8, b.y);
          b.y += 5;
        }
        b.black();
        b.y += 3;
      });
    }

    if (lalkitab.rins?.length) {
      b.subHeader("Karmic Debts (Rin)");
      lalkitab.rins.forEach(r => b.bullet(`${r.planet} (H${r.house}): ${r.rin} — Upaya: ${r.upaya}`));
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 9: REMEDIES
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 9 — REMEDY ENGINE (COMPLETE PRESCRIPTION)");
  b.line("Based on planetary positions, dignity, and houses, the following remedies are prescribed to strengthen weak planets and pacify malefic influences.");
  b.spacer(4);

  const remedies = safeCall(() => calculateRemedies(chart), null);
  if (remedies) {
    b.keyValue("Urgent Remedies Count", String(remedies.urgentCount ?? 0));
    b.spacer(4);

    remedies.cards?.forEach((card: { planet: string; priority: string; gem?: string; metal?: string; mantra: string; donate?: string; day?: string; color?: string; number?: string | number; food?: string; fast?: string; puja?: string; advice?: string }) => {
      b.checkPage(45);
      b.pdf.setFillColor(250, 248, 240);
      b.pdf.rect(b.margin, b.y - 3, b.pageW - b.margin * 2, 3, "F");

      b.pdf.setFontSize(11);
      b.gold();
      b.pdf.setFont("helvetica", "bold");
      b.pdf.text(`${card.planet} Remedies  [${card.priority}]`, b.margin + 2, b.y + 3);
      b.pdf.setFont("helvetica", "normal");
      b.y += 10;

      const remedyFields: [string, string][] = [
        ["Gemstone", card.gem ?? "—"],
        ["Metal", card.metal ?? "—"],
        ["Mantra", card.mantra],
        ["Donation", card.donate ?? "—"],
        ["Day", card.day ?? "—"],
        ["Color", card.color ?? "—"],
        ["Lucky Number", String(card.number ?? "—")],
        ["Food Remedy", card.food ?? "—"],
        ["Fasting", card.fast ?? "—"],
        ["Puja", card.puja ?? "—"],
      ];

      remedyFields.forEach(([k, v]) => {
        if (v && v !== "—") {
          b.checkPage(8);
          b.pdf.setFontSize(8.5);
          b.pdf.setTextColor(120, 90, 20);
          b.pdf.setFont("helvetica", "bold");
          b.pdf.text(`${k}: `, b.margin + 5, b.y);
          b.pdf.setFont("helvetica", "normal");
          b.black();
          const kw = b.pdf.getTextWidth(`${k}: `);
          const vlines = b.pdf.splitTextToSize(v, b.pageW - b.margin * 2 - kw - 8);
          vlines.forEach((l: string, i: number) => {
            b.checkPage(6);
            b.pdf.text(l, i === 0 ? b.margin + 5 + kw : b.margin + 10, b.y);
            b.y += 5.5;
          });
        }
      });

      if (card.advice) {
        b.pdf.setFontSize(8.5);
        b.pdf.setTextColor(0, 100, 160);
        b.pdf.setFont("helvetica", "italic");
        const alines = b.pdf.splitTextToSize(`Advice: ${card.advice}`, b.pageW - b.margin * 2 - 6);
        alines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 5, b.y); b.y += 5; });
        b.pdf.setFont("helvetica", "normal");
        b.black();
      }
      b.y += 6;
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 10: MEDICAL
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 10 — MEDICAL ASTROLOGY ANALYSIS");
  b.line("Medical astrology maps planetary positions to body systems and health tendencies. This analysis helps in preventive health awareness.");
  b.spacer(4);

  const medical = safeCall(() => calculateMedical(chart), null);
  if (medical) {
    b.subHeader("Constitution & Risk Overview");
    b.keyValue("Overall Sensitivity", medical.riskLevel?.toUpperCase() ?? "—");
    b.keyValue("Birth Nakshatra", medical.birthNakshatra ?? "—");
    b.keyValue("Disease Tendency", medical.birthNakshatraData?.disease ?? "—");
    b.keyValue("Accident Risk Index", `${medical.accidentScore ?? "—"}%`);
    b.keyValue("Physical Constitution", medical.lagnaSign ?? chart.lagnaRashi);
    b.spacer(4);

    if (medical.timingAlerts?.length) {
      b.subHeader("Active Dasha Health Timing");
      medical.timingAlerts.forEach((alert) => {
        b.bullet(`${alert.level} ${alert.planet} [${alert.severity}]: ${alert.message}`);
      });
      b.spacer(3);
    }

    b.subHeader("Top Health Concerns");
    medical.topConcerns?.forEach((c: string) => b.bullet(c));
    b.spacer(4);

    if (medical.triggeredCombos?.length) {
      b.subHeader("Classical Disease Patterns");
      medical.triggeredCombos.forEach((combo: { disease: string; note: string }) => {
        b.checkPage(10);
        b.pdf.setFontSize(9.5);
        b.pdf.setTextColor(200, 50, 50);
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text(combo.disease, b.margin + 2, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.y += 5.5;
        b.black();
        const dlines = b.pdf.splitTextToSize(combo.note, b.pageW - b.margin * 2 - 6);
        dlines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 6, b.y); b.y += 5; });
        b.y += 2;
      });
    }

    if (medical.prakriti) {
      b.subHeader("Constitution (Prakriti)");
      b.line(medical.prakriti);
    }

    b.spacer(4);
    b.subHeader("Preventive Recommendations");
    if (medical.preventiveRoutine?.length) {
      medical.preventiveRoutine.forEach((line) => b.bullet(line));
    } else {
      b.bullet("Annual full body check-up recommended especially during transit of Saturn, Rahu over natal Moon.");
      b.bullet("Avoid overexertion during 8th house transit periods.");
      b.bullet("Follow Nakshatra-based diet for constitution maintenance.");
      b.bullet("Practice yoga and pranayama aligned with Lagna lord's significations.");
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 11: NUMEROLOGY
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 11 — NUMEROLOGY PROFILE");

  const num = safeCall(() => calculateNumerology(chart.name, chart.dob), null);
  if (num) {
    b.line(num.summary ?? "");
    b.spacer(4);

    b.subHeader("Core Numbers");
    const coreNums = [
      ["Life Path", num.lifePath],
      ["Destiny", num.destiny],
      ["Soul Urge", num.soulUrge],
      ["Personality", num.personality],
      ["Birthday", num.birthday],
      ["Maturity", num.maturity],
      ["Personal Year", num.personalYear],
    ];

    coreNums.forEach(([label, n]) => {
      if (!n) return;
      b.checkPage(18);
      const nObj = n as { value: number; label?: string; archetype?: string; theme?: string; guidance?: string; description?: string };
      b.pdf.setFontSize(10);
      b.gold();
      b.pdf.setFont("helvetica", "bold");
      b.pdf.text(`${label}: ${nObj.value}${nObj.label ? ` — ${nObj.label}` : ""}`, b.margin + 2, b.y);
      b.pdf.setFont("helvetica", "normal");
      b.y += 6;
      if (nObj.archetype) { b.pdf.setFontSize(8.5); b.gray(); b.pdf.text(`Archetype: ${nObj.archetype}`, b.margin + 6, b.y); b.y += 5; }
      if (nObj.theme) {
        b.pdf.setFontSize(8.5); b.black();
        const tlines = b.pdf.splitTextToSize(nObj.theme, b.pageW - b.margin * 2 - 8);
        tlines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 6, b.y); b.y += 5; });
      }
      if (nObj.guidance) {
        b.pdf.setFontSize(8.5);
        b.pdf.setTextColor(0, 100, 160);
        const glines = b.pdf.splitTextToSize(`Guidance: ${nObj.guidance}`, b.pageW - b.margin * 2 - 8);
        glines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 6, b.y); b.y += 5; });
        b.black();
      }
      b.y += 3;
    });

    if (num.karmicDebts?.length) {
      b.subHeader("Karmic Debts");
      num.karmicDebts.forEach((kd: { number: number; meaning?: string }) => {
        b.bullet(`Karmic Debt ${kd.number}: ${kd.meaning ?? "Past life unresolved karma requiring conscious work."}`);
      });
    }

    if (num.pinnacles?.length) {
      b.subHeader("Life Pinnacles");
      num.pinnacles.forEach(pin => {
        const status = pin.isActive ? " ◀ ACTIVE NOW" : "";
        b.bullet(`Pinnacle ${pin.number} (${pin.label}) | Age ${pin.ageFrom}–${pin.ageTo ?? "∞"}${status} — ${pin.theme}`);
      });
    }

    if (num.monthForecast?.length) {
      b.subHeader("Monthly Forecast (Current Year)");
      num.monthForecast.forEach(mf => {
        b.checkPage(10);
        b.pdf.setFontSize(8.5);
        b.gold();
        b.pdf.setFont("helvetica", "bold");
        const label = `${mf.monthName} (${mf.energy}):`;
        b.pdf.text(label, b.margin + 2, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.black();
        const txt = mf.theme ?? "";
        if (txt) {
          const kw = b.pdf.getTextWidth(label + " ");
          const mlines = b.pdf.splitTextToSize(txt, b.pageW - b.margin * 2 - kw - 4);
          b.pdf.text(mlines[0] ?? "", b.margin + 2 + kw, b.y);
          b.y += 5.5;
          mlines.slice(1).forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 6, b.y); b.y += 5; });
        } else {
          b.y += 5.5;
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 12: ASHTAKAVARGA
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 12 — ASHTAKAVARGA (BINDU ANALYSIS)");
  b.line("Ashtakavarga assigns 8 benefic points (bindus) per planet across 12 houses. Higher bindus = stronger transit results. Sarva Ashtakavarga (SAV) total shows overall chart strength.");
  b.spacer(4);

  const akv = safeCall(() => calculateAshtakavarga(chart.planets, chart.lagnaNum), null);
  if (akv) {
    b.keyValue("Total SAV Score", String(akv.sarvaTotal ?? "—"));
    b.keyValue("Strongest Houses for Transits", Array.isArray(akv.strongest) ? `H${(akv.strongest as number[]).map(i => i + 1).join(", H")}` : "—");
    b.keyValue("Weakest Houses for Transits", Array.isArray(akv.weakest) ? `H${(akv.weakest as number[]).map(i => i + 1).join(", H")}` : "—");
    b.spacer(2);
    b.line(akv.summary ?? "");
    b.spacer(4);

    b.subHeader("Planet-wise Bindu Totals");
    b.pdf.setFontSize(8.5);
    b.pdf.setTextColor(...GOLD);
    b.pdf.setFont("helvetica", "bold");
    b.pdf.text("Planet", b.margin, b.y);
    b.pdf.text("Total Bindus", b.margin + 30, b.y);
    b.pdf.text("Max Possible", b.margin + 70, b.y);
    b.pdf.text("Grade", b.margin + 110, b.y);
    b.pdf.setFont("helvetica", "normal");
    b.y += 5;
    b.divider();

    akv.planets?.forEach((p: { planet: string; total: number; max: number; bindus?: number[] }) => {
      b.checkPage(7);
      const pct = p.max ? (p.total / p.max * 100) : 0;
      const grade = pct >= 70 ? "Strong" : pct >= 50 ? "Average" : "Weak";
      b.pdf.setFontSize(8.5);
      b.black();
      b.pdf.text(p.planet, b.margin, b.y);
      b.pdf.text(String(p.total), b.margin + 30, b.y);
      b.pdf.text(String(p.max), b.margin + 70, b.y);
      if (grade === "Strong") b.pdf.setTextColor(0, 150, 80);
      else if (grade === "Weak") b.pdf.setTextColor(200, 50, 50);
      else b.gray();
      b.pdf.text(grade, b.margin + 110, b.y);
      b.black();
      b.y += 6;
    });

    b.spacer(4);
    b.subHeader("Sarva Ashtakavarga — House-wise Scores");
    if (akv.houses?.length) {
      akv.houses.forEach((h: { house: number; score: number; grade?: string; interp?: string; name?: string }) => {
        b.checkPage(10);
        b.pdf.setFontSize(8.5);
        b.gold();
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text(`House ${h.house}${h.name ? ` (${h.name})` : ""}: `, b.margin, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.black();
        const scoreStr = `${h.score} bindus — ${h.grade ?? (h.score >= 28 ? "Excellent" : h.score >= 22 ? "Good" : h.score >= 18 ? "Average" : "Weak")}`;
        b.pdf.text(scoreStr, b.margin + 28, b.y);
        b.y += 5.5;
        if (h.interp) {
          b.pdf.setFontSize(8);
          b.gray();
          const ilines = b.pdf.splitTextToSize(h.interp, b.pageW - b.margin * 2 - 6);
          ilines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 4, b.y); b.y += 5; });
          b.black();
        }
        b.y += 2;
      });
    }

    if (akv.bestTransitHouses?.length) {
      b.spacer(4);
      b.subHeader("Best Transit Houses");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bthNames = (akv.bestTransitHouses as any[]).map((h: { house?: number; name?: string; score?: number }) => `H${h.house ?? "?"} ${h.name ?? ""} (${h.score ?? "—"})`).join(", ");
      b.line(`Best Sodhya Pinda transit houses: ${bthNames}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 13: DIVISIONAL CHARTS
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 13 — DIVISIONAL CHARTS ANALYSIS (D1–D12)");
  b.line("Divisional charts (Vargas) provide focused insight into specific life areas. D9 (Navamsa) is the most important — it shows dharma and marriage destiny.");
  b.spacer(4);

  const divCharts = safeCall(() => calculateDivisional(chart.planets, chart.lagnaNum, chart.lagnaLon), null);
  if (divCharts) {
    divCharts.forEach((div: { key: string; name: string; purpose: string; keyInsight?: string; lagnaNum?: number; lagna?: string; planets?: { planet: string; sign: string; house: number; dignity?: string }[] }) => {
      b.checkPage(25);
      b.subHeader(`${div.key} — ${div.name}`);
      b.keyValue("Purpose", div.purpose);
      if (div.lagna) b.keyValue("Lagna in This Chart", div.lagna);
      b.spacer(2);

      // Planets table
      if (div.planets?.length) {
        b.pdf.setFontSize(8);
        b.pdf.setTextColor(...GOLD);
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text("Planet", b.margin + 2, b.y);
        b.pdf.text("Sign", b.margin + 22, b.y);
        b.pdf.text("House", b.margin + 50, b.y);
        b.pdf.text("Dignity", b.margin + 70, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.y += 5;

        div.planets.forEach((p: { planet: string; sign: string; house: number; dignity?: string }) => {
          b.checkPage(6);
          b.pdf.setFontSize(8);
          b.black();
          b.pdf.text(p.planet, b.margin + 2, b.y);
          b.pdf.text(p.sign, b.margin + 22, b.y);
          b.pdf.text(`H${p.house}`, b.margin + 50, b.y);
          if (p.dignity) {
            if (p.dignity.includes("Exalt")) b.pdf.setTextColor(0, 150, 80);
            else if (p.dignity.includes("Debilit")) b.pdf.setTextColor(200, 50, 50);
            else b.gray();
            b.pdf.text(p.dignity.substring(0, 16), b.margin + 70, b.y);
            b.black();
          }
          b.y += 5.5;
        });
      }

      if (div.keyInsight) {
        b.spacer(2);
        b.pdf.setFontSize(8.5);
        b.pdf.setTextColor(0, 100, 160);
        b.pdf.setFont("helvetica", "italic");
        const ilines = b.pdf.splitTextToSize(`Key Insight: ${div.keyInsight}`, b.pageW - b.margin * 2 - 4);
        ilines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 2, b.y); b.y += 5; });
        b.pdf.setFont("helvetica", "normal");
        b.black();
      }

      // Analysis for key divisionals
      let analysis: string[] = [];
      safeCall(() => {
        if (div.key === "D1") analysis = getRasiAnalysis(div as Parameters<typeof getRasiAnalysis>[0]);
        else if (div.key === "D2") analysis = getHoraAnalysis(div as Parameters<typeof getHoraAnalysis>[0]);
        else if (div.key === "D3") analysis = getDrekkanaAnalysis(div as Parameters<typeof getDrekkanaAnalysis>[0]);
        else if (div.key === "D7") analysis = getSaptamsaAnalysis(div as Parameters<typeof getSaptamsaAnalysis>[0]);
      }, undefined);

      if (analysis?.length) {
        b.spacer(2);
        analysis.forEach((a: string) => b.bullet(a));
      }
      b.y += 4;
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 14: GEMSTONES
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 14 — GEMSTONE & RUDRAKSHA RECOMMENDATIONS");
  b.line("Gemstones strengthen planetary energies. Only wear recommended gems — wrong gems can harm. Consult a qualified astrologer before wearing.");
  b.spacer(4);

  const gems = safeCall(() => generateGemstoneReportFromChart(chart), null);
  if (gems) {
    b.subHeader("Primary Gemstone");
    const pg = gems.primaryGemstone;
    if (pg) {
      b.keyValue("Stone", pg.gemstone);
      b.keyValue("Alternate Stone", pg.alternateGemstone);
      b.keyValue("Planet Strengthened", pg.planet);
      b.keyValue("Weight", pg.wearing.weight);
      b.keyValue("Metal", pg.wearing.metal);
      b.keyValue("Finger", pg.wearing.finger);
      b.keyValue("Day to Wear", pg.wearing.day);
      b.keyValue("Time", pg.wearing.time);
      b.keyValue("Mantra", pg.wearing.mantra);
      b.keyValue("Chakra", pg.chakra);
      if (pg.reason) { b.spacer(2); b.line(pg.reason); }
      if (pg.benefits?.length) {
        b.spacer(2);
        b.pdf.setFontSize(8.5); b.gray();
        b.pdf.text("Benefits:", b.margin + 2, b.y); b.y += 5;
        pg.benefits.forEach((bft: string) => b.bullet(bft, 6));
      }
      b.black();
    }
    b.spacer(4);
    b.keyValue("Lagna Sign", gems.lagnaSign);
    b.keyValue("Lagna Lord", gems.lagnaLord);
    b.keyValue("Current Dasha", gems.currentDasha);
    if (gems.dashaNote) b.line(gems.dashaNote);
    b.spacer(4);

    if (gems.secondaryGemstones?.length) {
      b.subHeader("Secondary Gemstones");
      gems.secondaryGemstones.forEach(g => {
        b.checkPage(20);
        b.bullet(`${g.gemstone} (${g.alternateGemstone}) — Planet: ${g.planet} | ${g.wearing.weight} | ${g.wearing.metal} | ${g.wearing.finger}`);
        if (g.reason) { b.pdf.setFontSize(8); b.gray(); b.pdf.text(`  ${g.reason}`, b.margin + 8, b.y); b.y += 5; b.black(); }
      });
    }

    if (gems.avoidGemstones?.length) {
      b.spacer(4);
      b.subHeader("Gemstones to AVOID");
      gems.avoidGemstones.forEach(g => {
        b.checkPage(10);
        b.pdf.setFontSize(8.5);
        b.pdf.setTextColor(200, 50, 50);
        b.pdf.text(`✗ ${g.gemstone} (${g.planet})`, b.margin + 4, b.y);
        b.y += 5.5;
        b.pdf.setFontSize(8); b.gray();
        b.pdf.text(`  Reason: ${g.reason}`, b.margin + 8, b.y); b.y += 5;
        b.black();
      });
    }

    if (gems.safetyNote) {
      b.spacer(4);
      b.pdf.setFontSize(8.5);
      b.pdf.setTextColor(180, 100, 0);
      b.pdf.setFont("helvetica", "italic");
      const slines = b.pdf.splitTextToSize(`Safety Note: ${gems.safetyNote}`, b.pageW - b.margin * 2);
      slines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin, b.y); b.y += 5; });
      b.pdf.setFont("helvetica", "normal");
      b.black();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 15: JAIMINI
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 15 — JAIMINI ASTROLOGY");
  b.line("Jaimini astrology uses Karakas (significators) based on planet degrees. It provides an alternate system that reveals soul purpose and spiritual evolution.");
  b.spacer(4);

  const karakas = safeCall(() => calculateKarakas(chart.planets), []);
  const arudhas = safeCall(() => calculateArudhas(chart), []);
  const charaDasha = safeCall(() => calculateCharaDasha(chart), []);

  if (karakas?.length) {
    b.subHeader("Chara Karakas (Significators)");
    karakas.forEach((k: { role: string; planet: string; sign: string; meaning?: string; degreeInSign: number }) => {
      b.checkPage(14);
      b.pdf.setFontSize(9.5);
      b.gold();
      b.pdf.setFont("helvetica", "bold");
      b.pdf.text(`${k.role}: ${k.planet} (${k.sign} — ${k.degreeInSign.toFixed(1)}°)`, b.margin + 2, b.y);
      b.pdf.setFont("helvetica", "normal");
      b.y += 5.5;
      if (k.meaning) {
        b.pdf.setFontSize(8.5);
        b.black();
        const mlines = b.pdf.splitTextToSize(k.meaning, b.pageW - b.margin * 2 - 6);
        mlines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 6, b.y); b.y += 5; });
      }
      b.y += 2;
    });
  }

  if (arudhas?.length) {
    b.spacer(4);
    b.subHeader("Arudha Padas (Image & Manifestation)");
    arudhas.forEach(a => {
      b.bullet(`${a.name} (${a.shortName}) — ${a.sign} (H${a.house})${a.meaning ? ` — ${a.meaning}` : ""}`);
    });
  }

  if (charaDasha?.length) {
    b.spacer(4);
    b.subHeader("Chara Dasha Periods");
    b.pdf.setFontSize(8.5);
    b.pdf.setTextColor(...GOLD);
    b.pdf.setFont("helvetica", "bold");
    b.pdf.text("Sign", b.margin, b.y);
    b.pdf.text("Years", b.margin + 30, b.y);
    b.pdf.text("Start", b.margin + 55, b.y);
    b.pdf.text("End", b.margin + 95, b.y);
    b.pdf.text("Status", b.margin + 135, b.y);
    b.pdf.setFont("helvetica", "normal");
    b.y += 5;
    b.divider();

    charaDasha.forEach(cd => {
      b.checkPage(7);
      const start = new Date(cd.startDate);
      const end = new Date(cd.endDate);
      const isActive = cd.isActive;
      b.pdf.setFontSize(8.5);
      if (isActive) { b.pdf.setTextColor(0, 180, 100); b.pdf.setFont("helvetica", "bold"); }
      else if (end < now) b.gray();
      else b.black();
      b.pdf.text(cd.sign, b.margin, b.y);
      b.pdf.text(`${cd.years}y`, b.margin + 30, b.y);
      b.pdf.text(start.toLocaleDateString("en-IN", { month: "short", year: "numeric" }), b.margin + 55, b.y);
      b.pdf.text(end.toLocaleDateString("en-IN", { month: "short", year: "numeric" }), b.margin + 95, b.y);
      b.pdf.text(isActive ? "◀ ACTIVE" : end < now ? "Done" : "Future", b.margin + 135, b.y);
      b.pdf.setFont("helvetica", "normal");
      b.black();
      b.y += 6;
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 16: TRANSITS
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 16 — CURRENT TRANSITS & SADE SATI");

  const transitInput = {
    lagR: chart.lagnaNum,
    tz: chart.tz,
    planets: Object.fromEntries(
      Object.entries(chart.planets).map(([k, v]) => [k, { rashi: v.signNum, house: v.house, lon: v.lon }])
    ) as Record<string, { rashi: number; house: number; lon: number }>,
    dob: chart.dob,
  };
  const transits = safeCall(() => runTransitEngine(transitInput as unknown as Parameters<typeof runTransitEngine>[0]), null);

  if (transits) {
    b.keyValue("Analysis Date", transits.date);
    b.spacer(2);
    b.line(transits.summary ?? "");
    b.spacer(4);

    b.subHeader("Current Planetary Transits");
    b.pdf.setFontSize(8.5);
    b.pdf.setTextColor(...GOLD);
    b.pdf.setFont("helvetica", "bold");
    b.pdf.text("Planet", b.margin, b.y);
    b.pdf.text("Transit Sign", b.margin + 25, b.y);
    b.pdf.text("House", b.margin + 60, b.y);
    b.pdf.text("Effect", b.margin + 80, b.y);
    b.pdf.setFont("helvetica", "normal");
    b.y += 5;
    b.divider();

    transits.planets?.forEach(tp => {
      b.checkPage(7);
      b.pdf.setFontSize(8.5);
      b.black();
      b.pdf.text(`${tp.planet}${tp.isRetro ? " ℞" : ""}`, b.margin, b.y);
      b.pdf.text(tp.transitRashiName ?? "—", b.margin + 25, b.y);
      b.pdf.text(`H${tp.houseFromBase}`, b.margin + 60, b.y);
      if (tp.effect === "favorable") b.pdf.setTextColor(0, 150, 80);
      else if (tp.effect === "caution") b.pdf.setTextColor(200, 50, 50);
      else b.gray();
      b.pdf.text(tp.effectLabel, b.margin + 80, b.y);
      b.black();
      b.y += 5.5;
      if (tp.note) {
        b.pdf.setFontSize(7.5);
        b.gray();
        const nlines = b.pdf.splitTextToSize(tp.note, b.pageW - b.margin * 2 - 8);
        nlines.forEach((l: string) => { b.checkPage(6); b.pdf.text(l, b.margin + 4, b.y); b.y += 4.5; });
        b.black();
      }
    });

    if (transits.sadeSati) {
      b.spacer(4);
      b.subHeader("Sade Sati & Saturn Cycle");
      const ss = transits.sadeSati;
      b.keyValue("Status", ss.phase ?? (ss.active ? "Active" : "Not Active"));
      b.keyValue("Type", ss.type);
      b.keyValue("Active Now", ss.active ? "YES — Take precautions" : "No");
      b.line(ss.description ?? "");
    }

    if (transits.zoneAlerts?.length) {
      b.spacer(4);
      b.subHeader("Transit Zone Alerts");
      transits.zoneAlerts.forEach(alert => {
        b.checkPage(10);
        if (alert.severity === "high") b.pdf.setTextColor(200, 50, 50);
        else if (alert.severity === "medium") b.pdf.setTextColor(200, 130, 0);
        else b.black();
        b.bullet(`${alert.title}: ${alert.para}`);
        b.black();
      });
    }

    if (transits.upcomingIngresses?.length) {
      b.spacer(4);
      b.subHeader("Upcoming Planetary Sign Changes");
      transits.upcomingIngresses.slice(0, 10).forEach(ing => {
        b.bullet(`${ing.planet} → ${ing.toRashiName} (~${ing.approxDate}, ${ing.daysAway} days away)`);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 17: DESTINY CURVE
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 17 — DESTINY CURVE (LIFE PEAKS & VALLEYS)");
  b.line("The Destiny Curve maps your life score by year based on Dasha lords, planetary dignities, and yogas. High scores = peak years. Low scores = challenging phases to navigate wisely.");
  b.spacer(4);

  const destinyData = safeCall(() => {
    const dashaSeq = chart.dashas.map(d => ({
      planet: d.planet, start: d.start, end: d.end, yrs: d.yrs
    }));
    return calculateDestiny(chart.planets, dashaSeq as Parameters<typeof calculateDestiny>[1], chart.dob);
  }, null);

  if (destinyData) {
    b.subHeader("Overall Destiny Summary");
    b.line(destinyData.summary ?? "");
    b.spacer(4);

    b.keyValue("Current Age", String(destinyData.currentAge));
    b.keyValue("Current Life Score", `${destinyData.currentScore}/100`);
    b.keyValue("Current Dasha", destinyData.currentDasha);
    b.spacer(4);

    if (destinyData.currentDrivers?.length) {
      b.subHeader("Current Dasha Drivers");
      destinyData.currentDrivers.forEach((driver) => {
        b.bullet(`${driver.role} ${driver.planet} [${driver.tone}]: ${driver.message}`);
      });
    }

    if (destinyData.nextMilestones?.length) {
      b.subHeader("Next Milestone Watch");
      destinyData.nextMilestones.slice(0, 6).forEach((m) => {
        b.bullet(`${m.year} / age ${m.age}: ${m.score}/100 (${m.trend}) — ${m.message}`);
      });
    }

    if (destinyData.actionPlan?.length) {
      b.subHeader("Current Action Plan");
      destinyData.actionPlan.forEach((line) => b.bullet(line));
    }

    if (destinyData.peak) {
      b.subHeader("Peak Dasha Period");
      b.bullet(`${destinyData.peak.planet} Mahadasha (${destinyData.peak.start.toLocaleDateString("en-IN", { year: "numeric" })}–${destinyData.peak.end.toLocaleDateString("en-IN", { year: "numeric" })}) — Score: ${destinyData.peak.score}%`);
    }
    if (destinyData.challenge) {
      b.subHeader("Most Challenging Dasha Period");
      b.pdf.setTextColor(180, 80, 80);
      b.bullet(`${destinyData.challenge.planet} Mahadasha — Score: ${destinyData.challenge.score}%`);
      b.black();
    }

    if (destinyData.areas?.length) {
      b.spacer(4);
      b.subHeader("Life Area Scores");
      destinyData.areas.forEach(area => {
        b.checkPage(7);
        b.pdf.setFontSize(8.5);
        if (area.status === "Strong") b.pdf.setTextColor(0, 150, 80);
        else if (area.status === "Needs Work") b.pdf.setTextColor(200, 50, 50);
        else b.black();
        b.pdf.text(`${area.icon} ${area.name}: ${area.score}/100 [${area.status}]`, b.margin + 3, b.y);
        b.y += 5.5;
        b.black();
      });
    }

    if (destinyData.points?.length) {
      b.spacer(4);
      b.subHeader("Year-by-Year Destiny Score (Current Era)");
      const currentYear = new Date().getFullYear();
      const relevantPoints = destinyData.points.filter(c => c.year >= currentYear - 5 && c.year <= currentYear + 15);

      b.pdf.setFontSize(8.5);
      b.pdf.setTextColor(...GOLD);
      b.pdf.setFont("helvetica", "bold");
      b.pdf.text("Year", b.margin, b.y);
      b.pdf.text("Age", b.margin + 18, b.y);
      b.pdf.text("Score", b.margin + 32, b.y);
      b.pdf.text("Phase", b.margin + 52, b.y);
      b.pdf.text("Dasha", b.margin + 100, b.y);
      b.pdf.setFont("helvetica", "normal");
      b.y += 5;
      b.divider();

      relevantPoints.forEach(c => {
        b.checkPage(7);
        const isNow = c.year === currentYear;
        b.pdf.setFontSize(8.5);
        if (isNow) { b.pdf.setTextColor(0, 180, 100); b.pdf.setFont("helvetica", "bold"); }
        else if (c.score >= 70) b.pdf.setTextColor(0, 150, 80);
        else if (c.score < 40) b.pdf.setTextColor(200, 50, 50);
        else b.black();
        b.pdf.text(String(c.year) + (isNow ? " ◀" : ""), b.margin, b.y);
        b.pdf.text(String(c.age), b.margin + 18, b.y);
        b.pdf.text(String(c.score), b.margin + 32, b.y);
        b.pdf.text(c.score >= 70 ? "Peak" : c.score >= 55 ? "Good" : c.score >= 40 ? "Neutral" : "Challenge", b.margin + 52, b.y);
        b.pdf.text(c.dasha ?? "—", b.margin + 100, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.black();
        b.y += 6;
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 18: LIFE AREA PREDICTIONS
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 18 — LIFE AREA PREDICTIONS");

  const lifeAreas = [
    {
      title: "Career & Profession (10th House)",
      house: chart.planets,
      analysis: getLifeAreaAnalysis("career", chart),
    },
    {
      title: "Marriage & Relationships (7th House)",
      house: chart.planets,
      analysis: getLifeAreaAnalysis("marriage", chart),
    },
    {
      title: "Wealth & Finance (2nd & 11th House)",
      house: chart.planets,
      analysis: getLifeAreaAnalysis("wealth", chart),
    },
    {
      title: "Health & Longevity (1st & 8th House)",
      house: chart.planets,
      analysis: getLifeAreaAnalysis("health", chart),
    },
    {
      title: "Spirituality & Moksha (9th & 12th House)",
      house: chart.planets,
      analysis: getLifeAreaAnalysis("spiritual", chart),
    },
    {
      title: "Children & Education (5th House)",
      house: chart.planets,
      analysis: getLifeAreaAnalysis("children", chart),
    },
  ];

  // Score summary bars
  b.subHeader("Life Area Score Overview");
  const areaKeys = ["career", "marriage", "wealth", "health", "spiritual", "children"] as const;
  const areaColors: Record<string, readonly [number, number, number]> = {
    career: SC_PLANETS, marriage: SC_YOGA, wealth: SC_HOUSES,
    health: SC_MEDICAL, spiritual: SC_BIRTH, children: SC_DASHA,
  };
  const areaLabels: Record<string, string> = {
    career: "Career & Profession", marriage: "Marriage & Relationships",
    wealth: "Wealth & Finance", health: "Health & Longevity",
    spiritual: "Spirituality", children: "Children & Education",
  };
  areaKeys.forEach(key => {
    const score = getLifeAreaScore(key, chart);
    b.scoreBar(areaLabels[key], score, 10, areaColors[key]);
  });
  b.spacer(6);

  lifeAreas.forEach((area, i) => {
    b.checkPage(30);
    const key = areaKeys[i];
    const score = getLifeAreaScore(key, chart);
    b.subHeader(`${area.title} — ${score}/10`);
    area.analysis.forEach((point: string) => b.bullet(point));
    b.spacer(4);
  });

  // ═══════════════════════════════════════════════════════════════
  // SECTION 19: ANNUAL FORECAST
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 19 — ANNUAL FORECAST (3-YEAR OUTLOOK)");

  const currentYear2 = new Date().getFullYear();
  for (let yr = currentYear2; yr <= currentYear2 + 2; yr++) {
    b.checkPage(30);
    b.subHeader(`Year ${yr} Forecast`);

    const activeMD2 = chart.dashas.find(d => {
      const s = new Date(d.start), e = new Date(d.end);
      const mid = new Date(yr, 6, 1);
      return s <= mid && mid < e;
    });
    const activeAD2 = chart.antardasha?.find(d => {
      const s = new Date(d.start), e = new Date(d.end);
      const mid = new Date(yr, 6, 1);
      return s <= mid && mid < e;
    });

    if (activeMD2) b.keyValue("Mahadasha", activeMD2.planet);
    if (activeAD2) b.keyValue("Antardasha", activeAD2.planet);
    b.spacer(2);

    const forecast = generateYearForecast(yr, activeMD2?.planet ?? null, activeAD2?.planet ?? null, chart);
    forecast.forEach((f: string) => b.bullet(f));
    b.spacer(4);
  }

  // ═══════════════════════════════════════════════════════════════
  // SECTION 20: CONCLUSION
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 20 — CONCLUSION & FINAL GUIDANCE");

  b.line(`Dear ${chart.name},`);
  b.spacer(4);
  b.line("This comprehensive Vedic birth chart analysis has explored all dimensions of your cosmic blueprint — from the positions of the nine planets across your twelve houses, to the intricate web of yogas, dashas, divisional charts, and numerological influences that shape your destiny.");
  b.spacer(4);
  b.line("Your chart reveals a unique karmic journey with specific strengths, challenges, and evolutionary themes. The planetary placements at the moment of your birth reflect not limitations, but opportunities — each difficulty is a chance for growth, and each strength is a gift to be used wisely.");
  b.spacer(6);

  b.subHeader("Key Takeaways for Your Life");
  const sun = chart.planets["Sun"];
  const moon2 = chart.planets["Moon"];
  const jupiter = chart.planets["Jupiter"];

  b.bullet(`Your Lagna in ${chart.lagnaRashi} gives you ${lagnaTraits[chart.lagnaRashi]?.split(",").slice(0, 2).join(" and ") ?? "unique qualities"}.`);
  if (moon2) b.bullet(`Moon in ${moon2.sign} (${moon2.nakshatra}) shapes your emotional world and instinctive responses.`);
  if (sun) b.bullet(`Sun in ${sun.sign} defines your core purpose and path to vitality.`);
  if (jupiter) b.bullet(`Jupiter in ${jupiter.sign} (House ${jupiter.house}) expands your wisdom, fortune, and spiritual growth.`);
  b.spacer(4);

  b.subHeader("Spiritual Guidance");
  b.bullet("Embrace your Nakshatra's deity — offerings and worship aligned with your birth star accelerate evolution.");
  b.bullet("Practice your prescribed mantras daily, especially during Dasha lord periods.");
  b.bullet("The remedies prescribed are not superstitions — they are vibrational tools that align your energy with cosmic forces.");
  b.bullet("Self-awareness is the highest remedy. Understanding your chart gives you the power to navigate any planetary period consciously.");
  b.spacer(4);

  b.subHeader("Disclaimer");
  b.pdf.setFontSize(8);
  b.gray();
  b.line("This report is generated by AI-assisted Vedic astrology calculations using VSOP87 planetary algorithms. It is intended for spiritual guidance and self-reflection purposes only. Consult qualified astrologers, doctors, legal, or financial professionals for major life decisions. AstroLife is not responsible for decisions made based on this report.");
  b.spacer(4);
  b.black();
  b.line(`Report generated by AstroLife AI Platform on ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`);

  // ═══════════════════════════════════════════════════════════════
  // FOOTERS
  // ═══════════════════════════════════════════════════════════════
  b.addFooters(b.pdf.getNumberOfPages());

  return b.output();
}

// ── Helper Functions ───────────────────────────────────────────

function getPlanetHouseDesc(planet: string, house: number, sign: string): string {
  const descs: Record<string, Record<number, string>> = {
    Sun: {
      1: "Strong ego, leadership, health consciousness, self-driven career. Natural authority and vitality.",
      2: "Wealth through government/authority, strong speech, family pride. Father linked to finances.",
      3: "Courage, communication skills, creative writing. Relations with siblings may be competitive.",
      4: "Home/property gains but mother's health needs attention. Inner confidence.",
      5: "Creative expression, leadership in romance, intelligent children. Speculative gains possible.",
      6: "Strong immune system, wins over enemies. Service to authority. Competitive nature.",
      7: "Authoritative partner, may dominate marriage. Public recognition through partnerships.",
      8: "Interest in occult, longevity concerns, inheritance possible. Transformation through crises.",
      9: "Fortune through father/guru, deep spirituality, government luck. Long journeys.",
      10: "Excellent career position, government connections, natural leader. High status.",
      11: "Gains from authority, powerful friends, social influence. Fulfillment of desires.",
      12: "Expenses on self/ego, foreign travel, spiritual retreat. Government institutions.",
    },
    Moon: {
      1: "Emotional personality, changeable moods, attractive appearance, empathetic nature.",
      2: "Wealth through public dealings, good family bonds, sweet speech, food business.",
      3: "Emotional courage, creative writing/media, sensitive communication.",
      4: "Happiness at home, strong mother bond, property, real estate gains.",
      5: "Intuitive intelligence, romantic nature, good children, creative gifts.",
      6: "Health fluctuations, emotional stress from enemies/debts. Healing ability.",
      7: "Emotional in relationships, attractive spouse, public dealings, travel.",
      8: "Psychic abilities, emotional depth, interest in mysteries. Health fluctuations.",
      9: "Philosophical mind, fortune through pilgrimages, devoted to religion.",
      10: "Career in public-facing roles, fluctuating career, mother's influence on work.",
      11: "Gains through masses, large social circle, income from public/women.",
      12: "Spiritual mind, foreign connections, bed comforts, private emotional life.",
    },
  };
  const pDesc = descs[planet];
  if (pDesc && pDesc[house]) return pDesc[house];
  return `${planet} in ${sign} in House ${house} brings unique qualities related to ${planet}'s natural significations in this life area. Study this placement in context of the overall chart for deeper insights.`;
}

function getSignifications(planet: string): string {
  const sig: Record<string, string> = {
    Sun: "career, father, authority, health, government",
    Moon: "emotions, mother, mind, public, wealth, travel",
    Mars: "courage, siblings, property, sports, engineering",
    Mercury: "intelligence, communication, business, education",
    Jupiter: "wisdom, children, fortune, spirituality, law",
    Venus: "marriage, arts, beauty, vehicles, luxury",
    Saturn: "discipline, longevity, service, delays, karma",
    Rahu: "foreign, technology, unconventional gains, obsession",
    Ketu: "spirituality, liberation, past life, research",
  };
  return sig[planet] ?? "its signified life areas";
}

function getLifeAreaScore(area: string, chart: ChartData): number {
  const p = chart.planets;
  const exalt  = (pd?: { dignity?: string }) => pd?.dignity?.includes("Exalt") ?? false;
  const own    = (pd?: { dignity?: string }) => pd?.dignity?.includes("Own") ?? false;
  const debil  = (pd?: { dignity?: string }) => pd?.dignity?.includes("Debilit") ?? false;
  const inH    = (h: number) => Object.values(p).filter(pl => pl.house === h).length;

  let s = 5;
  if (area === "career") {
    if (exalt(p.Sun) || own(p.Sun))  s += 2; else if (debil(p.Sun))  s -= 1;
    if (exalt(p.Saturn))             s += 1; else if (debil(p.Saturn)) s -= 1;
    if (inH(10) > 0) s += 1;
  } else if (area === "marriage") {
    if (exalt(p.Venus) || own(p.Venus)) s += 2; else if (debil(p.Venus)) s -= 2;
    if (exalt(p.Jupiter))               s += 1;
    if (inH(7) > 0) s += 1;
  } else if (area === "wealth") {
    if (exalt(p.Jupiter) || own(p.Jupiter)) s += 2; else if (debil(p.Jupiter)) s -= 1;
    if (inH(2) > 0 || inH(11) > 0) s += 1;
  } else if (area === "health") {
    if (exalt(p.Sun) || own(p.Sun)) s += 1;
    if (inH(6) > 1) s -= 1;
    if (inH(8) > 1) s -= 1;
    if (exalt(p.Moon) || own(p.Moon)) s += 1;
  } else if (area === "spiritual") {
    if (exalt(p.Jupiter) || own(p.Jupiter)) s += 2;
    if (inH(9) > 0 || inH(12) > 0) s += 1;
  } else if (area === "children") {
    if (exalt(p.Jupiter) || own(p.Jupiter)) s += 2; else if (debil(p.Jupiter)) s -= 1;
    if (inH(5) > 0) s += 1;
  }
  return Math.max(1, Math.min(10, s));
}

function getLifeAreaAnalysis(area: string, chart: ChartData): string[] {
  const planets: ChartData["planets"] = chart.planets;
  const results: string[] = [];
  const RASHIS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

  if (area === "career") {
    const h10Sign = RASHIS[(chart.lagnaNum + 9) % 12];
    const h10Planets = Object.entries(planets).filter(([, v]) => v.house === 10);
    results.push(`10th house falls in ${h10Sign} — career themes: ${getHouseSignTheme(h10Sign)}`);
    if (h10Planets.length > 0) {
      results.push(`Planets in 10th house: ${h10Planets.map(([k]) => k).join(", ")} — strong focus on career/profession`);
    } else {
      results.push("10th house is empty — career guided by 10th lord's position and strength.");
    }
    const sun = planets["Sun"];
    if (sun) results.push(`Sun in House ${sun.house} — career authority ${sun.dignity?.includes("Exalt") ? "excellently placed" : sun.dignity?.includes("Debilit") ? "faces challenges" : "is functional"}`);
    const saturn = planets["Saturn"];
    if (saturn) results.push(`Saturn in House ${saturn.house} — discipline and karma in ${saturn.sign} influences long-term career trajectory`);
  } else if (area === "marriage") {
    const h7Sign = RASHIS[(chart.lagnaNum + 6) % 12];
    const h7Planets = Object.entries(planets).filter(([, v]) => v.house === 7);
    results.push(`7th house in ${h7Sign} — relationship themes: ${getHouseSignTheme(h7Sign)}`);
    if (h7Planets.length > 0) {
      results.push(`Planets in 7th house: ${h7Planets.map(([k]) => k).join(", ")} — directly influences marriage`);
    }
    const venus = planets["Venus"];
    if (venus) results.push(`Venus in ${venus.sign} (House ${venus.house}) — ${venus.dignity?.includes("Exalt") || venus.dignity?.includes("Own") ? "excellent" : "functional"} placement for love and relationships`);
    const jupiter2 = planets["Jupiter"];
    if (jupiter2) results.push(`Jupiter in House ${jupiter2.house} aspects and protects marriage matters when well-placed`);
  } else if (area === "wealth") {
    const h2Sign = RASHIS[(chart.lagnaNum + 1) % 12];
    const h11Sign = RASHIS[(chart.lagnaNum + 10) % 12];
    const h2Planets = Object.entries(planets).filter(([, v]) => v.house === 2);
    const h11Planets = Object.entries(planets).filter(([, v]) => v.house === 11);
    results.push(`2nd house (savings) in ${h2Sign} — ${getHouseSignTheme(h2Sign)}`);
    results.push(`11th house (income) in ${h11Sign} — ${getHouseSignTheme(h11Sign)}`);
    if (h2Planets.length > 0) results.push(`2nd house planets: ${h2Planets.map(([k]) => k).join(", ")}`);
    if (h11Planets.length > 0) results.push(`11th house planets: ${h11Planets.map(([k]) => k).join(", ")} — strong income indicators`);
    const jupiter3 = planets["Jupiter"];
    if (jupiter3) results.push(`Jupiter in House ${jupiter3.house} — expands wealth through ${jupiter3.sign}'s qualities`);
  } else if (area === "health") {
    results.push(`Lagna in ${chart.lagnaRashi} — constitution and vitality profile: ${lagnaTraits[chart.lagnaRashi]?.split(".")[0] ?? "functional"}`);
    const h6Planets = Object.entries(planets).filter(([, v]) => v.house === 6);
    const h8Planets = Object.entries(planets).filter(([, v]) => v.house === 8);
    if (h6Planets.length > 0) results.push(`6th house (disease) has: ${h6Planets.map(([k]) => k).join(", ")} — watch for related health areas`);
    if (h8Planets.length > 0) results.push(`8th house (chronic/hidden) has: ${h8Planets.map(([k]) => k).join(", ")} — deep health karma`);
    const saturn2 = planets["Saturn"];
    if (saturn2) results.push(`Saturn in ${saturn2.sign} (House ${saturn2.house}) — areas of chronic health concern or disciplined healing`);
    results.push("Preventive approach: annual check-ups, yoga, and prescribed dietary remedies strengthen constitution.");
  } else if (area === "spiritual") {
    const h9Planets = Object.entries(planets).filter(([, v]) => v.house === 9);
    const h12Planets = Object.entries(planets).filter(([, v]) => v.house === 12);
    const h9Sign = RASHIS[(chart.lagnaNum + 8) % 12];
    results.push(`9th house (dharma) in ${h9Sign} — spiritual path through ${getHouseSignTheme(h9Sign)}`);
    if (h9Planets.length > 0) results.push(`9th house planets: ${h9Planets.map(([k]) => k).join(", ")} — strong dharmic mission`);
    if (h12Planets.length > 0) results.push(`12th house (moksha) planets: ${h12Planets.map(([k]) => k).join(", ")} — spiritual liberation potential`);
    const ketu = planets["Ketu"];
    if (ketu) results.push(`Ketu in ${ketu.sign} (House ${ketu.house}) — past life spiritual abilities and detachment theme`);
    const jupiter4 = planets["Jupiter"];
    if (jupiter4) results.push(`Jupiter in ${jupiter4.sign} — guru principle and higher wisdom path`);
  } else if (area === "children") {
    const h5Sign = RASHIS[(chart.lagnaNum + 4) % 12];
    const h5Planets = Object.entries(planets).filter(([, v]) => v.house === 5);
    results.push(`5th house in ${h5Sign} — children and intelligence through ${getHouseSignTheme(h5Sign)}`);
    if (h5Planets.length > 0) results.push(`5th house planets: ${h5Planets.map(([k]) => k).join(", ")}`);
    const jupiter5 = planets["Jupiter"];
    if (jupiter5) results.push(`Jupiter (karaka for children) in House ${jupiter5.house} — ${jupiter5.dignity?.includes("Exalt") || jupiter5.dignity?.includes("Own") ? "excellent" : "functional"} for children's matters`);
  }

  if (results.length === 0) results.push("Detailed analysis requires careful study of house lords and their placements.");
  return results;
}

function getHouseSignTheme(sign: string): string {
  const themes: Record<string, string> = {
    Aries: "pioneering, competitive, leadership",
    Taurus: "stability, accumulation, sensual pleasures",
    Gemini: "communication, versatility, multiple income streams",
    Cancer: "nurturing, real estate, public dealings",
    Leo: "authority, government, status-driven",
    Virgo: "service, analysis, healthcare",
    Libra: "partnerships, balance, justice-related",
    Scorpio: "transformation, research, occult",
    Sagittarius: "philosophy, education, foreign connections",
    Capricorn: "discipline, corporate, long-term building",
    Aquarius: "innovation, technology, humanitarian",
    Pisces: "spiritual, creative, compassionate",
  };
  return themes[sign] ?? "unique combination of energies";
}

const lagnaTraits: Record<string, string> = {
  Aries: "Fiery, courageous, pioneering, impulsive, natural leader. Ruled by Mars.",
  Taurus: "Stable, patient, sensual, stubborn, fond of luxury. Ruled by Venus.",
  Gemini: "Curious, communicative, versatile, restless, witty. Ruled by Mercury.",
  Cancer: "Emotional, nurturing, intuitive, protective, home-loving. Ruled by Moon.",
  Leo: "Regal, generous, dramatic, proud, creative. Ruled by Sun.",
  Virgo: "Analytical, perfectionist, service-oriented, detail-focused. Ruled by Mercury.",
  Libra: "Balanced, diplomatic, aesthetic, indecisive, social. Ruled by Venus.",
  Scorpio: "Intense, secretive, transformative, powerful, magnetic. Ruled by Mars/Ketu.",
  Sagittarius: "Philosophical, optimistic, adventurous, freedom-loving. Ruled by Jupiter.",
  Capricorn: "Disciplined, ambitious, responsible, practical, authoritative. Ruled by Saturn.",
  Aquarius: "Innovative, humanitarian, detached, idealistic, unconventional. Ruled by Saturn/Rahu.",
  Pisces: "Spiritual, compassionate, dreamy, intuitive, artistic. Ruled by Jupiter.",
};

function generateYearForecast(year: number, mdPlanet: string | null, adPlanet: string | null, chart: ChartData): string[] {
  const results: string[] = [];
  const currentYear = new Date().getFullYear();
  const yearsFromNow = year - currentYear;

  if (mdPlanet) {
    const pd = chart.planets[mdPlanet];
    const quality = pd?.dignity?.includes("Exalt") ? "excellent" : pd?.dignity?.includes("Debilit") ? "challenging" : "moderate";
    results.push(`${mdPlanet} Mahadasha is ${quality} — themes of ${getSignifications(mdPlanet)} are highlighted.`);
  }
  if (adPlanet) {
    const pd = chart.planets[adPlanet];
    results.push(`${adPlanet} Antardasha (mid-year) — ${pd ? `placed in ${pd.sign}, House ${pd.house}` : "influences"} ${getSignifications(adPlanet)}.`);
  }

  results.push(`${yearsFromNow === 0 ? "This year" : yearsFromNow === 1 ? "Next year" : `${year}`}: Focus on consolidating ${mdPlanet ? getSignifications(mdPlanet).split(",")[0] : "key life areas"}.`);

  const saturn = chart.planets["Saturn"];
  if (saturn) {
    results.push("Review transit of Jupiter and Saturn over natal positions for major life shifts in this period.");
  }

  return results;
}

export async function downloadPDFReport(chart: ChartData, options: ReportOptions = { type: "full" }): Promise<void> {
  return downloadReportAsPDF(chart, options);
}

// ── VASTU PDF REPORT ────────────────────────────────────────────

export interface VastuReportInput {
  engineVersion?: string;
  summary?: string;
  scores?: Partial<Record<string, number>>;
  strengths?: Array<{ title: string; explanation: string; score?: number; system?: string }>;
  defects?: Array<{ title: string; explanation: string; severity?: number; remedies?: string[]; system?: string }>;
  recommendations?: Array<{ title: string; priority?: string; system?: string; steps?: string[]; requiresKundli?: boolean }>;
  correctionPlan?: { thirtyDay?: string[]; sixtyDay?: string[]; ninetyDay?: string[] };
  mindMakan?: { physical?: string[]; behavioural?: string[]; routine?: string[]; emotional?: string[]; spiritual?: string[] };
  vastuPurushaHealth?: { affectedZones?: string[]; observations?: string[] };
  zoneAnalysis?: {
    overallScore?: number;
    zones?: Array<{ dir: string; name: string; planet: string; domain: string; score: number; status: string; planets?: string[]; remedy?: string; hasDosha?: boolean }>;
    strongZones?: Array<{ dir: string; name: string; score: number; domain: string }>;
    weakZones?: Array<{ dir: string; name: string; score: number; domain: string; remedy?: string }>;
    psychBridge?: string[];
    transitAlerts?: Array<{ planet: string; zone: string; domain: string; effect: string; remedy: string; positive: boolean }>;
    roomGuide?: ReadonlyArray<{ room: string; idealDir: string; reason: string }>;
  };
}

export interface VastuPropertyInfo {
  ownerName?: string;
  type?: string;
  facing?: string;
  shape?: string;
  rooms?: Array<{ name?: string; type?: string; direction?: string }>;
}

function addVastuScoreBar(b: PDFBuilder, label: string, score: number) {
  b.checkPage(10);
  const barW = b.pageW - b.margin * 2;
  const filled = Math.round((score / 100) * barW);
  const color: [number, number, number] = score >= 80 ? [34, 197, 94] : score >= 60 ? [245, 158, 11] : [239, 68, 68];
  b.pdf.setFontSize(8.5);
  b.black();
  b.pdf.text(`${label}`, b.margin, b.y);
  b.pdf.setFontSize(8.5);
  b.gold();
  b.pdf.text(`${score}/100`, b.pageW - b.margin - 16, b.y);
  b.y += 4;
  b.pdf.setFillColor(40, 40, 60);
  b.pdf.roundedRect(b.margin, b.y, barW, 4, 1, 1, "F");
  b.pdf.setFillColor(...color);
  b.pdf.roundedRect(b.margin, b.y, filled, 4, 1, 1, "F");
  b.y += 8;
}

function addVastuCoverPage(b: PDFBuilder, info: VastuPropertyInfo) {
  b.pdf.setFillColor(...DARK_BG);
  b.pdf.rect(0, 0, b.pageW, b.pageH, "F");

  b.pdf.setFillColor(...GOLD);
  b.pdf.rect(0, 0, b.pageW, 4, "F");
  b.pdf.rect(0, b.pageH - 4, b.pageW, 4, "F");

  b.pdf.setFontSize(9);
  b.pdf.setTextColor(...GOLD);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text("ASTROLIFE", b.pageW / 2, 30, { align: "center" });

  b.pdf.setFontSize(24);
  b.pdf.setTextColor(255, 255, 255);
  b.pdf.text("Vastu Intelligence", b.pageW / 2, 55, { align: "center" });
  b.pdf.text("Report", b.pageW / 2, 67, { align: "center" });

  b.pdf.setFontSize(9);
  b.pdf.setTextColor(...GOLD);
  b.pdf.text("MULTI-TRADITION · SOURCE-TAGGED · KUNDLI-AWARE", b.pageW / 2, 80, { align: "center" });

  b.pdf.setFillColor(...GOLD);
  b.pdf.rect(b.margin, 90, b.pageW - b.margin * 2, 0.4, "F");

  b.pdf.setFontSize(10);
  b.pdf.setTextColor(200, 200, 200);
  let cy = 108;
  const info2: Array<[string, string]> = [
    ["Owner", info.ownerName || "—"],
    ["Property Type", info.type || "—"],
    ["Facing", info.facing || "—"],
    ["Shape", info.shape || "—"],
    ["Date", new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })],
  ];
  for (const [k, v] of info2) {
    b.pdf.setTextColor(...GOLD);
    b.pdf.setFont("helvetica", "bold");
    b.pdf.text(`${k}:`, b.margin + 10, cy);
    b.pdf.setTextColor(220, 220, 220);
    b.pdf.setFont("helvetica", "normal");
    b.pdf.text(v, b.margin + 45, cy);
    cy += 9;
  }

  b.pdf.setFillColor(...GOLD);
  b.pdf.rect(b.margin, cy + 5, b.pageW - b.margin * 2, 0.4, "F");

  b.pdf.setFontSize(8);
  b.pdf.setTextColor(120, 120, 120);
  b.pdf.text(
    "Classical Vastu  ·  Modern Practical Vastu  ·  MahaVastu Remedies  ·  Lal Kitab Makan Vastu",
    b.pageW / 2, b.pageH - 20, { align: "center" }
  );
  b.pdf.text("This report is for guidance only. Consult a qualified Vastu expert for structural changes.", b.pageW / 2, b.pageH - 14, { align: "center" });
}

export async function generateVastuPDFReport(
  result: VastuReportInput,
  info: VastuPropertyInfo = {}
): Promise<Blob> {
  const b = new PDFBuilder();

  // ── Cover Page ──
  addVastuCoverPage(b, info);

  // ── Executive Summary ──
  b.sectionHeader("PROPERTY OVERVIEW & EXECUTIVE SUMMARY");

  b.subHeader("Property Details");
  b.keyValue("Owner",         info.ownerName   || "Not specified");
  b.keyValue("Type",          info.type        || "Not specified");
  b.keyValue("Facing",        info.facing      || "Not specified");
  b.keyValue("Plot Shape",    info.shape       || "Not specified");
  b.keyValue("Engine",        result.engineVersion || "vastu-intelligence-v4.0-unified");
  b.spacer(4);

  b.subHeader("Summary");
  b.line(result.summary || "Vastu analysis complete. See sections below.", 0, 9);
  b.spacer(4);

  const overallScore = result.scores?.overall ?? 0;
  b.subHeader("Overall Vastu Score");
  addVastuScoreBar(b, "Overall", overallScore);

  const scoreBand =
    overallScore >= 85 ? "Excellent — Property is highly supportive." :
    overallScore >= 70 ? "Good — Manageable improvements needed." :
    overallScore >= 55 ? "Average — Multiple corrections required." :
    overallScore >= 40 ? "Defective — Significant attention needed." :
    "High Risk — Expert guidance strongly recommended.";
  b.keyValue("Score Band", scoreBand);

  if (info.rooms && info.rooms.length > 0) {
    b.spacer(4);
    b.subHeader("Room Summary");
    b.threeCol("Room", "Type", "Direction");
    b.divider();
    for (const room of info.rooms) {
      b.threeCol(room.name || "—", room.type || "—", room.direction || "—");
    }
  }

  // ── Domain Scores ──
  b.sectionHeader("DOMAIN SCORES");
  b.subHeader("Life Area Vastu Scores");
  b.line("Each score reflects the Vastu alignment of the corresponding life area based on room placements, axis features and kundli amplification.", 0, 9);
  b.spacer(6);

  const domainLabels: Record<string, string> = {
    overall: "Overall",   wealth: "Wealth",   health: "Health",
    relationship: "Relationship", career: "Career", children: "Children",
    spiritual: "Spiritual", business: "Business", mentalPeace: "Mental Peace", construction: "Construction",
  };
  for (const [key, label] of Object.entries(domainLabels)) {
    const score = result.scores?.[key];
    if (score !== undefined) addVastuScoreBar(b, label, score);
  }

  // ── Critical Defects ──
  const allDefects = result.defects || [];
  const criticalDefects = allDefects.filter((d) => (d.severity ?? 0) >= 9);
  const highDefects     = allDefects.filter((d) => (d.severity ?? 0) >= 7 && (d.severity ?? 0) < 9);
  const otherDefects    = allDefects.filter((d) => (d.severity ?? 0) < 7);

  if (allDefects.length > 0) {
    b.sectionHeader("VASTU DEFECTS");
    b.subHeader("Source: Classical Vastu + Modern Practical + Lal Kitab (where applicable)");
    b.line("Defects are listed by severity. Physical corrections take priority over symbolic remedies.", 0, 9);
    b.spacer(4);

    for (const [group, label] of [
      [criticalDefects, "CRITICAL DEFECTS (Severity 9–10)"],
      [highDefects, "HIGH PRIORITY DEFECTS (Severity 7–8)"],
      [otherDefects, "MEDIUM / LOW DEFECTS (Severity below 7)"],
    ] as const) {
      if (group.length === 0) continue;
      b.subHeader(label);
      for (const d of group) {
        b.checkPage(20);
        b.pdf.setFontSize(9.5);
        b.gold();
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text(`${d.title}  [${d.severity ?? "?"}/10]`, b.margin, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.y += 6;
        b.line(d.explanation || "", 0, 8.5);
        if (d.system) { b.gray(); b.pdf.setFontSize(7.5); b.pdf.text(`System: ${d.system}`, b.margin, b.y); b.y += 5; }
        if (d.remedies && d.remedies.length > 0) {
          b.pdf.setFontSize(8.5);
          b.black();
          b.pdf.text("Remedies:", b.margin, b.y); b.y += 5;
          for (const rem of d.remedies) b.bullet(rem, 5);
        }
        b.spacer(4);
        b.divider();
      }
    }
  }

  // ── Strengths ──
  const strengths = result.strengths || [];
  if (strengths.length > 0) {
    b.sectionHeader("VASTU STRENGTHS");
    b.line("Positive alignments in the property. These zones support good outcomes when maintained.", 0, 9);
    b.spacer(4);
    for (const s of strengths) {
      b.checkPage(15);
      b.pdf.setFontSize(9.5);
      b.gold();
      b.pdf.setFont("helvetica", "bold");
      b.pdf.text(`${s.title}  [Score: ${s.score ?? "—"}/10]`, b.margin, b.y);
      b.pdf.setFont("helvetica", "normal");
      b.y += 6;
      b.line(s.explanation || "", 0, 8.5);
      if (s.system) { b.gray(); b.pdf.setFontSize(7.5); b.pdf.text(`System: ${s.system}`, b.margin, b.y); b.y += 5; }
      b.spacer(3);
    }
  }

  // ── Recommendations ──
  const recommendations = result.recommendations || [];
  if (recommendations.length > 0) {
    b.sectionHeader("RECOMMENDATIONS");
    b.line("Source-tagged recommendations. Classical rules take priority over MahaVastu products. Lal Kitab remedies require kundli validation.", 0, 9);
    b.spacer(4);

    for (const rec of recommendations) {
      b.checkPage(20);
      b.pdf.setFontSize(9.5);
      b.gold();
      b.pdf.setFont("helvetica", "bold");
      b.pdf.text(`${rec.title}`, b.margin, b.y);
      b.pdf.setFont("helvetica", "normal");
      b.y += 6;
      if (rec.priority || rec.system) {
        b.gray();
        b.pdf.setFontSize(7.5);
        b.pdf.text(`Priority: ${rec.priority || "—"}  |  System: ${rec.system || "—"}`, b.margin, b.y);
        b.y += 5;
      }
      if (rec.requiresKundli) {
        b.pdf.setFontSize(7.5);
        b.pdf.setTextColor(200, 160, 48);
        b.pdf.text("Kundli validation required before applying this remedy.", b.margin, b.y);
        b.y += 5;
      }
      if (rec.steps && rec.steps.length > 0) {
        b.black();
        for (const step of rec.steps) b.bullet(step, 5);
      }
      b.spacer(3);
      b.divider();
    }
  }

  // ── 30/60/90 Day Correction Plan ──
  if (result.correctionPlan) {
    b.sectionHeader("30 / 60 / 90 DAY CORRECTION PLAN");
    b.line("Phased correction plan based on defect severity. Start with physical corrections. Do not jump to symbolic remedies before structural ones.", 0, 9);
    b.spacer(4);

    for (const [label, items] of [
      ["FIRST 30 DAYS — Critical & Free Corrections", result.correctionPlan.thirtyDay],
      ["DAYS 31–60 — High Priority Corrections",      result.correctionPlan.sixtyDay],
      ["DAYS 61–90 — Medium Corrections & Behavioural", result.correctionPlan.ninetyDay],
    ] as const) {
      if (!items || items.length === 0) continue;
      b.checkPage(20);
      b.subHeader(label);
      items.forEach((item, i) => b.bullet(`${i + 1}. ${item}`, 3));
      b.spacer(4);
    }
  }

  // ── Mind + Makan Energy Loop ──
  if (result.mindMakan) {
    b.sectionHeader("MIND + MAKAN ENERGY LOOP");
    b.line("The house affects the mind. The mind affects the house. Physical correction is necessary but not sufficient alone.", 0, 9);
    b.spacer(4);

    for (const [label, items] of [
      ["Physical Corrections", result.mindMakan.physical],
      ["Behavioural Corrections", result.mindMakan.behavioural],
      ["Routine Corrections", result.mindMakan.routine],
      ["Emotional Corrections", result.mindMakan.emotional],
      ["Spiritual / Awareness Corrections", result.mindMakan.spiritual],
    ] as const) {
      if (!items || items.length === 0) continue;
      b.checkPage(16);
      b.subHeader(label);
      for (const item of items) b.bullet(item, 3);
      b.spacer(3);
    }
  }

  // ── Vastu Purusha Health Map ──
  if (result.vastuPurushaHealth) {
    b.sectionHeader("VASTU PURUSHA — SYMBOLIC HEALTH MAP");
    b.line("Traditional symbolic mapping of Vastu zones to body and life areas. Use as orientation guidance, not medical advice.", 0, 9);
    b.spacer(4);

    if ((result.vastuPurushaHealth.affectedZones || []).length > 0) {
      b.keyValue("Affected Zones", result.vastuPurushaHealth.affectedZones!.join("  ·  "));
    }
    b.spacer(4);
    for (const obs of (result.vastuPurushaHealth.observations || [])) b.bullet(obs, 3);
  }

  // ── 16-Zone MahaVastu Kundli Analysis ──
  if (result.zoneAnalysis) {
    const za = result.zoneAnalysis;

    b.sectionHeader("16-ZONE MAHAVASTU KUNDLI ANALYSIS");
    b.line("Planet-based zone scoring derived from the user's Kundli. Each of the 16 compass zones is scored based on planetary occupancy, dignity and lordship.", 0, 9);
    b.spacer(4);

    if (za.overallScore !== undefined) {
      addVastuScoreBar(b, "16-Zone Overall Score", za.overallScore);
    }

    if ((za.zones || []).length > 0) {
      b.subHeader("All 16 Zones");
      b.threeCol("Direction", "Score / Status", "Domain");
      b.divider();
      for (const zone of za.zones!) {
        const planets = (zone.planets || []).join(", ");
        b.threeCol(
          `${zone.dir} — ${zone.name}`,
          `${zone.score}/92  ${zone.status}${zone.hasDosha ? " ⚠" : ""}`,
          zone.domain.substring(0, 30)
        );
        if (planets) {
          b.light();
          b.pdf.setFontSize(7.5);
          b.pdf.text(`  Planets: ${planets}`, b.margin + 3, b.y - 2);
        }
      }
      b.spacer(4);
    }

    if ((za.weakZones || []).length > 0) {
      b.subHeader("Weak Zones — Require Attention");
      for (const z of za.weakZones!) {
        b.checkPage(14);
        b.pdf.setFontSize(9);
        b.gold();
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text(`${z.dir} — ${z.name}  [${z.score}/92]`, b.margin, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.y += 5;
        b.gray();
        b.pdf.setFontSize(8);
        b.pdf.text(z.domain, b.margin, b.y); b.y += 5;
        if ("remedy" in z && z.remedy) b.bullet(String(z.remedy), 3);
        b.spacer(3);
      }
    }

    if ((za.psychBridge || []).length > 0) {
      b.sectionHeader("PSYCHOLOGY BRIDGE — PLANET-ZONE INSIGHTS");
      b.line("How the planetary configuration connects to Vastu zone psychology.", 0, 9);
      b.spacer(4);
      for (const insight of za.psychBridge!) b.bullet(insight, 3);
    }

    if ((za.transitAlerts || []).length > 0) {
      b.sectionHeader("TRANSIT ALERTS");
      b.line("Current planetary positions in Vastu zones and their effects.", 0, 9);
      b.spacer(4);
      for (const alert of za.transitAlerts!) {
        b.checkPage(16);
        b.pdf.setFontSize(9);
        b.gold();
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text(`${alert.planet} → ${alert.zone}  [${alert.positive ? "Benefic" : "Malefic"}]`, b.margin, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.y += 6;
        b.line(alert.effect, 0, 8.5);
        b.bullet(`Remedy: ${alert.remedy}`, 3);
        b.spacer(3);
      }
    }

    if ((za.roomGuide || []).length > 0) {
      b.sectionHeader("IDEAL ROOM GUIDE");
      b.line("Classical room placement guide for all major rooms.", 0, 9);
      b.spacer(4);
      b.threeCol("Room", "Ideal Direction", "Reason");
      b.divider();
      for (const rg of za.roomGuide!) {
        b.twoCol(`${rg.room}  —  ${rg.idealDir}`, "");
        b.light();
        b.pdf.setFontSize(7.5);
        const wrapped = b.pdf.splitTextToSize(rg.reason, b.pageW - b.margin * 2 - 5);
        wrapped.forEach((l: string) => { b.checkPage(5); b.pdf.text(l, b.margin + 5, b.y); b.y += 4.5; });
        b.spacer(2);
      }
    }
  }

  // ── Source Policy ──
  b.sectionHeader("SOURCE POLICY & DISCLAIMER");
  b.subHeader("Classical Vastu");
  b.line("Primary authority for physical direction, room placement, mandala, bhumi and structural rules. Sources: Samarangana Sutradhara, Vishwakarma Prakash, Bhavan Bhaskar.", 0, 9);
  b.spacer(3);
  b.subHeader("Modern Practical Vastu");
  b.line("Secondary practical layer for apartments, shops, offices and hospitals. Sources: Saral/Advance Vaastu, practical scoring tools.", 0, 9);
  b.spacer(3);
  b.subHeader("MahaVastu Remedy Layer");
  b.line("Modern no-demolition remedy / product layer. Do not treat as classical authority. Metal strips, colour tapes, paintings, figurines.", 0, 9);
  b.spacer(3);
  b.subHeader("Lal Kitab Makan Vastu");
  b.line("Separate kundli-gated layer. Do not mix blindly with classical Vastu. Symbolic remedies require kundli validation.", 0, 9);
  b.spacer(6);
  b.divider();
  b.line("This report is generated by AstroLife Vastu Intelligence Engine. It is for guidance only.", 0, 8);
  b.line("Always verify compass orientation physically. Consult a qualified Vastu expert before structural changes.", 0, 8);
  b.line("Remedies do not guarantee financial, health or relationship outcomes.", 0, 8);

  // ── Footers ──
  b.addFooters(b.pdf.getNumberOfPages());

  return b.output();
}

export async function downloadVastuPDFReport(
  result: VastuReportInput,
  info: VastuPropertyInfo = {}
) {
  const blob = await generateVastuPDFReport(result, info);
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = `Vastu-Report-${info.ownerName?.replace(/\s+/g, "_") || "Property"}-${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
