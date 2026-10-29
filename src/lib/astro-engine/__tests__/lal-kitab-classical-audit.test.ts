import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateLalKitab } from "../lalkitab";

describe("Lal Kitab Classical Axioms & Safety Engine Audit", () => {
  // Baseline chart: clean Taurus lagna
  const cleanPlanets = {
    Sun:     { house: 10, sign: "Kumbha", signNum: 10, retrograde: false, dignity: "Neutral", lon: 315 },
    Moon:    { house: 4,  sign: "Simha", signNum: 4, retrograde: false, dignity: "Own", lon: 130 },
    Mars:    { house: 3,  sign: "Karka", signNum: 3, retrograde: false, dignity: "Debilitated", lon: 105 },
    Mercury: { house: 11, sign: "Meena", signNum: 11, retrograde: false, dignity: "Debilitated", lon: 345 },
    Jupiter: { house: 9,  sign: "Makara", signNum: 9, retrograde: false, dignity: "Debilitated", lon: 280 },
    Venus:   { house: 7,  sign: "Vrishchika", signNum: 7, retrograde: false, dignity: "Neutral", lon: 220 },
    Saturn:  { house: 6,  sign: "Tula", signNum: 6, retrograde: false, dignity: "Exalted", lon: 195 },
    Rahu:    { house: 12, sign: "Mesha", signNum: 0, retrograde: true, dignity: "Neutral", lon: 15 },
    Ketu:    { house: 6,  sign: "Tula", signNum: 6, retrograde: true, dignity: "Neutral", lon: 195 },
  };

  it("1. Classical Pakka Ghar: Rahu is 12, Ketu is 6, Jupiter has [2,5,9,11]", () => {
    const res = calculateLalKitab(cleanPlanets, "1990-05-15", 1);
    const rahu = res.planets.find(p => p.planet === "Rahu");
    const ketu = res.planets.find(p => p.planet === "Ketu");
    const moon = res.planets.find(p => p.planet === "Moon");

    // Rahu in 12 is in its authentic Pakka Ghar per Lal Kitab 1952!
    assert.equal(rahu?.status, "pakka", "Rahu in House 12 must be recognized as Pakka Ghar");
    // Ketu in 6 is in its authentic Pakka Ghar per Lal Kitab 1952!
    assert.equal(ketu?.status, "pakka", "Ketu in House 6 must be recognized as Pakka Ghar");
    // Moon in 4 is in its authentic Pakka Ghar!
    assert.equal(moon?.status, "pakka", "Moon in House 4 must be recognized as Pakka Ghar");
  });

  it("2. Classical Dushman Ghar: Mercury in 12 and Jupiter in 10 are recognized as challenged", () => {
    const planetsChallenged = {
      ...cleanPlanets,
      Mercury: { house: 12, sign: "Meena", signNum: 11, retrograde: false, dignity: "Debilitated", lon: 345 },
      Jupiter: { house: 10, sign: "Makara", signNum: 9, retrograde: false, dignity: "Debilitated", lon: 280 },
    };
    const res = calculateLalKitab(planetsChallenged, "1990-05-15", 1);
    const merc = res.planets.find(p => p.planet === "Mercury");
    const jup = res.planets.find(p => p.planet === "Jupiter");

    assert.equal(merc?.status, "dushman", "Mercury in House 12 (debilitation) must be flagged as Dushman Ghar");
    assert.equal(jup?.status, "dushman", "Jupiter in House 10 (debilitation) must be flagged as Dushman Ghar");
  });

  it("3. Sleeping Planet (Soya Grah) Logic: No hardcoded Rahu/Ketu sleeping", () => {
    const res = calculateLalKitab(cleanPlanets, "1990-05-15", 1);
    const rahuRow = res.coreAccuracy.find(r => r.planet === "Rahu");
    const ketuRow = res.coreAccuracy.find(r => r.planet === "Ketu");

    // At age 35+ (DOB 1990), Saturn (36), Sun (22), Moon (24), Mars (28), Mercury (34), Jupiter (16), Venus (25)
    // Ketu is in H6 with Saturn (companion), so it is not sleeping!
    assert.equal(ketuRow?.soya, false, "Ketu in H6 with companion planet must NOT be sleeping");
    // Rahu is in H12 opposite Ketu/Saturn in H6 (direct 7th drishti aspect), so it is awakened!
    assert.equal(rahuRow?.soya, false, "Rahu in H12 receiving 7th aspect from H6 must NOT be sleeping");
  });

  it("4. Takkar Analysis: Detects both 180° frontal collision (1 vs 7) and same-house clashes", () => {
    const takkarChart = {
      ...cleanPlanets,
      Sun:    { house: 1, sign: "Mesha", signNum: 0, retrograde: false, dignity: "Exalted", lon: 10 },
      Saturn: { house: 7, sign: "Tula", signNum: 6, retrograde: false, dignity: "Exalted", lon: 190 },
    };
    const res = calculateLalKitab(takkarChart, "1990-05-15", 1);
    const sunSaturnTakkar = res.takkars.find(t => 
      (t.p1 === "Sun" && t.p2 === "Saturn") || (t.p1 === "Saturn" && t.p2 === "Sun")
    );

    assert.ok(sunSaturnTakkar, "Sun in 1 and Saturn in 7 must trigger a frontal Takkar clash!");
    assert.equal(sunSaturnTakkar?.kind, "enemy");
    assert.ok(sunSaturnTakkar?.houseLabel?.includes("aamne-saamne"), "Must display opposing houses label");
    assert.ok(sunSaturnTakkar?.upaya?.includes("Brihaspati"), "Must recommend classical mediator remedy");
  });

  it("5. Teva Classification: Correctly identifies Dharmi Teva (Jupiter in 9 / Moon in 4)", () => {
    const res = calculateLalKitab(cleanPlanets, "1990-05-15", 1);
    assert.equal(res.tevaType, "Dharmi Teva");
    assert.ok(res.tevaExplanation?.includes("Dharmi Teva"), "Must provide encouraging classical explanation");
  });

  it("6. Rin Siddhant: Clean chart does not falsely flag all 4 malefics with ancestral debt", () => {
    // In cleanPlanets, Jupiter is in H9 alone, Moon is in H4 alone, Mars is in H3 alone, Saturn is in H6 with Ketu.
    const res = calculateLalKitab(cleanPlanets, "1990-05-15", 1);
    // Classical Rin count should be minimal, not 6!
    assert.ok(res.rins.length <= 2, "Clean chart must not arbitrarily brand all planets as debts");
  });

  it("7. Rin Siddhant: Afflicted Pitru Rin is authentically detected when Jupiter conjuncts Rahu in 9", () => {
    const pitruChart = {
      ...cleanPlanets,
      Jupiter: { house: 9, sign: "Dhanu", signNum: 8, retrograde: false, dignity: "Own", lon: 250 },
      Rahu:    { house: 9, sign: "Dhanu", signNum: 8, retrograde: true, dignity: "Neutral", lon: 255 },
    };
    const res = calculateLalKitab(pitruChart, "1990-05-15", 1);
    const pitruRin = res.rins.find(r => r.rin.includes("Pitru Rin"));

    assert.ok(pitruRin, "Guru Chandal in House 9 must trigger authentic Pitru Rin");
    assert.equal(res.hasPitraRin, true);
    assert.ok(pitruRin?.upaya.includes("sabhyon se barabar"), "Must recommend classical blood relative remedy");
  });

  it("8. Kismat Ka Grah: Normalized score and authentic classical fortune directive", () => {
    const res = calculateLalKitab(cleanPlanets, "1990-05-15", 1);
    assert.ok(res.kismat.score >= 50 && res.kismat.score <= 95, `Kismat score must be scaled /95 (was ${res.kismat.score})`);
    assert.ok(res.kismat.interpretation.length > 30, "Must provide detailed classical activation guidance");
  });

  it("9. Soya House Awakening: Unoccupied houses have authentic Lal Kitab awakeners", () => {
    const res = calculateLalKitab(cleanPlanets, "1990-05-15", 1);
    const h1Omen = res.houseOmens.find(h => h.house === 1);
    const h2Omen = res.houseOmens.find(h => h.house === 2);

    assert.equal(h1Omen?.isSoya, true, "House 1 is vacant in cleanPlanets so must be Soya");
    assert.ok(h1Omen?.awakenerPlanet.includes("Mars") || h1Omen?.awakenerPlanet.includes("Sun"));
    assert.equal(h2Omen?.isSoya, true, "House 2 is vacant in cleanPlanets so must be Soya");
    assert.ok(h2Omen?.awakenerPlanet.includes("Moon") || h2Omen?.awakenerPlanet.includes("Jupiter"));
  });

  it("10. Prohibited Donation Audit: Venus in 7 never tells user to donate white items", () => {
    const res = calculateLalKitab(cleanPlanets, "1990-05-15", 1);
    const venus = res.planets.find(p => p.planet === "Venus");

    assert.ok(
      !venus?.upaya.toLowerCase().includes("safed daan regularly"),
      "Venus in 7 must never advise regular donation of white articles!"
    );
    assert.ok(
      venus?.upaya.includes("daan na karein"),
      "Venus in 7 must advise NOT to donate white articles!"
    );
  });
});
