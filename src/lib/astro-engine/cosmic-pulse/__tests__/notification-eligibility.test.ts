import test from "node:test";
import assert from "node:assert/strict";
import type { CosmicForecastEvent } from "../forecast/forecast-types";
import {
  evaluateNotificationEligibility,
  generateNotificationFingerprint,
  scheduleDeliveryTimestamp,
  getCivilTimeInTimezone,
  type NotificationContext,
  type UserNotificationPreferences,
} from "../notifications";

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

function createMockContext(overrides: Partial<NotificationContext> = {}): NotificationContext {
  return {
    currentTime: new Date("2026-10-04T00:00:00Z"),
    timezone: "Asia/Kolkata",
    preferences: { ...defaultPreferences },
    notificationHistory: [],
    ...overrides,
  };
}

// ----------------------------------------------------------------------------
// CATEGORY 1: CORE TIER GATING
// ----------------------------------------------------------------------------

test("Notification Eligibility — 1. Primary exact natal hit is eligible for notification", () => {
  const event = createMockEvent({ relevanceTier: "primary" });
  const context = createMockContext({ currentTime: new Date("2026-10-04T02:00:00Z") });

  const result = evaluateNotificationEligibility(event, context);
  assert.equal(result.eligible, true);
  assert.equal(result.state, "eligible");
  assert.equal(result.precedence, "primary_exact");
  assert.ok(result.payload);
  assert.equal(result.payload.relevanceTier, "primary");
});

test("Notification Eligibility — 2. Supporting event is suppressed by default", () => {
  const event = createMockEvent({ relevanceTier: "supporting" });
  const context = createMockContext({ currentTime: new Date("2026-10-04T02:00:00Z") });

  const result = evaluateNotificationEligibility(event, context);
  assert.equal(result.eligible, false);
  assert.equal(result.state, "suppressed");
  assert.ok(result.reason.includes("Supporting event tier suppressed"));
});

test("Notification Eligibility — 3. Supporting event is elevated when user enables allowSupportingAlerts", () => {
  const event = createMockEvent({ relevanceTier: "supporting" });
  const context = createMockContext({
    currentTime: new Date("2026-10-04T02:00:00Z"),
    preferences: { ...defaultPreferences, allowSupportingAlerts: true },
  });

  const result = evaluateNotificationEligibility(event, context);
  assert.equal(result.eligible, true);
  assert.equal(result.state, "eligible");
});

test("Notification Eligibility — 4. Supporting event is elevated when involving active Dasha lord", () => {
  const event = createMockEvent({
    relevanceTier: "supporting",
    planets: ["Mars", "Saturn"],
  });
  const context = createMockContext({
    currentTime: new Date("2026-10-04T02:00:00Z"),
    activeDashaContext: { mahadashaLord: "Mars", antardashaLord: "Jupiter" },
  });

  const result = evaluateNotificationEligibility(event, context);
  assert.equal(result.eligible, true);
  assert.equal(result.precedence, "supporting_dasha_synergy");
});

test("Notification Eligibility — 5. Background event is unconditionally suppressed", () => {
  const event = createMockEvent({ relevanceTier: "background" });
  const context = createMockContext({
    currentTime: new Date("2026-10-04T02:00:00Z"),
    preferences: { ...defaultPreferences, allowSupportingAlerts: true },
  });

  const result = evaluateNotificationEligibility(event, context);
  assert.equal(result.eligible, false);
  assert.equal(result.state, "suppressed");
  assert.ok(result.reason.includes("Background event tier is strictly suppressed"));
});

// ----------------------------------------------------------------------------
// CATEGORY 2: LIFECYCLE & MULTI-PASS SEMANTICS
// ----------------------------------------------------------------------------

test("Notification Eligibility — 6. Pass 1 Direct transit generates advance notice 24h ahead", () => {
  const event = createMockEvent({
    timing: {
      contactAt: new Date("2026-10-04T00:00:00Z"),
      exactAt: new Date("2026-10-05T12:00:00Z"),
      peakAt: new Date("2026-10-05T12:00:00Z"),
      separationAt: new Date("2026-10-06T00:00:00Z"),
    },
    retrogradeInfo: { isRetrograde: false, passNumber: 1, totalPassesEstimated: 3 },
  });

  // Current time is 24h before exact culmination
  const context = createMockContext({ currentTime: new Date("2026-10-04T12:00:00Z") });
  const result = evaluateNotificationEligibility(event, context);

  assert.equal(result.eligible, true);
  assert.ok(result.payload);
  assert.equal(result.payload.timingPhase, "advance");
  assert.equal(result.payload.triggerType, "approaching_alignment");
  assert.ok(result.payload.astronomicalFact.includes("will reach"));
});

test("Notification Eligibility — 7. Pass 2 Retrograde revisit generates distinct Vakri alert", () => {
  const event = createMockEvent({
    id: "forecast-Saturn-Moon-0-2026-10-18-p2",
    retrogradeInfo: { isRetrograde: true, passNumber: 2, totalPassesEstimated: 3 },
    timing: {
      contactAt: new Date("2026-10-17T00:00:00Z"),
      exactAt: new Date("2026-10-18T10:00:00Z"),
      peakAt: new Date("2026-10-18T10:00:00Z"),
      separationAt: new Date("2026-10-19T00:00:00Z"),
    },
  });

  const context = createMockContext({ currentTime: new Date("2026-10-18T05:00:00Z") });
  const result = evaluateNotificationEligibility(event, context);

  assert.equal(result.eligible, true);
  assert.ok(result.payload);
  assert.equal(result.payload.triggerType, "retrograde_revisit");
  assert.ok(result.payload.title.includes("Retrograde Revisit (Vakri Phase)"));
});

test("Notification Eligibility — 8. Pass 3 Final Direct transit generates resolution phase alert (not 'karmic completion')", () => {
  const event = createMockEvent({
    id: "forecast-Saturn-Moon-0-2026-10-31-p3",
    retrogradeInfo: { isRetrograde: false, passNumber: 3, totalPassesEstimated: 3 },
    timing: {
      contactAt: new Date("2026-10-30T00:00:00Z"),
      exactAt: new Date("2026-10-31T10:00:00Z"),
      peakAt: new Date("2026-10-31T10:00:00Z"),
      separationAt: new Date("2026-11-01T00:00:00Z"),
    },
  });

  const context = createMockContext({ currentTime: new Date("2026-10-31T05:00:00Z") });
  const result = evaluateNotificationEligibility(event, context);

  assert.equal(result.eligible, true);
  assert.ok(result.payload);
  assert.equal(result.payload.triggerType, "final_direct_pass");
  assert.ok(result.payload.title.includes("Final Direct Resolution"));
  assert.equal(result.payload.title.includes("karmic completion"), false);
});

test("Notification Eligibility — 9. Pass 1 separation is never notified as final resolution", () => {
  const event = createMockEvent({
    retrogradeInfo: { isRetrograde: false, passNumber: 1, totalPassesEstimated: 3 },
  });

  const context = createMockContext({ currentTime: new Date("2026-10-04T05:00:00Z") });
  const result = evaluateNotificationEligibility(event, context);

  assert.ok(result.payload);
  assert.notEqual(result.payload.triggerType, "final_direct_pass");
});

// ----------------------------------------------------------------------------
// CATEGORY 3: DASHA MILESTONES
// ----------------------------------------------------------------------------

test("Notification Eligibility — 10. Mahadasha transition consumes upstream milestone without recalculating", () => {
  const dashaEvent = createMockEvent({
    id: "dasha-md-Rahu-Jupiter-2026-10-15",
    type: "dasha_milestone",
    title: "Mahadasha Transition: Rahu ➔ Jupiter",
    headline: "Major planetary chapter transition from Rahu to Jupiter",
    planets: ["Rahu", "Jupiter"],
    relevanceTier: "primary",
    timing: {
      contactAt: new Date("2026-07-15T00:00:00Z"), // 90 days earlier
      exactAt: new Date("2026-10-15T00:00:00Z"),
      peakAt: new Date("2026-10-15T00:00:00Z"),
      separationAt: new Date("2026-10-16T00:00:00Z"),
    },
    dashaContext: { mahadasha: "Rahu", antardasha: "Jupiter" },
  });

  const context = createMockContext({ currentTime: new Date("2026-10-14T18:00:00Z") });
  const result = evaluateNotificationEligibility(dashaEvent, context);

  assert.equal(result.eligible, true);
  assert.equal(result.precedence, "dasha_transition");
  assert.ok(result.payload);
  assert.equal(result.payload.triggerType, "dasha_transition");
  assert.ok(result.payload.astronomicalFact.includes("Jupiter"));
});

test("Notification Eligibility — 11. Antardasha shift is suppressed when user disables allowDashaAlerts", () => {
  const dashaEvent = createMockEvent({
    type: "dasha_milestone",
    relevanceTier: "primary",
    timing: {
      contactAt: new Date("2026-10-01T00:00:00Z"),
      exactAt: new Date("2026-10-05T00:00:00Z"),
      peakAt: new Date("2026-10-05T00:00:00Z"),
      separationAt: new Date("2026-10-06T00:00:00Z"),
    },
  });

  const context = createMockContext({
    currentTime: new Date("2026-10-04T18:00:00Z"),
    preferences: { ...defaultPreferences, allowDashaAlerts: false },
  });

  const result = evaluateNotificationEligibility(dashaEvent, context);
  assert.equal(result.eligible, false);
  assert.equal(result.state, "suppressed");
  assert.ok(result.reason.includes("Dasha alerts disabled"));
});

// ----------------------------------------------------------------------------
// CATEGORY 4: SCHEDULING & TIMEZONE SAFETY
// ----------------------------------------------------------------------------

test("Notification Eligibility — 12. Overnight event (02:30 AM local) is scheduled for morning (08:30 AM)", () => {
  // 02:30 AM IST on Oct 4 is 2026-10-03T21:00:00Z in UTC
  const overnightEvent = createMockEvent({
    timing: {
      contactAt: new Date("2026-10-03T12:00:00Z"),
      exactAt: new Date("2026-10-03T21:00:00Z"),
      peakAt: new Date("2026-10-03T21:00:00Z"),
      separationAt: new Date("2026-10-04T12:00:00Z"),
    },
  });

  const scheduled = scheduleDeliveryTimestamp(
    new Date("2026-10-03T21:00:00Z"),
    "same_day",
    "Asia/Kolkata",
    defaultPreferences,
    new Date("2026-10-03T20:00:00Z")
  );

  const civilScheduled = getCivilTimeInTimezone(scheduled, "Asia/Kolkata");
  assert.equal(civilScheduled.hour, 8);
  assert.equal(civilScheduled.minute, 30);
});

test("Notification Eligibility — 13. Advance notification is scheduled for previous evening (20:00)", () => {
  // Culmination at 14:00 IST on Oct 5 -> Advance notification evening of Oct 4 at 20:00 IST
  const eventDate = new Date("2026-10-05T08:30:00Z");
  const currentTime = new Date("2026-10-04T06:00:00Z");

  const scheduled = scheduleDeliveryTimestamp(
    eventDate,
    "advance",
    "Asia/Kolkata",
    defaultPreferences,
    currentTime
  );

  const civilScheduled = getCivilTimeInTimezone(scheduled, "Asia/Kolkata");
  assert.equal(civilScheduled.day, 4);
  assert.equal(civilScheduled.hour, 20);
  assert.equal(civilScheduled.minute, 0);
});

test("Notification Eligibility — 14. IANA timezone correctly computes civil time across IST and America/New_York", () => {
  const utcInstant = new Date("2026-10-04T12:00:00Z");

  const civilDelhi = getCivilTimeInTimezone(utcInstant, "Asia/Kolkata");
  // 12:00 UTC + 5:30 = 17:30 IST
  assert.equal(civilDelhi.hour, 17);
  assert.equal(civilDelhi.minute, 30);

  const civilNY = getCivilTimeInTimezone(utcInstant, "America/New_York");
  // Oct 4 in NY is EDT (UTC - 4h) -> 12:00 UTC - 4h = 08:00 EDT
  assert.equal(civilNY.hour, 8);
  assert.equal(civilNY.minute, 0);
});

// ----------------------------------------------------------------------------
// CATEGORY 5: INVARIANTS & HARD GUARDRAILS
// ----------------------------------------------------------------------------

test("Notification Eligibility — 15. Input CosmicForecastEvent remains 100% byte-equivalent (immutability)", () => {
  const event = createMockEvent();
  const serializedBefore = JSON.stringify(event);

  const context = createMockContext();
  evaluateNotificationEligibility(event, context);

  const serializedAfter = JSON.stringify(event);
  assert.equal(serializedBefore, serializedAfter, "Input event must NOT be mutated in any way");
});

test("Notification Eligibility — 16. Daily notification limit suppresses excess lower-precedence alerts", () => {
  const eventSupporting = createMockEvent({
    relevanceTier: "supporting",
  });

  const sentAt = new Date("2026-10-04T01:00:00Z");
  const context = createMockContext({
    currentTime: new Date("2026-10-04T02:00:00Z"),
    preferences: { ...defaultPreferences, allowSupportingAlerts: true, maxDailyNotifications: 1 },
    notificationHistory: [
      {
        fingerprint: "some-prior-fingerprint",
        sentAt,
        timingPhase: "same_day",
      },
    ],
  });

  const result = evaluateNotificationEligibility(eventSupporting, context);
  assert.equal(result.eligible, false);
  assert.equal(result.state, "suppressed");
  assert.ok(result.reason.includes("Daily notification cap"));
});

test("Notification Eligibility — 17. Broad zero-score contract: Payload contains zero score/rating/% keys and zero alarmist phrasing", () => {
  const event = createMockEvent();
  const context = createMockContext();

  const result = evaluateNotificationEligibility(event, context);
  assert.ok(result.payload);

  const payload = result.payload;
  const bannedKeys = ["score", "rating", "rank", "prioritynumber", "confidencepercent", "strengthpercent", "impactpercent"];
  Object.keys(payload).forEach((key) => {
    assert.equal(
      bannedKeys.includes(key.toLowerCase()),
      false,
      `Payload must not contain banned key '${key}'`
    );
  });

  // Verify text fields have no /100, %, or fatalistic words
  const fullText = `${payload.title} ${payload.astronomicalFact} ${payload.classicalInterpretation} ${payload.suggestedAction}`.toLowerCase();
  assert.equal(fullText.includes("/100"), false, "Payload must not contain '/100'");
  assert.equal(fullText.includes("confidence:"), false, "Payload must not contain 'confidence:'");
  assert.equal(fullText.includes("score:"), false, "Payload must not contain 'score:'");

  const bannedWords = ["fatal", "disaster", "ruined", "doomed", "calamity", "catastrophe", "terrible fate"];
  bannedWords.forEach((word) => {
    assert.equal(fullText.includes(word), false, `Payload must not contain alarmist word '${word}'`);
  });
});

