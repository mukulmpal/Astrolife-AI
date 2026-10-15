// src/lib/astro-engine/career-specifier.ts
// ============================================================
// ASTROLIFE D10 CAREER SPECIFIER & DISPLACEMENT ENGINE
// Generalizes:
// 1. D10 Sub-Domain Decoding (Beyond generic "Business" -> "Loan to Traders / Margin Broker")
// 2. D10 4th Lord Dasha Displacement Rule (Loss of fixed office comfort / forced mobility)
// 3. Mercury-Ketu Deep-Tech Matrix (Radar, Sonar, Cryptography, HFT Algorithms)
// 4. Mars Nakshatras Rising (Chitra, Dhanishta, Mrigashira) in Disruptive Leaders
// 5. Ketu in D10 Lagna Autonomous Sovereign Archetype
// ============================================================

export interface CareerSpecifierProfile {
  primaryTitleHinglish: string;
  subDomainNicheHinglish: string;
  d10CircuitLogicHinglish: string;
  officeMobilityStatusHinglish: string;
  deepTechSignature?: string;
  leadershipArchetypeHinglish?: string;
}

export interface CareerSpecifierInput {
  d10LagnaLordHouse?: number;
  d10SixthLordInLagna?: boolean;
  d10TenthLordWithRahu?: boolean;
  d10FourthLordDashaActive?: boolean;
  d10LagnaHasKetu?: boolean;
  mercuryKetuConjunction?: boolean;
  risingNakshatra?: string; // e.g. "Chitra", "Dhanishta", "Mrigashira", "Swati"
  moonNakshatra?: string;   // e.g. "Ashlesha"
}

export function evaluateCareerSpecifier(input: CareerSpecifierInput): CareerSpecifierProfile {
  const {
    d10SixthLordInLagna,
    d10TenthLordWithRahu,
    d10FourthLordDashaActive,
    d10LagnaHasKetu,
    mercuryKetuConjunction,
    risingNakshatra,
    moonNakshatra
  } = input;

  let title = "उद्यमी एवं व्यावसायिक नेतृत्व (Commercial & Enterprise Leadership)";
  let niche = "सामान्य व्यवसाय एवं प्रबंधन।";
  let circuit = "दशमांश चक्र मानक स्थिति में है।";

  // D10 Loan to Traders / Margin Broker
  if (d10SixthLordInLagna && d10TenthLordWithRahu) {
    title = "ट्रेडर्स को ऋण एवं मार्जिन लेंडिंग (Loan to Traders & Margin Financing)";
    niche = "डे-ट्रेडर्स को लीवरेज/ऋण देना, स्टॉक सब-ब्रोकरेज, विवादित वित्तीय परिसंपत्ति प्रबंधन या उच्च-जोखिम क्रेडिट एडवाइजरी।";
    circuit = "D10 में षष्ठेश (ऋण/विवाद/जोखिम) का लग्न से संबंध + दशमेश का राहु (भीड़/सट्टा/उत्तोलन) से युति जातक को सट्टेबाजों का साहूकार बनाती है।";
  } else if (d10LagnaHasKetu) {
    title = "स्वतंत्र संप्रभु बॉस (Autonomous Sovereign Founder)";
    niche = "बिना किसी बोर्ड या बॉस के दबाव के अपनी शर्तों पर स्वायत्त कंपनी या विशेष सलाहकारी चलाना।";
    circuit = "D10 लग्न में केतु व्यक्ति को किसी के अधीन काम करने नहीं देता। यह शीर्ष स्वायत्तता का प्रतीक है।";
  }

  // D10 4th Lord Dasha Displacement Rule
  let officeMobility = "स्थिर कार्यस्थल: जातक अपने मुख्य कार्यालय या गृह-स्थान से सुचारू रूप से कार्य कर सकता है।";
  if (d10FourthLordDashaActive) {
    officeMobility = "कार्यस्थल विस्थापन (Workplace Displacement): D10 में चतुर्थेश की दशा चलने के कारण जातक को अपने घर या निश्चित केबिन का आराम नहीं मिलेगा। बार-बार यात्राएं, शहर बदलना, प्रोजेक्ट-साइट पर प्रवास या वर्क-फ्रॉम-होम समाप्त होना निश्चित है।";
  }

  // Deep-Tech Mercury-Ketu
  let deepTech = undefined;
  if (mercuryKetuConjunction) {
    deepTech = "डीप-टेक व क्रिप्टोग्राफिक हस्ताक्षर: बुध-केतु की युति जातक को रडार, सोनार, सैटेलाइट टेलीमेट्री, डेटा एन्क्रिप्शन, हाई-फ्रीक्वेंसी ट्रेडिंग (HFT) एल्गोरिदम या गूढ़ एआई मॉडल्स के विकास में विश्वस्तरीय सफलता देती है।";
  }

  // Leadership Archetypes from Rising Nakshatra
  let leadership = undefined;
  if (risingNakshatra === "Chitra" || risingNakshatra === "Dhanishta" || risingNakshatra === "Mrigashira") {
    leadership = `मंगल नक्षत्र लग्न (${risingNakshatra}): 'Mad Men' डिसरप्टर आर्केटाइप। समाज की स्थापित परंपराओं, आलोचना या परिणामों की परवाह किए बिना अपने लक्ष्य के लिए पूरी व्यवस्था को रीसेट करने की निर्भीक, आक्रामक प्रवृत्ति।`;
  } else if (risingNakshatra === "Swati" && moonNakshatra === "Ashlesha") {
    leadership = "स्वाति लग्न + आश्लेषा चंद्रमा: कूटनीतिक सर्पिलाकार तपस्वी (Gandhi Archetype)। बाहर से अहिंसक व सादा, किंतु भीतर से विरोधियों को अपनी नैतिक व रणनीतिक पकड़ से लाचार कर देने वाला महा-रणनीतिकार।";
  }

  return {
    primaryTitleHinglish: title,
    subDomainNicheHinglish: niche,
    d10CircuitLogicHinglish: circuit,
    officeMobilityStatusHinglish: officeMobility,
    deepTechSignature: deepTech,
    leadershipArchetypeHinglish: leadership
  };
}

