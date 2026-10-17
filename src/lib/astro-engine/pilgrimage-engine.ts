// src/lib/astro-engine/pilgrimage-engine.ts
// ============================================================
// ASTROLIFE 12 JYOTIRLINGA PILGRIMAGE & DEVASTHANA ENGINE
// Maps the 12 Divine Jyotirlingas to the 12 Rashis, Houses, Planetary Afflictions,
// Biological Pathologies, 40-Day Energy Assimilation, and Karmic Knot Dissolution.
// Based strictly on classical Puranic authorities, Jaimini Upadesha Sutras,
// and sacred Nadi astrological traditions.
// ============================================================

import type { ChartData } from "./calculations";

export interface JyotirlingaProfile {
  id: string;
  name: string;
  hindiTitle: string;
  rashiNum: number;                 // 0 = Aries, 1 = Taurus ... 11 = Pisces
  rashiName: string;
  naturalHouse: number;             // 1 to 12
  governingPlanets: string[];
  location: string;
  deityForm: string;
  lifeCrisisTrigger: string;        // Specific crisis that calls the native here
  karmicKnotDissolved: string;      // What fundamental karmic block is dissolved
  anatomicalPathology: string;      // Physical organ and medical vulnerability
  sacredOffering: string;           // Physical materials to offer at the sanctum
  assimilationWindowDays: number;   // Standard = 40 days (one mandala cycle)
  assimilationGuidance: string;     // Why the body sleeps/purges post-pilgrimage
  beejMantra: string;
  healingFrequencyHz: number;
  ragaResonance: string[];
  historicalLore: string;
}

export const JYOTIRLINGA_REGISTRY: Record<string, JyotirlingaProfile> = {
  rameshwaram: {
    id: "rameshwaram",
    name: "Rameshwaram",
    hindiTitle: "श्री रामेश्वरम् (रामनाथ स्वामी)",
    rashiNum: 0,
    rashiName: "Aries (मेष)",
    naturalHouse: 1,
    governingPlanets: ["Sun", "Mars"],
    location: "Rameswaram Island, Tamil Nadu (Setubandha)",
    deityForm: "श्री रामेश्वर लिंग (भगवान श्रीराम द्वारा बालू से स्थापित)",
    lifeCrisisTrigger: "जीवन का पूर्ण गतिरोध (Totally Stuck), मार्ग बंद होना, चारों तरफ से हाथ-पैर बंधना (शनि-केतु का पाश), असाध्य शत्रुओं से घेराबंदी।",
    karmicKnotDissolved: "भगवान श्रीराम जब समुद्र तट पर पहुंचे तो आगे अथाह सागर था—पूर्ण गतिरोध! उन्होंने बालू से शिव की स्थापना की और असंभव समुद्र पर 'सेतुबंध' (पुल) बन गया। यह तीर्थ जीवन के असंभव बंधनों को काटकर आगे बढ़ने का पुल बनाता है।",
    anatomicalPathology: "मस्तिष्क आघात, पक्षाघात (Paralysis), सिर की पुरानी चोटें, जीवन ऊर्जा का संकुचन।",
    sacredOffering: "22 पवित्र कुंडों का स्नान, गंगाजल अभिषेक, दर्भ (कुशा घास), तिल मिश्रित अक्षत।",
    assimilationWindowDays: 40,
    assimilationGuidance: "रामेश्वरम के 22 कुंडों का जल 22 प्रकार के शारीरिक-कार्मिक विषों को निकालता है। लौटने के बाद 40 दिनों तक व्यक्ति को गहरी नींद, मांसपेशियों में हल्का खिंचाव आ सकता है; यह ऊर्जा रीबूट का लक्षण है।",
    beejMantra: "ॐ ह्रीं रामेश्वराय नमः",
    healingFrequencyHz: 528,
    ragaResonance: ["Hamsadhwani", "Bilawal"],
    historicalLore: "ब्रह्महत्या दोष और रावण वध के पश्चात कर्म-मुक्ति हेतु भगवान राम ने अगस्त्य मुनि के आदेश पर बालू से इस ज्योतिर्लिंग का निर्माण किया था।"
  },

  somnath: {
    id: "somnath",
    name: "Somnath",
    hindiTitle: "श्री सोमनाथ (प्रभास तीर्थ)",
    rashiNum: 1,
    rashiName: "Taurus (वृषभ)",
    naturalHouse: 2,
    governingPlanets: ["Moon", "Venus"],
    location: "Prabhas Patan, Saurashtra, Gujarat",
    deityForm: "श्री सोमनाथ (चंद्रमा के कष्ट-हर्ता)",
    lifeCrisisTrigger: "मानसिक अवसाद (Clinical Depression), संचित धन का विनाश, पारिवारिक प्रतिष्ठा का पतन, चेहरे व वाणी पर तेजहीनता।",
    karmicKnotDissolved: "प्रजापति दक्ष के शाप से चंद्रमा को क्षय रोग (Tuberculosis/Decay) हो गया था और उनका तेज समाप्त हो रहा था। सोमनाथ में शिव की आराधना से चंद्रमा का रूप और अमृत पुनः लौट आया। यह तीर्थ खोई हुई लक्ष्मी और मानसिक शांति वापस दिलाता है।",
    anatomicalPathology: "गंभीर अवसाद, अनिद्रा, हार्मोनल असंतुलन, फेफड़ों का क्षय (TB), मुख व नेत्र रोग।",
    sacredOffering: "कच्चा गाय का दूध, मिश्री, सफेद चंदन, शुद्ध घी का अखंड दीपक, पंचामृत।",
    assimilationWindowDays: 40,
    assimilationGuidance: "चंद्रमा मन का कारक है। सोमनाथ दर्शन के बाद 40 दिन तक मन अत्यंत संवेदनशील रहता है; इस दौरान शांत वातावरण में रहें और एकांत साधना करें।",
    beejMantra: "ॐ श्रां श्रीं श्रौं सः चंद्रमसे नमः / ॐ सोमनाथाय नमः",
    healingFrequencyHz: 432,
    ragaResonance: ["Bageshri", "Bhoopali"],
    historicalLore: "द्वादश ज्योतिर्लिंगों में प्रथम। चंद्रमा ने यहाँ त्रिवेणी संगम (हिरण, कपिला, सरस्वती) पर तपस्या कर अमरत्व प्राप्त किया था।"
  },

  nageshwar: {
    id: "nageshwar",
    name: "Nageshwar",
    hindiTitle: "श्री नागेश्वर (दारुकावन)",
    rashiNum: 2,
    rashiName: "Gemini (मिथुन)",
    naturalHouse: 3,
    governingPlanets: ["Mercury", "Rahu"],
    location: "Near Dwarka, Gujarat",
    deityForm: "श्री नागेश्वर (नागों व विष के अधिपति)",
    lifeCrisisTrigger: "जहरीले संबंध, षड्यंत्रकारी रिश्तेदार, कानूनी छल-कपट, वाणी विकार (हकलाना/Stuttering), तंत्र-बाधा या विष का डर।",
    karmicKnotDissolved: "दारुका राक्षसी और उसके विषैले राक्षसों के चंगुल से सुप्रिय नामक वैश्य शिव-नाम के जप से मुक्त हुआ था। यह तीर्थ वाणी, स्नायु तंत्र (Nerves) और जहरीले बंधनों के विष को अमृत में बदलता है।",
    anatomicalPathology: "त्वचा के असाध्य रोग (Psoriasis), नसों का खिंचाव, हकलाहट, फेफड़ों की एलर्जी।",
    sacredOffering: "तांबे का नाग-नागिन जोड़ा, दूर्वा, कच्चा दूध, भस्म, बिल्वपत्र।",
    assimilationWindowDays: 40,
    assimilationGuidance: "राहु और बुध का विष कटने पर त्वचा में हल्की खुजली या पसीना आ सकता है; 40 दिनों तक शुद्ध सात्विक और ताज़ा भोजन ही ग्रहण करें।",
    beejMantra: "ॐ नागेश्वराय नमः / ॐ क्रीं नमः शिवाय",
    healingFrequencyHz: 432,
    ragaResonance: ["Megh", "Malkauns"],
    historicalLore: "रुद्र संहिता के अनुसार दारुकावन के समस्त विषधरों को भगवान शिव ने अपने कंठ और देह पर आभूषण रूप में धारण कर अभय प्रदान किया।"
  },

  omkareshwar: {
    id: "omkareshwar",
    name: "Omkareshwar",
    hindiTitle: "श्री ओंकारेश्वर एवं ममलेश्वर (मांधाता द्वीप)",
    rashiNum: 3,
    rashiName: "Cancer (कर्क)",
    naturalHouse: 4,
    governingPlanets: ["Jupiter", "Moon"],
    location: "Mandhata Island, Narmada River, Madhya Pradesh",
    deityForm: "श्री ओंकारेश्वर (प्रणव स्वरूप) व अमलेश्वर (मल-रहित)",
    lifeCrisisTrigger: "छठे भाव का गुरु (Jupiter in 6th), फैटी लिवर, पुरोहित या कन्यादान का अनपेक्षित ऋण, ज्ञान का दंभ, घर में आंतरिक शांति का अभाव।",
    karmicKnotDissolved: "राजा मांधाता और विंध्याचल के अहंकार व क्षय को शिव ने शांत किया। 'अमलेश्वर' का अर्थ है 'मल-रहित' (Toxin-free); यह तीर्थ 6th भाव के गुरु द्वारा जनित लिवर के मेटाबॉलिक विष और आध्यात्मिक दंभ दोनों को शून्य करता है।",
    anatomicalPathology: "फैटी लिवर, पीलिया (Jaundice), पित्ताशय विकार, इंसुलिन रेजिस्टेंस, जठराग्नि मंद होना।",
    sacredOffering: "नर्मदा जल से अभिषेक, शुद्ध देसी घी, केसर, चने की दाल, पीले पुष्प, ॐकार जप।",
    assimilationWindowDays: 40,
    assimilationGuidance: "लिवर और आंतों का डिटॉक्स शुरू होता है। दर्शन के बाद 40 दिन तक गरिष्ठ, तला-भुना और बाजारू भोजन पूर्णतः वर्जित रखें; केवल सुपाच्य सात्विक आहार लें।",
    beejMantra: "ॐ ॐकाराय नमः / ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    healingFrequencyHz: 528,
    ragaResonance: ["Yaman", "Bhairav"],
    historicalLore: "नर्मदा नदी यहाँ द्वीप के चारों ओर बहकर साक्षात 'ॐ' का आकार बनाती है। यहाँ शिव प्रणव नाद के रूप में निरंतर जाग्रत हैं।"
  },

  mahakaleshwar: {
    id: "mahakaleshwar",
    name: "Mahakaleshwar",
    hindiTitle: "श्री महाकालेश्वर (अवंतिका / उज्जैन)",
    rashiNum: 4,
    rashiName: "Leo (सिंह)",
    naturalHouse: 5,
    governingPlanets: ["Sun", "Mars"],
    location: "Ujjain, Madhya Pradesh (Shipra River)",
    deityForm: "श्री महाकाल (दक्षिणमुखी काल-नियंता)",
    lifeCrisisTrigger: "अकाल मृत्यु का भय, अचानक सत्ता/पद से निष्कासन, पिता से भीषण कटुता, गंभीर ईगो-टकराव, मान-सम्मान का विनाश।",
    karmicKnotDissolved: "दूषण नामक राक्षस जो अवंतिका के संतों पर अत्याचार कर रहा था, भगवान शिव ने हुंकार भर उसे भस्म कर दिया। यह पृथ्वी का नाभि-केंद्र और काल की शून्य-रेखा है; यहाँ आने पर अकाल मृत्यु और समय का चक्र अनुकूल हो जाता है।",
    anatomicalPathology: "हृदय विकार (Cardiac Issues), मेरुदंड (Spine) की गंभीर व्याधि, अस्थि मज्जा रोग।",
    sacredOffering: "भस्म आरती दर्शन, गन्ने का रस, धतूरा, आक के पुष्प, भांग का श्रृंगार।",
    assimilationWindowDays: 40,
    assimilationGuidance: "महाकाल की प्रचंड अग्नि-ऊर्जा को पचाने के लिए 40 दिनों तक क्रोध, अहंकार और कटु वाणी पर पूर्ण अंकुश रखना आवश्यक है।",
    beejMantra: "ॐ जूं सः पालय पालय सः जूं ॐ",
    healingFrequencyHz: 639,
    ragaResonance: ["Bhairav", "Darbari"],
    historicalLore: "द्वादश ज्योतिर्लिंगों में एकमात्र दक्षिणमुखी लिंग। काल और मृत्यु जिनके सम्मुख नतमस्तक हैं, वे ही महाकालेश्वर हैं।"
  },

  mallikarjuna: {
    id: "mallikarjuna",
    name: "Mallikarjuna",
    hindiTitle: "श्री मल्लिकार्जुन (श्रीशैल पर्वत)",
    rashiNum: 5,
    rashiName: "Virgo (कन्या)",
    naturalHouse: 6,
    governingPlanets: ["Mercury", "Ketu"],
    location: "Srisailam, Andhra Pradesh (Krishna River)",
    deityForm: "मल्लिका (पार्वती) व अर्जुन (शिव)",
    lifeCrisisTrigger: "पुराने असाध्य कर्जे, अनसुलझे कोर्ट केस, संतान/परिवार से विछोह (कार्तिकेय का वैराग्य), गहरी मानसिक उदासी व अलगाव।",
    karmicKnotDissolved: "भगवान कार्तिकेय जब रुष्ट होकर क्रौंच पर्वत पर चले गए, तो माता पार्वती और शिव पुत्र के प्रेम में यहाँ आकर ज्योति रूप में स्थित हुए। यह तीर्थ परिवार के बिछड़े सदस्यों को मिलाता है और पुराने कर्जों को मिटाता है।",
    anatomicalPathology: "आंतों के अल्सर (Colitis), आंतों की सुस्ती, पुरानी एलर्जी, नर्वस ब्रेकडाउन।",
    sacredOffering: "मल्लिका (चमेली) के पुष्प, शुद्ध जल, बेलपत्र, मूंग दाल की खिचड़ी का भोग।",
    assimilationWindowDays: 40,
    assimilationGuidance: "40 दिनों तक किसी से विवाद या कोर्ट कचहरी में तीखी प्रतिक्रिया न दें; मन को शांत रखकर सेवा भाव में रहें।",
    beejMantra: "ॐ मल्लिकार्जुनाय नमः / ॐ गं गणपतये नमः",
    healingFrequencyHz: 432,
    ragaResonance: ["Bhimpalasi", "Kalyani"],
    historicalLore: "यह शक्तिपीठ और ज्योतिर्लिंग का दुर्लभ संगम है। यहाँ भ्रमराम्बा देवी साक्षात विराजमान हैं।"
  },

  ghushmeshwar: {
    id: "ghushmeshwar",
    name: "Ghushmeshwar",
    hindiTitle: "श्री घृष्णेश्वर (वेरुल / एलोरा)",
    rashiNum: 6,
    rashiName: "Libra (तुला)",
    naturalHouse: 7,
    governingPlanets: ["Venus", "Saturn"],
    location: "Verul / Ellora, Maharashtra",
    deityForm: "श्री घृष्णेश्वर (भक्त घुष्मा के उद्धारक)",
    lifeCrisisTrigger: "संतानहीनता (पुत्र/पुत्री प्राप्ति में रोड़ा), सौतन या तीसरे व्यक्ति द्वारा दांपत्य में विष घोलना, पार्टनर का धोखा, गर्भाशय विकार।",
    karmicKnotDissolved: "सती घुष्मा के मृत पुत्र को शिव ने उसकी अटूट भक्ति देखकर सरोवर से जीवित निकाल दिया। यह तीर्थ असंभव संतान बाधा और दांपत्य जीवन के हर विषैले षड्यंत्र को जीवनदान में बदलता है।",
    anatomicalPathology: "गर्भाशय विकार, फैलोपियन ट्यूब ब्लॉकेज, किडनी स्टोन, स्पर्म/ओवा की कमजोरी।",
    sacredOffering: "सरोवर में 101 पार्थिव शिवलिंग बनाकर विसर्जन, इत्र (गुलाब/चंदन), सफेद रेशमी वस्त्र, खीर का भोग।",
    assimilationWindowDays: 40,
    assimilationGuidance: "प्रजनन और दांपत्य की ऊर्जा जागृत होती है। 40 दिन तक पति-पत्नी एक-दूसरे के प्रति पूर्ण निष्ठावान और मधुर वाणी में रहें।",
    beejMantra: "ॐ घृष्णेश्वराय नमः / ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    healingFrequencyHz: 528,
    ragaResonance: ["Kafi", "Khamaj"],
    historicalLore: "द्वादश ज्योतिर्लिंगों में अंतिम लिंग। यहाँ शिव ने वरदान दिया कि जो घुष्मा की तरह निष्काम पूजा करेगा, उसकी वंश-वृद्धि अवश्य होगी।"
  },

  baidyanath: {
    id: "baidyanath",
    name: "Baidyanath",
    hindiTitle: "श्री वैद्यनाथ (देवघर / चिताभूमि)",
    rashiNum: 7,
    rashiName: "Scorpio (वृश्चिक)",
    naturalHouse: 8,
    governingPlanets: ["Mars", "Ketu"],
    location: "Deoghar, Santhal Parganas, Jharkhand",
    deityForm: "श्री वैद्यनाथ (संसार के परम चिकित्सक)",
    lifeCrisisTrigger: "असाध्य व रहस्यमयी बीमारियां (कैंसर, ट्यूमर, ब्लड इन्फेक्शन), जहर का असर, तांत्रिक मारण-बाधा, बार-बार सर्जरी का योग।",
    karmicKnotDissolved: "रावण ने अपने नौ सिर काटकर शिव को अर्पित किए थे; भगवान शिव ने वैद्य (सर्जन) बनकर उसके कटे सिर पुनः जोड़ दिए और आरोग्य दिया। यह तीर्थ मृत्यु के मुख से जीवन खींच लाता है।",
    anatomicalPathology: "कैंसर, फिस्टुला, ऑटो-इम्यून विकार, रक्त विषाक्तता, सर्जिकल जटिलताएं।",
    sacredOffering: "सुल्तानगंज से उत्तरवाहिनी गंगाजल की कांवड़, पंचामृत, भांग, पेड़ा, महामृत्युंजय मंत्र जप।",
    assimilationWindowDays: 40,
    assimilationGuidance: "यह 'चिताभूमि' है जहाँ शिव स्वयं वैद्य हैं। दर्शन के बाद शरीर के टॉक्सिन्स तेजी से निकलते हैं; 40 दिन तक विश्राम और औषधियों के साथ शिव-ध्यान करें।",
    beejMantra: "ॐ त्र्यंबकं यजामहे सुगन्धिं पुष्टिवर्धनम् / ॐ वैद्यनाथाय नमः",
    healingFrequencyHz: 741,
    ragaResonance: ["Bhairavi", "Todi"],
    historicalLore: "यहाँ रावणेश्वर महादेव के रूप में भी प्रतिष्ठा है। पास ही माँ पार्वती का मंदिर है, जहाँ गठबंधन बांधने की प्राचीन परंपरा है।"
  },

  kashi_vishwanath: {
    id: "kashi_vishwanath",
    name: "Kashi Vishwanath",
    hindiTitle: "श्री काशी विश्वनाथ (आनंदवन / वाराणसी)",
    rashiNum: 8,
    rashiName: "Sagittarius (धनु)",
    naturalHouse: 9,
    governingPlanets: ["Jupiter", "Sun"],
    location: "Varanasi, Uttar Pradesh (Ganga River)",
    deityForm: "श्री विश्वेश्वर (त्रैलोक्य के स्वामी)",
    lifeCrisisTrigger: "भाग्य का ताला लगना, गुरु-शाप, उच्च ज्ञान व धर्म में भ्रम, पितृ असंतोष, आध्यात्मिक अंधकार।",
    karmicKnotDissolved: "काशी शिव के त्रिशूल पर बसी है, प्रलय में भी इसका नाश नहीं होता। यहाँ शिव स्वयं मृत्यु के समय तारक मंत्र देकर जीव को मुक्त करते हैं। यह तीर्थ प्रारब्ध के सबसे भारी कर्म-बंधनों को जलाकर भस्म कर देता है।",
    anatomicalPathology: "आर्टरीज में ब्लॉकेज, लिवर सिरोसिस, जांघों व कूल्हों के गंभीर रोग।",
    sacredOffering: "गंगाजल, बेलपत्र, श्वेत-पीत चंदन, रुद्राक्ष माला, गरीबों को अन्नदान (मणिकर्णिका या अन्नपूर्णा क्षेत्र)।",
    assimilationWindowDays: 40,
    assimilationGuidance: "अहंकार की राख बनती है। 40 दिनों तक सत्य, स्वाध्याय और ब्रह्मचर्य का पालन करें; मन में गहरा वैराग्य व शांति आएगी।",
    beejMantra: "ॐ नमः शिवाय / ॐ विरूपाक्षाय नमः",
    healingFrequencyHz: 852,
    ragaResonance: ["Yaman", "Bhoopali"],
    historicalLore: "आनंदवन की भूमि जहाँ भगवान शिव और माता पार्वती का नित्य निवास माना जाता है।"
  },

  bhimashankar: {
    id: "bhimashankar",
    name: "Bhimashankar",
    hindiTitle: "श्री भीमाशंकर (डाकिनी क्षेत्र)",
    rashiNum: 9,
    rashiName: "Capricorn (मकर)",
    naturalHouse: 10,
    governingPlanets: ["Saturn", "Mars"],
    location: "Bhavagiri, Khed, Maharashtra (Bhima River Source)",
    deityForm: "श्री भीमाशंकर (भीमासुर का वध करने वाले)",
    lifeCrisisTrigger: "करियर में असहनीय मानसिक व शारीरिक शोषण, क्रूर बॉस/अधिकारी, झूठे मुकदमों में फंसाया जाना, हड्डी व जोड़ों का पक्षाघात।",
    karmicKnotDissolved: "कुंभकर्ण के पुत्र भीमासुर ने कामरूप के राजा प्रियधर्मन को बंदी बनाकर शिवभक्ति रोकने की कोशिश की थी। शिव ने हुंकार से भीमासुर को जलाकर राख किया। यह तीर्थ करियर में अत्याचारी शक्तियों को ध्वस्त कर अधिकार दिलाता है।",
    anatomicalPathology: "गठिया (Arthritis), घुटनों का घिसना, रीढ़ की हड्डी के निचले हिस्से (L4-L5) की अकड़न।",
    sacredOffering: "भीमा नदी का जल, दूध, बेलपत्र, शमी के पत्ते, काले तिल, सरसों के तेल का दीपक।",
    assimilationWindowDays: 40,
    assimilationGuidance: "शनि का भारी कर्म-बोझ उतरता है। दर्शन के पश्चात 40 दिन तक किसी निर्धन श्रमिक का अपमान न करें और नियमित व्यायाम करें।",
    beejMantra: "ॐ भीमाशंकराय नमः / ॐ शं शनैश्चराय नमः",
    healingFrequencyHz: 432,
    ragaResonance: ["Ahir Bhairav", "Bhoopali"],
    historicalLore: "सह्याद्रि पर्वत श्रृंखला के घने जंगलों में भीमा नदी का उद्गम स्थल। यहाँ शिव की हुंकार से उत्पन्न स्वेद से भीमा नदी प्रकट हुई।"
  },

  kedarnath: {
    id: "kedarnath",
    name: "Kedarnath",
    hindiTitle: "श्री केदारनाथ (रुद्रप्रयाग / हिमालय)",
    rashiNum: 10,
    rashiName: "Aquarius (कुंभ)",
    naturalHouse: 11,
    governingPlanets: ["Saturn", "Rahu"],
    location: "Garhwal Himalayas, Mandakini River, Uttarakhand",
    deityForm: "श्री केदारनाथ (बैल के कूबड़ स्वरूप शिला)",
    lifeCrisisTrigger: "सामूहिक पाप, अपने ही कुल व बंधुओं के विनाश का भारी अपराध-बोध (Guilt), सामाजिक बहिष्कार, बड़े लाभों का अंत समय में रुकना।",
    karmicKnotDissolved: "महाभारत युद्ध में अपने ही गुरु और भाइयों का वध करने के बाद पांडव पश्चाताप में शिव को ढूंढते यहाँ पहुंचे। शिव ने बैल रूप में अंतर्धान होकर यहाँ अपना कूबड़ छोड़ा और पांडवों को गोत्र-हत्या के पाप से मुक्त किया।",
    anatomicalPathology: "फेफड़े (Lungs), सांस की गंभीर तकलीफ (Asthma), ऑक्सीजन की कमी, रक्त संचार विकार।",
    sacredOffering: "मंदाकिनी जल, शुद्ध घी का लेपन, कस्तूरी/सुगंध, बेलपत्र, ऊनी वस्त्र का अर्पण।",
    assimilationWindowDays: 40,
    assimilationGuidance: "अति-उच्च हिमालयी दिव्य ऊर्जा! दर्शन के बाद 40 दिनों तक व्यक्ति अत्यधिक सोता है क्योंकि तंत्रिका तंत्र को प्राण ऊर्जा पचाने में समय लगता है।",
    beejMantra: "ॐ केदाराय नमः / ॐ नमः शिवाय",
    healingFrequencyHz: 963,
    ragaResonance: ["Malkauns", "Bhairav"],
    historicalLore: "पंच केदार में प्रमुख। यहाँ भगवान शिव का पृष्ठ भाग (Hump) स्थित है, जबकि मुख नेपाल के पशुपतिनाथ में प्रकट हुआ।"
  },

  trimbakeshwar: {
    id: "trimbakeshwar",
    name: "Trimbakeshwar",
    hindiTitle: "श्री त्र्यंबकेश्वर (गौतमी तट / नासिक)",
    rashiNum: 11,
    rashiName: "Pisces (मीन)",
    naturalHouse: 12,
    governingPlanets: ["Jupiter", "Ketu"],
    location: "Brahmagiri, Nashik, Maharashtra (Godavari Source)",
    deityForm: "त्रिदेव स्वरूप (ब्रह्मा, विष्णु, रुद्र तीनों एक लिंग में)",
    lifeCrisisTrigger: "कालसर्प दोष, प्रेत बाधा, अकाल मृत्यु पूर्वजों की अतृप्ति, बार-बार जेल/अस्पताल का योग, मोक्ष व आध्यात्मिक मुक्ति में अवरोध।",
    karmicKnotDissolved: "महर्षि गौतम पर लगे गोहत्या के झूठे कलंक को धोने के लिए भगवान शिव की जटाओं से गंगा यहाँ गोदावरी बनकर प्रकट हुईं। यहाँ ब्रह्मा, विष्णु और महेश तीनों साक्षात विराजमान हैं; यह तीर्थ पितृ-ऋण और कालसर्प के महापाश को काटता है।",
    anatomicalPathology: "पैरों के तलवों के रोग, अनिद्रा, भ्रम, स्वप्नदोष, अज्ञात भय व मानसिक बेचैनी।",
    sacredOffering: "नारायण नागबलि पूजा, त्रिपिंडी श्राद्ध, गोदावरी जल, स्वर्ण नाग-नागिन प्रतिमा, पंचामृत।",
    assimilationWindowDays: 40,
    assimilationGuidance: "पितरों की मुक्ति के उपरांत 40 दिन तक घर में शांति रखें, नित्य 'ॐ नमो भगवते वासुदेवाय' का जप करें और पक्षियों को दाना डालें।",
    beejMantra: "ॐ त्र्यंबकाय नमः / ॐ तत्पुरुषाय विद्महे महादेवाय धीमहि",
    healingFrequencyHz: 528,
    ragaResonance: ["Revati", "Bageshri"],
    historicalLore: "एकमात्र ज्योतिर्लिंग जहाँ शिवलिंग में तीन छोटे लिंग (ब्रह्मा, विष्णु, शिव) समाहित हैं और रत्नजड़ित मुकुट से श्रृंगार होता है।"
  }
};

export interface PilgrimageEvaluation {
  primaryJyotirlinga: JyotirlingaProfile;
  primaryMatchReasonHinglish: string;
  secondaryJyotirlingas: {
    profile: JyotirlingaProfile;
    reasonHinglish: string;
    score: number;
  }[];
  allJyotirlingas: JyotirlingaProfile[];
  energyAssimilationRuleHinglish: string;
  practitionerShieldAdviceHinglish: string;
}

/**
 * Deterministically resolves the most transformative Jyotirlinga pilgrimage
 * based on the native's D1 chart, afflicted houses, dasha lords, and karmic knots.
 */
export function resolvePilgrimagePrescription(chart: ChartData | null): PilgrimageEvaluation {
  const allList = Object.values(JYOTIRLINGA_REGISTRY);

  if (!chart || !chart.planets) {
    const defaultRameshwaram = JYOTIRLINGA_REGISTRY["rameshwaram"]!;
    return {
      primaryJyotirlinga: defaultRameshwaram,
      primaryMatchReasonHinglish:
        "सामान्य जीवन गतिरोध एवं नई ऊर्जा के संचार हेतु प्रथम ज्योतिर्लिंग श्री रामेश्वरम् की यात्रा जीवन के अवरोधों को तोड़ती है।",
      secondaryJyotirlingas: [
        { profile: JYOTIRLINGA_REGISTRY["somnath"]!, reasonHinglish: "मानसिक शांति एवं लक्ष्मी कृपा हेतु सोमनाथ दर्शन।", score: 80 },
        { profile: JYOTIRLINGA_REGISTRY["kashi_vishwanath"]!, reasonHinglish: "प्रारब्ध कर्म मुक्ति एवं आध्यात्मिक उत्थान हेतु काशी विश्वनाथ।", score: 75 }
      ],
      allJyotirlingas: allList,
      energyAssimilationRuleHinglish:
        "40-दिन का आत्मसात नियम: किसी भी ज्योतिर्लिंग से लौटने के पश्चात शरीर 40 दिनों (एक मंडल) तक उस उच्च आवृत्ति को पचाता है। थकान व गहरी नींद ऊर्जा रीबूट का लक्षण है।",
      practitionerShieldAdviceHinglish:
        "1.25 लाख गायत्री जप साधक को किसी भी प्रकार की नकारात्मक ऊर्जा सोखने से रक्षा कवच प्रदान करता है।"
    };
  }

  const scores: Record<string, { score: number; reasons: string[] }> = {};
  for (const j of allList) {
    scores[j.id] = { score: 10, reasons: [] };
  }

  const pls = chart.planets;
  const activeMD = chart.dashas?.find(d => d.active)?.planet || "Unknown";
  const activeAD = chart.antardasha?.find(a => a.active)?.planet || "Unknown";

  // ── RULE 1: JUPITER IN 6TH HOUSE / AFFLICTED ──────────────────
  const jup = pls["Jupiter"];
  if (jup) {
    if (jup.house === 6) {
      scores["omkareshwar"]!.score += 95;
      scores["omkareshwar"]!.reasons.push(
        "आपकी कुंडली के 6वें भाव में बृहस्पति स्थित हैं। यह फैटी लिवर, सुस्त मेटाबॉलिज्म एवं पुरोहित/कन्यादान के पूर्व ऋण का संकेत है। ओंकारेश्वर (अमलेश्वर) का नर्मदा जल इस 'मल' को धोकर आरोग्य देता है।"
      );
    } else if (jup.sign === "Capricorn") {
      scores["omkareshwar"]!.score += 80;
      scores["omkareshwar"]!.reasons.push(
        "बृहस्पति मकर राशि में स्थित हैं। नाड़ी अनुसार यह 36 से 42 वर्ष की आयु में जीवन का चरम उत्थान देता है, जिसे जाग्रत करने हेतु ओंकारेश्वर व नर्मदा परिक्रमा अचूक है।"
      );
    } else if (jup.house === 12) {
      scores["trimbakeshwar"]!.score += 75;
      scores["trimbakeshwar"]!.reasons.push("12वें भाव में गुरु मोक्ष एवं पूर्वजों की मुक्ति हेतु त्र्यंबकेश्वर की प्रेरणा देता है।");
    }
  }

  // ── RULE 2: SATURN-KETU / BLOCKED LIFE / 1ST HOUSE ───────────
  const sat = pls["Saturn"];
  const ketu = pls["Ketu"];
  const sun = pls["Sun"];
  const mars = pls["Mars"];

  if (sat && ketu && Math.abs(sat.house - ketu.house) === 0) {
    scores["rameshwaram"]!.score += 90;
    scores["rameshwaram"]!.reasons.push(
      "शनि और केतु की युति जीवन में 'बंधन पाश' (Stuck in Life) उत्पन्न करती है। जिस प्रकार मर्यादा पुरुषोत्तम राम ने समुद्र के गतिरोध पर रामेश्वरम में सेतुबंध बनाया, उसी प्रकार यह तीर्थ आपके अवरोधों को काटता है।"
    );
  }

  if (sun && [6, 8, 12].includes(sun.house)) {
    scores["rameshwaram"]!.score += 70;
    scores["rameshwaram"]!.reasons.push("सूर्य त्रिक भाव में होने से आत्मविश्वास का संकोच होता है; मेष राशि के स्वामी सूर्य का उच्च धाम रामेश्वरम आत्मबल लौटाता है।");
  }

  // ── RULE 3: MOON AFFLICTION / DEPRESSION / WEALTH LOSS ────────
  const moon = pls["Moon"];
  if (moon) {
    if (moon.sign === "Scorpio" || [6, 8, 12].includes(moon.house)) {
      scores["somnath"]!.score += 88;
      scores["somnath"]!.reasons.push(
        "चंद्रमा नीच (वृश्चिक) या त्रिक भाव में स्थित होने से मानसिक अवसाद, चिंता और धन की अस्थिरता रहती है। सोमनाथ में शिव ने चंद्रमा के क्षय रोग का निवारण किया था, जो आपके मन को अमृत शांति देगा।"
      );
    }
    if (ketu && moon.house === ketu.house) {
      scores["somnath"]!.score += 85;
      scores["somnath"]!.reasons.push("चंद्र-केतु युति मन में वैराग्य व बेचैनी देती है; सोमनाथ दर्शन से मानसिक स्थिरता प्राप्त होती है।");
    }
  }

  // ── RULE 4: 8TH HOUSE / SCORPIO / INCURABLE ILLNESS / CANCER ──
  const rahu = pls["Rahu"];
  if (pls["Mars"]?.house === 8 || pls["Saturn"]?.house === 8 || pls["Ketu"]?.house === 8) {
    scores["baidyanath"]!.score += 92;
    scores["baidyanath"]!.reasons.push(
      "8वें भाव में पापी ग्रहों की स्थिति अचानक सर्जरी, गुप्त रोग या विषैले संक्रमण का भय देती है। संसार के सर्वोच्च शल्य-चिकित्सक भगवान वैद्यनाथ आरोग्य व दीर्घायु प्रदान करते हैं।"
    );
  }

  // ── RULE 5: 12TH HOUSE / KAAL SARP / RAHU-KETU AXIS ─────────
  if (rahu && ketu) {
    const isKaalSarp = true; // Evaluated in comprehensive charts
    if (pls["Saturn"]?.house === 12 || pls["Ketu"]?.house === 12) {
      scores["trimbakeshwar"]!.score += 86;
      scores["trimbakeshwar"]!.reasons.push(
        "12वां भाव व्यय, अस्पताल और मोक्ष का है। त्र्यंबकेश्वर में नारायण नागबलि एवं कालसर्प शांति से पूर्वजों की तृप्ति और आत्मिक शुद्धि होती है।"
      );
    }
  }

  // ── RULE 6: 10TH HOUSE BLOCK / WORKPLACE TYRANNY ─────────────
  if (sat && sat.house === 10) {
    scores["bhimashankar"]!.score += 84;
    scores["bhimashankar"]!.reasons.push(
      "10वें भाव में शनि अत्यधिक कार्यभार व पदोन्नति में विलंब कराता है। भीमाशंकर दर्शन से कर्म-क्षेत्र के अत्याचारी अवरोध समाप्त होते हैं।"
    );
  }

  // ── RULE 7: 5TH HOUSE / SUN AFFLICTION / EGO CLASH ──────────
  if (sun && (sun.house === 5 || sun.house === 10 || sun.sign === "Libra")) {
    scores["mahakaleshwar"]!.score += 85;
    scores["mahakaleshwar"]!.reasons.push(
      "सूर्य का संबंध 5वें या 10वें भाव से होने पर मान-सम्मान व पिता तुल्य अधिकारियों से टकराव की संभावना रहती है। महाकालेश्वर की भस्म आरती काल के भय को मिटाकर तेजस्विता देती है।"
    );
  }

  // ── RULE 8: ACTIVE DASHA LORD ATTUNEMENT ───────────────────────
  if (activeMD === "Jupiter" || activeAD === "Jupiter") {
    scores["omkareshwar"]!.score += 25;
    scores["kashi_vishwanath"]!.score += 25;
  }
  if (activeMD === "Saturn" || activeAD === "Saturn") {
    scores["bhimashankar"]!.score += 25;
    scores["kedarnath"]!.score += 25;
  }
  if (activeMD === "Moon" || activeAD === "Moon") {
    scores["somnath"]!.score += 25;
  }
  if (activeMD === "Sun" || activeAD === "Sun") {
    scores["rameshwaram"]!.score += 25;
    scores["mahakaleshwar"]!.score += 25;
  }

  // Sort by highest score
  const sorted = allList
    .map(j => ({
      profile: j,
      score: scores[j.id]?.score || 10,
      reasonHinglish:
        scores[j.id]?.reasons.length
          ? scores[j.id]!.reasons.join(" ")
          : `${j.hindiTitle} आपके जीवन के कार्मिक संकोच को समाप्त करने में सक्षम है।`
    }))
    .sort((a, b) => b.score - a.score);

  const primary = sorted[0]!;
  const secondaries = sorted.slice(1, 3);

  return {
    primaryJyotirlinga: primary.profile,
    primaryMatchReasonHinglish: primary.reasonHinglish,
    secondaryJyotirlingas: secondaries,
    allJyotirlingas: allList,
    energyAssimilationRuleHinglish:
      "40-दिवसीय ऊर्जा आत्मसात नियम (The 40-Day Digestion Window): किसी भी जाग्रत ज्योतिर्लिंग से लौटने के पश्चात तंत्रिका तंत्र उस उच्च-आवृत्ति को पचाने में 40 दिन लेता है। इस दौरान अत्यधिक नींद आना, हल्का बुखार या शारीरिक भारीपन सामान्य है—यह शरीर का आंतरिक रीबूट है। इस अवधि में शांत रहें और तामसिक आहार से बचें।",
    practitionerShieldAdviceHinglish:
      "साधक व ज्योतिषी ऊर्जा कवच: दूसरों के दुख और कुंडलियों का विश्लेषण करते समय 1.25 लाख गायत्री जप की साधना और नित्य प्रातः देव दर्शन साधक के ऑरा को अभेद्य सुरक्षा प्रदान करते हैं।"
  };
}

