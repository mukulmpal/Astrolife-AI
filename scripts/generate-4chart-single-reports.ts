import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { calculateChart } from "../src/lib/astro-engine/calculations";
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
}

const TEST_PROFILES: TestProfile[] = [
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
  },
  {
    slug: "Manisha-Mehra",
    name: "Manisha Mehra",
    gender: "female",
    dob: "1993-12-06",
    tob: "12:30", // corrected by user
    place: "Delhi, India",
    lat: 28.6139,
    lng: 77.2090,
    tz: 5.5,
  },
  {
    slug: "Mukul-Mohan-Pal",
    name: "Mukul Mohan Pal",
    gender: "male",
    dob: "1995-07-04",
    tob: "12:34", // corrected by user
    place: "Delhi, India",
    lat: 28.6139,
    lng: 77.2090,
    tz: 5.5,
  },
];

interface DossierDefinition {
  id: string;
  reportId: string;
  reportTitle: string;
  filename: string;
}

// Same Dossiers as in generate-4chart-qa-suite.ts (24‑page reports)
const DOSSIERS: DossierDefinition[] = [
  { id: "sacred_union", reportId: "pkg_sacred_union", reportTitle: "Sacred Union & Family Destiny", filename: "AstroLife-Sacred-Union.pdf" },
  { id: "wealth_yogas", reportId: "pkg_wealth_yogas", reportTitle: "Raja Yoga & Wealth Acceleration", filename: "AstroLife-Raja-Yoga-Wealth.pdf" },
  { id: "bio_remedies", reportId: "pkg_bio_remedies", reportTitle: "Bio-Vedic Protection & Remedial Vault", filename: "AstroLife-Bio-Vedic-Remedies.pdf" },
  { id: "space_destiny", reportId: "pkg_space_destiny", reportTitle: "Space Energy, Vastu, Palmistry & BTR", filename: "AstroLife-Space-Energy-BTR.pdf" },
  { id: "stock_trading", reportId: "pkg_stock_trading", reportTitle: "Stock Market, Speculation & Sarvatobhadra", filename: "AstroLife-Stock-Trading.pdf" },
  { id: "jaimini_soul", reportId: "pkg_jaimini_soul", reportTitle: "Jaimini Soul Blueprint & Karmic Mission", filename: "AstroLife-Jaimini-Soul.pdf" },
  { id: "ayurvedic_medical", reportId: "pkg_ayurvedic_medical", reportTitle: "Ayurvedic Medical & Vitality Shield", filename: "AstroLife-Medical-Vitality.pdf" },
  { id: "muhurat_panchang", reportId: "pkg_muhurat_panchang", reportTitle: "Golden Muhurat & Cosmic Decision Matrix", filename: "AstroLife-Golden-Muhurat.pdf" },
];

// Single‑engine report definitions (same as generate-all-single-reports.ts)
const SINGLE_REPORTS = [
  { id: "destiny_curve_flagship", filename: "01-Destiny-Curve-90-Year-Life-Master.pdf", title: "📈 Destiny Curve: 90‑Year Life Master Dossier" },
  { id: "navtara_dasha_single", filename: "02-Navtara-Chakra-and-Dasha-Transit.pdf", title: "🌟 Navtara Chakra & Dasha Transit Audit" },
  { id: "kundali_milan_single", filename: "03-Kundali-Milan-36-Guna-Compatibility.pdf", title: "💍 Kundali Milan & 36‑Guna Compatibility" },
  { id: "family_karma_single", filename: "04-Family-Karma-and-Lineage-Synastry.pdf", title: "🌳 Family Karma & Lineage Synastry" },
  { id: "classical_yogas_single", filename: "05-Classical-Yogas-and-Awakening-Timing.pdf", title: "✨ 300+ Classical Yogas & Awakening Timing" },
  { id: "gemstone_rudraksha_single", filename: "06-Advance-Gemstone-and-Rudraksha.pdf", title: "💎 Advance Gemstone & Rudraksha Prescription" },
  { id: "vastu_radar_single", filename: "07-Astro-Vastu-Directional-Radar.pdf", title: "🧭 Astro‑Vastu Directional Radar" },
  { id: "dot_therapy_thread_single", filename: "08-Astro-Dot-Therapy-and-Sacred-Thread.pdf", title: "🔴 Astro Dot Therapy & Sacred Thread Protocol" },
  { id: "astro_tattoo_single", filename: "09-Astro-Tattoo-and-Sacred-Geometry.pdf", title: "🎨 Astro‑Tattoo & Sacred Yantra Geometry" },
  { id: "numerology_single", filename: "10-Vedic-Numerology-and-Name-Resonance.pdf", title: "🔢 Vedic Numerology & Name Resonance" },
  { id: "palmistry_scan", filename: "11-Samudrika-Shastra-and-Palm-Scan.pdf", title: "🖐️ Samudrika Shastra & Palm Scan" },
  { id: "btr_mathematical", filename: "12-Mathematical-Birth-Time-Rectification-BTR.pdf", title: "⏱️ Mathematical Birth Time Rectification (BTR)" },
  { id: "prashna_instant", filename: "13-Prashna-Kundli-Instant-Urgent-Query.pdf", title: "❓ Prashna Kundli (Instant Urgent Query)" },
  { id: "transit_purchase", filename: "14-Transit-Purchase-Timing-Car-Home-Gold.pdf", title: "🚗 Transit Purchase Timing (Car, Home, Gold)" },
  { id: "yearly_gochar", filename: "15-Yearly-Gochar-Transit-and-Sade-Sati.pdf", title: "🪐 2026‑2027 1‑Year Transit & Sade Sati Dossier" },
  { id: "astro_sound", filename: "16-Astro-Sound-and-Frequency-Therapy.pdf", title: "🎵 Astro‑Sound & Frequency Therapy" },
  { id: "sarvatobhadra_single", filename: "17-Sarvatobhadra-Transit-and-Trading-Hit-Radar.pdf", title: "📊 Sarvatobhadra Transit & Trading Hit Radar" },
  { id: "special_lagnas_single", filename: "18-Special-Lagnas-Hora-and-Sree-Lagna.pdf", title: "👑 Special Lagnas: Hora & Sree Lagna Wealth Dossier" },
  { id: "atmakaraka_soul_single", filename: "19-Atmakaraka-and-Jaimini-Soul-Purpose.pdf", title: "👁️ Atmakaraka & Jaimini Soul Purpose Dossier" },
  { id: "ashtakavarga_bindus_single", filename: "20-Ashtakavarga-337-Bindus-Strength-Matrix.pdf", title: "🔢 Ashtakavarga 337‑Bindus Strength Matrix" },
  { id: "medical_roga_single", filename: "21-Medical-Astrology-and-Organ-Vulnerability.pdf", title: "🏥 Medical Astrology & Organ Vulnerability Audit" },
  { id: "cognitive_mind_single", filename: "22-Cognitive-Mind-and-Emotional-Stress-Decoder.pdf", title: "🧠 Cognitive Mind & Emotional Stress Decoder" },
];

const BASE_DESKTOP_DIR = "/Users/mukulpal/Desktop/AstroLife-4Chart-QA";

async function generate() {
  console.log("=== Generating 24‑page dossiers & single‑engine reports for all profiles ===");
  if (!fs.existsSync(BASE_DESKTOP_DIR)) {
    fs.mkdirSync(BASE_DESKTOP_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const profile of TEST_PROFILES) {
    const profileDir = path.join(BASE_DESKTOP_DIR, profile.slug);
    if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });
    const singleDir = path.join(profileDir, "Single-Reports");
    if (!fs.existsSync(singleDir)) fs.mkdirSync(singleDir, { recursive: true });

    console.log(`\n--- Processing ${profile.name} (${profile.slug}) ---`);
    const chart = calculateChart(profile.name, profile.dob, profile.tob, profile.place, profile.lat, profile.lng, profile.tz);

    // 24‑page dossiers
    for (const dossier of DOSSIERS) {
      const outPath = path.join(profileDir, `${profile.slug}-${dossier.filename}`);
      const html = generatePackageDossierHTML(chart, {
        reportId: dossier.reportId,
        reportTitle: dossier.reportTitle,
        customerName: profile.name,
        isSample: false,
        orderId: `AL-ORD-${profile.slug.toUpperCase()}-${dossier.id.toUpperCase()}`,
        paymentId: `AL-CERT-${profile.slug.toUpperCase()}-${dossier.id.toUpperCase()}`,
        gender: profile.gender,
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
      await page.close();
      fs.writeFileSync(outPath, pdf);
    }

    // Single‑engine reports
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    for (let i = 0; i < SINGLE_REPORTS.length; i++) {
      const r = SINGLE_REPORTS[i];
      const html = generatePackageDossierHTML(chart, {
        reportId: r.id,
        reportTitle: r.title,
        customerName: profile.name,
        isSample: false,
        orderId: `AL-SINGLE-${profile.slug.toUpperCase()}-${i + 1}`,
        paymentId: "AL-VERIFIED-SHASTRA-CERT",
        gender: profile.gender,
      });
      await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(res => setTimeout(res, 5000))]));
      const pdf = await page.pdf({ width: "794px", height: "1123px", printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
      const outPath = path.join(singleDir, r.filename);
      fs.writeFileSync(outPath, pdf);
      console.log(`  ✔ ${r.filename}`);
    }
    await page.close();
  }

  await browser.close();
  console.log("=== All PDFs generated successfully ===");
}

generate().catch(err => {
  console.error("Generation failed:", err);
  process.exit(1);
});
