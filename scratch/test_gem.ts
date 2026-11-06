import { calculateChart } from "../src/lib/astro-engine/calculations";
import { makeRudrakshaRecommendation, buildNatalChartFromAnyChart } from "../src/lib/astro-engine/gemstone";

const chart = calculateChart("Rachna", "1994-04-11", "11:00", "Delhi");
const natal = buildNatalChartFromAnyChart(chart);
const rudraksha = makeRudrakshaRecommendation(natal);
console.log("Rudraksha recommendation:", JSON.stringify(rudraksha, null, 2));
