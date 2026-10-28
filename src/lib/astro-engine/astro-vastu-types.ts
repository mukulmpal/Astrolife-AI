// src/lib/astro-engine/astro-vastu-types.ts
// ============================================================================
// Foundational Astro-Vastu Constants & Definitions
// Shared between Astro-Vastu Hit Engine, GPS Astro-Vastu Engine, and UI Radar
// ============================================================================

import type { ChartData } from "./calculations";

export interface AstroVastuDirection {
  signNum: number;
  signName: string;
  direction: string;
  directionHindi: string;
  code: string;
  notes: string;
}

export const RASHIS_HINDI: Record<number, string> = {
  1: "मेष", 2: "वृषभ", 3: "मिथुन", 4: "कर्क", 5: "सिंह", 6: "कन्या",
  7: "तुला", 8: "वृश्चिक", 9: "धनु", 10: "मकर", 11: "कुंभ", 12: "मीन"
};

export const PLANETS_HINDI: Record<string, string> = {
  Sun: "सूर्य (Sun)",
  Moon: "चंद्र (Moon)",
  Mars: "मंगल (Mars)",
  Mercury: "बुध (Mercury)",
  Jupiter: "गुरु (Jupiter)",
  Venus: "शुक्र (Venus)",
  Saturn: "शनि (Saturn)",
  Rahu: "राहु (Rahu)",
  Ketu: "केतु (Ketu)"
};

export const RASHIS_ORDER = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

export const RASHIS_SANSKRIT = [
  "Mesha", "Vrishabha", "Mithuna", "Karkata", "Simha", "Kanya",
  "Tula", "Vrischika", "Dhanu", "Makara", "Kumbha", "Meena"
] as const;

export const RASHIS_SANSKRIT_VARIANTS: Record<number, string[]> = {
  1: ["mesha", "mesa", "aries", "मेष"],
  2: ["vrishabha", "vrishabh", "vrshabha", "taurus", "वृषभ"],
  3: ["mithuna", "mithun", "gemini", "मिथुन"],
  4: ["karka", "karkata", "kark", "cancer", "कर्क"],
  5: ["simha", "singh", "leo", "सिंह"],
  6: ["kanya", "virgo", "कन्या"],
  7: ["tula", "libra", "तुला"],
  8: ["vrishchika", "vrischika", "vrischik", "scorpio", "वृश्चिक"],
  9: ["dhanu", "dhanus", "dhanusha", "sagittarius", "धनु"],
  10: ["makara", "makar", "capricorn", "मकर"],
  11: ["kumbha", "kumbh", "aquarius", "कुंभ"],
  12: ["meena", "mina", "meen", "pisces", "मीन"],
};

/**
 * 12 Signs mapped to Directions in Astro-Vastu Hit Theory.
 */
export const ASTRO_VASTU_SIGN_DIRECTIONS: Record<number, AstroVastuDirection> = {
  1: { signNum: 1, signName: "Aries", direction: "East", directionHindi: "पूर्व", code: "E", notes: "0° to 30° - Surya & Mangal domain" },
  2: { signNum: 2, signName: "Taurus", direction: "North-West", directionHindi: "उत्तर-पश्चिम (वायव्य)", code: "NW", notes: "30° to 60° - Shukra domain" },
  3: { signNum: 3, signName: "Gemini", direction: "North-North-West", directionHindi: "उत्तर-उत्तर-पश्चिम (NNW/NW)", code: "NNW", notes: "60° to 90° - Budh domain" },
  4: { signNum: 4, signName: "Cancer", direction: "North-East", directionHindi: "उत्तर-पूर्व (ईशान)", code: "NE", notes: "90° to 120° - Chandra domain" },
  5: { signNum: 5, signName: "Leo", direction: "East-North-East", directionHindi: "पूर्व-उत्तर-पूर्व (ENE)", code: "ENE", notes: "120° to 150° - Surya domain" },
  6: { signNum: 6, signName: "Virgo", direction: "North", directionHindi: "उत्तर", code: "N", notes: "150° to 180° - Budh/Kubera domain" },
  7: { signNum: 7, signName: "Libra", direction: "West-South-West", directionHindi: "पश्चिम-दक्षिण-पश्चिम (WSW)", code: "WSW", notes: "180° to 210° - Shukra domain" },
  8: { signNum: 8, signName: "Scorpio", direction: "South-South-West", directionHindi: "दक्षिण-दक्षिण-पश्चिम (SSW)", code: "SSW", notes: "210° to 240° - 95% SSW focus (rarely SW)" },
  9: { signNum: 9, signName: "Sagittarius", direction: "North-East", directionHindi: "उत्तर-पूर्व (NE/NNE)", code: "NE", notes: "240° to 270° - Guru/Dharma domain" },
  10: { signNum: 10, signName: "Capricorn", direction: "South", directionHindi: "दक्षिण (South/SSE)", code: "S", notes: "270° to 300° - Shani domain" },
  11: { signNum: 11, signName: "Aquarius", direction: "West", directionHindi: "पश्चिम (West/WSW)", code: "W", notes: "300° to 330° - Shani/Varuna domain" },
  12: { signNum: 12, signName: "Pisces", direction: "South-East", directionHindi: "दक्षिण-पूर्व (SE/ESE)", code: "SE", notes: "330° to 360° - Guru/Moksha domain" },
};

/**
 * Normalizes sign string or 1-12 number into a 1-based sign index (1 = Aries ... 12 = Pisces).
 * Fully supports English, Sanskrit, and Hindi sign names.
 */
export function getSignNumber(signNameOrNum?: string | number, signStringFallback?: string): number {
  if (typeof signNameOrNum === "number") {
    if (signNameOrNum >= 1 && signNameOrNum <= 12) return signNameOrNum;
    if (signNameOrNum === 0) return 1;
  }
  const candidateStr = (typeof signNameOrNum === "string" ? signNameOrNum : signStringFallback)?.trim().toLowerCase();
  if (candidateStr) {
    for (const [numStr, variants] of Object.entries(RASHIS_SANSKRIT_VARIANTS)) {
      if (variants.some(v => v.toLowerCase() === candidateStr || candidateStr.includes(v.toLowerCase()))) {
        return Number(numStr);
      }
    }
    const idx = RASHIS_ORDER.findIndex(r => r.toLowerCase() === candidateStr);
    if (idx >= 0) return idx + 1;
  }
  return 1;
}
