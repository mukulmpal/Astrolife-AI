import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateMedical, NAKSHATRA_DISEASE_BOOK, SIGN_DISEASE } from "./medical";
import type { ChartData, PlanetData } from "./calculations";

function createMockChart(overrides?: Partial<ChartData>): ChartData {
  const basePlanets: Record<string, PlanetData> = {
    Sun: {
      lon: 10, sign: "Aries", signNum: 0, degree: 10, minutes: 0, house: 1,
      rashiHouse: 1, bhavaHouse: 1, bhavaShift: 0, bhavaNote: "",
      nakshatra: "Ashwini", nakshatraLord: "Ketu", pada: 1, retrograde: false,
      dignity: "Exalted", navamsha: "Aries"
    },
    Moon: {
      lon: 45, sign: "Taurus", signNum: 1, degree: 15, minutes: 0, house: 2,
      rashiHouse: 2, bhavaHouse: 2, bhavaShift: 0, bhavaNote: "",
      nakshatra: "Rohini", nakshatraLord: "Moon", pada: 2, retrograde: false,
      dignity: "Exalted", navamsha: "Taurus"
    },
    Mars: {
      lon: 280, sign: "Capricorn", signNum: 9, degree: 10, minutes: 0, house: 10,
      rashiHouse: 10, bhavaHouse: 10, bhavaShift: 0, bhavaNote: "",
      nakshatra: "Shravana", nakshatraLord: "Moon", pada: 1, retrograde: false,
      dignity: "Exalted", navamsha: "Aries"
    },
    Mercury: {
      lon: 25, sign: "Aries", signNum: 0, degree: 25, minutes: 0, house: 1,
      rashiHouse: 1, bhavaHouse: 1, bhavaShift: 0, bhavaNote: "",
      nakshatra: "Bharani", nakshatraLord: "Venus", pada: 4, retrograde: false,
      dignity: "Neutral", navamsha: "Scorpio"
    },
    Jupiter: {
      lon: 95, sign: "Cancer", signNum: 3, degree: 5, minutes: 0, house: 4,
      rashiHouse: 4, bhavaHouse: 4, bhavaShift: 0, bhavaNote: "",
      nakshatra: "Pushya", nakshatraLord: "Saturn", pada: 1, retrograde: false,
      dignity: "Exalted", navamsha: "Leo"
    },
    Venus: {
      lon: 350, sign: "Pisces", signNum: 11, degree: 20, minutes: 0, house: 12,
      rashiHouse: 12, bhavaHouse: 12, bhavaShift: 0, bhavaNote: "",
      nakshatra: "Revati", nakshatraLord: "Mercury", pada: 2, retrograde: false,
      dignity: "Exalted", navamsha: "Capricorn"
    },
    Saturn: {
      lon: 200, sign: "Libra", signNum: 6, degree: 20, minutes: 0, house: 7,
      rashiHouse: 7, bhavaHouse: 7, bhavaShift: 0, bhavaNote: "",
      nakshatra: "Vishakha", nakshatraLord: "Jupiter", pada: 1, retrograde: false,
      dignity: "Exalted", navamsha: "Aries"
    },
    Rahu: {
      lon: 60, sign: "Taurus", signNum: 1, degree: 0, minutes: 0, house: 2,
      rashiHouse: 2, bhavaHouse: 2, bhavaShift: 0, bhavaNote: "",
      nakshatra: "Krittika", nakshatraLord: "Sun", pada: 2, retrograde: true,
      dignity: "Neutral", navamsha: "Capricorn"
    },
    Ketu: {
      lon: 240, sign: "Scorpio", signNum: 7, degree: 0, minutes: 0, house: 8,
      rashiHouse: 8, bhavaHouse: 8, bhavaShift: 0, bhavaNote: "",
      nakshatra: "Mula", nakshatraLord: "Ketu", pada: 1, retrograde: true,
      dignity: "Neutral", navamsha: "Cancer"
    },
  };

  return {
    name: "Test Native",
    dob: "1990-01-01",
    tob: "12:00",
    city: "New Delhi",
    lat: 28.6139,
    lon: 77.2090,
    tz: 5.5,
    jd: 2447893.5,
    lagnaLon: 5,
    lagnaRashi: "Aries",
    lagnaNum: 0,
    planets: basePlanets,
    houseCusps: [],
    houseSystem: "degree-equal-bhava",
    dashas: [
      { planet: "Moon", start: new Date("2020-01-01"), end: new Date("2030-01-01"), yrs: 10, active: true },
    ],
    antardasha: [
      { planet: "Mars", start: new Date("2025-01-01"), end: new Date("2027-01-01"), yrs: 2, active: true },
    ],
    ...overrides,
  };
}

describe("Medical Astrology Engine v3.0 Audit Tests", () => {
  it("should calculate core medical analysis with all backward-compatible properties", () => {
    const chart = createMockChart();
    const result = calculateMedical(chart);

    assert.equal(result.lagnaSign, "Aries");
    assert.ok(result.prakriti);
    assert.equal(result.birthNakshatra, "Rohini");
    assert.ok(result.birthNakshatraData);
    assert.ok(result.planetCards.length >= 9);
    assert.ok(result.healthScores);
    assert.ok(typeof result.accidentScore === "number");
    assert.ok(Array.isArray(result.triggeredCombos));
    assert.ok(Array.isArray(result.preventiveRoutine));
    assert.ok(["low", "moderate", "high"].includes(result.riskLevel));
  });

  it("should calculate algorithmic Tri-Dosha breakdown totaling 100%", () => {
    const chart = createMockChart();
    const result = calculateMedical(chart);

    const td = result.tridoshaBreakdown;
    assert.ok(td);
    assert.ok(typeof td.vata === "number");
    assert.ok(typeof td.pitta === "number");
    assert.ok(typeof td.kapha === "number");
    assert.equal(td.vata + td.pitta + td.kapha, 100);
    assert.ok(td.dominant);
    assert.ok(td.lifestyleGuidance);
    assert.ok(td.dietaryGuidance.length > 0);
  });

  it("should calculate Agni profile and Ojas resilience index correctly", () => {
    const chart = createMockChart();
    const result = calculateMedical(chart);

    assert.ok(result.agniProfile);
    assert.ok(result.agniProfile.type);
    assert.ok(result.agniProfile.sanskrit);

    assert.ok(result.ojasScore >= 25 && result.ojasScore <= 100);
    assert.ok(["Robust Resilience", "Moderate Vitality", "Delicate Constitution"].includes(result.ojasRating));
  });

  it("should correctly evaluate House Lords and Parashari aspects", () => {
    const chart = createMockChart();
    const result = calculateMedical(chart);

    assert.equal(result.houseLords[1].lord, "Mars");
    assert.equal(result.houseLords[6].lord, "Mercury");
    assert.equal(result.houseLords[8].lord, "Mars");
    assert.equal(result.houseLords[12].lord, "Jupiter");

    // Mars in house 10 should aspect 1st house (4th aspect), 4th house (7th aspect), and 5th house (8th aspect)
    const marsCard = result.planetCards.find(c => c.planet === "Mars");
    assert.ok(marsCard);
    assert.ok(marsCard.aspectingHouses.includes(1)); // (10 + 3 - 1) % 12 + 1 = 1
    assert.ok(marsCard.aspectingHouses.includes(4)); // (10 + 6 - 1) % 12 + 1 = 4
    assert.ok(marsCard.aspectingHouses.includes(5)); // (10 + 7 - 1) % 12 + 1 = 5
  });

  it("should detect traditional Tuberculosis / Rajyakshma with Safe Tone guidance when Mercury and Mars are in 6th house", () => {
    const chart = createMockChart();
    // Place Mercury and Mars in 6th house (Virgo for Aries lagna)
    chart.planets.Mercury = { ...chart.planets.Mercury, house: 6, rashiHouse: 6, sign: "Virgo", signNum: 5, lon: 160 };
    chart.planets.Mars = { ...chart.planets.Mars, house: 6, rashiHouse: 6, sign: "Virgo", signNum: 5, lon: 165 };

    const result = calculateMedical(chart);
    const tbCombo = result.triggeredCombos.find(c => c.disease.includes("Tuberculosis") || c.disease.includes("Rajyakshma"));

    assert.ok(tbCombo, "Traditional Tuberculosis / Rajyakshma must be detected when Mercury & Mars occupy 6th house");
    assert.ok(tbCombo.classicalCitation.includes("Krishna Kumar") || tbCombo.classicalCitation.includes("Kshaya"));
    assert.ok(tbCombo.safeToneGuidance.includes("respiratory") || tbCombo.safeToneGuidance.includes("pulmonary"));
    assert.ok(result.healthScores.Respiratory >= 24, "Respiratory score should be elevated for Rajyakshma combo");
  });

  it("should ensure benefics in 8th house do not artificially inflate accident risk (fix for inverted 8th house bug)", () => {
    const chart = createMockChart();
    // Put Jupiter and Venus in 8th house (protective)
    chart.planets.Jupiter = { ...chart.planets.Jupiter, house: 8, rashiHouse: 8, sign: "Scorpio", signNum: 7, lon: 220 };
    chart.planets.Venus = { ...chart.planets.Venus, house: 8, rashiHouse: 8, sign: "Scorpio", signNum: 7, lon: 225 };
    chart.planets.Mars = { ...chart.planets.Mars, house: 3, rashiHouse: 3, sign: "Gemini", signNum: 2, lon: 70 };

    const result = calculateMedical(chart);
    // Benefics in 8th should give a lower accident score, not +16
    assert.ok(result.accidentScore < 25, "Benefics in 8th house should protect and keep accident risk low");
  });

  it("should verify static reference dictionaries are intact", () => {
    assert.equal(Object.keys(NAKSHATRA_DISEASE_BOOK).length, 27);
    assert.equal(Object.keys(SIGN_DISEASE).length, 12);
    assert.ok(NAKSHATRA_DISEASE_BOOK.Ashwini.disease);
    assert.ok(SIGN_DISEASE.Aries);
  });
});
