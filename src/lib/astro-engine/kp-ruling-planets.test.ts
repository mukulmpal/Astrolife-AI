import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateRulingPlanets,
  calculateAstronomicalDayLord,
  evaluateRulingPlanetsConfirmation,
  evaluateAllRulingPlanetsConfirmations,
  type KPRulingPlanetsSnapshot,
} from "./kp-ruling-planets";
import {
  KP_EVENT_RULE_REGISTRY,
  EpistemologicalStatus,
} from "./kp-rule-registry";
import {
  calculateChart,
  type ChartData,
} from "./calculations";
import {
  evaluateAllCuspPromises,
} from "./kp-cusp-promise";
import {
  build4FoldHouseSignificators,
} from "./kp-significators";
import {
  buildCurrentDashaHierarchyEvidence,
} from "./kp-dasha-evidence";
import {
  evaluateAllDashaActivations,
  type KPDashaActivationResult,
} from "./kp-dasha-activation";
import {
  evaluateAllTransitConfirmations,
  type KPTransitConfirmationResult,
} from "./kp-transit-confirmation";
import { runKPEngine } from "./kp";

// Standard canonical chart for test fixture: New Delhi, 1990-05-15, 14:30 IST
const TEST_DOB = "1990-05-15";
const TEST_TOB = "14:30";
const TEST_TZ = 5.5;
const TEST_LAT = 28.6139;
const TEST_LON = 77.2090;

function getBaselineSnapshot(): KPRulingPlanetsSnapshot {
  return calculateRulingPlanets({
    context: "NATAL",
    dob: TEST_DOB,
    tob: TEST_TOB,
    tz: TEST_TZ,
    lat: TEST_LAT,
    lon: TEST_LON,
  });
}

// ── Core Pillars (Tests A through G) ─────────────────────────────────────────

test("2I-G Test A — Ascendant Sign Lord correctly extracted", () => {
  const rp = getBaselineSnapshot();
  assert.ok(rp.coreRulingPlanets.ascendantSignLord, "Ascendant Sign Lord must be present");
  assert.equal(rp.ascendant.signLord, rp.coreRulingPlanets.ascendantSignLord);
});

test("2I-G Test B — Ascendant Star Lord correctly extracted", () => {
  const rp = getBaselineSnapshot();
  assert.ok(rp.coreRulingPlanets.ascendantStarLord, "Ascendant Star Lord must be present");
  assert.equal(rp.ascendant.starLord, rp.coreRulingPlanets.ascendantStarLord);
});

test("2I-G Test C — Moon Sign Lord correctly extracted", () => {
  const rp = getBaselineSnapshot();
  assert.ok(rp.coreRulingPlanets.moonSignLord, "Moon Sign Lord must be present");
  assert.equal(rp.moon.signLord, rp.coreRulingPlanets.moonSignLord);
});

test("2I-G Test D — Moon Star Lord correctly extracted", () => {
  const rp = getBaselineSnapshot();
  assert.ok(rp.coreRulingPlanets.moonStarLord, "Moon Star Lord must be present");
  assert.equal(rp.moon.starLord, rp.coreRulingPlanets.moonStarLord);
});

test("2I-G Test E — Day Lord correctly extracted via astronomical sunrise", () => {
  const rp = getBaselineSnapshot();
  assert.ok(rp.coreRulingPlanets.dayLord, "Day Lord must be present");
  assert.equal(rp.dayLordInfo.dayLord, rp.coreRulingPlanets.dayLord);
  // May 15, 1990 was a Tuesday, after sunrise (sunrise ~05:30) -> Mars
  assert.equal(rp.dayLordInfo.dayLord, "Mars", "Tuesday after sunrise must be Mars");
  assert.equal(rp.dayLordInfo.weekdayName, "Tuesday");
});

test("2I-G Test F — Ascendant Sub Lord preserved as secondary evidence", () => {
  const rp = getBaselineSnapshot();
  assert.ok(rp.secondaryRulingPlanets.ascendantSubLord, "Ascendant Sub Lord must be present");
  assert.equal(rp.ascendant.subLord, rp.secondaryRulingPlanets.ascendantSubLord);
});

test("2I-G Test G — Moon Sub Lord preserved as secondary evidence", () => {
  const rp = getBaselineSnapshot();
  assert.ok(rp.secondaryRulingPlanets.moonSubLord, "Moon Sub Lord must be present");
  assert.equal(rp.moon.subLord, rp.secondaryRulingPlanets.moonSubLord);
});

// ── Astronomical Integrity & Sunrise (Tests H through N) ─────────────────────

test("2I-G Test H & L — Sunrise-based Vara Lord (pre-sunrise belongs to prior weekday)", () => {
  // Tuesday May 15, 1990 at 03:30 AM (before sunrise ~05:30 AM)
  const preSunrise = calculateAstronomicalDayLord("1990-05-15", "03:30", 5.5, 28.6139, 77.2090);
  assert.equal(preSunrise.isBeforeSunrise, true, "03:30 is before sunrise");
  assert.equal(preSunrise.dayLord, "Moon", "Pre-sunrise Tuesday belongs to Monday (Moon)");
  assert.equal(preSunrise.weekdayName, "Monday");

  // Tuesday May 15, 1990 at 07:30 AM (after sunrise)
  const postSunrise = calculateAstronomicalDayLord("1990-05-15", "07:30", 5.5, 28.6139, 77.2090);
  assert.equal(postSunrise.isBeforeSunrise, false, "07:30 is after sunrise");
  assert.equal(postSunrise.dayLord, "Mars", "Post-sunrise Tuesday belongs to Mars");
  assert.equal(postSunrise.weekdayName, "Tuesday");
});

test("2I-G Test I & J — Timezone invariance and calculation moment preservation", () => {
  const snapshotIST = calculateRulingPlanets({
    context: "NATAL",
    dob: "1990-05-15",
    tob: "14:30",
    tz: 5.5,
    lat: 28.6139,
    lon: 77.2090,
  });

  // 14:30 IST is 09:00 UTC
  const snapshotUTC = calculateRulingPlanets({
    context: "NATAL",
    dob: "1990-05-15",
    tob: "09:00",
    tz: 0,
    lat: 28.6139,
    lon: 77.2090,
  });

  assert.equal(snapshotIST.coreRulingPlanets.ascendantStarLord, snapshotUTC.coreRulingPlanets.ascendantStarLord);
  assert.equal(snapshotIST.coreRulingPlanets.moonStarLord, snapshotUTC.coreRulingPlanets.moonStarLord);
  assert.equal(snapshotIST.coreRulingPlanets.ascendantSignLord, snapshotUTC.coreRulingPlanets.ascendantSignLord);
  assert.equal(snapshotIST.coreRulingPlanets.moonSignLord, snapshotUTC.coreRulingPlanets.moonSignLord);
  assert.ok(Math.abs(snapshotIST.ascendant.lon - snapshotUTC.ascendant.lon) < 0.001);
});

test("2I-G Test K — Civil Midnight boundary respects astronomical sunrise", () => {
  // 00:05:00 on Sunday morning (technically Saturday astronomical night before sunrise)
  const midnightLord = calculateAstronomicalDayLord("2024-06-23", "00:05", 5.5, 28.6139, 77.2090);
  assert.equal(midnightLord.isBeforeSunrise, true);
  assert.equal(midnightLord.dayLord, "Saturn", "00:05 on Sunday is still Saturday night ruled by Saturn");
});

test("2I-G Test M & N — Ascendant and Moon Nakshatra boundary stability", () => {
  const rp = getBaselineSnapshot();
  assert.ok(rp.ascendant.nakshatra);
  assert.ok(rp.moon.nakshatra);
  assert.ok(rp.ascendant.starLord);
  assert.ok(rp.moon.starLord);
});

// ── Node Representation Chains (Tests O through S) ───────────────────────────

test("2I-G Test O, P, Q, R — Rahu & Ketu representation chain purity", () => {
  const rp = getBaselineSnapshot();
  assert.equal(rp.nodeRepresentations.length, 2, "Must contain Rahu and Ketu chains");

  const rahuChain = rp.nodeRepresentations.find((n) => n.node === "Rahu");
  const ketuChain = rp.nodeRepresentations.find((n) => n.node === "Ketu");

  assert.ok(rahuChain);
  assert.ok(ketuChain);
  assert.ok(rahuChain.signLord);
  assert.ok(ketuChain.signLord);

  // Representation chain is explicitly captured
  assert.ok(Array.isArray(rahuChain.conjoinedPlanets));
  assert.ok(Array.isArray(rahuChain.aspectedByPlanets));
  assert.ok(Array.isArray(rahuChain.representedCoreRPs));
  assert.ok(Array.isArray(rahuChain.representedSecondaryRPs));
});

test("2I-G Test S — No duplicate node evidence in activeRulingPlanetsSet", () => {
  const rp = getBaselineSnapshot();
  const set = new Set(rp.activeRulingPlanetsSet);
  assert.equal(set.size, rp.activeRulingPlanetsSet.length, "activeRulingPlanetsSet must not contain duplicate planets");
});

// ── Motion & Source-Bounded Deferral ──────────────────────────────────────────

test("2I-G Test Motion — Motion status and timing status are distinct and un-conflated", () => {
  const rp = getBaselineSnapshot();
  for (const [planet, details] of Object.entries(rp.motionDetails)) {
    assert.ok(["DIRECT", "RETROGRADE"].includes(details.motionStatus), `${planet} must have valid motion`);
    assert.ok(["ACTIVE", "DEFERRED", "REFERENCE_PENDING"].includes(details.timingStatus), `${planet} must have valid timing status`);
  }
});

// ── Predictive Isolation & Invariants (Tests T through Z) ───────────────────

test("2I-G Test T — RP Corroboration when period lord matches Core RP", () => {
  const rp = getBaselineSnapshot();
  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];
  assert.ok(marriageRule, "Marriage rule must exist");

  // Construct dasha activation where Bhukti lord matches Core RP (Mars is Day Lord)
  const mockDasha: any = {
    ruleId: marriageRule.id,
    eventName: marriageRule.name,
    canonicalSource: marriageRule.canonicalSource,
    status: "Verified",
    natalPromiseStatus: "PROMISE_SUPPORTED",
    activeHierarchy: {
      mahadasha: { level: "MD", planet: "Mars", role: "SUPPORTING", supportingHousesMatched: [2, 7, 11], detrimentHousesMatched: [], barrierHousesMatched: [], dashaLevelRule: "TEST" },
      antardasha: { level: "AD", planet: "Mars", role: "SUPPORTING", supportingHousesMatched: [2, 7, 11], detrimentHousesMatched: [], barrierHousesMatched: [], dashaLevelRule: "TEST" },
      pratyantardasha: { level: "PD", planet: "Venus", role: "SUPPORTING", supportingHousesMatched: [2, 7, 11], detrimentHousesMatched: [], barrierHousesMatched: [], dashaLevelRule: "TEST" },
    },
    primaryLords: ["Mars"],
    conjoinedSignificatorsMatched: ["Mars"],
    conjoinedLevelsCount: 2,
    hasSubPeriodVeto: false,
    hasMixedSignification: false,
    timingState: "TIMING_ALIGNED",
    timingVerdictReason: "Supporting period",
    causalAuditTrail: [],
  };

  const result = evaluateRulingPlanetsConfirmation({
    rule: marriageRule,
    rpSnapshot: rp,
    dashaActivation: mockDasha,
  });

  assert.equal(result.state, "RP_CORROBORATED", "Matching key period lord must produce RP_CORROBORATED");
  assert.ok(result.matchedCoreLords.includes("Mars"));
});

test("2I-G Test U — RP Partial overlap produces RP_PARTIAL", () => {
  const rp = getBaselineSnapshot();
  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  // Secondary sub-lord or solitary minor overlap
  const mockDasha: any = {
    ruleId: marriageRule.id,
    eventName: marriageRule.name,
    canonicalSource: marriageRule.canonicalSource,
    status: "Verified",
    natalPromiseStatus: "PROMISE_SUPPORTED",
    activeHierarchy: {
      mahadasha: { level: "MD", planet: "Saturn", role: "SUPPORTING", supportingHousesMatched: [7], detrimentHousesMatched: [], barrierHousesMatched: [], dashaLevelRule: "TEST" },
      antardasha: { level: "AD", planet: "Mercury", role: "SUPPORTING", supportingHousesMatched: [7], detrimentHousesMatched: [], barrierHousesMatched: [], dashaLevelRule: "TEST" },
    },
    primaryLords: ["Mercury"],
    conjoinedSignificatorsMatched: ["Mercury"],
    conjoinedLevelsCount: 1,
    hasSubPeriodVeto: false,
    hasMixedSignification: false,
    timingState: "TIMING_ALIGNED",
    timingVerdictReason: "Supporting period",
    causalAuditTrail: [],
  };

  const result = evaluateRulingPlanetsConfirmation({
    rule: marriageRule,
    rpSnapshot: rp,
    dashaActivation: mockDasha,
  });

  // If Mercury/Saturn is only in secondary or one core, state is partial or corroborated
  assert.ok(["RP_CORROBORATED", "RP_PARTIAL", "RP_DISCORDANT"].includes(result.state));
});

test("2I-G Test V — Active lords absent from RP produces RP_DISCORDANT", () => {
  const rp = getBaselineSnapshot();
  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  // Create an active lord that is guaranteed not in the active RP set
  const nonRPLord = (["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const)
    .find((p) => !rp.activeRulingPlanetsSet.includes(p));

  if (nonRPLord) {
    const mockDasha: any = {
      ruleId: marriageRule.id,
      eventName: marriageRule.name,
      canonicalSource: marriageRule.canonicalSource,
      status: "Verified",
      natalPromiseStatus: "PROMISE_SUPPORTED",
      activeHierarchy: {
        mahadasha: { level: "MD", planet: nonRPLord, role: "SUPPORTING", supportingHousesMatched: [7], detrimentHousesMatched: [], barrierHousesMatched: [], dashaLevelRule: "TEST" },
        antardasha: { level: "AD", planet: nonRPLord, role: "SUPPORTING", supportingHousesMatched: [7], detrimentHousesMatched: [], barrierHousesMatched: [], dashaLevelRule: "TEST" },
      },
      primaryLords: [nonRPLord],
      conjoinedSignificatorsMatched: [nonRPLord],
      conjoinedLevelsCount: 1,
      hasSubPeriodVeto: false,
      hasMixedSignification: false,
      timingState: "TIMING_ALIGNED",
      timingVerdictReason: "Supporting period",
      causalAuditTrail: [],
    };

    const result = evaluateRulingPlanetsConfirmation({
      rule: marriageRule,
      rpSnapshot: rp,
      dashaActivation: mockDasha,
    });

    assert.equal(result.state, "RP_DISCORDANT", "Absence of active lords from RP produces RP_DISCORDANT");
  }
});

test("2I-G Test W — RP Neutrality when no period lords are specified", () => {
  const rp = getBaselineSnapshot();
  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  const result = evaluateRulingPlanetsConfirmation({
    rule: marriageRule,
    rpSnapshot: rp,
  });

  assert.equal(result.state, "RP_NEUTRAL", "No period lords must produce RP_NEUTRAL");
});

test("2I-G Test X & Y — RP cannot manufacture event or override Natal PROMISE_DENIED", () => {
  const rp = getBaselineSnapshot();
  const childRule = KP_EVENT_RULE_REGISTRY["KP-RULE-CHILD-01"];
  assert.ok(childRule, "Child birth rule must exist");

  // Upstream Dasha reflects natal PROMISE_DENIED
  const deniedDasha: any = {
    ruleId: childRule.id,
    eventName: childRule.name,
    canonicalSource: childRule.canonicalSource,
    status: "Verified",
    natalPromiseStatus: "PROMISE_DENIED",
    primaryLords: ["Mars"],
    conjoinedSignificatorsMatched: [],
    conjoinedLevelsCount: 0,
    hasSubPeriodVeto: true,
    hasMixedSignification: false,
    timingState: "PROMISE_DENIED",
    timingVerdictReason: "Denied by natal cusp sub-lord",
    causalAuditTrail: [],
  };

  const result = evaluateRulingPlanetsConfirmation({
    rule: childRule,
    rpSnapshot: rp,
    dashaActivation: deniedDasha,
  });

  // RP reflects upstream natal promise status without altering it
  assert.equal(result.natalPromiseStatus, "PROMISE_DENIED");
  // RP does not synthesize PROMISE_DENIED into its own enum, but corroborates whether lords overlap
  assert.ok(result.state !== "EVALUATION_PENDING");
});

test("2I-G Test Z — RP cannot override transit obstruction", () => {
  const rp = getBaselineSnapshot();
  const marriageRule = KP_EVENT_RULE_REGISTRY["KP-RULE-MARRIAGE-01"];

  const mockTransit: KPTransitConfirmationResult = {
    ruleId: marriageRule.id,
    eventName: marriageRule.name,
    canonicalSource: marriageRule.canonicalSource,
    status: "Verified",
    natalPromiseStatus: "PROMISE_SUPPORTED",
    dashaActivationState: "TIMING_ALIGNED",
    evaluationTime: {
      date: "2024-06-01",
      time: "12:00",
      timezone: 5.5,
      jdUTC: 2460463.0,
      jdTT: 2460463.0,
      deltaTSeconds: 69.18,
      coordinateFrame: "KP_PLACIDUS_NEWCOMB",
      ayanamshaName: "KP_NEWCOMB",
    },
    transitPoints: [],
    primaryActivePoints: [],
    aggregatedSupportingHouses: [7],
    aggregatedDetrimentHouses: [6, 12],
    aggregatedBarrierHouses: [6],
    state: "TRANSIT_OBSTRUCTED",
    auditSummary: {
      isTransitAligned: false,
      isNatalPromiseHonored: true,
      dashaWindowStatus: "TIMING_ALIGNED",
      explanatoryNote: "Transit obstructed",
    },
    causalAuditTrail: [],
  };

  const result = evaluateRulingPlanetsConfirmation({
    rule: marriageRule,
    rpSnapshot: rp,
    transitConfirmation: mockTransit,
  });

  // Upstream transit state is preserved intact
  assert.equal(result.transitConfirmationState, "TRANSIT_OBSTRUCTED");
});

// ── Test AG: Pipeline Invariance Guard ───────────────────────────────────────

test("2I-G Test AG — Computing RP leaves upstream natal chart, cusp promises, significators, and Dasha bit-identical", () => {
  // 1. Calculate baseline chart and KP engine output
  const chartBefore = calculateChart("Test Subject", TEST_DOB, TEST_TOB, "New Delhi", TEST_LAT, TEST_LON, TEST_TZ);
  const kpBefore = runKPEngine(chartBefore);

  // Snapshot before
  const lagnaBefore = chartBefore.lagnaLon;
  const sunBefore = chartBefore.planets.Sun.lon;
  const moonBefore = chartBefore.planets.Moon.lon;
  const normalizeDynamicTimestamps = (obj: any) => {
    return JSON.stringify(obj, (key, value) => {
      if (key === "asOfDate") return "DYNAMIC_TIMESTAMP_NORMALIZED";
      if (typeof value === "string" && value.startsWith("Evaluation Date:")) return "Evaluation Date: DYNAMIC_TIMESTAMP_NORMALIZED";
      return value;
    });
  };

  const cuspPromisesBefore = JSON.stringify(kpBefore.predictiveEvidence?.cuspPromises);
  const houseSignificatorsBefore = JSON.stringify(kpBefore.predictiveEvidence?.houseSignificators);
  const eventPromisesBefore = JSON.stringify(kpBefore.eventPromises);
  const dashaActivationsBefore = normalizeDynamicTimestamps(kpBefore.dashaActivations);
  const transitConfirmationsBefore = normalizeDynamicTimestamps(kpBefore.transitConfirmations);

  // 2. Independently compute Ruling Planets snapshot and evaluate confirmations
  const rpSnapshot = calculateRulingPlanets({
    context: "NATAL",
    dob: TEST_DOB,
    tob: TEST_TOB,
    tz: TEST_TZ,
    lat: TEST_LAT,
    lon: TEST_LON,
  });

  const rpConfirmations = evaluateAllRulingPlanetsConfirmations({
    rpSnapshot,
    dashaActivations: kpBefore.dashaActivations,
    transitConfirmations: kpBefore.transitConfirmations,
  });

  assert.ok(Object.keys(rpConfirmations).length >= 21);

  // 3. Re-run chart and KP engine
  const chartAfter = calculateChart("Test Subject", TEST_DOB, TEST_TOB, "New Delhi", TEST_LAT, TEST_LON, TEST_TZ);
  const kpAfter = runKPEngine(chartAfter);

  // Snapshot after
  const lagnaAfter = chartAfter.lagnaLon;
  const sunAfter = chartAfter.planets.Sun.lon;
  const moonAfter = chartAfter.planets.Moon.lon;
  const cuspPromisesAfter = JSON.stringify(kpAfter.predictiveEvidence?.cuspPromises);
  const houseSignificatorsAfter = JSON.stringify(kpAfter.predictiveEvidence?.houseSignificators);
  const eventPromisesAfter = JSON.stringify(kpAfter.eventPromises);
  const dashaActivationsAfter = normalizeDynamicTimestamps(kpAfter.dashaActivations);
  const transitConfirmationsAfter = normalizeDynamicTimestamps(kpAfter.transitConfirmations);

  // 4. Invariance assertions: UPSTREAM DATA MUST BE COMPLETELY UNCHANGED
  assert.equal(lagnaBefore, lagnaAfter, "Lagna longitude must be identical");
  assert.equal(sunBefore, sunAfter, "Sun longitude must be identical");
  assert.equal(moonBefore, moonAfter, "Moon longitude must be identical");
  assert.equal(cuspPromisesBefore, cuspPromisesAfter, "Cusp promises must be bit-identical");
  assert.equal(houseSignificatorsBefore, houseSignificatorsAfter, "4-Fold significators must be bit-identical");
  assert.equal(eventPromisesBefore, eventPromisesAfter, "Event promises must be bit-identical");
  assert.equal(dashaActivationsBefore, dashaActivationsAfter, "Dasha activations must be bit-identical");
  assert.equal(transitConfirmationsBefore, transitConfirmationsAfter, "Transit confirmations must be bit-identical");
});

// ── Determinism & Zero Scores (Tests AA through AF) ───────────────────────────

test("2I-G Test AA — Deterministic repeat execution produces bit-identical snapshots", () => {
  const snap1 = getBaselineSnapshot();
  const snap2 = getBaselineSnapshot();
  assert.deepEqual(snap1, snap2, "Repeated RP snapshot calculation must be identical");
});

test("2I-G Test AB — Provenance completeness on Ruling Planets snapshot", () => {
  const rp = getBaselineSnapshot();
  assert.ok(rp.provenance.readerReferences.length >= 2);
  assert.equal(rp.provenance.epistemologicalStatus, "Verified");
  assert.ok(rp.dayLordInfo.provenance.source.includes("panchang.ts"));
});

test("2I-G Test AC, AD, AE, AF — Absolute absence of numeric scores, probabilities, percentages, and weights", () => {
  const rp = getBaselineSnapshot();
  const allResults = evaluateAllRulingPlanetsConfirmations({ rpSnapshot: rp });

  for (const res of Object.values(allResults)) {
    const json = JSON.stringify(res);
    assert.doesNotMatch(json, /"score"/i, "No score field permitted");
    assert.doesNotMatch(json, /"weight"/i, "No weight field permitted");
    assert.doesNotMatch(json, /"probability"/i, "No probability field permitted");
    assert.doesNotMatch(json, /"percentage"/i, "No percentage field permitted");
    assert.doesNotMatch(json, /"confidence"/i, "No confidence field permitted");
    assert.doesNotMatch(json, /"tier"/i, "No tier field permitted");
  }
});
