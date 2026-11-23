// src/lib/report/report-i18n.ts
// AstroLife — Dedicated Report Internationalization & Localization Engine
// Powers:
// 1. 100% Crisp English Edition (for NRI & International Elite users)
// 2. 100% Shuddh Hindi Edition (for Domestic Elite users)

export type ReportLang = "en" | "hi";

export function normalizeReportLang(lang?: string): ReportLang {
  if (!lang) return "en";
  const l = lang.toLowerCase().trim();
  if (l === "hi" || l === "hindi") return "hi";
  return "en";
}

// ── Common UI & Section Rail Translations ──────────────────────────────────
export const REPORT_LABELS = {
  en: {
    coverTag: "Cosmic Blueprint · Personal Operating System",
    coverSub: "Integrative Vedic Astrology · Predictive Analytics · Karmic Optimization",
    issuedBy: "Issued By",
    place: "Place",
    date: "Date",
    edition: "Edition",
    toc: "Table of Contents",
    page: "Page",
    scoreboard: "Universal Intelligence Scoreboard",
    destinySnapshot: "Destiny Snapshot · Personal OS",
    planetaryDashboard: "Planetary Dashboard & Coordinates",
    vimshottariDasha: "Vimshottari Dasha Intelligence",
    upcomingDashas: "Upcoming Mahadasha Timeline",
    lalKitab: "Lal Kitab Core Diagnostics & Upaya",
    divisional: "Divisional Charts · Shodasha Varga Synthesis",
    yogas: "Yogas · Classical Royal Combinations",
    doshas: "Doshas · Karmic Disturbances & Remedies",
    shadbala: "Shadbala · Six-fold Planetary Potency",
    ashtakavarga: "Ashtakavarga Matrix · Bindu Distribution",
    medicalAstro: "Vedic Medical Astrology & Vitality",
    psychology: "Psychological Architecture & Cognitive Antahkarana",
    numerology: "Vedic Numerology & Core Frequencies",
    jaimini: "Jaimini Astrology · Karakas & Chara Dasha",
    astroVastu: "Astro-Vastu · 16 Sacred Spatial Zones",
    sarvatobhadra: "Sarvatobhadra Chakra · Vedha Radar",
    kp: "Krishnamurti Paddhati · Sub-Lord Precision",
    transitRipple: "Planetary Transits & 7-Day Ripple Radar",
    specialLagnas: "Special Lagnas · Sensitive Karmic Points",
    marriageTiming: "Marriage Readiness & Timing Fusion",
    relationshipIntel: "Relationship Intelligence & Harmony",
    astroSound: "Astro Sound Protocol · Raga Therapy",
    gemstoneSuitability: "Planetary Gemstones & Ratna Protocols",
    eliteSynthesis: "Elite Synthesis · Master Astrologer Blueprint",
    tradingRisk: "Trading Risk Guardrail · F&O Capital Protection",
    twelfthHouse: "12th House Sacred Currency · Incubation Protocol",
    careerD10: "D10 Dashamsha Career Specifier · Micro-Niche",
    healthTiming: "Moon Dispositor Health & Restorative Rhythm",
    functionalDebility: "Functional Debility Guard & Gemstone Safety",
    lineageKarma: "Lineage Karma & Kula Devata Sanctuary",
    jyotirlinga: "12 Jyotirlinga Pilgrimage Sanctuary",
    closing: "Sacred Conclusion & Vedic Benediction",
    shlokaMeaning: "May all sentient beings be joyful, healthy, and free from distress.",
  },
  hi: {
    coverTag: "कॉस्मिक ब्लूप्रिंट · व्यक्तिगत ज्योतिषीय जीवन-विधान",
    coverSub: "वैदिक ज्योतिष · भविष्यकथन विश्लेषण · कर्म संशोधन",
    issuedBy: "प्रदाता",
    place: "स्थान",
    date: "तिथि",
    edition: "संस्करण",
    toc: "विषय-सूची",
    page: "पृष्ठ",
    scoreboard: "सार्वभौमिक ज्योतिषीय अंकतालिका",
    destinySnapshot: "भाग्य सार · व्यक्तिगत जीवन प्रणाली",
    planetaryDashboard: "ग्रह स्थिति, अंश व नक्षत्र विवरण",
    vimshottariDasha: "विंशोत्तरी महादशा व अंतर्दशा विश्लेषण",
    upcomingDashas: "आगामी महादशा समय-चक्र",
    lalKitab: "लाल किताब सटीक फलादेश एवं अचूक उपाय",
    divisional: "षोडशवर्ग चक्र · सूक्ष्म जीवन फल",
    yogas: "शुभ राजयोग व विशिष्ट योग संयोजन",
    doshas: "दोष विश्लेषण, शांति व कर्म सुधार",
    shadbala: "षड्बल · ग्रहों का षड्विध बल",
    ashtakavarga: "अष्टकवर्ग चक्र · बिंदु वितरण",
    medicalAstro: "वैदिक आयुर्वेद चिकित्सा व स्वास्थ्य",
    psychology: "मनोवैज्ञानिक विश्लेषण व अंतःकरण संरचना",
    numerology: "वैदिक अंक ज्योतिष व नामांक रहस्य",
    jaimini: "जैमिनी ज्योतिष · आत्मकारक व चर दशा",
    astroVastu: "एस्ट्रो-वास्तु · 16 दिशा ऊर्जा विश्लेषण",
    sarvatobhadra: "सर्वतोभद्र चक्र · वेध एवं दृष्टि विश्लेषण",
    kp: "कृष्णमूर्ति पद्धति · उप-स्वामी सूक्ष्म फलादेश",
    transitRipple: "गोचर तरंग · 7-दिवसीय सक्रियता रडार",
    specialLagnas: "विशिष्ट लग्न · आरूढ़ व संवेदनशील बिंदु",
    marriageTiming: "विवाह काल निर्धारण व तत्परता चक्र",
    relationshipIntel: "वैवाहिक सामंजस्य व दांपत्य बुद्धिमत्ता",
    astroSound: "एस्ट्रो-साउंड · राग चिकित्सा व नाद ब्रह्म",
    gemstoneSuitability: "रत्न परामर्श · धारण विधि व सुरक्षा",
    eliteSynthesis: "अंतिम समन्वय · वरिष्ठ ज्योतिषी परामर्श",
    tradingRisk: "ट्रेडिंग व सट्टा जोखिम गार्डरेल · पूंजी सुरक्षा",
    twelfthHouse: "12वां भाव · गुप्त संपदा व विश्राम साधना",
    careerD10: "दशमांश (D10) करियर व आजीविका निर्देशक",
    healthTiming: "चंद्र अधिपति स्वास्थ्य व विश्राम समय",
    functionalDebility: "अकारक ग्रह सुरक्षा व रत्न निषेध नियम",
    lineageKarma: "कुल देवता, पितृ ऋण व वंश कर्म साधना",
    jyotirlinga: "12 ज्योतिर्लिंग महातीर्थ अभयारण्य",
    closing: "वैदिक शांति पाठ व आशीर्वचन",
    shlokaMeaning: "सभी प्राणी सुखी हों, निरोगी हों और सबका कल्याण हो।",
  },
} as const;

// ── Psychology Module Content ──────────────────────────────────────────────
export interface PsychologyTranslations {
  dominantDesc: string;
  shadowSide: string;
  antahkaranaDesc: Record<string, string>;
  bigFiveDesc: Record<string, string>;
  circadianPeak: {
    focusWindow: string;
    resetWindow: string;
    insight: string;
  };
}

export function getPsychologyI18n(lang: ReportLang, isNightOwl: boolean, moonHouse: number, mercHouse: number): PsychologyTranslations {
  if (lang === "en") {
    return {
      dominantDesc: "Steadfast self-respect, natural executive gravity, and the intrinsic drive to conquer on sovereign terms.",
      shadowSide: "Hyper-critical over-analysis, latent anxiety regarding future uncertainties, and rigid perfectionism.",
      antahkaranaDesc: {
        Buddhi: "Deep architectural logic, independent decision mastery, and systematic execution power.",
        Ahamkara: "Steadfast self-respect, natural leadership presence, and sovereign dignity.",
        Manas: "Profound intuitive synthesis, emotional receptivity, and acute empathy for human sentiment.",
        Chitta: "Intense deep-work capacity, breakthrough esoteric research, and transcendent mastery in solitude.",
      },
      bigFiveDesc: {
        Conscientiousness: "Serious commitment to duty, perseverance toward long-term targets, and methodical execution standards.",
        Extraversion: "Direct leadership drive and social impact, balanced with selective focus.",
        "Openness to Experience": "Visionary openness to unconventional paradigms, philosophical depth, and non-linear insights.",
        "Emotional Stability": "Resilient inner baseline capable of absorbing intense operational pressure.",
        Agreeableness: "Principled collaboration anchored in objective truth rather than emotional appeasement.",
      },
      circadianPeak: {
        focusWindow: isNightOwl ? "10:00 PM to 1:30 AM or 5:30 AM to 8:30 AM" : "6:30 AM to 10:00 AM or 4:30 PM to 7:30 PM",
        resetWindow: "2:00 PM to 4:00 PM (low-cognitive load maintenance)",
        insight: isNightOwl
          ? "Natal 12th-house and Mercury placements indicate your analytical engine operates at peak velocity when external noise dissolves into quiet."
          : `Natal Moon (H${moonHouse}) and Mercury (H${mercHouse}) indicate that serene, focused environments trigger your highest intellectual breakthrough capacity.`,
      },
    };
  }

  return {
    dominantDesc: "अडिग आत्म-सम्मान, स्वाभाविक नेतृत्व गरिमा और अपनी शर्तों पर दुनिया जीतने का तेज।",
    shadowSide: "अत्यधिक विश्लेषण, भविष्य की अनिश्चितता की गुप्त चिंता और पूर्णतावाद।",
    antahkaranaDesc: {
      Buddhi: "गहन तार्किक बुद्धि, स्वतंत्र निर्णय क्षमता और सुव्यवस्थित सिस्टम्स रचने की शक्ति।",
      Ahamkara: "अडिग आत्म-सम्मान, स्वाभाविक नेतृत्व गरिमा और अपनी शर्तों पर दुनिया जीतने का तेज।",
      Manas: "गहरा अंतर्ज्ञान, संवेगात्मक सूक्ष्मता और जन-मानस की भावनाओं को भांपने की शक्ति।",
      Chitta: "गहन एकाग्रता, गूढ़ रहस्यों का अनुसंधान और एकांत में उत्कृष्ट कार्य की सिद्धि।",
    },
    bigFiveDesc: {
      Conscientiousness: "दायित्वों के प्रति गंभीरता, दीर्घकालिक लक्ष्यों पर अडिग रहना और कार्य में पूर्णतावाद।",
      Extraversion: "बहिर्मुखी ऊर्जा, सामाजिक नेतृत्व और प्रत्यक्ष प्रभावशीलता।",
      "Openness to Experience": "नए विचारों, दर्शन और गूढ़ शोध के प्रति स्वाभाविक खुलापन।",
      "Emotional Stability": "दबाव की स्थिति में आंतरिक संतुलन और कठिन परिस्थितियों से उबरने की क्षमता।",
      Agreeableness: "सत्य पर आधारित निष्पक्ष व्यवहार और सिद्धांतों से समझौता न करने की वृत्ति।",
    },
    circadianPeak: {
      focusWindow: isNightOwl ? "रात्रि 10:00 PM से 1:30 AM अथवा प्रातः 5:30 AM से 8:30 AM" : "प्रातः 6:30 AM से 10:00 AM अथवा सायंकाल 4:30 PM से 7:30 PM",
      resetWindow: "दोपहर 2:00 PM से 4:00 PM (न्यूनतम मानसिक मांग का समय)",
      insight: isNightOwl
        ? "आपकी जन्मकुंडली में भाव 12 (एकांत) और बुध की स्थिति दर्शाती है कि जब बाहरी दुनिया शांत होती है, तब आपका संज्ञानात्मक इंजन चरम फोकस पर काम करता है।"
        : `आपकी जन्मकुंडली में चंद्रमा (भाव ${moonHouse}) और बुध (भाव ${mercHouse}) की स्थिति दर्शाती है कि शांत वातावरण में आपका संज्ञानात्मक फोकस अपने चरम पर काम करता है।`,
    },
  };
}

// ── 12th House Sacred Currency Content ──────────────────────────────────────
export interface TwelfthHouseI18n {
  archetypeTitle: string;
  hiddenCurrency: string;
  curseOfExhaustion: string;
  preservationGuidance: string;
  sabbaticalProtocol: string;
}

const TWELFTH_HOUSE_DATA_EN: Record<string, { archetype: string; currency: string; curse: string; guidance: string }> = {
  Aries: {
    archetype: "The Mystic Warrior (Oceanic Compassion Behind Armor)",
    currency: "Deep spiritual surrender, transcendent imagination, and quiet compassion. Beneath an assertive exterior lies a deeply emotional contemplative soul.",
    curse: "Revealing emotional vulnerability prematurely invites exploitation from opportunists.",
    guidance: "Offer your sensitivity to the Divine in quiet contemplation. Night silence and meditation are your supreme power sources.",
  },
  Taurus: {
    archetype: "The Dormant Volcano (Fierce Fire Behind Quiet Stability)",
    currency: "Formidable physical stamina, decisive crisis action, and fierce will. Beneath a calm and gentle exterior lies unimaginable power in moments of genuine emergency.",
    curse: "Dissipating fiery resolve in trivial daily squabbles disrupts health and material stability.",
    guidance: "Never expose raw anger publicly. Channel it constructively into intense physical conditioning, architecture, or high-stakes building.",
  },
  Gemini: {
    archetype: "The Secret Treasurer (Reserved Wealth Behind Light Wit)",
    currency: "Ancestral wisdom, hidden capital reserves, and steadfast financial prudence. Beneath an expressive, lighthearted facade sits an untouchable fiscal bedrock.",
    curse: "Flaunting savings or assets invites parasitic requests for loans that drain resources.",
    guidance: "Maintain absolute confidentiality around bank accounts and strategic assets. Move with unassuming modesty.",
  },
  Cancer: {
    archetype: "The Silent Strategist (Analytical Depth Behind Empathy)",
    currency: "Calculated negotiation prowess, high commercial discernment, and sharp analytical logic. Beneath nurturing empathy lies a formidable private strategist.",
    curse: "Exposing business strategies before execution allows rivals to preempt your trajectory.",
    guidance: "Craft your commercial agreements and career moves in quiet seclusion. Announce only completed triumphs.",
  },
  Leo: {
    archetype: "The Compassionate Monarch (Sacred Devotion Behind Regality)",
    currency: "Profound spiritual devotion, sacred emotional depth, and silent charity. Beneath royal command and self-assurance lies a deeply reverent heart.",
    curse: "Allowing public ego to overpower inner spiritual humility creates karmic fatigue.",
    guidance: "Practice discreet charitable giving without fanfare. Sacred water rituals and evening prayers recharge your sovereign essence.",
  },
  Virgo: {
    archetype: "The Hidden Sovereign (Regal Authority Behind Humble Service)",
    currency: "Natural executive command, unshakeable self-respect, and creative vision. Beneath meticulous analysis and modest service lives a visionary empire-builder.",
    curse: "Permitting superiors or peers to undervalue your intellectual worth breeds suppressed resentment.",
    guidance: "Stand firm in your sovereign professional dignity. Meditate on morning solar energy to revitalize inner nobility.",
  },
  Libra: {
    archetype: "The Precision Alchemist (Forensic Scrutiny Behind Harmony)",
    currency: "Forensic intellectual precision, relentless quality control, and monastic focus. Beneath gracious diplomacy lies an uncompromising eye for excellence.",
    curse: "Obsessive micromanagement of daily minutiae produces cognitive exhaustion.",
    guidance: "Direct your analytical discernment exclusively toward high-value masterworks. Maintain clean, uncluttered living spaces.",
  },
  Scorpio: {
    archetype: "The Sacred Diplomat (Harmonic Equilibrium Behind Intensity)",
    currency: "Deep capacity for peaceful mediation, subtle diplomacy, and sacred companionship. Beneath intense transformative depth lies a quiet longing for cosmic harmony.",
    curse: "Mistaking toxic individuals for soul-unions leads to emotional entanglements.",
    guidance: "Keep your intimate personal sphere exceptionally pure. Seek sacred companionship anchored in mutual spiritual respect.",
  },
  Sagittarius: {
    archetype: "The Occult Sage (Esoteric Power Behind Philosophical Optimism)",
    currency: "Tantric psychological depth, regenerative healing mastery, and fearless resilience. Beneath joyful philosophy lies an initiate of profound mysteries.",
    curse: "Sharing esoteric insights with superficial critics breeds doubt and cynic backlash.",
    guidance: "Honor solitary research into transformative knowledge. Kundalini discipline and breathwork restore vital vigor.",
  },
  Capricorn: {
    archetype: "The Universal Benefactor (Expansive Wisdom Behind Stoic Duty)",
    currency: "Cosmic philosophical generosity, mentorship grace, and dharmic vision. Beneath stern duty and organizational discipline lies a benevolent universal protector.",
    curse: "Becoming weighed down by bureaucratic cynicism blinds the soul to expansive fortunes.",
    guidance: "Engage in higher philosophical study and mentor rising talent. Align career structures with timeless moral principles.",
  },
  Aquarius: {
    archetype: "The Master Architect (Grounded Pragmatism Behind Innovation)",
    currency: "Steely institutional realism, grounded endurance, and supreme structural discipline. Beneath visionary futurism lies a master engineer of enduring systems.",
    curse: "Over-isolating in severe emotional detachment dries up creative vitality.",
    guidance: "Anchor visionary ideals into solid physical institutions. Regular contact with earth and stone grounds the intellect.",
  },
  Pisces: {
    archetype: "The Cosmic Networker (Collective Synergy Behind Mysticism)",
    currency: "Subconscious telepathic connection to humanity, grand humanitarian vision, and universal communion. Beneath dreamy solitude lies a catalyst for collective awakening.",
    curse: "Absorbing the psychic turbulence of crowds clouds your individual destiny.",
    guidance: "Filter your social sphere ruthlessly. Work on large-scale humanitarian technology and art from private sanctums.",
  },
};

export function getTwelfthHouseI18n(lang: ReportLang, lagnaSign: string): TwelfthHouseI18n {
  const normSign = lagnaSign || "Virgo";
  if (lang === "en") {
    const data = TWELFTH_HOUSE_DATA_EN[normSign] ?? TWELFTH_HOUSE_DATA_EN["Virgo"];
    return {
      archetypeTitle: data.archetype,
      hiddenCurrency: data.currency,
      curseOfExhaustion: data.curse,
      preservationGuidance: data.guidance,
      sabbaticalProtocol: "Whenever the 12th house or its lord becomes dasha-active, pause external hustle and undertake a 1 to 3 month deep-work sabbatical. Sleep, meditation, and quiet incubation are the true birthplaces of sovereign breakthroughs.",
    };
  }

  // Hindi Fallback
  return {
    archetypeTitle: "The Sovereign Leader (अडिग आत्म-सम्मान एवं गुप्त शक्ति)",
    hiddenCurrency: "गहन आध्यात्मिक समर्पण, अलौकिक कल्पना और मूक करुणा। एकांत और रात्रि का मौन ही आपकी वास्तविक संचित शक्ति है।",
    curseOfExhaustion: "यदि अपनी संवेदनशीलता दुनिया के सामने दिखाएं, तो लोग इसे कमजोरी समझकर अनुचित लाभ उठाने का प्रयास करते हैं।",
    preservationGuidance: "अपनी करुणा और आंसुओं को एकांत में ईश्वर को अर्पित करें। ध्यान और रात्रि का मौन ही आपकी गुप्त शक्ति है।",
    sabbaticalProtocol: "जब भी 12वें भाव या उसके स्वामी की दशा सक्रिय हो, दौड़भाग छोड़कर 1-3 माह का एकांत सैबैटिकल लें। नींद, ध्यान और अवचेतन मन की प्रेरणा से जीवन का सबसे बड़ा साम्राज्य खड़ा होता है।",
  };
}

// ── D10 Career Specifier Translations ──────────────────────────────────────
export interface CareerSpecifierI18n {
  primaryTitle: string;
  subDomainNiche: string;
  circuitLogic: string;
  officeMobilityStatus: string;
  leadershipArchetype: string;
  deepTechSignature: string;
}

export function getCareerSpecifierI18n(lang: ReportLang, d10Input: { hasKetuLagna?: boolean; d10FourthLordActive?: boolean }): CareerSpecifierI18n {
  const isKetu = Boolean(d10Input.hasKetuLagna);
  const isFourthActive = Boolean(d10Input.d10FourthLordActive);

  if (lang === "en") {
    return {
      primaryTitle: isKetu ? "Autonomous Sovereign Founder" : "Commercial & Enterprise Leadership",
      subDomainNiche: isKetu
        ? "Boutique advisory, autonomous specialized enterprise, and advisory boards without bureaucratic interference."
        : "Corporate executive strategy, enterprise scaling, institutional finance, and operational governance.",
      circuitLogic: isKetu
        ? "Ketu in D10 Lagna rejects subservience, propelling the native to operate as an absolute sovereign authority."
        : "Strong 10th-house matrix reflects executive command and enduring commercial enterprise development.",
      officeMobilityStatus: isFourthActive
        ? "Forced executive mobility: D10 4th lord dasha demands frequent travel, offsite leadership, and international operations rather than a static desk."
        : "Stable operational headquarters: The native operates with peak leverage from a permanent base or core executive suite.",
      leadershipArchetype: "Institution-Builder: Driving long-term enterprise scale through disciplined governance and structured operational systems.",
      deepTechSignature: "High-dexterity technological mastery, systemic engineering, and quantitative precision.",
    };
  }

  return {
    primaryTitle: isKetu ? "स्वतंत्र संप्रभु संस्थापक (Autonomous Sovereign Founder)" : "उद्यमी एवं व्यावसायिक नेतृत्व (Commercial & Enterprise Leadership)",
    subDomainNiche: isKetu
      ? "बिना किसी बोर्ड या बॉस के दबाव के अपनी शर्तों पर स्वायत्त कंपनी या विशेष सलाहकारी।"
      : "कॉर्पोरेट रणनीति, व्यवसाय विस्तार, संस्थागत वित्त और सुव्यवस्थित परिचालन नेतृत्व।",
    circuitLogic: isKetu
      ? "दशमांश लग्न में केतु व्यक्ति को किसी के अधीन काम नहीं करने देता। यह शीर्ष स्वायत्तता का प्रतीक है।"
      : "दशमांश चक्र का सशक्त विन्यास संस्थागत नेतृत्व और दीर्घकालिक व्यावसायिक सफलता का निर्माण करता है।",
    officeMobilityStatus: isFourthActive
      ? "गतिशील नेतृत्व: चतुर्थेश की सक्रियता के कारण स्थिर कार्यालय के बजाय लगातार यात्रा व फील्ड ऑपरेशंस आवश्यक होंगे।"
      : "स्थिर कार्यस्थल: जातक अपने मुख्य कार्यालय या गृह-स्थान से सुचारू रूप से कार्य कर सकता है।",
    leadershipArchetype: "संस्थान-निर्माता: प्रक्रियाओं और टीम के अनुशासन के साथ दीर्घकालिक सफलता प्राप्त करने वाला नेतृत्व।",
    deepTechSignature: "उच्च तकनीकी दक्षता, सिस्टम इंजीनियरिंग और डेटा-संचालित विश्लेषण।",
  };
}

// ── Trading & Speculative Risk Guardrail Translations ──────────────────────
export interface TradingRiskI18n {
  psychologicalDiagnosis: string;
  circuitBreakerActionText: string;
  mandatoryGuardrail: string;
  careerPivotDirective: string;
}

export function getTradingRiskI18n(lang: ReportLang, isRevenge: boolean): TradingRiskI18n {
  if (lang === "en") {
    return {
      psychologicalDiagnosis: isRevenge
        ? "The Revenge Trading Spiral: Utilizing leverage or borrowed capital in Derivatives (F&O) to swiftly recover prior drawdowns is a certified ruin vector. An afflicted Moon fuels post-loss panic while Rahu creates delusions of immediate grand recovery."
        : "Speculative Volatility Alert: High-frequency derivatives and intraday positions trigger emotional turbulence that compromises capital stability.",
      circuitBreakerActionText: "🛑 MANDATORY F&O CIRCUIT BREAKER ACTIVATED",
      mandatoryGuardrail: "Immediate freeze on speculative derivatives (Options/Futures). Re-allocate capital strictly into un-leveraged physical assets, mutual funds, or disciplined cash equities.",
      careerPivotDirective: "Re-anchor executive energy into 6th-house disciplined enterprise service, consulting, or operating businesses. Sustainable fortunes are generated through systematic value creation, not leveraged roulette.",
    };
  }

  return {
    psychologicalDiagnosis: isRevenge
      ? "रिवेंज ट्रेडिंग का आत्मघाती चक्र: पुराने नुकसान को जल्दी वसूलने के लिए उधार लेकर या विरासत का पैसा ऑप्शंस (F&O) में लगाना वित्तीय आत्महत्या का निश्चित मार्ग है। पीड़ित चंद्रमा घाटे के बाद घबराहट और राहु झूठी उम्मीद देता है।"
      : "सट्टा जोखिम चेतावनी: डेरिवेटिव्स और इंट्राडे ट्रेडिंग में अत्यधिक उतार-चढ़ाव पूंजी और मानसिक शांति को नष्ट करता है।",
    circuitBreakerActionText: "🛑 तत्काल F&O ट्रेडिंग पर रोक आवश्यक",
    mandatoryGuardrail: "ऑप्शंस व फ्यूचर्स ट्रेडिंग को तुरंत फ्रीज करें। पूंजी को बिना लीवरेज वाले सुरक्षित निवेश या नकद शेयर होल्डिंग्स में स्थानांतरित करें।",
    careerPivotDirective: "अपनी ऊर्जा को 6ठे भाव की अनुशासित सेवा, नौकरी या वास्तविक व्यावसायिक उपक्रम में लगाएं। स्थायी संपदा उद्यम और मूल्य-निर्माण से बनती है, सट्टे से नहीं।",
  };
}

// ── Transit Shivling Upacharas Translations ────────────────────────────────
export interface ShivlingUpacharaI18n {
  title: string;
  subTitle: string;
  offeringMaterial: string;
  significance: string;
  procedure: string;
}

export function getShivlingUpacharaI18n(lang: ReportLang, nakshatra: string, upacharaName: string, defaultHindiTitle: string): ShivlingUpacharaI18n {
  if (lang === "en") {
    return {
      title: `${upacharaName} (Sacred Alignment for ${nakshatra})`,
      subTitle: "Vibrational Realignment through Dedicated Shiva Upachara",
      offeringMaterial: "Pure water, fresh Bilva leaves, and fragrant white sandalwood paste",
      significance: `Alleviates vibrational friction generated during the ${nakshatra} transit phase. Calms nervous agitation and transmutes karmic tension into spiritual clarity.`,
      procedure: "Sit facing East in the morning. Gently offer the prescribed sacred elements onto the Shivalinga while mentally reciting 'Om Namah Shivaya' 108 times with reverent devotion.",
    };
  }

  return {
    title: `${upacharaName} — ${defaultHindiTitle}`,
    subTitle: "गोचर नक्षत्र अनुसार शिवलिंग पूजा",
    offeringMaterial: "शुद्ध जल, ताज़ा बेलपत्र एवं श्वेत चंदन",
    significance: `${nakshatra} नक्षत्र के गोचर में उत्पन्न होने वाले मानसिक व व्यावहारिक तनाव को शांत करने के लिए यह उपचारा अत्यंत फलदायी है।`,
    procedure: "प्रातःकाल पूर्व दिशा की ओर मुख करके बैठें। शिवलिंग पर शांत मन से यह सामग्री अर्पित करें और 108 बार 'ॐ नमः शिवाय' का जप करें।",
  };
}

// ── Nakshatra Social Seva Translations ─────────────────────────────────────
export interface NakshatraSocialI18n {
  innerState: string;
  livingArchetype: string;
  karmicTrap: string;
  dailyConduct: string;
  primarySeva: string;
  pashuSeva: string;
  timing: string;
}

export function getNakshatraSocialI18n(lang: ReportLang, nakshatra: string, dashaLord: string): NakshatraSocialI18n {
  if (lang === "en") {
    return {
      innerState: `Your consciousness is currently guided by the vibrational wave of ${nakshatra} Nakshatra under ${dashaLord} dasha. This fosters visionary aspiration, dynamic restlessness, and a quest for autonomy.`,
      livingArchetype: `The Cosmic Catalyst: Like the winds of Swati or the light of Pushya, your soul is being initiated into sovereign self-reliance and purposeful worldly action.`,
      karmicTrap: "Premature impatience, scattered focus across too many ventures simultaneously, and reactive defensiveness when challenged.",
      dailyConduct: "Cultivate deliberate stillness before crucial communications. Speak with measured grace and avoid unnecessary commitments.",
      primarySeva: "Support grassroots education, provide food to daily-wage laborers, or sponsor underprivileged students.",
      pashuSeva: "Feed stray birds with grains every morning; provide fresh water and care to street dogs or cows.",
      timing: "Perform during early sunrise hours (Brahma Muhurta) or on Thursday/Saturday mornings.",
    };
  }

  return {
    innerState: `आपका वर्तमान जीवन इस समय ${dashaLord} ग्रह की दशा में ${nakshatra} नक्षत्र की ऊर्जा से संचालित है। यह समय स्वावलंबन और दूरदर्शी लक्ष्यों की प्राप्ति का है।`,
    livingArchetype: `कर्मयोगी पथिक: जैसे पवन का प्रवाह अप्रतिरोध्य होता है, वैसे ही आपकी चेतना आत्मनिर्भरता और सार्थक उपलब्धि की दिशा में अग्रसर है।`,
    karmicTrap: "अति-उतावलापन, एक साथ कई कार्यों में हाथ डालना और दूसरों की आलोचना पर त्वरित क्रोध।",
    dailyConduct: "महत्वपूर्ण निर्णयों से पूर्व शांत मन से विचार करें। कटु वाणी से बचें और अपने वचनों का सम्मान करें।",
    primarySeva: "जरूरतमंद विद्यार्थियों की शिक्षा में सहायता करें अथवा निर्धन व्यक्तियों को भोजन कराएं।",
    pashuSeva: "प्रतिदिन पक्षियों को दाना डालें और निराश्रित पशुओं (गौ/श्वान) की सेवा करें।",
    timing: "प्रातः सूर्योदय काल अथवा गुरुवार/शनिवार की सुबह विशेष रूप से फलदायी है।",
  };
}
