// src/lib/ai-chat/master-astro-context.ts
// AstroLife Master Multi-Engine Context Generator for AI Chat
// Unifies ALL 13+ Astrological & Esoteric Engines into a single, structured,
// evidence-rich context payload for LLM prompts.

import type { ChartData } from "../astro-engine/calculations";
import { runNavtaraIntelligence } from "../astro-engine/navtara-engine";
import { resolvePlanetTattvaRemedy } from "../astro-engine/navtara-remedies";
import { buildNakshatraRemedyLlmPromptBlock } from "../astro-engine/nakshatra-remedy-engine";
import { evaluateDashaActivationWindows } from "../astro-engine/transit-trigger";
import { runKPEngine } from "../astro-engine/kp";
import { calculateLalKitab } from "../astro-engine/lalkitab";
import { buildJaiminiChart } from "../astro-engine/jaimini";
import { detectYogas, calculateYogaScore } from "../astro-engine/yogas";
import { calculateAshtakavarga } from "../astro-engine/ashtakavarga";
import { calculateShadbala } from "../astro-engine/shadbala";
import { calculateMedical } from "../astro-engine/medical";
import { calculateNumerology } from "../astro-engine/numerology";
import { buildNatalChartFromAnyChart, generateGemstoneReport } from "../astro-engine/gemstone";
import { calculateSpecialLagnas } from "../astro-engine/special-lagnas";
import { calculateVastu } from "../astro-engine/vastu";
import { calculateSarvatobhadra } from "../astro-engine/sarvatobhadra";
import { scanMarriageWindows } from "../astro-engine/marriage-window-scanner";
import { calculateLineageKarma } from "../astro-engine/lineage-karma";
import { evaluateMarriageIntelligence } from "../astro-engine/marriage-intelligence";
import { detectConditionalDashas } from "../astro-engine/marriage-timing-kn-rao";
import { evaluateCorePlanetRemedy, getMoonSharingGuide, resolveContextualRemedies } from "../astro-engine/core-planet-remedies";
import { buildMasterTransitRadarDossier } from "../astro-engine/property-transit-predictor";
import type { DashaLord } from "../astro-engine/dasha";

/**
 * Builds a comprehensive, unified astrological context from ALL engines.
 * Each section is wrapped in protective try-catches to ensure 100% resilience.
 */
export function buildMasterAstroContext(chart: ChartData | null | undefined): string {
  if (!chart || !chart.planets || !chart.lagnaRashi) {
    return "";
  }

  const sections: string[] = [];

  // ── 1. CORE NATAL IDENTITY ──────────────────────────────────────────────────
  try {
    const activeMD = chart.dashas?.find((d) => d.active);
    const activeAD = chart.antardasha?.find((a) => a.active);
    const planetSummary = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
      .map((p) => {
        const d = chart.planets[p];
        if (!d) return null;
        const retro = d.retrograde ? " (R)" : "";
        const dignity = d.dignity ? ` [${d.dignity}]` : "";
        return `${p}: ${d.sign} H${d.house} (${d.degree}°${d.minutes}' ${d.nakshatra} P${d.pada})${dignity}${retro}`;
      })
      .filter(Boolean)
      .join("; ");

    sections.push(`### 1. CORE NATAL IDENTITY & PLACEMENTS
- Native: ${chart.name || "Seeker"} | DOB: ${chart.dob} ${chart.tob} | Place: ${chart.city} (Lat ${chart.lat?.toFixed(2)}°, Lon ${chart.lon?.toFixed(2)}°)
- Ascendant (Lagna): ${chart.lagnaRashi} at ${chart.lagnaLon?.toFixed(2)}°
- Planetary Coordinates: ${planetSummary}
- Active Vimshottari Dasha: Mahadasha ${activeMD?.planet || "Unknown"} (${activeMD?.start?.getFullYear() ?? ""}-${activeMD?.end?.getFullYear() ?? ""}) · Antardasha ${activeAD?.planet || "Unknown"}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Core identity error:", err);
  }

  // ── 2. NAVTARA MASTER ENGINE INTELLIGENCE ───────────────────────────────────
  try {
    const navtara = runNavtaraIntelligence(chart);
    const activeAudit = navtara.dashaAudit;

    const layer1 = activeAudit?.layers?.[0];
    const layer2 = activeAudit?.layers?.[1];
    const layer3 = activeAudit?.layers?.[2];

    const layer1Info = layer1
      ? `Layer 1 (${layer1.label}: ${layer1.planet}): Tara #${layer1.tara.taraNum} ${layer1.tara.name} (${layer1.tara.category}, ${layer1.paryaya})`
      : "Layer 1: N/A";

    const layer2Info = layer2
      ? `Layer 2 (${layer2.label}: ${layer2.planet}): Tara #${layer2.tara.taraNum} ${layer2.tara.name} (${layer2.tara.category})`
      : "Layer 2: N/A";

    const layer3Info = layer3
      ? `Layer 3 (${layer3.label} [${layer3.basis}]: ${layer3.planet}): Tara #${layer3.tara.taraNum} ${layer3.tara.name} (${layer3.tara.category})`
      : "";

    const patternInfo = activeAudit
      ? `Dasha Pattern: ${activeAudit.pattern} (${activeAudit.patternSeverity} severity) — ${activeAudit.patternDescription}`
      : "Dasha Audit: Pending";

    const boundaryText = navtara.boundaryAlerts.length > 0
      ? navtara.boundaryAlerts.map((b) => `${b.alertText} [${b.severity}]`).join("; ")
      : "All planets secure well within Nakshatra boundaries (no Lahiri-KP boundary shifts).";

    // Active Dasha Tattva Remedy
    let tattvaRemedyText = "";
    if (activeAudit?.activeMahadasha) {
      const dPlanet = activeAudit.activeMahadasha;
      const pData = chart.planets[dPlanet];
      if (pData) {
        const rem = resolvePlanetTattvaRemedy(
          dPlanet,
          pData.sign,
          pData.signNum,
          pData.house,
          pData.bhavaHouse !== pData.house ? pData.bhavaHouse : undefined
        );
        tattvaRemedyText = `Tattva Upay: Element ${rem.tattva} (${rem.tattvaVector.sanskritName}). Method: ${rem.harmonizationGuidance}`;
        if (rem.specificPrescription) {
          tattvaRemedyText += ` Specific Substance: ${rem.specificPrescription.substances.join(", ")} (${rem.specificPrescription.traditionalMethod}).`;
        }
      }
    }

    // Transit Trigger Windows
    let triggerWindowsText = "";
    if (activeAudit?.activeMahadasha) {
      const dPlanet = activeAudit.activeMahadasha;
      const isConcern = activeAudit.pattern === "DOUBLE_CONCERN" || activeAudit.pattern === "TRIPLE_CONCERN";
      const triggers = evaluateDashaActivationWindows(dPlanet, isConcern);
      triggerWindowsText = triggers.map((t) => `${t.triggerPlanet} into ${t.targetSign} (${t.windowType === "ACTIVATION_WINDOW" ? "Golden Activation" : "Caution Period"})`).join("; ");
    }

    sections.push(`### 2. NAVTARA MASTER ENGINE (CHITRAPAKSHA & KP SYNERGY)
- Birth Star (Janma Nakshatra): ${navtara.birthNakshatra.name} (Pada ${navtara.birthPada}) · Lord: ${navtara.birthNakshatra.lord} · Devta: ${navtara.birthNakshatra.devta} · Quality: ${navtara.birthNakshatra.primaryQuality}
- 27th Support Star Shield (Preceding Star): ${navtara.supportStarShield.nakshatra.name} (${navtara.supportStarShield.nakshatra.lord}) — Anchor: ${navtara.supportStarShield.anchors.symbol} / ${navtara.supportStarShield.anchors.bird} (Archetype: Mor-Pankh Shield)
- Birth Star Quality Profile: Channelling Lord ${navtara.qualityProfile.channellingLord} · Innate Temperament: ${navtara.qualityProfile.temperamentTitle} (${navtara.qualityProfile.description})
- 3-Layer Dasha Audit:
  ✦ ${layer1Info}
  ✦ ${layer2Info}
  ${layer3Info ? `✦ ${layer3Info}` : ""}
  ✦ ${patternInfo}
- Boundary Sensitivity Alerts: ${boundaryText}
${tattvaRemedyText ? `- Remedial Prescription: ${tattvaRemedyText}` : ""}
${triggerWindowsText ? `- Dasha Transit Triggers: ${triggerWindowsText}` : ""}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Navtara error:", err);
  }

  // ── 2B. AUTHENTIC NAKSHATRA & ELEMENTAL REMEDY INTELLIGENCE ─────────────────
  try {
    const nakshatraRemedyBlock = buildNakshatraRemedyLlmPromptBlock(chart);
    if (nakshatraRemedyBlock) {
      sections.push(nakshatraRemedyBlock);
    }
  } catch (err) {
    console.warn("[MasterAstroContext] Nakshatra remedy block error:", err);
  }

  // ── 3. KP SYSTEM (KRISHNAMURTI PADDHATI) ────────────────────────────────────
  try {
    const kp = runKPEngine(chart);
    const keyCusps = [
      kp.cusps[0] ? `H1 (Lagna): ${kp.cusps[0].sign} | Star: ${kp.cusps[0].starLord} | Sub: ${kp.cusps[0].subLord}` : null,
      kp.cusps[1] ? `H2 (Wealth): ${kp.cusps[1].sign} | Sub: ${kp.cusps[1].subLord}` : null,
      kp.cusps[6] ? `H7 (Marriage): ${kp.cusps[6].sign} | Star: ${kp.cusps[6].starLord} | Sub: ${kp.cusps[6].subLord}` : null,
      kp.cusps[9] ? `H10 (Career): ${kp.cusps[9].sign} | Star: ${kp.cusps[9].starLord} | Sub: ${kp.cusps[9].subLord}` : null,
      kp.cusps[10] ? `H11 (Gains): ${kp.cusps[10].sign} | Sub: ${kp.cusps[10].subLord}` : null,
    ].filter(Boolean).join(" · ");

    const topicPromises = kp.significators
      .filter((s) => ["career", "marriage", "wealth", "health"].includes(s.topic))
      .map((s) => `${s.label}: Score ${s.score}/100 (${s.verdict.toUpperCase()}) — ${s.cuspPromise} | Dasha Link: ${s.dashaLink}`)
      .join("\n  ✦ ");

    const bhavaShifts = kp.rows
      .filter((r) => r.bhavaShift !== 0)
      .map((r) => `${r.name}: Whole Sign H${r.rashiHouse} → Placidus Bhava H${r.bhavaHouse} (${r.bhavaShift > 0 ? "+1 forward" : "-1 backward"})`)
      .join("; ");

    sections.push(`### 3. KP SYSTEM (KRISHNAMURTI PADDHATI & PLACIDUS CUSPS)
- Key House Cusps & Sub-Lords:
  ✦ ${keyCusps}
- KP Event Topic Promises (2-6-10-11 for Career, 2-7-11 for Marriage, 2-11 for Wealth):
  ✦ ${topicPromises}
- Placidus Bhava Shifts: ${bhavaShifts || "No house shifts; all planets remain in their whole sign bhava."}`);
  } catch (err) {
    console.warn("[MasterAstroContext] KP error:", err);
  }

  // ── 4. LAL KITAB SYSTEM ─────────────────────────────────────────────────────
  try {
    const lk = calculateLalKitab(chart.planets, chart.dob, chart.lagnaNum);

    const kismatInfo = lk.kismat
      ? `Kismat Jagane Wala Grah: ${lk.kismat.planet} in House ${lk.kismat.house} (Score: ${lk.kismat.score}/100) — ${lk.kismat.interpretation}`
      : "Kismat Grah: Balanced";

    const rinsInfo = lk.rins && lk.rins.length > 0
      ? lk.rins.map((r) => `${r.rin} (H${r.house} ${r.planet}): Upay — ${r.upaya}`).join("\n  ✦ ")
      : "No severe ancestral Rin/Debt active in chart.";

    const pakkaPlanets = lk.planets.filter((p) => p.status === "pakka").map((p) => `${p.planet} (H${p.house})`).join(", ") || "None";
    const dushmanPlanets = lk.planets.filter((p) => p.status === "dushman").map((p) => `${p.planet} (H${p.house})`).join(", ") || "None";
    const soyaPlanets = lk.coreAccuracy.filter((c) => c.soya).map((c) => `${c.planet} (H${c.house})`).join(", ") || "None";

    const varshInfo = lk.varshphal
      ? `Current Age Varshphal (Year ${lk.varshphal.year}): ${lk.varshphal.summary}. Shubh: ${lk.varshphal.shubhPlanets.join(", ") || "None"} | Caution: ${lk.varshphal.cautionPlanets.join(", ") || "None"}`
      : "";

    sections.push(`### 4. LAL KITAB (RED BOOK KARMIC INTELLIGENCE)
- ${kismatInfo}
- Planetary Ghar Status:
  ✦ Pakka Ghar (Own Strong Base): ${pakkaPlanets}
  ✦ Dushman Ghar (Enemy House Tension): ${dushmanPlanets}
  ✦ Soya Grah (Dormant requiring trigger): ${soyaPlanets}
- Active Karmic Debts (Rin Siddhant):
  ✦ ${rinsInfo}
${varshInfo ? `- Annual Varshphal: ${varshInfo}` : ""}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Lal Kitab error:", err);
  }

  // ── 5. JAIMINI SUTRAS & CHARA DASHA (LAYER 4) ──────────────────────────────
  try {
    const jaimini = buildJaiminiChart(chart);

    const karakasSummary = jaimini.karakas
      .map((k) => `${k.role}: ${k.planet} in ${k.sign} (${k.degreeInSign.toFixed(1)}°) — ${k.signifies}`)
      .join("\n  ✦ ");

    const arudhasSummary = [
      jaimini.arudhas.find((a) => a.shortName === "AL"),
      jaimini.arudhas.find((a) => a.shortName === "UL"),
      jaimini.arudhas.find((a) => a.shortName === "A10"),
    ]
      .filter(Boolean)
      .map((a) => `${a?.name} (${a?.shortName}): in ${a?.sign}`)
      .join(" · ");

    const charaDashaInfo = jaimini.currentDasha
      ? `Active Chara Dasha: ${jaimini.currentDasha.sign} (${jaimini.currentDasha.startDate.getFullYear()} - ${jaimini.currentDasha.endDate.getFullYear()}) [${jaimini.direction} Sequence]${jaimini.activeAD ? ` · Antardasha: ${jaimini.activeAD.adSign}` : ""}`
      : "Chara Dasha: Pending";

    const jaiminiYogas = jaimini.rajaYogas.length > 0
      ? jaimini.rajaYogas.map((y) => `${y.name} (${y.strength}): ${y.description}`).join("; ")
      : "None";

    const gk = jaimini.gkAnalysis;
    const bk = jaimini.bkAnalysis;
    const bkSub = jaimini.bkSubconscious;
    const mk = jaimini.mkEducation;
    const pk = jaimini.pkPurvaPunya;
    const lm = jaimini.loveMarriageAnalysis;
    const dk = jaimini.dkAnalysis;
    const akAmk = jaimini.akAmkAnalysis;
    const kk = jaimini.karakamsha;
    const dl = jaimini.currentDashaLagna;
    const retro = jaimini.retrogradeActivation;

    const afflictedPlanetsStr = gk.afflictedPlanets
      .filter((p) => !p.isAdjacentProtected)
      .map((p) => `${p.planet} in ${p.sign} (${p.effect})`)
      .join("; ") || "None";

    const adjacentProtectedStr = gk.afflictedPlanets
      .filter((p) => p.isAdjacentProtected)
      .map((p) => `${p.planet} in ${p.sign}`)
      .join(", ") || "None";

    const retroStr = retro.length > 0
      ? retro.map((r) => `${r.planet} (H${r.houseFromLagna}): ${r.guidance}`).join("\n  ✦ ")
      : "No retrograde planets requiring activation.";

    const dashaLagnaStr = dl
      ? `Active Dasha Lagna (${dl.dashaSign}):\n  ✦ AK in H${dl.akAnalysis.house} (${dl.akAnalysis.status}): ${dl.akAnalysis.verdict}\n  ✦ AmK in H${dl.amkAnalysis.house} (${dl.amkAnalysis.status}): ${dl.amkAnalysis.verdict}\n  ✦ GK in H${dl.gkAnalysis.house}: ${dl.gkAnalysis.warning}\n  ✦ DK in H${dl.dkAnalysis.house}: ${dl.dkAnalysis.verdict}`
      : "Dasha Lagna: Pending";

    sections.push(`### 5. JAIMINI SUTRAS & CHARA DASHA (LAYER 4 SYSTEM — DO NOT MIX FORMULAS WITH VEDIC/KP)
- Chara Karakas (Degree-Wise Hierarchy, Rahu/Ketu Strictly Excluded):
  ✦ ${karakasSummary}
- Dynamic Dasha Lagna (5th Pillar of Jaimini — Rotating Active Dasha as Lagna):
  ✦ ${dashaLagnaStr}
- Karakamsha Kundali (D9 Navamsha Base: AK ${kk.akPlanet} in ${kk.d9Sign} establishes Karakamsha Lagna; D1 natal planets remain in natal signs):
  ✦ Soul Essence: ${kk.staticAnalysis.soulPurpose}
  ✦ Wealth Source (H2 from Karakamsha): ${kk.staticAnalysis.wealthSource}
  ✦ Career Destiny (H10 from Karakamsha): ${kk.staticAnalysis.careerDestiny}
- Gnatikaraka (GK — Problem, Rog, Karz & Obstacle Radar — SABSE IMPORTANT):
  ✦ GK Planet: ${gk.gkPlanet} in House ${gk.gkHouseFromLagna} (${gk.gkSign})
  ${gk.isGkLagnaLord ? `✦ ⚠️ ${gk.gkLagnaLordDiagnosis}\n  ` : ""}✦ House Testing: ${gk.houseProblem}
  ✦ Disease Tendencies: ${gk.diseases.join(", ")}
  ✦ GK Drishti on Planets: ${afflictedPlanetsStr}
  ✦ Adjacent Sign Rule Protection: ${adjacentProtectedStr} (Protected from GK aspect)
  ✦ Prescribed Upay (Remedies): ${gk.remedies.join(" | ")}
  ✦ ⛔ STRICT GEMSTONE WARNING: NEVER wear the gemstone of GK (${gk.gkPlanet})! It inflates disease, debt, and lawsuits.
  ✦ GK Active Alert: ${gk.isCurrentDashaAfflicted ? "⚠️ YES — CURRENT CHARA DASHA ACTIVATES GK KARMIC TESTING!" : "No active GK dasha"}
- BK Subconscious Mind & Repeated Failure Skill Mastery:
  ✦ BK Planet: ${bkSub.bkPlanet} in House ${bkSub.bkHouseFromLagna} (${bkSub.bkSign})
  ✦ Subconscious Drive: ${bkSub.subconsciousDrive}
  ✦ Initial Failure Testing Zone: ${bkSub.failureTestZone}
  ✦ Ultimate Mastery Skill: ${bkSub.masterySkill}
- MK Education Stream & Parental Nature:
  ✦ MK Planet: ${mk.mkPlanet} in House ${mk.mkHouseFromLagna} (${mk.mkSign})
  ✦ Education Stream: ${mk.educationStream}
  ✦ Parental Nature: ${mk.parentalNature}
  ✦ Mental Peace Source: ${mk.mentalPeaceSource}
- PK Purva Punya & Progeny Blessing:
  ✦ PK Planet: ${pk.pkPlanet} in House ${pk.pkHouseFromLagna} (${pk.pkSign})
  ✦ Past Life Good Karma: ${pk.purvaPunyaStatus}
  ✦ Intellect Style: ${pk.intellectQuality}
  ✦ Progeny Blessing & Nature: ${pk.progenyBlessing} (Timing Signs: ${pk.progenyTimingSigns.join(", ")})
- Love Marriage Indicator (Bhavat Bhavam: 5th from 7th = 11th House):
  ✦ Status: ${lm.isLoveMarriageIndicated ? "❤️ Love / Romance Driven Marriage Indicated" : "Traditional / Arranged Family Alignment"}
  ✦ Verdict: ${lm.verdict}
  ${lm.evidence.length > 0 ? `✦ Evidence: ${lm.evidence.join(" | ")}` : ""}
- Darakaraka (DK — Spouse & Marriage Timing):
  ✦ DK Planet: ${dk.dkPlanet} in ${dk.dkSign}
  ✦ Spouse Archetype: ${dk.spousePersona} (Key Traits: ${dk.spouseTraits.join(", ")})
  ${dk.hasDkObstacle ? `✦ ⚠️ ${dk.dkObstacleWarning}\n  ` : ""}✦ Marriage Timing Windows: ${dk.marriageTimingSigns.join(", ")} Chara Dashas
- AK/AmK Status, Life Horizon & Rajayoga:
  ✦ AK (${akAmk.akPlanet} in H${akAmk.akHouseFromLagna} ${akAmk.akSign}): ${akAmk.akStatus} — Fame Timing: ${akAmk.akFameTimingSigns.join(", ")}
  ✦ AK Life Horizon (Transcript Rule: "Us house ke bahar life nahi ja sakti"): ${akAmk.akLifeSphere.transcriptRule} (${akAmk.akLifeSphere.focus})
  ✦ AK Physical & Personality Clues: ${akAmk.akPhysicalMentalTraits.join("; ")}
  ✦ AmK (${akAmk.amkPlanet} in H${akAmk.amkHouseFromLagna} ${akAmk.amkSign}): ${akAmk.amkStatus} (${akAmk.amkCareerField}) — Wealth Surge: ${akAmk.amkGrowthTimingSigns.join(", ")}
  ✦ AmK Wealth Channel ("Wahan se paisa aayega"): ${akAmk.amkWealthChannel.channel} (Key Fields: ${akAmk.amkWealthChannel.practicalField})
  ✦ Rajayoga Status: ${akAmk.rajayogaTier} (${akAmk.rajayogaDescription})
- Retrograde Planet Potential & Activation (Hanuman-ji Principle):
  ✦ ${retroStr}
- Arudha Padas: ${arudhasSummary} (AL = Public Perception, UL = True Marriage Partner)
- ${charaDashaInfo}
- Focus Note: In Jaimini timing, focus sharply on Antardasha within the active Chara Dasha for exact manifestation windows.`);
  } catch (err) {
    console.warn("[MasterAstroContext] Jaimini error:", err);
  }

  // ── 6. YOGAS & COMBINATIONS ─────────────────────────────────────────────────
  try {
    const allYogas = detectYogas(chart.planets, chart.lagnaNum, "elite");
    const presentYogas = allYogas.filter((y) => y.present);
    const yogaScore = calculateYogaScore(presentYogas);

    const rajaYogas = presentYogas.filter((y) => y.category === "Raja Yogas" || y.category === "Pancha Mahapurusha").map((y) => y.name).join(", ") || "None";
    const dhanaYogas = presentYogas.filter((y) => y.category === "Dhana Yogas").map((y) => y.name).join(", ") || "None";
    const doshas = presentYogas.filter((y) => y.isDosha).map((y) => `${y.name}${y.remedy ? ` (Upay: ${y.remedy})` : ""}`).join("; ") || "None";
    const spiritualYogas = presentYogas.filter((y) => y.category === "Spiritual Yogas").map((y) => y.name).join(", ") || "None";

    sections.push(`### 6. CLASSICAL YOGAS & DOSHAS
- Overall Yoga Score: ${yogaScore.total}/100 (${yogaScore.rating}) | Rare Yogas Present: ${yogaScore.rareCount}
- Raja Yogas & Mahapurusha: ${rajaYogas}
- Dhana Yogas (Wealth Formations): ${dhanaYogas}
- Spiritual & Dharma Yogas: ${spiritualYogas}
- Active Doshas & Afflictions: ${doshas}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Yogas error:", err);
  }

  // ── 7. ASHTAKAVARGA (SAV) ───────────────────────────────────────────────────
  try {
    const akv = calculateAshtakavarga(chart.planets, chart.lagnaNum);

    const housePoints = akv.houses
      .map((h) => `H${h.house} (${h.name}): ${h.score} pts [${h.grade}]`)
      .join(" · ");

    const strongestHouses = akv.strongest.map((idx) => `H${idx + 1} (${akv.houses[idx]?.name || ""})`).join(", ");
    const weakestHouses = akv.weakest.map((idx) => `H${idx + 1} (${akv.houses[idx]?.name || ""})`).join(", ");

    sections.push(`### 7. ASHTAKAVARGA (SARVASHTAKAVARGA ENERGETIC MATRIX)
- Total SAV Bindus: ${akv.sarvaTotal} / 337 baseline standard (${akv.sarvaTotal >= 337 ? "Strong Cosmic Momentum" : "Requires Targeted Remedial Support"})
- House Strengths: ${housePoints}
- Highest Support Areas (Effortless fruition >= 28 pts): ${strongestHouses}
- Vulnerable Life Areas (Requires conscious discipline & remedies < 25 pts): ${weakestHouses}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Ashtakavarga error:", err);
  }

  // ── 8. SHADBALA (PLANETARY POTENCIES) ───────────────────────────────────────
  try {
    const birthHour = parseInt(chart.tob?.split(":")[0] || "12", 10);
    const shadbala = calculateShadbala(chart.planets, isNaN(birthHour) ? 12 : birthHour);

    const planetRanks = shadbala.planets
      .map((p) => `${p.planet}: ${p.percentage}% [${p.grade}] (Dig: ${p.digBala}/10, Sthana: ${p.sthanaBala}/10)`)
      .join(" · ");

    sections.push(`### 8. SHADBALA (6-FOLD PLANETARY POTENCY)
- Strongest Graha: ${shadbala.strongest} | Weakest Graha: ${shadbala.weakest} | Average Chart Potency: ${shadbala.avgStrength}%
- Planetary Scores: ${planetRanks}
- Potency Guidance: ${shadbala.summary}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Shadbala error:", err);
  }

  // ── 9. AYURVEDA & MEDICAL ASTROLOGY ─────────────────────────────────────────
  try {
    const medical = calculateMedical(chart);

    const tridoshaStr = `Vata ${medical.tridoshaBreakdown.vata}%, Pitta ${medical.tridoshaBreakdown.pitta}%, Kapha ${medical.tridoshaBreakdown.kapha}% → Dominant: ${medical.tridoshaBreakdown.dominant} (${medical.tridoshaBreakdown.constitutionType})`;
    const agniStr = `${medical.agniProfile.title} (${medical.agniProfile.type}) — ${medical.agniProfile.tendency}. Protocol: ${medical.agniProfile.balancingProtocol}`;
    const ojasStr = `Ojas Resilience Index: ${medical.ojasScore}/100 (${medical.ojasRating})`;

    const concerns = medical.topConcerns.length > 0
      ? medical.topConcerns.join(", ")
      : "Balanced vitality, no acute Ayurvedic dosha aggravation.";

    sections.push(`### 9. AYURVEDIC CONSTITUTION & MEDICAL ASTROLOGY
- Tri-Dosha Prakriti: ${tridoshaStr}
- Agni (Digestive Fire): ${agniStr}
- ${ojasStr}
- Vulnerable Anatomical Zones / Sensitivities: ${concerns} (Overall Risk: ${medical.riskLevel.toUpperCase()})
- Health Guardrail: Astrological guidance supports lifestyle balance only; consult licensed medical professionals for physical symptoms.`);
  } catch (err) {
    console.warn("[MasterAstroContext] Medical error:", err);
  }

  // ── 10. NUMEROLOGY ENGINE ───────────────────────────────────────────────────
  try {
    const num = calculateNumerology(chart.name || "Seeker", chart.dob);

    const karmicDebts = num.karmicDebts.length > 0
      ? num.karmicDebts.map((d) => `Number ${d.number}: ${d.meaning} (Remedy: ${d.remedy})`).join("; ")
      : "None";

    sections.push(`### 10. NUMEROLOGY BLUEPRINT (PYTHAGOREAN & VEDIC SYNERGY)
- Life Path Number: ${num.lifePath.value} (${num.lifePath.archetype}) · Ruling Planet: ${num.lifePath.planet} · Keyword: ${num.lifePath.keyword}
  ✦ Lucky Days: ${num.lifePath.luckyDays} | Lucky Colors: ${num.lifePath.luckyColors.join(", ")} | Compatible Numbers: ${num.lifePath.compatibleWith.join(", ")}
- Destiny Number: ${num.destiny.value} (${num.destiny.archetype}) | Soul Urge: ${num.soulUrge.value} (${num.soulUrge.archetype}) | Personality: ${num.personality.value}
- Current Personal Year: Year ${num.personalYear.value} (${num.personalYear.archetype}) — ${num.personalYear.theme} (${num.personalYear.desc})
- Active Pinnacle: ${num.activePinnacle ? `${num.activePinnacle.label} (${num.activePinnacle.number}) — ${num.activePinnacle.theme}` : "None"}
- Active Challenge: ${num.activeChallenge ? `${num.activeChallenge.label} (${num.activeChallenge.number}) — ${num.activeChallenge.meaning}` : "None"}
- Karmic Debts: ${karmicDebts}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Numerology error:", err);
  }

  // ── 11. RATNA & UPAYS (GEMSTONES & REMEDIES) ────────────────────────────────
  try {
    const natalChart = buildNatalChartFromAnyChart(chart);
    const gems = generateGemstoneReport(natalChart, chart);

    const primaryGem = `${gems.primaryGemstone.gemstone} (${gems.primaryGemstone.planet}) — Metal: ${gems.primaryGemstone.wearing.metal}, Finger: ${gems.primaryGemstone.wearing.finger}, Day: ${gems.primaryGemstone.wearing.day}. Mantra: "${gems.primaryGemstone.wearing.mantra}"`;
    const avoidGems = gems.avoidGemstones.map((g) => `${g.gemstone} (${g.planet})`).join(", ") || "None";

    sections.push(`### 11. RATNA & UPAYS (GEMSTONES & SACRED REMEDIES)
- Primary Auspicious Gemstone: ${primaryGem}
- Secondary Supportive Gems: ${gems.secondaryGemstones.map((g) => `${g.gemstone} (${g.planet})`).join(", ") || "None"}
- STRICTLY PROHIBITED GEMS (Varjit Ratna — Do NOT wear): ${avoidGems}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Gemstones error:", err);
  }

  // ── 12. ASTRO SOUND & RAGAS ─────────────────────────────────────────────────
  try {
    sections.push(`### 12. ASTRO SOUND & THERAPEUTIC RAGAS
- Mind Calm & Emotional Resilience: Raga Yaman, Ahir Bhairav, Bhoopali
- Restorative Sleep & Vata Soothing: Raga Bageshri, Hindolam, Revati
- Career Focus & Solar Vitality: Raga Bhairav, Hamsadhwani, Brindavani Sarang
- Protocol: 15–20 minutes evening or early morning listening in calm posture.`);
  } catch (err) {
    console.warn("[MasterAstroContext] Astro Sound error:", err);
  }

  // ── 13. SPECIAL LAGNAS & WEALTH PADAS ─────────────────────────────────────────
  try {
    const spl = calculateSpecialLagnas(chart);
    const hl = spl.sunriseItems.find((i) => i.key === "HL");
    const gl = spl.sunriseItems.find((i) => i.key === "GL");
    const sl = spl.sreeLagna;
    const a2 = spl.arudhaItems.find((i) => i.key === "A2");
    const a7 = spl.arudhaItems.find((i) => i.key === "A7");
    const a10 = spl.arudhaItems.find((i) => i.key === "A10");

    sections.push(`### 13. SPECIAL LAGNAS & WEALTH PADAS (PROSPERITY & POWER)
- Hora Lagna (HL — Wealth & Material Inflow): ${hl?.sign || "N/A"} (${hl?.degreeText || ""}) in H${hl?.house || "N/A"} · Lord: ${hl?.lord || "N/A"}
  ✦ Meaning: ${hl?.meaning || ""}
- Ghati Lagna (GL — Power, Authority & Public Command): ${gl?.sign || "N/A"} (${gl?.degreeText || ""}) in H${gl?.house || "N/A"} · Lord: ${gl?.lord || "N/A"}
  ✦ Meaning: ${gl?.meaning || ""}
- Sree Lagna (SL — Lakshmi Blessings & Prosperity Channel): ${sl?.sign || "N/A"} in H${sl?.house || "N/A"} · Lord: ${sl?.lord || "N/A"}
- Financial & Career Arudha Padas:
  ✦ Dhana Pada (A2 — Visible Wealth & Speech): ${a2?.sign || "N/A"} in H${a2?.house || "N/A"}
  ✦ Dara Pada (A7 — Business Alliances & Public Partners): ${a7?.sign || "N/A"} in H${a7?.house || "N/A"}
  ✦ Karma Pada (A10 — Career Fame & Professional Authority): ${a10?.sign || "N/A"} in H${a10?.house || "N/A"}
- Special Lagna Synthesis: ${spl.summary}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Special Lagnas error:", err);
  }

  // ── 14. ASTRO-VASTU (16-ZONE SPATIAL ENERGETICS & REMEDIES) ───────────────────
  try {
    const activeMD = chart.dashas?.find((d) => d.active)?.planet;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vastu = calculateVastu(chart.planets as any, activeMD);

    const strongNames = vastu.strongZones.map((z) => `${z.dir} (${z.name}, ${z.score}pts)`).join(", ") || "None";
    const weakNames = vastu.weakZones.map((z) => `${z.dir} (${z.name}, ${z.score}pts)`).join(", ") || "None";
    const keyRemedies = vastu.weakZones.slice(0, 3).map((z) => `${z.dir} (${z.domain}): ${z.remedy}`).join("\n  ✦ ");
    const psych = vastu.psychBridge.slice(0, 2).join(" ");

    sections.push(`### 14. ASTRO-VASTU (16-ZONE SPATIAL ENERGETICS & LIVING REMEDIES)
- Overall Home/Workspace Vastu Score: ${vastu.overallScore}/100
- Strongest Zones (Effortless Flow): ${strongNames}
- Vulnerable / Blocked Zones (Requiring Remedial Attention): ${weakNames}
- Priority Spatial Corrections:
  ✦ ${keyRemedies || "Keep North and East clutter-free; place light water elements in Ishanya (NE)."}
- Astro-Vastu Psychological Link: ${psych}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Astro-Vastu error:", err);
  }

  // ── 15. SARVATOBHADRA CHAKRA & GOCHAR VEDHA ──────────────────────────────────
  try {
    const svb = calculateSarvatobhadra(chart);

    const sensitiveInfo = svb.natalInSensitive.length > 0
      ? svb.natalInSensitive.map((s) => `${s.planet} in ${s.zoneName} (${s.nakshatra}) — ${s.meaning}`).join("\n  ✦ ")
      : "No natal planets in extreme friction zones.";

    const vedhaAlerts = svb.vedhaAlerts.slice(0, 4).map((a) => `${a.planet} in ${a.nakshatra} (${a.zoneName}): ${a.description}`).join("\n  ✦ ");

    sections.push(`### 15. SARVATOBHADRA CHAKRA & TRANSIT VEDHA INTELLIGENCE
- Birth Star & Index: ${svb.birthNakshatra} (Index #${svb.birthNakshatraIndex + 1})
- Current Transit Gochar Assessment: ${svb.currentPeriodAssessment} — ${svb.currentPeriodReason}
- Transit Vedha Balance: ${svb.beneficVedhaCount} Benefic vs ${svb.maleficVedhaCount} Malefic Vedha hits
- Sensitive Natal Zones Active:
  ✦ ${sensitiveInfo}
${vedhaAlerts ? `- Active Gochar Vedha Signals:\n  ✦ ${vedhaAlerts}` : ""}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Sarvatobhadra error:", err);
  }

  // ── 16. KN RAO MARRIAGE TIMING & RESEARCH ENGINE ──────────────────────────────
  try {
    const marriageScan = scanMarriageWindows(chart);
    const bestWin = marriageScan.bestWindow;
    const outlook = marriageScan.overallOutlook;

    sections.push(`### 16. KN RAO 8-PARAMETER MARRIAGE & RELATIONSHIP TIMING
- Research Study Model: 8 Core Parameters (Vimshottari PAC in D1/D9, Chara Dasha DK/UL, Double Transit Jupiter+Saturn on 1/7 axis, Vivah Saham, Piya Milan connection)
- Overall Timing Outlook: ${outlook}
- Peak Marriage Timing Score: ${marriageScan.peakScore}/100 across 9-month horizon
- Best Marriage Window: ${bestWin ? `${bestWin.month} (Score: ${bestWin.adjustedScore}/100, ${bestWin.verdict.toUpperCase()}) — ${bestWin.keyFactor}` : "Scanning ongoing"}
- Double Transit Status: ${bestWin?.activeParams.includes("P4: Double transit Jupiter + Saturn") ? "Jupiter & Saturn double transit confirms active relationship manifestation." : "Double transit preparing alignment in upcoming months."}`);
  } catch (err) {
    console.warn("[MasterAstroContext] KN Rao Marriage Timing error:", err);
  }

  // ── 17. LINEAGE KARMA, PITRU INTELLIGENCE & KULA DEVATA ─────────────────────
  try {
    const lineage = calculateLineageKarma(chart, { nativeName: chart.name || "Seeker", btrConfidence: "High" });
    const obstaclesActive = lineage.obstacles
      .filter((o) => o.active)
      .map((o) => `${o.domain} [${o.severity}]: ${o.humanExperienceText}`)
      .join("\n  ✦ ") || "No severe lineage blockages detected.";

    sections.push(`### 17. LINEAGE KARMA, PITRU INTELLIGENCE & KULA DEVATA (7-LAYER SYNTHESIS)
- Executive Lineage Summary: "${lineage.executiveSummary.oneSentenceSummary}"
- Core Ancestral Theme: ${lineage.executiveSummary.coreLineageTheme}
- Ancestral Gate Status: ${lineage.ancestralGatePassed ? "PASSED (Valid lineage evidence)" : "GATED (General interpretation)"}
- Kula Devata (The Roots / Family Foundation):
  ✦ Guardian Deity: ${lineage.kulaDevata.suggestedDeity.traditionalMaleName} / ${lineage.kulaDevata.suggestedDeity.traditionalFemaleName}
  ✦ Connection Status: ${lineage.kulaDevata.connectionStatus} — ${lineage.kulaDevata.rootsGuidance}
  ✦ Simple Offering: ${lineage.kulaDevata.simplePranamOffering}
- Ishta Devata (The Wings / Soul's Personal Guide):
  ✦ Soul Deity: ${lineage.ishtaDevata.suggestedDeity.deityName} (Atmakaraka ${lineage.ishtaDevata.atmakarakaPlanet} in Karakamsa D9 ${lineage.ishtaDevata.karakamsaSign})
  ✦ Dhyana Mantra: ${lineage.ishtaDevata.soulDhyanaMantra}
- Arroyo Elemental Ancestral Analysis:
  ✦ Saturn's Blocked Element: ${lineage.elemental.saturnElement} — ${lineage.elemental.saturnBlockageTheme}
  ✦ Balance: ${lineage.elemental.selfExpressiveCount} Self-Expressive (Fire/Air) vs ${lineage.elemental.selfRepressiveCount} Self-Repressive (Earth/Water)
  ✦ Water Houses (4-8-12): Learned in H4 (${lineage.elemental.waterHousesTrilogy.fourthHouseLearned}), Carried in H8 (${lineage.elemental.waterHousesTrilogy.eighthHouseCarried}), Release in H12 (${lineage.elemental.waterHousesTrilogy.twelfthHouseRelease})
- Nodal Lineage Mapping (Dr. Prem Kumar Sharma):
  ✦ Rahu (Paternal Grandfather / Dada): H${lineage.nodalLineage.rahuPaternalGrandfather.house} (${lineage.nodalLineage.rahuPaternalGrandfather.sign})
  ✦ Ketu (Maternal Grandfather / Nana): H${lineage.nodalLineage.ketuMaternalGrandfather.house} (${lineage.nodalLineage.ketuMaternalGrandfather.sign})
  ✦ Gandamoola: ${lineage.nodalLineage.gandamoola.isGandamoola ? `Active in ${lineage.nodalLineage.gandamoola.nakshatra} P${lineage.nodalLineage.gandamoola.pada}` : "None"}
- Somatic Energy Field (Mr. A & Polarity Therapy):
  ✦ Sensitive System: ${lineage.somatic.vulnerableOrganSystem}
  ✦ Restoration: ${lineage.somatic.restorativeSomaticPractice}
- Real-Life Obstacle Diagnostics:
  ✦ ${obstaclesActive}
- Positive Ancestral Gifts (Pitru Anugraha):
  ✦ ${lineage.anugraha.inheritedGifts.join("; ") || "General ancestral resilience"}
- AstroLife Remedy Intelligence (v2.2 Production Standard):
  ✦ Top Essential Practice 1: ${lineage.remedyIntelligence?.topEssentialPractices?.[0]?.title || "Family history dialogue"} (${lineage.remedyIntelligence?.topEssentialPractices?.[0]?.oneLinePurpose || ""})
  ✦ Top Essential Practice 2: ${lineage.remedyIntelligence?.topEssentialPractices?.[1]?.title || "Pitru Tarpan"} (${lineage.remedyIntelligence?.topEssentialPractices?.[1]?.oneLinePurpose || ""})
  ✦ Top Essential Practice 3: ${lineage.remedyIntelligence?.topEssentialPractices?.[2]?.title || "Financial Clarity"} (${lineage.remedyIntelligence?.topEssentialPractices?.[2]?.oneLinePurpose || ""})
  ✦ Gemstone Contraindication: ${lineage.remedyIntelligence?.gemstoneEligibility?.reason || "Strictly gated"}
  ✦ 30-Day Self-Observation: ${lineage.remedyIntelligence?.thirtyDayAuditGuide?.questions?.[0] || "Reflect on family peace"}
- Vedic Computational Antahkarana (PVR Rao Model):
  ✦ CPU (Ahamkara / I-ness): ${lineage.antahkarana?.ahamkara.cpuSignificator || "Atmakaraka"} | Tripod: ${lineage.antahkarana?.ahamkara.tripod.sthoolaLagna || ""}, ${lineage.antahkarana?.ahamkara.tripod.sookshmaMoon || ""}
  ✦ Memory/Cache (Chitta): Subconscious impressions in ${lineage.antahkarana?.chitta.subconsciousRootVargas.join(", ") || "D60, D45, D30"}
  ✦ ALU/Logic (Buddhi): ${lineage.antahkarana?.buddhi.aluController || "AmK + Jupiter"} (Transmitter: ${lineage.antahkarana?.buddhi.transmitter || "Mercury"})
  ✦ I/O Controller (Manas): ${lineage.antahkarana?.manas.ioController || "Moon + Mercury"}
- PVR Tarpana & Karma Release Mechanism:
  ✦ Homam vs Tarpana: Homam burns personal past-life karma; Tarpana washes inherited ancestral debts (Rina).
  ✦ Internal Genetics: Ancestors are present inside as karmic predispositions. Tarpana releases this internal conditioning.
  ✦ Jivat-Pitruk: Living father does NOT prevent son/grandson from performing Tarpana for ancestor debts.
- Language Rule: When presenting to native, strictly follow Language Style Guide v2.1 (no fear, no curses, practical empowerment, 4-tier remedy hierarchy).`);
  } catch (err) {
    console.warn("[MasterAstroContext] Lineage Karma error:", err);
  }

  // ── 18. KP MARRIAGE INTELLIGENCE, D9 NAVAMSHA & REMEDIAL BLUEPRINT ──────────
  try {
    const mi = evaluateMarriageIntelligence(chart);
    const remediesStr = mi.remedies
      .slice(0, 4)
      .map((r) => `✦ ${r.title} [${r.category}]: ${r.procedure}`)
      .join("\n  ");

    const condDashas = detectConditionalDashas(chart);
    const applicableDashas = condDashas.filter((d) => d.isApplicable);
    const dashasStr = applicableDashas.length > 0
      ? applicableDashas.map((d) => `✦ ${d.dashaName}: ${d.conditionDescription} (${d.researchRule})`).join("\n  ")
      : "✦ Standard Vimshottari Dasha remains the primary sovereign timing clock (no conditional overrides).";

    sections.push(`### 18. KP MARRIAGE INTELLIGENCE, D9 NAVAMSHA & PROVEN REMEDIES
- 7th Cusp Sub-Lord (${mi.meetingContext.sourceStarLord} Star in H${mi.meetingContext.starLordHouse}):
  ✦ Meeting Circumstances: ${mi.meetingContext.circumstance}
  ✦ Spouse Nature: ${mi.meetingContext.partnerNature}
  ${mi.meetingContext.caution ? `✦ Caution: ${mi.meetingContext.caution}` : ""}
- 7th Rashi Post-Marriage Manifestation (${mi.rashiImpact.signName}):
  ✦ Life Domain: ${mi.rashiImpact.lifeDomainActivated}
  ✦ Behavioral Dynamic: ${mi.rashiImpact.behavioralDynamics}
- D9 Navamsha 4-Pillar Health Audit (Lagna: ${mi.d9Audit.d9LagnaSign}):
  ✦ H1 (Mindset): ${mi.d9Audit.pillars.h1NativeMindset.interpretation} [Severity: ${mi.d9Audit.pillars.h1NativeMindset.severity}]
  ✦ H4 (Domestic Peace): ${mi.d9Audit.pillars.h4MaritalPeace.interpretation} [Severity: ${mi.d9Audit.pillars.h4MaritalPeace.severity}]
  ✦ H7 (Spouse Stability): ${mi.d9Audit.pillars.h7SpouseNature.interpretation} [Severity: ${mi.d9Audit.pillars.h7SpouseNature.severity}]
  ✦ H12 (Bedroom Bliss): ${mi.d9Audit.pillars.h12BedroomBliss.interpretation} [Index: ${mi.d9Audit.bedroomBlissStatus}]
- Punarbu / Punarphoo Yoga Audit (Dr. Veluchamy Research 2022):
  ✦ Status: ${mi.punarbuYoga.detected ? `ACTIVE [Severity: ${mi.punarbuYoga.severity}]` : "CLEAN (No Punarbu Yoga)"}
  ✦ Conditions: ${mi.punarbuYoga.conditions.join("; ") || "None"}
  ✦ Neutralization / Cancelled: ${mi.punarbuYoga.isCancelled ? `YES (${mi.punarbuYoga.cancellationFactors.join(", ")})` : "No cancellation"}
  ✦ Manifestation: ${mi.punarbuYoga.effects}
- Separative Influences Audit (Sun, Saturn, Rahu, Ketu, 12L):
  ✦ Total Separative Score: ${mi.separativeAudit.totalSeparativeScore}
  ✦ Interpretation: ${mi.separativeAudit.interpretation}
  ✦ 7th Lord Affliction: ${mi.separativeAudit.seventhLordAfflicted ? mi.separativeAudit.seventhLordSeparators.join(", ") : "Protected"}
- Barren Signs & Spouse Direction:
  ✦ Barren Placements: ${mi.barrenAudit.barrenPlacements.join(", ") || "None"} (${mi.barrenAudit.interpretation})
  ✦ Spouse Direction: ${mi.marriageDirection.primaryDirectionHindi} (${mi.marriageDirection.rationale})
- D1 ➔ D9 Cross-Mapping Manifestation:
  ✦ Friction Zones: ${mi.d1ToD9Mapping.trikInD9.map((t) => `D1 H${t.d1House} in D9 H${t.d9House}`).join(", ")}
  ✦ Prosperity Zones: ${mi.d1ToD9Mapping.wealthInD9.map((w) => `D1 H${w.d1House} in D9 H${w.d9House}`).join(", ")}
- Conditional Dashas (K.N. Rao Research):
  ${dashasStr}
- Special Dynamics:
  ✦ Dual/Second Marriage Potential: ${mi.dualMarriage.notes}
  ✦ Renunciation/Sanyas/Denial Status: ${mi.sanyasDenial.interpretation}
  ✦ Intimacy/Orientation Vector: ${mi.intimacyAudit.interpretation} (Astro-Vastu: ${mi.intimacyAudit.vastuZone})
- Recommended Practical Remedies:
  ${remediesStr}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Marriage Intelligence error:", err);
  }

  // ── 19. CORE PLANET REMEDIES, SATURN 7TH HOUSE GROWTH RADAR & PROPERTY PREDICTOR ───
  try {
    const activeMD = chart.dashas?.find((d) => d.active) ?? chart.dashas?.[0];
    const mdPlanet = activeMD?.planet || "Jupiter";
    const coreRemedy = evaluateCorePlanetRemedy(mdPlanet, chart);
    const moonH = chart.planets.Moon?.house || 4;
    const moonSign = chart.planets.Moon?.sign || "Cancer";
    const moonGuide = getMoonSharingGuide(moonH, moonSign);
    const transitRadar = buildMasterTransitRadarDossier(chart);

    const bnnStr = transitRadar?.bnnTransitConjunctions.length
      ? transitRadar.bnnTransitConjunctions.map((b) => `✦ Shani + Natal ${b.natalPlanet} in ${b.transitSignName} (H${b.houseNumber}): ${b.esotericMeaningHinglish}`).join("\n  ")
      : "✦ No direct natal planet conjunction in transit Aquarius sign.";

    const dashaContext = resolveContextualRemedies("dasha", chart);
    const dashaFormulasStr = dashaContext?.specialFormulas.length
      ? dashaContext.specialFormulas.map((f) => `✦ ${f.title}: ${f.exactDosage} (${f.timing}) — ${f.expectedResultHinglish}`).join("\n  ")
      : "✦ Standard dasha regimen.";
    const dashaWarningsStr = dashaContext?.strictWarnings.length
      ? dashaContext.strictWarnings.join("; ")
      : "No contraindication alerts.";

    sections.push(`### 19. CORE PLANET REMEDIES, SATURN 7TH HOUSE GROWTH RADAR & PROPERTY PREDICTOR
- Active Dasha Planet (${mdPlanet}):
  ✦ Dignity Status: ${coreRemedy?.isFavorable ? "FAVORABLE (Power-Up / Gemstone Allowed)" : "AFFLICTED / DUSHTANA (Mitigation / NEVER Wear Gemstone!)"}
  ✦ Recommendation: ${coreRemedy?.primaryHeadline}
  ✦ Gemstone Ruling: ${coreRemedy?.gemstoneAdvice.canWearStone ? `Wear ${coreRemedy.gemstoneAdvice.stoneDetails?.name} on ${coreRemedy.gemstoneAdvice.stoneDetails?.finger} (${coreRemedy.gemstoneAdvice.stoneDetails?.metal})` : "NEVER WEAR GEMSTONE (Charity & Mantra Japa only!)"}
  ✦ Elemental Disposal Vehicle: ${coreRemedy?.elementalDisposalRule.actionTitleHinglish} (${coreRemedy?.elementalDisposalRule.trikonaName}) — ${coreRemedy?.elementalDisposalRule.actionExplanationHinglish}
  ✦ Charity Dosages: ${coreRemedy?.charityFormulas.map((c) => `${c.item} [${c.quantity}] on ${c.day} to ${c.targetRecipient}`).join("; ") || "None (Favorable planet — do japa and arghya)"}
- Contextual Dasha Special Formulas & Prohibitions:
  ${dashaFormulasStr}
  ✦ Strict Warnings: ${dashaWarningsStr}
- Moon Psychological Heart-Sharing Sanctuary (Moon in H${moonH} ${moonSign}):
  ✦ Designated Confidant: ${moonGuide.confidantTitleHinglish}
  ✦ Emotional Principle: ${moonGuide.narrativeHinglish}
  ✦ Warning: ${moonGuide.warningHinglish}
- Saturn 7th House Growth Radar (Transit Shani):
  ✦ Past 2.5y (Shani in Makara H${transitRadar?.pastCycle.saturnTransitHouse}): Elevated H${transitRadar?.pastCycle.elevatedGrowthHouse} (${transitRadar?.pastCycle.growthThemeHinglish})
  ✦ Current 2.5y (Shani in Kumbha H${transitRadar?.currentCycle.saturnTransitHouse}): Elevated H${transitRadar?.currentCycle.elevatedGrowthHouse} (${transitRadar?.currentCycle.growthThemeHinglish})
  ✦ Next 2.5y (Shani in Meena H${transitRadar?.futureCycle.saturnTransitHouse}): Elevated H${transitRadar?.futureCycle.elevatedGrowthHouse} (${transitRadar?.futureCycle.growthThemeHinglish})
- BNN Transit Conjunctions in Aquarius:
  ${bnnStr}
- Property Timing Predictor:
  ✦ Status: ${transitRadar?.propertyForecast.headlineHinglish} [${transitRadar?.propertyForecast.timingStatus}]
  ✦ Script Rationale: ${transitRadar?.propertyForecast.verbatimRationaleHinglish}`);
  } catch (err) {
    console.warn("[MasterAstroContext] Core Planet Remedies error:", err);
  }

  return `\n══════════════════════════════════════════════════════════════════════
ASTROLIFE MASTER MULTI-ENGINE CALCULATED CONTEXT (UNIFIED EVIDENCE)
══════════════════════════════════════════════════════════════════════
${sections.join("\n\n")}
══════════════════════════════════════════════════════════════════════`;
}
