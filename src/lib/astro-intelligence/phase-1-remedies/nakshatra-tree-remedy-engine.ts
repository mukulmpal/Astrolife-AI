export type SourceStatus = "confirmed" | "traditional" | "verify" | "modern_overlay";
export type SafetyLevel = "safe" | "gentle" | "caution" | "high_caution";
export type Language = "hinglish" | "hindi" | "english";

export type NakshatraTreeRule = {
  nakshatra: string;
  rulingPlanet: string;
  deity?: string;
  tree: string;
  theme: string;
  symbolicMeaning: string;
  safeRemedy: string;
  avoidAdvice: string;
  sourceStatus: SourceStatus;
};

export const nakshatraTreeRules: NakshatraTreeRule[] = [
  {
    nakshatra: "Ashwini",
    rulingPlanet: "Ketu",
    deity: "Ashwini Kumaras",
    tree: "Kuchla / traditional Ashwini tree reference",
    theme: "Healing, speed, new beginning",
    symbolicMeaning:
      "Ashwini symbolically represents quick recovery, fresh starts and the ability to begin again after difficulty.",
    safeRemedy:
      "The safest remedy is ecological care: plant or protect a healthy tree, water plants regularly, avoid harming animals, and begin important healing habits with discipline.",
    avoidAdvice:
      "Do not use any plant medicinally without professional medical advice.",
    sourceStatus: "traditional",
  },
  {
    nakshatra: "Bharani",
    rulingPlanet: "Venus",
    deity: "Yama",
    tree: "Amla / traditional Bharani tree reference",
    theme: "Discipline, transformation, responsibility",
    symbolicMeaning:
      "Bharani reflects responsibility, emotional intensity and the need to handle desire with maturity.",
    safeRemedy:
      "Practice respectful conduct, care for women and elders, avoid impulsive pleasure-seeking, and nurture fruit-bearing plants as a symbolic act of responsibility.",
    avoidAdvice:
      "Avoid intense or fear-based remedies. Use gentle lifestyle correction first.",
    sourceStatus: "traditional",
  },
  {
    nakshatra: "Krittika",
    rulingPlanet: "Sun",
    deity: "Agni",
    tree: "Fig / traditional Krittika tree reference",
    theme: "Purification, courage, clarity",
    symbolicMeaning:
      "Krittika represents cutting through confusion and purifying life through truth and discipline.",
    safeRemedy:
      "Keep the kitchen and fire area clean, respect father/elders, speak clearly, and support tree protection as a symbolic purification practice.",
    avoidAdvice:
      "Do not perform harsh fire rituals or fear-based practices.",
    sourceStatus: "traditional",
  },
  {
    nakshatra: "Rohini",
    rulingPlanet: "Moon",
    deity: "Brahma",
    tree: "Jamun / traditional Rohini tree reference",
    theme: "Growth, beauty, nourishment",
    symbolicMeaning:
      "Rohini reflects fertility of ideas, comfort, beauty and emotional nourishment.",
    safeRemedy:
      "Care for plants, keep the home peaceful, respect mother-like figures, and create beauty through cleanliness and kindness.",
    avoidAdvice:
      "Do not make medical or fertility claims from this placement.",
    sourceStatus: "traditional",
  },
  {
    nakshatra: "Mrigashira",
    rulingPlanet: "Mars",
    deity: "Soma",
    tree: "Khair / traditional Mrigashira tree reference",
    theme: "Search, curiosity, movement",
    symbolicMeaning:
      "Mrigashira shows a searching mind, curiosity and the need to move gently rather than anxiously.",
    safeRemedy:
      "Walk in nature, water plants, reduce restlessness through journaling, and avoid impulsive decisions.",
    avoidAdvice:
      "Avoid using plant remedies as treatment.",
    sourceStatus: "traditional",
  },
  {
    nakshatra: "Punarvasu",
    rulingPlanet: "Jupiter",
    deity: "Aditi",
    tree: "Bamboo",
    theme: "Renewal, return, protection",
    symbolicMeaning:
      "Punarvasu represents rebuilding, returning to balance, family protection and gentle wisdom.",
    safeRemedy:
      "Bamboo or plant care can be used symbolically for renewal. Keep the home clean, donate food when suitable, and restart good habits patiently.",
    avoidAdvice:
      "Avoid over-promising results from remedies.",
    sourceStatus: "traditional",
  },
  {
    nakshatra: "Pushya",
    rulingPlanet: "Saturn",
    deity: "Brihaspati",
    tree: "Peepal / Sacred Fig",
    theme: "Nourishment, guidance, protection",
    symbolicMeaning:
      "Pushya is traditionally connected with nourishment, guidance, learning and protective support.",
    safeRemedy:
      "Respect and protect Peepal or sacred trees without superstition. Offer water respectfully where culturally appropriate, serve teachers/elders, and practice disciplined kindness.",
    avoidAdvice:
      "Do not use leaves/bark/fruit medicinally without medical supervision.",
    sourceStatus: "traditional",
  },
];

export function getNakshatraTreeRule(nakshatra: string) {
  return nakshatraTreeRules.find(
    (rule) => rule.nakshatra.toLowerCase() === nakshatra.toLowerCase()
  );
}

export function generateNakshatraTreeNarrative(
  nakshatra: string,
  language: Language = "hinglish"
) {
  const rule = getNakshatraTreeRule(nakshatra);

  if (!rule) {
    return {
      found: false,
      narrative:
        language === "hindi"
          ? "इस नक्षत्र के लिए tree remedy data अभी उपलब्ध नहीं है।"
          : language === "english"
            ? "Tree remedy data for this nakshatra is not available yet."
            : "Is nakshatra ke liye tree remedy data abhi available nahi hai.",
    };
  }

  const narrative =
    language === "hindi"
      ? `${rule.nakshatra} नक्षत्र का संबंध परंपरागत रूप से ${rule.tree} से माना जाता है। इसका मुख्य भाव ${rule.theme} है। यह उपाय किसी चमत्कार या चिकित्सा का दावा नहीं करता, बल्कि प्रकृति से जुड़ने, अनुशासन, सेवा और शांत मन को बढ़ाने का एक प्रतीकात्मक अभ्यास है। ${rule.safeRemedy} ${rule.avoidAdvice}`
      : language === "english"
        ? `${rule.nakshatra} is traditionally associated with ${rule.tree}. Its symbolic theme is ${rule.theme}. This is not a medical or guaranteed remedy; it is a gentle ecological and reflective practice. ${rule.safeRemedy} ${rule.avoidAdvice}`
        : `${rule.nakshatra} nakshatra ka traditional sambandh ${rule.tree} se maana jata hai. Iska core theme hai ${rule.theme}. Ye koi medical ya guaranteed remedy nahi hai; ye nature care, discipline aur inner balance ka symbolic practice hai. ${rule.safeRemedy} ${rule.avoidAdvice}`;

  return {
    found: true,
    rule,
    narrative,
  };
}
