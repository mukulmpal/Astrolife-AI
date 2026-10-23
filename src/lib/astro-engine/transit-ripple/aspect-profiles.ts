/**
 * ============================================================================
 * ASTROLIFE — TRANSIT RIPPLE 2.0 ASPECT PROFILES & HOUSE METADATA
 * ============================================================================
 * Standard Parashari drishti counting (inclusive house counting):
 * An aspect of k houses from source house H reaches:
 * Target = ((H - 1 + (k - 1)) % 12) + 1
 *
 * Classical Vedic Parashari Drishtis:
 * - Saturn:  3rd, 7th, 10th
 * - Jupiter: 5th, 7th, 9th
 * - Mars:    4th, 7th, 8th
 * - Sun, Moon, Venus, Mercury: 7th
 * - Rahu & Ketu: Configurable (default: 5th, 7th, 9th)
 * ============================================================================
 */

import type {
  TransitPlanet,
  AspectRule,
  DrishtiHit,
  RahuKetuAspectProfile,
} from "./types";

export const SIGN_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const NAKSHATRA_NAMES = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
];

export const HOUSE_NAMES: Record<
  number,
  { english: string; sanskrit: string; themes: string[] }
> = {
  1: {
    english: "Self & Vitality",
    sanskrit: "तनु भाव (Tanu Bhava)",
    themes: ["Physical energy", "Personality", "Core decisions", "New starts"],
  },
  2: {
    english: "Wealth, Family & Speech",
    sanskrit: "धन भाव (Dhana Bhava)",
    themes: ["Liquid assets", "Family harmony", "Speech tone", "Financial investments"],
  },
  3: {
    english: "Initiatives & Courage",
    sanskrit: "सहज भाव (Sahaja Bhava)",
    themes: ["Courageous actions", "Siblings", "Skills", "Outreach & marketing"],
  },
  4: {
    english: "Home, Mind & Inner Peace",
    sanskrit: "सुख भाव (Sukha Bhava)",
    themes: ["Emotional composure", "Domestic environment", "Vehicles", "Property"],
  },
  5: {
    english: "Intellect & Purva Punya",
    sanskrit: "पुत्र / बुद्धि भाव (Putra Bhava)",
    themes: ["Strategic intellect", "Children", "Creative pursuits", "Investments"],
  },
  6: {
    english: "Health, Debts & Daily Battles",
    sanskrit: "शत्रु / रोग भाव (Ari Bhava)",
    themes: ["Physical wellness", "Discipline", "Debts", "Handling competition"],
  },
  7: {
    english: "Partnerships & Public Dealings",
    sanskrit: "कलत्र भाव (Kalatra Bhava)",
    themes: ["Spouse & marriage", "Business alliances", "Contracts", "Public life"],
  },
  8: {
    english: "Transformation & Longevity",
    sanskrit: "आयु / रन्ध्र भाव (Randhra Bhava)",
    themes: ["Deep research", "Legacy structuring", "Sudden pivots", "Vulnerability"],
  },
  9: {
    english: "Fortune, Dharma & Mentors",
    sanskrit: "भाग्य भाव (Bhagya Bhava)",
    themes: ["Higher wisdom", "Father & Guru", "Ethics", "Long-distance travel"],
  },
  10: {
    english: "Career & Executive Status",
    sanskrit: "कर्म भाव (Karma Bhava)",
    themes: ["Executive authority", "Public reputation", "Professional execution", "Milestones"],
  },
  11: {
    english: "Gains & Strategic Networks",
    sanskrit: "लाभ भाव (Labha Bhava)",
    themes: ["Liquid wealth gains", "High-trust networks", "Aspirations", "Elder siblings"],
  },
  12: {
    english: "Expenditure, Sleep & Liberation",
    sanskrit: "व्यय / मोक्ष भाव (Vyaya Bhava)",
    themes: ["Restful sleep", "Foreign links", "Spiritual grounding", "Controlling outflow"],
  },
};

/**
 * Inclusive Vedic house count:
 * From house H, an aspect of k houses reaches ((H - 1 + (k - 1)) % 12) + 1
 */
export function calculateTargetHouse(sourceHouse: number, aspectOffset: number): number {
  return (((sourceHouse - 1) + (aspectOffset - 1)) % 12) + 1;
}

export function getPlanetAspectRules(
  planet: TransitPlanet,
  rahuKetuProfile: RahuKetuAspectProfile = "5_7_9"
): AspectRule[] {
  switch (planet) {
    case "Saturn":
      return [
        { offset: 3, name: "3rd Drishti", nature: "special" },
        { offset: 7, name: "7th Drishti", nature: "full" },
        { offset: 10, name: "10th Drishti", nature: "special" },
      ];
    case "Jupiter":
      return [
        { offset: 5, name: "5th Drishti", nature: "special" },
        { offset: 7, name: "7th Drishti", nature: "full" },
        { offset: 9, name: "9th Drishti", nature: "special" },
      ];
    case "Mars":
      return [
        { offset: 4, name: "4th Drishti", nature: "special" },
        { offset: 7, name: "7th Drishti", nature: "full" },
        { offset: 8, name: "8th Drishti", nature: "special" },
      ];
    case "Rahu":
    case "Ketu":
      if (rahuKetuProfile === "5_7_9") {
        return [
          { offset: 5, name: "5th Drishti", nature: "special" },
          { offset: 7, name: "7th Drishti", nature: "full" },
          { offset: 9, name: "9th Drishti", nature: "special" },
        ];
      }
      if (rahuKetuProfile === "3_10") {
        return [
          { offset: 3, name: "3rd Drishti", nature: "special" },
          { offset: 7, name: "7th Drishti", nature: "full" },
          { offset: 10, name: "10th Drishti", nature: "special" },
        ];
      }
      return [{ offset: 7, name: "7th Drishti", nature: "full" }];
    case "Sun":
    case "Moon":
    case "Venus":
    case "Mercury":
    default:
      return [{ offset: 7, name: "7th Drishti", nature: "full" }];
  }
}

export function computeDrishtiHitsForPlanet(
  planet: TransitPlanet,
  sourceHouse: number,
  rahuKetuProfile: RahuKetuAspectProfile = "5_7_9"
): DrishtiHit[] {
  const rules = getPlanetAspectRules(planet, rahuKetuProfile);
  return rules.map((r) => ({
    planet,
    sourceHouse,
    targetHouse: calculateTargetHouse(sourceHouse, r.offset),
    aspectRule: r,
  }));
}

