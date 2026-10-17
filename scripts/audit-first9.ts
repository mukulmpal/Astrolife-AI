import { calculateChart } from "../src/lib/astro-engine/calculations";
import { calculateDivisional, getChartAnalysis } from "../src/lib/astro-engine/divisional";

const mukul = calculateChart("Mukul Pal", "1995-07-04", "12:30:00", "Delhi", 28.65195, 77.23149, 5.5);
const allVargas = calculateDivisional(mukul.planets, mukul.lagnaNum, mukul.lagnaLon);
const first9 = ["D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12", "D16"];

first9.forEach((key) => {
  const chart = allVargas.find(c => c.key === key)!;
  console.log(`\n=== [${chart.key}] ${chart.name.toUpperCase()} (Lagna: ${chart.lagna}) ===`);
  console.log("Purpose:", chart.purpose);
  chart.planets.forEach(p => {
    console.log(`  ${p.planet.padEnd(8)}: H${String(p.house).padEnd(2)} ${p.sign.padEnd(11)} ${p.dignity.padEnd(11)} ${p.inLagna ? "[Lagna]" : ""}`);
  });
  const insights = getChartAnalysis(chart);
  if (insights) insights.forEach(i => console.log(`  • ${i}`));
});

