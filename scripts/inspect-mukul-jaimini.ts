import { calculateChart } from "../src/lib/astro-engine/calculations";
import { buildJaiminiChart } from "../src/lib/astro-engine/jaimini";
import { calculateDivisional } from "../src/lib/astro-engine/divisional";

const chart = calculateChart("Mukul Mohan Pal", "1995-07-04", "12:30", "Delhi", 28.6139, 77.2090, 5.5);
const jaimini = buildJaiminiChart(chart);
const charts = calculateDivisional(chart.planets as any, chart.lagnaNum || 5, chart.lagnaLon);
const d9 = charts.find(c => c.key === "D9");

console.log("=== D9 NAVAMSHA CHART ===");
console.log("D9 Lagna Sign:", d9?.lagna);
d9?.planets.forEach(p => {
  console.log(`${p.planet}: ${p.sign} (House ${p.house})`);
});

console.log("=== 7 CHARA KARAKAS ===");
jaimini.karakas.forEach(k => {
  console.log(`${k.role}: ${k.planet} at ${k.degreeInSign.toFixed(2)}° in ${k.sign} - ${k.meaning}`);
});

console.log("\n=== KARAKAMSHA ===");
console.log("AK Planet:", jaimini.karakamsha.akPlanet);
console.log("AK Sign D1:", jaimini.karakamsha.akSign);
console.log("Karakamsha Lagna (D9):", jaimini.karakamsha.karakamshaLagna);
console.log("Method:", jaimini.karakamsha.method);
console.log("Houses from KL:");
jaimini.karakamsha.houses.forEach(h => {
  console.log(` House ${h.house} (${h.sign}): D1 planets [${h.planets.join(", ")}] - ${h.theme}`);
});

console.log("\n=== ARUDHA PADAS ===");
jaimini.arudhas.forEach(a => {
  console.log(`${a.shortName} (${a.name}): House ${a.house} in ${a.sign}`);
});

console.log("\n=== RAJA YOGAS ===");
jaimini.rajaYogas.forEach(ry => {
  console.log(`- ${ry.name} (${ry.strength}): ${ry.description}`);
});

console.log("\n=== CHARA DASHA ===");
jaimini.charaDasha.forEach(cd => {
  console.log(`${cd.sign} (${cd.years} yrs): ${cd.startDate.toISOString().slice(0,10)} to ${cd.endDate.toISOString().slice(0,10)} ${cd.isActive ? "[ACTIVE]" : ""}`);
});

console.log("\n=== SPECIAL FINDINGS ===");
jaimini.specialFindings.forEach(sf => {
  console.log(`- ${sf.title}: ${sf.observation} (${sf.impact})`);
});
