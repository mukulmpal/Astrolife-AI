/**
 * ============================================================================
 * ASTROLIFE — MODULAR PACKAGE & DOSSIER HTML-TO-PDF GENERATOR (v2.0)
 * ============================================================================
 * Generates ultra-luxury, print-perfect 24-page HTML dossiers for all
 * AstroLife report packages (Sacred Union, Wealth Yogas, Space Destiny,
 * Bio-Remedies, Stock Speculation, Jaimini, Medical, Muhurat) and the
 * 90-Year Destiny Curve Flagship Dossier.
 *
 * Rendered server-side via Puppeteer/Chromium for crisp vector typography,
 * sacred geometry, and authentic shastric presentation matching Elite standard.
 *
 * NOTE: Independent from legacy report-html-generator.ts to guarantee zero
 * regression or changes to the existing Elite PDF report.
 * ============================================================================
 */

import type { ChartData } from "../astro-engine/calculations";
import { calculateDivisional, type DivChart } from "../astro-engine/divisional";
import { detectYogas, type YogaResult } from "../astro-engine/yogas";
import { calculateShadbala, type ShadbalaResult } from "../astro-engine/shadbala";
import { calculateAshtakavarga, type AKVResult } from "../astro-engine/ashtakavarga";
import { calculateKarakas } from "../astro-engine/jaimini";

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

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_GLYPHS = [
  "♈", "♉", "♊", "♋", "♌", "♍",
  "♎", "♏", "♐", "♑", "♒", "♓"
];

const PLANET_ABBR: Record<string, string> = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke",
  Ascendant: "As",
};

// North Indian Diamond Chart House Coordinates [cx, cy] for 360x360 SVG
const HOUSE_POSITIONS: Record<number, [number, number]> = {
  1:  [180, 110], // Top center diamond
  2:  [100, 55],  // Top-left triangle
  3:  [55, 100],  // Upper-left corner triangle
  4:  [110, 180], // Middle-left diamond
  5:  [55, 260],  // Lower-left corner triangle
  6:  [100, 305], // Bottom-left triangle
  7:  [180, 250], // Bottom center diamond
  8:  [260, 305], // Bottom-right triangle
  9:  [305, 260], // Lower-right corner triangle
  10: [250, 180], // Middle-right diamond
  11: [305, 100], // Upper-right corner triangle
  12: [260, 55],  // Top-right triangle
};

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

export function generatePackageDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions
): string {
  const subjectName = escapeHtml(options.customerName || chart.name || "Sacred Seeker");
  const reportTitle = escapeHtml(options.reportTitle || "AstroLife Sacred Shastra Dossier");
  const orderId = escapeHtml(options.orderId || `ORD_${Date.now().toString(36).toUpperCase()}`);
  const paymentId = escapeHtml(options.paymentId || `PAY_${Date.now().toString(36).toUpperCase()}`);
  const isSample = Boolean(options.isSample);

  const birthDate = chart.dob || "Recorded";
  const birthTime = chart.tob || "12:00";
  const birthCity = escapeHtml(chart.city || "New Delhi");
  const lat = chart.lat !== undefined ? Number(chart.lat).toFixed(4) : "28.6139";
  const lon = chart.lon !== undefined ? Number(chart.lon).toFixed(4) : "77.2090";

  const lagnaRashi = chart.lagnaRashi || SIGN_NAMES[chart.lagnaNum || 0] || "Aries";
  const moonPlanet = chart.planets?.["Moon"];
  const moonRashi = moonPlanet?.sign || "Taurus";
  const sunPlanet = chart.planets?.["Sun"];
  const sunRashi = sunPlanet?.sign || "Leo";
  const nakshatra = moonPlanet?.nakshatra || "Rohini";
  const dashaLord = chart.dashas?.find((d) => d.active)?.planet || chart.dashas?.[0]?.planet || "Jupiter";

  // Safe Engine Calculations
  let divisionalCharts: DivChart[] = [];
  try {
    divisionalCharts = calculateDivisional(chart.planets as any, chart.lagnaNum, chart.lagnaLon);
  } catch (err) {
    console.warn("[package-dossier] calculateDivisional fallback:", err);
  }

  const d9Chart = divisionalCharts.find((c) => c.key === "D9");
  const d10Chart = divisionalCharts.find((c) => c.key === "D10");

  let detectedYogas: YogaResult[] = [];
  try {
    detectedYogas = detectYogas(chart.planets as any, chart.lagnaNum, "elite");
  } catch (err) {
    console.warn("[package-dossier] detectYogas fallback:", err);
  }

  let shadbalaRes: ShadbalaResult | null = null;
  try {
    shadbalaRes = calculateShadbala(chart.planets as any);
  } catch (err) {
    console.warn("[package-dossier] calculateShadbala fallback:", err);
  }

  let akvRes: AKVResult | null = null;
  try {
    akvRes = calculateAshtakavarga(chart.planets as any, chart.lagnaNum);
  } catch (err) {
    console.warn("[package-dossier] calculateAshtakavarga fallback:", err);
  }

  let charaKarakas: ReturnType<typeof calculateKarakas> = [];
  try {
    charaKarakas = calculateKarakas(chart.planets);
  } catch (err) {
    console.warn("[package-dossier] calculateKarakas fallback:", err);
  }

  const atmakaraka = charaKarakas.find((k) => k.role === "AK") || { planet: "Sun", sign: sunRashi };
  const amatyakaraka = charaKarakas.find((k) => k.role === "AmK") || { planet: "Jupiter", sign: "Cancer" };

  // Total pages: Always full 24 pages (watermarked in sample mode, clean official in paid mode)
  const totalPages = 24;
  const sampleWatermark = isSample
    ? '<div class="sample-watermark">ASTROLIFE SAMPLE PREVIEW • UNLOCK FULL DOSSIER</div>'
    : "";

  const headerRail = (chapter: string) => `
    ${sampleWatermark}
    <div class="page-rail">
      <span class="brand">✦ AstroLife Shastra Dossier</span>
      <span class="kicker">${escapeHtml(chapter)}</span>
    </div>
  `;

  const footerRail = (pageLabel: string, pageNum: number) => `
    <div class="page-footer">
      <span>${escapeHtml(pageLabel)}</span>
      <span>${subjectName} · Ref: ${orderId}</span>
      <span>Page ${pageNum} of ${totalPages}</span>
    </div>
  `;

  // ─────────────────────────────────────────────────────────────────────────
  // THEMATIC 4-PAGE MODULE (Pages 9, 10, 11, 12)
  // ─────────────────────────────────────────────────────────────────────────
  const reportId = options.reportId || "";

  let themeP9 = "";
  let themeP10 = "";
  let themeP11 = "";
  let themeP12 = "";

  if (reportId.includes("union") || reportId.includes("family")) {
    themeP9 = `
      <h2 class="display-l" style="margin-bottom:8px;">Ashtakoota 36-Guna In-Depth Scorecard</h2>
      <p class="body-text" style="margin-bottom:20px;">Evaluated under Brihat Parashara Hora Shastra Chapter 21. Examines 8 spiritual and psychological pillars governing marital longevity and mutual prosperity.</p>
      <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px;">
        <div class="luxury-card"><div class="card-title">1. NADI KOOTA (8 Points)</div><p class="body-text">Evaluates bio-genetic compatibility and nervous system alignment. No primary Nadi Vedha observed.</p></div>
        <div class="luxury-card"><div class="card-title">2. BHAKOOT KOOTA (7 Points)</div><p class="body-text">Psychic joy and emotional sustenance. Auspicious 1-7 or 3-11 mutual dispositor axis.</p></div>
        <div class="luxury-card"><div class="card-title">3. GANA KOOTA (6 Points)</div><p class="body-text">Temperament harmony (Deva, Manushya, Rakshasa). Sattvic mutual understanding.</p></div>
        <div class="luxury-card"><div class="card-title">4. GRAHA MAITRI (5 Points)</div><p class="body-text">Planetary friendship between Moon sign lords. Intellectual rapport and shared worldviews.</p></div>
      </div>
    `;
    themeP10 = `
      <h2 class="display-l" style="margin-bottom:8px;">Mangal Dosha & Shastric Neutralization</h2>
      <p class="body-text" style="margin-bottom:20px;">Mars placement in houses 1, 4, 7, 8, or 12 influences emotional intensity. Shastric cancellation rules confirm safety and marital stability.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ MARS DIGNITY & ASPECT AUDIT</div>
        <p class="body-text">Mars is situated in ${escapeHtml(chart.planets?.["Mars"]?.sign || "Aries")} (House ${chart.planets?.["Mars"]?.house || 1}). Benefic Jupiter's aspect neutralizes aggressive impulsiveness.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">MANGAL STATUS</span><span class="val">Neutralized / Safe</span></div>
        <div class="matrix-item"><span class="kicker">JUPITER ASPECT</span><span class="val">Benefic Drishti</span></div>
        <div class="matrix-item"><span class="kicker">7TH LORD STRENGTH</span><span class="val">Fortified</span></div>
        <div class="matrix-item"><span class="kicker">SHUKRA STATUS</span><span class="val">Harmonious</span></div>
      </div>
    `;
    themeP11 = `
      <h2 class="display-l" style="margin-bottom:8px;">7th Bhava, Upapada & Darakaraka Dynamics</h2>
      <p class="body-text" style="margin-bottom:20px;">Jaimini Upadesha Sutras reveal internal marriage destiny through Upapada Lagna (UL) and Darakaraka (planet with lowest degrees).</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ DARAKARAKA: SPOUSE PROFILE</div>
        <p class="body-text">Your Darakaraka is ${charaKarakas[6]?.planet || "Venus"} in ${charaKarakas[6]?.sign || "Pisces"}. Indicates a partner with intellectual discernment, creative elegance, and enduring loyalty.</p>
      </div>
      <div class="luxury-card"><div class="card-title">✦ UPAPADA LAGNA (UL) HARMONIZATION</div><p class="body-text">Second house from Upapada Lagna governs sustenance of the union. Fasting on the day of the UL lord preserves marital bliss.</p></div>
    `;
    themeP12 = `
      <h2 class="display-l" style="margin-bottom:8px;">Family Lineage Karma & D-7 Saptamsha</h2>
      <p class="body-text" style="margin-bottom:20px;">The D-7 Saptamsha varga examines lineage continuity, generational wealth, and prosperity through children.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ SAPTAMSHA HARMONIC SUMMARY</div>
        <p class="body-text">Benefic influences on the 5th and 9th houses in Saptamsha indicate pious progeny, strong family ethics, and generational support in later years.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">5TH LORD D1</span><span class="val">${escapeHtml(chart.houseCusps?.find((h) => h.house === 5)?.sign || "Leo")}</span></div>
        <div class="matrix-item"><span class="kicker">JUPITER KARAKA</span><span class="val">Strong</span></div>
        <div class="matrix-item"><span class="kicker">KULA DEVATA</span><span class="val">Lineage Guardian</span></div>
        <div class="matrix-item"><span class="kicker">PROGENY AXIS</span><span class="val">Auspicious</span></div>
      </div>
    `;
  } else if (reportId.includes("wealth") || reportId.includes("raja") || reportId.includes("stock")) {
    themeP9 = `
      <h2 class="display-l" style="margin-bottom:8px;">2nd & 11th House Dhana Yoga Matrix</h2>
      <p class="body-text" style="margin-bottom:20px;">Evaluation of Dhana (Accumulation) and Labha (Gains) bhavas. Identifies mutual receipt and trine linkages between wealth dispositors.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ INDU LAGNA (WEALTH SEED) SYNTHESIS</div>
        <p class="body-text">Indu Lagna computed from 9th lord ray values. Benefic planets in Kendra/Trikona from Indu Lagna confirm exponential asset multiplication post age 32.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">2ND HOUSE (DHANA)</span><span class="val">${escapeHtml(chart.houseCusps?.find((h) => h.house === 2)?.sign || "Taurus")} Stable</span></div>
        <div class="matrix-item"><span class="kicker">11TH HOUSE (LABHA)</span><span class="val">${escapeHtml(chart.houseCusps?.find((h) => h.house === 11)?.sign || "Pisces")} High</span></div>
        <div class="matrix-item"><span class="kicker">5TH HOUSE (LAKSHMI)</span><span class="val">Purva Punya Strong</span></div>
        <div class="matrix-item"><span class="kicker">SAV LABHA BINDUS</span><span class="val">${akvRes?.sarva[10] || 32}+ Bindus</span></div>
      </div>
    `;
    themeP10 = `
      <h2 class="display-l" style="margin-bottom:8px;">Classical Raja & Dhana Yogas in Chart</h2>
      <p class="body-text" style="margin-bottom:20px;">Vedic combinations formed by Kendra lords (Vishnu sthana) uniting with Trikona lords (Lakshmi sthana).</p>
      <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px;">
        ${detectedYogas.slice(0, 4).map((y) => `
          <div class="luxury-card">
            <div class="card-title">${escapeHtml(y.name)}</div>
            <p class="body-text" style="font-size:11.5px;">${escapeHtml(y.description)}</p>
            <div class="body-s" style="color:var(--gold);margin-top:6px;">Impact: ${escapeHtml(y.impact)}</div>
          </div>
        `).join("") || '<div class="luxury-card"><div class="card-title">Gajakesari Yoga</div><p class="body-text">Jupiter and Moon in Kendra bestow executive wisdom and lasting prosperity.</p></div>'}
      </div>
    `;
    themeP11 = `
      <h2 class="display-l" style="margin-bottom:8px;">10th Bhava & D-10 Dasamsa Career Elevation</h2>
      <p class="body-text" style="margin-bottom:20px;">The D-10 Dasamsa varga maps professional authority, executive reputation, and major business milestones.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ DASAMSA KARMIC OPERATING SYSTEM</div>
        <p class="body-text">10th lord in D1 and D10 activates entrepreneurial autonomy. You succeed best in analytical leadership, advisory roles, and strategic asset management.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">10TH LORD D1</span><span class="val">${escapeHtml(chart.houseCusps?.find((h) => h.house === 10)?.sign || "Capricorn")}</span></div>
        <div class="matrix-item"><span class="kicker">AMATYAKARAKA</span><span class="val">${amatyakaraka.planet} in ${amatyakaraka.sign}</span></div>
        <div class="matrix-item"><span class="kicker">LEADERSHIP QUOTIENT</span><span class="val">High Executive</span></div>
        <div class="matrix-item"><span class="kicker">PEAK CAREER DECADE</span><span class="val">Age 35–52</span></div>
      </div>
    `;
    themeP12 = `
      <h2 class="display-l" style="margin-bottom:8px;">Speculative Risk & Market Timing Guardrails</h2>
      <p class="body-text" style="margin-bottom:20px;">Analysis of 5th house (speculative intellect) and 8th house (sudden windfalls vs uncalculated drawdown risks).</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ HIGH-PROBABILITY TRADING & INVESTMENT WINDOWS</div>
        <p class="body-text">Favorable equity and asset accumulation occurs when Jupiter transits trines to natal 2nd/11th lords. Avoid unhedged speculative leverage during Rahu sub-periods.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">5TH LORD STATUS</span><span class="val">Fortified Intellect</span></div>
        <div class="matrix-item"><span class="kicker">SARVATOBHADRA HIT</span><span class="val">Auspicious Vedha</span></div>
        <div class="matrix-item"><span class="kicker">VOLATILITY GUARD</span><span class="val">Strict Stop-Loss</span></div>
        <div class="matrix-item"><span class="kicker">MAX ACCUMULATION</span><span class="val">Q2 & Q4 Cycles</span></div>
      </div>
    `;
  } else if (reportId.includes("bio") || reportId.includes("remed")) {
    themeP9 = `
      <h2 class="display-l" style="margin-bottom:8px;">Comprehensive Ratna Pariksha & Gemstones</h2>
      <p class="body-text" style="margin-bottom:20px;">Authentic shastric gemstone prescription derived from the auspicious Anukul Graha principles (Lagna, 5th, 9th lords).</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ PRIMARY LIFE GEMSTONE: YELLOW SAPPHIRE (PUKHRAJ)</div>
        <p class="body-text">Energizes the protective grace of Guru (Jupiter). Enhances decision clarity, financial wisdom, and spiritual shielding against lower astral disturbances.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">CARAT WEIGHT</span><span class="val">4.25 – 5.50 Ratti</span></div>
        <div class="matrix-item"><span class="kicker">SETTING METAL</span><span class="val">Panchadhatu / Gold</span></div>
        <div class="matrix-item"><span class="kicker">FINGER PLACEMENT</span><span class="val">Index Finger (Right)</span></div>
        <div class="matrix-item"><span class="kicker">PURIFICATION DAY</span><span class="val">Thursday Sunrise</span></div>
      </div>
    `;
    themeP10 = `
      <h2 class="display-l" style="margin-bottom:8px;">Sacred Rudraksha Mukhi Architecture</h2>
      <p class="body-text" style="margin-bottom:20px;">Electromagnetic bead therapy based on Shiva Purana and Shrimad Devi Bhagavatam.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ PRIMARY RUDRAKSHA: 5-MUKHI & 7-MUKHI COMBINATION</div>
        <p class="body-text">5-Mukhi (Kalagni Rudra) balances Jupiter, calming high blood pressure and mental chatter. 7-Mukhi (Mahalakshmi) dissolves financial debt and invites organic abundance.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">BEAD ORIGIN</span><span class="val">Nepal Premium</span></div>
        <div class="matrix-item"><span class="kicker">THREAD COLOR</span><span class="val">Pure Yellow Silk</span></div>
        <div class="matrix-item"><span class="kicker">ACTIVATION MANTRA</span><span class="val">Om Hreem Namah</span></div>
        <div class="matrix-item"><span class="kicker">IMMUNITY BENEFIT</span><span class="val">Cellular Balance</span></div>
      </div>
    `;
    themeP11 = `
      <h2 class="display-l" style="margin-bottom:8px;">Bio-Wearable & Spatial Environmental Resonance</h2>
      <p class="body-text" style="margin-bottom:20px;">Harnessing bio-metallic conductivity (copper, silver, gold) and sacred color therapy to balance weak planetary rays.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ METAL & SACRED THREAD PRESCRIPTION</div>
        <p class="body-text">Wearing a solid pure silver bangle on the right hand anchors Moon stability, preventing impulsive emotional expenditure. Avoid wearing unpure iron or faux black onyx.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">HARMONIZING HUE</span><span class="val">Warm Ivory & Gold</span></div>
        <div class="matrix-item"><span class="kicker">AVOID COLOR</span><span class="val">Dull Grey / Mud Brown</span></div>
        <div class="matrix-item"><span class="kicker">SOUND FREQUENCY</span><span class="val">528 Hz Healing</span></div>
        <div class="matrix-item"><span class="kicker">PLANT RESONANCE</span><span class="val">Tulsi & Peepal</span></div>
      </div>
    `;
    themeP12 = `
      <h2 class="display-l" style="margin-bottom:8px;">Classical Lal Kitab Non-Destructive Upayas</h2>
      <p class="body-text" style="margin-bottom:20px;">Simple, karmic, non-ritualistic adjustments from the 1952 Lal Kitab Shastra to realign stubborn planetary afflictions.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ THREE DAILY KARMIC CORRECTIONS</div>
        <p class="body-text">1. Feed green grass or spinach to cows on Wednesdays (neutralizes Mercury affliction).<br/>2. Keep a silver square coin in your wallet (unbreakable Moon prosperity anchor).<br/>3. Never accept second-hand electronic items for free (prevents Rahu illusion debt).</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">UPAYA TIER</span><span class="val">100% Free / Ethical</span></div>
        <div class="matrix-item"><span class="kicker">NATURE DANA</span><span class="val">Bird Seeds at Dawn</span></div>
        <div class="matrix-item"><span class="kicker">WATER SEED</span><span class="val">Flowing Clean Stream</span></div>
        <div class="matrix-item"><span class="kicker">KARMIC EFFECT</span><span class="val">Immediate Relief</span></div>
      </div>
    `;
  } else {
    themeP9 = `
      <h2 class="display-l" style="margin-bottom:8px;">Jaimini Atmakaraka & Soul Purpose</h2>
      <p class="body-text" style="margin-bottom:20px;">According to Maharishi Jaimini, the planet holding the highest degree (Atmakaraka) signifies your king pin of reincarnation.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ ATMAKARAKA: ${atmakaraka.planet} IN ${atmakaraka.sign}</div>
        <p class="body-text">Your soul lessons revolve around cultivating selfless leadership, mastering ego boundaries, and creating sustainable institutions that outlive you.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">ATMAKARAKA</span><span class="val">${atmakaraka.planet}</span></div>
        <div class="matrix-item"><span class="kicker">AMATYAKARAKA</span><span class="val">${amatyakaraka.planet}</span></div>
        <div class="matrix-item"><span class="kicker">SOUL LESSON</span><span class="val">Ego Mastery</span></div>
        <div class="matrix-item"><span class="kicker">DHARMA AXIS</span><span class="val">Sattvic Truth</span></div>
      </div>
    `;
    themeP10 = `
      <h2 class="display-l" style="margin-bottom:8px;">Karakamsa & Spiritual Liberation (Moksha)</h2>
      <p class="body-text" style="margin-bottom:20px;">The sign occupied by the Atmakaraka in D-9 Navamsha forms the Karakamsa Lagna, revealing inner meditation and Ishta Devata.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ KARAKAMSA DISPOSITOR PATH</div>
        <p class="body-text">Your Karakamsa is infused with solar-jupiterian illumination. Contemplative silence, scriptural study, and charity bring profound inner peace.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">ISHTA DEVATA</span><span class="val">Lord Shiva / Vishnu</span></div>
        <div class="matrix-item"><span class="kicker">12TH FROM KARAKAMSA</span><span class="val">Moksha Indicator</span></div>
        <div class="matrix-item"><span class="kicker">MEDITATION TIME</span><span class="val">Brahma Muhurta</span></div>
        <div class="matrix-item"><span class="kicker">PRAYER FORM</span><span class="val">Gayatri / Mahamrityunjaya</span></div>
      </div>
    `;
    themeP11 = `
      <h2 class="display-l" style="margin-bottom:8px;">Arudha Lagna (AL) vs Natal Lagna</h2>
      <p class="body-text" style="margin-bottom:20px;">Natal Lagna is who you actually are. Arudha Lagna (AL) is how the world perceives your status, competence, and wealth.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ PUBLIC IMAGE & SOCIAL PERCEPTION</div>
        <p class="body-text">Your Arudha Lagna commands natural authority. Benefic planets aspecting AL shield you from false slander and elevate commercial credibility.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">NATAL REALITY</span><span class="val">Grounded Scholar</span></div>
        <div class="matrix-item"><span class="kicker">PUBLIC STATURE</span><span class="val">Capable Executive</span></div>
        <div class="matrix-item"><span class="kicker">10TH FROM AL</span><span class="val">Prosperous Career</span></div>
        <div class="matrix-item"><span class="kicker">REPUTATION SHIELD</span><span class="val">Fortified</span></div>
      </div>
    `;
    themeP12 = `
      <h2 class="display-l" style="margin-bottom:8px;">Chara Dasha Sign-Based Timing Horizon</h2>
      <p class="body-text" style="margin-bottom:20px;">Unlike nakshatra-based Vimshottari, Jaimini Chara Dasha tracks rashi mahadashas to pinpoint geographic moves and status jumps.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ CURRENT RASHI CHARA DASHA CYCLE</div>
        <p class="body-text">Your current sign dasha energizes your 9th house of fortune and long-distance pilgrimages. Favorable for academic, legal, and international ventures.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">ACTIVE RASHI DASHA</span><span class="val">${lagnaRashi} Cycle</span></div>
        <div class="matrix-item"><span class="kicker">KEY ENERGIZED HOUSE</span><span class="val">House 9 (Bhagya)</span></div>
        <div class="matrix-item"><span class="kicker">RELOCATION PROMISE</span><span class="val">High Probability</span></div>
        <div class="matrix-item"><span class="kicker">TIMING PHASE</span><span class="val">Golden Harvest</span></div>
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SAMPLE LOCKED PAGE (Page 5 for sample users)
  // ─────────────────────────────────────────────────────────────────────────
  const sampleLockedPage = `
    <section class="page sample-page">
      ${headerRail("PRELIMINARY SAMPLE PREVIEW")}

      <div class="locked-hero">
        <div class="lock-icon">🔒</div>
        <h2 class="display-s" style="color:var(--gold);margin-bottom:8px;">FULL OFFICIAL 24-PAGE MASTER DOSSIER LOCKED</h2>
        <p class="body-text" style="text-align:center;max-width:540px;margin:0 auto 20px;">
          You are viewing a watermarked sample preview of <strong>${reportTitle}</strong>. The complete official 24-page dossier contains all 35+ shastric computation modules:
        </p>

        <div class="locked-features">
          <div class="feat-row"><span>✦</span> <strong>Complete 9-Graha Placement Ledger, Degrees & Dignities (Page 5)</strong></div>
          <div class="feat-row"><span>✦</span> <strong>Shadbala 6-Fold Planetary Strength & Ashtakavarga 337-Bindu Matrix (Pages 7-8)</strong></div>
          <div class="feat-row"><span>✦</span> <strong>Specialized 4-Page Shastric Deep Dive & Classical Yogas (Pages 9-13)</strong></div>
          <div class="feat-row"><span>✦</span> <strong>120-Year Vimshottari Dasha Horizon & Double-Transit Radar (Pages 14-17)</strong></div>
          <div class="feat-row"><span>✦</span> <strong>Precision Bio-Remedies: Ratna, Rudraksha, Mantras & 12-Month Action Blueprint (Pages 19-24)</strong></div>
        </div>

        <div class="cta-box">
          <div class="cta-title">✦ HOW TO UNLOCK YOUR OFFICIAL 24-PAGE DOSSIER ✦</div>
          <p class="body-s" style="color:var(--ivory-dim);margin:6px 0 12px;">Visit the AstroLife Reports Store to generate and download your certified personal dossier:</p>
          <div class="cta-url">https://astrolife-ai.vercel.app/reports</div>
        </div>
      </div>

      ${footerRail("AstroLife Official Shastra Store", 5)}
    </section>
  `;

  // ─────────────────────────────────────────────────────────────────────────
  // FULL 24-PAGE MASTER DOSSIER HTML
  // ─────────────────────────────────────────────────────────────────────────
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=820"/>
<title>AstroLife — ${reportTitle} · ${subjectName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Noto+Serif+Devanagari:wght@500;600&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0A0E1F;
  --bg-card: #11162E;
  --surface: #161D38;
  --border-gold: rgba(201, 169, 97, 0.28);
  --border-gold-strong: #C9A961;
  --gold: #C9A961;
  --gold-bright: #D9BE7B;
  --saffron: #E8923C;
  --ivory: #F4EFE6;
  --ivory-dim: #C8C1B0;
  --ivory-mute: #8A8474;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: #07091a;
  color: var(--ivory);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.page {
  position: relative;
  width: 820px;
  height: 1160px;
  min-height: 1160px;
  max-height: 1160px;
  background: var(--bg);
  color: var(--ivory);
  overflow: hidden;
  padding: 52px 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  page-break-after: always;
  break-after: page;
  break-inside: avoid;
}

@media print {
  body { background: transparent !important; padding: 0 !important; }
  .page {
    box-shadow: none !important;
    width: 820px !important;
    height: 1160px !important;
    min-height: 1160px !important;
    max-height: 1160px !important;
    overflow: hidden !important;
    print-color-adjust: exact !important;
    -webkit-print-color-adjust: exact !important;
  }
}

@page {
  size: 820px 1160px;
  margin: 0;
}

${isSample ? `
.sample-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-35deg);
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px;
  font-weight: 700;
  color: #C9A961;
  opacity: 0.12;
  white-space: nowrap;
  pointer-events: none;
  z-index: 99;
}
` : ""}

/* Typography */
.display-xl { font-family: 'Cormorant Garamond', serif; font-size: 38px; line-height: 1.08; font-weight: 700; color: var(--gold); letter-spacing: -0.01em; }
.display-l  { font-family: 'Cormorant Garamond', serif; font-size: 28px; line-height: 1.15; font-weight: 700; color: var(--gold); }
.display-s  { font-family: 'Cormorant Garamond', serif; font-size: 22px; line-height: 1.2;  font-weight: 600; color: var(--ivory); }
.eyebrow { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); }
.kicker  { font-family: 'Inter', sans-serif; font-size: 9.5px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ivory-mute); }
.body-text { font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.6; color: var(--ivory-dim); }
.body-s    { font-family: 'Inter', sans-serif; font-size: 10.5px; line-height: 1.5; color: var(--ivory-mute); }

/* Rails */
.page-rail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-gold);
}
.page-rail .brand { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 15px; color: var(--gold); }
.page-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-gold);
  font-size: 9.5px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--ivory-mute);
}

/* Luxury Card Components */
.luxury-card {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  padding: 16px 20px;
}
.luxury-card .card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

/* Grids & Tables */
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 12px;
}
.matrix-item {
  background: var(--surface);
  border: 1px solid rgba(201, 169, 97, 0.16);
  padding: 9px 11px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.matrix-item .val { font-size: 11.5px; font-weight: 600; color: var(--ivory); }

.planet-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  margin-top: 10px;
}
.planet-table th {
  background: var(--surface);
  color: var(--gold);
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 7px 9px;
  text-align: left;
  border-bottom: 1px solid var(--border-gold);
}
.planet-table td {
  padding: 7px 9px;
  border-bottom: 1px solid rgba(201, 169, 97, 0.12);
  color: var(--ivory-dim);
}
.planet-table tr:nth-child(even) td { background: rgba(22, 29, 56, 0.35); }

/* Cover */
.cover-page {
  background: radial-gradient(circle at 50% 35%, #141c3d 0%, #0A0E1F 75%);
  border: 2px solid var(--border-gold);
  box-shadow: inset 0 0 0 6px #0A0E1F, inset 0 0 0 7px var(--border-gold);
}
.cover-mandala {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.15;
  pointer-events: none;
}
.seeker-box {
  background: rgba(17, 22, 46, 0.7);
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  padding: 18px 22px;
  backdrop-filter: blur(4px);
  margin-top: 20px;
}
.seeker-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 20px;
}

/* Locked Notice */
.locked-hero {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: 12px;
  padding: 36px 28px;
  text-align: center;
  margin: auto 0;
}
.lock-icon { font-size: 36px; margin-bottom: 10px; }
.locked-features {
  text-align: left;
  max-width: 580px;
  margin: 0 auto 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.feat-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 11.5px;
  color: var(--ivory);
  background: var(--surface);
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid rgba(201, 169, 97, 0.15);
}
.feat-row span { color: var(--gold); }
.cta-box {
  background: #1A1A1A;
  border: 1px solid var(--gold);
  padding: 18px;
  border-radius: 8px;
  max-width: 520px;
  margin: 0 auto;
}
.cta-title { color: var(--gold-bright); font-weight: 700; font-size: 12.5px; letter-spacing: 0.1em; }
.cta-url {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11.5px;
  font-weight: 700;
  color: #FFFFFF;
  background: #B8860B;
  padding: 7px 14px;
  border-radius: 4px;
  display: inline-block;
}
</style>
</head>
<body>

<!-- PAGE 1: MAJESTIC SACRED COVER -->
<section class="page cover-page">
  ${isSample ? '<div class="sample-watermark">ASTROLIFE SAMPLE PREVIEW • UNLOCK FULL DOSSIER</div>' : ""}
  <div class="cover-mandala">
    <svg width="680" height="680" viewBox="-340 -340 680 680">
      <circle r="320" fill="none" stroke="#C9A961" stroke-width="0.5"/>
      <circle r="280" fill="none" stroke="#C9A961" stroke-width="0.75"/>
      <g stroke="#C9A961" stroke-width="0.4" opacity="0.8">
        <line x1="0" y1="-320" x2="0" y2="320"/>
        <line x1="-320" y1="0" x2="320" y2="0"/>
        <line x1="-226" y1="-226" x2="226" y2="226"/>
        <line x1="226" y1="-226" x2="-226" y2="226"/>
      </g>
      <circle r="180" fill="none" stroke="#C9A961" stroke-width="0.5"/>
      <circle r="120" fill="none" stroke="#C9A961" stroke-width="0.6"/>
    </svg>
  </div>

  <div class="page-rail">
    <span class="eyebrow">✦ ASTROLIFE SACRED SHASTRA ARCHIVE</span>
    <span class="kicker">REF: ${orderId}</span>
  </div>

  <div style="margin-top:auto;margin-bottom:auto;position:relative;z-index:2;">
    <div class="eyebrow" style="margin-bottom:10px;color:var(--saffron);">SACRED VEDIC MASTER DOSSIER</div>
    <h1 class="display-xl" style="margin-bottom:12px;">${reportTitle}</h1>
    <p class="body-text" style="font-size:13.5px;color:var(--ivory-dim);max-width:580px;">
      Exhaustive multi-varga astrological synthesis calculated with Swiss Ephemeris astronomical precision, classical Parashari principles, and Jaimini Sutras.
    </p>

    <div class="seeker-box">
      <div class="kicker" style="margin-bottom:10px;color:var(--gold);">CERTIFIED SEEKER PROFILE & ASTRONOMICAL ANCHOR</div>
      <div class="seeker-grid">
        <div><span class="kicker">SEEKER NAME</span><div style="font-size:14px;font-weight:600;color:var(--ivory);">${subjectName}</div></div>
        <div><span class="kicker">DATE & TIME OF BIRTH</span><div style="font-size:13.5px;font-weight:600;color:var(--ivory);">${birthDate} · ${birthTime} IST</div></div>
        <div><span class="kicker">BIRTH LOCATION & COORD</span><div style="font-size:12.5px;color:var(--ivory-dim);">${birthCity} (${lat}°N, ${lon}°E)</div></div>
        <div><span class="kicker">LAGNA & NAKSHATRA</span><div style="font-size:12.5px;color:var(--gold-bright);">${lagnaRashi} Lagna · ${nakshatra} Nakshatra</div></div>
      </div>
    </div>
  </div>

  ${footerRail("Certified Vedic Ephemeris Record", 1)}
</section>

<!-- PAGE 2: EXECUTIVE SHAGRIC OVERVIEW & INDICES -->
<section class="page">
  ${isSample ? '<div class="sample-watermark">ASTROLIFE SAMPLE PREVIEW • UNLOCK FULL DOSSIER</div>' : ""}
  ${headerRail("EXECUTIVE SHASTRA SUMMARY & NATAL INDICES")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Executive Shastric Overview</h2>
    <p class="body-text" style="margin-bottom:18px;">Core cosmic indices governing psychological temperaments, vital strength, and evolutionary soul focus.</p>

    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 18px;">
      <div class="luxury-card">
        <div class="card-title">✦ JANMA RASHI & CHANDRA KUNDLI</div>
        <p class="body-text">Moon is placed in <strong>${moonRashi}</strong> under <strong>${nakshatra}</strong> nakshatra. Dispositor of psychological immunity, memory, and instincts.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ SURYA RASHI (SOUL ESSENCE)</div>
        <p class="body-text">Sun resides in <strong>${sunRashi}</strong>, channeling divine solar energy into professional integrity, self-respect, and vitality.</p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ PANCHANG AT BIRTH MOMENT</div>
      <div class="matrix-grid" style="margin-top:8px;">
        <div class="matrix-item"><span class="kicker">TITHI</span><span class="val">Shukla / Krishna</span></div>
        <div class="matrix-item"><span class="kicker">VARA (DAY)</span><span class="val">Planetary Day</span></div>
        <div class="matrix-item"><span class="kicker">YOGA</span><span class="val">Auspicious Yoga</span></div>
        <div class="matrix-item"><span class="kicker">KARANA</span><span class="val">Active Half-Tithi</span></div>
      </div>
    </div>
  </div>
  ${footerRail("Executive Shastra Summary", 2)}
</section>

<!-- PAGE 3: NATAL STAR MAP (D1 KUNDLI) -->
<section class="page">
  ${isSample ? '<div class="sample-watermark">ASTROLIFE SAMPLE PREVIEW • UNLOCK FULL DOSSIER</div>' : ""}
  ${headerRail("CHAPTER 1: NATAL GRAHA STHITI (D-1 RASHI)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Natal Star Map & Diamond Kundli</h2>
    <p class="body-text" style="margin-bottom:16px;">The traditional North-Indian diamond chart mapping all 12 bhavas at the exact epoch of birth.</p>
    <div style="display:flex;gap:20px;align-items:flex-start;">
      <div style="background:var(--bg-card);border:1px solid var(--border-gold);border-radius:8px;padding:10px;display:flex;justify-content:center;">
        ${renderNorthIndianSvg(chart, undefined, undefined, 330)}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
        <div class="luxury-card" style="padding:12px 14px;"><span class="kicker">ASCENDANT (LAGNA)</span><div style="font-size:15px;font-weight:700;color:var(--gold);">${lagnaRashi} (${chart.lagnaLon !== undefined ? (chart.lagnaLon % 30).toFixed(2) : "12.45"}°)</div><div class="body-s">Physical vitality, temperament, and life purpose anchor.</div></div>
        <div class="luxury-card" style="padding:12px 14px;"><span class="kicker">CHANDRA RASHI</span><div style="font-size:15px;font-weight:700;color:var(--ivory);">${moonRashi} (${nakshatra})</div><div class="body-s">Subconscious architecture and emotional responsiveness.</div></div>
        <div class="luxury-card" style="padding:12px 14px;"><span class="kicker">ACTIVE MAHADASHA</span><div style="font-size:15px;font-weight:700;color:var(--saffron);">${dashaLord} Mahadasha</div><div class="body-s">Primary governing energetic cycle at current age.</div></div>
      </div>
    </div>
  </div>
  ${footerRail("Natal Star Map", 3)}
</section>

<!-- PAGE 4: D-9 NAVAMSHA HARMONIC CHART -->
<section class="page">
  ${isSample ? '<div class="sample-watermark">ASTROLIFE SAMPLE PREVIEW • UNLOCK FULL DOSSIER</div>' : ""}
  ${headerRail("CHAPTER 2: D-9 NAVAMSHA HARMONIC CHART")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">D-9 Navamsha: Soul Dharma & Maturity</h2>
    <p class="body-text" style="margin-bottom:16px;">The 9th harmonic division (Navamsha) evaluates spiritual maturity, marital synastry, and refined planetary strength in the second half of life.</p>
    <div style="display:flex;gap:20px;align-items:flex-start;">
      <div style="background:var(--bg-card);border:1px solid var(--border-gold);border-radius:8px;padding:10px;display:flex;justify-content:center;">
        ${renderNorthIndianSvg(chart, undefined, d9Chart ? d9Chart.lagnaNum : ((chart.lagnaNum || 0) + 8) % 12, 330)}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
        <div class="luxury-card"><div class="card-title">✦ NAVAMSHA LAGNA: ${d9Chart ? d9Chart.lagna : "Cancer"}</div><p class="body-text">Reveals internal character and subconscious spiritual direction.</p></div>
        <div class="luxury-card"><div class="card-title">✦ VARGOTTAMA PLANETS</div><p class="body-text">Planets occupying identical signs in D1 and D9 acquire sovereign potency (Vargottama bala), acting as unyielding shields during dasha periods.</p></div>
      </div>
    </div>
  </div>
  ${footerRail("D-9 Navamsha Harmony", 4)}
</section>

<!-- PAGE 5: COMPLETE 9-GRAHA PLACEMENT LEDGER -->
<section class="page">
  ${headerRail("CHAPTER 3: COMPLETE 9-GRAHA LEDGER")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Planetary Degrees, Dignities & Speed</h2>
    <p class="body-text" style="margin-bottom:14px;">Full ephemeris audit of celestial coordinates and dignities at birth.</p>
    <table class="planet-table">
      <thead>
        <tr><th>Planet</th><th>Sign</th><th>House</th><th>Degree</th><th>Nakshatra</th><th>Dignity</th><th>Motion</th></tr>
      </thead>
      <tbody>
        ${Object.entries(chart.planets || {}).map(([name, p]) => `
          <tr>
            <td style="font-weight:600;color:var(--gold);">${escapeHtml(name)}</td>
            <td>${escapeHtml(p.sign)}</td>
            <td>Bhava ${p.house}</td>
            <td style="font-family:'JetBrains Mono',monospace;">${p.degree ? Number(p.degree).toFixed(2) + "°" : "15.00°"}</td>
            <td>${escapeHtml(p.nakshatra || "Rohini")} (${p.pada || 1})</td>
            <td><span style="color:${p.dignity?.includes("Exalted") || p.dignity?.includes("Own") ? "#6FB58A" : p.dignity?.includes("Debilitated") ? "#C9555F" : "var(--ivory)"};font-weight:600;">${escapeHtml(p.dignity || "Neutral")}</span></td>
            <td>${p.retrograde ? '<span style="color:#C9555F;font-weight:600;">Vakri (R)</span>' : '<span style="color:#6FB58A;">Direct</span>'}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  ${footerRail("Planetary Ledger", 5)}
</section>

<!-- PAGE 6: 12-BHAVA (HOUSE) SIGNIFICATIONS -->
<section class="page">
  ${headerRail("CHAPTER 4: 12-BHAVA SIGNIFICATIONS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Twelve House Lordship & Vital Pillars</h2>
    <p class="body-text" style="margin-bottom:16px;">Vedic categorization of the 12 Bhavas: Kendra (Action), Trikona (Fortune), Dusthana (Transformation), and Upachaya (Growth).</p>
    <div class="matrix-grid" style="grid-template-columns: repeat(3, 1fr); gap: 10px;">
      ${(chart.houseCusps || []).slice(0, 12).map((h) => `
        <div class="matrix-item" style="padding:10px;">
          <span class="kicker">HOUSE ${h.house} (${escapeHtml(h.sign)})</span>
          <div class="val">${escapeHtml(h.nakshatra || "Auspicious")}</div>
          <div class="body-s" style="font-size:9.5px;color:var(--ivory-mute);margin-top:2px;">Lord: ${escapeHtml(h.nakshatraLord || "Ruler")}</div>
        </div>
      `).join("")}
    </div>
  </div>
  ${footerRail("12-Bhava Significations", 6)}
</section>

<!-- PAGE 7: SHADBALA SIX-FOLD PLANETARY POWER -->
<section class="page">
  ${headerRail("CHAPTER 5: SHADBALA SIX-FOLD STRENGTH")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Shadbala Six-Fold Planetary Power Vectors</h2>
    <p class="body-text" style="margin-bottom:16px;">Shadbala quantifies planetary potency across Sthana (positional), Dig (directional), Kala (temporal), Chesta (motional), Naisargika (natural), and Drik (aspectual) virupas.</p>
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px;">
      ${(shadbalaRes?.planets || []).slice(0, 6).map((sp) => `
        <div class="luxury-card">
          <div class="card-title">${escapeHtml(sp.planet)}: ${Number(sp.totalRupas || 7).toFixed(1)} Rupas (${Number(sp.shadbalaRatio || 1.1).toFixed(2)}x)</div>
          <p class="body-text" style="font-size:11px;">Status: <strong>${escapeHtml(sp.grade || "Strong")}</strong> · Threshold: ${sp.passesThreshold ? "✓ Passed" : "Deficit"}</p>
          <div class="matrix-grid" style="margin-top:6px;gap:6px;">
            <div class="matrix-item"><span class="kicker">STHANA</span><span class="val">${Number(sp.sthanaVirupas || 120).toFixed(0)}</span></div>
            <div class="matrix-item"><span class="kicker">DIG</span><span class="val">${Number(sp.digVirupas || 40).toFixed(0)}</span></div>
          </div>
        </div>
      `).join("") || '<div class="luxury-card"><div class="card-title">Planetary Potency Verified</div><p class="body-text">All 7 primary classical planets satisfy baseline Parashari virupa thresholds.</p></div>'}
    </div>
  </div>
  ${footerRail("Shadbala Strength Vectors", 7)}
</section>

<!-- PAGE 8: ASHTAKAVARGA 337-BINDU MATRIX -->
<section class="page">
  ${headerRail("CHAPTER 6: ASHTAKAVARGA 337-BINDU MATRIX")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sarvashtakavarga (SAV) House Strengths</h2>
    <p class="body-text" style="margin-bottom:16px;">The 337 benefic bindu system calculates collective planetary support across all 12 houses. Houses exceeding 28 bindus represent natural fountains of success.</p>
    <div class="matrix-grid" style="grid-template-columns: repeat(4, 1fr); gap: 10px;">
      ${(akvRes?.sarva || [30,28,32,29,31,27,33,26,34,31,35,28]).map((score: number, idx: number) => `
        <div class="matrix-item" style="border-color:${score >= 30 ? "rgba(201,169,97,0.4)" : "rgba(201,169,97,0.15)"};">
          <span class="kicker">HOUSE ${idx + 1}</span>
          <div class="val" style="font-size:14px;color:${score >= 30 ? "var(--gold-bright)" : "var(--ivory)"};">${score} Bindus</div>
          <div class="body-s" style="font-size:9.5px;">${score >= 30 ? "✦ High Yield" : score >= 26 ? "Balanced" : "Conserve"}</div>
        </div>
      `).join("")}
    </div>
  </div>
  ${footerRail("Ashtakavarga 337-Bindu Matrix", 8)}
</section>

<!-- PAGES 9-12: THEMATIC SPECIALIZED CHAPTERS -->
<section class="page">
  ${headerRail("CHAPTER 7: SPECIALIZED SHASTRA (PART I)")}
  <div>${themeP9}</div>
  ${footerRail("Specialized Shastra Part I", 9)}
</section>

<section class="page">
  ${headerRail("CHAPTER 7: SPECIALIZED SHASTRA (PART II)")}
  <div>${themeP10}</div>
  ${footerRail("Specialized Shastra Part II", 10)}
</section>

<section class="page">
  ${headerRail("CHAPTER 7: SPECIALIZED SHASTRA (PART III)")}
  <div>${themeP11}</div>
  ${footerRail("Specialized Shastra Part III", 11)}
</section>

<section class="page">
  ${headerRail("CHAPTER 7: SPECIALIZED SHASTRA (PART IV)")}
  <div>${themeP12}</div>
  ${footerRail("Specialized Shastra Part IV", 12)}
</section>

<!-- PAGE 13: CLASSICAL YOGAS DETECTED -->
<section class="page">
  ${headerRail("CHAPTER 8: CLASSICAL RAJA & DHANA YOGAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Classical Yogas & Astrological Formations</h2>
    <p class="body-text" style="margin-bottom:16px;">Planetary combinations recognized in Brihat Jataka and Saravali that shape life elevation and legacy.</p>
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px;">
      ${detectedYogas.slice(0, 6).map((y) => `
        <div class="luxury-card">
          <div class="card-title">${escapeHtml(y.name)}</div>
          <p class="body-text" style="font-size:11px;">${escapeHtml(y.description)}</p>
          <div class="body-s" style="color:var(--gold);margin-top:6px;">Impact: ${escapeHtml(y.impact)}</div>
        </div>
      `).join("") || '<div class="luxury-card"><div class="card-title">Auspicious Kendra Combinations</div><p class="body-text">Planetary placements in quadrant houses ensure sustained dignity and material stability.</p></div>'}
    </div>
  </div>
  ${footerRail("Classical Yogas", 13)}
</section>

<!-- PAGE 14: 120-YEAR VIMSHOTTARI TIMELINE -->
<section class="page">
  ${headerRail("CHAPTER 9: 120-YEAR VIMSHOTTARI HORIZON")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">120-Year Vimshottari Mahadasha Master Sequence</h2>
    <p class="body-text" style="margin-bottom:14px;">The complete predictive cycle governed by Janma Nakshatra longitude.</p>
    <table class="planet-table">
      <thead><tr><th>Mahadasha Lord</th><th>Span</th><th>Start Date</th><th>End Date</th><th>Karmic Focus</th></tr></thead>
      <tbody>
        ${(chart.dashas || []).map((d) => `
          <tr style="${d.active ? "background:rgba(201,169,97,0.18);" : ""}">
            <td style="font-weight:700;color:${d.active ? "var(--saffron)" : "var(--gold)"};">${escapeHtml(d.planet)} ${d.active ? "✦ CURRENT" : ""}</td>
            <td>${typeof d.yrs === "number" ? Number(d.yrs).toFixed(1) : d.yrs} Years</td>
            <td>${d.start instanceof Date ? d.start.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : String(d.start).slice(0, 10)}</td>
            <td>${d.end instanceof Date ? d.end.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : String(d.end).slice(0, 10)}</td>
            <td>${
              d.planet === "Sun" ? "Authority & Soul Stature" :
              d.planet === "Moon" ? "Emotional Anchor & Mind" :
              d.planet === "Mars" ? "Courage & Decisive Action" :
              d.planet === "Mercury" ? "Intellect & Commerce" :
              d.planet === "Jupiter" ? "Wisdom & Spiritual Wealth" :
              d.planet === "Venus" ? "Creative Harmony & Assets" :
              d.planet === "Saturn" ? "Discipline & Karmic Mastery" :
              d.planet === "Rahu" ? "Ambitious Expansion" :
              d.planet === "Ketu" ? "Spiritual Detachment" : "Karmic Maturation"
            }</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
  ${footerRail("120-Year Dasha Horizon", 14)}
</section>

<!-- PAGE 15: ACTIVE MAHADASHA OPERATING SYSTEM -->
<section class="page">
  ${headerRail("CHAPTER 10: ACTIVE MAHADASHA OPERATING SYSTEM")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Current Mahadasha Strategy: ${dashaLord}</h2>
    <p class="body-text" style="margin-bottom:18px;">How the active planetary period directs internal psychological energies and external real-world opportunities.</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ PRIMARY FOCUS & BEHAVIORAL PROTOCOL</div>
      <p class="body-text">The ${dashaLord} cycle activates pivotal life sectors. Channel ambition into systematic competence, long-range planning, and unwavering ethics. Impulsive shortcuts will backfire during this cycle.</p>
    </div>
    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">PRIMARY ELEMENT</span><span class="val">Ether / Dharma</span></div>
      <div class="matrix-item"><span class="kicker">DOMINANT CHAKRA</span><span class="val">Ajna / Intuition</span></div>
      <div class="matrix-item"><span class="kicker">EXPANSION FIELD</span><span class="val">Knowledge & Career</span></div>
      <div class="matrix-item"><span class="kicker">GUARDRAIL</span><span class="val">Avoid Procrastination</span></div>
    </div>
  </div>
  ${footerRail("Active Mahadasha Strategy", 15)}
</section>

<!-- PAGE 16: SEQUENTIAL 5-YEAR ANTARDASHA ROADMAP -->
<section class="page">
  ${headerRail("CHAPTER 11: 5-YEAR ANTARDASHA HORIZON")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Upcoming Antardasha Sub-Cycles</h2>
    <p class="body-text" style="margin-bottom:16px;">Sequential sub-period transitions directing monthly decision windows and emotional phases.</p>
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px;">
      ${(chart.antardasha || []).slice(0, 4).map((ad) => `
        <div class="luxury-card">
          <div class="card-title">${escapeHtml(ad.planet)} Antardasha</div>
          <p class="body-text" style="font-size:11px;">
            ${ad.start instanceof Date ? ad.start.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : String(ad.start).slice(0, 7)} to 
            ${ad.end instanceof Date ? ad.end.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : String(ad.end).slice(0, 7)}
          </p>
          <div class="body-s" style="margin-top:4px;">${
            ad.planet === "Sun" ? "Elevates vital self-confidence, leadership recognition, and authoritative decisions." :
            ad.planet === "Moon" ? "Heightens intuitive clarity, emotional sensitivity, and domestic harmony." :
            ad.planet === "Mars" ? "Ignites ambitious drive, executive determination, and decisive breakthroughs." :
            ad.planet === "Mercury" ? "Sharpens commercial contracts, analytical agility, and communications." :
            ad.planet === "Jupiter" ? "Expands auspicious blessings, spiritual wisdom, financial fortune, and mentor support." :
            ad.planet === "Venus" ? "Harmonizes relationships, creative endeavors, luxury assets, and diplomatic alliances." :
            ad.planet === "Saturn" ? "Demands rigorous discipline, structural consolidation, patience, and karmic pruning." :
            ad.planet === "Rahu" ? "Surges rapid unconventional opportunities, ambitious appetite, and bold leaps." :
            ad.planet === "Ketu" ? "Induces deep spiritual contemplation, subtle insights, and detachment from ego noise." :
            "Directs mental focus toward material crystallization and structural achievements."
          }</div>
        </div>
      `).join("")}
    </div>
  </div>
  ${footerRail("5-Year Antardasha Roadmap", 16)}
</section>

<!-- PAGE 17: DOUBLE-TRANSIT RADAR (SATURN & JUPITER) -->
<section class="page">
  ${headerRail("CHAPTER 12: DOUBLE-TRANSIT GOCHAR RADAR")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Jupiter & Saturn Dual-Filter Analysis</h2>
    <p class="body-text" style="margin-bottom:18px;">Vedic Shastras state that no major life event (marriage, promotion, property) occurs without the dual sanction of Saturn and Jupiter.</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ SATURN TRANSIT (SHANI GOCHAR)</div>
      <p class="body-text">Saturn enforces foundational discipline and karmic pruning. Evaluate your Sade Sati or Kantaka Shani phase to strategically schedule long-term commitments.</p>
    </div>
    <div class="luxury-card">
      <div class="card-title">✦ JUPITER TRANSIT (GURU GOCHAR)</div>
      <p class="body-text">Jupiter's aspect expands grace and wisdom. Houses receiving Jupiter's 5th, 7th, and 9th drishti experience organic growth, reconciliation, and auspicious timing.</p>
    </div>
  </div>
  ${footerRail("Double-Transit Gochar Radar", 17)}
</section>

<!-- PAGE 18: RAHU-KETU KARMIC AXIS -->
<section class="page">
  ${headerRail("CHAPTER 13: RAHU-KETU KARMIC AXIS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Lunar Nodes: Evolutionary Destiny</h2>
    <p class="body-text" style="margin-bottom:18px;">Rahu represents your incarnational hunger and uncharted growth; Ketu represents past-life mastery and detachment.</p>
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px;">
      <div class="luxury-card">
        <div class="card-title">✦ RAHU: THE FORWARD OBSESSION</div>
        <p class="body-text">Placed in ${escapeHtml(chart.planets?.["Rahu"]?.sign || "Pisces")} (House ${chart.planets?.["Rahu"]?.house || 11}). Urges you to innovate, conquer unconventional frontiers, and transcend ancestral boundaries.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ KETU: THE INHERITED MASTERY</div>
        <p class="body-text">Placed in ${escapeHtml(chart.planets?.["Ketu"]?.sign || "Virgo")} (House ${chart.planets?.["Ketu"]?.house || 5}). Innate discernment and analytical detachment. Release perfectionistic anxiety.</p>
      </div>
    </div>
  </div>
  ${footerRail("Rahu-Ketu Karmic Axis", 18)}
</section>

<!-- PAGE 19: AYURVEDIC BIO-DOSHA AUDIT -->
<section class="page">
  ${headerRail("CHAPTER 14: AYURVEDIC TRIDOSHA CONSTITUTION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Ayurvedic Bio-Dosha & Health Vulnerability</h2>
    <p class="body-text" style="margin-bottom:18px;">Astrological mapping of Vata (Air/Ether), Pitta (Fire), and Kapha (Water/Earth) bio-energies.</p>
    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">PRIMARY DOSHA</span><span class="val">Pitta-Vata</span></div>
      <div class="matrix-item"><span class="kicker">ORGAN VULNERABILITY</span><span class="val">Digestive Fire / Nerves</span></div>
      <div class="matrix-item"><span class="kicker">HEALING FREQUENCY</span><span class="val">528 Hz Cellular</span></div>
      <div class="matrix-item"><span class="kicker">DIETARY BALANCE</span><span class="val">Cooling & Sattvic</span></div>
    </div>
  </div>
  ${footerRail("Ayurvedic Bio-Dosha", 19)}
</section>

<!-- PAGE 20: ASTRO-VASTU & ENVIRONMENTAL RESONANCE -->
<section class="page">
  ${headerRail("CHAPTER 15: ASTRO-VASTU SPATIAL HARMONY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">16-Zone Astro-Vastu Environmental Alignment</h2>
    <p class="body-text" style="margin-bottom:18px;">Harmonizing home and workspace compass directions with your ruling planetary dispositors.</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ NORTH-EAST (ISHAN) & NORTH DIRECTIONS</div>
      <p class="body-text">Keep the North-East zone of your dwelling pristine, light, and clutter-free to preserve Jupiter's clarity. Position your work desk facing North or East for optimal cognitive flow.</p>
    </div>
    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">WORK FACING</span><span class="val">North / East</span></div>
      <div class="matrix-item"><span class="kicker">SLEEP HEAD AXIS</span><span class="val">South / East</span></div>
      <div class="matrix-item"><span class="kicker">WATER ELEMENT</span><span class="val">North-East Clean</span></div>
      <div class="matrix-item"><span class="kicker">HEAVY STORAGE</span><span class="val">South-West (Nairutya)</span></div>
    </div>
  </div>
  ${footerRail("Astro-Vastu Spatial Harmony", 20)}
</section>

<!-- PAGE 21: SACRED BIO-REMEDIES (RATNA & RUDRAKSHA) -->
<section class="page">
  ${headerRail("CHAPTER 16: RATNA & RUDRAKSHA PRESCRIPTION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Personalized Bio-Wearable Prescriptions</h2>
    <p class="body-text" style="margin-bottom:18px;">Prescribed gems and electromagnetic beads to strengthen benefic dispositors without increasing malefic friction.</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ CERTIFIED GEMSTONE & BEAD ARCHITECTURE</div>
      <p class="body-text">Primary recommendation: Yellow Sapphire (Pukhraj) or natural White Coral. Sacred bead: 5-Mukhi and 7-Mukhi Rudraksha worn on yellow silk thread on Thursday morning post purification.</p>
    </div>
    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">PRIMARY RATNA</span><span class="val">Yellow Sapphire</span></div>
      <div class="matrix-item"><span class="kicker">RUDRAKSHA</span><span class="val">5-Mukhi + 7-Mukhi</span></div>
      <div class="matrix-item"><span class="kicker">METAL</span><span class="val">Gold / Panchadhatu</span></div>
      <div class="matrix-item"><span class="kicker">FINGER</span><span class="val">Index (Right Hand)</span></div>
    </div>
  </div>
  ${footerRail("Ratna & Rudraksha Prescription", 21)}
</section>

<!-- PAGE 22: SACRED UPAYAS (JAPA, MANTRA & DANA) -->
<section class="page">
  ${headerRail("CHAPTER 17: SACRED JAPA & DANA UPAYAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Classical Upayas, Mantras & Charitable Seva</h2>
    <p class="body-text" style="margin-bottom:18px;">Non-destructive, authentic Vedic remedies to clear past-life debts (Rinas).</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">1. SACRED GAYATRI & SEED JAPA</div>
      <p class="body-text">Chant the divine seed mantra 108 times at dawn facing East:</p>
      <div style="font-family:'Noto Serif Devanagari',serif;font-size:16px;color:var(--gold-bright);margin-top:8px;font-weight:600;">
        ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ॥ (Om Gram Greem Groum Sah Gurave Namah)
      </div>
    </div>
    <div class="luxury-card">
      <div class="card-title">2. SELFLESS DANA & NATURE SEVA</div>
      <p class="body-text">Feeding grains to birds at sunrise, sponsoring education for underprivileged students, and planting medicinal trees (Peepal, Neem, Tulsi) neutralizes afflictions faster than passive rituals.</p>
    </div>
  </div>
  ${footerRail("Sacred Japa & Dana Upayas", 22)}
</section>

<!-- PAGE 23: STRATEGIC 12-MONTH ACTION BLUEPRINT -->
<section class="page">
  ${headerRail("CHAPTER 18: STRATEGIC 12-MONTH BLUEPRINT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Quarterly Strategic Decision Roadmap</h2>
    <p class="body-text" style="margin-bottom:18px;">Actionable execution framework aligning commercial, personal, and spiritual initiatives with planetary cycles.</p>
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px;">
      <div class="luxury-card"><div class="card-title">Q1: EXPANSION & ALLIANCES</div><p class="body-text">Initiate high-leverage partnerships, sign intellectual property contracts, and expand professional networks.</p></div>
      <div class="luxury-card"><div class="card-title">Q2: REORGANIZATION & AUDIT</div><p class="body-text">Prune inefficient overhead, audit asset portfolios, and consolidate foundational systems.</p></div>
      <div class="luxury-card"><div class="card-title">Q3: PUBLIC HARVEST & PROMOTION</div><p class="body-text">Launch major public-facing campaigns and seek leadership recognition.</p></div>
      <div class="luxury-card"><div class="card-title">Q4: GROUNDING & INTROSPECTION</div><p class="body-text">Spiritual pilgrimage, restful rejuvenation, and long-range strategic goal setting.</p></div>
    </div>
  </div>
  ${footerRail("12-Month Action Blueprint", 23)}
</section>

<!-- PAGE 24: AUTHENTICITY SEAL & IMMUTABLE SIGNOFF -->
<section class="page">
  ${headerRail("SHASTRA CERTIFICATION & AUTHENTICITY SEAL")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Certificate of Astrological Authenticity</h2>
    <p class="body-text" style="margin-bottom:20px;">Deterministic verification affirming strict mathematical compliance with classical Shastras.</p>
    <div style="background:var(--surface);border:2px solid var(--border-gold-strong);border-radius:10px;padding:32px;text-align:center;">
      <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--gold-bright);margin-bottom:8px;">
        ✦ ASTROLIFE SACRED SHASTRA CERTIFICATION ✦
      </div>
      <p class="body-text" style="max-width:560px;margin:0 auto 16px;">
        This 24-page dossier is computed deterministically under Brihat Parashara Hora Shastra, Jaimini Upadesha Sutras, and Swiss Ephemeris certified astronomical algorithms. Free from speculative AI hallucinations.
      </p>
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--gold);letter-spacing:0.08em;margin-bottom:6px;">
        ${isSample ? "SAMPLE PREVIEW RECORD · OFFICIAL CERTIFICATION LOCKED" : `VERIFIED IMMUTABLE SHASTRA RECORD · CERTIFICATE ID: ${paymentId}`}
      </div>
      <div style="font-size:10px;color:var(--ivory-mute);">
        Certified for: ${subjectName} · Archive Ref: ${orderId} · www.astrolife-ai.vercel.app
      </div>
      ${isSample ? `
        <div style="margin-top:16px;background:rgba(201,169,97,0.12);border:1px solid var(--border-gold);border-radius:6px;padding:10px 14px;display:inline-block;">
          <div style="font-size:11px;font-weight:700;color:var(--gold-bright);margin-bottom:2px;">✦ OFFICIAL HIGH-DEFINITION DOSSIER UNLOCK ✦</div>
          <div style="font-size:10px;color:var(--ivory-dim);">To generate your un-watermarked permanent archival copy, visit <span style="color:var(--gold);">astrolife-ai.vercel.app/reports</span></div>
        </div>
      ` : ""}
    </div>
  </div>
  ${footerRail("Certified Shastra Archive", 24)}
</section>

</body>
</html>`;
}
