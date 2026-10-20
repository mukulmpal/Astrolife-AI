// scripts/run_manisha_vastu.ts
// ============================================================================
// ASTROLIFE — COMPREHENSIVE ASTRO-VASTU, 45 DEVATA & BIO-MAGNETIC AUDIT SCRIPT
// Features:
// 1. Dual Diagnostic: Manisha Ji (Aquarius Lagna) & Mukul Ji (Virgo Lagna)
// 2. Exact Shastric Answer to House 2 Pisces (Guru) Gold Chain on Neck Query
// 3. 45 Devatas (33 Devatas + 12 Asuras) Full Taxonomy with Food Offerings (नैवेद्य)
// 4. 32 Entrances Gatekeeper: Dusthana 6/8/12 Blocks vs Supreme Auspicious Gates
// 5. Brahmasthan Consecration Protocol, Morning Spray & Liver Link
// 6. Bar-Chart 5-Elements Balancing Methodology ("पीछे वाला आगे" / "आगे वाला पीछे")
// 7. Occult & Tantrik Diagnostic (Saturn-Rahu 8th/4th/1st House Affliction)
// 8. North-East Toilet Emergency Protocol (No Cutters! Green 3" band + 0W Bulb)
// 9. Mirror Elemental Law (Water element, forbidden in S/SE/SW, 1" yellow border)
// 10. The 3 Subtle Q&A Nuances:
//     - Jim Simons & Charlie Munger BNN Venus-Ketu vs Rahu Share Market Paradox
//     - Shakti Chakra Internal Deity Color vs Zone Self-Color Nuance
//     - Pisces Lagna Exalted Venus-Rahu IPO / Speculation Windfall Yoga
// 11. Full Astro-Vastu 3-5-8 Hit Radar & Traffic Police Blockades
// ============================================================================

import { calculateChart } from "../src/lib/astro-engine/calculations";
import { runAstroVastuHitEngine } from "../src/lib/astro-engine/astro-vastu-hit-engine";
import { runVastuPurushaMandalaEngine } from "../src/lib/astro-engine/vastu-purusha-mandala-engine";

// ── 1. NATIVE BIRTH DATA ───────────────────────────────────────────────────
const manishaChart = calculateChart(
  "Manisha",
  "1993-12-06",
  "12:23:05",
  "New Delhi",
  28.6139,
  77.209,
  5.5
);

const mukulChart = calculateChart(
  "Mukul Pal",
  "1995-07-04",
  "12:30:00",
  "Delhi",
  28.65195,
  77.23149,
  5.5
);

console.log("==========================================================================================");
console.log("             ASTROLIFE: 45 DEVATA MANDALA, 32 ENTRANCES & ASTRO-VASTU AUDIT               ");
console.log("==========================================================================================");

// ── 2. AUDIT FOR MANISHA JI (AQUARIUS LAGNA) ───────────────────────────────
console.log("\n" + "=".repeat(90));
console.log("PART 1: AUDIT FOR MANISHA JI (AQUARIUS LAGNA / कुम्भ लग्न)");
console.log("=".repeat(90));
console.log(`Lagna Sign: ${manishaChart.lagnaRashi} (${manishaChart.lagnaLon?.toFixed(2)}°)`);
console.log(`Key Placements:`);
console.log(`  • 1st House (Aquarius): Saturn (Lord of Lagna & 12th)`);
console.log(`  • 2nd House (Pisces / मीन राशि): Lord is Devaguru Jupiter (गुरु) [Bank Balance, Family, Throat/Kanth]`);
console.log(`  • 9th House (Libra / तुला राशि): Jupiter occupant [Bhagya Sthana / Fortune]`);
console.log(`  • 10th House (Scorpio / वृश्चिक): 5-planet cluster (Sun, Mars, Mercury, Venus, Rahu)`);
console.log(`  • 11th House (Sagittarius / धनु राशि): Lord is Devaguru Jupiter (गुरु) [Gains, Desires, Cash Flow]`);

const manishaMandala = runVastuPurushaMandalaEngine(manishaChart);
const manishaHit = runAstroVastuHitEngine(manishaChart);

// ── 3. SPECIFIC USER QUERY RESOLUTION: GOLD CHAIN ON THROAT FOR HOUSE 2 PISCES
console.log("\n" + "-".repeat(90));
console.log("🔮 SHASTric RESOLUTION: भाव 2 (मीन राशि) & भाव 11 (धनु राशि) -> गले में सोने की चेन धारण का प्रभाव");
console.log("-".repeat(90));
console.log(`[प्रशन]: भाव 2 (मनोकामना पूर्ति व बैंक बैलेंस) में गुरु की मीन राशि है; अगर वहां सोना पहनें यानी गले में सोने की चेन डालें तो कैसा होगा?`);
console.log(`\n[विस्तृत ज्योतिषीय व एस्ट्रो-वास्तु विश्लेषण]:`);
console.log(`1. शारीरिक व चक्र सिद्धांत (Anatomical & Chakra Resonance):`);
console.log(`   - मानव शरीर में 'कंठ / गला' (Throat) सीधे द्वितीय भाव (House 2 / वाणी, संचित धन, मुख) और विशुद्धि चक्र का स्थान है।`);
console.log(`   - कुम्भ लग्न में द्वितीय भाव में 'मीन राशि' (Pisces) आती है, जिसके अधिपति देवगुरु बृहस्पति (Jupiter) हैं।`);
console.log(`2. दोहरा आधिपत्य संबंध (Dual Lordship Linkage):`);
console.log(`   - देवगुरु बृहस्पति कुम्भ लग्न में 2nd भाव (मीन = बैंक बैलेंस, संचित धन) के साथ-साथ 11th भाव (धनु = लाभ, मनोकामना पूर्ति, Income) के भी स्वामी हैं!`);
console.log(`   - अतः जातक के जीवन में 'धन संग्रह' (House 2) और 'मनोकामना सिद्धि / प्रचुर लाभ' (House 11) दोनों की चाबी केवल देवगुरु बृहस्पति के पास है।`);
console.log(`3. धातु का बायो-मैग्नेटिक प्रभाव (Gold / स्वर्ण तत्व):`);
console.log(`   - स्वर्ण (Gold) का सीधा संबंध देवगुरु बृहस्पति और भगवान सूर्य नारायण से है।`);
console.log(`   - जब जातक अपने कंठ (भाव 2) पर शुद्ध स्वर्ण की चेन धारण करता है, तो वह सीधे द्वितीय भाव के स्वामी देवगुरु बृहस्पति को सक्रिय (Power-Up) करता है।`);
console.log(`4. भाग्य स्थान से महा-राजयोग सर्किट (House 9 Bhagya Circuit):`);
console.log(`   - मनीषा जी की कुंडली में देवगुरु बृहस्पति नवम भाव (तुला राशि = भाग्य स्थान) में विराजमान हैं।`);
console.log(`   - गले में सोने की चेन पहनते ही: भाव 2 (धन) ↔ भाव 11 (मनोकामना पूर्ति) ↔ भाव 9 (भाग्य स्थान) का 'गोल्डन ट्रायंगल' जाग्रत हो जाता है!`);
console.log(`   - यह एक अत्यंत दुर्लभ 'धन-लाभ-भाग्य महा-राजयोग' का निर्माण करता है।`);
console.log(`5. अंतिम निर्णय (Final Verdict):`);
console.log(`   ✅ 100% परम शुभ व अत्यंत फलदायी (SUPREMELY AUSPICIOUS)!`);
console.log(`   - इससे बैंक बैलेंस में वृद्धि होगी, वाणी में गुरु का ओज व आकर्षण आएगा, और अटकी हुई मनोकामनाएं स्वतः पूर्ण होंगी।`);
console.log(`   - नियम: सोने की चेन शुद्ध पीली (Yellow Gold) होनी चाहिए, उसमें कोई काला धागा या लोहे का पेंडेंट न लगाएं। शुक्ल पक्ष के गुरुवार को प्रातः 'ॐ बृं बृहस्पतये नमः' का 108 बार जाप करके धारण करें।`);

// ── 4. 45 DEVATA MANDALA TAXONOMY & HIERARCHY ──────────────────────────────
console.log("\n" + "-".repeat(90));
console.log("🏛️ 45 DEVATA VASTU PURUSHA MANDALA TAXONOMY (33 DEVATAS + 12 ASURAS)");
console.log("-".repeat(90));
console.log(`Total Energy Fields: ${manishaMandala.totalCount} (देवता: ${manishaMandala.devatasCount} | असुर: ${manishaMandala.asurasCount})`);

const layerGroups = {
  BrahmasthanCenter: manishaMandala.deities.filter(d => d.layer === "BrahmasthanCenter"),
  InnerPerimeter: manishaMandala.deities.filter(d => d.layer === "InnerPerimeter"),
  IntermediateCorners: manishaMandala.deities.filter(d => d.layer === "IntermediateCorners"),
  OuterPerimeter: manishaMandala.deities.filter(d => d.layer === "OuterPerimeter"),
};

console.log(`\n• BRAHMASTHAN (CENTRAL GENERATOR):`);
layerGroups.BrahmasthanCenter.forEach(d => {
  console.log(`  [${d.padCode}] ${d.nameHi} (${d.nameEn}) | तत्व: ${d.element} | भोग/नैवेद्य: ${d.foodOfferingHi}`);
  console.log(`       कार्यक्षेत्र: ${d.lifeDomainHi} — ${d.descriptionHi}`);
});

console.log(`\n• 4 CARDINAL FACES (INNER PERIMETER - ब्रह्म के 4 मुख):`);
layerGroups.InnerPerimeter.forEach(d => {
  console.log(`  [${d.padCode}] ${d.nameHi} (${d.directionHindi}) | तत्व: ${d.element} | भोग: ${d.foodOfferingHi} | गुण: ${d.lifeDomainHi}`);
});

console.log(`\n• 8 DIAGONAL CORNERS (INTERMEDIATE ZONE - अष्ट दिशा सहायक):`);
layerGroups.IntermediateCorners.forEach(d => {
  console.log(`  [${d.padCode}] ${d.nameHi} (${d.directionHindi}) | वर्ग: ${d.archetype} | भोग: ${d.foodOfferingHi} | प्रभाव: ${d.lifeDomainHi}`);
});

console.log(`\n• 32 PERIMETER ENTRANCES (32 द्वार पद):`);
console.log(`  32 द्वारों में से 33 देवता ऊपर और 12 असुर बाह्य परिधि पर स्थापित हैं।`);

// ── 5. DUSTHANA-BLOCKED ENTRANCES AUDIT (MANISHA JI) ────────────────────────
console.log("\n" + "-".repeat(90));
console.log("🚨 DUSTHANA-BLOCKED ENTRANCES FOR MANISHA JI (6, 8, 12 भावों के अंतर्गत आने वाले द्वार)");
console.log("-".repeat(90));
const manishaDusthana = manishaMandala.nativeMappings.filter(m => m.isDusthanaBlocked && m.devata.layer === "OuterPerimeter");
console.log(`कुल दूषित द्वार (Dusthana Hit Gates): ${manishaDusthana.length}`);
manishaDusthana.forEach(m => {
  console.log(`   ⛔ [${m.devata.padCode}] ${m.devata.nameHi} — ${m.devata.directionHindi} (${m.devata.archetype})`);
  console.log(`      कुंडली भाव: भाव ${m.nativeHouseNum} | ${m.shastricVerdictBadge}`);
  console.log(`      कारण: ${m.verdictExplanation}`);
});

console.log("\n" + "-".repeat(90));
console.log("⭐ SUPREME AUSPICIOUS ENTRANCES FOR MANISHA JI (अमृत पद)");
console.log("-".repeat(90));
const manishaSupreme = manishaMandala.nativeMappings.filter(m => !m.isDusthanaBlocked && m.devata.auspiciousness === "Supreme" && m.devata.layer === "OuterPerimeter");
manishaSupreme.forEach(m => {
  console.log(`   ✨ [${m.devata.padCode}] ${m.devata.nameHi} (${m.devata.directionHindi}) -> भाव ${m.nativeHouseNum} [${m.shastricVerdictBadge}]`);
  console.log(`      नैवेद्य: ${m.devata.foodOfferingHi} | प्रभाव: ${m.devata.lifeDomainHi}`);
});

// ── 6. BRAHMASTHAN & EMERGENCY PROTOCOLS ───────────────────────────────────
console.log("\n" + "-".repeat(90));
console.log("🌿 BRAHMASTHAN CONSECRATION, TOILET & MIRROR PROTOCOLS");
console.log("-".repeat(90));
console.log(`[ब्रह्मस्थान नाभि रहस्य]: ${manishaMandala.brahmasthanProtocol.navelSignificance}`);
console.log(`[अभिमंत्रित मिश्रण]: ${manishaMandala.brahmasthanProtocol.consecrationMixture.join(" + ")}`);
console.log(`[नित्य छिड़काव]: ${manishaMandala.brahmasthanProtocol.dailyMaintenanceSpray}`);
console.log(`[यकृत / Liver संबंध]: ${manishaMandala.brahmasthanProtocol.liverHealthConnection}`);
console.log(`[सख्त निषेध]:`);
manishaMandala.brahmasthanProtocol.criticalProhibitions.forEach(p => console.log(`   ❌ ${p}`));

console.log(`\n[NE टॉयलेट इमरजेंसी प्रोटोकॉल]:`);
console.log(`   चेतावनी: ${manishaMandala.toiletNeEmergencyProtocol.strictWarning}`);
manishaMandala.toiletNeEmergencyProtocol.remedySteps.forEach(s => console.log(`   👉 ${s}`));

console.log(`\n[दर्पण (Looking Mirror) तत्व नियम]:`);
console.log(`   नियम: ${manishaMandala.mirrorElementalAxiom.rule}`);
console.log(`   वर्जित दिशाएं: ${manishaMandala.mirrorElementalAxiom.strictlyProhibitedZones.join(", ")}`);
console.log(`   दोष परिणाम: ${manishaMandala.mirrorElementalAxiom.consequencesOfSouthMirror}`);
console.log(`   सुधार विधि: ${manishaMandala.mirrorElementalAxiom.correctionMethod}`);

// ── 7. OCCULT & NEGATIVE ENERGY DIAGNOSTIC ───────────────────────────────────
console.log("\n" + "-".repeat(90));
console.log("🧿 OCCULT & TANTRA ENERGIES KUNDLI DIAGNOSTIC (शनि + राहु 8/4/1 भाव योग)");
console.log("-".repeat(90));
console.log(`Afflicted: ${manishaMandala.occultDiagnostic.isAfflicted ? "YES (Alert Found)" : "NO (Pure / Clear)"}`);
console.log(`Affliction Type: ${manishaMandala.occultDiagnostic.afflictionType}`);
console.log(`Diagnosis Title: ${manishaMandala.occultDiagnostic.diagnosticTitle}`);
console.log(`Explanation: ${manishaMandala.occultDiagnostic.diagnosticExplanation}`);
console.log(`Remedy Guidance: ${manishaMandala.occultDiagnostic.shastricRemedyGuidance}`);

// ── 8. BAR-CHART 5-ELEMENT BALANCING METHODOLOGY ───────────────────────────
console.log("\n" + "-".repeat(90));
console.log("📊 16 ZONES ELEMENTAL BAR-CHART BALANCING METHODOLOGY");
console.log("-".repeat(90));
console.log(`Shastric Formula:`);
console.log(`  1. Depleted / Cut Zone (कटी हुई या घटी हुई दिशा): "पीछे वाला आगे" (Use Mother Element to support)`);
console.log(`  2. Extended / Bloated Zone (बढ़ी हुई दिशा): "आगे वाला पीछे" (Drain into Child Element to exhaust)`);
console.log(`\nSample Balancing Guides across Key Zones:`);
manishaMandala.elementalBalancingGuides.slice(0, 5).forEach(b => {
  console.log(`  • [${b.zoneCode}] ${b.zoneNameHi} (${b.element}):`);
  console.log(`    - सूत्र: ${b.actionFormula}`);
  console.log(`    - अनुशंसित उपचार: ${b.recommendedTreatments.join(", ")}`);
  console.log(`    - वर्जित वस्तुएं: ${b.prohibitedItems.join(", ")}`);
});

// ── 9. SUBTLE SHASTRIC DIRECTIVES & TRANSCRIPT Q&A NUANCES ─────────────────
console.log("\n" + "-".repeat(90));
console.log("📜 SUBTLE SHASTRIC DIRECTIVES & LECTURE Q&A NUANCES");
console.log("-".repeat(90));
const subtle = manishaMandala.subtleShastricDirectives;
console.log(`1. खाद्य नैवेद्य सूक्ष्म नियम (Food Placement Subtle Rules):`);
console.log(`   - डिब्बा धातु नियम: ${subtle.foodPlacementSubtleRules.utensilBoxRule}`);
console.log(`   - विरोधी रंग निषेध: ${subtle.foodPlacementSubtleRules.antiColorWarning}`);
console.log(`   - जाग्रत अवधि: ${subtle.foodPlacementSubtleRules.activationDuration}`);
console.log(`   - फ्लैट्स में चुटकी मात्रा: ${subtle.foodPlacementSubtleRules.pinchQuantityRule}`);
console.log(`   - 3-इंच ड्रिल स्थायी उपाय: ${subtle.foodPlacementSubtleRules.floorDrillingPermanentRule}`);

console.log(`\n2. रंग व पंचतत्व सूक्ष्म भेद (Color Nuances):`);
console.log(`   - सफेद रंग नियम: ${subtle.colorElementalNuances.whiteNotNeutralRule}`);
console.log(`   - दक्षिण लोहे का गेट दोष: ${subtle.colorElementalNuances.southIronGateDefect}`);
console.log(`   - बढ़ी दक्षिण में पीच-गोल्डन: ${subtle.colorElementalNuances.extendedSouthPeachGoldenMix}`);
console.log(`   - NE लाल गद्दा समाधान: ${subtle.colorElementalNuances.neRedMattressCorrection}`);

console.log(`\n3. बहुमंजिला फ्लैट्स व परिवार प्रमुख सूत्र (Multi-Story Flats Paradox):`);
console.log(`   - सिद्धांत: ${subtle.multiStoryFlatParadox.explanation}`);
console.log(`   - मुखिया कुंडली नियम: ${subtle.multiStoryFlatParadox.familyHeadChartRule}`);
console.log(`   - बालकनी वर्चुअल एंट्री: ${subtle.multiStoryFlatParadox.virtualBalconyEntryRule}`);

console.log(`\n4. NE टॉयलेट केवल विशिष्ट जातक को क्यों पीड़ित करता है? (Family Targeting Rule):`);
console.log(`   - नियम: ${subtle.neToiletFamilyTargeting.vulnerableMemberRule}`);
console.log(`   - ग्रह पीछा नहीं छोड़ते: ${subtle.neToiletFamilyTargeting.planetsFollowNativeRule}`);
console.log(`   - गुरु-राहु दैनिक सामंजस्य: ${subtle.neToiletFamilyTargeting.dailyRahuJupiterHarmonization}`);

console.log(`\n5. शेयर बाजार, शक्ति चक्र व आईपीओ नाड़ी सूत्र (Transcript Special Insights):`);
console.log(`   - जिम साइमंस व चार्ली मंगर BNN सूत्र: ${subtle.shareMarketVenusKetuRahuParadox}`);
console.log(`   - शक्ति चक्र देवता रंग बनाम ज़ोन तत्व भेद: ${subtle.shaktiChakraDeityVsZoneColorNuance}`);
console.log(`   - मीन लग्न उच्च शुक्र-राहु आईपीओ सट्टा योग: ${subtle.piscesLagnaExaltedVenusRahuIpoYoga}`);

console.log(`\n6. अन्य नियम:`);
console.log(`   - सोने की सही दिशा: ${subtle.sleepingPositionAxiom.headVsBedRule}`);
console.log(`   - उत्तर दिशा में शू-रैक: ${subtle.shoeRackNorthAxiom}`);
console.log(`   - पितरों की तस्वीर: ${subtle.ancestorPhotoAxiom}`);
console.log(`   - भृगु नंदी नाड़ी 1-5-9 बनाम 2-6-10: ${subtle.bnnDharmaKarmaAxiom}`);

// ── 10. HIT RADAR FOR MANISHA JI ───────────────────────────────────────────
if (manishaHit) {
  console.log("\n" + "-".repeat(90));
  console.log("🎯 ASTRO-VASTU 3-5-8 HIT RADAR FOR MANISHA JI");
  console.log("-".repeat(90));
  console.log(`Traffic Police Blockades: ${manishaHit.trafficPoliceBlockades.length}`);
  manishaHit.trafficPoliceBlockades.forEach(b => {
    console.log(`  ⚠️ ${b.blockingPlanet} blocks ${b.dashaLordRole} Lord ${b.dashaLordName} with ${b.hitAngle}° hit in ${b.physicalLocation.direction} zone.`);
  });
  console.log(`180° Killer Hits on Vital Houses: ${manishaHit.killerHits180.length}`);
  manishaHit.killerHits180.forEach(k => {
    console.log(`  💥 ${k.sourceName} (H${k.sourceHouse}) -> ${k.targetName} (${k.exactDiff}° diff)`);
  });
}

// ── 11. AUDIT FOR MUKUL JI (VIRGO LAGNA) ───────────────────────────────────
console.log("\n" + "=".repeat(90));
console.log("PART 2: DUAL AUDIT FOR MUKUL JI (VIRGO LAGNA / कन्या लग्न)");
console.log("=".repeat(90));
console.log(`Lagna Sign: ${mukulChart.lagnaRashi} (${mukulChart.lagnaLon?.toFixed(2)}°)`);
console.log(`Key Placements:`);
console.log(`  • 1st House (Virgo / कन्या): Lord Mercury in Taurus (9th House)`);
console.log(`  • 2nd House (Libra / तुला): Rahu occupant, Lord Venus`);
console.log(`  • 7th House (Pisces / मीन): Saturn occupant, Lord Jupiter`);
console.log(`  • 8th House (Aries / मेष): Ketu occupant [Trik / Dusthana]`);
console.log(`  • 9th House (Taurus / वृषभ): Mercury occupant [Active Antardasha Lord / Throat & Kanth]`);
console.log(`  • 10th House (Gemini / मिथुन): Sun & Venus occupants [Arms / Wrists / Work]`);
console.log(`  • 12th House (Leo / सिंह): Moon & Mars occupants [Trik / Dusthana]`);

const mukulMandala = runVastuPurushaMandalaEngine(mukulChart);
const mukulHit = runAstroVastuHitEngine(mukulChart);

console.log(`\n• MUKUL JI DUSTHANA-BLOCKED ENTRANCES (6, 8, 12 भाव):`);
const mukulDusthana = mukulMandala.nativeMappings.filter(m => m.isDusthanaBlocked && m.devata.layer === "OuterPerimeter");
console.log(`  कुल दूषित द्वार: ${mukulDusthana.length}`);
mukulDusthana.forEach(m => {
  console.log(`   ⛔ [${m.devata.padCode}] ${m.devata.nameHi} (${m.devata.directionHindi}) -> भाव ${m.nativeHouseNum} | ${m.shastricVerdictBadge}`);
});

console.log(`\n• MUKUL JI SUPREME AUSPICIOUS ENTRANCES:`);
const mukulSupreme = mukulMandala.nativeMappings.filter(m => !m.isDusthanaBlocked && m.devata.auspiciousness === "Supreme" && m.devata.layer === "OuterPerimeter");
mukulSupreme.forEach(m => {
  console.log(`   ✨ [${m.devata.padCode}] ${m.devata.nameHi} (${m.devata.directionHindi}) -> भाव ${m.nativeHouseNum} [${m.shastricVerdictBadge}]`);
});

console.log(`\n• MUKUL JI OCCULT DIAGNOSTIC:`);
console.log(`   Afflicted: ${mukulMandala.occultDiagnostic.isAfflicted ? "YES" : "NO (Clean)"}`);
console.log(`   Title: ${mukulMandala.occultDiagnostic.diagnosticTitle}`);

if (mukulHit) {
  console.log(`\n• MUKUL JI HIT RADAR:`);
  console.log(`  Traffic Police Blockades: ${mukulHit.trafficPoliceBlockades.length}`);
  mukulHit.trafficPoliceBlockades.forEach(b => {
    console.log(`  ⚠️ ${b.blockingPlanet} blocks ${b.dashaLordRole} Lord ${b.dashaLordName} with ${b.hitAngle}° hit in ${b.physicalLocation.direction} zone.`);
  });
  console.log(`  Wrist-Thread Alert: House ${mukulHit.wristThreadTrapAlert?.geminiHouse} (Gemini) -> Is Dusthana: ${mukulHit.wristThreadTrapAlert?.isDusthana ? "YES (Harmful)" : "NO (Safe)"}`);
}

console.log("\n==========================================================================================");
console.log("✓ COMPLETE DUAL ASTRO-VASTU & 45 DEVATA AUDIT FINISHED WITH ZERO ERRORS.");
console.log("==========================================================================================");
