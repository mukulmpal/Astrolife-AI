// src/lib/astro-engine/d1-vs-varga-dignity.ts
// ============================================================
// ASTROLIFE MULTI-VARGA CROSS-DIGNITY & FOUNDER'S DILEMMA ENGINE
// Generalizes the D1 vs D9 vs D10 Dignity Paradox across ALL 7 Planets
// Synthesizes:
// 1. The Founder's Dilemma (D1 Exalted + D9 Debilitated):
//    D1 = Vision, Scale & Leadership | D9 = Terms of Engagement & Internal Compromise
// 2. The Phoenix / Neecha Bhanga Ascent (D1 Debilitated + D9 Exalted)
// 3. Operational Marketplace Dominance (D1 vs D10)
// 4. Classical Shastra Foundations: Sarvartha Chintamani, Phaladeepika, Jataka Parijata
// ============================================================

export type ClassicPlanet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";

export type VargaDignity = "Exalted" | "Own" | "Friendly" | "Neutral" | "Enemy" | "Debilitated";

export interface VargaPlanetInput {
  planet: ClassicPlanet;
  d1SignNum: number; // 0..11 (0=Aries, 1=Taurus, etc.)
  d1House: number;   // 1..12
  d1Dignity: VargaDignity;
  d9SignNum: number;
  d9House: number;
  d9Dignity: VargaDignity;
  d10SignNum?: number;
  d10House?: number;
  d10Dignity?: VargaDignity;
}

export type VargaArchetypePattern =
  | "Founders_Dilemma"          // D1 Exalted + D9 Debilitated
  | "Phoenix_Neecha_Bhanga"     // D1 Debilitated + D9 Exalted
  | "Sovereign_Uncontested"     // D1 Exalted + D9 Exalted (Vargottama Exalted)
  | "Internal_Exhaustion_Loop"  // D1 Debilitated + D9 Debilitated
  | "Marketplace_Warrior"       // D1 Normal/Debilitated + D10 Exalted
  | "Visionary_Without_Execution" // D1 Exalted + D10 Debilitated
  | "Harmonious_Balance";

export interface PlanetVargaCrossAnalysis {
  planet: ClassicPlanet;
  pattern: VargaArchetypePattern;
  headlineHinglish: string;
  visionScopeD1: string;
  termsOfEngagementD9: string;
  marketplaceExecutionD10?: string;
  dashaStrategyHinglish: string;
  classicalReference?: string;
  severity: "neutral" | "favorable" | "caution";
}

// ── Classical Planet Matrix Definitions ────────────────────────────────────────

interface PlanetDilemmaTemplate {
  foundersDilemma: {
    headline: string;
    visionD1: string;
    termsD9: string;
    strategy: string;
    shastra: string;
  };
  phoenixNeechaBhanga: {
    headline: string;
    visionD1: string;
    termsD9: string;
    strategy: string;
  };
  visionWithoutExecution: {
    headline: string;
    marketplaceD10: string;
    strategy: string;
  };
  marketplaceWarrior: {
    headline: string;
    marketplaceD10: string;
    strategy: string;
  };
}

const PLANET_VARGA_TEMPLATES: Record<ClassicPlanet, PlanetDilemmaTemplate> = {
  Sun: {
    foundersDilemma: {
      headline: "The Emperor's Compromise (राजसिक विजन बनाम संस्थागत समझौता)",
      visionD1: "D1 मेष/उच्च: बड़े संगठन, सार्वजनिक प्रतिष्ठा, साम्राज्य-विस्तार और नेतृत्व की अटूट भूख। व्यक्ति स्वाभाविक रूप से बॉस और संस्थापक की भूमिका चुनता है।",
      termsD9: "D9 तुला/नीच: स्वतंत्रता का समर्पण। बोर्ड ऑफ डायरेक्टर्स, विनियामक (Regulators) या बड़े निवेशकों के आगे अपनी शर्तों को त्यागने की बाध्यता।",
      strategy: "सूर्य महादशा में 'एकछत्र राज' का अहंकार न पालें। फंडिंग व संसाधन मिलेंगे, पर पूर्ण स्वायत्तता नहीं। सहमति व संस्थागत कूटनीति से ही अस्तित्व बचेगा।",
      shastra: "सर्वार्थ चिंतामणि के अनुसार नवांश में नीच सूर्य जातक को विपुल धन, पराक्रम और विरोधियों को वित्तीय शक्ति से परास्त करने की क्षमता देता है, किंतु स्वायत्तता छीन लेता है।"
    },
    phoenixNeechaBhanga: {
      headline: "The Phoenix Monarch (संघर्षमय नींव से अखंड राजयोग)",
      visionD1: "D1 तुला/नीच: आरंभिक जीवन में सम्मान की कमी, पिता से दूरी या पहचान का भारी संघर्ष।",
      termsD9: "D9 मेष/उच्च: 32 वर्ष की आयु के बाद आत्म-गौरव और सर्वोच्च नेतृत्व का उदय। समाज में अमिट छाप छोड़ता है।",
      strategy: "आरंभिक अपमान से विचलित न हों। उत्तरार्ध में यह सूर्य अजेय अधिकार और प्रतिष्ठा स्थापित करता है।"
    },
    visionWithoutExecution: {
      headline: "Visionary Founder Facing Operational Gridlock",
      marketplaceD10: "D10 में सूर्य कमजोर/नीच: बाहरी बाजार में निष्पादन धीमा; बड़े नाम और विजन के बावजूद रोजमर्रा के ऑपरेशन्स में साझेदारों से टकराव।",
      strategy: "ऑपरेशन्स और एग्जीक्यूशन किसी योग्य सीओओ (COO) को सौंपें। खुद केवल ब्रांड और विजन का चेहरा बनें।"
    },
    marketplaceWarrior: {
      headline: "Marketplace Hegemon (ज़मीन से उठकर बाज़ार पर कब्ज़ा)",
      marketplaceD10: "D10 में सूर्य उच्च: सार्वजनिक जीवन में भले ही शांत रहें, लेकिन अपने उद्योग और बाज़ार में सर्वोच्च प्राधिकारी बनते हैं।",
      strategy: "दशम भाव की सूर्य ऊर्जा का उपयोग सरकारी टेंडरों, कॉर्पोरेट लीडरशिप और संस्थागत आधिपत्य के लिए करें।"
    }
  },

  Moon: {
    foundersDilemma: {
      headline: "The Public Healer with Private Void (सार्वजनिक लोक-प्रियता बनाम आंतरिक शून्यता)",
      visionD1: "D1 वृषभ/उच्च: जनता से गहरा जुड़ाव, विशाल जन-आकर्षण, कलात्मक संवेदनशीलता और पोषण की भावना।",
      termsD9: "D9 वृश्चिक/नीच: व्यक्तिगत अंतरंगता में विश्वासघात, गहरे भावनात्मक असुरक्षा और साझेदारी में आत्म-समर्पण की बाध्यता।",
      strategy: "बाहरी तालियों से अपने आंतरिक खालीपन को भरने की कोशिश न करें। निजी जीवन में भावनात्मक सीमाएं (boundaries) तय रखें।",
      shastra: "चंद्रमा का नवांश में नीच होना सार्वजनिक प्रतिष्ठा बढ़ाते हुए भी निजी शांति का हरण करता है।"
    },
    phoenixNeechaBhanga: {
      headline: "Transmuted Mind (तपते अंगारों से कुंदन बना मन)",
      visionD1: "D1 वृश्चिक/नीच: बचपन में भावनात्मक आघात, भय या मातृ-पक्ष से गहरा कष्ट।",
      termsD9: "D9 वृषभ/उच्च: परिपक्वता के साथ असाधारण मानसिक संतुलन, मनोवैज्ञानिक एक्स-रे विजन और दूसरों को संकट से उबारने की शक्ति।",
      strategy: "अपने आरंभिक आघात को अपनी मनोवैज्ञानिक शक्ति बनाएं। ध्यान और जल-तत्व की साधना करें।"
    },
    visionWithoutExecution: {
      headline: "Sensitive Dreamer with Execution Fluctuation",
      marketplaceD10: "D10 में चंद्रमा नीच: मूड स्विंग्स और जन-समीक्षा की चिंता के कारण करियर में अत्यधिक उतार-चढ़ाव।",
      strategy: "व्यवसाय में स्थिर सिस्टम और एसओपी (SOPs) बनाएं ताकि व्यक्तिगत मूड का असर काम पर न पड़े।"
    },
    marketplaceWarrior: {
      headline: "Mass Market Liquidator (जनता की नब्ज पर पकड़)",
      marketplaceD10: "D10 में चंद्रमा उच्च: उत्पादों या सेवाओं में जनता की नब्ज पकड़ना; लिक्विड कैश और उपभोक्ता बाज़ार में भारी सफलता।",
      strategy: "कंज्यूमर गुड्स, हॉस्पिटैलिटी, मीडिया या लिक्विडिटी-आधारित क्षेत्रों में खुलकर खेलें।"
    }
  },

  Mars: {
    foundersDilemma: {
      headline: "The Constrained Warrior (रणनीतिक शौर्य बनाम विवशता के समझौते)",
      visionD1: "D1 मकर/उच्च: निर्भीक रणनीतिक आक्रामकता, अथक कार्यक्षमता, जोखिम लेने का साहस और अनुशासन।",
      termsD9: "D9 कर्क/नीच: कानूनी विवादों या पारिवारिक बाध्यताओं के आगे झुकना; आक्रामक निर्णय लेने के बाद पीछे हटने की विवशता।",
      strategy: "अनावश्यक मुकदमों और आक्रामक कानूनी लड़ाइयों से बचें। आपकी शक्ति सीधे युद्ध के बजाय कूटनीतिक समझौतों में सुरक्षित रहेगी।",
      shastra: "मंगल जब नवांश में नीच होता है तो शारीरिक साहस तो देता है किंतु अंतिम संधि में रियायतें देनी पड़ती हैं।"
    },
    phoenixNeechaBhanga: {
      headline: "The Diamond Blade (दबे हुए क्रोध से असाधारण अनुशासन)",
      visionD1: "D1 कर्क/नीच: आरंभिक जीवन में पहल करने का अभाव, कायरता या अनसुलझा क्रोध।",
      termsD9: "D9 मकर/उच्च: जीवन के मध्य में अत्यंत संगठित, लौह-अनुशासन और अजेय दृढ़ संकल्प का प्राकट्य।",
      strategy: "अपने भीतर के पैसिव-अग्रेसिव व्यवहार को पहचानें। खेल, योग और प्रोजेक्ट डिलीवरी में ऊर्जा केंद्रित करें।"
    },
    visionWithoutExecution: {
      headline: "Heroic Pioneer Weakened in Corporate Battlefield",
      marketplaceD10: "D10 में मंगल नीच: प्रोजेक्ट्स को शुरू तो जोश से करते हैं किंतु डिलीवरी और कॉर्पोरेट राजनीति में थकान का शिकार होते हैं।",
      strategy: "टीम में एक सख्त ऑपरेशन्स मैनेजर रखें जो आपके आरंभ किए गए प्रोजेक्ट्स को अंतिम रूप दे सके।"
    },
    marketplaceWarrior: {
      headline: "Surgical Commander (व्यावसायिक युद्धभूमि का विजेता)",
      marketplaceD10: "D10 में मंगल उच्च: प्रतिस्पर्धियों को पछाड़ना, इंजीनियरिंग, रियल एस्टेट, रक्षा या उच्च-दांव वाले ऑपरेशन्स में एकछत्र राज।",
      strategy: "हाई-स्टेक्स ऑपरेशन्स, क्राइसिस मैनेजमेंट और कठिन तकनीकी डिलीवरी का नेतृत्व स्वयं संभालें।"
    }
  },

  Mercury: {
    foundersDilemma: {
      headline: "The Macro-Architect Caught in Logistical Maze (महा-व्यापारी बनाम लॉजिस्टिकल विसंगतियां)",
      visionD1: "D1 कन्या/उच्च: विश्लेषणात्मक प्रतिभा, विशाल नेटवर्क, ट्रेडिंग चातुर्य और सटीक बौद्धिक योजना।",
      termsD9: "D9 मीन/नीच: अमूर्त भ्रम, हिसाब-किताब में दूसरों द्वारा धोखाधड़ी, या अनुबंध की सूक्ष्म शर्तों को अनदेखा करना।",
      strategy: "सभी वित्तीय और कानूनी अनुबंध लिखित रूप में ऑडिट करवाएं। केवल मौखिक वादों पर व्यापार का भरोसा न करें।",
      shastra: "बुध का नवांश में नीच होना बड़ी व्यावसायिक दृष्टि देते हुए भी पार्टनरशिप में विसंगतियां पैदा करता है।"
    },
    phoenixNeechaBhanga: {
      headline: "Intuitive Gnosis to Precision Logic (सहज अंतर्ज्ञान से सटीक विश्लेषण)",
      visionD1: "D1 मीन/नीच: आरंभ में अकादमिक विफलता, भटकाव या अत्यधिक दिवास्वप्न।",
      termsD9: "D9 कन्या/उच्च: 28 वर्ष के बाद विश्वस्तरीय डेटा एनालिटिक्स, वित्तीय तीक्ष्णता और सूक्ष्म विवरणों की मास्टर पकड़।",
      strategy: "अमूर्त सोच को कोड, लेखन या वित्तीय मॉडल्स में बदलना सीखें।"
    },
    visionWithoutExecution: {
      headline: "Intellectual Giant with Chaotic Marketplace Execution",
      marketplaceD10: "D10 में बुध नीच: विचार शानदार किंतु बिलिंग, अकाउंटिंग और डेली फॉलोअप में अव्यवस्था।",
      strategy: "एक सख्त चार्टर्ड अकाउंटेंट और लीगल एडवाइजर को अपने ऑपरेशन्स की कमान दें।"
    },
    marketplaceWarrior: {
      headline: "Algorithmic Market Ruler (व्यापार और तकनीक का सम्राट)",
      marketplaceD10: "D10 में बुध उच्च: वित्तीय ट्रेडिंग, सॉफ्टवेयर आर्किटेक्चर, मीडिया और कमर्शियल सिंडिकेशन में सर्वोच्च विजय।",
      strategy: "हाई-फ्रीक्वेंसी ट्रेडिंग, डिजिटल प्लेटफॉर्म्स और नॉलेज-बेस्ड बिजनेस में स्केल करें।"
    }
  },

  Jupiter: {
    foundersDilemma: {
      headline: "The Institutional Guru Facing Moral Compromise (दार्शनिक सम्राट बनाम भ्रष्ट व्यवस्था)",
      visionD1: "D1 कर्क/उच्च: विशाल ज्ञान, आध्यात्मिक दृष्टि, गुरु तुल्य प्रभाव और बड़ी संस्थाओं का निर्माण।",
      termsD9: "D9 मकर/नीच: जिन शिष्यों, ट्रस्टियों या साझेदारों को खड़ा किया, वे ही धन और सत्ता के लिए षड्यंत्र करते हैं; व्यावहारिक स्तर पर समझौता।",
      strategy: "आध्यात्मिक या शैक्षणिक संस्थाओं में कभी भी वित्तीय नियंत्रण अंध-विश्वास में दूसरों को न सौंपें। ऑडिटिंग खुद देखें।",
      shastra: "बृहस्पति का नवांश में मकर में होना दार्शनिक प्रतिष्ठा तो देता है किंतु भौतिक संरचना में पाखंड का शिकार बनाता है।"
    },
    phoenixNeechaBhanga: {
      headline: "Grounded Pragmatist Transformed into Sage (कठोर यथार्थ से सच्चा ज्ञान)",
      visionD1: "D1 मकर/नीच: आरंभ में धर्म, गुरुओं या नैतिकता से मोहभंग; अत्यधिक भौतिकवादी संघर्ष।",
      termsD9: "D9 कर्क/उच्च: उत्तरार्ध में गहरा आत्म-साक्षात्कार, निष्काम परोपकार और समाज का मार्गदर्शक बनना।",
      strategy: "पाखंडी गुरुओं से दूर रहें। प्रत्यक्ष अनुभव और सेवा ही आपकी मुक्ति का मार्ग है।"
    },
    visionWithoutExecution: {
      headline: "Pious Visionary Struggling in Material Markets",
      marketplaceD10: "D10 में गुरु नीच: बाजार में अत्यधिक सादगी या अव्यावहारिक सिद्धांतों के कारण राजस्व जुटाने में संघर्ष।",
      strategy: "अपने ज्ञान को व्यावहारिक बिजनेस मॉडल में पैकेज करें। काम का उचित मूल्य मांगने में संकोच न करें।"
    },
    marketplaceWarrior: {
      headline: "Institutional Chancellor (संस्थागत कुलपति)",
      marketplaceD10: "D10 में गुरु उच्च: बड़े विश्वविद्यालयों, वैश्विक फंड्स, कानून और नीति निर्माण में शीर्ष सलाहकार या संस्थापक।",
      strategy: "सर्वोच्च नीतिगत फैसलों और ट्रस्टीशिप की भूमिका निभाएं।"
    }
  },

  Venus: {
    foundersDilemma: {
      headline: "The Aesthetic Magnate with Transactional Bounds (सौंदर्य का देवता बनाम सौदेबाजी का बंधन)",
      visionD1: "D1 मीन/उच्च: असीमित प्रेम, कलात्मक भव्यता, विलासिता और वैश्विक पैमाने पर सौंदर्य-सृजन।",
      termsD9: "D9 कन्या/नीच: व्यक्तिगत संबंधों और साझेदारियों में विशुद्ध नफा-नुकसान की सौदेबाजी; साथी द्वारा कमियां निकालना।",
      strategy: "व्यापार में पाई-पाई का हिसाब रखें किंतु व्यक्तिगत प्रेम में ऑडिटिंग बंद करें। अन्यथा रिश्ते समझौते बनकर रह जाएंगे।",
      shastra: "शुक्र का नवांश में नीच होना अपार वैभव और आकर्षण देते हुए भी दाम्पत्य में तकरार और शर्तों की बाध्यता लाता है।"
    },
    phoenixNeechaBhanga: {
      headline: "Ruthless Auditor Turned Refined Creator (बाल की खाल निकालने से शुद्ध सौंदर्य)",
      visionD1: "D1 कन्या/नीच: संबंधों में लगातार अविश्वास, संदेह, और अत्यधिक आलोचनात्मक स्वभाव।",
      termsD9: "D9 मीन/उच्च: बाद में निस्वार्थ भक्ति, असाधारण कलात्मक दृष्टि और दूसरों के प्रति गहन करुणा का प्रस्फुटन।",
      strategy: "अपनी आलोचनात्मक दृष्टि को ऑडिटिंग और गुणवत्ता नियंत्रण में लगाएं, प्रेम में नहीं।"
    },
    visionWithoutExecution: {
      headline: "Creative Genius Facing Distribution Bottlenecks",
      marketplaceD10: "D10 में शुक्र नीच: उत्पाद विश्वस्तरीय और सुंदर, किंतु पैकेजिंग, मार्केटिंग या प्राइसिंग में गलतियां।",
      strategy: "मार्केटिंग और ब्रांडिंग के लिए सख्त पेशेवर एजेंसी नियुक्त करें।"
    },
    marketplaceWarrior: {
      headline: "Luxury & Commodity Sovereign (लक्जरी और वित्तीय बाजार का बेताज बादशाह)",
      marketplaceD10: "D10 में शुक्र उच्च: लक्जरी ब्रांड्स, सिनेमा, फैशन, वित्तीय आर्बिट्रेज और आभूषण व्यापार में शीर्ष मुकाम।",
      strategy: "हाई-एंड प्रोडक्ट्स और एलीट क्लाइंट्स पर फोकस करें।"
    }
  },

  Saturn: {
    foundersDilemma: {
      headline: "The Industrial Sovereign Bound to Servitude (औद्योगिक सम्राट बनाम ज़मीनी गुलामी)",
      visionD1: "D1 तुला/उच्च: विशाल तंत्र, जनसमूह का नेतृत्व, कानून, औद्योगिक विस्तार और ऐतिहासिक निर्माण।",
      termsD9: "D9 मेष/नीच: भारी साम्राज्य बनाने के बावजूद व्यक्तिगत स्तर पर विश्राम शून्य; हमेशा मजदूरों, मुकदमों और सिस्टम की रखवाली में जलना।",
      strategy: "डेलिगेशन सीखें। हर चीज को स्वयं नियंत्रित करने की जिद आपको समय से पहले मानसिक व शारीरिक रूप से निचोड़ देगी।",
      shastra: "शनि का नवांश में नीच होना विशाल जन-समर्थन और सत्ता देते हुए भी जातक को स्वयं के बनाए तंत्र का बंदी बना देता है।"
    },
    phoenixNeechaBhanga: {
      headline: "The Slumdog Emperor (अभाव की भट्टी से तपा शासक)",
      visionD1: "D1 मेष/नीच: आरंभिक जीवन में घोर गरीबी, निरंतर असफलताएं, अपमान और भारी शारीरिक श्रम।",
      termsD9: "D9 तुला/उच्च: 36 वर्ष के बाद न्यायप्रियता, जनसमूह का अटूट समर्थन और इतिहास रचने वाली स्थायी सफलता।",
      strategy: "धैर्य रखें। शनि की साढ़ेसाती या महादशा में शॉर्टकट न लें। आपका साम्राज्य देरी से किंतु अजर-अमर बनेगा।"
    },
    visionWithoutExecution: {
      headline: "Disciplined Builder Paralyzed by Legacy Red Tape",
      marketplaceD10: "D10 में शनि नीच: बाजार में भारी लालफीताशाही, श्रमिक विवाद या धीमे निष्पादन के कारण प्रोजेक्ट्स अटकना।",
      strategy: "यूनियन और लेबर मैनेजमेंट को प्राथमिकता दें; कानूनी सुरक्षा पहले सुनिश्चित करें।"
    },
    marketplaceWarrior: {
      headline: "Infrastructure Titan (ढांचागत साम्राज्य का निर्माता)",
      marketplaceD10: "D10 में शनि उच्च: भारी उद्योग, खनन, रियल एस्टेट, लॉजिस्टिक्स और बड़े पैमाने पर रोजगार सृजन में शीर्ष वर्चस्व।",
      strategy: "दीर्घकालिक इन्फ्रास्ट्रक्चर प्रोजेक्ट्स और बुनियादी ढांचागत निवेश पर दांव लगाएं।"
    }
  }
};

// ── Generic Cross-Varga Evaluation Function ───────────────────────────────────

export function evaluateVargaCrossDignity(input: VargaPlanetInput): PlanetVargaCrossAnalysis {
  const tmpl = PLANET_VARGA_TEMPLATES[input.planet];
  const { d1Dignity, d9Dignity, d10Dignity } = input;

  // 1. Founder's Dilemma (D1 Exalted + D9 Debilitated)
  if (d1Dignity === "Exalted" && d9Dignity === "Debilitated") {
    return {
      planet: input.planet,
      pattern: "Founders_Dilemma",
      headlineHinglish: tmpl.foundersDilemma.headline,
      visionScopeD1: tmpl.foundersDilemma.visionD1,
      termsOfEngagementD9: tmpl.foundersDilemma.termsD9,
      marketplaceExecutionD10: input.d10House
        ? `D10 भाव ${input.d10House} [${d10Dignity || "Neutral"}]: बाजार में पूंजी व निष्पादन की स्थिति दर्शाता है।`
        : undefined,
      dashaStrategyHinglish: tmpl.foundersDilemma.strategy,
      classicalReference: tmpl.foundersDilemma.shastra,
      severity: "caution"
    };
  }

  // 2. Phoenix / Neecha Bhanga (D1 Debilitated + D9 Exalted)
  if (d1Dignity === "Debilitated" && d9Dignity === "Exalted") {
    return {
      planet: input.planet,
      pattern: "Phoenix_Neecha_Bhanga",
      headlineHinglish: tmpl.phoenixNeechaBhanga.headline,
      visionScopeD1: tmpl.phoenixNeechaBhanga.visionD1,
      termsOfEngagementD9: tmpl.phoenixNeechaBhanga.termsD9,
      dashaStrategyHinglish: tmpl.phoenixNeechaBhanga.strategy,
      classicalReference: "फलदीपिका एवं जातक पारिजात: नवांशे बलवान् ग्रहः सर्वदोषहरः।",
      severity: "favorable"
    };
  }

  // 3. Vargottama Exalted (Sovereign Uncontested)
  if (d1Dignity === "Exalted" && d9Dignity === "Exalted") {
    return {
      planet: input.planet,
      pattern: "Sovereign_Uncontested",
      headlineHinglish: `${input.planet} वर्गोत्तम उच्च (Sovereign Authority)`,
      visionScopeD1: `D1 एवं D9 दोनों में ${input.planet} सर्वोच्च बल में है। विज़न और आंतरिक सामर्थ्य दोनों एकरूप हैं।`,
      termsOfEngagementD9: "किसी बाहरी समझौते की आवश्यकता नहीं; जातक अपनी शर्तों पर साम्राज्य स्थापित करता है।",
      dashaStrategyHinglish: "इस ग्रह की महादशा जीवन का स्वर्ण-काल साबित होगी। बिना किसी भय के नेतृत्व संभालें।",
      severity: "favorable"
    };
  }

  // 4. Double Debilitated (Exhaustion Loop)
  if (d1Dignity === "Debilitated" && d9Dignity === "Debilitated") {
    return {
      planet: input.planet,
      pattern: "Internal_Exhaustion_Loop",
      headlineHinglish: `${input.planet} दोहरा नीच (Karmic Cleansing Zone)`,
      visionScopeD1: "बाहरी जगत में इस ग्रह के कारकों को लेकर लगातार असफलता और भटकाव।",
      termsOfEngagementD9: "आंतरिक स्तर पर भी अत्यधिक निराशा, विश्वास की कमी और बार-बार एक ही गलती दोहराना।",
      dashaStrategyHinglish: "इस ग्रह के क्षेत्र में भौतिक विस्तार की चेष्टा छोड़ें। सेवा, दान, उपवास और पूर्ण आध्यात्मिक आत्म-समर्पण ही एकमात्र समाधान है।",
      severity: "caution"
    };
  }

  // 5. Visionary without Execution (D1 Exalted + D10 Debilitated)
  if (d1Dignity === "Exalted" && d10Dignity === "Debilitated") {
    return {
      planet: input.planet,
      pattern: "Visionary_Without_Execution",
      headlineHinglish: tmpl.visionWithoutExecution.headline,
      visionScopeD1: tmpl.foundersDilemma.visionD1,
      termsOfEngagementD9: `D9 [${d9Dignity}]: आंतरिक दृष्टि।`,
      marketplaceExecutionD10: tmpl.visionWithoutExecution.marketplaceD10,
      dashaStrategyHinglish: tmpl.visionWithoutExecution.strategy,
      severity: "caution"
    };
  }

  // 6. Marketplace Warrior (D1 Debilitated/Neutral + D10 Exalted)
  if (d10Dignity === "Exalted") {
    return {
      planet: input.planet,
      pattern: "Marketplace_Warrior",
      headlineHinglish: tmpl.marketplaceWarrior.headline,
      visionScopeD1: `D1 [${d1Dignity}]: व्यक्तिगत जीवन सामान्य या संघर्षशील रह सकता है।`,
      termsOfEngagementD9: `D9 [${d9Dignity}]: आंतरिक स्वभाव।`,
      marketplaceExecutionD10: tmpl.marketplaceWarrior.marketplaceD10,
      dashaStrategyHinglish: tmpl.marketplaceWarrior.strategy,
      severity: "favorable"
    };
  }

  // Fallback Harmonious
  return {
    planet: input.planet,
    pattern: "Harmonious_Balance",
    headlineHinglish: `${input.planet} संतुलित वर्गीय स्थिति (Balanced Harmonic Progression)`,
    visionScopeD1: `D1 [${d1Dignity}] स्थिति के अनुसार सामान्य व सुचारू कर्म।`,
    termsOfEngagementD9: `D9 [${d9Dignity}] में स्थिर व संतुलित आंतरिक समन्वय।`,
    dashaStrategyHinglish: "सामान्य सतत प्रयास से जीवन के सभी क्षेत्रों में स्थिर प्रगति होगी।",
    severity: "neutral"
  };
}

// ── Exalted Planet in Marana Karaka Sthana (MKS) Rise-to-Fall Parabola ─────────

export interface MKSExaltedAudit {
  planet: string;
  isMKS: boolean;
  isExalted: boolean;
  isRiseToFallParabola: boolean;
  archetypeHinglish: string;
  risePhaseHinglish: string;
  fallWarningHinglish: string;
}

export const MARANA_KARAKA_HOUSES: Record<string, number[]> = {
  Sun: [12],
  Moon: [8],
  Mars: [7],
  Mercury: [7, 4],
  Jupiter: [3],
  Venus: [6],
  Saturn: [1],
  Rahu: [9],
  Ketu: [1, 2],
};

export function evaluateExaltedInMKS(planet: string, house: number, dignity: string): MKSExaltedAudit {
  const mksHouses = MARANA_KARAKA_HOUSES[planet] || [];
  const isMKS = mksHouses.includes(house);
  const isExalted = dignity.toLowerCase() === "exalted";
  const isRiseToFallParabola = isMKS && isExalted;

  let archetype = "";
  let risePhase = "";
  let fallWarning = "";

  if (isRiseToFallParabola) {
    if (planet === "Rahu" && house === 9) {
      archetype = "मरण कारक स्थान में उच्च राहु (Hitler Archetype)";
      risePhase = "राहु की महादशा में वैश्विक पैमाने पर अभूतपूर्व सत्ता, शक्ति और जन-आकर्षण का विस्फोट।";
      fallWarning = "दशा के अंतिम चरण में विनाशकारी पतन (Catastrophic Downfall); पूरे तंत्र और स्वयं का संपूर्ण विनाश।";
    } else if (planet === "Jupiter" && house === 3) {
      archetype = "मरण कारक स्थान में उच्च गुरु (Osho Archetype)";
      risePhase = "कर्क का गुरु तृतीय भाव में: शिष्यों, आश्रमों और वैश्विक प्रभाव का ऐतिहासिक विस्तार।";
      fallWarning = "वही शिष्य और निकटतम अनुयायी संस्था के लिए विष और कानूनी विवाद बन जाते हैं; वैश्विक विस्तार में अचानक रुकावट।";
    } else if (planet === "Mars" && house === 7) {
      archetype = "मरण कारक स्थान में उच्च मंगल (The Extreme Combative Parabola)";
      risePhase = "दाम्पत्य और व्यापारिक साझेदारियों में अत्यधिक आक्रामक विजय और प्रभुत्व।";
      fallWarning = "सख्त कानूनी विवाद, जीवनसाथी से भयानक टकराव या साझेदारियों का हिंसक विघटन।";
    } else {
      archetype = `मरण कारक स्थान में उच्च ${planet} (Parabolic Rise & Fall)`;
      risePhase = `${planet} की दशा में अभूतपूर्व शिखर पर पहुंचना।`;
      fallWarning = "दशा के अंत में अत्यधिक अप्रत्याशित और तेज पतन की चेतावनी।";
    }
  }

  return {
    planet,
    isMKS,
    isExalted,
    isRiseToFallParabola,
    archetypeHinglish: archetype,
    risePhaseHinglish: risePhase,
    fallWarningHinglish: fallWarning,
  };
}

// ── "Whose Problem Is It?" Karmic Transfer Rule ───────────────────────────────

export interface WhoseProblemAudit {
  isBhogaDashaActive: boolean;
  bhogaPlanet: string;
  whoSuffersHinglish: string;
  karmicTransferInsightHinglish: string;
}

export function evaluateWhoseProblemIsIt(
  activeDashaPlanet: string,
  isParentConsulting: boolean,
  parentHasRealEstateAffliction: boolean
): WhoseProblemAudit {
  const isBhoga = ["Moon", "Venus"].includes(activeDashaPlanet);
  return {
    isBhogaDashaActive: isBhoga,
    bhogaPlanet: activeDashaPlanet,
    whoSuffersHinglish: isBhoga && isParentConsulting ? "कष्ट पिता/माता को है, संतान को नहीं (Child in Pure Bhoga)" : "व्यक्तिगत कर्म चक्र",
    karmicTransferInsightHinglish: isBhoga && parentHasRealEstateAffliction
      ? "संतान 10-वर्षीय चंद्रमा/शुक्र की महादशा में मौज-मस्ती व उपभोग (Bhoga) कर रही है; वह पीड़ित नहीं है। माता-पिता द्वारा रियल एस्टेट, विवादित भूमि या गलत माध्यम से अर्जित धन संतान के अनियंत्रित खर्चों से वाष्पीकृत (Evaporate) हो रहा है। ऋण पिता का है, भुगतान संतान के हाथों हो रहा है।"
      : "दशा वर्तमान जातक के निजी कर्मों के अनुसार फलित हो रही है।"
  };
}


