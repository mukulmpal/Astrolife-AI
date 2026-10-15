// src/lib/astro-engine/trading-risk-guardrail.ts
// ============================================================
// ASTROLIFE TRADING RISK & REVENGE TRADING ADDICTION ENGINE
// Detects Speculative Ruin Vectors in F&O / Derivatives
// Implements an Immediate Astrological Circuit Breaker
// Diverts Native from 5th/8th Gambling into 6th/10th Grounded Career
// ============================================================

export interface TradingRiskProfile {
  speculativeRuinRisk: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  isRevengeTradingActive: boolean;
  circuitBreakerAction: "IMMEDIATE_HALT_EMPLOYMENT_PIVOT" | "STRICT_HEDGED_INVESTING_ONLY" | "PROCEED_WITH_DISCIPLINE";
  psychologicalDiagnosisHinglish: string;
  astrologicalCircuitHinglish: string;
  mandatoryFinancialGuardrailHinglish: string;
  careerPivotDirectiveHinglish: string;
}

export interface TradingRiskInput {
  fifthLordAfflicted: boolean;
  rahuInFifthEighthOrTwelfth: boolean;
  moonAfflictedBySaturnMarsRahu: boolean;
  activeDashaEighthOrTwelfth: boolean;
  hasSubstantialLossesOrDebt: boolean;
  hasVirgoVenusOrScorpioMoon?: boolean;
}

/**
 * Evaluates whether a native is trapped in the Options / Revenge Trading spiral,
 * and enforces strict ethical circuit breakers.
 */
export function evaluateTradingRisk(input: TradingRiskInput): TradingRiskProfile {
  const {
    fifthLordAfflicted,
    rahuInFifthEighthOrTwelfth,
    moonAfflictedBySaturnMarsRahu,
    activeDashaEighthOrTwelfth,
    hasSubstantialLossesOrDebt,
    hasVirgoVenusOrScorpioMoon
  } = input;

  // Calculate score
  let riskScore = 0;
  if (fifthLordAfflicted) riskScore += 2;
  if (rahuInFifthEighthOrTwelfth) riskScore += 3;
  if (moonAfflictedBySaturnMarsRahu) riskScore += 2;
  if (activeDashaEighthOrTwelfth) riskScore += 2;
  if (hasSubstantialLossesOrDebt) riskScore += 3;

  const isCritical = riskScore >= 7;
  const isHigh = riskScore >= 4 && riskScore < 7;
  const isRevenge = (hasSubstantialLossesOrDebt || activeDashaEighthOrTwelfth) && rahuInFifthEighthOrTwelfth && moonAfflictedBySaturnMarsRahu;

  if (isCritical || isRevenge) {
    return {
      speculativeRuinRisk: "CRITICAL",
      isRevengeTradingActive: true,
      circuitBreakerAction: "IMMEDIATE_HALT_EMPLOYMENT_PIVOT",
      psychologicalDiagnosisHinglish:
        "रिवेंज ट्रेडिंग का आत्मघाती चक्र (The Revenge Trading Trap): पुराने नुकसान को जल्दी वसूलने के लिए उधार लेकर या विरासत का पैसा ऑप्शंस (F&O) में लगाना वित्तीय आत्महत्या का निश्चित मार्ग है। पीड़ित चंद्रमा घाटे के बाद घबराहट और राहु झूठी उम्मीद (Illusion of Grandeur) देता है।",
      astrologicalCircuitHinglish:
        "पंचम भाव (सट्टा) + राहु का भ्रम + पीड़ित चंद्रमा + अष्टम/द्वादश भाव की दशा = पूंजी का संपूर्ण वाष्पीकरण।",
      mandatoryFinancialGuardrailHinglish:
        "🛑 सख्त चेतावनी: किसी भी ज्योतिषी, रत्न या अनुष्ठान के बहकावे में आकर यह न सोचें कि 'उपाय करने से ऑप्शंस में खोया पैसा वापस आ जाएगा'। ट्रेडिंग तुरंत पूर्ण रूप से बंद करें। डीमैट अकाउंट फ्रीज करें।",
      careerPivotDirectiveHinglish:
        "पुनर्निर्माण प्रोटोकॉल: अपनी ऊर्जा को षष्ठम भाव (6th House - स्थिर वेतनभोगी नौकरी, नियमित सेवा) और दशम भाव (संस्थागत कार्य) में लगाएं। अनुशासित वेतन और स्थिर बचत ही इस ऋण और मानसिक संकट से बाहर निकलने का एकमात्र शास्त्र-सम्मत मार्ग है।"
    };
  }

  if (isHigh) {
    return {
      speculativeRuinRisk: "HIGH",
      isRevengeTradingActive: false,
      circuitBreakerAction: "STRICT_HEDGED_INVESTING_ONLY",
      psychologicalDiagnosisHinglish:
        "अत्यधिक लेवरेज का जोखिम: बाजार में क्विक-मनी का लालच भारी नुकसान करा सकता है। इंट्राडे और नेकेड ऑप्शंस से दूर रहें।",
      astrologicalCircuitHinglish:
        "पंचम-राहु का दबाव। यदि कन्या का शुक्र है तो केवल डेटा और एल्गोरिदम से ही लाभ होगा, भावना से नहीं।",
      mandatoryFinancialGuardrailHinglish:
        "केवल हेज्ड (Hedged) और लॉन्ग-टर्म म्यूचुअल फंड्स या ईटीएफ में निवेश करें। कैपिटल का 5% से अधिक कभी भी किसी एक ट्रेड में न लगाएं।",
      careerPivotDirectiveHinglish:
        "मुख्य आय का स्रोत नौकरी या कोर बिजनेस को बनाएं; ट्रेडिंग को कभी भी प्राथमिक करियर न समझें।"
    };
  }

  return {
    speculativeRuinRisk: "LOW",
    isRevengeTradingActive: false,
    circuitBreakerAction: "PROCEED_WITH_DISCIPLINE",
    psychologicalDiagnosisHinglish: "संतुलित वित्तीय दृष्टिकोण। जातक जोखिम प्रबंधन और अनुशासन के साथ काम करने में सक्षम है।",
    astrologicalCircuitHinglish: "पंचम और नवम भाव स्थिर हैं।",
    mandatoryFinancialGuardrailHinglish: "सामान्य वित्तीय अनुशासन बनाए रखें।",
    careerPivotDirectiveHinglish: "दीर्घकालिक परिसंपत्ति निर्माण (Long-term Wealth Compounding) पर ध्यान दें।"
  };
}

