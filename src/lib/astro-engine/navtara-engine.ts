// src/lib/astro-engine/navtara-engine.ts
// AstroLife — Authentic Navtara Master Engine
// Research-grade implementation of Classical Navtara, 3 Paryayas, 27th Support Star,
// 3-Layer Dasha Audit, Birth Star Quality Profile, and Deterministic Rule Trace.

import {
  NAKSHATRA_DATA,
  getNakshatraById,
  type NakshatraData,
  type ParyayaType,
  type ParyayaIntensity,
} from "./nakshatra-data";
import {
  resolveNakshatraCoordinate,
  type BoundaryAlert,
  type SupportedAyanamsha,
} from "./ayanamsa-config";
import type { ChartData } from "./calculations";
import type { DashaLord } from "./dasha";

// ── Classical 9 Taras Master Data ────────────────────────────────────────────

export interface TaraDefinition {
  taraNum: number; // 1 to 9
  name: string;
  sanskritName: string;
  category: "Supportive" | "Concern" | "Foundational";
  nature: "neutral" | "benefic" | "malefic" | "highly_benefic";
  signification: string;
  practicalAdvice: string;
  icon: string;
}

export const CLASSICAL_TARAS: Record<number, TaraDefinition> = {
  1: {
    taraNum: 1,
    name: "Janma",
    sanskritName: "जन्म तारा",
    category: "Foundational",
    nature: "neutral",
    signification: "Physical body, vitality, personal identity and inherent constitution",
    practicalAdvice: "Focus on bodily health, self-care, and personal grounding. Avoid over-exhaustion.",
    icon: "☉",
  },
  2: {
    taraNum: 2,
    name: "Sampat",
    sanskritName: "सम्पत् तारा",
    category: "Supportive",
    nature: "benefic",
    signification: "Wealth, material prosperity, resource inflow and lucrative ventures",
    practicalAdvice: "Highly auspicious for investments, contract signings, monetary expansion and acquisitions.",
    icon: "◆",
  },
  3: {
    taraNum: 3,
    name: "Vipat",
    sanskritName: "विपत् तारा",
    category: "Concern",
    nature: "malefic",
    signification: "Danger, unexpected impediments, hazards and friction in execution",
    practicalAdvice: "Exercise caution in negotiations and high-stakes commitments. Keep fallback options ready.",
    icon: "⚡",
  },
  4: {
    taraNum: 4,
    name: "Kshema",
    sanskritName: "क्षेम तारा",
    category: "Supportive",
    nature: "benefic",
    signification: "Wellbeing, security, domestic comfort and stable consolidation",
    practicalAdvice: "Favorable for long-term foundations, domestic peace, settling disputes and health recovery.",
    icon: "✦",
  },
  5: {
    taraNum: 5,
    name: "Pratyari",
    sanskritName: "प्रत्यरि तारा",
    category: "Concern",
    nature: "malefic",
    signification: "Opposition, adversarial pressure, misunderstandings and friction",
    practicalAdvice: "Avoid ego conflicts, unnecessary litigation and direct confrontation. Adopt diplomatic tact.",
    icon: "⚔",
  },
  6: {
    taraNum: 6,
    name: "Sadhaka",
    sanskritName: "साधक तारा",
    category: "Supportive",
    nature: "benefic",
    signification: "Accomplishment, realization of objectives, success and fruitful efforts",
    practicalAdvice: "Prime window for strategic execution, launching important projects and exam/interview success.",
    icon: "★",
  },
  7: {
    taraNum: 7,
    name: "Vadha",
    sanskritName: "वध / नैधन तारा",
    category: "Concern",
    nature: "malefic",
    signification: "Severe obstacles, endings, vulnerability and high-friction tests",
    practicalAdvice: "Avoid hasty or risky initiatives. Maintain defensive posture and utilize protective remedies.",
    icon: "☽",
  },
  8: {
    taraNum: 8,
    name: "Mitra",
    sanskritName: "मित्र तारा",
    category: "Supportive",
    nature: "benefic",
    signification: "Friendship, helpful allies, cooperative progress and harmonious social support",
    practicalAdvice: "Excellent for collaboration, networking, joint agreements and seeking mentorship.",
    icon: "♥",
  },
  9: {
    taraNum: 9,
    name: "Parama Mitra",
    sanskritName: "परम मित्र तारा",
    category: "Supportive",
    nature: "highly_benefic",
    signification: "Supreme ally, divine benevolence, breakthrough fellowship and fulfillment",
    practicalAdvice: "Maximum supportive harmony. Ideal for sacred endeavors, milestone ventures and creative peaks.",
    icon: "✿",
  },
};

// ── Rule Trace Infrastructure ────────────────────────────────────────────────

export interface RuleTraceItem {
  ruleId: string;
  basis: "DETERMINISTIC" | "SOURCE_DERIVED";
  title: string;
  evidence: string;
  sourceCitation: string;
}

// ── Core Navtara Calculation Result ──────────────────────────────────────────

export interface NavtaraMatrixItem {
  targetNakshatra: NakshatraData;
  countedPosition: number; // 1 to 27
  taraNum: number; // 1 to 9
  tara: TaraDefinition;
  paryaya: ParyayaType;
  paryayaIntensity: ParyayaIntensity;
  isBirthStar: boolean;
  isSupportStar: boolean;
}

export interface SupportStarShield {
  nakshatra: NakshatraData;
  countedPosition: number; // Always 27
  tara: TaraDefinition; // Parama Mitra
  anchors: {
    devta: string;
    devtaDescription: string;
    animal: string;
    bird: string;
    tree: string;
    symbol: string;
    tattva: string;
  };
  traditionalGuidance: string[];
  historicalExample: string;
}

export interface QualityProfile {
  birthStar: NakshatraData;
  precedingStar: NakshatraData;
  channellingLord: string;
  temperamentTitle: string;
  coreTraits: string[];
  description: string;
}

export interface DashaAuditLayer {
  level: "MD_PLANET" | "MD_STAR_LORD" | "MD_SUB_STAR_LORD" | "AD_PLANET" | "AD_STAR_LORD";
  label: string;
  planet: string;
  nakshatra: NakshatraData;
  tara: TaraDefinition;
  countedPosition: number;
  paryaya: ParyayaType;
  paryayaIntensity: ParyayaIntensity;
  isConcern: boolean; // 3, 5, or 7
  boundaryAlert?: BoundaryAlert;
}

export type DashaAuditPattern =
  | "TRIPLE_CONCERN"
  | "DOUBLE_CONCERN"
  | "SAVED_BY_ONE"
  | "DOUBLE_SUPPORT"
  | "TRIPLE_SUPPORT"
  | "FOUNDATIONAL";

export interface DashaNavtaraAudit {
  activeMahadasha: DashaLord;
  activeAntardasha?: DashaLord;
  layers: DashaAuditLayer[];
  pattern: DashaAuditPattern;
  patternSeverity: "Concern" | "Moderate" | "Supportive";
  patternDescription: string;
  antardashaModifier?: {
    adLord: string;
    adTara: TaraDefinition;
    status: "Relief Window" | "Heightened Concern" | "Harmonious Amplification";
    explanation: string;
  };
  ruleTraces: RuleTraceItem[];
}

export interface FullNavtaraIntelligence {
  birthNakshatra: NakshatraData;
  birthPada: number;
  selectedAyanamsa: SupportedAyanamsha;
  chakra27: NavtaraMatrixItem[];
  paryayaGroups: {
    prathama: NavtaraMatrixItem[]; // 1-9 (Janma Chakra)
    dvitiya: NavtaraMatrixItem[]; // 10-18 (Karma Chakra)
    tritiya: NavtaraMatrixItem[]; // 19-27 (Adhana Chakra)
  };
  supportStarShield: SupportStarShield;
  qualityProfile: QualityProfile;
  dashaAudit?: DashaNavtaraAudit;
  boundaryAlerts: BoundaryAlert[];
  ruleTraces: RuleTraceItem[];
}

// ── Pure Deterministic Math Helpers ──────────────────────────────────────────

export function getPlanetLon(p: any): number {
  return typeof p?.lon === "number" ? p.lon : (typeof p?.longitude === "number" ? p.longitude : 0);
}

/**
 * Calculates Tara number (1 to 9) from birth nakshatra index to target nakshatra index.
 * Formula: ((targetId - birthId) mod 9 + 9) mod 9 + 1
 */
export function calculateTaraNumber(birthId: number, targetId: number): number {
  const diff = targetId - birthId;
  return (((diff % 9) + 9) % 9) + 1;
}

/**
 * Calculates continuous counted position (1 to 27) from birth nakshatra index to target nakshatra index.
 * Formula: ((targetId - birthId) mod 27 + 27) mod 27 + 1
 */
export function calculateCountedPosition(birthId: number, targetId: number): number {
  const diff = targetId - birthId;
  return (((diff % 27) + 27) % 27) + 1;
}

/**
 * Assigns Paryaya type based on counted position (1-27).
 */
export function getParyayaByPosition(countedPos: number): {
  paryaya: ParyayaType;
  paryayaIntensity: ParyayaIntensity;
} {
  if (countedPos <= 9) {
    return { paryaya: "Prathama", paryayaIntensity: "Base" };
  } else if (countedPos <= 18) {
    return { paryaya: "Dvitiya", paryayaIntensity: "Moderate" };
  } else {
    return { paryaya: "Tritiya", paryayaIntensity: "Peak" };
  }
}

/**
 * Calculates the personal 27th Support Star (preceding nakshatra: birthId - 1).
 * Strict Scoping: Calculated ALWAYS from the Janma Nakshatra, never from Dasha lord.
 */
export function get27thSupportStar(birthNakshatraId: number): SupportStarShield {
  const precedingId = birthNakshatraId === 1 ? 27 : birthNakshatraId - 1;
  const supportNak = getNakshatraById(precedingId);
  const tara = CLASSICAL_TARAS[9]; // Counted position 27 is Parama Mitra

  return {
    nakshatra: supportNak,
    countedPosition: 27,
    tara,
    anchors: {
      devta: supportNak.devta,
      devtaDescription: supportNak.devtaDescription,
      animal: supportNak.animal,
      bird: supportNak.bird,
      tree: supportNak.tree,
      symbol: supportNak.symbol,
      tattva: supportNak.tattva,
    },
    traditionalGuidance: [
      `Honor the sacred symbol: Incorporate or visualize the ${supportNak.symbol} in daily contemplation.`,
      `Sacred Flora: Respect or plant the ${supportNak.tree} to harmonize planetary frequencies.`,
      `Faunal Affinity: Extend kindness to ${supportNak.animal} and ${supportNak.bird} to deflect adverse dasha impacts.`,
      `Divine Invocations: Meditate upon deity ${supportNak.devta} (${supportNak.devtaDescription}).`,
    ],
    historicalExample:
      "Classical Prototype: Lord Krishna, born in Rohini Nakshatra, held Krittika (the 27th preceding star, sacred to the Peacock/Agni) as his divine protector, perpetually gracing his crown with a Peacock Feather (Mor-Pankh) to neutralize impediments.",
  };
}

/**
 * Generates the "Birth Star Quality Profile" based on the lord of the preceding star.
 */
export function getBirthStarQualityProfile(birthNakshatraId: number): QualityProfile {
  const birthStar = getNakshatraById(birthNakshatraId);
  const precedingId = birthNakshatraId === 1 ? 27 : birthNakshatraId - 1;
  const precedingStar = getNakshatraById(precedingId);
  const channellingLord = precedingStar.lord;

  const lordTraitMap: Record<string, { title: string; traits: string[]; desc: string }> = {
    Ketu: {
      title: "Intuitive Mystic & Root Realist",
      traits: ["Deep instinct", "Detached perception", "Occult insight", "Root analytical focus"],
      desc: `Though born under ${birthStar.name} (${birthStar.lord}), your underlying temperament deeply channels the perceptive detachment and contemplative insight of Ketu (${precedingStar.name}).`,
    },
    Venus: {
      title: "Harmonizer, Aesthetic & Gentle Architect",
      traits: ["Aesthetic sensitivity", "Social diplomacy", "Creative elegance", "Desire for peace"],
      desc: `Though born under ${birthStar.name} (${birthStar.lord}), your underlying temperament channels the refined aesthetics, affectionate warmth and restorative diplomacy of Venus (${precedingStar.name}).`,
    },
    Sun: {
      title: "Principled Sovereign & Sovereign Will",
      traits: ["High integrity", "Natural leadership", "Self-respect", "Dharmic clarity"],
      desc: `Though born under ${birthStar.name} (${birthStar.lord}), your core nature resonates with the quiet self-respect, moral nobility and sovereign clarity of Surya (${precedingStar.name}).`,
    },
    Moon: {
      title: "Empathetic Feeler & Nourishing Guardian",
      traits: ["Emotional attunement", "Protective care", "Intuitive receptivity", "Adaptive grace"],
      desc: `Though born under ${birthStar.name} (${birthStar.lord}), you express your initiatives through the caring empathy, emotional responsiveness and imaginative depth of Chandra (${precedingStar.name}).`,
    },
    Mars: {
      title: "Courageous Innovator & Focused Defender",
      traits: ["Direct problem-solving", "Protective courage", "Decisive drive", "Technical acumen"],
      desc: `Though born under ${birthStar.name} (${birthStar.lord}), your inner operating engine channels the purposeful drive, technical acuity and fearless problem-solving of Mangal (${precedingStar.name}).`,
    },
    Rahu: {
      title: "Visionary Strategist & Unconventional Thinker",
      traits: ["Strategic foresight", "Unconventional wisdom", "Breakthrough ambition", "Pattern recognition"],
      desc: `Though born under ${birthStar.name} (${birthStar.lord}), your thinking reflects the boundary-crossing ingenuity, strategic restlessness and pattern recognition of Rahu (${precedingStar.name}).`,
    },
    Jupiter: {
      title: "Philosophical Counselor & Dharmic Guide",
      traits: ["Expansive wisdom", "Ethical counseling", "Optimistic mentorship", "Truth-seeking"],
      desc: `Though born under ${birthStar.name} (${birthStar.lord}), your disposition reflects the generous mentorship, philosophical wisdom and principled guidance of Brihaspati (${precedingStar.name}).`,
    },
    Saturn: {
      title: "Steadfast Realist & Enduring Pillar",
      traits: ["Patience under duty", "Methodical perseverance", "Practical grounding", "Enduring loyalty"],
      desc: `Though born under ${birthStar.name} (${birthStar.lord}), your demeanor radiates the grounded endurance, patient pragmatism and structural discipline of Shani (${precedingStar.name}).`,
    },
    Mercury: {
      title: "Analytical Communicator & Master Navigator",
      traits: ["Sharp intellectual curiosity", "Verbal dexterity", "Resourceful adaptability", "Commercial agility"],
      desc: `Though born under ${birthStar.name} (${birthStar.lord}), your internal reflexes reflect the rapid calculations, articulate communication and adaptive humor of Budh (${precedingStar.name}).`,
    },
  };

  const profileData = lordTraitMap[channellingLord] ?? {
    title: "Integrated Temperament",
    traits: ["Adaptability", "Perceptive intuition", "Balanced discernment"],
    desc: `Your innate nature harmoniously weaves the vitality of ${birthStar.lord} with the foundational wisdom of ${precedingStar.name}.`,
  };

  return {
    birthStar,
    precedingStar,
    channellingLord,
    temperamentTitle: profileData.title,
    coreTraits: profileData.traits,
    description: profileData.desc,
  };
}

/**
 * Builds the complete 27-Nakshatra Navtara Matrix from the native's Birth Star.
 */
export function build27NavtaraChakra(birthNakshatraId: number): NavtaraMatrixItem[] {
  const items: NavtaraMatrixItem[] = [];
  const precedingId = birthNakshatraId === 1 ? 27 : birthNakshatraId - 1;

  for (let i = 1; i <= 27; i++) {
    const targetNak = getNakshatraById(i);
    const countedPos = calculateCountedPosition(birthNakshatraId, i);
    const taraNum = calculateTaraNumber(birthNakshatraId, i);
    const tara = CLASSICAL_TARAS[taraNum];
    const { paryaya, paryayaIntensity } = getParyayaByPosition(countedPos);

    items.push({
      targetNakshatra: targetNak,
      countedPosition: countedPos,
      taraNum,
      tara,
      paryaya,
      paryayaIntensity,
      isBirthStar: i === birthNakshatraId,
      isSupportStar: i === precedingId,
    });
  }

  // Sort by continuous counted position from 1 to 27
  return items.sort((a, b) => a.countedPosition - b.countedPosition);
}

/**
 * Audits current Dasha using the 3-Layer Navtara Check:
 * Layer 1: Mahadasha Planet's Nakshatra -> Tara
 * Layer 2: Mahadasha Planet's Nakshatra Lord (NL) -> Tara
 * Layer 3: NL's Nakshatra Lord -> Tara (Skipped if NL === NL's Lord to eliminate redundant checks)
 */
export function auditDashaNavtara(
  birthNakshatraId: number,
  chart: ChartData,
  ayanamsa: SupportedAyanamsha,
  currentMD: DashaLord,
  currentAD?: DashaLord
): DashaNavtaraAudit {
  const ruleTraces: RuleTraceItem[] = [];
  const layers: DashaAuditLayer[] = [];

  // 1. Get Natal planet data for MD Lord
  const mdPlanetData = chart.planets[currentMD];
  const jd = chart.jd;

  if (!mdPlanetData) {
    throw new Error(`[NavtaraEngine] Planet data for Mahadasha Lord '${currentMD}' not found in ChartData.`);
  }

  // Layer 1: MD Planet Nakshatra
  const mdCoord = resolveNakshatraCoordinate(getPlanetLon(mdPlanetData), jd, ayanamsa);
  const mdNak = mdCoord.nakshatra;
  const mdCountedPos = calculateCountedPosition(birthNakshatraId, mdNak.id);
  const mdTaraNum = calculateTaraNumber(birthNakshatraId, mdNak.id);
  const mdTara = CLASSICAL_TARAS[mdTaraNum];
  const mdParyayaInfo = getParyayaByPosition(mdCountedPos);
  const isMDConcern = [3, 5, 7].includes(mdTaraNum);

  layers.push({
    level: "MD_PLANET",
    label: `Mahadasha Lord (${currentMD}) Placement`,
    planet: currentMD,
    nakshatra: mdNak,
    tara: mdTara,
    countedPosition: mdCountedPos,
    paryaya: mdParyayaInfo.paryaya,
    paryayaIntensity: mdParyayaInfo.paryayaIntensity,
    isConcern: isMDConcern,
    boundaryAlert: mdCoord.boundary.isNearBoundary ? mdCoord.boundary : undefined,
  });

  ruleTraces.push({
    ruleId: "NVT-R001",
    basis: "DETERMINISTIC",
    title: "Mahadasha Planet Tara Evaluation",
    evidence: `MD Planet ${currentMD} resides in ${mdNak.name} (Position ${mdCountedPos} from Janma). Tara #${mdTaraNum} (${mdTara.name}).`,
    sourceCitation: "Navtara Chakra Classical Counting Formula ((Target - Birth) mod 9 + 1).",
  });

  // Layer 2: MD Planet's Nakshatra Lord (NL)
  const nlLord = mdNak.lord;
  const nlPlanetData = chart.planets[nlLord];
  let nlTaraNum = mdTaraNum;
  let nlTara = mdTara;
  let nlCountedPos = mdCountedPos;
  let nlParyayaInfo = mdParyayaInfo;
  let isNLConcern = isMDConcern;
  let nlNak = mdNak;
  let nlCoord = mdCoord;

  if (nlPlanetData) {
    nlCoord = resolveNakshatraCoordinate(getPlanetLon(nlPlanetData), jd, ayanamsa);
    nlNak = nlCoord.nakshatra;
    nlCountedPos = calculateCountedPosition(birthNakshatraId, nlNak.id);
    nlTaraNum = calculateTaraNumber(birthNakshatraId, nlNak.id);
    nlTara = CLASSICAL_TARAS[nlTaraNum];
    nlParyayaInfo = getParyayaByPosition(nlCountedPos);
    isNLConcern = [3, 5, 7].includes(nlTaraNum);

    layers.push({
      level: "MD_STAR_LORD",
      label: `Nakshatra Lord (${nlLord}) Placement`,
      planet: nlLord,
      nakshatra: nlNak,
      tara: nlTara,
      countedPosition: nlCountedPos,
      paryaya: nlParyayaInfo.paryaya,
      paryayaIntensity: nlParyayaInfo.paryayaIntensity,
      isConcern: isNLConcern,
      boundaryAlert: nlCoord.boundary.isNearBoundary ? nlCoord.boundary : undefined,
    });

    ruleTraces.push({
      ruleId: "NVT-R002",
      basis: "SOURCE_DERIVED",
      title: "Nakshatra Lord (NL) Tara Qualification",
      evidence: `MD Nakshatra Lord ${nlLord} resides in ${nlNak.name} (Position ${nlCountedPos}). Tara #${nlTaraNum} (${nlTara.name}).`,
      sourceCitation: "Practical lecture transcript: Dasha quality requires independent Tara qualification of Star Lord.",
    });
  }

  // Layer 3: NL's Nakshatra Lord (Check ONLY if nlLord !== nlNak.lord)
  const nlOfNlLord = nlNak.lord;
  if (nlLord !== nlOfNlLord && chart.planets[nlOfNlLord]) {
    const nl2Data = chart.planets[nlOfNlLord];
    const nl2Coord = resolveNakshatraCoordinate(getPlanetLon(nl2Data), jd, ayanamsa);
    const nl2Nak = nl2Coord.nakshatra;
    const nl2CountedPos = calculateCountedPosition(birthNakshatraId, nl2Nak.id);
    const nl2TaraNum = calculateTaraNumber(birthNakshatraId, nl2Nak.id);
    const nl2Tara = CLASSICAL_TARAS[nl2TaraNum];
    const nl2ParyayaInfo = getParyayaByPosition(nl2CountedPos);
    const isNL2Concern = [3, 5, 7].includes(nl2TaraNum);

    layers.push({
      level: "MD_SUB_STAR_LORD",
      label: `Secondary Star Lord (${nlOfNlLord}) Placement`,
      planet: nlOfNlLord,
      nakshatra: nl2Nak,
      tara: nl2Tara,
      countedPosition: nl2CountedPos,
      paryaya: nl2ParyayaInfo.paryaya,
      paryayaIntensity: nl2ParyayaInfo.paryayaIntensity,
      isConcern: isNL2Concern,
      boundaryAlert: nl2Coord.boundary.isNearBoundary ? nl2Coord.boundary : undefined,
    });

    ruleTraces.push({
      ruleId: "NVT-R003",
      basis: "SOURCE_DERIVED",
      title: "Tertiary Star Lord (Triple Strike Verification)",
      evidence: `NL's Star Lord ${nlOfNlLord} is distinct from ${nlLord} and occupies ${nl2Nak.name}. Tara #${nl2TaraNum} (${nl2Tara.name}).`,
      sourceCitation: "Practical lecture transcript: Multi-tier star lordship evaluation for critical life transitions.",
    });
  }

  // 2. Pattern Determination
  const concernCount = layers.filter((l) => l.isConcern).length;
  const activeLayerCount = layers.length;

  let pattern: DashaAuditPattern = "DOUBLE_SUPPORT";
  let patternSeverity: "Concern" | "Moderate" | "Supportive" = "Supportive";
  let patternDescription = "";

  if (concernCount === activeLayerCount && activeLayerCount >= 3) {
    pattern = "TRIPLE_CONCERN";
    patternSeverity = "Concern";
    patternDescription = `Triple Concern Strike: All 3 qualifying dasha layers (Planet, Star Lord, and Secondary Star Lord) occupy challenging Taras (3, 5, or 7). High conscious awareness and defensive focus are advised.`;
  } else if (isMDConcern && isNLConcern) {
    pattern = "DOUBLE_CONCERN";
    patternSeverity = "Concern";
    patternDescription = `Double Concern Pattern: Both the Mahadasha Lord (${currentMD} in ${mdTara.name}) and its Nakshatra Lord (${nlLord} in ${nlTara.name}) occupy concern Taras (3, 5, or 7). Structural resistance is heightened.`;
  } else if (isMDConcern || isNLConcern) {
    pattern = "SAVED_BY_ONE";
    patternSeverity = "Moderate";
    patternDescription = isMDConcern
      ? `Shielded Concern: While the Dasha Lord ${currentMD} falls in ${mdTara.name} (Tara #${mdTaraNum}), its Nakshatra Lord ${nlLord} occupies supportive ${nlTara.name} (Tara #${nlTaraNum}), offering practical mitigation and recovery.`
      : `Conditional Friction: Dasha Lord ${currentMD} occupies supportive ${mdTara.name}, though its Star Lord ${nlLord} is in ${nlTara.name}. Progress continues with periodic tactical adjustments.`;
  } else if (concernCount === 0 && activeLayerCount >= 3) {
    pattern = "TRIPLE_SUPPORT";
    patternSeverity = "Supportive";
    patternDescription = `Triple Auspicious Harmony: All active qualifying layers fall into supportive Taras (2, 4, 6, 8, or 9), indicating sustained momentum, harmony and structural elevation.`;
  } else {
    pattern = "DOUBLE_SUPPORT";
    patternSeverity = "Supportive";
    patternDescription = `Double Support Pattern: Both Mahadasha Lord (${currentMD} in ${mdTara.name}) and its Star Lord (${nlLord} in ${nlTara.name}) occupy auspicious Taras, indicating productive continuity.`;
  }

  ruleTraces.push({
    ruleId: "NVT-R010",
    basis: "SOURCE_DERIVED",
    title: "Pattern Qualification",
    evidence: `Pattern resolved to '${pattern}' (Concern Count: ${concernCount}/${activeLayerCount}).`,
    sourceCitation: "Transcript qualification rule: Dasha quality requires matching Planet Tara and NL Tara.",
  });

  // 3. Antardasha Modifier (if provided)
  let antardashaModifier: DashaNavtaraAudit["antardashaModifier"] | undefined;
  if (currentAD && chart.planets[currentAD]) {
    const adData = chart.planets[currentAD];
    const adCoord = resolveNakshatraCoordinate(getPlanetLon(adData), jd, ayanamsa);
    const adNak = adCoord.nakshatra;
    const adCountedPos = calculateCountedPosition(birthNakshatraId, adNak.id);
    const adTaraNum = calculateTaraNumber(birthNakshatraId, adNak.id);
    const adTara = CLASSICAL_TARAS[adTaraNum];
    const isADConcern = [3, 5, 7].includes(adTaraNum);

    let adStatus: "Relief Window" | "Heightened Concern" | "Harmonious Amplification";
    let adExplanation: string;

    if (patternSeverity === "Concern" && !isADConcern) {
      adStatus = "Relief Window";
      adExplanation = `Antardasha of ${currentAD} falls in supportive ${adTara.name} Tara (#${adTaraNum}), offering a constructive relief and resolution phase within the heavier overarching Mahadasha.`;
    } else if (patternSeverity === "Concern" && isADConcern) {
      adStatus = "Heightened Concern";
      adExplanation = `Antardasha of ${currentAD} also falls in ${adTara.name} Tara (#${adTaraNum}), concentrating friction. Maintain strategic conservatism.`;
    } else {
      adStatus = isADConcern ? "Relief Window" : "Harmonious Amplification";
      adExplanation = `Antardasha of ${currentAD} operates through ${adTara.name} Tara (#${adTaraNum}), channeling current life themes through ${adNak.primaryQuality}.`;
    }

    antardashaModifier = {
      adLord: currentAD,
      adTara,
      status: adStatus,
      explanation: adExplanation,
    };

    ruleTraces.push({
      ruleId: "NVT-R012",
      basis: "SOURCE_DERIVED",
      title: "Antardasha Modifier Integration",
      evidence: `AD Lord ${currentAD} in ${adNak.name} (Tara #${adTaraNum} ${adTara.name}) -> Status: ${adStatus}.`,
      sourceCitation: "Practical lecture transcript: Antardashas serve as dynamic relief or intensification phases.",
    });
  }

  return {
    activeMahadasha: currentMD,
    activeAntardasha: currentAD,
    layers,
    pattern,
    patternSeverity,
    patternDescription,
    antardashaModifier,
    ruleTraces,
  };
}

/**
 * Master Engine Coordinator: Builds the complete Navtara Intelligence system for a Chart.
 */
export function runNavtaraIntelligence(
  chart: ChartData,
  ayanamsa: SupportedAyanamsha = "Lahiri_Chitrapaksha",
  thresholdArcMin = 15
): FullNavtaraIntelligence {
  const ruleTraces: RuleTraceItem[] = [];

  // 1. Identify Janma Nakshatra from Natal Moon
  const moonData = chart.planets["Moon"];
  if (!moonData) {
    throw new Error("[NavtaraEngine] Natal Moon position missing from ChartData.");
  }

  const moonCoord = resolveNakshatraCoordinate(
    getPlanetLon(moonData),
    chart.jd,
    ayanamsa,
    thresholdArcMin
  );
  const birthNakshatra = moonCoord.nakshatra;
  const birthPada = moonCoord.pada;

  ruleTraces.push({
    ruleId: "NVT-R000",
    basis: "DETERMINISTIC",
    title: "Birth Nakshatra Identification",
    evidence: `Moon at ${getPlanetLon(moonData).toFixed(2)}° Lahiri resolves to ${birthNakshatra.name} (${birthNakshatra.lord}) Pada ${birthPada} under ${ayanamsa}.`,
    sourceCitation: "Surya Siddhanta & Chitrapaksha baseline.",
  });

  // 2. Build 27-Nakshatra continuous chakra
  const chakra27 = build27NavtaraChakra(birthNakshatra.id);

  // Group into 3 Paryayas
  const prathama = chakra27.filter((item) => item.paryaya === "Prathama");
  const dvitiya = chakra27.filter((item) => item.paryaya === "Dvitiya");
  const tritiya = chakra27.filter((item) => item.paryaya === "Tritiya");

  // 3. Compute 27th Support Star Shield
  const supportStarShield = get27thSupportStar(birthNakshatra.id);
  ruleTraces.push({
    ruleId: "NVT-R027",
    basis: "SOURCE_DERIVED",
    title: "27th Support Star Derivation",
    evidence: `Birth Star ${birthNakshatra.name} (#${birthNakshatra.id}) -> Preceding Star ${supportStarShield.nakshatra.name} (#${supportStarShield.nakshatra.id}).`,
    sourceCitation: "Transcript strict rule: 27th star is always and exclusively calculated from Janma Nakshatra.",
  });

  // 4. Compute Birth Star Quality Profile
  const qualityProfile = getBirthStarQualityProfile(birthNakshatra.id);
  ruleTraces.push({
    ruleId: "NVT-R028",
    basis: "SOURCE_DERIVED",
    title: "Birth Star Quality Profile Derivation",
    evidence: `Preceding Star Lord ${qualityProfile.channellingLord} defines underlying innate temperament: ${qualityProfile.temperamentTitle}.`,
    sourceCitation: "Practical lecture transcript: Core behavioural temperament reflects the preceding star's lord.",
  });

  // 5. Audit Current Active Dasha if available
  let dashaAudit: DashaNavtaraAudit | undefined;
  const activeMD = chart.dashas?.find((d) => d.active)?.planet as DashaLord | undefined;
  const activeAD = chart.antardasha?.find((a) => a.active)?.planet as DashaLord | undefined;

  if (activeMD) {
    try {
      dashaAudit = auditDashaNavtara(
        birthNakshatra.id,
        chart,
        ayanamsa,
        activeMD,
        activeAD
      );
      ruleTraces.push(...dashaAudit.ruleTraces);
    } catch (err) {
      console.warn("[NavtaraEngine] Failed to audit active dasha:", err);
    }
  }

  // 6. Collect boundary alerts across all natal planets
  const boundaryAlerts: BoundaryAlert[] = [];
  for (const [planetName, pData] of Object.entries(chart.planets)) {
    const coord = resolveNakshatraCoordinate(
      getPlanetLon(pData),
      chart.jd,
      ayanamsa,
      thresholdArcMin
    );
    if (coord.boundary.isNearBoundary) {
      boundaryAlerts.push({
        ...coord.boundary,
        alertText: `${planetName}: ${coord.boundary.alertText}`,
      });
    }
  }

  return {
    birthNakshatra,
    birthPada,
    selectedAyanamsa: ayanamsa,
    chakra27,
    paryayaGroups: {
      prathama,
      dvitiya,
      tritiya,
    },
    supportStarShield,
    qualityProfile,
    dashaAudit,
    boundaryAlerts,
    ruleTraces,
  };
}
