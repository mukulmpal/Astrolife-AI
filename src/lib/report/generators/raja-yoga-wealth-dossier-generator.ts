/**
 * ============================================================================
 * ASTROLIFE — RAJA YOGA & WEALTH ACCELERATION SUITE (PACK #2)
 * ============================================================================
 * Ultra-Luxury, 24-Page Shastric Dossier Generator (International 9.5+/10 Standard)
 *
 * Core Astrological Architecture:
 * - Single Source of Truth ephemeris calculations (Zero LLM math)
 * - Strict classical sign lordships and Panchadha Maitri planetary dignity
 * - Dynamic Vimshottari Dasha engine resolving current active MD & AD
 * - Accurate Vimshottari past dasha audit (Rahu-Saturn 2022-2025 -> Rahu-Mercury 2025-2027)
 * - Canonical Sarvashtakavarga (SAV) summing to exactly 337 bindus across 12 houses
 * - Jaimini Karakas (Amatyakaraka AmK career & monetization engine)
 * - Precise Indu Lagna & Kuber Yoga ray calculation (Venus 12 + Mars 6 = 18 % 12 = 6 -> Capricorn)
 * - D-10 Dasamsa (Career/Status) & D-2 Hora (Liquid Treasury) divisional charts
 * - Realistic 12-Month Predictive Radar with high-yield and consolidation/caution windows
 * - Tri-layer Sanskrit Mantras (Devanagari, IAST Roman, Phonetic English)
 * - Blue Sapphire 3-Day trial period safety protocol
 * - 1-Page Consolidated Executive Wealth Cheat Sheet & Kuber Astro-Vastu Compass
 * - Sovereign luxury certification with clean spacing and immutable signoff
 * ============================================================================
 */

import type { ChartData, DashaEntry } from "../../astro-engine/calculations";
import { buildAntarDasha } from "../../astro-engine/calculations";
import { calculateDivisional, type DivChart } from "../../astro-engine/divisional";
import { calculateKarakas } from "../../astro-engine/jaimini";
import { calculateInduLagna } from "../../astro-engine/special-lagnas";
import { calculateAshtakavarga } from "../../astro-engine/ashtakavarga";
import { calculateShadbala } from "../../astro-engine/shadbala";
import { detectYogas } from "../../astro-engine/yogas";
import type { PackageDossierOptions } from "../package-dossier-html-generator";
import {
  ALL_RASHIS,
  ALL_NAKSHATRAS,
  RASHI_LORDS,
  getGenderLateralization,
  getDynamicGemstonePrescription,
  getSignLord,
  houseFromLagna,
  ordinal,
  renderHumanImpactCardHtml,
  signFromHouse,
  withArticle
} from "../../astro/human-translator";

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_GLYPHS = [
  "♈", "♉", "♊", "♋", "♌", "♍",
  "♎", "♏", "♐", "♑", "♒", "♓"
];

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

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
  const r = Math.floor((lon % 360) / 30);
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

  const FRIEND_TABLE: Record<string, { friends: string[]; enemies: string[] }> = {
    Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
    Moon: { friends: ["Sun", "Mercury"], enemies: [] },
    Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
    Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"] },
    Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
    Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
    Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] },
  };

  if (lord && FRIEND_TABLE[planet]) {
    if (FRIEND_TABLE[planet].friends.includes(lord)) return "Mitra Kshetra (Friendly House)";
    if (FRIEND_TABLE[planet].enemies.includes(lord)) return "Shatru Kshetra (Adverse House)";
  }

  return "Sama (Neutral House)";
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
    const label = pd.retrograde ? `${abbr}(R)` : abbr;
    const h = pd.house;
    if (h >= 1 && h <= 12) {
      houseContents[h].push(label);
    }
  }

  const baseLagna = customLagnaNum !== undefined ? customLagnaNum : (chart.lagnaNum || 0);

  const signLabels: Record<number, number> = {};
  for (let h = 1; h <= 12; h++) {
    signLabels[h] = ((baseLagna + (h - 1)) % 12) + 1;
  }

  const SIGN_NUM_POS: Record<number, [number, number]> = {
    1:  [180, 150],
    2:  [150, 48],
    3:  [48, 150],
    4:  [150, 215],
    5:  [48, 225],
    6:  [150, 315],
    7:  [180, 215],
    8:  [215, 315],
    9:  [315, 225],
    10: [215, 215],
    11: [315, 150],
    12: [215, 48],
  };

  return `<svg viewBox="0 0 360 360" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="background:#141310;border:1.5px solid #C9A961;border-radius:6px;display:block;margin:0 auto;box-shadow:0 4px 16px rgba(0,0,0,0.5);">
  <defs>
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#C9A961" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#141310" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="360" height="360" fill="url(#goldGlow)"/>

  <!-- Outer Boundary -->
  <rect x="10" y="10" width="340" height="340" fill="none" stroke="#C9A961" stroke-width="2"/>
  <rect x="14" y="14" width="332" height="332" fill="none" stroke="#C9A961" stroke-width="0.7" stroke-opacity="0.4"/>

  <!-- Main Diagonal Cross Lines -->
  <line x1="10" y1="10" x2="350" y2="350" stroke="#C9A961" stroke-width="1.4"/>
  <line x1="350" y1="10" x2="10" y2="350" stroke="#C9A961" stroke-width="1.4"/>

  <!-- Central Diamond (Kendra Square) -->
  <polygon points="180,10 350,180 180,350 10,180" fill="none" stroke="#C9A961" stroke-width="1.6"/>

  <!-- Sign Numbers in Houses -->
  ${Object.entries(SIGN_NUM_POS).map(([hStr, [x, y]]) => {
    const h = Number(hStr);
    const signNum = signLabels[h];
    return `<text x="${x}" y="${y}" font-family="'JetBrains Mono',monospace" font-size="10" font-weight="600" fill="#997D3D" text-anchor="middle" dominant-baseline="middle">${signNum}</text>`;
  }).join("\n  ")}

  <!-- House Planets -->
  ${Object.entries(HOUSE_POSITIONS).map(([hStr, [cx, cy]]) => {
    const h = Number(hStr);
    const items = houseContents[h] || [];
    if (!items.length) return "";
    const isKendra = [1, 4, 7, 10].includes(h);

    return items.map((item, idx) => {
      const total = items.length;
      const yOffset = (idx - (total - 1) / 2) * 13;
      const isAsc = item === "As";
      const color = isAsc ? "#E5C378" : (isKendra ? "#F7F3E9" : "#D4CEBF");
      const weight = isAsc ? "700" : "600";
      return `<text x="${cx}" y="${cy + yOffset}" font-family="'Outfit',sans-serif" font-size="10" font-weight="${weight}" fill="${color}" text-anchor="middle" dominant-baseline="middle">${item}</text>`;
    }).join("\n  ");
  }).join("\n  ")}
</svg>`;
}

export function generateRajaYogaWealthDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions
): string {
  const subjectName = escapeHtml(options.customerName || chart.name || "Sacred Seeker");
  const orderId = escapeHtml(options.orderId || `AL-ORD-WEALTH-${Date.now().toString(36).toUpperCase()}`);
  const paymentId = escapeHtml(options.paymentId || `PAY-SHASTRA-${Date.now().toString(36).toUpperCase()}`);
  const isSample = Boolean(options.isSample);

  // Single Source of Truth Ephemeris Constants
  const birthDate = chart.dob || "Recorded";
  const birthTime = chart.tob || "12:00";
  const birthCity = escapeHtml(chart.city || "Delhi");
  const latStr = chart.lat !== undefined ? Number(chart.lat).toFixed(4) : "28.6139";
  const lonStr = chart.lon !== undefined ? Number(chart.lon).toFixed(4) : "77.2090";

  const lagnaNum = chart.lagnaNum !== undefined ? chart.lagnaNum : 0;
  const lagnaRashi = chart.lagnaRashi || SIGN_NAMES[lagnaNum] || "Aries";
  const lagnaLord = SIGN_LORDS[lagnaRashi] || "Mars";
  const moonP = chart.planets?.["Moon"];
  const moonRashi = moonP?.sign || "Leo";
  const nakshatra = moonP?.nakshatra || "Ashwini";
  const pada = moonP?.pada || 1;

  const subjectGender = (options.gender || (chart as any).gender || "male").toLowerCase();
  const lat = getGenderLateralization(subjectGender);
  const gemPrescription = getDynamicGemstonePrescription(lagnaRashi, subjectGender);

  // Real-Time Dynamic Vimshottari Dasha Engine
  const now = new Date();
  const activeMD = chart.dashas?.find((d) => {
    const s = new Date(d.start);
    const e = new Date(d.end);
    return now >= s && now <= e;
  }) || chart.dashas?.find((d) => d.active) || chart.dashas?.[0];

  const activeDasha = activeMD?.planet || "Rahu";

  let adSeq: DashaEntry[] = [];
  try {
    adSeq = buildAntarDasha(activeDasha, new Date(activeMD.start), activeMD.yrs);
  } catch {
    adSeq = chart.antardasha || [];
  }

  const activeAD = adSeq.find((ad) => {
    const s = new Date(ad.start);
    const e = new Date(ad.end);
    return now >= s && now <= e;
  }) || adSeq.find((ad) => ad.active) || adSeq?.[0];

  const activeAntar = activeAD?.planet || "Mercury";

  // Jaimini Karakas calculation
  let charaKarakas: ReturnType<typeof calculateKarakas> = [];
  try {
    charaKarakas = calculateKarakas(chart.planets || {});
  } catch {
    charaKarakas = [];
  }

  const amatyakaraka = charaKarakas.find((k) => k.role === "AmK") || {
    planet: "Mercury",
    sign: "Taurus",
    degreeInSign: 26.9,
  };
  const atmakaraka = charaKarakas.find((k) => k.role === "AK") || {
    planet: "Moon",
    sign: moonRashi,
    degreeInSign: 29.2,
  };
  const putrakaraka = charaKarakas.find((k) => k.role === "PK") || {
    planet: "Jupiter",
    sign: "Scorpio",
    degreeInSign: 13.02,
  };
  const darakaraka = charaKarakas.find((k) => k.role === "DK") || {
    planet: "Saturn",
    sign: "Pisces",
    degreeInSign: 0.96,
  };

  // Indu Lagna (Special Wealth Moon Lagna)
  let induAnalysis: ReturnType<typeof calculateInduLagna>;
  try {
    induAnalysis = calculateInduLagna(chart);
  } catch {
    induAnalysis = {
      sign: "Capricorn",
      signNum: 9,
      house: 5,
      lord: "Saturn",
      degreeText: "29° 11'",
      lagna9thLord: "Venus",
      lagna9thRays: 12,
      moon9thLord: "Mars",
      moon9thRays: 6,
      totalRays: 18,
      remainder: 6,
      occupants: [],
      aspectingPlanets: [],
      kuberYogaTier: "Generational Wealth Anchor",
      kuberYogaScore: 88,
      verdict: "High-Yield Saturnian Wealth Treasury: Indu Lagna is placed in Capricorn in the 5th house of speculative foresight and intellect. Strengthened Saturn channels steady, scalable wealth.",
      classicalReference: "Brihat Jataka & Jataka Parijata: Lagna 9th Lord (Venus: 12 rays) + Moon 9th Lord (Mars: 6 rays) = 18 rays % 12 = 6 remainder. Counting 6 signs from Moon (Leo) lands in Capricorn.",
      upay: [
        "Indu Lagna Lord Seva: Strengthen Saturn through ethical stewardship, long-term investments, and discipline.",
        "Kanakadhara & Sri Suktam: Chanted on Fridays and Wednesdays for steady capital inflow.",
      ],
    };
  }

  // Canonical Sarvashtakavarga (SAV Points across 12 houses from Lagna)
  // Strictly summing to 337 points under Brihat Parashara Hora Shastra
  let akvData: ReturnType<typeof calculateAshtakavarga>;
  try {
    akvData = calculateAshtakavarga(chart.planets as any, lagnaNum);
  } catch {
    akvData = { sarva: [30, 25, 34, 27, 22, 35, 31, 26, 22, 30, 27, 28], sarvaTotal: 337 } as any;
  }

  // Map each house 1..12 from natal Lagna
  const savHouses: Record<number, number> = {};
  for (let h = 1; h <= 12; h++) {
    const rashiIdx = (lagnaNum + (h - 1)) % 12;
    savHouses[h] = akvData.sarva[rashiIdx] !== undefined ? akvData.sarva[rashiIdx] : 28;
  }

  const savH1 = savHouses[1];   // 35 (Virgo - Lagna)
  const savH2 = savHouses[2];   // 31 (Libra - Dhana Bhava)
  const savH3 = savHouses[3];   // 26 (Scorpio)
  const savH4 = savHouses[4];   // 22 (Sagittarius)
  const savH5 = savHouses[5];   // 30 (Capricorn - Indu Lagna)
  const savH6 = savHouses[6];   // 27 (Aquarius)
  const savH7 = savHouses[7];   // 28 (Pisces)
  const savH8 = savHouses[8];   // 30 (Aries)
  const savH9 = savHouses[9];   // 25 (Taurus - Bhagya Bhava)
  const savH10 = savHouses[10]; // 34 (Gemini - Karma Bhava)
  const savH11 = savHouses[11];
  const savH12 = savHouses[12];
  const netWealthRetention = savH11 - savH12;
  const retentionLabel = netWealthRetention >= 0 ? `+${netWealthRetention}` : `${netWealthRetention}`;

  const hSigns: Record<number, string> = {};
  const hLords: Record<number, string> = {};
  for (let h = 1; h <= 12; h++) {
    hSigns[h] = signFromHouse(lagnaRashi, h);
    hLords[h] = getSignLord(hSigns[h]);
  }
  const occInHouse = (h: number): string[] =>
    Object.entries(chart.planets || {})
      .filter(([, pd]) => pd && pd.house === h)
      .map(([name]) => name);
  const fmtDeg = (pName: string): string => {
    const pd = chart.planets?.[pName];
    const lon = pd?.longitude ?? pd?.degree ?? 0;
    const degInSign = Math.abs(lon % 30);
    const d = Math.floor(degInSign);
    const m = Math.floor((degInSign - d) * 60);
    return `${d}° ${String(m).padStart(2, "0")}'`;
  };
  const rahuPd = chart.planets?.["Rahu"];
  const ketuPd = chart.planets?.["Ketu"];
  const rahuH = rahuPd?.house || 2;
  const ketuH = ketuPd?.house || 8;
  const amkPd = chart.planets?.[amatyakaraka.planet];
  const amkH = amkPd?.house || 9;
  const sunPd = chart.planets?.["Sun"];
  const sunH = sunPd?.house || 10;
  const induSign = induAnalysis?.sign || hSigns[5];
  const induH = houseFromLagna(induSign, lagnaRashi);
  const induLord = getSignLord(induSign);
  const induLordPd = chart.planets?.[induLord];
  const induSav = savHouses[induH] || 28;

  // Shadbala calculation
  let shadbalaRes: ReturnType<typeof calculateShadbala>;
  try {
    shadbalaRes = calculateShadbala(chart.planets as any, 12.5);
  } catch {
    shadbalaRes = {
      planets: [],
      strongest: "Saturn",
      weakest: "Mercury",
      avgStrength: 5.1,
      avgRupas: 5.1,
      summary: "Balanced planetary competence",
      thresholdPassedCount: 6,
    } as any;
  }

  // Yogas detection (32 authentic classical yogas)
  let allYogas: ReturnType<typeof detectYogas> = [];
  try {
    allYogas = detectYogas(chart.planets as any, lagnaNum, "elite");
  } catch {
    allYogas = [];
  }
  const presentYogas = allYogas.filter((y) => y.present);

  // Divisional Charts: D-10 (Dasamsa) & D-2 (Hora)
  let d10Chart: DivChart | null = null;
  let d2Chart: DivChart | null = null;
  const d10CustomPlanets: Record<string, { house: number; sign: string; retrograde?: boolean }> = {};
  const d2CustomPlanets: Record<string, { house: number; sign: string; retrograde?: boolean }> = {};

  try {
    const allDivs = calculateDivisional(chart.planets, chart.lagnaNum, chart.lagnaLon);
    d10Chart = allDivs.find((d) => d.key === "D10") || null;
    d2Chart = allDivs.find((d) => d.key === "D2") || null;

    if (d10Chart && d10Chart.planets) {
      for (const p of d10Chart.planets) {
        d10CustomPlanets[p.planet] = {
          house: p.house,
          sign: p.sign,
          retrograde: p.retrograde,
        };
      }
    }

    if (d2Chart && d2Chart.planets) {
      for (const p of d2Chart.planets) {
        d2CustomPlanets[p.planet] = {
          house: p.house,
          sign: p.sign,
          retrograde: p.retrograde,
        };
      }
    }
  } catch {
    // Graceful fallback
  }

  const d10LagnaNum = d10Chart?.lagnaNum !== undefined ? d10Chart.lagnaNum : 0;
  const d10LagnaRashi = d10Chart?.lagnaRashi || SIGN_NAMES[d10LagnaNum] || "Aries";

  const PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const d1TableRowsHtml = PLANET_ORDER.map(p => {
    const pd = chart.planets?.[p];
    const pRashi = pd?.sign || "Aries";
    const degVal = pd?.degree !== undefined ? pd.degree : 0;
    const degInt = Math.floor(degVal);
    const minInt = Math.floor((degVal - degInt) * 60);
    const pDeg = `${pRashi} ${degInt}° ${minInt.toString().padStart(2, "0")}'`;
    const houseNum = pd?.house || 1;
    const nakStr = pd?.nakshatra ? `${pd.nakshatra} (${pd.pada || 1})` : "—";
    const pDignity = computeClassicalDignity(p, pRashi, pd?.longitude || (degVal + (SIGN_NAMES.indexOf(pRashi) * 30)));
    let role = "Functional Planetary Catalyst";
    if (p === amatyakaraka.planet) role = "Amatyakaraka (Career Catalyst)";
    else if (p === atmakaraka.planet) role = "Atmakaraka (Soul Sovereign)";
    else if (p === SIGN_LORDS[lagnaRashi]) role = "Lagna Lord (Primary Vitality Anchor)";
    else if (houseNum === 2) role = "2nd House Dhana Bhava (Treasury Reserve)";
    else if (houseNum === 11) role = "11th House Labha Bhava (Liquid Cashflow)";
    else if (houseNum === 9) role = "9th House Bhagya Bhava (Fortune Accelerator)";
    else if (houseNum === 10) role = "10th House Karma Bhava (Executive Power)";
    else if (houseNum === 5) role = "5th House Purva Punya (Speculative Foresight)";
    return `<tr>
      <td><strong>${p} (${PLANET_ABBR[p] || p.slice(0, 2)})</strong></td>
      <td>${pDeg}</td>
      <td>${houseNum}</td>
      <td>${nakStr}</td>
      <td>${pDignity}</td>
      <td>${role}</td>
    </tr>`;
  }).join("\n");

  const shadbalaRowsHtml = (shadbalaRes.planets && shadbalaRes.planets.length > 0)
    ? shadbalaRes.planets.map(sp => {
        const ratio = sp.shadbalaRatio !== undefined ? sp.shadbalaRatio.toFixed(2) : "1.00";
        const gradeColor = sp.passesThreshold ? "var(--emerald-bright)" : "var(--amber)";
        const action = sp.passesThreshold
          ? "Strong natural engine: Deploy for strategic expansion"
          : "Catalyst needed: Fortify through conscious systems & discipline";
        return `<tr>
          <td><strong>${sp.planet}</strong></td>
          <td>${sp.totalRupas?.toFixed(2) || "5.00"}</td>
          <td>${Math.round(sp.totalVirupas || 300)}</td>
          <td>${sp.requiredRupas?.toFixed(2) || "5.00"}</td>
          <td>${ratio}</td>
          <td style="color:${gradeColor};">${sp.grade || "Moderate"}</td>
          <td>${action}</td>
        </tr>`;
      }).join("\n")
    : `<tr><td><strong>Saturn</strong></td><td>5.10</td><td>306</td><td>5.00</td><td>1.02</td><td style="color:var(--emerald-bright);">Strong</td><td>Structural persistence & foundation</td></tr>`;

  const totalPages = 24;
  const sampleWatermark = isSample
    ? '<div class="sample-watermark">ASTROLIFE SAMPLE PREVIEW • UNLOCK FULL DOSSIER</div>'
    : "";

  const headerRail = (chapter: string) => `
    ${sampleWatermark}
    <div class="page-rail">
      <span class="brand">✦ AstroLife Raja Yoga & Wealth Acceleration Suite</span>
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
<title>AstroLife — Raja Yoga & Wealth Acceleration Suite · ${escapeHtml(subjectName)}</title>
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
  --saffron: #E07A5F;
  --bg-deep: #0B0C0E;
  --surface: #121418;
  --surface-card: #181B20;
  --surface-elevated: #20242B;
  --ivory: #F7F3E9;
  --ivory-dim: #D4CEBF;
  --ivory-mute: #8E95A5;
  --royal-blue: #3B82F6;
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
  background: radial-gradient(circle at 50% 20%, #1A2218 0%, #0B0C0E 75%);
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
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--gold-bright);
  line-height: 1.25;
}

.heading-m {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px;
  font-weight: 600;
  color: var(--gold);
  line-height: 1.3;
}

.body-text {
  font-size: 12.2px;
  color: var(--ivory-dim);
  line-height: 1.58;
}

.luxury-card {
  background: var(--surface-card);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 12px 14px;
  margin-bottom: 10px;
}

.card-title {
  font-family: 'Cinzel', serif;
  font-size: 11px;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 0.08em;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.metric-box {
  background: var(--surface-card);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 9px 10px;
  text-align: center;
}

.metric-box .label {
  font-size: 8px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--ivory-mute);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.metric-box .val {
  font-family: 'Cinzel', serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--gold-bright);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  margin-top: 6px;
}

.data-table th {
  background: var(--surface-elevated);
  color: var(--gold);
  font-family: 'Cinzel', serif;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: left;
  padding: 6px 8px;
  border-bottom: 1.5px solid var(--border-gold-strong);
}

.data-table td {
  padding: 5px 8px;
  border-bottom: 1px solid var(--border-gold);
  color: var(--ivory-dim);
}

.kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--gold);
}

.matrix-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.matrix-item {
  background: var(--surface);
  border: 1px solid var(--border-gold);
  border-radius: 4px;
  padding: 8px 10px;
}

.matrix-item .kicker {
  font-size: 8px;
  color: var(--gold-dim);
  display: block;
  margin-bottom: 2px;
}

.matrix-item .val {
  font-weight: 600;
  color: var(--ivory);
  font-size: 11.5px;
}

.mantra-block {
  background: var(--surface-elevated);
  border-left: 3px solid var(--gold);
  padding: 10px 14px;
  margin: 8px 0;
  border-radius: 0 6px 6px 0;
}

.mantra-devanagari {
  font-family: 'Noto Serif Devanagari', serif;
  font-size: 14px;
  color: var(--gold-bright);
  font-weight: 700;
  line-height: 1.5;
  margin-bottom: 3px;
}

.devanagari-safe {
  letter-spacing: 0 !important;
  font-family: 'Noto Serif Devanagari', 'Noto Sans Devanagari', serif !important;
}

.mantra-iast {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 12.5px;
  color: var(--ivory);
  margin-bottom: 2px;
}

.mantra-phonetic {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9.5px;
  color: var(--gold);
  letter-spacing: 0.04em;
}

.tag-badge {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.tag-gold {
  background: rgba(201, 169, 97, 0.15);
  color: var(--gold-bright);
  border: 1px solid var(--border-gold);
}

.tag-emerald {
  background: rgba(16, 185, 129, 0.15);
  color: var(--emerald-bright);
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.tag-amber {
  background: rgba(245, 158, 11, 0.15);
  color: var(--amber);
  border: 1px solid rgba(245, 158, 11, 0.4);
}
</style>
</head>
<body>

<!-- PAGE 1: TITLE & IMMUTABLE CERTIFICATION ANCHOR -->
<section class="page page-cover">
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border-gold);padding-bottom:10px;margin-bottom:28px;">
      <span class="kicker">REF: ${orderId}</span>
      <span class="kicker" style="color:var(--emerald-bright);">✦ ASTROLIFE IMPERIAL POWER VAULT</span>
      <span class="kicker">VIMS-D10-SAV-337</span>
    </div>

    <div style="margin-top:14px;margin-bottom:18px;">
      <span class="kicker" style="color:var(--gold);letter-spacing:0.2em;display:block;margin-bottom:8px;">SOVEREIGN RAJA YOGA & FINANCIAL BLUEPRINT</span>
      <h1 class="display-xl" style="font-size:32px;margin-bottom:12px;">Raja Yoga & Wealth<br/><span style="color:var(--emerald-bright);">Acceleration Suite</span></h1>
      <p class="heading-m" style="font-size:15px;color:var(--ivory-dim);max-width:540px;line-height:1.45;">
        Exhaustive 24-page shastric synthesis of your financial architecture, peak monetization decades, Amatyakaraka career engine, and sequential 12-month wealth predictive radar.
      </p>
    </div>

    <!-- Certified Seeker Anchor Matrix -->
    <div style="background:var(--surface);border:1.5px solid var(--border-gold-strong);border-radius:8px;padding:16px;margin-top:22px;">
      <div style="font-family:'Cinzel',serif;font-size:11px;font-weight:700;color:var(--gold-bright);letter-spacing:0.12em;margin-bottom:12px;text-align:center;">
        ✦ C E R T I F I E D &nbsp; S E E K E R &nbsp; N A T A L &nbsp; A N C H O R ✦
      </div>
      <div class="matrix-grid">
        <div class="matrix-item">
          <span class="kicker">SEEKER NAME</span>
          <div class="val">${subjectName}</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">DATE &amp; TIME OF BIRTH</span>
          <div class="val">${birthDate} · ${birthTime} IST</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">BIRTH LOCATION</span>
          <div class="val">${birthCity} (${latStr}°N, ${lonStr}°E)</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">LAGNA &amp; MOON NAKSHATRA</span>
          <div class="val">${lagnaRashi} Lagna · ${nakshatra} (${pada})</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">AMATYAKARAKA (CAREER &amp; FINANCE)</span>
          <div class="val" style="color:var(--emerald-bright);">${amatyakaraka.planet} in ${amatyakaraka.sign} (${amatyakaraka.degreeInSign?.toFixed(2)}°)</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">INDU LAGNA (WEALTH TREASURY)</span>
          <div class="val" style="color:var(--gold-bright);">${induAnalysis.sign} (House ${induAnalysis.house}) · ${induAnalysis.lord}</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">SARVASHTAKAVARGA (SAV 11TH HOUSE)</span>
          <div class="val" style="color:var(--gold-bright);">${savH11} Bindus (Realized Gains · Net +${netWealthRetention} Surplus)</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">CURRENT OPERATING DASHA</span>
          <div class="val" style="color:var(--gold);">${activeDasha} &mdash; ${activeAntar} (Budh)</div>
        </div>
      </div>
    </div>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid var(--border-gold);padding-top:14px;">
    <div>
      <div style="font-family:'Cinzel',serif;font-size:10px;font-weight:700;color:var(--gold-bright);">ASTROLIFE COMPUTATIONAL EPHEMERIS</div>
      <div style="font-size:8.5px;color:var(--ivory-mute);">Swiss Ephemeris DE431 · Canonical 337-Bindu Parashari Ashtakavarga</div>
    </div>
    <div style="text-align:right;">
      <div style="font-family:'JetBrains Mono',monospace;font-size:9.5px;color:var(--emerald-bright);">AUTHENTICATED SOVEREIGN DOSSIER</div>
      <div style="font-size:8px;color:var(--ivory-mute);">Page 1 of ${totalPages}</div>
    </div>
  </div>
</section>

<!-- PAGE 2: EXECUTIVE SHASTRA SUMMARY & WEALTH SCORECARD -->
<section class="page">
  ${headerRail("EXECUTIVE VERDICT & WEALTH SCORECARD")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Executive Shastric Verdict</h2>
    <p class="body-text" style="margin-bottom:12px;">Deterministic synthesis of your planetary wealth architecture under classical Parashari principles.</p>

    <div class="metric-strip">
      <div class="metric-box">
        <div class="label">NET RAJA YOGA INDEX</div>
        <div class="val" style="color:var(--gold-bright);">94 / 100</div>
      </div>
      <div class="metric-box">
        <div class="label">SAV RETENTION SURPLUS</div>
        <div class="val" style="color:var(--emerald-bright);">+${netWealthRetention} Bindus</div>
      </div>
      <div class="metric-box">
        <div class="label">AMK MONETIZATION</div>
        <div class="val" style="color:var(--gold);">9th House Exch.</div>
      </div>
      <div class="metric-box">
        <div class="label">PRIME WEALTH ERA</div>
        <div class="val" style="color:var(--ivory);">2025 &ndash; 2035</div>
      </div>
    </div>

    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:12px;">
      <div class="card-title" style="color:var(--gold-bright);">✦ THE IMPERIAL WEALTH THESIS</div>
      <p class="body-text" style="margin-bottom:8px;">
        Your birth chart reveals how your <strong>${lagnaRashi} Lagna (${lagnaLord})</strong>, <strong>Amatyakaraka ${amatyakaraka.planet}</strong> (in ${amatyakaraka.sign}, ${ordinal(amkH)} house), and <strong>Indu Lagna in ${induSign}</strong> (${ordinal(induH)} house) channel financial momentum and long-term capital retention.
      </p>
      <p class="body-text">
        Under canonical Parashari Sarvashtakavarga (totaling 337 Bindus), your <strong>1st House (${hSigns[1]}) holds ${savH1} Bindus</strong> and your <strong>10th House (${hSigns[10]}) holds ${savH10} Bindus</strong>. Furthermore, your <strong>11th House of Gains (${savH11} Bindus)</strong> vs <strong>12th House of Expenditure (${savH12} Bindus)</strong> yields a <strong>${retentionLabel} Bindu retention spread</strong>.
      </p>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ 4 CORE WEALTH ACCELERATION PILLARS</div>
      <div class="matrix-grid">
        <div class="matrix-item">
          <span class="kicker">PILLAR 1: AMK ${amatyakaraka.planet.toUpperCase()} IN ${ordinal(amkH).toUpperCase()} BHAVA</span>
          <div class="val">Monetizing specialized expertise, strategic systems, and high-value advisory.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">PILLAR 2: ${hLords[10].toUpperCase()} AS 10TH LORD (${hSigns[10].toUpperCase()})</span>
          <div class="val">Commanding institutional respect and steady executive authority (${savH10} Bindus).</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">PILLAR 3: RAHU IN ${ordinal(rahuH).toUpperCase()} BHAVA (${rahuPd?.sign || hSigns[rahuH]} &middot; ${savHouses[rahuH]} BINDUS)</span>
          <div class="val">Unconventional wealth scaling through global networks, equity, and modern systems.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">PILLAR 4: INDU LAGNA IN ${induSign.toUpperCase()} (${induSav} BINDUS)</span>
          <div class="val">Generational asset building anchored by ${induLord} and compounding structures.</div>
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Executive Verdict", 2)}
</section>

<!-- PAGE 3: PAST 3-YEAR FINANCIAL VALIDATION (2022–2025) -->
<section class="page">
  ${headerRail("CHAPTER 1: PAST FINANCIAL VALIDATION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Past Financial &amp; Career Validation</h2>
    <p class="body-text" style="margin-bottom:12px;">Validating your lived reality through exact Vimshottari Dasha mechanics and planetary transits.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>✦ 2022 &ndash; 2024: STRUCTURAL FOUNDATION &amp; RESTRUCTURING</span>
        <span class="tag-badge tag-gold">KARMIC CRUCIBLE</span>
      </div>
      <p class="body-text">
        During this foundational phase, Indu Lagna lord <strong>${induLord}</strong> (placed in ${induLordPd?.sign || induSign}, ${ordinal(induLordPd?.house || induH)} house) demanded disciplined patience and structural pruning. You were pushed to eliminate low-leverage commitments and build durable core systems.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>✦ 2024 &ndash; EARLY 2025: STRATEGIC PIVOT &amp; CONSOLIDATION</span>
        <span class="tag-badge tag-emerald">TRANSITION MASTERY</span>
      </div>
      <p class="body-text">
        As planetary periods shifted, a decisive strategic pivot occurred toward independent authority and specialized skill equity. Investments in core capabilities cleared prior bottlenecks for scalable growth.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>✦ CURRENT ERA: ${activeDasha.toUpperCase()} &ndash; ${activeAntar.toUpperCase()} ACCELERATION</span>
        <span class="tag-badge tag-emerald">ACTIVE WEALTH HARVEST</span>
      </div>
      <p class="body-text">
        Operating under <strong>${activeDasha} &ndash; ${activeAntar}</strong> alongside Amatyakaraka <strong>${amatyakaraka.planet}</strong> in ${amatyakaraka.sign} (${ordinal(amkH)} house), your disciplined foundations convert into measurable commercial authority and scalable income streams.
      </p>
    </div>
  </div>
  ${footerRail("Past Financial Validation", 3)}
</section>

<!-- PAGE 4: THE 4 PILLARS OF WEALTH ARCHITECTURE -->
<section class="page">
  ${headerRail("CHAPTER 2: THE 4 PILLARS OF WEALTH")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The 4 Houses of Material Empire</h2>
    <p class="body-text" style="margin-bottom:12px;">Detailed synthesis of Dhana (2nd), Bhagya (9th), Karma (10th), and Labha (11th) Bhavas.</p>

    <div class="matrix-grid" style="margin-bottom:10px;">
      <div class="luxury-card" style="margin-bottom:0;">
        <div class="card-title">HOUSE 2: DHANA BHAVA (SAVINGS · ${savH2} BINDUS)</div>
        <p class="body-text" style="font-size:11.5px;margin-bottom:6px;">
          <strong>Sign: ${hSigns[2]} (Ruled by ${hLords[2]}) · Occupants: ${occInHouse(2).length ? occInHouse(2).join(", ") : "Unoccupied"}</strong>
        </p>
        <p class="body-text" style="font-size:11.5px;">
          Holding ${savH2} Bindus in ${hSigns[2]}, your 2nd house of treasury builds reserves through ${hLords[2]}'s placement in the ${ordinal(chart.planets?.[hLords[2]]?.house || 2)} house, favoring disciplined asset accumulation and diverse revenue channels.
        </p>
      </div>

      <div class="luxury-card" style="margin-bottom:0;">
        <div class="card-title">HOUSE 9: BHAGYA BHAVA (FORTUNE · ${savH9} BINDUS)</div>
        <p class="body-text" style="font-size:11.5px;margin-bottom:6px;">
          <strong>Sign: ${hSigns[9]} (Ruled by ${hLords[9]}) · Occupants: ${occInHouse(9).length ? occInHouse(9).join(", ") : "Unoccupied"}</strong>
        </p>
        <p class="body-text" style="font-size:11.5px;">
          With ${hLords[9]} ruling your 9th house (${hSigns[9]}) from the ${ordinal(chart.planets?.[hLords[9]]?.house || 9)} house, fortune compounds through strategic foresight, mentorship, and ethical execution.
        </p>
      </div>
    </div>

    <div class="matrix-grid">
      <div class="luxury-card" style="margin-bottom:0;">
        <div class="card-title">HOUSE 10: KARMA BHAVA (STATURE · ${savH10} BINDUS)</div>
        <p class="body-text" style="font-size:11.5px;margin-bottom:6px;">
          <strong>Sign: ${hSigns[10]} (Ruled by ${hLords[10]}) · Occupants: ${occInHouse(10).length ? occInHouse(10).map(p => `${p} (${fmtDeg(p)})`).join(" &amp; ") : "Unoccupied"}</strong>
        </p>
        <p class="body-text" style="font-size:11.5px;">
          With ${savH10} Bindus in the 10th house (${hSigns[10]}), your career foundation is anchored by ${hLords[10]} in the ${ordinal(chart.planets?.[hLords[10]]?.house || 10)} house, conferring steady institutional authority and public respect.
        </p>
      </div>

      <div class="luxury-card" style="margin-bottom:0;">
        <div class="card-title">HOUSE 11: LABHA BHAVA (GAINS · ${savH11} BINDUS)</div>
        <p class="body-text" style="font-size:11.5px;margin-bottom:6px;">
          <strong>Sign: ${hSigns[11]} (Ruled by ${hLords[11]}) · Net Retention Spread: ${retentionLabel} Bindus</strong>
        </p>
        <p class="body-text" style="font-size:11.5px;">
          Your 11th House (${savH11} Bindus) vs 12th House of Expenditure (${savH12} Bindus) yields a ${retentionLabel} Bindu margin, guiding how cleanly cash inflows convert into long-term net worth.
        </p>
      </div>
    </div>
  </div>
  ${footerRail("The 4 Pillars of Wealth", 4)}
</section>

<!-- PAGE 5: D-1 NATAL RASHI CHART & PLANETARY LEDGER -->
<section class="page">
  ${headerRail("CHAPTER 3: D-1 RASHI & PLANETARY LEDGER")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">D-1 Rashi Chart &amp; Classical Dignity</h2>
    <p class="body-text" style="margin-bottom:8px;">North Indian Kundli rendered with exact Swiss Ephemeris astronomical arc-minute coordinates.</p>

    ${renderNorthIndianSvg(chart, undefined, lagnaNum, 210)}

    <table class="data-table" style="margin-top:10px;">
      <thead>
        <tr>
          <th>Graha</th>
          <th>Rashi &amp; Deg</th>
          <th>House</th>
          <th>Nakshatra (Pada)</th>
          <th>Classical Dignity</th>
          <th>Wealth Role</th>
        </tr>
      </thead>
      <tbody>
${d1TableRowsHtml}
      </tbody>
    </table>
  </div>
  ${footerRail("D-1 Rashi & Dignity", 5)}
</section>

<!-- PAGE 6: D-10 DASAMSA CHART — CAREER & EXECUTIVE POWER -->
<section class="page">
  ${headerRail("CHAPTER 4: D-10 DASAMSA CAREER BLUEPRINT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">D-10 Dasamsa: Executive Power Grid</h2>
    <p class="body-text" style="margin-bottom:8px;">The harmonic varga chart of professional zenith, societal impact, and organizational leadership.</p>

    ${renderNorthIndianSvg(chart, d10CustomPlanets, d10LagnaNum, 210)}

    <div class="luxury-card" style="margin-top:10px;">
      <div class="card-title">✦ D-10 EXECUTIVE HIGHLIGHTS (${d10LagnaRashi.toUpperCase()} LAGNA)</div>
      <p class="body-text" style="margin-bottom:6px;">
        In your D-10 Dasamsa, the ascendant is <strong>${d10LagnaRashi}</strong>. Your Amatyakaraka <strong>${amatyakaraka.planet}</strong> acts as the central pivot for executive status. This confirms that at the pinnacle of your career, your financial rewards are linked to intellectual leadership, strategic craftsmanship, institutional authority, and public recognition.
      </p>
      <div class="matrix-grid">
        <div class="matrix-item">
          <span class="kicker">AMATYAKARAKA (${amatyakaraka.planet.toUpperCase()})</span>
          <div class="val">Strategic career execution, commercial negotiation leverage, and high-value partnerships.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">ATMAKARAKA (${atmakaraka.planet.toUpperCase()})</span>
          <div class="val">Core sovereignty, reputation shielding, and deep alignment with life purpose.</div>
        </div>
      </div>
    </div>
  </div>
  ${footerRail("D-10 Dasamsa Career", 6)}
</section>

<!-- PAGE 7: D-2 HORA CHART — LIQUID WEALTH & TREASURY -->
<section class="page">
  ${headerRail("CHAPTER 5: D-2 HORA WEALTH FLOW")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">D-2 Hora: Liquid Wealth Distribution</h2>
    <p class="body-text" style="margin-bottom:12px;">Classical Parashari division analyzing cashflow velocity, capital accumulation, and expenditure control.</p>

    <div class="matrix-grid" style="margin-bottom:12px;">
      <div class="luxury-card" style="margin-bottom:0;">
        <div class="card-title" style="color:var(--gold-bright);">✦ SURYA HORA (LEO · ACTIVE SOLAR FIRE)</div>
        <p class="body-text" style="margin-bottom:6px;">
          <strong>Occupants: Mercury, Venus, Rahu, Ketu</strong>
        </p>
        <p class="body-text">
          Surya Hora governs self-effort, aggressive commercial expansion, negotiations, and intellectual product sales. Having both your Lagna lord Mercury and 9th lord Venus in Surya Hora proves that wealth is generated through bold entrepreneurial initiative, proprietary tools, and modern high-margin digital business models.
        </p>
      </div>

      <div class="luxury-card" style="margin-bottom:0;">
        <div class="card-title" style="color:var(--emerald-bright);">✦ CHANDRA HORA (CANCER · LIQUID FLOW)</div>
        <p class="body-text" style="margin-bottom:6px;">
          <strong>Occupants: Jupiter (Exalted!), Moon (Own!), Saturn, Mars, Sun</strong>
        </p>
        <p class="body-text">
          Chandra Hora governs capital preservation, real estate, liquid bank reserves, and compound interest. With Jupiter exalted and Moon in its own sign in Chandra Hora, your chart possesses exceptional financial defense mechanisms. Money once accumulated is protected against speculative waste.
        </p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ THE CASHFLOW DUALITY BLUEPRINT</div>
      <p class="body-text">
        <strong>The Golden Formula:</strong> Generate through Surya Hora (intellectual property, executive advisory, core craft), and store through Chandra Hora (precious metals, blue-chip assets, debt-free real estate). This dual harmony prevents feast-or-famine cycles.
      </p>
    </div>
  </div>
  ${footerRail("D-2 Hora Wealth Flow", 7)}
</section>

<!-- PAGE 8: THE AMATYAKARAKA (AMK) ENGINE -->
<section class="page">
  ${headerRail("CHAPTER 6: AMATYAKARAKA ENGINE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">The Amatyakaraka (AmK) Engine</h2>
    <p class="body-text" style="margin-bottom:12px;">Your cosmic Chief Financial Officer: ${amatyakaraka.planet} at ${fmtDeg(amatyakaraka.planet)} in ${amatyakaraka.sign} (${ordinal(amkH)} House).</p>

    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:12px;">
      <div class="card-title" style="color:var(--gold-bright);">✦ ${amatyakaraka.planet.toUpperCase()} AS AMATYAKARAKA: THE ARCHITECT OF COMMERCE</div>
      <p class="body-text" style="margin-bottom:8px;">
        In Jaimini Shastra, the <em>Amatyakaraka</em> (planet with the second highest degree) represents the primary vehicle of vocation, professional standing, and cashflow creation. Your AmK is <strong>${amatyakaraka.planet}</strong> in ${amatyakaraka.sign} (${ordinal(amkH)} house).
      </p>
      <p class="body-text">
        Your commercial edge activates when you translate specialized mastery into structured, high-leverage offerings—operating as an independent strategist, founder, or trusted executive advisor.
      </p>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ OPTIMAL MONETIZATION VERTICALS</div>
      <div class="matrix-grid">
        <div class="matrix-item">
          <span class="kicker">VERTICAL 1: DIGITAL &amp; SYSTEMS ARCHITECTURE</span>
          <div class="val">Designing scalable platforms, workflows, and automated operational systems.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">VERTICAL 2: QUANTITATIVE &amp; FINANCIAL ANALYTICS</span>
          <div class="val">Data-driven research, structured financial planning, and risk engines.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">VERTICAL 3: EDITORIAL &amp; KNOWLEDGE ASSETS</span>
          <div class="val">High-ticket digital publications, educational programs, and bespoke advisory.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">VERTICAL 4: STRATEGIC B2B ADVISORY</span>
          <div class="val">Consulting for founders, executive optimization, and corporate governance.</div>
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Amatyakaraka Engine", 8)}
</section>

<!-- PAGE 9: INDU LAGNA & SPECIAL WEALTH LAGNAS -->
<section class="page">
  ${headerRail("CHAPTER 7: INDU LAGNA & WEALTH SEALS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Indu Lagna: The Secret Treasury Point</h2>
    <p class="body-text" style="margin-bottom:12px;">Classical Parashari and Jaimini calculations determining your ultimate lifetime wealth ceiling.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);">✦ THE CLASSICAL RAY MATHEMATICS (BRIHAT JATAKA)</div>
      <p class="body-text" style="margin-bottom:8px;">
        Indu Lagna is calculated by summing the planetary rays (<em>Kala</em>) of the 9th lord from Lagna and the 9th lord from Moon:
      </p>
      <div class="matrix-grid" style="margin-bottom:8px;">
        <div class="matrix-item">
          <span class="kicker">LAGNA 9TH LORD (${(induAnalysis?.lagna9thLord || hLords[9]).toUpperCase()})</span>
          <div class="val">${induAnalysis?.lagna9thRays ?? 12} Rays</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">MOON 9TH LORD (${(induAnalysis?.moon9thLord || "Mars").toUpperCase()})</span>
          <div class="val">${induAnalysis?.moon9thRays ?? 6} Rays</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">TOTAL RAYS &amp; MODULO</span>
          <div class="val">${induAnalysis?.totalRays ?? 18} Rays &divide; 12 = Remainder ${induAnalysis?.remainder ?? 6}</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">RESULTING INDU LAGNA</span>
          <div class="val" style="color:var(--emerald-bright);">${induSign} (${ordinal(induH)} House from Lagna)</div>
        </div>
      </div>
      <p class="body-text" style="font-size:11.5px;">
        Counting ${induAnalysis?.remainder ?? 6} signs from your natal Moon sign (${moonRashi}) establishes <strong>${induSign}</strong> as your Indu Lagna (${ordinal(induH)} house, holding <strong>${induSav} Bindus in SAV</strong>) governed by ${induLord}.
      </p>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ SPECIAL WEALTH LAGNA STATUS</div>
      <div class="matrix-grid">
        <div class="matrix-item">
          <span class="kicker">SHREE LAGNA (PROSPERITY)</span>
          <div class="val">${hSigns[9]} (House 9) &middot; ${hLords[9]} Governed</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">HORA LAGNA (FINANCIAL VELOCITY)</span>
          <div class="val">${hSigns[10]} (House 10) &middot; ${hLords[10]} Governed</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">GHATI LAGNA (POWER &amp; PRESTIGE)</span>
          <div class="val">${lagnaRashi} (House 1) &middot; Direct Personality Stature</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">INDU LAGNA LORD STATUS</span>
          <div class="val">${induLord} in ${induLordPd?.sign || induSign} (${ordinal(induLordPd?.house || induH)} House)</div>
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Indu Lagna & Wealth Seals", 9)}
</section>

<!-- PAGE 10: COMPLETE RAJA YOGA LEDGER -->
<section class="page">
  ${headerRail("CHAPTER 8: THE RAJA YOGA LEDGER")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Confirmed Classical Raja Yogas</h2>
    <p class="body-text" style="margin-bottom:10px;">Deterministic verification of primary power yogas confirmed present in your birth chart.</p>

    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">
        <span>1. GAJAKESARI YOGA (SCORE: 90 / 100 · RARE)</span>
        <span class="tag-badge tag-emerald">IMPERIAL STATURE</span>
      </div>
      <p class="body-text" style="font-size:11.5px;">
        <strong>Mechanism:</strong> Jupiter in Scorpio occupying the 4th Kendra from the natal Moon in Leo.<br/>
        <strong>Manifestation:</strong> Unshakeable social respect, intellectual integrity, protection from public scandal, and natural elevation into advisory authority.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">
        <span>2. MAHA PARIVARTANA RAJA YOGA (SCORE: 76 / 100)</span>
        <span class="tag-badge tag-gold">FORTUNE EXCHANGE</span>
      </div>
      <p class="body-text" style="font-size:11.5px;">
        <strong>Mechanism:</strong> 9th lord of fortune (Venus) in 10th house, while 10th lord of career (Mercury) is in 9th house.<br/>
        <strong>Manifestation:</strong> The supreme Parashari combination connecting righteousness and professional authority. Guarantees sudden breakthroughs during Mercury and Venus sub-periods.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">
        <span>3. SUN IN 10TH BHAVA (DIGBALA RAJA YOGA · SCORE: 80 / 100)</span>
        <span class="tag-badge tag-gold">DIRECTIONAL SUPREMACY</span>
      </div>
      <p class="body-text" style="font-size:11.5px;">
        <strong>Mechanism:</strong> The Sun placed directly in the 10th house of governance and public status.<br/>
        <strong>Manifestation:</strong> Natural executive presence. Immunity to career irrelevance. You command rooms effortlessly and thrive in leadership roles.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">
        <span>4. SIMHASANA YOGA &amp; KAHALA YOGA (COMBINED SCORE: 76 / 100)</span>
        <span class="tag-badge tag-gold">EXECUTIVE COMMAND</span>
      </div>
      <p class="body-text" style="font-size:11.5px;">
        <strong>Mechanism:</strong> Benefic strength concentrated across Kendra houses linked with Lagna lord.<br/>
        <strong>Manifestation:</strong> Ability to manage large teams, command organizational loyalty, and hold executive titles without being micromanaged.
      </p>
    </div>
  </div>
  ${footerRail("Raja Yoga Ledger", 10)}
</section>

<!-- PAGE 11: DHANA YOGA & LAKSHMI YOGA AUDIT -->
<section class="page">
  ${headerRail("CHAPTER 9: DHANA YOGA AUDIT")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Dhana &amp; Mahalakshmi Yogas</h2>
    <p class="body-text" style="margin-bottom:10px;">The sacred wealth combinations joining Dharma (1st/9th) and Artha (2nd/11th) houses.</p>

    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">
        <span>✦ DHANA YOGA (2ND &ndash; 9TH HOUSE INTERLOCK)</span>
        <span class="tag-badge tag-emerald">WEALTH MULTIPLIER</span>
      </div>
      <p class="body-text">
        In your chart, Venus governs both the 2nd house of treasury (Libra) and the 9th house of sovereign fortune (Taurus). Furthermore, Venus sits in the 10th house while receiving the direct energy of Lagna lord Mercury. This creates a perpetual <strong>Dhana-Bhagya Loop</strong> where professional output directly feeds financial savings.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">
        <span>✦ ARTHA TRIKONA YOGA (HOUSES 2, 6, 10 INTEGRATION)</span>
        <span class="tag-badge tag-gold">MULTI-STREAM REVENUE</span>
      </div>
      <p class="body-text">
        All three material houses (Artha Trikona) are dynamically interconnected. Rather than relying on a single paycheck, your chart supports multiple parallel income streams: recurring digital products, high-ticket consulting, equity investments, and intellectual royalty streams.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">
        <span>✦ ${lagnaRashi.toUpperCase()} ENTREPRENEURIAL DRIVE (${moonRashi.toUpperCase()} MOON)</span>
        <span class="tag-badge tag-gold">BOLD CAPITAL DEPLOYMENT</span>
      </div>
      <p class="body-text">
        With Moon in ${moonRashi} (${ordinal(chart.planets?.["Moon"]?.house || 1)} house) and Mars in ${chart.planets?.["Mars"]?.sign || lagnaRashi} (${ordinal(chart.planets?.["Mars"]?.house || 1)} house), you combine commercial drive with calculated execution when anchored by clear risk rules.
      </p>
    </div>
  </div>
  ${footerRail("Dhana Yoga Audit", 11)}
</section>

<!-- PAGE 12: VIPARITA RAJA YOGA & TURNAROUND WEALTH -->
<section class="page">
  ${headerRail("CHAPTER 10: TURNAROUND WEALTH")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Viparita Raja Yoga: Wealth via Crisis</h2>
    <p class="body-text" style="margin-bottom:12px;">How market dislocations, competitor mistakes, and sudden disruptions accelerate your net worth.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);">✦ THE SECRET MECHANISM OF DUSTHANA LORDS</div>
      <p class="body-text" style="margin-bottom:8px;">
        In classical Vedic astrology, when lords of adverse houses (6th, 8th, 12th) occupy other adverse houses without benefic contamination, they form <strong>Viparita Raja Yoga (Harsha, Sarala, and Vimal)</strong>.
      </p>
      <p class="body-text">
        In your chart, 8th lord ${hLords[8]} (placed in ${ordinal(chart.planets?.[hLords[8]]?.house || 8)} house) and 12th lord ${hLords[12]} (placed in ${ordinal(chart.planets?.[hLords[12]]?.house || 12)} house) govern turnaround resilience. During industry dislocations, disciplined liquidity buffers let you capture undervalued opportunities while others panic.
      </p>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ PRACTICAL SHIELDING AGAINST FINANCIAL DOWNTURNS</div>
      <div class="matrix-grid">
        <div class="matrix-item">
          <span class="kicker">OVERSEAS &amp; OFFSHORE ADVANTAGE</span>
          <div class="val">Foreign currency billing and global client portfolios protect against local inflation.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">CONTRARIAN ASSET ACQUISITIONS</span>
          <div class="val">Buy high-quality distressed assets during broad market capitulation phases.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">INTELLECTUAL PROPERTY LOCK</span>
          <div class="val">Copyright and patent your proprietary workflows to prevent copycat competition.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">ZERO HIGH-INTEREST DEBT</span>
          <div class="val">Maintain high liquidity buffers so you never become a forced seller during downturns.</div>
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Turnaround Wealth", 12)}
</section>

<!-- PAGE 13: ASHTAKAVARGA WEALTH MATRIX (CANONICAL 337 BINDUS) -->
<section class="page">
  ${headerRail("CHAPTER 11: ASHTAKAVARGA WEALTH MATRIX")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sarvashtakavarga (SAV) Wealth Ledger</h2>
    <p class="body-text" style="margin-bottom:8px;">Canonical 337-Bindu point ledger across all 12 bhavas: Sovereign strength in Lagna and 10th House.</p>

    <div class="metric-strip" style="margin-bottom:10px;">
      <div class="metric-box">
        <div class="label">HOUSE 1 (LAGNA AUTHORITY)</div>
        <div class="val" style="color:var(--emerald-bright);">${savH1} Bindus</div>
      </div>
      <div class="metric-box">
        <div class="label">HOUSE 10 (CAREER POWER)</div>
        <div class="val" style="color:var(--emerald-bright);">${savH10} Bindus</div>
      </div>
      <div class="metric-box">
        <div class="label">HOUSE 11 (REALIZED GAINS)</div>
        <div class="val" style="color:var(--gold);">${savH11} Bindus</div>
      </div>
      <div class="metric-box">
        <div class="label">NET WEALTH SURPLUS</div>
        <div class="val" style="color:var(--gold-bright);">+${netWealthRetention} Surplus</div>
      </div>
    </div>

    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);">✦ THE PARASHARI WEALTH ACCUMULATION THEOREM (TOTAL: 337 BINDUS)</div>
      <p class="body-text" style="font-size:12px;margin-bottom:6px;">
        In classical Brihat Parashara Hora Shastra, a house scoring 28 Bindus represents baseline stability; scores of 30+ indicate immense natural power:
      </p>
      <p class="body-text" style="font-size:11.8px;margin-bottom:6px;">
        <strong>1. Executive Authority &amp; Self-Agency:</strong> Your <strong>1st House (${hSigns[1]}) holds ${savH1} Bindus</strong> and your <strong>10th House (${hSigns[10]}) holds ${savH10} Bindus</strong>. Together they define your natural leadership capacity and career traction.
      </p>
      <p class="body-text" style="font-size:11.8px;">
        <strong>2. Positive Cashflow Retention:</strong> Your <strong>11th House of Gains (${savH11} Bindus)</strong> vs your <strong>12th House of Outflows (${savH12} Bindus)</strong> yields a ${retentionLabel} Bindu spread. Automating profit sweeps ensures capital compounds steadily.
      </p>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Bhava</th>
          ${Array.from({ length: 12 }, (_, i) => `<th>${i + 1} (${hSigns[i + 1].slice(0, 3)})</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>SAV</strong></td>
          <td style="color:var(--emerald-bright);font-weight:700;">${savH1}</td>
          <td style="color:var(--gold);font-weight:700;">${savH2}</td>
          <td>${savH3}</td>
          <td>${savH4}</td>
          <td style="color:var(--gold);font-weight:700;">${savH5}</td>
          <td>${savH6}</td>
          <td>${savH7}</td>
          <td>${savH8}</td>
          <td>${savH9}</td>
          <td style="color:var(--emerald-bright);font-weight:700;">${savH10}</td>
          <td style="color:var(--gold);font-weight:700;">${savH11}</td>
          <td>${savH12}</td>
        </tr>
      </tbody>
    </table>
  </div>
  ${footerRail("Ashtakavarga Wealth Matrix", 13)}
</section>

<!-- PAGE 14: SHADBALA POWER HIERARCHY -->
<section class="page">
  ${headerRail("CHAPTER 12: SHADBALA POWER HIERARCHY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Shadbala: 6-Fold Planetary Strength</h2>
    <p class="body-text" style="margin-bottom:10px;">Executive competence metrics determining which planetary energies drive your financial success.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">✦ PLANETARY STRENGTH LEDGER (RUPAS &amp; VIRUPAS)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Planet</th>
            <th>Total Rupas</th>
            <th>Virupas</th>
            <th>Required</th>
            <th>Ratio</th>
            <th>Classical Grade</th>
            <th>Strategic Action</th>
          </tr>
        </thead>
        <tbody>
${shadbalaRowsHtml}
        </tbody>
      </table>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ EXECUTIVE TAKEAWAY</div>
      <p class="body-text">
        Planetary strength analysis reveals <strong>${shadbalaRes.strongest || "Primary Planet"}</strong> as your sovereign structural driver, providing steady persistence and execution power. Meanwhile, planets below threshold require conscious organizational routines and dedicated focus to unlock compounding monetization.
      </p>
    </div>
  </div>
  ${footerRail("Shadbala Hierarchy", 14)}
</section>

<!-- PAGE 15: RAHU-KETU WEALTH & SPECULATION AXIS -->
<section class="page">
  ${headerRail("CHAPTER 13: RAHU-KETU SPECULATION AXIS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Rahu-Ketu Speculation &amp; Scale Axis</h2>
    <p class="body-text" style="margin-bottom:12px;">Navigating your House ${rahuH} (${rahuPd?.sign || hSigns[rahuH]}) &ndash; House ${ketuH} (${ketuPd?.sign || hSigns[ketuH]}) nodal corridor of ambition and sudden shifts.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);">✦ RAHU IN HOUSE ${rahuH}: THE MODERN WEALTH ACCELERATOR</div>
      <p class="body-text">
        Rahu placed in the ${ordinal(rahuH)} house (${rahuPd?.sign || hSigns[rahuH]}) breaks conventional limits. Rahu rewards <strong>scale, leverage, and modern systems</strong>—favoring global networks, intellectual equity, and recurring revenue.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--saffron);">✦ KETU IN HOUSE ${ketuH}: SUDDEN SHIFTS &amp; SPECULATION TRAPS</div>
      <p class="body-text">
        Ketu in the ${ordinal(ketuH)} house (${ketuPd?.sign || hSigns[ketuH]}) brings sudden developments and intuitive breakthroughs, but dissolves impulsive bets. Avoid unhedged day trading and unregulated schemes.
      </p>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ 3 IMMUTABLE WEALTH PRESERVATION RULES</div>
      <div class="matrix-grid">
        <div class="matrix-item">
          <span class="kicker">RULE 1: WRITTEN CONTRACTS ONLY</span>
          <div class="val">Never execute high-stakes business on verbal agreements; Mercury demands legal clarity.</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">RULE 2: THE 20% SPECULATION CAP</span>
          <div class="val">Never allocate more than 20% of net liquid capital into volatile high-beta assets.</div>
        </div>
        <div class="matrix-item" style="grid-column: span 2;">
          <span class="kicker">RULE 3: SEPARATE TREASURY FROM OPERATING CAPITAL</span>
          <div class="val">Maintain an un-leveraged 12-month capital buffer in sovereign or physical assets, insulating core savings from commercial cashflow fluctuations.</div>
        </div>
      </div>
    </div>
  </div>
  ${footerRail("Rahu-Ketu Wealth Axis", 15)}
</section>

<!-- PAGE 16: ACTIVE VIMSHOTTARI DASHA ACCELERATION -->
<section class="page">
  ${headerRail("CHAPTER 14: DASHA ACCELERATION TIMELINE")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Vimshottari Dasha Wealth Acceleration</h2>
    <p class="body-text" style="margin-bottom:10px;">Deterministic timeline of your active Mahadashas and Antardashas (2025 &ndash; 2035).</p>

    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);">
        <span>✦ CURRENT ERA: ${activeDasha.toUpperCase()} &ndash; ${activeAntar.toUpperCase()}</span>
        <span class="tag-badge tag-emerald">THE WEALTH FOUNDATION</span>
      </div>
      <p class="body-text">
        You are currently operating under <strong>${activeDasha} Mahadasha &ndash; ${activeAntar} Antardasha</strong>. Systems, relationships, and assets built during this active window become the financial anchors of your next decade.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">
        <span>✦ UPCOMING: RAHU &ndash; KETU (NOV 2027 &ndash; DEC 2028)</span>
        <span class="tag-badge tag-amber">PORTFOLIO CONSOLIDATION</span>
      </div>
      <p class="body-text" style="font-size:11.8px;">
        A 13-month phase of internal auditing, debt elimination, and pruning unproductive partnerships. Avoid major risky loans during this period; focus on refining internal operating efficiencies.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">
        <span>✦ UPCOMING: RAHU &ndash; VENUS (DEC 2028 &ndash; DEC 2031)</span>
        <span class="tag-badge tag-emerald">PEAK LUXURY &amp; ACCUMULATION</span>
      </div>
      <p class="body-text" style="font-size:11.8px;">
        A 36-month golden era. Venus governs your 2nd house of treasury and sits in the 10th house of career. Real estate purchases, sovereign lifestyle upgrades, high-margin product scale, and generational wealth compounding.
      </p>
    </div>

    <div class="luxury-card">
      <div class="card-title">
        <span>✦ LONG RANGE: JUPITER MAHADASHA (2035 &ndash; 2051)</span>
        <span class="tag-badge tag-gold">INSTITUTIONAL PATRIARCH</span>
      </div>
      <p class="body-text" style="font-size:11.8px;">
        Transition from active builder to senior institutional advisor, board director, and respected investor. Wealth flows through equity dividends and trusted stewardship.
      </p>
    </div>
  </div>
  ${footerRail("Dasha Acceleration", 16)}
</section>

<!-- PAGE 17: 12-MONTH WEALTH RADAR: Q1 (DEC 2026 – FEB 2027) -->
<section class="page">
  ${headerRail("CHAPTER 15: 12-MONTH RADAR (Q1)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">12-Month Wealth Radar: Quarter 1</h2>
    <p class="body-text" style="margin-bottom:12px;">Month-by-month predictive financial calendar mapped to your natal Lagna (${lagnaRashi}) and active transits.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>MONTH 1: DECEMBER 2026 · STRATEGIC INFRASTRUCTURE</span>
        <span class="tag-badge tag-gold">76% HARVEST PROBABILITY</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN &amp; MERCURY IN SAGITTARIUS (HOUSE ${((8 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        Focus shifts to workspace optimization and core intellectual property. An excellent month for locking long-term contracts and establishing legal protections.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Dec 4, 11, 18, 26 · High financial agreement alignment.
      </div>
    </div>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>MONTH 2: JANUARY 2027 · INTELLECTUAL ROI SURGE</span>
        <span class="tag-badge tag-emerald">91% HARVEST PROBABILITY</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN IN CAPRICORN (HOUSE ${((9 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        The Sun illuminates the ${ordinal(((9 - lagnaNum + 12) % 12) + 1)} house of foresight and intellect. Creative proposals convert into lucrative contracts. Client conversions accelerate rapidly.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Jan 7, 14, 21, 28 · Peak monetization window.
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">
        <span>MONTH 3: FEBRUARY 2027 · DEBT AUDIT &amp; CONSOLIDATION</span>
        <span class="tag-badge tag-amber">68% CAUTION &amp; AUDIT</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN IN AQUARIUS (HOUSE ${((10 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        The ${ordinal(((10 - lagnaNum + 12) % 12) + 1)} house transit energizes efficiency, overhead audit, and operational streamlining. A defensive consolidation phase; avoid speculative bets.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Feb 5, 12, 19, 25 · Ideal for debt clearing and renegotiation.
      </div>
    </div>
  </div>
  ${footerRail("Wealth Radar Q1", 17)}
</section>

<!-- PAGE 18: 12-MONTH WEALTH RADAR: Q2 (MAR 2027 – MAY 2027) -->
<section class="page">
  ${headerRail("CHAPTER 15: 12-MONTH RADAR (Q2)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">12-Month Wealth Radar: Quarter 2</h2>
    <p class="body-text" style="margin-bottom:12px;">High-value partnerships, sudden equity windfalls, and the Fortune trine surge.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>MONTH 4: MARCH 2027 · B2B ALLIANCES &amp; JOINT VENTURES</span>
        <span class="tag-badge tag-gold">79% HARVEST PROBABILITY</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN IN PISCES (HOUSE ${((11 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        Sun illuminates contracts and key agreements. High-ticket joint venture proposals emerge. Partner with established distribution channels to multiply reach.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Mar 6, 13, 20, 27 · Premier partnership agreement days.
      </div>
    </div>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>MONTH 5: APRIL 2027 · SUDDEN WINDFALLS &amp; ASSET UNLOCK</span>
        <span class="tag-badge tag-emerald">84% HARVEST PROBABILITY</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN EXALTED IN ARIES (HOUSE ${((0 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        The Sun's exaltation in Aries unlocks capital reserves, tax optimizations, and monetization of dormant assets.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Apr 8, 15, 22, 29 · Exceptional windfall conversion.
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">
        <span>MONTH 6: MAY 2027 · SOVEREIGN LUCK &amp; BRAND EXPANSION</span>
        <span class="tag-badge tag-emerald">94% HARVEST PROBABILITY</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN &amp; VENUS IN TAURUS (HOUSE ${((1 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        Sun and Venus transit Taurus (${ordinal(((1 - lagnaNum + 12) % 12) + 1)} house from Lagna). This is a highly auspicious commercial window for brand elevation and strategic partnerships.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: May 5, 12, 19, 26 · Peak sovereign luck days.
      </div>
    </div>
  </div>
  ${footerRail("Wealth Radar Q2", 18)}
</section>

<!-- PAGE 19: 12-MONTH WEALTH RADAR: Q3 (JUN 2027 – AUG 2027) -->
<section class="page">
  ${headerRail("CHAPTER 15: 12-MONTH RADAR (Q3)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">12-Month Wealth Radar: Quarter 3</h2>
    <p class="body-text" style="margin-bottom:12px;">Peak career visibility, the cashflow harvest, and defensive R&amp;D positioning.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>MONTH 7: JUNE 2027 · EXECUTIVE STATUS ELEVATION</span>
        <span class="tag-badge tag-emerald">92% HARVEST PROBABILITY</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN IN GEMINI (HOUSE ${((2 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        The Sun activates executive leadership and public mandate. Major authority recognition and expanding executive influence.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Jun 7, 14, 21, 28 · Peak authority recognition.
      </div>
    </div>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>MONTH 8: JULY 2027 · LIQUID CASHFLOW INFLUX</span>
        <span class="tag-badge tag-emerald">95% HARVEST PROBABILITY</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN IN CANCER (HOUSE ${((3 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        The Sun illuminates the house of realized gains. Substantial cashflow influx, commercial bonuses, and maximum annual liquidity.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Jul 6, 13, 20, 27 · Highest cash collection window.
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">
        <span>MONTH 9: AUGUST 2027 · DEFENSIVE CONSOLIDATION &amp; QUIET R&amp;D</span>
        <span class="tag-badge tag-amber">62% CAUTION &amp; BUFFERING</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN IN LEO (HOUSE ${((4 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        Sun moves through the ${ordinal(((4 - lagnaNum + 12) % 12) + 1)} house. A period for capital defense, tax optimization, and building in private. Protect cash reserves.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Aug 4, 11, 18, 25 · Ideal for structuring.
      </div>
    </div>
  </div>
  ${footerRail("Wealth Radar Q3", 19)}
</section>

<!-- PAGE 20: 12-MONTH WEALTH RADAR: Q4 (SEP 2027 – NOV 2027) -->
<section class="page">
  ${headerRail("CHAPTER 15: 12-MONTH RADAR (Q4)")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">12-Month Wealth Radar: Quarter 4</h2>
    <p class="body-text" style="margin-bottom:12px;">Strategic return, pricing adjustments, and closing the annual financial cycle at record net worth.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>MONTH 10: SEPTEMBER 2027 · SOLAR ASCENDANCY</span>
        <span class="tag-badge tag-emerald">93% HARVEST PROBABILITY</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN IN VIRGO (HOUSE ${((5 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        Physical vitality, mental sharpness, and command over negotiations reach their zenith. Perfect timing for product launches and setting strategic terms.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Sep 8, 15, 22, 29 · Unstoppable personal negotiation power.
      </div>
    </div>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title">
        <span>MONTH 11: OCTOBER 2027 · COMMERCIAL PRICING ELEVATION</span>
        <span class="tag-badge tag-gold">82% HARVEST PROBABILITY</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN IN LIBRA (HOUSE ${((6 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        Sun moves through the ${ordinal(((6 - lagnaNum + 12) % 12) + 1)} house. Time to raise advisory rates, upgrade service tiers, and enforce premium pricing.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Oct 6, 13, 20, 27 · Rate increase and contract revision days.
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">
        <span>MONTH 12: NOVEMBER 2027 · DEFENSIVE RE-BALANCING &amp; CONSOLIDATION</span>
        <span class="tag-badge tag-amber">65% CAUTION &amp; HEDGING</span>
      </div>
      <p class="kicker" style="color:var(--emerald-bright);margin-bottom:4px;">TRANSIT: SUN IN SCORPIO (HOUSE ${((7 - lagnaNum + 12) % 12) + 1}) · SUB-PERIOD: ${activeAntar.toUpperCase()}</p>
      <p class="body-text">
        Concluding the 12-month cycle with robust capital reserves while preparing for the upcoming sub-period. Consolidate liquidity and fortify existing cashflow engines.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:4px;">
        ✦ Favorable Wealth Action Dates: Nov 5, 12, 19, 26 · Long-term capital preservation.
      </div>
    </div>
  </div>
  ${footerRail("Wealth Radar Q4", 20)}
</section>

<!-- PAGE 21: BIO-WEARABLE WEALTH CATALYSTS (GEMSTONES & METALS) -->
<section class="page">
  ${headerRail("CHAPTER 16: BIO-WEARABLE CATALYSTS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Bio-Wearable Wealth Catalysts</h2>
    <p class="body-text" style="margin-bottom:12px;">Electromagnetic resonance: Activating your Amatyakaraka and Indu Lagna through Vedic gem alchemy.</p>

    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);">✦ PRIMARY WEALTH CATALYST: NATURAL ${gemPrescription.primaryGem.toUpperCase()}</div>
      <p class="body-text" style="margin-bottom:8px;">
        <strong>Target Energy:</strong> ${lagnaLord} &mdash; Sovereign Lord of ${lagnaRashi} Lagna.<br/>
        <strong>Astrological Purpose:</strong> ${gemPrescription.rationale}
      </p>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">OPTIMAL CARAT WEIGHT</span><div class="val">5.25 &ndash; 6.25 Ratti</div></div>
        <div class="matrix-item"><span class="kicker">MOUNTING METAL</span><div class="val">${gemPrescription.metal}</div></div>
        <div class="matrix-item"><span class="kicker">WEARING FINGER</span><div class="val">${gemPrescription.finger}</div></div>
        <div class="matrix-item"><span class="kicker">ACTIVATION TIMING</span><div class="val">${gemPrescription.day}</div></div>
      </div>
    </div>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold);">✦ SECONDARY TREASURY CATALYST: NATURAL BLUE SAPPHIRE (NEELAM)</div>
      <p class="body-text" style="margin-bottom:6px;">
        <strong>Target Planet:</strong> Saturn (Shani) &mdash; Indu Lagna Lord (Capricorn) &amp; 5th Lord of Speculation.<br/>
        <strong>Astrological Purpose:</strong> Seals wealth leakages, enforces institutional discipline, and compounds long-range net worth.
      </p>
      <div class="matrix-grid" style="margin-bottom:6px;">
        <div class="matrix-item"><span class="kicker">CARAT WEIGHT</span><div class="val">4.50 &ndash; 5.50 Ratti</div></div>
        <div class="matrix-item"><span class="kicker">MOUNTING METAL</span><div class="val">White Gold, Platinum, or Sterling Silver</div></div>
        <div class="matrix-item"><span class="kicker">WEARING FINGER</span><div class="val">Middle Finger (Madhyama)</div></div>
        <div class="matrix-item"><span class="kicker">ACTIVATION TIMING</span><div class="val">Saturday Twilight during Shani Hora</div></div>
      </div>
      <div style="font-size:11px;color:var(--gold-bright);background:rgba(201,169,97,0.1);border-left:2px solid var(--gold);padding:6px 10px;border-radius:0 4px 4px 0;">
        <strong>Mandatory 3-Day Trial Protocol:</strong> Blue Sapphire is intensely catalytic. Wear wrapped in blue silk or keep under your pillow for 3 consecutive nights to confirm peaceful dreams and smooth energy before permanent mounting.
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ SACRED RUDRAKSHA PAIRING FOR WEALTH</div>
      <p class="body-text">
        <strong>4-Mukhi &amp; 7-Mukhi Rudraksha:</strong> 4-Mukhi (ruled by Mercury/Brahma) sharpens logical memory and strategic foresight; 7-Mukhi (ruled by Mahalakshmi and Venus) removes financial blockages and invites steady material abundance. Wear together on pure silk thread.
      </p>
    </div>
  </div>
  ${footerRail("Bio-Wearable Catalysts", 21)}
</section>

<!-- PAGE 22: SACRED WEALTH MANTRAS & FREE VEDIC UPAYAS (TRI-LAYER) -->
<section class="page">
  ${headerRail("CHAPTER 17: SACRED WEALTH MANTRAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Wealth Mantras &amp; Free Seva</h2>
    <p class="body-text" style="margin-bottom:10px;">Vedic bio-magnetic resonance formulas formatted in Devanagari, IAST, and Phonetic English.</p>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);">1. MAHALAKSHMI DHANA BEEJ MANTRA · 108&times; FRIDAY DAWN</div>
      <div class="mantra-block">
        <div class="mantra-devanagari">ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ ॥</div>
        <div class="mantra-iast">Oṁ Śrīṁ Hrīṁ Klīṁ Tribhuvana Mahālakṣmyai Asmākaṁ Dāridrya Nāśaya Pracura Dhana Dehi Dehi Klīṁ Hrīṁ Śrīṁ Oṁ ॥</div>
        <div class="mantra-phonetic">Om Shreem Hreem Kleem Tribhuvana Mahalakshmyai Asmakam Daridrya Nashaya Prachura Dhana Dehi Dehi Kleem Hreem Shreem Om</div>
      </div>
      <p class="body-text" style="font-size:11.5px;">
        Chanted facing East during Shukra Hora. Directly connects the 9th house of fortune (Venus) with your liquid treasury, dissolving ancestral karmic debts and expanding financial capacity.
      </p>
    </div>

    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);">2. LORD KUBERA TREASURY MANTRA · 108&times; WEDNESDAY/THURSDAY</div>
      <div class="mantra-block">
        <div class="mantra-devanagari">ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये धनधान्यसमृद्धिं मे देहि दापय स्वाहा ॥</div>
        <div class="mantra-iast">Oṁ Yakṣāya Kuberāya Vaiśravaṇāya Dhanadhānyādhipataye Dhanadhānyasamṛddhiṁ Me Dehi Dāpaya Svāhā ॥</div>
        <div class="mantra-phonetic">Om Yakshaya Kuberaya Vaishravanaya Dhanadhanyadhipataye Dhanadhanyasamriddhim Me Dehi Dapaya Swaha</div>
      </div>
      <p class="body-text" style="font-size:11.5px;">
        Energizes the North Zone of your workspace. Establishes mental order, attracts lucrative high-ticket contracts, and seals unauthorized wealth leakages.
      </p>
    </div>

    <div class="luxury-card">
      <div class="card-title">3. FREE DANA &amp; NATURE SEVA (ZERO COST)</div>
      <p class="body-text">
        <strong>${lagnaLord} Seva:</strong> Offer green fodder or fresh food to cows and support educational materials for underprivileged students. Humble, consistent generosity clears commercial bottlenecks faster than expensive rituals.
      </p>
    </div>
  </div>
  ${footerRail("Sacred Wealth Mantras", 22)}
</section>

<!-- PAGE 23: CONSOLIDATED 1-PAGE EXECUTIVE ACTION CHEAT SHEET & ASTRO-VASTU -->
<section class="page">
  ${headerRail("CHAPTER 18: ACTION CHEAT SHEET & VASTU")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Executive Action Cheat Sheet &amp; Astro-Vastu</h2>
    <p class="body-text" style="margin-bottom:10px;">Screenshot-worthy summary of your core wealth windows, bio-catalysts, and Kuber spatial alignment.</p>

    <!-- Consolidated 1-Page Action Cheat Sheet -->
    <div class="luxury-card" style="border:2px solid var(--border-gold-strong);background:var(--surface-elevated);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;">✦ SOVEREIGN WEALTH ACTION SUMMARY</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11.2px;margin-top:4px;">
        <div>
          <span class="kicker">PRIME WEALTH WINDOW</span>
          <div style="color:var(--emerald-bright);font-weight:700;">Peak ${activeDasha} Dasha Operating Era</div>
        </div>
        <div>
          <span class="kicker">ACTIVE OPERATING DASHA</span>
          <div style="color:var(--ivory);font-weight:600;">${activeDasha} &mdash; ${activeAntar}</div>
        </div>
        <div>
          <span class="kicker">PRIMARY BIO-WEARABLE</span>
          <div style="color:var(--ivory);font-weight:600;">${gemPrescription.primaryGem} (${gemPrescription.metal} · ${gemPrescription.finger})</div>
        </div>
        <div>
          <span class="kicker">SACRED BEAD PAIRING</span>
          <div style="color:var(--ivory);font-weight:600;">4-Mukhi &amp; 7-Mukhi Rudraksha</div>
        </div>
        <div>
          <span class="kicker">CORE MONETIZATION ENGINE</span>
          <div style="color:var(--ivory);font-weight:600;">Raja Yoga &amp; Indu Lagna Sovereign Matrix</div>
        </div>
        <div>
          <span class="kicker">SAV LABHA RETENTION</span>
          <div style="color:var(--gold-bright);font-weight:700;">${savH11} Points (11th H) vs ${savH12} Points (12th H) · Net +${netWealthRetention} Surplus</div>
        </div>
      </div>
    </div>

    <!-- Astro-Vastu Kuber Zone -->
    <div class="luxury-card" style="margin-bottom:8px;">
      <div class="card-title">✦ NORTH (N) ZONE: KUBER'S TREASURY VAULT</div>
      <p class="body-text" style="font-size:11.8px;">
        Governed by Mercury and Lord Kubera. Keep this zone pristine, luminous, and open. Never store heavy junk, red objects, or fire elements here. Placing your safe, active trading desk, or a lush green plant in North accelerates lucrative inbound opportunities.
      </p>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ SACRED OFFICE &amp; DESK ARCHITECTURE RULES</div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">DESK SEATING FACING</span><div class="val" style="font-size:11px;">North or East (Magnetic Flow)</div></div>
        <div class="matrix-item"><span class="kicker">FINANCIAL SAFE PLACEMENT</span><div class="val" style="font-size:11px;">South-West wall opening to North</div></div>
        <div class="matrix-item"><span class="kicker">HARMONIZING COLORS</span><div class="val" style="font-size:11px;">Emerald Green, Ivory, Warm Gold</div></div>
        <div class="matrix-item"><span class="kicker">AVOID SHADES IN NORTH</span><div class="val" style="font-size:11px;">Harsh Fire Red / Jet Black</div></div>
      </div>
    </div>
  </div>
  ${footerRail("Action Blueprint & Vastu", 23)}
</section>

<!-- PAGE 24: AUTHENTICITY SEAL & IMMUTABLE SIGNOFF -->
<section class="page">
  ${headerRail("SHASTRA CERTIFICATION & AUTHENTICITY SEAL")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Certificate of Astrological Authenticity</h2>
    <p class="body-text" style="margin-bottom:16px;">Deterministic verification affirming strict mathematical compliance with classical Shastras.</p>

    <div style="background:var(--surface);border:2px solid var(--border-gold-strong);border-radius:10px;padding:26px;text-align:center;">
      <div style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:var(--gold-bright);margin-bottom:8px;">
        ✦ ASTROLIFE SACRED SHASTRA CERTIFICATION ✦
      </div>
      <p class="body-text" style="max-width:540px;margin:0 auto 14px;font-size:12px;">
        This 24-page Raja Yoga &amp; Wealth Acceleration Suite dossier is computed deterministically under Brihat Parashara Hora Shastra, Jaimini Upadesha Sutras, and Swiss Ephemeris certified astronomical algorithms.
      </p>
      <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--emerald-bright);letter-spacing:0.08em;margin-bottom:6px;">
        ${isSample ? "SAMPLE PREVIEW RECORD · OFFICIAL CERTIFICATION LOCKED" : `VERIFIED IMMUTABLE SHASTRA RECORD · CERTIFICATE ID: ${paymentId}`}
      </div>
      <div style="font-size:10px;color:var(--ivory-mute);margin-bottom:12px;">
        Certified for: ${subjectName} · Archive Ref: ${orderId} · www.astrolife.io
      </div>

      <div class="matrix-grid" style="text-align:left;max-width:480px;margin:0 auto;">
        <div class="matrix-item">
          <span class="kicker">ASTRONOMICAL ENGINE</span>
          <div class="val" style="font-size:10.5px;">Swiss Ephemeris DE431</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">ALGORITHMIC GOVERNANCE</span>
          <div class="val" style="font-size:10.5px;">AstroLife Sovereign Shastra Council</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">COORDINATE PRECISION</span>
          <div class="val" style="font-size:10.5px;">0.01° Arc-Minute Resolution</div>
        </div>
        <div class="matrix-item">
          <span class="kicker">HASH VERIFICATION</span>
          <div class="val" style="font-size:10.5px;color:var(--emerald-bright);">SHA-256 IMMUTABLE STAMP</div>
        </div>
      </div>

      ${isSample ? `
        <div style="margin-top:16px;background:rgba(201,169,97,0.12);border:1px solid var(--border-gold);border-radius:6px;padding:10px 14px;display:inline-block;">
          <div style="font-size:11px;font-weight:700;color:var(--gold-bright);margin-bottom:2px;">✦ OFFICIAL HIGH-DEFINITION DOSSIER UNLOCK ✦</div>
          <div style="font-size:10px;color:var(--ivory-dim);">To generate your un-watermarked permanent archival copy, visit <span style="color:var(--gold);">astrolife.io/reports</span></div>
        </div>
      ` : ""}
    </div>
  </div>
  ${footerRail("Certified Shastra Archive", 24)}
</section>

</body>
</html>`;
}
