import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 10: Combustion Boundary
 * Mars within the classical 17° combustion threshold from the Sun.
 * Timestamp: 2023-10-18 12:00 IST (06:30 UT) | JD: 2460235.770833
 * Reference: NASA JPL DE441 (Horizons v1.2) + IAU Lahiri (24.183560°)
 */
export const combustionBoundaryCase: BenchmarkTestCase = {
  id: "TC-COMBUSTION-BOUNDARY-10",
  category: "combustion-boundary",
  description: "Mars within classical 17.0° combustion threshold from Sun (separation ~9.52°)",
  birthDate: "2023-10-18",
  birthTime: "12:00",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 5.5,
  timezoneSource: "Asia/Kolkata",
  expectedReferenceSource: "NASA JPL DE441 (Horizons API) + IAU 1980 Chitrapaksha Lahiri",
  ayanamsha: "Lahiri_Chitrapaksha",
  nodeMode: "Mean",
  houseSystem: "DegreeEqualBhava",
  expected: {
    sunLongitude: 180.437924,
    planetLongitudes: {
      Mars: 189.954321,
    },
    rahuLongitude: 0.652041,
    ketuLongitude: 180.652041,
  },
  tolerances: {
    planetaryLongitudeDeg: 0.005,
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "Tests angular separation between Sun and Mars near combustion zone.",
    "Sun (180.438°) and Mars (189.954°) are separated by 9.516°, placing Mars inside the 17° combustion sphere.",
  ],
};
