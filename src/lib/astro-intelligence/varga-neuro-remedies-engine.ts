// src/lib/astro-intelligence/varga-neuro-remedies-engine.ts
// ============================================================
// ASTROLIFE SHODASHAVARGA NEURO-KARMIC & EPIGENETIC REMEDY ENGINE
// Synthesizes:
// 1. Classical Shastric Foundations (Parashari Shodashavarga & Vedic Adhidevatas)
// 2. Exact D1 Natal-Chart Interconnection (Mathematical & Non-generic)
// 3. Generational Kula-Karma (Ancestral DNA patterns & Epigenetic loops)
// 4. Critical Latent Points: 22nd Drekkana (Kharesh), 64th Navamsha, & Pushkar Navamshas
// 5. Modern Cognitive Behavioral Psychology (Prefrontal cortex & distortion re-wiring)
// 6. Somatic & Circadian Neurobiology (Concrete daily actionable protocols)
// ============================================================

import type { ChartData } from "@/lib/astro-engine/calculations";
import type { DivChart, DivPlanet } from "@/lib/astro-engine/divisional";

export interface VargaDeityArchetype {
  name: string;
  traditionalRole: string;
  leadershipMode: string;
  distortionLabel: string;
  neuroEpigeneticRemedy: string;
  somaticCircadianHabit: string;
}

export interface KarmicLatentPoints {
  kharesh22ndDrekkana?: {
    planet: string;
    sign: string;
    house: number;
    organSystem: string;
    somaticProtocol: string;
  };
  sixtyFourthNavamsha?: {
    planet: string;
    sign: string;
    house: number;
    triggerZone: string;
    cognitiveShield: string;
  };
  pushkarNavamshas?: {
    planet: string;
    sign: string;
    navamshaSign: string;
    blessing: string;
  }[];
}

export interface VargaNeuroKarmicProfile {
  vargaKey: string;
  vargaName: string;
  domainTitle: string;
  vargaLagna: string;
  natalLagnaRelation: string;

  // Adhidevata Archetype
  deityArchetype: VargaDeityArchetype;

  // Critical Micro-Karma Points (22nd Drekkana, 64th Navamsha, Pushkar Navamshas)
  latentPoints?: KarmicLatentPoints;

  // Card 1: D1-Aligned Deep Explanation (Natal Integration)
  deepExplanation: {
    title: string;
    natalAlignmentSummary: string;
    paragraphs: string[];
    keyHighlights: string[];
    primaryHighlight?: string;
  };

  // Card 2: Varga Karmic Weakness & Subconscious Bottleneck
  karmicWeakness: {
    hasAffliction: boolean;
    frictionSummary: string;
    afflictedPlanets: string[];
    psychologicalBottleneckTitle: string;
    psychologicalBottleneckDesc: string;
    ancestralLineagePattern: string; // Kula Karma / Generational DNA imprint
  };

  // Card 3: Scientific & DNA-Based Neuro-Remedy Protocol
  neuroRemedy: {
    ancestralLoopInterruption: string; // Breaking the multi-generational family loop
    cognitiveRewiring: {
      techniqueName: string;
      distortionLabel: string;
      mindsetProtocol: string;
    };
    somaticBehavioralHabit: {
      habitName: string;
      neuroMechanism: string;
      dailyProtocol: string;
    };
    archetypeAlignment?: {
      name: string;
      executiveProtocol: string;
      cognitiveRefocus: string;
    };
  };
}

const md = (x: number, m: number) => ((x % m) + m) % m;

export const SIGN_NAMES_HINDI: Record<string, string> = {
  Aries: "मेष (Aries)",
  Taurus: "वृषभ (Taurus)",
  Gemini: "मिथुन (Gemini)",
  Cancer: "कर्क (Cancer)",
  Leo: "सिंह (Leo)",
  Virgo: "कन्या (Virgo)",
  Libra: "तुला (Libra)",
  Scorpio: "वृश्चिक (Scorpio)",
  Sagittarius: "धनु (Sagittarius)",
  Capricorn: "मकर (Capricorn)",
  Aquarius: "कुंभ (Aquarius)",
  Pisces: "मीन (Pisces)",
};

export const PLANET_NAMES_HINDI: Record<string, string> = {
  Sun: "सूर्य देव",
  Moon: "चंद्र देव",
  Mars: "मंगल देव",
  Mercury: "बुध देव",
  Jupiter: "देवगुरु बृहस्पति",
  Venus: "शुक्र देव",
  Saturn: "शनि देव",
  Rahu: "राहु देव",
  Ketu: "केतु देव",
};

const SIGN_NAMES = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

// ── Varga Domain Metadata with Pure Classical Hindi Alignment ──
const VARGA_DOMAINS: Record<string, { title: string; karakas: string[]; focusArea: string; shastricEssence: string }> = {
  D1:  {
    title: "तनु भाव · शारीरिक तेज, व्यक्तित्व व जीवन शक्ति",
    karakas: ["Sun"],
    focusArea: "शारीरिक ऊर्जा, जीवन शक्ति और आत्म-विश्वास",
    shastricEssence: "समस्त चक्रों का मूल आधार और भौतिक चेतना का केंद्र"
  },
  D2:  {
    title: "होरा चक्र · धन-संपत्ति, संचित साधन व वित्तीय सामर्थ्य",
    karakas: ["Jupiter", "Mercury"],
    focusArea: "तरल पूंजी, संचित संपदा और वित्तीय स्थिरता",
    shastricEssence: "सूर्य व चंद्र की होरा द्वारा संचालित भौतिक समृद्धि व संसाधन"
  },
  D3:  {
    title: "द्रेष्काण चक्र · पराक्रम, भ्रातृ सुख, इच्छाशक्ति व कर्म-उद्यम",
    karakas: ["Mars"],
    focusArea: "साहस, पुरुषार्थ, सहोदर संबंध और कार्य-ऊर्जा",
    shastricEssence: "इच्छाशक्ति और शारीरिक जीवटता का सूक्ष्म दर्पण"
  },
  D4:  {
    title: "चतुर्थांश चक्र · अचल संपत्ति, गृह सुख व मातृ कृपा",
    karakas: ["Moon", "Venus"],
    focusArea: "भूमि, वाहन, स्थायी संपत्ति और मानसिक शांति",
    shastricEssence: "भौतिक सुख-साधन और पारिवारिक शांति का आधार"
  },
  D5:  {
    title: "पंचमांश चक्र · पूर्व-पुण्य, सूक्ष्म बुद्धि व सृजनात्मक प्रज्ञा",
    karakas: ["Jupiter"],
    focusArea: "अतींद्रिय अंतर्ज्ञान, रचनात्मक प्रतिभा और पूर्व-संचित संस्कार",
    shastricEssence: "पूर्व जन्मों से प्राप्त अयाचित ईश्वरीय कृपा व मेधा शक्ति"
  },
  D6:  {
    title: "षष्ठांश चक्र · रोग प्रतिरोधकता, संघर्ष विजय व शत्रु-शमन",
    karakas: ["Mars", "Saturn"],
    focusArea: "शारीरिक रोग-प्रतिरोधक क्षमता, ऋण-मुक्ति और प्रतिस्पर्धी विजय",
    shastricEssence: "संकटों से जूझने का आंतरिक धैर्य और जैविक प्रतिरक्षा"
  },
  D7:  {
    title: "सप्तमांश चक्र · संतति सुख, भावी पीढ़ी व वंश-विस्तार",
    karakas: ["Jupiter"],
    focusArea: "संतान सुख, रचनात्मक उर्वरता और वंश वृद्धि",
    shastricEssence: "पीढ़ियों के मध्य कर्म-प्रवाह और सृजनात्मक दायित्व"
  },
  D8:  {
    title: "अष्टमांश चक्र · अप्रत्याशित रूपांतरण, आयु बल व गूढ़ ज्ञान",
    karakas: ["Saturn", "Mars"],
    focusArea: "आकस्मिक जीवन परिवर्तन, दीर्घायु और गुप्त विद्याएँ",
    shastricEssence: "जीवन के गहन रहस्यों और संकटों को सिद्धि में बदलने की शक्ति"
  },
  D9:  {
    title: "नवांश चक्र · आत्मिक धर्म, दांपत्य जीवन व जीवनसाथी का स्वरूप",
    karakas: ["Venus", "Jupiter"],
    focusArea: "आत्मिक परिपक्वता, दांपत्य सामंजस्य और उत्तरार्ध का भाग्य",
    shastricEssence: "मूल जन्म कुंडली के बीजों को यथार्थ में पकाने वाला महा-चक्र"
  },
  D10: {
    title: "दशमांश चक्र · कर्म की सर्वोच्च प्रतिष्ठा, पद, अधिकार व आजीविका",
    karakas: ["Sun", "Saturn", "Mercury"],
    focusArea: "व्यावसायिक संप्रभुता, सार्वजनिक पहचान और आजीविका की ऊंचाई",
    shastricEssence: "समाज में वास्तविक प्रभाव, अधिकार और कर्म सिद्धि का मापक"
  },
  D11: {
    title: "रुद्रांश चक्र · बहु-आयामी लाभ, महा-समृद्धि व अभिलाषा पूर्ति",
    karakas: ["Jupiter", "Mercury"],
    focusArea: "गैर-रेखीय वित्तीय विस्तार, बड़े अनुबंध और इच्छा-सिद्धि",
    shastricEssence: "आर्थिक बंधनों को तोड़कर व्यापक स्तर पर पूंजी निर्माण"
  },
  D12: {
    title: "द्वादशांश चक्र · पितृ ऋण, कुल परंपरा व पूर्वज कर्म-बीज",
    karakas: ["Sun", "Moon"],
    focusArea: "माता-पिता के आशीर्वाद, कुल-परंपरा और पैतृक संस्कार",
    shastricEssence: "पूर्वज डीएनए और आनुवंशिक ऋणों का सूक्ष्म लेखा-जोखा"
  },
  D16: {
    title: "षोडशांश चक्र · सुख-साधन, वाहन सुख व आंतरिक शांति",
    karakas: ["Venus"],
    focusArea: "भौतिक ऐश्वर्य, वाहन सुख और तंत्रिका तंत्र की शांति",
    shastricEssence: "सांसारिक सुखों के मध्य चित्त की विश्रांति"
  },
  D20: {
    title: "विंशांश चक्र · आध्यात्मिक साधना, उपासना व आत्म-ज्ञान",
    karakas: ["Jupiter", "Sun", "Ketu"],
    focusArea: "मंत्र साधना, ईश्वरानुराग और उच्चतर चेतना का जागरण",
    shastricEssence: "साधना की परिपक्वता और आत्म-साक्षात्कार का मार्ग"
  },
  D24: {
    title: "चतुर्विंशांश चक्र · उच्च विद्या, तकनीकी दक्षता व सूक्ष्म प्रज्ञा",
    karakas: ["Mercury", "Jupiter"],
    focusArea: "गहन अध्ययन, बौद्धिक शिल्प, अनुसंधान और शास्त्र-ज्ञान",
    shastricEssence: "ज्ञान के गहनतम सिद्धांतों का अधिग्रहण व अनुप्रयोग"
  },
  D27: {
    title: "सप्तविंशांश (भंशा) चक्र · अवचेतन मनोबल, जन्मजात सामर्थ्य व सहनशक्ति",
    karakas: ["Moon", "Mars"],
    focusArea: "आंतरिक ऊर्जा संचय, भावनात्मक दृढ़ता और प्रतिकूलता में स्थिरता",
    shastricEssence: "आत्मा के सूक्ष्म २७ नक्षत्र खंडों से मिलने वाली अदृश्य शक्ति"
  },
  D30: {
    title: "त्रिंशांश चक्र · अनिष्ट बाधाएँ, छाया दोष व सुरक्षा कवच",
    karakas: ["Saturn", "Mars"],
    focusArea: "अवचेतन भय, छाया प्रवृत्तियाँ, अनपेक्षित संकट और उनका शमन",
    shastricEssence: "कर्म के नकारात्मक संस्कारों का शुद्धिकरण व सुरक्षा उपाय"
  },
  D40: {
    title: "खवेदांश चक्र · मातृ कुल का शुभाशुभ फल व सूक्ष्म सौभाग्य",
    karakas: ["Moon", "Venus"],
    focusArea: "मातृ पक्ष के सूक्ष्म संस्कार, दैवीय सुरक्षा और प्राकृतिक कृपा",
    shastricEssence: "मातृ परंपरा के माध्यम से संचरित होने वाले सूक्ष्म वरदान"
  },
  D45: {
    title: "अक्षवेदांश चक्र · नैतिक चारित्रिक बल, अंतःकरण की शुद्धता व सदाचार",
    karakas: ["Jupiter", "Sun"],
    focusArea: "नैतिक दृढ़ता, अंतरात्मा की आवाज़ और चारित्रिक निष्ठा",
    shastricEssence: "सत्य और धर्म के प्रति निष्ठा का उच्चतम चारित्रिक दर्पण"
  },
  D60: {
    title: "षष्ट्यंश चक्र · संचित मूल कर्म, प्रारब्ध का सूक्ष्म लेखा व आत्मिक गंतव्य",
    karakas: ["Saturn", "Jupiter"],
    focusArea: "पूर्व जन्मों के संचित मूल कर्म, प्रारब्ध ऋण और जीवन का सर्वोच्च प्रयोजन",
    shastricEssence: "पाराशरी ज्योतिष का अंतिम व सर्वोच्च सत्य — कर्म का अकाट्य विधान"
  },
};

// ── Epigenetic Ancestral Loop Library (Graha-Based) in Pure Devnagari Hindi ──
const ANCESTRAL_PATTERNS: Record<string, { ancestral: string; distortion: string; rewrite: string; somatic: string }> = {
  Sun: {
    ancestral: "पितृ कुल में सत्ता, मान-सम्मान अथवा सामाजिक प्रतिष्ठा के लिए अत्यधिक व्यक्तिगत त्याग रहा है; समाज में यथोचित मान्यता न मिलने पर मन में गहरी टीस संचित रही।",
    distortion: "प्रतिष्ठा संशय (Prestige Imposter Trap) — यह अवचेतन भय कि सर्वोच्च पद या नेतृत्व स्वीकार करने पर लोग आलोचना करेंगे या गिरा देंगे।",
    rewrite: "अपनी शक्ति व अधिकार का उपयोग व्यक्तिगत सत्यापन के लिए नहीं, बल्कि जनकल्याण और उत्तरदायित्व के सात्विक निर्वहन हेतु करें।",
    somatic: "सूर्योदय के ३० मिनट के भीतर १० मिनट की प्राकृतिक धूप में चहलकदमी (नेत्र व तंत्रिका तंत्र की नव-ऊर्जा हेतु)।"
  },
  Moon: {
    ancestral: "मातृ कुल में मौन भावनात्मक पीड़ा, एकांत में अत्यधिक चिंता और परिवार की खातिर अपनी भावनाओं व इच्छाओं को दबाकर जीने का संस्कार।",
    distortion: "अति-सहानुभूति व मानसिक थकान — दूसरों की चिंताओं को स्वयं पर ओढ़ लेना और रात्रि के समय विचारों का अनियंत्रित चक्र चलना।",
    rewrite: "दूसरों की भावनाओं को स्पंज की तरह सोखना बंद करें; करुणा रखें, किंतु स्वस्थ और स्पष्ट मानसिक सीमाओं के साथ।",
    somatic: "शीतल जल का पाद-प्रक्षालन: रात्रि में सोने से पूर्व कलाईयों और पैरों को ६० सेकंड तक ताजे शीतल जल से धोना (जल-तत्व का संतुलन)।"
  },
  Mars: {
    ancestral: "पूर्वज परंपरा में संपत्ति, भूमि विवाद अथवा त्वरित आवेश में आकर निर्णय लेने के कारण हानि उठाने का आक्रामक चक्र।",
    distortion: "आवेशी प्रतिक्रिया — हर छोटी-बड़ी समस्या का समाधान उसी क्षण वाद-विवाद या आक्रामकता से करने की आंतरिक छटपटाहट।",
    rewrite: "अपनी प्रचंड ऊर्जा को शाब्दिक विवादों में व्यर्थ करने के बजाय खेलकूद, तकनीकी शोध अथवा दीर्घकालिक निर्माण में नियोजित करें।",
    somatic: "१० सेकंड का विश्राम प्राणायाम: किसी भी उत्तेजक परिस्थिति में उत्तर देने से पूर्व दो गहरी श्वास लेकर धीरे-धीरे छोड़ें।"
  },
  Mercury: {
    ancestral: "कुल में अपनी बौद्धिक कला व कौशल का उचित पारिश्रमिक न ले पाने का संकोच; मौखिक वचनों पर अत्यधिक विश्वास कर हानि सहना।",
    distortion: "अति-परिपूर्णता का अवरोध (Perfectionist Freeze) — किसी योजना या उत्पाद को तब तक प्रस्तुत न करना जब तक वह शत-प्रतिशत त्रुटिहीन न हो जाए।",
    rewrite: "कर्म की पूर्णता से अधिक उसकी समयबद्ध प्रस्तुति महत्वपूर्ण है। ८०% तैयारी होते ही आरंभ करें और वास्तविक परिणामों से परिष्कार करें।",
    somatic: "विचारों का लिखित अंकन: सोने से पहले अगले दिन के केवल ३ मुख्य अनिवार्य कार्यों को हाथ से डायरी में लिखना।"
  },
  Jupiter: {
    ancestral: "रूढ़िवादिता, पांडित्य-अभिमान अथवा भ्रामक उपदेशकों से पूर्वज स्तर पर प्राप्त संकोच; प्रचुर ज्ञान होने पर भी व्यावहारिक क्रियान्वयन में आलस्य।",
    distortion: "अति-दार्शनिक जड़ता — हर सामान्य कार्य में अंतहीन बौद्धिक तर्क-वितर्क और वास्तविक कदम उठाने से पहले अत्यधिक विश्लेषण।",
    rewrite: "अपने ज्ञान का उपयोग अहम्-तुष्टि के लिए नहीं, बल्कि व्यावहारिक मार्गदर्शन और निस्वार्थ शिक्षा के प्रकाश हेतु करें।",
    somatic: "दैनिक ५ मिनट मौन श्वास-दर्शन: किसी भी स्क्रीन या पुस्तक के बिना शांत बैठकर केवल श्वास के आवागमन का अवलोकन।"
  },
  Venus: {
    ancestral: "संबंधों में अत्यधिक आत्म-त्याग, अपने आत्म-सम्मान को साथी की स्वीकृति से बाँधना अथवा सुख-साधनों के उपभोग में आंतरिक अपराध-बोध।",
    distortion: "काल्पनिक आदर्शवाद व मौन क्षोभ — साथी से अनकही अपेक्षाएँ रखना और उनके पूरा न होने पर मन ही मन दूर हो जाना।",
    rewrite: "रिश्तों में पूर्ण पारदर्शी व स्पष्ट संवाद स्थापित करें; अपराध-बोध से मुक्त होकर अपनी सीमाओं का सम्मान करें।",
    somatic: "इंद्रिय-शांति अनुष्ठान: सायंकाल चंदन अथवा गुलाब की प्राकृतिक सुगंध का प्रयोग या नंगे पाँव हरी दूब पर चलना।"
  },
  Saturn: {
    ancestral: "कर्तव्य-भार का भारी बोझ, परिवार का सारा दायित्व अकेले अपने कंधों पर ढोने का संस्कार अथवा विश्राम करने पर अपराध-बोध होना।",
    distortion: "एकाकी भारवाही ग्रंथि — यह मानना कि यदि मैं दिन-रात थककर काम नहीं करूँगा तो सब कुछ बिखर जाएगा।",
    rewrite: "धैर्य और व्यवस्था पर विश्वास रखें; सारा काम स्वयं करने के बजाय स्वस्थ रूप से दायित्वों का विभाजन करना सीखें।",
    somatic: "मेरुदंड खिंचाव व विश्राम: कार्यस्थल पर प्रत्येक ९० मिनट के पश्चात २ मिनट तक रीढ़ की हड्डी को सीधा खींचकर गहरी श्वास लें।"
  },
  Rahu: {
    ancestral: "पूर्वजों में अचानक स्थान-परिवर्तन, अपरंपरागत मार्ग चुनने पर सामाजिक बहिष्कार का भय अथवा अप्रत्याशित वित्तीय अस्थिरता।",
    distortion: "तीव्र अधीरता व तात्कालिक सफलता का लोभ — रातों-रात आगे बढ़ने की हड़बड़ाहट में अनावश्यक जोखिम उठाना।",
    rewrite: "राहु की क्रांतिकारी ऊर्जा को अत्याधुनिक तकनीक, सॉफ्टवेयर और सुविचारित जोखिम में लगाएँ, न कि सट्टेबाजी अथवा लोभ में।",
    somatic: "डिजिटल सूर्यास्त: रात्रि १०:३० बजे के पश्चात सभी नीली स्क्रीनों को बंद करना और भोजन के समय किसी व्यापारिक चर्चा से बचना।"
  },
  Ketu: {
    ancestral: "सांसारिक विरक्ति, दुनिया या परिवार से अचानक अलगाव में चले जाना अथवा अपनी पैतृक संपदा से अनजाने में विमुख हो जाना।",
    distortion: "उदासीन शून्यवाद — 'कुछ भी करने का क्या लाभ, सब व्यर्थ है' सोचकर सक्रिय पुरुषार्थ और सृजन से पीछे हट जाना।",
    rewrite: "केतु की अंतर्मुखी प्रज्ञा को गहन एकाग्रता, शोध, दर्शन और विशेष तकनीकी वास्तुकला में रूपाकार दें।",
    somatic: "भूमि स्पर्श: दैनिक १० मिनट नंगे पाँव प्राकृतिक मिट्टी अथवा घास पर चलकर पृथ्वी-तत्व से जुड़ना।"
  }
};

// ── 22nd Drekkana (Kharesh) Organ System Vulnerability ───────────
const KHARESH_ORGAN_MAP: Record<string, { organ: string; somaticProtocol: string }> = {
  Sun: {
    organ: "हृदय-संचार तंत्र, नेत्र ज्योति, मेरुदंडीय अस्थि संरचना एवं कोशिकीय ऊर्जा उत्पादन",
    somaticProtocol: "प्रातः सूर्योदय की प्राकृतिक धूप का नियमित सेवन, एरोबिक व्यायाम एवं मैग्नीशियम युक्त आहार।"
  },
  Moon: {
    organ: "तरल-इलेक्ट्रोलाइट संतुलन, लसीका तंत्र, आमाशय श्लेष्मा एवं मनो-हार्मोनल चक्र",
    somaticProtocol: "रात्रि में शीतल जल का पाद-प्रक्षालन, पाचन चक्र के अनुसार भोजन का निश्चित समय एवं पर्याप्त जलयोजन।"
  },
  Mars: {
    organ: "तीव्र सूजन संबंधी प्रवृत्तियाँ, मांसपेशियों में खिंचाव, कपाल तनाव एवं पित्त चयापचय",
    somaticProtocol: "एंटी-इंफ्लेमेटरी आहार, क्रोध के समय १० सेकंड का गहरा श्वास विराम एवं तैराकी या साइकलिंग।"
  },
  Mercury: {
    organ: "स्वायत्त तंत्रिका तंत्र की संवेदनशीलता, वाणी केंद्र, त्वचा की संवेदनशीलता एवं आंत-मस्तिष्क अक्ष (Gut-Brain Axis)",
    somaticProtocol: "सूर्यास्त के पश्चात डिजिटल स्क्रीनों से दूरी, ४-७-८ अनुलोम-विलोम प्राणायाम एवं एक समय में एक ही कार्य।"
  },
  Jupiter: {
    organ: "यकृत वसा चयापचय, धमनी लचीलापन, अग्न्याशय इंसुलिन संतुलन एवं दीर्घकालिक सूजन",
    somaticProtocol: "रात्रि के समय १४ घंटे का हल्का उपवास, भोजन के पश्चात १० मिनट की मंद गति चहलकदमी एवं शर्करा नियंत्रण।"
  },
  Venus: {
    organ: "वृक्क (गुर्दे) की कार्यप्रणाली, हार्मोनल संतुलन, अंतःस्रावी ग्रंथियाँ एवं ग्लूकोज चयापचय",
    somaticProtocol: "संतुलित आहार, प्राकृतिक हिमालयन लवण युक्त शुद्ध जल एवं पेल्विक मोबिलिटी व्यायाम।"
  },
  Saturn: {
    organ: "अस्थि खनिज घनत्व, संधियों (जोड़ों) का स्वास्थ्य, दांत एवं आंत्र निष्कासन प्रणाली",
    somaticProtocol: "भार-वहन शक्ति व्यायाम, गुनगुने तिल के तेल से मेरुदंड मालिश एवं घुलनशील फाइबर युक्त आहार।"
  },
  Rahu: {
    organ: "मनोदैहिक अति-संवेदनशीलता, एलर्जी प्रवृत्तियाँ, निद्रा चक्र में व्यवधान एवं विषाक्तता संचय",
    somaticProtocol: "विद्युत-चुंबकीय विकिरण मुक्त शयन कक्ष, नंगे पाँव भूमि-स्पर्श (१५ मिनट प्रतिदिन) एवं दोपहर पश्चात कैफीन से दूरी।"
  },
  Ketu: {
    organ: "तंत्रिका संबंधी अज्ञात दुर्बलता, त्रिक/मेरुदंड अकड़न एवं ऊर्जा का अचानक ह्रास",
    somaticProtocol: "सूर्य नमस्कार, मायोफेशियल स्ट्रेचिंग एवं श्वास व गति का सचेत समन्वय।"
  }
};

// ── D10 Digpalas (Ruling Deities of Dasamsha) in Rich Devnagari ──
const DIGPALAS_ODD = [
  {
    name: "इंद्र (Indra)",
    role: "पूर्व दिशा · संप्रभु शासन, विज़न व संगठनात्मक नेतृत्व",
    mode: "रणनीतिक नीति-निर्माण एवं स्वायत्त प्रशासनिक अधिकार",
    distortion: "प्रतिष्ठा संशय (Prestige Imposter Trap) — सर्वोच्च पद प्राप्त करने पर समाज या सहयोगियों के पतन का आंतरिक भय।",
    remedy: "व्यक्तिगत प्रमाणीकरण के बजाय सुदृढ़ प्रणाली और अधिकारों के विभाजन (Delegation) द्वारा नेतृत्व करें।",
    somatic: "प्रातःकाल सूर्योदय के समय क्षितिज की ओर दृष्टि प्रसार (नेत्र व तंत्रिका तंत्र का संरेखण)।"
  },
  {
    name: "अग्नि (Agni)",
    role: "दक्षिण-पूर्व (आग्नेय) · तीव्र रूपांतरण, पुरुषार्थ व अग्नि-तत्व",
    mode: "त्वरित निर्णय-प्रक्रिया, नवाचार एवं विघटनकारी तकनीकी क्षमता",
    distortion: "अति-सक्रियता व बर्नआउट (Urgent Reactor Burnout) — प्रत्येक समस्या से उसी क्षण भिड़ जाने की आंतरिक छटपटाहट।",
    remedy: "अपनी प्रचंड अग्नि को व्यक्तिगत विवादों में व्यर्थ करने के बजाय उच्च-प्रभावी तकनीकी व बौद्धिक निर्माण में रूपांतरित करें।",
    somatic: "कार्यस्थल पर तनाव बढ़ने पर दोहरी गहरी श्वास लेकर धीरे-धीरे मुख से छोड़ना (Physiological Sigh)।"
  },
  {
    name: "यम (Yama)",
    role: "दक्षिण दिशा · धर्म, कानून, उत्तरदायित्व व निष्पक्ष न्याय",
    mode: "संस्थागत अनुशासन, कठोर गुणवत्ता नियंत्रण एवं सत्यनिष्ठा",
    distortion: "दंडकारी पूर्णतावाद (Punitive Perfectionism) — अत्यधिक आत्म-आलोचना के कारण योजनाओं को अटकाए रखना।",
    remedy: "कार्य पूर्णता के वस्तुनिष्ठ मानदंड तय करें; पुनरावृत्ति (Iterative Progress) के माध्यम से विस्तार स्वीकारें।",
    somatic: "कंप्यूटर पर काम के प्रत्येक ९० मिनट बाद मेरुदंड को सीधा कर विश्राम मुद्रा अपनाना।"
  },
  {
    name: "निर्रिति (Nirriti)",
    role: "दक्षिण-पश्चिम (नैऋत्य) · अपरंपरागत मार्ग, गहन शोध व गुप्त भेद",
    mode: "गहन अनुसंधान, अप्रत्याशित रणनीतियाँ एवं स्वतंत्र तकनीक",
    distortion: "एकाकी अलगाव (Outsider Alienation) — यह महसूस करना कि पारंपरिक जगत मेरे अद्वितीय विचारों को नहीं समझ सकता।",
    remedy: "अपनी लीक से हटकर सोचने की क्षमता को विशिष्ट, स्वामित्व-युक्त बौद्धिक संपदा में बदलें।",
    somatic: "मानसिक स्थिरता हेतु शीतल जल से मुख प्रक्षालन व vagal nerve शांति क्रिया।"
  },
  {
    name: "वरुण (Varuna)",
    role: "पश्चिम दिशा · तरल वाणिज्य, वैश्विक साझेदारी व संबंध",
    mode: "बाज़ार की नब्ज पहचानना, वैश्विक विस्तार व व्यापक प्रभाव",
    distortion: "व्यावसायिक बिखराव (Commercial Over-Porosity) — हर नए अवसर और प्रस्ताव को बिना सोचे 'हाँ' कह देना।",
    remedy: "किसी भी व्यावसायिक अनुबंध में प्रतिबद्ध होने से पूर्व सख्त मूल्यांकन और प्राथमिकताओं का पालन करें।",
    somatic: "नियमित जलपान का नियम और बैठकों के मध्य ५ मिनट का पूर्ण मौन अंतराल।"
  },
  {
    name: "वायु (Vayu)",
    role: "उत्तर-पश्चिम (वायव्य) · गति, नेटवर्क, संवाद व वितरण",
    mode: "सूचना तंत्र, त्वरित प्रसार एवं स्केलेबल प्रणालियों का संचालन",
    distortion: "मानसिक भटकाव (Cognitive Dispersion) — एक साथ दस कार्य आरंभ करना और किसी को भी पूर्ण न करना।",
    remedy: "एक समय में केवल एक मुख्य लक्ष्य पर अडिग रहें; सृजनात्मक कार्य के समय सभी विकर्षणों को बंद रखें।",
    somatic: "नंगे पाँव भूमि-स्पर्श और ४५ मिनट के एकाग्र कार्य-खंड (Deep Work Blocks)।"
  },
  {
    name: "कुबेर (Kubera)",
    role: "उत्तर दिशा · राजकोष, संचित संपदा व वित्तीय चक्रवृद्धि",
    mode: "परिसंपत्ति निर्माण, पूंजी प्रबंधन एवं मूल्य संरक्षण",
    distortion: "अभाव का अवचेतन भय (Scarcity Anxiety) — प्रचुर आय होने के बावजूद संपदा समाप्त होने की आंतरिक चिंता।",
    remedy: "दीर्घकालिक चक्रवृद्धि दृष्टिकोण अपनाएँ; दैनिक संचालन पूंजी को दीर्घकालिक निवेश से अलग रखें।",
    somatic: "प्रातः वित्तीय समीक्षा से पूर्व ५ गहरी उदर-श्वास और कृतज्ञता का मानसिक स्मरण।"
  },
  {
    name: "ईशान (Ishana)",
    role: "उत्तर-पूर्व (ईशान) · ईश्वरीय प्रज्ञा, परामर्श व दूरदर्शिता",
    mode: "रणनीतिक परामर्श, ज्ञान का प्रसार एवं मार्गदर्शन",
    distortion: "व्यावहारिक उदासीनता (Ivory-Tower Detachment) — सांसारिक आजीविका और व्यावहारिक क्रियान्वयन से विरक्त होना।",
    remedy: "अपने गहन ज्ञान व दूरदर्शिता को व्यावहारिक, लोक-कल्याणकारी और वित्तीय रूप से सक्षम प्रणालियों में बदलें।",
    somatic: "प्रातः किसी भी डिजिटल स्क्रीन को देखने से पूर्व शांत स्थान पर ५ मिनट का ध्यान।"
  },
  {
    name: "ब्रह्मा (Brahma)",
    role: "ऊर्ध्व (आकाश) · शून्य से सृष्टि, मूल वास्तुकला व नवाचार",
    mode: "मौलिक उत्पाद निर्माण, नई दिशाएँ तय करना व आविष्कार",
    distortion: "प्रारूप परित्याग चक्र (Prototype Abandonment) — पूर्णता की तलाश में तैयार कार्यों को समय पर सार्वजनिक न करना।",
    remedy: "पहले संस्करण को बाज़ार में प्रस्तुत करें; वास्तविक प्रतिपुष्टि के आधार पर निरंतर सुधार करें।",
    somatic: "किसी भी जटिल संरचना की कोडिंग से पूर्व हाथ से कागज़ पर उसका खाका खींचना।"
  },
  {
    name: "अनंत (Ananta)",
    role: "अधो (पाताल) · अगाध आधार, धैर्य, संस्थागत स्थिरता व सहनशक्ति",
    mode: "अडिग बुनियादी ढाँचा, दीर्घकालिक स्थायित्व एवं अटूट निष्ठा",
    distortion: "रूढ़िवादिता का संकोच (Legacy Slogger Trap) — पुरानी हो चुकी विधियों से केवल आदतवश चिपके रहना।",
    remedy: "बुनियादी ढाँचे का नियमित आधुनिकीकरण करें; पुनरावृत्ति वाले कार्यों को स्वचालित (Automate) करें।",
    somatic: "गहरी निद्रा हेतु सायंकाल मांसपेशियों का क्रमिक विश्राम (Progressive Relaxation)।"
  }
];

// ── Critical Karmic Latent Points Detector ──────────────────────
export function detectKarmicLatentPoints(
  natalChart: ChartData,
  d3: DivChart | undefined,
  d9: DivChart | undefined
): KarmicLatentPoints {
  const result: KarmicLatentPoints = {};

  // 1. 22nd Drekkana (Kharesh) in D3
  if (d3) {
    const d3LagnaSignNum = d3.lagnaNum;
    const khareshSignNum = md(d3LagnaSignNum + 7, 12); // 8th house in D3
    const khareshLord = SIGN_LORDS[khareshSignNum];
    const organInfo = KHARESH_ORGAN_MAP[khareshLord] || KHARESH_ORGAN_MAP["Saturn"];

    result.kharesh22ndDrekkana = {
      planet: khareshLord,
      sign: SIGN_NAMES[khareshSignNum],
      house: 8,
      organSystem: organInfo.organ,
      somaticProtocol: organInfo.somaticProtocol
    };
  }

  // 2. 64th Navamsha in D9
  if (d9) {
    const moonInD9 = d9.planets.find(p => p.planet === "Moon");
    if (moonInD9) {
      const sixtyFourthSignNum = md(moonInD9.signNum + 3, 12); // 4th from Moon in D9
      const sixtyFourthLord = SIGN_LORDS[sixtyFourthSignNum];

      result.sixtyFourthNavamsha = {
        planet: sixtyFourthLord,
        sign: SIGN_NAMES[sixtyFourthSignNum],
        house: 4,
        triggerZone: `चंद्र नवांश से चतुर्थ भाव (${SIGN_NAMES_HINDI[SIGN_NAMES[sixtyFourthSignNum]] || SIGN_NAMES[sixtyFourthSignNum]}, स्वामी: ${PLANET_NAMES_HINDI[sixtyFourthLord] || sixtyFourthLord})`,
        cognitiveShield: `जब भी गोचर के क्रूर ग्रह ${SIGN_NAMES_HINDI[SIGN_NAMES[sixtyFourthSignNum]] || SIGN_NAMES[sixtyFourthSignNum]} राशि को पार करें, तब '७२-घंटे का निर्णय नियम' अपनाएँ — किसी भी आवेशपूर्ण अनुबंध, वाद-विवाद या वित्तीय जल्दबाजी से बचें जब तक कि मनोभाव शांत न हो जाएँ।`
      };
    }
  }

  // 3. Pushkar Navamshas (The 24 Regenerative Nectar Degrees)
  if (natalChart.planets) {
    const pushkars: { planet: string; sign: string; navamshaSign: string; blessing: string }[] = [];
    const planetList: { planet: string; sign: string; lon: number }[] = Array.isArray(natalChart.planets)
      ? (natalChart.planets as any[])
      : Object.entries(natalChart.planets).map(([k, v]) => ({
          planet: (v as any).planet || k,
          sign: (v as any).sign || "",
          lon: (v as any).lon ?? 0,
        }));

    planetList.forEach(p => {
      const degInSign = md(p.lon, 30);
      const signIdx = Math.floor(md(p.lon, 360) / 30);
      const signType = signIdx % 4; // 0: Fire, 1: Earth, 2: Air, 3: Water

      let isPushkar = false;
      let pNavSign = "";

      if (signType === 0) {
        // Fire signs: 7th (20°-23°20' Libra) & 9th (26°40'-30° Sag)
        if (degInSign >= 20.0 && degInSign < 23.3333) {
          isPushkar = true;
          pNavSign = "तुला (Libra · शुक्र)";
        } else if (degInSign >= 26.6667 && degInSign <= 30.0) {
          isPushkar = true;
          pNavSign = "धनु (Sagittarius · गुरु)";
        }
      } else if (signType === 1) {
        // Earth signs: 3rd (6°40'-10° Pisces) & 5th (13°20'-16°40' Taurus)
        if (degInSign >= 6.6667 && degInSign < 10.0) {
          isPushkar = true;
          pNavSign = "मीन (Pisces · गुरु)";
        } else if (degInSign >= 13.3333 && degInSign < 16.6667) {
          isPushkar = true;
          pNavSign = "वृषभ (Taurus · शुक्र)";
        }
      } else if (signType === 2) {
        // Air signs: 6th (16°40'-20° Pisces) & 8th (23°20'-26°40' Taurus)
        if (degInSign >= 16.6667 && degInSign < 20.0) {
          isPushkar = true;
          pNavSign = "मीन (Pisces · गुरु)";
        } else if (degInSign >= 23.3333 && degInSign < 26.6667) {
          isPushkar = true;
          pNavSign = "वृषभ (Taurus · शुक्र)";
        }
      } else if (signType === 3) {
        // Water signs: 1st (0°-3°20' Cancer) & 3rd (6°40'-10° Virgo)
        if (degInSign >= 0.0 && degInSign < 3.3333) {
          isPushkar = true;
          pNavSign = "कर्क (Cancer · चंद्र)";
        } else if (degInSign >= 6.6667 && degInSign < 10.0) {
          isPushkar = true;
          pNavSign = "कन्या (Virgo · बुध)";
        }
      }

      if (isPushkar) {
        pushkars.push({
          planet: p.planet,
          sign: p.sign,
          navamshaSign: pNavSign,
          blessing: `${PLANET_NAMES_HINDI[p.planet] || p.planet} पुष्कर नवांश (${pNavSign}) में स्थित होकर असाधारण आत्म-कायाकल्प, संकट-मुक्ति और अनपेक्षित सफलता का वरदान प्रदान करते हैं।`
        });
      }
    });

    if (pushkars.length > 0) {
      result.pushkarNavamshas = pushkars;
    }
  }

  return result;
}

// ── Varga Adhidevata Archetype Resolver ─────────────────────────
function resolveVargaDeityArchetype(
  vargaKey: string,
  lagnaNum: number,
  lagnaDeg: number
): VargaDeityArchetype {
  if (vargaKey === "D10") {
    const isOdd = lagnaNum % 2 === 0;
    const slice = Math.min(Math.floor(lagnaDeg / 3), 9);
    const digpala = isOdd ? DIGPALAS_ODD[slice] : [...DIGPALAS_ODD].reverse()[slice];

    return {
      name: digpala.name,
      traditionalRole: digpala.role,
      leadershipMode: digpala.mode,
      distortionLabel: digpala.distortion,
      neuroEpigeneticRemedy: digpala.remedy,
      somaticCircadianHabit: digpala.somatic
    };
  }

  if (vargaKey === "D4") {
    const kumaras = [
      {
        name: "सनक (Sanaka)",
        role: "अंतर्मुखी आत्म-चिंतन व पवित्र गृह-आश्रम",
        mode: "अनासक्त परिसंपत्ति स्वामित्व एवं शांत घरेलू अभयारण्य",
        distortion: "संपत्ति व सीमा सुरक्षा को लेकर अत्यधिक संशय।",
        remedy: "आवास को प्रतिष्ठा के प्रदर्शन के बजाय आंतरिक साधना का शांत स्थल मानें।",
        somatic: "सायंकाल कक्ष को सुव्यवस्थित रखना और मंद प्रकाश का उपयोग।"
      },
      {
        name: "सनन्दन (Sanandana)",
        role: "हर्षित संतोष, पारिवारिक प्रेम व मानसिक शांति",
        mode: "घरेलू सौहार्द, पारिवारिक प्रसन्नता एवं चित्त विश्रांति",
        distortion: "भौतिक सुख-सुविधाओं का अत्यधिक आदर्शवादी मोह।",
        remedy: "सुख को भौतिक वस्तुओं के स्थान पर भावनात्मक उपस्थिति में खोजें।",
        somatic: "रात्रि भोजन के पश्चात बिना मोबाइल १० गहरी श्वास के साथ टहलना।"
      },
      {
        name: "सनत्कुमार (Sanatkumara)",
        role: "अजर ऊर्जा, अखंड एकाग्रता व बौद्धिक विस्तार",
        mode: "गहन बौद्धिक सृजन हेतु सुदृढ़ व शांत कार्य-आधार",
        distortion: "घरेलू परिवेश में निरंतर बेचैनी व असंतोष।",
        remedy: "घर के भीतर अध्ययन व शोध हेतु एक समर्पित, शांत कोना निर्धारित करें।",
        somatic: "प्रातः स्वच्छ भूमि या जूट के आसन पर शरीर को खींचने वाले सूक्ष्म व्यायाम।"
      },
      {
        name: "सनातन (Sanatana)",
        role: "शाश्वत स्थिरता, अचल संपदा व पूर्वज भूमि-कृपा",
        mode: "दीर्घकालिक अचल परिसंपत्ति निर्माण एवं मूल्य संरक्षण",
        distortion: "संपत्ति ह्रास या मूल्य घटने का अवचेतन भय।",
        remedy: "अल्पकालिक खरीद-फरोख्त के बजाय टिकाऊ, ठोस परिसंपत्तियों पर ध्यान दें।",
        somatic: "सप्ताह में एक बार प्राकृतिक मिट्टी या हरी दूब पर नंगे पाँव १० मिनट चलना।"
      }
    ];
    const slice = Math.min(Math.floor(lagnaDeg / 7.5), 3);
    const k = kumaras[slice];
    return {
      name: k.name,
      traditionalRole: k.role,
      leadershipMode: k.mode,
      distortionLabel: k.distortion,
      neuroEpigeneticRemedy: k.remedy,
      somaticCircadianHabit: k.somatic
    };
  }

  if (vargaKey === "D12") {
    const pitraDeities = [
      {
        name: "श्री गणेश (Ganesha)",
        role: "पूर्वज विघ्न-विनाशक एवं कुल-आरंभक",
        mode: "पारिवारिक रुकावटों का निवारण एवं नए मार्ग की रचना",
        distortion: "नया कार्य आरंभ करने से पूर्व पैतृक संकोच व हिचकिचाहट।",
        remedy: "पूर्वजों के त्याग का कृतज्ञतापूर्वक स्मरण कर स्वतंत्र उत्तरदायित्व के साथ आगे बढ़ें।",
        somatic: "नए उद्यम के आरंभ से पूर्व शीतल जल से मुख प्रक्षालन व ध्यान।"
      },
      {
        name: "अश्विनी कुमार (Ashwini Kumaras)",
        role: "वंश आरोग्य, कायाकल्प एवं जैविक नव-ऊर्जा",
        mode: "कोशिकीय पुनर्जीवन एवं आनुवंशिक स्वास्थ्य संवर्धन",
        distortion: "परिवार के पुराने स्वास्थ्य संबंधी भयों को स्वयं पर आरोपित करना।",
        remedy: "पोषक आहार अपनाएँ और पूर्वजों की गतिहीन आदतों को सक्रियता से तोड़ें।",
        somatic: "प्रातः एरोबिक व्यायाम और भोजन के समय का कठोर अनुशासन।"
      },
      {
        name: "यमराज (Yama)",
        role: "पूर्वज कर्म-लेखा, मर्यादा व कर्तव्य-पालन",
        mode: "अधूरे पारिवारिक दायित्वों की सत्यनिष्ठा से पूर्ति",
        distortion: "माता-पिता की स्वीकृति हेतु स्वयं को अत्यधिक कष्ट देकर काम करना।",
        remedy: "पूर्वजों का सम्मान आत्म-दंड से नहीं, बल्कि नैतिक उत्कृष्टता से करें।",
        somatic: "मेरुदंड खिंचाव और मानसिक विश्राम के लिए नियमित प्राणायाम।"
      },
      {
        name: "सर्प / शेषनाग (Sarpa)",
        role: "अवचेतन कुल-ज्ञान, कुण्डलिनी शक्ति व गूढ़ समझ",
        mode: "प्राचीन संस्कारों को उच्च आध्यात्मिक प्रज्ञा में रूपांतरित करना",
        distortion: "पारिवारिक रिश्तों में विश्वासघात का अकारण अवचेतन भय।",
        remedy: "पारिवारिक मामलों में पूर्ण पारदर्शी व स्पष्ट संवाद बनाए रखें।",
        somatic: "गहन अनुलोम-विलोम प्राणायाम द्वारा घबराहट और भय का शमन।"
      }
    ];
    const slice = Math.min(Math.floor(lagnaDeg / 2.5), 3);
    const d = pitraDeities[slice];
    return {
      name: d.name,
      traditionalRole: d.role,
      leadershipMode: d.mode,
      distortionLabel: d.distortion,
      neuroEpigeneticRemedy: d.remedy,
      somaticCircadianHabit: d.somatic
    };
  }

  if (vargaKey === "D30") {
    const bhutaDeities = [
      {
        name: "अग्नि देव (Agni)",
        role: "अग्नि तत्व · इच्छाशक्ति, तेजस्विता एवं चयापचय",
        mode: "बिना किसी क्रोध के सचेत व प्रभावी कर्म-ऊर्जा",
        distortion: "क्षण-मात्र में भड़कने वाला क्रोध और आवेशपूर्ण प्रतिक्रिया।",
        remedy: "संज्ञानात्मक विराम: किसी भी उकसावे पर कम से कम ६० मिनट तक कोई प्रतिक्रिया न दें।",
        somatic: "दोहरी गहरी श्वास लेकर धीरे-धीरे छोड़ना व शीतल जल स्नान।"
      },
      {
        name: "वायु देव (Vayu)",
        role: "वायु तत्व · विचार-गति, चंचलता व संपर्क",
        mode: "बौद्धिक फुर्ती बिना किसी अधीर घबराहट के",
        distortion: "लगातार चिंता, विचारों का बिखराव और एकाग्रता का अभाव।",
        remedy: "कागज-कलम पर लिखकर केवल एक समय में एक ही कार्य पर पूर्ण ध्यान केंद्रित करना।",
        somatic: "नंगे पाँव भूमि-स्पर्श और आरामदायक भारी कंबल की निद्रा।"
      },
      {
        name: "इंद्र देव (Indra)",
        role: "आकाश तत्व · प्रभुत्व, अधिकार व संगठन",
        mode: "विनम्र स्वायत्तता एवं नैतिक नेतृत्व",
        distortion: "अधिकार-अहंकार और आलोचना पर तीखी भावनात्मक प्रतिक्रिया।",
        remedy: "निस्वार्थ सेवा: किसी ऐसे व्यक्ति की गुप्त सहायता करें जो कभी प्रतिदान न दे सके।",
        somatic: "प्रातः धूप में सीधे कंधे और शांत गर्दन के साथ चहलकदमी।"
      },
      {
        name: "कुबेर देव (Kubera)",
        role: "पृथ्वी तत्व · ठोस पदार्थ, साधन व स्थिरता",
        mode: "स्थिर समृद्धि एवं संसाधनों का विवेकपूर्ण प्रबंधन",
        distortion: "कंजूसी, संग्रह की भूख और धन नष्ट होने का भय।",
        remedy: "समृद्धि दृष्टिकोण: उत्पादक उपकरणों और जनकल्याण में साधन लगाना सीखें।",
        somatic: "वित्तीय समीक्षा से पूर्व ५ गहरी उदर-श्वास लेकर मन को शांत करना।"
      },
      {
        name: "वरुण देव (Varuna)",
        role: "जल तत्व · भावना, अंतःकरण व अंतर्ज्ञान",
        mode: "भावनात्मक संतुलन एवं चित्त की निर्मलता",
        distortion: "पलायनवाद, अस्वस्थ आदतों में उलझना और सीमाओं का लोप।",
        remedy: "डिजिटल उपवास: रात्रि ८ बजे के बाद किसी भी निष्क्रिय सोशल मीडिया से पूर्ण दूरी।",
        somatic: "पर्याप्त जलयोजन और सायंकाल सौम्य हर्बल पेय।"
      }
    ];
    const slice = Math.min(Math.floor(lagnaDeg / 6), 4);
    const b = bhutaDeities[slice];
    return {
      name: b.name,
      traditionalRole: b.role,
      leadershipMode: b.mode,
      distortionLabel: b.distortion,
      neuroEpigeneticRemedy: b.remedy,
      somaticCircadianHabit: b.somatic
    };
  }

  if (vargaKey === "D5") {
    return {
      name: "बृहस्पति-सरस्वती (Brihaspati-Saraswati)",
      traditionalRole: "पूर्व-पुण्य, सूक्ष्म प्रज्ञा व उच्च रचनात्मक मेधा",
      leadershipMode: "सहज अंतर्ज्ञान एवं अयाचित दिव्य मेधा शक्ति",
      distortionLabel: "बौद्धिक प्रमाद (पूर्ण प्रेरणा की प्रतीक्षा में कार्य टालना)।",
      neuroEpigeneticRemedy: "अंतर्ज्ञान को दैनिक अनुशासित सृजन में बदलें; शोध व लेखन द्वारा मेधा को मूर्त रूप दें।",
      somaticCircadianHabit: "प्रातःकाल जागते ही ३० मिनट का निर्बाध सृजनात्मक कार्य या अध्ययन।"
    };
  }

  if (vargaKey === "D6") {
    return {
      name: "कार्तिकेय-रुद्र (Kartikeya-Rudra)",
      traditionalRole: "शत्रु-शमन, रोग प्रतिरोधकता व संघर्ष विजय",
      leadershipMode: "अडिग अनुशासन, जैविक प्रतिरक्षा एवं प्रतिस्पर्धी जीवटता",
      distortionLabel: "संघर्ष से पलायन अथवा निरंतर शत्रुता का अनावश्यक वहम।",
      neuroEpigeneticRemedy: "प्रतिद्वंद्वियों और चुनौतियों को व्यायाम की तरह लें; विवादों व ऋणों को योजनाबद्ध रूप से सुलझाएँ।",
      somaticCircadianHabit: "शीतल जल स्नान, मांसपेशियों का शक्ति-प्रशिक्षण एवं गरिष्ठ भोजन का त्याग।"
    };
  }

  if (vargaKey === "D8") {
    return {
      name: "महामृत्युंजय-काल (Mrityunjaya-Kaal)",
      traditionalRole: "रूपांतरण, दीर्घायु कवच एवं संकट-सिद्धि",
      leadershipMode: "अस्थिरता में भी अप्रत्याशित उत्थान व अदम्य लचीलापन",
      distortionLabel: "अनिष्ट की निरंतर आशंका एवं अचानक नुकसान का भय।",
      neuroEpigeneticRemedy: "सुरक्षा के अतिरिक्त उपाय रखें; जीवन के उतार-चढ़ावों को चेतना की उच्च छलांग मानें।",
      somaticCircadianHabit: "कठिन समय में सम-वृत्त प्राणायाम (४ सेकंड श्वास, ४ रोकें, ४ छोड़ें, ४ रोकें)।"
    };
  }

  if (vargaKey === "D11") {
    return {
      name: "रुद्र-कुबेर (Rudra-Kubera)",
      traditionalRole: "संपत्ति बहु-गुणन एवं उच्चतम अभिलाषा पूर्ति",
      leadershipMode: "गैर-रेखीय वित्तीय विस्तार एवं सीमित सीमाओं को तोड़ना",
      distortionLabel: "सीमित आय का मानसिक दायरा (समय को सीधे धन से तौलना)।",
      neuroEpigeneticRemedy: "ऐसी स्वचालित प्रणालियों और संपत्तियों का निर्माण करें जो आपकी भौतिक उपस्थिति के बिना भी आय दें।",
      somaticCircadianHabit: "सप्ताह में २ घंटे का एकांत चिंतन केवल विस्तार और वितरण रणनीतियों पर केंद्रित।"
    };
  }

  if (vargaKey === "D9") {
    const amshaType = lagnaNum % 3 === 0 ? "देव" : lagnaNum % 3 === 1 ? "नर" : "राक्षस";
    return {
      name: `${amshaType} नवांश अधिदेवता`,
      traditionalRole: "आत्मिक धर्म, दांपत्य संगति व पवित्र सह-जीवन",
      leadershipMode: amshaType === "देव" ? "उदात्त विश्वास व परोपकारी साझेदारी" : amshaType === "नर" ? "व्यावहारिक, संतुलित एवं यथार्थवादी सहयोग" : "तीव्र परिवर्तनकारी व साहसी सामर्थ्य",
      distortionLabel: "संबंधों में अनकही अपेक्षाएँ थोपना एवं काल्पनिक आदर्शवाद का मोह।",
      neuroEpigeneticRemedy: "साझेदारी में पूर्ण स्पष्टता और निर्मल सत्यनिष्ठा रखें; अवास्तविक अपेक्षाओं से मुक्त हों।",
      somaticCircadianHabit: "सायंकाल साथी के साथ बिना किसी फोन के सौहार्दपूर्ण संवाद व कृतज्ञता भाव।"
    };
  }

  if (vargaKey === "D60") {
    return {
      name: "संचित दिव्य षष्ट्यंश (Sanchita Divine Amsha)",
      traditionalRole: "मूल पूर्वजन्म संचित कर्म, प्रारब्ध विधान व अंतिम ईश्वरीय निर्णय",
      leadershipMode: "आत्मिक गंतव्य का साक्षात्कार एवं प्रारब्ध ऋणों का निष्काम शोधन",
      distortionLabel: "अस्तित्ववादी संशय ('मेरे ही साथ ऐसा क्यों?') एवं कर्म से विरक्ति।",
      neuroEpigeneticRemedy: "अपने कार्य को लोक-कल्याण और धर्म के साथ जोड़ें; निष्काम सेवा से पूर्व कर्मों के बंधनों को काटें।",
      somaticCircadianHabit: "दैनिक १० मिनट जीवन की नश्वरता और आत्मा के मूल उद्देश्य पर मौन चिंतन।"
    };
  }

  // Default Vedic Archetype
  return {
    name: "सूर्य-प्रजापति (Surya-Prajapati)",
    traditionalRole: "सार्वभौमिक प्राण-शक्ति एवं सूक्ष्म कर्म नियमन",
    leadershipMode: "ठोस उत्तरदायित्व, उद्देश्य की स्पष्टता एवं नियमित कर्मठता",
    distortionLabel: "उद्देश्यहीन भटकाव एवं सूक्ष्म विकर्षणों में समय गँवाना।",
    neuroEpigeneticRemedy: "दैनिक अनुशासित दिनचर्या द्वारा अपने व्यक्तिगत प्रयासों को प्रकृति के नियमों के अनुकूल करें।",
    somaticCircadianHabit: "प्रातः सूर्योदय की प्राकृतिक आभा के साथ नियमित रूप से जागने का नियम।"
  };
}

// ── MAIN EVALUATION ENGINE ──────────────────────────────────────
export function evaluateVargaNeuroKarmicProfile(
  natalChart: ChartData,
  varga: DivChart,
  allVargas: DivChart[]
): VargaNeuroKarmicProfile {
  const vMeta = VARGA_DOMAINS[varga.key] || {
    title: `${varga.name} चक्र विश्लेषण`,
    karakas: ["Sun"],
    focusArea: "जीवन के इस सूक्ष्म आयाम का संवर्धन",
    shastricEssence: "पाराशरी सूक्ष्म फलित का विशेष परिप्रेक्ष्य"
  };

  const natalLagnaNum = natalChart.lagnaNum || 1;
  const vargaLagnaNum = varga.lagnaNum || 1;
  const houseOffsetFromNatal = md(vargaLagnaNum - natalLagnaNum, 12) + 1;

  // 1. Detect Critical Karmic Latent Points (Kharesh 22nd Drekkana, 64th Navamsha, Pushkar Navamshas)
  const d3 = allVargas.find(v => v.key === "D3");
  const d9 = allVargas.find(v => v.key === "D9");
  const latentPoints = detectKarmicLatentPoints(natalChart, d3, d9);

  // 2. Resolve Varga Adhidevata Archetype
  const lagnaDeg = natalChart.lagnaLon ? md(natalChart.lagnaLon, 30) : 15;
  const deityArchetype = resolveVargaDeityArchetype(varga.key, vargaLagnaNum, lagnaDeg);

  // 3. Natal Lagna Relation Synthesis in Pure Dignified Hindi
  let natalRelationDesc = "";
  const vargaLagnaName = SIGN_NAMES_HINDI[varga.lagna] || varga.lagna;
  const natalLagnaName = SIGN_NAMES_HINDI[natalChart.lagnaRashi] || natalChart.lagnaRashi;

  if (houseOffsetFromNatal === 1) {
    natalRelationDesc = `${varga.key} लग्न एवं जन्म लग्न दोनों ${vargaLagnaName} हैं (वर्गोत्तम लग्न) — यह उच्च आत्मिक सामंजस्य का प्रतीक है; इस क्षेत्र के संकल्प बिना किसी आंतरिक संघर्ष के सहजता से मूर्त रूप लेते हैं।`;
  } else if ([5, 9].includes(houseOffsetFromNatal)) {
    natalRelationDesc = `${varga.key} लग्न, जन्म लग्न (${natalLagnaName}) से ${houseOffsetFromNatal}वें भाव (त्रिकोण) में उदित है — यह पूर्व-जन्म के पुण्य, स्वाभाविक अंतर्ज्ञान और इस क्षेत्र में स्वतः प्राप्त होने वाले ईश्वरीय सहयोग को प्रमाणित करता है।`;
  } else if ([4, 7, 10].includes(houseOffsetFromNatal)) {
    natalRelationDesc = `${varga.key} लग्न, जन्म लग्न (${natalLagnaName}) से ${houseOffsetFromNatal}वें भाव (केंद्र) में उदित है — यह कर्मठता, सामाजिक दायित्व और पुरुषार्थ के बल पर ठोस सांसारिक उपलब्धियों के निर्माण की क्षमता देता है।`;
  } else if ([6, 8, 12].includes(houseOffsetFromNatal)) {
    natalRelationDesc = `${varga.key} लग्न, जन्म लग्न (${natalLagnaName}) से ${houseOffsetFromNatal}वें भाव (त्रिक / दुःस्थान) में उदित है — यह एक परिवर्तनकारी क्षेत्र है, जहाँ अनुशासन, धैर्य और चेतन संकल्प के माध्यम से ही स्थाई सिद्धि प्राप्त होती है।`;
  } else {
    natalRelationDesc = `${varga.key} लग्न, जन्म लग्न (${natalLagnaName}) से ${houseOffsetFromNatal}वें उपचय/वृद्धि भाव में उदित है — यह निरंतर अभ्यास, सजगता और व्यावहारिक संतुलन के माध्यम से जीवन के इस आयाम को उत्तरोत्तर समृद्ध करता है।`;
  }

  // 4. Planetary Audits in Varga
  const exaltedPlanets = varga.planets.filter(p => p.dignity === "Exalted");
  const ownPlanets = varga.planets.filter(p => p.dignity === "Own");
  const debPlanets = varga.planets.filter(p => p.dignity === "Debilitated");
  const dusthanaPlanets = varga.planets.filter(p => [6, 8, 12].includes(p.house));
  const lagnaPlanets = varga.planets.filter(p => p.inLagna);

  // ── CARD 1: D1-Aligned Deep Explanation Narrative ───────────
  const paragraphs: string[] = [];
  const keyHighlights: string[] = [];

  const natalLagnesh = SIGN_LORDS[natalLagnaNum] ?? "Mercury";
  const natalLagneshHindi = PLANET_NAMES_HINDI[natalLagnesh] || natalLagnesh;

  // Paragraph 1: Lagna Alignment & D1 Connection
  paragraphs.push(
    `आपकी मूल जन्म कुंडली (D-1) में ${natalLagnaName} लग्न उदित है, जिसके स्वामी लग्नेश ${natalLagneshHindi} हैं। जब हम ${vMeta.title} से जुड़े ${varga.name} चक्र (${varga.key}) का सूक्ष्म विश्लेषण करते हैं, तो यहाँ ${vargaLagnaName} लग्न का उदय होता है, जो मूल जन्म लग्न से ${houseOffsetFromNatal}वें भाव में संरेखित है। शास्त्रीय ज्योतिष के अनुसार यह स्थिति स्पष्ट करती है कि आपका मूल व्यक्तित्व किस प्रकार इस विशिष्ट जीवन आयाम में सक्रिय होता है और आपके अंतर्मन के संकल्प भौतिक जगत में कैसे फलित होते हैं।`
  );

  // Paragraph 2: Deity Archetype Integration
  paragraphs.push(
    `इस वर्ग चक्र के लग्न पर अधिदेवता ${deityArchetype.name} का सूक्ष्म आधिपत्य है, जो ${deityArchetype.traditionalRole} की ऊर्जा का प्रतिनिधित्व करते हैं। महर्षि पाराशर के अनुसार, जब जातक अपने दैनिक कर्म और निर्णय-प्रक्रिया को इस अधिदेवता के सात्विक स्वरूप ("${deityArchetype.leadershipMode}") के साथ संरेखित करता है, तब अवचेतन मन का संशय और आंतरिक घर्षण स्वतः समाप्त हो जाता है। इससे कार्य निष्पादन में अप्रत्याशित स्पष्टता और गतिशीलता का संचार होता है।`
  );
  keyHighlights.push(`अधिदेवता संरेखण: ${deityArchetype.name}`);

  // Paragraph 3: Varga Karaka & Strong Planets
  const karakaHindiNames = vMeta.karakas.map(k => PLANET_NAMES_HINDI[k] || k).join(", ");
  const karakaInVarga = varga.planets.filter(p => vMeta.karakas.includes(p.planet));
  const strongInVarga = [...exaltedPlanets, ...ownPlanets];

  if (strongInVarga.length > 0) {
    const strongStr = strongInVarga
      .map(p => `${PLANET_NAMES_HINDI[p.planet] || p.planet} (${SIGN_NAMES_HINDI[p.sign] || p.sign} में ${p.dignity === "Exalted" ? "उच्च" : "स्वक्षेत्री"}, ${p.house}वां भाव)`)
      .join("; ");
    paragraphs.push(
      `इस वर्ग चक्र में शास्त्रीय शक्ति का मुख्य केंद्र: ${strongStr} है। शास्त्रों का यह अटल नियम है कि जब कोई ग्रह वर्ग कुंडली में उच्च या स्वक्षेत्री होकर केंद्र या त्रिकोण में बैठता है, तो वह उस विशिष्ट जीवन क्षेत्र में जातक को असाधारण योग्यता, अप्रत्याशित विजय और सहज सामर्थ्य का वरदान देता है।`
    );
    keyHighlights.push(`प्रबल शक्ति केंद्र: ${strongInVarga.map(p => `${PLANET_NAMES_HINDI[p.planet] || p.planet} (${p.dignity === "Exalted" ? "उच्च" : "स्वक्षेत्री"})`).join(", ")}`);
  } else {
    paragraphs.push(
      `इस वर्ग चक्र में ग्रहों की स्थिति अत्यंत संतुलित और अनुशासित है। यहाँ के मुख्य कारक ग्रह (${karakaHindiNames}) वर्ग चक्र के महत्वपूर्ण भावों (विशेषतः भाव ${karakaInVarga.map(k => k.house).join(", ")}) में स्थित होकर ऊर्जा को संचालित कर रहे हैं। यह संतुलन दर्शाता है कि इस क्षेत्र में सफलता किसी आकस्मिक चमत्कार से नहीं, बल्कि आपके सतत अभ्यास और सुव्यवस्थित प्राथमिकताओं से निर्मित होगी।`
    );
  }

  // Paragraph 4: Specialized Varga Insights & Critical Latent Points
  if (varga.key === "D10") {
    const sun = varga.planets.find(p => p.planet === "Sun");
    const rahu = varga.planets.find(p => p.planet === "Rahu");
    const merc = varga.planets.find(p => p.planet === "Mercury");
    if (merc?.house === 11 && merc?.dignity === "Exalted") {
      paragraphs.push(
        `दशमांश (D-10) के एकादश भाव (लाभ, नेटवर्क व व्यावसायिक विस्तार) में बुध देव अपनी उच्च राशि (कन्या) में विराजमान हैं। यह दशमांश चक्र का सर्वोच्च व्यापारिक व तकनीकी हस्ताक्षर है — यह स्पष्ट घोषणा करता है कि आपका मुख्य आर्थिक विस्तार परिष्कृत बौद्धिक कौशल, तकनीकी समाधानों, एल्गोरिदम और सुव्यवस्थित स्वचालित प्रणालियों से प्राप्त होगा।`
      );
      keyHighlights.push("D-10 एकादश भाव: उच्च बुध (तकनीकी व व्यावसायिक महालाभ)");
    }
    if (sun && rahu && sun.house === rahu.house) {
      paragraphs.push(
        `दशमांश के भाव ${sun.house} में सूर्य और राहु की युति स्थित है। कर्मक्षेत्र में राहु की यह सक्रियता पारंपरिक सीमाओं को तोड़कर आधुनिक डिजिटल प्लेटफॉर्म्स, वैश्विक संपर्कों और अपरंपरागत प्रभावशाली माध्यमों में आपको स्वतंत्र अधिकार व प्रतिष्ठा प्रदान करती है।`
      );
      keyHighlights.push(`D-10 भाव ${sun.house}: सूर्य + राहु युति (वैश्विक व डिजिटल विस्तार)`);
    }
  } else if (varga.key === "D9") {
    const moon = varga.planets.find(p => p.planet === "Moon");
    const rahu = varga.planets.find(p => p.planet === "Rahu");
    const merc = varga.planets.find(p => p.planet === "Mercury");
    if (merc?.house === 4 && merc?.dignity === "Exalted") {
      paragraphs.push(
        `नवांश (D-9) के चतुर्थ भाव में बुध देव उच्च स्थिति में स्थित हैं, जो आपकी आत्मा के अंतःकरण में तीव्र विवेक, नैतिक स्पष्टता और उच्च बौद्धिक शांति को स्थापित करते हैं।`
      );
      keyHighlights.push("D-9 चतुर्थ भाव: उच्च बुध (आत्मिक विवेक व मानसिक शांति)");
    }
    if (moon && rahu && moon.house === 7 && rahu.house === 7) {
      paragraphs.push(
        `नवांश के सप्तम भाव (कलत्र भाव) में चंद्र और राहु की युति यह इंगित करती है कि जीवनसाथी अत्यंत महत्वाकांक्षी, आधुनिक सोच रखने वाला, बौद्धिक रूप से स्वतंत्र और लीक से हटकर विचार करने वाला व्यक्तित्व होगा।`
      );
      keyHighlights.push("D-9 सप्तम भाव: चंद्र + राहु युति (विशिष्ट व स्वतंत्र जीवनसाथी)");
    }
    if (latentPoints.sixtyFourthNavamsha) {
      paragraphs.push(
        `विशेष कार्मिक सतर्कता (६४वाँ नवांश): चंद्र नवांश से चतुर्थ भाव (${SIGN_NAMES_HINDI[latentPoints.sixtyFourthNavamsha.sign] || latentPoints.sixtyFourthNavamsha.sign}) जिसके स्वामी ${PLANET_NAMES_HINDI[latentPoints.sixtyFourthNavamsha.planet] || latentPoints.sixtyFourthNavamsha.planet} हैं, सूक्ष्म तनाव का संवेदनशील बिंदु है। इस राशि पर से होने वाले गोचर के समय आवेशपूर्ण अनुबंधों या त्वरित भावनात्मक प्रतिक्रियाओं से बचना ही सर्वोत्तम शास्त्रीय सुरक्षा कवच है।`
      );
      keyHighlights.push(`६४वाँ नवांश संवेदनशील बिंदु: ${latentPoints.sixtyFourthNavamsha.sign} (${latentPoints.sixtyFourthNavamsha.planet})`);
    }
  } else if (varga.key === "D3" && latentPoints.kharesh22ndDrekkana) {
    paragraphs.push(
      `द्रेष्काण का संवेदनशील बिंदु (२२वाँ द्रेष्काण / ख्रेश): D-3 लग्न से अष्टम भाव ${SIGN_NAMES_HINDI[latentPoints.kharesh22ndDrekkana.sign] || latentPoints.kharesh22ndDrekkana.sign} राशि में पड़ता है, जिसके अधिपति ${PLANET_NAMES_HINDI[latentPoints.kharesh22ndDrekkana.planet] || latentPoints.kharesh22ndDrekkana.planet} देव हैं। यह बिंदु शरीर के ${latentPoints.kharesh22ndDrekkana.organSystem} तंत्र की संवेदनशीलता को दर्शाता है, जहाँ नियमित प्राणायाम और तनाव-मुक्ति अत्यंत आवश्यक है।`
    );
    keyHighlights.push(`२२वाँ द्रेष्काण (ख्रेश बिंदु): ${latentPoints.kharesh22ndDrekkana.planet} (${latentPoints.kharesh22ndDrekkana.sign})`);
  } else if (varga.key === "D5") {
    paragraphs.push(
      `पंचमांश चक्र (D-5) पूर्व-पुण्य और अतींद्रिय अंतर्ज्ञान का सूक्ष्म दर्पण है। इस चक्र में शुभ प्रभाव यह सिद्ध करते हैं कि पूर्व जन्मों के सात्विक संस्कार इस जन्म में आपकी सृजनात्मक प्रज्ञा और स्वतः स्फूर्त निर्णय क्षमता बनकर फलित हो रहे हैं।`
    );
    keyHighlights.push("D-5: पूर्व-पुण्य एवं अंतर्ज्ञान सक्रिय");
  } else if (varga.key === "D6") {
    paragraphs.push(
      `षष्ठांश चक्र (D-6) जीवन में आने वाली व्याधियों, ऋणों और प्रतिस्पर्धियों पर विजय का सूचक है। उपचय भावों की सुदृढ़ता यह सुनिश्चित करती है कि किसी भी प्रकार का विरोध या संकट आपके धैर्य को डिगा नहीं सकेगा, बल्कि वह आपको और अधिक परिपक्व बनाएगा।`
    );
    keyHighlights.push("D-6: रोग-प्रतिरोधक क्षमता व प्रतिस्पर्धी विजय");
  } else if (varga.key === "D8") {
    paragraphs.push(
      `अष्टमांश चक्र (D-8) अचानक होने वाले जीवन रूपांतरणों और दीर्घायु की आंतरिक शक्ति को मापता है। यह चक्र दर्शाता है कि अप्रत्याशित उतार-चढ़ाव आपके लिए आघात नहीं, बल्कि चेतना के नए क्षितिज खोलने वाले क्रांतिकारी अवसर सिद्ध होंगे।`
    );
    keyHighlights.push("D-8: रूपांतरण एवं संकट-सिद्धि सामर्थ्य");
  } else if (varga.key === "D11") {
    paragraphs.push(
      `रुद्रांश चक्र (D-11) संपत्ति के बहु-गुणन और उच्चतम अभिलाषाओं की पूर्ति का सूक्ष्म नियामक है। यह सामान्य वेतन अथवा सीमित आय के बंधनों से ऊपर उठकर व्यापक वित्तीय साम्राज्य स्थापित करने की सामर्थ्य को पुष्ट करता है।`
    );
    keyHighlights.push("D-11: बहु-आयामी संपत्ति व अभिलाषा पूर्ति");
  } else if (varga.key === "D60") {
    const merc = varga.planets.find(p => p.planet === "Mercury");
    const sun = varga.planets.find(p => p.planet === "Sun");
    const moon = varga.planets.find(p => p.planet === "Moon");
    if (merc?.inLagna) {
      paragraphs.push(
        `षष्ट्यंश चक्र (D-60) के लग्न में बुध देव की स्थिति यह प्रमाणित करती है कि आपकी गणितीय, तार्किक और विश्लेषणात्मक मेधा केवल इस जन्म का अध्ययन नहीं है, अपितु यह कई जन्मों के संचित संस्कारों का सुफल है।`
      );
      keyHighlights.push("D-60 लग्न: बुध (पूर्व-जन्म संचित तार्किक मेधा)");
    }
    if (sun?.house === 9 && moon?.house === 9) {
      paragraphs.push(
        `D-60 के नवम भाव (धर्म व पितृ भाव) में सूर्य और चंद्र दोनों देव विराजमान हैं। यह पवित्र कुल परंपरा और पूर्वजों के विशेष शुभाशीष का दुर्लभ शास्त्रीय प्रतीक है।`
      );
      keyHighlights.push("D-60 नवम भाव: सूर्य + चंद्र (पूर्वज शुभाशीष एवं धर्म रक्षा)");
    }
  }

  // Pushkar Navamsha Recognition
  if (latentPoints.pushkarNavamshas && latentPoints.pushkarNavamshas.length > 0) {
    const pNames = latentPoints.pushkarNavamshas
      .map(p => `${PLANET_NAMES_HINDI[p.planet] || p.planet} (${p.navamshaSign})`)
      .join(", ");
    paragraphs.push(
      `पुष्कर नवांश का दैवीय आशीर्वाद: आपकी कुंडली में पुष्कर नवांश के अमृत अंश सक्रिय हैं (${pNames})। वैदिक ज्योतिष में पुष्कर नवांश को नव-जीवन और अप्रत्याशित कायाकल्प का कारक माना गया है, जो जातक को घोर संकटों के उपरांत भी असाधारण उत्थान और सफलता प्रदान करता है।`
    );
    keyHighlights.push(`पुष्कर नवांश अमृत सक्रिय: ${latentPoints.pushkarNavamshas.map(p => p.planet).join(", ")}`);
  }

  // Lagna Occupants
  if (lagnaPlanets.length > 0) {
    const lagnaPStr = lagnaPlanets
      .map(p => `${PLANET_NAMES_HINDI[p.planet] || p.planet} (${SIGN_NAMES_HINDI[p.sign] || p.sign})`)
      .join(", ");
    paragraphs.push(
      `${varga.key} के लग्न में ${lagnaPStr} विराजमान हैं। यह ग्रह इस विशिष्ट चक्र के अंतःकरण का संचालन करते हैं और आपके प्रत्यक्ष दृष्टिकोण व कार्यशैली को स्वरूप देते हैं।`
    );
    if (!keyHighlights.some(k => k.includes("लग्न में स्थित ग्रह"))) {
      keyHighlights.push(`लग्न में स्थित ग्रह: ${lagnaPlanets.map(p => p.planet).join(", ")}`);
    }
  }

  // Primary highlight summary for golden callout box
  const primaryHighlight = keyHighlights[0] || `${varga.name} (${varga.key}) शास्त्रीय सूक्ष्म विश्लेषण`;

  // ── CARD 2: Varga Karmic Weakness & Subconscious Bottleneck ──
  const frictionPoints: string[] = [];
  const afflictedPlanets: string[] = [];

  if (debPlanets.length > 0) {
    debPlanets.forEach(dp => {
      frictionPoints.push(`${PLANET_NAMES_HINDI[dp.planet] || dp.planet} भाव ${dp.house} में नीच राशि (${SIGN_NAMES_HINDI[dp.sign] || dp.sign})`);
      afflictedPlanets.push(dp.planet);
    });
  }

  if (dusthanaPlanets.length > 0) {
    const dStr = dusthanaPlanets
      .map(p => `${PLANET_NAMES_HINDI[p.planet] || p.planet} (भाव ${p.house})`)
      .join(", ");
    frictionPoints.push(`त्रिक भाव प्रभाव: ${dStr}`);
    dusthanaPlanets.forEach(p => {
      if (!afflictedPlanets.includes(p.planet)) afflictedPlanets.push(p.planet);
    });
  }

  // Primary afflicted planet for behavioral synthesis
  const primaryAfflicted = debPlanets[0]?.planet || dusthanaPlanets[0]?.planet || vMeta.karakas[0] || "Saturn";
  const pat = ANCESTRAL_PATTERNS[primaryAfflicted] || ANCESTRAL_PATTERNS["Saturn"];

  const hasAffliction = frictionPoints.length > 0;
  const frictionSummary = hasAffliction
    ? `${varga.key} चक्र में ${frictionPoints.join(" · ")} का शास्त्रीय प्रभाव है, जो इस क्षेत्र में अवचेतन संकोच और निर्णय में विलंब का कारण बनता है।`
    : `${varga.key} चक्र में कोई प्रत्यक्ष नीच राशि अथवा गंभीर दुर्बलता नहीं है; ऊर्जा प्रवाह सहज व अनुकूल है, जिसे नियमित अभ्यास से और उत्कृष्ट बनाया जा सकता है।`;

  const psychologicalBottleneckTitle = hasAffliction
    ? `${PLANET_NAMES_HINDI[primaryAfflicted] || primaryAfflicted} प्रभाव: ${pat.distortion.split("—")[0].trim()}`
    : `${deityArchetype.name} अधिदेवता छाया: ${deityArchetype.distortionLabel}`;

  const psychologicalBottleneckDesc = hasAffliction
    ? `जब इस जीवन क्षेत्र में अप्रत्याशित तनाव या दबाव बढ़ता है, तो अवचेतन मन स्वतः इस पुराने चक्र में चला जाता है: ${pat.distortion}। इसके साथ ही ${deityArchetype.name} अधिदेवता का छाया प्रभाव ("${deityArchetype.distortionLabel}") निर्णय लेने की गति को प्रभावित करता है। चेतन संकल्प द्वारा ही इस वृत्त को तोड़ा जा सकता है।`
    : `यद्यपि इस चक्र में ग्रह संरेखण संतुलित है, फिर भी ${deityArchetype.name} अधिदेवता का सूक्ष्म छाया प्रभाव ("${deityArchetype.distortionLabel}") तब सिर उठा सकता है जब दैनिक जीवन में अनुशासन और पूर्व-नियोजित प्राथमिकताओं की उपेक्षा हो।`;

  const ancestralLineagePattern = pat.ancestral;

  // ── CARD 3: Scientific & DNA-Based Neuro-Remedy Protocol ──────
  const ancestralLoopInterruption = pat.rewrite;
  const cognitiveRewiring = {
    techniqueName: `संज्ञानात्मक पुनर्गठन तकनीक (${PLANET_NAMES_HINDI[primaryAfflicted] || primaryAfflicted} व ${deityArchetype.name})`,
    distortionLabel: `${pat.distortion.split("—")[0].trim()}`,
    mindsetProtocol: `अवचेतन प्रतिरूप का रूपांतरण: ${pat.rewrite} अधिदेवता की सात्विक युक्ति: ${deityArchetype.neuroEpigeneticRemedy}`
  };

  const somaticBehavioralHabit = {
    habitName: `दैनिक देह-व्यवहार क्रिया (${PLANET_NAMES_HINDI[primaryAfflicted] || primaryAfflicted})`,
    neuroMechanism: `स्वायत्त तंत्रिका तंत्र (Autonomic Nervous System) का पुनर्संतुलन एवं ${vMeta.title} हेतु एकाग्रता संवर्धन`,
    dailyProtocol: `${pat.somatic} दैनिक लय: ${deityArchetype.somaticCircadianHabit}`
  };

  const archetypeAlignment = {
    name: deityArchetype.name,
    executiveProtocol: deityArchetype.leadershipMode,
    cognitiveRefocus: deityArchetype.neuroEpigeneticRemedy
  };

  return {
    vargaKey: varga.key,
    vargaName: varga.name,
    domainTitle: vMeta.title,
    vargaLagna: varga.lagna,
    natalLagnaRelation: natalRelationDesc,
    deityArchetype,
    latentPoints,
    deepExplanation: {
      title: `${varga.name} चक्र (${varga.key}) · शास्त्रीय सूक्ष्म-फलित एवं जीवन दिशा`,
      natalAlignmentSummary: natalRelationDesc,
      paragraphs,
      keyHighlights,
      primaryHighlight
    },
    karmicWeakness: {
      hasAffliction,
      frictionSummary,
      afflictedPlanets,
      psychologicalBottleneckTitle,
      psychologicalBottleneckDesc,
      ancestralLineagePattern
    },
    neuroRemedy: {
      ancestralLoopInterruption,
      cognitiveRewiring,
      somaticBehavioralHabit,
      archetypeAlignment
    }
  };
}
