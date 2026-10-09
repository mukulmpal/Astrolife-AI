// src/lib/astro-engine/transit-nakshatra-remedies.ts
// AstroLife — Dynamic Dasha Lord Transit & 27 Shivling Upacharas Engine
// Based strictly on classical tantrik/shastric sources and oral discourse transcripts:
// 1. Dasha Lord's real-time transit sign and nakshatra
// 2. Navtara matching (1-9) from natal Moon nakshatra
// 3. 27-Upachara Shivling sequence (#1 to #27) for both Mahadasha Lord & Antardasha Lord
// 4. MD-AD distance calculation (with 6/8 'Tak Yog' alert)
// 5. 6th (Plants / Blind Faith), 8th (Fruits), 12th (Donations / Never Believe)

import { calculateChart, type ChartData, type PlanetData } from "./calculations";
import { NAKSHATRA_NAMES } from "./transit-ripple/aspect-profiles";

export interface ShivlingUpachara {
  upacharaNumber: number;            // 1 to 27
  nakshatraName: string;             // Ashwini to Revati
  upacharaName: string;              // Classical Sanskrit Upachara
  hindiTitle: string;                // Readable Hindi Title
  itemOrOffering: string;            // Physical material or action
  significanceHinglish: string;      // Why this upachara transforms energy
  procedureNarrativeHinglish: string;// Step-by-step guidance in warm human tone
  transcriptExample?: string;        // Real life case study / lore if highlighted
}

export const SHIVLING_27_UPACHARE: ShivlingUpachara[] = [
  {
    upacharaNumber: 1,
    nakshatraName: "Ashwini",
    upacharaName: "Dhyanam",
    hindiTitle: "ध्यानम् (शांत मन से शिव का ध्यान)",
    itemOrOffering: "एकांत, शांत चित्त और बंद आंखें",
    significanceHinglish: "अश्विनी के जल्दबाज़ और बेचैन मन को तुरंत थामने के लिए महादेव के निराकार, शांत स्वरूप का ध्यान सबसे अचूक औषधि है।",
    procedureNarrativeHinglish: "प्रातःकाल पूर्व दिशा की ओर मुख करके बैठें। शिवलिंग के सामने आंखें मूंदकर 5 से 11 मिनट तक केवल महादेव के शांत, तेजस्वी रूप का ध्यान करें और मन की हर हड़बड़ाहट को उनके चरणों में छोड़ दें।",
  },
  {
    upacharaNumber: 2,
    nakshatraName: "Bharani",
    upacharaName: "Avahanam",
    hindiTitle: "आवाहनम् (महादेव को अपने हृदय व घर में बुलाना)",
    itemOrOffering: "हाथ जोड़कर प्रार्थना और धूप",
    significanceHinglish: "भरणी यम का नक्षत्र है जो भारी दबाव और तनाव देता है। जब आप भगवान शिव को अपने जीवन में आने का आमंत्रण देते हैं, तो हर भय तिरोहित हो जाता है।",
    procedureNarrativeHinglish: "शिवलिंग के सम्मुख दोनों हाथ जोड़कर सच्चे हृदय से बोलें: 'हे देवाधिदेव महादेव! आप मेरे घर, मेरे हृदय और मेरी इस परिस्थिति में पधारें और मुझे संभालें।' यह आत्मसमर्पण भरणी के बोझ को हल्का कर देता है।",
  },
  {
    upacharaNumber: 3,
    nakshatraName: "Krittika",
    upacharaName: "Asanam",
    hindiTitle: "आसनम् (पवित्र आसन व बेलपत्र अर्पण)",
    itemOrOffering: "स्वच्छ कुशा, रेशमी वस्त्र या ताज़ा बेलपत्र",
    significanceHinglish: "कृतिका की अग्नि तीव्र होती है। शिवलिंग पर शीतल और पवित्र आसन समर्पित करने से जीवन में क्रोध और उग्रता शांत होकर आत्मबल बनती है।",
    procedureNarrativeHinglish: "शिवलिंग के नीचे या उनके चरणों में सुंदर ताज़ा बेलपत्र अथवा स्वच्छ श्वेत/पीत वस्त्र का छोटा आसन प्रेमपूर्वक बिछाएं और मानसिक रूप से भगवान को उस पर विराजने की विनती करें।",
  },
  {
    upacharaNumber: 4,
    nakshatraName: "Rohini",
    upacharaName: "Padyam",
    hindiTitle: "पाद्यम् (श्रीचरणों को सुगंधित जल से पखारना)",
    itemOrOffering: "तांबे के पात्र में गुलाब जल व चंदन मिश्रित शुद्ध जल",
    significanceHinglish: "रोहिणी आकर्षण और मोह का नक्षत्र है। भगवान के श्रीचरणों को जल से पखारने से मन का भटकाव और अनावश्यक अटैचमेंट निर्मल भक्ति में बदल जाता है।",
    procedureNarrativeHinglish: "शुद्ध जल में थोड़ा सा गुलाब जल या घिसा हुआ चंदन मिलाएं। शिवलिंग के आधार भाग (चरणों) पर अत्यंत धीमी धार से यह जल अर्पित करें और मन में अपने विकारों को धोने की प्रार्थना करें।",
  },
  {
    upacharaNumber: 5,
    nakshatraName: "Mrigashira",
    upacharaName: "Arghyam",
    hindiTitle: "अर्घ्यम् (समर्पण भाव से अर्घ्य भेंट करना)",
    itemOrOffering: "जल, अक्षत, चंदन और श्वेत पुष्प का अर्घ्य",
    significanceHinglish: "व्याख्यान में संख्या 4 (पाद्यम्) के बाद सीधे संख्या 6 (आचमनम्) पर चर्चा हुई थी। शास्त्रीय शिव पूजा क्रम में यह 5वां उपचार 'अर्घ्यम्' है। मृगशिरा की चंचल खोज को पूर्ण तृप्ति अर्घ्य समर्पण से मिलती है।",
    procedureNarrativeHinglish: "तांबे के पात्र में जल, थोड़े से साबुत चावल और श्वेत फूल लेकर शिवलिंग के सम्मुख अर्घ्य मुद्रा में हाथ उठाकर 'ॐ नमः शिवाय' बोलते हुए आदरपूर्वक अर्पित करें।",
  },
  {
    upacharaNumber: 6,
    nakshatraName: "Ardra",
    upacharaName: "Aachamanam",
    hindiTitle: "आचमनम् (पवित्र जल से आचमन)",
    itemOrOffering: "आचमनी में गंगाजल व शुद्ध जल",
    significanceHinglish: "आद्रा तूफ़ान और अश्रु का नक्षत्र है। आचमन भीतर के विष, नकारात्मक विचारों और मानसिक संताप को सोखकर शीतलता प्रदान करता है।",
    procedureNarrativeHinglish: "तांबे या चांदी की छोटी चम्मच (आचमनी) से तीन बार जल लेकर शिवलिंग पर स्पर्श कराएं और स्वयं भी कंठ को शीतल करें। मन के भीतर की हर कड़वाहट को भगवान के चरणों में विसर्जित कर दें।",
  },
  {
    upacharaNumber: 7,
    nakshatraName: "Punarvasu",
    upacharaName: "Snanam",
    hindiTitle: "स्नानम् (शुद्ध शीतल जल की अखंड धारा)",
    itemOrOffering: "शुद्ध शीतल जल, गंगाजल",
    significanceHinglish: "पुनर्वसु फिर से नया सवेरा लाने वाला नक्षत्र है। शिवलिंग पर शीतल जल की धारा चढ़ाने से हर बिगड़ा हुआ काम दोबारा पटरी पर लौट आता है।",
    procedureNarrativeHinglish: "शिवलिंग पर जलधारा अत्यंत मंद गति से अर्पित करें। जल गिरते समय 'ॐ नमः शिवाय' का 11 या 21 बार शांत स्वर में जप करें। मन को ऐसा महसूस कराएं जैसे आपकी आत्मा की सारी थकान धुल रही है।",
  },
  {
    upacharaNumber: 8,
    nakshatraName: "Pushya",
    upacharaName: "Maha Abhishekam",
    hindiTitle: "महा अभिषेक (पंचामृत से दिव्य अभिषेक)",
    itemOrOffering: "कच्चा गाय का दूध, दही, शहद, देशी घी और गन्ने का रस या मिश्री",
    significanceHinglish: "पुष्य पोषण और देवगुरु का नक्षत्र है। पंचामृत महा अभिषेक से भाग्य के बंद ताले खुलते हैं और परिवार में स्थायित्व व समृद्धि आती है।",
    procedureNarrativeHinglish: "क्रम से थोड़ा कच्चा दूध, फिर दही, थोड़ा शहद, घी और अंत में गंगाजल की धार शिवलिंग पर चढ़ाएं। इसके बाद शुद्ध जल से स्नान कराकर शिवलिंग को पोंछें। यह पुष्य नक्षत्र का सर्वोच्च फलदायी अनुष्ठान है।",
  },
  {
    upacharaNumber: 9,
    nakshatraName: "Ashlesha",
    upacharaName: "Pratishtha",
    hindiTitle: "प्रतिष्ठा (संकल्प व शिव तत्व की स्थापना)",
    itemOrOffering: "कच्चा सूत, अक्षत और दृढ़ संकल्प",
    significanceHinglish: "आश्लेषा सर्प का नक्षत्र है जो मानसिक उलझनें और षड्यंत्र देता है। शिवलिंग के सम्मुख अपनी कुल परंपरा और मर्यादा की प्रतिष्ठा करने से कोई शत्रु हावी नहीं हो पाता।",
    procedureNarrativeHinglish: "शिवलिंग के सामने बैठकर दाहिने हाथ में जल और चावल लेकर संकल्प करें कि आप सत्य और धर्म पर टिके रहेंगे। शिवलिंग को दोनों हाथों से प्रणाम कर अपने हृदय में शिव तत्व को प्रतिष्ठित महसूस करें।",
  },
  {
    upacharaNumber: 10,
    nakshatraName: "Magha",
    upacharaName: "Vastram",
    hindiTitle: "वस्त्रम् (पवित्र वस्त्र या कलावा अर्पण)",
    itemOrOffering: "श्वेत सूती वस्त्र, धोती या शुद्ध कलावा",
    significanceHinglish: "मघा पितरों और राजसिंहासन का नक्षत्र है। शिवलिंग पर वस्त्र अर्पित करने से पितृदोष शांत होता है और सामाजिक प्रतिष्ठा में कभी दाग नहीं लगता।",
    procedureNarrativeHinglish: "एक स्वच्छ श्वेत सूती रुमाल या कलावा लेकर शिवलिंग पर लपेटें या उनके ऊपर आदर से रखें। मन ही मन अपने पूर्वजों व पितरों का स्मरण कर उनसे आशीर्वाद मांगें।",
  },
  {
    upacharaNumber: 11,
    nakshatraName: "Purva Phalguni",
    upacharaName: "Yajnopavitam",
    hindiTitle: "यज्ञोपवीतम् (पवित्र जनेऊ अर्पण)",
    itemOrOffering: "कच्चे सूत का शुद्ध जनेऊ",
    significanceHinglish: "पूर्वाफाल्गुनी भोग और आनंद का नक्षत्र है। जनेऊ अर्पण करने से व्यक्ति के जीवन में विलासिता और संयम के बीच सही संतुलन बनता है और दांपत्य सुख मिलता है।",
    procedureNarrativeHinglish: "जनेऊ को थोड़ा सा हल्दी या केसर से रंगकर शिवलिंग पर अर्पित करें। भगवान को प्रार्थना करें कि वे आपके दांपत्य और गृहस्थ जीवन को मर्यादित व खुशहाल बनाएं।",
  },
  {
    upacharaNumber: 12,
    nakshatraName: "Uttara Phalguni",
    upacharaName: "Gandham",
    hindiTitle: "गंध/सुगंध (श्वेत चंदन व अष्टगंध का लेप)",
    itemOrOffering: "मलयागिरि श्वेत चंदन, अष्टगंध या प्राकृतिक इत्र",
    significanceHinglish: "उत्तराफाल्गुनी मित्रता और अनुबंध का नक्षत्र है। सुगंध और चंदन का लेप लगाने से समाज में आपका प्रभाव सुगंध की तरह फैलता है और संबंध प्रगाढ़ होते हैं।",
    procedureNarrativeHinglish: "अपनी अनामिका (Ring finger) से चंदन का त्रिपुंड शिवलिंग पर बनाएं। थोड़ा सा प्राकृतिक इत्र (गुलाब या केवड़ा) शिवलिंग पर लगाएं।",
  },
  {
    upacharaNumber: 13,
    nakshatraName: "Hasta",
    upacharaName: "Akshatam",
    hindiTitle: "अक्षतम् (अखंडित, बिना टूटे हुए चावल)",
    itemOrOffering: "पूरी तरह साबुत, श्वेताभ, बिना टूटे हुए कच्चे चावल",
    significanceHinglish: "हस्त हुनर और हाथों का नक्षत्र है। अक्षत कभी क्षय न होने वाली लक्ष्मी का प्रतीक है। टूटे हुए चावल नहीं चढ़ाने चाहिए।",
    procedureNarrativeHinglish: "एक मुट्ठी ऐसे चावल चुनें जिनका एक भी दाना टूटा हुआ न हो। शिवलिंग पर धीमे-धीमे 'ॐ नमः शिवाय' बोलते हुए अर्पित करें।",
    transcriptExample: "हरिद्वार के प्राचीन नरसिंह मंदिर के बाहर बैठकर जब भक्त ने बिना टूटे हुए शुद्ध चावल शिवलिंग पर अर्पित किए, तो उसकी घोर दरिद्रता और आर्थिक रुकावटें हमेशा के लिए दूर हो गईं।",
  },
  {
    upacharaNumber: 14,
    nakshatraName: "Chitra",
    upacharaName: "Pushpam",
    hindiTitle: "पुष्पम् (सुगंधित ताज़े फूल व बेलपत्र)",
    itemOrOffering: "नीलकमल, कनेर, धतूरा, मदार या सुगंधित ताज़े पुष्प",
    significanceHinglish: "चित्रा चमक और कला का नक्षत्र है। ताज़े पुष्प चढ़ाने से जातक की रचनात्मक प्रतिभा और यश चारों दिशाओं में खिल उठता है।",
    procedureNarrativeHinglish: "हाथ में 3 या 5 ताज़े फूल और एक चिकना बेलपत्र लें। दोनों हाथों से शिवलिंग के शीश पर समर्पित करें। बासी या ज़मीन पर गिरे फूल कभी न चढ़ाएं।",
  },
  {
    upacharaNumber: 15,
    nakshatraName: "Swati",
    upacharaName: "Ashtottara Namavali",
    hindiTitle: "अष्टोत्तर नामावली (शिव के 108 नामों का पाठ)",
    itemOrOffering: "108 बिल्वपत्र या चावल के दाने और नामावली पाठ",
    significanceHinglish: "स्वाति वायु का स्वतंत्र नक्षत्र है। 108 दिव्य नामों का स्मरण स्वाति के बिखरे हुए विचारों को केंद्रित कर अदभुत आध्यात्मिक शक्ति देता है।",
    procedureNarrativeHinglish: "हर नाम ('ॐ शिवाय नमः', 'ॐ महेश्वराय नमः'...) के साथ एक-एक चावल का दाना या बेलपत्र शिवलिंग पर चढ़ाते जाएं। मन में असीम शांति का अनुभव होगा।",
  },
  {
    upacharaNumber: 16,
    nakshatraName: "Vishakha",
    upacharaName: "Dhoopam",
    hindiTitle: "धूपम् (प्राकृतिक गुग्गल या धूप अर्पण)",
    itemOrOffering: "शुद्ध गुग्गल, लोबान या चंदन की अगरबत्ती/धूप",
    significanceHinglish: "विशाखा दोराहे और तीव्र महत्वाकांक्षा का नक्षत्र है। धूप की पवित्र सुगंध मन की द्वंद्व और ईर्ष्या को भस्म कर एकाग्रता प्रदान करती है।",
    procedureNarrativeHinglish: "धूप प्रज्वलित करके शिवलिंग के चारों ओर घड़ी की सुई की दिशा में 3 बार घुमाएं और फिर थोड़ी दूरी पर स्थापित करें।",
  },
  {
    upacharaNumber: 17,
    nakshatraName: "Anuradha",
    upacharaName: "Deepam",
    hindiTitle: "दीपम् (गाय के शुद्ध घी का दीपक)",
    itemOrOffering: "मिट्टी या पीतल का दीपक, शुद्ध गाय का घी, रूई की बाती",
    significanceHinglish: "अनुराधा निष्ठा और भक्ति का नक्षत्र है। शुद्ध घी का दीपक जीवन के अंधकार और निराशा को मिटाकर आशा की अमर लौ जलाता है।",
    procedureNarrativeHinglish: "दीपक जलाकर शिवलिंग के दाहिनी ओर रखें। प्रार्थना करें: 'हे शिव! जिस तरह यह दीपक जलकर प्रकाश दे रहा है, उसी तरह मेरे भीतर ज्ञान और सत्य का प्रकाश भर दीजिए।' ",
  },
  {
    upacharaNumber: 18,
    nakshatraName: "Jyeshtha",
    upacharaName: "Naivedyam",
    hindiTitle: "नैवेद्यम् (खीर, हलवा या सात्विक भोग)",
    itemOrOffering: "घर में बनी ताज़ा खीर, हलवा, मिश्री या माखन",
    significanceHinglish: "ज्येष्ठा ज्येष्ठता और अहंकार की रक्षा करने वाला नक्षत्र है। मीठा नैवेद्य भगवान को भोग लगाने से इंसान का अहंकार पिघलता है और वाणी में माधुर्य आता है।",
    procedureNarrativeHinglish: "स्वच्छ पात्र में नैवेद्य शिवलिंग के आगे रखें। हाथ से जल का चौकोर घेरा बनाकर तीन बार भगवान को भोग समर्पित करें और बाद में इसे प्रसाद रूप में परिवार में बांटें।",
  },
  {
    upacharaNumber: 19,
    nakshatraName: "Mula",
    upacharaName: "Phalam",
    hindiTitle: "फलम् (ऋतुफल अर्पण)",
    itemOrOffering: "मौसम का कोई भी मीठा फल (अनार, सेब, केला, शरीफ़ा)",
    significanceHinglish: "मूल जड़ से उखाड़ फेंकने वाला नक्षत्र है। पूर्ण पका हुआ फल चढ़ाने से इंसान के पुराने संचित पापों का भार कट जाता है और नई शुरुआत होती है।",
    procedureNarrativeHinglish: "साफ़-सुथरा मौसमी फल शिवलिंग के पास अर्पित करें। प्रार्थना करें कि आपके कर्मों का फल शुभ और कल्याणकारी हो।",
  },
  {
    upacharaNumber: 20,
    nakshatraName: "Purva Ashadha",
    upacharaName: "Tambulam",
    hindiTitle: "ताम्बूलम् (मीठा पान, लौंग-इलायची)",
    itemOrOffering: "ताज़ा नागरबेल का पान, गुलकंद, सौंफ, लौंग, इलायची (सुपारी/तंबाकू रहित)",
    significanceHinglish: "पूर्वाषाढ़ा अपराजित रहने की चाह रखता है। सात्विक मीठा पान चढ़ाने से रिश्तों की कटुता मिटती है और विजय प्राप्त होती है।",
    procedureNarrativeHinglish: "बिना तंबाकू और बिना चूने वाला मीठा पान बनाकर शिवलिंग पर अर्पित करें। यह पूजा की संपूर्णता का प्रतीक है।",
  },
  {
    upacharaNumber: 21,
    nakshatraName: "Uttara Ashadha",
    upacharaName: "Dakshina",
    hindiTitle: "दक्षिणा (श्रद्धापूर्वक दक्षिणा अर्पण)",
    itemOrOffering: "यथाशक्ति तांबे, चांदी या मुद्रा का सिक्का",
    significanceHinglish: "उत्तराषाढ़ा विश्वेदेवा का नक्षत्र है जो धर्म और त्याग सिखाता है। दक्षिणा से पूजा में रह गई किसी भी भूल-चूक की पूर्ति होती है।",
    procedureNarrativeHinglish: "किसी स्वच्छ सिक्के को शिवलिंग के पास रखकर प्रणाम करें और बाद में उसे मंदिर के पुजारी या किसी असहाय व्यक्ति को ससम्मान दान कर दें।",
  },
  {
    upacharaNumber: 22,
    nakshatraName: "Shravana",
    upacharaName: "Aarti",
    hindiTitle: "आरती (कर्पूर की पावन आरती)",
    itemOrOffering: "भीमसेनी कर्पूर, पीतल की आरती",
    significanceHinglish: "श्रवण सुनने और सीखने का नक्षत्र है। कर्पूर जिस तरह खुद जलकर कोई राख नहीं छोड़ता, उसी तरह कर्पूर आरती इंसान के अहंकार को पूरी तरह विलीन कर देती है।",
    procedureNarrativeHinglish: "कर्पूर जलाकर प्रेमपूर्वक 'कर्पूरगौरं करुणावतारं...' गाते हुए आरती उतारें और दोनों हाथों से आरती का तेज अपने शीश और नयनों पर धारण करें।",
  },
  {
    upacharaNumber: 23,
    nakshatraName: "Dhanishtha",
    upacharaName: "Parikrama",
    hindiTitle: "परिक्रमा (शिवलिंग की आधी परिक्रमा)",
    itemOrOffering: "स्वयं का शरीर और श्रद्धा",
    significanceHinglish: "धनिष्ठा लय और ताल का नक्षत्र है। शिवलिंग की आधी परिक्रमा (सोमसूत्र को बिना लांघे) करने से जीवन की रुकी हुई ऊर्जा में गति आ जाती है।",
    procedureNarrativeHinglish: "शिवलिंग की बायीं तरफ से चलना शुरू करें, जहां से जल बहकर निकलता है (सोमसूत्र), वहां रुकें, प्रणाम करें और वापस लौटकर दूसरी तरफ जाएं। सोमसूत्र को कभी लांघा नहीं जाता।",
  },
  {
    upacharaNumber: 24,
    nakshatraName: "Shatabhisha",
    upacharaName: "Namaskaram",
    hindiTitle: "नमस्कारम् (साष्टांग दंडवत प्रणाम)",
    itemOrOffering: "सम्पूर्ण देह और अहंकार का समर्पण",
    significanceHinglish: "शतभिषा 100 वैद्यों और गहरे रहस्यों का नक्षत्र है। साष्टांग प्रणाम करने से रीढ़ की हड्डी और चक्रों में छिपा हर मानसिक रोग शांत हो जाता है।",
    procedureNarrativeHinglish: "ज़मीन पर पेट के बल लेटकर दोनों हाथ आगे फैलाकर महादेव के सम्मुख साष्टांग दंडवत करें। मन में कहें: 'मेरा कुछ नहीं, जो है सब आपका है।'",
  },
  {
    upacharaNumber: 25,
    nakshatraName: "Purva Bhadrapada",
    upacharaName: "Mantra Pushpam",
    hindiTitle: "मंत्र पुष्पम् (पीले पुष्प व 11x ॐ नमः शिवाय जप)",
    itemOrOffering: "हाथ में पीले ताज़े फूल, 11 बार 'ॐ नमः शिवाय' का ध्यान",
    significanceHinglish: "पूर्वाभाद्रपद तपस्या और रूपांतरण का नक्षत्र है। हाथ में फूल लेकर मंत्र जप करके चढ़ाने से असंभव काम भी संभव हो जाते हैं।",
    procedureNarrativeHinglish: "दोनों अंजलि में ताज़े पीले फूल (गेंदा या कनेर) लें। शिवलिंग के सम्मुख खड़े होकर शांत स्वर में 11 बार 'ॐ नमः शिवाय' बोलें और फिर अत्यंत भक्ति भाव से वे फूल शिवलिंग पर अर्पित कर दें।",
    transcriptExample: "मिथुन लग्न के जातक की चार मंजिला इमारत का विवाद सालों से नहीं सुलझ रहा था। जब गोचर में राहु पूर्वाभाद्रपद में आया और उन्होंने 11 बार 'ॐ नमः शिवाय' बोलकर पीले फूल शिवलिंग पर चढ़ाए, तो अगले ही दिन सुबह ठीक 11 बजे विपक्षी ने खुद फोन करके समझौता कर लिया!",
  },
  {
    upacharaNumber: 26,
    nakshatraName: "Uttara Bhadrapada",
    upacharaName: "Prarthana",
    hindiTitle: "प्रार्थना (बाल-सुलभ भाव से हृदय की बात कहना)",
    itemOrOffering: "निर्मल हृदय, अश्रु और सत्य वचन",
    significanceHinglish: "उत्तराभाद्रपद गहरे समुद्र और मोक्ष का नक्षत्र है। यहाँ कोई आडंबर नहीं चाहिए; केवल एक बच्चे की तरह अपने पिता से अपनी व्यथा कह देना ही संपूर्ण उपचार है।",
    procedureNarrativeHinglish: "शिवलिंग के पास बैठकर हाथ जोड़ें और अपने मन की हर चिंता, हर भय और हर इच्छा महादेव से साफ़-साफ़ कहें। वे सब सुन रहे हैं और हर संकट हर लेंगे।",
  },
  {
    upacharaNumber: 27,
    nakshatraName: "Revati",
    upacharaName: "Kshama Yachana",
    hindiTitle: "क्षमा याचना (अनजाने अपराधों की सच्चे मन से क्षमा)",
    itemOrOffering: "दोनों कान पकड़कर या हाथ जोड़कर क्षमा प्रार्थना",
    significanceHinglish: "रेवती अंतिम नक्षत्र है जो मोक्ष और पूर्णता देता है। क्षमा याचना से जन्म-जन्मांतर के कर्म बंधन कट जाते हैं और जातक हल्का हो जाता है।",
    procedureNarrativeHinglish: "शिवलिंग के सम्मुख खड़े होकर बोलें: 'हे शम्भो! मनसा, वाचा, कर्मणा मुझसे जो भी भूल हुई हो, मुझे क्षमा करें।' यह कहकर मस्तक झुकाएं, आपका जीवन पुनः निर्मल हो जाएगा।",
  },
];

export interface House6PlantRemedy {
  planet: string;
  plantName: string;
  careInstructionsHinglish: string;
}

export const HOUSE_6_PLANTS: Record<string, { plantName: string; care: string }> = {
  Sun: { plantName: "आक / मदार (Aak Plant)", care: "रविवार को लगाएं, दूधिया रस वाले इस पौधे को सींचें; शत्रुओं और सरकारी बाधाओं से मुक्ति मिलती है।" },
  Moon: { plantName: "पलाश / ढाक (Palash)", care: "सोमवार को लगाएं; मानसिक अशांति और अनिद्रा मिटती है।" },
  Mars: { plantName: "खैर / कत्था (Khair)", care: "मंगलवार को लगाएं; रक्त दोष और मुकदमों में राहत मिलती है।" },
  Mercury: { plantName: "अपामार्ग / अमरूद (Apamarga or Guava)", care: "बुधवार को लगाएं; त्वचा रोग और कर्ज़ के जाल से मुक्ति मिलती है।" },
  Jupiter: { plantName: "पीपल (Peepal)", care: "बृहस्पतिवार को किसी खुले स्थान पर लगाएं; ज्ञान और कुल वृद्धि होती है।" },
  Venus: { plantName: "गूलर (Gular)", care: "शुक्रवार को लगाएं; दांपत्य विवाद और आर्थिक तंगी दूर होती है।" },
  Saturn: { plantName: "शमी या कड़वी/काली नीम (Shami or Neem)", care: "शनिवार को लगाएं और नित्य जल दें; शनि जनित पीड़ा और असाध्य रोग नष्ट होते हैं।" },
  Rahu: { plantName: "सफेद चंदन या हरी दूर्वा (Chandan or Durva)", care: "बुधवार/शनिवार को सींचें; अज्ञात भय और भ्रम दूर होता है।" },
  Ketu: { plantName: "अश्वगंधा या केला (Ashwagandha or Banana)", care: "गुरुवार को लगाएं; तंत्र बाधा और स्नायु तंत्र की कमज़ोरी मिटती है।" },
};

export interface House8FruitRemedy {
  planet: string;
  fruitName: string;
  donationGuidanceHinglish: string;
}

export const HOUSE_8_FRUITS: Record<string, { fruitName: string; guidance: string }> = {
  Sun: { fruitName: "संतरा / मौसमी (Orange)", guidance: "रविवार को किसी वृद्ध या अस्पताल के रोगी को भेंट करें।" },
  Moon: { fruitName: "रसदार अंगूर या खरबूजा (Sweet Grapes)", guidance: "सोमवार को विधवा या जरूरतमंद महिला को दान करें।" },
  Mars: { fruitName: "लाल खजूर या अनार (Pomegranate or Dates)", guidance: "मंगलवार को किसी मेहनत-मजदूरी करने वाले को खिलाएं।" },
  Mercury: { fruitName: "ताज़ा अमरूद या हरा सेब (Guava)", guidance: "बुधवार को किसी छोटे बालक या विद्यार्थी को भेंट करें।" },
  Jupiter: { fruitName: "पका पपीता या शरीफ़ा (Custard Apple)", guidance: "गुरुवार को किसी मंदिर के पुजारी या बुजुर्ग को दें।" },
  Venus: { fruitName: "अंजीर या मीठे बेर (Figs)", guidance: "शुक्रवार को कन्याओं को सप्रेम खिलाएं।" },
  Saturn: { fruitName: "काले जामुन या काले अंगूर (Black Jamun)", guidance: "शनिवार को सफाईकर्मी या असहाय कुष्ठ रोगी को दें।" },
  Rahu: { fruitName: "कच्चा नारियल पानी (Tender Coconut Water)", guidance: "बुधवार/शनिवार को किसी प्यासे या बीमार व्यक्ति को पिलाएं।" },
  Ketu: { fruitName: "पके हुए पीले केले (Ripe Bananas)", guidance: "गुरुवार को साधु, संन्यासी या मंदिर में दान करें।" },
};

export interface House12DonationRemedy {
  planet: string;
  targetCategory: string;
  donationTypeHinglish: string;
  warningHinglish: string;
}

export const HOUSE_12_DONATIONS: Record<string, { target: string; donation: string; warning: string }> = {
  Sun: { target: "अस्पताल में बेसहारा रोगी", donation: "गरीब मरीजों की दवाइयों का बिल चुकाएं या सरकारी अस्पताल में मुफ्त दवा वितरित कराएं।", warning: "अहंकार में आकर दान न करें, गुप्त रूप से दें।" },
  Moon: { target: "मानसिक तनाव या डिप्रेशन पीड़ित", donation: "मानसिक चिकित्सालय में सेवा करें या प्यासे राहगीरों के लिए शीतल जल की छबील लगाएं।", warning: "भावुक होकर धोखेबाज़ों पर भरोसा न करें।" },
  Mars: { target: "दिव्यांग या दुर्घटनाग्रस्त लोग", donation: "कृत्रिम अंग या बैसाखी दान करें, रक्तदान करें।", warning: "क्रोध में आकर किसी से दुश्मनी न मोल लें।" },
  Mercury: { target: "अनाथ व निर्धन बच्चे", donation: "स्कूल की किताबें, कॉपियां और स्टेशनरी दान करें।", warning: "बिना पढ़े किसी दस्तावेज़ पर हस्ताक्षर न करें।" },
  Jupiter: { target: "सच्चे ज्ञानार्थी व गुरुकुल", donation: "धार्मिक व नैतिक ग्रंथों का वितरण करें, योग्य विद्यार्थी की फीस भरें।", warning: "किसी को गलत या भटकाने वाली सलाह कभी न दें।" },
  Venus: { target: "निर्धन कन्या का विवाह", donation: "गरीब कन्या के विवाह में वस्त्र या राशन का सहयोग करें।", warning: "अनैतिक संबंधों और दिखावे पर धन व्यर्थ न बहाएं।" },
  Saturn: { target: "बेघर व निराश्रित वृद्ध", donation: "वृद्धाश्रम में कम्बल, अन्न या चप्पल-जूते दान करें।", warning: "12वें भाव से कभी चिपकें नहीं; अगर दान नहीं करेंगे तो अस्पताल के बिल के रूप में धन निकल जाएगा।" },
  Rahu: { target: "कुष्ठ आश्रम व मानसिक केंद्र", donation: "सफाई कर्मियों या कुष्ठ रोगियों को भोजन और वस्त्र दें।", warning: "अस्पताल या विदेशी मामलों में किसी पर अंधा भरोसा न करें।" },
  Ketu: { target: "एकांत साधना केंद्र व संन्यासी", donation: "ध्यान केंद्रों या तपस्वियों को आसन व भोजन का प्रबंध कराएं।", warning: "एकांत का सदुपयोग आत्म-चिंतन में करें, अलगाव में नहीं।" },
};

export interface DashaDistanceAnalysis {
  mahadashaPlanet: string;
  antardashaPlanet: string;
  mahadashaNakshatra: string;
  antardashaNakshatra: string;
  distance: number;
  mutualAxis: string;                // e.g. "6/8", "3/11", "2/12", "1/7"
  isTakYog: boolean;                 // 6/8 distance alert
  impactDescriptionHinglish: string;
  takYogRemedyHinglish?: string;
}

export interface TransitNakshatraEvaluationResult {
  activeDashaLord: string;
  activeAntardashaLord?: string;
  targetDateIso: string;

  // Mahadasha Lord's Transit
  transitSign: string;
  transitDegree: number;
  transitNakshatra: string;
  transitNakshatraNumber: number;

  // Navtara for Mahadasha Lord
  natalMoonNakshatra: string;
  taraNumber: number;
  taraName: string;
  taraRelationType: string;
  taraExplanationHinglish: string;

  // Primary Shivling Upachara for Mahadasha Lord
  shivlingRemedy: ShivlingUpachara;

  // Antardasha Lord's Transit & Shivling Upachara
  antardashaTransitSign?: string;
  antardashaTransitNakshatra?: string;
  antardashaTransitNakshatraNumber?: number;
  antardashaShivlingRemedy?: ShivlingUpachara;

  // MD-AD Distance (Tak Yog Scan)
  distanceAnalysis?: DashaDistanceAnalysis;

  // 6th, 8th, 12th House Specific Directives
  house6PlantRemedies: House6PlantRemedy[];
  house8FruitRemedies: House8FruitRemedy[];
  house12DonationRemedies: House12DonationRemedy[];

  // 6th (Blind Faith) vs 12th (Never Believe) Golden Directive
  beliefGuidanceHinglish: {
    house6MessageHinglish: string;
    house12MessageHinglish: string;
  };

  geminiCaseStudyHinglish: string;
  narsinghMandirCaseStudyHinglish: string;
}

const TARA_NAMES = [
  { name: "Janma Tara", relation: "Birth Star", desc: "शारीरिक स्वास्थ्य और मन की स्थिति पर ध्यान देने का समय।" },
  { name: "Sampat Tara", relation: "Wealth & Prosperity", desc: "धन, सम्मान और व्यापारिक लाभ के लिए अत्यंत अनुकूल समय।" },
  { name: "Vipat Tara", relation: "Danger / Hazard", desc: "अड़चनें और अचानक बाधाएं आ सकती हैं; सतर्क रहें और शांति से काम लें।" },
  { name: "Kshema Tara", relation: "Wellbeing & Security", desc: "सुरक्षा, पारिवारिक सुख और कल्याणकारी फलों की प्राप्ति।" },
  { name: "Pratyari Tara", relation: "Obstacle / Enemy", desc: "मतभेद या विरोधियों का सामना हो सकता है; विवादों से दूर रहें।" },
  { name: "Sadhaka Tara", relation: "Success & Fulfillment", desc: "साधना और प्रयासों में बड़ी सफलता मिलने का शुभ समय।" },
  { name: "Vadha Tara", relation: "Severe Trial / Destruction", desc: "कठिन परीक्षा का समय; नए बड़े जोखिम बिल्कुल न लें।" },
  { name: "Mitra Tara", relation: "Friend / Support", desc: "मित्रों और सहयोगियों से पूर्ण सहयोग और मधुर संबंध।" },
  { name: "Parama Mitra Tara", relation: "Best Friend / Great Alliance", desc: "सर्वोत्तम फल, दीर्घकालिक विजय और ईश्वरीय कृपा का समय।" },
];

function pad2(val: number): string {
  return String(val).padStart(2, "0");
}

function formatDateIso(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function evaluateTransitNakshatraRemedy(
  chart: ChartData | null | undefined,
  targetDate?: Date
): TransitNakshatraEvaluationResult | null {
  if (!chart || !chart.planets) return null;

  const date = targetDate || new Date();
  const dateStr = formatDateIso(date);

  // 1. Identify Active Mahadasha & Antardasha
  const activeMD = chart.dashas?.find((d) => d.active) ?? chart.dashas?.[0];
  const activeAD = chart.antardasha?.find((a) => a.active);
  const mdPlanet = activeMD?.planet || "Jupiter";
  const adPlanet = activeAD?.planet || "Saturn";

  // 2. Compute Real-time Transit Chart for target date
  const lat = chart.lat || 28.6139;
  const lon = chart.lon || 77.209;
  const tz = typeof chart.tz === "number" ? chart.tz : 5.5;

  let transitChart: ChartData;
  try {
    transitChart = calculateChart("Transit", dateStr, "12:00", "TransitCity", lat, lon, tz);
  } catch (err) {
    // Fallback if calculateChart fails for any reason
    return null;
  }

  // 3. Locate MD Planet in Transit
  const mdTransitData: PlanetData | undefined = transitChart.planets[mdPlanet];
  const transitLon = mdTransitData ? mdTransitData.lon : 0;
  const transitDegInSign = Number((transitLon % 30).toFixed(2));
  const nakIdx = Math.floor(transitLon / (360 / 27)) % 27; // 0 to 26
  const transitNakNumber = nakIdx + 1; // 1 to 27
  const transitNakName = NAKSHATRA_NAMES[nakIdx] || "Ashwini";
  const transitSignName = mdTransitData?.sign || "Aries";

  // 4. Locate AD Planet in Transit
  const adTransitData: PlanetData | undefined = transitChart.planets[adPlanet];
  const adTransitLon = adTransitData ? adTransitData.lon : 0;
  const adNakIdx = Math.floor(adTransitLon / (360 / 27)) % 27;
  const adTransitNakNumber = adNakIdx + 1;
  const adTransitNakName = NAKSHATRA_NAMES[adNakIdx] || "Ashwini";
  const adTransitSignName = adTransitData?.sign || "Aries";

  // 5. Calculate Navtara from Natal Moon
  const natalMoon = chart.planets.Moon;
  const moonLon = natalMoon ? natalMoon.lon : 0;
  const natalMoonNakIdx = Math.floor(moonLon / (360 / 27)) % 27;
  const natalMoonNakName = NAKSHATRA_NAMES[natalMoonNakIdx] || "Rohini";

  const taraDistance = ((nakIdx - natalMoonNakIdx + 27) % 27) + 1;
  const taraNum = ((taraDistance - 1) % 9) + 1; // 1 to 9
  const taraInfo = TARA_NAMES[taraNum - 1];

  // 6. Primary Shivling Upachara for Mahadasha Lord
  const shivlingRemedy = SHIVLING_27_UPACHARE[nakIdx] || SHIVLING_27_UPACHARE[0];

  // 7. Sub-Period Shivling Upachara for Antardasha Lord (Direct answer to user's question!)
  const antardashaShivlingRemedy = SHIVLING_27_UPACHARE[adNakIdx] || SHIVLING_27_UPACHARE[0];

  // 8. Distance between MD and AD (Tak Yog scan)
  const natalMdPlanetData = chart.planets[mdPlanet];
  const natalAdPlanetData = chart.planets[adPlanet];
  const natalMdNakIdx = Math.floor((natalMdPlanetData?.lon ?? 0) / (360 / 27)) % 27;
  const natalAdNakIdx = Math.floor((natalAdPlanetData?.lon ?? 0) / (360 / 27)) % 27;
  const distanceNak = ((natalAdNakIdx - natalMdNakIdx + 27) % 27) + 1;

  // House distance in chart
  const mdHouse = natalMdPlanetData?.house || 1;
  const adHouse = natalAdPlanetData?.house || 1;
  const houseDiff = ((adHouse - mdHouse + 12) % 12) + 1;
  const isTakYog = houseDiff === 6 || houseDiff === 8;

  const distanceAnalysis: DashaDistanceAnalysis = {
    mahadashaPlanet: mdPlanet,
    antardashaPlanet: adPlanet,
    mahadashaNakshatra: NAKSHATRA_NAMES[natalMdNakIdx],
    antardashaNakshatra: NAKSHATRA_NAMES[natalAdNakIdx],
    distance: distanceNak,
    mutualAxis: `${houseDiff}/${14 - houseDiff === 13 ? 1 : 14 - houseDiff}`,
    isTakYog,
    impactDescriptionHinglish: isTakYog
      ? `महादशा नाथ (${mdPlanet}) और अंतर्दशा नाथ (${adPlanet}) एक-दूसरे से 6/8 के फासले पर हैं, जिसे 'टक योग' कहते हैं। यह दौर गतिरोध, अप्रत्याशित अड़चन और मानसिक तनाव ला सकता है।`
      : `महादशा नाथ और अंतर्दशा नाथ आपस में ${houseDiff}/${14 - houseDiff === 13 ? 1 : 14 - houseDiff} संबंध में हैं, जो सामान्य ऊर्जा प्रवाह बनाए रखता है।`,
    takYogRemedyHinglish: isTakYog
      ? "टक योग के प्रभाव को शांत करने के लिए सोमवार या शनिवार को शिवलिंग पर शुद्ध शीतल जल की अखंड धारा (स्नानम्) चढ़ाएं और दोनों ग्रहों के बीज मंत्र का शांत चित्त से 108 बार जप करें।"
      : undefined,
  };

  // 9. 6th, 8th, 12th House Specific Planet Lists
  const house6PlantRemedies: House6PlantRemedy[] = [];
  const house8FruitRemedies: House8FruitRemedy[] = [];
  const house12DonationRemedies: House12DonationRemedy[] = [];

  for (const [pName, pData] of Object.entries(chart.planets)) {
    if (!pData) continue;
    if (pData.house === 6) {
      const pInfo = HOUSE_6_PLANTS[pName];
      if (pInfo) {
        house6PlantRemedies.push({
          planet: pName,
          plantName: pInfo.plantName,
          careInstructionsHinglish: pInfo.care,
        });
      }
    }
    if (pData.house === 8) {
      const fInfo = HOUSE_8_FRUITS[pName];
      if (fInfo) {
        house8FruitRemedies.push({
          planet: pName,
          fruitName: fInfo.fruitName,
          donationGuidanceHinglish: fInfo.guidance,
        });
      }
    }
    if (pData.house === 12) {
      const dInfo = HOUSE_12_DONATIONS[pName];
      if (dInfo) {
        house12DonationRemedies.push({
          planet: pName,
          targetCategory: dInfo.target,
          donationTypeHinglish: dInfo.donation,
        });
      }
    }
  }

  return {
    activeDashaLord: mdPlanet,
    activeAntardashaLord: adPlanet,
    targetDateIso: dateStr,

    transitSign: transitSignName,
    transitDegree: transitDegInSign,
    transitNakshatra: transitNakName,
    transitNakshatraNumber: transitNakNumber,

    natalMoonNakshatra: natalMoonNakName,
    taraNumber: taraNum,
    taraName: taraInfo.name,
    taraRelationType: taraInfo.relation,
    taraExplanationHinglish: taraInfo.desc,

    shivlingRemedy,

    antardashaTransitSign: adTransitSignName,
    antardashaTransitNakshatra: adTransitNakName,
    antardashaTransitNakshatraNumber: adTransitNakNumber,
    antardashaShivlingRemedy,

    distanceAnalysis,

    house6PlantRemedies,
    house8FruitRemedies,
    house12DonationRemedies,

    beliefGuidanceHinglish: {
      house6MessageHinglish: "छठे भाव या छठे की राशि में स्थित ग्रहों के लिए नियम है: 'अंधा विश्वास रखो, संशय मत करो।' जितना दृढ़ आपका विश्वास रहेगा, उतनी बड़ी विजय मिलेगी। यहाँ उपाय जीवित पौधों को सींचना है।",
      house12MessageHinglish: "बारहवें भाव के मामलों में नियम है: 'कभी अंधा भरोसा मत करो।' यहाँ लालच या धन संचय मत करो; अपनी खुशी से असहायों को दान दो। यदि आप खुद दान नहीं करेंगे, तो बारहवां भाव अस्पताल या कोर्ट के बिलों के ज़रिए धन खींच लेगा।",
    },

    geminiCaseStudyHinglish: "मिथुन लग्न के जातक की चार मंजिला इमारत का विवाद सालों से फंसा हुआ था। जब गोचर में राहु पूर्वाभाद्रपद (25वें नक्षत्र) में आया और उन्होंने 11 बार 'ॐ नमः शिवाय' बोलकर पीले फूल शिवलिंग पर अर्पित किए (मंत्र पुष्पम्), तो अगले ही दिन सुबह 11 बजे विपक्षी ने समझौता कर लिया।",
    narsinghMandirCaseStudyHinglish: "जब किसी व्यक्ति का दशानाथ हस्त नक्षत्र (13वें नक्षत्र) से गुज़र रहा था, तो उन्हें हरिद्वार के प्राचीन नरसिंह मंदिर के बाहर बैठकर शिवलिंग पर बिना टूटे हुए साबुत चावल (अक्षतम्) चढ़ाने की सलाह दी गई, जिससे उनकी दरिद्रता और आर्थिक रुकावटें दूर हो गईं।",
  };
}

