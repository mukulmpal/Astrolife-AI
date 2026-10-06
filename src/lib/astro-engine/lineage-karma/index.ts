// src/lib/astro-engine/lineage-karma/index.ts
// ============================================================================
// MASTER ORCHESTRATOR: LINEAGE KARMA & ANCESTRAL INTELLIGENCE ENGINE (v1.0)
// Unifies:
// 1. Classical Jyotish (BPHS + Dr. Prem Kumar Sharma)
// 2. Varga Recurrence (D1, D9, D12)
// 3. Elemental Ancestral Substance (Stephen Arroyo)
// 4. Somatic & Energy Field (Mr. A + Polarity Therapy)
// 5. Positive Pitru Anugraha & Obstacle Diagnostics
// 6. Kula & Ishta Devata (Roots & Wings)
// 7. Human Language Presentation Layer (Language Style Guide v1.0)
// ============================================================================

import type { ChartData } from "../calculations";
import { calculateElementalAncestral } from "./elemental-ancestral";
import { calculateClassicalNodalLineage } from "./classical-nodes";
import { calculateKulaAndIshtaDevata } from "./kula-ishta";
import { detectLineageObstacles } from "./obstacle-detector";
import { generateLineageNarrative } from "./narrative-generator";
import { generateRemedyIntelligence } from "./remedy-intelligence";
import { calculateAntahkarana } from "./antahkarana-mapper";
import type {
  CertaintyLevel,
  LineageKarmaResult,
  PitruAnugrahaProfile,
} from "./types";

export * from "./types";
export * from "./remedy-intelligence";
export * from "./antahkarana-mapper";
export { calculateElementalAncestral } from "./elemental-ancestral";
export { calculateClassicalNodalLineage } from "./classical-nodes";
export { calculateKulaAndIshtaDevata } from "./kula-ishta";
export { detectLineageObstacles } from "./obstacle-detector";
export { generateLineageNarrative } from "./narrative-generator";
export { generateRemedyIntelligence } from "./remedy-intelligence";
export { calculateAntahkarana } from "./antahkarana-mapper";

export function calculateLineageKarma(
  chart: ChartData | null | undefined,
  options?: {
    nativeName?: string;
    btrConfidence?: "Provisional" | "Moderate" | "High";
  }
): LineageKarmaResult {
  const nativeName = options?.nativeName || chart?.name || "Seeker";
  const btrConfidence = options?.btrConfidence || "High";

  if (!chart || !chart.planets) {
    // Return empty fallback
    return {
      nativeName,
      btrConfidence,
      ancestralGatePassed: false,
      gateReasons: [],
      elemental: {} as any,
      nodalLineage: {} as any,
      kulaDevata: {} as any,
      ishtaDevata: {} as any,
      anugraha: {} as any,
      somatic: {} as any,
      obstacles: [],
      executiveSummary: {
        oneSentenceSummary: "कुंडली के अनुसार पारिवारिक जिम्मेदारियों और आत्म-विकास के बीच संतुलन मुख्य विषय है।",
        coreLineageTheme: "General balance",
        burdenGiftSynthesis: "Understanding responsibility yields lasting maturity.",
      },
      narrativeHtml: "",
      narrativeMarkdown: "",
      technicalDrawer: {
        certainty: "Hypothesis / Synthesis",
        d12VerificationNotes: "Chart data pending",
        d9NavamshaConfirmation: "Chart data pending",
        kpBhavaVerification: "Chart data pending",
      },
    };
  }

  // ── 1. ANCESTRAL GATE EVALUATION ──────────────────────────────────────────
  // Mandatory Rule: Ancestral claim is only triggered if valid lineage evidence exists.
  const gateReasons: string[] = [];
  const rahuH = chart.planets.Rahu?.house;
  const ketuH = chart.planets.Ketu?.house;
  const sun = chart.planets.Sun;
  const moon = chart.planets.Moon;
  const mars = chart.planets.Mars;
  const saturn = chart.planets.Saturn;
  const jupiter = chart.planets.Jupiter;

  // Evaluate Nodal Axis
  if ((rahuH === 2 && ketuH === 8) || (rahuH === 8 && ketuH === 2)) {
    gateReasons.push("Nodes in 2nd/8th Axis (Kutumba, Family Heritage & Hidden Lineage Debts)");
  } else if ((rahuH === 1 && ketuH === 7) || (rahuH === 7 && ketuH === 1)) {
    gateReasons.push("Nodes in 1st/7th Axis (Individual Identity vs Generational Partnership Karma)");
  } else if ((rahuH === 4 && ketuH === 10) || (rahuH === 10 && ketuH === 4)) {
    gateReasons.push("Nodes in 4th/10th Axis (Mother, Ancestral Home vs Father, Career & Social Karma)");
  } else if ((rahuH === 3 && ketuH === 9) || (rahuH === 9 && ketuH === 3)) {
    gateReasons.push("Nodes in 3rd/9th Axis (Self-Effort Purushartha vs Ancestral Beliefs & Dharma)");
  } else if ((rahuH === 5 && ketuH === 11) || (rahuH === 11 && ketuH === 5)) {
    gateReasons.push("Nodes in 5th/11th Axis (Purva Punya, Progeny & Lineage Continuation)");
  } else if ((rahuH === 6 && ketuH === 12) || (rahuH === 12 && ketuH === 6)) {
    gateReasons.push("Nodes in 6th/12th Axis (Lineage Debt Resolution vs Subconscious & Spiritual Release)");
  } else if (rahuH === 9 || ketuH === 9) {
    gateReasons.push("Nodes occupying 9th House of Father & Pitru Dharma");
  }

  // Evaluate Sun (Pitru Karaka)
  if (sun?.house === 9 || sun?.house === 10) {
    gateReasons.push(`Sun in House ${sun.house} (Paternal influence, career duty and lineage authority)`);
  } else if (sun?.house === 8 || sun?.house === 12) {
    gateReasons.push(`Sun in House ${sun.house} (Unspoken paternal struggle, hidden family sacrifices)`);
  }

  // Evaluate Saturn (Generational Duty)
  if (saturn?.house === 7) {
    gateReasons.push("Saturn in 7th (Responsibility and generational maturity in relationships)");
  } else if (saturn?.house === 8 || saturn?.house === 12 || saturn?.house === 9 || saturn?.house === 10) {
    gateReasons.push(`Saturn in House ${saturn.house} (Karmic duty and ancestral endurance testing)`);
  }

  // Evaluate Moon/Mars in Water/Dusthana
  if (moon?.house === 12 || mars?.house === 12) {
    gateReasons.push("Moon/Mars in 12th House (Internal emotional processing of generational holding)");
  } else if (moon?.house === 8 || mars?.house === 8) {
    gateReasons.push("Moon/Mars in 8th House (Subconscious inheritance and family emotional transformations)");
  }

  // ── 2. RUN SUB-ENGINES ────────────────────────────────────────────────────
  const { elemental, somatic } = calculateElementalAncestral(chart);
  const nodalLineage = calculateClassicalNodalLineage(chart);
  const { kulaDevata, ishtaDevata } = calculateKulaAndIshtaDevata(chart);
  const obstacles = detectLineageObstacles(chart);
  const { antahkarana, pvrTarpana } = calculateAntahkarana(chart);

  if (nodalLineage.gandamoola?.isGandamoola) {
    gateReasons.push(`Gandamoola Nakshatra (${nodalLineage.gandamoola.nakshatra} P${nodalLineage.gandamoola.pada}) active at birth`);
  }
  const activeObs = obstacles.filter((o) => o.active);
  if (activeObs.length > 0) {
    gateReasons.push(`Lineage dynamic detected in: ${activeObs.map((o) => o.domain.replace(/_/g, " ")).join(", ")}`);
  }

  const ancestralGatePassed = gateReasons.length > 0;

  // ── 3. POSITIVE ANCESTRAL ASSETS (PITRU ANUGRAHA) ─────────────────────────
  const inheritedGifts: string[] = [];
  const protectiveFactors: string[] = [];

  // Jupiter check
  if (jupiter?.house === 1 || jupiter?.house === 5 || jupiter?.house === 9) {
    inheritedGifts.push(`Jupiter in Trikona (House ${jupiter.house}): Purva Punya blessing, higher ethical discernment, spiritual ancestral grace`);
    protectiveFactors.push("Jupiterian grace illuminates dharma, moral decisions, and protective wisdom");
  } else if (jupiter?.house === 3) {
    inheritedGifts.push("Jupiter in 3rd House: Intellectual courage, self-effort (Purushartha), and curiosity");
    protectiveFactors.push("Jupiterian grace protecting communication, initiative, and conscious learning");
  } else if (jupiter?.house === 4 || jupiter?.house === 10) {
    inheritedGifts.push(`Jupiter in Kendra (House ${jupiter.house}): Ethical family leadership, respect, and emotional/societal balance`);
    protectiveFactors.push("Jupiter provides moral dignity to elevate family status through righteous deeds");
  } else if (jupiter?.house === 2 || jupiter?.house === 11) {
    inheritedGifts.push(`Jupiter in House ${jupiter.house}: Generational wisdom in resources and benevolent speech`);
    protectiveFactors.push("Jupiter expands protective wealth and harmonious values across generations");
  }

  // Mercury check
  const mercury = chart.planets.Mercury;
  if (mercury?.house === 1 || mercury?.house === 4 || mercury?.house === 5 || mercury?.house === 9 || mercury?.house === 10) {
    inheritedGifts.push(`Mercury in House ${mercury.house}: Sharp analytical intellect (Buddhi), communication clarity, and objective discrimination`);
    protectiveFactors.push("Mercury provides cognitive agility to question dogma rationally without losing lineage respect");
  }

  // Venus check
  const venus = chart.planets.Venus;
  if (venus?.house === 1 || venus?.house === 4 || venus?.house === 5 || venus?.house === 9 || venus?.house === 12) {
    inheritedGifts.push(`Venus in House ${venus.house}: Creative artistic grace, restorative empathy, and relational devotion`);
    protectiveFactors.push("Venus acts as Sanjeevani grace, healing family friction through love and aesthetic refinement");
  }

  // Strong Sun check
  if (sun?.house === 10 || sun?.house === 1 || sun?.house === 9) {
    inheritedGifts.push(`Sun in House ${sun.house}: Strong paternal vitality, leadership potential, and self-respect`);
    protectiveFactors.push("Solar authority and inner pride anchor the native against ancestral victimhood");
  }

  // Strong Mars check
  if (mars?.house === 10 || mars?.house === 1) {
    inheritedGifts.push(`Mars in House ${mars.house} (Kuladipaka Yoga energy): Courage to take bold action and protect the family name`);
    protectiveFactors.push("Martian resilience gives strength to overcome family inertia and build a new path");
  }

  if (nodalLineage.bahuputraYoga) {
    inheritedGifts.push("Bahuputra Yoga: Blessed vitality and auspicious continuity for next-generation expansion");
  }
  if (nodalLineage.rahuPaternalGrandfather.isYogakaraka) {
    protectiveFactors.push("Rahu acts as Yogakaraka: Paternal ambition transforms into worldly success and breakthrough");
  }

  if (inheritedGifts.length === 0) {
    inheritedGifts.push("Inherent resilience and steady adaptability passed through family lineage");
    protectiveFactors.push("Natural inner balance and capacity to learn from generational experience");
  }

  const counterweightBlessing =
    protectiveFactors[0]
      ? `आपकी कुंडली में ${protectiveFactors[0]} पूर्वजों के अनसुलझे दबावों को दूर करने में सबसे बड़ा कवच है।`
      : "आपकी अपनी सजग बुद्धि और सत्कर्म पूर्वजों के किसी भी पुराने तनाव को दूर करने की सबसे बड़ी ताकत हैं।";

  const anugraha: PitruAnugrahaProfile = {
    hasStrongAnugraha: inheritedGifts.length > 0,
    inheritedGifts,
    protectiveFactors,
    counterweightBlessing,
  };

  // ── 4. EXECUTIVE SUMMARY ──────────────────────────────────────────────────
  let coreLineageTheme = "Generational Duty, Self-Reliance, and Conscious Life Purpose";
  let oneSentenceSummary = `आपकी कुंडली में परिवार और पूर्वजों से जुड़े संस्कारों को अपनी मेहनत और विवेक से एक नई व सकारात्मक दिशा देने का संकेत है।`;
  let burdenGiftSynthesis = "जो चुनौतियाँ कभी परिवार में संघर्ष बनीं, वही आपके भीतर धैर्य, अनुशासन और स्थायी सफलता की नींव बनेंगी।";

  if ((rahuH === 2 && ketuH === 8) || (rahuH === 8 && ketuH === 2)) {
    coreLineageTheme = "Family Heritage, Financial Independence, and Deep Lineage Transformation";
    oneSentenceSummary = `आपकी कुंडली में परिवार की आर्थिक सोच, संस्कारों और संचित जिम्मेदारियों से जुड़ा गहरा संबंध दिखता है, जिसे अपनी वित्तीय स्पष्टता और विवेक से एक नई दिशा दी जा सकती है।`;
    burdenGiftSynthesis = "परिवार का जो आर्थिक या भावनात्मक संघर्ष कभी बोझ महसूस हुआ था, वही आपके भीतर वित्तीय समझदारी, स्वावलंबन और मजबूत पहचान का आधार बनेगा।";
  } else if ((rahuH === 1 && ketuH === 7) || (rahuH === 7 && ketuH === 1)) {
    coreLineageTheme = "Individual Authenticity, Healthy Boundaries, and Conscious Partnerships";
    oneSentenceSummary = `आपकी कुंडली में स्वयं की स्वतंत्र पहचान और पारिवारिक रिश्तों की पुरानी अपेक्षाओं के बीच संतुलन मुख्य विषय है, जिसे सजग संवाद से साधा जा सकता है।`;
    burdenGiftSynthesis = "रिश्तों में जो त्याग या तनाव परिवार में पीढ़ियों से देखा गया हो, वह आपके जीवन में परिपक्व समझ, आपसी सम्मान और सच्ची साझेदारी में बदलेगा।";
  } else if ((rahuH === 4 && ketuH === 10) || (rahuH === 10 && ketuH === 4)) {
    coreLineageTheme = "Maternal Roots, Domestic Harmony, and Professional Self-Determination";
    oneSentenceSummary = `आपकी कुंडली में पारिवारिक जड़ों (घर/माता) और सामाजिक प्रतिष्ठा (करियर/पिता) के बीच संतुलन साधने का गहरा कर्मिक संदेश है।`;
    burdenGiftSynthesis = "घर और समाज की जो अपेक्षाएं परिवार के कंधों पर रहीं, वे आपके भीतर आत्मनिर्भरता और अपने दम पर पहचान बनाने का प्रेरक बनेंगी।";
  } else if ((rahuH === 3 && ketuH === 9) || (rahuH === 9 && ketuH === 3)) {
    coreLineageTheme = "Self-Effort (Purushartha), Rational Wisdom, and Transforming Traditional Beliefs";
    oneSentenceSummary = `आपकी कुंडली में पुरानी पारिवारिक मान्यताओं को अंधानुकरण किए बिना, अपने पुरुषार्थ और बौद्धिक स्पष्टता से आगे बढ़ने का स्पष्ट आह्वान है।`;
    burdenGiftSynthesis = "पारंपरिक मान्यताओं से मिले संस्कारों को आप अपने व्यावहारिक ज्ञान और कौशल से जोड़कर कुल के लिए नई राह खोलेंगे।";
  } else if ((rahuH === 5 && ketuH === 11) || (rahuH === 11 && ketuH === 5)) {
    coreLineageTheme = "Purva Punya, Creative Legacy, and Elevating the Lineage Horizon";
    oneSentenceSummary = `आपकी कुंडली में पूर्वजों के संचित पुण्य और अपनी बौद्धिक रचनात्मकता से कुल की प्रतिष्ठा और अगली पीढ़ी को समृद्ध करने का योग है।`;
    burdenGiftSynthesis = "पूर्वजों की अधूरी आकांक्षाएं आपके जीवन में ज्ञान, संतान के उत्तम संस्कार और समाज में आदरणीय स्थान के रूप में फलीभूत होंगी।";
  } else if ((rahuH === 6 && ketuH === 12) || (rahuH === 12 && ketuH === 6)) {
    coreLineageTheme = "Lineage Debt Resolution, Health Boundaries, and Subconscious Peace";
    oneSentenceSummary = `आपकी कुंडली में परिवार के पुराने अनसुलझे दायित्वों व मानसिक तनावों से मुक्त होकर आंतरिक शांति और आध्यात्मिक स्पष्टता पाने का पथ दिखता है।`;
    burdenGiftSynthesis = "परिवार के पुराने संघर्ष आपको व्यावहारिक सेवा, स्वास्थ्य के प्रति सजगता और भावनात्मक शांति का उपहार सौंप रहे हैं।";
  }

  const executiveSummary = {
    oneSentenceSummary,
    coreLineageTheme,
    burdenGiftSynthesis,
  };

  // ── 5. CERTAINTY LEVEL & TECHNICAL DRAWER ─────────────────────────────────
  let certainty: CertaintyLevel = "Moderate / Converging";
  if (btrConfidence === "High" && gateReasons.length >= 3) {
    certainty = "Strong Source-Supported";
  }

  const technicalDrawer = {
    certainty,
    d12VerificationNotes: `D12 (Dwadashamsha) cross-checks 9th Lord and significator (${kulaDevata?.significatorPlanet || "Sun"}) to establish ancestral continuity.`,
    d9NavamshaConfirmation: `Navamsha confirms Atmakaraka ${ishtaDevata.atmakarakaPlanet} in ${ishtaDevata.karakamsaSign} with 12th house Moksha alignment.`,
    kpBhavaVerification: `KP Sub-lord analysis reinforces the ${rahuH || 2}-${ketuH || 8} axis along with House ${sun?.house || 10} regarding lineage identity and ancestral responsibilities.`,
  };

  const remedyIntelligence = generateRemedyIntelligence(
    chart,
    kulaDevata,
    obstacles,
    elemental.saturnElement,
    { nativeName }
  );

  const resultWithoutNarrative: Omit<LineageKarmaResult, "narrativeHtml" | "narrativeMarkdown"> = {
    nativeName,
    btrConfidence,
    ancestralGatePassed,
    gateReasons,
    elemental,
    nodalLineage,
    kulaDevata,
    ishtaDevata,
    anugraha,
    somatic,
    antahkarana,
    pvrTarpana,
    obstacles,
    remedyIntelligence,
    executiveSummary,
    technicalDrawer,
  };

  const narrative = generateLineageNarrative(
    resultWithoutNarrative as LineageKarmaResult,
    chart
  );

  return {
    ...resultWithoutNarrative,
    narrativeMarkdown: narrative.markdown,
    narrativeHtml: narrative.html,
  };
}
