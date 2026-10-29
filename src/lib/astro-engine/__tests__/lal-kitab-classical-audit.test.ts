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
    assert.ok(pitruRin?.upaya.includes("barabar"), "Must recommend classical blood relative remedy");
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

  it("11. Classical 1952 Varshphal Progression: Follows Pt. Roop Chand Joshi 12-year cyclic table", () => {
    // For running year 1 (cycle year 1):
    // Target date set to birth year + 6 months -> completed age 0, running year 1
    const resYear1 = calculateLalKitab(cleanPlanets, "2000-01-01", 1, new Date("2000-06-01"));
    assert.equal(resYear1.varshphal.runningAge, 1);
    assert.equal(resYear1.varshphal.cycleYear, 1);

    // In Year 1 table: Natal H10 -> H12, Natal H4 -> H3, Natal H3 -> H10
    const sunY1 = resYear1.varshphal.chartRows.find(r => r.planet === "Sun"); // natal H10
    const moonY1 = resYear1.varshphal.chartRows.find(r => r.planet === "Moon"); // natal H4
    const marsY1 = resYear1.varshphal.chartRows.find(r => r.planet === "Mars"); // natal H3
    assert.equal(sunY1?.varshHouse, 12, "Natal H10 moves to H12 in Year 1 per 1952 table");
    assert.equal(moonY1?.varshHouse, 3, "Natal H4 moves to H3 in Year 1 per 1952 table");
    assert.equal(marsY1?.varshHouse, 10, "Natal H3 moves to H10 in Year 1 per 1952 table");

    // For running year 31 (completed age 30 -> cycle year 7):
    const resYear31 = calculateLalKitab(cleanPlanets, "1990-01-01", 1, new Date("2020-06-01"));
    assert.equal(resYear31.varshphal.runningAge, 31);
    assert.equal(resYear31.varshphal.cycleYear, 7);

    // In Year 7 table: Natal H10 -> H2, Natal H7 (Venus) -> H1 (Varsheshwar!)
    const sunY31 = resYear31.varshphal.chartRows.find(r => r.planet === "Sun"); // natal H10
    const venY31 = resYear31.varshphal.chartRows.find(r => r.planet === "Venus"); // natal H7
    assert.equal(sunY31?.varshHouse, 2, "Natal H10 moves to H2 in Year 7 per 1952 table");
    assert.equal(venY31?.varshHouse, 1, "Natal H7 moves to H1 in Year 7 per 1952 table");
    assert.ok(resYear31.varshphal.varsheshwar.includes("Venus"), "Venus in H1 becomes Varsheshwar");
  });

  it("12. Varshphal Conjunction Integrity: Conjunct natal planets move together to same annual house", () => {
    // Both Saturn and Ketu are in natal H6 in cleanPlanets
    const resYear31 = calculateLalKitab(cleanPlanets, "1990-01-01", 1, new Date("2020-06-01"));
    const satY31 = resYear31.varshphal.chartRows.find(r => r.planet === "Saturn");
    const ketY31 = resYear31.varshphal.chartRows.find(r => r.planet === "Ketu");

    // In Year 7: Natal H6 -> H4
    assert.equal(satY31?.varshHouse, 4);
    assert.equal(ketY31?.varshHouse, 4);
    assert.equal(satY31?.varshHouse, ketY31?.varshHouse, "Conjunct planets in natal chart must stay conjunct in Varshphal!");
  });

  it("13. Varshphal Lagna Stability: Natal Lagna remains anchored, no arbitrary sign rotation", () => {
    const res = calculateLalKitab(cleanPlanets, "1990-05-15", 1, new Date("2024-06-01"));
    // Natal lagna is 1 (Vrishabha / Taurus)
    assert.equal(res.varshphal.lagnaSign, "Vrishabha", "Varshphal lagna must match native's natal lagna sign");
  });

  it("14. Lal Kitab Special Drishti Radar: Detects Dhokha (H8->H2) and special aspect vectors", () => {
    // In cleanPlanets: Moon in 4, Mars in 3, Sun in 10
    // Put Jupiter in H2 and Saturn in H8 to test Dhokha Drishti H8 -> H2
    const planetsWithH8 = {
      ...cleanPlanets,
      Jupiter: { house: 2, sign: "Mithuna", signNum: 2, retrograde: false, dignity: "Neutral", lon: 75 },
      Saturn: { house: 8, sign: "Vrishchika", signNum: 7, retrograde: false, dignity: "Neutral", lon: 224 },
    };
    const res = calculateLalKitab(planetsWithH8, "1990-05-15", 1);
    
    // Dhokha Drishti H8 -> H2
    const dhokha = res.drishtis.find(d => d.fromHouse === 8 && d.toHouse === 2);
    assert.ok(dhokha, "Dhokha Drishti H8 -> H2 must be detected when H8 has a planet");
    assert.equal(dhokha?.type, "dhokha");
    assert.ok(dhokha?.fromPlanets.includes("Saturn"));
    assert.ok(dhokha?.toPlanets.includes("Jupiter"));
    assert.ok(dhokha?.isAfflicted, "Dhokha Drishti with active H8 occupant must be marked as afflicted");

    // Adhikar Drishti H4 -> H10 (Moon in H4, Sun in H10)
    const adhikar = res.drishtis.find(d => d.fromHouse === 4 && d.toHouse === 10);
    assert.ok(adhikar, "Adhikar Drishti H4 -> H10 must be detected");
    assert.equal(adhikar?.strengthPercent, 50);
  });

  it("15. 12-Year Progression Matrix: Generates complete 12-year cycle with accurate Varsheshwar and current flag", () => {
    const res = calculateLalKitab(cleanPlanets, "1990-01-01", 1, new Date("2020-06-01")); // Age 31, cycle year 7
    const matrix = res.varshphal.twelveYearMatrix;
    
    assert.ok(matrix, "twelveYearMatrix must exist");
    assert.equal(matrix.length, 12, "Matrix must contain exactly 12 cycle rows");

    // Check row 7 is marked as current
    const currentRow = matrix.find(r => r.cycleYear === 7);
    assert.ok(currentRow?.isCurrent, "Cycle Year 7 must be marked as isCurrent");
    assert.equal(currentRow?.runningAge, 31);
    assert.equal(currentRow?.calendarYear, 2020);
    assert.ok(currentRow?.varsheshwar.includes("Venus"));

    // Check row 1
    const row1 = matrix.find(r => r.cycleYear === 1);
    assert.equal(row1?.isCurrent, false);
    assert.equal(row1?.cycleYear, 1);
    assert.ok(row1?.planetHouses["Sun"]);
  });

  it("16. 43-Day Consecutive Upay Protocols: Validates daytime windows and classical conduct", () => {
    const res = calculateLalKitab(cleanPlanets, "1990-05-15", 1);
    const upays = res.upayProtocols;

    assert.ok(upays.length > 0, "Must generate 43-day upay protocols");
    
    // Check daytime restriction on all upays
    upays.forEach(u => {
      assert.ok(
        u.timeWindow.includes("सूर्योदय") || u.timeWindow.includes("दिन"),
        `Upay for ${u.planet} must mandate daytime (Suryauday se Suryast) window`
      );
      assert.ok(u.conductRule.length > 0, `Upay for ${u.planet} must include conduct guidance`);
      assert.ok(u.materialsNeeded.length > 0, `Upay for ${u.planet} must list authentic materials`);
      assert.ok(u.prohibitions.length > 0, `Upay for ${u.planet} must specify Lal Kitab prohibitions`);
    });
  });
});
