// src/lib/astro-engine/transit-health-timing.ts
// ============================================================
// ASTROLIFE MOON DISPOSITOR TRANSIT HEALTH & EXACT DEGREE TIMING ENGINE
// Generalizes:
// 1. Natal Moon's Dispositor Transit Vulnerability & Exact Degree Recovery
//    (When Dispositor crosses 2.0° to 3.0° into a supportive sign -> recovery happens)
// 2. Virgo Footwear Clutter Detection (10-year-old shoes blocking Mercury)
// 3. Scapolite Stone for 3rd House / Mercury Nervous Burnout
// 4. Vocal Tract & Thyroid Endocrine Health with Strict Medical Guardrails
// ============================================================

export interface MoonDispositorTransitHealthAudit {
  natalMoonSign: string;
  dispositorPlanet: string;
  isDispositorVulnerableInTransit: boolean;
  vulnerabilityReasonHinglish?: string;
  exactDegreeRecoveryWindowHinglish: string;
  environmentalClutterRemedyHinglish?: string;
  nerveBurnoutTalismanHinglish?: string;
  vocalThyroidGuardrail?: {
    conditionAlertHinglish: string;
    holisticSupportHinglish: string;
    mandatoryClinicalDisclaimerHinglish: string;
  };
}

const SIGN_RULERS_MAP: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter"
};

const PLANET_EXALTATION_MAP: Record<string, string> = {
  Sun: "Aries",
  Moon: "Taurus",
  Mars: "Capricorn",
  Mercury: "Virgo",
  Jupiter: "Cancer",
  Venus: "Pisces",
  Saturn: "Libra"
};

const PLANET_OWN_SIGNS_MAP: Record<string, string[]> = {
  Sun: ["Leo"],
  Moon: ["Cancer"],
  Mars: ["Aries", "Scorpio"],
  Mercury: ["Gemini", "Virgo"],
  Jupiter: ["Sagittarius", "Pisces"],
  Venus: ["Taurus", "Libra"],
  Saturn: ["Capricorn", "Aquarius"]
};

/**
 * Calculates health vulnerability timing based on the transit of the Natal Moon's Dispositor,
 * and pinpoints the exact 2°-3° degree threshold where treatment/recovery manifests.
 */
export function evaluateMoonDispositorHealthTiming(
  natalMoonSign: string,
  currentTransitDispositorSign?: string,
  currentTransitDispositorDegree?: number,
  isDispositorCombust?: boolean,
  isVirgoAfflicted?: boolean,
  isThirdHouseMercuryAfflicted?: boolean,
  hasThyroidVocalAffliction?: boolean
): MoonDispositorTransitHealthAudit {
  const dispositor = SIGN_RULERS_MAP[natalMoonSign] || "Moon";
  const ownSigns = PLANET_OWN_SIGNS_MAP[dispositor] || [];
  const exaltationSign = PLANET_EXALTATION_MAP[dispositor];

  const inSafeSign =
    currentTransitDispositorSign &&
    (ownSigns.includes(currentTransitDispositorSign) || currentTransitDispositorSign === exaltationSign);

  const isDegPastThreshold = (currentTransitDispositorDegree ?? 0) >= 2.0;

  // Determine vulnerability
  let isVulnerable = Boolean(isDispositorCombust);
  let vulnReason = "";

  if (isDispositorCombust) {
    isVulnerable = true;
    vulnReason = `चंद्रमा का स्वामी ग्रह (${dispositor}) गोचर में सूर्य से अस्त है, जिससे प्राण ऊर्जा और प्रतिरोधक क्षमता में अचानक गिरावट आती है।`;
  }

  // Exact degree recovery formulation
  const recoveryWindow = `नियम: जब ${dispositor} गोचर में अपने मित्र या स्वराशि (${ownSigns.join("/")}) में प्रवेश कर 'सटीक 2.0° से 3.0° की दहलीज' पार करता है, ठीक उसी दिन और डिग्री पर सही दवा, सही चिकित्सक और रोग मुक्ति की दिशा प्राप्त होती है।`;

  // Virgo old shoes clutter
  let clutterRemedy = undefined;
  if (isVirgoAfflicted) {
    clutterRemedy =
      "कन्या राशि व बुध शुद्धि उपाय: कालपुरुष के 6ठे भाव (कन्या) में शनि/राहु की छाया होने पर घर के शू-रैक में 5 से 10 वर्ष पुराने, घिसे-पिटे या फटे हुए जूते-चप्पल जमा रहते हैं। इन्हें तुरंत घर से बाहर निकालें या दान करें; ऐसा करते ही नर्वस सिस्टम और व्यापार में फंसा पैसा तुरंत सक्रिय होता है।";
  }

  // 3rd house / Mercury burnout
  let nerveTalisman = undefined;
  if (isThirdHouseMercuryAfflicted) {
    nerveTalisman =
      "तृतीय भाव व बुध तंत्रिका-थकान (Nervous Burnout): अत्यधिक मानसिक श्रम, मल्टीटास्किंग और स्क्रीन टाइम से नसों की थकावट दूर करने के लिए 'स्कैपोलाइट (Scapolite)' क्रिस्टल अथवा ब्रास का कड़ा धारण करें, जो नसों में ऊर्जा के प्रवाह को संतुलित करता है।";
  }

  // Vocal / Thyroid guardrail
  let vocalGuardrail = undefined;
  if (hasThyroidVocalAffliction) {
    vocalGuardrail = {
      conditionAlertHinglish:
        "विशुद्ध चक्र एवं थायरॉइड संवेदनशीलता: द्वितीय/तृतीय भाव अथवा बुध-शनि का संबंध स्वर-तंतुओं, गले और थायरॉइड ग्रंथि पर ऊर्जात्मक खिंचाव दर्शाता है।",
      holisticSupportHinglish:
        "ऊर्जात्मक संतुलन: शनिवार को भोजन में नमक न लें या नियंत्रित रखें; गायन, शंख ध्वनि और 'ॐ' कार का 15 मिनट जप करें।",
      mandatoryClinicalDisclaimerHinglish:
        "⚠️ अनिवार्य चिकित्सकीय चेतावनी: ज्योतिषीय उपाय केवल ऊर्जात्मक संतुलन हेतु हैं। थायरॉइड या गले की किसी भी समस्या के लिए योग्य एंडोक्रिनोलॉजिस्ट/ईएनटी डॉक्टर से रक्त जांच (TSH, Free T3, Free T4) अवश्य कराएं। किसी भी उपाय के लिए डॉक्टर द्वारा निर्धारित थायरॉक्सिन (Thyroxine) की दवा कभी भी बंद या कम न करें।"
    };
  }

  return {
    natalMoonSign,
    dispositorPlanet: dispositor,
    isDispositorVulnerableInTransit: isVulnerable,
    vulnerabilityReasonHinglish: vulnReason || undefined,
    exactDegreeRecoveryWindowHinglish: recoveryWindow,
    environmentalClutterRemedyHinglish: clutterRemedy,
    nerveBurnoutTalismanHinglish: nerveTalisman,
    vocalThyroidGuardrail: vocalGuardrail
  };
}

