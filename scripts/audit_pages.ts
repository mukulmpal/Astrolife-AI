
import { calculateChart } from "../src/lib/astro-engine/calculations";
import { generateReportHTML } from "../src/lib/report-html-generator";

const chart = calculateChart("Mukul Mohan Pal", "1995-07-04", "12:30", "Delhi", 28.6139, 77.2090, 5.5);
const html = generateReportHTML(chart, { type: "elite", language: "hi", palette: "midnight", cover: "wheel" });

const pages = html.split("<section class=\"page");
console.log("Total pages:", pages.length - 1);

for (let i = 1; i < pages.length; i++) {
  const p = pages[i];
  const h2Match = p.match(/<h2>([\s\S]*?)<\/h2>/);
  const railMatch = p.match(/class=\"page-rail\">([\s\S]*?)<\/div>/);
  const title = h2Match ? h2Match[1].replace(/<[^>]+>/g, "").trim() : (railMatch ? railMatch[1].replace(/<[^>]+>/g, "").trim() : "Cover/Page");
  const textOnly = p.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const devanagariCount = (textOnly.match(/[\u0900-\u097F]/g) || []).length;
  const latinCount = (textOnly.match(/[a-zA-Z]/g) || []).length;
  const ratio = devanagariCount / (devanagariCount + latinCount + 1);
  console.log(`Page ${i}: [${(ratio * 100).toFixed(0)}% HI] ${title.slice(0, 50)}`);
}
