// ============================================================
// ASTROLIFE MEDICAL ASTROLOGY ENGINE v3.0
// Comprehensive Ayurvedic & Classical Parashari Medical Intelligence
// Foundations: Dr. S. Krishna Kumar, BPHS, Charaka Samhita, Saravali
// Features: Tri-Fold (Bhava-Bhavesh-Karaka), Parashari Aspects,
//           Algorithmic Tri-Dosha & Agni, Ojas Resilience Index,
//           D6 Shasthamsa Cross-Verification, Safe Tone Guardrails
// ============================================================

import { type ChartData, computePlanets, getJD } from "./calculations";
import { getCurrentDashaHierarchy5Levels, getNakshatraFromLongitude, NAVTARA } from "./dasha";
import {
  PLANETARY_SNAN_AUSHADHI,
  PLANETARY_DAAN_KAAL,
  evaluateAyurvedicPrognosis,
  type PlanetarySnanAushadhi,
  type PlanetaryDaanKaal,
  type VyadhiPrognosis,
} from "./ayurveda-chikitsa";
import {
  FAMILY_RELATIONSHIPS,
  calculateDerivedHouses,
  scanFamilyMemberHealth,
  scanFutureHealthWindows,
  type FamilyMemberKey,
  type FamilyMedicalScanResult,
  type FutureHealthWindow,
} from "./medical-relationship";
import {
  MASTER_MEDICAL_RULES,
  type MasterMedicalRule,
} from "./medical-rules-kb";

// Re-export modules for consumers
export * from "./ayurveda-chikitsa";
export * from "./medical-relationship";
export * from "./medical-rules-kb";

// ── Types & Contracts ──────────────────────────────────────────────────


export interface TridoshaBreakdown {
  vata: number; // Percentage 0-100
  pitta: number; // Percentage 0-100
  kapha: number; // Percentage 0-100
  dominant: string; // e.g. "Vata-Pitta", "Pitta", "Tridoshic (Sama)"
  constitutionType: "Mono-Dosha" | "Dual-Dosha" | "Sama-Dosha (Tridoshic)";
  lifestyleGuidance: string;
  dietaryGuidance: string[];
}

export interface AgniProfile {
  type: "Vishamagni" | "Tikshnagni" | "Mandagni" | "Samagni";
  sanskrit: string;
  title: string;
  tendency: string;
  balancingProtocol: string;
}

export interface DhatuAffliction {
  dhatu: "Rasa" | "Rakta" | "Mamsa" | "Meda" | "Asthi" | "Majja" | "Shukra";
  sanskritName: string;
  tissueSystem: string;
  governingPlanet: string;
  status: "Balanced" | "Moderate Vulnerability" | "High Vulnerability";
  indicators: string;
}

export interface DiseaseCombination {
  disease: string; // Traditional disease title (e.g. "Tuberculosis / Rajyakshma (Deep Pulmonary & Respiratory Sensitivity)")
  classicalCitation: string; // Text source (Dr. S. Krishna Kumar Ch. 19 / BPHS)
  safeToneGuidance: string; // Non-fatalistic, empathetic clinical guidance
  note: string; // Combined summary for backward compatibility
  severity: "low" | "medium" | "high";
  participatingPlanets: string[];
}

export interface PlanetHealthCard {
  planet: string;
  house: number;
  sign: string;
  nakshatra: string;
  pada: number;
  retrograde: boolean;
  isCombust: boolean;
  dignity: string;
  inDusthana: boolean;
  isHouseLordOf: number[];
  aspectingHouses: number[];
  tridosha: string;
  funcNature: "benefic" | "malefic" | "neutral";
  houseNote: string;
  nakshatraDisease: string;
  nakshatraBody: string;
  boilZone: string;
  nakUpay: string;
  d6Sign?: string;
}

export interface HouseLordInfo {
  house: number;
  sign: string;
  lord: string;
  placedInHouse: number;
  placedInSign: string;
  isDusthanaLord: boolean;
  isAfflicted: boolean;
}

export interface MedicalResult {
  lagnaSign: string;
  prakriti: string;
  lagnaBodyZone: string;
  birthNakshatra: string;
  birthNakshatraData: { disease: string; body: string; note: string } | null;
  moonSign: string;
  moonSignDisease: string;
  birthNakshatraUpay: string;
  
  // Advanced Ayurvedic Metrics
  tridoshaBreakdown: TridoshaBreakdown;
  agniProfile: AgniProfile;
  ojasScore: number; // 0-100 Vitality & Constitutional Resilience
  ojasRating: "Robust Resilience" | "Moderate Vitality" | "Delicate Constitution";
  dhatuAfflictions: DhatuAffliction[];
  
  // Cards & Vulnerabilities
  planetCards: PlanetHealthCard[];
  houseLords: Record<number, HouseLordInfo>;
  healthScores: Record<string, number>;
  accidentScore: number;
  triggeredCombos: DiseaseCombination[];
  topConcerns: string[];
  riskLevel: "low" | "moderate" | "high";
  timingAlerts: {
    planet: string;
    level: "Mahadasha" | "Antardasha" | "Pratyantardasha";
    concern: string;
    severity: "low" | "medium" | "high";
    message: string;
  }[];
  majorEventIndicator: MajorEventIndicator;
  preventiveRoutine: string[];
  safeToneSummary: string[];

  // Traditional Ayurvedic Protocols from AYU Journal
  snanAushadhi: PlanetarySnanAushadhi;
  daanKaal: PlanetaryDaanKaal;
  ayurvedicPrognosis: VyadhiPrognosis;

  // Family & Relationship Health (Bhavat Bhavam)
  familyHealthOverview: Record<FamilyMemberKey, FamilyMedicalScanResult>;
  futureHealthWindows: FutureHealthWindow[];
}

export interface MajorEventIndicator {
  isMajorCandidate: boolean;
  level: "Extreme Major Crisis" | "Elevated Acute Warning" | "Moderate Sensitivity" | "Standard Baseline";
  score: number;
  convergingLayersCount: number;
  activeLayers: string[];
  reasons: string[];
  whyMajorExplanation: string;
}

// ── Classical Nakshatra Disease Mapping (Dr. S. Krishna Kumar) ───────────
export const NAKSHATRA_DISEASE_BOOK: Record<string, { disease: string; body: string; note: string }> = {
  Ashwini:            { disease: "Periodical fever / sudden temperature spikes",   body: "Head / Cerebral area",      note: "Ashwini Kumaras ruled — high metabolic speed, sudden fever tendency" },
  Bharani:            { disease: "Digestive & bowel elimination sensitivity",      body: "Head / Facial nerves",      note: "Yama ruled — elimination rhythm and digestive cleansing sensitivity" },
  Krittika:           { disease: "Metabolic heat, intestinal acidity & colic",     body: "Face / Neck / Thyroid",     note: "Agni ruled — intense metabolic fire; requires cooling balance" },
  Rohini:             { disease: "Ano-rectal & digestive heaviness / congestion",   body: "Face / Throat / Tonsils",   note: "Brahma ruled — Kapha heaviness; mucus and venous stagnation" },
  Mrigashira:         { disease: "Fluctuating digestion & throat vocal strain",    body: "Neck / Vocal cords",        note: "Chandra ruled — fluctuating appetite and sensitivity to seasonal chills" },
  Ardra:              { disease: "Mandagni / erratic digestion & respiratory chill",body: "Shoulders / Arms / Bronchi",note: "Rudra ruled — turbulent vata disrupts mucosal immunity" },
  Punarvasu:          { disease: "Fluid imbalance, bronchitis & water sensitivity",body: "Upper chest / Lungs",       note: "Aditi ruled — mucosal sensitivity, water-borne infection tendency" },
  Pushya:             { disease: "Appetite suppression & gastric heaviness",        body: "Mouth / Palate / Lungs",    note: "Brihaspati ruled — lymphatic and digestive absorption rhythm" },
  Ashlesha:           { disease: "Toxin accumulation, sluggish lymph & low vitality",body: "Ears / Nape of neck",    note: "Sarpa ruled — hepatic detoxification and lymphatic stagnation" },
  Magha:              { disease: "Bronchial sensitivity & upper spinal strain",    body: "Upper back / Heart / Chin", note: "Pitru ruled — ancestral respiratory and cardiovascular constitution" },
  "Purva Phalguni":   { disease: "Dry bronchial cough & blood heat",               body: "Right hand / Spine",        note: "Bhaga ruled — Pitta-driven chest and respiratory inflammation" },
  "Uttara Phalguni":  { disease: "Skin barrier fragility & dermal allergies",      body: "Left hand / Digestive tube",note: "Aryama ruled — sensitivity of epidermal and intestinal barriers" },
  Hasta:              { disease: "Blood sugar fluctuations & nervous gut (IBS)",   body: "Fingers / Hands / Colon",   note: "Savitru ruled — enteric nervous system and glucose metabolism" },
  Chitra:             { disease: "Giddiness, vestibular sensitivity & neural pain",body: "Forehead / Cervical neck",  note: "Twashtru ruled — vestibular balance and structural nerve alignment" },
  Swati:              { disease: "Ocular dryness, eye fatigue & vata imbalance",   body: "Chest / Heart region",      note: "Vayu ruled — dry ocular membranes and cardiac rhythm sensitivity" },
  Vishakha:           { disease: "Auditory & inner ear sensitivity",               body: "Lungs / Lower chest",       note: "Indra-Agni ruled — ear-nose-throat and respiratory inflammation" },
  Anuradha:           { disease: "Sinus congestion, rhinitis & nasal passages",    body: "Stomach / Epigastrium",     note: "Mitra ruled — mucosal membrane and sinus sensitivity" },
  Jyeshtha:           { disease: "Oral cavity, dental & vocal throat sensitivity", body: "Right abdomen / Hepatic",   note: "Indra ruled — oral, gingival and hepatic metabolic sensitivity" },
  Mula:               { disease: "Root degenerative fatigue & deep bone depletion",body: "Hips / Sacrum / Thighs",    note: "Nirriti ruled — structural bone marrow and cellular vitality depletion" },
  "Purva Ashadha":    { disease: "Renal calculi / urinary water retention",        body: "Back / Renal hips",         note: "Apas/Varuna ruled — renal filtration and mineral-fluid balance" },
  "Uttara Ashadha":   { disease: "Acid regurgitation & upper digestive reversal",  body: "Waist / Lower spine",       note: "Vishwa Devathas — diaphragm and gastric motility rhythm" },
  Shravana:           { disease: "Agnimandya / nutrient assimilation weakness",    body: "Genito-urinary / Knees",    note: "Vishnu ruled — intestinal assimilation and connective tissue health" },
  Dhanishtha:         { disease: "Vata neuralgia, joint stiffness & sprain risk",  body: "Ankles / Peripheral nerves",note: "Ashta Vasu ruled — neuro-muscular conduction and ankle stability" },
  Shatabhisha:        { disease: "Hepato-biliary congestion & pitta disorders",    body: "Calves / Circulatory",      note: "Varuna ruled — bile secretion and cellular fluid detox" },
  "Purva Bhadrapada": { disease: "Phlegmatic lymphatic congestion (Kapha)",       body: "Feet / Lower limbs",        note: "Aja Ekapada ruled — lower limb circulation and fluid retention" },
  "Uttara Bhadrapada":{ disease: "Exhaustion, plantar fatigue & foot sensitivity", body: "Soles / Plantar fascia",   note: "Ahirbudhnya ruled — recuperative sleep and chronic fatigue markers" },
  Revati:             { disease: "Dermal boils, wound healing & lymph reactivity", body: "Toes / Foot lymphatic",    note: "Pushan ruled — peripheral lymphatic response and skin recovery" },
};

// ── Classical Sign Disease Mapping with Safe Tone Interpretations ────────
export const SIGN_DISEASE: Record<string, string> = {
  Aries:       "Classical: Pitta fever & cephalic heat · Safe Tone: Tension headaches, cranial circulation, and acute inflammatory sensitivity.",
  Taurus:      "Classical: Tridosha vocal & throat sensitivity · Safe Tone: Thyroid health, vocal cord strain, and cervical neck stiffness.",
  Gemini:      "Classical: Vata respiratory & nervous strain · Safe Tone: Bronchial sensitivity, shoulder tension, and nervous fatigue.",
  Cancer:      "Classical: Psychosomatic fluid & digestive imbalance · Safe Tone: Gastric acid balance, hydration, and emotional-gut axis.",
  Leo:         "Classical: Cardiovascular vitality & spine pressure · Safe Tone: Heart rhythm health, spinal posture, and endurance pacing.",
  Virgo:       "Classical: Enteric sensitivity & digestive vulnerability · Safe Tone: Gut microbiome, intestinal absorption, and food intolerances.",
  Libra:       "Classical: Renal & lumbar balance · Safe Tone: Kidney filtration, lumbar spine alignment, and metabolic fluid equilibrium.",
  Scorpio:     "Classical: Pelvic, excretory & regenerative sensitivity · Safe Tone: Excretory health, hormonal vitality, and pelvic circulation.",
  Sagittarius: "Classical: Hepato-biliary & sciatic nerve sensitivity · Safe Tone: Liver lipid metabolism, hip mobility, and sciatic comfort.",
  Capricorn:   "Classical: Vata structural stiffness & skeletal wear · Safe Tone: Bone density, knee joint lubrication, and skin hydration.",
  Aquarius:    "Classical: Peripheral circulation & pulmonary vata · Safe Tone: Venous return, shin/ankle stability, and respiratory pacing.",
  Pisces:      "Classical: Lymphatic congestion & immune sensitivity · Safe Tone: Plantar foot comfort, lymphatic detoxification, and restorative sleep.",
};

// ── Kaal Purusha Body Mapping ──────────────────────────────────────────
export const SIGN_BODY: Record<string, string> = {
  Aries:       "Head / Cranium / Brain / Facial nerves",
  Taurus:      "Face / Throat / Vocal cords / Thyroid",
  Gemini:      "Shoulders / Arms / Bronchi / Respiratory nerves",
  Cancer:      "Chest / Breasts / Epigastric stomach / Fluids",
  Leo:         "Heart / Upper spine / Thoracic aorta / Vitality",
  Virgo:       "Intestines / Digestive enzymes / Abdominal flora",
  Libra:       "Kidneys / Lower back / Lumbar plexus / Skin barrier",
  Scorpio:     "Reproductive organs / Excretory colon / Pelvic floor",
  Sagittarius: "Hips / Thighs / Hepatic system / Sciatic nerve",
  Capricorn:   "Bones / Knees / Skeletal structure / Joints",
  Aquarius:    "Calves / Ankles / Venous circulation / Motor nerves",
  Pisces:      "Feet / Lymphatic vessels / Immune defenses / Pineal",
};

// ── Planet Boil / Inflammation Zones (Section 19J) ──────────────────────
export const PLANET_BOIL: Record<string, string> = {
  Sun: "Head and scalp region",
  Moon: "Face, cheeks, and neck",
  Mars: "Neck, throat, and cervical area",
  Mercury: "Navel and epigastric zone",
  Jupiter: "Nose, sinuses, and liver zone",
  Venus: "Eyes and genito-urinary zone",
  Saturn: "Legs, shins, and knee joints",
  Rahu: "Navel, solar plexus, and lower abdomen",
  Ketu: "Pelvic floor, perineum, and feet",
};

// ── Classical Planet × House Disease Context ────────────────────────────
export const PLANET_HOUSE_DISEASE: Record<string, Record<number, string>> = {
  Sun: {
    1: "High vitality, but watch cranial heat, blood pressure spikes, and eye strain.",
    2: "Right eye sensitivity, dental bone maintenance, and throat heat.",
    3: "Shoulder strength, arm strain from exertion, upper respiratory wellness.",
    4: "Cardiovascular pacing, thoracic spine posture, and mother's health reflection.",
    5: "Strong digestive Agni; monitor acid reflux and abdominal heat.",
    6: "Strong disease-fighting vitality (Shatru-Vijay); watch bilious fever under stress.",
    7: "Renal and pelvic heat balance; relationship tension impacts blood pressure.",
    8: "Sudden vitality dips; protect stamina and avoid long sun exposure during heatwaves.",
    9: "Hip joints and arterial circulation; liver vitality balance.",
    10: "High stamina for career pressure; monitor knee strain from prolonged standing.",
    11: "Left ear sensitivity, peripheral circulation, and arterial health.",
    12: "Left eye weakness, sleep depth variations, and metabolic recovery during travel.",
  },
  Moon: {
    1: "Psychosomatic sensitivity, lymphatic fluid balance, and emotional eating cues.",
    2: "Oral cavity, taste sensitivity, and facial fluid retention.",
    3: "Respiratory cold/chill sensitivity; keep throat and lungs protected in cold weather.",
    4: "Thoracic comfort, breast health, emotional security directly regulating digestion.",
    5: "Sensitive gastric mucosa, emotional nausea, and biliary-pancreatic rhythm.",
    6: "Sinus congestion, rhinitis tendency, and digestive sluggishness under worry.",
    7: "Urinary tract hydration and reproductive fluid balance.",
    8: "Hormonal cycles, menstrual regularity, and deep subconscious emotional tension.",
    9: "Hip flexibility and lymphatic drainage in lower limbs.",
    10: "Skin sensitivity from public exposure and occupational stress impacting sleep.",
    11: "Left ear fluid balance and venous circulation in lower legs.",
    12: "Left eye sensitivity, dream-state sleep disruptions, and lymphatic stagnation.",
  },
  Mars: {
    1: "Acute cranial heat, accident/burn sensitivity, sharp vitality spikes, facial scars.",
    2: "Dental inflammation, spicy food sensitivity, and vocal strain.",
    3: "Shoulder and collarbone injury risk, muscular sprains, sharp reflex speed.",
    4: "Chest muscular inflammation, rib bruising sensitivity, and home safety focus.",
    5: "High digestive Pitta, abdominal muscular tension, and hyperacidity.",
    6: "Supreme disease-combating capacity (Upachaya H6 Mars); watch surgical/sharp wound risk.",
    7: "Pelvic inflammatory response, blood pressure surges under confrontation.",
    8: "Surgery, acute trauma, and blood vessel sensitivity; caution with speed and tools.",
    9: "Hip/pelvic tendon strain and sports impact caution.",
    10: "Patellar/knee impact sensitivity; work safety with heavy machinery.",
    11: "Calf muscle cramps, arterial circulation, and blood composition balance.",
    12: "Foot/ankle inflammation, sleep disruption from internal heat, hospital care history.",
  },
  Mercury: {
    1: "High mental agility, cranial nerve sensitivity, and dry skin tendency.",
    2: "Dental enamel, tongue sensitivity, and vocal cord strain from fast speech.",
    3: "Bronchial tubes, peripheral nerve reflexes, and wrist/hand ergonomics.",
    4: "Respiratory diaphragm breathing depth; environmental allergy sensitivity.",
    5: "Enteric nervous system (gut-brain axis), IBS tendency, and nervous indigestion.",
    6: "Bronchial-pulmonary sensitivity; classical TB/Kshaya risk when conjunct Mars.",
    7: "Pelvic nerve pathways and renal-urinary nervous coordination.",
    8: "Deep central nervous system sensitivity, chronic mental fatigue, and sleep latency.",
    9: "Sciatic nerve conduction and lower back-thigh nerve pathways.",
    10: "Occupational burnout, skin reactions to synthetic chemicals, and tension headaches.",
    11: "Left auditory nerve sensitivity and motor nerve impulses in lower limbs.",
    12: "Left ear sensitivity, insomnia from active cognitive loops, and travel fatigue.",
  },
  Jupiter: {
    1: "Expansive body constitution, Kapha-dominant liver metabolism, weight management focus.",
    2: "Dental protection, salivary enzyme balance, and healthy vocal tone.",
    3: "Generous lung capacity and resilient upper respiratory defenses.",
    4: "Cardiovascular lipid protection; cultivate peaceful home life for longevity.",
    5: "Sluggish hepatic enzyme conversion; monitor lipid profile and glucose assimilation.",
    6: "Hepato-biliary sensitivity; monitor blood sugar and liver enzymes periodically.",
    7: "Kidney filtration support and healthy reproductive endocrine balance.",
    8: "Chronic longevity protector (Ayushya Karaka); support hepatic lipid clearance.",
    9: "Resilient hip joints, robust arterial health, and strong constitutional grace.",
    10: "Knee joint cartilage preservation; maintain healthy body weight to protect joints.",
    11: "Circulating blood lipids, arterial elasticity, and pancreatic insulin balance.",
    12: "Hepato-biliary detox during foreign residence; restful recovery in quiet settings.",
  },
  Venus: {
    1: "Endocrine balance, dermal hydration, aesthetic sensitivity, and hormonal harmony.",
    2: "Right eye clarity, sweet food metabolism, and throat mucous membrane health.",
    3: "Vocal cord timbre, thyroid function, and delicate neck musculature.",
    4: "Cardiovascular arterial flexibility and chest lymphatic drainage.",
    5: "Ovarian/prostatic health, reproductive hormonal balance, and creative vitality.",
    6: "Right eye strain; renal filtration and urinary tract acidity balance.",
    7: "Primary reproductive vitality (Shukra Dhatu) and bladder-kidney equilibrium.",
    8: "Reproductive system rejuvenation; monitor hormone fluctuations and pelvic comfort.",
    9: "Femoral artery health and pelvic-hip muscular symmetry.",
    10: "Occupational posture impacting pelvic circulation and lumbar alignment.",
    11: "Venous blood return, glycemic moderation, and left eye hydration.",
    12: "Left eye vision, night vision adaptation, and reproductive endocrine rest.",
  },
  Saturn: {
    1: "Lean body frame, chronic endurance, slow metabolic fire, and joint dryness.",
    2: "Dental bone density, jaw stiffness, and conservative digestive capacity.",
    3: "Shoulder stiffness, cervical vertebrae alignment, and dry bronchial pathways.",
    4: "Depressive/melancholic emotional holding; thoracic constriction and rib rigidity.",
    5: "Slow gastric motility (Mandagni), constipation tendency, and chronic digestion.",
    6: "Exceptional resistance to acute illness; watch chronic rheumatic/joint wear.",
    7: "Pelvic joint stiffness, urinary outflow sluggishness, and dry skin.",
    8: "Supreme Longevity Protector (Ayush Karaka); monitor degenerative arthritis post-40.",
    9: "Sciatic nerve compression, hip cartilage wear, and hamstring flexibility.",
    10: "Knee patellar wear, osteoarthritis sensitivity, and skeletal workload balance.",
    11: "Varicose veins, calf spasms, circulatory stiffness, and ankle ligaments.",
    12: "Foot arches, plantar fascia stiffness, cold extremities, and chronic hospitalization risk.",
  },
  Rahu: {
    1: "Idiosyncratic allergic reactions, mystery symptoms, nervous surges, and screen fatigue.",
    2: "Food additive sensitivities, oral microbiome shifts, and toxic metabolite clearance.",
    3: "Nervous twitching, spasmodic respiratory cough, and digital overload.",
    4: "Environmental pollutant sensitivity, domestic mold/dust reactions, and asthma triggers.",
    5: "Ocular strain; classical warning of optic nerve sensitivity when aspecting Sun.",
    6: "Karmic disease indicators; classical link to pulmonary Kshaya / Tuberculosis at nodal returns.",
    7: "Pelvic bacterial balance, partner contagion sensitivity, and hormonal fluctuations.",
    8: "Sudden acute health crises, medication side-effects, and anesthesia sensitivity.",
    9: "Unusual hip or nerve pains defying conventional diagnosis.",
    10: "Industrial toxin exposure and career stress exhausting adrenal reserves.",
    11: "Unusual blood markers, autoimmune reactivity, and irregular peripheral circulation.",
    12: "Severe sleep architecture disruption, strange dreams, and unexplained night sweats.",
  },
  Ketu: {
    1: "Subtle vitality depletion, immune mystery patterns, viral post-exhaustion, spiritual sensitivity.",
    2: "Dental root canal sensitivity, subtle taste loss, and enteric sensitivities.",
    3: "Peripheral neuropathy, subtle finger tremors, and past-life respiratory memory.",
    4: "Chest psychosomatic pressure, sudden breath-holding under stress, and home mold sensitivity.",
    5: "Hidden enteric parasites, subtle enzyme deficiencies, and neural digestive disconnect.",
    6: "Chronic viral or obscure immune conditions; difficult to diagnose with standard panels.",
    7: "Hidden urinary or reproductive tract inflammation without overt pain.",
    8: "Deep karmic surgical events, sudden incisions, and miraculous recovery cycles.",
    9: "Mysterious sciatic or sacral pains; spiritual ascetic practices bring healing.",
    10: "Sudden drops in career energy; chronic occupational fatigue cycles.",
    11: "Unpredictable immune spikes and lymphatic filtration irregularities.",
    12: "Deep meditative states, transcendental healing, sensitivity to institutional hospital settings.",
  },
};

// ── Classical Prakriti by Lagna ─────────────────────────────────────────
export const PRAKRITI_LAGNA: Record<string, string> = {
  Aries:       "Pitta dominant with secondary Vata — sharp, warm, active metabolism. Guard against cranial heat, acid reflux, and impulsive burnout.",
  Taurus:      "Kapha dominant with Vata undertones — steady, cool, deliberate metabolism. Prioritize thyroid support, daily movement, and light nutrition.",
  Gemini:      "Vata dominant — quick, versatile, easily depleted nervous system. Regular eating schedules, warm soups, and digital sunsets are essential.",
  Cancer:      "Kapha-Pitta constitution — deeply sensitive enteric gut, fluid retention tendencies. Hydration balance and emotional calm directly restore digestion.",
  Leo:         "Pitta dominant — robust core vitality, strong cardiovascular fire. Guard against excessive heat, spinal pressure, and authoritative exhaustion.",
  Virgo:       "Vata-Pitta mixed constitution — sensitive enteric nervous system, analytical stress gut. Focus on gut microbiome, cooked warm meals, and calming herbs.",
  Libra:       "Vata-Kapha balance — renal and lumbar filtration focus. Requires fluid balance, metabolic harmony, and non-confrontational lifestyle.",
  Scorpio:     "Pitta-Kapha with hidden intensity — resilient regeneration, pelvic and excretory focus. Requires liver detoxification and regular emotional release.",
  Sagittarius: "Pitta-Vata constitution — athletic vitality, active liver and sciatic pathways. Avoid rich celebratory foods; protect hip joint flexibility.",
  Capricorn:   "Vata dominant with structural resilience — joint and bone focus, slow metabolic rhythm. Warm sesame oil massage and joint mobility protect vitality.",
  Aquarius:    "Vata-Pitta dual nature — circulation and neural impulses require care. Keep shins/ankles warm; practice structured cardiovascular exercise.",
  Pisces:      "Kapha-Vata receptive constitution — lymphatic and immune sensitivity, deeply psychosomatic. Salt baths, foot massages, and restorative sleep restore Ojas.",
};

// ── Nakshatra Devata Upay (Classical Health Propitiation) ────────────────
export const NAKSHATRA_UPAY: Record<string, string> = {
  Ashwini:           "Ashwini Kumara invocation; sunrise Surya Namaskar, horse care/service, red flower offerings, copper vessel water.",
  Bharani:           "Yama and Shiva Mahamrityunjaya prayer; Saturday charity of black sesame, ancestral tarpan, grounding barefoot walks.",
  Krittika:          "Agni devata worship; Tuesday cooling routines, donation of whole grains, moderation of chilies and stimulants.",
  Rohini:            "Brahma and Chandra worship; Monday evening cooling milk/rosewater baths, cow feeding, silver cup hydration.",
  Mrigashira:        "Soma/Chandra worship; Monday Shiva abhishek, mint/fennel tea, cooling breathwork (Sheetali Pranayama).",
  Ardra:             "Rudra abhishek; Monday/Saturday Shiva mantra chanting, donation of dark blankets, avoiding damp rainy exposure.",
  Punarvasu:         "Aditi Devi and Guru worship; Thursday turmeric milk, gold/yellow charity, service to mentors, pure spring water.",
  Pushya:            "Brihaspati puja; Thursday banana tree watering, sandalwood tilak, feeding birds, nourishing unctuous meals.",
  Ashlesha:          "Sarpa/Naga devata propitiation; Nag Panchami fast, milk offerings to Shiva, Rahu-Ketu peace rituals, liver herbs.",
  Magha:             "Pitru tarpan; Amavasya ancestral food donation, respect to elders, maintaining thoracic spinal posture.",
  "Purva Phalguni":  "Bhaga and Surya puja; Sunday wheat/jaggery charity, morning sunlight, pomegranate juice for blood vitality.",
  "Uttara Phalguni": "Aryama worship; Sunday sunrise meditation, gold or brass charity, skin barrier hydration with cold-pressed oils.",
  Hasta:             "Savitru and Mercury puja; Wednesday green moong donation, mindful hand mudras, calming digestive herbal teas.",
  Chitra:            "Vishwakarma and Hanuman puja; Tuesday chanting, iron donation, cervical neck stretching, tool safety.",
  Swati:             "Vayu devata and Saraswati puja; Saturday camphor lighting, eye washing with pure triphala water, steady breathing.",
  Vishakha:          "Indragni puja; Thursday chanting, seasonal fruit distribution, ear oiling (Karna Purana), avoiding loud environments.",
  Anuradha:          "Mitra worship; Friday lotus flower offering, white sandalwood, eucalyptus steam inhalation for nasal passages.",
  Jyeshtha:          "Indra and Shiva puja; Monday silver charity, oil pulling for gums, avoiding harsh oral stimulants.",
  Mula:              "Nirriti and Hanuman worship; Saturday black sesame donation, root vegetable nutrition, grounding earth meditations.",
  "Purva Ashadha":   "Apas/Varuna worship; Monday water donation, clean reservoir preservation, adequate hydration with coriander water.",
  "Uttara Ashadha":  "Vishwa Devathas worship; Thursday whole grain charity, gratitude before meals to prevent acid reflux.",
  Shravana:          "Maha Vishnu worship; Vishnu Sahasranama chanting on Ekadashi, holy basil (Tulsi) tea, mindful quiet listening.",
  Dhanishtha:        "Ashta Vasu worship; Saturday banyan tree pradakshina, warm magnesium foot baths, joint lubrication with sesame oil.",
  Shatabhisha:       "Varuna devata puja; Saturday blue item donation, dandelion/milk thistle tea for bile balance, ocean/river visits.",
  "Purva Bhadrapada":"Aja Ekapada and Shiva-Shakti worship; Monday fast, lymphatic dry brushing, warm ginger-clove digestive infusions.",
  "Uttara Bhadrapada":"Ahirbudhnya and Brahma puja; Thursday yellow lotus meditation, restorative uninterrupted sleep, foot reflexology.",
  Revati:            "Pushan devata worship; Thursday cow service with fresh green fodder, gentle skin moisturizing, barefoot grass walking.",
};

// ── House Rulership Helper ──────────────────────────────────────────────
const SIGN_LORDS: Record<number, string> = {
  0: "Mars",    // Aries
  1: "Venus",   // Taurus
  2: "Mercury", // Gemini
  3: "Moon",    // Cancer
  4: "Sun",     // Leo
  5: "Mercury", // Virgo
  6: "Venus",   // Libra
  7: "Mars",    // Scorpio
  8: "Jupiter", // Sagittarius
  9: "Saturn",  // Capricorn
  10: "Saturn", // Aquarius
  11: "Jupiter",// Pisces
};

// Functional benefic/malefic per lagna
const FUNC_BM: Record<string, { ben: string[]; mal: string[] }> = {
  Aries:       { ben: ["Sun", "Jupiter", "Moon"],           mal: ["Mercury", "Venus", "Saturn", "Rahu", "Ketu"] },
  Taurus:      { ben: ["Mercury", "Saturn", "Venus"],        mal: ["Jupiter", "Moon", "Sun", "Rahu", "Ketu"] },
  Gemini:      { ben: ["Venus", "Saturn"],                   mal: ["Mars", "Jupiter", "Sun", "Moon", "Rahu", "Ketu"] },
  Cancer:      { ben: ["Moon", "Mars", "Jupiter"],            mal: ["Mercury", "Venus", "Saturn", "Rahu", "Ketu"] },
  Leo:         { ben: ["Sun", "Mars", "Jupiter"],             mal: ["Mercury", "Venus", "Saturn", "Rahu", "Ketu"] },
  Virgo:       { ben: ["Mercury", "Venus"],                  mal: ["Mars", "Jupiter", "Moon", "Sun", "Rahu", "Ketu"] },
  Libra:       { ben: ["Mercury", "Venus", "Saturn"],         mal: ["Jupiter", "Sun", "Moon", "Mars", "Rahu", "Ketu"] },
  Scorpio:     { ben: ["Moon", "Jupiter", "Sun"],             mal: ["Mercury", "Venus", "Saturn", "Rahu", "Ketu"] },
  Sagittarius: { ben: ["Mars", "Sun", "Jupiter"],             mal: ["Mercury", "Venus", "Saturn", "Rahu", "Ketu"] },
  Capricorn:   { ben: ["Mercury", "Saturn", "Venus"],         mal: ["Moon", "Mars", "Jupiter", "Sun", "Rahu", "Ketu"] },
  Aquarius:    { ben: ["Mercury", "Venus", "Saturn"],         mal: ["Moon", "Mars", "Jupiter", "Sun", "Rahu", "Ketu"] },
  Pisces:      { ben: ["Moon", "Mars", "Jupiter"],            mal: ["Mercury", "Venus", "Saturn", "Sun", "Rahu", "Ketu"] },
};

// ── Math & Astrological Geometry Helpers ────────────────────────────────

function angularDistance(lon1: number, lon2: number): number {
  const diff = Math.abs(lon1 - lon2) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function getD6Sign(lon: number): number {
  const norm = ((lon % 360) + 360) % 360;
  const sign = Math.floor(norm / 30);
  const deg = norm % 30;
  const part = Math.floor(deg / 5);
  return (sign + part) % 12;
}

// Parashari Full Aspects (Drishti)
function getAspectingHouses(planet: string, house: number): number[] {
  const aspects: number[] = [];
  // All planets aspect 7th house
  aspects.push(((house - 1 + 6) % 12) + 1);

  if (planet === "Mars") {
    // 4th and 8th aspects
    aspects.push(((house - 1 + 3) % 12) + 1);
    aspects.push(((house - 1 + 7) % 12) + 1);
  } else if (planet === "Saturn") {
    // 3rd and 10th aspects
    aspects.push(((house - 1 + 2) % 12) + 1);
    aspects.push(((house - 1 + 9) % 12) + 1);
  } else if (planet === "Jupiter") {
    // 5th and 9th aspects
    aspects.push(((house - 1 + 4) % 12) + 1);
    aspects.push(((house - 1 + 8) % 12) + 1);
  } else if (planet === "Rahu" || planet === "Ketu") {
    // 5th and 9th aspects
    aspects.push(((house - 1 + 4) % 12) + 1);
    aspects.push(((house - 1 + 8) % 12) + 1);
  }

  return aspects;
}

// Check Combustion (Astangata)
function checkCombustion(planet: string, pLon: number, sunLon: number, isRetro: boolean): boolean {
  if (planet === "Sun" || planet === "Rahu" || planet === "Ketu") return false;
  const dist = angularDistance(pLon, sunLon);
  const limits: Record<string, number> = {
    Moon: 12,
    Mars: 17,
    Mercury: isRetro ? 12 : 14,
    Jupiter: 11,
    Venus: isRetro ? 8 : 10,
    Saturn: 15,
  };
  return dist <= (limits[planet] || 10);
}

// ── Classical Disease Combinations with Safe Tone & Traditional Citations ─

interface RawDiseaseCombo {
  key: string;
  traditionalTitle: string;
  classicalCitation: string;
  safeToneGuidance: string;
  severity: "low" | "medium" | "high";
  check: (ctx: {
    planets: Record<string, { house: number; lon: number; signNum: number }>;
    houseLords: Record<number, { lord: string; placedInHouse: number }>;
    aspects: Record<string, number[]>;
  }) => boolean;
  participatingPlanets: string[];
}

export const CLASSICAL_COMBOS_REGISTRY: RawDiseaseCombo[] = [
  // ── Traditional Tuberculosis / Rajyakshma (Dr. S. Krishna Kumar Ch. 19 & BPHS) ──
  {
    key: "tb_mercury_mars_6",
    traditionalTitle: "Tuberculosis / Rajyakshma (Deep Pulmonary Sensitivity)",
    classicalCitation: "Dr. S. Krishna Kumar Ch. 19: Mercury and Mars in 6th house indicate Kshaya Roga (bronchial & lung tissue exhaustion).",
    safeToneGuidance: "High respiratory sensitivity; prioritize clean air environments, avoid smoking or dusty exposure, and seek timely clinical screening for persistent coughs.",
    severity: "high",
    participatingPlanets: ["Mercury", "Mars"],
    check: ({ planets }) => !!(planets.Mercury?.house === 6 && planets.Mars?.house === 6),
  },
  {
    key: "tb_saturn_mars_6",
    traditionalTitle: "Tuberculosis / Rajyakshma (Chest & Rib Cage Vulnerability)",
    classicalCitation: "Dr. S. Krishna Kumar Ch. 19: Saturn and Mars conjunct in 6th house indicate deep thoracic depletion and chronic lung wear.",
    safeToneGuidance: "Thoracic and pulmonary focus area; maintain chest warmth in seasonal shifts, practice diaphragmatic breathing, and obtain prompt medical care for chest congestion.",
    severity: "high",
    participatingPlanets: ["Saturn", "Mars"],
    check: ({ planets }) => !!(planets.Saturn?.house === 6 && planets.Mars?.house === 6),
  },
  {
    key: "tb_rahu_6",
    traditionalTitle: "Tuberculosis / Rajyakshma (Karmic Respiratory Vulnerability)",
    classicalCitation: "Dr. S. Krishna Kumar Ch. 19: Rahu in 6th house linked with chest debility and chronic bronchial vulnerability during nodal cycles.",
    safeToneGuidance: "Respiratory barrier awareness; avoid polluted work zones, ensure mold-free living spaces, and keep pulmonary screenings up to date.",
    severity: "medium",
    participatingPlanets: ["Rahu"],
    check: ({ planets }) => !!(planets.Rahu?.house === 6),
  },
  {
    key: "tb_moon_dusthana_mars_sat",
    traditionalTitle: "Rajyakshma (Fluid & Lung Tissue Depletion)",
    classicalCitation: "Saravali: Moon in a dusthana (6, 8, 12) afflicted by both Mars and Saturn signifies Kshaya (lung/fluid depletion).",
    safeToneGuidance: "Sensitive fluid and lung immunity; maintain steady sleep, warm nourishing hydration, and clinical vigilance for chronic respiratory fatigue.",
    severity: "high",
    participatingPlanets: ["Moon", "Mars", "Saturn"],
    check: ({ planets, aspects }) => {
      if (!planets.Moon || ![6, 8, 12].includes(planets.Moon.house)) return false;
      const mH = planets.Moon.house;
      const marsAfflicts = planets.Mars?.house === mH || (aspects.Mars && aspects.Mars.includes(mH));
      const saturnAfflicts = planets.Saturn?.house === mH || (aspects.Saturn && aspects.Saturn.includes(mH));
      return !!(marsAfflicts && saturnAfflicts);
    },
  },

  // ── Angarak Yoga (Accident / Surgical Heat) ──
  {
    key: "angarak_mars_rahu",
    traditionalTitle: "Angarak Yoga (Accident, Surgery & Burn Sensitivity)",
    classicalCitation: "Classical text: Mars-Rahu conjunction creates sharp Pitta heat, inflammatory surges, and surgical intervention markers.",
    safeToneGuidance: "High physical reflex reactivity; practice speed discipline while driving, handle sharp tools with patience, and manage acute inflammation proactively.",
    severity: "high",
    participatingPlanets: ["Mars", "Rahu"],
    check: ({ planets }) => {
      if (!planets.Mars || !planets.Rahu) return false;
      return planets.Mars.house === planets.Rahu.house && angularDistance(planets.Mars.lon, planets.Rahu.lon) <= 12;
    },
  },

  // ── Visha Yoga (Melancholy & Mental Strain) ──
  {
    key: "visha_moon_saturn",
    traditionalTitle: "Visha Yoga (Psychosomatic Melancholy & Deep Mental Stress)",
    classicalCitation: "Classical text: Moon conjunct or directly aspected by Saturn generates Visha Yoga, causing mental fatigue and serotonin fluctuations.",
    safeToneGuidance: "Psychosomatic and emotional sensitivity; prioritize regular morning sunlight, supportive social connections, and mental wellness consultations when feeling low.",
    severity: "medium",
    participatingPlanets: ["Moon", "Saturn"],
    check: ({ planets }) => {
      if (!planets.Moon || !planets.Saturn) return false;
      return planets.Moon.house === planets.Saturn.house && angularDistance(planets.Moon.lon, planets.Saturn.lon) <= 12;
    },
  },

  // ── Pavana Prakopa Yoga (Severe Vata & Nervous Agitation) ──
  {
    key: "pavana_prakopa",
    traditionalTitle: "Pavana Prakopa Yoga (Vata Imbalance & Nervous Agitation)",
    classicalCitation: "Dr. S. Krishna Kumar: Saturn in 1st house with Mars in 5th or 9th provokes severe Vata disturbance and neurological agitation.",
    safeToneGuidance: "High nervous system sensitivity; favor warm, grounding meals, minimize late-night screen stimulation, and practice gentle restorative yoga.",
    severity: "medium",
    participatingPlanets: ["Saturn", "Mars"],
    check: ({ planets }) => !!(planets.Saturn?.house === 1 && planets.Mars && [5, 9, 7].includes(planets.Mars.house)),
  },

  // ── Netra Roga (Ocular Sensitivity) ──
  {
    key: "netra_saturn_2",
    traditionalTitle: "Netra Roga (Right Ocular & Dental Sensitivity)",
    classicalCitation: "Classical text: Saturn in 2nd house creates dryness in right eye membranes and dental bone sensitivity.",
    safeToneGuidance: "Ocular surface dryness; practice the 20-20-20 screen rule, use lubricating eye drops if advised by an optometrist, and maintain dental checkups.",
    severity: "low",
    participatingPlanets: ["Saturn"],
    check: ({ planets }) => !!(planets.Saturn?.house === 2),
  },
  {
    key: "netra_sun_12",
    traditionalTitle: "Netra Roga (Left Eye & Visual Lustre Sensitivity)",
    classicalCitation: "Classical text: Sun in 12th house weakens visual stamina and left ocular clarity.",
    safeToneGuidance: "Visual fatigue marker; protect eyes from UV glare with sunglasses, get regular eye examinations, and avoid straining eyes in low-light settings.",
    severity: "low",
    participatingPlanets: ["Sun"],
    check: ({ planets }) => !!(planets.Sun?.house === 12),
  },
  {
    key: "netra_venus_dusthana",
    traditionalTitle: "Shukra Netra Roga (Ocular Fluid Sensitivity)",
    classicalCitation: "Dr. S. Krishna Kumar: Venus in 6th or 8th house influences ocular fluid circulation and night vision adaptation.",
    safeToneGuidance: "Maintain proper lighting during night driving, stay hydrated, and support tear-film stability with omega-3 fatty acids under doctor advice.",
    severity: "medium",
    participatingPlanets: ["Venus"],
    check: ({ planets }) => !!(planets.Venus && [6, 8].includes(planets.Venus.house)),
  },

  // ── Nephritis / Vrikka Roga (Kidney & Urinary Sensitivity) ──
  {
    key: "nephritis_sun_mars",
    traditionalTitle: "Vrikka Roga (Nephritic & Renal Filtration Sensitivity)",
    classicalCitation: "Dr. S. Krishna Kumar: Sun in Lagna combined with Mars in 6th house indicates high metabolic urea heat and renal filtration strain.",
    safeToneGuidance: "Hydration and kidney health focus; maintain steady daily water intake, monitor blood pressure, and limit excessive sodium or energy drinks.",
    severity: "high",
    participatingPlanets: ["Sun", "Mars"],
    check: ({ planets }) => !!(planets.Sun?.house === 1 && planets.Mars?.house === 6),
  },

  // ── Cardiovascular / Hridaya Roga ──
  {
    key: "hridaya_4th_sun_afflicted",
    traditionalTitle: "Hridaya Roga (Cardiovascular Vitality Pacing)",
    classicalCitation: "Parashara & Krishna Kumar: Affliction to 4th house and 4th lord along with Sun indicates cardiovascular sensitivity.",
    safeToneGuidance: "Heart health awareness; engage in regular moderate aerobic exercise, manage emotional pacing, and check lipid profile annually post-35.",
    severity: "high",
    participatingPlanets: ["Sun"],
    check: ({ planets, houseLords }) => {
      const h4Lord = houseLords[4]?.lord;
      const sunInDusthana = planets.Sun && [6, 8, 12].includes(planets.Sun.house);
      const h4LordInDusthana = h4Lord && planets[h4Lord] && [6, 8, 12].includes(planets[h4Lord].house);
      return !!(sunInDusthana && h4LordInDusthana);
    },
  },

  // ── Prameha (Sugar & Metabolic Assimilation) ──
  {
    key: "prameha_jupiter_afflicted",
    traditionalTitle: "Prameha (Glycemic & Lipid Metabolism Sensitivity)",
    classicalCitation: "Charaka Samhita & Classical Jyotish: Jupiter in 6th house or afflicted by malefics indicates pancreatic and liver lipid sensitivity.",
    safeToneGuidance: "Metabolic and glucose balance; minimize refined carbohydrates, adopt fiber-rich nutrition, and perform periodic HbA1c screenings.",
    severity: "medium",
    participatingPlanets: ["Jupiter"],
    check: ({ planets }) => !!(planets.Jupiter?.house === 6),
  },

  // ── Twak Roga (Chronic Dermal Sensitivity) ──
  {
    key: "charma_sat_merc",
    traditionalTitle: "Twak Roga (Dermal Barrier & Eczema Sensitivity)",
    classicalCitation: "Dr. S. Krishna Kumar: Saturn conjunct Mercury in difficult houses causes dry skin, dermal roughness, and barrier allergies.",
    safeToneGuidance: "Skin barrier protection; use gentle fragrance-free cleansers, maintain regular barrier moisturization, and track dietary allergy triggers.",
    severity: "low",
    participatingPlanets: ["Saturn", "Mercury"],
    check: ({ planets }) => !!(planets.Saturn && planets.Mercury && planets.Saturn.house === planets.Mercury.house),
  },
];

// Backward-compatible book combo proxy for legacy consumers
export const DISEASE_COMBOS_BOOK = CLASSICAL_COMBOS_REGISTRY.map(c => ({
  key: c.key,
  disease: c.traditionalTitle,
  note: `${c.classicalCitation} ${c.safeToneGuidance}`,
  check: (p: Record<string, { house: number }>) => {
    // Basic compatibility check for legacy callers
    if (c.key === "tb_rahu_6") return p.Rahu?.house === 6;
    if (c.key === "tb_mercury_mars_6") return p.Mercury?.house === 6 && p.Mars?.house === 6;
    if (c.key === "tb_saturn_mars_6") return p.Saturn?.house === 6 && p.Mars?.house === 6;
    if (c.key === "angarak_mars_rahu") return p.Mars?.house === p.Rahu?.house;
    if (c.key === "visha_moon_saturn") return p.Moon?.house === p.Saturn?.house;
    if (c.key === "netra_saturn_2") return p.Saturn?.house === 2;
    if (c.key === "netra_sun_12") return p.Sun?.house === 12;
    if (c.key === "nephritis_sun_mars") return p.Sun?.house === 1 && p.Mars?.house === 6;
    return false;
  },
}));

// ── Algorithmic Tri-Dosha Engine ────────────────────────────────────────

function calculateAlgorithmicTridosha(
  chart: ChartData,
  lagnaNum: number,
  lagnaLord: string,
  moonNakshatraLord: string
): TridoshaBreakdown {
  const planets = chart.planets;
  let vataPts = 0;
  let pittaPts = 0;
  let kaphaPts = 0;

  // 1. Lagna Sign Element & Dosha (30 pts weight)
  // Fire = Pitta, Earth = Kapha/Vata, Air = Vata, Water = Kapha
  const signDoshaWeights: Record<number, { vata: number; pitta: number; kapha: number }> = {
    0: { vata: 5, pitta: 25, kapha: 0 },  // Aries (Fire - Pitta)
    1: { vata: 5, pitta: 5, kapha: 20 },  // Taurus (Earth - Kapha)
    2: { vata: 25, pitta: 5, kapha: 0 },  // Gemini (Air - Vata)
    3: { vata: 5, pitta: 0, kapha: 25 },  // Cancer (Water - Kapha)
    4: { vata: 0, pitta: 28, kapha: 2 },  // Leo (Fire - Pitta)
    5: { vata: 15, pitta: 10, kapha: 5 }, // Virgo (Earth - Vata/Pitta)
    6: { vata: 20, pitta: 0, kapha: 10 }, // Libra (Air - Vata/Kapha)
    7: { vata: 5, pitta: 15, kapha: 10 }, // Scorpio (Water/Fire - Pitta/Kapha)
    8: { vata: 10, pitta: 18, kapha: 2 }, // Sagittarius (Fire - Pitta)
    9: { vata: 22, pitta: 0, kapha: 8 },  // Capricorn (Earth - Vata)
    10: { vata: 25, pitta: 5, kapha: 0 }, // Aquarius (Air - Vata)
    11: { vata: 8, pitta: 2, kapha: 20 }, // Pisces (Water - Kapha)
  };

  const lWeights = signDoshaWeights[lagnaNum] || { vata: 10, pitta: 10, kapha: 10 };
  vataPts += lWeights.vata;
  pittaPts += lWeights.pitta;
  kaphaPts += lWeights.kapha;

  // 2. Planet Dosha Contributions (35 pts weight across 9 planets)
  const planetDoshas: Record<string, { vata: number; pitta: number; kapha: number }> = {
    Sun:     { vata: 0,  pitta: 10, kapha: 0 },
    Moon:    { vata: 2,  pitta: 0,  kapha: 8 },
    Mars:    { vata: 0,  pitta: 10, kapha: 0 },
    Mercury: { vata: 7,  pitta: 2,  kapha: 1 },
    Jupiter: { vata: 0,  pitta: 2,  kapha: 8 },
    Venus:   { vata: 2,  pitta: 0,  kapha: 8 },
    Saturn:  { vata: 10, pitta: 0,  kapha: 0 },
    Rahu:    { vata: 8,  pitta: 2,  kapha: 0 },
    Ketu:    { vata: 4,  pitta: 6,  kapha: 0 },
  };

  Object.entries(planets).forEach(([pName, pData]) => {
    const pd = planetDoshas[pName];
    if (pd) {
      // Modify based on sign element
      const sNum = pData.signNum;
      const sW = signDoshaWeights[sNum] || { vata: 5, pitta: 5, kapha: 5 };
      vataPts += pd.vata * 0.7 + sW.vata * 0.3;
      pittaPts += pd.pitta * 0.7 + sW.pitta * 0.3;
      kaphaPts += pd.kapha * 0.7 + sW.kapha * 0.3;
    }
  });

  // 3. Lagna Lord + Moon Nakshatra Lord Influence (20 pts)
  const llDosha = planetDoshas[lagnaLord] || { vata: 3, pitta: 3, kapha: 3 };
  vataPts += llDosha.vata * 1.2;
  pittaPts += llDosha.pitta * 1.2;
  kaphaPts += llDosha.kapha * 1.2;

  const nlDosha = planetDoshas[moonNakshatraLord] || { vata: 3, pitta: 3, kapha: 3 };
  vataPts += nlDosha.vata * 0.8;
  pittaPts += nlDosha.pitta * 0.8;
  kaphaPts += nlDosha.kapha * 0.8;

  // Normalize to 100%
  const total = Math.max(1, vataPts + pittaPts + kaphaPts);
  const vata = Math.round((vataPts / total) * 100);
  const pitta = Math.round((pittaPts / total) * 100);
  const kapha = Math.max(0, 100 - vata - pitta);

  // Classify Constitution
  let dominant = "Balanced (Sama-Dosha)";
  let constitutionType: TridoshaBreakdown["constitutionType"] = "Sama-Dosha (Tridoshic)";

  const sorted = [
    { name: "Vata", val: vata },
    { name: "Pitta", val: pitta },
    { name: "Kapha", val: kapha },
  ].sort((a, b) => b.val - a.val);

  if (sorted[0].val >= 48) {
    dominant = sorted[0].name;
    constitutionType = "Mono-Dosha";
  } else if (sorted[0].val - sorted[1].val <= 14) {
    dominant = `${sorted[0].name}-${sorted[1].name}`;
    constitutionType = "Dual-Dosha";
  } else {
    dominant = sorted[0].name;
    constitutionType = "Mono-Dosha";
  }

  let lifestyleGuidance = "Maintain balanced daily rhythm, moderate physical exercise, and regular hydration.";
  const dietaryGuidance: string[] = [];

  if (dominant.includes("Vata")) {
    lifestyleGuidance = "Favor regularity in sleeping and eating schedules. Keep the body warm, avoid over-exhaustion, and practice daily warm sesame oil massage (Abhyanga).";
    dietaryGuidance.push("Warm, cooked, nourishing soups and stews", "Healthy fats: Ghee, cold-pressed sesame or olive oil", "Minimize dry, cold, raw, or carbonated items");
  }
  if (dominant.includes("Pitta")) {
    lifestyleGuidance = "Avoid excessive direct sun exposure, spicy/fermented foods, and intense competitive stress. Cultivate cooling evening walks and meditation.";
    dietaryGuidance.push("Naturally sweet, bitter, and astringent foods", "Cooling herbs: Mint, coriander, fennel, aloe vera", "Avoid overly sour, salty, and chili-spiced foods");
  }
  if (dominant.includes("Kapha")) {
    lifestyleGuidance = "Cultivate vigorous daily physical exercise, brisk morning walks, and light dry environments. Avoid sedentary habits and daytime sleeping.";
    dietaryGuidance.push("Light, warm, pungent, and bitter greens", "Digestive spices: Ginger, black pepper, cinnamon, turmeric", "Minimize heavy dairy, iced drinks, sweets, and fried meals");
  }

  return { vata, pitta, kapha, dominant, constitutionType, lifestyleGuidance, dietaryGuidance };
}

// ── Agni (Digestive Fire) Engine ────────────────────────────────────────

function determineAgniProfile(tridosha: TridoshaBreakdown, chart: ChartData): AgniProfile {
  const p = chart.planets;
  const h5Lord = SIGN_LORDS[(chart.lagnaNum + 4) % 12];
  const h5LordData = p[h5Lord];
  const isH5Afflicted = h5LordData && [6, 8, 12].includes(h5LordData.house);

  if (tridosha.vata >= 42 || (p.Saturn && [5, 6].includes(p.Saturn.house))) {
    return {
      type: "Vishamagni",
      sanskrit: "विषमाग्नि (Irregular Digestive Metabolism)",
      title: "Vishamagni (Irregular Agni)",
      tendency: "Fluctuating appetite, bloating, alternating constipation and irregular digestive fire driven by Vata.",
      balancingProtocol: "Take warm, freshly cooked meals at fixed daily hours; sip warm ginger water before meals.",
    };
  } else if (tridosha.pitta >= 42 || (p.Mars && [5, 6].includes(p.Mars.house)) || (p.Sun && p.Sun.house === 5)) {
    return {
      type: "Tikshnagni",
      sanskrit: "तीक्ष्णाग्नि (Hypermetabolic Digestive Fire)",
      title: "Tikshnagni (Hyperactive Agni)",
      tendency: "Rapid intense hunger, burning sensation, hyperacidity, and quick bile secretion driven by Pitta.",
      balancingProtocol: "Do not skip meals; favor cooling herbs like fennel, coriander, sweet fruits, and pure cow ghee.",
    };
  } else if (tridosha.kapha >= 42 || (p.Jupiter && [5, 6].includes(p.Jupiter.house) && isH5Afflicted)) {
    return {
      type: "Mandagni",
      sanskrit: "मन्दाग्नि (Sluggish Digestive Metabolism)",
      title: "Mandagni (Sluggish Agni)",
      tendency: "Heavy feeling post-meals, slow assimilation, mucosal sluggishness, and low hunger driven by Kapha.",
      balancingProtocol: "Incorporate warming carminative spices (black pepper, ginger, cumin); avoid heavy dairy and night meals.",
    };
  }

  return {
    type: "Samagni",
    sanskrit: "समाग्नि (Balanced Digestive Metabolism)",
    title: "Samagni (Balanced Agni)",
    tendency: "Steady, predictable metabolic conversion, healthy nutrient absorption, and balanced elimination.",
    balancingProtocol: "Continue mindful seasonal eating; maintain your established routine without drastic shifts.",
  };
}

// ── 7 Dhatus (Ayurvedic Tissues) Vulnerability Analysis ────────────────

function analyzeDhatus(chart: ChartData): DhatuAffliction[] {
  const p = chart.planets;
  const dhatus: DhatuAffliction[] = [
    {
      dhatu: "Rasa",
      sanskritName: "रस धातु (Plasma / Lymphatic Chyle)",
      tissueSystem: "Lymphatic circulation, plasma hydration, and mucosal barrier",
      governingPlanet: "Moon",
      status: p.Moon && [6, 8, 12].includes(p.Moon.house) ? "Moderate Vulnerability" : "Balanced",
      indicators: "Fluid retention, dry skin, emotional dehydration, or lymphatic sluggishness.",
    },
    {
      dhatu: "Rakta",
      sanskritName: "रक्त धातु (Blood / Hemoglobin)",
      tissueSystem: "Oxygenation, red blood cells, arterial circulation, liver heat",
      governingPlanet: "Mars / Sun",
      status: (p.Mars && [6, 8].includes(p.Mars.house)) || (p.Sun && [6, 8].includes(p.Sun.house)) ? "High Vulnerability" : "Balanced",
      indicators: "Blood pressure spikes, skin eruptions, inflammatory markers, or bile heat.",
    },
    {
      dhatu: "Mamsa",
      sanskritName: "मांस धातु (Muscle Tissue)",
      tissueSystem: "Muscular strength, structural tone, and physical stamina",
      governingPlanet: "Mars",
      status: p.Mars?.retrograde || (p.Mars && [8, 12].includes(p.Mars.house)) ? "Moderate Vulnerability" : "Balanced",
      indicators: "Muscle cramps, tendon stiffness, fatigue from sudden exertion.",
    },
    {
      dhatu: "Meda",
      sanskritName: "मेद धातु (Adipose / Lipid Tissue)",
      tissueSystem: "Fat metabolism, joint lubrication, sebum secretion",
      governingPlanet: "Jupiter",
      status: p.Jupiter && [6, 8].includes(p.Jupiter.house) ? "Moderate Vulnerability" : "Balanced",
      indicators: "Weight fluctuations, blood lipid variation, slow metabolic conversion.",
    },
    {
      dhatu: "Asthi",
      sanskritName: "अस्थि धातु (Bone / Skeletal Tissue)",
      tissueSystem: "Bones, teeth, cartilage, and spinal structural integrity",
      governingPlanet: "Saturn / Sun",
      status: (p.Saturn && [1, 6, 8].includes(p.Saturn.house)) || (p.Sun && [6, 8, 12].includes(p.Sun.house)) ? "Moderate Vulnerability" : "Balanced",
      indicators: "Joint cracking, dental bone density, cervical or lumbar wear.",
    },
    {
      dhatu: "Majja",
      sanskritName: "मज्जा धातु (Bone Marrow & Nervous Tissue)",
      tissueSystem: "Central nervous system, spinal cord, neural transmission",
      governingPlanet: "Mercury / Mars",
      status: (p.Mercury && [6, 8, 12].includes(p.Mercury.house)) ? "High Vulnerability" : "Balanced",
      indicators: "Nervous exhaustion, sleep latency, tingling, or mental overstimulation.",
    },
    {
      dhatu: "Shukra",
      sanskritName: "शुक्र धातु (Reproductive & Vital Essences)",
      tissueSystem: "Endocrine balance, reproductive vitality, cellular regeneration",
      governingPlanet: "Venus",
      status: p.Venus && [6, 8, 12].includes(p.Venus.house) ? "Moderate Vulnerability" : "Balanced",
      indicators: "Hormonal shifts, reproductive rhythm, creative vitality replenishment.",
    },
  ];

  return dhatus;
}

// ── Ojas (Vitality & Constitutional Resilience) Index ───────────────────

function calculateOjasScore(chart: ChartData, lagnaLord: string): { score: number; rating: MedicalResult["ojasRating"] } {
  let ojas = 70; // Baseline
  const p = chart.planets;
  const ll = p[lagnaLord];

  if (ll) {
    if ([1, 4, 5, 7, 9, 10].includes(ll.house)) ojas += 10;
    if (["Exalted", "Own"].includes(ll.dignity)) ojas += 10;
    if ([6, 8, 12].includes(ll.house)) ojas -= 12;
    if (ll.dignity === "Debilitated") ojas -= 12;
  }

  // Sun (Atma Karaka / Vitality)
  if (p.Sun) {
    if (["Exalted", "Own"].includes(p.Sun.dignity)) ojas += 8;
    if ([6, 8, 12].includes(p.Sun.house)) ojas -= 8;
  }

  // Moon (Prana / Mind)
  if (p.Moon) {
    if (["Exalted", "Own"].includes(p.Moon.dignity)) ojas += 6;
    if ([6, 8, 12].includes(p.Moon.house)) ojas -= 6;
  }

  // Benefics in Kendras (1, 4, 7, 10) protect Ojas
  const kendraBenefics = ["Jupiter", "Venus", "Mercury"].filter(
    b => p[b] && [1, 4, 7, 10].includes(p[b].house)
  );
  ojas += kendraBenefics.length * 4;

  // Malefics in Upachaya houses (3, 6, 11) boost disease resistance
  const upachayaMalefics = ["Mars", "Saturn", "Rahu"].filter(
    m => p[m] && [3, 6, 11].includes(p[m].house)
  );
  ojas += upachayaMalefics.length * 4;

  const score = Math.max(25, Math.min(98, ojas));
  const rating: MedicalResult["ojasRating"] =
    score >= 78 ? "Robust Resilience" : score >= 58 ? "Moderate Vitality" : "Delicate Constitution";

  return { score, rating };
}

// ── Concern string for planet ──────────────────────────────────────────

function concernForPlanet(planet: string, card?: PlanetHealthCard): string {
  if (!card) return "General vitality";
  if (card.planet === "Sun") return "Heart, eyes, spine and vitality pacing";
  if (card.planet === "Moon") return "Mind, fluids, sleep depth and gastric mucosa";
  if (card.planet === "Mars") return "Blood pressure, inflammatory spikes and accident care";
  if (card.planet === "Mercury") return "Nerves, skin, bronchial tracts and enteric gut";
  if (card.planet === "Jupiter") return "Liver, glucose metabolism, blood lipids and weight";
  if (card.planet === "Venus") return "Kidneys, hormonal balance, ocular fluids and reproductive tone";
  if (card.planet === "Saturn") return "Bones, joints, chronic fatigue, knees and nerve conduction";
  if (card.planet === "Rahu") return "Environmental allergies, mystery symptoms and toxic load";
  if (card.planet === "Ketu") return "Subtle immune recovery, viral post-exhaustion and deep tissue healing";
  return card.houseNote;
}

// ── Main Calculation Function ──────────────────────────────────────────

export function calculateMedical(chart: ChartData, targetDate: Date = new Date()): MedicalResult {
  const planets = chart.planets;
  const lagnaNum = chart.lagnaNum;
  const lagnaSign = chart.lagnaRashi;
  const lagnaBodyZone = SIGN_BODY[lagnaSign] || "Cranium and body constitution";

  const moonPd = planets.Moon;
  const birthNakshatra = moonPd?.nakshatra || "Unknown";
  const moonSignRaw = moonPd?.sign || "";
  const birthNakshatraData = NAKSHATRA_DISEASE_BOOK[birthNakshatra] || null;
  const moonSignDisease = SIGN_DISEASE[moonSignRaw] || "";
  const birthNakshatraUpay = NAKSHATRA_UPAY[birthNakshatra] || "Nakshatra devata prayer and mindful living.";

  // 1. Build House Lords Map (1 through 12)
  const houseLords: Record<number, HouseLordInfo> = {};
  for (let h = 1; h <= 12; h++) {
    const signIdx = (lagnaNum + (h - 1)) % 12;
    const lord = SIGN_LORDS[signIdx];
    const placedPd = planets[lord];
    const placedInHouse = placedPd ? placedPd.house : 1;
    const placedInSign = placedPd ? placedPd.sign : lagnaSign;
    const isDusthanaLord = [6, 8, 12].includes(h);
    const isAfflicted = placedPd ? [6, 8, 12].includes(placedPd.house) : false;

    houseLords[h] = {
      house: h,
      sign: Object.keys(SIGN_BODY)[signIdx] || "Aries",
      lord,
      placedInHouse,
      placedInSign,
      isDusthanaLord,
      isAfflicted,
    };
  }

  const lagnaLord = houseLords[1].lord;
  const moonNakshatraLord = moonPd?.nakshatraLord || "Moon";
  const sunPd = planets.Sun;
  const sunLon = sunPd ? sunPd.lon : 0;

  // 2. Aspects & Combustion Map
  const aspects: Record<string, number[]> = {};
  const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  PLANET_NAMES.forEach(p => {
    if (planets[p]) {
      aspects[p] = getAspectingHouses(p, planets[p].house);
    }
  });

  // 3. Planet Health Cards
  const bm = FUNC_BM[lagnaSign];
  const TRIDOSHA_SIMPLE: Record<string, string> = {
    Sun: "Pitta", Moon: "Kapha", Mars: "Pitta", Mercury: "Vata",
    Jupiter: "Kapha", Venus: "Kapha", Saturn: "Vata", Rahu: "Vata", Ketu: "Pitta-Vata",
  };

  const planetCards: PlanetHealthCard[] = PLANET_NAMES.map(pName => {
    const pd = planets[pName];
    if (!pd) return null;

    const inDusthana = [6, 8, 12].includes(pd.house);
    const nk = NAKSHATRA_DISEASE_BOOK[pd.nakshatra] || { disease: "—", body: "—", note: "" };
    const funcNature: "benefic" | "malefic" | "neutral" = bm
      ? bm.ben.includes(pName) ? "benefic" : bm.mal.includes(pName) ? "malefic" : "neutral"
      : "neutral";

    // Which houses does this planet own?
    const ownedHouses = Object.entries(houseLords)
      .filter(([, info]) => info.lord === pName)
      .map(([h]) => Number(h));

    const isCombust = checkCombustion(pName, pd.lon, sunLon, pd.retrograde);
    const d6SignNum = getD6Sign(pd.lon);
    const d6Sign = Object.keys(SIGN_BODY)[d6SignNum];

    return {
      planet: pName,
      house: pd.house,
      sign: pd.sign,
      nakshatra: pd.nakshatra,
      pada: pd.pada,
      retrograde: pd.retrograde,
      isCombust,
      dignity: pd.dignity || "Neutral",
      inDusthana,
      isHouseLordOf: ownedHouses,
      aspectingHouses: aspects[pName] || [],
      tridosha: TRIDOSHA_SIMPLE[pName] || "Mixed",
      funcNature,
      houseNote: PLANET_HOUSE_DISEASE[pName]?.[pd.house] || `${pName} influences house ${pd.house}`,
      nakshatraDisease: nk.disease,
      nakshatraBody: nk.body,
      boilZone: PLANET_BOIL[pName] || "—",
      nakUpay: NAKSHATRA_UPAY[pd.nakshatra] || "",
      d6Sign,
    };
  }).filter(Boolean) as PlanetHealthCard[];

  // 4. Algorithmic Tri-Dosha, Agni, and Dhatus
  const tridoshaBreakdown = calculateAlgorithmicTridosha(chart, lagnaNum, lagnaLord, moonNakshatraLord);
  const agniProfile = determineAgniProfile(tridoshaBreakdown, chart);
  const dhatuAfflictions = analyzeDhatus(chart);
  const { score: ojasScore, rating: ojasRating } = calculateOjasScore(chart, lagnaLord);

  // 5. Evaluate Classical Combinations with Safe Tone
  const comboCtx = {
    planets: Object.fromEntries(
      Object.entries(planets).map(([k, v]) => [k, { house: v.house, lon: v.lon, signNum: v.signNum }])
    ),
    houseLords: Object.fromEntries(
      Object.entries(houseLords).map(([k, v]) => [Number(k), { lord: v.lord, placedInHouse: v.placedInHouse }])
    ),
    aspects,
  };

  const triggeredCombos: DiseaseCombination[] = CLASSICAL_COMBOS_REGISTRY
    .filter(c => {
      try {
        return c.check(comboCtx);
      } catch {
        return false;
      }
    })
    .map(c => ({
      disease: c.traditionalTitle,
      classicalCitation: c.classicalCitation,
      safeToneGuidance: c.safeToneGuidance,
      note: `${c.classicalCitation} ${c.safeToneGuidance}`,
      severity: c.severity,
      participatingPlanets: c.participatingPlanets,
    }));

  // 6. Comprehensive Body Systems Health Scores (Tri-Fold Bhava-Bhavesh-Karaka)
  const scores: Record<string, number> = {
    Heart: 0,
    Digestive: 0,
    Mental: 0,
    Eye: 0,
    Bone: 0,
    Respiratory: 0,
    Reproductive: 0,
    Skin: 0,
  };

  const p = planets;
  // Heart (4th house, Sun, 4th Lord, Leo)
  if (p.Sun && [6, 8, 12].includes(p.Sun.house)) scores.Heart += 16;
  if (houseLords[4]?.isAfflicted) scores.Heart += 14;
  if (p.Mars && p.Mars.house === 4) scores.Heart += 12;
  if (p.Saturn && p.Sun && angularDistance(p.Saturn.lon, p.Sun.lon) <= 10) scores.Heart += 14;

  // Digestive & Metabolic (5th & 6th houses, Jupiter, Sun, Virgo)
  if (p.Jupiter && [6, 8].includes(p.Jupiter.house)) scores.Digestive += 15;
  if (p.Saturn && [5, 6].includes(p.Saturn.house)) scores.Digestive += 12;
  if (p.Mars && p.Mars.house === 5) scores.Digestive += 12;
  if (houseLords[5]?.isAfflicted) scores.Digestive += 12;

  // Mental & Cognitive (Moon, Mercury, 5th house, Saturn-Moon)
  if (p.Moon && p.Saturn && angularDistance(p.Moon.lon, p.Saturn.lon) <= 12) scores.Mental += 22;
  if (p.Moon && p.Rahu && angularDistance(p.Moon.lon, p.Rahu.lon) <= 12) scores.Mental += 18;
  if (p.Moon && [6, 8, 12].includes(p.Moon.house)) scores.Mental += 12;
  if (p.Mercury && [6, 8, 12].includes(p.Mercury.house)) scores.Mental += 10;

  // Eye & Vision (2nd & 12th houses, Sun, Venus, Saturn in 2nd)
  if (p.Saturn && p.Saturn.house === 2) scores.Eye += 18;
  if (p.Sun && [12, 6, 8].includes(p.Sun.house)) scores.Eye += 12;
  if (p.Venus && [6, 8].includes(p.Venus.house)) scores.Eye += 14;
  if (p.Rahu && p.Rahu.house === 5 && p.Sun && p.Sun.house === 5) scores.Eye += 16;

  // Bone & Skeletal (Saturn, Sun, 10th house, Capricorn)
  if (p.Saturn && [1, 6, 8, 10].includes(p.Saturn.house)) scores.Bone += 15;
  if (p.Mars && p.Saturn && angularDistance(p.Mars.lon, p.Saturn.lon) <= 10) scores.Bone += 18;
  if (p.Sun && p.Sun.dignity === "Debilitated") scores.Bone += 10;

  // Respiratory & Pulmonary (3rd & 4th houses, Gemini, Mercury, Moon, Rahu/Mars in 6th)
  if (p.Mercury && p.Mars && p.Mercury.house === 6 && p.Mars.house === 6) scores.Respiratory += 24; // Classical Rajyakshma
  if (p.Saturn && p.Mars && p.Saturn.house === 6 && p.Mars.house === 6) scores.Respiratory += 22;  // Classical Rajyakshma
  if (p.Rahu && p.Rahu.house === 6) scores.Respiratory += 12;
  if (p.Saturn && p.Saturn.house === 4) scores.Respiratory += 14;
  if (houseLords[3]?.isAfflicted) scores.Respiratory += 10;

  // Reproductive & Renal (7th & 8th houses, Venus, Libra/Scorpio)
  if (p.Venus && [6, 8, 12].includes(p.Venus.house)) scores.Reproductive += 16;
  if (p.Mars && p.Venus && angularDistance(p.Mars.lon, p.Venus.lon) <= 10) scores.Reproductive += 14;
  if (p.Rahu && p.Venus && angularDistance(p.Rahu.lon, p.Venus.lon) <= 10) scores.Reproductive += 18;
  if (houseLords[7]?.isAfflicted) scores.Reproductive += 10;

  // Skin & Allergies (Mercury, Saturn, Rahu)
  if (p.Saturn && p.Mercury && angularDistance(p.Saturn.lon, p.Mercury.lon) <= 10) scores.Skin += 18;
  if (p.Mars && p.Rahu && angularDistance(p.Mars.lon, p.Rahu.lon) <= 10) scores.Skin += 15;
  if (p.Mercury && [6, 8].includes(p.Mercury.house)) scores.Skin += 12;

  // Clamp scores to 95 max
  Object.keys(scores).forEach(k => {
    scores[k] = Math.min(95, scores[k]);
  });

  // 7. Refined Accident / Trauma Score (Natal + Real-time Transit Triggers)
  let accidentScore = 10;
  if (p.Mars && [1, 6, 8, 12].includes(p.Mars.house)) accidentScore += 16;
  if (p.Mars && p.Rahu && angularDistance(p.Mars.lon, p.Rahu.lon) <= 12) accidentScore += 20;
  if (p.Mars && p.Saturn && angularDistance(p.Mars.lon, p.Saturn.lon) <= 10) accidentScore += 16;
  if (p.Mars && p.Ketu && angularDistance(p.Mars.lon, p.Ketu.lon) <= 10) accidentScore += 15; // Ketu surgical cuts
  if (p.Rahu && [1, 8].includes(p.Rahu.house)) accidentScore += 10;

  // Malefics in 8th house increase trauma risk
  const h8Malefics = ["Mars", "Saturn", "Rahu", "Ketu"].filter(m => p[m]?.house === 8).length;
  accidentScore += h8Malefics * 10;

  // Benefics in 8th house PROTECT against fatal accidents (Ayushya Karakas)
  const h8Benefics = ["Jupiter", "Venus"].filter(b => p[b]?.house === 8).length;
  accidentScore = Math.max(5, accidentScore - h8Benefics * 12);

  // Dynamic Transit & Timing Modifiers for targetDate
  let transitHouses: Record<string, number> = {};
  let transitLons: Record<string, number> = {};
  try {
    const dateStr = targetDate.toISOString().split("T")[0];
    const jd = getJD(dateStr, "12:00", chart.tz ?? 5.5);
    const raw = computePlanets(jd);
    transitLons = raw;
    const lagnaSign = chart.lagnaNum;
    Object.entries(raw).forEach(([pName, lon]) => {
      const pSign = Math.floor(lon / 30);
      transitHouses[pName] = ((pSign - lagnaSign + 12) % 12) + 1;
    });
  } catch {
    // fallback
  }

  // Active Dasha with full 3 levels (MD, AD, PD) for targetDate
  let mdLord = "Moon";
  let adLord = "Mars";
  let pdLord: string | undefined;

  try {
    const birthDate = new Date(`${chart.dob}T${chart.tob}`);
    const moonNak = getNakshatraFromLongitude(chart.planets.Moon.lon);
    const hierarchy = getCurrentDashaHierarchy5Levels(birthDate, moonNak, targetDate);
    mdLord = hierarchy.mahadasha.lord;
    adLord = hierarchy.antardasha.lord;
    pdLord = hierarchy.pratyantardasha.lord;
  } catch {
    const activeMD = chart.dashas?.find(d => d.start <= targetDate && d.end > targetDate);
    const activeAD = chart.antardasha?.find(d => d.start <= targetDate && d.end > targetDate);
    mdLord = activeMD?.planet || "Moon";
    adLord = activeAD?.planet || "Mars";
  }

  // Dynamic Transit Multipliers for Accident/Surgery on targetDate
  if (transitHouses.Mars && [1, 6, 8, 12].includes(transitHouses.Mars)) accidentScore += 16;
  if (transitHouses.Mars && transitHouses.Mars === 5) accidentScore += 10; // Mars 4th aspect to 8H
  if (transitHouses.Saturn && [2, 6, 8].includes(transitHouses.Saturn)) accidentScore += 12; // Saturn 7th/3rd aspect to 8H
  if (transitLons.Mars && Math.floor(transitLons.Mars / 30) === 3) accidentScore += 18; // Cancer = debilitated Mars
  if (mdLord === "Mars" || adLord === "Mars") accidentScore += 14;

  // Benefics in 8th house act as Ayushya Kawach (Protective Longevity Shield)
  if (h8Benefics >= 2) {
    accidentScore = Math.min(20, Math.round(accidentScore * 0.35));
  } else if (h8Benefics === 1) {
    accidentScore = Math.round(accidentScore * 0.65);
  }

  accidentScore = Math.min(95, accidentScore);

  // 8. Top Concerns & Overall Risk Level
  const topConcerns = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, v]) => v >= 15)
    .slice(0, 4)
    .map(([k]) => k);

  const maxScore = Math.max(accidentScore, ...Object.values(scores));
  const riskLevel: MedicalResult["riskLevel"] =
    maxScore >= 48 || triggeredCombos.filter(c => c.severity === "high").length >= 2
      ? "high"
      : maxScore >= 24 || triggeredCombos.length > 0
      ? "moderate"
      : "low";

  // 9. Dasha Timing Integration (Mahadasha, Antardasha, and Pratyantardasha)
  const dashaItems: { lord: string; level: "Mahadasha" | "Antardasha" | "Pratyantardasha" }[] = [
    { lord: mdLord, level: "Mahadasha" },
    { lord: adLord, level: "Antardasha" },
    ...(pdLord ? [{ lord: pdLord, level: "Pratyantardasha" as const }] : []),
  ];

  const timingAlerts: MedicalResult["timingAlerts"] = dashaItems.map(({ lord, level }) => {
    const card = planetCards.find(c => c.planet === lord);
    const isDusthana = card?.inDusthana;
    const isCombust = card?.isCombust;
    const isMalefic = card?.funcNature === "malefic" || ["Mars", "Saturn", "Rahu", "Ketu"].includes(lord);
    const isTransitDebilitated = transitLons[lord] && Math.floor(transitLons[lord] / 30) === 3 && lord === "Mars";

    // Navtara check
    let isNaidhanaOrVipat = false;
    try {
      const moonNak = getNakshatraFromLongitude(chart.planets.Moon.lon);
      const pLon = planets[lord]?.lon ?? 0;
      const pNak = getNakshatraFromLongitude(pLon);
      const diff = ((pNak.index - moonNak.index) % 9 + 9) % 9;
      const tara = NAVTARA[diff];
      if (["Naidhana", "Vipat"].includes(tara.name)) isNaidhanaOrVipat = true;
    } catch {}

    const severity: "low" | "medium" | "high" =
      (isMalefic && (isDusthana || isTransitDebilitated || isNaidhanaOrVipat)) || (lord === "Mars" && level !== "Pratyantardasha") || (lord === "Mercury" && isNaidhanaOrVipat)
        ? "high"
        : (isDusthana || isCombust || isMalefic || card?.retrograde)
        ? "medium"
        : "low";

    const concernStr = concernForPlanet(lord, card);

    return {
      planet: lord,
      level,
      concern: concernStr,
      severity,
      message: severity === "high"
        ? `${level} ${lord} is active under elevated vulnerability (${concernStr.toLowerCase()}); strong acute sensitivity indicator. Proactively adhere to medical precautions.`
        : `${level} ${lord} is active; monitor ${concernStr.toLowerCase()} and maintain healthy daily pacing.`,
    };
  });

  // 9b. Major Event / Crisis Indicator Evaluator
  const activeLayers: string[] = [];
  const reasons: string[] = [];

  // Criterion 1: Dual Maraka / Martial Dasha Alignment
  if (mdLord === "Mars" && adLord === "Mars") {
    activeLayers.push("Dual Mars MD/AD (Martial Fire Surge)");
    reasons.push("Both Mahadasha and Antardasha ruled by Mars (acute physical / surgical / inflammatory karaka).");
  }

  // Criterion 2: Pratyantardasha in Dusthana / Neuro-organ
  if (pdLord === "Mercury" && (houseLords[8]?.lord === "Mercury" || houseLords[12]?.lord === "Mercury" || planets.Mercury?.house === 10)) {
    activeLayers.push("Mercury PD (8H/12H & Neurological Karaka)");
    reasons.push("Pratyantardasha lord Mercury governs cranial nerves, speech, motor reflexes, and rules/occupies critical dusthanas.");
  }

  // Criterion 3: Transit Ingress / Debilitation
  if (transitLons.Mars && Math.floor(transitLons.Mars / 30) === 3) {
    activeLayers.push("Mars in Debilitation (Cancer Transit)");
    reasons.push("Mars transiting its debilitated sign (Cancer), severely destabilizing physical resistance and blood pressure.");
  } else if (transitHouses.Mars && [5, 6, 8, 12].includes(transitHouses.Mars)) {
    activeLayers.push(`Mars Transit Aspect on Dusthana H${transitHouses.Mars}`);
    reasons.push(`Mars transiting house ${transitHouses.Mars} casting 4th/8th aspect onto acute vulnerability zones.`);
  }

  // Criterion 4: Retrograde Saturn in Dusthana
  if (transitHouses.Saturn && [2, 6, 8, 12].includes(transitHouses.Saturn)) {
    activeLayers.push(`Retrograde Saturn in Dusthana H${transitHouses.Saturn}`);
    reasons.push(`Saturn transiting house ${transitHouses.Saturn} casting relentless 7th/3rd aspects on critical recovery axes.`);
  }

  // Criterion 5: Navtara Naidhana / Vadha Alignment
  try {
    const moonNak = getNakshatraFromLongitude(chart.planets.Moon.lon);
    const mNak = getNakshatraFromLongitude(planets.Mercury?.lon ?? 0);
    const diff = ((mNak.index - moonNak.index) % 9 + 9) % 9;
    if (NAVTARA[diff]?.name === "Naidhana") {
      activeLayers.push("PD Lord in Naidhana (7th Vadha Tara)");
      reasons.push("Pratyantardasha lord Mercury is natal-placed in Naidhana (Death/Endings) Tara from Janma Moon.");
    }
  } catch {}

  const convergingLayersCount = activeLayers.length;
  const isMajorCandidate = convergingLayersCount >= 3;
  const majorScore = Math.min(100, convergingLayersCount * 22 + (isMajorCandidate ? 15 : 0));

  const majorLevel: MajorEventIndicator["level"] =
    convergingLayersCount >= 4
      ? "Extreme Major Crisis"
      : convergingLayersCount >= 3
      ? "Elevated Acute Warning"
      : convergingLayersCount >= 2
      ? "Moderate Sensitivity"
      : "Standard Baseline";

  const whyMajorExplanation = isMajorCandidate
    ? `Multiple independent classical timing layers (${convergingLayersCount} layers: ${activeLayers.join(" + ")}) converge simultaneously on this date. In classical Jyotish, an event is classified as MAJOR when Dasha lords simultaneously act as Maraka/Dusthana rulers, transit reaches debilitation/sandhi, and Navtara activates Naidhana/Vipat Tara.`
    : `Current timing indicators show moderate background activity (${convergingLayersCount} layers active). Pacing and routine preventive care recommended.`;

  const majorEventIndicator: MajorEventIndicator = {
    isMajorCandidate,
    level: majorLevel,
    score: majorScore,
    convergingLayersCount,
    activeLayers,
    reasons,
    whyMajorExplanation,
  };

  // 10. Personalized Preventive Routine & Safe Tone Summary
  const preventiveRoutine = [
    topConcerns.length
      ? `Track ${topConcerns.slice(0, 2).join(" and ")} health markers periodically; prioritize clinical consultation if symptoms repeat.`
      : "Maintain a consistent baseline check of sleep, hydration, digestion, and daily endurance markers.",
    accidentScore >= 30
      ? "Exercise mindful patience while driving, traveling, and using sharp equipment during high-stress days."
      : "Engage in regular physical mobility and balanced exercise without sudden over-exertion.",
    tridoshaBreakdown.lifestyleGuidance,
    `Support digestive fire (${agniProfile.title}) by honoring your body's natural hunger cues and avoiding rushed eating.`,
  ];

  const safeToneSummary = [
    "This analysis identifies astrological tendencies and vitality patterns based on classical Parashari principles.",
    "No statement constitutes clinical diagnosis, medical prediction, or prescription.",
    "Traditional references like Rajyakshma (Tuberculosis), Netra Roga, or Angarak Yoga describe constitutional focal points, not inevitable diagnoses.",
    "Always consult licensed healthcare professionals for medical advice, symptoms, and health decisions.",
  ];

  // 11. Traditional Ayurvedic Protocols (AYU Journal)
  const activePlanet = mdLord || "Sun";
  const snanAushadhi = PLANETARY_SNAN_AUSHADHI[activePlanet] || PLANETARY_SNAN_AUSHADHI.Sun;
  const daanKaal = PLANETARY_DAAN_KAAL[activePlanet] || PLANETARY_DAAN_KAAL.Sun;
  const isJeerna = triggeredCombos.some(c => c.severity === "high") || riskLevel === "high";
  const ayurvedicPrognosis = evaluateAyurvedicPrognosis(riskLevel, ojasScore, isJeerna);

  // 12. Family Health Overview (Bhavat Bhavam)
  const familyKeys: FamilyMemberKey[] = ["Self", "Father", "Mother", "Spouse", "Children", "Younger sibling", "Elder sibling"];
  const familyHealthOverview = {} as Record<FamilyMemberKey, FamilyMedicalScanResult>;
  familyKeys.forEach(k => {
    familyHealthOverview[k] = scanFamilyMemberHealth(chart, k, targetDate);
  });

  const futureHealthWindows = scanFutureHealthWindows(chart, "Self", 180, targetDate);

  return {
    lagnaSign,
    prakriti: PRAKRITI_LAGNA[lagnaSign] || "Mixed constitution.",
    lagnaBodyZone,
    birthNakshatra,
    birthNakshatraData,
    moonSign: moonSignRaw,
    moonSignDisease,
    birthNakshatraUpay,
    tridoshaBreakdown,
    agniProfile,
    ojasScore,
    ojasRating,
    dhatuAfflictions,
    planetCards,
    houseLords,
    healthScores: scores,
    accidentScore,
    triggeredCombos,
    topConcerns,
    riskLevel,
    timingAlerts,
    majorEventIndicator,
    preventiveRoutine,
    safeToneSummary,
    snanAushadhi,
    daanKaal,
    ayurvedicPrognosis,
    familyHealthOverview,
    futureHealthWindows,
  };
}
