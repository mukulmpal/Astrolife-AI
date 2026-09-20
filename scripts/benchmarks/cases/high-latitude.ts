import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 8: High-Latitude Birth
 * Birth in Tromsø, Norway (Latitude 69.6492° N), inside the Arctic Circle.
 * Timestamp: 2023-06-21 12:00 CEST (10:00 UT) | JD: 2460116.916667
 * Reference: NASA JPL DE441 (Horizons v1.2) + IAU Lahiri (24.178995°)
 */
export const highLatitudeCase: BenchmarkTestCase = {
  id: "TC-HIGH-LATITUDE-08",
  category: "high-latitude",
  description: "Arctic Circle birth (Tromsø, Norway at 69.65° N)",
  birthDate: "2023-06-21", // Summer Solstice (Midnight Sun)
  birthTime: "12:00",
  latitude: 69.6492,
  longitude: 18.9553,
  timezone: 2.0, // CEST (UTC+2)
  timezoneSource: "Europe/Oslo",
  expectedReferenceSource: "NASA JPL DE441 (Horizons API) + IAU 1980 Chitrapaksha Lahiri",
  ayanamsha: "Lahiri_Chitrapaksha",
  nodeMode: "Mean",
  houseSystem: "DegreeEqualBhava",
  expected: {
    sunLongitude: 65.623554,
    ascendant: 149.946634,
    rahuLongitude: 6.950380,
    ketuLongitude: 186.950380,
    houseCusps: [
      { house: 1, longitude: 149.946634 },
      { house: 10, longitude: 59.946634 },
    ],
  },
  tolerances: {
    planetaryLongitudeDeg: 0.01,
    ascendantLongitudeDeg: 0.05,
    houseCuspLongitudeDeg: 0.05,
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "Tests computeLagna for high latitudes where tan(phi) is large.",
    "Ensures Math.atan2 does not experience singularity or sign flip error in Arctic Circle.",
  ],
};
