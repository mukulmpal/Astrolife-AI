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
    tob: "14:40", // 2:40 PM IST
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
    tob: "14:00", // 2:00 PM IST
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
    tob: "12:30", // 12:30 PM IST (as updated by user)
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
    tob: "12:34", // 12:34 PM IST (4-min shift from 12:30)
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

const DOSSIERS: DossierDefinition[] = [
  {
    id: "sacred_union",
    reportId: "pkg_sacred_union",
    reportTitle: "Sacred Union & Family Destiny",
    filename: "AstroLife-Sacred-Union.pdf",
  },
  {
    id: "wealth_yogas",
    reportId: "pkg_wealth_yogas",
    reportTitle: "Raja Yoga & Wealth Acceleration",
    filename: "AstroLife-Raja-Yoga-Wealth.pdf",
  },
  {
    id: "bio_remedies",
    reportId: "pkg_bio_remedies",
    reportTitle: "Bio-Vedic Protection & Remedial Vault",
    filename: "AstroLife-Bio-Vedic-Remedies.pdf",
  },
  {
    id: "space_destiny",
    reportId: "pkg_space_destiny",
    reportTitle: "Space Energy, Vastu, Palmistry & BTR",
    filename: "AstroLife-Space-Energy-BTR.pdf",
  },
  {
    id: "stock_trading",
    reportId: "pkg_stock_trading",
    reportTitle: "Stock Market, Speculation & Sarvatobhadra",
    filename: "AstroLife-Stock-Trading.pdf",
  },
  {
    id: "jaimini_soul",
    reportId: "pkg_jaimini_soul",
    reportTitle: "Jaimini Soul Blueprint & Karmic Mission",
    filename: "AstroLife-Jaimini-Soul.pdf",
  },
  {
    id: "ayurvedic_medical",
    reportId: "pkg_ayurvedic_medical",
    reportTitle: "Ayurvedic Medical & Vitality Shield",
    filename: "AstroLife-Medical-Vitality.pdf",
  },
  {
    id: "muhurat_panchang",
    reportId: "pkg_muhurat_panchang",
    reportTitle: "Golden Muhurat & Cosmic Decision Matrix",
    filename: "AstroLife-Golden-Muhurat.pdf",
  },
];

const BASE_DESKTOP_DIR = "/Users/mukulpal/Desktop/AstroLife-4Chart-QA";

async function main() {
  console.log("================================================================================");
  console.log("ASTROLIFE 4-CHART DESKTOP QA SUITE — 32 DUAL-LAYER 24-PAGE DOSSIERS");
  console.log("================================================================================\n");

  if (!fs.existsSync(BASE_DESKTOP_DIR)) {
    fs.mkdirSync(BASE_DESKTOP_DIR, { recursive: true });
  }

  console.log("Launching headless Chrome for vector-grade PDF compilation...");
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const startTime = Date.now();
  let generatedCount = 0;
  const profileArg = process.argv.find(a => a.startsWith("--profile="))?.split("=")[1];
  const activeProfiles = profileArg ? TEST_PROFILES.filter(p => p.slug === profileArg) : TEST_PROFILES;

  for (const profile of activeProfiles) {
    const profileDir = path.join(BASE_DESKTOP_DIR, profile.slug);
    if (!fs.existsSync(profileDir)) {
      fs.mkdirSync(profileDir, { recursive: true });
    }

    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`PROFILE: ${profile.name} (${profile.gender.toUpperCase()})`);
    console.log(`DOB: ${profile.dob} | TOB: ${profile.tob} | Place: ${profile.place}`);
    console.log(`Target Folder: ${profileDir}`);
    console.log(`--------------------------------------------------------------------------------`);

    // Compute live chart with Swiss Ephemeris Lahiri
    const chart = calculateChart(
      profile.name,
      profile.dob,
      profile.tob,
      profile.place,
      profile.lat,
      profile.lng,
      profile.tz
    );

    console.log(`Calculated: Lagna = ${chart.lagnaRashi} (${chart.lagnaDeg?.toFixed(2)}°), Moon = ${chart.planets?.Moon?.sign} (${chart.planets?.Moon?.nakshatra})`);

    for (const dossier of DOSSIERS) {
      const outPdfPath = path.join(profileDir, `${profile.slug}-${dossier.filename}`);
      const stepMsg = `[${profile.slug}] Generating ${dossier.reportTitle}...`;
      process.stdout.write(stepMsg);

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

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: true,
      });

      await page.close();
      fs.writeFileSync(outPdfPath, pdfBuffer);

      generatedCount++;
      const kb = (pdfBuffer.length / 1024).toFixed(1);
      console.log(` OK (${kb} KB) -> ${path.basename(outPdfPath)}`);
    }
  }

  await browser.close();
  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("\n================================================================================");
  console.log(`QA SUITE BATCH GENERATION COMPLETE!`);
  console.log(`Total Dossiers Generated: ${generatedCount} / 32`);
  console.log(`Total Execution Time: ${elapsedSec}s`);
  console.log(`Output Directory: ${BASE_DESKTOP_DIR}`);
  console.log("================================================================================");
}

main().catch((err) => {
  console.error("FATAL ERROR in QA Suite:", err);
  process.exit(1);
});
