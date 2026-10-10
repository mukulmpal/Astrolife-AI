import type { PlanetName, TransitPlanetResult } from "./transits";
import type { PurchaseVerdict } from "./transit-purchase-guidance";
import type { PlanetPurchaseReport, PlanetPurchaseGuidance } from "./transit-planet-purchase";
import type { LalKitabPurchaseResult } from "@/lib/lal-kitab";

export interface PurchaseItemDefinition {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  category: string;
  keywords: string[];
  primaryPlanet: PlanetName;
  secondaryPlanet?: PlanetName;
  rationale: string;
  lalKitabCaution: string;
  practicalChecks: string[];
}

export interface PurchaseSearchResult {
  item: PurchaseItemDefinition;
  primaryGuidance: PlanetPurchaseGuidance;
  secondaryGuidance?: PlanetPurchaseGuidance;
  finalVerdict: PurchaseVerdict;
  verdictScore: number;
  rulingPlanetsSummary: string;
  liveExplanation: string;
  lalKitabNote: string;
  practicalChecks: string[];
}

export const PURCHASE_CATALOG: PurchaseItemDefinition[] = [
  // ── Smartphones & Gadgets ──
  {
    id: "smartphone-iphone",
    name: "iPhone / Smartphone / Mobile",
    hindiName: "आईफोन / स्मार्टफोन / मोबाइल",
    icon: "📱",
    category: "Electronics & Gadgets",
    keywords: ["iphone", "apple", "samsung", "android", "phone", "mobile", "smartphone", "cellphone", "ios", "gadget", "5g", "फोन", "मोबाइल", "आईफोन", "स्मार्टफोन"],
    primaryPlanet: "Mercury",
    secondaryPlanet: "Rahu",
    rationale: "बुध संचार, प्रोसेसिंग व बुद्धि का स्वामी है जबकि राहु आधुनिक वायरलेस व स्क्रीन तकनीक का। बुध के शुभ होने पर गैजेट लंबे समय तक त्रुटिरहित चलते हैं।",
    lalKitabCaution: "बिना बिल या सेकंड-हैंड फोन कभी मुफ़्त में न लें। बुध-राहु अशांत होने पर डेटा चोरी, बैटरी खराबी या अनावश्यक सर्विसिंग का ख़र्च बढ़ता है।",
    practicalChecks: [
      "IMEI नंबर व ऑफिशियल जीएसटी इनवॉइस ज़रूर जांचें",
      "ब्रांड वारंटी और स्क्रीन रिप्लेसमेंट पॉलिसी कन्फर्म करें",
      "सस्ते ऑनलाइन 'रिफर्बिश' झांसे से बचें",
    ],
  },
  {
    id: "laptop-macbook-pc",
    name: "Laptop / MacBook / Computer",
    hindiName: "लैपटॉप / मैकबुक / कंप्यूटर",
    icon: "💻",
    category: "Electronics & Gadgets",
    keywords: ["laptop", "macbook", "pc", "computer", "desktop", "ipad", "tablet", "dell", "hp", "lenovo", "लैपटॉप", "कंप्यूटर", "मैकबुक"],
    primaryPlanet: "Mercury",
    secondaryPlanet: "Rahu",
    rationale: "कंप्यूटर व्यापार, कोडिंग व ज्ञान का विस्तारक है जो पूर्णतः बुध के अधीन है। राहु इसकी गति और इंटरनेट संपर्क को नियंत्रित करता है।",
    lalKitabCaution: "कामकाजी मशीन हमेशा साफ़-सुथरे स्थान पर रखें। बंद पड़े या खराब लैपटॉप को घर के उत्तर या पूर्व कोने में जमा न होने दें।",
    practicalChecks: [
      "ऑरिजिनल ऑपरेटिंग सिस्टम लाइसेंस व ऑफिशियल वारंटी देखें",
      "RAM और SSD स्टोरेज की वास्तविक क्षमता टेस्ट करें",
      "डिलीवरी के समय सील-पैक बॉक्स का सीरियल नंबर चेक करें",
    ],
  },
  {
    id: "smartwatch-wearables",
    name: "Smartwatch / Earbuds / Wearables",
    hindiName: "स्मार्टवॉच / ईयरबड्स / वियरेबल्स",
    icon: "⌚",
    category: "Electronics & Gadgets",
    keywords: ["smartwatch", "apple watch", "watch", "earbuds", "airpods", "headphones", "bluetooth", "gadget", "घड़ी", "स्मार्टवॉच", "ईयरबड्स"],
    primaryPlanet: "Mercury",
    secondaryPlanet: "Rahu",
    rationale: "घड़ी समय (काल) व बुध का संयुक्त कारक है, जबकि ब्लूटूथ/सेंसर राहु की सूक्ष्म किरणों से संचालित होते हैं।",
    lalKitabCaution: "रुकी हुई या टूटी हुई स्मार्टवॉच घर में न रखें। किसी से मुफ़्त में मिली इलेक्ट्रॉनिक घड़ी समय की गति में भ्रम ला सकती है।",
    practicalChecks: [
      "बैटरी बैकअप व वाटर-रेजिस्टेंस रेटिंग सत्यापित करें",
      "सेंसर (Heart rate/SpO2) की एक्यूरेसी तुरंत चेक करें",
    ],
  },

  // ── Vehicles & Mobility ──
  {
    id: "car-suv-four-wheeler",
    name: "Car / SUV / Four Wheeler",
    hindiName: "नई कार / एसयूवी / चार पहिया वाहन",
    icon: "🚗",
    category: "Vehicles & Mobility",
    keywords: ["car", "suv", "sedan", "automobile", "scorpio", "thar", "creta", "vehicle", "gaadi", "car purchase", "गाड़ी", "कार", "एसयूवी", "वाहन"],
    primaryPlanet: "Venus",
    secondaryPlanet: "Mars",
    rationale: "सुख, लक्ज़री और बैठने का आनंद शुक्र (वाहन-कारक) का है, जबकि इंजन, गति और धातु की बनावट मंगल की शक्ति से चलती है।",
    lalKitabCaution: "वाहन खरीदने के बाद पहले दिन थोड़ा मीठा (गुड़/बताशा) बांटना और किसी ज़रूरतमंद को भोजन कराना मंगल-शुक्र के संतुलन को सुरक्षित रखता है।",
    practicalChecks: [
      "शोरूम PDI (Pre-Delivery Inspection) दिन के उजाले में खुद करें",
      "चेसिस और इंजन नंबर को इंश्योरेंस व आरटीओ पेपर्स से मिलाएं",
      "ओडोमीटर रीडिंग 50 किमी से कम होनी चाहिए",
    ],
  },
  {
    id: "used-car-second-hand",
    name: "Used Car / Second-Hand Vehicle",
    hindiName: "पुरानी / सेकंड-हैंड कार या बाइक",
    icon: "🚙",
    category: "Vehicles & Mobility",
    keywords: ["used car", "second hand", "purani gaadi", "resale car", "used bike", "pre owned", "पुरानी गाड़ी", "सेकंड हैंड कार"],
    primaryPlanet: "Saturn",
    secondaryPlanet: "Mars",
    rationale: "पुरानी व इस्तेमाल शुदा धातु और मशीनों पर शनि का सीधा अधिकार होता है। शनि कमज़ोर हो तो पुरानी गाड़ी बार-बार वर्कशॉप में खड़ी रहती है।",
    lalKitabCaution: "शनिवार या साढ़े साती के कठिन दौर में पुरानी गाड़ी बिना पूरी लीगल जांच के न लें; यह पूर्व स्वामी के शनि-दोष का भार आप पर ला सकती है।",
    practicalChecks: [
      "RTO NOC, चालान हिस्ट्री और बैंक हाइपोथिकेशन क्लीयरेंस जांचें",
      "किसी स्वतंत्र मैकेनिक से इंजन कम्प्रेशन व एक्सीडेंटल हिस्ट्री चेक कराएं",
      "RC ट्रांसफर प्रक्रिया पहले दिन ही शुरू करवाएं",
    ],
  },
  {
    id: "motorcycle-bike-scooter",
    name: "Motorcycle / Bike / Scooter",
    hindiName: "बाइक / मोटरसाइकिल / स्कूटर",
    icon: "🏍️",
    category: "Vehicles & Mobility",
    keywords: ["bike", "motorcycle", "scooter", "activa", "bullet", "two wheeler", "ev scooter", "मोटरसाइकिल", "बाइक", "स्कूटर"],
    primaryPlanet: "Mars",
    secondaryPlanet: "Venus",
    rationale: "दोपहिया वाहन संतुलन, त्वरित गति और मंगल की उग्र ऊर्जा से जुड़ा है। मंगल की शुभ स्थिति यात्रा में सुरक्षा और स्टेबिलिटी देती है।",
    lalKitabCaution: "मंगल वक्री या 8वें भाव में हो तो बहुत तेज़ गति वाली बाइक या लाल रंग की अनटेस्टेड बाइक तुरंत लेने से बचें।",
    practicalChecks: [
      "ब्रेकिंग सिस्टम (ABS) और टायर मैन्युफैक्चरिंग डेट की जांच करें",
      "हेलमेट और सेफ्टी राइडिंग गियर को वाहन के साथ ही अनिवार्य रूप से लें",
    ],
  },

  // ── Gold, Silver & Jewellery ──
  {
    id: "gold-jewellery-sona",
    name: "Gold Jewellery / Sona / Gold Coin",
    hindiName: "सोना / स्वर्ण आभूषण / गोल्ड कॉइन",
    icon: "🪙",
    category: "Precious Metals & Jewellery",
    keywords: ["gold", "sona", "gold coin", "gold bar", "kundan", "swarna", "sohna", "सोना", "स्वर्ण", "गोल्ड"],
    primaryPlanet: "Jupiter",
    secondaryPlanet: "Sun",
    rationale: "स्वर्ण देवगुरु बृहस्पति का साक्षात प्रतीक है और इसका तेज सूर्य से आता है। शुभ गोचर में खरीदा गया सोना घर में बरकत और लक्ष्मी को स्थिर करता है।",
    lalKitabCaution: "सोना कभी गिरवी रखकर नई विलासिता न खरीदें। गुरु कमज़ोर हो तो पीला सोना खरीदने के बाद घर के बुजुर्गों का आशीर्वाद ज़रूर लें।",
    practicalChecks: [
      "BIS 916 हॉलमार्क और HUID (6-digit alphanumeric) कोड अवश्य चेक करें",
      "पक्के जीएसटी बिल पर मेकिंग चार्ज और नेट गोल्ड वेट अलग-अलग लिखवाएं",
    ],
  },
  {
    id: "diamond-jewellery",
    name: "Diamond / Heera Jewellery",
    hindiName: "हीरा / डायमंड ज्वेलरी",
    icon: "💎",
    category: "Precious Metals & Jewellery",
    keywords: ["diamond", "heera", "solitaire", "diamond ring", "हीरा", "डायमंड"],
    primaryPlanet: "Venus",
    secondaryPlanet: "Saturn",
    rationale: "हीरा शुक्र का सर्वोत्कृष्ट रत्न है जो अत्यधिक दबाव (शनि) से तपकर चमकता है। यह आकर्षण, प्रतिष्ठा और दांपत्य आकर्षण को बढ़ाता है।",
    lalKitabCaution: "यदि शुक्र 6ठे भाव में पीड़ित हो या जीवनसाथी से विवाद चल रहा हो, तो अचानक बड़ा हीरा खरीदने से तनाव बढ़ सकता है।",
    practicalChecks: [
      "IGI या GIA सर्टिफिकेशन (4Cs: Cut, Clarity, Color, Carat) की जांच करें",
      "बायबैक (Buyback) व एक्सचेंज पॉलिसी को लिखित में लें",
    ],
  },
  {
    id: "silver-chandi-pearl",
    name: "Silver / Chandi / Pearls",
    hindiName: "चांदी / मोती / चांदी के बर्तन व सिक्के",
    icon: "🥈",
    category: "Precious Metals & Jewellery",
    keywords: ["silver", "chandi", "pearl", "moti", "silver coin", "chandi ke bartan", "चांदी", "मोती", "सिल्वर"],
    primaryPlanet: "Moon",
    secondaryPlanet: "Venus",
    rationale: "चांदी चंद्रमा का सबसे शीतल और मन को शांत रखने वाला धातु है। यह मानसिक संतुलन और घर की तरलता (Cash Flow) को संवारती है।",
    lalKitabCaution: "चांदी का कोई भी बर्तन या सिक्का कभी किसी से मुफ़्त में न लें; माता या सास से आशीर्वाद स्वरूप लेना अत्यंत कल्याणकारी होता है।",
    practicalChecks: [
      "चांदी की शुद्धता (925 स्टर्लिंग या 999 फाइन) की मुहर जांचें",
      "रसोई या पूजा के लिए ठोस चांदी को प्राथमिकता दें",
    ],
  },

  // ── Property & Real Estate ──
  {
    id: "residential-plot-land",
    name: "Plot / Land / Zameen",
    hindiName: "प्लॉट / ज़मीन / आवासीय भूखंड",
    icon: "🏞️",
    category: "Property & Real Estate",
    keywords: ["plot", "land", "zameen", "bhumi", "agricultural land", "khet", "zameen purchase", "प्लॉट", "जमीन", "ज़मीन", "भूमि"],
    primaryPlanet: "Mars",
    secondaryPlanet: "Saturn",
    rationale: "मंगल 'भूमिपुत्र' है और ज़मीन का अधिपति है, जबकि ज़मीन की उम्र और स्थायित्व शनि के नियंत्रण में है।",
    lalKitabCaution: "विवादित, श्मशान के निकट, या दक्षिण मुखी त्रिकोणीय ज़मीन सस्ते दाम पर भी न लें। मंगल-शनि अनुकूल होने पर ही रजिस्ट्री कराएं।",
    practicalChecks: [
      "तहसीलदार रिकॉर्ड (खतौनी/जमाबंदी) और 30 साल का टाइटल सर्च कराएं",
      "मौके पर जाकर चौहद्दी और सरकारी सीमांकन की भौतिक जांच करें",
      "कोई पूर्व बैंक लोन या अदालती स्टे तो नहीं, सर्च रिपोर्ट लें",
    ],
  },
  {
    id: "flat-house-makan",
    name: "Flat / Apartment / Built House",
    hindiName: "फ्लैट / मकान / तैयार घर",
    icon: "🏠",
    category: "Property & Real Estate",
    keywords: ["flat", "apartment", "house", "makan", "villa", "home", "property", "ghar", "फ्लैट", "मकान", "घर", "प्रॉपर्टी"],
    primaryPlanet: "Mars",
    secondaryPlanet: "Venus",
    rationale: "दीवारें व ईंट-पत्थर मंगल के हैं, जबकि घर का वास्तु, आंतरिक सौंदर्य, वेंटिलेशन और गृह-शांति शुक्र और चंद्रमा से तय होती है।",
    lalKitabCaution: "घर की नींव या पज़ेशन लेते समय सूर्य का दक्षिणायन या राहु का भारी गोचर हो तो गृह-प्रवेश की तिथि विद्वान से शोधित कराएं।",
    practicalChecks: [
      "RERA अप्रूवल व कंप्लीशन सर्टिफिकेट (OC/CC) चेक करें",
      "पानी, सीवरेज, लिफ्ट और मेंटेनेंस फंड की लिखित शर्तें पढ़ें",
    ],
  },
  {
    id: "commercial-shop-office",
    name: "Shop / Commercial Office Space",
    hindiName: "दुकान / कमर्शियल ऑफिस",
    icon: "🏢",
    category: "Property & Real Estate",
    keywords: ["shop", "office", "commercial", "showroom", "godown", "dukan", "दुकान", "ऑफिस", "कमर्शियल"],
    primaryPlanet: "Mercury",
    secondaryPlanet: "Saturn",
    rationale: "दुकान का मुख्य उद्देश्य व्यापार, ग्राहक और खाता-बही है जो बुध से चलता है। स्थान का टिकाऊपन शनि देता है।",
    lalKitabCaution: "जिस दुकान में पहले कई व्यापारियों को भारी नुकसान हुआ हो, उसे बिना वास्तु शुद्धि और बुध-शनि शांति के न खरीदें।",
    practicalChecks: [
      "कमर्शियल लैंड यूज़ (CLU) और फायर NOC कन्फर्म करें",
      "फुटफॉल और पार्किंग की व्यावहारिक स्थिति का जायज़ा लें",
    ],
  },

  // ── Home Appliances ──
  {
    id: "television-smart-tv",
    name: "Smart TV / LED Television",
    hindiName: "स्मार्ट टीवी / एलईडी टेलीविजन",
    icon: "📺",
    category: "Home Appliances",
    keywords: ["tv", "television", "smart tv", "led", "oled", "sony", "samsung tv", "स्क्रीन", "टीवी", "टेलीविजन"],
    primaryPlanet: "Mercury",
    secondaryPlanet: "Rahu",
    rationale: "टीवी दृश्य-श्रव्य (Audio-Visual) माध्यम है जहाँ बुध की बुद्धि और राहु का मायावी विजुअल एक साथ काम करते हैं।",
    lalKitabCaution: "बेडरूम में सिरहाने के ठीक सामने विशाल टीवी स्क्रीन न लगाएं, यह नींद में राहु के दुष्प्रभाव और अनिद्रा को जन्म देता है।",
    practicalChecks: [
      "पैनल वारंटी (कम से कम 2-3 वर्ष) अवश्य लें",
      "HDMI eARC और साउंड आउटपुट की कनेक्टिविटी चेक करें",
    ],
  },
  {
    id: "refrigerator-fridge",
    name: "Refrigerator / Fridge",
    hindiName: "फ्रिज / रेफ्रिजरेटर",
    icon: "🧊",
    category: "Home Appliances",
    keywords: ["fridge", "refrigerator", "deep freezer", "फ्रिज", "रेफ्रिजरेटर"],
    primaryPlanet: "Moon",
    secondaryPlanet: "Rahu",
    rationale: "शीतलता (Cooling) और अन्न-जल का संरक्षण चंद्रमा का कार्य है, जबकि गैस-कंप्रेसर राहु और मंगल का तकनीकी मिश्रण है।",
    lalKitabCaution: "फ्रिज में बासी और खराब हो चुका भोजन हफ़्तों तक सड़ने न दें; यह घर की चंद्र-ऊर्जा को दूषित कर गृह क्लेश बढ़ाता है।",
    practicalChecks: [
      "BEE 4 या 5 स्टार एनर्जी रेटिंग चेक करें",
      "इन्वर्टर कंप्रेसर की 10 साल की वारंटी सुनिश्चित करें",
    ],
  },
  {
    id: "air-conditioner-ac",
    name: "Air Conditioner (AC)",
    hindiName: "एसी / एयर कंडीशनर",
    icon: "❄️",
    category: "Home Appliances",
    keywords: ["ac", "air conditioner", "split ac", "window ac", "cooler", "एसी", "एयर कंडीशनर"],
    primaryPlanet: "Moon",
    secondaryPlanet: "Venus",
    rationale: "गर्मी का शमन कर सुखद व ठंडी हवा देना चंद्रमा और शुक्र का परम सुख है।",
    lalKitabCaution: "एसी से टपकता हुआ पानी घर के मुख्य द्वार पर न गिरे, यह धन-हानि और स्वास्थ्य पर विपरीत प्रभाव डालता है।",
    practicalChecks: [
      "कमरे के साइज़ के अनुसार सही टन (1 Ton / 1.5 Ton) चुनें",
      "कॉपर कंडेनसर कॉइल व स्टेबलाइज़र की आवश्यकता चेक करें",
    ],
  },
  {
    id: "water-purifier-ro",
    name: "Water Purifier / RO / Water Tank",
    hindiName: "वाटर प्यूरीफायर / आरओ / पानी की टंकी",
    icon: "🚰",
    category: "Home Appliances",
    keywords: ["ro", "water purifier", "water filter", "water tank", "aquaguard", "kent", "आरओ", "पानी का फिल्टर"],
    primaryPlanet: "Moon",
    rationale: "जल का सीधा संबंध चंद्रमा से है। शुद्ध जल का सेवन शरीर के वात-कफ-पित्त और मन के तनाव को नियंत्रित रखता है।",
    lalKitabCaution: "घर में रिसता हुआ नल या आरओ का व्यर्थ बहता पानी चंद्रमा की बर्बादी और अकारण चिंता का प्रतीक है; इसे तुरंत ठीक कराएं।",
    practicalChecks: [
      "पानी के TDS स्तर के अनुसार सही टेक्नोलॉजी (RO + UV + UF) चुनें",
      "वार्षिक मेंटेनेंस कॉन्ट्रैक्ट (AMC) की दरें पहले से जान लें",
    ],
  },

  // ── Shoes, Leather & Heavy Hardware ──
  {
    id: "leather-shoes-footwear",
    name: "Shoes / Leather Footwear",
    hindiName: "जूते / चमड़े के जूते व सैंडल",
    icon: "👞",
    category: "Footwear & Leather",
    keywords: ["shoes", "shoe", "footwear", "leather shoes", "boots", "sneakers", "joota", "जूते", "जूता", "चप्पल"],
    primaryPlanet: "Saturn",
    rationale: "पैरों और चमड़े का एकमात्र अधिपति शनिदेव हैं। नए जूते पैरों के चक्र और शनि की ऊर्जा को सीधे प्रभावित करते हैं।",
    lalKitabCaution: "किसी का उतरा हुआ या पुराना जूता कभी न पहनें और न ही मुफ़्त में लें। शनिवार को नए जूते खरीदने के बजाय मंगलवार या शुक्रवार को प्राथमिकता दें।",
    practicalChecks: [
      "सोल की कुशनिंग और आर्च सपोर्ट की जांच करें",
      "अनावश्यक तंग जूते न खरीदें जो नसों पर दबाव डालें",
    ],
  },
  {
    id: "leather-bag-wallet",
    name: "Leather Bag / Wallet / Belt",
    hindiName: "चमड़े का बैग / पर्स / बेल्ट",
    icon: "👜",
    category: "Footwear & Leather",
    keywords: ["leather bag", "wallet", "purse", "belt", "leather jacket", "chamda", "पर्स", "बटुआ", "चमड़े का बैग", "बेल्ट"],
    primaryPlanet: "Saturn",
    secondaryPlanet: "Venus",
    rationale: "पर्स में लक्ष्मी (शुक्र) का वास होता है लेकिन चमड़ा शनि का उपादान है। दोनों का तालमेल सोच-समझकर होना चाहिए।",
    lalKitabCaution: "फटा हुआ पर्स कभी इस्तेमाल न करें और उसमें पुराने फालतू बिल व दवाइयां न रखें। किसी से मुफ़्त में चमड़े का बटुआ न लें।",
    practicalChecks: [
      "वास्तविक लेदर की प्रामाणिकता और सिलाई की फिनिशिंग जांचें",
      "पर्स में पहला नोट किसी बड़े का आशीर्वाद स्वरूप रखें",
    ],
  },
  {
    id: "heavy-machinery-tools",
    name: "Heavy Machinery / Factory Equipment",
    hindiName: "भारी मशीनरी / फैक्ट्री उपकरण / लोहा",
    icon: "⚙️",
    category: "Machinery & Industry",
    keywords: ["machinery", "factory machine", "generator", "iron", "steel", "tools", "lathe", "hardware", "लोहा", "मशीन", "मशीनरी"],
    primaryPlanet: "Saturn",
    secondaryPlanet: "Mars",
    rationale: "लोहा और भारी उद्योग शनि के हैं, जबकि मशीन का मोशन और काटने/घूमने की ऊर्जा मंगल से आती है।",
    lalKitabCaution: "जंग लगा या टूटा हुआ लोहा घर या कारखाने में जमा न रहने दें; यह शनि के क्रूर प्रभाव को आमंत्रित करता है।",
    practicalChecks: [
      "मशीन का लोड टेस्ट और मोटर की वारंटी लिखित में लें",
      "ऑपरेटिंग सेफ्टी सर्टिफिकेशन व अर्थिंग चेक करें",
    ],
  },

  // ── Luxury, Fashion & Lifestyle ──
  {
    id: "designer-clothes-fashion",
    name: "Designer Clothes / Luxury Apparel",
    hindiName: "डिजाइनर कपड़े / रेशमी परिधान / फैशन",
    icon: "👗",
    category: "Fashion & Lifestyle",
    keywords: ["clothes", "dress", "suit", "saree", "designer wear", "silk", "kapde", "fashion", "कपड़े", "साड़ी", "सूट", "वस्त्र"],
    primaryPlanet: "Venus",
    rationale: "सुंदर वस्त्र, रेशम और आकर्षण का कारक शुक्र है। शुभ गोचर में खरीदे वस्त्र आत्मविश्वास और समाज में आभा बढ़ाते हैं।",
    lalKitabCaution: "कर्ज़ लेकर या दूसरों को दिखाने के लिए अत्यधिक दिखावटी वस्त्र न खरीदें; यह शुक्र को दूषित करता है।",
    practicalChecks: [
      "फैब्रिक कंपोज़िशन और ड्राई क्लीनिंग निर्देश पढ़ें",
      "फिटिंग और अल्टरेशन की सुविधा पहले कन्फर्म करें",
    ],
  },
  {
    id: "perfume-fragrance",
    name: "Perfume / Itr / Luxury Fragrance",
    hindiName: "इत्र / परफ्यूम / सुगंधित द्रव्य",
    icon: "🌸",
    category: "Fashion & Lifestyle",
    keywords: ["perfume", "fragrance", "deodorant", "itr", "attar", "scent", "इत्र", "परफ्यूम", "सुगंध"],
    primaryPlanet: "Venus",
    rationale: "सुगंध शुक्र की प्रत्यक्ष अभिव्यक्ति है। प्राकृतिक सुगंध मन को शांत कर नकारात्मक स्पंदनों को दूर करती है।",
    lalKitabCaution: "सस्ते केमिकल युक्त या सिरदर्द देने वाले तीखे सिंथेटिक परफ्यूम से बचें; यह राहु को उत्तेजित करते हैं।",
    practicalChecks: [
      "प्राकृतिक बेस (Alcohol-free Itr) को प्राथमिकता दें",
      "त्वचा पर टेस्ट करके एलर्जी की संभावना जांचें",
    ],
  },
  {
    id: "luxury-watch",
    name: "Luxury Watch / Premium Timepiece",
    hindiName: "लक्ज़री घड़ी / महंगी घड़ियां",
    icon: "⏱️",
    category: "Fashion & Lifestyle",
    keywords: ["luxury watch", "rolex", "tag heuer", "tissot", "omega", "expensive watch", "महंगी घड़ी"],
    primaryPlanet: "Venus",
    secondaryPlanet: "Mercury",
    rationale: "लक्ज़री घड़ी प्रतिष्ठा (सूर्य), सुंदरता (शुक्र) और समय के सम्मान (शनि/बुध) का संगम है।",
    lalKitabCaution: "घड़ी अगर कभी बंद हो जाए तो उसे तुरंत रिपेयर कराएं या सेल बदलें; बंद घड़ी भाग्य की गति को रोकती है।",
    practicalChecks: [
      "ऑथेंटिसिटी कार्ड और इंटरनेशनल वारंटी बुकलेट लें",
      "वॉटर-रेजिस्टेंस और ऑटोमैटिक मूवमेंट चेक करें",
    ],
  },

  // ── Sacred & Spiritual Items ──
  {
    id: "puja-spiritual-items",
    name: "Puja Items / Mandir / Idol",
    hindiName: "पूजा सामग्री / मंदिर / भगवान की मूर्ति",
    icon: "🪔",
    category: "Spiritual & Sacred",
    keywords: ["puja", "mandir", "idol", "murti", "hawan", "shankh", "spiritual", "puja items", "पूजा", "मूर्ति", "मंदिर", "शंख"],
    primaryPlanet: "Jupiter",
    secondaryPlanet: "Ketu",
    rationale: "ईश्वर की आराधना, मंदिर का निर्माण और सात्विक वस्तुएं बृहस्पति व केतु के पवित्र अनुशासन में आती हैं।",
    lalKitabCaution: "घर में खंडित मूर्ति या बिना प्राण-प्रतिष्ठा वाली भारी मूर्तियां न रखें। किसी से अनजानी साधना की सामग्री मुफ़्त में न लें।",
    practicalChecks: [
      "पीतल, तांबे या अष्टधातु की शुद्धता परखें",
      "मूर्ति सौम्य और आशीर्वाद मुद्रा में होनी चाहिए",
    ],
  },
  {
    id: "rudraksha-sacred-beads",
    name: "Rudraksha / Sacred Mala",
    hindiName: "रुद्राक्ष / स्फटिक / जप माला",
    icon: "📿",
    category: "Spiritual & Sacred",
    keywords: ["rudraksha", "mala", "sphatik", "tulsi mala", "rudraksh", "रुद्राक्ष", "माला", "तुलसी माला"],
    primaryPlanet: "Jupiter",
    secondaryPlanet: "Sun",
    rationale: "रुद्राक्ष भगवान शिव का साक्षात अश्रु है, जो हृदय गति और आध्यात्मिक ऊर्जा को स्थिर करता है।",
    lalKitabCaution: "बिना परीक्षण या नकली प्लास्टिक रुद्राक्ष न पहनें। रुद्राक्ष धारण करने के बाद सात्विक आचरण बनाए रखें।",
    practicalChecks: [
      "लैब टेस्टेड ओरिजिनल नेपाल/इंडोनेशियाई रुद्राक्ष ही लें",
      "उचित प्राण-प्रतिष्ठा और गंगाजल शुद्धिकरण के बाद ही धारण करें",
    ],
  },

  // ── Investments & Financial Assets ──
  {
    id: "stocks-equity-trading",
    name: "Stocks / Shares / Equity Trading",
    hindiName: "शेयर / स्टॉक्स / इंट्राडे ट्रेडिंग",
    icon: "📈",
    category: "Investments & Finance",
    keywords: ["stocks", "shares", "trading", "equity", "nifty", "sensex", "intraday", "demat", "शेयर", "स्टॉक्स", "ट्रेडिंग"],
    primaryPlanet: "Mercury",
    secondaryPlanet: "Rahu",
    rationale: "शेयर बाज़ार गणना, सूचना और त्वरित निर्णय (बुध) तथा अनिश्चितता और लहर (राहु) का संयुक्त खेल है।",
    lalKitabCaution: "राहु या बुध के पीड़ित होने पर उधार लेकर या FOMO (लालच) में आकर पेनी स्टॉक्स या भारी लीवरेज पर ट्रेडिंग न करें।",
    practicalChecks: [
      "कंपनी के फंडामेंटल्स (P/E, Debt, ROCE) खुद पढ़ें",
      "स्टॉपलॉस (Stop Loss) के बिना कभी ट्रेड न लें",
    ],
  },
  {
    id: "mutual-funds-sip",
    name: "Mutual Funds / Long-Term SIP",
    hindiName: "म्यूचुअल फंड / एसआईपी / दीर्घकालिक निवेश",
    icon: "📊",
    category: "Investments & Finance",
    keywords: ["mutual fund", "sip", "index fund", "elss", "investment", "म्यूचुअल फंड", "एसआईपी", "निवेश"],
    primaryPlanet: "Jupiter",
    secondaryPlanet: "Mercury",
    rationale: "दीर्घकालिक धन संचय, धैर्य और कंपाउंडिंग गुरु (देवगुरु) के आशीर्वाद से फलती-फूलती है।",
    lalKitabCaution: "गुरु के मजबूत होने पर शुरू की गई नियमित बचत आने वाली पीढ़ियों के लिए स्थाई संबल बनती है।",
    practicalChecks: [
      "डायरेक्ट प्लान चुनें (रेगुलर प्लान के ब्रोकरेज से बचें)",
      "अपने वित्तीय लक्ष्यों के अनुसार 5-10 साल का नजरिया रखें",
    ],
  },
  {
    id: "crypto-bitcoin-speculative",
    name: "Cryptocurrency / Bitcoin / Speculative Assets",
    hindiName: "क्रिप्टोकरेंसी / बिटकॉइन / सट्टा निवेश",
    icon: "⚡",
    category: "Investments & Finance",
    keywords: ["crypto", "bitcoin", "ethereum", "web3", "token", "speculation", "lottery", "क्रिप्टो", "बिटकॉइन", "सट्टा"],
    primaryPlanet: "Rahu",
    rationale: "अमूर्त (Virtual) धन, एल्गोरिदम और बिना भौतिक आधार वाली अकूत संपत्ति पर पूर्णतः राहु का आधिपत्य है।",
    lalKitabCaution: "राहु जब 8वें या 12वें भाव में हो तो क्रिप्टो में रातों-रात पूंजी शून्य होने का भारी ख़तरा रहता है। केवल वही धन लगाएं जो डूब भी जाए तो नींद न उड़े।",
    practicalChecks: [
      "हार्डवेयर वॉलेट (Ledger) में प्राइवेट कीज़ सुरक्षित रखें",
      "सोशल मीडिया हाइप और टेलीग्राम पंप-एंड-डंप चैनलों से दूर रहें",
    ],
  },

  // ── Fitness & Sports ──
  {
    id: "gym-fitness-equipment",
    name: "Gym Equipment / Treadmill / Fitness Gear",
    hindiName: "जिम उपकरण / ट्रेडमिल / फिटनेस गियर",
    icon: "🏋️",
    category: "Fitness & Sports",
    keywords: ["gym", "fitness", "treadmill", "dumbbells", "weights", "workout", "protein", "जिम", "ट्रेडमिल", "डंबल"],
    primaryPlanet: "Mars",
    rationale: "शारीरिक बल, पसीना, मांसपेशियां और इच्छाशक्ति मंगल की साक्षात ऊर्जा हैं।",
    lalKitabCaution: "जिम उपकरण खरीदकर घर में धूल फांकने के लिए न छोड़ें; मंगल की ऊर्जा का सक्रिय उपयोग ही शुभ फल देता है।",
    practicalChecks: [
      "मोटर क्षमता (Continuous HP) और वजन सहने की क्षमता जांचें",
      "सुरक्षा सेफ्टी-की और इमरजेंसी स्टॉप बटन चेक करें",
    ],
  },
];

// Helper to find planet guidance
function findGuidance(
  planetName: PlanetName | undefined,
  planetReport: PlanetPurchaseReport | null
): PlanetPurchaseGuidance | undefined {
  if (!planetName || !planetReport) return undefined;
  return planetReport.planets.find((p) => p.planet === planetName);
}

// Compute dynamic verdict combining primary planet, secondary planet, and lal kitab
function computeItemVerdict(
  item: PurchaseItemDefinition,
  primaryGuidance: PlanetPurchaseGuidance,
  secondaryGuidance?: PlanetPurchaseGuidance,
  lalKitabResults?: LalKitabPurchaseResult[]
): { finalVerdict: PurchaseVerdict; verdictScore: number; liveExplanation: string } {
  let score = primaryGuidance.score;
  let verdict = primaryGuidance.verdict;

  // Secondary planet influence (e.g. Rahu for tech, Mars for cars, Saturn for property)
  if (secondaryGuidance) {
    if (secondaryGuidance.verdict === "AVOID" && verdict !== "AVOID") {
      verdict = "WAIT";
      score = Math.min(score, secondaryGuidance.score);
    } else if (secondaryGuidance.verdict === "WAIT" && verdict === "BUY") {
      verdict = "BUY_CAREFULLY";
      score = Math.round((score * 0.65) + (secondaryGuidance.score * 0.35));
    }
  }

  // Lal Kitab check for this planet
  const lkHit = lalKitabResults?.find(
    (lk) => lk.planet === item.primaryPlanet || (item.secondaryPlanet && lk.planet === item.secondaryPlanet)
  );

  if (lkHit?.verdict === "AVOID") {
    verdict = "AVOID";
  } else if (lkHit?.verdict === "GIFT_CAUTION" || lkHit?.verdict === "CAUTION") {
    if (verdict === "BUY") verdict = "BUY_CAREFULLY";
  }

  // Generate dynamic live sentence
  const primaryNameHindi = primaryGuidance.hindiName;
  const secondaryPart = secondaryGuidance
    ? ` और ${secondaryGuidance.hindiName} (${secondaryGuidance.score}/100)`
    : "";
  
  let liveExplanation = "";
  if (verdict === "BUY") {
    liveExplanation = `आज ${primaryNameHindi} (${primaryGuidance.score}/100)${secondaryPart} का गोचर आपके लिए पूरी तरह अनुकूल है। इस श्रेणी की खरीद में स्थिरता और शुभता रहेगी।`;
  } else if (verdict === "BUY_CAREFULLY") {
    liveExplanation = `आज ${primaryNameHindi} (${primaryGuidance.score}/100)${secondaryPart} का प्रभाव मिश्रित है। खरीद संभव है, बशर्ते आप बिल, गारंटी और बजट की सीमा न लांघें।`;
  } else if (verdict === "WAIT") {
    liveExplanation = `वर्तमान गोचर में ${primaryNameHindi} (${primaryGuidance.score}/100)${secondaryPart} पर दबाव है। यदि बहुत आवश्यक न हो, तो इस वस्तु की खरीद कुछ दिन टालना बेहतर रहेगा।`;
  } else {
    liveExplanation = `आज ${primaryNameHindi} (${primaryGuidance.score}/100)${secondaryPart} प्रतिकूल या संवेदनशील भाव में है। इस समय यह खरीद अनावश्यक ख़र्च, खराबी या मानसिक तनाव दे सकती है।`;
  }

  return {
    finalVerdict: verdict,
    verdictScore: score,
    liveExplanation,
  };
}

/**
 * Searches the purchase catalog against a user query and calculates real-time guidance
 */
export function searchPurchaseCatalog(
  query: string,
  planetReport: PlanetPurchaseReport | null,
  lalKitabResults: LalKitabPurchaseResult[] = []
): PurchaseSearchResult[] {
  if (!query || !query.trim() || !planetReport) return [];

  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/[\s,+/_-]+/).filter(Boolean);

  // Score each catalog item
  const scoredItems = PURCHASE_CATALOG.map((item) => {
    let matchScore = 0;

    // Exact ID or name match
    if (item.id === cleanQuery || item.name.toLowerCase() === cleanQuery || item.hindiName.toLowerCase() === cleanQuery) {
      matchScore += 100;
    }

    // Name contains query
    if (item.name.toLowerCase().includes(cleanQuery) || item.hindiName.toLowerCase().includes(cleanQuery)) {
      matchScore += 50;
    }

    // Keyword match
    for (const kw of item.keywords) {
      if (kw === cleanQuery) {
        matchScore += 60;
        break;
      }
      if (kw.includes(cleanQuery) || cleanQuery.includes(kw)) {
        matchScore += 35;
      }
      // Token overlap
      for (const token of queryTokens) {
        if (token.length >= 2 && kw.includes(token)) {
          matchScore += 15;
        }
      }
    }

    return { item, matchScore };
  });

  const matched = scoredItems
    .filter((entry) => entry.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);

  return matched.map(({ item }) => {
    const primaryGuidance = findGuidance(item.primaryPlanet, planetReport) ?? planetReport.planets[0];
    const secondaryGuidance = findGuidance(item.secondaryPlanet, planetReport);
    const { finalVerdict, verdictScore, liveExplanation } = computeItemVerdict(
      item,
      primaryGuidance,
      secondaryGuidance,
      lalKitabResults
    );

    const rulingPlanetsSummary = item.secondaryPlanet
      ? `${item.primaryPlanet} (${primaryGuidance.hindiName}) + ${item.secondaryPlanet}`
      : `${item.primaryPlanet} (${primaryGuidance.hindiName})`;

    return {
      item,
      primaryGuidance,
      secondaryGuidance,
      finalVerdict,
      verdictScore,
      rulingPlanetsSummary,
      liveExplanation,
      lalKitabNote: item.lalKitabCaution,
      practicalChecks: item.practicalChecks,
    };
  });
}

