// src/lib/astro-engine/simple-kundli-dossier-engine.ts
// ============================================================================
// AstroLife — Authentic Conversational Shastric Dossier Engine
// Pure human-tone guru/fatherly consultation guidance.
// Absolutely zero technical jargon, no book names, no engine names, no raw tables.
// Features:
// 1. 3 Master Yogas + 2 Real Karmic Challenges
// 2. Personality & Hidden Traits + Master Destiny Key
// 3. Career & Wealth Landscape + Work Desk & Sleep Micro-Vastu
// 4. Marriage & Life Partner (Spouse Nature, Where & How you meet, Love vs Arranged)
// 5. Current Time Analysis + 3 Key Age Milestones
// 6. Savdhaniyan (Protective Father/Guru Guidance)
// 7. Favourable Gemstone Consultation
// 8. Daily Sacred Remedies
// 9. Inspiring Conclusion
// ============================================================================

import type { ChartData, PlanetData } from "./calculations";
import { NAKSHATRA_DATA } from "./nakshatra-data";

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
    3: `आपके व्यक्तित्व का स्वामी पराक्रम भाव में होने से आपका गहरा जुड़ाव अपनी बाहुबल व बौद्धिक मेहनत से भाग्य निर्माण, कोडिंग/राइटिंग/मीडिया, और निरंतर उद्यम से रहता है। आप कभी भाग्य के भरोसे नहीं बैठते, बल्कि अपने पुरुषार्थ से नए रास्ते बनाते हैं।`,
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
 * Returns Favourable Gemstone Consultation
 */
function getGemstoneConsultation(lagnaNum: number, lagneshHouse: number): {
  primaryStone: string;
  englishStone: string;
  finger: string;
  metal: string;
  dayTime: string;
  benefits: string;
  alternative: string;
} {
  const GEM_MAP: Record<number, {
    primaryStone: string;
    englishStone: string;
    finger: string;
    metal: string;
    dayTime: string;
    benefits: string;
    alternative: string;
  }> = {
    0: {
      primaryStone: "त्रिकोण लाल मूंगा",
      englishStone: "Red Coral (Moonga)",
      finger: "अनामिका (Ring Finger)",
      metal: "तांबा अथवा स्वर्ण",
      dayTime: "मंगलवार प्रातःकाल (सूर्य उदय के समय)",
      benefits: "साहस, त्वरित निर्णय क्षमता, प्रशासनिक प्रभाव और शारीरिक ऊर्जा में तीव्र वृद्धि।",
      alternative: "लाल कार्नेलियन (Carnelian)",
    },
    1: {
      primaryStone: "सफेद पुखराज / ओपल",
      englishStone: "White Sapphire / Natural Opal",
      finger: "मध्यमा अथवा कनिष्ठिका",
      metal: "चांदी अथवा सफेद सोना",
      dayTime: "शुक्रवार प्रातःकाल",
      benefits: "मानसिक सौम्यता, पारिवारिक सुख, भौतिक ऐश्वर्य और रचनात्मक प्रचुरता।",
      alternative: "जरकन (Zircon)",
    },
    2: {
      primaryStone: "शुद्ध जाम्बियन पन्ना",
      englishStone: "Emerald (Panna)",
      finger: "कनिष्ठिका (Little Finger)",
      metal: "पंचधातु, स्वर्ण अथवा चांदी",
      dayTime: "बुधवार प्रातःकाल (शुक्ल पक्ष)",
      benefits: "तीक्ष्ण तार्किक मेधा, कोडिंग/डेटा प्रबंधन में निपुणता, वाणी का प्रभाव और व्यापारिक उन्नति।",
      alternative: "पेरिडॉट अथवा हरा टूर्मलाइन (Peridot)",
    },
    3: {
      primaryStone: "प्राकृतिक सच्चा मोती",
      englishStone: "Natural Pearl (Moti)",
      finger: "कनिष्ठिका (Little Finger)",
      metal: "शुद्ध चांदी",
      dayTime: "सोमवार प्रातःकाल",
      benefits: "मानसिक शांति, तनाव व अनिद्रा से मुक्ति, भावनात्मक संतुलन और निर्णय स्थिरता।",
      alternative: "मूनस्टोन (Moonstone)",
    },
    4: {
      primaryStone: "माणिक्य",
      englishStone: "Ruby (Manikya)",
      finger: "अनामिका (Ring Finger)",
      metal: "तांबा अथवा स्वर्ण",
      dayTime: "रविवार प्रातःकाल",
      benefits: "सामाजिक प्रतिष्ठा, नेतृत्व क्षमता, प्रशासनिक अधिकार और अदम्य आत्म-विश्वास।",
      alternative: "लाल गार्नेट (Red Garnet)",
    },
    5: {
      primaryStone: "शुद्ध जाम्बियन पन्ना",
      englishStone: "Emerald (Panna)",
      finger: "कनिष्ठिका (Little Finger)",
      metal: "पंचधातु, स्वर्ण अथवा चांदी",
      dayTime: "बुधवार प्रातःकाल (शुक्ल पक्ष)",
      benefits: "असाधारण तार्किक मेधा, रणनीतिक दूरदर्शिता, व्यापारिक विस्तार और अत्यधिक सोचने से राहत।",
      alternative: "पेरिडॉट अथवा हरा टूर्मलाइन (Peridot / Green Tourmaline)",
    },
    6: {
      primaryStone: "सफेद पुखराज अथवा ओपल",
      englishStone: "White Sapphire / Opal",
      finger: "मध्यमा अथवा कनिष्ठिका",
      metal: "चांदी अथवा प्लेटिनम",
      dayTime: "शुक्रवार प्रातःकाल",
      benefits: "संबंधों में मधुरता, आकर्षण, वित्तीय अवसर और मानसिक संतुलन।",
      alternative: "जरकन (Zircon)",
    },
    7: {
      primaryStone: "त्रिकोण लाल मूंगा",
      englishStone: "Red Coral (Moonga)",
      finger: "अनामिका (Ring Finger)",
      metal: "तांबा अथवा स्वर्ण",
      dayTime: "मंगलवार प्रातःकाल",
      benefits: "अटूट इच्छाशक्ति, भय-मुक्ति, गूढ़ शोध और अचल संपत्ति का निर्माण।",
      alternative: "लाल कार्नेलियन (Carnelian)",
    },
    8: {
      primaryStone: "पीला पुखराज",
      englishStone: "Yellow Sapphire (Pukhraj)",
      finger: "तर्जनी (Index Finger)",
      metal: "शुद्ध स्वर्ण अथवा पीतल",
      dayTime: "गुरुवार प्रातःकाल",
      benefits: "उच्च ज्ञान, ईश्वरीय कृपा, आध्यात्मिक उन्नति, समाज में आदर और वित्तीय संपन्नता।",
      alternative: "सुनहला (Citrine / Topaz)",
    },
    9: {
      primaryStone: "जाम्बियन पन्ना अथवा नीलम (परीक्षणोपरांत)",
      englishStone: "Emerald / Blue Sapphire",
      finger: "कनिष्ठिका अथवा मध्यमा",
      metal: "पंचधातु अथवा चांदी",
      dayTime: "बुधवार प्रातःकाल (पन्ना) / शनिवार सायंकाल",
      benefits: "अनुशासन, दीर्घकालिक साम्राज्य निर्माण, स्थिरता और कर्म में निष्ठा।",
      alternative: "पेरिडॉट अथवा अमेथिस्ट (Amethyst)",
    },
    10: {
      primaryStone: "जाम्बियन पन्ना अथवा नीलम",
      englishStone: "Emerald / Blue Sapphire",
      finger: "कनिष्ठिका अथवा मध्यमा",
      metal: "पंचधातु अथवा चांदी",
      dayTime: "बुधवार प्रातःकाल (पन्ना)",
      benefits: "लीक से हटकर नवाचार, बड़े नेटवर्क्स से लाभ और तंत्रिका तंत्र को शांति।",
      alternative: "पेरिडॉट (Peridot)",
    },
    11: {
      primaryStone: "पीला पुखराज",
      englishStone: "Yellow Sapphire (Pukhraj)",
      finger: "तर्जनी (Index Finger)",
      metal: "शुद्ध स्वर्ण अथवा पीतल",
      dayTime: "गुरुवार प्रातःकाल",
      benefits: "आत्मिक ज्ञान, सहज अंतर्ज्ञान (Intuition), मानसिक शांति और समाज में आदर।",
      alternative: "सुनहला (Citrine)",
    },
  };

  return GEM_MAP[lagnaNum] || GEM_MAP[5];
}

/**
 * Returns structured consultation data for clean React component rendering
 */
export function generateSimpleKundliDossierData(chart: ChartData): SimpleKundliDossierData {
  const rawName = chart.name || "जातक";
  const displayName = rawName.includes("(") ? rawName.split("(")[0].trim() : rawName;

  const lagnaNum = chart.lagnaNum ?? 0;
  const lagnaLord = RASHI_LORDS[lagnaNum];
  const lagneshData = chart.planets[lagnaLord];
  const lagneshHouse = lagneshData?.house ?? 1;

  const { soulPlanet, careerPlanet, spousePlanet } = getSecretKarakas(chart.planets);

  const moon = chart.planets.Moon;
  const moonHouse = moon ? moon.house : 1;
  const moonNakshatra = moon ? moon.nakshatra : "—";

  // 7th house & lord
  const seventhSignNum = (lagnaNum + 6) % 12;
  const seventhLord = RASHI_LORDS[seventhSignNum];
  const seventhLordData = chart.planets[seventhLord];
  const seventhLordHouse = seventhLordData ? seventhLordData.house : 7;

  // 5th house & lord
  const fifthSignNum = (lagnaNum + 4) % 12;
  const fifthLord = RASHI_LORDS[fifthSignNum];
  const fifthLordData = chart.planets[fifthLord];

  // Love vs Arranged calculation
  const has5th7thConnection =
    (fifthLordData && fifthLordData.house === 7) ||
    (seventhLordData && seventhLordData.house === 5) ||
    (fifthLordData && seventhLordData && fifthLordData.house === seventhLordData.house);

  const rahu = chart.planets.Rahu;
  const venus = chart.planets.Venus;
  const mars = chart.planets.Mars;
  const saturn = chart.planets.Saturn;
  const mercury = chart.planets.Mercury;
  const jupiter = chart.planets.Jupiter;

  const isRahuInLoveHouse = rahu && (rahu.house === 5 || rahu.house === 7);
  const isVenusMarsConnected = venus && mars && (venus.house === mars.house || Math.abs(venus.house - mars.house) === 6);

  let marriageTypeTitle = "";
  let marriageTypeExplanation = "";

  if (has5th7thConnection || isRahuInLoveHouse) {
    marriageTypeTitle = "प्रबल प्रेम-विवाह एवं स्वयं की पसंद (Love Marriage / Self-Choice)";
    marriageTypeExplanation = `आपकी कुंडली में प्रेम, व्यक्तिगत पसंद और विवाह के भावों के बीच सीधा और अटूट तालमेल बन रहा है। यह स्पष्ट संकेत देता है कि आपका विवाह किसी परंपरागत सामाजिक दबाव में नहीं, बल्कि आपसी परिचय, बौद्धिक तालमेल और गहरी आत्मीयता के आधार पर होगा। यदि परिवार शुरुआत में कुछ समय भी ले, तो अंततः दोनों परिवारों की पूर्ण सहमति, आशीर्वाद और मान-सम्मान के साथ यह विवाह परिणय में बदलेगा।`;
  } else if (isVenusMarsConnected) {
    marriageTypeTitle = "गहरी मित्रता के बाद परिणय (Friendship-Turned-Marriage)";
    marriageTypeExplanation = `आपकी कुंडली दर्शाती है कि विवाह से पूर्व आपकी जीवनसाथी के साथ एक मजबूत मानसिक खिंचाव और मित्रता का दौर रहेगा। यह विवाह दोनों पक्षों की परस्पर सहमति, खुले विचारों और गहरे आकर्षण से संपन्न होगा।`;
  } else {
    marriageTypeTitle = "समान विचारधारा व आत्मीयता आधारित विवाह (Cultured Alliance with Mutual Resonance)";
    marriageTypeExplanation = `यह विवाह भले ही परिवार या किसी विश्वसनीय सूत्र के माध्यम से आगे बढ़े, लेकिन अंतिम निर्णय पूरी तरह आपकी और जीवनसाथी की व्यक्तिगत समझ और बौद्धिक सहमति पर ही टिकेगा। विवाह के बाद दोनों के बीच एक आदर्श मित्रवत संबंध स्थापित होगा।`;
  }

  // Where & How will you meet your spouse?
  let meetingVenue = "";
  const spouseSignifierHouse = chart.planets[spousePlanet]?.house || seventhLordHouse;

  if ([3, 9, 12].includes(spouseSignifierHouse) || [3, 9, 12].includes(seventhLordHouse)) {
    meetingVenue = `किसी यात्रा (Travel), उच्च शिक्षा संस्थान (University / College), सेमिनार, वर्कशॉप, डिजिटल/ऑनलाइन प्लेटफॉर्म या किसी दूरस्थ/विदेशी परियोजना (Distant / Global Context) के दौरान आपकी मुलाकात होने के सबसे प्रबल योग हैं। यह किसी ऐसे परिवेश में होगा जहाँ ज्ञान, विचार-विमर्श या स्वतंत्र कार्य हो रहा हो।`;
  } else if ([10, 11].includes(spouseSignifierHouse) || [10, 11].includes(seventhLordHouse)) {
    meetingVenue = `आपके कार्यक्षेत्र (Workplace), कॉरपोरेट प्रोजेक्ट्स, प्रोफेशनल नेटवर्किंग इवेंट्स, उद्योग से जुड़ी बैठकों या किसी बड़े मित्र समूह के माध्यम से मुलाकात होगी। आप दोनों का पहला संपर्क किसी साझा पेशेवर लक्ष्य या काम के सिलसिले में हो सकता है।`;
  } else if ([1, 5, 7].includes(spouseSignifierHouse) || [1, 5, 7].includes(seventhLordHouse)) {
    meetingVenue = `साझा बौद्धिक रुचियों (Shared Passions), रचनात्मक कार्यक्रमों, किसी कॉमन फ्रेंड के माध्यम से या सीधे स्वयं की व्यक्तिगत पहल (Direct Personal Encounter) से मुलाकात होगी। बातचीत की शुरुआत बहुत सहज और विचारों के आदान-प्रदान से होगी।`;
  } else {
    meetingVenue = `पारिवारिक समारोह (Family Gathering), किसी प्रतिष्ठित परिचित के माध्यम से, या अपने सांस्कृतिक व सामाजिक परिवेश में औपचारिक परिचय होगा, जो बहुत जल्दी एक गहन बौद्धिक और भावनात्मक संवाद में बदल जाएगा।`;
  }

  // Spouse Nature
  let spouseNatureText = "";
  if (spousePlanet === "Saturn") {
    spouseNatureText = `आपकी जीवनसाथी स्वभाव से अत्यधिक संजीदा, कर्तव्यनिष्ठ, परिपक्व, व्यावहारिक और जमीन से जुड़ी हुई (Grounded) होंगी। वे दिखावे या फिजूल बातों से दूर रहने वाली, बहुत स्वाभिमानी और आपके जीवन में एक मजबूत भावनात्मक व पारिवारिक आधार बनेंगी।`;
  } else if (spousePlanet === "Mercury") {
    spouseNatureText = `आपकी जीवनसाथी असाधारण रूप से तीक्ष्ण बुद्धि वाली, सुशिक्षित, कामकाजी (Working/Professional), बहुत अच्छी संवादक और व्यावहारिक तार्किक सोच वाली होंगी। उनकी हास्य-विनोद की समझ और त्वरित निर्णय क्षमता आपको बहुत प्रभावित करेगी।`;
  } else if (spousePlanet === "Jupiter") {
    spouseNatureText = `आपकी जीवनसाथी उच्च संस्कारों वाली, विदुषी, नैतिक मूल्यों से ओतप्रोत, धैर्यवान और परिवार में स्वाभाविक आदर पाने वाली होंगी। वे आपके लिए एक सच्ची मार्गदर्शक सिद्ध होंगी।`;
  } else if (spousePlanet === "Sun") {
    spouseNatureText = `आपकी जीवनसाथी बहुत स्वाभिमानी, अच्छे प्रतिष्ठित परिवार से संबंध रखने वाली, प्रशासनिक स्वभाव और अपने सिद्धांतों पर दृढ़ रहने वाली होंगी।`;
  } else if (spousePlanet === "Venus") {
    spouseNatureText = `आपकी जीवनसाथी सुरुचिपूर्ण, सौम्य, कला-प्रिय, सुरुचिपूर्ण वस्त्र व साज-सज्जा की समझ रखने वाली और आपके जीवन में भौतिक व दांपत्य ऐश्वर्य लाने वाली होंगी।`;
  } else if (spousePlanet === "Mars") {
    spouseNatureText = `आपकी जीवनसाथी अत्यधिक ऊर्जावान, स्पष्टवादी, निडर, सक्रिय और परिवार के सम्मान के लिए डटकर खड़े रहने वाली साहसी व्यक्तित्व की होंगी।`;
  } else {
    spouseNatureText = `आपकी जीवनसाथी अत्यंत संवेदनशील, ममतामयी, शांत स्वभाव और परिवार को भावनात्मक संबल देने वाली होंगी।`;
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
    if (ad.planet === RASHI_LORDS[(lagnaNum + 9) % 12]) score += 5;
    if (ad.planet === RASHI_LORDS[(lagnaNum + 8) % 12]) score += 4;
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

  // ── 3 MASTER RAJYOGAS ──
  const masterRajyogas: MasterYogaItem[] = [];

  if (mercury && [1, 4, 7, 10].includes(mercury.house) && (mercury.signNum === 5 || mercury.signNum === 2)) {
    masterRajyogas.push({
      id: 1,
      title: "भद्र पंचमहापुरुष राजयोग (Bhadra Yoga)",
      desc: `दशम/केंद्र भाव में बुध अपनी स्वराशि/उच्च राशि में स्थित है।`,
      outcome: `यह आपकी प्रखर बुद्धि का सबसे बड़ा प्रमाण है। यह आपको असाधारण तार्किक मेधा, रणनीति निर्माण (Strategic Planning), डेटा, मैनेजमेंट और अंतरराष्ट्रीय स्तर की परामर्श क्षमता प्रदान करता है।`,
      icon: "👑",
    });
  }

  const ninthLord = RASHI_LORDS[(lagnaNum + 8) % 12];
  const tenthLord = RASHI_LORDS[(lagnaNum + 9) % 12];
  const p9 = chart.planets[ninthLord];
  const p10 = chart.planets[tenthLord];
  if (p9 && p10 && p9.house === p10.house) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "धर्म-कर्माधिपति राजयोग (The Supreme Career Yoga)",
      desc: `भाग्येश और कर्मेश दोनों एक साथ केंद्र/त्रिकोण में युति बना रहे हैं।`,
      outcome: `यह क्लासिकल ज्योतिष का सबसे बड़ा प्रतिष्ठा योग है। यह आपको समाज व पेशेवर दुनिया में उच्च पद, सत्ता-समान सम्मान, कॉरपोरेट नेतृत्व और 'सिंहासन-तुल्य' अधिकार प्रदान करता है।`,
      icon: "🌟",
    });
  }

  if (lagneshHouse === 9) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "लग्नेश-भाग्य संबंध (Lagna-Bhagya Yoga)",
      desc: `व्यक्तित्व का स्वामी स्वयं नवम (भाग्य) भाव में विराजमान है।`,
      outcome: `यह सिद्ध करता है कि आपका भाग्य किसी की सिफारिश या विरासत से नहीं, बल्कि आपके अपने ज्ञान, बौद्धिक पुरुषार्थ और स्वतंत्र निर्णयों से बनेगा। आप अपने भाग्य के स्वयं विधाता हैं।`,
      icon: "💎",
    });
  }

  if (moon && mars && moon.house === mars.house) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "चंद्र-मंगल योग (Chandra-Mangala Yoga)",
      desc: `${moon.house}वें भाव में चंद्रमा और मंगल की युति है।`,
      outcome: `यह योग व्यक्ति को भीतर से अदम्य साहसी, त्वरित निर्णय लेने वाला और कभी न हार मानने वाला बनाता है। ${moon.house === 12 ? "12वें भाव में होने से यह विदेशी प्रोजेक्ट्स, बैकएंड टेक्नोलॉजी और पर्दे के पीछे से बड़े आर्थिक साम्राज्य के संचालन का वरदान देता है।" : "यह निरंतर धन प्रवाह और परिसंपत्ति निर्माण कराता है।" }`,
      icon: "⚡",
    });
  }

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

  if (venus && venus.signNum === 5 && mercury && mercury.signNum === 5) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "नीचभंग राजयोग (Neecha Bhanga Raja Yoga)",
      desc: `नीचस्थ ग्रह का नीचत्व उच्च के ग्रह के प्रभाव से भंग होकर राजयोग में बदल गया है।`,
      outcome: `यह जीवन में शुरुआती चुनौतियों या संघर्ष के बाद अपार भौतिक वैभव, स्थायी सफलता और विपरीत परिस्थितियों को विजय में बदलने का दुर्लभ सामर्थ्य देता है।`,
      icon: "✨",
    });
  }

  if (masterRajyogas.length < 3) {
    masterRajyogas.push({
      id: masterRajyogas.length + 1,
      title: "विपरीत राजयोग (Transformational Resilience)",
      desc: `त्रिक भावों का संबंध संकट-मोचन शक्ति प्रदान कर रहा है।`,
      outcome: `जीवन में जब भी कोई अप्रत्याशित संकट या पतन की स्थिति आए, यह योग आपको 'शून्य से उठकर दोबारा साम्राज्य खड़ा करने' की अदम्य इच्छाशक्ति देता है।`,
      icon: "🛡️",
    });
  }

  // ── 2 KARMIC CHALLENGES (DOSHAS) ──
  const karmicDoshas: KarmicChallengeItem[] = [];

  if (moon && moon.house === 12) {
    karmicDoshas.push({
      id: 1,
      title: "मानसिक अति-सक्रियता, अनिद्रा व एकांत की अति",
      desc: `12वें भाव में चंद्रमा के होने से आपका दिमाग 24 घंटे लगातार चलता रहता है। आप अपनी रणनीतियों और चिंताओं को मन में इतना दबाकर रखते हैं कि कई बार एक अनजाना भारीपन या अकेलापन महसूस होने लगता है।`,
      advice: `दिमाग को शांत करने के लिए नियमित प्राणायाम करें, स्क्रीन टाइम नियंत्रित रखें और नींद से कभी समझौता न करें।`,
    });
  } else if (saturn && (saturn.house === 7 || saturn.house === 8)) {
    karmicDoshas.push({
      id: 1,
      title: "विलंब व संबंधों में अत्यधिक गंभीरता",
      desc: `शनि की यह स्थिति जीवन में महत्वपूर्ण मील के पत्थरों और साझेदारियों में धैर्य की कड़ी परीक्षा लेती है। आप दूसरों से भी अपने जितने ही परफेक्शन और परिपक्वता की उम्मीद करने लगते हैं।`,
      advice: `रिश्तों में थोड़ी सहजता और दूसरों की गलतियों को नजरअंदाज करने का अभ्यास करें; धैर्य ही आपकी सबसे बड़ी ताकत है।`,
    });
  } else {
    karmicDoshas.push({
      id: 1,
      title: "ऊर्जा का बिखराव व एकाग्रता की चुनौती",
      desc: `एक साथ कई बड़े प्रोजेक्ट्स पर सोचने से मानसिक ऊर्जा कई दिशाओं में बंट सकती है, जिससे मुख्य काम में अनावश्यक विलंब हो सकता है।`,
      advice: `एक समय में एक ही लक्ष्य पर अर्जुन की तरह नजर रखें।`,
    });
  }

  if (rahu && (rahu.house === 2 || rahu.house === 11)) {
    karmicDoshas.push({
      id: 2,
      title: "वित्तीय उतावलापन व वाणी का तीखापन",
      desc: `${rahu.house === 2 ? "धन भाव" : "लाभ भाव"} में राहु कई बार जल्दी अमीर बनने, शॉर्टकट ट्रेडिंग, या अप्रमाणित निवेश में पैसा लगाने का लोभ जगा सकता है। साथ ही सीधी और खरी बात कहने के कारण कई बार लोग आपकी बात का बुरा मान सकते हैं।`,
      advice: `शॉर्टकट सट्टेबाज़ी से 100% दूर रहें। आपका धन केवल रणनीतिक, दीर्घकालिक और ठोस सिस्टम्स से ही बनेगा। वाणी में मिठास बनाए रखें।`,
    });
  } else if (mars && (mars.house === 1 || mars.house === 12 || mars.house === 7)) {
    karmicDoshas.push({
      id: 2,
      title: "आंतरिक अधीरता व उग्र प्रतिक्रिया",
      desc: `जब दूसरे लोग आपके अनुसार तेजी से काम नहीं करते, तो आपके भीतर तीव्र असंतोष और झुंझलाहट पैदा हो सकती है।`,
      advice: `हर व्यक्ति की अपनी गति होती है; अपनी ऊर्जा को गुस्सा करने के बजाय रचनात्मक निर्माण में लगाएं।`,
    });
  } else {
    karmicDoshas.push({
      id: 2,
      title: "भावनात्मक संवेदनशीलता व संकोच",
      desc: `दूसरों पर जल्दी भरोसा न कर पाना और अपनी कमजोरियों को छुपाने के चक्कर में अत्यधिक सतर्क रहना।`,
      advice: `विश्वसनीय मित्रों और परिजनों के सामने अपना दिल खोलने से घबराएं नहीं।`,
    });
  }

  // Hidden Traits (no book name!)
  let hiddenTrait = "";
  if (moon && moon.house === 12) {
    hiddenTrait = `दिन के शोर-शराबे में नहीं, बल्कि रात के शांत सन्नाटे में आपकी सोचने, रणनीति बनाने और नए विचार गढ़ने की क्षमता अपने चरम पर होती है। आप किसी के नीचे दबकर काम नहीं कर सकते; आपके भीतर 'सिंहासन के पीछे की असली शक्ति' बनकर सब कुछ नियंत्रित करने की स्वाभाविक ललक है।`;
  } else if (rahu && rahu.house === 2) {
    hiddenTrait = `आप अनपेक्षित रास्तों और आधुनिक प्रणालियों से धन सृजन करने की अद्वितीय दृष्टि रखते हैं, लेकिन साथ ही जुबान में कभी-कभार ऐसा तीखा व्यंग्य या अचानक उग्रता आ सकती है जो सामने वाले को चुभ सकती है। बिना मांगे किसी को सलाह न देना ही आपका सबसे बड़ा सुरक्षा कवच है।`;
  } else if (saturn && saturn.house === 3) {
    hiddenTrait = `आपके भीतर अद्भुत सहनशक्ति, लोहे जैसा संकल्प और प्रतिकूल परिस्थितियों में कभी न टूटने वाला अदम्य धैर्य है। आप समय लेकर आगे बढ़ते हैं, लेकिन जब आगे बढ़ते हैं तो पीछे मुड़कर नहीं देखते।`;
  } else {
    hiddenTrait = `आप किसी भी विषय के सतही ज्ञान से संतुष्ट नहीं होते; जब तक आप किसी समस्या की जड़ तक न पहुँच जाएं, आपका मन शांत नहीं बैठता। आपके सबसे मौलिक और क्रांतिकारी विचार एकांत में ही प्रस्फुटित होते हैं।`;
  }

  // Master Destiny Key
  let destinyKey = "";
  if (lagneshHouse === 9) {
    destinyKey = `ज्ञान, तकनीक और विचारों का निस्वार्थ आदान-प्रदान, और कभी किसी के पीठ पीछे बुराई न करना। जब भी आपके जीवन में कोई बड़ी रुकावट या भ्रम की स्थिति आए, किसी जरूरतमंद विद्यार्थी या शोधकर्ता को चुपचाप शिक्षा अथवा तकनीकी साधन में सहायता कर दें—यह आपके सोए हुए भाग्य का ताला तुरंत खोल देता है।`;
  } else if (lagneshHouse === 12) {
    destinyKey = `एकांत में निरंतर काम करना, अपनी योजनाओं को समय से पहले किसी पर जाहिर न करना, और अनाथालय/अस्पताल में गुप्त सेवा करना। जब आप शांत रहकर पर्दे के पीछे काम करते हैं, तो कुदरत आपके रास्ते के सारे कांटे स्वतः हटा देती है।`;
  } else if (lagneshHouse === 10) {
    destinyKey = `अपने दिए वचन पर अडिग रहना और अपने नीचे काम करने वालों को पूरा सम्मान देना। आपकी सत्यनिष्ठा ही आपके भाग्य को राजयोग में बदलती है।`;
  } else {
    destinyKey = `नित्य प्रातः सूर्य देव को अर्घ्य और अपने माता-पिता के चरण स्पर्श। अपने संस्कारों और बड़ों के प्रति श्रद्धा ही आपके भाग्य का स्थायी ताला खोलती है।`;
  }

  // Micro Vastu
  const deskDirection = "उत्तर (North) अथवा पूर्व (East)";
  const sleepDirection = "दक्षिण (South) अथवा पूर्व (East)";
  const vastuExplanation = `काम की मेज (Work Desk) पर बैठते समय आपका मुख हमेशा उत्तर अथवा पूर्व दिशा की ओर होना चाहिए। यह दिशा आपकी तार्किक स्पष्टता और धन प्रवाह को बढ़ाती है। वहीं विश्राम करते समय आपका सिर हमेशा दक्षिण अथवा पूर्व में होना चाहिए, जिससे गहरा मानसिक विश्राम मिले और दिमाग का 24 घंटे दौड़ना शांत हो।`;

  // Age Milestones
  const birthYear = new Date(chart.dob).getFullYear();
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear;

  const milestones: AgeMilestoneItem[] = [
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
    },
  ];

  // Ideal Fields
  const idealFields: IdealFieldItem[] = [
    {
      id: 1,
      title: "टेक्नोलॉजी, डेटा आर्किटेक्चर एवं सॉफ्टवेयर",
      desc: "कोडिंग, जटिल डेटाबेस प्रणालियों के निर्माण, एआई व तकनीकी समाधानों में आपकी मेधा अंतरराष्ट्रीय स्तर की सिद्ध होगी।",
      icon: "💻",
    },
    {
      id: 2,
      title: "उच्च स्तरीय कंसल्टेंसी, कॉरपोरेट रणनीति एवं फिनटेक",
      desc: "बड़े निर्णयों में मार्गदर्शन देना, संस्थागत प्रणालियों को स्ट्रीमलाइन करना और रणनीतिक वित्तीय नियोजन।",
      icon: "📊",
    },
    {
      id: 3,
      title: "ग्लोबल प्रोजेक्ट्स व विदेशी कंपनियाँ (Global MNCs)",
      desc: "दूरस्थ परियोजनाओं (Remote Projects), अंतरराष्ट्रीय क्लाइंट्स और स्वतंत्र डिजिटल प्लेटफॉर्म्स से सर्वाधिक लाभ।",
      icon: "🌐",
    },
  ];

  // Fatherly Advice
  const fatherlyAdvice: FatherlyAdviceItem[] = [
    {
      id: 1,
      title: "शॉर्टकट और जल्दी अमीर बनने के झांसे से दूर रहो",
      advice: "जब महत्वाकांक्षा बहुत तीव्र होती है, तो मन में कई बार शॉर्टकट ट्रेडिंग, क्रिप्टो या बिना सोचे-समझे जोखिम भरे सौदों में पैसा लगाने का विचार आता है। हमेशा याद रखना—तुम्हारा पैसा तुम्हारी गहरी बुद्धि, धैर्य और सिस्टम्स से ही बनेगा। किसी सट्टेबाज़ी में अपनी गाढ़ी कमाई मत फंसाना।",
    },
    {
      id: 2,
      title: "दिमाग को थोड़ा विश्राम दो और नींद से समझौता मत करो",
      advice: "तुम्हारा दिमाग चौबीसों घंटे दौड़ता रहता है। लगातार स्क्रीन पर रहने और देर रात तक जागने से तुम्हारी आंखों और नसों पर बहुत भारी दबाव पड़ सकता है। रोजाना कम से कम ७ घंटे की निर्बाध नींद लो और प्रकृति के साथ थोड़ा समय बिताओ।",
    },
    {
      id: 3,
      title: "अपनों के सामने अपने अहंकार को कभी मत आने दो",
      advice: "काम में तुम कितने भी बड़े पद पर पहुंच जाओ, लेकिन जब अपने परिवार, माता-पिता या जीवनसाथी के बीच बैठो, तो वहाँ सिर्फ प्रेम और विनम्रता रखो।",
    },
  ];

  // Sacred Remedies
  const remedies: SacredRemedyItem[] = [
    {
      id: 1,
      title: "भगवान सूर्य को प्रातः अर्घ्य",
      practice: "प्रतिदिन सुबह तांबे के लोटे में जल और थोड़ी रोली डालकर सूर्य देव को अर्घ्य दें।",
      benefit: "यह आपके मान-सम्मान, प्रशासनिक तेज और करियर की लीडरशिप को अजेय बनाए रखेगा।",
      icon: "🌅",
    },
    {
      id: 2,
      title: "भगवान गणेश को दूर्वा अर्पण",
      practice: "प्रत्येक बुधवार को भगवान गणेश को हरी दूर्वा अर्पित करें और ॐ गं गणपतये नमः का शांत मन से १०८ बार जाप करें।",
      benefit: "यह आपकी तार्किक बुद्धि को दिव्य स्पष्टता और व्यावसायिक विस्तार प्रदान करेगा।",
      icon: "🌿",
    },
    {
      id: 3,
      title: "हनुमान चालीसा का पाठ",
      practice: "मंगलवार व शनिवार को हनुमान चालीसा का पाठ करें।",
      benefit: "यह तनाव, चिंता और नकारात्मक ऊर्जा को नष्ट कर आपको असीम आत्मबल देगा।",
      icon: "🚩",
    },
    {
      id: 4,
      title: "गौ सेवा या जीव सेवा",
      practice: "शुक्रवार के दिन किसी गाय को हरा चारा अथवा पक्षियों को जल-अन्न दें।",
      benefit: "यह आपके जीवन में भौतिक ऐश्वर्य, मानसिक शांति और पारिवारिक सौहार्द को बढ़ाएगा।",
      icon: "🌾",
    },
  ];

  const gemInfo = getGemstoneConsultation(lagnaNum, lagneshHouse);
  const dashaWindow = `${currentYear} – ${currentYear + 2}`;

  return {
    nativeName: rawName,
    displayName,
    currentAge,
    activeDashaBadge: `${mdHindi} में ${adHindi} की अंतर्दशा`,
    masterRajyogas: masterRajyogas.slice(0, 3),
    karmicChallenges: karmicDoshas.slice(0, 2),
    personality: {
      lagnaTrait,
      houseOutcome,
      hiddenTrait,
      destinyKey,
    },
    career: {
      roleTitle: "एक सिस्टम निर्माता (System Architect), रणनीतिक सलाहकार और स्वतंत्र विश्लेषक",
      idealFields,
      wealthFlow: "आपकी कुंडली दर्शाती है कि आपकी आय किसी साधारण 9-से-5 की सीमित तनख्वाह तक सीमित नहीं रह सकती। आपके पास एक से अधिक स्रोतों (Multi-stream Revenue) से धन आने के स्पष्ट योग हैं। जीवन में समय-समय पर अप्रत्याशित वित्तीय उछाल (Windfall Gains) और डिजिटल/भौतिक परिसंपत्तियों का ठोस निर्माण होगा। बस याद रखें—आपका धन मेहनत और रणनीति से टिकेगा, किसी शॉर्टकट से नहीं।",
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
      kalatraBhagyaNote: "विवाह के बाद आपके जीवन में एक बहुत बड़ा सकारात्मक मोड़ आएगा, जिसे 'कलत्र-भाग्य योग' कहा जाता है—यानी जीवनसाथी के आने के बाद आपके करियर और सामाजिक मान-प्रतिष्ठा में तीव्र उछाल आएगा।",
    },
    timelines: {
      dashaWindow,
      activeMD: `${mdHindi} की महादशा (${mdStartYear} से ${mdEndYear})`,
      activeAD: `${mdHindi} में ${adHindi} की अंतर्दशा (${adStartFormatted} से ${adEndFormatted})`,
      timeClimate: timeClimateText,
      turningPoint: {
        heading: `🚀 आगामी सबसे बड़ा मोड़ — "${mdHindi} में ${turningAdHindi} की अंतर्दशा"`,
        dates: `${turningStartDateFormatted} से ${turningEndDateFormatted}`,
        impact: `यह आपके जीवन का एक निर्णायक 'गेम-चेंजर' समय सिद्ध होगा! इस अवधि में आपके करियर में बड़ा प्रमोशन, मनचाही कंपनी या बड़े प्रोजेक्ट की शुरुआत, और वित्तीय स्थिति में एक ऐतिहासिक छलांग लगने के प्रबलतम योग हैं।`,
      },
      milestones,
    },
    fatherlyAdvice,
    gemstone: gemInfo,
    remedies,
    conclusion: `${displayName} जी, आपकी कुंडली एक गहरे विचारक, स्वतंत्र रणनीतिकार और जीवन में बड़ा प्रभाव छोड़ने वाले व्यक्तित्व की कुंडली है। अभी आप अपनी नींव को मजबूत करने के दौर में हैं। मन को एकाग्र रखें और कर्म करते रहें—${turningStartDateFormatted} से आने वाला समय आपके जीवन को सफलता के उस शिखर पर ले जाएगा, जिसके आप वास्तव में हकदार हैं!`,
  };
}

/**
 * Generates the clean markdown string (for Copy Reading and Plain Text)
 */
export function generateSimpleKundliDossierMarkdown(chart: ChartData): string {
  const d = generateSimpleKundliDossierData(chart);
  if (!d) return "";

  return `### 1. कुंडली के ३ सर्वोच्च राजयोग एवं २ मुख्य कार्मिक चुनौतियाँ

${d.displayName} जी, जब हम आपकी कुंडली को एक संपूर्ण चित्र के रूप में देखते हैं, तो ईश्वर ने आपको कुछ अत्यंत दुर्लभ वरदान दिए हैं, और साथ ही आत्मा के विकास के लिए दो विशिष्ट परीक्षाएँ भी रखी हैं:

#### ✦ ३ सर्वोच्च राजयोग:
${d.masterRajyogas.map((y) => `
${y.id}. **${y.title}:**
   * **शास्त्रीय स्थिति:** ${y.desc}
   * **वास्तविक फल:** ${y.outcome}`).join("\n")}

---

#### ⚠ २ मुख्य कार्मिक चुनौतियाँ:
${d.karmicChallenges.map((c) => `
${c.id}. **${c.title}:**
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

* **सर्वश्रेष्ठ कार्यक्षेत्र:**
${d.career.idealFields.map((f) => `  ${f.id}. **${f.title}:** ${f.desc}`).join("\n")}

* **धन की वास्तविक स्थिति:**
  ${d.career.wealthFlow}

* **कार्यस्थल व शयन कक्ष का सूक्ष्म वास्तु:**
  * ${d.career.microVastu.explanation}

---

### 4. विवाह, जीवनसाथी एवं वैवाहिक जीवन

विवाह के संदर्भ में हर जातक के मन में तीन मुख्य जिज्ञासाएँ होती हैं—उनकी जीवनसाथी कैसी होंगी, वे कहाँ मिलेंगी, और विवाह का स्वरूप क्या होगा:

#### १. जीवनसाथी का स्वरूप एवं स्वभाव:
${d.marriage.spouseNature} 
वे बहुत सुलझी हुई, शिक्षित और कामकाजी (Working/Professional) होंगी। ${d.marriage.kalatraBhagyaNote}

#### २. कहाँ और कैसे होगी मुलाकात?:
${d.marriage.meetingVenue}

#### ३. विवाह का स्वरूप: Love Marriage या Arranged?:
* **प्रवृत्ति:** **${d.marriage.marriageTypeTitle}**
* ${d.marriage.marriageTypeExplanation}

---

### 5. वर्तमान दशा चक्र एवं जीवन के ३ बड़े मोड़ (${d.timelines.dashaWindow})

* **सक्रिय महादशा:** **${d.timelines.activeMD}**
* **वर्तमान अंतर्दशा:** **${d.timelines.activeAD}**
  * **वर्तमान समय की तासीर:** ${d.timelines.timeClimate}
* **${d.timelines.turningPoint.heading} (${d.timelines.turningPoint.dates}):**
  * ${d.timelines.turningPoint.impact}

#### ⏳ जीवन के ३ स्वर्णिम पड़ाव:
${d.timelines.milestones.map((m) => `${m.id}. **${m.age} (${m.years}):** ${m.title} — ${m.desc}`).join("\n")}

---

### 6. सावधानियाँ (एक पिता व गुरु का आत्मीय मार्गदर्शन)

बेटा, जीवन में बड़ी महत्वाकांक्षा और ऊंचे सपने देखना बहुत अच्छी बात है, लेकिन एक बात हमेशा गांठ बांध कर रख लो:

${d.fatherlyAdvice.map((a) => `${a.id}. **${a.title}:**\n   * ${a.advice}`).join("\n")}

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

${d.remedies.map((r) => `${r.id}. **${r.title}:**\n   * **विधि:** ${r.practice}\n   * **लाभ:** ${r.benefit}`).join("\n")}

---

### सारांश (Guru's Final Blessing)

${d.conclusion}
`;
}
