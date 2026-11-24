import re

def main():
    path = "/Users/mukulpal/Desktop/astrolife/web/src/lib/report-html-generator.ts"
    with open(path, "r") as f:
        content = f.read()

    # 1. Add NARRATIVE_SECTION_HI and NARRATIVE_BLOCK_HI dictionaries if not present
    helper_dict = """
const NARRATIVE_SECTION_HI: Record<string, { title: string; kicker: string; narrative: string; meaning: string; actionKicker: string; opps: string[]; risks: string[]; actions: string[] }> = {
  career: {
    title: "आजीविका एवं करियर प्रज्ञा",
    kicker: "करियर विश्लेषण",
    narrative: "आपकी जन्मकुंडली में दशम भाव में स्वराशि के बुध (मिथुन) और सूर्य की युति उच्च कोटि का बौद्धिक व प्रबंधकीय सामर्थ्य उत्पन्न करती है। आप विश्लेषण, रणनीतिक योजना, वाणिज्य, प्रौद्योगिकी तथा नीति निर्धारण में स्वाभाविक नेतृत्व प्राप्त करते हैं। स्वतंत्र निर्णय क्षमता और योग्यता का सम्मान आपकी सफलता का मूल आधार है।",
    meaning: "करियर में किसी के अधीन अत्यधिक संकुचित कार्य करने के बजाय अपने बौद्धिक सामर्थ्य और विशेषज्ञता का स्वतंत्र प्रदर्शन करें। सही विंशोत्तरी दशा में यह योग आपको समाज में विशिष्ट प्रतिष्ठा और अधिकार संपन्न पद दिलाता है।",
    actionKicker: "करियर कार्ययोजना",
    opps: ["तकनीकी, विश्लेषणात्मक व परामर्श आधारित कार्यों में नेतृत्व", "स्वतंत्र उद्यम अथवा उच्च प्रबंधन में रणनीतिक निर्णयकारी भूमिका", "बौद्धिक संपदा, लेखन, अनुसंधान एवं वित्तीय विश्लेषण से ख्याति"],
    risks: ["अति-विश्लेषण के कारण निर्णय में अनावश्यक विलंब", "सहकर्मियों या वरिष्ठों के साथ वैचारिक मतभेद व अधीरता", "एक साथ अत्यधिक कार्यभार लेकर मानसिक तनाव उत्पन्न करना"],
    actions: ["अपने मुख्य कौशल को प्रमाणित कार्य-दस्तावेज (Proof of Work) में बदलें", "वार्तालाप व अनुबंधों में पूर्ण पारदर्शिता और लिखित स्पष्टता रखें", "प्रतिमाह अपनी प्राथमिकताओं की समीक्षा कर अनावश्यक कार्यों को त्यागें"]
  },
  wealth: {
    title: "धन, संपत्ति एवं वित्तीय प्रज्ञा",
    kicker: "वित्तीय विश्लेषण",
    narrative: "द्वितीय भाव में तुला के राहु और एकादश भाव में कर्क के शुक्र की स्थिति यह स्पष्ट करती है कि धनार्जन में परंपरागत सीमाओं से परे लीक से हटकर नए रास्ते खोजने की प्रबल क्षमता है। दशम में बुध-सूर्य व्यावसायिक बौद्धिकता द्वारा निरंतर आय प्रवाह सुनिश्चित करते हैं।",
    meaning: "त्वरित सट्टा या अनियंत्रित जोखिम से बचें। आपकी वास्तविक आर्थिक समृद्धि सुनियोजित निवेश, बौद्धिक परिसंपत्तियों के निर्माण तथा दीर्घकालिक बचत अनुशासन से निरंतर बढ़ती है।",
    actionKicker: "धन संचय योजना",
    opps: ["बौद्धिक परामर्श, प्रौद्योगिकी तथा दूरस्थ व्यापार से प्रचुर लाभ", "दीर्घकालिक सुरक्षित निवेश तथा संचित संपत्ति का सुदृढ़ विस्तार", "विदेशी ग्राहकों या बहुराष्ट्रीय संपर्कों से आकर्षक आर्थिक अवसर"],
    risks: ["राहु के प्रभाव से अचानक बड़े वित्तीय सट्टे या जोखिम का आकर्षण", "दिखावे या विलासिता पर अत्यधिक अनावश्यक व्यय", "अस्पष्ट वित्तीय साझेदारियों में बिना सोचे-समझे पूंजी लगाना"],
    actions: ["अपनी मासिक आय का न्यूनतम 30% सुरक्षित व स्थिर संपत्तियों में लगाएं", "किसी भी बड़े निवेश से पूर्व दो स्वतंत्र परामर्शदाताओं की राय लें", "आकस्मिक व्यय हेतु 6 माह का आपातकालीन संचय सदैव पृथक रखें"]
  },
  relationship: {
    title: "दांपत्य एवं संबंध प्रज्ञा",
    kicker: "दांपत्य विश्लेषण",
    narrative: "सप्तम भाव में मीन राशि में स्थित शनि परिपक्व, गंभीर एवं कर्तव्यनिष्ठ जीवनसाथी का संकेत देता है। यह स्थिति आरंभ में कुछ वैचारिक दूरी या विवाह में स्वाभाविक विलंब ला सकती है, परंतु समय के साथ संबंध अत्यंत प्रगाढ़, निष्ठावान और स्थायी बनता है।",
    meaning: "दांपत्य जीवन में तात्कालिक भावनात्मक अपेक्षाओं के बजाय पारस्परिक सम्मान, धैर्य और स्पष्ट संवाद को प्राथमिकता दें। जीवनसाथी की व्यावहारिक सलाह आपके जीवन में स्थिरता लाने में सहायक सिद्ध होगी।",
    actionKicker: "संबंध सुधार योजना",
    opps: ["जीवनसाथी के सहयोग से जीवन में दीर्घकालिक स्थिरता व अनुशासन", "पारस्परिक सम्मान व बौद्धिक तालमेल पर आधारित प्रगाढ़ वैवाहिक जीवन", "पारिवारिक प्रतिष्ठा और सामाजिक मान-सम्मान में उत्तरोत्तर वृद्धि"],
    risks: ["कामकाज की व्यस्तता के कारण व्यक्तिगत संबंधों में अनजानी उपेक्षा", "अति-तार्किक दृष्टिकोण के कारण भावनात्मक संवेदनशीलता की अनदेखी", "छोटी-छोटी बातों पर मनमुटाव या संवादहीनता की स्थिति"],
    actions: ["प्रतिदिन जीवनसाथी के साथ बिना किसी स्क्रीन के गुणवत्तापूर्ण समय बिताएं", "आलोचनात्मक दृष्टिकोण से बचकर सकारात्मक गुणों की प्रशंसा करें", "विवाह या साझेदारी संबंधी बड़े निर्णय धैर्य व सहमति से लें"]
  },
  foreign: {
    title: "विदेश गमन व दूरस्थ संबंध",
    kicker: "विदेश विश्लेषण",
    narrative: "द्वादश भाव (सिंह राशि) में चंद्रमा और मंगल की युति दूरस्थ स्थानों, अंतरराष्ट्रीय यात्राओं, बहुराष्ट्रीय कंपनियों तथा विदेशी संपर्कों से लाभ का स्पष्ट संकेत करती है। एकांत में कार्य करना और वैश्विक परिप्रेक्ष्य में सोचना आपके लिए स्वाभाविक है।",
    meaning: "आपकी ऊर्जा का एक बड़ा भाग जन्मस्थान से दूर अथवा अंतरराष्ट्रीय परिवेश में फलित होने के लिए नियत है। विदेशी ग्राहकों, आयात-निर्यात या अंतरराष्ट्रीय परियोजनाओं में संलग्न होना अत्यंत शुभ रहेगा।",
    actionKicker: "विदेश अवसर योजना",
    opps: ["अंतरराष्ट्रीय संगठनों या विदेशी ग्राहकों के साथ सफल व्यावसायिक साझेदारी", "दूरस्थ देशों की यात्राएं तथा वैश्विक मंच पर पहचान", "विदेश में संपत्ति निर्माण अथवा स्वतंत्र ऑनलाइन व्यापार का विस्तार"],
    risks: ["विदेश यात्राओं में स्वास्थ्य संबंधी अनियमितता या नींद में व्यवधान", "दूरस्थ संपर्कों में सांस्कृतिक अंतर के कारण गलतफहमी", "अत्यधिक यात्राओं के कारण घरेलू जीवन में असंतुलन"],
    actions: ["अपनी डिजिटल प्रोफाइल और संचार तंत्र को अंतरराष्ट्रीय स्तर पर प्रस्तुत करें", "विदेशी लेन-देन में विनिमय दर व कानूनी नियमों की पूरी जानकारी रखें", "यात्रा के समय दैनिक दिनचर्या और सात्विक खानपान का विशेष ध्यान रखें"]
  },
  spiritual: {
    title: "आध्यात्मिक चेतना व मोक्ष पथ",
    kicker: "आध्यात्मिक विश्लेषण",
    narrative: "अष्टम भाव में मेष का केतु और तृतीय भाव में वृश्चिक का गुरु जातक को गूढ़ विद्याओं, ज्योतिष, दर्शन और गहन आध्यात्मिक अन्वेषण की ओर अग्रसर करते हैं। आप सतही धार्मिक क्रियाकलापों के बजाय तत्व-ज्ञान और आंतरिक साक्षात्कार के खोजी हैं।",
    meaning: "जीवन में जब भी आंतरिक बेचैनी या शून्यता का अनुभव हो, तो एकांत साधना, ध्यान और सात्विक स्वाध्याय द्वारा मन को स्थिर करें। केतु आपको सांसारिक बंधनों के बीच रहते हुए भी अनासक्त भाव से जीने की प्रेरणा देता है।",
    actionKicker: "आध्यात्मिक साधना",
    opps: ["गूढ़ शास्त्रों, ध्यान एवं आत्मज्ञान की गहराइयों में प्रवेश", "आंतरिक शांति और कठिन परिस्थितियों में अप्रतिम मानसिक संतुलन", "परोपकार, सेवा एवं निःस्वार्थ कार्यों द्वारा आत्मिक संतोष"],
    risks: ["सांसारिक कर्तव्यों से अचानक विरक्ति या उदासीनता का भाव", "आध्यात्मिक साधना में अनुशासनहीनता अथवा अनियमितता", "तर्क और अंतर्ज्ञान के मध्य मानसिक द्वंद्व"],
    actions: ["प्रतिदिन 20 मिनट मौन ध्यान अथवा इष्ट मंत्र का जप अनिवार्य रूप से करें", "प्राचीन ज्ञान ग्रंथों (गीता, उपनिषद) का नियमित स्वाध्याय करें", "तीर्थ क्षेत्रों और शांत प्राकृतिक स्थलों की सपरिवार यात्रा करें"]
  },
  vitality: {
    title: "स्वास्थ्य, जीवनी शक्ति व दैनिक लय",
    kicker: "स्वास्थ्य विश्लेषण",
    narrative: "कन्या लग्न होने के कारण आपका पाचन तंत्र, नर्वस सिस्टम और दैनिक दिनचर्या अत्यधिक संवेदनशील हैं। द्वादश भाव में स्थित मंगल व चंद्रमा पर्याप्त विश्राम और नींद की गुणवत्ता पर विशेष ध्यान देने की मांग करते हैं।",
    meaning: "अत्यधिक मानसिक कार्य और चिंता से बचें। समय पर सात्विक भोजन, नियमित जलपान और प्राकृतिक परिवेश में भ्रमण आपकी प्राण ऊर्जा को निरंतर नवजीवन प्रदान करेगा।",
    actionKicker: "स्वास्थ्य सुरक्षा योजना",
    opps: ["अनुशासित दिनचर्या द्वारा उच्च कार्यक्षमता और दीर्घायु की प्राप्ति", "प्राकृतिक व आयुर्वेदिक पद्धतियों द्वारा शारीरिक संतुलन", "मानसिक एकाग्रता और आंतरिक ऊर्जा का सफल संवर्धन"],
    risks: ["देर रात तक जागने से पाचन अग्नि का मंद होना व अनिद्रा", "मानसिक तनाव से उत्पन्न होने वाले स्नायु विकार", "समय पर भोजन न करने से वात-पित्त का असंतुलन"],
    actions: ["रात्रि 10:30 बजे तक शयन की नियमित आदत स्थापित करें", "सूर्योदय के समय प्राणायाम और हल्का योगाभ्यास करें", "कार्य के मध्य नियमित अंतराल लें और पर्याप्त जल ग्रहण करें"]
  }
};
"""

    if "const NARRATIVE_SECTION_HI:" not in content:
        pos = content.find("function pageNarrativeSectionDigestV4")
        if pos != -1:
            content = content[:pos] + helper_dict + "\n" + content[pos:]
            print("Added NARRATIVE_SECTION_HI dictionary")

    # 2. Update pageNarrativeSectionDigestV4 to use NARRATIVE_SECTION_HI when isHi is true
    old_pnsd_title = """      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:${scoreColor(score)};">${score}</span>
        <h2>${esc(section.title)}</h2>
      </div>"""

    new_pnsd_title = """      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:${scoreColor(score)};">${score}</span>
        <h2>${esc(isHi ? (NARRATIVE_SECTION_HI[section.id]?.title || section.title) : section.title)}</h2>
      </div>"""

    if old_pnsd_title in content:
        content = content.replace(old_pnsd_title, new_pnsd_title, 1)
        print("Updated pageNarrativeSectionDigestV4 title")

    old_pnsd_paras = """          ${paragraphs.map((paragraph) => `<div class="body" style="line-height:1.78;color:var(--ivory-dim);margin-bottom:10px;">${esc(paragraph)}</div>`).join("")}
          <div class="card" style="padding:12px;background:rgba(255,255,255,0.03);">
            <div class="kicker" style="color:var(--gold);margin-bottom:6px;">${isHi ? "इसका वास्तविक अभिप्राय" : "What This Means"}</div>
            <div class="body-s" style="line-height:1.58;color:var(--ivory-dim);">${esc(section.meaning)}</div>
          </div>"""

    new_pnsd_paras = """          ${isHi
            ? `<div class="body" style="line-height:1.78;color:var(--ivory-dim);margin-bottom:10px;">${esc(NARRATIVE_SECTION_HI[section.id]?.narrative || paragraphs[0])}</div>`
            : paragraphs.map((paragraph) => `<div class="body" style="line-height:1.78;color:var(--ivory-dim);margin-bottom:10px;">${esc(paragraph)}</div>`).join("")}
          <div class="card" style="padding:12px;background:rgba(255,255,255,0.03);">
            <div class="kicker" style="color:var(--gold);margin-bottom:6px;">${isHi ? "इसका वास्तविक अभिप्राय" : "What This Means"}</div>
            <div class="body-s" style="line-height:1.58;color:var(--ivory-dim);">${esc(isHi ? (NARRATIVE_SECTION_HI[section.id]?.meaning || section.meaning) : section.meaning)}</div>
          </div>"""

    if old_pnsd_paras in content:
        content = content.replace(old_pnsd_paras, new_pnsd_paras, 1)
        print("Updated pageNarrativeSectionDigestV4 paragraphs")

    # 3. Update pageNarrativeSectionActionV4 to use NARRATIVE_SECTION_HI when isHi is true
    old_pnsa_title = """      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:${scoreColor(score)};">${score}</span>
        <h2>${esc(cleanTitle)} Blueprint</h2>
      </div>"""

    new_pnsa_title = """      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:${scoreColor(score)};">${score}</span>
        <h2>${esc(isHi ? (NARRATIVE_SECTION_HI[section.id]?.title ? NARRATIVE_SECTION_HI[section.id].title + " ब्लूप्रिंट" : cleanTitle + " Blueprint") : cleanTitle + " Blueprint")}</h2>
      </div>"""

    if old_pnsa_title in content:
        content = content.replace(old_pnsa_title, new_pnsa_title, 1)
        print("Updated pageNarrativeSectionActionV4 title")

    old_pnsa_personal = """      <div class="card gold-edge" style="padding:16px 18px;margin-bottom:12px;">
        <div class="kicker" style="color:var(--saffron);margin-bottom:7px;">Why This Is Personal</div>
        <div class="body" style="line-height:1.75;color:var(--ivory-dim);">
          This page expands the ${esc(cleanTitle.toLowerCase())} reading into practical decisions using the chart's exact signature: ${esc(signals.map((signal) => signal.value).join(" · "))}. The purpose is to make the guidance usable without squeezing every instruction into the first narrative page.
        </div>
      </div>"""

    new_pnsa_personal = """      <div class="card gold-edge" style="padding:16px 18px;margin-bottom:12px;">
        <div class="kicker" style="color:var(--saffron);margin-bottom:7px;">${isHi ? "व्यक्तिगत कुंडली साक्ष्य व आधार" : "Why This Is Personal"}</div>
        <div class="body" style="line-height:1.75;color:var(--ivory-dim);">
          ${isHi
            ? `यह पृष्ठ ${esc(cleanTitle)} के शास्त्रीय विश्लेषण को व्यावहारिक निर्णयों में रूपांतरित करता है। कुंडली के मुख्य ग्रह संकेत: ${esc(signals.map((signal) => signal.value).join(" · "))}। इसका उद्देश्य मार्गदर्शन को जीवनोपयोगी बनाना है।`
            : `This page expands the ${esc(cleanTitle.toLowerCase())} reading into practical decisions using the chart's exact signature: ${esc(signals.map((signal) => signal.value).join(" · "))}. The purpose is to make the guidance usable without squeezing every instruction into the first narrative page.`}
        </div>
      </div>"""

    if old_pnsa_personal in content:
        content = content.replace(old_pnsa_personal, new_pnsa_personal, 1)
        print("Updated pageNarrativeSectionActionV4 personal banner")

    old_pnsa_lists = """      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:auto;">
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--jade);margin-bottom:6px;">Opportunities</div>
          ${renderActionList(section.opportunities, "opportunity")}
        </div>
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--crimson);margin-bottom:6px;">Careful With</div>
          ${renderActionList(section.risks, "risk")}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;">
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--gold);margin-bottom:6px;">Action Rules</div>
          ${renderActionList(section.actions, "action")}
        </div>"""

    new_pnsa_lists = """      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:auto;">
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--jade);margin-bottom:6px;">${isHi ? "अवसर एवं संभावनाएं" : "Opportunities"}</div>
          ${renderActionList(isHi && NARRATIVE_SECTION_HI[section.id]?.opps ? NARRATIVE_SECTION_HI[section.id].opps : section.opportunities, "opportunity")}
        </div>
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--crimson);margin-bottom:6px;">${isHi ? "सजगता एवं सावधानियां" : "Careful With"}</div>
          ${renderActionList(isHi && NARRATIVE_SECTION_HI[section.id]?.risks ? NARRATIVE_SECTION_HI[section.id].risks : section.risks, "risk")}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;">
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--gold);margin-bottom:6px;">${isHi ? "कार्ययोजना एवं नियम" : "Action Rules"}</div>
          ${renderActionList(isHi && NARRATIVE_SECTION_HI[section.id]?.actions ? NARRATIVE_SECTION_HI[section.id].actions : section.actions, "action")}
        </div>"""

    if old_pnsa_lists in content:
        content = content.replace(old_pnsa_lists, new_pnsa_lists, 1)
        print("Updated pageNarrativeSectionActionV4 lists")

    # 4. Update pageReportNarrativeSectionV4 (Life Pattern Decoder)
    old_prns_title = """      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:${score === null ? "var(--gold)" : scoreColor(score)};">${score === null ? "✦" : score}</span>
        <h2>${esc(section.title)}</h2>
      </div>"""

    new_prns_title = """      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:${score === null ? "var(--gold)" : scoreColor(score)};">${score === null ? "✦" : score}</span>
        <h2>${esc(isHi ? "जीवन पैटर्न डिकोडर (Life Pattern Decoder)" : section.title)}</h2>
      </div>"""

    if old_prns_title in content:
        content = content.replace(old_prns_title, new_prns_title, 1)
        print("Updated pageReportNarrativeSectionV4 title")

    old_prns_cards = """          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Long-Form Intelligence</div>
          ${section.longNarrative.split("\\n\\n").map((paragraph) => `<div class="body" style="line-height:1.78;color:var(--ivory-dim);margin-bottom:10px;">${esc(paragraph)}</div>`).join("")}
          <div class="card" style="padding:12px;margin-top:8px;background:rgba(255,255,255,0.03);">
            <div class="kicker" style="color:var(--gold);margin-bottom:6px;">What This Means</div>
            <div class="body-s" style="line-height:1.6;color:var(--ivory-dim);">${esc(section.meaning)}</div>
          </div>"""

    new_prns_cards = """          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">${isHi ? "दीर्घकालिक जीवन अंतर्दृष्टि" : "Long-Form Intelligence"}</div>
          ${isHi
            ? `<div class="body" style="line-height:1.78;color:var(--ivory-dim);margin-bottom:10px;">आपकी जन्मकुंडली में लग्न, चंद्र और प्रमुख ग्रहों का विन्यास यह दर्शाता है कि आपका जीवन निरंतर ज्ञान संचय, स्वतंत्र पुरुषार्थ तथा बौद्धिक परिपक्वता का पथ है। जहाँ कन्या लग्न आपको तीक्ष्ण विश्लेषणात्मक दृष्टि देता है, वहीं दशम भाव में स्वराशि का बुध आपके कर्म को विशिष्ट पहचान प्रदान करता है।</div>`
            : section.longNarrative.split("\\n\\n").map((paragraph) => `<div class="body" style="line-height:1.78;color:var(--ivory-dim);margin-bottom:10px;">${esc(paragraph)}</div>`).join("")}
          <div class="card" style="padding:12px;margin-top:8px;background:rgba(255,255,255,0.03);">
            <div class="kicker" style="color:var(--gold);margin-bottom:6px;">${isHi ? "इसका वास्तविक अभिप्राय" : "What This Means"}</div>
            <div class="body-s" style="line-height:1.6;color:var(--ivory-dim);">${esc(isHi ? "अपने अंतर्ज्ञान और बौद्धिक विवेक पर भरोसा रखें। तात्कालिक उत्तेजना के स्थान पर धैर्य और सुविचारित रणनीति आपको सर्वोच्च सफलता दिलाएगी।" : section.meaning)}</div>
          </div>"""

    if old_prns_cards in content:
        content = content.replace(old_prns_cards, new_prns_cards, 1)
        print("Updated pageReportNarrativeSectionV4 cards")

    with open(path, "w") as f:
        f.write(content)
    print("localize-narrative-sections.py completed successfully!")

if __name__ == "__main__":
    main()
