import puppeteer from "puppeteer-core";
import fs from "fs";
import { calculateChart } from "../src/lib/astro-engine/calculations";
import { generatePackageDossierHTML } from "../src/lib/report/package-dossier-html-generator";

async function run() {
  console.log("1. Calculating authentic birth chart for Mukul Mohan Pal (1995-07-04, 12:30, Delhi)...");
  const chart = calculateChart(
    "Mukul Mohan Pal",
    "1995-07-04",
    "12:30",
    "Delhi",
    28.6139,
    77.2090,
    5.5
  );

  console.log(`Lagna: ${chart.lagnaRashi}, Moon: ${chart.planets?.["Moon"]?.sign}, Nakshatra: ${chart.planets?.["Moon"]?.nakshatra}`);

  console.log("2. Generating Golden Muhurat & Auspicious Decision Suite 24-Page Luxury HTML...");
  const html = generatePackageDossierHTML(chart, {
    reportId: "pkg_muhurat_panchang",
    reportTitle: "⚡ Golden Muhurat & Auspicious Decision Suite",
    customerName: "Mukul Mohan Pal",
    isSample: false, // Clean official version
    orderId: "AL-ORD-MUKUL-MUHURAT-2026",
    paymentId: "AL-VERIFIED-SHASTRA-CERT-MUHURAT"
  });

  console.log(`HTML generated: ${(html.length / 1024).toFixed(1)} KB`);

  console.log("3. Launching Chrome to render 24-page vector PDF...");
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });

  await browser.close();

  const desktopPath = "/Users/mukulpal/Desktop/AstroLife-Golden-Muhurat-Mukul-Mohan-Pal.pdf";
  fs.writeFileSync(desktopPath, pdfBuffer);
  console.log(`SUCCESS! 24-page official report saved directly to Desktop: ${desktopPath}`);
  console.log(`PDF size: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
