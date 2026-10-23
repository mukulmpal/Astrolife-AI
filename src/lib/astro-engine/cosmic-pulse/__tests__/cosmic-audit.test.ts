import test from "node:test";
import assert from "node:assert/strict";
import { calculateChart } from "../../calculations";
import { calculatePanchang } from "../../panchang";
import { buildRadarHorizons } from "../forecast";
import { classifyEventRelevance, prioritizeForecastEvents } from "../forecast/event-relevance";
import type { CosmicForecastEvent } from "../forecast/forecast-types";

test("Cosmic Audit — 1. Constrained Relevance Hierarchy (No Auto-Elevation by Kendra/Trikona alone)", () => {
  const dummyChart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);

  // Exact Natal Hit -> Must be "primary"
  const exactNatalHit: CosmicForecastEvent = {
    id: "test-1",
    type: "transit_hit",
    title: "Saturn Transit over Natal Moon",
    headline: "Reflective focus on emotional discipline",
    planets: ["Saturn", "Moon"],
    aspectType: "Transit Hit",
    targetAngle: 0,
    natalHouse: 1, // Kendra house
    lifeAreas: ["mindset"],
    severity: "critical",
    relevanceTier: "supporting",
    timing: {
      contactAt: new Date("2026-10-01"),
      exactAt: new Date("2026-10-05"),
      peakAt: new Date("2026-10-05"),
      separationAt: new Date("2026-10-10"),
    },
    evidence: {
      aspectType: "Transit Hit",
      planetA: "Saturn",
      planetB: "Moon",
      longitudeA: 10,
      longitudeB: 10,
      exactAspectDeg: 0,
      currentOrbDeg: 0.2, // Near exact
      isApplying: true,
      shastraReference: "Classical Gochara",
    },
    provenance: {
      calculationBasis: ["Ephemeris"],
      searchIntervalDays: 30,
      numericalRefinementMethod: "Root-Finding",
      localTz: 5.5,
    },
  };

  assert.equal(classifyEventRelevance(exactNatalHit, dummyChart), "primary");

  // Minor aspect with wide orb in Kendra house -> Must NOT be elevated to primary solely because of Kendra!
  const wideKendraAspect: CosmicForecastEvent = {
    ...exactNatalHit,
    id: "test-2",
    type: "planetary_aspect",
    targetAngle: 60, // Minor sextile/3rd aspect
    natalHouse: 10, // 10th house Kendra
    timing: {
      contactAt: new Date("2026-10-01"),
      exactAt: undefined,
      peakAt: new Date("2026-10-05"),
      separationAt: new Date("2026-10-10"),
    },
    evidence: {
      ...exactNatalHit.evidence,
      currentOrbDeg: 2.8, // Wide orb
    },
  };

  assert.equal(
    classifyEventRelevance(wideKendraAspect, dummyChart),
    "background",
    "Kendra placement alone must NOT elevate wide minor aspect to primary"
  );
});

test("Cosmic Audit — 2. Multi-Pass Retrograde Monotonicity & Lifecycle Sanity", () => {
  const dummyChart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const panchang = calculatePanchang(new Date("2026-09-21T00:00:00Z"), 5.5, { lat: 28.6139, lon: 77.209 });

  const horizons = buildRadarHorizons({
    chart: dummyChart,
    panchang,
    startDate: new Date("2026-09-21T00:00:00Z"),
    daysAhead: 90,
  });

  const allEvents = [...horizons.next30Days, ...horizons.next90Days];

  // Group by planet pair to detect multi-pass sets
  const passGroups: Record<string, CosmicForecastEvent[]> = {};
  allEvents.forEach((ev) => {
    if (ev.retrogradeInfo && (ev.retrogradeInfo.totalPassesEstimated ?? 1) > 1) {
      const key = `${ev.planets.join("-")}-${ev.targetAngle}`;
      if (!passGroups[key]) passGroups[key] = [];
      passGroups[key].push(ev);
    }
  });

  Object.entries(passGroups).forEach(([key, group]) => {
    if (group.length > 1) {
      for (let i = 1; i < group.length; i++) {
        const prevPeak = (group[i - 1].timing.exactAt || group[i - 1].timing.peakAt).getTime();
        const currPeak = (group[i].timing.exactAt || group[i].timing.peakAt).getTime();
        assert.ok(
          currPeak > prevPeak,
          `Multi-pass timestamps must be strictly monotonic for ${key}: Pass ${group[i].retrogradeInfo?.passNumber} after Pass ${group[i - 1].retrogradeInfo?.passNumber}`
        );

        // Pass 2 must be retrograde
        if (group[i].retrogradeInfo?.passNumber === 2) {
          assert.equal(group[i].retrogradeInfo?.isRetrograde, true);
        }
      }
    }
  });
});

test("Cosmic Audit — 3. Unified Chronological Ordering Across Transits and Dasha", () => {
  const dummyChart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const panchang = calculatePanchang(new Date("2026-09-21T00:00:00Z"), 5.5, { lat: 28.6139, lon: 77.209 });

  const horizons = buildRadarHorizons({
    chart: dummyChart,
    panchang,
    startDate: new Date("2026-09-21T00:00:00Z"),
    daysAhead: 90,
  });

  const allEvents = [...horizons.next30Days, ...horizons.next90Days];

  // Invariant: No event occurs earlier in the array than a previous event
  for (let i = 1; i < allEvents.length; i++) {
    const prevTime = (allEvents[i - 1].timing.exactAt || allEvents[i - 1].timing.peakAt || allEvents[i - 1].timing.contactAt).getTime();
    const currTime = (allEvents[i].timing.exactAt || allEvents[i].timing.peakAt || allEvents[i].timing.contactAt).getTime();
    assert.ok(
      currTime >= prevTime,
      `Unified chronology violated at index ${i}: ${allEvents[i].id} occurs before ${allEvents[i - 1].id}`
    );
  }
});

test("Cosmic Audit — 4. Broad Zero-Score Audit across All Forecast Output", () => {
  const dummyChart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const panchang = calculatePanchang(new Date("2026-09-21T00:00:00Z"), 5.5, { lat: 28.6139, lon: 77.209 });

  const horizons = buildRadarHorizons({
    chart: dummyChart,
    panchang,
    startDate: new Date("2026-09-21T00:00:00Z"),
    daysAhead: 90,
  });

  const allEvents = [...horizons.next30Days, ...horizons.next90Days];
  const bannedKeys = ["score", "rating", "rank", "prioritynumber", "confidencepercent", "strengthpercent", "impactpercent"];

  allEvents.forEach((ev) => {
    // Assert no banned property exists
    Object.keys(ev).forEach((key) => {
      assert.equal(
        bannedKeys.includes(key.toLowerCase()),
        false,
        `Banned score property '${key}' found in event ${ev.id}`
      );
    });

    // Assert user-facing text contains no score representation
    const text = `${ev.title} ${ev.headline}`.toLowerCase();
    assert.equal(text.includes("/100"), false, "Must not contain /100 score");
    assert.equal(text.includes("score:"), false, "Must not contain score:");
    assert.equal(text.includes("rating:"), false, "Must not contain rating:");
    assert.equal(text.includes("confidence:"), false, "Must not contain confidence:");
  });
});

test("Cosmic Audit — 5. Tone & Shastra Neutralization (Descriptive + Contextual)", () => {
  const dummyChart = calculateChart("Delhi", "1995-05-15", "14:30", "Delhi", 28.6139, 77.209, 5.5);
  const panchang = calculatePanchang(new Date("2026-09-21T00:00:00Z"), 5.5, { lat: 28.6139, lon: 77.209 });

  const horizons = buildRadarHorizons({
    chart: dummyChart,
    panchang,
    startDate: new Date("2026-09-21T00:00:00Z"),
    daysAhead: 90,
  });

  const allEvents = [...horizons.next30Days, ...horizons.next90Days];
  const bannedTone = ["fatal", "disaster", "ruined", "doomed", "calamity", "catastrophe", "terrible fate", "bad luck"];

  allEvents.forEach((ev) => {
    const text = `${ev.title} ${ev.headline}`.toLowerCase();
    bannedTone.forEach((word) => {
      assert.equal(text.includes(word), false, `Alarmist word '${word}' found in event ${ev.id}`);
    });

    // Verify classical framework attribution
    assert.ok(
      ev.evidence.shastraReference.includes("Classical"),
      `Event ${ev.id} must cite authentic Classical framework`
    );
  });
});
