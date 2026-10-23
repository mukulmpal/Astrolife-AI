import type { CosmicForecastEvent } from "../forecast/forecast-types";
import type { NotificationTimingPhase, NotificationHistoryEntry } from "./notification-types";

/**
 * Generates a deterministic notification fingerprint based on the source event identity,
 * retrograde pass number, timing phase (advance vs same_day), and target culmination date.
 * 
 * Invariant: Distinct passes (Pass 1, Pass 2, Pass 3) have distinct fingerprints,
 * preventing accidental cross-pass suppression.
 */
export function generateNotificationFingerprint(
  event: CosmicForecastEvent,
  timingPhase: NotificationTimingPhase
): string {
  const culminationDate = event.timing.exactAt || event.timing.peakAt || event.timing.contactAt;
  const dateKey = culminationDate.toISOString().slice(0, 10).replace(/-/g, "");
  const passNumber = event.retrogradeInfo?.passNumber ?? 1;

  return `${event.id}:p${passNumber}:${timingPhase}:${dateKey}`;
}

/**
 * Checks whether a notification with this exact fingerprint has already been processed.
 */
export function isNotificationDuplicate(
  fingerprint: string,
  history: NotificationHistoryEntry[]
): boolean {
  return history.some((entry) => entry.fingerprint === fingerprint);
}

