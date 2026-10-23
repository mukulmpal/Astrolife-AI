/**
 * ============================================================================
 * ASTROLIFE — BIRTH-TIME CONFIDENCE & SENSITIVITY POLICY
 * ============================================================================
 * Defines the user-declared birth time accuracy levels and the corresponding
 * sensitivity policy across all astrological chart divisions and timing engines.
 *
 * NOTE: Birth-time confidence is an astronomical sensitivity model, NOT an
 * assertion or guarantee of astrological prediction truth.
 * ============================================================================
 */

export enum BirthTimeConfidenceLevel {
  /** Documented by official birth certificate or recorded hospital log */
  EXACT = "EXACT",

  /** High confidence, but subject to standard clock variance (±5 minutes) */
  PLUS_MINUS_5_MIN = "PLUS_MINUS_5_MIN",

  /** Memory-based estimate from family or unverified watch (±15 minutes) */
  PLUS_MINUS_15_MIN = "PLUS_MINUS_15_MIN",

  /** Broad approximation (e.g. "morning", "around lunch", ±30 to 60 minutes) */
  APPROXIMATE = "APPROXIMATE",
}

export type AstrologicalSubsystem =
  | "D1_PLANETS"
  | "D1_ASCENDANT"
  | "D1_BHAVA_CUSPS"
  | "NAKSHATRA_MOON"
  | "DASHA_VIMSHOTTARI_BALANCE"
  | "D9_NAVAMSHA"
  | "D10_DASHAMSHA"
  | "D60_SHASTIAMSHA"
  | "KP_CUSPS"
  | "KP_SUB_LORDS"
  | "TRANSITS";

export type CalculationSensitivityStatus =
  | "STABLE"             // Not sensitive to this degree of time variance
  | "SENSITIVE"          // High probability of remaining stable, but boundary alert advised
  | "WARNING_REQUIRED"   // Substantial chance of sign/pada/cuspal shift; explicit warning displayed
  | "RESTRICTED";        // Calculation is too time-sensitive to be meaningful; gated or redacted

export interface SubsystemPolicy {
  subsystem: AstrologicalSubsystem;
  label: string;
  status: CalculationSensitivityStatus;
  userExplanation: string;
  technicalNote: string;
}

export interface BirthTimeSensitivityProfile {
  level: BirthTimeConfidenceLevel;
  declaredVarianceMinutes: number;
  policies: Record<AstrologicalSubsystem, SubsystemPolicy>;
}

/**
 * Canonical Sensitivity Policies across the 4 confidence levels.
 */
export const BIRTH_TIME_CONFIDENCE_POLICIES: Record<BirthTimeConfidenceLevel, BirthTimeSensitivityProfile> = {
  [BirthTimeConfidenceLevel.EXACT]: {
    level: BirthTimeConfidenceLevel.EXACT,
    declaredVarianceMinutes: 0,
    policies: {
      D1_PLANETS: {
        subsystem: "D1_PLANETS",
        label: "D1 Planetary Longitudes",
        status: "STABLE",
        userExplanation: "Planetary signs and degrees are fully stable for your exact time.",
        technicalNote: "Planets move at < 1.5° per day (Moon < 15°/day); 0-minute error preserves planetary positions.",
      },
      D1_ASCENDANT: {
        subsystem: "D1_ASCENDANT",
        label: "Ascendant (Lagna)",
        status: "STABLE",
        userExplanation: "Rising sign is verified for exact birth time.",
        technicalNote: "Lagna moves ~1° every 4 minutes. With 0 variance, lagna degree is consistent within ephemeris precision.",
      },
      D1_BHAVA_CUSPS: {
        subsystem: "D1_BHAVA_CUSPS",
        label: "House Cusps & Bhava Chalit",
        status: "STABLE",
        userExplanation: "House borders and planetary bhava positions are calculated with full confidence.",
        technicalNote: "Equal and quadrant house cusps are deterministically established.",
      },
      NAKSHATRA_MOON: {
        subsystem: "NAKSHATRA_MOON",
        label: "Moon Nakshatra & Pada",
        status: "STABLE",
        userExplanation: "Moon's birth star and pada are firmly established.",
        technicalNote: "Moon moves ~0.55° per hour; pada spans 3°20'.",
      },
      DASHA_VIMSHOTTARI_BALANCE: {
        subsystem: "DASHA_VIMSHOTTARI_BALANCE",
        label: "Vimshottari Dasha Balance",
        status: "STABLE",
        userExplanation: "Initial dasha balance and timing timeline are stable.",
        technicalNote: "Dasha dates will align with Moon's natal position.",
      },
      D9_NAVAMSHA: {
        subsystem: "D9_NAVAMSHA",
        label: "D9 Navamsha Chart",
        status: "STABLE",
        userExplanation: "Navamsha placements are stable for exact recorded birth time.",
        technicalNote: "Navamsha span is 3°20' (~13.3 minutes of Ascendant movement). Exact certificate time protects against lagna sandhi.",
      },
      D10_DASHAMSHA: {
        subsystem: "D10_DASHAMSHA",
        label: "D10 Dashamsha (Career)",
        status: "STABLE",
        userExplanation: "Dashamsha career divisions are reliable for exact birth time.",
        technicalNote: "Dashamsha lagna changes every ~12 minutes.",
      },
      D60_SHASTIAMSHA: {
        subsystem: "D60_SHASTIAMSHA",
        label: "D60 Shastiamsha",
        status: "SENSITIVE",
        userExplanation: "D60 shifts every 2 minutes. Even with a birth certificate, small clock drift can alter this chart.",
        technicalNote: "Shastiamsha spans 0°30' (30 arc-minutes), corresponding to ~2 minutes of time. Even exact hospital records may drift by 1–2 minutes.",
      },
      KP_CUSPS: {
        subsystem: "KP_CUSPS",
        label: "KP House Cusps",
        status: "STABLE",
        userExplanation: "KP house boundaries are stable.",
        technicalNote: "Placidus cuspal degrees firmly established.",
      },
      KP_SUB_LORDS: {
        subsystem: "KP_SUB_LORDS",
        label: "KP Sub-Lords",
        status: "SENSITIVE",
        userExplanation: "Most KP sub-lords are solid, but boundary cusps require verification.",
        technicalNote: "Sub-lords can span as little as 0°40' (approx 2.6 minutes of Ascendant time). Border cusps require sandhi checks.",
      },
      TRANSITS: {
        subsystem: "TRANSITS",
        label: "Current Transits",
        status: "STABLE",
        userExplanation: "Current transit overlays against your natal chart are stable.",
        technicalNote: "Transit planets are independent of birth time; natal house assignment is fixed.",
      },
    },
  },

  [BirthTimeConfidenceLevel.PLUS_MINUS_5_MIN]: {
    level: BirthTimeConfidenceLevel.PLUS_MINUS_5_MIN,
    declaredVarianceMinutes: 5,
    policies: {
      D1_PLANETS: {
        subsystem: "D1_PLANETS",
        label: "D1 Planetary Longitudes",
        status: "STABLE",
        userExplanation: "Planets move slowly; a 5-minute variance has virtually zero effect on planetary signs.",
        technicalNote: "Moon moves ~0.046° in 5 minutes; other planets move < 0.005°.",
      },
      D1_ASCENDANT: {
        subsystem: "D1_ASCENDANT",
        label: "Ascendant (Lagna)",
        status: "SENSITIVE",
        userExplanation: "Ascendant degree may shift by approximately 1.25°. If near a sign border, rising sign could flip.",
        technicalNote: "Lagna moves ~1.25° in 5 minutes. If within 1.5° of 0° or 30°, sign sandhi warning is required.",
      },
      D1_BHAVA_CUSPS: {
        subsystem: "D1_BHAVA_CUSPS",
        label: "House Cusps & Bhava Chalit",
        status: "SENSITIVE",
        userExplanation: "Planets sitting very close to house boundaries might change houses in Bhava Chalit.",
        technicalNote: "Cusps shift by ~1.25°.",
      },
      NAKSHATRA_MOON: {
        subsystem: "NAKSHATRA_MOON",
        label: "Moon Nakshatra & Pada",
        status: "STABLE",
        userExplanation: "Moon's nakshatra remains reliable unless within 3 arc-minutes of a border.",
        technicalNote: "Pada boundary sensitivity is low unless Moon is within ±0.05° of border.",
      },
      DASHA_VIMSHOTTARI_BALANCE: {
        subsystem: "DASHA_VIMSHOTTARI_BALANCE",
        label: "Vimshottari Dasha Balance",
        status: "SENSITIVE",
        userExplanation: "Dasha periods may shift by several weeks or months on the overall timeline.",
        technicalNote: "0.046° Moon shift corresponds to ~15 to 45 days shift in Vimshottari Mahadasha transition dates.",
      },
      D9_NAVAMSHA: {
        subsystem: "D9_NAVAMSHA",
        label: "D9 Navamsha Chart",
        status: "SENSITIVE",
        userExplanation: "Navamsha Ascendant may be sensitive if born near a Navamsha boundary.",
        technicalNote: "Navamsha changes every ~13.3 minutes; 5-minute variance creates a ~37% probability of boundary proximity.",
      },
      D10_DASHAMSHA: {
        subsystem: "D10_DASHAMSHA",
        label: "D10 Dashamsha (Career)",
        status: "WARNING_REQUIRED",
        userExplanation: "Dashamsha Ascendant changes every 12 minutes; 5-minute variance warrants caution.",
        technicalNote: "Dashamsha span is 3°00' (~12 minutes).",
      },
      D60_SHASTIAMSHA: {
        subsystem: "D60_SHASTIAMSHA",
        label: "D60 Shastiamsha",
        status: "RESTRICTED",
        userExplanation: "D60 changes every 2 minutes. A 5-minute uncertainty makes D60 Ascendant unreliable.",
        technicalNote: "Shastiamsha period (2 minutes) is smaller than variance (5 minutes).",
      },
      KP_CUSPS: {
        subsystem: "KP_CUSPS",
        label: "KP House Cusps",
        status: "SENSITIVE",
        userExplanation: "KP cusps shift by ~1.25°.",
        technicalNote: "Significator house ownership should be cross-checked.",
      },
      KP_SUB_LORDS: {
        subsystem: "KP_SUB_LORDS",
        label: "KP Sub-Lords",
        status: "WARNING_REQUIRED",
        userExplanation: "Several cuspal sub-lords may have shifted across this 5-minute window.",
        technicalNote: "Sub-lord arc is frequently less than 1.25°.",
      },
      TRANSITS: {
        subsystem: "TRANSITS",
        label: "Current Transits",
        status: "STABLE",
        userExplanation: "Transits from Moon are completely stable; transits from Lagna are mostly stable.",
        technicalNote: "Moon sign is resilient; Lagna house is generally stable unless border case.",
      },
    },
  },

  [BirthTimeConfidenceLevel.PLUS_MINUS_15_MIN]: {
    level: BirthTimeConfidenceLevel.PLUS_MINUS_15_MIN,
    declaredVarianceMinutes: 15,
    policies: {
      D1_PLANETS: {
        subsystem: "D1_PLANETS",
        label: "D1 Planetary Longitudes",
        status: "STABLE",
        userExplanation: "Planetary signs remain unaffected.",
        technicalNote: "Sun, Mars, Mercury, Venus, Jupiter, Saturn change longitudes negligibly in 15 minutes.",
      },
      D1_ASCENDANT: {
        subsystem: "D1_ASCENDANT",
        label: "Ascendant (Lagna)",
        status: "WARNING_REQUIRED",
        userExplanation: "Ascendant degree shifts by ~3.75°. There is a high chance of a rising sign transition if born near a border.",
        technicalNote: "Lagna moves ~3.75° in 15 minutes.",
      },
      D1_BHAVA_CUSPS: {
        subsystem: "D1_BHAVA_CUSPS",
        label: "House Cusps & Bhava Chalit",
        status: "WARNING_REQUIRED",
        userExplanation: "Several planets may move between adjacent houses in Bhava Chalit.",
        technicalNote: "Cuspal drift of ~3.75° alters bhava placements.",
      },
      NAKSHATRA_MOON: {
        subsystem: "NAKSHATRA_MOON",
        label: "Moon Nakshatra & Pada",
        status: "SENSITIVE",
        userExplanation: "Moon's pada may change, but the main nakshatra is usually preserved unless near border.",
        technicalNote: "Moon moves ~0.14° in 15 minutes.",
      },
      DASHA_VIMSHOTTARI_BALANCE: {
        subsystem: "DASHA_VIMSHOTTARI_BALANCE",
        label: "Vimshottari Dasha Balance",
        status: "WARNING_REQUIRED",
        userExplanation: "Dasha timing transitions can shift by several months to a year.",
        technicalNote: "0.14° Moon variance causes notable dasha balance deviation.",
      },
      D9_NAVAMSHA: {
        subsystem: "D9_NAVAMSHA",
        label: "D9 Navamsha Chart",
        status: "WARNING_REQUIRED",
        userExplanation: "Navamsha Ascendant is likely to have shifted into a neighboring sign.",
        technicalNote: "Navamsha changes every ~13.3 minutes; 15-minute variance exceeds one entire Navamsha span.",
      },
      D10_DASHAMSHA: {
        subsystem: "D10_DASHAMSHA",
        label: "D10 Dashamsha (Career)",
        status: "RESTRICTED",
        userExplanation: "D10 Ascendant is unreliable with a 15-minute time uncertainty.",
        technicalNote: "Variance exceeds entire 12-minute Dashamsha duration.",
      },
      D60_SHASTIAMSHA: {
        subsystem: "D60_SHASTIAMSHA",
        label: "D60 Shastiamsha",
        status: "RESTRICTED",
        userExplanation: "D60 is completely disabled for this confidence level.",
        technicalNote: "15 minutes spans 7.5 distinct Shastiamshas.",
      },
      KP_CUSPS: {
        subsystem: "KP_CUSPS",
        label: "KP House Cusps",
        status: "WARNING_REQUIRED",
        userExplanation: "KP cusps are unstable and must be treated as tentative.",
        technicalNote: "3.75° drift invalidates tight event-timing cusps.",
      },
      KP_SUB_LORDS: {
        subsystem: "KP_SUB_LORDS",
        label: "KP Sub-Lords",
        status: "RESTRICTED",
        userExplanation: "KP Sub-Lords are restricted because sub-lord spans are smaller than 15-minute drift.",
        technicalNote: "Sub-lord calculations require exactitude impossible under ±15m.",
      },
      TRANSITS: {
        subsystem: "TRANSITS",
        label: "Current Transits",
        status: "SENSITIVE",
        userExplanation: "Use Moon-based transits (Chandra Kundli). Ascendant-based transits carry uncertainty.",
        technicalNote: "Moon sign remains reliable; Ascendant house transit carries warning.",
      },
    },
  },

  [BirthTimeConfidenceLevel.APPROXIMATE]: {
    level: BirthTimeConfidenceLevel.APPROXIMATE,
    declaredVarianceMinutes: 45,
    policies: {
      D1_PLANETS: {
        subsystem: "D1_PLANETS",
        label: "D1 Planetary Longitudes",
        status: "STABLE",
        userExplanation: "Planetary signs (Sun, Mars, Jupiter, Saturn, etc.) remain solid.",
        technicalNote: "Except for the Moon, planet signs are unchanged over a 1-hour window.",
      },
      D1_ASCENDANT: {
        subsystem: "D1_ASCENDANT",
        label: "Ascendant (Lagna)",
        status: "RESTRICTED",
        userExplanation: "Ascendant is restricted. Focus should be on Moon-sign (Chandra Kundli) analysis.",
        technicalNote: "Lagna moves ~11°–15° across this window, likely changing signs entirely.",
      },
      D1_BHAVA_CUSPS: {
        subsystem: "D1_BHAVA_CUSPS",
        label: "House Cusps & Bhava Chalit",
        status: "RESTRICTED",
        userExplanation: "House houses and cusps are disabled because the rising sign is unknown.",
        technicalNote: "House framework disabled; whole-sign Moon chart recommended.",
      },
      NAKSHATRA_MOON: {
        subsystem: "NAKSHATRA_MOON",
        label: "Moon Nakshatra & Pada",
        status: "WARNING_REQUIRED",
        userExplanation: "Moon's nakshatra is generally known, but pada and border positions require confirmation.",
        technicalNote: "Moon moves ~0.4°–0.5° across 45–60 minutes.",
      },
      DASHA_VIMSHOTTARI_BALANCE: {
        subsystem: "DASHA_VIMSHOTTARI_BALANCE",
        label: "Vimshottari Dasha Balance",
        status: "RESTRICTED",
        userExplanation: "Exact dasha start dates cannot be guaranteed; only major lifetime Mahadashas are indicated broadly.",
        technicalNote: "Dasha timing balance drift can exceed 1–3 years.",
      },
      D9_NAVAMSHA: {
        subsystem: "D9_NAVAMSHA",
        label: "D9 Navamsha Chart",
        status: "RESTRICTED",
        userExplanation: "Navamsha is restricted because its Ascendant changes every 13 minutes.",
        technicalNote: "Multiple Navamsha signs crossed.",
      },
      D10_DASHAMSHA: {
        subsystem: "D10_DASHAMSHA",
        label: "D10 Dashamsha (Career)",
        status: "RESTRICTED",
        userExplanation: "D10 is restricted.",
        technicalNote: "Multiple Dashamsha cycles crossed.",
      },
      D60_SHASTIAMSHA: {
        subsystem: "D60_SHASTIAMSHA",
        label: "D60 Shastiamsha",
        status: "RESTRICTED",
        userExplanation: "D60 is restricted.",
        technicalNote: "Shastiamsha requires sub-2-minute accuracy.",
      },
      KP_CUSPS: {
        subsystem: "KP_CUSPS",
        label: "KP House Cusps",
        status: "RESTRICTED",
        userExplanation: "KP system is restricted for approximate birth times.",
        technicalNote: "KP requires precise cuspal calculations.",
      },
      KP_SUB_LORDS: {
        subsystem: "KP_SUB_LORDS",
        label: "KP Sub-Lords",
        status: "RESTRICTED",
        userExplanation: "KP Sub-Lords are restricted.",
        technicalNote: "Sub-lord calculations require verified birth time.",
      },
      TRANSITS: {
        subsystem: "TRANSITS",
        label: "Current Transits",
        status: "WARNING_REQUIRED",
        userExplanation: "Only broader Moon-sign planetary transits are enabled.",
        technicalNote: "Ascendant transits disabled; Moon sign transits active with boundary advisory.",
      },
    },
  },
};

/**
 * Evaluates whether a specific calculation is permissible and safe to display
 * under the user's declared birth-time confidence level.
 */
export function evaluateSubsystemAccess(
  level: BirthTimeConfidenceLevel,
  subsystem: AstrologicalSubsystem
): SubsystemPolicy {
  const profile = BIRTH_TIME_CONFIDENCE_POLICIES[level] ?? BIRTH_TIME_CONFIDENCE_POLICIES[BirthTimeConfidenceLevel.APPROXIMATE];
  return profile.policies[subsystem];
}

