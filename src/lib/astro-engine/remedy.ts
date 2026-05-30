import { buildAntarDasha, type ChartData } from "./calculations";

// ── Lal Kitab Amrit — Planet × House upays (Hindi) ─────────────────────
const LK_AMRIT_DATA: Record<string, Record<number, { upay: string[] }>> = {
  Jupiter: {
    1:  { upay: ["संतों और भिक्षुओं को कपड़े दान करें और उन्हें भोजन खिलाने की भी व्यवस्था करें।", "धार्मिक स्थानों पर बुध, शुक्र और शनि से संबंधित वस्तुयें दान करें।", "यदि शनि 5वें घर में स्थित है, तो घर का निर्माण न करें।", "यदि शनि 9वें भाव में स्थित है, तो शनि से संबंधित कोई भी मशीनरी न खरीदें।", "अपने भाग्य पर विश्वास रखें और कोई भी दान, मदद न लें।"] },
    2:  { upay: ["हमेशा दूसरों के साथ अच्छा व्यवहार करना चाहिए।", "मंदिर के पुजारी को पीले कपड़े में लपेट कर चना दाल दान करें।", "साँप को दूध पिलाना भी आपके लिए लाभदायक सिद्ध होगा।", "मेहमानों का सम्मान करना चाहिए और उनकी अच्छी देखभाल करनी चाहिए।", "केसर और हल्दी का तिलक लगाना भी आपके लिए लाभदायक होगा।"] },
    3:  { upay: ["9 वर्ष से छोटी लड़कियों की सेवा करें।", "केसर या हल्दी का तिलक लगाएं।", "पीपल के पेड़ की पूजा करें।", "भगवान विष्णु से प्रार्थना करें।", "पुखराज पहनना आपके लिए लाभदायक रहेगा।", "ब्राह्मण या अपने परिवार के पुजारी का ध्यान रखें।"] },
    4:  { upay: ["घर में मंदिर का निर्माण नहीं करवाना चाहिए।", "अपने बड़ों का ध्यान रखना चाहिए।", "साँप को दूध पिलाएं।", "तीर्थ यात्रा पर जाएं और भगवान से प्रार्थना करें।"] },
    5:  { upay: ["कुत्ता पालें।", "भगवान गणेश से प्रार्थना करें।", "स्कूल शिक्षक का ध्यान रखना।", "कोई दान या उपहार स्वीकार न करें।", "साधुओं और पुजारियों का ख्याल रखना।"] },
    6:  { upay: ["कुत्ता पाले या कुत्ते को मीठी रोटी खिलाएं।", "सोने के आभूषण पहनना।", "पीपल के पेड़ को पानी दें।", "अपनी आर्थिक प्रगति के लिए 600 ग्राम चने की दाल का दान लगातार छह दिनों तक किसी धार्मिक स्थान पर करें।", "अपने मेहमानों और बुजुर्ग लोगों का ख्याल रखें।"] },
    7:  { upay: ["भगवान शिव की आराधना करें।", "मेंढकों को न मारना।", "अपने घर के परिसर के भीतर मंदिर का निर्माण न करवाएं।", "सोने को पीले कपड़े में लपेटें और फिर अपने पास रखें।", "पीपल के वृक्ष को जल अर्पित करें।"] },
    8:  { upay: ["अपने गले में सोने या पीले रंग का धागा पहनें।", "8 दिनों तक किसी मंदिर में 200 ग्राम चने की दाल दान करें।", "श्मशान घाट में पीपल का पेड़ लगाएं।", "लगातार 3 दिनों तक किसी मंदिर में 4 हल्दी के टुकड़े दान करें।", "वृद्ध साधु या आध्यात्मिक व्यक्ति का ध्यान रखें।"] },
    9:  { upay: ["अपने घर के फर्श के नीचे चांदी और शहद दबाएं।", "लगातार 43 दिनों तक नीम के पेड़ के नीचे एक चौकोर चांदी का सिक्का दबाएं।", "प्रतिदिन मंदिर जाएं और हमेशा सत्य बोले।", "शराब का सेवन न करें।", "गंगा नदी में स्नान करें और गंगा जल पियें।"] },
    10: { upay: ["लगातार 43 दिनों तक बहते पानी में तांबे का सिक्का प्रवाहित करें।", "रविवार के दिन 400 ग्राम या 4 किलो गुड़ बहते पानी में प्रवाहित करें।", "लगातार 43 दिनों तक मंदिर में बादाम चढ़ाएं।", "अपना सिर खुला न रखें, इसे हमेशा ढक कर रखें।"] },
    11: { upay: ["कफ़न दान करें।", "तांबे की चूड़ी, कड़ा पहनें।", "अपने शरीर पर सोना पहनें।", "पीपल के वृक्ष को जल अर्पित करें।", "अपने साथ एक पीला रूमाल रखें।", "अपने वादे निभाता रहे।"] },
    12: { upay: ["पीपल के पेड़ को पानी दें। पुखराज पहनें।", "किसी वृद्ध ब्राह्मण की देखभाल करें और उसे पीले वस्त्र दान करें।", "केसर या हल्दी का तिलक लगाएं। गले में कोई भी माला न पहनें।", "अपने सिर को हमेशा ढक कर रखें।", "साधु-सन्यासियों का ध्यान रखें।"] },
  },
  Ketu: {
    1:  { upay: ["यदि आपके मामा पर केतु का प्रतिकूल प्रभाव दिखाई दे रहा है, तो बंदर को गुड़ खिलाएं।", "बुध के उपाय करना।", "यदि आपके बच्चे कष्ट या कठिनाई में हैं, तो एक मंदिर में एक काले और सफेद रंग का कंबल दान करें।", "अपने दोनों पैरों के अंगूठों में चांदी पहनें।"] },
    2:  { upay: ["माथे पर हल्दी, केसर या पीली चंदन की लकड़ी का लेप लगाना फायदेमंद होगा।", "मंदिर में इमली या तिल का दान करें।"] },
    3:  { upay: ["केसर का तिलक लगाएं।", "फोड़े फिंसी के रोगों आदि के दौरान चने या केसर को बहते पानी में प्रवाहित करें।"] },
    4:  { upay: ["अपने परिवार के पुजारी को पीले कपड़े में सोना, पीली चना दाल या पीली वस्तुयें दान करें और आशीर्वाद लें।", "चने की दाल को बहते पानी में बहाएं।", "अपने मन की शांति के लिए चांदी पहनें।", "गणेश चतुर्थी पर उपवास रखें।"] },
    5:  { upay: ["चावल, दूध, गुड़ आदि का दान करें।", "पानी में तिल, पीला नींबू, केला आदि डालें या उन्हें दान करें।", "बृहस्पति के उपाय करे।"] },
    6:  { upay: ["अपने बाएं हाथ में सोने की अंगूठी पहनें।", "बच्चे के जन्म के लिए कुत्ता पालना।", "अपनी बहन, मामी, चाची, और बेटी का ख्याल रखना।", "दूध में केसर मिलाएं और फिर इसे पीएं।"] },
    7:  { upay: ["झूठे वादे कभी न करें।", "अहंकार दिखाना केतु को प्रतिकूल बनाता है।", "अपने माथे पर केसर का तिलक लगाएं।", "बहते पानी में 4 नींबू लगातार 4 दिन तक फेंके।", "कपिला गाय की देखभाल करें।"] },
    8:  { upay: ["धार्मिक स्थान पर पीले कपड़े में लपेट 200 ग्राम चने की दाल का दान करें।", "अपने माथे पर केसर का तिलक लगाएं या खाएं।", "भगवान गणेश की पूजा करें।", "कुत्तों को नियमित रूप से भोजन खिलाएं।"] },
    9:  { upay: ["अपने कानों में सोना पहनना।", "अपने घर के किसी भी स्थान पर एक चौकोर सोने का टुकड़ा रखें।", "भगवान गणेश की पूजा करें।", "अपने माता-पिता की देखभाल करें।"] },
    10: { upay: ["अपने घर की नींव में शहद या दूध डालें।", "अपने घर में चांदी के बर्तन में शहद भरकर रखें।", "भगवान गणेश की पूजा करें।", "एक नाले में काले और सफेद तिल गिराएं।"] },
    11: { upay: ["काला कुत्ता पालें।", "कपिला गाय का दान करें।", "कुत्तों को खाना खिलाएं।"] },
    12: { upay: ["अपने गले में सोना पहनें।", "अपने घर में एक काला कुत्ता पालें।", "भगवान गणेश की पूजा करें।"] },
  },
  Mars: {
    1:  { upay: ["मुफ्त में कुछ भी स्वीकार नहीं करना चाहिए।", "बुरी चीजों में शामिल होने से और झूठ बोलने से बचना चाहिए।", "नियमित रूप से महा गायत्री मंत्र का पाठ करना चाहिए और भगवान हनुमान पर सिंदूर का तिलक लगाना चाहिए।", "यदि आप मूंगा पहनते हैं तो आप लाभान्वित होंगे।", "आपको अपने भाइयों की अच्छी देखभाल करनी चाहिए।"] },
    2:  { upay: ["200 ग्राम रेवड़ी बहते पानी में बहाएं।", "अपने भाइयों और दोस्तों की मदद करते रहें।", "अपने साथ लाल रंग का रूमाल रखें।", "दोपहर के समय छोटे बच्चों को गेहूं और गुड़ दान करना बहुत लाभदायक होगा।", "घर में एक एक्वेरियम रखें।"] },
    3:  { upay: ["अपने घर में हाथी दांत से बनी चीजें रखें।", "अपने गुस्से को कम करने की कोशिश करें।", "अपने भाइयों की मदद करना।", "बाएं हाथ के अंगूठे पर चांदी का छल्ला पहनें।", "महा गायत्री मंत्र का पाठ करें।"] },
    4:  { upay: ["प्रतिदिन गंगाजल से दांत साफ करने चाहिए।", "यदि आपके घर में हर समय आग लगने की घटनाएं होती हैं, तो आपको अपने घर की छत पर चीनी या गुड़ की एक बोरी रखनी चाहिए।", "अपने घर के दरवाजे पर चौकोर चांदी का टुकड़ा लटकाना आपके लिए अनुकूल रहेगा।"] },
    5:  { upay: ["रात में सोते समय पानी पास रखें और सुबह किसी पौधे में डालें।", "अपने घर में एक नीम का पेड़ लगाएं।", "अपने पूर्वजों का श्राद्ध तर्पण करें।", "मंगलवार का व्रत रखें।"] },
    6:  { upay: ["6 अविवाहित लड़कियों को दूध पिलाएं।", "चांदी या चावल का दान करें।", "भगवान गणेश की पूजा करें।", "महा गायत्री भजन का पाठ करें।"] },
    7:  { upay: ["अपनी बहन को लाल कपड़ा भेंट करें।", "अपनी जेब में चांदी की ठोस गोली रखें।", "अपनी बेटी, बहन, चाची और भाभी को उपहार दें।", "मसूर की दाल, शहद या सिंदूर का दान करें या उन्हें पानी में प्रवाहित करें।"] },
    8:  { upay: ["कुत्तों को केवल एक तरफ से पके हुए मीठे ब्रेड या रोटियां खिलाएं।", "3 धातुओं से बनी अंगूठी पहनें।", "हमेशा अपने गले में चांदी की चेन पहनें।", "पानी में 4 किलोग्राम रेवड़ी या बताशा प्रवाह करे।"] },
    9:  { upay: ["अपने साथ लाल रूमाल रखें।", "मंगलवार के दिन भगवान हनुमान को सिंदूर चढ़ाएं।", "अपने दादाजी का ख्याल रखना।", "किसी धार्मिक स्थान पर चावल, गुड़ और दूध का दान करें।"] },
    10: { upay: ["अपनी नाक को साफ रखें।", "सूर्य ग्रहण के दौरान बादाम, नारियल, तेल का दान करें।", "अपने घर में भगवान की मूर्ति न रखें।", "बहते पानी में तांबे का सिक्का गिराएं।"] },
    11: { upay: ["तांबे की चूड़ी, कड़ा पहनें।", "अपने शरीर पर सोना पहनें।", "पीपल के वृक्ष को जल अर्पित करें।", "अपने वादे निभाते रहें।"] },
    12: { upay: ["भगवान हनुमान की सेवा करें।", "मंगलवार को बजरंग बाण का पाठ करें।", "लाल मसूर की दाल शनिवार को बहते पानी में प्रवाहित करें।"] },
  },
  Mercury: {
    1:  { upay: ["हरे रंग और अपनी भाभी से दूर रहना चाहिए।", "मांसाहारी भोजन, शराब, अंडे आदि का सेवन नहीं करना चाहिए।", "यदि आप एक स्थान से बैठकर व्यापार करते हैं, तो यह आपके लिए बहुत उपयोगी साबित होगा।"] },
    2:  { upay: ["अपनी नाक छिदवाएं और लगातार 96 दिनों तक इसमें चांदी पहनें।", "अपनी भाभी या अविवाहित लड़कियों की अच्छी देखभाल करना आपके लिए फायदेमंद होगा।", "किसी भी धार्मिक स्थान पर दूध और चावल दान करना बहुत लाभदायक होगा।"] },
    3:  { upay: ["अपने दांतों को फिटकरी से ब्रश करें।", "देवी के लिए चांदी का छत्र दान करें।", "अपनी भतीजी का ख्याल रखना।", "बुधवार के दिन बकरे का दान करें।"] },
    4:  { upay: ["अपने मन की शांति के लिए, अपने गले में चांदी की चेन पहनें।", "केसर का तिलक लगातार 43 दिनों तक लगाएं।", "रविवार को 400 ग्राम गुड़ जल प्रवाह करे।", "बंदरों को गुड़ खिलाएं।", "घर में हरे रंग का प्रयोग न करें।"] },
    5:  { upay: ["मोती और चांदी अनुकूल होगा।", "अपनी आर्थिक प्रगति के लिए अपने गले में तांबे का सिक्का पहनें।", "गाय की देखभाल करें।"] },
    6:  { upay: ["पारिवारिक पुजारी को वस्त्र दान करें।", "अपनी माता और बहनों का सम्मान करें।", "हरी सब्जियां और मूंग की दाल दान करें।"] },
    7:  { upay: ["कुत्ते को खाना खिलाएं।", "अपने व्यापारिक संबंधों में ईमानदारी रखें।", "हरा कपड़ा बुधवार को दान करें।"] },
    8:  { upay: ["प्रत्येक बुधवार को तांबे का सिक्का बहते पानी में प्रवाहित करें।", "मूंग की दाल विद्यार्थियों को दान करें।", "लेखन और संचार में ईमानदारी बनाए रखें।"] },
    9:  { upay: ["सरस्वती वंदना का पाठ करें।", "विद्यालय में पुस्तकें दान करें।", "अपने गुरु की सेवा करें।"] },
    10: { upay: ["बुध यंत्र स्थापित करें।", "बुधवार को हरे वस्त्र धारण करें।", "कन्याओं को हरे वस्त्र दान करें।"] },
    11: { upay: ["बहते पानी में हरा कपड़ा और मूंग प्रवाहित करें।", "अपने व्यापार में नई तकनीक अपनाएं।"] },
    12: { upay: ["बुध मंत्र का यात्रा से पहले जाप करें।", "आध्यात्मिक लेखन में संलग्न हों।", "गाय को हरा चारा खिलाएं।"] },
  },
  Moon: {
    1:  { upay: ["अपने साथ एक लाल रूमाल रखें।", "अपने बेड के पैरों में कुछ तांबे की कीलें गाड़ दें।", "बरगद के पेड़ की जड़ों को पानी दें।"] },
    2:  { upay: ["अपनी माँ से आशीर्वाद लेते रहना चाहिए।", "अपनी माँ से चंद्रमा से जुड़ी चीजें जैसे चांदी, चावल आदि लेना चाहिए और उन्हें अपने पास रखना चाहिए।", "अपने घर में घंटियां और पीतल से निर्मित चीजें नहीं रखनी चाहिए।"] },
    3:  { upay: ["वित्तीय लाभ के लिए, घोड़ा रखना अनुकूल होगा।", "सूर्य से संबंधित वस्तुओं का दान करना फलदायी होगा।", "देवी दुर्गा की पूजा करना भी फलदायी होगा।", "भगवान शिव की आराधना करना।"] },
    4:  { upay: ["दूध दान करना अनुकूल रहेगा।", "दूध से संबंधित व्यवसाय नहीं करना चाहिए।", "किसी खास काम करने के लिए बाहर जाने से पहले दूध या पानी से भरे बर्तन की स्थापना करनी चाहिए।"] },
    5:  { upay: ["सोमवार को बहते पानी में एक सफेद कपड़े में लपेटे हुए कुछ चावल और चीनी के टुकड़े प्रवाह करे।", "भगवान शिव को आम के पत्ते अर्पित करें।", "दूसरों के खिलाफ अपशब्दों का प्रयोग न करें।", "धार्मिक कार्यों में रुचि लें।"] },
    6:  { upay: ["अपने पिता को अपने हाथों से गुड़ खिलाएं।", "किसी धार्मिक स्थान पर चने की दाल, गेहूं या गुड़ का दान करें।", "दूध का दान कभी न करें।", "रात में दूध न पियें।"] },
    7:  { upay: ["सोमवार का व्रत रखें।", "चांदी से बने आभूषण पहनें।", "अपनी माँ को उपहार दें और उनका आशीर्वाद लें।", "घर में शिव-पार्वती की तस्वीर रखें।"] },
    8:  { upay: ["चंद्र कवच का पाठ करें।", "सोमवार को शिव मंदिर में दूध और जल चढ़ाएं।", "माँ का आशीर्वाद नियमित लें।", "चांदी की अंगूठी पहनें।"] },
    9:  { upay: ["नदी के किनारे सोमवार को पूजा करें।", "चावल, दूध, और चांदी का दान करें।", "माँ को नियमित दान दें।", "पूर्णिमा व्रत रखें।"] },
    10: { upay: ["चंद्र मंत्र का जाप करें।", "सोमवार को सफेद वस्त्र पहनें।", "जनसेवा में संलग्न हों।", "चांदी का पदा दान करें।"] },
    11: { upay: ["पूर्णिमा को चांदी का सिक्का नदी में प्रवाहित करें।", "सामाजिक लोकप्रियता बनाए रखें।", "माँ के साथ अच्छे संबंध बनाए रखें।"] },
    12: { upay: ["चंद्र स्तोत्र का पाठ करें।", "जल के पास आध्यात्मिक साधना करें।", "अंधे लोगों को चांदी का दान करें।"] },
  },
  Rahu: {
    1:  { upay: ["400 ग्राम सिक्के नदी या बहते पानी में प्रवाहित करें।", "काले और नीले कपड़े न पहनें।", "अपने गले में चांदी पहनें।", "किसी नदी या बहते पानी में नारियल प्रवाहित करें।", "चंद्रमा के उपाय आपके लिए लाभदायक होंगे।"] },
    2:  { upay: ["हाथी के पैरों की मिट्टी को कुएं में फेंकें।", "चांदी, सोने की ठोस गोली अपने साथ चांदी की डिब्बी में रखें।", "दहेज में इलेक्ट्रॉनिक सामान न लें।", "अपनी माँ के साथ अच्छे संबंध रखें।", "केसर या हल्दी का तिलक लगाना भी लाभकारी सिद्ध होगा।"] },
    3:  { upay: ["हाथी दांत (आइवरी) से बनी चीजों को अपने पास न रखें।", "चांदी के आभूषण पहनें या अपने पास रखें।", "सरसों, तंबाकू आदि का दान करना चाहिए।", "अपने परिवार से अलग न रहें।", "झूठी गवाही न देना।"] },
    4:  { upay: ["चांदी पहनें। हरिद्वार में गंगा में स्नान करें।", "निरंतर 7 बुधवार 400 ग्राम सूखा धनिया जल प्रवाह करे।", "घर के परिसर के भीतर गंदे पानी का जमाव नहीं होना चाहिए।", "तंबाकू का सेवन न करें।"] },
    5:  { upay: ["अपने घर में चांदी का हाथी रखें।", "मांसाहारी भोजन और शराब से दूर रहें।", "अपने बच्चों की खुशी के लिए, अपने घर की दहलीज़ के नीचे एक चांदी की ईंट गाड़ दें।", "अपने चरित्र को साफ रखें।"] },
    6:  { upay: ["कोयला और सीसा शनिवार को दान करें।", "राहु बीज मंत्र का जाप करें।", "सात प्रकार के अनाज का मिश्रण बहते पानी में प्रवाहित करें।"] },
    7:  { upay: ["विदेशी व्यापार में राहु मंत्र का सहारा लें।", "दक्षिण-पश्चिम कोने में सीसे का टुकड़ा रखें।", "अपने जीवनसाथी का सम्मान करें।"] },
    8:  { upay: ["राहु कवच का पाठ करें।", "शनिवार को कोयला और सीसा दान करें।", "छिपी हुई आय को उचित रूप से प्रबंधित करें।"] },
    9:  { upay: ["राहु मंत्र का जाप करें।", "अंतर्राष्ट्रीय धर्म में रुचि लें।", "तकनीक को आध्यात्मिक जीवन में शामिल करें।"] },
    10: { upay: ["राहु मंत्र का जाप करें।", "तकनीकी करियर अपनाएं।", "विदेशी करियर के अवसरों का लाभ उठाएं।"] },
    11: { upay: ["राहु स्तोत्र का पाठ करें।", "विदेशी आय के लिए उत्तर दिशा में सीसे का पाइप रखें।", "अचानक लाभ के अवसरों के लिए सतर्क रहें।"] },
    12: { upay: ["राहु बीज मंत्र का जाप करें।", "विदेश में आध्यात्मिक गतिविधियों में संलग्न हों।", "आश्रम जीवन अपनाएं।"] },
  },
  Saturn: {
    1:  { upay: ["मांसाहारी भोजन नहीं करना चाहिए और न ही शराब का सेवन करना चाहिए।", "अपने व्यवसाय या अपनी सेवा की सफलता के लिए, जमीन में कुछ काला नमक या काला सुरमा दबाएं।", "धन और संपत्ति के लिए बंदर रखना।", "अपने स्वास्थ्य में सुधार के लिए बरगद के पेड़ की जड़ों में दूध चढ़ाएं।", "साधु को तवा या चूल्हा दान करें।"] },
    2:  { upay: ["उड़द, चना या काली मिर्च का व्यापार आपके लिए बहुत अच्छा रहेगा।", "43 दिनों तक लगातार नंगे पैर मंदिर के दर्शन करें और अपनी सभी गलतियों के लिए भगवान से क्षमा मांगें।", "मंदिर में उड़द, काली मिर्च, चना, या चंदन की लकड़ी दान करें।", "गेहूं की रोटी पर सरसों का तेल लगाकर कुत्ते या कौए को खिलाएं।"] },
    3:  { upay: ["यदि आप काला और सफेद कुत्ता रखते हैं तो यह आपके धन में वृद्धि करेगा।", "अपने घर के प्रवेश द्वार पर लोहे की कील गाड़ना।", "भगवान गणेश से प्रार्थना करें।", "मांसाहारी भोजन और शराब का सेवन न करें।"] },
    4:  { upay: ["सांप को दूध पिलाएं।", "कौआ या भैंस को चावल खिलाएं।", "तेल, उड़द की दाल और काले कपड़े का दान करें।", "समाज में अपने से नीचे लोगों की मदद करें।"] },
    5:  { upay: ["शनि मंत्र का जाप करें।", "दीर्घकालिक निवेश ही करें।", "शिक्षा के क्षेत्र में समय लगाएं।"] },
    6:  { upay: ["शनिवार को मंदिर में सेवा जारी रखें।", "काले तिल और सरसों का तेल शनिवार को दान करें।", "सभी दुश्मनों को अनुशासन से परास्त करें।"] },
    7:  { upay: ["शनि मंत्र का जाप करें।", "जीवनसाथी के साथ धैर्य रखें।", "शनि यंत्र व्यापार के लिए स्थापित करें।"] },
    8:  { upay: ["शनि स्तोत्र का पाठ करें।", "अनुशासन में रहकर धीमी गति से उपचार करें।", "शनिवार को सरसों का तेल दान करें।"] },
    9:  { upay: ["शनि मंत्र का जाप करें।", "आध्यात्मिक तप बनाए रखें।", "गुरु की सेवा करें और अनुशासित जीवन जिएं।"] },
    10: { upay: ["शनि चालीसा का 19000 बार पाठ करें।", "सरकारी सेवा में लगन बनाए रखें।", "शनिवार को काले वस्त्र दान करें।"] },
    11: { upay: ["शनि मंत्र का जाप करें।", "सरसों का तेल शनिवार को दान करें।", "सेवा के माध्यम से सामाजिक संबंध बनाएं।"] },
    12: { upay: ["शनि की साधना करें।", "कर्म समापन के लिए ध्यान करें।", "दीर्घकालिक ध्यान और सेवा का अभ्यास करें।"] },
  },
  Sun: {
    1:  { upay: ["यदि सूर्य के प्रभाव प्रतिकूल हैं, तो शीघ्र विवाह करें।", "अपने घर में पानी का नल लगवाएं।", "दिन के समय में अपनी पत्नी के साथ किसी भी प्रकार का अंतरंग कार्य न करना।", "गुड़ का सेवन न करें।", "आम लोगों की मदद करें।"] },
    2:  { upay: ["दान में किसी से गेहूं, जो या बाजरा नहीं लेना चाहिए।", "अपने पैतृक घर में एक हैंड-पंप का निर्माण करवाएं।", "रविवार का व्रत रखना आपके लिए बहुत अनुकूल रहेगा।"] },
    3:  { upay: ["अपने चरित्र को अच्छा रखें।", "अपने भतीजे की मदद करना।", "रविवार को उपवास रखें।", "सूर्य को गुड़ मिलाकर जल चढ़ाएं।", "दूसरों को चावल का हलवा (खीर) खिलाएं।"] },
    4:  { upay: ["अपने पैतृक घर में अंधे लोगों को रोटी खिलाना अनुकूल रहेगा।", "सोना, चांदी या कपड़े का व्यवसाय करना बहुत अनुकूल होगा।", "मांसाहारी भोजन या शराब का सेवन न करें।", "अपने गले में खाकी रंग के धागे में तांबे का सिक्का पहनें।"] },
    5:  { upay: ["लाल मुंह वाले बंदर की देखभाल करें।", "दूसरों की आलोचना न करना।", "झूठ न बोलना।", "अपने घर के पूर्वी हिस्से की ओर अपनी रसोई का निर्माण करवाएं।", "अपने द्वारा किए गए सभी वादों को पूरा करें।"] },
    6:  { upay: ["सूर्य से संबंधित चीजें जैसे तांबा, गुड़, गेहूं आदि का दान करें।", "लाल बंदर को गुड़ और गेहूं खिलाएं।", "भूरी चींटियों को गुड़ या गेहूं का आटा खिलाएं।"] },
    7:  { upay: ["एक चौकोर आकार का तांबे का टुकड़ा जमीन में गाड़ दें।", "काली गाय की देखभाल करें।", "कोई भी अच्छा काम शुरू करने से पहले एक घूंट पानी पीना चाहिए।", "रविवार को उपवास रखें।"] },
    8:  { upay: ["800 ग्राम गुड़ या गेहूं का दान किसी मंदिर में लगातार 8 रविवार दान करें।", "रूबी को सोने में पहनें।", "काली या लाल गाय की देखभाल करें।", "बहते पानी में गुड़ प्रवाहित करें।"] },
    9:  { upay: ["चांदी, चावल या दूध का दान करें।", "पीतल के बर्तनों का उपयोग करें।", "रूबी पहनें।", "बंदरों को गुड़ खिलाएं।"] },
    10: { upay: ["अपने सिर को हमेशा सफेद या हल्के रंग की पगड़ी से ढक कर रखें।", "काले या नीले रंग के कपड़े न पहनें।", "बहते पानी में तांबे का सिक्का गिराएं।", "मांसाहारी भोजन और शराब से दूर रहें।"] },
    11: { upay: ["रात में अपने पास 11 मूली रखें और सुबह उसे किसी धार्मिक स्थान पर दान कर दें।", "तांबे का दान करें।", "मांसाहारी भोजन या शराब का सेवन न करें।", "झूठ न बोलना।"] },
    12: { upay: ["रविवार के दिन एक लाल मुंह वाले बंदर को गुड़ और गेहूं खिलाएं।", "सात प्रकार के अनाजों का मिश्रण भूरी चींटियों को भेंट करें।", "झूठी गवाही न देना।", "धर्म और अच्छे काम में भरोसा।"] },
  },
  Venus: {
    1:  { upay: ["गुड़ न खाएं।", "दिन के समय संभोग में लिप्त न हों।", "काली गाय की देखभाल करें।", "अपने चरित्र को साफ रखें।", "दही से स्नान करें।", "24 वर्ष के होने से पहले आप शादी न करें।"] },
    2:  { upay: ["2 किलोग्राम आलू हल्दी से पीला करने के बाद गाय को खिलाएं।", "200 ग्राम घी मंदिर में दान करना आपके लिए अनुकूल रहेगा।", "आलू, घी और दही का दान करना आपके लिए अच्छा रहेगा।", "बिना सींग वाली गाय की देखभाल करें।"] },
    3:  { upay: ["अपने भाई की पत्नी का ख्याल रखें।", "अपनी पत्नी का सम्मान करें।", "अपने चरित्र को साफ रखें।", "अपने पैतृक घर को नष्ट न करें।"] },
    4:  { upay: ["अगर आपकी पत्नी बीमार पड़ती है तो अपने घर की छत पर शहद से भरा कटोरा रखें।", "दही का दान करें।", "बृहस्पति के उपाय मददगार साबित होंगे।", "गाय का ध्यान रखना।", "बहते पानी में चावल, चांदी या दूध प्रवाहित करें।"] },
    5:  { upay: ["अपने चरित्र को साफ रखें।", "गाय की देखभाल करना।", "अपने माता-पिता की इच्छा के विरुद्ध विवाह न करें।", "हीरा पहनें।", "अपनी पत्नी की सलाह सुनें।"] },
    6:  { upay: ["इस व्यक्ति की पत्नी को नंगे पैर नहीं चलना चाहिए।", "6 दिनों तक लगातार 6 कन्याओं को दूध पिलाएं या दान दें।", "अपनी जेब में हमेशा चांदी की ठोस गोली रखें।", "पक्षियों को खीर खिलाएं।"] },
    7:  { upay: ["लाल गाय का ध्यान रखें।", "अपने माता-पिता का ख्याल रखना।", "किसी भी धार्मिक स्थान पर कांसे का बर्तन दान करें।", "विवाह के समय गाय का दान करें।"] },
    8:  { upay: ["शुक्रवार के दिन किसी धार्मिक स्थान पर 8 किलोग्राम गाजर दान करें।", "लगातार 43 दिनों तक एक फूल को एक गंदे नाले में गिराते रहें।", "प्रत्येक शुक्रवार को गाय को रोटी खिलाएं।"] },
    9:  { upay: ["काली या लाल गाय का ध्यान रखें।", "अपनी पत्नी को लाल रंग से रंगी हुई चांदी की चूड़ियां पहनाएं।", "शुक्रवार को उपवास रखें।"] },
    10: { upay: ["मंदिर में मिट्टी या रुई का दान करें।", "शराब और मांसाहारी भोजन से दूर रहें।", "हीरा पहनना।"] },
    11: { upay: ["मंदिर में दही या रुई का दान करें।", "मछली के तेल के capsule खाना।", "शुक्रवार को उपवास रखें।"] },
    12: { upay: ["लगातार 43 दिनों तक रोज शाम को एक नीम का फूल वीराने में दबाएं।", "काली गाय का दान करें।", "अपनी पत्नी को सम्मान दें।", "शुद्ध घी का दीपक जलाएं।"] },
  },
};

// ── Enhanced Vedic Remedy Data ──────────────────────────────────────────
const RDATA: Record<string, { gem: string; mantra: string; donate: string; practice: string; color: string; day: string }> = {
  Sun:     { gem: "Ruby / Red Garnet", mantra: "Om Hram Hreem Hraum Sah Suryaya Namah (108x Sunday)", donate: "Wheat, jaggery, copper — Sundays", practice: "Offer water to rising Sun daily. Surya Namaskar 12x.", color: "Red, Copper, Gold", day: "Sunday" },
  Moon:    { gem: "Pearl / Moonstone", mantra: "Om Shram Shreem Shraum Sah Chandraya Namah (Monday)", donate: "Milk, rice, silver — Mondays", practice: "Wear silver. Keep water pot in bedroom. Purnima vrat.", color: "White, Silver", day: "Monday" },
  Mars:    { gem: "Red Coral", mantra: "Om Kram Kreem Kraum Sah Bhaumaya Namah (Tuesday)", donate: "Red masoor dal, blood donation — Tuesdays", practice: "Hanuman Chalisa 108x. Plant neem/peepal. Care for brothers.", color: "Red, Orange", day: "Tuesday" },
  Mercury: { gem: "Emerald / Green Tourmaline", mantra: "Om Bram Breem Braum Sah Budhaya Namah (Wednesday)", donate: "Green cloth, moong dal — Wednesdays", practice: "Feed green fodder to cows. Care for maternal aunt.", color: "Green", day: "Wednesday" },
  Jupiter: { gem: "Yellow Sapphire / Citrine", mantra: "Om Gram Greem Graum Sah Gurave Namah (Thursday)", donate: "Yellow cloth, turmeric, banana — Thursdays", practice: "Apply saffron tilak. Touch feet of elders. Guru seva.", color: "Yellow, Gold", day: "Thursday" },
  Venus:   { gem: "Diamond / White Sapphire", mantra: "Om Dram Dreem Draum Sah Shukraya Namah (Friday)", donate: "White rice, sugar, silver — Fridays", practice: "Keep/feed white cow. Respect all women. Friday fast.", color: "White, Pink", day: "Friday" },
  Saturn:  { gem: "Blue Sapphire / Amethyst", mantra: "Om Pram Preem Praum Sah Shanaischaraya Namah (Saturday)", donate: "Mustard oil, iron, black sesame — Saturdays", practice: "Feed crows and dogs. Donate to poor. Shani Chalisa.", color: "Black, Blue, Purple", day: "Saturday" },
  Rahu:    { gem: "Hessonite (Gomed)", mantra: "Om Bhram Bhreem Bhraum Sah Rahave Namah (Saturday)", donate: "Lead, coal, dark items — Saturdays", practice: "Keep lead piece at home. Avoid false promises. 7-grain donation.", color: "Smoky, Dark Blue", day: "Saturday" },
  Ketu:    { gem: "Cat's Eye (Chrysoberyl)", mantra: "Om Shram Shreem Shraum Sah Ketave Namah (Tuesday)", donate: "Black+white blanket — Saturdays", practice: "Feed dogs daily. Respect spiritual teachers. Ganesha puja.", color: "Multicolour", day: "Saturday" },
};

// ── House-wise practical remedies (English) ─────────────────────────────
const HOUSE_REMEDY: Record<string, Record<number, string>> = {
  Sun: {
    1:'Offer water to rising Sun daily at sunrise. Copper vessel use karein. Wheat aur gur ka daan karein Ravivar ko.',
    2:'Gur (jaggery) aur gehu ka daan Ravivar. Father ke saath achha vyavhar. Gold jwellery wear karein.',
    3:'Red cloth aur coral donate Mangalvar ko. Siblings ke saath good relations. Short pilgrimage karein.',
    4:'Govt property ke liye Sun mantra karein. Mother ko respect dein. Heart health dhyan rakhein.',
    5:'Santan ke liye Sun mantra 108 times Sunday. Gold ka tilak Ravivar ko. Aaditya Hridayam padhein.',
    6:'Surya namaskar 12 times daily. Enemies naturally defeated. Govt service mein rise. Continue seva.',
    7:'Husband/wife ko respect dein. Partnership mein ego control. Sun mantra for business partnership.',
    8:'Navagraha pooja specifically for Sun. Avoid ego in occult. Father health dhyan rakhein.',
    9:'Sarvottam placement. Surya pooja maintain karein. Pilgrimage to Sun temples. Father ko guru maanein.',
    10:'Ravivar vrat rakhein. Govt job ke liye Sun kavach. Daily surya arghya. Career success guaranteed.',
    11:'Income ke liye copper coin dariya mein pravahit karein. Social connections maintain karein.',
    12:'Aditya Hridayam for foreign success. Left eye dhyan. Spiritual retreat Ravivar ko karein.'
  },
  Moon: {
    1:'Silver ring wear karein. Water pot bedroom mein rakhein. Mother se blessings lein. Monday vrat.',
    2:'Silver utensils se khana khayein. Family mein milk/kheer offer karein regularly.',
    3:'Siblings ke liye white cloth donate. Moonday evening meditation. Silver bracelet wear karein.',
    4:'4th Moon excellent! Maintain ghar ki saaf-safai. Shiv-Parvati pooja. Jasmine flowers at home.',
    5:'Children ke liye pearl wear karein. Purnima vrat rakhein. Moonlight meditation karein.',
    6:'Health ke liye Monday fast. Milk aur chawal donate. Shiva temple Monday ko visit karein.',
    7:'Spouse ke liye pearl gifting. Business mein women partners helpful. White flowers wear karein.',
    8:'Occult ke liye Chandra kavach. Mother health mantra. Inherited property ke liye Moon pooja.',
    9:'Dharma Moon excellent! Pilgrimage near rivers. Mother ko regular daan dein. Purnima pooja.',
    10:'Public career ke liye Chandra mantra. Silver pada daan. Hospital/public sector mein seva karein.',
    11:'Income ke liye silver coin river mein pravahit karein Purnima ko. Social popularity maintain.',
    12:'Foreign success ke liye Chandra stotra. Spiritual retreat near water. Silver donate to blind.'
  },
  Mars: {
    1:'Mangal dosh ke liye Hanuman Chalisa Mangalvar ko 108 times. Red coral wear karein. Blood donate.',
    2:'Family disputes ke liye Hanuman mantra. Masoor ki dal donate Mangalvar. Brothers ka sahyog lein.',
    3:'3rd Mars excellent! Courage maintain karein. Red flag at entrance. Sports activities continue.',
    4:'Property disputes ke liye Bhoomi pooja karein. Mother health red coral se. Agriculture productive.',
    5:'Children ke liye Mars mantra Mangalvar. Sports coaching. Red coral for speculation protection.',
    6:'BEST! Continue everything. Win streak maintain. Red masoor daal daily donate. All enemies defeated.',
    7:'Spouse ke saath patience. Mangal dosh pooja. Joint business mein legal clarity rakhein.',
    8:'Accidents se bachne ke liye Hanuman Chalisa daily. Surgery ke liye Mars mantra. Safety first.',
    9:'Dharma warrior — Hanuman ji ki seva. Pilgrimage on foot. Fortune through courage.',
    10:'Career Mars excellent. Red uniform/attire in career. Mangalvar ko workplace pooja karein.',
    11:'Gains ke liye red cloth donate Mangalvar. Elder siblings se sambandh. Competitive spirit.',
    12:'Foreign Mangalvar mantra jaap. Hidden enemies ke liye Mars kavach. Energy channelize karein.'
  },
  Mercury: {
    1:'Green cloth wear Budhvar. Emerald or green tourmaline. Moong ki dal donate. Intelligence peak.',
    2:'Business income ke liye Budh mantra. Family education mein invest. Multiple income streams.',
    3:'3rd Mercury best! Writing/media career. Behen-bhai ke saath good relations. Trade skill.',
    4:'Education ke liye Saraswati pooja. Home mein books rakho. Green plants at study table.',
    5:'Children ke liye Budh mantra. Writing career. Stock analysis skills develop karein.',
    6:'Service mein IT career. Respiratory health dhyan. Moong dal donate Budhvar to students.',
    7:'Business partner ke liye Budh mantra. Travel with spouse beneficial. Communication clarity.',
    8:'Research mein Mercury mantra. Occult writing. Communication in crisis stays clear.',
    9:'Higher education ke liye Saraswati vandana. International writing. Teaching dharma.',
    10:'IT/media career — Budh yantra. Mercury mantra 17000 times. Communication authority.',
    11:'Multiple income ke liye Budh stotra. Network in business. Gains through writing.',
    12:'Foreign work — Budh mantra before travel. Spiritual writing. Hidden business clarity.'
  },
  Jupiter: {
    1:'Yellow sapphire wear Guruvar. Banana + turmeric donate. Guru ke charan sparsh karein.',
    2:'Dhana Yoga maintain. Banana tree lagao. Jupiter mantra 16000 times for wealth. Guru daan.',
    3:'Writing on dharma. Publish books. Saffron tilak Guruvar. Guru ashirvad lein siblings ke liye.',
    4:'Home temple banana. Guru picture ghar mein rakho. Education environment maintain karein.',
    5:'Children ke liye Jupiter mantra. Yellow sweets distribute Guruvar. Speculation blessed.',
    6:'Jupiter 6th — thoda careful in health over-optimism. Guru mantra for realistic health view.',
    7:'Marriage ke liye Jupiter mantra. Wise partner mil sakta hai. Dharmic business partnerships.',
    8:'Protection ke liye Jupiter kavach. Occult mein guru ki raksha. Crisis mein guru smaran.',
    9:'BEST! Guru Brahaspati stotra daily. Pilgrimage to Pushkar, Varanasi. Guru seva karein.',
    10:'Career leadership ke liye Jupiter mantra. Yellow cloth Thursday. Authority through dharma.',
    11:'Maximum gains — Guru prasad distribute karein Guruvar. Social blessings. Desires fulfill.',
    12:'Spiritual abroad ke liye Jupiter mantra. Charitable giving. Guru dhyan in meditation.'
  },
  Venus: {
    1:'Diamond ya white sapphire. White/pink clothes Friday. Respect all women. Creative expression.',
    2:'Family wealth ke liye Venus mantra. Luxury at home invest. Silver utensils ke liye daan.',
    3:'Creative arts flourish. White flowers Friday. Siblings ke liye Venus mantra. Poetry likhein.',
    4:'Home beautiful banao. White lotus at home. Mother ke liye Venus mantra. Property gains.',
    5:'Romance ke liye Venus mantra. Diamond wear. Creative speculation. Love life blessed.',
    6:'Beauty treatments ke liye Friday fast. Kidney health dhyan. Service in beauty industry.',
    7:'BEST! Venus 7th marriage blessing. Diamond gifting to spouse. Friday pooja. Harmony maintain.',
    8:'Hidden pleasures ke liye Venus kavach. Occult arts mein Venus mantra. Inheritance through spouse.',
    9:'International arts ke liye Lakshmi puja. Beauty dharma. Arts abroad. Fortune through creativity.',
    10:'Arts career ke liye Venus mantra. White clothes professional. Entertainment industry success.',
    11:'Income ke liye Lakshmi mantra Friday. Social charm maintain. Arts income grows.',
    12:'Foreign arts ke liye Venus stotra. Luxury expenses control. Spiritual arts flourish.'
  },
  Saturn: {
    1:'Shani mantra Shanivar. Oil massage Saturday. Iron ring wear. Patience is key to success.',
    2:'Mustard oil lamp Saturday. Family ke liye Saturn mantra. Conservative saving habits maintain.',
    3:'Shani mantra for sibling karma. Long disciplined travels. Saturn Shani chalisa.',
    4:'Property delays ke liye Shani puja. Old property matters. Agriculture. Disciplined home.',
    5:'Children ke liye Shani mantra. Long-term investment only. Careful speculation. Education.',
    6:'BEST Saturn! Continue everything. Shanivar seva at temple. Win streak through discipline.',
    7:'Marriage karma ke liye Shani mantra. Patience with spouse. Saturn yantra for business.',
    8:'Longevity ke liye Shani stotra. Saturn 8th protects. Discipline in occult. Slow healing.',
    9:'Spiritual austerity ke liye Saturn mantra. Slow pilgrimage. Guru discipline maintain.',
    10:'Career ke liye Shani chalisa 19000 times. Government service. Authority through patience.',
    11:'Gradual gains ke liye Shani mantra. Mustard oil donate Saturday. Social through service.',
    12:'Liberation ke liye Saturn sadhana. Karma closure. Long periods of meditation. Seva.'
  },
  Rahu: {
    1:'Hessonite (gomed) wear. Coal/lead at home. Foreign connections maintain. Tech career.',
    2:'Foreign income ke liye Rahu mantra. Unusual family — accept it. Watch speech carefully.',
    3:'Rahu 3rd bold energy — channelize. Technology writing. Foreign media connections.',
    4:'Foreign property ke liye Rahu upay. Lead naag murti ghar mein rakho. Tech at home.',
    5:'Unusual children ke liye Rahu mantra. Risky speculation — control. Tech-based creativity.',
    6:'Foreign enemies strategy ke liye Rahu mantra. Confusion as weapon. Coal donate Saturday.',
    7:'Foreign spouse ke liye Rahu upay. International business. Lead piece in SW corner.',
    8:'Sudden events ke liye Rahu kavach. Occult — Rahu beej mantra. Hidden income manage.',
    9:'Foreign dharma ke liye Rahu mantra. International fortune. Technology in spiritual life.',
    10:'Sudden career rise — Rahu mantra. Technology career. Foreign career opportunities.',
    11:'Sudden gains ke liye Rahu stotra. Foreign income. Lead pipe in north direction.',
    12:'Foreign liberation ke liye Rahu beej mantra. Hidden activities abroad. Ashram life.'
  },
  Ketu: {
    1:'Cats eye wear. Feed dogs daily. Spiritual teachers ko respect. Detachment from ego.',
    2:"Family detachment ke liye Ketu mantra. Past wealth karma — do not hoard. Speak truth.",
    3:'Spiritual writing ke liye Ketu mantra. Past life courage emerges. Silent communication.',
    4:'Home spiritualization — meditation corner banao. Ketu yantra at home. Past property.',
    5:'Spiritual children ke liye Ketu mantra. Cats eye wear. Detach from speculation excess.',
    6:'Past service karma ke liye Ketu stotra. Alternative medicine. Dogs ko khana dein.',
    7:'Past life partner ke liye Ketu mantra. Spiritual business. Cats eye in silver.',
    8:'BEST Ketu! Moksha ke liye Ketu sadhana. Past occult skills. Spiritual transformation.',
    9:'Highest dharma — Ketu mantra. Past life guru emerges. Direct divine connection.',
    10:'Spiritual career ke liye Ketu upay. Past fame karma. Healer/astrologer path.',
    11:'Spiritual income ke liye Ketu mantra. Detach from gains. Dogs ko daily khana.',
    12:'MOKSHA! Ketu sadhana. Liberation closest. Spiritual retreat. Past karma dissolves.'
  }
};

// ── Karma Alignment Technique (KAT) ────────────────────────────────────
const KAT_COMPAT: Record<string, number[]> = {
  Sun: [1, 9, 10], Moon: [4, 5, 9], Mars: [3, 6, 10], Mercury: [2, 6, 10],
  Jupiter: [1, 5, 9], Venus: [2, 7, 11], Saturn: [3, 6, 10], Rahu: [6, 11, 3], Ketu: [3, 9, 12]
};
const KAT_REMEDY: Record<string, string> = {
  Sun:     'Copper water vessel in east direction at sunrise',
  Moon:    'Silver object (ring/chain) on body — Moon energy anchors',
  Mars:    'Red thread on right wrist or copper vessel at home',
  Mercury: 'Green object or copper coin in wallet',
  Jupiter: 'Yellow cloth or banana root near worship place',
  Venus:   'White cloth or crystal near south-east corner',
  Saturn:  'Mustard oil donation Saturday or iron nail in ground',
  Rahu:    'Donate coal/lead on Saturday; blue-black cloth',
  Ketu:    'Grey blanket donation; sesame seeds in running water',
};

// ── Neecha (debilitation) signs ────────────────────────────────────────
const NEECHA_SIGN: Record<string, string> = {
  Sun: 'Libra', Moon: 'Scorpio', Mars: 'Cancer', Mercury: 'Pisces',
  Jupiter: 'Capricorn', Venus: 'Virgo', Saturn: 'Aries', Rahu: 'Sagittarius', Ketu: 'Gemini'
};
// ── Types ─────────────────────────────────────────────────────────────
export interface RemedyCard {
  planet: string;
  house: number;
  sign: string;
  nakshatra: string;
  dignity: string;
  retrograde: boolean;
  isWeak: boolean;
  weakReasons: string[];
  isActiveDasha: boolean;
  isKATWeak: boolean;
  katCompatHouses: number[];
  katRemedy: string;
  gem: string;
  mantra: string;
  donate: string;
  practice: string;
  color: string;
  day: string;
  houseRemedy: string;
  lkUpay: string[];
  priority: "dasha-active" | "urgent" | "recommended" | "optional";
  safety: "safe-first" | "caution" | "validate-first";
  safetyNote: string;
}

export interface RemedyResult {
  cards: RemedyCard[];
  urgentCount: number;
  dashaActive: string;
  antardashaActive: string;
  pratyantardashaActive: string;
  topPriority: RemedyCard | null;
  unifiedSafetyPlan: string[];
  contradictionSafePlan: string;
}

function getRemedySafety(
  planet: string,
  isWeak: boolean,
  isActiveDasha: boolean,
  isKATWeak: boolean
): Pick<RemedyCard, "safety" | "safetyNote"> {
  const highImpact = ["Sun", "Mars", "Saturn", "Rahu", "Ketu"].includes(planet);
  if (isActiveDasha && (isWeak || highImpact)) {
    return {
      safety: "validate-first",
      safetyNote: "Dasha-active and sensitive: start with behaviour, mantra and routine; validate donation, metal, yantra and gemstone before strong use.",
    };
  }
  if (isWeak || isKATWeak || highImpact) {
    return {
      safety: "caution",
      safetyNote: "Use soft remedies first. Avoid expensive gemstones, heavy donation or intense rituals until the chart promise and dasha context agree.",
    };
  }
  return {
    safety: "safe-first",
    safetyNote: "Safe first-line remedies are enough: discipline, respectful behaviour, simple mantra, service and clean daily routine.",
  };
}

export function calculateRemedies(chart: ChartData): RemedyResult {
  const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  // ── Active dasha planets ──────────────────────────────────────────
  const activeMD = chart.dashas.find(d => d.active) || chart.dashas[0];
  const activeAD = chart.antardasha.find(d => d.active) || chart.antardasha[0];
  const pratyantardasha = activeAD ? buildAntarDasha(activeAD.planet, activeAD.start, activeAD.yrs) : [];
  const activePD = pratyantardasha.find(d => d.active) || pratyantardasha[0];
  const dashaActivePlanet = activeMD?.planet || "";
  const antardashaActivePlanet = activeAD?.planet || "";
  const pratyantardashaActivePlanet = activePD?.planet || "";

  const cards: RemedyCard[] = planets.map(planet => {
    const pd = chart.planets[planet];
    if (!pd) return null;

    const r = RDATA[planet];
    const lkData = LK_AMRIT_DATA[planet]?.[pd.house];
    const lkUpay = lkData?.upay || [];
    const houseRemedy = HOUSE_REMEDY[planet]?.[pd.house] || "";

    // ── Weakness detection ────────────────────────────────────────
    const weakReasons: string[] = [];
    const inDusthana = [6, 8, 12].includes(pd.house);
    const isNeecha = pd.sign === NEECHA_SIGN[planet] || pd.dignity?.includes("Neecha") || pd.dignity?.includes("Debilitated");
    const isRetrograde = pd.retrograde;
    const isEnemy = pd.dignity?.includes("Enemy") || pd.dignity?.includes("Shatru");

    if (inDusthana) weakReasons.push(`Dusthana (H${pd.house})`);
    if (isNeecha) weakReasons.push("Neecha / Debilitated");
    if (isRetrograde) weakReasons.push("Retrograde — delayed results");
    if (isEnemy) weakReasons.push("Enemy sign — reduced strength");

    const isWeak = weakReasons.length > 0;

    // ── KAT analysis ──────────────────────────────────────────────
    const katCompat = KAT_COMPAT[planet] || [];
    const isKATWeak = !katCompat.includes(pd.house);

    // ── Active dasha flag ─────────────────────────────────────────
    const isActiveDasha = planet === dashaActivePlanet || planet === antardashaActivePlanet || planet === pratyantardashaActivePlanet;

    // ── Priority ─────────────────────────────────────────────────
    let priority: RemedyCard["priority"] = "optional";
    if (isActiveDasha) priority = "dasha-active";
    else if (isWeak) priority = "urgent";
    else if (isKATWeak) priority = "recommended";

    const safety = getRemedySafety(planet, isWeak, isActiveDasha, isKATWeak);

    return {
      planet,
      house: pd.house,
      sign: pd.sign,
      nakshatra: pd.nakshatra,
      dignity: pd.dignity || "Normal",
      retrograde: isRetrograde,
      isWeak,
      weakReasons,
      isActiveDasha,
      isKATWeak,
      katCompatHouses: katCompat,
      katRemedy: KAT_REMEDY[planet] || "",
      gem: r.gem,
      mantra: r.mantra,
      donate: r.donate,
      practice: r.practice,
      color: r.color,
      day: r.day,
      houseRemedy,
      lkUpay,
      priority,
      ...safety,
    };
  }).filter(Boolean) as RemedyCard[];

  // ── Sort: dasha-active → urgent → recommended → optional ────────
  const order: Record<RemedyCard["priority"], number> = {
    "dasha-active": 0, "urgent": 1, "recommended": 2, "optional": 3
  };
  cards.sort((a, b) => order[a.priority] - order[b.priority]);

  const urgentCount = cards.filter(c => c.priority === "urgent" || c.priority === "dasha-active").length;
  const validateFirst = cards.filter(c => c.safety === "validate-first").map(c => c.planet);
  const caution = cards.filter(c => c.safety === "caution").map(c => c.planet);
  const unifiedSafetyPlan = [
    "Start with behaviour correction, daily routine, prayer/mantra and service before gemstone, metal, daan or 43-day intensive remedies.",
    validateFirst.length
      ? `Validate first before strong remedies for: ${validateFirst.join(", ")}.`
      : "No dasha-active high-caution planet dominates; keep remedies simple and steady.",
    caution.length
      ? `Use soft correction only for caution planets: ${caution.slice(0, 5).join(", ")}.`
      : "Caution load is low; avoid adding unnecessary remedies.",
    "Never run many planet remedies at once. Choose the top 1-3 and review after 30-40 days.",
  ];

  return {
    cards,
    urgentCount,
    dashaActive: dashaActivePlanet,
    antardashaActive: antardashaActivePlanet,
    pratyantardashaActive: pratyantardashaActivePlanet,
    topPriority: cards[0] || null,
    unifiedSafetyPlan,
    contradictionSafePlan: unifiedSafetyPlan.join(" "),
  };
}
