// scripts/run_manisha_vastu.ts
// ============================================================================
// ASTROLIFE — MANISHA & MUKUL ASTRO-VASTU & 45 DEVATA AUDIT SCRIPT
// Computes 45 Devatas (33 Devatas + 12 Asuras), 32 Entrances, Brahmasthan,
// Bar-Chart 5-Elements Balancing, and Occult/Tantra Diagnostic from Transcript
// ============================================================================

import { calculateChart } from "../src/lib/astro-engine/calculations";
import { runAstroVastuHitEngine } from "../src/lib/astro-engine/astro-vastu-hit-engine";
import { runVastuPurushaMandalaEngine } from "../src/lib/astro-engine/vastu-purusha-mandala-engine";

const manishaChart = calculateChart(
  "Manisha",
  "1993-12-06",
  "12:23:05",
  "New Delhi",
  28.6139,
  77.209,
  5.5
);

console.log("=================================================================");
console.log("🏛️ ASTROLIFE: 45 DEVATAS & ASTRO-VASTU AUDIT FOR MANISHA JI");
console.log("=================================================================");
console.log(`Lagna: ${manishaChart.lagnaRashi} (${manishaChart.lagnaLon?.toFixed(2)}°)`);

// 1. Run 45 Devata & 32 Entrance Engine
const mandalaDossier = runVastuPurushaMandalaEngine(manishaChart);

console.log(`\n1. 45 DEVATA MANDALA SUMMARY:`);
console.log(`   - Total Entities: ${mandalaDossier.totalCount} (${mandalaDossier.devatasCount} Devatas + ${mandalaDossier.asurasCount} Asuras)`);
console.log(`   - Brahmasthan Formula: ${mandalaDossier.brahmasthanProtocol.consecrationMixture.join(", ")}`);
console.log(`   - Brahmasthan Navel Principle: ${mandalaDossier.brahmasthanProtocol.navelSignificance}`);

console.log(`\n2. OCCULT & NEGATIVE ENERGY DIAGNOSTIC (शनि + राहु 8/4/1 भाव योग):`);
console.log(`   - Afflicted: ${mandalaDossier.occultDiagnostic.isAfflicted ? "YES (Alert)" : "NO (Pure / Clear)"}`);
console.log(`   - Diagnosis: ${mandalaDossier.occultDiagnostic.diagnosticTitle}`);
console.log(`   - Explanation: ${mandalaDossier.occultDiagnostic.diagnosticExplanation}`);
console.log(`   - Remedial Advice: ${mandalaDossier.occultDiagnostic.shastricRemedyGuidance}`);

console.log(`\n3. DUSTHANA-BLOCKED ENTRANCES FOR MANISHA (6, 8, 12 भावों के अंतर्गत आने वाले द्वार):`);
const dusthanaEntrances = mandalaDossier.nativeMappings.filter(m => m.isDusthanaBlocked && m.devata.layer === "OuterPerimeter");
dusthanaEntrances.forEach(m => {
  console.log(`   🚨 [${m.devata.padCode}] ${m.devata.nameHi} — ${m.devata.directionHindi}`);
  console.log(`      कुंडली भाव: भाव ${m.nativeHouseNum} | ${m.shastricVerdictBadge}`);
  console.log(`      चेतावनी: ${m.verdictExplanation}`);
});

console.log(`\n4. SUPREME AUSPICIOUS ENTRANCES FOR MANISHA (अमृत पद):`);
const supremeBenefic = mandalaDossier.nativeMappings.filter(m => !m.isDusthanaBlocked && m.devata.auspiciousness === "Supreme" && m.devata.layer === "OuterPerimeter");
supremeBenefic.slice(0, 6).forEach(m => {
  console.log(`   ✅ [${m.devata.padCode}] ${m.devata.nameHi} (${m.devata.directionHindi}) -> भाव ${m.nativeHouseNum} (शुभ फलदायी)`);
});

// 2. Run Hit Theory Engine
const hitDossier = runAstroVastuHitEngine(manishaChart);
if (hitDossier) {
  console.log(`\n5. ASTRO-VASTU 3-5-8 HIT RADAR:`);
  console.log(`   - Active Traffic Police Blockades: ${hitDossier.trafficPoliceBlockades.length}`);
  hitDossier.trafficPoliceBlockades.forEach(b => {
    console.log(`     ⚠️ ${b.blockingPlanet} blocks ${b.dashaLordRole} Lord ${b.dashaLordName} with ${b.hitAngle}° hit in ${b.physicalLocation.direction} zone.`);
  });
  console.log(`   - 180° Killer Hits on Vital Houses: ${hitDossier.killerHits180.length}`);
  hitDossier.killerHits180.forEach(k => {
    console.log(`     💥 ${k.sourceName} (H${k.sourceHouse}) -> ${k.targetName} (${k.exactDiff}° diff)`);
  });
}

console.log("\n=================================================================");
console.log("✓ Audit Completed Successfully.");
console.log("=================================================================");
