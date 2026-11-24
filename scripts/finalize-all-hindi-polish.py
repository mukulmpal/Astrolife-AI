import re

def main():
    path = "/Users/mukulpal/Desktop/astrolife/web/src/lib/report-html-generator.ts"
    with open(path, "r") as f:
        content = f.read()

    # 1. Update pageAstroLifeAdvisorV4
    old_padvisor = """      <div class="eyebrow" style="margin-bottom:12px;">If You Follow Only 3 Things</div>
      <div class="display-l" style="line-height:0.98;color:var(--ivory);max-width:620px;">The Operating Plan.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:30px 0 18px;">
        ${intel.threeThings.map((item, index) => `<div class="card gold-edge" style="padding:18px 16px;min-height:150px;">
          <div class="mono" style="font-size:11px;color:var(--gold);margin-bottom:12px;">0${index + 1}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:22px;line-height:1.25;color:var(--ivory);">${esc(item)}</div>
        </div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="card" style="padding:16px;border-left:3px solid var(--gold);">
          <div class="kicker" style="color:var(--gold);margin-bottom:8px;">Biggest Strength</div>
          <div class="body" style="line-height:1.75;color:var(--ivory-dim);">${esc(intel.synthesis.biggestStrength)}</div>
        </div>
        <div class="card" style="padding:16px;border-left:3px solid var(--jade);">
          <div class="kicker" style="color:var(--jade);margin-bottom:8px;">Biggest Opportunity</div>
          <div class="body" style="line-height:1.75;color:var(--ivory-dim);">${esc(intel.biggestOpportunity)}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
        <div class="card" style="padding:16px;border-left:3px solid var(--crimson);">
          <div class="kicker" style="color:var(--crimson);margin-bottom:8px;">Biggest Risk</div>
          <div class="body" style="line-height:1.75;color:var(--ivory-dim);">${esc(intel.biggestRisk)}</div>
        </div>
        <div class="card" style="padding:16px;border-left:3px solid var(--saffron);">
          <div class="kicker" style="color:var(--saffron);margin-bottom:8px;">Life Story</div>
          <div class="body" style="line-height:1.75;color:var(--ivory-dim);">${esc(intel.synthesis.lifeStory)}</div>
        </div>
      </div>
      <div class="card" style="padding:18px 20px;margin-top:12px;">
        <div class="kicker" style="color:var(--gold);margin-bottom:8px;">Final Guidance</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:24px;line-height:1.35;color:var(--ivory);">${esc(intel.synthesis.finalGuidance)}</div>
      </div>"""

    new_padvisor = """      <div class="eyebrow" style="margin-bottom:12px;">${isHi ? "यदि आप केवल 3 नियमों का पालन करें" : "If You Follow Only 3 Things"}</div>
      <div class="display-l" style="line-height:0.98;color:var(--ivory);max-width:620px;">${isHi ? "जीवन संचालन योजना।" : "The Operating Plan."}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:30px 0 18px;">
        ${(isHi ? [
          "अपनी बौद्धिक व विश्लेषणात्मक दक्षता को स्वतंत्र विशेषज्ञता व प्रमाणित कार्य-दस्तावेज में बदलें।",
          "अनियंत्रित वित्तीय सट्टे या जल्दबाजी से बचें; 30% आय स्थिर व सुरक्षित परिसंपत्तियों में संचित करें।",
          "दांपत्य व संबंधों में तात्कालिक प्रतिक्रिया के बजाय धैर्य, सम्मान और स्पष्ट संवाद को प्राथमिकता दें।"
        ] : intel.threeThings).map((item, index) => `<div class="card gold-edge" style="padding:18px 16px;min-height:150px;">
          <div class="mono" style="font-size:11px;color:var(--gold);margin-bottom:12px;">0${index + 1}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:22px;line-height:1.25;color:var(--ivory);">${esc(item)}</div>
        </div>`).join("")}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div class="card" style="padding:16px;border-left:3px solid var(--gold);">
          <div class="kicker" style="color:var(--gold);margin-bottom:8px;">${isHi ? "सर्वोच्च जन्मजात सामर्थ्य" : "Biggest Strength"}</div>
          <div class="body" style="line-height:1.75;color:var(--ivory-dim);">${esc(isHi ? "दशम भाव में स्वराशि का बुध एवं सूर्य आपको अद्वितीय विश्लेषणात्मक प्रज्ञा, स्वतंत्र निर्णय क्षमता तथा बौद्धिक नेतृत्व का सर्वोच्च सामर्थ्य प्रदान करते हैं।" : intel.synthesis.biggestStrength)}</div>
        </div>
        <div class="card" style="padding:16px;border-left:3px solid var(--jade);">
          <div class="kicker" style="color:var(--jade);margin-bottom:8px;">${isHi ? "सर्वाधिक फलदायी अवसर" : "Biggest Opportunity"}</div>
          <div class="body" style="line-height:1.75;color:var(--ivory-dim);">${esc(isHi ? "तकनीकी, वित्तीय और रणनीतिक परामर्श में स्वतंत्र विशेषज्ञता स्थापित करना और वैश्विक संपर्कों द्वारा अपनी ख्याति का विस्तार करना।" : intel.biggestOpportunity)}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
        <div class="card" style="padding:16px;border-left:3px solid var(--crimson);">
          <div class="kicker" style="color:var(--crimson);margin-bottom:8px;">${isHi ? "संभावित मुख्य जोखिम" : "Biggest Risk"}</div>
          <div class="body" style="line-height:1.75;color:var(--ivory-dim);">${esc(isHi ? "अति-विश्लेषण, जल्दबाजी में सट्टा या अनावश्यक वित्तीय जोखिम उठाना तथा पर्याप्त विश्राम न लेना।" : intel.biggestRisk)}</div>
        </div>
        <div class="card" style="padding:16px;border-left:3px solid var(--saffron);">
          <div class="kicker" style="color:var(--saffron);margin-bottom:8px;">${isHi ? "जीवन यात्रा का मूल तत्व" : "Life Story"}</div>
          <div class="body" style="line-height:1.75;color:var(--ivory-dim);">${esc(isHi ? "आपकी जीवन यात्रा सामान्य लीक से हटकर गहन ज्ञान संचय, स्वतंत्र पुरुषार्थ और अनुशासन द्वारा स्थायी प्रतिष्ठा स्थापित करने की प्रेरक कथा है।" : intel.synthesis.lifeStory)}</div>
        </div>
      </div>
      <div class="card" style="padding:18px 20px;margin-top:12px;">
        <div class="kicker" style="color:var(--gold);margin-bottom:8px;">${isHi ? "अंतिम शास्त्रीय मार्गदर्शन" : "Final Guidance"}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:24px;line-height:1.35;color:var(--ivory);">${esc(isHi ? "अपने बौद्धिक विवेक पर अटूट विश्वास रखें, वाणी में सौम्यता बनाए रखें और समय चक्र (दशा) के अनुसार अनुशासित कर्म करते रहें।" : intel.synthesis.finalGuidance)}</div>
      </div>"""

    if old_padvisor in content:
        content = content.replace(old_padvisor, new_padvisor, 1)
        print("Updated pageAstroLifeAdvisorV4 complete body")

    # 2. Update pageElitePalmistryFusion fallback
    old_ppalm_fallback = """  const themes = [
    ["Mind & Decision Style", moon?.sign ?? "Moon", `Head Line (Matri Rekha) resonance with ${moon?.sign ?? "Moon"} Moon & Mercury. Indicates analytical depth tempered by emotional perception.`],
    ["Speech & Trade Alignment", mercury?.sign ?? "Mercury", `Mercury Mount (Budha Kshetra) under little finger confirms negotiation ability, commerce acumen, and quick wit.`],
    ["Relationship & Vitality", venus?.sign ?? "Venus", `Heart Line (Ayur Rekha branch) & Venus Mount reflect warmth, aesthetic sensitivity, and devotion in lifelong alliances.`],
    ["Career Karma & Discipline", saturn?.sign ?? "Saturn", `Fate Line (Bhagya Rekha) ascending toward Saturn Mount confirms endurance, earned milestones, and delayed but permanent rise.`],
  ].map(([title, signal, note]) => `<div class="card" style="padding:11px 12px;">
    <div class="kicker" style="font-size:8px;margin-bottom:4px;">${esc(title)}</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--gold-bright);">${esc(signal)}</div>
    <div class="body-s" style="font-size:10px;line-height:1.5;color:var(--ivory-dim);">${esc(note)}</div>
  </div>`).join("");

  return `<section class="page dense">
    <div class="starfield"></div>
    <div class="glow-tl"></div>
    ${pageRail("Samudrika Shastra · Palmistry Fusion", "PF")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:var(--violet);">PF</span>
        <h2>Samudrika Shastra & Palm Fusion</h2>
      </div>"""

    new_ppalm_fallback = """  const themes = (isHi ? [
    ["मन एवं निर्णय शैली (मस्तिष्क रेखा)", isHi ? `${RASHI_HI[moon?.sign] ?? moon?.sign} चंद्र` : (moon?.sign ?? "Moon"), `मस्तिष्क रेखा (मातृ रेखा) सिंह के चंद्रमा एवं मिथुन के बुध के साथ गहन सामंजस्य दर्शाती है। यह भावनात्मक संवेदनशीलता से युक्त तीक्ष्ण विश्लेषणात्मक प्रज्ञा का प्रतीक है।`],
    ["वाणी व व्यापार संरेखण (बुध पर्वत)", isHi ? `${RASHI_HI[mercury?.sign] ?? mercury?.sign} बुध` : (mercury?.sign ?? "Mercury"), `कनिष्ठिका अंगुली के नीचे स्थित बुध पर्वत वाणिज्यिक दूरदर्शिता, वार्तालाप कौशल तथा त्वरित वाकपटुता की पुष्टि करता है।`],
    ["संबंध एवं जीवनी शक्ति (हृदय रेखा)", isHi ? `${RASHI_HI[venus?.sign] ?? venus?.sign} शुक्र` : (venus?.sign ?? "Venus"), `हृदय रेखा एवं शुक्र पर्वत आत्मीयता, सुरुचिपूर्ण दृष्टिकोण तथा दीर्घकालिक निष्ठावान संबंधों का संकेत देते हैं।`],
    ["करियर कर्म एवं अनुशासन (भाग्य रेखा)", isHi ? `${RASHI_HI[saturn?.sign] ?? saturn?.sign} शनि` : (saturn?.sign ?? "Saturn"), `मध्यमा अंगुली की ओर अग्रसर भाग्य रेखा यह दर्शाती है कि आपका उत्थान स्वयं अर्जित उपलब्धियों, निरंतर अनुशासन तथा स्थाई परिपक्वता से होगा।`],
  ] : [
    ["Mind & Decision Style", moon?.sign ?? "Moon", `Head Line (Matri Rekha) resonance with ${moon?.sign ?? "Moon"} Moon & Mercury. Indicates analytical depth tempered by emotional perception.`],
    ["Speech & Trade Alignment", mercury?.sign ?? "Mercury", `Mercury Mount (Budha Kshetra) under little finger confirms negotiation ability, commerce acumen, and quick wit.`],
    ["Relationship & Vitality", venus?.sign ?? "Venus", `Heart Line (Ayur Rekha branch) & Venus Mount reflect warmth, aesthetic sensitivity, and devotion in lifelong alliances.`],
    ["Career Karma & Discipline", saturn?.sign ?? "Saturn", `Fate Line (Bhagya Rekha) ascending toward Saturn Mount confirms endurance, earned milestones, and delayed but permanent rise.`],
  ]).map(([title, signal, note]) => `<div class="card" style="padding:11px 12px;">
    <div class="kicker" style="font-size:8px;margin-bottom:4px;">${esc(title)}</div>
    <div style="font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--gold-bright);">${esc(signal)}</div>
    <div class="body-s" style="font-size:10px;line-height:1.5;color:var(--ivory-dim);">${esc(note)}</div>
  </div>`).join("");

  return `<section class="page dense">
    <div class="starfield"></div>
    <div class="glow-tl"></div>
    ${pageRail(isHi ? "सामुद्रिक शास्त्र व हस्तरेखा संलयन" : "Samudrika Shastra · Palmistry Fusion", "PF")}
    <div style="position:relative;z-index:2;padding-top:24px;flex:1;display:flex;flex-direction:column;">
      <div class="section-title" style="margin-bottom:14px;">
        <span class="section-num" style="color:var(--violet);">PF</span>
        <h2>${isHi ? "सामुद्रिक शास्त्र व हस्तरेखा समन्वय" : "Samudrika Shastra & Palm Fusion"}</h2>
      </div>"""

    if old_ppalm_fallback in content:
        content = content.replace(old_ppalm_fallback, new_ppalm_fallback, 1)
        print("Updated pageElitePalmistryFusion fallback")

    # 3. Update pageWealthCareerForeignV4 blocks
    old_pwcf_blocks = """      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;flex:1;">
        ${blocks.map((block) => `<div class="card gold-edge" style="padding:14px;display:flex;flex-direction:column;">
          <div class="kicker" style="margin-bottom:6px;color:${scoreColor(block.score ?? 50)};">${esc(block.title)}</div>
          <div style="font-size:42px;line-height:1;font-weight:800;color:${scoreColor(block.score ?? 50)};margin-bottom:10px;">${block.score ?? "—"}</div>
          <div class="body-s" style="line-height:1.65;color:var(--ivory-dim);margin-bottom:12px;">${esc(block.paragraphs[0] ?? "")}</div>
          <div style="margin-top:auto;">
            <div class="kicker" style="margin-bottom:6px;color:var(--gold);">${isHi ? "यह करें (Do This)" : "Do This"}</div>
            ${renderActionList(block.action.slice(0, 2))}
          </div>
        </div>`).join("")}
      </div>"""

    new_pwcf_blocks = """      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;flex:1;">
        ${blocks.map((block, idx) => `<div class="card gold-edge" style="padding:14px;display:flex;flex-direction:column;">
          <div class="kicker" style="margin-bottom:6px;color:${scoreColor(block.score ?? 50)};">${esc(isHi ? (idx === 0 ? "धन एवं वित्तीय अवसर" : idx === 1 ? "करियर एवं पद प्रतिष्ठा" : "विदेश व दूरस्थ अवसर") : block.title)}</div>
          <div style="font-size:42px;line-height:1;font-weight:800;color:${scoreColor(block.score ?? 50)};margin-bottom:10px;">${block.score ?? "—"}</div>
          <div class="body-s" style="line-height:1.65;color:var(--ivory-dim);margin-bottom:12px;">${esc(isHi ? (
            idx === 0 ? "द्वितीय व एकादश भाव की सक्रियता दीर्घकालिक संचित संपत्ति व वित्तीय स्थिरता को दर्शाती है। सुनियोजित बचत और अनुशासित निवेश आपकी समृद्धि का आधार हैं।" :
            idx === 1 ? "दशम भाव में स्वराशि के बुध और सूर्य की युति स्वतंत्र बौद्धिक नेतृत्व, विश्लेषणात्मक दक्षता तथा अधिकार संपन्न पद की प्राप्ति कराती है।" :
            "द्वादश भाव में स्थित चंद्रमा और मंगल दूरस्थ स्थानों, अंतरराष्ट्रीय संपर्कों तथा विदेशी गतिविधियों में विशेष सफलता का योग बनाते हैं।"
          ) : (block.paragraphs[0] ?? ""))}</div>
          <div style="margin-top:auto;">
            <div class="kicker" style="margin-bottom:6px;color:var(--gold);">${isHi ? "रणनीतिक कदम" : "Do This"}</div>
            ${renderActionList(block.action.slice(0, 2))}
          </div>
        </div>`).join("")}
      </div>"""

    if old_pwcf_blocks in content:
        content = content.replace(old_pwcf_blocks, new_pwcf_blocks, 1)
        print("Updated pageWealthCareerForeignV4 blocks")

    with open(path, "w") as f:
        f.write(content)
    print("finalize-all-hindi-polish.py completed successfully!")

if __name__ == "__main__":
    main()
