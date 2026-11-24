import re
import os

target_file = "/Users/mukulpal/Desktop/astrolife/web/src/lib/report-html-generator.ts"

with open(target_file, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add CSS for Khanda Bridge & TOC Sidebar in STYLES_CSS
css_addition = """
/* ── Khanda Bridge & Transition Pages ── */
.khanda-bridge-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Cormorant Garamond', serif;
  font-size: 340px;
  font-weight: 400;
  color: var(--gold);
  opacity: 0.035;
  pointer-events: none;
  z-index: 1;
  user-select: none;
  line-height: 1;
}

.khanda-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  background: rgba(201, 169, 97, 0.1);
  border: 1px solid rgba(201, 169, 97, 0.35);
  border-radius: 999px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px;
  letter-spacing: 0.14em;
  color: var(--gold-bright);
  text-transform: uppercase;
}

.khanda-card {
  position: relative;
  border-radius: 8px;
  padding: 16px 20px;
  background: rgba(17, 22, 46, 0.65);
  backdrop-filter: blur(8px);
}

.khanda-card.recap {
  border-left: 3px solid var(--gold);
  border-top: 1px solid rgba(201, 169, 97, 0.2);
  border-right: 1px solid rgba(201, 169, 97, 0.12);
  border-bottom: 1px solid rgba(201, 169, 97, 0.12);
}

.khanda-card.shloka {
  border: 1px solid rgba(201, 169, 97, 0.25);
  background: linear-gradient(135deg, rgba(201, 169, 97, 0.08) 0%, rgba(14, 20, 40, 0.5) 100%);
  text-align: center;
  padding: 14px 18px;
}

.khanda-card.gateway {
  border-left: 3px solid var(--jade);
  border-top: 1px solid rgba(111, 181, 138, 0.25);
  border-right: 1px solid rgba(111, 181, 138, 0.12);
  border-bottom: 1px solid rgba(111, 181, 138, 0.12);
}

.khanda-card.guidance {
  border: 1px dashed rgba(201, 169, 97, 0.3);
  background: rgba(14, 20, 40, 0.4);
  padding: 12px 18px;
}

/* ── Screen-Only TOC Sidebar ── */
@media screen and (min-width: 1280px) {
  .astrolife-toc-sidebar {
    position: fixed;
    top: 36px;
    left: calc(50% - 640px);
    width: 205px;
    background: rgba(10, 14, 31, 0.94);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(201, 169, 97, 0.28);
    border-radius: 12px;
    padding: 16px 14px;
    z-index: 9990;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65);
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-family: 'Inter', system-ui, sans-serif;
  }
  .toc-sidebar-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-bottom: 1px solid rgba(201, 169, 97, 0.2);
    padding-bottom: 10px;
  }
  .toc-sidebar-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--gold);
    text-transform: uppercase;
  }
  .toc-sidebar-title {
    font-size: 12px;
    color: var(--ivory-mute);
    letter-spacing: 0.04em;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
  }
  .toc-sidebar-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .toc-sidebar-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 6px;
    text-decoration: none;
    color: var(--ivory-dim);
    font-size: 11.5px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }
  .toc-sidebar-link:hover {
    background: rgba(201, 169, 97, 0.12);
    color: var(--gold-bright);
    border-color: rgba(201, 169, 97, 0.3);
  }
  .khanda-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px;
    color: var(--gold);
    font-weight: 600;
    min-width: 16px;
  }
  .khanda-text {
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .toc-sidebar-footer {
    border-top: 1px solid rgba(201, 169, 97, 0.15);
    padding-top: 8px;
    display: flex;
    justify-content: center;
  }
  .toc-sidebar-btn {
    background: none;
    border: none;
    color: var(--gold-dim);
    font-size: 10.5px;
    cursor: pointer;
    letter-spacing: 0.05em;
    padding: 4px 8px;
    border-radius: 4px;
    transition: color 0.2s;
  }
  .toc-sidebar-btn:hover {
    color: var(--gold-bright);
  }
}
@media (max-width: 1279px) {
  .astrolife-toc-sidebar {
    display: none !important;
  }
}
@media print {
  .astrolife-toc-sidebar {
    display: none !important;
  }
}
"""

# Inject CSS right before `const BRAND_MARK_SVG`
if "/* ── Khanda Bridge & Transition Pages ── */" not in content:
    content = content.replace("`;\n\n// ── Shared SVG mark ──", css_addition + "\n`;\n\n// ── Shared SVG mark ──", 1)
    print("Added Khanda CSS to STYLES_CSS")
else:
    print("Khanda CSS already present")

# 2. Add pageKhandaBridge function right before page5BirthSnapshot
bridge_func = """
// ── Khanda Bridge & Synthesis Gateway ──────────────────────────────────────

function pageKhandaBridge(khandaNumber: number, lang: ReportLanguage = "en"): string {
  const isHi = lang === "hi" || lang === "hindi";

  const khandaData: Record<number, {
    roman: string;
    kicker: string;
    title: string;
    subtitle: string;
    recapHeading: string;
    recapBullets: string[];
    shloka: string;
    shlokaMeaning: string;
    gatewayHeading: string;
    gatewayBullets: string[];
    guidance: string;
  }> = {
    1: {
      roman: "I",
      kicker: isHi ? "प्रथम खंड · उद्गम एवं प्रज्ञा" : "KHANDA I · GENESIS & BLUEPRINT",
      title: isHi ? "ब्रह्मांडीय उद्गम एवं कार्यकारी खाका" : "The Cosmic Genesis & Executive Blueprint",
      subtitle: isHi ? "प्रारब्ध सारांश, प्रज्ञा स्कोरबोर्ड एवं 90 दिवसीय कार्ययोजना" : "Destiny Snapshot, Universal Intelligence & 90-Day Action Roadmap",
      recapHeading: isHi ? "इस खंड का केंद्रीय सार" : "Central Essence of Volume I",
      recapBullets: isHi ? [
        "आत्मा का मूल जीवन-उद्देश्य: आपके केंद्रीय कर्मिक धुरी और स्वभावगत प्रेरणा का अनावरण।",
        "सार्वभौमिक प्रज्ञा स्कोरबोर्ड: करियर, संपत्ति, संबंध, स्वास्थ्य एवं आध्यात्मिकता का समग्र गणित।",
        "आगामी 90 दिन: व्यावहारिक निर्णय योजना, गतिशीलता के समय और महत्वपूर्ण सतर्कता क्षेत्र।"
      ] : [
        "Primary Life Purpose: Core karmic orientation, psychological archetypes, and spiritual anchor.",
        "Universal Scoreboard: Fused rating across Career, Wealth, Union, Vitality, and Higher Purpose.",
        "Next 90 Days: Precision decision timeline, momentum windows, and risk management guidelines."
      ],
      shloka: "यथा पिण्डे तथा ब्रह्माण्डे, यथा ब्रह्माण्डे तथा पिण्डे॥",
      shlokaMeaning: isHi ? "जो इस सूक्ष्म पिण्ड (शरीर व आत्मा) में है, वही संपूर्ण ब्रह्माण्ड में है; और जो ब्रह्माण्ड में है, वही हमारे अंतर्मन में स्पंदित है।" : "As is the subtle microcosm within the soul, so is the vast macrocosm in the celestial sphere.",
      gatewayHeading: isHi ? "आगे क्या जानेंगे (प्रवेश द्वार)" : "The Gateway Ahead (Orientation)",
      gatewayBullets: isHi ? [
        "अब हम व्यापक जीवन-अवलोकन से आपकी जन्म कुंडली की मूल ज्यामिति में प्रवेश कर रहे हैं।",
        "आपकी लग्न कुंडली, नवग्रहों की वास्तविक स्थिति और चंद्र नक्षत्र का सटीक वैज्ञानिक मानचित्र।",
        "प्रत्येक ग्रह का स्वतंत्र विश्लेषण—कौन सा ग्रह आपके पक्ष में है और किसे संतुलित करना है।"
      ] : [
        "Transitioning from executive overviews into the core astronomical geometry of your birth.",
        "Your exact natal Lagna chart, planetary dashboard, and birth Nakshatra configuration.",
        "Individual graha analysis revealing how celestial archetypes operate in your lived consciousness."
      ],
      guidance: isHi ? "साधना निर्देश: इस रिपोर्ट को किसी भविष्य के अंत की तरह नहीं, बल्कि आत्म-जागृति के नक्शे की तरह पढ़ें। जो बातें आपके जीवन-अनुभव से मेल खाती हैं, उन पर गहराई से विचार करें।" : "Seeker's Note: Approach this document with contemplative curiosity. Pause at paragraphs that mirror your inner experience—this is a compass for conscious living."
    },
    2: {
      roman: "II",
      kicker: isHi ? "द्वितीय खंड · नवग्रह स्थापत्य" : "KHANDA II · PLANETARY ARCHITECTURE",
      title: isHi ? "नवग्रह स्थापत्य एवं ऊर्जा मैट्रिक्स" : "Planetary Architecture & Energy Matrix",
      subtitle: isHi ? "ग्रह बल, षड्बल, अवस्था एवं नवग्रहों का व्यक्तिगत प्रभाव" : "Graha Dignities, Shadbala Strengths & Navagraha Matrix",
      recapHeading: isHi ? "अब तक हमने क्या जाना (सिंहावलोकन)" : "What We Have Uncovered (Retrospective)",
      recapBullets: isHi ? [
        "कार्यकारी सारांश में आपने अपनी जीवन-दिशा और 90 दिनों की प्राथमिकताओं को देखा।",
        "आपके स्वभाव के मुख्य पैटर्न और विभिन्न जीवन-क्षेत्रों में सफलता के संकेतक स्पष्ट हुए।",
        "समग्र स्कोरबोर्ड ने यह रेखांकित किया कि ब्रह्मांडीय ऊर्जा किन क्षेत्रों में अनुकूल बह रही है।"
      ] : [
        "The executive blueprint established your primary life vector and 90-day momentum.",
        "Dominant psychological patterns and behavioural themes across life domains were clarified.",
        "The multi-engine scoreboard mapped where cosmic grace flows with greatest ease."
      ],
      shloka: "ग्रहाधीनं जगत्सर्वं ग्रहाधीनाः नराधिपाः। कालधीनाश्च ते सर्वे यस्मात् कालः परात्परः॥",
      shlokaMeaning: isHi ? "समस्त संसार ग्रहों के अधीन है, और सभी मनुष्य ग्रहों के प्रभाव में हैं; परंतु वे सभी काल के अधीन हैं, जो सर्वोच्च सत्ता है।" : "All earthly affairs are guided by the planets; yet planets themselves serve Time, the supreme order.",
      gatewayHeading: isHi ? "अब आगे हम क्या जानेंगे (प्रवेश द्वार)" : "The Gateway Ahead (Orientation)",
      gatewayBullets: isHi ? [
        "सूर्य से लेकर केतु तक समस्त 9 ग्रहों का स्वतंत्र, विस्तृत एवं तथ्यपरक विश्लेषण।",
        "षड्बल गणित: कौन सा ग्रह वास्तव में बलवान है और किस ग्रह पर कर्मिक दबाव या संकोच है।",
        "ग्रहों की दृष्टियां, मित्र-शत्रु संबंध और उनकी उच्च, नीच व स्वराशि अवस्थाओं का वास्तविक प्रभाव।"
      ] : [
        "Exhaustive individual analysis of all 9 celestial grahas from Sun to Ketu.",
        "Shadbala strength calculations: distinguishing true planetary power from surface placement.",
        "Planetary aspects, combustion, retrograde states, and exaltation/debilitation dynamics."
      ],
      guidance: isHi ? "साधना निर्देश: नवग्रह केवल बाहरी खगोलीय पिंड नहीं, बल्कि आपके आंतरिक मन-बुद्धि-अहंकार के प्रतीक हैं। प्रत्येक ग्रह को अपने स्वभाव के एक हिस्से के रूप में देखें।" : "Seeker's Note: The nine grahas are living symbols of your own consciousness. Observe each planet as an inner energy rather than an external fate."
    },
    3: {
      roman: "III",
      kicker: isHi ? "तृतीय खंड · द्वादश भाव मंडल" : "KHANDA III · TWELVE SPHERES OF LIFE",
      title: isHi ? "द्वादश भाव मंडल एवं जीवन आयाम" : "The Twelve Spheres of Life",
      subtitle: isHi ? "12 भावों का गहन फलित, स्वास्थ्य, करियर, संपत्ति एवं गुप्त संपदा" : "12 Bhavas, Wealth, Career, Health, Relationships & Life Mandalas",
      recapHeading: isHi ? "अब तक हमने क्या जाना (सिंहावलोकन)" : "What We Have Uncovered (Retrospective)",
      recapBullets: isHi ? [
        "आपने नवग्रहों की शक्ति, अवस्था और उनकी सूक्ष्म प्रकृति को गहराई से समझ लिया है।",
        "यह स्पष्ट हो चुका है कि आपकी कुंडली के मुख्य मार्गदर्शक ग्रह और कर्मिक दबाव बिंदु कौन हैं।",
        "षड्बल विश्लेषण ने आपकी जन्मजात ताकतों और सावधान रहने योग्य क्षेत्रों को उजागर किया है।"
      ] : [
        "You have explored the individual powers, dignities, and psychological traits of the 9 grahas.",
        "The prime yogakaraka and challenging karmic planets in your chart have been pinpointed.",
        "Shadbala metrics revealed your natural strengths and areas requiring mindful stewardship."
      ],
      shloka: "द्वादश भावैः संसूच्यन्ते सर्वेऽपि शुभाशुभाः। तन्वर्थसहजबन्धुपुत्रशत्रुकलत्रकाः॥",
      shlokaMeaning: isHi ? "द्वादश भावों के माध्यम से ही जीवन के समस्त शुभ और अशुभ फल—तन, धन, पराक्रम, सुख, संतान, शत्रु और दांपत्य आदि जाने जाते हैं।" : "Through the twelve houses, every dimension of human existence—vitality, wealth, courage, kinship, mind, struggle, and union—is revealed.",
      gatewayHeading: isHi ? "अब आगे हम क्या जानेंगे (प्रवेश द्वार)" : "The Gateway Ahead (Orientation)",
      gatewayBullets: isHi ? [
        "प्रथम भाव (व्यक्तित्व) से लेकर द्वादश भाव (मोक्ष/व्यय) तक समस्त 12 भावों का स्वतंत्र विश्लेषण।",
        "करियर (D10 स्पैसिफायर), 12वें भाव की गुप्त संपदा और स्वास्थ्य के संवेदनशील समय का परीक्षण।",
        "प्रत्येक सांसारिक क्षेत्र का स्पष्ट, व्यावहारिक और निर्णय-उन्मुख मार्गदर्शन।"
      ] : [
        "Comprehensive house-by-house analysis from House 1 (Self) to House 12 (Transcendence & Distant Lands).",
        "Specialized engines: D10 Career Specifier, 12th House Secret Wealth, and health timing markers.",
        "Clear, action-oriented guidance translating cosmic potentials into concrete life domains."
      ],
      guidance: isHi ? "साधना निर्देश: भाव वह रंगमंच हैं जहां ग्रह अपना नाटक खेलते हैं। देखें कि किन भावों में अधिक ऊर्जा केंद्रित है—वही आपके जीवन के मुख्य संघर्ष और उपलब्धियों के केंद्र हैं।" : "Seeker's Note: Houses are the stages upon which planets act. Notice where planetary energies cluster—these are the pivotal crucibles of your life."
    },
    4: {
      roman: "IV",
      kicker: isHi ? "चतुर्थ खंड · वर्ग कुंडलियाँ व योग" : "KHANDA IV · DIVISIONAL & YOGAS",
      title: isHi ? "वर्ग कुंडलियाँ, योग एवं कर्मिक मैट्रिक्स" : "Divisional Harmonization, Yogas & Karmic Matrix",
      subtitle: isHi ? "नवमांश (D9), दशमांश (D10), राजयोग, धनयोग, दोष एवं अष्टकवर्ग" : "Navamsha D9, Dashamsha D10, Shodashavarga, Classical Yogas & Doshas",
      recapHeading: isHi ? "अब तक हमने क्या जाना (सिंहावलोकन)" : "What We Have Uncovered (Retrospective)",
      recapBullets: isHi ? [
        "आपने 12 भावों के माध्यम से अपने जीवन के सभी भौतिक और सांसारिक आयामों का अवलोकन किया।",
        "धन, करियर, परिवार, स्वास्थ्य और दांपत्य के मूल भावों की स्थिति अब आपके समक्ष स्पष्ट है।",
        "भौतिक जीवन में कौन सा क्षेत्र कितना सक्रिय है, इसका आधार तैयार हो चुका है।"
      ] : [
        "You have completed a panoramic review of all 12 houses governing your worldly existence.",
        "The strength of wealth, career, relationships, and health houses has been clearly documented.",
        "The external stage of your life's material opportunities and challenges is now visible."
      ],
      shloka: "वर्गैर्विना यः कुरुते फलादेशं विमूढधीः। न स जानाति शास्त्राणि केवलं भ्रमकारणम्॥",
      shlokaMeaning: isHi ? "जो बिना सूक्ष्म वर्ग कुंडलियों के फलित का प्रयास करता है, वह भ्रमित होता है; क्योंकि भाग्य का असली रहस्य सूक्ष्म वर्गों में छिपा है।" : "He who judges destiny without the subtle divisional charts is misled; the true soul-promise is encoded in the Vargas.",
      gatewayHeading: isHi ? "अब आगे हम क्या जानेंगे (प्रवेश द्वार)" : "The Gateway Ahead (Orientation)",
      gatewayBullets: isHi ? [
        "नवमांश (D9) एवं षोडशवर्ग: भाग्य की आंतरिक शक्ति, विवाह का सुख और आध्यात्मिक स्तर का सूक्ष्म परीक्षण।",
        "राजयोग, गजकेसरी, धनयोग और पंच महापुरुष योगों की उपस्थिति और उनके फलीभूत होने की क्षमता।",
        "मांगलिक, कालसर्प और पितृदोष जैसे कर्मिक तनाव बिंदुओं का शास्त्रीय व संतुलित विश्लेषण।",
        "अष्टकवर्ग बिंदु मैट्रिक्स: किस भाव में कितनी नैसर्गिक शक्ति और सुरक्षा प्राप्त है।"
      ] : [
        "Navamsha (D9) & Shodashavarga: The inner soul chart verifying marriage, fortune, and spiritual dharma.",
        "Auspicious Yogas: Raja Yogas, Dhana Yogas, and classical empowerments present in your chart.",
        "Karmic Doshas: Objective, fear-free evaluation of Manglik, Kalsarpa, and lineage friction points.",
        "Ashtakavarga Matrix: Bindu-based scoring of house resilience against planetary transits."
      ],
      guidance: isHi ? "साधना निर्देश: वर्ग कुंडलियां स्थूल शरीर के भीतर की सूक्ष्म नाड़ियों के समान हैं। जो लग्न कुंडली में दिखता है, नवमांश यह तय करता है कि वह फलीभूत होगा या नहीं।" : "Seeker's Note: The divisional charts represent the inner subtler layer of destiny. They confirm whether outer natal promises have the enduring strength to materialize."
    },
    5: {
      roman: "V",
      kicker: isHi ? "पंचम खंड · काल चक्र व दशा" : "KHANDA V · DASHA & PREDICTIVE TIMING",
      title: isHi ? "काल चक्र — महादशा, गोचर एवं फलित समय सारिणी" : "The Vectors of Time — Dasha, Transits & Predictive Timing",
      subtitle: isHi ? "विंशोत्तरी दशा, गोचर रडार, केपी पद्धति एवं विवाह व करियर अनुकूल समय" : "Vimshottari Dasha, Transit Radar, KP Timing & Cosmic Weather",
      recapHeading: isHi ? "अब तक हमने क्या जाना (सिंहावलोकन)" : "What We Have Uncovered (Retrospective)",
      recapBullets: isHi ? [
        "आप अपनी कुंडली की आंतरिक क्षमता, योगों के वादे और सूक्ष्म वर्गों की शक्ति को भली-भांति जान चुके हैं।",
        "यह स्पष्ट है कि आपके जीवन का मूल बीज (Potential) कितना शक्तिशाली है।",
        "लेकिन कोई भी बीज उचित ऋतु (समय चक्र) के बिना फल नहीं दे सकता।"
      ] : [
        "You have thoroughly mapped your chart's natal potential, auspicious yogas, and divisional strength.",
        "The cosmic blueprint of what you can accomplish has been authenticated across multiple systems.",
        "Yet even the most promising seed requires the proper season (Time) to take root and bloom."
      ],
      shloka: "कालः सृजति भूतानि कालः संहरते प्रजाः। कालः सुप्तेषु जागर्ति कालो हि दुरतिक्रमः॥",
      shlokaMeaning: isHi ? "काल ही प्राणियों की सृष्टि करता है, काल ही उनका संहार करता है; जब सब सो जाते हैं तब भी काल जागता रहता है। काल अजय है।" : "Time creates all life; Time dissolves all forms. Time stays awake when the world sleeps; Time is insurmountable.",
      gatewayHeading: isHi ? "अब आगे हम क्या जानेंगे (प्रवेश द्वार)" : "The Gateway Ahead (Orientation)",
      gatewayBullets: isHi ? [
        "विंशोत्तरी महादशा, अंतर्दशा एवं प्रत्यंतर्दशा का सटीक समय-चक्र और वर्तमान दशा का प्रभाव।",
        "गोचर रडार (Transit Radar): वर्तमान समय में शनि की साढ़ेसाती/ढैय्या, गुरु का गोचर और राहु-केतु की स्थिति।",
        "केपी (KP) प्रणाली एवं विवाह व करियर अनुकूल समय-खिड़कियां (Timing Windows)।",
        "ट्रेडिंग रिस्क गार्डरेल एवं स्वास्थ्य संवेदनशीलता: कब सतर्क रहना है और कब पहल करनी है।"
      ] : [
        "Vimshottari Dasha chronology: Active Mahadasha/Antardasha narrative and upcoming periods.",
        "Transit Radar & Ripple Engine: Live tracking of Saturn, Jupiter, and Rahu-Ketu across your houses.",
        "KP Stellar Astrology & high-probability timing windows for marriage, career, and financial leaps.",
        "Preemptive risk circuit-breaker: flagging trading hazards and health maintenance windows."
      ],
      guidance: isHi ? "साधना निर्देश: दशा अनुकूल न हो तो धैर्य रखें; दशा अनुकूल हो तो आलस्य त्यागकर पूर्ण प्रयास करें। समय का ज्ञान भय के लिए नहीं, श्रेष्ठ कर्म की तैयारी के लिए है।" : "Seeker's Note: Timing knowledge is not meant to inspire anxiety, but to cultivate discernment. When the cosmic tide recedes, build inner reserves; when it surges, act boldly."
    },
    6: {
      roman: "VI",
      kicker: isHi ? "षष्ठ खंड · महा-उपाय व समन्वय" : "KHANDA VI · REMEDIES & FINAL SYNTHESIS",
      title: isHi ? "कर्मिक शोधन, महा-उपाय एवं अंतिम समन्वय" : "Karmic Neutralization, Master Remedies & Final Synthesis",
      subtitle: isHi ? "लाल किताब, वैदिक उपचार, नाद-स्वर, 12 ज्योतिर्लिंग साधना एवं ज्योतिषी परामर्श" : "Lal Kitab, Vedic Upayas, AstroSound, Jyotirlinga Sanctuary & Astrologer Synthesis",
      recapHeading: isHi ? "अब तक हमने क्या जाना (सिंहावलोकन)" : "What We Have Uncovered (Retrospective)",
      recapBullets: isHi ? [
        "आपने अपने संपूर्ण जीवन के नक्शे, सूक्ष्म शक्तियों और समय-चक्र के सभी उतार-चढ़ावों को विस्तार से समझ लिया है।",
        "आने वाले वर्षों की संभावनाओं और संवेदनशील समय-बिंदुओं की स्पष्ट समझ अब आपके पास है।",
        "ज्ञान की सार्थकता तभी है जब वह कर्म को परिष्कृत करे और जीवन में शांति व समृद्धि लाए।"
      ] : [
        "You have traversed your complete cosmic blueprint, subtle soul matrix, and chronological timeline.",
        "You possess clear foresight regarding favorable opportunity windows and cautionary phases.",
        "Knowledge achieves its highest purpose when channeled into practical remediation and inner harmony."
      ],
      shloka: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। न कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
      shlokaMeaning: isHi ? "तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। कर्म के फल के प्रति आसक्त मत हो, और न ही कर्म न करने में तुम्हारी रुचि हो।" : "Your privilege is to righteous effort alone, never to its fruits. Let not the fruit dictate your action, nor surrender to inertia.",
      gatewayHeading: isHi ? "अब आगे हम क्या जानेंगे (प्रवेश द्वार)" : "The Gateway Ahead (Orientation)",
      gatewayBullets: isHi ? [
        "लाल किताब के अचूक व्यावहारिक उपाय: दैनिक आचरण सुधार, दान-संकल्प और गृह-वास्तु संतुलन।",
        "शास्त्रीय वैदिक उपाय: अभीष्ट मंत्र जप, अनुकूल धातु, दान सामग्री और प्रमाणित रत्न परामर्श।",
        "नाद-स्वर (AstroSound) एवं 12 ज्योतिर्लिंग तीर्थ साधना: ग्रहों की आवृत्ति से आंतरिक सामंजस्य।",
        "एलीट समन्वय एवं वरिष्ठ ज्योतिषी की समीक्षा: समस्त प्रणालियों का अंतिम संश्लेषित मार्गदर्शन।"
      ] : [
        "Lal Kitab practical home corrections, daily behavioural alignment, and targeted remedial items.",
        "Classical Vedic remediation: personalized mantras, charity protocols, metals, and gemstone verification.",
        "AstroSound acoustic healing frequencies and your aligned 12 Jyotirlinga pilgrimage sanctuary.",
        "Elite multi-system synthesis, palmistry fusion integration, and senior astrologer consultation summary."
      ],
      guidance: isHi ? "साधना निर्देश: उपाय कोई जादू नहीं, बल्कि आपके संकल्प और आचरण का शुद्धिकरण हैं। किसी भी उपाय को श्रद्धा, निरंतरता और सात्विक भाव से अपनाएं।" : "Seeker's Note: Vedic remedies are conscious recalibrations of intention and habit. Implement them with patience, humility, and steadfast focus."
    }
  };

  const data = khandaData[khandaNumber] ?? khandaData[1];

  return `<section class="page" id="khanda-${khandaNumber}" style="display:flex;flex-direction:column;justify-content:space-between;padding:56px 64px;">
  <div class="starfield"></div>
  <div class="glow-tl"></div>
  <div class="glow-br"></div>
  <div class="khanda-bridge-watermark">${data.roman}</div>

  ${pageRail(data.kicker, `K${khandaNumber}`)}

  <div style="position:relative;z-index:2;display:flex;flex-direction:column;gap:16px;margin-top:6px;">
    <!-- Title Block -->
    <div>
      <div class="khanda-pill">${data.kicker}</div>
      <div class="display-l" style="color:var(--ivory);margin-top:10px;line-height:1.08;">${esc(data.title)}</div>
      <div class="body" style="color:var(--gold);font-size:13px;margin-top:5px;font-style:italic;">${esc(data.subtitle)}</div>
    </div>

    <!-- 1. Retrospective: What We Have Uncovered -->
    <div class="khanda-card recap">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--gold);"></span>
        <div class="kicker" style="color:var(--gold-bright);font-size:11px;letter-spacing:0.12em;">${esc(data.recapHeading)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${data.recapBullets.map((pt) => `
          <div style="display:flex;align-items:flex-start;gap:10px;font-size:12px;line-height:1.52;color:var(--ivory-dim);">
            <span style="color:var(--gold);font-weight:600;min-width:14px;line-height:1.4;">✓</span>
            <span>${esc(pt)}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- 2. Sacred Bridge: Shloka -->
    <div class="khanda-card shloka">
      <div style="font-family:'Noto Serif Devanagari',serif;font-size:14.5px;color:var(--gold-bright);line-height:1.6;letter-spacing:0.02em;margin-bottom:5px;">
        ${esc(data.shloka)}
      </div>
      <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:12.5px;color:var(--ivory-mute);line-height:1.45;">
        ${esc(data.shlokaMeaning)}
      </div>
    </div>

    <!-- 3. Forward Gateway: What Lies Ahead -->
    <div class="khanda-card gateway">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--jade);"></span>
        <div class="kicker" style="color:var(--jade);font-size:11px;letter-spacing:0.12em;">${esc(data.gatewayHeading)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${data.gatewayBullets.map((pt) => `
          <div style="display:flex;align-items:flex-start;gap:10px;font-size:12px;line-height:1.52;color:var(--ivory-dim);">
            <span style="color:var(--jade);font-weight:600;min-width:14px;line-height:1.4;">→</span>
            <span>${esc(pt)}</span>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- 4. Contemplative Guidance -->
    <div class="khanda-card guidance">
      <div style="font-size:11.5px;line-height:1.52;color:var(--gold-dim);font-style:italic;">
        ${esc(data.guidance)}
      </div>
    </div>
  </div>

  ${pageFoot("astrolife · master report synthesis", `Volume ${data.roman}`)}
</section>`;
}
"""

if "function pageKhandaBridge" not in content:
    target_pos = content.find("function page5BirthSnapshot(")
    if target_pos != -1:
        content = content[:target_pos] + bridge_func + "\n\n" + content[target_pos:]
        print("Inserted pageKhandaBridge before page5BirthSnapshot")
    else:
        print("ERROR: could not find page5BirthSnapshot")
else:
    print("pageKhandaBridge already present")

# 3. Update rawPages in generateReportHTML()
raw_pages_pattern = r"const rawPages = \[\s*safe\(\(\) => coverPage,.*?\n\s*safe\(\(\) => page10Closing\(lang\),\s*\"Closing\"\),\s*\]\.filter\(Boolean\)\.join\(\"\\n\\n\"\);"

new_raw_pages = """  // ── 6 Master Khandas Assembly ──
  const khanda1Pages = [
    safe(() => pageKhandaBridge(1, lang), "Khanda I Bridge"),
    include.destinySnapshotV4 ? safe(() => pageDestinySnapshotV4(chart, reportIntelligence, lang), "Destiny Snapshot V4") : "",
    include.intelligenceScoreboardV4 ? safe(() => pageIntelligenceScoreboardV4(reportIntelligence, lang), "Universal Scoreboard") : "",
    include.lifePatternV4    ? safe(() => pageReportNarrativeSectionV4(reportIntelligence.lifePatternDecoder, "LP", "Life Pattern Decoder", lang), "Life Pattern Decoder") : "",
    include.lifeChaptersV4   ? safe(() => pageLifeChaptersV4(reportIntelligence, lang), "Life Chapters") : "",
    include.confidenceMethodologyV4 ? safe(() => pageConfidenceMethodologyV4(chart, reportIntelligence, lang), "Confidence Methodology") : "",
    include.next90DaysV4     ? safe(() => pageNext90DaysPlanV4(chart, reportIntelligence, lang), "Next 90 Days Action Plan") : "",
    ...narrativeDigestPages,
    include.lifeMissionV4    ? safe(() => pageNarrativeBlock(chart, reportIntelligence.lifeMission, "LM", "Life Mission Engine", lang), "Life Mission") : "",
    include.personalityV4    ? safe(() => pageNarrativeBlock(chart, reportIntelligence.personality, "PD", "Personality Intelligence", lang), "Personality Deep Dive") : "",
    include.karmicV4         ? safe(() => pageNarrativeBlock(chart, reportIntelligence.karmicBlueprint, "KB", "Karmic Blueprint", lang), "Karmic Blueprint") : "",
    include.opportunityV4    ? safe(() => pageWealthCareerForeignV4(chart, reportIntelligence, lang), "Opportunity Blueprint") : "",
    include.relationshipV4   ? safe(() => pageNarrativeBlock(chart, reportIntelligence.relationship, "RI", "Relationship Intelligence", lang), "Relationship Intelligence V4") : "",
    include.eventRemedyV4    ? safe(() => pageEventAndRemedyV4(chart, reportIntelligence, lang), "Event Remedy Strategy") : "",
  ].filter(Boolean);

  const khanda2Pages = [
    safe(() => pageKhandaBridge(2, lang), "Khanda II Bridge"),
    safe(() => page5BirthSnapshot(chart, lang),    "Birth Snapshot"),
    include.starMap    ? safe(() => pageStarMap(chart, "5b"),   "Star Map")        : "",
    safe(() => page6PlanetaryDashboard(chart, lang),"Planetary Dashboard"),
    ...perPlanetPages,
    include.functionalDebilityGuard ? safe(() => pageFunctionalDebilityGuard(chart, "DG", lang), "Functional Debility Guard") : "",
  ].filter(Boolean);

  const khanda3Pages = [
    safe(() => pageKhandaBridge(3, lang), "Khanda III Bridge"),
    ...perHousePages,
    ...lifeAreaPages,
    include.health     ? safe(() => pageHealth(chart, lang),      "Health")          : "",
    include.psychology ? safe(() => pagePsychology(chart, lang), "Psychology") : "",
    include.numerology ? safe(() => pageNumerology(chart, lang),  "Numerology")      : "",
    include.twelfthHouse ? safe(() => pageTwelfthHouseSecretWealth(chart, "12H", lang), "12th House Secret Wealth") : "",
    include.careerD10    ? safe(() => pageCareerSpecifierD10(chart, "D10", lang), "D10 Career Specifier") : "",
  ].filter(Boolean);

  const khanda4Pages = [
    safe(() => pageKhandaBridge(4, lang), "Khanda IV Bridge"),
    include.yogas      ? safe(() => pageYogas(chart, lang),       "Yogas")           : "",
    include.doshas     ? safe(() => pageDoshas(chart, lang),      "Doshas")          : "",
    include.shadbala   ? safe(() => pageShadbala(chart, lang),    "Shadbala")        : "",
    include.ashtakavarga ? safe(() => pageAshtakavarga(chart, "Av", lang), "Ashtakavarga") : "",
    include.divisional ? safe(() => pageDivisional(chart, lang), "Divisional") : "",
    include.destiny    ? safe(() => pageDestiny(chart, lang),     "Destiny")          : "",
    include.jaimini    ? safe(() => pageJaimini(chart, lang),     "Jaimini")          : "",
    include.specialLagnas ? safe(() => pageSpecialLagnas(chart, lang), "Special Lagnas") : "",
    include.sarvatobhadra ? safe(() => pageSarvatobhadra(chart, lang), "Sarvatobhadra") : "",
  ].filter(Boolean);

  const khanda5Pages = [
    safe(() => pageKhandaBridge(5, lang), "Khanda V Bridge"),
    include.dasha      ? safe(() => page7CurrentDasha(chart, lang),  "Current Dasha")  : "",
    include.dasha      ? safe(() => page8UpcomingDashas(chart, lang),"Upcoming Dashas"): "",
    include.antardasha ? safe(() => pageAntardashaDetail(chart, "Ad", lang), "Antardasha") : "",
    include.transitRadar ? safe(() => pageTransitRadar(chart, lang), "Transit Radar") : "",
    include.transitRipple ? safe(() => pageTransitRipple(chart, lang), "Transit Ripple") : "",
    include.kp         ? safe(() => pageKP(chart, lang),          "KP")              : "",
    include.marriageTimingFusion ? safe(() => pageMarriageTimingFusion(chart, lang), "Marriage Timing Fusion") : "",
    include.marriageIntel ? safe(() => pageMarriageIntelligence(chart, lang), "Marriage Intelligence") : "",
    include.relationshipIntel ? safe(() => pageRelationshipIntelligence(chart, lang), "Relationship Intel") : "",
    include.transitHealthTiming ? safe(() => pageTransitHealthTiming(chart, "HT", lang), "Moon Dispositor Health Timing") : "",
    include.tradingRisk ? safe(() => pageTradingRiskCircuitBreaker(chart, "TR", lang), "Trading Risk Guardrail") : "",
  ].filter(Boolean);

  const khanda6Pages = [
    safe(() => pageKhandaBridge(6, lang), "Khanda VI Bridge"),
    include.lalkitab   ? safe(() => pageLalKitabCoreAccuracy(chart, lang), "Lal Kitab Core Accuracy") : "",
    include.lalkitab   ? safe(() => pageLalKitabTimingAndRemedy(chart, lang), "Lal Kitab Timing & Remedy") : "",
    include.lalkitab   ? safe(() => pageLalKitabPlanetDomains(chart, lang), "Lal Kitab Planet Domains") : "",
    include.nakshatra  ? safe(() => pageNakshatra(chart, lang),   "Nakshatra")       : "",
    include.nakshatra  ? safe(() => pageNavtaraAndShield(chart, lang), "Navtara & 27th Shield Star") : "",
    include.remedies   ? safe(() => page9Remedies(chart, lang),   "Remedies")        : "",
    include.vastu      ? safe(() => pageVastu(chart, lang),       "Vastu")           : "",
    include.astroSound ? safe(() => pageAstroSound(chart, lang),  "Astro Sound")     : "",
    include.gemstone   ? safe(() => pageGemstone(chart, lang),    "Gemstone")        : "",
    include.transitShivling ? safe(() => pageTransitShivlingUpacharas(chart, "SU", lang), "Transit Shivling Upacharas") : "",
    include.nakshatraSocial ? safe(() => pageNakshatraSocialRegistry(chart, "NS", lang), "Nakshatra Social Registry") : "",
    include.lineageKarma ? safe(() => pageLineageKarmaKulaDevata(chart, "LK", lang), "Lineage Karma & Kula Devata") : "",
    include.jyotirlingaPilgrimage ? safe(() => pageJyotirlingaPilgrimage(chart, "JP", lang), "12 Jyotirlinga Sanctuary") : "",
    include.palmistryFusion ? safe(() => pageElitePalmistryFusion(chart, options, lang), "Palmistry Fusion") : "",
    include.eliteSynthesis ? safe(() => pageEliteSynthesis(chart, lang), "Elite Synthesis") : "",
    include.astrologerReview ? safe(() => pageEliteAstrologerReview(chart, lang), "Real Astrologer Review") : "",
    include.advisorV4  ? safe(() => pageAstroLifeAdvisorV4(reportIntelligence, lang), "AstroLife Advisor") : "",
    safe(() => page10Closing(lang), "Closing"),
  ].filter(Boolean);

  const rawPages = [
    safe(() => coverPage,          "Cover"),
    safe(() => page2Welcome(lang), "Welcome"),
    safe(() => page3Foreword(lang),"Foreword"),
    safe(() => page4TOC(t, include, lang), "Contents"),
    ...khanda1Pages,
    ...khanda2Pages,
    ...khanda3Pages,
    ...khanda4Pages,
    ...khanda5Pages,
    ...khanda6Pages,
  ].filter(Boolean).join("\\n\\n");"""

if re.search(raw_pages_pattern, content, re.DOTALL):
    content = re.sub(raw_pages_pattern, new_raw_pages, content, count=1, flags=re.DOTALL)
    print("Replaced rawPages with 6 Master Khandas")
else:
    print("WARNING: Could not regex match rawPages, attempting fallback replacement")

# 4. Inject TOC Sidebar in HTML output
sidebar_html = """<nav class="astrolife-toc-sidebar" id="astrolife-toc-sidebar">
  <div class="toc-sidebar-header">
    <div class="toc-sidebar-logo">
      <svg class="brand-mark" viewBox="-12 -12 24 24" style="width:18px;height:18px;"><circle r="10" stroke="var(--gold)" stroke-width="0.8" fill="none"/><polygon points="0,-6 5.2,3 -5.2,3" fill="none" stroke="var(--gold)" stroke-width="0.8"/><polygon points="0,6 5.2,-3 -5.2,-3" fill="none" stroke="var(--gold)" stroke-width="0.8"/><circle r="1.5" fill="var(--gold)"/></svg>
      AstroLife
    </div>
    <div class="toc-sidebar-title">${lang === "hi" ? "मार्गदर्शिका (6 खंड)" : "Master Navigation"}</div>
  </div>
  <ul class="toc-sidebar-list">
    <li><a href="#khanda-1" class="toc-sidebar-link"><span class="khanda-num">I</span><span class="khanda-text">${lang === "hi" ? "उद्गम व प्रज्ञा खाका" : "Genesis & Blueprint"}</span></a></li>
    <li><a href="#khanda-2" class="toc-sidebar-link"><span class="khanda-num">II</span><span class="khanda-text">${lang === "hi" ? "नवग्रह स्थापत्य" : "Planetary Matrix"}</span></a></li>
    <li><a href="#khanda-3" class="toc-sidebar-link"><span class="khanda-num">III</span><span class="khanda-text">${lang === "hi" ? "द्वादश भाव मंडल" : "Twelve Spheres of Life"}</span></a></li>
    <li><a href="#khanda-4" class="toc-sidebar-link"><span class="khanda-num">IV</span><span class="khanda-text">${lang === "hi" ? "वर्ग कुंडलियाँ व योग" : "Divisional & Yogas"}</span></a></li>
    <li><a href="#khanda-5" class="toc-sidebar-link"><span class="khanda-num">V</span><span class="khanda-text">${lang === "hi" ? "काल चक्र व दशा" : "Time & Dasha Radar"}</span></a></li>
    <li><a href="#khanda-6" class="toc-sidebar-link"><span class="khanda-num">VI</span><span class="khanda-text">${lang === "hi" ? "महा-उपाय व समन्वय" : "Remedies & Synthesis"}</span></a></li>
  </ul>
  <div class="toc-sidebar-footer">
    <button onclick="window.scrollTo({top:0,behavior:'smooth'})" class="toc-sidebar-btn">↑ ${lang === "hi" ? "शीर्ष पर जाएं" : "Back to Top"}</button>
  </div>
</nav>

${pages}"""

if '<nav class="astrolife-toc-sidebar"' not in content:
    content = content.replace("</script>\n\n${pages}", "</script>\n\n" + sidebar_html, 1)
    print("Injected astrolife-toc-sidebar navigation")
else:
    print("astrolife-toc-sidebar already present")

with open(target_file, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch complete!")
