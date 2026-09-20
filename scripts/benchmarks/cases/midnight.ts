import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 5: Midnight Date Boundary
 * Birth occurring at 00:00:00 (midnight). Tests Julian Day continuity,
 * date transition, and weekday assignment.
 * Timestamp: 2020-01-01 00:00 IST (2019-12-31 18:30 UT) | JD: 2458849.270833
 * Reference: NASA JPL DE441 (Horizons v1.2) + IAU Lahiri (24.128078°)
 */
export const midnightCase: BenchmarkTestCase = {
  id: "TC-MIDNIGHT-BOUNDARY-05",
  category: "midnight-boundary",
  description: "Birth at exactly 00:00 (midnight) date change boundary",
  birthDate: "2020-01-01",
  birthTime: "00:00",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 5.5,
  timezoneSource: "Asia/Kolkata",
  expectedReferenceSource: "NASA JPL DE441 (Horizons API) + IAU 1980 Chitrapaksha Lahiri",
  ayanamsha: "Lahiri_Chitrapaksha",
  nodeMode: "Mean",
  houseSystem: "DegreeEqualBhava",
  expected: {
    sunLongitude: 255.647788,
    moonLongitude: 319.278446,
    ascendant: 159.926493,
    rahuLongitude: 74.127885,
    ketuLongitude: 254.127885,
    tithi: "Shashthi (6/30)",
    yoga: "Vyatipata",
    karana: "Garija",
  },
  tolerances: {
    planetaryLongitudeDeg: 0.005,
    ascendantLongitudeDeg: 0.02,
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "Tests that 00:00:00 is not misparsed as 24:00 or previous calendar day.",
    "Verifies Julian Day fractional hour calculation (utH = 0 - 5.5 = -5.5 hours UTC).",
  ],
};
