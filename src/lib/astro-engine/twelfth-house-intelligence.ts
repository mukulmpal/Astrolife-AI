// src/lib/astro-engine/twelfth-house-intelligence.ts
// ============================================================
// ASTROLIFE 12TH HOUSE INTELLIGENCE & SACRED CURRENCY (SAMPADA) ENGINE
// Generalizes the 12th House Dynamics across ALL 12 Lagnas
// Synthesizes:
// 1. Hidden Currency (Sampada) of each Rashi in 12th House
// 2. The Sabbatical & Dream Incubation Protocol (Mendeleev, Kekulé, Ramanujan)
// 3. 4th Lord in 12th House Rule (Alienation from Owned Homes)
// 4. Viparita Raja Yoga as Ground-Zero Resilience & Willpower
// ============================================================

export interface TwelfthHouseSignProfile {
  lagnaSign: string;
  twelfthSign: string;
  twelfthSignNum: number;
  archetypeTitleHinglish: string;
  hiddenCurrencyHinglish: string;
  theCurseOfExhaustionHinglish: string;
  sacredPreservationGuidanceHinglish: string;
}

export const TWELFTH_HOUSE_SAMPADA_REGISTRY: Record<string, TwelfthHouseSignProfile> = {
  Aries: {
    lagnaSign: "Aries",
    twelfthSign: "Pisces",
    twelfthSignNum: 11,
    archetypeTitleHinglish: "The Mystic Warrior (कठोर कवच के पीछे महासागरीय करुणा)",
    hiddenCurrencyHinglish:
      "गहन आध्यात्मिक समर्पण, अलौकिक कल्पना और मूक करुणा। बाहर से आक्रामक दिखने वाला मेष लग्न भीतर से अत्यंत भावुक और वैरागी होता है।",
    theCurseOfExhaustionHinglish:
      "यदि यह अपनी संवेदनशीलता दुनिया के सामने दिखाए, तो लोग इसे कमजोर समझकर धोखा देते हैं।",
    sacredPreservationGuidanceHinglish:
      "अपनी करुणा और आंसुओं को एकांत में ईश्वर को अर्पित करें। ध्यान और रात्रि का मौन ही आपकी गुप्त शक्ति है।"
  },

  Taurus: {
    lagnaSign: "Taurus",
    twelfthSign: "Aries",
    twelfthSignNum: 0,
    archetypeTitleHinglish: "The Dormant Volcano (शांत स्थिरता के पीछे सुलगती अग्नि)",
    hiddenCurrencyHinglish:
      "प्रचंड शारीरिक ऊर्जा, युद्ध-कौशल और तात्कालिक निर्णय लेने की उग्र शक्ति। बाहर से शांत और सौम्य दिखने वाला वृषभ लग्न संकट में अकल्पनीय रूप से आक्रामक हो सकता है।",
    theCurseOfExhaustionHinglish:
      "अपनी अग्नि को छोटी-मोटी बहस में बर्बाद करने पर वृषभ का भौतिक संतुलन और स्वास्थ्य बिगड़ जाता है।",
    sacredPreservationGuidanceHinglish:
      "क्रोध को सार्वजनिक न करें। इसे कठिन शारीरिक व्यायाम, खेल या निर्माण कार्यों में रूपांतरित करें।"
  },

  Gemini: {
    lagnaSign: "Gemini",
    twelfthSign: "Taurus",
    twelfthSignNum: 1,
    archetypeTitleHinglish: "The Secret Treasurer (हल्के-फुल्के व्यवहार के पीछे गुप्त खजाना)",
    hiddenCurrencyHinglish:
      "पारिवारिक संस्कार, गुप्त संचित भौतिक संपदा और वित्तीय सुरक्षा की अडिग भावना। बाहर से केवल बातूनी और चंचल दिखने वाले मिथुन के पास हमेशा एक गुप्त वित्तीय बैकअप होता है।",
    theCurseOfExhaustionHinglish:
      "यदि अपनी कुल संपदा और बचत का दिखावा करे, तो शत्रु और रिश्तेदार कर्ज मांगकर इसे खाली कर देते हैं।",
    sacredPreservationGuidanceHinglish:
      "अपने वित्तीय खातों और संपत्तियों को पूरी तरह गोपनीय रखें। सादगी से रहें।"
  },

  Cancer: {
    lagnaSign: "Cancer",
    twelfthSign: "Gemini",
    twelfthSignNum: 2,
    archetypeTitleHinglish: "The Concealed Strategist (भावुक हृदय के पीछे तीक्ष्ण बुद्धि)",
    hiddenCurrencyHinglish:
      "तीव्र कूटनीतिक वाणी, गणनात्मक विश्लेषण और तीखा व्यंग्य। बाहर से अति-भावुक और मातृवत दिखने वाले कर्क के भीतर हर व्यक्ति का मनोवैज्ञानिक हिसाब-किताब दर्ज रहता है।",
    theCurseOfExhaustionHinglish:
      "अपनी चतुराई और योजनाओं का ढिंढोरा पीटने से करीबी लोग इसे चालाक समझकर दूर हो जाते हैं।",
    sacredPreservationGuidanceHinglish:
      "अपनी रणनीतियों को केवल एकांत डायरी या सुरक्षित कोड में दर्ज करें; विवादों में मूक रहें।"
  },

  Leo: {
    lagnaSign: "Leo",
    twelfthSign: "Cancer",
    twelfthSignNum: 3,
    archetypeTitleHinglish: "The Silent Emperor (मूक सम्राट: आंसुओं को छुपाता राजा)",
    hiddenCurrencyHinglish:
      "अत्यंत कोमल, संवेदनशील हृदय, गहरा पारिवारिक मोह और एकांत में बहने वाले आंसू। एक राजा कभी अपनी प्रजा के सामने रो नहीं सकता; उसकी संवेदनशीलता ही उसकी सबसे बड़ी गुप्त निधि है।",
    theCurseOfExhaustionHinglish:
      "यदि सिंह लग्न अपनी भावुकता और दर्द सार्वजनिक कर दे, तो उसका अधिकार, नेतृत्व और शासन तुरंत ढह जाता है।",
    sacredPreservationGuidanceHinglish:
      "अपनी भावनाओं को केवल अपने एकांत मंदिर या अत्यंत विश्वसनीय जीवनसाथी के सामने ही प्रकट करें; दुनिया के सामने सदा मस्तक ऊंचा रखें।"
  },

  Virgo: {
    lagnaSign: "Virgo",
    twelfthSign: "Leo",
    twelfthSignNum: 4,
    archetypeTitleHinglish: "The Veiled Sovereign (विनम्र सेवक के पीछे सम्राट की महत्वाकांक्षा)",
    hiddenCurrencyHinglish:
      "सर्वोच्च सत्ता, आधिपत्य और मान्यता पाने की प्रचंड आंतरिक भूख। बाहर से अत्यधिक विनम्र, सेवाभावी और छोटा दिखने वाले कन्या के भीतर एक संपूर्ण साम्राज्य पर शासन करने की लालसा होती है।",
    theCurseOfExhaustionHinglish:
      "अहंकार का खुला प्रदर्शन कन्या के विश्लेषणात्मक प्रभाव को समाप्त कर देता है और शत्रु पैदा करता है।",
    sacredPreservationGuidanceHinglish:
      "सिंहासन के पीछे की असली शक्ति (Power behind the throne) बनकर रहें; सेवा के माध्यम से ही सत्ता पाएं।"
  },

  Libra: {
    lagnaSign: "Libra",
    twelfthSign: "Virgo",
    twelfthSignNum: 5,
    archetypeTitleHinglish: "The Merciless Auditor (मुस्कान के पीछे निष्ठुर तार्किकता)",
    hiddenCurrencyHinglish:
      "सूक्ष्म तकनीकी समझ, निष्ठुर ऑडिटिंग और कमियां पकड़ने की पैनी नजर। बाहर से सदा मधुर, सुंदर और समझौतावादी दिखने वाला तुला भीतर से हर रिश्ते का नफा-नुकसान तौल रहा होता है।",
    theCurseOfExhaustionHinglish:
      "अपनी तीखी आलोचनात्मक बुद्धि को बातचीत में लगातार झाड़ने से इसके सभी सामाजिक संबंध टूट जाते हैं।",
    sacredPreservationGuidanceHinglish:
      "अपनी ऑडिटिंग की शक्ति को केवल कानूनी अनुबंधों, टैक्स और व्यापार में लगाएं; रिश्तों को प्रेम से सींचें।"
  },

  Scorpio: {
    lagnaSign: "Scorpio",
    twelfthSign: "Libra",
    twelfthSignNum: 6,
    archetypeTitleHinglish: "The Fortress of Longing (रहस्यमयी दुर्ग के पीछे परिष्कृत प्रेम)",
    hiddenCurrencyHinglish:
      "सौंदर्यबोध, गहरा परिष्कृत प्रेम, शांति और निष्पक्ष संतुलन की प्यास। बाहर से अत्यंत गुप्त, कठोर और अविश्वासी दिखने वाला वृश्चिक भीतर से केवल एक निष्कपट, सामंजस्यपूर्ण प्रेम का भूखा होता है।",
    theCurseOfExhaustionHinglish:
      "अपनी कोमलता को जल्दी प्रकट करने पर यह ठगा जाता है, जिससे इसका अविश्वास और क्रूर हो जाता है।",
    sacredPreservationGuidanceHinglish:
      "संगीत, ललित कलाओं और सौंदर्य में मन लगाएं। हर किसी को अपने दुर्ग के भीतर प्रवेश न दें।"
  },

  Sagittarius: {
    lagnaSign: "Sagittarius",
    twelfthSign: "Scorpio",
    twelfthSignNum: 7,
    archetypeTitleHinglish: "The Occult Sage (धार्मिक उपदेश के पीछे तांत्रिक ज्ञान)",
    hiddenCurrencyHinglish:
      "गहन तांत्रिक, ज्योतिषीय व मृत्यु-संबंधी गूढ़ सत्य (Esoteric Gnosis) और निजी अस्तित्ववादी संकट। बाहर से सदा आशावादी और नैतिक दिखने वाले धनु के भीतर जीवन और मृत्यु का गहरा मंथन चलता है।",
    theCurseOfExhaustionHinglish:
      "अपनी गूढ़ अनुभूतियों को सामान्य धार्मिक लोगों से साझा करने पर इसे नास्तिक या पाखंडी समझ लिया जाता है।",
    sacredPreservationGuidanceHinglish:
      "गूढ़ साधनाओं को पूर्णतः गुप्त रखें। अपने आध्यात्मिक संकट को ध्यान और आत्म-साक्षात्कार में तपाएं।"
  },

  Capricorn: {
    lagnaSign: "Capricorn",
    twelfthSign: "Sagittarius",
    twelfthSignNum: 8,
    archetypeTitleHinglish: "The Secret Believer (कठोर यथार्थवादी के पीछे शुद्ध आस्था)",
    hiddenCurrencyHinglish:
      "उच्च दार्शनिक आदर्शवाद, ईश्वर के प्रति अगाध गुप्त आस्था और सनातन धर्म के प्रति निष्ठा। बाहर से केवल काम, करियर और पैसे की बात करने वाले मकर के भीतर एक अडिग भक्त छिपा होता है।",
    theCurseOfExhaustionHinglish:
      "यदि अपने व्यावसायिक सर्कल में धर्म और आदर्शवाद की बातें करे, तो लोग इसकी व्यावहारिकता पर शक करने लगते हैं।",
    sacredPreservationGuidanceHinglish:
      "अपने तीर्थ और साधना को अत्यंत निजी रखें। दुनिया को केवल अपना कर्म और परिणाम दिखाएं।"
  },

  Aquarius: {
    lagnaSign: "Aquarius",
    twelfthSign: "Capricorn",
    twelfthSignNum: 9,
    archetypeTitleHinglish: "The Traditional Hermit (क्रांतिकारी विद्रोही के पीछे कठोर तपस्या)",
    hiddenCurrencyHinglish:
      "अत्यंत कठोर पारंपरिक तपस्या, अनुशासन, अकेलापन और पितरों के प्रति ऋण की गहरी चेतना। बाहर से मानवतावादी और आधुनिक दिखने वाला कुंभ भीतर से प्राचीन नियमों और शनि के कठोर अनुशासन से बंधा होता है।",
    theCurseOfExhaustionHinglish:
      "अनावश्यक सामाजिक समारोहों में अपनी ऊर्जा बर्बाद करने पर यह भारी मानसिक अवसाद में गिरता है।",
    sacredPreservationGuidanceHinglish:
      "प्रतिदिन कुछ घंटे पूर्ण मौन व एकांत साधना में बिताएं। पितृ तर्पण और वृद्ध सेवा से इसकी शक्ति खिलती है।"
  },

  Pisces: {
    lagnaSign: "Pisces",
    twelfthSign: "Aquarius",
    twelfthSignNum: 10,
    archetypeTitleHinglish: "The Cosmic Networker (अकेले संन्यासी के पीछे वैश्विक चेतना)",
    hiddenCurrencyHinglish:
      "मानवतावादी सामूहिक नेटवर्क, भविष्य की वैज्ञानिक दृष्टि और विशाल सामाजिक कल्याण की योजनाएं। बाहर से स्वप्नद्रष्टा दिखने वाले मीन के पास पूरे विश्व के तंत्र को जोड़ने का गुप्त नक्शा होता है।",
    theCurseOfExhaustionHinglish:
      "यदि छोटे-मोटे स्वार्थी समूहों में उलझ जाए, तो इसकी वैश्विक दृष्टि संकुचित हो जाती है।",
    sacredPreservationGuidanceHinglish:
      "बड़ी जन-कल्याणकारी परियोजनाओं और अनाथालयों/विद्या-दान में समय लगाएं; संकीर्ण दायरे से ऊपर उठें।"
  }
};

// ── 12th House Comprehensive Audit ────────────────────────────────────────────

export interface TwelfthHouseAuditResult {
  lagna: string;
  sampadaProfile: TwelfthHouseSignProfile;
  fourthLordInTwelfth: boolean;
  fourthLordAlienationInsight?: string;
  is12thDashaActive: boolean;
  sabbaticalProtocol?: {
    recommendationTitleHinglish: string;
    historicalArchetype: string;
    actionProtocolHinglish: string;
  };
  viparitaRajaYoga: {
    hasVRY: boolean;
    type?: "Harsha" | "Sarala" | "Vimala";
    groundZeroWillpowerHinglish?: string;
  };
}

export function evaluateTwelfthHouseIntelligence(
  lagnaSign: string,
  fourthLordHouse: number,
  activeDashaPlanet: string,
  twelfthLordPlanet: string,
  sixthLordHouse: number,
  eighthLordHouse: number,
  twelfthLordHouse: number
): TwelfthHouseAuditResult {
  const sampadaProfile = TWELFTH_HOUSE_SAMPADA_REGISTRY[lagnaSign] || TWELFTH_HOUSE_SAMPADA_REGISTRY.Aries;

  // 4th Lord in 12th House Rule
  const fourthLordInTwelfth = fourthLordHouse === 12;
  const fourthLordAlienationInsight = fourthLordInTwelfth
    ? "चतुर्थेश 12वें भाव में है: जातक को अपने पैतृक या स्वयं निर्मित घर से दूर रहना पड़ता है। यह योग विदेशी भूमि, किराए के आवास, या लगातार शहर बदलने का संकेत देता है। पैतृक मकान में रहने पर मानसिक अशांति रहती है।"
    : undefined;

  // 12th Dasha / Incubation Protocol
  const is12thDashaActive = activeDashaPlanet === twelfthLordPlanet;
  let sabbaticalProtocol = undefined;
  if (is12thDashaActive) {
    sabbaticalProtocol = {
      recommendationTitleHinglish: "12वें भाव की महादशा: सैबैटिकल व ड्रीम इनक्यूबेशन प्रोटोकॉल (The Sabbatical Protocol)",
      historicalArchetype:
        "मेंडलीफ (आवर्त सारणी), केकुले (बेंजीन रिंग), और श्रीनिवास रामानुजन (गणितीय सूत्र) — सभी ने अपनी सबसे बड़ी खोजें संघर्ष छोड़कर एकांत, विश्राम और नींद/सपनों के माध्यम से पाईं।",
      actionProtocolHinglish:
        "इस दशा में लगातार सिर पटकने और अत्यधिक दौड़भाग से बचें। प्रकृति के सानिध्य में 1-3 महीने का विश्राम (Sabbatical) लें। अवचेतन मन और सपनों के संकेतों को नोट करें; यहीं से आपकी अगली ऐतिहासिक छलांग का जन्म होगा।"
    };
  }

  // Viparita Raja Yoga (Harsha: 6th in 6/8/12; Sarala: 8th in 6/8/12; Vimala: 12th in 6/8/12)
  let vryType: "Harsha" | "Sarala" | "Vimala" | undefined;
  let hasVRY = false;
  let groundZeroWillpower = "";

  if ([6, 8, 12].includes(twelfthLordHouse)) {
    hasVRY = true;
    vryType = "Vimala";
    groundZeroWillpower =
      "विमल विपरीत राजयोग: जब जीवन में सब कुछ समाप्त हो जाए, तब भी जातक के भीतर 'शून्य से दोबारा साम्राज्य खड़ा करने' की अटूट इच्छाशक्ति (Ground-Zero Willpower) प्रज्वलित होती है। यह पतन के तुरंत बाद ऐतिहासिक पुनरुत्थान कराता है।";
  } else if ([6, 8, 12].includes(eighthLordHouse)) {
    hasVRY = true;
    vryType = "Sarala";
    groundZeroWillpower =
      "सरल विपरीत राजयोग: घोर संकट, मुकदमों या अचानक विपत्तियों को अपनी शक्ति बनाकर विरोधियों पर विजय पाने की अद्वितीय क्षमता।";
  } else if ([6, 8, 12].includes(sixthLordHouse)) {
    hasVRY = true;
    vryType = "Harsha";
    groundZeroWillpower =
      "हर्ष विपरीत राजयोग: रोगों, ऋणों और शत्रुओं को परास्त कर जीवन में पुनः स्वास्थ्य और समृद्धि हासिल करने की अदम्य शक्ति।";
  }

  return {
    lagna: lagnaSign,
    sampadaProfile,
    fourthLordInTwelfth,
    fourthLordAlienationInsight,
    is12thDashaActive,
    sabbaticalProtocol,
    viparitaRajaYoga: {
      hasVRY,
      type: vryType,
      groundZeroWillpowerHinglish: groundZeroWillpower || undefined
    }
  };
}

