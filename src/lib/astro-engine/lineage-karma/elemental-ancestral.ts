// src/lib/astro-engine/lineage-karma/elemental-ancestral.ts
// ============================================================================
// ELEMENTAL ANCESTRAL INTELLIGENCE (Stephen Arroyo + Dr. Stone Polarity Therapy)
// Calculates the Elemental Substance of Ancestral Inheritance:
// - Saturn's Element: Location of Lineage Blockage
// - Self-Expressive (Fire/Air) vs Self-Repressive (Earth/Water)
// - The 4-8-12 Water Houses Trilogy (Learned → Carried → Released)
// - Ascendant Ruler's Element (Hidden Ancestral Anchor)
// - Sun-Moon Lineage Polarity
// - Somatic & Mr. A Energy Field Depletion Profile
// ============================================================================

import type { ChartData } from "../calculations";
import type { ElementType, ElementalAncestralProfile, SomaticAncestralProfile } from "./types";

const SIGN_ELEMENT_MAP: Record<string, ElementType> = {
  Aries: "Fire",
  Leo: "Fire",
  Sagittarius: "Fire",
  Taurus: "Earth",
  Virgo: "Earth",
  Capricorn: "Earth",
  Gemini: "Air",
  Libra: "Air",
  Aquarius: "Air",
  Cancer: "Water",
  Scorpio: "Water",
  Pisces: "Water",
};

const SIGN_LORDS: Record<string, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

export function calculateElementalAncestral(chart: ChartData): {
  elemental: ElementalAncestralProfile;
  somatic: SomaticAncestralProfile;
} {
  const tally: Record<ElementType, number> = {
    Fire: 0,
    Earth: 0,
    Air: 0,
    Water: 0,
  };

  // 1. Tally 9 Planets + Lagna
  if (chart.lagnaRashi && SIGN_ELEMENT_MAP[chart.lagnaRashi]) {
    tally[SIGN_ELEMENT_MAP[chart.lagnaRashi]] += 1;
  }

  const planetNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  for (const p of planetNames) {
    const pData = chart.planets?.[p];
    if (pData?.sign && SIGN_ELEMENT_MAP[pData.sign]) {
      tally[SIGN_ELEMENT_MAP[pData.sign]] += 1;
    }
  }

  const selfExpressiveCount = tally.Fire + tally.Air;
  const selfRepressiveCount = tally.Earth + tally.Water;

  let elementalBalanceVerdict = "";
  if (selfRepressiveCount > selfExpressiveCount + 2) {
    elementalBalanceVerdict =
      "Family lineage shows heavy Earth/Water conditioning — emotional holding, self-repression, and security orientation over generations.";
  } else if (selfExpressiveCount > selfRepressiveCount + 2) {
    elementalBalanceVerdict =
      "Family lineage carries strong Fire/Air volatility — mental restlessness, ideological assertion, and strong creative hunger.";
  } else {
    elementalBalanceVerdict =
      "Balanced elemental distribution — ancestral patterns flow between practical stability and emotional-mental expression.";
  }

  // 2. Saturn's Element (The Blocked Ancestral Energy)
  const saturnSign = chart.planets?.Saturn?.sign || "Taurus";
  const saturnElement = SIGN_ELEMENT_MAP[saturnSign] || "Earth";

  let saturnBlockageTheme = "";
  let saturnBlockedDomain = "";

  switch (saturnElement) {
    case "Fire":
      saturnBlockageTheme =
        "Suppressed self-worth, creative identity, and spontaneous courage in the lineage. Elders had to restrain enthusiasm for survival.";
      saturnBlockedDomain = "Confidence, leadership autonomy, and creative risk-taking";
      break;
    case "Water":
      saturnBlockageTheme =
        "Generational emotional repression. Vulnerability or grief was suppressed behind a wall of duty, creating latent anxiety or brooding.";
      saturnBlockedDomain = "Emotional intimacy, expressing soft feelings, and releasing old family grief";
      break;
    case "Earth":
      saturnBlockageTheme =
        "Material survival anxiety and rigid responsibilities handed down. Deep concern with tangible security, property, and not losing resources.";
      saturnBlockedDomain = "Financial peace of mind, fear of scarcity, and physical burden-bearing";
      break;
    case "Air":
      saturnBlockageTheme =
        "Inhibited communication and intellectual isolation within the family system. Difficulty speaking true thoughts without fear of judgment.";
      saturnBlockedDomain = "Authentic self-expression, mental ease, and open dialogue in relationships";
      break;
  }

  // 3. Ascendant Ruler Element (Hidden Ancestral Factor)
  const lagnaRashi = chart.lagnaRashi || "Gemini";
  const lagnaLordName = SIGN_LORDS[lagnaRashi] || "Mercury";
  const lagnaLordData = chart.planets?.[lagnaLordName];
  const ascendantRulerElement = lagnaLordData?.sign
    ? SIGN_ELEMENT_MAP[lagnaLordData.sign] || "Air"
    : "Air";

  const ascendantRulerSignificance = `The soul's primary physical vehicle (Lagna Lord ${lagnaLordName} in ${ascendantRulerElement}) seeks to bridge ${ascendantRulerElement} wisdom against the lineage's inherited ${saturnElement} friction.`;

  // 4. Water Houses Trilogy (4th, 8th, 12th)
  // Find which signs occupy Houses 4, 8, 12 based on Lagna
  const lagnaNum = chart.lagnaNum || 3; // 1-12
  const houseToSignNum = (h: number) => (((lagnaNum - 1 + (h - 1)) % 12) + 1);
  const SIGN_NAMES_BY_NUM: Record<number, string> = {
    1: "Aries", 2: "Taurus", 3: "Gemini", 4: "Cancer", 5: "Leo", 6: "Virgo",
    7: "Libra", 8: "Scorpio", 9: "Sagittarius", 10: "Capricorn", 11: "Aquarius", 12: "Pisces"
  };

  const h4Sign = SIGN_NAMES_BY_NUM[houseToSignNum(4)] || "Virgo";
  const h8Sign = SIGN_NAMES_BY_NUM[houseToSignNum(8)] || "Capricorn";
  const h12Sign = SIGN_NAMES_BY_NUM[houseToSignNum(12)] || "Taurus";

  const waterHousesTrilogy = {
    fourthHouseLearned: `House 4 in ${h4Sign} (${SIGN_ELEMENT_MAP[h4Sign]}): Childhood environment taught you that emotional security requires ${
      SIGN_ELEMENT_MAP[h4Sign] === "Earth" ? "practical perfection and stability" :
      SIGN_ELEMENT_MAP[h4Sign] === "Water" ? "emotional sensitivity and caring for others" :
      SIGN_ELEMENT_MAP[h4Sign] === "Fire" ? "active strength and asserting family honor" : "curiosity and verbal vigilance"
    }.`,
    eighthHouseCarried: `House 8 in ${h8Sign} (${SIGN_ELEMENT_MAP[h8Sign]}): Inherited legacy holds unexpressed family secrets, unwritten obligations, and transformative shifts regarding family resources.`,
    twelfthHouseRelease: `House 12 in ${h12Sign} (${SIGN_ELEMENT_MAP[h12Sign]}): The spiritual gate where you are tasked to consciously release generational control, foreign/distant exploration, and inner solitude.`,
  };

  // 5. Sun-Moon Lineage Polarity
  const sunSign = chart.planets?.Sun?.sign || "Pisces";
  const moonSign = chart.planets?.Moon?.sign || "Taurus";
  const sunElement = SIGN_ELEMENT_MAP[sunSign] || "Water";
  const moonElement = SIGN_ELEMENT_MAP[moonSign] || "Earth";

  let compatibility: "Harmonious" | "Friction" | "Dynamic Complementary" = "Harmonious";
  let lineageDynamicNarrative = "";

  if (sunElement === moonElement) {
    compatibility = "Harmonious";
    lineageDynamicNarrative =
      "Sun and Moon share the same elemental wavelength. The paternal ambition and maternal emotional inheritance resonate in parallel, giving unified inner purpose.";
  } else if (
    (sunElement === "Fire" && moonElement === "Air") ||
    (sunElement === "Air" && moonElement === "Fire") ||
    (sunElement === "Earth" && moonElement === "Water") ||
    (sunElement === "Water" && moonElement === "Earth")
  ) {
    compatibility = "Dynamic Complementary";
    lineageDynamicNarrative =
      `Paternal energy (${sunElement}) and maternal emotional grounding (${moonElement}) nourish each other. One provides the root or vision, the other stabilizes the vessel.`;
  } else {
    compatibility = "Friction";
    lineageDynamicNarrative =
      `Paternal lineage demands (${sunElement}) and maternal emotional instincts (${moonElement}) function on contrasting frequencies, requiring conscious synthesis inside the native.`;
  }

  // 6. Somatic & Energy Field (Mr. A & Polarity Therapy)
  let vulnerableOrganSystem = "";
  let elementalPathology = "";
  let energyDepletionPattern = "";
  let restorativeSomaticPractice = "";

  if (saturnElement === "Earth") {
    vulnerableOrganSystem = "Skeletal structure, joints/knees, lower back, teeth, and skin resilience";
    elementalPathology = "Excess Earth / rigidity: sluggish lymph, physical tension held in spine due to burden-carrying";
    energyDepletionPattern =
      "Absorbing the family's financial or structural anxieties into muscle tone, leading to somatic tightness.";
    restorativeSomaticPractice =
      "Grounding barefoot walks on natural earth, joint mobility yoga (Pawanmuktasana), warm sesame oil massage (Abhyanga).";
  } else if (saturnElement === "Water") {
    vulnerableOrganSystem = "Lymphatic system, fluid balance, digestive lining, and hormonal rhythms";
    elementalPathology = "Excess Water stagnation: emotional holding manifesting as fluid retention or psychosomatic fatigue";
    energyDepletionPattern =
      "Mr. A energy depletion: Picking up unexpressed sorrow from parents, draining solar vitality and digestive fire.";
    restorativeSomaticPractice =
      "Pranayama (Bhastrika/Kapalabhati) to ignite inner fire, dry heat sauna, expressive emotional release practices.";
  } else if (saturnElement === "Fire") {
    vulnerableOrganSystem = "Cardiovascular system, arterial pressure, ocular strain, and liver/bile (Pitta)";
    elementalPathology = "Constricted Fire: anger or creative frustration turned inward, producing acid reflux or heat surges";
    energyDepletionPattern =
      "Suppressed leadership drive leading to abrupt burnout or chronic nervous irritability.";
    restorativeSomaticPractice =
      "Cooling Chandra Bhedana pranayama, swimming, regular moderate cardio without competitive strain.";
  } else {
    vulnerableOrganSystem = "Nervous system, bronchial pathways, respiratory rhythm, and peripheral nerves";
    elementalPathology = "Excess Air / Vata: mental hyper-vigilance, racing mind, shallow upper-chest breathing";
    energyDepletionPattern =
      "Constant intellectual rumination trying to anticipate family discord or unspoken problems.";
    restorativeSomaticPractice =
      "Deep diaphragmatic slow breathing (Nadi Shodhana 4-7-8), sound meditation (Om/Raga Yaman), reduction of screen time.";
  }

  return {
    elemental: {
      saturnElement,
      saturnBlockageTheme,
      saturnBlockedDomain,
      elementalTally: tally,
      selfExpressiveCount,
      selfRepressiveCount,
      elementalBalanceVerdict,
      waterHousesTrilogy,
      ascendantRulerElement,
      ascendantRulerSignificance,
      sunMoonElementPolarity: {
        sunElement,
        moonElement,
        compatibility,
        lineageDynamicNarrative,
      },
    },
    somatic: {
      vulnerableOrganSystem,
      elementalPathology,
      energyDepletionPattern,
      restorativeSomaticPractice,
    },
  };
}
