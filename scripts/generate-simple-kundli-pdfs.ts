import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core"; // we'll use puppeteer to render markdown as HTML for PDF simplicity
import { calculateChart } from "../src/lib/astro-engine/calculations";
import { generateSimpleKundliDossierMarkdown } from "../src/lib/report/simple-kundli-dossier-generator"; // assumed existent

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
  { slug: "Bhanu-Pal", name: "Bhanu Pal", gender: "male", dob: "1993-08-28", tob: "14:40", place: "Delhi, India", lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { slug: "Deen-Dayal-Pal", name: "Deen Dayal Pal", gender: "male", dob: "1978-11-10", tob: "14:00", place: "Bazpur, Uttarakhand, India", lat: 29.1567, lng: 79.1604, tz: 5.5 },
  { slug: "Manisha-Mehra", name: "Manisha Mehra", gender: "female", dob: "1993-12-06", tob: "12:30", place: "Delhi, India", lat: 28.6139, lng: 77.2090, tz: 5.5 },
  { slug: "Mukul-Mohan-Pal", name: "Mukul Mohan Pal", gender: "male", dob: "1995-07-04", tob: "12:34", place: "Delhi, India", lat: 28.6139, lng: 77.2090, tz: 5.5 },
];

const BASE_DIR = "/Users/mukulpal/Desktop/AstroLife-4Chart-QA";

async function generate() {
  if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const p of TEST_PROFILES) {
    const chart = calculateChart(p.name, p.dob, p.tob, p.place, p.lat, p.lng, p.tz);
    const markdown = generateSimpleKundliDossierMarkdown(chart);
    const html = `<html><body><pre style="font-family:Arial,Helvetica,sans-serif; font-size:12px; white-space:pre-wrap;">${markdown.replace(/</g, "&lt;`).replace(/>/g, "&gt;")}</pre></body></html>`;
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, margin: { top: 20, bottom: 20, left: 20, right: 20 } });
    await page.close();
    const outPath = path.join(BASE_DIR, p.slug, `${p.slug}-Simple-Kundli.pdf`);
    const outDir = path.dirname(outPath);
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, pdf);
    console.log(`✔ Simple Kundli PDF saved for ${p.slug}`);
  }

  await browser.close();
  console.log("All simple Kundli PDFs generated.");
}

generate().catch(err => {
  console.error("Error generating simple Kundli PDFs:", err);
  process.exit(1);
});
