import puppeteer from "puppeteer-core";
import fs from "fs";
import { calculateChart } from "../src/lib/astro-engine/calculations";
import { generateReportHTML, REPORT_PAGE_SIZE } from "../src/lib/report-html-generator";

async function renderPdf(browser: any, html: string, outputPath: string, label: string) {
  console.log(`\n--- Rendering ${label} ---`);
  console.log(`HTML size: ${(html.length / 1024).toFixed(1)} KB`);

  const page = await browser.newPage();
  await page.setViewport({ width: REPORT_PAGE_SIZE.width, height: REPORT_PAGE_SIZE.height });
  await page.emulateMediaType("print");

  await page.setContent(html, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });

  // Wait for web fonts (Cormorant, Inter, JetBrains Mono, Noto Serif Devanagari) to finish loading
  await page.evaluate(() =>
    Promise.race([
      (document as any).fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 8000)),
    ])
  );

  console.log(`Printing PDF to ${outputPath}...`);
  const pdfBuffer = await page.pdf({
    width: `${REPORT_PAGE_SIZE.width}px`,
    height: `${REPORT_PAGE_SIZE.height}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
    timeout: 120000,
  });

  await page.close();

  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`✅ Saved ${label} successfully!`);
  console.log(`   Path: ${outputPath}`);
  console.log(`   Size: ${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB`);
}

async function run() {
  console.log("================================================================================");
  console.log("ASTROLIFE ELITE COSMIC BLUEPRINT — BILINGUAL DESKTOP GENERATION");
  console.log("================================================================================");

  console.log("\n1. Calculating birth chart for Mukul Mohan Pal (1995-07-04, 12:30, Delhi)...");
  const chart = calculateChart(
    "Mukul Mohan Pal",
    "1995-07-04",
    "12:30",
    "Delhi",
    28.6139,
    77.2090,
    5.5
  );

  console.log(`Lagna: ${chart.lagnaRashi} (H1), Moon: ${chart.planets?.["Moon"]?.sign} (${chart.planets?.["Moon"]?.nakshatra})`);

  console.log("\n2. Launching Chrome headless instance...");
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  });

  try {
    // 1. National Hindi Edition
    const nationalHindiHtml = generateReportHTML(chart, {
      type: "elite",
      language: "hi",
      palette: "midnight",
      cover: "wheel",
    });
    const nationalHindiPath = "/Users/mukulpal/Desktop/AstroLife-Cosmic-Blueprint-Mukul-National-Hindi.pdf";
    await renderPdf(browser, nationalHindiHtml, nationalHindiPath, "National Hindi Edition (100% शुद्ध हिन्दी)");

    // 2. International English Edition
    const internationalEnglishHtml = generateReportHTML(chart, {
      type: "elite",
      language: "en",
      palette: "midnight",
      cover: "wheel",
    });
    const internationalEnglishPath = "/Users/mukulpal/Desktop/AstroLife-Cosmic-Blueprint-Mukul-International-English.pdf";
    await renderPdf(browser, internationalEnglishHtml, internationalEnglishPath, "International English Edition (100% Crisp English)");

    console.log("\n================================================================================");
    console.log("ALL DELIVERABLES SUCCESSFULLY CREATED ON YOUR DESKTOP:");
    console.log(`1. National Hindi: ${nationalHindiPath}`);
    console.log(`2. International English: ${internationalEnglishPath}`);
    console.log("================================================================================");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
