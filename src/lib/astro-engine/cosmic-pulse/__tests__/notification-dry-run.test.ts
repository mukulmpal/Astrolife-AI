import test from "node:test";
import assert from "node:assert/strict";
import { runNotificationDryRunAudit } from "../../../../../scripts/audit-notification-dry-run";
import { BENCHMARK_TEST_CASES } from "../../../../../scripts/benchmarks/cases";
import {
  evaluateNotificationEligibility,
  generateNotificationFingerprint,
  getCivilTimeInTimezone,
  type NotificationContext,
  type UserNotificationPreferences,
  type NotificationHistoryEntry,
} from "../notifications";
import type { CosmicForecastEvent } from "../forecast/forecast-types";

const defaultPreferences: UserNotificationPreferences = {
  allowPrimaryAlerts: true,
  allowSupportingAlerts: false,
  allowDashaAlerts: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  preferredMorningTime: "08:30",
  preferredEveningTime: "20:00",
  maxDailyNotifications: 1,
};

function createMockEvent(overrides: Partial<CosmicForecastEvent> = {}): CosmicForecastEvent {
  return {
    id: "forecast-Saturn-Moon-0-2026-10-04-p1",
    type: "transit_hit",
    title: "Saturn Transit over Natal Moon",
    headline: "Reflective focus on emotional discipline",
    planets: ["Saturn", "Moon"],
    aspectType: "Transit Hit",
    targetAngle: 0,
    natalHouse: 1,
    lifeAreas: ["mindset", "health"],
    severity: "critical",
    relevanceTier: "primary",
    timing: {
      contactAt: new Date("2026-10-03T12:00:00Z"),
      exactAt: new Date("2026-10-04T09:00:00Z"),
      peakAt: new Date("2026-10-04T09:00:00Z"),
      separationAt: new Date("2026-10-05T12:00:00Z"),
    },
    evidence: {
      aspectType: "Transit Hit",
      planetA: "Saturn",
      planetB: "Moon",
      longitudeA: 15.0,
      longitudeB: 15.0,
      exactAspectDeg: 0,
      currentOrbDeg: 0.1,
      isApplying: false,
      shastraReference: "Classical Parashari Framework",
    },
    provenance: {
      calculationBasis: ["Ephemeris Moshier"],
      searchIntervalDays: 30,
      numericalRefinementMethod: "Secant Root-Finding",
      localTz: 5.5,
    },
    ...overrides,
  };
}

// ----------------------------------------------------------------------------
// TEST 1: Complete 10-Chart Benchmark Simulation Suite
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 1. Complete 10-Chart Benchmark Simulation runs and passes 100%", () => {
  const result = runNotificationDryRunAudit();
  assert.equal(result.allPassed, true, "Dry-run simulation must have 0 anomalies across all 10 charts");
  assert.equal(result.summaries.length, 10, "All 10 benchmark charts must be evaluated");
  assert.ok(result.totalForecastEvents > 0, "Forecast events must be generated and analyzed");
});

// ----------------------------------------------------------------------------
// TEST 2: Deterministic Repeated Execution
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 2. Deterministic repeated execution produces 100% identical outputs", () => {
  const event = createMockEvent();
  const context: NotificationContext = {
    currentTime: new Date("2026-10-04T02:00:00Z"),
    timezone: "Asia/Kolkata",
    preferences: { ...defaultPreferences },
    notificationHistory: [],
  };

  const run1 = evaluateNotificationEligibility(event, context);
  const run2 = evaluateNotificationEligibility(event, context);

  assert.deepEqual(run1, run2, "Repeated evaluations must produce identical candidates and payloads");
});

// ----------------------------------------------------------------------------
// TEST 3: Duplicate Fingerprints Never Produce Duplicate Candidates
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 3. Duplicate fingerprints never produce duplicate candidates", () => {
  const event = createMockEvent();
  const context: NotificationContext = {
    currentTime: new Date("2026-10-04T02:00:00Z"),
    timezone: "Asia/Kolkata",
    preferences: { ...defaultPreferences },
    notificationHistory: [],
  };

  const initial = evaluateNotificationEligibility(event, context);
  assert.equal(initial.eligible, true);

  const history: NotificationHistoryEntry[] = [
    {
      fingerprint: initial.fingerprint,
      sentAt: initial.payload!.scheduledFor,
      timingPhase: "same_day",
    },
  ];

  const repeat = evaluateNotificationEligibility(event, {
    ...context,
    notificationHistory: history,
  });

  assert.equal(repeat.eligible, false);
  assert.equal(repeat.state, "suppressed");
  assert.ok(repeat.reason.includes("already been processed and delivered"));
});

// ----------------------------------------------------------------------------
// TEST 4: Multi-Pass Distinctiveness (Pass 1 vs Pass 2 vs Pass 3)
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 4. Multi-pass transits produce distinct fingerprints and specialized trigger types", () => {
  const p1 = createMockEvent({
    id: "event-sat-p1",
    retrogradeInfo: { isRetrograde: false, passNumber: 1, totalPassesEstimated: 3 },
  });
  const p2 = createMockEvent({
    id: "event-sat-p2",
    retrogradeInfo: { isRetrograde: true, passNumber: 2, totalPassesEstimated: 3 },
  });
  const p3 = createMockEvent({
    id: "event-sat-p3",
    retrogradeInfo: { isRetrograde: false, passNumber: 3, totalPassesEstimated: 3 },
  });

  const fp1 = generateNotificationFingerprint(p1, "same_day");
  const fp2 = generateNotificationFingerprint(p2, "same_day");
  const fp3 = generateNotificationFingerprint(p3, "same_day");

  assert.notEqual(fp1, fp2);
  assert.notEqual(fp2, fp3);
  assert.notEqual(fp1, fp3);

  const ctx: NotificationContext = {
    currentTime: new Date("2026-10-04T07:00:00Z"),
    timezone: "Asia/Kolkata",
    preferences: { ...defaultPreferences },
    notificationHistory: [],
  };

  const res2 = evaluateNotificationEligibility(p2, ctx);
  assert.equal(res2.payload?.triggerType, "retrograde_revisit");
  assert.ok(res2.payload?.title.includes("Retrograde Revisit"));

  const res3 = evaluateNotificationEligibility(p3, ctx);
  assert.equal(res3.payload?.triggerType, "final_direct_pass");
  assert.ok(res3.payload?.title.includes("Final Direct Resolution"));
});

// ----------------------------------------------------------------------------
// TEST 5: Background Tier Strict Suppression
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 5. Background events never produce notifications under any configuration", () => {
  const bgEvent = createMockEvent({ relevanceTier: "background" });
  const context: NotificationContext = {
    currentTime: new Date("2026-10-04T02:00:00Z"),
    timezone: "Asia/Kolkata",
    preferences: {
      ...defaultPreferences,
      allowSupportingAlerts: true,
      allowPrimaryAlerts: true,
      maxDailyNotifications: 10,
    },
    notificationHistory: [],
  };

  const res = evaluateNotificationEligibility(bgEvent, context);
  assert.equal(res.eligible, false);
  assert.equal(res.state, "suppressed");
  assert.ok(res.reason.includes("Background event tier is strictly suppressed"));
});

// ----------------------------------------------------------------------------
// TEST 6: Supporting Events Preference Gate
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 6. Supporting events obey the user preference gate", () => {
  const suppEvent = createMockEvent({ relevanceTier: "supporting" });
  const baseCtx: NotificationContext = {
    currentTime: new Date("2026-10-04T02:00:00Z"),
    timezone: "Asia/Kolkata",
    preferences: { ...defaultPreferences, allowSupportingAlerts: false },
    notificationHistory: [],
  };

  const defaultRes = evaluateNotificationEligibility(suppEvent, baseCtx);
  assert.equal(defaultRes.eligible, false);

  const enabledRes = evaluateNotificationEligibility(suppEvent, {
    ...baseCtx,
    preferences: { ...defaultPreferences, allowSupportingAlerts: true },
  });
  assert.equal(enabledRes.eligible, true);
  assert.equal(enabledRes.precedence, "supporting_general");
});

// ----------------------------------------------------------------------------
// TEST 7: Daily Notification Limits & Precedence Collision Handling
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 7. Daily notification limits and collision handling without numeric scores", () => {
  const targetDate = new Date("2026-10-04T09:00:00Z");
  const suppEvent = createMockEvent({
    id: "supp-collision",
    relevanceTier: "supporting",
    timing: { contactAt: targetDate, exactAt: targetDate, peakAt: targetDate, separationAt: targetDate },
  });
  const primEvent = createMockEvent({
    id: "prim-collision",
    relevanceTier: "primary",
    timing: { contactAt: targetDate, exactAt: targetDate, peakAt: targetDate, separationAt: targetDate },
  });

  const historyWithRecentDeliv: NotificationHistoryEntry[] = [
    {
      fingerprint: "earlier-today-alert",
      sentAt: new Date(targetDate.getTime() - 2 * 3600000),
      timingPhase: "same_day",
    },
  ];

  const ctx: NotificationContext = {
    currentTime: new Date(targetDate.getTime() - 1 * 3600000),
    timezone: "Asia/Kolkata",
    preferences: { ...defaultPreferences, allowSupportingAlerts: true, maxDailyNotifications: 1 },
    notificationHistory: historyWithRecentDeliv,
  };

  // Lower precedence supporting event must be suppressed when daily limit is reached
  const suppRes = evaluateNotificationEligibility(suppEvent, ctx);
  assert.equal(suppRes.eligible, false);
  assert.ok(suppRes.reason.includes("Daily notification cap"));

  // Primary exact event bypasses daily cap due to its canonical precedence tier
  const primRes = evaluateNotificationEligibility(primEvent, ctx);
  assert.equal(primRes.eligible, true);
  assert.equal(primRes.precedence, "primary_exact");
});

// ----------------------------------------------------------------------------
// TEST 8: Overnight Events & IANA Timezone Conversion
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 8. Overnight events defer to morning civil time across IANA timezones", () => {
  // Event peaking at 02:30 AM local New York time
  // New York (EDT, UTC-4 in October): 02:30 AM EDT = 06:30 AM UTC
  const nyEvent = createMockEvent({
    id: "overnight-ny",
    timing: {
      contactAt: new Date("2026-10-04T04:00:00Z"),
      exactAt: new Date("2026-10-04T06:30:00Z"),
      peakAt: new Date("2026-10-04T06:30:00Z"),
      separationAt: new Date("2026-10-04T09:00:00Z"),
    },
  });

  const ctx: NotificationContext = {
    currentTime: new Date("2026-10-04T05:00:00Z"),
    timezone: "America/New_York",
    preferences: { ...defaultPreferences },
    notificationHistory: [],
  };

  const res = evaluateNotificationEligibility(nyEvent, ctx);
  assert.equal(res.eligible, true);
  assert.ok(res.payload);

  // Scheduled for 08:30 AM EDT = 12:30 PM UTC
  assert.equal(res.payload.scheduledFor.toISOString(), "2026-10-04T12:30:00.000Z");
  const civil = getCivilTimeInTimezone(res.payload.scheduledFor, "America/New_York");
  assert.equal(civil.hour, 8);
  assert.equal(civil.minute, 30);
});

// ----------------------------------------------------------------------------
// TEST 9: Dasha Transition Notifications Using Upstream Milestones
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 9. Dasha transitions produce dasha_transition notifications without recalculation", () => {
  const dashaEvent = createMockEvent({
    id: "dasha-sandhi-event",
    type: "dasha_milestone",
    aspectType: "Dasha Sandhi",
    title: "Jupiter-Saturn Antardasha Shift",
    headline: "Transition from Jupiter to Saturn Antardasha",
  });

  const ctx: NotificationContext = {
    currentTime: new Date("2026-10-04T02:00:00Z"),
    timezone: "Asia/Kolkata",
    preferences: { ...defaultPreferences },
    notificationHistory: [],
  };

  const res = evaluateNotificationEligibility(dashaEvent, ctx);
  assert.equal(res.eligible, true);
  assert.equal(res.payload?.triggerType, "dasha_transition");
  assert.equal(res.precedence, "dasha_transition");
});

// ----------------------------------------------------------------------------
// TEST 10: Strict No-Score and Neutral Tone Invariants
// ----------------------------------------------------------------------------

test("Notification Dry-Run — 10. Payloads strictly adhere to zero-score and classical tone contracts", () => {
  const event = createMockEvent();
  const ctx: NotificationContext = {
    currentTime: new Date("2026-10-04T02:00:00Z"),
    timezone: "Asia/Kolkata",
    preferences: { ...defaultPreferences },
    notificationHistory: [],
  };

  const res = evaluateNotificationEligibility(event, ctx);
  assert.ok(res.payload);

  const payloadStr = JSON.stringify(res.payload).toLowerCase();
  const bannedScoreTerms = ["score", "rating", "rank", "percentage", "confidence", "probability", "/100"];
  for (const term of bannedScoreTerms) {
    assert.equal(payloadStr.includes(term), false, `Payload must not contain banned score term: ${term}`);
  }

  const bannedToneWords = ["fatal", "calamity", "disaster", "curse", "bad luck", "ruined", "karmic completion"];
  for (const word of bannedToneWords) {
    assert.equal(payloadStr.includes(word), false, `Payload must not contain alarmist tone word: ${word}`);
  }
});
