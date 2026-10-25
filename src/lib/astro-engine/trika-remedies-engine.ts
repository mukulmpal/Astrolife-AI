// src/lib/astro-engine/trika-remedies-engine.ts
/**
 * AstroLife Trika Bhava Remedy Matrix Engine (6th, 8th, 12th Houses)
 * 
 * Implements the authentic Shastric medium distinction:
 * 1. 6th House (Roga/Rina/Shatru)  ==> Living Plants in earthen mud pots (Never plastic).
 * 2. 8th House (Peeda/Accidents)   ==> Whole Fruit / Food Donations (Phal & Bhojan Daan).
 * 3. 12th House (Vyaya/Hospital)   ==> KP Voluntary Tithe & Conscious Planetary Expenses.
 */

export interface PlantRemedy6th {
  planet: string;
  planetHi: string;
  plantNameHi: string;
  plantNameEn: string;
  botanicalOrTraditionalName: string;
  mediumSpecificationHi: string;
  wateringProtocolHi: string;
  targetAilmentDebtHi: string;
  shastricRationaleHi: string;
}

export interface FruitDaanRemedy8th {
  planet: string;
  planetHi: string;
  fruitOrFoodHi: string;
  quantityHi: string;
  donationVenueHi: string;
  timingDayHi: string;
  targetPeedaHi: string;
  shastricRationaleHi: string;
}

export interface VoluntaryTithe12th {
  planet: string;
  planetHi: string;
  voluntaryActionHi: string;
  preventedInvoluntaryDrainHi: string;
  recommendedBudgetOrItemHi: string;
  targetRecipientHi: string;
  kpPrincipleHi: string;
}

export interface TrikaBhavaAnalysis {
  house6PlantRemedies: PlantRemedy6th[];
  house8FruitRemedies: FruitDaanRemedy8th[];
  house12VoluntaryTithes: VoluntaryTithe12th[];
  chartSpecificPrescription?: {
    house6Planet?: string;
    house8Planet?: string;
    house12Planet?: string;
    activePlantRemedy?: PlantRemedy6th;
    activeFruitRemedy?: FruitDaanRemedy8th;
    activeTitheRemedy?: VoluntaryTithe12th;
  };
}

export const MASTER_6TH_HOUSE_PLANTS: Record<string, PlantRemedy6th> = {
  Rahu: {
    planet: "Rahu",
    planetHi: "राहु",
    plantNameHi: "श्वेत चंदन का पौधा / जड़",
    plantNameEn: "White Sandalwood (Chandan)",
    botanicalOrTraditionalName: "Santalum album",
    mediumSpecificationHi: "शुद्ध मिट्टी के गमले में लगाएं (प्लास्टिक का गमला सर्वथा वर्जित है)।",
    wateringProtocolHi: "प्रातःकाल शुद्ध ताजे जल से सींचें। गमले में जल जमा न होने दें।",
    targetAilmentDebtHi: "अदृश्य शत्रु, गुप्त षड्यंत्र, अनजानी कोर्ट-कचहरी और मानसिक भय को शांत करता है।",
    shastricRationaleHi: "राहु विष तत्व है और चंदन शिवप्रिय शीतल तत्व। 6ठे भाव में चंदन का पौधा राहु के विषैले वात प्रभाव को निष्प्रभावी कर देता है।",
  },
  Ketu: {
    planet: "Ketu",
    planetHi: "केतु",
    plantNameHi: "केले का पौधा (हल्दी जल सिंचित)",
    plantNameEn: "Banana Tree in Pot",
    botanicalOrTraditionalName: "Musa acuminata",
    mediumSpecificationHi: "मध्यम आकार के मिट्टी के गमले में पूर्व या ईशान दिशा में बालकनी/छत पर रखें।",
    wateringProtocolHi: "प्रति गुरुवार को एक लोटे जल में एक चुटकी पिसी हल्दी मिलाकर केले की जड़ में अर्पित करें।",
    targetAilmentDebtHi: "ग्राहकों के पास फंसा हुआ धन (Trapped Client Money), असाध्य कर्ज और रीढ़/घुटने के दर्द से मुक्ति दिलाता है।",
    shastricRationaleHi: "केतु रुकावट और फंसे धन का कारक है। बृहस्पति के हल्दी जल से केले के पौधे को सींचने से केतु गुरु के प्रभाव में आकर शुभ फल देने लगता है।",
  },
  Sun: {
    planet: "Sun",
    planetHi: "सूर्य",
    plantNameHi: "बेलपत्र (बिल्व) का पौधा",
    plantNameEn: "Bilva / Aegle Marmelos",
    botanicalOrTraditionalName: "Aegle marmelos",
    mediumSpecificationHi: "मिट्टी के लाल रंग के गमले में पूर्व दिशा में रखें।",
    wateringProtocolHi: "प्रतिदिन सूर्योदय के समय तांबे के लोटे से जल दें।",
    targetAilmentDebtHi: "हृदय रोग, नेत्र विकार, सरकारी जुर्माने और पिता से वैचारिक मतभेद का शमन।",
    shastricRationaleHi: "सूर्य तेज का अधिपति है। बिल्व पत्र शिव को प्रिय होकर 6ठे भाव के त्रिदोष को शांत करता है।",
  },
  Moon: {
    planet: "Moon",
    planetHi: "चंद्रमा",
    plantNameHi: "चमेली / मोगरा (श्वेत सुगन्धित पौधा)",
    plantNameEn: "Jasmine / Arabian Jasmine",
    botanicalOrTraditionalName: "Jasminum sambac",
    mediumSpecificationHi: "सफेद रंग से पुते मिट्टी के गमले में उत्तर-पश्चिम (NW) दिशा में रखें।",
    wateringProtocolHi: "संध्या समय शीतल जल से सींचें।",
    targetAilmentDebtHi: "अनिद्रा, कफ विकार, मानसिक बेचैनी और माता के स्वास्थ्य कष्टों में शांति।",
    shastricRationaleHi: "चंद्रमा जल व मन का कारक है। श्वेत सुगन्धित पुष्प 6ठे भाव के अवसाद और तनाव को सोख लेते हैं।",
  },
  Mars: {
    planet: "Mars",
    planetHi: "मंगल",
    plantNameHi: "नीम का छोटा पौधा",
    plantNameEn: "Neem Plant in Pot",
    botanicalOrTraditionalName: "Azadirachta indica",
    mediumSpecificationHi: "मिट्टी के गमले में दक्षिण या दक्षिण-पूर्व (SE) की खुली बालकनी में लगाएं।",
    wateringProtocolHi: "सप्ताह में तीन बार जल दें। मिट्टी को अधिक गीला न रखें।",
    targetAilmentDebtHi: "रक्त विकार, फोड़े-फुंसी, भयंकर मुकदमेबाजी और भाइयों से शत्रुता का अंत।",
    shastricRationaleHi: "नीम कड़वा व रक्तशोधक है। मंगल के 6ठे भाव में नीम की उपस्थिति अग्नि और विषैले रक्त दोषों का दमन करती है।",
  },
  Mercury: {
    planet: "Mercury",
    planetHi: "बुध",
    plantNameHi: "श्यामा/राम तुलसी अथवा चौड़े पत्तों वाला पौधा",
    plantNameEn: "Holy Basil (Tulsi)",
    botanicalOrTraditionalName: "Ocimum tenuiflorum",
    mediumSpecificationHi: "पारंपरिक मिट्टी के तुलसी चौबारे या गमले में उत्तर या उत्तर-पूर्व में स्थापित करें।",
    wateringProtocolHi: "प्रातःकाल स्नान के बाद ताजे जल से सिंचन करें, रविवार को जल न दें।",
    targetAilmentDebtHi: "स्नायु दुर्बलता (Nervous Weakness), त्वचा रोग, व्यापारिक साख की हानि और व्यापारिक ऋण से मुक्ति।",
    shastricRationaleHi: "बुध हरित वनस्पति का अधिष्ठाता है। तुलसी के विद्युतीय तरंगें 6ठे भाव की नकारात्मक ऊर्जा को नष्ट करती हैं।",
  },
  Jupiter: {
    planet: "Jupiter",
    planetHi: "बृहस्पति",
    plantNameHi: "अशोक वृक्ष का छोटा पौधा अथवा पीत पुष्प (कन्हेल)",
    plantNameEn: "Ashoka Tree or Yellow Tecoma",
    botanicalOrTraditionalName: "Saraca asoca / Tecoma stans",
    mediumSpecificationHi: "बड़े मिट्टी के गमले में उत्तर-पूर्व (NE) कोने में स्थापित करें।",
    wateringProtocolHi: "प्रतिदिन जल दें, गुरुवार को जल में केसर या हल्दी की एक चुटकी डालें।",
    targetAilmentDebtHi: "लिवर, पीलिया, मोटापा, ज्ञान की हानि और गुरुओं/मार्गदर्शकों से दूरी का निवारण।",
    shastricRationaleHi: "बृहस्पति जीवनदायिनी शक्ति है। पीत पुष्प 6ठे भाव में धर्म और विवेक की पुनर्स्थापना करते हैं।",
  },
  Venus: {
    planet: "Venus",
    planetHi: "शुक्र",
    plantNameHi: "सफेद गुलाब अथवा सुगंधित कामिनी",
    plantNameEn: "White Fragrant Rose / Murraya",
    botanicalOrTraditionalName: "Rosa alba / Murraya paniculata",
    mediumSpecificationHi: "सफेद मिट्टी के गमले में दक्षिण-पूर्व (SE) या आग्नेय कोण में रखें।",
    wateringProtocolHi: "सूर्यास्त के समय स्वच्छ जल से सिंचन करें।",
    targetAilmentDebtHi: "मधुमेह (डायबिटीज), गुप्त रोग, दांपत्य कलह और विलासिता के कारण उपजा कर्ज।",
    shastricRationaleHi: "शुक्र सौंदर्य व संजीवनी का अधिष्ठाता है। श्वेत सुगन्धित पुष्प 6ठे भाव की कटुता को माधुर्य में बदलते हैं।",
  },
  Saturn: {
    planet: "Saturn",
    planetHi: "शनि",
    plantNameHi: "शमी (खेजड़ी) का पौधा",
    plantNameEn: "Shami / Prosopis cineraria",
    botanicalOrTraditionalName: "Prosopis cineraria",
    mediumSpecificationHi: "मिट्टी के बड़े गमले में पश्चिम दिशा या मुख्य द्वार की बाईं ओर बाहर स्थापित करें।",
    wateringProtocolHi: "प्रतिदिन जल दें तथा शनिवार की संध्या इसके पास सरसों के तेल का दीपक प्रज्वलित करें।",
    targetAilmentDebtHi: "पुराने असाध्य वात रोग, नसों का खिंचाव, पक्षाघात, कर्मचारियों से विवाद और दीर्घावधि के कर्ज।",
    shastricRationaleHi: "शमी पत्र अग्नि-गर्भ और शनिप्रिय है। 6ठे भाव में शमी का रोपण शनि के क्रूर दंड को क्षमा और अनुशासन में बदलता है।",
  },
};

export const MASTER_8TH_HOUSE_FRUITS: Record<string, FruitDaanRemedy8th> = {
  Mars: {
    planet: "Mars",
    planetHi: "मंगल",
    fruitOrFoodHi: "8 साबुत ताजे अनार (Red Pomegranates)",
    quantityHi: "8 संख्या (सांकेतिक मंगल अंक)",
    donationVenueHi: "हनुमान मंदिर के गर्भगृह अथवा चरण कमलों में",
    timingDayHi: "शुक्ल पक्ष के किसी भी मंगलवार के दिन दोपहर 12 बजे से पूर्व",
    targetPeedaHi: "रक्तस्राव, आकस्मिक दुर्घटना, शल्य चिकित्सा (Surgeries) और पुलिस के भय को रोकता है।",
    shastricRationaleHi: "अनार मंगल का रक्त रूपी फल है। 8 अनार 8वें भाव की पीड़ा को भगवान हनुमान के चरणों में समर्पित कर संकट हरते हैं।",
  },
  Rahu: {
    planet: "Rahu",
    planetHi: "राहु",
    fruitOrFoodHi: "साबुत अनानास (Pineapple) अथवा जटा वाला पानी वाला हरा नारियल",
    quantityHi: "1 या 8 संख्या",
    donationVenueHi: "सफाई कर्मचारी को दान अथवा बहते स्वच्छ जल (नदी/नहर) में प्रवाहित",
    timingDayHi: "शनिवार या बुधवार की संध्या सूर्यास्त के समय",
    targetPeedaHi: "अचानक आर्थिक झटका, रहस्यमयी बीमारी, विषबाधा और मानसिक भ्रम से रक्षा।",
    shastricRationaleHi: "अनानास की कांटेदार त्वचा और नारियल की जटाएं राहु की तामसिक ऊर्जा का प्रतीक हैं। इसका विसर्जन 8वें भाव के तूफान को शांत करता है।",
  },
  Saturn: {
    planet: "Saturn",
    planetHi: "शनि",
    fruitOrFoodHi: "8 साबुत बादाम छिलके सहित अथवा मंदिर/गुरुद्वारे में जूता-चप्पल सफाई सेवा",
    quantityHi: "8 बादाम (छिलका न टूटा हो)",
    donationVenueHi: "शनि मंदिर, भैरव मंदिर अथवा गुरुद्वारे के जोड़ा घर में शारीरिक सेवा",
    timingDayHi: "शनिवार की संध्या गोधूलि वेला में",
    targetPeedaHi: "दीर्घकालीन असह्य दर्द, अपंगता, कानूनी सजा और मृत्युतुल्य कष्टों में जीवन रक्षा।",
    shastricRationaleHi: "बादाम शनि की कठिन तपस्या और कठोर खोल का प्रतीक है। जोड़ा घर में पैर दबाना या चप्पल साफ करना 8वें भाव के अहंकार व पीड़ा को समूल नष्ट करता है।",
  },
  Ketu: {
    planet: "Ketu",
    planetHi: "केतु",
    fruitOrFoodHi: "8 पके पीले केले अथवा काले-सफेद तिल के लड्डू",
    quantityHi: "8 केले अथवा 8 तिल के लड्डू",
    donationVenueHi: "सड़क पर विचरण करने वाले आवारा श्वान (Street Dogs) अथवा कुष्ठ रोगियों को",
    timingDayHi: "गुरुवार या रविवार के दिन प्रातःकाल",
    targetPeedaHi: "आंतों के रोग, बवासीर, पैरों की नसें ब्लॉक होना और अचानक धोखा मिलने की पीड़ा का शमन।",
    shastricRationaleHi: "केतु की शांति श्वान (कुत्ते) की सेवा और पीले फल के अर्पण से होती है। यह 8वें भाव के अदृश्य बंधनों को काटता है।",
  },
  Sun: {
    planet: "Sun",
    planetHi: "सूर्य",
    fruitOrFoodHi: "गेहूं के आटे के 8 पेड़े और देसी गुड़",
    quantityHi: "1.25 किलोग्राम गुड़ व गेहूं",
    donationVenueHi: "देसी लाल या कपिला गाय को अपने हाथ से खिलाएं",
    timingDayHi: "रविवार के दिन सूर्योदय के तुरंत बाद",
    targetPeedaHi: "मान-प्रतिष्ठा का अचानक पतन, पिता का स्वास्थ्य संकट और हृदय आघात से बचाव।",
    shastricRationaleHi: "गेहूं और गुड़ सूर्य का मूल सात्विक भोजन है। गाय को खिलाने से 8वें भाव में बैठा सूर्य प्राणदायिनी शक्ति में रूपांतरित होता है।",
  },
  Moon: {
    planet: "Moon",
    planetHi: "चंद्रमा",
    fruitOrFoodHi: "चावल-दूध की खीर अथवा सरकारी अस्पताल के बाहर शीतल पेयजल वितरण",
    quantityHi: "यथासंभव (न्यूनतम 8 व्यक्तियों को)",
    donationVenueHi: "अस्पताल के बाहर प्रतीक्षारत निर्धन तीमारदारों या प्यासे यात्रियों को",
    timingDayHi: "सोमवार की रात्रि अथवा पूर्णिमा के दिन",
    targetPeedaHi: "पानी में डूबने का भय, गंभीर डिप्रेशन, आत्मघाती विचार और फेफड़ों के संक्रमण से रक्षा।",
    shastricRationaleHi: "दूध और जल चंद्रमा का अमृत तत्व है। आर्त और पीड़ित जनों को जल-दूध पिलाने से 8वें भाव का विष अमृत बन जाता है।",
  },
  Mercury: {
    planet: "Mercury",
    planetHi: "बुध",
    fruitOrFoodHi: "रात भर पानी में भीगी हुई साबुत हरी मूंग की दाल",
    quantityHi: "8 मुट्ठी अथवा 1.25 किलोग्राम",
    donationVenueHi: "खुले स्थान पर कबूतरों, तोतों व अन्य पक्षियों को चुगाएं",
    timingDayHi: "बुधवार के दिन सूर्योदय के समय",
    targetPeedaHi: "वाणी की हकलाहट, नसों की अचानक ऐंठन, व्यावसायिक दिवालियापन और नर्वस ब्रेकडाउन से बचाव।",
    shastricRationaleHi: "पक्षी बुध का प्रतीक हैं। भीगी हरी मूंग पक्षियों को अर्पित करने से 8वें भाव का बुध बुद्धि और वाणी को संरक्षित करता है।",
  },
  Jupiter: {
    planet: "Jupiter",
    planetHi: "बृहस्पति",
    fruitOrFoodHi: "8 पीले बेसन/बूंदी के लड्डू अथवा 1.25 किलो चने की दाल",
    quantityHi: "8 लड्डू अथवा सवा किलो दाल",
    donationVenueHi: "किसी वृद्ध मंदिर पुजारी, वेदपाठी ब्राह्मण अथवा अनाथालय के बालकों को",
    timingDayHi: "गुरुवार के दिन प्रातः 8 से 11 बजे के मध्य",
    targetPeedaHi: "संतान हानि, कुल का कलंक, लिवर विफलता और ज्ञान के अहंकार से उत्पन्न सर्वनाश से बचाव।",
    shastricRationaleHi: "पीला अन्न गुरु की कृपा का वाहक है। पूज्य जनों को अन्न तृप्त करने से 8वें भाव का गुरु अकाल मृत्यु से रक्षा करता है।",
  },
  Venus: {
    planet: "Venus",
    planetHi: "शुक्र",
    fruitOrFoodHi: "मीठा ताजा दही, मिश्री व सफेद रसगुल्ले",
    quantityHi: "8 कन्याओं को अथवा 1.25 किलो",
    donationVenueHi: "8 वर्ष से छोटी कन्याओं को पूजकर अथवा विधवा आश्रम में",
    timingDayHi: "शुक्रवार के दिन दोपहर से पूर्व",
    targetPeedaHi: "यौन विकार, गर्भाशय रोग, वैवाहिक जीवन का आकस्मिक टूटना और विलासिता में पतन से रक्षा।",
    shastricRationaleHi: "श्वेत मिष्ठान और कन्या पूजन शुक्र की दैवीय संजीवनी शक्ति को जाग्रत कर 8वें भाव की पीड़ा को हरता है।",
  },
};

export const MASTER_12TH_HOUSE_VOLUNTARY_TITHES: Record<string, VoluntaryTithe12th> = {
  Jupiter: {
    planet: "Jupiter",
    planetHi: "बृहस्पति",
    voluntaryActionHi: "धार्मिक व आध्यात्मिक पुस्तकों का क्रय कर पुस्तकालयों/विद्यार्थियों में वितरण अथवा स्वेच्छा से तीर्थ यात्रा का व्यय उठाना।",
    preventedInvoluntaryDrainHi: "अस्पताल में आईसीयू के भारी भरकम बिल और कोर्ट-कचहरी में वकीलों की मनमानी फीस से बचाव।",
    recommendedBudgetOrItemHi: "प्रतिमाह अपनी आय का 2% भाग निर्धन छात्रों की शिक्षा व वेद पाठशालाओं में दें।",
    targetRecipientHi: "गुरुकुल, वेदपाठी छात्र, आध्यात्मिक पुस्तकालय।",
    kpPrincipleHi: "12वां भाव व्यय का है। यदि आप गुरु के कारक (ज्ञान, धर्म, तीर्थ) पर स्वेच्छा से खर्च नहीं करेंगे, तो गुरु अस्वस्थता पर बाध्यकारी खर्च कराएगा।",
  },
  Mars: {
    planet: "Mars",
    planetHi: "मंगल",
    voluntaryActionHi: "नियमित जिम सदस्यता (Gym Subscription), कराटे/मार्शल आर्ट प्रशिक्षण, नया टूलकिट/औजार खरीदना अथवा स्वैच्छिक रक्तदान।",
    preventedInvoluntaryDrainHi: "अचानक वाहन दुर्घटना, फ्रैक्चर, पुलिस चालान और आपातकालीन शल्य चिकित्सा (Surgeries) के व्यय से मुक्ति।",
    recommendedBudgetOrItemHi: "वर्ष में 2 बार रक्तदान करें तथा अपने स्वास्थ्य एवं फिटनेस उपकरणों पर व्यय करें।",
    targetRecipientHi: "रेड क्रॉस ब्लड बैंक, फिटनेस कोच, तकनीकी वर्कशॉप।",
    kpPrincipleHi: "मंगल रक्त और शल्य का कारक है। यदि रक्त स्वेच्छा से दान में नहीं बहेगा, तो 12वां भाव चोट या सर्जरी में रक्त और धन दोनों बहा देगा।",
  },
  Mercury: {
    planet: "Mercury",
    planetHi: "बुध",
    voluntaryActionHi: "अनाथ बालकों के लिए स्कूल की किताबें, कॉपियां, स्टेशनरी किट्स खरीदना अथवा बिज़नेस अकाउंटिंग व सॉफ्टवेयर टूल्स का लाइसेंस लेना।",
    preventedInvoluntaryDrainHi: "ऑनलाइन फ्रॉड, चेक बाउंस के जुर्माने, खराब गैजेट्स की मरम्मत और झूठे व्यापारिक दावों से बचाव।",
    recommendedBudgetOrItemHi: "स्टेशनरी किट्स, अकाउंटिंग सॉफ्टवेयर अपग्रेड, डाक/कूरियर सेवा में व्यय।",
    targetRecipientHi: "सरकारी प्राथमिक विद्यालय के निर्धन बच्चे, अनाथालय।",
    kpPrincipleHi: "बुध व्यापार व लेखनी है। यदि बौद्धिक उपकरणों व बच्चों की शिक्षा पर व्यय नहीं हुआ, तो 12वां भाव व्यापारिक नुकसान के रूप में धन निकाल लेगा।",
  },
  Venus: {
    planet: "Venus",
    planetHi: "शुक्र",
    voluntaryActionHi: "अपनी धर्मपत्नी/जीवनसाथी के लिए प्राकृतिक इत्र (Perfume), सुंदर वस्त्र, आभूषण खरीदना अथवा निराश्रित महिलाओं के आश्रम में वस्त्र दान।",
    preventedInvoluntaryDrainHi: "होटलों में अप्रत्याशित विवाद, ऐशो-आराम में धोखा, गुप्त रोगों के महंगे इलाज और वैवाहिक मुकदमेबाजी से बचाव।",
    recommendedBudgetOrItemHi: "मासिक बजट में जीवनसाथी के उपहार और महिला सशक्तिकरण हेतु दान शामिल करें।",
    targetRecipientHi: "धर्मपत्नी, महिला आश्रय गृह, निराश्रित विधवाएं।",
    kpPrincipleHi: "शुक्र भोग व पत्नी का कारक है। गृहलक्ष्मी को प्रसन्न रखने में हुआ व्यय 12वें भाव के विनाशकारी विलासिता व्यय को रोक देता है।",
  },
  Saturn: {
    planet: "Saturn",
    planetHi: "शनि",
    voluntaryActionHi: "निःशुल्क डिस्पेंसरी में दवाइयां दान करना, दिव्यांगों को व्हीलचेयर/कृत्रिम अंग उपलब्ध कराना अथवा वृद्ध कर्मचारियों को अग्रिम बोनस देना।",
    preventedInvoluntaryDrainHi: "लंबी क्रोनिक बीमारियों के डॉक्टर बिल, कर्मचारियों द्वारा की गई चोरी और लेबर कोर्ट के मुकदमों से मुक्ति।",
    recommendedBudgetOrItemHi: "महीने में एक बार गरीब मरीजों की दवाइयों की पर्ची का भुगतान करें।",
    targetRecipientHi: "चैरिटेबल औषधालय, कुष्ठ आश्रम, दिव्यांग सेवा केंद्र।",
    kpPrincipleHi: "शनि रोग व सेवक का कारक है। यदि सेवकों व निर्धन रोगियों पर करुणावश धन नहीं खर्च किया, तो 12वां भाव खुद की दवाओं पर धन उड़वा देगा।",
  },
  Rahu: {
    planet: "Rahu",
    planetHi: "राहु",
    voluntaryActionHi: "पुराने अनुपयोगी इलेक्ट्रॉनिक्स (ई-कचरा) को रीसायकल करना, नशामुक्ति केंद्रों (Rehab Centers) में दान देना अथवा अज्ञात तीर्थयात्रियों की सेवा।",
    preventedInvoluntaryDrainHi: "साइबर फ्रॉड, अज्ञात ऑनलाइन नुकसान, पुलिस की झूठी शिकायत और विदेशी यात्रा में पासपोर्ट/वीजा पेनल्टी से बचाव।",
    recommendedBudgetOrItemHi: "इलेक्ट्रॉनिक गैजेट्स की समय पर मरम्मत, नशामुक्ति एनजीओ को गुप्त दान।",
    targetRecipientHi: "नशामुक्ति केंद्र, बेघर रैन बसेरा।",
    kpPrincipleHi: "राहु भ्रम व विदेशी संपर्कों का कारक है। अज्ञात जरूरतमंदों को चुपचाप दिया गया दान 12वें भाव के राहु जनित भयंकर धोखों को समाप्त करता है।",
  },
  Ketu: {
    planet: "Ketu",
    planetHi: "केतु",
    voluntaryActionHi: "संन्यासियों, संतों और ध्यान आश्रमों को ऊनी कंबल दान करना अथवा आध्यात्मिक विपश्यना ध्यान शिविर का शुल्क स्वयं वहन करना।",
    preventedInvoluntaryDrainHi: "अस्पताल में अज्ञात डायग्नोसिस (जहां बीमारी पकड़ में न आए), यूरिनरी ट्रैक्ट सर्जरी और अचानक एकांत कारावास जैसे हालात से बचाव।",
    recommendedBudgetOrItemHi: "सर्दियों में गर्म कंबल दान, ध्यान शिविर का पंजीकरण।",
    targetRecipientHi: "साधु-संत, कुष्ठ रोगी, एकांत आश्रम।",
    kpPrincipleHi: "केतु मोक्ष और त्याग है। स्वेच्छा से ध्यान व संन्यासियों पर खर्च करने से 12वें भाव का केतु आत्मिक जागरण और दिव्य सुरक्षा प्रदान करता है।",
  },
  Sun: {
    planet: "Sun",
    planetHi: "सूर्य",
    voluntaryActionHi: "सरकार के सभी कर (Income Tax, Property Tax) समय से पूर्व पूरी ईमानदारी से चुकाना अथवा सरकारी चिकित्सा राहत कोष में दान।",
    preventedInvoluntaryDrainHi: "आयकर विभाग के छापे, सरकारी पेनल्टी, चालान और मानहानि के मुकदमों के खर्च से पूर्ण सुरक्षा।",
    recommendedBudgetOrItemHi: "सख्त वित्तीय अनुशासन, सरकारी टैक्स भुगतान, प्रधानमंत्री/मुख्यमंत्री राहत कोष में दान।",
    targetRecipientHi: "राजकीय कोष, सरकारी अस्पताल।",
    kpPrincipleHi: "सूर्य राजा व सरकार है। राजा का कर स्वेच्छा से देने पर 12वें भाव का सूर्य कभी भी कानूनी दंड या अपमानित खर्च नहीं होने देता।",
  },
  Moon: {
    planet: "Moon",
    planetHi: "चंद्रमा",
    voluntaryActionHi: "सार्वजनिक चिकित्सालयों अथवा श्मशान घाटों पर शुद्ध वाटर कूलर/प्याऊ लगवाना अथवा मानसिक रोगियों के अस्पताल में दूध-फल का वितरण।",
    preventedInvoluntaryDrainHi: "माता के निरंतर गिरते स्वास्थ्य पर अस्पताल के खर्च, मानसिक अवसाद की महंगी थेरेपी और जल रिसाव से होने वाले नुकसान से मुक्ति।",
    recommendedBudgetOrItemHi: "प्याऊ स्थापना, मानसिक स्वास्थ्य केंद्रों में जल-दुग्ध सेवा।",
    targetRecipientHi: "मानसिक आरोग्यशाला, सार्वजनिक प्याऊ।",
    kpPrincipleHi: "चंद्रमा जल व मातृत्व है। जलदान और जनसेवा करने पर 12वें भाव का चंद्रमा मानसिक शांति और धन का अक्षय प्रवाह देता है।",
  },
};

/**
 * Returns complete Trika Bhava Remedy Analysis
 */
export function getTrikaBhavaRemedyAnalysis(chartInfo?: {
  house6Planet?: string;
  house8Planet?: string;
  house12Planet?: string;
}): TrikaBhavaAnalysis {
  const h6 = chartInfo?.house6Planet || "Ketu";
  const h8 = chartInfo?.house8Planet || "Mars";
  const h12 = chartInfo?.house12Planet || "Jupiter";

  return {
    house6PlantRemedies: Object.values(MASTER_6TH_HOUSE_PLANTS),
    house8FruitRemedies: Object.values(MASTER_8TH_HOUSE_FRUITS),
    house12VoluntaryTithes: Object.values(MASTER_12TH_HOUSE_VOLUNTARY_TITHES),
    chartSpecificPrescription: {
      house6Planet: h6,
      house8Planet: h8,
      house12Planet: h12,
      activePlantRemedy: MASTER_6TH_HOUSE_PLANTS[h6] || MASTER_6TH_HOUSE_PLANTS["Ketu"],
      activeFruitRemedy: MASTER_8TH_HOUSE_FRUITS[h8] || MASTER_8TH_HOUSE_FRUITS["Mars"],
      activeTitheRemedy: MASTER_12TH_HOUSE_VOLUNTARY_TITHES[h12] || MASTER_12TH_HOUSE_VOLUNTARY_TITHES["Jupiter"],
    },
  };
}
