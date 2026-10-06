/**
 * ============================================================================
 * ASTROLIFE — HEALTH RULE REGISTRY & KNOWLEDGE GRAPH (PHASE 2I-MED)
 * ============================================================================
 * Canonical repository of multi-layered health and medical astrology rules:
 * - KP Cuspal Sub-Lord hierarchies (Cusps 1, 6, 8, 12 vs 1, 5, 11)
 * - Multi-planetary combinations directly derived from transcript case analyses
 * - Deterministic, non-diagnostic traditional interpretations
 * ============================================================================
 */

import type { MedicalRule } from "./types";

export const MEDICAL_RULE_REGISTRY: Record<string, MedicalRule> = {
  // ── 1. CONSTITUTIONAL PATTERNS (1ST CUSP) ──────────────────────────────────
  "KP-MED-CUSP1-VITALITY-A": {
    id: "KP-MED-CUSP1-VITALITY-A",
    name: "Robust Constitutional Resilience (1st CSL -> 1, 5, 11)",
    category: "constitution",
    domain: "cardiovascular",
    targetHouses: [1],
    favorableRecoveryHouses: [1, 5, 11],
    planets: ["Sun", "Jupiter", "Mars"],
    doshaAffinity: "Tridosha",
    traditionalInterpretation:
      "The 1st cusp sub-lord prominently connects with houses 1, 5, and 11, traditional indicators of biological resilience, natural recovery potential, and cellular vigor.",
    clinicalGuidance:
      "Maintain active lifestyle, regular cardiovascular conditioning, and balanced hydration to sustain strong constitutional vitality.",
    severityWeight: 1,
    recoveryEffect: 9,
    status: "Canon_KP",
    medicalSafety: "Non_Diagnostic",
  },

  "KP-MED-CUSP1-SUSCEPTIBILITY-B": {
    id: "KP-MED-CUSP1-SUSCEPTIBILITY-B",
    name: "General Health Sensitivity (1st CSL -> 6th)",
    category: "constitution",
    domain: "digestive",
    targetHouses: [1, 6],
    favorableRecoveryHouses: [5, 11],
    planets: ["Saturn", "Mercury"],
    doshaAffinity: "Vata-Pitta",
    traditionalInterpretation:
      "The 1st cusp sub-lord links with the 6th house, indicating a traditional tendency towards recurrent physical strain or susceptibility during activated planetary periods.",
    clinicalGuidance:
      "Prioritize proactive seasonal health checkups, nutritional regularity, and stress reduction protocols.",
    severityWeight: 4,
    recoveryEffect: 3,
    status: "Canon_KP",
    medicalSafety: "Non_Diagnostic",
  },

  "KP-MED-CUSP1-PROLONGED-C": {
    id: "KP-MED-CUSP1-PROLONGED-C",
    name: "Prolonged Health Stress Tendency (1st CSL -> 6 + 8)",
    category: "chronicity",
    domain: "musculoskeletal",
    targetHouses: [1, 6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Saturn", "Rahu"],
    doshaAffinity: "Vata",
    traditionalInterpretation:
      "The 1st cusp sub-lord connects with both 6th and 8th houses, traditionally reflecting prolonged recovery curves or deeper bodily sensitivity when illnesses manifest.",
    clinicalGuidance:
      "Ensure early medical attention for minor symptoms; do not neglect chronic aches or fatigue.",
    severityWeight: 7,
    recoveryEffect: 2,
    status: "Canon_KP",
    medicalSafety: "High_Sensitivity_Advisory",
  },

  "KP-MED-CUSP1-DEPLETION-D": {
    id: "KP-MED-CUSP1-DEPLETION-D",
    name: "Confinement & Vital Drain Signature (1st CSL -> 6 + 12)",
    category: "hospitalization",
    domain: "respiratory",
    targetHouses: [1, 6, 12],
    favorableRecoveryHouses: [5, 11],
    planets: ["Moon", "Rahu", "Saturn"],
    doshaAffinity: "Vata-Kapha",
    traditionalInterpretation:
      "Connection of the 1st cusp sub-lord with 6th and 12th houses traditionally suggests periods requiring bed-rest, convalescent isolation, or clinical inpatient care.",
    clinicalGuidance:
      "Build disciplined restorative sleep habits and maintain financial reserves for routine wellness and preventive screenings.",
    severityWeight: 7,
    recoveryEffect: 2,
    status: "Canon_KP",
    medicalSafety: "High_Sensitivity_Advisory",
  },

  // ── 2. RECOVERY PILLARS (5TH & 11TH HOUSES) ───────────────────────────────
  "KP-MED-RECOVERY-ACTIVE-01": {
    id: "KP-MED-RECOVERY-ACTIVE-01",
    name: "Cellular Recuperation & Curative Grace (5 + 11 Support)",
    category: "recovery",
    domain: "metabolic",
    targetHouses: [5, 11],
    favorableRecoveryHouses: [1, 5, 11],
    planets: ["Jupiter", "Venus", "Moon"],
    doshaAffinity: "Tridosha",
    traditionalInterpretation:
      "Strong activation of houses 5 (negation of disease, 12th from 6th) and 11 (complete recovery, 12th from 12th) provides robust traditional astrological healing support.",
    clinicalGuidance:
      "Favorable phase for restorative therapies, rehabilitation, physical therapy, and positive response to prescribed medical treatments.",
    severityWeight: 1,
    recoveryEffect: 10,
    status: "Canon_KP",
    medicalSafety: "Non_Diagnostic",
  },

  // ── 3. SURGERY & INTERVENTIONAL PROFILE ───────────────────────────────────
  "KP-MED-SURGERY-INTERVENTION-01": {
    id: "KP-MED-SURGERY-INTERVENTION-01",
    name: "Surgical / Procedural Intervention Context (8 + 12 with Mars/Ketu)",
    category: "surgery",
    domain: "hematological",
    targetHouses: [6, 8, 12],
    favorableRecoveryHouses: [5, 11],
    planets: ["Mars", "Ketu"],
    doshaAffinity: "Pitta",
    traditionalInterpretation:
      "Concurrence of 8th (incision/crisis) and 12th (clinical confinement) with Mars (cutting/blood) or Ketu (excision/stitching) traditionally heightens surgical and procedural themes during activated periods.",
    clinicalGuidance:
      "Any surgical decisions must be strictly determined by qualified surgeons and clinical diagnostic evaluations. Seek second opinions where elective.",
    severityWeight: 8,
    recoveryEffect: 4,
    status: "Transcript_Verified",
    medicalSafety: "High_Sensitivity_Advisory",
  },

  // ── 4. TRANSCRIPT COMBINATION RULES ───────────────────────────────────────
  "COMB-VEN-SAT-NEPHROLITHIASIS": {
    id: "COMB-VEN-SAT-NEPHROLITHIASIS",
    name: "Renal Calculi / Urinary Blockage Theme (Venus + Saturn)",
    category: "combination",
    domain: "renal_urinary",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Venus", "Saturn"],
    doshaAffinity: "Vata-Kapha",
    traditionalInterpretation:
      "Venus (kidney filtration) combined with Saturn (crystal precipitation, obstruction, chronic calcification) traditionally relates to renal calculi (kidney stone) tendencies.",
    clinicalGuidance:
      "Ensure consistent daily hydration (2.5 to 3 liters water), moderate dietary sodium and oxalates, and undergo ultrasound screening if flank discomfort arises.",
    severityWeight: 6,
    recoveryEffect: 6,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-VEN-MERC-SKIN-ALLERGY": {
    id: "COMB-VEN-MERC-SKIN-ALLERGY",
    name: "Cutaneous Hypersensitivity & Dermatitis (Venus + Mercury)",
    category: "combination",
    domain: "dermatological",
    targetHouses: [6],
    favorableRecoveryHouses: [5, 11],
    planets: ["Venus", "Mercury"],
    doshaAffinity: "Tridosha",
    traditionalInterpretation:
      "Venus (skin texture, cosmetic dermis) conjoined or aspecting Mercury (nervous reflex, allergic histamine response) traditionally associates with itchy rashes, urticaria, or dry eczema.",
    clinicalGuidance:
      "Identify contact allergens, maintain gentle skin barrier moisturization, and consult a dermatologist for anti-allergic management.",
    severityWeight: 4,
    recoveryEffect: 7,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-VEN-MARS-RAHU-RENAL-STRESS": {
    id: "COMB-VEN-MARS-RAHU-RENAL-STRESS",
    name: "Renal Filtration Strain & Dialysis Pattern (Venus + Mars + Rahu)",
    category: "combination",
    domain: "renal_urinary",
    targetHouses: [6, 8, 12],
    favorableRecoveryHouses: [5, 11],
    planets: ["Venus", "Mars", "Rahu"],
    doshaAffinity: "Vata-Pitta",
    traditionalInterpretation:
      "Venus (renal nephrons) under severe dual afflictive tension from Mars (inflammatory damage, vascular rupture) and Rahu (toxic accumulation, machine filtration) represents intensive renal intervention symbolism in classical case studies.",
    clinicalGuidance:
      "Regular serum creatinine, eGFR, and routine urinalysis monitoring are advised under a qualified nephrologist's supervision.",
    severityWeight: 9,
    recoveryEffect: 3,
    status: "Transcript_Verified",
    medicalSafety: "High_Sensitivity_Advisory",
  },

  "COMB-MERC-RAHU-PULMONARY-INFECTION": {
    id: "COMB-MERC-RAHU-PULMONARY-INFECTION",
    name: "Pulmonary Infection & Bronchial Hypoxia (Mercury + Rahu)",
    category: "combination",
    domain: "respiratory",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Mercury", "Rahu"],
    doshaAffinity: "Vata",
    traditionalInterpretation:
      "Mercury (bronchial tubes, lung capacity) combined with Rahu (viral pathogens, infectious agents, oxygen distress) traditionally associates with deep pulmonary or opportunistic infections.",
    clinicalGuidance:
      "Practice clean breathing exercises, avoid dusty or polluted environments, and seek timely medical care for unresolved coughs.",
    severityWeight: 6,
    recoveryEffect: 6,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-MERC-SAT-MARS-NEUROMUSCULAR": {
    id: "COMB-MERC-SAT-MARS-NEUROMUSCULAR",
    name: "Neuro-Muscular Blockage & Motor Impediment (Mercury + Saturn + Mars)",
    category: "combination",
    domain: "neurological",
    targetHouses: [6, 8, 12],
    favorableRecoveryHouses: [5, 11],
    planets: ["Mercury", "Saturn", "Mars"],
    doshaAffinity: "Vata",
    traditionalInterpretation:
      "Mercury (nervous signaling) constricted by Saturn (paralysis, blockage, numbness) and irritated by Mars (motor injury, inflammation) symbolically aligns with nervous blockages or motor limitations.",
    clinicalGuidance:
      "Engage in gentle neuro-muscular physiotherapy, ergonomic postures, and periodic neurological assessments.",
    severityWeight: 8,
    recoveryEffect: 4,
    status: "Transcript_Verified",
    medicalSafety: "High_Sensitivity_Advisory",
  },

  "COMB-JUP-MARS-RAHU-HYPERPLASIA": {
    id: "COMB-JUP-MARS-RAHU-HYPERPLASIA",
    name: "Cellular Hyperplasia & Treatment Exhaustion (Jupiter + Mars + Rahu)",
    category: "combination",
    domain: "metabolic",
    targetHouses: [6, 8, 12],
    favorableRecoveryHouses: [5, 11],
    planets: ["Jupiter", "Mars", "Rahu"],
    doshaAffinity: "Tridosha",
    traditionalInterpretation:
      "Jupiter (cellular expansion and adipose tissues) afflicted by Mars (inflammatory mutation) and Rahu (uncontrolled proliferation) in houses of crisis and hospital confinement represents intensive medical therapy cases in transcript references.",
    clinicalGuidance:
      "Never self-diagnose or panic based on astrological patterns. Periodic routine screenings (mammograms, sonography, blood panels) are standard medical best practice.",
    severityWeight: 9,
    recoveryEffect: 3,
    status: "Transcript_Verified",
    medicalSafety: "High_Sensitivity_Advisory",
  },

  "COMB-JUP-MARS-INFLAMMATORY-GROWTH": {
    id: "COMB-JUP-MARS-INFLAMMATORY-GROWTH",
    name: "Hepatic Pressure & Inflammatory Surges (Jupiter + Mars)",
    category: "combination",
    domain: "digestive",
    targetHouses: [6],
    favorableRecoveryHouses: [5, 11],
    planets: ["Jupiter", "Mars"],
    doshaAffinity: "Pitta-Kapha",
    traditionalInterpretation:
      "Jupiter (liver, gallbladder) conjoined or aspecting Mars (acute heat, bile pressure) traditionally points to hepatic inflammation, elevated liver enzymes, or gall stress.",
    clinicalGuidance:
      "Avoid excess alcohol, highly saturated fats, and spicy oils. Maintain liver health with leafy greens and regular hydration.",
    severityWeight: 6,
    recoveryEffect: 6,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-MARS-MOON-BP-FLUCTUATION": {
    id: "COMB-MARS-MOON-BP-FLUCTUATION",
    name: "Arterial Hemodynamic Fluctuations (Mars + Moon)",
    category: "combination",
    domain: "cardiovascular",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Mars", "Moon"],
    doshaAffinity: "Pitta-Kapha",
    traditionalInterpretation:
      "Mars (vascular pressure, adrenaline) intersecting with Moon (systemic plasma, emotional heartbeat rhythm) associates with episodic blood pressure spikes or labile circulation.",
    clinicalGuidance:
      "Monitor resting blood pressure periodically, reduce dietary table salt, and practice emotional relaxation techniques.",
    severityWeight: 5,
    recoveryEffect: 7,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-SAT-KETU-SPINAL-ACIDITY": {
    id: "COMB-SAT-KETU-SPINAL-ACIDITY",
    name: "Vertebral Compression & Reflux Burning (Saturn + Ketu + Sun)",
    category: "combination",
    domain: "musculoskeletal",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Saturn", "Ketu", "Sun"],
    doshaAffinity: "Vata-Pitta",
    traditionalInterpretation:
      "Saturn (stiffness, disc degeneration) linked with Ketu (vertebral axis) and Sun (gastric acid fire) traditionally triggers concurrent lower back ache and gastric acid reflux.",
    clinicalGuidance:
      "Maintain core-strengthening posture exercises, avoid lying down immediately after meals, and sleep with appropriate lumbar support.",
    severityWeight: 6,
    recoveryEffect: 6,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-JUP-VEN-DIABETES": {
    id: "COMB-JUP-VEN-DIABETES",
    name: "Glucose Metabolism & Pancreatic Regulation (Jupiter + Venus)",
    category: "combination",
    domain: "metabolic",
    targetHouses: [6],
    favorableRecoveryHouses: [5, 11],
    planets: ["Jupiter", "Venus"],
    doshaAffinity: "Kapha",
    traditionalInterpretation:
      "Jupiter (cellular nutrition, lipid growth) interacting with Venus (sweet secretions, pancreatic insulin) is the classical transcript signature for Diabetes Mellitus and discovery of effective restorative medicinal therapy.",
    clinicalGuidance:
      "Maintain active glucose monitoring (HbA1c), reduce simple sugars, and undergo routine endocrine wellness evaluations.",
    severityWeight: 5,
    recoveryEffect: 7,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-MERC-MOON-PSYCH-HOSPITAL": {
    id: "COMB-MERC-MOON-PSYCH-HOSPITAL",
    name: "Severe Psychosomatic Vulnerability & Confinement (Mercury + Moon)",
    category: "combination",
    domain: "mental_emotional",
    targetHouses: [6, 8, 12],
    favorableRecoveryHouses: [5, 11],
    planets: ["Mercury", "Moon"],
    doshaAffinity: "Vata-Kapha",
    traditionalInterpretation:
      "Mercury (logical intellect, neural synaptic transmission) colliding with Moon (emotional mind, subconscious peace) in 6/8/12 houses traditionally manifests as severe depressive episodes, insomnia, or psychiatric inpatient care in transcript case records.",
    clinicalGuidance:
      "Prioritize compassionate mental healthcare, structured sleep hygiene, and professional psychiatric/psychological support.",
    severityWeight: 8,
    recoveryEffect: 5,
    status: "Transcript_Verified",
    medicalSafety: "High_Sensitivity_Advisory",
  },

  "COMB-MERC-KETU-NERVOUS-SHRINK": {
    id: "COMB-MERC-KETU-NERVOUS-SHRINK",
    name: "Peripheral Nerve Atrophy & Synaptic Shrinkage (Mercury + Ketu)",
    category: "combination",
    domain: "neurological",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Mercury", "Ketu"],
    doshaAffinity: "Vata",
    traditionalInterpretation:
      "Mercury (nervous signaling) connected with Ketu (tissue shrinkage, sensory severance, spinal nadis) aligns symbolically with peripheral neuropathy, nerve thinning, or loss of sensation.",
    clinicalGuidance:
      "Ensure adequate vitamin B12 levels, ergonomic nerve stretching, and consult a neurologist if numbness or tingling persists.",
    severityWeight: 6,
    recoveryEffect: 6,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-VEN-JUP-KIDNEY-ENLARGE": {
    id: "COMB-VEN-JUP-KIDNEY-ENLARGE",
    name: "Metabolic Nephromegaly & Renal Enlargement (Venus + Jupiter)",
    category: "combination",
    domain: "renal_urinary",
    targetHouses: [6],
    favorableRecoveryHouses: [5, 11],
    planets: ["Venus", "Jupiter"],
    doshaAffinity: "Kapha",
    traditionalInterpretation:
      "Venus (kidneys) conjoined or aspected by Jupiter (expansion, cellular enlargement) traditionally points to renal enlargement (hydronephrosis or swelling) and metabolic congestion.",
    clinicalGuidance:
      "Undergo periodic renal ultrasound imaging, maintain balanced hydration, and reduce heavy sodium intake.",
    severityWeight: 5,
    recoveryEffect: 7,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-VEN-KETU-KIDNEY-SHRINK": {
    id: "COMB-VEN-KETU-KIDNEY-SHRINK",
    name: "Renal Cortical Thinning & Tissue Atrophy (Venus + Ketu)",
    category: "combination",
    domain: "renal_urinary",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Venus", "Ketu"],
    doshaAffinity: "Vata-Pitta",
    traditionalInterpretation:
      "Venus (renal nephrons) under Ketu's shrinking/atrophic influence classically indicates contracted kidneys, parenchymal thinning, or micro-vascular shrinkage.",
    clinicalGuidance:
      "Strict monitoring of blood pressure, serum electrolytes, and eGFR under professional nephrological care.",
    severityWeight: 7,
    recoveryEffect: 4,
    status: "Transcript_Verified",
    medicalSafety: "High_Sensitivity_Advisory",
  },

  "COMB-JUP-VEN-SAT-GALLSTONE": {
    id: "COMB-JUP-VEN-SAT-GALLSTONE",
    name: "Biliary Calculus & Gallbladder Lithiasis (Jupiter + Venus + Saturn)",
    category: "combination",
    domain: "digestive",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Jupiter", "Venus", "Saturn"],
    doshaAffinity: "Kapha-Vata",
    traditionalInterpretation:
      "Jupiter (bile / gallbladder) plus Venus (cholesterol fluid composition) solidified by Saturn (stone formation / calcification) is the classical transcript hallmark for Gallbladder stones.",
    clinicalGuidance:
      "Avoid excess fried fatty foods, consume warm water with lemon, and undergo abdominal sonography if right upper-quadrant discomfort occurs.",
    severityWeight: 6,
    recoveryEffect: 6,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-JUP-KETU-LIVER-SHRINK": {
    id: "COMB-JUP-KETU-LIVER-SHRINK",
    name: "Hepatic Fibrosis & Liver Shrinkage (Jupiter + Ketu)",
    category: "combination",
    domain: "digestive",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Jupiter", "Ketu"],
    doshaAffinity: "Pitta-Vata",
    traditionalInterpretation:
      "Jupiter (liver parenchymal tissue) combined with Ketu (fibrous contracture, shrinkage, cirrhosis) symbolically represents liver parenchymal shrinkage or fibrous hardening.",
    clinicalGuidance:
      "Complete abstention from alcohol, regular liver function tests (LFT), and periodic hepatic elastography/sonography.",
    severityWeight: 8,
    recoveryEffect: 4,
    status: "Transcript_Verified",
    medicalSafety: "High_Sensitivity_Advisory",
  },

  "COMB-SAT-KETU-CYSTS": {
    id: "COMB-SAT-KETU-CYSTS",
    name: "Fibrous Cysts, Nodules & Benign Growths (Saturn + Ketu)",
    category: "combination",
    domain: "musculoskeletal",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Saturn", "Ketu"],
    doshaAffinity: "Vata",
    traditionalInterpretation:
      "Saturn (blockage, hard density) conjoined with Ketu (cysts, encapsulated nodes, knots) repeatedly produces localized cysts, rasoli (fibroids/cysts), or fibrous nodules in transcript cases.",
    clinicalGuidance:
      "Have any newly discovered lumps or cysts clinically evaluated and palpated by a qualified doctor; monitor for changes in size.",
    severityWeight: 6,
    recoveryEffect: 6,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-SAT-MARS-KNEE-PAIN": {
    id: "COMB-SAT-MARS-KNEE-PAIN",
    name: "Joint Friction, Knee Pain & Arthritic Inflammation (Saturn + Mars)",
    category: "combination",
    domain: "musculoskeletal",
    targetHouses: [6],
    favorableRecoveryHouses: [5, 11],
    planets: ["Saturn", "Mars"],
    doshaAffinity: "Vata-Pitta",
    traditionalInterpretation:
      "Saturn (knees, joints, cartilage degeneration) clashing with Mars (acute heat, friction, inflammation) is the classic transcript indicator for severe knee pain, bursitis, and mechanical joint wear.",
    clinicalGuidance:
      "Maintain healthy body weight, perform low-impact quad strengthening (swimming/cycling), and apply warm anti-inflammatory compresses.",
    severityWeight: 6,
    recoveryEffect: 7,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-SUN-JUP-HYPERTENSION-BONE": {
    id: "COMB-SUN-JUP-HYPERTENSION-BONE",
    name: "Arterial Pressure Surges & Bone Hypertrophy (Sun + Jupiter)",
    category: "combination",
    domain: "cardiovascular",
    targetHouses: [6],
    favorableRecoveryHouses: [5, 11],
    planets: ["Sun", "Jupiter"],
    doshaAffinity: "Pitta-Kapha",
    traditionalInterpretation:
      "Sun (cardiac pressure, bone calcium) augmented by Jupiter (expansion, arterial volume) traditionally associates with elevated systolic blood pressure and osteophyte / bone spur development.",
    clinicalGuidance:
      "Check resting blood pressure routinely, practice sodium moderation, and perform gentle skeletal alignment exercises.",
    severityWeight: 5,
    recoveryEffect: 7,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },

  "COMB-MOON-RAHU-DEPRESSION": {
    id: "COMB-MOON-RAHU-DEPRESSION",
    name: "Deep Psychosomatic Anxiety, Phobias & Somatic Illusions (Moon + Rahu)",
    category: "combination",
    domain: "mental_emotional",
    targetHouses: [6, 8],
    favorableRecoveryHouses: [5, 11],
    planets: ["Moon", "Rahu"],
    doshaAffinity: "Vata",
    traditionalInterpretation:
      "Moon (subconscious peace, emotional stability) shadowed by Rahu (illusions, panic, phobias, toxic imagination) creates severe psychosomatic dread, hypochondriac fear, and sleep disturbances in transcript analyses.",
    clinicalGuidance:
      "Practice grounding breathwork (Anulom-Vilom), avoid scary or morbid media before bed, and consult a qualified therapist for panic or anxiety.",
    severityWeight: 6,
    recoveryEffect: 7,
    status: "Transcript_Verified",
    medicalSafety: "Non_Diagnostic",
  },
};
