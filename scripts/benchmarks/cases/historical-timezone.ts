import type { BenchmarkTestCase } from "../schema";

/**
 * CASE 4: Historical Timezone / Indian War Time (1942–1945)
 * Between Sept 1, 1942 and Oct 15, 1945, India maintained Daylight Saving / War Time of UTC+06:30.
 * Timestamp: 1943-08-15 10:30 (UTC+6.5 -> 04:00 UT) | JD: 2430951.666667
 * Reference: NASA JPL DE441 (Horizons v1.2) + IAU Lahiri (23.062877°)
 */
export const historicalTimezoneCase: BenchmarkTestCase = {
  id: "TC-HISTORICAL-TZ-04",
  category: "historical-timezone",
  description: "Indian War Time (1943) — UTC+6:30 offset vs standard IST 5:30",
  birthDate: "1943-08-15",
  birthTime: "10:30",
  latitude: 22.5726,
  longitude: 88.3639,
  timezone: 6.5, // Indian War Time
  timezoneSource: "Historical Indian War Time (Gazette of India 1942)",
  expectedReferenceSource: "NASA JPL DE441 (Horizons API) + IAU 1980 Chitrapaksha Lahiri",
  ayanamsha: "Lahiri_Chitrapaksha",
  nodeMode: "Mean",
  houseSystem: "DegreeEqualBhava",
  expected: {
    sunLongitude: 118.401208,
    moonLongitude: 289.178684,
    ascendant: 176.314462,
    rahuLongitude: 112.476831,
    ketuLongitude: 292.476831,
  },
  tolerances: {
    planetaryLongitudeDeg: 0.01,
    ascendantLongitudeDeg: 0.05,
    nodeLongitudeDeg: 0.01,
  },
  notes: [
    "Tests system capability to accept and process non-standard historical UTC offsets.",
    "If default 5.5 is assumed instead of 6.5, Julian Day drifts by 1 hour (~15° Lagna error).",
  ],
};
