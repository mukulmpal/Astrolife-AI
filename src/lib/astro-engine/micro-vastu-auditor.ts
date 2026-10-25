// src/lib/astro-engine/micro-vastu-auditor.ts
/**
 * AstroLife Micro-Vastu Auditor & Emergency Medical Guard
 * 
 * Provides:
 * 1. Kitchen Micro-Grid Analysis (Micro-North Water vs Micro-South Fire separation)
 * 2. Emergency Medical Alert for NE Burner / Toilet (High BP, Brain Stroke, Mandatory Relocation)
 * 3. Wall Clock (घड़ी / Kaal Chakra) Zone Activation Diagnostics
 * 4. Navtara-Hit Precedence Guard (27th Parama Mitra vs 180°/90° Killer Hit)
 * 5. Body-Part Trap & Tilak Vector Analysis (Wrist = Gemini 3rd sign, Forehead = Aries 1st, Navel = Leo 5th)
 */

import { runAstroVastuHitEngine, type AstroVastuHitDossier } from "./astro-vastu-hit-engine";
import { calculateTaraNumber, calculateCountedPosition } from "./navtara-engine";

export interface KitchenMicroGridInput {
  stoveZoneWithinKitchen?: "NORTH" | "SOUTH" | "EAST" | "WEST" | "SE" | "NW" | "NE" | "SW";
  sinkZoneWithinKitchen?: "NORTH" | "SOUTH" | "EAST" | "WEST" | "SE" | "NW" | "NE" | "SW";
  areStoveAndSinkOnSameCounter?: boolean;
  distanceBetweenStoveAndSinkFeet?: number;
}

export interface KitchenMicroGridAuditResult {
  hasFireWaterClash: boolean;
  stovePositionVerdictHi: string;
  sinkPositionVerdictHi: string;
  clashConsequencesHi: string[];
  lowCostRemedyHi: string;
  recommendedLayoutHi: string;
}

export interface EmergencyMedicalVastuAlert {
  roomType: "kitchen_stove" | "toilet" | "septic_tank";
  zone: "NE" | "NNE" | "ENE";
  severity: "CRITICAL_EMERGENCY";
  medicalHazardsHi: string[];
  zeroRemedyDisclaimerHi: string;
  mandatoryActionHi: string;
}

export interface WallClockZoneAudit {
  zone: string;
  status: "AUSPICIOUS" | "HAZARDOUS" | "NEUTRAL";
  effectHi: string;
  recommendationHi: string;
}

export interface NavtaraHitPrecedenceItem {
  planet: string;
  planetHi: string;
  birthNakshatraName: string;
  planetNakshatraName: string;
  taraNum: number; // 1 to 9
  countedPosition: number; // 1 to 27
  taraName: string;
  taraNameHi: string;
  isBeneficTara: boolean;
  isKillerHitActive: boolean;
  isDangerousHitActive: boolean;
  hitAngle?: number;
  hitTargetName?: string;
  precedenceVerdict: "PROHIBITED_ACTIVATION" | "SAFE_BENEFIC" | "NEUTRAL";
  warningNoticeHi: string;
  actionProtocolHi: string;
}

/**
 * 1. KITCHEN MICRO-GRID AUDIT
 */
export function auditKitchenMicroGrid(input: KitchenMicroGridInput): KitchenMicroGridAuditResult {
  const stove = input.stoveZoneWithinKitchen || "SE";
  const sink = input.sinkZoneWithinKitchen || "NORTH";
  const onSameCounter = input.areStoveAndSinkOnSameCounter ?? (stove === sink || Math.abs((input.distanceBetweenStoveAndSinkFeet || 5) - 2) < 1.5);
  const distance = input.distanceBetweenStoveAndSinkFeet ?? 3;

  const isStoveInWaterZone = stove === "NORTH" || stove === "NE" || stove === "NW";
  const isSinkInFireZone = sink === "SE" || sink === "SOUTH";
  const hasFireWaterClash = onSameCounter && distance < 4;

  const clashConsequencesHi: string[] = [];
  if (hasFireWaterClash || isStoveInWaterZone || isSinkInFireZone) {
    clashConsequencesHi.push(
      "रसोई में अग्नि (चूल्हा) और जल (सिंक) का सानिध्य सीधे 'अग्नि-जल द्वंद्व' उत्पन्न करता है।",
      "स्वास्थ्य प्रभाव: परिवार के सदस्यों में अपच (Acid Reflux), लिवर में गर्मी व महिलाओं में हार्मोनल असंतुलन।",
      "घरेलू प्रभाव: सास-बहू या पति-पत्नी में छोटी-छोटी बातों पर अचानक उग्र वाद-विवाद।"
    );
  }

  let lowCostRemedyHi = "चूल्हा और सिंक पर्याप्त दूरी पर हैं। रसोई के माइक्रो-नॉर्थ को स्वच्छ व माइक्रो-साउथ-ईस्ट को सक्रिय रखें।";
  if (hasFireWaterClash) {
    lowCostRemedyHi = "₹0-₹50 लो-कॉस्ट उपाय: गैस चूल्हे और सिंक के बीच काउंटर पर 1-इंच चौड़ी लकड़ी की चॉपिंग बोर्ड खड़ी कर दें, अथवा दोनों के बीच एक हरी मार्बल/टाइल्स की पट्टी या छोटा सा हरा बांस/पुदीने का पौधा रख दें ताकि अग्नि और जल की ऊर्जा आपस में न टकराए।";
  }

  return {
    hasFireWaterClash,
    stovePositionVerdictHi: isStoveInWaterZone
      ? `चूल्हा रसोई के ${stove} में है, जो जल क्षेत्र होने से अग्नि को कमजोर करता है। इसे माइक्रो-साउथ-ईस्ट (SE) में रखें।`
      : `चूल्हा माइक्रो-${stove} में अनुकूल है।`,
    sinkPositionVerdictHi: isSinkInFireZone
      ? `सिंक रसोई के ${sink} में है। जल तत्व का अग्नि क्षेत्र में होना दोष है। इसे माइक्रो-नॉर्थ (N) में रखें।`
      : `सिंक माइक्रो-${sink} में जल तत्व के पूर्ण अनुकूल है।`,
    clashConsequencesHi,
    lowCostRemedyHi,
    recommendedLayoutHi: "माइक्रो-नॉर्थ (North/NE): पानी का मटका, आरओ फिल्टर व सिंक। माइक्रो-साउथ-ईस्ट (SE): गैस स्टोव, माइक्रोवेव, मसाला दानी।",
  };
}

/**
 * 2. EMERGENCY MEDICAL ALERT FOR NE BURNER / TOILET
 */
export function auditEmergencyMedicalVastuAlerts(
  rooms: Array<{ type: string; direction: string }>
): EmergencyMedicalVastuAlert[] {
  const alerts: EmergencyMedicalVastuAlert[] = [];

  for (const room of rooms) {
    const dir = (room.direction || "").toUpperCase();
    const type = room.type.toLowerCase();

    // Check for Kitchen / Gas Stove in NE
    if ((type.includes("kitchen") || type.includes("stove") || type.includes("burner")) && (dir === "NE" || dir === "NNE" || dir === "ENE")) {
      alerts.push({
        roomType: "kitchen_stove",
        zone: dir as "NE" | "NNE" | "ENE",
        severity: "CRITICAL_EMERGENCY",
        medicalHazardsHi: [
          "उच्च रक्तचाप (Severe High BP) एवं मस्तिष्क की नसों में अत्यधिक दबाव",
          "ब्रेन स्ट्रोक (Brain Stroke), सेरेब्रल एन्यूरिज्म व पक्षाघात (Paralysis) का तीव्र जोखिम",
          "अनिद्रा, तीव्र सिरदर्द, क्रोध का अनियंत्रित विस्फोट व निर्णय शून्यता",
        ],
        zeroRemedyDisclaimerHi: "⚠️ महत्वपूर्ण शास्त्रीय अस्वीकरण: ईशान कोण (North-East) वास्तु पुरुष का मस्तिष्क और शिव तत्व (जल) है। यहां अग्नि (गैस बर्नर) का कोई भी रंगीन टेप, पिरामिड, तांबे का तार या स्टिकर द्वारा उपचार सम्भव नहीं है!",
        mandatoryActionHi: "गैस बर्नर को तत्काल उत्तर-पूर्व से हटाकर आग्नेय कोण (South-East) या वायव्य कोण (North-West) में शिफ्ट करें। यदि संभव न हो तो बर्नर के नीचे सफेद मार्बल स्लैब केवल आपातकालीन अस्थायी राहत देता है, स्थाई समाधान केवल भौतिक स्थानांतरण है।",
      });
    }

    // Check for Toilet / Septic Tank in NE
    if ((type.includes("toilet") || type.includes("septic")) && (dir === "NE" || dir === "NNE" || dir === "ENE")) {
      alerts.push({
        roomType: type.includes("septic") ? "septic_tank" : "toilet",
        zone: dir as "NE" | "NNE" | "ENE",
        severity: "CRITICAL_EMERGENCY",
        medicalHazardsHi: [
          "गंभीर अवसाद (Clinical Depression), स्मरण शक्ति का लोप व मानसिक भ्रम",
          "न्यूरोलॉजिकल विकार, रीढ़ की हड्डी में अवरोध व असाध्य सिरदर्द",
          "घर के मुखिया की बुद्धि का भ्रमित होना और वंश वृद्धि व समृद्धि में पूर्ण अवरोध",
        ],
        zeroRemedyDisclaimerHi: "⚠️ शास्त्रीय नियम: ईशान कोण में विसर्जन (Toilet/Septic) मस्तिष्क में विष के समान है। इसे धातु की पट्टी या टेप से 100% काटा नहीं जा सकता।",
        mandatoryActionHi: "इस टॉयलेट की सीट को सील कर प्रयोग बंद करें अथवा इसे उत्तर-पश्चिम (NW) या दक्षिण-दक्षिण-पश्चिम (SSW) में पुनर्स्थापित करें।",
      });
    }
  }

  return alerts;
}

/**
 * 3. WALL CLOCK (घड़ी / काल चक्र) ZONE AUDIT
 */
export const WALL_CLOCK_ZONE_REGISTRY: Record<string, WallClockZoneAudit> = {
  SSW: {
    zone: "SSW",
    status: "HAZARDOUS",
    effectHi: "समय और अवसरों का निरंतर विसर्जन (Time Drainage)। महत्वपूर्ण कार्यों की समय सीमा (Deadlines) लगातार चूकना और समय की बर्बादी होना।",
    recommendationHi: "घड़ी को तुरंत एसएसडब्ल्यू से हटाएं। इस ज़ोन में घड़ी कभी न लगाएं।",
  },
  WNW: {
    zone: "WNW",
    status: "HAZARDOUS",
    effectHi: "बीते हुए समय और पुरानी गलतियों पर लगातार पछतावा, रोना और डिप्रेशन। मानसिक डिटॉक्स के बजाय मन का पुरानी यादों में अटक जाना।",
    recommendationHi: "इस दीवार से घड़ी हटाकर पश्चिम या उत्तर की दीवार पर स्थापित करें।",
  },
  ESE: {
    zone: "ESE",
    status: "HAZARDOUS",
    effectHi: "समय बीतने का अनियंत्रित तनाव, घबराहट (Anxiety Panic), दिल की धड़कन तेज होना और निरंतर मंथन में समय नष्ट होना।",
    recommendationHi: "घड़ी को ईएसई से तुरंत हटाकर पूर्व या उत्तर दिशा में लगाएं।",
  },
  N: {
    zone: "N",
    status: "AUSPICIOUS",
    effectHi: "कुबेर दिशा में घड़ी लगाने से नए कैरियर अवसर, पदोन्नति, समय पर भुगतान और व्यावसायिक प्रगति की गति बढ़ती है।",
    recommendationHi: "उत्तर दिशा में गोल या अंडाकार नीले/सफेद/हरे फ्रेम की घड़ी लगाना अत्यंत शुभ है।",
  },
  E: {
    zone: "E",
    status: "AUSPICIOUS",
    effectHi: "इंद्र व सूर्य की दिशा में घड़ी सामाजिक संबंधों, मान-सम्मान और जीवन में ताजगी लाती है। समय का सदुपयोग सुनिश्चित होता है।",
    recommendationHi: "पूर्व दीवार पर लकड़ी के फ्रेम वाली अथवा सुनहरी घड़ी लगाएं।",
  },
  W: {
    zone: "W",
    status: "AUSPICIOUS",
    effectHi: "वरुण व शनि का स्थान होने से यह कार्यों में स्थिरता, दीर्घकालीन लाभ और व्यावसायिक अनुशासन प्रदान करता है।",
    recommendationHi: "पश्चिम दिशा में गोल या चौकोर ग्रे/व्हाइट/सिल्वर फ्रेम की घड़ी लगाना श्रेष्ठ है।",
  },
  NE: {
    zone: "NE",
    status: "NEUTRAL",
    effectHi: "ईशान में शांत व धीमी टिक-टिक वाली साधारण घड़ी स्वीकार्य है, परंतु भारी या पेंडुलम वाली घड़ियों से बचें।",
    recommendationHi: "हल्की, स्वच्छ व पारदर्शी घड़ी लगाएं।",
  },
  S: {
    zone: "S",
    status: "NEUTRAL",
    effectHi: "दक्षिण दिशा में घड़ी लगाने से बचना चाहिए, क्योंकि यह विश्राम का क्षेत्र है और घड़ी की निरंतर गति ऊर्जा में बेचैनी लाती है।",
    recommendationHi: "घड़ी को उत्तर या पूर्व की दीवार पर स्थानांतरित करना श्रेयस्कर है।",
  },
};

export function auditWallClockZone(zone: string): WallClockZoneAudit {
  const normZone = (zone || "").toUpperCase();
  return (
    WALL_CLOCK_ZONE_REGISTRY[normZone] || {
      zone: normZone,
      status: "NEUTRAL",
      effectHi: "इस ज़ोन में घड़ी का प्रभाव मध्यम है।",
      recommendationHi: "सर्वोत्तम परिणामों के लिए घड़ी उत्तर, पूर्व या पश्चिम दिशा में लगाएं।",
    }
  );
}

/**
 * 4. NAVTARA-HIT PRECEDENCE GUARD
 * 
 * Verifies if any planet in an auspicious Navtara (e.g. 27th Parama Mitra) is actively
 * hitting the Dasha Nakshatra Lord or Lagna with a 180° Killer Hit or 90° Dangerous Hit.
 * If yes, Hit Theory strictly overrides Navtara beneficence!
 */
export function evaluateNavtaraHitPrecedence(
  chart: any,
  dossier?: AstroVastuHitDossier | null
): NavtaraHitPrecedenceItem[] {
  if (!chart) return [];
  const hitDossier = dossier || runAstroVastuHitEngine(chart);
  if (!hitDossier) return [];

  // Extract birth moon nakshatra
  const moonNakNum = chart.moonNakshatraNumber || (chart.moon?.nakshatra ? Number(chart.moon.nakshatra) : 1);
  const moonNakName = chart.moonNakshatraName || chart.moon?.nakshatraName || "Ashwini";

  const results: NavtaraHitPrecedenceItem[] = [];

  // Planet Nakshatra list from chart
  const planets = chart.planets || chart.planetaryPositions || {};
  const planetEntries = Array.isArray(planets)
    ? planets.map((p: any) => ({ name: p.name || p.planet, nakshatraNum: Number(p.nakshatra || p.nakshatraNum || 1), nakName: p.nakshatraName || "" }))
    : Object.entries(planets).map(([name, p]: [string, any]) => ({ name, nakshatraNum: Number(p?.nakshatra || p?.nakshatraNum || 1), nakName: p?.nakshatraName || "" }));

  for (const pl of planetEntries) {
    if (!pl.name) continue;
    const plName = pl.name.trim();
    const plNakNum = pl.nakshatraNum || 1;

    const taraNum = calculateTaraNumber(moonNakNum, plNakNum);
    const countedPos = calculateCountedPosition(moonNakNum, plNakNum);

    const isParamaMitra = taraNum === 9 || countedPos === 27;
    const isSampat = taraNum === 2;
    const isMitra = taraNum === 8;
    const isSadhaka = taraNum === 6;
    const isKshema = taraNum === 4;

    const isBeneficTara = isParamaMitra || isSampat || isMitra || isSadhaka || isKshema;

    // Check if this planet is casting a 180° or 90° hit
    const killerHit = hitDossier.killerHits180.find(h => h.sourceName.toLowerCase() === plName.toLowerCase());
    const dangerousHit = hitDossier.dangerousHits90.find(h => h.sourceName.toLowerCase() === plName.toLowerCase());

    const isKillerHitActive = Boolean(killerHit);
    const isDangerousHitActive = Boolean(dangerousHit);

    let precedenceVerdict: "PROHIBITED_ACTIVATION" | "SAFE_BENEFIC" | "NEUTRAL" = "NEUTRAL";
    let warningNoticeHi = "";
    let actionProtocolHi = "";

    const taraNameHi =
      countedPos === 27 ? "27वां परम मित्र नक्षत्र (Support Star)" :
      taraNum === 9 ? "9वां परम मित्र तारा" :
      taraNum === 8 ? "8वां मित्र तारा" :
      taraNum === 6 ? "6ठा साधक तारा" :
      taraNum === 4 ? "4था क्षेम तारा" :
      taraNum === 2 ? "2रा सम्पत तारा" :
      taraNum === 1 ? "1ला जन्म तारा" : "कष्ट तारा (विपत्/प्रत्यरि/वध)";

    if (isBeneficTara && (isKillerHitActive || isDangerousHitActive)) {
      precedenceVerdict = "PROHIBITED_ACTIVATION";
      const hitObj = killerHit || dangerousHit;
      warningNoticeHi = `🚨 नवतारा-हिट वरीयता नियम (Strict Override): ${plName} आपके जन्म नक्षत्र (${moonNakName}) से ${taraNameHi} में स्थित होने से पारंपरिक रूप से अत्यंत शुभ दिखता है। परन्तु एस्ट्रो-वास्तु हिट थ्योरी अनुसार यह वर्तमान में ${hitObj?.targetName} पर ${hitObj?.hitDef.name || "मारक वेध"} कर रहा है! नवतारा शुभता के भ्रम में इसका रत्न पहनना या इसकी दिशा को सक्रिय करना आत्मघाती सिद्ध होगा।`;
      actionProtocolHi = `इस ग्रह का रत्न अथवा धातु कदापि न पहनें। इसके स्थान पर इसे 11वें भाव (120° सुरक्षित त्रिकोण दिशा) में शिफ्ट करें तथा संबंधित देह-वास्तु बिंदु पर सफेद धागा या चंदन का उपयोग करें।`;
    } else if (isBeneficTara) {
      precedenceVerdict = "SAFE_BENEFIC";
      warningNoticeHi = `${plName} आपके जन्म नक्षत्र से ${taraNameHi} में निर्दोष है। इस पर कोई 180° किलर अथवा 90° वेध सक्रिय नहीं है।`;
      actionProtocolHi = `इस ग्रह की दिशा व रत्न का पूर्ण सात्विक उपयोग किया जा सकता है।`;
    } else {
      precedenceVerdict = "NEUTRAL";
      warningNoticeHi = `${plName} नवतारा चक्र में तटस्थ या सामान्य स्थिति में है।`;
      actionProtocolHi = `सामान्य एस्ट्रो-वास्तु नियमों का पालन करें।`;
    }

    results.push({
      planet: plName,
      planetHi: plName,
      birthNakshatraName: moonNakName,
      planetNakshatraName: pl.nakName || `Nakshatra #${plNakNum}`,
      taraNum,
      countedPosition: countedPos,
      taraName: taraNameHi,
      taraNameHi,
      isBeneficTara,
      isKillerHitActive,
      isDangerousHitActive,
      hitAngle: killerHit ? 180 : dangerousHit ? 90 : undefined,
      hitTargetName: (killerHit || dangerousHit)?.targetName,
      precedenceVerdict,
      warningNoticeHi,
      actionProtocolHi,
    });
  }

  return results;
}

