// src/lib/astro-engine/navtara-problem-solver.ts
// AstroLife — Authentic 6-Domain Life Problem Navtara & Dasha Synergy Engine
// Computes Karyesh Atimitra, Dasha/Antardasha Alignment, Bridge Stars, and Actionable Dynamic Remedies.

import {
  getNakshatraById,
  getNakshatraByName,
  type NakshatraData,
} from "./nakshatra-data";
import type { ChartData, PlanetData } from "./calculations";
import type { DashaLord } from "./dasha";

// ── Classical 9 Taras Reference ─────────────────────────────────────────────

export interface TaraBasicInfo {
  taraNum: number;
  name: string;
  sanskritName: string;
}

export const PROBLEM_SOLVER_TARAS: Record<number, TaraBasicInfo> = {
  1: { taraNum: 1, name: "Janma", sanskritName: "जन्म तारा" },
  2: { taraNum: 2, name: "Sampat", sanskritName: "सम्पत् तारा" },
  3: { taraNum: 3, name: "Vipat", sanskritName: "विपत् तारा" },
  4: { taraNum: 4, name: "Kshema", sanskritName: "क्षेम तारा" },
  5: { taraNum: 5, name: "Pratyak", sanskritName: "प्रत्यरि तारा" },
  6: { taraNum: 6, name: "Sadhaka", sanskritName: "साधक तारा" },
  7: { taraNum: 7, name: "Vadha", sanskritName: "वध तारा" },
  8: { taraNum: 8, name: "Mitra", sanskritName: "मित्र तारा" },
  9: { taraNum: 9, name: "Atimitra", sanskritName: "अतिमित्र तारा" },
};

export function calculateTaraNum(sourceId: number, targetId: number): number {
  const diff = targetId - sourceId;
  return (((diff % 9) + 9) % 9) + 1;
}

// ── Types ───────────────────────────────────────────────────────────────────

export type LifeProblemId =
  | "marriage"
  | "career"
  | "health"
  | "wealth"
  | "children"
  | "mental_peace";

export type SynergyVerdict =
  | "EXCELLENT_FLOW"
  | "SUPPORTIVE"
  | "FRICTION_NEEDS_BRIDGE"
  | "CRITICAL_CAUTION";

export interface ProblemAtimitraStar {
  id: number;
  name: string;
  lord: string;
  paryaya: "Prathama" | "Dvitiya" | "Tritiya";
  deity: string;
  tattva: string;
  primaryQuality: string;
}

export interface ProblemDashaSynergy {
  activeMD: string;
  activeAD: string;
  mdNakshatra?: string;
  adNakshatra?: string;
  karyeshToAdTaraNum: number;
  karyeshToAdTaraName: string;
  adToKaryeshTaraNum: number;
  adToKaryeshTaraName: string;
  synergyVerdict: SynergyVerdict;
  synergyTitleHindi: string;
  synergyExplanation: string;
  bridgeStar: {
    id: number;
    name: string;
    lord: string;
    deity: string;
    tattva: string;
    reason: string;
  };
}

export interface ProblemActionableRemedy {
  deityUpasana: string;
  tattvaAction: string;
  timingGuidance: string;
  practicalLifeStep: string;
  prohibition: string;
}

export interface LifeProblemDomain {
  id: LifeProblemId;
  titleHindi: string;
  titleEnglish: string;
  subtitleHindi: string;
  icon: string;
  badge: string;
  primaryHouseNum: number;
  houseSign: string;
  karyeshLord: string;
  karyeshPlacement: {
    sign: string;
    house: number;
    nakshatra: string;
    pada: number;
    dignity?: string;
  };
  karyeshAtimitraStars: ProblemAtimitraStar[];
  dashaContext: ProblemDashaSynergy;
  goldenActionRule: string;
  actionableRemedy: ProblemActionableRemedy;
  statusScore: number; // 0 to 100
  statusTone: "green" | "gold" | "amber" | "rose";
}

export interface LifeProblemDossierReport {
  problems: LifeProblemDomain[];
  summary: {
    mostPromisingArea: LifeProblemDomain;
    areaNeedingCare: LifeProblemDomain;
    activeDashaLabel: string;
    totalProblemsCount: number;
  };
}

// ── Rashi Lord Mappings ──────────────────────────────────────────────────────

const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const RASHI_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

const RASHI_HINDI: Record<string, string> = {
  Aries: "मेष", Taurus: "वृषभ", Gemini: "मिथुन", Cancer: "कर्क",
  Leo: "सिंह", Virgo: "कन्या", Libra: "तुला", Scorpio: "वृश्चिक",
  Sagittarius: "धनु", Capricorn: "मकर", Aquarius: "कुंभ", Pisces: "मीन"
};

const PLANET_HINDI: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु"
};

// ── Helper: Resolve House Sign and Lord ──────────────────────────────────────

function resolveHouseInfo(lagnaNum: number, houseNum: number): { signName: string; lord: string } {
  const signIdx = ((lagnaNum + houseNum - 1) % 12 + 12) % 12;
  const signName = RASHIS[signIdx];
  const lord = RASHI_LORDS[signName] || "Jupiter";
  return { signName, lord };
}

// ── Helper: Get Nakshatra ID of a Planet ────────────────────────────────────

function getPlanetNakshatraId(planet?: PlanetData): number {
  if (!planet) return 1;
  if (planet.nakshatra) {
    const found = getNakshatraByName(planet.nakshatra);
    if (found) return found.id;
  }
  const normLon = ((planet.lon % 360) + 360) % 360;
  return Math.min(27, Math.max(1, Math.floor(normLon / (360 / 27)) + 1));
}

// ── Helper: Compute Atimitra Stars from Source Nakshatra ─────────────────────

function computeAtimitraStars(sourceNakId: number): ProblemAtimitraStar[] {
  // Atimitra / Param Mitra are position 9 (Paryaya 1), 18 (Paryaya 2), 27 (Paryaya 3)
  const offsets: Array<{ offset: number; paryaya: "Prathama" | "Dvitiya" | "Tritiya" }> = [
    { offset: 8, paryaya: "Prathama" },
    { offset: 17, paryaya: "Dvitiya" },
    { offset: 26, paryaya: "Tritiya" },
  ];

  return offsets.map(({ offset, paryaya }) => {
    const targetId = ((sourceNakId - 1 + offset) % 27) + 1;
    const nak = getNakshatraById(targetId);
    return {
      id: nak.id,
      name: nak.name,
      lord: nak.lord,
      paryaya,
      deity: nak.devta,
      tattva: nak.tattva,
      primaryQuality: nak.primaryQuality,
    };
  });
}

// ── Main Engine Calculation ─────────────────────────────────────────────────

export function evaluateLifeProblemNavtaraDossier(
  chart: ChartData,
  activeMD?: DashaLord,
  activeAD?: DashaLord
): LifeProblemDossierReport {
  const lagnaNum = typeof chart.lagnaNum === "number" ? chart.lagnaNum : 0;

  // Fallback to active dashas from chart if not explicitly passed
  const mdName = activeMD || chart.dashas?.find((d) => d.active)?.planet || "Rahu";
  const adName = activeAD || chart.antardasha?.find((d) => d.active)?.planet || "Jupiter";

  const mdPlanet = chart.planets[mdName];
  const adPlanet = chart.planets[adName];

  const mdNakId = getPlanetNakshatraId(mdPlanet);
  const adNakId = getPlanetNakshatraId(adPlanet);

  // Define problem specifications
  const problemConfigs: Array<{
    id: LifeProblemId;
    titleHindi: string;
    titleEnglish: string;
    subtitleHindi: string;
    icon: string;
    badge: string;
    primaryHouseNum: number;
    fallbackLord: string;
    remedyTemplates: {
      deityUpasana: string;
      tattvaAction: string;
      timingGuidance: string;
      practicalLifeStep: string;
      prohibition: string;
    };
  }> = [
    {
      id: "marriage",
      titleHindi: "विवाह, रिश्ता एवं दांपत्य सुख",
      titleEnglish: "Marriage, Proposals & Relationship Harmony",
      subtitleHindi: "सप्तमेश और विवाह कारक के अतिमित्र से रिश्ते का ताला खोलें",
      icon: "💍",
      badge: "सप्तम भाव · विवाह",
      primaryHouseNum: 7,
      fallbackLord: "Venus",
      remedyTemplates: {
        deityUpasana: "मां पार्वती एवं भगवान शिव की संयुक्त पूजा (शिव-शक्ति अर्चन)",
        tattvaAction: "शुक्रवार या अतिमित्र नक्षत्र के दिन सुहाग सामग्री या सफेद मिष्ठान का अर्पण",
        timingGuidance: "अतिमित्र नक्षत्र के गोचर में सुबह 10:00 से 12:00 के बीच बातचीत आगे बढ़ाएं",
        practicalLifeStep: "विवाह बायोडाटा भेजना, पहली मुलाकात या रिश्ते की चर्चा अतिमित्र नक्षत्र में ही करें",
        prohibition: "विपत् (T3) व वध (T7) तारा के दिन शादी की गंभीर चर्चा या अहंकारपूर्ण बहस से बचें",
      },
    },
    {
      id: "career",
      titleHindi: "करियर, नौकरी एवं पदोन्नति",
      titleEnglish: "Career Growth, Job Offers & Promotion",
      subtitleHindi: "दशमेश और षष्ठेश के अतिमित्र से कार्यक्षेत्र में विजय पाएं",
      icon: "💼",
      badge: "दशम भाव · कर्म",
      primaryHouseNum: 10,
      fallbackLord: "Saturn",
      remedyTemplates: {
        deityUpasana: "भगवान सूर्य देव को प्रातः अर्घ्य एवं आदित्य हृदय स्तोत्र / हनुमान चालीसा",
        tattvaAction: "शनिवार या अतिमित्र नक्षत्र पर कार्यस्थल के सहकर्मियों या सहायकों को भोजन में सहयोग",
        timingGuidance: "अभिजीत मुहूर्त या अतिमित्र नक्षत्र में जॉब इंटरव्यू या सैलरी डिस्कशन शेड्यूल करें",
        practicalLifeStep: "महत्वपूर्ण रिज्यूमे भेजना, प्रोजेक्ट लॉन्च या क्लाइंट एग्रीमेंट अतिमित्र दिन करें",
        prohibition: "प्रत्यरि (T5) तारा में बॉस या सीनियर अधिकारियों से टकराव या तीखी बहस बिल्कुल न करें",
      },
    },
    {
      id: "health",
      titleHindi: "स्वास्थ्य, रोग-मुक्ति एवं जीवन ऊर्जा",
      titleEnglish: "Health, Vitality & Disease Recovery",
      subtitleHindi: "लग्नेश की आरोग्य तारा से रोग प्रतिरोधक क्षमता और हीलिंग जगाएं",
      icon: "🩺",
      badge: "प्रथम भाव · काया",
      primaryHouseNum: 1,
      fallbackLord: "Sun",
      remedyTemplates: {
        deityUpasana: "भगवान महामृत्युंजय या धन्वंतरि देव का स्मरण व जल अभिषेक",
        tattvaAction: "अतिमित्र नक्षत्र में औषधि की पहली खुराक शुरू करें या तांबे/चांदी का जल सेवन करें",
        timingGuidance: "सुबह सूर्योदय के समय 15 मिनट धूप स्नान और अनुलोम-विलोम प्राणायाम",
        practicalLifeStep: "नई डाइट, डॉक्टर की सलाह या सर्जरी का चयन अतिमित्र/क्षेम नक्षत्र में ही रखें",
        prohibition: "वध (T7) तारा या चंद्राष्टम के दिन भारी गरिष्ठ भोजन या स्वास्थ्य को लेकर लापरवाही न बरतें",
      },
    },
    {
      id: "wealth",
      titleHindi: "धन संचय, व्यापार एवं कर्ज-मुक्ति",
      titleEnglish: "Wealth Accumulation, Business & Debt Clearance",
      subtitleHindi: "धनेश व लाभेश के संपत-अतिमित्र से आर्थिक अवरोध और कर्ज समाप्त करें",
      icon: "💰",
      badge: "द्वितीय व एकादश भाव · धन",
      primaryHouseNum: 2,
      fallbackLord: "Jupiter",
      remedyTemplates: {
        deityUpasana: "महालक्ष्मी एवं कुबेर देव का ध्यान (श्री सूक्तम पाठ)",
        tattvaAction: "गुरुवार या अतिमित्र नक्षत्र के दिन स्वर्ण, पीतल या पीले फल का सात्विक सदुपयोग",
        timingGuidance: "अतिमित्र नक्षत्र के दिन कर्ज की पहली किस्त या ईएमआई का भुगतान करें (कर्ज-मुक्ति नियम)",
        practicalLifeStep: "बड़ा निवेश, बैंक खाता खोलना या नई डील साइन करना अतिमित्र नक्षत्र में करें",
        prohibition: "विपत् (T3) तारा के दिन किसी को अनधिकृत उधार न दें और न ही कोई सट्टा/जोखिम लें",
      },
    },
    {
      id: "children",
      titleHindi: "संतान सुख, गर्भाधान एवं विद्या",
      titleEnglish: "Progeny, Conception & Academic Success",
      subtitleHindi: "पंचमेश और देवगुरु के अतिमित्र से वंश वृद्धि व मेधा शक्ति बढ़ाएं",
      icon: "👶",
      badge: "पंचम भाव · संतान",
      primaryHouseNum: 5,
      fallbackLord: "Jupiter",
      remedyTemplates: {
        deityUpasana: "संतान गोपाल मंत्र या भगवान श्री कृष्ण के बाल रूप की सेवा",
        tattvaAction: "अतिमित्र नक्षत्र पर गाय को हरा चारा व गुड़ खिलाएं और छोटे बच्चों को फल बांटें",
        timingGuidance: "शुक्ल पक्ष में अतिमित्र/क्षेम नक्षत्र के दिन गर्भाधान या परीक्षा का संकल्प लें",
        practicalLifeStep: "फर्टिलिटी ट्रीटमेंट, मेडिकल कंसल्टेशन या एडमिशन फॉर्म अतिमित्र दिन ही सबमिट करें",
        prohibition: "प्रत्यरि (T5) या वध (T7) तारा के दिन मानसिक तनाव, हीनभावना या व्यर्थ चिंता से दूर रहें",
      },
    },
    {
      id: "mental_peace",
      titleHindi: "मानसिक शांति, तनाव व कोर्ट/शत्रु निवारण",
      titleEnglish: "Mental Peace, Anxiety Relief & Legal Victory",
      subtitleHindi: "चंद्रमा और चतुर्थेश के अतिमित्र से ओवरथिंकिंग रोकें और विजय पाएं",
      icon: "🧠",
      badge: "चतुर्थ भाव · शांति",
      primaryHouseNum: 4,
      fallbackLord: "Moon",
      remedyTemplates: {
        deityUpasana: "भगवान शिव को शीतल जल व सफेद चंदन अर्पण (चंद्रमा की शांति)",
        tattvaAction: "शुद्ध चांदी के पात्र में जल पीना और रात को सोने से पहले तलवों की मालिश",
        timingGuidance: "पूर्णिमा या अतिमित्र नक्षत्र के दिन ध्यान (Meditation) और डिजिटल डिटॉक्स रखें",
        practicalLifeStep: "कोर्ट केस का जवाब, कानूनी बातचीत या समझौते की पहल अतिमित्र नक्षत्र में करें",
        prohibition: "विपत् (T3) तारा के दिन सोशल मीडिया पर व्यर्थ बहस या रात को देर तक जागने से बचें",
      },
    },
  ];

  const evaluatedProblems: LifeProblemDomain[] = problemConfigs.map((cfg) => {
    // 1. Resolve House & Karyesh
    const { signName, lord } = resolveHouseInfo(lagnaNum, cfg.primaryHouseNum);
    const karyeshLord = lord || cfg.fallbackLord;
    const karyeshPlanet = chart.planets[karyeshLord] || chart.planets[cfg.fallbackLord] || Object.values(chart.planets)[0];

    const karyeshNakId = getPlanetNakshatraId(karyeshPlanet);
    const karyeshPlacement = {
      sign: karyeshPlanet?.sign || signName,
      house: karyeshPlanet?.house || cfg.primaryHouseNum,
      nakshatra: karyeshPlanet?.nakshatra || getNakshatraById(karyeshNakId).name,
      pada: karyeshPlanet?.pada || 1,
      dignity: karyeshPlanet?.dignity || "Normal",
    };

    // 2. Karyesh Atimitra Stars (Positions 9, 18, 27 from Karyesh)
    const karyeshAtimitraStars = computeAtimitraStars(karyeshNakId);

    // 3. Evaluate Tara Relationship between Karyesh and Active AD
    const karyeshToAdTaraNum = calculateTaraNum(karyeshNakId, adNakId);
    const karyeshToAdTara = PROBLEM_SOLVER_TARAS[karyeshToAdTaraNum];

    const adToKaryeshTaraNum = calculateTaraNum(adNakId, karyeshNakId);
    const adToKaryeshTara = PROBLEM_SOLVER_TARAS[adToKaryeshTaraNum];

    // Determine Synergy Verdict and Score
    let synergyVerdict: SynergyVerdict = "SUPPORTIVE";
    let synergyTitleHindi = "अनुकूल प्रवाह";
    let statusScore = 75;
    let statusTone: LifeProblemDomain["statusTone"] = "green";
    let explanation = "";

    const isHarmonious = [2, 4, 6, 8, 9].includes(karyeshToAdTaraNum);
    const isHostile = [3, 5, 7].includes(karyeshToAdTaraNum);

    if (karyeshToAdTaraNum === 9 || karyeshToAdTaraNum === 2) {
      synergyVerdict = "EXCELLENT_FLOW";
      synergyTitleHindi = "सर्वश्रेष्ठ स्वर्णिम योग (Super Harmonic)";
      statusScore = 92;
      statusTone = "green";
      explanation = `वर्तमान अंतर्दशानाथ (${PLANET_HINDI[adName] || adName}) और इस कार्य के स्वामी (${PLANET_HINDI[karyeshLord] || karyeshLord}) के बीच ${karyeshToAdTara.sanskritName} का अत्यंत शुभ संबंध है। इस क्षेत्र में प्रगति बहुत तीव्र और स्वतः होगी।`;
    } else if (isHarmonious) {
      synergyVerdict = "SUPPORTIVE";
      synergyTitleHindi = "सकारात्मक व सहायक (Supportive Flow)";
      statusScore = 80;
      statusTone = "gold";
      explanation = `वर्तमान दशा इस कार्य को बल दे रही है (${karyeshToAdTara.sanskritName})। सही समय पर सही प्रयास करने से सफलता के मजबूत योग हैं।`;
    } else if (isHostile) {
      synergyVerdict = "FRICTION_NEEDS_BRIDGE";
      synergyTitleHindi = "घर्षण व अवरोध (Bridge Remedy Required)";
      statusScore = 55;
      statusTone = "amber";
      explanation = `अंतर्दशानाथ और कार्येश के बीच ${karyeshToAdTara.sanskritName} बन रही है, जिसके कारण बातचीत या परिणामों में अकारण देरी, मानसिक संशय या रुकावटें आ सकती हैं। नीचे दिए गए साझा अतिमित्र का उपयोग अनिवार्य है।`;
    } else {
      synergyVerdict = "SUPPORTIVE";
      synergyTitleHindi = "आधारभूत स्थिति (Foundational)";
      statusScore = 68;
      statusTone = "gold";
      explanation = `दशा और कार्येश का संबंध सामान्य है। दृढ़ संकल्प और नियमित साधना से इच्छित फल प्राप्त होगा।`;
    }

    // 4. Compute Universal Bridge Star
    // The Bridge Star is the Karyesh Atimitra that is most supportive to the active AD
    let bestBridge = karyeshAtimitraStars[0];
    let bestBridgeTaraToAD = 9;

    for (const star of karyeshAtimitraStars) {
      const taraToAd = calculateTaraNum(star.id, adNakId);
      if ([2, 4, 6, 8, 9].includes(taraToAd)) {
        bestBridge = star;
        bestBridgeTaraToAD = taraToAd;
        break;
      }
    }

    const bridgeStarInfo = getNakshatraById(bestBridge.id);
    const bridgeReason = `यह नक्षत्र (${bestBridge.name}) कार्येश ${PLANET_HINDI[karyeshLord] || karyeshLord} का अतिमित्र है और वर्तमान अंतर्दशा ${PLANET_HINDI[adName] || adName} की ऊर्जा को संतुलित कर अवरोधों को तुरंत शांत करता है।`;

    return {
      id: cfg.id,
      titleHindi: cfg.titleHindi,
      titleEnglish: cfg.titleEnglish,
      subtitleHindi: cfg.subtitleHindi,
      icon: cfg.icon,
      badge: `${cfg.badge} · ${RASHI_HINDI[signName] || signName} (${PLANET_HINDI[karyeshLord] || karyeshLord})`,
      primaryHouseNum: cfg.primaryHouseNum,
      houseSign: signName,
      karyeshLord,
      karyeshPlacement,
      karyeshAtimitraStars,
      dashaContext: {
        activeMD: mdName,
        activeAD: adName,
        mdNakshatra: mdPlanet?.nakshatra,
        adNakshatra: adPlanet?.nakshatra,
        karyeshToAdTaraNum,
        karyeshToAdTaraName: karyeshToAdTara.sanskritName,
        adToKaryeshTaraNum,
        adToKaryeshTaraName: adToKaryeshTara.sanskritName,
        synergyVerdict,
        synergyTitleHindi,
        synergyExplanation: explanation,
        bridgeStar: {
          id: bridgeStarInfo.id,
          name: bridgeStarInfo.name,
          lord: bridgeStarInfo.lord,
          deity: bridgeStarInfo.devta,
          tattva: bridgeStarInfo.tattva,
          reason: bridgeReason,
        },
      },
      goldenActionRule: `जब गोचर में चंद्रमा ${karyeshAtimitraStars.map(s => s.name).join(" या ")} नक्षत्र में प्रवेश करे, उस 24-48 घंटे की खिड़की में इस कार्य से जुड़ा सबसे महत्वपूर्ण कदम उठाएं।`,
      actionableRemedy: {
        ...cfg.remedyTemplates,
        timingGuidance: `${cfg.remedyTemplates.timingGuidance} (विशेषकर ${bestBridge.name} नक्षत्र दिवस पर)`,
      },
      statusScore,
      statusTone,
    };
  });

  // Sort by score to identify most promising and area needing care
  const sorted = [...evaluatedProblems].sort((a, b) => b.statusScore - a.statusScore);
  const mostPromisingArea = sorted[0];
  const areaNeedingCare = sorted[sorted.length - 1];

  return {
    problems: evaluatedProblems,
    summary: {
      mostPromisingArea,
      areaNeedingCare,
      activeDashaLabel: `${PLANET_HINDI[mdName] || mdName} महादशा · ${PLANET_HINDI[adName] || adName} अंतर्दशा`,
      totalProblemsCount: evaluatedProblems.length,
    },
  };
}
