import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { calculateChart } from "../src/lib/astro-engine/calculations";
import { generatePackageDossierHTML } from "../src/lib/report/package-dossier-html-generator";

const TARGET_DIR = "/Users/mukulpal/Desktop/AstroLife-Reports-Mukul-Mohan-Pal";

async function run() {
  console.log("================================================================================");
  console.log("✦ ASTROLIFE: GENERATING COMPLETE SHASTRA DOSSIER SUITE FOR MUKUL MOHAN PAL");
  console.log("================================================================================");

  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
    console.log(`Created target directory: ${TARGET_DIR}`);
  } else {
    console.log(`Using target directory: ${TARGET_DIR}`);
  }

  // 1. Birth Chart Calculation
  console.log("\n1. Calculating authentic birth chart for Mukul Mohan Pal...");
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

  // 2. Dossiers to render (8 Sovereign Suites + 1 Destiny Curve Flagship)
  const dossiers = [
    {
      id: "pkg_union_family",
      title: "💍 Sacred Union & Family Destiny Masterwork",
      filename: "01-AstroLife-Sacred-Union-and-Family-Destiny.pdf",
    },
    {
      id: "pkg_wealth_yogas",
      title: "👑 Raja Yoga & Wealth Acceleration Masterwork",
      filename: "02-AstroLife-Raja-Yoga-and-Wealth-Acceleration.pdf",
    },
    {
      id: "pkg_bio_remedies",
      title: "🛡️ Bio-Vedic Protection & Remedial Vault Masterwork",
      filename: "03-AstroLife-Bio-Vedic-Remedies-and-Protection.pdf",
    },
    {
      id: "pkg_space_destiny",
      title: "🧭 Space Energy, Vastu, Palmistry & BTR Masterwork",
      filename: "04-AstroLife-Space-Energy-Vastu-Palmistry-BTR.pdf",
    },
    {
      id: "pkg_stock_trading",
      title: "📈 Stock Market, Speculation & Sarvatobhadra Masterwork",
      filename: "05-AstroLife-Stock-Market-Speculation-Trading.pdf",
    },
    {
      id: "pkg_jaimini_soul",
      title: "👁️ Jaimini Soul Blueprint & Karakamsa Masterwork",
      filename: "06-AstroLife-Jaimini-Soul-Blueprint-Karakamsa.pdf",
    },
    {
      id: "pkg_ayurvedic_medical",
      title: "⚕️ Ayurvedic Medical & Vitality Shield Masterwork",
      filename: "07-AstroLife-Ayurvedic-Medical-and-Vitality-Shield.pdf",
    },
    {
      id: "pkg_muhurat_panchang",
      title: "⚡ Golden Muhurat & Cosmic Decision Matrix Masterwork",
      filename: "08-AstroLife-Golden-Muhurat-and-Decision-Matrix.pdf",
    },
    {
      id: "destiny_curve_flagship",
      title: "📈 Destiny Curve: 90-Year Life Master Dossier",
      filename: "09-AstroLife-Destiny-Curve-90-Year-Life-Master.pdf",
    },
  ];

  console.log("\n2. Launching Headless Chromium to generate all 9 24-Page Vector PDFs...");
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (let i = 0; i < dossiers.length; i++) {
    const d = dossiers[i];
    console.log(`\n[${i + 1}/9] Generating ${d.title}...`);

    const html = generatePackageDossierHTML(chart, {
      reportId: d.id,
      reportTitle: d.title,
      customerName: "Mukul Mohan Pal",
      isSample: false,
      orderId: `AL-ORD-MUKUL-2026-0${i + 1}`,
      paymentId: "AL-VERIFIED-SHASTRA-CERT",
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Wait for fonts to be ready
    await page.evaluate(() =>
      Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 6000)),
      ])
    );

    const pdfBuffer = await page.pdf({
      width: "794px",
      height: "1123px",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await page.close();

    const destPath = path.join(TARGET_DIR, d.filename);
    fs.writeFileSync(destPath, pdfBuffer);
    console.log(`  ✓ Saved: ${d.filename} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
  }

  await browser.close();

  // 3. Copy the 104-Page Elite Cosmic Blueprints into the folder
  console.log("\n3. Copying 104-Page Elite Master Blueprints...");
  const masterBlueprints = [
    {
      src: "/Users/mukulpal/Desktop/AstroLife-Cosmic-Blueprint-Mukul-National-Hindi.pdf",
      dest: path.join(TARGET_DIR, "10-AstroLife-Cosmic-Blueprint-Bilingual-Hindi.pdf"),
    },
    {
      src: "/Users/mukulpal/Desktop/AstroLife-Cosmic-Blueprint-Mukul-International-English.pdf",
      dest: path.join(TARGET_DIR, "11-AstroLife-Cosmic-Blueprint-International-English.pdf"),
    },
  ];

  for (const mb of masterBlueprints) {
    if (fs.existsSync(mb.src)) {
      fs.copyFileSync(mb.src, mb.dest);
      const stat = fs.statSync(mb.dest);
      console.log(`  ✓ Copied: ${path.basename(mb.dest)} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
    } else {
      console.warn(`  ⚠ Source not found: ${mb.src}`);
    }
  }

  console.log("\n================================================================================");
  console.log(`🎉 ALL 11 MASTER ASTROLIFE DOSSIERS SUCCESSFULLY SAVED IN:`);
  console.log(`📁 ${TARGET_DIR}`);
  console.log("================================================================================");
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
