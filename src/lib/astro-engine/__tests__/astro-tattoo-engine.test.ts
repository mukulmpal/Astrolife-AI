import test from "node:test";
import assert from "node:assert/strict";
import {
  generateAstroTattooAudit,
  checkIsUntenanted,
  resolveActivatingPlanet,
  MASTER_PLANET_TATTOO_PALETTE,
  ANATOMICAL_SIGNS,
  GOAL_DEFINITIONS,
  type BiologicalGender,
} from "../astro-tattoo-engine";
import { type ChartData } from "../calculations";

// Sample Gemini Lagna Chart (Lagna = 3)
const mockGeminiChart: ChartData = {
  name: "Rohit Seeker",
  gender: "male",
  ascendant: {
    sign: "Gemini",
    signNumber: 3,
    degree: 12.5,
  },
  houses: [
    { sign: "Gemini", signNumber: 3, degree: 12.5 },
    { sign: "Cancer", signNumber: 4, degree: 12.5 },
    { sign: "Leo", signNumber: 5, degree: 12.5 },
    { sign: "Virgo", signNumber: 6, degree: 12.5 },
    { sign: "Libra", signNumber: 7, degree: 12.5 },
    { sign: "Scorpio", signNumber: 8, degree: 12.5 },
    { sign: "Sagittarius", signNumber: 9, degree: 12.5 }, // House 7
    { sign: "Capricorn", signNumber: 10, degree: 12.5 },
    { sign: "Aquarius", signNumber: 11, degree: 12.5 },
    { sign: "Pisces", signNumber: 12, degree: 12.5 },
    { sign: "Aries", signNumber: 1, degree: 12.5 },
    { sign: "Taurus", signNumber: 2, degree: 12.5 },
  ],
  planets: [
    { name: "Sun", sign: "Leo", house: 3, nakshatraLord: "Venus" },
    { name: "Moon", sign: "Taurus", house: 12, nakshatraLord: "Sun" },
    { name: "Mars", sign: "Aries", house: 11, nakshatraLord: "Ketu" },
    { name: "Mercury", sign: "Gemini", house: 1, nakshatraLord: "Jupiter" },
    { name: "Jupiter", sign: "Sagittarius", house: 7, nakshatraLord: "Ketu" },
    { name: "Venus", sign: "Libra", house: 5, nakshatraLord: "Mars" }, // Untenanted test candidate
    { name: "Saturn", sign: "Aquarius", house: 9, nakshatraLord: "Rahu" },
    { name: "Rahu", sign: "Taurus", house: 12, nakshatraLord: "Moon" },
    { name: "Ketu", sign: "Scorpio", house: 6, nakshatraLord: "Mercury" },
  ],
  dasha: {
    currentDasha: {
      mahadasha: "Venus",
      antardasha: "Jupiter",
    },
  },
};

test("Astro-Tattoo Engine — Somatotopic and Shastric Integrity", async (t) => {
  await t.test("1. Gender Lateralization Rule (Male Right, Female Left)", () => {
    // Male
    const maleAudit = generateAstroTattooAudit(mockGeminiChart, { gender: "male" });
    assert.equal(maleAudit.gender, "male");
    assert.equal(maleAudit.prescription.anatomicalLocation.side, "right");
    assert.match(maleAudit.prescription.anatomicalLocation.sideHindi, /दायां/);

    // Female
    const femaleAudit = generateAstroTattooAudit(mockGeminiChart, { gender: "female" });
    assert.equal(femaleAudit.gender, "female");
    assert.equal(femaleAudit.prescription.anatomicalLocation.side, "left");
    assert.match(femaleAudit.prescription.anatomicalLocation.sideHindi, /बायां/);
  });

  await t.test("2. Untenanted Planet Precedence Override", () => {
    // In mockGeminiChart, check which planets are unoccupied as star lords
    // Occupied nakshatra lords: Venus, Sun, Ketu, Jupiter, Mars, Rahu, Moon, Mercury.
    // Saturn is NOT in the occupied list, so Saturn is untenanted!
    const isSaturnUntenanted = checkIsUntenanted(mockGeminiChart, "Saturn");
    assert.equal(isSaturnUntenanted, true);

    const saturnResolution = resolveActivatingPlanet(mockGeminiChart, "Saturn");
    assert.equal(saturnResolution.isUntenanted, true);
    assert.equal(saturnResolution.planet, "Saturn"); // Directly activates Saturn, not its star lord Rahu!
    assert.match(saturnResolution.reasoning, /अनटेनेंटेड/);

    // Now test a tenanted planet: Sun has Moon in its nakshatra (Sun is tenanted)
    const isSunUntenanted = checkIsUntenanted(mockGeminiChart, "Sun");
    assert.equal(isSunUntenanted, false);

    const sunResolution = resolveActivatingPlanet(mockGeminiChart, "Sun");
    assert.equal(sunResolution.isUntenanted, false);
    assert.equal(sunResolution.planet, "Venus"); // Sun's nakshatra lord is Venus
  });

  await t.test("3. Marriage Goal (7th House) Anatomical Resolution for Gemini Lagna", () => {
    // Gemini Lagna (3) -> 7th House is Sagittarius (9) -> Thighs
    const audit = generateAstroTattooAudit(mockGeminiChart, {
      gender: "female",
      activeGoal: "marriage",
    });

    const prescription = audit.prescription;
    assert.equal(prescription.goal, "marriage");
    assert.equal(prescription.targetHouseResolved, 7);
    assert.equal(prescription.primarySignNumber, 9); // Sagittarius
    assert.equal(prescription.primarySignName, "Sagittarius");
    assert.match(prescription.anatomicalLocation.bodyPart, /Thighs/);
    assert.match(prescription.anatomicalLocation.bodyPartHindi, /जांघें/);
    assert.equal(prescription.anatomicalLocation.side, "left"); // Female = left
  });

  await t.test("4. Health Goal (5th House Negation of 6th House Disease)", () => {
    // Gemini Lagna (3) -> 5th House is Libra (7) -> Pelvis / Lower Back
    const audit = generateAstroTattooAudit(mockGeminiChart, {
      gender: "male",
      activeGoal: "health",
    });

    const prescription = audit.prescription;
    assert.equal(prescription.goal, "health");
    assert.equal(prescription.targetHouseResolved, 5);
    assert.equal(prescription.primarySignNumber, 7); // Libra
    assert.equal(prescription.primarySignName, "Libra");
    assert.match(prescription.anatomicalLocation.bodyPart, /Pelvis/);
    assert.match(prescription.houseSignificatorsExplanation, /पंचम भाव छठे भाव/);
    assert.equal(prescription.anatomicalLocation.side, "right"); // Male = right
  });

  await t.test("5. Foreign Travel Goal strictly excludes 11th House Negation", () => {
    const meta = GOAL_DEFINITIONS.foreign_travel;
    assert.deepEqual(meta.supportingHouses, [3, 9, 12]);
    assert.deepEqual(meta.forbiddenHouses, [11]);
    assert.match(meta.rationale, /strictly avoided because 11 negates 12/);
  });

  await t.test("6. Venus Special Application (Turquoise Ink + Perfume Application)", () => {
    const venusPalette = MASTER_PLANET_TATTOO_PALETTE.Venus;
    assert.equal(venusPalette.hexColor, "#06B6D4"); // Turquoise
    assert.match(venusPalette.specialApplicationRitual || "", /इत्र \(Perfume\)/);

    // If Venus is activating planet, prescription must instruct perfume
    const audit = generateAstroTattooAudit(mockGeminiChart, {
      gender: "male",
      selectedPlanet: "Venus",
    });
    assert.match(audit.prescription.tattooSpecs.specialRitual, /इत्र \(Perfume\)/);
  });

  await t.test("7. Complete 12 Zodiac Signs Anatomical Integrity", () => {
    assert.equal(ANATOMICAL_SIGNS.length, 12);
    assert.equal(ANATOMICAL_SIGNS[0].primaryBodyPart, "Head, Crown & Forehead"); // Aries
    assert.equal(ANATOMICAL_SIGNS[8].primaryBodyPart, "Thighs & Femur"); // Sagittarius
    assert.equal(ANATOMICAL_SIGNS[10].primaryBodyPart, "Calves, Shins & Ankles"); // Aquarius (Calf muscles)
    assert.equal(ANATOMICAL_SIGNS[11].primaryBodyPart, "Feet, Soles & Toes"); // Pisces (Feet)
  });

  await t.test("8. Zero Collateral Family Impact Invariant", () => {
    const audit = generateAstroTattooAudit(mockGeminiChart);
    assert.match(audit.prescription.noCollateralImpactAssurance, /परिवार के अन्य सदस्यों पर इसका कोई विपरीत प्रभाव नहीं पड़ता/);
  });
});

