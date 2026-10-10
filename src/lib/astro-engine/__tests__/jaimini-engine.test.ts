import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateKarakas,
  calculateArudhas,
  getJaiminiAspects,
  doesSignAspect,
  calculateCharaDasha,
  getCharaDashaDirection,
  charaDashaYears,
  calculateKarakamsha,
  evaluateGkAnalysis,
  evaluateDkAnalysis,
  evaluateAkAmkAnalysis,
  buildJaiminiChart,
  GK_HOUSE_PROBLEMS,
  GK_PLANET_REMEDIES,
  DK_SPOUSE_PERSONAS,
  AK_SOUL_ATTRIBUTES,
} from "../jaimini";
import type { ChartData } from "../calculations";

// Helper to construct mock ChartData
function createMockChart(
  lagnaRashiIndex: number, // 0 to 11
  planetPositions: Record<string, { rashiIndex: number; degreeInSign: number }>,
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
      isRetrograde: false,
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

  // Verify none are Rahu or Ketu
  assert.ok(!karakas.some(k => k.planet === "Rahu" || k.planet === "Ketu"));
});

test("Benchmark Test Case: Vikram Mittal ji (AK Sun, GK Mars, Venus remedies)", () => {
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 4, degreeInSign: 28.2 },     // AK Sun
    Mercury: { rashiIndex: 4, degreeInSign: 24.0 }, // AmK
    Jupiter: { rashiIndex: 8, degreeInSign: 20.0 }, // BK
    Moon: { rashiIndex: 3, degreeInSign: 17.5 },    // MK
    Saturn: { rashiIndex: 9, degreeInSign: 14.1 },   // PK
    Mars: { rashiIndex: 0, degreeInSign: 8.4 },     // GK Mars (debt, body, property)
    Venus: { rashiIndex: 1, degreeInSign: 4.2 },    // DK Venus
  });

  const jaimini = buildJaiminiChart(chart);

  // 1. Verify AK Sun
  const ak = jaimini.karakas.find(k => k.role === "AK");
  assert.equal(ak?.planet, "Sun");
  assert.ok(ak?.notes.includes("character"));

  // 2. Verify GK Mars
  const gk = jaimini.gkAnalysis;
  assert.equal(gk.gkPlanet, "Mars");
  assert.equal(gk.gkHouseFromLagna, 1); // Mars in Aries (Lagna)
  assert.ok(gk.houseProblem.includes("Bimariyan") || gk.houseProblem.includes("health"));

  // Verify GK Mars Remedies contain North-East Panchmukhi Hanuman & Gym
  const remediesText = gk.remedies.join(" ");
  assert.ok(remediesText.includes("Panchmukhi Hanuman"));
  assert.ok(remediesText.includes("gym"));

  // 3. Verify Venus remedies in knowledge base (kitchen sink curd, perfume donate)
  const venusRemedies = GK_PLANET_REMEDIES.Venus.join(" ");
  assert.ok(venusRemedies.includes("dahi"));
  assert.ok(venusRemedies.includes("sink"));
  assert.ok(venusRemedies.includes("perfume") || venusRemedies.includes("itra"));
});

test("Benchmark Test Case: Uday ji (Libra Lagna -> Apasavya 7,6,5,4,3,2,1,12,11,10,9,8; AK Jupiter)", () => {
  const chart = createMockChart(6, { // 6 = Libra
    Jupiter: { rashiIndex: 8, degreeInSign: 27.5 }, // AK Jupiter
    Sun: { rashiIndex: 4, degreeInSign: 24.1 },
    Mars: { rashiIndex: 0, degreeInSign: 21.0 },
    Mercury: { rashiIndex: 5, degreeInSign: 16.2 },
    Moon: { rashiIndex: 3, degreeInSign: 12.0 },
    Saturn: { rashiIndex: 9, degreeInSign: 8.5 },
    Venus: { rashiIndex: 6, degreeInSign: 3.1 },
  });

  // Verify direction calculation for Libra (6)
  const dirInfo = getCharaDashaDirection(6);
  assert.equal(dirInfo.direction, "Apasavya");
  assert.equal(dirInfo.isDirect, false);

  const jaimini = buildJaiminiChart(chart);

  // Verify Chara Dasha sequence: 7, 6, 5, 4, 3, 2, 1, 12, 11, 10, 9, 8
  // 0-indexed: [6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7]
  const expectedSigns = [
    "Libra", "Virgo", "Leo", "Cancer", "Gemini", "Taurus",
    "Aries", "Pisces", "Aquarius", "Capricorn", "Sagittarius", "Scorpio"
  ];

  const actualSigns = jaimini.charaDasha.map(d => d.sign);
  assert.deepEqual(actualSigns, expectedSigns);

  // Verify AK is Jupiter
  assert.equal(jaimini.karakamsha.akPlanet, "Jupiter");
  assert.ok(jaimini.karakamsha.staticAnalysis.soulPurpose.includes("Solution Provider") || jaimini.karakamsha.staticAnalysis.soulPurpose.includes("Wisdom"));
});

test("Chara Dasha Duration: Scorpio lord Mars in 5th gives 5 years", () => {
  // Scorpio (sign 7). Mars in Pisces (sign 11, which is 5th house from Scorpio).
  const planets: ChartData["planets"] = {
    Mars: { lon: 11 * 30 + 10, speed: 1, isRetrograde: false, house: 5 },
  };

  const years = charaDashaYears(7, planets); // 7 = Scorpio
  assert.equal(years, 5);
});

test("Karakamsha Kundali: Correctly sets AK as Lagna and builds 12 houses", () => {
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 4, degreeInSign: 26.0 }, // Sun in Leo (sign 4) is AK
    Moon: { rashiIndex: 3, degreeInSign: 22.0 },
    Mars: { rashiIndex: 0, degreeInSign: 18.0 },
    Mercury: { rashiIndex: 5, degreeInSign: 15.0 }, // in Virgo (sign 5) -> 2nd from Karakamsha
    Jupiter: { rashiIndex: 8, degreeInSign: 12.0 },
    Venus: { rashiIndex: 10, degreeInSign: 9.0 },   // in Aquarius (sign 10) -> 7th from Karakamsha
    Saturn: { rashiIndex: 1, degreeInSign: 5.0 },   // in Taurus (sign 1) -> 10th from Karakamsha
  });

  const karakas = calculateKarakas(chart.planets);
  const kk = calculateKarakamsha(chart, karakas);

  assert.equal(kk.akPlanet, "Sun");
  assert.equal(kk.karakamshaLagna, "Leo");
  assert.equal(kk.houses.length, 12);

  // House 1 should be Leo
  assert.equal(kk.houses[0].house, 1);
  assert.equal(kk.houses[0].sign, "Leo");
  assert.deepEqual(kk.houses[0].planets, ["Sun"]);

  // House 2 should be Virgo (occupant Mercury)
  assert.equal(kk.houses[1].house, 2);
  assert.equal(kk.houses[1].sign, "Virgo");
  assert.deepEqual(kk.houses[1].planets, ["Mercury"]);

  // House 7 should be Aquarius (occupant Venus)
  assert.equal(kk.houses[6].house, 7);
  assert.equal(kk.houses[6].sign, "Aquarius");
  assert.deepEqual(kk.houses[6].planets, ["Venus"]);

  // House 10 should be Taurus (occupant Saturn)
  assert.equal(kk.houses[9].house, 10);
  assert.equal(kk.houses[9].sign, "Taurus");
  assert.deepEqual(kk.houses[9].planets, ["Saturn"]);

  // Verify static interpretation summaries exist
  assert.ok(kk.staticAnalysis.soulPurpose.length > 0);
  assert.ok(kk.staticAnalysis.wealthSource.includes("Mercury"));
  assert.ok(kk.staticAnalysis.spousePersona.includes("Venus"));
  assert.ok(kk.staticAnalysis.careerDestiny.includes("Saturn"));
});

test("GK Problem Analysis: House-wise problem and disease diagnosis", () => {
  // Chart with GK Saturn in 12th house (Pisces for Aries Lagna)
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 28.0 },
    Moon: { rashiIndex: 1, degreeInSign: 24.0 },
    Mars: { rashiIndex: 2, degreeInSign: 20.0 },
    Mercury: { rashiIndex: 3, degreeInSign: 16.0 },
    Jupiter: { rashiIndex: 4, degreeInSign: 12.0 },
    Saturn: { rashiIndex: 11, degreeInSign: 8.0 }, // GK in Pisces (12th house from Aries)
    Venus: { rashiIndex: 6, degreeInSign: 4.0 },
  });

  const jaimini = buildJaiminiChart(chart);
  const gk = jaimini.gkAnalysis;

  assert.equal(gk.gkPlanet, "Saturn");
  assert.equal(gk.gkHouseFromLagna, 12);
  assert.ok(gk.houseProblem.includes("Kharcha badhega") || gk.houseProblem.includes("hospital"));
  assert.ok(gk.diseases.some(d => d.includes("joint pain") || d.includes("Gas")));

  // Verify Saturn remedies contain Kali dal & sarson tel (16-17 din)
  const saturnRemedies = gk.remedies.join(" ");
  assert.ok(saturnRemedies.includes("Kali"));
  assert.ok(saturnRemedies.includes("sarson"));
  assert.ok(saturnRemedies.includes("16-17 din"));
});

test("DK Analysis: Evaluates spouse persona and identifies marriage timing signs", () => {
  // Chart with DK Jupiter in Sagittarius (sign 8)
  const chart = createMockChart(0, {
    Sun: { rashiIndex: 0, degreeInSign: 28.0 },
    Moon: { rashiIndex: 1, degreeInSign: 24.0 },
    Mars: { rashiIndex: 2, degreeInSign: 20.0 },
    Mercury: { rashiIndex: 3, degreeInSign: 16.0 },
    Saturn: { rashiIndex: 4, degreeInSign: 12.0 },
    Venus: { rashiIndex: 5, degreeInSign: 8.0 },
    Jupiter: { rashiIndex: 8, degreeInSign: 4.0 }, // DK Jupiter in Sagittarius
  });

  const jaimini = buildJaiminiChart(chart);
  const dk = jaimini.dkAnalysis;

  assert.equal(dk.dkPlanet, "Jupiter");
  assert.ok(dk.spousePersona.includes("Spiritual") || dk.spousePersona.includes("wise"));
  assert.ok(dk.spouseTraits.some(t => t.includes("teacher") || t.includes("dharma")));
  assert.ok(dk.marriageTimingSigns.includes("Sagittarius"));
});

test("Jaimini Aspects (Rashi Drishti): Sign-based rules adhere strictly to movable/fixed/dual", () => {
  // Aries (0, movable) aspects Leo (4), Scorpio (7), Aquarius (10) — skips adjacent Taurus (1)
  assert.ok(doesSignAspect(0, 4));
  assert.ok(doesSignAspect(0, 7));
  assert.ok(doesSignAspect(0, 10));
  assert.ok(!doesSignAspect(0, 1)); // Adjacent Taurus is not aspected
  assert.ok(!doesSignAspect(0, 2)); // Dual sign Gemini is not aspected

  // Taurus (1, fixed) aspects Cancer (3), Libra (6), Capricorn (9) — skips adjacent Aries (0)
  assert.ok(doesSignAspect(1, 3));
  assert.ok(doesSignAspect(1, 6));
  assert.ok(doesSignAspect(1, 9));
  assert.ok(!doesSignAspect(1, 0)); // Adjacent Aries is not aspected

  // Gemini (2, dual) aspects Virgo (5), Sagittarius (8), Pisces (11)
  assert.ok(doesSignAspect(2, 5));
  assert.ok(doesSignAspect(2, 8));
  assert.ok(doesSignAspect(2, 11));
  assert.ok(!doesSignAspect(2, 0)); // Movable Aries is not aspected
});
