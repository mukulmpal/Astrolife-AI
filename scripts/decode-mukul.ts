import { calculateChart } from "../src/lib/astro-engine/calculations";
import { calculateDivisional, getDashamshaAnalysis, getShastiamshaAnalysis, getNavamshaAnalysis } from "../src/lib/astro-engine/divisional";
import { buildJaiminiChart } from "../src/lib/astro-engine/jaimini";

const D60_DEITIES = [
  "Ghora", "Rakshasa", "Deva", "Kubera", "Yaksha", "Kinnara", "Bhrashta", "Kulaghna",
  "Garala", "Vahni", "Maya", "Purishaka", "Apampati", "Marutvan", "Kaala", "Sarpa",
  "Amrita", "Indu", "Mridu", "Komala", "Heramba", "Brahma", "Vishnu", "Maheshwara",
  "Deva", "Aardra", "Kalinasa", "Kshiteesa", "Kamalakara", "Gulika", "Mrityu", "Kaala",
  "Davagni", "Ghora", "Yama", "Kantaka", "Suddha", "Amrita", "Poornachandra", "Vishadagdha",
  "Kulanasa", "Vamshakshaya", "Utpaata", "Kaala", "Saumya", "Komala", "Sheetala", "Karaladamshtra",
  "Chandramukhi", "Praveena", "Kaalapavaka", "Dandashooka", "Nirmala", "Subhada", "Asubha", "Atisheetala",
  "Sudha", "Payodhara", "Bhramana", "Indurekha"
];

function getShashtiamshaDeity(lon: number) {
  const signNum = Math.floor(lon / 30);
  const degInSign = lon % 30;
  const part = Math.floor(degInSign / 0.5); // 0 to 59
  const isOdd = signNum % 2 === 0; // 0=Aries (odd), 1=Taurus (even)
  const idx = isOdd ? part : (59 - part);
  const deity = D60_DEITIES[idx] || "Unknown";
  const benefics = ["Deva", "Kubera", "Kinnara", "Apampati", "Amrita", "Indu", "Mridu", "Komala", "Heramba", "Brahma", "Vishnu", "Maheshwara", "Kshiteesa", "Kamalakara", "Suddha", "Poornachandra", "Saumya", "Sheetala", "Chandramukhi", "Praveena", "Nirmala", "Subhada", "Atisheetala", "Sudha", "Payodhara", "Indurekha"];
  const isBenefic = benefics.includes(deity);
  return { part: part + 1, deity, isOdd, nature: isBenefic ? "Shubha (Auspicious)" : "Krura (Affliction / Debt)" };
}

const mukul = calculateChart(
  "Mukul Pal",
  "1995-07-04",
  "12:30:00",
  "Delhi",
  28.65195,
  77.23149,
  5.5
);

console.log("================================================================================");
console.log("1. MUKUL PAL — D1 (NATAL) ASTRONOMICAL POSITIONS");
console.log("================================================================================");
console.log(`Lagna: ${mukul.lagnaRashi} (${mukul.lagnaLon.toFixed(2)}°)`);
console.log(`Moon : ${mukul.planets.Moon.sign} ${mukul.planets.Moon.degree}°${mukul.planets.Moon.minutes}' | Nakshatra: ${mukul.planets.Moon.nakshatra} Pada ${mukul.planets.Moon.pada}`);

Object.entries(mukul.planets).forEach(([p, d]) => {
  console.log(`  ${p.padEnd(8)}: ${d.sign.padEnd(11)} House ${String(d.house).padEnd(2)} ${String(d.degree).padStart(2)}°${String(d.minutes).padStart(2)}' | ${d.nakshatra.padEnd(16)} P${d.pada} | Nav: ${d.navamsha.padEnd(11)} | Dignity: ${d.dignity} ${d.retrograde ? '[R]' : ''}`);
});

console.log("\n================================================================================");
console.log("2. VIMSHOTTARI DASHA AUDIT — EXACT TIMELINES");
console.log("================================================================================");
const now = new Date("2026-10-16");
mukul.dashas.forEach(d => {
  const isCur = new Date(d.start) <= now && now < new Date(d.end);
  console.log(`  MD ${d.planet.padEnd(8)}: ${new Date(d.start).toISOString().slice(0, 10)} to ${new Date(d.end).toISOString().slice(0, 10)} (${d.yrs.toFixed(2)}y) ${isCur ? '<<< ACTIVE MAHADASHA' : ''}`);
});

console.log("\nAntardashas under Active Rahu Mahadasha:");
mukul.antardasha.forEach(a => {
  const isCur = new Date(a.start) <= now && now < new Date(a.end);
  console.log(`    AD ${a.planet.padEnd(8)}: ${new Date(a.start).toISOString().slice(0, 10)} to ${new Date(a.end).toISOString().slice(0, 10)} (${a.yrs.toFixed(2)}y) ${isCur ? '<<< CURRENT ACTIVE ANTARDASHA' : ''}`);
});

const allVargas = calculateDivisional(mukul.planets, mukul.lagnaNum, mukul.lagnaLon);
const d10 = allVargas.find(c => c.key === "D10")!;
const d60 = allVargas.find(c => c.key === "D60")!;
const d9  = allVargas.find(c => c.key === "D9")!;

console.log("\n================================================================================");
console.log("3. D10 (DASHAMSHA) — CAREER, VOCATION & REPUTATION");
console.log("================================================================================");
console.log(`D10 Lagna: ${d10.lagna}`);
d10.planets.forEach(p => {
  console.log(`  ${p.planet.padEnd(8)}: House ${String(p.house).padEnd(2)} Sign: ${p.sign.padEnd(11)} Dignity: ${p.dignity.padEnd(12)} ${p.inLagna ? '[In Lagna]' : ''}`);
});
console.log("\nD10 Automated Insights:");
getDashamshaAnalysis(d10).forEach(i => console.log(`  • ${i}`));

console.log("\n================================================================================");
console.log("4. D60 (SHASHTIAMSHA) — PAST LIFE ROOT KARMA & SANCHITA MATRIX");
console.log("================================================================================");
console.log(`D60 Lagna: ${d60.lagna}`);
const lagnaD60Deity = getShashtiamshaDeity(mukul.lagnaLon);
console.log(`  Lagna D60 Deity: Part ${lagnaD60Deity.part}/60 -> ${lagnaD60Deity.deity} (${lagnaD60Deity.nature})`);

d60.planets.forEach(p => {
  const pd = mukul.planets[p.planet];
  const deityInfo = getShashtiamshaDeity(pd.lon);
  console.log(`  ${p.planet.padEnd(8)}: House ${String(p.house).padEnd(2)} Sign: ${p.sign.padEnd(11)} Dignity: ${p.dignity.padEnd(12)} Deity: ${deityInfo.deity.padEnd(14)} (${deityInfo.nature})`);
});
console.log("\nD60 Automated Insights:");
getShastiamshaAnalysis(d60).forEach(i => console.log(`  • ${i}`));

console.log("\n================================================================================");
console.log("5. JAIMINI KARAKAS & CHARA DASHA");
console.log("================================================================================");
const jaimini = buildJaiminiChart(mukul);
jaimini.karakas.forEach(k => {
  console.log(`  ${k.role.padEnd(5)}: ${k.planet.padEnd(8)} in ${k.sign.padEnd(11)} (${k.degreeInSign.toFixed(2)}°) -> ${k.meaning}`);
});
console.log("\nCurrent Chara Dasha:", jaimini.currentDasha?.sign, `(${jaimini.currentDasha?.startDate?.toISOString().slice(0, 10)} to ${jaimini.currentDasha?.endDate?.toISOString().slice(0, 10)})`);
console.log("Current Chara Antardasha:", jaimini.activeAD?.adSign, `(${jaimini.activeAD?.startDate?.toISOString().slice(0, 10)} to ${jaimini.activeAD?.endDate?.toISOString().slice(0, 10)})`);
console.log("Karakamsha Lagna (KL):", jaimini.karakamsha.karakamshaLagna);
console.log("Arudha Lagna (AL):", jaimini.arudhas.find(a => a.shortName === "AL")?.sign);
console.log("Rajya Pada (A10):", jaimini.arudhas.find(a => a.shortName === "A10")?.sign);
console.log("Upapada Lagna (UL):", jaimini.arudhas.find(a => a.shortName === "UL")?.sign);

