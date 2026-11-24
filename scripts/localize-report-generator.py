import re

def main():
    path = "/Users/mukulpal/Desktop/astrolife/web/src/lib/report-html-generator.ts"
    with open(path, "r") as f:
        content = f.read()

    # 1. Update pagePerPlanet implementation
    old_ppp = """function pagePerPlanet(chart: ChartData, name: string, pageNum: string, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";
  const pd = chart.planets[name];
  const prof = PLANET_PROFILE[name];"""

    new_ppp = """function pagePerPlanet(chart: ChartData, name: string, pageNum: string, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";
  const pd = chart.planets[name];
  const prof = isHi ? (PLANET_PROFILE_HI[name] ?? PLANET_PROFILE[name]) : PLANET_PROFILE[name];"""

    if old_ppp in content:
        content = content.replace(old_ppp, new_ppp, 1)
        print("Updated pagePerPlanet prof lookup")
    else:
        print("old_ppp not found, check if already updated")

    # Add DIGNITY_HI and PLANET_HOUSE_HI_CORE inside pagePerPlanet
    target_ppp_interp = """  // House-effect text from Lal Kitab knowledge if available
  const houseRule = PLANET_HOUSE_RULES[name]?.[pd.house];
  const lkInterp = getMahadashaInterpretation(name, pd.house, pd.dignity);"""

    replacement_ppp_interp = """  const DIGNITY_HI: Record<string, string> = {
    Exalted: "उच्च (Exalted)",
    "Own Sign": "स्वराशि (Own Sign)",
    "Moolatrikona": "मूलत्रिकोण (Moolatrikona)",
    Friendly: "मित्र राशि (Friendly)",
    Neutral: "सम राशि (Neutral)",
    Enemy: "शत्रु राशि (Enemy)",
    Debilitated: "नीच (Debilitated)",
  };
  const dignityDisplay = isHi ? (DIGNITY_HI[pd.dignity] ?? pd.dignity) : pd.dignity;
  const signDisplay = isHi ? `${RASHI_HI[pd.sign] ?? pd.sign} (${pd.sign})` : pd.sign;

  const PLANET_HOUSE_HI_CORE: Record<string, Record<number, string>> = {
    Sun: {
      10: "दशम भाव में सूर्य कुलदीपक योग की रचना करता है। यह स्थिति करियर में नेतृत्व, शासकीय सम्मान, उच्च पद, पिता के सहयोग तथा समाज में विशिष्ट अधिकार व प्रतिष्ठा प्रदान करती है।",
    },
    Moon: {
      12: "द्वादश भाव में चंद्रमा संवेदनशील मन, दूरस्थ यात्राओं, विदेशी संपर्कों तथा आध्यात्मिक एकांत की ओर ले जाता है। यहां चंद्रमा जातक को आत्ममंथन व अंतर्ज्ञान की शक्ति देता है।",
    },
    Mars: {
      12: "द्वादश भाव में मंगल अदम्य ऊर्जा, साहसिक निर्णयों तथा विदेशी गतिविधियों में पराक्रम दिलाता है। ऊर्जा का संतुलन बनाए रखना तथा जल्दबाजी से बचना श्रेयस्कर है।",
    },
    Mercury: {
      10: "दशम भाव में स्वराशि का बुध भद्र महापुरुष योग का प्रभाव देता है। यह वित्तीय प्रबंधन, व्यापारिक दूरदर्शिता, वाकपटुता तथा विश्लेषणात्मक कार्यों में सर्वोच्च सफलता दिलाता है।",
    },
    Jupiter: {
      3: "तृतीय भाव में गुरु जातक को स्वतंत्र पराक्रम, वैचारिक गंभीरता, लेखन व परामर्श कौशल तथा निरंतर बौद्धिक विकास की ओर अग्रसर करता है।",
    },
    Venus: {
      11: "एकादश भाव में शुक्र प्रचुर आर्थिक लाभ, सौंदर्यपरक दृष्टिकोण, उच्च संपर्कों से लाभ तथा सभी प्रकार के भौतिक सुख-साधनों की प्राप्ति कराता है।",
    },
    Saturn: {
      7: "सप्तम भाव में दिग्वली शनि परिपक्व दृष्टिकोण, कर्तव्यपरायणता, स्थिर दांपत्य व दीर्घकालिक व्यावसायिक साझेदारियों में न्यायप्रियता व स्थायित्व प्रदान करता है।",
    },
    Rahu: {
      2: "द्वितीय भाव में राहु वित्तीय रणनीति, लीक से हटकर धनार्जन के साधन तथा सम्मोहनकारी वाणी व प्रभावशीलता उत्पन्न करता है।",
    },
    Ketu: {
      8: "अष्टम भाव में केतु गूढ़ आध्यात्मिक चेतना, परा-विद्याओं में स्वाभाविक अभिरुचि तथा जीवन के गहनतम रहस्यों को समझने की तीक्ष्ण अंतर्दृष्टि प्रदान करता है।",
    },
  };

  // House-effect text from Lal Kitab knowledge if available
  const houseRule = PLANET_HOUSE_RULES[name]?.[pd.house];
  const lkInterp = getMahadashaInterpretation(name, pd.house, pd.dignity);
  const hiCore = PLANET_HOUSE_HI_CORE[name]?.[pd.house] || `${skt} भाव ${pd.house} में स्थित होकर जातक के जीवन में ${prof.domain} के क्षेत्रों को विशेष रूप से सक्रिय करता है।`;
  const interpText = isHi ? hiCore : (houseRule?.core || lkInterp.overview || `${name} in house ${pd.house} channels its energy into ${prof.domain.toLowerCase()}.`);"""

    if target_ppp_interp in content:
        content = content.replace(target_ppp_interp, replacement_ppp_interp, 1)
        print("Updated pagePerPlanet interpretation variables")

    # Update placement card in pagePerPlanet
    old_ppp_card = """          <div class="kicker" style="margin-bottom:4px;">${isHi ? "ग्रह स्थिति" : "Placement"}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--gold-bright);">${esc(pd.sign)} · ${isHi ? "भाव" : "House"} ${pd.house}</div>
          <div class="mono" style="font-size:11px;color:var(--ivory-mute);margin-top:2px;">${pd.degree}°${String(pd.minutes).padStart(2,"0")}' · ${esc(pd.nakshatra)} ${isHi ? "चरण" : "Pada"} ${pd.pada}${pd.retrograde ? (isHi ? " · वक्री (R)" : " · Retrograde (R)") : ""}</div>
        </div>
        <div style="text-align:right;">
          <div class="kicker" style="margin-bottom:4px;">${isHi ? "ग्रह अवस्था" : "Dignity"}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:${dignityColor};">${esc(pd.dignity)}</div>"""

    new_ppp_card = """          <div class="kicker" style="margin-bottom:4px;">${isHi ? "ग्रह स्थिति" : "Placement"}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--gold-bright);">${esc(signDisplay)} · ${isHi ? "भाव" : "House"} ${pd.house}</div>
          <div class="mono" style="font-size:11px;color:var(--ivory-mute);margin-top:2px;">${pd.degree}°${String(pd.minutes).padStart(2,"0")}' · ${esc(pd.nakshatra)} ${isHi ? "चरण" : "Pada"} ${pd.pada}${pd.retrograde ? (isHi ? " · वक्री (R)" : " · Retrograde (R)") : ""}</div>
        </div>
        <div style="text-align:right;">
          <div class="kicker" style="margin-bottom:4px;">${isHi ? "ग्रह अवस्था" : "Dignity"}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:20px;color:${dignityColor};">${esc(dignityDisplay)}</div>"""

    if old_ppp_card in content:
        content = content.replace(old_ppp_card, new_ppp_card, 1)
        print("Updated pagePerPlanet banner")

    # Update interp card in pagePerPlanet
    old_ppp_interp_card = """        <div class="kicker" style="margin-bottom:8px;color:var(--gold);">${isHi ? `आपकी कुंडली में — भाव ${pd.house}` : `In Your Chart — House ${pd.house}`}</div>
        <div class="body-s" style="line-height:1.65;">${esc(houseRule?.core || lkInterp.overview || `${name} in house ${pd.house} channels its energy into ${prof.domain.toLowerCase()}.`)}</div>"""

    new_ppp_interp_card = """        <div class="kicker" style="margin-bottom:8px;color:var(--gold);">${isHi ? `आपकी कुंडली में — भाव ${pd.house}` : `In Your Chart — House ${pd.house}`}</div>
        <div class="body-s" style="line-height:1.65;">${esc(interpText)}</div>"""

    if old_ppp_interp_card in content:
        content = content.replace(old_ppp_interp_card, new_ppp_interp_card, 1)
        print("Updated pagePerPlanet interp card")

    # 2. Update pagePerHouse implementation
    old_pph = """function pagePerHouse(chart: ChartData, houseNum: number, pageNum: string, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";
  const prof = HOUSE_PROFILE[houseNum];"""

    new_pph = """function pagePerHouse(chart: ChartData, houseNum: number, pageNum: string, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";
  const prof = isHi ? (HOUSE_PROFILE_HI[houseNum] ?? HOUSE_PROFILE[houseNum]) : HOUSE_PROFILE[houseNum];"""

    if old_pph in content:
        content = content.replace(old_pph, new_pph, 1)
        print("Updated pagePerHouse prof lookup")

    old_pph_lord_card = """          ${lordPd
            ? `<div class="body-s">${isHi ? "स्थिति:" : "Placed in"} <strong style="color:var(--ivory);">${esc(lordPd.sign)}</strong>, ${isHi ? "भाव" : "House"} <strong style="color:var(--ivory);">${lordPd.house}</strong> at ${lordPd.degree}°${String(lordPd.minutes).padStart(2,"0")}'.</div>
               <div class="body-s" style="margin-top:6px;">${isHi ? "अवस्था:" : "Dignity:"} <strong style="color:${(lordPd.dignity || '').toLowerCase().includes('debilit') || (lordPd.dignity || '').toLowerCase().includes('enemy') ? 'var(--crimson)' : (lordPd.dignity || '').toLowerCase().includes('exalt') || (lordPd.dignity || '').toLowerCase().includes('friend') ? 'var(--jade)' : 'var(--gold-bright)'};">${esc(lordPd.dignity || 'Neutral Sign')}</strong></div>`
            : `<div class="body-s">${isHi ? "भावेश की स्थिति अनुपलब्ध।" : "Lord placement unavailable."}</div>`}"""

    new_pph_lord_card = """          ${lordPd
            ? `<div class="body-s">${isHi ? "स्थिति:" : "Placed in"} <strong style="color:var(--ivory);">${esc(isHi ? (RASHI_HI[lordPd.sign] ?? lordPd.sign) : lordPd.sign)}</strong>, ${isHi ? "भाव" : "House"} <strong style="color:var(--ivory);">${lordPd.house}</strong> at ${lordPd.degree}°${String(lordPd.minutes).padStart(2,"0")}'.</div>
               <div class="body-s" style="margin-top:6px;">${isHi ? "अवस्था:" : "Dignity:"} <strong style="color:${(lordPd.dignity || '').toLowerCase().includes('debilit') || (lordPd.dignity || '').toLowerCase().includes('enemy') ? 'var(--crimson)' : (lordPd.dignity || '').toLowerCase().includes('exalt') || (lordPd.dignity || '').toLowerCase().includes('friend') ? 'var(--jade)' : 'var(--gold-bright)'};">${esc(isHi ? (lordPd.dignity === 'Own Sign' ? 'स्वराशि' : lordPd.dignity === 'Exalted' ? 'उच्च' : lordPd.dignity === 'Debilitated' ? 'नीच' : lordPd.dignity === 'Friendly' ? 'मित्र राशि' : lordPd.dignity === 'Enemy' ? 'शत्रु राशि' : 'सम राशि') : (lordPd.dignity || 'Neutral Sign'))}</strong></div>`
            : `<div class="body-s">${isHi ? "भावेश की स्थिति अनुपलब्ध।" : "Lord placement unavailable."}</div>`}"""

    if old_pph_lord_card in content:
        content = content.replace(old_pph_lord_card, new_pph_lord_card, 1)
        print("Updated pagePerHouse lord card")

    old_pph_occ_card = """          ${occupants.length > 0
            ? `<div class="body-s">${occupants.map(o => `<span style="color:var(--gold);">${esc(o)}</span>`).join(", ")}</div>"""

    new_pph_occ_card = """          ${occupants.length > 0
            ? `<div class="body-s">${occupants.map(o => `<span style="color:var(--gold);">${esc(isHi ? (PLANET_HI[o] ?? o) : o)}</span>`).join(", ")}</div>"""

    if old_pph_occ_card in content:
        content = content.replace(old_pph_occ_card, new_pph_occ_card, 1)
        print("Updated pagePerHouse occupants card")

    with open(path, "w") as f:
        f.write(content)
    print("Localize script completed step 1 & 2")

if __name__ == "__main__":
    main()
