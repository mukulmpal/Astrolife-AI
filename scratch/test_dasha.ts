import { calculateChart } from "../src/lib/astro-engine/calculations";
import { getCurrentDashaHierarchy5Levels, getMahadashas, getNakshatraFromLongitude } from "../src/lib/astro-engine/dasha";

const chart = calculateChart("Rachna", "1994-04-11", "11:00", "Delhi");
const moon = chart.planets.Moon;
const nak = getNakshatraFromLongitude(moon.lon);
const mds = getMahadashas(new Date("1994-04-11T11:00:00+05:30"), nak);
console.log("=== Mahadashas ===");
for (const md of mds) {
  console.log("MD:", md.lord, md.startDate.toISOString().slice(0,10), "to", md.endDate.toISOString().slice(0,10));
}

function show5Levels(dStr: string) {
  const d = new Date(dStr);
  const h = getCurrentDashaHierarchy5Levels(new Date("1994-04-11T11:00:00+05:30"), nak, d);
  console.log(`\n=== 5 Levels for ${dStr} ===`);
  console.log("MD:", h.mahadasha?.lord, h.mahadasha?.startDate.toISOString().slice(0,10), "to", h.mahadasha?.endDate.toISOString().slice(0,10));
  console.log("AD:", h.antardasha?.lord, h.antardasha?.startDate.toISOString().slice(0,10), "to", h.antardasha?.endDate.toISOString().slice(0,10));
  console.log("PD:", h.pratyantardasha?.lord, h.pratyantardasha?.startDate.toISOString().slice(0,10), "to", h.pratyantardasha?.endDate.toISOString().slice(0,10));
  console.log("SD:", h.sookshmadasha?.lord, h.sookshmadasha?.startDate.toISOString().slice(0,10), "to", h.sookshmadasha?.endDate.toISOString().slice(0,10));
  console.log("Prana:", h.pranadasha?.lord, h.pranadasha?.startDate.toISOString().slice(0,10), "to", h.pranadasha?.endDate.toISOString().slice(0,10));
}

show5Levels("2024-07-15");
show5Levels("2024-10-15");
show5Levels("2024-11-05");
show5Levels("2025-07-15");
show5Levels("2026-11-05");
