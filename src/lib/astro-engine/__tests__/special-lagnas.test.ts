import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateSpecialLagnas,
  calculateInduLagna,
  calculateArudhaPada,
  calculateSreeLagnaLon,
  calculateVarnadaLagna,
  calculatePranapadaLagna,
  evaluateAlUlSynastry,
  evaluateSpecialLagnaRajayogas,
  evaluateDashaActivation,
  INDU_LAGNA_RAYS,
  PLANET_RAYS,
  type SpecialLagnaItem,
  type InduLagnaAnalysis,
  type VarnadaLagnaAnalysis,
  type PranapadaLagnaAnalysis,
} from "../special-lagnas";
import type { ChartData, PlanetData } from "../calculations";

// Helper to construct mock ChartData
function createMockChart(
  lagnaRashiIndex: number, // 0 to 11 (0=Aries, 1=Taurus, ...)
  planetPositions: Record<string, { rashiIndex: number; degreeInSign: number; isRetrograde?: boolean }>,
  dob: string = "1990-05-15",
  tob: string = "10:30",
  lat: number = 28.6139,
  lon: number = 77.2090
): ChartData {
  const rashiNames = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const planets: Record<string, PlanetData> = {};
  for (const [name, pos] of Object.entries(planetPositions)) {
    const fullLon = pos.rashiIndex * 30 + pos.degreeInSign;
    const houseFromLagna = ((pos.rashiIndex - lagnaRashiIndex + 12) % 12) + 1;
    planets[name] = {
      lon: fullLon,
      sign: rashiNames[pos.rashiIndex],
      signNum: pos.rashiIndex,
      degree: Math.floor(pos.degreeInSign),
      minutes: Math.floor((pos.degreeInSign % 1) * 60),
      house: houseFromLagna,
      rashiHouse: houseFromLagna,
      bhavaHouse: houseFromLagna,
      bhavaShift: 0,
      bhavaNote: "",
      nakshatra: "Rohini",
      nakshatraLord: "Moon",
      pada: 1,
      retrograde: pos.isRetrograde ?? false,
      dignity: "Own",
      navamsha: "Aries",
    };
  }

  const lagnaLon = lagnaRashiIndex * 30 + 15.0; // 15 degrees into lagna sign

  return {
    name: "Test Native",
    dob,
    tob,
    city: "New Delhi",
    lat,
    lon,
    tz: 5.5,
    jd: 2448026.7,
    lagnaLon,
    lagnaRashi: rashiNames[lagnaRashiIndex],
    lagnaNum: lagnaRashiIndex,
    planets,
    houseCusps: [],
    houseSystem: "degree-equal-bhava",
    dashas: [
      {
        planet: "Jupiter",
        start: new Date("2020-01-01"),
        end: new Date("2036-01-01"),
        yrs: 16,
        active: true,
      },
      {
        planet: "Saturn",
        start: new Date("2036-01-01"),
        end: new Date("2055-01-01"),
        yrs: 19,
      },
    ],
    antardasha: [
      {
        planet: "Saturn",
        start: new Date("2022-01-01"),
        end: new Date("2024-07-01"),
        yrs: 2.5,
        active: true,
      },
    ],
  };
}

test("Indu Lagna: Ray Table & Calculation adheres to Varahamihira Classical Rules", () => {
  // Classical Ray Table
  assert.equal(INDU_LAGNA_RAYS["Sun"], 30);
  assert.equal(INDU_LAGNA_RAYS["Moon"], 16);
  assert.equal(INDU_LAGNA_RAYS["Mars"], 6);
  assert.equal(INDU_LAGNA_RAYS["Mercury"], 8);
  assert.equal(INDU_LAGNA_RAYS["Jupiter"], 10);
  assert.equal(INDU_LAGNA_RAYS["Venus"], 12);
  assert.equal(INDU_LAGNA_RAYS["Saturn"], 1);

  // Setup:
  // Lagna = Aries (sign 0), 9th house from Lagna = Sagittarius (lord = Jupiter, rays = 10)
  // Moon = Taurus (sign 1), 9th house from Moon = Capricorn (lord = Saturn, rays = 1)
  // Total rays = 10 + 1 = 11.
  // 11 % 12 = 11.
  // Count 11 signs from Moon sign (Taurus = 1, Gemini = 2, Cancer = 3, Leo = 4, Virgo = 5,
  // Libra = 6, Scorpio = 7, Sagittarius = 8, Capricorn = 9, Aquarius = 10, Pisces = 11).
  // Indu Lagna should be Pisces (signNum 11, 0-indexed).
  const chart = createMockChart(0, { // Aries Lagna
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Moon: { rashiIndex: 1, degreeInSign: 15 }, // Taurus Moon
    Mars: { rashiIndex: 2, degreeInSign: 12 },
    Mercury: { rashiIndex: 0, degreeInSign: 20 },
    Jupiter: { rashiIndex: 8, degreeInSign: 5 }, // Sagittarius
    Venus: { rashiIndex: 11, degreeInSign: 25 }, // Pisces (exalted benefic in Indu Lagna!)
    Saturn: { rashiIndex: 9, degreeInSign: 18 }, // Capricorn
  });

  const res = calculateSpecialLagnas(chart);
  const il = res.induLagna;

  assert.equal(il.lagna9thLord, "Jupiter");
  assert.equal(il.lagna9thRays, 10);
  assert.equal(il.moon9thLord, "Saturn");
  assert.equal(il.moon9thRays, 1);
  assert.equal(il.totalRays, 11);
  assert.equal(il.remainder, 11);
  assert.equal(il.sign, "Pisces");
  assert.equal(il.signNum, 11);
  // Venus is in Pisces (exalted benefic) -> High affluence or Kuber sovereign!
  assert.ok(il.kuberYogaScore >= 80, `Expected score >= 80 for exalted Venus in IL, got ${il.kuberYogaScore}`);
  assert.ok(il.occupants.includes("Venus"));
  assert.match(il.kuberYogaTier, /Kuber Sovereign|High Affluence/);
});

test("Indu Lagna: Remainder 0 maps to 12th from Moon", () => {
  // Setup where total rays % 12 == 0:
  // Moon in Leo (4), 9th house = Aries (lord Mars = 6 rays)
  // Lagna in Sagittarius (8), 9th house = Leo (lord Sun = 30 rays)
  // Total rays = 30 + 6 = 36. 36 % 12 == 0 -> remainder = 12.
  // 12th from Moon (Leo) is Cancer (signNum 3).
  const chart = createMockChart(8, { // Sagittarius Lagna
    Sun: { rashiIndex: 4, degreeInSign: 15 }, // Leo
    Moon: { rashiIndex: 4, degreeInSign: 20 }, // Leo Moon
    Mars: { rashiIndex: 0, degreeInSign: 10 },
    Mercury: { rashiIndex: 3, degreeInSign: 15 },
    Jupiter: { rashiIndex: 8, degreeInSign: 12 },
    Venus: { rashiIndex: 1, degreeInSign: 10 },
    Saturn: { rashiIndex: 10, degreeInSign: 5 },
  });

  const res = calculateSpecialLagnas(chart);
  const il = res.induLagna;

  assert.equal(il.totalRays, 36);
  assert.equal(il.remainder, 12);
  assert.equal(il.sign, "Cancer");
  assert.equal(il.signNum, 3);
});

test("All 12 Arudha Padas: Classical Formula & Exception Rules (+9 for same/7th)", () => {
  // Exception rule:
  // If lord is in 1st or 7th from house, lord distance is 0 or 6.
  // Exception adds 9 signs (+9).
  // Lagna = Aries (0). Mars in Aries (0).
  // Distance = 1. Naive pada = Aries (0).
  // Exception triggered (same sign) -> 0 + 9 = 9 (Capricorn).
  const chart = createMockChart(0, { // Aries Lagna
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Moon: { rashiIndex: 1, degreeInSign: 15 },
    Mars: { rashiIndex: 0, degreeInSign: 5 }, // Mars in Aries (House 1 lord in House 1)
    Mercury: { rashiIndex: 2, degreeInSign: 10 }, // House 3 lord in House 3 -> Gemini naive -> +9 = Pisces (11)
    Jupiter: { rashiIndex: 6, degreeInSign: 15 },
    Venus: { rashiIndex: 6, degreeInSign: 20 }, // House 7 lord in Libra (House 7) -> Cancer
    Saturn: { rashiIndex: 9, degreeInSign: 15 },
  });

  const res = calculateSpecialLagnas(chart);
  const al = res.arudhaItems.find((a) => a.key === "AL" || a.key === "A1");
  const a7 = res.arudhaItems.find((a) => a.key === "UL" || a.key === "A7");
  const a3 = res.arudhaItems.find((a) => a.key === "A3");

  assert.ok(al, "AL must be computed");
  assert.equal(al.sign, "Capricorn", "Mars in Lagna causes AL to jump 10th sign (Capricorn)");

  assert.ok(a7, "UL / A7 must be computed");
  assert.equal(a7.sign, "Cancer", "Venus in 7th causes UL to jump to Cancer");

  assert.ok(a3, "A3 must be computed");
  assert.equal(a3.sign, "Pisces", "Mercury in 3rd causes A3 to jump to Pisces");

  // Verify all 12 Arudha padas exist
  const arudhaKeys = ["AL", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11", "UL"];
  for (const k of arudhaKeys) {
    const found = res.arudhaItems.some((a) => a.key === k || (k === "AL" && a.key === "A1") || (k === "UL" && a.key === "A12"));
    assert.ok(found, `Expected Arudha pada ${k} to be present`);
  }
});

test("AL-UL Synastry: Detects Shadashtaka (6/8) & Recommends UL Lord Fasting Upay", () => {
  // Let AL = Aries (0) and UL = Virgo (5) -> Distance = (5 - 0) + 1 = 6 (6/8 Shadashtaka!)
  const alItem = { key: "AL", sign: "Aries", signNum: 0, lord: "Mars" } as SpecialLagnaItem;
  const ulItem = { key: "UL", sign: "Virgo", signNum: 5, lord: "Mercury" } as SpecialLagnaItem;

  const synastry = evaluateAlUlSynastry(alItem, ulItem);
  assert.equal(synastry.distance, 6);
  assert.match(synastry.relationship, /Shadashtaka/i);
  assert.ok(synastry.score <= 5, "Shadashtaka score must be <= 5");
  assert.match(synastry.remedy, /fasting/i);
  assert.match(synastry.remedy, /Wednesday/i); // Fast on Wednesday for Mercury
});

test("AL-UL Synastry: Detects Harmonious Samasaptaka (1/7)", () => {
  // Let AL = Taurus (1) and UL = Scorpio (7) -> Distance = (7 - 1) + 1 = 7 (1/7 axis)
  const alItem = { key: "AL", sign: "Taurus", signNum: 1, lord: "Venus" } as SpecialLagnaItem;
  const ulItem = { key: "UL", sign: "Scorpio", signNum: 7, lord: "Mars" } as SpecialLagnaItem;

  const synastry = evaluateAlUlSynastry(alItem, ulItem);
  assert.equal(synastry.distance, 7);
  assert.match(synastry.relationship, /Samasaptaka/i);
  assert.ok(synastry.score >= 8, "Samasaptaka score must be >= 8");
});

test("Paka Lagna: Placed in the sign of Natal Lagna Lord", () => {
  // Lagna = Aries (0), Lord Mars = Leo (4)
  // Paka Lagna must be Leo (4)
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Moon: { rashiIndex: 1, degreeInSign: 15 },
    Mars: { rashiIndex: 4, degreeInSign: 12 }, // Mars in Leo (House 5)
    Mercury: { rashiIndex: 2, degreeInSign: 10 },
    Jupiter: { rashiIndex: 8, degreeInSign: 15 },
    Venus: { rashiIndex: 3, degreeInSign: 20 },
    Saturn: { rashiIndex: 10, degreeInSign: 5 },
  });

  const res = calculateSpecialLagnas(chart);
  assert.equal(res.pakaLagna.sign, "Leo");
  assert.equal(res.pakaLagna.house, 5);
  assert.equal(res.pakaLagna.lord, "Sun");
});

test("Hora Lagna & Ghati Lagna: Dhana-Raja Yoga formed when conjunct or in mutual aspect", () => {
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Moon: { rashiIndex: 1, degreeInSign: 15 },
    Mars: { rashiIndex: 4, degreeInSign: 12 },
    Mercury: { rashiIndex: 2, degreeInSign: 10 },
    Jupiter: { rashiIndex: 8, degreeInSign: 15 },
    Venus: { rashiIndex: 3, degreeInSign: 20 },
    Saturn: { rashiIndex: 10, degreeInSign: 5 },
  });

  const hlItem: SpecialLagnaItem = {
    key: "HL",
    name: "Hora Lagna",
    shortName: "HL",
    category: "wealth",
    sign: "Leo",
    signNum: 4,
    house: 5,
    longitude: 135,
    degreeText: "15° 00' Leo",
    lord: "Sun",
    meaning: "Financial inflow",
    interpretation: "Wealth instinct",
    actionPlan: ["Capital allocation"],
  };

  const glItem: SpecialLagnaItem = {
    key: "GL",
    name: "Ghati Lagna",
    shortName: "GL",
    category: "power",
    sign: "Leo",
    signNum: 4,
    house: 5,
    longitude: 135,
    degreeText: "15° 00' Leo",
    lord: "Sun",
    meaning: "Governmental authority",
    interpretation: "Power and status",
    actionPlan: ["Leadership"],
  };

  const alItem: SpecialLagnaItem = {
    key: "AL",
    name: "Arudha Lagna",
    shortName: "AL",
    category: "arudha",
    sign: "Aries",
    signNum: 0,
    house: 1,
    longitude: 15,
    degreeText: "15° 00' Aries",
    lord: "Mars",
    meaning: "Public perception",
    interpretation: "Image",
    actionPlan: ["Branding"],
  };

  const a10Item: SpecialLagnaItem = {
    key: "A10",
    name: "Rajya Pada",
    shortName: "A10",
    category: "arudha",
    sign: "Leo",
    signNum: 4,
    house: 5,
    longitude: 135,
    degreeText: "15° 00' Leo",
    lord: "Sun",
    meaning: "Career visibility",
    interpretation: "Fame in profession",
    actionPlan: ["Public office"],
  };

  const slItem: SpecialLagnaItem = {
    key: "SL",
    name: "Sree Lagna",
    shortName: "SL",
    category: "sree",
    sign: "Cancer",
    signNum: 3,
    house: 4,
    longitude: 105,
    degreeText: "15° 00' Cancer",
    lord: "Moon",
    meaning: "Lakshmi grace",
    interpretation: "Affluence flow",
    actionPlan: ["Devotion"],
  };

  const induLagna: InduLagnaAnalysis = {
    sign: "Cancer",
    signNum: 3,
    house: 4,
    lord: "Moon",
    degreeText: "10° Cancer",
    lagna9thLord: "Jupiter",
    lagna9thRays: 10,
    moon9thLord: "Jupiter",
    moon9thRays: 10,
    totalRays: 20,
    remainder: 8,
    occupants: ["Jupiter"],
    aspectingPlanets: [],
    kuberYogaTier: "Kuber Sovereign (Multi-Millionaire)",
    kuberYogaScore: 95,
    verdict: "Kuber Yoga active",
    classicalReference: "Varahamihira Brihat Jataka",
    upay: ["Chant Om Shreem Hreem"],
  };

  const yogas = evaluateSpecialLagnaRajayogas(hlItem, glItem, alItem, a10Item, slItem, induLagna, chart);
  const horaGhati = yogas.find((y) => y.name.includes("Hora-Ghati Dhana-Raja Yoga"));
  assert.ok(horaGhati, "Hora-Ghati yoga must be detected");
  assert.equal(horaGhati.isFormed, true);
  assert.equal(horaGhati.strength, "Supreme");

  const induChandra = yogas.find((y) => y.name.includes("Indu-Chandra Kuber Yoga"));
  assert.ok(induChandra, "Indu-Chandra Kuber Yoga must be detected when Indu Lagna has Moon or Jupiter");
  assert.equal(induChandra.isFormed, true);
});

test("Active Dasha Activation Radar: Triggers correct Special Lagnas", () => {
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Moon: { rashiIndex: 1, degreeInSign: 15 },
    Mars: { rashiIndex: 4, degreeInSign: 12 },
    Mercury: { rashiIndex: 2, degreeInSign: 10 },
    Jupiter: { rashiIndex: 8, degreeInSign: 15 },
    Venus: { rashiIndex: 3, degreeInSign: 20 },
    Saturn: { rashiIndex: 10, degreeInSign: 5 },
  });

  const res = calculateSpecialLagnas(chart);
  assert.ok(res.activeDashaActivation, "Dasha activation radar should be populated");
  assert.ok(res.activeDashaActivation.mahadashaLord, "Mahadasha lord should exist");
  assert.ok(res.activeDashaActivation.activatedLagnas.length > 0, "At least one lagna should be activated by MD/AD lord");
});

test("Human Storytelling Narrative: Generates rich, personalized mentor story", () => {
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Moon: { rashiIndex: 1, degreeInSign: 15 },
    Mars: { rashiIndex: 4, degreeInSign: 12 },
    Mercury: { rashiIndex: 2, degreeInSign: 10 },
    Jupiter: { rashiIndex: 8, degreeInSign: 15 },
    Venus: { rashiIndex: 3, degreeInSign: 20 },
    Saturn: { rashiIndex: 10, degreeInSign: 5 },
  });

  const res = calculateSpecialLagnas(chart);
  assert.ok(res.narrative, "Narrative object must exist");
  assert.ok(res.narrative.storyIntro.length > 50, "Intro must be rich");
  assert.ok(res.narrative.publicImageStory.includes("आरूढ़"), "Public image must reference Arudha");
  assert.ok(res.narrative.kuberWealthStory.includes("इंदु लग्न"), "Kuber story must reference Indu Lagna");
  assert.ok(res.narrative.marriageAndSanctuaryStory.includes("उपपद"), "Marriage story must reference Upapada");
  assert.ok(res.narrative.pakaLagnaStory.includes("पाक लग्न"), "Paka story must reference Paka Lagna");
  assert.ok(res.narrative.varnaAndCareerStory.includes("वर्णद लग्न"), "Varna story must reference Varnada Lagna");
  assert.ok(res.narrative.varnaAndCareerStory.includes("आजीविका"), "Varna story must discuss sustaining livelihood");
});

test("Varnada Lagna: Jaimini Upadesha Sutra Calculation & Archetype Classification", () => {
  // Test Case A: Odd Lagna (Aries=0, lagnaSign=1), Odd HL (Leo=4, hlSign=5)
  // A = 1, B = 5, both odd -> C = (1 + 5) % 12 = 6. Lagna odd -> count from Aries = 6 (Virgo)
  const chartOddOdd = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Jupiter: { rashiIndex: 3, degreeInSign: 15 }, // Cancer
  });
  const mockHlOdd: SpecialLagnaItem = {
    key: "HL",
    name: "Hora Lagna",
    shortName: "HL",
    category: "wealth",
    sign: "Leo",
    signNum: 4,
    house: 5,
    longitude: 130,
    degreeText: "10° 00'",
    lord: "Sun",
    meaning: "Wealth",
    interpretation: "",
    actionPlan: [],
  };

  const vlOddOdd = calculateVarnadaLagna(chartOddOdd, mockHlOdd);
  assert.equal(vlOddOdd.sign, "Virgo", "Odd Lagna (1) + Odd HL (5) -> C = 6 -> Virgo");
  assert.equal(vlOddOdd.varna, "Shudra (Execution & Craftsmanship)", "Virgo is Earth element");
  assert.equal(vlOddOdd.element, "Earth");
  // 11th from Virgo (sign 5) is sign 3 (Cancer, 10 ahead mod 12: (5+10)%12 = 3)
  assert.equal(vlOddOdd.sustainingHouse11thSign, "Cancer");
  assert.equal(vlOddOdd.isSpiritualOrTeacherBlessing, true, "Jupiter in Cancer blesses sustaining 11th house");

  // Test Case B: Odd Lagna (Aries=0, lagnaSign=1), Even HL (Taurus=1, hlSign=2)
  // A = 1. HL even -> B = 12 - 2 + 1 = 11.
  // One odd, one even -> C = |1 - 11| % 12 = 10.
  // Lagna odd -> count from Aries = 10 (Capricorn)
  const mockHlEven: SpecialLagnaItem = {
    ...mockHlOdd,
    sign: "Taurus",
    signNum: 1,
    house: 2,
    lord: "Venus",
  };
  const vlOddEven = calculateVarnadaLagna(chartOddOdd, mockHlEven);
  assert.equal(vlOddEven.sign, "Capricorn", "Odd Lagna (1) - Even HL (2 -> 11) -> C = 10 -> Capricorn");
  assert.equal(vlOddEven.varna, "Shudra (Execution & Craftsmanship)");

  // Test Case C: Even Lagna (Taurus=1, lagnaSign=2), Even HL (Taurus=1, hlSign=2)
  // Lagna even -> A = 12 - 2 + 1 = 11. HL even -> B = 11.
  // Both even -> C = (11 + 11) % 12 = 22 % 12 = 10.
  // Lagna even -> count from Pisces = 12 - 10 + 1 = 3 (Gemini)
  const chartEven = createMockChart(1, {
    Sun: { rashiIndex: 1, degreeInSign: 10 },
  });
  const vlEvenEven = calculateVarnadaLagna(chartEven, mockHlEven);
  assert.equal(vlEvenEven.sign, "Gemini", "Even Lagna (2) + Even HL (2) -> count backwards from Pisces -> Gemini");
  assert.equal(vlEvenEven.varna, "Vaishya (Commerce & Trade)");
  assert.equal(vlEvenEven.element, "Air");
});

test("Pranapada Lagna: Cellular Vitality and Respiration Anchor", () => {
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Jupiter: { rashiIndex: 0, degreeInSign: 12 },
  });

  const pp = calculatePranapadaLagna(10.0, 120.0, chart);
  assert.ok(pp.sign, "PP must produce a valid sign");
  assert.ok(pp.house >= 1 && pp.house <= 12, "PP must produce a valid house between 1 and 12");
  assert.ok(pp.vitalityStatus, "PP must assign vitality status");
  assert.ok(pp.pranaInterpretation.length > 20, "PP must produce informative prana interpretation");
});

test("Jaimini Supreme Triple Raja Yoga: Single Planet Aspects JL, HL, and GL", () => {
  // Setup: Chart where Saturn in Libra (6) aspects:
  // - Aries (0) via 7th aspect (opposition, diff=6)
  // - Cancer (3) via 10th aspect (diff=9)
  // - Sagittarius (8) via 3rd aspect (diff=2)
  const chart = createMockChart(0, { // JL = Aries (0)
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Saturn: { rashiIndex: 6, degreeInSign: 15 }, // Libra
  });

  // HL in Cancer (3) [aspect by Saturn 10th], GL in Aries (0) [aspect by Saturn 7th]
  const hlItem: SpecialLagnaItem = {
    key: "HL",
    name: "Hora Lagna",
    shortName: "HL",
    category: "wealth",
    sign: "Cancer",
    signNum: 3,
    house: 4,
    longitude: 105,
    degreeText: "15° 00'",
    lord: "Moon",
    meaning: "Liquid wealth",
    interpretation: "",
    actionPlan: [],
  };

  const glItem: SpecialLagnaItem = {
    key: "GL",
    name: "Ghati Lagna",
    shortName: "GL",
    category: "power",
    sign: "Aries",
    signNum: 0,
    house: 1,
    longitude: 15,
    degreeText: "15° 00'",
    lord: "Mars",
    meaning: "Power",
    interpretation: "",
    actionPlan: [],
  };

  const alItem: SpecialLagnaItem = { ...glItem, key: "AL", name: "Arudha Lagna", shortName: "AL" };
  const a10Item: SpecialLagnaItem = { ...glItem, key: "A10", name: "Rajya Pada", shortName: "A10" };
  const slItem: SpecialLagnaItem = { ...glItem, key: "SL", name: "Sree Lagna", shortName: "SL" };

  const induLagna: InduLagnaAnalysis = {
    sign: "Leo",
    signNum: 4,
    house: 5,
    lord: "Sun",
    degreeText: "10° 00'",
    lagna9thLord: "Jupiter",
    lagna9thRays: 10,
    moon9thLord: "Jupiter",
    moon9thRays: 10,
    totalRays: 20,
    remainder: 8,
    occupants: [],
    aspectingPlanets: [],
    kuberYogaTier: "High Affluence & Prosperity",
    kuberYogaScore: 80,
    verdict: "",
    classicalReference: "",
    upay: [],
  };

  const yogas = evaluateSpecialLagnaRajayogas(hlItem, glItem, alItem, a10Item, slItem, induLagna, chart);
  const tripleYoga = yogas.find((y) => y.name.includes("Triple Raja Yoga"));
  assert.ok(tripleYoga, "Triple Raja Yoga must be registered in the synthesizer");
  assert.equal(tripleYoga.isFormed, true, "Saturn connecting JL, HL, and GL must activate Supreme Triple Raja Yoga");
  assert.equal(tripleYoga.strength, "Supreme");
});

test("Upapada Special Rules: 2nd from UL, 7th from UL, and UL in 12th from AL", () => {
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 10 },
    Jupiter: { rashiIndex: 4, degreeInSign: 15 }, // Leo
    Venus: { rashiIndex: 9, degreeInSign: 20 },   // Capricorn
  });

  // AL = Aries (0), UL = Pisces (11) -> UL is 12th from AL!
  const alItem: SpecialLagnaItem = {
    key: "AL",
    name: "Arudha Lagna",
    shortName: "AL",
    category: "arudha",
    sign: "Aries",
    signNum: 0,
    house: 1,
    longitude: 15,
    degreeText: "15° 00'",
    lord: "Mars",
    meaning: "Public image",
    interpretation: "",
    actionPlan: [],
  };

  const ulItem: SpecialLagnaItem = {
    key: "UL",
    name: "Upapada Lagna",
    shortName: "UL",
    category: "arudha",
    sign: "Pisces",
    signNum: 11,
    house: 12,
    longitude: 345,
    degreeText: "15° 00'",
    lord: "Jupiter",
    meaning: "Marriage reality",
    interpretation: "",
    actionPlan: [],
  };

  const synastry = evaluateAlUlSynastry(alItem, ulItem, chart);
  assert.equal(synastry.isUlIn12thFromAl, true, "UL in Pisces (11) from AL in Aries (0) is in 12th house (distance 12)");
  assert.equal(synastry.secondFromUlSign, "Aries", "2nd from Pisces is Aries");
  assert.equal(synastry.seventhFromUlSign, "Virgo", "7th from Pisces is Virgo");
  assert.ok(synastry.maritalWealthInsight.length > 10);
  assert.ok(synastry.spouseNatureInsight.length > 10);
});

// ==============================================================================
// ── THE 6 GOLDEN WORKSHOP BENCHMARK TEST SUITE ────────────────────────────────
// ==============================================================================

test("TC001: Workshop Case Robin Ji (Uttarakhand) — Moon AK, Sun AmK, Saturn GK in 12th", () => {
  // Robin Ji: Tehri Garhwal, Leo Navamsha Moon AK (25°43'), Sun AmK in 12th, Saturn GK in 12th, Venus DK in 11th
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 11, degreeInSign: 20 },   // 12th house from Aries
    Moon: { rashiIndex: 4, degreeInSign: 25.7 },  // AK Leo
    Saturn: { rashiIndex: 11, degreeInSign: 13 }, // GK in 12th house
    Venus: { rashiIndex: 10, degreeInSign: 7 },   // DK in 11th house
  });

  const res = calculateSpecialLagnas(chart);
  assert.ok(res.varnadaLagna, "Varnada Lagna must be calculated");
  assert.ok(res.pranapadaLagna, "Pranapada Lagna must be calculated");
  assert.ok(res.narrative.varnaAndCareerStory.length > 50, "Robin Ji narrative must include detailed vocation guidance");
});

test("TC002: Workshop Case Pooja Ji (Kolkata) — Pisces Lagna, Sun AK, Jupiter AmK in 11th, Moon GK in 12th", () => {
  // Pooja Ji: Pisces Lagna (11), Sun AK (highest degree), Jupiter AmK in 11th (Capricorn), Moon GK in 12th (Aquarius)
  const chart = createMockChart(11, { // Pisces
    Sun: { rashiIndex: 4, degreeInSign: 28 },      // AK
    Jupiter: { rashiIndex: 9, degreeInSign: 22 },  // 11th house (Capricorn)
    Moon: { rashiIndex: 10, degreeInSign: 14 },    // 12th house (Aquarius)
    Mercury: { rashiIndex: 3, degreeInSign: 5 },   // DK
  });

  const res = calculateSpecialLagnas(chart);
  assert.equal(res.induLagna.lord, "Moon", "9th from Pisces is Scorpio (Mars=6), 9th from Moon (Aquarius) is Libra (Venus=12), total 18 % 12 = 6 -> Cancer (Moon)");
  assert.ok(res.induLagna.kuberYogaScore > 0);
  assert.ok(res.varnadaLagna.varna, "Varnada must assign proper Varna");
});

test("TC003: Workshop Case Deepak Arya Ji (Ajmer) — Virgo Lagna, Saturn AK, Jupiter AmK, Moon GK", () => {
  // Deepak Arya Ji: Virgo Lagna (5), Saturn AK, Jupiter AmK (17°), Moon GK (13°), Mercury DK (5°)
  const chart = createMockChart(5, { // Virgo
    Saturn: { rashiIndex: 1, degreeInSign: 24 },   // Taurus
    Jupiter: { rashiIndex: 8, degreeInSign: 17 },  // Sagittarius
    Moon: { rashiIndex: 4, degreeInSign: 13 },     // Leo
    Mercury: { rashiIndex: 7, degreeInSign: 5 },   // Scorpio
  });

  const res = calculateSpecialLagnas(chart);
  assert.ok(res.rajayogas.length >= 4, "Must synthesize all classical yogas");
  assert.ok(res.alUlSynastry.verdict, "Must assess persona vs marriage reality");
});

test("TC004: Workshop Case Harikesh Nath Ji (Assam) — Taurus Lagna, Apasavya Chara Dasha Order", () => {
  // Harikesh Nath Ji: Taurus Lagna (1), Even sign -> Apasavya Jaimini progression
  const chart = createMockChart(1, { // Taurus
    Sun: { rashiIndex: 5, degreeInSign: 6 },
    Jupiter: { rashiIndex: 4, degreeInSign: 18 },
    Saturn: { rashiIndex: 9, degreeInSign: 12 },
  });

  const res = calculateSpecialLagnas(chart);
  assert.equal(res.bhavaLagna.house >= 1 && res.bhavaLagna.house <= 12, true);
  assert.ok(res.narrative.publicImageStory.includes("आरूढ़"));
});

test("TC005: Workshop Case Vikram Mittal Ji — Sun AK (Name & Character), Mars GK (Debts & Body)", () => {
  // Vikram Mittal Ji: Sun AK, Mars GK
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 27 },   // Aries Exalted Sun AK
    Mars: { rashiIndex: 7, degreeInSign: 20 },  // Scorpio Mars GK
    Venus: { rashiIndex: 11, degreeInSign: 15 }, // Pisces Exalted Venus
  });

  const res = calculateSpecialLagnas(chart);
  assert.ok(res.varnadaLagna.actionGuidance.length >= 2);
  assert.ok(res.pranapadaLagna.vitalityStatus);
});

test("TC006: Workshop Case Sachchidanand Ji (Basti, UP) — Taurus Lagna, Moon 2nd & 9th, Saturn 8th & 9th", () => {
  // Sachchidanand Ji: Taurus Lagna (1), Moon active in 2nd/9th, Saturn 8th/9th
  const chart = createMockChart(1, { // Taurus
    Moon: { rashiIndex: 2, degreeInSign: 12 },   // Gemini (2nd house)
    Saturn: { rashiIndex: 8, degreeInSign: 14 }, // Sagittarius (8th house)
    Jupiter: { rashiIndex: 9, degreeInSign: 10 }, // Capricorn (9th house)
  });

  const res = calculateSpecialLagnas(chart);
  assert.ok(res.induLagna.verdict, "Indu Lagna verdict populated");
  assert.ok(res.varnadaLagna.sustainingHouse11thSign, "11th from VL computed");
});



