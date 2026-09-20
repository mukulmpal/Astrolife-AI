import type { CosmicForecastEvent } from "../forecast/forecast-types";
import type {
  NotificationTriggerType,
  NotificationTimingPhase,
  NotificationPrecedence,
  NotificationPayload,
} from "./notification-types";
import { getCivilTimeInTimezone } from "./notification-scheduler";

/**
 * Builds the pure notification payload with strict separation between
 * astronomical facts, classical interpretations, and practical actions.
 * 
 * Strict Invariant: Zero numerical scores or fatalistic wording.
 */
export function buildNotificationPayload({
  event,
  fingerprint,
  triggerType,
  timingPhase,
  precedence,
  scheduledFor,
  timezone,
}: {
  event: CosmicForecastEvent;
  fingerprint: string;
  triggerType: NotificationTriggerType;
  timingPhase: NotificationTimingPhase;
  precedence: NotificationPrecedence;
  scheduledFor: Date;
  timezone: string;
}): NotificationPayload {
  const eventDate = event.timing.exactAt || event.timing.peakAt || event.timing.contactAt;
  const civil = getCivilTimeInTimezone(eventDate, timezone);
  const timeStr = `${civil.hour.toString().padStart(2, "0")}:${civil.minute.toString().padStart(2, "0")}`;

  const isAdvance = timingPhase === "advance";
  const passNum = event.retrogradeInfo?.passNumber;
  const passTag = passNum && event.retrogradeInfo?.totalPassesEstimated && event.retrogradeInfo.totalPassesEstimated > 1
    ? ` (Pass ${passNum})`
    : "";

  // 1. Astronomical Fact
  let astronomicalFact = "";
  if (triggerType === "dasha_transition") {
    astronomicalFact = isAdvance
      ? `Dasha period transitions to ${event.planets[1]} tomorrow at ${timeStr} local time.`
      : `Dasha period transitions to ${event.planets[1]} today at ${timeStr} local time.`;
  } else if (event.type === "transit_hit") {
    astronomicalFact = isAdvance
      ? `Transit ${event.planets[0]} will reach exact alignment with natal ${event.planets[1]} tomorrow at ${timeStr} local time${passTag}.`
      : `Transit ${event.planets[0]} reaches exact alignment with natal ${event.planets[1]} today at ${timeStr} local time${passTag}.`;
  } else {
    astronomicalFact = isAdvance
      ? `${event.planets.join(" and ")} will reach exact ${event.targetAngle}° alignment tomorrow at ${timeStr} local time${passTag}.`
      : `${event.planets.join(" and ")} reach exact ${event.targetAngle}° alignment today at ${timeStr} local time${passTag}.`;
  }

  // 2. Classical Vedic Interpretation
  let classicalInterpretation = "";
  if (event.evidence.shastraReference) {
    classicalInterpretation = `${event.evidence.shastraReference} traditionally interprets this alignment as a focal window for ${event.lifeAreas.join(" and ")}.`;
  } else {
    classicalInterpretation = `Classical Vedic framework emphasizes heightened attention and mindful pacing in ${event.lifeAreas.join(" and ")}.`;
  }

  // 3. Suggested Action
  let suggestedAction = "Maintain steady pacing, review commitments carefully, and proceed with calm focus.";
  if (event.severity === "critical" || event.severity === "caution") {
    suggestedAction = "Prioritize patience and structured deliberation; avoid reactive decisions under temporary pressure.";
  } else if (event.severity === "opportunity") {
    suggestedAction = "Harness this harmonious window for constructive collaboration, focused planning, and spiritual momentum.";
  }

  // 4. Title
  let title = "";
  if (triggerType === "dasha_transition") {
    title = `Dasha Shift: ${event.title}`;
  } else if (triggerType === "retrograde_revisit") {
    title = `${event.planets.join(" ↔ ")} · Retrograde Revisit (Vakri Phase)`;
  } else if (triggerType === "final_direct_pass") {
    title = `${event.planets.join(" ↔ ")} · Final Direct Resolution`;
  } else if (isAdvance) {
    title = `${event.planets.join(" ↔ ")} · Upcoming Alignment Tomorrow`;
  } else {
    title = `${event.planets.join(" ↔ ")} · Exact Alignment Today`;
  }

  return {
    notificationId: `notif-${fingerprint}`,
    fingerprint,
    triggerType,
    timingPhase,
    precedence,
    title,
    astronomicalFact,
    classicalInterpretation,
    suggestedAction,
    lifeAreas: event.lifeAreas,
    relevanceTier: event.relevanceTier === "primary" ? "primary" : "supporting",
    scheduledFor,
    sourceEventId: event.id,
  };
}

