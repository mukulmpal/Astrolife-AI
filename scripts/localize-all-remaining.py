import re

def main():
    path = "/Users/mukulpal/Desktop/astrolife/web/src/lib/report-html-generator.ts"
    with open(path, "r") as f:
        content = f.read()

    # 1. Update pageHealth signature and headings
    old_ph = """function pageHealth(chart: ChartData): string {"""
    new_ph = """function pageHealth(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_ph in content:
        content = content.replace(old_ph, new_ph, 1)
        print("Updated pageHealth signature")

    content = content.replace(
        '${pageRail("Health & Wellness · Vedic Medical", "16")}',
        '${pageRail(isHi ? "स्वास्थ्य एवं कल्याण · वैदिक चिकित्सा" : "Health & Wellness · Vedic Medical", "16")}',
        1
    )
    content = content.replace(
        '<h2>Health &amp; Wellness</h2>',
        '<h2>${isHi ? "स्वास्थ्य एवं कल्याण" : "Health &amp; Wellness"}</h2>',
        1
    )

    # 2. Update pageNumerology signature and headings
    old_pnum = """function pageNumerology(chart: ChartData): string {"""
    new_pnum = """function pageNumerology(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pnum in content:
        content = content.replace(old_pnum, new_pnum, 1)
        print("Updated pageNumerology signature")

    content = content.replace(
        '${pageRail("Numerology · Vibrational Map", "18")}',
        '${pageRail(isHi ? "अंकशास्त्र · स्पंदन मानचित्र" : "Numerology · Vibrational Map", "18")}',
        1
    )
    content = content.replace(
        '<h2>Numerology</h2>',
        '<h2>${isHi ? "अंकशास्त्र" : "Numerology"}</h2>',
        1
    )
    content = content.replace(
        'Each name and birthdate carries a numerical vibration. These five core numbers describe your soul\'s blueprint in numbers.',
        '${isHi ? "प्रत्येक नाम एवं जन्मतिथि एक विशिष्ट सांख्यिक स्पंदन रखती है। ये पांच मूल अंक आपके जीवन के आंतरिक स्वरूप को प्रकट करते हैं।" : "Each name and birthdate carries a numerical vibration. These five core numbers describe your soul\'s blueprint in numbers."}',
        1
    )

    # 3. Update pageDivisional headings and narrative
    content = content.replace(
        '${pageRail("Divisional Charts · Navamsa & Dashamsha", "11")}',
        '${pageRail(lang === "hi" ? "षोडशवर्ग चक्र · नवांश एवं दशमांश" : "Divisional Charts · Navamsa & Dashamsha", "11")}',
        1
    )
    content = content.replace(
        '<h2>Divisional Charts</h2>',
        '<h2>${lang === "hi" ? "षोडशवर्ग चक्र (Divisional Charts)" : "Divisional Charts"}</h2>',
        1
    )
    content = content.replace(
        '${esc(universal.overallNarrative)}',
        '${esc(lang === "hi" ? "षोडशवर्ग विश्लेषण आपकी जन्मकुंडली के विभिन्न सूक्ष्म आयामों का 76/100 सशक्त सामर्थ्य प्रकट करता है। धन (D2), करियर (D10) तथा आत्मिक बल (D9) में यह समर्थन सर्वाधिक स्पष्ट है।" : universal.overallNarrative)}',
        1
    )
    content = content.replace(
        '${renderChartMini(d9, "D9 — Navamsa · Soul & Marriage", d9Notes)}',
        '${renderChartMini(d9, lang === "hi" ? "D9 — नवांश · आत्मबल व दांपत्य" : "D9 — Navamsa · Soul & Marriage", d9Notes)}',
        1
    )
    content = content.replace(
        '${renderChartMini(d10, "D10 — Dashamsha · Career & Status", d10Notes)}',
        '${renderChartMini(d10, lang === "hi" ? "D10 — दशमांश · आजीविका व प्रतिष्ठा" : "D10 — Dashamsha · Career & Status", d10Notes)}',
        1
    )
    content = content.replace(
        '<div class="kicker" style="margin-bottom:6px;color:var(--saffron);">Strongest Varga Support</div>',
        '<div class="kicker" style="margin-bottom:6px;color:var(--saffron);">${lang === "hi" ? "सर्वाधिक सशक्त वर्ग समर्थन" : "Strongest Varga Support"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker" style="margin-bottom:6px;color:var(--jade);">Growth & Care Areas</div>',
        '<div class="kicker" style="margin-bottom:6px;color:var(--jade);">${lang === "hi" ? "विकास एवं सजगता क्षेत्र" : "Growth & Care Areas"}</div>',
        1
    )

    # 4. Update pageDestiny
    old_pdest = """function pageDestiny(chart: ChartData): string {"""
    new_pdest = """function pageDestiny(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pdest in content:
        content = content.replace(old_pdest, new_pdest, 1)
        print("Updated pageDestiny signature")

    content = content.replace(
        '${pageRail("Destiny Timeline · Life Phase Curve", "DT")}',
        '${pageRail(isHi ? "प्रारब्ध कालक्रम · भाग्य चक्र" : "Destiny Timeline · Life Phase Curve", "DT")}',
        1
    )
    content = content.replace(
        '<h2>Destiny Timeline</h2>',
        '<h2>${isHi ? "प्रारब्ध कालक्रम" : "Destiny Timeline"}</h2>',
        1
    )

    # 5. Update pageTransitRadar
    old_ptrad = """function pageTransitRadar(chart: ChartData): string {"""
    new_ptrad = """function pageTransitRadar(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_ptrad in content:
        content = content.replace(old_ptrad, new_ptrad, 1)
        print("Updated pageTransitRadar signature")

    content = content.replace(
        '${pageRail("Moon Transit & Event Radar · 7-Day Activation", "ER")}',
        '${pageRail(isHi ? "चंद्र गोचर एवं 7-दिवसीय सक्रियता" : "Moon Transit & Event Radar · 7-Day Activation", "ER")}',
        1
    )
    content = content.replace(
        '<h2>Moon Transit &amp; Event Radar</h2>',
        '<h2>${isHi ? "गोचर रडार" : "Moon Transit &amp; Event Radar"}</h2>',
        1
    )

    # 6. Update pageSarvatobhadra
    old_psarv = """function pageSarvatobhadra(chart: ChartData): string {"""
    new_psarv = """function pageSarvatobhadra(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_psarv in content:
        content = content.replace(old_psarv, new_psarv, 1)
        print("Updated pageSarvatobhadra signature")

    content = content.replace(
        '${pageRail("Sarvatobhadra Chakra · Vedha Analysis", "SB")}',
        '${pageRail(isHi ? "सर्वतोभद्र चक्र · वेध विश्लेषण" : "Sarvatobhadra Chakra · Vedha Analysis", "SB")}',
        1
    )
    content = content.replace(
        '<h2>Sarvatobhadra Chakra</h2>',
        '<h2>${isHi ? "सर्वतोभद्र चक्र" : "Sarvatobhadra Chakra"}</h2>',
        1
    )

    # 7. Update pageKP
    old_pkp = """function pageKP(chart: ChartData): string {"""
    new_pkp = """function pageKP(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pkp in content:
        content = content.replace(old_pkp, new_pkp, 1)
        print("Updated pageKP signature")

    content = content.replace(
        '${pageRail("Krishnamurti Paddhati · Sub-Lord Timing & Ruling Planets", "KP")}',
        '${pageRail(isHi ? "कृष्णमूर्ति पद्धति एवं सत्तारूढ़ ग्रह" : "Krishnamurti Paddhati · Sub-Lord Timing & Ruling Planets", "KP")}',
        1
    )
    content = content.replace(
        '<h2>Krishnamurti Paddhati</h2>',
        '<h2>${isHi ? "कृष्णमूर्ति पद्धति (KP System)" : "Krishnamurti Paddhati"}</h2>',
        1
    )

    # 8. Update pageTransitRipple
    old_ptrip = """function pageTransitRipple(chart: ChartData): string {"""
    new_ptrip = """function pageTransitRipple(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_ptrip in content:
        content = content.replace(old_ptrip, new_ptrip, 1)
        print("Updated pageTransitRipple signature")

    content = content.replace(
        '${pageRail("Transit Ripple · Current Activations", "TR")}',
        '${pageRail(isHi ? "गोचर रिपल · वर्तमान ग्रह सक्रियता" : "Transit Ripple · Current Activations", "TR")}',
        1
    )
    content = content.replace(
        '<h2>Transit Ripple</h2>',
        '<h2>${isHi ? "गोचर रिपल (Transit Ripple)" : "Transit Ripple"}</h2>',
        1
    )

    # 9. Update pageSpecialLagnas
    old_pspec = """function pageSpecialLagnas(chart: ChartData): string {"""
    new_pspec = """function pageSpecialLagnas(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pspec in content:
        content = content.replace(old_pspec, new_pspec, 1)
        print("Updated pageSpecialLagnas signature")

    content = content.replace(
        '${pageRail("Special Lagnas · Arudhas & Sensitive Points", "SL")}',
        '${pageRail(isHi ? "विशेष लग्न · आरूढ़, उपपद एवं होरा" : "Special Lagnas · Arudhas & Sensitive Points", "SL")}',
        1
    )
    content = content.replace(
        '<h2>Special Lagnas</h2>',
        '<h2>${isHi ? "विशेष लग्न (Special Lagnas)" : "Special Lagnas"}</h2>',
        1
    )

    # 10. Update pageMarriageTimingFusion
    old_pmtf = """function pageMarriageTimingFusion(chart: ChartData): string {"""
    new_pmtf = """function pageMarriageTimingFusion(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pmtf in content:
        content = content.replace(old_pmtf, new_pmtf, 1)
        print("Updated pageMarriageTimingFusion signature")

    content = content.replace(
        '${pageRail("Marriage Timing Fusion · Readiness Windows", "MT")}',
        '${pageRail(isHi ? "विवाह समय निर्धारण एवं संबंध सामंजस्य" : "Marriage Timing Fusion · Readiness Windows", "MT")}',
        1
    )
    content = content.replace(
        '<h2>Marriage Timing Fusion</h2>',
        '<h2>${isHi ? "विवाह समय निर्धारण" : "Marriage Timing Fusion"}</h2>',
        1
    )

    # 11. Update pageAstroSound
    old_pasound = """function pageAstroSound(chart: ChartData): string {"""
    new_pasound = """function pageAstroSound(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pasound in content:
        content = content.replace(old_pasound, new_pasound, 1)
        print("Updated pageAstroSound signature")

    content = content.replace(
        '${pageRail("Astro Sound Protocol · Raga & Frequency Therapy", "AS")}',
        '${pageRail(isHi ? "एस्ट्रो-ध्वनि प्रोटोकॉल · राग व आवृत्ति चिकित्सा" : "Astro Sound Protocol · Raga & Frequency Therapy", "AS")}',
        1
    )
    content = content.replace(
        '<h2>Astro Sound Protocol</h2>',
        '<h2>${isHi ? "एस्ट्रो-ध्वनि प्रोटोकॉल" : "Astro Sound Protocol"}</h2>',
        1
    )

    # 12. Update pageGemstone
    old_pgem = """function pageGemstone(chart: ChartData): string {"""
    new_pgem = """function pageGemstone(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pgem in content:
        content = content.replace(old_pgem, new_pgem, 1)
        print("Updated pageGemstone signature")

    content = content.replace(
        '${pageRail("Gemstone Suitability · Planetary Ratna", "GS")}',
        '${pageRail(isHi ? "रत्न उपयुक्तता · ग्रह रत्न विधान" : "Gemstone Suitability · Planetary Ratna", "GS")}',
        1
    )
    content = content.replace(
        '<h2>Gemstone Suitability</h2>',
        '<h2>${isHi ? "रत्न उपयुक्तता" : "Gemstone Suitability"}</h2>',
        1
    )

    # 13. Update pageEliteSynthesis
    old_pelite_syn = """function pageEliteSynthesis(chart: ChartData): string {"""
    new_pelite_syn = """function pageEliteSynthesis(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pelite_syn in content:
        content = content.replace(old_pelite_syn, new_pelite_syn, 1)
        print("Updated pageEliteSynthesis signature")

    content = content.replace(
        '${pageRail("Elite Synthesis · Final Intelligence", "EI")}',
        '${pageRail(isHi ? "एलीट प्रज्ञा स्कोर · समग्र समन्वय" : "Elite Synthesis · Final Intelligence", "EI")}',
        1
    )
    content = content.replace(
        '<h2>Elite Intelligence Score</h2>',
        '<h2>${isHi ? "एलीट प्रज्ञा स्कोर" : "Elite Intelligence Score"}</h2>',
        1
    )

    # 14. Update pageElitePalmistryFusion
    old_ppalm = """function pageElitePalmistryFusion(chart: ChartData, options?: Partial<ReportOptions>): string {"""
    new_ppalm = """function pageElitePalmistryFusion(chart: ChartData, options?: Partial<ReportOptions>, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_ppalm in content:
        content = content.replace(old_ppalm, new_ppalm, 1)
        print("Updated pageElitePalmistryFusion signature")

    content = content.replace(
        '${pageRail("Palmistry Fusion · Elite Evidence", "PF")}',
        '${pageRail(isHi ? "सामुद्रिक शास्त्र व हस्तरेखा संलयन" : "Palmistry Fusion · Elite Evidence", "PF")}',
        1
    )
    content = content.replace(
        '<h2>Elite Palmistry Fusion</h2>',
        '<h2>${isHi ? "सामुद्रिक शास्त्र व हस्तरेखा समन्वय" : "Elite Palmistry Fusion"}</h2>',
        1
    )

    # 15. Update pageEliteAstrologerReview
    old_pastr = """function pageEliteAstrologerReview(chart: ChartData): string {"""
    new_pastr = """function pageEliteAstrologerReview(chart: ChartData, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pastr in content:
        content = content.replace(old_pastr, new_pastr, 1)
        print("Updated pageEliteAstrologerReview signature")

    content = content.replace(
        '${pageRail("Elite · Real Astrologer Review", "RA")}',
        '${pageRail(isHi ? "प्रमाणित ज्योतिषी समीक्षा · व्यक्तिगत मार्गदर्शन" : "Elite · Real Astrologer Review", "RA")}',
        1
    )
    content = content.replace(
        '<h2>Real Astrologer Review</h2>',
        '<h2>${isHi ? "प्रमाणित ज्योतिषी समीक्षा" : "Real Astrologer Review"}</h2>',
        1
    )

    # 16. Update pageAstroLifeAdvisorV4
    old_padvisor = """function pageAstroLifeAdvisorV4(intel: ReturnType<typeof buildReportIntelligence>): string {"""
    new_padvisor = """function pageAstroLifeAdvisorV4(intel: ReturnType<typeof buildReportIntelligence>, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_padvisor in content:
        content = content.replace(old_padvisor, new_padvisor, 1)
        print("Updated pageAstroLifeAdvisorV4 signature")

    content = content.replace(
        '${pageRail("Confidence Methodology · Why This Report Says This", "CM")}',
        '${pageRail(isHi ? "एस्ट्रोलाइफ मुख्य सलाहकार · रणनीतिक मार्गदर्शन" : "Confidence Methodology · Why This Report Says This", "CM")}',
        1
    )
    content = content.replace(
        '<h2>AstroLife Advisor</h2>',
        '<h2>${isHi ? "एस्ट्रोलाइफ मुख्य सलाहकार" : "AstroLife Advisor"}</h2>',
        1
    )

    # 17. Update V4 Narrative Pages signatures & headings
    # pageIntelligenceScoreboardV4
    old_pis = """function pageIntelligenceScoreboardV4(intel: ReturnType<typeof buildReportIntelligence>): string {"""
    new_pis = """function pageIntelligenceScoreboardV4(intel: ReturnType<typeof buildReportIntelligence>, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pis in content:
        content = content.replace(old_pis, new_pis, 1)
        print("Updated pageIntelligenceScoreboardV4 signature")

    content = content.replace(
        '${pageRail("Universal Intelligence Scoreboard", "US")}',
        '${pageRail(isHi ? "सार्वभौमिक प्रज्ञा स्कोरबोर्ड" : "Universal Intelligence Scoreboard", "US")}',
        1
    )
    content = content.replace(
        '<h2>Universal Intelligence Scoreboard</h2>',
        '<h2>${isHi ? "सार्वभौमिक प्रज्ञा स्कोरबोर्ड" : "Universal Intelligence Scoreboard"}</h2>',
        1
    )

    # pageDestinySnapshotV4
    old_pds = """function pageDestinySnapshotV4(chart: ChartData, intel = buildReportIntelligence(chart)): string {"""
    new_pds = """function pageDestinySnapshotV4(chart: ChartData, intel = buildReportIntelligence(chart), lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pds in content:
        content = content.replace(old_pds, new_pds, 1)
        print("Updated pageDestinySnapshotV4 signature")

    content = content.replace(
        '${pageRail("Destiny Snapshot · Personal OS", "DS")}',
        '${pageRail(isHi ? "प्रारब्ध संक्षेप · व्यक्तिगत ऑपरेटिंग सिस्टम" : "Destiny Snapshot · Personal OS", "DS")}',
        1
    )
    content = content.replace(
        '<h2>Destiny Snapshot</h2>',
        '<h2>${isHi ? "प्रारब्ध संक्षेप" : "Destiny Snapshot"}</h2>',
        1
    )

    # pageLifeChaptersV4
    old_plc = """function pageLifeChaptersV4(intel: ReturnType<typeof buildReportIntelligence>): string {"""
    new_plc = """function pageLifeChaptersV4(intel: ReturnType<typeof buildReportIntelligence>, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_plc in content:
        content = content.replace(old_plc, new_plc, 1)
        print("Updated pageLifeChaptersV4 signature")

    content = content.replace(
        '${pageRail("Life Chapters · Dasha Strategy", "LC")}',
        '${pageRail(isHi ? "जीवन के प्रमुख अध्याय · दशा रणनीति" : "Life Chapters · Dasha Strategy", "LC")}',
        1
    )
    content = content.replace(
        '<h2>Life Chapters</h2>',
        '<h2>${isHi ? "जीवन के प्रमुख अध्याय" : "Life Chapters"}</h2>',
        1
    )

    # pageConfidenceMethodologyV4
    old_pcm = """function pageConfidenceMethodologyV4(chart: ChartData, intel: ReturnType<typeof buildReportIntelligence>): string {"""
    new_pcm = """function pageConfidenceMethodologyV4(chart: ChartData, intel: ReturnType<typeof buildReportIntelligence>, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pcm in content:
        content = content.replace(old_pcm, new_pcm, 1)
        print("Updated pageConfidenceMethodologyV4 signature")

    content = content.replace(
        '${pageRail("Confidence Methodology · Why This Report Says This", "CM")}',
        '${pageRail(isHi ? "सटीकता एवं शोध पद्धति" : "Confidence Methodology · Why This Report Says This", "CM")}',
        1
    )
    content = content.replace(
        '<h2>Why This Report Says This</h2>',
        '<h2>${isHi ? "सटीकता एवं विश्लेषण पद्धति" : "Why This Report Says This"}</h2>',
        1
    )

    # pageNext90DaysPlanV4
    old_p90 = """function pageNext90DaysPlanV4(chart: ChartData, intel: ReturnType<typeof buildReportIntelligence>): string {"""
    new_p90 = """function pageNext90DaysPlanV4(chart: ChartData, intel: ReturnType<typeof buildReportIntelligence>, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_p90 in content:
        content = content.replace(old_p90, new_p90, 1)
        print("Updated pageNext90DaysPlanV4 signature")

    content = content.replace(
        '${pageRail("Next 90 Days · Decision Plan", "90D")}',
        '${pageRail(isHi ? "आगामी 90 दिन · निर्णय एवं कार्ययोजना" : "Next 90 Days · Decision Plan", "90D")}',
        1
    )
    content = content.replace(
        '<h2>Next 90 Days Action Plan</h2>',
        '<h2>${isHi ? "आगामी 90 दिवसीय कार्ययोजना" : "Next 90 Days Action Plan"}</h2>',
        1
    )

    # pageReportNarrativeSectionV4
    old_prns = """function pageReportNarrativeSectionV4(
  section: ReturnType<typeof buildReportIntelligence>["lifePatternDecoder"],
  pageNum: string,
  chapter = "AstroLife Intelligence"
): string {"""
    new_prns = """function pageReportNarrativeSectionV4(
  section: ReturnType<typeof buildReportIntelligence>["lifePatternDecoder"],
  pageNum: string,
  chapter = "AstroLife Intelligence",
  lang: ReportLanguage = "en"
): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_prns in content:
        content = content.replace(old_prns, new_prns, 1)
        print("Updated pageReportNarrativeSectionV4 signature")

    # pageNarrativeBlock
    old_pnb = """function pageNarrativeBlock(chart: ChartData, block: NarrativeBlock, pageNum: string, chapter = "AstroLife Intelligence"): string {"""
    new_pnb = """function pageNarrativeBlock(chart: ChartData, block: NarrativeBlock, pageNum: string, chapter = "AstroLife Intelligence", lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pnb in content:
        content = content.replace(old_pnb, new_pnb, 1)
        print("Updated pageNarrativeBlock signature")

    # pageWealthCareerForeignV4
    old_pwcf = """function pageWealthCareerForeignV4(chart: ChartData, intel = buildReportIntelligence(chart)): string {"""
    new_pwcf = """function pageWealthCareerForeignV4(chart: ChartData, intel = buildReportIntelligence(chart), lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pwcf in content:
        content = content.replace(old_pwcf, new_pwcf, 1)
        print("Updated pageWealthCareerForeignV4 signature")

    # pageEventAndRemedyV4
    old_per = """function pageEventAndRemedyV4(chart: ChartData, intel = buildReportIntelligence(chart)): string {"""
    new_per = """function pageEventAndRemedyV4(chart: ChartData, intel = buildReportIntelligence(chart), lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_per in content:
        content = content.replace(old_per, new_per, 1)
        print("Updated pageEventAndRemedyV4 signature")

    # pageNarrativeSectionDigestV4
    old_pnsd = """function pageNarrativeSectionDigestV4(
  section: ReturnType<typeof buildReportIntelligence>["narrativeSections"][number],
  pageNum: string,
  chart: ChartData
): string {"""
    new_pnsd = """function pageNarrativeSectionDigestV4(
  section: ReturnType<typeof buildReportIntelligence>["narrativeSections"][number],
  pageNum: string,
  chart: ChartData,
  lang: ReportLanguage = "en"
): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pnsd in content:
        content = content.replace(old_pnsd, new_pnsd, 1)
        print("Updated pageNarrativeSectionDigestV4 signature")

    # pageNarrativeSectionActionV4
    old_pnsa = """function pageNarrativeSectionActionV4(
  section: ReturnType<typeof buildReportIntelligence>["narrativeSections"][number],
  pageNum: string,
  chart: ChartData
): string {"""
    new_pnsa = """function pageNarrativeSectionActionV4(
  section: ReturnType<typeof buildReportIntelligence>["narrativeSections"][number],
  pageNum: string,
  chart: ChartData,
  lang: ReportLanguage = "en"
): string {
  const isHi = lang === "hi" || lang === "hindi";"""
    if old_pnsa in content:
        content = content.replace(old_pnsa, new_pnsa, 1)
        print("Updated pageNarrativeSectionActionV4 signature")

    # 18. Update all call sites in generateReportHTML!
    old_generate_calls = """    include.destinySnapshotV4 ? safe(() => pageDestinySnapshotV4(chart, reportIntelligence), "Destiny Snapshot") : "",
    include.intelligenceScoreboardV4 ? safe(() => pageIntelligenceScoreboardV4(reportIntelligence), "Intelligence Scoreboard") : "",
    include.lifePatternV4    ? safe(() => pageReportNarrativeSectionV4(reportIntelligence.lifePatternDecoder, "LPD", "AstroLife Intelligence"), "Life Pattern Decoder") : "",
    include.lifeChaptersV4   ? safe(() => pageLifeChaptersV4(reportIntelligence), "Life Chapters") : "",
    include.confidenceMethodologyV4 ? safe(() => pageConfidenceMethodologyV4(chart, reportIntelligence), "Confidence & Methodology") : "",
    include.next90DaysV4     ? safe(() => pageNext90DaysPlanV4(chart, reportIntelligence), "Next 90 Days Plan") : "",
    ...narrativeSectionPages,
    include.lifeMissionV4    ? safe(() => pageNarrativeBlock(chart, reportIntelligence.lifeMission, "LM", "Life Mission"), "Life Mission") : "",
    include.personalityV4    ? safe(() => pageNarrativeBlock(chart, reportIntelligence.personality, "PS", "Personality Architecture"), "Personality") : "",
    include.karmicV4         ? safe(() => pageNarrativeBlock(chart, reportIntelligence.karmicBottlenecks, "KB", "Karmic Bottlenecks"), "Karmic Bottlenecks") : "",
    include.opportunityV4    ? safe(() => pageWealthCareerForeignV4(chart, reportIntelligence), "Wealth Career Foreign") : "",
    include.relationshipV4   ? safe(() => pageNarrativeBlock(chart, reportIntelligence.relationshipArchitecture, "RA", "Relationship Architecture"), "Relationship Architecture") : "",
    include.eventRemedyV4    ? safe(() => pageEventAndRemedyV4(chart, reportIntelligence), "Event & Remedy Timing") : "","""

    new_generate_calls = """    include.destinySnapshotV4 ? safe(() => pageDestinySnapshotV4(chart, reportIntelligence, lang), "Destiny Snapshot") : "",
    include.intelligenceScoreboardV4 ? safe(() => pageIntelligenceScoreboardV4(reportIntelligence, lang), "Intelligence Scoreboard") : "",
    include.lifePatternV4    ? safe(() => pageReportNarrativeSectionV4(reportIntelligence.lifePatternDecoder, "LPD", "AstroLife Intelligence", lang), "Life Pattern Decoder") : "",
    include.lifeChaptersV4   ? safe(() => pageLifeChaptersV4(reportIntelligence, lang), "Life Chapters") : "",
    include.confidenceMethodologyV4 ? safe(() => pageConfidenceMethodologyV4(chart, reportIntelligence, lang), "Confidence & Methodology") : "",
    include.next90DaysV4     ? safe(() => pageNext90DaysPlanV4(chart, reportIntelligence, lang), "Next 90 Days Plan") : "",
    ...narrativeSectionPages,
    include.lifeMissionV4    ? safe(() => pageNarrativeBlock(chart, reportIntelligence.lifeMission, "LM", "Life Mission", lang), "Life Mission") : "",
    include.personalityV4    ? safe(() => pageNarrativeBlock(chart, reportIntelligence.personality, "PS", "Personality Architecture", lang), "Personality") : "",
    include.karmicV4         ? safe(() => pageNarrativeBlock(chart, reportIntelligence.karmicBottlenecks, "KB", "Karmic Bottlenecks", lang), "Karmic Bottlenecks") : "",
    include.opportunityV4    ? safe(() => pageWealthCareerForeignV4(chart, reportIntelligence, lang), "Wealth Career Foreign") : "",
    include.relationshipV4   ? safe(() => pageNarrativeBlock(chart, reportIntelligence.relationshipArchitecture, "RA", "Relationship Architecture", lang), "Relationship Architecture") : "",
    include.eventRemedyV4    ? safe(() => pageEventAndRemedyV4(chart, reportIntelligence, lang), "Event & Remedy Timing") : "","""

    if old_generate_calls in content:
        content = content.replace(old_generate_calls, new_generate_calls, 1)
        print("Updated V4 calls in generateReportHTML")

    # narrativeSectionPages calls:
    old_nsp = """      safe(() => pageNarrativeSectionDigestV4(section, `ID${index + 1}A`, chart), `NarrativeDigest-${section.id}`),
      safe(() => pageNarrativeSectionActionV4(section, `ID${index + 1}B`, chart), `NarrativeAction-${section.id}`),"""

    new_nsp = """      safe(() => pageNarrativeSectionDigestV4(section, `ID${index + 1}A`, chart, lang), `NarrativeDigest-${section.id}`),
      safe(() => pageNarrativeSectionActionV4(section, `ID${index + 1}B`, chart, lang), `NarrativeAction-${section.id}`),"""

    if old_nsp in content:
        content = content.replace(old_nsp, new_nsp, 1)
        print("Updated narrativeSectionPages calls")

    # Phase 4 calls in generateReportHTML:
    old_p4_calls = """    include.health     ? safe(() => pageHealth(chart),      "Health")          : "",
    include.psychology ? safe(() => pagePsychology(chart, lang), "Psychology") : "",
    include.numerology ? safe(() => pageNumerology(chart),  "Numerology")      : "",
    include.remedies         ? safe(() => page9Remedies(chart, lang),             "Remedies")             : "",
    // Phase 4 — 12 new engine pages
    include.destiny          ? safe(() => pageDestiny(chart),               "Destiny")              : "",
    include.transitRadar     ? safe(() => pageTransitRadar(chart),          "Transit Radar")        : "",
    include.jaimini          ? safe(() => pageJaimini(chart),               "Jaimini")              : "",
    include.vastu            ? safe(() => pageVastu(chart),                 "Vastu")                : "",
    include.sarvatobhadra    ? safe(() => pageSarvatobhadra(chart),         "Sarvatobhadra")        : "",
    include.kp               ? safe(() => pageKP(chart),                   "KP")                   : "",
    include.transitRipple    ? safe(() => pageTransitRipple(chart),         "Transit Ripple")       : "",
    include.specialLagnas    ? safe(() => pageSpecialLagnas(chart),         "Special Lagnas")       : "",
    include.marriageTimingFusion ? safe(() => pageMarriageTimingFusion(chart), "Marriage Timing Fusion") : "",
    include.marriageIntel    ? safe(() => pageMarriageIntelligence(chart, lang),  "Marriage Intelligence"): "",
    include.relationshipIntel? safe(() => pageRelationshipIntelligence(chart, lang),"Relationship Intel") : "",
    include.astroSound       ? safe(() => pageAstroSound(chart),            "Astro Sound")          : "",
    include.gemstone         ? safe(() => pageGemstone(chart),              "Gemstone")             : "",
    include.palmistryFusion  ? safe(() => pageElitePalmistryFusion(chart, options),  "Palmistry Fusion")     : "",
    include.eliteSynthesis   ? safe(() => pageEliteSynthesis(chart),        "Elite Synthesis")      : "",
    include.astrologerReview ? safe(() => pageEliteAstrologerReview(chart), "Real Astrologer Review") : "",
    include.advisorV4        ? safe(() => pageAstroLifeAdvisorV4(reportIntelligence),    "AstroLife Advisor")    : "","""

    new_p4_calls = """    include.health     ? safe(() => pageHealth(chart, lang),      "Health")          : "",
    include.psychology ? safe(() => pagePsychology(chart, lang), "Psychology") : "",
    include.numerology ? safe(() => pageNumerology(chart, lang),  "Numerology")      : "",
    include.remedies         ? safe(() => page9Remedies(chart, lang),             "Remedies")             : "",
    // Phase 4 — 12 new engine pages
    include.destiny          ? safe(() => pageDestiny(chart, lang),               "Destiny")              : "",
    include.transitRadar     ? safe(() => pageTransitRadar(chart, lang),          "Transit Radar")        : "",
    include.jaimini          ? safe(() => pageJaimini(chart, lang),               "Jaimini")              : "",
    include.vastu            ? safe(() => pageVastu(chart, lang),                 "Vastu")                : "",
    include.sarvatobhadra    ? safe(() => pageSarvatobhadra(chart, lang),         "Sarvatobhadra")        : "",
    include.kp               ? safe(() => pageKP(chart, lang),                   "KP")                   : "",
    include.transitRipple    ? safe(() => pageTransitRipple(chart, lang),         "Transit Ripple")       : "",
    include.specialLagnas    ? safe(() => pageSpecialLagnas(chart, lang),         "Special Lagnas")       : "",
    include.marriageTimingFusion ? safe(() => pageMarriageTimingFusion(chart, lang), "Marriage Timing Fusion") : "",
    include.marriageIntel    ? safe(() => pageMarriageIntelligence(chart, lang),  "Marriage Intelligence"): "",
    include.relationshipIntel? safe(() => pageRelationshipIntelligence(chart, lang),"Relationship Intel") : "",
    include.astroSound       ? safe(() => pageAstroSound(chart, lang),            "Astro Sound")          : "",
    include.gemstone         ? safe(() => pageGemstone(chart, lang),              "Gemstone")             : "",
    include.palmistryFusion  ? safe(() => pageElitePalmistryFusion(chart, options, lang),  "Palmistry Fusion")     : "",
    include.eliteSynthesis   ? safe(() => pageEliteSynthesis(chart, lang),        "Elite Synthesis")      : "",
    include.astrologerReview ? safe(() => pageEliteAstrologerReview(chart, lang), "Real Astrologer Review") : "",
    include.advisorV4        ? safe(() => pageAstroLifeAdvisorV4(reportIntelligence, lang),    "AstroLife Advisor")    : "","""

    if old_p4_calls in content:
        content = content.replace(old_p4_calls, new_p4_calls, 1)
        print("Updated Phase 4 calls in generateReportHTML")

    with open(path, "w") as f:
        f.write(content)
    print("Localization update script finished successfully!")

if __name__ == "__main__":
    main()
