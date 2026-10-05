// src/lib/astro-engine/lineage-karma/classical-nodes.ts
// ============================================================================
// NODAL & CLASSICAL LINEAGE ENGINE (Dr. Prem Kumar Sharma & BPHS)
// Implements:
// - Rahu = Paternal Grandfather (Dada) Lineage Mapping
// - Ketu = Maternal Grandfather (Nana) Lineage Mapping
// - Gandamoola Nakshatra & Charan Ancestral Diagnostics
// - Vargottama Nodes (D1 + D9 confirmation)
// - Bahuputra Yoga & Kendra-Trikona Yogakaraka Nodes
// - 19th Constellation Eclipse Sensitivity Check
// ============================================================================

import type { ChartData } from "../calculations";
import type { GandamoolaAssessment, NodalLineageProfile } from "./types";

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const GANDAMOOLA_MAP: Record<string, Record<number, string>> = {
  Ashwini: {
    1: "Early challenge to father's comfort or health; family relocated or restructured during native's early years.",
    2: "Moderate; prosperous for family after initial struggle.",
    3: "Supportive of father's career growth.",
    4: "Auspicious and royal favors."
  },
  Ashlesha: {
    1: "Peaceful, no lineage strain.",
    2: "Economic strain on paternal wealth.",
    3: "Mother's health or maternal lineage concerns.",
    4: "Father's lineage requires special care and gratitude."
  },
  Magha: {
    1: "Maternal lineage obligations and maternal grandfather's unfulfilled ambitions.",
    2: "Father's resources require conscious management.",
    3: "Family status grows through gradual wisdom.",
    4: "High learning and spiritual realization in lineage."
  },
  Jyeshtha: {
    1: "Elder sibling or paternal uncle's karmic sensitivity.",
    2: "Loss of hereditary status if pride is unchecked.",
    3: "Mother's lineage concerns.",
    4: "Self-purification required to elevate ancestral prestige."
  },
  Moola: {
    1: "Paternal lineage root: father's fortune fluctuates until native reaches self-reliance.",
    2: "Mother's domestic peace requires emotional reassurance.",
    3: "Financial drainage in ancestral property or legal settlement.",
    4: "Excellent for spiritual lineage and ultimate family elevation."
  },
  Revati: {
    1: "Auspicious, high learning.",
    2: "Government/state relations for family improve.",
    3: "Ancestral wealth requires disciplined auditing.",
    4: "Early self-responsibility; native becomes the primary support pillar."
  }
};

export function calculateClassicalNodalLineage(chart: ChartData): NodalLineageProfile {
  const rahu = chart.planets?.Rahu;
  const ketu = chart.planets?.Ketu;
  const moon = chart.planets?.Moon;

  // 1. Gandamoola Assessment
  const moonNak = moon?.nakshatra || "Rohini";
  const moonPada = moon?.pada || 1;
  let gandamoola: GandamoolaAssessment = {
    isGandamoola: false,
  };

  if (GANDAMOOLA_MAP[moonNak]) {
    const specificDetail = GANDAMOOLA_MAP[moonNak][moonPada] || "General gandamoola karmic sensitivity at birth.";
    gandamoola = {
      isGandamoola: true,
      nakshatra: moonNak,
      pada: moonPada,
      classicalTarget: specificDetail,
      remedyGuidance:
        "Traditional: Honoring the nakshatra deity during Gandamoola Shanti; Behavioral: Expressing conscious gratitude to elders and performing regular selfless service (Seva).",
    };
  }

  // 2. Vargottama Detection
  // Check if D9 navamsha sign matches D1 sign
  // In chart.navamsha (if present) or calculate
  const rahuD1Sign = rahu?.sign || "Cancer";
  const ketuD1Sign = ketu?.sign || "Capricorn";
  
  // Approximate or retrieve D9 signs
  const rahuD9Sign = chart.navamsha?.planets?.Rahu?.sign || rahuD1Sign; // fallback
  const ketuD9Sign = chart.navamsha?.planets?.Ketu?.sign || ketuD1Sign;
  
  const isRahuVargottama = chart.navamsha?.planets?.Rahu?.sign 
    ? chart.navamsha.planets.Rahu.sign === rahuD1Sign
    : false;
  const isKetuVargottama = chart.navamsha?.planets?.Ketu?.sign
    ? chart.navamsha.planets.Ketu.sign === ketuD1Sign
    : false;

  // 3. Kendra-Trikona Yogakaraka Status for Nodes
  const rahuH = rahu?.house || 2;
  const ketuH = ketu?.house || 8;
  const isKendra = (h: number) => [1, 4, 7, 10].includes(h);
  const isTrikona = (h: number) => [1, 5, 9].includes(h);
  const isTrik = (h: number) => [6, 8, 12].includes(h);

  const isRahuYogakaraka = (isKendra(rahuH) || isTrikona(rahuH)) && !isTrik(rahuH);

  // 4. Bahuputra Yoga (Rahu in 5th not in Saturn's Navamsha)
  const isBahuputraYoga = rahuH === 5 && !["Capricorn", "Aquarius"].includes(rahuD9Sign);

  // 5. Vipreet Raja Yoga by Nodes
  const isVipreet = isTrik(rahuH) && isTrik(ketuH);

  // 6. 19th Constellation Eclipse Sensitivity
  const birthNakIndex = NAKSHATRAS.indexOf(moonNak);
  const nineteenthNakIndex = birthNakIndex >= 0 ? (birthNakIndex + 18) % 27 : 0;
  const nineteenthNakshatra = NAKSHATRAS[nineteenthNakIndex] || "Moola";

  // 7. Paternal & Maternal Grandfather Themes
  const rahuTheme = `Rahu in House ${rahuH} (${rahuD1Sign}): Represents paternal grandfather's lineage drive. Shows where your paternal ancestors had high material ambition or restless yearning that you are tasked to channel with conscious integrity.`;
  const ketuTheme = `Ketu in House ${ketuH} (${ketuD1Sign}): Represents maternal grandfather's lineage legacy. Shows where maternal ancestors accumulated spiritual introspection, detachment, or unresolved family matters that you are meant to bring to peaceful closure.`;

  return {
    rahuPaternalGrandfather: {
      house: rahuH,
      sign: rahuD1Sign,
      nakshatra: rahu?.nakshatra || "Ashlesha",
      lineageTheme: rahuTheme,
      isVargottama: isRahuVargottama,
      isYogakaraka: isRahuYogakaraka,
    },
    ketuMaternalGrandfather: {
      house: ketuH,
      sign: ketuD1Sign,
      nakshatra: ketu?.nakshatra || "Shravana",
      lineageTheme: ketuTheme,
      isVargottama: isKetuVargottama,
    },
    gandamoola,
    bahuputraYoga: isBahuputraYoga,
    vipreetRajaYogaByNodes: isVipreet,
    eclipse19thNakshatraAlert: {
      birthNakshatra: moonNak,
      nineteenthNakshatra,
      vulnerableTheme: `Solar or Lunar Eclipses falling in ${nineteenthNakshatra} activate the deep ancestral unconscious (Adhana chakra). Maintain quiet contemplation and avoid major financial or family conflicts during such eclipse seasons.`,
    },
  };
}
