// src/lib/astro-engine/psychology.ts
// ============================================================
// ASTROLIFE PSYCHOLOGY & COGNITIVE NEURO-ASTROLOGY ENGINE v3.0
// Synthesizes:
// 1. Classical Vedic Psychology: Antahkarana Chatushtaya (Manas, Buddhi, Ahamkara, Chitta)
// 2. Triguna Distribution (Sattva, Rajas, Tamas)
// 3. Modern Empirical Psychometrics: Big Five (OCEAN) Personality Scale
// 4. Cognitive Distortions & CBT / Shadow Work Reframing
// 5. Circadian Focus Peak & Chronobiology
// 6. Deep Human Storytelling Prose (Novelistic Narrative)
// ============================================================

export interface PsychPlanet {
  planet: string;
  icon: string;
  color: string;
  func: string;
  trait: string;
  cog: string;
  strong: string;
  weak: string;
  strength: number;
  status: "Strong" | "Moderate" | "Weak/Blocked";
  statusColor: string;
  house: number;
  sign: string;
  retrograde: boolean;
  dignity: string;
}

export interface PsychPattern {
  name: string;
  desc: string;
  shadow: string;
  anxietyIdx: number;
  karmaLoop: number;
  behavBias: number;
  radarVals: number[];
}

export interface AntahkaranaLayer {
  name: string;
  hindiName: string;
  governingPlanets: string[];
  score: number; // 0..100
  functionDesc: string;
  expressionStatus: "Harmonious" | "Hyperactive" | "Suppressed";
  insight: string;
}

export interface BigFiveScore {
  trait: string;
  label: string;
  score: number; // 0..100
  governingPlanets: string;
  description: string;
}

export interface CognitiveDistortionItem {
  distortion: string;
  planet: string;
  triggerContext: string;
  cbtReframe: string;
}

export interface PsychResult {
  planets: PsychPlanet[];
  pattern: PsychPattern;
  dominantFunctions: string[];
  riskFlags: { title: string; detail: string; severity: "low" | "medium" | "high" }[];
  stabilizers: string[];
  growthPlan: string[];
  summary: string;

  // Classical Vedic Additions
  antahkarana: AntahkaranaLayer[];
  trigunas: {
    sattva: number;
    rajas: number;
    tamas: number;
    dominantGuna: "Sattva" | "Rajas" | "Tamas";
    description: string;
  };

  // Modern Scientific & Psychometric Additions
  bigFive: BigFiveScore[];
  cognitiveDistortions: CognitiveDistortionItem[];
  circadianPeak: {
    peakFocusWindow: string;
    dopamineResetWindow: string;
    cognitiveInsight: string;
  };

  // Novelistic Storytelling Narrative
  storytellingProse: string[];
}

interface PD {
  house: number;
  sign: string;
  signNum: number;
  retrograde: boolean;
  dignity: string;
  lon: number;
}

// ── Constants ─────────────────────────────────────────────────
const PLS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const PEMO = ["☉", "☽", "♂", "☿", "♃", "♀", "♄", "☊", "☋"];
const PCOL = ["#f97316", "#c084fc", "#ef4444", "#22c55e", "#f59e0b", "#ec4899", "#60a5fa", "#a78bfa", "#fb7185"];

const PSYCH_DATA: Record<string, { func: string; trait: string; cog: string; strong: string; weak: string }> = {
  Sun: {
    func: "अहंकार व आत्म-पहचान (Ego & Core Identity)",
    trait: "Core identity strength",
    cog: "Self-actualization drive, authority need",
    strong: "Confident, decisive, natural leader with healthy boundaries",
    weak: "Imposter syndrome, authority clashes, defensive pride",
  },
  Moon: {
    func: "मनस् व भावनात्मक स्मृति (Emotional Memory & Manas)",
    trait: "Emotional processing style",
    cog: "Sensory integration, internal weather, subconscious comfort",
    strong: "Empathetic, intuitive, resilient emotional processing",
    weak: "Anxiety spirals, mood fluctuations, over-attachment to past",
  },
  Mars: {
    func: "प्रतिक्रिया व आक्रामकता (Reaction Impulse & Drive)",
    trait: "Stress response pattern",
    cog: "Fight-or-flight trigger, assertiveness, boundary enforcement",
    strong: "Courageous, proactive, constructive channel of frustration",
    weak: "Impulsive anger, chronic irritability, passive aggression",
  },
  Mercury: {
    func: "बुद्धि व तार्किक विश्लेषण (Cognitive Logic & Buddhi)",
    trait: "Cognitive processing style",
    cog: "Analytical reasoning, verbal architecture, information sorting",
    strong: "Sharp intellect, systems-thinking, articulate communicator",
    weak: "Overthinking, mental restlessness, nervous fatigue",
  },
  Jupiter: {
    func: "विवेक व मूल्य-प्रणाली (Belief System & Higher Wisdom)",
    trait: "Values and belief architecture",
    cog: "Framework of meaning, ethics, optimism, expansion drive",
    strong: "Wise, broad-minded, philosophically anchored, generative",
    weak: "Dogmatic rigidity, over-promising, unrealistic optimism",
  },
  Venus: {
    func: "सौंदर्य व संबंध-बोध (Bonding, Pleasure & Aesthetics)",
    trait: "Attachment & relational style",
    cog: "Harmonization, sensual pleasure, relational equilibrium",
    strong: "Warm, collaborative, emotionally generous, artistic sense",
    weak: "Codependency, conflict avoidance, hedonistic escapism",
  },
  Saturn: {
    func: "अनुशासन व आंतरिक आलोचक (Superego, Shadow & Duty)",
    trait: "Structure & reality-testing",
    cog: "Internal critic, long-term delay of gratification, endurance",
    strong: "Deeply patient, grounded, disciplined, resilient architect",
    weak: "Guilt, perfectionist paralysis, chronic pessimism, dread",
  },
  Rahu: {
    func: "महत्वाकांक्षा व अचेतन इच्छा (Unconscious Desire & Obsession)",
    trait: "Novelty & boundary-breaking drive",
    cog: "Hyper-focus, innovative hunger, hunger for worldly mastery",
    strong: "Visionary, unconventional thinker, technological mastery",
    weak: "FOMO, paranoid anxiety, imposter dread, illusionary chasing",
  },
  Ketu: {
    func: "चित्त व विरक्ति (Detachment, Intuition & Chitta)",
    trait: "Spiritual transcendence & pruning",
    cog: "Root cause analysis, detachment, psychic sixth sense",
    strong: "Deeply intuitive, philosophical detachment, spiritual clarity",
    weak: "Existential numbness, dissociation, cynical apathy",
  },
};

export function calculatePsychology(planets: Record<string, PD>): PsychResult {
  const pList: PsychPlanet[] = [];

  // Calculate planetary psychological strengths
  PLS.forEach((p, idx) => {
    const pd = planets[p];
    if (!pd) return;

    let strength = 60;
    if (pd.dignity === "Exalted") strength = 95;
    else if (pd.dignity === "Own") strength = 85;
    else if (pd.dignity === "Debilitated") strength = 35;
    else if (pd.dignity?.includes("Combust")) strength = 40;

    if ([1, 4, 7, 10].includes(pd.house)) strength += 8;
    if ([5, 9].includes(pd.house)) strength += 6;
    if ([6, 8, 12].includes(pd.house)) strength -= 10;
    strength = Math.max(20, Math.min(98, strength));

    const status: PsychPlanet["status"] =
      strength >= 75 ? "Strong" : strength >= 50 ? "Moderate" : "Weak/Blocked";
    const statusColor =
      status === "Strong" ? "#22c55e" : status === "Moderate" ? "#f59e0b" : "#ef4444";

    const meta = PSYCH_DATA[p] || {
      func: "Function",
      trait: "Trait",
      cog: "Cognitive",
      strong: "Healthy",
      weak: "Strained",
    };

    pList.push({
      planet: p,
      icon: PEMO[idx],
      color: PCOL[idx],
      func: meta.func,
      trait: meta.trait,
      cog: meta.cog,
      strong: meta.strong,
      weak: meta.weak,
      strength,
      status,
      statusColor,
      house: pd.house,
      sign: pd.sign,
      retrograde: pd.retrograde,
      dignity: pd.dignity || "Neutral",
    });
  });

  // 1. Classical Antahkarana Chatushtaya
  const moonP = pList.find((p) => p.planet === "Moon");
  const sunP = pList.find((p) => p.planet === "Sun");
  const mercP = pList.find((p) => p.planet === "Mercury");
  const jupP = pList.find((p) => p.planet === "Jupiter");
  const satP = pList.find((p) => p.planet === "Saturn");
  const ketuP = pList.find((p) => p.planet === "Ketu");

  const manasScore = moonP?.strength || 60;
  const buddhiScore = Math.round(((mercP?.strength || 60) + (jupP?.strength || 60)) / 2);
  const ahamkaraScore = sunP?.strength || 60;
  const chittaScore = Math.round(((satP?.strength || 60) + (ketuP?.strength || 60)) / 2);

  const antahkarana: AntahkaranaLayer[] = [
    {
      name: "Manas (मनस्)",
      hindiName: "मनस् — संवेदी व भावनात्मक केंद्र",
      governingPlanets: ["Moon (चंद्रमा)"],
      score: manasScore,
      functionDesc: "इंद्रियों से आने वाले संकेतों, संवेदनाओं और तात्कालिक भावनाओं का प्रसंस्करण केंद्र।",
      expressionStatus: manasScore >= 70 ? "Harmonious" : manasScore >= 45 ? "Hyperactive" : "Suppressed",
      insight: manasScore >= 70
        ? "भावनात्मक संतुलन दृढ़ है; तनावपूर्ण परिस्थितियों में भी मन शांत रहता है।"
        : "संवेदनाएं अत्यधिक संवेदनशील हैं; छोटी बातों पर विचारों की बाढ़ आ सकती है।",
    },
    {
      name: "Buddhi (बुद्धि)",
      hindiName: "बुद्धि — विवेक, निर्णय व तार्किक आर्किटेक्चर",
      governingPlanets: ["Mercury (बुध)", "Jupiter (बृहस्पति)"],
      score: buddhiScore,
      functionDesc: "तर्क, सूक्ष्म विश्लेषण, सही-गलत का विवेक और दीर्घकालिक रणनीतिक निर्णय।",
      expressionStatus: buddhiScore >= 70 ? "Harmonious" : "Hyperactive",
      insight: buddhiScore >= 70
        ? "असाधारण तार्किक क्षमता और रणनीतिक दूरदर्शिता; समस्याओं को भागों में तोड़कर हल करते हैं।"
        : "बुद्धि सक्रिय है, लेकिन कभी-कभी विश्लेषण में आवश्यकता से अधिक समय लग सकता है।",
    },
    {
      name: "Ahamkara (अहंकार)",
      hindiName: "अहंकार — आत्म-सम्मान, स्वाभिमान व पहचान",
      governingPlanets: ["Sun (सूर्य)"],
      score: ahamkaraScore,
      functionDesc: "स्वत्व की भावना, 'मैं कौन हूँ', आत्म-विश्वास और सामाजिक सीमाएं।",
      expressionStatus: ahamkaraScore >= 70 ? "Harmonious" : "Suppressed",
      insight: ahamkaraScore >= 70
        ? "स्वाभाविक नेतृत्व गरिमा और अखंड आत्म-सम्मान; किसी के अनुचित दबाव में नहीं झुकते।"
        : "आत्म-विश्वास को बाहरी मान्यता की आवश्यकता महसूस हो सकती है।",
    },
    {
      name: "Chitta (चित्त)",
      hindiName: "चित्त — अवचेतन स्मृतियां व संस्कार भंडार",
      governingPlanets: ["Saturn (शनि)", "Ketu (केतु)"],
      score: chittaScore,
      functionDesc: "अचेतन स्मृतियां, पूर्व-संस्कार, गहरा ध्यान और आत्मीय वैराग्य।",
      expressionStatus: chittaScore >= 65 ? "Harmonious" : "Suppressed",
      insight: "गहन एकाग्रता और डीप-वर्क की आंतरिक प्रयोगशाला; एकांत में कार्य करने पर सर्वोच्च शक्ति जागती है।",
    },
  ];

  // 2. Trigunas Distribution
  // Sattva: Sun, Moon, Jupiter
  // Rajas: Mercury, Venus
  // Tamas: Mars, Saturn, Rahu, Ketu
  const sattvaRaw = ((sunP?.strength || 50) + (moonP?.strength || 50) + (jupP?.strength || 50)) / 3;
  const rajasRaw = ((mercP?.strength || 50) + (pList.find(p=>p.planet==="Venus")?.strength || 50)) / 2;
  const tamasRaw = ((pList.find(p=>p.planet==="Mars")?.strength || 50) + (satP?.strength || 50) + (pList.find(p=>p.planet==="Rahu")?.strength || 50)) / 3;
  const sumGuna = sattvaRaw + rajasRaw + tamasRaw;

  const sattva = Math.round((sattvaRaw / sumGuna) * 100);
  const rajas = Math.round((rajasRaw / sumGuna) * 100);
  const tamas = 100 - sattva - rajas;

  const dominantGuna = sattva >= rajas && sattva >= tamas ? "Sattva" : rajas >= tamas ? "Rajas" : "Tamas";

  // 3. Modern Big Five (OCEAN)
  const bigFive: BigFiveScore[] = [
    {
      trait: "Openness to Experience",
      label: "जिज्ञासा व नवाचार (Openness)",
      score: Math.min(95, Math.round(((jupP?.strength || 60) + (mercP?.strength || 60)) / 2 + 5)),
      governingPlanets: "Jupiter + Mercury + Rahu",
      description: "जटिल सिद्धांतों, नए विचारों, सॉफ्टवेयर और दार्शनिक संभावनाओं के प्रति स्वाभाविक आकर्षण।",
    },
    {
      trait: "Conscientiousness",
      label: "अनुशासन व कर्तव्यनिष्ठा (Conscientiousness)",
      score: Math.min(95, Math.round(((satP?.strength || 60) + (sunP?.strength || 60)) / 2)),
      governingPlanets: "Saturn + Sun",
      description: "दायित्वों के प्रति गंभीरता, दीर्घकालिक लक्ष्यों पर अडिग रहना और कार्य में पूर्णतावाद।",
    },
    {
      trait: "Extraversion",
      label: "बहिर्मुखता व सामाजिक ऊर्जा (Extraversion)",
      score: Math.min(85, Math.round(((sunP?.strength || 60) + (pList.find(p=>p.planet==="Mars")?.strength || 50)) / 2 - 10)),
      governingPlanets: "Sun + Mars",
      description: "चयनात्मक सामाजिक उपस्थिति; व्यर्थ भीड़ के बजाय चुनिंदा बौद्धिक संपर्कों को प्राथमिकता।",
    },
    {
      trait: "Agreeableness",
      label: "सौहार्द व सहयोगिता (Agreeableness)",
      score: Math.min(90, Math.round(((pList.find(p=>p.planet==="Venus")?.strength || 60) + (moonP?.strength || 60)) / 2)),
      governingPlanets: "Venus + Moon",
      description: "गहरी सहानुभूति और आंतरिक गरिमा, लेकिन अपने सिद्धांतों से समझौता न करने की दृढ़ता।",
    },
    {
      trait: "Neuroticism",
      label: "संवेगात्मक अस्थिरता (Emotional Reactivity)",
      score: Math.max(25, Math.min(80, Math.round(100 - ((moonP?.strength || 60) + (satP?.strength || 60)) / 2))),
      governingPlanets: "Moon (Afflicted) + Rahu",
      description: "मानसिक दबाव के समय आंतरिक बेचैनी या अत्यधिक विश्लेषण की संभावना; मौन व ध्यान से संतुलित।",
    },
  ];

  // 4. Cognitive Distortions Bank & CBT Reframing
  const cognitiveDistortions: CognitiveDistortionItem[] = [
    {
      distortion: "Catastrophizing (आशंकाओं का पहाड़ बनाना)",
      planet: "Rahu",
      triggerContext: "भविष्य की अनिश्चितता या वित्तीय निर्णयों के समय सबसे बुरे परिदृश्य की निरंतर कल्पना।",
      cbtReframe: "तथ्यों और भावनाओं को अलग करें: 'क्या यह एक वास्तविक साक्ष्य है या केवल राहु की बनाई मानसिक संभावना?' वर्तमान के नियंत्रण-योग्य कार्यों पर ध्यान लौटाएं।",
    },
    {
      distortion: "Perfectionism & Analysis Paralysis (अति-पूर्णतावाद)",
      planet: "Saturn / Mercury",
      triggerContext: "जब तक सब कुछ 100% सही न हो, तब तक काम को रोके रखना या अतिरिक्त समय लगाना।",
      cbtReframe: "'सफलता परफेक्शन में नहीं, निरंतर पुनरावृत्ति (Iteration) में है।' 80% गुणवत्ता पर रिलीज़ करें और फीडबैक के आधार पर सुधारें।",
    },
    {
      distortion: "Impulsive Reactivity (तात्कालिक आवेश)",
      planet: pList.find((p) => p.planet === "Mars")?.house ? `Mars in ${pList.find((p) => p.planet === "Mars")?.house}H` : "Mars",
      triggerContext: "नींद की कमी या कार्यभार के समय दूसरों की छोटी गलतियों पर तुरंत तीखी प्रतिक्रिया।",
      cbtReframe: "5-सेकंड का मौन नियम: प्रतिक्रिया देने से पहले 3 गहरी सांसें लें और निर्णय को अगले दिन तक स्थगित रखें।",
    },
  ];

  // 5. Circadian Focus Peak
  const moonHouse = moonP?.house || 1;
  const marsData = pList.find((p) => p.planet === "Mars");
  const isNightOwl = moonHouse === 12 || (marsData && marsData.house === 12);
  const circadianPeak = {
    peakFocusWindow: isNightOwl
      ? "रात्रि 10:00 PM से 1:30 AM अथवा प्रातः 5:30 AM से 8:30 AM"
      : "प्रातः 6:30 AM से 10:00 AM अथवा सायंकाल 4:30 PM से 7:30 PM",
    dopamineResetWindow: "दोपहर 2:00 PM से 4:00 PM (न्यूनतम मानसिक मांग का समय)",
    cognitiveInsight: isNightOwl
      ? `आपकी जन्मकुंडली में भाव 12 (एकांत) और बुध की स्थिति यह दर्शाती है कि जब बाहरी दुनिया शांत होती है, तब आपका संज्ञानात्मक इंजन चरम फोकस पर काम करता है।`
      : `आपकी जन्मकुंडली में चंद्रमा (भाव ${moonHouse}) और बुध (भाव ${mercP?.house || 1}) की स्थिति यह दर्शाती है कि शांत वातावरण में आपका संज्ञानात्मक फोकस अपने चरम पर काम करता है।`,
  };

  // 6. Novelistic Storytelling Prose
  const storytellingProse = [
    `आपका मानस पटल किसी साधारण इंसान की तरह सतही प्रतिक्रियाओं से नहीं चलता। आपकी चेतना के केंद्र में 'अन्तःकरण चतुष्टय' की एक बहुत ही सूक्ष्म और परिष्कृत प्रयोगशाला स्थापित है। जहाँ आम लोग किसी समस्या को देखकर घबरा जाते हैं, वहाँ आपकी बुद्धि तुरंत उस जटिल समस्या को छोटे-छोटे तार्किक हिस्सों में बांटकर उसका सबसे अनुकूल समाधान खोजने में जुट जाती है।`,
    `लेकिन इस तीव्र बुद्धिमत्ता की अपनी एक संवेदी कीमत भी है। आपके भीतर विचारों की एक निरंतर धारा बहती रहती है। जब आपका दिमाग किसी काम में पूरी तरह डूब जाता है, तो वह समय की सीमाओं को भूल जाता है। इसका दूसरा पहलू यह है कि यदि काम में अप्रत्याशित देरी या रुकावट आए, तो आपका आंतरिक आलोचक (Saturnian Superego) तुरंत सक्रिय होकर आपके ऊपर अत्यधिक दबाव बनाने लगता है।`,
    `आपका सबसे बड़ा मानसिक वरदान आपका 'एकांत का डीप-वर्क' है। जब आप बाहर के शोर से कटकर अपनी शर्तों पर सिस्टम्स, कोड या रणनीतियों का निर्माण करते हैं, तो आपकी चेतना एक समाधि-तुल्य अवस्था में पहुंच जाती है। बस एक बात का ध्यान रखें: अपने दिमाग को कभी-कभी पूरी तरह खाली होने और विश्राम करने का अधिकार भी दें।`,
  ];

  // 7. Dynamic Cognitive Archetype resolution
  const faculties = [
    { name: "Buddhi", score: buddhiScore, label: "Buddhi (Analytical Architecture)", archetype: "The Systems Architect & Analytical Strategist", desc: "गहन तार्किक बुद्धि, स्वतंत्र निर्णय क्षमता और सुव्यवस्थित सिस्टम्स रचने की शक्ति।" },
    { name: "Ahamkara", score: ahamkaraScore, label: "Ahamkara (Autonomous Self-Respect)", archetype: "The Sovereign Leader & Visionary Pioneer", desc: "अडिग आत्म-सम्मान, स्वाभाविक नेतृत्व गरिमा और अपनी शर्तों पर दुनिया जीतने का तेज।" },
    { name: "Manas", score: manasScore, label: "Manas (Empathic Intuition)", archetype: "The Intuitive Synthesizer & Empathic Creator", desc: "गहरा अंतर्ज्ञान, संवेगात्मक सूक्ष्मता और जन-मानस की भावनाओं को भांपने की शक्ति।" },
    { name: "Chitta", score: chittaScore, label: "Chitta (Subconscious Focus)", archetype: "The Deep Contemplative & Transformational Researcher", desc: "गहन एकाग्रता, गूढ़ रहस्यों का अनुसंधान और एकांत में उत्कृष्ट कार्य की सिद्धि।" },
  ].sort((a, b) => b.score - a.score);

  const topFaculty = faculties[0];
  const dominantFunctions = faculties.slice(0, 3).map((f) => f.label);

  return {
    planets: pList,
    pattern: {
      name: topFaculty.archetype,
      desc: topFaculty.desc,
      shadow: "अत्यधिक विश्लेषण, भविष्य की अनिश्चितता की गुप्त चिंता और पूर्णतावाद।",
      anxietyIdx: Math.round(100 - manasScore * 0.7),
      karmaLoop: Math.round(chittaScore * 0.8),
      behavBias: 68,
      radarVals: [
        Math.round(100 - manasScore * 0.7),
        Math.round(chittaScore * 0.8),
        68,
        buddhiScore,
        jupP?.strength || 75,
        pList.find((p) => p.planet === "Venus")?.strength || 70,
      ],
    },
    dominantFunctions,
    riskFlags: [
      {
        title: "Analysis Paralysis (अति-विश्लेषण)",
        detail: "किसी निर्णय के हर सूक्ष्म पहलू को सही करने के चक्कर में ऊर्जा व्यय होना।",
        severity: "medium",
      },
      {
        title: "Sleep Disruption (रात्रि में विचारों का वेग)",
        detail: "देर रात तक स्क्रीन पर काम करने से नींद की गहराई प्रभावित हो सकती है।",
        severity: "high",
      },
    ],
    stabilizers: [
      "दैनिक 15 मिनट का मौन ध्यान अथवा शांत टहलना",
      "कार्यों को 'डन इज़ बेटर दैन परफेक्ट' के नियम से समय पर पूरा करना",
      "चांदी के पात्र में जल पीना और सोमवार को शिव ध्यान",
    ],
    growthPlan: [
      "अपने 80% बेहतरीन काम को तुरंत बाहर लाएं; फीडबैक से सुधारें।",
      "किसी भी भावनात्मक तनाव की स्थिति में 5 सेकंड का मौन नियम लागू करें।",
      "सप्ताह में एक दिन डिजिटल डिटॉक्स (कम स्क्रीन समय) रखें।",
    ],
    summary: `आपकी मानसिक संरचना '${topFaculty.archetype}' की है, जिसे अपने आंतरिक आलोचक को शांत कर विश्राम और संतुलन को समय देना सीखना है।`,
    antahkarana,
    trigunas: {
      sattva,
      rajas,
      tamas,
      dominantGuna,
      description: `${dominantGuna} गुण प्रधान है — यह विवेक, स्पष्टता और सृजनशीलता का संकेत है।`,
    },
    bigFive,
    cognitiveDistortions,
    circadianPeak,
    storytellingProse,
  };
}
