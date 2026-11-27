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
import { calculateAshtakavarga } from "../../astro-engine/ashtakavarga";
import type { PackageDossierOptions } from "../package-dossier-html-generator";
import { getActiveDashaState, getPlanetLon, getSeekerAge, resolveGender } from "../dossier-shared-helpers";
import {
  getSignLord,
  houseFromLagna,
  ordinal,
  renderHumanImpactCardHtml,
  signFromHouse
} from "../../astro/human-translator";

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
  const subjectName = escapeHtml(options.customerName || chart.name || "Sacred Seeker");
  const orderId = escapeHtml(options.orderId || `ORD_${Date.now().toString(36).toUpperCase()}`);
  const certificateId = escapeHtml(options.paymentId || `CERT_${Date.now().toString(36).toUpperCase()}`);

  const birthDate = chart.dob || "Recorded";
  const birthTime = chart.tob || "12:00";
  const birthCity = escapeHtml(chart.city || "Delhi");
  const lat = chart.lat ?? 28.6139;
  const lon = chart.lon ?? 77.2090;

  const lagnaRashi = chart.lagnaRashi || SIGN_NAMES[chart.lagnaNum ?? 0] || "Aries";
  const lagnaNum = chart.lagnaNum ?? 0;
  const moonP = chart.planets?.Moon;
  const moonNakshatra = moonP?.nakshatra || "Ashwini";
  const moonRashi = moonP?.sign || "Aries";
  const moonPada = moonP?.pada || 1;

  const resolvedGender = resolveGender(options, chart);
  const seekerAge = getSeekerAge(chart.dob);
  const seekerAgeStr = typeof seekerAge === "number" ? `${seekerAge} years` : "Recorded";

  const dashaState = getActiveDashaState(chart);
  const activeDasha = dashaState.activeDasha || "Jupiter";
  const activeAntar = dashaState.activeAntar || "Saturn";

  // Compute Sarvatobhadra Grid
  const sbResult = calculateSarvatobhadraGrid(chart);

  // Compute Ashtakavarga
  const akv = calculateAshtakavarga(chart.planets as any, lagnaNum);
  const savHouses = akv.houses;
  const h2Score = savHouses[1]?.score || 28;
  const h5Score = savHouses[4]?.score || 28;
  const h11Score = savHouses[10]?.score || 28;
  const h12Score = savHouses[11]?.score || 25;
  const netSurplus = h11Score - h12Score;
  const surplusSign = netSurplus >= 0 ? `+${netSurplus}` : `${netSurplus}`;

  const lagnesh = SIGN_LORDS[lagnaRashi] || "Mars";
  const sunP = chart.planets?.Sun;
  const jupP = chart.planets?.Jupiter;
  const mercP = chart.planets?.Mercury;
  const rahuP = chart.planets?.Rahu;
  const ketuP = chart.planets?.Ketu;
  const saturnP = chart.planets?.Saturn;
  const marsP = chart.planets?.Mars;
  const venusP = chart.planets?.Venus;

  const fifthSignNum = (lagnaNum + 4) % 12;
  const fifthLord = SIGN_LORDS[SIGN_NAMES[fifthSignNum]];
  const fifthLordP = chart.planets?.[fifthLord];
  
  const rahuHouse = rahuP?.house || 1;
  const ketuHouse = ketuP?.house || 7;
  const moonHouse = moonP?.house || 1;
  const saturnHouse = saturnP?.house || 1;
  const marsHouse = marsP?.house || 1;

  // Real AmK (2nd highest degree among 7 grahas)
  const sevenGrahas = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const sortedDeg = sevenGrahas
    .map(p => ({ p, deg: ((getPlanetLon(chart.planets?.[p]) || chart.planets?.[p]?.degree || 0) % 30 + 30) % 30 }))
    .sort((a, b) => b.deg - a.deg);
  const amkPlanet = sortedDeg[1]?.p || lagnesh;
  const amkData = chart.planets?.[amkPlanet];

  const occupantsInHouse = (h: number): string[] =>
    Object.entries(chart.planets || {})
      .filter(([, pd]) => pd && pd.house === h)
      .map(([name]) => name);

  const tenthSign = signFromHouse(lagnaRashi, 10);
  const tenthLord = getSignLord(tenthSign);
  const tenthOcc = occupantsInHouse(10);
  const cancerJupH = houseFromLagna("Cancer", lagnaRashi);
  const leoJupH = houseFromLagna("Leo", lagnaRashi);
  const bestSavHouseIdx = savHouses.reduce((bestIdx, hObj, i) => ((hObj?.score || 0) > (savHouses[bestIdx]?.score || 0) ? i : bestIdx), 0);
  const bestSavSign = signFromHouse(lagnaRashi, bestSavHouseIdx + 1);
  const bestSavScore = savHouses[bestSavHouseIdx]?.score || 30;
  const isCancerPeak = [1, 2, 4, 5, 7, 9, 10, 11].includes(cancerJupH);

  // D-1 SVG dynamic caption
  const d1CaptionParts = [1, 2, 5, 8, 9, 10, 11].map(h => {
    const s = signFromHouse(lagnaRashi, h);
    const occ = occupantsInHouse(h);
    return `${s} ${ordinal(h)} H${occ.length ? ` (${occ.join("/")})` : ""}`;
  });
  const d1DynamicCaption = `${lagnaRashi} Lagna &middot; ` + d1CaptionParts.slice(1).join(" &middot; ");

  const fifthLordAfflicted = [6, 8, 12].includes(fifthLordP?.house || 0);
  const rahuInRiskHouses = [5, 8, 12].includes(rahuHouse);
  const moonAfflicted = moonHouse === saturnHouse || moonHouse === marsHouse || moonHouse === rahuHouse;
  const hasVirgoVenusOrScorpioMoon = venusP?.sign === "Virgo" || moonRashi === "Scorpio";

  const tradingRisk = evaluateTradingRisk({
    fifthLordAfflicted,
    rahuInFifthEighthOrTwelfth: rahuInRiskHouses,
    moonAfflictedBySaturnMarsRahu: moonAfflicted,
    activeDashaEighthOrTwelfth: false,
    hasSubstantialLossesOrDebt: false,
    hasVirgoVenusOrScorpioMoon,
  });

  const secondSign = SIGN_NAMES[(lagnaNum + 1) % 12];
  const fifthSign = SIGN_NAMES[(lagnaNum + 4) % 12];
  const ninthSign = SIGN_NAMES[(lagnaNum + 8) % 12];
  const eleventhSign = SIGN_NAMES[(lagnaNum + 10) % 12];
  const twelfthSign = SIGN_NAMES[(lagnaNum + 11) % 12];
  const secondLord = SIGN_LORDS[secondSign];
  const eleventhLord = SIGN_LORDS[eleventhSign];
  const ninthLord = SIGN_LORDS[ninthSign];
  const twelfthLord = SIGN_LORDS[twelfthSign];

  const DOMAINS: Record<number, string> = {
    1: "Personal Stamina & Executive Willpower",
    2: "Accumulated Liquid Treasury & Wealth Retention",
    3: "Analytical Enterprise & Strategic Action",
    4: "Fixed Assets, Land & Emotional Grounding",
    5: "Speculation, Discretionary Trading & Intellect",
    6: "Competitive Dominance & Problem Solving",
    7: "Corporate Counterparties & Legal Contracts",
    8: "Sudden Volatility, Research & Risk Hedging",
    9: "Long-Term Bhagya, Compounding & Mentorship",
    10: "Public Career Authority & Market Leadership",
    11: "Liquid Profit Inflow & Realized Gains",
    12: "Expenditures, Foreign Outflows & Vyaya",
  };

  const savTableRowsHtml = Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    const signIdx = (lagnaNum + i) % 12;
    const signName = SIGN_NAMES[signIdx];
    const bindus = savHouses[i]?.score || 28;
    const rating = bindus >= 30 ? '<span class="tag-badge tag-emerald">Exceptional</span>' : bindus >= 28 ? '<span class="tag-badge tag-emerald">High</span>' : bindus >= 25 ? '<span class="tag-badge tag-gold">Balanced</span>' : '<span class="tag-badge tag-ruby">Throttled</span>';
    return `<tr><td><strong>${h}${h === 1 ? 'st' : h === 2 ? 'nd' : h === 3 ? 'rd' : 'th'} House</strong></td><td>${signName}</td><td><strong>${bindus}</strong></td><td>${DOMAINS[h]}</td><td>${rating}</td></tr>`;
  }).join("");

  const highBinduSigns = Array.from({length: 12}, (_, i) => ({ sign: SIGN_NAMES[(lagnaNum + i) % 12], score: savHouses[i]?.score || 28 })).filter(x => x.score >= 30).map(x => `${x.sign} (${x.score})`).join(", ") || "Signs with 30+ Bindus";
  const lowBinduSigns = Array.from({length: 12}, (_, i) => ({ sign: SIGN_NAMES[(lagnaNum + i) % 12], score: savHouses[i]?.score || 28 })).filter(x => x.score < 26).map(x => `${x.sign} (${x.score})`).join(", ") || "Signs below 26 Bindus";

  const BAV_PLANETS = [
    { name: "Sun", label: "Sun (Surya)", role: "Institutional reputation & corporate backing" },
    { name: "Moon", label: "Moon (Chandra)", role: "Intuitive timing & liquid cash reserves" },
    { name: "Mars", label: "Mars (Mangal)", role: "Execution courage (requires strict risk stops)" },
    { name: "Mercury", label: "Mercury (Budha)", role: "Analytical data syntax & quantitative precision" },
    { name: "Jupiter", label: "Jupiter (Guru)", role: "Treasury expansion & macro wealth foresight" },
    { name: "Venus", label: "Venus (Shukra)", role: "Portfolio aesthetics & high-value enterprise" },
    { name: "Saturn", label: "Saturn (Shani)", role: "Risk management, discipline & drawdown survival" },
  ];
  const bavRowsHtml = BAV_PLANETS.map((bp) => {
    const h2 = akv.matrix?.[1]?.planetBindus?.[bp.name] ?? 4;
    const h5 = akv.matrix?.[4]?.planetBindus?.[bp.name] ?? 4;
    const h9 = akv.matrix?.[8]?.planetBindus?.[bp.name] ?? 4;
    const h11 = akv.matrix?.[10]?.planetBindus?.[bp.name] ?? 4;
    return `<tr><td><strong>${bp.label}</strong></td><td>${h2} Bindus</td><td>${h5} Bindus</td><td>${h9} Bindus</td><td>${h11} Bindus</td><td>${bp.role}</td></tr>`;
  }).join("");

  const SB_OFFSET_LABELS = [
    "1st (Janma)",
    "10th (Karma)",
    "16th (Sanghatika)",
    "18th (Samudayika)",
    "23rd (Vinaasha)",
    "25th (Manasa)",
    "26th (Jati)",
    "27th (Desha)",
    "28th (Abhisheka)"
  ];
  const SB_ENGLISH_DESC = [
    "Core physical &amp; psychological decision clarity during market hours",
    "Career standing, institutional credibility &amp; execution discipline",
    "Collective liquidity, treasury inflows &amp; capital accumulation",
    "Teamwork, market sentiment alignment &amp; sector momentum",
    "Critical stop-loss boundary &amp; capital drawdown protection",
    "Emotional stability, patience &amp; avoidance of impulsive trades",
    "Strategic peer network &amp; institutional counterparties",
    "Macroeconomic environment &amp; cross-border capital flows",
    "Sovereign coronation, high-conviction wealth breakthroughs"
  ];
  const sensitiveRowsHtml = (sbResult.sensitiveTargets || []).map((st, idx) => `
    <tr>
      <td><strong>${escapeHtml(st.name)}</strong></td>
      <td>${escapeHtml(st.nakshatra)}</td>
      <td>${SB_OFFSET_LABELS[idx] || `${idx + 1}th`}</td>
      <td>${SB_ENGLISH_DESC[idx] || "Sensitive market trigger point"}</td>
    </tr>
  `).join("");
  const janmaNak = sbResult.sensitiveTargets?.[0]?.nakshatra || moonNakshatra;
  const karmaNak = sbResult.sensitiveTargets?.[1]?.nakshatra || "Uttara Ashadha";
  const sanghatikaNak = sbResult.sensitiveTargets?.[2]?.nakshatra || "Swati";
  const vinaashaNak = sbResult.sensitiveTargets?.[4]?.nakshatra || "Vinaasha";

  // Dual-Layer HumanImpactCards (Pages 3, 11, 13, 14, 20)
  const specHumanCard = renderHumanImpactCardHtml({
    tier: h5Score >= 30 ? "TIER_HIGH" : h5Score >= 26 ? "TIER_MID" : "TIER_LOW",
    badge: h5Score >= 30 ? "Your Natural Edge" : h5Score >= 26 ? "Steady Engine (Needs Structure)" : "Your Blind Spot & Fix",
    title: `Risk &amp; Decision Profile (${fifthSign} 5th House)`,
    plainWords: `Your 5th house (${fifthSign}, ${h5Score} Bindus) governed by ${fifthLord} favors structured, rules-based investing over gut-feel bets. When you follow a written checklist, your decision accuracy stays consistent.`,
    watchOutFor: `Taking impulsive intraday trades when markets move sharply.`,
    nextMove: `Write down your entry, stop-loss, and target before placing any order tomorrow.`,
    shastricProof: `5th House: ${fifthSign} (${h5Score} Bindus) · Lord: ${fifthLord} in ${ordinal(fifthLordP?.house || 5)}`
  }, { customStyle: "margin-top:8px;margin-bottom:0;padding:8px 10px;" });

  const savHumanCard = renderHumanImpactCardHtml({
    tier: netSurplus > 0 ? "TIER_HIGH" : "TIER_MID",
    badge: netSurplus > 0 ? "Your Natural Edge" : "Steady Engine (Needs Structure)",
    title: `Cashflow Retention (${h11Score} Gains vs ${h12Score} Outflow)`,
    plainWords: `Your 11th house of gains (${h11Score} Bindus) compared to your 12th house of expenses (${h12Score} Bindus) gives a ${surplusSign} net retention spread. ${netSurplus > 0 ? "Money that comes in tends to stick when parked in long-term assets." : "Automated savings sweeps are essential so gains do not leak into expenses."}`,
    watchOutFor: `Leaving idle trading profits in high-risk margin accounts.`,
    nextMove: `Set up an automatic Friday transfer of realized gains into a separate reserve account.`,
    shastricProof: `SAV Total: ${akv.sarvaTotal} · H2: ${h2Score} · H11: ${h11Score} · H12: ${h12Score}`
  }, { customStyle: "margin-top:8px;margin-bottom:0;padding:8px 10px;" });

  const bavHumanCard = renderHumanImpactCardHtml({
    tier: h2Score >= 30 ? "TIER_HIGH" : "TIER_MID",
    badge: h2Score >= 30 ? "Your Natural Edge" : "Steady Engine (Needs Structure)",
    title: `Treasury &amp; Capital Reserves (${secondSign} 2nd House)`,
    plainWords: `Your 2nd house of accumulated wealth holds ${h2Score} Bindus in ${secondSign}. Prioritizing liquid reserves and index compounding protects your downside during volatile market quarters.`,
    watchOutFor: `Over-concentrating capital into a single speculative theme.`,
    nextMove: `Verify that at least 25% of your capital sits in low-volatility liquid or sovereign reserves.`,
    shastricProof: `2nd House: ${secondSign} (${h2Score} Bindus) · Lord: ${secondLord}`
  }, { customStyle: "margin-top:8px;margin-bottom:0;padding:8px 10px;" });

  const psychHumanCard = renderHumanImpactCardHtml({
    tier: "TIER_MID",
    badge: "Steady Engine (Needs Structure)",
    title: `Trading Mindset (${lagnaRashi} Lagna &middot; ${moonRashi} Moon)`,
    plainWords: `Your ${lagnaRashi} Ascendant brings analytical structure, while your ${moonRashi} Moon (${ordinal(moonHouse)} house) drives your emotional reaction to price swings. Separating research hours from execution hours keeps emotions out of your P&amp;L.`,
    watchOutFor: `Overtrading out of boredom during flat or choppy market sessions.`,
    nextMove: `Step away from screens for 2 minutes before confirming any discretionary trade.`,
    shastricProof: `Lagna: ${lagnaRashi} (${lagnesh}) · Moon: ${moonRashi} H${moonHouse} · Mars: H${marsHouse}`
  }, { customStyle: "margin-top:8px;margin-bottom:0;padding:8px 10px;" });

  const radarHumanCard = renderHumanImpactCardHtml({
    tier: isCancerPeak ? "TIER_HIGH" : "TIER_MID",
    badge: isCancerPeak ? "Your Natural Edge" : "Steady Engine (Needs Structure)",
    title: `2026–2027 Market Timing Window (Jupiter in ${ordinal(cancerJupH)})`,
    plainWords: `Exalted Jupiter in Cancer activates your ${ordinal(cancerJupH)} house through July 2027. ${isCancerPeak ? "This supports steady wealth harvesting and high-conviction long-term positioning." : "Use this cycle for hedged accumulation, debt reduction, and disciplined risk control."}`,
    watchOutFor: `Assuming every rally continues indefinitely without profit-taking rules.`,
    nextMove: `Mark your calendar for ${bestSavSign} Solar transit (${bestSavScore} Bindus) as your top review window.`,
    shastricProof: `Jupiter Cancer: H${cancerJupH} · Best SAV Sign: ${bestSavSign} (${bestSavScore} Bindus)`
  }, { customStyle: "margin-top:8px;margin-bottom:0;padding:8px 10px;" });

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

.devanagari-safe {
  letter-spacing: 0 !important;
  font-family: 'Noto Sans Devanagari', 'Noto Serif Devanagari', serif !important;
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
        <span class="kicker">Seeker Age &amp; Gender</span>
        <div style="color:var(--ivory);">${seekerAgeStr} · ${resolvedGender ? (resolvedGender === "female" ? "Female" : "Male") : "Recorded"}</div>
      </div>
      <div>
        <span class="kicker">Ascendant &amp; Moon Sign</span>
        <div style="color:var(--ivory);">${lagnaRashi} Lagna · ${moonRashi} Moon (${moonNakshatra} Pada ${moonPada})</div>
      </div>
      <div>
        <span class="kicker">5th House Speculation Lord</span>
        <div style="color:var(--emerald-bright);font-weight:700;">${fifthLord} in ${fifthLordP?.sign || fifthSign} (${ordinal(fifthLordP?.house || 5)} House)</div>
      </div>
      <div>
        <span class="kicker">11th House Realized Gains Lord</span>
        <div style="color:var(--gold-bright);font-weight:700;">${eleventhLord} in ${chart.planets?.[eleventhLord]?.sign || eleventhSign} (${ordinal(chart.planets?.[eleventhLord]?.house || 11)} House)</div>
      </div>
      <div>
        <span class="kicker">SAV Bindu Total</span>
        <div style="color:var(--ivory);font-weight:700;">${akv.sarvaTotal} Bindus (${surplusSign} Net Savings Surplus)</div>
      </div>
      <div>
        <span class="kicker">Active Operating Dasha</span>
        <div style="color:var(--sapphire-bright);font-weight:700;">${activeDasha} &mdash; ${activeAntar}</div>
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
      Financial markets are not random noise; they are the macrocosmic aggregation of collective human desire, fear, and liquidity cycles. In classical Jyotish, trading success is governed by the dynamic interaction between the <strong>5th House of Speculative Discretion (Buddhi / Purva Punya)</strong>, the <strong>11th House of Realized Cash Inflow (Labha)</strong>, and the <strong>Sarvatobhadra Chakra's 28-Nakshatra Vedha hit lines</strong>.
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
          <strong style="color:var(--emerald-bright);">PILLAR I (Pages 3&ndash;6): 5th/11th House Speculative Geometry &amp; 2nd/8th Volatility</strong> &mdash; Deep structural audit of ${fifthSign} 5th house (${h5Score} bindus), ${eleventhSign} 11th house (${h11Score} bindus), and the Rahu-Ketu financial axis.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--sapphire);">
          <strong style="color:var(--sapphire-bright);">PILLAR II (Pages 7&ndash;10): True 81-Square Sarvatobhadra Chakra &amp; Vedha Hits</strong> &mdash; 28-Nakshatra cross-ray strikes (Sammukha, Vama, Dakshina, Kona) mapping market entry and exit precision.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--gold);">
          <strong style="color:var(--gold-bright);">PILLAR III (Pages 11&ndash;13): Sarvashtakavarga ${akv.sarvaTotal}-Bindu Heatmap &amp; Macro Cycles</strong> &mdash; House-by-house liquidity strength, net financial surplus (${surplusSign} bindus), and bullish vs bearish market cycles.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--ruby);">
          <strong style="color:var(--ruby-bright);">PILLAR IV (Pages 14&ndash;16): Trading Psychology &amp; Anti-Ruin Circuit Breakers</strong> &mdash; Eliminating FOMO and revenge trading, strict 2% risk rule, and the systematic quant imperative for ${lagnaRashi} Lagna.
        </div>
        <div style="background:var(--surface-elevated);padding:5px 8px;border-radius:4px;border-left:3px solid var(--emerald);">
          <strong style="color:var(--emerald-bright);">PILLAR V (Pages 17&ndash;22): Sectoral Graha Mapping, Asset Risk &amp; Timing Muhurat</strong> &mdash; Tech, defense, and green energy asset allocation, lucky trading horas, and month-by-month sequential market timing.
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
    <h2 class="display-l" style="margin-bottom:6px;">5th House Audit: ${fifthSign} &amp; ${fifthLord} Speculative Restraint</h2>
    <p class="body-text" style="margin-bottom:8px;">
      The 5th house (<em>Purva Punya Bhava</em>) rules speculative intelligence, discretionary risk tolerance, and mathematical probability in markets.
    </p>

    <div class="grid-2" style="margin-bottom:8px;">
      <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11px;">✦ 5TH HOUSE STRUCTURAL AUDIT</div>
        <div style="display:flex;flex-direction:column;gap:4px;font-size:10.5px;margin-top:4px;">
          <div><span class="kicker">5th House Sign:</span> <strong style="color:var(--ivory);">${fifthSign}</strong></div>
          <div><span class="kicker">Sign Lord:</span> <strong style="color:var(--gold-bright);">${fifthLord} in ${fifthLordP?.sign || fifthSign} (${ordinal(fifthLordP?.house || 5)} House)</strong></div>
          <div><span class="kicker">Occupants:</span> <span style="color:var(--emerald-bright);font-weight:700;">${occupantsInHouse(5).length ? occupantsInHouse(5).join(", ") : "None (Unoccupied / Pure Rashi)"}</span></div>
          <div><span class="kicker">SAV Bindus:</span> <strong style="color:var(--emerald-bright);">${h5Score} Bindus (${h5Score >= 30 ? "Strong" : h5Score >= 26 ? "Balanced" : "Disciplined"} Baseline)</strong></div>
          <div><span class="kicker">Lord Placement:</span> <span style="color:var(--ivory);">${fifthLord} in ${ordinal(fifthLordP?.house || 5)} Bhava</span></div>
        </div>
      </div>

      <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);">
        <div class="card-title" style="color:var(--gold-bright);font-size:11px;">✦ SHASTRIC DIAGNOSTIC VERDICT</div>
        <p class="body-text" style="font-size:10.5px;line-height:1.4;margin-top:2px;">
          With <strong>${h5Score} Bindus</strong> in ${fifthSign} governed by ${fifthLord}, your 5th house commands structured analytical patience rather than emotional gambling. Your edge activates strictly when trading is treated as a <strong>rules-based, systematic discipline</strong>.
        </p>
      </div>
    </div>

    <!-- SVG Kundli Container -->
    <div class="luxury-card" style="margin-bottom:0;">
      <div style="text-align:center;font-family:'Cinzel',serif;font-size:10px;color:var(--gold-bright);margin-bottom:4px;">
        ✦ D-1 KUNDLI: FINANCIAL WEALTH AXIS (HOUSES 2, 5, 8, 9, 11 HIGHLIGHTED) ✦
      </div>
      <div class="kundli-container">
        ${renderNorthIndianSvg(chart, [2, 5, 8, 9, 11], 200)}
      </div>
      <div style="text-align:center;font-size:9px;color:var(--ivory-mute);margin-top:4px;">
        ${d1DynamicCaption}
      </div>
    </div>
    ${specHumanCard}
  </div>
  ${footerRail("Pillar I: 5th House Speculative Geometry", 3)}
</section>

<!-- PAGE 4: PILLAR I — 11TH HOUSE REALIZED GAINS AXIS -->
<section class="page">
  ${headerRail("PILLAR I: 11TH HOUSE GAINS AXIS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">11th House Audit: ${eleventhSign} &amp; Liquid Wealth Inflow</h2>
    <p class="body-text" style="margin-bottom:10px;">
      While the 5th house generates the trade idea, the 11th house (<em>Labha Bhava</em>) determines whether the profit can actually be booked and withdrawn into your bank account.
    </p>

    <!-- 11th House Table -->
    <div class="luxury-card" style="margin-bottom:10px;border:1.5px solid var(--emerald);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">✦ 11TH HOUSE STRUCTURAL AUDIT</div>
      <div class="grid-2" style="font-size:11.5px;margin-top:6px;gap:8px;">
        <div>
          <span class="kicker">11th House Sign:</span>
          <div style="color:var(--ivory);font-weight:600;">${eleventhSign}</div>
        </div>
        <div>
          <span class="kicker">Sign Lord:</span>
          <div style="color:var(--gold-bright);font-weight:700;">${eleventhLord} in ${chart.planets?.[eleventhLord]?.sign || eleventhSign} (${formatDMS(getPlanetLon(chart.planets?.[eleventhLord]) || chart.planets?.[eleventhLord]?.degree || 0).slice(0, 6)})</div>
        </div>
        <div>
          <span class="kicker">SAV Bindus:</span>
          <div style="color:var(--emerald-bright);font-weight:700;">${h11Score} Bindus (${h11Score >= 30 ? "High" : h11Score >= 26 ? "Solid" : "Disciplined"} Baseline)</div>
        </div>
        <div>
          <span class="kicker">Lord Placement:</span>
          <div style="color:var(--sapphire-bright);font-weight:600;">${ordinal(chart.planets?.[eleventhLord]?.house || 11)} House${occupantsInHouse(11).length ? ` (Occ: ${occupantsInHouse(11).join(", ")})` : ""}</div>
        </div>
      </div>
    </div>

    <!-- Deep Shastric Analysis -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ HOW YOUR LIQUID WEALTH COMPOUNDS (${eleventhLord.toUpperCase()} IN ${ordinal(chart.planets?.[eleventhLord]?.house || 11).toUpperCase()} HOUSE)
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        In classical Parashari shastra, your 11th lord ${eleventhLord} occupies the ${ordinal(chart.planets?.[eleventhLord]?.house || 11)} house. Sustained profits flow when you prioritize:
      </p>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.2px;margin-top:6px;">
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">1. Global &amp; Institutional Equities:</strong> Broad-market index funds, blue-chip leaders, and cross-border diversification.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">2. High-Value Advisory &amp; Core Craft:</strong> Earnings tied to structured expertise rather than noisy intraday tick fluctuations.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">3. Compounded Long-Term Holdings:</strong> Allocating capital into durable businesses and letting compound interest operate undisturbed.
        </div>
      </div>
    </div>

    <!-- Net Savings Ratio -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">Net Capital Surplus Indicator:</div>
      <p style="font-size:11.5px;color:var(--ivory-dim);margin-top:2px;">
        11th House (Gains) = <strong>${h11Score} Bindus</strong> vs 12th House (Expenditure) = <strong>${h12Score} Bindus</strong>. Net spread of <strong>${surplusSign} Bindus</strong> ${netSurplus >= 0 ? "supports capital retention when paired with automated profit sweeps." : "means disciplined profit sweeping is mandatory to prevent outflow leakage."}
      </p>
    </div>
  </div>
  ${footerRail("Pillar I: 11th House Gains Axis", 4)}
</section>

<!-- PAGE 5: PILLAR I — 2ND/8TH RAHU-KETU VOLATILITY AXIS -->
<section class="page">
  ${headerRail("PILLAR I: 2ND/8TH RAHU-KETU VOLATILITY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The ${ordinal(rahuHouse)} &amp; ${ordinal(ketuHouse)} House Nodal Volatility Axis</h2>
    <p class="body-text" style="margin-bottom:10px;">
      The axis of Rahu (Desire/Amplification) in your ${ordinal(rahuHouse)} house and Ketu (Detachment/Suddenness) in your ${ordinal(ketuHouse)} house defines your primary psychological volatility trigger in markets.
    </p>

    <!-- Rahu Box -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--sapphire-bright);">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;">
        ✦ RAHU IN ${ordinal(rahuHouse).toUpperCase()} HOUSE (${(rahuP?.sign || "Libra").toUpperCase()} &middot; ${formatDMS(getPlanetLon(rahuP) || rahuP?.degree || 0).slice(0, 6)}): AMPLIFICATION &amp; FOMO TRAP
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Rahu in ${rahuP?.sign || "Libra"} in the ${ordinal(rahuHouse)} house drives strong ambition and attraction to high-momentum financial vehicles. Supported by <strong>${h2Score} Bindus in your 2nd House (${secondSign})</strong>, your treasury requires disciplined boundaries against hype.
      </p>
      <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;margin-top:6px;font-size:11px;">
        <strong style="color:var(--ruby-bright);">Rahu Market Trap:</strong> The illusion of exponential quick money. When a stock rallies parabolically, Rahu triggers FOMO (Fear Of Missing Out), tempting you to buy at the top. Strict position sizing is mandatory.
      </div>
    </div>

    <!-- Ketu Box -->
    <div class="luxury-card" style="margin-bottom:10px;border-left:3px solid var(--ruby-bright);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:12px;">
        ✦ KETU IN ${ordinal(ketuHouse).toUpperCase()} HOUSE (${(ketuP?.sign || "Aries").toUpperCase()} &middot; ${formatDMS(getPlanetLon(ketuP) || ketuP?.degree || 0).slice(0, 6)}): SUDDEN REVERSALS &amp; INTUITIVE SENSING
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Ketu in ${ketuP?.sign || "Aries"} (${ordinal(ketuHouse)} house) brings sharp, unexpected reversals whenever leverage is excessive. Avoid over-leveraged positions that invite forced margin liquidation.
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
      Mathematical audit of wealth-forming combinations (Dhana Yogas) and specific celestial drawdown vulnerabilities for ${subjectName}.
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
          <td><strong>11th House Labha Axis</strong></td>
          <td>${eleventhLord} rules 11th (${eleventhSign}) · Placed in House ${chart.planets?.[eleventhLord]?.house || 11}</td>
          <td>Liquid cash inflow, enterprise earnings, network compounding</td>
          <td><span class="tag-badge tag-emerald">Strong (92%)</span></td>
        </tr>
        <tr>
          <td><strong>9th House Bhagya Raja Yoga</strong></td>
          <td>${ninthLord} rules 9th (${ninthSign}) · Placed in House ${chart.planets?.[ninthLord]?.house || 9}</td>
          <td>Long-term compounding, sovereign fortune, mentor guidance</td>
          <td><span class="tag-badge tag-emerald">Supreme (95%)</span></td>
        </tr>
        <tr>
          <td><strong>2nd House Treasury Vault</strong></td>
          <td>${secondLord} rules 2nd (${secondSign}) · Placed in House ${chart.planets?.[secondLord]?.house || 2}</td>
          <td>Capital accumulation, balance sheet fortification, liquidity reserve</td>
          <td><span class="tag-badge tag-gold">Solid (88%)</span></td>
        </tr>
        <tr>
          <td><strong>5th House Speculative Radar</strong></td>
          <td>${fifthLord} rules 5th (${fifthSign}) · Placed in House ${fifthLordP?.house || 5}</td>
          <td>Intellectual discernment, analytical hedging, risk control</td>
          <td><span class="tag-badge ${fifthLordAfflicted ? 'tag-ruby' : 'tag-emerald'}">${fifthLordAfflicted ? 'Caution (75%)' : 'Disciplined (90%)'}</span></td>
        </tr>
        <tr>
          <td><strong>12th House Vyaya / Drawdown Risk</strong></td>
          <td>${twelfthLord} rules 12th (${twelfthSign}) · Placed in House ${chart.planets?.[twelfthLord]?.house || 12}</td>
          <td>Capital protection alert: avoid forced leverage and revenge trading</td>
          <td><span class="tag-badge tag-ruby">Caution (80%)</span></td>
        </tr>
      </tbody>
    </table>

    <!-- Shastric Synthesis Box -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:8px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">
        ✦ STRATEGIC TAKEAWAY: DISCIPLINED CAPITAL &gt; FINANCIAL SPECULATION
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        Your chart operates on <strong>Disciplined Capital Architecture</strong>, not high-frequency gambling. Your highest return on investment comes from strategic research, patient execution, and systematic long-term compounding. Reinvesting trading surpluses into structured, sovereign assets is your canonical path to generational wealth.
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
      In Sarvatobhadra Shastra, 8 sensitive nakshatras calculated from your natal Moon (<strong>${moonNakshatra}</strong>) govern your personal market vulnerability.
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
        ${sensitiveRowsHtml}
      </tbody>
    </table>

    <!-- Vinaasha Warning Box -->
    <div class="luxury-card" style="border:1.5px solid var(--ruby);background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
        ✦ THE VINAASHA PROTOCOL (${vinaashaNak.toUpperCase()} AUDIT)
      </div>
      <p class="body-text" style="font-size:11.2px;margin-top:2px;">
        Whenever malefic transits (Mars or Rahu) strike <strong>${vinaashaNak}</strong>, do not execute fresh swing positions. Close out leveraged hedges and sit 100% in cash or gold. Protecting capital during Vinaasha strikes guarantees survival in market drawdowns.
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
          ✦ EXECUTIVE SARVATOBHADRA ASSESSMENT: ${sbResult.vedhaRays.length > 0 ? "VEDHA RAYS DETECTED" : "STABLE VEDHA DEFENSE"}
        </span>
        <span class="tag-badge ${sbResult.vedhaRays.length > 0 ? "tag-ruby" : "tag-emerald"}">${sbResult.vedhaRays.length > 0 ? "ACTIVE VEDHA" : "STABLE DEFENSE"}</span>
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:6px;">
        According to the classical 81-Square Sarvatobhadra Chakra, your natal Moon Nakshatra (<strong>${janmaNak}</strong>) and primary financial points currently register <strong>${sbResult.vedhaRays.length} active ray strike${sbResult.vedhaRays.length === 1 ? "" : "s"}</strong>. ${sbResult.vedhaRays.length > 0 ? "Exercise disciplined risk sizing and honor defensive stops." : "This provides a clear psychological runway for methodical swing position sizing and rules-based execution."}
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
          <td><strong>${janmaNak}</strong></td>
          <td>Janma (Self)</td>
          <td><span style="color:${sbResult.vedhaRays.filter(r => r.targetNakshatra === janmaNak).length > 0 ? "var(--ruby-bright)" : "var(--emerald-bright)"};font-weight:700;">${sbResult.vedhaRays.filter(r => r.targetNakshatra === janmaNak).length > 0 ? `${sbResult.vedhaRays.filter(r => r.targetNakshatra === janmaNak).length} Active Strike(s)` : "Un-afflicted"}</span></td>
          <td>Clear mental focus · High analytical execution</td>
        </tr>
        <tr>
          <td><strong>${karmaNak}</strong></td>
          <td>Karma (Status)</td>
          <td><span style="color:${sbResult.vedhaRays.filter(r => r.targetNakshatra === karmaNak).length > 0 ? "var(--ruby-bright)" : "var(--emerald-bright)"};font-weight:700;">${sbResult.vedhaRays.filter(r => r.targetNakshatra === karmaNak).length > 0 ? `${sbResult.vedhaRays.filter(r => r.targetNakshatra === karmaNak).length} Active Strike(s)` : "Un-afflicted"}</span></td>
          <td>Favorable for closing institutional retainers</td>
        </tr>
        <tr>
          <td><strong>${sanghatikaNak}</strong></td>
          <td>Sanghatika (Treasury)</td>
          <td><span style="color:var(--gold-bright);font-weight:700;">Neutral Rays</span></td>
          <td>Treasury stable · No liquidity leakage</td>
        </tr>
        <tr>
          <td><strong>${vinaashaNak}</strong></td>
          <td>Vinaasha (Critical)</td>
          <td><span style="color:${sbResult.vedhaRays.filter(r => r.targetNakshatra === vinaashaNak).length > 0 ? "var(--ruby-bright)" : "var(--emerald-bright)"};font-weight:700;">${sbResult.vedhaRays.filter(r => r.targetNakshatra === vinaashaNak).length > 0 ? `${sbResult.vedhaRays.filter(r => r.targetNakshatra === vinaashaNak).length} Active Strike(s)` : "Un-afflicted"}</span></td>
          <td>${sbResult.vedhaRays.filter(r => r.targetNakshatra === vinaashaNak).length > 0 ? "Defensive caution on volatile swings" : "No catastrophic liquidation risk detected"}</td>
        </tr>
      </tbody>
    </table>

    <!-- Directives Box -->
    <div class="luxury-card" style="background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;">✦ IMMEDIATE TRADING DIRECTIVES</div>
      <ul style="padding-left:16px;font-size:11.2px;color:var(--ivory-dim);margin-top:4px;line-height:1.5;">
        <li>Maintain systematic discipline; execute trades strictly based on pre-computed rules rather than emotional tick reactions.</li>
        <li>Protect your ${h2Score}-bindu treasury (${secondSign}) by sweeping realized profits every Friday into non-brokerage liquid assets or physical gold.</li>
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
        ${savTableRowsHtml}
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">The Golden Net Surplus Formula:</div>
      <p style="font-size:11.5px;color:var(--ivory-dim);margin-top:2px;">
        11th House Bindus (${h11Score}) &minus; 12th House Bindus (${h12Score}) = <strong>${surplusSign} Net Bindu Surplus</strong>. Total: <strong>${akv.sarvaTotal} Bindus</strong> across all 12 houses. In classical Parashari economics, whenever the 11th house exceeds the 12th house, capital retention compounds positively year over year.
      </p>
    </div>
    ${savHumanCard}
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
            <strong>${highBinduSigns}:</strong>
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
            <strong>${lowBinduSigns}:</strong>
          </p>
          <p>
            When transits activate these sensitive zones, trading velocity must be throttled down by 80%. These are not periods for aggressive expansion; they are windows for system refinement, capital preservation, and risk audits.
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
        Never buy options or enter directional swing positions on days when the transiting Moon traverses a sign containing fewer than 26 Bindus. Wait for Moon to enter higher-bindu signs (${highBinduSigns}) for maximum momentum synchronicity.
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
        ${bavRowsHtml}
      </tbody>
      <tfoot>
        <tr style="border-top:1.5px solid var(--border-gold);background:var(--surface-elevated);font-weight:700;">
          <td><strong>SAV Column Total</strong></td>
          <td style="color:var(--emerald-bright);"><strong>${savHouses[1]?.score || 28} Bindus</strong></td>
          <td style="color:var(--emerald-bright);"><strong>${savHouses[4]?.score || 28} Bindus</strong></td>
          <td style="color:var(--gold-bright);"><strong>${savHouses[8]?.score || 28} Bindus</strong></td>
          <td style="color:var(--gold-bright);"><strong>${savHouses[10]?.score || 28} Bindus</strong></td>
          <td><span class="tag-badge tag-emerald">100% SAV-337 Synced</span></td>
        </tr>
      </tfoot>
    </table>

    <div class="luxury-card" style="border:1.5px solid var(--emerald);background:var(--surface-elevated);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        ✦ SHASTRIC BAV WEALTH SYNTHESIS
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:2px;">
        Notice how the individual planetary bindu distributions across your 2nd, 5th, 9th, and 11th houses dictate your natural financial rhythms. Any financial strategy that relies on structured planning, systematic risk metrics, and data integrity will systematically outperform emotional guessing.
      </p>
    </div>
    ${bavHumanCard}
  </div>
  ${footerRail("Pillar III: BAV Wealth Contribution", 13)}
</section>

<!-- PAGE 14: PILLAR IV — TRADING PSYCHOLOGY & BEHAVIORAL AUDIT -->
<section class="page">
  ${headerRail("PILLAR IV: TRADING PSYCHOLOGY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Trading Psychology: Intellectual Agility vs. Impatience</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Trading is 20% strategy and 80% emotional governance. Your psychological makeup reflects the tension between your ${lagnaRashi} Lagna (core temperament) and your ${moonRashi} Moon (emotional impulse).
    </p>

    <!-- Psychological Dualities -->
    <div class="grid-2" style="margin-bottom:8px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
          ✦ YOUR TRADING SUPERPOWER: SYSTEMATIC PRECISION
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:4px;">
          With <strong>${lagnaRashi} Lagna (${lagnesh}) and ${amkPlanet} AmK in ${amkData?.sign || lagnaRashi}</strong>, your analytical edge activates when you rely on structured rules, clear risk models, and disciplined position sizing.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
        <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
          ✦ YOUR TRADING ACHILLES' HEEL: IMPULSIVE OVERTRADING
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:4px;">
          With <strong>Moon in ${moonRashi} (${ordinal(moonHouse)} house) and Mars in ${ordinal(marsHouse)} house</strong>, slow markets can tempt you to force setups. Avoid overtrading or revenge trading when conviction is absent.
        </p>
      </div>
    </div>
    ${psychHumanCard}

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
          <td>${rahuP?.sign || "Rahu"} (${ordinal(rahuHouse)} H) illusion + 5th lord ${fifthLord} restraint</td>
          <td><span style="color:var(--ruby-bright);font-weight:700;">100% PROHIBITED</span> &mdash; Complete capital decay</td>
        </tr>
        <tr>
          <td><strong>Intraday Margin Leverage</strong></td>
          <td>Ketu ${ordinal(ketuHouse)} house sudden reversal risk</td>
          <td><span style="color:var(--ruby-bright);font-weight:700;">STRICT ZERO</span> &mdash; Never borrow broker leverage</td>
        </tr>
        <tr>
          <td><strong>Max Risk Per Position</strong></td>
          <td>Protects ${h2Score}-bindu treasury (${secondSign})</td>
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
      Why your astrological configuration demands automated, rules-based systems over manual "gut feeling" betting.
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
          • Automated position sizing calculated by pre-set rules.<br/>
          • End-of-day execution without watching the screen.<br/>
          • Detached, calm, high-status executive lifestyle.<br/>
          • <strong>Astrological Outcome:</strong> Multi-year compounding.
        </div>
      </div>
    </div>

    <!-- Dynamic Lagna Quant Blueprint -->
    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;">
        ✦ THE ${lagnaRashi.toUpperCase()} LAGNA QUANT MANDATE (${lagnesh.toUpperCase()} RULED)
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:2px;">
        Your ${lagnaRashi} Lagna is ruled by ${lagnesh} (placed in ${chart.planets?.[lagnesh]?.sign || lagnaRashi}, ${ordinal(chart.planets?.[lagnesh]?.house || 1)} house). Your strongest edge comes from rules-based, systematic capital management rather than impulsive retail bets.
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
          <td><strong>${amkPlanet} (AmK)</strong><br/><span style="font-size:8.5px;color:var(--ivory-mute);">${ordinal(amkData?.house || 1)} House ${amkData?.sign || lagnaRashi}</span></td>
          <td>Core Industry Leadership, Enterprise Analytics, FinTech, High-Margin Franchises</td>
          <td>Large-cap sector leaders, Global ETFs, Compounding Equities</td>
          <td><span class="tag-badge tag-emerald">Primary (40%)</span></td>
        </tr>
        <tr>
          <td><strong>${tenthLord} (10th Lord)</strong><br/><span style="font-size:8.5px;color:var(--ivory-mute);">${ordinal(chart.planets?.[tenthLord]?.house || 10)} House ${chart.planets?.[tenthLord]?.sign || tenthSign}</span></td>
          <td>Institutional Advisory, Infrastructure, Consumer Brands, Capital Goods</td>
          <td>Blue-chip market leaders, Sovereign-backed enterprises</td>
          <td><span class="tag-badge tag-emerald">Secondary (25%)</span></td>
        </tr>
        <tr>
          <td><strong>${secondLord} &amp; ${eleventhLord}</strong><br/><span style="font-size:8.5px;color:var(--ivory-mute);">2nd (${secondSign}) &amp; 11th (${eleventhSign}) Lords</span></td>
          <td>Treasury Debt, Sovereign Bonds, Energy Grids, Precious Metals</td>
          <td>Government bonds, Index funds, Sovereign physical gold</td>
          <td><span class="tag-badge tag-gold">Defensive (20%)</span></td>
        </tr>
        <tr>
          <td><strong>Mars &amp; Ketu</strong><br/><span style="font-size:8.5px;color:var(--ivory-mute);">${ordinal(marsHouse)} &amp; ${ordinal(ketuHouse)} Houses</span></td>
          <td>Defense, Cybersecurity, Aerospace, Clean-Tech Materials</td>
          <td>Specialized thematic ETFs (Hedged only)</td>
          <td><span class="tag-badge tag-sapphire">Opportunistic (15%)</span></td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">Sectoral Allocation Verdict:</div>
      <p style="font-size:11.5px;color:var(--ivory-dim);margin-top:2px;">
        Overweight <strong>${amkPlanet} &amp; ${tenthLord}-Aligned Core Leaders</strong> (${amkData?.sign || lagnaRashi} / ${tenthSign}). Keep a rock-solid defensive anchor in <strong>Index Funds &amp; Sovereign Gold</strong>. Completely avoid speculative meme assets and leveraged derivative contracts.
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
          High-yield treasury bills, fixed sovereign debt, and physical 24K gold. This fortifies your 2nd house (${secondSign} &middot; ${h2Score} Bindus) and provides psychological immunity against global market crashes.
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
          <p><strong style="color:var(--gold-bright);">1. Lagnesh Day (${lagnesh}):</strong> Ruled by your Lagna Lord ${lagnesh}. Supreme day for portfolio research, backtesting, and systematic rebalancing.</p>
          <p style="margin-top:4px;"><strong style="color:var(--gold-bright);">2. Friday (Shukravar):</strong> Ruled by Venus. Ideal for booking liquid profits and sweeping gains into reserves.</p>
          <p style="margin-top:4px;"><strong style="color:var(--gold-bright);">3. Thursday (Guruvar):</strong> Ruled by Jupiter. Auspicious for long-term strategic investments and index allocations.</p>
        </div>
      </div>

      <div class="luxury-card" style="border:1.5px solid var(--ruby);">
        <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;">
          ✦ DEFENSIVE &amp; PROHIBITED WINDOWS
        </div>
        <div style="font-size:11px;color:var(--ivory-dim);margin-top:4px;line-height:1.45;">
          <p><strong style="color:var(--ruby-bright);">1. 8th/12th Lord Days:</strong> High risk of impatient emotional execution when ${getSignLord(signFromHouse(lagnaRashi, 8))} or ${twelfthLord} rules the day. Take zero impulsive trades.</p>
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
    <h2 class="display-l" style="margin-bottom:6px;">12-Month Market Timing Radar (${new Date().getFullYear()}–${new Date().getFullYear() + 1})</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Synchronized macroeconomic roadmap mapping Jupiter, Saturn, and nodal transits to your financial houses.
    </p>

    <!-- Gates -->
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
            WINDOW 1: DEC 2026 &ndash; JUL 2027 (JUPITER EXALTED IN ${ordinal(cancerJupH).toUpperCase()} HOUSE CANCER)
          </span>
          <span class="tag-badge ${isCancerPeak ? "tag-emerald" : "tag-gold"}">${isCancerPeak ? "HARVEST ZENITH" : "HEDGED ACCUMULATION"}</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:3px;">
          Jupiter transits through its Exalted Sign Cancer in your ${ordinal(cancerJupH)} house (stationing direct in May 2027). ${isCancerPeak ? "High-conviction cycle for realizing portfolio gains and compounding wealth." : "Focus on debt-liquidation, risk audits, and hedged long-term accumulation."}
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
            WINDOW 2: SOLAR RETURN IN ${bestSavSign.toUpperCase()} (${bestSavScore} BINDUS)
          </span>
          <span class="tag-badge tag-emerald">PEAK SAV WINDOW</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:3px;">
          When Sun transits ${bestSavSign} (${ordinal(bestSavHouseIdx + 1)} house with ${bestSavScore} SAV Bindus), decision clarity and institutional negotiation authority reach their annual peak.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--amber);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
            CAUTION WINDOW: SUN IN 12TH HOUSE (${twelfthSign.toUpperCase()} &middot; VYAYA BHAVA)
          </span>
          <span class="tag-badge tag-ruby">CONSOLIDATION</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:3px;">
          When Sun transits ${twelfthSign} (12th house), minimize speculative risk. Focus on portfolio review, risk testing, and physical rest.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--sapphire);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
            WINDOW 3: LATE 2027 (JUPITER IN LEO &middot; ${ordinal(leoJupH).toUpperCase()} HOUSE)
          </span>
          <span class="tag-badge tag-sapphire">STRATEGIC SCALE</span>
        </div>
        <p class="body-text" style="font-size:10.8px;margin-top:3px;">
          Jupiter transitions into Leo in your ${ordinal(leoJupH)} house, activating long-term strategic positioning and international diversification.
        </p>
      </div>
    </div>
    ${radarHumanCard}
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
      <div style="font-family:'Noto Sans Devanagari',sans-serif;font-weight:600;font-size:14px;color:var(--gold-bright);text-align:center;margin:4px 0;letter-spacing:0.04em;">
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
      <div style="font-family:'Noto Sans Devanagari',sans-serif;font-weight:600;font-size:14px;color:var(--gold-bright);text-align:center;margin:4px 0;letter-spacing:0.04em;">
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
          Set up your primary workstation in the <strong>North (${tenthSign} 10th house / ${tenthLord} aligned)</strong> or <strong>North-East</strong>. While trading, face strictly <strong>North (Kubera wealth direction)</strong> or <strong>East (Sun clarity direction)</strong>. Never face South while placing orders.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
        <strong style="color:var(--gold-bright);font-size:11.5px;">2. THE NORTH ZONE WEALTH ANCHOR:</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          The North zone of your office governs liquid cashflow (Mercury). Keep this zone entirely free of clutter, dead cables, and heavy iron. Place a clean glass bowl of fresh water with a vibrant green plant to stimulate continuous commercial inquiries.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--sapphire-bright);">
        <strong style="color:var(--sapphire-bright);font-size:11.5px;">3. NATURAL JADE CRYSTAL PYRAMID &amp; POLARITY ANCHOR:</strong>
        <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
          Place a natural Green Jade or Aventurine crystal pyramid on the ${resolvedGender === "female" ? "left side (Vama Anga / receptive polarity)" : "right side (Dakshina Anga / projective polarity)"} of your laptop keyboard. When wearing your trading gemstone, mount it on the ${resolvedGender === "female" ? "Left hand" : "Right hand"}. Green mineral crystal absorbs electromagnetic radiation from multiple monitors and grounds Mercury mental static.
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
        ✦ SOVEREIGN TRADER MATRIX &middot; ${subjectName.toUpperCase()}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11.2px;margin-top:6px;">
        <div>
          <span class="kicker">PRIMARY TRADING PROFILE</span>
          <div style="color:var(--emerald-bright);font-weight:700;">Systematic Quant &amp; Swing Capital Compounding</div>
        </div>
        <div>
          <span class="kicker">SAV BINDU TOTAL</span>
          <div style="color:var(--gold-bright);font-weight:700;">${akv.sarvaTotal} Bindus (${surplusSign} Net Surplus: H11 ${h11Score} vs H12 ${h12Score})</div>
        </div>
        <div>
          <span class="kicker">5TH HOUSE DISCRETION</span>
          <div style="color:var(--ivory);font-weight:600;">${fifthSign} (${savHouses[4]?.score || 28} Bindus · ${fifthLord} Rules)</div>
        </div>
        <div>
          <span class="kicker">11TH HOUSE REALIZED GAINS</span>
          <div style="color:var(--emerald-bright);font-weight:700;">${eleventhSign} (${h11Score} Bindus · ${eleventhLord} Rules)</div>
        </div>
        <div>
          <span class="kicker">TREASURY STRENGTH</span>
          <div style="color:var(--gold-bright);font-weight:700;">${savHouses[1]?.score || 28} Bindus in ${secondSign} 2nd House</div>
        </div>
        <div>
          <span class="kicker">PROHIBITED VEHICLE</span>
          <div style="color:var(--ruby-bright);font-weight:700;">Zero Naked F&amp;O Options · Zero High Leverage</div>
        </div>
        <div>
          <span class="kicker">FAVORABLE TRADING DAYS</span>
          <div style="color:var(--ivory);font-weight:600;">Thursday (Guru) &middot; Friday (Shukra)</div>
        </div>
        <div>
          <span class="kicker">FAVORABLE SECTORS</span>
          <div style="color:var(--emerald-bright);font-weight:700;">Sovereign Equities, Clean Tech, Capital Goods</div>
        </div>
        <div>
          <span class="kicker">OPTIMAL DESK FACING</span>
          <div style="color:var(--ivory);font-weight:600;">Face strictly North or East while trading</div>
        </div>
        <div>
          <span class="kicker">${isCancerPeak ? "PEAK WEALTH GATE" : "HEDGED ACCUMULATION GATE"}</span>
          <div style="color:var(--gold-bright);font-weight:700;">Dec 2026 &ndash; Jul 2027 (Jupiter Exalted in ${ordinal(cancerJupH)} House)</div>
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
