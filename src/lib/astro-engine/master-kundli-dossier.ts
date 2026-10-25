// src/lib/astro-engine/master-kundli-dossier.ts
// ============================================================================
// ASTROLIFE MASTER KUNDLI DOSSIER ENGINE (7 SHAT-SHATANGA PILLARS)
// 100% Fully Dynamic, Comprehensive & Human Novelistic Storytelling Narrative
// Synthesized for ANY unique birth chart (Lagna, Moon, Nakshatra, Dashas, Gochar)
// ============================================================================

import type { ChartData } from "./calculations";
import { detectYogas } from "./yogas";
import { buildJaiminiChart } from "./jaimini";
import { calculateTransitRippleData } from "./transit-ripple/transit-calculator";

export interface StorytellingChapter {
  pillarNum: number;
  pillarTitle: string;
  chapterSubtitle: string;
  icon: string;
  paragraphs: string[];
  keyHighlight?: string;
}

export interface MasterDossierResult {
  birthProfile: {
    name: string;
    dobFormatted: string;
    tob: string;
    city: string;
    coordinates: string;
    lagnaRashi: string;
    lagnaDegreeFormatted: string;
    lagnaLord: string;
    lagnaLordPlacement: string;
    moonRashi: string;
    moonDegreeFormatted: string;
    nakshatraName: string;
    nakshatraPada: number;
    nakshatraLord: string;
    aradhyaDeity: string;
    sunRashi: string;
    sunHouse: number;
    sunDignity: string;
  };

  planetaryMatrix: Array<{
    planet: string;
    hindiName: string;
    sign: string;
    house: number;
    houseName: string;
    degreeFormatted: string;
    dignity: string;
    dignityColor: string;
    nakshatra: string;
    pada: number;
    retrograde: boolean;
    combust: boolean;
    charaKaraka: string;
    specialNotes: string;
  }>;

  keyYogas: Array<{
    name: string;
    sanskritName?: string;
    type: string;
    description: string;
    shastricSignificance: string;
  }>;

  karmicVulnerabilities: Array<{
    title: string;
    category: "Mental" | "Speech/Wealth" | "Partnership" | "Health" | "Ancestral";
    description: string;
    mitigationGuidance: string;
  }>;

  dashaTimeline: {
    activeMahadasha: string;
    activeMahadashaSpan: string;
    activeAntardasha: string;
    activeAntardashaSpan: string;
    currentPhaseInsight: string;
    upcomingGoldenPhaseTitle: string;
    upcomingGoldenPhaseWindow: string;
    upcomingGoldenPhaseInsight: string;
    allAntardashas: Array<{
      planet: string;
      startDate: string;
      endDate: string;
      isActive: boolean;
    }>;
  };

  remedies: {
    gemstoneVerdict: {
      strictProhibition: string;
      prohibitionReason: string;
      recommendedGems: string[];
      wearingInstructions: string;
    };
    metalRemedies: Array<{
      metal: string;
      item: string;
      purpose: string;
      method: string;
    }>;
    spiritualPractices: Array<{
      deity: string;
      practice: string;
      timing: string;
      benefit: string;
    }>;
    conductDiscipline: string[];
  };

  gocharAnalysis: {
    scanDate: string;
    transitSummary: string;
    sadeSatiStatus: {
      isActive: boolean;
      phase: string;
      description: string;
    };
    majorPlanets: Array<{
      planet: string;
      transitSign: string;
      transitHouseFromLagna: number;
      transitHouseFromMoon: number;
      nakshatra: string;
      retrograde: boolean;
      impactTheme: string;
      actionableGuidance: string;
    }>;
  };

  storytellingChapters: StorytellingChapter[];
}

// ── REFERENCE CONSTANTS & HELPERS ─────────────────────────────────────────────
const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

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

const PLANET_NAMES_HINDI: Record<string, string> = {
  Sun: "सूर्य देव (Sun)",
  Moon: "चंद्र देव (Moon)",
  Mars: "मंगल देव (Mars)",
  Mercury: "बुध देव (Mercury)",
  Jupiter: "देवगुरु बृहस्पति (Jupiter)",
  Venus: "शुक्र देव (Venus)",
  Saturn: "शनि देव (Saturn)",
  Rahu: "राहु देव (Rahu)",
  Ketu: "केतु देव (Ketu)",
};

const HOUSE_NAMES_HINDI: Record<number, string> = {
  1: "प्रथम भाव (तनु / लग्न)",
  2: "द्वितीय भाव (धन व कुटुंब)",
  3: "तृतीय भाव (सहज व पराक्रम)",
  4: "चतुर्थ भाव (सुख व मातृ)",
  5: "पंचम भाव (सुत व बुद्धि)",
  6: "षष्ठ भाव (रिपु व रोग)",
  7: "सप्तम भाव (जाया व दांपत्य)",
  8: "अष्टम भाव (आयु व रंध्र)",
  9: "नवम भाव (धर्म व भाग्य)",
  10: "दशम भाव (कर्म व मान)",
  11: "एकादश भाव (आय व लाभ)",
  12: "द्वादश भाव (व्यय व मोक्ष)",
};

const NAKSHATRA_DEITIES: Record<string, { deity: string; lord: string }> = {
  Ashwini: { deity: "अश्विनी कुमार (Ashwini Kumaras)", lord: "केतु (Ketu)" },
  Bharani: { deity: "यमराज (Lord Yama)", lord: "शुक्र (Venus)" },
  Krittika: { deity: "अग्नि देव (Agni Dev)", lord: "सूर्य (Sun)" },
  Rohini: { deity: "ब्रह्मा / प्रजापति (Prajapati)", lord: "चंद्रमा (Moon)" },
  Mrigashira: { deity: "सोम / चंद्र (Soma)", lord: "मंगल (Mars)" },
  Ardra: { deity: "रुद्र / भगवान शिव (Lord Rudra)", lord: "राहु (Rahu)" },
  Punarvasu: { deity: "अदिति (Mata Aditi)", lord: "गुरु (Jupiter)" },
  Pushya: { deity: "बृहस्पति (Brihaspati)", lord: "शनि (Saturn)" },
  Ashlesha: { deity: "सर्प / नाग (Sarpas)", lord: "बुध (Mercury)" },
  Magha: { deity: "पितर (Pitris / Ancestors)", lord: "केतु (Ketu)" },
  "Purva Phalguni": { deity: "भग / सूर्य (Bhaga)", lord: "शुक्र (Venus)" },
  "Uttara Phalguni": { deity: "अर्यमा / सूर्य (Aryaman)", lord: "सूर्य (Sun)" },
  Hasta: { deity: "सविता / सूर्य (Savitr)", lord: "चंद्रमा (Moon)" },
  Chitra: { deity: "त्वष्टा / विश्वकर्मा (Vishwakarma)", lord: "मंगल (Mars)" },
  Swati: { deity: "वायु देव (Vayu Dev)", lord: "राहु (Rahu)" },
  Vishakha: { deity: "इंद्राग्नि (Indra & Agni)", lord: "गुरु (Jupiter)" },
  Anuradha: { deity: "मित्र / सूर्य (Mitra)", lord: "शनि (Saturn)" },
  Jyeshtha: { deity: "इंद्र देव (Lord Indra)", lord: "बुध (Mercury)" },
  Mula: { deity: "निरृति / महाकाली (Nirriti)", lord: "केतु (Ketu)" },
  "Purva Ashadha": { deity: "अपां / जल देव (Apas / Varuna)", lord: "शुक्र (Venus)" },
  "Uttara Ashadha": { deity: "विश्वेदेव (Vishvedevas)", lord: "सूर्य (Sun)" },
  Shravana: { deity: "भगवान विष्णु (Lord Vishnu)", lord: "चंद्रमा (Moon)" },
  Dhanishta: { deity: "अष्ट वसु (Ashta Vasus)", lord: "मंगल (Mars)" },
  Shatabhisha: { deity: "वरुण देव (Varuna)", lord: "राहु (Rahu)" },
  "Purva Bhadrapada": { deity: "अजैकपाद / रुद्र (Aja Ekapada)", lord: "गुरु (Jupiter)" },
  "Uttara Bhadrapada": { deity: "अहिर्बुध्न्य / शिव (Ahirbudhnya)", lord: "शनि (Saturn)" },
  Revati: { deity: "पूषा / सूर्य (Pushan)", lord: "बुध (Mercury)" },
};

// ── LAGNA PROFILES ────────────────────────────────────────────────────────────
const LAGNA_PROFILES_HINDI: Record<string, {
  element: string;
  modality: string;
  lensTitle: string;
  lensDescription: string;
  coreTemperament: string;
}> = {
  Aries: {
    element: "अग्नि तत्व (Fire)",
    modality: "चर (Cardinal)",
    lensTitle: "साहसी अग्रदूत, निर्भीक नेतृत्व और त्वरित क्रियान्वयन",
    lensDescription: "मंगल देव द्वारा शासित यह लग्न जीवन को एक रणभूमि और संभावनाओं के महासागर की तरह देखता है। आप उन लोगों में से हैं जो विचार आने पर रुकते नहीं, बल्कि तुरंत मैदान में उतरकर उसे साकार करते हैं। आपके भीतर जन्मजात स्वाभिमान, नेतृत्व और नई राहें बनाने का प्रचण्ड साहस है।",
    coreTemperament: "स्वाभिमानी, ऊर्जावान, स्वतंत्र और किसी के दबाव में न झुकने वाली आत्मा।"
  },
  Taurus: {
    element: "पृथ्वी तत्व (Earth)",
    modality: "स्थिर (Fixed)",
    lensTitle: "धैर्यवान निर्माता, सौंदर्य का पारखी और आर्थिक स्थायित्व",
    lensDescription: "शुक्र देव द्वारा शासित यह लग्न जीवन को स्थिरता, गुणवत्ता और दीर्घकालिक मूल्य के चश्मे से देखता है। आप क्षणिक उत्साह में बहने के बजाय एक मजबूत नींव तैयार करते हैं। आपके पास उत्कृष्ट सौंदर्यबोध, वित्तीय समझ और किसी भी काम को पूर्णता तक पहुंचाने का धैर्य है।",
    coreTemperament: "व्यावहारिक, सुदृढ़, विश्वसनीय और सौंदर्य व समृद्धि की साधना करने वाला स्वभाव।"
  },
  Gemini: {
    element: "वायु तत्व (Air)",
    modality: "द्विस्वभाव (Dual)",
    lensTitle: "बौद्धिक संवाहक, बहुमुखी प्रतिभा और त्वरित संचार",
    lensDescription: "बुध देव द्वारा शासित यह लग्न जिज्ञासु, चंचल और ज्ञान के प्रति असीम रूप से आकर्षित होता है। आप विचारों को जोड़ने, तार्किक मंथन करने और जटिल जानकारियों को सहजता से अभिव्यक्त करने में माहिर हैं। आपका मस्तिष्क सदैव नए पैटर्न्स और संभावनाओं की खोज में रहता है।",
    coreTemperament: "कुशाग्र, तार्किक, संचार-प्रवीण और विविध विषयों में पारंगत होने वाली बुद्धि।"
  },
  Cancer: {
    element: "जल तत्व (Water)",
    modality: "चर (Cardinal)",
    lensTitle: "सहज अंतर्ज्ञान, गहरी संवेदनशीलता और पोषण का केंद्र",
    lensDescription: "चंद्रमा द्वारा शासित यह लग्न जीवन को भावनाओं, सुरक्षा और अंतर्मन की गहराइयों से समझता है। आपके पास दूसरों की अनकही बातें भांपने की एक विलक्षण छठी इंद्री (Intuition) है। बाहर से आप सुरक्षात्मक खोल में रह सकते हैं, लेकिन भीतर से आपकी संवेदनाएं अत्यंत समृद्ध और प्रगाढ़ हैं।",
    coreTemperament: "सहजज्ञानी, संरक्षक, भावुक और परिवार व आंतरिक शांति के प्रति पूर्ण समर्पित।"
  },
  Leo: {
    element: "अग्नि तत्व (Fire)",
    modality: "स्थिर (Fixed)",
    lensTitle: "जन्मजात राजसी गरिमा, स्वाभिमान और कुलदीपक तेज",
    lensDescription: "सूर्य देव द्वारा शासित यह लग्न जीवन को गरिमा, स्वावलंबन और मर्यादा की दृष्टि से देखता है। आप किसी की कृपा या अहसान के नीचे दबना बर्दाश्त नहीं कर सकते। आपका व्यक्तित्व स्वाभाविक रूप से आदर और ध्यान आकर्षित करता है, और आप अपने कार्यक्षेत्र में सर्वोच्च मानक स्थापित करना चाहते हैं।",
    coreTemperament: "राजा जैसी मर्यादा, अडिग आत्म-सम्मान, उदारता और स्वतंत्र विज़न।"
  },
  Virgo: {
    element: "पृथ्वी तत्व (Earth)",
    modality: "द्विस्वभाव (Dual)",
    lensTitle: "तार्किक व्यवस्था, सूक्ष्म विवरण और विश्लेषणात्मक पूर्णता",
    lensDescription: "बुध देव द्वारा शासित यह लग्न हर स्थिति में व्यवस्था (System), सूक्ष्म विवरण (Micro-details) और अनुकूलन (Optimization) की तलाश करता है। जहाँ दूसरे लोग उलझनों में घबरा जाते हैं, वहाँ आपकी बुद्धि समस्या को तार्किक घटकों में बांटकर सबसे सटीक और प्रभावी समाधान निकाल लेती है।",
    coreTemperament: "विश्लेषणात्मक, सूक्ष्मदर्शी, व्यवस्थित और गुणवत्ता का सर्वोच्च खोजी।"
  },
  Libra: {
    element: "वायु तत्व (Air)",
    modality: "चर (Cardinal)",
    lensTitle: "संतुलन का साधक, न्यायप्रिय दृष्टि और रणनीतिक कूटनीति",
    lensDescription: "शुक्र देव द्वारा शासित यह लग्न न्याय, सामंजस्य और बौद्धिक संतुलन का प्रतीक है। आप जीवन के दोनों पक्षों को निष्पक्ष होकर देखने की अद्भुत क्षमता रखते हैं। आपके भीतर उच्च स्तरीय कूटनीति, सामाजिक सुरुचि और लोगों को एक साझा उद्देश्य के लिए जोड़ने का सहज गुण है।",
    coreTemperament: "संतुलित, निष्पक्ष, सुरुचिपूर्ण और रणनीतिक सामंजस्य रचने वाला व्यक्तित्व।"
  },
  Scorpio: {
    element: "जल तत्व (Water)",
    modality: "स्थिर (Fixed)",
    lensTitle: "गूढ़ अनुसंधान, अजेय इच्छाशक्ति और रूपांतरण की शक्ति",
    lensDescription: "मंगल और केतु के प्रभाव से संचालित यह लग्न जीवन की गहराइयों, रहस्यों और अदृश्य सत्यों को भेदने का चश्मा देता है। आप सतही बातों से कभी संतुष्ट नहीं होते। आपके भीतर संकटों की राख से उठकर पुनः अजेय बनने की एक अभूतपूर्व रूपांतरणकारी शक्ति (Transformation Power) है।",
    coreTemperament: "तीव्र, एकाग्र, अटूट इच्छाशक्ति संपन्न और रहस्यों का गहरा खोजी।"
  },
  Sagittarius: {
    element: "अग्नि तत्व (Fire)",
    modality: "द्विस्वभाव (Dual)",
    lensTitle: "दार्शनिक विज़न, सत्य के प्रति निष्ठा और वृहद क्षितिज",
    lensDescription: "देवगुरु बृहस्पति द्वारा शासित यह लग्न जीवन को एक बड़े फलक, उच्च आदर्शों और आत्म-विकास के रूप में देखता है। आपकी सोच संकीर्ण बंधनों में नहीं बंधती। आपके पास दूरगामी दृष्टि, स्वाभाविक आशावाद और सत्य व ज्ञान के प्रति अटूट निष्ठा है।",
    coreTemperament: "दार्शनिक, दूरदर्शी, धर्म व सत्य-निष्ठ और वृहद संभावनाओं का अन्वेषक।"
  },
  Capricorn: {
    element: "पृथ्वी तत्व (Earth)",
    modality: "चर (Cardinal)",
    lensTitle: "चट्टान जैसा धैर्य, व्यावहारिक महत्वाकांक्षा और अखंड अनुशासन",
    lensDescription: "शनि देव द्वारा शासित यह लग्न जीवन को यथार्थवादी कर्मठता, दीर्घकालिक योजना और चट्टान जैसे धैर्य के साथ देखता है। आप तात्कालिक दिखावे या शॉर्टकट के फेर में नहीं पड़ते। आपका विश्वास ठोस नींव और सतत परिश्रम पर है, जो समय के साथ आपको समाज व कर्मक्षेत्र के सर्वोच्च शिखर पर स्थापित करता है।",
    coreTemperament: "अत्यंत अनुशासित, धैर्यवान, व्यावहारिक, विश्वसनीय और शून्य से शिखर का निर्माता।"
  },
  Aquarius: {
    element: "वायु तत्व (Air)",
    modality: "स्थिर (Fixed)",
    lensTitle: "मानवतावादी विज़न, वैज्ञानिक दृष्टिकोण और लीक से हटकर सोच",
    lensDescription: "शनि और राहु के प्रभाव से यह लग्न लीक से हटकर सोचने, आधुनिक टेक्नोलॉजी और सामाजिक उत्थान की दृष्टि देता है। आप पारंपरिक सीमाओं को तोड़कर भविष्योन्मुखी विचार रचने में अग्रणी होते हैं। आपकी बुद्धि वैश्विक, निष्पक्ष और मौलिक होती है।",
    coreTemperament: "नवाचारी, वैज्ञानिक, मानवतावादी और स्वतंत्र विचार का ध्वजवाहक।"
  },
  Pisces: {
    element: "जल तत्व (Water)",
    modality: "द्विस्वभाव (Dual)",
    lensTitle: "अगाध करुणा, आध्यात्मिक अंतर्दृष्टि और ब्रह्मांडीय चेतना",
    lensDescription: "देवगुरु बृहस्पति द्वारा शासित यह लग्न असीम संवेदनशीलता, कल्पनाशक्ति और आध्यात्मिक गहराई का द्वार है। आप सांसारिक सीमाओं से परे जाकर जीवन के सूक्ष्म अर्थ को अनुभव करते हैं। आपके पास गहरी परोपकारी दृष्टि और आत्मिक शांति का एक शांत अंतःसरोवर है।",
    coreTemperament: "आध्यात्मिक, करुणामयी, कल्पनाशील और उच्च चेतना से जुड़ा अंतर्मन।"
  }
};

// ── MOON PROFILES ─────────────────────────────────────────────────────────────
const MOON_PROFILES_HINDI: Record<string, {
  emotionalCore: string;
  reactionStyle: string;
}> = {
  Aries: {
    emotionalCore: "उत्साह, स्वतंत्र प्रेरणा और तात्कालिक क्रियाशीलता",
    reactionStyle: "भावनात्मक रूप से आप बहुत प्रत्यक्ष और साहसी हैं; किसी भी चुनौती में आगे बढ़कर सामना करना आपकी स्वाभाविक वृत्ति है।"
  },
  Taurus: {
    emotionalCore: "आंतरिक स्थिरता, धैर्य और सुख-समृद्धि की गहरी चाह",
    reactionStyle: "भावनात्मक रूप से आप अत्यंत संतुलित, शांत और भरोसेमंद हैं; उथल-पुथल में भी आपका मन अपनी आंतरिक शांति नहीं खोता।"
  },
  Gemini: {
    emotionalCore: "विचारों की विविधता, जिज्ञासा और निरंतर बौद्धिक गति",
    reactionStyle: "आपका मन सदैव सीखने, संवाद करने और नए दृष्टिकोण तलाशने में संलग्न रहता है; आप भावनाओं को भी बुद्धि की कसौटी पर परखते हैं।"
  },
  Cancer: {
    emotionalCore: "असीम ममत्व, संवेदनशीलता और सुरक्षात्मक स्नेह",
    reactionStyle: "आपकी भावनाएं समुद्र की लहरों जैसी गहरी हैं; आप अपनों के सुख-दुख को अपने दिल से महसूस करते हैं और गहरा लगाव रखते हैं।"
  },
  Leo: {
    emotionalCore: "जन्मजात स्वाभिमान, मर्यादा और राजा जैसी गरिमा",
    reactionStyle: "आपका मन किसी के अहसान या अनादर को कभी स्वीकार नहीं करता; आपके भीतर आत्म-सम्मान और अपनी शर्तों पर जीने की अखंड ज्वाला जलती है।"
  },
  Virgo: {
    emotionalCore: "तार्किक संतुलन, आत्म-विश्लेषण और व्यवस्था की चाह",
    reactionStyle: "आपका मन हर छोटी बात का सूक्ष्म विश्लेषण करता है; आप अपने और दूसरों के काम में पूर्णता और गुणवत्ता की तलाश करते हैं।"
  },
  Libra: {
    emotionalCore: "सौहार्द, न्यायप्रियता, सुरुचि और साझेदारियों की कद्र",
    reactionStyle: "आपका मन विवादों से बचकर शांति और सुरुचिपूर्ण संतुलन की तलाश करता है; आप दूसरों की भावनाओं का पूरा सम्मान करते हैं।"
  },
  Scorpio: {
    emotionalCore: "तीव्र अंतर्ज्ञान, अगाध निष्ठा और भावनात्मक गहराई",
    reactionStyle: "आपकी भावनाएं सतही नहीं होतीं; आप जिसे अपना मानते हैं उसके लिए सर्वस्व न्योछावर कर सकते हैं और रहस्यों को भांप लेते हैं।"
  },
  Sagittarius: {
    emotionalCore: "आशावाद, सत्य की खोज और स्वतंत्रता की तीव्र लालसा",
    reactionStyle: "कठिन से कठिन समय में भी आपका मन एक आशा की किरण ढूंढ लेता है; आप संकीर्णता और पाखंड से कोसों दूर रहना पसंद करते हैं।"
  },
  Capricorn: {
    emotionalCore: "गंभीर उत्तरदायित्व, आत्म-नियंत्रण और व्यावहारिक संकल्प",
    reactionStyle: "आप अपनी भावनाओं का सार्वजनिक प्रदर्शन नहीं करते; आपका मन धैर्य, कर्तव्य और व्यावहारिक यथार्थ से संचालित होता है।"
  },
  Aquarius: {
    emotionalCore: "निष्पक्ष मानवता, वैचारिक स्वतंत्रता और मौलिक दृष्टि",
    reactionStyle: "आपका मन दुनिया की रूढ़ियों से ऊपर उठकर सोचता है; आप सबकी भलाई चाहते हैं लेकिन अपनी स्वतंत्रता से कभी समझौता नहीं करते।"
  },
  Pisces: {
    emotionalCore: "असीम करुणा, काव्यात्मक संवेदनशीलता और आध्यात्मिक शांति",
    reactionStyle: "आपका अंतर्मन दूसरों के दर्द को तुरंत सोख लेता है; आप अकेलेपन में अपनी रचनात्मक और आध्यात्मिक ऊर्जा को पुनर्जीवित करते हैं।"
  }
};

// ── LAGNA SPECIFIC GEMSTONES & REMEDIES ───────────────────────────────────────
const LAGNA_RULES: Record<string, {
  prohibit: string;
  prohibitReason: string;
  recommended: string[];
  wearing: string;
  silverCopperRole: string;
}> = {
  Capricorn: {
    prohibit: "माणिक्य (Ruby) व पुखराज (Yellow Sapphire) भूलकर भी न पहनें!",
    prohibitReason: "मकर लग्न के लिए सूर्य अष्टमेश (रंध्रेश) और देवगुरु बृहस्पति तृतीय व द्वादश भाव (व्ययेश) के स्वामी होकर अकारक हैं। इनका रत्न पहनने से अकारण खर्चे, स्वास्थ्य संकट और संघर्ष बढ़ सकते हैं। गोमेद भी दूसरे (मारक) भाव में बिना विशेष परामर्श के वर्जित है।",
    recommended: [
      "नीलम या कटैला (Blue Sapphire / Amethyst): लग्नेश शनि को बल देने के लिए मध्यमा अंगुली में पंचधातु या चांदी में धारण करें।",
      "सफेद ओपल या हीरा (Australian Opal / Diamond): परम योगकारक शुक्र (पंचमेश व दशमेश) को प्रदीप्त करने के लिए अनामिका या मध्यमा में धारण करें।",
      "पन्ना (Emerald): भाग्येश बुध (नवमेश) को बल देने के लिए कनिष्ठिका (Little finger) में धारण करें।"
    ],
    wearing: "नीलम शनिवार सूर्यास्त के समय, और ओपल शुक्रवार प्रातः शुक्ल पक्ष में गंगाजल व कच्चे दूध से शुद्ध करके धारण करें।",
    silverCopperRole: "चांदी का चौकोर टुकड़ा अपने पास रखें जिससे धन और वाणी के स्थान पर स्थिरता रहे, और तांबे के लोटे से सूर्य को जल दें।"
  },
  Aquarius: {
    prohibit: "माणिक्य (Ruby) व मूंगा (Red Coral) भूलकर भी न पहनें!",
    prohibitReason: "कुंभ लग्न के लिए सूर्य सप्तमेश (मारक) और मंगल तृतीय व दशमेश होकर आक्रामक प्रभाव दे सकते हैं।",
    recommended: [
      "नीलम (Blue Sapphire): लग्नेश शनि को बल देने के लिए मध्यमा अंगुली में धारण करें।",
      "सफेद ओपल या हीरा (White Opal / Diamond): परम योगकारक शुक्र (चतुर्थेश व नवमेश) को प्रदीप्त करने हेतु धारण करें।",
      "पन्ना (Emerald): पंचमेश बुध को बल देने के लिए कनिष्ठिका में धारण करें।"
    ],
    wearing: "शनिवार या शुक्रवार को शुभ लग्न में धारण करें।",
    silverCopperRole: "चांदी और स्टील/लोहे की संतुलित धातु ऊर्जा का उपयोग करें।"
  },
  Virgo: {
    prohibit: "गोमेद (Hessonite) व मूंगा (Red Coral) भूलकर भी न पहनें!",
    prohibitReason: "कन्या लग्न के लिए मंगल तृतीयेश व अष्टमेश होकर अत्यंत अकारक हैं, और दूसरे मारक भाव का राहु गोमेद पहनने से वाणी व धन में उग्रता ला सकता है।",
    recommended: [
      "पन्ना (Emerald - 4-5 कैरेट): लग्नेश व कर्मेश बुध को बल देने के लिए कनिष्ठिका (Little Finger) में धारण करें।",
      "सफेद ओपल (Australian White Opal - 6-7 कैरेट): भाग्येश शुक्र को बल देने के लिए अनामिका (Ring Finger) में धारण करें।"
    ],
    wearing: "पन्ना बुधवार प्रातः और ओपल शुक्रवार प्रातः शुक्ल पक्ष में धारण करें।",
    silverCopperRole: "ठोस चांदी का टुकड़ा पर्स में रखें और तांबे के लोटे से सूर्य देव को अर्घ्य दें।"
  },
  Libra: {
    prohibit: "माणिक्य (Ruby) व पुखराज (Yellow Sapphire) भूलकर भी न पहनें!",
    prohibitReason: "तुला लग्न के लिए सूर्य एकादशेश (बाधक) और गुरु तृतीय व षष्ठेश होकर रोग-ऋण के कारक हैं।",
    recommended: [
      "सफेद ओपल या हीरा (Diamond / Opal): लग्नेश शुक्र को बल देने के लिए अनामिका में धारण करें।",
      "नीलम (Blue Sapphire): परम योगकारक शनि (चतुर्थेश व पंचमेश) को बल देने के लिए मध्यमा में धारण करें।",
      "पन्ना (Emerald): भाग्येश बुध को बल देने के लिए कनिष्ठिका में धारण करें।"
    ],
    wearing: "शुक्रवार या शनिवार को शुभ नक्षत्र में धारण करें।",
    silverCopperRole: "चांदी के पात्र में नियमित जल पिएं।"
  },
  Aries: {
    prohibit: "पन्ना (Emerald) व हीरा (Diamond) भूलकर भी न पहनें!",
    prohibitReason: "मेष लग्न के लिए बुध तृतीयेश व षष्ठेश तथा शुक्र द्वितीय व सप्तमेश (प्रबल मारक) हैं।",
    recommended: [
      "मूंगा (Red Coral): लग्नेश मंगल को बल देने के लिए अनामिका में धारण करें।",
      "माणिक्य (Ruby): पंचमेश सूर्य को बल देने के लिए अनामिका में धारण करें।",
      "पुखराज (Yellow Sapphire): भाग्येश गुरु को बल देने के लिए तर्जनी में धारण करें।"
    ],
    wearing: "मंगलवार या गुरुवार प्रातःकाल धारण करें।",
    silverCopperRole: "तांबे का कड़ा या लोटा विशेष लाभकारी है।"
  },
  Taurus: {
    prohibit: "माणिक्य (Ruby) व पुखराज (Yellow Sapphire) भूलकर भी न पहनें!",
    prohibitReason: "वृषभ लग्न के लिए गुरु अष्टमेश व एकादशेश होकर अकारक हैं।",
    recommended: [
      "सफेद ओपल या हीरा: लग्नेश शुक्र को बल देने हेतु।",
      "नीलम: परम योगकारक शनि (नवमेश व दशमेश) को बल देने हेतु।",
      "पन्ना: द्वितीयेश व पंचमेश बुध को बल देने हेतु।"
    ],
    wearing: "शुक्रवार व शनिवार को धारण करें।",
    silverCopperRole: "चांदी का उपयोग अधिकतम करें।"
  },
  Gemini: {
    prohibit: "माणिक्य (Ruby) व मूंगा (Red Coral) भूलकर भी न पहनें!",
    prohibitReason: "मिथुन लग्न के लिए मंगल षष्ठेश व एकादशेश होकर रोग व शत्रु कारक हैं।",
    recommended: [
      "पन्ना (Emerald): लग्नेश व चतुर्थेश बुध को बल देने हेतु।",
      "सफेद ओपल या हीरा: पंचमेश शुक्र को बल देने हेतु।",
      "नीलम (Blue Sapphire): भाग्येश शनि को बल देने हेतु।"
    ],
    wearing: "बुधवार या शुक्रवार प्रातः धारण करें।",
    silverCopperRole: "चांदी और कांसे का उपयोग करें।"
  },
  Cancer: {
    prohibit: "नीलम (Blue Sapphire) व पन्ना (Emerald) भूलकर भी न पहनें!",
    prohibitReason: "कर्क लग्न के लिए शनि अष्टमेश व मारक तथा बुध द्वादशेश होकर व्यय कारक हैं।",
    recommended: [
      "मोती (Natural Pearl): लग्नेश चंद्रमा को बल देने हेतु कनिष्ठिका में।",
      "मूंगा (Red Coral): परम योगकारक मंगल (पंचमेश व दशमेश) को बल देने हेतु।",
      "पुखराज (Yellow Sapphire): भाग्येश गुरु को बल देने हेतु तर्जनी में।"
    ],
    wearing: "सोमवार, मंगलवार या गुरुवार को धारण करें।",
    silverCopperRole: "शुद्ध चांदी का कड़ा या गिलास सर्वश्रेष्ठ है।"
  },
  Leo: {
    prohibit: "नीलम (Blue Sapphire) व हीरा (Diamond) भूलकर भी न पहनें!",
    prohibitReason: "सिंह लग्न के लिए शनि षष्ठेश व सप्तमेश तथा शुक्र तृतीय व दशमेश होकर अकारक हैं।",
    recommended: [
      "माणिक्य (Ruby): लग्नेश सूर्य को बल देने हेतु अनामिका में।",
      "मूंगा (Red Coral): परम योगकारक मंगल (चतुर्थेश व नवमेश) को बल देने हेतु।",
      "पुखराज (Yellow Sapphire): पंचमेश गुरु को बल देने हेतु तर्जनी में।"
    ],
    wearing: "रविवार या मंगलवार प्रातः धारण करें।",
    silverCopperRole: "शुद्ध तांबे का पात्र व अर्घ्य लोटा श्रेष्ठ है।"
  },
  Scorpio: {
    prohibit: "पन्ना (Emerald) व हीरा (Diamond) भूलकर भी न पहनें!",
    prohibitReason: "वृश्चिक लग्न के लिए बुध अष्टमेश व एकादशेश तथा शुक्र द्वादशेश व मारक हैं।",
    recommended: [
      "मूंगा (Red Coral): लग्नेश मंगल को बल देने हेतु अनामिका में।",
      "पुखराज (Yellow Sapphire): पंचमेश व द्वितीयेश गुरु को बल देने हेतु।",
      "मोती (Pearl): भाग्येश चंद्रमा को बल देने हेतु कनिष्ठिका में।"
    ],
    wearing: "मंगलवार या गुरुवार को धारण करें।",
    silverCopperRole: "तांबे व चांदी का संतुलित उपयोग करें।"
  },
  Sagittarius: {
    prohibit: "हीरा (Diamond) व पन्ना (Emerald) भूलकर भी न पहनें!",
    prohibitReason: "धनु लग्न के लिए शुक्र षष्ठेश व एकादशेश होकर अकारक हैं।",
    recommended: [
      "पुखराज (Yellow Sapphire): लग्नेश गुरु को बल देने हेतु तर्जनी में।",
      "माणिक्य (Ruby): भाग्येश सूर्य को बल देने हेतु अनामिका में।",
      "मूंगा (Red Coral): पंचमेश मंगल को बल देने हेतु।"
    ],
    wearing: "गुरुवार या रविवार प्रातः धारण करें।",
    silverCopperRole: "पीतल और सोने का उपयोग शुभ है।"
  },
  Pisces: {
    prohibit: "हीरा (Diamond) व नीलम (Blue Sapphire) भूलकर भी न पहनें!",
    prohibitReason: "मीन लग्न के लिए शुक्र तृतीयेश व अष्टमेश तथा शनि द्वादशेश होकर अकारक हैं।",
    recommended: [
      "पुखराज (Yellow Sapphire): लग्नेश गुरु को बल देने हेतु तर्जनी में।",
      "मोती (Pearl): पंचमेश चंद्रमा को बल देने हेतु कनिष्ठिका में।",
      "मूंगा (Red Coral): भाग्येश मंगल को बल देने हेतु अनामिका में।"
    ],
    wearing: "गुरुवार या सोमवार प्रातः धारण करें।",
    silverCopperRole: "चांदी व सोने का उपयोग उत्तम है।"
  }
};

// ── UTILITY FUNCTIONS ─────────────────────────────────────────────────────────
function formatDms(lon: number): string {
  const norm = ((lon % 30) + 30) % 30;
  const deg = Math.floor(norm);
  const minFloat = (norm - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  return `${deg}° ${String(min).padStart(2, "0")}' ${String(sec).padStart(2, "0")}"`;
}

function formatDateIndian(d?: Date | string | null): string {
  if (!d) return "—";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return "—";
  return dateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── MASTER DOSSIER GENERATOR FUNCTION ─────────────────────────────────────────
export function generateMasterKundliDossier(chart: ChartData): MasterDossierResult {
  const p = chart.planets || {};
  const name = chart.name || "Seeker";

  // Helper for resilient planet data access
  const getPData = (pName: string): any => {
    if (!p) return undefined;
    if (p[pName]) return p[pName];
    if (p[pName.toLowerCase()]) return p[pName.toLowerCase()];
    const entry = Object.entries(p).find(
      ([k, v]: [string, any]) =>
        k.toLowerCase() === pName.toLowerCase() ||
        (v?.name && String(v.name).toLowerCase() === pName.toLowerCase()) ||
        (v?.planet && String(v.planet).toLowerCase() === pName.toLowerCase())
    );
    return entry ? entry[1] : undefined;
  };

  // Lagna Resolution
  const resolveLagna = (): { rashiName: string; lagnaNum: number } => {
    if (typeof chart.lagnaRashi === "string" && chart.lagnaRashi.trim()) {
      const idx = RASHIS.indexOf(chart.lagnaRashi.trim() as any);
      return { rashiName: chart.lagnaRashi.trim(), lagnaNum: idx >= 0 ? idx : 0 };
    }
    if (typeof chart.lagnaNum === "number") {
      if (chart.lagnaNum >= 0 && chart.lagnaNum <= 11) {
        return { rashiName: RASHIS[chart.lagnaNum] || "Aries", lagnaNum: chart.lagnaNum };
      }
      if (chart.lagnaNum === 12) {
        return { rashiName: "Pisces", lagnaNum: 11 };
      }
    }
    if (typeof chart.lagnaLon === "number") {
      const idx = Math.floor((((chart.lagnaLon % 360) + 360) % 360) / 30);
      return { rashiName: RASHIS[idx] || "Aries", lagnaNum: idx };
    }
    return { rashiName: "Aries", lagnaNum: 0 };
  };

  const { rashiName: lagnaRashiName, lagnaNum: resolvedLagnaNum } = resolveLagna();
  const lagnaLord = chart.lagnaLord || SIGN_LORDS[lagnaRashiName] || "Mars";
  const lagnaLordData = getPData(lagnaLord);
  const lagnaLordPlacement = lagnaLordData
    ? `${HOUSE_NAMES_HINDI[lagnaLordData.house] || `House ${lagnaLordData.house}`} (${SIGN_NAMES_HINDI[lagnaLordData.sign] || lagnaLordData.sign})`
    : `प्रथम भाव (${lagnaRashiName})`;

  // Moon Resolution
  const moonData = getPData("Moon");
  const moonSignName = moonData?.sign || RASHIS[resolvedLagnaNum] || "Aries";
  const moonNakName = moonData?.nakshatra || "Ashwini";
  const moonPada = moonData?.pada || 1;
  const nakMeta = NAKSHATRA_DEITIES[moonNakName] || { deity: "केतु / अश्विनी कुमार", lord: "केतु" };

  // Sun Resolution
  const sunData = getPData("Sun");
  const sunSignName = sunData?.sign || RASHIS[resolvedLagnaNum] || "Aries";
  const sunHouse = sunData?.house || 1;
  const sunDignity = sunData?.dignity || (sunHouse === 10 ? "दिग्बली (Digbali in 10H)" : "सम / मित्र राशि");

  // ── 1. BIRTH PROFILE ────────────────────────────────────────────────────────
  const birthProfile = {
    name,
    dobFormatted: chart.dob ? formatDateIndian(chart.dob) : "—",
    tob: chart.tob || "—",
    city: chart.city || "Delhi",
    coordinates: `${chart.lat ? chart.lat.toFixed(2) : "28.61"}°N, ${chart.lon ? chart.lon.toFixed(2) : "77.21"}°E`,
    lagnaRashi: `${SIGN_NAMES_HINDI[lagnaRashiName] || lagnaRashiName} (Lagna)`,
    lagnaDegreeFormatted: formatDms(chart.lagnaLon || 0),
    lagnaLord: PLANET_NAMES_HINDI[lagnaLord] || lagnaLord,
    lagnaLordPlacement,
    moonRashi: `${SIGN_NAMES_HINDI[moonSignName] || moonSignName} (Chandra)`,
    moonDegreeFormatted: formatDms(moonData?.lon || 0),
    nakshatraName: moonNakName,
    nakshatraPada: moonPada,
    nakshatraLord: nakMeta.lord,
    aradhyaDeity: nakMeta.deity,
    sunRashi: SIGN_NAMES_HINDI[sunSignName] || sunSignName,
    sunHouse,
    sunDignity,
  };

  // ── 2. PLANETARY MATRIX & JAIMINI KARAKAS ──────────────────────────────────
  const jaimini = buildJaiminiChart(chart);
  const karakaMap: Record<string, string> = {};
  if (jaimini?.karakas) {
    for (const [k, v] of Object.entries(jaimini.karakas)) {
      if (v?.planet) {
        karakaMap[v.planet] = k.toUpperCase();
      }
    }
  }

  const planetOrder = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planetaryMatrix = planetOrder.map((plName) => {
    const pl = p[plName];
    const houseNum = pl?.house || 1;
    const signName = pl?.sign || "—";
    const charaKaraka = karakaMap[plName] || "—";

    let dignityStr = pl?.dignity || "सम राशि";
    if (plName === "Sun" && houseNum === 10) dignityStr = "दिग्बली (Digbali in 10H)";
    if (plName === "Mars" && houseNum === 10) dignityStr = "दिग्बली (Digbali in 10H)";
    if (plName === "Saturn" && houseNum === 7) dignityStr = "दिग्बली (Digbali in 7H)";
    if (plName === "Jupiter" && houseNum === 1) dignityStr = "दिग्बली (Digbali in 1H)";
    if (plName === "Mercury" && houseNum === 1) dignityStr = "दिग्बली (Digbali in 1H)";
    if (plName === "Venus" && houseNum === 4) dignityStr = "दिग्बली (Digbali in 4H)";
    if (plName === "Moon" && houseNum === 4) dignityStr = "दिग्बली (Digbali in 4H)";

    let dignityColor = "#6B635B";
    if (dignityStr.includes("उच्च") || dignityStr.includes("Exalt") || dignityStr.includes("दिग्बली")) {
      dignityColor = "#16a34a"; // Green
    } else if (dignityStr.includes("स्वराशि") || dignityStr.includes("Own") || dignityStr.includes("मूलत्रिकोण")) {
      dignityColor = "#ca8a04"; // Gold
    } else if (dignityStr.includes("नीच") || dignityStr.includes("Debilitat")) {
      dignityColor = "#dc2626"; // Red
    }

    // Dynamic Special Notes for each planet
    let specialNotes = "";
    if (charaKaraka === "AK") specialNotes = "आत्मकारक (AK): आत्मा के मूल संकल्प व आंतरिक स्वभाव का प्रधान प्रतिनिधि";
    else if (charaKaraka === "AMK") specialNotes = "अमात्यकारक (AmK): कर्म, करियर व सामाजिक प्रतिष्ठा का मुख्य सारथी";
    else if (charaKaraka === "DK") specialNotes = "दाराकारक (DK): जीवनसाथी व स्थायी साझेदारियों का दर्पण";
    else if (charaKaraka === "BK") specialNotes = "भ्रातृकारक (BK): गुरुतुल्य परामर्श व साहस का संवाहक";

    if (!specialNotes) {
      if ([1, 4, 7, 10].includes(houseNum)) {
        specialNotes = `केंद्र भाव (${houseNum}H) में स्थित — जीवन की मुख्य धुरी व स्तंभ`;
      } else if ([5, 9].includes(houseNum)) {
        specialNotes = `त्रिकोण भाव (${houseNum}H) में स्थित — पूर्वपुण्य व सौभाग्य का संवर्धन`;
      } else if ([3, 6, 11].includes(houseNum)) {
        specialNotes = `उपचय भाव (${houseNum}H) में स्थित — समय के साथ सतत उन्नति व संघर्ष-विजय`;
      } else {
        specialNotes = `भाव ${houseNum} में स्थित — गूढ़ अनुभव, चिंतन व आंतरिक रूपांतरण`;
      }
    }

    return {
      planet: plName,
      hindiName: PLANET_NAMES_HINDI[plName] || plName,
      sign: SIGN_NAMES_HINDI[signName] || signName,
      house: houseNum,
      houseName: HOUSE_NAMES_HINDI[houseNum] || `House ${houseNum}`,
      degreeFormatted: formatDms(pl?.lon || 0),
      dignity: dignityStr,
      dignityColor,
      nakshatra: pl?.nakshatra || "—",
      pada: pl?.pada || 1,
      retrograde: pl?.retrograde || false,
      combust: pl?.combust || false,
      charaKaraka,
      specialNotes,
    };
  });

  // ── 3. DYNAMIC YOGAS DETECTION ──────────────────────────────────────────────
  const rawYogas = detectYogas(chart.planets as any, resolvedLagnaNum, "elite");
  const presentYogas = rawYogas.filter((y) => y.present && !y.isDosha);

  let keyYogas = presentYogas.slice(0, 4).map((y) => ({
    name: y.name,
    sanskritName: `${y.name} योग`,
    type: `${y.category} (${y.rare ? "दुर्लभ राजयोग" : "अत्यंत शुभ योग"})`,
    description: y.description,
    shastricSignificance: y.impact,
  }));

  // Fallback if very few yogas returned
  if (keyYogas.length === 0) {
    keyYogas.push({
      name: "लग्नेश केंद्र/त्रिकोण सम्बन्ध योग",
      sanskritName: "लग्नपति शुभ स्थान योग",
      type: "आधारभूत राजयोग (Foundational Raja Yoga)",
      description: `लग्नेश ${PLANET_NAMES_HINDI[lagnaLord] || lagnaLord} भाव ${lagnaLordData?.house || 1} में स्थित होकर जीवन में व्यक्तित्व व संकल्प को सुदृढ़ता प्रदान कर रहे हैं।`,
      shastricSignificance: "जातक अपने आत्मबल, निरंतर उद्यम और स्वतंत्र निर्णय क्षमता के दम पर समाज में अपनी विशिष्ट पहचान स्थापित करता है।"
    });
  }

  // ── 4. SATURN FROM MOON RELATIONSHIP (कंटक शनि / साढ़े साती / ढैया) ─────────
  const moonSignIdx = SIGNS.indexOf(moonSignName);
  const saturnSignName = p.Saturn?.sign || "Pisces";
  const saturnSignIdx = SIGNS.indexOf(saturnSignName);
  const saturnFromMoon = moonSignIdx >= 0 && saturnSignIdx >= 0
    ? (((saturnSignIdx - moonSignIdx) % 12 + 12) % 12) + 1
    : 7;

  let saturnMoonTitle = "";
  let saturnMoonDesc = "";
  let saturnMoonMitigation = "";

  if (saturnFromMoon === 8) {
    saturnMoonTitle = "चंद्रमा से अष्टम भाव में शनि: 'अष्टम कंटक शनि' (Kantak Shani Mystery)";
    saturnMoonDesc = `आपकी जन्म कुंडली में चंद्रमा ${SIGN_NAMES_HINDI[moonSignName]} में और शनि देव ${SIGN_NAMES_HINDI[saturnSignName]} में हैं। चंद्र राशि से ठीक 8वें भाव में शनि की यह स्थिति पराशरी ज्योतिष में 'अष्टम कंटक शनि' कहलाती है। 'कंटक' का अर्थ कांटा है — जैसे पैर में कांटा लगने पर व्यक्ति हर कदम संभलकर रखता है, वैसे ही यह योग गति को धीमा करता है, मन में अचानक भारीपन या अकेलेपन की भावना लाता है, और काम पहले प्रयास के बजाय धैर्यपूर्वक दूसरे-तीसरे प्रयास में सिद्ध कराता है। लेकिन इसका सबसे बड़ा वरदान यह है कि यह व्यक्ति को एक तपस्वी, गंभीर शोधकर्ता और सिद्ध विशेषज्ञ बना देता है।`;
    saturnMoonMitigation = "शनिवार को हनुमान चालीसा, सुंदरकांड या हनुमान बाहुक का पाठ करें; नंगे पैर काम करने वाले या सफाई कर्मचारियों को जूते, चप्पल या भोजन का दान करें; और सोमवार को शिवलिंग पर जल अर्पित करें।";
  } else if (saturnFromMoon === 4) {
    saturnMoonTitle = "चंद्रमा से चतुर्थ भाव में शनि: 'चतुर्थ कंटक / ढैया' (Deep Emotional Discipline)";
    saturnMoonDesc = `चंद्रमा से चौथे भाव में शनि की उपस्थिति सुख स्थान में अनुशासन और भावनात्मक परिपक्वता लाती है। यह मन में कभी-कभी एकाकीपन और उत्तरदायित्व का भारीपन देता है, जिससे व्यक्ति समय से पहले बहुत समझदार बन जाता है।`;
    saturnMoonMitigation = "प्रत्येक सोमवार शिवलिंग पर कच्चा दूध व जल अर्पित करें और माता व वृद्ध स्त्रियों का चरण स्पर्श कर आशीर्वाद लें।";
  } else if (saturnFromMoon === 7 || saturnFromMoon === 10) {
    saturnMoonTitle = `चंद्रमा से ${saturnFromMoon === 7 ? "सप्तम" : "दशम"} भाव में शनि: 'केंद्र कंटक शनि' (Duty & Public Responsibility)`;
    saturnMoonDesc = `चंद्रमा से केंद्र भाव में शनि की यह स्थिति कर्मक्षेत्र और सार्वजनिक जीवन में उच्च अनुशासन और निरंतरता की मांग करती है। जल्दबाजी के निर्णय फल नहीं देते, लेकिन निष्ठावान कार्य स्थायी सिद्धि देता है।`;
    saturnMoonMitigation = "शनिवार को पीपल के वृक्ष के पास तिल के तेल का दीपक जलाएं और अपने अधीनस्थों का सम्मान करें।";
  } else if ([12, 1, 2].includes(saturnFromMoon)) {
    saturnMoonTitle = "चंद्रमा के निकट शनि: साढ़े साती का प्रभाव (Alchemical Soul Cleansing)";
    saturnMoonDesc = `चंद्रमा और शनि का यह निकट संबंध जीवन में आंतरिक मंथन, धैर्य और भावनात्मक परिपक्वता की उच्च परीक्षा लेता है। यह जातक को तपाकर कुंदन बनाता है।`;
    saturnMoonMitigation = "प्रतिदिन 'ॐ शं शनैश्चराय नमः' का 1 माला जाप करें और अहंकार से दूर रहकर सेवा भाव रखें।";
  } else {
    saturnMoonTitle = `शनि देव का ${HOUSE_NAMES_HINDI[p.Saturn?.house || 1]} में प्रभाव (Karmic Persistence)`;
    saturnMoonDesc = `शनि देव भाव ${p.Saturn?.house} में स्थित होकर धैर्य, यथार्थवाद और कर्तव्यनिष्ठा की मांग करते हैं। वे शॉर्टकट को नकारते हैं और दीर्घकालिक प्रयासों को अमर बनाते हैं।`;
    saturnMoonMitigation = "शनिवार को छाया दान करें और बुजुर्गों की सेवा करें।";
  }

  // ── 5. KARMIC VULNERABILITIES & CAUTIONS ─────────────────────────────────────
  const rahuHouse = p.Rahu?.house || 2;
  const ketuHouse = p.Ketu?.house || 8;
  const moonHouse = moonData?.house || 10;

  const karmicVulnerabilities: MasterDossierResult["karmicVulnerabilities"] = [
    {
      title: saturnMoonTitle,
      category: "Mental",
      description: saturnMoonDesc,
      mitigationGuidance: saturnMoonMitigation,
    },
    {
      title: `भाव ${rahuHouse} में राहु का प्रभाव (Unconventional Ambition & Speech Caution)`,
      category: "Speech/Wealth",
      description: rahuHouse === 2
        ? "द्वितीय भाव वाणी व संचित धन का है। राहु यहाँ बातचीत में अचानक तीखापन या बिना सोचे बोलने की आदत दे सकता है, तथा सट्टा/क्रिप्टो में त्वरित मुनाफे का प्रलोभन दिखाता है।"
        : rahuHouse === 1
        ? "प्रथम भाव में राहु मन में एक निरंतर छटपटाहट, अत्यधिक महत्वाकांक्षा और अपनी पहचान को तुरंत बड़ा बनाने की तीव्र भूख पैदा करता है।"
        : `भाव ${rahuHouse} में राहु अप्रत्याशित वित्तीय व बौद्धिक अवसर देता है, परंतु यहाँ शॉर्टकट और जल्दबाजी में लिए गए निर्णयों से सदैव बचना चाहिए।`,
      mitigationGuidance: "सट्टा व शॉर्टकट निवेश से 100% दूर रहें; किसी भी संवेदनशील बात पर तुरंत प्रतिक्रिया देने से पहले 5 सेकंड का मौन रखें।",
    },
    {
      title: `${HOUSE_NAMES_HINDI[moonHouse]} में चंद्रमा (Mental Equilibrium & Sleep Rhythm)`,
      category: "Mental",
      description: moonHouse === 12
        ? "द्वादश भाव में चंद्रमा डीप-वर्क और एकांत में गहन चिंतन की शक्ति देता है, लेकिन देर रात तक स्क्रीन देखने या अत्यधिक सोचने से अनिद्रा व मानसिक तनाव हो सकता है।"
        : moonHouse === 8 || moonHouse === 6
        ? "त्रिक भाव में चंद्रमा भावनाओं को बहुत संवेदनशील बना सकता है; छोटी-छोटी बातें मन को गहराई तक छू जाती हैं।"
        : `भाव ${moonHouse} में चंद्रमा आपके अंतर्मन और विचार प्रवाह का केंद्र है। अत्यधिक कार्यभार से मानसिक शांति को सुरक्षित रखना आवश्यक है।`,
      mitigationGuidance: "सोने से कम से कम 45 मिनट पहले स्क्रीन बंद करें, चांदी के गिलास में नियमित जल पिएं और रात्रि को शांत संगीत सुनें।",
    },
    {
      title: `भाव ${ketuHouse} में केतु (Intuitive Depth & Gut Health Cautions)`,
      category: "Health",
      description: ketuHouse === 8
        ? "8वें भाव में केतु की स्थिति पाचन तंत्र (Gut Health) और एसिडिटी/पित्त के प्रति संवेदनशीलता पैदा करती है, साथ ही गूढ़ विद्याओं व रिसर्च की गहरी दृष्टि देती है।"
        : `भाव ${ketuHouse} में केतु सांसारिक मोह से विरक्ति और सूक्ष्म आध्यात्मिक अंतर्दृष्टि प्रदान करता है।`,
      mitigationGuidance: "हल्का और सात्विक आहार लें, भोजन में सौंफ व अजवाइन का उपयोग करें तथा गणपति अथर्वशीर्ष का नियमित पाठ करें।",
    }
  ];

  // ── 6. DASHA TIMELINE ───────────────────────────────────────────────────────
  const activeMD = chart.dashas?.find((d) => d.active) || chart.dashas?.[0];
  const activeAD = chart.antardasha?.find((a) => a.active) || chart.antardasha?.[0];

  const allAntardashas = (chart.antardasha || []).map((ad) => ({
    planet: PLANET_NAMES_HINDI[ad.planet] || ad.planet,
    startDate: ad.start ? formatDateIndian(ad.start) : "—",
    endDate: ad.end ? formatDateIndian(ad.end) : "—",
    isActive: Boolean(ad.active),
  }));

  const mdPlanet = activeMD?.planet || "Mars";
  const adPlanet = activeAD?.planet || "Mars";

  const mdHindi = PLANET_NAMES_HINDI[mdPlanet] || mdPlanet;
  const adHindi = PLANET_NAMES_HINDI[adPlanet] || adPlanet;

  // Find upcoming golden phase
  const futureADs = (chart.antardasha || []).filter((ad) => !ad.active);
  const goldenAD = futureADs.find((ad) => ["Venus", "Jupiter", "Mercury"].includes(ad.planet)) || futureADs[0];

  const goldenADPlanet = goldenAD ? (PLANET_NAMES_HINDI[goldenAD.planet] || goldenAD.planet) : "शुभ अंतर्दशा";
  const goldenADWindow = goldenAD && goldenAD.start && goldenAD.end
    ? `${formatDateIndian(goldenAD.start)} से ${formatDateIndian(goldenAD.end)} तक`
    : "आगामी 2-3 वर्षों में";

  const dashaTimeline = {
    activeMahadasha: `${mdHindi} महादशा`,
    activeMahadashaSpan: `${activeMD?.start ? formatDateIndian(activeMD.start) : "आरंभ"} से ${activeMD?.end ? formatDateIndian(activeMD.end) : "पूर्णता"} तक`,
    activeAntardasha: `${adHindi} अंतर्दशा`,
    activeAntardashaSpan: `${activeAD?.start ? formatDateIndian(activeAD.start) : "वर्तमान"} से ${activeAD?.end ? formatDateIndian(activeAD.end) : "समाप्ति"} तक`,
    currentPhaseInsight: `वर्तमान में सक्रिय ${mdHindi} की महादशा में ${adHindi} की अंतर्दशा आपके जीवन में एक अत्यंत तीव्र और निर्णायक ऊर्जा चक्र संचालित कर रही है। यह समय निष्क्रिय बैठने का नहीं, बल्कि अपने कौशल, संकल्प और सामर्थ्य को केंद्रित करके ठोस धरातल पर परिणाम हासिल करने का है।`,
    upcomingGoldenPhaseTitle: `आगामी स्वर्णिम मोड़: ${goldenADPlanet} अंतर्दशा काल`,
    upcomingGoldenPhaseWindow: goldenADWindow,
    upcomingGoldenPhaseInsight: `यह आगामी कालखंड जीवन में बौद्धिक विस्तार, सुख-साधनों की वृद्धि, प्रतिष्ठा में उछाल और पूर्व में की गई तपस्या के ठोस फल प्राप्त करने का स्वर्णिम समय साबित होगा।`,
    allAntardashas,
  };

  // ── 7. VEDIC REMEDIES & LAL KITAB SAFEGUARDS ─────────────────────────────────
  const lagnaRule = LAGNA_RULES[lagnaRashiName] || LAGNA_RULES["Capricorn"];

  const remedies: MasterDossierResult["remedies"] = {
    gemstoneVerdict: {
      strictProhibition: lagnaRule.prohibit,
      prohibitionReason: lagnaRule.prohibitReason,
      recommendedGems: lagnaRule.recommended,
      wearingInstructions: lagnaRule.wearing,
    },
    metalRemedies: [
      {
        metal: "ठोस चांदी (Solid Silver)",
        item: "चांदी का चौकोर टुकड़ा या ठोस गोली",
        purpose: "दूसरे भाव के राहु व वाणी दोष को शांत कर धन में स्थायित्व लाना",
        method: lagnaRule.silverCopperRole || "हमेशा अपने पर्स या जेब में रखें, अथवा नियमित रूप से चांदी के गिलास में जल पिएं।"
      },
      {
        metal: "शुद्ध तांबा (Pure Copper)",
        item: "तांबे का लोटा",
        purpose: "आत्मबल, तेज और मान-प्रतिष्ठा का संवर्धन",
        method: "प्रतिदिन प्रातः सूर्योदय के समय तांबे के लोटे में जल, लाल पुष्प और अक्षत लेकर सूर्य देव को अर्घ्य दें।"
      }
    ],
    spiritualPractices: [
      {
        deity: nakMeta.deity || "इष्ट देव",
        practice: `नक्षत्र देवता (${nakMeta.deity}) व 'ॐ नमः शिवाय' का नियमित ध्यान`,
        timing: "प्रतिदिन प्रातःकाल",
        benefit: "जन्म नक्षत्र की ऊर्जा को जागृत कर अंतर्मन को स्थिरता व संकल्प शक्ति प्रदान करता है।"
      },
      {
        deity: "भगवान हनुमान / शिव (Lord Hanuman / Shiva)",
        practice: "शनिवार को सुंदरकांड, हनुमान बाहुक या 7 बार हनुमान चालीसा का पाठ",
        timing: "शनिवार सायंकाल",
        benefit: saturnFromMoon === 8
          ? "अष्टम कंटक शनि के कांटे (रुकावटों) को नष्ट कर कर्म में अभूतपूर्व एकाग्रता व विजय दिलाता है।"
          : "शनि के भारीपन और मानसिक तनाव को तुरंत शांत कर कर्मक्षेत्र में गति प्रदान करता है।"
      }
    ],
    conductDiscipline: [
      "5-सेकंड मौन का नियम: किसी भी उत्तेजना, क्रोध या तीखी बहस की स्थिति में बोलने से पूर्व ठीक 5 सेकंड का मौन रखें।",
      "सफाई कर्मचारी व श्रमजीवियों का आदर: शनिवार के दिन किसी ज़रूरतमंद श्रमिक को भोजन, जूते या वस्त्र का आदरपूर्वक दान करें।",
      "शॉर्टकट व सट्टे से पूर्ण दूरी: किसी भी प्रकार की राहु जनित सट्टेबाज़ी या त्वरित मुनाफे के प्रलोभन से 100% दूर रहें।"
    ]
  };

  // ── 8. REAL-TIME GOCHAR (TRANSIT RIPPLES) ────────────────────────────────────
  let gocharAnalysis: MasterDossierResult["gocharAnalysis"];
  try {
    const transitCalc = calculateTransitRippleData({
      birthDate: chart.dob || "2000-01-01",
      birthTime: chart.tob || "12:00",
      timezone: String(chart.tz || 5.5),
      latitude: chart.lat || 28.61,
      longitude: chart.lon || 77.21,
      lagnaSign: resolvedLagnaNum,
      moonLongitude: moonData?.lon ?? (resolvedLagnaNum * 30 + 15),
      moonNakshatra: moonData?.lon !== undefined ? Math.floor(moonData.lon / (360 / 27)) % 27 : 0,
      activeMahadasha: mdPlanet,
      activeAntardasha: adPlanet,
    });

    const saturnPos = transitCalc.transitPositions.Saturn;
    const jupiterPos = transitCalc.transitPositions.Jupiter;
    const rahuPos = transitCalc.transitPositions.Rahu;
    const ketuPos = transitCalc.transitPositions.Ketu;

    const saturnHouseLagna = saturnPos.house;
    const currentMoonSignIdx = moonSignIdx >= 0 ? moonSignIdx : 6;
    const saturnHouseMoon = (((saturnPos.signIndex - currentMoonSignIdx) % 12 + 12) % 12) + 1;
    const isSadeSati = saturnHouseMoon === 12 || saturnHouseMoon === 1 || saturnHouseMoon === 2;
    const isDhaiya = saturnHouseMoon === 4 || saturnHouseMoon === 8;

    gocharAnalysis = {
      scanDate: transitCalc.scanDate,
      transitSummary: `वर्तमान में गोचर में शनि देव ${saturnPos.signName} राशि में भ्रमण कर रहे हैं (लग्न से भाव ${saturnHouseLagna}, चंद्र से भाव ${saturnHouseMoon}), जबकि देवगुरु बृहस्पति ${jupiterPos.signName} राशि में गोचरस्थ हैं।`,
      sadeSatiStatus: {
        isActive: isSadeSati || isDhaiya,
        phase: isSadeSati
          ? `साढ़े साती सक्रिय (${saturnHouseMoon === 12 ? "प्रथम चरण" : saturnHouseMoon === 1 ? "शिखर चरण" : "तृतीय चरण"})`
          : isDhaiya
          ? `शनि की ढैया सक्रिय (चंद्र से ${saturnHouseMoon}वां भाव)`
          : `साढ़े साती व ढैया से पूर्णतः मुक्त`,
        description: isSadeSati
          ? `शनि का गोचर आपकी जन्म चंद्र राशि ${SIGN_NAMES_HINDI[moonSignName]} के आसपास है, जो जीवन में अनुशासन और आंतरिक परिपक्वता का आह्वान करता है।`
          : isDhaiya
          ? `चंद्र से ${saturnHouseMoon}वें भाव में शनि का गोचर कर्मों की समीक्षा और एकाग्रता की मांग करता है।`
          : `वर्तमान में आपकी जन्म चंद्र राशि ${SIGN_NAMES_HINDI[moonSignName]} से शनि अनुकूल दूरी पर है; मानसिक भारीपन से राहत और कर्म के ठोस परिणाम मिलेंगे।`
      },
      majorPlanets: [
        {
          planet: "शनि गोचर (Saturn Transit)",
          transitSign: `${saturnPos.signName} (${saturnPos.degreeInSign.toFixed(1)}°)`,
          transitHouseFromLagna: saturnHouseLagna,
          transitHouseFromMoon: saturnHouseMoon,
          nakshatra: saturnPos.nakshatraName,
          retrograde: saturnPos.isRetrograde,
          impactTheme: `लग्न से भाव ${saturnHouseLagna} व चंद्र से भाव ${saturnHouseMoon} में गोचर`,
          actionableGuidance: `शनि का यह गोचर आपको शॉर्टकट से बचाकर दीर्घकालिक लक्ष्यों पर टिके रहने का निर्देश देता है। जो काम आप इस समय धैर्यपूर्वक करेंगे, वह दशकों तक स्थायी लाभ देगा।`
        },
        {
          planet: "गुरु गोचर (Jupiter Transit)",
          transitSign: `${jupiterPos.signName} (${jupiterPos.degreeInSign.toFixed(1)}°)`,
          transitHouseFromLagna: jupiterPos.house,
          transitHouseFromMoon: (((jupiterPos.signIndex - currentMoonSignIdx) % 12 + 12) % 12) + 1,
          nakshatra: jupiterPos.nakshatraName,
          retrograde: jupiterPos.isRetrograde,
          impactTheme: `लग्न से भाव ${jupiterPos.house} (${jupiterPos.signName}) में गोचर`,
          actionableGuidance: "देवगुरु बृहस्पति का यह गोचर बौद्धिक विवेक, नए नेटवर्क, वित्तीय अवसर और शुभ निर्णयों का वरदान दे रहा है।"
        },
        {
          planet: "राहु-केतु गोचर अक्ष (Rahu-Ketu Axis)",
          transitSign: `राहु: ${rahuPos.signName} · केतु: ${ketuPos.signName}`,
          transitHouseFromLagna: rahuPos.house,
          transitHouseFromMoon: (((rahuPos.signIndex - currentMoonSignIdx) % 12 + 12) % 12) + 1,
          nakshatra: `${rahuPos.nakshatraName} / ${ketuPos.nakshatraName}`,
          retrograde: true,
          impactTheme: `भाव ${rahuPos.house} व भाव ${ketuPos.house} का कार्मिक अक्ष`,
          actionableGuidance: "राहु-केतु का यह अक्ष आपको पुरानी रूढ़ियों से निकालकर आधुनिक सोच और नए तकनीकी माध्यमों से आगे बढ़ने का मार्ग प्रशस्त करता है।"
        }
      ]
    };
  } catch (err) {
    console.warn("[MasterKundliDossier] Gochar calculation error:", err);
    gocharAnalysis = {
      scanDate: new Date().toISOString().split("T")[0],
      transitSummary: "शनि और गुरु का गोचर वर्तमान में अनुकूल धरातल पर है।",
      sadeSatiStatus: {
        isActive: false,
        phase: "साढ़े साती मुक्त",
        description: `वर्तमान में चंद्र राशि ${SIGN_NAMES_HINDI[moonSignName]} से शनि अनुकूल दूरी पर है।`
      },
      majorPlanets: []
    };
  }

  // ── 9. FULLY DYNAMIC NOVELISTIC STORYTELLING CHAPTERS (7 ADHYAYAS) ──────────
  const lagnaInfo = LAGNA_PROFILES_HINDI[lagnaRashiName] || LAGNA_PROFILES_HINDI["Capricorn"];
  const moonInfo = MOON_PROFILES_HINDI[moonSignName] || MOON_PROFILES_HINDI["Libra"];

  // Helper descriptions for planets
  const lagnaLordHindi = PLANET_NAMES_HINDI[lagnaLord] || lagnaLord;
  const sunHindi = PLANET_NAMES_HINDI["Sun"];
  const moonHindi = PLANET_NAMES_HINDI["Moon"];
  const marsHindi = PLANET_NAMES_HINDI["Mars"];
  const mercHindi = PLANET_NAMES_HINDI["Mercury"];
  const jupHindi = PLANET_NAMES_HINDI["Jupiter"];
  const venHindi = PLANET_NAMES_HINDI["Venus"];
  const satHindi = PLANET_NAMES_HINDI["Saturn"];
  const rahuHindi = PLANET_NAMES_HINDI["Rahu"];
  const ketuHindi = PLANET_NAMES_HINDI["Ketu"];

  const storytellingChapters: StorytellingChapter[] = [
    // ── CHAPTER 1 ─────────────────────────────────────────────────────────────
    {
      pillarNum: 1,
      pillarTitle: "प्रथम अध्याय: आत्मा का प्रस्थान और मूल स्वभाव",
      chapterSubtitle: `जन्म की आकाशीय रूपरेखा, ${SIGN_NAMES_HINDI[lagnaRashiName]} लग्न का दृष्टिकोण और आंतरिक स्वाभिमान`,
      icon: "🌌",
      keyHighlight: `${SIGN_NAMES_HINDI[lagnaRashiName]} लग्न + ${SIGN_NAMES_HINDI[moonSignName]} चंद्र: ${lagnaInfo.lensTitle}`,
      paragraphs: [
        `जब ${name} जी का जन्म इस धरती पर हुआ, उस सटीक क्षण में पूर्वी क्षितिज पर ${SIGN_NAMES_HINDI[lagnaRashiName]} का उदय हो रहा था। ${lagnaLordHindi} द्वारा शासित यह लग्न जीवन को देखने का एक बहुत ही विशेष और पारखी चश्मा प्रदान करता है। ${lagnaInfo.lensDescription}`,
        `लेकिन केवल लग्न ही आपकी पूरी कहानी नहीं बयां करता। आपके अंतःकरण का जो असली भावनात्मक केंद्र है, वह ${SIGN_NAMES_HINDI[moonSignName]} और ${moonNakName} नक्षत्र (चरण ${moonPada}) द्वारा संचालित है। ${nakMeta.lord} के इस नक्षत्र और ${nakMeta.deity} के आकाशीय प्रभाव में जन्म लेने के कारण आपके भीतर ${moonInfo.emotionalCore} की भावना हमेशा सक्रिय रहती है। ${moonInfo.reactionStyle} बाहर से आप चाहे जितने भी संयमित या शांत दिखाई दें, आपके भीतर अपने मूल्यों और स्वाभिमान पर जीने की अखंड ज्वाला निरंतर जलती रहती है।`,
        `कुंडली के ${HOUSE_NAMES_HINDI[sunHouse]} में बैठे ${sunHindi} यह बहुत स्पष्ट कर देते हैं कि आप किसी साधारण लीक पर चलकर महज़ एक अनुयायी बनकर संतुष्ट नहीं हो सकते। आपकी आत्मा यह जानती है कि आपका काम आपके नाम से पहचाना जाना चाहिए; आपके विज़न की अपनी प्रतिष्ठा होनी चाहिए और आपको स्वतंत्र निर्णय लेने का स्वाभाविक अधिकार मिलना ही चाहिए।`
      ]
    },

    // ── CHAPTER 2 ─────────────────────────────────────────────────────────────
    {
      pillarNum: 2,
      pillarTitle: "द्वितीय अध्याय: ग्रहों का आकाशीय दरबार — अंतर्मन की कार्यप्रणाली",
      chapterSubtitle: "9 ग्रहों की वास्तविक भूमिका: लग्नपति की दिशा, बुद्धि का सारथी और कर्म का चक्रव्यूह",
      icon: "🪐",
      keyHighlight: `लग्नेश ${lagnaLordHindi} भाव ${lagnaLordData?.house || 1} में स्थित, और चंद्र ${SIGN_NAMES_HINDI[moonSignName]} में अंतर्मन का संवाहक`,
      paragraphs: [
        `यदि हम ${name} जी की कुंडली के ग्रहों को किसी सूखी संख्या या तालिका की तरह न देखकर एक जीवंत दरबार की तरह समझें, तो हर ग्रह ने आपकी ज़िंदगी की पटकथा में एक बहुत ही महत्वपूर्ण ज़िम्मेदारी संभाल रखी है। आपके लग्नपति ${lagnaLordHindi} ${lagnaLordPlacement} में विराजमान हैं। इसका सीधा अर्थ यह है कि आपकी सबसे बड़ी पूंजी, आपका सबसे बड़ा हथियार आपका अपना आत्मबल, कर्मठता और व्यावहारिक रणनीतिक समझ है। आपका उत्थान किसी आकस्मिक लाटरी से नहीं, बल्कि आपके सतत कौशल और अटूट संकल्प के दम पर ही सिद्ध होगा।`,
        `वहीं दूसरी ओर, ${HOUSE_NAMES_HINDI[moonHouse]} में बैठे ${moonHindi} और भाव ${p.Mars?.house || 1} में बैठे ${marsHindi} आपकी ऊर्जा और क्रियान्वयन का मुख्य इंजन हैं। जब आप किसी काम को अपने हाथ में लेते हैं, तो आपका अंतर्मन उसमें पूरी गहराई तक उतर जाता है। ${p.Mercury ? `${HOUSE_NAMES_HINDI[p.Mercury.house]} में बैठे ${mercHindi} और ` : ""}${p.Jupiter ? `${HOUSE_NAMES_HINDI[p.Jupiter.house]} में स्थित ${jupHindi}` : ""} आपको तार्किक कुशाग्रता, जटिल समस्याओं को सुलझाने का विवेक और गूढ़ पैटर्न्स को पहचानने की क्षमता प्रदान करते हैं।`,
        `${HOUSE_NAMES_HINDI[rahuHouse]} में बैठे ${rahuHindi} और ${HOUSE_NAMES_HINDI[p.Saturn?.house || 1]} में बैठे ${satHindi} आपकी कहानी के दो सबसे मजबूत स्तंभ हैं। राहु देव आपको आधुनिक संभावनाओं, डिजिटल युग और नए आयामों की ओर खींचते हैं, जबकि शनि देव हर मोड़ पर आपसे धैर्य, अनुशासन और परिपक्वता की मांग करते हैं। शनि देव का स्पष्ट संदेश है: जल्दबाजी के कच्चे महल ढह जाते हैं, लेकिन जो नींव धैर्य और सत्य से रखी जाएगी, वह सदियों तक अडिग रहेगी।`,
        `${HOUSE_NAMES_HINDI[ketuHouse]} में केतु की उपस्थिति आपको सांसारिक दिखावे से परे जाकर चीजों की वास्तविक तह तक पहुंचने की एक विलक्षण छठी इंद्री (Intuitive Sixth Sense) प्रदान करती है।`
      ]
    },

    // ── CHAPTER 3 ─────────────────────────────────────────────────────────────
    {
      pillarNum: 3,
      pillarTitle: "तृतीय अध्याय: कुदरत का वरदान — आपकी शक्ति और मुख्य राजयोग",
      chapterSubtitle: "कुंडली के शीर्ष राजयोग: बौद्धिक नेतृत्व, स्वावलंबन और सम्मान का वरदान",
      icon: "👑",
      keyHighlight: keyYogas[0] ? keyYogas[0].name : "कुदरत का वरदान और राजयोग प्रभाव",
      paragraphs: [
        keyYogas[0]
          ? `शास्त्रों में महर्षि पराशर कहते हैं कि जब शुभ ग्रह केंद्र और त्रिकोण के साथ सामंजस्य बनाते हैं, तो जीवन में दिव्य योगों का प्राकट्य होता है। आपकी कुंडली में विशेष रूप से '${keyYogas[0].name}' सक्रिय है। ${keyYogas[0].description} इसका मानवीय जीवन में अर्थ यह है कि आपका ज्ञान, आपकी प्रामाणिकता और आपकी स्वतंत्र सोच ही समाज में आपके सर्वोच्च सम्मान का कारण बनेगी। जब भी आप अपने मनपसंद कार्य में पूरी निष्ठा से उतरते हैं, तो ब्रह्मांड आपके आगे सफलता के बंद द्वार अपने आप खोलने लगता है।`
          : `आपकी कुंडली में केंद्र और त्रिकोण का मजबूत संतुलन यह संकेत देता है कि आपका काम ही आपकी वास्तविक पहचान बनेगा।`,
        keyYogas[1]
          ? `इसके साथ ही, कुंडली में '${keyYogas[1].name}' की उपस्थिति आपके व्यक्तित्व में एक विशेष तेज स्थापित करती है। ${keyYogas[1].description} ${keyYogas[1].shastricSignificance} लोग जटिल और संवेदनशील मामलों में आपसे राय लेना पसंद करेंगे, और आपकी सलाह में एक स्वाभाविक वजन और दूरदर्शिता होगी।`
          : `आपकी कुंडली में सूर्य और लग्नपति का प्रभाव आपको अपने क्षेत्र में एक स्वाभिमानी और स्वतंत्र नेतृत्वकर्ता के रूप में प्रतिष्ठित करता है।`,
        `भाव ${rahuHouse} में राहु और भाव ${p.Jupiter?.house || 9} में देवगुरु का प्रभाव यह स्पष्ट रेखांकित करता है कि आपका उत्थान पारंपरिक सीमाओं तक सीमित नहीं रहेगा। आधुनिक प्लेटफॉर्म्स, बौद्धिक संपदा और वैश्विक विचार आपके जीवन में समय-समय पर आकर आपकी आर्थिक और सामाजिक स्थिति को एक नया स्तर देंगे।`
      ]
    },

    // ── CHAPTER 4 ─────────────────────────────────────────────────────────────
    {
      pillarNum: 4,
      pillarTitle: "चतुर्थ अध्याय: कार्मिक चक्रव्यूह और जीवन की वास्तविक चुनौतियाँ",
      chapterSubtitle: "कंटक शनि का रहस्य, वाणी का मौन, नींद की रक्षा और सट्टा-प्रलोभन से बचने का अनुशासन",
      icon: "⚡",
      keyHighlight: saturnMoonTitle,
      paragraphs: [
        `हर शक्तिशाली और गहरी कुंडली अपने साथ कुछ सूक्ष्म कार्मिक परीक्षाएं भी लेकर आती है, और उन परीक्षाओं को समय रहते समझ लेना ही एक परिपक्व साधक की पहचान है। आपकी कुंडली का सबसे महत्वपूर्ण शास्त्रीय मर्म चंद्रमा और शनि देव के परस्पर संबंध से प्रकट होता है।`,
        `${saturnMoonDesc}`,
        `लेकिन यह समझना अत्यंत आवश्यक है कि इस कार्मिक प्रभाव का एक बहुत बड़ा गुप्त वरदान भी है! यह योग जातक को कभी सतही नहीं रहने देता; यह व्यक्ति को एक 'गंभीर चिंतक, तपोनिष्ठ विशेषज्ञ और सिद्ध शिल्पी' बना देता है। जब इंसान बाहर की दुनिया के निरर्थक शोर से कटकर अपने एकांत में बैठता है, तभी वह किसी कालजयी कृति या मास्टरपीस का निर्माण कर पाता है। यह अनुशासन ही आपकी उस गहरी एकाग्रता की गुप्त चाबी है।`,
        `दूसरी बड़ी कार्मिक चुनौती ${HOUSE_NAMES_HINDI[rahuHouse]} में बैठे ${rahuHindi} से आती है। राहु देव का एक स्वाभाविक प्रभाव भ्रम और जल्दबाज़ी का होता है — यह कई बार क्रिप्टो, शेयर बाजार या शॉर्टकट सट्टेबाज़ी में तुरंत भारी मुनाफे का प्रलोभन दिखाता है, अथवा आवेश में आकर कुछ ऐसा बोल देने की उत्तेजना पैदा करता है जिससे अपने ही लोग आहत हो जाएं। यहाँ शास्त्र आपको स्पष्ट चेतावनी देते हैं: शॉर्टकट और सट्टे से सदैव 100% दूर रहें; किसी भी उत्तेजना के क्षण में ठीक 5 सेकंड का मौन रखें। आपका धन आपकी प्रतिभा, तकनीक और धैर्यवान मेहनत से ही स्थायी बनेगा।`
      ]
    },

    // ── CHAPTER 5 ─────────────────────────────────────────────────────────────
    {
      pillarNum: 5,
      pillarTitle: "पंचम अध्याय: समय का प्रवाह — महादशा चक्र और आने वाले स्वर्णिम मोड़",
      chapterSubtitle: `${dashaTimeline.activeMahadasha} का वर्तमान प्रवाह, अंतर्दशा की छलांग और आगामी स्वर्णिम शिखर`,
      icon: "⏳",
      keyHighlight: `${dashaTimeline.activeMahadashaSpan}: सक्रिय दशा चक्र जीवन में निर्णायक मोड़ ला रहा है`,
      paragraphs: [
        `वर्तमान में आप ${dashaTimeline.activeMahadasha} (${dashaTimeline.activeMahadashaSpan}) से गुज़र रहे हैं। यह महादशा आपके जीवन का एक बहुत बड़ा कायाकल्प (Transformation) काल है। इसने आपको पुराने दायरे से बाहर निकाला है, आपके सोचने के फलक को विस्तृत किया है, और आपको जीवन की वास्तविक प्राथमिकताओं से जोड़ा है।`,
        `वर्तमान में सक्रिय ${dashaTimeline.activeAntardasha} (${dashaTimeline.activeAntardashaSpan}) आपके जीवन का एक अत्यंत निर्णायक मोड़ है। ज्योतिष शास्त्र कहता है कि जब सक्रिय अंतर्दशा कर्म और पुरुषार्थ को जागृत करती है, तो व्यक्ति के जीवन में नए वेंचर्स, प्रतिष्ठा का विस्तार और आत्मनिर्भरता का आधार तय होता है। ${dashaTimeline.currentPhaseInsight} यह समय संकोच या आलस्य में बैठने का नहीं, बल्कि अपने सबसे महत्वपूर्ण प्रोजेक्ट्स को धरातल पर उतारने का है।`,
        `इसके उपरांत, ${dashaTimeline.upcomingGoldenPhaseTitle} (${dashaTimeline.upcomingGoldenPhaseWindow}) आपके जीवन में एक अभूतपूर्व स्वर्णिम अध्याय की शुरुआत करेगा। ${dashaTimeline.upcomingGoldenPhaseInsight} यह समय आपकी संचित मेहनत को सामाजिक मान्यता और भौतिक समृद्धि में बदलने वाला साबित होगा।`
      ]
    },

    // ── CHAPTER 6 ─────────────────────────────────────────────────────────────
    {
      pillarNum: 6,
      pillarTitle: "षष्ठ अध्याय: जीवन को साधने वाले अचूक उपाय और दैनिक आचरण",
      chapterSubtitle: "कंटक शांति, रत्न का अंतिम निर्णय, ठोस चांदी का सुरक्षा कवच और 5-सेकंड मौन",
      icon: "🕉️",
      keyHighlight: `${remedies.gemstoneVerdict.strictProhibition} — ${remedies.spiritualPractices[1]?.practice || "शनिवार हनुमान साधना"}`,
      paragraphs: [
        `उपायों को केवल कर्मकांड या अंधविश्वास की तरह नहीं, बल्कि अपने जीवन को ब्रह्मांडीय ऊर्जा के साथ तालमेल में बिठाने के विज्ञान की तरह समझिए। सबसे पहले शनि के प्रभाव और कार्मिक चुभन को शांत करने का अचूक उपाय समझिए: शनिवार के दिन हनुमान चालीसा, सुंदरकांड या हनुमान बाहुक का पाठ करें। शनिवार की शाम किसी ज़रूरतमंद, सफाई कर्मचारी या नंगे पैर काम करने वाले श्रमिक को चप्पल, जूते या भोजन का आदरपूर्वक दान करें। श्रमजीवियों के सम्मान और सेवा से शनि का हर कष्ट तुरंत सुरक्षा कवच में बदल जाता है।`,
        `रत्न के विषय पर शास्त्र की बात को पत्थर की लकीर मान लीजिए: ${remedies.gemstoneVerdict.strictProhibition} ${remedies.gemstoneVerdict.prohibitionReason} इसके विपरीत, आपके लिए सबसे सुरक्षित और वरदान-तुल्य रत्न: ${remedies.gemstoneVerdict.recommendedGems.join(" तथा ")}। ${remedies.gemstoneVerdict.wearingInstructions}`,
        `लाल किताब और धातु विज्ञान का एक गुप्त और अत्यंत प्रभावी नियम आपके लिए काम करता है: ${remedies.metalRemedies[0]?.item} का प्रयोग। ${remedies.metalRemedies[0]?.method} चांदी का यह स्पर्श राहु और चंद्र के द्वंद्व को शांत कर धन और बुद्धि में अद्भुत स्थिरता देता है। साथ ही, प्रातःकाल तांबे के लोटे से सूर्य नारायण को अर्घ्य देना आपके आत्मबल और समाज में सम्मान को निरंतर प्रदीप्त रखेगा।`,
        `अपने अंतर्मन को शांत रखने के लिए अपने नक्षत्र के अधिष्ठाता देव (${nakMeta.deity}) और भगवान शिव की नियमित उपासना करें। और आचरण का एक स्वर्णिम नियम अपना लें: जब भी किसी बात पर अचानक तीव्र क्रोध या बेचैनी आए, बोलने से पहले केवल 5 सेकंड का पूर्ण मौन रखें। यह 5 सेकंड का मौन आपकी कुंडली के कई बड़े संकटों को शुरू होने से पहले ही समाप्त कर देगा।`
      ]
    },

    // ── CHAPTER 7 ─────────────────────────────────────────────────────────────
    {
      pillarNum: 7,
      pillarTitle: "सप्तम अध्याय: वर्तमान आकाश — इस समय ब्रह्मांड आपके साथ क्या कर रहा है?",
      chapterSubtitle: `लाइव गोचर: शनि व गुरु का वर्तमान भ्रमण, गोचर प्रभाव और तात्कालिक मार्गदर्शन`,
      icon: "🌌",
      keyHighlight: gocharAnalysis.sadeSatiStatus.phase,
      paragraphs: [
        `जिस समय आप यह विश्लेषण पढ़ रहे हैं, उस समय आकाश में शनि देव ${gocharAnalysis.majorPlanets[0]?.transitSign || "मीन राशि"} में भ्रमण कर रहे हैं। आपके जन्म लग्न (${SIGN_NAMES_HINDI[lagnaRashiName]}) से यह भाव ${gocharAnalysis.majorPlanets[0]?.transitHouseFromLagna || 3} में और आपकी जन्म चंद्र राशि (${SIGN_NAMES_HINDI[moonSignName]}) से भाव ${gocharAnalysis.majorPlanets[0]?.transitHouseFromMoon || 6} में गोचर कर रहे हैं। ${gocharAnalysis.sadeSatiStatus.description}`,
        `शनि देव का यह गोचर आपको बहुत स्पष्ट निर्देश दे रहा है: किसी भी कार्य में शॉर्टकट न लें, कानूनी व वित्तीय कागजात में पूरी सतर्कता बरतें, और अपनी सेहत व दिनचर्या में लापरवाही न करें। जब भी जीवन में गति थोड़ी धीमी लगे, तो समझें कि ब्रह्मांड आपके काम की मजबूती की परीक्षा ले रहा है। जो सिस्टम, जो रिश्ते और जो काम आप इस समय धैर्यपूर्वक परखकर बनाएंगे, वह जीवनभर कभी डगमगाएगा नहीं।`,
        `इसके साथ ही, देवगुरु बृहस्पति का अनुकूल गोचर और राहु-केतु का परिवर्तन आपके बौद्धिक क्षितिज को नए आयाम दे रहा है। ब्रह्मांड इस समय आपको छोटी-मोटी भागदौड़ से रोककर दूरगामी लीजेंड्री काम करने के लिए तैयार कर रहा है। अपने अंतर्मन की आवाज पर भरोसा रखिए, अपने कार्य में तल्लीन रहिए और सतत आगे बढ़िए — यह समय आपके भीतर एक नया इतिहास रचने की तैयारी कर रहा है।`
      ]
    }
  ];

  return {
    birthProfile,
    planetaryMatrix,
    keyYogas,
    karmicVulnerabilities,
    dashaTimeline,
    remedies,
    gocharAnalysis,
    storytellingChapters,
  };
}
