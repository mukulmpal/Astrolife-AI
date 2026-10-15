// src/lib/astro-engine/ketu-synergy-circuit.ts
// ============================================================
// ASTROLIFE KETU SYNERGY & ANTI-PR PARADOX ENGINE
// Generalizes Ketu's Conjunction Dynamics across ALL Planets
// Explains the "Detached Mastery / Anti-PR Paradox":
// Why Micromanagement & Aggressive PR Destroy Manifestation,
// and Why Effortless Detachment Unlocks World-Class Mastery.
// ============================================================

export type ClassicPlanetWithLagna = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Lagna";

export interface KetuPlanetSynergyTemplate {
  planet: ClassicPlanetWithLagna;
  titleHinglish: string;
  innateMasteryHinglish: string;
  theAntiPrTrapHinglish: string;
  activationSecretHinglish: string;
  careerKeywords: string[];
}

export const KETU_SYNERGY_REGISTRY: Record<string, KetuPlanetSynergyTemplate> = {
  Sun: {
    planet: "Sun",
    titleHinglish: "The Uncrowned Sovereign (अनाम सम्राट आर्केटाइप)",
    innateMasteryHinglish:
      "सूर्य के साथ केतु होने पर व्यक्ति के भीतर जन्मजात अधिकार, राजा जैसी गरिमा और नेतृत्व का गुण होता है, किंतु उसे औपचारिक उपाधियों, मंचों और तालियों की कोई भूख नहीं होती।",
    theAntiPrTrapHinglish:
      "यदि यह व्यक्ति अपने नाम का ढिंढोरा पीटने, पीआर स्टंट्स करने या 'लोग क्या कहेंगे' के डर में प्रतिष्ठा बचाने की कोशिश करेगा, तो सूर्य की ऊर्जा तुरंत कुंठित होकर अपमान लाएगी।",
    activationSecretHinglish:
      "अनाम रहकर, निःस्वार्थ भाव से समाज को दिशा दें। पद की लालसा छोड़ते ही पूरा समाज स्वतः आपके आगे नतमस्तक होगा।",
    careerKeywords: ["Anonymous Philanthropist", "Statesman Kingmaker", "Spiritual Leader", "Silent Founder"]
  },

  Moon: {
    planet: "Moon",
    titleHinglish: "The Sovereign Hermit (भावनात्मक संप्रभुता बनाम एकांत)",
    innateMasteryHinglish:
      "चंद्रमा के साथ केतु मन को बाहरी दुनिया के शोर से काटकर गहरे आंतरिक अभयारण्य में स्थापित करता है। व्यक्ति कम बातचीत और एकांत में रहकर असाधारण रूप से संतुष्ट और शांत रहता है।",
    theAntiPrTrapHinglish:
      "यदि इसे जबरन सोशल गैदरिंग्स, उथली गपशप या दिखावे के रिश्तों में घसीटा जाए, तो यह गंभीर अलगाव और डिप्रेशन जैसा महसूस करने लगता है।",
    activationSecretHinglish:
      "अपने एकांत को 'अकेलापन' न समझें, बल्कि इसे 'आध्यात्मिक संप्रभुता' बनाएं। नियमित मौन, ध्यान और जल-समीप निवास से मानसिक तेज प्रज्वलित होता है।",
    careerKeywords: ["Deep Researcher", "Monastic Thinker", "Abstract Painter", "Solitary Writer", "Mystic"]
  },

  Mars: {
    planet: "Mars",
    titleHinglish: "The Invisible Blade (मौन योद्धा / शल्य-चिकित्सक)",
    innateMasteryHinglish:
      "मंगल के साथ केतु होने पर जातक के भीतर बिना किसी शोर-शराबे के काम खत्म करने की असाधारण सर्जिकल परिशुद्धता (Surgical Precision) होती है। मार्शल आर्ट्स, सर्जरी या संकट निवारण में माहिर।",
    theAntiPrTrapHinglish:
      "व्यर्थ की बहादुरी दिखाना, सड़कों पर लड़ना या अपनी ताकत का प्रदर्शन करना मंगल-केतु के लिए आत्मघाती होता है; इससे चोट, दुर्घटना या कानूनी विवाद होते हैं।",
    activationSecretHinglish:
      "अपनी ऊर्जा को शांत, अनुशासित शिल्प में लगाएं। युद्ध केवल तब लड़ें जब कोई अन्य विकल्प न हो; आपका एक ही वार निर्णायक साबित होगा।",
    careerKeywords: ["Neurosurgeon", "Special Forces Operative", "Martial Artist", "High-Risk Troubleshooter"]
  },

  Mercury: {
    planet: "Mercury",
    titleHinglish: "The Deep-Tech Telemetrist (डीप-टेक, क्रिप्टोग्राफी व गूढ़ कोड)",
    innateMasteryHinglish:
      "बुध के साथ केतु सूक्ष्म सिग्नल्स, गैर-रेखीय कोडिंग, रडार, सोनार, सैटेलाइट टेलीमेट्री, क्रिप्टोग्राफी और मशीन-लर्निंग एल्गोरिदम की जन्मजात समझ देता है।",
    theAntiPrTrapHinglish:
      "यदि यह व्यक्ति सामान्य अकादमिक रटने की व्यवस्था या औपचारिक सेल्स-मार्केटिंग में फंसेगा, तो इसका दिमाग भ्रमित और तनावग्रस्त हो जाएगा।",
    activationSecretHinglish:
      "जटिल अमूर्त पहेलियों और डीप-टेक आर्किटेक्चर पर काम करें। सामान्य बातचीत में समय बर्बाद न करें; कोड और गणित ही आपकी भाषा है।",
    careerKeywords: ["Cryptography Engineer", "HFT Algorithm Architect", "Radar/Sonar Specialist", "Data Scientist"]
  },

  Jupiter: {
    planet: "Jupiter",
    titleHinglish: "The Gnostic Sage (प्रत्यक्ष ज्ञान / अपरोक्ष अनुभूति)",
    innateMasteryHinglish:
      "बृहस्पति के साथ केतु औपचारिक पोथियों और धार्मिक पाखंड से परे सीधा ब्रह्मांडीय सत्य (Direct Gnosis) अनुभव करने की शक्ति देता है। उच्च कोटि का दार्शनिक।",
    theAntiPrTrapHinglish:
      "रूढ़िवादी मठों, मंदिर की राजनीति या धार्मिक व्यापार में फंसना इस योग का पतन कराता है।",
    activationSecretHinglish:
      "आडंबरहीन सादगी अपनाएं। अपने ज्ञान को बिना किसी स्वार्थ के जिज्ञासुओं में बांटें; सरस्वती का वरदान सदा बना रहेगा।",
    careerKeywords: ["Spiritual Philosopher", "Vedic Scholar", "Ethical Jurist", "Higher Consciousness Guide"]
  },

  Venus: {
    planet: "Venus",
    titleHinglish: "The Aesthetic Minimalist (निर्मल सौंदर्य व अनासक्त वैभव)",
    innateMasteryHinglish:
      "शुक्र के साथ केतु जातक को सौंदर्य और कला की अत्यंत परिष्कृत, न्यूनतमवादी (Minimalist) दृष्टि देता है। धन सृजन में कुशल, किंतु विलासिता के प्रति आसक्ति-शून्य।",
    theAntiPrTrapHinglish:
      "यदि व्यक्ति अंधाधुंध भोग-विलास, दिखावे के आभूषणों (जैसे जबरन भारी हीरा पहनना) या वासना में लिप्त होगा, तो शुक्र की शांति और स्वास्थ्य दोनों नष्ट होंगे।",
    activationSecretHinglish:
      "सादगी में सौंदर्य खोजें। हीरे के बजाय ग्रीन टाइगर आई या वैदूर्य धारण करें; धन को विलासिता नहीं, सेवा और कला का साधन बनाएं।",
    careerKeywords: ["Minimalist Architect", "High-End Textile Designer", "Unattached Financier", "Fine Arts Curator"]
  },

  Saturn: {
    planet: "Saturn",
    titleHinglish: "The Silent Ascetic Craftsman (कर्मयोगी शिल्पकार)",
    innateMasteryHinglish:
      "शनि के साथ केतु किसी भी कार्य में दशकों तक बिना किसी प्रशंसा या फल की इच्छा के अथक साधना करने की क्षमता देता है। क्लासिक कर्मयोग।",
    theAntiPrTrapHinglish:
      "कॉर्पोरेट राजनीति, क्रेडिट हड़पने की होड़ या शॉर्टकट से सफलता पाने की कोशिश इस योग को ब्लॉक कर देती है।",
    activationSecretHinglish:
      "अपने शिल्प में लीन रहें। दुनिया आपके काम को देर से पहचानेगी, लेकिन जब पहचानेगी तो इतिहास दर्ज होगा।",
    careerKeywords: ["Master Artisan", "Heritage Restorer", "Geological Surveyor", "Monastic Administrator"]
  },

  Lagna: {
    planet: "Lagna",
    titleHinglish: "The Sovereign Autonomous Soul (स्वतंत्र विरक्त आत्मा)",
    innateMasteryHinglish:
      "लग्न में केतु होने पर व्यक्ति किसी के अधीन रहकर काम नहीं कर सकता। वह अपने क्षेत्र में सर्वोच्च, स्वतंत्र बॉस बनने के लिए ही पैदा हुआ है।",
    theAntiPrTrapHinglish:
      "नौकरी में मध्य-स्तरीय चापलूसी करना या सामाजिक मान्यताओं के दबाव में अपनी मौलिक पहचान को दबाना घोर मानसिक पीड़ा लाता है।",
    activationSecretHinglish:
      "स्वतंत्र उद्यम, फ्रीलांसिंग, सलाहकारी या अपनी खुद की कंपनी का नेतृत्व संभालें। स्वायत्तता ही आपका प्राण है।",
    careerKeywords: ["Independent Founder", "Principal Consultant", "Free Agent", "Pioneering Visionary"]
  }
};

export interface KetuSynergyEvaluation {
  hasKetuConjunction: boolean;
  conjoinedPlanet?: ClassicPlanetWithLagna;
  isConjoinedPlanetExalted?: boolean;
  profile?: KetuPlanetSynergyTemplate;
  paradoxHeadlineHinglish?: string;
  antiPrWarningHinglish?: string;
  flowTriggerHinglish?: string;
  heatBalanceNakshatraNotes?: string;
}

/**
 * Evaluates whether Ketu is conjunct any planet in natal or divisional charts
 * and surfaces the specific Anti-PR Effortless Mastery rule.
 */
export function evaluateKetuSynergy(
  conjoinedPlanetName: string,
  planetDignity?: string,
  ketuNakshatra?: string
): KetuSynergyEvaluation {
  const profile = KETU_SYNERGY_REGISTRY[conjoinedPlanetName];
  if (!profile) {
    return { hasKetuConjunction: false };
  }

  const isExalted = planetDignity === "Exalted";

  // Ketu Nakshatra Heat-Balance insight (Ashwini, Magha, Mula)
  let heatBalance = "";
  if (ketuNakshatra === "Ashwini" || ketuNakshatra === "Magha" || ketuNakshatra === "Mula") {
    heatBalance = `केतु नक्षत्र (${ketuNakshatra}): अग्नि और चेतना का सटीक संतुलन। यह गंडांत सीमा का नक्षत्र होने के कारण जातक को जीवन के किसी मोड़ पर पुरानी पहचान पूरी तरह त्यागकर नए उच्च आयाम में प्रवेश कराता है।`;
  }

  return {
    hasKetuConjunction: true,
    conjoinedPlanet: conjoinedPlanetName as any,
    isConjoinedPlanetExalted: isExalted,
    profile,
    paradoxHeadlineHinglish: isExalted
      ? `महा-केतु योग: ${conjoinedPlanetName} उच्च + केतु (The Effortless Midas)`
      : `केतु युति: ${profile.titleHinglish}`,
    antiPrWarningHinglish: `${profile.theAntiPrTrapHinglish} ${isExalted ? "ग्रह उच्च होने के कारण इसका फल तब तक अवरुद्ध रहेगा जब तक आप परिणाम की आसक्ति नहीं छोड़ते।" : ""}`,
    flowTriggerHinglish: profile.activationSecretHinglish,
    heatBalanceNakshatraNotes: heatBalance || undefined
  };
}

