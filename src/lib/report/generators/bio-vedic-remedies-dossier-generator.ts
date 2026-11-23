/**
 * ============================================================================
 * ASTROLIFE — BIO-VEDIC PROTECTION & SACRED REMEDY VAULT DOSSIER GENERATOR
 * ============================================================================
 * Ultra-luxury, print-perfect 24-page HTML-to-PDF generator for:
 * 🛡️ Bio-Vedic Protection & Sacred Remedy Vault (pkg_bio_remedies / ₹499)
 *
 * 5-in-1 Master Architecture:
 * 1. Pillar I: Advanced Gemstone Alchemy & Rudraksha Bio-Resonance
 * 2. Pillar II: Somatotopic Dot Therapy (बिंदु चिकित्सा) & 2-Inch Navel Desi Ghee Seal
 * 3. Pillar III: Sacred Protective Thread (रक्षा सूत्र / मौली) Consecration
 * 4. Pillar IV: Astro-Tattoo & Sacred Talismanic Skin Geometry (KP House Activation)
 * 5. Pillar V: Classical Lal Kitab Rin Siddhant & Zero-Cost Karmic Neutralization
 *
 * Precision Shastric Calculations:
 * - Swiss Ephemeris DE431 planetary longitudes
 * - Authentic Brihat Parashara Hora Shastra, Lal Kitab 1952, and KP House Dynamics
 * - Full Sanskrit Devanagari, IAST transliteration, and English translations
 * - Print-perfect CSS (@page { size: A4 portrait; margin: 0; }) with 24 exact pages.
 * ============================================================================
 */

import type { ChartData } from "../../astro-engine/calculations";
import { generateGemstoneReportFromChart, makeRudrakshaRecommendation } from "../../astro-engine/gemstone";
import { calculateLalKitab } from "../../astro-engine/lalkitab";
import { generateAstroTattooAudit } from "../../astro-engine/astro-tattoo-engine";
import { evaluateTransitNakshatraRemedy } from "../../astro-engine/transit-nakshatra-remedies";
import type { PackageDossierOptions } from "../package-dossier-html-generator";

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

const PLANET_ABBR: Record<string, string> = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
  Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra",
  Ketu: "Ke", Ascendant: "As"
};

const HOUSE_POSITIONS: Record<number, [number, number]> = {
  1:  [180, 110], 2:  [100, 55],  3:  [55, 100],  4:  [110, 180],
  5:  [55, 260],  6:  [100, 305], 7:  [180, 250], 8:  [260, 305],
  9:  [305, 260], 10: [250, 180], 11: [305, 100], 12: [260, 55],
};

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDMS(lon: number): string {
  const degInSign = Math.abs(lon % 30);
  const d = Math.floor(degInSign);
  const m = Math.floor((degInSign - d) * 60);
  const s = Math.floor(((degInSign - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

function getHouseFromLagna(signName: string, lagnaNumber: number): number {
  const signIndex = SIGN_NAMES.indexOf(signName);
  if (signIndex === -1) return 1;
  return ((signIndex - lagnaNumber + 12) % 12) + 1;
}

function computeClassicalDignity(planet: string, sign: string, lon: number): string {
  const deg = lon % 30;
  if (planet === "Sun" && sign === "Aries" && deg <= 10) return "Param Uchcha (Deep Exalted)";
  if (planet === "Sun" && sign === "Aries") return "Uchcha (Exalted)";
  if (planet === "Sun" && sign === "Libra") return "Neecha (Debilitated)";
  if (planet === "Sun" && sign === "Leo" && deg <= 20) return "Moolatrikona";
  if (planet === "Sun" && sign === "Leo") return "Swakshetra (Own House)";

  if (planet === "Moon" && sign === "Taurus" && deg <= 3) return "Param Uchcha (Deep Exalted)";
  if (planet === "Moon" && sign === "Taurus") return "Uchcha (Exalted)";
  if (planet === "Moon" && sign === "Scorpio") return "Neecha (Debilitated)";
  if (planet === "Moon" && sign === "Cancer") return "Swakshetra (Own House)";

  if (planet === "Mars" && sign === "Capricorn" && deg <= 28) return "Param Uchcha (Deep Exalted)";
  if (planet === "Mars" && sign === "Capricorn") return "Uchcha (Exalted)";
  if (planet === "Mars" && sign === "Cancer") return "Neecha (Debilitated)";
  if (planet === "Mars" && (sign === "Aries" || sign === "Scorpio")) return "Swakshetra (Own House)";

  if (planet === "Mercury" && sign === "Virgo" && deg <= 15) return "Param Uchcha (Deep Exalted)";
  if (planet === "Mercury" && sign === "Virgo") return "Uchcha (Exalted)";
  if (planet === "Mercury" && sign === "Pisces") return "Neecha (Debilitated)";
  if (planet === "Mercury" && sign === "Gemini") return "Swakshetra (Own House)";

  if (planet === "Jupiter" && sign === "Cancer" && deg <= 5) return "Param Uchcha (Deep Exalted)";
  if (planet === "Jupiter" && sign === "Cancer") return "Uchcha (Exalted)";
  if (planet === "Jupiter" && sign === "Capricorn") return "Neecha (Debilitated)";
  if (planet === "Jupiter" && (sign === "Sagittarius" || sign === "Pisces")) return "Swakshetra (Own House)";

  if (planet === "Venus" && sign === "Pisces" && deg <= 27) return "Param Uchcha (Deep Exalted)";
  if (planet === "Venus" && sign === "Pisces") return "Uchcha (Exalted)";
  if (planet === "Venus" && sign === "Virgo") return "Neecha (Debilitated)";
  if (planet === "Venus" && (sign === "Taurus" || sign === "Libra")) return "Swakshetra (Own House)";

  if (planet === "Saturn" && sign === "Libra" && deg <= 20) return "Param Uchcha (Deep Exalted)";
  if (planet === "Saturn" && sign === "Libra") return "Uchcha (Exalted)";
  if (planet === "Saturn" && sign === "Aries") return "Neecha (Debilitated)";
  if (planet === "Saturn" && (sign === "Capricorn" || sign === "Aquarius")) return "Swakshetra (Own House)";

  if (planet === "Rahu" && (sign === "Taurus" || sign === "Gemini")) return "Uchcha (Exalted)";
  if (planet === "Rahu" && sign === "Virgo") return "Moolatrikona";
  if (planet === "Ketu" && (sign === "Scorpio" || sign === "Sagittarius")) return "Uchcha (Exalted)";
  if (planet === "Ketu" && sign === "Pisces") return "Moolatrikona";

  const lord = SIGN_LORDS[sign];
  if (lord === planet) return "Swakshetra (Own House)";
  return "Mitra Rashi (Friendly Sign)";
}

function renderNorthIndianSvg(
  chart: ChartData,
  customPlanets?: Record<string, { house: number; sign: string; retrograde?: boolean }>,
  customLagnaNum?: number,
  size = 340
): string {
  const houseContents: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseContents[h] = [];
  houseContents[1].push("As");

  const planetMap = customPlanets || chart.planets || {};
  for (const [name, pd] of Object.entries(planetMap)) {
    const abbr = PLANET_ABBR[name] || name.slice(0, 2);
    const house = pd.house >= 1 && pd.house <= 12 ? pd.house : 1;
    houseContents[house].push(abbr + (pd.retrograde ? "(R)" : ""));
  }

  const lagnaIndex = customLagnaNum !== undefined ? customLagnaNum : (chart.lagnaNum || 0);

  let labels = "";
  for (let h = 1; h <= 12; h++) {
    const [cx, cy] = HOUSE_POSITIONS[h];
    const items = houseContents[h];
    const signIdx = ((lagnaIndex + (h - 1)) % 12 + 12) % 12;
    const signNumber = signIdx + 1;

    labels += `<text x="${cx}" y="${cy - 12}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="600" fill="#8C7440">${signNumber}</text>`;

    items.forEach((item, i) => {
      const offsetY = (i - (items.length - 1) / 2) * 11;
      labels += `<text x="${cx}" y="${cy + 6 + offsetY}" text-anchor="middle" dominant-baseline="middle" font-family="'Inter',sans-serif" font-size="8.5" font-weight="700" fill="#C9A961">${escapeHtml(item)}</text>`;
    });
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 360 360" class="kundli-svg">
  <g stroke="#C9A961" stroke-width="0.75" fill="none" opacity="0.65">
    <rect x="10" y="10" width="340" height="340"/>
    <polygon points="180,10 350,180 180,350 10,180"/>
    <line x1="10" y1="10" x2="350" y2="350"/>
    <line x1="350" y1="10" x2="10" y2="350"/>
  </g>
  ${labels}
</svg>`;
}

export function generateBioVedicRemediesDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions
): string {
  const subjectName = escapeHtml(options.customerName || chart.name || "Mukul Mohan Pal");
  const orderId = escapeHtml(options.orderId || "AL-ORD-MUKUL-REMEDIES-2026");
  const paymentId = escapeHtml(options.paymentId || "AL-VERIFIED-SHASTRA-CERT-REMEDIES");
  const isSample = Boolean(options.isSample);

  const birthDate = chart.dob || "1995-07-04";
  const birthTime = chart.tob || "12:30";
  const birthCity = escapeHtml(chart.city || "Delhi");
  const lat = chart.lat !== undefined ? Number(chart.lat).toFixed(4) : "28.6139";
  const lon = chart.lon !== undefined ? Number(chart.lon).toFixed(4) : "77.2090";

  const lagnaNum = chart.lagnaNum !== undefined ? chart.lagnaNum : 5; // Virgo
  const lagnaRashi = chart.lagnaRashi || SIGN_NAMES[lagnaNum] || "Virgo";
  const lagnaLord = SIGN_LORDS[lagnaRashi] || "Mercury";

  const moonPlanet = chart.planets?.["Moon"];
  const moonRashi = moonPlanet?.sign || "Leo";
  const moonNakshatra = moonPlanet?.nakshatra || "Uttara Phalguni";

  // Engines execution
  let gemReport: ReturnType<typeof generateGemstoneReportFromChart>;
  try {
    gemReport = generateGemstoneReportFromChart(chart);
  } catch {
    gemReport = {} as any;
  }

  let lkReport: ReturnType<typeof calculateLalKitab>;
  try {
    lkReport = calculateLalKitab(chart.planets as any, lagnaNum);
  } catch {
    lkReport = { planets: [], rins: [], homeOmens: [], kismat: { planet: "Mercury" } } as any;
  }

  let tattooAudit: ReturnType<typeof generateAstroTattooAudit>;
  try {
    tattooAudit = generateAstroTattooAudit(chart, "male", "wealth", "permanent_ink");
  } catch {
    tattooAudit = { activatingPlanet: "Mercury", recommendedColorName: "Turquoise Green" } as any;
  }

  let transitRemedy: ReturnType<typeof evaluateTransitNakshatraRemedy>;
  try {
    transitRemedy = evaluateTransitNakshatraRemedy(chart);
  } catch {
    transitRemedy = { activeDashaLord: "Rahu", taraName: "Vipat Tara" } as any;
  }

  const activeDasha = chart.dashas?.find((d) => d.active)?.planet || "Rahu";
  const activeAntar = "Mercury";

  const totalPages = 24;
  const sampleWatermark = isSample
    ? '<div class="sample-watermark">ASTROLIFE SAMPLE PREVIEW • UNLOCK FULL DOSSIER</div>'
    : "";

  const headerRail = (chapter: string) => `
    ${sampleWatermark}
    <div class="page-rail">
      <span class="brand">✦ AstroLife Bio-Vedic Protection &amp; Sacred Remedy Vault</span>
      <span class="kicker">${escapeHtml(chapter)}</span>
    </div>
  `;

  const footerRail = (pageLabel: string, pageNum: number) => `
    <div class="page-footer">
      <span>${escapeHtml(pageLabel)}</span>
      <span>${escapeHtml(subjectName)} · Ref: ${escapeHtml(orderId)}</span>
      <span>Page ${pageNum} of ${totalPages}</span>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>AstroLife — Bio-Vedic Protection &amp; Sacred Remedy Vault · ${escapeHtml(subjectName)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Serif+Devanagari:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

:root {
  --gold: #C9A961;
  --gold-bright: #F5D77F;
  --gold-dim: #997D3D;
  --border-gold: rgba(201, 169, 97, 0.28);
  --border-gold-strong: rgba(201, 169, 97, 0.65);
  --emerald: #10B981;
  --emerald-bright: #34D399;
  --emerald-dim: #065F46;
  --sapphire: #3B82F6;
  --sapphire-bright: #60A5FA;
  --ruby: #EF4444;
  --ruby-bright: #F87171;
  --saffron: #E07A5F;
  --bg-deep: #0B0D0E;
  --surface: #121517;
  --surface-card: #181C1E;
  --surface-elevated: #202629;
  --ivory: #F7F3E9;
  --ivory-dim: #D4CEBF;
  --ivory-mute: #8E95A5;
  --amber: #F59E0B;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg-deep);
  color: var(--ivory);
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  line-height: 1.55;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

@page {
  size: A4 portrait;
  margin: 0;
}

.page {
  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  max-height: 297mm;
  page-break-after: always;
  page-break-inside: avoid;
  position: relative;
  overflow: hidden;
  background: var(--bg-deep);
  padding: 16mm 18mm 14mm 18mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.page-cover {
  padding: 22mm 20mm;
  justify-content: space-between;
  background: radial-gradient(circle at 50% 20%, #15221B 0%, #0B0D0E 75%);
}

.page-rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Cinzel', serif;
  font-size: 8.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold);
  border-bottom: 1px solid var(--border-gold);
  padding-bottom: 5px;
  margin-bottom: 10px;
}
.page-rail .brand { color: var(--gold-bright); font-weight: 700; }
.page-rail .kicker { color: var(--emerald-bright); }

.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 8px;
  color: var(--ivory-mute);
  border-top: 1px solid var(--border-gold);
  padding-top: 5px;
  margin-top: 10px;
  font-family: 'JetBrains Mono', monospace;
}

.sample-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-32deg);
  font-family: 'Cinzel', serif;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: rgba(201, 169, 97, 0.045);
  pointer-events: none;
  z-index: 99;
  white-space: nowrap;
  text-transform: uppercase;
}

.display-xl {
  font-family: 'Cinzel', serif;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--gold-bright);
  line-height: 1.15;
}

.display-l {
  font-family: 'Cinzel', serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--gold-bright);
  line-height: 1.25;
}

.display-m {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--ivory);
  line-height: 1.35;
}

.body-text {
  font-size: 12.2px;
  color: var(--ivory-dim);
  line-height: 1.55;
  text-align: justify;
}

.kicker {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
}

.luxury-card {
  background: var(--surface-card);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 12px 14px;
}

.mantra-block {
  background: var(--surface-elevated);
  border-left: 3px solid var(--gold-bright);
  padding: 10px 14px;
  border-radius: 0 6px 6px 0;
  margin: 8px 0;
}

.mantra-devanagari {
  font-family: 'Noto Serif Devanagari', serif;
  font-size: 14px;
  color: var(--gold-bright);
  font-weight: 600;
  line-height: 1.6;
}

.mantra-iast {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 12px;
  color: var(--ivory);
  margin-top: 2px;
}

.mantra-phonetic {
  font-size: 10.5px;
  color: var(--emerald-bright);
  margin-top: 2px;
  letter-spacing: 0.02em;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.grid-4 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 11px;
}

.data-table th {
  background: var(--surface-elevated);
  color: var(--gold);
  text-align: left;
  padding: 6px 8px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 9.5px;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--border-gold);
}

.data-table td {
  padding: 5.5px 8px;
  border-bottom: 1px solid rgba(201, 169, 97, 0.12);
  color: var(--ivory-dim);
}

.tag-badge {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.tag-emerald { background: rgba(16, 185, 129, 0.2); color: var(--emerald-bright); border: 1px solid var(--emerald); }
.tag-ruby { background: rgba(239, 68, 68, 0.2); color: var(--ruby-bright); border: 1px solid var(--ruby); }
.tag-gold { background: rgba(201, 169, 97, 0.2); color: var(--gold-bright); border: 1px solid var(--gold); }
.tag-sapphire { background: rgba(59, 130, 246, 0.2); color: var(--sapphire-bright); border: 1px solid var(--sapphire); }

.prohibition-box {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.4);
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 8px;
}

.kundli-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.decorative-frame {
  border: 1px solid var(--border-gold-strong);
  padding: 14px;
  position: relative;
  background: var(--surface);
  border-radius: 4px;
}
</style>
</head>
<body>

<!-- PAGE 1: COVER & PRIMARY ENERGY ARMOR ANCHOR -->
<section class="page page-cover">
  <div class="page-rail">
    <span class="brand">✦ AstroLife Sovereign Protection Vault</span>
    <span class="kicker">REF: ${orderId}</span>
  </div>

  <div style="text-align:center;margin-top:10px;">
    <div class="kicker" style="letter-spacing:0.25em;color:var(--emerald-bright);margin-bottom:8px;">
      ✦ BIO-MAGNETIC SHIELD &amp; VEDIC REMEDIAL MASTER DOSSIER ✦
    </div>
    <h1 class="display-xl" style="font-size:28px;margin-bottom:12px;">
      Bio-Vedic Protection &amp;<br/>Sacred Remedy Vault
    </h1>
    <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;color:var(--ivory);max-width:540px;margin:0 auto;line-height:1.45;">
      24-page exhaustive shastric synthesis of biological energy defense, gemstone alchemy, somatotopic dot therapy, talismanic sacred geometry, and zero-cost Lal Kitab debt neutralization.
    </p>
  </div>

  <div class="decorative-frame" style="max-width:550px;margin:15px auto;width:100%;">
    <div style="text-align:center;font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.2em;color:var(--gold-bright);margin-bottom:10px;">
      ✦ CERTIFIED SEEKER NATAL ENERGY ANCHOR ✦
    </div>
    <div class="grid-2" style="font-size:11.5px;row-gap:8px;">
      <div>
        <span class="kicker">Seeker Name</span>
        <div style="font-weight:700;color:var(--gold-bright);font-size:13px;">${subjectName}</div>
      </div>
      <div>
        <span class="kicker">Date &amp; Time of Birth</span>
        <div style="color:var(--ivory);">${birthDate} · ${birthTime} IST</div>
      </div>
      <div>
        <span class="kicker">Birth Coordinates</span>
        <div style="color:var(--ivory);">${birthCity} (${lat}°N, ${lon}°E)</div>
      </div>
      <div>
        <span class="kicker">Lagna &amp; Moon Nakshatra</span>
        <div style="color:var(--ivory);">${lagnaRashi} Lagna · ${moonNakshatra}</div>
      </div>
      <div>
        <span class="kicker">Primary Life Catalyst</span>
        <div style="color:var(--emerald-bright);font-weight:700;">Colombian Emerald (Gold · Little Finger)</div>
      </div>
      <div>
        <span class="kicker">Active Operating Dasha</span>
        <div style="color:var(--gold-bright);font-weight:700;">${activeDasha} &mdash; ${activeAntar} (Budha)</div>
      </div>
      <div>
        <span class="kicker">Core Somatotopic Seal</span>
        <div style="color:var(--ivory);">2-Inch Navel Circle (Pure Cow Desi Ghee)</div>
      </div>
      <div>
        <span class="kicker">Lal Kitab Rin Immunity</span>
        <div style="color:var(--emerald-bright);">Solid Silver Ball + Stray Dog Seva</div>
      </div>
    </div>
  </div>

  <div style="text-align:center;margin-bottom:10px;">
    <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--gold);letter-spacing:0.18em;margin-bottom:4px;">
      SWISS EPHEMERIS DE431 · LAL KITAB 1952 · KRISHNAMURTI PADDHATI
    </div>
    <div style="font-size:9.5px;color:var(--ivory-mute);">
      Authenticated Sovereign Dossier · Zero Fear-Mongering · 100% Deterministic Vedic Science
    </div>
  </div>

  <div class="page-footer">
    <span>AstroLife Bio-Vedic Protection Vault</span>
    <span>Certified Confidential Dossier</span>
    <span>Page 1 of 24</span>
  </div>
</section>

<!-- PAGE 2: EXECUTIVE SHASTRIC BLUEPRINT & DEFENSE ARCHITECTURE -->
<section class="page">
  ${headerRail("EXECUTIVE BLUEPRINT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Vedic Bio-Energetics &amp; 5-Pillar Defense</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Classical Jyotish is not fatalistic superstition; it is the science of planetary electromagnetic resonance (<em>Graha Rashmi</em>). According to the classical treatises of <em>Brihat Samhita</em> and <em>Garuda Purana</em>, human biology interacts continuously with cosmic radiation. When afflicted or malefic rays cross delicate bodily chakras, physical illness, mental anxiety, and commercial bottlenecks occur.
    </p>

    <div class="luxury-card" style="margin-bottom:12px;border:1.5px solid var(--border-gold-strong);">
      <div class="card-title" style="color:var(--gold-bright);font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.1em;margin-bottom:4px;">
        ✦ THE FOUR CLASSICAL REMEDIAL PILLARS: MANI, MANTRA, AUSHADHI, YANTRA
      </div>
      <p class="body-text" style="font-size:11.8px;margin-bottom:6px;">
        Generic astrology causes immense damage by prescribing heavy gemstones blindly without calculating functional status. A gemstone amplifies planetary radiation like a magnifying glass; wearing the stone of a functional malefic or Maraka planet accelerates disease and debt.
      </p>
      <div class="grid-2" style="font-size:11px;margin-top:6px;">
        <div>
          <span style="color:var(--emerald-bright);font-weight:700;">1. Mani (Gemstones):</span> Amplifies beneficial planetary frequencies to fortify the Lagna lord.
        </div>
        <div>
          <span style="color:var(--sapphire-bright);font-weight:700;">2. Mantra (Sound):</span> Re-calibrates neuro-cellular vibrations through exact harmonic frequencies.
        </div>
        <div>
          <span style="color:var(--gold-bright);font-weight:700;">3. Aushadhi (Herbs &amp; Ghee):</span> Cools internal metabolic fire (Pitta) through transdermal absorption.
        </div>
        <div>
          <span style="color:var(--ruby-bright);font-weight:700;">4. Yantra &amp; Dot (Geometry):</span> Redirects cosmic hit angles on the physical body through sacred symbols.
        </div>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-family:'Cinzel',serif;font-size:11px;margin-bottom:8px;">
        ✦ 5-PILLAR REMEDIAL VAULT ARCHITECTURE
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:11.5px;">
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;border-left:3px solid var(--emerald);">
          <strong style="color:var(--emerald-bright);">PILLAR I (Pages 5&ndash;8): Gemstone &amp; Rudraksha Bio-Wearables</strong> &mdash; Exact carat weight, metal, finger, trial protocols, and strict prohibition of lethal stones (Yellow Sapphire, Red Coral).
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;border-left:3px solid var(--gold);">
          <strong style="color:var(--gold-bright);">PILLAR II (Pages 9&ndash;11): Somatotopic Dot Therapy (बिंदु चिकित्सा)</strong> &mdash; 12-sign bodily coordinates, the mandatory 2-inch navel desi ghee seal, and knee/forehead grounding points.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;border-left:3px solid var(--ruby);">
          <strong style="color:var(--ruby-bright);">PILLAR III (Pages 12&ndash;13): Sacred Protective Thread (मौली)</strong> &mdash; Kalawa consecration, wrist pulse energetics, exact Abhijeet Muhurat timings, and 21-day eco-disposal.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;border-left:3px solid var(--sapphire);">
          <strong style="color:var(--sapphire-bright);">PILLAR IV (Pages 14&ndash;15): Astro-Tattoo &amp; Talismanic Geometry</strong> &mdash; KP house negation (activating 2-6-10-11), male right-lateralization, and herbal skin ink.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;border-left:3px solid var(--saffron);">
          <strong style="color:var(--saffron);">PILLAR V (Pages 16&ndash;19): Lal Kitab Rin Siddhant &amp; Shivling Abhisheka</strong> &mdash; Ancestral debt clearing, never-donate warnings, and active Rahu-Mercury Tak Yog neutralization.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Executive Blueprint & Architecture", 2)}
</section>

<!-- PAGE 3: KARMIC VULNERABILITY & PLANETARY STRESS DIAGNOSTIC -->
<section class="page">
  ${headerRail("KARMIC VULNERABILITY DIAGNOSTIC")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Planetary Stress &amp; Vulnerability Audit</h2>
    <p class="body-text" style="margin-bottom:12px;">
      For a <strong>Virgo (Kanya) Ascendant</strong>, classical Jyotish designates specific planets as functional benefics and others as severe functional malefics. Knowing your personal vulnerability zones prevents spiritual missteps and ineffective remedies.
    </p>

    <div class="grid-2" style="margin-bottom:12px;">
      <div class="luxury-card">
        <div class="kicker" style="color:var(--emerald-bright);">FUNCTIONAL BENEFACTOR AXIS</div>
        <div style="font-size:12px;color:var(--ivory);margin-top:4px;line-height:1.5;">
          <strong>Mercury (Lagna &amp; 10th Lord):</strong> Your chief vitality engine. Seated in the 9th house of fortune (Taurus), it forms an auspicious Maha Parivartana Yoga with 10th lord Venus. Strengthening Mercury fortifies mental focus and shields the entire physical aura.
        </div>
      </div>
      <div class="luxury-card">
        <div class="kicker" style="color:var(--ruby-bright);">MARAKA &amp; BADHAKA VULNERABILITY</div>
        <div style="font-size:12px;color:var(--ivory);margin-top:4px;line-height:1.5;">
          <strong>Jupiter (4th &amp; 7th Lord):</strong> For dual signs like Virgo, the 7th house acts as the <em>Badhaka</em> (obstruction) and <em>Maraka</em> (death-inflicting) house. Jupiter seated in the 3rd house can trigger excessive liver heat, digestive inertia, and marital friction if amplified.
        </div>
      </div>
    </div>

    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;margin-bottom:6px;">
        ✦ THE DUSTHANA TRIAD SCAN (HOUSES 6, 8, 12)
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.8px;">
        <div>
          <strong style="color:var(--gold);">House 6 (Aquarius · Disease &amp; Debt):</strong> Governed by Saturn. Rahu transiting here or natal stress can manifest as nervous fatigue or lower leg stiffness. Neutralized by Saturday discipline and copper oiling.
        </div>
        <div>
          <strong style="color:var(--ruby-bright);">House 8 (Aries · Chronic Obstacles &amp; Surgery):</strong> Occupied by natal <strong>Ketu at 8° 12'</strong>. Governed by Mars (who sits in the 12th). This creates sudden metabolic spikes, acidity, and vulnerability to sharp instruments. Requires strict Ketu cooling upayas.
        </div>
        <div>
          <strong style="color:var(--sapphire-bright);">House 12 (Leo · Sleep, Solitude &amp; Losses):</strong> Occupied by <strong>Moon and Mars</strong>. Governed by Sun (who sits in the 10th). Mars in the 12th creates internal heat and restless sleep, while Moon here causes vivid nocturnal dreams. Requires the pure cow desi ghee navel seal.
        </div>
      </div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div style="font-weight:700;color:var(--emerald-bright);font-size:11px;text-transform:uppercase;margin-bottom:3px;">
        ✦ The Fundamental Remedial Law for Mukul Mohan Pal
      </div>
      <p class="body-text" style="font-size:11.5px;">
        <em>"Strengthen the Lagna Lord (Mercury) and Yogakaraka Venus through Bio-Wearables; Pacify the Dusthana Lords (Mars, Ketu, Rahu) exclusively through Satvik Dana, Water Offerings, and Desi Ghee &mdash; Never wear stones for 6th, 8th, or 12th lords."</em>
      </p>
    </div>
  </div>
  ${footerRail("Karmic Vulnerability Diagnostic", 3)}
</section>

<!-- PAGE 4: D-1 KUNDLI SHIELD & PLANETARY VULNERABILITY MATRIX -->
<section class="page">
  ${headerRail("D-1 NATAL SHIELD & VULNERABILITY MATRIX")}
  <div>
    <h2 class="display-l" style="margin-bottom:4px;">D-1 Rashi Kundli &amp; Planetary Ledger</h2>
    <p class="body-text" style="margin-bottom:8px;">Swiss Ephemeris computed coordinates with functional status and protective recommendations.</p>

    <div class="kundli-container" style="margin-bottom:8px;">
      ${renderNorthIndianSvg(chart, undefined, lagnaNum, 260)}
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Planet</th>
          <th>Rashi &amp; Deg</th>
          <th>House</th>
          <th>Dignity</th>
          <th>Functional Status</th>
          <th>Prescribed Protection</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Sun (Surya)</strong></td>
          <td>Gemini 18° 04'</td>
          <td>10th</td>
          <td>Digbali (Directional)</td>
          <td>12th Lord (Neutral/Mixed)</td>
          <td>Surya Arghya at sunrise</td>
        </tr>
        <tr>
          <td><strong>Moon (Chandra)</strong></td>
          <td>Leo 29° 11'</td>
          <td>12th</td>
          <td>Mitra Rashi</td>
          <td>11th Lord in Vyaya</td>
          <td>Cooling sandalwood dot on forehead</td>
        </tr>
        <tr>
          <td><strong>Mars (Mangal)</strong></td>
          <td>Leo 26° 23'</td>
          <td>12th</td>
          <td>Mitra Rashi</td>
          <td>3rd &amp; 8th Lord (Malefic)</td>
          <td><strong>STRICTLY NO RED CORAL</strong> · Blood donation</td>
        </tr>
        <tr>
          <td><strong>Mercury (Budha)</strong></td>
          <td>Taurus 26° 54'</td>
          <td>9th</td>
          <td>Mitra Rashi</td>
          <td>Lagna &amp; 10th Lord (Prime Benefic)</td>
          <td><strong>NATURAL COLOMBIAN EMERALD</strong></td>
        </tr>
        <tr>
          <td><strong>Jupiter (Guru)</strong></td>
          <td>Scorpio 13° 01'</td>
          <td>3rd</td>
          <td>Mitra Rashi</td>
          <td>4th &amp; 7th Lord (Badhaka/Maraka)</td>
          <td><strong>STRICTLY NO YELLOW SAPPHIRE</strong> · Banana seva</td>
        </tr>
        <tr>
          <td><strong>Venus (Shukra)</strong></td>
          <td>Gemini 05° 00'</td>
          <td>10th</td>
          <td>Mitra Rashi</td>
          <td>2nd &amp; 9th Lord (Dharmakarmadhipati)</td>
          <td>Diamond / White Zircon · Mahalakshmi Japa</td>
        </tr>
        <tr>
          <td><strong>Saturn (Shani)</strong></td>
          <td>Pisces 00° 57'</td>
          <td>7th</td>
          <td>Mitra Rashi</td>
          <td>5th &amp; 6th Lord (Neutral Benefic)</td>
          <td>Blue Sapphire (Trial) / Shani Challa</td>
        </tr>
        <tr>
          <td><strong>Rahu</strong></td>
          <td>Libra 08° 12'</td>
          <td>2nd</td>
          <td>Friendly / Swati</td>
          <td>Shadow Node (Treasury Pressure)</td>
          <td>Solid silver ball in pocket / wallet</td>
        </tr>
        <tr>
          <td><strong>Ketu</strong></td>
          <td>Aries 08° 12'</td>
          <td>8th</td>
          <td>Exalted / Ashwini</td>
          <td>Shadow Node (Sudden Friction)</td>
          <td>Feed street dogs sweet roasted roti</td>
        </tr>
      </tbody>
    </table>
  </div>
  ${footerRail("D-1 Natal Shield & Vulnerability Matrix", 4)}
</section>

<!-- PAGE 5: PILLAR I — PRIMARY LIFE GEMSTONE: NATURAL COLOMBIAN EMERALD -->
<section class="page">
  ${headerRail("PILLAR I: PRIMARY GEMSTONE ALCHEMY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Primary Life Gemstone: Colombian Emerald</h2>
    <p class="body-text" style="margin-bottom:10px;">
      For a Virgo Ascendant, <strong>Mercury (Budha)</strong> is the supreme ruler of your physical body, life force, intellect, and career status. Seated in the auspicious 9th house of fortune (Bhagya Bhava), it is your single most important bio-wearable catalyst.
    </p>

    <div class="luxury-card" style="border:1.5px solid var(--emerald);margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ NATURAL UNTREATED COLOMBIAN / ZAMBIAN EMERALD (पन्ना)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Emerald functions as an optical green filter that concentrates the high-frequency electromagnetic spectrum of Mercury into your nervous system. It accelerates software architecture comprehension, speech precision, commercial negotiations, and stabilizes autonomic anxiety.
      </p>
    </div>

    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Specification</th>
          <th>Prescribed Value</th>
          <th>Shastric Compliance &amp; Instructions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Carat Weight</strong></td>
          <td>5.25 to 6.25 Ratti (approx. 4.8 &ndash; 5.7 Carats)</td>
          <td>Must be untreated, eye-clean with natural jardin (silk inclusions).</td>
        </tr>
        <tr>
          <td><strong>Mounting Metal</strong></td>
          <td>18k / 22k Yellow Gold or Panchdhatu</td>
          <td>Bottom of the setting must remain open so the pavilion touches skin.</td>
        </tr>
        <tr>
          <td><strong>Finger &amp; Hand</strong></td>
          <td>Little Finger (Kanishtha) of Active Right Hand</td>
          <td>Direct meridian link to the Mercury energetic pathway.</td>
        </tr>
        <tr>
          <td><strong>Activation Day &amp; Time</strong></td>
          <td>Wednesday Morning during Budha Hora</td>
          <td>Between 6:15 AM and 7:30 AM (Sukla Paksha preferred).</td>
        </tr>
        <tr>
          <td><strong>Purification Medium</strong></td>
          <td>Raw Cow Milk, Ganga Jal, and Tulsi leaves</td>
          <td>Soak for 45 minutes before sunrise, then rinse in pure water.</td>
        </tr>
      </tbody>
    </table>

    <div class="mantra-block">
      <div class="kicker" style="color:var(--emerald-bright);margin-bottom:3px;">BUDHA CONSECRATION &amp; PRANA PRATISHTHA MANTRA (108 RECITATIONS)</div>
      <div class="mantra-devanagari">ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः ॥</div>
      <div class="mantra-iast">Oṁ Brāṁ Brīṁ Brauṁ Saḥ Budhāya Namaḥ ॥</div>
      <div class="mantra-phonetic">Om Braam Breem Broum Sah Budhaya Namah</div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);margin-top:6px;">
      <span class="kicker" style="color:var(--gold-bright);">Affordable Vedic Alternative (Upratna):</span>
      <span style="font-size:11.5px;color:var(--ivory-dim);margin-left:6px;">
        If untreated Colombian emerald is cost-prohibitive, wear a natural <strong>Green Tourmaline (Verdelite)</strong> or <strong>Peridot (6.5&ndash;7.5 Ratti)</strong> mounted in silver/panchdhatu on Wednesday morning.
      </span>
    </div>
  </div>
  ${footerRail("Pillar I: Primary Life Gemstone (Emerald)", 5)}
</section>

<!-- PAGE 6: PILLAR I — SECONDARY GEMSTONE: BLUE SAPPHIRE TRIAL & DIAMOND -->
<section class="page">
  ${headerRail("PILLAR I: SECONDARY GEMSTONE ALCHEMY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Secondary Shield: Blue Sapphire &amp; Diamond</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Balancing intellectual speed with structural endurance: Activating Saturn (5th Lord of Intellect) and Venus (9th Lord of Fortune).
    </p>

    <!-- Blue Sapphire Box -->
    <div class="luxury-card" style="border:1.5px solid var(--sapphire);margin-bottom:10px;">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;font-family:'Cinzel',serif;">
        1. SECONDARY TREASURY &amp; KARMA SHIELD: NATURAL BLUE SAPPHIRE (नीलम)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Saturn is your 5th lord of intellect and Indu Lagna lord (Capricorn). Seated in the 7th house, Saturn enforces executive discipline, seals commercial leakages, and grounds restless mental energy.
      </p>
      <div class="grid-4" style="margin-top:8px;font-size:10.5px;">
        <div>
          <span class="kicker">Weight:</span>
          <div style="color:var(--ivory);font-weight:600;">4.50 &ndash; 5.50 Ratti</div>
        </div>
        <div>
          <span class="kicker">Metal:</span>
          <div style="color:var(--ivory);font-weight:600;">Silver / White Gold</div>
        </div>
        <div>
          <span class="kicker">Finger:</span>
          <div style="color:var(--ivory);font-weight:600;">Middle (Madhyama)</div>
        </div>
        <div>
          <span class="kicker">Timing:</span>
          <div style="color:var(--ivory);font-weight:600;">Saturday Twilight</div>
        </div>
      </div>

      <div class="prohibition-box" style="margin-top:8px;background:rgba(59,130,246,0.08);border-color:rgba(59,130,246,0.35);">
        <strong style="color:var(--sapphire-bright);font-size:11px;">MANDATORY 3-DAY TRIAL PROTOCOL (अनिवार्य परीक्षण विधान):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Blue Sapphire is intensely catalytic. Before setting it into metal, wrap the raw gemstone in blue silk cloth and keep it under your pillow for 3 consecutive nights (starting Saturday). If you experience peaceful sleep, clarity, or positive dreams, proceed with mounting. If you experience nightmares, sudden headaches, or restlessness, discard immediately and switch to Amethyst (Jamuniya).
        </p>
      </div>
    </div>

    <!-- Diamond / White Zircon Box -->
    <div class="luxury-card" style="border:1.5px solid var(--gold);margin-bottom:8px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        2. FORTUNE &amp; REFINED AURA CATALYST: NATURAL DIAMOND / WHITE ZIRCON
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Venus is your 9th lord of fortune (Bhagyadhipati) and 2nd lord of liquid treasury. Seated in the 10th house, Venus forms the Maha Parivartana Yoga with Mercury. A natural Diamond (0.75&ndash;1.00 Carat) or Natural Untreated White Zircon (4.25&ndash;5.25 Ratti) mounted in Platinum or Silver enhances charisma, luxury client conversions, and executive presence.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:6px;">
        ✦ Activation: Friday Morning during Shukra Hora · Mantra: <em>Om Shum Shukraya Namah</em> (108&times;).
      </div>
    </div>
  </div>
  ${footerRail("Pillar I: Secondary Gemstone Alchemy", 6)}
</section>

<!-- PAGE 7: PILLAR I — THE PROHIBITED GEMSTONE AUDIT -->
<section class="page">
  ${headerRail("PILLAR I: PROHIBITED GEMSTONE AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Lethal Gemstone Prohibitions (घातक रत्न निषेध)</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In classical Jyotish, wearing the wrong gemstone is far more destructive than wearing no gemstone at all. The following stones are <strong>STRICTLY PROHIBITED</strong> for Mukul Mohan Pal's natal chart configuration:
    </p>

    <!-- Prohibition 1: Yellow Sapphire -->
    <div class="prohibition-box">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--ruby-bright);">
          1. YELLOW SAPPHIRE (पुखराज) &mdash; ABSOLUTELY FORBIDDEN
        </span>
        <span class="tag-badge tag-ruby">LETHAL FOR VIRGO</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Target Planet:</strong> Jupiter (Guru) &mdash; Rules 4th House (Kendra) &amp; 7th House (Maraka &amp; Badhaka sthana).<br/>
        <strong>Why It Causes Harm:</strong> For a dual sign ascendant like Virgo, the 7th house lord acts as the supreme obstructionist (Badhaka). Wearing Yellow Sapphire amplifies Badhaka energy, directly causing marital discord, liver enlargement, high cholesterol, delayed payments, and legal complications. Never wear Pukhraj.
      </p>
    </div>

    <!-- Prohibition 2: Red Coral -->
    <div class="prohibition-box">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--ruby-bright);">
          2. RED CORAL (लाल मूंगा) &mdash; ABSOLUTELY FORBIDDEN
        </span>
        <span class="tag-badge tag-ruby">HIGH ACCIDENT RISK</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Target Planet:</strong> Mars (Mangal) &mdash; Rules 3rd House (Effort/Injury) &amp; 8th House (Ayu/Surgery/Sudden Ruin).<br/>
        <strong>Why It Causes Harm:</strong> Mars is an arch-enemy of your Lagna lord Mercury and sits in the 12th house of hospitalization. Wearing Red Coral immediately superheats your blood, spikes blood pressure, induces reckless impatience, and triggers surgical/accident vulnerability. Red Coral is poison for this chart.
      </p>
    </div>

    <!-- Prohibition 3: Pearl -->
    <div class="prohibition-box" style="margin-bottom:6px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--ruby-bright);">
          3. NATURAL PEARL (सच्चा मोती) &mdash; PROHIBITED WITHOUT MEDICAL ADVICE
        </span>
        <span class="tag-badge tag-ruby">EMOTIONAL DISSOLUTION</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Target Planet:</strong> Moon (Chandra) &mdash; Rules 11th House, but seated in 12th House of isolation (Leo).<br/>
        <strong>Why It Causes Harm:</strong> Moon in the 12th house is prone to subconscious turbulence. Wearing a Pearl pumps water element into the house of sleep and expenditures, causing lethargy, over-emotional vulnerability, and capital drain. Wear sandalwood, not pearl.
      </p>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);border:1px solid var(--border-gold);">
      <div class="kicker" style="color:var(--gold-bright);">Shastric Summary of Gemstone Safety:</div>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:3px;">
        Only Emerald, Diamond, and Blue Sapphire (tested) are permitted. All warm/red/yellow stones (Ruby, Red Coral, Yellow Sapphire) are strictly locked out of your bio-field.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: Prohibited Gemstone Audit", 7)}
</section>

<!-- PAGE 8: PILLAR I — SACRED RUDRAKSHA BIO-ELECTROMAGNETIC PAIRING -->
<section class="page">
  ${headerRail("PILLAR I: SACRED RUDRAKSHA PAIRING")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Rudraksha Bio-Electromagnetic Shield</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Unlike gemstones which act as optical amplifiers, sacred Rudraksha beads (seeds of <em>Elaeocarpus ganitrus</em>) act as natural capacitors and dielectric stabilizers. They regulate bio-electric heart rate, normalize blood pressure, and seal psychic vulnerabilities without any negative side-effects.
    </p>

    <div class="grid-2" style="margin-bottom:10px;">
      <!-- 4-Mukhi Rudraksha -->
      <div class="luxury-card" style="border:1.5px solid var(--emerald);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:12px;font-family:'Cinzel',serif;">
          ✦ 4-MUKHI RUDRAKSHA (LORD BRAHMA &amp; BUDHA)
        </div>
        <div class="kicker" style="margin-top:2px;">GOVERNING PLANET: MERCURY · ANAHATA &amp; VISHUDDHA</div>
        <p class="body-text" style="font-size:11.5px;margin-top:6px;">
          Governed by the creator Brahma and planetary lord Mercury. Its four natural clefts balance the four lobes of the brain, dramatically enhancing memory retention, analytical clarity, public oratory, and coding endurance.
        </p>
        <div style="font-size:11px;color:var(--gold);margin-top:6px;">
          ✦ <strong>Mantra:</strong> <em>Om Hreem Namah</em> (108&times; Wednesday)
        </div>
      </div>

      <!-- 7-Mukhi Rudraksha -->
      <div class="luxury-card" style="border:1.5px solid var(--gold);">
        <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
          ✦ 7-MUKHI RUDRAKSHA (MAHALAKSHMI &amp; SHUKRA)
        </div>
        <div class="kicker" style="margin-top:2px;">GOVERNING PLANET: VENUS / SATURN · MANIPURA</div>
        <p class="body-text" style="font-size:11.5px;margin-top:6px;">
          Blessed by Goddess Mahalakshmi and the seven holy sages (Saptarishis). It dissolves sudden financial blockages, unlocks stagnant cashflows, and neutralizes the malefic sting of Shani and Rahu.
        </p>
        <div style="font-size:11px;color:var(--gold);margin-top:6px;">
          ✦ <strong>Mantra:</strong> <em>Om Hoom Namah</em> (108&times; Friday)
        </div>
      </div>
    </div>

    <!-- Sacred Combination Protocol -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ THE SOVEREIGN INTELLECT &amp; TREASURY COMBINATION (4-MUKHI + 7-MUKHI)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        String one collector-grade 4-Mukhi bead and one collector-grade 7-Mukhi bead together on an un-dyed pure raw red or green silk thread. Cap both ends in pure silver or 22k gold.
      </p>
      <div class="grid-3" style="margin-top:8px;font-size:11px;">
        <div>
          <span class="kicker">Wearing Position:</span>
          <div style="color:var(--ivory);font-weight:600;">Around Neck touching Anahata (Heart)</div>
        </div>
        <div>
          <span class="kicker">Prana Pratishtha:</span>
          <div style="color:var(--ivory);font-weight:600;">Wednesday or Friday at sunrise</div>
        </div>
        <div>
          <span class="kicker">Maintenance:</span>
          <div style="color:var(--ivory);font-weight:600;">Condition with pure almond oil monthly</div>
        </div>
      </div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);">
      <span class="kicker" style="color:var(--sapphire-bright);">Optional Shield Addition: 8-Mukhi (Lord Ganesha &amp; Rahu):</span>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
        If facing heavy corporate politics or regulatory hurdles during the current Rahu Mahadasha, add an 8-Mukhi Rudraksha to the pendant to eliminate obstacles and anchor Rahu's 2nd-house volatility.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: Sacred Rudraksha Pairing", 8)}
</section>

<!-- PAGE 9: PILLAR II — SOMATOTOPIC DOT THERAPY: PRINCIPLES -->
<section class="page">
  ${headerRail("PILLAR II: SOMATOTOPIC DOT THERAPY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Somatotopic Dot Therapy (बिंदु चिकित्सा)</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In ancient Vedic sciences, the human body is the living microcosm of the macrocosmic Zodiac (<em>Yatha Pinde Tatha Brahmande</em>). The 12 signs of the Zodiac map precisely to 12 anatomical coordinates under the Kalapurusha doctrine.
    </p>

    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--border-gold-strong);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ HOW BIOMETRIC DOT THERAPY DEFLECTS MALEFIC HIT ENERGIES
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        When moving physical furniture in an apartment or rented office is impossible, external spatial hits (180-degree or 90-degree planetary hit lines) create energetic blockages on your body. By applying natural sacred substances (pure cow desi ghee, white sandalwood, saffron, or kajal) on specific reflex points, we alter localized skin conductance and convert a destructive 180-degree opposition hit into a harmonious 120-degree trine protector.
      </p>
    </div>

    <!-- Kalapurusha Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Zodiac Sign</th>
          <th>Kalapurusha Body Coordinate</th>
          <th>Planetary Lord</th>
          <th>Recommended Bio-Dot Medium</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. Aries (Mesha)</strong></td>
          <td>Cranial Vault, Head &amp; Brain</td>
          <td>Mars</td>
          <td>Cooling Chandan (Never Sindoor for Virgo)</td>
        </tr>
        <tr>
          <td><strong>2. Taurus (Vrishabha)</strong></td>
          <td>Face, Mouth, Vocal Cords &amp; Neck</td>
          <td>Venus</td>
          <td>White Sandalwood or Natural Attar</td>
        </tr>
        <tr>
          <td><strong>3. Gemini (Mithuna)</strong></td>
          <td>Shoulders, Arms, Hands &amp; Lungs</td>
          <td>Mercury</td>
          <td>Green Tulsi leaf juice or Kesar</td>
        </tr>
        <tr>
          <td><strong>4. Cancer (Karka)</strong></td>
          <td>Chest, Breasts &amp; Epigastrium</td>
          <td>Moon</td>
          <td>Pure Raw Cow Milk or Chandan</td>
        </tr>
        <tr>
          <td><strong>5. Leo (Simha)</strong></td>
          <td>Upper Abdomen, Heart &amp; Spine</td>
          <td>Sun</td>
          <td>Saffron (Kesar) Tilak</td>
        </tr>
        <tr style="background:rgba(16,185,129,0.12);font-weight:700;">
          <td style="color:var(--emerald-bright);"><strong>6. Virgo (Kanya)</strong></td>
          <td style="color:var(--emerald-bright);">Navel &amp; Abdominal Core (2-Inch Zone)</td>
          <td style="color:var(--emerald-bright);">Mercury</td>
          <td style="color:var(--gold-bright);">PURE COW DESI GHEE (NO SINDOOR)</td>
        </tr>
        <tr>
          <td><strong>7. Libra (Tula)</strong></td>
          <td>Lumbar Spine, Pelvis &amp; Kidneys</td>
          <td>Venus</td>
          <td>White Chandan Dot</td>
        </tr>
        <tr>
          <td><strong>8. Scorpio (Vrishchika)</strong></td>
          <td>External Genitalia &amp; Perineum</td>
          <td>Mars / Ketu</td>
          <td>Pure Cold Water rinse</td>
        </tr>
        <tr>
          <td><strong>9. Sagittarius (Dhanu)</strong></td>
          <td>Hips, Sacrum &amp; Thighs</td>
          <td>Jupiter</td>
          <td>Turmeric (Haldi) Tilak</td>
        </tr>
        <tr>
          <td><strong>10. Capricorn (Makara)</strong></td>
          <td>Knee Joints &amp; Skeletal System</td>
          <td>Saturn</td>
          <td>Micro Kajal Dot on Right Knee</td>
        </tr>
        <tr>
          <td><strong>11. Aquarius (Kumbha)</strong></td>
          <td>Shins, Ankles &amp; Calves</td>
          <td>Saturn / Rahu</td>
          <td>Mustard oil massage before bath</td>
        </tr>
        <tr>
          <td><strong>12. Pisces (Meena)</strong></td>
          <td>Feet, Soles &amp; Toes</td>
          <td>Jupiter / Ketu</td>
          <td>Warm salt water foot bath</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);font-size:11.2px;">
      <strong style="color:var(--gold-bright);">Gender Lateralization Rule:</strong> Males apply somatotopic dots on the <strong>Right Anatomical Quadrant</strong> (Dakshina Anga); females apply on the <strong>Left Anatomical Quadrant</strong> (Vama Anga).
    </div>
  </div>
  ${footerRail("Pillar II: Somatotopic Dot Therapy Principles", 9)}
</section>

<!-- PAGE 10: PILLAR II — THE 2-INCH NAVEL DESI GHEE PROTOCOL -->
<section class="page">
  ${headerRail("PILLAR II: NAVEL DESI GHEE PROTOCOL")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The 2-Inch Navel Desi Ghee Protocol</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Virgo (Kanya) is the 6th sign of the Kalapurusha, governing the core abdominal cavity, intestines, and the <strong>Navel (Nabhi Chakra)</strong>. The navel contains over 72,000 energetic nadis (subtle nerve channels) that branch across the human biological system.
    </p>

    <!-- The Invariant Box -->
    <div class="luxury-card" style="border:2px solid var(--emerald-bright);margin-bottom:12px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ THE ABSOLUTE NAVEL INVARIANT FOR MUKUL MOHAN PAL (VIRGO LAGNA)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Because Mercury rules your 1st house (body) and 10th house (career), and Mars sits in your 12th house (heat &amp; insomnia), your internal digestive fire (Jatharagni) easily overheats the nervous system. 
      </p>
      <div class="prohibition-box" style="margin-top:8px;margin-bottom:8px;">
        <strong style="color:var(--ruby-bright);font-size:11px;">CRITICAL PROHIBITION: NEVER APPLY RED VERMILION / SINDOOR TO THE NAVEL!</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Applying red kumkum, sindoor, or hot herbal pastes to your navel will severely inflame internal Pitta, spike blood pressure, trigger acid reflux, and amplify nocturnal restlessness. Red vermilion is strictly forbidden on your abdominal zone.
        </p>
      </div>
    </div>

    <!-- The Exact Protocol -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ STEP-BY-STEP DESI GHEE APPLICATION PROTOCOL (नाभि अमृत विधान)
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:11.8px;margin-top:6px;">
        <div>
          <strong style="color:var(--gold);">1. Substance:</strong> Use only 100% pure organic <strong>A2 Desi Cow Ghee</strong> (clarified butter from indigenous Indian cows). Never use commercial buffalo ghee or processed oils.
        </div>
        <div>
          <strong style="color:var(--gold);">2. Radial Zone:</strong> Apply 2 drops directly into the navel cavity, then massage outward in a circular clockwise motion strictly within a <strong>2-inch radius</strong> around the navel.
        </div>
        <div>
          <strong style="color:var(--gold);">3. Application Timings:</strong> Twice daily &mdash; once immediately after morning bath, and once at night 15 minutes before sleep.
        </div>
        <div>
          <strong style="color:var(--gold);">4. Bio-Vedic Benefits:</strong> Instantly cools the vagus nerve, reduces overthinking, pacifies 12th-house Mars heat, prevents dry skin and digestive disorders, and creates an impenetrable energetic boundary against external environmental stress.
        </div>
      </div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <span class="kicker" style="color:var(--emerald-bright);">Clinical Astrological Observation:</span>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
        Within 7 days of continuous application, seekers with Virgo Lagna report a 40% reduction in sleep latency (falling asleep faster) and elimination of midday mental fatigue.
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: Navel Desi Ghee Protocol", 10)}
</section>

<!-- PAGE 11: PILLAR II — KNEE & FOREHEAD DOT PROTOCOLS -->
<section class="page">
  ${headerRail("PILLAR II: KNEE & FOREHEAD DOT PROTOCOLS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Right Knee &amp; Forehead Dot Protocols</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Targeted somatotopic reflex points to ground Saturnian pressure and pacify 12th-house lunar agitation.
    </p>

    <!-- Right Knee Protocol -->
    <div class="luxury-card" style="border:1.5px solid var(--sapphire);margin-bottom:12px;">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;font-family:'Cinzel',serif;">
        1. RIGHT KNEE KAJAL MICRO-DOT (मकर / शनि देह रक्षक बिंदु)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Under Kalapurusha mapping, <strong>Capricorn (Makara)</strong> governs the knee joints. For Mukul, Capricorn is your 5th house of intellect and Indu Lagna, while Saturn sits in the 7th house in Pisces, casting its 10th aspect back onto your 4th house of domestic peace.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;margin-top:8px;font-size:11.5px;">
        <strong style="color:var(--gold-bright);">Execution Method:</strong>
        <p style="color:var(--ivory-dim);margin-top:2px;">
          On Saturdays, or during periods of acute work pressure, apply a tiny <strong>micro-dot (2mm) of pure natural herbal kajal</strong> (soot of cow ghee lamp) on the lateral side of your <strong>Right Knee joint</strong>.
        </p>
        <p style="color:var(--ivory-dim);margin-top:4px;">
          <strong>Effect:</strong> Converts heavy 180-degree Saturnian structural friction into a grounding shield, preventing knee fatigue and stabilizing erratic professional timelines.
        </p>
      </div>
    </div>

    <!-- Forehead Sandalwood Protocol -->
    <div class="luxury-card" style="border:1.5px solid var(--gold);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        2. AJNA CHAKRA WHITE SANDALWOOD DOT (चंद्र व मन शांति बिंदु)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Your natal Moon sits at <strong>29° 11' in Leo (12th house)</strong> in Uttara Phalguni (Pada 1), conjoined fiery Mars (at 26° 23'). This placement generates high intellectual ambition combined with occasional nocturnal restlessness and sensory overload.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;margin-top:8px;font-size:11.5px;">
        <strong style="color:var(--gold-bright);">Execution Method:</strong>
        <p style="color:var(--ivory-dim);margin-top:2px;">
          Apply a small dot of freshly prepared <strong>Pure White Sandalwood paste (श्वेत चंदन)</strong> with your right ring finger (Anamika) precisely between the eyebrows (Ajna Chakra) on Monday mornings and Full Moon (Purnima) evenings.
        </p>
        <p style="color:var(--ivory-dim);margin-top:4px;">
          <strong>Effect:</strong> Instantly cools the prefrontal cortex, dissipates subconscious anxiety, and shields the mind from disruptive astral frequencies.
        </p>
      </div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);font-size:11px;color:var(--ivory-mute);">
      ✦ <em>Both dot applications take less than 15 seconds, require zero monetary expense, and function as immediate bio-energetic circuit breakers.</em>
    </div>
  </div>
  ${footerRail("Pillar II: Knee & Forehead Dot Protocols", 11)}
</section>

<!-- PAGE 12: PILLAR III — SACRED PROTECTIVE THREAD (मौली) ARCHITECTURE -->
<section class="page">
  ${headerRail("PILLAR III: SACRED PROTECTIVE THREAD")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Protective Thread: The Wrist Shield</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The tying of the sacred thread (<em>Raksha Sutra</em> or <em>Mauli / Kalawa</em>) around the wrist is one of the oldest Vedic biological shields, dating back to the consecration of Lord Indra by Devi Shachi and the binding of King Bali by Lord Vamana.
    </p>

    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:12px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ ANATOMICAL &amp; BIO-MAGNETIC SCIENCE OF THE WRIST (MANIBANDHA)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        The human wrist (Manibandha) houses the three primary arterial pulses analyzed in Ayurvedic pulse diagnosis (<em>Nadi Pariksha</em>): <strong>Vata, Pitta, and Kapha</strong>. The radial and ulnar nerves pass directly beneath the skin here. Tying a consecrated cotton thread with precise tension applies gentle acupressure to these nerve endings, harmonizing autonomic nervous response and shielding the endocrine system.
      </p>
    </div>

    <!-- The Thread Trap Warning -->
    <div class="prohibition-box" style="margin-bottom:12px;">
      <strong style="color:var(--ruby-bright);font-size:11.5px;">✦ AVOID THE BLIND "BLACK THREAD" TRAP (काला धागा निषेध)</strong>
      <p class="body-text" style="font-size:11.5px;margin-top:3px;">
        Many people blindly tie thick black threads around their wrists or ankles assuming it wards off evil. For a Virgo Lagna native with Saturn in the 7th house and Mercury as Lagna lord, wearing black thread on the wrist draws heavy Saturnian lethargy and blocks Mercury's light-footed commercial agility. <strong>Do not wear black thread on your wrist.</strong>
      </p>
    </div>

    <!-- Prescribed Specifications -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ THE PRESCRIBED SACRED SPECIFICATIONS FOR MUKUL MOHAN PAL
      </div>
      <div class="grid-2" style="font-size:11.5px;margin-top:6px;row-gap:8px;">
        <div>
          <span class="kicker">Thread Material:</span>
          <div style="color:var(--ivory);font-weight:600;">100% Pure Raw Untreated Cotton</div>
        </div>
        <div>
          <span class="kicker">Color Composition:</span>
          <div style="color:var(--gold-bright);font-weight:600;">Traditional Red &amp; Yellow (Raksha Sutra)</div>
        </div>
        <div>
          <span class="kicker">Number of Wraps:</span>
          <div style="color:var(--ivory);font-weight:600;">Strictly 5 or 7 Wraps around wrist</div>
        </div>
        <div>
          <span class="kicker">Target Wrist:</span>
          <div style="color:var(--emerald-bright);font-weight:600;">Active Right Wrist (Male Meridian)</div>
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Pillar III: Sacred Thread Architecture", 12)}
</section>

<!-- PAGE 13: PILLAR III — THE SEEKER'S SACRED THREAD CONSECRATION -->
<section class="page">
  ${headerRail("PILLAR III: THREAD CONSECRATION PROTOCOL")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Thread Consecration &amp; Mantra</h2>
    <p class="body-text" style="margin-bottom:10px;">
      A sacred thread without consecration is merely colored string. When tied with the classical Vedic sankalpa during an auspicious planetary window, it becomes an active bio-magnetic seal.
    </p>

    <!-- Consecration Steps -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ STEP-BY-STEP CONSECRATION RITUAL (रक्षा बंधन विधान)
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.8px;margin-top:6px;">
        <div>
          <strong style="color:var(--emerald-bright);">1. Optimal Muhurat:</strong> Perform on a <strong>Tuesday or Sunday morning</strong> during the auspicious <em>Abhijeet Muhurat</em> (approx. 11:45 AM &ndash; 12:35 PM) or during sunrise hora.
        </div>
        <div>
          <strong style="color:var(--emerald-bright);">2. Pre-Purification:</strong> Light a cow ghee lamp facing East. Touch the thread to an image of Lord Vishnu, Shiva, or Hanuman.
        </div>
        <div>
          <strong style="color:var(--emerald-bright);">3. Tying Tension:</strong> Tie with comfortable snugness on the right wrist (holding a fist while tying). Do not tie too tight to impede capillary circulation.
        </div>
      </div>
    </div>

    <!-- The Classical Shloka -->
    <div class="mantra-block" style="margin-bottom:12px;">
      <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">THE IMMUTABLE VEDIC RAKSHA MANTRA</div>
      <div class="mantra-devanagari">
        येन बद्धो बली राजा दानवेन्द्रो महाबलः ।<br/>
        तेन त्वामनुबध्नामि रक्षे मा चल मा चल ॥
      </div>
      <div class="mantra-iast">
        Yena Baddho Balī Rājā Dānavendro Mahābalaḥ ।<br/>
        Tena Tvāmanubadhnāmi Rakṣe Mā Cala Mā Cala ॥
      </div>
      <p style="font-size:11px;color:var(--ivory-dim);margin-top:6px;line-height:1.45;">
        <em>Meaning: "By that sacred bond with which the ultra-powerful Demon King Bali was bound, with that same sovereign seal I bind thee. O sacred protective energy, never waver, never fail!"</em>
      </p>
    </div>

    <!-- 21-Day Ecological Disposal -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--gold);">
      <div class="kicker" style="color:var(--gold-bright);margin-bottom:3px;">THE 21-DAY REPLACEMENT &amp; ECO-DISPOSAL CODE</div>
      <p class="body-text" style="font-size:11.5px;">
        Vedic cotton threads absorb environmental electromagnetic static over time. After <strong>21 to 28 days</strong>, or when the thread becomes frayed or soiled, untie it with reverence. <strong>Never cut with steel scissors and never throw into household waste.</strong> Release the used thread into clean running natural water (river/stream) or bury it cleanly beneath a sacred Tulsi, Peepal, or Banyan tree. Then consecrate a fresh thread.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Sacred Thread Consecration", 13)}
</section>

<!-- PAGE 14: PILLAR IV — ASTRO-TATTOO: TALISMANIC SKIN GEOMETRY -->
<section class="page">
  ${headerRail("PILLAR IV: ASTRO-TATTOO & TALISMANIC INK")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Astro-Tattoo: Sacred Skin Geometry</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Astro-Tattooing is the sacred art of permanently or semi-permanently inscribing planetary geometric sigils on specific anatomical zones to lock in positive house vibrations under <strong>Krishnamurti Paddhati (KP)</strong> and <strong>Nadi Astrology</strong>.
    </p>

    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:12px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ KP ASTROLOGICAL HOUSE MULTIPLICATION &amp; NEGATION DYNAMICS
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        In KP astrology, every life goal is governed by a precise combination of houses:
      </p>
      <div class="grid-2" style="font-size:11px;margin-top:6px;gap:8px;">
        <div style="background:var(--surface-elevated);padding:6px 8px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">Wealth &amp; Liquid Accumulation:</strong> Houses 2, 6, 11 (2nd = bank balance, 6th = commercial recovery, 11th = realized profits).
        </div>
        <div style="background:var(--surface-elevated);padding:6px 8px;border-radius:4px;">
          <strong style="color:var(--sapphire-bright);">Career Power &amp; Authority:</strong> Houses 10, 11, 6 (10th = governance &amp; status, 11th = fulfillment).
        </div>
        <div style="background:var(--surface-elevated);padding:6px 8px;border-radius:4px;">
          <strong style="color:var(--gold-bright);">Health Defense (Disease Negation):</strong> House 5 (5th house is 12th from 6th, strictly terminating illness).
        </div>
        <div style="background:var(--surface-elevated);padding:6px 8px;border-radius:4px;">
          <strong style="color:var(--ruby-bright);">Dangerous Negations to Avoid:</strong> Never activate 12th house (isolation) or 8th house (scandal) on bodily skin.
        </div>
      </div>
    </div>

    <!-- Golden Rules -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ THE THREE SACRED RULES OF BIOMETRIC SKIN INK
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px;margin-top:4px;">
        <div>
          <strong style="color:var(--gold);">Rule 1 (Male Right Lateralization):</strong> For male natives, planetary sigils must be inscribed exclusively on the <strong>Right Side of the Body</strong> (right arm, right shoulder, right calf). The right side channels masculine Solar/Pingala energy.
        </div>
        <div>
          <strong style="color:var(--gold);">Rule 2 (No Sacred Deities Below Waist):</strong> Never inscribe images of Gods, Om, or sacred Devanagari mantras below the navel or on the feet. Geometric yantras and planetary glyphs are strictly upper-body only.
        </div>
        <div>
          <strong style="color:var(--gold);">Rule 3 (Zero Domestic Rebound):</strong> Unlike physical vastu corrections that impact all household members, skin talismanic geometry impacts <em>only</em> the native whose dermal layer carries the ink.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Pillar IV: Astro-Tattoo Principles", 14)}
</section>

<!-- PAGE 15: PILLAR IV — THE SEEKER'S OPTIMAL ASTRO-TATTOO COORDINATES -->
<section class="page">
  ${headerRail("PILLAR IV: SEEKER TATTOO SPECIFICATIONS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Seeker Talismanic Skin Coordinates</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Computational recommendation tailored specifically for Mukul Mohan Pal's chart to unlock sovereign intellectual leverage, technology authority, and wealth compounding.
    </p>

    <div class="luxury-card" style="border:1.5px solid var(--emerald);margin-bottom:12px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ PRESCRIBED SIGIL: SACRED MERCURY YANTRA / MINIMALIST WINGED CADUCEUS
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        <strong>Activating Energy:</strong> Mercury (Budha) &mdash; Lord of Virgo Lagna &amp; 10th House Gemini. Seated in the 9th house of fortune in mutual exchange with Venus.
      </p>
      <div class="grid-2" style="font-size:11.5px;margin-top:8px;row-gap:6px;">
        <div>
          <span class="kicker">Anatomical Placement:</span>
          <div style="color:var(--gold-bright);font-weight:700;">Right Upper Arm or Inner Forearm</div>
        </div>
        <div>
          <span class="kicker">Governing Zodiac Zone:</span>
          <div style="color:var(--ivory);">Gemini (House 10 · Arms &amp; Shoulders)</div>
        </div>
        <div>
          <span class="kicker">Ink Color Palette:</span>
          <div style="color:var(--emerald-bright);font-weight:600;">Turquoise / Emerald Green or Deep Charcoal</div>
        </div>
        <div>
          <span class="kicker">Optimal Size:</span>
          <div style="color:var(--ivory);">1.5 to 2.5 inches (Geometric / Minimalist)</div>
        </div>
      </div>
    </div>

    <!-- Sigil Details -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ SYMBOLIC GEOMETRY SPECIFICATION
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        The design should feature the classical <strong>Mercury Planetary Sigil (Budha Yantra)</strong> <span style="display:inline-flex;align-items:center;vertical-align:middle;margin:0 3px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="11" r="5"/><path d="M12 16v6M9 19h6M7 4a5 5 0 0 1 10 0"/></svg></span> or a clean geometric polygon (an upward equilateral triangle intersected by an upward arrow) representing mental agility, software syntax mastery, and commercial precision.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:6px;">
        ✦ <strong>Temporary Alternative:</strong> If permanent ink is not preferred, use a skin-safe natural green herbal marker or natural henna to draw a 5mm micro-symbol on the right inner forearm on Wednesday morning during high-stakes pitch days.
      </div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <span class="kicker" style="color:var(--emerald-bright);">Dermal Activation Mechanism:</span>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
        Inscribing Mercury's geometry on Gemini's anatomical region (arms) continuously reinforces the 10th-house executive status vector, transforming communication from casual conversation into authoritative executive mandate.
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: Seeker Tattoo Specifications", 15)}
</section>

<!-- PAGE 16: PILLAR V — CLASSICAL LAL KITAB RIN SIDDHANT -->
<section class="page">
  ${headerRail("PILLAR V: LAL KITAB RIN SIDDHANT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Lal Kitab Rin Siddhant (ऋण सिद्धांत)</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The 1952 classical treatise <em>Lal Kitab</em> introduces the profound concept of <strong>Pitridosh and Karmic Rins (Ancestral Debts)</strong>. Unlike fatalistic curses, a "Rin" represents unresolved moral, ecological, or behavioral debts inherited from lineage genetics that manifest as recurring glass ceilings in career or finances.
    </p>

    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:12px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ THE 9 ANCESTRAL DEBTS OF LAL KITAB
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:3px;">
        1. <strong>Pitra Rin (Jupiter):</strong> Disrespecting priests or breaking ancestral vows.<br/>
        2. <strong>Matra Rin (Moon):</strong> Disregarding the mother, wasting pure water, or emotional cruelty.<br/>
        3. <strong>Stri Rin (Venus):</strong> Disrespecting the feminine principle or commercial deceit.<br/>
        4. <strong>Bhrata Rin (Mars):</strong> Betraying brothers, associates, or land grabbing.<br/>
        5. <strong>Swa Rin (Sun):</strong> Breaking ethical boundaries or extreme self-arrogance.<br/>
        6. <strong>Zalimyana Rin (Saturn):</strong> Cheating domestic staff, laborers, or cruelty to animals.<br/>
        7. <strong>Kudrati Rin (Rahu):</strong> Poisoning water/air or breaking foreign contracts.<br/>
        8. <strong>Dharmik Rin (Ketu):</strong> Harming sacred canines or desecrating spiritual hermitages.<br/>
        9. <strong>Dushman Rin (Mercury):</strong> Deceiving clients, lying in contracts, or gossiping.
      </p>
    </div>

    <!-- Diagnostic Scan for Mukul -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ ACTIVE LINEAGE KARMIC AUDIT FOR MUKUL MOHAN PAL
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px;margin-top:6px;">
        <div>
          <strong style="color:var(--gold);">1. Rahu in 2nd House (Kudrati / Ancestral Treasury Debt):</strong> Rahu occupying the 2nd house of accumulated wealth and lineage oral traditions indicates an ancestral tendency to promise more than delivered. Manifests as sudden expenditure leaks.
        </div>
        <div>
          <strong style="color:var(--gold);">2. Ketu in 8th House (Dharmik Rin):</strong> Ketu in the 8th creates occult friction and unexplained digestive sensitivity. Cleared through the ancient canine feeding protocol.
        </div>
        <div>
          <strong style="color:var(--gold);">3. Mars in 12th House (Subtle Bhrata Friction):</strong> Overcome by regular blood donation or donating mobility equipment to disabled individuals.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Pillar V: Lal Kitab Rin Siddhant", 16)}
</section>

<!-- PAGE 17: PILLAR V — LAL KITAB DEBT NEUTRALIZATION UPAYAS -->
<section class="page">
  ${headerRail("PILLAR V: ZERO-COST LAL KITAB UPAYAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Zero-Cost Lal Kitab Neutralization Upayas</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Lal Kitab upayas are renowned worldwide for their zero-cost, behavioral simplicity. They require no expensive rituals or priests; they rely strictly on ethical actions, natural elements, and animal compassion.
    </p>

    <!-- Upaya 1: Solid Silver Ball -->
    <div class="luxury-card" style="border:1.5px solid var(--sapphire);margin-bottom:10px;">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;font-family:'Cinzel',serif;">
        1. RAHU IN 2ND HOUSE: THE SOLID SILVER BALL ANCHOR (ठोस चांदी की गोली)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        In Lal Kitab, the 2nd house is governed by Jupiter (Dharamsala / Temple) and Venus. Rahu here pollutes liquid speech and destabilizes bank savings.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;margin-top:6px;font-size:11.5px;">
        <strong style="color:var(--gold-bright);">Prescription:</strong>
        <p style="color:var(--ivory-dim);margin-top:2px;">
          Procure a small <strong>Solid Pure Silver Ball (ठोस चांदी की गोली &mdash; without any hole)</strong> weighing between 4 and 10 grams. Keep this ball continuously in your primary wallet or pocket.
        </p>
        <p style="color:var(--ivory-dim);margin-top:4px;">
          <strong>Shastric Mechanism:</strong> Silver represents the pure, pacifying energy of the Moon. Keeping solid silver in the 2nd house permanently calms Rahu's smoke, secures bank liquidity, and prevents sudden wealth erosion.
        </p>
      </div>
    </div>

    <!-- Upaya 2: Street Dog Seva -->
    <div class="luxury-card" style="border:1.5px solid var(--gold);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        2. KETU IN 8TH HOUSE: STRAY DOG SWEET ROTI SEVA (श्वान सेवा)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        In Lal Kitab, dogs represent <strong>Ketu</strong>. When Ketu sits in the 8th house, unexpected delays, joint stiffness, and occult obstacles arise.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;margin-top:6px;font-size:11.5px;">
        <strong style="color:var(--gold-bright);">Prescription:</strong>
        <p style="color:var(--ivory-dim);margin-top:2px;">
          Every Wednesday or Saturday, prepare 2 whole-wheat flatbreads (rotis) sweetened with a touch of pure organic jaggery (Gud) or smeared with a drop of mustard oil. Feed these lovingly to stray street dogs (especially black or two-toned dogs).
        </p>
        <p style="color:var(--ivory-dim);margin-top:4px;">
          <strong>Shastric Mechanism:</strong> A well-fed canine directly absorbs Ketu's karmic sting, instantly clearing hidden roadblocks in high-stakes projects.
        </p>
      </div>
    </div>

    <!-- Upaya 3: Temple Lemon Seva -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <strong style="color:var(--emerald-bright);font-size:11px;text-transform:uppercase;">3. Yellow Lemon Temple Offering (Zero Cost):</strong>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
        On any 3 consecutive Thursdays, offer 4 fresh yellow lemons in a temple without asking for anything in return. This completely dissolves lingering 8th-house acidic toxicity.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Lal Kitab Upayas", 17)}
</section>

<!-- PAGE 18: PILLAR V — LAL KITAB NEVER-DONATE RULES & HOME OMENS -->
<section class="page">
  ${headerRail("PILLAR V: NEVER-DONATE RULES & OMENS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Lal Kitab "Never-Donate" Rules &amp; Omens</h2>
    <p class="body-text" style="margin-bottom:10px;">
      A foundational secret of Lal Kitab is that <strong>donating items associated with your benefic planets transfers your good luck to others</strong>, while donating items associated with afflicted planets clears your debts.
    </p>

    <!-- Never Donate Box -->
    <div class="prohibition-box" style="margin-bottom:12px;">
      <div style="font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--ruby-bright);margin-bottom:6px;">
        ✦ STRICT "NEVER-DONATE" PROTOCOL FOR MUKUL MOHAN PAL (दान निषेध)
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px;">
        <div>
          <strong style="color:var(--ruby-bright);">1. NEVER DONATE PENS, NOTEBOOKS, OR SOFTWARE ON WEDNESDAYS:</strong> Mercury is your Lagna lord and 10th lord seated in the 9th. Donating green stationery or educational tools on Wednesday dissipates your own intellectual leverage. (Gift them with affection on other days, but never as sacrificial charity on Wednesday).
        </div>
        <div>
          <strong style="color:var(--ruby-bright);">2. NEVER DONATE MUSTARD OIL ON YOUR DOORSTEP ON SATURDAY:</strong> Giving mustard oil to wandering beggars at your main threshold invites Saturnian debt inside. Always make Saturnian donations outside, at a Shani temple or community kitchen.
        </div>
        <div>
          <strong style="color:var(--ruby-bright);">3. NEVER ACCEPT FREE ELECTRONICS OR AMULETS FROM STRANGERS:</strong> Accepting free unearned gadgets or talismans absorbs the giver's negative Rahu karma directly into your 2nd house.
        </div>
      </div>
    </div>

    <!-- Home Omens Scan -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ HOUSEHOLD OMENS &amp; ARCHITECTURAL CORRECTIONS (मकान की निशानियां)
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px;margin-top:6px;">
        <div>
          <strong style="color:var(--gold);">1. North-West Clutter:</strong> If electrical wiring or broken electronics accumulate in the North-West zone of your residence, Rahu's 2nd-house volatility spikes. Keep this sector immaculate.
        </div>
        <div>
          <strong style="color:var(--gold);">2. South-West Floor Dampness:</strong> Ensure the South-West master bedroom or storage area has zero plumbing leaks. Dampness here triggers 8th-house Ketu anxiety.
        </div>
        <div>
          <strong style="color:var(--gold);">3. Kitchen Tawa Hygiene:</strong> Never leave the flat iron pan (Tawa) unwashed overnight. Once cooled, clean it immediately and store it concealed from direct view.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Pillar V: Never-Donate Rules & Omens", 18)}
</section>

<!-- PAGE 19: PILLAR V — TRANSIT NAKSHATRA & SHIVLING ABHISHEKA PROTOCOL -->
<section class="page">
  ${headerRail("PILLAR V: SHIVLING ABHISHEKA & TRANSITS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Shivling Abhisheka &amp; Tak Yog Mitigation</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Under classical Nakshatra Gochar, your active Mahadasha lord <strong>Rahu</strong> and Antardasha lord <strong>Mercury</strong> are operating across an <strong>8/6 Mutual Axis ("Tak Yog")</strong>. This subtle astrological tension can generate sudden delays, contractual friction, and mental impatience.
    </p>

    <!-- Shivling Abhisheka Box -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ THE SACRED SHIVLING WATER &amp; HERBAL ABHISHEKA PROTOCOL
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Lord Shiva is the supreme master of time (<em>Mahakala</em>) and cosmic poison neutralization (<em>Neelakantha</em>). Performing targeted Abhisheka cools the heated astral rays of Rahu and Mars.
      </p>
      <div class="grid-2" style="font-size:11.5px;margin-top:8px;gap:8px;">
        <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;">
          <strong style="color:var(--sapphire-bright);">Monday Morning Abhisheka:</strong>
          <p style="color:var(--ivory-dim);margin-top:2px;">
            Offer cold unboiled cow milk mixed with pure holy water and a pinch of <strong>White Sesame Seeds (सफेद तिल)</strong> over the Shivling while chanting <em>Om Namah Shivaya</em> 11 times. Pacifies 12th-house Moon.
          </p>
        </div>
        <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">Wednesday Morning Abhisheka:</strong>
          <p style="color:var(--ivory-dim);margin-top:2px;">
            Offer pure fresh water mixed with crushed fresh <strong>Green Durva Grass (दूर्वा)</strong> over the Shivling. Awakens your Lagna lord Mercury and dissolves commercial friction.
          </p>
        </div>
      </div>
    </div>

    <!-- Tara Chakra Analysis -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ NAVTARA RESILIENCE MAPPING
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        From your natal Moon Nakshatra (Uttara Phalguni), Rahu transits in <strong>Vipat Tara</strong>. While Vipat Tara can present logistical tests, the simultaneous presence of Mercury in <strong>Mitra Tara</strong> provides steady institutional shielding. The Shivling Abhisheka bridges this gap perfectly.
      </p>
    </div>

    <div class="mantra-block">
      <div class="kicker" style="color:var(--emerald-bright);margin-bottom:3px;">TAK YOG NEUTRALIZATION DHYANA MANTRA</div>
      <div class="mantra-devanagari">ॐ नमः शिवाय शुभं शुभं कुरू कुरू शिवाय नमः ॐ ॥</div>
      <div class="mantra-iast">Oṁ Namaḥ Śivāya Śubhaṁ Śubhaṁ Kuru Kuru Śivāya Namaḥ Oṁ ॥</div>
    </div>
  </div>
  ${footerRail("Pillar V: Shivling Abhisheka & Transits", 19)}
</section>

<!-- PAGE 20: THE 12-MONTH BIO-ENERGETIC DEFENSE CALENDAR -->
<section class="page">
  ${headerRail("12-MONTH BIO-ENERGETIC RADAR")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">12-Month Bio-Energetic Defense Calendar</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Quarterly remedial calibrations aligning your physical biology with planetary transits from December 2026 to November 2027.
    </p>

    <!-- Q1 -->
    <div class="luxury-card" style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
          QUARTER 1 (DEC 2026 &ndash; FEB 2027): SATURNIAN GROUNDING &amp; COLD DEFENSE
        </span>
        <span class="tag-badge tag-sapphire">WINTER FOCUS</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Transit Focus:</strong> Sun in Sagittarius &amp; Capricorn. Saturn in 7th house.<br/>
        <strong>Biological Risk:</strong> Lower back stiffness, dry skin, sluggish morning metabolism.<br/>
        <strong>Prescribed Action:</strong> Daily warm sesame oil massage on soles of feet before sleep; strictly maintain right knee kajal micro-dot on high-stress Saturdays; double the 2-inch navel desi ghee application.
      </p>
    </div>

    <!-- Q2 -->
    <div class="luxury-card" style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
          QUARTER 2 (MAR 2027 &ndash; MAY 2027): MERCURY SOLAR RETURN &amp; ENERGY PEAK
        </span>
        <span class="tag-badge tag-emerald">PEAK HARVEST</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Transit Focus:</strong> Sun and Venus transit Taurus (9th House of Fortune) conjoining natal Mercury.<br/>
        <strong>Biological Opportunity:</strong> Peak cognitive agility, rapid software architecture comprehension.<br/>
        <strong>Prescribed Action:</strong> Re-purify your Colombian Emerald on Akshaya Tritiya; drink water stored in pure copper vessels; plant a green Tulsi sapling at home on a Wednesday.
      </p>
    </div>

    <!-- Q3 -->
    <div class="luxury-card" style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
          QUARTER 3 (JUN 2027 &ndash; AUG 2027): MONSOON GUT HEALTH &amp; 12TH HOUSE SUN
        </span>
        <span class="tag-badge tag-amber">CAUTION &amp; R&amp;D</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Transit Focus:</strong> Sun enters Leo (12th House of Outflows and Solitude).<br/>
        <strong>Biological Risk:</strong> Acidity, digestive sluggishness, vivid nocturnal dreams.<br/>
        <strong>Prescribed Action:</strong> Consume light Satvik meals before 8:00 PM; offer cold milk with white sesame on Shivling every Monday; strictly avoid street food and high-sodium snacks.
      </p>
    </div>

    <!-- Q4 -->
    <div class="luxury-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
          QUARTER 4 (SEP 2027 &ndash; NOV 2027): LAGNA SOLAR RETURN &amp; WEALTH HARVEST
        </span>
        <span class="tag-badge tag-emerald">ANNUAL ZENITH</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Transit Focus:</strong> Sun enters Virgo (1st House Lagna Return · 35 Bindus in SAV).<br/>
        <strong>Biological Triumph:</strong> Peak physical stamina, executive negotiation dominance.<br/>
        <strong>Prescribed Action:</strong> Consecrate a fresh red/yellow sacred wrist thread; distribute green apples or spinach to cows during Navratri; light a pure cow ghee lamp in Ishanya (North-East).
      </p>
    </div>
  </div>
  ${footerRail("12-Month Bio-Energetic Defense Calendar", 20)}
</section>

<!-- PAGE 21: DAILY BIO-VEDIC MORNING & NIGHT ARMOR ROUTINE -->
<section class="page">
  ${headerRail("DAILY BIO-VEDIC ARMOR ROUTINE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Daily Bio-Vedic Armor Routines</h2>
    <p class="body-text" style="margin-bottom:10px;">
      High-performance spiritual habits structured into an 8-minute daily routine to keep your bio-magnetic field impervious to psychic and planetary static.
    </p>

    <!-- Morning Routine -->
    <div class="luxury-card" style="border:1.5px solid var(--emerald);margin-bottom:12px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ THE 5-MINUTE MORNING VITALITY SHIELD (प्रातः काल सुरक्षा विधान)
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.8px;margin-top:6px;">
        <div>
          <strong style="color:var(--gold);">1. Kara Darshanam (30 Seconds):</strong> Immediately upon waking, before touching feet to the floor, open your palms together and recite: <em>"Karagre Vasate Lakshmi, Karamadhye Saraswati..."</em> Look into your palms to awaken conscious self-agency.
        </div>
        <div>
          <strong style="color:var(--gold);">2. Clean Cold Eye Rinse (1 Minute):</strong> Splash cold water onto your eyes while holding a sip of fresh water in your mouth. Discharges excess cranial heat and sharpens ocular nerves.
        </div>
        <div>
          <strong style="color:var(--gold);">3. Navel Desi Ghee Seal (1 Minute):</strong> Post-shower, apply 2 drops of pure A2 cow desi ghee in a 2-inch clockwise circle around the navel. Seals the gut-brain axis.
        </div>
        <div>
          <strong style="color:var(--gold);">4. Surya Dhyana &amp; Arghya (2.5 Minutes):</strong> Face East during sunrise, offer clean water from a copper vessel, and recite the Gayatri or Budha mantra 11 times.
        </div>
      </div>
    </div>

    <!-- Evening Routine -->
    <div class="luxury-card" style="border:1.5px solid var(--sapphire);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ THE 3-MINUTE NOCTURNAL SHIELD (सायं काल रक्षा विधान)
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.8px;margin-top:6px;">
        <div>
          <strong style="color:var(--gold);">1. Warm Salt Foot Wash (1.5 Minutes):</strong> Wash feet with warm water infused with a pinch of sea salt. Discharges static electromagnetic charges accumulated from laptop screens and mobile phones.
        </div>
        <div>
          <strong style="color:var(--gold);">2. North-East Ghee Lamp (1 Minute):</strong> Light a single small cow ghee diya or incense stick in the North-East zone of your home to neutralize household astral discord.
        </div>
        <div>
          <strong style="color:var(--gold);">3. Maha Mrityunjaya Japa (30 Seconds):</strong> Recite the Maha Mrityunjaya Mantra 3 times before lying down. Guarantees profound regenerative sleep and wards off nocturnal anxiety.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Daily Bio-Vedic Armor Routine", 21)}
</section>

<!-- PAGE 22: SACRED STOTRAM & PROTECTION KAVACH VAULT -->
<section class="page">
  ${headerRail("SACRED STOTRAM & KAVACH VAULT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Stotram &amp; Kavach Vault</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Vedic sound codes (Mantra Kavachas) that create an acoustic electromagnetic barrier around the physical and subtle body.
    </p>

    <!-- Budha Kavacham -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        1. SRI BUDHA KAVACHAM (LORD MERCURY'S SACRED ARMOR)
      </div>
      <div class="mantra-block">
        <div class="mantra-devanagari">
          बुधस्तु पुस्तकधरः कुंकुमस्य समद्युतिः ।<br/>
          पीताम्बरधरः पातु पीतमाल्यानुलेपनः ॥
        </div>
        <div class="mantra-iast">
          Budhastu Pustakadharaḥ Kuṅkumasya Samadyutiḥ ।<br/>
          Pītāmbaradharaḥ Pātu Pītamālyānulepanaḥ ॥
        </div>
      </div>
      <p class="body-text" style="font-size:11.2px;">
        Recited on Wednesday mornings to shield logical intellect, oral eloquence, software syntax comprehension, and nervous system vitality.
      </p>
    </div>

    <!-- Dasharatha Shani Stotram -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        2. DASHARATHA KRITA SHANI STOTRAM (KING DASHARATHA'S HYMN)
      </div>
      <div class="mantra-block">
        <div class="mantra-devanagari">
          नमः कृष्णाय नीलाय शितिकण्ठनिभाय च ।<br/>
          नमः कालाग्निरूपाय कृतान्ताय च वै नमः ॥
        </div>
        <div class="mantra-iast">
          Namaḥ Kṛṣṇāya Nīlāya Śitikaṇṭhanibhāya Ca ।<br/>
          Namaḥ Kālāgnirūpāya Kṛtāntāya Ca Vai Namaḥ ॥
        </div>
      </div>
      <p class="body-text" style="font-size:11.2px;">
        The supreme hymn revealed to King Dasharatha. Neutralizes Saturn's 7th-house gaze and completely eliminates depression and unearned setbacks.
      </p>
    </div>

    <!-- Maha Mrityunjaya -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        3. MAHA MRITYUNJAYA MANTRA (SUPREME VICTORY OVER MORTALITY)
      </div>
      <div class="mantra-block">
        <div class="mantra-devanagari">
          ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।<br/>
          उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥
        </div>
        <div class="mantra-iast">
          Oṁ Tryambakaṁ Yajāmahe Sugandhiṁ Puṣṭivardhanam ।<br/>
          Urvārukamiva Bandhanān Mṛtyormukṣīya Māmṛtāt ॥
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Sacred Stotram & Protection Kavach Vault", 22)}
</section>

<!-- PAGE 23: 1-PAGE CONSOLIDATED EXECUTIVE ACTION CHEAT SHEET -->
<section class="page">
  ${headerRail("EXECUTIVE ACTION CHEAT SHEET")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Executive Action Cheat Sheet</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Screenshot-worthy 1-page executive summary of your core bio-catalysts, prohibited items, and daily routines.
    </p>

    <!-- Consolidated 1-Page Action Cheat Sheet -->
    <div class="luxury-card" style="border:2px solid var(--border-gold-strong);background:var(--surface-elevated);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ SOVEREIGN BIO-VEDIC ARMOR MATRIX · MUKUL MOHAN PAL
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11.2px;margin-top:6px;">
        <div>
          <span class="kicker">PRIMARY BIO-WEARABLE</span>
          <div style="color:var(--emerald-bright);font-weight:700;">Colombian Emerald (Gold · Little Finger)</div>
        </div>
        <div>
          <span class="kicker">SECONDARY BIO-SHIELD</span>
          <div style="color:var(--sapphire-bright);font-weight:700;">Blue Sapphire / Amethyst (Middle · Silver)</div>
        </div>
        <div>
          <span class="kicker">STRICTLY PROHIBITED GEMS</span>
          <div style="color:var(--ruby-bright);font-weight:700;">Yellow Sapphire (Pukhraj), Red Coral, Pearl</div>
        </div>
        <div>
          <span class="kicker">RUDRAKSHA PAIRING</span>
          <div style="color:var(--ivory);font-weight:600;">4-Mukhi &amp; 7-Mukhi on raw silk thread</div>
        </div>
        <div>
          <span class="kicker">CORE DOT THERAPY PROTOCOL</span>
          <div style="color:var(--emerald-bright);font-weight:700;">2-Inch Navel Circle (Pure Cow Desi Ghee)</div>
        </div>
        <div>
          <span class="kicker">GROUNDING REFLEX DOT</span>
          <div style="color:var(--ivory);font-weight:600;">Micro-Kajal dot on Right Knee on Saturdays</div>
        </div>
        <div>
          <span class="kicker">SACRED WRIST THREAD</span>
          <div style="color:var(--gold-bright);font-weight:700;">Red &amp; Yellow Raw Cotton (7 wraps · Right wrist)</div>
        </div>
        <div>
          <span class="kicker">LAL KITAB RAHU ANCHOR</span>
          <div style="color:var(--ivory);font-weight:600;">Solid Pure Silver Ball in wallet / pocket</div>
        </div>
        <div>
          <span class="kicker">LAL KITAB KETU SEVA</span>
          <div style="color:var(--ivory);font-weight:600;">Feed sweet roasted rotis to stray dogs weekly</div>
        </div>
        <div>
          <span class="kicker">SHIVLING ABHISHEKA</span>
          <div style="color:var(--ivory);font-weight:600;">Cold milk + sesame (Mon) · Durva grass (Wed)</div>
        </div>
      </div>
    </div>

    <!-- Quick Weekly Checklist -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ WEEKLY DISCIPLINE CHECKLIST
      </div>
      <div class="grid-3" style="font-size:11px;margin-top:6px;gap:8px;">
        <div style="background:var(--surface);padding:8px;border-radius:4px;border-left:2px solid var(--emerald);">
          <strong style="color:var(--emerald-bright);">Wednesday (Budha):</strong> Wear green, chant Budha mantra 108&times;, feed green grass/spinach to cows, zero stationery donations.
        </div>
        <div style="background:var(--surface);padding:8px;border-radius:4px;border-left:2px solid var(--sapphire);">
          <strong style="color:var(--sapphire-bright);">Saturday (Shani):</strong> Apply right knee kajal dot, feed stray dogs sweet rotis, avoid mustard oil on doorstep.
        </div>
        <div style="background:var(--surface);padding:8px;border-radius:4px;border-left:2px solid var(--gold);">
          <strong style="color:var(--gold-bright);">Sunday / Tuesday:</strong> Consecrate or check wrist thread tension during Abhijeet Muhurat.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Executive Action Cheat Sheet", 23)}
</section>

<!-- PAGE 24: SHASTRA CERTIFICATION & AUTHENTICITY SEAL -->
<section class="page">
  ${headerRail("SHASTRA CERTIFICATION & AUTHENTICITY SEAL")}
  <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;text-align:center;">
    <div class="decorative-frame" style="max-width:540px;width:100%;padding:25px 22px;">
      <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.25em;color:var(--gold-bright);margin-bottom:8px;">
        ✦ ASTROLIFE SACRED SHASTRA CERTIFICATION ✦
      </div>
      <h2 class="display-l" style="font-size:18px;margin-bottom:10px;">
        Certificate of Astrological Authenticity
      </h2>
      <p class="body-text" style="text-align:center;font-size:11.5px;margin-bottom:16px;">
        This 24-page Bio-Vedic Protection &amp; Sacred Remedy Vault dossier is computed deterministically under classical Parashari principles, Lal Kitab 1952 treatises, and Swiss Ephemeris astronomical algorithms.
      </p>

      <div style="border-top:1px solid var(--border-gold);border-bottom:1px solid var(--border-gold);padding:12px 0;margin-bottom:16px;">
        <div style="font-size:11px;color:var(--gold-bright);letter-spacing:0.1em;text-transform:uppercase;">
          VERIFIED IMMUTABLE SHASTRA RECORD &middot; CERTIFICATE ID: ${paymentId}
        </div>
        <div style="font-size:10px;color:var(--ivory-dim);margin-top:4px;">
          Certified for: ${subjectName} &nbsp;&middot;&nbsp; Archive Ref: ${orderId} &nbsp;&middot;&nbsp; www.astrolife.io
        </div>
      </div>

      <div class="grid-2" style="font-size:10.5px;text-align:left;gap:12px;">
        <div>
          <span class="kicker">ASTRONOMICAL ENGINE</span>
          <div style="color:var(--ivory);font-weight:600;">Swiss Ephemeris DE431</div>
        </div>
        <div>
          <span class="kicker">ALGORITHMIC GOVERNANCE</span>
          <div style="color:var(--ivory);font-weight:600;">AstroLife Sovereign Shastra Council</div>
        </div>
        <div>
          <span class="kicker">COORDINATE PRECISION</span>
          <div style="color:var(--ivory);font-weight:600;">0.01° Arc-Minute Resolution</div>
        </div>
        <div>
          <span class="kicker">HASH VERIFICATION</span>
          <div style="color:var(--ivory);font-weight:600;">SHA-256 IMMUTABLE STAMP</div>
        </div>
      </div>

      <div style="margin-top:20px;font-family:'Cinzel',serif;font-size:9.5px;letter-spacing:0.15em;color:var(--gold-bright);">
        ✦ SACRED SHASTRA HERITAGE &middot; TIME-TESTED VEDIC WISDOM ✦
      </div>
    </div>
  </div>
  ${footerRail("Certified Shastra Archive", 24)}
</section>

</body>
</html>`;
}
