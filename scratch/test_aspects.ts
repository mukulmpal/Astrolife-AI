import { calculateChart } from "../src/lib/astro-engine/calculations";

const chart = calculateChart("Rachna", "1994-04-11", "11:00", "Delhi");
const sun = chart.planets.Sun;
const ven = chart.planets.Venus;
const sat = chart.planets.Saturn;
const mar = chart.planets.Mars;
const mer = chart.planets.Mercury;
const moo = chart.planets.Moon;
const jup = chart.planets.Jupiter;
const rah = chart.planets.Rahu;
const ket = chart.planets.Ketu;

console.log("Saturn lon:", sat.lon, "Sign:", sat.sign, "Deg:", sat.degree);
console.log("Venus lon:", ven.lon, "Sign:", ven.sign, "Deg:", ven.degree);
console.log("Sun lon:", sun.lon, "Sign:", sun.sign, "Deg:", sun.degree);
console.log("Mars lon:", mar.lon, "Sign:", mar.sign, "Deg:", mar.degree);
console.log("Mercury lon:", mer.lon, "Sign:", mer.sign, "Deg:", mer.degree);
console.log("Moon lon:", moo.lon, "Sign:", moo.sign, "Deg:", moo.degree);

// Angle between Saturn and Venus:
let diff = ven.lon - sat.lon;
if (diff < 0) diff += 360;
console.log("Saturn to Venus angle:", diff); // 63.2° (Exact 3rd aspect range!)

// 3rd house lord is Sun
// 11th house lord is Mars, occupied by Venus
// 9th house lord is Saturn
// 7th house lord is Jupiter

