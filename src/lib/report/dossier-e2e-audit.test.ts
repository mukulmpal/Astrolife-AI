import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  calculateChart,
  type ChartData,
  type DashaEntry,
} from "../astro-engine/calculations";
import { calculateAshtakavarga } from "../astro-engine/ashtakavarga";
import { calculateKunda } from "../astro-engine/birth-rectification-engine";
import { calculateMedical } from "../astro-engine/medical";
import { buildJaiminiChart } from "../astro-engine/jaimini";
import { calculateSarvatobhadraGrid } from "../astro-engine/sarvatobhadra-grid";
import {
  generatePackageDossierHTML,
  type PackageDossierOptions,
} from "./package-dossier-html-generator";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Authoritative QA Profiles, Catalog Definitions & Ground Truth
// ─────────────────────────────────────────────────────────────────────────────

interface TestProfile {
  slug: string;
  name: string;
  gender: "male" | "female";
  dob: string;
  tob: string;
  place: string;
  lat: number;
  lng: number;
  tz: number;
  expectedLagna: string;
  expectedLagnesh: string;
  expectedMoonSign: string;
  expectedMoonNak: string;
  expectedMoonPada: number;
  expectedMoonHouse: number;
  expectedMd: string;
  expectedAd: string;
}

const QA_PROFILES: readonly TestProfile[] = [
  {
    slug: "Bhanu-Pal",
    name: "Bhanu Pal",
    gender: "male",
    dob: "1993-08-28",
    tob: "14:40",
    place: "Delhi, India",
    lat: 28.6139,
    lng: 77.2090,
    tz: 5.5,
    expectedLagna: "Sagittarius",
    expectedLagnesh: "Jupiter",
    expectedMoonSign: "Sagittarius",
    expectedMoonNak: "Uttara Ashadha",
    expectedMoonPada: 1,
    expectedMoonHouse: 1,
    expectedMd: "Rahu",
    expectedAd: "Ketu",
  },
  {
    slug: "Deen-Dayal-Pal",
    name: "Deen Dayal Pal",
    gender: "male",
    dob: "1978-11-10",
    tob: "14:00",
    place: "Bazpur, Uttarakhand, India",
    lat: 29.1567,
    lng: 79.1604,
    tz: 5.5,
    expectedLagna: "Aquarius",
    expectedLagnesh: "Saturn",
    expectedMoonSign: "Aquarius",
    expectedMoonNak: "Purva Bhadrapada",
    expectedMoonPada: 3,
    expectedMoonHouse: 1,
    expectedMd: "Ketu",
    expectedAd: "Mercury",
  },
  {
    slug: "Manisha-Mehra",
    name: "Manisha Mehra",
    gender: "female",
    dob: "1993-12-06",
    tob: "12:30",
    place: "Delhi, India",
    lat: 28.6139,
    lng: 77.2090,
    tz: 5.5,
    expectedLagna: "Aquarius",
    expectedLagnesh: "Saturn",
    expectedMoonSign: "Leo",
    expectedMoonNak: "Purva Phalguni",
    expectedMoonPada: 1,
    expectedMoonHouse: 7,
    expectedMd: "Mars",
    expectedAd: "Rahu",
  },
  {
    slug: "Mukul-Mohan-Pal",
    name: "Mukul Mohan Pal",
    gender: "male",
    dob: "1995-07-04",
    tob: "12:34",
    place: "Delhi, India",
    lat: 28.6139,
    lng: 77.2090,
    tz: 5.5,
    expectedLagna: "Virgo",
    expectedLagnesh: "Mercury",
    expectedMoonSign: "Leo",
    expectedMoonNak: "Uttara Phalguni",
    expectedMoonPada: 1,
    expectedMoonHouse: 12,
    expectedMd: "Rahu",
    expectedAd: "Mercury",
  },
];

type GeneratorKey =
  | "sacred_union"
  | "wealth_yogas"
  | "bio_remedies"
  | "space_destiny"
  | "stock_trading"
  | "jaimini_soul"
  | "ayurvedic_medical"
  | "muhurat_panchang"
  | "destiny_curve";

interface GeneratorSpec {
  key: GeneratorKey;
  fileName: string;
  primaryReportId: string;
  primaryTitle: string;
  titlePattern: RegExp;
  genderAwareExpected: boolean;
}

const GENERATORS: readonly GeneratorSpec[] = [
  {
    key: "sacred_union",
    fileName: "sacred-union-dossier-generator.ts",
    primaryReportId: "pkg_sacred_union",
    primaryTitle: "Sacred Union & Family Destiny",
    titlePattern: /Sacred Union & Family Destiny Dossier/i,
    genderAwareExpected: true,
  },
  {
    key: "wealth_yogas",
    fileName: "raja-yoga-wealth-dossier-generator.ts",
    primaryReportId: "pkg_wealth_yogas",
    primaryTitle: "Raja Yoga & Wealth Acceleration",
    titlePattern: /Raja Yoga & Wealth Acceleration Suite/i,
    genderAwareExpected: true,
  },
  {
    key: "bio_remedies",
    fileName: "bio-vedic-remedies-dossier-generator.ts",
    primaryReportId: "pkg_bio_remedies",
    primaryTitle: "Bio-Vedic Protection & Remedial Vault",
    titlePattern: /Bio-Vedic Protection & Sacred Remedy Vault/i,
    genderAwareExpected: true,
  },
  {
    key: "space_destiny",
    fileName: "space-destiny-dossier-generator.ts",
    primaryReportId: "pkg_space_destiny",
    primaryTitle: "Space Energy, Vastu, Palmistry & BTR",
    titlePattern: /Space Energy, Palmistry & Destiny Calibration/i,
    genderAwareExpected: true,
  },
  {
    key: "stock_trading",
    fileName: "stock-trading-dossier-generator.ts",
    primaryReportId: "pkg_stock_trading",
    primaryTitle: "Stock Market, Speculation & Sarvatobhadra",
    titlePattern: /Stock Market, Trading & Speculation Dossier/i,
    genderAwareExpected: true,
  },
  {
    key: "jaimini_soul",
    fileName: "jaimini-soul-dossier-generator.ts",
    primaryReportId: "pkg_jaimini_soul",
    primaryTitle: "Jaimini Soul Blueprint & Karmic Mission",
    titlePattern: /Jaimini Soul Blueprint & Karmic Mission Dossier/i,
    genderAwareExpected: true,
  },
  {
    key: "ayurvedic_medical",
    fileName: "ayurvedic-medical-dossier-generator.ts",
    primaryReportId: "pkg_ayurvedic_medical",
    primaryTitle: "Ayurvedic Medical & Vitality Shield",
    titlePattern: /Ayurvedic Medical & Psychological Vitality Shield/i,
    genderAwareExpected: true,
  },
  {
    key: "muhurat_panchang",
    fileName: "golden-muhurat-dossier-generator.ts",
    primaryReportId: "pkg_muhurat_panchang",
    primaryTitle: "Golden Muhurat & Cosmic Decision Matrix",
    titlePattern: /Golden Muhurat & Auspicious Decision Suite/i,
    genderAwareExpected: true,
  },
  {
    key: "destiny_curve",
    fileName: "destiny-curve-dossier-generator.ts",
    primaryReportId: "destiny_curve_flagship",
    primaryTitle: "📈 Destiny Curve: 90-Year Life Master Dossier",
    titlePattern: /Destiny Curve 90-Year Life Master/i,
    genderAwareExpected: true,
  },
];

interface CatalogRouteCase {
  category: "master" | "alias" | "single";
  reportId: string;
  reportTitle: string;
  expectedGenerator: GeneratorKey;
}

const CATALOG_ROUTES: readonly CatalogRouteCase[] = [
  // 8 Master Dossiers
  { category: "master", reportId: "pkg_sacred_union", reportTitle: "Sacred Union & Family Destiny", expectedGenerator: "sacred_union" },
  { category: "master", reportId: "pkg_wealth_yogas", reportTitle: "Raja Yoga & Wealth Acceleration", expectedGenerator: "wealth_yogas" },
  { category: "master", reportId: "pkg_bio_remedies", reportTitle: "Bio-Vedic Protection & Remedial Vault", expectedGenerator: "bio_remedies" },
  { category: "master", reportId: "pkg_space_destiny", reportTitle: "Space Energy, Vastu, Palmistry & BTR", expectedGenerator: "space_destiny" },
  { category: "master", reportId: "pkg_stock_trading", reportTitle: "Stock Market, Speculation & Sarvatobhadra", expectedGenerator: "stock_trading" },
  { category: "master", reportId: "pkg_jaimini_soul", reportTitle: "Jaimini Soul Blueprint & Karmic Mission", expectedGenerator: "jaimini_soul" },
  { category: "master", reportId: "pkg_ayurvedic_medical", reportTitle: "Ayurvedic Medical & Vitality Shield", expectedGenerator: "ayurvedic_medical" },
  { category: "master", reportId: "pkg_muhurat_panchang", reportTitle: "Golden Muhurat & Cosmic Decision Matrix", expectedGenerator: "muhurat_panchang" },

  // 3 SEO / Catalog Aliases
  { category: "alias", reportId: "pkg_union_family", reportTitle: "💍 Sacred Union & Family Destiny Pack", expectedGenerator: "sacred_union" },
  { category: "alias", reportId: "pkg_astro_vastu", reportTitle: "Astro-Vastu Dosha & Space Alignment", expectedGenerator: "space_destiny" },
  { category: "alias", reportId: "pkg_health_medical", reportTitle: "Medical Astrology & Ayurvedic Health Dossier", expectedGenerator: "ayurvedic_medical" },

  // 22 Single & Flagship Reports (exact IDs from src/app/reports/page.tsx)
  { category: "single", reportId: "destiny_curve_flagship", reportTitle: "📈 Destiny Curve: 90-Year Life Master Dossier", expectedGenerator: "destiny_curve" },
  { category: "single", reportId: "navtara_dasha_single", reportTitle: "🌟 Navtara Chakra & Dasha Transit Audit", expectedGenerator: "destiny_curve" },
  { category: "single", reportId: "kundali_milan_single", reportTitle: "💍 Kundali Milan & 36-Guna Compatibility", expectedGenerator: "sacred_union" },
  { category: "single", reportId: "family_karma_single", reportTitle: "🌳 Family Karma & Lineage Synastry", expectedGenerator: "sacred_union" },
  { category: "single", reportId: "classical_yogas_single", reportTitle: "✨ 300+ Classical Yogas & Awakening Timing", expectedGenerator: "wealth_yogas" },
  { category: "single", reportId: "gemstone_rudraksha_single", reportTitle: "💎 Advance Gemstone & Rudraksha Prescription", expectedGenerator: "bio_remedies" },
  { category: "single", reportId: "vastu_radar_single", reportTitle: "🧭 Astro-Vastu Directional Radar", expectedGenerator: "space_destiny" },
  { category: "single", reportId: "dot_therapy_thread_single", reportTitle: "🔴 Astro Dot Therapy & Sacred Thread Protocol", expectedGenerator: "bio_remedies" },
  { category: "single", reportId: "astro_tattoo_single", reportTitle: "🎨 Astro-Tattoo & Sacred Yantra Geometry", expectedGenerator: "bio_remedies" },
  { category: "single", reportId: "numerology_single", reportTitle: "🔢 Vedic Numerology & Name Resonance", expectedGenerator: "wealth_yogas" },
  { category: "single", reportId: "palmistry_scan", reportTitle: "🖐️ Samudrika Shastra & Palm Scan", expectedGenerator: "space_destiny" },
  { category: "single", reportId: "btr_mathematical", reportTitle: "⏱️ Mathematical Birth Time Rectification (BTR)", expectedGenerator: "space_destiny" },
  { category: "single", reportId: "prashna_instant", reportTitle: "❓ Prashna Kundli (Instant Urgent Query)", expectedGenerator: "muhurat_panchang" },
  { category: "single", reportId: "transit_purchase", reportTitle: "🚗 Transit Purchase Timing (Car, Home, Gold)", expectedGenerator: "muhurat_panchang" },
  { category: "single", reportId: "yearly_gochar", reportTitle: "🪐 2026-2027 1-Year Transit & Sade Sati Dossier", expectedGenerator: "destiny_curve" },
  { category: "single", reportId: "astro_sound", reportTitle: "🎵 Astro-Sound & Frequency Therapy", expectedGenerator: "bio_remedies" },
  { category: "single", reportId: "sarvatobhadra_single", reportTitle: "📊 Sarvatobhadra Transit & Trading Hit Radar", expectedGenerator: "stock_trading" },
  { category: "single", reportId: "special_lagnas_single", reportTitle: "👑 Special Lagnas: Hora & Sree Lagna Wealth Dossier", expectedGenerator: "wealth_yogas" },
  { category: "single", reportId: "atmakaraka_soul_single", reportTitle: "👁️ Atmakaraka & Jaimini Soul Purpose Dossier", expectedGenerator: "jaimini_soul" },
  { category: "single", reportId: "ashtakavarga_bindus_single", reportTitle: "🔢 Ashtakavarga 337-Bindus Strength Matrix", expectedGenerator: "stock_trading" },
  { category: "single", reportId: "medical_roga_single", reportTitle: "🏥 Medical Astrology & Organ Vulnerability Audit", expectedGenerator: "ayurvedic_medical" },
  { category: "single", reportId: "cognitive_mind_single", reportTitle: "🧠 Cognitive Mind & Emotional Stress Decoder", expectedGenerator: "ayurvedic_medical" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. Cached Chart Computation & HTML Normalization Helpers
// ─────────────────────────────────────────────────────────────────────────────

const chartCache = new Map<string, ChartData>();
const masterHtmlCache = new Map<string, string>();
const visibleTextCache = new Map<string, string>();

function getQaChart(profile: TestProfile): ChartData {
  let chart = chartCache.get(profile.slug);
  if (!chart) {
    chart = calculateChart(
      profile.name,
      profile.dob,
      profile.tob,
      profile.place,
      profile.lat,
      profile.lng,
      profile.tz
    );
    chartCache.set(profile.slug, chart);
  }
  return chart;
}

function getMasterHtml(profile: TestProfile, gen: GeneratorSpec): string {
  const cacheKey = `${profile.slug}::${gen.key}`;
  let html = masterHtmlCache.get(cacheKey);
  if (!html) {
    const chart = getQaChart(profile);
    html = generatePackageDossierHTML(chart, {
      reportId: gen.primaryReportId,
      reportTitle: gen.primaryTitle,
      customerName: profile.name,
      isSample: false,
      orderId: `E2E-${profile.slug}-${gen.key}`,
      paymentId: `PAY-${profile.slug}-${gen.key}`,
      gender: profile.gender,
    });
    masterHtmlCache.set(cacheKey, html);
  }
  return html;
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, "\"")
    .replace(/&#0*39;/g, "'")
    .replace(/&deg;/g, "°")
    .replace(/&middot;/g, "·")
    .replace(/&times;/g, "×")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtmlToVisibleText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function extractSvgText(html: string): string {
  const svgBlocks = html.match(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi);
  if (!svgBlocks) return "";
  return svgBlocks
    .map((svg) =>
      decodeHtmlEntities(svg.replace(/<[^>]+>/g, " "))
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean)
    .join("\n");
}

function stripDualGenderClauses(text: string): string {
  return text
    .replace(/Left\s*\(female\)\s*\/\s*Right\s*\(male\)/gi, "")
    .replace(/Right\s*\(male\)\s*\/\s*Left\s*\(female\)/gi, "")
    .replace(/Dakshina\s*\/\s*Vama\s*Anga(?:\s*\([^)]*\))?/gi, "")
    .replace(/Vama\s*\/\s*Dakshina\s*Anga(?:\s*\([^)]*\))?/gi, "")
    .replace(/Right\s*\/\s*Left/gi, "")
    .replace(/Left\s*\/\s*Right/gi, "")
    .replace(/Dominant\s*\/\s*Non-dominant/gi, "")
    .replace(/(?:Left|Right)\s+Hand\s*=\s*(?:Active\s+Current\s+Karma|Natal\s+Prarabdha)[^.;<\n]*/gi, "")
    .replace(/Males[^.\n]*Dakshina\s+Anga[^.\n]*females[^.\n]*Vama\s+Anga[^.\n]*/gi, "")
    .replace(/females[^.\n]*Vama\s+Anga[^.\n]*males[^.\n]*Dakshina\s+Anga[^.\n]*/gi, "");
}

function getCachedVisibleText(profile: TestProfile, gen: GeneratorSpec): string {
  const cacheKey = `${profile.slug}::${gen.key}`;
  let txt = visibleTextCache.get(cacheKey);
  if (!txt) {
    txt = stripHtmlToVisibleText(getMasterHtml(profile, gen));
    visibleTextCache.set(cacheKey, txt);
  }
  return txt;
}

function extractTitleText(html: string): string {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? decodeHtmlEntities(m[1]).trim() : "";
}

function assertValidHtmlShell(html: string, context: string): string {
  assert.ok(html.length > 5000, `${context}: expected HTML length > 5000, got ${html.length}`);
  assert.ok(
    /<!DOCTYPE html>|<html[\s>]/i.test(html) && /<\/html>/i.test(html),
    `${context}: missing valid HTML document open/close tags`
  );
  const visible = stripHtmlToVisibleText(html);
  assert.ok(!/\bNaN\b/.test(visible), `${context}: visible text contains "NaN"`);
  assert.ok(!/\bundefined\b/.test(visible), `${context}: visible text contains "undefined"`);
  return visible;
}

function computeExpectedAge(dob: string, refDate = new Date()): number {
  const [yStr, mStr, dStr] = dob.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const d = Number(dStr);
  let age = refDate.getFullYear() - y;
  const monthDiff = refDate.getMonth() + 1 - m;
  if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < d)) {
    age -= 1;
  }
  return age;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSentences(visibleText: string): string[] {
  return visibleText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 25);
}

function extractProseParagraphs(html: string): string[] {
  const paragraphs: string[] = [];
  const pRegex = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = pRegex.exec(html)) !== null) {
    const clean = stripHtmlToVisibleText(m[1]);
    if (clean.length >= 40) {
      paragraphs.push(clean);
    }
  }
  return paragraphs;
}

function hasConsecutiveIdenticalParagraphs(
  paragraphLists: string[][],
  minRun = 3
): boolean {
  if (paragraphLists.length < 2) return false;
  const sets = paragraphLists.slice(1).map((list) => new Set(list));
  let consecutive = 0;
  for (const p of paragraphLists[0]) {
    if (sets.every((s) => s.has(p))) {
      consecutive += 1;
      if (consecutive >= minRun) return true;
    } else {
      consecutive = 0;
    }
  }
  return false;
}

function assertDynamicIdentitySignals(
  profile: TestProfile,
  gen: GeneratorSpec,
  visibleText: string
): void {
  const ctx = `${profile.slug} / ${gen.key}`;

  // 1. Lagna & Lagnesh
  assert.ok(
    new RegExp(`\\b${escapeRegExp(profile.expectedLagna)}\\b`, "i").test(visibleText),
    `${ctx}: missing Lagna "${profile.expectedLagna}"`
  );
  assert.ok(
    new RegExp(`\\b${escapeRegExp(profile.expectedLagnesh)}\\b`, "i").test(visibleText),
    `${ctx}: missing Lagnesh "${profile.expectedLagnesh}"`
  );

  // 2. Moon Sign, Nakshatra & Exact Pada
  assert.ok(
    new RegExp(`\\b${escapeRegExp(profile.expectedMoonSign)}\\b`, "i").test(visibleText),
    `${ctx}: missing Moon sign "${profile.expectedMoonSign}"`
  );
  assert.ok(
    new RegExp(`\\b${escapeRegExp(profile.expectedMoonNak)}\\b`, "i").test(visibleText),
    `${ctx}: missing Moon nakshatra "${profile.expectedMoonNak}"`
  );
  const nakEsc = escapeRegExp(profile.expectedMoonNak);
  const padaNum = profile.expectedMoonPada;
  const padaContextRegex = new RegExp(
    `${nakEsc}[^.\\n]{0,45}(?:Pada\\s*${padaNum}\\b|\\(P?${padaNum}\\)|\\bP${padaNum}\\b|(?:^|[\\s·,(])${padaNum}\\b(?![-–%]))|` +
      `Pada\\s*${padaNum}\\b[^.\\n]{0,45}${nakEsc}|` +
      `Moon\\s+Nakshatra[^.\\n]{0,70}(?:Pada\\s*${padaNum}\\b|\\(P?${padaNum}\\)|\\bP${padaNum}\\b)`,
    "i"
  );
  assert.ok(
    padaContextRegex.test(visibleText),
    `${ctx}: missing exact Moon Pada ${padaNum} near "${profile.expectedMoonNak}"`
  );
  if (profile.expectedMoonPada !== 1) {
    const wrongPada1 = new RegExp(
      `${nakEsc}\\s*(?:\\(1\\)|\\(P1\\)|\\(Pada\\s*1\\)|·\\s*Pada\\s*1\\b|·\\s*P1\\b|\\bPada\\s*1\\b|\\bP1\\b|1\\))`,
      "i"
    );
    assert.ok(
      !wrongPada1.test(visibleText),
      `${ctx}: Moon nakshatra "${profile.expectedMoonNak}" wrongly shows Pada 1 instead of Pada ${padaNum}`
    );
  }

  // 3. Active Mahadasha & Active Antardasha
  const mdEsc = escapeRegExp(profile.expectedMd);
  const adEsc = escapeRegExp(profile.expectedAd);
  const mdRegex = new RegExp(
    `(?:Operating\\s+Dasha|Active\\s+(?:Dasha|Mahadasha)|Current\\s+(?:Dasha|Mahadasha)|Mahadasha)[^.\\n]{0,90}\\b${mdEsc}\\b|` +
      `\\b${mdEsc}\\b[^.\\n]{0,40}(?:Mahadasha|\\bMD\\b|[–—-]\\s*${adEsc}\\b)`,
    "i"
  );
  const adRegex = new RegExp(
    `(?:Operating\\s+Dasha|Antardasha|Sub-Period|Active\\s+AD)[^.\\n]{0,90}\\b${adEsc}\\b|` +
      `\\b${mdEsc}\\s*[–—-]\\s*${adEsc}\\b`,
    "i"
  );
  assert.ok(
    mdRegex.test(visibleText),
    `${ctx}: missing active Mahadasha "${profile.expectedMd}" in dasha context`
  );
  assert.ok(
    adRegex.test(visibleText),
    `${ctx}: missing active Antardasha "${profile.expectedAd}" in dasha context`
  );
  if (profile.expectedAd !== "Mercury") {
    assert.ok(
      !/\(Budh\)/i.test(visibleText),
      `${ctx}: hardcoded "(Budh)" leaked onto non-Mercury AD "${profile.expectedAd}"`
    );
  }

  // 4. Seeker Age computed dynamically from DOB
  const expectedAge = computeExpectedAge(profile.dob);
  const ageRegex = new RegExp(
    `\\b(?:Age|Seeker\\s+Age|Current\\s+Age|Native\\s+Age)\\D{0,25}\\b${expectedAge}\\b|` +
      `\\b${expectedAge}\\s*(?:yrs?|years?(?:\\s*old)?)\\b`,
    "i"
  );
  assert.ok(
    ageRegex.test(visibleText),
    `${ctx}: missing dynamically computed Seeker Age ${expectedAge}`
  );

  // 5. Gender Lateralization (anatomical/polarity context, avoiding ordinary English words)
  if (gen.genderAwareExpected) {
    // Strip explicit neutral paired strings and Samudrika dual-hand/dual-gender rule prose before checking unilateral bias
    const textWithoutNeutralPairs = stripDualGenderClauses(visibleText);

    if (profile.gender === "female") {
      assert.ok(
        /\b(?:Left\s+(?:wrist|hand|side|ring\s+finger)|Vama\s+Anga)\b/i.test(visibleText),
        `${ctx}: female chart missing Left / Vama Anga lateralization`
      );
      assert.ok(
        !/\b(?:Dakshina\s+Anga|Right\s+wrist|Right\s+hand|Right\s+side|Right\s+Ring\s+Finger|Right\s*\(male\))\b/i.test(
          textWithoutNeutralPairs
        ),
        `${ctx}: female chart leaked male-only Right / Dakshina lateralization`
      );
    } else {
      assert.ok(
        /\b(?:Right\s+(?:wrist|hand|side|ring\s+finger)|Dakshina\s+Anga)\b/i.test(visibleText),
        `${ctx}: male chart missing Right / Dakshina Anga lateralization`
      );
      assert.ok(
        !/\b(?:Vama\s+Anga|Left\s+wrist|Left\s+hand|Left\s+side|Left\s+Ring\s+Finger|Left\s*\(female\))\b/i.test(
          textWithoutNeutralPairs
        ),
        `${ctx}: male chart leaked female-only Left / Vama lateralization`
      );
    }
  }
}

function cloneChartWithoutGender(base: ChartData): ChartData {
  const cloned = structuredClone(base);
  delete (cloned as unknown as Record<string, unknown>).gender;
  return cloned;
}

// ─────────────────────────────────────────────────────────────────────────────
// TIER 1 — Feature Coverage: 8 Master + 3 Aliases + 22 Single + Fallback x 4 Profiles
// ─────────────────────────────────────────────────────────────────────────────

describe("Tier 1 — Full Catalog Routing & Dynamic Identity Coverage (4 QA Profiles)", () => {
  it("routes all 8 Master Dossiers, 3 SEO aliases, and 22 Single Reports across all 4 QA profiles (132 calls) + fallback (4 calls)", () => {
    const genMap = new Map(GENERATORS.map((g) => [g.key, g]));

    for (const profile of QA_PROFILES) {
      const chart = getQaChart(profile);

      // Verify ground truth computed chart matches QA profile expectations
      assert.equal(chart.lagnaRashi, profile.expectedLagna);
      assert.equal(chart.planets.Moon.sign, profile.expectedMoonSign);
      assert.equal(chart.planets.Moon.nakshatra, profile.expectedMoonNak);
      assert.equal(chart.planets.Moon.pada, profile.expectedMoonPada);
      assert.equal(chart.planets.Moon.house, profile.expectedMoonHouse);
      assert.equal(chart.dashas.find((d) => d.active)?.planet, profile.expectedMd);
      assert.equal(chart.antardasha.find((a) => a.active)?.planet, profile.expectedAd);

      for (const route of CATALOG_ROUTES) {
        const targetGen = genMap.get(route.expectedGenerator)!;
        const html =
          route.reportId === targetGen.primaryReportId &&
          route.reportTitle === targetGen.primaryTitle
            ? getMasterHtml(profile, targetGen)
            : generatePackageDossierHTML(chart, {
                reportId: route.reportId,
                reportTitle: route.reportTitle,
                customerName: profile.name,
                isSample: false,
                orderId: `T1-${profile.slug}-${route.reportId}`,
                paymentId: `PAY-${profile.slug}-${route.reportId}`,
                gender: profile.gender,
              });

        const ctx = `${profile.slug} [${route.category}] ${route.reportId}`;
        assertValidHtmlShell(html, ctx);

        const title = extractTitleText(html);
        assert.ok(
          targetGen.titlePattern.test(title),
          `${ctx}: routed to wrong template; <title> was "${title}"`
        );
      }

      // Fallback routing check for unrecognized ID
      const fallbackHtml = generatePackageDossierHTML(chart, {
        reportId: "unknown_custom_pkg_999",
        reportTitle: "Unrecognized Custom Package",
        customerName: profile.name,
        isSample: false,
        gender: profile.gender,
      });
      const fallbackVisible = assertValidHtmlShell(
        fallbackHtml,
        `${profile.slug} [fallback]`
      );
      const fallbackTitle = extractTitleText(fallbackHtml);
      assert.ok(
        /Unrecognized Custom Package/i.test(fallbackTitle),
        `${profile.slug} [fallback]: expected fallback title, got "${fallbackTitle}"`
      );
      assert.ok(
        new RegExp(`\\b${profile.expectedLagna}\\b`, "i").test(fallbackVisible),
        `${profile.slug} [fallback]: missing Lagna "${profile.expectedLagna}"`
      );
    }
  });

  for (const gen of GENERATORS) {
    it(`Tier 1 identity signals — ${gen.key} (${gen.fileName}) across all 4 QA profiles`, () => {
      for (const profile of QA_PROFILES) {
        const html = getMasterHtml(profile, gen);
        const visible = assertValidHtmlShell(html, `${profile.slug} / ${gen.key}`);
        assertDynamicIdentitySignals(profile, gen, visible);
      }
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 2 — Boundary & Corner Cases (9 Cases via generatePackageDossierHTML)
// ─────────────────────────────────────────────────────────────────────────────

describe("Tier 2 — Boundary & Corner Cases (9 Strict Engine Contracts)", () => {
  it("Case 1: Mars-ruled Lagna (Aries & Scorpio) is respected as benefic Lagnesh in Golden Muhurat & Bio-Vedic Remedies", () => {
    const ariesChart = calculateChart("Aries Seeker", "1995-07-04", "02:15", "Delhi, India", 28.6139, 77.2090, 5.5);
    const scorpioChart = calculateChart("Scorpio Seeker", "1995-07-04", "16:15", "Delhi, India", 28.6139, 77.2090, 5.5);
    assert.equal(ariesChart.lagnaRashi, "Aries");
    assert.equal(scorpioChart.lagnaRashi, "Scorpio");

    for (const [label, chart] of [
      ["Aries", ariesChart],
      ["Scorpio", scorpioChart],
    ] as const) {
      const muhuratHtml = generatePackageDossierHTML(chart, {
        reportId: "pkg_muhurat_panchang",
        reportTitle: "Golden Muhurat & Cosmic Decision Matrix",
        customerName: `${label} Seeker`,
        gender: "male",
      });
      const muhuratVisible = assertValidHtmlShell(muhuratHtml, `Case1-${label}-muhurat`);
      assert.ok(
        new RegExp(`\\b${label}\\b`, "i").test(muhuratVisible),
        `Case1-${label}-muhurat: Lagna ${label} missing`
      );
      assert.ok(
        !/Never accept equity investments[^.]*Tuesday \(Mars-ruled day\)/i.test(muhuratVisible),
        `Case1-${label}-muhurat: blacklists Tuesday (Lagnesh Mars day) for equity/loans`
      );
      assert.ok(
        !/Tuesday Mars Horas\s*·\s*Rikta Tithis/i.test(muhuratVisible),
        `Case1-${label}-muhurat: places Tuesday Mars Horas into AVOID column for Mars Lagnesh`
      );
      assert.ok(
        !/avoid taking retail delivery[^.]*on a Tuesday or during Mars Hora/i.test(muhuratVisible),
        `Case1-${label}-muhurat: blacklists Tuesday/Mars Hora for vehicle delivery`
      );

      const bioHtml = generatePackageDossierHTML(chart, {
        reportId: "pkg_bio_remedies",
        reportTitle: "Bio-Vedic Protection & Remedial Vault",
        customerName: `${label} Seeker`,
        gender: "male",
      });
      const bioVisible = assertValidHtmlShell(bioHtml, `Case1-${label}-bio`);
      assert.ok(
        /\bRed Coral\b|\bMoonga\b/i.test(bioVisible),
        `Case1-${label}-bio: Mars Lagnesh gemstone (Red Coral/Moonga) missing`
      );
    }
  });

  it("Case 2: Aquarius & Capricorn Lagnas do NOT prescribe Dusthana-co-ruling Mercury (6th/8th lord) as an unqualified secondary gemstone in Bio-Vedic Remedies", () => {
    const aquariusChart = getQaChart(QA_PROFILES[1]); // Deen-Dayal-Pal: Aquarius Lagna (Mercury rules 5th & 8th)
    const capricornChart = calculateChart("Capricorn Seeker", "1995-07-04", "20:15", "Delhi, India", 28.6139, 77.2090, 5.5);
    assert.equal(aquariusChart.lagnaRashi, "Aquarius");
    assert.equal(capricornChart.lagnaRashi, "Capricorn");

    for (const [label, chart] of [
      ["Aquarius", aquariusChart],
      ["Capricorn", capricornChart],
    ] as const) {
      const html = generatePackageDossierHTML(chart, {
        reportId: "pkg_bio_remedies",
        reportTitle: "Bio-Vedic Protection & Remedial Vault",
        customerName: `${label} Seeker`,
        gender: "male",
      });
      const visible = assertValidHtmlShell(html, `Case2-${label}`);

      const cleanedVisible = visible.replace(/\bEmerald\s+Green\b/gi, "");
      const sentences = cleanedVisible.split(/(?<=[.!?])\s+|\n+/);
      const contraindicationGuard =
        /\b(?:avoid|caution|contraindicated|prohibited|forbidden|do\s+not\s+wear|never\s+wear|not\s+recommended|dusthana|malefic|locked\s+out|withheld|ineligible|not\s+prescribed|skip|omitted|not\s+applicable|excluded|refrain|no\s+emerald|no\s+panna)\b/i;

      for (const sentence of sentences) {
        if (/\b(?:Emerald|Panna)\b/i.test(sentence)) {
          assert.ok(
            contraindicationGuard.test(sentence),
            `Case2-${label}: Dusthana-co-ruling Mercury prescribed unqualified Emerald/Panna: "${sentence.slice(0, 180)}"`
          );
        }
      }
    }
  });

  it("Case 3: Undefined gender produces gender-neutral lateralization (never silently defaults to Male Right/Dakshina) across gender-aware generators", () => {
    const baseChart = cloneChartWithoutGender(getQaChart(QA_PROFILES[3]));
    const genderAwareGens = GENERATORS.filter((g) => g.genderAwareExpected);

    for (const gen of genderAwareGens) {
      const html = generatePackageDossierHTML(baseChart, {
        reportId: gen.primaryReportId,
        reportTitle: gen.primaryTitle,
        customerName: "Neutral Seeker",
        gender: undefined,
      });
      const visible = assertValidHtmlShell(html, `Case3-${gen.key}`);

      const strippedPairs = stripDualGenderClauses(visible);

      assert.ok(
        !/\b(?:Dakshina\s+Anga|Right\s+wrist|Right\s+hand|Right\s+side|Right\s+Ring\s+Finger)\b/i.test(
          strippedPairs
        ),
        `Case3-${gen.key}: undefined gender silently defaulted to Male unilateral Right/Dakshina lateralization`
      );
      assert.ok(
        !/\b(?:Vama\s+Anga|Left\s+wrist|Left\s+hand|Left\s+side|Left\s+Ring\s+Finger)\b/i.test(
          strippedPairs
        ),
        `Case3-${gen.key}: undefined gender emitted unilateral Left/Vama lateralization`
      );
    }
  });

  it("Case 4: Empty dashas ([]) and expired all-inactive dashas do not throw and never fabricate any of the 8 non-Moon-NL planets across all 9 generators", () => {
    const base = getQaChart(QA_PROFILES[2]); // Manisha-Mehra (Moon.nakshatraLord === "Venus")
    assert.equal(base.planets.Moon.nakshatraLord, "Venus");

    const emptyDashasChart: ChartData = {
      ...cloneChartWithoutGender(base),
      dashas: [],
      antardasha: [],
    };
    const expiredInactiveDashasChart: ChartData = {
      ...cloneChartWithoutGender(base),
      dashas: [
        {
          planet: "Venus",
          start: "1900-01-01",
          end: "1910-01-01",
          yrs: 10,
          active: false,
        },
      ],
      antardasha: [],
    };

    for (const [subLabel, chartVariant] of [
      ["empty-dashas", emptyDashasChart],
      ["expired-inactive-dashas", expiredInactiveDashasChart],
    ] as const) {
      for (const gen of GENERATORS) {
        const html = generatePackageDossierHTML(chartVariant, {
          reportId: gen.primaryReportId,
          reportTitle: gen.primaryTitle,
          customerName: "Dasha Edge Seeker",
          gender: "female",
        });
        const visible = assertValidHtmlShell(html, `Case4-${subLabel}-${gen.key}`);

        const fabricated =
          /(?:CURRENT\s+OPERATING\s+DASHA|ACTIVE\s+MAHADASHA|ACTIVE\s+ANTARDASHA|ACTIVE\s+DASHA\s+PERIOD)\s*[:\-]?\s*(?:Rahu|Mercury|Saturn|Jupiter|Sun|Moon|Mars|Ketu)\b/i.test(
            visible
          ) ||
          /(?:CURRENT\s+OPERATING\s+DASHA|ACTIVE\s+DASHA\s+PERIOD)\s*[:\-]?\s*Venus\s*[–—-]\s*(?:Rahu|Mercury|Saturn|Jupiter|Sun|Moon|Mars|Ketu)\b/i.test(
            visible
          );
        assert.ok(
          !fabricated,
          `Case4-${subLabel}-${gen.key}: fabricated a non-Moon-NL active dasha planet instead of Unavailable / Pending or Venus`
        );
      }
    }
  });

  it("Case 5: Non-matching Kunda trine in Space Destiny does NOT output '100% Match' or 'No adjustment to birth time needed'", () => {
    const manishaChart = getQaChart(QA_PROFILES[2]);
    const kunda = calculateKunda(manishaChart.lagnaLon);
    // Verify pre-condition: Manisha's Kunda (Anuradha) is NOT in trine to Moon (Purva Phalguni)
    assert.notEqual(kunda.kundaLord, manishaChart.planets.Moon.nakshatraLord);

    const html = generatePackageDossierHTML(manishaChart, {
      reportId: "pkg_space_destiny",
      reportTitle: "Space Energy, Vastu, Palmistry & BTR",
      customerName: QA_PROFILES[2].name,
      gender: QA_PROFILES[2].gender,
    });
    const visible = assertValidHtmlShell(html, "Case5-KundaMismatch");

    assert.ok(
      !/100%\s*Match/i.test(visible),
      `Case5-KundaMismatch: falsely displayed "100% Match" when Kunda and Moon are non-trine`
    );
    assert.ok(
      !/No adjustment to birth time needed/i.test(visible),
      `Case5-KundaMismatch: falsely claimed "No adjustment to birth time needed" on non-trine Kunda`
    );
  });

  it("Case 6: Negative netWealthRetention (H11 < H12) in Raja Yoga Wealth never renders '+-'", () => {
    const libraChart = calculateChart("Deficit Native", "1995-07-04", "14:15", "Delhi, India", 28.6139, 77.2090, 5.5);
    const akv = calculateAshtakavarga(
      libraChart.planets as unknown as Parameters<typeof calculateAshtakavarga>[0],
      libraChart.lagnaNum
    );
    const h11 = akv.houses[10]?.score ?? 0;
    const h12 = akv.houses[11]?.score ?? 0;
    assert.ok(h11 < h12, `Precondition failed: expected H11 (${h11}) < H12 (${h12})`);
    const deficit = h11 - h12; // -3

    const html = generatePackageDossierHTML(libraChart, {
      reportId: "pkg_wealth_yogas",
      reportTitle: "Raja Yoga & Wealth Acceleration",
      customerName: "Deficit Native",
      gender: "male",
    });
    const visible = assertValidHtmlShell(html, "Case6-NegativeRetention");

    assert.ok(
      !visible.includes("+-"),
      `Case6-NegativeRetention: rendered malformed "+-" string for negative retention (${deficit})`
    );
    assert.ok(
      new RegExp(`${deficit}|${Math.abs(deficit)}\\s*Bindu\\s*Deficit`, "i").test(visible),
      `Case6-NegativeRetention: missing negative retention value (${deficit}) or deficit label`
    );
  });

  it("Case 7: Mono-dosha profiles (Bhanu Pitta/Tikshnagni & Deen Dayal Vata/Vishamagni) in Ayurvedic Medical never render Dual-Dosha/Pitta-Vata/Samagni", () => {
    const bhanuChart = getQaChart(QA_PROFILES[0]);
    const bhanuMed = calculateMedical(bhanuChart);
    assert.equal(bhanuMed.tridoshaBreakdown.dominant, "Pitta");
    assert.equal(bhanuMed.agniProfile.type, "Tikshnagni");

    const bhanuHtml = getMasterHtml(QA_PROFILES[0], GENERATORS[6]);
    const bhanuVisible = assertValidHtmlShell(bhanuHtml, "Case7-Bhanu");
    assert.ok(/\bPitta\b/.test(bhanuVisible), "Case7-Bhanu: missing Pitta");
    assert.ok(/\bTikshnagni\b/.test(bhanuVisible), "Case7-Bhanu: missing Tikshnagni");
    assert.ok(!/\bPitta-Vata\b/i.test(bhanuVisible), "Case7-Bhanu: leaked Pitta-Vata");
    assert.ok(!/\bDual-Dosha\b/i.test(bhanuVisible), "Case7-Bhanu: leaked Dual-Dosha");
    assert.ok(
      !/classified as\s*Samagni|Samagni\s*\(Balanced/i.test(bhanuVisible),
      "Case7-Bhanu: leaked Samagni classification"
    );

    const ddChart = getQaChart(QA_PROFILES[1]);
    const ddMed = calculateMedical(ddChart);
    assert.equal(ddMed.tridoshaBreakdown.dominant, "Vata");
    assert.equal(ddMed.agniProfile.type, "Vishamagni");

    const ddHtml = getMasterHtml(QA_PROFILES[1], GENERATORS[6]);
    const ddVisible = assertValidHtmlShell(ddHtml, "Case7-DeenDayal");
    assert.ok(/\bVata\b/.test(ddVisible), "Case7-DeenDayal: missing Vata");
    assert.ok(/\bVishamagni\b/.test(ddVisible), "Case7-DeenDayal: missing Vishamagni");
    assert.ok(!/\bPitta-Vata\b/i.test(ddVisible), "Case7-DeenDayal: leaked Pitta-Vata");
    assert.ok(!/\bDual-Dosha\b/i.test(ddVisible), "Case7-DeenDayal: leaked Dual-Dosha");
    assert.ok(
      !/classified as\s*Samagni|Samagni\s*\(Balanced/i.test(ddVisible),
      "Case7-DeenDayal: leaked Samagni classification"
    );
  });

  it("Case 8: Occupied 12th from Karakamsha (Bhanu-Pal: Rahu occupant vs Mars lord) in Jaimini Soul resolves unanimously to Rahu (Maa Durga)", () => {
    const bhanuChart = getQaChart(QA_PROFILES[0]);
    const jaimini = buildJaiminiChart(bhanuChart);
    const kl12Occ = jaimini.karakamsha.houses.find((h) => h.house === 12)?.planets || [];
    assert.deepEqual(kl12Occ, ["Rahu"]);

    const html = getMasterHtml(QA_PROFILES[0], GENERATORS[5]);
    const visible = assertValidHtmlShell(html, "Case8-Bhanu-KL12");

    assert.ok(
      /\bDurga\b|OM DUM DURGAYAI NAMAH/i.test(visible),
      "Case8-Bhanu-KL12: missing Rahu Ishta Devata (Maa Durga / Om Dum Durgayai Namah)"
    );
    assert.ok(
      !/Lord Hanuman\s*&\s*Sri Kartikeya/i.test(visible),
      "Case8-Bhanu-KL12: contradicted occupant Rahu with unoccupied 12th-lord Mars deity (Hanuman & Kartikeya)"
    );
  });

  it("Case 9: Non-H12 Moon profiles (Bhanu H1, Deen Dayal H1, Manisha H7) in Ayurvedic Medical never render the Moon-in-12th 16-day rice-burn sleep protocol", () => {
    for (const profile of QA_PROFILES.filter((p) => p.expectedMoonHouse !== 12)) {
      const html = getMasterHtml(profile, GENERATORS[6]);
      const visible = assertValidHtmlShell(html, `Case9-${profile.slug}`);

      assert.ok(
        !/FOR 12TH HOUSE MOON/i.test(visible) &&
          !/16 small packets[^.]*whole raw white rice/i.test(visible) &&
          !/16-DAY BURN & FLOW PROTOCOL/i.test(visible),
        `Case9-${profile.slug} (Moon H${profile.expectedMoonHouse}): leaked Moon-in-12th 16-day rice-burn sleep protocol`
      );
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 3 — Cross-Chart Leakage, Uniqueness & Static Audit
// ─────────────────────────────────────────────────────────────────────────────

describe("Tier 3 — Mukul-Leak Exclusion, Cross-Chart Uniqueness & Static Audit", () => {
  const nonMukulProfiles = QA_PROFILES.filter((p) => p.slug !== "Mukul-Mohan-Pal");

  const unconditionalMukulLeaks: ReadonlyArray<{ label: string; pattern: RegExp }> = [
    { label: "Mirage Syndrome", pattern: /Mirage Syndrome/i },
    {
      label: "Surya Hora Mercury/Venus leak",
      pattern: /Having both your Lagna lord Mercury and 9th lord Venus in Surya Hora/i,
    },
    {
      label: "Venus 2nd/9th Libra/Taurus leak",
      pattern: /Venus governs both the 2nd house of treasury \(Libra\) and the 9th house of sovereign fortune \(Taurus\)/i,
    },
    {
      label: "Saturn seated in Pisces zone leak",
      pattern: /Saturn seated in Pisces here requires this zone/i,
    },
    { label: "10th house Gemini cluster", pattern: /10th house Gemini cluster/i },
    { label: "agitate Rahu's 2nd-house axis", pattern: /agitate Rahu's 2nd-house axis/i },
    { label: "2017 – 2035 Cycle", pattern: /2017\s*[–-]\s*2035/i },
    { label: "9th House Exch", pattern: /9th House Exch/i },
    { label: "Post Age 28", pattern: /Post Age 28/i },
    { label: "Kustha Root Powder", pattern: /Kustha Root Powder/i },
    {
      label: "Mulethi personal prescription leak",
      pattern: /Kustha\s+Root\s+Powder[^.]*Mulethi|Mulethi\s+on\s+Thursday\s+mornings|\(Kustha\/Mulethi\)/i,
    },
    { label: "Solar Ascendancy in Virgo", pattern: /Solar Ascendancy in Virgo/i },
    { label: "Indu Lagna Lord (Capricorn)", pattern: /Indu Lagna Lord \(Capricorn\)/i },
    { label: "Mukul DOB 1995-07-04", pattern: /1995-07-04/ },
    { label: "Virgo Lagna bleed", pattern: /Virgo Lagna/i },
  ];

  it("zero Mukul-specific leaks appear on any non-Mukul chart across all 9 generators", () => {
    for (const profile of nonMukulProfiles) {
      const chart = getQaChart(profile);
      const sb = calculateSarvatobhadraGrid(chart.planets.Moon.nakshatra);

      for (const gen of GENERATORS) {
        const html = getMasterHtml(profile, gen);
        const visible = getCachedVisibleText(profile, gen);
        const svgText = extractSvgText(html);
        const scanText = svgText ? `${visible}\n${svgText}` : visible;
        const ctx = `${profile.slug} / ${gen.key}`;

        for (const leak of unconditionalMukulLeaks) {
          assert.ok(
            !leak.pattern.test(scanText),
            `${ctx}: leaked Mukul phrase "${leak.label}"`
          );
        }

        // Conditional Mukul leaks:
        if (profile.expectedAd !== "Mercury") {
          assert.ok(
            !/\(Budh\)/i.test(scanText),
            `${ctx}: leaked "(Budh)" on non-Mercury AD (${profile.expectedAd})`
          );
        }

        if (profile.expectedLagnesh !== "Mercury") {
          assert.ok(
            !/green fodder to a Desi Cow/i.test(scanText),
            `${ctx}: leaked Mercury Desi Cow green fodder on ${profile.expectedLagnesh} Lagnesh`
          );
        }

        if (profile.expectedMoonHouse !== 12) {
          assert.ok(
            !/16 small packets[^.]*whole raw white rice/i.test(scanText),
            `${ctx}: leaked 12th-house Moon 16-day rice protocol`
          );
        }

        if (gen.key === "bio_remedies" && profile.expectedLagna !== "Virgo") {
          // Kalapurusha table must NOT highlight Virgo (Kanya) row with emerald/active background
          const virgoRowMatch = html.match(/<tr[^>]*>[\s\S]{0,180}Virgo \(Kanya\)[\s\S]{0,180}<\/tr>/i);
          if (virgoRowMatch) {
            assert.ok(
              !/rgba\(16,\s*185,\s*129|var\(--emerald|background:\s*rgba\(16/i.test(virgoRowMatch[0]),
              `${ctx}: Kalapurusha table highlights Virgo (Kanya) on non-Virgo Lagna (${profile.expectedLagna})`
            );
          }
        }

        if (gen.key === "stock_trading" && sb.vedhaRays.length > 0) {
          assert.ok(
            !/0 Malefic Strikes/i.test(visible) && !/\bZero Strikes\b/i.test(visible),
            `${ctx}: hardcoded "0 Malefic Strikes" / "Zero Strikes" despite ${sb.vedhaRays.length} computed Vedha rays`
          );
        }
      }
    }
  });

  for (const gen of GENERATORS) {
    it(`cross-chart uniqueness thresholds — ${gen.key} (sentences >=70% unique, <=15% identicalAll4; prose <=15% identicalAll4; <3 consecutive identical <p>)`, () => {
      const sentenceSets = QA_PROFILES.map((p) => new Set(extractSentences(getCachedVisibleText(p, gen))));
      const paragraphLists = QA_PROFILES.map((p) => extractProseParagraphs(getMasterHtml(p, gen)));
      const paragraphSets = paragraphLists.map((list) => new Set(list));

      // Sentence uniqueness
      const allSentences = new Set<string>();
      for (const sSet of sentenceSets) {
        for (const s of sSet) allSentences.add(s);
      }
      const totalDistinct = allSentences.size;
      assert.ok(totalDistinct > 20, `${gen.key}: expected >20 distinct sentences, got ${totalDistinct}`);

      let uniqueToOne = 0;
      let identicalAll4 = 0;
      for (const s of allSentences) {
        let count = 0;
        for (const sSet of sentenceSets) {
          if (sSet.has(s)) count += 1;
        }
        if (count === 1) uniqueToOne += 1;
        if (count === QA_PROFILES.length) identicalAll4 += 1;
      }

      const uniqueToOnePct = (uniqueToOne / totalDistinct) * 100;
      const identicalAll4Pct = (identicalAll4 / totalDistinct) * 100;

      // Prose paragraph uniqueness
      const allParagraphs = new Set<string>();
      for (const pSet of paragraphSets) {
        for (const p of pSet) allParagraphs.add(p);
      }
      let proseIdenticalAll4 = 0;
      for (const p of allParagraphs) {
        if (paragraphSets.every((s) => s.has(p))) {
          proseIdenticalAll4 += 1;
        }
      }
      const proseIdenticalAll4Pct =
        allParagraphs.size > 0 ? (proseIdenticalAll4 / allParagraphs.size) * 100 : 0;

      assert.ok(
        uniqueToOnePct >= 70,
        `${gen.key}: uniqueToOnePct=${uniqueToOnePct.toFixed(1)}% is below 70% (${uniqueToOne}/${totalDistinct})`
      );
      assert.ok(
        identicalAll4Pct <= 15,
        `${gen.key}: identicalAll4Pct=${identicalAll4Pct.toFixed(1)}% exceeds 15% (${identicalAll4}/${totalDistinct})`
      );
      assert.ok(
        proseIdenticalAll4Pct <= 15,
        `${gen.key}: proseIdenticalAll4Pct=${proseIdenticalAll4Pct.toFixed(1)}% exceeds 15% (${proseIdenticalAll4}/${allParagraphs.size})`
      );
      assert.ok(
        !hasConsecutiveIdenticalParagraphs(paragraphLists, 3),
        `${gen.key}: contains 3+ consecutive identical <p> paragraphs across all 4 profiles`
      );
    });
  }

  it("static source scan across all 9 generators finds zero hardcoded Mukul leaks or broken engine field accesses", () => {
    const generatorsDir = path.resolve(__dirname, "generators");
    const staticPatterns: ReadonlyArray<{ label: string; regex: RegExp; exclude?: RegExp }> = [
      { label: "hardcoded 1995-07-04", regex: /1995-07-04/ },
      { label: "hardcoded 2017–2035", regex: /2017\s*[–-]\s*2035|2017\s*&[nm]dash;\s*2035/ },
      {
        label: "hardcoded Year 2026 / 2026-2031 / 2026-2027 literal",
        regex: /\bYear\s+2026\b|2026\s*(?:[–-]|&[nm]dash;)\s*(?:2031|2027)\b/i,
        exclude: /\$\{/,
      },
      { label: "hardcoded (Budh)", regex: /\(Budh\)/ },
      { label: "hardcoded Post Age 28", regex: /Post Age 28/ },
      { label: "hardcoded 0 Malefic Strikes", regex: /0 Malefic Strikes/ },
      { label: "hardcoded Kustha Root Powder", regex: /Kustha Root Powder/ },
      { label: "hardcoded 9th House Exch", regex: /9th House Exch/ },
      { label: "hardcoded Mirage Syndrome", regex: /Mirage Syndrome/ },
      { label: "hardcoded 10th house Gemini cluster", regex: /10th house Gemini cluster/ },
      { label: "hardcoded Saturn seated in Pisces", regex: /Saturn seated in Pisces/ },
      { label: "hardcoded Rahu's 2nd-house axis", regex: /Rahu's 2nd-house axis/ },
      { label: "hardcoded Surya Hora Mercury, Venus, Rahu, Ketu", regex: /Mercury,\s*Venus,\s*Rahu,\s*Ketu/ },
      { label: "hardcoded Venus 2nd Libra 9th Taurus", regex: /Venus governs both the 2nd house of treasury \(Libra\)/ },
      { label: "hardcoded Solar Ascendancy in Virgo", regex: /Solar Ascendancy in Virgo/ },
      { label: "hardcoded Indu Lagna Lord (Capricorn)", regex: /Indu Lagna Lord \(Capricorn\)/ },
      { label: "hardcoded 2027 - dobYear", regex: /2027\s*-\s*dobYear/ },
      { label: "broken .longitude access", regex: /\b\w+\??\.longitude\b/ },
      { label: "broken .antardashas access", regex: /\b\w+\??\.antardashas\b/ },
      { label: "broken chart.antardasha?.planet access", regex: /chart\.antardasha\??\.planet\b/ },
      { label: "broken moonPlanet?.lord access", regex: /moonPlanet\??\.lord\b/ },
      {
        label: "broken planet .isRetrograde access",
        regex: /\.\s*isRetrograde\b/,
        exclude: /\b(?:interface|type)\b|\bcustomPlanets\b|isRetrograde\??\s*:\s*boolean|\bray\.isRetrograde\b|VedhaRay|\bconst\s+isRetrograde\b|\.retrograde\b[^;\n]*\|\|[^;\n]*\.isRetrograde\b/,
      },
      { label: "fixed numeric akv.sarva[N] index", regex: /\b(?:akv|av)\w*\??\.sarva\[\s*\d+\s*\]/ },
      {
        label: "hardcoded moonNakshatra Pada (1)",
        regex: /\$\{moonNakshatra\}\s*(?:\(\s*1\s*\)|1\s*\))|\$\{moonNakshatra\}[^`\n]{0,12}\bPada\s*1\b/,
      },
      {
        label: "undefined gender silent fallback to male",
        regex: /options\.gender\s*\|\|\s*\(chart[^)]*\)\.gender\s*\|\|\s*["']male["']/,
      },
    ];

    const hits: string[] = [];
    for (const gen of GENERATORS) {
      const filePath = path.join(generatorsDir, gen.fileName);
      const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
        for (const p of staticPatterns) {
          if (p.regex.test(line) && !(p.exclude && p.exclude.test(line))) {
            hits.push(`${gen.fileName}:${idx + 1} [${p.label}]`);
          }
        }
      });
    }

    assert.equal(
      hits.length,
      0,
      `Static scan found ${hits.length} violation(s):\n${hits.slice(0, 30).join("\n")}`
    );
  });

  it("QA fixture guard: scripts/generate-4chart-qa-suite.ts and scripts/generate-4chart-single-reports.ts preserve Manisha Mehra TOB 12:30 IST", () => {
    const scriptsDir = path.resolve(__dirname, "../../../scripts");
    for (const scriptName of [
      "generate-4chart-qa-suite.ts",
      "generate-4chart-single-reports.ts",
    ]) {
      const content = fs.readFileSync(path.join(scriptsDir, scriptName), "utf8");
      const manishaBlock = content.match(
        /slug:\s*"Manisha-Mehra"[\s\S]{0,250}tob:\s*"([^"]+)"/
      );
      assert.ok(manishaBlock, `${scriptName}: Manisha-Mehra profile block not found`);
      assert.equal(
        manishaBlock[1],
        "12:30",
        `${scriptName}: expected Manisha Mehra tob "12:30", found "${manishaBlock[1]}"`
      );
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TIER 4 — Real-World 4-Profile Full Matrix Scenarios & Isolation
// ─────────────────────────────────────────────────────────────────────────────

describe("Tier 4 — Real-World 4-Profile Full 30-Report Matrix & Zero Cross-Chart Contamination", () => {
  const catalog30 = CATALOG_ROUTES.filter((r) => r.category !== "alias");

  for (const profile of QA_PROFILES) {
    it(`Scenario (${profile.slug}): renders all 30 catalog reports cleanly with strict chart isolation`, () => {
      const chart = getQaChart(profile);
      const genMap = new Map(GENERATORS.map((g) => [g.key, g]));

      for (const route of catalog30) {
        const targetGen = genMap.get(route.expectedGenerator)!;
        const html =
          route.reportId === targetGen.primaryReportId &&
          route.reportTitle === targetGen.primaryTitle
            ? getMasterHtml(profile, targetGen)
            : generatePackageDossierHTML(chart, {
                reportId: route.reportId,
                reportTitle: route.reportTitle,
                customerName: profile.name,
                isSample: false,
                orderId: `T4-${profile.slug}-${route.reportId}`,
                paymentId: `PAY-${profile.slug}-${route.reportId}`,
                gender: profile.gender,
              });

        const visible = assertValidHtmlShell(html, `Tier4-${profile.slug}-${route.reportId}`);
        const svgText = extractSvgText(html);
        const scanText = svgText ? `${visible}\n${svgText}` : visible;

        // Own core identity must be present
        assert.ok(
          new RegExp(`\\b${profile.expectedLagna}\\b`, "i").test(visible),
          `Tier4-${profile.slug}-${route.reportId}: missing own Lagna ${profile.expectedLagna}`
        );
        assert.ok(
          new RegExp(`\\b${profile.expectedMoonNak}\\b`, "i").test(visible),
          `Tier4-${profile.slug}-${route.reportId}: missing own Moon Nakshatra ${profile.expectedMoonNak}`
        );

        // Cross-chart exclusive identity isolation on core profile headers (including SVG text)
        if (profile.slug !== "Bhanu-Pal") {
          assert.ok(
            !/Sagittarius Lagna/i.test(scanText),
            `Tier4-${profile.slug}-${route.reportId}: Bhanu's "Sagittarius Lagna" bled in`
          );
        }
        if (profile.slug !== "Mukul-Mohan-Pal") {
          assert.ok(
            !/Virgo Lagna/i.test(scanText) &&
              !/1995-07-04/.test(scanText) &&
              !/2017\s*[–-]\s*2035/i.test(scanText),
            `Tier4-${profile.slug}-${route.reportId}: Mukul's "Virgo Lagna", "1995-07-04", or "2017–2035" bled in`
          );
        }
        if (targetGen.genderAwareExpected) {
          const textWithoutNeutralPairs = stripDualGenderClauses(visible);
          if (profile.gender === "female") {
            assert.ok(
              /\b(?:Vama\s+Anga|Left\s+(?:wrist|hand|side|ring\s+finger))\b/i.test(visible),
              `Tier4-${profile.slug}-${route.reportId}: female lateralization missing`
            );
            assert.ok(
              !/\b(?:Dakshina\s+Anga|Right\s+wrist|Right\s+hand|Right\s+side|Right\s+Ring\s+Finger|Right\s*\(male\))\b/i.test(
                textWithoutNeutralPairs
              ),
              `Tier4-${profile.slug}-${route.reportId}: female chart leaked male-only Right / Dakshina lateralization`
            );
          } else {
            assert.ok(
              !/\b(?:Vama\s+Anga|Left\s+wrist|Left\s+hand|Left\s+side|Left\s+Ring\s+Finger|Left\s*\(female\))\b/i.test(
                textWithoutNeutralPairs
              ),
              `Tier4-${profile.slug}-${route.reportId}: male chart leaked female-only Left / Vama lateralization`
            );
          }
        }
      }
    });
  }
});
