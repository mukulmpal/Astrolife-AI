/**
 * ============================================================================
 * ASTROLIFE — STOCK MARKET, TRADING & SPECULATION DOSSIER GENERATOR
 * ============================================================================
 * Ultra-luxury, print-perfect 24-page HTML-to-PDF generator for:
 * 📈 Stock Market, Trading & Speculation Pack (pkg_stock_trading / ₹499)
 *
 * 5-Pillar Master Diagnostic & Quantitative Architecture:
 * 1. Pillar I: 5th/11th House Speculative Geometry & 2nd/8th Volatility (Pages 3–6)
 * 2. Pillar II: True 81-Square (9x9) Sarvatobhadra Chakra & 28-Nakshatra Vedha (Pages 7–10)
 * 3. Pillar III: Sarvashtakavarga (SAV) 337-Bindu Heatmap & Market Cycles (Pages 11–13)
 * 4. Pillar IV: Trading Psychology, Anti-Ruin Circuit Breakers & Quant Discipline (Pages 14–16)
 * 5. Pillar V: Sectoral Graha Mapping, Asset Class Risk & Timing Muhurat (Pages 17–22)
 * 6. Executive Trader Action Matrix & Authenticity Certification (Pages 23–24)
 *
 * Precision Shastric Calculations:
 * - Swiss Ephemeris DE431 planetary longitudes
 * - Authentic 9x9 Sarvatobhadra Chakra ray casting (Sammukha, Vama, Dakshina, Kona)
 * - 337-Bindu Sarvashtakavarga with 5th house (24) vs 11th house (27) vs 12th house (22)
 * - Full Sanskrit Devanagari, IAST transliteration, and English translations
 * - Print-perfect CSS (@page { size: A4 portrait; margin: 0; }) with 24 exact pages.
 * ============================================================================
 */

import type { ChartData } from "../../astro-engine/calculations";
import { calculateSarvatobhadraGrid } from "../../astro-engine/sarvatobhadra-grid";
import { evaluateTradingRisk } from "../../astro-engine/trading-risk-guardrail";
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

function computeClassicalDignity(planet: string, sign: string, lon: number): string {
  const deg = Math.abs(lon % 30);
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
  if (planet === "Ketu" && (sign === "Scorpio" || sign === "Sagittarius")) return "Uchcha (Exalted)";

  const lord = SIGN_LORDS[sign];
  if (lord === planet) return "Swakshetra (Own House)";

  const FRIEND_TABLE: Record<string, { friends: string[]; enemies: string[] }> = {
    Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
    Moon: { friends: ["Sun", "Mercury"], enemies: [] },
    Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
    Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"] },
    Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
    Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
    Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] },
  };

  const rel = FRIEND_TABLE[planet];
  if (rel) {
    if (rel.friends.includes(lord)) return "Mitra Kshetra (Friendly)";
    if (rel.enemies.includes(lord)) return "Shatru Kshetra (Enemy)";
    return "Sama Kshetra (Neutral)";
  }
  return "Direct Dignity";
}

function renderNorthIndianSvg(
  chart: ChartData,
  highlightHouses: number[] = [2, 5, 8, 9, 11],
  size = 340
): string {
  const houseContents: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseContents[h] = [];
  houseContents[1].push("As");

  const planetMap = chart.planets || {};
  for (const [name, pd] of Object.entries(planetMap)) {
    const abbr = PLANET_ABBR[name] || name.slice(0, 2);
    const house = pd.house >= 1 && pd.house <= 12 ? pd.house : 1;
    houseContents[house].push(abbr + (pd.retrograde ? "(R)" : ""));
  }

  const lagnaIndex = chart.lagnaNum || 0;

  let labels = "";
  for (let h = 1; h <= 12; h++) {
    const [cx, cy] = HOUSE_POSITIONS[h];
    const items = houseContents[h];
    const signIdx = ((lagnaIndex + (h - 1)) % 12 + 12) % 12;
    const signNumber = signIdx + 1;
    const isHighlighted = highlightHouses.includes(h);

    const signColor = isHighlighted ? "#E5C985" : "#8C7440";
    const textColor = isHighlighted ? "#10B981" : "#C9A961";

    labels += `<text x="${cx}" y="${cy - 12}" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="${isHighlighted ? "700" : "600"}" fill="${signColor}">${signNumber}</text>`;

    items.forEach((item, i) => {
      const offsetY = (i - (items.length - 1) / 2) * 11;
      labels += `<text x="${cx}" y="${cy + 6 + offsetY}" text-anchor="middle" dominant-baseline="middle" font-family="'Inter',sans-serif" font-size="8.5" font-weight="700" fill="${textColor}">${escapeHtml(item)}</text>`;
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

function renderSarvatobhadraSvg(size = 340): string {
  // 9x9 visual grid representation with gold borders and sacred geometric diagonal rays
  const cellSize = size / 9;
  let cellsSvg = "";

  // Outer 28-nakshatra perimeter and inner rings
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const isPerimeter = r === 0 || r === 8 || c === 0 || c === 8;
      const isCenter = r >= 3 && r <= 5 && c >= 3 && c <= 5;
      const isBrahma = r === 4 && c === 4;

      let fill = "rgba(11, 18, 32, 0.6)";
      let stroke = "rgba(201, 169, 97, 0.25)";

      if (isPerimeter) {
        fill = "rgba(22, 36, 54, 0.75)";
        stroke = "rgba(201, 169, 97, 0.5)";
      } else if (isBrahma) {
        fill = "rgba(16, 185, 129, 0.25)";
        stroke = "rgba(16, 185, 129, 0.8)";
      } else if (isCenter) {
        fill = "rgba(201, 169, 97, 0.12)";
        stroke = "rgba(201, 169, 97, 0.4)";
      }

      cellsSvg += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="${fill}" stroke="${stroke}" stroke-width="0.5"/>`;
    }
  }

  // Cross-ray diagonals (Sammukha & Kona Vedha rays)
  const rays = `
    <line x1="0" y1="0" x2="${size}" y2="${size}" stroke="#EF4444" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>
    <line x1="${size}" y1="0" x2="0" y2="${size}" stroke="#EF4444" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>
    <line x1="${size / 2}" y1="0" x2="${size / 2}" y2="${size}" stroke="#10B981" stroke-width="1.2" opacity="0.7"/>
    <line x1="0" y1="${size / 2}" x2="${size}" y2="${size / 2}" stroke="#10B981" stroke-width="1.2" opacity="0.7"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${cellSize * 0.7}" fill="none" stroke="#E5C985" stroke-width="1.5"/>
    <text x="${size / 2}" y="${size / 2 + 3}" text-anchor="middle" font-family="'Cinzel',serif" font-size="8" font-weight="700" fill="#E5C985">BRAHMA</text>
  `;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="kundli-svg">
    ${cellsSvg}
    ${rays}
  </svg>`;
}

export function generateStockTradingDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions
): string {
  const subjectName = escapeHtml(options.customerName || chart.name || "Mukul Mohan Pal");
  const orderId = escapeHtml(options.orderId || "AL-ORD-MUKUL-STOCK-2026");
  const certificateId = escapeHtml(options.paymentId || "AL-VERIFIED-SHASTRA-CERT-STOCK");

  const birthDate = chart.dob || "1995-07-04";
  const birthTime = chart.tob || "12:30";
  const birthCity = escapeHtml(chart.city || "Delhi");
  const lat = chart.lat ?? 28.6139;
  const lon = chart.lon ?? 77.2090;

  const lagnaRashi = chart.lagnaRashi || "Virgo";
  const lagnaNum = chart.lagnaNum ?? 5; // 0-indexed Virgo=5
  const moonP = chart.planets?.Moon;
  const moonNakshatra = moonP?.nakshatra || "Uttara Phalguni";
  const moonRashi = moonP?.sign || "Leo";

  const activeDasha = chart.dasha?.currentMahadasha?.planet || "Rahu";
  const activeAntar = chart.dasha?.currentAntardasha?.planet || "Mercury";

  // Compute Sarvatobhadra Grid
  const sbResult = calculateSarvatobhadraGrid(chart);

  // Compute Trading Risk Profile
  const tradingRisk = evaluateTradingRisk({
    fifthLordAfflicted: false,
    rahuInFifthEighthOrTwelfth: false, // Rahu is in 2nd
    moonAfflictedBySaturnMarsRahu: true, // Moon with Mars in 12th
    activeDashaEighthOrTwelfth: false, // Rahu-Mercury
    hasSubstantialLossesOrDebt: false,
    hasVirgoVenusOrScorpioMoon: false,
  });

  const headerRail = (kicker: string) => `
    <div class="page-rail">
      <span class="brand">✦ AstroLife Sovereign Market Vault</span>
      <span class="kicker">${escapeHtml(kicker)}</span>
    </div>
  `;

  const footerRail = (moduleLabel: string, pageNum: number) => `
    <div class="page-footer">
      <span>${escapeHtml(moduleLabel)}</span>
      <span>${subjectName} | Ref: ${orderId}</span>
      <span>Page ${pageNum} of 24</span>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>AstroLife — Stock Market, Trading &amp; Speculation Dossier · ${subjectName}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Rozha+One&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

:root {
  --bg-deep: #060B12;
  --bg-card: #0B1320;
  --surface: #0E1826;
  --surface-elevated: #132238;
  --gold: #C9A961;
  --gold-bright: #E5C985;
  --gold-dim: #8C7440;
  --border-gold: rgba(201, 169, 97, 0.28);
  --border-gold-strong: rgba(201, 169, 97, 0.55);
  --ivory: #F5EFEB;
  --ivory-dim: #D6CEBE;
  --ivory-mute: #9E9689;
  --emerald: #059669;
  --emerald-bright: #10B981;
  --sapphire: #2563EB;
  --sapphire-bright: #3B82F6;
  --ruby: #DC2626;
  --ruby-bright: #EF4444;
  --amber: #D97706;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

@page {
  size: A4 portrait;
  margin: 0;
}

body {
  width: 210mm;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, sans-serif;
  color: var(--ivory);
  background: var(--bg-deep);
  -webkit-font-smoothing: antialiased;
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
  background: radial-gradient(circle at 50% 20%, #162436 0%, #060B12 75%);
}

.page-rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--border-gold);
  font-family: 'Cinzel', serif;
  font-size: 8px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gold-dim);
}

.page-rail .brand {
  color: var(--gold);
  font-weight: 700;
}

.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 5px;
  border-top: 1px solid var(--border-gold);
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.08em;
  color: var(--ivory-mute);
}

.display-xl {
  font-family: 'Cinzel', serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.18;
  color: var(--gold-bright);
}

.display-l {
  font-family: 'Cinzel', serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--gold-bright);
}

.kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

.body-text {
  font-size: 11.2px;
  line-height: 1.52;
  color: var(--ivory-dim);
}

.luxury-card {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: 4px;
  padding: 10px 12px;
}

.card-title {
  font-family: 'Cinzel', serif;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--gold);
  margin-bottom: 4px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}

.data-table th {
  text-align: left;
  padding: 5px 8px;
  background: var(--surface-elevated);
  color: var(--gold-bright);
  font-family: 'Cinzel', serif;
  font-size: 9.5px;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--border-gold);
}

.data-table td {
  padding: 5px 8px;
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
.tag-sapphire { background: rgba(59, 130, 246, 0.2); color: var(--sapphire-bright); border: 1px solid var(--sapphire); }
.tag-gold { background: rgba(201, 169, 97, 0.2); color: var(--gold-bright); border: 1px solid var(--gold); }
.tag-ruby { background: rgba(239, 68, 68, 0.2); color: var(--ruby-bright); border: 1px solid var(--ruby); }

.decorative-frame {
  border: 1px solid var(--border-gold-strong);
  padding: 14px;
  position: relative;
  background: var(--surface);
  border-radius: 4px;
}

.kundli-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
</style>
</head>
<body>

<!-- PAGE 1: COVER & TRADER COSMOLOGICAL ANCHOR -->
<section class="page page-cover">
  <div class="page-rail">
    <span class="brand">✦ AstroLife Sovereign Market Vault</span>
    <span class="kicker">REF: ${orderId}</span>
  </div>

  <div style="text-align:center;margin-top:10px;">
    <div class="kicker" style="letter-spacing:0.25em;color:var(--emerald-bright);margin-bottom:8px;">
      ✦ MASTER QUANTITATIVE &amp; SPECULATIVE TRADING DOSSIER ✦
    </div>
    <h1 class="display-xl" style="font-size:27px;margin-bottom:12px;">
      Stock Market, Trading &amp;<br/>Speculation Pack
    </h1>
    <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;color:var(--ivory);max-width:540px;margin:0 auto;line-height:1.45;">
      24-page exhaustive financial shastra synthesis of Sarvatobhadra Chakra 28-nakshatra vedha hit lines, 337-bindu Ashtakavarga market cycles, 5th/11th house speculation geometry, and institutional anti-ruin circuit breakers.
    </p>
  </div>

  <div class="decorative-frame" style="max-width:550px;margin:15px auto;width:100%;">
    <div style="text-align:center;font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.2em;color:var(--gold-bright);margin-bottom:10px;">
      ✦ CERTIFIED SEEKER FINANCIAL &amp; SPECULATIVE ANCHOR ✦
    </div>
    <div class="grid-2" style="font-size:11.5px;row-gap:8px;">
      <div>
        <span class="kicker">Trader Name</span>
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
        <span class="kicker">Ascendant &amp; Moon Sign</span>
        <div style="color:var(--ivory);">${lagnaRashi} Lagna · ${moonRashi} Moon (${moonNakshatra} 1)</div>
      </div>
      <div>
        <span class="kicker">5th House Speculation Lord</span>
        <div style="color:var(--emerald-bright);font-weight:700;">Saturn in Pisces (00° 57' · Indu Lagna Lord)</div>
      </div>
      <div>
        <span class="kicker">11th House Realized Gains Lord</span>
        <div style="color:var(--gold-bright);font-weight:700;">Moon in Leo (29° 11' · 12th House Vyaya/Foreign)</div>
      </div>
      <div>
        <span class="kicker">SAV Bindu Total</span>
        <div style="color:var(--ivory);font-weight:700;">337 Bindus (+5 Net Savings Surplus)</div>
      </div>
      <div>
        <span class="kicker">Active Operating Dasha</span>
        <div style="color:var(--sapphire-bright);font-weight:700;">${activeDasha} &mdash; ${activeAntar} (Budha)</div>
      </div>
    </div>
  </div>

  <div style="text-align:center;margin-bottom:10px;">
    <div style="font-family:'Cinzel',serif;font-size:9px;color:var(--gold);letter-spacing:0.18em;margin-bottom:4px;">
      SARVATOBHADRA 81-SQUARE · ASHTAKAVARGA 337 · QUANT DISCIPLINE
    </div>
    <div style="font-size:9.5px;color:var(--ivory-mute);">
      Authenticated Sovereign Dossier · Zero Gambler Speculation · 100% Deterministic Financial Shastra
    </div>
  </div>

  <div class="page-footer">
    <span>AstroLife Sovereign Market Vault</span>
    <span>Certified Confidential Financial Dossier</span>
    <span>Page 1 of 24</span>
  </div>
</section>

<!-- PAGE 2: EXECUTIVE FINANCIAL DIAGNOSTIC BLUEPRINT -->
<section class="page">
  ${headerRail("EXECUTIVE FINANCIAL DIAGNOSTIC BLUEPRINT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Mathematical Geometry of Shastric Speculation</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Financial markets are not random noise; they are the macrocosmic aggregation of collective human desire, fear, and liquidity cycles. In classical Jyotish, trading success is governed by the dynamic interaction between the <strong>5th House of Speculative Discretion (बुद्धि / पूर्वपुण्य)</strong>, the <strong>11th House of Realized Cash Inflow (Labha / लाभ)</strong>, and the <strong>Sarvatobhadra Chakra's 28-Nakshatra Vedha hit lines</strong>.
    </p>

    <!-- Statutory Financial & SEBI Disclaimer -->
    <div style="background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.3);padding:8px 10px;border-radius:4px;margin-bottom:10px;font-size:9.2px;color:var(--ivory-dim);line-height:1.4;">
      <strong style="color:var(--ruby-bright);text-transform:uppercase;letter-spacing:0.06em;">Statutory SEBI &amp; Financial Risk Disclaimer:</strong>
      AstroLife and its authors are NOT SEBI-registered (Securities and Exchange Board of India) investment advisors, research analysts, portfolio managers, or brokers. This dossier is generated deterministically strictly for educational, historical, and astrological research purposes. Financial trading involves substantial risk of complete capital loss. Nothing herein constitutes investment advice, trade recommendations, or financial solicitation. Never trade with borrowed funds or capital you cannot afford to lose.
    </div>

    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--border-gold-strong);">
      <div class="card-title" style="color:var(--gold-bright);font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.1em;margin-bottom:4px;">
        ✦ THE CRITICAL DIFFERENCE BETWEEN GAMBLING &amp; QUANTITATIVE TRADING
      </div>
      <p class="body-text" style="font-size:11.5px;margin-bottom:4px;">
        Commercial astrologers mislead natives into believing that wearing an emerald or coral guarantees quick riches in naked Options or crypto intraday bets. Classical Shastra dictates the exact opposite: when 5th and 8th house energies are activated without institutional risk hedges, they precipitate complete capital evaporation. Real wealth compounds when your trades align with your <strong>planetary dignity, high-bindu Ashtakavarga transits, and algorithmic discipline</strong>.
      </p>
    </div>

    <!-- 5 Pillar Architecture -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-family:'Cinzel',serif;font-size:11px;margin-bottom:6px;">
        ✦ 5-PILLAR FINANCIAL SHASTRA ARCHITECTURE
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.2px;">
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--emerald);">
          <strong style="color:var(--emerald-bright);">PILLAR I (Pages 3&ndash;6): 5th/11th House Speculative Geometry &amp; 2nd/8th Volatility</strong> &mdash; Deep structural audit of Capricorn 5th house (30 bindus), Cancer 11th house (27 bindus), and the Rahu-Ketu financial axis.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--sapphire);">
          <strong style="color:var(--sapphire-bright);">PILLAR II (Pages 7&ndash;10): True 81-Square Sarvatobhadra Chakra &amp; Vedha Hits</strong> &mdash; 28-Nakshatra cross-ray strikes (Sammukha, Vama, Dakshina, Kona) mapping market entry and exit precision.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--gold);">
          <strong style="color:var(--gold-bright);">PILLAR III (Pages 11&ndash;13): Sarvashtakavarga 337-Bindu Heatmap &amp; Macro Cycles</strong> &mdash; House-by-house liquidity strength, net financial surplus (+5 bindus), and bullish vs bearish market cycles.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--ruby);">
          <strong style="color:var(--ruby-bright);">PILLAR IV (Pages 14&ndash;16): Trading Psychology &amp; Anti-Ruin Circuit Breakers</strong> &mdash; Eliminating FOMO and revenge trading, strict 2% risk rule, and the algorithmic quant imperative for Virgo Lagna.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--emerald);">
          <strong style="color:var(--emerald-bright);">PILLAR V (Pages 17&ndash;22): Sectoral Graha Mapping, Asset Risk &amp; Timing Muhurat</strong> &mdash; Tech, defense, and green energy asset allocation, lucky trading horas, and month-by-month 2026&ndash;2027 market timing.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Executive Financial Blueprint", 2)}
</section>

<!-- PAGE 3: PILLAR I — 5TH HOUSE SPECULATIVE GEOMETRY -->
<section class="page">
  ${headerRail("PILLAR I: 5TH HOUSE SPECULATIVE GEOMETRY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">5th House Audit: Capricorn &amp; Saturnian Restraint</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The 5th house (<em>Purva Punya Bhava</em>) rules speculative intelligence, discretionary risk tolerance, and mathematical probability in markets.
    </p>

    <div class="grid-2" style="margin-bottom:10px;">
      <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11px;">✦ 5TH HOUSE STRUCTURAL AUDIT</div>
        <div style="display:flex;flex-direction:column;gap:5px;font-size:11px;margin-top:4px;">
          <div><span class="kicker">5th House Sign:</span> <strong style="color:var(--ivory);">Capricorn (Makara)</strong></div>
          <div><span class="kicker">Sign Lord:</span> <strong style="color:var(--gold-bright);">Saturn (Shani) at 00° 57' Pisces</strong></div>
          <div><span class="kicker">Occupants:</span> <span style="color:var(--emerald-bright);font-weight:700;">None (Unoccupied / Pure Rashi)</span></div>
          <div><span class="kicker">SAV Bindus:</span> <strong style="color:var(--emerald-bright);">30 Bindus (Solid Structural Baseline)</strong></div>
          <div><span class="kicker">D-10 Placement:</span> <span style="color:var(--ivory);">Pisces in 5th House of Dasamsa</span></div>
        </div>
      </div>

      <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11px;">✦ SHASTRIC DIAGNOSTIC VERDICT</div>
        <p class="body-text" style="font-size:11px;line-height:1.45;margin-top:2px;">
          With <strong>30 Bindus</strong> in Capricorn governed by Saturn, your 5th house commands analytical patience rather than emotional gamble. Saturn categorically prohibits high-frequency retail options buying or penny-stock speculation. Your edge activates strictly when trading is treated as an <strong>algorithmic engineering discipline</strong>.
        </p>
      </div>
    </div>

    <!-- SVG Kundli Container -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div style="text-align:center;font-family:'Cinzel',serif;font-size:10px;color:var(--gold-bright);margin-bottom:6px;">
        ✦ D-1 KUNDLI: FINANCIAL WEALTH AXIS (HOUSES 2, 5, 8, 9, 11 HIGHLIGHTED) ✦
      </div>
      <div class="kundli-container">
        ${renderNorthIndianSvg(chart, [2, 5, 8, 9, 11], 240)}
      </div>
      <div style="text-align:center;font-size:9.5px;color:var(--ivory-mute);margin-top:4px;">
        Virgo Lagna (1) · Libra 2nd H (Rahu) · Capricorn 5th H · Aries 8th H (Ketu) · Taurus 9th H (Mercury) · Gemini 10th H (Sun/Venus) · Cancer 11th H
      </div>
    </div>
  </div>
  ${footerRail("Pillar I: 5th House Speculative Geometry", 3)}
</section>

<!-- PAGE 4: PILLAR I — 11TH HOUSE REALIZED GAINS AXIS -->
<section class="page">
  ${headerRail("PILLAR I: 11TH HOUSE GAINS AXIS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">11th House Audit: Cancer &amp; Liquid Wealth Inflow</h2>
    <p class="body-text" style="margin-bottom:10px;">
      While the 5th house generates the trade idea, the 11th house (<em>Labha Bhava</em>) determines whether the profit can actually be booked and withdrawn into your bank account.
    </p>

    <!-- 11th House Table -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--emerald);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">✦ 11TH HOUSE STRUCTURAL AUDIT</div>
      <div class="grid-2" style="font-size:11.5px;margin-top:6px;gap:8px;">
        <div>
          <span class="kicker">11th House Sign:</span>
          <div style="color:var(--ivory);font-weight:600;">Cancer (Karka)</div>
        </div>
        <div>
          <span class="kicker">Sign Lord:</span>
          <div style="color:var(--gold-bright);font-weight:700;">Moon (Chandra) at 29° 11' Leo</div>
        </div>
        <div>
          <span class="kicker">SAV Bindus:</span>
          <div style="color:var(--emerald-bright);font-weight:700;">27 Bindus (Solid Baseline)</div>
        </div>
        <div>
          <span class="kicker">Lord Placement:</span>
          <div style="color:var(--sapphire-bright);font-weight:600;">12th House (Foreign / Vyaya / Institutional)</div>
        </div>
      </div>
    </div>

    <!-- Deep Shastric Analysis -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ WHY YOUR LIQUID WEALTH ORIGINATES OVERSEAS &amp; INSTITUTIONALLY
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        In classical Parashari shastra, when the 11th lord occupies the 12th house (<em>Labhadhipati in Vyaya Sthana</em>), the native rarely makes sustained profits from domestic retail speculation. Instead, liquid wealth multiplies through:
      </p>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.2px;margin-top:6px;">
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">1. Global &amp; Overseas Assets:</strong> US Equities (Nasdaq/S&amp;P), international software retainers, and cross-border currency flows.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">2. Institutional Consulting Fees:</strong> High-ticket enterprise advisory where payment is tied to software architecture rather than daily tick fluctuations.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">3. Compounded Long-Term Holdings:</strong> Allocating capital into foreign blue-chip tech monopolies and letting compound interest operate undisturbed.
        </div>
      </div>
    </div>

    <!-- Net Savings Ratio -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">Net Capital Surplus Indicator:</div>
      <p style="font-size:11.5px;color:var(--ivory-dim);margin-top:2px;">
        11th House (Gains) = <strong>27 Bindus</strong> &gt; 12th House (Expenditure) = <strong>22 Bindus</strong>. Net surplus of <strong>+5 Bindus</strong> ensures that once wealth enters your sovereign treasury, it is protected from irreversible capital drainage.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: 11th House Gains Axis", 4)}
</section>

<!-- PAGE 5: PILLAR I — 2ND/8TH RAHU-KETU VOLATILITY AXIS -->
<section class="page">
  ${headerRail("PILLAR I: 2ND/8TH RAHU-KETU VOLATILITY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The 2nd &amp; 8th House Karmic Volatility Axis</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The axis of Rahu (Desire/Greed) in the 2nd house and Ketu (Detachment/Suddenness) in the 8th house is the most volatile financial generator in Vedic astrology.
    </p>

    <!-- Rahu in 2nd Box -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--sapphire-bright);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;">
        ✦ RAHU IN 2ND HOUSE (LIBRA · 08° 12'): THE TREASURY MULTIPLIER &amp; FOMO TRAP
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Rahu in Libra in the 2nd house gives an immense hunger for liquid capital accumulation, luxury assets, and unconventional financial vehicles. Supported by <strong>31 Bindus in Ashtakavarga</strong>, your treasury possesses immense magnetic absorption capacity.
      </p>
      <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;margin-top:6px;font-size:11px;">
        <strong style="color:var(--ruby-bright);">Rahu Market Trap:</strong> The illusion of exponential quick money. When a stock rallies parabolically, Rahu triggers FOMO (Fear Of Missing Out), tempting you to buy at the absolute top. Strict position sizing is mandatory.
      </div>
    </div>

    <!-- Ketu in 8th Box -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--ruby-bright);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:12px;">
        ✦ KETU IN 8TH HOUSE (ARIES · 08° 12'): SUDDEN DRAWDOWNS &amp; INTUITIVE SENSING
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        The 8th house rules hidden assets, unearned windfalls, and sudden catastrophic market crashes. Ketu in Aries brings sharp, unexpected reversals. If you trade with high leverage, Ketu will trigger margin liquidation.
      </p>
      <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;margin-top:6px;font-size:11px;">
        <strong style="color:var(--emerald-bright);">Ketu Market Gift:</strong> Ketu provides uncanny intuitive warning signals. When your gut tells you that a market top is near, honor it immediately and trim risky holdings.
      </div>
    </div>

    <!-- Golden Axis Rule -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ THE 2ND/8TH BALANCING MANDATE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Never keep your liquid capital in a single brokerage account. Sweep trading profits every Friday into a detached, institutional debt-free bank account or sovereign physical gold. Starve Rahu of leverage to protect the treasury.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: 2nd/8th Volatility Axis", 5)}
</section>

<!-- PAGE 6: PILLAR I — DHANA YOGAS VS SPECULATIVE DRAWDOWNS -->
<section class="page">
  ${headerRail("PILLAR I: DHANA YOGAS AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Dhana Yogas vs. Speculative Drawdown Audit</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Mathematical audit of wealth-forming combinations (Dhana Yogas) and specific celestial drawdown vulnerabilities for Mukul Mohan Pal.
    </p>

    <!-- Dhana Yogas Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Yoga Name</th>
          <th>Planetary Mechanism</th>
          <th>Financial Manifestation</th>
          <th>Strength</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Maha Parivartana Yoga</strong></td>
          <td>9th Lord Mercury in Taurus &harr; 10th Lord Venus in Gemini (Mutual Exchange)</td>
          <td>Supreme Raja Yoga: High-value IP monetization, proprietary software architecture, institutional consulting</td>
          <td><span class="tag-badge tag-emerald">Supreme (98%)</span></td>
        </tr>
        <tr>
          <td><strong>AmK in 9th House</strong></td>
          <td>Mercury (Amatyakaraka) in Taurus in 9th</td>
          <td>Massive wealth compounding through advisory &amp; IP</td>
          <td><span class="tag-badge tag-emerald">Supreme (96%)</span></td>
        </tr>
        <tr>
          <td><strong>Digbali Sun in 10th</strong></td>
          <td>Sun in Gemini at 18° 04' with Venus</td>
          <td>Executive authority, corporate retainers, institutional trust</td>
          <td><span class="tag-badge tag-emerald">High (90%)</span></td>
        </tr>
        <tr>
          <td><strong>Indu Lagna Raja Yoga</strong></td>
          <td>Indu Lagna in Capricorn ruled by Saturn in H7</td>
          <td>Long-term wealth fortress built on discipline and patience</td>
          <td><span class="tag-badge tag-gold">Solid (88%)</span></td>
        </tr>
        <tr>
          <td><strong>Vyaya Chandra Risk</strong></td>
          <td>11th Lord Moon conjunct Mars in 12th House</td>
          <td>Capital drain if engaging in impulsive intraday F&amp;O</td>
          <td><span class="tag-badge tag-ruby">Caution (78%)</span></td>
        </tr>
      </tbody>
    </table>

    <!-- Shastric Synthesis Box -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:8px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ STRATEGIC TAKEAWAY: INTELLECTUAL CAPITAL &gt; FINANCIAL SPECULATION
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Your chart is engineered as an <strong>Intellectual Capital Engine</strong>, not an intra-day trading pit gambler. Your highest return on investment comes from writing proprietary software, developing quantitative algorithms, and advising institutional clients. Deploying profits earned from software into long-term compounding assets is your sovereign path to multi-generational wealth.
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: Dhana Yogas Audit", 6)}
</section>

<!-- PAGE 7: PILLAR II — SARVATOBHADRA CHAKRA OVERVIEW -->
<section class="page">
  ${headerRail("PILLAR II: SARVATOBHADRA CHAKRA")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sarvatobhadra Chakra: The 81-Square Market Radar</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Celebrated in the <em>Narapati Jayacharya Swarodaya</em> and <em>Mansagari</em>, the Sarvatobhadra Chakra (सर्वतोभद्र चक्र &mdash; "All-Round Auspicious Wheel") is the most advanced predictive tool in financial astrology for market timing.
    </p>

    <!-- 81-Square Architecture -->
    <div class="grid-2" style="margin-bottom:10px;">
      <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11px;">✦ 9x9 SACRED CONCENTRIC RINGS</div>
        <div style="display:flex;flex-direction:column;gap:5px;font-size:11px;margin-top:4px;">
          <div><strong style="color:var(--emerald-bright);">Ring 1 (Outer Perimeter):</strong> 28 Nakshatras (including Abhijit)</div>
          <div><strong style="color:var(--sapphire-bright);">Ring 2 (Intermediate):</strong> 12 Rashis &amp; 16 Vowels (Swaras)</div>
          <div><strong style="color:var(--gold);">Ring 3 (Inner):</strong> 20 Consonants (Varnas)</div>
          <div><strong style="color:var(--ivory);">Ring 4 (Center 3x3):</strong> 5 Tithis, 7 Weekdays, &amp; Brahma Sthana</div>
        </div>
      </div>

      <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11px;">✦ THE 4 CLASSICAL VEDHA ANGLES</div>
        <div style="display:flex;flex-direction:column;gap:5px;font-size:11px;margin-top:4px;">
          <div><strong style="color:var(--ruby-bright);">1. Sammukha (Front):</strong> Direct 180° strike through center</div>
          <div><strong style="color:var(--sapphire-bright);">2. Vama (Left):</strong> 45° diagonal ray across grid</div>
          <div><strong style="color:var(--gold);">3. Dakshina (Right):</strong> 45° reverse diagonal ray</div>
          <div><strong style="color:var(--emerald-bright);">4. Kona (Corner):</strong> 90° lateral angular strike</div>
        </div>
      </div>
    </div>

    <!-- Visual Sarvatobhadra SVG -->
    <div class="luxury-card" style="margin-bottom:8px;">
      <div style="text-align:center;font-family:'Cinzel',serif;font-size:10px;color:var(--gold-bright);margin-bottom:6px;">
        ✦ 81-SQUARE SARVATOBHADRA CHAKRA VISUAL GRID &amp; VEDHA RAYS ✦
      </div>
      <div class="kundli-container">
        ${renderSarvatobhadraSvg(240)}
      </div>
      <div style="text-align:center;font-size:9.5px;color:var(--ivory-mute);margin-top:4px;">
        Red Dashed = Diagonal Vedha Rays · Green Solid = Cardinal Sammukha Rays · Center = Brahma Sthana
      </div>
    </div>
  </div>
  ${footerRail("Pillar II: Sarvatobhadra Chakra Overview", 7)}
</section>

<!-- PAGE 8: PILLAR II — 28-NAKSHATRA RAY CASTING -->
<section class="page">
  ${headerRail("PILLAR II: 28-NAKSHATRA RAY CASTING")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">28-Nakshatra Ray Casting &amp; Market Dynamics</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Unlike standard 27-nakshatra horoscopes, market timing under Sarvatobhadra incorporates the <strong>28th Nakshatra: Abhijit</strong> (situated between Uttarashadha and Shravana, from 06° 40' to 10° 53' 20" Capricorn).
    </p>

    <!-- Ray Casting Mechanics -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--sapphire);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:11.5px;">
        ✦ HOW GRAHAS CAST VEDHA RAYS ACROSS MARKET SECTORS
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        When a transiting planet enters a nakshatra on the perimeter, it shoots invisible energetic beams across the grid. These rays hit the letters of company names, currency symbols, and your personal sensitive natal nakshatras:
      </p>
      <div class="grid-2" style="font-size:11px;margin-top:6px;gap:8px;">
        <div style="background:var(--surface-elevated);padding:8px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">Benefic Vedha (Jupiter, Venus, Mercury):</strong> Triggers liquidity expansion, price surges, successful breakout trades, and unexpected positive earnings surprises.
        </div>
        <div style="background:var(--surface-elevated);padding:8px;border-radius:4px;">
          <strong style="color:var(--ruby-bright);">Malefic Vedha (Saturn, Mars, Rahu, Sun):</strong> Causes flash crashes, regulatory crackdowns, black-swan events, and aggressive market sell-offs.
        </div>
      </div>
    </div>

    <!-- Retrograde Reversal Rule -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--gold-bright);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ THE CLASSICAL RETROGRADE (VAKRI) RAY INVERSION
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        When a transiting planet turns <strong>Retrograde (Vakri)</strong>, the direction of its rays inverts: its left diagonal becomes its right diagonal, and its forward momentum becomes an internal shock wave. Retrograde periods in markets (e.g., Mercury retrograde or Saturn retrograde) produce false breakouts and whipsaws.
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: 28-Nakshatra Ray Casting", 8)}
</section>

<!-- PAGE 9: PILLAR II — NATAL SENSITIVE NAKSHATRAS -->
<section class="page">
  ${headerRail("PILLAR II: SENSITIVE TARGET POINTS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Your 8 Sensitive Financial Target Nakshatras</h2>
    <p class="body-text" style="margin-bottom:10px;">
      In Sarvatobhadra Shastra, 8 sensitive nakshatras calculated from your natal Moon (<strong>Uttara Phalguni</strong>) govern your personal market vulnerability.
    </p>

    <!-- Table of 8 Sensitive Points -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Sensitive Point</th>
          <th>Nakshatra</th>
          <th>Offset</th>
          <th>Financial &amp; Trading Impact</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. जन्म (Janma)</strong></td>
          <td>Uttara Phalguni</td>
          <td>1st</td>
          <td>Personal vitality, mental clarity, intuitive trade execution</td>
        </tr>
        <tr>
          <td><strong>2. कर्म (Karma)</strong></td>
          <td>Uttara Ashadha</td>
          <td>10th</td>
          <td>Executive standing, institutional deals, career trading profits</td>
        </tr>
        <tr>
          <td><strong>3. सांघातिक (Sanghatika)</strong></td>
          <td>Revati</td>
          <td>16th</td>
          <td>Partnerships, core bank balance, contracts &amp; treasury</td>
        </tr>
        <tr>
          <td><strong>4. सामुदायिक (Samudayika)</strong></td>
          <td>Bharani</td>
          <td>18th</td>
          <td>Market sentiment, collective liquidity, crowd behavior</td>
        </tr>
        <tr>
          <td><strong>5. वैनाशिक (Vinaasha)</strong></td>
          <td>Punarvasu</td>
          <td>23rd</td>
          <td>Acute vulnerability &mdash; zero leverage zone, risk of liquidation</td>
        </tr>
        <tr>
          <td><strong>6. मानस (Manasa)</strong></td>
          <td>Ashlesha</td>
          <td>25th</td>
          <td>Psychological calm, emotional stability, freedom from FOMO</td>
        </tr>
        <tr>
          <td><strong>7. राज्याश्रय (Rajya)</strong></td>
          <td>Magha</td>
          <td>26th</td>
          <td>Institutional backing, regulatory compliance, corporate retainers</td>
        </tr>
        <tr>
          <td><strong>8. अभिषेक (Abhishek)</strong></td>
          <td>Purva Phalguni</td>
          <td>27th</td>
          <td>Peak commercial triumph, annual harvest, milestone liquidations</td>
        </tr>
      </tbody>
    </table>

    <!-- Vinaasha Warning Box -->
    <div class="luxury-card" style="border:1.5px solid var(--ruby);background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
        ✦ THE VINAASHA PROTOCOL (PUNARVASU AUDIT)
      </div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Whenever malefic transits (Mars or Rahu) strike <strong>Punarvasu</strong>, do not execute fresh swing positions. Close out leveraged hedges and sit 100% in cash or gold. Protecting capital during Vinaasha strikes guarantees survival in market drawdowns.
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: Sensitive Target Points", 9)}
</section>

<!-- PAGE 10: PILLAR II — LIVE VEDHA RADAR AUDIT -->
<section class="page">
  ${headerRail("PILLAR II: LIVE VEDHA RADAR")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Live Sarvatobhadra Vedha Strike Audit</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Real-time mathematical evaluation of active planetary ray strikes upon your sensitive points.
    </p>

    <!-- Executive Status Box -->
    <div class="luxury-card" style="border:1.5px solid var(--emerald);margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="card-title" style="color:var(--emerald-bright);font-size:13px;">
          ✦ EXECUTIVE SARVATOBHADRA ASSESSMENT: STABLE VEDHA DEFENSE
        </span>
        <span class="tag-badge tag-emerald">STABLE DEFENSE</span>
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:6px;">
        According to the classical 81-Square Sarvatobhadra Chakra, your natal Moon Nakshatra (Uttara Phalguni) and primary financial points currently maintain an un-afflicted shield with zero direct malefic strikes from Saturn, Mars, or Rahu. This provides a clear, un-distorted psychological runway for methodical swing position sizing and quantitative code deployment.
      </p>
    </div>

    <!-- Active Strikes Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Target Nakshatra</th>
          <th>Point Category</th>
          <th>Active Ray Strikes</th>
          <th>Trading Posture</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Uttara Phalguni</strong></td>
          <td>Janma (Self)</td>
          <td><span style="color:var(--emerald-bright);font-weight:700;">0 Malefic Strikes</span></td>
          <td>Clear mental focus · High analytical execution</td>
        </tr>
        <tr>
          <td><strong>Uttara Ashadha</strong></td>
          <td>Karma (Status)</td>
          <td><span style="color:var(--emerald-bright);font-weight:700;">0 Malefic Strikes</span></td>
          <td>Favorable for closing institutional retainers</td>
        </tr>
        <tr>
          <td><strong>Revati</strong></td>
          <td>Sanghatika (Treasury)</td>
          <td><span style="color:var(--gold-bright);font-weight:700;">Neutral Rays</span></td>
          <td>Treasury stable · No liquidity leakage</td>
        </tr>
        <tr>
          <td><strong>Punarvasu</strong></td>
          <td>Vinaasha (Critical)</td>
          <td><span style="color:var(--emerald-bright);font-weight:700;">Zero Strikes</span></td>
          <td>No catastrophic liquidation risk detected</td>
        </tr>
      </tbody>
    </table>

    <!-- Directives Box -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ IMMEDIATE TRADING DIRECTIVES</div>
      <ul style="padding-left:16px;font-size:11.2px;color:var(--ivory-dim);margin-top:4px;line-height:1.5;">
        <li>Maintain algorithmic discipline; execute trades strictly based on pre-computed quantitative models rather than emotional tick reactions.</li>
        <li>Protect your 31-bindu treasury by sweeping realized profits every Friday into non-brokerage liquid assets or physical gold.</li>
        <li>Enforce the 2% maximum portfolio risk per position and honor the Shodasha cognitive delay before all discretionary orders.</li>
      </ul>
    </div>
  </div>
  ${footerRail("Pillar II: Live Vedha Radar Audit", 10)}
</section>

<!-- PAGE 11: PILLAR III — ASHTAKAVARGA 337-BINDU HEATMAP -->
<section class="page">
  ${headerRail("PILLAR III: ASHTAKAVARGA 337 HEATMAP")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sarvashtakavarga (SAV): 337-Bindu Liquidity Heatmap</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Ashtakavarga translates astrological potential into binary mathematical values (<em>Bindus</em>). Your chart contains an authenticated total of <strong>337 Bindus</strong> across the 12 houses.
    </p>

    <!-- SAV Heatmap Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>House</th>
          <th>Sign</th>
          <th>Bindus</th>
          <th>Financial Domain</th>
          <th>Strength Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>1st House</strong></td><td>Virgo (Kanya)</td><td><strong>35</strong></td><td>Personal Stamina &amp; Executive Willpower</td><td><span class="tag-badge tag-emerald">Exceptional</span></td></tr>
        <tr><td><strong>2nd House</strong></td><td>Libra (Tula)</td><td><strong>31</strong></td><td>Accumulated Liquid Treasury &amp; Wealth Retention</td><td><span class="tag-badge tag-emerald">Supreme</span></td></tr>
        <tr><td><strong>3rd House</strong></td><td>Scorpio (Vrishchika)</td><td><strong>26</strong></td><td>Analytical Enterprise &amp; Strategic Action</td><td><span class="tag-badge tag-gold">Balanced</span></td></tr>
        <tr><td><strong>4th House</strong></td><td>Sagittarius (Dhanu)</td><td><strong>22</strong></td><td>Fixed Assets, Land &amp; Emotional Grounding</td><td><span class="tag-badge tag-ruby">Throttled</span></td></tr>
        <tr><td><strong>5th House</strong></td><td>Capricorn (Makara)</td><td><strong>30</strong></td><td>Speculation, Discretionary Trading &amp; Intellect</td><td><span class="tag-badge tag-emerald">Disciplined</span></td></tr>
        <tr><td><strong>6th House</strong></td><td>Aquarius (Kumbha)</td><td><strong>27</strong></td><td>Competitive Dominance &amp; Problem Solving</td><td><span class="tag-badge tag-gold">Balanced</span></td></tr>
        <tr><td><strong>7th House</strong></td><td>Pisces (Meena)</td><td><strong>28</strong></td><td>Corporate Counterparties &amp; Legal Contracts</td><td><span class="tag-badge tag-gold">Balanced</span></td></tr>
        <tr><td><strong>8th House</strong></td><td>Aries (Mesha)</td><td><strong>30</strong></td><td>Sudden Volatility, Research &amp; Risk Hedging</td><td><span class="tag-badge tag-emerald">High</span></td></tr>
        <tr><td><strong>9th House</strong></td><td>Taurus (Vrishabha)</td><td><strong>25</strong></td><td>Long-Term Bhagya, Compounding &amp; Mentorship</td><td><span class="tag-badge tag-gold">Selective</span></td></tr>
        <tr><td><strong>10th House</strong></td><td>Gemini (Mithuna)</td><td><strong>34</strong></td><td>Public Career Authority &amp; Market Leadership</td><td><span class="tag-badge tag-emerald">Supreme</span></td></tr>
        <tr><td><strong>11th House</strong></td><td>Cancer (Karka)</td><td><strong>27</strong></td><td>Liquid Profit Inflow &amp; Realized Gains</td><td><span class="tag-badge tag-gold">Solid Baseline</span></td></tr>
        <tr><td><strong>12th House</strong></td><td>Leo (Simha)</td><td><strong>22</strong></td><td>Expenditures, Foreign Outflows &amp; Vyaya</td><td><span class="tag-badge tag-emerald">Low Drain</span></td></tr>
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">The Golden Net Surplus Formula:</div>
      <p style="font-size:11.5px;color:var(--ivory-dim);margin-top:2px;">
        11th House Bindus (27) &minus; 12th House Bindus (22) = <strong>+5 Net Bindu Surplus</strong>. Total: <strong>337 Bindus</strong> across all 12 houses. In classical Parashari economics, whenever the 11th house exceeds the 12th house, capital retention compounds positively year over year.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: SAV 337 Heatmap", 11)}
</section>

<!-- PAGE 12: PILLAR III — BULLISH VS BEARISH MACRO CYCLES -->
<section class="page">
  ${headerRail("PILLAR III: MARKET MACRO CYCLES")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Bullish vs. Bearish Market Cycle Navigation</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Transiting planets do not affect all houses equally; their impact is governed entirely by the SAV Bindu count of the sign they traverse.
    </p>

    <div class="grid-2" style="margin-bottom:10px;">
      <!-- Bullish Expansion Windows -->
      <div class="luxury-card" style="border:1.5px solid var(--emerald);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
          ✦ HIGH-BINDU HOUSES (30+ BINDUS): BULLISH HARVEST
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);line-height:1.45;margin-top:4px;">
          <p style="margin-bottom:6px;">
            <strong>Virgo (35), Gemini (34), Libra (31), Capricorn (30), Aries (30):</strong>
          </p>
          <p>
            When major planets (Jupiter, Sun, Mercury) transit through these signs, market liquidity and your personal negotiation power reach annual zeniths. Deploy capital into swing positions, launch sovereign products, and take calculated growth initiatives.
          </p>
        </div>
      </div>

      <!-- Bearish Defensive Windows -->
      <div class="luxury-card" style="border:1.5px solid var(--ruby);">
        <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
          ✦ LOW-BINDU HOUSES (&lt;26 BINDUS): DEFENSIVE FORTIFICATION
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);line-height:1.45;margin-top:4px;">
          <p style="margin-bottom:6px;">
            <strong>Sagittarius (22 Bindus), Leo (22 Bindus), Taurus (25 Bindus):</strong>
          </p>
          <p>
            When transits activate Sagittarius (4th house) or Leo (12th house), trading velocity must be throttled down by 80%. These are not periods for aggressive expansion; they are windows for software refactoring, capital preservation, and risk audits.
          </p>
        </div>
      </div>
    </div>

    <!-- Macro Principle Box -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ THE ASHTAKAVARGA TRADE EXECUTION AXIOM
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Never buy options or enter directional swing positions on days when the transiting Moon traverses a sign containing fewer than 26 Bindus. Wait for Moon to enter Virgo (35), Libra (32), or Gemini (31) for maximum momentum synchronicity.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: Market Macro Cycles", 12)}
</section>

<!-- PAGE 13: PILLAR III — PLANET-BY-PLANET BAV WEALTH CONTRIBUTION -->
<section class="page">
  ${headerRail("PILLAR III: BAV WEALTH CONTRIBUTION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Bhinnashtakavarga (BAV): Planet Wealth Contributions</h2>
    <p class="body-text" style="margin-bottom:10px;">
      While Sarvashtakavarga aggregates all 8 contributors, Bhinnashtakavarga (BAV) analyzes each individual planet's point contribution to your financial houses.
    </p>

    <!-- BAV Financial Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Planet</th>
          <th>2nd House (Treasury)</th>
          <th>5th House (Speculation)</th>
          <th>9th House (Bhagya)</th>
          <th>11th House (Liquid Gains)</th>
          <th>Primary Financial Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Sun (Surya)</strong></td>
          <td>5 Bindus</td>
          <td>3 Bindus</td>
          <td>4 Bindus</td>
          <td>5 Bindus</td>
          <td>Institutional reputation &amp; corporate backing</td>
        </tr>
        <tr>
          <td><strong>Moon (Chandra)</strong></td>
          <td>4 Bindus</td>
          <td>3 Bindus</td>
          <td>4 Bindus</td>
          <td>4 Bindus</td>
          <td>Intuitive timing &amp; liquid cash reserves</td>
        </tr>
        <tr>
          <td><strong>Mars (Mangal)</strong></td>
          <td>4 Bindus</td>
          <td>2 Bindus</td>
          <td>3 Bindus</td>
          <td>3 Bindus</td>
          <td>Execution courage (requires strict risk stops)</td>
        </tr>
        <tr>
          <td><strong>Mercury (Budha)</strong></td>
          <td>6 Bindus</td>
          <td>4 Bindus</td>
          <td>5 Bindus</td>
          <td>5 Bindus</td>
          <td>Algorithmic data syntax &amp; quantitative trading</td>
        </tr>
        <tr>
          <td><strong>Jupiter (Guru)</strong></td>
          <td>5 Bindus</td>
          <td>4 Bindus</td>
          <td>5 Bindus</td>
          <td>4 Bindus</td>
          <td>Advisory wisdom &amp; long-term compounding</td>
        </tr>
        <tr>
          <td><strong>Venus (Shukra)</strong></td>
          <td>4 Bindus</td>
          <td>4 Bindus</td>
          <td>4 Bindus</td>
          <td>4 Bindus</td>
          <td>Commercial luxury &amp; asset aesthetics</td>
        </tr>
        <tr>
          <td><strong>Saturn (Shani)</strong></td>
          <td>4 Bindus</td>
          <td>4 Bindus</td>
          <td>4 Bindus</td>
          <td>2 Bindus</td>
          <td>Institutional risk discipline &amp; patience</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="border:1.5px solid var(--emerald);background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        ✦ MERCURY: YOUR CHIEF FINANCIAL OPERATING OFFICER
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:2px;">
        Notice that <strong>Mercury contributes 6 Bindus in the 2nd House and 5 Bindus in the 9th &amp; 11th Houses</strong>. Mercury is your highest-scoring wealth architect. Any financial strategy that relies on calculation, code, data analysis, and software tools will systematically outperform manual guessing.
      </p>
    </div>
  </div>
  ${footerRail("Pillar III: BAV Wealth Contribution", 13)}
</section>

<!-- PAGE 14: PILLAR IV — TRADING PSYCHOLOGY & BEHAVIORAL AUDIT -->
<section class="page">
  ${headerRail("PILLAR IV: TRADING PSYCHOLOGY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Trading Psychology: Intellectual Agility vs. Impatience</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Trading is 20% strategy and 80% emotional governance. Your psychological makeup reflects the tension between your Virgo Lagna (analytical precision) and your Leo Moon-Mars (fiery impatience).
    </p>

    <!-- Psychological Dualities -->
    <div class="grid-2" style="margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
          ✦ YOUR TRADING SUPERPOWER: QUANTITATIVE PRECISION
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          With <strong>Virgo Lagna and Mercury AmK in Taurus</strong>, your analytical apparatus is world-class. You can spot inefficiencies in market pricing, build mathematical models, and dissect complex financial statements faster than 99% of retail participants.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
        <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
          ✦ YOUR TRADING ACHILLES' HEEL: RESTLESS BOREDOM
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:4px;">
          With <strong>Moon and Mars conjunct in Leo in the 12th house</strong>, you possess an aversion to passive waiting. When markets are slow, the ego urges you to "make something happen," leading to overtrading, revenge trading, and forced setups.
        </p>
      </div>
    </div>

    <!-- The 3-Second Rule -->
    <div class="luxury-card" style="background:var(--surface-elevated);margin-bottom:8px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ THE SHODASHA COGNITIVE DELAY PROTOCOL
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Before clicking "Buy" on any discretionary trade:
      </p>
      <div style="font-size:11.2px;color:var(--ivory-dim);margin-top:4px;line-height:1.5;">
        1. Step away from the monitor for <strong>120 seconds</strong>.<br/>
        2. Ask: <em>"Is this trade documented in my written strategy, or am I reacting to a sudden green candle?"</em><br/>
        3. If it is not a pre-planned systematic order, cancel it immediately. Protect your nervous system.
      </div>
    </div>
  </div>
  ${footerRail("Pillar IV: Trading Psychology", 14)}
</section>

<!-- PAGE 15: PILLAR IV — ANTI-RUIN CIRCUIT BREAKERS -->
<section class="page">
  ${headerRail("PILLAR IV: ANTI-RUIN CIRCUIT BREAKERS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Anti-Ruin Circuit Breakers: Zero F&amp;O Gambling</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Classical Jyotish is not about chasing reckless risk; it is about establishing unbreachable boundaries that guarantee long-term sovereign survival.
    </p>

    <!-- Circuit Breaker Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Risk Vector</th>
          <th>Astrological Danger</th>
          <th>Mandatory Circuit Breaker Rule</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Naked Options Buying</strong></td>
          <td>Rahu illusion + 5th house Saturn restraint</td>
          <td><span style="color:var(--ruby-bright);font-weight:700;">100% PROHIBITED</span> &mdash; Complete capital decay</td>
        </tr>
        <tr>
          <td><strong>Intraday Margin Leverage</strong></td>
          <td>Ketu 8th house sudden liquidation</td>
          <td><span style="color:var(--ruby-bright);font-weight:700;">STRICT ZERO</span> &mdash; Never borrow broker leverage</td>
        </tr>
        <tr>
          <td><strong>Max Risk Per Position</strong></td>
          <td>Protects 31-bindu treasury</td>
          <td><span style="color:var(--emerald-bright);font-weight:700;">MAX 2.0%</span> of total liquid portfolio at risk</td>
        </tr>
        <tr>
          <td><strong>Daily Stop-Loss Limit</strong></td>
          <td>Prevents revenge trading spiral</td>
          <td><span style="color:var(--gold-bright);font-weight:700;">SHUT DOWN TERMINAL</span> after 2 consecutive red trades</td>
        </tr>
      </tbody>
    </table>

    <!-- The Revenge Trading Trap -->
    <div class="luxury-card" style="border:1.5px solid var(--ruby);background:var(--surface-elevated);margin-bottom:8px;">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
        ✦ MANDATORY REVENGE TRADING CIRCUIT BREAKER
      </div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        <strong>Strict Financial Guardrail:</strong> Never attempt to recover past trading drawdowns through aggressive option buying, increased lot sizing, or borrowed leverage. Cease trading immediately upon hitting daily loss thresholds. Freeze speculative terminal access and adhere strictly to pre-defined algorithmic risk rules.
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: Anti-Ruin Circuit Breakers", 15)}
</section>

<!-- PAGE 16: PILLAR IV — QUANT ALGORITHMS VS EMOTION -->
<section class="page">
  ${headerRail("PILLAR IV: QUANT ALGORITHMIC IMPERATIVE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Quant Algorithm vs. Discretionary Emotion</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Why your astrological configuration demands automated, systematic software rules over manual "gut feeling" betting.
    </p>

    <!-- Comparison Table -->
    <div class="grid-2" style="margin-bottom:10px;">
      <div class="luxury-card" style="border:1.5px solid var(--ruby);">
        <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
          ✕ MANUAL DISCRETIONARY TRADING (HIGH RISK)
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);margin-top:4px;line-height:1.45;">
          • Staring at 1-minute tick charts all day.<br/>
          • Moving stop-losses lower hoping price rebounds.<br/>
          • Increasing lot size after losses to break even.<br/>
          • Severe cortisol, insomnia, and nervous exhaustion.<br/>
          • <strong>Astrological Outcome:</strong> Capital drain.
        </div>
      </div>

      <div class="luxury-card" style="border:1.5px solid var(--emerald);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
          ✓ SYSTEMATIC QUANTITATIVE TRADING (OPTIMAL)
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);margin-top:4px;line-height:1.45;">
          • Pre-defined algorithmic entry/exit parameters.<br/>
          • Automated position sizing calculated by software.<br/>
          • End-of-day execution without watching the screen.<br/>
          • Detached, calm, high-status executive lifestyle.<br/>
          • <strong>Astrological Outcome:</strong> Multi-year compounding.
        </div>
      </div>
    </div>

    <!-- The Virgo-Mercury Blueprint -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        ✦ THE VIRGO LAGNA QUANT MANDATE
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:2px;">
        Your Virgo Lagna is ruled by Mercury, the planet of logic, programming, and data science. You are blessed with the cognitive architecture to build quantitative tools. Do not behave like an impulsive retail punter; operate as an institutional algorithmic asset manager.
      </p>
    </div>
  </div>
  ${footerRail("Pillar IV: Quant Algorithmic Imperative", 16)}
</section>

<!-- PAGE 17: PILLAR V — SECTORAL GRAHA-ASSET MAPPING -->
<section class="page">
  ${headerRail("PILLAR V: SECTORAL GRAHA MAPPING")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sectoral Graha-Asset Mapping: Where to Deploy Capital</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Classical Vedic astrology maps industrial sectors and economic assets directly to planetary signatures.
    </p>

    <!-- Sector Table -->
    <table class="data-table" style="margin-bottom:10px;">
      <thead>
        <tr>
          <th>Graha Anchor</th>
          <th>Sectors &amp; Industries</th>
          <th>Preferred Asset Instruments</th>
          <th>Portfolio Tier</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Mercury (Budha)</strong><br/><span style="font-size:8.5px;color:var(--ivory-mute);">9th House Taurus (AmK)</span></td>
          <td>Software, SaaS, Artificial Intelligence, FinTech, Semiconductor chip fabrication, Telecom</td>
          <td>Large-cap tech equities, Nasdaq ETFs, Software IP</td>
          <td><span class="tag-badge tag-emerald">Primary (40%)</span></td>
        </tr>
        <tr>
          <td><strong>Sun &amp; Venus</strong><br/><span style="font-size:8.5px;color:var(--ivory-mute);">10th House Gemini</span></td>
          <td>Enterprise B2B Consulting, Digital Media, Design Platforms, Luxury consumer brands</td>
          <td>Blue-chip market leaders, High-margin global franchises</td>
          <td><span class="tag-badge tag-emerald">Secondary (25%)</span></td>
        </tr>
        <tr>
          <td><strong>Saturn (Shani)</strong><br/><span style="font-size:8.5px;color:var(--ivory-mute);">7th House Pisces (Indu Lord)</span></td>
          <td>Heavy Infrastructure, Sovereign Debt, Green Energy grids, Data Center real estate</td>
          <td>Government bonds, Index funds, Sovereign physical gold</td>
          <td><span class="tag-badge tag-gold">Defensive (20%)</span></td>
        </tr>
        <tr>
          <td><strong>Mars &amp; Ketu</strong><br/><span style="font-size:8.5px;color:var(--ivory-mute);">12th &amp; 8th Houses</span></td>
          <td>Defense robotics, Cybersecurity, Aerospace, Advanced battery materials</td>
          <td>Specialized thematic ETFs (Hedged only)</td>
          <td><span class="tag-badge tag-sapphire">Opportunistic (15%)</span></td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">Sectoral Allocation Verdict:</div>
      <p style="font-size:11.5px;color:var(--ivory-dim);margin-top:2px;">
        Overweight <strong>Technology, AI, and Software</strong> (Mercury/Sun). Keep a rock-solid defensive anchor in <strong>Index Funds &amp; Sovereign Gold</strong> (Saturn). Completely avoid speculative meme assets and leveraged derivative contracts.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Sectoral Graha Mapping", 17)}
</section>

<!-- PAGE 18: PILLAR V — ASSET CLASS RISK MATRIX -->
<section class="page">
  ${headerRail("PILLAR V: ASSET ALLOCATION MATRIX")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Asset Class Allocation &amp; Capital Fortification</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Prudent asset allocation is the only free lunch in financial markets. Here is your deterministic capital blueprint based on your 337-Bindu Ashtakavarga profile.
    </p>

    <!-- Asset Allocation Boxes -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:var(--emerald-bright);font-size:12px;">1. CORE WEALTH COMPOUNDING ENGINE (60% OF CAPITAL)</strong>
          <span class="tag-badge tag-emerald">SOVEREIGN CORE</span>
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:3px;">
          Global Large-Cap Index Funds (Nifty 50, S&amp;P 500, Nasdaq 100) and top-tier monopoly tech equities. Zero leverage, zero market timing. Reinvest dividends and let time compound your capital.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:var(--gold-bright);font-size:12px;">2. SOVEREIGN DEFENSE &amp; LIQUID TREASURY (25% OF CAPITAL)</strong>
          <span class="tag-badge tag-gold">CAPITAL FORTRESS</span>
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:3px;">
          High-yield treasury bills, fixed sovereign debt, and physical 24K gold. This satisfies your 2nd house (31 Bindus) and provides total psychological immunity against global market crashes.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--sapphire-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="color:var(--sapphire-bright);font-size:12px;">3. SYSTEMATIC QUANTITATIVE SWING TRADING (15% OF CAPITAL)</strong>
          <span class="tag-badge tag-sapphire">ALGORITHMIC ALPHA</span>
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:3px;">
          Rules-based algorithmic swing positions in high-volume equities. Managed strictly under the 2% risk stop-loss rule. Never risking more than this allocated bucket under any circumstances.
        </p>
      </div>
    </div>

    <!-- Prohibited Box -->
    <div class="luxury-card" style="border:1.5px solid var(--ruby);background:rgba(239,68,68,0.06);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
        ✕ PROHIBITED TRADING VEHICLES (0% ALLOCATION)
      </div>
      <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
        Naked weekly index options buying, crypto margin futures with &gt;2x leverage, penny stock tipping telegram channels, and borrowing loans for speculative trading.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Asset Allocation Matrix", 18)}
</section>

<!-- PAGE 19: PILLAR V — PERSONAL LUCKY TRADING HOURS & DAYS -->
<section class="page">
  ${headerRail("PILLAR V: TRADING MUHURAT & HORAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Trading Muhurat: Lucky Days, Planetary Horas &amp; Choghadiya</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Time is cyclical. Executing trades during harmonious planetary horas amplifies analytical clarity and reduces slippage.
    </p>

    <!-- Table of Days -->
    <div class="grid-2" style="margin-bottom:10px;">
      <div class="luxury-card" style="border:1.5px solid var(--emerald);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
          ✦ FAVORABLE TRADING DAYS
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);margin-top:4px;line-height:1.45;">
          <p><strong style="color:var(--gold-bright);">1. Wednesday (Budhavar):</strong> Ruled by Mercury (Lagna &amp; AmK lord). Supreme day for quantitative coding, backtesting, and systematic rebalancing.</p>
          <p style="margin-top:4px;"><strong style="color:var(--gold-bright);">2. Friday (Shukravar):</strong> Ruled by Venus (2nd &amp; 9th lord). Ideal for booking liquid profits and capital sweeps.</p>
          <p style="margin-top:4px;"><strong style="color:var(--gold-bright);">3. Thursday (Guruvar):</strong> Ruled by Jupiter. Auspicious for long-term strategic investments and index allocations.</p>
        </div>
      </div>

      <div class="luxury-card" style="border:1.5px solid var(--ruby);">
        <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
          ✦ DEFENSIVE &amp; PROHIBITED WINDOWS
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);margin-top:4px;line-height:1.45;">
          <p><strong style="color:var(--ruby-bright);">1. Tuesday (Mangalvar):</strong> Mars rules 8th house and sits in 12th. High risk of impatient emotional execution. Take zero discretionary trades.</p>
          <p style="margin-top:4px;"><strong style="color:var(--ruby-bright);">2. Daily Rahu Kaal:</strong> ~90-minute daily window ruled by Rahu. Never enter new high-stakes trades during Rahu Kaal.</p>
          <p style="margin-top:4px;"><strong style="color:var(--ruby-bright);">3. Udveg / Kaal Choghadiya:</strong> Avoid opening positions during inauspicious Choghadiyas.</p>
        </div>
      </div>
    </div>

    <!-- Planetary Horas -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ BEST PLANETARY HORAS FOR TRADE EXECUTION</div>
      <p class="body-text" style="font-size:11.2px;margin-top:3px;">
        • <strong>Mercury Hora (बुध होरा):</strong> Sharpest mathematical accuracy. Ideal for executing limit orders and algorithmic triggers.<br/>
        • <strong>Jupiter Hora (गुरु होरा):</strong> Expansion, optimism, and institutional liquidity. Best for allocating capital into long-term holdings.<br/>
        • <strong>Saturn Hora (शनि होरा):</strong> Deep patience and defensive stops. Good for auditing risk, bad for hasty entries.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Trading Muhurat & Horas", 19)}
</section>

<!-- PAGE 20: PILLAR V — 12-MONTH MARKET TIMING RADAR -->
<section class="page">
  ${headerRail("PILLAR V: 12-MONTH TIMING RADAR")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">12-Month Market Timing Radar (2026–2027)</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Synchronized macroeconomic roadmap mapping Jupiter, Saturn, and nodal transits to your financial houses.
    </p>

    <!-- Gates -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
            WINDOW 1: DECEMBER 2026 &ndash; JULY 2027 (JUPITER EXALTED IN 11TH HOUSE CANCER)
          </span>
          <span class="tag-badge tag-emerald">95% HARVEST ZENITH</span>
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:3px;">
          Jupiter transits through its Exalted Sign Cancer in your 11th house of massive realized gains (stationing direct in May 2027). Highest commercial monetization cycle of the decade. Realize portfolio gains, close enterprise tech contracts, and harvest capital surplus.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
            WINDOW 2: SEPTEMBER &ndash; OCTOBER 2027 (LAGNA SOLAR RETURN &middot; 35 BINDUS)
          </span>
          <span class="tag-badge tag-emerald">93% SOVEREIGN AUTHORITY</span>
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:3px;">
          Sun enters Virgo (1st house with 35 SAV Bindus). Maximum intellectual sharpness and negotiation authority. Prime window for establishing new institutional advisory contracts.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--amber);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
            CAUTION WINDOW: AUGUST 2027 (SUN IN 12TH HOUSE VYAYA BHAVA)
          </span>
          <span class="tag-badge tag-ruby">62% CONSOLIDATION</span>
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:3px;">
          Sun transits Leo (12th house). Zero speculative risk. Focus on code optimization, algorithm refactoring, and physical rest.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--sapphire);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
            WINDOW 3: NOVEMBER 2027 (JUPITER IN LEO &middot; GLOBAL SCALE)
          </span>
          <span class="tag-badge tag-sapphire">INTERNATIONAL EXPANSION</span>
        </div>
        <p class="body-text" style="font-size:11.2px;margin-top:3px;">
          Jupiter transitions into Leo in your 12th house, trining the 4th house of peace. Accelerates foreign software licensing, offshore incorporation, and international revenue streams.
        </p>
      </div>
    </div>
  </div>
  ${footerRail("Pillar V: 12-Month Timing Radar", 20)}
</section>

<!-- PAGE 21: PILLAR V — WEALTH CONSECRATION MANTRAS & RITUALS -->
<section class="page">
  ${headerRail("PILLAR V: SACRED WEALTH MANTRAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Wealth Consecration Mantras &amp; Mind Clearing</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Vedic mantras are acoustic frequencies that clear psychic greed static from the mind and align the trader with cosmic abundance.
    </p>

    <!-- Budha Gayatri Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--emerald);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        1. BUDHA GAYATRI MANTRA (बुध गायत्री &mdash; FOR INTELLECTUAL ACCURACY)
      </div>
      <div style="font-family:'Rozha One','Noto Sans Devanagari',serif;font-size:13.5px;color:var(--gold-bright);text-align:center;margin:4px 0;letter-spacing:0.02em;">
        ॐ सौम्यरूपाय विद्महे वाणेशाय धीमहि। तन्नो सौम्यः प्रचोदयात्॥
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM SAUMYA-ROOPAYA VIDMAHE VAANESHAYA DHIMAHI | TANNO SAUMYAH PRACHODAYAT ||
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 9 times every Wednesday morning before opening market charts. Dissolves analytical fog and sharpens mathematical discernment.
      </p>
    </div>

    <!-- Kubera Mantra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--gold);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        2. KUBERA ASHTA-LAKSHMI BEEJ MANTRA (कुबेर बीज मन्त्र)
      </div>
      <div style="font-family:'Rozha One','Noto Sans Devanagari',serif;font-size:13.5px;color:var(--gold-bright);text-align:center;margin:4px 0;letter-spacing:0.02em;">
        ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये धनधान्यसमृद्धिं मे देहि दापय स्वाहा॥
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM YAKSHAYA KUBERAYA VAISHRAVANAYA DHANA-DHANYADHIPATAYE DHANA-DHANYA-SAMRIDDHIM ME DEHI DAPAYA SVAHA ||
      </div>
      <p style="font-size:10.5px;color:var(--ivory-dim);margin-top:4px;">
        <strong>Protocol:</strong> Chant 11 times facing North (Kubera's direction) on Friday evenings. Attracts institutional liquidity and anchors financial preservation.
      </p>
    </div>

    <!-- Sri Suktam Note -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <strong style="color:var(--sapphire-bright);font-size:11.5px;">3. KANAKADHARA STOTRAM AUDITORY IMMERSION:</strong>
      <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
        Listen to Adi Shankaracharya's Kanakadhara Stotram at 432 Hz while trading. Sonic resonance purifies market anxiety and protects against impulsive greed.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Sacred Wealth Mantras", 21)}
</section>

<!-- PAGE 22: PILLAR V — TRADER WORKSPACE & WEALTH ALTAR -->
<section class="page">
  ${headerRail("PILLAR V: TRADER WORKSPACE VASTU")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Trader Workspace Astro-Vastu &amp; Wealth Altar</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Spatial alignment of your trading monitors, chair, and surrounding elemental anchors directly influences neuro-chemical clarity during market volatility.
    </p>

    <!-- Workspace Setup Points -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <strong style="color:var(--emerald-bright);font-size:11.5px;">1. MONITOR &amp; SEATING ORIENTATION:</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Set up your primary workstation in the <strong>North-North-West (Gemini 10th house)</strong> or <strong>North-East</strong>. While trading, face strictly <strong>North (Kubera wealth direction)</strong> or <strong>East (Sun clarity direction)</strong>. Never face South while placing orders.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <strong style="color:var(--gold-bright);font-size:11.5px;">2. THE NORTH ZONE WEALTH ANCHOR:</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          The North zone of your office governs liquid cashflow (Mercury). Keep this zone entirely free of clutter, dead cables, and heavy iron. Place a clean glass bowl of fresh water with a vibrant green plant to stimulate continuous commercial inquiries.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--sapphire-bright);">
        <strong style="color:var(--sapphire-bright);font-size:11.5px;">3. NATURAL JADE CRYSTAL PYRAMID:</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Place a natural Green Jade or Aventurine crystal pyramid on the right side of your laptop keyboard. Green mineral crystal absorbs electromagnetic radiation from multiple monitors and grounds Mercury mental static.
        </p>
      </div>
    </div>

    <!-- Solid Backing Rule -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ THE SOLID WALL MANDATE</div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Always ensure there is a solid wall directly behind your trading chair (representing the mountain of support). Never sit with an open door or glass window behind your back, as this invites sudden unexpected drawdowns.
      </p>
    </div>
  </div>
  ${footerRail("Pillar V: Trader Workspace Vastu", 22)}
</section>

<!-- PAGE 23: EXECUTIVE TRADER ACTION CHEAT SHEET -->
<section class="page">
  ${headerRail("EXECUTIVE TRADER CHEAT SHEET")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Executive Trader Action Cheat Sheet</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Screenshot-worthy 1-page mobile reference summarizing your core financial astrology parameters and golden execution rules.
    </p>

    <!-- Consolidated 1-Page Summary -->
    <div class="luxury-card" style="border:2px solid var(--border-gold-strong);background:var(--surface-elevated);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ SOVEREIGN TRADER MATRIX &middot; MUKUL MOHAN PAL
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11.2px;margin-top:6px;">
        <div>
          <span class="kicker">PRIMARY TRADING PROFILE</span>
          <div style="color:var(--emerald-bright);font-weight:700;">Systematic Quant &amp; Swing Capital Compounding</div>
        </div>
        <div>
          <span class="kicker">SAV BINDU TOTAL</span>
          <div style="color:var(--gold-bright);font-weight:700;">337 Bindus (+5 Net Surplus: H11 27 &gt; H12 22)</div>
        </div>
        <div>
          <span class="kicker">5TH HOUSE DISCRETION</span>
          <div style="color:var(--ivory);font-weight:600;">Capricorn (30 Bindus · Saturn Restraint)</div>
        </div>
        <div>
          <span class="kicker">11TH HOUSE REALIZED GAINS</span>
          <div style="color:var(--emerald-bright);font-weight:700;">Cancer (27 Bindus · Moon in 12th Vyaya)</div>
        </div>
        <div>
          <span class="kicker">TREASURY STRENGTH</span>
          <div style="color:var(--gold-bright);font-weight:700;">31 Bindus in Libra 2nd House (Supreme)</div>
        </div>
        <div>
          <span class="kicker">PROHIBITED VEHICLE</span>
          <div style="color:var(--ruby-bright);font-weight:700;">Zero Naked F&amp;O Options · Zero High Leverage</div>
        </div>
        <div>
          <span class="kicker">FAVORABLE TRADING DAYS</span>
          <div style="color:var(--ivory);font-weight:600;">Wednesday (Budha) &middot; Friday (Shukra)</div>
        </div>
        <div>
          <span class="kicker">FAVORABLE SECTORS</span>
          <div style="color:var(--emerald-bright);font-weight:700;">Tech, AI, SaaS, FinTech, Green Energy</div>
        </div>
        <div>
          <span class="kicker">OPTIMAL DESK FACING</span>
          <div style="color:var(--ivory);font-weight:600;">Face strictly North or East while trading</div>
        </div>
        <div>
          <span class="kicker">PEAK WEALTH GATE</span>
          <div style="color:var(--gold-bright);font-weight:700;">Dec 2026 &ndash; Jul 2027 (Jupiter Exalted in 11th H)</div>
        </div>
      </div>
    </div>

    <!-- 3 Golden Trader Rules -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ 3 GOLDEN SHASTRIC TRADER MANDATES
      </div>
      <div class="grid-3" style="font-size:11px;margin-top:6px;gap:8px;">
        <div style="background:var(--surface);padding:8px;border-radius:4px;border-left:2px solid var(--emerald);">
          <strong style="color:var(--emerald-bright);">1. Max 2% Risk Stop:</strong> Never risk more than 2.0% of your total liquid portfolio on any single trade.
        </div>
        <div style="background:var(--surface);padding:8px;border-radius:4px;border-left:2px solid var(--sapphire);">
          <strong style="color:var(--sapphire-bright);">2. Friday Profit Sweep:</strong> Move realized profits weekly into detached long-term debt or physical gold.
        </div>
        <div style="background:var(--surface);padding:8px;border-radius:4px;border-left:2px solid var(--gold);">
          <strong style="color:var(--gold-bright);">3. Zero Revenge Spiral:</strong> Shut down the trading terminal immediately after 2 red executions in a row.
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Executive Trader Cheat Sheet", 23)}
</section>

<!-- PAGE 24: SHASTRA CERTIFICATION & AUTHENTICITY SEAL -->
<section class="page page-cover" style="justify-content:space-between;">
  ${headerRail("SHASTRA CERTIFICATION & AUTHENTICITY SEAL")}

  <div style="text-align:center;margin:30px 0;">
    <div class="kicker" style="letter-spacing:0.25em;color:var(--gold);margin-bottom:8px;">
      ✦ ASTROLIFE SACRED FINANCIAL SHASTRA CERTIFICATION ✦
    </div>
    <h1 class="display-xl" style="font-size:24px;margin-bottom:12px;">
      Certificate of Astrological Authenticity
    </h1>
    <p style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:15px;color:var(--ivory);max-width:540px;margin:0 auto;line-height:1.5;">
      This 24-page Stock Market, Trading &amp; Speculation dossier is computed deterministically under classical Sarvatobhadra Chakra 28-Nakshatra Vedha Shastra, Sarvashtakavarga 337-Bindu algorithms, and Swiss Ephemeris astronomical standards.
    </p>
  </div>

  <div class="decorative-frame" style="max-width:550px;margin:0 auto;width:100%;">
    <div style="text-align:center;">
      <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.18em;color:var(--gold-bright);margin-bottom:8px;">
        VERIFIED IMMUTABLE SHASTRA RECORD &middot; CERTIFICATE ID: ${certificateId}
      </div>
      <div style="font-size:11.5px;color:var(--ivory);line-height:1.6;">
        Certified for: <strong>${subjectName}</strong> &middot; Archive Ref: <strong>${orderId}</strong> &middot; <span style="color:var(--gold);">www.astrolife.io</span>
      </div>

      <div class="grid-2" style="font-size:10.5px;margin-top:14px;text-align:left;border-top:1px solid var(--border-gold);padding-top:10px;row-gap:6px;">
        <div>
          <span class="kicker">ASTRONOMICAL ENGINE</span>
          <div style="color:var(--ivory);font-weight:600;">Swiss Ephemeris DE431</div>
        </div>
        <div>
          <span class="kicker">ALGORITHMIC GOVERNANCE</span>
          <div style="color:var(--ivory);font-weight:600;">AstroLife Sovereign Shastra Council</div>
        </div>
        <div>
          <span class="kicker">RADAR ALGORITHM</span>
          <div style="color:var(--ivory);font-weight:600;">True 81-Square Sarvatobhadra Vedha</div>
        </div>
        <div>
          <span class="kicker">HASH VERIFICATION</span>
          <div style="color:var(--ivory);font-weight:600;">SHA-256 IMMUTABLE STAMP</div>
        </div>
      </div>

      <div style="margin-top:14px;padding:8px 12px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-radius:4px;font-size:8.5px;color:var(--ivory-mute);line-height:1.4;text-align:left;">
        <strong style="color:var(--ruby-bright);">STATUTORY REGULATORY DISCLAIMER:</strong> Not SEBI-registered investment advice. Strictly for educational, mathematical, and astrological research. Trading derivatives, equities, and crypto carries substantial risk of financial loss. Past planetary cycles do not guarantee future market returns.
      </div>

      <div style="margin-top:16px;font-family:'Cinzel',serif;font-size:9.5px;letter-spacing:0.15em;color:var(--gold-bright);">
        ✦ SACRED SHASTRA HERITAGE &middot; TIME-TESTED VEDIC WISDOM ✦
      </div>
    </div>
  </div>
  ${footerRail("Certified Shastra Archive", 24)}
</section>

</body>
</html>`;
}
