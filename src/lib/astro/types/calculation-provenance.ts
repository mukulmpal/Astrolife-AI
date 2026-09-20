/**
 * ============================================================================
 * ASTROLIFE — CALCULATION PROVENANCE CONTRACT
 * ============================================================================
 * Provides an auditable, transparent record of how every astrological
 * and astronomical data point was computed.
 *
 * Permanent Engineering Constitution:
 * "Calculate precisely. Apply classical rules faithfully.
 *  Resolve conflicting signals intelligently. Explain transparently.
 *  Never manufacture certainty."
 * ============================================================================
 */

export type AyanamshaType =
  | "Lahiri_Chitrapaksha"
  | "KP_Krishnamurti"
  | "KP_New"
  | "Raman"
  | "Fagan_Bradley"
  | "Sayana_Tropical"
  | "Yukteshwar"
  | "True_Chitra";

export type LunarNodeMode =
  | "Mean"
  | "True_Osculating"
  | "Interpolated";

export type HouseSystemType =
  | "DegreeEqualBhava"
  | "WholeSign"
  | "Sripati"
  | "Placidus"
  | "Koch"
  | "Regiomontanus"
  | "Porphyry"
  | "EqualAscendant";

export type CoordinateSource =
  | "USER_EXPLICIT"
  | "GEONAMES_DATABASE"
  | "STATIC_CITY_MAP"
  | "BROWSER_GEOLOCATION"
  | "MANUAL_OVERRIDE";

export type TimezoneSource =
  | "STATIC_TABLE"
  | "IANA_DATABASE"
  | "USER_DECLARED"
  | "API_LOOKUP";

export type EphemerisPrecisionLevel =
  | "ANALYTICAL_APPROXIMATION"   // e.g. Moshier pure JS, arc-second to arc-minute limits
  | "NUMERICAL_INTEGRATION"       // e.g. Swiss Ephemeris / DE431 sub-arcsecond
  | "MEAN_POLYNOMIAL"            // e.g. Mean Lunar Node series
  | "SIMPLIFIED_ALGORITHM";       // e.g. Rough sunrise approximation

export interface CalculationProvenance {
  /** The high-level calculation engine name (e.g. "AstroLife-Universal-Engine") */
  engineName: string;

  /** Semantic version of the engine (e.g. "3.0.0") */
  engineVersion: string;

  /** The astronomical ephemeris provider (e.g. "Moshier JS (ephemeris npm)", "Swiss Ephemeris WASM") */
  ephemerisName: string;

  /** Version of the ephemeris library or data file (e.g. "2.2.0") */
  ephemerisVersion: string;

  /** Claimed & verified precision level of the underlying calculations */
  precisionLevel: EphemerisPrecisionLevel;

  /** Ayanamsha algorithm applied to sidereal positions */
  ayanamsha: AyanamshaType;

  /** Lunar node algorithm applied for Rahu and Ketu */
  nodeMode: LunarNodeMode;

  /** House cusp system applied to the chart */
  houseSystem: HouseSystemType;

  /** Resolved geographical latitude in decimal degrees (-90 to +90) */
  latitude: number;

  /** Resolved geographical longitude in decimal degrees (-180 to +180) */
  longitude: number;

  /** Timezone identifier (e.g. "Asia/Kolkata", "America/New_York", or numeric offset "UTC+05:30") */
  timezone: string;

  /** IANA Timezone Database version (e.g. "2024a", "tzdata-2023c", or "STATIC_LOOKUP_v1") */
  timezoneDatabaseVersion: string;

  /** ISO 8601 UTC timestamp when the computation was performed */
  calculationTimestamp: string;

  /** Normalized ISO 8601 UTC timestamp of the native's birth */
  birthTimestamp: string;

  /** Provenance source of geographic coordinates */
  coordinateSource: CoordinateSource;

  /** Provenance source of timezone offset and DST rules */
  timezoneSource: TimezoneSource;

  /** Optional metadata extensions */
  metadata?: {
    appBuildVersion?: string;
    locale?: string;
    historicalDstApplied?: boolean;
    systemConfiguration?: Record<string, unknown>;
    warnings?: string[];
  };
}

/**
 * Validates whether a given object strictly conforms to the CalculationProvenance contract.
 */
export function validateCalculationProvenance(provenance: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!provenance || typeof provenance !== "object") {
    return { valid: false, errors: ["Provenance must be a non-null object."] };
  }

  const p = provenance as Record<string, unknown>;

  const requiredStrings = [
    "engineName",
    "engineVersion",
    "ephemerisName",
    "ephemerisVersion",
    "ayanamsha",
    "nodeMode",
    "houseSystem",
    "timezone",
    "timezoneDatabaseVersion",
    "calculationTimestamp",
    "birthTimestamp",
    "coordinateSource",
    "timezoneSource",
    "precisionLevel",
  ];

  for (const field of requiredStrings) {
    if (typeof p[field] !== "string" || (p[field] as string).trim().length === 0) {
      errors.push(`Field '${field}' is required and must be a non-empty string.`);
    }
  }

  if (typeof p.latitude !== "number" || !Number.isFinite(p.latitude) || p.latitude < -90 || p.latitude > 90) {
    errors.push("Field 'latitude' must be a finite number between -90 and 90.");
  }

  if (typeof p.longitude !== "number" || !Number.isFinite(p.longitude) || p.longitude < -180 || p.longitude > 180) {
    errors.push("Field 'longitude' must be a finite number between -180 and 180.");
  }

  // Validate ISO timestamps
  if (typeof p.calculationTimestamp === "string" && isNaN(Date.parse(p.calculationTimestamp))) {
    errors.push("Field 'calculationTimestamp' must be a valid ISO 8601 timestamp.");
  }

  if (typeof p.birthTimestamp === "string" && isNaN(Date.parse(p.birthTimestamp))) {
    errors.push("Field 'birthTimestamp' must be a valid ISO 8601 timestamp.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

