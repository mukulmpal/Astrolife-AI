// src/lib/astro-engine/functional-debility-guard.ts
// ============================================================
// ASTROLIFE FUNCTIONAL DEBILITY & GEMSTONE FALLACY ENGINE
// Generalizes the "Debilitated Planet as Functional Superpower" across ALL 7 Planets
// Prevents the Fatal Mistake of prescribing Gemstones that destroy the Native's
// Professional, Psychological, or Bargaining Edge.
// ============================================================

import type { Planet, ZodiacSign } from "./gemstone";

export interface DebilitySuperpowerProfile {
  planet: Planet;
  debilitatedSign: ZodiacSign;
  debilitatedSignNum: number;
  classicalDebilityMyth: string;
  functionalSuperpowerHinglish: string;
  thrivingProfessions: string[];
  fatalGemstone: string;
  whyGemstoneIsFatalHinglish: string;
  safeAlternativeRemedies: {
    stoneOrMetal: string;
    actionPractice: string;
    karmicAlignment: string;
  };
}

export const FUNCTIONAL_DEBILITY_REGISTRY: Record<string, DebilitySuperpowerProfile> = {
  Venus: {
    planet: "Venus",
    debilitatedSign: "Virgo",
    debilitatedSignNum: 5,
    classicalDebilityMyth: "शुक्र नीच का है, विवाह टूटेगा और धन का भारी नुकसान होगा।",
    functionalSuperpowerHinglish:
      "अति-तार्किक, सूक्ष्म विवरणों का पारखी, भावुकता-शून्य और सौदेबाज़ी में निष्ठुर ('भाव भगवान छे')। पाई-पाई का हिसाब रखने और कमियां पकड़ने की अद्वितीय क्षमता।",
    thrivingProfessions: [
      "Tax Lawyer & Dispute Advocate",
      "Day Trader & Scalper",
      "Forensic Auditor & Chartered Accountant",
      "Diamond Grader & Gemstone Appraiser",
      "Bankruptcy Arbitrator & Cost Cutter"
    ],
    fatalGemstone: "Diamond (Heera) / White Sapphire",
    whyGemstoneIsFatalHinglish:
      "हीरा विलासिता, शांति, संतोष और विवाद-विमुखता (non-confrontation) उत्पन्न करता है। इसे पहनते ही वकील या ट्रेडर बोलेगा 'मुझे कोर्ट-कचहरी और लड़ाई-झगड़ा पसंद नहीं'। उसकी आक्रामक सौदेबाजी और पैनी नजर समाप्त हो जाएगी।",
    safeAlternativeRemedies: {
      stoneOrMetal: "Green Tiger Eye, Pyrite, or White Cat's Eye (वैदूर्य)",
      actionPractice: "शुक्र-केतु युति में अनासक्ति बनाए रखें; शनिवार को नमक नियंत्रित करें।",
      karmicAlignment: "क्लाइंट्स के वित्तीय विवाद सुलझाते हुए निष्पक्ष रहें; व्यक्तिगत प्रेम में ऑडिटिंग न करें।"
    }
  },

  Mercury: {
    planet: "Mercury",
    debilitatedSign: "Pisces",
    debilitatedSignNum: 11,
    classicalDebilityMyth: "बुध नीच का है, जातक मूर्ख होगा, निर्णय नहीं ले पाएगा और व्यापार में डूबेगा।",
    functionalSuperpowerHinglish:
      "शुष्क लॉजिक से परे अमूर्त कल्पना (Abstract Intuition), गैर-रेखीय सोच (Non-linear thinking), गहरी कलात्मक संवेदनशीलता और रहस्यमयी संकेतों को डिकोड करने की क्षमता।",
    thrivingProfessions: [
      "Poet & Fiction Author",
      "AI Prompt Engineer & Conceptual Architect",
      "Occultist & Esoteric Astrologer",
      "Music Composer & Film Director",
      "Spiritual Healer & Intuitive Counselor"
    ],
    fatalGemstone: "Emerald (Panna)",
    whyGemstoneIsFatalHinglish:
      "पन्ना पहनते ही बायां दिमाग (Left-Brain / Rigid Logic) अति-सक्रिय हो जाता है, जिससे उसकी सहज कल्पना सूख जाती है और गंभीर मानसिक घबराहट (Overthinking & Creative Block) शुरू हो जाती है।",
    safeAlternativeRemedies: {
      stoneOrMetal: "Scapolite (तंत्रिका-थकान हेतु), Aquamarine, or Fluorite",
      actionPractice: "कन्या राशि के 6ठे भाव की शुद्धि हेतु घर से पुराने 10-वर्षीय जूते-चप्पल निकालें।",
      karmicAlignment: "लॉजिक के बजाय अंतर्ज्ञान को अभिव्यक्ति का माध्यम बनाएं। ध्यान और एकांत का सेवन करें।"
    }
  },

  Sun: {
    planet: "Sun",
    debilitatedSign: "Libra",
    debilitatedSignNum: 6,
    classicalDebilityMyth: "सूर्य नीच का है, जातक कायर होगा, पिता बीमार रहेंगे और समाज में अपमानित होगा।",
    functionalSuperpowerHinglish:
      "अहंकार-शून्यता (Zero Egoist Tyranny), गठबंधन बनाने की कला, कूटनीतिक संतुलन, और सर्वार्थ चिंतामणि के अनुसार विरोधियों को वित्तीय शक्ति और कैपिटल लेवरेज से ध्वस्त करने का सामर्थ्य।",
    thrivingProfessions: [
      "Consensus Politician & Diplomat",
      "Venture Capitalist & Private Equity Fund Manager",
      "Union Leader & Labor Negotiator",
      "Conflict Resolution Mediator",
      "NGO Founder & Collective Movement Leader"
    ],
    fatalGemstone: "Ruby (Manikya)",
    whyGemstoneIsFatalHinglish:
      "माणिक्य पहनते ही तुला के शांत संतुलन में झूठा अहंकार और आक्रामकता आ जाती है, जिससे साझेदार और निवेशक तुरंत छिटक जाते हैं और विनाशकारी टकराव शुरू हो जाता है।",
    safeAlternativeRemedies: {
      stoneOrMetal: "Red Garnet / Sunstone in Pure Copper, or Surya Arghya in Bronze",
      actionPractice: "प्रातः सूर्य को तांबे के लोटे से जल दें और 'आदित्य हृदय स्तोत्र' का पाठ करें।",
      karmicAlignment: "दूसरों को आगे रखकर पीछे से साम्राज्य नियंत्रित करें; अहंकारी प्रदर्शन न करें।"
    }
  },

  Moon: {
    planet: "Moon",
    debilitatedSign: "Scorpio",
    debilitatedSignNum: 7,
    classicalDebilityMyth: "चंद्रमा नीच का है, डिप्रेशन, पागलपन और जीवन भर का मानसिक कष्ट रहेगा।",
    functionalSuperpowerHinglish:
      "मनोवैज्ञानिक एक्स-रे विजन (Psychological X-Ray), संकट के समय असाधारण निडरता (Crisis Immunity), झूठ और धोखे को तुरंत सूंघ लेने की अंतर्दृष्टि और अंडरवर्ल्ड रहस्यों की समझ।",
    thrivingProfessions: [
      "Undercover Investigator & Intelligence Officer",
      "Trauma Psychiatrist & Psychoanalyst",
      "ICU / Emergency Trauma Surgeon",
      "Forensic Crime Scene Investigator",
      "Distressed Asset Turnaround CEO"
    ],
    fatalGemstone: "Natural Pearl (Moti)",
    whyGemstoneIsFatalHinglish:
      "मोती पहनने से वृश्चिक की गहरी रक्षात्मक सतर्कता कमजोर पड़ जाती है और जातक अत्यधिक असुरक्षित, संवेदनशील और बाहरी आघातों के प्रति रक्षाहीन हो जाता है।",
    safeAlternativeRemedies: {
      stoneOrMetal: "Moonstone mounted in Sterling Silver with a drop of Sandalwood oil",
      actionPractice: "शिवलिंग पर जल व कच्चा दूध अर्पित करें; पूर्णिमा को मौन ध्यान रखें।",
      karmicAlignment: "दूसरों के गहरे रहस्यों को गोपनीय रखें और अपनी मनोवैज्ञानिक शक्ति का उपयोग उपचार में करें।"
    }
  },

  Mars: {
    planet: "Mars",
    debilitatedSign: "Cancer",
    debilitatedSignNum: 3,
    classicalDebilityMyth: "मंगल नीच का है, रक्त विकार, कायरता और संपत्ति का विनाश होगा।",
    functionalSuperpowerHinglish:
      "अप्रत्यक्ष रणनीतिक घेराबंदी (Indirect Siege), रक्षात्मक धैर्य, मातृत्व जैसी आक्रामक सुरक्षा भावना, और सामने से लड़ने के बजाय विरोधी को थकाकर आत्म-समर्पण कराने की महारत।",
    thrivingProfessions: [
      "Cybersecurity Defense Architect",
      "Family & Child Custody Litigator",
      "Guerrilla Marketer & Defensive Strategist",
      "Real Estate Heritage Restorer",
      "Martial Arts Trainer focusing on Aikido/Defense"
    ],
    fatalGemstone: "Red Coral (Moonga)",
    whyGemstoneIsFatalHinglish:
      "मूंगा पहनते ही जल-तत्व की राशि में अग्नि का अनियंत्रित विस्फोट होता है, जिससे जातक अत्यधिक उग्र, क्रोधी होकर पारिवारिक हिंसा या रक्तचाप (Hypertension) का शिकार बनता है।",
    safeAlternativeRemedies: {
      stoneOrMetal: "Carnelian or Red Jasper set in Copper",
      actionPractice: "हनुमान चालीसा का नित्य पाठ और मंगलवार को लाल मसूर का दान।",
      karmicAlignment: "कमजोरों और बेसहारा स्त्रियों/बच्चों की रक्षा में अपना बाहुबल लगाएं।"
    }
  },

  Jupiter: {
    planet: "Jupiter",
    debilitatedSign: "Capricorn",
    debilitatedSignNum: 9,
    classicalDebilityMyth: "गुरु नीच का है, ज्ञानहीन, संतानहीन और अधर्मी जीवन होगा।",
    functionalSuperpowerHinglish:
      "धार्मिक पाखंड से मुक्त कठोर व्यावहारिकता (Grounded Pragmatism), संस्थागत अनुशासन, वित्तीय यथार्थवाद और बिना किसी झूठे आदर्शवाद के बड़ी संरचनाओं को चलाने की क्षमता।",
    thrivingProfessions: [
      "Corporate Restructuring & Liquidation Trustee",
      "Hard-Nosed CFO & Fiscal Policy Maker",
      "Constitutional Lawyer & Regulatory Compliance Officer",
      "Heavy Industry Management Consultant",
      "Pragmatic Institutional Builder"
    ],
    fatalGemstone: "Yellow Sapphire (Pukhraj)",
    whyGemstoneIsFatalHinglish:
      "पुखराज पहनने से मकर राशि की स्वाभाविक यथार्थवादी पकड़ में अव्यावहारिक नैतिक अपराध-बोध (moral guilt) और अहंकारी उपदेशात्मक वृत्ति पैदा होती है, जिससे उसके बिजनेस सौदे रुक जाते हैं।",
    safeAlternativeRemedies: {
      stoneOrMetal: "Natural Citrine or Brass/Gold Kadas",
      actionPractice: "गुरुवार को बुजुर्गों व शिक्षकों की चरण-वंदना; पीपल की परिक्रमा।",
      karmicAlignment: "ज्ञान को कर्म में बदलें; उपदेश देने के बजाय सिस्टम बनाकर न्याय करें।"
    }
  },

  Saturn: {
    planet: "Saturn",
    debilitatedSign: "Aries",
    debilitatedSignNum: 0,
    classicalDebilityMyth: "शनि नीच का है, घोर आलस्य, जेल यात्रा और नीच कर्मों में लिप्तता होगी।",
    functionalSuperpowerHinglish:
      "अधीर उद्यमशीलता (Urgent Hustle), पुरानी सड़ी-गली परंपराओं को तोड़ने का साहस, 24 घंटे लगातार काम करने की भूख, और पुराने नियमों की परवाह किए बिना नया रास्ता बनाने की जिद।",
    thrivingProfessions: [
      "Early-Stage Startup Disruptor & Agile Founder",
      "First-Generation Industrial Entrepreneur",
      "Emergency Operations Commander",
      "Disruptive Tech Builder breaking legacy monopolies",
      "Labor Movement Activist"
    ],
    fatalGemstone: "Blue Sapphire (Neelam)",
    whyGemstoneIsFatalHinglish:
      "नीलम पहनते ही मेष के तात्कालिक एक्शन पर भारी बर्फ जम जाती है, जिससे जातक अत्यधिक सुस्त, हताश और गंभीर अवसाद (Chronic Procrastination & Stagnation) में घिर जाता है।",
    safeAlternativeRemedies: {
      stoneOrMetal: "Amethyst or an Iron Ring forged from a horse shoe / boat nail",
      actionPractice: "शनिवार को विकलांगों, सफाईकर्मियों को भोजन दें और 'Buy Back Time' नियम अपनाएं।",
      karmicAlignment: "जल्दबाजी में शॉर्टकट न लें; अपने साहस को स्थायी निर्माण में बदलें।"
    }
  }
};

// ── Evaluator Function ─────────────────────────────────────────────────────────

export interface FunctionalDebilityAuditResult {
  hasFunctionalDebility: boolean;
  profile?: DebilitySuperpowerProfile;
  isProfessionAligned: boolean;
  detectedProfession?: string;
  isGemstoneContraindicated: boolean;
  contraindicatedGemstone?: string;
  warningHeadlineHinglish?: string;
  preservationVerdictHinglish?: string;
  alternativeGuidanceHinglish?: string;
}

/**
 * Checks whether a native has a debilitated planet whose raw friction is actively
 * powering their specific career or life-purpose, and warns against prescriptive gemstones.
 */
export function evaluateFunctionalDebilityGemstoneGuard(
  planetName: string,
  signName: string,
  nativeProfession?: string,
  wearingGemstone?: string
): FunctionalDebilityAuditResult {
  const profile = FUNCTIONAL_DEBILITY_REGISTRY[planetName];
  if (!profile || profile.debilitatedSign.toLowerCase() !== signName.toLowerCase()) {
    return {
      hasFunctionalDebility: false,
      isProfessionAligned: false,
      isGemstoneContraindicated: false
    };
  }

  // Check if native's stated profession matches any of the thriving roles
  const profLower = (nativeProfession || "").toLowerCase();
  const isProfessionAligned = Boolean(
    nativeProfession &&
      profile.thrivingProfessions.some((p) => profLower.includes(p.toLowerCase()) || p.toLowerCase().includes(profLower))
  );

  // Check if native is wearing or considering the fatal gemstone
  const gemLower = (wearingGemstone || "").toLowerCase();
  const isGemstoneContraindicated = Boolean(
    wearingGemstone &&
      (gemLower.includes(profile.fatalGemstone.toLowerCase()) ||
        profile.fatalGemstone.toLowerCase().includes(gemLower))
  );

  return {
    hasFunctionalDebility: true,
    profile,
    isProfessionAligned,
    detectedProfession: nativeProfession,
    isGemstoneContraindicated,
    contraindicatedGemstone: profile.fatalGemstone,
    warningHeadlineHinglish: `चेतावनी: ${planetName} नीच का होकर भी आपकी महा-शक्ति (Superpower) है!`,
    preservationVerdictHinglish: `आपका ${planetName} ${signName} में नीच है, जो कि ${profile.functionalSuperpowerHinglish} यह शक्ति आपके करियर के लिए अत्यंत आवश्यक है। इस ग्रह को 'मजबूत' करने के चक्कर में इसका पारंपरिक रत्न (${profile.fatalGemstone}) कभी न पहनें!`,
    alternativeGuidanceHinglish: `${profile.whyGemstoneIsFatalHinglish}\n\nसुरक्षित विकल्प: ${profile.safeAlternativeRemedies.stoneOrMetal} धारण करें। नियम: ${profile.safeAlternativeRemedies.actionPractice}`
  };
}

// ============================================================
// NADI ASTROLOGY DEBILITATED PLANET PEAK ZENITH ENGINE
// Based on oral discourse transcripts (Deepanshu Giri / Lunar Astro):
// "A debilitated planet will give you the maximum good results during its
// Nadi activation window and Dasha progression. For debilitated Jupiter,
// this peak comes between age 36 to 42, timed by its exact degrees."
// ============================================================

export interface NadiDebilityPeakProfile {
  planet: string;
  debilitatedSign: string;
  nadiKaraka: string;
  overallPeakAgeRange: string;
  ageStart: number;
  ageEnd: number;
  degreeSubWindows: {
    minDeg: number;
    maxDeg: number;
    ageRange: string;
    subPhaseHinglish: string;
  }[];
  peakManifestationHinglish: string;
  historicalCaseStudiesHinglish: string[];
}

export const NADI_DEBILITY_PEAK_REGISTRY: Record<string, NadiDebilityPeakProfile> = {
  Jupiter: {
    planet: "Jupiter",
    debilitatedSign: "Capricorn",
    nadiKaraka: "जीव कारक (Jiva Karaka — आत्मा, प्राण और सांसारिक अस्तित्व का शिखर)",
    overallPeakAgeRange: "36 से 42 वर्ष",
    ageStart: 36,
    ageEnd: 42,
    degreeSubWindows: [
      { minDeg: 0, maxDeg: 10, ageRange: "36 से 38 वर्ष", subPhaseHinglish: "प्रारंभिक उत्थान: नई संस्था, नए पद या बड़े सामाजिक मोड़ की नींव पड़ना।" },
      { minDeg: 10, maxDeg: 20, ageRange: "38 से 40 वर्ष", subPhaseHinglish: "मध्यम शिखर: राष्ट्रीय/अंतर्राष्ट्रीय ख्याति, ऐतिहासिक सफलता व पुरस्कार (Anthony Hopkins Model)।" },
      { minDeg: 20, maxDeg: 30, ageRange: "40 से 42 वर्ष", subPhaseHinglish: "चरम साम्राज्य: आजीवन प्रभुत्व, विशाल संगठन व स्थायी प्रतिष्ठा (Fiat Founder Model)।" }
    ],
    peakManifestationHinglish:
      "मकर का नीच गुरु शुरू में कड़ा संघर्ष और वास्तविकता का पाठ पढ़ाता है, परंतु 36 से 42 वर्ष की आयु में जातक को जीवन के सर्वोच्च शिखर पर पहुँचा देता है।",
    historicalCaseStudiesHinglish: [
      "सर एंथनी हॉपकिंस (Sir Anthony Hopkins): गुरु मकर में 19° 30' पर नीच। ठीक 38 से 41 वर्ष की आयु (1975) में 5 क्लासिक फिल्मों से वैश्विक स्टारडम मिला।",
      "फिएट (FIAT) के संस्थापक (जियोवानी एग्नेली): वक्री गुरु मकर में 02° 04' पर नीच। 41 वर्ष की आयु में FIAT शीर्ष पर पहुंची और उन्हें आजीवन सीनेटर बनाया गया।",
      "अमेरिकी नोबेल पुरस्कार विजेता: 9वें भाव का स्वामी गुरु 7वें (मकर) में नीच होकर 40 वर्ष की आयु में नोबेल पुरस्कार दिलाया।"
    ]
  },

  Venus: {
    planet: "Venus",
    debilitatedSign: "Virgo",
    nadiKaraka: "धन व काम कारक (Dhana & Kama Karaka — लिक्विड वेल्थ व वित्तीय साम्राज्य)",
    overallPeakAgeRange: "25 से 30 वर्ष",
    ageStart: 25,
    ageEnd: 30,
    degreeSubWindows: [
      { minDeg: 0, maxDeg: 10, ageRange: "25 से 27 वर्ष", subPhaseHinglish: "वित्तीय समझ और स्वतंत्र सौदेबाजी का उदय।" },
      { minDeg: 10, maxDeg: 20, ageRange: "27 से 28 वर्ष", subPhaseHinglish: "आकस्मिक बड़ा धन लाभ व मार्केट में पकड़।" },
      { minDeg: 20, maxDeg: 30, ageRange: "29 से 30 वर्ष", subPhaseHinglish: "स्थायी वित्तीय संप्रभुता व भौतिक संपत्तियों का संचय।" }
    ],
    peakManifestationHinglish:
      "कन्या का नीच शुक्र भावना-शून्य कठोर सौदेबाजी और पाई-पाई का हिसाब रखने की शक्ति देता है। 25 से 30 वर्ष में भारी वित्तीय उत्थान कराता है।",
    historicalCaseStudiesHinglish: [
      "शीर्ष डे-ट्रेडर्स और टैक्स वकीलों की कुंडलियों में नीच शुक्र 27-28 वर्ष में स्वतंत्र वित्तीय सफलता देता है।"
    ]
  },

  Saturn: {
    planet: "Saturn",
    debilitatedSign: "Aries",
    nadiKaraka: "कर्म व तप कारक (Karma & Shrama Karaka — सत्ता व श्रम का रूपांतरण)",
    overallPeakAgeRange: "36 से 40 वर्ष",
    ageStart: 36,
    ageEnd: 40,
    degreeSubWindows: [
      { minDeg: 0, maxDeg: 10, ageRange: "36 से 37 वर्ष", subPhaseHinglish: "पुराने संघर्षों की समाप्ति और नए अधिकार क्षेत्र का मिलना।" },
      { minDeg: 10, maxDeg: 20, ageRange: "38 से 39 वर्ष", subPhaseHinglish: "कठोर प्रशासनिक नियंत्रण व जनसमर्थन का शिखर।" },
      { minDeg: 20, maxDeg: 30, ageRange: "39 से 40 वर्ष", subPhaseHinglish: "अचल संपत्ति व दीर्घकालिक सत्ता का स्थायित्व।" }
    ],
    peakManifestationHinglish:
      "मेष का नीच शनि जातक से अत्यधिक पसीना बहवाता है, लेकिन 36 से 40 वर्ष में जातक को अपनी इंडस्ट्री का सबसे अनुभवी और अजेय महारथी बना देता है।",
    historicalCaseStudiesHinglish: [
      "औद्योगिक घरानों और भारी विनिर्माण उद्योगपतियों के चार्ट में नीच शनि 36 वर्ष के बाद कभी पीछे मुड़कर नहीं देखने देता।"
    ]
  },

  Mars: {
    planet: "Mars",
    debilitatedSign: "Cancer",
    nadiKaraka: "पराक्रम व उद्यम कारक (Parakrama Karaka — सामरिक विजय व स्वतंत्र उद्यम)",
    overallPeakAgeRange: "28 से 32 वर्ष",
    ageStart: 28,
    ageEnd: 32,
    degreeSubWindows: [
      { minDeg: 0, maxDeg: 10, ageRange: "28 से 29 वर्ष", subPhaseHinglish: "स्वतंत्र प्रोजेक्ट या भूमि/उद्यम की शुरुआत।" },
      { minDeg: 10, maxDeg: 20, ageRange: "30 से 31 वर्ष", subPhaseHinglish: "प्रतिद्वंदियों पर अप्रत्यक्ष रणनीतिक विजय।" },
      { minDeg: 20, maxDeg: 30, ageRange: "31 से 32 वर्ष", subPhaseHinglish: "स्थिर साम्राज्य और पारिवारिक सुरक्षा का निर्माण।" }
    ],
    peakManifestationHinglish:
      "कर्क का नीच मंगल सामने से लड़ने के बजाय घेरकर थकाने की कला देता है। 28 से 32 वर्ष में अचल संपत्ति और सामरिक उद्यम में चरम ऊंचाई देता है।",
    historicalCaseStudiesHinglish: [
      "डिफेंस कॉन्ट्रैक्टर्स, रियल एस्टेट डेवलपर्स और साइबर सुरक्षा रणनीतिकारों में नीच मंगल का असाधारण उत्थान।"
    ]
  },

  Sun: {
    planet: "Sun",
    debilitatedSign: "Libra",
    nadiKaraka: "आत्मा व सत्ता कारक (Atma & Power Karaka — बिना अहंकार की कूटनीतिक सत्ता)",
    overallPeakAgeRange: "48 से 52 वर्ष (प्रारंभिक: 21 से 24 वर्ष)",
    ageStart: 48,
    ageEnd: 52,
    degreeSubWindows: [
      { minDeg: 0, maxDeg: 15, ageRange: "48 से 50 वर्ष", subPhaseHinglish: "गठबंधन, बोर्डरूम नियंत्रण और वित्तीय कूटनीति का चरम।" },
      { minDeg: 15, maxDeg: 30, ageRange: "50 से 52 वर्ष", subPhaseHinglish: "राष्ट्रीय/अंतर्राष्ट्रीय स्तर पर सर्वमान्य नेतृत्व।" }
    ],
    peakManifestationHinglish:
      "तुला का नीच सूर्य अहंकार-शून्य संतुलन और कैपिटल लेवरेज से काम कराता है। 48 से 52 वर्ष में जातक को पर्दे के पीछे का महा-नियंत्रक बनाता है।",
    historicalCaseStudiesHinglish: [
      "प्रमुख प्राइवेट इक्विटी पार्टनर्स और कूटनीतिज्ञों में नीच सूर्य का परिपक्व आयु में अप्रत्याशित उत्थान।"
    ]
  },

  Mercury: {
    planet: "Mercury",
    debilitatedSign: "Pisces",
    nadiKaraka: "धी व व्यापार कारक (Intellect & Commerce Karaka — अमूर्त व गैर-रेखीय प्रतिभा)",
    overallPeakAgeRange: "32 से 35 वर्ष",
    ageStart: 32,
    ageEnd: 35,
    degreeSubWindows: [
      { minDeg: 0, maxDeg: 10, ageRange: "32 से 33 वर्ष", subPhaseHinglish: "अमूर्त सोच व नए कलात्मक/टेक कांसेप्ट का जन्म।" },
      { minDeg: 10, maxDeg: 20, ageRange: "33 से 34 वर्ष", subPhaseHinglish: "रचनात्मक क्रांति व वैश्विक पहचान।" },
      { minDeg: 20, maxDeg: 30, ageRange: "34 से 35 वर्ष", subPhaseHinglish: "बौद्धिक संपदा (IP/Copyright) का कमर्शियल साम्राज्य।" }
    ],
    peakManifestationHinglish:
      "मीन का नीच बुध शुष्क लॉजिक से परे जादुई अंतर्ज्ञान देता है। 32 से 35 वर्ष में टेक, सिनेमा, या साहित्य में मील का पत्थर साबित होता है।",
    historicalCaseStudiesHinglish: [
      "अल्बर्ट आइंस्टीन के चार्ट में नीच बुध ने गैर-रेखीय सोच से सापेक्षता के सिद्धांत (Relativity) को जन्म दिया।"
    ]
  },

  Moon: {
    planet: "Moon",
    debilitatedSign: "Scorpio",
    nadiKaraka: "मन व पुनर्जन्म कारक (Manas & Transformation Karaka — संकट से पार पाने का सामर्थ्य)",
    overallPeakAgeRange: "24 से 28 वर्ष",
    ageStart: 24,
    ageEnd: 28,
    degreeSubWindows: [
      { minDeg: 0, maxDeg: 10, ageRange: "24 से 25 वर्ष", subPhaseHinglish: "मानसिक टूटन से उबरकर अदम्य इच्छाशक्ति का उदय।" },
      { minDeg: 10, maxDeg: 20, ageRange: "26 से 27 वर्ष", subPhaseHinglish: "रहस्यों और विपरीत परिस्थितियों पर पूर्ण मनोवैज्ञानिक नियंत्रण।" },
      { minDeg: 20, maxDeg: 30, ageRange: "27 से 28 वर्ष", subPhaseHinglish: "स्थिर संवेदनशीलता व दूसरों के संकटमोचक बनना।" }
    ],
    peakManifestationHinglish:
      "वृश्चिक का नीच चंद्रमा संकट के समय 'इमरजेंसी डॉक्टर' जैसी निडरता देता है। 24 से 28 वर्ष में जातक को मनोवैज्ञानिक रूप से अजेय बनाता है।",
    historicalCaseStudiesHinglish: [
      "मनोचिकित्सकों, खुफिया अधिकारियों और टर्न-अराउंड लीडर्स में नीच चंद्रमा की असाधारण क्राइसिस-इम्यूनिटी।"
    ]
  }
};

export interface NadiDebilityEvaluationResult {
  hasDebilitatedPlanet: boolean;
  evaluatedPlanets: {
    planet: string;
    sign: string;
    degree: number;
    profile: NadiDebilityPeakProfile;
    matchedSubWindow: string;
    subPhaseDetail: string;
    actionableAdviceHinglish: string;
  }[];
}

/**
 * Evaluates any chart for debilitated planets and outputs their exact Nadi Peak Zenith Windows.
 */
export function evaluateNadiDebilityPeak(chart: ChartData | null | undefined): NadiDebilityEvaluationResult {
  if (!chart || !chart.planets) {
    return { hasDebilitatedPlanet: false, evaluatedPlanets: [] };
  }

  const results: NadiDebilityEvaluationResult["evaluatedPlanets"] = [];

  for (const [planetName, pData] of Object.entries(chart.planets)) {
    const profile = NADI_DEBILITY_PEAK_REGISTRY[planetName];
    if (!profile) continue;

    if (pData.sign.toLowerCase() === profile.debilitatedSign.toLowerCase()) {
      const deg = pData.degree || 0;
      const matched = profile.degreeSubWindows.find((w) => deg >= w.minDeg && deg < w.maxDeg) || profile.degreeSubWindows[0]!;

      results.push({
        planet: planetName,
        sign: pData.sign,
        degree: deg,
        profile,
        matchedSubWindow: matched.ageRange,
        subPhaseDetail: matched.subPhaseHinglish,
        actionableAdviceHinglish: `आपका ${planetName} ${pData.sign} में नीच का है। नाड़ी ज्योतिष अनुसार यह दोष नहीं, जीवन का गुप्त वरदान है। आपकी आयु ${matched.ageRange} (विशेषकर ${profile.overallPeakAgeRange}) के दौरान आपके ${profile.nadiKaraka} का सर्वोच्च उत्थान आएगा। इस दौरान इसका पारंपरिक रत्न पहनकर इसके संघर्ष के घर्षण को शांत न करें!`
      });
    }
  }

  return {
    hasDebilitatedPlanet: results.length > 0,
    evaluatedPlanets: results
  };
}


