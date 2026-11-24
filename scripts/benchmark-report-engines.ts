import { calculateChart } from "../src/lib/astro-engine/calculations";
import { runKPEngine } from "../src/lib/astro-engine/kp";
import { generateReportHTML } from "../src/lib/report-html-generator";
import { buildEvidenceFirstReport } from "../src/lib/report/evidence-first-report";
import { buildEvidenceFirstPdf } from "../src/lib/report/evidence-first-pdf";
import { buildPackageDossierPdf } from "../src/lib/report/package-dossier-pdf";

function getPdfPageCount(buffer: Buffer): number {
  const binary = buffer.toString("binary");
  const countMatch = binary.match(/\/Count\s+(\d+)/);
  if (countMatch && countMatch[1]) {
    return parseInt(countMatch[1], 10);
  }
  const pageMatches = binary.match(/\/Type\s*\/Page\b/g);
  return pageMatches ? pageMatches.length : 0;
}

async function main() {
  console.log("=== ASTROLIFE REPORT GENERATION ENGINES BENCHMARK ===");
  const subject = {
    name: "Ananya Sharma",
    dob: "1994-11-23",
    tob: "08:15",
    city: "Varanasi",
    lat: 25.3176,
    lon: 82.9739,
    tz: 5.5,
  };

  const chart = calculateChart(
    subject.name,
    subject.dob,
    subject.tob,
    subject.city,
    subject.lat,
    subject.lon,
    subject.tz
  );

  console.log(`Subject: ${chart.name}, Lagna: ${chart.lagnaRashi}, Moon: ${chart.planets?.["Moon"]?.sign}`);

  // 1. Engine 1 HTML Generation
  const t0 = performance.now();
  const htmlElite = generateReportHTML(chart, { type: "elite", language: "en", palette: "midnight", cover: "wheel" });
  const t1 = performance.now();
  const pagesElite = htmlElite.split("<section class=\"page").length - 1;
  console.log(`\n[Engine 1: Legacy HTML Generator]`);
  console.log(`- HTML Render Time: ${(t1 - t0).toFixed(2)} ms`);
  console.log(`- HTML Size: ${(htmlElite.length / 1024).toFixed(1)} KB`);
  console.log(`- Page Count: ${pagesElite} pages`);
  console.log(`- Note: Full Chromium PDF rasterization requires additional 15-45s and 350-1000MB RAM.`);

  // 2. Engine 2: Evidence-First Classical Edition
  const kp = runKPEngine(chart);
  const t2 = performance.now();
  const efPayload = buildEvidenceFirstReport(chart, kp);
  const efPdfBuffer = await buildEvidenceFirstPdf(efPayload, { subjectName: chart.name });
  const t3 = performance.now();
  const efPages = getPdfPageCount(efPdfBuffer);
  console.log(`\n[Engine 2: Evidence-First Classical Edition PDF]`);
  console.log(`- Payload + Vector PDF Generation Time: ${(t3 - t2).toFixed(2)} ms`);
  console.log(`- Vector PDF Buffer Size: ${(efPdfBuffer.length / 1024).toFixed(1)} KB (${efPdfBuffer.length} bytes)`);
  console.log(`- Page Count: ${efPages} pages (from PDF binary inspection)`);
  console.log(`- Sections: ${efPayload.sections.length} topic sections`);

  // 3. Engine 3: Modular Vector Package Dossier
  const t4 = performance.now();
  const dossierPdfBuffer = await buildPackageDossierPdf(chart, {
    reportId: "pkg_wealth_yogas",
    reportTitle: "Raja Yoga & Wealth Dossier",
    customerName: chart.name,
  });
  const t5 = performance.now();
  const dossierPages = getPdfPageCount(dossierPdfBuffer);
  console.log(`\n[Engine 3: Modular Vector Package Dossier PDF]`);
  console.log(`- Vector PDF Generation Time: ${(t5 - t4).toFixed(2)} ms`);
  console.log(`- Vector PDF Buffer Size: ${(dossierPdfBuffer.length / 1024).toFixed(1)} KB (${dossierPdfBuffer.length} bytes)`);
  console.log(`- Page Count: ${dossierPages} pages emitted (target: 4 pages golden ratio; current implementation produces 8 pages due to PDFKit footer margin overflow at y=800)`);

  console.log("\n=== BENCHMARK COMPLETED SUCCESSFULLY ===");
}

main().catch(console.error);
