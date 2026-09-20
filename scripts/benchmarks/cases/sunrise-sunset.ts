import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 6: Sunrise / Sunset Boundary
 * Birth occurring right at astronomical sunrise. At sunrise, the Sun's geocentric
 * longitude aligns with the Ascendant (Lagna degree).
 * Timestamp: 2024-03-20 06:24 IST (00:54 UT) | JD: 2460389.537500
 * Reference: NASA JPL DE441 (Horizons v1.2) + IAU Lahiri (24.189910°)
 */
export const sunriseSunsetCase: BenchmarkTestCase = {
  id: "TC-SUNRISE-SUNSET-06",
  category: "sunrise-sunset",
  description: "Birth at local astronomical sunrise (Sun conjunct Lagna)",
  birthDate: "2024-03-20", // Vernal Equinox
  birthTime: "06:24",
  latitude: 28.6139,
  longitude: 77.209,
  timezone: 5.5,
  timezoneSource: "Asia/Kolkata",
  expectedReferenceSource: "NASA JPL DE441 (Horizons API) + IAU 1980 Chitrapaksha Lahiri",
  ayanamsha: "Lahiri_Chitrapaksha",
  nodeMode: "Mean",
  houseSystem: "DegreeEqualBhava",
  expected: {
    sunLongitude: 335.718727,
    ascendant: 334.044568,
    rahuLongitude: 352.503173,
    ketuLongitude: 172.503173,
    tithi: "Ekadashi (11/30)",
  },
  tolerances: {
    planetaryLongitudeDeg: 0.01,
    ascendantLongitudeDeg: 0.05,
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "At true sunrise, Sun longitude and Ascendant longitude align closely.",
    "Tests astronomical sunrise and Vernal Equinox boundary.",
  ],
};
