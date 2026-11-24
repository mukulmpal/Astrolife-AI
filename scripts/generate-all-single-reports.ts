import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { calculateChart } from "../src/lib/astro-engine/calculations";
import { generatePackageDossierHTML } from "../src/lib/report/package-dossier-html-generator";

const TARGET_DIR = "/Users/mukulpal/Desktop/AstroLife-Reports-Mukul-Mohan-Pal/Single-Reports";

async function run() {
  console.log("================================================================================");
  console.log("✦ ASTROLIFE: GENERATING ALL 22 SINGLE-ENGINE REPORTS FOR MUKUL MOHAN PAL");
  console.log("================================================================================");

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
    console.log(`Created target directory: ${TARGET_DIR}`);
  } else {
    console.log(`Using target directory: ${TARGET_DIR}`);
  }

  // 1. Birth Chart Calculation
  console.log("\n1. Locking authentic birth coordinates for Mukul Mohan Pal...");
  const chart = calculateChart(
    "Mukul Mohan Pal",
    "1995-07-04",
    "12:30",
    "Delhi",
    28.6139,
    77.2090,
    5.5
  );
  console.log(`✓ Chart Locked: Lagna=${chart.lagnaRashi}, Moon=${chart.planets?.["Moon"]?.sign}, Nakshatra=${chart.planets?.["Moon"]?.nakshatra}`);

  const singleReports = [
    {
      id: "destiny_curve_flagship",
      title: "📈 Destiny Curve: 90-Year Life Master Dossier",
      filename: "01-Destiny-Curve-90-Year-Life-Master.pdf",
    },
    {
      id: "navtara_dasha_single",
      title: "🌟 Navtara Chakra & Dasha Transit Audit",
      filename: "02-Navtara-Chakra-and-Dasha-Transit.pdf",
    },
    {
      id: "kundali_milan_single",
      title: "💍 Kundali Milan & 36-Guna Compatibility",
      filename: "03-Kundali-Milan-36-Guna-Compatibility.pdf",
    },
    {
      id: "family_karma_single",
      title: "🌳 Family Karma & Lineage Synastry",
      filename: "04-Family-Karma-and-Lineage-Synastry.pdf",
    },
    {
      id: "classical_yogas_single",
      title: "✨ 300+ Classical Yogas & Awakening Timing",
      filename: "05-Classical-Yogas-and-Awakening-Timing.pdf",
    },
    {
      id: "gemstone_rudraksha_single",
      title: "💎 Advance Gemstone & Rudraksha Prescription",
      filename: "06-Advance-Gemstone-and-Rudraksha.pdf",
    },
    {
      id: "vastu_radar_single",
      title: "🧭 Astro-Vastu Directional Radar",
      filename: "07-Astro-Vastu-Directional-Radar.pdf",
    },
    {
      id: "dot_therapy_thread_single",
      title: "🔴 Astro Dot Therapy & Sacred Thread Protocol",
      filename: "08-Astro-Dot-Therapy-and-Sacred-Thread.pdf",
    },
    {
      id: "astro_tattoo_single",
      title: "🎨 Astro-Tattoo & Sacred Yantra Geometry",
      filename: "09-Astro-Tattoo-and-Sacred-Geometry.pdf",
    },
    {
      id: "numerology_single",
      title: "🔢 Vedic Numerology & Name Resonance",
      filename: "10-Vedic-Numerology-and-Name-Resonance.pdf",
    },
    {
      id: "palmistry_scan",
      title: "🖐️ Samudrika Shastra & Palm Scan",
      filename: "11-Samudrika-Shastra-and-Palm-Scan.pdf",
    },
    {
      id: "btr_mathematical",
      title: "⏱️ Mathematical Birth Time Rectification (BTR)",
      filename: "12-Mathematical-Birth-Time-Rectification-BTR.pdf",
    },
    {
      id: "prashna_instant",
      title: "❓ Prashna Kundli (Instant Urgent Query)",
      filename: "13-Prashna-Kundli-Instant-Urgent-Query.pdf",
    },
    {
      id: "transit_purchase",
      title: "🚗 Transit Purchase Timing (Car, Home, Gold)",
      filename: "14-Transit-Purchase-Timing-Car-Home-Gold.pdf",
    },
    {
      id: "yearly_gochar",
      title: "🪐 2026-2027 1-Year Transit & Sade Sati Dossier",
      filename: "15-Yearly-Gochar-Transit-and-Sade-Sati.pdf",
    },
    {
      id: "astro_sound",
      title: "🎵 Astro-Sound & Frequency Therapy",
      filename: "16-Astro-Sound-and-Frequency-Therapy.pdf",
    },
    {
      id: "sarvatobhadra_single",
      title: "📊 Sarvatobhadra Transit & Trading Hit Radar",
      filename: "17-Sarvatobhadra-Transit-and-Trading-Hit-Radar.pdf",
    },
    {
      id: "special_lagnas_single",
      title: "👑 Special Lagnas: Hora & Sree Lagna Wealth Dossier",
      filename: "18-Special-Lagnas-Hora-and-Sree-Lagna.pdf",
    },
    {
      id: "atmakaraka_soul_single",
      title: "👁️ Atmakaraka & Jaimini Soul Purpose Dossier",
      filename: "19-Atmakaraka-and-Jaimini-Soul-Purpose.pdf",
    },
    {
      id: "ashtakavarga_bindus_single",
      title: "🔢 Ashtakavarga 337-Bindus Strength Matrix",
      filename: "20-Ashtakavarga-337-Bindus-Strength-Matrix.pdf",
    },
    {
      id: "medical_roga_single",
      title: "🏥 Medical Astrology & Organ Vulnerability Audit",
      filename: "21-Medical-Astrology-and-Organ-Vulnerability.pdf",
    },
    {
      id: "cognitive_mind_single",
      title: "🧠 Cognitive Mind & Emotional Stress Decoder",
      filename: "22-Cognitive-Mind-and-Emotional-Stress-Decoder.pdf",
    },
  ];

  console.log(`\n2. Launching Headless Chromium to generate all ${singleReports.length} reports...`);
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123 });

  for (let i = 0; i < singleReports.length; i++) {
    const r = singleReports[i];
    console.log(`[${i + 1}/${singleReports.length}] Generating ${r.filename}...`);

    const html = generatePackageDossierHTML(chart, {
      reportId: r.id,
      reportTitle: r.title,
      customerName: "Mukul Mohan Pal",
      isSample: false,
      orderId: `AL-SINGLE-${Date.now().toString(36).toUpperCase()}-${(i + 1).toString().padStart(2, "0")}`,
      paymentId: "AL-VERIFIED-SHASTRA-CERT",
    });

    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 45000 });

    await page.evaluate(() =>
      Promise.race([
        document.fonts.ready,
        new Promise((res) => setTimeout(res, 5000)),
      ])
    );

    const pdfBuffer = await page.pdf({
      width: "794px",
      height: "1123px",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    const destPath = path.join(TARGET_DIR, r.filename);
    fs.writeFileSync(destPath, pdfBuffer);
    console.log(`  ✓ Saved: ${r.filename} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
  }

  await page.close();
  await browser.close();

  console.log("\n================================================================================");
  console.log(`🎉 ALL 22 SINGLE-ENGINE REPORTS SUCCESSFULLY SAVED IN:`);
  console.log(`📁 ${TARGET_DIR}`);
  console.log("================================================================================");
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
