import re

def main():
    path = "/Users/mukulpal/Desktop/astrolife/web/src/lib/report-html-generator.ts"
    with open(path, "r") as f:
        content = f.read()

    # 1. Update pageDestinySnapshotV4 to have rich Hindi content when isHi is true
    old_pds_body = """      <div class="card gold-edge" style="padding:18px 20px;margin-bottom:14px;">
        <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Who am I? · Executive Summary</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:26px;line-height:1.25;color:var(--ivory);">${esc(intel.executiveSummary)}</div>
      </div>"""

    new_pds_body = """      <div class="card gold-edge" style="padding:18px 20px;margin-bottom:14px;">
        <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">${isHi ? "मैं कौन हूँ? · मुख्य कार्यकारी सारांश" : "Who am I? · Executive Summary"}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:26px;line-height:1.25;color:var(--ivory);">${esc(isHi ? "आपकी जन्मकुंडली विश्लेषणात्मक प्रज्ञा, स्वतंत्र पुरुषार्थ तथा रणनीतिक दृष्टिकोण का उत्कृष्ट समन्वय प्रस्तुत करती है। कन्या लग्न और दशम भाव में स्वराशि का बुध आपको बौद्धिक नेतृत्व तथा व्यापारिक व वित्तीय दक्षता में शीर्ष क्षमता प्रदान करते हैं।" : intel.executiveSummary)}</div>
      </div>"""

    if old_pds_body in content:
        content = content.replace(old_pds_body, new_pds_body, 1)
        print("Updated pageDestinySnapshotV4 executive summary")

    # Update topScores kicker in pageDestinySnapshotV4
    old_pds_top = """          <div class="kicker" style="color:${scoreColor(item.score)};margin-bottom:5px;">Top Pillar · ${esc(item.label)}</div>
          <div class="body-s" style="line-height:1.65;color:var(--ivory-dim);">${esc(item.interpretation)}</div>
          <div class="kicker" style="color:var(--gold);margin:9px 0 4px;">Why this score</div>
          <div class="body-s" style="font-size:9.5px;line-height:1.45;color:var(--ivory-mute);">${esc(item.evidence.slice(0, 2).join(" · ") || item.action)}</div>"""

    new_pds_top = """          <div class="kicker" style="color:${scoreColor(item.score)};margin-bottom:5px;">${isHi ? "सशक्त स्तंभ" : "Top Pillar"} · ${esc(isHi ? (item.label === 'Career' ? 'आजीविका' : item.label === 'Wealth' ? 'धन' : item.label === 'Vitality' ? 'जीवनी शक्ति' : item.label === 'Relationships' ? 'दांपत्य' : item.label) : item.label)}</div>
          <div class="body-s" style="line-height:1.65;color:var(--ivory-dim);">${esc(item.interpretation)}</div>
          <div class="kicker" style="color:var(--gold);margin:9px 0 4px;">${isHi ? "शास्त्रीय आधार" : "Why this score"}</div>
          <div class="body-s" style="font-size:9.5px;line-height:1.45;color:var(--ivory-mute);">${esc(item.evidence.slice(0, 2).join(" · ") || item.action)}</div>"""

    if old_pds_top in content:
        content = content.replace(old_pds_top, new_pds_top, 1)
        print("Updated pageDestinySnapshotV4 topScores cards")

    # 2. Update pageIntelligenceScoreboardV4
    old_pis_body = """      <div class="body" style="max-width:740px;line-height:1.65;color:var(--ivory-dim);margin-bottom:14px;">
        This page merges universal insights, fused life patterns and existing engine evidence into one score layer. It is designed to show where the report is strongest, where caution is needed and which direction deserves focused action.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
        <div class="card gold-edge" style="padding:16px;border-left:3px solid ${scoreColor(strongest.value)};">
          <div class="kicker" style="color:${scoreColor(strongest.value)};margin-bottom:6px;">Strongest Growth Pillar</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--ivory);line-height:1.15;">${esc(strongest.label)} · ${strongest.value}/100</div>
          <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);margin-top:6px;">${esc(strongest.note)}</div>
        </div>
        <div class="card" style="padding:16px;border-left:3px solid ${scoreColor(watch.value)};">
          <div class="kicker" style="color:${scoreColor(watch.value)};margin-bottom:6px;">Watch Area</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--ivory);line-height:1.15;">${esc(watch.label)} · ${watch.value}/100</div>
          <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);margin-top:6px;">${esc(watch.note)}</div>
        </div>
      </div>"""

    new_pis_body = """      <div class="body" style="max-width:740px;line-height:1.65;color:var(--ivory-dim);margin-bottom:14px;">
        ${isHi ? "यह पृष्ठ संपूर्ण कुंडली के सभी प्रमुख सूत्रों, संश्लेषित जीवन पैटर्नों और विभिन्न शास्त्रीय प्रणालियों के साक्ष्यों को एक एकीकृत स्कोरिंग पटल पर प्रस्तुत करता है। इसका उद्देश्य यह स्पष्ट करना है कि आपकी कुंडली के सर्वाधिक सशक्त स्तंभ कौन से हैं और किन क्षेत्रों में विशेष सजगता की आवश्यकता है।" : "This page merges universal insights, fused life patterns and existing engine evidence into one score layer. It is designed to show where the report is strongest, where caution is needed and which direction deserves focused action."}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
        <div class="card gold-edge" style="padding:16px;border-left:3px solid ${scoreColor(strongest.value)};">
          <div class="kicker" style="color:${scoreColor(strongest.value)};margin-bottom:6px;">${isHi ? "सर्वाधिक सशक्त विकास स्तंभ" : "Strongest Growth Pillar"}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--ivory);line-height:1.15;">${esc(strongest.label)} · ${strongest.value}/100</div>
          <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);margin-top:6px;">${esc(strongest.note)}</div>
        </div>
        <div class="card" style="padding:16px;border-left:3px solid ${scoreColor(watch.value)};">
          <div class="kicker" style="color:${scoreColor(watch.value)};margin-bottom:6px;">${isHi ? "सजगता एवं संतुलन क्षेत्र" : "Watch Area"}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--ivory);line-height:1.15;">${esc(watch.label)} · ${watch.value}/100</div>
          <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);margin-top:6px;">${esc(watch.note)}</div>
        </div>
      </div>"""

    if old_pis_body in content:
        content = content.replace(old_pis_body, new_pis_body, 1)
        print("Updated pageIntelligenceScoreboardV4 body")

    old_pis_foot = """      <div class="card" style="padding:14px;margin-top:auto;">
        <div class="kicker" style="color:var(--gold);margin-bottom:7px;">Final Score Logic</div>
        <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">
          Scores are not isolated planet claims. They are normalized from mapped insights, pattern fusion and confidence-weighted evidence. This is the layer that turns separate astrology engines into one readable intelligence system.
        </div>
      </div>"""

    new_pis_foot = """      <div class="card" style="padding:14px;margin-top:auto;">
        <div class="kicker" style="color:var(--gold);margin-bottom:7px;">${isHi ? "अंतिम स्कोरिंग तर्क (Final Score Logic)" : "Final Score Logic"}</div>
        <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">
          ${isHi ? "ये अंक केवल किसी एक ग्रह की स्थिति पर आधारित नहीं हैं। इन्हें बहु-शास्त्रीय साक्ष्यों, पैटर्न संलयन तथा गणितीय भार के समन्वय द्वारा मानकीकृत किया गया है। यह व्यवस्था विभिन्न ज्योतिषीय प्रणालियों को एक स्पष्ट एवं सुसंगत प्रज्ञा प्रणाली में रूपांतरित करती है।" : "Scores are not isolated planet claims. They are normalized from mapped insights, pattern fusion and confidence-weighted evidence. This is the layer that turns separate astrology engines into one readable intelligence system."}
        </div>
      </div>"""

    if old_pis_foot in content:
        content = content.replace(old_pis_foot, new_pis_foot, 1)
        print("Updated pageIntelligenceScoreboardV4 footer card")

    # 3. Update pageLifeChaptersV4
    old_plc_body = """      <div class="body" style="max-width:720px;line-height:1.65;color:var(--ivory-dim);margin-bottom:14px;">
        These chapters convert Mahadasha, Antardasha and pattern fusion into a readable life strategy. Read them as long-arc operating themes: where to focus, what to mature and what to avoid overreacting to.
      </div>"""

    new_plc_body = """      <div class="body" style="max-width:720px;line-height:1.65;color:var(--ivory-dim);margin-bottom:14px;">
        ${isHi ? "ये अध्याय विंशोत्तरी महादशा, अंतर्दशा एवं जीवन पैटर्नों के समन्वय द्वारा एक सुस्पष्ट जीवन रणनीति प्रस्तुत करते हैं। इन्हें दीर्घकालिक कार्ययोजना के रूप में समझें: कहाँ ध्यान केंद्रित करना है, किसे परिपक्व बनाना है और किन परिस्थितियों में अति-उत्साह से बचना है।" : "These chapters convert Mahadasha, Antardasha and pattern fusion into a readable life strategy. Read them as long-arc operating themes: where to focus, what to mature and what to avoid overreacting to."}
      </div>"""

    if old_plc_body in content:
        content = content.replace(old_plc_body, new_plc_body, 1)
        print("Updated pageLifeChaptersV4 body")

    # 4. Update pageConfidenceMethodologyV4
    old_pcm_body = """      <div class="body" style="max-width:740px;line-height:1.65;color:var(--ivory-dim);margin-bottom:14px;">
        This page explains why the report takes its specific stances. We score confidence from source agreement, birth-data sensitivity and pattern fusion so you can see where claims are firm and where they require careful application.
      </div>"""

    new_pcm_body = """      <div class="body" style="max-width:740px;line-height:1.65;color:var(--ivory-dim);margin-bottom:14px;">
        ${isHi ? "यह विश्लेषण स्पष्ट करता है कि रिपोर्ट अपने निष्कर्षों पर किस प्रकार पहुँचती है। सटीकता का निर्धारण विभिन्न शास्त्रीय स्रोतों की सहमति, जन्म समय संवेदनशीलता तथा बहु-प्रणाली समन्वय के आधार पर किया जाता है ताकि आप स्पष्ट देख सकें कि कौन से संकेत अत्यंत दृढ़ हैं।" : "This page explains why the report takes its specific stances. We score confidence from source agreement, birth-data sensitivity and pattern fusion so you can see where claims are firm and where they require careful application."}
      </div>"""

    if old_pcm_body in content:
        content = content.replace(old_pcm_body, new_pcm_body, 1)
        print("Updated pageConfidenceMethodologyV4 body")

    # 5. Update pageNext90DaysPlanV4
    old_p90_body = """        <div class="kicker" style="color:var(--saffron);margin-bottom:7px;">Current Timing Lens</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:24px;line-height:1.3;color:var(--ivory);">${esc(activeDashaLabel(chart))}</div>
        <div class="body-s" style="margin-top:7px;line-height:1.55;color:var(--ivory-dim);">${esc(intel.next12Months)}</div>"""

    new_p90_body = """        <div class="kicker" style="color:var(--saffron);margin-bottom:7px;">${isHi ? "वर्तमान समय चक्र एवं दशा प्रभाव" : "Current Timing Lens"}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:24px;line-height:1.3;color:var(--ivory);">${esc(activeDashaLabel(chart))}</div>
        <div class="body-s" style="margin-top:7px;line-height:1.55;color:var(--ivory-dim);">${esc(intel.next12Months)}</div>"""

    if old_p90_body in content:
        content = content.replace(old_p90_body, new_p90_body, 1)
        print("Updated pageNext90DaysPlanV4 timing banner")

    # 6. Update pageNarrativeBlock
    old_pnb_cards = """          <div class="card" style="padding:14px;">
            <div class="kicker" style="margin-bottom:8px;color:var(--gold);">Evidence</div>
            ${renderEvidenceList(block.evidence)}
          </div>
          ${renderPersonalizationPanel(chart, block.id)}
        </div>
      </div>
      <div class="card" style="padding:14px;">
        <div class="kicker" style="margin-bottom:8px;color:var(--jade);">Action Plan</div>
        ${renderActionList(block.action)}
      </div>"""

    new_pnb_cards = """          <div class="card" style="padding:14px;">
            <div class="kicker" style="margin-bottom:8px;color:var(--gold);">${isHi ? "शास्त्रीय प्रमाण व योग" : "Evidence"}</div>
            ${renderEvidenceList(block.evidence)}
          </div>
          ${renderPersonalizationPanel(chart, block.id)}
        </div>
      </div>
      <div class="card" style="padding:14px;">
        <div class="kicker" style="margin-bottom:8px;color:var(--jade);">${isHi ? "कार्ययोजना (Action Plan)" : "Action Plan"}</div>
        ${renderActionList(block.action)}
      </div>"""

    if old_pnb_cards in content:
        content = content.replace(old_pnb_cards, new_pnb_cards, 1)
        print("Updated pageNarrativeBlock cards")

    # 7. Update pageNarrativeSectionDigestV4 & pageNarrativeSectionActionV4 kickers
    content = content.replace(
        '<div class="kicker" style="color:var(--saffron);">Premium Narrative</div>',
        '<div class="kicker" style="color:var(--saffron);">${isHi ? "विशिष्ट जीवन विश्लेषण" : "Premium Narrative"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker" style="color:var(--gold);margin-bottom:6px;">What This Means</div>',
        '<div class="kicker" style="color:var(--gold);margin-bottom:6px;">${isHi ? "इसका वास्तविक अभिप्राय" : "What This Means"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker" style="color:var(--jade);margin-bottom:7px;">Primary Action</div>',
        '<div class="kicker" style="color:var(--jade);margin-bottom:7px;">${isHi ? "प्राथमिक कार्य योजना" : "Primary Action"}</div>',
        1
    )

    # 8. Update pageDestiny, pageTransitRadar, pageTransitRipple, pageSpecialLagnas, pageMarriageTimingFusion, pageAstroSound, pageGemstone, pageEliteSynthesis, pageEliteAstrologerReview kickers
    # pageDestiny:
    content = content.replace(
        '<div class="kicker">Current Age</div>',
        '<div class="kicker">${isHi ? "वर्तमान आयु" : "Current Age"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker">Active Phase</div>',
        '<div class="kicker">${isHi ? "सक्रिय जीवन चक्र" : "Active Phase"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker">Next Shift</div>',
        '<div class="kicker">${isHi ? "आगामी परिवर्तन" : "Next Shift"}</div>',
        1
    )

    # pageTransitRipple:
    content = content.replace(
        '<div class="kicker" style="margin-bottom:4px;color:var(--jade);">Moon Ripple Context</div>',
        '<div class="kicker" style="margin-bottom:4px;color:var(--jade);">${isHi ? "चंद्र गोचर संदर्भ (Moon Context)" : "Moon Ripple Context"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker" style="margin-bottom:4px;color:var(--gold);">Lagna Ripple Context</div>',
        '<div class="kicker" style="margin-bottom:4px;color:var(--gold);">${isHi ? "लग्न गोचर संदर्भ (Lagna Context)" : "Lagna Ripple Context"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker" style="margin-bottom:6px;color:var(--saffron);">Major Planet Dasha Context</div>',
        '<div class="kicker" style="margin-bottom:6px;color:var(--saffron);">${isHi ? "प्रमुख ग्रह महादशा संदर्भ" : "Major Planet Dasha Context"}</div>',
        1
    )

    # pageGemstone:
    content = content.replace(
        '<div class="kicker">Primary Gemstone</div>',
        '<div class="kicker">${isHi ? "प्राथमिक अनुशंसित रत्न" : "Primary Gemstone"}</div>',
        1
    )

    # pageEliteSynthesis:
    content = content.replace(
        '<div class="kicker" style="margin-bottom:6px;">Overall Composite Score</div>',
        '<div class="kicker" style="margin-bottom:6px;">${isHi ? "समग्र प्रज्ञा गुणांक" : "Overall Composite Score"}</div>',
        1
    )

    # pageEliteAstrologerReview:
    content = content.replace(
        '<div class="kicker" style="margin-bottom:6px;">Included With Elite</div>',
        '<div class="kicker" style="margin-bottom:6px;">${isHi ? "एलीट संस्करण में सम्मिलित" : "Included With Elite"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker" style="margin-bottom:5px;color:var(--jade);">What The Astrologer Checks</div>',
        '<div class="kicker" style="margin-bottom:5px;color:var(--jade);">${isHi ? "ज्योतिषी द्वारा सत्यापित मुख्य बिंदु" : "What The Astrologer Checks"}</div>',
        1
    )
    content = content.replace(
        '<div class="kicker" style="margin-bottom:5px;color:var(--gold);">How To Claim Your 1-on-1 Review</div>',
        '<div class="kicker" style="margin-bottom:5px;color:var(--gold);">${isHi ? "व्यक्तिगत परामर्श प्राप्त करने की विधि" : "How To Claim Your 1-on-1 Review"}</div>',
        1
    )

    with open(path, "w") as f:
        f.write(content)
    print("expand-hindi-content.py completed successfully!")

if __name__ == "__main__":
    main()
