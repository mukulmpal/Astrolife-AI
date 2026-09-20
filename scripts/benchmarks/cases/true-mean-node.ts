import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 9: True Node vs. Mean Node Divergence
 * Period where True (Osculating) Lunar Node deviates significantly (~1°30' to 1°45')
 * from the Mean Node.
 * Timestamp: 2024-01-11 11:57 IST (06:27 UT) | JD: 2460320.768750
 * Reference: NASA JPL DE441 + IAU Simon et al. Mean Node + IAU Lahiri (24.187140°)
 */
export const trueMeanNodeCase: BenchmarkTestCase = {
  id: "TC-NODE-DIVERGENCE-09",
  category: "true-mean-node",
  description: "Maximum divergence between True Node and Mean Node",
  birthDate: "2024-01-11", // New Moon near lunar perigee
  birthTime: "11:57",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 5.5,
  timezoneSource: "Asia/Kolkata",
  expectedReferenceSource: "NASA JPL DE441 + IAU Simon Mean Node + IAU 1980 Chitrapaksha Lahiri",
  ayanamsha: "Lahiri_Chitrapaksha",
  nodeMode: "Mean", // AstroLife currently calculates Mean Node
  houseSystem: "DegreeEqualBhava",
  expected: {
    rahuLongitude: 356.147533,
    ketuLongitude: 176.147533,
  },
  tolerances: {
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "Documents current mean node baseline vs external True Node reference.",
    "On this date, True (osculating) Node sits at ~354.70°, showing a 1.44° divergence from Mean Node.",
  ],
};
