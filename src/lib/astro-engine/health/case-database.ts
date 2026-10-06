/**
 * ============================================================================
 * ASTROLIFE — MEDICAL TRANSCRIPT CASEBOOK DATABASE (PHASE 2I-MED)
 * ============================================================================
 * Ground-truth verified classroom cases from teacher transcripts:
 * Each case includes:
 * - Specific reported symptoms
 * - Active planetary and house signifiers
 * - Exact teacher interpretation and deductive reasoning chain
 * - Safe traditional remedies and outcome observations
 * ============================================================================
 */

import type { MedicalCase } from "./types";

export const MEDICAL_CASEBOOK: MedicalCase[] = [
  {
    id: "CASE-MED-001",
    title: "Cutaneous Allergy, Erythema & Dry Eczema",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Skin itching", "Dry erythematous rash", "Urticarial bumps", "Epidermal dryness"],
    bodySystems: ["dermatological"],
    chartSignifiers: {
      primaryPlanets: ["Venus", "Mercury"],
      housesInvolved: [6, 1],
      cuspSubLords: {
        cusp1CSL: "Mercury",
        cusp6CSL: "Venus",
      },
      dashaAtOnset: {
        mahadasha: "Venus",
        antardasha: "Mercury",
      },
    },
    combinationRulesTriggered: ["COMB-VEN-MERC-SKIN-ALLERGY"],
    teacherInterpretation:
      "Venus governs the dermal texture and sweat secretions; Mercury governs sensory cutaneous nerves and histamine allergic response. Their conjunction connecting with the 6th cusp sub-lord produces recurrent allergic dermatitis without deep tissue necrosis.",
    remedySymbolism:
      "Feed green fodder to cows (Mercury); apply cool virgin coconut oil topically; hydrate with unsalted barley water.",
    caseOutcomeNotes:
      "Symptoms responded favorably to standard dermatological antihistamines combined with skin-barrier hydration.",
    relevanceConfidence: 0.94,
  },

  {
    id: "CASE-MED-002",
    title: "Pulmonary Infection Transitioning to Neuromuscular Weakness",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: [
      "Chronic cough",
      "Opportunistic lung infection (TB theme)",
      "Motor limb heaviness",
      "Partial motor weakness",
    ],
    bodySystems: ["respiratory", "neurological"],
    chartSignifiers: {
      primaryPlanets: ["Rahu", "Mercury", "Saturn", "Mars"],
      housesInvolved: [6, 8, 12],
      cuspSubLords: {
        cusp6CSL: "Rahu",
        cusp8CSL: "Saturn",
      },
      dashaAtOnset: {
        mahadasha: "Rahu",
        antardasha: "Mercury",
        pratyantar: "Saturn",
      },
    },
    combinationRulesTriggered: [
      "COMB-MERC-RAHU-PULMONARY-INFECTION",
      "COMB-MERC-SAT-MARS-NEUROMUSCULAR",
    ],
    teacherInterpretation:
      "Rahu in the 6th connecting with Mercury activated a serious pulmonary infection with oxygen drops; the subsequent progression into Saturn (obstruction) and Mars (nerve tension) involved motor pathways, illustrating classical sequential dasha manifestation.",
    remedySymbolism:
      "Recite Maha Mrityunjaya mantra; perform gentle diaphragmatic pranayama; provide warm blankets and food to sanitation workers.",
    caseOutcomeNotes:
      "Managed through sustained pulmonary antibiotic regimen followed by intensive physical rehabilitation.",
    relevanceConfidence: 0.96,
  },

  {
    id: "CASE-MED-003",
    title: "Renal Filtration Stress & Dialysis Pattern",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: [
      "Kidney filtration compromise",
      "Fluid retention",
      "Elevated blood urea / creatinine",
      "Artificial filtration requirement",
    ],
    bodySystems: ["renal_urinary", "hematological"],
    chartSignifiers: {
      primaryPlanets: ["Venus", "Mars", "Rahu"],
      housesInvolved: [6, 8, 12],
      cuspSubLords: {
        cusp6CSL: "Venus",
        cusp8CSL: "Mars",
        cusp12CSL: "Rahu",
      },
      dashaAtOnset: {
        mahadasha: "Venus",
        antardasha: "Mars",
      },
    },
    combinationRulesTriggered: ["COMB-VEN-MARS-RAHU-RENAL-STRESS"],
    teacherInterpretation:
      "Venus (kidneys) severely afflicted by Mars (inflammatory vascular damage) and Rahu (systemic toxicity and machine intervention) with strong 8th (degeneration) and 12th (clinical confinement) participation.",
    remedySymbolism:
      "Donate to kidney dialysis charitable funds; feed stray dogs (Rahu); avoid high-potassium/high-sodium foods as medically indicated.",
    caseOutcomeNotes:
      "Chronic renal maintenance managed under clinical nephrology protocol.",
    relevanceConfidence: 0.95,
  },

  {
    id: "CASE-MED-004",
    title: "Cellular Hyperplasia & Post-Intervention Convalescence",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: [
      "Abnormal cellular lump/mass",
      "Severe fatigue",
      "Intensive systemic treatment exhaustion",
      "Inpatient hospital stays",
    ],
    bodySystems: ["metabolic", "hematological", "digestive"],
    chartSignifiers: {
      primaryPlanets: ["Jupiter", "Mars", "Rahu"],
      housesInvolved: [6, 8, 12],
      cuspSubLords: {
        cusp6CSL: "Jupiter",
        cusp8CSL: "Mars",
        cusp12CSL: "Rahu",
      },
      dashaAtOnset: {
        mahadasha: "Jupiter",
        antardasha: "Rahu",
      },
    },
    combinationRulesTriggered: ["COMB-JUP-MARS-RAHU-HYPERPLASIA"],
    teacherInterpretation:
      "Jupiter represents cellular proliferation; under afflictive tension from Mars (acute mutations) and Rahu (atypical multiplication), 12th house activation indicated extensive oncology hospital therapy.",
    remedySymbolism:
      "Sponsor medical supplies for needy cancer patients; listen to Durga Kavacham; practice light morning sun dhyana.",
    caseOutcomeNotes:
      "Achieved clinical remission after full medical oncology regimen.",
    relevanceConfidence: 0.93,
  },

  {
    id: "CASE-MED-005",
    title: "Vertebral Compression & Hyperchlorhydria (Back Pain + Acidity)",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: [
      "Lumbar spine stiffness",
      "Sciatic nerve ache",
      "Severe acid reflux / bile burning",
      "Morning heartburn",
    ],
    bodySystems: ["musculoskeletal", "digestive"],
    chartSignifiers: {
      primaryPlanets: ["Saturn", "Ketu", "Sun"],
      housesInvolved: [6, 8],
      cuspSubLords: {
        cusp6CSL: "Saturn",
      },
      dashaAtOnset: {
        mahadasha: "Saturn",
        antardasha: "Ketu",
      },
    },
    combinationRulesTriggered: ["COMB-SAT-KETU-SPINAL-ACIDITY"],
    teacherInterpretation:
      "Saturn Mahadasha with Ketu (spinal column) connecting to Sun (Jatharagni/acid) in 6th house produced simultaneous mechanical lumbar stiffness and intense gastric acidity.",
    remedySymbolism:
      "Sesame oil massage on lower back; early light dinner; distribute yellow lentils/fruits to poor workers.",
    caseOutcomeNotes:
      "Resolved with postural physiotherapy and dietary acidity moderation.",
    relevanceConfidence: 0.94,
  },

  {
    id: "CASE-MED-006",
    title: "Nephrolithiasis / Kidney Stone Obstruction",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: [
      "Flank pain",
      "Urinary burning",
      "Crystalline calculus formation",
      "Intermittent spasms",
    ],
    bodySystems: ["renal_urinary"],
    chartSignifiers: {
      primaryPlanets: ["Venus", "Saturn"],
      housesInvolved: [6, 8],
      cuspSubLords: {
        cusp6CSL: "Venus",
        cusp8CSL: "Saturn",
      },
      dashaAtOnset: {
        mahadasha: "Venus",
        antardasha: "Saturn",
      },
    },
    combinationRulesTriggered: ["COMB-VEN-SAT-NEPHROLITHIASIS"],
    teacherInterpretation:
      "Venus (kidneys, urine) conjoined with Saturn (calculi, calcification, obstruction) in 6/8 houses repeatedly points to crystalline stone precipitation.",
    remedySymbolism:
      "Drink barley water regularly; maintain 3 liters water intake; chant Maha Mrityunjaya mantra on Saturdays.",
    caseOutcomeNotes:
      "Stone flushed naturally with clinical hydration protocol and medication.",
    relevanceConfidence: 0.95,
  },

  {
    id: "CASE-MED-007",
    title: "Hemodynamic Blood Pressure Spikes & Sleep Disturbance",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: [
      "Fluctuating blood pressure",
      "Nocturnal restlessness",
      "Occasional headaches",
      "Palpitations under stress",
    ],
    bodySystems: ["cardiovascular", "mental_emotional"],
    chartSignifiers: {
      primaryPlanets: ["Mars", "Moon"],
      housesInvolved: [6, 8],
      cuspSubLords: {
        cusp6CSL: "Mars",
      },
      dashaAtOnset: {
        mahadasha: "Mars",
        antardasha: "Moon",
      },
    },
    combinationRulesTriggered: ["COMB-MARS-MOON-BP-FLUCTUATION"],
    teacherInterpretation:
      "Mars (arterial systolic tension) interacting with Moon (plasma fluids and heart pace) in sensitive houses generates labile BP readings during periods of emotional stress.",
    remedySymbolism:
      "Drink water from silver vessel; practice Sheetali pranayama; listen to calming flute/santoor meditation music.",
    caseOutcomeNotes:
      "Stabilized with low-sodium nutrition and mindfulness practice.",
    relevanceConfidence: 0.92,
  },

  {
    id: "CASE-MED-008",
    title: "Chronic Severe Constipation (20-Year History)",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["20-year chronic constipation", "Severe flatulence", "Intestinal Vata blockage", "Gas migrating to head"],
    bodySystems: ["digestive"],
    chartSignifiers: {
      primaryPlanets: ["Saturn", "Rahu"],
      housesInvolved: [6, 8],
      cuspSubLords: { cusp6CSL: "Saturn", cusp8CSL: "Rahu" },
      dashaAtOnset: { mahadasha: "Saturn", antardasha: "Rahu" },
    },
    combinationRulesTriggered: ["COMB-SAT-RAHU-VATA"],
    teacherInterpretation:
      "Saturn rules the large intestine and physical obstipation/blockage; Rahu generates erratic gas expansion. Their conjunction creates stubborn, decades-long Vata constipation.",
    remedySymbolism:
      "16-day Saturn remedy (black urad dal with mustard oil massage burnt on strainer and flushed in toilet); avoid black urad and fried foods.",
    caseOutcomeNotes:
      "Significant relief reported after completing the 16-day Saturn flush protocol alongside dietary fiber optimization.",
    relevanceConfidence: 0.95,
  },

  {
    id: "CASE-MED-009",
    title: "Bronchial Asthma & Opportunistic Respiratory Distress",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Wheezing / Breathlessness", "Bronchial constriction", "Nocturnal coughing spells", "Low blood oxygen drops"],
    bodySystems: ["respiratory"],
    chartSignifiers: {
      primaryPlanets: ["Jupiter", "Rahu"],
      housesInvolved: [6, 8],
      cuspSubLords: { cusp6CSL: "Jupiter", cusp8CSL: "Rahu" },
      dashaAtOnset: { mahadasha: "Jupiter", antardasha: "Rahu" },
    },
    combinationRulesTriggered: ["COMB-JUP-RAHU-ASTHMA"],
    teacherInterpretation:
      "Jupiter represents alveolar expansion; corrupted by Rahu (pathogenic respiratory hypoxia, allergic spasms), leading to chronic bronchial asthma.",
    remedySymbolism:
      "Combined 16-day Jupiter and Rahu protocols; Rahu tea-leaves burnt and flushed in toilet; gentle Anulom-Vilom breathwork.",
    caseOutcomeNotes:
      "Inhaler dependency reduced with clinical pulmonology plan and environmental dust avoidance.",
    relevanceConfidence: 0.94,
  },

  {
    id: "CASE-MED-010",
    title: "Severe Mechanical Knee Pain & Cartilage Degeneration",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Bilateral knee joint pain", "Crepitus / clicking sounds", "Inflammatory stiffness upon standing"],
    bodySystems: ["musculoskeletal"],
    chartSignifiers: {
      primaryPlanets: ["Saturn", "Mars"],
      housesInvolved: [6],
      cuspSubLords: { cusp6CSL: "Saturn" },
      dashaAtOnset: { mahadasha: "Saturn", antardasha: "Mars" },
    },
    combinationRulesTriggered: ["COMB-SAT-MARS-KNEE-PAIN"],
    teacherInterpretation:
      "Saturn governs the knees and bone density; Mars creates acute inflammatory heat and friction. Their combination targets knee joints with intense mechanical wear.",
    remedySymbolism:
      "Warm sesame oil massage on knees; 16-day Saturn remedy flushed in toilet; avoid heavy sour foods.",
    caseOutcomeNotes:
      "Managed successfully through non-weight-bearing physiotherapy and joint lubrication supplements.",
    relevanceConfidence: 0.96,
  },

  {
    id: "CASE-MED-011",
    title: "Avoided Kidney Transplant Protocol",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Critical nephron filtration decline", "Severe toxic buildup", "Transplant recommendation by hospital"],
    bodySystems: ["renal_urinary", "hematological"],
    chartSignifiers: {
      primaryPlanets: ["Venus", "Mars", "Rahu"],
      housesInvolved: [6, 8, 12],
      cuspSubLords: { cusp6CSL: "Venus", cusp8CSL: "Mars", cusp12CSL: "Rahu" },
      dashaAtOnset: { mahadasha: "Venus", antardasha: "Mars", pratyantar: "Rahu" },
    },
    combinationRulesTriggered: ["COMB-VEN-MARS-RAHU-RENAL-STRESS"],
    teacherInterpretation:
      "Triple convergence of Venus (kidneys), Mars (acute inflammation/vascular damage), and Rahu (foreign machine filtering) pointed to critical renal intervention.",
    remedySymbolism:
      "Combined Venus (chiri/curd to sink) and Rahu (tea leaves to flush) 16-day remedies; barley water hydration; Dana for dialysis patients.",
    caseOutcomeNotes:
      "Patient stabilized on optimized conservative medical nephrology therapy; emergency transplant averted.",
    relevanceConfidence: 0.97,
  },

  {
    id: "CASE-MED-012",
    title: "Surgical Cancellation Following Infection Clearance",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Scheduled emergency operation", "Atypical localized infection", "Severe inflammatory swelling"],
    bodySystems: ["hematological"],
    chartSignifiers: {
      primaryPlanets: ["Rahu", "Mars"],
      housesInvolved: [8, 12],
      cuspSubLords: { cusp8CSL: "Rahu" },
      dashaAtOnset: { mahadasha: "Rahu", antardasha: "Mars" },
    },
    combinationRulesTriggered: ["KP-MED-SURGERY-INTERVENTION-01"],
    teacherInterpretation:
      "Rahu's opportunistic infection triggered an acute surgical recommendation; clearing the Rahu infection signature eliminated the surgical indication.",
    remedySymbolism:
      "16-day Rahu remedy (tea leaves burnt on strainer and flushed in toilet); strict avoidance of tea/coffee.",
    caseOutcomeNotes:
      "Follow-up scans confirmed resolution of acute infection; surgery cancelled by attending medical team.",
    relevanceConfidence: 0.94,
  },

  {
    id: "CASE-MED-013",
    title: "Neurodevelopmental & Speech Delay Sensitivity (Autism Context)",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Delayed verbal communication", "Sensory motor processing differences", "Nervous hypersensitivity"],
    bodySystems: ["neurological"],
    chartSignifiers: {
      primaryPlanets: ["Mercury"],
      housesInvolved: [6, 1],
      cuspSubLords: { cusp1CSL: "Mercury", cusp6CSL: "Mercury" },
      dashaAtOnset: { mahadasha: "Mercury", antardasha: "Mercury" },
    },
    combinationRulesTriggered: ["COMB-MERCURY-SOLO-NEURO"],
    teacherInterpretation:
      "Mercury governs neural synaptic pathways, brain cortex communication, and speech organs. An afflicted Mercury in early developmental years creates sensory transmission delays.",
    remedySymbolism:
      "16-day Mercury remedy (green moong + 2 green cardamoms burnt and disposed in kitchen sink); feed green fodder to cows.",
    caseOutcomeNotes:
      "Marked progress achieved through dedicated clinical speech therapy and behavioral occupational therapy.",
    relevanceConfidence: 0.93,
  },

  {
    id: "CASE-MED-014",
    title: "Cognitive Impairment & Memory Blockage (Alzheimer's Theme)",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Progressive memory retrieval loss", "Cerebral circulation slowing", "Cognitive confusion"],
    bodySystems: ["neurological"],
    chartSignifiers: {
      primaryPlanets: ["Mercury", "Saturn"],
      housesInvolved: [6, 8],
      cuspSubLords: { cusp6CSL: "Mercury", cusp8CSL: "Saturn" },
      dashaAtOnset: { mahadasha: "Saturn", antardasha: "Mercury" },
    },
    combinationRulesTriggered: ["COMB-MERC-SAT-MARS-NEUROMUSCULAR"],
    teacherInterpretation:
      "Mercury (synaptic memory retention) obstructed by Saturn (degenerative calcification, chronic blockage) mirrors classical cognitive stagnation patterns.",
    remedySymbolism:
      "16-day Saturn protocol flushed in toilet; gentle Brahmi / Shankhpushpi cognitive support under Ayurvedic physician guidance.",
    caseOutcomeNotes:
      "Progression slowed with structured neurological brain exercises and memory cueing routines.",
    relevanceConfidence: 0.95,
  },

  {
    id: "CASE-MED-015",
    title: "Cholelithiasis (Gallbladder Stone Obstruction)",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Right upper quadrant abdominal pain", "Fatty food intolerance", "Gallbladder calculus on ultrasound"],
    bodySystems: ["digestive"],
    chartSignifiers: {
      primaryPlanets: ["Jupiter", "Venus", "Saturn"],
      housesInvolved: [6, 8],
      cuspSubLords: { cusp6CSL: "Jupiter", cusp8CSL: "Saturn" },
      dashaAtOnset: { mahadasha: "Jupiter", antardasha: "Saturn" },
    },
    combinationRulesTriggered: ["COMB-JUP-VEN-SAT-GALLSTONE"],
    teacherInterpretation:
      "Jupiter (bile / gallbladder) plus Venus (cholesterol bile lipids) crystalized by Saturn (stone formation / obstruction).",
    remedySymbolism:
      "Saturn 16-day protocol flushed in toilet; warm water with lemon in mornings; avoidance of deep-fried greasy meals.",
    caseOutcomeNotes:
      "Clinically managed through dietary fat restriction and medical dissolution protocol.",
    relevanceConfidence: 0.95,
  },

  {
    id: "CASE-MED-016",
    title: "Recurrent Cysts, Nodes & Fibrous Lumps (गांठ / रसौली)",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Multiple subcutaneous fibrous cysts", "Uterine fibroid tenderness", "Encapsulated benign lumps"],
    bodySystems: ["musculoskeletal", "reproductive"],
    chartSignifiers: {
      primaryPlanets: ["Saturn", "Ketu"],
      housesInvolved: [6, 8],
      cuspSubLords: { cusp6CSL: "Saturn", cusp8CSL: "Ketu" },
      dashaAtOnset: { mahadasha: "Saturn", antardasha: "Ketu" },
    },
    combinationRulesTriggered: ["COMB-SAT-KETU-CYSTS"],
    teacherInterpretation:
      "Saturn (hard structural density) conjoined with Ketu (encapsulated nodes, fibrous knots) is the definitive transcript combination for cysts and lumps.",
    remedySymbolism:
      "16-day Ketu protocol (aamchur stick + kulthi dal burnt and flushed in toilet at 7-8 PM); strict avoidance of sour foods (lemon, tamarind, chaat).",
    caseOutcomeNotes:
      "Ultrasound confirmed stabilization of cyst dimensions; surgical excision was avoided.",
    relevanceConfidence: 0.96,
  },

  {
    id: "CASE-MED-017",
    title: "Organ Tissue Shrinkage & Parenchymal Atrophy",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Unilateral kidney shrinkage", "Decreased renal cortical thickness", "Parenchymal loss"],
    bodySystems: ["renal_urinary"],
    chartSignifiers: {
      primaryPlanets: ["Venus", "Ketu"],
      housesInvolved: [6, 8],
      cuspSubLords: { cusp6CSL: "Venus", cusp8CSL: "Ketu" },
      dashaAtOnset: { mahadasha: "Venus", antardasha: "Ketu" },
    },
    combinationRulesTriggered: ["COMB-VEN-KETU-KIDNEY-SHRINK"],
    teacherInterpretation:
      "Venus (kidney anatomy) afflicted by Ketu (shrinkage, atrophy, contraction) indicates physical reduction in organ size.",
    remedySymbolism:
      "16-day Ketu remedy flushed in toilet; generous clean hydration; donation to monks/spiritual seekers.",
    caseOutcomeNotes:
      "Compensatory hypertrophy in opposite kidney maintained normal overall renal clearance.",
    relevanceConfidence: 0.95,
  },

  {
    id: "CASE-MED-018",
    title: "Essential Hypertension & Arterial Pressure Spikes",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Systolic blood pressure exceeding 160", "Occipital throbbing headache", "Facial flushing upon anger"],
    bodySystems: ["cardiovascular"],
    chartSignifiers: {
      primaryPlanets: ["Mars", "Jupiter"],
      housesInvolved: [6],
      cuspSubLords: { cusp6CSL: "Mars" },
      dashaAtOnset: { mahadasha: "Mars", antardasha: "Jupiter" },
    },
    combinationRulesTriggered: ["COMB-MARS-JUPITER-HIGH-BP"],
    teacherInterpretation:
      "Mars (arterial systolic tension, vasomotor tone) amplified by Jupiter (expansion, arterial volume) causes high BP spikes.",
    remedySymbolism:
      "Mars 16-day dry red chili remedy to sink; coconut water hydration; donation of yellow fruits in public hospital.",
    caseOutcomeNotes:
      "Blood pressure normalized within 3 weeks of standard antihypertensive prescription and low-sodium diet.",
    relevanceConfidence: 0.94,
  },

  {
    id: "CASE-MED-019",
    title: "Orthostatic Hypotension & Vasovagal Fatigue (Low BP)",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Postural lightheadedness", "Low blood pressure (below 90/60)", "Cold extremities and lethargy"],
    bodySystems: ["cardiovascular"],
    chartSignifiers: {
      primaryPlanets: ["Mars", "Moon"],
      housesInvolved: [6, 8],
      cuspSubLords: { cusp6CSL: "Moon" },
      dashaAtOnset: { mahadasha: "Moon", antardasha: "Mars" },
    },
    combinationRulesTriggered: ["COMB-MARS-MOON-BP-FLUCTUATION"],
    teacherInterpretation:
      "Moon (systemic plasma volume) under-energized by Mars creates labile low blood pressure and orthostatic dizziness.",
    remedySymbolism:
      "Moon 16-day rice and raw milk remedy to sink; adequate mineral electrolyte hydration.",
    caseOutcomeNotes:
      "Symptoms resolved with increased fluid/electrolyte intake and regular leg calf exercises.",
    relevanceConfidence: 0.93,
  },

  {
    id: "CASE-MED-020",
    title: "Ocular Asymmetry & Vision Impairment (Right vs. Left Eye)",
    source: "Transcript_Classroom_Case",
    reportedSymptoms: ["Right eye visual acuity decline", "Retinal dryness", "Photophobia under bright daylight"],
    bodySystems: ["ophthalmology"],
    chartSignifiers: {
      primaryPlanets: ["Sun"],
      housesInvolved: [2, 6],
      cuspSubLords: { cusp6CSL: "Sun" },
      dashaAtOnset: { mahadasha: "Sun", antardasha: "Sun" },
    },
    combinationRulesTriggered: ["RULE-OCULAR-2ND-12TH"],
    teacherInterpretation:
      "Sun rules bone calcium and the Right Eye through the 2nd house axis; Moon governs the Left Eye through the 12th house axis.",
    remedySymbolism:
      "16-day Sun wheat remedy to sink; avoid wheat chapati at noon; donate eyeglasses in eye-care camps.",
    caseOutcomeNotes:
      "Vision corrected with prescription lenses and lubricating eye drops.",
    relevanceConfidence: 0.95,
  },
];
