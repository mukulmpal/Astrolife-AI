import jsPDF from "jspdf";
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

export interface ReportOptions {
  type: "full" | "kundli" | "remedy" | "medical" | "destiny";
  includeAnalysis?: boolean;
  resolution?: number;
}

// ── PDF Helpers ────────────────────────────────────────────────

const GOLD = [200, 160, 48] as const;
const BLACK = [20, 20, 20] as const;
const GRAY = [100, 100, 100] as const;
const LIGHT = [150, 150, 150] as const;
// const WHITE = [255, 255, 255] as const;
const DARK_BG = [15, 15, 30] as const;

class PDFBuilder {
  pdf: jsPDF;
  y: number;
  pageW: number;
  pageH: number;
  margin = 15;

  constructor() {
    this.pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    this.pageW = this.pdf.internal.pageSize.getWidth();
    this.pageH = this.pdf.internal.pageSize.getHeight();
    this.y = 20;
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

  gold() { this.pdf.setTextColor(...GOLD); }
  black() { this.pdf.setTextColor(...BLACK); }
  gray() { this.pdf.setTextColor(...GRAY); }
  light() { this.pdf.setTextColor(...LIGHT); }

  sectionHeader(title: string, addNewPage = true) {
    if (addNewPage) this.newPage();
    // Gold bar background
    this.pdf.setFillColor(...GOLD);
    this.pdf.rect(this.margin, this.y - 5, this.pageW - this.margin * 2, 10, "F");
    this.pdf.setFontSize(13);
    this.pdf.setTextColor(...DARK_BG);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.text(title, this.margin + 3, this.y + 2);
    this.pdf.setFont("helvetica", "normal");
    this.y += 12;
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
        `AstroLife Vedic Report  •  Page ${i} of ${totalPages}  •  Confidential`,
        this.pageW / 2, this.pageH - 8, { align: "center" }
      );
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

// ── MAIN REPORT ────────────────────────────────────────────────
export async function generatePDFReport(
  chart: ChartData,
  options: ReportOptions = { type: "full" }
): Promise<Blob> {
  const b = new PDFBuilder();
  void options; // options reserved for future section filtering

  // ═══════════════════════════════════════════════════════════════
  // COVER PAGE
  // ═══════════════════════════════════════════════════════════════
  b.pdf.setFillColor(...DARK_BG);
  b.pdf.rect(0, 0, b.pageW, b.pageH, "F");

  // Gold border
  b.pdf.setDrawColor(...GOLD);
  b.pdf.setLineWidth(1.5);
  b.pdf.rect(8, 8, b.pageW - 16, b.pageH - 16);
  b.pdf.setLineWidth(0.5);
  b.pdf.rect(10, 10, b.pageW - 20, b.pageH - 20);

  // Brand
  b.pdf.setFontSize(10);
  b.pdf.setTextColor(...GOLD);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text("✦ ASTROLIFE ✦", b.pageW / 2, 30, { align: "center" });

  b.pdf.setFontSize(8);
  b.pdf.setFont("helvetica", "normal");
  b.pdf.setTextColor(...LIGHT);
  b.pdf.text("AI-Powered Vedic Astrology Platform", b.pageW / 2, 37, { align: "center" });

  // Title
  b.pdf.setFontSize(22);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.setTextColor(...GOLD);
  b.pdf.text("COMPREHENSIVE", b.pageW / 2, 70, { align: "center" });
  b.pdf.text("BIRTH CHART ANALYSIS", b.pageW / 2, 82, { align: "center" });

  b.pdf.setLineWidth(0.5);
  b.pdf.line(30, 88, b.pageW - 30, 88);

  // Name
  b.pdf.setFontSize(18);
  b.pdf.setTextColor(255, 255, 255);
  b.pdf.text(chart.name.toUpperCase(), b.pageW / 2, 105, { align: "center" });

  // Details
  b.pdf.setFontSize(10);
  b.pdf.setTextColor(...LIGHT);
  b.pdf.text(`Date of Birth: ${chart.dob}  •  Time: ${chart.tob}`, b.pageW / 2, 120, { align: "center" });
  b.pdf.text(`Place: ${chart.city}`, b.pageW / 2, 128, { align: "center" });

  b.pdf.setLineWidth(0.3);
  b.pdf.line(30, 134, b.pageW - 30, 134);

  // Chart highlights
  b.pdf.setFontSize(10);
  b.pdf.setTextColor(...GOLD);
  b.pdf.text("CHART HIGHLIGHTS", b.pageW / 2, 148, { align: "center" });

  const sunSign = chart.planets["Sun"]?.sign ?? "—";
  const moonSign = chart.planets["Moon"]?.sign ?? "—";
  const moonNak = chart.planets["Moon"]?.nakshatra ?? "—";
  const highlights = [
    `Lagna (Ascendant): ${chart.lagnaRashi}`,
    `Moon Sign (Rashi): ${moonSign}`,
    `Sun Sign: ${sunSign}`,
    `Birth Nakshatra: ${moonNak}`,
  ];
  b.pdf.setFontSize(9.5);
  b.pdf.setTextColor(200, 200, 200);
  highlights.forEach((h, i) => {
    b.pdf.text(h, b.pageW / 2, 160 + i * 10, { align: "center" });
  });

  // Footer info
  b.pdf.setFontSize(8);
  b.pdf.setTextColor(...LIGHT);
  b.pdf.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`, b.pageW / 2, b.pageH - 28, { align: "center" });
  b.pdf.text("Calculations: VSOP87 + ELP2000 (Swiss Ephemeris precision)", b.pageW / 2, b.pageH - 20, { align: "center" });

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

  tocEntries.forEach(entry => {
    b.checkPage(7);
    b.pdf.setFontSize(9.5);
    b.black();
    b.pdf.text(entry, b.margin + 5, b.y);
    b.y += 7;
  });

  // ═══════════════════════════════════════════════════════════════
  // SECTION 1: BIRTH INFORMATION
  // ═══════════════════════════════════════════════════════════════
  b.sectionHeader("SECTION 1 — BIRTH INFORMATION & LAGNA DETAILS");

  b.subHeader("Personal Details");
  b.keyValue("Full Name", chart.name);
  b.keyValue("Date of Birth", chart.dob);
  b.keyValue("Time of Birth", chart.tob);
  b.keyValue("Birth City", chart.city);
  b.keyValue("Latitude", `${chart.lat.toFixed(4)}° N`);
  b.keyValue("Longitude", `${chart.lon.toFixed(4)}° E`);
  b.keyValue("Timezone", `UTC ${chart.tz >= 0 ? "+" : ""}${chart.tz}`);
  b.keyValue("Julian Day Number", chart.jd.toFixed(5));
  b.spacer(4);

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

  // Table header
  b.pdf.setFontSize(8.5);
  b.pdf.setTextColor(...GOLD);
  b.pdf.setFont("helvetica", "bold");
  const col1 = b.margin, col2 = col1 + 22, col3 = col2 + 28, col4 = col3 + 18, col5 = col4 + 30, col6 = col5 + 32;
  b.pdf.text("Planet", col1, b.y);
  b.pdf.text("Sign", col2, b.y);
  b.pdf.text("House", col3, b.y);
  b.pdf.text("Degree", col4, b.y);
  b.pdf.text("Nakshatra", col5, b.y);
  b.pdf.text("Dignity", col6, b.y);
  b.pdf.setFont("helvetica", "normal");
  b.y += 6;
  b.divider();

  const planetOrder = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  planetOrder.forEach(p => {
    const pd = chart.planets[p];
    if (!pd) return;
    b.checkPage(7);
    b.pdf.setFontSize(8.5);
    b.black();
    b.pdf.text(p, col1, b.y);
    b.pdf.text(pd.sign, col2, b.y);
    b.pdf.text(`H${pd.house}`, col3, b.y);
    b.pdf.text(`${(pd.lon % 30).toFixed(1)}°`, col4, b.y);
    b.pdf.text(pd.nakshatra ?? "—", col5, b.y);
    if (pd.dignity) {
      if (pd.dignity.includes("Exalt")) b.pdf.setTextColor(0, 150, 80);
      else if (pd.dignity.includes("Debilit")) b.pdf.setTextColor(200, 50, 50);
      else b.gray();
      b.pdf.text(pd.dignity.substring(0, 18), col6, b.y);
      b.black();
    } else {
      b.pdf.text("Neutral", col6, b.y);
    }
    if (pd.retrograde) {
      b.pdf.setTextColor(180, 80, 200);
      b.pdf.text(" ℞", col6 + 20, b.y);
      b.black();
    }
    b.y += 6;
  });

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

  // Table header
  b.pdf.setFontSize(8.5);
  b.pdf.setTextColor(...GOLD);
  b.pdf.setFont("helvetica", "bold");
  b.pdf.text("Planet", b.margin, b.y);
  b.pdf.text("Duration", b.margin + 25, b.y);
  b.pdf.text("Start Date", b.margin + 50, b.y);
  b.pdf.text("End Date", b.margin + 90, b.y);
  b.pdf.text("Status", b.margin + 130, b.y);
  b.pdf.setFont("helvetica", "normal");
  b.y += 5;
  b.divider();

  const now = new Date();
  let currentMD: (typeof chart.dashas)[0] | null = null;

  chart.dashas.forEach(d => {
    b.checkPage(7);
    const start = new Date(d.start);
    const end = new Date(d.end);
    const isActive = start <= now && now < end;
    if (isActive) currentMD = d;

    b.pdf.setFontSize(8.5);
    if (isActive) {
      b.pdf.setTextColor(0, 180, 100);
      b.pdf.setFont("helvetica", "bold");
    } else if (end < now) {
      b.gray();
    } else {
      b.black();
    }
    b.pdf.text(d.planet, b.margin, b.y);
    b.pdf.text(`${d.yrs} yrs`, b.margin + 25, b.y);
    b.pdf.text(start.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), b.margin + 50, b.y);
    b.pdf.text(end.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), b.margin + 90, b.y);
    b.pdf.text(isActive ? "◀ ACTIVE" : end < now ? "Completed" : "Future", b.margin + 130, b.y);
    b.pdf.setFont("helvetica", "normal");
    b.black();
    b.y += 6;
  });

  b.spacer(6);

  // Current period analysis
  b.subHeader("Current Active Period Analysis");
  if (currentMD) {
    const md = currentMD as typeof chart.dashas[0];
    b.keyValue("Active Mahadasha", md.planet);
    b.keyValue("Period End", new Date(md.end).toLocaleDateString("en-IN", { year: "numeric", month: "long" }));
    const mdPD = chart.planets[md.planet];
    if (mdPD) {
      b.keyValue("Mahadasha Lord Position", `${mdPD.sign}, House ${mdPD.house}`);
      if (mdPD.dignity) b.keyValue("Mahadasha Lord Dignity", mdPD.dignity);
    }
    b.spacer(4);
  }

  // Antardasha
  b.subHeader("Current Antardasha (Sub-Periods)");
  if (chart.antardasha && chart.antardasha.length > 0) {
    b.pdf.setFontSize(8.5);
    b.pdf.setTextColor(...GOLD);
    b.pdf.setFont("helvetica", "bold");
    b.pdf.text("Sub-Lord", b.margin, b.y);
    b.pdf.text("Start", b.margin + 30, b.y);
    b.pdf.text("End", b.margin + 80, b.y);
    b.pdf.text("Status", b.margin + 130, b.y);
    b.pdf.setFont("helvetica", "normal");
    b.y += 5;
    b.divider();

    chart.antardasha.slice(0, 20).forEach(ad => {
      b.checkPage(7);
      const start = new Date(ad.start);
      const end = new Date(ad.end);
      const isActive = start <= now && now < end;
      b.pdf.setFontSize(8);
      if (isActive) { b.pdf.setTextColor(0, 180, 100); b.pdf.setFont("helvetica", "bold"); }
      else if (end < now) b.gray();
      else b.black();
      b.pdf.text(ad.planet, b.margin, b.y);
      b.pdf.text(start.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), b.margin + 30, b.y);
      b.pdf.text(end.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), b.margin + 80, b.y);
      b.pdf.text(isActive ? "◀ ACTIVE" : end < now ? "Done" : "Upcoming", b.margin + 130, b.y);
      b.pdf.setFont("helvetica", "normal");
      b.black();
      b.y += 6;
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

    b.keyValue("Total Yogas Found", String(yogas.length));
    b.keyValue("Raj Yogas", String(rajYogas.length));
    b.keyValue("Dhana Yogas", String(dhanaYogas.length));
    b.keyValue("Doshas", String(doshas.length));
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
    b.keyValue("Birth Nakshatra", medical.birthNakshatra ?? "—");
    b.keyValue("Disease Tendency", medical.nakshatraDisease ?? "—");
    b.keyValue("Accident Risk Index", `${medical.accidentRisk ?? "—"}%`);
    b.keyValue("Physical Constitution", medical.lagnaSign ?? chart.lagnaRashi);
    b.spacer(4);

    b.subHeader("Top Health Concerns");
    medical.topConcerns?.forEach((c: string) => b.bullet(c));
    b.spacer(4);

    if (medical.alerts?.length) {
      b.subHeader("Planetary Health Alerts");
      medical.alerts.forEach(alert => {
        b.checkPage(10);
        b.pdf.setFontSize(9.5);
        if (alert.severity === "high") b.pdf.setTextColor(200, 50, 50);
        else if (alert.severity === "medium") b.pdf.setTextColor(200, 130, 0);
        else b.gold();
        b.pdf.setFont("helvetica", "bold");
        b.pdf.text(`${alert.planet} (H${alert.house}) [${alert.severity.toUpperCase()}]:`, b.margin + 2, b.y);
        b.pdf.setFont("helvetica", "normal");
        b.y += 5.5;
        b.black();
        const dlines = b.pdf.splitTextToSize(alert.disease, b.pageW - b.margin * 2 - 6);
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
    b.bullet("Annual full body check-up recommended especially during transit of Saturn, Rahu over natal Moon.");
    b.bullet("Avoid overexertion during 8th house transit periods.");
    b.bullet("Follow Nakshatra-based diet for constitution maintenance.");
    b.bullet("Practice yoga and pranayama aligned with Lagna lord's significations.");
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

  lifeAreas.forEach(area => {
    b.checkPage(30);
    b.subHeader(area.title);
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

function getLifeAreaAnalysis(area: string, chart: ChartData): string[] {
  const planets: ChartData["planets"] = chart.planets;
  const results: string[] = [];
  const RASHIS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];

  if (area === "career") {
    const h10Sign = RASHIS[(chart.lagnaNum + 9) % 12];
    const h10Planets = Object.entries(planets).filter(([, v]) => v.house === 10);
    results.push(`10th house falls in ${h10Sign} — career themes: ${getHouseSignTheme(h10Sign, "career")}`);
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
    results.push(`7th house in ${h7Sign} — relationship themes: ${getHouseSignTheme(h7Sign, "marriage")}`);
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
    results.push(`2nd house (savings) in ${h2Sign} — ${getHouseSignTheme(h2Sign, "wealth")}`);
    results.push(`11th house (income) in ${h11Sign} — ${getHouseSignTheme(h11Sign, "income")}`);
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
    results.push(`9th house (dharma) in ${h9Sign} — spiritual path through ${getHouseSignTheme(h9Sign, "spiritual")}`);
    if (h9Planets.length > 0) results.push(`9th house planets: ${h9Planets.map(([k]) => k).join(", ")} — strong dharmic mission`);
    if (h12Planets.length > 0) results.push(`12th house (moksha) planets: ${h12Planets.map(([k]) => k).join(", ")} — spiritual liberation potential`);
    const ketu = planets["Ketu"];
    if (ketu) results.push(`Ketu in ${ketu.sign} (House ${ketu.house}) — past life spiritual abilities and detachment theme`);
    const jupiter4 = planets["Jupiter"];
    if (jupiter4) results.push(`Jupiter in ${jupiter4.sign} — guru principle and higher wisdom path`);
  } else if (area === "children") {
    const h5Sign = RASHIS[(chart.lagnaNum + 4) % 12];
    const h5Planets = Object.entries(planets).filter(([, v]) => v.house === 5);
    results.push(`5th house in ${h5Sign} — children and intelligence through ${getHouseSignTheme(h5Sign, "children")}`);
    if (h5Planets.length > 0) results.push(`5th house planets: ${h5Planets.map(([k]) => k).join(", ")}`);
    const jupiter5 = planets["Jupiter"];
    if (jupiter5) results.push(`Jupiter (karaka for children) in House ${jupiter5.house} — ${jupiter5.dignity?.includes("Exalt") || jupiter5.dignity?.includes("Own") ? "excellent" : "functional"} for children's matters`);
  }

  if (results.length === 0) results.push("Detailed analysis requires careful study of house lords and their placements.");
  return results;
}

function getHouseSignTheme(sign: string, area: string): string {
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

export async function downloadPDFReport(chart: ChartData, options: ReportOptions = { type: "full" }) {
  const blob = await generatePDFReport(chart, options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${chart.name.replace(/\s+/g, "_")}-AstroLife-Report-${new Date().toISOString().split("T")[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
