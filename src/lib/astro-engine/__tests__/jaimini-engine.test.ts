import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateKarakas,
  calculateArudhas,
  getJaiminiAspects,
  doesSignAspect,
  isAdjacentSign,
  calculateCharaDasha,
  getCharaDashaDirection,
  charaDashaYears,
  getNavamshaSignNum,
  calculateKarakamsha,
  evaluateGkAnalysis,
  evaluateBkAnalysis,
  evaluateDkAnalysis,
  evaluateAkAmkAnalysis,
  evaluateRetrogrades,
  buildJaiminiChart,
  GK_HOUSE_PROBLEMS,
  GK_PLANET_REMEDIES,
  DK_SPOUSE_PERSONAS,
  AK_SOUL_ATTRIBUTES,
  AK_HOUSE_SPHERES,
  AMK_HOUSE_WEALTH_CHANNELS,
} from "../jaimini";
import type { ChartData } from "../calculations";

// Helper to construct mock ChartData
function createMockChart(
  lagnaRashiIndex: number, // 0 to 11
  planetPositions: Record<string, { rashiIndex: number; degreeInSign: number; isRetrograde?: boolean }>,
  dob: string = "1990-01-01",
  tob: string = "12:00"
): ChartData {
  const lagnaLon = lagnaRashiIndex * 30 + 15;
  const planets: ChartData["planets"] = {};

  for (const [name, pos] of Object.entries(planetPositions)) {
    const lon = pos.rashiIndex * 30 + pos.degreeInSign;
    planets[name] = {
      lon,
      speed: 1,
      isRetrograde: Boolean(pos.isRetrograde),
      house: ((pos.rashiIndex - lagnaRashiIndex + 12) % 12) + 1,
    };
  }

  return {
    name: "Test Native",
    dob,
    tob,
    lat: 28.6139,
    lon: 77.209,
    tz: 5.5,
    lagnaLon,
    lagnaRashi: [
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ][lagnaRashiIndex],
    planets,
    houses: Array.from({ length: 12 }, (_, i) => ((lagnaRashiIndex + i) % 12) * 30),
    nakshatras: {},
  };
}

test("Jaimini: 7 Chara Karakas strictly exclude Rahu & Ketu and rank by degree in sign", () => {
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 4, degreeInSign: 28.5 },      // 1st highest -> AK
    Mercury: { rashiIndex: 5, degreeInSign: 25.2 },  // 2nd highest -> AmK
    Mars: { rashiIndex: 0, degreeInSign: 22.1 },     // 3rd highest -> BK
    Moon: { rashiIndex: 3, degreeInSign: 15.4 },     // 4th highest -> MK
    Venus: { rashiIndex: 1, degreeInSign: 12.8 },    // 5th highest -> PK
    Saturn: { rashiIndex: 9, degreeInSign: 8.3 },    // 6th highest -> GK
    Jupiter: { rashiIndex: 8, degreeInSign: 5.1 },   // 7th lowest  -> DK
    Rahu: { rashiIndex: 10, degreeInSign: 29.9 },    // SHOULD BE IGNORED
    Ketu: { rashiIndex: 4, degreeInSign: 29.9 },     // SHOULD BE IGNORED
  });

  const karakas = calculateKarakas(chart.planets);

  assert.equal(karakas.length, 7);
  assert.equal(karakas[0].role, "AK");
  assert.equal(karakas[0].planet, "Sun");
  assert.equal(karakas[1].role, "AmK");
  assert.equal(karakas[1].planet, "Mercury");
  assert.equal(karakas[2].role, "BK");
  assert.equal(karakas[2].planet, "Mars");
  assert.equal(karakas[3].role, "MK");
  assert.equal(karakas[3].planet, "Moon");
  assert.equal(karakas[4].role, "PK");
  assert.equal(karakas[4].planet, "Venus");
  assert.equal(karakas[5].role, "GK");
  assert.equal(karakas[5].planet, "Saturn");
  assert.equal(karakas[6].role, "DK");
  assert.equal(karakas[6].planet, "Jupiter");

  assert.ok(!karakas.some(k => k.planet === "Rahu" || k.planet === "Ketu"));
});

test("RULE A: Karakamsha Kundali (D9 Navamsha Base, D1 Planets as-is)", () => {
  // AK is Moon at Pisces (sign 11) 24°
  // 11 * 30 + 24 = 354°. In Navamsha, 354° falls in Aquarius (sign 10).
  const chart = createMockChart(0, {
    Moon: { rashiIndex: 11, degreeInSign: 24.0 },   // AK -> D9 is Aquarius (10)
    Sun: { rashiIndex: 4, degreeInSign: 20.0 },     // Sun in Leo (D1 sign 4)
    Mercury: { rashiIndex: 5, degreeInSign: 15.0 }, // Mercury in Virgo (D1 sign 5)
    Mars: { rashiIndex: 0, degreeInSign: 12.0 },
    Jupiter: { rashiIndex: 8, degreeInSign: 9.0 },
    Venus: { rashiIndex: 1, degreeInSign: 6.0 },
    Saturn: { rashiIndex: 9, degreeInSign: 3.0 },
  });

  const karakas = calculateKarakas(chart.planets);
  const kk = calculateKarakamsha(chart, karakas);

  assert.equal(kk.akPlanet, "Moon");
  assert.equal(kk.d9Sign, "Aquarius");
  assert.equal(kk.karakamshaLagna, "Aquarius");

  // Karakamsha Lagna is Aquarius (sign 10).
  // House 1 from Karakamsha: Aquarius (sign 10)
  assert.equal(kk.houses[0].house, 1);
  assert.equal(kk.houses[0].sign, "Aquarius");

  // House 7 from Karakamsha: Leo (sign 4). Sun is in Leo in D1!
  assert.equal(kk.houses[6].house, 7);
  assert.equal(kk.houses[6].sign, "Leo");
  assert.deepEqual(kk.houses[6].planets, ["Sun"]); // D1 planet stayed in D1 sign!

  // House 8 from Karakamsha: Virgo (sign 5). Mercury is in Virgo in D1!
  assert.equal(kk.houses[7].house, 8);
  assert.equal(kk.houses[7].sign, "Virgo");
  assert.deepEqual(kk.houses[7].planets, ["Mercury"]);
});

test("RULE B: GK Adjacent Sign Rule (Adjacent sign protected from GK aspect)", () => {
  // GK is Saturn in Taurus (sign 1, stable).
  // Aries (sign 0, movable) is ADJACENT to Taurus (1).
  // Cancer (sign 3), Libra (sign 6), Capricorn (sign 9) receive aspect.
  // Aries (0) MUST NOT receive aspect from Taurus (1)!
  assert.ok(isAdjacentSign(1, 0));
  assert.ok(!doesSignAspect(1, 0)); // Adjacent sign aspect is false!
  assert.ok(doesSignAspect(1, 3));  // Cancer is aspected
  assert.ok(doesSignAspect(1, 6));  // Libra is aspected
  assert.ok(doesSignAspect(1, 9));  // Capricorn is aspected

  const chart = createMockChart(0, {
    Sun: { rashiIndex: 4, degreeInSign: 28.0 },
    Moon: { rashiIndex: 0, degreeInSign: 25.0 },     // Moon in Aries (ADJACENT to GK)
    Mars: { rashiIndex: 6, degreeInSign: 20.0 },     // Mars in Libra (ASPECTED by GK)
    Mercury: { rashiIndex: 5, degreeInSign: 16.0 },
    Jupiter: { rashiIndex: 8, degreeInSign: 12.0 },
    Saturn: { rashiIndex: 1, degreeInSign: 8.0 },    // GK Saturn in Taurus (1)
    Venus: { rashiIndex: 10, degreeInSign: 4.0 },
  });

  const jaimini = buildJaiminiChart(chart);
  const gk = jaimini.gkAnalysis;

  // Moon in Aries should be marked as adjacent protected!
  const moonAffliction = gk.afflictedPlanets.find(p => p.planet === "Moon");
  assert.ok(moonAffliction?.isAdjacentProtected);

  // Mars in Libra should be marked as truly aspected
  const marsAffliction = gk.afflictedPlanets.find(p => p.planet === "Mars");
  assert.equal(marsAffliction?.isAdjacentProtected, false);
  assert.ok(marsAffliction?.effect.includes("Accident") || marsAffliction?.effect.includes("BP"));
});

test("RULE C: GK = Lagna Lord Rule (Whole life problem diagnosis)", () => {
  // Cancer Lagna (sign 3). Lagna Lord is Moon.
  // Moon is also GK (2nd lowest degree).
  const chart = createMockChart(3, { // 3 = Cancer Lagna
    Sun: { rashiIndex: 0, degreeInSign: 28.0 },
    Mars: { rashiIndex: 1, degreeInSign: 24.0 },
    Mercury: { rashiIndex: 2, degreeInSign: 20.0 },
    Jupiter: { rashiIndex: 4, degreeInSign: 16.0 },
    Saturn: { rashiIndex: 5, degreeInSign: 12.0 },
    Moon: { rashiIndex: 3, degreeInSign: 8.0 },     // Moon is GK (and Cancer Lagna Lord!)
    Venus: { rashiIndex: 6, degreeInSign: 4.0 },
  });

  const jaimini = buildJaiminiChart(chart);
  const gk = jaimini.gkAnalysis;

  assert.equal(gk.isGkLagnaLord, true);
  assert.ok(gk.gkLagnaLordDiagnosis?.includes("CRITICAL: GK IS THE LAGNA LORD"));
});

test("RULE D: AK + AmK Pinnacle Rajayoga (Conjunction/Aspect in Good Houses unblemished by GK)", () => {
  const chart = createMockChart(0, { // Aries Lagna
    Jupiter: { rashiIndex: 8, degreeInSign: 28.0 }, // AK Jupiter in Sag (sign 8, House 9!)
    Mercury: { rashiIndex: 8, degreeInSign: 25.0 }, // AmK Mercury in Sag (sign 8, House 9!)
    Sun: { rashiIndex: 4, degreeInSign: 20.0 },
    Mars: { rashiIndex: 0, degreeInSign: 16.0 },
    Moon: { rashiIndex: 3, degreeInSign: 12.0 },
    Saturn: { rashiIndex: 1, degreeInSign: 8.0 },   // GK Saturn in Taurus (1)
    Venus: { rashiIndex: 10, degreeInSign: 4.0 },
  });

  const jaimini = buildJaiminiChart(chart);
  const akAmk = jaimini.akAmkAnalysis;

  assert.equal(akAmk.isRajayoga, true);
  assert.equal(akAmk.isGkAspectingRajayoga, false);
  assert.equal(akAmk.rajayogaTier, "Pinnacle Unblemished");
  assert.ok(akAmk.rajayogaDescription.includes("Pinnacle Jaimini Raja Yoga"));
});

test("RULE E: Retrograde Planet Activation Guidance", () => {
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 28.0 },
    Mercury: { rashiIndex: 1, degreeInSign: 24.0, isRetrograde: true }, // Retro Mercury
    Jupiter: { rashiIndex: 2, degreeInSign: 20.0, isRetrograde: true }, // Retro Jupiter
    Mars: { rashiIndex: 3, degreeInSign: 16.0 },
    Moon: { rashiIndex: 4, degreeInSign: 12.0 },
    Saturn: { rashiIndex: 5, degreeInSign: 8.0 },
    Venus: { rashiIndex: 6, degreeInSign: 4.0 },
  });

  const retrogrades = evaluateRetrogrades(chart);
  assert.equal(retrogrades.length, 2);

  const retroMerc = retrogrades.find(r => r.planet === "Mercury");
  assert.ok(retroMerc?.guidance.includes("Super intelligent"));

  const retroJup = retrogrades.find(r => r.planet === "Jupiter");
  assert.ok(retroJup?.guidance.includes("Vast reservoir of intuitive wisdom"));
});

test("RULE F: Chara Dasha Exact Duration (Count - 1, Max 12, Min 1)", () => {
  // Taurus (sign 1, Savya). Lord Venus is in Virgo (sign 5, count 5).
  // Duration: 5 - 1 = 4 years! (Matches transcript: "2 se 6 tak = 5 houses, minus_1: 5 - 1 = 4 saal")
  const planets: ChartData["planets"] = {
    Venus: { lon: 5 * 30 + 10, speed: 1, isRetrograde: false, house: 5 },
  };
  const years = charaDashaYears(1, planets); // 1 = Taurus
  assert.equal(years, 4);

  // Own sign lord gets full 12 years (Max: 12)
  const ownSignPlanets: ChartData["planets"] = {
    Venus: { lon: 1 * 30 + 10, speed: 1, isRetrograde: false, house: 1 },
  };
  const ownYears = charaDashaYears(1, ownSignPlanets);
  assert.equal(ownYears, 12);
});

test("RULE G: Savya / Apasavya 9th House Confirmation (Virgo Lagna -> Taurus 9th -> Clockwise)", () => {
  // Virgo is sign 5 (6th sign). Count 9 signs forward: 5 + 8 = 13 % 12 = 1 (Taurus).
  // Taurus is Savya -> Direction is Clockwise (Savya)!
  const dir = getCharaDashaDirection(5); // 5 = Virgo
  assert.equal(dir.direction, "Savya");
  assert.equal(dir.isDirect, true);
  assert.equal(dir.ninthSignNum, 1); // Taurus
});

test("RULE J: BK Problem Evaluation (BK in Dusthana + Aspected by GK)", () => {
  // Aries Lagna (0). GK is Saturn in Taurus (sign 1).
  // Taurus (fixed) aspects Cancer (3), Libra (6), Capricorn (9).
  // Libra (sign 6) is House 7 from Aries.
  // Cancer (sign 3) is House 4.
  // Capricorn (sign 9) is House 10.
  // What if BK Mars is in 6th house (Virgo, sign 5)?
  // What if GK is Aries (0, movable) which aspects Leo (4), Scorpio (7), Aquarius (10)?
  // Let GK be in Aries (0).
  // Scorpio (7, 8th house from Aries!) receives aspect from Aries (0)!
  // If BK is in Scorpio (7, 8th house from Aries) -> BK is in Dusthana (8th) AND receives aspect from GK (0)!
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 4, degreeInSign: 28.0 },
    Moon: { rashiIndex: 1, degreeInSign: 24.0 },
    Mars: { rashiIndex: 7, degreeInSign: 20.0 },     // BK Mars in Scorpio (8th house!)
    Mercury: { rashiIndex: 2, degreeInSign: 16.0 },
    Jupiter: { rashiIndex: 3, degreeInSign: 12.0 },
    Saturn: { rashiIndex: 0, degreeInSign: 8.0 },    // GK Saturn in Aries (0, movable)
    Venus: { rashiIndex: 11, degreeInSign: 4.0 },
  });

  const jaimini = buildJaiminiChart(chart);
  const bk = jaimini.bkAnalysis;

  assert.equal(bk.bkPlanet, "Mars");
  assert.equal(bk.bkHouseFromLagna, 8);
  assert.equal(bk.isInDusthana, true);
  assert.equal(bk.isAfflictedByGk, true);
  assert.equal(bk.isBkProblemActive, true);
  assert.ok(bk.warning?.includes("BK AFFLICTION"));
});

test("RULE K: DK Details (DK in Dusthana or aspected by GK triggers warning)", () => {
  // Chart where DK Venus is in 12th house (Pisces, sign 11) for Aries Lagna
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 28.0 },
    Moon: { rashiIndex: 1, degreeInSign: 24.0 },
    Mars: { rashiIndex: 2, degreeInSign: 20.0 },
    Mercury: { rashiIndex: 3, degreeInSign: 16.0 },
    Jupiter: { rashiIndex: 4, degreeInSign: 12.0 },
    Saturn: { rashiIndex: 5, degreeInSign: 8.0 },
    Venus: { rashiIndex: 11, degreeInSign: 4.0 },   // DK in 12th house!
  });

  const jaimini = buildJaiminiChart(chart);
  const dk = jaimini.dkAnalysis;

  assert.equal(dk.hasDkObstacle, true);
  assert.ok(dk.dkObstacleWarning?.includes("DK CAUTION"));
});

test("RULE L: AK Life Sphere ('Us House Ke Bahar Life Nahi Ja Sakti') & AmK Wealth Gateway ('Wahan Se Paisa Aayega')", () => {
  // Aries Lagna (0). AK Jupiter in 5th house (Leo, sign 4). AmK Mercury in 2nd house (Taurus, sign 1).
  const chart = createMockChart(0, {
    Jupiter: { rashiIndex: 4, degreeInSign: 28.0 }, // AK in 5th house!
    Mercury: { rashiIndex: 1, degreeInSign: 24.0 }, // AmK in 2nd house!
    Sun: { rashiIndex: 0, degreeInSign: 20.0 },
    Mars: { rashiIndex: 6, degreeInSign: 16.0 },
    Moon: { rashiIndex: 3, degreeInSign: 12.0 },
    Saturn: { rashiIndex: 8, degreeInSign: 8.0 },
    Venus: { rashiIndex: 10, degreeInSign: 4.0 },
  });

  const jaimini = buildJaiminiChart(chart);
  const akAmk = jaimini.akAmkAnalysis;

  // Verify AK Life Sphere (House 5: Children, brain, advisory counsel)
  assert.equal(akAmk.akHouseFromLagna, 5);
  assert.ok(akAmk.akLifeSphere.title.includes("5th House"));
  assert.ok(akAmk.akLifeSphere.transcriptRule.includes("Us house ke bahar life nahi ja sakti"));
  assert.ok(akAmk.akLifeSphere.focus.includes("children"));

  // Verify AmK Wealth Gateway (House 2: Family enterprise, speech, banking, savings)
  assert.equal(akAmk.amkHouseFromLagna, 2);
  assert.ok(akAmk.amkWealthChannel.source.includes("Family Enterprise"));
  assert.ok(akAmk.amkWealthChannel.channel.includes("family trade"));
  assert.ok(akAmk.amkWealthChannel.practicalField.includes("Banking"));
});

test("RULE M: Supreme Teacher / Saraswati Rajayoga (AK & AmK in Dual Signs, Both Retro, Mutual Aspect, GK Untouched)", () => {
  // Dual signs: Gemini (2), Virgo (5), Sagittarius (8), Pisces (11)
  // Both retrograde! Mutual aspect between dual signs in Jaimini!
  // GK in sign 0 (Aries - movable, aspects Leo 4, Scorpio 7, Aquarius 10 - NO aspect on dual signs!)
  const chart = createMockChart(0, { // Aries Lagna
    Jupiter: { rashiIndex: 8, degreeInSign: 28.0, isRetrograde: true }, // AK Retro Jupiter in Sagittarius (dual)
    Mercury: { rashiIndex: 2, degreeInSign: 25.0, isRetrograde: true }, // AmK Retro Mercury in Gemini (dual)
    Sun: { rashiIndex: 4, degreeInSign: 20.0 },
    Mars: { rashiIndex: 6, degreeInSign: 16.0 },
    Moon: { rashiIndex: 3, degreeInSign: 12.0 },
    Saturn: { rashiIndex: 0, degreeInSign: 8.0 },                       // GK Saturn in Aries (movable)
    Venus: { rashiIndex: 10, degreeInSign: 4.0 },
  });

  const jaimini = buildJaiminiChart(chart);
  const akAmk = jaimini.akAmkAnalysis;

  assert.equal(akAmk.isSupremeTeacherYoga, true);
  assert.equal(akAmk.rajayogaTier, "Supreme Teacher Yoga");
  assert.ok(akAmk.rajayogaDescription.includes("SUPREME TEACHER / SARASWATI RAJAYOGA"));
  assert.ok(akAmk.rajayogaDescription.includes("Aap jaisa teacher/guru koi nahi hoga"));
});

test("RULE N: AK Planet-Specific Physical & Personality Clues", () => {
  // Test Sun AK traits
  assert.ok(AK_SOUL_ATTRIBUTES.Sun.traits.some(t => t.includes("Chehra pita")));
  assert.ok(AK_SOUL_ATTRIBUTES.Sun.traits.some(t => t.includes("aukaat & self-respect")));

  // Test Jupiter AK traits
  assert.ok(AK_SOUL_ATTRIBUTES.Jupiter.traits.some(t => t.includes("Granth Kanth")));
  assert.ok(AK_SOUL_ATTRIBUTES.Jupiter.traits.some(t => t.includes("Ek word pakad kar poori kitaab")));
  assert.ok(AK_SOUL_ATTRIBUTES.Jupiter.traits.some(t => t.includes("Badi naak = zyada gyaan")));
  assert.ok(AK_SOUL_ATTRIBUTES.Jupiter.traits.some(t => t.includes("100% purity")));

  // Test Venus AK traits
  assert.ok(AK_SOUL_ATTRIBUTES.Venus.traits.some(t => t.includes("Ek hi baat, solid baat")));

  // Test Saturn AK traits
  assert.ok(AK_SOUL_ATTRIBUTES.Saturn.traits.some(t => t.includes("Extreme punctuality")));
  assert.ok(AK_SOUL_ATTRIBUTES.Saturn.traits.some(t => t.includes("kachhue ki tarah slow but steady")));
});

