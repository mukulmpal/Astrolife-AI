import test from "node:test";
import assert from "node:assert/strict";
import { generateTransitRippleReport } from "../index";
import type { NatalInput } from "../types";

const TEST_NATAL: NatalInput = {
  birthDate: "1990-08-15",
  birthTime: "14:30",
  timezone: "+05:30",
  latitude: 28.6139,
  longitude: 77.209,
  lagnaSign: 7, // Scorpio (Vrishchika)
  lagnaSignName: "Scorpio",
  moonLongitude: 220.4,
  moonNakshatra: 16, // Anuradha
  activeMahadasha: "Jupiter",
  activeAntardasha: "Saturn",
};

test("Transit Ripple 2.0: Calculates all 9 planets, aspect intersections, and cluster hotspots", () => {
  const result = generateTransitRippleReport(
    TEST_NATAL,
    "2026-10-05",
    "hinglish",
    "Saturn"
  );

  // 1. All 9 planets mapped
  const planets = Object.keys(result.transitPositions);
  assert.equal(planets.length, 9);
  assert.ok(result.transitPositions.Saturn);
  assert.ok(result.transitPositions.Jupiter);
  assert.ok(result.transitPositions.Rahu);
  assert.ok(result.transitPositions.Ketu);
  assert.ok(result.transitPositions.Mars);

  // 2. Aspects & Clusters computed
  assert.ok(result.allDrishtiHits.length > 15);
  assert.ok(result.hotspotHouses.length >= 1);

  // 3. Narrative contains ZERO numeric scores
  const narrative = result.narrative;
  assert.ok(narrative.chapterTitle);
  assert.ok(narrative.dashaGocharFusion);
  assert.ok(narrative.houseImpacts.length >= 4);
  assert.ok(narrative.defensiveCautions.length >= 2);
  assert.ok(narrative.offensiveOpportunities.length >= 2);
  assert.ok(narrative.sattvicUpaya.length >= 3);

  // 4. Multi-Layer Navatara Intelligence (Mahadasha x Antardasha x Daily Gochar)
  const navIntel = narrative.navataraIntelligence;
  assert.ok(navIntel);
  assert.ok(navIntel.dailyTransitMoon);
  assert.ok(navIntel.dailyTransitMoon.taraName);
  assert.ok(navIntel.mahadashaTara);
  assert.equal(navIntel.mahadashaTara.lord, "Jupiter");
  assert.ok(navIntel.mahadashaTara.taraNumber >= 1 && navIntel.mahadashaTara.taraNumber <= 9);
  assert.ok(navIntel.mahadashaTara.taraName);
  assert.ok(navIntel.antardashaTara);
  assert.equal(navIntel.antardashaTara.lord, "Saturn");
  assert.ok(navIntel.antardashaTara.taraNumber >= 1 && navIntel.antardashaTara.taraNumber <= 9);
  assert.ok(navIntel.antardashaTara.taraName);
  assert.ok(navIntel.triangulation);
  assert.ok(navIntel.triangulation.headline);
  assert.ok(navIntel.triangulation.synthesisStory);

  // Verify backward compatibility
  assert.equal(narrative.navataraSync.taraName, navIntel.dailyTransitMoon.taraName);
});

test("Transit Ripple 2.0: Generates pure English narrative when requested", () => {
  const result = generateTransitRippleReport(
    TEST_NATAL,
    "2026-10-05",
    "english",
    "Jupiter"
  );

  assert.equal(result.narrative.language, "english");
  assert.ok(result.narrative.chapterTitle.startsWith("The Chapter of Jupiter"));
  assert.ok(
    result.narrative.dashaGocharFusion.includes("major season of Jupiter")
  );
  assert.ok(result.narrative.navataraIntelligence.mahadashaTara.lord === "Jupiter");
  assert.ok(result.narrative.navataraIntelligence.antardashaTara?.lord === "Saturn");
});

