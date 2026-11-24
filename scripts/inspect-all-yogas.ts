import { calculateChart } from "../src/lib/astro-engine/calculations";
import { detectYogas } from "../src/lib/astro-engine/yogas";

const chart = calculateChart("Mukul Mohan Pal", "1995-07-04", "12:30", "Delhi", 28.6139, 77.2090, 5.5);
const all = detectYogas(chart);
console.log("Total defined yogas checked:", all.length);
all.forEach(y => {
  if (y.present || y.score > 40) {
    console.log(`- ${y.name} [${y.category}] (Score: ${y.score}, Present: ${y.present}, Rare: ${y.rare})`);
  }
});
