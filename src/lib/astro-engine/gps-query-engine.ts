// src/lib/astro-engine/gps-query-engine.ts
/**
 * AstroLife 6 Core Life Query Reverse-Counting GPS Engine
 * 
 * Provides Shastric reverse navigation for 6 fundamental human queries:
 * 1. Career & Profession Stagnation (10th House)
 * 2. Peeda & Chronic Afflictions (8th House)
 * 3. Dhana & Liquid Cash Blockage (2nd House)
 * 4. Roga & Physical Disease Diagnosis (6th House - e.g. NW heat causing Cervical)
 * 5. Sukh & Domestic Peace (4th House)
 * 6. Uncontrolled Expenses & Financial Drainage (12th House)
 * 
 * Formula:
 * H_trigger = ((H_target - 1 - 3) mod 12) + 1  (4-second reverse count)
 * H_origin  = ((H_target - 1 - GPS_Code) mod 12) + 1  (Planetary root origin)
 */

import {
  ASTRO_VASTU_SIGN_DIRECTIONS,
  type GPSPlanetaryCode,
} from "./astro-vastu-types";
import { MASTER_GPS_CODES } from "./gps-astro-vastu-engine";

export type CoreQueryCategory =
  | "career_stagnation"
  | "peeda_chronic"
  | "dhana_liquidity"
  | "roga_health"
  | "sukh_domestic"
  | "vyaya_drainage";

export interface CoreQueryDefinition {
  id: CoreQueryCategory;
  titleHi: string;
  titleEn: string;
  targetHouse: number;
  houseThemeHi: string;
  naturalGoverningPlanet: string;
  primaryZoneCode: string;
  primaryZoneHindi: string;
  clutterInspectionZones: string[];
  clutterItemsToInspectHi: string[];
  diagnosticSymptomHi: string;
  lowCostActivatingRemedyHi: string;
  utilizationProtocolHi: string;
}

export interface CalculatedQueryGPSResult {
  queryId: CoreQueryCategory;
  titleHi: string;
  titleEn: string;
  targetHouse: number;
  lagnaSignNum: number; // 1 to 12
  houseSignNum: number; // 1 to 12
  houseSignName: string;
  houseLord: string;
  gpsCode: number;
  triggerHouse: number;
  triggerSignNum: number;
  triggerSignName: string;
  triggerDirectionCode: string;
  triggerDirectionHindi: string;
  originHouse: number;
  originSignNum: number;
  originSignName: string;
  originDirectionCode: string;
  originDirectionHindi: string;
  diagnosticSymptomHi: string;
  clutterInspectionZones: string[];
  clutterItemsToInspectHi: string[];
  lowCostActivatingRemedyHi: string;
  utilizationProtocolHi: string;
  mathematicalProofHi: string;
}

export const SIGN_NAMES_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const SIGN_NAMES_HI = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
];

export const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

export const MASTER_CORE_QUERIES: Record<CoreQueryCategory, CoreQueryDefinition> = {
  career_stagnation: {
    id: "career_stagnation",
    titleHi: "कैरियर में ठहराव व पदोन्नति में बाधा",
    titleEn: "Career Stagnation & Delayed Promotion",
    targetHouse: 10,
    houseThemeHi: "कर्म स्थान, राज्य सम्मान, आजीविका व प्रतिष्ठा",
    naturalGoverningPlanet: "Saturn",
    primaryZoneCode: "N",
    primaryZoneHindi: "उत्तर (कुबेर / अवसर)",
    clutterInspectionZones: ["N", "NW", "S"],
    clutterItemsToInspectHi: [
      "उत्तर या उत्तर-पश्चिम में पुराना कबाड़, जंग लगा लोहा अथवा बंद घड़ियां",
      "दक्षिण दिशा (मंगल) में पानी का स्रोत या नीला/काला रंग",
      "डेस्क के पीछे खुली खिड़की या आधारहीन अव्यवस्था",
    ],
    diagnosticSymptomHi: "मेहनत के बाद भी पदोन्नति रुकना, बॉस द्वारा काम का श्रेय न मिलना, व्यापारिक ऑर्डर्स अंतिम समय पर रद्द होना।",
    lowCostActivatingRemedyHi: "उत्तर दिशा में एक शुद्ध पीतल का कुबेर यंत्र या हरे पेड़-पौधे लगाएं; कार्यस्थल पर बैठते समय पीठ के पीछे ठोस दीवार रखें।",
    utilizationProtocolHi: "प्रातःकाल 10वें भाव के ट्रिगर ज़ोन में 10 मिनट बैठकर कार्ययोजना बनाएं और कभी भी उत्तर में भारी कबाड़ न रखें।",
  },
  peeda_chronic: {
    id: "peeda_chronic",
    titleHi: "अचानक दुर्घटना, असाध्य पीड़ा व संकट",
    titleEn: "Sudden Peeda, Chronic Affliction & Hurdles",
    targetHouse: 8,
    houseThemeHi: "आयु, गूढ़ पीड़ा, आकस्मिक बाधाएं व गुप्त कष्ट",
    naturalGoverningPlanet: "Saturn",
    primaryZoneCode: "SSW",
    primaryZoneHindi: "दक्षिण-दक्षिण-पश्चिम (विसर्जन ज़ोन)",
    clutterInspectionZones: ["SSW", "SW", "NW"],
    clutterItemsToInspectHi: [
      "एसएसडब्ल्यू (SSW) में टूटे कांच, कीमती वस्तुएं अथवा तिजोरी का होना",
      "दक्षिण-पश्चिम (SW) में गड्ढा, पानी की बोरिंग अथवा सीलन",
      "घर के ईशान (NE) में भारी लोहे का सामान या कबाड़",
    ],
    diagnosticSymptomHi: "अचानक बिना पूर्व चेतावनी के कोर्ट केस, अस्पष्ट मेडिकल डायग्नोसिस, शरीर के निचले अंगों में लगातार असह्य दर्द।",
    lowCostActivatingRemedyHi: "शनिवार की शाम मंदिर/गुरुद्वारे के जोड़ा घर में जूता-चप्पल सफाई सेवा (शून्य लागत) करें अथवा 8 साबुत बादाम छिलके सहित दान करें।",
    utilizationProtocolHi: "8वें भाव की दिशा (SSW) में केवल कचरा पेटी (Dustbin) रखें, कोई भी पूजा या मूल्यवान वस्तु वहां कदापि न रखें।",
  },
  dhana_liquidity: {
    id: "dhana_liquidity",
    titleHi: "तरल धन की कमी व रुका हुआ भुगतान",
    titleEn: "Cash Liquidity Crunch & Blocked Client Payments",
    targetHouse: 2,
    houseThemeHi: "धन संचय, कुटुंब, वाणी व तरल नकदी",
    naturalGoverningPlanet: "Jupiter",
    primaryZoneCode: "SE",
    primaryZoneHindi: "दक्षिण-पूर्व (आग्नेय - कैश लिक्विडिटी)",
    clutterInspectionZones: ["SE", "NNE", "N"],
    clutterItemsToInspectHi: [
      "दक्षिण-पूर्व (SE) आग्नेय कोण में पानी की टंकी, नीला/काला रंग या आरओ वाटर फिल्टर",
      "उत्तर-उत्तर-पूर्व (NNE) में दवाइयों का ढेर या कचरा पेटी",
      "तिजोरी का मुख दक्षिण की ओर खुलना",
    ],
    diagnosticSymptomHi: "व्यापार में टर्नओवर होना पर हाथ में कैश न बचना, क्लाइंट्स द्वारा वादे के बाद भी चेक क्लियर न कराना।",
    lowCostActivatingRemedyHi: "उत्तर-उत्तर-पूर्व (NNE) या ईशान (NE) में सोने के रंग के फ्रेम में महालक्ष्मी/कुबेर का चित्र लगाएं और SE से नीला रंग तत्काल हटाएं।",
    utilizationProtocolHi: "कैश लॉकर को दक्षिण दीवार से सटाकर रखें ताकि उसका दरवाजा उत्तर (North) की ओर खुले।",
  },
  roga_health: {
    id: "roga_health",
    titleHi: "शारीरिक रोग, सर्वाइकल व स्नायु विकार",
    titleEn: "Physical Ailments, Cervical & Neurological Issues",
    targetHouse: 6,
    houseThemeHi: "रोग, ऋण, शत्रु व देह व्याधि",
    naturalGoverningPlanet: "Mercury",
    primaryZoneCode: "NNW",
    primaryZoneHindi: "उत्तर-उत्तर-पश्चिम (रोग निरोधक ज़ोन)",
    clutterInspectionZones: ["NW", "NNW", "NE"],
    clutterItemsToInspectHi: [
      "उत्तर-पश्चिम (NW) में हीटर, लाल रंग, गैस बर्नर अथवा इनवर्टर (यह सीधे सर्वाइकल व गर्दन का दर्द पैदा करता है)",
      "उत्तर-पूर्व (NE) में किचन स्लैब या गैस चूल्हा (अति घातक - हाई बीपी/स्ट्रोक)",
      "दवाइयों को एसएसडब्ल्यू (SSW) के स्थान पर डाइनिंग टेबल पर रखना",
    ],
    diagnosticSymptomHi: "गर्दन में जकड़न (Cervical Spondylosis), पैरों के तलवों में जलन, अनिद्रा और लगातार दवाओं पर निर्भरता।",
    lowCostActivatingRemedyHi: "उत्तर-पश्चिम (NW) से सभी हीटिंग उपकरण हटाएं; वहां सफेद मिट्टी के गमले में चमेली/तुलसी का पौधा रखें। उत्तर-उत्तर-पूर्व (NNE) में दवाइयां रखें।",
    utilizationProtocolHi: "सोते समय सिर हमेशा दक्षिण या पूर्व दिशा में रखें, उत्तर दिशा में सिर रखकर कभी न सोएं।",
  },
  sukh_domestic: {
    id: "sukh_domestic",
    titleHi: "घरेलू क्लेश व मानसिक अशांति",
    titleEn: "Domestic Discord & Lack of Peace of Mind",
    targetHouse: 4,
    houseThemeHi: "मातृ सुख, गृह सुख, वाहन व मन की शांति",
    naturalGoverningPlanet: "Moon",
    primaryZoneCode: "NE",
    primaryZoneHindi: "उत्तर-पूर्व (ईशान - मानसिक शांति)",
    clutterInspectionZones: ["NE", "Brahmasthan", "SW"],
    clutterItemsToInspectHi: [
      "घर के ठीक केंद्र (ब्रह्मस्थान) में भारी पिलर, दीवार, सीढ़ियां या डस्टबिन",
      "ईशान कोण (NE) में टॉयलेट, गंदगी या झाड़ू-पोछा",
      "मास्टर बेडरूम का उत्तर-पूर्व या आग्नेय कोण में होना",
    ],
    diagnosticSymptomHi: "घर में प्रवेश करते ही सिर में भारीपन, परिवार के सदस्यों में अकारण वाद-विवाद, घर में टिकने का मन न होना।",
    lowCostActivatingRemedyHi: "ब्रह्मस्थान और ईशान कोण को पूर्णतः खाली, हल्का और स्वच्छ रखें; ईशान में चांदी या कांच के कटोरे में ताजा जल भरें।",
    utilizationProtocolHi: "परिवार के मुखिया का शयनकक्ष हमेशा दक्षिण-पश्चिम (SW) नैऋत्य कोण में ही रखें।",
  },
  vyaya_drainage: {
    id: "vyaya_drainage",
    titleHi: "अनावश्यक व्यय, जुर्माना व धन बर्बादी",
    titleEn: "Uncontrolled Expenditures & Money Drain",
    targetHouse: 12,
    houseThemeHi: "व्यय, अस्पताल, विदेशी संबंध व विसर्जन",
    naturalGoverningPlanet: "Jupiter",
    primaryZoneCode: "SSW",
    primaryZoneHindi: "दक्षिण-दक्षिण-पश्चिम (व्यय व विसर्जन)",
    clutterInspectionZones: ["SSW", "SE", "N"],
    clutterItemsToInspectHi: [
      "एसएसडब्ल्यू (SSW) में सौंदर्य प्रसाधन, ड्रेसिंग टेबल का शीशा अथवा परफ्यूम की खाली बोतलें",
      "नल से लगातार पानी टपकना (Water leakage in taps/pipes)",
      "घर के मुख्य प्रवेश द्वार पर कांटेदार पौधे या अव्यवस्थित जूते-चप्पल",
    ],
    diagnosticSymptomHi: "पैसा आते ही अचानक गाड़ी खराब होना, चालान कटना, मेडिकल टेस्ट के अप्रत्याशित बिल आना।",
    lowCostActivatingRemedyHi: "एसएसडब्ल्यू से शीशा व प्रसाधन तुरंत हटाएं; टपकते नलों के वॉशर उसी दिन बदलें; 12वें भाव के ग्रह अनुसार स्वेच्छा से दान करें।",
    utilizationProtocolHi: "एसएसडब्ल्यू ज़ोन में वाशिंग मशीन या डस्टबिन स्थापित कर विसर्जन ऊर्जा को सही मार्ग दें।",
  },
};

/**
 * Calculates Query GPS Analysis using the authentic Shastric reverse formula
 */
export function calculateQueryGPSAnalysis(
  queryCategory: CoreQueryCategory,
  lagnaSignNum: number // 1 (Aries) to 12 (Pisces)
): CalculatedQueryGPSResult {
  const queryDef = MASTER_CORE_QUERIES[queryCategory];
  const targetHouse = queryDef.targetHouse;

  // Calculate sign in target house: ((lagnaSignNum - 1 + targetHouse - 1) % 12) + 1
  const houseSignNum = (((lagnaSignNum - 1) + (targetHouse - 1)) % 12) + 1;
  const houseSignName = SIGN_NAMES_HI[houseSignNum - 1];
  const houseLord = SIGN_LORDS[houseSignNum - 1];
  const gpsCode = MASTER_GPS_CODES[houseLord]?.code ?? 4;

  // 4-Second Reverse Trigger House: 4 houses backwards = count - 3
  const triggerHouse = (((targetHouse - 1 - 3 + 120) % 12)) + 1;
  const triggerSignNum = (((lagnaSignNum - 1) + (triggerHouse - 1)) % 12) + 1;
  const triggerSignName = SIGN_NAMES_HI[triggerSignNum - 1];
  const triggerSignEn = SIGN_NAMES_EN[triggerSignNum - 1];
  const triggerDirDef = ASTRO_VASTU_SIGN_DIRECTIONS[triggerSignEn] || {
    direction: "North",
    directionHi: "उत्तर",
    code: "N",
  };

  // Planetary Root Origin House: ((targetHouse - 1 - gpsCode + 120) % 12) + 1
  const originHouse = (((targetHouse - 1 - gpsCode + 120) % 12)) + 1;
  const originSignNum = (((lagnaSignNum - 1) + (originHouse - 1)) % 12) + 1;
  const originSignName = SIGN_NAMES_HI[originSignNum - 1];
  const originSignEn = SIGN_NAMES_EN[originSignNum - 1];
  const originDirDef = ASTRO_VASTU_SIGN_DIRECTIONS[originSignEn] || {
    direction: "North",
    directionHi: "उत्तर",
    code: "N",
  };

  const mathematicalProofHi = `शास्त्रीय सूत्र: अभीष्ट भाव ${targetHouse} (${houseSignName} राशि, स्वामी: ${houseLord}, GPS कोड: ${gpsCode})। वामावर्त 4-सेकंड रिवर्स काउंटिंग = भाव ${triggerHouse} (${triggerSignName} राशि - दिशा: ${triggerDirDef.directionHi})। मूल कारण ओरिजिन भाव = ((भाव ${targetHouse} - कोड ${gpsCode}) mod 12) = भाव ${originHouse} (${originSignName} राशि - दिशा: ${originDirDef.directionHi})।`;

  return {
    queryId: queryCategory,
    titleHi: queryDef.titleHi,
    titleEn: queryDef.titleEn,
    targetHouse,
    lagnaSignNum,
    houseSignNum,
    houseSignName,
    houseLord,
    gpsCode,
    triggerHouse,
    triggerSignNum,
    triggerSignName,
    triggerDirectionCode: triggerDirDef.code,
    triggerDirectionHindi: triggerDirDef.directionHi,
    originHouse,
    originSignNum,
    originSignName,
    originDirectionCode: originDirDef.code,
    originDirectionHindi: originDirDef.directionHi,
    diagnosticSymptomHi: queryDef.diagnosticSymptomHi,
    clutterInspectionZones: queryDef.clutterInspectionZones,
    clutterItemsToInspectHi: queryDef.clutterItemsToInspectHi,
    lowCostActivatingRemedyHi: queryDef.lowCostActivatingRemedyHi,
    utilizationProtocolHi: queryDef.utilizationProtocolHi,
    mathematicalProofHi,
  };
}
