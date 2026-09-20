import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 7: Retrograde / Stationary Point
 * Saturn at stationary point (turning retrograde / direct).
 * Speed approaches ~0°/day; tests retrograde detection stability.
 * Timestamp: 2023-06-17 12:00 IST (06:30 UT) | JD: 2460112.770833
 * Reference: NASA JPL DE441 (Horizons v1.2) + IAU Lahiri (24.178837°)
 */
export const retrogradeStationaryCase: BenchmarkTestCase = {
  id: "TC-RETROGRADE-STATIONARY-07",
  category: "retrograde-stationary",
  description: "Saturn at stationary station turning retrograde",
  birthDate: "2023-06-17",
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
    planetLongitudes: {
      Saturn: 313.031716,
    },
    rahuLongitude: 7.170076,
    ketuLongitude: 187.170076,
  },
  tolerances: {
    planetaryLongitudeDeg: 0.005,
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "Tests numerical derivative / finite difference calculation in computeRetro(jd).",
    "Near zero speed, minor roundoff can erroneously flip retrograde boolean.",
  ],
};
