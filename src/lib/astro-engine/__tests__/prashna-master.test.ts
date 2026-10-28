import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculatePrashna,
  generateKP249Table,
  getKP249ByNumber,
  DEEPTAAMSHA,
  TOPIC_HOUSES,
  SAHAM_CONFIG,
} from "../prashna";

describe("Master Prashna Kundali Engine — 10-Layer Shastra Suite", () => {
  it("Layer 7 — KP 1 to 249 Table generates exactly 249 valid subdivisions", () => {
    const table = generateKP249Table();
    assert.equal(table.length, 249, "Table must have exactly 249 subdivisions");

    const first = table[0];
    assert.equal(first.number, 1);
    assert.equal(first.sign, "Aries");
    assert.equal(first.signLord, "Mars");
    assert.equal(first.star, "Ashwini");
    assert.equal(first.starLord, "Ketu");
    assert.equal(first.subLord, "Ketu");
    assert.equal(first.startLon, 0.0);

    const last = table[248];
    assert.equal(last.number, 249);
    assert.equal(last.sign, "Pisces");
    assert.equal(last.signLord, "Jupiter");
    assert.equal(last.star, "Revati");
    assert.equal(last.starLord, "Mercury");
    assert.equal(last.subLord, "Saturn");
    assert(Math.abs(last.endLon - 360.0) < 1e-4);

    // Verify lookup by seed number
    const sub50 = getKP249ByNumber(50);
    assert.equal(sub50.number, 50);
    assert(sub50.midLon >= sub50.startLon && sub50.midLon <= sub50.endLon);
  });

  it("Layer 1 — Panchanga Shuddhi captures Tithi, Karana, and Sunrise/Sunset", () => {
    const res = calculatePrashna("Will my career grow?", "career", 28.6139, 77.2090, 5.5);
    const p = res.layer1PanchangShuddhi;
    assert.ok(p.tithi, "Tithi should be calculated");
    assert.ok(p.karana, "Karana should be calculated");
    assert.ok(p.weekday, "Weekday should be present");
    assert.ok(p.varaLord, "Vara lord should be present");
    assert.ok(p.sunrise, "Sunrise should be formatted");
    assert.ok(p.sunset, "Sunset should be formatted");
    assert.ok(["Pavitra (Pure)", "Madhyam (Average)", "Ashuddha (Challenging)"].includes(p.shuddhiVerdict));
  });

  it("Layer 2 — Chitta Vritti accurately reveals the subconscious inquiry", () => {
    const res = calculatePrashna("Will I get married?", "marriage", 28.6139, 77.2090, 5.5);
    const cv = res.layer2ChittaVritti;
    assert.ok(cv.moonHouse >= 1 && cv.moonHouse <= 12);
    assert.ok(cv.subconsciousTheme.length > 0);
    assert.ok(typeof cv.isAlignedWithQuery === "boolean");
    assert.ok(cv.interpretation.length > 0);
  });

  it("Layer 3 — Directional Nature classifies Urdhvamukha / Adhomukha / Tiryangmukha", () => {
    const res = calculatePrashna("Will I recover my lost property?", "property", 28.6139, 77.2090, 5.5);
    const dn = res.layer3DirectionalNature;
    assert.ok(["Urdhvamukha (Upward)", "Adhomukha (Downward)", "Tiryangmukha (Sideways)"].includes(dn.signNature));
    assert.ok(dn.meaning.length > 0);
  });

  it("Layer 4 — Badhakasthana & Marakasthana calculates proper house for all 3 sign mobilities", () => {
    const res = calculatePrashna("Will I win the court case?", "legal", 28.6139, 77.2090, 5.5);
    const b = res.layer4Badhaka;
    assert.ok(["Chara (Movable)", "Sthira (Fixed)", "Dvisvabhava (Dual)"].includes(b.lagnaType));
    if (b.lagnaType.includes("Movable")) {
      assert.equal(b.badhakaHouse, 11);
    } else if (b.lagnaType.includes("Fixed")) {
      assert.equal(b.badhakaHouse, 9);
    } else {
      assert.equal(b.badhakaHouse, 7);
    }
    assert.ok(b.badhakesh.length > 0);
    assert.ok(b.explanation.length > 0);
  });

  it("Layer 5 — 16 Tajaka Yogas Engine checks Deeptaamshas and applying aspects", () => {
    const res = calculatePrashna("When will my business succeed?", "finance", 28.6139, 77.2090, 5.5);
    assert.ok(Array.isArray(res.layer5TajakaYogas));
    // Verify Deeptaamsha values adhere strictly to Classical Tajaka standards
    assert.equal(DEEPTAAMSHA.Sun, 15.0);
    assert.equal(DEEPTAAMSHA.Moon, 12.0);
    assert.equal(DEEPTAAMSHA.Jupiter, 9.0);
    assert.equal(DEEPTAAMSHA.Saturn, 9.0);
    assert.equal(DEEPTAAMSHA.Mars, 8.0);
    assert.equal(DEEPTAAMSHA.Mercury, 7.0);
    assert.equal(DEEPTAAMSHA.Venus, 7.0);
  });

  it("Layer 6 — Saham Engine applies Day vs Night calculation properly", () => {
    const res = calculatePrashna("Will I travel abroad?", "travel", 28.6139, 77.2090, 5.5);
    const s = res.layer6Saham;
    assert.ok(s.name.includes("Saham"));
    assert.ok(s.sahamHouse >= 1 && s.sahamHouse <= 12);
    assert.ok(typeof s.isDayChart === "boolean");
    assert.ok(s.formulaDescription.length > 0);
    assert.ok(s.explanation.length > 0);
  });

  it("Layer 7 — KP Horary Mode operates smoothly with Seed Number input (1 to 249)", () => {
    const resSeed = calculatePrashna("Will my loan be approved?", "finance", 28.6139, 77.2090, 5.5, 108);
    const kp = resSeed.layer7KPHorary;
    assert.equal(kp.mode, "kp_number_seed");
    assert.equal(kp.horaryNumber, 108);
    assert.ok(kp.lagnaSignLord.length > 0);
    assert.ok(kp.lagnaStarLord.length > 0);
    assert.ok(kp.lagnaSubLord.length > 0);
    assert.equal(kp.queryCuspNumber, 2); // Finance primary cusp is 2nd
  });

  it("Layer 8 — 5-Fold Ruling Planets (RP) synchronization generates valid status", () => {
    const res = calculatePrashna("Will I clear the exam?", "education", 28.6139, 77.2090, 5.5);
    const rp = res.layer8RulingPlanets;
    assert.ok(["RP_CONFIRMED", "RP_PARTIAL", "RP_DISCORDANT"].includes(rp.status));
    assert.ok(rp.dayLord.length > 0);
    assert.ok(rp.moonSignLord.length > 0);
    assert.ok(rp.moonStarLord.length > 0);
    assert.ok(rp.lagnaSignLord.length > 0);
    assert.ok(rp.lagnaStarLord.length > 0);
  });

  it("Layer 9 & 10 — Phala Prapti Kaala timing and 3-Tier Shastric Verdict with Upayas", () => {
    const res = calculatePrashna("Will I have a child this year?", "child", 28.6139, 77.2090, 5.5);
    // Layer 9: Phala Prapti Kaala
    const timing = res.layer9PhalaPraptiKaala;
    assert.ok(timing.timingText.length > 0);
    assert.ok(["Swift (Days/Weeks)", "Moderate (Weeks/Months)", "Delayed (Months/Years)"].includes(timing.speedCategory));

    // Layer 10: Upaya Recommendation
    const upaya = res.layer10PrashnaUpaya;
    assert.ok(upaya.primaryRemedy.length > 0);
    assert.ok(upaya.deityToPropitiate.length > 0);
    assert.ok(upaya.beneficDirection.length > 0);
    assert.ok(upaya.favorableHoraWindow.length > 0);

    // 3-Tier Shastric Verdict
    assert.ok(["Sadhya (साध्य)", "Krichhra-Sadhya (कृच्छ्र-साध्य)", "Asadhya (असाध्य)"].includes(res.shastricVerdict));
    assert.ok(res.title.length > 0);
    assert.ok(res.detail.length > 0);
  });
});

