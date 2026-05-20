// ============================================================
// AstroLife — HTML Report Generator
// Generates a full HTML document for browser print-to-PDF.
// No jsPDF dependency. All layout is CSS/HTML.
// ============================================================

import type { ChartData } from "./astro-engine/calculations";
import { calculateRemedies } from "./astro-engine/remedy";
import { calculateLalKitab } from "./astro-engine/lalkitab";
import { calculateLalKitabTimeEngine } from "./lal-kitab";
import {
  composeVedicParagraph,
  composeLKParagraph,
  composePsychOmenParagraph,
  composeUpcomingMDParagraph,
} from "./astro-engine/dasha-composer";
import {
  getMahadashaInterpretation,
} from "./astro-engine/dasha-interpretations";
import {
  PLANET_HOUSE_RULES,
  HOME_OMEN_RULES,
  HOUSE_WISE_OMENS,
  RIN_RULES,
  COMBINATION_RULES,
} from "./astro-engine/lalkitab-knowledge";
// Phase-1 expansion: rich engines for the 120-page premium report
import { detectYogas, type YogaResult } from "./astro-engine/yogas";
import { calculateShadbala } from "./astro-engine/shadbala";
import { calculateDivisional, getNavamshaAnalysis, getDashamshaAnalysis } from "./astro-engine/divisional";
import { calculateMedical } from "./astro-engine/medical";
import { calculatePsychology } from "./astro-engine/psychology";
import { calculateNumerology } from "./astro-engine/numerology";
import { calculateAshtakavarga } from "./astro-engine/ashtakavarga";

export type ReportPalette = "midnight" | "saffron" | "ivory" | "forest" | "maroon";
export type ReportCover   = "wheel" | "lagnalord";
export interface ReportOptions {
  type: "full" | "kundli" | "remedy" | "medical" | "destiny";
  palette?: ReportPalette;
  cover?: ReportCover;
}

export const REPORT_PAGE_SIZE = {
  width: 820,
  height: 1160,
} as const;

export const REPORT_PALETTES = ["midnight", "saffron", "ivory", "forest", "maroon"] as const;
export const REPORT_COVERS = ["wheel", "lagnalord"] as const;

export interface ReportEngineContext {
  reportId: string;
  generatedAt: string;
  settings: Required<ReportOptions>;
  birth: {
    name: string;
    dob: string;
    tob: string;
    city: string;
    latitude: number;
    longitude: number;
    timezone: number;
  };
  engines: {
    kundli: { status: "ready"; lagna: string; lagnaNum: number; planetCount: number };
    panchang: { status: "ready" | "partial"; moonNakshatra: string; moonRashi: string; tithi: string };
    dasha: { status: "ready" | "missing"; currentMahadasha: string; currentAntardasha: string; nextMahadashas: number };
    yogas: { status: "covered" | "pending"; note: string };
    doshas: { status: "covered" | "pending"; note: string };
    shadbala: { status: "proxy" | "pending"; note: string };
    divisionalCharts: { status: "covered" | "pending"; note: string };
    transit: { status: "covered" | "pending"; note: string };
    remedies: { status: "ready" | "missing"; urgentCount: number; topPlanet: string };
    astroSound: { status: "covered" | "pending"; note: string };
    vastu: { status: "covered" | "pending"; note: string };
    familySynastry: { status: "covered" | "pending"; note: string };
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(d: Date): string {
  const months = ["January","February","March","April","May","June",
    "July","August","September","October","November","December"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatDateShort(d: Date): string {
  const months = ["Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function isReportPalette(value: unknown): value is ReportPalette {
  return typeof value === "string" && REPORT_PALETTES.includes(value as ReportPalette);
}

function isReportCover(value: unknown): value is ReportCover {
  return typeof value === "string" && REPORT_COVERS.includes(value as ReportCover);
}

export function normalizeReportOptions(options?: Partial<ReportOptions>): Required<ReportOptions> {
  const validTypes: ReportOptions["type"][] = ["full", "kundli", "remedy", "medical", "destiny"];
  const type = options?.type && validTypes.includes(options.type) ? options.type : "full";
  return {
    type,
    palette: isReportPalette(options?.palette) ? options.palette : "midnight",
    cover: isReportCover(options?.cover) ? options.cover : "wheel",
  };
}

function makeReportId(chart: ChartData, generatedAt: string): string {
  const seed = `${chart.name}|${chart.dob}|${chart.tob}|${chart.city}|${generatedAt}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = Math.imul(31, hash) + seed.charCodeAt(i) | 0;
  }
  return `AL-${new Date(generatedAt).getFullYear()}-${Math.abs(hash).toString(36).toUpperCase().padStart(6, "0").slice(0, 6)}`;
}

export function buildReportEngineContext(chart: ChartData, options?: Partial<ReportOptions>): ReportEngineContext {
  const settings = normalizeReportOptions(options);
  const generatedAt = new Date().toISOString();
  const activeMD = chart.dashas.find(d => d.active) ?? chart.dashas[0];
  const activeAD = chart.antardasha.find(d => d.active) ?? chart.antardasha[0];
  const moon = chart.planets["Moon"];
  const remedies = calculateRemedies(chart);

  return {
    reportId: makeReportId(chart, generatedAt),
    generatedAt,
    settings,
    birth: {
      name: chart.name,
      dob: chart.dob,
      tob: chart.tob,
      city: chart.city,
      latitude: chart.lat,
      longitude: chart.lon,
      timezone: chart.tz,
    },
    engines: {
      kundli: {
        status: "ready",
        lagna: chart.lagnaRashi,
        lagnaNum: chart.lagnaNum,
        planetCount: Object.keys(chart.planets).length,
      },
      panchang: {
        status: moon ? "partial" : "partial",
        moonNakshatra: moon ? `${moon.nakshatra} Pada ${moon.pada}` : "Unavailable",
        moonRashi: moon?.sign ?? "Unavailable",
        tithi: "Derived panchang details are shown where available in chart data.",
      },
      dasha: {
        status: activeMD ? "ready" : "missing",
        currentMahadasha: activeMD?.planet ?? "Unavailable",
        currentAntardasha: activeAD?.planet ?? "Unavailable",
        nextMahadashas: chart.dashas.filter(d => new Date(d.end) > new Date() && !d.active).length,
      },
      yogas: { status: "covered", note: "Yoga analysis remains in the calculation engine and report modules." },
      doshas: { status: "covered", note: "Dosha checks are available through the core interpretation stack." },
      shadbala: { status: "proxy", note: "Basic strength indicator shown; full six-fold shadbala calculation available in the app." },
      divisionalCharts: { status: "covered", note: "Divisional-chart data can be added as a dedicated premium chapter." },
      transit: { status: "covered", note: "Transit analysis is available in the app and can be surfaced in this template." },
      remedies: {
        status: remedies.cards.length > 0 ? "ready" : "missing",
        urgentCount: remedies.urgentCount,
        topPlanet: remedies.cards[0]?.planet ?? "Unavailable",
      },
      astroSound: { status: "covered", note: "AstroSound/voice report has a separate engine and can feed summary text here." },
      vastu: { status: "covered", note: "Vastu complete analysis and calculator live as separate experiences." },
      familySynastry: { status: "pending", note: "Synastry needs second-person birth data before it can be rendered in this report." },
    },
  };
}

// ── Sign / planet lookup maps ─────────────────────────────────────────────

const SIGN_RULER: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter",
};

const SIGN_GLYPH: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋", Leo: "♌",
  Virgo: "♍", Libra: "♎", Scorpio: "♏", Sagittarius: "♐",
  Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

const PLANET_ABBR: Record<string, string> = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
  Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
};

const PLANET_SANSKRIT: Record<string, string> = {
  Sun: "सूर्य", Moon: "चन्द्र", Mars: "मंगल", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

const BEEJ_MANTRA: Record<string, string> = {
  Sun:     "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः ॥",
  Moon:    "ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः ॥",
  Mars:    "ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥",
  Mercury: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः ॥",
  Jupiter: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ॥",
  Venus:   "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः ॥",
  Saturn:  "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः ॥",
  Rahu:    "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः ॥",
  Ketu:    "ॐ स्त्रां स्त्रीं स्त्रौं सः केतवे नमः ॥",
};

const BEEJ_ROMAN: Record<string, string> = {
  Sun:     "oṁ hrāṁ hrīṁ hrauṁ saḥ sūryāya namaḥ",
  Moon:    "oṁ śrāṁ śrīṁ śrauṁ saḥ candramase namaḥ",
  Mars:    "oṁ krāṁ krīṁ krauṁ saḥ bhaumāya namaḥ",
  Mercury: "oṁ brāṁ brīṁ brauṁ saḥ budhāya namaḥ",
  Jupiter: "oṁ grāṁ grīṁ grauṁ saḥ gurave namaḥ",
  Venus:   "oṁ drāṁ drīṁ drauṁ saḥ śukrāya namaḥ",
  Saturn:  "oṁ prāṁ prīṁ prauṁ saḥ śanaiścarāya namaḥ",
  Rahu:    "oṁ bhrāṁ bhrīṁ bhrauṁ saḥ rāhave namaḥ",
  Ketu:    "oṁ strāṁ strīṁ strauṁ saḥ ketave namaḥ",
};

const TUTELARY_DEITY: Record<string, { sa: string; en: string; epithet: string }> = {
  Sun:     { sa: "श्री सूर्य",    en: "Surya",  epithet: "Light-giver · Lord of Arogya" },
  Moon:    { sa: "श्री चन्द्र",   en: "Chandra", epithet: "Mind-lord · Nourisher" },
  Mars:    { sa: "श्री मंगल",     en: "Mangala", epithet: "Courage-lord · Skanda" },
  Mercury: { sa: "श्री विष्णु",   en: "Vishnu",  epithet: "Sustainer · the four-armed" },
  Jupiter: { sa: "श्री बृहस्पति", en: "Brihaspati", epithet: "Guru of the Devas" },
  Venus:   { sa: "श्री लक्ष्मी",  en: "Lakshmi", epithet: "Goddess of grace & abundance" },
  Saturn:  { sa: "श्री शनि",      en: "Shani",   epithet: "Lord of karma & justice" },
  Rahu:    { sa: "श्री दुर्गा",   en: "Durga",   epithet: "Destroyer of illusions" },
  Ketu:    { sa: "श्री गणेश",    en: "Ganesha",  epithet: "Remover of obstacles" },
};

// North Indian chart house text positions (x, y)
const HOUSE_POSITIONS: Record<number, [number, number]> = {
  1: [180, 70],  2: [100, 62],  3: [62, 108],  4: [70, 183],
  5: [62, 258],  6: [100, 302], 7: [180, 302], 8: [260, 302],
  9: [298, 258], 10: [290, 183], 11: [298, 108], 12: [260, 62],
};

// ── North Indian Chart SVG ────────────────────────────────────────────────

function renderNorthIndianChart(chart: ChartData): string {
  // Group planets + ascendant by house
  const houseContents: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseContents[h] = [];

  // Ascendant in house 1
  houseContents[1].push(`As`);

  for (const [name, pd] of Object.entries(chart.planets)) {
    const abbr = PLANET_ABBR[name] ?? name.slice(0, 2);
    const house = pd.house >= 1 && pd.house <= 12 ? pd.house : 1;
    houseContents[house].push(abbr + (pd.retrograde ? "(R)" : ""));
  }

  // Build planet labels at house positions
  let labels = "";
  // lagnaNum is 0-indexed in calculations.ts (Math.floor(lagnaLon / 30)):
  //   Aries=0, Taurus=1, ..., Aquarius=10, Pisces=11
  // Bhava h holds sign (lagnaNum + h - 1) mod 12
  for (let h = 1; h <= 12; h++) {
    const [cx, cy] = HOUSE_POSITIONS[h];
    const items = houseContents[h];
    const signIdx = ((chart.lagnaNum + (h - 1)) % 12 + 12) % 12;
    // Display sign as 1-indexed number (1=Aries ... 12=Pisces) — traditional
    // North Indian chart convention
    const signNumber = signIdx + 1;

    labels += `<text x="${cx}" y="${cy - 10}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="10" fill="#8C7440">${signNumber}</text>`;

    // Multi-planet layout: ≤3 planets stack 1 column, 4+ use 2 columns
    // and a smaller font so they never overflow into adjacent houses.
    if (items.length <= 3) {
      const fontSize = items.length === 0 ? 10 : 10;
      const lineH    = 13;
      // Center vertically around cy + 6
      const startY = cy + 6 - ((items.length - 1) * lineH) / 2;
      items.forEach((item, i) => {
        labels += `<text x="${cx}" y="${startY + i * lineH}" text-anchor="middle" font-family="Inter,sans-serif" font-size="${fontSize}" fill="#C9A961">${esc(item)}</text>`;
      });
    } else {
      // 2-column compact layout — never overflow even with 6+ planets
      const fontSize = 8.5;
      const lineH    = 10;
      const colDx    = 13;
      const rows     = Math.ceil(items.length / 2);
      const startY   = cy + 4 - ((rows - 1) * lineH) / 2;
      items.forEach((item, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = cx + (col === 0 ? -colDx / 2 : colDx / 2);
        const y = startY + row * lineH;
        labels += `<text x="${x}" y="${y}" text-anchor="middle" font-family="Inter,sans-serif" font-size="${fontSize}" fill="#C9A961">${esc(item)}</text>`;
      });
    }
  }

  return `<svg width="360" height="360" viewBox="0 0 360 360">
  <!-- Grid lines (North Indian diamond) -->
  <g stroke="#C9A961" stroke-width="0.6" fill="none" opacity="0.5">
    <!-- Outer square -->
    <rect x="10" y="10" width="340" height="340"/>
    <!-- Inner diamond -->
    <polygon points="180,10 350,180 180,350 10,180"/>
    <!-- Corner triangles -->
    <line x1="10" y1="10" x2="180" y2="10"/>
    <line x1="10" y1="10" x2="10" y2="180"/>
    <!-- cross lines -->
    <line x1="10" y1="10" x2="180" y2="180"/>
    <line x1="350" y1="10" x2="180" y2="180"/>
    <line x1="350" y1="350" x2="180" y2="180"/>
    <line x1="10" y1="350" x2="180" y2="180"/>
    <!-- top, right, bottom, left mid-edges -->
    <line x1="10" y1="10" x2="350" y2="10"/>
    <line x1="350" y1="10" x2="350" y2="350"/>
    <line x1="350" y1="350" x2="10" y2="350"/>
    <line x1="10" y1="350" x2="10" y2="10"/>
    <!-- inner cross to corners of outer -->
    <line x1="180" y1="10" x2="350" y2="10"/>
    <line x1="10" y1="180" x2="10" y2="350"/>
    <line x1="180" y1="350" x2="10" y2="350"/>
    <line x1="350" y1="180" x2="350" y2="350"/>
  </g>
  ${labels}
</svg>`;
}

// ── CSS content (styles.css with @import removed) ─────────────────────────

const STYLES_CSS = `
:root {
  --bg: #0A0E1F;
  --bg-2: #0E1428;
  --surface: #11162E;
  --surface-2: #161D38;
  --line: rgba(201, 169, 97, 0.18);
  --line-strong: rgba(201, 169, 97, 0.35);
  --gold: #C9A961;
  --gold-bright: #D9BE7B;
  --gold-dim: #8C7440;
  --saffron: #E8923C;
  --violet: #8B7BC4;
  --crimson: #C9555F;
  --jade: #6FB58A;
  --ivory: #F4EFE6;
  --ivory-dim: #C8C1B0;
  --ivory-mute: #8A8474;
  --cream: #F2ECDF;
  --cream-dark: #1A1F3A;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: #07091a;
  color: var(--ivory);
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  padding: 48px 24px 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.page {
  position: relative;
  width: 820px;
  min-height: 1160px;
  background: var(--bg);
  color: var(--ivory);
  overflow: hidden;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.04) inset,
    0 30px 60px -20px rgba(0,0,0,0.7),
    0 60px 120px -40px rgba(0,0,0,0.5);
  padding: 64px 72px;
  display: flex;
  flex-direction: column;
}

.page.cream {
  background: var(--cream);
  color: var(--cream-dark);
}

.page.dense { padding: 56px 64px; }

.display-xl { font-family:'Cormorant Garamond',serif; font-weight:400; font-size:76px; line-height:0.98; letter-spacing:-0.01em; }
.display-l  { font-family:'Cormorant Garamond',serif; font-weight:400; font-size:56px; line-height:1.02; letter-spacing:-0.005em; }
.display-m  { font-family:'Cormorant Garamond',serif; font-weight:500; font-size:38px; line-height:1.1;  letter-spacing:-0.005em; }
.display-s  { font-family:'Cormorant Garamond',serif; font-weight:500; font-size:26px; line-height:1.15; }
.serif-italic { font-family:'Cormorant Garamond',serif; font-style:italic; font-weight:400; }
.devanagari { font-family:'Noto Serif Devanagari',serif; font-weight:500; }
.eyebrow { font-family:'Inter',sans-serif; font-weight:500; font-size:10.5px; letter-spacing:0.28em; text-transform:uppercase; color:var(--gold); }
.kicker  { font-family:'Inter',sans-serif; font-weight:500; font-size:11px;   letter-spacing:0.2em;  text-transform:uppercase; color:var(--ivory-mute); }
.body    { font-family:'Inter',sans-serif; font-size:13.5px; line-height:1.65; color:var(--ivory-dim); }
.body-l  { font-family:'Inter',sans-serif; font-size:15px;   line-height:1.65; color:var(--ivory-dim); }
.body-s  { font-family:'Inter',sans-serif; font-size:12px;   line-height:1.55; color:var(--ivory-mute); }
.mono,.tabular { font-family:'JetBrains Mono',monospace; font-variant-numeric:tabular-nums; }

.page-rail {
  display:flex; align-items:center; justify-content:space-between;
  padding-bottom:18px; border-bottom:1px solid var(--line);
}
.page-rail .brand {
  display:flex; align-items:center; gap:10px;
  font-family:'Cormorant Garamond',serif; font-style:italic;
  font-size:18px; letter-spacing:0.02em; color:var(--gold);
}
.page-rail .brand-mark { width:18px; height:18px; }
.page-rail .chapter { font-family:'Inter',sans-serif; font-size:10.5px; letter-spacing:0.28em; text-transform:uppercase; color:var(--ivory-mute); }
.page-rail .pagenum  { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--gold); letter-spacing:0.1em; }

.page-foot {
  margin-top:auto; padding-top:18px; border-top:1px solid var(--line);
  display:flex; align-items:center; justify-content:space-between;
  font-family:'Inter',sans-serif; font-size:10.5px; letter-spacing:0.22em;
  text-transform:uppercase; color:var(--ivory-mute);
}

.page.cream .page-foot  { color:rgba(26,31,58,0.5); border-top-color:rgba(26,31,58,0.15); }
.page.cream .page-rail  { border-bottom-color:rgba(26,31,58,0.15); }
.page.cream .page-rail .chapter { color:rgba(26,31,58,0.55); }
.page.cream .page-rail .pagenum { color:#8C7440; }
.page.cream .page-rail .brand   { color:#8C7440; }
.page.cream .eyebrow  { color:#8C7440; }
.page.cream .kicker   { color:rgba(26,31,58,0.5); }
.page.cream .body     { color:rgba(26,31,58,0.78); }
.page.cream .body-l   { color:rgba(26,31,58,0.82); }
.page.cream .body-s   { color:rgba(26,31,58,0.6); }

.starfield {
  position:absolute; inset:0;
  background-image:
    radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.5) 0, transparent 100%),
    radial-gradient(1px 1px at 88% 32%, rgba(255,255,255,0.45) 0, transparent 100%),
    radial-gradient(1.5px 1.5px at 24% 78%, rgba(201,169,97,0.55) 0, transparent 100%),
    radial-gradient(1px 1px at 72% 62%, rgba(255,255,255,0.4) 0, transparent 100%),
    radial-gradient(1px 1px at 48% 92%, rgba(255,255,255,0.4) 0, transparent 100%),
    radial-gradient(1px 1px at 36% 12%, rgba(255,255,255,0.35) 0, transparent 100%),
    radial-gradient(1.2px 1.2px at 92% 88%, rgba(201,169,97,0.5) 0, transparent 100%),
    radial-gradient(1px 1px at 8% 56%, rgba(255,255,255,0.4) 0, transparent 100%),
    radial-gradient(1px 1px at 64% 8%, rgba(255,255,255,0.35) 0, transparent 100%),
    radial-gradient(1px 1px at 54% 44%, rgba(255,255,255,0.3) 0, transparent 100%);
  pointer-events:none; opacity:0.9;
}
.glow-tl { position:absolute; top:-200px; left:-200px; width:600px; height:600px; background:radial-gradient(circle, rgba(201,169,97,0.18), transparent 60%); pointer-events:none; }
.glow-br { position:absolute; bottom:-240px; right:-200px; width:700px; height:700px; background:radial-gradient(circle, rgba(139,123,196,0.16), transparent 60%); pointer-events:none; }

.card {
  background:linear-gradient(180deg, var(--surface), var(--surface-2));
  border:1px solid var(--line); border-radius:4px; padding:20px; position:relative;
}
.card.gold-edge {
  border-color:var(--line-strong);
  box-shadow:0 0 0 1px rgba(201,169,97,0.05), inset 0 1px 0 rgba(255,255,255,0.03);
}
.hairline { height:1px; background:var(--line); border:none; }
.hairline.gold { background:linear-gradient(90deg, transparent, var(--gold), transparent); opacity:0.6; }

.pullquote {
  font-family:'Cormorant Garamond',serif; font-style:italic; font-weight:400;
  font-size:22px; line-height:1.4; color:var(--gold-bright); letter-spacing:0.005em;
}

.badge {
  display:inline-flex; align-items:center; gap:6px; padding:4px 10px;
  border:1px solid var(--line-strong); border-radius:99px;
  font-family:'Inter',sans-serif; font-size:10px; letter-spacing:0.18em;
  text-transform:uppercase; color:var(--gold); background:rgba(201,169,97,0.04);
}
.badge.saffron { color:var(--saffron); border-color:rgba(232,146,60,0.4);  background:rgba(232,146,60,0.04); }
.badge.violet  { color:var(--violet);  border-color:rgba(139,123,196,0.4); background:rgba(139,123,196,0.04); }
.badge.jade    { color:var(--jade);    border-color:rgba(111,181,138,0.4); background:rgba(111,181,138,0.04); }
.badge.crimson { color:var(--crimson); border-color:rgba(201,85,95,0.4);   background:rgba(201,85,95,0.04); }

.section-title { display:flex; align-items:baseline; gap:14px; }
.section-num { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.18em; color:var(--gold); }
.section-title h2 { font-family:'Cormorant Garamond',serif; font-weight:500; font-size:30px; line-height:1.1; letter-spacing:-0.005em; }

.ornament-divider {
  display:flex; align-items:center; justify-content:center; gap:14px; padding:14px 0;
  color:var(--gold); opacity:0.6;
}
.ornament-divider::before,.ornament-divider::after {
  content:''; height:1px; width:80px;
  background:linear-gradient(90deg, transparent, var(--gold), transparent);
}
.ornament-divider .lozenge { width:8px; height:8px; border:1px solid var(--gold); transform:rotate(45deg); display:inline-block; }

.page-watermark {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  pointer-events:none; color:var(--gold); opacity:0.04;
  font-family:'Cormorant Garamond',serif; font-style:italic; font-size:280px; letter-spacing:-0.04em; z-index:0;
}

.toc-row {
  display:grid; grid-template-columns:36px 1fr auto 36px;
  align-items:baseline; gap:14px; padding:9px 0; border-bottom:1px dashed var(--line);
}
.toc-row .num   { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--gold); letter-spacing:0.1em; }
.toc-row .title { font-family:'Cormorant Garamond',serif; font-size:18px; color:var(--ivory); font-weight:500; }
.toc-row .meta  { font-family:'Inter',sans-serif; font-size:11px; color:var(--ivory-mute); letter-spacing:0.06em; }
.toc-row .pg    { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--gold-bright); text-align:right; }

.toc-part-heading { display:flex; align-items:baseline; gap:14px; margin:22px 0 10px; }
.toc-part-heading .part-no   { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.24em; color:var(--gold); text-transform:uppercase; }
.toc-part-heading .part-name { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:22px; color:var(--gold-bright); }

.al-wordmark { font-family:'Cormorant Garamond',serif; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; }
.cover-wordmark { font-family:'Cormorant Garamond',serif; font-weight:300; letter-spacing:0.42em; text-transform:uppercase; font-size:14px; color:var(--gold); }

.ornament { display:inline-flex; align-items:center; gap:14px; color:var(--gold); }
.ornament::before,.ornament::after { content:''; height:1px; width:60px; background:linear-gradient(90deg, transparent, var(--gold), transparent); opacity:0.6; }
.ornament svg { display:block; }

.cover-mark-bg { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:1; }

.dropcap::first-letter {
  font-family:'Cormorant Garamond',serif; font-weight:400; font-style:italic;
  font-size:88px; line-height:0.85; float:left; padding:10px 14px 0 0; color:var(--gold-bright);
}
.foreword-col { column-count:2; column-gap:32px; column-rule:1px solid var(--line); }
.foreword-col p { margin-bottom:12px; break-inside:avoid; }

/* Palette overrides */
body.palette-saffron {
  --bg:#1A0F0A; --bg-2:#221308; --surface:#2A180C; --surface-2:#321D10;
  --line:rgba(232,146,60,0.22); --line-strong:rgba(232,146,60,0.42);
  --gold:#E8923C; --gold-bright:#F4A85A; --gold-dim:#94591F; --saffron:#F4A85A;
  --violet:#C99F6B; --ivory:#FAEFE0; --ivory-dim:#D9C5A8; --ivory-mute:#9B8366;
}
body.palette-ivory .page:not(.cream) {
  background:#F2ECDF; color:#1A1F3A;
  --bg:#F2ECDF; --bg-2:#EAE3D2; --surface:#ECE5D3; --surface-2:#E3DAC4;
  --line:rgba(26,31,58,0.14); --line-strong:rgba(26,31,58,0.3); --gold:#8C7440;
  --gold-bright:#A38851; --ivory:#1A1F3A; --ivory-dim:rgba(26,31,58,0.78); --ivory-mute:rgba(26,31,58,0.55);
}
body.palette-forest {
  --bg:#0A1812; --bg-2:#0F2118; --surface:#122A1F; --surface-2:#163424;
  --line:rgba(201,169,97,0.16); --line-strong:rgba(201,169,97,0.32);
  --gold:#C9A961; --gold-bright:#E3C97A; --gold-dim:#8C7440; --saffron:#E8C46A;
  --violet:#6FB58A; --ivory:#F0EBDE; --ivory-dim:#BFB89F; --ivory-mute:#7C7765;
}
body.palette-maroon {
  --bg:#1A080C; --bg-2:#220B10; --surface:#2A0F15; --surface-2:#34141C;
  --line:rgba(212,166,86,0.18); --line-strong:rgba(212,166,86,0.36);
  --gold:#D4A656; --gold-bright:#EAC275; --gold-dim:#8E6F39; --saffron:#E8923C;
  --violet:#B07B8C; --ivory:#F4ECD8; --ivory-dim:#CFC3A6; --ivory-mute:#8A7E66;
}
`;

// ── Shared SVG mark ────────────────────────────────────────────────────────

const BRAND_MARK_SVG = `<svg class="brand-mark" viewBox="-12 -12 24 24"><circle r="10" stroke="var(--gold)" stroke-width="0.6" fill="none"/><polygon points="0,-6 5.2,3 -5.2,3" fill="none" stroke="var(--gold)" stroke-width="0.6"/><polygon points="0,6 5.2,-3 -5.2,-3" fill="none" stroke="var(--gold)" stroke-width="0.6"/><circle r="1.5" fill="var(--gold)"/></svg>`;

const BRAND_MARK_CREAM = `<svg class="brand-mark" viewBox="-12 -12 24 24"><circle r="10" stroke="#8C7440" stroke-width="0.6" fill="none"/><polygon points="0,-6 5.2,3 -5.2,3" fill="none" stroke="#8C7440" stroke-width="0.6"/><polygon points="0,6 5.2,-3 -5.2,-3" fill="none" stroke="#8C7440" stroke-width="0.6"/><circle r="1.5" fill="#8C7440"/></svg>`;

function pageRail(chapter: string, pagenum: string, cream = false): string {
  const mark = cream ? BRAND_MARK_CREAM : BRAND_MARK_SVG;
  return `<div class="page-rail" style="position:relative;z-index:2;">
    <div class="brand">${mark}AstroLife</div>
    <div class="chapter">${esc(chapter)}</div>
    <div class="pagenum">${esc(pagenum)}</div>
  </div>`;
}

function pageFoot(left: string, right: string): string {
  return `<div class="page-foot"><span>${esc(left)}</span><span>${esc(right)}</span></div>`;
}

// ── Page 1: Cover – Wheel ─────────────────────────────────────────────────

function page1Wheel(chart: ChartData): string {
  const sunSign  = chart.planets["Sun"]?.sign  ?? "";
  const moonSign = chart.planets["Moon"]?.sign ?? "";
  const sunGlyph  = SIGN_GLYPH[sunSign]  ?? "";
  const moonGlyph = SIGN_GLYPH[moonSign] ?? "";
  const lagnaGlyph = SIGN_GLYPH[chart.lagnaRashi] ?? "";
  const today = formatDate(new Date());

  return `<section class="page" style="padding:48px 56px;">
  <div class="starfield"></div>
  <div class="glow-tl"></div>
  <div class="glow-br"></div>

  <!-- Background zodiac wheel -->
  <div class="cover-mark-bg">
    <svg width="780" height="780" viewBox="-390 -390 780 780" style="opacity:0.18;">
      <circle r="340" fill="none" stroke="#C9A961" stroke-width="0.4"/>
      <circle r="300" fill="none" stroke="#C9A961" stroke-width="0.6"/>
      <circle r="296" fill="none" stroke="#C9A961" stroke-width="0.3"/>
      <g stroke="#C9A961" stroke-width="0.3" opacity="0.7">
        <line x1="0" y1="-340" x2="0" y2="-300"/>
        <line x1="170" y1="-294.4" x2="150" y2="-259.8"/>
        <line x1="294.4" y1="-170" x2="259.8" y2="-150"/>
        <line x1="340" y1="0" x2="300" y2="0"/>
        <line x1="294.4" y1="170" x2="259.8" y2="150"/>
        <line x1="170" y1="294.4" x2="150" y2="259.8"/>
        <line x1="0" y1="340" x2="0" y2="300"/>
        <line x1="-170" y1="294.4" x2="-150" y2="259.8"/>
        <line x1="-294.4" y1="170" x2="-259.8" y2="150"/>
        <line x1="-340" y1="0" x2="-300" y2="0"/>
        <line x1="-294.4" y1="-170" x2="-259.8" y2="-150"/>
        <line x1="-170" y1="-294.4" x2="-150" y2="-259.8"/>
      </g>
      <g font-family="Inter" font-size="22" fill="#C9A961" text-anchor="middle" dominant-baseline="middle">
        <text x="160" y="-277">♈</text><text x="277" y="-160">♉</text>
        <text x="320" y="0">♊</text><text x="277" y="160">♋</text>
        <text x="160" y="277">♌</text><text x="0" y="320">♍</text>
        <text x="-160" y="277">♎</text><text x="-277" y="160">♏</text>
        <text x="-320" y="0">♐</text><text x="-277" y="-160">♑</text>
        <text x="-160" y="-277">♒</text><text x="0" y="-320">♓</text>
      </g>
      <g stroke="#C9A961" stroke-width="0.3" fill="none" opacity="0.5">
        <circle r="220"/><circle r="180"/>
      </g>
    </svg>
  </div>

  <!-- Top brand rail -->
  <div style="display:flex;justify-content:space-between;align-items:center;position:relative;z-index:3;">
    <div style="display:flex;align-items:center;gap:14px;">
      <svg width="32" height="32" viewBox="-16 -16 32 32" fill="none">
        <circle r="14" stroke="#C9A961" stroke-width="0.8"/>
        <polygon points="0,-9 8,5 -8,5" fill="none" stroke="#C9A961" stroke-width="0.8"/>
        <polygon points="0,9 8,-5 -8,-5" fill="none" stroke="#C9A961" stroke-width="0.8"/>
        <circle r="2.4" fill="#E8923C"/>
      </svg>
      <span class="cover-wordmark">AstroLife</span>
    </div>
    <div class="kicker" style="color:var(--gold-dim)">Vol. I · MMXXVI</div>
  </div>

  <!-- Center stage -->
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;z-index:3;">
    <div class="eyebrow" style="margin-bottom:24px;opacity:0.7;">Personalised Vedic Intelligence</div>
    <div style="text-align:center;">
      <div style="font-family:'Cormorant Garamond',serif;font-weight:300;font-size:108px;line-height:0.92;letter-spacing:-0.025em;color:var(--ivory);">Your</div>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;font-size:128px;line-height:0.9;letter-spacing:-0.03em;color:var(--gold-bright);margin-top:-6px;">Cosmic</div>
      <div style="font-family:'Cormorant Garamond',serif;font-weight:300;font-size:108px;line-height:0.92;letter-spacing:-0.025em;color:var(--ivory);">Blueprint</div>
    </div>
    <div style="display:flex;align-items:center;gap:18px;margin-top:40px;">
      <div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,var(--gold));"></div>
      <svg width="18" height="18" viewBox="-10 -10 20 20">
        <polygon points="0,-8 7,4 -7,4" fill="none" stroke="#C9A961" stroke-width="0.7"/>
        <polygon points="0,8 7,-4 -7,-4" fill="none" stroke="#C9A961" stroke-width="0.7"/>
      </svg>
      <div style="width:80px;height:1px;background:linear-gradient(90deg,var(--gold),transparent);"></div>
    </div>
    <div class="serif-italic" style="font-size:18px;color:var(--ivory-mute);margin-top:24px;">prepared exclusively for</div>
    <div style="font-family:'Cormorant Garamond',serif;font-weight:400;font-size:46px;color:var(--ivory);margin-top:8px;letter-spacing:0.005em;">${esc(capitalize(chart.name))}</div>
    <div class="mono" style="font-size:11px;color:var(--gold);letter-spacing:0.24em;text-transform:uppercase;margin-top:8px;">${lagnaGlyph} &nbsp; ${esc(chart.lagnaRashi)} Ascendant &nbsp;·&nbsp; ${sunGlyph} &nbsp; ${esc(sunSign)} Sun &nbsp;·&nbsp; ${moonGlyph} &nbsp; ${esc(moonSign)} Moon</div>
  </div>

  <!-- Bottom block -->
  <div style="position:relative;z-index:3;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:24px;padding-top:24px;border-top:1px solid var(--line);">
    <div>
      <div class="kicker" style="margin-bottom:6px;">Born</div>
      <div class="serif-italic" style="font-size:16px;color:var(--ivory);">${esc(chart.dob)}</div>
      <div class="mono" style="font-size:10.5px;color:var(--ivory-mute);margin-top:2px;">${esc(chart.tob)}</div>
    </div>
    <div>
      <div class="kicker" style="margin-bottom:6px;">Place</div>
      <div class="serif-italic" style="font-size:16px;color:var(--ivory);">${esc(chart.city)}</div>
      <div class="mono" style="font-size:10.5px;color:var(--ivory-mute);margin-top:2px;">${chart.lat.toFixed(2)}°N · ${chart.lon.toFixed(2)}°E</div>
    </div>
    <div>
      <div class="kicker" style="margin-bottom:6px;">Issued</div>
      <div class="serif-italic" style="font-size:16px;color:var(--ivory);">${today}</div>
      <div class="mono" style="font-size:10.5px;color:var(--ivory-mute);margin-top:2px;">v2 · AstroLife</div>
    </div>
    <div style="text-align:right;">
      <div class="kicker" style="margin-bottom:6px;">Edition</div>
      <div class="serif-italic" style="font-size:16px;color:var(--gold-bright);">Premium</div>
      <div class="mono" style="font-size:10.5px;color:var(--gold);margin-top:2px;">AL · 2026</div>
    </div>
  </div>
</section>`;
}

// ── Page 1B: Cover – Lagna Lord ───────────────────────────────────────────

function page1LagnaLord(chart: ChartData): string {
  const lagnaLord = SIGN_RULER[chart.lagnaRashi] ?? "Jupiter";
  const llPlanet = chart.planets[lagnaLord];
  const llSign = llPlanet?.sign ?? "";
  const llHouse = llPlanet?.house ?? 1;
  const llDeg = llPlanet ? `${llPlanet.degree}°${llPlanet.minutes}'` : "";
  const llAbbr = (PLANET_ABBR[lagnaLord] ?? lagnaLord.slice(0,2)).toUpperCase();
  const deity = TUTELARY_DEITY[lagnaLord] ?? TUTELARY_DEITY["Jupiter"];
  const mantra = BEEJ_MANTRA[lagnaLord] ?? "";
  const mantraRoman = BEEJ_ROMAN[lagnaLord] ?? "";
  const firstName = esc(capitalize(chart.name.split(" ")[0]));

  const weekdayMap: Record<string, string> = {
    Sun:"Sundays", Moon:"Mondays", Mars:"Tuesdays", Mercury:"Wednesdays",
    Jupiter:"Thursdays", Venus:"Fridays", Saturn:"Saturdays",
    Rahu:"Saturdays", Ketu:"Tuesdays",
  };
  const weekday = weekdayMap[lagnaLord] ?? "auspicious days";

  return `<section class="page" style="padding:48px 56px;">
  <div class="starfield"></div>
  <div class="glow-tl"></div>
  <div class="glow-br"></div>

  <!-- Top brand rail -->
  <div style="display:flex;justify-content:space-between;align-items:center;position:relative;z-index:3;">
    <div style="display:flex;align-items:center;gap:14px;">
      <svg width="32" height="32" viewBox="-16 -16 32 32" fill="none">
        <circle r="14" stroke="var(--gold)" stroke-width="0.8"/>
        <polygon points="0,-9 8,5 -8,5" fill="none" stroke="var(--gold)" stroke-width="0.8"/>
        <polygon points="0,9 8,-5 -8,-5" fill="none" stroke="var(--gold)" stroke-width="0.8"/>
        <circle r="2.4" fill="var(--saffron)"/>
      </svg>
      <span class="cover-wordmark">AstroLife</span>
    </div>
    <div class="kicker" style="color:var(--gold-dim);">Vol. I · MMXXVI</div>
  </div>

  <div style="text-align:center;margin-top:18px;position:relative;z-index:3;">
    <div class="eyebrow" style="opacity:0.8;">For <span style="color:var(--ivory);">${esc(capitalize(chart.name))}</span> · ${esc(chart.lagnaRashi)} Ascendant</div>
  </div>

  <!-- Hero: Lagna Lord mandala -->
  <div style="flex:1;display:flex;align-items:center;justify-content:center;position:relative;z-index:3;">
    <svg width="460" height="460" viewBox="-230 -230 460 460">
      <defs>
        <radialGradient id="ll-glow" cx="0" cy="0" r="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="var(--gold)" stop-opacity="0.18"/>
          <stop offset="60%" stop-color="var(--gold)" stop-opacity="0.04"/>
          <stop offset="100%" stop-color="var(--gold)" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle r="220" fill="url(#ll-glow)"/>
      <circle r="200" fill="none" stroke="var(--gold)" stroke-width="0.6" opacity="0.55"/>
      <circle r="186" fill="none" stroke="var(--gold)" stroke-width="0.3" opacity="0.45"/>
      <!-- Sanskrit ring labels -->
      <g font-family="Noto Serif Devanagari,serif" font-size="14" fill="var(--gold)" opacity="0.55">
        <text x="0" y="-208" text-anchor="middle">बुध</text>
        <text x="208" y="5" text-anchor="middle">विष्णु</text>
        <text x="0" y="220" text-anchor="middle">मन्त्र</text>
        <text x="-208" y="5" text-anchor="middle">लग्न</text>
      </g>
      <circle r="148" fill="none" stroke="var(--gold)" stroke-width="0.6" opacity="0.55"/>
      <!-- Cardinal symbols -->
      <g transform="translate(0,-148)">
        <circle r="22" fill="var(--bg)" stroke="var(--gold)" stroke-width="0.8"/>
        <path d="M -10 6 Q -10 -8, 0 -8 Q 10 -8, 10 2 Q 10 10, 0 10 Q -5 10, -5 4 Q -5 -1, 1 -1" fill="none" stroke="var(--gold-bright)" stroke-width="1.2" stroke-linecap="round"/>
        <text x="0" y="36" text-anchor="middle" font-family="Inter" font-size="8" fill="var(--gold)" letter-spacing="3">SHANKHA</text>
      </g>
      <g transform="translate(148,0)">
        <circle r="22" fill="var(--bg)" stroke="var(--gold)" stroke-width="0.8"/>
        <circle r="11" fill="none" stroke="var(--gold-bright)" stroke-width="1"/>
        <circle r="4" fill="var(--gold-bright)"/>
        <g stroke="var(--gold-bright)" stroke-width="0.8">
          <line x1="0" y1="-13" x2="0" y2="-7"/><line x1="0" y1="13" x2="0" y2="7"/>
          <line x1="-13" y1="0" x2="-7" y2="0"/><line x1="13" y1="0" x2="7" y2="0"/>
          <line x1="-9.2" y1="-9.2" x2="-5" y2="-5"/><line x1="9.2" y1="9.2" x2="5" y2="5"/>
          <line x1="9.2" y1="-9.2" x2="5" y2="-5"/><line x1="-9.2" y1="9.2" x2="-5" y2="5"/>
        </g>
        <text x="0" y="36" text-anchor="middle" font-family="Inter" font-size="8" fill="var(--gold)" letter-spacing="3">CHAKRA</text>
      </g>
      <g transform="translate(0,148)">
        <circle r="22" fill="var(--bg)" stroke="var(--gold)" stroke-width="0.8"/>
        <g fill="none" stroke="var(--gold-bright)" stroke-width="0.8">
          <path d="M 0 -11 Q 4 -6 0 0 Q -4 -6 0 -11 Z"/>
          <path d="M 0 -11 Q 4 -6 0 0 Q -4 -6 0 -11 Z" transform="rotate(45)"/>
          <path d="M 0 -11 Q 4 -6 0 0 Q -4 -6 0 -11 Z" transform="rotate(90)"/>
          <path d="M 0 -11 Q 4 -6 0 0 Q -4 -6 0 -11 Z" transform="rotate(135)"/>
          <path d="M 0 -11 Q 4 -6 0 0 Q -4 -6 0 -11 Z" transform="rotate(180)"/>
          <path d="M 0 -11 Q 4 -6 0 0 Q -4 -6 0 -11 Z" transform="rotate(225)"/>
          <path d="M 0 -11 Q 4 -6 0 0 Q -4 -6 0 -11 Z" transform="rotate(270)"/>
          <path d="M 0 -11 Q 4 -6 0 0 Q -4 -6 0 -11 Z" transform="rotate(315)"/>
        </g>
        <circle r="2" fill="var(--saffron)"/>
        <text x="0" y="36" text-anchor="middle" font-family="Inter" font-size="8" fill="var(--gold)" letter-spacing="3">PADMA</text>
      </g>
      <g transform="translate(-148,0)">
        <circle r="22" fill="var(--bg)" stroke="var(--gold)" stroke-width="0.8"/>
        <line x1="0" y1="11" x2="0" y2="-4" stroke="var(--gold-bright)" stroke-width="1.4"/>
        <circle cx="0" cy="-8" r="5" fill="none" stroke="var(--gold-bright)" stroke-width="1"/>
        <circle cx="0" cy="-8" r="1.5" fill="var(--gold-bright)"/>
        <text x="0" y="36" text-anchor="middle" font-family="Inter" font-size="8" fill="var(--gold)" letter-spacing="3">GADA</text>
      </g>
      <g stroke="var(--gold)" stroke-width="0.3" opacity="0.35">
        <line x1="-105" y1="-105" x2="105" y2="105"/>
        <line x1="105" y1="-105" x2="-105" y2="105"/>
        <line x1="0" y1="-126" x2="0" y2="126"/>
        <line x1="-126" y1="0" x2="126" y2="0"/>
      </g>
      <circle r="98" fill="none" stroke="var(--gold)" stroke-width="0.5" opacity="0.5"/>
      <g stroke="var(--saffron)" stroke-width="0.5" fill="none" opacity="0.5">
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(30)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(60)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(90)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(120)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(150)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(180)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(210)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(240)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(270)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(300)"/>
        <path d="M 0 -94 Q 14 -78 0 -62 Q -14 -78 0 -94 Z" transform="rotate(330)"/>
      </g>
      <!-- Center glyph -->
      <circle r="58" fill="var(--bg)" stroke="var(--gold)" stroke-width="1"/>
      <circle r="50" fill="none" stroke="var(--gold-dim)" stroke-width="0.4"/>
      <text x="0" y="22" text-anchor="middle" font-family="Cormorant Garamond,serif" font-size="56" fill="var(--gold-bright)" font-weight="400" letter-spacing="2">${llAbbr}</text>
    </svg>
  </div>

  <!-- Mantra block -->
  <div style="text-align:center;padding:14px 0;position:relative;z-index:3;">
    <div class="kicker" style="margin-bottom:10px;">Beej Mantra · Lagna Lord</div>
    <div style="font-family:'Noto Serif Devanagari',serif;font-weight:500;font-size:34px;color:var(--gold-bright);line-height:1.3;letter-spacing:0.01em;">${mantra}</div>
    <div class="serif-italic" style="font-size:15px;color:var(--ivory-dim);margin-top:6px;letter-spacing:0.05em;">${mantraRoman}</div>
    <div class="body-s" style="margin-top:10px;color:var(--ivory-mute);letter-spacing:0.2em;text-transform:uppercase;font-size:10.5px;">108× · ${weekday} · before sunrise · 40-day cycle</div>
  </div>

  <!-- Ornamental rule -->
  <div style="display:flex;align-items:center;justify-content:center;gap:14px;padding:14px 0;position:relative;z-index:3;">
    <div style="width:100px;height:1px;background:linear-gradient(90deg,transparent,var(--gold));"></div>
    <svg width="14" height="14" viewBox="-7 -7 14 14"><rect x="-5" y="-5" width="10" height="10" fill="none" stroke="var(--gold)" stroke-width="0.6" transform="rotate(45)"/></svg>
    <div style="width:100px;height:1px;background:linear-gradient(90deg,var(--gold),transparent);"></div>
  </div>

  <!-- Title & tagline -->
  <div style="text-align:center;position:relative;z-index:3;">
    <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;font-size:74px;line-height:0.95;color:var(--ivory);letter-spacing:-0.01em;">
      Your <span style="color:var(--gold-bright);">Cosmic Blueprint</span>
    </div>
    <div class="serif-italic" style="font-size:18px;color:var(--ivory-mute);margin-top:6px;letter-spacing:0.05em;">— under the patronage of <span class="devanagari" style="font-style:normal;">${deity.sa}</span> ${deity.en}, ${deity.epithet}.</div>
  </div>

  <!-- Bottom info grid -->
  <div style="position:relative;z-index:3;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:18px;padding-top:24px;margin-top:24px;border-top:1px solid var(--line);">
    <div>
      <div class="kicker" style="margin-bottom:4px;">Tutelary deity</div>
      <div style="font-size:18px;color:var(--gold-bright);"><span class="devanagari">${deity.sa}</span> <span class="serif-italic">· ${deity.en}</span></div>
      <div class="body-s mono" style="font-size:10.5px;color:var(--ivory-mute);margin-top:2px;">${deity.epithet}</div>
    </div>
    <div>
      <div class="kicker" style="margin-bottom:4px;">Native</div>
      <div class="serif-italic" style="font-size:16px;color:var(--ivory);">${esc(capitalize(chart.name))}</div>
      <div class="body-s mono" style="font-size:10.5px;color:var(--ivory-mute);margin-top:2px;">${esc(chart.dob)} · ${esc(chart.tob)}</div>
    </div>
    <div>
      <div class="kicker" style="margin-bottom:4px;">Lagna Lord · ${esc(lagnaLord)}</div>
      <div class="serif-italic" style="font-size:16px;color:var(--ivory);">${esc(llSign)} · H${llHouse}</div>
      <div class="body-s mono" style="font-size:10.5px;color:var(--ivory-mute);margin-top:2px;">${llDeg}</div>
    </div>
    <div style="text-align:right;">
      <div class="kicker" style="margin-bottom:4px;">Edition</div>
      <div class="serif-italic" style="font-size:16px;color:var(--gold-bright);">Premium</div>
      <div class="body-s mono" style="font-size:10.5px;color:var(--gold);margin-top:2px;">AL · 2026</div>
    </div>
  </div>

  <div style="display:none">${firstName}</div>
</section>`;
}

// ── Page 2: Welcome Letter ────────────────────────────────────────────────

function page2Welcome(chart: ChartData): string {
  const firstName = esc(capitalize(chart.name.split(" ")[0]));
  return `<section class="page cream">
  ${pageRail("A Letter from Your Astrologer", "2", true)}

  <div style="flex:1;padding-top:36px;">
    <div class="eyebrow" style="margin-bottom:14px;">Welcome</div>
    <div class="display-m" style="color:#1A1F3A;margin-bottom:24px;">Dear ${firstName},</div>

    <div class="foreword-col dropcap body" style="font-size:14px;line-height:1.72;">
      <p>What you hold in your hands — or rather, what is being rendered before your eyes — is not a prediction. It is a mirror. A mirror fashioned from the precise positions of nine planets at the exact moment you drew your first breath, on the meridian of the city that witnessed your arrival into this world.</p>
      <p>Vedic astrology, the <em>Jyotish</em> tradition, is one of the six auxiliary limbs of the Vedas — the <em>Vedangas</em>. It is often translated as "the eye of the Vedas." Its purpose has never been to frighten or flatter. Its purpose is to illuminate — to bring the unseen patterns of a life into the light of awareness, where they can be understood, worked with, and, where necessary, consciously redirected.</p>
      <p>Your chart is entirely unique. Among all seven billion people alive today, no two share the same planetary positions, ascendant, and birthplace. This report has been generated from your personal data: ${esc(capitalize(chart.name))}, born on ${esc(chart.dob)} at ${esc(chart.tob)} in ${esc(chart.city)}.</p>
      <p>The pages that follow move through your chart in layers — from the foundational birth snapshot and planetary positions, through the unfolding time map of Vimshottari Dasha, into the more intimate territories of psychological patterns, karmic debts, environmental omens, and the remedies that tradition prescribes to ease difficulty and amplify grace.</p>
      <p>A word of caution and encouragement in equal measure: astrology is a language of probability and tendency, not of certainty. The planets incline; they do not compel. Your awareness, your choices, and your consistent effort remain the sovereign forces in your life. This report is a sophisticated navigational tool — not a sentence.</p>
      <p>Read slowly. Return to these pages at different seasons of your life. You will find that what seems abstract today becomes vivid and personal as time unfolds. That is the nature of Jyotish: it is most fully understood in retrospect, and most powerfully used in the present.</p>
      <p>With reverence for the tradition that made this possible, and with genuine goodwill for the life you are living —</p>
    </div>

    <div style="margin-top:32px;padding-top:20px;border-top:1px solid rgba(26,31,58,0.15);">
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:26px;color:#1A1F3A;">Your Jyotishi</div>
      <div class="kicker" style="color:#8C7440;margin-top:6px;">AstroLife · Vedic Intelligence System</div>
    </div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Welcome")}
</section>`;
}

// ── Page 3: Foreword ──────────────────────────────────────────────────────

function page3Foreword(): string {
  return `<section class="page cream">
  ${pageRail("On Astrology, Karma & Remedies", "3", true)}

  <div style="flex:1;padding-top:36px;">
    <div class="eyebrow" style="margin-bottom:14px;">Foreword</div>
    <div class="display-m" style="color:#1A1F3A;margin-bottom:6px;">On the <span style="font-style:italic;color:#8C7440;">Art</span> &amp; <span style="font-style:italic;color:#8C7440;">Science</span> of Jyotish</div>
    <div class="body" style="font-size:13.5px;color:rgba(26,31,58,0.6);margin-bottom:24px;max-width:480px;">A brief orientation for those approaching Vedic astrology for the first time — and a reminder for those returning.</div>

    <hr style="border:none;height:1px;background:rgba(26,31,58,0.15);margin-bottom:24px;"/>

    <div class="foreword-col body" style="font-size:13.5px;line-height:1.72;">
      <p><strong>On karma.</strong> The Sanskrit word <em>karma</em> simply means action — and, by extension, the consequences of action. The birth chart is understood in the Jyotish tradition as a map of <em>prarabdha karma</em>: the portion of one's total accumulated karmic ledger that has been activated for this lifetime. It is not the whole ledger. It is the chapter currently open.</p>
      <p><strong>On planets as forces.</strong> The nine <em>grahas</em> — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu — are not, in the Jyotish system, understood as remote rocks orbiting a star. They are forces, or more precisely, they are the visible symbols of invisible principles. The Sun is the principle of consciousness, authority, and the father. The Moon is the principle of the mind, emotion, and the mother. Each graha is a living theme in the story of a human life.</p>
      <p><strong>On remedies.</strong> The Sanskrit word is <em>upaya</em> — it means a means, a way, a path around an obstacle. Vedic remedies are practical interventions drawn from millennia of empirical observation. They operate on the principle that specific sounds, substances, colours, metals, and behavioural changes carry a sympathetic resonance with particular planetary frequencies. The mantra for Saturn, repeated with consistency, is not magic — it is a form of targeted neurological and energetic retraining.</p>
      <p><strong>On Lal Kitab.</strong> Interspersed throughout this report is a second analytical layer from <em>Lal Kitab</em>, the mysterious 19th-century Urdu text whose planetary interpretation, home environment omens, and highly practical remedies offer a uniquely grounded, working-class perspective on the cosmic forces that the classical tradition addresses with more formal Sanskrit scholarship. The two systems are complementary, not contradictory.</p>
      <p><strong>On using this report.</strong> The most productive relationship with this document is one of active inquiry rather than passive reception. When a paragraph resonates with something you have lived, pause and reflect. When something seems implausible, hold it lightly — and return to it in a year. This report is a beginning of a conversation, not an ending.</p>
    </div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Foreword")}
</section>`;
}

// ── Page 4: Table of Contents ─────────────────────────────────────────────

function page4TOC(): string {
  return `<section class="page">
  <div class="starfield"></div>
  <div class="glow-br"></div>
  ${pageRail("Contents", "4")}

  <div style="position:relative;z-index:2;padding-top:22px;flex:1;display:flex;flex-direction:column;">
    <div class="eyebrow" style="margin-bottom:10px;">Twelve Chapters</div>
    <div class="display-l" style="line-height:1;color:var(--ivory);">Contents.</div>
    <hr class="hairline gold" style="margin-top:14px;"/>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0 30px;margin-top:14px;flex:1;font-size:13px;">
      <div>
        <div class="toc-part-heading"><span class="part-no">Part 1</span><span class="part-name">The Chart</span></div>
        <div class="toc-row"><span class="num">1</span><div><div class="title">Birth Snapshot</div><div class="meta">Four pillars · North Indian chart</div></div><div></div><span class="pg">5</span></div>
        <div class="toc-row"><span class="num">2</span><div><div class="title">Planetary Dashboard</div><div class="meta">Nine grahas · Shadbala proxy · Dignity</div></div><div></div><span class="pg">6</span></div>
        <div class="toc-row"><span class="num">3</span><div><div class="title">Yogas</div><div class="meta">Special combinations &amp; rajayoga</div></div><div></div><span class="pg">7</span></div>
        <div class="toc-row"><span class="num">4</span><div><div class="title">Doshas</div><div class="meta">Karmic disturbances · remedies</div></div><div></div><span class="pg">8</span></div>
        <div class="toc-row"><span class="num">5</span><div><div class="title">Shadbala</div><div class="meta">Six-fold strength · all planets</div></div><div></div><span class="pg">9</span></div>
        <div class="toc-row"><span class="num">6</span><div><div class="title">Divisional Charts</div><div class="meta">D9 Navamsa · D10 Dashamsha</div></div><div></div><span class="pg">10</span></div>

        <div class="toc-part-heading"><span class="part-no">Part 2</span><span class="part-name">Time &amp; Mind</span></div>
        <div class="toc-row"><span class="num">7</span><div><div class="title">Vimshottari Dasha</div><div class="meta">Current period interpretation</div></div><div></div><span class="pg">11</span></div>
        <div class="toc-row"><span class="num">8</span><div><div class="title">Upcoming Mahadashas</div><div class="meta">Next periods · forecasts</div></div><div></div><span class="pg">13</span></div>
        <div class="toc-row"><span class="num">9</span><div><div class="title">Birth Nakshatra</div><div class="meta">Janma nakshatra deep dive</div></div><div></div><span class="pg">14</span></div>
      </div>
      <div>
        <div class="toc-part-heading"><span class="part-no">Part 3</span><span class="part-name">Life Areas</span></div>
        <div class="toc-row"><span class="num">10</span><div><div class="title">Health &amp; Wellness</div><div class="meta">Vedic medical · prakriti</div></div><div></div><span class="pg">15</span></div>
        <div class="toc-row"><span class="num">11</span><div><div class="title">Psychology</div><div class="meta">Mind pattern · shadow work</div></div><div></div><span class="pg">16</span></div>
        <div class="toc-row"><span class="num">12</span><div><div class="title">Numerology</div><div class="meta">Life path · destiny · soul urge</div></div><div></div><span class="pg">17</span></div>

        <div class="toc-part-heading"><span class="part-no">Part 4</span><span class="part-name">Remedy &amp; Closing</span></div>
        <div class="toc-row"><span class="num">13</span><div><div class="title">Remedies</div><div class="meta">Mantras · Gems · Practices</div></div><div></div><span class="pg">18</span></div>
        <div class="toc-row"><span class="num">14</span><div><div class="title">Closing</div><div class="meta">A final reflection</div></div><div></div><span class="pg">19</span></div>
        <div class="toc-row"><span class="num">15</span><div><div class="title">Engine Ledger</div><div class="meta">Data modules used in this report</div></div><div></div><span class="pg">20</span></div>
      </div>
    </div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Contents")}
</section>`;
}

// ── Page 5: Birth Snapshot ────────────────────────────────────────────────

function page5BirthSnapshot(chart: ChartData): string {
  const moonPlanet = chart.planets["Moon"];
  const moonNakshatra = moonPlanet ? `${moonPlanet.nakshatra} · Pada ${moonPlanet.pada}` : "—";

  const pillars = [
    { label: "Lagna", value: chart.lagnaRashi, sub: `${SIGN_GLYPH[chart.lagnaRashi] ?? ""} · H1 · Ascendant` },
    { label: "Moon Rashi", value: moonPlanet?.sign ?? "—", sub: moonPlanet ? `${SIGN_GLYPH[moonPlanet.sign] ?? ""} · H${moonPlanet.house}` : "" },
    { label: "Sun Sign", value: chart.planets["Sun"]?.sign ?? "—", sub: `${SIGN_GLYPH[chart.planets["Sun"]?.sign ?? ""] ?? ""} · ☉ Surya` },
    { label: "Moon Nakshatra", value: moonNakshatra, sub: moonPlanet ? `${moonPlanet.nakshatraLord} lord` : "" },
  ];

  const pillarCards = pillars.map(p => `
    <div class="card">
      <div class="kicker" style="margin-bottom:8px;">${esc(p.label)}</div>
      <div class="display-s" style="color:var(--gold-bright);">${esc(p.value)}</div>
      <div class="body-s mono" style="margin-top:4px;">${esc(p.sub)}</div>
    </div>`).join("");

  return `<section class="page dense">
  <div class="starfield"></div>
  <div class="glow-tl"></div>
  ${pageRail("Birth Snapshot", "5")}

  <div style="position:relative;z-index:2;padding-top:24px;flex:1;">
    <div class="section-title" style="margin-bottom:24px;">
      <span class="section-num">04</span>
      <h2>Birth Snapshot</h2>
    </div>

    <div style="display:grid;grid-template-columns:auto 1fr;gap:40px;align-items:start;">
      <!-- North Indian chart -->
      <div style="flex-shrink:0;">
        <div class="kicker" style="margin-bottom:10px;">North Indian Chart</div>
        <div style="background:var(--surface);border:1px solid var(--line);border-radius:4px;padding:10px;display:inline-block;">
          ${renderNorthIndianChart(chart)}
        </div>
        <div class="body-s" style="margin-top:8px;text-align:center;color:var(--ivory-mute);">${esc(chart.lagnaRashi)} Ascendant · House 1 at top</div>

        <!-- Planet placements legend -->
        <div style="margin-top:14px;padding:10px 12px;background:var(--surface);border:1px solid var(--line);border-radius:4px;">
          <div class="kicker" style="font-size:9px;margin-bottom:6px;">Planet Placements</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 12px;font-family:'JetBrains Mono',monospace;font-size:9.5px;line-height:1.55;color:var(--ivory-dim);">
            ${["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"].map(p => {
              const pd = chart.planets[p];
              if (!pd) return "";
              const abbr = PLANET_ABBR[p] ?? p.slice(0,2);
              const retro = pd.retrograde ? " (R)" : "";
              return `<div><span style="color:var(--gold);font-weight:600;">${abbr}</span> ${esc(p)} · ${esc(pd.sign)} H${pd.house} · ${pd.degree}°${String(pd.minutes).padStart(2,"0")}'${retro}</div>`;
            }).join("")}
          </div>
        </div>

        <!-- Sign reference legend -->
        <div style="margin-top:8px;padding:8px 12px;background:var(--surface);border:1px solid var(--line);border-radius:4px;">
          <div class="kicker" style="font-size:9px;margin-bottom:4px;">Sign Reference</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:9px;line-height:1.6;color:var(--ivory-mute);">
            1 Aries · 2 Taurus · 3 Gemini · 4 Cancer · 5 Leo · 6 Virgo<br/>
            7 Libra · 8 Scorpio · 9 Sagittarius · 10 Capricorn · 11 Aquarius · 12 Pisces
          </div>
        </div>
      </div>

      <!-- Pillar cards + birth data -->
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          ${pillarCards}
        </div>

        <hr class="hairline" style="margin:8px 0;"/>

        <!-- Birth data card -->
        <div class="card gold-edge">
          <div class="kicker" style="margin-bottom:12px;">Birth Data</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;">
            <div><div class="body-s">Name</div><div class="body" style="color:var(--ivory);">${esc(capitalize(chart.name))}</div></div>
            <div><div class="body-s">Date of Birth</div><div class="body" style="color:var(--ivory);">${esc(chart.dob)}</div></div>
            <div><div class="body-s">Time of Birth</div><div class="body" style="color:var(--ivory);">${esc(chart.tob)}</div></div>
            <div><div class="body-s">Place</div><div class="body" style="color:var(--ivory);">${esc(chart.city)}</div></div>
            <div><div class="body-s">Latitude</div><div class="mono" style="font-size:12px;color:var(--gold);">${chart.lat.toFixed(4)}°</div></div>
            <div><div class="body-s">Longitude</div><div class="mono" style="font-size:12px;color:var(--gold);">${chart.lon.toFixed(4)}°</div></div>
            <div><div class="body-s">Timezone</div><div class="mono" style="font-size:12px;color:var(--gold);">UTC${chart.tz >= 0 ? "+" : ""}${chart.tz}</div></div>
            <div><div class="body-s">Ayanamsha</div><div class="body-s" style="color:var(--ivory-dim);">Lahiri (IAU)</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Birth Snapshot")}
</section>`;
}

// ── Page 6: Planetary Dashboard ──────────────────────────────────────────

function page6PlanetaryDashboard(chart: ChartData): string {
  const planets = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];

  const cards = planets.map(name => {
    const pd = chart.planets[name];
    if (!pd) return `<div class="card"><div class="kicker">${esc(name)}</div><div class="body-s" style="margin-top:8px;">No data</div></div>`;

    const dignityLower = pd.dignity.toLowerCase();
    let badgeClass = "";
    const badgeLabel = pd.dignity;
    if (dignityLower.includes("exalt")) { badgeClass = "jade"; }
    else if (dignityLower.includes("debilit")) { badgeClass = "crimson"; }
    else if (dignityLower.includes("own") || dignityLower.includes("sva")) { badgeClass = ""; }
    else { badgeClass = "violet"; }

    const strengthPct = Math.min(100, Math.round((pd.degree / 30) * 100));
    const retro = pd.retrograde ? ' <span style="color:var(--crimson);font-size:10px;font-weight:600;">(R)</span>' : "";
    const skt = PLANET_SANSKRIT[name] ?? name;

    return `<div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <div>
          <div class="devanagari" style="font-size:13px;color:var(--gold-dim);margin-bottom:2px;">${skt}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--ivory);">${esc(name)}${retro}</div>
        </div>
        <span class="badge ${badgeClass}" style="font-size:9px;">${esc(badgeLabel)}</span>
      </div>
      <div class="body-s" style="margin-bottom:2px;">${esc(pd.sign)} · H${pd.house}</div>
      <div class="mono" style="font-size:10px;color:var(--gold);margin-bottom:4px;">${pd.degree}°${pd.minutes}' · ${esc(pd.nakshatra)} P${pd.pada}</div>
      <!-- Shadbala bar -->
      <div style="height:3px;background:var(--line);border-radius:99px;overflow:hidden;margin-top:8px;">
        <div style="height:100%;width:${strengthPct}%;background:var(--gold);border-radius:99px;opacity:0.7;"></div>
      </div>
      <div class="body-s" style="margin-top:3px;font-size:9px;">Strength: ${strengthPct}%</div>
    </div>`;
  }).join("");

  return `<section class="page dense">
  <div class="starfield"></div>
  <div class="glow-br"></div>
  ${pageRail("Planetary Dashboard", "6")}

  <div style="position:relative;z-index:2;padding-top:24px;flex:1;">
    <div class="section-title" style="margin-bottom:24px;">
      <span class="section-num">06</span>
      <h2>Planetary Dashboard</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      ${cards}
    </div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Planetary Dashboard")}
</section>`;
}

// ── Page 7: Vimshottari Dasha – Current Period ───────────────────────────

function page7CurrentDasha(chart: ChartData): string {
  const activeMD = chart.dashas.find(d => d.active) ?? chart.dashas[0];
  const activeAD = chart.antardasha.find(d => d.active) ?? chart.antardasha[0];

  if (!activeMD || !activeAD) {
    return `<section class="page dense">${pageRail("Vimshottari Dasha","7")}<div class="body" style="padding-top:24px;">No dasha data available.</div>${pageFoot("astrolife · cosmic blueprint","Dasha")}</section>`;
  }

  const mdPlanet = chart.planets[activeMD.planet];
  const interp = getMahadashaInterpretation(activeMD.planet, mdPlanet?.house ?? 1, mdPlanet?.dignity);

  const lkData = calculateLalKitab(chart.planets, chart.dob, chart.lagnaNum);
  const lkPlanet = lkData.planets.find(p => p.planet === activeMD.planet);

  const lkRule = PLANET_HOUSE_RULES[activeMD.planet]?.[mdPlanet?.house ?? 1];
  const homeOmen = HOME_OMEN_RULES.find(r => r.planet === activeMD.planet);
  const houseZone = HOUSE_WISE_OMENS.find(r => r.house === (mdPlanet?.house ?? 1));
  const rins = RIN_RULES.filter(r => r.planets.includes(activeMD.planet));
  const combos = COMBINATION_RULES.filter(r => r.planets.includes(activeMD.planet)).slice(0, 2);

  const vedicPara = composeVedicParagraph(
    activeMD.planet, mdPlanet?.house ?? 1, mdPlanet?.sign ?? "", activeMD.yrs,
    interp, mdPlanet?.dignity
  );
  const lkPara = composeLKParagraph(
    activeMD.planet, mdPlanet?.house ?? 1, mdPlanet?.sign ?? "", activeMD.yrs, lkRule
  );
  const psychPara = composePsychOmenParagraph(
    activeMD.planet, mdPlanet?.house ?? 1, lkRule, homeOmen, houseZone, combos, rins
  );

  // Top 3 antardashas
  const adCards = chart.antardasha.slice(0, 3).map(ad => {
    const isActive = ad.active;
    return `<div class="card${isActive ? " gold-edge" : ""}" style="display:grid;grid-template-columns:1fr auto;align-items:start;gap:12px;">
      <div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);">${esc(ad.planet)} Antardasha</div>
        <div class="body-s" style="margin-top:2px;">${formatDateShort(new Date(ad.start))} — ${formatDateShort(new Date(ad.end))}</div>
      </div>
      <div style="text-align:right;">
        ${isActive ? `<span class="badge" style="font-size:9px;">Active</span>` : ""}
        <div class="mono" style="font-size:10px;color:var(--gold-dim);margin-top:4px;">${ad.yrs.toFixed(1)} yrs</div>
      </div>
    </div>`;
  }).join("");

  // Truncate paragraphs to fit cleanly on their respective pages
  const vedicShort = vedicPara.length > 900 ? vedicPara.slice(0, 897) + "…" : vedicPara;
  const lkShort    = lkPara.length    > 700 ? lkPara.slice(0, 697)    + "…" : lkPara;
  const psychShort = psychPara.length > 700 ? psychPara.slice(0, 697)  + "…" : psychPara;

  return `<section class="page dense">
  <div class="starfield"></div>
  <div class="glow-tl"></div>
  ${pageRail("Vimshottari Dasha · Current Period", "7")}

  <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
    <div class="section-title" style="margin-bottom:16px;">
      <span class="section-num">03</span>
      <h2>Vimshottari Dasha</h2>
    </div>

    <!-- Active MD banner -->
    <div class="card gold-edge" style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div class="kicker" style="margin-bottom:6px;">Active Mahadasha</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:32px;color:var(--gold-bright);">${esc(activeMD.planet)} Mahadasha</div>
        <div class="mono" style="font-size:11px;color:var(--ivory-mute);margin-top:4px;">${formatDate(new Date(activeMD.start))} — ${formatDate(new Date(activeMD.end))}</div>
      </div>
      <div style="text-align:right;">
        <div class="mono" style="font-size:22px;color:var(--gold);">${activeMD.yrs}</div>
        <div class="body-s">years</div>
        ${lkPlanet ? `<div class="body-s mono" style="margin-top:4px;color:${lkPlanet.status === "pakka" ? "var(--jade)" : lkPlanet.status === "dushman" ? "var(--crimson)" : "var(--ivory-mute)"};">${esc(lkPlanet.status)}</div>` : ""}
      </div>
    </div>

    <!-- Antardasha cards -->
    <div class="kicker" style="margin-bottom:10px;">Current Antardashas</div>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:20px;">
      ${adCards}
    </div>

    <hr class="hairline gold" style="margin-bottom:18px;"/>

    <!-- Vedic analysis only on this page -->
    <div>
      <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Vedic Analysis</div>
      <div class="body" style="line-height:1.65;">${esc(vedicShort)}</div>
    </div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Dasha")}
</section>

<section class="page dense">
  <div class="starfield"></div>
  <div class="glow-tl"></div>
  ${pageRail("Vimshottari Dasha · Analysis", "8")}

  <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;gap:20px;">
    <div>
      <div class="kicker" style="margin-bottom:8px;color:var(--violet);">Lal Kitab Analysis</div>
      <div class="body" style="line-height:1.65;">${esc(lkShort)}</div>
    </div>
    <hr class="hairline" style="opacity:0.3;"/>
    <div>
      <div class="kicker" style="margin-bottom:8px;color:var(--jade);">Environmental &amp; Psychological Reading</div>
      <div class="body" style="line-height:1.65;">${esc(psychShort)}</div>
    </div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Dasha")}
</section>`;
}

// ── Page 8: Upcoming Mahadashas ───────────────────────────────────────────

function page8UpcomingDashas(chart: ChartData): string {
  const now = new Date();
  // Limit to 3 upcoming dashas so they fit on one page without overflow
  const upcoming = chart.dashas.filter(d => new Date(d.end) > now && !d.active).slice(0, 3);

  if (upcoming.length === 0) {
    return `<section class="page dense">${pageRail("Upcoming Mahadashas","9")}<div class="body" style="padding-top:24px;">No upcoming dasha data available.</div>${pageFoot("astrolife · cosmic blueprint","Upcoming Dashas")}</section>`;
  }

  const lkData = calculateLalKitab(chart.planets, chart.dob, chart.lagnaNum);
  // Max paragraph length per dasha so 3 cards fit in the page
  const MAX_PARA = 420;

  const sections = upcoming.map((md, idx) => {
    const pd = chart.planets[md.planet];
    const interp = getMahadashaInterpretation(md.planet, pd?.house ?? 1, pd?.dignity);
    const lkRule = PLANET_HOUSE_RULES[md.planet]?.[pd?.house ?? 1];
    const startYear = new Date(md.start).getFullYear();
    const endYear   = new Date(md.end).getFullYear();
    const paraFull = composeUpcomingMDParagraph(
      md.planet, pd?.house ?? 1, pd?.sign ?? "",
      md.yrs, startYear, endYear, interp, lkRule, pd?.dignity
    );
    const para = paraFull.length > MAX_PARA ? paraFull.slice(0, MAX_PARA - 1) + "…" : paraFull;

    return `<div class="card${idx === 0 ? " gold-edge" : ""}" style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
        <div>
          <div class="kicker" style="margin-bottom:4px;">${startYear} — ${endYear}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--ivory);">${esc(md.planet)} Mahadasha</div>
        </div>
        <div style="text-align:right;">
          <div class="mono" style="font-size:18px;color:var(--gold);">${md.yrs}</div>
          <div class="body-s">years</div>
        </div>
      </div>
      <div class="body" style="font-size:12.5px;line-height:1.62;">${esc(para)}</div>
    </div>`;
  }).join("");

  return `<section class="page dense">
  <div class="starfield"></div>
  <div class="glow-br"></div>
  ${pageRail("Upcoming Mahadashas", "9")}

  <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
    <div class="section-title" style="margin-bottom:20px;">
      <span class="section-num">04</span>
      <h2>Upcoming Mahadashas</h2>
    </div>
    ${sections}
    <div style="display:none">${lkData.summary.slice(0, 1)}</div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Upcoming Dashas")}
</section>`;
}

// ── Lal Kitab Premium Pages ───────────────────────────────────────────────

function pageLalKitabCoreAccuracy(chart: ChartData): string {
  const lk = calculateLalKitab(chart.planets, chart.dob, chart.lagnaNum ?? 0);
  const benefic = lk.coreAccuracy.filter(row => row.beneficMalefic === "Benefic");
  const malefic = lk.coreAccuracy.filter(row => row.beneficMalefic === "Malefic");

  const rows = lk.coreAccuracy.map(row => {
    const badge = row.beneficMalefic === "Benefic" ? "jade" : row.beneficMalefic === "Malefic" ? "crimson" : "saffron";
    return `<tr>
      <td>${esc(row.planet)}</td>
      <td>${esc(row.signShort)} · H${row.house}</td>
      <td>${esc(row.position.replaceAll("_", " "))}</td>
      <td>${row.soya ? "Yes" : "No"}</td>
      <td>${row.kismatJaganewala ? "Yes" : "No"}</td>
      <td><span class="badge ${badge}" style="font-size:8px;">${esc(row.beneficMalefic)}</span></td>
    </tr>`;
  }).join("");

  const headline = malefic.length > benefic.length
    ? "This chart needs selective correction, not remedy overload."
    : "This chart has usable planetary support; remedies must protect the helpful planets first.";

  return `<section class="page dense">
  <div class="starfield"></div>
  <div class="glow-tl"></div>
  ${pageRail("Lal Kitab · Core Accuracy", "LK-1")}

  <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
    <div class="section-title" style="margin-bottom:14px;">
      <span class="section-num">LK</span>
      <h2>Lal Kitab Core Accuracy</h2>
    </div>

    <div class="card gold-edge" style="margin-bottom:16px;">
      <div class="kicker" style="margin-bottom:6px;">Benefic / Malefic Verification</div>
      <div class="body" style="font-size:14px;line-height:1.7;">${esc(headline)} Daan is not shown for every planet. The report first checks whether the natal Lal Kitab condition is supportive, mixed or challenging, then gives guidance only where correction is meaningful.</div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
      <div class="card"><div class="kicker">Supportive</div><div class="display-s" style="color:var(--jade);">${benefic.length}</div><div class="body-s">${esc(benefic.map(p => p.planet).join(", ") || "None")}</div></div>
      <div class="card"><div class="kicker">Needs Care</div><div class="display-s" style="color:var(--crimson);">${malefic.length}</div><div class="body-s">${esc(malefic.map(p => p.planet).join(", ") || "None")}</div></div>
      <div class="card"><div class="kicker">Kismat Trigger</div><div class="display-s" style="color:var(--gold);">${esc(lk.kismat.planet)}</div><div class="body-s">H${lk.kismat.house} · Score ${lk.kismat.score}</div></div>
    </div>

    <table style="width:100%;border-collapse:collapse;font-family:'Inter',sans-serif;font-size:10.5px;">
      <thead>
        <tr style="color:var(--gold);text-transform:uppercase;letter-spacing:0.08em;">
          <th style="text-align:left;padding:7px;border-bottom:1px solid var(--line);">Planet</th>
          <th style="text-align:left;padding:7px;border-bottom:1px solid var(--line);">Sign / House</th>
          <th style="text-align:left;padding:7px;border-bottom:1px solid var(--line);">Position</th>
          <th style="text-align:left;padding:7px;border-bottom:1px solid var(--line);">Soya</th>
          <th style="text-align:left;padding:7px;border-bottom:1px solid var(--line);">Jaganewala</th>
          <th style="text-align:left;padding:7px;border-bottom:1px solid var(--line);">Result</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="body-s" style="margin-top:14px;line-height:1.65;">${esc(lk.summary)}</div>
  </div>

  ${pageFoot("astrolife · lal kitab engine", "Core Accuracy")}
</section>`;
}

function pageLalKitabTimingAndRemedy(chart: ChartData): string {
  const lk = calculateLalKitab(chart.planets, chart.dob, chart.lagnaNum ?? 0);
  const time = calculateLalKitabTimeEngine({
    dob: chart.dob,
    planets: chart.planets,
    lagnaNum: chart.lagnaNum ?? 0,
    targetDate: new Date(),
  });

  const annual = lk.varshphal.annualPrediction;
  const remedies = time.remedyGuidance.slice(0, 4).map(item => {
    const badge = item.condition === "supportive" ? "jade" : item.condition === "challenging" ? "crimson" : "saffron";
    const decision = item.decision === "daan_allowed"
      ? `Can donate: ${item.canDonate.join(", ")}`
      : item.decision === "daan_avoid"
        ? `Do not donate: ${item.doNotDonate.join(", ")}`
        : `Soft correction: ${item.preferredCorrection.join(", ")}`;

    return `<div class="card" style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);">${esc(item.planet)} · H${item.natalHouse}</div>
          <div class="body-s" style="margin-top:3px;">${esc(decision)}</div>
        </div>
        <span class="badge ${badge}" style="font-size:8px;">${esc(item.condition)}</span>
      </div>
      <div class="body-s" style="margin-top:8px;line-height:1.55;">${esc(item.detailedExplanation)}</div>
    </div>`;
  }).join("");

  return `<section class="page dense">
  <div class="starfield"></div>
  <div class="glow-br"></div>
  ${pageRail("Lal Kitab · Timing & Remedy", "LK-2")}

  <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
    <div class="section-title" style="margin-bottom:14px;">
      <span class="section-num">LK</span>
      <h2>Varshphal, Monthly Phal &amp; Remedy</h2>
    </div>

    <div class="card gold-edge" style="margin-bottom:12px;">
      <div class="kicker" style="margin-bottom:5px;">Varshphal · ${esc(lk.varshphal.periodLabel)}</div>
      <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--gold-bright);margin-bottom:6px;">${esc(annual.headline)}</div>
      <div class="body-s" style="line-height:1.6;">${esc(annual.career)} ${esc(annual.money)} ${esc(annual.family)} ${esc(annual.health)} ${esc(annual.remedy)}</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div class="card">
        <div class="kicker" style="margin-bottom:6px;color:var(--saffron);">35-Sala Chakra</div>
        <div class="body-s" style="line-height:1.62;">${esc(time.thirtyFiveYearChakra.overview)} ${esc(time.thirtyFiveYearChakra.houseExplanation)} ${esc(time.thirtyFiveYearChakra.planetActivationExplanation)}</div>
      </div>
      <div class="card">
        <div class="kicker" style="margin-bottom:6px;color:var(--violet);">Monthly Phal</div>
        <div class="body-s" style="line-height:1.62;">${esc(time.monthlyPhal.overview)} ${esc(time.monthlyPhal.moneyCareer)} ${esc(time.monthlyPhal.familyHealth)}</div>
      </div>
    </div>

    <div class="kicker" style="margin-bottom:8px;color:var(--jade);">Selective Remedy Intelligence</div>
    ${remedies || `<div class="card"><div class="body-s">No urgent Lal Kitab remedy correction is required in this pass.</div></div>`}
  </div>

  ${pageFoot("astrolife · lal kitab engine", "Timing & Remedy")}
</section>`;
}

// ── Page 9: Remedies ──────────────────────────────────────────────────────

function page9Remedies(chart: ChartData): string {
  const remedyResult = calculateRemedies(chart);
  const topCards = remedyResult.cards.slice(0, 6);

  const remCards = topCards.map(card => {
    const priorityColor: Record<string, string> = {
      "dasha-active": "var(--saffron)",
      "urgent":       "var(--crimson)",
      "recommended":  "var(--gold)",
      "optional":     "var(--ivory-mute)",
    };
    const pColor = priorityColor[card.priority] ?? "var(--gold)";

    return `<div class="card" style="margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--ivory);">${esc(card.planet)}</div>
          <div class="body-s">${esc(card.sign)} · H${card.house} · ${esc(card.nakshatra)}</div>
        </div>
        <span class="badge" style="color:${pColor};border-color:${pColor}40;background:${pColor}08;font-size:9px;">${esc(card.priority)}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div>
          <div class="kicker" style="font-size:9px;margin-bottom:3px;">Mantra</div>
          <div class="devanagari body-s" style="font-size:11px;color:var(--gold-bright);">${esc(card.mantra)}</div>
        </div>
        <div>
          <div class="kicker" style="font-size:9px;margin-bottom:3px;">Gemstone</div>
          <div class="body-s" style="color:var(--ivory-dim);">${esc(card.gem)}</div>
        </div>
        <div>
          <div class="kicker" style="font-size:9px;margin-bottom:3px;">Practice</div>
          <div class="body-s" style="color:var(--ivory-dim);">${esc(card.practice)}</div>
        </div>
        <div>
          <div class="kicker" style="font-size:9px;margin-bottom:3px;">Day · Color</div>
          <div class="body-s" style="color:var(--ivory-dim);">${esc(card.day)} · ${esc(card.color)}</div>
        </div>
      </div>
      ${card.lkUpay.length > 0 ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line);"><div class="kicker" style="font-size:9px;margin-bottom:4px;">Lal Kitab Upay</div><div class="devanagari" style="font-size:11px;line-height:1.5;color:var(--violet);">${esc(card.lkUpay.slice(0, 2).join(" · "))}</div></div>` : ""}
    </div>`;
  }).join("");

  return `<section class="page dense">
  <div class="starfield"></div>
  <div class="glow-tl"></div>
  ${pageRail("Remedies · Upaya", "10")}

  <div style="position:relative;z-index:2;padding-top:24px;flex:1;">
    <div class="section-title" style="margin-bottom:8px;">
      <span class="section-num">Rx</span>
      <h2>Remedies</h2>
    </div>
    <div class="body" style="margin-bottom:20px;max-width:560px;">
      Active dasha: <strong style="color:var(--gold);">${esc(remedyResult.dashaActive)}</strong> ·
      Antardasha: <strong style="color:var(--gold);">${esc(remedyResult.antardashaActive)}</strong> ·
      Urgent count: <strong style="color:var(--crimson);">${remedyResult.urgentCount}</strong>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${remCards}
    </div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Remedies")}
</section>`;
}

// ── Page 10: Closing ──────────────────────────────────────────────────────

function page10Closing(chart: ChartData): string {
  const firstName = esc(capitalize(chart.name.split(" ")[0]));
  return `<section class="page">
  <div class="starfield"></div>
  <div class="glow-tl"></div>
  <div class="glow-br"></div>
  <div class="page-watermark">ज्योतिष</div>

  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;z-index:2;">

    <!-- Ornamental top -->
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:40px;opacity:0.5;">
      <div style="width:120px;height:1px;background:linear-gradient(90deg,transparent,var(--gold));"></div>
      <svg width="18" height="18" viewBox="-9 -9 18 18"><polygon points="0,-7 6,3.5 -6,3.5" fill="none" stroke="#C9A961" stroke-width="0.8"/><polygon points="0,7 6,-3.5 -6,-3.5" fill="none" stroke="#C9A961" stroke-width="0.8"/></svg>
      <div style="width:120px;height:1px;background:linear-gradient(90deg,var(--gold),transparent);"></div>
    </div>

    <div class="eyebrow" style="margin-bottom:20px;opacity:0.7;">A Final Reflection</div>

    <div class="pullquote" style="max-width:560px;margin:0 auto 32px;">
      "The stars incline; they do not compel.<br/>
      The chart is the weather report — you are the navigator."
    </div>

    <div class="body" style="max-width:520px;margin-bottom:40px;line-height:1.75;">
      Dear ${firstName}, this blueprint is the beginning of a conversation between you and the cosmos — not an ending. Carry it lightly. Return to it in different seasons. Let it be a companion, not an oracle. The truest astrology is the one that makes you more yourself.
    </div>

    <!-- Ornament divider -->
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:40px;opacity:0.45;">
      <div style="width:80px;height:1px;background:linear-gradient(90deg,transparent,var(--gold));"></div>
      <div style="width:8px;height:8px;border:1px solid var(--gold);transform:rotate(45deg);"></div>
      <div style="width:8px;height:8px;border:1px solid var(--gold);transform:rotate(45deg);"></div>
      <div style="width:8px;height:8px;border:1px solid var(--gold);transform:rotate(45deg);"></div>
      <div style="width:80px;height:1px;background:linear-gradient(90deg,var(--gold),transparent);"></div>
    </div>

    <!-- AstroLife wordmark -->
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
      <svg width="40" height="40" viewBox="-20 -20 40 40" fill="none">
        <circle r="17" stroke="#C9A961" stroke-width="0.8"/>
        <circle r="15" stroke="#C9A961" stroke-width="0.3"/>
        <polygon points="0,-11 9.5,5.5 -9.5,5.5" fill="none" stroke="#C9A961" stroke-width="0.8"/>
        <polygon points="0,11 9.5,-5.5 -9.5,-5.5" fill="none" stroke="#C9A961" stroke-width="0.8"/>
        <circle r="2.5" fill="#E8923C"/>
      </svg>
      <div style="font-family:'Cormorant Garamond',serif;font-weight:300;font-size:36px;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);">AstroLife</div>
    </div>
    <div class="body-s" style="letter-spacing:0.2em;text-transform:uppercase;color:var(--ivory-mute);">Vedic Intelligence · Est. 2024</div>
    <div class="devanagari" style="font-size:18px;color:var(--gold-dim);margin-top:12px;opacity:0.7;">सर्वे भवन्तु सुखिनः</div>
    <div class="serif-italic" style="font-size:13px;color:var(--ivory-mute);margin-top:4px;">May all beings be happy.</div>
  </div>

  <div style="position:relative;z-index:2;padding-top:18px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;">
    <div class="body-s" style="letter-spacing:0.18em;text-transform:uppercase;">Prepared for ${esc(capitalize(chart.name))}</div>
    <div class="mono" style="font-size:10px;color:var(--gold-dim);">astrolife.ai · ${new Date().getFullYear()}</div>
  </div>
</section>`;
}

// ── Page 11: Engine Ledger ────────────────────────────────────────────────

function page11EngineLedger(context: ReportEngineContext): string {
  const rows = [
    ["Kundli", "ready", `${context.engines.kundli.lagna} Lagna · ${context.engines.kundli.planetCount} grahas mapped`],
    ["Panchang", context.engines.panchang.status, `${context.engines.panchang.moonNakshatra} · Moon in ${context.engines.panchang.moonRashi}`],
    ["Vimshottari Dasha", context.engines.dasha.status, `${context.engines.dasha.currentMahadasha} MD · ${context.engines.dasha.currentAntardasha} AD`],
    ["Yogas", context.engines.yogas.status, context.engines.yogas.note],
    ["Doshas", context.engines.doshas.status, context.engines.doshas.note],
    ["Shadbala", context.engines.shadbala.status, context.engines.shadbala.note],
    ["Divisional Charts", context.engines.divisionalCharts.status, context.engines.divisionalCharts.note],
    ["Transit", context.engines.transit.status, context.engines.transit.note],
    ["Remedies", context.engines.remedies.status, `${context.engines.remedies.topPlanet} focus · ${context.engines.remedies.urgentCount} urgent items`],
    ["AstroSound", context.engines.astroSound.status, context.engines.astroSound.note],
    ["Vastu", context.engines.vastu.status, context.engines.vastu.note],
    ["Family Synastry", context.engines.familySynastry.status, context.engines.familySynastry.note],
  ];

  const badgeClass = (status: string) => {
    if (status === "ready" || status === "covered") return "jade";
    if (status === "proxy" || status === "partial") return "saffron";
    if (status === "missing" || status === "pending") return "crimson";
    return "";
  };

  // User-friendly status labels (PROXY is internal jargon)
  const statusLabel = (status: string): string => {
    if (status === "proxy") return "basic";
    return status;
  };
  const tableRows = rows.map(([name, status, note]) => `
    <div class="card" style="display:grid;grid-template-columns:170px 96px 1fr;gap:14px;align-items:start;padding:14px 16px;">
      <div style="font-family:'Cormorant Garamond',serif;font-size:19px;color:var(--ivory);">${esc(name)}</div>
      <span class="badge ${badgeClass(status)}" style="justify-content:center;font-size:8.5px;">${esc(statusLabel(status))}</span>
      <div class="body-s" style="color:var(--ivory-dim);">${esc(note)}</div>
    </div>`).join("");

  return `<section class="page dense">
  <div class="starfield"></div>
  <div class="glow-br"></div>
  ${pageRail("Engine Ledger", "12")}

  <div style="position:relative;z-index:2;padding-top:24px;flex:1;">
    <div class="section-title" style="margin-bottom:14px;">
      <span class="section-num">SYS</span>
      <h2>Engine Ledger</h2>
    </div>
    <div class="body" style="max-width:580px;margin-bottom:18px;">
      This page follows the Python generator model: one structured context is assembled first, then the template renders from that context. It keeps the PDF consistent as more engines are added.
    </div>
    <div class="card gold-edge" style="margin-bottom:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;">
      <div><div class="kicker" style="margin-bottom:4px;">Report ID</div><div class="mono" style="font-size:12px;color:var(--gold);">${esc(context.reportId)}</div></div>
      <div><div class="kicker" style="margin-bottom:4px;">Template</div><div class="body-s" style="color:var(--ivory);">Cosmic Blueprint v2</div></div>
      <div><div class="kicker" style="margin-bottom:4px;">Palette · Cover</div><div class="body-s" style="color:var(--ivory);">${esc(context.settings.palette)} · ${esc(context.settings.cover)}</div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:9px;">
      ${tableRows}
    </div>
  </div>

  ${pageFoot("astrolife · cosmic blueprint", "Engine Ledger")}
</section>`;
}

// ============================================================
// PHASE 1 EXPANSION — Engine-driven detail pages
// ============================================================

// ── Yogas (combinations & rajayoga) ───────────────────────────────────────

function pageYogas(chart: ChartData): string {
  const yogas: YogaResult[] = detectYogas(
    chart.planets as Parameters<typeof detectYogas>[0],
    chart.lagnaNum,
    "elite"
  );
  const present = yogas.filter(y => y.present && !y.isDosha);
  const top = present
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const cards = top.length === 0
    ? `<div class="body" style="padding:20px;text-align:center;color:var(--ivory-mute);">No major yogas detected in this chart. Foundational karma is the primary path.</div>`
    : top.map((y, i) => `
      <div class="card${i === 0 ? " gold-edge" : ""}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--gold-bright);">${esc(y.name)}</div>
            <div class="kicker" style="margin-top:2px;font-size:9px;">${esc(y.category)}</div>
          </div>
          <div style="text-align:right;">
            <div class="mono" style="font-size:18px;color:var(--gold);">${y.score}</div>
            <div class="body-s" style="font-size:9px;">score</div>
          </div>
        </div>
        <div class="body-s" style="margin-bottom:6px;">${esc(y.description)}</div>
        <div class="body-s" style="color:var(--jade);"><strong>Impact:</strong> ${esc(y.impact)}</div>
        ${y.planets.length > 0 ? `<div class="mono" style="font-size:9px;color:var(--gold-dim);margin-top:6px;">${y.planets.map(p => esc(p)).join(" · ")}</div>` : ""}
      </div>`).join("");

  return `<section class="page dense">
    ${pageRail("Yogas · Special Combinations", "8")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">05</span>
        <h2>Yogas</h2>
      </div>
      <div class="body-s" style="margin-bottom:16px;max-width:600px;">
        Yogas are specific planetary combinations that amplify or shape outcomes. Below are the most significant active yogas in your chart, ranked by strength.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        ${cards}
      </div>
      <div class="body-s" style="margin-top:auto;padding-top:12px;color:var(--ivory-mute);text-align:center;">
        Total active yogas detected: <strong style="color:var(--gold);">${present.length}</strong> · Showing top ${top.length}
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Yogas")}
  </section>`;
}

// ── Doshas (manglik, kaal sarp, etc) ──────────────────────────────────────

function pageDoshas(chart: ChartData): string {
  const all: YogaResult[] = detectYogas(
    chart.planets as Parameters<typeof detectYogas>[0],
    chart.lagnaNum,
    "elite"
  );
  const doshas = all.filter(y => y.isDosha && y.present);

  const cards = doshas.length === 0
    ? `<div class="card jade-edge" style="padding:24px;text-align:center;">
        <div class="display-s" style="color:var(--jade);margin-bottom:8px;">No Major Doshas</div>
        <div class="body-s">Your chart shows no significant doshas. This is a favourable foundational marker.</div>
      </div>`
    : doshas.map(d => `
      <div class="card" style="border-color:rgba(201,85,95,0.3);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--crimson);">${esc(d.name)}</div>
          <span class="badge crimson" style="font-size:9px;">${esc(d.category)}</span>
        </div>
        <div class="body-s" style="margin-bottom:8px;">${esc(d.description)}</div>
        <div class="body-s" style="color:var(--saffron);margin-bottom:6px;"><strong>Impact:</strong> ${esc(d.impact)}</div>
        ${d.remedy ? `<div class="body-s" style="color:var(--jade);"><strong>Remedy:</strong> ${esc(d.remedy)}</div>` : ""}
      </div>`).join("");

  return `<section class="page dense">
    ${pageRail("Doshas · Karmic Disturbances", "9")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">06</span>
        <h2>Doshas</h2>
      </div>
      <div class="body-s" style="margin-bottom:16px;max-width:600px;">
        Doshas indicate specific karmic obstructions. Most have prescribed remedies — they are not destinies but signals.
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${cards}
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Doshas")}
  </section>`;
}

// ── Shadbala — Six-fold Strength ──────────────────────────────────────────

function pageShadbala(chart: ChartData): string {
  const result = calculateShadbala(chart.planets as Parameters<typeof calculateShadbala>[0]);

  const rows = result.planets.map(p => {
    const pct = p.percentage;
    return `<tr>
      <td style="padding:8px 6px;font-family:'Cormorant Garamond',serif;font-size:14px;color:var(--ivory);">${esc(p.planet)}</td>
      <td style="padding:8px 6px;text-align:center;color:var(--ivory-dim);" class="mono body-s">${p.sthanaBala.toFixed(1)}</td>
      <td style="padding:8px 6px;text-align:center;color:var(--ivory-dim);" class="mono body-s">${p.digBala.toFixed(1)}</td>
      <td style="padding:8px 6px;text-align:center;color:var(--ivory-dim);" class="mono body-s">${p.kalaBala.toFixed(1)}</td>
      <td style="padding:8px 6px;text-align:center;color:var(--ivory-dim);" class="mono body-s">${p.cheshtaBala.toFixed(1)}</td>
      <td style="padding:8px 6px;text-align:center;color:var(--ivory-dim);" class="mono body-s">${p.naisargika.toFixed(1)}</td>
      <td style="padding:8px 6px;text-align:center;color:var(--ivory-dim);" class="mono body-s">${p.drikBala.toFixed(1)}</td>
      <td style="padding:8px 6px;text-align:right;color:var(--gold);font-weight:600;font-family:'JetBrains Mono',monospace;font-size:11px;">${p.total.toFixed(2)}</td>
      <td style="padding:8px 6px;text-align:right;color:${pct >= 75 ? "var(--jade)" : pct >= 50 ? "var(--gold)" : "var(--crimson)"};font-weight:600;font-family:'JetBrains Mono',monospace;font-size:11px;">${pct}%</td>
    </tr>`;
  }).join("");

  return `<section class="page dense">
    ${pageRail("Shadbala · Six-fold Strength", "10")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">07</span>
        <h2>Shadbala</h2>
      </div>
      <div class="body-s" style="margin-bottom:14px;max-width:600px;">
        Six factors determine each planet's strength: Sthana (positional), Dig (directional), Kala (temporal), Cheshta (motional), Naisargika (natural), Drik (aspectual). Total in Rupas — minimum required for full effect: 5.0.
      </div>
      <div class="card" style="padding:14px 12px;">
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr style="border-bottom:1px solid var(--line-strong);">
              <th style="padding:6px;text-align:left;color:var(--gold-dim);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;">Planet</th>
              <th style="padding:6px;text-align:center;color:var(--gold-dim);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;">Sthana</th>
              <th style="padding:6px;text-align:center;color:var(--gold-dim);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;">Dig</th>
              <th style="padding:6px;text-align:center;color:var(--gold-dim);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;">Kala</th>
              <th style="padding:6px;text-align:center;color:var(--gold-dim);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;">Cheshta</th>
              <th style="padding:6px;text-align:center;color:var(--gold-dim);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;">Nais.</th>
              <th style="padding:6px;text-align:center;color:var(--gold-dim);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;">Drik</th>
              <th style="padding:6px;text-align:right;color:var(--gold-dim);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;">Total</th>
              <th style="padding:6px;text-align:right;color:var(--gold-dim);font-size:9px;letter-spacing:0.16em;text-transform:uppercase;">%</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="body-s" style="margin-top:14px;padding:12px;background:var(--surface);border:1px solid var(--line);border-radius:4px;">
        <strong style="color:var(--gold);">Strongest:</strong> ${esc(result.strongest)} ·
        <strong style="color:var(--crimson);">Weakest:</strong> ${esc(result.weakest)} ·
        <strong style="color:var(--gold-bright);">Average:</strong> <span class="mono">${result.avgStrength.toFixed(2)} Rupas</span>
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Shadbala")}
  </section>`;
}

// ── D9 Navamsa + D10 Dashamsha ────────────────────────────────────────────

function pageDivisional(chart: ChartData): string {
  const divResult = calculateDivisional(
    chart.planets as Parameters<typeof calculateDivisional>[0],
    chart.lagnaNum,
    chart.lagnaLon
  );
  const d9 = divResult.find(c => c.key === "D9");
  const d10 = divResult.find(c => c.key === "D10");
  const d9Notes = d9 ? getNavamshaAnalysis(d9) : [];
  const d10Notes = d10 ? getDashamshaAnalysis(d10) : [];

  type DC = (typeof divResult)[number];
  const renderChartMini = (chart_: DC | undefined, title: string): string => {
    if (!chart_) return `<div class="body-s">Data unavailable.</div>`;
    return `<div>
      <div class="kicker" style="margin-bottom:6px;">${title}</div>
      <div class="card" style="padding:14px;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--gold-bright);margin-bottom:4px;">${esc(chart_.lagna)} Lagna</div>
        <div class="body-s" style="margin-bottom:10px;">${chart_.planets.length} planets placed</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ivory-dim);">
          ${chart_.planets.map((p) => `<div><span style="color:var(--gold);">${PLANET_ABBR[p.planet] ?? p.planet.slice(0,2)}</span> ${esc(p.sign)} · H${p.house}</div>`).join("")}
        </div>
      </div>
    </div>`;
  };

  return `<section class="page dense">
    ${pageRail("Divisional Charts · Navamsa & Dashamsha", "11")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">08</span>
        <h2>Divisional Charts</h2>
      </div>
      <div class="body-s" style="margin-bottom:18px;max-width:620px;">
        Vargas (divisional charts) sub-divide each sign to reveal life-area-specific karma. <strong>D9 (Navamsa)</strong> shows the soul, marriage, and dharma. <strong>D10 (Dashamsha)</strong> shows career, profession, and public position.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;">
        ${renderChartMini(d9, "D9 — Navamsa · Soul & Marriage")}
        ${renderChartMini(d10, "D10 — Dashamsha · Career & Status")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        <div>
          <div class="kicker" style="margin-bottom:6px;color:var(--saffron);">Navamsa Notes</div>
          <div class="body-s" style="line-height:1.6;">${d9Notes.slice(0, 4).map(n => `<div style="margin-bottom:4px;">• ${esc(n)}</div>`).join("")}</div>
        </div>
        <div>
          <div class="kicker" style="margin-bottom:6px;color:var(--jade);">Dashamsha Notes</div>
          <div class="body-s" style="line-height:1.6;">${d10Notes.slice(0, 4).map(n => `<div style="margin-bottom:4px;">• ${esc(n)}</div>`).join("")}</div>
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Divisional")}
  </section>`;
}

// ── Health & Wellness (Medical) ───────────────────────────────────────────

function pageHealth(chart: ChartData): string {
  const m = calculateMedical(chart);
  const topConcernsHtml = m.topConcerns.length === 0
    ? `<div class="body-s">No major concerns flagged. Maintain preventive routine.</div>`
    : m.topConcerns.slice(0, 5).map(c => `<div class="body-s" style="margin-bottom:4px;">• ${esc(c)}</div>`).join("");

  const riskColor = m.riskLevel === "high" ? "var(--crimson)" : m.riskLevel === "moderate" ? "var(--saffron)" : "var(--jade)";

  return `<section class="page dense">
    ${pageRail("Health & Wellness · Vedic Medical", "16")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">09</span>
        <h2>Health &amp; Wellness</h2>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="card">
          <div class="kicker" style="margin-bottom:6px;">Prakriti</div>
          <div class="display-s" style="color:var(--gold-bright);">${esc(m.prakriti)}</div>
        </div>
        <div class="card">
          <div class="kicker" style="margin-bottom:6px;">Lagna Body Zone</div>
          <div class="body" style="color:var(--ivory);font-size:14px;">${esc(m.lagnaBodyZone)}</div>
        </div>
        <div class="card" style="border-color:${riskColor};">
          <div class="kicker" style="margin-bottom:6px;">Risk Level</div>
          <div class="display-s" style="color:${riskColor};text-transform:capitalize;">${esc(m.riskLevel)}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="card">
          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Birth Nakshatra · ${esc(m.birthNakshatra)}</div>
          ${m.birthNakshatraData ? `
            <div class="body-s" style="margin-bottom:4px;"><strong style="color:var(--gold);">Disease tendency:</strong> ${esc(m.birthNakshatraData.disease)}</div>
            <div class="body-s" style="margin-bottom:4px;"><strong style="color:var(--gold);">Body area:</strong> ${esc(m.birthNakshatraData.body)}</div>
            <div class="body-s"><strong style="color:var(--gold);">Note:</strong> ${esc(m.birthNakshatraData.note)}</div>
          ` : `<div class="body-s">Data unavailable.</div>`}
        </div>
        <div class="card">
          <div class="kicker" style="margin-bottom:8px;color:var(--violet);">Top Concerns</div>
          ${topConcernsHtml}
        </div>
      </div>
      <div class="card">
        <div class="kicker" style="margin-bottom:8px;color:var(--jade);">Preventive Routine</div>
        ${m.preventiveRoutine.slice(0, 5).map(r => `<div class="body-s" style="margin-bottom:4px;">• ${esc(r)}</div>`).join("")}
      </div>
      <div style="margin-top:auto;padding-top:10px;">
        <div class="body-s" style="color:var(--ivory-mute);text-align:center;font-style:italic;">
          This is astrological analysis, not medical advice. Consult a qualified physician for any health concern.
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Health")}
  </section>`;
}

// ── Psychology Profile ────────────────────────────────────────────────────

function pagePsychology(chart: ChartData): string {
  const p = calculatePsychology(chart.planets as Parameters<typeof calculatePsychology>[0]);

  const cards = p.planets.slice(0, 6).map(pl => `
    <div class="card" style="padding:12px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--ivory);">${esc(pl.planet)}</div>
          <div class="kicker" style="font-size:9px;margin-top:1px;">${esc(pl.func)}</div>
        </div>
        <div class="mono" style="font-size:11px;color:var(--gold);">${pl.strength}/10</div>
      </div>
      <div class="body-s" style="margin-bottom:4px;color:${pl.strength >= 6 ? "var(--jade)" : "var(--saffron)"};">
        ${pl.strength >= 6 ? esc(pl.strong) : esc(pl.weak)}
      </div>
    </div>`).join("");

  return `<section class="page dense">
    ${pageRail("Psychological Profile", "17")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">10</span>
        <h2>Psychology</h2>
      </div>
      <div class="card gold-edge" style="margin-bottom:14px;">
        <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Dominant Pattern</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--gold-bright);margin-bottom:6px;">${esc(p.pattern.name)}</div>
        <div class="body-s" style="margin-bottom:6px;">${esc(p.pattern.desc)}</div>
        <div class="body-s" style="color:var(--violet);"><strong>Shadow side:</strong> ${esc(p.pattern.shadow)}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
        ${cards}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div class="kicker" style="margin-bottom:6px;color:var(--jade);">Stabilizers</div>
          ${p.stabilizers.slice(0, 3).map(s => `<div class="body-s" style="margin-bottom:3px;">• ${esc(s)}</div>`).join("")}
        </div>
        <div>
          <div class="kicker" style="margin-bottom:6px;color:var(--saffron);">Growth Plan</div>
          ${p.growthPlan.slice(0, 3).map(g => `<div class="body-s" style="margin-bottom:3px;">• ${esc(g)}</div>`).join("")}
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Psychology")}
  </section>`;
}

// ── Numerology ────────────────────────────────────────────────────────────

function pageNumerology(chart: ChartData): string {
  const n = calculateNumerology(chart.name, chart.dob);

  const numberCard = (label: string, num: typeof n.lifePath, accent: string) => `
    <div class="card" style="padding:12px;">
      <div class="kicker" style="margin-bottom:4px;color:${accent};font-size:9px;">${esc(label)}</div>
      <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px;">
        <div class="display-l" style="font-size:36px;color:${accent};line-height:1;">${num.value}</div>
        <div class="body-s">${esc(num.archetype)}</div>
      </div>
      <div class="body-s">${esc(num.keyword)}</div>
    </div>`;

  return `<section class="page dense">
    ${pageRail("Numerology · Vibrational Map", "18")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">11</span>
        <h2>Numerology</h2>
      </div>
      <div class="body-s" style="margin-bottom:14px;max-width:620px;">
        Each name and birthdate carries a numerical vibration. These five core numbers describe your soul's blueprint in numbers.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px;">
        ${numberCard("Life Path", n.lifePath, "var(--gold-bright)")}
        ${numberCard("Destiny", n.destiny, "var(--saffron)")}
        ${numberCard("Soul Urge", n.soulUrge, "var(--violet)")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
        ${numberCard("Personality", n.personality, "var(--jade)")}
        ${numberCard("Birthday", n.birthday, "var(--gold)")}
      </div>
      <div class="card gold-edge">
        <div class="kicker" style="margin-bottom:6px;">Life Path · ${n.lifePath.value} · ${esc(n.lifePath.archetype)}</div>
        <div class="body-s" style="line-height:1.6;">${esc(n.lifePath.desc)}</div>
      </div>
      <div class="body-s" style="margin-top:auto;padding-top:10px;color:var(--ivory-mute);text-align:center;">
        Personal Year <strong style="color:var(--gold);">${n.personalYear.value}</strong> · Personal Day <strong style="color:var(--gold);">${n.personalDay}</strong> · Age <strong style="color:var(--gold);">${n.currentAge}</strong>
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Numerology")}
  </section>`;
}

// ── Nakshatra Deep Dive (birth nakshatra) ─────────────────────────────────

function pageNakshatra(chart: ChartData): string {
  const moon = chart.planets["Moon"];
  if (!moon) return `<section class="page dense">${pageRail("Birth Nakshatra","14")}<div class="body" style="padding-top:24px;">No moon data available.</div>${pageFoot("astrolife · cosmic blueprint","Nakshatra")}</section>`;

  const medical = calculateMedical(chart);
  const nakData = medical.birthNakshatraData;

  return `<section class="page dense">
    ${pageRail("Birth Nakshatra · " + moon.nakshatra, "14")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">12</span>
        <h2>Birth Nakshatra</h2>
      </div>
      <div class="card gold-edge" style="margin-bottom:14px;text-align:center;padding:24px;">
        <div class="kicker" style="margin-bottom:8px;">Janma Nakshatra</div>
        <div class="display-l" style="font-size:48px;color:var(--gold-bright);margin-bottom:4px;">${esc(moon.nakshatra)}</div>
        <div class="body-s">Pada <strong style="color:var(--gold);">${moon.pada}</strong> · Lord <strong style="color:var(--gold);">${esc(moon.nakshatraLord)}</strong> · Moon in ${esc(moon.sign)} · House ${moon.house}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="card">
          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Body & Health</div>
          ${nakData ? `
            <div class="body-s" style="margin-bottom:4px;"><strong style="color:var(--gold);">Body zone:</strong> ${esc(nakData.body)}</div>
            <div class="body-s" style="margin-bottom:4px;"><strong style="color:var(--gold);">Tendency:</strong> ${esc(nakData.disease)}</div>
            <div class="body-s"><strong style="color:var(--gold);">Note:</strong> ${esc(nakData.note)}</div>
          ` : `<div class="body-s">Data unavailable.</div>`}
        </div>
        <div class="card">
          <div class="kicker" style="margin-bottom:8px;color:var(--jade);">Remedial Practice</div>
          <div class="body-s">${esc(medical.birthNakshatraUpay)}</div>
        </div>
      </div>
      <div class="body-s" style="margin-top:auto;padding:12px;background:var(--surface);border:1px solid var(--line);border-radius:4px;color:var(--ivory-mute);">
        The Moon's nakshatra is the most personal marker in Vedic astrology — it shapes emotional temperament, instinctive responses, and dharmic direction. Returning to it ritually each month on the same lunar position is a classical practice for self-attunement.
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Nakshatra")}
  </section>`;
}

// ============================================================
// PHASE 2 — Per-Planet & Per-House Deep Dives
// ============================================================

interface PlanetProfile {
  karaka: string;        // what it signifies
  domain: string;        // life areas
  strongTrait: string;   // when well-placed
  weakTrait: string;     // when afflicted
  body: string;          // body part governed
  day: string;           // weekday
  color: string;         // colour
  gem: string;           // gemstone
  metal: string;         // metal
  direction: string;     // direction
}

const PLANET_PROFILE: Record<string, PlanetProfile> = {
  Sun: {
    karaka: "Soul, ego, father, authority, vitality, government",
    domain: "Self-expression, leadership, status, the father, bones & heart",
    strongTrait: "Confident, principled, naturally commanding, radiant health and clear purpose",
    weakTrait: "Ego friction, authority clashes, low vitality, strained relationship with father",
    body: "Heart, eyes, spine, general vitality",
    day: "Sunday", color: "Red / Copper-gold", gem: "Ruby", metal: "Gold / Copper", direction: "East",
  },
  Moon: {
    karaka: "Mind, emotions, mother, nourishment, the public",
    domain: "Emotional life, intuition, the mother, fluids, comfort and home",
    strongTrait: "Emotionally intelligent, nurturing, intuitive, popular and adaptable",
    weakTrait: "Mood swings, anxiety, emotional dependency, mother-related karma",
    body: "Mind, blood, fluids, chest, stomach",
    day: "Monday", color: "White / Silver", gem: "Pearl / Moonstone", metal: "Silver", direction: "North-West",
  },
  Mars: {
    karaka: "Energy, courage, siblings, land, drive, conflict",
    domain: "Action, ambition, brothers, property, blood and muscle",
    strongTrait: "Courageous, disciplined, decisive, protective and physically vigorous",
    weakTrait: "Anger, impulsiveness, accidents, disputes and inflammation",
    body: "Muscles, blood, bone marrow, reproductive system",
    day: "Tuesday", color: "Red / Coral", gem: "Red Coral", metal: "Copper", direction: "South",
  },
  Mercury: {
    karaka: "Intellect, speech, communication, commerce, skill",
    domain: "Logic, learning, business, writing, nervous system",
    strongTrait: "Quick-witted, articulate, commercially sharp, adaptable and skilful",
    weakTrait: "Overthinking, nervous tension, scattered speech, indecision",
    body: "Skin, nervous system, lungs, hands",
    day: "Wednesday", color: "Green", gem: "Emerald", metal: "Bronze", direction: "North",
  },
  Jupiter: {
    karaka: "Wisdom, fortune, children, guru, dharma, expansion",
    domain: "Knowledge, ethics, wealth, teachers, children, the liver",
    strongTrait: "Wise, optimistic, generous, fortunate, naturally guided and protected",
    weakTrait: "Over-indulgence, dogma, weight issues, misplaced faith",
    body: "Liver, fat, thighs, sugar metabolism",
    day: "Thursday", color: "Yellow / Gold", gem: "Yellow Sapphire", metal: "Gold", direction: "North-East",
  },
  Venus: {
    karaka: "Love, beauty, marriage, luxury, art, pleasure",
    domain: "Relationships, aesthetics, comfort, vehicles, reproductive health",
    strongTrait: "Charming, artistic, refined, harmonious relationships and material grace",
    weakTrait: "Indulgence, relationship turbulence, vanity, hormonal imbalance",
    body: "Kidneys, reproductive organs, face, hormones",
    day: "Friday", color: "White / Pastel", gem: "Diamond / White Sapphire", metal: "Silver / Platinum", direction: "South-East",
  },
  Saturn: {
    karaka: "Discipline, karma, longevity, labour, restriction",
    domain: "Endurance, structure, the masses, chronic matters, longevity",
    strongTrait: "Disciplined, patient, enduring, just and capable of long sustained effort",
    weakTrait: "Delay, depression, fear loops, chronic fatigue and isolation",
    body: "Bones, joints, teeth, nerves, knees",
    day: "Saturday", color: "Blue / Black", gem: "Blue Sapphire", metal: "Iron / Steel", direction: "West",
  },
  Rahu: {
    karaka: "Ambition, obsession, foreign, illusion, technology",
    domain: "Worldly desire, the unconventional, foreign lands, sudden events",
    strongTrait: "Ambitious, innovative, magnetic, capable of meteoric unconventional rise",
    weakTrait: "Obsession, deception, anxiety, addiction and confusion",
    body: "Nervous disorders, mysterious ailments, skin",
    day: "Saturday", color: "Smoky / Dark blue", gem: "Hessonite (Gomed)", metal: "Lead", direction: "South-West",
  },
  Ketu: {
    karaka: "Liberation, detachment, past-life, spirituality, mysticism",
    domain: "Moksha, hidden knowledge, sudden losses, the occult",
    strongTrait: "Intuitive, spiritual, investigative, capable of deep liberation and insight",
    weakTrait: "Dissociation, apathy, sudden separations, hard-to-diagnose problems",
    body: "Hidden inflammation, spine base, subtle nervous system",
    day: "Tuesday", color: "Multi / Grey", gem: "Cat's Eye", metal: "Mixed alloy", direction: "North-West",
  },
};

// ── Per-Planet Deep Dive ──────────────────────────────────────────────────

function pagePerPlanet(chart: ChartData, name: string, pageNum: string): string {
  const pd = chart.planets[name];
  const prof = PLANET_PROFILE[name];
  if (!pd || !prof) {
    return `<section class="page dense">${pageRail(name, pageNum)}<div class="body" style="padding-top:24px;">No data for ${esc(name)}.</div>${pageFoot("astrolife · cosmic blueprint", name)}</section>`;
  }

  const skt = PLANET_SANSKRIT[name] ?? name;
  const dignityLower = pd.dignity.toLowerCase();
  let dignityColor = "var(--violet)";
  if (dignityLower.includes("exalt")) dignityColor = "var(--jade)";
  else if (dignityLower.includes("debilit")) dignityColor = "var(--crimson)";
  else if (dignityLower.includes("own") || dignityLower.includes("sva")) dignityColor = "var(--gold)";

  // House-effect text from Lal Kitab knowledge if available
  const houseRule = PLANET_HOUSE_RULES[name]?.[pd.house];
  const lkInterp = getMahadashaInterpretation(name, pd.house, pd.dignity);

  return `<section class="page dense">
    ${pageRail(name + " · Graha Analysis", pageNum)}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num devanagari">${esc(skt)}</span>
        <h2>${esc(name)}</h2>
      </div>

      <!-- Placement banner -->
      <div class="card gold-edge" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="kicker" style="margin-bottom:4px;">Placement</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--gold-bright);">${esc(pd.sign)} · House ${pd.house}</div>
          <div class="mono" style="font-size:11px;color:var(--ivory-mute);margin-top:2px;">${pd.degree}°${String(pd.minutes).padStart(2,"0")}' · ${esc(pd.nakshatra)} Pada ${pd.pada}${pd.retrograde ? " · Retrograde (R)" : ""}</div>
        </div>
        <div style="text-align:right;">
          <div class="kicker" style="margin-bottom:4px;">Dignity</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:${dignityColor};">${esc(pd.dignity)}</div>
        </div>
      </div>

      <!-- Karaka + domain -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="card">
          <div class="kicker" style="margin-bottom:6px;color:var(--saffron);">Significations (Karaka)</div>
          <div class="body-s">${esc(prof.karaka)}</div>
        </div>
        <div class="card">
          <div class="kicker" style="margin-bottom:6px;color:var(--violet);">Life Domains</div>
          <div class="body-s">${esc(prof.domain)}</div>
        </div>
      </div>

      <!-- Strong / weak -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="card" style="border-color:rgba(111,181,138,0.3);">
          <div class="kicker" style="margin-bottom:6px;color:var(--jade);">When Well-Placed</div>
          <div class="body-s">${esc(prof.strongTrait)}</div>
        </div>
        <div class="card" style="border-color:rgba(201,85,95,0.25);">
          <div class="kicker" style="margin-bottom:6px;color:var(--crimson);">When Afflicted</div>
          <div class="body-s">${esc(prof.weakTrait)}</div>
        </div>
      </div>

      <!-- Interpretation -->
      <div class="card" style="margin-bottom:14px;">
        <div class="kicker" style="margin-bottom:8px;color:var(--gold);">In Your Chart — House ${pd.house}</div>
        <div class="body-s" style="line-height:1.65;">${esc(houseRule?.core || lkInterp.overview || `${name} in house ${pd.house} channels its energy into ${prof.domain.toLowerCase()}.`)}</div>
        ${houseRule?.career ? `<div class="body-s" style="line-height:1.6;margin-top:8px;"><strong style="color:var(--gold-dim);">Career:</strong> ${esc(houseRule.career)}</div>` : ""}
        ${houseRule?.health ? `<div class="body-s" style="line-height:1.6;margin-top:6px;"><strong style="color:var(--gold-dim);">Health:</strong> ${esc(houseRule.health)}</div>` : ""}
      </div>

      <!-- Quick reference strip -->
      <div style="margin-top:auto;display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding-top:10px;border-top:1px solid var(--line);font-size:10px;">
        <div><div class="kicker" style="font-size:8px;margin-bottom:2px;">Day</div><div class="body-s">${esc(prof.day)}</div></div>
        <div><div class="kicker" style="font-size:8px;margin-bottom:2px;">Colour</div><div class="body-s">${esc(prof.color)}</div></div>
        <div><div class="kicker" style="font-size:8px;margin-bottom:2px;">Gem</div><div class="body-s">${esc(prof.gem)}</div></div>
        <div><div class="kicker" style="font-size:8px;margin-bottom:2px;">Metal</div><div class="body-s">${esc(prof.metal)}</div></div>
        <div><div class="kicker" style="font-size:8px;margin-bottom:2px;">Body</div><div class="body-s">${esc(prof.body)}</div></div>
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", name)}
  </section>`;
}

// ── Per-House Deep Dive ───────────────────────────────────────────────────

interface HouseProfile {
  sanskrit: string;
  name: string;
  category: "Kendra" | "Trikona" | "Dusthana" | "Upachaya" | "Maraka";
  karaka: string;       // natural significator planet
  areas: string;        // life areas
  detail: string;       // detailed significations
  strong: string;       // when well-supported
  weak: string;         // when afflicted
}

const HOUSE_PROFILE: Record<number, HouseProfile> = {
  1:  { sanskrit:"तनु भाव", name:"Tanu · Self", category:"Kendra", karaka:"Sun", areas:"Body, personality, vitality, the head, overall life direction", detail:"The ascendant governs your physical body, temperament, appearance, health constitution, and the lens through which you meet the world. It is the foundation on which the whole chart rests.", strong:"Strong vitality, clear identity, commanding presence and good health.", weak:"Health fragility, identity confusion, low self-confidence." },
  2:  { sanskrit:"धन भाव", name:"Dhana · Wealth", category:"Maraka", karaka:"Jupiter", areas:"Wealth, family, speech, food, accumulated resources, the face", detail:"The second house rules your earning capacity, savings, family lineage, speech, and what you value. It also governs the face, mouth, and eating habits.", strong:"Steady wealth, eloquent speech, supportive family, refined tastes.", weak:"Financial instability, harsh speech, family discord, food issues." },
  3:  { sanskrit:"पराक्रम भाव", name:"Parakrama · Courage", category:"Upachaya", karaka:"Mars", areas:"Courage, siblings, communication, short travel, skills, hands", detail:"The third house governs initiative, valour, younger siblings, hobbies, writing, and self-effort. It is a house that improves with age and conscious effort.", strong:"Courageous, skilled, supportive siblings, strong communication.", weak:"Timidity, sibling friction, scattered effort, communication blocks." },
  4:  { sanskrit:"सुख भाव", name:"Sukha · Happiness", category:"Kendra", karaka:"Moon", areas:"Mother, home, property, vehicles, emotional security, the heart", detail:"The fourth house is the seat of inner happiness, the mother, real estate, vehicles, education foundations, and emotional roots.", strong:"Domestic comfort, property, strong mother bond, inner peace.", weak:"Restlessness, property disputes, mother-related karma, emotional unease." },
  5:  { sanskrit:"पुत्र भाव", name:"Putra · Creativity", category:"Trikona", karaka:"Jupiter", areas:"Children, intelligence, romance, speculation, past-life merit, mantra", detail:"The fifth house governs progeny, creative intelligence, romance, education, and purva-punya (past-life good karma). A key house for dharma and joy.", strong:"Creative brilliance, good children, romantic fulfilment, sharp intellect.", weak:"Difficulty with children, blocked creativity, romantic turbulence." },
  6:  { sanskrit:"रिपु भाव", name:"Ripu · Challenges", category:"Dusthana", karaka:"Mars", areas:"Enemies, disease, debt, service, daily work, competition", detail:"The sixth house rules obstacles, health challenges, debts, litigation, service, and the capacity to overcome adversity. An upachaya house that strengthens over time.", strong:"Defeats enemies, overcomes disease, excels in service and competition.", weak:"Chronic health issues, debt, litigation, workplace conflict." },
  7:  { sanskrit:"कलत्र भाव", name:"Kalatra · Partnership", category:"Kendra", karaka:"Venus", areas:"Marriage, spouse, business partners, public dealings, trade", detail:"The seventh house governs marriage, the spouse's nature, business partnerships, and all one-to-one relationships and public interactions.", strong:"Harmonious marriage, supportive spouse, successful partnerships.", weak:"Marital friction, partnership disputes, relationship delays." },
  8:  { sanskrit:"आयु भाव", name:"Ayu · Transformation", category:"Dusthana", karaka:"Saturn", areas:"Longevity, transformation, inheritance, occult, sudden events", detail:"The eighth house governs longevity, deep transformation, inheritances, in-laws, occult knowledge, and sudden upheavals. The house of hidden things and rebirth.", strong:"Longevity, occult insight, inheritance, transformative resilience.", weak:"Sudden disruptions, health crises, inheritance disputes, anxiety." },
  9:  { sanskrit:"धर्म भाव", name:"Dharma · Fortune", category:"Trikona", karaka:"Jupiter", areas:"Luck, dharma, father, guru, higher learning, long travel, pilgrimage", detail:"The ninth house is the most auspicious trikona — governing fortune, the father, gurus, philosophy, higher education, and one's connection to dharma.", strong:"Great fortune, wise guidance, dharmic life, supportive father and teachers.", weak:"Fluctuating luck, faith struggles, distance from father or guru." },
  10: { sanskrit:"कर्म भाव", name:"Karma · Career", category:"Kendra", karaka:"Mercury", areas:"Career, status, authority, public reputation, the knees", detail:"The tenth house is the pinnacle of the chart — governing profession, social standing, authority, fame, and one's contribution to the world.", strong:"Career success, authority, public recognition, professional integrity.", weak:"Career instability, status struggles, reputational challenges." },
  11: { sanskrit:"लाभ भाव", name:"Labha · Gains", category:"Upachaya", karaka:"Jupiter", areas:"Gains, income, elder siblings, social networks, fulfilled desires", detail:"The eleventh house governs all forms of gain — income, profits, friendships, elder siblings, and the fulfilment of desires. The strongest house for material accumulation.", strong:"Strong income, influential network, fulfilled ambitions.", weak:"Blocked gains, unreliable friends, unfulfilled desires." },
  12: { sanskrit:"व्यय भाव", name:"Vyaya · Liberation", category:"Dusthana", karaka:"Saturn", areas:"Loss, expenditure, foreign lands, spirituality, sleep, moksha", detail:"The twelfth house governs expenditure, foreign residence, isolation, spirituality, sleep, and ultimately liberation (moksha). The house of letting go.", strong:"Spiritual depth, foreign success, restful sleep, charitable nature.", weak:"Excessive expenditure, isolation, sleep issues, hidden enemies." },
};

const HOUSE_CAT_COLOR: Record<string, string> = {
  Kendra: "var(--gold)", Trikona: "var(--jade)", Dusthana: "var(--crimson)",
  Upachaya: "var(--saffron)", Maraka: "var(--violet)",
};

function pagePerHouse(chart: ChartData, houseNum: number, pageNum: string): string {
  const prof = HOUSE_PROFILE[houseNum];
  if (!prof) return `<section class="page dense">${pageRail("House " + houseNum, pageNum)}<div class="body" style="padding-top:24px;">No data.</div>${pageFoot("astrolife · cosmic blueprint", "House")}</section>`;

  const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
  const SIGN_RULER_MAP: Record<string,string> = {
    Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",Leo:"Sun",Virgo:"Mercury",
    Libra:"Venus",Scorpio:"Mars",Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
  };
  const houseSignIdx = ((chart.lagnaNum + (houseNum - 1)) % 12 + 12) % 12;
  const houseSign = SIGNS[houseSignIdx];
  const houseLord = SIGN_RULER_MAP[houseSign];
  const lordPd = chart.planets[houseLord];

  // Occupants
  const occupants = Object.entries(chart.planets)
    .filter(([, pd]) => pd.house === houseNum)
    .map(([n]) => n);

  const catColor = HOUSE_CAT_COLOR[prof.category] ?? "var(--gold)";

  return `<section class="page dense">
    ${pageRail(prof.name, pageNum)}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">${houseNum}</span>
        <h2>${esc(prof.name.split(" · ")[1] ?? prof.name)}</h2>
      </div>

      <!-- House banner -->
      <div class="card gold-edge" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div class="devanagari" style="font-size:18px;color:var(--gold-dim);margin-bottom:2px;">${esc(prof.sanskrit)}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--gold-bright);">House ${houseNum} · ${esc(houseSign)}</div>
        </div>
        <div style="text-align:right;">
          <div class="kicker" style="margin-bottom:4px;">Category</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:${catColor};">${esc(prof.category)}</div>
        </div>
      </div>

      <!-- Detail -->
      <div class="card" style="margin-bottom:14px;">
        <div class="kicker" style="margin-bottom:6px;color:var(--saffron);">Significations</div>
        <div class="body-s" style="margin-bottom:8px;">${esc(prof.areas)}</div>
        <div class="body-s" style="line-height:1.65;">${esc(prof.detail)}</div>
      </div>

      <!-- Lord + occupants -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div class="card">
          <div class="kicker" style="margin-bottom:6px;color:var(--gold);">House Lord · ${esc(houseLord)}</div>
          ${lordPd
            ? `<div class="body-s">Placed in <strong style="color:var(--ivory);">${esc(lordPd.sign)}</strong>, House <strong style="color:var(--ivory);">${lordPd.house}</strong> at ${lordPd.degree}°${String(lordPd.minutes).padStart(2,"0")}'.</div>
               <div class="body-s" style="margin-top:6px;">Dignity: <strong style="color:var(--gold-bright);">${esc(lordPd.dignity)}</strong></div>`
            : `<div class="body-s">Lord placement unavailable.</div>`}
        </div>
        <div class="card">
          <div class="kicker" style="margin-bottom:6px;color:var(--violet);">Occupants</div>
          ${occupants.length > 0
            ? `<div class="body-s">${occupants.map(o => `<span style="color:var(--gold);">${esc(o)}</span>`).join(", ")}</div>
               <div class="body-s" style="margin-top:6px;color:var(--ivory-mute);">${occupants.length} planet${occupants.length > 1 ? "s" : ""} activate this house directly.</div>`
            : `<div class="body-s" style="color:var(--ivory-mute);">No planets occupy this house. It is read primarily through its lord and aspects.</div>`}
        </div>
      </div>

      <!-- Strong / weak -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:auto;">
        <div class="card" style="border-color:rgba(111,181,138,0.3);">
          <div class="kicker" style="margin-bottom:6px;color:var(--jade);">When Supported</div>
          <div class="body-s">${esc(prof.strong)}</div>
        </div>
        <div class="card" style="border-color:rgba(201,85,95,0.25);">
          <div class="kicker" style="margin-bottom:6px;color:var(--crimson);">When Afflicted</div>
          <div class="body-s">${esc(prof.weak)}</div>
        </div>
      </div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", prof.name.split(" · ")[1] ?? "House")}
  </section>`;
}

// ============================================================
// PHASE 3 — Life Areas, Ashtakavarga, Antardasha
// ============================================================

interface LifeAreaConfig {
  title: string;
  pageLabel: string;
  houses: number[];     // primary houses governing this area
  karakas: string[];    // natural significator planets
  intro: string;        // what this area covers
  guidance: string;     // closing reflection
}

const SIGNS_ARR = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGN_RULER_FULL: Record<string,string> = {
  Aries:"Mars",Taurus:"Venus",Gemini:"Mercury",Cancer:"Moon",Leo:"Sun",Virgo:"Mercury",
  Libra:"Venus",Scorpio:"Mars",Sagittarius:"Jupiter",Capricorn:"Saturn",Aquarius:"Saturn",Pisces:"Jupiter",
};

function pageLifeArea(chart: ChartData, cfg: LifeAreaConfig, pageNum: string): string {
  // Assess each governing house
  const houseRows = cfg.houses.map(h => {
    const signIdx = ((chart.lagnaNum + (h - 1)) % 12 + 12) % 12;
    const sign = SIGNS_ARR[signIdx];
    const lord = SIGN_RULER_FULL[sign];
    const lordPd = chart.planets[lord];
    const occupants = Object.entries(chart.planets).filter(([, pd]) => pd.house === h).map(([n]) => n);
    const hp = HOUSE_PROFILE[h];
    return `<div class="card" style="padding:12px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-bright);">House ${h} · ${esc(sign)}</div>
        <div class="kicker" style="font-size:8px;">${esc(hp?.name.split(" · ")[1] ?? "")}</div>
      </div>
      <div class="body-s">Lord <strong style="color:var(--ivory);">${esc(lord)}</strong>${lordPd ? ` in ${esc(lordPd.sign)} (H${lordPd.house}) · ${esc(lordPd.dignity)}` : ""}.
      ${occupants.length > 0 ? ` Occupied by <strong style="color:var(--gold);">${occupants.map(esc).join(", ")}</strong>.` : " No occupants."}</div>
    </div>`;
  }).join("");

  const karakaRows = cfg.karakas.map(k => {
    const pd = chart.planets[k];
    if (!pd) return "";
    const dl = pd.dignity.toLowerCase();
    const dc = dl.includes("exalt") ? "var(--jade)" : dl.includes("debilit") ? "var(--crimson)" : dl.includes("own") || dl.includes("sva") ? "var(--gold)" : "var(--violet)";
    return `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:6px 0;border-bottom:1px dashed var(--line);">
      <span class="body-s"><strong style="color:var(--ivory);">${esc(k)}</strong> · ${esc(pd.sign)} H${pd.house}</span>
      <span class="body-s" style="color:${dc};">${esc(pd.dignity)}</span>
    </div>`;
  }).join("");

  return `<section class="page dense">
    ${pageRail(cfg.title, pageNum)}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">✦</span>
        <h2>${esc(cfg.title)}</h2>
      </div>
      <div class="body-s" style="margin-bottom:16px;max-width:600px;line-height:1.6;">${esc(cfg.intro)}</div>

      <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Governing Houses</div>
      ${houseRows}

      <div class="card gold-edge" style="margin-top:6px;">
        <div class="kicker" style="margin-bottom:8px;color:var(--gold);">Natural Significators (Karakas)</div>
        ${karakaRows || `<div class="body-s">Significator data unavailable.</div>`}
      </div>

      <div class="body-s" style="margin-top:auto;padding-top:12px;color:var(--ivory-mute);font-style:italic;line-height:1.6;">${esc(cfg.guidance)}</div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", cfg.pageLabel)}
  </section>`;
}

const LIFE_AREAS: LifeAreaConfig[] = [
  {
    title: "Career & Profession", pageLabel: "Career",
    houses: [10, 1, 6], karakas: ["Sun", "Saturn", "Mercury"],
    intro: "Your professional life is read primarily from the 10th house (karma, status), supported by the 1st (drive, self) and 6th (daily work, service). The lords of these houses and the natural karakas of work reveal the shape of your vocation.",
    guidance: "Career is not fixed by the chart — it is a field of probability. Where significators are strong, momentum comes easily; where they need support, conscious effort and the right timing (dasha) unlock the same potential.",
  },
  {
    title: "Wealth & Finances", pageLabel: "Wealth",
    houses: [2, 11, 5], karakas: ["Jupiter", "Venus", "Mercury"],
    intro: "Wealth flows through the 2nd house (accumulated assets, savings), the 11th (gains, income, fulfilled desires), and the 5th (speculation, intelligence applied to money). Jupiter is the prime karaka of prosperity.",
    guidance: "Sustainable wealth comes from aligning earning with dharma. Strong 2nd and 11th lords indicate capacity; the dasha sequence indicates timing of the major financial chapters.",
  },
  {
    title: "Marriage & Relationships", pageLabel: "Marriage",
    houses: [7, 2, 11], karakas: ["Venus", "Jupiter", "Moon"],
    intro: "Partnership is governed by the 7th house (spouse, union), with the 2nd (family expansion) and 11th (fulfilment of desire) as supports. Venus signifies love and harmony for all; Jupiter signifies the husband in a woman's chart.",
    guidance: "Relationship karma is among the most workable in the chart. Awareness of one's own patterns — shown by the 7th lord and its placement — is the first remedy. The Navamsa (D9) refines this reading further.",
  },
  {
    title: "Family & Home", pageLabel: "Family",
    houses: [4, 2, 9], karakas: ["Moon", "Venus", "Sun"],
    intro: "The 4th house is the seat of mother, home, and emotional security; the 2nd governs the immediate family unit; the 9th governs the father and lineage. Together they describe your roots and domestic life.",
    guidance: "The home is the foundation of inner peace (sukha). When the 4th house and Moon are supported, domestic life nourishes; when stressed, conscious cultivation of a peaceful home environment becomes the practice.",
  },
  {
    title: "Children & Creativity", pageLabel: "Children",
    houses: [5, 9, 2], karakas: ["Jupiter"],
    intro: "The 5th house governs progeny, creative intelligence, and purva-punya (past-life merit); the 9th supports through fortune and dharma; the 2nd through family continuity. Jupiter is the karaka of children.",
    guidance: "The 5th house is the house of joy and creative output, whether through children or works of the mind and heart. Its strength shows where your generative energy flows most naturally.",
  },
  {
    title: "Education & Intellect", pageLabel: "Education",
    houses: [4, 5, 9], karakas: ["Mercury", "Jupiter"],
    intro: "Learning is read from the 4th house (foundational education, degrees), the 5th (intelligence, application), and the 9th (higher knowledge, wisdom). Mercury governs analytical skill; Jupiter governs wisdom and higher learning.",
    guidance: "Education is a lifelong arc in Vedic thought. Mercury's condition shows your learning style; Jupiter's shows the depth of wisdom you can ultimately embody.",
  },
  {
    title: "Spirituality & Dharma", pageLabel: "Spirituality",
    houses: [9, 12, 5], karakas: ["Jupiter", "Ketu", "Sun"],
    intro: "The spiritual axis runs through the 9th house (dharma, guru, higher purpose), the 12th (moksha, liberation, surrender), and the 5th (mantra, past-life merit). Jupiter is the karaka of wisdom; Ketu of liberation.",
    guidance: "Spirituality in the chart is not about belief but about the soul's trajectory toward liberation. A strong 9th-12th axis indicates a life where the inner journey carries real weight and reward.",
  },
  {
    title: "Health & Longevity", pageLabel: "Longevity",
    houses: [1, 8, 6], karakas: ["Sun", "Saturn", "Moon"],
    intro: "Vitality is read from the 1st house (body, constitution), longevity from the 8th (lifespan, resilience), and health challenges from the 6th (disease, recovery). Sun governs vitality; Saturn governs endurance and the ageing process.",
    guidance: "This is astrological analysis, not medical advice. The chart shows constitutional tendencies and timing of vulnerability — always paired with the understanding that lifestyle and conscious care are the sovereign remedies.",
  },
];

// ── Ashtakavarga ──────────────────────────────────────────────────────────

function pageAshtakavarga(chart: ChartData, pageNum: string): string {
  const akv = calculateAshtakavarga(
    chart.planets as Parameters<typeof calculateAshtakavarga>[0],
    chart.lagnaNum
  );

  const houseBars = akv.houses.map(h => {
    const pct = Math.min(100, Math.round((h.score / 8) * 100));
    return `<div style="display:grid;grid-template-columns:30px 1fr 36px;align-items:center;gap:8px;padding:3px 0;">
      <span class="mono body-s" style="color:var(--gold-dim);">H${h.house}</span>
      <div style="height:8px;background:var(--line);border-radius:99px;overflow:hidden;">
        <div style="height:100%;width:${pct}%;background:${h.color};border-radius:99px;"></div>
      </div>
      <span class="mono body-s" style="text-align:right;color:${h.color};font-weight:600;">${h.score}</span>
    </div>`;
  }).join("");

  return `<section class="page dense">
    ${pageRail("Ashtakavarga · Bindu Strength", pageNum)}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">AV</span>
        <h2>Ashtakavarga</h2>
      </div>
      <div class="body-s" style="margin-bottom:16px;max-width:620px;line-height:1.6;">
        Ashtakavarga assigns benefic points (bindus) to each house from the perspective of all seven planets plus the Lagna. The Sarvashtakavarga total per house reveals which life areas carry the most natural support. Total across the chart: <strong style="color:var(--gold);">${akv.sarvaTotal}</strong> bindus (classical average 337).
      </div>
      <div class="card" style="margin-bottom:14px;">
        <div class="kicker" style="margin-bottom:10px;color:var(--saffron);">House Strength (Sarvashtakavarga)</div>
        ${houseBars}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="card" style="border-color:rgba(111,181,138,0.3);">
          <div class="kicker" style="margin-bottom:6px;color:var(--jade);">Strongest Life Areas</div>
          ${akv.topLifeAreas.slice(0, 4).map(a => `<div class="body-s" style="margin-bottom:3px;">• ${esc(a)}</div>`).join("") || `<div class="body-s">—</div>`}
        </div>
        <div class="card" style="border-color:rgba(201,85,95,0.25);">
          <div class="kicker" style="margin-bottom:6px;color:var(--crimson);">Needs Support</div>
          ${akv.weakLifeAreas.slice(0, 4).map(a => `<div class="body-s" style="margin-bottom:3px;">• ${esc(a)}</div>`).join("") || `<div class="body-s">—</div>`}
        </div>
      </div>
      <div class="body-s" style="margin-top:auto;padding-top:12px;color:var(--ivory-mute);line-height:1.6;">${esc(akv.lifeSummary)}</div>
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Ashtakavarga")}
  </section>`;
}

// ── Antardasha Detail (sub-periods of active Mahadasha) ───────────────────

function pageAntardashaDetail(chart: ChartData, pageNum: string): string {
  const activeMD = chart.dashas.find(d => d.active) ?? chart.dashas[0];
  const ads = chart.antardasha.slice(0, 9); // full antardasha sequence

  if (ads.length === 0) {
    return `<section class="page dense">${pageRail("Antardasha Sequence", pageNum)}<div class="body" style="padding-top:24px;">No antardasha data available.</div>${pageFoot("astrolife · cosmic blueprint", "Antardasha")}</section>`;
  }

  const rows = ads.map(ad => {
    const pd = chart.planets[ad.planet];
    const interp = pd ? getMahadashaInterpretation(ad.planet, pd.house, pd.dignity) : null;
    const isActive = ad.active;
    return `<div class="card${isActive ? " gold-edge" : ""}" style="padding:12px;margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:17px;color:${isActive ? "var(--gold-bright)" : "var(--ivory)"};">
          ${esc(activeMD?.planet ?? "")}–${esc(ad.planet)} ${isActive ? "<span class='badge' style='font-size:8px;'>Active</span>" : ""}
        </div>
        <div class="mono body-s" style="color:var(--ivory-mute);">${formatDateShort(new Date(ad.start))} — ${formatDateShort(new Date(ad.end))}</div>
      </div>
      ${interp ? `<div class="body-s" style="line-height:1.55;">${esc(interp.overview.slice(0, 240))}${interp.overview.length > 240 ? "…" : ""}</div>` : ""}
    </div>`;
  }).join("");

  return `<section class="page dense">
    ${pageRail("Antardasha Sequence · " + (activeMD?.planet ?? "") + " Mahadasha", pageNum)}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num">AD</span>
        <h2>Antardasha Sequence</h2>
      </div>
      <div class="body-s" style="margin-bottom:14px;max-width:600px;line-height:1.6;">
        Within the ${esc(activeMD?.planet ?? "")} Mahadasha, nine sub-periods (antardashas) unfold in sequence — each colouring the larger period with its own planetary flavour. This is the finer texture of your current time-map.
      </div>
      ${rows}
    </div>
    ${pageFoot("astrolife · cosmic blueprint", "Antardasha")}
  </section>`;
}

// ── Master HTML builder ───────────────────────────────────────────────────

export function generateReportHTML(chart: ChartData, options?: Partial<ReportOptions>): string {
  const context = buildReportEngineContext(chart, options);
  const { palette, cover } = context.settings;

  const coverPage = cover === "lagnalord" ? page1LagnaLord(chart) : page1Wheel(chart);

  // Wrap every page in try-catch so one data error never blanks the whole report
  function safe(fn: () => string, label: string): string {
    try { return fn(); }
    catch (e) {
      console.error(`[AstroLife Report] Page "${label}" failed:`, e);
      return `<section class="page"><div style="padding:64px;color:var(--ivory-mute);font-family:sans-serif;">
        <div style="font-size:14px;font-weight:700;margin-bottom:8px;">Section: ${label}</div>
        <div style="font-size:12px;">This section could not be rendered. Please regenerate the report.</div>
      </div></section>`;
    }
  }

  // Per report type, choose which sections to include.
  // full = everything; kundli = chart-heavy; remedy = remedy-heavy;
  // medical = health-only; destiny = career + dasha focus.
  const t = context.settings.type;
  const include = {
    chart:       true,                                              // always
    perPlanet:   t === "full" || t === "kundli",
    perHouse:    t === "full" || t === "kundli",
    yogas:       t === "full" || t === "kundli" || t === "destiny",
    doshas:      t === "full" || t === "kundli",
    shadbala:    t === "full" || t === "kundli",
    divisional:  t === "full" || t === "kundli",
    dasha:       t === "full" || t === "remedy" || t === "destiny",
    nakshatra:   t === "full" || t === "kundli" || t === "remedy",
    health:      t === "full" || t === "medical",
    psychology:  t === "full",
    numerology:  t === "full",
    lalkitab:    t === "full" || t === "kundli" || t === "remedy",
    remedies:    t === "full" || t === "remedy" || t === "medical",
    // Phase 3
    ashtakavarga: t === "full" || t === "kundli",
    antardasha:   t === "full" || t === "remedy" || t === "destiny",
    lifeAreas:    t === "full" || t === "destiny",
  };

  // Per-planet deep-dive pages (Phase 2). Page numbers are cosmetic labels.
  const PLANET_ORDER = ["Sun","Moon","Mars","Mercury","Jupiter","Venus","Saturn","Rahu","Ketu"];
  const perPlanetPages = include.perPlanet
    ? PLANET_ORDER.map((p, i) => safe(() => pagePerPlanet(chart, p, String(7 + i)), `Planet:${p}`))
    : [];

  // Per-house deep-dive pages (Phase 2) — all 12 bhavas.
  const perHousePages = include.perHouse
    ? Array.from({ length: 12 }, (_, i) => safe(() => pagePerHouse(chart, i + 1, String(16 + i)), `House:${i + 1}`))
    : [];

  // Life-area pages (Phase 3) — 8 areas.
  const lifeAreaPages = include.lifeAreas
    ? LIFE_AREAS.map((cfg, i) => safe(() => pageLifeArea(chart, cfg, String(40 + i)), `LifeArea:${cfg.pageLabel}`))
    : [];

  const pages = [
    safe(() => coverPage,                    "Cover"),
    safe(() => page2Welcome(chart),          "Welcome"),
    safe(() => page3Foreword(),              "Foreword"),
    safe(() => page4TOC(),                   "Contents"),
    safe(() => page5BirthSnapshot(chart),    "Birth Snapshot"),
    safe(() => page6PlanetaryDashboard(chart),"Planetary Dashboard"),
    ...perPlanetPages,
    ...perHousePages,
    include.yogas      ? safe(() => pageYogas(chart),       "Yogas")           : "",
    include.doshas     ? safe(() => pageDoshas(chart),      "Doshas")          : "",
    include.shadbala   ? safe(() => pageShadbala(chart),    "Shadbala")        : "",
    include.ashtakavarga ? safe(() => pageAshtakavarga(chart, "Av"), "Ashtakavarga") : "",
    include.divisional ? safe(() => pageDivisional(chart),  "Divisional")      : "",
    include.dasha      ? safe(() => page7CurrentDasha(chart),  "Current Dasha")  : "",
    include.dasha      ? safe(() => page8UpcomingDashas(chart),"Upcoming Dashas"): "",
    include.antardasha ? safe(() => pageAntardashaDetail(chart, "Ad"), "Antardasha") : "",
    include.lalkitab   ? safe(() => pageLalKitabCoreAccuracy(chart), "Lal Kitab Core Accuracy") : "",
    include.lalkitab   ? safe(() => pageLalKitabTimingAndRemedy(chart), "Lal Kitab Timing & Remedy") : "",
    include.nakshatra  ? safe(() => pageNakshatra(chart),   "Nakshatra")       : "",
    ...lifeAreaPages,
    include.health     ? safe(() => pageHealth(chart),      "Health")          : "",
    include.psychology ? safe(() => pagePsychology(chart),  "Psychology")      : "",
    include.numerology ? safe(() => pageNumerology(chart),  "Numerology")      : "",
    include.remedies   ? safe(() => page9Remedies(chart),   "Remedies")        : "",
    safe(() => page10Closing(chart),         "Closing"),
    safe(() => page11EngineLedger(context),  "Engine Ledger"),
  ].filter(Boolean).join("\n\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=820"/>
<title>AstroLife — Cosmic Blueprint · ${esc(capitalize(chart.name))}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<!-- font-display:swap means text renders immediately with fallback,
     then swaps when the real font arrives. No blocking on font load. -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Noto+Serif+Devanagari:wght@500&display=swap" rel="stylesheet">
<style>
${STYLES_CSS}
</style>
<style>
@media print {
  body { background: transparent !important; padding: 0 !important; gap: 0 !important; }
  .page {
    page-break-after: always;
    break-after: page;
    break-inside: avoid;
    box-shadow: none !important;
    width: 820px !important;
    height: 1160px !important;
    min-height: 1160px !important;
    max-height: 1160px !important;
    overflow: hidden !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  * {
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  #report-toolbar { display: none !important; }

  /* ── PDF performance — hide bitmap-heavy decorations ──
     Puppeteer rasterizes CSS radial-gradients into the PDF as
     full-page bitmaps with transparency. Across 17 pages this
     produces a heavy PDF that lags in mobile viewers (30s+ to
     first paint, scroll stutter). The solid background colour
     remains, which renders instantly in any PDF viewer. */
  .starfield,
  .glow-tl,
  .glow-br,
  .page-watermark {
    display: none !important;
  }
  /* Drop expensive transparency layers on every page */
  .page::before, .page::after { display: none !important; }
}
@page {
  size: ${REPORT_PAGE_SIZE.width}px ${REPORT_PAGE_SIZE.height}px;
  margin: 0;
}
</style>
</head>
<body class="palette-${palette}">
<div id="report-toolbar" style="position:fixed;top:16px;right:16px;z-index:9999;display:flex;align-items:center;gap:10px;">
  <span id="font-status" style="font-family:sans-serif;font-size:12px;color:#8A8474;letter-spacing:0.05em;">Loading fonts…</span>
  <button id="print-btn" disabled onclick="document.fonts.ready.then(()=>window.print())"
    style="padding:10px 22px;background:#555;color:#ccc;border:none;border-radius:6px;font-weight:700;cursor:not-allowed;font-size:13px;transition:all 0.3s;">
    Save as PDF
  </button>
</div>
<script>
  document.fonts.ready.then(function() {
    var btn = document.getElementById('print-btn');
    var status = document.getElementById('font-status');
    btn.disabled = false;
    btn.style.background = '#C9A961';
    btn.style.color = '#060410';
    btn.style.cursor = 'pointer';
    status.textContent = 'Ready';
    status.style.color = '#6FB58A';
  });
</script>

${pages}
</body>
</html>`;
}

// ── Public API ────────────────────────────────────────────────────────────

export async function downloadReportAsPDF(chart: ChartData, options: ReportOptions): Promise<void> {
  // POST chart data to server-side Puppeteer route — returns a real .pdf binary.
  // Works on all devices including mobile. No print dialog, no font issues.
  const response = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chart, options }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "PDF generation failed on server");
  }

  const blob     = await response.blob();
  const url      = URL.createObjectURL(blob);
  const safeName = (chart.name ?? "Report")
    .replace(/[^a-zA-Z0-9 ]/g, "").trim().replace(/\s+/g, "-") || "Report";
  const filename = `AstroLife-${safeName}.pdf`;

  // iOS Safari ignores <a download> on blob URLs — use window.open() instead
  // which triggers the native PDF viewer where user can then save/share.
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // Open PDF in new tab → iOS PDF viewer → Share → Save to Files
    const newTab = window.open(url, "_blank");
    if (!newTab) {
      // Popup blocked — fallback: navigate current page to the blob URL
      window.location.href = url;
    }
  } else {
    const a   = document.createElement("a");
    a.href    = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
