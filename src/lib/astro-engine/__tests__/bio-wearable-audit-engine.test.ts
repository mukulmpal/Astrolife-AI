// src/lib/astro-engine/__tests__/bio-wearable-audit-engine.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  auditUserWearables,
  PRESET_MANISHA_ITEMS,
  type WornItemInput,
} from "../bio-wearable-audit-engine";
import type { ChartData } from "../calculations";

describe("Bio-Magnetic Wearable, Gemstone & Thread Audit Engine", () => {
  const manishaChart: ChartData = {
    name: "Manisha",
    dob: "1993-12-06",
    tob: "12:30:00",
    city: "Delhi",
    lagnaRashi: "Aquarius",
    lagnaNum: 11,
    lagnaLon: 318.25,
    dashas: [{ planet: "Mars", active: true, start: new Date("2026-06-27"), end: new Date("2033-06-26") }],
    antardasha: [{ planet: "Mars", active: true, start: new Date("2026-06-27"), end: new Date("2026-11-23") }],
    planets: {
      Sun: { sign: "Scorpio", signNum: 8, degree: 20, minutes: 24, house: 10, lon: 230.40, nakshatra: "Jyeshtha", nakshatraLord: "Mercury" },
      Moon: { sign: "Leo", signNum: 5, degree: 15, minutes: 37, house: 7, lon: 135.62, nakshatra: "Purva Phalguni", nakshatraLord: "Venus" },
      Mars: { sign: "Scorpio", signNum: 8, degree: 25, minutes: 57, house: 10, lon: 235.95, nakshatra: "Jyeshtha", nakshatraLord: "Mercury" },
      Mercury: { sign: "Scorpio", signNum: 8, degree: 5, minutes: 6, house: 10, lon: 215.10, nakshatra: "Anuradha", nakshatraLord: "Saturn" },
      Jupiter: { sign: "Libra", signNum: 7, degree: 11, minutes: 30, house: 9, lon: 191.50, nakshatra: "Swati", nakshatraLord: "Rahu" },
      Venus: { sign: "Scorpio", signNum: 8, degree: 10, minutes: 22, house: 10, lon: 220.37, nakshatra: "Anuradha", nakshatraLord: "Saturn" },
      Saturn: { sign: "Aquarius", signNum: 11, degree: 1, minutes: 9, house: 1, lon: 301.15, nakshatra: "Dhanishtha", nakshatraLord: "Mars" },
      Rahu: { sign: "Scorpio", signNum: 8, degree: 8, minutes: 41, house: 10, lon: 218.68, nakshatra: "Anuradha", nakshatraLord: "Saturn" },
      Ketu: { sign: "Taurus", signNum: 2, degree: 8, minutes: 41, house: 4, lon: 38.68, nakshatra: "Krittika", nakshatraLord: "Sun" },
    },
    houseCusps: [
      { house: 1, sign: "Aquarius", signNum: 11 },
      { house: 2, sign: "Pisces", signNum: 12 },
      { house: 3, sign: "Aries", signNum: 1 },
      { house: 4, sign: "Taurus", signNum: 2 },
      { house: 5, sign: "Gemini", signNum: 3 },
      { house: 6, sign: "Cancer", signNum: 4 },
      { house: 7, sign: "Leo", signNum: 5 },
      { house: 8, sign: "Virgo", signNum: 6 },
      { house: 9, sign: "Libra", signNum: 7 },
      { house: 10, sign: "Scorpio", signNum: 8 },
      { house: 11, sign: "Sagittarius", signNum: 9 },
      { house: 12, sign: "Capricorn", signNum: 10 },
    ],
  } as unknown as ChartData;

  it("should accurately audit Manisha's 5 preset items as CRITICAL_REMOVE", () => {
    const dossier = auditUserWearables(manishaChart, PRESET_MANISHA_ITEMS, new Date("2026-10-20"));
    assert.ok(dossier);
    assert.equal(dossier.nativeName, "Manisha");
    assert.equal(dossier.activeMahadasha, "Mars");
    assert.equal(dossier.itemsAudited.length, 5);

    // Copper in Index finger
    const copperItem = dossier.itemsAudited.find(i => i.item === "copper");
    assert.ok(copperItem);
    assert.equal(copperItem.severity, "CRITICAL_REMOVE");
    assert.ok(copperItem.badgeText.includes("उतारें"));

    // Red mouli on wrist during Mars Dasha with 180° hit
    const mouliItem = dossier.itemsAudited.find(i => i.item === "red_mouli");
    assert.ok(mouliItem);
    assert.equal(mouliItem.severity, "CRITICAL_REMOVE");

    // Heavy steel kada on wrist
    const steelItem = dossier.itemsAudited.find(i => i.item === "steel_heavy");
    assert.ok(steelItem);
    assert.equal(steelItem.severity, "CRITICAL_REMOVE");

    // Silver ghungroo on feet mixed with black thread (Vish yoga)
    const ghungrooItem = dossier.itemsAudited.find(i => i.item === "silver_ghungroo");
    assert.ok(ghungrooItem);
    assert.equal(ghungrooItem.severity, "CRITICAL_REMOVE");
    assert.ok(ghungrooItem.badgeText.includes("विष योग"));

    assert.equal(dossier.criticalRemoveCount >= 4, true);
  });

  it("should approve Gold Chain in Neck as SAFE_BENEFICIAL", () => {
    const items: WornItemInput[] = [
      { id: "gold-neck", location: "neck", item: "gold" },
    ];
    const dossier = auditUserWearables(manishaChart, items);
    const goldItem = dossier.itemsAudited[0];
    assert.equal(goldItem.severity, "SAFE_BENEFICIAL");
    assert.ok(goldItem.badgeText.includes("कल्याणकारी"));
    assert.equal(goldItem.associatedHouseNum, 4, "Neck (Taurus - Sign 2) is 4th House for Aquarius Lagna");
  });

  it("should approve Solid Silver Kada on Wrist as SAFE_BENEFICIAL", () => {
    const items: WornItemInput[] = [
      { id: "silver-wrist", location: "wrist_right", item: "silver" },
    ];
    const dossier = auditUserWearables(manishaChart, items);
    const silverItem = dossier.itemsAudited[0];
    assert.equal(silverItem.severity, "SAFE_BENEFICIAL");
    assert.ok(silverItem.badgeText.includes("शांतिकारक"));
  });

  it("should strictly reject Black Thread in Neck", () => {
    const items: WornItemInput[] = [
      { id: "black-neck", location: "neck", item: "black_thread" },
    ];
    const dossier = auditUserWearables(manishaChart, items);
    const item = dossier.itemsAudited[0];
    assert.equal(item.severity, "CRITICAL_REMOVE");
    assert.ok(item.badgeText.includes("वर्जित"));
  });

  it("should approve single Black Thread on Ankle", () => {
    const items: WornItemInput[] = [
      { id: "black-ankle", location: "ankle_left", item: "black_thread" },
    ];
    const dossier = auditUserWearables(manishaChart, items);
    const item = dossier.itemsAudited[0];
    assert.equal(item.severity, "SAFE_BENEFICIAL");
    assert.ok(item.badgeText.includes("रक्षा सूत्र"));
  });

  it("should evaluate Waist items accurately", () => {
    const items: WornItemInput[] = [
      { id: "tagdi", location: "waist", item: "silver_tagdi" },
    ];
    const dossier = auditUserWearables(manishaChart, items);
    const item = dossier.itemsAudited[0];
    assert.equal(item.severity, "SAFE_BENEFICIAL");
  });
});
