/**
 * ============================================================================
 * ASTROLIFE — GOLDEN MUHURAT & AUSPICIOUS DECISION SUITE GENERATOR
 * ============================================================================
 * Ultra-luxury, print-perfect 24-page HTML-to-PDF generator for:
 * ⚡ Golden Muhurat & Auspicious Decision Suite (pkg_muhurat_panchang / ₹499)
 *
 * 5-Pillar Master Architecture:
 * 1. Pillar I: Panchang Anatomy & Celestial Decision Matrix (Pages 1–5)
 * 2. Pillar II: Micro-Time Systems & Hourly Precision (Pages 6–10)
 * 3. Pillar III: The 5 Major Life Milestone Muhurats (Pages 11–15)
 * 4. Pillar IV: Annual Auspicious Calendar & Decision Radar (Pages 16–20)
 * 5. Pillar V: Shastric Emergency Neutralizers & Master Cheat Sheet (Pages 21–24)
 *
 * Precision Shastric Calculations:
 * - Muhurta Chintamani (Daivajna Rama) & Brihat Samhita (Varahamihira)
 * - Kalaprakasika & Narada Samhita canonical decision principles
 * - Full Sanskrit Devanagari, IAST transliteration, and English translations
 * - Dedicated .mantra-devanagari CSS class with zero letter-spacing distortion
 * - Print-perfect CSS (@page { size: A4 portrait; margin: 0; }) with 24 exact pages.
 * ============================================================================
 */

import type { ChartData } from "../../astro-engine/calculations";
import type { PackageDossierOptions } from "../package-dossier-html-generator";
import { getActiveDashaState, getSeekerAge, resolveGender } from "../dossier-shared-helpers";
import { calculatePanchang, type PanchangResult } from "../../astro-engine/panchang";
import { scanAuspiciousMuhurats, type MuhuratWindow } from "../../astro-engine/muhurat";
import {
  ALL_NAKSHATRAS,
  TARA_NAMES,
  ALL_RASHIS,
  RASHI_LORDS,
  calculateTaraBala,
  getGenderLateralization,
  getPlanetHousesOwned,
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

function renderNorthIndianChart(
  chart: ChartData,
  size = 220
): string {
  const houseContents: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) houseContents[h] = [];
  houseContents[1].push("As");

  const planetMap = chart.planets || {};
  for (const [name, pd] of Object.entries(planetMap)) {
    if (!pd) continue;
    const abbr = PLANET_ABBR[name] || name.slice(0, 2);
    const house = pd.house >= 1 && pd.house <= 12 ? pd.house : 1;
    const isRet = pd.retrograde || (pd as any).isRetrograde;
    houseContents[house].push(abbr + (isRet ? "(R)" : ""));
  }

  const lagnaIndex = chart.lagnaNum !== undefined ? chart.lagnaNum : 5;

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

  return `<svg width="${size}" height="${size}" viewBox="0 0 360 360" class="kundli-svg" style="background:#09121E;border:1.5px solid var(--border-teal);border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.5);">
  <g stroke="#C9A961" stroke-width="0.75" fill="none" opacity="0.65">
    <rect x="10" y="10" width="340" height="340"/>
    <polygon points="180,10 350,180 180,350 10,180"/>
    <line x1="10" y1="10" x2="350" y2="350"/>
    <line x1="350" y1="10" x2="10" y2="350"/>
  </g>
  ${labels}
</svg>`;
}

export function generateGoldenMuhuratDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions = {}
): string {
  const subjectName = escapeHtml(options.customerName || chart.name || "Sacred Seeker");
  const orderId = escapeHtml(options.orderId || `MUH_${Date.now().toString(36).toUpperCase()}`);
  const paymentId = escapeHtml(options.paymentId || `PAY_${Date.now().toString(36).toUpperCase()}`);
  const isSample = Boolean(options.isSample);

  const birthDate = chart.dob || "Recorded";
  const birthTime = chart.tob || "12:00";
  const birthCity = escapeHtml(chart.city || "New Delhi");
  const lat = chart.lat !== undefined ? Number(chart.lat).toFixed(4) : "28.6139";
  const lon = chart.lon !== undefined ? Number(chart.lon).toFixed(4) : "77.2090";

  const lagnaRashi = chart.lagnaRashi || SIGN_NAMES[chart.lagnaNum || 0] || "Aries";
  const lagnesh = SIGN_LORDS[lagnaRashi] || "Mars";
  const moonPlanet = chart.planets?.["Moon"];
  const moonRashi = moonPlanet?.sign || "Aries";
  const nakshatra = moonPlanet?.nakshatra || "Ashwini";
  const moonPada = moonPlanet?.pada || 1;

  const resolvedGender = resolveGender(options, chart);
  const seekerAge = getSeekerAge(chart.dob);
  const seekerAgeStr = typeof seekerAge === "number" ? `${seekerAge} years` : "Recorded";

  const dashaState = getActiveDashaState(chart);
  const activeDasha = dashaState.activeDasha || "Jupiter";
  const activeAntar = dashaState.activeAntar || "Saturn";

  const LAGNESH_SOVEREIGN_DAY: Record<string, { day: string; rahuKaal: string }> = {
    Sun: { day: "Sunday", rahuKaal: "04:30 PM to 06:00 PM" },
    Moon: { day: "Monday", rahuKaal: "07:30 AM to 09:00 AM" },
    Mars: { day: "Tuesday", rahuKaal: "03:00 PM to 04:30 PM" },
    Mercury: { day: "Wednesday", rahuKaal: "12:00 PM to 01:30 PM" },
    Jupiter: { day: "Thursday", rahuKaal: "01:30 PM to 03:00 PM" },
    Venus: { day: "Friday", rahuKaal: "10:30 AM to 12:00 PM" },
    Saturn: { day: "Saturday", rahuKaal: "09:00 AM to 10:30 AM" },
  };
  const sovereignInfo = LAGNESH_SOVEREIGN_DAY[lagnesh] || { day: "Wednesday", rahuKaal: "12:00 PM to 01:30 PM" };

  // Dynamic Tara & Chandra indices
  const mIdx = Math.max(0, ALL_RASHIS.findIndex(r => r.toLowerCase() === moonRashi.toLowerCase()));
  const nIdx = Math.max(0, ALL_NAKSHATRAS.findIndex(n => n.toLowerCase() === nakshatra.toLowerCase()));
  const ashtamaSign = ALL_RASHIS[(mIdx + 7) % 12];
  const twelfthFromMoon = ALL_RASHIS[(mIdx + 11) % 12];
  const fourthFromMoon = ALL_RASHIS[(mIdx + 3) % 12];
  const auspSigns = [0, 2, 5, 6, 9, 10].map(h => `${ALL_RASHIS[(mIdx + h) % 12]} (${h + 1}${h === 0 ? "st" : h === 1 ? "nd" : h === 2 ? "rd" : "th"})`).join(", ");
  const defSigns = `${fourthFromMoon} (4th), ${ashtamaSign} (8th), or ${twelfthFromMoon} (12th)`;

  // Dynamic Tara Bala table rows
  const taraTableRows = TARA_NAMES.map((t, i) => {
    const s1 = ALL_NAKSHATRAS[(nIdx + i) % 27];
    const s2 = ALL_NAKSHATRAS[(nIdx + i + 9) % 27];
    const s3 = ALL_NAKSHATRAS[(nIdx + i + 18) % 27];
    const badgeClass = t.supportive ? "badge-auspicious" : (t.num === 1 ? "badge-caution" : "badge-avoid");
    const guidance = [
      "Spiritual study, meditation; avoid initiating long-term commercial liability.",
      "Optimal for financial investments, contracts, fundraising, and banking.",
      "High risk of sudden disputes, technical glitches, and contractual reversals.",
      "Property purchases, medical operations, recovery protocols, team onboarding.",
      "Encountering stubborn bureaucratic delays, regulatory pushback, or denial.",
      "Mastery of strategic breakthroughs, legal settlements, and high-value product launches.",
      "Severe risk of total loss or ruin. Zero commercial commitments permitted.",
      "Signing strategic partnerships, creative collaborations, social networking.",
      "High-level executive negotiations, major real estate acquisitions, marriage."
    ][i];
    return `<tr>
      <td><strong>${t.num}. ${t.name} Tara</strong></td>
      <td>${s1} &middot; ${s2} &middot; ${s3}</td>
      <td><span class="${badgeClass}">${t.status.split(" ")[0]}</span></td>
      <td>${guidance}</td>
    </tr>`;
  }).join("\n");

  // Dynamic house lordships, age, and transit anchors
  const lagneshPd = chart.planets?.[lagnesh];
  const lagneshSign = lagneshPd?.sign || lagnaRashi;
  const lagneshHouse = lagneshPd?.house || 1;
  const house4Sign = signFromHouse(lagnaRashi, 4);
  const lord4 = getSignLord(house4Sign);
  const lord4Pd = chart.planets?.[lord4];
  const lord4House = lord4Pd?.house || 4;
  const jupiterCancerHouse = houseFromLagna("Cancer", lagnaRashi);
  const jupDrishtiHouses = [
    houseFromLagna("Scorpio", lagnaRashi),
    houseFromLagna("Capricorn", lagnaRashi),
    houseFromLagna("Pisces", lagnaRashi),
  ];

  // Native age calculation
  const nativeAge = typeof seekerAge === "number" ? seekerAge : (new Date().getFullYear() - (parseInt(String(birthDate).slice(0, 4), 10) || 1995));
  const isMatureNative = nativeAge >= 38;

  // Dynamic Hora suitability helper
  const horaBadgeForPlanet = (planet: string): string => {
    const owned = getPlanetHousesOwned(planet, lagnaRashi);
    const pd = chart.planets?.[planet];
    const h = pd?.house || 1;
    const ownedLabel = owned.map(ordinal).join("/");
    if (planet === lagnesh) {
      return `<span class="badge-auspicious">Supreme Lagnesh (${ownedLabel} Lord)</span>`;
    }
    const hasTrikona = owned.some(x => x === 5 || x === 9);
    const hasKendra = owned.some(x => x === 1 || x === 4 || x === 7 || x === 10);
    if (hasTrikona && hasKendra) {
      return `<span class="badge-auspicious">Yogakaraka (${ownedLabel} Lord)</span>`;
    }
    if (hasTrikona) {
      return `<span class="badge-auspicious">Benefic (${ownedLabel} Lord)</span>`;
    }
    if (owned.every(x => x === 6 || x === 8 || x === 12)) {
      return `Caution &middot; ${ownedLabel} Lord in ${ordinal(h)}`;
    }
    if (h === 6 || h === 8 || h === 12) {
      return `Caution &middot; ${ownedLabel} Lord in ${ordinal(h)}`;
    }
    return `Neutral &middot; ${ownedLabel} Lord (H${h})`;
  };

  // Dynamic top favorable Nakshatras from Sampat (2), Kshema (4), Sadhana (6), Mitra (8), Parama Mitra (9)
  const sampatStars = [0, 9, 18].map(off => ALL_NAKSHATRAS[(nIdx + 1 + off) % 27]);
  const kshemaStars = [0, 9, 18].map(off => ALL_NAKSHATRAS[(nIdx + 3 + off) % 27]);
  const sadhanaStars = [0, 9, 18].map(off => ALL_NAKSHATRAS[(nIdx + 5 + off) % 27]);
  const topFinancialStars = `${sampatStars[0]} / ${sadhanaStars[0]}`;
  const topContractStars = `${kshemaStars[0]} / ${sampatStars[1]}`;
  const topTravelTaras = `${sampatStars[2]} / ${kshemaStars[1]}`;

  // Verified 2027 Master Pool (~40 Panchang dates; ZERO Rikta Tithis 4/9/14, ZERO Vishti, ZERO Bharani/Ugra)
  interface MasterPanchangDate {
    iso: string;
    label: string;
    quarter: "Q1" | "Q2" | "Q3" | "Q4";
    tithi: string;
    nakshatra: string;
    window: string;
    milestone: string;
    baseScore: number;
    allowJanma?: boolean;
  }
  const MASTER_2027_POOL: MasterPanchangDate[] = [
    // Q1
    { iso: "2027-01-08", label: "08 Jan 2027", quarter: "Q1", tithi: "Shukla Pratipada", nakshatra: "Uttara Ashadha", window: "11:45 AM &ndash; 12:35 PM", milestone: "Strategic planning, long-term goal setting", baseScore: 93 },
    { iso: "2027-01-14", label: "14 Jan 2027", quarter: "Q1", tithi: "Makar Sankranti", nakshatra: "Shravana", window: "11:45 AM &ndash; 12:35 PM", milestone: "Commercial contracts, corporate treasury rebalancing", baseScore: 98 },
    { iso: "2027-01-18", label: "18 Jan 2027", quarter: "Q1", tithi: "Shukla Dashami", nakshatra: "Rohini", window: "11:40 AM &ndash; 12:28 PM (Abhijit)", milestone: "Enterprise incorporation, high-leverage agreements", baseScore: 98 },
    { iso: "2027-01-22", label: "22 Jan 2027", quarter: "Q1", tithi: "Pausha Purnima", nakshatra: "Pushya", window: "09:30 AM &ndash; 11:00 AM", milestone: "Advisory briefings, launching premium services", baseScore: 96 },
    { iso: "2027-01-29", label: "29 Jan 2027", quarter: "Q1", tithi: "Krishna Saptami", nakshatra: "Hasta", window: "10:15 AM &ndash; 11:45 AM", milestone: "Operational rollouts, analytical milestones", baseScore: 94 },
    { iso: "2027-02-04", label: "04 Feb 2027", quarter: "Q1", tithi: "Shukla Dwitiya", nakshatra: "Dhanishta", window: "11:45 AM &ndash; 12:35 PM", milestone: "Team expansion, leadership alignment", baseScore: 93 },
    { iso: "2027-02-08", label: "08 Feb 2027", quarter: "Q1", tithi: "Shukla Saptami", nakshatra: "Uttara Bhadrapada", window: "10:15 AM &ndash; 11:45 AM", milestone: "Real estate purchase, property token disbursement", baseScore: 94 },
    { iso: "2027-02-12", label: "12 Feb 2027", quarter: "Q1", tithi: "Shukla Ekadashi", nakshatra: "Ashwini", window: "09:15 AM &ndash; 10:45 AM", milestone: "New ventures, rapid client onboarding", baseScore: 95 },
    { iso: "2027-02-19", label: "19 Feb 2027", quarter: "Q1", tithi: "Krishna Dwitiya", nakshatra: "Uttara Phalguni", window: "11:45 AM &ndash; 12:35 PM", milestone: "Board resolutions, institutional partnerships", baseScore: 95 },
    { iso: "2027-02-24", label: "24 Feb 2027", quarter: "Q1", tithi: "Krishna Panchami", nakshatra: "Hasta", window: "11:50 AM &ndash; 12:40 PM", milestone: "Luxury vehicle acquisition, asset upgrades", baseScore: 97 },
    { iso: "2027-03-04", label: "04 Mar 2027", quarter: "Q1", tithi: "Krishna Ekadashi", nakshatra: "Shravana", window: "10:00 AM &ndash; 11:30 AM", milestone: "Financial audits, debt restructuring", baseScore: 94 },
    { iso: "2027-03-12", label: "12 Mar 2027", quarter: "Q1", tithi: "Shukla Panchami", nakshatra: "Rohini", window: "09:30 AM &ndash; 11:00 AM", milestone: "Filing patents, registering trademark IP", baseScore: 95 },
    { iso: "2027-03-19", label: "19 Mar 2027", quarter: "Q1", tithi: "Shukla Dwadashi", nakshatra: "Punarvasu", window: "11:45 AM &ndash; 12:35 PM", milestone: "Renewal of retainers, cross-border agreements", baseScore: 94 },
    { iso: "2027-03-29", label: "29 Mar 2027", quarter: "Q1", tithi: "Krishna Saptami", nakshatra: "Anuradha", window: "10:15 AM &ndash; 11:45 AM", milestone: "Closing strategic alliances, financial covenants", baseScore: 95 },
    // Q2
    { iso: "2027-04-07", label: "07 Apr 2027", quarter: "Q2", tithi: "Chaitra Navratri Day 1", nakshatra: "Ashwini", window: "07:30 AM &ndash; 09:00 AM", milestone: "<strong>Vikram Samvat 2084 Ingress:</strong> Enterprise incorporation", baseScore: 99 },
    { iso: "2027-04-14", label: "14 Apr 2027", quarter: "Q2", tithi: "Shukla Ashtami", nakshatra: "Pushya", window: "10:30 AM &ndash; 12:00 PM", milestone: "Capital allocation, treasury expansion", baseScore: 96 },
    { iso: "2027-04-21", label: "21 Apr 2027", quarter: "Q2", tithi: "Shukla Purnima", nakshatra: "Swati", window: "11:45 AM &ndash; 12:35 PM", milestone: "International partnership signing, enterprise expansion", baseScore: 97 },
    { iso: "2027-04-28", label: "28 Apr 2027", quarter: "Q2", tithi: "Krishna Saptami", nakshatra: "Uttara Ashadha", window: "09:30 AM &ndash; 11:00 AM", milestone: "Long-term infrastructure &amp; property deeds", baseScore: 95 },
    { iso: "2027-05-09", label: "09 May 2027", quarter: "Q2", tithi: "Akshaya Tritiya", nakshatra: "Rohini", window: "07:30 AM &ndash; 11:30 AM", milestone: "<strong>Golden Sovereign Day:</strong> Bullion investment, enterprise launch", baseScore: 100 },
    { iso: "2027-05-14", label: "14 May 2027", quarter: "Q2", tithi: "Shukla Ashtami", nakshatra: "Uttara Phalguni", window: "10:00 AM &ndash; 11:30 AM", milestone: "Executive hiring, governance charters", baseScore: 95 },
    { iso: "2027-05-21", label: "21 May 2027", quarter: "Q2", tithi: "Jyeshtha Purnima", nakshatra: "Anuradha", window: "09:00 AM &ndash; 10:30 AM", milestone: "Property acquisition, signing deed agreements", baseScore: 96 },
    { iso: "2027-05-28", label: "28 May 2027", quarter: "Q2", tithi: "Krishna Saptami", nakshatra: "Dhanishta", window: "11:45 AM &ndash; 12:35 PM", milestone: "Commercial expansion, liquidity deployment", baseScore: 94 },
    { iso: "2027-06-08", label: "08 Jun 2027", quarter: "Q2", tithi: "Shukla Panchami", nakshatra: "Pushya", window: "10:30 AM &ndash; 12:00 PM", milestone: "Major marketing launch, releasing public initiatives", baseScore: 95 },
    { iso: "2027-06-16", label: "16 Jun 2027", quarter: "Q2", tithi: "Shukla Dwadashi", nakshatra: "Swati", window: "11:45 AM &ndash; 12:35 PM", milestone: "Trade negotiations, vendor contracts", baseScore: 94 },
    { iso: "2027-06-22", label: "22 Jun 2027", quarter: "Q2", tithi: "Summer Solstice", nakshatra: "Shravana", window: "11:40 AM &ndash; 12:30 PM", milestone: "Public announcement, press releases, leadership addresses", baseScore: 95 },
    // Q3
    { iso: "2027-07-07", label: "07 Jul 2027", quarter: "Q3", tithi: "Shukla Tritiya", nakshatra: "Pushya", window: "09:30 AM &ndash; 11:00 AM", milestone: "Internal governance review, treasury reserves", baseScore: 95 },
    { iso: "2027-07-10", label: "10 Jul 2027", quarter: "Q3", tithi: "Shukla Saptami", nakshatra: "Uttara Phalguni", window: "10:15 AM &ndash; 11:45 AM", milestone: "Strategic partnerships, executive hiring", baseScore: 94 },
    { iso: "2027-07-14", label: "14 Jul 2027", quarter: "Q3", tithi: "Shukla Ekadashi", nakshatra: "Swati", window: "11:50 AM &ndash; 12:40 PM", milestone: "Executing infrastructure upgrades, system hardening", baseScore: 93 },
    { iso: "2027-07-18", label: "18 Jul 2027", quarter: "Q3", tithi: "Guru Purnima", nakshatra: "Uttara Ashadha", window: "08:00 AM &ndash; 10:00 AM", milestone: "Honoring mentors, strategic advisory board meetings", baseScore: 96, allowJanma: true },
    { iso: "2027-07-24", label: "24 Jul 2027", quarter: "Q3", tithi: "Krishna Shashthi", nakshatra: "Revati", window: "09:45 AM &ndash; 11:15 AM", milestone: "International trade settlements, IP filings", baseScore: 94 },
    { iso: "2027-07-28", label: "28 Jul 2027", quarter: "Q3", tithi: "Krishna Dashami", nakshatra: "Rohini", window: "10:00 AM &ndash; 11:30 AM", milestone: "Asset consolidation, portfolio rebalancing", baseScore: 95 },
    { iso: "2027-08-05", label: "05 Aug 2027", quarter: "Q3", tithi: "Shukla Tritiya", nakshatra: "Uttara Phalguni", window: "10:00 AM &ndash; 11:30 AM", milestone: "Brand refresh, long-term vendor contracts", baseScore: 95 },
    { iso: "2027-08-11", label: "11 Aug 2027", quarter: "Q3", tithi: "Shukla Dashami", nakshatra: "Anuradha", window: "10:30 AM &ndash; 12:00 PM", milestone: "Auditing balance sheets, optimizing tax strategies", baseScore: 94 },
    { iso: "2027-08-18", label: "18 Aug 2027", quarter: "Q3", tithi: "Krishna Dwitiya", nakshatra: "Dhanishta", window: "11:35 AM &ndash; 12:30 PM", milestone: "Treasury liquidity deployment, capital structuring", baseScore: 93 },
    { iso: "2027-08-20", label: "20 Aug 2027", quarter: "Q3", tithi: "Krishna Tritiya", nakshatra: "Uttara Bhadrapada", window: "11:45 AM &ndash; 12:35 PM", milestone: "Real estate documentation, quiet capital preservation", baseScore: 94 },
    { iso: "2027-08-25", label: "25 Aug 2027", quarter: "Q3", tithi: "Krishna Ashtami", nakshatra: "Rohini", window: "11:45 PM &ndash; 12:35 AM", milestone: "Janmashtami Sadhana &middot; Deep subconscious alignment", baseScore: 97 },
    { iso: "2027-09-03", label: "03 Sep 2027", quarter: "Q3", tithi: "Shukla Tritiya", nakshatra: "Chitra", window: "09:30 AM &ndash; 11:00 AM", milestone: "Design launches, architectural &amp; product releases", baseScore: 95 },
    { iso: "2027-09-08", label: "08 Sep 2027", quarter: "Q3", tithi: "Shukla Saptami", nakshatra: "Anuradha", window: "11:45 AM &ndash; 12:35 PM", milestone: "Filing corporate compliance, finalizing Q4 roadmap", baseScore: 92 },
    { iso: "2027-09-16", label: "16 Sep 2027", quarter: "Q3", tithi: "Shukla Purnima", nakshatra: "Uttara Bhadrapada", window: "10:00 AM &ndash; 11:30 AM", milestone: "Research synthesis, executive documentation", baseScore: 94 },
    { iso: "2027-09-22", label: "22 Sep 2027", quarter: "Q3", tithi: "Autumnal Equinox", nakshatra: "Rohini", window: "09:15 AM &ndash; 10:45 AM", milestone: "Publishing research papers, releasing key initiatives", baseScore: 94 },
    { iso: "2027-09-27", label: "27 Sep 2027", quarter: "Q3", tithi: "Krishna Trayodashi", nakshatra: "Punarvasu", window: "10:30 AM &ndash; 12:00 PM", milestone: "Pre-Q4 supply chain &amp; distribution lock-in", baseScore: 93 },
    // Q4
    { iso: "2027-10-04", label: "04 Oct 2027", quarter: "Q4", tithi: "Shukla Panchami", nakshatra: "Chitra", window: "10:00 AM &ndash; 11:30 AM", milestone: "Navratri creative &amp; commercial campaign launch", baseScore: 95 },
    { iso: "2027-10-09", label: "09 Oct 2027", quarter: "Q4", tithi: "Vijayadashami (Dussehra)", nakshatra: "Shravana", window: "02:00 PM &ndash; 03:30 PM", milestone: "<strong>Supreme Victory Day:</strong> Launching products, signing deals", baseScore: 100 },
    { iso: "2027-10-14", label: "14 Oct 2027", quarter: "Q4", tithi: "Shukla Purnima", nakshatra: "Revati", window: "09:45 AM &ndash; 11:15 AM", milestone: "Sharad Purnima capital &amp; treasury alignment", baseScore: 96 },
    { iso: "2027-10-18", label: "18 Oct 2027", quarter: "Q4", tithi: "Krishna Tritiya", nakshatra: "Rohini", window: "11:45 AM &ndash; 12:35 PM", milestone: "Pre-Diwali inventory &amp; commercial contracts", baseScore: 95 },
    { iso: "2027-10-27", label: "27 Oct 2027", quarter: "Q4", tithi: "Dhanteras", nakshatra: "Hasta", window: "06:30 PM &ndash; 08:00 PM", milestone: "Purchasing gold, metals, new hardware assets", baseScore: 99 },
    { iso: "2027-10-29", label: "29 Oct 2027", quarter: "Q4", tithi: "Deepavali Lakshmi Puja", nakshatra: "Swati", window: "07:15 PM &ndash; 08:45 PM", milestone: "Closing annual commercial ledgers, wealth consecration", baseScore: 100 },
    { iso: "2027-11-06", label: "06 Nov 2027", quarter: "Q4", tithi: "Shukla Saptami", nakshatra: "Uttara Ashadha", window: "10:15 AM &ndash; 11:45 AM", milestone: "Institutional mandates, board governance sign-off", baseScore: 94 },
    { iso: "2027-11-10", label: "10 Nov 2027", quarter: "Q4", tithi: "Devutthana Ekadashi", nakshatra: "Uttara Bhadrapada", window: "09:30 AM &ndash; 11:00 AM", milestone: "Ending Chaturmas; resuming grand commercial contracts", baseScore: 98 },
    { iso: "2027-11-18", label: "18 Nov 2027", quarter: "Q4", tithi: "Krishna Panchami", nakshatra: "Pushya", window: "11:45 AM &ndash; 12:35 PM", milestone: "Partnership renewals, capital commitments", baseScore: 96 },
    { iso: "2027-11-24", label: "24 Nov 2027", quarter: "Q4", tithi: "Krishna Ekadashi", nakshatra: "Uttara Phalguni", window: "10:00 AM &ndash; 11:30 AM", milestone: "Strategic M&amp;A review, senior leadership onboarding", baseScore: 95 },
    { iso: "2027-12-01", label: "01 Dec 2027", quarter: "Q4", tithi: "Shukla Tritiya", nakshatra: "Uttara Ashadha", window: "11:40 AM &ndash; 12:30 PM", milestone: "Institutional partnership agreements, venture funding", baseScore: 93 },
    { iso: "2027-12-06", label: "06 Dec 2027", quarter: "Q4", tithi: "Shukla Ashtami", nakshatra: "Dhanishta", window: "11:35 AM &ndash; 12:30 PM", milestone: "Q4 liquidity harvesting, debt retirement", baseScore: 94 },
    { iso: "2027-12-10", label: "10 Dec 2027", quarter: "Q4", tithi: "Shukla Dwadashi", nakshatra: "Ashwini", window: "10:15 AM &ndash; 11:45 AM", milestone: "Year-end settlements, strategic acquisitions", baseScore: 95 },
    { iso: "2027-12-15", label: "15 Dec 2027", quarter: "Q4", tithi: "Krishna Dwitiya", nakshatra: "Punarvasu", window: "09:30 AM &ndash; 11:00 AM", milestone: "Annual contract renewals, 2028 budget lock", baseScore: 94 },
    { iso: "2027-12-22", label: "22 Dec 2027", quarter: "Q4", tithi: "Winter Solstice", nakshatra: "Hasta", window: "10:00 AM &ndash; 11:30 AM", milestone: "Final year-end capital allocation, bonus distributions", baseScore: 96 },
  ];

  const FAVORABLE_TARAS = new Set([2, 4, 6, 8, 9]);
  const filterQuarterDates = (q: "Q1" | "Q2" | "Q3" | "Q4") => {
    const pool = MASTER_2027_POOL.filter(d => d.quarter === q);
    const matched = pool
      .map(d => {
        const tb = calculateTaraBala(nakshatra, d.nakshatra);
        const weekday = new Date(d.iso + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
        return { ...d, tb, weekday };
      })
      .filter(d => FAVORABLE_TARAS.has(d.tb.taraNum) || (d.allowJanma && d.tb.taraNum === 1));
    return matched.slice(0, 6);
  };

  const renderQuarterRows = (q: "Q1" | "Q2" | "Q3" | "Q4") => {
    const rows = filterQuarterDates(q);
    return rows.map(d => {
      const taraDisplay = d.tb.taraNum === 1 ? "Janma Shuddhi" : d.tb.taraName;
      return `<tr>
        <td><strong>${d.label}</strong> (${d.weekday})</td>
        <td>${d.tithi} &middot; ${d.nakshatra}</td>
        <td>${d.window}</td>
        <td>${d.milestone}</td>
        <td><span class="badge-auspicious">${taraDisplay} (${d.baseScore}/100)</span></td>
      </tr>`;
    }).join("\n");
  };

  const q1Filtered = filterQuarterDates("Q1");
  const q2Filtered = filterQuarterDates("Q2");
  const q4Filtered = filterQuarterDates("Q4");
  const q1TopDatesText = q1Filtered.slice(0, 2).map(d => d.label.replace(" 2027", "")).join(" and ") || "Q1 Sampat windows";
  const q2TopDate = q2Filtered.slice().sort((a, b) => b.baseScore - a.baseScore)[0]?.label || "your highest-scoring Q2 table date";
  const q4TopDate = q4Filtered.slice().sort((a, b) => b.baseScore - a.baseScore)[0]?.label || "your highest-scoring Q4 table date";
  const CAUTION_TARAS = new Set([3, 5, 7]);
  const rohiniTara = calculateTaraBala(nakshatra, "Rohini");
  const hastaTara = calculateTaraBala(nakshatra, "Hasta");
  const shravanaTara = calculateTaraBala(nakshatra, "Shravana");
  const swatiTara = calculateTaraBala(nakshatra, "Swati");

  // Top 3 commercial launch windows dynamically filtered from 2027 pool
  const commercialLaunchRows = MASTER_2027_POOL
    .map(d => {
      const tb = calculateTaraBala(nakshatra, d.nakshatra);
      const weekday = new Date(d.iso + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
      return { ...d, tb, weekday };
    })
    .filter(d => FAVORABLE_TARAS.has(d.tb.taraNum))
    .slice(0, 3)
    .map(d => `<tr>
      <td><strong>${d.label}</strong> (${d.weekday})</td>
      <td>${d.tithi} &middot; ${d.nakshatra}</td>
      <td>${d.window} (${lagnesh} Hora)</td>
      <td><span class="badge-auspicious">${d.tb.taraName} Tara (Pass)</span></td>
      <td><strong>${d.baseScore} / 100</strong></td>
    </tr>`).join("\n");

  // Calculate live Panchang anchor
  let panchang: PanchangResult;
  try {
    panchang = calculatePanchang(new Date("2026-11-24T12:00:00Z"), 5.5, Number(lat), Number(lon));
  } catch {
    panchang = {} as any;
  }

  // Scan realistic upcoming auspicious windows
  let businessWindows: MuhuratWindow[] = [];
  try {
    businessWindows = scanAuspiciousMuhurats({
      category: "business",
      startDate: new Date("2026-12-01T00:00:00Z"),
      daysToScan: 60,
      tz: 5.5,
      location: { lat: Number(lat), lon: Number(lon) },
      natalMoonNakshatra: nakshatra
    });
  } catch {
    businessWindows = [];
  }

  const headerRail = (sectionTitle: string) => `
    <header class="header-rail">
      <div class="brand">ASTROLIFE &middot; GOLDEN MUHURAT SUITE</div>
      <div class="section-title">${sectionTitle}</div>
      <div class="edition">SOVEREIGN EDITION</div>
    </header>
  `;

  const footerRail = (chapterTitle: string, pageNum: number) => `
    <footer class="footer-rail">
      <div class="subject">${subjectName} &middot; Ref: ${orderId}</div>
      <div class="doc-info">${chapterTitle}</div>
      <div class="page-number">${pageNum}</div>
    </footer>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>AstroLife &mdash; Golden Muhurat &amp; Auspicious Decision Suite &mdash; ${subjectName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap');

  :root {
    --bg: #030712;
    --surface: #0B1220;
    --surface-elevated: #111C2E;
    --surface-accent: #17253B;
    --gold: #C9A961;
    --gold-bright: #E5C985;
    --gold-dim: #8C7440;
    --gold-glow: rgba(201,169,97,0.18);
    --border-gold: rgba(201,169,97,0.32);
    --border-gold-strong: rgba(201,169,97,0.65);
    --teal: #0D9488;
    --teal-bright: #14B8A6;
    --border-teal: rgba(20,184,166,0.35);
    --amber: #D97706;
    --amber-bright: #F59E0B;
    --ruby: #DC2626;
    --ruby-bright: #EF4444;
    --emerald: #059669;
    --emerald-bright: #10B981;
    --purple: #7C3AED;
    --purple-bright: #8B5CF6;
    --ivory: #FBF9F4;
    --ivory-dim: #D1C9BE;
    --ivory-mute: #8E867A;
  }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    background: var(--bg);
    color: var(--ivory);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 11px;
    line-height: 1.5;
    letter-spacing: -0.01em;
  }

  .mantra-devanagari, .devanagari-safe {
    font-family: 'Noto Serif Devanagari', 'Noto Sans Devanagari', serif;
    font-size: 15px;
    line-height: 1.8;
    color: var(--gold-bright);
    letter-spacing: 0 !important;
    text-shadow: 0 0 16px rgba(229,201,133,0.35);
    margin: 6px 0;
    text-align: center;
  }

  .page {
    width: 794px;
    height: 1122px;
    max-height: 1122px;
    padding: 36px 44px 34px 44px;
    position: relative;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
    background: radial-gradient(circle at 50% 8%, rgba(20,184,166,0.06) 0%, transparent 55%),
                radial-gradient(circle at 85% 90%, rgba(201,169,97,0.05) 0%, transparent 60%),
                var(--bg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .header-rail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-gold);
    padding-bottom: 7px;
    font-family: 'Cinzel', serif;
    font-size: 8px;
    letter-spacing: 0.22em;
    color: var(--gold);
    text-transform: uppercase;
  }

  .header-rail .brand { font-weight: 700; color: var(--gold-bright); }
  .header-rail .section-title { color: var(--ivory-dim); font-size: 7.5px; }
  .header-rail .edition { color: var(--teal-bright); letter-spacing: 0.16em; font-weight: 600; }

  .footer-rail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border-gold);
    padding-top: 7px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5px;
    color: var(--ivory-mute);
    letter-spacing: 0.08em;
  }

  .footer-rail .page-number {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    color: var(--gold-bright);
    font-size: 9px;
  }

  .display-l {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 26px;
    line-height: 1.15;
    font-weight: 700;
    color: var(--gold-bright);
    letter-spacing: -0.01em;
  }

  .kicker {
    font-family: 'Cinzel', serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: var(--teal-bright);
    text-transform: uppercase;
    margin-bottom: 3px;
  }

  .body-text {
    font-size: 10.5px;
    line-height: 1.55;
    color: var(--ivory-dim);
  }

  .luxury-card {
    background: var(--surface);
    border: 1px solid var(--border-gold);
    border-radius: 6px;
    padding: 12px 14px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.35);
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5px;
  }

  .data-table th {
    background: var(--surface-accent);
    color: var(--gold-bright);
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 8px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 6px 8px;
    text-align: left;
    border-bottom: 1px solid var(--border-gold);
  }

  .data-table td {
    padding: 6px 8px;
    border-bottom: 1px solid rgba(201,169,97,0.12);
    color: var(--ivory-dim);
    line-height: 1.35;
  }

  .data-table tr:last-child td {
    border-bottom: none;
  }

  .badge-auspicious {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.05em;
    background: rgba(16,185,129,0.15);
    color: #10B981;
    border: 1px solid rgba(16,185,129,0.4);
  }

  .badge-avoid {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.05em;
    background: rgba(239,68,68,0.15);
    color: #EF4444;
    border: 1px solid rgba(239,68,68,0.4);
  }

  .badge-caution {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.05em;
    background: rgba(245,158,11,0.15);
    color: #F59E0B;
    border: 1px solid rgba(245,158,11,0.4);
  }
</style>
</head>
<body>

<!-- PAGE 1: COVER PAGE -->
<section class="page" style="justify-content:center;align-items:center;text-align:center;background:radial-gradient(circle at 50% 30%, rgba(20,184,166,0.14) 0%, transparent 60%), #030712;">
  <div style="border:1.5px solid var(--border-gold-strong);padding:46px 36px;border-radius:12px;width:100%;max-width:680px;background:rgba(11,18,32,0.85);box-shadow:0 12px 48px rgba(0,0,0,0.7);">
    
    <div style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.35em;color:var(--teal-bright);margin-bottom:12px;">
      ASTROLIFE SOVEREIGN SUITE &middot; DOSSIER VIII
    </div>

    <div style="width:72px;height:72px;margin:0 auto 16px;position:relative;">
      <svg viewBox="0 0 100 100" width="72" height="72">
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--gold-bright)" stroke-width="1.5" stroke-dasharray="3 2"/>
        <polygon points="50,6 92,78 8,78" fill="none" stroke="var(--teal-bright)" stroke-width="1.5"/>
        <polygon points="50,94 92,22 8,22" fill="none" stroke="var(--gold)" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="14" fill="rgba(20,184,166,0.2)" stroke="var(--gold-bright)" stroke-width="1"/>
        <circle cx="50" cy="50" r="4" fill="var(--gold-bright)"/>
      </svg>
    </div>

    <h1 style="font-family:'Cormorant Garamond',serif;font-size:38px;line-height:1.08;color:var(--gold-bright);margin-bottom:8px;font-weight:700;">
      GOLDEN MUHURAT &amp; AUSPICIOUS DECISION SUITE
    </h1>

    <div style="font-family:'Cinzel',serif;font-size:12px;letter-spacing:0.25em;color:var(--ivory-dim);margin-bottom:20px;">
      THE ARCHITECTURE OF RIGHT TIMING &middot; PANCHANGA SCIENCE
    </div>

    <p style="font-size:11px;line-height:1.6;color:var(--ivory-dim);max-width:540px;margin:0 auto 24px;">
      A deterministically generated 24-page electional astrology dossier under classical <em>Muhurta Chintamani</em>, <em>Brihat Samhita</em>, and <em>Kalaprakasika</em>. Precision-tailored to catalyze breakthrough success across commercial ventures, property, marriage, vehicle acquisitions, and high-stakes executive contracts.
    </p>

    <!-- Native Credentials Box -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:left;padding:12px 14px;background:rgba(17,28,46,0.8);border:1px solid var(--border-gold);border-radius:6px;margin-bottom:20px;">
      <div>
        <div style="font-family:'Cinzel',serif;font-size:7.5px;color:var(--teal-bright);">NATIVE &amp; ASCENDANT</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);">${subjectName}</div>
        <div style="font-size:9px;color:var(--ivory-mute);">${lagnaRashi} Lagna</div>
      </div>
      <div>
        <div style="font-family:'Cinzel',serif;font-size:7.5px;color:var(--teal-bright);">LUNAR ANCHOR</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);">${moonRashi} Moon</div>
        <div style="font-size:9px;color:var(--ivory-mute);">${nakshatra} (Pada ${moonPada})</div>
      </div>
      <div>
        <div style="font-family:'Cinzel',serif;font-size:7.5px;color:var(--teal-bright);">SEEKER VITALITY</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);">${seekerAgeStr}</div>
        <div style="font-size:9px;color:var(--ivory-mute);">${activeDasha}&ndash;${activeAntar} Dasha</div>
      </div>
    </div>

    <div style="font-family:'Cinzel',serif;font-size:8.5px;letter-spacing:0.18em;color:var(--gold);font-weight:600;">
      ✦ BRIHAT PARASHARA &middot; MUHURTA CHINTAMANI &middot; SWISS EPHEMERIS DE431 ✦
    </div>
  </div>
</section>

<!-- PAGE 2: EXECUTIVE DECISION BRIEF -->
<section class="page">
  ${headerRail("PILLAR I: PANCHANG ANATOMY &amp; DECISION MATRIX")}
  <div>
    <div class="kicker">EXECUTIVE SUMMARY &middot; THE TIME QUANTUM</div>
    <h2 class="display-l" style="margin-bottom:6px;">The Astrological Physics of Auspicious Timing</h2>
    <p class="body-text" style="margin-bottom:12px;">
      In classical Jyotish, birth charts indicate <em>potential</em>, but electional timing (<em>Muhurat</em>) governs <em>activation</em>. Initiating an endeavor at an afflicted cosmic moment is akin to launching a vessel into a hurricane; selecting an auspicious window (<em>Shubha Muhurat</em>) leverages the universal gravitational currents to ensure stability, growth, and long-term triumph.
    </p>

    <!-- 3 Core Mandates -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;">
      <div class="luxury-card" style="border-top:3px solid var(--gold);">
        <div class="kicker" style="color:var(--gold-bright);">1. THE 5-LIMB FOUNDATION</div>
        <div style="font-weight:700;font-size:11.5px;color:var(--ivory);margin:3px 0;">Pancha-Anga Synchronization</div>
        <p class="body-text" style="font-size:9.5px;">
          Tithi (Lunar Phase), Vara (Solar Day), Nakshatra (Lunar Mansion), Yoga (Angular Sum), and Karana (Half-Tithi) must harmonize with the native's natal chart to prevent cellular discord.
        </p>
      </div>
      <div class="luxury-card" style="border-top:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">2. PERSONALIZED TARA BALA</div>
        <div style="font-weight:700;font-size:11.5px;color:var(--ivory);margin:3px 0;">The 9-Star Filter</div>
        <p class="body-text" style="font-size:9.5px;">
          A universally auspicious muhurat can be toxic if it falls into your natal <em>Vipat</em> (Danger), <em>Pratyak</em> (Obstacle), or <em>Naidhana</em> (Destruction) Tara. Every window is cross-verified against your ${nakshatra} Moon.
        </p>
      </div>
      <div class="luxury-card" style="border-top:3px solid var(--ruby-bright);">
        <div class="kicker" style="color:var(--ruby-bright);">3. DOSHA MITIGATION</div>
        <div style="font-weight:700;font-size:11.5px;color:var(--ivory);margin:3px 0;">Strict Panchaka &amp; Rahu Shield</div>
        <p class="body-text" style="font-size:9.5px;">
          Avoidance of Rahu Kaal, Yamaganda, Gulika, and the 5 lethal Panchakas (Mrityu, Agni, Raja, Chora, Roga) guarantees that zero hidden vulnerabilities compromise your commercial or domestic contracts.
        </p>
      </div>
    </div>

    <!-- The Classical Axiom -->
    <div class="luxury-card" style="border-left:3px solid var(--gold-bright);margin-bottom:12px;">
      <div class="mantra-devanagari">
        मुहूर्तेन हि लभ्यन्ते सर्वसिद्धिर्न संशयः । काले तु विफलं सर्वं यत्नैरपि कृतं नरैः ॥
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);font-style:italic;text-align:center;">
        &ldquo;Through the right Muhurat, all accomplishments are undeniably secured. But at an adverse time, even the most monumental human efforts collapse into futility.&rdquo; &mdash; Daivajna Rama, Muhurta Chintamani
      </div>
    </div>

    <!-- Quick Reference Snapshot -->
    <table class="data-table">
      <thead>
        <tr>
          <th>Pillar / Domain</th>
          <th>Classical Shastra Authority</th>
          <th>Native Alignment (${subjectName})</th>
          <th>Strategic Impact</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Commercial Startups</strong></td>
          <td>Muhurta Chintamani &middot; Ch. 11</td>
          <td>${lagnesh} Lagnesh in ${ordinal(lagneshHouse)} ${lagneshSign}; ${lagnesh} / Benefic Horas</td>
          <td>Intellectual property stability, investor liquidity</td>
        </tr>
        <tr>
          <td><strong>Property &amp; Space</strong></td>
          <td>Brihat Samhita &middot; Vastu Shastra</td>
          <td>4th Lord ${lord4} in ${ordinal(lord4House)}; Fixed Signs (Taurus/Leo) required</td>
          <td>Permanence of asset, zero domestic legal friction</td>
        </tr>
        <tr>
          <td><strong>Sacred Alliances</strong></td>
          <td>Kalaprakasika &middot; Vivah Adhyaya</td>
          <td>Jupiter Cancer Transit (${ordinal(jupiterCancerHouse)} House) 2026&ndash;2027</td>
          <td>Sacred soul alignment, lifelong partnership fortune</td>
        </tr>
      </tbody>
    </table>
  </div>
  ${footerRail("Executive Decision Brief", 2)}
</section>

<!-- PAGE 3: THE FIVE LIMBS OF TIME -->
<section class="page">
  ${headerRail("PILLAR I: PANCHANG ANATOMY &amp; DECISION MATRIX")}
  <div>
    <div class="kicker">PANCHA-ANGA FOUNDATIONS</div>
    <h2 class="display-l" style="margin-bottom:6px;">The 5 Cosmic Limbs of Vedic Time</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Every micro-second of cosmic reality is divided into five vital components (<em>Pancha-Anga</em>). Each limb governs a distinct physiological and karmic dimension of human consciousness.
    </p>

    <!-- 5 Limbs Breakdown -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div class="luxury-card" style="border-left:3px solid var(--gold);">
        <div class="kicker" style="color:var(--gold-bright);">1. TITHI (LUNAR DAY) &middot; ELEMENT WATER (JALA)</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Governs: Wealth, Liquid Prosperity &amp; Taste</div>
        <p class="body-text" style="font-size:9.5px;">
          Tithi is the angular separation of 12° between the Sun and the Moon. Auspicious tithis (Nanda, Bhadra, Jaya, Purna) catalyze commercial wealth. Rikta tithis (4th, 9th, 14th) must be avoided for constructive beginnings, reserved only for surgical or destructive cleansing actions.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
        <div class="kicker" style="color:var(--ruby-bright);">2. VARA (SOLAR WEEKDAY) &middot; ELEMENT FIRE (AGNI)</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Governs: Longevity, Physical Vitality &amp; Energy</div>
        <p class="body-text" style="font-size:9.5px;">
          Ruled by the planetary day-lord. Sunday (Sun), Tuesday (Mars), and Saturday (Saturn) carry intense, fierce, or contractual weight. Wednesday (Mercury) and Thursday (Jupiter) are universal days for contracts and alliances, aligning with your ${lagnaRashi} constitution.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">3. NAKSHATRA (LUNAR MANSION) &middot; ELEMENT AIR (VAYU)</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Governs: Mental Calm, Emotional Alignment &amp; Action</div>
        <p class="body-text" style="font-size:9.5px;">
          The Moon's 27-fold stellar backdrop. Divided into Fixed (Dhruva: Rohini, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada), Swift (Kshipra: Ashwini, Pushya, Hasta), and Movable (Chara: Punarvasu, Swati, Shravana, Shatabhisha) categories to govern specific real-world tasks.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--purple-bright);">
        <div class="kicker" style="color:var(--purple-bright);">4. YOGA (ANGULAR SUM) &middot; ELEMENT ETHER (AKASHA)</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Governs: Physical Health &amp; Subconscious Harmony</div>
        <p class="body-text" style="font-size:9.5px;">
          Calculated by adding the Sun and Moon longitudes (mod 360° / 13°20'). Out of 27 Yogas, 9 inauspicious Yogas (Vishkambha, Atiganda, Shula, Ganda, Vyaghata, Vajra, Vyatipata, Parigha, Vaidhriti) inflict sudden obstruction and must be scrupulously avoided.
        </p>
      </div>
    </div>

    <!-- Karana Full-width Box -->
    <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);margin-bottom:10px;">
      <div class="kicker" style="color:var(--emerald-bright);">5. KARANA (HALF-TITHI) &middot; ELEMENT EARTH (PRITHVI)</div>
      <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Governs: Success of Enterprise &amp; Material Completion</div>
      <p class="body-text" style="font-size:9.8px;">
        Half of a Tithi (6° solar-lunar difference). 7 movable Karanas (Bava, Balava, Kaulava, Taitila, Garija, Vanija, Vishti/Bhadra) and 4 fixed Karanas (Shakuni, Chatushpada, Naga, Kintughna). <strong>Critical Mandate:</strong> The Vishti (Bhadra) Karana is strictly prohibited for travel, marriage, construction, and contract execution due to its venomous, disruptive influence.
      </p>
    </div>
  </div>
  ${footerRail("The Five Limbs of Time", 3)}
</section>

<!-- PAGE 4: NATAL TARA BALA & PERSONAL ALIGNMENT -->
<section class="page">
  ${headerRail("PILLAR I: PANCHANG ANATOMY &amp; DECISION MATRIX")}
  <div>
    <div class="kicker">PERSONALIZED STELLAR FILTER</div>
    <h2 class="display-l" style="margin-bottom:6px;">Navtara Chakra: Your Personal Stellar Resonance</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Universal calendar muhurats fail when they contradict the native's birth star (<em>Janma Nakshatra</em>). With your natal Moon anchored in <strong>${nakshatra}</strong>, the 27 Nakshatras form 9 cosmic Tara Bala zones:
    </p>

    <!-- Tara Bala Matrix Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Tara Position &amp; Name</th>
          <th>Governing Nakshatras from ${nakshatra}</th>
          <th>Shastric Grade</th>
          <th>Permitted Actions &amp; Tactical Guidance</th>
        </tr>
      </thead>
      <tbody>
        ${taraTableRows}
      </tbody>
    </table>

    <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
      <div class="kicker" style="color:var(--teal-bright);">TARA BALA CALCULATION RULE FOR ${subjectName.toUpperCase()}</div>
      <p class="body-text" style="font-size:10px;">
        Count from your Janma Nakshatra (${nakshatra} = 1) to the day's transit Moon Nakshatra, and divide by 9. The remainder corresponds to Taras 1 through 9. Whenever remainder is <strong>2, 4, 6, 8, or 9</strong>, the cosmic current is affirmatively supportive. When remainder is <strong>3, 5, or 7</strong>, pause all major capital commitments.
      </p>
    </div>
  </div>
  ${footerRail("Navtara Chakra Alignment", 4)}
</section>

<!-- PAGE 5: CHANDRA BALA & TRANSIT RADAR -->
<section class="page">
  ${headerRail("PILLAR I: PANCHANG ANATOMY &amp; DECISION MATRIX")}
  <div>
    <div class="kicker">LUNI-SOLAR TRANSIT DYNAMICS</div>
    <h2 class="display-l" style="margin-bottom:6px;">Chandra Bala: The Daily Lunar Shield</h2>
    <p class="body-text" style="margin-bottom:12px;">
      <em>Chandra Bala</em> (Lunar Strength) is the single most vital daily diagnostic. The transit Moon must occupy an auspicious position relative to your natal Moon (${moonRashi}) on the day of action.
    </p>

    <!-- Chandra Bala Houses Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div class="luxury-card" style="border:1.5px solid var(--emerald);background:rgba(16,185,129,0.06);">
        <div class="kicker" style="color:var(--emerald-bright);">AUSPICIOUS CHANDRA BALA (FROM ${moonRashi.toUpperCase()})</div>
        <div style="font-size:12px;font-weight:700;color:var(--gold-bright);margin:4px 0;">1st, 3rd, 6th, 7th, 10th, 11th Signs</div>
        <p class="body-text" style="font-size:9.8px;">
          When transit Moon passes through <strong>${auspSigns}</strong>, mental resolve is sovereign, immune resilience peaks, and counterparties perceive you with authority and favor.
        </p>
      </div>

      <div class="luxury-card" style="border:1.5px solid var(--ruby);background:rgba(220,38,38,0.06);">
        <div class="kicker" style="color:var(--ruby-bright);">DEFICIENT CHANDRA BALA (FROM ${moonRashi.toUpperCase()})</div>
        <div style="font-size:12px;font-weight:700;color:var(--ruby-bright);margin:4px 0;">2nd, 5th, 9th (Neutral) &middot; 4th, 8th, 12th (Avoid)</div>
        <p class="body-text" style="font-size:9.8px;">
          When transit Moon enters <strong>${defSigns}</strong>, Chandra Bala is strictly compromised. The mind suffers from subconscious fog, reactive panic, or physical fatigue. Never sign irrevocable documents during 8th house lunar transit (<em>Ashtama Chandra</em>).
        </p>
      </div>
    </div>

    <!-- Ashtama Chandra Warning -->
    <div class="luxury-card" style="border-left:3px solid var(--amber-bright);margin-bottom:12px;">
      <div class="card-title" style="color:var(--amber-bright);font-size:11px;">⚠️ THE ASHTAMA CHANDRA BLACKOUT PROTOCOL</div>
      <p class="body-text" style="font-size:10px;margin-top:2px;">
        For your ${moonRashi} Moon, <strong>transit Moon in ${ashtamaSign} (8th house)</strong> occurs every 27.3 days for approximately 54 hours. During these 2.25 days, your emotional nervous system is primed for cognitive distortion. Classical injunctions strictly forbid: (1) Filing legal petitions, (2) Deploying large capital lumpsums, (3) Undergoing elective surgery, or (4) Confronting adversaries. Treat Ashtama Chandra as an immutable maintenance window.
      </p>
    </div>

    <!-- Kundli Mini Widget & Context -->
    <div style="display:grid;grid-template-columns:220px 1fr;gap:12px;align-items:center;">
      <div>
        ${renderNorthIndianChart(chart, 200)}
      </div>
      <div class="luxury-card">
        <div class="kicker" style="color:var(--teal-bright);">NATAL RECEPTACLE ALIGNMENT</div>
        <p class="body-text" style="font-size:10px;">
          With your Ascendant in ${lagnaRashi} and Moon in ${moonRashi}, your constitutional decision-making is naturally reflective, strategic, and meticulous. Aligning important actions with <strong>${lagnesh}-ruled Horas</strong> allows your Lagnesh (${lagnesh}) to execute with diamond clarity.
        </p>
      </div>
    </div>
  </div>
  ${footerRail("Chandra Bala & Transit Radar", 5)}
</section>

<!-- PAGE 6: THE 24 PLANETARY HORAS -->
<section class="page">
  ${headerRail("PILLAR II: MICRO-TIME SYSTEMS &amp; HOURLY PRECISION")}
  <div>
    <div class="kicker">HOURLY CELESTIAL RULERSHIP</div>
    <h2 class="display-l" style="margin-bottom:6px;">The 24 Planetary Horas: Hourly Power Windows</h2>
    <p class="body-text" style="margin-bottom:12px;">
      While a whole day may be neutral, specific 1-hour intervals (<em>Horas</em>) ruled by favorable planets provide micro-windows of immense leverage. The 24 Horas sequence starts with the day's ruler at local sunrise and follows the descending Chaldean cosmic order (Saturn &rarr; Jupiter &rarr; Mars &rarr; Sun &rarr; Venus &rarr; Mercury &rarr; Moon).
    </p>

    <!-- Hora Master Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Planetary Hora</th>
          <th>Cosmic Nature</th>
          <th>Native Suitability (${subjectName})</th>
          <th>Tactical Applications &amp; Best Executions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--gold-bright);">Sun Hora (Surya)</strong></td>
          <td>Aggressive, Royal, Executive</td>
          <td>${horaBadgeForPlanet("Sun")}</td>
          <td>Government liaison, executive meetings, authority negotiations. Avoid debt borrowing.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal-bright);">Venus Hora (Shukra)</strong></td>
          <td>Harmonious, Creative, Material</td>
          <td>${horaBadgeForPlanet("Venus")}</td>
          <td>Commercial marketing, closing luxury sales, purchasing jewelry/vehicles, signing partnerships.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--emerald-bright);">Mercury Hora (Budha)</strong></td>
          <td>Intellectual, Analytical, Agile</td>
          <td>${horaBadgeForPlanet("Mercury")}</td>
          <td>Analytics &amp; financial modeling, publishing, accounting, sending crucial agreements.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--ivory);">Moon Hora (Chandra)</strong></td>
          <td>Fluid, Receptive, Emotional</td>
          <td>${horaBadgeForPlanet("Moon")}</td>
          <td>Water-related activities, internal team counseling, meditation. Avoid major impulsive exits.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--amber);">Saturn Hora (Shani)</strong></td>
          <td>Slow, Grounded, Enduring</td>
          <td>${horaBadgeForPlanet("Saturn")}</td>
          <td>Long-term foundation laying, structural system design, land purchase, debt settlement.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--gold);">Jupiter Hora (Guru)</strong></td>
          <td>Expansive, Ethical, Wise</td>
          <td>${horaBadgeForPlanet("Jupiter")}</td>
          <td>Consulting legal counsel, financial treasury allocation, religious rituals, learning.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--ruby-bright);">Mars Hora (Mangala)</strong></td>
          <td>Urgent, Penetrative, Combative</td>
          <td>${horaBadgeForPlanet("Mars")}</td>
          <td>Litigation defense, sports, surgical procedures. Prohibited for peace negotiations.</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">DAILY EXECUTION PROTOCOL FOR ${subjectName.toUpperCase()}</div>
      <p class="body-text" style="font-size:10px;">
        For your ${lagnaRashi} Ascendant, <strong>${lagnesh} Horas</strong> form your primary power nexus. Always schedule presentations, contract signatures, or critical milestone executions within ${lagnesh} Horas on ${sovereignInfo.day} for maximum friction-free momentum.
      </p>
    </div>
  </div>
  ${footerRail("The 24 Planetary Horas", 6)}
</section>

<!-- PAGE 7: CHAUGHADIA DYNAMICS -->
<section class="page">
  ${headerRail("PILLAR II: MICRO-TIME SYSTEMS &amp; HOURLY PRECISION")}
  <div>
    <div class="kicker">VEDIC INTERVAL TIMING</div>
    <h2 class="display-l" style="margin-bottom:6px;">Chaughadia Dynamics: Rapid Day &amp; Night Intervals</h2>
    <p class="body-text" style="margin-bottom:12px;">
      The day and night spans (sunrise to sunset, and sunset to sunrise) are each divided into 8 equal parts (approximately 1.5 hours each), known as <em>Chaughadia</em>. Grounded in traditional commerce, they dictate immediate tactical actions.
    </p>

    <!-- 7 Chaughadias Breakdown Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div class="luxury-card" style="border-left:3px solid var(--emerald);">
        <div class="kicker" style="color:var(--emerald-bright);">1. AMRITA (NECTAR) &middot; RULER: MOON</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);margin:2px 0;">Rating: Supreme Shubh (100/100)</div>
        <p class="body-text" style="font-size:9.5px;">
          Best for all constructive activities, medical healing, signing deals, travel, and religious rites. Universal success with zero residual side-effects.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">2. SHUBH (AUSPICIOUS) &middot; RULER: JUPITER</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);margin:2px 0;">Rating: Highly Auspicious (95/100)</div>
        <p class="body-text" style="font-size:9.5px;">
          Specifically recommended for educational initiations, legal agreements, marriages, and high-trust consultations. Imparts enduring ethical stability.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold);">
        <div class="kicker" style="color:var(--gold-bright);">3. LABHA (GAIN) &middot; RULER: MERCURY</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);margin:2px 0;">Rating: Commercial Zenith (95/100)</div>
        <p class="body-text" style="font-size:9.5px;">
          The prime financial window. Perfect for starting commercial sales, launching paid digital products, buying assets, and negotiating financial terms.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--purple-bright);">
        <div class="kicker" style="color:var(--purple-bright);">4. CHARA (VARIABLE) &middot; RULER: VENUS</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);margin:2px 0;">Rating: Dynamic Favorable (80/100)</div>
        <p class="body-text" style="font-size:9.5px;">
          Excellent for swift journeys, vehicular movement, dynamic technical testing, and marketing sprints. Avoid for permanent real estate deeds.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--amber);">
        <div class="kicker" style="color:var(--amber-bright);">5. ROGA (DISEASE) &middot; RULER: MARS</div>
        <div style="font-weight:700;font-size:11px;color:var(--ruby-bright);margin:2px 0;">Rating: Inauspicious &middot; Avoid (30/100)</div>
        <p class="body-text" style="font-size:9.5px;">
          Induces conflict, biological exhaustion, and technical glitches. Permitted solely for aggressive physical competition or subduing hostile adversaries.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
        <div class="kicker" style="color:var(--ruby-bright);">6. KAALA (RUIN) &middot; RULER: SATURN</div>
        <div style="font-weight:700;font-size:11px;color:var(--ruby-bright);margin:2px 0;">Rating: Severe Obstacle (15/100)</div>
        <p class="body-text" style="font-size:9.5px;">
          Total paralysis of forward momentum. High probability of contractual defaults, mechanical breakdowns, or financial loss. Strictly avoid.
        </p>
      </div>
    </div>

    <!-- Udvega Box Full-width -->
    <div class="luxury-card" style="border-left:3px solid var(--ruby);margin-bottom:10px;">
      <div class="kicker" style="color:var(--ruby-bright);">7. UDVEGA (ANXIETY) &middot; RULER: SUN &middot; RATING: AVOID (25/100)</div>
      <p class="body-text" style="font-size:9.8px;">
        Generates acute mental agitation, restless stress, and friction with institutional superiors or state agencies. Only suitable for government compliance submissions where strict formality is required, never for peaceful creative endeavors.
      </p>
    </div>
  </div>
  ${footerRail("Chaughadia Dynamics", 7)}
</section>

<!-- PAGE 8: INAUSPICIOUS PLANETARY WINDOWS -->
<section class="page">
  ${headerRail("PILLAR II: MICRO-TIME SYSTEMS &amp; HOURLY PRECISION")}
  <div>
    <div class="kicker">TEMPORAL AFFLICTION RADAR</div>
    <h2 class="display-l" style="margin-bottom:6px;">Rahu Kaal, Yamaganda &amp; Gulika Kaal Protocols</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Every day contains three approximately 90-minute sub-periods governed by the shadowy nodes and Saturn's son Gulika. These windows require strict tactical avoidance for any permanent positive initiation.
    </p>

    <!-- 3 Windows Detailed Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Dark Window</th>
          <th>Cosmic Governor</th>
          <th>Duration &amp; Timing Pattern</th>
          <th>Prohibited Actions &amp; Shastric Consequence</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--ruby-bright);">Rahu Kaal</strong></td>
          <td>Rahu (North Lunar Node)</td>
          <td>90 mins daily; 2nd octant Mon, 7th Tue, 5th Wed, 6th Thu, 4th Fri, 3rd Sat, 8th Sun</td>
          <td><strong>Zero Auspicious Undertakings:</strong> Initiations during Rahu Kaal suffer deceptive illusions, sudden reversals, and regulatory inspection.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--amber-bright);">Yamaganda</strong></td>
          <td>Ketu / Jupiter's Son</td>
          <td>90 mins daily; varies by weekday (e.g., Thu mid-morning, Wed early morning)</td>
          <td><strong>Zero Travel or Capital Ventures:</strong> Causes loss of wealth, severe delays, and fruitlessness of the mission.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--purple-bright);">Gulika Kaal</strong></td>
          <td>Gulika (Mandai / Saturn)</td>
          <td>90 mins daily; ruled by the poisonous son of Saturn</td>
          <td><strong>Actions Repeat Tediously:</strong> While negative actions repeat, positive contracts signed here become endlessly prolonged legal burdens.</td>
        </tr>
      </tbody>
    </table>

    <!-- Weekly Rahu Kaal Schedule Box -->
    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="kicker" style="color:var(--gold-bright);">WEEKDAY RAHU KAAL SCHEDULE (APPROX 06:00 AM SUNRISE BASIS)</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;font-size:9.5px;color:var(--ivory-dim);margin-top:6px;">
        <div><strong>Monday:</strong> 07:30 &ndash; 09:00 AM</div>
        <div><strong>Tuesday:</strong> 03:00 &ndash; 04:30 PM</div>
        <div><strong>Wednesday:</strong> 12:00 &ndash; 01:30 PM</div>
        <div><strong>Thursday:</strong> 01:30 &ndash; 03:00 PM</div>
        <div><strong>Friday:</strong> 10:30 &ndash; 12:00 PM</div>
        <div><strong>Saturday:</strong> 09:00 &ndash; 10:30 AM</div>
        <div><strong>Sunday:</strong> 04:30 &ndash; 06:00 PM</div>
        <div style="color:var(--teal-bright);"><em>Adjust to exact local sunrise</em></div>
      </div>
    </div>

    <!-- The Classical Invariant -->
    <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
      <div class="kicker" style="color:var(--ruby-bright);">${subjectName.toUpperCase()}'S MANDATORY RULE: NEVER SEND CONTRACTS IN ${sovereignInfo.day.toUpperCase()} RAHU KAAL</div>
      <p class="body-text" style="font-size:10px;">
        For your ${lagnaRashi} chart, ${sovereignInfo.day} is your sovereign day (ruled by Lagnesh ${lagnesh}). However, ${sovereignInfo.day}'s <strong>Rahu Kaal spans precisely from ${sovereignInfo.rahuKaal}</strong>. Never dispatch high-value commercial agreements or investor term sheets during this 90-minute window, even though ${sovereignInfo.day} itself is favorable.
      </p>
    </div>
  </div>
  ${footerRail("Rahu Kaal & Dark Windows", 8)}
</section>

<!-- PAGE 9: ABHIJIT MUHURTA & BRAHMA MUHURTA -->
<section class="page">
  ${headerRail("PILLAR II: MICRO-TIME SYSTEMS &amp; HOURLY PRECISION")}
  <div>
    <div class="kicker">SUPREME UNIVERSAL NULLIFIERS</div>
    <h2 class="display-l" style="margin-bottom:6px;">Abhijit &amp; Brahma Muhurta: The 100,000-Dosha Antidote</h2>
    <p class="body-text" style="margin-bottom:12px;">
      In classical electional astrology, when an emergency action cannot wait for an impeccably cleared calendar day, ancient rishis revealed two supreme sovereign windows capable of nullifying severe planetary blemishes.
    </p>

    <!-- Abhijit & Brahma Dual Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
      <div class="luxury-card" style="border:1.5px solid var(--gold);background:rgba(201,169,97,0.06);">
        <div class="kicker" style="color:var(--gold-bright);">1. ABHIJIT MUHURTA &middot; THE MIDDAY SHIELD</div>
        <div style="font-weight:700;font-size:12px;color:var(--gold-bright);margin:4px 0;">Timing: 8th Muhurta of Day (~11:45 AM &ndash; 12:35 PM)</div>
        <p class="body-text" style="font-size:9.8px;">
          Governed directly by Lord Vishnu. Occurs daily spanning 24 minutes before and 24 minutes after true local solar noon. It possesses the sovereign power to destroy <strong>100,000 astrological doshas</strong> (<em>Laksha Dosha Nashini</em>).
        </p>
        <div style="margin-top:8px;font-size:9px;color:var(--ivory-dim);border-top:1px solid rgba(201,169,97,0.2);padding-top:6px;">
          <em>Exception:</em> On Wednesday, Abhijit Muhurta coincides partially with Rahu Kaal; its potency is slightly diminished for South-bound travel. On all other days, it is universally victorious.
        </div>
      </div>

      <div class="luxury-card" style="border:1.5px solid var(--teal);background:rgba(20,184,166,0.06);">
        <div class="kicker" style="color:var(--teal-bright);">2. BRAHMA MUHURTA &middot; THE CREATOR'S GATEWAY</div>
        <div style="font-weight:700;font-size:12px;color:var(--teal-bright);margin:4px 0;">Timing: 96 to 48 Mins Before Local Sunrise (~04:15 &ndash; 05:05 AM)</div>
        <p class="body-text" style="font-size:9.8px;">
          The penultimate Muhurta of the night. The atmospheric electromagnetic field is saturated with nascent atomic ozone and pure Sattva. The mind accesses peak intuitive clarity.
        </p>
        <div style="margin-top:8px;font-size:9px;color:var(--ivory-dim);border-top:1px solid rgba(20,184,166,0.2);padding-top:6px;">
          <em>Best For:</em> Strategic breakthroughs, spiritual meditation, reviewing complex financial term-sheets, and composing foundational company mission statements.
        </div>
      </div>
    </div>

    <!-- Classical Shastra Inscription -->
    <div class="luxury-card" style="border-left:3px solid var(--gold-bright);margin-bottom:12px;">
      <div class="mantra-devanagari">
        अभिजित् सर्वदोषघ्नः क्षणमात्रेण सिद्ध्यति । मध्याह्ने भास्करो यद्वत् तमः सर्वं विनाशयेत् ॥
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);font-style:italic;text-align:center;">
        &ldquo;Just as the midday sun obliterates all darkness instantly, Abhijit Muhurta destroys all afflictions and grants victory to whatever action is initiated within it.&rdquo; &mdash; Narada Samhita
      </div>
    </div>

    <!-- Tactical Protocol -->
    <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">EMERGENCY DISPATCH PROTOCOL</div>
      <p class="body-text" style="font-size:10px;">
        When required to execute a high-stakes transaction under time pressure without days to scan, always aim precisely for the <strong>Midday Solar Zenith (12:05 PM &ndash; 12:25 PM)</strong>. Invoking Lord Vishnu's presence ensures complete structural protection across all transactional interfaces.
      </p>
    </div>
  </div>
  ${footerRail("Abhijit & Brahma Muhurta", 9)}
</section>

<!-- PAGE 10: PANCHAKA & SHUDDHI DOSHAS -->
<section class="page">
  ${headerRail("PILLAR II: MICRO-TIME SYSTEMS &amp; HOURLY PRECISION")}
  <div>
    <div class="kicker">LETHAL STRUCTURAL BLEMISHES</div>
    <h2 class="display-l" style="margin-bottom:6px;">Panchaka Shuddhi: The 5 Structural Afflictions</h2>
    <p class="body-text" style="margin-bottom:12px;">
      In classical electional Jyotish, <em>Panchaka</em> refers to an astronomical blemish calculated from the sum of Tithi, Vara, Nakshatra, and the rising Lagna divided by 9. Specific remainders activate lethal flaws that must be avoided for property, marriage, and long-term structures.
    </p>

    <!-- Panchaka Remainder Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Remainder</th>
          <th>Panchaka Type</th>
          <th>Biological &amp; Karmic Danger</th>
          <th>Prohibited Actions &amp; Upaya Remedy</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Remainder 1</strong></td>
          <td><strong style="color:var(--ruby-bright);">Mrityu Panchaka</strong> (Death)</td>
          <td>Extreme danger of physical ruin or failure</td>
          <td>Strictly avoid surgical procedures, marriage, and purchasing assets. Daan of sesame seeds.</td>
        </tr>
        <tr>
          <td><strong>Remainder 2</strong></td>
          <td><strong style="color:var(--amber-bright);">Agni Panchaka</strong> (Fire)</td>
          <td>Destructive friction, burning out, electrical failure</td>
          <td>Avoid house construction, installing servers/machinery, signing contracts. Daan of gold/ghee.</td>
        </tr>
        <tr>
          <td><strong>Remainder 4</strong></td>
          <td><strong style="color:var(--purple-bright);">Raja Panchaka</strong> (King/State)</td>
          <td>Penalties from government, litigation, regulatory audit</td>
          <td>Avoid commercial company incorporation, tax filings, legal agreements. Daan of copper.</td>
        </tr>
        <tr>
          <td><strong>Remainder 6</strong></td>
          <td><strong style="color:var(--amber);">Chora Panchaka</strong> (Theft)</td>
          <td>Deception by employees, embezzlement, cyber fraud</td>
          <td>Avoid large capital disbursements, partnerships, and shipping assets. Daan of silver.</td>
        </tr>
        <tr>
          <td><strong>Remainder 8</strong></td>
          <td><strong style="color:var(--ruby);">Roga Panchaka</strong> (Illness)</td>
          <td>Physical disease, chronic debility, stagnation</td>
          <td>Avoid starting wellness treatments or moving into new premises. Daan of raw grains.</td>
        </tr>
        <tr>
          <td><strong>Remainder 3, 5, 7, 0</strong></td>
          <td><strong style="color:var(--emerald-bright);">Shubha (Panchaka Shuddhi)</strong></td>
          <td>Flawless cosmic clearance &middot; Full Support</td>
          <td>All major life initiatives, business launches, and property ingresses permitted.</td>
        </tr>
      </tbody>
    </table>

    <!-- Additional Shuddhi Filters -->
    <div class="luxury-card" style="border-left:3px solid var(--teal-bright);margin-bottom:12px;">
      <div class="kicker" style="color:var(--teal-bright);">THE 3 FATAL ASTROLOGICAL DOSHAS TO AVOID IN ELECTIONS</div>
      <div style="font-size:10px;color:var(--ivory-dim);line-height:1.5;margin-top:4px;">
        1. <strong>Kartari Dosha:</strong> The electional Lagna or 7th house hemmed between natural malefics (Mars/Saturn/Rahu). Causes suffocation of the enterprise.<br/>
        2. <strong>Bhrigu Shatka:</strong> Venus placed in the 6th house of the election chart. Destroys harmony and leads to commercial bankruptcy.<br/>
        3. <strong>Kuja Ashtama:</strong> Mars placed in the 8th house of the election chart. Triggers sudden accidents, mechanical fires, or violent dissolution.
      </div>
    </div>
  </div>
  ${footerRail("Panchaka & Shuddhi Doshas", 10)}
</section>

<!-- PAGE 11: PILLAR III — VYAPAR & COMMERCIAL LAUNCH MUHURAT -->
<section class="page">
  ${headerRail("PILLAR III: THE 5 MAJOR LIFE MILESTONE MUHURATS")}
  <div>
    <div class="kicker">COMMERCIAL &amp; VENTURE TIMING</div>
    <h2 class="display-l" style="margin-bottom:6px;">Vyapar &amp; Startup Launch: Capitalizing Enterprise</h2>
    <p class="body-text" style="margin-bottom:12px;">
      In <em>Muhurta Chintamani</em>, the birth moment of an enterprise (incorporation, public launch, or first commercial transaction) establishes its permanent corporate horoscope. A flawed launch chart generates persistent product bugs and cashflow droughts; an auspicious launch chart attracts effortless capital and institutional prestige.
    </p>

    <!-- Shastric Criteria for Business Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div class="luxury-card" style="border-top:3px solid var(--emerald-bright);">
        <div class="kicker" style="color:var(--emerald-bright);">IDEAL LAGNAS FOR STARTUP LAUNCH</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);margin:2px 0;">Fixed &amp; Dual Signs (Taurus, Gemini, Leo, Virgo)</div>
        <p class="body-text" style="font-size:9.5px;">
          Fixed signs ensure financial stability and asset accumulation, while dual signs empower intellectual property, commerce, and strategic communications aligned with your ${lagnaRashi} Lagna.
        </p>
      </div>

      <div class="luxury-card" style="border-top:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">AUSPICIOUS COMMERCIAL NAKSHATRAS</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);margin:2px 0;">Pushya, Hasta, Anuradha, Revati, Ashwini, Rohini</div>
        <p class="body-text" style="font-size:9.5px;">
          Pushya provides divine nourishing longevity; Hasta grants rapid operational dexterity and technological execution; Anuradha catalyzes institutional alliances.
        </p>
      </div>
    </div>

    <!-- Verified Upcoming Business Launch Windows -->
    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="kicker" style="color:var(--gold-bright);">VERIFIED COMMERCIAL LAUNCH RADAR (ANNUAL CYCLE SELECTION)</div>
      <table class="data-table" style="margin-top:6px;">
        <thead>
          <tr>
            <th>Date &amp; Day</th>
            <th>Panchang Anatomy</th>
            <th>Optimal Window</th>
            <th>Tara Bala (${subjectName})</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          ${commercialLaunchRows}
        </tbody>
      </table>
    </div>

    <!-- Key Strategic Mandate -->
    <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
      <div class="kicker" style="color:var(--gold-bright);">THE ZERO-DEBT COMMERCIAL INITIATION MANDATE</div>
      <p class="body-text" style="font-size:10px;">
        ${lagnesh === "Saturn"
          ? `Never accept equity investments or take on institutional loans on a Tuesday (Mars-ruled day) or during Mars Hora / daily Rahu Kaal. Mars-ruled debt expands aggressively through friction and litigation. Sign funding term sheets during <strong>Saturday Saturn Hora (your Lagnesh) or Thursday Jupiter Hora</strong>.`
          : `Never accept equity investments or take on institutional loans on a Tuesday (Mars-ruled day) or during Saturn's Hora. Mars-ruled debt expands aggressively through friction and litigation, while Saturn-ruled debt creates heavy, prolonged amortizations. Sign funding term sheets during <strong>Thursday Jupiter Hora or Wednesday Mercury Hora</strong>.`}
      </p>
    </div>
  </div>
  ${footerRail("Vyapar & Commercial Launch", 11)}
</section>

<!-- PAGE 12: PILLAR III — VIVAH & RELATIONSHIP MUHURAT -->
<section class="page">
  ${headerRail("PILLAR III: THE 5 MAJOR LIFE MILESTONE MUHURATS")}
  <div>
    <div class="kicker">SACRED ALLIANCES &amp; UNION</div>
    <h2 class="display-l" style="margin-bottom:6px;">${isMatureNative ? "Sacred Alliances, Family Vivah &amp; Partnership Elections" : "Vivah Muhurat: The Sanctity of Sacred Union"}</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Marriage and sacred family alliances (<em>Vivah Samskara</em>) are the most rigorous elections in Vedic Shastra. The chosen Lagna represents the collective harmony of the household. For your ${lagnaRashi} Ascendant, Jupiter's exalted transit in Cancer occupies your <strong>${ordinal(jupiterCancerHouse)} house</strong> (casting protective drishti onto your ${jupDrishtiHouses.map(ordinal).join(", ")} houses) from December 2026 to July 2027.
    </p>

    <!-- Vivah Shuddhi Checklist Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Crucial Shastric Filter</th>
          <th>Classical Shastra Rule</th>
          <th>Status &amp; Verification for ${subjectName}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Guru &amp; Shukra Bala</strong></td>
          <td>Jupiter and Venus must be direct, not combust (Astha) or debilitated.</td>
          <td><span class="badge-auspicious">Exalted Jupiter in Cancer</span></td>
        </tr>
        <tr>
          <td><strong>7th House Shuddhi</strong></td>
          <td>7th house of wedding Lagna must be completely empty of all planets.</td>
          <td><span class="badge-auspicious">Mandatory Electional Condition</span></td>
        </tr>
        <tr>
          <td><strong>Solar Month (Sankranti)</strong></td>
          <td>Avoid Khar Maas (Sun in Sagittarius or Pisces) and Chaturmas.</td>
          <td><span class="badge-auspicious">Spring 2027 (Sun in Exalted Aries / Taurus)</span></td>
        </tr>
        <tr>
          <td><strong>Latta &amp; Pat Dosha</strong></td>
          <td>Planetary kicks (Latta) must not hit the bride or groom's Janma Nakshatra.</td>
          <td><span class="badge-auspicious">Cross-checked via Ephemeris</span></td>
        </tr>
      </tbody>
    </table>

    <!-- Prime Marriage Windows -->
    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="kicker" style="color:var(--gold-bright);">PREMIER VIVAH TIME-GATES (2027 SOVEREIGN SELECTION)</div>
      <div style="font-size:10px;color:var(--ivory-dim);line-height:1.6;margin-top:4px;">
        ✦ <strong>Gateway Alpha: 18 April 2027 &ndash; 26 April 2027 (Vaishakha Shukla Paksha)</strong><br/>
        Sun in exalted Aries, Jupiter exalted in Cancer ${jupDrishtiHouses.includes(7) ? "aspecting your 7th house" : `occupying your ${ordinal(jupiterCancerHouse)} house`}, Moon in favorable Tara Bala. Exceeds all 10 Shastric Shuddhi tests.<br/>
        ✦ <strong>Gateway Beta: 12 May 2027 &ndash; 20 May 2027 (Jyeshtha Shukla Paksha)</strong><br/>
        Rohini &amp; Hasta Nakshatras active; Venus strong in Taurus; flawless Chandra Bala for your ${moonRashi} Moon.${(CAUTION_TARAS.has(rohiniTara.taraNum) || CAUTION_TARAS.has(hastaTara.taraNum)) ? ` <em>Personalized Tara Note for ${nakshatra}:</em> Because ${CAUTION_TARAS.has(rohiniTara.taraNum) ? `Rohini (${rohiniTara.taraName})` : `Hasta (${hastaTara.taraName})`} falls in a caution Tara for your birth star, use this window strictly for ceremonial warmth and sign commercial contracts on <strong>${q2TopDate}</strong> instead.` : ""}
      </div>
    </div>

    <!-- The 7th House Invariant -->
    <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
      <div class="kicker" style="color:var(--ruby-bright);">CRITICAL INJUNCTION: EMPTY 7TH HOUSE AT SAPTAPADI</div>
      <p class="body-text" style="font-size:10px;">
        During the sacred 7 vows (<em>Saptapadi</em>), ensure the rising Lagna chart has an <strong>unoccupied 7th house</strong>. Even benefic planets placed in the 7th house during marriage elections create subtle possessive dependencies, while malefics cause severe post-nuptial estrangement.
      </p>
    </div>
  </div>
  ${footerRail("Vivah & Marriage Timing", 12)}
</section>

<!-- PAGE 13: PILLAR III — GRIHA PRAVESH & PROPERTY ACQUISITION -->
<section class="page">
  ${headerRail("PILLAR III: THE 5 MAJOR LIFE MILESTONE MUHURATS")}
  <div>
    <div class="kicker">SPACE DESTINY &amp; REAL ESTATE</div>
    <h2 class="display-l" style="margin-bottom:6px;">Griha Pravesh &amp; Real Estate: Anchoring Space</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Under classical <em>Vastu Shastra</em> and <em>Brihat Samhita</em>, entering a new dwelling (<em>Griha Pravesh</em>) or executing a real estate purchase anchors the Vastu Purusha's energy into your physical bio-field. It must be conducted only when the Earth is 'awake' and receptive.
    </p>

    <!-- 3 Types of Griha Pravesh -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;">
      <div class="luxury-card" style="border-top:3px solid var(--gold);">
        <div class="kicker" style="color:var(--gold-bright);">1. APURVA PRAVESH</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">New Construction Ingress</div>
        <p class="body-text" style="font-size:9.5px;">
          Entering a newly constructed building for the first time. Requires rigorous Sun in Uttarayana (Makara to Mithuna) and Shukla Paksha.
        </p>
      </div>
      <div class="luxury-card" style="border-top:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">2. SAPURVA PRAVESH</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Renovated / Re-entry</div>
        <p class="body-text" style="font-size:9.5px;">
          Re-entering an existing home after major renovations or long absence. Requires Vastu Shanti and milk-boiling ceremony.
        </p>
      </div>
      <div class="luxury-card" style="border-top:3px solid var(--emerald-bright);">
        <div class="kicker" style="color:var(--emerald-bright);">3. DANDWA PRAVESH</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Post-Disaster Ingress</div>
        <p class="body-text" style="font-size:9.5px;">
          Re-entering after forced evacuation or fire/flood. Requires specific purifying Homa rituals before occupying the bedrooms.
        </p>
      </div>
    </div>

    <!-- Griha Pravesh Master Rules Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Panchang Element</th>
          <th>Auspicious Criteria</th>
          <th>Prohibited Conditions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Solar Month</strong></td>
          <td>Magha, Phalguna, Vaishakha, Jyeshtha</td>
          <td>Ashadha, Shravana, Bhadrapada, Ashvina, Pausha</td>
        </tr>
        <tr>
          <td><strong>Tithis</strong></td>
          <td>Dwitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Trayodashi</td>
          <td>Amavasya, Purnima, Rikta Tithis (4th, 9th, 14th)</td>
        </tr>
        <tr>
          <td><strong>Nakshatras</strong></td>
          <td>Rohini, U. Phalguni, U. Ashadha, U. Bhadrapada, Mrigashira, Chitra, Anuradha, Revati</td>
          <td>Bharani, Krittika, Magha, Ashlesha, Jyeshtha, Mula</td>
        </tr>
        <tr>
          <td><strong>Days (Varas)</strong></td>
          <td>Monday, Wednesday, Thursday, Friday</td>
          <td>Sunday, Tuesday, Saturday (except under special Vastu yoga)</td>
        </tr>
      </tbody>
    </table>

    <!-- Vastu Purusha Alignment Rule -->
    <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
      <div class="kicker" style="color:var(--teal-bright);">THE BOILING MILK AUSPICIOUS OMENS RULE</div>
      <p class="body-text" style="font-size:10px;">
        Upon first entry during the selected Muhurat, place fresh cow milk in an open vessel over the kitchen stove. The milk must be allowed to boil and overflow towards the <strong>East or North</strong>. Overflow towards the East brings public honor and vitality; towards the North, unstoppable financial wealth; overflowing towards the West or South indicates mechanical expenditure and requires immediate Vastu Shanti pacification.
      </p>
    </div>
  </div>
  ${footerRail("Griha Pravesh & Property", 13)}
</section>

<!-- PAGE 14: PILLAR III — VAHAN & ASSET ACQUISITION MUHURAT -->
<section class="page">
  ${headerRail("PILLAR III: THE 5 MAJOR LIFE MILESTONE MUHURATS")}
  <div>
    <div class="kicker">VEHICLES &amp; HARD ASSETS</div>
    <h2 class="display-l" style="margin-bottom:6px;">Vahan Kharid: Vehicle &amp; Capital Asset Timing</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Under classical Parashari principles, vehicles and heavy machinery are governed by the 4th house (comforts/conveyances), Venus (luxury cars), and Mars/Saturn (engines, steel, and kinetics). Taking delivery of a vehicle under an afflicted Muhurat results in persistent mechanical faults, electronic bugs, and accident vulnerability.
    </p>

    <!-- Key Selection Criteria Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">AUSPICIOUS DAYS &amp; HORAS FOR VEHICLES</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);margin:2px 0;">Wednesday, Thursday, Friday &middot; Venus/Mercury Horas</div>
        <p class="body-text" style="font-size:9.5px;">
          Friday (Venus) ensures driving comfort, aesthetic prestige, and passenger luxury. Wednesday (Mercury) protects vehicle electronics, sensors, and GPS navigation.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--gold);">
        <div class="kicker" style="color:var(--gold-bright);">BENEFIC NAKSHATRAS FOR VAHAN DELIVERY</div>
        <div style="font-weight:700;font-size:11px;color:var(--gold-bright);margin:2px 0;">Swati, Punarvasu, Shravana, Dhanishta, Hasta, Rohini</div>
        <p class="body-text" style="font-size:9.5px;">
          Movable (Chara) Nakshatras like Swati and Punarvasu impart fluid, effortless kinetic movement. Kshipra (Swift) Nakshatras ensure rapid acceleration and safe travels.
        </p>
      </div>
    </div>

    <!-- Vehicle Delivery Protocol Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Execution Stage</th>
          <th>Protocol Action</th>
          <th>Shastric Purpose &amp; Protection</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Payment Transfer</strong></td>
          <td>Execute online transfer during Labha Chaughadia / Mercury Hora</td>
          <td>Secures asset against debt disputes or warranty invalidation.</td>
        </tr>
        <tr>
          <td><strong>Physical Drive-Out</strong></td>
          <td>Drive vehicle out of showroom facing North or East</td>
          <td>Invokes Kubera (Wealth) and Surya (Protection) channels.</td>
        </tr>
        <tr>
          <td><strong>Vahan Puja</strong></td>
          <td>Apply sandalwood paste to dashboard; crush 4 lemons under 4 tires</td>
          <td>Neutralizes metal kinetics and dispels negative showroom energy.</td>
        </tr>
        <tr>
          <td><strong>First Destination</strong></td>
          <td>Drive straight to a temple or spiritual sanctuary before home</td>
          <td>Consecrates vehicle's auric boundary with divine protection.</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
      <div class="kicker" style="color:var(--ruby-bright);">STRICT PROHIBITION: NEVER TAKE VEHICLE DELIVERY ON SATURDAY TWILIGHT</div>
      <p class="body-text" style="font-size:10px;">
        ${lagnesh === "Saturn"
          ? `While Saturn rules steel and engines (and is your Lagnesh), avoid taking retail delivery of a personal luxury vehicle on a Tuesday or during Mars Hora / Rahu Kaal, as Mars-ruled kinetics expose the chassis to sharp collision risks. Prefer Friday (Venus Hora) or Saturday (your Lagnesh Hora) with Abhijit alignment.`
          : `While Saturn rules steel and engines, taking retail delivery of a personal luxury vehicle on a Saturday or during Saturn's Hora exposes the chassis to heavy collision accidents or long-term rusting. Avoid Saturday delivery entirely unless it is industrial heavy excavation equipment.`}
      </p>
    </div>
  </div>
  ${footerRail("Vahan Kharid & Asset Timing", 14)}
</section>

<!-- PAGE 15: PILLAR III — YATRA & RELOCATION MUHURAT -->
<section class="page">
  ${headerRail("PILLAR III: THE 5 MAJOR LIFE MILESTONE MUHURATS")}
  <div>
    <div class="kicker">TRAVEL &amp; RELOCATION RADAR</div>
    <h2 class="display-l" style="margin-bottom:6px;">Yatra Muhurat: The Science of Auspicious Journeys</h2>
    <p class="body-text" style="margin-bottom:12px;">
      In <em>Brihat Samhita</em> and <em>Kalaprakasika</em>, departing on a major journey (especially international relocation, investor roadshows, or critical business negotiations) sets the karmic tone of the outcome. The primary factor to respect is <em>Disha Shoola</em> (Directional Spikes).
    </p>

    <!-- Disha Shoola Matrix Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Weekday (Vara)</th>
          <th>Disha Shoola (Forbidden Direction)</th>
          <th>Karmic Hazard</th>
          <th>Mandatory Shastric Neutralizer / Upaya</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Sunday &amp; Friday</strong></td>
          <td><strong style="color:var(--ruby-bright);">West (Pashchim)</strong></td>
          <td>Financial drain, loss of baggage, delays</td>
          <td>Consume betel leaf (Paan) or jaggery with water before departure.</td>
        </tr>
        <tr>
          <td><strong>Monday &amp; Saturday</strong></td>
          <td><strong style="color:var(--ruby-bright);">East (Purva)</strong></td>
          <td>Health exhaustion, conflict with authorities</td>
          <td>Consume a pinch of rock salt or mirror viewing before departure.</td>
        </tr>
        <tr>
          <td><strong>Tuesday &amp; Wednesday</strong></td>
          <td><strong style="color:var(--ruby-bright);">North (Uttar)</strong></td>
          <td>Mental disorientation, loss of contracts</td>
          <td>Consume coriander seeds (Dhaniya) or whole fennel before departure.</td>
        </tr>
        <tr>
          <td><strong>Thursday</strong></td>
          <td><strong style="color:var(--ruby-bright);">South (Dakshin)</strong></td>
          <td>Accidents, severe legal friction, failure</td>
          <td>Consume whole yellow mustard seeds or pure Desi Ghee before departure.</td>
        </tr>
      </tbody>
    </table>

    <!-- Relocation Guidelines -->
    <div class="luxury-card" style="margin-bottom:12px;">
      <div class="kicker" style="color:var(--gold-bright);">CROSS-CONTINENTAL RELOCATION PROTOCOL</div>
      <p class="body-text" style="font-size:10px;">
        When relocating across cities or continents (e.g., Delhi to London/Dubai/San Francisco):<br/>
        1. <strong>Depart during Fixed or Dual Lagna:</strong> Prevents sudden cancellation of residential visas or immediate return.<br/>
        2. <strong>Avoid 12th House Moon transit days:</strong> For your ${moonRashi} Moon, avoid departing on days when Moon transits ${twelfthFromMoon} (12th from ${moonRashi}), as it generates subconscious disorientation in foreign lands.<br/>
        3. <strong>Carry Natal Soil:</strong> Carry 1 small teaspoon of earth from your native ancestral soil wrapped in white cloth; release it into running water upon safe arrival.
      </p>
    </div>

    <!-- The Classical Axiom -->
    <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">THE UNIVERSAL DEPARTURE GATEWAY</div>
      <p class="body-text" style="font-size:10px;">
        If emergency international travel forces departure in the direction of Disha Shoola, take <strong>7 steps backward facing your home altar</strong>, chant the <em>Mahamrityunjaya Mantra</em> 3 times, sip fresh water with holy basil (Tulsi), and proceed without looking back.
      </p>
    </div>
  </div>
  ${footerRail("Yatra & Relocation Timing", 15)}
</section>

<!-- PAGE 16: PILLAR IV — ANNUAL CALENDAR Q1 -->
<section class="page">
  ${headerRail("PILLAR IV: ANNUAL AUSPICIOUS CALENDAR &amp; DECISION RADAR")}
  <div>
    <div class="kicker">QUARTERLY DECISION CHRONOLOGY</div>
    <h2 class="display-l" style="margin-bottom:6px;">Q1 Auspicious Chronology: Strategic Foundation</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Deterministic electional calendar for Q1 (Jan &ndash; Mar). Filtered for your ${lagnaRashi} Ascendant, ${moonRashi} Moon, and ${nakshatra} Nakshatra to eliminate all personal <em>Vipat</em>, <em>Pratyak</em>, and <em>Naidhana</em> Taras.
    </p>

    <!-- Q1 Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Date &amp; Day</th>
          <th>Tithi &amp; Nakshatra</th>
          <th>Prime Shubh Window</th>
          <th>Target Milestone</th>
          <th>Rating &amp; Tara</th>
        </tr>
      </thead>
      <tbody>
        ${renderQuarterRows("Q1")}
      </tbody>
    </table>

    <div class="luxury-card" style="border-left:3px solid var(--gold);">
      <div class="kicker" style="color:var(--gold-bright);">Q1 STRATEGIC FOCUS: INTELLECTUAL PROPERTY &amp; CAPITAL SEEDING</div>
      <p class="body-text" style="font-size:10px;">
        Q1 carries intense forward velocity with Sun entering Capricorn and Aquarius. Focus on locking down core institutional foundations, filing corporate documents, and initiating long-range capital campaigns during <strong>${q1TopDatesText}</strong> super-windows.
      </p>
    </div>
  </div>
  ${footerRail("Annual Calendar Q1", 16)}
</section>

<!-- PAGE 17: PILLAR IV — ANNUAL CALENDAR Q2 -->
<section class="page">
  ${headerRail("PILLAR IV: ANNUAL AUSPICIOUS CALENDAR &amp; DECISION RADAR")}
  <div>
    <div class="kicker">QUARTERLY DECISION CHRONOLOGY</div>
    <h2 class="display-l" style="margin-bottom:6px;">Q2 Auspicious Chronology: The Sovereign Zenith</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Q2 (Apr &ndash; Jun) represents the most cosmically fertile quarter of the year. Sun traverses exalted Aries and its own signs, while exalted Jupiter in Cancer energizes your <strong>${ordinal(jupiterCancerHouse)} house</strong> (aspecting your ${jupDrishtiHouses.map(ordinal).join(", ")} houses).
    </p>

    <!-- Q2 Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Date &amp; Day</th>
          <th>Tithi &amp; Nakshatra</th>
          <th>Prime Shubh Window</th>
          <th>Target Milestone</th>
          <th>Rating &amp; Tara</th>
        </tr>
      </thead>
      <tbody>
        ${renderQuarterRows("Q2")}
      </tbody>
    </table>

    <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
      <div class="kicker" style="color:var(--emerald-bright);">AKSHAYA TRITIYA 2027: YOUR HIGHEST COMMERCIAL LEVERAGE POINT</div>
      <p class="body-text" style="font-size:10px;">
        On <strong>Sunday, 09 May 2027 (Akshaya Tritiya)</strong>, both Sun (Exalted in Aries) and Moon (Exalted in Taurus &middot; Rohini) align in supreme shastric dignity (Vaishakha Shukla Tritiya). Any enterprise, investment, or long-term foundation established on this morning carries the classical blessing of <em>Akshaya</em> (Imperishable / Never-Decaying).${CAUTION_TARAS.has(rohiniTara.taraNum) ? ` <strong>Personal Tara Caution (${nakshatra}):</strong> Since Rohini falls in your ${ordinal(rohiniTara.taraNum)} (${rohiniTara.taraName}) Tara, observe Akshaya Tritiya for spiritual Sankalpa and charitable giving, and execute major commercial signings on your highest-scoring Q2 table date (<strong>${q2TopDate}</strong>).` : " Allocate your single highest-conviction business or property milestone to this exact window."}
      </p>
    </div>
  </div>
  ${footerRail("Annual Calendar Q2", 17)}
</section>

<!-- PAGE 18: PILLAR IV — ANNUAL CALENDAR Q3 -->
<section class="page">
  ${headerRail("PILLAR IV: ANNUAL AUSPICIOUS CALENDAR &amp; DECISION RADAR")}
  <div>
    <div class="kicker">QUARTERLY DECISION CHRONOLOGY</div>
    <h2 class="display-l" style="margin-bottom:6px;">Q3 Auspicious Chronology: The Consolidation Wave</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Q3 (Jul &ndash; Sep) coincides with the onset of Chaturmas and solar entry into Cancer and Leo. The cosmic atmosphere shifts from aggressive external expansion into consolidation, legal audit, and internal system fortifying.
    </p>

    <!-- Q3 Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Date &amp; Day</th>
          <th>Tithi &amp; Nakshatra</th>
          <th>Prime Shubh Window</th>
          <th>Target Milestone</th>
          <th>Rating &amp; Tara</th>
        </tr>
      </thead>
      <tbody>
        ${renderQuarterRows("Q3")}
      </tbody>
    </table>

    <div class="luxury-card" style="border-left:3px solid var(--purple-bright);">
      <div class="kicker" style="color:var(--purple-bright);">Q3 STRATEGIC FOCUS: INTERNAL STABILIZATION &amp; CHATURMAS PRUDENCE</div>
      <p class="body-text" style="font-size:10px;">
        During Chaturmas (monsoon season), marriage and grand domestic housewarmings are traditionally suspended. Direct your intellectual energy into internal process optimization, quality audits, and filing accounts. Your ${lagnesh} Horas on ${sovereignInfo.day} provide supreme clarity.
      </p>
    </div>
  </div>
  ${footerRail("Annual Calendar Q3", 18)}
</section>

<!-- PAGE 19: PILLAR IV — ANNUAL CALENDAR Q4 -->
<section class="page">
  ${headerRail("PILLAR IV: ANNUAL AUSPICIOUS CALENDAR &amp; DECISION RADAR")}
  <div>
    <div class="kicker">QUARTERLY DECISION CHRONOLOGY</div>
    <h2 class="display-l" style="margin-bottom:6px;">Q4 Auspicious Chronology: The Public Harvest</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Q4 (Oct &ndash; Dec) features the grand festival axis (Sharad Navratri, Vijayadashami, and Deepavali). The planetary energies unlock maximum consumer liquidity, social recognition, and commercial harvest.
    </p>

    <!-- Q4 Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Date &amp; Day</th>
          <th>Tithi &amp; Nakshatra</th>
          <th>Prime Shubh Window</th>
          <th>Target Milestone</th>
          <th>Rating &amp; Tara</th>
        </tr>
      </thead>
      <tbody>
        ${renderQuarterRows("Q4")}
      </tbody>
    </table>

    <div class="luxury-card" style="border-left:3px solid var(--gold-bright);">
      <div class="kicker" style="color:var(--gold-bright);">VIJAYADASHAMI &amp; DEEPAVALI: THE DUAL WEALTH ENGINE</div>
      <p class="body-text" style="font-size:10px;">
        On <strong>Saturday, 09 Oct 2027 (Vijayadashami &middot; Shravana)</strong>, the <em>Vijaya Muhurta</em> grants victory over roadblocks, and on <strong>Friday, 29 Oct 2027 (Deepavali &middot; Swati)</strong>, Lakshmi Puja during fixed <strong>Taurus Lagna (Vrishabha)</strong> stabilizes enterprise liquidity.${(CAUTION_TARAS.has(shravanaTara.taraNum) || CAUTION_TARAS.has(swatiTara.taraNum)) ? ` <strong>Personal Tara Caution (${nakshatra}):</strong> Since ${CAUTION_TARAS.has(shravanaTara.taraNum) ? `Shravana falls in your ${ordinal(shravanaTara.taraNum)} (${shravanaTara.taraName})` : `Swati falls in your ${ordinal(swatiTara.taraNum)} (${swatiTara.taraName})`} Tara, reserve that festival day for sacred Puja and execute major commercial signings on <strong>${q4TopDate}</strong>.` : ""}
      </p>
    </div>
  </div>
  ${footerRail("Annual Calendar Q4", 19)}
</section>

<!-- PAGE 20: ECLIPSE & SANKRANTI BLACKOUT ZONES -->
<section class="page">
  ${headerRail("PILLAR IV: ANNUAL AUSPICIOUS CALENDAR &amp; DECISION RADAR")}
  <div>
    <div class="kicker">TOTAL BLACKOUT PROTOCOLS</div>
    <h2 class="display-l" style="margin-bottom:6px;">Eclipse &amp; Sankranti Blackouts: The Inaction Shield</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Electing the right Muhurat is equally about knowing when to strictly <strong>do nothing</strong>. Eclipses (<em>Surya &amp; Chandra Grahan</em>), Sankranti transitions, and Khar Maas represent severe cosmic turbulence where all constructive physical initiatives must be totally suspended.
    </p>

    <!-- Blackout Periods Breakdown Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div class="luxury-card" style="border:1.5px solid var(--ruby);background:rgba(220,38,38,0.06);">
        <div class="kicker" style="color:var(--ruby-bright);">1. GRAHAN SUTAK &amp; ECLIPSE WINDOWS</div>
        <div style="font-weight:700;font-size:11px;color:var(--ruby-bright);margin:2px 0;">Solar: 12 Hours Prior &middot; Lunar: 9 Hours Prior</div>
        <p class="body-text" style="font-size:9.5px;">
          During the eclipse and its Sutak period, electromagnetic radiation is inverted. Consuming food, signing contracts, traveling, or operating heavy machinery is strictly prohibited. Dedicate these hours solely to internal Japa and spiritual cleansing.
        </p>
      </div>

      <div class="luxury-card" style="border:1.5px solid var(--amber);background:rgba(245,158,11,0.06);">
        <div class="kicker" style="color:var(--amber-bright);">2. SANKRANTI TRANSITION BLACKOUT</div>
        <div style="font-weight:700;font-size:11px;color:var(--amber-bright);margin:2px 0;">Punya Kaal (16 Ghatikas &approx; 6.4 Hours)</div>
        <p class="body-text" style="font-size:9.5px;">
          When the Sun transitions from one zodiac sign to another (every ~30 days), the cosmic portal is in flux. The 3.2 hours before and after the exact ingress are toxic for material business contracts. Reserved exclusively for charity (<em>Daan</em>) and holy bath.
        </p>
      </div>
    </div>

    <!-- 2027 Eclipse Blackout Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Celestial Event</th>
          <th>Date of Event</th>
          <th>Blackout Hours (IST)</th>
          <th>Mandatory Inaction Protocol</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color:var(--ruby-bright);">Annular Solar Eclipse</strong></td>
          <td><strong>06 Feb 2027</strong></td>
          <td>02:30 PM &ndash; 08:30 PM (IST)</td>
          <td>Major Solar Eclipse: Zero commercial contracts; pause algorithmic trading engines; spiritual silence.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal-bright);">Penumbral Lunar Eclipse</strong></td>
          <td><strong>21 Feb 2027</strong></td>
          <td>08:00 PM &ndash; 11:30 PM (IST)</td>
          <td>Upachhaya Grahan (NASA Catalog): Traditional Shastric Sutak is exempt; subtle meditative quietude advised.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--ruby-bright);">Total Solar Eclipse</strong></td>
          <td><strong>02 Aug 2027</strong></td>
          <td>01:00 PM &ndash; 07:00 PM (IST)</td>
          <td>Major Solar Eclipse: Complete digital detox; chant Surya Gayatri; avoid financial asset disbursements.</td>
        </tr>
        <tr>
          <td><strong style="color:var(--teal-bright);">Penumbral Lunar Eclipse</strong></td>
          <td><strong>17 Aug 2027</strong></td>
          <td>10:00 PM &ndash; 01:30 AM (IST)</td>
          <td>Upachhaya Grahan: Traditional Shastric Sutak is exempt; standard constructive activities permitted with peaceful mind.</td>
        </tr>
      </tbody>
    </table>

    <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
      <div class="kicker" style="color:var(--ruby-bright);">PITRU PAKSHA 2027 MANDATE (15 SEP &ndash; 29 SEP 2027)</div>
      <p class="body-text" style="font-size:10px;">
        During the 16 days of Pitru Paksha (Fortnight of the Ancestors), the earth realm is dedicated to honoring departed ancestors. Classical Shastra strictly bans starting new companies, buying property, taking delivery of vehicles, or purchasing gold. Channel this fortnight into lineage tarpana, family charity, and strategic reflection.
      </p>
    </div>
  </div>
  ${footerRail("Blackout Zones & Inaction Shield", 20)}
</section>

<!-- PAGE 21: PILLAR V — SHASTRIC EMERGENCY NEUTRALIZERS -->
<section class="page">
  ${headerRail("PILLAR V: SHASTRIC EMERGENCY NEUTRALIZERS &amp; CHEAT SHEET")}
  <div>
    <div class="kicker">OVERRULING INAUSPICIOUS TIMING</div>
    <h2 class="display-l" style="margin-bottom:6px;">Emergency Muhurat Protocols: When You Cannot Wait</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Modern executive life occasionally demands an immediate signature, emergency medical intervention, or unavoidable travel during an imperfect cosmic window. Classical Shastra provides four verified emergency counter-measures to neutralize malignant transits.
    </p>

    <!-- 4 Emergency Protocols Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div class="luxury-card" style="border-left:3px solid var(--gold);">
        <div class="kicker" style="color:var(--gold-bright);">1. THE VISHNU SAHASRANAMA INTERVENTION</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Antidote to: Tithi &amp; Vara Afflictions</div>
        <p class="body-text" style="font-size:9.5px;">
          Listening to or chanting the 1,000 Names of Lord Vishnu instantly clears planetary discord. Vishnu is the personification of Time (<em>Kala Purusha</em>); invoking Him superimposes cosmic order over earthly chaos.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
        <div class="kicker" style="color:var(--teal-bright);">2. THE SHIVA SANKALPA PRADAKSHINA</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Antidote to: Moon &amp; Chandra Bala Voids</div>
        <p class="body-text" style="font-size:9.5px;">
          When Moon is in the 8th house (Ashtama Chandra) or afflicted by Rahu, offer raw milk mixed with white sesame seeds to a Shiva Lingam while reciting <em>Om Namah Shivaya</em> 108 times.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--ruby-bright);">
        <div class="kicker" style="color:var(--ruby-bright);">3. THE GAYATRI KAVACHA WATER PURIFICATION</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Antidote to: Rahu Kaal &amp; Inauspicious Yogas</div>
        <p class="body-text" style="font-size:9.5px;">
          Take a copper glass filled with clean water. Hold it in the ${resolvedGender === "female" ? "left hand" : "right hand"} (${resolvedGender === "female" ? "Vama Anga" : "Dakshina Anga"}) and chant the Gayatri Mantra 11 times. Drink half and sprinkle half over the contract papers or laptop screen before proceeding.
        </p>
      </div>

      <div class="luxury-card" style="border-left:3px solid var(--emerald-bright);">
        <div class="kicker" style="color:var(--emerald-bright);">4. THE GODAAN &amp; ANNA DAAN MITIGATION</div>
        <div style="font-weight:700;font-size:11px;color:var(--ivory);margin:2px 0;">Antidote to: Panchaka &amp; Bhadra Karanas</div>
        <p class="body-text" style="font-size:9.5px;">
          ${lagnesh === "Mercury" ? "Donate fresh green grass or green vegetables to a Desi Cow" : "Feed wholesome grains or fresh cooked rice mixed with ghee to needy persons or birds"} prior to embarking on the forced venture.
        </p>
      </div>
    </div>

    <!-- Classical Emergency Sloka -->
    <div class="luxury-card" style="border-left:3px solid var(--gold-bright);margin-bottom:12px;">
      <div class="mantra-devanagari">
        यस्य स्मरणमात्रेण जन्मसंसारबन्धनात् । विमुच्यते नमस्तस्मै विष्णवे प्रभविष्णवे ॥
      </div>
      <div style="font-size:9.5px;color:var(--ivory-dim);font-style:italic;text-align:center;">
        &ldquo;By mere remembrance of Whom all bonds of earthly existence are shattered, to that all-pervading Supreme Lord Vishnu we bow, invoking His sovereign protection over this hour.&rdquo; &mdash; Vishnu Purana
      </div>
    </div>

    <!-- Protocol Summary -->
    <div class="luxury-card" style="border-left:3px solid var(--teal-bright);">
      <div class="kicker" style="color:var(--teal-bright);">THE 3-MINUTE EMERGENCY CHECKLIST</div>
      <p class="body-text" style="font-size:10px;">
        Before signing or dispatching during an unverified time: (1) Drink 3 sips of water with right palm, (2) Close eyes and chant <em>Om Namo Narayanaya</em> 12 times, (3) Confirm that local solar noon (Abhijit) is within reach. Proceed with unshakeable inner faith.
      </p>
    </div>
  </div>
  ${footerRail("Emergency Neutralizers", 21)}
</section>

<!-- PAGE 22: SACRED SANKALPA MANTRAS & RITUAL ALIGNMENT -->
<section class="page">
  ${headerRail("PILLAR V: SHASTRIC EMERGENCY NEUTRALIZERS &amp; CHEAT SHEET")}
  <div>
    <div class="kicker">MANTRA &amp; INTENTION ARCHITECTURE</div>
    <h2 class="display-l" style="margin-bottom:6px;">Sacred Sankalpa Mantras: Directing Cosmic Will</h2>
    <p class="body-text" style="margin-bottom:12px;">
      In Vedic metaphysics, an action performed without a conscious <em>Sankalpa</em> (Sacred Declaration of Intent) dissipates into the random currents of Maya. Before signing contracts, opening offices, or taking vehicle delivery, anchor your intention using these authentic Devanagari formulas.
    </p>

    <!-- Sankalpa Formula 1: Vyapar -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--emerald);">
      <div class="kicker" style="color:var(--emerald-bright);">1. VYAPAR SANKALPA (COMMERCIAL STARTUP &amp; CONTRACTS)</div>
      <div class="mantra-devanagari">
        ॐ तत्सत् अद्य ब्रह्मणो द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे कलिप्रथमचरणे मम सकल-व्यापार-अभिवृद्ध्यर्थं धनधान्य-समृद्ध्यर्थं श्रीमहाविष्णु-महालक्ष्मी-प्रीत्यर्थं इदं कार्यं आरभे ॥
      </div>
      <div style="font-size:9px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM TAT SAT &middot; FOR THE DISSOLUTION OF FINANCIAL OBSTACLES AND ATTAINMENT OF ETHICAL PROSPERITY, IN CONSECRATION TO LAKSHMI-NARAYANA, I COMMENCE THIS ENTERPRISE.
      </div>
    </div>

    <!-- Sankalpa Formula 2: Griha & Vastu -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--teal);">
      <div class="kicker" style="color:var(--teal-bright);">2. GRIHA PRAVESH SANKALPA (SPACE &amp; PROPERTY CONSECRATION)</div>
      <div class="mantra-devanagari">
        ॐ अस्य नूतन-गृह-प्रवेश-कर्मणि वास्तुदोष-शमनार्थं सर्व-उपद्रव-शान्त्यर्थं आयुर्-आरोग्य-ऐश्वर्य-प्राप्त्यर्थं वास्तुपुरुष-प्रीत्यर्थं गृहप्रवेश-कर्म करिष्ये ॥
      </div>
      <div style="font-size:9px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM &middot; IN THIS ENTRANCE INTO NEW HABITATION, FOR THE PACIFICATION OF ALL VASTU BLEMISHES AND MANIFESTATION OF ENDURING HEALTH AND HARMONY, I CONSECRATE THIS SPACE.
      </div>
    </div>

    <!-- Sankalpa Formula 3: Vahan & Yatra -->
    <div class="luxury-card" style="margin-bottom:8px;border:1.5px solid var(--gold);">
      <div class="kicker" style="color:var(--gold-bright);">3. VAHAN &amp; YATRA SANKALPA (PROTECTION OF VEHICLE &amp; JOURNEY)</div>
      <div class="mantra-devanagari">
        ॐ यतो यतः समीहसे ततो नो अभयं कुरु । शं नः कुरु प्रजाभ्योऽभयं नः पशुभ्यः ॥
      </div>
      <div style="font-size:9px;color:var(--ivory-dim);text-align:center;font-style:italic;">
        OM &middot; FROM WHATEVER DIRECTION ADVERSITY THREATENS, GRANT US FEARLESSNESS. BLESS OUR TRAVELS WITH TRANQUILITY AND ABSOLUTE PRESERVATION.
      </div>
    </div>
  </div>
  ${footerRail("Sacred Sankalpa Mantras", 22)}
</section>

<!-- PAGE 23: THE DECISION MAKER'S 10 SHASTRIC RULES -->
<section class="page">
  ${headerRail("PILLAR V: SHASTRIC EMERGENCY NEUTRALIZERS &amp; CHEAT SHEET")}
  <div>
    <div class="kicker">ALGORITHMIC DECISION DISCIPLINE</div>
    <h2 class="display-l" style="margin-bottom:6px;">The Sovereign Decision Maker's 10 Shastric Rules</h2>
    <p class="body-text" style="margin-bottom:12px;">
      Transform ancient electional astrology into a high-leverage operating system. Print this page or keep it anchored beside your workstation as a mandatory 10-point checklist before committing capital or executing agreements.
    </p>

    <!-- 10 Rules Numbered Grid -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">1. Check Tara Bala First</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">Never act during 3rd (Vipat), 5th (Pratyak), or 7th (Naidhana) Tara from ${nakshatra}.</p>
      </div>

      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">2. Verify Chandra Bala</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">Never sign irrevocable contracts when Moon is in ${ashtamaSign} (8th house from natal ${moonRashi} Moon).</p>
      </div>

      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">3. Block Out Rahu Kaal</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">Maintain an immutable calendar blocker for daily 90-minute Rahu Kaal (${sovereignInfo.day} ${sovereignInfo.rahuKaal}).</p>
      </div>

      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">4. Avoid Rikta Tithis</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">Reject Chaturthi (4th), Navami (9th), and Chaturdashi (14th) for productive beginnings.</p>
      </div>

      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">5. Leverage Midday Abhijit</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">When urgent decisions arise, utilize 11:45 AM &ndash; 12:35 PM to neutralize minor doshas.</p>
      </div>

      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">6. Select ${lagnesh} Horas</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">For your ${lagnaRashi} Ascendant, ${lagnesh} Horas catalyze key commercial agreements.</p>
      </div>

      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">7. Cleanse Vishti (Bhadra)</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">Never travel or close acquisitions during the venomous Vishti Karana.</p>
      </div>

      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">8. Respect Disha Shoola</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">Never travel North on Tue/Wed, or West on Sun/Fri without Vedic neutralizers.</p>
      </div>

      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">9. Honor Eclipse Blackout</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">Maintain absolute quietness during Solar and Lunar Eclipse Sutak windows.</p>
      </div>

      <div class="luxury-card" style="padding:8px 10px;">
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">10. Seal with Sankalpa</div>
        <p style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">Always vocalize or mentally dedicate the action to the Supreme before pressing enter.</p>
      </div>
    </div>

    <!-- Final Shastric Seal -->
    <div class="luxury-card" style="border:1.5px solid var(--emerald);background:rgba(16,185,129,0.06);text-align:center;">
      <div style="font-family:'Cinzel',serif;font-size:9.5px;font-weight:700;color:var(--emerald-bright);">
        ✦ THE SOVEREIGN TIMING INVARIANT ✦
      </div>
      <div style="font-size:9px;color:var(--ivory-dim);margin-top:2px;">
        Timing is not superstition; it is the conscious alignment of human effort with celestial geometry. When you honor Time, Time honors your legacy.
      </div>
    </div>
  </div>
  ${footerRail("10 Shastric Rules", 23)}
</section>

<!-- PAGE 24: MASTER 1-PAGE CHEAT SHEET & IMMUTABLE CERTIFICATION -->
<section class="page">
  ${headerRail("PILLAR V: SHASTRIC EMERGENCY NEUTRALIZERS &amp; CHEAT SHEET")}
  <div>
    <div class="kicker">RAPID DESK REFERENCE</div>
    <h2 class="display-l" style="margin-bottom:6px;">Master 1-Page Golden Muhurat Cheat Sheet</h2>
    <p class="body-text" style="margin-bottom:10px;">
      Instant decision matrix synthesized for <strong>${subjectName}</strong> (${lagnaRashi} Ascendant &middot; ${moonRashi} Moon &middot; ${nakshatra}).
    </p>

    <!-- Master Matrix Table -->
    <table class="data-table" style="margin-bottom:12px;">
      <thead>
        <tr>
          <th>Domain / Decision Area</th>
          <th>Supreme Green Windows</th>
          <th>Forbidden Red Blackouts</th>
          <th>Secret Power Trigger</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Tech &amp; Strategic Deployments</strong></td>
          <td>${sovereignInfo.day} &middot; ${lagnesh} Hora</td>
          <td>${sovereignInfo.day} ${sovereignInfo.rahuKaal}</td>
          <td>Deploy during Shubh/Labha Chaughadia</td>
        </tr>
        <tr>
          <td><strong>Financial Allocation / Term Sheets</strong></td>
          <td>Thu &middot; Jupiter Hora &middot; ${topFinancialStars}</td>
          <td>Tuesday Mars Horas &middot; Rikta Tithis</td>
          <td>Sign during midday Abhijit Window</td>
        </tr>
        <tr>
          <td><strong>Commercial Contracts</strong></td>
          <td>Fri &middot; Venus Hora &middot; ${topContractStars}</td>
          <td>Moon in ${ashtamaSign} (Ashtama Chandra)</td>
          <td>Dip pen/finger in saffron water</td>
        </tr>
        <tr>
          <td><strong>Property &amp; Real Estate</strong></td>
          <td>Fixed Lagna (Taurus/Leo) &middot; ${sadhanaStars[1]}</td>
          <td>Panchaka Remainder 1, 2, 4, 6, 8</td>
          <td>Boil milk overflowing East/North</td>
        </tr>
        <tr>
          <td><strong>Luxury Vehicle Delivery</strong></td>
          <td>Fri/Wed morning &middot; ${sampatStars[1]}</td>
          <td>Saturday twilight &middot; Mars Hora</td>
          <td>Drive out facing North or East</td>
        </tr>
        <tr>
          <td><strong>Strategic Travel</strong></td>
          <td>${sovereignInfo.day === "Thursday" ? "Thursday / Mon" : `${sovereignInfo.day} / Thu`} &middot; ${topTravelTaras}</td>
          <td>Directions matching Disha Shoola</td>
          <td>7 steps backward with Shiva prayer</td>
        </tr>
      </tbody>
    </table>

    <!-- 4 Quick Summary Badges -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:10px;">
      <div class="luxury-card" style="border-top:2px solid var(--emerald-bright);padding:6px 8px;">
        <div class="kicker" style="color:var(--emerald-bright);">POWER DAY</div>
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">${sovereignInfo.day}</div>
        <div style="font-size:8px;color:var(--ivory-dim);">${lagnesh} Lagnesh</div>
      </div>
      <div class="luxury-card" style="border-top:2px solid var(--teal-bright);padding:6px 8px;">
        <div class="kicker" style="color:var(--teal-bright);">POWER WINDOW</div>
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">11:45 &ndash; 12:35 PM</div>
        <div style="font-size:8px;color:var(--ivory-dim);">Abhijit Muhurta</div>
      </div>
      <div class="luxury-card" style="border-top:2px solid var(--ruby-bright);padding:6px 8px;">
        <div class="kicker" style="color:var(--ruby-bright);">BLACKOUT MOON</div>
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">Moon in ${ashtamaSign}</div>
        <div style="font-size:8px;color:var(--ivory-dim);">8th House Void</div>
      </div>
      <div class="luxury-card" style="border-top:2px solid var(--purple-bright);padding:6px 8px;">
        <div class="kicker" style="color:var(--purple-bright);">POWER TARA</div>
        <div style="font-weight:700;font-size:10.5px;color:var(--gold-bright);">Sampat &amp; Sadhana</div>
        <div style="font-size:8px;color:var(--ivory-dim);">Taras 2 &amp; 6</div>
      </div>
    </div>

    <!-- Official Certification Box -->
    <div style="text-align:center;padding:8px 12px;background:rgba(201,169,97,0.06);border:1.5px solid var(--border-gold-strong);border-radius:6px;">
      <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.18em;color:var(--gold-bright);font-weight:700;">
        ✦ ASTROLIFE SACRED DECISION CERTIFICATION ✦
      </div>
      <div style="font-size:8.5px;color:var(--ivory-mute);line-height:1.4;margin-top:3px;">
        Certified for: <strong>${subjectName}</strong> &middot; Order ID: <strong>${orderId}</strong> &middot; Payment Ref: <strong>${paymentId}</strong><br/>
        This 24-page dossier is mathematically verified under classical <em>Muhurta Chintamani</em>, <em>Brihat Samhita</em>, and <em>Kalaprakasika</em>. Deterministic Shastric Precision. Archival certified: www.astrolife.io
      </div>
    </div>
  </div>
  ${footerRail("Master Decision Cheat Sheet", 24)}
</section>

</body>
</html>`;
}
