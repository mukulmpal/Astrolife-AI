// src/lib/astro-engine/__tests__/vastu-purusha-mandala.test.ts
// Automated Tests for 45 Devata Vastu Purusha Mandala & 32 Pad Entrance Engine

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ChartData } from "../calculations";
import {
  MASTER_45_DEVATAS,
  MASTER_CLINICAL_PROBLEM_DIAGNOSTICS,
  runVastuPurushaMandalaEngine,
  getElementalBalancingGuide,
  evaluateOccultKundliDiagnostic,
} from "../vastu-purusha-mandala-engine";

describe("45 Devata Vastu Purusha Mandala & 32 Pad Entrance Engine", () => {
  it("should contain exactly 45 total energy fields: 33 Devatas and 12 Asuras", () => {
    assert.equal(MASTER_45_DEVATAS.length, 45);

    const devatas = MASTER_45_DEVATAS.filter((d) => d.classification === "Devata");
    const asuras = MASTER_45_DEVATAS.filter((d) => d.classification === "Asura");

    assert.equal(devatas.length, 33, "Must have exactly 33 Devatas (33 Koti)");
    assert.equal(asuras.length, 12, "Must have exactly 12 Asuras");
  });

  it("should have correct hierarchical layer distribution (1 Brahma, 4 Cardinal, 8 Diagonal, 32 Perimeter)", () => {
    const brahma = MASTER_45_DEVATAS.filter((d) => d.layer === "Brahmasthan");
    const cardinal = MASTER_45_DEVATAS.filter((d) => d.layer === "CardinalFaces");
    const diagonal = MASTER_45_DEVATAS.filter((d) => d.layer === "DiagonalCorners");
    const perimeter = MASTER_45_DEVATAS.filter((d) => d.layer === "OuterPerimeter");

    assert.equal(brahma.length, 1);
    assert.equal(cardinal.length, 4);
    assert.equal(diagonal.length, 8);
    assert.equal(perimeter.length, 32);

    // Cardinal Deities
    const cardinalIds = cardinal.map((d) => d.id);
    assert.ok(cardinalIds.includes("BHUDHAR"));
    assert.ok(cardinalIds.includes("ARYAMA"));
    assert.ok(cardinalIds.includes("VIVASVAN"));
    assert.ok(cardinalIds.includes("MITRA"));

    // Food offerings
    const bhudhar = cardinal.find((d) => d.id === "BHUDHAR");
    assert.ok(bhudhar?.sacredFoodOffering?.includes("आटे की थैली"));

    const aryama = cardinal.find((d) => d.id === "ARYAMA");
    assert.ok(aryama?.sacredFoodOffering?.includes("गुड़"));

    const vivasvan = cardinal.find((d) => d.id === "VIVASVAN");
    assert.ok(vivasvan?.sacredFoodOffering?.includes("आटे का दीपक"));

    const mitra = cardinal.find((d) => d.id === "MITRA");
    assert.ok(mitra?.sacredFoodOffering?.includes("मीठी रोटी"));
  });

  it("should correctly identify all 32 perimeter entrances (E1-E8, S1-S8, W1-W8, N1-N8) with authentic shastric effects", () => {
    const perimeter = MASTER_45_DEVATAS.filter((d) => d.layer === "OuterPerimeter");
    assert.equal(perimeter.length, 32);

    // E1 Shikhi: Fire accidents, electrical short circuits
    const e1 = perimeter.find((d) => d.padCode === "E1");
    assert.ok(e1);
    assert.equal(e1.auspiciousness, "Destructive");
    assert.ok(e1.realLifeSymptom.includes("शॉर्ट सर्किट"));

    // E4 Mahendra: Government support & royalty
    const e4 = perimeter.find((d) => d.padCode === "E4");
    assert.ok(e4);
    assert.equal(e4.auspiciousness, "Supreme");
    assert.ok(e4.classicalSignificance.includes("सरकारी"));

    // S3 Vidhata: Auspicious South entrance
    const s3 = perimeter.find((d) => d.padCode === "S3");
    assert.ok(s3);
    assert.equal(s3.auspiciousness, "Supreme");

    // S6 Gandharva: Poverty for laymen, super fame for musicians
    const s6 = perimeter.find((d) => d.padCode === "S6");
    assert.ok(s6);
    assert.ok(s6.classicalSignificance.includes("संगीतकारों"));

    // W4 Pushpadanta: Wish fulfilment with yellow slip & white marker
    const w4 = perimeter.find((d) => d.padCode === "W4");
    assert.ok(w4);
    assert.equal(w4.auspiciousness, "Supreme");
    assert.ok(w4.secretShastricAxiom?.includes("पीली पर्ची"));

    // W8 Papyakshma: Addiction trap
    const w8 = perimeter.find((d) => d.padCode === "W8");
    assert.ok(w8);
    assert.equal(w8.auspiciousness, "Destructive");
    assert.ok(w8.realLifeSymptom.includes("नशे"));

    // N2 Naga: Brand attraction + cinnamon oral remedy + nazar caution
    const n2 = perimeter.find((d) => d.padCode === "N2");
    assert.ok(n2);
    assert.ok(n2.secretShastricAxiom?.includes("दालचीनी"));

    // N3 Mukhya: Male progeny secret formula with newborn infant photo
    const n3 = perimeter.find((d) => d.padCode === "N3");
    assert.ok(n3);
    assert.ok(n3.secretShastricAxiom?.includes("पुत्र संतान"));

    // N4 Bhallata: 360° True North abundance gate
    const n4 = perimeter.find((d) => d.padCode === "N4");
    assert.ok(n4);
    assert.equal(n4.auspiciousness, "Supreme");
  });

  it("should balance elemental bar-chart: depleted -> bring behind forward; extended -> bring ahead back", () => {
    // Depleted Water in North -> bring Space (preceding) forward
    const waterDepleted = getElementalBalancingGuide("N", "Water", "Exhausted_Depleted");
    assert.ok(waterDepleted.actionFormula.includes("पीछे वाला आगे"));
    assert.ok(waterDepleted.actionExplanation.includes("सफेद"));

    // Extended Water in North -> bring Wood (succeeding) back to exhaust
    const waterExtended = getElementalBalancingGuide("N", "Water", "Extended_Bloated");
    assert.ok(waterExtended.actionFormula.includes("आगे वाला पीछे"));
    assert.ok(waterExtended.actionExplanation.includes("पौधे"));
  });

  it("should evaluate Occult & Negative Energy Kundli Diagnostic with Saturn & Rahu in 8th/4th/1st", () => {
    const afflictedChart = {
      name: "Occult Test Chart",
      lagnaRashi: "Virgo",
      lagnaNum: 6,
      planets: {
        Saturn: { sign: "Aries", signNum: 1, house: 8, degree: 15, minutes: 0 },
        Rahu: { sign: "Sagittarius", signNum: 9, house: 4, degree: 10, minutes: 0 },
      },
      houseCusps: [
        { house: 4, sign: "Sagittarius", signNum: 9 },
        { house: 8, sign: "Aries", signNum: 1 },
      ],
    } as unknown as ChartData;

    const occultResult = evaluateOccultKundliDiagnostic(afflictedChart);
    assert.equal(occultResult.isAfflicted, true);
    assert.equal(occultResult.severity, "CRITICAL");
    assert.equal(occultResult.afflictionType, "Dwelling_Premises");
    assert.ok(occultResult.locationDirection?.includes("चतुर्थ भाव"));
  });

  it("should dynamically map all 45 deities to native's lagna chart and detect dusthana gates", () => {
    const cancerChart = {
      name: "Cancer Native",
      lagnaRashi: "Cancer",
      lagnaNum: 4,
    } as unknown as ChartData;

    const dossier = runVastuPurushaMandalaEngine(cancerChart);
    assert.equal(dossier.nativeMappings.length, 45);

    // For Cancer Lagna (4):
    // West (Aquarius = 11) is House 8 (Dusthana)!
    const w4Mapping = dossier.nativeMappings.find((m) => m.devata.padCode === "W4");
    assert.ok(w4Mapping);
    assert.equal(w4Mapping.nativeHouseNum, 8);
    assert.equal(w4Mapping.houseNature, "Dusthana");
    assert.equal(w4Mapping.isDusthanaBlocked, true);
    assert.ok(w4Mapping.shastricVerdictBadge.includes("भाव 8"));
  });

  it("should have authentic 4-feet and 8-feet wall triggers and new clinical diagnostics", () => {
    const dummyChart = { lagnaRashi: "Virgo", planets: {} } as unknown as ChartData;
    const dossier = runVastuPurushaMandalaEngine(dummyChart);

    // Verify 4-feet and 8-feet construction triggers
    const triggers = dossier.subtleShastricDirectives.constructionWallHeightTriggers;
    assert.ok(triggers);
    assert.ok(triggers.fourFeetCardinalTrigger.includes("4 फीट"));
    assert.ok(triggers.fourFeetCardinalTrigger.includes("भूधर"));
    assert.ok(triggers.eightFeetDiagonalCornerTrigger.includes("8 फीट"));
    assert.ok(triggers.eightFeetDiagonalCornerTrigger.includes("सविता"));

    // Verify new clinical diagnostics from the master lecture
    const maleProgeny = MASTER_CLINICAL_PROBLEM_DIAGNOSTICS.find((d) => d.id === "MALE_PROGENY_DESIRE");
    assert.ok(maleProgeny);
    assert.equal(maleProgeny.targetDevataId, "N3");
    assert.ok(maleProgeny.physicalRemedyHi.includes("नवजात"));

    const conception = MASTER_CLINICAL_PROBLEM_DIAGNOSTICS.find((d) => d.id === "FEMALE_CONCEPTION_INFERTILITY");
    assert.ok(conception);
    assert.equal(conception.targetDevataId, "INDRA_CORNER");
    assert.ok(conception.physicalRemedyHi.includes("पीतल"));

    const inheritance = MASTER_CLINICAL_PROBLEM_DIAGNOSTICS.find((d) => d.id === "PARENTAL_INHERITANCE_STALLED");
    assert.ok(inheritance);
    assert.equal(inheritance.targetDevataId, "N4");
    assert.ok(inheritance.shastricDiagnosis.includes("पैतृक संपत्ति"));

    const rebelliousDaughter = MASTER_CLINICAL_PROBLEM_DIAGNOSTICS.find((d) => d.id === "REBELLIOUS_DAUGHTER_BEHAVIOR");
    assert.ok(rebelliousDaughter);
    assert.equal(rebelliousDaughter.targetDevataId, "N7");
    assert.equal(rebelliousDaughter.actionProtocol, "BLOCK_DEACTIVATE");
  });
});
