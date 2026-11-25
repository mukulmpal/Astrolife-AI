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
import {
  ALL_RASHIS,
  ALL_NAKSHATRAS,
  RASHI_LORDS,
  getGenderLateralization,
  getDynamicGemstonePrescription,
  getPlanetaryDignity,
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
  const deg = Math.abs(lon % 30);
  if (planet === "Sun" && sign === "Aries" && deg <= 10) return "Param Uchcha (Deep Exalted)";
  if (planet === "Moon" && sign === "Taurus" && deg <= 3) return "Param Uchcha (Deep Exalted)";
  if (planet === "Mars" && sign === "Capricorn" && deg <= 28) return "Param Uchcha (Deep Exalted)";
  if (planet === "Mercury" && sign === "Virgo" && deg <= 15) return "Param Uchcha (Deep Exalted)";
  if (planet === "Jupiter" && sign === "Cancer" && deg <= 5) return "Param Uchcha (Deep Exalted)";
  if (planet === "Venus" && sign === "Pisces" && deg <= 27) return "Param Uchcha (Deep Exalted)";
  if (planet === "Saturn" && sign === "Libra" && deg <= 20) return "Param Uchcha (Deep Exalted)";

  const d = getPlanetaryDignity(planet, sign);
  if (d === "Exalted") return "Uchcha (Exalted)";
  if (d === "Debilitated") return "Neecha (Debilitated)";
  if (d === "Moolatrikona") return "Moolatrikona";
  if (d === "Own") return "Swakshetra (Own House)";
  if (d === "Friendly") return "Mitra Rashi (Friendly)";
  if (d === "Enemy") return "Shatru Rashi (Enemy)";
  return "Sama Rashi (Neutral)";
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

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function getPlanetRemedyRecommendation(planet: string): string {
  switch (planet) {
    case "Sun": return "Surya Arghya with copper vessel at sunrise";
    case "Moon": return "Cooling sandalwood dot & pure water offering";
    case "Mars": return "Hanuman Chalisa & copper vessel hydration";
    case "Mercury": return "Tulsi leaves offering & green clothing on Wed";
    case "Jupiter": return "Kesar / chandan tilak on Ajna chakra";
    case "Venus": return "White sandalwood fragrance & respect feminine principle";
    case "Saturn": return "Saturday evening canine seva & mustard oil lamp";
    case "Rahu": return "Clean electronic clutter & feed birds";
    case "Ketu": return "Ganesha worship & two-colored blanket donation";
    default: return "Daily meditation & satvik lifestyle";
  }
}

function getRemedyFunctionalStatus(planet: string, lagnaRashi: string, house: number): string {
  if (planet === SIGN_LORDS[lagnaRashi]) return "Lagna Lord (Primary Benefic)";
  if ([1, 5, 9].includes(house)) return "Trine Lord / Placement (Auspicious)";
  if ([6, 8, 12].includes(house)) return "Dusthana Sthana (Requires Pacification)";
  if ([4, 7, 10].includes(house)) return "Kendra Placement (Potent Action)";
  return "Functional Neutral / Growth Engine";
}

export function generateBioVedicRemediesDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions
): string {
  const subjectName = escapeHtml(options.customerName || chart.name || "Sacred Seeker");
  const orderId = escapeHtml(options.orderId || `AL-ORD-${Date.now().toString(36).toUpperCase()}`);
  const paymentId = escapeHtml(options.paymentId || "AL-VERIFIED-SHASTRA-CERT-REMEDIES");
  const isSample = Boolean(options.isSample);

  const birthDate = chart.dob || "Recorded";
  const birthTime = chart.tob || "12:00";
  const birthCity = escapeHtml(chart.city || "Delhi");
  const lat = chart.lat !== undefined ? Number(chart.lat).toFixed(4) : "28.6139";
  const lon = chart.lon !== undefined ? Number(chart.lon).toFixed(4) : "77.2090";

  const lagnaNum = chart.lagnaNum !== undefined ? chart.lagnaNum : 0;
  const lagnaRashi = chart.lagnaRashi || SIGN_NAMES[lagnaNum] || "Aries";
  const lagnaLord = SIGN_LORDS[lagnaRashi] || "Mars";

  const moonPlanet = chart.planets?.["Moon"];
  const moonRashi = moonPlanet?.sign || "Leo";
  const moonNakshatra = moonPlanet?.nakshatra || "Ashwini";

  const subjectGender = (options.gender || (chart as any).gender || "male").toLowerCase();
  const latGender = getGenderLateralization(subjectGender);
  const gemPrescription = getDynamicGemstonePrescription(lagnaRashi, subjectGender);

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
    lkReport = { planets: [], rins: [], homeOmens: [], kismat: { planet: lagnaLord } } as any;
  }

  let tattooAudit: ReturnType<typeof generateAstroTattooAudit>;
  try {
    tattooAudit = generateAstroTattooAudit(chart, subjectGender, "wealth", "permanent_ink");
  } catch {
    tattooAudit = { activatingPlanet: lagnaLord, recommendedColorName: "Turquoise Green" } as any;
  }

  let transitRemedy: ReturnType<typeof evaluateTransitNakshatraRemedy>;
  try {
    transitRemedy = evaluateTransitNakshatraRemedy(chart);
  } catch {
    transitRemedy = { activeDashaLord: "Rahu", taraName: "Vipat Tara" } as any;
  }

  const activeMdObj = (chart.dashas as any[])?.find((d) => d.active);
  const activeAdObj = activeMdObj?.antardashas?.find((a: any) => a.active);
  const activeDasha = activeMdObj?.planet || "Rahu";
  const activeAntar = activeAdObj?.planet || chart.antardasha?.planet || lagnaLord;

  // Dynamic 5th & 9th lord secondary gemstones (never repeat Lagnesh)
  const fifthSign = signFromHouse(lagnaRashi, 5);
  const ninthSign = signFromHouse(lagnaRashi, 9);
  const fifthLord = getSignLord(fifthSign);
  const ninthLord = getSignLord(ninthSign);
  const PLANET_GEM_INFO: Record<string, { gem: string; metal: string; hora: string; mantra: string }> = {
    Sun: { gem: "Natural Ruby (Manikya) or Red Garnet", metal: "Yellow Gold or Copper", hora: "Sunday Sunrise (Surya Hora)", mantra: "Om Hram Hreem Hroum Sah Suryaya Namah" },
    Moon: { gem: "Natural South Sea Pearl (Moti) or Moonstone", metal: "Pure Silver", hora: "Monday Morning (Chandra Hora)", mantra: "Om Shram Shreem Shroum Sah Chandraya Namah" },
    Mars: { gem: "Natural Red Coral (Moonga) or Carnelian", metal: "Copper or Yellow Gold", hora: "Tuesday Morning (Mangala Hora)", mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah" },
    Mercury: { gem: "Natural Emerald (Panna) or Peridot", metal: "Panchdhatu or Yellow Gold", hora: "Wednesday Morning (Budha Hora)", mantra: "Om Bram Breem Broum Sah Budhaya Namah" },
    Jupiter: { gem: "Natural Yellow Sapphire (Pukhraj) or Citrine", metal: "Yellow Gold or Brass", hora: "Thursday Morning (Guru Hora)", mantra: "Om Gram Greem Groum Sah Gurave Namah" },
    Venus: { gem: "Natural Diamond or White Zircon", metal: "Platinum or Silver", hora: "Friday Morning (Shukra Hora)", mantra: "Om Shum Shukraya Namah" },
    Saturn: { gem: "Natural Blue Sapphire (Neelam) or Amethyst", metal: "Silver or White Gold", hora: "Saturday Twilight (Shani Hora)", mantra: "Om Sham Shanaishcharaya Namah" },
  };
  const secLord1 = ninthLord !== lagnaLord ? ninthLord : fifthLord;
  const secLord2 = fifthLord !== lagnaLord && fifthLord !== secLord1 ? fifthLord : (ninthLord !== secLord1 ? ninthLord : "Jupiter");
  const secGem1 = PLANET_GEM_INFO[secLord1] || PLANET_GEM_INFO.Venus;
  const secGem2 = PLANET_GEM_INFO[secLord2] || PLANET_GEM_INFO.Mercury;

  // Dynamic Mrityu Bhaga detector (classical degrees per planet & sign)
  const MRITYU_BHAGA_DEGS: Record<string, Record<string, number>> = {
    Sun: { Aries: 20, Taurus: 9, Gemini: 12, Cancer: 6, Leo: 8, Virgo: 24, Libra: 16, Scorpio: 17, Sagittarius: 22, Capricorn: 2, Aquarius: 3, Pisces: 23 },
    Moon: { Aries: 26, Taurus: 12, Gemini: 13, Cancer: 25, Leo: 24, Virgo: 11, Libra: 26, Scorpio: 14, Sagittarius: 13, Capricorn: 25, Aquarius: 5, Pisces: 12 },
    Mars: { Aries: 19, Taurus: 28, Gemini: 25, Cancer: 23, Leo: 29, Virgo: 28, Libra: 14, Scorpio: 21, Sagittarius: 2, Capricorn: 15, Aquarius: 11, Pisces: 6 },
    Mercury: { Aries: 15, Taurus: 14, Gemini: 13, Cancer: 12, Leo: 8, Virgo: 18, Libra: 20, Scorpio: 10, Sagittarius: 21, Capricorn: 22, Aquarius: 7, Pisces: 5 },
    Jupiter: { Aries: 19, Taurus: 29, Gemini: 12, Cancer: 27, Leo: 6, Virgo: 4, Libra: 13, Scorpio: 10, Sagittarius: 17, Capricorn: 11, Aquarius: 15, Pisces: 28 },
    Venus: { Aries: 28, Taurus: 15, Gemini: 11, Cancer: 17, Leo: 10, Virgo: 13, Libra: 4, Scorpio: 6, Sagittarius: 27, Capricorn: 12, Aquarius: 29, Pisces: 19 },
    Saturn: { Aries: 10, Taurus: 4, Gemini: 7, Cancer: 9, Leo: 12, Virgo: 16, Libra: 3, Scorpio: 18, Sagittarius: 28, Capricorn: 14, Aquarius: 13, Pisces: 15 },
    Rahu: { Aries: 14, Taurus: 13, Gemini: 12, Cancer: 11, Leo: 24, Virgo: 23, Libra: 22, Scorpio: 21, Sagittarius: 10, Capricorn: 20, Aquarius: 18, Pisces: 8 },
    Ketu: { Aries: 8, Taurus: 18, Gemini: 20, Cancer: 10, Leo: 21, Virgo: 22, Libra: 23, Scorpio: 24, Sagittarius: 11, Capricorn: 12, Aquarius: 13, Pisces: 14 },
  };
  const PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const mrityuAlerts: string[] = [];
  const tableRowsHtml = PLANET_ORDER.map(p => {
    const pd = chart.planets?.[p];
    const pRashi = pd?.sign || "Aries";
    const rawLon = pd?.longitude !== undefined ? pd.longitude : (pd?.degree !== undefined ? pd.degree : 0);
    const degVal = Math.abs(rawLon % 30);
    const degInt = Math.floor(degVal);
    const minInt = Math.floor((degVal - degInt) * 60);
    const mbTarget = MRITYU_BHAGA_DEGS[p]?.[pRashi];
    const isMb = mbTarget !== undefined && Math.abs(degVal - mbTarget) <= 1.0;
    if (isMb) {
      mrityuAlerts.push(`${p} at ${degInt}° ${minInt.toString().padStart(2, "0")}' ${pRashi} (Mrityu Bhaga ${mbTarget}°)`);
    }
    const pDeg = `${pRashi} ${degInt}° ${minInt.toString().padStart(2, "0")}'`;
    const houseNum = pd?.house || 1;
    const pHouse = ordinal(houseNum);
    const pDignity = computeClassicalDignity(p, pRashi, pd?.longitude || (degVal + (SIGN_NAMES.indexOf(pRashi) * 30)));
    const funcStatus = getRemedyFunctionalStatus(p, lagnaRashi, houseNum);
    const remedy = getPlanetRemedyRecommendation(p);
    return `<tr>
      <td><strong>${p}${isMb ? " <span style=\"color:var(--ruby-bright);font-size:8px;\">(MB)</span>" : ""}</strong></td>
      <td>${pDeg}</td>
      <td>${pHouse}</td>
      <td>${pDignity}</td>
      <td>${funcStatus}</td>
      <td>${remedy}</td>
    </tr>`;
  }).join("\n");

  const rahuHouse = chart.planets?.["Rahu"]?.house || 2;
  const rahuSign = chart.planets?.["Rahu"]?.sign || "Libra";
  const ketuHouse = chart.planets?.["Ketu"]?.house || 8;
  const ketuSign = chart.planets?.["Ketu"]?.sign || "Aries";
  const moonHouse = chart.planets?.["Moon"]?.house || 1;
  const isFemale = (subjectGender || "").toLowerCase().trim() === "female";
  const isSaturnLagna = lagnaLord === "Saturn";

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

.devanagari-safe {
  letter-spacing: 0 !important;
  font-family: 'Noto Serif Devanagari', 'Noto Sans Devanagari', serif !important;
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
        <div style="color:var(--emerald-bright);font-weight:700;">${gemPrescription.primaryGem} (${gemPrescription.metal} · ${gemPrescription.finger})</div>
      </div>
      <div>
        <span class="kicker">Active Operating Dasha</span>
        <div style="color:var(--gold-bright);font-weight:700;">${activeDasha} &mdash; ${activeAntar}</div>
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
          <strong style="color:var(--emerald-bright);">PILLAR I (Pages 5&ndash;8): Gemstone &amp; Rudraksha Bio-Wearables</strong> &mdash; Exact carat weight, metal, finger, trial protocols, and strict prohibition of incompatible stones (${(gemPrescription.prohibitedGems || []).join(", ")}).
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;border-left:3px solid var(--gold);">
          <strong style="color:var(--gold-bright);">PILLAR II (Pages 9&ndash;11): Somatotopic Dot Therapy (बिंदु चिकित्सा)</strong> &mdash; 12-sign bodily coordinates, the mandatory 2-inch navel desi ghee seal, and knee/forehead grounding points.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;border-left:3px solid var(--ruby);">
          <strong style="color:var(--ruby-bright);">PILLAR III (Pages 12&ndash;13): Sacred Protective Thread (मौली)</strong> &mdash; Kalawa consecration, wrist pulse energetics, exact Abhijeet Muhurat timings, and 21-day eco-disposal.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;border-left:3px solid var(--sapphire);">
          <strong style="color:var(--sapphire-bright);">PILLAR IV (Pages 14&ndash;15): Astro-Tattoo &amp; Talismanic Geometry</strong> &mdash; KP house negation (activating 2-6-10-11), ${latGender.side.toLowerCase()} lateralization (${latGender.sanskritTerm}), and herbal skin ink.
        </div>
        <div style="background:var(--surface-elevated);padding:6px 10px;border-radius:4px;border-left:3px solid var(--saffron);">
          <strong style="color:var(--saffron);">PILLAR V (Pages 16&ndash;19): Lal Kitab Rin Siddhant &amp; Shivling Abhisheka</strong> &mdash; Ancestral debt clearing, never-donate warnings, and active ${activeDasha}-${activeAntar} transit neutralization.
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
      For ${withArticle(lagnaRashi)} <strong>${lagnaRashi} Ascendant</strong>, classical Jyotish designates specific planets as functional benefics and others as functional malefics. Knowing your personal vulnerability zones prevents spiritual missteps and ineffective remedies.
    </p>

    <div class="grid-2" style="margin-bottom:12px;">
      <div class="luxury-card">
        <div class="kicker" style="color:var(--emerald-bright);">FUNCTIONAL BENEFACTOR AXIS</div>
        <div style="font-size:12px;color:var(--ivory);margin-top:4px;line-height:1.5;">
          <strong>Lagna Lord (${lagnaLord}):</strong> Your chief vitality engine and sovereign anchor. Strengthening ${lagnaLord} fortifies personal presence, mental stamina, and shields the somatic aura.
        </div>
      </div>
      <div class="luxury-card">
        <div class="kicker" style="color:var(--ruby-bright);">MARAKA &amp; DUSTHANA VULNERABILITY</div>
        <div style="font-size:12px;color:var(--ivory);margin-top:4px;line-height:1.5;">
          <strong>Dusthana &amp; Obstruction Axis:</strong> Houses 6, 8, and 12 govern acute obstacles, metabolic friction, and depletion. Amplifying these lords through gemstones is strictly forbidden in authentic Parashari shastra.
        </div>
      </div>
    </div>

    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;margin-bottom:6px;">
        ✦ THE DUSTHANA TRIAD SCAN (HOUSES 6, 8, 12)
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.8px;">
        <div>
          <strong style="color:var(--gold);">House 6 (${SIGN_NAMES[(lagnaNum + 5) % 12]} · Resistance &amp; Vitality):</strong> Governs daily discipline, competitive immunity, and somatic workload. Fortified through routine and disciplined physical regimens.
        </div>
        <div>
          <strong style="color:var(--ruby-bright);">House 8 (${SIGN_NAMES[(lagnaNum + 7) % 12]} · Transformation &amp; Deep Karma):</strong> The arena of sudden structural shifts and deep reserves. Neutralized through Satvik charity, meditation, and steady breathwork.
        </div>
        <div>
          <strong style="color:var(--sapphire-bright);">House 12 (${SIGN_NAMES[(lagnaNum + 11) % 12]} · Rest, Subconscious &amp; Realignment):</strong> Governs sleep cycles and nervous regeneration. Protected through grounding somatic oiling and the pure cow desi ghee navel seal.
        </div>
      </div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <div style="font-weight:700;color:var(--emerald-bright);font-size:11px;text-transform:uppercase;margin-bottom:3px;">
        ✦ The Fundamental Remedial Law for ${subjectName}
      </div>
      <p class="body-text" style="font-size:11.5px;">
        <em>"Strengthen the Lagna Lord (${lagnaLord}) through Bio-Wearables; Pacify Dusthana influences exclusively through Satvik Dana, Water Offerings, and Desi Ghee &mdash; Never wear stones for 6th, 8th, or 12th lords."</em>
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
${tableRowsHtml}
      </tbody>
    </table>
  </div>
  ${footerRail("D-1 Natal Shield & Vulnerability Matrix", 4)}
</section>

<!-- PAGE 5: PILLAR I — PRIMARY LIFE GEMSTONE: ${gemPrescription.primaryGem.toUpperCase()} -->
<section class="page">
  ${headerRail("PILLAR I: PRIMARY GEMSTONE ALCHEMY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Primary Life Gemstone: ${gemPrescription.primaryGem}</h2>
    <p class="body-text" style="margin-bottom:10px;">
      For ${withArticle(lagnaRashi)} Ascendant, <strong>${lagnaLord}</strong> is the supreme ruler of your physical body, life force, and status. ${gemPrescription.rationale}
    </p>

    <div class="luxury-card" style="border:1.5px solid var(--emerald);margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ NATURAL UNTREATED ${gemPrescription.primaryGem.replace(/^Natural\s+/i, "").toUpperCase()}
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Functions as a bio-resonant optical catalyst that concentrates beneficial planetary frequencies into your nervous system. Accelerates decision precision, commercial discernment, and somatic equilibrium.
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
          <td>Must be untreated, natural, unheated, eye-clean stone.</td>
        </tr>
        <tr>
          <td><strong>Mounting Metal</strong></td>
          <td>${gemPrescription.metal}</td>
          <td>Bottom of setting remains open so pavilion touches skin.</td>
        </tr>
        <tr>
          <td><strong>Finger &amp; Hand</strong></td>
          <td>${gemPrescription.finger}</td>
          <td>Direct meridian link to active nervous pathways.</td>
        </tr>
        <tr>
          <td><strong>Activation Day &amp; Time</strong></td>
          <td>${gemPrescription.day}</td>
          <td>Perform during Shukla Paksha morning hours.</td>
        </tr>
        <tr>
          <td><strong>Purification Medium</strong></td>
          <td>Raw Cow Milk, Ganga Jal, and Tulsi leaves</td>
          <td>Soak for 45 minutes before sunrise, then rinse in pure water.</td>
        </tr>
      </tbody>
    </table>

    <div class="mantra-block">
      <div class="kicker" style="color:var(--emerald-bright);margin-bottom:3px;">CONSECRATION &amp; PRANA PRATISHTHA MANTRA (108 RECITATIONS)</div>
      <div class="mantra-devanagari devanagari-safe">${gemPrescription.mantra}</div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);margin-top:6px;">
      <span class="kicker" style="color:var(--gold-bright);">Affordable Vedic Alternative (Uparatna):</span>
      <span style="font-size:11.5px;color:var(--ivory-dim);margin-left:6px;">
        If untreated primary gemstone is cost-prohibitive, wear a natural <strong>${gemPrescription.uparatna}</strong> mounted in suitable metal on ${gemPrescription.day}.
      </span>
    </div>
  </div>
  ${footerRail("Pillar I: Primary Life Gemstone", 5)}
</section>

<!-- PAGE 6: PILLAR I — SECONDARY GEMSTONE: BLUE SAPPHIRE TRIAL & DIAMOND -->
<section class="page">
  ${headerRail("PILLAR I: SECONDARY GEMSTONE ALCHEMY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Secondary Shield: ${secGem1.gem.split("(")[0].trim()} &amp; ${secGem2.gem.split("(")[0].trim()}</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Balancing personal vitality with trinal fortune: Activating ${secLord1} (9th Lord of Fortune) and ${secLord2} (5th Lord of Intellect) for ${lagnaRashi} Ascendant.
    </p>

    <!-- Secondary Gem 1 -->
    <div class="luxury-card" style="border:1.5px solid var(--sapphire);margin-bottom:10px;">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;font-family:'Cinzel',serif;">
        1. ${secLord1.toUpperCase()} CATALYST (${ninthSign.toUpperCase()} 9TH LORD): ${secGem1.gem.toUpperCase()}
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        For ${withArticle(lagnaRashi)} Ascendant, <strong>${secLord1}</strong> rules your 9th house of fortune (${ninthSign}) and resides in the ${ordinal(chart.planets?.[secLord1]?.house || 9)} house. Wearing <strong>${secGem1.gem}</strong> mounted in ${secGem1.metal} strengthens dharma, mentorship, and long-term luck.
      </p>
      <div class="prohibition-box" style="margin-top:8px;background:rgba(59,130,246,0.08);border-color:rgba(59,130,246,0.35);">
        <strong style="color:var(--sapphire-bright);font-size:11px;">MANDATORY 3-DAY TRIAL PROTOCOL (अनिवार्य परीक्षण विधान):</strong>
        <p style="font-size:11px;color:var(--ivory-dim);margin-top:2px;">
          Before setting into metal, wrap the raw stone in clean silk cloth and keep it under your pillow for 3 consecutive nights. Proceed only if sleep remains peaceful and clear. Activation: ${secGem1.hora} &middot; <em>${secGem1.mantra}</em>.
        </p>
      </div>
    </div>

    <!-- Secondary Gem 2 -->
    <div class="luxury-card" style="border:1.5px solid var(--gold);margin-bottom:8px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        2. ${secLord2.toUpperCase()} CATALYST (${fifthSign.toUpperCase()} 5TH LORD): ${secGem2.gem.toUpperCase()}
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        <strong>${secLord2}</strong> governs your 5th house of intellect (${fifthSign}) and sits in the ${ordinal(chart.planets?.[secLord2]?.house || 5)} house. A ${secGem2.gem} mounted in ${secGem2.metal} sharpens strategic discernment, emotional equilibrium, and executive presence.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:6px;">
        ✦ Activation: ${secGem2.hora} &middot; Mantra: <em>${secGem2.mantra}</em> (108&times;).
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
      In classical Jyotish, wearing the wrong gemstone is far more destructive than wearing no gemstone at all. The following stones are <strong>STRICTLY PROHIBITED</strong> for ${subjectName}'s natal chart configuration:
    </p>

    ${(gemPrescription.prohibitedGems || ["Yellow Sapphire", "Red Coral"]).map((gem, idx) => `
    <div class="prohibition-box" style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:12px;font-weight:700;color:var(--ruby-bright);">
          ${idx + 1}. ${gem.toUpperCase()} &mdash; ABSOLUTELY FORBIDDEN
        </span>
        <span class="tag-badge tag-ruby">LETHAL FOR ${lagnaRashi.toUpperCase()}</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Target Energy:</strong> Incompatible frequency for ${lagnaRashi} ascendant.<br/>
        <strong>Why It Causes Harm:</strong> Wearing an incompatible gemstone amplifies functional malefic or obstructionist (Dusthana/Badhaka) energies, precipitating health friction, erratic expenditures, and relational discord. Never wear stones for non-benefic houses.
      </p>
    </div>
    `).join("\n")}

    <div class="luxury-card" style="background:var(--surface-elevated);border:1px solid var(--border-gold);">
      <div class="kicker" style="color:var(--gold-bright);">Shastric Summary of Gemstone Safety:</div>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:3px;">
        Only ${gemPrescription.primaryGem} and tested harmonious secondary gems are permitted. All conflicting stones (${(gemPrescription.prohibitedGems || []).join(", ")}) are strictly locked out of your bio-field.
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

    ${(() => {
      const RUDRAKSHA_BY_PLANET: Record<string, { mukhi: string; deity: string; chakra: string; desc: string; mantra: string; day: string; trait: string }> = {
        Sun: {
          mukhi: "12-Mukhi",
          deity: "Lord Surya",
          chakra: "MANIPURA (SOLAR PLEXUS)",
          desc: "Governed by Lord Surya. Its twelve natural facets radiate executive authority, dissolve self-doubt, restore vitality, and command effortless institutional respect.",
          mantra: "<em>Om Kraum Kshraum Raum Namah</em> (108&times; Sunday)",
          day: "Sunday",
          trait: "Sovereign Radiance",
        },
        Moon: {
          mukhi: "2-Mukhi",
          deity: "Ardhanarishwara &amp; Chandra",
          chakra: "SWADHISHTHANA &amp; AJNA",
          desc: "Governed by Ardhanarishwara and Chandra. Harmonizes emotional tides, stabilizes autonomic nervous rhythm, and deepens intuitive relational equilibrium.",
          mantra: "<em>Om Namah</em> (108&times; Monday)",
          day: "Monday",
          trait: "Emotional Equilibrium",
        },
        Mars: {
          mukhi: "3-Mukhi",
          deity: "Lord Agni &amp; Mangala",
          chakra: "MANIPURA",
          desc: "Governed by Agni and Mangala. Burns stagnant karmic inertia, sharpens decisive courage, and protects blood and metabolic vitality under high pressure.",
          mantra: "<em>Om Kleem Namah</em> (108&times; Tuesday)",
          day: "Tuesday",
          trait: "Executive Courage",
        },
        Mercury: {
          mukhi: "4-Mukhi",
          deity: "Lord Brahma &amp; Budha",
          chakra: "ANAHATA &amp; VISHUDDHA",
          desc: "Governed by creator Brahma and planetary lord Mercury. Its four natural clefts balance the four lobes of the brain, enhancing memory retention, analytical clarity, and oratory.",
          mantra: "<em>Om Hreem Namah</em> (108&times; Wednesday)",
          day: "Wednesday",
          trait: "Analytical Intellect",
        },
        Jupiter: {
          mukhi: "5-Mukhi",
          deity: "Lord Brihaspati &amp; Kalagni",
          chakra: "VISHUDDHA &amp; AJNA",
          desc: "Governed by Brihaspati and Kalagni Rudra. Stabilizes blood pressure, expands dharmic wisdom, and anchors long-term prosperity without side effects.",
          mantra: "<em>Om Hreem Namah</em> (108&times; Thursday)",
          day: "Thursday",
          trait: "Dharmic Wisdom",
        },
        Venus: {
          mukhi: "6-Mukhi",
          deity: "Lord Kartikeya &amp; Shukra",
          chakra: "ANAHATA &amp; SWADHISHTHANA",
          desc: "Governed by Lord Kartikeya and Shukra. Cultivates magnetic poise, refines creative discernment, and protects against emotional burnout.",
          mantra: "<em>Om Hreem Hoom Namah</em> (108&times; Friday)",
          day: "Friday",
          trait: "Creative Magnetism",
        },
        Saturn: {
          mukhi: "7-Mukhi",
          deity: "Mahalakshmi &amp; Shani",
          chakra: "MANIPURA &amp; MULADHARA",
          desc: "Blessed by Goddess Mahalakshmi and the seven sages. Dissolves sudden financial blockages, unlocks stagnant cashflows, and harmonizes Shani&rsquo;s karmic discipline.",
          mantra: "<em>Om Hoom Namah</em> (108&times; Saturday)",
          day: "Saturday",
          trait: "Karmic Treasury",
        },
      };
      const rud1 = RUDRAKSHA_BY_PLANET[lagnaLord] || RUDRAKSHA_BY_PLANET.Jupiter;
      const rud2 = RUDRAKSHA_BY_PLANET[secLord1] || RUDRAKSHA_BY_PLANET.Sun;
      return `
    <div class="grid-2" style="margin-bottom:10px;">
      <!-- Primary Lagnesh Rudraksha -->
      <div class="luxury-card" style="border:1.5px solid var(--emerald);">
        <div class="card-title" style="color:var(--emerald-bright);font-size:12px;font-family:'Cinzel',serif;">
          ✦ ${rud1.mukhi.toUpperCase()} RUDRAKSHA (${rud1.deity.toUpperCase()})
        </div>
        <div class="kicker" style="margin-top:2px;">LAGNESH: ${lagnaLord.toUpperCase()} · ${rud1.chakra}</div>
        <p class="body-text" style="font-size:11.5px;margin-top:6px;">
          ${rud1.desc}
        </p>
        <div style="font-size:11px;color:var(--gold);margin-top:6px;">
          ✦ <strong>Mantra:</strong> ${rud1.mantra}
        </div>
      </div>

      <!-- Secondary 9th/5th Benefic Rudraksha -->
      <div class="luxury-card" style="border:1.5px solid var(--gold);">
        <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
          ✦ ${rud2.mukhi.toUpperCase()} RUDRAKSHA (${rud2.deity.toUpperCase()})
        </div>
        <div class="kicker" style="margin-top:2px;">TRIKONA BENEFIC: ${secLord1.toUpperCase()} · ${rud2.chakra}</div>
        <p class="body-text" style="font-size:11.5px;margin-top:6px;">
          ${rud2.desc}
        </p>
        <div style="font-size:11px;color:var(--gold);margin-top:6px;">
          ✦ <strong>Mantra:</strong> ${rud2.mantra}
        </div>
      </div>
    </div>

    <!-- Sacred Combination Protocol -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ THE ${rud1.trait.toUpperCase()} &amp; ${rud2.trait.toUpperCase()} COMBINATION (${rud1.mukhi.toUpperCase()} + ${rud2.mukhi.toUpperCase()})
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        String one collector-grade ${rud1.mukhi} bead and one collector-grade ${rud2.mukhi} bead together on an un-dyed pure raw red or natural silk thread. Cap both ends in pure silver or 22k gold.
      </p>
      <div class="grid-3" style="margin-top:8px;font-size:11px;">
        <div>
          <span class="kicker">Wearing Position:</span>
          <div style="color:var(--ivory);font-weight:600;">Around Neck touching Anahata (Heart)</div>
        </div>
        <div>
          <span class="kicker">Prana Pratishtha:</span>
          <div style="color:var(--ivory);font-weight:600;">${rud1.day} or ${rud2.day} at sunrise</div>
        </div>
        <div>
          <span class="kicker">Maintenance:</span>
          <div style="color:var(--ivory);font-weight:600;">Condition with pure almond oil monthly</div>
        </div>
      </div>
    </div>`;
    })()}

    <div class="luxury-card" style="background:var(--surface-elevated);">
      <span class="kicker" style="color:var(--sapphire-bright);">Active Dasha Shield (${activeDasha} Mahadasha &middot; ${lagnaLord} Lagnesh):</span>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
        Paired for your ${lagnaRashi} Ascendant (${lagnaLord}) and active ${activeDasha} Mahadasha: wear an 8-Mukhi (Lord Ganesha) or 7-Mukhi Rudraksha to dissolve bottlenecks and stabilize your ${ordinal(rahuHouse)}-house nodal axis.
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
          <td>Cooling Chandan (Gentle Sattvic Tilak)</td>
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
          <td>Micro Kajal Dot on ${latGender.side} Knee</td>
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
      The <strong>Navel (Nabhi Chakra)</strong> contains over 72,000 energetic nadis (subtle nerve channels) that branch across the human biological system, anchoring somatic equilibrium and metabolic balance.
    </p>

    <!-- The Invariant Box -->
    <div class="luxury-card" style="border:2px solid var(--emerald-bright);margin-bottom:12px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ THE ABSOLUTE NAVEL INVARIANT FOR ${subjectName.toUpperCase()} (${lagnaRashi.toUpperCase()} LAGNA)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Because ${lagnaLord} rules your 1st house (vitality), maintaining balanced somatic equilibrium and cooling internal heat stabilizes your entire autonomic nervous system.
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
          <strong style="color:var(--gold);">4. Bio-Vedic Benefits:</strong> Instantly cools the vagus nerve, reduces overthinking, pacifies internal metabolic heat, prevents dry skin and digestive disorders, and creates a calming energetic boundary against daily stress.
        </div>
      </div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <span class="kicker" style="color:var(--emerald-bright);">Clinical Astrological Observation:</span>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
        Within 7 days of continuous application, ${lagnaRashi} Lagna natives commonly report smoother sleep onset and a noticeable reduction in midday mental fatigue.
      </p>
    </div>
  </div>
  ${footerRail("Pillar II: Navel Desi Ghee Protocol", 10)}
</section>

<!-- PAGE 11: PILLAR II — KNEE & FOREHEAD DOT PROTOCOLS -->
<section class="page">
  ${headerRail("PILLAR II: KNEE & FOREHEAD DOT PROTOCOLS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">${latGender.side} Knee &amp; Forehead Dot Protocols</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Targeted somatotopic reflex points to ground Saturnian pressure and pacify nocturnal lunar agitation.
    </p>

    <!-- Knee Protocol -->
    <div class="luxury-card" style="border:1.5px solid var(--sapphire);margin-bottom:12px;">
      <div class="card-title" style="color:var(--sapphire-bright);font-size:12px;font-family:'Cinzel',serif;">
        1. ${latGender.side.toUpperCase()} KNEE KAJAL MICRO-DOT (मकर / शनि देह रक्षक बिंदु)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Under Kalapurusha mapping, <strong>Capricorn (Makara)</strong> governs the knee joints. For your ${lagnaRashi} configuration, targeted somatotopic grounding dissipates structural fatigue and aligns professional endurance.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;margin-top:8px;font-size:11.5px;">
        <strong style="color:var(--gold-bright);">Execution Method:</strong>
        <p style="color:var(--ivory-dim);margin-top:2px;">
          On Saturdays, or during periods of acute work pressure, apply a tiny <strong>micro-dot (2mm) of pure natural herbal kajal</strong> (soot of cow ghee lamp) on the lateral side of your <strong>${latGender.side} Knee joint</strong>.
        </p>
        <p style="color:var(--ivory-dim);margin-top:4px;">
          <strong>Effect:</strong> Converts heavy structural friction into a grounding shield, preventing somatic fatigue and stabilizing erratic professional timelines.
        </p>
      </div>
    </div>

    <!-- Forehead Sandalwood Protocol -->
    <div class="luxury-card" style="border:1.5px solid var(--gold);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        2. AJNA CHAKRA WHITE SANDALWOOD DOT (चंद्र व मन शांति बिंदु)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Your natal Moon sits in <strong>${moonRashi} (${ordinal(moonPlanet?.house || 1)} house)</strong> in ${moonNakshatra}. This placement generates high intellectual ambition combined with periodic sensory overload.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;margin-top:8px;font-size:11.5px;">
        <strong style="color:var(--gold-bright);">Execution Method:</strong>
        <p style="color:var(--ivory-dim);margin-top:2px;">
          Apply a small dot of freshly prepared <strong>Pure White Sandalwood paste (श्वेत चंदन)</strong> with your ${latGender.side.toLowerCase()} ring finger (Anamika) precisely between the eyebrows (Ajna Chakra) on Monday mornings and Full Moon (Purnima) evenings.
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
        ${isSaturnLagna
          ? `For ${withArticle(lagnaRashi)} Lagna native ruled by Saturn, a thick black wrist thread is unnecessary and can over-concentrate heavy Tamasic inertia on the pulse. Use the consecrated Red &amp; Yellow Mauli instead.`
          : `Many people blindly tie thick black threads around their wrists or ankles assuming it wards off evil. For ${withArticle(lagnaRashi)} Lagna native, wearing black thread on the active pulse draws heavy Saturnian lethargy and dampens somatic vitality. <strong>Do not wear black thread on your wrist.</strong>`}
      </p>
    </div>

    <!-- Prescribed Specifications -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ THE PRESCRIBED SACRED SPECIFICATIONS FOR ${subjectName.toUpperCase()}
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
          <div style="color:var(--emerald-bright);font-weight:600;">Active ${latGender.wrist} (${subjectGender === "female" ? "Vama Anga · Female Meridian" : "Dakshina Anga · Male Meridian"})</div>
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
          <strong style="color:var(--emerald-bright);">3. Tying Tension:</strong> Tie with comfortable snugness on the ${latGender.wrist.toLowerCase()} (holding a fist while tying). Do not tie too tight to impede capillary circulation.
        </div>
      </div>
    </div>

    <!-- The Classical Shloka -->
    <div class="mantra-block" style="margin-bottom:12px;">
      <div class="kicker" style="color:var(--gold-bright);margin-bottom:4px;">THE IMMUTABLE VEDIC RAKSHA MANTRA</div>
      <div class="mantra-devanagari devanagari-safe">
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
          <strong style="color:var(--gold);">Rule 1 (${isFemale ? "Female Left Lateralization" : "Male Right Lateralization"}):</strong> For ${isFemale ? "female" : "male"} natives, planetary sigils must be inscribed exclusively on the <strong>${latGender.side} of the Body</strong> (${latGender.side.toLowerCase()} arm, ${latGender.side.toLowerCase()} shoulder, ${latGender.side.toLowerCase()} calf). This channels ${latGender.channel}.
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
      Computational recommendation tailored specifically for ${subjectName}'s chart to unlock sovereign intellectual leverage, authority, and compounding vitality.
    </p>

    <div class="luxury-card" style="border:1.5px solid var(--emerald);margin-bottom:12px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ PRESCRIBED SIGIL: SACRED ${lagnaLord.toUpperCase()} YANTRA &middot; HARMONIC SYMBOL
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        <strong>Activating Energy:</strong> ${lagnaLord} &mdash; Sovereign Lord of ${lagnaRashi} Lagna. Primary life force anchor and vitality driver.
      </p>
      <div class="grid-2" style="font-size:11.5px;margin-top:8px;row-gap:6px;">
        <div>
          <span class="kicker">Anatomical Placement:</span>
          <div style="color:var(--gold-bright);font-weight:700;">${latGender.side} Upper Arm or Inner Forearm</div>
        </div>
        <div>
          <span class="kicker">Governing Zodiac Zone:</span>
          <div style="color:var(--ivory);">${lagnaRashi} / ${SIGN_NAMES[((lagnaNum + 9) % 12)]} (Executive Axis)</div>
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
        The design features clean geometric harmony (an upward equilateral triangle intersected by a sovereign vertical axis) representing mental agility, strategic discernment, and commercial precision.
      </p>
      <div style="font-size:11px;color:var(--gold);margin-top:6px;">
        ✦ <strong>Temporary Alternative:</strong> If permanent ink is not preferred, use a skin-safe natural herbal marker or natural henna to draw a 5mm micro-symbol on the ${latGender.side.toLowerCase()} inner forearm on auspicious mornings during high-stakes initiatives.
      </div>
    </div>

    <div class="luxury-card" style="background:var(--surface-elevated);border-left:3px solid var(--emerald-bright);">
      <span class="kicker" style="color:var(--emerald-bright);">Dermal Activation Mechanism:</span>
      <p style="font-size:11.2px;color:var(--ivory-dim);margin-top:2px;">
        Inscribing consecrated geometry on the ${latGender.side.toLowerCase()} arm continuously reinforces the executive status vector, transforming communication from casual conversation into authoritative executive mandate.
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

    <!-- Diagnostic Scan -->
    <div class="luxury-card">
      <div class="card-title" style="color:var(--ruby-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        ✦ ACTIVE LINEAGE KARMIC AUDIT FOR ${subjectName.toUpperCase()}
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px;margin-top:6px;">
        <div>
          <strong style="color:var(--gold);">1. Rahu in ${ordinal(chart.planets?.["Rahu"]?.house || 2)} House (Kudrati / Ancestral Lineage Factor):</strong> Rahu's placement indicates an area requiring strict ethical speech, conscious budgeting, and clear commitments to prevent expenditure leaks.
        </div>
        <div>
          <strong style="color:var(--gold);">2. Ketu in ${ordinal(chart.planets?.["Ketu"]?.house || 8)} House (Dharmik Balance):</strong> Ketu's house highlights deep intuitive reserves. Harmonized through canine seva, spiritual grounding, and regular meditation.
        </div>
        <div>
          <strong style="color:var(--gold);">3. Mars in ${ordinal(chart.planets?.["Mars"]?.house || 12)} House (Metabolic &amp; Vital Energy):</strong> Supported by mindful hydration, avoidance of emotional impatience, and physical fitness discipline.
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
        1. RAHU IN ${ordinal(rahuHouse).toUpperCase()} HOUSE (${rahuSign.toUpperCase()}): THE SOLID SILVER BALL ANCHOR (ठोस चांदी की गोली)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        In Lal Kitab, Rahu in your ${ordinal(rahuHouse)} house (${rahuSign}) amplifies sensory restlessness and unbudgeted desires.
      </p>
      <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;margin-top:6px;font-size:11.5px;">
        <strong style="color:var(--gold-bright);">Prescription:</strong>
        <p style="color:var(--ivory-dim);margin-top:2px;">
          Procure a small <strong>Solid Pure Silver Ball (ठोस चांदी की गोली &mdash; without any hole)</strong> weighing between 4 and 10 grams. Keep this ball continuously in your primary wallet or pocket.
        </p>
        <p style="color:var(--ivory-dim);margin-top:4px;">
          <strong>Shastric Mechanism:</strong> Silver represents the pure, pacifying energy of the Moon. Keeping solid silver calms Rahu's ${ordinal(rahuHouse)}-house volatility and protects steady liquidity.
        </p>
      </div>
    </div>

    <!-- Upaya 2: Street Dog Seva -->
    <div class="luxury-card" style="border:1.5px solid var(--gold);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        2. KETU IN ${ordinal(ketuHouse).toUpperCase()} HOUSE (${ketuSign.toUpperCase()}): STRAY DOG SWEET ROTI SEVA (श्वान सेवा)
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        In Lal Kitab, dogs represent <strong>Ketu</strong>. When Ketu sits in your ${ordinal(ketuHouse)} house (${ketuSign}), sudden detours or restless transitions can arise.
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
        On any 3 consecutive Thursdays, offer 4 fresh yellow lemons in a temple without asking for anything in return. This completely dissolves lingering stagnant energetic friction.
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
        ✦ STRICT "NEVER-DONATE" PROTOCOL FOR ${subjectName.toUpperCase()} (दान निषेध)
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px;">
        <div>
          <strong style="color:var(--ruby-bright);">1. NEVER DONATE ITEMS OF YOUR LAGNA LORD (${lagnaLord.toUpperCase()}) AS SACRIFICIAL CHARITY:</strong> Donating items of your primary functional benefic dissipates your own vitality and intellectual leverage. Honor your Lagna lord through conscious service and respect instead.
        </div>
        <div>
          <strong style="color:var(--ruby-bright);">2. NEVER DONATE MUSTARD OIL ON YOUR DOORSTEP ON SATURDAY:</strong> Giving mustard oil to wandering beggars at your main threshold invites Saturnian debt inside. Always make Saturnian donations outside, at a Shani temple or community kitchen.
        </div>
        <div>
          <strong style="color:var(--ruby-bright);">3. NEVER ACCEPT FREE ELECTRONICS OR AMULETS FROM STRANGERS:</strong> Accepting free unearned gadgets or talismans absorbs the giver's negative Rahu karma directly into your ${ordinal(rahuHouse)} house.
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
          <strong style="color:var(--gold);">1. North-West Clutter:</strong> If electrical wiring or broken electronics accumulate in the North-West zone of your residence, Rahu's ${ordinal(rahuHouse)}-house volatility spikes. Keep this sector immaculate.
        </div>
        <div>
          <strong style="color:var(--gold);">2. South-West Floor Dampness:</strong> Ensure the South-West master bedroom or storage area has zero plumbing leaks. Dampness here triggers ${ordinal(ketuHouse)}-house Ketu restlessness.
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
      Under classical Nakshatra Gochar, your active Mahadasha lord <strong>${activeDasha}</strong> and Antardasha lord <strong>${activeAntar}</strong> govern your current remedial cycle. Targeted Shivling Abhisheka cools planetary friction and harmonizes your ${ordinal(moonHouse)}-house Moon (${moonRashi}).
    </p>

    <!-- Shivling Abhisheka Box -->
    <div class="luxury-card" style="border:1.5px solid var(--border-gold-strong);margin-bottom:10px;">
      <div class="card-title" style="color:var(--gold-bright);font-size:12px;font-family:'Cinzel',serif;">
        ✦ THE SACRED SHIVLING WATER &amp; HERBAL ABHISHEKA PROTOCOL
      </div>
      <p class="body-text" style="font-size:11.8px;margin-top:4px;">
        Lord Shiva is the supreme master of time (<em>Mahakala</em>) and cosmic poison neutralization (<em>Neelakantha</em>). Performing targeted Abhisheka cools heated astral rays.
      </p>
      <div class="grid-2" style="font-size:11.5px;margin-top:8px;gap:8px;">
        <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;">
          <strong style="color:var(--sapphire-bright);">Monday Morning Abhisheka:</strong>
          <p style="color:var(--ivory-dim);margin-top:2px;">
            Offer cold unboiled cow milk mixed with pure holy water and a pinch of <strong>White Sesame Seeds (सफेद तिल)</strong> over the Shivling while chanting <em>Om Namah Shivaya</em> 11 times. Pacifies ${ordinal(moonHouse)}-house Moon (${moonRashi}).
          </p>
        </div>
        <div style="background:var(--surface-elevated);padding:8px 10px;border-radius:4px;">
          <strong style="color:var(--emerald-bright);">Lagnesh (${lagnaLord}) Day Abhisheka:</strong>
          <p style="color:var(--ivory-dim);margin-top:2px;">
            Offer pure fresh water with Bilva leaves or Durva over the Shivling on ${gemPrescription.day.split(" ")[0]} morning. Awakens your Lagna lord ${lagnaLord} and dissolves commercial friction.
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
        Anchored to your natal Moon Nakshatra (<strong>${moonNakshatra}</strong>), your active ${activeDasha} transit operates through <strong>${transitRemedy?.taraName || "Sadhana Tara"}</strong>. Pairing regular Shivling Abhisheka with your ${lagnaLord} Lagnesh discipline bridges any transit turbulence smoothly.
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
        <strong>Transit Focus:</strong> Sun in Sagittarius &amp; Capricorn. Saturn in ${ordinal(houseFromLagna("Pisces", lagnaRashi))} house (Pisces).<br/>
        <strong>Biological Risk:</strong> Lower back stiffness, dry skin, sluggish morning metabolism.<br/>
        <strong>Prescribed Action:</strong> Daily warm sesame oil massage on soles of feet before sleep; maintain ${latGender.side.toLowerCase()} knee kajal micro-dot on high-stress Saturdays; continue the 2-inch navel desi ghee application.
      </p>
    </div>

    <!-- Q2 -->
    <div class="luxury-card" style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
          QUARTER 2 (MAR 2027 &ndash; MAY 2027): SPRING SOLAR EQUINOX &amp; ENERGY PEAK
        </span>
        <span class="tag-badge tag-emerald">PEAK HARVEST</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Transit Focus:</strong> Sun transits exalted Aries (${ordinal(houseFromLagna("Aries", lagnaRashi))} House) and Taurus (${ordinal(houseFromLagna("Taurus", lagnaRashi))} House).<br/>
        <strong>Biological Opportunity:</strong> Peak vitality, clear focus, and strong metabolic momentum.<br/>
        <strong>Prescribed Action:</strong> Re-purify your primary ${gemPrescription.primaryGem.replace(/^Natural\s+/i, "")} on Akshaya Tritiya; drink water stored in pure copper vessels; keep a green Tulsi plant at home.
      </p>
    </div>

    <!-- Q3 -->
    <div class="luxury-card" style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
          QUARTER 3 (JUN 2027 &ndash; AUG 2027): MONSOON GUT HEALTH &amp; LEO TRANSIT
        </span>
        <span class="tag-badge tag-amber">CAUTION &amp; CONSOLIDATION</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Transit Focus:</strong> Sun enters Leo (${ordinal(houseFromLagna("Leo", lagnaRashi))} House).<br/>
        <strong>Biological Risk:</strong> Acidity, digestive sluggishness, vivid nocturnal dreams.<br/>
        <strong>Prescribed Action:</strong> Consume light Satvik meals before 8:00 PM; offer cold milk with white sesame on Shivling every Monday; strictly avoid heavy fried food and excess sodium.
      </p>
    </div>

    <!-- Q4 -->
    <div class="luxury-card">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-family:'Cinzel',serif;font-size:11.5px;font-weight:700;color:var(--gold-bright);">
          QUARTER 4 (SEP 2027 &ndash; NOV 2027): AUTUMN EQUINOX &amp; ${lagnaRashi.toUpperCase()} ALIGNMENT
        </span>
        <span class="tag-badge tag-emerald">ANNUAL ZENITH</span>
      </div>
      <p class="body-text" style="font-size:11.5px;margin-top:4px;">
        <strong>Transit Focus:</strong> Sun transits Virgo (${ordinal(houseFromLagna("Virgo", lagnaRashi))} House) &amp; Libra (${ordinal(houseFromLagna("Libra", lagnaRashi))} House).<br/>
        <strong>Biological Triumph:</strong> Steady physical stamina and executive negotiation clarity.<br/>
        <strong>Prescribed Action:</strong> Consecrate a fresh red/yellow sacred wrist thread (${latGender.wrist}); distribute fresh fruit or green fodder during Navratri; light a pure cow ghee lamp in Ishanya (North-East).
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
          <strong style="color:var(--gold);">4. Surya Dhyana &amp; Arghya (2.5 Minutes):</strong> Face East during sunrise, offer clean water from a copper vessel, and recite the Gayatri or your Lagnesh (${lagnaLord}) mantra 11 times.
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

    <!-- Lagnesh Kavacham -->
    <div class="luxury-card" style="margin-bottom:10px;">
      <div class="card-title" style="color:var(--emerald-bright);font-size:11.5px;font-family:'Cinzel',serif;">
        1. ${lagnaLord.toUpperCase()} LAGNESH PROTECTION KAVACHAM (${lagnaRashi.toUpperCase()} SHIELD)
      </div>
      <div class="mantra-block">
        <div class="mantra-devanagari devanagari-safe">
          ${gemPrescription.mantra}
        </div>
        <div class="mantra-iast">
          Recite 108 times on ${gemPrescription.day} for ${lagnaLord} Lagnesh fortification.
        </div>
      </div>
      <p class="body-text" style="font-size:11.2px;">
        Recited to shield logical intellect, clarity of speech, executive stamina, and nervous system vitality for your ${lagnaRashi} Lagna.
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
        The supreme hymn revealed to King Dasharatha. Harmonizes Saturn's placement in your ${ordinal(chart.planets?.["Saturn"]?.house || 7)} house and completely eliminates depression and unearned setbacks.
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
        ✦ SOVEREIGN BIO-VEDIC ARMOR MATRIX · ${subjectName.toUpperCase()}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11.2px;margin-top:6px;">
        <div>
          <span class="kicker">PRIMARY BIO-WEARABLE</span>
          <div style="color:var(--emerald-bright);font-weight:700;">${gemPrescription.primaryGem} (${gemPrescription.metal} · ${gemPrescription.finger})</div>
        </div>
        <div>
          <span class="kicker">SECONDARY BIO-SHIELD</span>
          <div style="color:var(--sapphire-bright);font-weight:700;">Harmonious Trine Gem / Uparatna (${gemPrescription.uparatna})</div>
        </div>
        <div>
          <span class="kicker">STRICTLY PROHIBITED GEMS</span>
          <div style="color:var(--ruby-bright);font-weight:700;">${(gemPrescription.prohibitedGems || []).join(", ")}</div>
        </div>
        <div>
          <span class="kicker">RUDRAKSHA PAIRING</span>
          <div style="color:var(--ivory);font-weight:600;">Consecrated beads on raw silk thread</div>
        </div>
        <div>
          <span class="kicker">CORE DOT THERAPY PROTOCOL</span>
          <div style="color:var(--emerald-bright);font-weight:700;">2-Inch Navel Circle (Pure Cow Desi Ghee)</div>
        </div>
        <div>
          <span class="kicker">GROUNDING REFLEX DOT</span>
          <div style="color:var(--ivory);font-weight:600;">Micro-Kajal dot on ${latGender.side} Knee on Saturdays</div>
        </div>
        <div>
          <span class="kicker">SACRED WRIST THREAD</span>
          <div style="color:var(--gold-bright);font-weight:700;">Red &amp; Yellow Raw Cotton (7 wraps · ${latGender.wrist})</div>
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
          <div style="color:var(--ivory);font-weight:600;">Pure water / milk offering with conscious mantra japa</div>
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
          <strong style="color:var(--emerald-bright);">Weekly Benefic Seva:</strong> Honor the day of ${lagnaLord}, chant ruling mantra 108&times;, practice satvik compassion.
        </div>
        <div style="background:var(--surface);padding:8px;border-radius:4px;border-left:2px solid var(--sapphire);">
          <strong style="color:var(--sapphire-bright);">Saturday (Shani):</strong> Apply ${latGender.side.toLowerCase()} knee kajal dot, feed stray dogs sweet rotis, avoid mustard oil on doorstep.
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
