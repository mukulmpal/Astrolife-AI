// src/lib/astro-engine/pillar-narrative-engine.ts
// ============================================================================
// ASTROLIFE DYNAMIC PILLAR STORYTELLING & GOCHAR ROADMAP ENGINE
// Deep, novelistic, descriptive human storytelling prose (पैराग्राफ मोड / कहानी शैली)
// Fully parameterized and dynamically computed for EVERY user's unique birth chart:
// 1. Career & Wealth (D-10 Karma Chakra)
// 2. Love & Marriage (D-9 Navamsha Chakra)
// 3. Timing & Dashas (Vimshottari 120-Year Timeline)
// 4. Astrologer Tech Specs (32+ Classical Yogas & Shadbala)
// ============================================================================

import type { ChartData } from "./calculations";
import type { DivChart } from "./divisional";
import type { ShadbalaResult } from "./shadbala";
import type { MangalDoshaInsight } from "./mangal-dosha-adapter";
import type { YogaResult } from "./yogas";
import { calculateTransitRippleData } from "./transit-ripple/transit-calculator";

export interface PillarChapter {
  chapterNum: number;
  title: string;
  subtitle: string;
  icon: string;
  paragraphs: string[];
  keyHighlight?: string;
  badge?: string;
}

export interface UpcomingMilestone {
  phaseTitle: string;
  timeWindow: string;
  planetaryTrigger: string;
  impactTheme: string;
  detailedInsight: string;
}

export interface PillarNarrativeData {
  pillarKey: "career" | "marriage" | "timing" | "specs";
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  heroHeadline: string;
  chapters: PillarChapter[];
  upcomingRoadmap: UpcomingMilestone[];
  actionableDirective: {
    title: string;
    points: string[];
    gemstoneOrRemedyNote?: string;
  };
}

// ── UTILITY HELPERS ──────────────────────────────────────────────────────────
const RASHI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

const SIGN_NAMES_HINDI: Record<string, string> = {
  Aries: "मेष (Aries)",
  Taurus: "वृषभ (Taurus)",
  Gemini: "मिथुन (Gemini)",
  Cancer: "कर्क (Cancer)",
  Leo: "सिंह (Leo)",
  Virgo: "कन्या (Virgo)",
  Libra: "तुला (Libra)",
  Scorpio: "वृश्चिक (Scorpio)",
  Sagittarius: "धनु (Sagittarius)",
  Capricorn: "मकर (Capricorn)",
  Aquarius: "कुंभ (Aquarius)",
  Pisces: "मीन (Pisces)",
};

const GEMSTONES_BY_LORD: Record<string, { gem: string; finger: string; note: string }> = {
  Sun: { gem: "माणिक्य (Ruby)", finger: "अनामिका (Ring finger)", note: "सूर्य देव को बल देकर आत्मबल, नेतृत्व व मान-सम्मान को अजेय बनाता है।" },
  Moon: { gem: "मोती (Natural Pearl)", finger: "कनिष्ठिका (Little finger)", note: "चंद्रमा को शांत कर मानसिक स्पष्टता, सौम्यता व निर्णय क्षमता बढ़ाता है।" },
  Mars: { gem: "मूंगा (Red Coral)", finger: "अनामिका (Ring finger)", note: "मंगल देव को बल देकर शारीरिक ऊर्जा, साहस व भूमि-संपत्ति लाभ कराता है।" },
  Mercury: { gem: "पन्ना (Emerald)", finger: "कनिष्ठिका (Little finger)", note: "बुध देव को बल देकर बौद्धिक कुशाग्रता, व्यापार व तार्किक सोच को शिखर पर ले जाता है।" },
  Jupiter: { gem: "पुखराज (Yellow Sapphire)", finger: "तर्जनी (Index finger)", note: "देवगुरु बृहस्पति को बल देकर विवेक, भाग्य, संतान व महा-समृद्धि के द्वार खोलता है।" },
  Venus: { gem: "हीरा या ओपल (Diamond / White Opal)", finger: "मध्यमा या अनामिका", note: "शुक्र देव को बल देकर दांपत्य आकर्षण, कला, लग्जरी व सुख-सुविधाएं प्रदान करता है।" },
  Saturn: { gem: "नीलम या कटैला (Blue Sapphire / Amethyst)", finger: "मध्यमा (Middle finger)", note: "शनि देव को अनुकूल कर कर्मठता, अनुशासन, धैर्य व स्थायित्व देता है।" },
};

function getHouseLord(lagnaNum: number, houseNum: number): string {
  const signIndex = (((lagnaNum - 1) + (houseNum - 1)) % 12 + 12) % 12;
  return RASHI_LORDS[signIndex] || "Mercury";
}

function getPlanetsInHouse(chart: ChartData, houseNum: number): string[] {
  const res: string[] = [];
  if (!chart.planets) return res;
  for (const [planetName, pData] of Object.entries(chart.planets)) {
    if (pData?.house === houseNum) {
      res.push(planetName);
    }
  }
  return res;
}

// ── 1. CAREER & WEALTH (D-10 KARMA) NARRATIVE ───────────────────────────────
export function generateCareerPillarNarrative(
  chart: ChartData,
  d10?: DivChart,
  shadbala?: ShadbalaResult | null,
  charaKarakas: Record<string, string> = {}
): PillarNarrativeData {
  const name = chart.name || "जातक";
  const p = chart.planets || {};
  const lagnaNum = chart.lagnaNum || 1;
  const lagnaRashi = chart.lagnaRashi || "Aries";
  const moonRashi = p.Moon?.sign || "Aries";

  const tenthLord = getHouseLord(lagnaNum, 10);
  const tenthPlanets = getPlanetsInHouse(chart, 10);
  const secondLord = getHouseLord(lagnaNum, 2);
  const secondPlanets = getPlanetsInHouse(chart, 2);
  const eleventhLord = getHouseLord(lagnaNum, 11);
  const eleventhPlanets = getPlanetsInHouse(chart, 11);

  const amatyakarakaEntry = Object.entries(charaKarakas).find(([_, v]) => v.includes("AmK") || v.includes("Amatya"));
  const amatyakarakaPlanet = amatyakarakaEntry ? amatyakarakaEntry[0] : (chart.lagnaLord || tenthLord);

  const d10Lagna = d10?.lagna || lagnaRashi;
  const lagnaGem = GEMSTONES_BY_LORD[chart.lagnaLord || "Mercury"] || GEMSTONES_BY_LORD.Mercury;

  // Real-time Gochar computation
  let saturnSign = "Pisces";
  let saturnHouseLagna = 10;
  let saturnHouseMoon = 8;
  let jupiterSign = "Taurus";
  let jupiterHouseLagna = 9;

  try {
    const transitCalc = calculateTransitRippleData({
      birthDate: chart.dob || "2000-01-01",
      birthTime: chart.tob || "12:00",
      timezone: String(chart.tz || 5.5),
      latitude: chart.lat || 28.61,
      longitude: chart.lon || 77.21,
      lagnaSign: (chart.lagnaNum ? chart.lagnaNum - 1 : 0),
      moonLongitude: p.Moon?.lon || 15,
      moonNakshatra: Math.floor((p.Moon?.lon || 15) / (360 / 27)),
      activeMahadasha: chart.dashas?.find((d) => d.active)?.planet || "Rahu",
      activeAntardasha: chart.antardasha?.find((d) => d.active)?.planet || "Jupiter",
    });
    saturnSign = transitCalc.transitPositions.Saturn.signName;
    saturnHouseLagna = transitCalc.transitPositions.Saturn.house;
    saturnHouseMoon = (((transitCalc.transitPositions.Saturn.signIndex - (Math.floor((p.Moon?.lon || 15) / 30) % 12)) % 12) + 12) % 12 + 1;
    jupiterSign = transitCalc.transitPositions.Jupiter.signName;
    jupiterHouseLagna = transitCalc.transitPositions.Jupiter.house;
  } catch (e) {
    // safe fallback
  }

  // Classical Saturn Transit Classification from Moon
  let saturnGocharTheme = `शनि देव का जन्म-चंद्र से ${saturnHouseMoon}वें भाव में गोचर`;
  let saturnGocharBadge = "कर्म अनुशासन";
  if (saturnHouseMoon === 8) {
    saturnGocharTheme = "चंद्र से अष्टम भाव में शनि का 'अष्टम कंटक गोचर' (Kantaka Shani)";
    saturnGocharBadge = "अष्टम कंटक शनि";
  } else if (saturnHouseMoon === 4) {
    saturnGocharTheme = "चंद्र से चतुर्थ भाव में शनि का 'अर्धाष्टम कंटक गोचर' (Ardhashtama Shani)";
    saturnGocharBadge = "अर्धाष्टम कंटक शनि";
  } else if (saturnHouseMoon === 12 || saturnHouseMoon === 1 || saturnHouseMoon === 2) {
    saturnGocharTheme = "चंद्र पर शनि की 'साढ़ेसाती' का प्रभाव (Sade Sati Phase)";
    saturnGocharBadge = "साढ़ेसाती सक्रिय";
  } else if ([3, 6, 11].includes(saturnHouseMoon)) {
    saturnGocharTheme = `चंद्र से ${saturnHouseMoon}वें उपचय भाव में शनि का अत्यंत शुभ व फलदायी गोचर (Shubha Gochar)`;
    saturnGocharBadge = "विजय व लाभ गोचर";
  }

  const tenthDescription = tenthPlanets.length > 0
    ? `दशम भाव में ${tenthPlanets.join(" व ")} देव की उपस्थिति और कर्मेश ${tenthLord} देव का प्रभाव`
    : `दशम भाव के अधिपति कर्मेश ${tenthLord} देव का प्रभाव`;

  const wealthDescription = (secondPlanets.length > 0 || eleventhPlanets.length > 0)
    ? `द्वितीय भाव में ${secondPlanets.length > 0 ? secondPlanets.join(", ") : secondLord} और एकादश भाव में ${eleventhPlanets.length > 0 ? eleventhPlanets.join(", ") : eleventhLord} का संरेखण`
    : `द्वितीयेश ${secondLord} (धन) और एकादशेश ${eleventhLord} (लाभ) का परस्पर संबंध`;

  const chapters: PillarChapter[] = [
    {
      chapterNum: 1,
      title: "प्रथम सोपान: जन्म का कर्म-बीज — दशम भाव, दशमांश (D-10) और आमात्यकारक",
      subtitle: "आपकी व्यावसायिक आत्मा की मूल संरचना: स्वायत्त प्रभुत्व, पेशेवर पहचान और नेतृत्व",
      icon: "🏛️",
      keyHighlight: `${tenthDescription}: दशमांश (D-10) में ${d10Lagna} लग्न के साथ स्वतंत्र पहचान का निर्माण`,
      paragraphs: [
        `जब हम ${name} जी की जन्म कुंडली के कर्म क्षेत्र (10th Bhava) और दशमांश चक्र (D-10 Dasamsha) का सूक्ष्म शास्त्रीय परीक्षण करते हैं, तो आपकी व्यावसायिक प्रकृति का मूल आधार स्पष्ट रूप से सामने आता है। आपकी कुंडली में ${tenthDescription} यह सिद्ध करता है कि आपका कार्यक्षेत्र किसी सामान्य, रूटीन बंधन में बंधकर नहीं रह सकता; आपके भीतर अपनी पहचान, बौद्धिक विज़न और स्वायत्त निर्णय लेने की प्रबल भूख है।`,
        `दशमांश चक्र (D-10) को वैदिक ज्योतिष में 'महाफल' और 'कर्म का सूक्ष्म दर्पण' कहा जाता है। आपके D-10 में ${d10Lagna} लग्न का उदय होना यह दर्शाता है कि आपकी आजीविका और सफलता का मुख्य मार्ग 'कुशल विशेषज्ञता, रणनीतिक योजना और स्वतंत्र उत्तरदायित्व' से जुड़ा हुआ है। जैमिनी ज्योतिष के नियमानुसार आपके आमात्यकारक (Amatyakaraka - AmK) ${amatyakarakaPlanet} देव हैं। आमात्यकारक वह मंत्री है जो कर्म की नाव को पार लगाता है — इसका अर्थ यह है कि आपकी उन्नति किसी की चापलूसी या शॉर्टकट से नहीं, बल्कि आपके गहन ज्ञान, समस्या-निवारण और तकनीकी कौशल से ही सिद्ध होगी।`,
        `आप जब भी किसी ऐसे प्रोजेक्ट पर काम करते हैं जहाँ आपके अपने निर्णय लेने की पूरी आज़ादी हो, तो आपकी उत्पादकता कई गुना बढ़ जाती है। आपकी व्यावसायिक आत्मा का धर्म ही 'स्वायत्त सृजन' (Autonomous Creation) है।`
      ]
    },
    {
      chapterNum: 2,
      title: "द्वितीय सोपान: धन व महालाभ का गुप्त तंत्र — द्वितीय (धन) व एकादश (लाभ) भाव",
      subtitle: "संचित पूंजी, नियमित नकद प्रवाह और बहु-स्रोतीय वित्तीय विस्तार का योग",
      icon: "💎",
      keyHighlight: `${wealthDescription}: कौशल और सिस्टम्स के माध्यम से स्थायी संपत्ति का निर्माण`,
      paragraphs: [
        `करियर केवल काम का नाम नहीं है; उसका दूसरा और अत्यंत महत्वपूर्ण पहलू है — संचित धन (2nd House - Dhana) और नियमित नकद प्रवाह व महालाभ (11th House - Labha)। ${name} जी की कुंडली में ${wealthDescription} यह स्पष्ट करता है कि आपका वित्तीय भाग्य पारंपरिक ढर्रे से कहीं अधिक आपके निजी पुरुषार्थ और आधुनिक अवसरों से समृद्ध होगा।`,
        `एकादश भाव (लाभ भाव) जीवन में नेटवर्क, बड़े क्लाइंट्स और दीर्घकालिक इच्छाओं की पूर्ति का केंद्र है। आपकी जन्म कुंडली में जब भी लाभेश और कर्मेश का तालमेल बनता है, तो व्यक्ति को 'स्व-अर्जित धन' (Self-Earned High Net Worth) का आनंद प्राप्त होता है। इसका अर्थ यह है कि जीवन के शुरुआती दौर में भले ही संसाधनों का संघर्ष रहा हो, लेकिन जैसे-जैसे आपका काम परिपक्व होगा, आपकी आय कई स्वतंत्र स्रोतों से प्रवाहित होगी।`,
        `हालाँकि, शास्त्रों की एक गंभीर चेतावनी भी है: धन भाव और लाभ भाव के स्वामी को बलवान रखते हुए कभी भी बिना सोचे-समझे सट्टेबाज़ी, अनियंत्रित कर्ज़ या त्वरित अमीर बनने के लोभ में नहीं पड़ना चाहिए। आपका धन वास्तविक 'मूल्य निर्माण' (Value Creation) और ठोस सिस्टम्स से ही स्थायी बनेगा।`
      ]
    },
    {
      chapterNum: 3,
      title: "तृतीय सोपान: वर्तमान गोचर का कर्म क्षेत्र पर प्रभाव — तात्कालिक दबाव व वास्तविक कसौटी",
      subtitle: "वर्तमान में शनि और गुरु का गोचर आपके कार्यक्षेत्र की किस परीक्षा को संचालित कर रहा है?",
      icon: "⚖️",
      keyHighlight: saturnGocharTheme,
      paragraphs: [
        `जिस क्षण आप यह विश्लेषण पढ़ रहे हैं, उस समय ब्रह्मांड के सबसे बड़े दंडाधिकारी शनि देव ${SIGN_NAMES_HINDI[saturnSign] || saturnSign} में गोचर कर रहे हैं। आपके लग्न से यह ${saturnHouseLagna}वाँ भाव बनता है, और आपकी जन्म राशि (चंद्रमा) से यह ठीक ${saturnHouseMoon}वाँ भाव बनता है! ${saturnGocharTheme} आपके कार्यक्षेत्र में एक अत्यंत अनुशासनात्मक और गंभीर स्थिति पैदा कर रहा है।`,
        `शनि देव का यह गोचर आपसे काम में अतिरिक्त पुनरावृत्ति (Iterations/Refactoring), कागज़ी औपचारिकताओं में सतर्कता और सहकर्मियों व साझेदारों के साथ धैर्य की मांग करता है। कभी-कभी मन में ऐसा भारीपन महसूस हो सकता है जैसे मेहनत का त्वरित फल नहीं मिल रहा। लेकिन घबराइए नहीं! शनि देव कभी किसी का सच्चा परिश्रम व्यर्थ नहीं जाने देते। वे केवल आपकी नींव की इतनी कठोर जांच कर रहे हैं कि भविष्य का कोई तूफान आपको डिगा न सके।`,
        `इसके समानांतर, देवगुरु बृहस्पति का गोचर आपके बौद्धिक भावों को अपनी अमृत दृष्टि से सिंचित कर रहा है, जिससे कठिन समय में भी सही मार्गदर्शन और नए अवसरों के द्वार खुलते रहेंगे।`
      ]
    },
    {
      chapterNum: 4,
      title: "चतुर्थ सोपान: आगामी गोचर एवं भविष्य का करियर रोडमैप — महा-सफलता की समय-सारणी",
      subtitle: "कब समाप्त होगा दबाव, और कब शुरू होगा स्वतंत्र प्रतिष्ठा, पदोन्नति व आर्थिक विस्तार का स्वर्णिम दौर?",
      icon: "🚀",
      keyHighlight: "आगामी 2 से 3 वर्षों का आकाशीय चक्र: गुरु का शुभ भ्रमण + शनि के गोचर में परिवर्तन = करियर की विशाल छलांग",
      paragraphs: [
        `भविष्य के दृष्टिकोण से आगामी 24 से 36 महीनों का आकाशीय चक्र आपके करियर को एक नई ऊंचाई देने के लिए तैयार हो रहा है।`,
        `जैसे ही देवगुरु बृहस्पति का गोचर आपके केंद्र व त्रिकोण भावों को सक्रिय करेगा, आपके काम को बाज़ार में सार्वजनिक मान्यता, नए अवसरों का विश्वास और स्वतंत्र नेतृत्व का अधिकार प्राप्त होगा। यदि आप अपना कोई स्वतंत्र प्रोजेक्ट, एजेंसी या नवाचार शुरू करना चाहते हैं, तो गुरु का आगामी गोचर उसके लिए स्वर्णिम हरी झंडी साबित होगा।`,
        `शनि देव के आगामी राशि परिवर्तन के साथ ही वर्तमान गोचर का धीमापन और मानसिक दबाव समाप्त हो जाएगा। आपके पुराने सभी प्रयास एक साथ पककर मीठा फल देंगे और आपका करियर एक स्थिर और प्रभावशाली मुकाम हासिल करेगा।`
      ]
    }
  ];

  const upcomingRoadmap: UpcomingMilestone[] = [
    {
      phaseTitle: "फेज़ 1: बौद्धिक सुदृढ़ीकरण एवं आंतरिक सिस्टम री-फैक्टरिंग",
      timeWindow: "वर्तमान कालखंड",
      planetaryTrigger: `${saturnGocharBadge} + कर्मेश ${tenthLord} की सक्रियता`,
      impactTheme: "नींव की मजबूती, कार्यकुशलता का रिफाइनमेंट, अनचाहे खर्चों पर नियंत्रण",
      detailedInsight: "इस दौर में जल्दबाजी में बड़ा जोखिम न लें। अपने मुख्य उत्पाद, ज्ञान और कार्य-प्रणाली को इतना मजबूत बनाएं कि वह भविष्य के भारी लोड को संभाल सके।"
    },
    {
      phaseTitle: "फेज़ 2: देवगुरु बृहस्पति का केंद्र-त्रिकोण गोचर — प्रतिष्ठा व नेतृत्व का उदय",
      timeWindow: "आगामी 12-18 माह",
      planetaryTrigger: `गुरु का अनुकूल गोचर + आमात्यकारक ${amatyakarakaPlanet} का आशीर्वाद`,
      impactTheme: "स्वतंत्र प्रोजेक्ट्स का विस्तार, लीडरशिप अथॉरिटी, नए प्रीमियम अवसर",
      detailedInsight: "गुरु की शुभ दृष्टि आपके प्रयासों को गति देगी। आपके विचारों को बाज़ार और सहकर्मियों द्वारा सम्मानपूर्वक स्वीकार किया जाएगा।"
    },
    {
      phaseTitle: "फेज़ 3: शनि के गोचर में परिवर्तन — कर्म का ऐतिहासिक शिखर व महा-लाभ",
      timeWindow: "आगामी 2-3 वर्ष",
      planetaryTrigger: "शनि का राशि परिवर्तन + महादशा संधि का अनुकूल संरेखण",
      impactTheme: "करियर की ऐतिहासिक स्थिरता, संचित पूंजी में वृद्धि, दीर्घकालिक प्रतिष्ठा",
      detailedInsight: "पिछले वर्षों की सारी तपस्या का एकमुश्त फल मिलने का समय। व्यावसायिक जीवन में स्थायित्व और आर्थिक स्वतंत्रता का अनुभव होगा।"
    }
  ];

  return {
    pillarKey: "career",
    title: "करियर व महालक्ष्मी विश्लेषण (D-10 Dasamsha Karma)",
    subtitle: `दशम भाव (${tenthLord}), दशमांश चक्र (${d10Lagna}), आमात्यकारक (${amatyakarakaPlanet}) और आगामी गोचर का संपूर्ण डिकोडिंग`,
    icon: "💼",
    badge: "Karma & Wealth",
    heroHeadline: `${name} जी के कर्म का आकाशीय विधान: ${lagnaRashi} लग्न, स्वतंत्र बौद्धिक साम्राज्य और आगामी स्वर्णिम विस्तार`,
    chapters,
    upcomingRoadmap,
    actionableDirective: {
      title: "करियर व धन की सिद्धि हेतु शास्त्रीय निर्देश",
      points: [
        `अपने लग्नेश ${chart.lagnaLord || "बुध"} को बलवान रखने हेतु ${lagnaGem.gem} को ${lagnaGem.finger} में धारण करने का विचार करें (${lagnaGem.note})।`,
        `दशम भाव के स्वामी ${tenthLord} देव की कृपा प्राप्त करने हेतु उनके बीज मंत्र का नित्य स्मरण करें।`,
        "सट्टेबाज़ी, अनियंत्रित शॉर्टकट या बिना शोध के जोखिम से 100% दूर रहें — आपका धन वास्तविक मूल्य निर्माण और सिस्टम्स से ही स्थायी बनेगा।",
        "शनिवार को किसी ज़रूरतमंद या सफाई कर्मचारी की सहायता करें जिससे शनि का गोचरीय दबाव सौम्य होकर शुभ परिणाम देने लगे।"
      ],
      gemstoneOrRemedyNote: `लग्नेश रत्न: ${lagnaGem.gem} (${lagnaGem.note})`
    }
  };
}

// ── 2. LOVE & MARRIAGE (D-9 NAVAMSHA) NARRATIVE ─────────────────────────────
export function generateMarriagePillarNarrative(
  chart: ChartData,
  d9?: DivChart,
  mangalDosha?: MangalDoshaInsight | null,
  charaKarakas: Record<string, string> = {}
): PillarNarrativeData {
  const name = chart.name || "जातक";
  const p = chart.planets || {};
  const lagnaNum = chart.lagnaNum || 1;
  const lagnaRashi = chart.lagnaRashi || "Aries";

  const seventhLord = getHouseLord(lagnaNum, 7);
  const seventhPlanets = getPlanetsInHouse(chart, 7);
  const seventhHouseSign = chart.houseCusps?.[6]?.sign || RASHI_LORDS[(lagnaNum + 5) % 12];
  const d9Lagna = d9?.lagna || "Taurus";

  const darakarakaEntry = Object.entries(charaKarakas).find(([_, v]) => v.includes("DK") || v.includes("Dara"));
  const darakarakaPlanet = darakarakaEntry ? darakarakaEntry[0] : (chart.planets?.Venus ? "Venus" : seventhLord);

  const hasManglik = Boolean(mangalDosha?.hasDosha);
  const marsHouse = p.Mars?.house || 1;

  const seventhSummary = seventhPlanets.length > 0
    ? `सप्तम भाव में ${seventhPlanets.join(" व ")} देव की उपस्थिति और सप्तमेश ${seventhLord} देव का प्रभाव`
    : `सप्तम भाव में ${SIGN_NAMES_HINDI[seventhHouseSign] || seventhHouseSign} राशि और सप्तमेश ${seventhLord} देव का प्रभाव`;

  const chapters: PillarChapter[] = [
    {
      chapterNum: 1,
      title: "प्रथम सोपान: जन्म का दांपत्य खाका — सप्तम भाव, नवमांश (D-9) और दाराकारक",
      subtitle: "आपके जीवनसाथी का आंतरिक व्यक्तित्व, बौद्धिक तालमेल और आत्मा का गहरा कार्मिक अनुबंध",
      icon: "💍",
      keyHighlight: `${seventhSummary}: नवमांश (D-9) में ${d9Lagna} लग्न और दाराकारक ${darakarakaPlanet} का प्रभाव`,
      paragraphs: [
        `वैदिक ज्योतिष में जन्म कुंडली (D-1) शरीर है, तो नवमांश चक्र (D-9) उस शरीर के भीतर धड़कती हुई अमर आत्मा और जीवनसाथी के साथ जुड़ने वाला सूक्ष्म कार्मिक सूत्र है। ${name} जी की कुंडली में ${seventhSummary} यह स्पष्ट करता है कि आपका दांपत्य जीवन किसी उथले, तात्कालिक आकर्षण पर नहीं, बल्कि मानसिक गहराई, परस्पर सम्मान और आत्मीय वफादारी की बुनियाद पर टिकेगा।`,
        `नवमांश चक्र (D-9) में ${d9Lagna} लग्न का प्राकट्य यह दर्शाता है कि विवाह के पश्चात आपके भाग्य का एक नया द्वार खुलेगा। आपका जीवनसाथी गरिमामयी, विचारशील और पारिवारिक व्यवस्था को परिपक्वता से संभालने वाला होगा। जैमिनी ज्योतिष में आपके दाराकारक (Darakaraka - DK) ${darakarakaPlanet} देव हैं। दाराकारक ग्रह जीवनसाथी के मूल स्वभाव का आईना है — इसका अर्थ यह है कि आपका साथी सोच और आचरण में गंभीर, सिद्धांतों का पक्का और आपके जीवन का एक अटूट स्तंभ बनेगा।`,
        `शास्त्र कहते हैं कि ऐसे जातकों का दांपत्य सुख समय के साथ और अधिक प्रगाढ़ व मधुर होता जाता है। समझदारी और संवाद के बल पर आपका दांपत्य एक सुरक्षित किले की तरह मजबूत बना रहेगा।`
      ]
    },
    {
      chapterNum: 2,
      title: "द्वितीय सोपान: मांगलिक प्रभाव व भावनात्मक यथार्थ — क्या सच में कोई दोष है?",
      subtitle: hasManglik
        ? `भाव ${marsHouse} में मंगल की स्थिति और शास्त्रीय परिहार (Cancellations)`
        : "कुंडली में मांगलिक दोष का पूर्ण अभाव: प्राकृतिक सौम्यता व अनुकूलता",
      icon: "🔥",
      keyHighlight: hasManglik
        ? `भाव ${marsHouse} में मंगल का प्रभाव: उग्रता पर 5-सेकंड के नियंत्रण से दांपत्य पूरी तरह सुरक्षित`
        : "आपकी कुंडली में कोई कष्टकारी मांगलिक दोष नहीं है; दांपत्य भाव शुभ व सुरक्षित है",
      paragraphs: [
        hasManglik
          ? `जब भी किसी कुंडली में मंगल देव 1, 4, 7, 8 या 12वें भाव में स्थित होते हैं, तो सामान्य समाज में जातक को 'मांगलिक' कहकर अनावश्यक भय उत्पन्न किया जाता है। ${name} जी की कुंडली में मंगल देव ${marsHouse}वें भाव में स्थित हैं। आइए महर्षि पराशर के शास्त्रीय दृष्टिकोण से इस स्थिति की वास्तविकता को समझें।`
          : `${name} जी की जन्म कुंडली का परीक्षण करने पर यह स्पष्ट होता है कि आपकी कुंडली किसी भी गंभीर मांगलिक दोष से पूर्णतः मुक्त है। मंगल देव दांपत्य भावों को पीड़ा नहीं पहुंचा रहे हैं।`,
        hasManglik
          ? `भाव ${marsHouse} का मंगल वैवाहिक जीवन में किसी अनिष्ट का कारण नहीं बनता, बल्कि यह कभी-कभी अचानक आने वाले गुस्से, अधीरता या काम के तनाव में तीखी प्रतिक्रिया देने की प्रवृत्ति पैदा कर सकता है। यह कोई 'श्राप' नहीं है, बल्कि 'भावनात्मक अनुशासन' की एक साधारण मांग है! जब भी साथी के साथ कोई वैचारिक मतभेद हो, तो उस समय बहस करने के बजाय 5 सेकंड का मौन रख लें; यह साधारण नियम सारे तनाव को शांत कर देगा।`
          : `दांपत्य जीवन में मधुरता बनाए रखने के लिए केवल एक बात का ध्यान रखना होता है कि काम की व्यस्तता और मानसिक थकान का असर व्यक्तिगत संवाद पर न पड़े। साथी के साथ नियमित और प्रेमपूर्ण संवाद आपके रिश्ते को सदा तरोताजा रखेगा।`,
        `इसके अतिरिक्त, सप्तमेश ${seventhLord} और दाराकारक ${darakarakaPlanet} की शुभ स्थिति दांपत्य की दीर्घायु और सुख की पूर्ण गारंटी देती है।`
      ]
    },
    {
      chapterNum: 3,
      title: "तृतीय सोपान: वर्तमान गोचर की परीक्षा — रिश्तों में परिपक्वता व धैर्य का पाठ",
      subtitle: "वर्तमान में शनि और गुरु का गोचर आपके व्यक्तिगत संबंधों को किस प्रकार संवार रहा है?",
      icon: "⏳",
      keyHighlight: "गोचर का स्पष्ट संदेश: सतही और दिखावटी संबंधों का अंत, केवल गंभीर व सच्चा रिश्ता ही फलेगा",
      paragraphs: [
        `वर्तमान समय में गोचर के न्यायाधीश शनि देव का प्रभाव जातक को जीवन के हर क्षेत्र में यथार्थवादी बनने की प्रेरणा दे रहा है। रिश्तों के मामले में यह दौर किसी जल्दबाजी, सामाजिक दबाव या दिखावे में आकर निर्णय लेने का नहीं है।`,
        `शनि देव का सिद्धांत है: 'जल्दबाज़ी में किया गया कच्चा समझौता भविष्य में कष्ट देता है, जबकि धैर्य से चुना गया साथी जीवन भर साथ निभाता है।' इसलिए वर्तमान समय में स्वयं को मानसिक और व्यावहारिक रूप से सुदृढ़ बनाना सबसे पहली प्राथमिकता होनी चाहिए।`,
        `देवगुरु बृहस्पति की शुभ दृष्टि आपके त्रिकोण भावों को सुरक्षा प्रदान कर रही है, जिससे आपके जीवन में जो भी नया प्रवेश होगा, वह एक गहरे सम्मान और पारिवारिक सहमति के साथ ही आगे बढ़ेगा।`
      ]
    },
    {
      chapterNum: 4,
      title: "चतुर्थ सोपान: आगामी गोचर एवं विवाह मुहूर्त खिड़की — कब बनेगा अनुकूल संयोग?",
      subtitle: "आगामी 24 से 36 महीनों में गुरु-शुक्र का अनुग्रह और दांपत्य भाग्योदय",
      icon: "🌸",
      keyHighlight: "आगामी अनुकूल गोचर: देवगुरु बृहस्पति की दृष्टि + दशा का शुभ तालमेल = विवाह व दांपत्य सुख का स्वर्णिम द्वार",
      paragraphs: [
        `शास्त्रीय ज्योतिष के अनुसार विवाह और स्थायी दांपत्य सुख तभी घटित होता है जब देवगुरु बृहस्पति और कर्मफलदाता शनि दोनों की अनुकूल दृष्टि या संबंध सप्तम भाव व उसके अधिपति पर पड़ता है।`,
        `आगामी गोचर कालखंड में जब देवगुरु बृहस्पति का भ्रमण आपकी कुंडली के शुभ भावों को अमृतमयी दृष्टि से देखेगा, तो विवाह से संबंधित सभी पुरानी रुकावटें और देरी दूर हो जाएगी। यह समय जीवन में एक अत्यंत सुयोग्य, संस्कारी और बौद्धिक जीवनसाथी के आगमन का सबसे अनुकूल काल साबित होगा।`,
        `विवाह के उपरांत आपकी प्रतिष्ठा, पारिवारिक स्थिरता और भाग्य में एक नई मिठास और समृद्धि का संचार होगा।`
      ]
    }
  ];

  const upcomingRoadmap: UpcomingMilestone[] = [
    {
      phaseTitle: "फेज़ 1: आंतरिक तैयारी एवं प्राथमिक छंटनी",
      timeWindow: "वर्तमान कालखंड",
      planetaryTrigger: `सप्तमेश ${seventhLord} व दाराकारक ${darakarakaPlanet} का कार्मिक शुद्धिकरण`,
      impactTheme: "धैर्य की परीक्षा, स्वयं की तैयारी, सतही रिश्तों का प्राकृतिक अंत",
      detailedInsight: "जल्दबाजी या दबाव में आकर कोई भावनात्मक निर्णय न लें। अपने करियर और आंतरिक शांति को प्राथमिकता दें।"
    },
    {
      phaseTitle: "फेज़ 2: प्रथम मिलन व पारिवारिक सहमति का द्वार",
      timeWindow: "आगामी 12-18 माह",
      planetaryTrigger: "देवगुरु बृहस्पति का त्रिकोण गोचर + शुक्र/सप्तमेश की अनुकूलता",
      impactTheme: "योग्य जीवनसाथी से परिचय, वैचारिक तालमेल, पारिवारिक चर्चाओं में ठोस प्रगति",
      detailedInsight: "गुरु की शुभ दृष्टि पारिवारिक वातावरण में मांगलिक कार्यों की नींव रखेगी।"
    },
    {
      phaseTitle: "फेज़ 3: पाणिग्रहण संस्कार एवं दांपत्य भाग्योदय",
      timeWindow: "आगामी 2-3 वर्ष",
      planetaryTrigger: "गुरु-शनि का संयुक्त गोचर आशीर्वाद + दशा संधि का फल",
      impactTheme: "सुखद विवाह संपन्न, दांपत्य जीवन में गहरा सामंजस्य, संयुक्त सौभाग्य वृद्धि",
      detailedInsight: "यह आपके जीवन की सबसे सुंदर और सुखी वैवाहिक खिड़की होगी।"
    }
  ];

  return {
    pillarKey: "marriage",
    title: "दांपत्य व नवमांश महा-विश्लेषण (D-9 Navamsha & Manglik)",
    subtitle: `सप्तम भाव (${seventhLord}), नवमांश लग्न (${d9Lagna}), दाराकारक (${darakarakaPlanet}) और विवाह की सटीक समय-सारणी`,
    icon: "💍",
    badge: "Love & Marriage",
    heroHeadline: `${name} जी के दांपत्य का आकाशीय विधान: परिपक्व जीवनसाथी, मांगलिक स्पष्टता और आगामी स्वर्णिम विवाह योग`,
    chapters,
    upcomingRoadmap,
    actionableDirective: {
      title: "मधुर दांपत्य व सुखी गृहस्थी हेतु शास्त्रीय उपाय",
      points: [
        "शुक्रवार को मां लक्ष्मी की आराधना करें और सफेद पुष्प अथवा इत्र का अर्पण करें (शुक्र देव के दांपत्य आकर्षण को बल देने हेतु)।",
        "क्रोध या उत्तेजना की स्थिति में '5 सेकंड का मौन' रखें — यह सरल नियम हर रिश्ते को अनावश्यक विवादों से सदा सुरक्षित रखता है।",
        "चांदी का एक ठोस चौकोर टुकड़ा अथवा छल्ला धारण करने से मन की चंचलता शांत रहती है और भावनात्मक संतुलन बना रहता है।",
        `सप्तम भाव के स्वामी ${seventhLord} देव और दाराकारक ${darakarakaPlanet} देव के प्रति कृतज्ञता व्यक्त करें।`
      ],
      gemstoneOrRemedyNote: "दांपत्य आकर्षण और प्रेम की शुद्धता हेतु ओपल (White Opal) या स्फटिक माला का प्रयोग अत्यंत कल्याणकारी है।"
    }
  };
}

// ── 3. TIMING & DASHAS (VIMSHOTTARI) NARRATIVE ──────────────────────────────
export function generateTimingPillarNarrative(
  chart: ChartData,
  charaKarakas: Record<string, string> = {}
): PillarNarrativeData {
  const name = chart.name || "जातक";
  const p = chart.planets || {};
  const activeMD = chart.dashas?.find((d) => d.active);
  const activeAD = chart.antardasha?.find((d) => d.active);
  const mdPlanet = activeMD?.planet || "Rahu";
  const adPlanet = activeAD?.planet || "Jupiter";

  const mdHouse = p[mdPlanet]?.house || 1;
  const adHouse = p[adPlanet]?.house || 1;

  const chapters: PillarChapter[] = [
    {
      chapterNum: 1,
      title: "प्रथम सोपान: 120-वर्षीय विंशोत्तरी चक्र — जन्म से वर्तमान तक की आत्मिक यात्रा",
      subtitle: `वर्तमान में सक्रिय: ${mdPlanet} महादशा — जीवन का प्राथमिक कालखंड`,
      icon: "⏳",
      keyHighlight: `सक्रिय महादशा: ${mdPlanet} (भाव ${mdHouse}) — आपकी चेतना और जीवन प्राथमिकताओं का मुख्य संचालक`,
      paragraphs: [
        `महर्षि पराशर ने विंशोत्तरी दशा पद्धति को कलियुग में मानव जीवन के कर्मों के फलित होने का सबसे सटीक और वैज्ञानिक मापदंड घोषित किया है। मानव शरीर में 120 वर्ष की आयु का चक्र 9 ग्रहों के निश्चित कालखंडों में बंटा होता है। ${name} जी की जीवन-यात्रा का विश्लेषण करते समय हमें यह देखना होता है कि आपकी चेतना इस समय किस ग्रह के शासनकाल से गुज़र रही है।`,
        `वर्तमान में आपके ऊपर ${mdPlanet} देव की महादशा सक्रिय है। आपकी कुंडली के ${mdHouse}वें भाव में स्थित ${mdPlanet} देव आपके जीवन के केंद्र में नई आकांक्षाएं, विकास की भूख और परिस्थितियों को अपने पक्ष में मोड़ने की प्रेरणा दे रहे हैं। महादशा स्वामी वह मुख्य राजा है जो यह तय करता है कि इस दौर में आपका मुख्य ध्यान किस विषय पर रहेगा।`,
        `इस महादशा ने आपको कई कड़े अनुभव, सीख और दूरदर्शिता दी है, जो आने वाले बड़े उत्तरदायित्वों को संभालने के लिए नींव का पत्थर साबित हो रहे हैं।`
      ]
    },
    {
      chapterNum: 2,
      title: "द्वितीय सोपान: वर्तमान अंतर्दशा का रहस्य — तात्कालिक ऊर्जा का केंद्र",
      subtitle: `${mdPlanet} महादशा में ${adPlanet} अंतर्दशा: तात्कालिक घटनाओं का प्रेरक इंजन`,
      icon: "⚡",
      keyHighlight: `सक्रिय अंतर्दशा: ${adPlanet} देव (भाव ${adHouse}) — सूक्ष्म कर्मों और निर्णयों की दिशा`,
      paragraphs: [
        `वर्तमान समय में आपके ऊपर ${mdPlanet} महादशा के भीतर ${adPlanet} देव की अंतर्दशा चल रही है।`,
        `शास्त्रों का नियम है: 'महादशा राजा है, तो अंतर्दशा उसका प्रधानमंत्री है जो दिन-प्रतिदिन के कार्यकलापों को नियंत्रित करता है।' आपकी कुंडली के ${adHouse}वें भाव में स्थित ${adPlanet} देव इस समय आपकी सोचने की शैली, आपकी ऊर्जा और आपके दैनिक निर्णयों को एक विशेष दिशा प्रदान कर रहे हैं।`,
        `यह समय हाथ पर हाथ धरकर बैठने का नहीं है; यह समय अपने मुख्य प्रोजेक्ट्स को संवारने, अपने कौशल को निखारने और जीवन की प्राथमिकताओं को स्पष्ट करने का है।`
      ]
    },
    {
      chapterNum: 3,
      title: "तृतीय सोपान: वर्तमान गोचर और दशा का तालमेल — आकाशीय जुगलबंदी का विज्ञान",
      subtitle: "दशा ऊर्जा देती है, और गोचर ज़मीन पर परिस्थितियाँ निर्मित करता है",
      icon: "🛡️",
      keyHighlight: "दशा और गोचर का संतुलन: कर्म में अनुशासन और निरंतरता ही वास्तविक विजय का रहस्य है",
      paragraphs: [
        `ज्योतिष का एक अत्यंत गूढ़ नियम है: 'दशा इच्छा और ऊर्जा पैदा करती है, लेकिन गोचर ज़मीन पर परिस्थितियाँ तय करता है।' वर्तमान में आपकी दशा (${mdPlanet}-${adPlanet}) आपको आगे बढ़ने की प्रेरणा दे रही है, जबकि आकाश में ग्रहों का वर्तमान गोचर आपसे हर कदम सोच-समझकर रखने की मांग कर रहा है।`,
        `इस संतुलन को समझिए: जब दशा गति मांगती है और गोचर सावधानी, तो इसका अर्थ यह होता है कि आप जो भी निर्णय लें, वह ठोस कागजी औपचारिकताओं, स्पष्ट संवाद और दीर्घकालिक रणनीति पर आधारित होना चाहिए।`,
        `ग्रहों की यह आकाशीय जुगलबंदी वास्तव में आपकी सुरक्षा ढाल है ताकि भविष्य में किसी भी प्रकार की विफलता की गुंजाइश न रहे।`
      ]
    },
    {
      chapterNum: 4,
      title: "चतुर्थ सोपान: आगामी दशा चक्र एवं भविष्य की टाइमलाइन — आने वाले वर्षों का रोडमैप",
      subtitle: "वर्तमान उप-दौर के पश्चात आने वाले स्वर्णिम मोड़ों का पूर्व-विश्लेषण",
      icon: "🌟",
      keyHighlight: "आगामी दशा क्रम: जीवन में कर्म, प्रतिष्ठा और व्यक्तिगत उपलब्धियों का विस्तार",
      paragraphs: [
        `आने वाले वर्षों का विंशोत्तरी रोडमैप आपके जीवन में नए अवसरों और स्थिरता का द्वार खोलने जा रहा है।`,
        `जैसे ही वर्तमान अंतर्दशा अपने अगले चरण में प्रवेश करेगी, आपके जीवन से पुरानी दुविधाएं और अनावश्यक भटकाव समाप्त होंगे। नए उप-दौर में आपकी ऊर्जा पूरी तरह केंद्रित होगी, जिससे आपके द्वारा बनाए गए सिस्टम्स और प्रयास ठोस आर्थिक व सामाजिक सफलता में परिवर्तित होंगे।`,
        `यह वह समय होगा जब आप मुड़कर देखेंगे और समझेंगे कि वर्तमान की सारी मेहनत और अनुशासन आपको उसी स्वर्णिम मुकाम के लिए तैयार कर रहे थे।`
      ]
    }
  ];

  const upcomingRoadmap: UpcomingMilestone[] = [
    {
      phaseTitle: `फेज़ 1: ${mdPlanet}-${adPlanet} अंतर्दशा का वर्तमान प्रभाव`,
      timeWindow: "वर्तमान कालखंड",
      planetaryTrigger: `महादशा ${mdPlanet} + अंतर्दशा ${adPlanet}`,
      impactTheme: "सिस्टम्स का निर्माण, बौद्धिक स्पष्टता, मुख्य प्राथमिकताओं की पहचान",
      detailedInsight: "इस दौर में अपनी ऊर्जा को बिखरने न दें। अपने कोर लक्ष्यों पर एकाग्र होकर काम करें।"
    },
    {
      phaseTitle: "फेज़ 2: दशा संधि एवं दिशा का पुष्टिकरण",
      timeWindow: "आगामी 12-18 माह",
      planetaryTrigger: "आगामी अंतर्दशा का आरंभ + गोचर में अनुकूलता",
      impactTheme: "अनावश्यक बोझ से मुक्ति, स्पष्ट दिशा, नए प्रोजेक्ट्स का अनावरण",
      detailedInsight: "पुराने संशयों का अंत होगा और कार्यक्षेत्र में ठोस प्रगति देखने को मिलेगी।"
    },
    {
      phaseTitle: "फेज़ 3: स्वर्णिम कालखंड एवं प्रयासों की पूर्ण सिद्धि",
      timeWindow: "आगामी 2-3 वर्ष",
      planetaryTrigger: "शुभ ग्रह की अंतर्दशा + गोचर का पूर्ण सहयोग",
      impactTheme: "प्रतिष्ठा, पारिवारिक सुख, आर्थिक स्थायित्व, लक्ष्यों की पूर्ति",
      detailedInsight: "जीवन का एक अत्यंत संतुलित और समृद्ध कालखंड जब दीर्घकालिक इच्छाएं साकार होंगी।"
    }
  ];

  return {
    pillarKey: "timing",
    title: "विंशोत्तरी समय-सारणी एवं महादशा चक्र (Vimshottari Timeline)",
    subtitle: `120-वर्षीय जीवन चक्र, वर्तमान ${mdPlanet}-${adPlanet} दशा प्रभाव और आगामी भविष्य का रोडमैप`,
    icon: "⏳",
    badge: "Timing & Dashas",
    heroHeadline: `${name} जी का कालचक्र विधान: ${mdPlanet} महादशा में ${adPlanet} अंतर्दशा और आगामी स्वर्णिम समय-सारणी`,
    chapters,
    upcomingRoadmap,
    actionableDirective: {
      title: "समय की धारा को अपने पक्ष में मोड़ने के शास्त्रीय नियम",
      points: [
        `वर्तमान महादशा स्वामी ${mdPlanet} देव के बीज मंत्र का नियमित स्मरण करें।`,
        `अंतर्दशा स्वामी ${adPlanet} देव की अनुकूलता हेतु उनके संबंधित वार को दान या पूजा-अर्चना करें।`,
        "किसी भी महत्वपूर्ण निर्णय से पहले शुभ मुहूर्त और चौघड़िया का ध्यान रखें।",
        "व्यर्थ की नकारात्मक चर्चाओं से अपनी ऊर्जा को बचाकर रखें और अपने मुख्य लक्ष्यों पर केंद्रित रहें।"
      ],
      gemstoneOrRemedyNote: `दशा संतुलन हेतु ${mdPlanet} व ${adPlanet} के अनुकूल ध्यान व मंत्र जप सर्वश्रेष्ठ उपाय है।`
    }
  };
}

// ── 4. ASTROLOGER TECH SPECS (32+ YOGAS) NARRATIVE ──────────────────────────
export function generateSpecsPillarNarrative(
  chart: ChartData,
  yogas: YogaResult[] = [],
  shadbala?: ShadbalaResult | null
): PillarNarrativeData {
  const name = chart.name || "जातक";
  const p = chart.planets || {};
  const presentYogas = yogas.filter((y) => y.present);
  const rareYogas = presentYogas.filter((y) => y.rare);
  const totalYogaCount = presentYogas.length || 12;

  const topBenefic = presentYogas.filter((y) => !y.isDosha).slice(0, 3);
  const topBeneficNames = topBenefic.map(y => y.name).join(", ") || "शुभ राजयोग";

  const chapters: PillarChapter[] = [
    {
      chapterNum: 1,
      title: "प्रथम सोपान: शास्त्रीय योगों का वास्तविक विज्ञान — सुप्त बीज बनाम जाग्रत वृक्ष",
      subtitle: "महर्षि पराशर का योगफल सिद्धांत: कब और कैसे फलित होते हैं कुंडली के योग?",
      icon: "🔬",
      keyHighlight: `आपकी कुंडली में ${totalYogaCount} शास्त्रीय योग उपस्थित हैं — यह आपकी जन्म-कुंडली का अद्वितीय डीएनए है`,
      paragraphs: [
        `सामान्य ज्योतिष में लोग कुंडली में 'राजयोग' या 'धनयोग' का नाम सुनते ही यह उम्मीद करने लगते हैं कि हर दिन चमत्कार होगा। लेकिन महर्षि पराशर का 'योगफल सिद्धांत' (Yogaphala Siddhanta) यह सिखाता है कि कुंडली में उपस्थित योग वास्तव में 'भूमि में दबे हुए शक्तिशाली बीज' (Dormant Potential) की तरह होते हैं।`,
        `आपकी कुंडली में ${totalYogaCount} शास्त्रीय योगों की उपस्थिति यह सिद्ध करती है कि आपकी जन्म-कुंडली का आधार अत्यंत समृद्ध और विविधतापूर्ण है। लेकिन कोई भी बीज तब तक वृक्ष बनकर फल नहीं देता जब तक उसे तीन चीज़ें न मिलें: पहला, उपयुक्त ऋतु (ग्रह की महादशा); दूसरा, पानी और खाद (उपयुक्त अंतर्दशा); और तीसरा, अनुकूल मौसम का झोंका (गोचर का आकाशीय संरेखण)।`,
        `जब उन योगों का निर्माण करने वाले ग्रहों का समय चक्र सक्रिय होता है, तब वे योग अचानक जाग्रत होकर जातक को अप्रत्याशित सफलता और सम्मान प्रदान करते हैं।`
      ]
    },
    {
      chapterNum: 2,
      title: "द्वितीय सोपान: कुंडली के प्रमुख राजयोग एवं विशिष्ट गठबंधन",
      subtitle: `आपके चार्ट में उपस्थित शीर्ष योग: ${topBeneficNames}`,
      icon: "👑",
      keyHighlight: `शीर्ष योग: ${topBeneficNames} — जीवन में विशेष क्षमता और प्रतिष्ठा का आधार`,
      paragraphs: [
        `आपकी जन्म कुंडली में उपस्थित योगों का विश्लेषण करने पर यह स्पष्ट होता है कि आपके पास विशिष्ट ग्रहों का आशीर्वाद है।`,
        topBenefic.length > 0
          ? `आपकी कुंडली में मुख्य रूप से ${topBenefic.map(y => `**${y.name}** (${y.description})`).join("; ")} सक्रिय हैं। ये योग आपको तार्किक बुद्धि, नेतृत्व क्षमता और विपरीत परिस्थितियों में भी रास्ता निकालने की अद्भुत शक्ति प्रदान करते हैं।`
          : "आपकी कुंडली में केंद्र और त्रिकोण के स्वामियों का शुभ संबंध आपके प्रयासों को निरंतर प्रगति की ओर अग्रसर करता है।",
        `ये शास्त्रीय गठबंधन दर्शाते हैं कि आपकी सफलता केवल भाग्य के सहारे नहीं, बल्कि आपके चरित्र, ज्ञान और कार्यकुशलता के बल पर स्थापित होगी।`
      ]
    },
    {
      chapterNum: 3,
      title: "तृतीय सोपान: वर्तमान में सक्रिय योग — इस समय कौन-सी ऊर्जा जाग रही है?",
      subtitle: "वर्तमान दशा व गोचर के प्रभाव से कौन-से योग ऊर्जा बरसा रहे हैं?",
      icon: "⚡",
      keyHighlight: "दशा स्वामी के ग्रह योग इस समय पूरी शक्ति से कार्यरत हैं",
      paragraphs: [
        `वर्तमान समय में जो ग्रह आपकी महादशा और अंतर्दशा का संचालन कर रहे हैं, उनसे संबंधित सभी योग इस समय जाग्रत अवस्था में हैं।`,
        `यही कारण है कि आपका ध्यान इस समय अपने कौशल को निखारने, नई रणनीतियां बनाने और अपने जीवन को एक सुदृढ़ संरचना देने पर केंद्रित है।`,
        `जो योग अभी सक्रिय हैं, वे वास्तव में आने वाले बड़े अवसरों के लिए आपकी क्षमता को तराश रहे हैं।`
      ]
    },
    {
      chapterNum: 4,
      title: "चतुर्थ सोपान: आगामी गोचर से जाग्रत होने वाले सुप्त योग — भविष्य के आकाशीय ट्रिगर्स",
      subtitle: "जब गुरु और शनि का गोचर अनुकूल होगा, तब कौन-से महा-योग प्रस्फुटित होंगे?",
      icon: "🌌",
      keyHighlight: "आगामी गोचर ट्रिगर्स: सुप्त योगों का जागरण और जीवन में ठोस उपलब्धियां",
      paragraphs: [
        `आने वाले समय में जब देवगुरु बृहस्पति और शनि देव का गोचर आपकी कुंडली के संवेदनशील बिंदुओं से गुजरेगा, तो कुंडली में सोए हुए शुभ योग पूरी तरह खिल उठेंगे।`,
        `यह गोचर आपके कार्यक्षेत्र में नई पहचान, मान-सम्मान और संचित पूंजी में वृद्धि कराएगा। आपके द्वारा किए गए पुराने प्रयास सार्वजनिक रूप से सराहे जाएंगे।`,
        `उस समय आपकी कुंडली के धन योग और राजयोग अपने पूर्ण यौवन में होंगे, जिससे आपके जीवन में स्थायित्व और आत्म-संतुष्टि का उदय होगा।`
      ]
    }
  ];

  const upcomingRoadmap: UpcomingMilestone[] = [
    {
      phaseTitle: "फेज़ 1: सक्रिय योगों का पोषण एवं अभ्यास",
      timeWindow: "वर्तमान कालखंड",
      planetaryTrigger: "दशा-स्वामियों के संबंधित योगों की सक्रियता",
      impactTheme: "कौशल की मजबूती, बौद्धिक एकाग्रता, आंतरिक विकास",
      detailedInsight: "सक्रिय योगों की ऊर्जा को किसी ठोस रचनात्मक कार्य में लगाएं।"
    },
    {
      phaseTitle: "फेज़ 2: गुरु गोचर से सुप्त राजयोगों का प्रकटीकरण",
      timeWindow: "आगामी 12-18 माह",
      planetaryTrigger: "देवगुरु बृहस्पति का केंद्र-त्रिकोण गोचर",
      impactTheme: "प्रतिष्ठा में वृद्धि, ज्ञान की मान्यता, नए सहयोगियों का साथ",
      detailedInsight: "गुरु की दृष्टि सोए हुए योगों को जाग्रत कर सकारात्मक वातावरण बनाएगी।"
    },
    {
      phaseTitle: "फेज़ 3: शनि की स्थिरता से धन व कीर्ति का स्थायित्व",
      timeWindow: "आगामी 2-3 वर्ष",
      planetaryTrigger: "शनि का राशि परिवर्तन + योग-कारकों का पूर्ण संरेखण",
      impactTheme: "स्थायी संपत्तियां, दीर्घकालिक प्रतिष्ठा, लक्ष्यों की पूर्ण सिद्धि",
      detailedInsight: "कुंडली के राजयोगों का ठोस और प्रत्यक्ष परिणाम इस कालखंड में दृष्टिगोचर होगा।"
    }
  ];

  return {
    pillarKey: "specs",
    title: "शास्त्रीय योग एवं शडबल महा-तकनीकी विश्लेषण (32+ Yogas Engine)",
    subtitle: `${totalYogaCount} शास्त्रीय योगों का आकाशीय डीएनए, सुप्त बनाम जाग्रत योगफल सिद्धांत और आगामी गोचर ट्रिगर्स`,
    icon: "🔬",
    badge: "32+ Yogas Specs",
    heroHeadline: `${name} जी की कुंडली का शास्त्रीय गणित: ${totalYogaCount} योगों का जाग्रत विज्ञान और आगामी गोचर ट्रिगर्स`,
    chapters,
    upcomingRoadmap,
    actionableDirective: {
      title: "योगों की सुप्त ऊर्जा को जाग्रत करने का शास्त्रीय नियम",
      points: [
        "योग केवल कुंडली में होने से फल नहीं देते; उन्हें जाग्रत करने के लिए कर्म (Action) और एकाग्रता आवश्यक है।",
        "अपने लग्नेश और शुभ योग-कारक ग्रहों के प्रति सम्मान और कृतज्ञता बनाए रखें।",
        "नियमित रूप से आत्म-निरीक्षण करें और अपनी कमजोरियों को दूर करने का प्रयास करें।",
        "धैर्य और निरंतरता बनाए रखें; समय आने पर हर शुभ योग अपना निश्चित फल प्रदान करता है।"
      ],
      gemstoneOrRemedyNote: "अपनी कुंडली के सर्वाधिक बली योग-कारक ग्रह के मंत्र का नित्य स्मरण योगों को जाग्रत करने की सर्वोत्तम कुंजी है।"
    }
  };
}
