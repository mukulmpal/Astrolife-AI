import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluatePalaHarmonics,
  evaluateNDGender,
  evaluateTattva,
  evaluatePranapada,
  evaluateSunStarToAscendant,
  evaluatePrenatalEpoch,
} from "../birth-rectification-engine";
import {
  hasKPLinkage,
  evaluateRuleOfOrigin,
  evaluateKPThreeLevelLinkage,
} from "../kp";

test("R.K. Das Chapter XI: 3P mod 7 & 4P mod 9 Palas Verification", () => {
  // Dr. B.V. Raman example: Thursday, star group 5 (Mrigashira), P = 2069 palas
  const res = evaluatePalaHarmonics(2069, "Thursday", 5);
  assert.equal(res.weekdayMatched, true, "3P mod 7 should match Thursday (5)");
  assert.equal(res.starGroupMatched, true, "4P mod 9 should match Star Group 5");
  assert.equal(res.computedWeekdayNumber, 5);
  assert.equal(res.computedStarGroup, 5);
});

test("R.K. Das Chapter VI: 16'40'' N-D Gender Alternation", () => {
  // Aries (Odd sign): Point 1 (0° to 0°16'40'') is Male
  const pt1 = evaluateNDGender(0.1, "male");
  assert.equal(pt1.ndPointNumber, 1);
  assert.equal(pt1.ndGender, "male");
  assert.equal(pt1.matched, true);

  // Aries (Odd sign): Point 2 (0°16'40'' to 0°33'20'') is Female
  const pt2 = evaluateNDGender(0.4, "female");
  assert.equal(pt2.ndPointNumber, 2);
  assert.equal(pt2.ndGender, "female");
  assert.equal(pt2.matched, true);
});

test("R.K. Das Chapter X: Exact Weekday Tattva Order", () => {
  // Thursday starts with Vyoma (75 palas)
  const tat = evaluateTattva(20, "Thursday", "Aquarius");
  assert.equal(tat.tattvaName, "Vyoma (Ether)");
  assert.equal(tat.matched, true);
});

test("R.K. Das Chapter XIII: Pranapada Amsa Calculation", () => {
  // Lady born 17/18.3.1923: Sun amsa = 2°, P = 2765, Lagna amsa = 12°
  // P % 15 = 5 => 5 * 2 = 10 => 2 + 10 = 12° => matches 12°
  const pp = evaluatePranapada(2765, 332.78, 222.13); // Sun in Pisces 2°47', Asc in Scorpio 12°08'
  assert.equal(pp.passed, true);
  assert.equal(pp.sunSunriseAmsa, 2.78);
});

test("Prof. Andrew Dutta Rule of Origin (O1, O2, O3)", () => {
  const origin = evaluateRuleOfOrigin(
    { starLord: "Jupiter", subLord: "Saturn" },
    { starLord: "Saturn", subLord: "Saturn" }
  );
  assert.equal(origin.originValidated, true);
  assert.equal(origin.ruleO2, true);
});

test("R.K. Das Chapter XII: Prenatal Epoch (Adhana Lagna & Gestation Direction)", () => {
  // Lady born 1901 April 29: Sun 16°47' (Aries), Moon 4s 29°32' (Leo), Asc 8s 0°47' (Sagittarius)
  // Waxing and visible (in 9th house) => gestation shorter than 273 days
  // Distance to asta lagna (Gemini 0°47') = 88.75° / 12 = 7.39 days => gestation = 265.6 days
  // Adhana Moon = Sagittarius (Birth Lagna), Adhana Lagna = Leo (Birth Moon)
  const mockChart = {
    planets: {
      Sun: { lon: 16.78 },
      Moon: { lon: 149.53, sign: "Leo" },
    },
    lagnaLon: 240.78, // Sagittarius 0°47'
    lagnaRashi: "Sagittarius",
  } as any;

  const epoch = evaluatePrenatalEpoch(mockChart, "1901-04-29", "12:00", 5.5);
  assert.equal(epoch.isShorterThanStandard, true, "Waxing and visible Moon must yield shorter gestation");
  assert.equal(epoch.expectedAdhanaLagnaSign, "Leo", "Adhana Lagna must match Birth Moon sign (Leo)");
  assert.equal(epoch.expectedAdhanaMoonSign, "Sagittarius", "Adhana Moon must match Birth Lagna sign (Sagittarius)");
  assert.ok(epoch.gestationDays < 273, "Gestation days must be shorter than 273 days");
});

test("R.K. Das Chapter XI: Tattva 3-Fold Sex Sub-division & Border Check", () => {
  // Thursday: starts with Vyoma (75 palas total, 3 parts of 25 palas)
  // Part 1 [0..25p]: Male
  // Part 2 [25..50p]: Female
  // Part 3 [50..75p]: Male

  // At 10 palas: inside part 1 (Male)
  const maleTat = evaluateTattva(10, "Thursday", "Aquarius", "male");
  assert.equal(maleTat.subSegmentGender, "male");
  assert.equal(maleTat.genderMatched, true);
  assert.equal(maleTat.isBorderJuncture, false);

  // At 35 palas: inside part 2 (Female)
  const femaleTat = evaluateTattva(35, "Thursday", "Aquarius", "female");
  assert.equal(femaleTat.subSegmentGender, "female");
  assert.equal(femaleTat.genderMatched, true);
  assert.equal(femaleTat.isBorderJuncture, false);

  // At 0.1 palas: exact border juncture (eunuch / sandhi)
  const borderTat = evaluateTattva(0.1, "Thursday", "Aquarius");
  assert.equal(borderTat.isBorderJuncture, true);
  assert.equal(borderTat.subSegmentGender, "border_eunuch");
});
