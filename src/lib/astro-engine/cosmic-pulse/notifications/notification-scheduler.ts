import type { NotificationTimingPhase, UserNotificationPreferences } from "./notification-types";

/**
 * Extracts civil time components (year, month, day, hour, minute) in an IANA timezone.
 */
export function getCivilTimeInTimezone(
  date: Date,
  timezone: string
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} {
  let tz = timezone;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
  } catch {
    tz = "UTC";
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string): number => {
    const val = parts.find((p) => p.type === type)?.value;
    return val ? parseInt(val, 10) : 0;
  };

  let hour = getPart("hour");
  if (hour === 24) hour = 0;

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
    hour,
    minute: getPart("minute"),
  };
}

/**
 * Parses "HH:MM" string into minutes from midnight [0, 1440).
 */
export function parseTimeStringToMinutes(timeStr: string): number {
  const [hStr, mStr] = timeStr.split(":");
  const h = parseInt(hStr || "0", 10);
  const m = parseInt(mStr || "0", 10);
  return h * 60 + m;
}

/**
 * Checks if a specific civil time (hour, minute) falls within quiet hours.
 * Handles overnight wrapping (e.g. 22:00 to 08:00).
 */
export function isInQuietHours(
  hour: number,
  minute: number,
  quietStartStr: string,
  quietEndStr: string
): boolean {
  const currentMinutes = hour * 60 + minute;
  const startMinutes = parseTimeStringToMinutes(quietStartStr);
  const endMinutes = parseTimeStringToMinutes(quietEndStr);

  if (startMinutes > endMinutes) {
    // Overnight window, e.g. 22:00 (1320) to 08:00 (480)
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  } else {
    // Daytime quiet window (rare, but supported)
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
}

/**
 * Schedules the optimal delivery timestamp respecting user timezone,
 * quiet hours, and advance vs same-day timing semantics.
 */
export function scheduleDeliveryTimestamp(
  eventDate: Date,
  timingPhase: NotificationTimingPhase,
  timezone: string,
  preferences: UserNotificationPreferences,
  currentTime: Date
): Date {
  const civil = getCivilTimeInTimezone(eventDate, timezone);

  // 1. ADVANCE TIMING: Deliver on the evening before the event at preferredEveningTime
  if (timingPhase === "advance") {
    const eveningMinutes = parseTimeStringToMinutes(preferences.preferredEveningTime || "20:00");
    const eveningHour = Math.floor(eveningMinutes / 60);
    const eveningMinute = eveningMinutes % 60;

    // Target the day prior to the event in user timezone
    const candidate = new Date(eventDate.getTime() - 24 * 3600000);
    const candidateCivil = getCivilTimeInTimezone(candidate, timezone);

    // Build ISO timestamp corresponding to preferred evening time in that timezone
    // Using UTC adjustment:
    const diffHours = candidateCivil.hour - eveningHour;
    const diffMinutes = candidateCivil.minute - eveningMinute;
    const scheduledMs = candidate.getTime() - (diffHours * 3600000 + diffMinutes * 60000);
    const scheduled = new Date(scheduledMs);

    // If scheduled time is already in the past relative to currentTime, deliver now
    return scheduled.getTime() < currentTime.getTime() ? currentTime : scheduled;
  }

  // 2. SAME-DAY TIMING:
  // Check if culmination occurs during quiet hours (e.g. 02:30 AM)
  const isQuiet = isInQuietHours(
    civil.hour,
    civil.minute,
    preferences.quietHoursStart || "22:00",
    preferences.quietHoursEnd || "08:00"
  );

  if (!isQuiet) {
    // Occurs during waking hours: Deliver at culmination or current time
    return eventDate.getTime() < currentTime.getTime() ? currentTime : eventDate;
  }

  // Event occurs in quiet hours:
  // For overnight events (e.g. 02:30 AM), deliver after quiet hours end at preferredMorningTime
  const morningMinutes = parseTimeStringToMinutes(preferences.preferredMorningTime || "08:30");
  const morningHour = Math.floor(morningMinutes / 60);
  const morningMinute = morningMinutes % 60;

  const diffHours = civil.hour - morningHour;
  const diffMinutes = civil.minute - morningMinute;
  const morningMs = eventDate.getTime() - (diffHours * 3600000 + diffMinutes * 60000);
  const scheduledMorning = new Date(morningMs);

  return scheduledMorning.getTime() < currentTime.getTime() ? currentTime : scheduledMorning;
}

