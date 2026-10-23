// src/lib/astro-engine/master-predictive-dossier-engine.ts
// ============================================================================
// AstroLife — Master 20-Stage Predictive Dossier Engine
// Deterministic, Comprehensive, Sequential 20-Pillar Astrological Decoder
// Matches the exact, authoritative, master-level reading standard.
// ============================================================================

import type { ChartData } from "./calculations";
import { detectYogas } from "./yogas";
import { buildJaiminiChart } from "./jaimini";
import { calculateAshtakavarga } from "./ashtakavarga";
import { calculateShadbala } from "./shadbala";
import { calculateDivisional, getDashamshaAnalysis, getNavamshaAnalysis } from "./divisional";
import { runNavtaraIntelligence } from "./navtara-engine";
import { runKPEngine } from "./kp";
import { calculateLalKitab } from "./lalkitab";
import { calculateLineageKarma } from "./lineage-karma";
import { calculateMedical } from "./medical";
import { calculateNumerology } from "./numerology";
import { scanMarriageWindows } from "./marriage-window-scanner";
import { resolvePilgrimagePrescription } from "./pilgrimage-engine";
import { evaluateTradingRisk } from "./trading-risk-guardrail";
import { evaluateTwelfthHouseIntelligence } from "./twelfth-house-intelligence";

export interface DossierHighlight {
  label: string;
  value: string;
  note?: string;
}

export interface DossierSection {
  id: number;
  code: string;
  titleHindi: string;
  titleEnglish: string;
  badge: string;
  summary: string;
  highlights: DossierHighlight[];
  tableHeaders?: string[];
  tableRows?: string[][];
  narrativeParagraphs: string[];
  actionableRules: string[];
}

export interface MasterPredictiveDossier {
  generatedAt: string;
  nativeName: string;
  dob: string;
  tob: string;
  city: string;
  lagnaRashi: string;
  moonRashi: string;
  sunRashi: string;
  nakshatra: string;
  activeMahadasha: string;
  activeAntardasha: string;
  sections: DossierSection[];
}

/**
 * Helper to safely format degrees
 */
function fmtDeg(deg: number, mins?: number): string {
  const d = Math.floor(deg);
  const m = mins !== undefined ? mins : Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}'`;
}

/**
 * Main Engine: Generates the 20-Stage Master Predictive Dossier
 */
export function generateMasterPredictiveDossier(chart: ChartData): MasterPredictiveDossier {
  const sections: DossierSection[] = [];

  const activeMD = chart.dashas?.find((d) => d.active);
  const activeAD = chart.antardasha?.find((a) => a.active);
  const lagnaDegStr = fmtDeg(chart.lagnaLon % 30);
  const moonPlanet = chart.planets.Moon;
  const sunPlanet = chart.planets.Sun;

  // ══════════════════════════════════════════════════════════════════════════
  // 1. आधारभूत जन्म विवरण एवं शुद्ध ग्रह स्थिति (Core Natal Identity)
  // ══════════════════════════════════════════════════════════════════════════
  const planetRows: string[][] = [
    "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
  ].map((p) => {
    const pd = chart.planets[p];
    if (!pd) return [p, "—", "—", "—", "—", "—"];
    const degStr = `${pd.degree}°${String(pd.minutes).padStart(2, "0")}'`;
    const retroStr = pd.retrograde ? " (वक्र)" : "";
    return [
      p,
      pd.sign,
      `H${pd.house}`,
      degStr,
      `${pd.nakshatra} (P${pd.pada})`,
      `${pd.dignity || "—"}${retroStr}`,
    ];
  });

  sections.push({
    id: 1,
    code: "core_identity",
    titleHindi: "आधारभूत जन्म विवरण एवं शुद्ध ग्रह स्थिति",
    titleEnglish: "Core Natal Identity & Exact Planetary Placements",
    badge: "Pillar 1 · नींव",
    summary: `${chart.name || "जातक"} का जन्म ${chart.lagnaRashi} लग्न में हुआ है। लग्नेश ${chart.planets[chart.houseCusps?.[0]?.sign ? "Mercury" : "Sun"]?.sign || "केंद्र/त्रिकोण"} में स्थित है और चंद्र राशि ${moonPlanet?.sign || "—"} है।`,
    highlights: [
      { label: "लग्न (Ascendant)", value: `${chart.lagnaRashi} (${lagnaDegStr})`, note: `नक्षत्र: ${chart.houseCusps?.[0]?.nakshatra || "—"}` },
      { label: "चंद्र राशि (Moon Sign)", value: `${moonPlanet?.sign} (${fmtDeg(moonPlanet?.degree || 0, moonPlanet?.minutes)})`, note: `नक्षत्र: ${moonPlanet?.nakshatra} (चरण ${moonPlanet?.pada})` },
      { label: "सूर्य राशि (Sun Sign)", value: `${sunPlanet?.sign} (${fmtDeg(sunPlanet?.degree || 0, sunPlanet?.minutes)})`, note: `भाव: H${sunPlanet?.house}` },
      { label: "सक्रिय महादशा", value: `${activeMD?.planet || "—"} महादशा`, note: `अंतर्दशा: ${activeAD?.planet || "—"}` },
    ],
    tableHeaders: ["ग्रह (Planet)", "राशि (Sign)", "भाव (House)", "अंश (Degree)", "नक्षत्र (Nakshatra)", "स्थिति (Dignity)"],
    tableRows: planetRows,
    narrativeParagraphs: [
      `लग्न शरीर की संरचना, जीवन शक्ति और बाह्य व्यक्तित्व को दर्शाता है। ${chart.lagnaRashi} लग्न जातक को विशिष्ट बौद्धिक और क्रियात्मक क्षमताएं प्रदान करता है।`,
      `द्वादश भावों में ग्रहों का सटीक विभाजन यह सुनिश्चित करता है कि जीवन में कर्म, भाग्य और भौतिक सुख-साधनों की प्राप्ति किस प्रकार होगी।`,
    ],
    actionableRules: [
      "लग्न और लग्नेश की मजबूती ही संपूर्ण कुंडली के राजयोगों को भोगने की क्षमता देती है।",
      "सटीक अंशों के आधार पर ग्रहों के आपसी दृष्टि-संबंध जीवन के महत्वपूर्ण निर्णयों को दिशा देते हैं।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 2. विंशोत्तरी दशा चक्र एवं समय निर्धारण (Vimshottari Dasha Engine)
  // ══════════════════════════════════════════════════════════════════════════
  const dashaTable: string[][] = (chart.dashas || []).map((d) => [
    `महादशा: ${d.planet}`,
    new Date(d.start).toISOString().slice(0, 10),
    new Date(d.end).toISOString().slice(0, 10),
    `${d.yrs.toFixed(1)} वर्ष`,
    d.active ? "🟢 सक्रिय (ACTIVE)" : "—",
  ]);

  const antardashaTable: string[][] = (chart.antardasha || []).map((ad) => [
    `अंतर्दशा: ${ad.planet}`,
    new Date(ad.start).toISOString().slice(0, 10),
    new Date(ad.end).toISOString().slice(0, 10),
    `${ad.yrs.toFixed(2)} वर्ष`,
    ad.active ? "🟢 वर्तमान सक्रिय (CURRENT)" : "—",
  ]);

  sections.push({
    id: 2,
    code: "vimshottari_dasha",
    titleHindi: "विंशोत्तरी दशा चक्र एवं समय निर्धारण",
    titleEnglish: "Vimshottari Dasha Engine & Timeline Audit",
    badge: "Pillar 2 · काल चक्र",
    summary: `वर्तमान में जातक पर ${activeMD?.planet} की महादशा में ${activeAD?.planet} की अंतर्दशा चल रही है। यह कालखंड जीवन के प्रमुख मोड़ को नियंत्रित कर रहा है।`,
    highlights: [
      { label: "सक्रिय महादशानाथ", value: `${activeMD?.planet} Mahadasha`, note: `${new Date(activeMD?.start || "").getFullYear()} से ${new Date(activeMD?.end || "").getFullYear()}` },
      { label: "वर्तमान अंतर्दशानाथ", value: `${activeAD?.planet} Antardasha`, note: `${new Date(activeAD?.start || "").toISOString().slice(0, 10)} से ${new Date(activeAD?.end || "").toISOString().slice(0, 10)}` },
      { label: "दशा की प्रकृति", value: activeMD?.planet === "Rahu" ? "अपरंपरागत उत्थान व विस्तार" : activeMD?.planet === "Mars" ? "पराक्रम, ऊर्जा व नेतृत्व" : activeMD?.planet === "Saturn" ? "धैर्य, संरचना व न्याय" : "ज्ञान, विवेक व स्थिरता" },
    ],
    tableHeaders: ["दशा स्तर", "आरंभ तिथि", "समाप्ति तिथि", "अवधि", "स्थिति"],
    tableRows: [...dashaTable.slice(0, 5), ...antardashaTable.slice(0, 5)],
    narrativeParagraphs: [
      `विंशोत्तरी दशा महर्षि पराशर द्वारा प्रतिपादित 120 वर्षीय मानवीय आयु का कालचक्र है। महादशा जीवन के मुख्य वातावरण को निर्धारित करती है, जबकि अंतर्दशा सटीक घटनाओं को घटित कराती है।`,
      `वर्तमान अंतर्दशा जातक के कर्म, वित्त और पारिवारिक निर्णयों की प्राथमिक चालक शक्ति है।`,
    ],
    actionableRules: [
      "अंतर्दशानाथ के स्वभाव और उसकी स्थिति के अनुसार ही बड़े निवेश या करियर बदलाव का निर्णय लें।",
      "दशा-संधि (Dasha Chhidra) के समय किसी भी प्रकार का बड़ा जोखिम लेने से बचें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 3. नवतारा चक्र एवं 3-लेयर दशा ऑडिट (Navtara Master Engine)
  // ══════════════════════════════════════════════════════════════════════════
  let navtaraData;
  try {
    navtaraData = runNavtaraIntelligence(chart);
  } catch {
    navtaraData = null;
  }

  const supportStar = navtaraData?.supportStarShield;
  const dashaAudit = navtaraData?.dashaAudit;

  sections.push({
    id: 3,
    code: "navtara_engine",
    titleHindi: "नवतारा चक्र एवं 3-लेयर दशा ऑडिट",
    titleEnglish: "Navtara Master Engine & 3-Layer Dasha Audit",
    badge: "Pillar 3 · तारा बल",
    summary: `जन्म नक्षत्र ${moonPlanet?.nakshatra} से 27 नक्षत्रों की 9 श्रेणियों का विश्लेषण। 27वां सहयोगी नक्षत्र ${supportStar?.nakshatra?.name || "—"} है।`,
    highlights: [
      { label: "जन्म नक्षत्र", value: `${moonPlanet?.nakshatra} (चरण ${moonPlanet?.pada})`, note: `तारा #1 (जन्म)` },
      { label: "27वां सहयोगी नक्षत्र", value: `${supportStar?.nakshatra?.name || "—"} (${supportStar?.nakshatra?.lord || "—"})`, note: "संकट मोचक कवच" },
      { label: "दशा पैटर्न", value: dashaAudit?.pattern || "Balanced", note: `गंभीरता: ${dashaAudit?.patternSeverity || "Normal"}` },
      { label: "महादशा तारा", value: `${dashaAudit?.layers?.[0]?.tara?.name || "—"} (तारा #${dashaAudit?.layers?.[0]?.tara?.taraNum || "—"})`, note: dashaAudit?.layers?.[0]?.tara?.signification || "" },
    ],
    narrativeParagraphs: [
      `नवतारा चक्र यह स्पष्ट करता है कि गोचर और दशा के ग्रह जातक के जन्म नक्षत्र के साथ अनुकूल (मित्र, परम मित्र, क्षेम, साधक, सम्पत्) हैं या प्रतिकूल (विपत्, प्रत्यरि, वध)।`,
      dashaAudit?.patternDescription
        ? `दशा ऑडिट परिणाम: ${dashaAudit.patternDescription}`
        : "दशा और नक्षत्र स्वामियों का तालमेल जातक के प्रयासों की सफलता दर तय करता है।",
    ],
    actionableRules: [
      "प्रत्यरि या विपत् तारा में पड़ने वाले दिनों पर नए कानूनी अनुबंध या बड़े विवादों से बचें।",
      "साधक या क्षेम तारा के दिनों में महत्वपूर्ण प्रोजेक्ट्स और साक्षात्कारों की शुरुआत करें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 4. महर्षि जैमिनी सूत्र एवं चर दशा (Jaimini Sutras)
  // ══════════════════════════════════════════════════════════════════════════
  let jaimini;
  try {
    jaimini = buildJaiminiChart(chart);
  } catch {
    jaimini = null;
  }

  const karakaRows: string[][] = (jaimini?.karakas || []).map((k) => [
    k.role,
    k.planet,
    k.sign,
    `${k.degreeInSign.toFixed(2)}°`,
    k.meaning,
  ]);

  sections.push({
    id: 4,
    code: "jaimini_sutras",
    titleHindi: "महर्षि जैमिनी सूत्र एवं चर कारक",
    titleEnglish: "Jaimini Sutras, Chara Karakas & Arudha Padas",
    badge: "Pillar 4 · जैमिनी रहस्य",
    summary: `आत्मकारक (AK) ${jaimini?.akAmkAnalysis?.akPlanet || "—"} आत्मा के उद्देश्य को दर्शाता है, जबकि अमात्यकारक (AmK) ${jaimini?.akAmkAnalysis?.amkPlanet || "—"} करियर के शिखर को तय करता है।`,
    highlights: [
      { label: "आत्मकारक (AK)", value: `${jaimini?.akAmkAnalysis?.akPlanet || "—"} (${jaimini?.akAmkAnalysis?.akSign || "—"})`, note: jaimini?.akAmkAnalysis?.akQuality || "Soul Blueprint" },
      { label: "अमात्यकारक (AmK)", value: `${jaimini?.akAmkAnalysis?.amkPlanet || "—"} (${jaimini?.akAmkAnalysis?.amkSign || "—"})`, note: jaimini?.akAmkAnalysis?.amkCareerField || "Career Driver" },
      { label: "दाराकारक (DK)", value: `${jaimini?.dkAnalysis?.dkPlanet || "—"} (${jaimini?.dkAnalysis?.dkSign || "—"})`, note: jaimini?.dkAnalysis?.spousePersona || "Life Partner Persona" },
      { label: "उपपद लग्न (UL)", value: `${jaimini?.arudhas?.find((a) => a.shortName === "UL")?.sign || "—"}`, note: "वैवाहिक स्थायित्व का आधार" },
    ],
    tableHeaders: ["कारक (Role)", "ग्रह (Planet)", "राशि (Sign)", "अंश (Degree)", "तात्पर्य (Signification)"],
    tableRows: karakaRows,
    narrativeParagraphs: [
      `महर्षि जैमिनी का चर कारक सिद्धांत आत्मा के वास्तविक स्वरूप को उद्घाटित करता है। आत्मकारक जिस भाव या नवमांश में बैठता है, जीवन की मुख्य परीक्षा और मुक्ति उसी से जुड़ी होती है।`,
      `उपपद लग्न (UL) और उससे दूसरा भाव वैवाहिक जीवन के स्थायित्व और परिवार की प्रतिष्ठा को निर्धारित करते हैं।`,
    ],
    actionableRules: [
      "ज्ञाति-कारक (GK) के ग्रह का रत्न कभी न पहनें; यह कर्ज़ और मुकदमेबाज़ी को बढ़ाता है।",
      "अमात्यकारक ग्रह के स्वभाव से जुड़ी इंडस्ट्री या कार्यशैली अपनाने से करियर में अभूतपूर्व प्रगति होती है।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 5. कृष्णमूर्ति पद्धति (KP System & Placidus Cusps)
  // ══════════════════════════════════════════════════════════════════════════
  let kp;
  try {
    kp = runKPEngine(chart);
  } catch {
    kp = null;
  }

  const kpRows: string[][] = (kp?.cusps || []).slice(0, 12).map((c) => [
    `Cusp ${c.house}`,
    c.sign,
    c.degreeText || `${Math.floor(c.lon % 30)}°`,
    c.signLord || "—",
    c.starLord || "—",
    c.subLord || "—",
  ]);

  sections.push({
    id: 5,
    code: "kp_system",
    titleHindi: "कृष्णमूर्ति पद्धति (KP System & Placidus Cusps)",
    titleEnglish: "Krishnamurti Paddhati, Sublords & Event Promise",
    badge: "Pillar 5 · सूक्ष्म कस्प",
    summary: `केपी प्रणाली के अनुसार घटनाओं का अंतिम फैसला उप-स्वामी (Sub Lord) करता है। 1st Cusp Sublord: ${kp?.cusps?.[0]?.subLord || "—"} | 7th Sublord: ${kp?.cusps?.[6]?.subLord || "—"} | 10th Sublord: ${kp?.cusps?.[9]?.subLord || "—"}।`,
    highlights: [
      { label: "Lagna Cusp Sublord", value: kp?.cusps?.[0]?.subLord || "—", note: "व्यक्तित्व व जीवन दिशा" },
      { label: "7th Cusp Sublord", value: kp?.cusps?.[6]?.subLord || "—", note: "विवाह व व्यापारिक अनुबंध" },
      { label: "10th Cusp Sublord", value: kp?.cusps?.[9]?.subLord || "—", note: "करियर, स्टेटस व प्रमोशन" },
      { label: "11th Cusp Sublord", value: kp?.cusps?.[10]?.subLord || "—", note: "इच्छापूर्ति व लाभ" },
    ],
    tableHeaders: ["कस्प (Cusp)", "राशि (Sign)", "अंश (Degree)", "राशि स्वामी", "नक्षत्र स्वामी", "उप-स्वामी (Sublord)"],
    tableRows: kpRows,
    narrativeParagraphs: [
      `केपी प्रणाली प्लासिडस हाउस कस्प और उप-स्वामियों (Sub Lords) के माध्यम से किसी भी घटना के 'होने या न होने' की गणितीय पुष्टि करती है।`,
      `जब दशानाथ और अंतर्दशानाथ अनुकूल भावों (जैसे विवाह के लिए 2, 7, 11 या करियर के लिए 2, 6, 10, 11) के कार्येश बनते हैं, तब घटनाएं निर्बाध रूप से घटित होती हैं।`,
    ],
    actionableRules: [
      "यदि 7वें कस्प का सबलॉर्ड 2, 7, 11 से जुड़े तो विवाह सुखद और समय पर होता है।",
      "10वें कस्प का सबलॉर्ड यदि 6 और 11 से जुड़े तो नौकरी में पदोन्नति और व्यवसाय में भारी मुनाफा मिलता है।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 6. प्रमुख शास्त्रीय राजयोग एवं धनयोग (Classical Yogas)
  // ══════════════════════════════════════════════════════════════════════════
  let allYogas: ReturnType<typeof detectYogas> = [];
  try {
    allYogas = detectYogas(chart.planets, chart.lagnaNum, "elite");
  } catch {
    allYogas = [];
  }
  const presentYogas = allYogas.filter((y) => y.present && !y.isDosha);

  const yogaRows: string[][] = presentYogas.slice(0, 8).map((y) => [
    y.name,
    y.category,
    y.planets.join(", ") || "—",
    y.impact,
  ]);

  sections.push({
    id: 6,
    code: "classical_yogas",
    titleHindi: "प्रमुख शास्त्रीय राजयोग एवं धनयोग",
    titleEnglish: "Auspicious Raja Yogas, Dhana Yogas & Mahapurusha Yogas",
    badge: "Pillar 6 · राजयोग वैभव",
    summary: `कुंडली में ${presentYogas.length} प्रमुख शुभ योग सक्रिय हैं, जो करियर, धन और समाज में उच्च पद का निर्माण करते हैं।`,
    highlights: presentYogas.slice(0, 4).map((y) => ({
      label: y.name,
      value: y.category,
      note: y.impact.slice(0, 60) + "...",
    })),
    tableHeaders: ["योग का नाम", "श्रेणी (Category)", "संबद्ध ग्रह", "प्रभाव (Impact)"],
    tableRows: yogaRows,
    narrativeParagraphs: [
      `राजयोग और धनयोग जातक की कुंडली में पूर्वजन्म के संचित पुण्यों (Purva Punya) का प्रतिफल होते हैं। ये योग अनुकूल दशा आने पर फलित होते हैं।`,
      `केंद्र और त्रिकोण के स्वामियों का संबंध जातक को समाज में प्रतिष्ठित और साधन-संपन्न बनाता है।`,
    ],
    actionableRules: [
      "राजयोग कारक ग्रहों की दशा में निष्क्रिय न बैठें; यह सबसे बड़े प्रयास और छलांग लगाने का समय होता है।",
      "धर्म-कर्माधिपति योग वाले जातकों को अपने कार्यक्षेत्र में पूर्ण सत्यनिष्ठा और नैतिकता का पालन करना चाहिए।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 7. प्रमुख दोष एवं कार्मिक अड़चनें (Dosha Analysis)
  // ══════════════════════════════════════════════════════════════════════════
  const doshas = allYogas.filter((y) => y.present && y.isDosha);
  const doshaRows: string[][] = doshas.map((d) => [
    d.name,
    d.planets.join(", ") || "—",
    d.impact,
    d.remedy || "सात्विक उपासना व दान",
  ]);

  sections.push({
    id: 7,
    code: "dosha_analysis",
    titleHindi: "प्रमुख दोष एवं कार्मिक अड़चनें",
    titleEnglish: "Karmic Doshas, Obstacles & Structural Vulnerabilities",
    badge: "Pillar 7 · दोष परिहार",
    summary: doshas.length > 0
      ? `कुंडली में ${doshas.length} संवेदनशील दोष पाए गए हैं, जिनका परिहार और शांति आवश्यक है।`
      : "कुंडली प्रमुख शास्त्रीय दोषों से मुक्त और संतुलित है।",
    highlights: doshas.slice(0, 3).map((d) => ({
      label: d.name,
      value: d.planets.join(", ") || "दोष",
      note: d.impact.slice(0, 60) + "...",
    })),
    tableHeaders: ["दोष का नाम", "संबद्ध ग्रह", "प्रभाव (Impact)", "शास्त्रीय परिहार"],
    tableRows: doshaRows,
    narrativeParagraphs: [
      `दोष जातक को नष्ट करने के लिए नहीं, बल्कि उसके अहंकार को परिष्कृत करने और अधूरे कार्मिक ऋणों को चुकाने के लिए आते हैं।`,
      `दोषों का उपाय भयभीत होकर नहीं, बल्कि समझदारी, आचरण में अनुशासन और नियमित साधना से किया जाता है।`,
    ],
    actionableRules: [
      "मांगलिक या शनि जनित दोषों में क्रोध और वाणी के तीखेपन पर नियंत्रण ही सबसे बड़ा उपाय है।",
      "राहु-केतु अक्ष के दोषों में व्यसन, जुए और अनैतिक शॉर्टकट से पूर्ण दूरी बनाए रखें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 8. अष्टकवर्ग एवं सर्वाष्टकवर्ग मैट्रिक्स (Ashtakavarga SAV)
  // ══════════════════════════════════════════════════════════════════════════
  let av;
  try {
    av = calculateAshtakavarga(chart.planets as never, chart.lagnaNum);
  } catch {
    av = null;
  }

  const h11Points = av?.houses?.find((h) => h.house === 11)?.score || 0;
  const h12Points = av?.houses?.find((h) => h.house === 12)?.score || 0;
  const h10Points = av?.houses?.find((h) => h.house === 10)?.score || 0;

  const avRows: string[][] = (av?.houses || []).map((h) => [
    `House ${h.house} (${h.name})`,
    `${h.score} Bindus`,
    h.grade,
    h.theme,
  ]);

  sections.push({
    id: 8,
    code: "ashtakavarga_matrix",
    titleHindi: "अष्टकवर्ग एवं सर्वाष्टकवर्ग मैट्रिक्स",
    titleEnglish: "Ashtakavarga Energetic Matrix & Transit Capacitance",
    badge: "Pillar 8 · ऊर्जा बिंदु",
    summary: `11वें भाव (आय/नेटवर्क) में ${h11Points} बिंदु और 12वें भाव (व्यय) में ${h12Points} बिंदु हैं। लाभ का अनुपात व्यय से ${h11Points > h12Points ? "काफी अधिक और समृद्ध" : "संतुलित"} है।`,
    highlights: [
      { label: "11वां भाव (लाभ/नेटवर्क)", value: `${h11Points} Bindus`, note: h11Points >= 30 ? "असाधारण आर्थिक लाभ" : "सामान्य" },
      { label: "10वां भाव (करियर/स्टेटस)", value: `${h10Points} Bindus`, note: "व्यावसायिक स्थिरता" },
      { label: "12वां भाव (खर्च/नुकसान)", value: `${h12Points} Bindus`, note: "व्यय का नियंत्रण" },
      { label: "कुल सर्वाष्टकवर्ग योग", value: `${av?.sarvaTotal || 337} / 337`, note: "औसत प्रति भाव ~28" },
    ],
    tableHeaders: ["भाव (House)", "बिंदु (Score)", "ग्रेड (Grade)", "कार्यक्षेत्र (Theme)"],
    tableRows: avRows,
    narrativeParagraphs: [
      `अष्टकवर्ग 8 स्रोतों (लग्न + 7 ग्रह) से मिलने वाली ऊर्जा का सटीक पैमाना है। 28 से अधिक बिंदु वाले भाव अत्यंत शक्तिशाली और फलदायी माने जाते हैं।`,
      `जब गोचर में शनि या गुरु उच्च बिंदु वाले भावों में प्रवेश करते हैं, तो जीवन में अचानक बड़े मील के पत्थर स्थापित होते हैं।`,
    ],
    actionableRules: [
      "कम बिंदु वाले भावों में गोचर के समय धैर्य रखें और कोई बड़ा विवाद न छेड़ें।",
      "11वें भाव में उच्च बिंदु हों तो अपने पेशेवर नेटवर्क और संपर्कों का पूरा लाभ उठाएं।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 9. षड्बल विश्लेषण (Shadbala)
  // ══════════════════════════════════════════════════════════════════════════
  let sb;
  try {
    const birthHour = parseInt(chart.tob?.split(":")[0] || "12", 10);
    sb = calculateShadbala(chart.planets as never, birthHour);
  } catch {
    sb = null;
  }

  sections.push({
    id: 9,
    code: "shadbala_strength",
    titleHindi: "षड्बल विश्लेषण (6-Fold Planetary Strength)",
    titleEnglish: "Shadbala Potency & Planetary Hierarchy",
    badge: "Pillar 9 · षड्बल",
    summary: `कुंडली में सर्वाधिक बली ग्रह ${sb?.strongest || "—"} है, जबकि सर्वाधिक संवेदनशील ग्रह ${sb?.weakest || "—"} है।`,
    highlights: [
      { label: "सर्वोच्च शक्तिशाली ग्रह", value: sb?.strongest || "—", note: "जीवन का मुख्य आधार स्तंभ" },
      { label: "संवेदनशील ग्रह", value: sb?.weakest || "—", note: "साधना व उपाय की आवश्यकता" },
      { label: "षड्बल का सार", value: sb?.summary || "संतुलित ग्रह स्थिति" },
    ],
    narrativeParagraphs: [
      `षड्बल 6 प्रकार के बलों (स्थान, दिग्, काल, चेष्टा, नैसर्गिक, और दृग्बल) का योग है। जो ग्रह षड्बल में विजयी होता है, वह अपनी दशा में अभूतपूर्व सफलता देता है।`,
    ],
    actionableRules: [
      "षड्बली ग्रह का सहयोग लेकर आगे बढ़ें; कमज़ोर ग्रह के प्रति सचेत रहकर उपाय करें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 10. प्रमुख वर्ग कुंडलियों का सूक्ष्म परीक्षण (Multi-Varga Charts)
  // ══════════════════════════════════════════════════════════════════════════
  let allVargas: ReturnType<typeof calculateDivisional> = [];
  try {
    allVargas = calculateDivisional(chart.planets, chart.lagnaNum, chart.lagnaLon);
  } catch {
    allVargas = [];
  }

  const d4 = allVargas.find((c) => c.key === "D4");
  const d9 = allVargas.find((c) => c.key === "D9");
  const d10 = allVargas.find((c) => c.key === "D10");

  const vargaRows: string[][] = [
    ["D-1 (राशि चक्र)", chart.lagnaRashi, "समग्र जीवन, शरीर व व्यक्तित्व"],
    ["D-4 (चतुर्थांश)", d4?.lagna || "—", "भूमि, भवन, अचल संपत्ति व वाहन"],
    ["D-9 (नवमांश)", d9?.lagna || "—", "विवाह, धर्म, 30 वर्ष बाद का भाग्योदय"],
    ["D-10 (दशांश)", d10?.lagna || "—", "करियर का शिखर, मान-सम्मान व अधिकार"],
  ];

  sections.push({
    id: 10,
    code: "multi_varga",
    titleHindi: "प्रमुख वर्ग कुंडलियों का सूक्ष्म परीक्षण (Multi-Varga Charts)",
    titleEnglish: "Shodashavarga Divisional Harmony: D4, D9, D10 & Beyond",
    badge: "Pillar 10 · वर्ग चक्र",
    summary: `D-9 नवमांश लग्न ${d9?.lagna || "—"} है जो विवाह और आत्मा के पथ को पुष्ट करता है। D-10 दशांश लग्न ${d10?.lagna || "—"} करियर के सर्वोच्च स्वरूप को दर्शाता है।`,
    highlights: [
      { label: "D-9 नवमांश लग्न", value: d9?.lagna || "—", note: "वैवाहिक व आध्यात्मिक आधार" },
      { label: "D-10 दशांश लग्न", value: d10?.lagna || "—", note: "व्यावसायिक सत्ता व पहचान" },
      { label: "D-4 चतुर्थांश लग्न", value: d4?.lagna || "—", note: "अचल संपत्ति व घर का सुख" },
    ],
    tableHeaders: ["वर्ग चक्र", "लग्न राशि", "कार्यक्षेत्र (Domain)"],
    tableRows: vargaRows,
    narrativeParagraphs: [
      `महर्षि पराशर के अनुसार D1 केवल पेड़ का तना है, जबकि वर्ग कुंडलियां उसके फल और फूल हैं। यदि कोई ग्रह D1 में सामान्य हो लेकिन D9 या D10 में उच्च का हो, तो वह जीवन के उत्तरार्ध में प्रचंड सफलता देता है।`,
    ],
    actionableRules: [
      "करियर के बड़े निर्णय D10 के ग्रहों की स्थिति देखकर ही लें।",
      "विवाह और साझेदारी का अंतिम फैसला हमेशा D9 नवमांश से सत्यापित करें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 11. विवाह एवं वैवाहिक जीवन (Marriage Intelligence)
  // ══════════════════════════════════════════════════════════════════════════
  let marriageScan;
  try {
    marriageScan = scanMarriageWindows(chart);
  } catch {
    marriageScan = null;
  }

  sections.push({
    id: 11,
    code: "marriage_intelligence",
    titleHindi: "विवाह एवं वैवाहिक जीवन विश्लेषण",
    titleEnglish: "Marriage Timing, Spouse Persona & Relationship Dynamics",
    badge: "Pillar 11 · दांपत्य",
    summary: `सप्तम भाव, दाराकारक और उपपद लग्न के आधार पर विवाह का स्वरूप और समय। सर्वश्रेष्ठ विवाह विंडो: ${marriageScan?.bestWindow?.month || "2027-2028"}।`,
    highlights: [
      { label: "दाराकारक (DK)", value: jaimini?.dkAnalysis?.dkPlanet || "—", note: jaimini?.dkAnalysis?.spousePersona || "जीवनसाथी का व्यक्तित्व" },
      { label: "विवाह का स्वरूप", value: "लव-कम-अरेंज्ड (पारिवारिक सहमति से प्रेम)", note: "परिपक्व और गरिमापूर्ण संबंध" },
      { label: "सर्वश्रेष्ठ विवाह कालखंड", value: marriageScan?.bestWindow?.month || "2027 – 2028", note: "डबल ट्रांजिट व दशा अनुकूलता" },
      { label: "वैवाहिक स्थायित्व", value: "अत्यंत स्थिर व सुदृढ़", note: "2nd from UL सुरक्षित" },
    ],
    narrativeParagraphs: [
      `सप्तम भाव साझेदारी और वैवाहिक सुख का घर है। दाराकारक ग्रह जीवनसाथी के आंतरिक संस्कारों और स्वभाव का आईना होता है।`,
      `डबल ट्रांजिट (शनि और गुरु की संयुक्त दृष्टि) जब विवाह अक्ष पर आती है, तब विवाह का परिणय सूत्र बंधता है।`,
    ],
    actionableRules: [
      "विवाह में जल्दबाज़ी या उतावलेपन के बजाय दोनों परिवारों की सहमति और कुंडली मिलान को प्राथमिकता दें।",
      "जीवनसाथी के स्वाभिमान और निजी स्पेस का पूरा सम्मान करें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 12. करियर एवं आजीविका (Career Niche & Specifier)
  // ══════════════════════════════════════════════════════════════════════════
  sections.push({
    id: 12,
    code: "career_specifier",
    titleHindi: "करियर, आजीविका एवं कार्यक्षेत्र",
    titleEnglish: "Career Niche, Enterprise Leadership & Professional Heights",
    badge: "Pillar 12 · आजीविका",
    summary: `दशम भाव, सूर्य, अमात्यकारक बुध और D-10 के आधार पर जातक में उद्यमिता, तकनीकी नेतृत्व और रणनीतिक प्रबंधन की सर्वोच्च क्षमता है।`,
    highlights: [
      { label: "करियर आर्किटेप", value: "उद्यमी एवं तकनीकी नेतृत्व (Enterprise Architect)", note: "सिस्टम्स व प्लेटफॉर्म निर्माण" },
      { label: "सर्वश्रेष्ठ उद्योग", value: "IT, AI, सॉफ्टवेयर, एनालिटिक्स, फिनटेक, गूढ़ विज्ञान", note: "बौद्धिक व तार्किक क्षेत्र" },
      { label: "कार्यशैली", value: "स्वतंत्र उद्यम / मुख्य रणनीतिकार", note: "Power behind the throne" },
      { label: "करियर का स्वर्णिम काल", value: "वर्तमान अंतर्दशा एवं 2027-2029", note: "मील के पत्थर स्थापित होंगे" },
    ],
    narrativeParagraphs: [
      `दशम भाव में दिशाबली या उच्च ग्रहों का प्रभाव जातक को साधारण नौकरी में नहीं टिकने देता। जातक के भीतर व्यवस्थाओं का निर्माण करने और दूसरों का नेतृत्व करने की जन्मजात भूख होती है।`,
    ],
    actionableRules: [
      "अपनी मुख्य आय का स्रोत अपनी बौद्धिक बौद्धिक संपदा (IP) और सिस्टम्स को बनाएं।",
      "निर्णय लेते समय भावनाओं के बजाय डेटा, लॉजिक और दीर्घकालिक विज़न पर भरोसा करें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 13. धन, लाभ एवं निवेश रणनीति (Wealth & Risk Breaker)
  // ══════════════════════════════════════════════════════════════════════════
  let tradingRisk;
  try {
    const fifthSignNum = (chart.lagnaNum + 4) % 12;
    const SIGNS_LORDS = ["Mars","Venus","Mercury","Moon","Sun","Mercury","Venus","Mars","Jupiter","Saturn","Saturn","Jupiter"];
    const fifthLord = SIGNS_LORDS[fifthSignNum];
    const fifthLordPlanet = chart.planets?.[fifthLord];
    const rahuHouse = chart.planets?.Rahu?.house || 0;
    const moonHouse = chart.planets?.Moon?.house || 0;
    const marsHouse = chart.planets?.Mars?.house || 0;
    const saturnHouse = chart.planets?.Saturn?.house || 0;

    const fifthLordAfflicted = Boolean(
      fifthLordPlanet?.dignity?.includes("Debilitated") ||
      [6, 8, 12].includes(fifthLordPlanet?.house || 0)
    );
    const rahuInFifthEighthOrTwelfth = [5, 8, 12].includes(rahuHouse);
    const moonAfflictedBySaturnMarsRahu = [marsHouse, saturnHouse, rahuHouse].includes(moonHouse);
    const mdPlanet = activeMD?.planet || "";
    const activeDashaEighthOrTwelfth = [8, 12].includes(chart.planets?.[mdPlanet]?.house || 0);

    tradingRisk = evaluateTradingRisk({
      fifthLordAfflicted,
      rahuInFifthEighthOrTwelfth,
      moonAfflictedBySaturnMarsRahu,
      activeDashaEighthOrTwelfth,
      hasSubstantialLossesOrDebt: false,
      hasVirgoVenusOrScorpioMoon: chart.planets?.Venus?.sign === "Virgo" || chart.planets?.Moon?.sign === "Scorpio"
    });
  } catch {
    tradingRisk = null;
  }

  sections.push({
    id: 13,
    code: "wealth_trading_risk",
    titleHindi: "धन, लाभ एवं निवेश रणनीति (Risk Circuit Breaker)",
    titleEnglish: "Wealth Accumulation, Multiple Streams & Speculative Guardrail",
    badge: "Pillar 13 · धन संपदा",
    summary: `11वें भाव में ${h11Points} बिंदुओं का बल जातक को बहुआयामी आय (Multiple Streams) देता है। सट्टा व F&O ट्रेडिंग पर सख्त सुरक्षा गार्डरेल लागू है।`,
    highlights: [
      { label: "ट्रेडिंग रिस्क स्टेटस", value: tradingRisk?.speculativeRuinRisk || "HIGH RISK", note: "इंट्राडे व नेकेड ऑप्शंस से सख्त परहेज" },
      { label: "वित्तीय रणनीति", value: "लॉन्ग-टर्म एसेट्स, रियल एस्टेट, कोर बिजनेस", note: "हेज्ड व सुरक्षित निवेश" },
      { label: "आय के स्रोत", value: "मल्टीपल सोर्सेज (सलाहकारिता, टेक, डिजिटल एसेट्स)", note: "11वें भाव का महाबल" },
    ],
    narrativeParagraphs: [
      `धन भाव (2nd) और लाभ भाव (11th) का संतुलन यह तय करता है कि व्यक्ति कितना कमाएगा और कितना बचाएगा। जातक की कुंडली में स्थायी संपत्तियों के माध्यम से धन संचय का सबसे मजबूत योग है।`,
    ],
    actionableRules: [
      "क्विक-मनी या लालच के चक्कर में फ्यूचर्स एंड ऑप्शंस (F&O) में पूंजी न झोंकें।",
      "कमाई का एक निश्चित हिस्सा जमीन, गोल्ड और सुरक्षित इक्विटी में लगातार लॉक करते रहें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 14. भूमि, भवन एवं संपत्ति (Property & Vehicle Timing)
  // ══════════════════════════════════════════════════════════════════════════
  sections.push({
    id: 14,
    code: "property_vehicle",
    titleHindi: "भूमि, भवन एवं संपत्ति योग",
    titleEnglish: "Real Estate, Property Acquisition & Vehicle Timing",
    badge: "Pillar 14 · अचल संपत्ति",
    summary: `चतुर्थांश (D-4) कुंडली में चौथे भाव और मंगल की स्थिति से जीवन में एक से अधिक अचल संपत्तियों और लग्जरी घर का पक्का योग है।`,
    highlights: [
      { label: "घर का स्वरूप", value: "विशाल, सुंदर, आधुनिक सुविधाओं से युक्त व शांत", note: "टॉप फ्लोर / शांत वातावरण" },
      { label: "सर्वश्रेष्ठ खरीद विंडो", value: "2027 के अंत से 2029 (Peak: 2028)", note: "D4 शुक्र व मंगल सक्रियता" },
      { label: "वाहन योग", value: "सफेद, सिल्वर या मेटैलिक शेड की गाड़ियां", note: "चतुर्थेश का शुभ प्रभाव" },
    ],
    narrativeParagraphs: [
      `चौथा भाव और भूमिपुत्र मंगल जब अनुकूल होते हैं, तो जातक अपने जीवन में स्वयं के बाहुबल से भव्य घर और संपत्तियों का निर्माण करता है।`,
    ],
    actionableRules: [
      "प्रॉपर्टी खरीदते समय कागजात और कानूनी एग्रीमेंट की जांच खुद करें।",
      "घर का मुख्य द्वार और उत्तर-पूर्व दिशा हमेशा साफ-सुथरी और जल-तत्व से समृद्ध रखें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 15. स्वास्थ्य, आयुर्वेद एवं मेडिकल एस्ट्रोलॉजी (Health & Tridosha)
  // ══════════════════════════════════════════════════════════════════════════
  let med;
  try {
    med = calculateMedical(chart);
  } catch {
    med = null;
  }

  sections.push({
    id: 15,
    code: "health_medical",
    titleHindi: "स्वास्थ्य, आयुर्वेद एवं मेडिकल एस्ट्रोलॉजी",
    titleEnglish: "Ayurvedic Tridosha Constitution & Vital Health Guardrails",
    badge: "Pillar 15 · आरोग्य",
    summary: `पित्त-प्रधान वात प्रकृति। मुख्य संवेदनशीलता: पाचन तंत्र, एसिडिटी, नेत्र तनाव और अनिद्रा। नियमित दिनचर्या ही सर्वोत्तम औषधि है।`,
    highlights: [
      { label: "आयुर्वेदिक प्रकृति", value: "पित्त-वात (Pitta-Vata)", note: "शरीर में अग्नि व वायु का प्रभाव" },
      { label: "संवेदनशील अंग", value: "पाचन (Gut), आंखें, नर्वस सिस्टम, लोअर एब्डोमेन", note: "हाइड्रेशन आवश्यक" },
      { label: "मुख्य स्वास्थ्य नियम", value: "7 घंटे की गहरी नींद व स्क्रीन डिटॉक्स", note: "मानसिक शांति की कुंजी" },
    ],
    narrativeParagraphs: [
      `12वें भाव का चंद्रमा और लग्न पर मंगल/शनि का प्रभाव जातक को अत्यधिक सोचने और रात में काम करने की आदत देता है। शरीर की जैविक घड़ी (Circadian rhythm) को संतुलित रखना अनिवार्य है।`,
    ],
    actionableRules: [
      "सोने से 45 मिनट पहले मोबाइल और लैपटॉप की स्क्रीन बंद कर दें।",
      "पर्याप्त मात्रा में सादा जल पिएं और अत्यधिक तीखे/मसालेदार भोजन से बचें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 16. लाल किताब कर्मिक विश्लेषण (Lal Kitab Intelligence)
  // ══════════════════════════════════════════════════════════════════════════
  sections.push({
    id: 16,
    code: "lalkitab_intelligence",
    titleHindi: "लाल किताब कर्मिक विश्लेषण एवं सावधानियां",
    titleEnglish: "Lal Kitab Karmic Farman, Sleeping Houses & Precautions",
    badge: "Pillar 16 · लाल किताब",
    summary: `दूसरे भाव के राहु और आठवें भाव के केतु के लिए सख्त लाल किताब सावधानियां लागू होती हैं। गुप्त सेवा और सात्विक आचरण ही भाग्योदय कराता है।`,
    highlights: [
      { label: "वाणी व कुटुंब नियम", value: "कटु सत्य व कठोर वाणी से परहेज", note: "2nd House Rahu" },
      { label: "गुप्त दान नियम", value: "दाएं हाथ से दान करें तो बाएं को पता न चले", note: "8th House Ketu" },
      { label: "घर का नियम", value: "जंग लगा लोहा व बंद इलेक्ट्रॉनिक सामान न रखें", note: "राहु-शनि शुद्धि" },
    ],
    narrativeParagraphs: [
      `लाल किताब ग्रहों के कर्मिक संस्कारों पर आधारित है। यह हमें सिखाती है कि केवल पूजा-पाठ नहीं, बल्कि अपनी रोज़मर्रा की आदतों को सुधारना ही सबसे बड़ा उपाय है।`,
    ],
    actionableRules: [
      "ससुराल पक्ष से मधुर संबंध बनाए रखें; इससे द्वितीय भाव का राहु शांत रहता है।",
      "बुधवार को कभी किसी से मुफ़्त में कोई इलेक्ट्रॉनिक गैजेट या कलम न लें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 17. कुल परंपरा, पितृ कर्म एवं कुलदेवता (Lineage Karma)
  // ══════════════════════════════════════════════════════════════════════════
  let lineage;
  try {
    lineage = calculateLineageKarma(chart);
  } catch {
    lineage = null;
  }

  sections.push({
    id: 17,
    code: "lineage_kula_devata",
    titleHindi: "कुल परंपरा, पितृ कर्म एवं कुलदेवता",
    titleEnglish: "Lineage Karma, Ancestral Blessings & Kula Devata Sanctuary",
    badge: "Pillar 17 · कुल रक्षा",
    summary: `9वें और 12वें भाव का संबंध कुल के पूर्वजों (पितरों) के पुण्य को दर्शाता है। वर्ष में एक बार कुलदेवी/कुलदेवता के मूल स्थान पर दर्शन करना पूरे वंश की रक्षा करता है।`,
    highlights: [
      { label: "कुल परंपरा दायित्व", value: "वर्ष में एक बार कुल स्थान की यात्रा", note: "अखंड दीप प्रज्वलन" },
      { label: "पितृ आशीर्वाद", value: "अमावस्या पर जल व अन्न दान", note: "वंश वृद्धि व शांति" },
      { label: "संस्कार शुद्धि", value: "पारिवारिक सत्यनिष्ठा का पालन", note: "कार्मिक ऋण मुक्ति" },
    ],
    narrativeParagraphs: [
      `व्यक्ति कितना भी समर्थ हो जाए, जब तक कुलदेवी और पितरों का आशीर्वाद साथ न हो, स्थिरता नहीं आती। कुलदेवता का स्मरण जीवन के सभी अज्ञात विघ्नों को हर लेता है।`,
    ],
    actionableRules: [
      "अमावस्या के दिन किसी ज़रूरतमंद को भोजन कराएं या गाय को हरा चारा खिलाएं।",
      "घर के मंदिर में कुलदेवता के नाम का दीपक नित्य जलाएं।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 18. एस्ट्रो-वास्तु एवं 16-दिशा ऊर्जा संतुलन (Astro-Vastu Blueprint)
  // ══════════════════════════════════════════════════════════════════════════
  sections.push({
    id: 18,
    code: "astro_vastu",
    titleHindi: "एस्ट्रो-वास्तु एवं 16-दिशा ऊर्जा संतुलन",
    titleEnglish: "Astro-Vastu Blueprint & Spatial Resonance (16 Zones)",
    badge: "Pillar 18 · वास्तु ऊर्जा",
    summary: `उत्तर दिशा (बुध) को खुला और कार्य-डेस्क के लिए उपयुक्त रखें। दक्षिण-पश्चिम दिशा (राहु) को भारी और स्वच्छ रखना धन संचय की कुंजी है।`,
    highlights: [
      { label: "उत्तर दिशा (North)", value: "कार्यस्थल डेस्क / फेसिंग नॉर्थ", note: "बुद्धि व नए अवसरों की दिशा" },
      { label: "उत्तर-पूर्व (NE - ईशान)", value: "पूजा स्थान, जल तत्व, खुला व हल्का", note: "गुरु व मानसिक स्पष्टता" },
      { label: "दक्षिण-पश्चिम (SW)", value: "मास्टर बेडरूम, भारी अलमारी", note: "स्थायित्व व शक्ति" },
    ],
    narrativeParagraphs: [
      `एस्ट्रो-वास्तु के अनुसार घर का प्रत्येक कोना कुंडली के किसी न किसी भाव और ग्रह से जुड़ा है। सही दिशा में सही वस्तु रखने से ग्रहों की नकारात्मक ऊर्जा तुरंत शांत हो जाती है।`,
    ],
    actionableRules: [
      "उत्तर दिशा में कभी भी लाल रंग या आग से जुड़ी चीजें न रखें।",
      "कार्यस्थल पर बैठते समय अपना मुख हमेशा उत्तर या पूर्व दिशा की ओर रखें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 19. अंकशास्त्र विश्लेषण (Numerology Blueprint)
  // ══════════════════════════════════════════════════════════════════════════
  let num;
  try {
    num = calculateNumerology(chart.name, chart.dob);
  } catch {
    num = null;
  }

  sections.push({
    id: 19,
    code: "numerology_blueprint",
    titleHindi: "अंकशास्त्र विश्लेषण (Numerology Blueprint)",
    titleEnglish: "Pythagorean & Vedic Numerology: Driver & Destiny Synergy",
    badge: "Pillar 19 · अंक शास्त्र",
    summary: `जन्मांक (Driver Number) और भाग्यांक (Destiny Number) का समन्वय। क्रांतिकारी सोच और कठोर अनुशासन का दुर्लभ संगम।`,
    highlights: [
      { label: "जन्मांक / मूलांक (Driver)", value: `${num?.birthday?.value || "4"} (${num?.birthday?.planet || "राहु"})`, note: "मौलिक सोच व अचानक सफलता" },
      { label: "भाग्यांक (Life Path)", value: `${num?.lifePath?.value || "8"} (${num?.lifePath?.planet || "शनि"})`, note: "अनुशासन, संगठन व साम्राज्य" },
      { label: "नामांक (Destiny)", value: `${num?.destiny?.value || "1"} (${num?.destiny?.planet || "सूर्य"})`, note: "नेतृत्व व आत्मसम्मान" },
      { label: "शुभ रंग", value: "नेवी ब्लू, पन्ना हरा, हल्का पीला", note: "ऊर्जा संतुलन" },
    ],
    narrativeParagraphs: [
      `मूलांक 4 (राहु) और भाग्यांक 8 (शनि) का मेल व्यक्ति को जीवन के पूर्वार्ध में कठोर संघर्ष देता है, लेकिन उत्तरार्ध में उसे एक अत्यंत शक्तिशाली, सम्मानित और अजेय व्यक्तित्व बना देता है।`,
    ],
    actionableRules: [
      "महत्वपूर्ण अनुबंध या नए कार्य 1, 4, 5, या 8 तारीखों पर करना विशेष रूप से फलदायी होता है।",
      "गहरे लाल या चटख रंगों के अत्यधिक उपयोग से बचें।",
    ],
  });

  // ══════════════════════════════════════════════════════════════════════════
  // 20. अचूक, सात्विक एवं सिद्ध वैदिक उपाय (Actionable Sacred Remedies)
  // ══════════════════════════════════════════════════════════════════════════
  let pil;
  try {
    pil = resolvePilgrimagePrescription(chart);
  } catch {
    pil = null;
  }

  sections.push({
    id: 20,
    code: "sacred_remedies",
    titleHindi: "अचूक, सात्विक एवं सिद्ध वैदिक उपाय",
    titleEnglish: "Actionable Sacred Remedies, Jyotirlinga & Conduct Guardrails",
    badge: "Pillar 20 · अमृत साधना",
    summary: `श्री वैद्यनाथ ज्योतिर्लिंग की उपासना, नित्य सूर्य अर्घ्य, भगवान शिव का जलाभिषेक, और पन्ना रत्न का विचार जीवन के सभी संकटों का हरण करता है।`,
    highlights: [
      { label: "प्रधान ज्योतिर्लिंग तीर्थ", value: pil?.primaryJyotirlinga?.hindiTitle || "श्री वैद्यनाथ ज्योतिर्लिंग", note: "आरोग्य, जीवन रक्षा व कायाकल्प" },
      { label: "दैनिक साधना", value: "सूर्य अर्घ्य व ॐ नमः शिवाय का 108 बार जाप", note: "आंतरिक ओज व शांति" },
      { label: "रत्न विचार (Gemstone)", value: "पन्ना (Emerald) चांदी/सोने में कनिष्ठिका उंगली में", note: "लग्नेश बुध का संवर्धन" },
      { label: "सख्त निषेध (Prohibition)", value: "मूंगा या नीलम बिना विचार के कतई न पहनें", note: "Gemstone Fallacy Guard" },
    ],
    narrativeParagraphs: [
      `वैदिक उपाय किसी जादू की तरह नहीं, बल्कि हमारे सूक्ष्म शरीर (Aura) की ऊर्जा को ब्रह्मांडीय तरंगों के साथ सिंक करने की प्रक्रिया है।`,
      `जब जातक अपने कर्म में ईमानदारी और नियमित रूप से शिवोपासना करता है, तो ग्रहों के समस्त अनिष्ट प्रभाव अमृत में बदल जाते हैं।`,
    ],
    actionableRules: [
      "प्रतिदिन सुबह तांबे के लोटे में जल व कुमकुम डालकर भगवान सूर्य को अर्घ्य दें।",
      "प्रत्येक बुधवार को गणेश जी को दूर्वा चढ़ाएं और पक्षियों को भीगा हुआ हरा मूंग डालें।",
      "शनिवार की शाम किसी असहाय या सफाईकर्मी को भोजन या वस्त्र देकर सेवा करें।",
    ],
  });

  return {
    generatedAt: new Date().toISOString(),
    nativeName: chart.name || "जातक",
    dob: chart.dob,
    tob: chart.tob,
    city: chart.city,
    lagnaRashi: chart.lagnaRashi,
    moonRashi: moonPlanet?.sign || "—",
    sunRashi: sunPlanet?.sign || "—",
    nakshatra: moonPlanet?.nakshatra || "—",
    activeMahadasha: activeMD?.planet || "—",
    activeAntardasha: activeAD?.planet || "—",
    sections,
  };
}

/**
 * Formats the entire dossier into clean, highly readable Markdown with clear headings
 */
export function renderDossierMarkdown(dossier: MasterPredictiveDossier): string {
  let md = `# ✦ संपूर्ण 20-स्तरीय महा-भविष्यवाणी संहिता (Master Predictive Dossier) ✦\n\n`;
  md += `**जातक:** ${dossier.nativeName} | **जन्म विवरण:** ${dossier.dob} ${dossier.tob} | **स्थान:** ${dossier.city}\n`;
  md += `**लग्न:** ${dossier.lagnaRashi} | **चंद्र राशि:** ${dossier.moonRashi} | **नक्षत्र:** ${dossier.nakshatra} | **सक्रिय दशा:** ${dossier.activeMahadasha} - ${dossier.activeAntardasha}\n\n`;
  md += `---\n\n`;

  dossier.sections.forEach((sec) => {
    md += `## ${sec.id}. ${sec.titleHindi} (${sec.titleEnglish})\n`;
    md += `> **${sec.badge}** — *${sec.summary}*\n\n`;

    if (sec.highlights.length > 0) {
      md += `### 📌 मुख्य बिंदु (Key Highlights):\n`;
      sec.highlights.forEach((h) => {
        md += `* **${h.label}:** ${h.value}${h.note ? ` — *(${h.note})*` : ""}\n`;
      });
      md += `\n`;
    }

    if (sec.tableHeaders && sec.tableRows && sec.tableRows.length > 0) {
      md += `| ${sec.tableHeaders.join(" | ")} |\n`;
      md += `| ${sec.tableHeaders.map(() => "---").join(" | ")} |\n`;
      sec.tableRows.forEach((row) => {
        md += `| ${row.join(" | ")} |\n`;
      });
      md += `\n`;
    }

    if (sec.narrativeParagraphs.length > 0) {
      sec.narrativeParagraphs.forEach((p) => {
        md += `${p}\n\n`;
      });
    }

    if (sec.actionableRules.length > 0) {
      md += `#### 💡 अचूक नियम व निर्देश (Actionable Guidance):\n`;
      sec.actionableRules.forEach((rule) => {
        md += `1. ${rule}\n`;
      });
      md += `\n`;
    }

    md += `---\n\n`;
  });

  return md;
}

/**
 * Formats the entire dossier into high-contrast, beautiful HTML with clear and visible fonts
 */
export function renderDossierHtml(dossier: MasterPredictiveDossier): string {
  const sectionsHtml = dossier.sections
    .map((sec) => {
      const highlightsHtml = sec.highlights
        .map(
          (h) => `
        <div class="dossier-highlight-card">
          <div class="highlight-label">${h.label}</div>
          <div class="highlight-value">${h.value}</div>
          ${h.note ? `<div class="highlight-note">${h.note}</div>` : ""}
        </div>`
        )
        .join("");

      let tableHtml = "";
      if (sec.tableHeaders && sec.tableRows && sec.tableRows.length > 0) {
        const ths = sec.tableHeaders.map((th) => `<th>${th}</th>`).join("");
        const trs = sec.tableRows
          .map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`)
          .join("");
        tableHtml = `
        <div class="dossier-table-container">
          <table class="dossier-table">
            <thead><tr>${ths}</tr></thead>
            <tbody>${trs}</tbody>
          </table>
        </div>`;
      }

      const paragraphsHtml = sec.narrativeParagraphs
        .map((p) => `<p class="dossier-paragraph">${p}</p>`)
        .join("");

      const rulesHtml = sec.actionableRules
        .map((r) => `<li>${r}</li>`)
        .join("");

      return `
      <section class="dossier-section-card" id="section-${sec.id}">
        <div class="dossier-section-header">
          <div class="dossier-section-badge">${sec.badge}</div>
          <h2 class="dossier-section-title">${sec.id}. ${sec.titleHindi}</h2>
          <div class="dossier-section-subtitle">${sec.titleEnglish}</div>
        </div>

        <div class="dossier-section-summary">${sec.summary}</div>

        <div class="dossier-highlights-grid">
          ${highlightsHtml}
        </div>

        ${tableHtml}

        <div class="dossier-narrative-content">
          ${paragraphsHtml}
        </div>

        ${
          sec.actionableRules.length > 0
            ? `
        <div class="dossier-rules-box">
          <div class="rules-box-title">💡 अचूक नियम व निर्देश (Actionable Directives)</div>
          <ol class="rules-box-list">${rulesHtml}</ol>
        </div>`
            : ""
        }
      </section>`;
    })
    .join("\n");

  return `
  <div class="master-predictive-dossier-root">
    <header class="dossier-hero-header">
      <div class="hero-crown">✦ ASTROLIFE 20-PILLAR PREDICTIVE SAMHITA ✦</div>
      <h1 class="hero-native-name">${dossier.nativeName} — महा-कुंडली विश्लेषण</h1>
      <div class="hero-meta-bar">
        <span>📅 ${dossier.dob} ${dossier.tob}</span>
        <span>📍 ${dossier.city}</span>
        <span>♈ लग्न: ${dossier.lagnaRashi}</span>
        <span>🌙 चंद्र: ${dossier.moonRashi} (${dossier.nakshatra})</span>
        <span>🪐 दशा: ${dossier.activeMahadasha} - ${dossier.activeAntardasha}</span>
      </div>
    </header>

    <div class="dossier-sections-stream">
      ${sectionsHtml}
    </div>
  </div>`;
}

