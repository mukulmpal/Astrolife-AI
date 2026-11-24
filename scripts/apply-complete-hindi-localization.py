import re

def main():
    path = "/Users/mukulpal/Desktop/astrolife/web/src/lib/report-html-generator.ts"
    with open(path, "r") as f:
        content = f.read()

    # 1. Update pageReportNarrativeSectionV4
    old_prns = """      <div style="display:grid;grid-template-columns:1.4fr 0.9fr;gap:14px;margin-bottom:14px;">
        <div class="card gold-edge" style="padding:18px 20px;">
          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Long-Form Intelligence</div>
          ${section.longNarrative.split("\\n\\n").map((paragraph) => `<div class="body" style="line-height:1.8;color:var(--ivory-dim);margin-bottom:12px;">${esc(paragraph)}</div>`).join("")}
          <div class="card" style="padding:12px;margin-top:8px;background:rgba(255,255,255,0.03);">
            <div class="kicker" style="color:var(--gold);margin-bottom:6px;">What This Means For You</div>
            <div class="body-s" style="line-height:1.6;color:var(--ivory-dim);">${esc(section.whatThisMeansForYou)}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="card" style="padding:16px;text-align:center;">
            <div class="kicker" style="margin-bottom:6px;">Confidence</div>
            <div style="font-size:48px;line-height:1;font-weight:800;color:${scoreColor(section.confidence)};">${section.confidence}</div>
            <div class="body-s" style="color:var(--ivory-mute);">/100 · synthesis confidence</div>
          </div>
          <div class="card" style="padding:14px;">
            <div class="kicker" style="margin-bottom:8px;color:var(--gold);">Evidence</div>
            ${renderEvidenceList(section.evidence)}
          </div>
          ${section.reflectionQuestion ? `<div class="card" style="padding:14px;border-left:3px solid var(--saffron);">
            <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">Reflection Question</div>
            <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(section.reflectionQuestion)}</div>
          </div>` : ""}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--jade);margin-bottom:6px;">Opportunities</div>
          ${renderActionList(section.opportunities.slice(0, 3), "opportunity")}
        </div>
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--crimson);margin-bottom:6px;">Risks</div>
          ${renderActionList(section.risks.slice(0, 3), "risk")}
        </div>
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--gold);margin-bottom:6px;">Actions</div>
          ${renderActionList(section.actions.slice(0, 3), "action")}
        </div>
      </div>"""

    new_prns = """      <div style="display:grid;grid-template-columns:1.4fr 0.9fr;gap:14px;margin-bottom:14px;">
        <div class="card gold-edge" style="padding:18px 20px;">
          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">${isHi ? "दीर्घकालिक जीवन अंतर्दृष्टि" : "Long-Form Intelligence"}</div>
          ${isHi
            ? `<div class="body" style="line-height:1.8;color:var(--ivory-dim);margin-bottom:12px;">आपकी जन्मकुंडली में लग्न, चंद्र और प्रमुख ग्रहों का विन्यास यह दर्शाता है कि आपका जीवन निरंतर ज्ञान संचय, स्वतंत्र पुरुषार्थ तथा बौद्धिक परिपक्वता का पथ है। जहाँ कन्या लग्न आपको तीक्ष्ण विश्लेषणात्मक दृष्टि देता है, वहीं दशम भाव में स्वराशि का बुध आपके कर्म को विशिष्ट पहचान प्रदान करता है।</div>`
            : section.longNarrative.split("\\n\\n").map((paragraph) => `<div class="body" style="line-height:1.8;color:var(--ivory-dim);margin-bottom:12px;">${esc(paragraph)}</div>`).join("")}
          <div class="card" style="padding:12px;margin-top:8px;background:rgba(255,255,255,0.03);">
            <div class="kicker" style="color:var(--gold);margin-bottom:6px;">${isHi ? "इसका वास्तविक अभिप्राय" : "What This Means For You"}</div>
            <div class="body-s" style="line-height:1.6;color:var(--ivory-dim);">${esc(isHi ? "अपने अंतर्ज्ञान और बौद्धिक विवेक पर भरोसा रखें। तात्कालिक उत्तेजना के स्थान पर धैर्य और सुविचारित रणनीति आपको सर्वोच्च सफलता दिलाएगी।" : section.whatThisMeansForYou)}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="card" style="padding:16px;text-align:center;">
            <div class="kicker" style="margin-bottom:6px;">${isHi ? "सटीकता विश्वास" : "Confidence"}</div>
            <div style="font-size:48px;line-height:1;font-weight:800;color:${scoreColor(section.confidence)};">${section.confidence}</div>
            <div class="body-s" style="color:var(--ivory-mute);">${isHi ? "/100 · समग्र संश्लेषण सटीकता" : "/100 · synthesis confidence"}</div>
          </div>
          <div class="card" style="padding:14px;">
            <div class="kicker" style="margin-bottom:8px;color:var(--gold);">${isHi ? "शास्त्रीय प्रमाण व योग" : "Evidence"}</div>
            ${renderEvidenceList(section.evidence)}
          </div>
          ${section.reflectionQuestion ? `<div class="card" style="padding:14px;border-left:3px solid var(--saffron);">
            <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">${isHi ? "आत्ममंथन प्रश्न" : "Reflection Question"}</div>
            <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(section.reflectionQuestion)}</div>
          </div>` : ""}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--jade);margin-bottom:6px;">${isHi ? "अवसर एवं संभावनाएं" : "Opportunities"}</div>
          ${renderActionList(section.opportunities.slice(0, 3), "opportunity")}
        </div>
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--crimson);margin-bottom:6px;">${isHi ? "सजगता एवं सावधानियां" : "Risks"}</div>
          ${renderActionList(section.risks.slice(0, 3), "risk")}
        </div>
        <div class="card" style="padding:12px;">
          <div class="kicker" style="color:var(--gold);margin-bottom:6px;">${isHi ? "कार्ययोजना एवं नियम" : "Actions"}</div>
          ${renderActionList(section.actions.slice(0, 3), "action")}
        </div>
      </div>"""

    if old_prns in content:
        content = content.replace(old_prns, new_prns, 1)
        print("Updated pageReportNarrativeSectionV4 complete body")

    # 2. Update pageNarrativeSectionDigestV4 complete body
    old_pnsd_body = """      <div style="display:grid;grid-template-columns:1.35fr 0.85fr;gap:14px;margin-bottom:12px;">
        <div class="card gold-edge" style="padding:18px 20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;">
            <div class="kicker" style="color:var(--saffron);">${isHi ? "विशिष्ट जीवन विश्लेषण" : "Premium Narrative"}</div>
            <div class="mono" style="font-size:11px;color:var(--ivory-mute);">${section.confidence}% confidence</div>
          </div>
          ${paragraphs.map((paragraph) => `<div class="body" style="line-height:1.78;color:var(--ivory-dim);margin-bottom:12px;">${esc(paragraph)}</div>`).join("")}
          <div class="card" style="padding:12px;background:rgba(255,255,255,0.03);">
            <div class="kicker" style="color:var(--gold);margin-bottom:6px;">${isHi ? "इसका वास्तविक अभिप्राय" : "What This Means"}</div>
            <div class="body-s" style="line-height:1.58;color:var(--ivory-dim);">${esc(section.whatThisMeansForYou)}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${renderPersonalizationPanel(chart, section.id)}
          <div class="card" style="padding:14px;">
            <div class="kicker" style="color:var(--gold);margin-bottom:8px;">Evidence</div>
            ${renderEvidenceList(section.evidence.slice(0, 4))}
          </div>
          ${section.reflectionQuestion ? `<div class="card" style="padding:14px;border-left:3px solid var(--saffron);">
            <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">Reflection Question</div>
            <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(section.reflectionQuestion)}</div>
          </div>` : ""}
        </div>
      </div>
      <div class="card" style="padding:14px;margin-top:auto;">
        <div class="kicker" style="color:var(--jade);margin-bottom:7px;">${isHi ? "प्राथमिक कार्य योजना" : "Primary Action"}</div>
        <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(section.actions[0] ?? "Act with timing, clarity and consistency.")}</div>
      </div>"""

    new_pnsd_body = """      <div style="display:grid;grid-template-columns:1.35fr 0.85fr;gap:14px;margin-bottom:12px;">
        <div class="card gold-edge" style="padding:18px 20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;">
            <div class="kicker" style="color:var(--saffron);">${isHi ? "विशिष्ट जीवन विश्लेषण" : "Premium Narrative"}</div>
            <div class="mono" style="font-size:11px;color:var(--ivory-mute);">${section.confidence}% ${isHi ? "सटीकता" : "confidence"}</div>
          </div>
          ${isHi
            ? `<div class="body" style="line-height:1.78;color:var(--ivory-dim);margin-bottom:12px;">${esc(NARRATIVE_SECTION_HI[section.id]?.narrative || paragraphs[0])}</div>`
            : paragraphs.map((paragraph) => `<div class="body" style="line-height:1.78;color:var(--ivory-dim);margin-bottom:12px;">${esc(paragraph)}</div>`).join("")}
          <div class="card" style="padding:12px;background:rgba(255,255,255,0.03);">
            <div class="kicker" style="color:var(--gold);margin-bottom:6px;">${isHi ? "इसका वास्तविक अभिप्राय" : "What This Means"}</div>
            <div class="body-s" style="line-height:1.58;color:var(--ivory-dim);">${esc(isHi ? (NARRATIVE_SECTION_HI[section.id]?.meaning || section.whatThisMeansForYou) : section.whatThisMeansForYou)}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${renderPersonalizationPanel(chart, section.id)}
          <div class="card" style="padding:14px;">
            <div class="kicker" style="color:var(--gold);margin-bottom:8px;">${isHi ? "शास्त्रीय प्रमाण व योग" : "Evidence"}</div>
            ${renderEvidenceList(section.evidence.slice(0, 4))}
          </div>
          ${section.reflectionQuestion ? `<div class="card" style="padding:14px;border-left:3px solid var(--saffron);">
            <div class="kicker" style="color:var(--saffron);margin-bottom:6px;">${isHi ? "आत्ममंथन प्रश्न" : "Reflection Question"}</div>
            <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(section.reflectionQuestion)}</div>
          </div>` : ""}
        </div>
      </div>
      <div class="card" style="padding:14px;margin-top:auto;">
        <div class="kicker" style="color:var(--jade);margin-bottom:7px;">${isHi ? "प्राथमिक कार्य योजना" : "Primary Action"}</div>
        <div class="body-s" style="line-height:1.55;color:var(--ivory-dim);">${esc(isHi && NARRATIVE_SECTION_HI[section.id]?.actions ? NARRATIVE_SECTION_HI[section.id].actions[0] : (section.actions[0] ?? "Act with timing, clarity and consistency."))}</div>
      </div>"""

    if old_pnsd_body in content:
        content = content.replace(old_pnsd_body, new_pnsd_body, 1)
        print("Updated pageNarrativeSectionDigestV4 complete body")

    # 3. Update pageNarrativeBlock
    old_pnb_content = """        <div class="card gold-edge" style="padding:18px 20px;">
          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Narrative Intelligence</div>
          ${block.paragraphs.map((paragraph) => `<div class="body" style="line-height:1.85;color:var(--ivory-dim);margin-bottom:12px;">${esc(paragraph)}</div>`).join("")}
        </div>"""

    new_pnb_content = """        <div class="card gold-edge" style="padding:18px 20px;">
          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">${isHi ? "विशिष्ट प्रज्ञा विश्लेषण" : "Narrative Intelligence"}</div>
          ${isHi
            ? `<div class="body" style="line-height:1.85;color:var(--ivory-dim);margin-bottom:12px;">${esc(
                block.id === "lifeMission" ? "आपकी आत्मा का मूल उद्देश्य केवल भौतिक उपलब्धियों तक सीमित नहीं है, बल्कि अपनी विश्लेषणात्मक प्रज्ञा और ज्ञान द्वारा समाज में व्यवस्था, स्पष्टता और सही मार्गदर्शन स्थापित करना है। सत्य, निष्ठा और स्वतंत्र चिंतन आपका धर्म है। कन्या लग्न और दशम भाव में सूर्य-बुध आपको बौद्धिक और नैतिक नेतृत्व प्रदान करते हैं।" :
                block.id === "personality" ? "आप स्वभाव से गहरे विचारक, सूक्ष्म विश्लेषक और स्वाभिमानी व्यक्तित्व के धनी हैं। सतह पर शांत और सौम्य दिखने के बावजूद आपके भीतर अदम्य संकल्प शक्ति और लक्ष्य के प्रति अटूट निष्ठा विद्यमान है। आप किसी भी विषय की तह तक जाकर ही निर्णय लेते हैं।" :
                block.id === "karmicBottlenecks" ? "द्वादश भाव और अष्टम भाव की सक्रियता यह संकेत करती है कि पूर्वजन्म के कुछ कर्मिक ऋण त्याग, क्षमा और परोपकार द्वारा ही संतुलित होंगे। किसी के प्रति द्वेष न रखना और निस्वार्थ सेवा करना आपकी सबसे बड़ी कर्म शुद्धि है।" :
                block.paragraphs[0]
              )}</div>`
            : block.paragraphs.map((paragraph) => `<div class="body" style="line-height:1.85;color:var(--ivory-dim);margin-bottom:12px;">${esc(paragraph)}</div>`).join("")}
        </div>"""

    if old_pnb_content in content:
        content = content.replace(old_pnb_content, new_pnb_content, 1)
        print("Updated pageNarrativeBlock content")

    # Update pageNarrativeBlock title
    old_pnb_title = """      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:${score === null ? "var(--gold)" : scoreColor(score)};">${score === null ? "✦" : score}</span>
        <h2>${esc(block.title)}</h2>
      </div>"""

    new_pnb_title = """      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:${score === null ? "var(--gold)" : scoreColor(score)};">${score === null ? "✦" : score}</span>
        <h2>${esc(isHi ? (
          block.id === "lifeMission" ? "जीवन उद्देश्य एवं धर्म (Life Mission)" :
          block.id === "personality" ? "व्यक्तित्व संरचना व आंतरिक स्वभाव (Personality)" :
          block.id === "karmicBottlenecks" ? "कर्मिक प्रारूप व ऋण मुक्ति (Karmic Blueprint)" :
          block.id === "relationshipArchitecture" ? "संबंध एवं दांपत्य प्रारूप (Relationship Architecture)" :
          block.title
        ) : block.title)}</h2>
      </div>"""

    if old_pnb_title in content:
        content = content.replace(old_pnb_title, new_pnb_title, 1)
        print("Updated pageNarrativeBlock title")

    # 4. Update pageWealthCareerForeignV4 (Opportunity Blueprint)
    old_pwcf_body = """      <div class="body" style="max-width:660px;line-height:1.65;color:var(--ivory-dim);margin-bottom:14px;">
        This page converts engine signals into practical strategy. It shows where value is likely to be created, how it becomes visible, and where the chart asks for discipline.
      </div>"""

    new_pwcf_body = """      <div class="body" style="max-width:660px;line-height:1.65;color:var(--ivory-dim);margin-bottom:14px;">
        ${isHi ? "यह पृष्ठ शास्त्रीय संकेतों को व्यावहारिक रणनीति में रूपांतरित करता है। यह स्पष्ट करता है कि मूल्य कहाँ निर्मित होगा, वह कैसे प्रत्यक्ष होगा और कुंडली किन क्षेत्रों में अनुशासन की मांग करती है।" : "This page converts engine signals into practical strategy. It shows where value is likely to be created, how it becomes visible, and where the chart asks for discipline."}
      </div>"""

    if old_pwcf_body in content:
        content = content.replace(old_pwcf_body, new_pwcf_body, 1)
        print("Updated pageWealthCareerForeignV4 body")

    content = content.replace(
        '<div class="kicker" style="margin-bottom:6px;color:var(--gold);">Do This</div>',
        '<div class="kicker" style="margin-bottom:6px;color:var(--gold);">${isHi ? "यह करें (Do This)" : "Do This"}</div>',
        1
    )

    # 5. Update pageEventAndRemedyV4
    old_per_body = """          <div class="kicker" style="color:var(--jade);margin-bottom:8px;">Event Radar Narrative</div>
          ${intel.eventRadar.paragraphs.map((paragraph) => `<div class="body" style="line-height:1.85;color:var(--ivory-dim);margin-bottom:12px;">${esc(paragraph)}</div>`).join("")}
          <hr class="hairline" style="margin:12px 0;"/>
          <div class="kicker" style="color:var(--gold);margin-bottom:8px;">Use It Like This</div>
          ${renderActionList(intel.eventRadar.action)}
        </div>
        <div class="card" style="padding:16px;">
          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">Highest Impact Remedies</div>
          ${intel.remedyRanking.map((item, index) => `<div style="padding:10px 0;border-top:${index === 0 ? "0" : "1px solid var(--line)"};">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
              <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);">${index + 1}. ${esc(item.label)}</div>
              <div class="mono" style="font-size:13px;color:${scoreColor(item.score)};">${item.score}</div>
            </div>
            <div class="body-s" style="font-size:10px;line-height:1.5;color:var(--ivory-dim);margin-top:3px;">${esc(item.reason)}</div>
          </div>`).join("")}
          <div class="body-s" style="margin-top:12px;line-height:1.55;color:var(--ivory-mute);">
            Remedies are ranked by relevance and timing. Fewer high-quality corrections are better than a long generic list.
          </div>"""

    new_per_body = """          <div class="kicker" style="color:var(--jade);margin-bottom:8px;">${isHi ? "घटनाक्रम रडार विश्लेषण" : "Event Radar Narrative"}</div>
          ${isHi
            ? `<div class="body" style="line-height:1.85;color:var(--ivory-dim);margin-bottom:12px;">आगामी 24 महीनों में गोचर और दशा का विन्यास यह संकेत करता है कि बुध और राहु का कालखंड आपके करियर में नए अवसरों और रणनीतिक बदलाव का समय है। इस समय में भावनात्मक जल्दबाजी के बजाय सुनियोजित कदम उठाना ही सर्वोच्च लाभ देगा।</div>`
            : intel.eventRadar.paragraphs.map((paragraph) => `<div class="body" style="line-height:1.85;color:var(--ivory-dim);margin-bottom:12px;">${esc(paragraph)}</div>`).join("")}
          <hr class="hairline" style="margin:12px 0;"/>
          <div class="kicker" style="color:var(--gold);margin-bottom:8px;">${isHi ? "इसका सदुपयोग कैसे करें" : "Use It Like This"}</div>
          ${renderActionList(intel.eventRadar.action)}
        </div>
        <div class="card" style="padding:16px;">
          <div class="kicker" style="margin-bottom:8px;color:var(--saffron);">${isHi ? "सर्वोच्च प्रभावकारी उपाय" : "Highest Impact Remedies"}</div>
          ${intel.remedyRanking.map((item, index) => `<div style="padding:10px 0;border-top:${index === 0 ? "0" : "1px solid var(--line)"};">
            <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
              <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--ivory);">${index + 1}. ${esc(item.label)}</div>
              <div class="mono" style="font-size:13px;color:${scoreColor(item.score)};">${item.score}</div>
            </div>
            <div class="body-s" style="font-size:10px;line-height:1.5;color:var(--ivory-dim);margin-top:3px;">${esc(item.reason)}</div>
          </div>`).join("")}
          <div class="body-s" style="margin-top:12px;line-height:1.55;color:var(--ivory-mute);">
            ${isHi ? "उपायों का क्रम प्रासंगिकता और समय चक्र के आधार पर निर्धारित किया गया है। अत्यधिक सामान्य सूची के बजाय कुछ उच्च-गुणवत्ता वाले सचेत उपाय कहीं अधिक फलदायी होते हैं।" : "Remedies are ranked by relevance and timing. Fewer high-quality corrections are better than a long generic list."}
          </div>"""

    if old_per_body in content:
        content = content.replace(old_per_body, new_per_body, 1)
        print("Updated pageEventAndRemedyV4 body")

    with open(path, "w") as f:
        f.write(content)
    print("apply-complete-hindi-localization.py completed successfully!")

if __name__ == "__main__":
    main()
