import { calculateChart } from "../src/lib/astro-engine/calculations";
import { calculateDivisional, getChartAnalysis, getSpecialFindings } from "../src/lib/astro-engine/divisional";

const sampleChart = calculateChart(
  "Sample Native",
  "1995-07-04",
  "12:30:00",
  "Delhi",
  28.65195,
  77.23149,
  5.5
);

const allVargas = calculateDivisional(sampleChart.planets, sampleChart.lagnaNum, sampleChart.lagnaLon);

// Parashara Classical 16 Shodashavarga keys:
const SHODASHAVARGA_KEYS = [
  "D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12",
  "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60"
];

console.log("================================================================================");
console.log("SAMPLE NATIVE — COMPLETE 16 SHODASHAVARGA CHARTS AUDIT");
console.log("================================================================================");

SHODASHAVARGA_KEYS.forEach((key, idx) => {
  const chart = allVargas.find(c => c.key === key);
  if (!chart) {
    console.log(`[!] Missing ${key}`);
    return;
  }

  console.log(`\n--------------------------------------------------------------------------------`);
  console.log(`${idx + 1}. [${chart.key}] ${chart.name.toUpperCase()} — Lagna: ${chart.lagna}`);
  console.log(`   Purpose: ${chart.purpose}`);
  console.log(`   Planets:`);
  chart.planets.forEach(p => {
    console.log(`     ${p.planet.padEnd(8)}: House ${String(p.house).padEnd(2)} Sign: ${p.sign.padEnd(11)} Dignity: ${p.dignity.padEnd(11)} ${p.inLagna ? '[In Lagna]' : ''}`);
  });
  const insights = getChartAnalysis(chart);
  if (insights && insights.length > 0) {
    console.log(`   Key Insights:`);
    insights.forEach(ins => console.log(`     • ${ins}`));
  }
});

const specialFindings = getSpecialFindings(allVargas);
console.log("\n================================================================================");
console.log("SPECIAL CROSS-VARGA FINDINGS (Vargottama, Exaltation combos, etc.):");
console.log("================================================================================");
specialFindings.forEach(sf => {
  console.log(`[${sf.type.toUpperCase()}] ${sf.title}: ${sf.detail} (${sf.charts.join(", ")})`);
});

