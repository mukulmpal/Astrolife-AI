// src/lib/astro-engine/nakshatra-remedy-engine.ts
// AstroLife — Master Nakshatra Personality & Human-Tone Remedy Engine
// Synthesizes the active Dasha Lord's Nakshatra, native's psychological blueprint,
// karmic trap warnings, and house-trikona elemental vehicles.

import type { ChartData, PlanetData } from "./calculations";
import {
  getHumanNakshatraGuideByName,
  type HumanNakshatraGuide,
} from "./nakshatra-remedies-registry";
import {
  resolveHouseTrikonaRemedy,
  type HouseTrikonaRule,
} from "./house-trikona-remedies";
import {
  evaluateTransitNakshatraRemedy,
  type TransitNakshatraEvaluationResult,
} from "./transit-nakshatra-remedies";

export interface EvaluatedPlanetRemedy {
  planet: string;
  house: number;
  sign: string;
  nakshatra: string;
  isDashaLord: boolean;
  isProblemPlanet: boolean;
  reasonForFocus: string;
  nakshatraGuide: HumanNakshatraGuide | null;
  houseTrikonaRule: HouseTrikonaRule;
}

export interface NakshatraHumanReport {
  // ── 1. The Active Star Identification ───────────────────────
  activeDashaPlanet: string;
  activeNakshatraName: string;
  activeAntardashaPlanet?: string;
  
  // ── 2. The 5-Paragraph Narrative for Native ─────────────────
  section1_InnerStateAndPersonality: string;
  section2_LivingArchetypeStory: string;
  section3_KarmicTrapAndAngerWarning: string;
  section4_BehavioralConductInDailyLife: string;
  section5_ActionableRemedyAndSevaPlan: string;

  // ── 3. Quick Actionable Checklist ───────────────────────────
  goldenRule: string;
  primaryActionItem: string;
  secondaryActionItem: string;
  naturePashuSeva: string;
  timingAndMuhurat: string;
  materialsNeeded: string[];

  // ── 4. House-Trikona Elemental Vehicle ──────────────────────
  elementalVehicleTitle: string;
  elementalVehicleExplanation: string;
  elementalVehicleProcedure: string;

  // ── 5. Transit Nakshatra, Navtara & Shivling Upachara ────────
  transitRemedy?: TransitNakshatraEvaluationResult | null;

  // ── 6. Full Evaluated Planet Records ────────────────────────
  evaluatedPlanets: EvaluatedPlanetRemedy[];
}

/**
 * Evaluates the chart and generates the complete, user-friendly, descriptive Nakshatra dossier.
 */
export function evaluateNakshatraRemedyDossier(
  chart: ChartData | null | undefined
): NakshatraHumanReport | null {
  if (!chart || !chart.planets) return null;

  // 1. Identify Active Mahadasha & Antardasha Lord
  const activeMD = chart.dashas?.find((d) => d.active) ?? chart.dashas?.[0];
  const activeAD = chart.antardasha?.find((a) => a.active);
  const dashaLordName = activeMD?.planet || "Jupiter";

  // 2. Locate Dasha Lord in Natal Chart
  const dashaPlanetData: PlanetData | undefined = chart.planets[dashaLordName];
  const nakshatraName = dashaPlanetData?.nakshatra || "Pushya";
  const nakshatraGuide = getHumanNakshatraGuideByName(nakshatraName);

  // 3. Resolve House Trikona for Dasha Lord
  const dashaHouse = dashaPlanetData?.house || 1;
  const houseTrikona = resolveHouseTrikonaRemedy(dashaLordName, dashaHouse);

  // 4. Identify Problem Planets (in 6, 8, 12 or debilitated/retrograde)
  const evaluatedPlanets: EvaluatedPlanetRemedy[] = [];
  
  for (const [pName, pData] of Object.entries(chart.planets)) {
    if (!pData) continue;
    const isMD = pName === dashaLordName;
    const isDushtana = [6, 8, 12].includes(pData.house);
    const isDebilitated = pData.dignity?.toLowerCase().includes("debilitat");
    const isProblem = !isMD && (isDushtana || isDebilitated);

    if (isMD || isProblem) {
      const guide = getHumanNakshatraGuideByName(pData.nakshatra);
      const hRule = resolveHouseTrikonaRemedy(pName, pData.house);
      evaluatedPlanets.push({
        planet: pName,
        house: pData.house,
        sign: pData.sign,
        nakshatra: pData.nakshatra,
        isDashaLord: isMD,
        isProblemPlanet: isProblem,
        reasonForFocus: isMD
          ? `Current Active Mahadasha Lord (${pName}) in ${pData.nakshatra} Nakshatra, House ${pData.house}`
          : `Afflicted in House ${pData.house} (${pData.sign}) with ${pData.dignity || "Karmic stress"}`,
        nakshatraGuide: guide,
        houseTrikonaRule: hRule,
      });
    }
  }

  // 5. Compose the 5-Paragraph Narrative
  const starName = nakshatraGuide?.name || nakshatraName;
  const archetypeTitle = nakshatraGuide?.archetypeTitle || `${starName} Energy`;

  const section1 = nakshatraGuide
    ? `Aapka vartamaan jeevan is waqt ${dashaLordName} grah ki dasha ke chalte "${starName} Nakshatra" ki divya urja se prabhavit hai. ${nakshatraGuide.personalityStoryHinglish}`
    : `Aapka vartamaan daur ${dashaLordName} grah ke adheen hai jo ${starName} nakshatra me sthit hai. Is samay aapke jeevan me gahan parivartan aur nayi zimmedariyon ka sanchar ho raha hai.`;

  const section2 = nakshatraGuide?.livingArchetypeStoryHinglish
    ? `${nakshatraGuide.livingArchetypeStoryHinglish}`
    : `Ye nakshatra classical shastron me param kripakari maana gaya hai aur iski urja seedha aatma ki vridhhi karti hai.`;

  const section3 = nakshatraGuide
    ? `${nakshatraGuide.karmicTrapHinglish} Yaad rakhein: nakshatra ka upay tabhi safal hota hai jab hum apni kamzor aadat ko pehchan kar uspe break lagayein.`
    : `Is daur me bina soche-samjhe koi bhi faisla lene se bachein aur gusse par kabu rakhein.`;

  const section4 = nakshatraGuide
    ? `${nakshatraGuide.conductGuardrailHinglish}`
    : `Ghar-parivaar me shanti banaye rakhein aur bade-buzurgon ka niyamit aashirwad lein.`;

  const section5 = nakshatraGuide
    ? `Sabse bada aur turant asar dikhane wala upay: ${nakshatraGuide.primaryRemedyHinglish} Iske sath hi: ${nakshatraGuide.secondaryRemedyHinglish} Pashu-pakshi aur prakriti ki seva ke liye: ${nakshatraGuide.naturePashuSevaHinglish}`
    : `Zarooratmand logon ki madad karein aur pashu-pakshiyon ke liye paani-ann ka prabandh karein.`;

  return {
    activeDashaPlanet: dashaLordName,
    activeNakshatraName: starName,
    activeAntardashaPlanet: activeAD?.planet,
    
    section1_InnerStateAndPersonality: section1,
    section2_LivingArchetypeStory: section2,
    section3_KarmicTrapAndAngerWarning: section3,
    section4_BehavioralConductInDailyLife: section4,
    section5_ActionableRemedyAndSevaPlan: section5,

    goldenRule: nakshatraGuide?.goldenRuleHinglish || "Imaandari aur vinamrata se dharam ka palan karein.",
    primaryActionItem: nakshatraGuide?.primaryRemedyHinglish || "Zarooratmand ko bhojan karwayein.",
    secondaryActionItem: nakshatraGuide?.secondaryRemedyHinglish || "Bade-buzurgon ka aashirwad lein.",
    naturePashuSeva: nakshatraGuide?.naturePashuSevaHinglish || "Pakshiyon ko paani dein.",
    timingAndMuhurat: nakshatraGuide?.timingAndMuhuratHinglish || "Pratahkaal shubh muhurat me.",
    materialsNeeded: nakshatraGuide?.materials || [],

    elementalVehicleTitle: houseTrikona.actionTitleHinglish,
    elementalVehicleExplanation: houseTrikona.actionExplanationHinglish,
    elementalVehicleProcedure: houseTrikona.procedureNarrativeHinglish,

    transitRemedy: evaluateTransitNakshatraRemedy(chart),
    evaluatedPlanets,
  };
}

/**
 * Builds an LLM-ready context block in warm, human narrative for AI Chat prompts.
 */
export function buildNakshatraRemedyLlmPromptBlock(chart: ChartData | null | undefined): string {
  const report = evaluateNakshatraRemedyDossier(chart);
  if (!report) return "";

  const tr = report.transitRemedy;
  let transitBlock = "";
  if (tr) {
    const plants = tr.house6PlantRemedies.map((p) => `${p.planet}: ${p.plantName} (${p.careInstructionsHinglish})`).join("; ");
    const fruits = tr.house8FruitRemedies.map((f) => `${f.planet}: ${f.fruitName} (${f.donationGuidanceHinglish})`).join("; ");
    const donations = tr.house12DonationRemedies.map((d) => `${d.planet}: ${d.targetCategory} — ${d.donationTypeHinglish}`).join("; ");

    transitBlock = `
### DYNAMIC TRANSIT NAKSHATRA & 27 SHIVLING UPACHARA INTELLIGENCE
- Active Dasha Planet: ${tr.activeDashaLord}
- Current Transit Position: ${tr.transitSign} at ${tr.transitDegree}° in Nakshatra: ${tr.transitNakshatra} (#${tr.transitNakshatraNumber})
- Navtara Alignment from Natal Moon (${tr.natalMoonNakshatra}):
  ✦ Tara Position: #${tr.taraNumber} ${tr.taraName} (${tr.taraRelationType}) — ${tr.taraExplanationHinglish}
- 27-Upachara Shivling Ritual Remedy (Nakshatra #${tr.transitNakshatraNumber}):
  ✦ Upachara Action: ${tr.shivlingRemedy.upacharaName} (${tr.shivlingRemedy.hindiTitle})
  ✦ Procedure: "${tr.shivlingRemedy.procedureNarrativeHinglish}"
  ${tr.shivlingRemedy.transcriptExample ? `✦ Real Transcript Example: "${tr.shivlingRemedy.transcriptExample}"` : ""}
${tr.distanceAnalysis ? `- MD-AD Distance: ${tr.distanceAnalysis.mahadashaPlanet} vs ${tr.distanceAnalysis.antardashaPlanet} -> ${tr.distanceAnalysis.mutualAxis}. ${tr.distanceAnalysis.impactDescriptionHinglish}` : ""}
- 6th, 8th & 12th House Specific Remedies:
  ✦ 6th House (Plants/Earth Debt): ${plants || "No planet in H6; planting trees remains virtuous."}
  ✦ 8th House (Fruit Donation): ${fruits || "No planet in H8."}
  ✦ 12th House (Letting Go/Charity): ${donations || "No planet in H12."}
- 6th vs 12th House Belief Principle:
  ✦ 6th House Rule: "${tr.beliefGuidanceHinglish.house6MessageHinglish}"
  ✦ 12th House Rule: "${tr.beliefGuidanceHinglish.house12MessageHinglish}"`;
  }

  return `### NAKSHATRA & ELEMENTAL REMEDY INTELLIGENCE (AUTHENTIC TRANSCRIPT DIRECTIVES)
- Current Active Dasha Lord: ${report.activeDashaPlanet} sitting in Natal Nakshatra: ${report.activeNakshatraName}
- Native's Current Mindset & Personality:
  "${report.section1_InnerStateAndPersonality}"
- Living Archetype & Historical Context:
  "${report.section2_LivingArchetypeStory}"
- Hidden Trap & Conduct Warning (What ruins their results):
  "${report.section3_KarmicTrapAndAngerWarning}"
- Daily Life Conduct Rule:
  "${report.section4_BehavioralConductInDailyLife}"
- Core Fast-Acting Upay (Transcript-backed):
  ✦ Primary Upay: ${report.primaryActionItem}
  ✦ Secondary Upay: ${report.secondaryActionItem}
  ✦ Animal/Nature Seva: ${report.naturePashuSeva}
  ✦ Timing & Auspicious Days: ${report.timingAndMuhurat}
  ✦ Golden Rule to Never Break: "${report.goldenRule}"
- House-Trikona Physical Vehicle (${report.elementalVehicleTitle}):
  ${report.elementalVehicleExplanation}
  Method: ${report.elementalVehicleProcedure}
${transitBlock}
[GUIDELINE FOR AI]: Speak to the native with warm empathy, like a caring mentor. Explain who they are, why they feel this way, and provide these practical, free, transcript-backed remedies in simple Hinglish without cold astrological jargons.`;
}
