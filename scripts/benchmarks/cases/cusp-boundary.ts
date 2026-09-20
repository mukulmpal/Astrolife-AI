import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 3: Cusp / Bhava Boundary
 * Native born when the Ascendant is in Virgo near rising sign transition.
 * Timestamp: 2022-09-22 06:12 IST (00:42 UTC) | JD: 2459844.529167
 * Reference: NASA JPL DE441 (Horizons v1.2) + IAU Lahiri (24.167641°)
 */
export const cuspBoundaryCase: BenchmarkTestCase = {
  id: "TC-CUSP-BOUNDARY-03",
  category: "cusp-boundary",
  description: "Ascendant and house cusp boundaries in Virgo",
  birthDate: "2022-09-22",
  birthTime: "06:12",
  latitude: 13.0827,
  longitude: 80.2707,
  timezone: 5.5,
  timezoneSource: "Asia/Kolkata (IST)",
  expectedReferenceSource: "NASA JPL DE441 (Horizons API) + IAU 1980 Chitrapaksha Lahiri",
  ayanamsha: "Lahiri_Chitrapaksha",
  nodeMode: "Mean",
  houseSystem: "DegreeEqualBhava",
  expected: {
    sunLongitude: 154.839165,
    ascendant: 157.453618,
    rahuLongitude: 21.385670,
    ketuLongitude: 201.385670,
    houseCusps: [
      { house: 1, longitude: 157.453618 },
      { house: 10, longitude: 67.453618 },
    ],
  },
  tolerances: {
    planetaryLongitudeDeg: 0.005,
    ascendantLongitudeDeg: 0.01,
    houseCuspLongitudeDeg: 0.02,
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "Tests rising sign determination and degree-equal house cusps.",
  ],
};
