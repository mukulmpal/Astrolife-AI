// src/lib/astro-engine/__tests__/core-planet-remedies.test.ts
// AstroLife — Automated Verification of Core Planet Remedies & Transit Growth Predictor

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  MASTER_PLANET_REGISTRY,
  evaluateCorePlanetRemedy,
  getMoonSharingGuide,
  evaluateConjunctionInHouse
} from "../core-planet-remedies";
import {
  evaluatePropertyTiming,
  evaluateSaturn7thHouseGrowth,
  evaluateBNNTransitConjunctions,
  buildMasterTransitRadarDossier
} from "../property-transit-predictor";
import type { ChartData } from "../calculations";

describe("Core Planet Remedies Registry & Dosage Formulas", () => {
  it("contains complete authentic definitions for all 9 planets", () => {
    const planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as const;
    planets.forEach((p) => {
      const def = MASTER_PLANET_REGISTRY[p];
      assert.ok(def, `Definition missing for ${p}`);
      assert.ok(def.deity);
      assert.ok(def.gemstone.name);
      assert.ok(def.gemstone.strictWarning);
      assert.ok(def.afflictedStoneWarning.includes("BHULKAR BHI"));
      assert.ok(def.afflictedCharity.length >= 1);
    });
  });

  it("verifies Ketu 7 bananas miracle remedy and sour food warning", () => {
    const ketuDef = MASTER_PLANET_REGISTRY.Ketu;
    const bananaCharity = ketuDef.afflictedCharity.find((c) => c.item.includes("7 Ripe Bananas"));
    assert.ok(bananaCharity);
    assert.ok(bananaCharity.quantity.includes("7 Ripe Yellow Bananas"));
    assert.ok(bananaCharity.targetRecipient.includes("Lord Ganesha"));

    const habitWarning = ketuDef.avoidHabits.some((h) => h.includes("Nimboo aur Imli") || h.includes("sour"));
    assert.strictEqual(habitWarning, true);
  });

  it("verifies Venus 6kg potatoes in religious langar formula", () => {
    const venusDef = MASTER_PLANET_REGISTRY.Venus;
    const potatoCharity = venusDef.afflictedCharity.find((c) => c.item.includes("Potatoes (Aloo)"));
    assert.ok(potatoCharity);
    assert.ok(potatoCharity.quantity.includes("6 kg"));
    assert.ok(potatoCharity.targetRecipient.includes("Langar"));
  });

  it("verifies Sun 1/10th body weight wheat donation formula", () => {
    const sunDef = MASTER_PLANET_REGISTRY.Sun;
    const wheatCharity = sunDef.afflictedCharity.find((c) => c.item.includes("Whole Wheat"));
    assert.ok(wheatCharity);
    assert.ok(wheatCharity.quantity.includes("1/10th"));
  });
});

describe("Dignity & Strength Evaluation (Power-Up vs Mitigate)", () => {
  const sampleFavorableChart: ChartData = {
    name: "Sun Exalted Native",
    dob: "1990-04-14",
    tob: "10:00",
    city: "New Delhi",
    lat: 28.61,
    lon: 77.20,
    tz: 5.5,
    jd: 2447995.5,
    lagnaRashi: "Cancer",
    lagnaLon: 95.0,
    lagnaNum: 4,
    houses: [] as any,
    ayanamsha: "Lahiri" as any,
    planets: {
      Sun: { name: "Sun", sign: "Aries", house: 10, degree: 10, minutes: 0, nakshatra: "Ashwini", pada: 1, dignity: "Exalted" } as any,
      Moon: { name: "Moon", sign: "Taurus", house: 11, degree: 5, minutes: 0, nakshatra: "Krittika", pada: 2, dignity: "Exalted" } as any,
      Saturn: { name: "Saturn", sign: "Aries", house: 8, degree: 15, minutes: 0, nakshatra: "Bharani", pada: 1, dignity: "Debilitated" } as any
    },
    dashas: [{ planet: "Sun", active: true, start: new Date("2020-01-01"), end: new Date("2026-01-01") }] as any
  };

  it("recommends Power-Up and Gemstone for favorable exalted Sun in 10th", () => {
    const result = evaluateCorePlanetRemedy("Sun", sampleFavorableChart);
    assert.ok(result);
    assert.strictEqual(result.isFavorable, true);
    assert.strictEqual(result.recommendationType, "PowerUp_Gemstone_Favorable");
    assert.strictEqual(result.gemstoneAdvice.canWearStone, true);
    assert.ok(result.coloursToWear.length > 0);
  });

  it("strictly warns NEVER wear gemstone for debilitated Saturn in 8th house", () => {
    const result = evaluateCorePlanetRemedy("Saturn", sampleFavorableChart);
    assert.ok(result);
    assert.strictEqual(result.isFavorable, false);
    assert.strictEqual(result.recommendationType, "Mitigate_Charity_Afflicted");
    assert.strictEqual(result.gemstoneAdvice.canWearStone, false);
    assert.ok(result.gemstoneAdvice.strictWarning.includes("BHULKAR BHI"));
    assert.ok(result.charityFormulas.length > 0);
  });
});

describe("Moon Psychological Heart-Sharing Sanctuary Map", () => {
  it("maps Moon in 4th house to Mother & Home Sanctuary", () => {
    const guide = getMoonSharingGuide(4);
    assert.strictEqual(guide.moonHouse, 4);
    assert.ok(guide.confidantTitleHinglish.includes("Mata Ji"));
    assert.ok(guide.narrativeHinglish.includes("Mata Ji"));
  });

  it("maps Moon in 7th house to Spouse & Life Partner", () => {
    const guide = getMoonSharingGuide(7);
    assert.strictEqual(guide.moonHouse, 7);
    assert.ok(guide.confidantTitleHinglish.includes("Jeevan-Saathi"));
  });

  it("maps Moon in 12th house to Solitude & Divine Meditation", () => {
    const guide = getMoonSharingGuide(12);
    assert.strictEqual(guide.moonHouse, 12);
    assert.ok(guide.confidantTitleHinglish.includes("Ishta Devata"));
  });
});

describe("Property Timing & Saturn 7th House Growth Predictor (Sachidanand Ji Benchmark)", () => {
  const sachidanandChart: ChartData = {
    name: "Sachidanand Ji (Basti UP Benchmark)",
    dob: "1965-03-05",
    tob: "14:00",
    city: "Basti",
    lat: 26.79,
    lon: 82.74,
    tz: 5.5,
    jd: 2438824.85,
    lagnaRashi: "Gemini",
    lagnaLon: 68.5,
    lagnaNum: 3,
    houses: [] as any,
    ayanamsha: "Lahiri" as any,
    planets: {
      Sun: { name: "Sun", sign: "Aquarius", house: 9, degree: 21, minutes: 0, nakshatra: "Purva Bhadrapada", pada: 1 } as any,
      Mercury: { name: "Mercury", sign: "Aquarius", house: 9, degree: 28, minutes: 0, nakshatra: "Purva Bhadrapada", pada: 3 } as any,
      Venus: { name: "Venus", sign: "Aquarius", house: 9, degree: 14, minutes: 0, nakshatra: "Shatabhisha", pada: 3 } as any,
      Moon: { name: "Moon", sign: "Pisces", house: 10, degree: 5, minutes: 0, nakshatra: "Uttarabhadrapada", pada: 1 } as any,
      Saturn: { name: "Saturn", sign: "Aquarius", house: 9, degree: 10, minutes: 0, nakshatra: "Shatabhisha", pada: 2 } as any,
      Mars: { name: "Mars", sign: "Virgo", house: 4, degree: 18, minutes: 0, nakshatra: "Hasta", pada: 3 } as any
    },
    dashas: [{ planet: "Moon", active: true, start: new Date("2020-01-01"), end: new Date("2030-01-01") }] as any,
    antardasha: [{ planet: "Saturn", active: true, start: new Date("2023-01-01"), end: new Date("2025-01-01") }] as any
  };

  it("verifies Gemini Lagna Saturn Growth Radar: past 8th->2nd (wealth), current 9th->3rd (communication), future 10th->4th (big mansion)", () => {
    const growth = evaluateSaturn7thHouseGrowth(sachidanandChart);
    
    // Past: Saturn in Capricorn (8th house) -> growth in 2nd house (family wealth / stock market)
    assert.strictEqual(growth.past.saturnTransitHouse, 8);
    assert.strictEqual(growth.past.elevatedGrowthHouse, 2);
    assert.ok(growth.past.narrativeStoryHinglish.includes("Family ke andar status badha, paiso ka status badha"));

    // Current: Saturn in Aquarius (9th house) -> growth in 3rd house (teaching, communication, reach)
    assert.strictEqual(growth.current.saturnTransitHouse, 9);
    assert.strictEqual(growth.current.elevatedGrowthHouse, 3);
    assert.ok(growth.current.narrativeStoryHinglish.includes("3rd bhav (communication, teaching reach, writing, outreach)"));

    // Future: Saturn in Pisces (10th house) -> growth in 4th house (big house, luxury vehicle)
    assert.strictEqual(growth.future.saturnTransitHouse, 10);
    assert.strictEqual(growth.future.elevatedGrowthHouse, 4);
    assert.ok(growth.future.narrativeStoryHinglish.includes("Bada makaan banne wala hai"));
  });

  it("verifies BNN Transit Conjunctions in Aquarius: Sun, Mercury, and Venus", () => {
    const hits = evaluateBNNTransitConjunctions(sachidanandChart, "Aquarius");
    assert.ok(hits.length >= 3);

    const sunHit = hits.find((h) => h.natalPlanet === "Sun");
    assert.ok(sunHit);
    assert.ok(sunHit.verbatimTranscriptQuote.includes("name-fame status milega teaching line me"));

    const mercuryHit = hits.find((h) => h.natalPlanet === "Mercury");
    assert.ok(mercuryHit);
    assert.ok(mercuryHit.verbatimTranscriptQuote.includes("connection badhne shuru ho jayenge"));

    const venusHit = hits.find((h) => h.natalPlanet === "Venus");
    assert.ok(venusHit);
    assert.ok(venusHit.verbatimTranscriptQuote.includes("Venus to hai hi wealth"));
  });

  it("detects Property Acquisition (4-11-12) vs Sale (3-7-10-5)", () => {
    const propertyResult = evaluatePropertyTiming(sachidanandChart);
    assert.ok(propertyResult);
    assert.ok(propertyResult.timingStatus);
  });

  it("builds the master transit radar dossier and identifies benchmark chart", () => {
    const dossier = buildMasterTransitRadarDossier(sachidanandChart);
    assert.ok(dossier);
    assert.strictEqual(dossier.isBenchmarkChart, true);
    assert.strictEqual(dossier.lagnaSignName, "Gemini");
  });
});
