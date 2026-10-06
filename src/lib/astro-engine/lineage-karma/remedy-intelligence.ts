// src/lib/astro-engine/lineage-karma/remedy-intelligence.ts
// ============================================================================
// ASTROLIFE REMEDY INTELLIGENCE ENGINE v2.2
// Production Architecture:
// - 4-Tier Hierarchy: Behavioral Action → Traditional Practice → Spiritual Anchor → Special Gated
// - "One Remedy, One Purpose" with Deep Astrological & Psychological "WHY"
// - Strict Gating: No casual gemstones or heavy rituals without full chart audit
// - Duration (7/21/40 Days), Frequency & Self-Observation Tracker Milestones
// - 30-Day Non-Causal Life Reflection Questions
// - User Preference Filter (Practical, Traditional, Spiritual, Minimal)
// ============================================================================

import type { ChartData } from "../calculations";
import type { ElementType, KulaDevataProfile, ObstacleDiagnosis } from "./types";

export type RemedyCategory =
  | "Behavioral_Life_Action"
  | "Traditional_Practice"
  | "Spiritual_Practice"
  | "Specialized_Gated";

export type RemedyNeedLevel =
  | "Awareness"
  | "Support"
  | "Active_Practice"
  | "Specialized";

export type RemedyDuration =
  | "7_Days"
  | "21_Days"
  | "40_Days"
  | "Monthly"
  | "Annual"
  | "Ongoing";

export type UserRemedyPreference =
  | "All"
  | "Practical"
  | "Traditional"
  | "Spiritual"
  | "Minimal";

export type SourceLevel =
  | "L1_Classical"
  | "L2_Tradition"
  | "L3_AstroLife_Synthesis"
  | "L4_Experimental";

export interface RemedyItem {
  id: string;
  title: string;
  category: RemedyCategory;
  needLevel: RemedyNeedLevel;
  oneLinePurpose: string; // One Remedy, One Purpose
  whyThisRemedy: string; // The deep astrological + psychological rationale
  practiceInstructions: string;
  frequency: string;
  duration: RemedyDuration;
  priority: 1 | 2 | 3; // 1 = Immediate, 2 = Regular habit, 3 = Optional/Secondary
  sourceLevel: SourceLevel;
  contraindicationNotes?: string;
  reflectionMilestones: {
    day1: string;
    day7: string;
    day21: string;
    day40?: string;
  };
  thirtyDayValidationQuestion: string;
}

export interface RemedyIntelligenceResult {
  nativeName: string;
  userPreference: UserRemedyPreference;
  topEssentialPractices: RemedyItem[]; // Exactly 2-3 focused practices
  optionalPractices: RemedyItem[];
  gemstoneEligibility: {
    isEligible: boolean;
    reason: string;
    recommendedGem?: string;
  };
  thirtyDayAuditGuide: {
    title: string;
    questions: string[];
  };
}

export function generateRemedyIntelligence(
  chart: ChartData | null | undefined,
  kulaDevata: KulaDevataProfile,
  obstacles: ObstacleDiagnosis[],
  saturnElement: ElementType,
  options?: {
    nativeName?: string;
    preference?: UserRemedyPreference;
  }
): RemedyIntelligenceResult {
  const name = options?.nativeName || chart?.name || "Seeker";
  const preference = options?.preference || "All";

  const allRemedies: RemedyItem[] = [];

  const sunH = chart?.planets?.Sun?.house;
  const rahuH = chart?.planets?.Rahu?.house;
  const moonH = chart?.planets?.Moon?.house;
  const marsH = chart?.planets?.Mars?.house;
  const saturnH = chart?.planets?.Saturn?.house;

  // ── 1. BEHAVIORAL: FATHER RELATIONSHIP & ORAL HISTORY ────────────────────
  if (sunH === 10 || sunH === 9 || obstacles.some((o) => o.domain === "Career_99_Stagnation")) {
    allRemedies.push({
      id: "rem_father_history",
      title: "पिता से संवाद और पारिवारिक इतिहास जानना",
      category: "Behavioral_Life_Action",
      needLevel: "Active_Practice",
      oneLinePurpose: "पारिवारिक संघर्ष की समझ और पिता से भावनात्मक स्पष्टता",
      whyThisRemedy:
        "10वें भाव में सूर्य और कर्म का गहरा संबंध है। पिता के अनकहे संघर्ष को समझे बिना करियर में स्वयं की स्वतंत्र पहचान बनाना कठिन होता है। यह संवाद अवचेतन दबाव को समाप्त करता है।",
      practiceInstructions:
        "किसी दिन शांत वातावरण में पिता के पास बैठें और केवल दो प्रश्न पूछें: 'आपके जीवन की सबसे बड़ी मुश्किल क्या रही थी?' और 'आपने उस मुश्किल से कैसे निकला?' उन्हें जज किए बिना केवल सुनें।",
      frequency: "महीने में 1-2 बार आत्मीय बातचीत",
      duration: "Ongoing",
      priority: 1,
      sourceLevel: "L3_AstroLife_Synthesis",
      reflectionMilestones: {
        day1: "क्या मैंने बातचीत की शुरुआत बिना किसी पुरानी कड़वाहट या अपेक्षा के की?",
        day7: "पिता के अनुभवों को जानकर क्या उनके प्रति मेरा दृष्टिकोण अधिक संवेदनशील हुआ?",
        day21: "क्या मेरे अंदर 'खुद को साबित करने' का अनावश्यक दबाव कम हुआ?",
      },
      thirtyDayValidationQuestion: "क्या पिता के साथ आपके संवाद में पहले की तुलना में अधिक खुलापन और शांति महसूस हुई?",
    });
  }

  // ── 2. BEHAVIORAL: FINANCIAL CLARITY (RAHU 2ND) ──────────────────────────
  if (rahuH === 2 || obstacles.some((o) => o.domain === "Health_Wealth_Leak")) {
    allRemedies.push({
      id: "rem_financial_structure",
      title: "वित्तीय सीमाओं (Financial Boundaries) का निर्धारण",
      category: "Behavioral_Life_Action",
      needLevel: "Active_Practice",
      oneLinePurpose: "पारिवारिक धन-चिंताओं से मुक्त होकर आत्मनिर्भर वित्तीय पहचान बनाना",
      whyThisRemedy:
        "दूसरे भाव का राहु परिवार के पुराने वित्तीय भय या अनियोजित खर्चों की आदत देता है। लिखित वित्तीय अनुशासन ही इसका सबसे अचूक कर्म सुधार है।",
      practiceInstructions:
        "अपनी मासिक आय का 20% व्यक्तिगत आपातकालीन कोष में अलग रखें। परिवार की ज़िम्मेदारियों और व्यक्तिगत बचत को स्पष्ट रूप से डायरी या स्प्रेडशीट में दर्ज करें।",
      frequency: "प्रतिमाह वेतन/आय के समय",
      duration: "21_Days",
      priority: 1,
      sourceLevel: "L3_AstroLife_Synthesis",
      reflectionMilestones: {
        day1: "क्या मैंने अपनी व्यक्तिगत बचत और पारिवारिक खर्चों की स्पष्ट सूची बनाई?",
        day7: "क्या किसी अनावश्यक वित्तीय दबाव या भावनात्मक खर्चे को मैंने ना कहना सीखा?",
        day21: "क्या धन को लेकर मन में छाई पुरानी असुरक्षा में कमी आई?",
      },
      thirtyDayValidationQuestion: "क्या पिछले 30 दिनों में आपके बचत और खर्चों में बेहतर नियंत्रण और स्पष्टता महसूस हुई?",
    });
  }

  // ── 3. BEHAVIORAL: EMOTIONAL HOLDING RELEASE (MOON-MARS 12H) ─────────────
  if (moonH === 12 || marsH === 12) {
    allRemedies.push({
      id: "rem_emotional_journaling",
      title: "दैनिक भावनात्मक जर्नलिंग (Emotional De-loading)",
      category: "Behavioral_Life_Action",
      needLevel: "Support",
      oneLinePurpose: "रात के समय मन के अतिरिक्त विचारों और दबे हुए गुस्से का सुरक्षित निकास",
      whyThisRemedy:
        "12वें भाव में चंद्रमा और मंगल होने से व्यक्ति 'सबको संभालना है' सोचकर अपना दर्द भीतर दबाता है। रात को 10 मिनट लिखना मन को शांत करता है।",
      practiceInstructions:
        "सोने से पहले एक डायरी में 5-10 मिनट लिखें: 'आज किस बात ने मुझे परेशान किया, और मैंने उसे भीतर क्यों रोका?' लिखने के बाद कागज़ को बंद कर दें और गहरी साँस लें।",
      frequency: "प्रतिदिन रात्रि को सोने से पूर्व (10 मिनट)",
      duration: "21_Days",
      priority: 2,
      sourceLevel: "L3_AstroLife_Synthesis",
      reflectionMilestones: {
        day1: "क्या मैंने बिना किसी झिझक के अपनी सच्ची भावनाएँ पन्नों पर उतारीं?",
        day7: "क्या रात को सोते समय मन का भारीपन पहले से हल्का महसूस हो रहा है?",
        day21: "क्या छोटी-छोटी बातों पर आने वाला भीतरी चिड़चिड़ापन शांत हुआ?",
      },
      thirtyDayValidationQuestion: "क्या जर्नलिंग करने से आपके मन की शांति और नींद की गुणवत्ता में सकारात्मक अंतर आया?",
    });
  }

  // ── 4. TRADITIONAL: PITRU SMRAN & TARPAN WITH GRATITUDE ──────────────────
  allRemedies.push({
    id: "rem_pitru_tarpan",
    title: "अमावस्या व पितृपक्ष में कृतज्ञता तर्पण व स्मरण",
    category: "Traditional_Practice",
    needLevel: "Active_Practice",
    oneLinePurpose: "पूर्वजों के प्रति सम्मान, कृतज्ञता और पारिवारिक निरंतरता की पुष्टि",
    whyThisRemedy:
      "यह किसी श्राप को हटाने के लिए नहीं, बल्कि यह स्वीकार करने के लिए है कि हमारा जीवन पूर्वजों के त्याग पर खड़ा है। श्रद्धा से दिया गया जल कुल की जड़ों को सींचता है।",
    practiceInstructions:
      "प्रत्येक अमावस्या अथवा पितृपक्ष में दक्षिण दिशा की ओर मुख करके तांबे या पीतल के पात्र में जल, काले तिल और कुश लेकर पूर्वजों के नाम से अर्पण करें। यदि संभव न हो तो किसी बुज़ुर्ग को भोजन कराएं।",
    frequency: "प्रत्येक दर्श अमावस्या और आश्विन पितृपक्ष",
    duration: "Monthly",
    priority: 1,
    sourceLevel: "L1_Classical",
    reflectionMilestones: {
      day1: "क्या मैंने पूर्वजों का स्मरण भय से मुक्त होकर केवल आदर और कृतज्ञता से किया?",
      day7: "क्या परिवार की जड़ों से जुड़ने का एक अदृश्य सुकून भीतर महसूस हुआ?",
      day21: "क्या परिवार में पुराने अनकहे तनाव में नरमी दिखाई दी?",
    },
    thirtyDayValidationQuestion: "क्या पूर्वजों के स्मरण के बाद आपके मन में परिवार के प्रति सुरक्षा और जुड़ाव का भाव बढ़ा?",
  });

  // ── 5. TRADITIONAL: SURYA ARGHYA (SUN IN 10TH) ───────────────────────────
  if (sunH === 10 || sunH === 9) {
    allRemedies.push({
      id: "rem_surya_arghya",
      title: "प्रातःकालीन सूर्य अर्घ्य व अनुशासन",
      category: "Traditional_Practice",
      needLevel: "Support",
      oneLinePurpose: "दैनिक जीवन में अनुशासन, स्पष्ट दृष्टि और आत्मविश्वास की प्रतिष्ठा",
      whyThisRemedy:
        "सूर्य 10वें भाव में दिग्बली होता है। सुबह सूर्य को तांबे के पात्र से अर्घ्य देना जीवन में नियमितता और सामाजिक पहचान को तेजस्वी बनाता है।",
      practiceInstructions:
        "सूर्योदय के 1 घंटे के भीतर तांबे के लोटे में शुद्ध जल और थोड़ा सा रोली या लाल पुष्प डालकर पूर्व दिशा की ओर जल अर्पित करें और गायत्री मंत्र का 3 बार स्मरण करें।",
      frequency: "प्रतिदिन सुबह सूर्योदय के समय",
      duration: "40_Days",
      priority: 2,
      sourceLevel: "L1_Classical",
      reflectionMilestones: {
        day1: "क्या मैंने सूर्योदय के समय जागकर प्रकृति की ऊर्जा को महसूस किया?",
        day7: "क्या कार्यस्थल पर निर्णय लेने की क्षमता में स्पष्टता आई?",
        day21: "क्या आलस्य और दिशाहीनता की भावना में स्थायी कमी आई?",
      },
      thirtyDayValidationQuestion: "क्या 40 दिन के सूर्य अर्घ्य से आपके आत्मविश्वास और काम करने के उत्साह में वृद्धि हुई?",
    });
  }

  // ── 6. SPIRITUAL: KULA DEVATA DIK-DEEPAK ─────────────────────────────────
  allRemedies.push({
    id: "rem_kula_deepak",
    title: "कुल देवता दीप प्रज्ज्वलन व मानसिक नमन",
    category: "Spiritual_Practice",
    needLevel: "Support",
    oneLinePurpose: "रक्त और वंश के पारंपरिक रक्षक चक्र (Spiritual Firewall) को जाग्रत करना",
    whyThisRemedy:
      `कुल देवता (${kulaDevata.suggestedDeity.traditionalMaleName}) की स्थिति वर्तमान में ${kulaDevata.connectionStatus} है। एक साधारण दीप से रक्त की सुरक्षा दीवार दोबारा मजबूत होती है।`,
    practiceInstructions:
      "घर के ईशान कोण (North-East) या पूजा स्थान में पूर्व दिशा की ओर मुख करके गाय के घी का एक दीपक जलाएं और मन में कहें: 'हे मेरे कुल के रक्षक, मैं आपको नमन करता हूँ और अपने परिवार की रक्षा हेतु आपकी कृपा मांगता हूँ।'",
    frequency: "सप्ताह में एक बार (सोमवार या शुक्रवार संध्या)",
    duration: "40_Days",
    priority: 2,
    sourceLevel: "L2_Tradition",
    reflectionMilestones: {
      day1: "क्या मैंने बिना किसी जटिल विधि के सहज भाव से कुल देवता का स्मरण किया?",
      day7: "क्या घर के वातावरण में अनजाने तनाव की जगह एक सहज शांति महसूस हुई?",
      day21: "क्या पारिवारिक कार्यों में अकारण आने वाली रुकावटें कम हुईं?",
    },
    thirtyDayValidationQuestion: "क्या घर के कुल देवता के स्मरण से आपको परिवार में एक अदृश्य सहारा और संरक्षण महसूस हुआ?",
  });

  // ── 7. SPIRITUAL: ISHTA DEVATA DHYANA (WINGS) ────────────────────────────
  allRemedies.push({
    id: "rem_ishta_dhyana",
    title: "इष्ट देवता एकांत ध्यान (Soul Alignment)",
    category: "Spiritual_Practice",
    needLevel: "Awareness",
    oneLinePurpose: "आंतरिक प्रज्ञा, विवेक और व्यक्तिगत मोक्ष व मानसिक संतुलन",
    whyThisRemedy:
      "जैमिनी आत्मकारक के अनुसार इष्ट देवता आत्मा को सांसारिक द्वंद्वों से ऊपर उठाकर आंतरिक विवेक और शांति प्रदान करते हैं।",
    practiceInstructions:
      "प्रतिदिन प्रातः या सायं 10 मिनट मौन बैठकर श्वास पर ध्यान दें और अपने इष्ट का मानसिक जप करें।",
    frequency: "प्रतिदिन 10 मिनट",
    duration: "21_Days",
    priority: 3,
    sourceLevel: "L1_Classical",
    reflectionMilestones: {
      day1: "क्या मैंने 10 मिनट बिना किसी मोबाइल या विचार के शांति में बिताए?",
      day7: "क्या मन की एकाग्रता और जटिल परिस्थितियों में धैर्य बढ़ा?",
      day21: "क्या जीवन के बड़े निर्णयों में सहज अंतर्दृष्टि (intuition) मिली?",
    },
    thirtyDayValidationQuestion: "क्या नियमित ध्यान से आपके मानसिक तनाव और असमंजस में राहत मिली?",
  });

  // ── 8. SPECIALIZED GATED CONTRAINDICATION: GEMSTONES ──────────────────────
  const ketuH = chart?.planets?.Ketu?.house;
  let isGemstoneEligible = false;
  let gemReason =
    `कुंडली में राहु ${rahuH ? `${rahuH}वें` : ""} भाव और केतु ${ketuH ? `${ketuH}वें` : ""} भाव में स्थित हैं। केवल नोडल प्लेसमेंट देखकर गोमेद (Hessonite) या लहसुनिया (Cat's Eye) पहनना हानिकारक हो सकता है। जब तक ग्रह का शुभ स्वाम्य और दशा पूर्ण रूप से अनुकूल न हो, कोई रत्न न पहनें। वर्तमान में व्यावहारिक और पारंपरिक अभ्यास 100% सुरक्षित और पर्याप्त हैं।`;

  // Filter based on User Preference
  let filteredRemedies = [...allRemedies];
  if (preference === "Practical") {
    filteredRemedies = allRemedies.filter((r) => r.category === "Behavioral_Life_Action");
  } else if (preference === "Traditional") {
    filteredRemedies = allRemedies.filter((r) => r.category === "Traditional_Practice");
  } else if (preference === "Spiritual") {
    filteredRemedies = allRemedies.filter((r) => r.category === "Spiritual_Practice");
  } else if (preference === "Minimal") {
    filteredRemedies = allRemedies.filter((r) => r.priority === 1).slice(0, 2);
  }

  // Top 3 Essential Practices (Prioritizing Hierarchy: Behavioral -> Traditional -> Spiritual)
  const topEssentialPractices = filteredRemedies.filter((r) => r.priority === 1).slice(0, 3);
  if (topEssentialPractices.length < 3) {
    const nextBest = filteredRemedies.filter((r) => r.priority === 2 && !topEssentialPractices.includes(r));
    topEssentialPractices.push(...nextBest.slice(0, 3 - topEssentialPractices.length));
  }

  const optionalPractices = filteredRemedies.filter((r) => !topEssentialPractices.includes(r));

  return {
    nativeName: name,
    userPreference: preference,
    topEssentialPractices,
    optionalPractices,
    gemstoneEligibility: {
      isEligible: isGemstoneEligible,
      reason: gemReason,
    },
    thirtyDayAuditGuide: {
      title: "30 दिनों के बाद आत्म-अवलोकन (Self-Observation, Not Superstition)",
      questions: [
        "क्या पिता या परिवार के साथ बातचीत में पहले से अधिक खुलापन आया?",
        "क्या पैसों और बचत को लेकर आपके मन में छाई पुरानी चिंता में कमी आई?",
        "क्या रात को सोने से पहले मन का भारीपन जर्नलिंग और प्राणायाम से हल्का हुआ?",
        "क्या आपके दैनिक कार्यों में रुकावट के समय घबराहट की जगह धैर्य रहा?",
      ],
    },
  };
}
