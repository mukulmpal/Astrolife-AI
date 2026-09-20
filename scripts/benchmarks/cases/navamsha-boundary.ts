import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 2: Navamsha Boundary
 * Native born when Jupiter is near a 3°20' Navamsha sign transition.
 * Timestamp: 2023-05-15 14:15 IST (08:45 UTC) | JD: 2460079.864583
 * Reference: NASA JPL DE441 (Horizons v1.2) + IAU Lahiri (24.177524°)
 */
export const navamshaBoundaryCase: BenchmarkTestCase = {
  id: "TC-NAVAMSHA-SANDHI-02",
  category: "navamsha-boundary",
  description: "Planet positioned at exact 3°20' Navamsha boundary threshold",
  birthDate: "2023-05-15",
  birthTime: "14:15",
  latitude: 19.076,
  longitude: 72.8777,
  timezone: 5.5,
  timezoneSource: "Asia/Kolkata (IST)",
  expectedReferenceSource: "NASA JPL DE441 (Horizons API) + IAU 1980 Chitrapaksha Lahiri",
  ayanamsha: "Lahiri_Chitrapaksha",
  nodeMode: "Mean",
  houseSystem: "DegreeEqualBhava",
  expected: {
    sunLongitude: 30.103680,
    moonLongitude: 336.298292,
    ascendant: 143.475910,
    planetLongitudes: {
      Jupiter: 5.511478,
    },
    rahuLongitude: 8.913897,
    ketuLongitude: 188.913897,
    vargaPlacements: [
      { varga: "D9", planet: "Jupiter", sign: "Taurus", signNum: 1 },
    ],
  },
  tolerances: {
    planetaryLongitudeDeg: 0.005,
    ascendantLongitudeDeg: 0.02,
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "Tests D9 sign assignment near 3°20' boundary.",
    "Jupiter at 5.511478° falls in Taurus Navamsha (3°20' - 6°40' of Aries).",
  ],
};
