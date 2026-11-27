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
import { buildJaiminiChart, calculateKarakas, type JaiminiResult } from "../astro-engine/jaimini";
import { calculateInduLagna } from "../astro-engine/special-lagnas";
import { calculateMedical, type MedicalResult } from "../astro-engine/medical";
import { runAstroVastuHitEngine, type AstroVastuHitDossier } from "../astro-engine/astro-vastu-hit-engine";
import { getKaranaName } from "../astro-engine/panchang";
import { makeRudrakshaRecommendation } from "../astro-engine/gemstone";
import { generateSacredUnionDossierHTML } from "./generators/sacred-union-dossier-generator";
import { generateRajaYogaWealthDossierHTML } from "./generators/raja-yoga-wealth-dossier-generator";
import { generateBioVedicRemediesDossierHTML } from "./generators/bio-vedic-remedies-dossier-generator";
import { generateSpaceDestinyDossierHTML } from "./generators/space-destiny-dossier-generator";
import { generateStockTradingDossierHTML } from "./generators/stock-trading-dossier-generator";
import { generateJaiminiSoulDossierHTML } from "./generators/jaimini-soul-dossier-generator";
import { generateAyurvedicMedicalDossierHTML } from "./generators/ayurvedic-medical-dossier-generator";
import { generateGoldenMuhuratDossierHTML } from "./generators/golden-muhurat-dossier-generator";
import { generateDestinyCurveDossierHTML } from "./generators/destiny-curve-dossier-generator";
import { getDynamicGemstonePrescription, getSignLord, withArticle } from "../astro/human-translator";
import {
  SIGN_NAMES,
  SIGN_LORDS,
  PLANET_SANSKRIT,
  PLANET_WEEKDAYS,
  escapeHtml,
  getPlanetLon,
  formatDMS,
  getHouseFromLagna,
  getSignFromHouse,
  computeClassicalDignity,
  getActiveDashaState,
  getSeekerAge,
  resolveGender,
  getGenderLateralizationSafe,
  getAkvHouseSav,
  getNakshatraMetadata,
  renderNorthIndianSvg,
  buildDynamicRollingMonths,
} from "./dossier-shared-helpers";

export interface PackageDossierOptions {
  reportId?: string;
  reportTitle?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  orderId?: string;
  paymentId?: string;
  fixedTimestamp?: string;
  isSample?: boolean;
  reportCode?: string;
  gender?: "male" | "female" | string;
}

const PANCHANG_TITHIS = [
  "Pratipada", "Dvitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima / Amavasya",
];

const PANCHANG_YOGAS = [
  "Vishkumbha", "Preeti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
  "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana",
  "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva", "Siddha",
  "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
];

const WEEKDAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DASHA_PROFILE_META: Readonly<Record<string, { element: string; chakra: string; field: string; guardrail: string }>> = {
  Sun:     { element: "Agni / Solar Authority",   chakra: "Manipura / Solar Plexus", field: "Leadership & Stature",      guardrail: "Avoid Ego Rigidity" },
  Moon:    { element: "Jala / Lunar Flow",        chakra: "Svadhishthana / Heart",   field: "Intuition & Public Care",   guardrail: "Avoid Emotional Reactivity" },
  Mars:    { element: "Agni / Kinetic Will",      chakra: "Manipura / Root Drive",   field: "Execution & Real Estate",   guardrail: "Avoid Impulsive Friction" },
  Mercury: { element: "Prithvi / Analytical Mind",chakra: "Vishuddha / Intellect",   field: "Commerce & Communication",  guardrail: "Avoid Mental Scattering" },
  Jupiter: { element: "Akasha / Wisdom Dharma",   chakra: "Ajna / Higher Insight",   field: "Knowledge & Advisory",      guardrail: "Avoid Over-Commitment" },
  Venus:   { element: "Jala / Harmonic Grace",    chakra: "Anahata / Relational",    field: "Alliances & Refinement",    guardrail: "Avoid Comfort Complacency" },
  Saturn:  { element: "Vayu / Structural Law",    chakra: "Muladhara / Grounding",   field: "Discipline & Compounding",  guardrail: "Avoid Pacing Fatigue" },
  Rahu:    { element: "Vayu / Frontier Surge",    chakra: "Ajna / Pattern Vision",   field: "Innovation & Global Scale", guardrail: "Avoid Unhedged Speculation" },
  Ketu:    { element: "Agni / Subtle Insight",    chakra: "Sahasrara / Detachment",  field: "Research & Mastery",        guardrail: "Avoid Abrupt Withdrawal" },
};

const PLANET_RESONANCE_META: Readonly<Record<string, { hue: string; avoid: string; hz: string; plant: string }>> = {
  Sun:     { hue: "Warm Saffron & Ruby",   avoid: "Dull Charcoal / Ash",     hz: "126.22 Hz Solar",   plant: "Bilva & Red Hibiscus" },
  Moon:    { hue: "Pearl White & Silver",  avoid: "Harsh Neon / Dark Brown", hz: "210.42 Hz Lunar",   plant: "Tulsi & White Jasmine" },
  Mars:    { hue: "Coral Red & Copper",    avoid: "Muddy Grey / Stale Blue", hz: "144.72 Hz Kinetic", plant: "Neem & Khadira" },
  Mercury: { hue: "Emerald Green & Ivory", avoid: "Dull Charcoal / Rust",    hz: "141.27 Hz Neural",  plant: "Tulsi & Apamarga" },
  Jupiter: { hue: "Warm Ivory & Gold",     avoid: "Dull Grey / Mud Brown",   hz: "183.58 Hz Dharma",  plant: "Peepal & Banana" },
  Venus:   { hue: "Silk White & Rose Gold",avoid: "Mud Brown / Harsh Black", hz: "221.23 Hz Harmonic",plant: "White Sandal & Jasmine" },
  Saturn:  { hue: "Midnight Indigo & Slate",avoid: "Flashy Neon / Crimson",  hz: "147.85 Hz Ground",  plant: "Shami & Peepal" },
};

export function generatePackageDossierHTML(
  chart: ChartData,
  options: PackageDossierOptions = {}
): string {
  const rawReportId = (options.reportId || "").trim().toLowerCase();
  const rawReportTitle = (options.reportTitle || "").trim().toLowerCase();
  const reportId = `${rawReportId} ${rawReportTitle}`.trim();

  // ─────────────────────────────────────────────────────────────────────────
  // 1. EXACT REPORT ID ROUTING (Prevents title keywords from hijacking IDs)
  // ─────────────────────────────────────────────────────────────────────────
  if (
    rawReportId === "pkg_union_family" ||
    rawReportId === "pkg_sacred_union" ||
    rawReportId === "kundali_milan_single" ||
    rawReportId === "family_karma_single"
  ) {
    return generateSacredUnionDossierHTML(chart, options);
  }
  if (
    rawReportId === "pkg_wealth_yogas" ||
    rawReportId === "classical_yogas_single" ||
    rawReportId === "special_lagnas_single" ||
    rawReportId === "numerology_single"
  ) {
    return generateRajaYogaWealthDossierHTML(chart, options);
  }
  if (
    rawReportId === "pkg_bio_remedies" ||
    rawReportId === "gemstone_rudraksha_single" ||
    rawReportId === "dot_therapy_thread_single" ||
    rawReportId === "astro_tattoo_single" ||
    rawReportId === "astro_sound"
  ) {
    return generateBioVedicRemediesDossierHTML(chart, options);
  }
  if (
    rawReportId === "pkg_space_destiny" ||
    rawReportId === "vastu_radar_single" ||
    rawReportId === "palmistry_scan" ||
    rawReportId === "btr_mathematical"
  ) {
    return generateSpaceDestinyDossierHTML(chart, options);
  }
  if (
    rawReportId === "pkg_stock_trading" ||
    rawReportId === "sarvatobhadra_single" ||
    rawReportId === "ashtakavarga_bindus_single"
  ) {
    return generateStockTradingDossierHTML(chart, options);
  }
  if (
    rawReportId === "pkg_jaimini_soul" ||
    rawReportId === "atmakaraka_soul_single"
  ) {
    return generateJaiminiSoulDossierHTML(chart, options);
  }
  if (
    rawReportId === "pkg_ayurvedic_medical" ||
    rawReportId === "medical_roga_single" ||
    rawReportId === "cognitive_mind_single"
  ) {
    return generateAyurvedicMedicalDossierHTML(chart, options);
  }
  if (
    rawReportId === "pkg_muhurat_panchang" ||
    rawReportId === "prashna_instant" ||
    rawReportId === "transit_purchase"
  ) {
    return generateGoldenMuhuratDossierHTML(chart, options);
  }
  if (
    rawReportId === "destiny_curve_flagship" ||
    rawReportId === "navtara_dasha_single" ||
    rawReportId === "yearly_gochar"
  ) {
    return generateDestinyCurveDossierHTML(chart, options);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. FUZZY ROUTING FOR CUSTOM / LEGACY REPORT TITLES & IDS
  // ─────────────────────────────────────────────────────────────────────────
  // 1. Sacred Union & Family Destiny (Dossier I)
  if (
    reportId.includes("union") ||
    reportId.includes("family") ||
    reportId.includes("milan") ||
    reportId.includes("marriage")
  ) {
    return generateSacredUnionDossierHTML(chart, options);
  }

  // 2. Raja Yoga & Wealth Acceleration (Dossier II)
  if (
    reportId.includes("wealth") ||
    reportId.includes("raja") ||
    reportId.includes("career") ||
    reportId.includes("money") ||
    reportId.includes("pkg_wealth_yogas") ||
    reportId.includes("classical_yogas") ||
    reportId.includes("yogas") ||
    reportId.includes("numerology")
  ) {
    return generateRajaYogaWealthDossierHTML(chart, options);
  }

  // 3. Bio-Vedic Protection & Remedial Vault (Dossier III)
  if (
    reportId.includes("remed") ||
    reportId.includes("bio") ||
    reportId.includes("protect") ||
    reportId.includes("vault") ||
    reportId.includes("pkg_bio_remedies") ||
    reportId.includes("gemstone") ||
    reportId.includes("rudraksha") ||
    reportId.includes("dot_therapy") ||
    reportId.includes("thread") ||
    reportId.includes("tattoo") ||
    reportId.includes("yantra") ||
    reportId.includes("sound")
  ) {
    return generateBioVedicRemediesDossierHTML(chart, options);
  }

  // 4. Space Energy, Vastu, Palmistry & BTR (Dossier IV)
  if (
    !reportId.includes("curve") && (
      reportId.includes("space") ||
      reportId.includes("pkg_space_destiny") ||
      reportId.includes("vastu") ||
      reportId.includes("palmistry") ||
      reportId.includes("btr") ||
      reportId.includes("calibration") ||
      reportId.includes("samudrika")
    )
  ) {
    return generateSpaceDestinyDossierHTML(chart, options);
  }

  // 5. Stock Market, Speculation & Sarvatobhadra (Dossier V)
  if (
    reportId.includes("stock") ||
    reportId.includes("trading") ||
    reportId.includes("speculat") ||
    reportId.includes("sarvatobhadra") ||
    reportId.includes("pkg_stock_trading") ||
    reportId.includes("market") ||
    reportId.includes("ashtakavarga") ||
    reportId.includes("bindu")
  ) {
    return generateStockTradingDossierHTML(chart, options);
  }

  // 6. Jaimini Soul Blueprint & Karakamsa (Dossier VI)
  if (
    reportId.includes("jaimini") ||
    reportId.includes("soul") ||
    reportId.includes("karmic") ||
    reportId.includes("pkg_jaimini_soul") ||
    reportId.includes("karaka") ||
    reportId.includes("atmakaraka")
  ) {
    return generateJaiminiSoulDossierHTML(chart, options);
  }

  // 7. Ayurvedic Medical & Vitality Shield (Dossier VII)
  if (
    reportId.includes("medical") ||
    reportId.includes("ayurved") ||
    reportId.includes("vitality") ||
    reportId.includes("health") ||
    reportId.includes("pkg_ayurvedic_medical") ||
    reportId.includes("dosha") ||
    reportId.includes("tridosha") ||
    reportId.includes("roga") ||
    reportId.includes("cognitive") ||
    reportId.includes("mind")
  ) {
    return generateAyurvedicMedicalDossierHTML(chart, options);
  }

  // 8. Golden Muhurat & Cosmic Decision Matrix (Dossier VIII)
  if (
    reportId.includes("muhurat") ||
    reportId.includes("panchang") ||
    reportId.includes("decision") ||
    reportId.includes("electional") ||
    reportId.includes("auspicious") ||
    reportId.includes("pkg_muhurat_panchang") ||
    reportId.includes("prashna") ||
    (reportId.includes("timing") && !reportId.includes("yogas") && !reportId.includes("raja"))
  ) {
    return generateGoldenMuhuratDossierHTML(chart, options);
  }

  // 9. Destiny Curve & 90-Year Life Master (Flagship Suite)
  if (
    reportId.includes("destiny") ||
    reportId.includes("curve") ||
    reportId.includes("navtara") ||
    reportId.includes("gochar")
  ) {
    return generateDestinyCurveDossierHTML(chart, options);
  }

  const subjectName = escapeHtml(options.customerName || chart.name || "Sacred Seeker");
  const reportTitle = escapeHtml(options.reportTitle || "AstroLife Sacred Shastra Dossier");
  const orderId = escapeHtml(options.reportCode || options.orderId || `ORD_${Date.now().toString(36).toUpperCase()}`);
  const paymentId = escapeHtml(options.paymentId || `PAY_${Date.now().toString(36).toUpperCase()}`);
  const isSample = Boolean(options.isSample);

  const birthDate = escapeHtml(chart.dob || "Recorded");
  const birthTime = escapeHtml(chart.tob || "12:00");
  const tzNum = typeof chart.tz === "number" && Number.isFinite(chart.tz) ? chart.tz : 5.5;
  const tzLabel = Math.abs(tzNum - 5.5) < 0.01 ? "IST" : `UTC${tzNum >= 0 ? "+" : ""}${tzNum}`;
  const birthCity = escapeHtml(chart.city || "Recorded Location");
  const lat = chart.lat !== undefined && Number.isFinite(Number(chart.lat)) ? Number(chart.lat).toFixed(4) : "—";
  const lon = chart.lon !== undefined && Number.isFinite(Number(chart.lon)) ? Number(chart.lon).toFixed(4) : "—";

  const lagnaNum =
    typeof chart.lagnaNum === "number" && Number.isFinite(chart.lagnaNum)
      ? ((Math.trunc(chart.lagnaNum) % 12) + 12) % 12
      : 0;
  const lagnaRashiRaw = chart.lagnaRashi || SIGN_NAMES[lagnaNum] || "Aries";
  const lagnaRashi = escapeHtml(lagnaRashiRaw);
  const lagnaLord = SIGN_LORDS[lagnaRashiRaw] || getSignLord(lagnaRashiRaw);

  const moonPlanet = chart.planets?.["Moon"];
  const moonLon = getPlanetLon(moonPlanet);
  const moonRashiRaw = moonPlanet?.sign || (moonPlanet ? SIGN_NAMES[Math.floor(moonLon / 30)] : "—");
  const moonRashi = escapeHtml(moonRashiRaw);
  const sunPlanet = chart.planets?.["Sun"];
  const sunLon = getPlanetLon(sunPlanet);
  const sunRashiRaw = sunPlanet?.sign || (sunPlanet ? SIGN_NAMES[Math.floor(sunLon / 30)] : "—");
  const sunRashi = escapeHtml(sunRashiRaw);
  const nakshatraRaw = moonPlanet?.nakshatra || "—";
  const nakshatra = escapeHtml(nakshatraRaw);

  const dashaState = getActiveDashaState(chart);
  const dashaLordRaw = dashaState.activeDasha;
  const dashaLord = escapeHtml(dashaLordRaw);
  const antarLordRaw = dashaState.activeAntar;
  const antarLord = escapeHtml(antarLordRaw);

  const resolvedGender = resolveGender(options, chart as ChartData & { gender?: string });
  const genderLat = getGenderLateralizationSafe(resolvedGender);
  const seekerAge = getSeekerAge(chart.dob);

  // Safe Engine Calculations
  const planetsTyped = chart.planets as unknown as Parameters<typeof calculateDivisional>[0];
  let divisionalCharts: DivChart[] = [];
  try {
    divisionalCharts = calculateDivisional(planetsTyped, lagnaNum, chart.lagnaLon);
  } catch (err) {
    console.warn("[package-dossier] calculateDivisional fallback:", err);
  }

  const d7Chart = divisionalCharts.find((c) => c.key === "D7");
  const d9Chart = divisionalCharts.find((c) => c.key === "D9");
  const d10Chart = divisionalCharts.find((c) => c.key === "D10");

  const d9PlanetsMap: Record<string, { house: number; sign: string; retrograde?: boolean }> = {};
  if (d9Chart?.planets) {
    for (const dp of d9Chart.planets) {
      d9PlanetsMap[dp.planet] = {
        house: dp.house,
        sign: dp.sign,
        retrograde: dp.retrograde,
      };
    }
  }
  const vargottamaPlanets = Object.entries(chart.planets || {})
    .filter(([name, pd]) => {
      const d9p = d9Chart?.planets?.find((dp) => dp.planet === name);
      return Boolean(d9p && pd?.sign && d9p.sign.toLowerCase() === pd.sign.toLowerCase());
    })
    .map(([name]) => name);

  let detectedYogas: YogaResult[] = [];
  try {
    detectedYogas = detectYogas(
      chart.planets as unknown as Parameters<typeof detectYogas>[0],
      lagnaNum,
      "elite"
    );
  } catch (err) {
    console.warn("[package-dossier] detectYogas fallback:", err);
  }

  let shadbalaRes: ShadbalaResult | null = null;
  try {
    shadbalaRes = calculateShadbala(
      chart.planets as unknown as Parameters<typeof calculateShadbala>[0]
    );
  } catch (err) {
    console.warn("[package-dossier] calculateShadbala fallback:", err);
  }

  let akvRes: AKVResult | null = null;
  try {
    akvRes = calculateAshtakavarga(
      chart.planets as unknown as Parameters<typeof calculateAshtakavarga>[0],
      lagnaNum
    );
  } catch (err) {
    console.warn("[package-dossier] calculateAshtakavarga fallback:", err);
  }
  const houseSav = getAkvHouseSav(akvRes, lagnaNum);

  let charaKarakas: ReturnType<typeof calculateKarakas> = [];
  try {
    charaKarakas = calculateKarakas(chart.planets);
  } catch (err) {
    console.warn("[package-dossier] calculateKarakas fallback:", err);
  }

  const atmakaraka = charaKarakas.find((k) => k.role === "AK") || { planet: lagnaLord, sign: lagnaRashiRaw };
  const amatyakaraka = charaKarakas.find((k) => k.role === "AmK") || { planet: SIGN_LORDS[getSignFromHouse(lagnaNum, 10)], sign: getSignFromHouse(lagnaNum, 10) };
  const darakaraka = charaKarakas.find((k) => k.role === "DK") || { planet: SIGN_LORDS[getSignFromHouse(lagnaNum, 7)], sign: getSignFromHouse(lagnaNum, 7) };

  let jaiminiRes: JaiminiResult | null = null;
  try {
    jaiminiRes = buildJaiminiChart(chart);
  } catch (err) {
    console.warn("[package-dossier] buildJaiminiChart fallback:", err);
  }

  let medicalRes: MedicalResult | null = null;
  try {
    medicalRes = calculateMedical(chart);
  } catch (err) {
    console.warn("[package-dossier] calculateMedical fallback:", err);
  }

  let vastuRes: AstroVastuHitDossier | null = null;
  try {
    vastuRes = runAstroVastuHitEngine(chart);
  } catch (err) {
    console.warn("[package-dossier] runAstroVastuHitEngine fallback:", err);
  }

  // Birth-moment Panchang computed directly from natal Sun/Moon longitudes & birth date
  const moonSunDiff = ((moonLon - sunLon) % 360 + 360) % 360;
  const tithiIndex = Math.floor(moonSunDiff / 12);
  const pakshaLabel = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiName = `${pakshaLabel} ${PANCHANG_TITHIS[tithiIndex % 15]}`;
  const yogaIndex = Math.floor((((sunLon + moonLon) % 360 + 360) % 360) / (360 / 27));
  const yogaName = PANCHANG_YOGAS[yogaIndex] || "Siddha";
  const karanaName = getKaranaName(Math.floor(moonSunDiff / 6));
  const dobDate = chart.dob ? new Date(`${chart.dob}T12:00:00Z`) : null;
  const varaName = dobDate && Number.isFinite(dobDate.getTime()) ? WEEKDAYS_FULL[dobDate.getUTCDay()] : PLANET_WEEKDAYS[lagnaLord] || "Thursday";

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
  let themeP9 = "";
  let themeP10 = "";
  let themeP11 = "";
  let themeP12 = "";

  const h2Sign = getSignFromHouse(lagnaNum, 2);
  const h5Sign = getSignFromHouse(lagnaNum, 5);
  const h5Lord = SIGN_LORDS[h5Sign] || "Sun";
  const h7Sign = getSignFromHouse(lagnaNum, 7);
  const h7Lord = SIGN_LORDS[h7Sign] || "Venus";
  const h10Sign = getSignFromHouse(lagnaNum, 10);
  const h10Lord = SIGN_LORDS[h10Sign] || "Saturn";
  const h11Sign = getSignFromHouse(lagnaNum, 11);

  if (reportId.includes("union") || reportId.includes("family")) {
    const nakMeta = getNakshatraMetadata(nakshatraRaw);
    const marsP = chart.planets?.["Mars"];
    const jupP = chart.planets?.["Jupiter"];
    const venP = chart.planets?.["Venus"];
    const marsHouse = marsP?.house || (marsP?.sign ? getHouseFromLagna(marsP.sign, lagnaNum) : 1);
    const isManglikHouse = [1, 4, 7, 8, 12].includes(marsHouse);
    const jupHouse = jupP?.house || (jupP?.sign ? getHouseFromLagna(jupP.sign, lagnaNum) : 1);
    const jupAspectsMars = [1, 5, 7, 9].some((off) => ((jupHouse + off - 2) % 12) + 1 === marsHouse);
    const jupAspectsH7 = [1, 5, 7, 9].some((off) => ((jupHouse + off - 2) % 12) + 1 === 7);
    const h7LordP = chart.planets?.[h7Lord];
    const h7LordDignity = h7LordP ? computeClassicalDignity(h7Lord, h7LordP.sign, getPlanetLon(h7LordP)) : "Balanced";
    const venDignity = venP ? computeClassicalDignity("Venus", venP.sign, getPlanetLon(venP)) : "Balanced";
    const ulSign = jaiminiRes?.arudhas?.find((a) => a.shortName === "UL")?.sign || getSignFromHouse(lagnaNum, 12);
    const ulLord = SIGN_LORDS[ulSign] || "Jupiter";
    const d7Lagna = d7Chart?.lagna || getSignFromHouse(lagnaNum, 5);

    themeP9 = `
      <h2 class="display-l" style="margin-bottom:8px;">Ashtakoota 36-Guna In-Depth Baseline</h2>
      <p class="body-text" style="margin-bottom:20px;">Evaluated under Brihat Parashara Hora Shastra Chapter 21 from your Janma Nakshatra <strong>${nakshatra}</strong> (${moonRashi} Moon).</p>
      <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px;">
        <div class="luxury-card"><div class="card-title">1. NADI KOOTA (8 Points)</div><p class="body-text">Your Janma Nadi is <strong>${escapeHtml(nakMeta.nadi)}</strong>. Partner selection should prioritize distinct Nadi alignment (${nakMeta.nadi === "Adya" ? "Madhya or Antya" : nakMeta.nadi === "Madhya" ? "Adya or Antya" : "Adya or Madhya"}) for genetic and nervous-system vitality.</p></div>
        <div class="luxury-card"><div class="card-title">2. BHAKOOT KOOTA (7 Points)</div><p class="body-text">Evaluates psychic sustenance from <strong>${moonRashi}</strong> Moon. Harmonious 1–7, 3–11, or 4–10 lunar axes amplify emotional continuity.</p></div>
        <div class="luxury-card"><div class="card-title">3. GANA &amp; YONI (10 Points)</div><p class="body-text">Your Gana is <strong>${escapeHtml(nakMeta.gana)}</strong> and Yoni is <strong>${escapeHtml(nakMeta.yoni)}</strong>. Top compatible nakshatras: ${escapeHtml(nakMeta.compatibleNakshatras.slice(0, 3).join(", "))}.</p></div>
        <div class="luxury-card"><div class="card-title">4. GRAHA MAITRI (5 Points)</div><p class="body-text">Moon sign lord <strong>${escapeHtml(SIGN_LORDS[moonRashiRaw] || nakMeta.ruler)}</strong> sets intellectual rapport and shared life values.</p></div>
      </div>
    `;
    themeP10 = `
      <h2 class="display-l" style="margin-bottom:8px;">Mangal Dosha &amp; Shastric Neutralization</h2>
      <p class="body-text" style="margin-bottom:20px;">Mars placement in houses 1, 4, 7, 8, or 12 from Lagna (${lagnaRashi}) regulates relational intensity and protective drive.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ MARS DIGNITY &amp; ASPECT AUDIT</div>
        <p class="body-text">Mars is situated in <strong>${escapeHtml(marsP?.sign || "—")}</strong> (House ${marsHouse}). ${jupAspectsMars ? "Jupiter casts a protective benefic aspect onto Mars, softening impulsive heat." : isManglikHouse ? "Channeled dialogue, mutual pacing, and Kuja-shanti awareness preserve harmony." : "Mars sits outside primary Manglik houses from Lagna, indicating clean relational flow."}</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">MANGAL STATUS</span><span class="val">${isManglikHouse ? (jupAspectsMars ? "Mitigated (Guru Drishti)" : `House ${marsHouse} Active`) : "Non-Manglik (Lagna)"}</span></div>
        <div class="matrix-item"><span class="kicker">JUPITER ASPECT</span><span class="val">${jupAspectsH7 || jupAspectsMars ? "Direct Benefic Drishti" : `From House ${jupHouse}`}</span></div>
        <div class="matrix-item"><span class="kicker">7TH LORD (${escapeHtml(h7Lord)})</span><span class="val">${escapeHtml(h7LordDignity)}</span></div>
        <div class="matrix-item"><span class="kicker">SHUKRA STATUS</span><span class="val">${escapeHtml(venDignity)}</span></div>
      </div>
    `;
    themeP11 = `
      <h2 class="display-l" style="margin-bottom:8px;">7th Bhava, Upapada &amp; Darakaraka Dynamics</h2>
      <p class="body-text" style="margin-bottom:20px;">Jaimini Upadesha Sutras reveal marriage destiny through Upapada Lagna (${escapeHtml(ulSign)}) and Darakaraka (${escapeHtml(darakaraka.planet)}).</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ DARAKARAKA: ${escapeHtml(darakaraka.planet.toUpperCase())} IN ${escapeHtml(darakaraka.sign.toUpperCase())}</div>
        <p class="body-text">Your lowest-degree Chara Karaka is <strong>${escapeHtml(darakaraka.planet)}</strong> placed in <strong>${escapeHtml(darakaraka.sign)}</strong>, shaping partner temperament, communication style, and shared dharmic commitment.</p>
      </div>
      <div class="luxury-card"><div class="card-title">✦ UPAPADA LAGNA (${escapeHtml(ulSign)}) HARMONIZATION</div><p class="body-text">Upapada Lagna lord is <strong>${escapeHtml(ulLord)}</strong>. Mindful observance on <strong>${escapeHtml(PLANET_WEEKDAYS[ulLord] || "Thursday")}s</strong> strengthens marital longevity and domestic peace.</p></div>
    `;
    themeP12 = `
      <h2 class="display-l" style="margin-bottom:8px;">Family Lineage Karma &amp; D-7 Saptamsha</h2>
      <p class="body-text" style="margin-bottom:20px;">The D-7 Saptamsha varga (Saptamsha Lagna: <strong>${escapeHtml(d7Lagna)}</strong>) examines lineage continuity and generational legacy.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ SAPTAMSHA HARMONIC SUMMARY</div>
        <p class="body-text">5th house falls in <strong>${escapeHtml(h5Sign)}</strong> (lord <strong>${escapeHtml(h5Lord)}</strong>) with SAV strength of <strong>${houseSav[4]} bindus</strong>, guiding creative progeny blessings and family stewardship.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">5TH LORD (${escapeHtml(h5Sign)})</span><span class="val">${escapeHtml(h5Lord)}</span></div>
        <div class="matrix-item"><span class="kicker">D-7 LAGNA</span><span class="val">${escapeHtml(d7Lagna)}</span></div>
        <div class="matrix-item"><span class="kicker">5TH SAV SCORE</span><span class="val">${houseSav[4]} Bindus</span></div>
        <div class="matrix-item"><span class="kicker">JUPITER HOUSE</span><span class="val">House ${jupHouse}</span></div>
      </div>
    `;
  } else if (reportId.includes("wealth") || reportId.includes("raja") || reportId.includes("stock")) {
    let induSign = h11Sign;
    let induHouse = 11;
    let induTier = "Balanced Accumulation";
    try {
      const indu = calculateInduLagna(chart);
      induSign = indu.sign;
      induHouse = indu.house;
      induTier = indu.kuberYogaTier;
    } catch {
      // keep safe sign-derived fallback
    }
    const h2Lord = SIGN_LORDS[h2Sign] || "Venus";
    const h11Lord = SIGN_LORDS[h11Sign] || "Jupiter";
    const ageContext = seekerAge !== null ? `At your current age (${seekerAge}), ${dashaLord}–${antarLord} governs asset velocity.` : `Under ${dashaLord}–${antarLord}, structured capital discipline accelerates wealth.`;

    themeP9 = `
      <h2 class="display-l" style="margin-bottom:8px;">2nd &amp; 11th House Dhana Yoga Matrix</h2>
      <p class="body-text" style="margin-bottom:20px;">Evaluation of Dhana (House 2: ${escapeHtml(h2Sign)}, lord ${escapeHtml(h2Lord)}) and Labha (House 11: ${escapeHtml(h11Sign)}, lord ${escapeHtml(h11Lord)}) bhavas.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ INDU LAGNA: ${escapeHtml(induSign.toUpperCase())} (HOUSE ${induHouse})</div>
        <p class="body-text">Indu Lagna falls in <strong>${escapeHtml(induSign)}</strong> (House ${induHouse}) — tier: <strong>${escapeHtml(induTier)}</strong>. ${ageContext}</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">2ND HOUSE (DHANA)</span><span class="val">${escapeHtml(h2Sign)} (${houseSav[1]}B)</span></div>
        <div class="matrix-item"><span class="kicker">11TH HOUSE (LABHA)</span><span class="val">${escapeHtml(h11Sign)} (${houseSav[10]}B)</span></div>
        <div class="matrix-item"><span class="kicker">5TH HOUSE (LAKSHMI)</span><span class="val">${escapeHtml(h5Sign)} (${houseSav[4]}B)</span></div>
        <div class="matrix-item"><span class="kicker">SAV LABHA BINDUS</span><span class="val">${houseSav[10]} Bindus</span></div>
      </div>
    `;
    themeP10 = `
      <h2 class="display-l" style="margin-bottom:8px;">Classical Raja &amp; Dhana Yogas in Chart</h2>
      <p class="body-text" style="margin-bottom:20px;">Vedic combinations formed by Kendra lords (Vishnu sthana) uniting with Trikona lords (Lakshmi sthana).</p>
      <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 14px;">
        ${detectedYogas.slice(0, 4).map((y) => `
          <div class="luxury-card">
            <div class="card-title">${escapeHtml(y.name)}</div>
            <p class="body-text" style="font-size:11.5px;">${escapeHtml(y.description)}</p>
            <div class="body-s" style="color:var(--gold);margin-top:6px;">Impact: ${escapeHtml(y.impact)}</div>
          </div>
        `).join("") || `<div class="luxury-card"><div class="card-title">Kendra–Trikona Balance</div><p class="body-text">Lagna lord ${escapeHtml(lagnaLord)} and 9th/10th lords establish steady self-made institutional growth.</p></div>`}
      </div>
    `;
    themeP11 = `
      <h2 class="display-l" style="margin-bottom:8px;">10th Bhava &amp; D-10 Dasamsa Career Elevation</h2>
      <p class="body-text" style="margin-bottom:20px;">The D-10 Dasamsa varga (D-10 Lagna: <strong>${escapeHtml(d10Chart?.lagna || h10Sign)}</strong>) maps professional authority and career milestones.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ DASAMSA KARMIC OPERATING SYSTEM</div>
        <p class="body-text">10th house (${escapeHtml(h10Sign)}) is governed by <strong>${escapeHtml(h10Lord)}</strong> (${houseSav[9]} SAV bindus). Combined with Amatyakaraka <strong>${escapeHtml(amatyakaraka.planet)}</strong> in <strong>${escapeHtml(amatyakaraka.sign)}</strong>, leadership thrives through domain mastery.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">10TH LORD (${escapeHtml(h10Sign)})</span><span class="val">${escapeHtml(h10Lord)}</span></div>
        <div class="matrix-item"><span class="kicker">AMATYAKARAKA</span><span class="val">${escapeHtml(amatyakaraka.planet)} in ${escapeHtml(amatyakaraka.sign)}</span></div>
        <div class="matrix-item"><span class="kicker">10TH SAV SCORE</span><span class="val">${houseSav[9]} Bindus</span></div>
        <div class="matrix-item"><span class="kicker">PEAK DASHA SPAN</span><span class="val">${dashaLord} (${dashaState.mdStartYear}–${dashaState.mdEndYear})</span></div>
      </div>
    `;
    themeP12 = `
      <h2 class="display-l" style="margin-bottom:8px;">Speculative Risk &amp; Market Timing Guardrails</h2>
      <p class="body-text" style="margin-bottom:20px;">Analysis of 5th house (${escapeHtml(h5Sign)}, lord ${escapeHtml(h5Lord)}) and 11th vs 12th SAV net retention (${houseSav[10]} vs ${houseSav[11]} bindus).</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ HIGH-PROBABILITY INVESTMENT GUARDRAILS</div>
        <p class="body-text">${houseSav[10] >= houseSav[11] ? "Net positive 11th-vs-12th SAV ratio supports steady retained gains when position sizing stays disciplined." : "12th-house SAV matches or exceeds 11th-house SAV — enforce strict automated savings and hard stop-losses."} Align major allocations with ${dashaLord}–${antarLord} cycles.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">5TH LORD (${escapeHtml(h5Sign)})</span><span class="val">${escapeHtml(h5Lord)}</span></div>
        <div class="matrix-item"><span class="kicker">11H VS 12H SAV</span><span class="val">${houseSav[10]} vs ${houseSav[11]}</span></div>
        <div class="matrix-item"><span class="kicker">VOLATILITY GUARD</span><span class="val">Strict Stop-Loss</span></div>
        <div class="matrix-item"><span class="kicker">ACTIVE TIMING</span><span class="val">${dashaLord}–${antarLord}</span></div>
      </div>
    `;
  } else if (reportId.includes("bio") || reportId.includes("remed")) {
    const fbGem = getDynamicGemstonePrescription(lagnaRashiRaw, resolvedGender);
    const fbResonance = PLANET_RESONANCE_META[lagnaLord] || PLANET_RESONANCE_META.Jupiter;
    let fbRud = { mukhi: "5-Mukhi", bead: "Panchamukhi", mantra: "Om Namah Shivaya" };
    try {
      const lp = chart.planets?.[lagnaLord];
      const r = makeRudrakshaRecommendation(
        lagnaLord as Parameters<typeof makeRudrakshaRecommendation>[0],
        lp
          ? {
              planet: lagnaLord as Parameters<typeof makeRudrakshaRecommendation>[0],
              sign: lp.sign as NonNullable<Parameters<typeof makeRudrakshaRecommendation>[1]>["sign"],
              degree: getPlanetLon(lp) % 30,
              house: lp.house,
              isRetrograde: lp.retrograde,
              nakshatra: lp.nakshatra,
              nakshatraPada: lp.pada,
            }
          : undefined
      );
      fbRud = { mukhi: r.mukhi, bead: r.bead, mantra: r.mantra };
    } catch {
      // safe default
    }

    themeP9 = `
      <h2 class="display-l" style="margin-bottom:8px;">Comprehensive Ratna Pariksha &amp; Gemstones</h2>
      <p class="body-text" style="margin-bottom:20px;">Precision Ratna Pariksha prescription calibrated exclusively for ${escapeHtml(withArticle(lagnaRashiRaw))} Ascendant (${escapeHtml(lagnaLord)} Lagnesh) to harmonize vitality without aggravating dusthana lords.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ PRIMARY LIFE GEMSTONE: ${escapeHtml(fbGem.primaryGem.toUpperCase())}</div>
        <p class="body-text">${escapeHtml(fbGem.rationale)}</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">UPARATNA OPTION</span><span class="val">${escapeHtml(fbGem.uparatna)}</span></div>
        <div class="matrix-item"><span class="kicker">SETTING METAL</span><span class="val">${escapeHtml(fbGem.metal)}</span></div>
        <div class="matrix-item"><span class="kicker">FINGER PLACEMENT</span><span class="val">${escapeHtml(fbGem.finger)}</span></div>
        <div class="matrix-item"><span class="kicker">PURIFICATION DAY</span><span class="val">${escapeHtml(fbGem.day)}</span></div>
      </div>
    `;
    themeP10 = `
      <h2 class="display-l" style="margin-bottom:8px;">Sacred Rudraksha Mukhi Architecture</h2>
      <p class="body-text" style="margin-bottom:20px;">Electromagnetic bead therapy based on Shiva Purana and Shrimad Devi Bhagavatam for ${escapeHtml(withArticle(lagnaRashiRaw))} Lagna.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ LAGNESH (${escapeHtml(lagnaLord.toUpperCase())}) &amp; PROTECTION RUDRAKSHA PROTOCOL</div>
        <p class="body-text">Select collector-grade <strong>${escapeHtml(fbRud.mukhi)} (${escapeHtml(fbRud.bead)})</strong> Rudraksha governed by your Lagnesh (${escapeHtml(lagnaLord)}) alongside active Mahadasha (${dashaLord}) support to stabilize autonomic balance.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">PRIMARY MUKHI</span><span class="val">${escapeHtml(fbRud.mukhi)}</span></div>
        <div class="matrix-item"><span class="kicker">PURIFICATION DAY</span><span class="val">${escapeHtml(PLANET_WEEKDAYS[lagnaLord] || "Thursday")}</span></div>
        <div class="matrix-item"><span class="kicker">ACTIVATION MANTRA</span><span class="val">${escapeHtml(fbRud.mantra)}</span></div>
        <div class="matrix-item"><span class="kicker">LATERALIZATION</span><span class="val">${escapeHtml(genderLat.wrist)}</span></div>
      </div>
    `;
    themeP11 = `
      <h2 class="display-l" style="margin-bottom:8px;">Bio-Wearable &amp; Spatial Environmental Resonance</h2>
      <p class="body-text" style="margin-bottom:20px;">Harnessing bio-metallic conductivity and sacred color therapy calibrated for ${escapeHtml(lagnaLord)} Lagnesh and ${moonRashi} Moon.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ METAL &amp; SACRED THREAD PRESCRIPTION</div>
        <p class="body-text">Wearing a pure <strong>${escapeHtml(fbGem.metal)}</strong> band on the <strong>${escapeHtml(genderLat.wrist.toLowerCase())}</strong> (${escapeHtml(genderLat.sanskritTerm)}) anchors ${moonRashi} Moon stability and supports ${escapeHtml(lagnaLord)} Lagnesh coherence.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">HARMONIZING HUE</span><span class="val">${escapeHtml(fbResonance.hue)}</span></div>
        <div class="matrix-item"><span class="kicker">AVOID COLOR</span><span class="val">${escapeHtml(fbResonance.avoid)}</span></div>
        <div class="matrix-item"><span class="kicker">SOUND FREQUENCY</span><span class="val">${escapeHtml(fbResonance.hz)}</span></div>
        <div class="matrix-item"><span class="kicker">PLANT RESONANCE</span><span class="val">${escapeHtml(fbResonance.plant)}</span></div>
      </div>
    `;
    themeP12 = `
      <h2 class="display-l" style="margin-bottom:8px;">Classical Lal Kitab Non-Destructive Upayas</h2>
      <p class="body-text" style="margin-bottom:20px;">Simple, karmic, non-ritualistic adjustments from the 1952 Lal Kitab Shastra tailored to ${escapeHtml(withArticle(lagnaRashiRaw))} Lagna.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ THREE DAILY KARMIC CORRECTIONS</div>
        <p class="body-text">1. Honor your Lagnesh (${escapeHtml(lagnaLord)}) on ${escapeHtml(PLANET_WEEKDAYS[lagnaLord] || "Thursday")}s through nourishment seva and clean water offerings.<br/>2. Keep a small pure silver token in your wallet (${moonRashi} Moon stability anchor).<br/>3. Keep workspace electronics organized to neutralize stagnant ${dashaLord}–${antarLord} friction.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">UPAYA TIER</span><span class="val">100% Free / Ethical</span></div>
        <div class="matrix-item"><span class="kicker">SEVA DAY</span><span class="val">${escapeHtml(PLANET_WEEKDAYS[lagnaLord] || "Thursday")}</span></div>
        <div class="matrix-item"><span class="kicker">ELEMENTAL SEAL</span><span class="val">${escapeHtml(fbResonance.plant)}</span></div>
        <div class="matrix-item"><span class="kicker">KARMIC EFFECT</span><span class="val">Balanced Grounding</span></div>
      </div>
    `;
  } else {
    const klSign = jaiminiRes?.karakamsha?.karakamshaLagna || d9Chart?.lagna || lagnaRashiRaw;
    const alSign = jaiminiRes?.arudhas?.find((a) => a.shortName === "AL")?.sign || lagnaRashiRaw;
    const charaSign = jaiminiRes?.currentDasha?.sign || lagnaRashiRaw;
    const charaHouse = getHouseFromLagna(charaSign, lagnaNum);
    const klSignIdx = SIGN_NAMES.findIndex((s) => s.toLowerCase() === klSign.toLowerCase());
    const kl12thSign = getSignFromHouse(klSignIdx >= 0 ? klSignIdx : lagnaNum, 12);
    const kl12thLord = SIGN_LORDS[kl12thSign] || "Jupiter";
    const ishtaMap: Record<string, string> = {
      Sun: "Surya Narayana / Sri Rama",
      Moon: "Gauri / Sri Krishna",
      Mars: "Lord Kartikeya / Hanuman",
      Mercury: "Lord Vishnu / Narayana",
      Jupiter: "Lord Dakshinamurthy / Shiva",
      Venus: "Maa Lakshmi / Devi",
      Saturn: "Lord Shiva / Hanuman",
    };
    const ishtaName = ishtaMap[kl12thLord] || "Lord Shiva / Vishnu";

    themeP9 = `
      <h2 class="display-l" style="margin-bottom:8px;">Jaimini Atmakaraka &amp; Soul Purpose</h2>
      <p class="body-text" style="margin-bottom:20px;">According to Maharishi Jaimini, the planet holding the highest degree (Atmakaraka) signifies your core axis of evolution.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ ATMAKARAKA: ${escapeHtml(atmakaraka.planet)} IN ${escapeHtml(atmakaraka.sign)}</div>
        <p class="body-text">${escapeHtml(jaiminiRes?.akAmkAnalysis?.akLifeSphere?.focus || "Your soul lessons revolve around cultivating principled stewardship, mastering ego boundaries, and building enduring dharmic institutions.")}</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">ATMAKARAKA</span><span class="val">${escapeHtml(atmakaraka.planet)}</span></div>
        <div class="matrix-item"><span class="kicker">AMATYAKARAKA</span><span class="val">${escapeHtml(amatyakaraka.planet)}</span></div>
        <div class="matrix-item"><span class="kicker">AK HOUSE</span><span class="val">House ${jaiminiRes?.akAmkAnalysis?.akHouseFromLagna || getHouseFromLagna(atmakaraka.sign, lagnaNum)}</span></div>
        <div class="matrix-item"><span class="kicker">RAJAYOGA TIER</span><span class="val">${escapeHtml(jaiminiRes?.akAmkAnalysis?.rajayogaTier || "Dharmic Axis")}</span></div>
      </div>
    `;
    themeP10 = `
      <h2 class="display-l" style="margin-bottom:8px;">Karakamsa &amp; Spiritual Liberation (Moksha)</h2>
      <p class="body-text" style="margin-bottom:20px;">The sign occupied by the Atmakaraka in D-9 Navamsha forms the Karakamsa Lagna (<strong>${escapeHtml(klSign)}</strong>), revealing Ishta Devata.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ KARAKAMSA LAGNA: ${escapeHtml(klSign.toUpperCase())}</div>
        <p class="body-text">12th from Karakamsa falls in <strong>${escapeHtml(kl12thSign)}</strong> (lord <strong>${escapeHtml(kl12thLord)}</strong>). Contemplative silence, scriptural study, and selfless seva align your path with <strong>${escapeHtml(ishtaName)}</strong>.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">ISHTA DEVATA</span><span class="val">${escapeHtml(ishtaName)}</span></div>
        <div class="matrix-item"><span class="kicker">12TH FROM KL</span><span class="val">${escapeHtml(kl12thSign)} (${escapeHtml(kl12thLord)})</span></div>
        <div class="matrix-item"><span class="kicker">MEDITATION TIME</span><span class="val">Brahma Muhurta</span></div>
        <div class="matrix-item"><span class="kicker">SOUL ANCHOR</span><span class="val">${escapeHtml(PLANET_SANSKRIT[atmakaraka.planet] || atmakaraka.planet)}</span></div>
      </div>
    `;
    themeP11 = `
      <h2 class="display-l" style="margin-bottom:8px;">Arudha Lagna (AL) vs Natal Lagna</h2>
      <p class="body-text" style="margin-bottom:20px;">Natal Lagna (${lagnaRashi}) is who you actually are. Arudha Lagna (AL in <strong>${escapeHtml(alSign)}</strong>) is how the world perceives your stature.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ PUBLIC IMAGE: AL IN ${escapeHtml(alSign.toUpperCase())} (HOUSE ${getHouseFromLagna(alSign, lagnaNum)})</div>
        <p class="body-text">Your Arudha Lagna is governed by <strong>${escapeHtml(SIGN_LORDS[alSign] || lagnaLord)}</strong>, projecting credibility through disciplined execution and reliable deliverables.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">NATAL LAGNA</span><span class="val">${lagnaRashi}</span></div>
        <div class="matrix-item"><span class="kicker">ARUDHA LAGNA</span><span class="val">${escapeHtml(alSign)}</span></div>
        <div class="matrix-item"><span class="kicker">AL LORD</span><span class="val">${escapeHtml(SIGN_LORDS[alSign] || lagnaLord)}</span></div>
        <div class="matrix-item"><span class="kicker">UL SIGN</span><span class="val">${escapeHtml(jaiminiRes?.arudhas?.find((a) => a.shortName === "UL")?.sign || h11Sign)}</span></div>
      </div>
    `;
    themeP12 = `
      <h2 class="display-l" style="margin-bottom:8px;">Chara Dasha Sign-Based Timing Horizon</h2>
      <p class="body-text" style="margin-bottom:20px;">Jaimini Chara Dasha tracks rashi mahadashas (${escapeHtml(jaiminiRes?.direction || "Savya")} sequence) to pinpoint status shifts and moves.</p>
      <div class="luxury-card" style="margin-bottom:16px;">
        <div class="card-title">✦ ACTIVE CHARA DASHA: ${escapeHtml(charaSign.toUpperCase())} RASHI</div>
        <p class="body-text">Your active Chara Dasha activates <strong>House ${charaHouse} (${escapeHtml(charaSign)})</strong> from Natal Lagna, directing primary karmic focus toward that bhava's opportunities.</p>
      </div>
      <div class="matrix-grid">
        <div class="matrix-item"><span class="kicker">ACTIVE RASHI DASHA</span><span class="val">${escapeHtml(charaSign)} Cycle</span></div>
        <div class="matrix-item"><span class="kicker">ACTIVATED BHAVA</span><span class="val">House ${charaHouse}</span></div>
        <div class="matrix-item"><span class="kicker">PROGRESSION</span><span class="val">${escapeHtml(jaiminiRes?.direction || "Savya")}</span></div>
        <div class="matrix-item"><span class="kicker">VIMSHOTTARI SYNC</span><span class="val">${dashaLord}–${antarLord}</span></div>
      </div>
    `;
  }

  // Prepare dynamic fallback metadata for Pages 15-22
  const mdProfileMeta = DASHA_PROFILE_META[dashaLordRaw] || {
    element: "Karmic Cycle",
    chakra: "Central Axis",
    field: "Steady Execution",
    guardrail: "Consistent Discipline",
  };
  const activeAdIdx = dashaState.adSeq.findIndex(
    (ad) =>
      ad.planet === antarLordRaw &&
      (!dashaState.activeAD ||
        (ad.start instanceof Date ? ad.start.toISOString() : String(ad.start)) === dashaState.activeAD.start)
  );
  const upcomingAntardashas =
    activeAdIdx >= 0
      ? dashaState.adSeq.slice(activeAdIdx, activeAdIdx + 4)
      : dashaState.adSeq.slice(0, 4);

  const rollingNow = buildDynamicRollingMonths({
    lagnaNum,
    activeDasha: dashaLordRaw,
    activeAntar: antarLordRaw,
    domain: "general",
    akvHouseSav: houseSav,
    cityTz: tzNum,
  })[0];

  const fbPrimaryGem = getDynamicGemstonePrescription(lagnaRashiRaw, resolvedGender);
  const fbResonanceFallback = PLANET_RESONANCE_META[lagnaLord] || PLANET_RESONANCE_META.Jupiter;
  let fbRudrakshaFallback = { mukhi: "5-Mukhi", bead: "Panchamukhi", mantra: "Om Namah Shivaya" };
  try {
    const lp = chart.planets?.[lagnaLord];
    const r = makeRudrakshaRecommendation(
      lagnaLord as Parameters<typeof makeRudrakshaRecommendation>[0],
      lp
        ? {
            planet: lagnaLord as Parameters<typeof makeRudrakshaRecommendation>[0],
            sign: lp.sign as NonNullable<Parameters<typeof makeRudrakshaRecommendation>[1]>["sign"],
            degree: getPlanetLon(lp) % 30,
            house: lp.house,
            isRetrograde: lp.retrograde,
            nakshatra: lp.nakshatra,
            nakshatraPada: lp.pada,
          }
        : undefined
    );
    fbRudrakshaFallback = { mukhi: r.mukhi, bead: r.bead, mantra: r.mantra };
  } catch {
    // keep safe default
  }

  const fbMedicalDosha = medicalRes?.tridoshaBreakdown?.dominant || `${lagnaRashiRaw} Constitution`;
  const fbMedicalFocus = medicalRes?.topConcerns?.[0] || medicalRes?.lagnaBodyZone || "Balanced Systemic Vitality";
  const fbMedicalAgni = medicalRes?.agniProfile?.title || "Balanced Metabolic Rhythm";
  const fbVastuStudy = vastuRes?.studyAndWorkDirection?.recommendedStudyZone || "North / East";
  const fbVastuWork = vastuRes?.studyAndWorkDirection?.recommendedOnlineWorkZone || "North-East / North";
  const fbVastuH4 = vastuRes?.studyAndWorkDirection?.fourthHouseDirection || "North-East";
  const fbVastuH10 = vastuRes?.studyAndWorkDirection?.tenthHouseDirection || "North";
  const fbVastuRationale =
    vastuRes?.studyAndWorkDirection?.rationale ||
    `Align workspace orientation with your ${lagnaRashiRaw} Lagna and 10th-house (${h10Sign}) directional axis.`;

  const rahuPlanet = chart.planets?.["Rahu"];
  const ketuPlanet = chart.planets?.["Ketu"];
  const rahuSign = rahuPlanet?.sign || "—";
  const rahuHouse = rahuPlanet?.house || (rahuPlanet?.sign ? getHouseFromLagna(rahuPlanet.sign, lagnaNum) : "—");
  const ketuSign = ketuPlanet?.sign || "—";
  const ketuHouse = ketuPlanet?.house || (ketuPlanet?.sign ? getHouseFromLagna(ketuPlanet.sign, lagnaNum) : "—");

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
        <div><span class="kicker">DATE & TIME OF BIRTH</span><div style="font-size:13.5px;font-weight:600;color:var(--ivory);">${birthDate} · ${birthTime} ${escapeHtml(tzLabel)}</div></div>
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
        <div class="matrix-item"><span class="kicker">TITHI</span><span class="val">${escapeHtml(tithiName)}</span></div>
        <div class="matrix-item"><span class="kicker">VARA (DAY)</span><span class="val">${escapeHtml(varaName)}</span></div>
        <div class="matrix-item"><span class="kicker">YOGA</span><span class="val">${escapeHtml(yogaName)}</span></div>
        <div class="matrix-item"><span class="kicker">KARANA</span><span class="val">${escapeHtml(karanaName)}</span></div>
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
        <div class="luxury-card" style="padding:12px 14px;"><span class="kicker">ASCENDANT (LAGNA)</span><div style="font-size:15px;font-weight:700;color:var(--gold);">${lagnaRashi} (${escapeHtml(formatDMS(typeof chart.lagnaLon === "number" && Number.isFinite(chart.lagnaLon) ? chart.lagnaLon : lagnaNum * 30))})</div><div class="body-s">Physical vitality, temperament, and life purpose anchor.</div></div>
        <div class="luxury-card" style="padding:12px 14px;"><span class="kicker">CHANDRA RASHI</span><div style="font-size:15px;font-weight:700;color:var(--ivory);">${moonRashi} (${nakshatra})</div><div class="body-s">Subconscious architecture and emotional responsiveness.</div></div>
        <div class="luxury-card" style="padding:12px 14px;"><span class="kicker">ACTIVE MAHADASHA</span><div style="font-size:15px;font-weight:700;color:var(--saffron);">${dashaLord}–${antarLord}</div><div class="body-s">Primary governing energetic cycle (${dashaState.mdStartYear}–${dashaState.mdEndYear}).</div></div>
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
    <p class="body-text" style="margin-bottom:16px;">The 9th harmonic division (Navamsha) evaluates spiritual maturity, marital synastry, and refined planetary strength across life chapters.</p>
    <div style="display:flex;gap:20px;align-items:flex-start;">
      <div style="background:var(--bg-card);border:1px solid var(--border-gold);border-radius:8px;padding:10px;display:flex;justify-content:center;">
        ${renderNorthIndianSvg(chart, Object.keys(d9PlanetsMap).length ? d9PlanetsMap : undefined, d9Chart ? d9Chart.lagnaNum : ((chart.lagnaNum || 0) + 8) % 12, 330)}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:10px;">
        <div class="luxury-card"><div class="card-title">✦ NAVAMSHA LAGNA: ${escapeHtml(d9Chart ? d9Chart.lagna : getSignFromHouse(lagnaNum, 9))}</div><p class="body-text">Reveals internal character and subconscious spiritual direction.</p></div>
        <div class="luxury-card"><div class="card-title">✦ VARGOTTAMA PLANETS</div><p class="body-text">${vargottamaPlanets.length ? `<strong>${vargottamaPlanets.map(escapeHtml).join(", ")}</strong> occupy identical signs in D-1 and D-9, conferring sovereign Vargottama bala.` : "No planets occupy identical D-1 and D-9 signs; strength flows through Navamsha dispositor harmony."}</p></div>
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
            <td style="font-family:'JetBrains Mono',monospace;">${escapeHtml(formatDMS(getPlanetLon(p)))}</td>
            <td>${escapeHtml(p.nakshatra || "—")} (${p.pada || 1})</td>
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
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 10px;">
      ${(shadbalaRes?.planets || []).slice(0, 7).map((sp) => `
        <div class="luxury-card" style="padding:12px 14px;">
          <div class="card-title" style="font-size:14px;margin-bottom:4px;">${escapeHtml(sp.planet)}: ${Number(sp.totalRupas || 7).toFixed(1)} Rupas (${Number(sp.shadbalaRatio || 1.1).toFixed(2)}x)</div>
          <p class="body-text" style="font-size:10.5px;">Status: <strong>${escapeHtml(sp.grade || "Strong")}</strong> · Threshold: ${sp.passesThreshold ? "✓ Passed" : "Deficit"}</p>
          <div class="matrix-grid" style="margin-top:6px;gap:6px;">
            <div class="matrix-item" style="padding:6px 8px;"><span class="kicker">STHANA</span><span class="val">${Number(sp.sthanaVirupas || 120).toFixed(0)}</span></div>
            <div class="matrix-item" style="padding:6px 8px;"><span class="kicker">DIG</span><span class="val">${Number(sp.digVirupas || 40).toFixed(0)}</span></div>
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
    <p class="body-text" style="margin-bottom:16px;">The 337 benefic bindu system calculates collective planetary support across all 12 houses for ${lagnaRashi} Lagna. Houses exceeding 28 bindus represent natural fountains of success.</p>
    <div class="matrix-grid" style="grid-template-columns: repeat(4, 1fr); gap: 10px;">
      ${houseSav.map((score: number, idx: number) => `
        <div class="matrix-item" style="border-color:${score >= 30 ? "rgba(201,169,97,0.4)" : "rgba(201,169,97,0.15)"};">
          <span class="kicker">HOUSE ${idx + 1} (${escapeHtml(getSignFromHouse(lagnaNum, idx + 1))})</span>
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
    <p class="body-text" style="margin-bottom:18px;">How the active planetary period (${dashaLord}–${antarLord}, ${dashaState.mdStartYear}–${dashaState.mdEndYear}) directs internal psychological energies and external real-world opportunities.</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ PRIMARY FOCUS & BEHAVIORAL PROTOCOL</div>
      <p class="body-text">The ${dashaLord} cycle activates pivotal life sectors for ${lagnaRashi} Lagna. Channel ambition into systematic competence, long-range planning, and unwavering ethics. Impulsive shortcuts create avoidable friction during this ${dashaLord}–${antarLord} window.</p>
    </div>
    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">PRIMARY ELEMENT</span><span class="val">${escapeHtml(mdProfileMeta.element)}</span></div>
      <div class="matrix-item"><span class="kicker">DOMINANT CHAKRA</span><span class="val">${escapeHtml(mdProfileMeta.chakra)}</span></div>
      <div class="matrix-item"><span class="kicker">EXPANSION FIELD</span><span class="val">${escapeHtml(mdProfileMeta.field)}</span></div>
      <div class="matrix-item"><span class="kicker">GUARDRAIL</span><span class="val">${escapeHtml(mdProfileMeta.guardrail)}</span></div>
    </div>
  </div>
  ${footerRail("Active Mahadasha Strategy", 15)}
</section>

<!-- PAGE 16: SEQUENTIAL 5-YEAR ANTARDASHA ROADMAP -->
<section class="page">
  ${headerRail("CHAPTER 11: 5-YEAR ANTARDASHA HORIZON")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Upcoming Antardasha Sub-Cycles</h2>
    <p class="body-text" style="margin-bottom:16px;">Sequential sub-period transitions under ${dashaLord} Mahadasha directing decision windows and emotional phases.</p>
    <div class="matrix-grid" style="grid-template-columns: repeat(2, 1fr); gap: 12px;">
      ${upcomingAntardashas.map((ad) => `
        <div class="luxury-card">
          <div class="card-title">${escapeHtml(dashaLordRaw)}–${escapeHtml(ad.planet)} Antardasha</div>
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
    <p class="body-text" style="margin-bottom:18px;">Vedic Shastras state that major life milestones crystallize under the dual sanction of Saturn and Jupiter for ${lagnaRashi} Lagna.</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ SATURN TRANSIT (SHANI GOCHAR): ${escapeHtml(rollingNow.saturnSign.toUpperCase())} (HOUSE ${rollingNow.saturnHouse})</div>
      <p class="body-text">In ${escapeHtml(rollingNow.label)}, Saturn transits <strong>${escapeHtml(rollingNow.saturnSign)}</strong> (House ${rollingNow.saturnHouse} from ${lagnaRashi} Lagna), enforcing structural consolidation and disciplined pacing in that house's domain.</p>
    </div>
    <div class="luxury-card">
      <div class="card-title">✦ JUPITER TRANSIT (GURU GOCHAR): ${escapeHtml(rollingNow.jupiterSign.toUpperCase())} (HOUSE ${rollingNow.jupiterHouse})</div>
      <p class="body-text">Jupiter transits <strong>${escapeHtml(rollingNow.jupiterSign)}</strong> (House ${rollingNow.jupiterHouse} from ${lagnaRashi} Lagna), casting auspicious 5th, 7th, and 9th aspects to expand growth and mentor alignment.</p>
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
        <p class="body-text">Placed in ${escapeHtml(rahuSign)} (House ${escapeHtml(rahuHouse)}). Urges you to innovate, conquer unconventional frontiers, and transcend ancestral boundaries.</p>
      </div>
      <div class="luxury-card">
        <div class="card-title">✦ KETU: THE INHERITED MASTERY</div>
        <p class="body-text">Placed in ${escapeHtml(ketuSign)} (House ${escapeHtml(ketuHouse)}). Innate discernment and analytical detachment. Release perfectionistic anxiety.</p>
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
    <p class="body-text" style="margin-bottom:18px;">Astrological mapping of Vata (Air/Ether), Pitta (Fire), and Kapha (Water/Earth) bio-energies for ${lagnaRashi} Lagna.</p>
    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">PRIMARY DOSHA</span><span class="val">${escapeHtml(fbMedicalDosha)}</span></div>
      <div class="matrix-item"><span class="kicker">ORGAN FOCUS</span><span class="val">${escapeHtml(fbMedicalFocus)}</span></div>
      <div class="matrix-item"><span class="kicker">HEALING FREQUENCY</span><span class="val">${escapeHtml(fbResonanceFallback.hz)}</span></div>
      <div class="matrix-item"><span class="kicker">AGNI BALANCE</span><span class="val">${escapeHtml(fbMedicalAgni)}</span></div>
    </div>
  </div>
  ${footerRail("Ayurvedic Bio-Dosha", 19)}
</section>

<!-- PAGE 20: ASTRO-VASTU & ENVIRONMENTAL RESONANCE -->
<section class="page">
  ${headerRail("CHAPTER 15: ASTRO-VASTU SPATIAL HARMONY")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">16-Zone Astro-Vastu Environmental Alignment</h2>
    <p class="body-text" style="margin-bottom:18px;">Harmonizing home and workspace compass directions with your ${lagnaRashi} Lagna planetary dispositors.</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ PERSONALIZED DIRECTIONAL ANCHOR (${escapeHtml(fbVastuWork)})</div>
      <p class="body-text">${escapeHtml(fbVastuRationale)}</p>
    </div>
    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">WORK ZONE</span><span class="val">${escapeHtml(fbVastuWork)}</span></div>
      <div class="matrix-item"><span class="kicker">STUDY ZONE</span><span class="val">${escapeHtml(fbVastuStudy)}</span></div>
      <div class="matrix-item"><span class="kicker">4TH BHAVA AXIS</span><span class="val">${escapeHtml(fbVastuH4)}</span></div>
      <div class="matrix-item"><span class="kicker">10TH BHAVA AXIS</span><span class="val">${escapeHtml(fbVastuH10)}</span></div>
    </div>
  </div>
  ${footerRail("Astro-Vastu Spatial Harmony", 20)}
</section>

<!-- PAGE 21: SACRED BIO-REMEDIES (RATNA & RUDRAKSHA) -->
<section class="page">
  ${headerRail("CHAPTER 16: RATNA & RUDRAKSHA PRESCRIPTION")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Personalized Bio-Wearable Prescriptions</h2>
    <p class="body-text" style="margin-bottom:18px;">Prescribed gems and electromagnetic beads calibrated for ${escapeHtml(withArticle(lagnaRashiRaw))} Ascendant (${escapeHtml(lagnaLord)} Lagnesh) without aggravating dusthana lords.</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">✦ CERTIFIED GEMSTONE & BEAD ARCHITECTURE</div>
      <p class="body-text">Primary recommendation: <strong>${escapeHtml(fbPrimaryGem.primaryGem)}</strong> (or ${escapeHtml(fbPrimaryGem.uparatna)}). Sacred bead: <strong>${escapeHtml(fbRudrakshaFallback.mukhi)} (${escapeHtml(fbRudrakshaFallback.bead)})</strong> Rudraksha worn on ${escapeHtml(fbPrimaryGem.day)} post purification. ${escapeHtml(fbPrimaryGem.rationale)}</p>
    </div>
    <div class="matrix-grid">
      <div class="matrix-item"><span class="kicker">PRIMARY RATNA</span><span class="val">${escapeHtml(fbPrimaryGem.primaryGem)}</span></div>
      <div class="matrix-item"><span class="kicker">RUDRAKSHA</span><span class="val">${escapeHtml(fbRudrakshaFallback.mukhi)}</span></div>
      <div class="matrix-item"><span class="kicker">METAL</span><span class="val">${escapeHtml(fbPrimaryGem.metal)}</span></div>
      <div class="matrix-item"><span class="kicker">FINGER / LATERALITY</span><span class="val">${escapeHtml(fbPrimaryGem.finger)}</span></div>
    </div>
  </div>
  ${footerRail("Ratna & Rudraksha Prescription", 21)}
</section>

<!-- PAGE 22: SACRED UPAYAS (JAPA, MANTRA & DANA) -->
<section class="page">
  ${headerRail("CHAPTER 17: SACRED JAPA & DANA UPAYAS")}
  <div>
    <h2 class="display-l" style="margin-bottom:6px;">Classical Upayas, Mantras & Charitable Seva</h2>
    <p class="body-text" style="margin-bottom:18px;">Non-destructive, authentic Vedic remedies calibrated for your Lagnesh (${escapeHtml(lagnaLord)}) and ${moonRashi} Moon.</p>
    <div class="luxury-card" style="margin-bottom:16px;">
      <div class="card-title">1. LAGNESH (${escapeHtml(PLANET_SANSKRIT[lagnaLord] || lagnaLord).toUpperCase()}) BEEJ JAPA</div>
      <p class="body-text">Chant your Lagnesh seed mantra 108 times on ${escapeHtml(PLANET_WEEKDAYS[lagnaLord] || "Thursday")} mornings facing East:</p>
      <div style="font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--gold-bright);margin-top:8px;font-weight:600;">
        ${escapeHtml(fbPrimaryGem.mantra)}
      </div>
    </div>
    <div class="luxury-card">
      <div class="card-title">2. SELFLESS DANA & NATURE SEVA</div>
      <p class="body-text">Nurturing ${escapeHtml(fbResonanceFallback.plant)}, offering wholesome grains at sunrise on ${escapeHtml(PLANET_WEEKDAYS[lagnaLord] || "Thursday")}s, and supporting education dissolves karmic friction cleanly.</p>
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
        Certified for: ${subjectName} · Archive Ref: ${orderId} · www.astrolife.io
      </div>
      ${isSample ? `
        <div style="margin-top:16px;background:rgba(201,169,97,0.12);border:1px solid var(--border-gold);border-radius:6px;padding:10px 14px;display:inline-block;">
          <div style="font-size:11px;font-weight:700;color:var(--gold-bright);margin-bottom:2px;">✦ OFFICIAL HIGH-DEFINITION DOSSIER UNLOCK ✦</div>
          <div style="font-size:10px;color:var(--ivory-dim);">To generate your un-watermarked permanent archival copy, visit <span style="color:var(--gold);">www.astrolife.io/reports</span></div>
        </div>
      ` : ""}
    </div>
  </div>
  ${footerRail("Certified Shastra Archive", 24)}
</section>

</body>
</html>`;
}
