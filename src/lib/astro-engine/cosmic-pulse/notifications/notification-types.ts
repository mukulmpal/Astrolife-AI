import type { PlanetName, LifeArea } from "../types";
import type { EventRelevanceTier, CosmicForecastEvent } from "../forecast/forecast-types";

export type NotificationTriggerType =
  | "exact_culmination"      // Day-of exact culmination peak
  | "approaching_alignment"  // Advance notice (e.g. 24h before exact peak)
  | "retrograde_revisit"     // Pass 2: Retrograde (Vakri) revisit
  | "final_direct_pass"      // Pass 3: Final direct pass / resolution phase
  | "dasha_transition";      // Mahadasha / Antardasha boundary

export type NotificationTimingPhase = "advance" | "same_day";

export type NotificationState = "candidate" | "eligible" | "scheduled" | "suppressed";

export type NotificationPrecedence =
  | "primary_exact"
  | "dasha_transition"
  | "primary_advance"
  | "supporting_dasha_synergy"
  | "supporting_general";

export interface UserNotificationPreferences {
  allowPrimaryAlerts: boolean;         // Default: true
  allowSupportingAlerts: boolean;      // Default: false
  allowDashaAlerts: boolean;           // Default: true
  quietHoursStart: string;             // e.g. "22:00" (10:00 PM)
  quietHoursEnd: string;               // e.g. "08:00" (08:00 AM)
  preferredMorningTime: string;        // e.g. "08:30" (08:30 AM)
  preferredEveningTime: string;        // e.g. "20:00" (08:00 PM)
  maxDailyNotifications: number;       // Default: 1
  subscribedLifeAreas?: LifeArea[];
}

export interface ActiveDashaContext {
  mahadashaLord: PlanetName;
  antardashaLord?: PlanetName;
}

export interface NotificationHistoryEntry {
  fingerprint: string;
  sentAt: Date;
  timingPhase: NotificationTimingPhase;
  passNumber?: number;
}

export interface NotificationContext {
  currentTime: Date;
  timezone: string;                    // IANA timezone, e.g. "Asia/Kolkata", "America/New_York"
  preferences: UserNotificationPreferences;
  activeDashaContext?: ActiveDashaContext;
  notificationHistory: NotificationHistoryEntry[];
}

export interface NotificationPayload {
  notificationId: string;
  fingerprint: string;
  triggerType: NotificationTriggerType;
  timingPhase: NotificationTimingPhase;
  precedence: NotificationPrecedence;
  title: string;
  astronomicalFact: string;            // Pure astrometric reality
  classicalInterpretation: string;    // Contextual Parashari/Gochara guidance
  suggestedAction: string;             // Constructive alignment
  lifeAreas: LifeArea[];
  relevanceTier: EventRelevanceTier;
  scheduledFor: Date;
  sourceEventId: string;
}

export interface NotificationEligibilityResult {
  eligible: boolean;
  state: NotificationState;
  fingerprint: string;
  reason: string;
  precedence?: NotificationPrecedence;
  payload?: NotificationPayload;
}

