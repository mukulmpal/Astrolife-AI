import { test } from "node:test";
import assert from "node:assert/strict";
import {
  findExactAspectTime,
  findPeakOrbTime,
  findThresholdCrossing,
  normalizeSignedAngle,
} from "../forecast/numerical-refinement";
import {
  segmentPassesByDirection,
  buildRetrogradePassInfo,
} from "../forecast/retrograde-loop";
import { scanDashaEvents } from "../forecast/dasha-scanner";
import { scanPlanetaryEvents } from "../forecast/event-scanner";
import { buildRadarHorizons } from "../forecast/radar-coordinator";
import { computeEphemerisVelocity, dateToJulianDay } from "../ephemeris-precision";
import type { ChartData } from "../../calculations";
import type { PanchangResult } from "../../panchang";

const mockChart: ChartData = {
  name: "Forecast Test Chart",
  dob: "1990-01-01",
  tob: "12:00",
  city: "New Delhi",
  lat: 28.61,
  lon: 77.20,
  tz: 5.5,
  jd: 2447893.0,
  lagnaLon: 30.0,
  lagnaRashi: "Taurus",
  lagnaNum: 1,
  planets: {
    Sun: { lon: 15.0, longitude: 15.0, house: 1, sign: "Aries", signNum: 0 } as any,
    Moon: { lon: 345.0, longitude: 345.0, house: 11, sign: "Pisces", signNum: 11, nakshatra: "Uttara Bhadrapada" } as any,
    Mars: { lon: 60.0, longitude: 60.0, house: 2, sign: "Taurus", signNum: 1 } as any,
    Saturn: { lon: 345.0, longitude: 345.0, house: 11, sign: "Pisces", signNum: 11 } as any,
    Jupiter: { lon: 15.0, longitude: 15.0, house: 1, sign: "Aries", signNum: 0 } as any,
  },
  dashas: [
    { planet: "Rahu", start: new Date("2010-01-01"), end: new Date("2026-10-15"), yrs: 18 },
    { planet: "Jupiter", start: new Date("2026-10-15"), end: new Date("2042-10-15"), yrs: 16 },
  ],
  antardasha: [
    { planet: "Saturn", start: new Date("2024-01-01"), end: new Date("2026-10-05"), yrs: 2.7 },
    { planet: "Mercury", start: new Date("2026-10-05"), end: new Date("2028-01-01"), yrs: 2.5 },
  ],
  houseCusps: [],
  houseSystem: "degree-equal-bhava",
};

const mockPanchang = {
  tithi: "Shukla Pratipada",
  tithiNumber: 1,
  nakshatra: "Pushya",
  nakshatraPada: 1,
  nakshatraLord: "Saturn",
  yoga: "Siddhi",
  karana: "Bava",
  paksha: "Shukla",
  moonSign: "Cancer",
  sunSign: "Leo",
  sunrise: "06:00 AM",
  sunset: "06:00 PM",
  sunriseAssumed: "06:00 AM",
  rahuKaal: { name: "Rahu Kaal", start: "04:30 PM", end: "06:00 PM", quality: "Caution" as any, guidance: "Avoid" },
  gulikaKaal: {} as any,
  yamaganda: {} as any,
  abhijitMuhurta: { name: "Abhijit Muhurta", start: "11:48 AM", end: "12:36 PM", quality: "Auspicious" as any, guidance: "Action" },
  chaughadiaDay: [],
  chaughadiaNight: [],
  currentChaughadia: null,
  muhurtaYogas: [],
  currentHora: "Sun",
  currentHoraLord: "Sun",
  nextHoraLord: "Venus",
  shubhKarya: [],
  avoidKarya: [],
  aiContext: "",
  notes: [],
} as unknown as PanchangResult;

// 1. Exact Future Conjunction
test("Cosmic Forecast — 1. Exact Future Conjunction Root-Finding", () => {
  // Synthetic angular function crossing zero at jd = 2460000.5
  const getAngleError = (jd: number) => (jd - 2460000.5) * 1.0;
  const exactJd = findExactAspectTime(2460000.0, 2460001.0, getAngleError);

  assert.ok(exactJd !== null);
  assert.ok(Math.abs(exactJd - 2460000.5) < 1e-4, "Root-finder must locate exact aspect to < 1e-4 days");
});

// 2. Exact Future Opposition
test("Cosmic Forecast — 2. Exact Future Opposition Geometry", () => {
  // Sun moving from 178° to 182° relative to Saturn
  const getOppositionError = (jd: number) => normalizeSignedAngle((jd - 2460100.25) * 0.985);
  const exactJd = findExactAspectTime(2460100.0, 2460101.0, getOppositionError);

  assert.ok(exactJd !== null);
  assert.ok(Math.abs(exactJd - 2460100.25) < 1e-4);
});

// 3. Applying → Exact → Separating Lifecycle
test("Cosmic Forecast — 3. Applying → Exact → Separating Timing Sequence", () => {
  const getOrb = (jd: number) => Math.abs(jd - 2460010.0) * 1.0; // 0 at t=10
  const threshold = 2.0;

  const contactJd = findThresholdCrossing(2460010.0, 2460005.0, getOrb, threshold);
  const { jd: peakJd, minOrb } = findPeakOrbTime(2460008.0, 2460012.0, getOrb);
  const sepJd = findThresholdCrossing(2460010.0, 2460015.0, getOrb, threshold);

  assert.ok(contactJd < peakJd, "Contact must occur before Peak");
  assert.ok(peakJd < sepJd, "Peak must occur before Separation");
  assert.ok(Math.abs(contactJd - 2460008.0) < 1e-3);
  assert.ok(Math.abs(peakJd - 2460010.0) < 1e-3);
  assert.ok(Math.abs(sepJd - 2460012.0) < 1e-3);
  assert.ok(minOrb < 1e-4);
});

// 4. No False Event when aspect never enters orb
test("Cosmic Forecast — 4. Rejection of Non-Events Outside Defined Orb", () => {
  const getOrb = (jd: number) => 15.0 + Math.abs(jd - 2460000.0); // Minimum orb is 15°
  const threshold = 3.5;
  const { minOrb } = findPeakOrbTime(2460000.0, 2460010.0, getOrb);

  assert.ok(minOrb > threshold, "Min orb (15°) exceeds threshold (3.5°)");
});

// 5. Retrograde Second Pass Detection
test("Cosmic Forecast — 5. Retrograde Second Pass Structure", () => {
  const passInfo = buildRetrogradePassInfo(true, 1, 3);
  assert.equal(passInfo.isRetrograde, true);
  assert.equal(passInfo.passNumber, 2);
  assert.equal(passInfo.totalPassesEstimated, 3);
});

// 6. Three-Pass Transit Segmentation
test("Cosmic Forecast — 6. Three-Pass Transit Direction Segmentation", () => {
  // Test segmenting across stationary points
  const p1 = buildRetrogradePassInfo(false, 0, 3);
  const p2 = buildRetrogradePassInfo(true, 1, 3);
  const p3 = buildRetrogradePassInfo(false, 2, 3);

  assert.equal(p1.passNumber, 1);
  assert.equal(p1.isRetrograde, false);
  assert.equal(p2.passNumber, 2);
  assert.equal(p2.isRetrograde, true);
  assert.equal(p3.passNumber, 3);
  assert.equal(p3.isRetrograde, false);
});

// 7. Event Boundary Behavior
test("Cosmic Forecast — 7. Event Boundary Refinement at Edge of Forecast Window", () => {
  const getOrb = (jd: number) => Math.abs(jd - 2460090.0);
  const threshold = 3.0;
  // Edge of window search
  const contactJd = findThresholdCrossing(2460090.0, 2460085.0, getOrb, threshold);
  assert.ok(contactJd >= 2460086.9 && contactJd <= 2460087.1);
});

// 8. 30-Day Horizon Partitioning
test("Cosmic Forecast — 8. Next 30 Days Horizon Partitioning", () => {
  const startDate = new Date("2026-09-20T00:00:00Z");
  const radar = buildRadarHorizons({
    chart: mockChart,
    panchang: mockPanchang,
    startDate,
    daysAhead: 90,
    localTz: 5.5,
  });

  assert.ok(Array.isArray(radar.next30Days));
  for (const ev of radar.next30Days) {
    const evTime = (ev.timing.exactAt || ev.timing.peakAt).getTime();
    const startMs = startDate.getTime();
    assert.ok(
      evTime >= startMs && evTime <= startMs + 30 * 86400000,
      `Event ${ev.title} must fall strictly within 30 days`
    );
  }
});

// 9. 90-Day Horizon Partitioning
test("Cosmic Forecast — 9. Next 90 Days Horizon Partitioning", () => {
  const startDate = new Date("2026-09-20T00:00:00Z");
  const radar = buildRadarHorizons({
    chart: mockChart,
    panchang: mockPanchang,
    startDate,
    daysAhead: 90,
    localTz: 5.5,
  });

  assert.ok(Array.isArray(radar.next90Days));
  for (const ev of radar.next90Days) {
    const evTime = (ev.timing.exactAt || ev.timing.peakAt).getTime();
    const startMs = startDate.getTime();
    assert.ok(
      evTime > startMs + 30 * 86400000 && evTime <= startMs + 90 * 86400000,
      `Event ${ev.title} must fall between 31 and 90 days`
    );
  }
});

// 10. Unified Chronological Ordering (Dasha + Transit)
test("Cosmic Forecast — 10. Unified Chronological Ordering of Transits and Dasha", () => {
  const startDate = new Date("2026-09-20T00:00:00Z");
  const radar = buildRadarHorizons({
    chart: mockChart,
    panchang: mockPanchang,
    startDate,
    daysAhead: 90,
    localTz: 5.5,
  });

  const combined = [...radar.next30Days, ...radar.next90Days];
  for (let i = 1; i < combined.length; i++) {
    const prevTime = (combined[i - 1].timing.exactAt || combined[i - 1].timing.peakAt).getTime();
    const currTime = (combined[i].timing.exactAt || combined[i].timing.peakAt).getTime();
    assert.ok(prevTime <= currTime, "Combined radar events must be strictly sorted by date");
  }
});

// 11. Local Timezone Conversion
test("Cosmic Forecast — 11. Local Timezone Provenance Consistency", () => {
  const startDate = new Date("2026-09-20T00:00:00Z");
  const radar = buildRadarHorizons({
    chart: mockChart,
    panchang: mockPanchang,
    startDate,
    daysAhead: 30,
    localTz: -4.0, // New York
  });

  if (radar.next30Days.length > 0) {
    assert.equal(radar.next30Days[0].provenance.localTz, -4.0);
  }
});

// 12. Events Crossing Midnight
test("Cosmic Forecast — 12. Aspect Culmination Crossing Midnight Boundary", () => {
  // Test event exact at 23:59 vs 00:01
  const jdMidnight = 2460000.5; // Exactly 00:00 UT
  const getAngleError = (jd: number) => (jd - jdMidnight) * 1.5;
  const exactJd = findExactAspectTime(jdMidnight - 0.1, jdMidnight + 0.1, getAngleError);

  assert.ok(exactJd !== null);
  assert.ok(Math.abs(exactJd - jdMidnight) < 1e-4);
});

// 13. Events Crossing Month/Year Boundary
test("Cosmic Forecast — 13. Continuity Across Month & Year Boundaries", () => {
  const dec31 = new Date("2026-12-31T23:00:00Z");
  const jdDec31 = dateToJulianDay(dec31);
  const jan01 = new Date("2027-01-01T01:00:00Z");
  const jdJan01 = dateToJulianDay(jan01);

  assert.ok(jdJan01 > jdDec31);
  assert.ok(Math.abs((jdJan01 - jdDec31) - (2 / 24)) < 1e-6);
});

// 14. Retrograde Velocity Reversal
test("Cosmic Forecast — 14. Ephemeris Derivative Sign Inversion for Retrograde", () => {
  // Rahu / Ketu mean velocity is always negative (retrograde)
  const jd = 2451545.0;
  const rahuVel = computeEphemerisVelocity("Rahu", jd);
  assert.equal(rahuVel.isRetrograde, true);
  assert.ok(rahuVel.velocity < 0);

  // Sun velocity is always direct (positive)
  const sunVel = computeEphemerisVelocity("Sun", jd);
  assert.equal(sunVel.isRetrograde, false);
  assert.ok(sunVel.velocity > 0);
});

// 15. No Duplicate Events After Fusion
test("Cosmic Forecast — 15. Deduplication Integrity Across All Events", () => {
  const startDate = new Date("2026-09-20T00:00:00Z");
  const radar = buildRadarHorizons({
    chart: mockChart,
    panchang: mockPanchang,
    startDate,
    daysAhead: 90,
  });

  const allEvents = [...radar.next30Days, ...radar.next90Days];
  const ids = new Set<string>();

  for (const ev of allEvents) {
    assert.equal(ids.has(ev.id), false, `Event ID ${ev.id} must be unique`);
    ids.add(ev.id);
  }
});
