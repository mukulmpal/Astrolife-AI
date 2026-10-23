import { test } from "node:test";
import assert from "node:assert/strict";
import {
  detectPlanetaryConflicts,
  calculateAspectKinematics,
  angularDiff,
} from "../detectors/planetary-conflict";
import { detectTransitHits } from "../detectors/transit-hits";
import { detectDashaMilestones } from "../detectors/dasha-transitions";
import { calculateTaraBala, NAKSHATRAS } from "../detectors/tara-bala";
import { calculateChandraBala } from "../detectors/chandra-bala";
import { extractMicroTiming } from "../detectors/micro-timing";
import { fuseTriggers } from "../fusion/trigger-fusion";
import { calculateCosmicPulse } from "../index";
import {
  computeAllEphemerisVelocities,
  computeEphemerisVelocity,
  enrichWithEphemerisVelocities,
  dateToJulianDay,
} from "../ephemeris-precision";
import { calculatePanchang } from "../../panchang";
import type { ChartData } from "../../calculations";
import type { PanchangResult } from "../../panchang";

test("Cosmic Pulse — Angular Difference across 360°", () => {
  assert.equal(angularDiff(10, 20), 10);
  assert.equal(angularDiff(355, 5), 10);
  assert.equal(angularDiff(0, 180), 180);
  assert.equal(angularDiff(10, 190), 180);
});

test("Cosmic Pulse — Exact Opposition (0° Orb Peak)", () => {
  const planets = [
    { name: "Sun" as const, longitude: 15.0, house: 1, speed: 0.985 },
    { name: "Saturn" as const, longitude: 195.0, house: 7, speed: 0.033 }, // exactly 180.0°
  ];

  const triggers = detectPlanetaryConflicts(planets);
  assert.equal(triggers.length, 1, "Should detect exactly 1 fused Sun-Saturn opposition");
  assert.equal(triggers[0].lifecycle, "peak");
  assert.equal(triggers[0].evidence.currentOrbDeg, 0);
  assert.equal(triggers[0].evidence.exactAspectDeg, 180);
});

test("Cosmic Pulse — Approaching Opposition (Relative Kinematics)", () => {
  // Sun at 10.0° moving at 1.0°/day, Saturn at 192.5° moving at 0.03°/day.
  // Separation: 192.5 - 10.0 = 182.5° (orb: 2.5°).
  // In 1 day, Sun reaches 11.0°, Saturn reaches 192.53° -> separation: 181.53° (orb: 1.53°).
  // Orb is shrinking -> APPLYING / APPROACHING!
  const kinematics = calculateAspectKinematics(
    { name: "Sun", longitude: 10.0, house: 1, speed: 1.0 },
    { name: "Saturn", longitude: 192.5, house: 7, speed: 0.03 },
    180
  );

  assert.equal(kinematics.isApplying, true, "Must be applying because faster Sun is catching up to 180°");
  assert.equal(kinematics.lifecycle, "approaching");
  assert.ok(Math.abs(kinematics.currentOrb - 2.5) < 0.01);
});

test("Cosmic Pulse — Separating Opposition (Relative Kinematics)", () => {
  // Sun at 15.0° moving at 1.0°/day, Saturn at 193.0° moving at 0.03°/day.
  // Separation: 193.0 - 15.0 = 178.0° (orb: 2.0°).
  // In 1 day, Sun reaches 16.0°, Saturn reaches 193.03° -> separation: 177.03° (orb: 2.97°).
  // Orb is growing -> SEPARATING!
  const kinematics = calculateAspectKinematics(
    { name: "Sun", longitude: 15.0, house: 1, speed: 1.0 },
    { name: "Saturn", longitude: 193.0, house: 7, speed: 0.03 },
    180
  );

  assert.equal(kinematics.isApplying, false, "Must be separating because faster Sun has crossed 180°");
  assert.equal(kinematics.lifecycle, "separating");
  assert.ok(Math.abs(kinematics.currentOrb - 2.0) < 0.01);
});

test("Cosmic Pulse — Trigger Fusion: Eliminates Symmetric Duplicates and Merges Signals", () => {
  // Pass both Sun and Saturn into conflict detector
  const planets = [
    { name: "Sun" as const, longitude: 15.0, house: 1 },
    { name: "Saturn" as const, longitude: 195.2, house: 7 },
  ];

  const conflictTriggers = detectPlanetaryConflicts(planets);
  // Symmetric deduplication prevents 2 opposite triggers
  assert.equal(conflictTriggers.length, 1, "Symmetric mutual aspect must only generate 1 primary trigger");

  // Also simulate transit hit on natal planet for the same pair
  const transitHits = detectTransitHits([
    {
      transitPlanet: "Saturn",
      transitLongitude: 195.2,
      transitHouse: 7,
      natalPlanet: "Sun",
      natalLongitude: 15.0,
      natalHouse: 1,
    },
  ]);

  const fused = fuseTriggers([...conflictTriggers, ...transitHits]);
  assert.ok(fused.dominantTrigger);
  assert.equal(fused.dominantTrigger.primaryPlanets.includes("Sun"), true);
  assert.equal(fused.dominantTrigger.primaryPlanets.includes("Saturn"), true);
  assert.ok(fused.dominantTrigger.supportingSignals);
  assert.ok(fused.dominantTrigger.supportingSignals.length >= 1, "Should merge signals under supportingSignals");
});

test("Cosmic Pulse — Mars 4th Special Aspect Detection", () => {
  const planets = [
    { name: "Mars" as const, longitude: 10.0, house: 1 },
    { name: "Saturn" as const, longitude: 100.5, house: 4 }, // 90.5° -> Mars 4th aspect
  ];

  const triggers = detectPlanetaryConflicts(planets);
  const marsAspect = triggers.find((t) => t.title.includes("Mars 4th Aspect"));
  assert.ok(marsAspect, "Should detect Mars 4th special aspect on Saturn");
  assert.ok(marsAspect.learning.howItWorks.includes("4th"));
});

test("Cosmic Pulse — Transit Hit on Natal Planet (Saturn over Moon)", () => {
  const hits = detectTransitHits([
    {
      transitPlanet: "Saturn",
      transitLongitude: 345.5,
      transitHouse: 12,
      natalPlanet: "Moon",
      natalLongitude: 345.2,
      natalHouse: 12,
    },
  ]);

  assert.equal(hits.length, 1);
  assert.equal(hits[0].id, "transit-hit-saturn-moon");
  assert.equal(hits[0].severity, "critical");
  assert.equal(hits[0].lifecycle, "peak");
  assert.ok(hits[0].learning.title.includes("Chandra-Shani"));
});

test("Cosmic Pulse — Tara Bala 1–9 Complete Cycle Validation", () => {
  // Validate all 9 Taras in sequence from Ashwini (index 0)
  const expectedTaras = [
    { idx: 0, num: 1, name: "Janma", quality: "neutral" },
    { idx: 1, num: 2, name: "Sampat", quality: "supportive" },
    { idx: 2, num: 3, name: "Vipat", quality: "caution" },
    { idx: 3, num: 4, name: "Kshema", quality: "supportive" },
    { idx: 4, num: 5, name: "Pratyak", quality: "caution" },
    { idx: 5, num: 6, name: "Sadhana", quality: "supportive" },
    { idx: 6, num: 7, name: "Naidhana", quality: "caution" },
    { idx: 7, num: 8, name: "Mitra", quality: "supportive" },
    { idx: 8, num: 9, name: "Parama Mitra", quality: "supportive" },
  ];

  for (const exp of expectedTaras) {
    const transitNakshatra = NAKSHATRAS[exp.idx];
    const tb = calculateTaraBala("Ashwini", transitNakshatra);
    assert.equal(tb.number, exp.num, `Tara number should match for index ${exp.idx}`);
    assert.equal(tb.name, exp.name, `Tara name should match for index ${exp.idx}`);
    assert.equal(tb.quality, exp.quality, `Tara quality should match for index ${exp.idx}`);
  }

  // Wraparound test: Ashwini (0) to Revati (26): (26 - 0 + 27) % 27 = 26 % 9 = 8 -> 9 (Parama Mitra)
  const revatiTb = calculateTaraBala("Ashwini", "Revati");
  assert.equal(revatiTb.number, 9);
  assert.equal(revatiTb.name, "Parama Mitra");
});

test("Cosmic Pulse — Chandra Bala & Ashtama Chandra", () => {
  // Natal Moon in Aries (0), Transit Moon in Scorpio (7) -> 8th house = Ashtama Chandra
  const ashtama = calculateChandraBala(0, 7);
  assert.equal(ashtama.houseFromNatalMoon, 8);
  assert.equal(ashtama.isAshtamaChandra, true);
  assert.equal(ashtama.isSupportive, false);
  assert.ok(ashtama.learning.sanskritTerm?.includes("अष्टम चन्द्र"));

  // Natal Moon in Aries (0), Transit Moon in Gemini (2) -> 3rd house = Supportive
  const goodMoon = calculateChandraBala(0, 2);
  assert.equal(goodMoon.houseFromNatalMoon, 3);
  assert.equal(goodMoon.isSupportive, true);
  assert.equal(goodMoon.isAshtamaChandra, false);
});

test("Cosmic Pulse — Dasha Sandhi & Shift Boundaries (90-day, 30-day, 0-day)", () => {
  const mockNow = new Date("2026-09-20T12:00:00Z");

  // 1. 40 days remaining (within 90-day Sandhi)
  const dashas40d = [
    { planet: "Rahu", start: "2008-10-15", end: "2026-10-30" },
    { planet: "Jupiter", start: "2026-10-30", end: "2042-10-30" },
  ];
  const milestone40d = detectDashaMilestones(dashas40d, [], mockNow);
  assert.ok(milestone40d);
  assert.equal(milestone40d.type, "mahadasha_sandhi");
  assert.ok(milestone40d.daysRemaining > 0 && milestone40d.daysRemaining <= 90);

  // 2. Exact transition day (0 days remaining)
  const dashasToday = [
    { planet: "Rahu", start: "2008-10-15", end: "2026-09-20T18:00:00Z" },
    { planet: "Jupiter", start: "2026-09-20T18:00:00Z", end: "2042-09-20" },
  ];
  const milestoneToday = detectDashaMilestones(dashasToday, [], mockNow);
  assert.ok(milestoneToday);
  assert.equal(milestoneToday.daysRemaining, 1); // within 24h
  assert.ok(milestoneToday.headline.includes("Mahadasha"));

  // 3. Antardasha 15 days remaining (within 30-day shift)
  const antardashas15d = [
    { planet: "Saturn", start: "2024-01-01", end: "2026-10-05" },
    { planet: "Mercury", start: "2026-10-05", end: "2028-01-01" },
  ];
  const adMilestone = detectDashaMilestones([], antardashas15d, mockNow);
  assert.ok(adMilestone);
  assert.equal(adMilestone.type, "antardasha_shift");
  assert.equal(adMilestone.currentLord, "Saturn");
  assert.equal(adMilestone.nextLord, "Mercury");
  assert.equal(adMilestone.daysRemaining, 15);
});

test("Cosmic Pulse — Timezone Boundary & Panchang Windows", () => {
  const testDate = new Date("2026-09-20T12:00:00Z");

  // New Delhi (tz: 5.5, lat: 28.61, lon: 77.20)
  const panchangDelhi = calculatePanchang(testDate, 5.5, { lat: 28.61, lon: 77.20 });
  const timingDelhi = extractMicroTiming(panchangDelhi);

  // New York (tz: -4, lat: 40.71, lon: -74.00)
  const panchangNY = calculatePanchang(testDate, -4.0, { lat: 40.71, lon: -74.00 });
  const timingNY = extractMicroTiming(panchangNY);

  // Sunrise/sunset in Delhi vs NY must differ based on geographic coordinates & timezone
  assert.notEqual(panchangDelhi.sunrise, panchangNY.sunrise);
  assert.notEqual(timingDelhi.actionWindow.start, timingNY.actionWindow.start);
  assert.notEqual(timingDelhi.avoidWindow.start, timingNY.avoidWindow.start);
});

test("Cosmic Pulse — Master Output Excludes Any Daily Numeric Score", () => {
  const dummyChart = {
    planets: {
      Sun: { longitude: 15.0, house: 1, sign: "Aries" },
      Moon: { longitude: 25.0, house: 1, sign: "Aries", nakshatra: "Bharani" },
      Saturn: { longitude: 195.0, house: 7, sign: "Libra" },
    },
    dashas: [
      { planet: "Jupiter", start: "2020-01-01", end: "2036-01-01" },
    ],
  } as unknown as ChartData;

  const dummyPanchang = {
    nakshatra: "Pushya",
    moonSign: "Cancer",
    abhijitMuhurta: { name: "Abhijit Muhurta", start: "11:52 AM", end: "12:40 PM" },
    rahuKaal: { name: "Rahu Kaal", start: "10:30 AM", end: "12:00 PM" },
  } as unknown as PanchangResult;

  const result = calculateCosmicPulse({
    chart: dummyChart,
    panchang: dummyPanchang,
    currentDate: new Date("2026-09-20T00:00:00Z"),
  });

  // Verify result contract
  assert.ok(result.dominantTrigger);
  assert.ok(result.taraBala);
  assert.ok(result.chandraBala);
  assert.ok(result.microTiming);
  assert.ok(result.microRemedy);
  assert.ok(result.dominantTrigger.learning);

  // CRITICAL: Ensure NO numeric daily score is present
  assert.equal((result as unknown as Record<string, unknown>).score, undefined);
  assert.equal((result as unknown as Record<string, unknown>).dailyScore, undefined);
});

test("Cosmic Pulse — Ephemeris Precision: Instantaneous Planetary Velocities", () => {
  const jd2000 = 2451545.0; // 2000-01-01 12:00:00 TT
  const velocities = computeAllEphemerisVelocities(jd2000);

  // 1. Sun velocity must be positive and ~0.95 to 1.02 deg/day
  assert.ok(velocities.Sun.velocity > 0.95 && velocities.Sun.velocity < 1.03, "Sun speed around J2000 must be ~1 deg/day");
  assert.equal(velocities.Sun.isRetrograde, false);

  // 2. Moon velocity must be positive and ~11.5 to 15.5 deg/day
  assert.ok(velocities.Moon.velocity > 11.0 && velocities.Moon.velocity < 16.0, "Moon daily motion must be within realistic physical range");
  assert.equal(velocities.Moon.isRetrograde, false);

  // 3. Rahu & Ketu mean nodes are always retrograde (negative velocity)
  assert.ok(velocities.Rahu.velocity < 0, "Rahu mean node velocity must be negative");
  assert.equal(velocities.Rahu.isRetrograde, true);
  assert.ok(velocities.Ketu.velocity < 0, "Ketu mean node velocity must be negative");
  assert.equal(velocities.Ketu.isRetrograde, true);

  // 4. Single planet query consistency
  const singleSaturn = computeEphemerisVelocity("Saturn", jd2000);
  assert.equal(singleSaturn.velocity, velocities.Saturn.velocity);
  assert.equal(singleSaturn.speed, velocities.Saturn.speed);
});

test("Cosmic Pulse — Ephemeris Precision: Automatic Enrichment into Kinematics", () => {
  const testDate = new Date("2026-09-20T12:00:00Z");
  const enriched = enrichWithEphemerisVelocities([
    { name: "Sun", longitude: 155.0, house: 6 },
    { name: "Saturn", longitude: 335.0, house: 12 },
  ], testDate);

  assert.equal(enriched.length, 2);
  assert.ok(enriched[0].speed > 0.9 && enriched[0].speed < 1.05, "Enriched Sun must contain true ephemeris speed");
  assert.ok(typeof enriched[1].speed === "number");
  assert.ok(typeof enriched[1].isRetrograde === "boolean");
});

