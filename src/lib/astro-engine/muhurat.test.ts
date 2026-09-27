import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluateDateMuhurat, scanAuspiciousMuhurats, type MuhuratCategory } from "./muhurat";

test("Muhurat Engine — Evaluates Vivah Muhurat with classical criteria", () => {
  const date = new Date("2026-10-15");
  const result = evaluateDateMuhurat(date, "marriage", 5.5, { lat: 28.6139, lon: 77.2090 });

  assert.ok(result.date);
  assert.ok(result.weekday);
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.ok(["Highly Auspicious", "Favorable", "Neutral", "Avoid"].includes(result.rating));
  assert.ok(result.criteria.length >= 4);

  // Every criterion MUST have an authentic classical shastra citation
  result.criteria.forEach((crit) => {
    assert.ok(crit.citation.length > 5, `Missing classical citation for ${crit.name}`);
    assert.ok(["pass", "caution", "fail"].includes(crit.status));
  });
});

test("Muhurat Engine — Correctly identifies Rikta or Amavasya tithis", () => {
  // Scan 30 days to ensure Rikta tithis are properly detected
  const scanned = scanAuspiciousMuhurats({
    category: "business",
    startDate: new Date("2026-10-01"),
    daysToScan: 30,
  });

  assert.equal(scanned.length, 30);

  // Results should be sorted descending by score
  for (let i = 0; i < scanned.length - 1; i++) {
    assert.ok(scanned[i].score >= scanned[i + 1].score);
  }

  // Any date with Amavasya or Rikta tithi should have a failing Tithi criterion
  const riktaDate = scanned.find((s) => s.criteria.some((c) => c.factor === "Tithi" && c.status === "fail"));
  assert.ok(riktaDate, "Expected at least one Rikta or Amavasya day in 30-day scan");
});

test("Muhurat Engine — Personalized Tara Bala enrichment", () => {
  const date = new Date("2026-10-15");
  const unpersonalized = evaluateDateMuhurat(date, "marriage", 5.5);
  const personalized = evaluateDateMuhurat(date, "marriage", 5.5, { lat: 28.6139, lon: 77.2090 }, "Rohini");

  assert.equal(unpersonalized.isPersonalized, false);
  assert.equal(personalized.isPersonalized, true);
  assert.ok(personalized.criteria.some((c) => c.factor === "Navtara"));
});
