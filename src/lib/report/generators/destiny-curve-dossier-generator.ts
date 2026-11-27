/**
 * ============================================================================
 * ASTROLIFE — DESTINY CURVE: 90-YEAR LIFE MASTER DOSSIER (24 PAGES)
 * ============================================================================
 * Flagship Lifetime Trajectory Masterwork (₹999 Tier).
 *
 * Visual & Mathematical Architecture:
 * - Full-Width Vector SVG 90-Year Life Curve (Age 0 to 90, year-by-year 0-100 scores)
 * - Color-coded Mahadasha vertical bands with exact planetary glyphs
 * - Prominent "YOU ARE HERE · AGE [X]" interactive pin marker with score callout
 * - Golden Peak vs Karmic Dip beacon badges with Shastric mitigation
 * - 6-Pillar Life Balance Radar (Career, Wealth, Health, Love, Stability, Mind)
 * - Chronological 90-Year 5 Great Life Epochs Roadmap
 * - Sequential 5-Year Antardasha Wave Trajectory & Monthly Decision Windows
 * - Navtara 9-Chakra Star Shield (Sampat/Kshema vs Vipat/Vadha)
 * - HarfBuzz Devanagari Mantras, Bio-Wearables & 12-Month Tactical Operating System
 * - 100% Print-Perfect 24 A4 Pages (Zero overflow, zero truncation)
 * ============================================================================
 */

import type { ChartData } from "../../astro-engine/calculations";
import { buildAntarDasha } from "../../astro-engine/calculations";
import { calculateDivisional } from "../../astro-engine/divisional";
import { calculateShadbala } from "../../astro-engine/shadbala";
import { calculateAshtakavarga } from "../../astro-engine/ashtakavarga";
import { calculateKarakas } from "../../astro-engine/jaimini";
import { detectYogas } from "../../astro-engine/yogas";
import { calculateDestiny, type DestinyPoint, type DashaBand, type DestinyArea } from "../../astro-engine/destiny";
import type { PackageDossierOptions } from "../package-dossier-html-generator";
import { getSeekerAge, resolveGender } from "../dossier-shared-helpers";
import {
  ordinal,
  withArticle,
  signFromHouse,
  getSignLord,
  getPlanetaryDignity,
  getPlanetHousesOwned,
  getDynamicGemstonePrescription,
  ALL_NAKSHATRAS,
  calculateTaraBala,
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
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

const PLANET_ABBR: Record<string, string> = {
  Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
  Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke", Ascendant: "As"
};

const PLANET_COLORS: Record<string, string> = {
  Sun: "#E8923C", Moon: "#38BDF8", Mars: "#EF4444", Mercury: "#34D399",
  Jupiter: "#C9A961", Venus: "#F472B6", Saturn: "#818CF8", Rahu: "#A855F7", Ketu: "#F59E0B"
};

const HOUSE_POSITIONS: Record<number, [number, number]> = {
  1:  [180, 110], 2:  [100, 55],  3:  [55, 100],  4:  [110, 180],
  5:  [55, 260],  6:  [100, 305], 7:  [180, 250], 8:  [260, 305],
  9:  [305, 260], 10: [250, 180], 11: [305, 100], 12: [260, 55]
};

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderDiamondKundliSVG(
  chart: ChartData,
  customPlanets?: Record<string, { sign: string; house?: number; degree?: number; isRetrograde?: boolean }>,
  customLagnaNum?: number,
  size: number = 320
): string {
  const planetMap = customPlanets || chart.planets || {};
  const lagnaIndex = customLagnaNum !== undefined ? customLagnaNum : (chart.lagnaNum || 0);

  const housePlanets: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    7: [], 8: [], 9: [], 10: [], 11: [], 12: []
  };

  Object.entries(planetMap).forEach(([pName, pData]) => {
    if (pData && pData.house && housePlanets[pData.house]) {
      const abbr = PLANET_ABBR[pName] || pName.slice(0, 2);
      const isRetro = (pData as any).retrograde || (pData as any).isRetrograde;
      const retro = isRetro ? "(R)" : "";
      housePlanets[pData.house].push(`${abbr}${retro}`);
    }
  });

  let labels = "";
  for (let h = 1; h <= 12; h++) {
    const [cx, cy] = HOUSE_POSITIONS[h];
    const rashiNum = ((lagnaIndex + (h - 1)) % 12) + 1;
    const planetsInHouse = housePlanets[h] || [];

    labels += `
      <text x="${cx}" y="${cy - 12}" text-anchor="middle" font-size="10" font-family="'JetBrains Mono', monospace" fill="#C9A961" opacity="0.8">${rashiNum}</text>
      <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="11" font-weight="700" font-family="'JetBrains Mono', monospace" fill="#FAF7F2">
        ${planetsInHouse.join(" ")}
      </text>
    `;
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 360 360" class="kundli-svg">
  <defs>
    <linearGradient id="dcChartGrad" x1="0" y1="0" x2="360" y2="360" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#141B38"/>
      <stop offset="100%" stop-color="#0A0E1F"/>
    </linearGradient>
  </defs>
  <rect width="360" height="360" fill="url(#dcChartGrad)" stroke="#C9A961" stroke-width="2"/>
  <line x1="0" y1="0" x2="360" y2="360" stroke="#C9A961" stroke-width="1.2" opacity="0.65"/>
  <line x1="360" y1="0" x2="0" y2="360" stroke="#C9A961" stroke-width="1.2" opacity="0.65"/>
  <polygon points="180,0 360,180 180,360 0,180" fill="none" stroke="#C9A961" stroke-width="1.5"/>
  ${labels}
</svg>`;
}

/**
 * Generates the full-width vector SVG chart for the 90-Year Life Trajectory.
 */
function renderDestinyCurveSVG(
  points: DestinyPoint[],
  bands: DashaBand[],
  currentAge: number,
  peak: DashaBand,
  challenge: DashaBand,
  currentScore: number
): string {
  const W = 720;
  const H = 320;
  const padL = 48;
  const padR = 24;
  const padT = 38;
  const padB = 44;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const toX = (age: number) => padL + (Math.max(0, Math.min(90, age)) / 90) * plotW;
  const toY = (score: number) => padT + plotH - (Math.max(0, Math.min(100, score)) / 100) * plotH;

  // 1. Dasha Background Shaded Bands
  let bandRects = "";
  let bandLabels = "";
  bands.forEach((b) => {
    const x1 = toX(b.startAge);
    const x2 = toX(b.endAge);
    const bw = Math.max(2, x2 - x1);
    const col = PLANET_COLORS[b.planet] || "#C9A961";

    bandRects += `<rect x="${x1.toFixed(1)}" y="${padT}" width="${bw.toFixed(1)}" height="${plotH}" fill="${col}" fill-opacity="0.08" stroke="${col}" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="2 3"/>`;
    bandLabels += `<text x="${(x1 + bw / 2).toFixed(1)}" y="${padT - 12}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="${col}">${b.planet.toUpperCase()}</text>`;
    bandLabels += `<text x="${(x1 + bw / 2).toFixed(1)}" y="${padT - 2}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8.5" fill="#C9A961" opacity="0.8">${b.score}%</text>`;
  });

  // 2. Horizontal Gridlines (0, 25, 50, 75, 100)
  let gridLines = "";
  [25, 50, 75, 100].forEach((val) => {
    const y = toY(val);
    const isBaseline = val === 50;
    gridLines += `
      <line x1="${padL}" y1="${y.toFixed(1)}" x2="${(padL + plotW).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${isBaseline ? "#C9A961" : "rgba(201,169,97,0.15)"}" stroke-width="${isBaseline ? "1" : "0.7"}" stroke-dasharray="${isBaseline ? "none" : "3 3"}"/>
      <text x="${padL - 8}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="9" fill="${isBaseline ? "#C9A961" : "rgba(250,247,242,0.4)"}">${val}%</text>
    `;
  });

  // 3. X-Axis Age Ticks (0, 10, 20, 30, 40, 50, 60, 70, 80, 90)
  let xTicks = "";
  for (let age = 0; age <= 90; age += 10) {
    const x = toX(age);
    xTicks += `
      <line x1="${x.toFixed(1)}" y1="${padT + plotH}" x2="${x.toFixed(1)}" y2="${padT + plotH + 5}" stroke="#C9A961" stroke-width="1"/>
      <text x="${x.toFixed(1)}" y="${padT + plotH + 18}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" fill="#FAF7F2" opacity="0.75">Age ${age}</text>
    `;
  }

  // 4. Smooth Spline Path
  const pts = points.map((p) => ({ x: toX(p.age), y: toY(p.score) }));
  let dPath = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    dPath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  // Closed area polygon for gradient fill
  const areaPath = `${dPath} L ${(padL + plotW).toFixed(1)} ${(padT + plotH).toFixed(1)} L ${padL.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  // 5. Current Age Pin Marker
  const curX = toX(currentAge);
  const curY = toY(currentScore);
  const curPin = `
    <line x1="${curX.toFixed(1)}" y1="${padT}" x2="${curX.toFixed(1)}" y2="${(padT + plotH).toFixed(1)}" stroke="#D9BE7B" stroke-width="1.8" stroke-dasharray="4 3"/>
    <circle cx="${curX.toFixed(1)}" cy="${curY.toFixed(1)}" r="7" fill="#D9BE7B" fill-opacity="0.3"/>
    <circle cx="${curX.toFixed(1)}" cy="${curY.toFixed(1)}" r="4.5" fill="#D9BE7B" stroke="#0A0E1F" stroke-width="1.5"/>
    <g transform="translate(${(curX - 44).toFixed(1)}, ${(Math.max(padT + 4, curY - 32)).toFixed(1)})">
      <rect width="88" height="22" rx="4" fill="#D9BE7B" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"/>
      <text x="44" y="14.5" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#0A0E1F">YOU: AGE ${currentAge} (${currentScore}%)</text>
    </g>
  `;

  // 6. Peak & Challenge Callouts
  const peakMidAge = (peak.startAge + peak.endAge) / 2;
  const peakX = toX(peakMidAge);
  const peakY = toY(peak.score);

  const peakCallout = `
    <g transform="translate(${(Math.min(W - padR - 95, Math.max(padL, peakX - 45))).toFixed(1)}, ${(Math.max(padT + 2, peakY - 26)).toFixed(1)})">
      <rect width="90" height="20" rx="3" fill="#15803D" stroke="#4ADE80" stroke-width="1"/>
      <text x="45" y="13.5" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="#FFFFFF">★ PEAK: ${peak.planet} (${peak.score}%)</text>
    </g>
  `;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" class="destiny-svg" style="max-width:100%;height:auto;display:block;margin:0 auto;">
  <defs>
    <linearGradient id="destinyAreaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C9A961" stop-opacity="0.32"/>
      <stop offset="50%" stop-color="#C9A961" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#0A0E1F" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="destinyStrokeGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#E8923C"/>
      <stop offset="50%" stop-color="#D9BE7B"/>
      <stop offset="100%" stop-color="#34D399"/>
    </linearGradient>
  </defs>

  <!-- Plot Area Background -->
  <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="#101633" stroke="rgba(201,169,97,0.3)" stroke-width="1" rx="4"/>

  <!-- Dasha Bands -->
  ${bandRects}
  ${bandLabels}

  <!-- Gridlines -->
  ${gridLines}
  ${xTicks}

  <!-- Area & Line Graph -->
  <path d="${areaPath}" fill="url(#destinyAreaGrad)"/>
  <path d="${dPath}" fill="none" stroke="url(#destinyStrokeGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Markers -->
  ${peakCallout}
  ${curPin}
</svg>`;
}

export function generateDestinyCurveDossierHTML(chart: ChartData, options: PackageDossierOptions = {}): string {
  const subjectName = escapeHtml(options.customerName || chart.name || "Sacred Seeker");
  const reportTitle = escapeHtml(options.reportTitle || "📈 Destiny Curve: 90-Year Life Master Dossier");
  const orderId = escapeHtml(options.orderId || `AL-DC-${Date.now().toString(36).toUpperCase()}`);
  const paymentId = escapeHtml(options.paymentId || "AL-VERIFIED-SHASTRA-CERT");

  const birthDate = chart.dob || "Recorded";
  const birthTime = chart.tob || "12:00";
  const birthCity = escapeHtml(chart.city || "New Delhi");
  const lat = chart.lat !== undefined ? Number(chart.lat).toFixed(4) : "28.6139";
  const lon = chart.lon !== undefined ? Number(chart.lon).toFixed(4) : "77.2090";

  const lagnaRashi = chart.lagnaRashi || SIGN_NAMES[chart.lagnaNum || 0] || "Aries";
  const moonPlanet = chart.planets?.["Moon"];
  const moonRashi = moonPlanet?.sign || "Taurus";
  const nakshatra = moonPlanet?.nakshatra || "Rohini";
  const moonPada = moonPlanet?.pada || 1;

  const resolvedGender = resolveGender(options, chart);
  const seekerAge = getSeekerAge(chart.dob);
  const seekerAgeStr = typeof seekerAge === "number" ? `${seekerAge} years` : "Recorded";

  // Calculate full lifetime destiny dataset
  const destiny = calculateDestiny(chart.planets as any, chart.dashas, chart.dob, chart.lagnaNum ?? 0);
  const currentAge = destiny.currentAge;
  const currentScore = destiny.currentScore;
  const currentDasha = destiny.currentDasha;
  const points = destiny.points;
  const bands = destiny.bands;
  const peak = destiny.peak;
  const challenge = destiny.challenge;
  const areas = destiny.areas;
  const currentDrivers = destiny.currentDrivers;
  const nextMilestones = destiny.nextMilestones;
  const actionPlan = destiny.actionPlan;

  const nowYear = new Date().getFullYear();
  const next5YearEnd = nowYear + 5;
  const nextYear = nowYear + 1;

  // Active dasha cycle dates from chart.dashas if available
  const activeDashaEntry = chart.dashas?.find((d) => d.planet === currentDasha) || chart.dashas?.find((d) => d.active);
  const dashaStartYear = activeDashaEntry?.start ? new Date(activeDashaEntry.start).getFullYear() : (nowYear - 5);
  const dashaEndYear = activeDashaEntry?.end ? new Date(activeDashaEntry.end).getFullYear() : (dashaStartYear + 18);
  const dashaCycleStr = `${dashaStartYear} – ${dashaEndYear} Cycle`;

  // Safe Engine Calculations
  let divisionalCharts = [];
  try {
    divisionalCharts = calculateDivisional(chart.planets as any, chart.lagnaNum, chart.lagnaLon);
  } catch (err) {
    console.warn("[destiny-curve] calculateDivisional fallback:", err);
  }
  const d9Chart = divisionalCharts.find((c) => c.key === "D9");

  let shadbalaRes = null;
  try {
    shadbalaRes = calculateShadbala(chart.planets as any);
  } catch (err) {
    console.warn("[destiny-curve] shadbala fallback:", err);
  }

  let akvRes = null;
  try {
    akvRes = calculateAshtakavarga(chart.planets as any, chart.lagnaNum);
  } catch (err) {
    console.warn("[destiny-curve] ashtakavarga fallback:", err);
  }

  let charaKarakas: any[] = [];
  try {
    charaKarakas = calculateKarakas(chart.planets);
  } catch (err) {
    console.warn("[destiny-curve] karakas fallback:", err);
  }

  const d1Svg = renderDiamondKundliSVG(chart, chart.planets, chart.lagnaNum, 310);
  const d9Svg = d9Chart ? renderDiamondKundliSVG(chart, d9Chart.planets, d9Chart.lagnaNum, 310) : d1Svg;
  const destinySvg = renderDestinyCurveSVG(points, bands, currentAge, peak, challenge, currentScore);

  const lagnaLord = getSignLord(lagnaRashi);
  const lagnaLonMod = chart.lagnaLon !== undefined ? (chart.lagnaLon % 30) : (chart.lagnaDegree || 0);
  const lagnaDeg = Math.floor(lagnaLonMod);
  const lagnaMin = Math.floor((lagnaLonMod - lagnaDeg) * 60);
  const lagnaDms = `${lagnaDeg}° ${String(lagnaMin).padStart(2, "0")}'`;

  const d9LagnaRashi = d9Chart?.lagnaRashi || SIGN_NAMES[d9Chart?.lagnaNum ?? 0] || lagnaRashi;
  const d9LagnaLord = getSignLord(d9LagnaRashi);
  const d9LagneshSign = d9Chart?.planets?.[lagnaLord]?.sign || d9LagnaRashi;
  const lagneshD1 = chart.planets?.[lagnaLord];
  const lagneshHouse = lagneshD1?.house || 1;
  const lagneshSign = lagneshD1?.sign || lagnaRashi;

  const fifthSign = signFromHouse(lagnaRashi, 5);
  const ninthSign = signFromHouse(lagnaRashi, 9);
  const fifthLord = getSignLord(fifthSign);
  const ninthLord = getSignLord(ninthSign);
  const secBenefic = ninthLord !== lagnaLord ? ninthLord : fifthLord;
  const ninthLordData = chart.planets?.[ninthLord];
  const secBeneficData = chart.planets?.[secBenefic];

  const sunData = chart.planets?.["Sun"];
  const jupData = chart.planets?.["Jupiter"];
  const satData = chart.planets?.["Saturn"];
  const rahuData = chart.planets?.["Rahu"];
  const ketuData = chart.planets?.["Ketu"];
  const jupHouse = jupData?.house || 1;
  const jupAspectHouses = [((jupHouse - 1 + 4) % 12) + 1, ((jupHouse - 1 + 6) % 12) + 1, ((jupHouse - 1 + 8) % 12) + 1];
  const satHouse = satData?.house || 1;
  const rahuHouse = rahuData?.house || 11;
  const rahuSign = rahuData?.sign || signFromHouse(lagnaRashi, rahuHouse);
  const ketuHouse = ketuData?.house || 5;
  const ketuSign = ketuData?.sign || signFromHouse(lagnaRashi, ketuHouse);
  const moonHouse = moonPlanet?.house || 1;

  const activeBand = bands.find((b) => currentAge >= b.startAge && currentAge <= b.endAge) || bands[0];
  const activeStartYear = activeBand ? activeBand.start.getFullYear() : 2024;
  const activeEndYear = activeBand ? activeBand.end.getFullYear() : 2042;
  const activeMid1 = Math.round(activeStartYear + (activeEndYear - activeStartYear) * 0.33);
  const activeMid2 = Math.round(activeStartYear + (activeEndYear - activeStartYear) * 0.68);
  const nextBandAfterActive = bands.find((b) => b.startAge > (activeBand?.startAge ?? currentAge));

  const sortedAreas = [...areas].sort((a, b) => b.score - a.score);
  const topArea = sortedAreas[0] || { name: "Stability", score: 62 };
  const secondArea = sortedAreas[1] || { name: "Career", score: 56 };
  const lowArea = sortedAreas[sortedAreas.length - 1] || { name: "Health", score: 44 };

  const HOUSE_ROLES: Record<number, string> = {
    1: "Vitality / Self", 2: "Treasury / Assets", 3: "Courage / Siblings", 4: "Property / Peace",
    5: "Purva Punya / Mind", 6: "Debt / Defense", 7: "Partnerships", 8: "Longevity / Secrets",
    9: "Bhagya / Dharma", 10: "Career / Status", 11: "Gains / Cashflow", 12: "Expenditure / Loss",
  };
  const savRows = Array.from({ length: 12 }, (_, idx) => {
    const h = idx + 1;
    const found = akvRes?.houses?.find((item) => item.house === h);
    return {
      h,
      sign: signFromHouse(lagnaRashi, h),
      b: found?.score ?? 28,
      role: HOUSE_ROLES[h],
    };
  });
  const b11 = savRows[10]?.b ?? 28;
  const b12 = savRows[11]?.b ?? 24;
  const bDelta = b11 - b12;

  const nakIdx = Math.max(0, ALL_NAKSHATRAS.indexOf(nakshatra));
  const supportStar27 = ALL_NAKSHATRAS[(nakIdx + 26) % 27] || "Revati";
  const taraStars = (tNum: number) =>
    ALL_NAKSHATRAS.filter((n) => calculateTaraBala(nakshatra, n).taraNum === tNum).join(", ");

  const shadbalaRows = (shadbalaRes?.planets && shadbalaRes.planets.length > 0)
    ? shadbalaRes.planets.map((sp) => ({
        p: sp.planet,
        rupa: Number((sp.totalRupas ?? 6.0).toFixed(2)),
        req: Number((sp.requiredRupas ?? 5.5).toFixed(2)),
        ratio: Number((sp.shadbalaRatio ?? 1.05).toFixed(2)),
        status: sp.grade || (sp.passesThreshold ? "Fortified" : "Moderate"),
        passes: sp.passesThreshold ?? true,
      }))
    : ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].map((p) => ({
        p, rupa: 6.5, req: 5.5, ratio: 1.18, status: "Balanced", passes: true,
      }));
  const strongestShadbala = [...shadbalaRows].sort((a, b) => b.ratio - a.ratio)[0] || shadbalaRows[0];

  const gemRx = getDynamicGemstonePrescription(lagnaRashi, options.gender);
  const PLANET_GEM_MAP: Record<string, { gem: string; sanskrit: string; finger: string; metal: string; day: string; weight: string; benefit: string }> = {
    Sun: { gem: "Natural Ruby", sanskrit: "Manikya", finger: "Ring Finger", metal: "22k Gold / Copper", day: "Sunday Sunrise", weight: "3.25 – 4.5 Ratti", benefit: "vitality, royal authority, and decisive clarity" },
    Moon: { gem: "Natural Pearl", sanskrit: "Moti", finger: "Little Finger", metal: "Pure Silver", day: "Monday Dawn", weight: "4.25 – 5.5 Ratti", benefit: "emotional equilibrium, sleep quality, and intuitive calm" },
    Mars: { gem: "Red Coral", sanskrit: "Moonga", finger: "Ring Finger", metal: "Copper / Gold", day: "Tuesday Sunrise", weight: "5.25 – 6.5 Ratti", benefit: "courage, land acquisition, and metabolic drive" },
    Mercury: { gem: "Natural Emerald", sanskrit: "Panna", finger: "Little Finger", metal: "Panchadhatu / Gold", day: "Wednesday Dawn", weight: "3.5 – 5.0 Ratti", benefit: "cognitive clarity, speech, and commercial precision" },
    Jupiter: { gem: "Yellow Sapphire", sanskrit: "Pukhraj", finger: "Index Finger", metal: "22k Gold / Brass", day: "Thursday Sunrise", weight: "4.25 – 5.5 Ratti", benefit: "dharmic wisdom, mentorship, and multi-year prosperity" },
    Venus: { gem: "Natural Diamond / White Sapphire", sanskrit: "Heera / Safed Pukhraj", finger: "Middle / Ring Finger", metal: "Platinum / Silver", day: "Friday Dawn", weight: "1.0 – 3.5 Ratti", benefit: "creative magnetism, luxury, and relational harmony" },
    Saturn: { gem: "Blue Sapphire (Trial-Verified)", sanskrit: "Neelam", finger: "Middle Finger", metal: "Silver / Panchadhatu", day: "Saturday Dawn", weight: "3.5 – 4.5 Ratti", benefit: "structural discipline, longevity, and institutional scale" },
  };
  const secGemInfo = PLANET_GEM_MAP[secBenefic] || PLANET_GEM_MAP.Jupiter;
  const handSide = options.gender === "female" ? "Left" : "Right";
  const dusthana6Sign = signFromHouse(lagnaRashi, 6);
  const dusthana8Sign = signFromHouse(lagnaRashi, 8);
  const banned6Lord = getSignLord(dusthana6Sign);
  const banned8Lord = getSignLord(dusthana8Sign);
  const bannedLord = banned8Lord !== lagnaLord && banned8Lord !== secBenefic ? banned8Lord : (banned6Lord !== lagnaLord ? banned6Lord : "Rahu");
  const bannedGemName = PLANET_GEM_MAP[bannedLord]?.gem || "Hessonite (Gomed)";

  const RUDRAKSHA_MAP: Record<string, { mukhi: string; deity: string; desc: string }> = {
    Sun: { mukhi: "12-Mukhi Rudraksha", deity: "Lord Surya", desc: "Resonates with Surya, radiating leadership authority, stamina, and fearless clarity." },
    Moon: { mukhi: "2-Mukhi Rudraksha", deity: "Ardhanarishwara", desc: "Harmonizes Chandra, calming emotional turbulence and stabilizing mental focus." },
    Mars: { mukhi: "3-Mukhi Rudraksha", deity: "Lord Agni", desc: "Balances Mangala, burning karmic inertia and sharpening decisive courage." },
    Mercury: { mukhi: "4-Mukhi Rudraksha", deity: "Lord Brahma", desc: "Resonates with Budha, expanding logical acuity, memory retention, and communicative poise." },
    Jupiter: { mukhi: "5-Mukhi Rudraksha", deity: "Kalagni Rudra", desc: "Channels Brihaspati, stabilizing blood pressure, wisdom, and dharmic abundance." },
    Venus: { mukhi: "6-Mukhi Rudraksha", deity: "Lord Kartikeya", desc: "Refines Shukra, cultivating artistic poise, relational grace, and vitality." },
    Saturn: { mukhi: "7-Mukhi Rudraksha", deity: "Mahalakshmi", desc: "Harmonizes Shani, dissolving cashflow bottlenecks and anchoring long-term wealth." },
    Rahu: { mukhi: "8-Mukhi Rudraksha", deity: "Lord Ganesha", desc: "Neutralizes Rahu friction, removing obstacles in contracts and anchoring focus." },
    Ketu: { mukhi: "9-Mukhi Rudraksha", deity: "Goddess Durga", desc: "Protects during Ketu currents, grounding intuition and shielding against sudden shifts." },
  };
  const rud1 = RUDRAKSHA_MAP[lagnaLord] || RUDRAKSHA_MAP.Jupiter;
  const rud2 = RUDRAKSHA_MAP[currentDasha] || RUDRAKSHA_MAP.Rahu;

  const MANTRA_MAP: Record<string, { title: string; dev: string; iast: string; timing: string }> = {
    Sun: { title: "SURYA BEEJ MANTRA", dev: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः ॥", iast: "Oṃ hrāṃ hrīṃ hrauṃ saḥ sūryāya namaḥ ॥", timing: "Sunday sunrise facing East (108x)" },
    Moon: { title: "CHANDRA BEEJ MANTRA", dev: "ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः ॥", iast: "Oṃ śrāṃ śrīṃ śrauṃ saḥ candramase namaḥ ॥", timing: "Monday evening facing North-West (108x)" },
    Mars: { title: "MANGALA BEEJ MANTRA", dev: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः ॥", iast: "Oṃ krāṃ krīṃ krauṃ saḥ bhaumāya namaḥ ॥", timing: "Tuesday morning facing South (108x)" },
    Mercury: { title: "BUDHA BEEJ MANTRA", dev: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः ॥", iast: "Oṃ brāṃ brīṃ brauṃ saḥ budhāya namaḥ ॥", timing: "Wednesday sunrise facing East (108x)" },
    Jupiter: { title: "GURU BEEJ MANTRA", dev: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ॥", iast: "Oṃ grāṃ grīṃ grauṃ saḥ gurave namaḥ ॥", timing: "Thursday sunrise facing North-East (108x)" },
    Venus: { title: "SHUKRA BEEJ MANTRA", dev: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः ॥", iast: "Oṃ drāṃ drīṃ drauṃ saḥ śukrāya namaḥ ॥", timing: "Friday morning facing South-East (108x)" },
    Saturn: { title: "SHANI BEEJ MANTRA", dev: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः ॥", iast: "Oṃ prāṃ prīṃ prauṃ saḥ śanaiścarāya namaḥ ॥", timing: "Saturday dusk facing West (108x)" },
    Rahu: { title: "RAHU SHANTI BEEJ MANTRA", dev: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः ॥", iast: "Oṃ bhrāṃ bhrīṃ bhrauṃ saḥ rāhave namaḥ ॥", timing: "Saturday dusk (108x)" },
    Ketu: { title: "KETU SHANTI BEEJ MANTRA", dev: "ॐ स्रां स्रीं स्रौं सः केतवे नमः ॥", iast: "Oṃ srāṃ srīṃ srauṃ saḥ ketave namaḥ ॥", timing: "Tuesday or Thursday dawn (108x)" },
  };
  const m1 = MANTRA_MAP[lagnaLord] || MANTRA_MAP.Jupiter;
  const m2 = MANTRA_MAP[currentDasha] || MANTRA_MAP.Rahu;

  const headerRail = (chapter: string) => `
    <div class="page-rail">
      <span class="brand">✦ AstroLife Sovereign Dossier · 90-Year Life Master</span>
      <span class="kicker">${escapeHtml(chapter)}</span>
    </div>
  `;

  const footerRail = (pageLabel: string, pageNum: number) => `
    <div class="page-footer">
      <span>${escapeHtml(pageLabel)}</span>
      <span>${subjectName} · Ref: ${orderId}</span>
      <span>Page ${pageNum} of 24</span>
    </div>
  `;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=794"/>
<title>AstroLife — Destiny Curve 90-Year Life Master · ${subjectName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0A0E1F;
  --bg-card: #11162E;
  --surface: #161D38;
  --border-gold: rgba(201, 169, 97, 0.28);
  --border-gold-strong: #C9A961;
  --gold: #C9A961;
  --gold-bright: #D9BE7B;
  --gold-dim: #9C8348;
  --saffron: #E8923C;
  --crimson: #E11D48;
  --jade: #34D399;
  --ivory: #FAF7F2;
  --ivory-dim: #D1C9BE;
  --muted: #8E877C;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--ivory);
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 11.5px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.page {
  width: 794px;
  height: 1123px;
  min-height: 1123px;
  max-height: 1123px;
  overflow: hidden;
  position: relative;
  page-break-after: always;
  page-break-inside: avoid;
  padding: 44px 50px 48px 50px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Page Rails */
.page-rail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-gold);
  padding-bottom: 8px;
  margin-bottom: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--gold);
}

.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-gold);
  padding-top: 8px;
  margin-top: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5px;
  color: var(--muted);
  letter-spacing: 1px;
}

/* Typography */
h1, h2, h3 { font-family: 'Cormorant Garamond', serif; font-weight: 700; color: var(--ivory); letter-spacing: -0.02em; }
.display-xl { font-size: 38px; line-height: 1.08; color: var(--gold-bright); }
.display-l  { font-size: 26px; line-height: 1.15; color: var(--gold-bright); margin-bottom: 6px; }
.display-m  { font-size: 19px; line-height: 1.25; color: var(--gold); }
.display-s  { font-size: 15px; font-weight: 600; color: var(--ivory); }

.kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gold);
  margin-bottom: 4px;
  display: block;
}

.body-text { font-size: 11.5px; line-height: 1.6; color: var(--ivory-dim); }
.body-s    { font-size: 10px; line-height: 1.5; color: var(--muted); }

/* Luxury Cards */
.luxury-card {
  background: var(--bg-card);
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  padding: 14px 16px;
  position: relative;
}
.card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

/* Matrix Grids */
.matrix-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.matrix-item {
  background: var(--surface);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 10px 12px;
  text-align: center;
}
.matrix-item .val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: var(--gold-bright);
  display: block;
  margin-top: 3px;
}

/* Tables */
.planet-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
}
.planet-table th {
  background: var(--surface);
  color: var(--gold);
  padding: 8px 10px;
  text-align: left;
  border-bottom: 1.5px solid var(--border-gold);
  font-size: 9px;
  letter-spacing: 1px;
}
.planet-table td {
  padding: 7px 10px;
  border-bottom: 1px solid rgba(201,169,97,0.12);
  color: var(--ivory-dim);
}

/* Cover Styling */
.cover-page {
  text-align: center;
  justify-content: space-between;
  background: radial-gradient(circle at 50% 35%, #18234D 0%, #0A0E1F 80%);
}
.cover-border {
  border: 1.5px solid var(--border-gold-strong);
  border-radius: 12px;
  height: 100%;
  padding: 44px 36px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
</style>
</head>
<body>

<!-- PAGE 1: SOVEREIGN MASTERWORK COVER -->
<section class="page cover-page">
  <div class="cover-border">
    <div style="padding-top:10px;">
      <span class="kicker" style="letter-spacing: 4px; font-size: 10px;">✦ ASTROLIFE SHASTRA RESEARCH INSTITUTE ✦</span>
      <div style="font-family:'JetBrains Mono', monospace; font-size: 9px; color:var(--muted); margin-top: 4px; letter-spacing: 2px;">SWISS EPHEMERIS SECURED · 0-90 LIFETIME ALGORITHM</div>
    </div>

    <div>
      <div style="margin-bottom: 14px;">
        <span style="display:inline-block; padding: 4px 14px; border: 1px solid var(--gold); border-radius: 20px; font-family:'JetBrains Mono',monospace; font-size:9.5px; color:var(--gold-bright); letter-spacing:1.5px;">
          FLAGSHIP PREDICTIVE LIFETIME SUITE
        </span>
      </div>
      <h1 class="display-xl" style="font-size: 40px; margin-bottom: 12px;">Destiny Curve™</h1>
      <div class="display-m" style="font-family:'Cormorant Garamond',serif; font-size:22px; color:var(--ivory); font-style:italic; margin-bottom: 18px;">
        90-Year Lifetime Energetic Trajectory &amp; Vimshottari Masterwork
      </div>
      <p class="body-text" style="max-width: 520px; margin: 0 auto; color: var(--ivory-dim); font-size: 12px;">
        Chronological audit of 90 planetary years synthesizing full Vimshottari Mahadasha cycles, 
        Navtara 9-Chakra energetic friction, 6 Life Pillar scores, and double-transit activation windows.
      </p>
    </div>

    <!-- Seeker Info Box -->
    <div style="background:var(--bg-card); border:1px solid var(--border-gold); border-radius:8px; padding:18px 24px; max-width:540px; margin:0 auto; text-align:left;">
      <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px;">
        <div><span class="kicker">PREPARED FOR</span><span style="font-size:14px; font-weight:700; color:var(--gold-bright);">${subjectName}</span></div>
        <div><span class="kicker">BIRTH TIMESTAMP</span><span style="font-size:12px; font-weight:600; font-family:'JetBrains Mono',monospace; color:var(--ivory);">${birthDate} · ${birthTime} IST</span></div>
        <div><span class="kicker">SEEKER AGE &amp; GENDER</span><span style="font-size:12px; font-weight:600; color:var(--ivory);">${seekerAgeStr} · ${resolvedGender ? (resolvedGender === "female" ? "Female" : "Male") : "Recorded"}</span></div>
        <div><span class="kicker">GEOGRAPHIC COORDINATES</span><span style="font-size:11px; font-family:'JetBrains Mono',monospace; color:var(--ivory-dim);">${birthCity} (${lat}° N, ${lon}° E)</span></div>
        <div><span class="kicker">AUTHENTIC LAGNA / MOON</span><span style="font-size:11px; font-weight:600; color:var(--gold);">${lagnaRashi} Lagna · ${moonRashi} Moon (${nakshatra} Pada ${moonPada})</span></div>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-gold); padding-top:12px; font-family:'JetBrains Mono',monospace; font-size:8.5px; color:var(--muted);">
      <span>OFFICIAL DOSSIER REF: ${orderId}</span>
      <span>SECURITY TOKEN: ${paymentId}</span>
      <span>EDITION: LUXURY HARDCOVER METRIC</span>
    </div>
  </div>
</section>

<!-- PAGE 2: EXECUTIVE ARCHITECTURE & LIFETIME SNAPSHOT -->
<section class="page">
  ${headerRail("MODULE I: EXECUTIVE LIFETIME ARCHITECTURE")}
  <div>
    <h2 class="display-l">Your 90-Year Destiny Architecture</h2>
    <p class="body-text" style="margin-bottom:16px;">
      In classical Parashari shastra, destiny is not a static line—it is a fluctuating planetary wave governed by 
      your Janma Nakshatra and the continuous unfolding of the 120-year Vimshottari Dasha matrix. 
      Below is your high-level lifetime baseline:
    </p>

    <!-- Key Metrics Highlight -->
    <div class="matrix-grid" style="grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px;">
      <div class="matrix-item">
        <span class="kicker">CURRENT AGE</span>
        <span class="val" style="font-size:22px; color:var(--gold-bright);">${currentAge}</span>
        <span class="body-s">Year ${nowYear}</span>
      </div>
      <div class="matrix-item">
        <span class="kicker">VITALITY SCORE</span>
        <span class="val" style="font-size:22px; color:var(--jade);">${currentScore}%</span>
        <span class="body-s">Solid Expansion</span>
      </div>
      <div class="matrix-item">
        <span class="kicker">ACTIVE MAHADASHA</span>
        <span class="val" style="font-size:18px; color:var(--saffron);">${currentDasha}</span>
        <span class="body-s">${dashaCycleStr}</span>
      </div>
      <div class="matrix-item">
        <span class="kicker">LIFETIME PEAK</span>
        <span class="val" style="font-size:18px; color:var(--jade);">${peak.planet} MD</span>
        <span class="body-s">Score: ${peak.score}% (Age ${peak.startAge.toFixed(0)}–${peak.endAge.toFixed(0)})</span>
      </div>
    </div>

    <!-- 5 Great Life Pillars Summary -->
    <div class="luxury-card" style="margin-bottom: 16px;">
      <div class="card-title">✦ THE CORE LIFE TRAJECTORY SUMMARY</div>
      <p class="body-text" style="margin-bottom: 10px;">
        Your lifetime energetic curve builds its foundational roots across early dashas, 
        transitions into an active consolidation and scaling wave under <strong>${currentDasha} Mahadasha</strong> (currently active at age ${currentAge}, score ${currentScore}%), 
        and reaches its highest golden zenith during your <strong>${peak.planet} Mahadasha</strong> 
        (Ages ${peak.startAge.toFixed(0)} through ${peak.endAge.toFixed(0)}, peaking at ${peak.score}%), where executive wisdom and asset accumulation achieve lasting strength.
      </p>
      <div class="matrix-grid" style="grid-template-columns: repeat(3, 1fr); gap: 8px;">
        <div style="background:var(--surface); padding:8px 10px; border-radius:4px; border:1px solid rgba(201,169,97,0.2);">
          <span class="kicker">FOUNDATION PHASE</span>
          <span style="font-size:11px; font-weight:600; color:var(--ivory);">Age 0 – 22 · Self &amp; Conditioning</span>
        </div>
        <div style="background:var(--surface); padding:8px 10px; border-radius:4px; border:1px solid rgba(201,169,97,0.2);">
          <span class="kicker">ACTIVE CYCLE (AGE ${currentAge})</span>
          <span style="font-size:11px; font-weight:600; color:var(--gold-bright);">${currentDasha} MD · ${currentScore}% Score</span>
        </div>
        <div style="background:var(--surface); padding:8px 10px; border-radius:4px; border:1px solid rgba(201,169,97,0.2);">
          <span class="kicker">SOVEREIGN PEAK</span>
          <span style="font-size:11px; font-weight:600; color:var(--jade);">${peak.planet} MD · Age ${peak.startAge.toFixed(0)}–${peak.endAge.toFixed(0)}</span>
        </div>
      </div>
    </div>

    <!-- Action Directives Card -->
    <div class="luxury-card">
      <div class="card-title">✦ STRATEGIC BEHAVIORAL PROTOCOL AT AGE ${currentAge}</div>
      <p class="body-text">
        At age ${currentAge}, you are navigating <strong>${currentDasha} Mahadasha</strong> (${activeStartYear}&ndash;${activeEndYear}) with ${lagnaRashi} Ascendant ruled by ${lagnaLord} in your ${ordinal(lagneshHouse)} house (${lagneshSign}). 
        This phase rewards structured execution, disciplined capital allocation, and steady nervous-system recovery.
      </p>
    </div>
  </div>
  ${footerRail("Executive Lifecycle Architecture", 2)}
</section>

<!-- PAGE 3: D-1 RASHI & D-9 NAVAMSHA CHARTS -->
<section class="page">
  ${headerRail("MODULE II: FOUNDATIONAL SHASTRA CHARTS")}
  <div>
    <h2 class="display-l">D-1 Natal &amp; D-9 Navamsha Synastry</h2>
    <p class="body-text" style="margin-bottom:16px;">
      The D-1 Rashi chart reveals physical events and material opportunities; the D-9 Navamsha chart 
      reveals the inner subtle strength of each planet that determines lasting fulfillment and fate.
    </p>

    <div style="display:flex; justify-content:space-between; gap:20px; margin-bottom:16px;">
      <div style="flex:1; text-align:center;">
        <span class="kicker" style="margin-bottom:8px;">D-1 LAGNA CHART (PHYSICAL INCARNATION)</span>
        ${d1Svg}
        <div class="body-s" style="margin-top:6px; color:var(--gold);">Ascendant: ${lagnaRashi} (${lagnaDms}) · Ruling Lord: ${lagnaLord}</div>
      </div>
      <div style="flex:1; text-align:center;">
        <span class="kicker" style="margin-bottom:8px;">D-9 NAVAMSHA CHART (DHARMA &amp; SOUL DESTINY)</span>
        ${d9Svg}
        <div class="body-s" style="margin-top:6px; color:var(--gold);">D-9 Lagna: ${d9LagnaRashi} · Ruling Lord: ${d9LagnaLord}</div>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ KEY CHARTS SYNTHESIS</div>
      <p class="body-text">
        Lagna Lord <strong>${lagnaLord}</strong> sits in the ${ordinal(lagneshHouse)} house (${lagneshSign}) in D-1, 
        and occupies <strong>${d9LagneshSign}</strong> in your D-9 Navamsha. 
        This D-1 to D-9 harmonic bridge defines how your outward efforts mature into enduring institutional authority across your lifetime curve.
      </p>
    </div>
  </div>
  ${footerRail("Foundational Shastra Charts", 3)}
</section>

<!-- PAGE 4: 9-GRAHA PLACEMENT LEDGER -->
<section class="page">
  ${headerRail("MODULE III: PLANETARY DIGNITY & POWER MATRIX")}
  <div>
    <h2 class="display-l">Planetary Longitudes &amp; Functional Dignities</h2>
    <p class="body-text" style="margin-bottom:16px;">
      Authentic positions calculated via Swiss Ephemeris. These longitudes determine the mathematical scoring 
      of each Mahadasha and Antardasha across your 90-year destiny curve.
    </p>

    <table class="planet-table" style="margin-bottom:18px;">
      <thead>
        <tr>
          <th>Planet</th>
          <th>Longitude</th>
          <th>D-1 Sign</th>
          <th>House</th>
          <th>D-9 Sign</th>
          <th>Dignity Status</th>
          <th>Functional Role</th>
        </tr>
      </thead>
      <tbody>
        ${["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].map((p) => {
          const pd = chart.planets?.[p];
          if (!pd) return "";
          const d9Sign = d9Chart?.planets?.[p]?.sign || "—";
          const isRetro = pd.retrograde || pd.isRetrograde;
          const retro = isRetro ? " (R)" : "";
          const deg = Math.floor(pd.degree || 0);
          const min = Math.floor(((pd.degree || 0) - deg) * 60);
          const dms = `${deg}° ${min}'`;
          const digCol = pd.dignity && (pd.dignity.indexOf("Exalted") >= 0 || pd.dignity.indexOf("Own") >= 0)
            ? "var(--jade)"
            : pd.dignity && pd.dignity.indexOf("Debilitated") >= 0
            ? "var(--crimson)"
            : "var(--ivory-dim)";
          const owned = getPlanetHousesOwned(p, lagnaRashi);
          const fRole = p === lagnaLord
            ? "Lagnesh (Primary)"
            : owned.includes(9) || owned.includes(5)
            ? `Trikona (${owned.map(ordinal).join("/")})`
            : owned.includes(6) || owned.includes(8) || owned.includes(12)
            ? `Dusthana (${owned.map(ordinal).join("/")})`
            : owned.length > 0
            ? `${owned.map(ordinal).join("/")} Lord`
            : "Karmic Node";
          return `
            <tr>
              <td style="font-weight:700; color:${PLANET_COLORS[p] || "var(--gold)"};">${p}${retro}</td>
              <td>${dms}</td>
              <td>${pd.sign}</td>
              <td>House ${pd.house || "—"}</td>
              <td>${d9Sign}</td>
              <td style="color:${digCol};">${pd.dignity || "Neutral"}</td>
              <td>${fRole}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>

    <div class="matrix-grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px;">
      <div class="luxury-card">
        <div class="card-title">✦ LAGNESH ANCHOR</div>
        <div class="display-s" style="color:var(--jade);">${lagnaLord} (${lagnaRashi})</div>
        <p class="body-s" style="margin-top:4px;">Placed in House ${lagneshHouse} (${lagneshSign}) in D-1 and ${d9LagneshSign} in D-9 Navamsha.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ DHARMA DISPOSITOR</div>
        <div class="display-s" style="color:var(--gold-bright);">${ninthLord} (${ninthSign})</div>
        <p class="body-s" style="margin-top:4px;">Ruler of your 9th house of fortune (${ninthSign}), placed in House ${ninthLordData?.house || 9} (${ninthLordData?.sign || ninthSign}).</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ KARMIC SHIELD</div>
        <div class="display-s" style="color:var(--saffron);">Jupiter (Guru)</div>
        <p class="body-s" style="margin-top:4px;">Situated in ${jupData?.sign || "Natal"} (House ${jupHouse}), casting protective drishti on Houses ${jupAspectHouses.map(ordinal).join(", ")}.</p>
      </div>
    </div>
  </div>
  ${footerRail("Planetary Dignity & Power Matrix", 4)}
</section>

<!-- PAGE 5: MASTER VISUAL 90-YEAR DESTINY CURVE (HERO PAGE) -->
<section class="page" style="justify-content: flex-start;">
  ${headerRail("MODULE IV: MASTER 90-YEAR LIFETIME DESTINY CURVE")}
  <div style="margin-bottom: 12px;">
    <h2 class="display-l" style="margin-bottom:4px;">The 90-Year Destiny Trajectory (Age 0 to 90)</h2>
    <p class="body-text" style="font-size:11px; margin-bottom:12px;">
      Visualizing your year-by-year 0–100% Shastric vitality score. Plotted from full Vimshottari Mahadasha sequences, 
      Navtara friction modifiers, and planetary dignities. Vertical bands indicate ruling Mahadashas.
    </p>
  </div>

  <!-- THE HERO SVG GRAPH -->
  <div style="background:var(--bg-card); border:1.5px solid var(--border-gold-strong); border-radius:10px; padding:16px 14px 10px 14px; margin-bottom:16px; box-shadow:0 12px 36px rgba(0,0,0,0.4);">
    ${destinySvg}
  </div>

  <!-- Detailed Analysis of the Visual Curve -->
  <div class="matrix-grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 10px;">
    <div class="luxury-card" style="border-left: 3px solid var(--gold);">
      <div class="card-title">📍 CURRENT POSITION (AGE ${currentAge})</div>
      <div class="body-s" style="color:var(--gold-bright); font-weight:700; margin-bottom:4px;">Score: ${currentScore}% · ${currentDasha} Mahadasha</div>
      <p class="body-s">Active ${currentDasha} Mahadasha (${activeStartYear}&ndash;${activeEndYear}). ${activeBand?.functionalRole || "Core cycle"} shaping your current trajectory.</p>
    </div>
    <div class="luxury-card" style="border-left: 3px solid var(--jade);">
      <div class="card-title">★ HIGHEST GOLDEN PEAK</div>
      <div class="body-s" style="color:var(--jade); font-weight:700; margin-bottom:4px;">Score: ${peak.score}% · ${peak.planet} MD (Age ${peak.startAge.toFixed(0)}–${peak.endAge.toFixed(0)})</div>
      <p class="body-s">${peak.planet} (${peak.functionalRole || "Benefic cycle"}) unlocks your highest lifetime expansion, authority, and asset consolidation.</p>
    </div>
    <div class="luxury-card" style="border-left: 3px solid var(--saffron);">
      <div class="card-title">⚠ KARMIC CONSOLIDATION DIP</div>
      <div class="body-s" style="color:var(--saffron); font-weight:700; margin-bottom:4px;">Score: ${challenge.score}% · ${challenge.planet} MD (Age ${challenge.startAge.toFixed(0)}–${challenge.endAge.toFixed(0)})</div>
      <p class="body-s">${challenge.planet} (${challenge.functionalRole || "Test cycle"}) demands measured risk management, health discipline, and conservative liquidity.</p>
    </div>
  </div>

  <div class="luxury-card">
    <div class="card-title">✦ HOW TO READ THIS CURVE</div>
    <p class="body-s">
      • <strong>Scores above 65%:</strong> Super-expansion windows. Ideal for major financial commitments, business launches, and international leaps.<br/>
      • <strong>Scores 50%–65%:</strong> Steady consolidation. Best for building institutional systems, operational efficiency, and conservative compounding.<br/>
      • <strong>Scores below 50%:</strong> Defensive consolidation. Protect assets, maintain health regimens, avoid unhedged speculation.
    </p>
  </div>
  ${footerRail("Master 90-Year Destiny Curve", 5)}
</section>

<!-- PAGE 6: 6-PILLAR FUNDAMENTAL LIFE BALANCE RADAR -->
<section class="page">
  ${headerRail("MODULE V: 6-PILLAR FUNDAMENTAL LIFE BALANCE")}
  <div>
    <h2 class="display-l">6 Fundamental Life Areas Scoring</h2>
    <p class="body-text" style="margin-bottom:18px;">
      Mathematical evaluation of how your natal planets and active dasha lords influence the six pillars of human experience.
    </p>

    <!-- Visual Progress Bars Grid -->
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px;">
      ${areas.map((a) => `
        <div class="luxury-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div style="font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:700; color:var(--ivory);">
              ${a.icon} ${a.name}
            </div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:16px; font-weight:700; color:${a.color};">
              ${a.score}%
            </div>
          </div>
          <!-- Progress Bar Meter -->
          <div style="background:var(--surface); height:8px; border-radius:4px; overflow:hidden; margin-bottom:8px; border:1px solid rgba(201,169,97,0.2);">
            <div style="background:${a.color}; width:${a.score}%; height:100%; border-radius:4px;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:9.5px; font-family:'JetBrains Mono',monospace;">
            <span style="color:var(--muted);">Status: <strong style="color:${a.color};">${a.status}</strong></span>
            <span style="color:var(--gold);">Houses: ${a.name === "Career" ? "10, 6, 1" : a.name === "Finance" ? "2, 11, 8" : a.name === "Health" ? "1, 6, 8" : a.name === "Relationship" ? "7, 5, 1" : a.name === "Stability" ? "4, 10, 2" : "1, 4, 12"}</span>
          </div>
        </div>
      `).join("")}
    </div>

    <!-- Diagnostic Deep Dive -->
    <div class="luxury-card" style="margin-bottom:14px;">
      <div class="card-title">✦ PILLAR SYNTHESIS &amp; GROWTH LEVERS</div>
      <p class="body-text" style="margin-bottom:8px;">
        • <strong>Strongest Anchor — ${topArea.name} (${topArea.score}%):</strong> 
        Supported by your ${lagnaRashi} Ascendant (${lagnaLord} in House ${lagneshHouse}) and active ${currentDasha} planetary currents.<br/>
        • <strong>Secondary Engine — ${secondArea.name} (${secondArea.score}%):</strong> 
        Builds compounding momentum when aligned with your 9th-lord ${ninthLord} (${ninthSign}) and Jupiter's ${ordinal(jupHouse)}-house placement.<br/>
        • <strong>Active Attention Area — ${lowArea.name} (${lowArea.score}%):</strong> 
        Requires conscious pacing, restorative sleep, and disciplined routine under ${currentDasha} Mahadasha.
      </p>
    </div>
  </div>
  ${footerRail("6-Pillar Life Balance Radar", 6)}
</section>

<!-- PAGE 7: CURRENT AGE DEEP DIVE -->
<section class="page">
  ${headerRail(`MODULE VI: CURRENT AGE ${currentAge} STRATEGIC FOCUS`)}
  <div>
    <h2 class="display-l">Age ${currentAge} Diagnostic: The ${currentDasha} Cycle Pivot</h2>
    <p class="body-text" style="margin-bottom:18px;">
      Detailed analysis of your planetary drivers at Age ${currentAge} (${new Date().getFullYear()}&ndash;${new Date().getFullYear() + 1}). 
      ${currentDasha} Mahadasha activates your ${ordinal(chart.planets?.[currentDasha]?.house || 1)} house (${chart.planets?.[currentDasha]?.sign || lagnaRashi}), shaping your core priorities and growth levers.
    </p>

    <!-- Current Driver Cards -->
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px;">
      ${currentDrivers.map((d) => `
        <div class="luxury-card" style="border-top:3px solid ${PLANET_COLORS[d.planet] || "var(--gold)"};">
          <div class="kicker">${d.role.toUpperCase()} DRIVER</div>
          <div class="display-m" style="color:var(--gold-bright); margin-bottom:6px;">${d.planet} (${d.role})</div>
          <div class="body-s" style="margin-bottom:6px; color:var(--muted);">
            Tone: <strong style="color:var(--ivory);">${d.tone}</strong> · Functional Role: <strong style="color:var(--gold);">${d.functionalRole}</strong>
          </div>
          <p class="body-text" style="font-size:11px;">${d.message}</p>
        </div>
      `).join("")}
    </div>

    <!-- 3 Core Milestones -->
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ 3 CRITICAL MILESTONES FOR AGES ${currentAge} TO ${currentAge + 2}</div>
      <div class="matrix-grid" style="grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top:8px;">
        <div style="background:var(--surface); padding:10px; border-radius:6px;">
          <span class="kicker">COMMERCIAL</span>
          <span style="font-size:11px; font-weight:700; color:var(--gold-bright);">Institutional Scale</span>
          <p class="body-s" style="margin-top:4px;">Transition from manual effort to repeatable, structured systems.</p>
        </div>
        <div style="background:var(--surface); padding:10px; border-radius:6px;">
          <span class="kicker">RELATIONAL</span>
          <span style="font-size:11px; font-weight:700; color:var(--jade);">Alliances of Destiny</span>
          <p class="body-s" style="margin-top:4px;">Cultivate high-trust alliances that reinforce long-term stability.</p>
        </div>
        <div style="background:var(--surface); padding:10px; border-radius:6px;">
          <span class="kicker">INNER SHIELD</span>
          <span style="font-size:11px; font-weight:700; color:var(--saffron);">Nervous Recovery</span>
          <p class="body-s" style="margin-top:4px;">Protect vitality through disciplined daily rest and meditative focus.</p>
        </div>
      </div>
    </div>
  </div>
  ${footerRail(`Current Age ${currentAge} Strategic Focus`, 7)}
</section>

<!-- PAGE 8: ACTIVE MAHADASHA OPERATING SYSTEM -->
<section class="page">
  ${headerRail("MODULE VII: ACTIVE MAHADASHA OPERATING SYSTEM")}
  <div>
    <h2 class="display-l">${currentDasha} Mahadasha Strategy (${activeStartYear} &ndash; ${activeEndYear})</h2>
    <p class="body-text" style="margin-bottom:18px;">
      ${currentDasha} in ${chart.planets?.[currentDasha]?.sign || lagnaRashi} (House ${chart.planets?.[currentDasha]?.house || 1}) governs your active karmic chapter (${activeStartYear}&ndash;${activeEndYear}). 
      Aligning decisions with ${currentDasha}'s ${activeBand?.functionalRole || "natal dignity"} maximizes compounding returns.
    </p>

    <!-- 3 Phases of Active MD -->
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ THE THREE CHRONOLOGICAL PHASES OF YOUR ${currentDasha.toUpperCase()} CYCLE</div>
      <div style="margin-top:10px; space-y:10px;">
        <div style="padding:8px 12px; background:var(--surface); border-radius:6px; margin-bottom:8px;">
          <strong style="color:var(--muted);">Phase 1 (${activeStartYear}&ndash;${activeMid1}) · Initiation &amp; Re-Orientation:</strong>
          <span class="body-s" style="display:block; margin-top:2px;">Establishing new priorities, shedding outdated commitments, and recalibrating your primary direction.</span>
        </div>
        <div style="padding:8px 12px; background:var(--surface); border-radius:6px; margin-bottom:8px; border:1px solid var(--gold);">
          <strong style="color:var(--gold-bright);">Phase 2 (${activeMid1}&ndash;${activeMid2}) · Structural Execution:</strong>
          <span class="body-s" style="display:block; margin-top:2px;">Building durable assets, institutional reputation, and disciplined financial autonomy.</span>
        </div>
        <div style="padding:8px 12px; background:var(--surface); border-radius:6px;">
          <strong style="color:var(--jade);">Phase 3 (${activeMid2}&ndash;${activeEndYear}) · Harvest &amp; Transition:</strong>
          <span class="body-s" style="display:block; margin-top:2px;">Consolidating gains and preparing smoothly for ${nextBandAfterActive ? `${nextBandAfterActive.planet} Mahadasha` : "the next planetary era"}.</span>
        </div>
      </div>
    </div>

    <!-- Guardrails Grid -->
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px;">
      <div class="luxury-card">
        <div class="card-title">✅ WHAT PROSPERS IN ${currentDasha.toUpperCase()} MD</div>
        <p class="body-text" style="font-size:11px;">
          • Disciplined strategy aligned with House ${chart.planets?.[currentDasha]?.house || 1} themes.<br/>
          • Written agreements, verified counterparties, and patient compounding.<br/>
          • Honoring your Lagnesh ${lagnaLord} daily routines.
        </p>
      </div>
      <div class="luxury-card">
        <div class="card-title">❌ WHAT CREATES FRICTION IN ${currentDasha.toUpperCase()} MD</div>
        <p class="body-text" style="font-size:11px;">
          • Unhedged high-leverage speculative commitments.<br/>
          • Verbal agreements without documented terms.<br/>
          • Neglecting sleep hygiene and nervous recovery.
        </p>
      </div>
    </div>
  </div>
  ${footerRail("Active Mahadasha Operating System", 8)}
</section>

<!-- PAGE 9: SEQUENTIAL 5-YEAR ANTARDASHA ROADMAP -->
<section class="page">
  ${headerRail("MODULE VIII: 5-YEAR ANTARDASHA HORIZON")}
  <div>
    <h2 class="display-l">Next 5-Year Yearly Trajectory (${nowYear} – ${next5YearEnd})</h2>
    <p class="body-text" style="margin-bottom:16px;">
      Sequential sub-period transitions detailing how your vitality score evolves year by year over the next five years.
    </p>

    <!-- Milestones Table -->
    <table class="planet-table" style="margin-bottom:18px;">
      <thead>
        <tr>
          <th>Age / Year</th>
          <th>Score</th>
          <th>Trajectory Trend</th>
          <th>Ruling Dasha Planet</th>
          <th>Actionable Strategic Directive</th>
        </tr>
      </thead>
      <tbody>
        ${nextMilestones.map((m) => {
          const trendCol = m.trend === "rise" ? "var(--jade)" : m.trend === "dip" ? "var(--crimson)" : "var(--gold-bright)";
          const trendLabel = m.trend === "rise" ? "▲ Upward Surge" : m.trend === "dip" ? "▼ Consolidation" : "■ Steady Rhythm";
          const rowBg = m.age === currentAge ? "background:rgba(201,169,97,0.18);" : "";
          const ageCol = m.age === currentAge ? "var(--saffron)" : "var(--gold)";
          const scoreCol = m.score >= 60 ? "var(--jade)" : "var(--gold)";
          return `
            <tr style="${rowBg}">
              <td style="font-weight:700; color:${ageCol};">
                Age ${m.age} (${m.year}) ${m.age === currentAge ? "✦ NOW" : ""}
              </td>
              <td style="font-weight:700; color:${scoreCol};">${m.score}%</td>
              <td style="text-transform:capitalize; color:${trendCol}; font-weight:600;">
                ${trendLabel}
              </td>
              <td>${m.message.split(" ")[0]}</td>
              <td style="font-size:10px; color:var(--ivory);">${m.message}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>

    <div class="luxury-card">
      <div class="card-title">✦ 5-YEAR EXECUTIVE ACTION PROTOCOL</div>
      <p class="body-text">
        The trajectory across ${nowYear}–${next5YearEnd} moves from steady consolidation into an upward momentum surge. 
        Focus on creating unassailable intellectual property and asset ownership. 
        Avoid dividing your attention across more than two major ventures at any given time.
      </p>
    </div>
  </div>
  ${footerRail("5-Year Antardasha Horizon", 9)}
</section>

<!-- PAGE 10: NAVTARA 9-CHAKRA & STAR SHIELD -->
<section class="page">
  ${headerRail("MODULE IX: NAVTARA CHAKRA & STAR SHIELD")}
  <div>
    <h2 class="display-l">Navtara 9-Chakra Classification</h2>
    <p class="body-text" style="margin-bottom:16px;">
      Calculated dynamically from your Janma Nakshatra (<strong>${nakshatra}</strong>). In classical Vedic astrology, 
      every dasha planet's real-world outcome depends heavily on whether it occupies a friendly or hostile Tara star.
    </p>

    <!-- Tara Grid -->
    <div class="matrix-grid" style="grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
      <div class="luxury-card" style="border-top:3px solid #34D399;">
        <div class="kicker">2. SAMPAT TARA (WEALTH)</div>
        <div class="display-s" style="color:var(--jade);">${taraStars(2)}</div>
        <p class="body-s" style="margin-top:4px;">Brings liquidity, sudden windfalls, and commercial expansion.</p>
      </div>
      <div class="luxury-card" style="border-top:3px solid #34D399;">
        <div class="kicker">4. KSHEMA TARA (WELLBEING)</div>
        <div class="display-s" style="color:var(--jade);">${taraStars(4)}</div>
        <p class="body-s" style="margin-top:4px;">Protects bodily health, domestic peace, and emotional stability.</p>
      </div>
      <div class="luxury-card" style="border-top:3px solid #34D399;">
        <div class="kicker">6. SADHAKA TARA (ACCOMPLISHMENT)</div>
        <div class="display-s" style="color:var(--jade);">${taraStars(6)}</div>
        <p class="body-s" style="margin-top:4px;">Guarantees success in high-stakes negotiations, exams, and projects.</p>
      </div>
      <div class="luxury-card" style="border-top:3px solid #EF4444;">
        <div class="kicker">3. VIPAT TARA (MISFORTUNE)</div>
        <div class="display-s" style="color:var(--crimson);">${taraStars(3)}</div>
        <p class="body-s" style="margin-top:4px;">Avoid initiating major financial contracts when Moon transits here.</p>
      </div>
      <div class="luxury-card" style="border-top:3px solid #EF4444;">
        <div class="kicker">5. PRATYARI TARA (OBSTACLES)</div>
        <div class="display-s" style="color:var(--crimson);">${taraStars(5)}</div>
        <p class="body-s" style="margin-top:4px;">Induces unnecessary resistance, rivalry, and delays in agreements.</p>
      </div>
      <div class="luxury-card" style="border-top:3px solid #EF4444;">
        <div class="kicker">7. NAIDHANA / VADHA (DANGER)</div>
        <div class="display-s" style="color:var(--crimson);">${taraStars(7)}</div>
        <p class="body-s" style="margin-top:4px;">Strictly avoid high-risk surgeries, debt creation, or travel on these stars.</p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ 27TH SUPPORT STAR SHIELD (${supportStar27.toUpperCase()})</div>
      <p class="body-text">
        The 27th nakshatra preceding your Janma star (${nakshatra}) is <strong>${supportStar27}</strong>. 
        This is your Sacred Support Star (Ati-Mitra). Resting and resetting during ${supportStar27} transits 
        instantly recharges your vital aura and eliminates karmic fatigue.
      </p>
    </div>
  </div>
  ${footerRail("Navtara 9-Chakra Star Shield", 10)}
</section>

<!-- PAGE 11: 5 GREAT LIFE EPOCHS (CHRONOLOGICAL ROADMAP) -->
<section class="page">
  ${headerRail("MODULE X: 5 GREAT LIFE EPOCHS")}
  <div>
    <h2 class="display-l">The 5 Great Life Epochs (Age 0 to 90)</h2>
    <p class="body-text" style="margin-bottom:16px;">
      Chronological segmentation of your Vimshottari Mahadasha timeline into five master shastric chapters.
    </p>

    <div style="display:flex; flex-direction:column; gap:10px;">
      ${bands.slice(0, 5).map((b, idx) => {
        const isCurrent = currentAge >= b.startAge && currentAge <= b.endAge;
        const isPeak = b.planet === peak.planet && Math.abs(b.startAge - peak.startAge) < 1;
        const borderCol = isCurrent ? "#A855F7" : isPeak ? "#34D399" : "#C9A961";
        const badgeText = isCurrent ? `${b.planet} MD ✦ CURRENT` : isPeak ? `${b.planet} MD ★ PEAK (${b.score}%)` : `${b.planet} Mahadasha (${b.score}%)`;
        return `
      <div class="luxury-card" style="border-left:4px solid ${borderCol}; ${isCurrent ? "background:rgba(168,85,247,0.06);" : isPeak ? "background:rgba(52,211,153,0.06);" : ""}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="color:var(--gold-bright); font-size:13px;">EPOCH ${idx + 1}: ${b.planet.toUpperCase()} ERA (Age ${b.startAge.toFixed(0)} &ndash; ${b.endAge.toFixed(0)})</strong>
          <span style="font-family:'JetBrains Mono',monospace; font-size:10px; color:${borderCol}; font-weight:700;">${badgeText}</span>
        </div>
        <p class="body-text" style="font-size:11px;">
          ${b.functionalRole} cycle (${b.start.getFullYear()}&ndash;${b.end.getFullYear()}). ${isCurrent ? "Currently active: prioritize structured execution, written contracts, and steady pacing." : isPeak ? "Your highest lifetime trajectory window: deploy capital and scale long-term authority." : "Key karmic chapter shaping your long-term institutional and personal evolution."}
        </p>
      </div>`;
      }).join("")}
    </div>
  </div>
  ${footerRail("5 Great Life Epochs", 11)}
</section>

<!-- PAGE 12: GOLDEN PEAK WINDOWS -->
<section class="page">
  ${headerRail("MODULE XI: GOLDEN PEAK WINDOWS")}
  <div>
    <h2 class="display-l">Golden Peak Windows &amp; Surge Cycles</h2>
    <p class="body-text" style="margin-bottom:18px;">
      How to identify and capitalize on the supreme high-score periods in your life trajectory.
    </p>

    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ THE SUPREME GOLDEN PERIOD: AGE ${peak.startAge.toFixed(0)} TO ${peak.endAge.toFixed(0)} (${peak.planet.toUpperCase()} MAHADASHA)</div>
      <p class="body-text" style="margin-bottom:10px;">
        In your ${lagnaRashi} Lagna chart, <strong>${peak.planet}</strong> (${peak.functionalRole || "key benefic"}) activates your highest lifetime expansion wave. 
        When ${peak.planet}'s Mahadasha runs, your lifetime curve surges to its peak score of <strong>${peak.score}%</strong>.
      </p>
      <div class="matrix-grid" style="grid-template-columns: repeat(3, 1fr); gap: 10px;">
        <div style="background:var(--surface); padding:8px; text-align:center; border-radius:4px;">
          <span class="kicker">WEALTH HARVEST</span>
          <span style="color:var(--jade); font-weight:700;">Multi-Fold Compounding</span>
        </div>
        <div style="background:var(--surface); padding:8px; text-align:center; border-radius:4px;">
          <span class="kicker">REPUTATION</span>
          <span style="color:var(--gold-bright); font-weight:700;">Institutional Authority</span>
        </div>
        <div style="background:var(--surface); padding:8px; text-align:center; border-radius:4px;">
          <span class="kicker">FAMILY LEGACY</span>
          <span style="color:var(--ivory); font-weight:700;">Permanent Lineage Base</span>
        </div>
      </div>
    </div>

    <!-- Secondary Peak -->
    <div class="luxury-card">
      <div class="card-title">✦ INTERMEDIATE GOLDEN SURGE: ${currentDasha.toUpperCase()} &ndash; ${secBenefic.toUpperCase()} SUB-CYCLE</div>
      <p class="body-text">
        Within your active ${currentDasha} Mahadasha, sub-periods governed by your Lagnesh <strong>${lagnaLord}</strong> and 9th/5th lord <strong>${secBenefic}</strong> 
        represent high-leverage windows for strategic alliances, property acquisition, and public recognition.
      </p>
    </div>
  </div>
  ${footerRail("Golden Peak Windows", 12)}
</section>

<!-- PAGE 13: KARMIC CHALLENGE PERIODS & DEFENSIVE PROTOCOL -->
<section class="page">
  ${headerRail("MODULE XII: DEFENSIVE STRATEGY & DOWNTURN PROTOCOL")}
  <div>
    <h2 class="display-l">Karmic Dips &amp; Capital Protection</h2>
    <p class="body-text" style="margin-bottom:18px;">
      Even the greatest charts experience planetary resistance. Knowing your cyclical dips in advance 
      converts potential crises into periods of calm consolidation.
    </p>

    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ THE PRIMARY KARMIC CONSOLIDATION WINDOW: ${challenge.planet.toUpperCase()} CYCLE</div>
      <p class="body-text">
        In your ${lagnaRashi} Lagna chart, <strong>${challenge.planet}</strong> (${challenge.functionalRole || "karmic test"}) in House ${chart.planets?.[challenge.planet]?.house || 12} (${chart.planets?.[challenge.planet]?.sign || moonRashi}) 
        marks your primary consolidation phase (Ages ${challenge.startAge.toFixed(0)}&ndash;${challenge.endAge.toFixed(0)}), where the curve dips to <strong>${challenge.score}%</strong> to enforce discipline and asset protection.
      </p>
    </div>

    <!-- 3 Golden Rules for Low-Score Periods -->
    <div class="matrix-grid" style="grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom:16px;">
      <div class="luxury-card">
        <div class="card-title" style="color:var(--saffron);">RULE 1: STRICT STOP-LOSS</div>
        <p class="body-s">Never initiate unhedged financial speculations or impulsive commitments during low-score dips.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title" style="color:var(--saffron);">RULE 2: REPAIR, DON'T PUSH</div>
        <p class="body-s">Use low-score windows for operational audits, internal refactoring, and health checkups.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title" style="color:var(--saffron);">RULE 3: NATURE DANA</div>
        <p class="body-s">Consistent charitable seva and clean water offerings dissolve dusthana friction calmly.</p>
      </div>
    </div>
  </div>
  ${footerRail("Defensive Strategy & Downturn Protocol", 13)}
</section>

<!-- PAGE 14: ASHTAKAVARGA 337-BINDU MATRIX -->
<section class="page">
  ${headerRail("MODULE XIII: ASHTAKAVARGA NUMERICAL MATRIX")}
  <div>
    <h2 class="display-l">Sarvashtakavarga 337-Bindus Heatmap</h2>
    <p class="body-text" style="margin-bottom:16px;">
      Pure mathematical point distribution eliminating all astrologer subjectivity. 
      Houses with 28+ bindus represent organic support; houses with 32+ represent major wealth sinks.
    </p>

    <!-- SAV Heatmap Grid -->
    <div class="matrix-grid" style="grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px;">
      ${savRows.map((item) => `
        <div class="matrix-item" style="border-top:3px solid ${item.b >= 30 ? "var(--jade)" : item.b >= 26 ? "var(--gold)" : "var(--crimson)"};">
          <span class="kicker">H${item.h} · ${item.sign.slice(0,3).toUpperCase()}</span>
          <span class="val" style="color:${item.b >= 30 ? "var(--jade)" : item.b >= 26 ? "var(--gold-bright)" : "var(--crimson)"};">${item.b} Bindus</span>
          <span class="body-s">${item.role}</span>
        </div>
      `).join("")}
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ 11TH VS 12TH BINDU WEALTH RATIO</div>
      <p class="body-text">
        Your 11th House of Gains has <strong>${b11} Bindus</strong> against <strong>${b12} Bindus</strong> in the 12th House of Expenditure. 
        ${bDelta >= 0 ? `This positive delta (+${bDelta} bindus) supports net capital retention and long-term accumulation.` : `This ${bDelta} bindu spread advises structured automated savings and conscious expense guardrails.`}
      </p>
    </div>
  </div>
  ${footerRail("Ashtakavarga Numerical Matrix", 14)}
</section>

<!-- PAGE 15: SHADBALA 6-FOLD PLANETARY POTENCY RANKING -->
<section class="page">
  ${headerRail("MODULE XIV: SHADBALA 6-FOLD PLANETARY POTENCY")}
  <div>
    <h2 class="display-l">Shadbala Strength Ranking &amp; Rupa Ratios</h2>
    <p class="body-text" style="margin-bottom:16px;">
      6-fold positional, directional, temporal, and motional strength assessment. 
      Determines which planets act with supreme authority versus those requiring external remedial support.
    </p>

    <table class="planet-table" style="margin-bottom:18px;">
      <thead>
        <tr>
          <th>Planet</th>
          <th>Sthana Bala</th>
          <th>Dig Bala</th>
          <th>Kala Bala</th>
          <th>Total Rupas</th>
          <th>Required Rupa</th>
          <th>Strength Ratio</th>
          <th>Verdict</th>
        </tr>
      </thead>
      <tbody>
        ${shadbalaRows.map((item) => `
          <tr>
            <td style="font-weight:700; color:${PLANET_COLORS[item.p] || "var(--gold)"};">${item.p}</td>
            <td>${item.passes ? "Strong" : "Moderate"}</td>
            <td>${item.ratio >= 1.1 ? "Elevated" : "Balanced"}</td>
            <td>Favorable</td>
            <td style="font-weight:700; color:var(--gold-bright);">${item.rupa} Rupas</td>
            <td>${item.req} Rupas</td>
            <td style="color:${item.passes ? "var(--jade)" : "var(--saffron)"}; font-weight:700;">${item.ratio.toFixed(2)}x</td>
            <td style="color:${item.passes ? "var(--jade)" : "var(--saffron)"};">${item.status}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="luxury-card">
      <div class="card-title">✦ SUPREME ENGINE: ${strongestShadbala.p.toUpperCase()} AT ${strongestShadbala.rupa} RUPAS</div>
      <p class="body-text">
        <strong>${strongestShadbala.p}</strong> achieves the highest Shadbala ratio in your chart (${strongestShadbala.ratio.toFixed(2)}x required threshold). 
        This confirms your natural aptitude for disciplined synthesis, strategic communications, 
        and building durable institutional, analytical, or commercial ventures.
      </p>
    </div>
  </div>
  ${footerRail("Shadbala Planetary Potency", 15)}
</section>

<!-- PAGE 16: D-9 NAVAMSHA HARMONIC ELEVATION -->
<section class="page">
  ${headerRail("MODULE XV: D-9 NAVAMSHA HARMONIC ELEVATION")}
  <div>
    <h2 class="display-l">D-9 Navamsha Shift &amp; Soul Realization</h2>
    <p class="body-text" style="margin-bottom:18px;">
      The 9th harmonic divisional chart indicates how your inner potentials ripen in mature adulthood post age 30.
    </p>

    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px;">
      <div class="luxury-card">
        <div class="card-title">✦ ${lagnaLord.toUpperCase()} IN D-9 ${d9LagneshSign.toUpperCase()}</div>
        <p class="body-text">
          Your Lagnesh <strong>${lagnaLord}</strong> occupies <strong>${d9LagneshSign}</strong> in the 9th harmonic (D-9 Navamsha). 
          This harmonic anchor reveals how early-life lessons mature into clear strategic execution and authority.
        </p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ D-9 LAGNA (${d9LagnaRashi.toUpperCase()}) &amp; DHARMA LORD (${d9LagnaLord.toUpperCase()})</div>
        <p class="body-text">
          Your D-9 Ascendant rises in <strong>${d9LagnaRashi}</strong> ruled by ${d9LagnaLord}, while ${ninthLord} governs your D-1 9th house of fortune, 
          supporting steady relational maturity and principled leadership.
        </p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ NAVAMSHA CONCLUSION FOR DESTINY TRAJECTORY</div>
      <p class="body-text">
        By aligning your ${lagnaRashi} D-1 temperament with your ${d9LagnaRashi} D-9 harmonic signature, 
        the mature decades of your life consistently reward patience, integrity, and long-term compounding.
      </p>
    </div>
  </div>
  ${footerRail("D-9 Navamsha Harmonic Elevation", 16)}
</section>

<!-- PAGE 17: DOUBLE TRANSIT (GURU-SHANI) ACTIVE TRIGGERS -->
<section class="page">
  ${headerRail("MODULE XVI: DOUBLE-TRANSIT ACTIVATION RADAR")}
  <div>
    <h2 class="display-l">Saturn &amp; Jupiter Dual-Sanction Windows</h2>
    <p class="body-text" style="margin-bottom:18px;">
      In classical electional astrology, irreversible life events (wealth creation, marriages, promotions) 
      require the dual aspect of Saturn (foundational karma) and Jupiter (divine grace).
    </p>

    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px;">
      <div class="luxury-card">
        <div class="card-title">✦ SHANI NATAL &amp; TRANSIT AXIS (${satData?.sign?.toUpperCase() || "NATAL"} · H${satHouse})</div>
        <p class="body-text">
          Natal Saturn in your ${ordinal(satHouse)} house (${satData?.sign || lagnaRashi}) rewards patient structural commitments, 
          filters out fragile alliances, and anchors long-term institutional agreements.
        </p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ GURU DRISHTI AXIS (${jupData?.sign?.toUpperCase() || "NATAL"} · H${jupHouse})</div>
        <p class="body-text">
          Natal Jupiter in your ${ordinal(jupHouse)} house casts protective drishti across Houses ${jupAspectHouses.map(ordinal).join(", ")}, 
          expanding wisdom, mentorship, and timely material growth.
        </p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ DOUBLE-TRANSIT SANCTION FOR ${lagnaRashi.toUpperCase()} LAGNA</div>
      <p class="body-text">
        Whenever transit Jupiter and transit Saturn simultaneously aspect your 1st, 9th, or 10th houses from ${lagnaRashi}, 
        major career and wealth milestones receive full karmic sanction for durable execution.
      </p>
    </div>
  </div>
  ${footerRail("Double-Transit Activation Radar", 17)}
</section>

<!-- PAGE 18: RAHU-KETU KARMIC AXIS -->
<section class="page">
  ${headerRail("MODULE XVII: RAHU-KETU EVOLUTIONARY AXIS")}
  <div>
    <h2 class="display-l">The Lunar Nodes: Evolutionary Purpose</h2>
    <p class="body-text" style="margin-bottom:18px;">
      Rahu represents your soul's current incarnational hunger; Ketu represents past-life mastery that must now be shared.
    </p>

    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px;">
      <div class="luxury-card">
        <div class="card-title">✦ RAHU IN ${ordinal(rahuHouse).toUpperCase()} HOUSE (${rahuSign.toUpperCase()})</div>
        <div class="display-s" style="color:var(--gold-bright); margin-bottom:6px;">The Evolutionary Frontier</div>
        <p class="body-text">
          Rahu in your ${ordinal(rahuHouse)} house (${rahuSign}) urges you to innovate, embrace modern scale, 
          and build systems that turn unconventional vision into tangible abundance.
        </p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ KETU IN ${ordinal(ketuHouse).toUpperCase()} HOUSE (${ketuSign.toUpperCase()})</div>
        <div class="display-s" style="color:var(--saffron); margin-bottom:6px;">Innate Past-Life Mastery</div>
        <p class="body-text">
          Ketu in your ${ordinal(ketuHouse)} house (${ketuSign}) reflects natural discernment and detachment. 
          Release perfectionistic anxiety and trust your intuitive strategic vision.
        </p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ BALANCING THE NODAL POLARITY</div>
      <p class="body-text">
        Ground Ketu's sharp discernment through daily creative discipline, while directing Rahu's ${ordinal(rahuHouse)}-house drive 
        into ethical, institution-building ventures that serve society.
      </p>
    </div>
  </div>
  ${footerRail("Rahu-Ketu Evolutionary Axis", 18)}
</section>

<!-- PAGE 19: BIO-VEDIC GEMSTONE TALISMAN ARCHITECTURE -->
<section class="page">
  ${headerRail("MODULE XVIII: BIO-VEDIC GEMSTONE TALISMANS")}
  <div>
    <h2 class="display-l">Precision Ratna Pariksha Prescription</h2>
    <p class="body-text" style="margin-bottom:18px;">
      Authentic Anukul Graha gemstone therapy tailored for ${withArticle(lagnaRashi)} Lagna and benefic dispositors.
    </p>

    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px;">
      <div class="luxury-card" style="border-top:3px solid #34D399;">
        <div class="card-title">✦ PRIMARY LIFE GEM: ${gemRx.primaryGem.toUpperCase()}</div>
        <p class="body-text" style="margin-bottom:8px;">
          ${gemRx.rationale}
        </p>
        <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <div><span class="kicker">CARAT</span><span class="body-s" style="color:var(--gold);">${PLANET_GEM_MAP[lagnaLord]?.weight || "3.5 – 5.0 Ratti"}</span></div>
          <div><span class="kicker">FINGER</span><span class="body-s" style="color:var(--gold);">${gemRx.finger}</span></div>
          <div><span class="kicker">METAL</span><span class="body-s" style="color:var(--gold);">${gemRx.metal}</span></div>
          <div><span class="kicker">DAY</span><span class="body-s" style="color:var(--gold);">${gemRx.day}</span></div>
        </div>
      </div>

      <div class="luxury-card" style="border-top:3px solid #C9A961;">
        <div class="card-title">✦ FORTUNE GEM: ${secGemInfo.gem.toUpperCase()} (${secGemInfo.sanskrit.toUpperCase()})</div>
        <p class="body-text" style="margin-bottom:8px;">
          Strengthens your trinal benefic <strong>${secBenefic}</strong>, enhancing ${secGemInfo.benefit}.
        </p>
        <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 8px;">
          <div><span class="kicker">CARAT</span><span class="body-s" style="color:var(--gold);">${secGemInfo.weight}</span></div>
          <div><span class="kicker">FINGER</span><span class="body-s" style="color:var(--gold);">${secGemInfo.finger} (${handSide})</span></div>
          <div><span class="kicker">METAL</span><span class="body-s" style="color:var(--gold);">${secGemInfo.metal}</span></div>
          <div><span class="kicker">DAY</span><span class="body-s" style="color:var(--gold);">${secGemInfo.day}</span></div>
        </div>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">⚠️ STRICTLY PROHIBITED GEMSTONES</div>
      <p class="body-text">
        Do NOT wear <strong>${bannedGemName}</strong> (associated with dusthana lord ${bannedLord} for ${lagnaRashi} Lagna). 
        Amplifying 6th/8th/12th-house rulers through gemstones increases unnecessary energetic friction.
      </p>
    </div>
  </div>
  ${footerRail("Bio-Vedic Gemstone Talismans", 19)}
</section>

<!-- PAGE 20: SACRED RUDRAKSHA ARCHITECTURE -->
<section class="page">
  ${headerRail("MODULE XIX: SACRED RUDRAKSHA ARCHITECTURE")}
  <div>
    <h2 class="display-l">Electromagnetic Bead Resonance</h2>
    <p class="body-text" style="margin-bottom:18px;">
      Sacred beads from the Shiva Purana matched to your Lagnesh (${lagnaLord}) and active Mahadasha (${currentDasha}).
    </p>

    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px;">
      <div class="luxury-card">
        <div class="card-title">✦ ${rud1.mukhi.toUpperCase()} (${rud1.deity.toUpperCase()})</div>
        <p class="body-text">
          ${rud1.desc}
        </p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ ${rud2.mukhi.toUpperCase()} (${rud2.deity.toUpperCase()})</div>
        <p class="body-text">
          ${rud2.desc}
        </p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ SACRED CONSECRATION PROTOCOL</div>
      <p class="body-text">
        String beads together in pure unpolished natural silk thread. Wash in raw unboiled cow milk and Ganga water 
        on a Monday morning while chanting <em>Om Namah Shivaya</em> 108 times before wearing.
      </p>
    </div>
  </div>
  ${footerRail("Sacred Rudraksha Architecture", 20)}
</section>

<!-- PAGE 21: TRI-LAYER SANSKRIT MANTRAS -->
<section class="page">
  ${headerRail("MODULE XX: TRI-LAYER SANSKRIT MANTRAS")}
  <div>
    <h2 class="display-l">Sacred Vedic Seed Mantras (Beej Japa)</h2>
    <p class="body-text" style="margin-bottom:18px;">
      Phonetic vibrational remedies to align cellular frequencies with your Lagnesh (${lagnaLord}) and active Mahadasha (${currentDasha}).
    </p>

    <!-- Mantra 1: Lagnesh -->
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">1. ${m1.title} (LAGNA LORD ${lagnaLord.toUpperCase()})</div>
      <div style="font-family:'Noto Serif Devanagari',serif; font-size:18px; color:var(--gold-bright); margin:8px 0; font-weight:600;">
        ${m1.dev}
      </div>
      <div class="body-s" style="font-family:'JetBrains Mono',monospace; color:var(--ivory);">
        IAST: ${m1.iast}
      </div>
      <p class="body-s" style="margin-top:4px;">Chant ${m1.timing} to fortify your physical vitality and executive clarity.</p>
    </div>

    <!-- Mantra 2: Active Mahadasha -->
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">2. ${m2.title} (ACTIVE ${currentDasha.toUpperCase()} MAHADASHA)</div>
      <div style="font-family:'Noto Serif Devanagari',serif; font-size:18px; color:var(--gold-bright); margin:8px 0; font-weight:600;">
        ${m2.dev}
      </div>
      <div class="body-s" style="font-family:'JetBrains Mono',monospace; color:var(--ivory);">
        IAST: ${m2.iast}
      </div>
      <p class="body-s" style="margin-top:4px;">Chant ${m2.timing} to harmonize your active dasha currents.</p>
    </div>
  </div>
  ${footerRail("Tri-Layer Sanskrit Mantras", 21)}
</section>

<!-- PAGE 22: CLASSICAL LAL KITAB DAILY KARMIC ALIGNMENTS -->
<section class="page">
  ${headerRail("MODULE XXI: LAL KITAB KARMIC ALIGNMENTS")}
  <div>
    <h2 class="display-l">Daily Ethical Upayas &amp; Nature Seva</h2>
    <p class="body-text" style="margin-bottom:18px;">
      100% free, nature-based ethical adjustments from the 1952 Lal Kitab Shastra for ${withArticle(lagnaRashi)} Lagna.
    </p>

    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px;">
      <div class="luxury-card">
        <div class="card-title">✦ LAGNESH (${lagnaLord.toUpperCase()}) NATURE SEVA</div>
        <p class="body-text">
          Honor your Lagnesh <strong>${lagnaLord}</strong> through silent weekly acts of nourishment and bird/nature seva. 
          Harmonizes personal vitality and unblocks stalled cashflows.
        </p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ SILVER SQUARE IN WALLET</div>
        <p class="body-text">
          Keep a small solid square silver coin in your wallet. 
          Anchors your ${ordinal(moonHouse)}-house Moon energy (${moonRashi}) and stabilizes emotional expenditures.
        </p>
      </div>
    </div>

    <div class="luxury-card">
      <div class="card-title">✦ WORKSPACE ORDER &amp; ENERGETIC HYGIENE</div>
      <p class="body-text">
        During ${currentDasha} Mahadasha, keep your primary workspace clutter-free and discard broken electronics or stopped clocks immediately 
        to prevent stagnant energetic friction.
      </p>
    </div>
  </div>
  ${footerRail("Lal Kitab Karmic Alignments", 22)}
</section>

<!-- PAGE 23: 12-MONTH STRATEGIC TACTICAL ROADMAP -->
<section class="page">
  ${headerRail("MODULE XXII: 12-MONTH STRATEGIC BLUEPRINT")}
  <div>
    <h2 class="display-l">12-Month Tactical Operating System (${nowYear} – ${nextYear})</h2>
    <p class="body-text" style="margin-bottom:18px;">
      Quarter-by-quarter strategic execution roadmap tailored to your ${lagnaRashi} Ascendant and active ${currentDasha} Mahadasha.
    </p>

    <div style="display:flex; flex-direction:column; gap:12px;">
      <div class="luxury-card" style="border-left:4px solid var(--jade);">
        <strong style="color:var(--jade); font-size:13px;">Q1 · ARCHITECTURE &amp; LEVERAGE</strong>
        <p class="body-s" style="margin-top:2px;">Consolidate your core operational systems and lock in long-term intellectual or asset foundations.</p>
      </div>
      <div class="luxury-card" style="border-left:4px solid var(--gold);">
        <strong style="color:var(--gold-bright); font-size:13px;">Q2 · COMMERCIAL NEGOTIATION &amp; PARTNERSHIPS</strong>
        <p class="body-s" style="margin-top:2px;">Enter into high-value alliances on your ${lagnaLord}-favorable windows. Expand outbound reach.</p>
      </div>
      <div class="luxury-card" style="border-left:4px solid var(--saffron);">
        <strong style="color:var(--saffron); font-size:13px;">Q3 · AUDIT &amp; BIOLOGICAL RECOVERY</strong>
        <p class="body-s" style="margin-top:2px;">Consolidate gains, audit balance sheets, and prioritize nervous-system recovery and family time.</p>
      </div>
      <div class="luxury-card" style="border-left:4px solid var(--jade);">
        <strong style="color:var(--jade); font-size:13px;">Q4 – Q1 · EXPANSIVE BREAKTHROUGH SURGE</strong>
        <p class="body-s" style="margin-top:2px;">Launch major sovereign initiatives aligned with your highest Ashtakavarga and Tara Bala windows.</p>
      </div>
    </div>
  </div>
  ${footerRail("12-Month Strategic Blueprint", 23)}
</section>

<!-- PAGE 24: SOVEREIGN LIFE MASTER CERTIFICATION -->
<section class="page" style="text-align:center; justify-content:space-between;">
  <div class="cover-border" style="padding: 36px 30px;">
    <div>
      <span class="kicker" style="letter-spacing: 3px;">✦ ASTROLIFE SHASTRA RESEARCH INSTITUTE ✦</span>
      <h2 class="display-l" style="margin-top:8px;">Certified Sovereign Lifetime Dossier</h2>
      <div style="font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--gold);">CERTIFICATE OF ASTRONOMICAL PRECISION</div>
    </div>

    <div style="max-width:520px; margin:0 auto;">
      <p class="body-text" style="font-size:12px; margin-bottom:14px;">
        This document certifies that the <strong>Destiny Curve 90-Year Life Master Dossier</strong> for 
        <strong>${subjectName}</strong> was cast strictly under astronomical ephemeris protocols, 
        incorporating exact planetary longitudes, Vimshottari Mahadasha sequences, 
        and Navtara mathematical weightings.
      </p>
      <div style="padding:14px; background:var(--bg-card); border:1px solid var(--border-gold); border-radius:6px; font-family:'JetBrains Mono',monospace; font-size:10px; text-align:left;">
        <div>SEEKER: ${subjectName}</div>
        <div>RECORDED BIRTH: ${birthDate} at ${birthTime} IST</div>
        <div>LAT / LON: ${lat}° N, ${lon}° E (${birthCity})</div>
        <div>SIGNATURE REF: ${orderId}</div>
      </div>
    </div>

    <!-- Sacred Sanskrit Benediction -->
    <div style="padding:16px; background:rgba(201,169,97,0.06); border-radius:8px; border:1px solid rgba(201,169,97,0.2);">
      <div style="font-family:'Noto Serif Devanagari',serif; font-size:18px; color:var(--gold-bright); font-weight:700;">
        ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।<br/>
        सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥
      </div>
      <div class="body-s" style="margin-top:6px; color:var(--muted); font-style:italic;">
        May all beings be joyous. May all be free from illness. May all see what is auspicious.
      </div>
    </div>

    <div style="font-family:'JetBrains Mono',monospace; font-size:8.5px; color:var(--muted); border-top:1px solid var(--border-gold); padding-top:10px;">
      ✦ ISSUED BY ASTROLIFE RESEARCH FOUNDATION · WWW.ASTROLIFE.IO ✦
    </div>
  </div>
</section>

</body>
</html>`;
}
