/**
 * ============================================================================
 * ASTROLIFE — 4-CHART QA AUDIT CLI (Tiers 1, 3, Static Scan & Fixture Check)
 * ============================================================================
 * Run via:
 *   node --import jiti/register scripts/verify-4chart-qa-audit.ts
 *
 * Uses relative imports only (no @/ path aliases) for offline jiti execution.
 * Exits 0 if 100% clean across all 33 catalog IDs x 4 profiles + fallback,
 * Tier 1 identity, Tier 3 Mukul-leak & uniqueness thresholds, static source
 * scan, and Manisha Mehra 12:30 IST fixture check; exits 1 otherwise.
 * ============================================================================
 */

import fs from "node:fs";
import path from "node:path";

import { calculateChart, type ChartData } from "../src/lib/astro-engine/calculations";
import { calculateSarvatobhadraGrid } from "../src/lib/astro-engine/sarvatobhadra-grid";
import { generatePackageDossierHTML } from "../src/lib/report/package-dossier-html-generator";

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

  // 22 Single & Flagship Reports
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

function extractTitleText(html: string): string {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? decodeHtmlEntities(m[1]).trim() : "";
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

function maxConsecutiveIdenticalParagraphs(paragraphLists: string[][]): number {
  if (paragraphLists.length < 2) return 0;
  const sets = paragraphLists.slice(1).map((list) => new Set(list));
  let maxRun = 0;
  let consecutive = 0;
  for (const p of paragraphLists[0]) {
    if (sets.every((s) => s.has(p))) {
      consecutive += 1;
      if (consecutive > maxRun) maxRun = consecutive;
    } else {
      consecutive = 0;
    }
  }
  return maxRun;
}

function collectIdentityIssues(
  profile: TestProfile,
  gen: GeneratorSpec,
  html: string,
  visibleText: string
): string[] {
  const issues: string[] = [];

  if (html.length <= 5000) issues.push(`HTML too short (${html.length})`);
  if (!/<!DOCTYPE html>|<html[\s>]/i.test(html) || !/<\/html>/i.test(html)) {
    issues.push("invalid HTML shell");
  }
  if (/\bNaN\b/.test(visibleText)) issues.push("contains NaN");
  if (/\bundefined\b/.test(visibleText)) issues.push("contains undefined");

  if (!new RegExp(`\\b${escapeRegExp(profile.expectedLagna)}\\b`, "i").test(visibleText)) {
    issues.push(`missing Lagna(${profile.expectedLagna})`);
  }
  if (!new RegExp(`\\b${escapeRegExp(profile.expectedLagnesh)}\\b`, "i").test(visibleText)) {
    issues.push(`missing Lagnesh(${profile.expectedLagnesh})`);
  }
  if (!new RegExp(`\\b${escapeRegExp(profile.expectedMoonSign)}\\b`, "i").test(visibleText)) {
    issues.push(`missing MoonSign(${profile.expectedMoonSign})`);
  }
  const nakEsc = escapeRegExp(profile.expectedMoonNak);
  if (!new RegExp(`\\b${nakEsc}\\b`, "i").test(visibleText)) {
    issues.push(`missing MoonNak(${profile.expectedMoonNak})`);
  }
  const padaNum = profile.expectedMoonPada;
  const padaContextRegex = new RegExp(
    `${nakEsc}[^.\\n]{0,45}(?:Pada\\s*${padaNum}\\b|\\(P?${padaNum}\\)|\\bP${padaNum}\\b|(?:^|[\\s·,(])${padaNum}\\b(?![-–%]))|` +
      `Pada\\s*${padaNum}\\b[^.\\n]{0,45}${nakEsc}|` +
      `Moon\\s+Nakshatra[^.\\n]{0,70}(?:Pada\\s*${padaNum}\\b|\\(P?${padaNum}\\)|\\bP${padaNum}\\b)`,
    "i"
  );
  if (!padaContextRegex.test(visibleText)) {
    issues.push(`missing Pada(${padaNum})`);
  }
  if (padaNum !== 1) {
    const wrongPada1 = new RegExp(
      `${nakEsc}\\s*(?:\\(1\\)|\\(P1\\)|\\(Pada\\s*1\\)|·\\s*Pada\\s*1\\b|·\\s*P1\\b|\\bPada\\s*1\\b|\\bP1\\b|1\\))`,
      "i"
    );
    if (wrongPada1.test(visibleText)) {
      issues.push(`wrong Pada(1 instead of ${padaNum})`);
    }
  }

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
  if (!mdRegex.test(visibleText)) issues.push(`missing MD(${profile.expectedMd})`);
  if (!adRegex.test(visibleText)) issues.push(`missing AD(${profile.expectedAd})`);
  if (profile.expectedAd !== "Mercury" && /\(Budh\)/i.test(visibleText)) {
    issues.push("leaked (Budh)");
  }

  const expectedAge = computeExpectedAge(profile.dob);
  const ageRegex = new RegExp(
    `\\b(?:Age|Seeker\\s+Age|Current\\s+Age|Native\\s+Age)\\D{0,25}\\b${expectedAge}\\b|` +
      `\\b${expectedAge}\\s*(?:yrs?|years?(?:\\s*old)?)\\b`,
    "i"
  );
  if (!ageRegex.test(visibleText)) {
    issues.push(`missing Age(${expectedAge})`);
  }

  if (gen.genderAwareExpected) {
    const textWithoutNeutralPairs = stripDualGenderClauses(visibleText);

    if (profile.gender === "female") {
      if (!/\b(?:Left\s+(?:wrist|hand|side|ring\s+finger)|Vama\s+Anga)\b/i.test(visibleText)) {
        issues.push("missing Left/Vama");
      }
      if (
        /\b(?:Dakshina\s+Anga|Right\s+wrist|Right\s+hand|Right\s+side|Right\s+Ring\s+Finger|Right\s*\(male\))\b/i.test(
          textWithoutNeutralPairs
        )
      ) {
        issues.push("leaked Male Right/Dakshina");
      }
    } else {
      if (!/\b(?:Right\s+(?:wrist|hand|side|ring\s+finger)|Dakshina\s+Anga)\b/i.test(visibleText)) {
        issues.push("missing Right/Dakshina");
      }
      if (
        /\b(?:Vama\s+Anga|Left\s+wrist|Left\s+hand|Left\s+side|Left\s+Ring\s+Finger|Left\s*\(female\))\b/i.test(
          textWithoutNeutralPairs
        )
      ) {
        issues.push("leaked Female Left/Vama");
      }
    }
  }

  return issues;
}

function padRight(str: string, width: number): string {
  return str.length >= width ? str : str + " ".repeat(width - str.length);
}

function main(): void {
  const repoRoot = path.resolve(__dirname, "..");
  const genMap = new Map(GENERATORS.map((g) => [g.key, g]));
  const charts = new Map<string, ChartData>();
  const masterHtml = new Map<string, string>();
  const masterVisible = new Map<string, string>();

  let totalViolations = 0;

  console.log("==========================================================================================");
  console.log("ASTROLIFE 4-CHART QA AUDIT SUMMARY (33 Catalog IDs x 4 Profiles + Fallback + Static Scan)");
  console.log("==========================================================================================\n");

  for (const profile of QA_PROFILES) {
    charts.set(
      profile.slug,
      calculateChart(
        profile.name,
        profile.dob,
        profile.tob,
        profile.place,
        profile.lat,
        profile.lng,
        profile.tz
      )
    );
  }

  // ── 1. ROUTER TABLE ───────────────────────────────────────────────────────
  console.log("1) ROUTER VERIFICATION (8 Master + 3 SEO Aliases + 22 Single = 33 IDs x 4 Profiles = 132 + 4 Fallback)");
  console.log("------------------------------------------------------------------------------------------");
  console.log(
    `${padRight("Category", 8)} | ${padRight("Report ID", 28)} | ${padRight("Target Generator", 18)} | Status`
  );
  console.log("-".repeat(90));

  let routerTotal = 0;
  let routerPassed = 0;

  for (const route of CATALOG_ROUTES) {
    const targetGen = genMap.get(route.expectedGenerator)!;
    const routeFailures: string[] = [];

    for (const profile of QA_PROFILES) {
      routerTotal += 1;
      const chart = charts.get(profile.slug)!;
      const html = generatePackageDossierHTML(chart, {
        reportId: route.reportId,
        reportTitle: route.reportTitle,
        customerName: profile.name,
        isSample: false,
        orderId: `AUDIT-${profile.slug}-${route.reportId}`,
        paymentId: `PAY-${profile.slug}-${route.reportId}`,
        gender: profile.gender,
      });

      if (
        route.reportId === targetGen.primaryReportId &&
        route.reportTitle === targetGen.primaryTitle
      ) {
        const key = `${profile.slug}::${targetGen.key}`;
        masterHtml.set(key, html);
        masterVisible.set(key, stripHtmlToVisibleText(html));
      }

      const title = extractTitleText(html);
      const validShell =
        html.length > 5000 &&
        /<!DOCTYPE html>|<html[\s>]/i.test(html) &&
        /<\/html>/i.test(html);
      const titleMatch = targetGen.titlePattern.test(title);

      if (validShell && titleMatch) {
        routerPassed += 1;
      } else {
        routeFailures.push(`${profile.slug}(${!validShell ? "shell" : `title="${title}"`})`);
        totalViolations += 1;
      }
    }

    const status = routeFailures.length === 0 ? "PASS (4/4)" : `FAIL: ${routeFailures.join(", ")}`;
    console.log(
      `${padRight(route.category, 8)} | ${padRight(route.reportId, 28)} | ${padRight(route.expectedGenerator, 18)} | ${status}`
    );
  }

  // 4 Fallback checks
  const fallbackFailures: string[] = [];
  let fallbackPassed = 0;
  for (const profile of QA_PROFILES) {
    const chart = charts.get(profile.slug)!;
    const html = generatePackageDossierHTML(chart, {
      reportId: "unknown_custom_pkg_999",
      reportTitle: "Unrecognized Custom Package",
      customerName: profile.name,
      isSample: false,
      gender: profile.gender,
    });
    const visible = stripHtmlToVisibleText(html);
    const title = extractTitleText(html);
    const ok =
      html.length > 5000 &&
      /Unrecognized Custom Package/i.test(title) &&
      new RegExp(`\\b${profile.expectedLagna}\\b`, "i").test(visible) &&
      !/\bNaN\b|\bundefined\b/.test(visible);
    if (ok) {
      fallbackPassed += 1;
    } else {
      fallbackFailures.push(profile.slug);
      totalViolations += 1;
    }
  }
  console.log(
    `${padRight("fallback", 8)} | ${padRight("unknown_custom_pkg_999", 28)} | ${padRight("fallback_template", 18)} | ${
      fallbackFailures.length === 0 ? "PASS (4/4)" : `FAIL: ${fallbackFailures.join(", ")}`
    }`
  );
  console.log(
    `Router Summary: ${routerPassed}/${routerTotal} catalog routes passed, ${fallbackPassed}/4 fallback checks passed.\n`
  );

  // ── 2. PER-GENERATOR TIER 1 IDENTITY PASS/FAIL MATRIX ─────────────────────
  console.log("2) PER-GENERATOR TIER 1 IDENTITY MATRIX (4 QA Profiles)");
  console.log("------------------------------------------------------------------------------------------");
  for (const gen of GENERATORS) {
    let passCount = 0;
    const perProfileSummaries: string[] = [];

    for (const profile of QA_PROFILES) {
      const key = `${profile.slug}::${gen.key}`;
      const html = masterHtml.get(key)!;
      const visible = masterVisible.get(key)!;
      const issues = collectIdentityIssues(profile, gen, html, visible);
      if (issues.length === 0) {
        passCount += 1;
        perProfileSummaries.push(`  - ${padRight(profile.slug, 16)}: PASS`);
      } else {
        totalViolations += issues.length;
        perProfileSummaries.push(`  - ${padRight(profile.slug, 16)}: FAIL [${issues.join("; ")}]`);
      }
    }

    console.log(`${gen.key} (${gen.fileName}) -> ${passCount}/4 profiles clean`);
    for (const line of perProfileSummaries) {
      console.log(line);
    }
  }
  console.log("");

  // ── 3. CROSS-CHART UNIQUENESS TABLE ───────────────────────────────────────
  console.log("3) CROSS-CHART UNIQUENESS MATRIX (Thresholds: uniqueToOne >= 70%, identicalAll4 <= 15%, proseAll4 <= 15%, maxRun < 3)");
  console.log("------------------------------------------------------------------------------------------");
  console.log(
    `${padRight("Generator", 19)} | ${padRight("Distinct", 8)} | ${padRight("Unique1%", 9)} | ${padRight("All4%", 7)} | ${padRight("ProseAll4%", 10)} | ${padRight("MaxRun", 6)} | Status`
  );
  console.log("-".repeat(90));

  for (const gen of GENERATORS) {
    const sentenceSets = QA_PROFILES.map(
      (p) => new Set(extractSentences(masterVisible.get(`${p.slug}::${gen.key}`)!))
    );
    const paragraphLists = QA_PROFILES.map((p) =>
      extractProseParagraphs(masterHtml.get(`${p.slug}::${gen.key}`)!)
    );
    const paragraphSets = paragraphLists.map((list) => new Set(list));

    const allSentences = new Set<string>();
    for (const sSet of sentenceSets) {
      for (const s of sSet) allSentences.add(s);
    }
    const totalDistinct = allSentences.size;
    let uniqueToOne = 0;
    let identicalAll4 = 0;
    for (const s of allSentences) {
      let c = 0;
      for (const sSet of sentenceSets) {
        if (sSet.has(s)) c += 1;
      }
      if (c === 1) uniqueToOne += 1;
      if (c === QA_PROFILES.length) identicalAll4 += 1;
    }

    const uniqueToOnePct = totalDistinct > 0 ? (uniqueToOne / totalDistinct) * 100 : 0;
    const identicalAll4Pct = totalDistinct > 0 ? (identicalAll4 / totalDistinct) * 100 : 0;

    const allParagraphs = new Set<string>();
    for (const pSet of paragraphSets) {
      for (const p of pSet) allParagraphs.add(p);
    }
    let proseIdenticalAll4 = 0;
    for (const p of allParagraphs) {
      if (paragraphSets.every((s) => s.has(p))) proseIdenticalAll4 += 1;
    }
    const proseIdenticalAll4Pct =
      allParagraphs.size > 0 ? (proseIdenticalAll4 / allParagraphs.size) * 100 : 0;
    const maxRun = maxConsecutiveIdenticalParagraphs(paragraphLists);

    const pass =
      totalDistinct > 20 &&
      uniqueToOnePct >= 70 &&
      identicalAll4Pct <= 15 &&
      proseIdenticalAll4Pct <= 15 &&
      maxRun < 3;

    if (!pass) totalViolations += 1;

    console.log(
      `${padRight(gen.key, 19)} | ${padRight(String(totalDistinct), 8)} | ${padRight(
        `${uniqueToOnePct.toFixed(1)}%`,
        9
      )} | ${padRight(`${identicalAll4Pct.toFixed(1)}%`, 7)} | ${padRight(
        `${proseIdenticalAll4Pct.toFixed(1)}%`,
        10
      )} | ${padRight(String(maxRun), 6)} | ${pass ? "PASS" : "FAIL"}`
    );
  }
  console.log("");

  // ── 4. MUKUL-LEAK DETECTIONS PER NON-MUKUL CHART & GENERATOR ──────────────
  console.log("4) MUKUL-LEAK DETECTIONS ON NON-MUKUL CHARTS");
  console.log("------------------------------------------------------------------------------------------");

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

  const nonMukulProfiles = QA_PROFILES.filter((p) => p.slug !== "Mukul-Mohan-Pal");
  let leakCount = 0;

  for (const profile of nonMukulProfiles) {
    const chart = charts.get(profile.slug)!;
    const sb = calculateSarvatobhadraGrid(chart);

    for (const gen of GENERATORS) {
      const key = `${profile.slug}::${gen.key}`;
      const html = masterHtml.get(key)!;
      const visible = masterVisible.get(key)!;
      const svgText = extractSvgText(html);
      const scanText = svgText ? `${visible}\n${svgText}` : visible;
      const detected: string[] = [];

      for (const leak of unconditionalMukulLeaks) {
        if (leak.pattern.test(scanText)) detected.push(leak.label);
      }
      if (profile.expectedAd !== "Mercury" && /\(Budh\)/i.test(scanText)) {
        detected.push(`(Budh) on ${profile.expectedAd} AD`);
      }
      if (profile.expectedLagnesh !== "Mercury" && /green fodder to a Desi Cow/i.test(scanText)) {
        detected.push(`Desi Cow green fodder on ${profile.expectedLagnesh} Lagnesh`);
      }
      if (profile.expectedMoonHouse !== 12 && /16 small packets[^.]*whole raw white rice/i.test(scanText)) {
        detected.push("12th-house Moon 16-day rice protocol");
      }
      if (gen.key === "bio_remedies" && profile.expectedLagna !== "Virgo") {
        const virgoRowMatch = html.match(/<tr[^>]*>[\s\S]{0,180}Virgo \(Kanya\)[\s\S]{0,180}<\/tr>/i);
        if (
          virgoRowMatch &&
          /rgba\(16,\s*185,\s*129|var\(--emerald|background:\s*rgba\(16/i.test(virgoRowMatch[0])
        ) {
          detected.push("Virgo Kalapurusha green highlight");
        }
      }
      if (
        gen.key === "stock_trading" &&
        sb.vedhaRays.length > 0 &&
        (/0 Malefic Strikes/i.test(visible) || /\bZero Strikes\b/i.test(visible))
      ) {
        detected.push(`0 Malefic Strikes / Zero Strikes (computed vedhaRays=${sb.vedhaRays.length})`);
      }

      if (detected.length > 0) {
        leakCount += detected.length;
        totalViolations += detected.length;
        console.log(`  - ${padRight(profile.slug, 16)} / ${padRight(gen.key, 18)}: ${detected.join(", ")}`);
      }
    }
  }
  if (leakCount === 0) {
    console.log("  PASS: Zero Mukul leaks detected on Bhanu-Pal, Deen-Dayal-Pal, or Manisha-Mehra.");
  }
  console.log("");

  // ── 5. STATIC SOURCE SCAN ACROSS src/lib/report/generators/*.ts ───────────
  console.log("5) STATIC SOURCE SCAN (src/lib/report/generators/*.ts)");
  console.log("------------------------------------------------------------------------------------------");
  const generatorsDir = path.join(repoRoot, "src/lib/report/generators");
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

  const staticHits: string[] = [];
  for (const gen of GENERATORS) {
    const filePath = path.join(generatorsDir, gen.fileName);
    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;
      for (const p of staticPatterns) {
        if (p.regex.test(line) && !(p.exclude && p.exclude.test(line))) {
          staticHits.push(`${gen.fileName}:${idx + 1} [${p.label}]`);
        }
      }
    });
  }

  if (staticHits.length === 0) {
    console.log("  PASS: Zero static violations found across all 9 generator files.");
  } else {
    totalViolations += staticHits.length;
    console.log(`  FAIL: ${staticHits.length} static violation(s) found:`);
    for (const hit of staticHits) {
      console.log(`    - ${hit}`);
    }
  }
  console.log("");

  // ── 6. MANISHA MEHRA TOB 12:30 FIXTURE CHECK ──────────────────────────────
  console.log("6) MANISHA MEHRA TOB 12:30 IST FIXTURE CHECK");
  console.log("------------------------------------------------------------------------------------------");
  const scriptsDir = path.join(repoRoot, "scripts");
  for (const scriptName of [
    "generate-4chart-qa-suite.ts",
    "generate-4chart-single-reports.ts",
  ]) {
    const content = fs.readFileSync(path.join(scriptsDir, scriptName), "utf8");
    const match = content.match(/slug:\s*"Manisha-Mehra"[\s\S]{0,250}tob:\s*"([^"]+)"/);
    if (!match) {
      totalViolations += 1;
      console.log(`  - ${scriptName}: FAIL (Manisha-Mehra block not found)`);
    } else if (match[1] !== "12:30") {
      totalViolations += 1;
      console.log(`  - ${scriptName}: FAIL (found tob="${match[1]}", expected "12:30")`);
    } else {
      console.log(`  - ${scriptName}: PASS (tob="12:30" IST preserved)`);
    }
  }

  console.log("\n==========================================================================================");
  if (totalViolations === 0) {
    console.log("AUDIT RESULT: CLEAN PASS (0 violations)");
    console.log("==========================================================================================");
    process.exit(0);
  } else {
    console.log(`AUDIT RESULT: FAIL (${totalViolations} total violation(s) detected)`);
    console.log("==========================================================================================");
    process.exit(1);
  }
}

main();
