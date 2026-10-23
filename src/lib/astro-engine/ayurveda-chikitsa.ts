// ============================================================
// AYURVEDIC DAIVA VYAPASHRAYA CHIKITSA & SHASTRIYA PROTOCOLS
// Academic Baseline: "आयुर्वेद एवं ज्योतिषशास्त्रीy सिद्धान्तों की अन्तर्सम्बन्धीय मीमांसा"
// Author: Prof. Jaiprakash Narayan Dwivedi (AYU Journal, Vol 34, 2013)
// Sources: Charaka Samhita, Sushruta Samhita, Kashyapa Samhita, Saravali, Uttara Kalamrita
// ============================================================

export interface PlanetarySnanAushadhi {
  planet: string;
  primaryHerb: string;
  hindiName: string;
  botanicalSanskrit: string;
  preparationMethod: string;
  therapeuticBenefit: string;
}

export interface PlanetaryDaanKaal {
  planet: string;
  auspiciousTiming: string;
  ghatiDescription: string;
  daanItems: string[];
  dakshina: string;
  japaCount: number;
  vedicMantra: string;
  targetAilments: string;
}

export interface VyadhiPrognosis {
  classification: "Sadhya" | "Yapya" | "Asadhya (Pratyakhyeya)";
  hindiTitle: string;
  charakaReference: string;
  prognosticCriteria: string;
  clinicalManagementAdvice: string;
}

// ── 9 Planets Herbal Bath Formulations (Snano-Aushadhi - AYU p. 32) ───────
export const PLANETARY_SNAN_AUSHADHI: Record<string, PlanetarySnanAushadhi> = {
  Sun: {
    planet: "Sun",
    primaryHerb: "Lajwanti (Mimosa pudica)",
    hindiName: "लाजवंती / छुईमुई",
    botanicalSanskrit: "लज्जावती (Lajjāvatī)",
    preparationMethod: "Infuse crushed Lajwanti leaves in warm bath water during Sunday morning sunrise.",
    therapeuticBenefit: "Pacifies Sun-induced fever, cranial heat, eye fatigue, and promotes metabolic Ojas.",
  },
  Moon: {
    planet: "Moon",
    primaryHerb: "Kustha (Saussurea lappa)",
    hindiName: "कुष्ठ / कूठ",
    botanicalSanskrit: "कुष्ठ (Kuṣṭha)",
    preparationMethod: "Steep fragrant Kustha root powder in bath water; best used on Monday evening.",
    therapeuticBenefit: "Soothes lymphatic congestion, emotional restlessness, psychosomatic chills, and skin dryness.",
  },
  Mars: {
    planet: "Mars",
    primaryHerb: "Bariyar / Atibala (Abutilon indicum)",
    hindiName: "बरियार / खिरेंटी",
    botanicalSanskrit: "बरियार / अतिबला (Bariyāra / Atibalā)",
    preparationMethod: "Decoct Bariyar roots in warm water; use on Tuesday morning.",
    therapeuticBenefit: "Subdues Pitta blood heat, muscle spasms, boils, and physical exhaustion.",
  },
  Mercury: {
    planet: "Mercury",
    primaryHerb: "Malkangni (Celastrus paniculatus)",
    hindiName: "मालकांगनी / ज्योतिष्मती",
    botanicalSanskrit: "मालकांगुनी (Mālakāṅgunī)",
    preparationMethod: "Add a few drops of Malkangni seed extract or infusion into morning bath on Wednesday.",
    therapeuticBenefit: "Calms nervous tremors, sharpens cognitive memory, and clears bronchial pathways.",
  },
  Jupiter: {
    planet: "Jupiter",
    primaryHerb: "Nagarmotha (Cyperus rotundus)",
    hindiName: "नागरमोथा",
    botanicalSanskrit: "मोथा (Mothā / Mustā)",
    preparationMethod: "Soak dried Musta rhizomes overnight and mix in Thursday bath water.",
    therapeuticBenefit: "Stimulates sluggish liver metabolism (Mandagni), clears spleen stagnation, and grounds anxiety.",
  },
  Venus: {
    planet: "Venus",
    primaryHerb: "White Mustard Seeds (Brassica alba)",
    hindiName: "पीली/सफेद सरसों",
    botanicalSanskrit: "सर्षप (Sarṣapa)",
    preparationMethod: "Infuse crushed Sarshapa seeds in warm water on Friday morning.",
    therapeuticBenefit: "Relieves reproductive-urinary sluggishness, dermal irritation, and enhances skin barrier radiance.",
  },
  Saturn: {
    planet: "Saturn",
    primaryHerb: "Devdaru & Turmeric (Cedrus deodara & Curcuma longa)",
    hindiName: "देवदारू एवं हल्दी",
    botanicalSanskrit: "देवदारु / हरिद्रा (Devadāru / Haridrā)",
    preparationMethod: "Boil Devdaru bark with wild turmeric (Amba Haldi); bathe on Saturday afternoon.",
    therapeuticBenefit: "Alleviates chronic joint stiffness, sciatica, dry Vata skin, and neuro-muscular pain.",
  },
  Rahu: {
    planet: "Rahu",
    primaryHerb: "Sharpunkha (Tephrosia purpurea)",
    hindiName: "शरपूंखा / सरफोंका",
    botanicalSanskrit: "शरपुंखा (Śarapuṅkhā)",
    preparationMethod: "Boil Sharpunkha whole herb in water; bathe in evening twilight.",
    therapeuticBenefit: "Detoxifies sluggish lymphatic chyle, clears mystery skin irritations, and dispels toxic heaviness.",
  },
  Ketu: {
    planet: "Ketu",
    primaryHerb: "Lodhra (Symplocos racemosa)",
    hindiName: "लोध्र / लोध",
    botanicalSanskrit: "लोध्र (Lodhra)",
    preparationMethod: "Steep astringent Lodhra bark powder in lukewarm bath water on Tuesday or Thursday.",
    therapeuticBenefit: "Soothes internal mucosal inflammation, stops chronic oozing/wounds, and restores subtle vitality.",
  },
};

// ── Astrological Daan Kaal (Auspicious Planetary Charity Windows - AYU p. 32) ──
export const PLANETARY_DAAN_KAAL: Record<string, PlanetaryDaanKaal> = {
  Sun: {
    planet: "Sun",
    auspiciousTiming: "Sunrise (सूर्योदय काल)",
    ghatiDescription: "During the first hour of sunrise on Sunday.",
    daanItems: ["Wheat (गेहूं)", "Jaggery (गुड़)", "Copper vessel (तांबा)", "Ruby/Garnet", "Red cloth"],
    dakshina: "Dhenu / Red ox (गाय/लाल बैल)",
    japaCount: 7000,
    vedicMantra: "ॐ आकृष्णेन रजसा वर्तमानो निवेशयन्नमृतं मर्त्यं च। हिरण्ययेन सविता रथेना देवो याति भुवनानि पश्यन्॥",
    targetAilments: "Heart fatigue, bone weakness, fever, eye disorders, and low constitutional vitality.",
  },
  Moon: {
    planet: "Moon",
    auspiciousTiming: "Evening Twilight / Dusk (संध्या काल)",
    ghatiDescription: "During dusk (Sayankal) when the Moon gains directional strength.",
    daanItems: ["Rice (चावल)", "Milk/Ghee", "White silver (चांदी)", "Pearl", "White cloth"],
    dakshina: "Shankha / White heifer (शंख / श्वेत गाय)",
    japaCount: 11000,
    vedicMantra: "ॐ इमं देवा असपत्नं सुवध्वं महते क्षत्राय महते ज्येष्ठाय महते जानराज्यायेन्द्रस्येन्द्रियाय॥",
    targetAilments: "Psychosomatic insomnia, fluid retention, depression, mental melancholy, and digestive mucus.",
  },
  Mars: {
    planet: "Mars",
    auspiciousTiming: "2 Ghatis after sunrise (~48 mins after sunrise)",
    ghatiDescription: "Early morning around 45-50 minutes post-dawn on Tuesday.",
    daanItems: ["Red lentils (मसूर दाल)", "Copper (तांबा)", "Red coral", "Jaggery", "Red cloth"],
    dakshina: "Red ox / Gold coin (रक्तवृषभ)",
    japaCount: 7000,
    vedicMantra: "ॐ अग्निर्मूर्धा दिवः ककुत्पतिः पृथिव्या अयम्। अपां रेतांसि जिन्वति॥",
    targetAilments: "Blood disorders, surgery recovery, acute inflammatory fevers, boils, and muscular injuries.",
  },
  Mercury: {
    planet: "Mercury",
    auspiciousTiming: "5 Ghatis into the day (~2 hours after sunrise)",
    ghatiDescription: "Mid-morning around 2 hours past sunrise on Wednesday.",
    daanItems: ["Whole green gram (साबुत मूंग)", "Bronze vessel (कांसा)", "Emerald", "Green cloth", "Books/Knowledge"],
    dakshina: "Elephant tusk item or Bronze coins",
    japaCount: 17000,
    vedicMantra: "ॐ उद्बुध्यस्वाग्ने प्रतिजागृहि त्वमिष्टापूर्ते सं सृजेथामयं च। अस्मिन्त्सधस्थे अध्युत्तरस्मिन् विश्वे देवा यजमानश्च सीदत॥",
    targetAilments: "Nervous exhaustion, speech stammering, gut-brain IBS, bronchial asthma, and skin eczema.",
  },
  Jupiter: {
    planet: "Jupiter",
    auspiciousTiming: "Morning / Pre-Noon (पूर्वाह्न काल)",
    ghatiDescription: "Between 9:00 AM and 11:30 AM on Thursday.",
    daanItems: ["Chana dal (चना दाल)", "Turmeric (हल्दी)", "Yellow sapphire/Citrine", "Gold/Brass", "Yellow cloth"],
    dakshina: "Gold / Scripture donation to learned scholars",
    japaCount: 19000,
    vedicMantra: "ॐ बृहस्पते अति यदर्यो अर्हाद् द्युमद्विभाति क्रतुमज्जनेषु। यद्दीदयच्छवस ऋतप्रजात तदस्मासु द्रविणं धेहि चित्रम्॥",
    targetAilments: "Liver sluggishness, lipid metabolism imbalances, obesity, pancreatic insulin strain, and joint stiffness.",
  },
  Venus: {
    planet: "Venus",
    auspiciousTiming: "Sunrise (सूर्योदय काल)",
    ghatiDescription: "At early dawn on Friday when Shukra is radiant in the horizon.",
    daanItems: ["White sugar/Misri", "Ghee", "Curd", "Diamond/Opal", "Silver/Silk cloth"],
    dakshina: "White horse / White cow service",
    japaCount: 21000,
    vedicMantra: "ॐ अन्नात्परिस्रुतो रसं ब्रह्मणा व्यपिबत्क्षत्रं पयः सोमं प्रजापतिः। ऋतेन सत्यमिन्द्रियं विपानं शुक्रमन्धस इन्द्रस्येन्द्रियमिदं पयोऽमृतं मधु॥",
    targetAilments: "Kidney filtration weakness, reproductive hormonal shifts, ocular dryness, and urinary acidity.",
  },
  Saturn: {
    planet: "Saturn",
    auspiciousTiming: "Midday / Noon (मध्याह्न काल)",
    ghatiDescription: "Precisely at local solar noon on Saturday (Shani rules the shadow at zenith).",
    daanItems: ["Black sesame (काले तिल)", "Mustard oil (सरसों का तेल)", "Iron pan/tava (लोहा)", "Blue sapphire/Amethyst", "Black blanket"],
    dakshina: "Black cow / Iron cookware / Footwear to laborers",
    japaCount: 23000,
    vedicMantra: "ॐ शं नो देवीरभिष्टय आपो भवन्तु पीतये। शं योरभिस्रवन्तु नः॥",
    targetAilments: "Chronic arthritis, sciatica, chronic fatigue, bone loss, knee wear, and prolonged degenerative illnesses.",
  },
  Rahu: {
    planet: "Rahu",
    auspiciousTiming: "Night (रात्रि काल)",
    ghatiDescription: "After sunset during nighttime on Saturday or Wednesday.",
    daanItems: ["Hessonite/Gomed", "Mustard oil", "Blue/Black cloth", "Blankets", "Dry coconut (सूखा नारियल)"],
    dakshina: "Dark blankets and food to marginalized persons",
    japaCount: 18000,
    vedicMantra: "ॐ कया नश्चित्र आ भुवदूती सदावृधः सखा। कया शचिष्ठया वृता॥",
    targetAilments: "Environmental allergies, unexplained ailments, respiratory toxins, lung debility, and toxic loops.",
  },
  Ketu: {
    planet: "Ketu",
    auspiciousTiming: "Night / Early Dawn (निशा काल / ब्रह्म मुहूर्त)",
    ghatiDescription: "During pre-dawn Brahma Muhurta or late evening on Tuesday.",
    daanItems: ["Cat's eye stone (लहसुनिया)", "Seven grains (सप्तधान्य)", "Black and white sesame", "Woolen blanket"],
    dakshina: "Feeding street dogs / Blankets to ascetics",
    japaCount: 18000,
    vedicMantra: "ॐ केतुं कृण्वन्नकेतवे पेशो मर्या अपेशसे। समुषद्भिरजायथाः॥",
    targetAilments: "Subtle viral post-exhaustion, pelvic hidden inflammation, mysterious nerve prickling, and surgical scars.",
  },
};

// ── Classical Disease Prognosis Helper (Charaka Samhita Sutrasthana 10) ────
export function evaluateAyurvedicPrognosis(
  riskLevel: "low" | "moderate" | "high",
  ojasScore: number,
  isJeerna: boolean
): VyadhiPrognosis {
  if (riskLevel === "low" && ojasScore >= 75) {
    return {
      classification: "Sadhya",
      hindiTitle: "सुखसाध्य (Easily Reversible / Responsive)",
      charakaReference: "चरकसंहिता सूत्रस्थान 10/11 — दोष अल्प, शरीर बलवान, ऋतु अनुकूल होने पर व्याधि सुखसाध्य होती है।",
      prognosticCriteria: "Constitutional Ojas is strong; single dosha involvement without multi-dhatu chronicity.",
      clinicalManagementAdvice: "Simple dietary adjustments, restorative sleep, and preventive hydration suffice to restore balance.",
    };
  } else if (riskLevel === "high" || isJeerna || ojasScore < 50) {
    return {
      classification: "Yapya",
      hindiTitle: "याप्य (Manageable with Sustained Regimen)",
      charakaReference: "चरकसंहिता सूत्रस्थान 10/17-18 — शेषत्वादायुषो याप्यं... गम्भीरं बहुधातुस्थं मर्मसन्धिं समाश्रितम्।",
      prognosticCriteria: "Deep multi-dhatu involvement or active dusthana dasha. Requires continuous lifestyle and clinical vigilance.",
      clinicalManagementAdvice: "Requires dedicated daily lifestyle adherence, periodic medical screenings, and avoidance of sudden exertion.",
    };
  }

  return {
    classification: "Yapya",
    hindiTitle: "कष्टसाध्य (Treatable with Discipline)",
    charakaReference: "चरकसंहिता सूत्रस्थान 10/14 — शस्त्रक्षारादिसाध्यश्च कष्टसाध्यो विधीयते।",
    prognosticCriteria: "Dual dosha involvement with moderate resilience. Receptive to disciplined Ayurvedic and medical interventions.",
    clinicalManagementAdvice: "Prioritize seasonal detox, avoid dietary extremes, and address recurring symptoms early.",
  };
}
