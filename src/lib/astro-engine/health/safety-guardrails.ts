/**
 * ============================================================================
 * ASTROLIFE — HEALTH SAFETY GUARDRAILS & CLINICAL BOUNDARY ENGINE
 * ============================================================================
 * Mandatory ethical safety layer:
 * 1. Immediate detection and interception of acute medical red flags
 * 2. Absolute prohibition against diagnosing clinical pathology
 * 3. Separation of astrological symbolism from empirical medical assessment
 * ============================================================================
 */

export interface EmergencyCheckResult {
  isEmergency: boolean;
  detectedRedFlags: string[];
  emergencyMessage?: string;
}

const RED_FLAG_SYMPTOMS: Record<string, string[]> = {
  cardiac: [
    "chest pain",
    "chest tightness",
    "angina",
    "left arm pain",
    "sudden cold sweat",
    "heart attack",
    "irregular heartbeat with dizziness",
  ],
  respiratory: [
    "difficulty breathing",
    "shortness of breath",
    "severe asthma attack",
    "choking",
    "lips turning blue",
    "gasping for air",
  ],
  neurological: [
    "sudden numbness",
    "facial drooping",
    "slurred speech",
    "arm weakness on one side",
    "sudden loss of vision",
    "seizure",
    "unconscious",
    "fainting",
    "stroke",
  ],
  vascular_trauma: [
    "heavy bleeding",
    "uncontrolled hemorrhage",
    "coughing up blood",
    "vomiting blood",
    "severe head trauma",
    "deep stab wound",
  ],
  psychiatric: [
    "suicide",
    "suicidal",
    "want to kill myself",
    "ending my life",
    "suicidal thoughts",
    "severe self-harm",
  ],
  severe_allergic: [
    "swelling of tongue",
    "throat closing",
    "anaphylaxis",
    "severe allergic reaction",
  ],
};

export function evaluateMedicalSafety(userInputText?: string): EmergencyCheckResult {
  if (!userInputText || typeof userInputText !== "string") {
    return { isEmergency: false, detectedRedFlags: [] };
  }

  const normalized = userInputText.toLowerCase();
  const detected: string[] = [];

  for (const [category, keywords] of Object.entries(RED_FLAG_SYMPTOMS)) {
    for (const kw of keywords) {
      if (normalized.includes(kw)) {
        detected.push(`${category.toUpperCase()}: "${kw}"`);
      }
    }
  }

  if (detected.length > 0) {
    return {
      isEmergency: true,
      detectedRedFlags: detected,
      emergencyMessage:
        "🚨 URGENT CLINICAL MEDICAL ALERT: The symptoms or words provided suggest a potential acute medical or psychological emergency. Astrological pattern analysis is immediately paused. Astrology cannot diagnose, treat, or assess urgent clinical emergencies. Please call local emergency medical services immediately (e.g. 112 in India, 911 in the US/Canada, 999 in the UK) or go to the nearest emergency department.",
    };
  }

  return { isEmergency: false, detectedRedFlags: [] };
}

export const CANONICAL_MEDICAL_DISCLAIMERS: string[] = [
  "Non-Diagnostic Nature: Traditional astrological principles analyze planetary patterns, timing vectors, and symbolic bodily tendencies. This analysis is NOT a medical diagnosis, medical prognosis, or clinical pathology test.",
  "Clinical Primacy: Astrological insights must never be used to replace, delay, or modify qualified clinical consultations, laboratory diagnostic tests, imaging studies, prescription medications, or surgical decisions.",
  "Safe Remedial Scope: Traditional astrological remedies (Dāna, dietary mindfulness, Pranayama, Mantras) are supportive cultural practices intended for mental serenity and spiritual discipline. They do not constitute pharmacological therapies.",
  "Emergency Protocol: If you or anyone around you experiences acute distress (such as chest discomfort, breathing difficulty, acute neurological weakness, or severe hemorrhage), seek professional emergency medical services immediately.",
];
