/**
 * Astrolife Outer Planets & Modular Prediction Engine (Advanced Edition)
 * Covers:
 *  - URANUS (Herschel) -> INDRA (इंद्र / प्रजापति)
 *  - NEPTUNE           -> VARUN (वरुण)
 *  - PLUTO             -> YAM (यम)
 *
 * Core Capabilities:
 *  1. Astronomical Parameters, Ephemeris Speeds & Progressions by Averages
 *  2. Sepharial Decanate Vibration Boost
 *  3. Strict Transit Aspect Engine (Major 3°/2°, Minor 1°: Quintile, Septile, Quincunx, Sesquiquadrate, Semisquare)
 *  4. Stationary Peak Multiplier (EXTREME_STATIONARY_PEAK at <= 1.0° orb)
 *  5. Robert Hand's Algebraic Event-Timing Engine (Applying vs Separating Net Orb = 0)
 *  6. Symbolic Directions (1° = 1 year, Zero Orb) & Progressed MC (0° 59' 8.17" per year)
 *  7. Triple Transit Retrograde Loop State Machine (Pass 1 -> Pass 2 -> Pass 3)
 *  8. Next-House Cusp Buffer Rule (3.0° pre-ingress activation)
 *  9. Planetary Combination & Natal Touchpoints Knowledge Base (Gift vs Shadow)
 * 10. 12 Signs x 12 Houses Modular Prediction Matrix (Harmonious vs Afflicted)
 */

import ephemeris from "ephemeris";
import { lahiri } from "./calculations";

export type OuterPlanetKey = 'URANUS' | 'NEPTUNE' | 'PLUTO';
export type AspectType =
  | 'Conjunction'
  | 'Opposition'
  | 'Square'
  | 'Trine'
  | 'Sextile'
  | 'SemiSextile'
  | 'SemiSquare'
  | 'Quintile'
  | 'Sesquiquadrate'
  | 'Quincunx'
  | 'Septile';

export type MotionState = 'DIRECT' | 'RETROGRADE' | 'STATIONARY';
export type TransitIntensity = 'MODERATE' | 'HIGH_EXACT' | 'EXTREME_STATIONARY_PEAK';
export type TripleTransitPass = 'PASS_1_INITIATION' | 'PASS_2_CRISIS_CULMINATION' | 'PASS_3_FINAL_RESOLUTION';

export interface AspectDefinition {
  targetAngle: number;
  maxOrb: number;
}

export const TRANSIT_ASPECT_ORBS: Record<AspectType, AspectDefinition> = {
  Conjunction: { targetAngle: 0.0, maxOrb: 3.0 },
  Opposition: { targetAngle: 180.0, maxOrb: 3.0 },
  Square: { targetAngle: 90.0, maxOrb: 2.0 },
  Trine: { targetAngle: 120.0, maxOrb: 2.0 },
  Sextile: { targetAngle: 60.0, maxOrb: 1.0 },
  SemiSextile: { targetAngle: 30.0, maxOrb: 1.0 },
  SemiSquare: { targetAngle: 45.0, maxOrb: 1.0 },
  Quintile: { targetAngle: 72.0, maxOrb: 1.0 },
  Sesquiquadrate: { targetAngle: 135.0, maxOrb: 1.0 },
  Quincunx: { targetAngle: 150.0, maxOrb: 1.0 },
  Septile: { targetAngle: 51.42857, maxOrb: 1.0 },
};

export interface PlanetDignityRules {
  name: string;
  hindiName: 'INDRA' | 'VARUN' | 'YAM';
  devanagariName: string;
  higherOctaveOf: string;
  cycleYears: number;
  meanDailyMotionArcSec: number;
  retrogradeElongationFromSun: number | null;
  directElongationFromSun: number | null;
  stationaryDaysWindow: number;
  retrogradeDurationDays: number;
  natureWeight: number; // Benefic=1.0, Neutral=0.25, Malefic=0.0
  ownSigns: number[];
  exaltationSigns: number[];
  debilitationSigns: number[];
  friendlySigns: number[];
  enemySigns: number[];
  decanateBoost: [number, number][]; // [RashiIndex, DecanateNumber]
  chakra: string;
  colors: string[];
}

export const OUTER_PLANETS_CONFIG: Record<OuterPlanetKey, PlanetDignityRules> = {
  URANUS: {
    name: 'Uranus (Herschel)',
    hindiName: 'INDRA',
    devanagariName: 'इंद्र',
    higherOctaveOf: 'Mercury (Cosmic Mind, Intuition, Invention)',
    cycleYears: 84.01,
    meanDailyMotionArcSec: 42.21,
    retrogradeElongationFromSun: 257.0, // ~103° behind Sun
    directElongationFromSun: 103.0,
    stationaryDaysWindow: 10,
    retrogradeDurationDays: 150,
    natureWeight: 0.0, // Malefic nature (Mars-like suddenness)
    ownSigns: [11], // Aquarius (Kumbh)
    exaltationSigns: [8, 3], // Scorpio / Gemini 20°
    debilitationSigns: [2, 5, 9], // Taurus / Leo / Sagittarius
    friendlySigns: [1, 4, 5], // Sun, Moon, Mars
    enemySigns: [7, 10, 11], // Venus, Saturn
    decanateBoost: [[2, 1], [11, 2]], // Taurus 1st Decanate, Aquarius 2nd Decanate
    chakra: '1st/Root',
    colors: ['Dark Purple', 'Blue', 'Palids', 'Mixed/Checkered'],
  },
  NEPTUNE: {
    name: 'Neptune',
    hindiName: 'VARUN',
    devanagariName: 'वरुण',
    higherOctaveOf: 'Venus (Universal Love, Mysticism, Divine Art)',
    cycleYears: 164.8,
    meanDailyMotionArcSec: 21.53,
    retrogradeElongationFromSun: 259.0, // ~101° behind Sun
    directElongationFromSun: 111.0,
    stationaryDaysWindow: 10,
    retrogradeDurationDays: 159,
    natureWeight: 1.0, // Benefic (Jupiter-like, spiritual transcendence)
    ownSigns: [12], // Pisces (Meen)
    exaltationSigns: [4, 5], // Cancer / Leo
    debilitationSigns: [10, 6, 11], // Capricorn / Virgo / Aquarius
    friendlySigns: [7, 4, 9, 12], // Venus, Moon, Jupiter
    enemySigns: [1, 8, 10, 11], // Mars, Saturn
    decanateBoost: [[4, 1], [6, 2]], // Cancer 1st Decanate, Virgo 2nd Decanate
    chakra: '3rd/Solar Plexus',
    colors: ['White', 'Mauve', 'Light Green', 'Silver', 'Blue', 'Dull Grey to Black'],
  },
  PLUTO: {
    name: 'Pluto',
    hindiName: 'YAM',
    devanagariName: 'यम',
    higherOctaveOf: 'Mars (Kundalini, Collective Will, Transformation)',
    cycleYears: 247.7,
    meanDailyMotionArcSec: 14.53,
    retrogradeElongationFromSun: 260.0,
    directElongationFromSun: 100.0,
    stationaryDaysWindow: 7,
    retrogradeDurationDays: 160,
    natureWeight: 0.25, // Neutral / Dual (Lord Shiva: Creator & Destroyer)
    ownSigns: [8, 1], // Scorpio / Aries
    exaltationSigns: [5, 1], // Leo / Aries
    debilitationSigns: [11, 7], // Aquarius / Libra
    friendlySigns: [1, 5, 9], // Mars, Sun, Jupiter
    enemySigns: [4, 7], // Moon, Venus
    decanateBoost: [[1, 1], [8, 1]], // Aries 1st Decanate, Scorpio 1st Decanate
    chakra: 'Subconscious/Kundalini',
    colors: ['Deep Red', 'Black', 'Plutonian tones'],
  },
};

export const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Two-body Natal/Transit Combinations Knowledge Base (Gift vs Shadow)
 */
export const PLANETARY_COMBINATIONS_KB: Record<string, { gift: string; shadow: string }> = {
  'PLUTO_SUN': {
    gift: 'Laser focus, persistence, investigative depth, all-in willpower, self-regeneration.',
    shadow: 'Power struggles, ego-driven control, refusal to compromise.',
  },
  'PLUTO_MOON': {
    gift: 'Deep emotional intensity, subconscious mastery, psychological insight.',
    shadow: 'Emotional compulsion, desire to control feelings, hidden family/subconscious triggers.',
  },
  'PLUTO_MERCURY': {
    gift: 'Laser-focused mind, detective/researcher skills, strategic communicator, therapist aptitude.',
    shadow: 'Obsessive thoughts, verbal manipulation, mental exhaustion.',
  },
  'PLUTO_MARS': {
    gift: 'Power-packed superhuman drive, fearless productivity (Pluto as higher octave of Mars).',
    shadow: 'Explosive anger, compulsive force, ruthless domination.',
  },
  'PLUTO_JUPITER': {
    gift: 'Personal empowerment, resourcefulness, removing internal blocks, persuasive leadership.',
    shadow: 'Ideological fanaticism, excessive ambition.',
  },
  'PLUTO_SATURN': {
    gift: 'Tremendous discipline for self-regeneration, structural endurance.',
    shadow: 'Subconscious fears, paranoia; linked to institutional collapses and mass austerity.',
  },
  'PLUTO_URANUS': {
    gift: 'Dynamic awakenings, flashes of intuitive insight, healing tech innovations, social reform.',
    shadow: 'Sudden upheaval, urge for power, extreme rebellion or violence.',
  },
  'PLUTO_NEPTUNE': {
    gift: 'Generational spiritual awakening, universal love, artistic & psychic sensitivity.',
    shadow: 'Vulnerability to intrigues, scandals, escapism, or addictive patterns.',
  },
  'PLUTO_ASCENDANT': {
    gift: 'Deliberate, strategic, magnetic and mysterious presence; dislikes superficiality.',
    shadow: 'Controlling persona, intense life ordeals shaping identity.',
  },
  'NEPTUNE_ASCENDANT': {
    gift: 'Enhanced psychic, intuitive, empathetic, and imaginative capabilities.',
    shadow: 'Unsteady, impressionable, confused boundaries, susceptibility to deception.',
  },
  'URANUS_MC_HARD': {
    gift: 'Sudden breakthrough in independent or scientific career.',
    shadow: 'Sudden unexpected troubles, loss of reputation, or danger to father/superiors.',
  },
  'NEPTUNE_MC_HARD': {
    gift: 'Artistic or spiritual public calling with charismatic reach.',
    shadow: 'Peculiar unexpected events, suffering through fraud, treachery, or bad advice of friends.',
  },
  'SATURN_TRANSIT_URANUS': {
    gift: 'If well-aspected: benefit through occultism, inventions, science, or public affairs.',
    shadow: 'Danger of loss, disputes with superiors, disfavour by authorities, decline in power.',
  },
  'SATURN_TRANSIT_NEPTUNE': {
    gift: 'Practical grounding of spiritual ideals through concrete structure.',
    shadow: 'Unfortunate troubles through matters signified by the house where Neptune is posited.',
  },
};

/**
 * 1. Progression by Averages & Symbolic Directions
 */
export function calculateProgressions(
  natalPositions: Record<string, number>,
  natalMC: number,
  elapsedYears: number
) {
  // Symbolic Direction: exactly 1° per year (Zero Orb system)
  const symbolicDirections: Record<string, number> = {};
  for (const [k, v] of Object.entries(natalPositions)) {
    symbolicDirections[k] = Number(((v + elapsedYears * 1.0) % 360).toFixed(4));
  }

  // Progressed MC by Mean Solar Rate (0° 59' 8.17" per year)
  const mcDailyDeg = 59 / 60.0 + 8.17 / 3600.0;
  const mcOffset = elapsedYears * mcDailyDeg;
  const progressedMC = Number(((natalMC + mcOffset) % 360).toFixed(4));

  // Progression by Averages
  const averageProgressions: Record<string, number> = {};
  for (const [pName, nLon] of Object.entries(natalPositions)) {
    const key = pName.toUpperCase() as OuterPlanetKey;
    if (OUTER_PLANETS_CONFIG[key]) {
      const dailyDeg = OUTER_PLANETS_CONFIG[key].meanDailyMotionArcSec / 3600.0;
      averageProgressions[pName] = Number(((nLon + mcOffset + elapsedYears * dailyDeg) % 360).toFixed(4));
    }
  }

  return {
    elapsedYears,
    progressedMC,
    symbolicDirections,
    averageProgressions,
  };
}

/**
 * 2. Progression by Averages Arc for a single planet
 */
export function calculateProgressedArc(planet: OuterPlanetKey, elapsedYears: number): number {
  const config = OUTER_PLANETS_CONFIG[planet];
  const totalArcSeconds = config.meanDailyMotionArcSec * elapsedYears;
  return totalArcSeconds / 3600.0;
}

/**
 * 3. Motion State (Direct, Retrograde, Stationary) via Ephemeris Daily Speed or Sun Elongation
 */
export function evaluateMotionState(
  planet: OuterPlanetKey,
  planetLon: number,
  sunLon: number,
  dailySpeedDeg?: number
): MotionState {
  // If exact daily speed is provided
  if (dailySpeedDeg !== undefined) {
    if (Math.abs(dailySpeedDeg) <= 0.002) return 'STATIONARY';
    if (dailySpeedDeg < 0) return 'RETROGRADE';
    return 'DIRECT';
  }

  // Fallback to Notebook Sun-Distance Trigger Table for Uranus & Neptune
  const config = OUTER_PLANETS_CONFIG[planet];
  const distFromSun = ((planetLon - sunLon) % 360 + 360) % 360;

  if (config.retrogradeElongationFromSun && config.directElongationFromSun) {
    const rTrig = config.retrogradeElongationFromSun;
    const dTrig = config.directElongationFromSun;

    // Within 2 degrees of trigger station = Stationary window
    if (Math.abs(distFromSun - rTrig) <= 2.0 || Math.abs(distFromSun - dTrig) <= 2.0) {
      return 'STATIONARY';
    }
    // Between direct angle and retrograde angle
    if (distFromSun >= rTrig || distFromSun <= dTrig) {
      return 'RETROGRADE';
    }
  }

  return 'DIRECT';
}

/**
 * Helper: Backward compatible check for retrogression
 */
export function isRetrogradeBySunDistance(
  planetLongitude: number,
  sunLongitude: number,
  planet: OuterPlanetKey
): boolean {
  const state = evaluateMotionState(planet, planetLongitude, sunLongitude);
  return state === 'RETROGRADE' || state === 'STATIONARY';
}

/**
 * 4. Robert Hand's Algebraic Event Timing Calculator
 * Computes net signed transit orb. When algebraic sum approaches 0.0, the event peaks.
 */
export function calculateAlgebraicEventTiming(transitingAngles: number[]) {
  const posSum = transitingAngles.filter((a) => a > 0).reduce((acc, v) => acc + v, 0);
  const negSum = transitingAngles.filter((a) => a < 0).reduce((acc, v) => acc + Math.abs(v), 0);

  const netOrb = negSum > posSum ? -(negSum - posSum) : posSum - negSum;
  const avgOrb = transitingAngles.length > 0 ? netOrb / transitingAngles.length : 0.0;

  return {
    algebraicSumDeg: Number(netOrb.toFixed(4)),
    averageOrbDeg: Number(avgOrb.toFixed(4)),
    isEventPeakWindow: Math.abs(avgOrb) <= 0.5,
  };
}

/**
 * 5. Triple Transit State Machine Stage Resolver
 */
export function getTripleTransitStage(
  currentPass: 1 | 2 | 3,
  motionState: MotionState
): { stage: TripleTransitPass; description: string } {
  if (currentPass === 1) {
    return {
      stage: 'PASS_1_INITIATION',
      description: 'First Direct Contact: The issue or psychological process is triggered and highlighted.',
    };
  }
  if (currentPass === 2 || motionState === 'RETROGRADE') {
    return {
      stage: 'PASS_2_CRISIS_CULMINATION',
      description: 'Retrograde Contact: Internal pressure peaks, crisis points emerge, reassessment and reworking necessary.',
    };
  }
  return {
    stage: 'PASS_3_FINAL_RESOLUTION',
    description: 'Final Direct Contact: Concluding events, integration, and definitive permanent resolution.',
  };
}

export interface TransitAspectHit {
  transitingPlanet: OuterPlanetKey;
  transitingHindiName: 'INDRA' | 'VARUN' | 'YAM';
  natalPoint: string;
  aspect: AspectType;
  exactTargetAngle: number;
  orb: number;
  signedAngle: number; // Negative = Applying, Positive = Separating
  motionState: MotionState;
  intensity: TransitIntensity;
  isHarmonious: boolean;
  combinationInsight?: { gift: string; shadow: string };
}

/**
 * 6. Strict Transit Scanner with Stationary Peak Multiplier
 */
export function scanTransitsToNatal(
  transitPlanet: OuterPlanetKey,
  transitLon: number,
  motionState: MotionState,
  natalPoints: Record<string, number>,
  isApplying: (natalName: string) => boolean = () => true
): TransitAspectHit[] {
  const activeHits: TransitAspectHit[] = [];
  const config = OUTER_PLANETS_CONFIG[transitPlanet];

  for (const [natalName, natalLon] of Object.entries(natalPoints)) {
    const rawDiff = Math.abs(transitLon - natalLon) % 360.0;
    const angle = Math.min(rawDiff, 360.0 - rawDiff);

    for (const [aspectName, { targetAngle, maxOrb }] of Object.entries(TRANSIT_ASPECT_ORBS)) {
      const orbDiff = Math.abs(angle - targetAngle);

      if (orbDiff <= maxOrb) {
        let intensity: TransitIntensity = 'MODERATE';
        if (orbDiff <= 1.0 && motionState === 'STATIONARY') {
          intensity = 'EXTREME_STATIONARY_PEAK';
        } else if (orbDiff <= 1.0) {
          intensity = 'HIGH_EXACT';
        }

        const isApplyingFlag = isApplying(natalName);
        const signedAngle = isApplyingFlag ? -orbDiff : orbDiff;

        const isHarmonious =
          ['Trine', 'Sextile', 'Quintile'].includes(aspectName) ||
          (aspectName === 'Conjunction' && !['Mars', 'Saturn', 'Rahu', 'Ketu'].includes(natalName));

        // Look up two-body combination insight
        const pairKey = `${transitPlanet}_${natalName.toUpperCase()}`;
        const comboInsight = PLANETARY_COMBINATIONS_KB[pairKey];

        activeHits.push({
          transitingPlanet: transitPlanet,
          transitingHindiName: config.hindiName,
          natalPoint: natalName,
          aspect: aspectName as AspectType,
          exactTargetAngle: targetAngle,
          orb: Number(orbDiff.toFixed(3)),
          signedAngle: Number(signedAngle.toFixed(3)),
          motionState,
          intensity,
          isHarmonious,
          combinationInsight: comboInsight,
        });
      }
    }
  }

  return activeHits;
}

/**
 * 7. House Placement & 3-Degree Next-House Cusp Buffer
 */
export function getHousePlacementWithBuffer(
  longitude: number,
  houseCusps: number[] // 12 house cusp longitudes
): { currentHouse: number; nextHouseBufferActive: number | null } {
  const lon = ((longitude % 360) + 360) % 360;
  let currentHouse = 1;
  let nextHouseBufferActive: number | null = null;

  for (let i = 0; i < 12; i++) {
    const cuspStart = houseCusps[i];
    const cuspEnd = houseCusps[(i + 1) % 12];

    const inHouse =
      cuspStart <= cuspEnd
        ? lon >= cuspStart && lon < cuspEnd
        : lon >= cuspStart || lon < cuspEnd;

    if (inHouse) {
      currentHouse = i + 1;
      const distToNextCusp = ((cuspEnd - lon) % 360 + 360) % 360;
      if (distToNextCusp <= 3.0) {
        nextHouseBufferActive = ((i + 1) % 12) + 1;
      }
      break;
    }
  }

  return { currentHouse, nextHouseBufferActive };
}

// -------------------------------------------------------------
// 12 Signs x 12 Houses Modular Prediction Matrix
// -------------------------------------------------------------
export const PREDICTION_DATABASE: Record<
  OuterPlanetKey,
  {
    rashi: Record<number, { harmonious: string; afflicted: string }>;
    house: Record<number, { harmonious: string; afflicted: string }>;
  }
> = {
  URANUS: {
    rashi: {
      1: { harmonious: "INDRA (Uranus) in Aries grants pioneering spirit, bold scientific reform, and fearless originality.", afflicted: "INDRA (Uranus) in Aries incites reckless rebellion, erratic temper, and sudden self-disruptive choices." },
      2: { harmonious: "INDRA (Uranus) in Taurus brings radical financial ideas, inventive resource management, and progressive values.", afflicted: "INDRA (Uranus) in Taurus triggers severe wealth fluctuations and stubborn unconventional spending." },
      3: { harmonious: "INDRA (Uranus) in Gemini delivers an intuitive, ingenious intellect fascinated by tech, astrology, and mechanics.", afflicted: "INDRA (Uranus) in Gemini causes fractured communications, sibling misunderstandings, and travel disruptions." },
      4: { harmonious: "INDRA (Uranus) in Cancer attunes the emotional nature to occult vibrations with a progressive domestic environment.", afflicted: "INDRA (Uranus) in Cancer brings sudden domestic instability, maternal estrangement, and nervous stomach sensitivities." },
      5: { harmonious: "INDRA (Uranus) in Leo unleashes creative genius, unconventional romance, and fierce independence.", afflicted: "INDRA (Uranus) in Leo risks abrupt relationship splits, speculative shocks, and stubborn friction with children." },
      6: { harmonious: "INDRA (Uranus) in Virgo introduces breakthrough health solutions, technical acumen, and inventive daily workflows.", afflicted: "INDRA (Uranus) in Virgo produces nervous exhaustion, sudden workplace disputes, and erratic somatic stress." },
      7: { harmonious: "INDRA (Uranus) in Libra attracts magnetic, independent, and reform-minded partners.", afflicted: "INDRA (Uranus) in Libra signals sudden marital friction, erratic contracts, and abrupt legal developments." },
      8: { harmonious: "Exalted INDRA (Uranus) in Scorpio bestows supreme metaphysical inquiry, fearless research, and occult regeneration.", afflicted: "INDRA (Uranus) in Scorpio brings sudden physical shocks, electrical hazards, and explosive hidden crises." },
      9: { harmonious: "INDRA (Uranus) in Sagittarius fosters visionary philosophy, progressive higher learning, and reform of orthodoxy.", afflicted: "INDRA (Uranus) in Sagittarius provokes extreme anti-traditional rebellion and sudden hazards on foreign journeys." },
      10: { harmonious: "INDRA (Uranus) in Capricorn transforms corporate and governmental frameworks through modern technological vision.", afflicted: "INDRA (Uranus) in Capricorn brings unexpected professional downfalls and sudden defiance against authority." },
      11: { harmonious: "Swakshetra INDRA (Uranus) in Aquarius provides humanitarian brilliance, noble allies, and rapid fulfillment of progressive goals.", afflicted: "INDRA (Uranus) in Aquarius causes sudden alienation from peer groups and unreliable associations." },
      12: { harmonious: "INDRA (Uranus) in Pisces releases deep karmic shackles through quiet research, occult insight, and subconscious liberation.", afflicted: "INDRA (Uranus) in Pisces indicates subconscious restlessness, nervous insomnia, and unexpected institutional confinement." },
    },
    house: {
      1: { harmonious: "Original, magnetic aura with intensely independent and inventive mental faculties.", afflicted: "Erratic nervous tension, abrupt behavior, and sudden estrangement from family." },
      2: { harmonious: "Innovative income streams through technology, rare disciplines, and unconventional assets.", afflicted: "High volatility in liquid wealth and dangerously blunt, impulsive speech." },
      3: { harmonious: "Lightning-fast intuition, scientific aptitude, and progressive neighborhood/peer exchanges.", afflicted: "Impulsive decisions, sudden delays in local transit, and sibling discord." },
      4: { harmonious: "A forward-looking, non-traditional domestic atmosphere offering intellectual freedom.", afflicted: "Domestic volatility, frequent unpredictable relocations, and property friction." },
      5: { harmonious: "Sparks of creative genius, unorthodox romantic connections, and self-directed progeny.", afflicted: "Sudden romantic ruptures and acute risks in speculative stock/gambling ventures." },
      6: { harmonious: "Novel service techniques, mastery over tech tools, and alternative healing methods.", afflicted: "Inexplicable nervous spasms, psychosomatic tension, and subordinate conflicts." },
      7: { harmonious: "A uniquely progressive, gifted, and freedom-loving life or business partner.", afflicted: "Sudden partnership breakups, impulsive contracts, and surprising litigation." },
      8: { harmonious: "Occult mastery, unearned windfall inheritance, and spontaneous kundalini awakening.", afflicted: "Electrical or nervous shocks, joint financial disputes, and sudden medical tests." },
      9: { harmonious: "Groundbreaking philosophical discoveries, legal reforms, and visionary pilgrimages.", afflicted: "Sharp clashes with dogmatic authorities and perilous foreign travel complications." },
      10: { harmonious: "Pioneering career in tech, aviation, astrology, or reform with distinctive recognition.", afflicted: "Sudden reversals of professional reputation and clashes with public superiors." },
      11: { harmonious: "Influential and visionary benefactors; sudden fulfillment of humanitarian aspirations.", afflicted: "Unstable friendships, erratic group projects, and abrupt severance from networks." },
      12: { harmonious: "Illuminating solitary study, metaphysical breakthrough, and selfless quiet service.", afflicted: "Subconscious panic attacks, hidden hostility, and unexpected hospital stays." },
    },
  },
  NEPTUNE: {
    rashi: {
      1: { harmonious: "VARUN (Neptune) in Aries acts as a spiritual pioneer, inspiring idealistic causes with refined courage.", afflicted: "VARUN (Neptune) in Aries succumbs to phantom crusades, self-deception, and loss of personal focus." },
      2: { harmonious: "VARUN (Neptune) in Taurus brings aesthetic sensitivity, artistic wealth channels, and refined material appreciation.", afflicted: "VARUN (Neptune) in Taurus risks economic illusions, deceptive contracts, and financial carelessness." },
      3: { harmonious: "VARUN (Neptune) in Gemini enriches poetic imagination, telepathic perception, and subtle expression.", afflicted: "VARUN (Neptune) in Gemini induces mental haze, scattered attention, and deceptive conversations." },
      4: { harmonious: "Exalted VARUN (Neptune) in Cancer deepens spiritual empathy, maternal devotion, and a sacred domestic sanctuary.", afflicted: "VARUN (Neptune) in Cancer brings emotional codependency, confusing family origins, and hidden domestic sadness." },
      5: { harmonious: "VARUN (Neptune) in Leo inspires sublime romantic devotion, cinematic creativity, and theatrical magic.", afflicted: "VARUN (Neptune) in Leo leads to romantic delusion, secret affairs, and speculative losses." },
      6: { harmonious: "VARUN (Neptune) in Virgo channels compassionate service, holistic wellness, and spiritual hygiene.", afflicted: "VARUN (Neptune) in Virgo manifests elusive allergic sensitivities, psychosomatic fatigue, and blurred boundaries." },
      7: { harmonious: "VARUN (Neptune) in Libra establishes soulmate resonance, transcendental harmony, and artistic marriage.", afflicted: "VARUN (Neptune) in Libra risks disillusionment in relationships, sacrifice without reciprocity, and legal obscurity." },
      8: { harmonious: "VARUN (Neptune) in Scorpio reveals mystical intuition, calm transition beyond the physical, and esoteric depth.", afflicted: "VARUN (Neptune) in Scorpio brings confusion over estates, psychic oversensitivity, and emotional escapism." },
      9: { harmonious: "VARUN (Neptune) in Sagittarius brings prophetic dreams, cosmic philosophical understanding, and universal love.", afflicted: "VARUN (Neptune) in Sagittarius creates vulnerability to spiritual charlatans and ungrounded journeys." },
      10: { harmonious: "VARUN (Neptune) in Capricorn spiritualizes vocation, radiating compassionate public image and artistic stature.", afflicted: "VARUN (Neptune) in Capricorn blurs career direction, inviting reputational vulnerability and scandal." },
      11: { harmonious: "VARUN (Neptune) in Aquarius brings humanitarian idealism, spiritual brotherhood, and visionary collective dreams.", afflicted: "VARUN (Neptune) in Aquarius brings deceptive acquaintances, loss through social groups, and impractical ideals." },
      12: { harmonious: "Swakshetra VARUN (Neptune) in Pisces grants supreme spiritual liberation, samadhi, and boundless empathy.", afflicted: "VARUN (Neptune) in Pisces drives escapism, addictive vulnerabilities, and hypersensitivity to medication." },
    },
    house: {
      1: { harmonious: "Ethereal, enigmatic aura radiating gentleness, refined artistry, and compassionate magnetism.", afflicted: "Clouded self-identity, vulnerability to external influences, and physical lassitude." },
      2: { harmonious: "Gains through cinema, liquids, photography, healing, and spiritual work.", afflicted: "Unclear financial bookkeeping, money slipping away, and commercial misrepresentation." },
      3: { harmonious: "Poetic communication, intuitive perception of nearby thoughts, and empathetic kin ties.", afflicted: "Mental fog, respiratory/mucus imbalances, and ungrounded day-to-day focus." },
      4: { harmonious: "Sacred sanctuary at home with peaceful meditational environment and deep maternal grace.", afflicted: "Dampness/water damage to property, family secrets, and chronic emotional insecurity." },
      5: { harmonious: "Sublime spiritual love, inspired creative output in arts/music, and intuitive children.", afflicted: "Chasing unattainable romantic ideals, disappointment in love, and speculative losses." },
      6: { harmonious: "Profound healing touch, selfless devotion to caregiving, and holistic lifestyle.", afflicted: "Hard-to-diagnose chronic conditions, sensitivities to pharmaceuticals, and deceptive subordinates." },
      7: { harmonious: "Spiritual, soul-level partnership bound by deep unconditional understanding.", afflicted: "Codependent relationship, sacrificing one's sanity for a partner, and ambiguous legal contracts." },
      8: { harmonious: "Subtle clairvoyance, peaceful transcendental states, and esoteric insight.", afflicted: "Estate disputes obscured by fraud, joint financial deception, and psychic vulnerability." },
      9: { harmonious: "Visionary dreams, cosmic higher education, and uplifting sacred pilgrimages.", afflicted: "Susceptibility to false gurus, ideological confusion, and wanderlust with no clear goal." },
      10: { harmonious: "Visionary vocation celebrated for artistic grace, compassion, or uplifting public impact.", afflicted: "Loss of professional direction, public misunderstanding, and susceptibility to scapegoating." },
      11: { harmonious: "Compassionate social network, sincere idealistic friends, and altruistic collective hopes.", afflicted: "Betrayal by predatory companions and disappointment in collective organizations." },
      12: { harmonious: "Profound meditational immersion, deep psychic shelter, and selfless humanitarian solace.", afflicted: "Haunting subconscious anxieties, isolation dread, and severe escapist tendencies." },
    },
  },
  PLUTO: {
    rashi: {
      1: { harmonious: "YAM (Pluto) in Aries grants relentless will, phoenix-like resurrection, and absolute autonomy.", afflicted: "YAM (Pluto) in Aries fuels tyrannical aggression, destructive fury, and catastrophic power struggles." },
      2: { harmonious: "YAM (Pluto) in Taurus restructures material foundations, commanding enduring financial sovereignty.", afflicted: "YAM (Pluto) in Taurus incites ruthless greed, compulsive wealth hoarding, and severe economic crises." },
      3: { harmonious: "YAM (Pluto) in Gemini gives a penetrating, forensic intellect capable of piercing through deception.", afflicted: "YAM (Pluto) in Gemini creates obsessive fixations, cutting verbal warfare, and severe peer hostility." },
      4: { harmonious: "YAM (Pluto) in Cancer rebuilds ancestral roots, providing formidable emotional resilience.", afflicted: "YAM (Pluto) in Cancer brings domestic tyranny, generational trauma, and bitter real estate friction." },
      5: { harmonious: "YAM (Pluto) in Leo fuels magnetic creative intensity and intensely devoted self-expression.", afflicted: "YAM (Pluto) in Leo produces domineering romantic control, speculative ruin, and ego battles with children." },
      6: { harmonious: "YAM (Pluto) in Virgo radically overhauls work systems with extraordinary biological regeneration.", afflicted: "YAM (Pluto) in Virgo generates toxic workplace politics, compulsive perfectionism, and deep physical strain." },
      7: { harmonious: "YAM (Pluto) in Libra fosters deeply transformative, karmic marriage and formidable allies.", afflicted: "YAM (Pluto) in Libra leads to bitter marital warfare, vindictive lawsuits, and coercive contracts." },
      8: { harmonious: "Swakshetra YAM (Pluto) in Scorpio commands supreme occult rebirth, alchemical mastery, and triumph over crises.", afflicted: "YAM (Pluto) in Scorpio brings vengeful obsessions, deep underworld risks, and catastrophic financial shocks." },
      9: { harmonious: "YAM (Pluto) in Sagittarius pursues ultimate philosophical truth with uncompromising mental courage.", afflicted: "YAM (Pluto) in Sagittarius invites fanatical dogma, intellectual arrogance, and legal peril abroad." },
      10: { harmonious: "YAM (Pluto) in Capricorn exerts colossal executive power, restructuring corporations and political regimes.", afflicted: "YAM (Pluto) in Capricorn manifests authoritarian abuses of power and dramatic public downfalls." },
      11: { harmonious: "YAM (Pluto) in Aquarius commands revolutionary societal transformations and powerful networks.", afflicted: "YAM (Pluto) in Aquarius sparks factional battles, alienation from collectives, and ideological purges." },
      12: { harmonious: "YAM (Pluto) in Pisces achieves profound psychic purification, liberating hidden unconscious reserves.", afflicted: "YAM (Pluto) in Pisces traps the psyche in self-destructive loops, paranoia, and deep-seated fears." },
    },
    house: {
      1: { harmonious: "Commanding, magnetic presence with unmatched endurance and phoenix-like resurrection.", afflicted: "Compulsive need to control others, intense inner crises, and threatening confrontations." },
      2: { harmonious: "Extraordinary ability to resurrect wealth from zero; mastery over institutional capital.", afflicted: "Destructive financial disputes, severe tax problems, and ruthless material obsessions." },
      3: { harmonious: "Penetrating investigative acumen; words carry hypnotic, unshakeable influence.", afflicted: "Poisonous disputes with siblings, paranoid thoughts, and dangerous travel encounters." },
      4: { harmonious: "Unshakeable core resilience; massive empowerment through home and land restructuring.", afflicted: "Oppressive domestic environment, control battles with parents, and property disputes." },
      5: { harmonious: "Profound romantic devotion, magnetic artistic power, and intensely protected children.", afflicted: "Toxic emotional possessiveness, manipulative relationships, and heavy speculative losses." },
      6: { harmonious: "Remarkable cellular recuperation, mastery over complicated tasks, and healing triumph.", afflicted: "Deep-seated somatic weariness, toxic workplace strife, and hidden health crises." },
      7: { harmonious: "Deeply bonded, transformative life partner; powerful business partnerships.", afflicted: "Control battles with spouse, bitter divorce/legal proceedings, and emotional subjugation." },
      8: { harmonious: "Supreme authority over hidden realms, massive joint investments, and total crisis recovery.", afflicted: "Destructive power games over legacies, reproductive disorders, and catastrophic emergencies." },
      9: { harmonious: "Transformative spiritual rebirth, mastery over ancient wisdom, and global ideological weight.", afflicted: "Dogmatic extremism, legal battles across jurisdictions, and bitter friction with mentors." },
      10: { harmonious: "Long-standing authoritative dominance; capacity to govern large institutions successfully.", afflicted: "Dictatorial tendencies, severe public scandal, and career devastation through power struggles." },
      11: { harmonious: "Commanding leadership in organizations; loyal, formidable friends who alter one's destiny.", afflicted: "Subversive conspiracies within groups and traumatic ruptures in associations." },
      12: { harmonious: "Total purging of deep subconscious blockages, spiritual renewal, and hidden strength.", afflicted: "Subconscious torment, ruthless hidden enemies, and profound self-sabotaging patterns." },
    },
  },
};

export interface OuterPlanetEvaluationResult {
  planet: OuterPlanetKey;
  name: string;
  hindiName: 'INDRA' | 'VARUN' | 'YAM';
  devanagariName: string;
  higherOctaveOf: string;
  tropicalLongitude: number;
  siderealLongitude: number;
  rashiIndex: number;
  rashiName: string;
  degreeInRashi: number;
  decanate: 1 | 2 | 3;
  hasSepharialVibrationBoost: boolean;
  nakshatraIndex: number;
  house: number;
  rashiHouse: number;
  bhavaHouse: number;
  nextHouseBufferActive: number | null;
  strengthScore: number;
  isAfflicted: boolean;
  motionState: MotionState;
  activeTransits: TransitAspectHit[];
  rashiPrediction: string;
  housePrediction: string;
  synthesis: string;
  chakra: string;
  powerColors: string[];
}

/**
 * 8. Comprehensive Evaluation Engine for INDRA, VARUN, and YAM
 */
export function evaluateOuterPlanet(
  planetKey: OuterPlanetKey,
  tropicalLon: number,
  ayanamsa: number,
  ascendantRashi: number,
  natalPlanets: Record<string, number>,
  sunLongitude: number,
  coordinateSystem: 'sidereal' | 'tropical' = 'sidereal',
  houseCusps?: number[],
  dailySpeedDeg?: number
): OuterPlanetEvaluationResult {
  const norm360 = (d: number) => ((d % 360) + 360) % 360;

  const siderealLon = norm360(tropicalLon - ayanamsa);
  const activeLon = coordinateSystem === 'sidereal' ? siderealLon : tropicalLon;

  const rashiIndex = Math.floor(activeLon / 30) + 1;
  const degreeInRashi = Number((activeLon % 30).toFixed(2));
  const decanate = (Math.floor(degreeInRashi / 10) + 1) as 1 | 2 | 3;
  const nakshatraIndex = Math.floor(activeLon / (360 / 27)) + 1;

  const config = OUTER_PLANETS_CONFIG[planetKey];

  // Check Sepharial Decanate Boost
  const hasSepharialVibrationBoost = config.decanateBoost.some(
    ([r, d]) => r === rashiIndex && d === decanate
  );

  // Whole-Sign Rashi House calculation (Natal D1 standard)
  const ascRashi0 =
    ascendantRashi >= 1 && ascendantRashi <= 12
      ? ascendantRashi - 1
      : ((ascendantRashi % 12) + 12) % 12;
  const planetRashi0 = Math.floor(norm360(activeLon) / 30); // 0 to 11
  const rashiHouse = ((planetRashi0 - ascRashi0 + 12) % 12) + 1; // 1 to 12

  // In Vedic Natal Chart (D1), planetary placement in the sign chart is by Rashi House (Whole Sign).
  // Bhava Chalit / unequal cusps are tracked separately if houseCusps are passed.
  let house = rashiHouse;
  let bhavaHouse = rashiHouse;
  let nextHouseBufferActive: number | null = null;

  if (houseCusps && houseCusps.length === 12 && houseCusps[0] !== houseCusps[1]) {
    const cuspRes = getHousePlacementWithBuffer(activeLon, houseCusps);
    if (cuspRes.currentHouse >= 1 && cuspRes.currentHouse <= 12) {
      bhavaHouse = cuspRes.currentHouse;
      nextHouseBufferActive = cuspRes.nextHouseBufferActive;
    }
  }

  // Motion state (Direct, Retrograde, Stationary)
  const motionState = evaluateMotionState(planetKey, activeLon, sunLongitude, dailySpeedDeg);

  // Scan Active Transits to Natal Points with Strict Orbs & Stationary Multiplier
  const activeTransits = scanTransitsToNatal(planetKey, activeLon, motionState, natalPlanets);

  // Aspect scoring
  let harmoniousAspectSum = 0;
  let stressfulAspectSum = 0;

  for (const hit of activeTransits) {
    if (hit.isHarmonious) {
      harmoniousAspectSum += hit.intensity === 'EXTREME_STATIONARY_PEAK' ? 1.0 : 0.5;
    } else {
      stressfulAspectSum += hit.intensity === 'EXTREME_STATIONARY_PEAK' ? 1.5 : 0.75;
    }
  }

  // Sign placement score
  let signWeight = 0.25;
  if (config.exaltationSigns.includes(rashiIndex)) signWeight = 1.0;
  else if (config.ownSigns.includes(rashiIndex)) signWeight = 0.75;
  else if (config.friendlySigns.includes(rashiIndex)) signWeight = 0.50;
  else if (config.debilitationSigns.includes(rashiIndex)) signWeight = 0.0;
  else if (config.enemySigns.includes(rashiIndex)) signWeight = 0.10;

  // Add Sepharial boost bonus to score (+0.25)
  const decanateBonus = hasSepharialVibrationBoost ? 0.25 : 0.0;

  const netAspectScore = harmoniousAspectSum - stressfulAspectSum;
  let totalScore =
    2.5 + (config.natureWeight - 0.5) + (signWeight - 0.5) + decanateBonus + netAspectScore;
  totalScore = Math.max(0.0, Math.min(5.0, Number(totalScore.toFixed(2))));

  const isAfflicted = stressfulAspectSum > harmoniousAspectSum || signWeight === 0.0;
  const stateKey = isAfflicted ? 'afflicted' : 'harmonious';

  const rashiPrediction = PREDICTION_DATABASE[planetKey].rashi[rashiIndex][stateKey];
  const housePrediction = PREDICTION_DATABASE[planetKey].house[house][stateKey];

  return {
    planet: planetKey,
    name: config.name,
    hindiName: config.hindiName,
    devanagariName: config.devanagariName,
    higherOctaveOf: config.higherOctaveOf,
    tropicalLongitude: Number(tropicalLon.toFixed(4)),
    siderealLongitude: Number(siderealLon.toFixed(4)),
    rashiIndex,
    rashiName: SIGN_NAMES[rashiIndex - 1],
    degreeInRashi,
    decanate,
    hasSepharialVibrationBoost,
    nakshatraIndex,
    house,
    rashiHouse,
    bhavaHouse,
    nextHouseBufferActive,
    strengthScore: totalScore,
    isAfflicted,
    motionState,
    activeTransits,
    rashiPrediction,
    housePrediction,
    synthesis: `${rashiPrediction} In the ${house}th House: ${housePrediction}`,
    chakra: config.chakra,
    powerColors: config.colors,
  };
}

function jdToDate(jd: number): Date {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e) + f;
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  const dayInt = Math.floor(day);
  const dayFrac = day - dayInt;
  const totalSec = Math.round(dayFrac * 86400);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return new Date(Date.UTC(year, month - 1, dayInt, hours, minutes, seconds));
}

/**
 * High-precision Analytical Ephemeris Evaluator for Natal Chart
 * Computes INDRA (Uranus), VARUN (Neptune), YAM (Pluto) directly from Julian Day.
 */
export function computeNatalOuterPlanets(
  jd: number,
  lagnaNum: number,
  natalPlanets: Record<string, number>,
  houseCusps?: number[]
): {
  evaluations: OuterPlanetEvaluationResult[];
  chartDataMap: Record<
    string,
    {
      house: number;
      degree: number;
      minutes: number;
      retrograde: boolean;
      sign: string;
      lon: number;
      hasSepharialVibrationBoost?: boolean;
    }
  >;
} {
  const dateObj = jdToDate(jd);
  const ayan = lahiri(jd);

  // Apparent longitudes at epoch jd
  const observed = (ephemeris as any).getAllPlanets(dateObj, 0, 0, 0).observed;

  // Apparent longitudes at jd - 0.5 and jd + 0.5 to compute exact daily motion speed
  const prevDate = jdToDate(jd - 0.5);
  const nextDate = jdToDate(jd + 0.5);
  const prevObs = (ephemeris as any).getAllPlanets(prevDate, 0, 0, 0).observed;
  const nextObs = (ephemeris as any).getAllPlanets(nextDate, 0, 0, 0).observed;

  const sunTrop = observed.sun?.apparentLongitudeDd ?? 0;

  const targets: Array<{ key: OuterPlanetKey; ephKey: 'uranus' | 'neptune' | 'pluto' }> = [
    { key: 'URANUS', ephKey: 'uranus' },
    { key: 'NEPTUNE', ephKey: 'neptune' },
    { key: 'PLUTO', ephKey: 'pluto' },
  ];

  const evaluations: OuterPlanetEvaluationResult[] = [];
  const chartDataMap: Record<string, any> = {};

  for (const { key, ephKey } of targets) {
    const tropLon = observed[ephKey]?.apparentLongitudeDd ?? 0;
    const prevLon = prevObs[ephKey]?.apparentLongitudeDd ?? tropLon;
    const nextLon = nextObs[ephKey]?.apparentLongitudeDd ?? tropLon;

    let dailySpeed = nextLon - prevLon;
    while (dailySpeed > 180) dailySpeed -= 360;
    while (dailySpeed < -180) dailySpeed += 360;

    const res = evaluateOuterPlanet(
      key,
      tropLon,
      ayan,
      lagnaNum,
      natalPlanets,
      sunTrop - ayan,
      'sidereal',
      houseCusps,
      dailySpeed
    );

    evaluations.push(res);

    const degTotal = res.degreeInRashi;
    const degInt = Math.floor(degTotal);
    const minInt = Math.round((degTotal - degInt) * 60);

    const planetObj = {
      house: res.house,
      rashiHouse: res.rashiHouse,
      bhavaHouse: res.bhavaHouse,
      signNum: res.rashiIndex - 1, // 0 to 11
      rashi: res.rashiIndex - 1,
      rashiIndex: res.rashiIndex,
      degree: degInt,
      minutes: minInt,
      retrograde: res.motionState === 'RETROGRADE',
      sign: res.rashiName,
      lon: res.siderealLongitude,
      hasSepharialVibrationBoost: res.hasSepharialVibrationBoost,
    };

    chartDataMap[res.hindiName] = planetObj;
    if (key === 'URANUS') {
      chartDataMap['Indra'] = planetObj;
      chartDataMap['Uranus'] = planetObj;
    } else if (key === 'NEPTUNE') {
      chartDataMap['Varun'] = planetObj;
      chartDataMap['Neptune'] = planetObj;
    } else if (key === 'PLUTO') {
      chartDataMap['Yam'] = planetObj;
      chartDataMap['Pluto'] = planetObj;
    }
  }

  return { evaluations, chartDataMap };
}
