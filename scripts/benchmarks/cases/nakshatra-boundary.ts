import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 1: Nakshatra Sandhi / Boundary
 * Native born when the Moon is right at the junction between Revati (Pisces) and Ashwini (Aries).
 * Timestamp: 2024-04-09 07:32 IST (02:02 UTC) | JD: 2460409.584722
 * Reference: NASA JPL DE441 (Horizons v1.2) Apparent Geocentric Ecliptic + IAU Lahiri (24.190718°)
 */
export const nakshatraBoundaryCase: BenchmarkTestCase = {
  id: "TC-NAKSHATRA-SANDHI-01",
  category: "nakshatra-boundary",
  description: "Moon at Revati-Ashwini junction (critical Nakshatra Sandhi & Gandanta boundary)",
  birthDate: "2024-04-09",
  birthTime: "07:32",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 5.5,
  timezoneSource: "Asia/Kolkata (IST)",
  expectedReferenceSource: "NASA JPL DE441 (Horizons API) + IAU 1980 Chitrapaksha Lahiri",
  ayanamsha: "Lahiri_Chitrapaksha",
  nodeMode: "Mean",
  houseSystem: "DegreeEqualBhava",
  expected: {
    sunLongitude: 355.524468,
    moonLongitude: 0.002840,
    ascendant: 23.453107,
    rahuLongitude: 351.440789,
    ketuLongitude: 171.440789,
    nakshatra: "Ashwini",
    nakshatraPada: 1,
  },
  tolerances: {
    planetaryLongitudeDeg: 0.005, // ~18 arc-seconds
    ascendantLongitudeDeg: 0.02,
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "Tests dasha lord transition at 0° Aries sidereal boundary.",
    "Crucial for Gandanta boundary detection.",
    "DE441 has Moon at 0.002840° (Ashwini p1, Ketu MD), while Moshier has Moon at 359.992750° (Revati p4, Mercury MD).",
  ],
};
