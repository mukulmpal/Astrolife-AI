// src/lib/astro-engine/lineage-karma/antahkarana-mapper.ts
// ============================================================================
// VEDIC ANTAHKARANA & COMPUTATIONAL CONSCIOUSNESS ENGINE
// Grounded in Sri P.V.R. Narasimha Rao's "Vedic Wisdom" (pp. 118-122, 211-216)
//
// 1. Antahkarana Computer Architecture:
//    - CPU (Ahamkara / I-ness): Atmakaraka (AK) + Tripod (Lagna, Moon, Sun)
//    - Memory/Cache (Chitta / Conditioning): D60/D45/D40 (Causal) & D27/D30 (Subtle)
//    - ALU / Logic Unit (Buddhi / Intellect): Amatyakaraka (AmK) + Jupiter (Brihaspati)
//    - I/O Controller (Manas / Sensory Mind): Moon + Mercury interfacing with 5 Jnanendriyas & 5 Karmendriyas
//    - Power Supply (Prana): 5 vital airs sustaining consciousness
//
// 2. PVR Tarpana & Ancestral Karma Release Architecture:
//    - Homam burns personal past-life actions (Bhootaagni)
//    - Tarpana washes away inherited ancestral debts (Rina / Predispositions)
//    - Internal Genetics: Ancestors reside inside us as karmic conditioning
//    - Jivat-Pitruk: Sons/Grandsons are fully authorized to do Tarpana even if father lives
// ============================================================================

import type { ChartData } from "../calculations";
import type { AntahkaranaProfile, PvrTarpanaProfile } from "./types";

function uniqueCarriers(carriers: string[]): string[] {
  const seen = new Set<string>();
  return carriers.filter((c) => {
    if (seen.has(c)) return false;
    seen.add(c);
    return true;
  });
}

export function calculateAntahkarana(chart: ChartData): {
  antahkarana: AntahkaranaProfile;
  pvrTarpana: PvrTarpanaProfile;
} {
  const planets = chart.planets || {};

  // 1. Calculate Jaimini Karakas (AK, AmK) by Longitude
  const sevenPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"]
    .map((name) => {
      const p = planets[name];
      const longitude = (p as any)?.lon ?? (p as any)?.longitude ?? 0;
      const degInSign = longitude % 30;
      return { name, degInSign, p };
    })
    .sort((a, b) => b.degInSign - a.degInSign);

  const atmakaraka = sevenPlanets[0]?.name || "Sun";
  const amatyakaraka = sevenPlanets[1]?.name || "Jupiter";

  const lagnaSign = chart.lagnaRashi || (chart as any).ascendant?.sign || "Aries";
  const moonSign = planets.Moon?.sign || "Moon";
  const moonHouse = planets.Moon?.house || 1;
  const sunSign = planets.Sun?.sign || "Sun";
  const sunHouse = planets.Sun?.house || 1;
  const jupHouse = planets.Jupiter?.house || 1;
  const mercHouse = planets.Mercury?.house || 1;

  // ── ANTAHKARANA PROFILE ───────────────────────────────────────────────────
  const antahkarana: AntahkaranaProfile = {
    ahamkara: {
      cpuSignificator: `Atmakaraka (${atmakaraka})`,
      tripod: {
        sthoolaLagna: `स्थूल शरीर (Gross Body): लग्न ${lagnaSign}`,
        sookshmaMoon: `सूक्ष्म शरीर (Subtle Mind): चंद्र ${moonSign} (भाव ${moonHouse})`,
        kaaranaSun: `कारण शरीर (Causal Soul): सूर्य ${sunSign} (भाव ${sunHouse})`,
      },
      currentState:
        "अहंकार (I-ness) तीनों शरीरों में कार्य कर रहा है। आत्मकारक आत्मा के मुख्य पाठ को चलाता है।",
      egoDissolutionMethod:
        "सर्वं श्रीकृष्णार्पणमस्तु भाव — कर्म करते समय लक्ष्य तय करें, पर कर्म समाप्त होते ही फल और कर्तापन ईश्वर को समर्पित कर दें।",
    },
    chitta: {
      memoryReservoir:
        "चित्त (स्मृति भण्डार) में जन्म-जन्मांतरों के संस्कार, अनसुलझे ऋण और अवचेतन भावनाएँ संचित हैं।",
      subconsciousRootVargas: ["D60 (शष्ट्यंश - कारण कर्म)", "D45/D40", "D30 (अरिष्ट/क्लेश)", "D27 (नक्षत्रबल)"],
      predispositionLoad:
        "D60 और 12वें भाव में बैठे ग्रहों के अनुसार अवचेतन में पुरानी पारिवारिक जिम्मेदारियों और आत्म-विकास की गहरी छाप है।",
    },
    buddhi: {
      aluController: `अमात्यकारक (${amatyakaraka}) + गुरु (भाव ${jupHouse})`,
      transmitter: `बुध (भाव ${mercHouse})`,
      discriminationQuality:
        "गुरु और बुध का संबंध विवेक (Buddhi) को तार्किक, शोधपरक और स्वतंत्र निर्णय लेने की अचूक शक्ति देता है।",
    },
    manas: {
      ioController: `चंद्रमा (भाव ${moonHouse}) + बुध (भाव ${mercHouse})`,
      sensoryChannelsStatus:
        "मन 5 ज्ञानेंद्रियों (Input) और 5 कर्मेंद्रियों (Output) का द्वार है। 12वें भाव के प्रभाव से बाहरी इनपुट की जगह भीतरी चिंतन अधिक प्रबल रहता है।",
    },
    prana: {
      vitalityFlow:
        "पंचप्राण (प्राण, अपान, व्यान, उदान, समान) सूक्ष्म शरीर की भूताग्नि को ईंधन प्रदान करते हैं।",
    },
    components: [
      {
        layer: "Ahamkara_CPU",
        vedicConcept: "अहंकार (Sense of 'I')",
        computerAnalogy: "Central Processing Unit (CPU)",
        planetaryCarriers: uniqueCarriers([atmakaraka, "Sun", "Lagna"]),
        vargaLevel: "D1, D9 (Navamsha)",
        functionalRole: "समस्त क्रियाओं और अनुभवों का समन्वय और 'मैं' का आभास कराना।",
        sadhanaPurificationNote: "अहंकार को पूरी तरह समाप्त करने के बजाय ईश्वर के सेवक के रूप में पुनःपरिभाषित करना।",
      },
      {
        layer: "Chitta_Memory",
        vedicConcept: "चित्त (Conditioned Consciousness)",
        computerAnalogy: "Memory (RAM, Cache & Permanent Storage)",
        planetaryCarriers: ["Moon", "Ketu", "Saturn"],
        vargaLevel: "D60 (Shashtiamsha), D45, D30",
        functionalRole: "पूर्व जन्मों के संस्कार, वासनाएँ और कर्मिक ऋण सुरक्षित रखना।",
        sadhanaPurificationNote: "तर्पण और ध्यान के माध्यम से अवचेतन में संचित पूर्वज संस्कारों को धोना।",
      },
      {
        layer: "Buddhi_ALU",
        vedicConcept: "बुद्धि (Discriminative Intellect)",
        computerAnalogy: "Arithmetic & Logic Unit (ALU)",
        planetaryCarriers: uniqueCarriers([amatyakaraka, "Jupiter"]),
        vargaLevel: "D1, D24 (Siddhamsha)",
        functionalRole: "चित्त से प्राप्त जानकारी का विश्लेषण कर उचित निर्णय लेना।",
        sadhanaPurificationNote: "सात्विक चिंतन और ज्ञान योग के द्वारा विवेक को शुद्ध रखना।",
      },
      {
        layer: "Manas_IO",
        vedicConcept: "मनस (Sensory-Motor Mind)",
        computerAnalogy: "I/O Controller & Interface",
        planetaryCarriers: ["Moon", "Mercury"],
        vargaLevel: "D1, D16 (Shodashamsha)",
        functionalRole: "बाहरी जगत से संवेदनाएँ ग्रहण करना और कर्मेंद्रियों को निर्देश देना।",
        sadhanaPurificationNote: "मंत्र जप और प्राणायाम द्वारा मन को एक बिंदु पर स्थिर करना।",
      },
      {
        layer: "Prana_Power",
        vedicConcept: "पंचप्राण (Life Force)",
        computerAnalogy: "Power Supply & Circuitry",
        planetaryCarriers: ["Sun", "Mars", "Pranapada"],
        vargaLevel: "D1, D3 (Drekkana)",
        functionalRole: "शरीर और सूक्ष्म नाड़ियों में चेतना का निरंतर प्रवाह बनाए रखना।",
        sadhanaPurificationNote: "सरल प्राणायाम और नियमित अग्नि-होत्र द्वारा भूताग्नि को प्रज्वलित रखना।",
      },
    ],
  };

  // ── PVR TARPANA & ANCESTRAL DEBT RELEASE PROFILE ──────────────────────────
  const pvrTarpana: PvrTarpanaProfile = {
    tarpanaVsHomamDistinction: {
      homamRole:
        "हवन (अग्नि-कार्य) व्यक्ति के अपने पिछले जन्मों के किए हुए कर्मों (Personal Karma) को भूताग्नि में जलाकर नष्ट करता है।",
      tarpanaRole:
        "तर्पण (जल-कार्य) पूर्वजों और अन्य आत्माओं से मिले कर्मिक ऋण (Ancestral Rina & Inherited Predispositions) को धोकर शांत करता है।",
      synthesis:
        "हमारे मन की वर्तमान कमज़ोरियाँ हमारे अपने कर्मों और पूर्वजों से मिले ऋण का संयुक्त परिणाम हैं। इसलिए तर्पण और अग्नि-साधना दोनों का संतुलन सर्वोत्तम है।",
    },
    internalGeneticsPrinciple:
      "आधुनिक विज्ञान के अनुसार पूर्वज हमारे जीन्स (DNA) में जीवित हैं; वैदिक विज्ञान के अनुसार प्रत्येक पूर्वज हमारे भीतर एक अवचेतन कर्मिक संस्कार (Karmic Predisposition) के रूप में उपस्थित है। बाहर दिया गया तर्पण वास्तव में भीतर की उसी अतृप्त पूर्वज-ऊर्जा को संतुष्ट कर मुक्त करता है।",
    jivatPitrukPermissibility: {
      isAllowedWithLivingFather: true,
      rationale:
        "श्री पी.वी.आर. नरसिम्हा राव के अनुसार, यदि दादा या पूर्वजों की कोई अतृप्त वासना थी, तो संभव है कि उसका कर्मिक प्रभाव पिता से अधिक पोते/संतान पर पड़ रहा हो। जैसे पिता के आर्थिक रूप से असमर्थ होने पर बेटा काम करता है, वैसे ही कुल के कल्याण हेतु जीवित पिता रहते हुए भी संतान श्रद्धापूर्वक तर्पण कर सकती है।",
    },
    mantraPotencyPrinciple: {
      swahaVsSwadha:
        "स्वाहा (Swaha) देवताओं के लिए समर्पण का शब्द है, जबकि स्वधा (Swadha - धातु 'स्वाद' से) पितरों की अतृप्त वासनाओं और इच्छाओं को तृप्त करने का दिव्य मंत्र है।",
      focusOverCount:
        "मंत्र की संख्या (Count) से अधिक महत्वपूर्ण है मन की शांति, एकाग्रता और समर्पण। जल्दबाजी में की गई 11 मालाओं से शांत मन से की गई 1 माला हजार गुना अधिक फलदायी है।",
    },
    recommendedTarpanaFrequency:
      "प्रत्येक मास की दर्श अमावस्या अथवा आश्विन मास के पितृपक्ष में तिल-मिश्रित जल से सरल कृतज्ञता तर्पण।",
  };

  return { antahkarana, pvrTarpana };
}
