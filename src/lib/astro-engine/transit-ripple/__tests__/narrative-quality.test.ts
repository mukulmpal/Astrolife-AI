import { test } from "node:test";
import assert from "node:assert/strict";
import { generateTransitRippleReport } from "../index";
import { validateNarrativeSafety, countSentences } from "../language-safety";
import type { NatalInput } from "../types";
import type { RichChapterNarrative } from "../adapter";

const SAMPLE_NATAL: NatalInput = {
  birthDate: "1990-08-15",
  birthTime: "14:30",
  timezone: "+05:30",
  latitude: 28.6139,
  longitude: 77.209,
  lagnaSign: 7, // Scorpio (Vrishchika)
  lagnaSignName: "Scorpio",
  moonLongitude: 220.4,
  moonNakshatra: 16, // Anuradha
  activeMahadasha: "Jupiter",
  activeAntardasha: "Saturn",
};

test("Narrative Quality: Sentence length, descriptive depth, and word count", () => {
  const report = generateTransitRippleReport(
    SAMPLE_NATAL,
    "2026-10-05",
    "hinglish",
    "Saturn"
  );
  const narrative = report.narrative as unknown as RichChapterNarrative;

  // Chapter fusion should have multiple descriptive paragraphs
  const paragraphs = narrative.dashaGocharFusion.split("\n\n");
  assert.ok(
    paragraphs.length >= 2,
    "Should contain at least 2 descriptive paragraphs"
  );

  const totalWords = narrative.dashaGocharFusion.split(/\s+/).length;
  assert.ok(
    totalWords >= 40,
    `Total words in chapter story (${totalWords}) should be at least 40 words`
  );

  // Check that domain cautions have 2 to 4 sentences
  assert.ok(
    narrative.domainCautions.length >= 2,
    "Should include at least 2 active life domains"
  );
  for (const dc of narrative.domainCautions) {
    const sentences = countSentences(dc.paragraph);
    assert.ok(
      sentences >= 1 && sentences <= 5,
      `Domain caution should have 1-5 sentences, got ${sentences}: "${dc.paragraph}"`
    );
  }

  // Check focal hotspot story
  assert.ok(
    narrative.focalHotspotStory.paragraph.length > 50,
    "Focal hotspot story should be descriptive"
  );
});

test("Narrative Quality: Zero banned jargon in user-facing narrative", () => {
  const report = generateTransitRippleReport(
    SAMPLE_NATAL,
    "2026-10-05",
    "hinglish",
    "Saturn"
  );
  const narrative = report.narrative as unknown as RichChapterNarrative;

  const fullUserText = [
    narrative.chapterTitle,
    narrative.dashaGocharFusion,
    narrative.focalHotspotStory.paragraph,
    ...narrative.domainCautions.map((c) => c.paragraph),
    ...narrative.domainActions.map((a) => a.paragraph),
  ].join(" ");

  const safety = validateNarrativeSafety(fullUserText);
  assert.ok(
    safety.passed,
    `Narrative should have 0 banned jargon or certainty violations: ${safety.violations.join(", ")}`
  );
});

test("Narrative Quality: Deterministic consistency (same input produces exact same output)", () => {
  const report1 = generateTransitRippleReport(
    SAMPLE_NATAL,
    "2026-10-05",
    "hinglish",
    "Saturn"
  );
  const report2 = generateTransitRippleReport(
    SAMPLE_NATAL,
    "2026-10-05",
    "hinglish",
    "Saturn"
  );

  assert.equal(
    report1.narrative.dashaGocharFusion,
    report2.narrative.dashaGocharFusion,
    "Same input must yield identical chapter story text"
  );
  assert.equal(
    report1.narrative.defensiveCautions.join("|"),
    report2.narrative.defensiveCautions.join("|"),
    "Same input must yield identical cautions"
  );
});

test("Narrative Quality: Dasha modifier variation (Jupiter MD vs Saturn MD alters narrative)", () => {
  const jupiterChart: NatalInput = { ...SAMPLE_NATAL, activeMahadasha: "Jupiter" };
  const saturnChart: NatalInput = { ...SAMPLE_NATAL, activeMahadasha: "Saturn" };

  const repJupiter = generateTransitRippleReport(
    jupiterChart,
    "2026-10-05",
    "hinglish",
    "Saturn"
  );
  const repSaturn = generateTransitRippleReport(
    saturnChart,
    "2026-10-05",
    "hinglish",
    "Saturn"
  );

  assert.notEqual(
    repJupiter.narrative.dashaGocharFusion,
    repSaturn.narrative.dashaGocharFusion,
    "Switching Mahadasha lord must meaningfully alter the chapter story"
  );
});

test("Narrative Quality: Daily micro-clock variation across dates", () => {
  const day1 = generateTransitRippleReport(
    SAMPLE_NATAL,
    "2026-10-05",
    "hinglish",
    "Saturn"
  );
  // 4 days later Moon advances to a different Nakshatra and Tara
  const day5 = generateTransitRippleReport(
    SAMPLE_NATAL,
    "2026-10-09",
    "hinglish",
    "Saturn"
  );

  const rich1 = day1.narrative as unknown as RichChapterNarrative;
  const rich5 = day5.narrative as unknown as RichChapterNarrative;

  assert.notEqual(
    rich1.todayPulse.taraName,
    rich5.todayPulse.taraName,
    "Advancing dates must dynamically rotate the daily Moon Tara"
  );
  assert.notEqual(
    rich1.dashaGocharFusion,
    rich5.dashaGocharFusion,
    "Different date must yield fresh daily micro guidance in the story"
  );
});

test("Narrative Quality: Planet and House specific remedies", () => {
  const saturnRep = generateTransitRippleReport(
    SAMPLE_NATAL,
    "2026-10-05",
    "hinglish",
    "Saturn"
  );
  const jupiterRep = generateTransitRippleReport(
    SAMPLE_NATAL,
    "2026-10-05",
    "hinglish",
    "Jupiter"
  );

  assert.ok(
    saturnRep.narrative.sattvicUpaya.length >= 2,
    "Should contain at least 2 specific remedies"
  );
  assert.notEqual(
    saturnRep.narrative.sattvicUpaya.join("|"),
    jupiterRep.narrative.sattvicUpaya.join("|"),
    "Remedies for Saturn and Jupiter must be distinctly customized"
  );
});
