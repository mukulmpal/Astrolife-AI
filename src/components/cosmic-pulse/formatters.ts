import type { TriggerSeverity, AspectLifecycle } from "@/lib/astro-engine/cosmic-pulse/types";

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

export function formatLongitudeToDms(longitude: number): {
  signName: string;
  deg: number;
  min: number;
  formatted: string;
} {
  const norm = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(norm / 30);
  const signName = ZODIAC_SIGNS[signIndex] || "Aries";
  const degInSign = norm % 30;
  const deg = Math.floor(degInSign);
  const min = Math.round((degInSign - deg) * 60);

  return {
    signName,
    deg,
    min,
    formatted: `${signName} ${deg}°${min.toString().padStart(2, "0")}'`,
  };
}

export function formatOrb(orbDeg: number): string {
  const deg = Math.floor(Math.abs(orbDeg));
  const min = Math.round((Math.abs(orbDeg) - deg) * 60);
  return `${deg}°${min.toString().padStart(2, "0")}'`;
}

export function getSeverityStyle(severity: TriggerSeverity): {
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  label: string;
  glow: string;
} {
  switch (severity) {
    case "critical":
      return {
        badgeBg: "rgba(239, 68, 68, 0.15)",
        badgeBorder: "rgba(239, 68, 68, 0.4)",
        textColor: "#f87171",
        label: "ACTIVE TENSION",
        glow: "rgba(239, 68, 68, 0.25)",
      };
    case "caution":
      return {
        badgeBg: "rgba(245, 158, 11, 0.15)",
        badgeBorder: "rgba(245, 158, 11, 0.4)",
        textColor: "#fbbf24",
        label: "CAUTION WINDOW",
        glow: "rgba(245, 158, 11, 0.25)",
      };
    case "opportunity":
      return {
        badgeBg: "rgba(34, 197, 94, 0.15)",
        badgeBorder: "rgba(34, 197, 94, 0.4)",
        textColor: "#4ade80",
        label: "HARMONIC FLOW",
        glow: "rgba(34, 197, 94, 0.25)",
      };
    case "horizon":
      return {
        badgeBg: "rgba(168, 85, 247, 0.15)",
        badgeBorder: "rgba(168, 85, 247, 0.4)",
        textColor: "#c084fc",
        label: "APPROACHING SHIFT",
        glow: "rgba(168, 85, 247, 0.25)",
      };
    default:
      return {
        badgeBg: "rgba(96, 165, 250, 0.15)",
        badgeBorder: "rgba(96, 165, 250, 0.4)",
        textColor: "#93c5fd",
        label: "STABLE CURRENT",
        glow: "rgba(96, 165, 250, 0.25)",
      };
  }
}

export function getLifecycleDetails(lifecycle: AspectLifecycle, orbDeg: number): {
  label: string;
  badge: string;
} {
  const orbStr = formatOrb(orbDeg);
  switch (lifecycle) {
    case "peak":
      return {
        label: "Peak Alignment (Within 2° exact)",
        badge: `Peak · Orb ${orbStr}`,
      };
    case "approaching":
      return {
        label: "Approaching Peak (Energy intensifying)",
        badge: `Approaching · Orb ${orbStr}`,
      };
    case "separating":
      return {
        label: "Separating Phase (Energy dispersing)",
        badge: `Separating · Orb ${orbStr}`,
      };
  }
}

export function formatForecastDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatForecastTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatRelativeDays(d: Date | string, baseDate = new Date()): string {
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const diffDays = Math.round((date.getTime() - baseDate.getTime()) / 86400000);
  if (diffDays <= 0) return "Today / In Effect";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `In ~${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }
  const months = Math.floor(diffDays / 30);
  return `In ~${months} ${months === 1 ? "month" : "months"}`;
}

