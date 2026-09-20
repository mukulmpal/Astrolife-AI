import type { CosmicForecastEvent } from "../forecast/forecast-types";
import type {
  NotificationContext,
  NotificationEligibilityResult,
  NotificationTimingPhase,
  NotificationTriggerType,
  NotificationPrecedence,
} from "./notification-types";
import { generateNotificationFingerprint, isNotificationDuplicate } from "./notification-fingerprint";
import { scheduleDeliveryTimestamp } from "./notification-scheduler";
import { buildNotificationPayload } from "./notification-payload";

/**
 * Pure evaluator that determines whether a CosmicForecastEvent is eligible for
 * user notification, assigns its scheduling window, and synthesizes its pure payload.
 * 
 * Strict Invariants:
 * 1. Never recalculates astronomy or alters existing event parameters.
 * 2. Does not mutate the input event or context.
 * 3. Contains zero numeric scores, ratings, or probabilities.
 */
export function evaluateNotificationEligibility(
  event: CosmicForecastEvent,
  context: NotificationContext
): NotificationEligibilityResult {
  const { preferences, activeDashaContext, currentTime, timezone, notificationHistory } = context;

  // 1. Check if event involves active Dasha Lord
  const involvesDashaLord =
    activeDashaContext &&
    (event.planets.includes(activeDashaContext.mahadashaLord) ||
      (activeDashaContext.antardashaLord && event.planets.includes(activeDashaContext.antardashaLord)));

  // 2. TIER GATING
  // Background events are strictly suppressed from notifications
  if (event.relevanceTier === "background") {
    const fingerprint = generateNotificationFingerprint(event, "same_day");
    return {
      eligible: false,
      state: "suppressed",
      fingerprint,
      reason: "Background event tier is strictly suppressed from notifications",
    };
  }

  // Supporting events require either user preference toggle OR active Dasha synergy
  if (event.relevanceTier === "supporting") {
    if (!preferences.allowSupportingAlerts && !involvesDashaLord) {
      const fingerprint = generateNotificationFingerprint(event, "same_day");
      return {
        eligible: false,
        state: "suppressed",
        fingerprint,
        reason: "Supporting event tier suppressed by user notification preferences",
      };
    }
  }

  // Check if Dasha alerts are disabled by user preference
  if (event.type === "dasha_milestone" && preferences.allowDashaAlerts === false) {
    const fingerprint = generateNotificationFingerprint(event, "same_day");
    return {
      eligible: false,
      state: "suppressed",
      fingerprint,
      reason: "Dasha alerts disabled by user preferences",
    };
  }

  // 3. TEMPORAL WINDOW & TIMING PHASE
  const eventDate = event.timing.exactAt || event.timing.peakAt || event.timing.contactAt;
  const diffMs = eventDate.getTime() - currentTime.getTime();

  // Too far in future (> 36 hours)
  if (diffMs > 36 * 3600000) {
    const fingerprint = generateNotificationFingerprint(event, "advance");
    return {
      eligible: false,
      state: "candidate",
      fingerprint,
      reason: "Event is outside immediate notification window (> 36 hours ahead)",
    };
  }

  // Too far in past (> 24 hours ago)
  if (diffMs < -24 * 3600000) {
    const fingerprint = generateNotificationFingerprint(event, "same_day");
    return {
      eligible: false,
      state: "suppressed",
      fingerprint,
      reason: "Event has already culminated (> 24 hours ago)",
    };
  }

  // Classify timing phase:
  // 12 to 36 hours ahead -> "advance"
  // -24 to 12 hours ahead -> "same_day"
  const timingPhase: NotificationTimingPhase = diffMs >= 12 * 3600000 ? "advance" : "same_day";

  // 4. DETERMINE NOTIFICATION TRIGGER TYPE
  let triggerType: NotificationTriggerType = "exact_culmination";
  if (event.type === "dasha_milestone") {
    triggerType = "dasha_transition";
  } else if (event.retrogradeInfo?.isRetrograde && event.retrogradeInfo?.passNumber === 2) {
    triggerType = "retrograde_revisit";
  } else if (event.retrogradeInfo?.passNumber === 3) {
    triggerType = "final_direct_pass";
  } else if (timingPhase === "advance") {
    triggerType = "approaching_alignment";
  } else {
    triggerType = "exact_culmination";
  }

  // 5. DETERMINISTIC FINGERPRINT & IDEMPOTENCY GATE
  const fingerprint = generateNotificationFingerprint(event, timingPhase);
  if (isNotificationDuplicate(fingerprint, notificationHistory)) {
    return {
      eligible: false,
      state: "suppressed",
      fingerprint,
      reason: "Notification fingerprint has already been processed and delivered",
    };
  }

  // 6. CATEGORICAL PRECEDENCE ASSIGNMENT
  let precedence: NotificationPrecedence = "supporting_general";
  if (event.type === "dasha_milestone") {
    precedence = "dasha_transition";
  } else if (event.relevanceTier === "primary" && timingPhase === "same_day") {
    precedence = "primary_exact";
  } else if (event.relevanceTier === "primary" && timingPhase === "advance") {
    precedence = "primary_advance";
  } else if (involvesDashaLord) {
    precedence = "supporting_dasha_synergy";
  } else {
    precedence = "supporting_general";
  }

  // 7. DAILY CAP & RATE LIMIT GATE
  // Count notifications delivered in the last 24h
  const oneDayAgoMs = currentTime.getTime() - 24 * 3600000;
  const recentCount = notificationHistory.filter(
    (h) => h.sentAt && h.sentAt.getTime() >= oneDayAgoMs
  ).length;

  const maxAllowed = preferences.maxDailyNotifications ?? 1;
  if (recentCount >= maxAllowed && precedence !== "primary_exact" && precedence !== "dasha_transition") {
    return {
      eligible: false,
      state: "suppressed",
      fingerprint,
      precedence,
      reason: `Daily notification cap (${maxAllowed}) reached for the past 24 hours`,
    };
  }

  // 8. SCHEDULE CIVIL DELIVERY TIME
  const scheduledFor = scheduleDeliveryTimestamp(
    eventDate,
    timingPhase,
    timezone,
    preferences,
    currentTime
  );

  // 9. SYNTHESIZE PURE NOTIFICATION PAYLOAD
  const payload = buildNotificationPayload({
    event,
    fingerprint,
    triggerType,
    timingPhase,
    precedence,
    scheduledFor,
    timezone,
  });

  return {
    eligible: true,
    state: "eligible",
    fingerprint,
    reason: "Eligible for scheduled delivery",
    precedence,
    payload,
  };
}

