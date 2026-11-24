import { calculateChart } from "../src/lib/astro-engine/calculations";
import { calculateSpecialLagnas, calculateInduLagna } from "../src/lib/astro-engine/special-lagnas";
import { calculateDivisional } from "../src/lib/astro-engine/divisional";
import { calculateAshtakavarga } from "../src/lib/astro-engine/ashtakavarga";
import { calculateKarakas } from "../src/lib/astro-engine/jaimini";

const chart = calculateChart("Mukul Mohan Pal", "1995-07-04", "12:30", "Delhi", 28.6139, 77.2090, 5.5);

console.log("=== JAIMINI KARAKAS ===");
const karakas = calculateKarakas(chart.planets || {});
console.log(JSON.stringify(karakas, null, 2));

console.log("\n=== DIVISIONAL D-10 & D-2 ===");
const allDivs = calculateDivisional(chart.planets, chart.lagnaNum, chart.lagnaLon);
const d10 = allDivs.find(d => d.key === "D10");
const d2 = allDivs.find(d => d.key === "D2");
console.log("D-10 Lagna:", d10?.lagnaRashi, "Planets:", d10?.planets);
console.log("D-2 Lagna:", d2?.lagnaRashi, "Planets:", d2?.planets);

