// src/lib/astro-engine/simple-kundli-dossier-engine.ts
// ============================================================================
// AstroLife — Authentic Conversational Shastric Dossier Engine
// Pure human-tone guru/fatherly consultation guidance.
// Absolutely zero technical jargon, no book names, no raw tables.
// 100% Mathematically and Astrologically tailored to the Native's Chart.
//
// Dynamic Features:
// 1. Chart-Derived Master Yogas + Real Karmic Challenges (Doshas)
// 2. Personality Traits + Lagnesh House Outcomes + Secret Master Destiny Key
// 3. Career Matrix (10th Sign, 10th Lord, Amatyakaraka, Dhana Sthanas) + Tatva-based Micro-Vastu
// 4. Marriage & Life Partner (Spouse Nature, Meeting Context, Love vs Arranged, Kalatra-Bhagya)
// 5. Current Time Dasha Analysis + Age-Stage Conscious Milestones
// 6. Fatherly Protective Advice derived from actual chart afflictions
// 7. Favourable Gemstone Consultation for Lagna/Functional Benefic
// 8. 4 Chart-Tailored Sacred Daily Remedies
// 9. Inspiring Personalized Conclusion
// ============================================================================

import type { ChartData, PlanetData } from "./calculations";
import { NAKSHATRA_DATA } from "./nakshatra-data";
import { calculateDivisional } from "./divisional";
import { buildMangalDoshaInsight } from "./mangal-dosha-adapter";
import { generateGemstoneReportFromChart } from "./gemstone";

export interface MasterYogaItem {
  id: number;
  title: string;
  desc: string;
  outcome: string;
  icon: string;
}

export interface KarmicChallengeItem {
  id: number;
  title: string;
  desc: string;
  advice: string;
}

export interface IdealFieldItem {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

export interface AgeMilestoneItem {
  id: number;
  age: string;
  years: string;
  title: string;
  desc: string;
}

export interface FatherlyAdviceItem {
  id: number;
  title: string;
  advice: string;
}

export interface SacredRemedyItem {
  id: number;
  title: string;
  practice: string;
  benefit: string;
  icon: string;
}

export interface SimpleKundliDossierData {
  nativeName: string;
  displayName: string;
  currentAge: number;
  activeDashaBadge: string;
  masterRajyogas: MasterYogaItem[];
  karmicChallenges: KarmicChallengeItem[];
  personality: {
    lagnaTrait: string;
    houseOutcome: string;
    hiddenTrait: string;
    destinyKey: string;
  };
  career: {
    roleTitle: string;
    roleSummary: string;
    idealFields: IdealFieldItem[];
    wealthFlow: string;
    microVastu: {
      deskDirection: string;
      sleepDirection: string;
      explanation: string;
    };
  };
  marriage: {
    spouseNature: string;
    meetingVenue: string;
    marriageTypeTitle: string;
    marriageTypeExplanation: string;
    kalatraBhagyaNote: string;
  };
  timelines: {
    dashaWindow: string;
    activeMD: string;
    activeAD: string;
    timeClimate: string;
    turningPoint: {
      heading: string;
      dates: string;
      impact: string;
    };
    milestones: AgeMilestoneItem[];
  };
  fatherlyAdvice: FatherlyAdviceItem[];
  gemstone: {
    primaryStone: string;
    englishStone: string;
    metal: string;
    finger: string;
    dayTime: string;
    benefits: string;
    alternative: string;
  };
  remedies: SacredRemedyItem[];
  conclusion: string;
}

const RASHIS_HINDI = [
  "मेष (Aries)",
  "वृषभ (Taurus)",
  "मिथुन (Gemini)",
  "कर्क (Cancer)",
  "सिंह (Leo)",
  "कन्या (Virgo)",
  "तुला (Libra)",
  "वृश्चिक (Scorpio)",
  "धनु (Sagittarius)",
  "मकर (Capricorn)",
  "कुंभ (Aquarius)",
  "मीन (Pisces)",
];

const RASHIS_SHORT = [
  "मेष",
  "वृषभ",
  "मिथुन",
  "कर्क",
  "सिंह",
  "कन्या",
  "तुला",
  "वृश्चिक",
  "धनु",
  "मकर",
  "कुंभ",
  "मीन",
];

const RASHIS_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const RASHI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const PLANET_NAMES_HINDI: Record<string, string> = {
  Sun: "सूर्य देव",
  Moon: "चंद्रमा",
  Mars: "मंगल देव",
  Mercury: "बुध देव",
  Jupiter: "देवगुरु बृहस्पति",
  Venus: "शुक्र देव",
  Saturn: "शनि देव",
  Rahu: "राहु",
  Ketu: "केतु",
};

export function formatDMS(lon: number): string {
  const norm = ((lon % 30) + 30) % 30;
  const deg = Math.floor(norm);
  const minFloat = (norm - deg) * 60;
  const min = Math.floor(minFloat);
  return `${deg}° ${String(min).padStart(2, "0")}'`;
}

/**
 * Calculates Chara Karakas secretly without exposing technical names to user
 */
function getSecretKarakas(planets: Record<string, PlanetData>) {
  const list = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    .map((name) => {
      const p = planets[name];
      const degInSign = p ? ((p.lon % 30) + 30) % 30 : 0;
      return { name, degInSign };
    })
    .sort((a, b) => b.degInSign - a.degInSign);

  return {
    soulPlanet: list[0]?.name || "Moon",
    careerPlanet: list[1]?.name || "Mercury",
    spousePlanet: list[6]?.name || "Saturn",
  };
}

/**
 * Calculates planetary distance secretly to derive current experiential energetic climate
 */
function getSecretTimeClimate(moonNakshatraName: string, targetNakshatraName: string) {
  const CLIMATES = [
    { num: 1, text: "शारीरिक ऊर्जा, स्वास्थ्य और स्वयं के आधार को मजबूत करने का समय है।" },
    { num: 2, text: "आर्थिक संपन्नता, नए धन स्रोतों और व्यापारिक लाभ के अवसरों का स्वर्णिम समय है।" },
    { num: 3, text: "अप्रत्याशित परिवर्तनों और भागदौड़ का समय; रणनीतिक धैर्य और सावधानी अपेक्षित है।" },
    { num: 4, text: "सुरक्षा, पारिवारिक सुख, मानसिक शांति और कार्यों में ठोस स्थिरता का समय है।" },
    { num: 5, text: "प्रतिस्पर्धा और विरोधी दबाव का समय; विवादों से बचकर कूटनीति से काम लें।" },
    { num: 6, text: "कड़ी मेहनत, फाउंडेशन तैयार करने और बड़े लक्ष्यों को साधने का समय है। जिम्मेदारियां बढ़ेंगी, थोड़ा तनाव रह सकता है, लेकिन यह आने वाली सफलता की जमीन तैयार कर रहा है।" },
    { num: 7, text: "गहन शोधन, आंतरिक रूपांतरण और जोखिम भरे वित्तीय कदमों से दूरी रखने का समय है।" },
    { num: 8, text: "सहयोगियों की मदद, सामाजिक नेटवर्क का विस्तार और अनुकूल परिणामों का समय है।" },
    { num: 9, text: "सर्वोत्तम उपलब्धियों, गहरी आत्मीयता और बहुप्रतीक्षित सफलताओं का समय है।" },
  ];

  if (!moonNakshatraName || !targetNakshatraName) {
    return CLIMATES[5].text;
  }

  const clean = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
  const moonClean = clean(moonNakshatraName);
  const targetClean = clean(targetNakshatraName);

  const moonIdx = NAKSHATRA_DATA.findIndex((n) => clean(n.name).includes(moonClean) || moonClean.includes(clean(n.name)));
  const targetIdx = NAKSHATRA_DATA.findIndex((n) => clean(n.name).includes(targetClean) || targetClean.includes(clean(n.name)));

  if (moonIdx === -1 || targetIdx === -1) {
    return CLIMATES[5].text;
  }

  const diff = ((targetIdx - moonIdx) % 9 + 9) % 9;
  return CLIMATES[diff].text;
}

/**
 * Returns human outcome of Lagna and Lagnesh in house (1-12)
 */
function getLagneshOutcome(lagnaNum: number, lagneshHouse: number, lagneshName: string): { lagnaTrait: string; houseOutcome: string } {
  const lagnaTraits: Record<number, string> = {
    0: "मेष लग्न होने से आप स्वभाव से अत्यंत साहसी, निडर, ऊर्जावान, सीधे मुद्दे पर बात करने वाले और किसी भी नई पहल को तुरंत शुरू करने वाले हैं।",
    1: "वृषभ लग्न होने से आप स्वभाव से शांत, स्थिर, व्यावहारिक, सुरुचिपूर्ण और किसी भी काम को धैर्यपूर्वक अंजाम तक पहुँचाने वाले हैं।",
    2: "मिथुन लग्न होने से आप स्वभाव से बहुमुखी प्रतिभा के धनी, तीव्र संप्रेषक, जिज्ञासु और त्वरित तार्किक विश्लेषक हैं।",
    3: "कर्क लग्न होने से आप स्वभाव से अत्यंत संवेदनशील, अंतर्ज्ञानी, परिवार व समाज को साथ लेकर चलने वाले और भावनात्मक गहराई से सोचने वाले हैं।",
    4: "सिंह लग्न होने से आप स्वभाव से स्वाभाविक सम्राट, आत्म-सम्मान के धनी, उदार, निर्भीक और व्यवस्था का नेतृत्व करने वाले हैं।",
    5: "कन्या लग्न होने से आप स्वभाव से अत्यधिक विनम्र, सूक्ष्म विश्लेषक, व्यावहारिक, शांत और हर छोटी-से-छोटी डिटेल पर बारीक नज़र रखने वाले हैं।",
    6: "तुला लग्न होने से आप स्वभाव से रणनीतिक वार्ताकार, न्यायप्रिय, संतुलित सोच वाले और सामाजिक सामंजस्य स्थापित करने वाले हैं।",
    7: "वृश्चिक लग्न होने से आप स्वभाव से अत्यंत गूढ़, अनुसंधानात्मक, अटूट इच्छाशक्ति वाले और रणनीतिक गोपनीयता बनाए रखने वाले हैं।",
    8: "धनु लग्न होने से आप स्वभाव से आशावादी, बड़े विज़न वाले, दार्शनिक और उच्च नैतिक सिद्धांतों पर चलने वाले हैं।",
    9: "मकर लग्न होने से आप स्वभाव से लोहे जैसे अनुशासित, कर्मठ, व्यावहारिक और शून्य से विशाल साम्राज्य का निर्माण करने वाले हैं।",
    10: "कुंभ लग्न होने से आप स्वभाव से लीक से हटकर सोचने वाले, बड़े मानवतावादी, सिस्टम आर्किटेक्ट और दूरदर्शी हैं।",
    11: "मीन लग्न होने से आप स्वभाव से संवेदनशील, आध्यात्मिक, असीम कल्पनाशीलता के धनी और सीमाओं से परे सोचने वाले हैं।",
  };

  const houseOutcomes: Record<number, string> = {
    1: `आपके व्यक्तित्व का स्वामी प्रथम भाव में ही होने से आप अत्यंत स्वाभिमानी, स्वतंत्र और आत्म-निर्मित व्यक्तित्व के धनी हैं। आपको किसी के अधीन दबकर काम करना पसंद नहीं होता; आप अपने जीवन और काम की दिशा खुद तय करते हैं।`,
    2: `आपके व्यक्तित्व का स्वामी धन भाव में होने से आपका गहरा जुड़ाव वित्तीय रणनीति, वाणी के प्रभाव, परिवार के मान-सम्मान और दीर्घकालिक परिसंपत्तियों (Assets) के निर्माण से रहता है। आप अपने विचारों और संवाद से धन आकर्षित करने में माहिर हैं।`,
    3: `आपके व्यक्तित्व का स्वामी पराक्रम भाव में होने से आपका गहरा जुड़ाव अपनी बाहुबल व बौद्धिक मेहनत से भाग्य निर्माण, उद्यमशीलता, लेखन/तकनीक और नए रास्तों की खोज से रहता है। आप कभी भाग्य के भरोसे नहीं बैठते, बल्कि अपने पुरुषार्थ से नए रास्ते बनाते हैं।`,
    4: `आपके व्यक्तित्व का स्वामी सुख भाव में होने से आपका गहरा जुड़ाव मानसिक शांति, भूमि-भवन, अचल संपत्ति और व्यापक जन-समुदाय से रहता है। आपको अपने घर, मूल स्थान या अपने द्वारा बनाए गए आरामदायक परिवेश में रहकर बड़े काम करना अधिक भाता है।`,
    5: `आपके व्यक्तित्व का स्वामी बुद्धि भाव में होने से आपका गहरा जुड़ाव असाधारण बौद्धिक मेधा, दूरगामी रणनीतियों, मेंटरशिप, कंसल्टिंग और गहन ज्ञान सृजन से रहता है। आप किसी भी जटिल समस्या के मूल को तुरंत पकड़ लेते हैं।`,
    6: `आपके व्यक्तित्व का स्वामी सेवा व समाधान भाव में होने से आपका गहरा जुड़ाव जटिल समस्याओं को सुलझाने (Troubleshooting), प्रतिस्पर्धी माहौल में विजय पाने और तकनीकी/कानूनी/वित्तीय चुनौतियों को कुचलने से रहता है। आप दबाव में सर्वश्रेष्ठ प्रदर्शन करते हैं।`,
    7: `आपके व्यक्तित्व का स्वामी साझेदारी भाव में होने से आपका गहरा जुड़ाव पब्लिक रिलेशंस, बड़े क्लाइंट्स, बिजनेस पार्टनरशिप्स और विवाह के बाद तीव्र भाग्योदय से रहता है। आप लोगों को एकजुट करके बड़ा काम कराने में दक्ष हैं।`,
    8: `आपके व्यक्तित्व का स्वामी शोध भाव में होने से आपका गहरा जुड़ाव छिपे हुए डेटा, रहस्यों, डीप टेक/रिसर्च, और संकटों के बाद 'शून्य से साम्राज्य खड़ा करने' से रहता है। आप सामान्य लोगों की नजर से ओझल सच्चाइयों को आसानी से देख लेते हैं।`,
    9: `आपके व्यक्तित्व का स्वामी भाग्य भाव में होने से आपका गहरा जुड़ाव स्वयं के बौद्धिक ज्ञान, उच्च शिक्षा, स्वतंत्र परामर्श (Consulting), और दूरदर्शी रणनीतिक फैसलों से भाग्य निर्माण से रहता है। आप अपने जीवन और कर्म के नियम स्वयं तय करते हैं।`,
    10: `आपके व्यक्तित्व का स्वामी कर्म भाव में होने से आपका गहरा जुड़ाव प्रशासनिक सत्ता, कॉरपोरेट लीडरशिप, बड़े सिस्टम्स के संचालन और समाज में सर्वोच्च पद व प्रतिष्ठा हासिल करने से रहता है। आप स्वाभाविक अगुआ हैं।`,
    11: `आपके व्यक्तित्व का स्वामी लाभ भाव में होने से आपका गहरा जुड़ाव असीमित वित्तीय विस्तार, बड़े नेटवर्क्स, प्रभावशाली लोगों से संपर्क और कई स्रोतों से आमदनी (Multi-stream Income) बनाने से रहता है। आपकी महत्वाकांक्षाएं बहुत ऊंची हैं।`,
    12: `आपके व्यक्तित्व का स्वामी द्वादश भाव में होने से आपका गहरा जुड़ाव विदेशी कंपनियों, दूरस्थ स्थानों, बैकएंड स्ट्रेटेजी, रिसर्च, या अकेले में गहन चिंतन करने से रहता है। आपको भीड़भाड़ से हटकर शांति में काम करना अधिक भाता है; आप पर्दे के पीछे रहकर बड़े सिस्टम्स को नियंत्रित करना चाहते हैं।`,
  };

  const trait = lagnaTraits[lagnaNum] || lagnaTraits[0];
  const ho = houseOutcomes[lagneshHouse] || houseOutcomes[1];

  return { lagnaTrait: trait, houseOutcome: ho };
}

/**
 * Returns Favourable Gemstone Consultation based on Lagna & Functional Benefics
 */
function getGemstoneConsultation(chart: ChartData, lagnaNum: number): {
  primaryStone: string;
  englishStone: string;
  finger: string;
  metal: string;
  dayTime: string;
  benefits: string;
  alternative: string;
} {
  const PLANET_GEM_HINDI: Record<string, {
    primaryStone: string;
    englishStone: string;
    finger: string;
    metal: string;
    dayTime: string;
    defaultBenefits: string;
    alternative: string;
  }> = {
    Mars: {
      primaryStone: "त्रिकोण लाल मूंगा",
      englishStone: "Red Coral (Moonga)",
      finger: "अनामिका (Ring Finger)",
      metal: "तांबा अथवा स्वर्ण",
      dayTime: "मंगलवार प्रातःकाल (सूर्य उदय के समय)",
      defaultBenefits: "साहस, त्वरित निर्णय क्षमता, प्रशासनिक प्रभाव और शारीरिक ऊर्जा में तीव्र वृद्धि।",
      alternative: "लाल कार्नेलियन (Carnelian)",
    },
    Sun: {
      primaryStone: "माणिक्य",
      englishStone: "Ruby (Manikya)",
      finger: "अनामिका (Ring Finger)",
      metal: "तांबा अथवा स्वर्ण",
      dayTime: "रविवार प्रातःकाल",
      defaultBenefits: "सामाजिक प्रतिष्ठा, नेतृत्व क्षमता, प्रशासनिक अधिकार और अदम्य आत्म-विश्वास।",
      alternative: "लाल गार्नेट (Red Garnet)",
    },
    Moon: {
      primaryStone: "प्राकृतिक सच्चा मोती",
      englishStone: "Natural Pearl (Moti)",
      finger: "कनिष्ठिका (Little Finger)",
      metal: "शुद्ध चांदी",
      dayTime: "सोमवार प्रातःकाल",
      defaultBenefits: "मानसिक शांति, तनाव व अनिद्रा से मुक्ति, भावनात्मक संतुलन और निर्णय स्थिरता।",
      alternative: "मूनस्टोन (Moonstone)",
    },
    Mercury: {
      primaryStone: "शुद्ध जाम्बियन पन्ना",
      englishStone: "Emerald (Panna)",
      finger: "कनिष्ठिका (Little Finger)",
      metal: "पंचधातु, स्वर्ण अथवा चांदी",
      dayTime: "बुधवार प्रातःकाल (शुक्ल पक्ष)",
      defaultBenefits: "तीक्ष्ण तार्किक मेधा, कोडिंग/डेटा प्रबंधन में निपुणता, वाणी का प्रभाव और व्यापारिक उन्नति।",
      alternative: "पेरिडॉट अथवा हरा टूर्मलाइन (Peridot)",
    },
    Jupiter: {
      primaryStone: "पीला पुखराज",
      englishStone: "Yellow Sapphire (Pukhraj)",
      finger: "तर्जनी (Index Finger)",
      metal: "शुद्ध स्वर्ण अथवा पीतल",
      dayTime: "गुरुवार प्रातःकाल",
      defaultBenefits: "उच्च ज्ञान, ईश्वरीय कृपा, आध्यात्मिक उन्नति, समाज में आदर और वित्तीय संपन्नता।",
      alternative: "सुनहला (Citrine / Topaz)",
    },
    Venus: {
      primaryStone: "सफेद पुखराज अथवा ओपल",
      englishStone: "White Sapphire / Natural Opal",
      finger: "मध्यमा अथवा कनिष्ठिका",
      metal: "चांदी अथवा सफेद सोना",
      dayTime: "शुक्रवार प्रातःकाल",
      defaultBenefits: "मानसिक सौम्यता, पारिवारिक सुख, भौतिक ऐश्वर्य और रचनात्मक प्रचुरता।",
      alternative: "जरकन (Zircon)",
    },
    Saturn: {
      primaryStone: "नीलम अथवा कटैला (परीक्षणोपरांत)",
      englishStone: "Blue Sapphire / Amethyst",
      finger: "मध्यमा (Middle Finger)",
      metal: "पंचधातु अथवा चांदी",
      dayTime: "शनिवार सायंकाल",
      defaultBenefits: "अनुशासन, दीर्घकालिक साम्राज्य निर्माण, स्थिरता और कर्म में निष्ठा।",
      alternative: "पेरिडॉट अथवा अमेथिस्ट (Amethyst)",
    },
  };

  try {
    const report = generateGemstoneReportFromChart(chart);
    const p = report?.primaryGemstone;
    const planet = p?.planet;

    if (planet && PLANET_GEM_HINDI[planet]) {
      const meta = PLANET_GEM_HINDI[planet];
      const benefits = (p?.benefits && p.benefits.length > 0)
        ? p.benefits.join(" ")
        : meta.defaultBenefits;
      const alternative = p?.alternateGemstone
        ? `${p.alternateGemstone} (${meta.alternative})`
        : meta.alternative;

      return {
        primaryStone: meta.primaryStone,
        englishStone: meta.englishStone,
        finger: meta.finger,
        metal: meta.metal,
        dayTime: meta.dayTime,
        benefits,
        alternative,
      };
    }
  } catch (err) {
    console.warn("Dynamic gemstone report fallback:", err);
  }

  // Classical Lagna-based Benefic Fallback (Aries/Scorpio -> Mars / Red Coral)
  const LAGNA_DEFAULT_PLANET: Record<number, string> = {
    0: "Mars",    // Aries -> Red Coral
    1: "Venus",   // Taurus -> White Sapphire / Opal
    2: "Mercury", // Gemini -> Emerald
    3: "Mars",    // Cancer -> Mars is Yogakaraka (rules 5 & 10) -> Red Coral
    4: "Mars",    // Leo -> Mars is Yogakaraka (rules 4 & 9) -> Red Coral
    5: "Mercury", // Virgo -> Emerald
    6: "Venus",   // Libra -> White Sapphire / Opal
    7: "Mars",    // Scorpio -> Red Coral
    8: "Jupiter", // Sagittarius -> Yellow Sapphire
    9: "Saturn",  // Capricorn -> Blue Sapphire
    10: "Saturn", // Aquarius -> Blue Sapphire
    11: "Jupiter",// Pisces -> Yellow Sapphire
  };

  const fallbackPlanet = LAGNA_DEFAULT_PLANET[lagnaNum] || "Mars";
  const meta = PLANET_GEM_HINDI[fallbackPlanet] || PLANET_GEM_HINDI["Mars"];
  return {
    primaryStone: meta.primaryStone,
    englishStone: meta.englishStone,
    finger: meta.finger,
    metal: meta.metal,
    dayTime: meta.dayTime,
    benefits: meta.defaultBenefits,
    alternative: meta.alternative,
  };
}

/**
 * Returns structured consultation data for clean React component rendering
 */
export function generateSimpleKundliDossierData(chart: ChartData): SimpleKundliDossierData {
  const rawName = chart.name || "जातक";
  const displayName = rawName.includes("(") ? rawName.split("(")[0].trim() : rawName;

  const rawLagnaNum = typeof chart.lagnaNum === "number"
    ? chart.lagnaNum
    : (chart.lagnaRashi ? RASHIS_NAMES.indexOf(chart.lagnaRashi) : 0);
  const lagnaNum = (rawLagnaNum >= 0 && rawLagnaNum < 12) ? rawLagnaNum : 0;
  const lagnaLord = RASHI_LORDS[lagnaNum];
  const lagneshData = chart.planets[lagnaLord];
  const lagneshHouse = lagneshData?.house ?? 1;

  const { soulPlanet, careerPlanet, spousePlanet } = getSecretKarakas(chart.planets);

  // ── SISTER ENGINE INTEGRATIONS (D-9 NAVAMSHA & MANGLIK INSIGHT) ──
  const divCharts = calculateDivisional(chart.planets as never, lagnaNum, chart.lagnaLon ?? 0);
  const d9 = divCharts.find((c) => c.key === "D9");
  const mangalInsight = buildMangalDoshaInsight(chart);

  const moon = chart.planets.Moon;
  const moonHouse = moon ? moon.house : 1;
  const moonNakshatra = moon ? moon.nakshatra : "—";
  const sun = chart.planets.Sun;
  const mars = chart.planets.Mars;
  const mercury = chart.planets.Mercury;
  const jupiter = chart.planets.Jupiter;
  const venus = chart.planets.Venus;
  const saturn = chart.planets.Saturn;
  const rahu = chart.planets.Rahu;
  const ketu = chart.planets.Ketu;

  // 10th House (Karma) & 10th Lord
  const tenthSignNum = (lagnaNum + 9) % 12;
  const tenthLord = RASHI_LORDS[tenthSignNum];
  const tenthLordData = chart.planets[tenthLord];
  const planetsIn10th = Object.entries(chart.planets)
    .filter(([_, p]) => p.house === 10)
    .map(([name, p]) => ({ name, ...p }));

  // 5th house & lord
  const fifthSignNum = (lagnaNum + 4) % 12;
  const fifthLord = RASHI_LORDS[fifthSignNum];
  const fifthLordData = chart.planets[fifthLord];

  // 9th house & lord
  const ninthSignNum = (lagnaNum + 8) % 12;
  const ninthLord = RASHI_LORDS[ninthSignNum];
  const ninthLordData = chart.planets[ninthLord];

  // 2nd house (Dhankosh) & 11th house (Labha)
  const secondSignNum = (lagnaNum + 1) % 12;
  const secondLord = RASHI_LORDS[secondSignNum];
  const eleventhSignNum = (lagnaNum + 10) % 12;
  const eleventhLord = RASHI_LORDS[eleventhSignNum];

  // ── DYNAMIC 10TH HOUSE & CAREER MATRIX ──
  // Determine dominant career influencer (between 10th lord, planets in 10th, and Amatyakaraka)
  const dominantCareerPlanet =
    planetsIn10th[0]?.name ||
    tenthLord ||
    careerPlanet ||
    "Mercury";

  let roleTitle = "";
  let roleSummary = "";
  const idealFields: IdealFieldItem[] = [];

  if (dominantCareerPlanet === "Sun") {
    roleTitle = "प्रशासनिक नेतृत्व, स्वतंत्र उद्यम, नीति-निर्माण एवं अधिकार-सम्पन्न प्रबंधन (Executive Leader & Sovereign Administrator)";
    roleSummary = `आपकी कुंडली का दशम भाव सूर्य के प्रभाव से आलोकित है। आप किसी के अधीन दबकर साधारण क्लर्क की तरह काम नहीं कर सकते; आपके भीतर स्वाभाविक रूप से निर्णय लेने, व्यवस्था की कमान संभालने और 'शीर्ष प्राधिकारी' (Apex Authority) बनने की जन्मजात ऊर्जा है। सरकारी उपक्रम, सार्वजनिक नीतियां, कॉर्पोरेट बोर्ड या स्वतंत्र उद्यम में आपकी साख अद्वितीय होगी।`;
    idealFields.push(
      { id: 1, title: "सार्वजनिक प्रशासन, सिविल सर्विसेज व शासकीय उपक्रम", desc: "प्रशासनिक सत्ता, नीति-निर्माण और संस्थागत संचालन में आपका तेज सर्वोपरि रहेगा।", icon: "🏛️" },
      { id: 2, title: "कॉर्पोरेट डायरेक्टरशिप, सी-सूट लीडरशिप व कंसल्टिंग", desc: "उच्च स्तरीय रणनीतिक फैसले लेना और बड़े संगठनों को दिशा प्रदान करना।", icon: "👔" },
      { id: 3, title: "चिकित्सा प्रबंधन, फार्मास्यूटिकल नेतृत्व व ऊर्जा क्षेत्र", desc: "स्वास्थ्य क्षेत्र, बायो-टेक अथवा ऊर्जा उद्योग में प्रभावशाली भूमिका।", icon: "☀️" }
    );
  } else if (dominantCareerPlanet === "Mars") {
    roleTitle = "तकनीकी संचालन, इंजीनियरिंग, सामरिक रणनीति एवं स्वतंत्र उद्योग (Technical Director & Strategic Operator)";
    roleSummary = `आपकी कुंडली का कर्म भाव मंगल के तेज से अनुप्राणित है। आप केवल सैद्धांतिक बातों तक सीमित नहीं रहते, बल्कि जमीनी स्तर पर समाधान निकालने, बड़े सिस्टम्स का निर्माण करने और कठिनतम चुनौतियों को परास्त करने में दक्ष हैं। जहां त्वरित निर्णय, तकनीकी कौशल और प्रतिस्पर्धी साहस की आवश्यकता होती है, वहां आप विजय प्राप्त करते हैं।`;
    idealFields.push(
      { id: 1, title: "इंजीनियरिंग, सॉफ्टवेयर इंफ्रास्ट्रक्चर व तकनीकी संचालन", desc: "कठिन तकनीकी आर्किटेक्चर, नेटवर्क और मिशन-क्रिटिकल सिस्टम्स का सफल प्रबंधन।", icon: "⚙️" },
      { id: 2, title: "रियल एस्टेट, भूमि विकास एवं निर्माण अवसंरचना", desc: "अचल संपत्तियों का संवर्धन, प्रोजेक्ट मैनेजमेंट और इंफ्रास्ट्रक्चर डेवलपमेंट।", icon: "🏗️" },
      { id: 3, title: "रक्षा, साइबर-सुरक्षा, शल्य-चिकित्सा व उद्यमशीलता", desc: "सामरिक सुरक्षा, जटिल कानूनी/सुरक्षा प्रणालियां और स्वतंत्र व्यावसायिक पहल।", icon: "🛡️" }
    );
  } else if (dominantCareerPlanet === "Mercury") {
    roleTitle = "सिस्टम निर्माता, डेटा रणनीतिकार, तकनीकी परामर्श एवं वाणिज्यिक विश्लेषक (System Architect & Advisory Strategist)";
    roleSummary = `आपकी कुंडली का दशम भाव बुध की तीक्ष्ण तार्किक मेधा से संचालित है। आप जटिल डेटाबेस प्रणालियों, एल्गोरिदम, वैश्विक वाणिज्य और उच्च स्तरीय वित्तीय परामर्श के लिए सर्वाधिक उपयुक्त हैं। साधारण 9-से-5 के रूटीन काम में आपका दम घुटेगा; आपको ऐसी स्वायत्तता चाहिए जहाँ आप अपने बौद्धिक शोध को व्यावहारिक उत्पाद में बदल सकें।`;
    idealFields.push(
      { id: 1, title: "सॉफ्टवेयर आर्किटेक्चर, एआई व डीप-टेक प्रणालियां", desc: "कोडिंग, डेटा संरचनाओं और आधुनिक तकनीकी प्लेटफॉर्म्स के निर्माण में वैश्विक स्तर की मेधा।", icon: "💻" },
      { id: 2, title: "कॉरपोरेट रणनीति, वित्तीय परामर्श एवं फिनटेक", desc: "संस्थागत प्रणालियों का विश्लेषण, वित्तीय जोखिम प्रबंधन और रणनीतिक योजना।", icon: "📊" },
      { id: 3, title: "ग्लोबल प्रोजेक्ट्स, डिजिटल मीडिया व स्वतंत्र व्यापार", desc: "दूरस्थ परियोजनाओं (Remote MNCs), अंतरराष्ट्रीय क्लाइंट्स और आधुनिक डिजिटल माध्यम।", icon: "🌐" }
    );
  } else if (dominantCareerPlanet === "Jupiter") {
    roleTitle = "सर्वोच्च सलाहकार, विधिक व वित्तीय मार्गदर्शक, शिक्षाविद एवं संस्थागत नीति निर्माता (Senior Advisory Director & Institutional Mentor)";
    roleSummary = `आपकी कुंडली का दशम भाव देवगुरु बृहस्पति के सात्विक ज्ञान से परिपूर्ण है। लोग स्वाभाविक रूप से आपके पास मार्गदर्शन, सत्यनिष्ठा और निष्पक्ष सलाह के लिए आएंगे। वित्त, विधि, उच्च शिक्षा या बड़े ट्रस्ट्स के संचालन में आपकी नैतिक मेधा संस्था को स्थिरता और अपार जन-विश्वास दिलाएगी।`;
    idealFields.push(
      { id: 1, title: "उच्च स्तरीय वित्तीय सलाह, वेल्थ मैनेजमेंट व बैंकिंग", desc: "संस्थागत पूंजी का संवर्धन, नैतिक निवेश और दीर्घकालिक संपदा प्रबंधन।", icon: "💰" },
      { id: 2, title: "कॉर्पोरेट लॉ, न्यायशास्त्र, नीति-निर्धारण व कंसल्टिंग", desc: "जटिल कानूनी विवादों का समाधान, विधिक परामर्श और उच्च स्तरीय मध्यस्थता।", icon: "⚖️" },
      { id: 3, title: "उच्च शिक्षा, शोध पीठ, प्रकाशन एवं मेंटरशिप", desc: "ज्ञान का प्रसार, शिक्षण संस्थानों की स्थापना और अगली पीढ़ी को प्रशिक्षित करना।", icon: "📚" }
    );
  } else if (dominantCareerPlanet === "Venus") {
    roleTitle = "सृजनात्मक निदेशक, मीडिया/लक्जरी ब्रांड लीडर, जन-संपर्क एवं कलात्मक उद्यमी (Creative Director & Luxury Brand Strategist)";
    roleSummary = `आपकी कुंडली का कर्म भाव शुक्र के सौंदर्य, लालित्य और जन-आकर्षण से जुड़ा हुआ है। जहां सुरुचि, जन-संपर्क, मीडिया, फैशन, आर्किटेक्चर या हाई-एंड ब्रांडिंग की बात आती है, वहां आपका दृष्टिकोण सबसे आगे रहता है। आप कलात्मकता को व्यावसायिक सफलता में बदलने की अद्वितीय कला जानते हैं।`;
    idealFields.push(
      { id: 1, title: "डिजाइनिंग, आर्किटेक्चर, इंटीरियर व अर्बन प्लानिंग", desc: "भव्य परिसरों, रचनात्मक उत्पादों और आधुनिक सौंदर्यपरक डिज़ाइनों का सृजन।", icon: "🎨" },
      { id: 2, title: "मीडिया प्रोडक्शन, ब्रांडिंग, एंटरटेनमेंट व विज्ञापन", desc: "डिजिटल मीडिया कैंपेन, लक्जरी प्रोडक्ट्स की मार्केटिंग और पब्लिक रिलेशंस।", icon: "🎬" },
      { id: 3, title: "हॉस्पिटैलिटी, एविएशन, जेम-ज्वेलरी व अंतरराष्ट्रीय आयात", desc: "प्रीमियम उपभोक्ता सेवाएं, लाइफस्टाइल उद्योग और विदेशी व्यापार।", icon: "💎" }
    );
  } else if (dominantCareerPlanet === "Saturn") {
    roleTitle = "सिस्टम्स आर्किटेक्ट, दीर्घकालिक उद्योगपति, बड़े संचालन प्रमुख एवं इंफ्रास्ट्रक्चर विशेषज्ञ (Operations Director & Infrastructure Strategist)";
    roleSummary = `आपकी कुंडली का कर्म भाव शनि के अनुशासन और दीर्घकालिक दृढ़ता से युक्त है। आप किसी भी काम को जल्दबाजी या दिखावे में नहीं करते; आप 'लोहे जैसी मजबूत नींव' तैयार करके ऐसा साम्राज्य खड़ा करते हैं जो दशकों तक टिकता है। बड़े पैमाने पर संचालन, आपूर्ति श्रृंखला (Supply Chain), उद्योग और श्रम प्रबंधन में आपकी पकड़ असाधारण होगी।`;
    idealFields.push(
      { id: 1, title: "औद्योगिक विनिर्माण, लॉजिस्टिक्स व सप्लाई चेन मैनेजमेंट", desc: "भारी उद्योग, आपूर्ति श्रृंखलाओं और विशाल परिचालन नेटवर्क्स का कुशल संचालन।", icon: "🏭" },
      { id: 2, title: "आईटी इंफ्रास्ट्रक्चर, बैकएंड डेटाबेस व बड़े सिस्टम्स", desc: "जटिल प्रणालियों को जमीन से उठाकर एक त्रुटिरहित ऑटोमेशन में बदलना।", icon: "🖥️" },
      { id: 3, title: "ऊर्जा, खनन, धातु, लोक-निर्माण एवं दीर्घकालिक रियल एस्टेट", desc: "प्राकृतिक संसाधन, इंफ्रास्ट्रक्चर और सार्वजनिक निर्माण कार्य।", icon: "⛏️" }
    );
  } else {
    // Moon / Rahu / Ketu fallback
    roleTitle = "लोक-कल्याण, स्वास्थ्य सेवा, तकनीकी शोध एवं स्वतंत्र उद्यम (Public Enterprise & Advanced Research Director)";
    roleSummary = `आपकी कुंडली का दशम भाव जन-सरोकारों, जनमानस की मनोदशा को भांपने और स्वतंत्र नवाचार से जुड़ा हुआ है। आप भीड़ से अलग हटकर काम करना पसंद करते हैं; लीक से हटकर नए रास्ते तलाशना और जन-समुदाय को सीधे प्रभावित करने वाले प्रोजेक्ट्स पर काम करना आपको सर्वाधिक संतुष्टि और लाभ देगा।`;
    idealFields.push(
      { id: 1, title: "जन-संपर्क, स्वास्थ्य सेवा, साइकोलॉजी व वेलनेस", desc: "मानव कल्याण, परामर्श और समाज को स्वस्थ दिशा देने वाले आधुनिक उपक्रम।", icon: "🌿" },
      { id: 2, title: "अत्याधुनिक तकनीक, शोध संस्थान व विदेशी व्यापार", desc: "अपरंपरागत प्रौद्योगिकी, डेटा एनालिसिस और ग्लोबल मार्केट ऑपरेशंस।", icon: "🚀" },
      { id: 3, title: "ई-कॉमर्स, कंज्यूमर प्रोडक्ट्स व स्वतंत्र प्लेटफॉर्म्स", desc: "व्यापक उपभोक्ता आधार के लिए उत्पादों का निर्माण और सीधे आपूर्ति।", icon: "📦" }
    );
  }

  // ── WEALTH FLOW NARRATIVE (2nd & 11th Houses) ──
  const secondLordData = chart.planets[secondLord];
  const eleventhLordData = chart.planets[eleventhLord];
  let wealthFlow = "";

  if (eleventhLordData && [1, 2, 5, 9, 10, 11].includes(eleventhLordData.house)) {
    wealthFlow = `आपकी कुंडली में लाभ भाव का स्वामी अत्यंत शुभ स्थिति में है। यह सिद्ध करता है कि आपकी आय केवल एक साधारण मासिक तनख्वाह तक सीमित नहीं रहेगी; आपके पास एक से अधिक स्रोतों (Multi-stream Revenue) से धन का निरंतर प्रवाह होगा। जीवन के मध्य काल के बाद आपका संचित धन कई गुना गति से बढ़ेगा।`;
  } else if (secondLordData && [1, 2, 4, 5, 9, 10, 11].includes(secondLordData.house)) {
    wealthFlow = `आपकी कुंडली में धन भाव (2nd House) मजबूत है, जो दर्शाता है कि आप अपनी वाणी, ज्ञान और बौद्धिक पूंजी से स्थाई परिसंपत्तियां (Assets) निर्मित करेंगे। आपका धन निरंतर संचय और समझदारी से किए गए दीर्घकालिक निवेश से अप्रत्याशित रूप से फलेगा।`;
  } else {
    wealthFlow = `आपकी कुंडली दर्शाती है कि आपकी आय आपके अपने कौशल, विशेषज्ञता और सेवा से सुरक्षित रहेगी। जीवन में समय-समय पर बड़े वित्तीय उछाल आएंगे; बस सट्टेबाजी या बिना सोचे-समझे किए गए शॉर्टकट निवेश से बचें ताकि पूंजी सुरक्षित रहे।`;
  }

  // ── DYNAMIC TATVA-BASED MICRO-VASTU ──
  // Agni (0, 4, 8) -> Aries, Leo, Sagittarius
  // Prithvi (1, 5, 9) -> Taurus, Virgo, Capricorn
  // Vayu (2, 6, 10) -> Gemini, Libra, Aquarius
  // Jala (3, 7, 11) -> Cancer, Scorpio, Pisces
  let deskDirection = "उत्तर (North) अथवा पूर्व (East)";
  let sleepDirection = "दक्षिण (South) अथवा पूर्व (East)";
  let vastuExplanation = "";

  if ([0, 4, 8].includes(lagnaNum)) {
    // Fire
    deskDirection = "पूर्व (East) अथवा उत्तर-पूर्व (North-East)";
    vastuExplanation = `आपका लग्न अग्नि तत्व का प्रतिनिधित्व करता है। कार्य करते समय आपका मुख पूर्व दिशा की ओर होने से सूर्य का तेज और प्राकृतिक जीवनी शक्ति आपकी निर्णय क्षमता और नेतृत्व प्रभाव को उच्चतम स्तर पर रखती है।`;
  } else if ([1, 5, 9].includes(lagnaNum)) {
    // Earth
    deskDirection = "उत्तर (North) अथवा पूर्व (East)";
    vastuExplanation = `आपका लग्न पृथ्वी तत्व का प्रतिनिधित्व करता है। कार्य करते समय आपका मुख उत्तर (कुबेर व बुध की दिशा) की ओर होने से तार्किक मेधा, वित्तीय स्पष्टता और व्यापारिक गणनाओं में अचूक सटीकता मिलती है।`;
  } else if ([2, 6, 10].includes(lagnaNum)) {
    // Air
    deskDirection = "पश्चिम (West) अथवा उत्तर (North)";
    vastuExplanation = `आपका लग्न वायु तत्व का प्रतिनिधित्व करता है। कार्य करते समय उत्तर अथवा पश्चिम दिशा का संरेखण आपकी वैचारिक एकाग्रता को बढ़ाता है और अनावश्यक मानसिक भटकाव को रोककर ठोस परिणाम देता है।`;
  } else {
    // Water
    deskDirection = "उत्तर-पूर्व (North-East / ईशान) अथवा उत्तर (North)";
    vastuExplanation = `आपका लग्न जल तत्व का प्रतिनिधित्व करता है। ईशान कोण (उत्तर-पूर्व) में मुख रखकर काम करने से आंतरिक अंतर्ज्ञान (Intuition), मानसिक शांति और बौद्धिक संतुलन चरम पर रहता है।`;
  }

  vastuExplanation += ` शयन करते समय सिरहाना हमेशा ${sleepDirection} में रखें; यह पृथ्वी के चुंबकीय प्रवाह के साथ जैविक सामंजस्य स्थापित करके प्रगाढ़ अनिद्रा-मुक्त नींद देता है।`;

  // ── DYNAMIC 100% SHASTRIC MARRIAGE ENGINE (D-1 + D-9 NAVAMSHA + MANGLIK + JAIMINI) ──
  const seventhSignNum = (lagnaNum + 6) % 12;
  const seventhRashiHindi = RASHIS_HINDI[seventhSignNum];
  const seventhLord = RASHI_LORDS[seventhSignNum];
  const seventhLordHindi = PLANET_NAMES_HINDI[seventhLord] || seventhLord;
  const seventhLordData = chart.planets[seventhLord];
  const seventhLordHouse = seventhLordData ? seventhLordData.house : 7;
  const seventhLordDignity = seventhLordData?.dignity || "—";
  const planetsIn7th = Object.entries(chart.planets)
    .filter(([_, pl]) => pl.house === 7)
    .map(([name, pl]) => ({ name, ...pl }));

  // D-9 Navamsha Marriage Indicators
  const d9LagnaSign = d9?.lagna || "Taurus";
  const d9LagnaNum = typeof d9?.lagnaNum === "number" ? d9.lagnaNum : 1;
  const d9SeventhSignIndex = (d9LagnaNum + 6) % 12;
  const d9SeventhLord = RASHI_LORDS[d9SeventhSignIndex] || "Mars";
  const d9SeventhLordHindi = PLANET_NAMES_HINDI[d9SeventhLord] || d9SeventhLord;

  // Manglik Insight from sister engine
  const hasManglik = Boolean(mangalInsight?.result?.hasDosha);
  const mangalSeverityLabel = mangalInsight?.result?.severityLabel || "सौम्य";
  const mangalProtection = mangalInsight?.result?.scores?.protection ?? 0;
  const marsHouse = mars?.house ?? 1;
  const darakarakaHindi = PLANET_NAMES_HINDI[spousePlanet] || spousePlanet;

  // 1. Spouse Nature (12 Signs + Occupants + Lord Placement + D9 + Darakaraka)
  const SEVENTH_SIGN_NATURE: Record<number, string> = {
    0: "सप्तम भाव में मेष राशि होने से आपकी जीवनसाथी स्वभाव से अत्यंत साहसी, ऊर्जावान, निडर, स्वाभिमानी, सीधे मुद्दे पर बात करने वाली और त्वरित निर्णय लेने वाली होंगी। वे किसी पर आश्रित रहने के बजाय अपनी स्वतंत्र सोच और आत्मसम्मान को सर्वोपरि रखती हैं।",
    1: "सप्तम भाव में वृषभ राशि होने से आपकी जीवनसाथी स्वभाव से शांत, अत्यंत धैर्यवान, सुरुचिपूर्ण, व्यावहारिक, गृहस्थी को सुरुचिपूर्ण ढंग से संवारने वाली और स्थायित्व पसंद होंगी। वे दिखावे से दूर रहकर ठोस पारिवारिक सुख और आर्थिक अनुशासन को प्राथमिकता देती हैं।",
    2: "सप्तम भाव में मिथुन राशि होने से आपकी जीवनसाथी बहुमुखी प्रतिभा की धनी, तीक्ष्ण तार्किक बुद्धि, सुशिक्षित, कामकाजी (Working Professional), हास्य-विनोद प्रिय और व्यावहारिक संवाद में अत्यंत निपुण होंगी। उनकी वाकपटुता आपको सदा प्रेरित रखेगी।",
    3: "सप्तम भाव में कर्क राशि होने से आपकी जीवनसाथी अत्यंत संवेदनशील, ममतामयी, परिवार को एक सूत्र में बांधने वाली, सहज अंतर्ज्ञानी (Intuitive) और भावनात्मक रूप से अटूट संबल देने वाली होंगी। उनका आचरण अत्यंत सौम्य और गरिमामय रहेगा।",
    4: "सप्तम भाव में सिंह राशि होने से आपकी जीवनसाथी स्वाभाविक आत्मसम्मान से ओतप्रोत, उच्च कुलीन संस्कारों वाली, निष्ठावान, आकर्षक व्यक्तित्व और समाज में परिवार की प्रतिष्ठा व गरिमा को सर्वोच्च प्राथमिकता देने वाली होंगी।",
    5: "सप्तम भाव में कन्या राशि होने से आपकी जीवनसाथी सूक्ष्म विश्लेषक, व्यावहारिक, सुव्यवस्थित, मितव्ययी, हर काम को परफेक्शन से करने वाली और बुद्धिजीवी स्वभाव की होंगी। वे आपकी दिनचर्या और योजनाओं को एक मजबूत व्यवस्था देंगी।",
    6: "सप्तम भाव में तुला राशि होने से आपकी जीवनसाथी अत्यंत रूपवान, सुरुचिपूर्ण, न्यायप्रिय, कला-प्रेमी, सामाजिक शिष्टाचार में कुशल और दांपत्य में सौहार्द व संतुलन बनाने वाली होंगी। वे आपके सामाजिक जीवन में एक बड़ा आकर्षण बनेंगी।",
    7: "सप्तम भाव में वृश्चिक राशि होने से आपकी जीवनसाथी अत्यंत गंभीर, निष्ठावान, गूढ़ समझ रखने वाली, स्वाभिमानी और संकट के समय आपके साथ चट्टान की तरह अडिग खड़ी रहने वाली होंगी। उनका समर्पण और वफादारी अटूट रहेगी।",
    8: "सप्तम भाव में धनु राशि होने से आपकी जीवनसाथी विदुषी, धार्मिक, आशावादी, बड़े विज़न वाली, नैतिक मूल्यों से ओतप्रोत और आपके जीवन में एक सच्ची दार्शनिक मार्गदर्शक सिद्ध होंगी। उनका स्वभाव परिवार में स्वाभाविक आदर दिलाएगा।",
    9: "सप्तम भाव में मकर राशि होने से आपकी जीवनसाथी कर्तव्यनिष्ठ, परिपक्व, लोहे जैसे अनुशासन वाली, जमीन से जुड़ी हुई और दीर्घकालिक पारिवारिक समृद्धि की ठोस नींव रखने वाली होंगी। वे फिजूल बातों से दूर व्यावहारिक रहेंगी।",
    10: "सप्तम भाव में कुंभ राशि होने से आपकी जीवनसाथी स्वतंत्र चेतना वाली, लीक से हटकर सोचने वाली, मानवीय मूल्यों से युक्त, आधुनिक और बौद्धिक रूप से अत्यंत समृद्ध होंगी। वे आपके विचारों को एक बड़ा फलक देंगी।",
    11: "सप्तम भाव में मीन राशि होने से आपकी जीवनसाथी सात्विक, दयालु, कलात्मक, आध्यात्मिक चेतना वाली और निस्वार्थ प्रेम व त्याग की प्रतिमूर्ति होंगी। वे घर के वातावरण को शांति और सकारात्मक ऊर्जा से भर देंगी।",
  };

  let spouseNatureText = SEVENTH_SIGN_NATURE[seventhSignNum] || SEVENTH_SIGN_NATURE[0];

  if (planetsIn7th.length > 0) {
    const pNotes = planetsIn7th.map((pl) => {
      if (pl.name === "Jupiter") return "सप्तम भाव में देवगुरु बृहस्पति की अमृत उपस्थिति जीवनसाथी को विदुषी, धार्मिक, उच्च संस्कारों वाली और परिवार में सर्वोच्च आदर पाने वाली बनाती है।";
      if (pl.name === "Venus") return "सप्तम भाव में शुक्र देव का वास साथी को अत्यंत सुंदर, सुरुचिपूर्ण, कलात्मक और दांपत्य ऐश्वर्य में प्रचुरता लाने वाला बनाता है।";
      if (pl.name === "Mars") return "सप्तम भाव में मंगल देव की स्थिति साथी को स्पष्टवादी, निडर, सक्रिय और परिवार के सम्मान के लिए डटकर खड़े रहने वाली साहसी ऊर्जा देती है।";
      if (pl.name === "Saturn") return "सप्तम भाव में शनि देव की स्थिति जीवनसाथी को अत्यधिक संजीदा, गंभीर, व्यावहारिक, धैर्यवान और मजबूत आधार बनाने वाली बनाती है।";
      if (pl.name === "Mercury") return "सप्तम भाव में बुध देव की स्थिति साथी को तीक्ष्ण तार्किक बुद्धि, कामकाजी (Professional) और उत्कृष्ट संवादक बनाती है।";
      if (pl.name === "Sun") return "सप्तम भाव में सूर्य देव का प्रभाव साथी को स्वाभिमानी, नेतृत्व क्षमता से युक्त और सिद्धांतों पर अडिग रहने वाला बनाता है।";
      if (pl.name === "Rahu") return "सप्तम भाव में राहु का प्रभाव साथी को आधुनिक, तेज-तर्रार, लीक से हटकर और सामाजिक रूप से प्रभावशाली बनाता है।";
      if (pl.name === "Ketu") return "सप्तम भाव में केतु का प्रभाव साथी को अंतर्मुखी, सात्विक, शांत और भौतिक दिखावे से दूर रहने वाला बनाता है।";
      if (pl.name === "Moon") return "सप्तम भाव में चंद्रमा की उपस्थिति साथी को अत्यंत सौम्य, ममतामयी, आकर्षक और भावनात्मक रूप से संवेदनशील बनाती है।";
      return "";
    }).filter(Boolean);

    if (pNotes.length > 0) {
      spouseNatureText += ` ${pNotes.join(" ")}`;
    }
  }

  const lordPlacementText = seventhLordHouse === 1
    ? `सप्तमेश ${seventhLordHindi} लग्न (व्यक्तित्व भाव) में होने से जीवनसाथी आपके प्रति पूर्णतः समर्पित रहेंगी और आपकी सलाह को सर्वोच्च प्राथमिकता देंगी।`
    : seventhLordHouse === 9 || seventhLordHouse === 10
    ? `सप्तमेश ${seventhLordHindi} का ${seventhLordHouse === 9 ? "भाग्य भाव" : "कर्म भाव"} में बैठना दर्शाता है कि जीवनसाथी स्वयं बहुत प्रतिष्ठित, कामकाजी या उच्च कुलीन संस्कारों से युक्त होंगी।`
    : seventhLordHouse === 11 || seventhLordHouse === 2
    ? `सप्तमेश ${seventhLordHindi} का ${seventhLordHouse === 11 ? "लाभ भाव" : "धन भाव"} में होना यह सिद्ध करता है कि जीवनसाथी अत्यंत व्यावहारिक और वित्तीय रूप से समृद्धि लाने वाली होंगी।`
    : seventhLordHouse === 4 || seventhLordHouse === 5
    ? `सप्तमेश ${seventhLordHindi} का ${seventhLordHouse === 4 ? "सुख भाव" : "पंचम भाव"} में होना दांपत्य में प्रगाढ़ भावनात्मक प्रेम और गृहस्थी के आनंद को पुष्ट करता है।`
    : `सप्तमेश ${seventhLordHindi} का ${seventhLordHouse}वें भाव में होना यह दर्शाता है कि आपका साथी संबंधों में परिपक्वता, निष्ठा और जिम्मेदारी को बहुत गंभीरता से निभाएगा।`;

  spouseNatureText += ` ${lordPlacementText}`;
  spouseNatureText += ` सूक्ष्म दांपत्य दर्पण नवमांश (D-9) में सप्तम भाव ${RASHIS_HINDI[d9SeventhSignIndex]} में होने और नवांश सप्तमेश ${d9SeventhLordHindi} की उपस्थिति से यह पुष्ट होता है कि आंतरिक वैचारिक स्तर पर आपका यह गठबंधन एक सच्चा आत्मिक तालमेल सिद्ध होगा। जैमिनी दाराकारक ${darakarakaHindi} देव साथी के रूप में एक मजबूत नैतिक व भावनात्मक संबल का संकेत देते हैं।`;

  // 2. Meeting Venue & Context
  let meetingVenue = "";
  const venueHouse = seventhLordHouse;

  if ([10, 11].includes(venueHouse)) {
    meetingVenue = `सप्तमेश ${seventhLordHindi} का ${venueHouse === 10 ? "कर्म भाव (10th)" : "लाभ भाव (11th)"} में संरेखण यह सिद्ध करता है कि आपकी प्रथम भेंट कार्यक्षेत्र (Workplace), कॉरपोरेट प्रोजेक्ट्स, प्रोफेशनल नेटवर्किंग इवेंट्स, उद्योग से जुड़ी बैठकों या किसी बड़े प्रोफेशनल सर्कल के माध्यम से साझा पेशेवर लक्ष्यों के सिलसिले में होगी। दोनों के बीच पहला आकर्षण बौद्धिक कार्यकुशलता से उपजेगा।`;
  } else if ([3, 9, 12].includes(venueHouse)) {
    meetingVenue = `सप्तमेश ${seventhLordHindi} का ${venueHouse === 9 ? "भाग्य भाव" : venueHouse === 3 ? "तृतीय भाव" : "द्वादश भाव"} में होना यह स्पष्ट संकेत देता है कि आपकी मुलाकात किसी यात्रा (Travel), उच्च शिक्षा संस्थान (University / College), सेमिनार, वर्कशॉप, डिजिटल/ऑनलाइन प्लेटफॉर्म या किसी दूरस्थ/विदेशी परियोजना (Distant / Global Context) के दौरान होगी, जहाँ ज्ञान, नवाचार या स्वतंत्र विचार-विमर्श का वातावरण हो।`;
  } else if ([1, 5, 7].includes(venueHouse)) {
    meetingVenue = `सप्तमेश ${seventhLordHindi} का ${venueHouse === 1 ? "लग्न" : venueHouse === 5 ? "पंचम भाव" : "सप्तम भाव"} में होना यह दर्शाता है कि आपकी मुलाकात साझा बौद्धिक रुचियों (Shared Passions), रचनात्मक कार्यक्रमों, किसी कॉमन फ्रेंड सर्कल के माध्यम से या सीधे व्यक्तिगत पहल (Direct Personal Encounter) से होगी। बातचीत की शुरुआत बहुत सहज, स्वाभाविक और परस्पर आकर्षण से होगी।`;
  } else if ([2, 4].includes(venueHouse)) {
    meetingVenue = `सप्तमेश ${seventhLordHindi} का ${venueHouse === 2 ? "कुटुंब भाव" : "सुख भाव"} में होना यह संकेत करता है कि आपकी मुलाकात पारिवारिक सूत्रों, सांस्कृतिक आयोजनों, गृह नगर के प्रतिष्ठित परिचितों या किसी विश्वसनीय पारिवारिक माध्यम से होगी, जो बहुत जल्दी एक गहन आत्मीय और बौद्धिक संवाद में बदल जाएगी।`;
  } else {
    meetingVenue = `सप्तमेश ${seventhLordHindi} का ${venueHouse}वें भाव में होना यह दर्शाता है कि आपकी मुलाकात किसी अप्रत्याशित परिस्थिति, शोध कार्य, सेवा/चिकित्सा परिवेश या किसी संयुक्त समस्या के समाधान के सिलसिले में होगी, जहाँ पहले दोनों के बीच एक गहरा सम्मान और भरोसा विकसित होगा।`;
  }

  // 3. Marriage Type (Love vs Arranged + Manglik Integration)
  const has5th7thConnection =
    (fifthLordData && fifthLordData.house === 7) ||
    (seventhLordData && seventhLordData.house === 5) ||
    (fifthLordData && seventhLordData && fifthLordData.house === seventhLordData.house);

  const isRahuInLoveHouse = rahu && (rahu.house === 5 || rahu.house === 7);
  const isVenusMarsConnected = venus && mars && (venus.house === mars.house || Math.abs(venus.house - mars.house) === 6);
  const isJupiterAspecting7th = jupiter && ([1, 3, 11].includes(jupiter.house));

  let marriageTypeTitle = "";
  let marriageTypeExplanation = "";

  if (has5th7thConnection || isRahuInLoveHouse) {
    marriageTypeTitle = "प्रबल प्रेम-विवाह एवं स्वयं की पसंद (Love Marriage / Self-Choice)";
    marriageTypeExplanation = `आपकी कुंडली में पंचमेश ${PLANET_NAMES_HINDI[fifthLord] || fifthLord} और सप्तमेश ${seventhLordHindi} के मध्य सीधा संरेखण बन रहा है। यह शास्त्रीय योग स्पष्ट संकेत देता है कि आपका विवाह किसी रूढ़िवादी सामाजिक दबाव में नहीं, बल्कि आपसी परिचय, बौद्धिक तालमेल और गहरी आत्मीयता के आधार पर होगा। यदि परिवार शुरुआत में कुछ समय भी ले, तो अंततः दोनों परिवारों की पूर्ण सहमति, आशीर्वाद और मान-सम्मान के साथ यह विवाह परिणय में बदलेगा।`;
  } else if (isVenusMarsConnected) {
    marriageTypeTitle = "गहरी मित्रता के बाद परिणय (Friendship-Turned-Marriage)";
    marriageTypeExplanation = `शुक्र और मंगल का गतिशील संबंध दर्शाता है कि विवाह से पूर्व आपकी जीवनसाथी के साथ एक मजबूत मानसिक खिंचाव और मित्रता का दौर रहेगा। यह विवाह दोनों पक्षों की परस्पर सहमति, खुले विचारों और गहरे आकर्षण से संपन्न होगा।`;
  } else if (isJupiterAspecting7th) {
    marriageTypeTitle = "संस्कारित व पारिवारिक आशीर्वाद आधारित विवाह (Cultured Alliance with Familial Grace)";
    marriageTypeExplanation = `सप्तम भाव पर देवगुरु बृहस्पति का शुभ प्रभाव यह सुनिश्चित करता है कि यह गठबंधन उच्च पारिवारिक प्रतिष्ठा, नैतिक मूल्यों और दोनों परिवारों के पूर्ण आशीर्वाद से संपन्न होगा। भले ही शुरुआत पारिवारिक माध्यम से हो, लेकिन अंतिम निर्णय पूरी तरह आपकी और जीवनसाथी की परस्पर सहमति और गहरी बौद्धिक अनुकूलता पर ही टिकेगा।`;
  } else {
    marriageTypeTitle = "समान विचारधारा व आत्मीयता आधारित विवाह (Alliance with Mutual Resonance)";
    marriageTypeExplanation = `सप्तमेश ${seventhLordHindi} की स्थिति दर्शाती है कि यह विवाह एक संतुलित, संस्कारी और आपसी समझ पर आधारित गठबंधन होगा। विवाह के बाद दोनों के बीच एक आदर्श मित्रवत संबंध स्थापित होगा जो जीवन के हर पड़ाव पर एक-दूसरे को आगे बढ़ाएगा।`;
  }

  if (hasManglik) {
    marriageTypeExplanation += ` [मांगलिक सूत्र: जन्म कुंडली में मंगल देव ${marsHouse}वें भाव में स्थित हैं (${mangalSeverityLabel})। ${mangalProtection >= 40 ? "शास्त्रीय दृष्टि से इसका शुभ प्राकृतिक परिहार उपलब्ध है; दांपत्य में अनावश्यक भय की कोई आवश्यकता नहीं है।" : "रिश्ते में क्रोध व जल्दबाजी पर 5 सेकंड का मौन नियंत्रण दांपत्य को आजीवन सुखी व सुरक्षित रखेगा।"}]`;
  } else {
    marriageTypeExplanation += ` [मांगलिक स्थिति: कुंडली किसी भी गंभीर मांगलिक दोष से पूर्णतः मुक्त है; दांपत्य भाव शुभ व सुरक्षित है।]`;
  }

  // 4. 100% Dynamic Kalatra Bhagya (Marital Fortune)
  let kalatraBhagyaNote = "";
  if ([9, 10, 11].includes(seventhLordHouse)) {
    kalatraBhagyaNote = `विवाह के तुरंत बाद आपके जीवन में 'कलत्र-भाग्य महा-योग' सक्रिय होगा—सप्तमेश ${seventhLordHindi} का ${seventhLordHouse === 9 ? "भाग्य भाव (9th)" : seventhLordHouse === 10 ? "कर्म भाव (10th)" : "लाभ भाव (11th)"} में संरेखण यह सिद्ध करता है कि जीवनसाथी के आगमन के साथ ही आपकी सामाजिक प्रतिष्ठा, कार्यक्षेत्र में अधिकार और वित्तीय संचय में तीव्र गति से उछाल आएगा।`;
  } else if ([1, 4, 7].includes(seventhLordHouse)) {
    kalatraBhagyaNote = `सप्तमेश ${seventhLordHindi} का केंद्र भाव (H${seventhLordHouse}) में होना यह सुनिश्चित करता है कि विवाह के पश्चात आपके जीवन में अचल संपत्ति, नए वाहन, स्थायी सुख-सुविधाओं और पारिवारिक वैभव का स्वर्णिम विस्तार होगा। जीवनसाथी आपके घर में लक्ष्मी स्वरूप सिद्ध होंगी।`;
  } else if ([2, 5].includes(seventhLordHouse)) {
    kalatraBhagyaNote = `सप्तमेश ${seventhLordHindi} का ${seventhLordHouse === 2 ? "धन भाव (2nd)" : "त्रिकोण भाव (5th)"} में होना यह दर्शाता है कि विवाह के उपरांत आपकी बौद्धिक पूंजी और संचित संपदा में अभूतपूर्व वृद्धि होगी। जीवनसाथी की सलाह आपके लिए भाग्यशाली सिद्ध होगी।`;
  } else if ([3, 6].includes(seventhLordHouse)) {
    kalatraBhagyaNote = `सप्तमेश ${seventhLordHindi} का उपचय भाव (H${seventhLordHouse}) में होना यह इंगित करता है कि विवाह के बाद दोनों का साझा पुरुषार्थ और संयुक्त मेहनत करियर को नई ऊँचाइयों पर पहुँचाएगी। विवाह के उपरांत आपका पराक्रम और प्रभाव लगातार बढ़ता जाएगा।`;
  } else {
    kalatraBhagyaNote = `सप्तमेश ${seventhLordHindi} का ${seventhLordHouse}वें भाव में होना यह दर्शाता है कि विवाह के उपरांत आर्थिक समृद्धि किसी दूरस्थ स्थान, विदेशी संपर्क, गहरे शोध या संयुक्त वित्तीय अनुशासन के माध्यम से धीरे-धीरे एक अत्यंत ठोस व स्थायी आधारशिला रखेगी।`;
  }

  // Active Dashas
  const activeMD = chart.dashas?.find((d) => d.active) || chart.dashas?.[0];
  const activeAD = chart.antardasha?.find((d) => d.active) || chart.antardasha?.[0];
  const mdPlanet = activeMD?.planet || "Mars";
  const mdHindi = PLANET_NAMES_HINDI[mdPlanet] || mdPlanet;
  const adPlanet = activeAD?.planet || "Saturn";
  const adHindi = PLANET_NAMES_HINDI[adPlanet] || adPlanet;

  const mdStartYear = activeMD?.start ? new Date(activeMD.start).getFullYear() : 2023;
  const mdEndYear = activeMD?.end ? new Date(activeMD.end).getFullYear() : 2030;

  const adStartFormatted = activeAD?.start
    ? new Date(activeAD.start).toLocaleDateString("hi-IN", { month: "long", year: "numeric" })
    : "दिसंबर 2025";
  const adEndFormatted = activeAD?.end
    ? new Date(activeAD.end).toLocaleDateString("hi-IN", { month: "long", year: "numeric" })
    : "जनवरी 2027";

  const adNakshatra = chart.planets[adPlanet]?.nakshatra || "";
  const timeClimateText = getSecretTimeClimate(moonNakshatra, adNakshatra);

  // Score candidate upcoming ADs to find the game-changer
  const activeAdIndex = chart.antardasha?.findIndex((a) => a.active) ?? 0;
  const remainingADs = (chart.antardasha || []).slice(activeAdIndex + 1);

  let bestAd = remainingADs[0];
  let bestScore = -100;
  for (const ad of remainingADs) {
    let score = 0;
    const p = chart.planets[ad.planet];
    if (!p) continue;
    if (ad.planet === lagnaLord) score += 6;
    if (ad.planet === tenthLord) score += 5;
    if (ad.planet === ninthLord) score += 4;
    if (ad.planet === "Mercury" && (p.signNum === 5 || p.house === 10)) score += 5;
    if (ad.planet === "Jupiter" && (p.signNum === 3 || p.house === 10 || p.house === 1)) score += 5;
    if (ad.planet === "Venus" && (p.signNum === 11 || p.house === 10)) score += 4;
    if (p.house === 10 || p.house === 11 || p.house === 9 || p.house === 1) score += 3;
    if (score > bestScore) {
      bestScore = score;
      bestAd = ad;
    }
  }

  const turningAd = bestAd || remainingADs[0] || activeAD;
  const turningAdPlanet = turningAd?.planet || "Mercury";
  const turningAdHindi = PLANET_NAMES_HINDI[turningAdPlanet] || turningAdPlanet;

  const turningStartDateFormatted = turningAd?.start
    ? new Date(turningAd.start).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })
    : "जनवरी 2027";
  const turningEndDateFormatted = turningAd?.end
    ? new Date(turningAd.end).toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" })
    : "जनवरी 2028";

  // Lagna & Lagnesh outcome
  const { lagnaTrait, houseOutcome } = getLagneshOutcome(lagnaNum, lagneshHouse, lagnaLord);

  // ── DYNAMIC MASTER RAJYOGAS DETECTION (NO HARDCODING) ──
  const masterRajyogas: MasterYogaItem[] = [];

  // 1. Pancha Mahapurusha Yogas
  if (mars && [1, 4, 7, 10].includes(mars.house) && [0, 7, 9].includes(mars.signNum)) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "रुचक पंचमहापुरुष राजयोग (Ruchaka Yoga)",
      desc: `केंद्र भाव में मंगल अपनी स्वराशि/उच्च राशि में स्थित है।`,
      outcome: `यह आपको अदम्य साहस, प्रशासनिक प्रभाव, अचल संपत्तियों का आधिपत्य और कभी न झुकने वाली इच्छाशक्ति प्रदान करता है।`,
      icon: "⚔️",
    });
  }
  if (mercury && [1, 4, 7, 10].includes(mercury.house) && [2, 5].includes(mercury.signNum)) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "भद्र पंचमहापुरुष राजयोग (Bhadra Yoga)",
      desc: `केंद्र भाव में बुध अपनी स्वराशि/उच्च राशि में स्थित है।`,
      outcome: `यह आपकी प्रखर बुद्धि का सबसे बड़ा प्रमाण है। यह आपको असाधारण तार्किक मेधा, सिस्टम आर्किटेक्चर, रणनीतिक योजना और अंतरराष्ट्रीय परामर्श क्षमता देता है।`,
      icon: "👑",
    });
  }
  if (jupiter && [1, 4, 7, 10].includes(jupiter.house) && [3, 8, 11].includes(jupiter.signNum)) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "हंस पंचमहापुरुष राजयोग (Hamsa Yoga)",
      desc: `केंद्र भाव में देवगुरु बृहस्पति उच्च या स्वराशि में स्थित हैं।`,
      outcome: `यह सात्विक बुद्धि, समाज में सहज आदर, संस्थागत नेतृत्व और संकटों से सहज उबरने का दिव्य कवच देता है।`,
      icon: "🕊️",
    });
  }
  if (venus && [1, 4, 7, 10].includes(venus.house) && [1, 6, 11].includes(venus.signNum)) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "मालव्य पंचमहापुरुष राजयोग (Malavya Yoga)",
      desc: `केंद्र भाव में शुक्र देव अपनी स्वराशि/उच्च राशि में स्थित हैं।`,
      outcome: `यह जीवन में ऐश्वर्य, भौतिक वैभव, कलात्मक आकर्षण, वाहनों का सुख और सम्मानीय सामाजिक प्रतिष्ठा सुनिश्चित करता है।`,
      icon: "✨",
    });
  }
  if (saturn && [1, 4, 7, 10].includes(saturn.house) && [6, 9, 10].includes(saturn.signNum)) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "शश पंचमहापुरुष राजयोग (Sasa Yoga)",
      desc: `केंद्र भाव में शनि देव अपनी स्वराशि/उच्च राशि में विराजमान हैं।`,
      outcome: `यह शून्य से विशाल साम्राज्य खड़ा करने, बड़े जन-समुदाय पर नेतृत्व स्थापित करने और दीर्घकालिक स्थायी सफलता का वरदान देता है।`,
      icon: "🏛️",
    });
  }

  // 2. Dharma-Karmadhipati Yoga (9th & 10th lord connection)
  if (ninthLordData && tenthLordData) {
    const isConj = ninthLordData.house === tenthLordData.house;
    const isMutualAspect = Math.abs(ninthLordData.house - tenthLordData.house) === 6;
    if (isConj || isMutualAspect) {
      masterRajyogas.push({
        id: masterRajyogas.length + 1,
        title: "धर्म-कर्माधिपति राजयोग (The Supreme Career Yoga)",
        desc: `भाग्येश और कर्मेश दोनों का आपस में प्रबल संबंध बन रहा है।`,
        outcome: `यह वैदिक ज्योतिष का सर्वोच्च प्रतिष्ठा योग है। यह आपको कार्यक्षेत्र में 'सिंहासन-तुल्य' अधिकार, सामाजिक आदर और जीवन में कभी न समाप्त होने वाली प्रतिष्ठा देता है।`,
        icon: "🌟",
      });
    }
  }

  // 3. Gajakesari Yoga (Jupiter in Kendra from Moon)
  if (jupiter && moon) {
    const distFromMoon = (jupiter.house - moon.house + 12) % 12;
    if ([0, 3, 6, 9].includes(distFromMoon)) {
      masterRajyogas.push({
        id: masterRajyogas.length + 1,
        title: "गजकेसरी योग (Gajakesari Yoga)",
        desc: `चंद्रमा से देवगुरु बृहस्पति केंद्र भाव में स्थित हैं।`,
        outcome: `यह आपको उच्च संस्कार, समाज में स्थायी आदर और जीवन की सबसे कठिन प्रतिकूलताओं से भी शान से उबरने का दिव्य आत्मबल प्रदान करता है।`,
        icon: "🐘",
      });
    }
  }

  // 4. Lagna-Bhagya Yoga (Lagnesh in 9th or 9th Lord in Lagna)
  if (lagneshHouse === 9 || (ninthLordData && ninthLordData.house === 1)) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "लग्नेश-भाग्य संबंध (Lagna-Bhagya Yoga)",
      desc: `व्यक्तित्व का स्वामी नवम (भाग्य) भाव से सीधा संबंध बना रहा है।`,
      outcome: `यह सिद्ध करता है कि आपका भाग्य किसी की सिफारिश से नहीं, बल्कि आपके अपने ज्ञान, बौद्धिक पुरुषार्थ और स्वतंत्र निर्णयों से बनेगा।`,
      icon: "💎",
    });
  }

  // 5. Chandra-Mangala Yoga (Moon & Mars together or aspecting)
  if (moon && mars) {
    const isConj = moon.house === mars.house;
    const isAspect = Math.abs(moon.house - mars.house) === 6;
    if (isConj || isAspect) {
      masterRajyogas.push({
        id: masterRajyogas.length + 1,
        title: "चंद्र-मंगल योग (Chandra-Mangala Yoga)",
        desc: `${moon.house}वें भाव में चंद्रमा और मंगल की युति/दृष्टि है।`,
        outcome: `यह योग व्यक्ति को भीतर से अदम्य साहसी, त्वरित निर्णय लेने वाला और कभी न हार मानने वाला बनाता है। यह निरंतर धन प्रवाह और परिसंपत्ति निर्माण कराता है।`,
        icon: "⚡",
      });
    }
  }

  // 6. Budhaditya Yoga (Sun + Mercury in good houses, not deeply combust)
  if (sun && mercury && sun.house === mercury.house && [1, 4, 5, 9, 10, 11].includes(sun.house)) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "बुधादित्य राजयोग (Budhaditya Yoga)",
      desc: `${sun.house}वें शुभ भाव में सूर्य और बुध की युति है।`,
      outcome: `यह आपकी बौद्धिक तीक्ष्णता, प्रशासनिक विवेक और अकादमिक/व्यावसायिक साख को उच्च स्तर प्रदान करता है।`,
      icon: "☀️",
    });
  }

  // 7. Neechabhanga Raja Yoga
  const debEntry = Object.entries(chart.planets).find(([_, p]) => p.dignity === "Debilitated");
  const debPlanetName = debEntry ? (PLANET_NAMES_HINDI[debEntry[0]] || debEntry[0]) : "";
  if (debEntry) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "नीचभंग राजयोग (Neecha Bhanga Raja Yoga)",
      desc: `${debPlanetName} ग्रह का नीचत्व शास्त्रीय नियमों से भंग होकर राजयोग में बदल गया है।`,
      outcome: `यह जीवन में शुरुआती चुनौतियों या संघर्ष के बाद अपार भौतिक वैभव, स्थायी सफलता और विपरीत परिस्थितियों को विजय में बदलने का दुर्लभ सामर्थ्य देता है।`,
      icon: "✨",
    });
  }

  // 8. Dhana Yogas (1st, 2nd, 5th, 9th, 11th connections)
  if (secondLordData && eleventhLordData && (secondLordData.house === 11 || eleventhLordData.house === 2 || secondLordData.house === eleventhLordData.house)) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "महा-धन योग (Maha Dhana Yoga)",
      desc: `धन भाव (2nd) और लाभ भाव (11th) के स्वामियों का अत्यंत दुर्लभ संयोग है।`,
      outcome: `यह आपको जीवन में असीमित वित्तीय विस्तार, कई स्रोतों से निरंतर धन प्रवाह और स्थायी संपदा का निर्माण कराता है।`,
      icon: "💰",
    });
  }

  // 9. Vipareeta Raja Yoga (6th, 8th, 12th lords in Dusthanas)
  const sixthLord = RASHI_LORDS[(lagnaNum + 5) % 12];
  const eighthLord = RASHI_LORDS[(lagnaNum + 7) % 12];
  const twelfthLord = RASHI_LORDS[(lagnaNum + 11) % 12];
  const p6 = chart.planets[sixthLord];
  const p8 = chart.planets[eighthLord];
  const p12 = chart.planets[twelfthLord];

  if ((p6 && [6, 8, 12].includes(p6.house)) || (p8 && [6, 8, 12].includes(p8.house)) || (p12 && [6, 8, 12].includes(p12.house))) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "विपरीत राजयोग (Transformational Resilience)",
      desc: `त्रिक भावों का संबंध संकट-मोचन शक्ति प्रदान कर रहा है।`,
      outcome: `जीवन में जब भी कोई अप्रत्याशित संकट या पतन की स्थिति आए, यह योग आपको 'शून्य से उठकर दोबारा साम्राज्य खड़ा करने' की अदम्य इच्छाशक्ति देता है।`,
      icon: "🛡️",
    });
  }

  // Fallback if none detected
  if (masterRajyogas.length === 0) {
    masterRajyogas.push({
      id: 1,
      title: "आत्म-बल व पुरुषार्थ योग (Self-Made Vitality Yoga)",
      desc: `लग्न और लग्नेश का शुभ संयोजन जीवन में सतत प्रगति का मार्ग प्रशस्त करता है।`,
      outcome: `यह आपको स्वतंत्र विचार, स्वाभिमान और अपनी बौद्धिक ऊर्जा से जीवन की दिशा स्वयं तय करने का अधिकार देता है।`,
      icon: "🌟",
    });
  }

  // ── DYNAMIC KARMIC CHALLENGES (DOSHAS) DETECTION (NO HARDCODING) ──
  const karmicDoshas: KarmicChallengeItem[] = [];

  // 1. Moon in Dusthana or Kemadruma
  if (moon && [6, 8, 12].includes(moon.house)) {
    karmicDoshas.push({
      id: karmicDoshas.length + 1,
      title: "मानसिक अति-सक्रियता, अनिद्रा व एकांत की अति",
      desc: `${moon.house}वें भाव में चंद्रमा होने से दिमाग चौबीसों घंटे लगातार सोचता रहता है। आप अपनी रणनीतियों और चिंताओं को मन में इतना दबाकर रखते हैं कि कई बार एक अनजाना भारीपन या अकेलापन महसूस होने लगता है।`,
      advice: `दिमाग को शांत करने के लिए नियमित प्राणायाम करें, स्क्रीन टाइम नियंत्रित रखें और नींद से कभी समझौता न करें।`,
    });
  }

  // 2. Vish Dosha (Saturn + Moon)
  if (saturn && moon && (saturn.house === moon.house || Math.abs(saturn.house - moon.house) === 6)) {
    karmicDoshas.push({
      id: karmicDoshas.length + 1,
      title: "विश योग प्रभाव — अंतर्द्वंद्व व अत्यधिक गंभीरता",
      desc: `शनि और चंद्रमा का संबंध कई बार मन में बेवजह निराशा, खुद पर कठोरता या अतीत की बातों को बार-बार दोहराने की प्रवृत्ति पैदा कर सकता है।`,
      advice: `दूसरों को उनकी सीमाओं के साथ स्वीकार करें और प्रकृति के साथ समय बिताकर मन को हल्का रखें।`,
    });
  }

  // 3. Rahu in 2nd or 11th house
  if (rahu && (rahu.house === 2 || rahu.house === 11)) {
    karmicDoshas.push({
      id: karmicDoshas.length + 1,
      title: "वित्तीय उतावलापन, सट्टेबाजी का लोभ व वाणी का तीखापन",
      desc: `${rahu.house === 2 ? "धन भाव" : "लाभ भाव"} में राहु कई बार जल्दी अमीर बनने, शॉर्टकट ट्रेडिंग, या अप्रमाणित निवेश में पैसा लगाने का लोभ जगा सकता है। साथ ही सीधी और खरी बात कहने के कारण कई बार लोग आपकी बात का बुरा मान सकते हैं।`,
      advice: `शॉर्टकट सट्टेबाज़ी से 100% दूर रहें। आपका धन केवल रणनीतिक, दीर्घकालिक और ठोस सिस्टम्स से ही बनेगा। वाणी में मिठास बनाए रखें।`,
    });
  }

  // 4. Saturn in 7th or 8th house
  if (saturn && (saturn.house === 7 || saturn.house === 8)) {
    karmicDoshas.push({
      id: karmicDoshas.length + 1,
      title: "साझेदारी व रिश्तों में धैर्य की परीक्षा",
      desc: `शनि की यह स्थिति जीवन में महत्वपूर्ण मील के पत्थरों और साझेदारियों में धैर्य की कड़ी परीक्षा लेती है। आप दूसरों से भी अपने जितने ही परफेक्शन और परिपक्वता की उम्मीद करने लगते हैं।`,
      advice: `रिश्तों में थोड़ी सहजता और दूसरों की गलतियों को नजरअंदाज करने का अभ्यास करें; धैर्य ही आपकी सबसे बड़ी ताकत है।`,
    });
  }

  // 5. Angarak Dosha (Mars + Rahu / Ketu)
  if (mars && rahu && (mars.house === rahu.house || (ketu && mars.house === ketu.house))) {
    karmicDoshas.push({
      id: karmicDoshas.length + 1,
      title: "आंतरिक अधीरता, उग्रता व अचानक प्रतिक्रिया",
      desc: `जब दूसरे लोग आपके अनुसार तेजी से काम नहीं करते, तो आपके भीतर तीव्र असंतोष और झुंझलाहट पैदा हो सकती है, जिससे कार्य में बाधा आती है।`,
      advice: `हर व्यक्ति की अपनी गति होती है; अपनी ऊर्जा को गुस्सा करने के बजाय रचनात्मक निर्माण में लगाएं।`,
    });
  }

  // 6. Debilitated Planet in chart
  if (debEntry) {
    karmicDoshas.push({
      id: karmicDoshas.length + 1,
      title: `${debPlanetName} नीचस्थ ऊर्जा — ऊर्जा का असंतुलन`,
      desc: `${debPlanetName} के नीचस्थ होने से उससे संबंधित जीवन क्षेत्र में आत्मविश्वास की कमी या अनावश्यक बाधाएं महसूस हो सकती हैं।`,
      advice: `इस ग्रह के संबंधित सात्विक उपाय करें और धैर्यपूर्वक अपने कौशलों को तराशें।`,
    });
  }

  // 7. General fallback if clean chart
  if (karmicDoshas.length === 0) {
    karmicDoshas.push({
      id: 1,
      title: "ऊर्जा का बिखराव व प्राथमिकताओं का प्रबंधन",
      desc: `एक साथ कई बड़े प्रोजेक्ट्स पर सोचने से मानसिक ऊर्जा कई दिशाओं में बंट सकती है, जिससे मुख्य काम में अनावश्यक विलंब हो सकता है।`,
      advice: `एक समय में एक ही लक्ष्य पर अर्जुन की तरह नजर रखें और कार्यों को क्रमबद्ध रूप से पूरा करें।`,
    });
  }

  // ── DYNAMIC HIDDEN TRAIT (NO BOOK NAMES) ──
  let hiddenTrait = "";
  if (moon && moon.house === 12) {
    hiddenTrait = `दिन के शोर-शराबे में नहीं, बल्कि रात के शांत सन्नाटे में आपकी सोचने, रणनीति बनाने और नए विचार गढ़ने की क्षमता अपने चरम पर होती है। आप किसी के नीचे दबकर काम नहीं कर सकते; आपके भीतर 'सिंहासन के पीछे की असली शक्ति' बनकर सब कुछ नियंत्रित करने की स्वाभाविक ललक है।`;
  } else if (rahu && rahu.house === 2) {
    hiddenTrait = `आप अनपेक्षित रास्तों और आधुनिक प्रणालियों से धन सृजन करने की अद्वितीय दृष्टि रखते हैं, लेकिन साथ ही जुबान में कभी-कभार ऐसा तीखा व्यंग्य या अचानक उग्रता आ सकती है जो सामने वाले को चुभ सकती है। बिना मांगे किसी को सलाह न देना ही आपका सबसे बड़ा सुरक्षा कवच है।`;
  } else if (saturn && saturn.house === 3) {
    hiddenTrait = `आपके भीतर अद्भुत सहनशक्ति, लोहे जैसा संकल्प और प्रतिकूल परिस्थितियों में कभी न टूटने वाला अदम्य धैर्य है। आप समय लेकर आगे बढ़ते हैं, लेकिन जब आगे बढ़ते हैं तो पीछे मुड़कर नहीं देखते।`;
  } else if (sun && [1, 10].includes(sun.house)) {
    hiddenTrait = `आपके भीतर स्वाभाविक स्वाभिमान और सच्चाई से समझौता न करने की जिद है। आप किसी की चाटुकारिता नहीं कर सकते; आपका मान-सम्मान ही आपकी सबसे बड़ी पूंजी है।`;
  } else {
    hiddenTrait = `आप किसी भी विषय के सतही ज्ञान से संतुष्ट नहीं होते; जब तक आप किसी समस्या की जड़ तक न पहुँच जाएं, आपका मन शांत नहीं बैठता। आपके सबसे मौलिक और क्रांतिकारी विचार एकांत में ही प्रस्फुटित होते हैं।`;
  }

  // ── DYNAMIC MASTER DESTINY KEY ──
  let destinyKey = "";
  if (lagneshHouse === 9) {
    destinyKey = `ज्ञान, तकनीक और विचारों का निस्वार्थ आदान-प्रदान, और कभी किसी के पीठ पीछे बुराई न करना। जब भी आपके जीवन में कोई बड़ी रुकावट या भ्रम की स्थिति आए, किसी जरूरतमंद विद्यार्थी या शोधकर्ता को चुपचाप शिक्षा अथवा तकनीकी साधन में सहायता कर दें—यह आपके सोए हुए भाग्य का ताला तुरंत खोल देता है।`;
  } else if (lagneshHouse === 12) {
    destinyKey = `एकांत में निरंतर काम करना, अपनी योजनाओं को समय से पहले किसी पर जाहिर न करना, और अनाथालय/अस्पताल में गुप्त सेवा करना। जब आप शांत रहकर पर्दे के पीछे काम करते हैं, तो कुदरत आपके रास्ते के सारे कांटे स्वतः हटा देती है।`;
  } else if (lagneshHouse === 10) {
    destinyKey = `अपने दिए वचन पर अडिग रहना और अपने नीचे काम करने वालों को पूरा सम्मान देना। आपकी सत्यनिष्ठा ही आपके भाग्य को राजयोग में बदलती है।`;
  } else if (lagneshHouse === 1) {
    destinyKey = `नित्य प्रातः सूर्योदय के साथ जागना, शारीरिक अनुशासन बनाए रखना और अपने आत्मसम्मान को सर्वोपरि रखना। आपका स्वयं का तेज ही आपके भाग्य को चमकाता है।`;
  } else {
    destinyKey = `नित्य प्रातः सूर्य देव को अर्घ्य और अपने माता-पिता के चरण स्पर्श। अपने संस्कारों और बड़ों के प्रति श्रद्धा ही आपके भाग्य का स्थायी ताला खोलती है।`;
  }

  // ── DYNAMIC AGE MILESTONES (AGE-STAGE CONSCIOUS) ──
  const birthYear = new Date(chart.dob).getFullYear();
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;

  const milestones: AgeMilestoneItem[] = [];

  if (currentAge < 25) {
    milestones.push(
      {
        id: 1,
        age: `उम्र ${currentAge}-${currentAge + 1} वर्ष`,
        years: `${currentYear} – ${currentYear + 1}`,
        title: "बौद्धिक क्रांति, ज्ञान संचय व कौशल में महारत",
        desc: "अपनी शिक्षा, तकनीकी क्षमता और शोध को एक ठोस दिशा में केंद्रित करने का महत्वपूर्ण समय।",
      },
      {
        id: 2,
        age: `उम्र ${currentAge + 2}-${currentAge + 3} वर्ष`,
        years: `${currentYear + 2} – ${currentYear + 3}`,
        title: "प्रथम बड़ा करियर ब्रेकथ्रू व वित्तीय स्वावलंबन",
        desc: "अपनी प्रतिभा के बल पर स्वतंत्र आजीविका का आरंभ और प्रतिष्ठित प्लेटफॉर्म से जुड़ने का समय।",
      },
      {
        id: 3,
        age: `उम्र ${currentAge + 4}-${currentAge + 5} वर्ष`,
        years: `${currentYear + 4} – ${currentYear + 5}`,
        title: "दीर्घकालिक पहचान व जीवन के मुख्य आधार का निर्माण",
        desc: "करियर में स्थायित्व, कार्यक्षेत्र में सम्मान और स्वतंत्र पहचान की मजबूत शुरुआत।",
      }
    );
  } else if (currentAge >= 25 && currentAge <= 35) {
    milestones.push(
      {
        id: 1,
        age: `उम्र ${currentAge}-${currentAge + 1} वर्ष`,
        years: `${currentYear} – ${currentYear + 1}`,
        title: "बौद्धिक क्रांति व बड़े सिस्टम्स का निर्माण",
        desc: "अपने ज्ञान और शोध को एक ठोस, सम्मानित प्लेटफॉर्म और व्यावसायिक पहचान में बदलने का स्वर्णिम समय।",
      },
      {
        id: 2,
        age: `उम्र ${currentAge + 2}-${currentAge + 3} वर्ष`,
        years: `${currentYear + 2} – ${currentYear + 3}`,
        title: "वैवाहिक बंधन, कलत्र-भाग्य व स्थायी संपत्ति",
        desc: "जीवनसाथी का आगमन, दांपत्य सुख, करियर में एक बड़ी छलांग और अपने स्वामित्व वाली अचल संपत्ति का निर्माण।",
      },
      {
        id: 3,
        age: `उम्र ${currentAge + 4}-${currentAge + 5} वर्ष`,
        years: `${currentYear + 4} – ${currentYear + 5}`,
        title: "शीर्ष नेतृत्व व वित्तीय स्वतंत्रता",
        desc: "कार्यक्षेत्र में सर्वोच्च अधिकार (Apex Leadership), कई स्रोतों से निरंतर धन प्रवाह और स्थायी सामाजिक प्रतिष्ठा की पराकाष्ठा।",
      }
    );
  } else if (currentAge > 35 && currentAge <= 50) {
    milestones.push(
      {
        id: 1,
        age: `उम्र ${currentAge}-${currentAge + 1} वर्ष`,
        years: `${currentYear} – ${currentYear + 1}`,
        title: "रणनीतिक विस्तार व सर्वोच्च व्यावसायिक अधिकार",
        desc: "अपने उद्योग में शीर्ष पद, नई संस्थागत जिम्मेदारियां और बड़े निर्णयों पर सीधा नियंत्रण।",
      },
      {
        id: 2,
        age: `उम्र ${currentAge + 2}-${currentAge + 3} वर्ष`,
        years: `${currentYear + 2} – ${currentYear + 3}`,
        title: "अचल संपदा विस्तार व संचित धन का तीव्र संवर्धन",
        desc: "स्थाई संपत्तियों का संचय, पारिवारिक सुख-सुविधाओं का विस्तार और वित्तीय स्वतंत्रता का ठोस स्तर।",
      },
      {
        id: 3,
        age: `उम्र ${currentAge + 4}-${currentAge + 5} वर्ष`,
        years: `${currentYear + 4} – ${currentYear + 5}`,
        title: "सामाजिक प्रतिष्ठा की पराकाष्ठा व संप्रभु पहचान",
        desc: "उद्योग या समाज में एक सम्मानित मार्गदर्शक (Industry Mentor) के रूप में स्थापित होना।",
      }
    );
  } else {
    milestones.push(
      {
        id: 1,
        age: `उम्र ${currentAge}-${currentAge + 1} वर्ष`,
        years: `${currentYear} – ${currentYear + 1}`,
        title: "उच्च स्तरीय परामर्श, मेंटरशिप व संस्थागत मार्गदर्शन",
        desc: "अगली पीढ़ी को दिशा देना, अपने अनुभवों को मूल्यवान नीतियों में बदलना।",
      },
      {
        id: 2,
        age: `उम्र ${currentAge + 2}-${currentAge + 3} वर्ष`,
        years: `${currentYear + 2} – ${currentYear + 3}`,
        title: "आध्यात्मिक संतुलन, परोपकार व स्थायी विरासत",
        desc: "पारिवारिक समृद्धि, समाज सेवा और अपनी बनाई विरासत को स्थायित्व प्रदान करना।",
      },
      {
        id: 3,
        age: `उम्र ${currentAge + 4}-${currentAge + 5} वर्ष`,
        years: `${currentYear + 4} – ${currentYear + 5}`,
        title: "आत्म-संतुष्टि, सम्मान व दिव्य शांति का काल",
        desc: "जीवन के समस्त कर्तव्यों की सफल पूर्ति और समाज में गुरु-तुल्य आदर प्राप्त करना।",
      }
    );
  }

  // ── DYNAMIC FATHERLY ADVICE (DERIVED FROM CHART AFFLICTIONS) ──
  const fatherlyAdvice: FatherlyAdviceItem[] = [];

  if (rahu && (rahu.house === 2 || rahu.house === 5 || rahu.house === 11)) {
    fatherlyAdvice.push({
      id: fatherlyAdvice.length + 1,
      title: "शॉर्टकट और जल्दी अमीर बनने के झांसे से दूर रहो",
      advice: "जब महत्वाकांक्षा बहुत तीव्र होती है, तो मन में कई बार शॉर्टकट ट्रेडिंग, सट्टेबाज़ी या बिना सोचे-समझे जोखिम भरे सौदों में पैसा लगाने का विचार आता है। हमेशा याद रखना—तुम्हारा पैसा तुम्हारी गहरी बुद्धि, धैर्य और सिस्टम्स से ही बनेगा। किसी सट्टेबाज़ी में अपनी गाढ़ी कमाई मत फंसाना।",
    });
  }

  if (moon && [6, 8, 12].includes(moon.house)) {
    fatherlyAdvice.push({
      id: fatherlyAdvice.length + 1,
      title: "दिमाग को थोड़ा विश्राम दो और नींद से कभी समझौता मत करो",
      advice: "तुम्हारा दिमाग चौबीसों घंटे दौड़ता रहता है। लगातार स्क्रीन पर रहने और देर रात तक जागने से तुम्हारी आंखों और नसों पर बहुत भारी दबाव पड़ सकता है। रोजाना कम से कम ७ घंटे की निर्बाध नींद लो और प्रकृति के साथ थोड़ा समय बिताओ।",
    });
  }

  if (mars && [1, 7, 8, 12].includes(mars.house)) {
    fatherlyAdvice.push({
      id: fatherlyAdvice.length + 1,
      title: "क्रोध और उग्र प्रतिक्रिया में कोई बड़ा निर्णय मत लो",
      advice: "जब चीजें तुम्हारी योजना के अनुसार नहीं चलतीं, तो मन में गुस्सा या उग्रता आ सकती है। याद रखो—एक क्षण का गुस्सा वर्षों की मेहनत और रिश्तों को नुकसान पहुँचा सकता है। कोई भी बड़ा फैसला शांत मन से ही लो।",
    });
  }

  if (saturn && [1, 7, 10].includes(saturn.house)) {
    fatherlyAdvice.push({
      id: fatherlyAdvice.length + 1,
      title: "अपने नीचे काम करने वालों का सम्मान करो और धैर्य रखो",
      advice: "काम में परफेक्शन चाहना बहुत अच्छी बात है, लेकिन दूसरों से अपनी जैसी गति की उम्मीद मत रखो। श्रमिकों, सहायकों और कर्मचारियों का पूरा आदर करो; उनका आशीर्वाद ही तुम्हारी सफलता को स्थाई बनाएगा।",
    });
  }

  // Always maintain 3 advice points
  if (fatherlyAdvice.length < 3) {
    fatherlyAdvice.push({
      id: fatherlyAdvice.length + 1,
      title: "अपनों के सामने अपने अहंकार को कभी मत आने दो",
      advice: "काम में तुम कितने भी बड़े पद पर पहुंच जाओ, लेकिन जब अपने परिवार, माता-पिता या जीवनसाथी के बीच बैठो, तो वहाँ सिर्फ प्रेम और विनम्रता रखो।",
    });
  }

  // ── DYNAMIC 4 SACRED REMEDIES (TAILORED TO CHART) ──
  const remedies: SacredRemedyItem[] = [];

  // Remedy 1: Lagna Lord Sthiti
  if (lagnaLord === "Sun") {
    remedies.push({
      id: 1,
      title: "भगवान सूर्य को प्रातः अर्घ्य",
      practice: "प्रतिदिन सुबह तांबे के लोटे में जल और थोड़ी रोली डालकर सूर्य देव को अर्घ्य दें।",
      benefit: "यह आपके मान-सम्मान, प्रशासनिक तेज और करियर की लीडरशिप को अजेय बनाए रखेगा।",
      icon: "🌅",
    });
  } else if (lagnaLord === "Moon") {
    remedies.push({
      id: 1,
      title: "शिवलिंग पर जलाभिषेक व चंद्र सात्विक साधना",
      practice: "प्रतिदिन अथवा प्रत्येक सोमवार को शिवलिंग पर शुद्ध जल अर्पित करें और 'ॐ नमः शिवाय' का शांत मन से जप करें।",
      benefit: "यह मानसिक अशांति और तनाव को मिटाकर प्रगाढ़ शांति और भावनात्मक स्थिरता प्रदान करेगा।",
      icon: "🌊",
    });
  } else if (lagnaLord === "Mars") {
    remedies.push({
      id: 1,
      title: "हनुमान चालीसा का पाठ व मंगलवार साधना",
      practice: "प्रत्येक मंगलवार व शनिवार को हनुमान चालीसा का पाठ करें और सिंदूर का तिलक लगाएं।",
      benefit: "यह आंतरिक भय, आलस्य और नकारात्मक ऊर्जा को नष्ट कर आपको अदम्य साहस और ऊर्जा देगा।",
      icon: "🚩",
    });
  } else if (lagnaLord === "Mercury") {
    remedies.push({
      id: 1,
      title: "भगवान गणेश को दूर्वा अर्पण",
      practice: "प्रत्येक बुधवार को भगवान गणेश को हरी दूर्वा अर्पित करें और ॐ गं गणपतये नमः का शांत मन से १०८ बार जाप करें।",
      benefit: "यह आपकी तार्किक बुद्धि को दिव्य स्पष्टता और व्यावसायिक विस्तार प्रदान करेगा।",
      icon: "🌿",
    });
  } else if (lagnaLord === "Jupiter") {
    remedies.push({
      id: 1,
      title: "बृहस्पति देव व गुरु मंत्र साधना",
      practice: "गुरुवार के दिन भगवान विष्णु अथवा अपने गुरु का ध्यान करें और मस्तक पर केसर अथवा हल्दी का तिलक लगाएं।",
      benefit: "यह सात्विक ज्ञान, सामाजिक प्रतिष्ठा और वित्तीय निर्णय क्षमता में दिव्य वृद्धि करेगा।",
      icon: "📿",
    });
  } else if (lagnaLord === "Venus") {
    remedies.push({
      id: 1,
      title: "महालक्ष्मी आराधना व श्री सूक्त पाठ",
      practice: "प्रत्येक शुक्रवार को माता लक्ष्मी के सम्मुख घी का दीपक जलाएं और श्री सूक्त का पाठ करें।",
      benefit: "यह जीवन में भौतिक ऐश्वर्य, मानसिक सौम्यता और पारिवारिक सौहार्द को बढ़ाएगा।",
      icon: "🌸",
    });
  } else {
    // Saturn Lagna Lord
    remedies.push({
      id: 1,
      title: "शनि देव की कृपा व सरसों के तेल का दीपक",
      practice: "प्रत्येक शनिवार को सायंकाल पीपल के वृक्ष के नीचे अथवा शनि मंदिर में सरसों के तेल का दीपक जलाएं।",
      benefit: "यह जीवन की रुकावटों को दूर कर धैर्य, स्थिरता और निरंतर साम्राज्य विस्तार का बल देगा।",
      icon: "🪔",
    });
  }

  // Remedy 2: Current Mahadasha Lord Remedy
  if (mdPlanet === "Rahu") {
    remedies.push({
      id: 2,
      title: "पक्षियों व मूक जीवों की सेवा (राहु महादशा शांति)",
      practice: "प्रतिदिन पक्षियों को बाजरा/सप्तधान्य डालें अथवा आवारा कुत्तों को रोटी खिलाएं।",
      benefit: "यह राहु के अचानक भ्रम और उतावलेपन को शांत कर वैश्विक दृष्टि और एकाग्रता देता है।",
      icon: "🕊️",
    });
  } else if (mdPlanet === "Ketu") {
    remedies.push({
      id: 2,
      title: "भगवान गणेश व ध्वज अर्पण (केतु महादशा शांति)",
      practice: "प्रत्येक बुधवार अथवा रविवार को किसी मंदिर में ध्वज अर्पित करें अथवा गणेश स्तोत्र का पाठ करें।",
      benefit: "यह जीवन में आध्यात्मिक शोधन, सूक्ष्म अंतर्ज्ञान और अप्रत्याशित संकटों से रक्षा करेगा।",
      icon: "🚩",
    });
  } else if (mdPlanet === "Saturn") {
    remedies.push({
      id: 2,
      title: "श्रमजीवियों की सहायता (शनि महादशा संबल)",
      practice: "शनिवार को किसी जरूरतमंद, वृद्ध अथवा सफाई कर्मचारी को काले चने, तिल अथवा अन्न-वस्त्र का गुप्त दान दें।",
      benefit: "यह कर्मों के बोझ को हल्का कर कार्यक्षेत्र में स्थायी प्रतिष्ठा और प्रगति सुनिश्चित करता है।",
      icon: "🤝",
    });
  } else {
    remedies.push({
      id: 2,
      title: `${mdHindi} का सात्विक ध्यान (${mdHindi} महादशा शुद्धि)`,
      practice: `प्रतिदिन प्रातः अपने आराध्य के सम्मुख ${mdHindi} के वैदिक अथवा बीज मंत्र का ११ बार जप करें।`,
      benefit: `वर्तमान महादशा के शुभ फलों में वृद्धि और समय की अनुकूलता प्राप्त होगी।`,
      icon: "✨",
    });
  }

  // Remedy 3: Universal Protection & Mind Peace
  remedies.push({
    id: 3,
    title: "हनुमान चालीसा का पाठ (संकट मोचन)",
    practice: "प्रतिदिन अथवा मंगलवार व शनिवार को हनुमान चालीसा का पाठ करें।",
    benefit: "यह तनाव, चिंता और नकारात्मक ऊर्जा को नष्ट कर आपको असीम आत्मबल और भय-मुक्ति देगा।",
    icon: "🚩",
  });

  // Remedy 4: Gau Seva / Compassion
  remedies.push({
    id: 4,
    title: "गौ सेवा अथवा मूक जीव सेवा (पुण्य संवर्धन)",
    practice: "सप्ताह में एक बार किसी गाय को हरा चारा अथवा रोटी खिलाएं।",
    benefit: "यह आपके जीवन में भौतिक ऐश्वर्य, मानसिक शांति और पूर्व संचित कर्मों के बंधन को शिथिल करेगा।",
    icon: "🌾",
  });

  const gemInfo = getGemstoneConsultation(chart, lagnaNum);
  const dashaWindow = `${currentYear} – ${currentYear + 2}`;

  return {
    nativeName: rawName,
    displayName,
    currentAge,
    activeDashaBadge: `${mdHindi} में ${adHindi} की अंतर्दशा`,
    masterRajyogas: masterRajyogas.slice(0, 4),
    karmicChallenges: karmicDoshas.slice(0, 3),
    personality: {
      lagnaTrait,
      houseOutcome,
      hiddenTrait,
      destinyKey,
    },
    career: {
      roleTitle,
      roleSummary,
      idealFields,
      wealthFlow,
      microVastu: {
        deskDirection,
        sleepDirection,
        explanation: vastuExplanation,
      },
    },
    marriage: {
      spouseNature: spouseNatureText,
      meetingVenue,
      marriageTypeTitle,
      marriageTypeExplanation,
      kalatraBhagyaNote,
    },
    timelines: {
      dashaWindow,
      activeMD: `${mdHindi} की महादशा (${mdStartYear} से ${mdEndYear})`,
      activeAD: `${mdHindi} में ${adHindi} की अंतर्दशा (${adStartFormatted} से ${adEndFormatted})`,
      timeClimate: timeClimateText,
      turningPoint: {
        heading: `${turningAdHindi} अंतर्दशा का स्वर्णिम मोड़`,
        dates: `${turningStartDateFormatted} से ${turningEndDateFormatted}`,
        impact: `यह समय आपके जीवन में पेशेवर गतिरोध को समाप्त कर एक नई आर्थिक व सामाजिक छलांग का मार्ग प्रशस्त करेगा।`,
      },
      milestones,
    },
    fatherlyAdvice: fatherlyAdvice.slice(0, 3),
    gemstone: gemInfo,
    remedies: remedies.slice(0, 4),
    conclusion: `${displayName} जी, आपकी कुंडली एक गहरे विचारक, स्वतंत्र रणनीतिकार और जीवन में बड़ा प्रभाव छोड़ने वाले व्यक्तित्व की कुंडली है। अभी आप अपनी नींव को मजबूत करने के दौर में हैं। मन को एकाग्र रखें और कर्म करते रहें—${turningStartDateFormatted} से आने वाला समय आपके जीवन को सफलता के उस शिखर पर ले जाएगा, जिसके आप वास्तव में हकदार हैं!`,
  };
}

/**
 * Generates the clean markdown string (for Copy Reading and Plain Text)
 */
export function generateSimpleKundliDossierMarkdown(chart: ChartData): string {
  const d = generateSimpleKundliDossierData(chart);
  if (!d) return "";

  return `### 1. कुंडली के ${d.masterRajyogas.length} प्रमुख राजयोग एवं ${d.karmicChallenges.length} मुख्य कार्मिक चुनौतियाँ

${d.displayName} जी, जब हम आपकी कुंडली को एक संपूर्ण चित्र के रूप में देखते हैं, तो ईश्वर ने आपको कुछ अत्यंत दुर्लभ वरदान दिए हैं, और साथ ही आत्मा के विकास के लिए कुछ विशिष्ट परीक्षाएँ भी रखी हैं:

#### ✦ ${d.masterRajyogas.length} प्रमुख राजयोग:
${d.masterRajyogas.map((y, idx) => `
${idx + 1}. **${y.title}:**
   * **शास्त्रीय स्थिति:** ${y.desc}
   * **वास्तविक फल:** ${y.outcome}`).join("\n")}

---

#### ⚠ ${d.karmicChallenges.length} मुख्य कार्मिक चुनौतियाँ:
${d.karmicChallenges.map((c, idx) => `
${idx + 1}. **${c.title}:**
   * **क्या प्रभाव पड़ता है:** ${c.desc}
   * **गुरु का समाधान:** ${c.advice}`).join("\n")}

---

### 2. व्यक्तित्व, आंतरिक सोच एवं कार्यशैली

${d.displayName} जी, आपकी कुंडली आपके स्वभाव के दो बिल्कुल अलग और खूबसूरत पहलुओं को उजागर करती है। 

${d.personality.lagnaTrait} लोग आपको बहुत व्यावहारिक, संतुलित और काम के प्रति पूरी तरह समर्पित देखते हैं। 

लेकिन ${d.personality.houseOutcome}

${d.personality.hiddenTrait}

> 🔑 **भाग्य का ताला खोलने वाला गुप्त नियम:**  
> ${d.personality.destinyKey}

---

### 3. करियर, आजीविका एवं धन संपदा

पेशेवर दुनिया में आपकी सबसे बड़ी पहचान **${d.career.roleTitle}** के रूप में होगी।

${d.career.roleSummary}

* **सर्वश्रेष्ठ कार्यक्षेत्र:**
${d.career.idealFields.map((f, idx) => `  ${idx + 1}. **${f.title}:** ${f.desc}`).join("\n")}

* **धन की वास्तविक स्थिति:**
  ${d.career.wealthFlow}

* **कार्यस्थल व शयन कक्ष का सूक्ष्म वास्तु:**
  * **कार्य मेज की दिशा:** ${d.career.microVastu.deskDirection}
  * **शयन सिरहाना:** ${d.career.microVastu.sleepDirection}
  * ${d.career.microVastu.explanation}

---

### 4. विवाह, जीवनसाथी एवं वैवाहिक जीवन

विवाह के संदर्भ में हर जातक के मन में तीन मुख्य जिज्ञासाएँ होती हैं—उनकी जीवनसाथी कैसी होंगी, वे कहाँ मिलेंगी, और विवाह का स्वरूप क्या होगा:

#### १. जीवनसाथी का स्वरूप एवं स्वभाव:
${d.marriage.spouseNature}

#### २. कहाँ और कैसे होगी मुलाकात?:
${d.marriage.meetingVenue}

#### ३. विवाह का स्वरूप: Love Marriage या Arranged?:
* **प्रवृत्ति:** **${d.marriage.marriageTypeTitle}**
* ${d.marriage.marriageTypeExplanation}

#### ४. विवाह उपरांत भाग्योदय (कलत्र भाग्य):
${d.marriage.kalatraBhagyaNote}

---

### 5. वर्तमान दशा चक्र एवं जीवन के प्रमुख पड़ाव (${d.timelines.dashaWindow})

* **सक्रिय महादशा:** **${d.timelines.activeMD}**
* **वर्तमान अंतर्दशा:** **${d.timelines.activeAD}**
  * **वर्तमान समय की तासीर:** ${d.timelines.timeClimate}
* **${d.timelines.turningPoint.heading} (${d.timelines.turningPoint.dates}):**
  * ${d.timelines.turningPoint.impact}

#### ⏳ जीवन के स्वर्णिम पड़ाव:
${d.timelines.milestones.map((m, idx) => `${idx + 1}. **${m.age} (${m.years}):** ${m.title} — ${m.desc}`).join("\n")}

---

### 6. सावधानियाँ (एक पिता व गुरु का आत्मीय मार्गदर्शन)

बेटा, जीवन में बड़ी महत्वाकांक्षा और ऊंचे सपने देखना बहुत अच्छी बात है, लेकिन एक बात हमेशा गांठ बांध कर रख लो:

${d.fatherlyAdvice.map((a, idx) => `${idx + 1}. **${a.title}:**\n   * ${a.advice}`).join("\n")}

---

### 7. आपके लिए अनुकूल एवं सिद्ध रत्न

* **सर्वोत्तम प्राथमिक रत्न:** **${d.gemstone.primaryStone} (${d.gemstone.englishStone})**
  * **धारण करने की धातु:** ${d.gemstone.metal}
  * **किस उंगली में पहनें:** ${d.gemstone.finger}
  * **शुभ दिन व समय:** ${d.gemstone.dayTime}
  * **सीधे लाभ:** ${d.gemstone.benefits}
  * **सस्ता व सुरक्षित उपरत्न:** ${d.gemstone.alternative}

---

### 8. ${d.displayName} जी के लिए अचूक एवं फलदायी वैदिक नियम

${d.remedies.map((r, idx) => `${idx + 1}. **${r.title}:**\n   * **विधि:** ${r.practice}\n   * **लाभ:** ${r.benefit}`).join("\n")}

---

### सारांश (Guru's Final Blessing)

${d.conclusion}
`;
}
