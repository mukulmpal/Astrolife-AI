// ============================================================
// ASTROLIFE MEDICAL ASTROLOGY ENGINE
// Based on Dr. S. Krishna Kumar's Medical Astrology
// Covers: Nakshatra disease tendencies, Planet-House disease
// patterns, Lagna sign prakriti, Tridosha analysis
// ============================================================

import type { ChartData } from "./calculations";

// ── Data Structures ──────────────────────────────────────────

const NAKSHATRA_DISEASE: Record<string, { disease: string; body: string; note: string }> = {
  Ashwini:       { disease: "Periodical fever",                                              body: "Head",                    note: "Speed+fire nature — high metabolism, fever tendency" },
  Bharani:       { disease: "Dysentery / digestive infections",                              body: "Head/face",               note: "Yama ruled — elimination disorders" },
  Krittika:      { disease: "Intestinal disease — constipation & diarrhoea alternately",     body: "Face/neck",               note: "Agni ruled — digestive fire imbalance" },
  Rohini:        { disease: "Piles / ano-rectal disorders",                                  body: "Face/neck",               note: "Fertility+earth — digestive heaviness" },
  Mrigashira:    { disease: "Indigestion",                                                   body: "Neck/shoulders",          note: "Moon ruled — irregular digestive rhythm" },
  Ardra:         { disease: "Mandagni — weak digestion",                                     body: "Arms/shoulders",          note: "Rudra ruled — storm energy disrupts digestion" },
  Punarvasu:     { disease: "Cholera",                                                       body: "Arms/chest",              note: "Aditi ruled — water-borne illness tendency" },
  Pushya:        { disease: "Tastelessness / Anorexia",                                      body: "Face/mouth",              note: "Brihaspati ruled — appetite disorders" },
  Ashlesha:      { disease: "Anemia",                                                        body: "Ears/nape",               note: "Sarpa ruled — toxic blood, venom-like weakness" },
  Magha:         { disease: "Respiratory disease / breathing problems",                      body: "Chin/upper back",         note: "Pitru ruled — ancestral respiratory pattern" },
  "Purva Phalguni":  { disease: "Cough — dry or wet",                                        body: "Right hand",              note: "Surya ruled — pitta-driven chest issues" },
  "Uttara Phalguni": { disease: "Leprosy / skin disease",                                    body: "Left hand/fingers",       note: "Aryama ruled — skin boundary issues" },
  Hasta:         { disease: "Diabetes of various types",                                     body: "Fingers/hands",           note: "Savitru ruled — sugar processing weakness" },
  Chitra:        { disease: "Giddiness / partial loss of consciousness",                     body: "Neck/forehead",           note: "Twashtru ruled — neural/vestibular issues" },
  Swati:         { disease: "Eye diseases",                                                  body: "Chest",                   note: "Vayu ruled — air imbalance affecting vision" },
  Vishakha:      { disease: "Ear diseases",                                                  body: "Lungs/chest",             note: "Indra ruled — hearing sensitivity" },
  Anuradha:      { disease: "Nasal disease / sinusitis",                                     body: "Stomach",                 note: "Mitra ruled — nasal passage sensitivity" },
  Jyeshtha:      { disease: "Mouth disease — teeth, tongue, lips, gums, throat",             body: "Right stomach",           note: "Moon ruled — oral cavity disorders" },
  Mula:          { disease: "Tuberculosis of any type",                                      body: "Left stomach/thighs",     note: "Rakshasa ruled — root destruction, degenerative" },
  "Purva Ashadha":   { disease: "Urinary stones / kidney stones",                            body: "Back/hips",               note: "Jala Devata ruled — water-mineral imbalance" },
  "Uttara Ashadha":  { disease: "Vomiting disorders",                                        body: "Waist/back",              note: "Vishwa Devathas — digestive reversal tendency" },
  Shravana:      { disease: "Tastelessness disease (Agnimandya)",                            body: "Upper genitals/knees",    note: "Vishnu ruled — assimilation weakness" },
  Dhanishtha:    { disease: "Vata disorders — sprains, rheumatism, joint pain",              body: "Genitals/ankles",         note: "Ashta Vasu — wind-dominated pain" },
  Shatabhisha:   { disease: "Bilious diseases (Pitta disorders)",                            body: "Right thigh/calves",      note: "Varuna ruled — liver-bile imbalance" },
  "Purva Bhadrapada":  { disease: "Phlegmatic diseases (Kapha disorders)",                   body: "Right thigh/feet",        note: "Jala ruled — mucus, congestion, fluid" },
  "Uttara Bhadrapada": { disease: "Diseases from fatigue / exhaustion",                      body: "Ankle/feet",              note: "Brahma ruled — depletion from overwork" },
  Revati:        { disease: "Diseases from boils and wounds",                                body: "Feet",                    note: "Poosha ruled — skin eruptions, festering wounds" },
};

// Planet x House diseases
const PLANET_HOUSE_DISEASE: Record<string, Record<number, string>> = {
  Sun: {
    1: "Head injury risk, fever, high BP.",
    2: "Right eye sensitivity, dental issues.",
    3: "Shoulder/arm trouble, upper respiratory.",
    4: "Heart stress, chest inflammation.",
    5: "Stomach heat, acid reflux.",
    6: "Bilious fever, digestive disorders.",
    7: "Right eye affliction, relationship stress→BP.",
    8: "Chronic fever, vitality depletion.",
    9: "Hip/thigh region, liver sensitivity.",
    10: "Knee stress from work pressure.",
    11: "Left eye sensitivity, leg circulation.",
    12: "Eye disease, sleep disorder, vitality loss.",
  },
  Moon: {
    1: "Mental sensitivity, fluid imbalance.",
    2: "Face/mouth issues, dental sensitivity.",
    3: "Lung sensitivity, cold-cough.",
    4: "Chest/breast sensitivity.",
    5: "Stomach sensitivity, nausea.",
    6: "Nasal disease, mental stress.",
    7: "Urinary issues, reproductive sensitivity.",
    8: "Menstrual irregularity, fluid disorders.",
    9: "Hip/thigh sensitivity.",
    10: "Skin issues from public exposure.",
    11: "Left ear sensitivity, leg fluid.",
    12: "Left eye weakness, sleep disorder.",
  },
  Mars: {
    1: "Head injury, fever, high BP, accident prone.",
    2: "Mouth ulcers, dental inflammation.",
    3: "Shoulder injury, nerve irritation.",
    4: "Chest inflammation, home accidents.",
    5: "Stomach heat, acid reflux.",
    6: "Infection, surgery risk.",
    7: "Emotional disease/BP, relationship aggression.",
    8: "Accident, surgery, blood disorder.",
    9: "Hip injury, sciatica.",
    10: "Knee injury, work stress.",
    11: "Leg injury, blood circulation.",
    12: "Foot injury, sleep disturbance.",
  },
  Mercury: {
    1: "Nervous sensitivity, skin issues, speech strain.",
    2: "Dental problems.",
    3: "Nerve anxiety, respiratory sensitivity.",
    4: "Lung-nerve connection, anxiety.",
    5: "Intestinal sensitivity, IBS tendency.",
    6: "TB risk.",
    7: "Reproductive nerve issues.",
    8: "Hidden nerve disorders, chronic anxiety.",
    9: "Sciatic nerve, hip nerve pain.",
    10: "Nerve stress, skin issues.",
    11: "Ear-nerve connection.",
    12: "Left ear weakness, sleep-related nerve disorder.",
  },
  Jupiter: {
    1: "Fat body tendency, liver size.",
    2: "Dental protection, throat health.",
    3: "Lung expansion, generally protective.",
    4: "Chest/heart protection.",
    5: "Slow digestion, liver sluggishness.",
    6: "Liver disease, diabetes risk.",
    7: "Kidney sensitivity, reproductive health.",
    8: "Nephritis, transformation health.",
    9: "Hip/liver/thigh, fortune protection.",
    10: "Knee joint, career expansion stress.",
    11: "Blood sugar, arterial health.",
    12: "Foreign illness, hospital stays.",
  },
  Venus: {
    1: "Reproductive sensitivity, hormonal.",
    2: "Right eye sensitivity, facial.",
    3: "Throat sensitivity, vocal cords.",
    4: "Chest comfort, breast health.",
    5: "Reproductive creativity, ovarian sensitivity.",
    6: "Right eye affliction.",
    7: "Venereal/reproductive disease.",
    8: "Reproductive organs, sexual disease risk.",
    9: "Hip/thigh comfort.",
    10: "Kidney stress from career.",
    11: "Blood sugar, venous circulation.",
    12: "Night blindness, hidden reproductive.",
  },
  Saturn: {
    1: "Weak immunity, chronic fatigue, thin/lean body.",
    2: "Tooth decay, speech difficulty.",
    3: "Shoulder stiffness, nerve compression.",
    4: "Lung weakness, depression risk.",
    5: "Slow digestion, infertility, chronic stomach.",
    6: "Arthritis, chronic disease.",
    7: "Sexual weakness, chronic kidney.",
    8: "Long-term disease, genetic inheritance.",
    9: "Hip arthritis, chronic sciatica.",
    10: "Knee pain.",
    11: "Leg cramps, varicose veins.",
    12: "Foot nerve damage, hospitalization risk.",
  },
  Rahu: {
    1: "Allergy, strange mysterious illness.",
    2: "Toxin in food/drink, addiction tendency.",
    3: "Nerve anxiety, unusual respiratory.",
    4: "Lung toxicity, pollution sensitivity.",
    5: "Eye strain, screen addiction.",
    6: "Mysterious undiagnosed disease.",
    7: "Sexual disease, obsessive relationship health.",
    8: "Sudden surgery, accident risk.",
    9: "Hip nerve damage, unusual pain patterns.",
    10: "Stress disorder.",
    11: "Blood toxicity, unusual circulation.",
    12: "Sleep disorder, hidden addiction.",
  },
  Ketu: {
    1: "Hidden weakness, mysterious inflammation.",
    2: "Unusual dental, toxin absorption.",
    3: "Nerve depletion, respiratory pattern.",
    4: "Psychosomatic home illness.",
    5: "Hidden eye issues, neural confusion.",
    6: "Mysterious disease hard to diagnose.",
    7: "Hidden reproductive issue.",
    8: "Karmic surgery, mysterious illness.",
    9: "Karmic hip pain, past-life sciatica.",
    10: "Mysterious career illness.",
    11: "Hidden blood issue, low immunity spikes.",
    12: "Moksha-level illness, past-life karmic disease.",
  },
};

const SIGN_DISEASE: Record<string, string> = {
  Mesha:       "Bilious fever, stomach problems.",
  Vrishabha:   "Tridosha diseases, risk from fire.",
  Mithuna:     "Body pain, excessive internal heat.",
  Karka:       "Insanity tendency, digestive imbalance.",
  Simha:       "Fever, risk from animals/enemies.",
  Kanya:       "Venereal diseases, falls.",
  Tula:        "Fever, post-pregnancy complications.",
  Vrishchika:  "Jaundice, liver issues.",
  Dhanu:       "Falls from height and weapons risk.",
  Makara:      "Tremendous pain, mental imbalance.",
  Kumbha:      "Fever, tuberculosis, respiratory problems.",
  Meena:       "Urinary infections, lymphatic.",
};

const PRAKRITI_LAGNA: Record<string, string> = {
  Mesha:       "Pitta dominant — sharp, hot, inflammatory. Avoid excess spicy food, sun exposure, anger.",
  Vrishabha:   "Kapha dominant — stable, heavy, slow metabolism. Watch weight, congestion, thyroid.",
  Mithuna:     "Vata dominant — quick, nervous, changeable. Protect digestion, routine critical.",
  Karka:       "Kapha-Vata — emotional, fluid retention, respiratory sensitivity.",
  Simha:       "Pitta dominant — strong vitality, heart sensitivity, spine focus.",
  Kanya:       "Vata-Pitta — analytical stress, intestinal sensitivity, nerve-gut axis.",
  Tula:        "Vata-Kapha — kidney sensitivity, hormonal balance key.",
  Vrishchika:  "Pitta-Kapha — hidden disorders, reproductive and transformation health.",
  Dhanu:       "Pitta-Vata — liver/hip sensitive, philosophical stress.",
  Makara:      "Vata dominant — bones/joints, chronic conditions after 35.",
  Kumbha:      "Vata-Pitta — circulation, neurological, unconventional ailments.",
  Meena:       "Kapha-Vata — feet/lymph/immunity, psychosomatic, spiritual health link.",
};

// ── Types ────────────────────────────────────────────────────

export interface HealthAlert {
  planet: string;
  house: number;
  disease: string;
  severity: "high" | "medium" | "low";
  note: string;
  type: "natal" | "combination" | "nakshatra" | "lagna";
}

export interface HealthScores {
  Heart: number;
  Digestive: number;
  Mental: number;
  Eye: number;
  Bone: number;
  Respiratory: number;
  Reproductive: number;
  Skin: number;
}

export interface MedicalResult {
  prakriti: string;
  lagnaSign: string;
  birthNakshatra: string;
  nakshatraDisease: { disease: string; body: string; note: string } | null;
  lagnaDiseaseSign: string;
  alerts: HealthAlert[];
  scores: HealthScores;
  accidentRisk: number; // 0–100
  topConcerns: string[]; // top 3 health concerns
}

// ── Helpers ──────────────────────────────────────────────────

function getSeverity(house: number, planet: string): "high" | "medium" | "low" {
  const DUSTHANA = [6, 8, 12];
  const MALEFICS = ["Saturn", "Mars", "Rahu", "Ketu", "Sun"];
  if (DUSTHANA.includes(house)) return "high";
  if (MALEFICS.includes(planet) && [2, 3, 4, 5, 7].includes(house)) return "medium";
  return "low";
}

function cap(val: number): number {
  return Math.min(95, val);
}

// ── Main Engine ──────────────────────────────────────────────

export function calculateMedical(chart: ChartData): MedicalResult {
  const lagnaSign = chart.lagnaRashi;
  const moonData = chart.planets["Moon"];
  const birthNakshatra = moonData?.nakshatra ?? "";

  const prakriti = PRAKRITI_LAGNA[lagnaSign] ?? "Constitutional analysis unavailable for this lagna.";
  const lagnaDiseaseSign = SIGN_DISEASE[lagnaSign] ?? "";
  const nakshatraDisease = birthNakshatra ? (NAKSHATRA_DISEASE[birthNakshatra] ?? null) : null;

  // ── Planet-house alerts ─────────────────────────────────────
  const alerts: HealthAlert[] = [];

  const PLANET_LIST = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const planet of PLANET_LIST) {
    const pData = chart.planets[planet];
    if (!pData) continue;
    const house = pData.house;
    const diseaseMap = PLANET_HOUSE_DISEASE[planet];
    if (!diseaseMap) continue;
    const disease = diseaseMap[house];
    if (!disease) continue;

    alerts.push({
      planet,
      house,
      disease,
      severity: getSeverity(house, planet),
      note: `${planet} in House ${house}`,
      type: "natal",
    });
  }

  // ── Combination alerts ──────────────────────────────────────
  const marsData    = chart.planets["Mars"];
  const saturnData  = chart.planets["Saturn"];
  const rahuData    = chart.planets["Rahu"];
  const venusData   = chart.planets["Venus"];

  // Mars + Rahu conjunction (same house)
  if (marsData && rahuData && marsData.house === rahuData.house) {
    alerts.push({
      planet: "Mars+Rahu",
      house: marsData.house,
      disease: "Accident and surgery risk — Mars-Rahu conjunction in House " + marsData.house + ".",
      severity: "high",
      note: "Classical combination for trauma, accident, sudden surgery.",
      type: "combination",
    });
  }

  // Mars + Saturn conjunction
  if (marsData && saturnData && marsData.house === saturnData.house) {
    alerts.push({
      planet: "Mars+Saturn",
      house: marsData.house,
      disease: "Chronic inflammation, bone-muscle conflict — Mars-Saturn conjunction.",
      severity: "high",
      note: "Fire meets restriction — injury delays, arthritis risk.",
      type: "combination",
    });
  }

  // Moon + Saturn/Rahu — mental stress
  if (moonData && saturnData && moonData.house === saturnData.house) {
    alerts.push({
      planet: "Moon+Saturn",
      house: moonData.house,
      disease: "Depression tendency, chronic mental stress — Moon-Saturn conjunction.",
      severity: "high",
      note: "Emotional heaviness, melancholy, chronic fatigue of mind.",
      type: "combination",
    });
  }

  if (moonData && rahuData && moonData.house === rahuData.house) {
    alerts.push({
      planet: "Moon+Rahu",
      house: moonData.house,
      disease: "Mental turbulence, phobias, obsessive patterns — Moon-Rahu conjunction.",
      severity: "high",
      note: "Rahu amplifies lunar anxiety — paranoia, allergies, unusual fears.",
      type: "combination",
    });
  }

  // Rahu + Venus
  if (rahuData && venusData && rahuData.house === venusData.house) {
    alerts.push({
      planet: "Rahu+Venus",
      house: rahuData.house,
      disease: "Hormonal imbalance, reproductive obsession, unusual sexual health patterns.",
      severity: "medium",
      note: "Venus amplified by Rahu — craving-based disorders.",
      type: "combination",
    });
  }

  // Nakshatra alert
  if (nakshatraDisease && birthNakshatra) {
    alerts.push({
      planet: "Moon",
      house: moonData?.house ?? 0,
      disease: nakshatraDisease.disease,
      severity: "medium",
      note: `Birth nakshatra ${birthNakshatra} — ${nakshatraDisease.note}`,
      type: "nakshatra",
    });
  }

  // Lagna sign alert
  if (lagnaDiseaseSign) {
    alerts.push({
      planet: "Lagna",
      house: 1,
      disease: lagnaDiseaseSign,
      severity: "low",
      note: `${lagnaSign} lagna constitutional disease tendency.`,
      type: "lagna",
    });
  }

  // ── Health Scores ───────────────────────────────────────────
  const scores: HealthScores = {
    Heart:        0,
    Digestive:    0,
    Mental:       0,
    Eye:          0,
    Bone:         0,
    Respiratory:  0,
    Reproductive: 0,
    Skin:         0,
  };

  // Heart: Sun/Moon/Mars in house 4
  for (const p of ["Sun", "Moon", "Mars"]) {
    const d = chart.planets[p];
    if (d && d.house === 4) scores.Heart += 30;
  }

  // Digestive: Mercury/Saturn/Rahu in 5/6
  for (const p of ["Mercury", "Saturn", "Rahu"]) {
    const d = chart.planets[p];
    if (d && [5, 6].includes(d.house)) scores.Digestive += 25;
  }

  // Mental: Moon in 6/8/12, Moon+Saturn conjunction, Moon+Rahu conjunction
  if (moonData && [6, 8, 12].includes(moonData.house)) scores.Mental += 40;
  if (moonData && saturnData && moonData.house === saturnData.house) scores.Mental += 40;
  if (moonData && rahuData && moonData.house === rahuData.house) scores.Mental += 40;

  // Eye: Sun in 12, Venus in 6/8, Rahu in 5
  const sunData = chart.planets["Sun"];
  if (sunData && sunData.house === 12) scores.Eye += 35;
  if (venusData && [6, 8].includes(venusData.house)) scores.Eye += 35;
  if (rahuData && rahuData.house === 5) scores.Eye += 35;

  // Bone: Saturn in 1/8, Mars+Saturn conjunction
  if (saturnData && [1, 8].includes(saturnData.house)) scores.Bone += 30;
  if (marsData && saturnData && marsData.house === saturnData.house) scores.Bone += 30;

  // Respiratory: Mercury/Rahu in 3/4, Saturn in 4
  const mercuryData = chart.planets["Mercury"];
  if (mercuryData && [3, 4].includes(mercuryData.house)) scores.Respiratory += 25;
  if (rahuData && [3, 4].includes(rahuData.house)) scores.Respiratory += 25;
  if (saturnData && saturnData.house === 4) scores.Respiratory += 25;

  // Reproductive: Venus/Mars in 7/8, Rahu+Venus conjunction
  if (venusData && [7, 8].includes(venusData.house)) scores.Reproductive += 30;
  if (marsData && [7, 8].includes(marsData.house)) scores.Reproductive += 30;
  if (rahuData && venusData && rahuData.house === venusData.house) scores.Reproductive += 30;

  // Skin: Saturn in 1, Rahu in 1, Mars+Moon conjunction
  if (saturnData && saturnData.house === 1) scores.Skin += 35;
  if (rahuData && rahuData.house === 1) scores.Skin += 35;
  if (marsData && moonData && marsData.house === moonData.house) scores.Skin += 35;

  // Cap all at 95
  (Object.keys(scores) as (keyof HealthScores)[]).forEach((k) => {
    scores[k] = cap(scores[k]);
  });

  // ── Accident Risk ────────────────────────────────────────────
  let accidentRisk = 0;
  if (marsData && rahuData && marsData.house === rahuData.house) accidentRisk += 40;
  if (marsData && marsData.house === 8) accidentRisk += 30;
  if (marsData && saturnData && marsData.house === saturnData.house) accidentRisk += 25;
  if (rahuData && rahuData.house === 8) accidentRisk += 20;
  accidentRisk = cap(accidentRisk);

  // ── Top 3 Concerns ───────────────────────────────────────────
  const scoreEntries = Object.entries(scores) as [string, number][];
  scoreEntries.sort((a, b) => b[1] - a[1]);
  const topConcerns = scoreEntries.slice(0, 3).map(([k]) => k);

  return {
    prakriti,
    lagnaSign,
    birthNakshatra,
    nakshatraDisease,
    lagnaDiseaseSign,
    alerts,
    scores,
    accidentRisk,
    topConcerns,
  };
}
