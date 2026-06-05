import type { ChartData } from "@/lib/astro-engine/calculations";
import { fail, isFiniteNumber, isRecord, ok, type ValidationResult } from "./api";

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as const;

function validIsoDate(value: unknown) {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime());
}

function validTime(value: unknown) {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function validateLatLonTz(value: unknown): ValidationResult<{ lat: number; lon: number; tz: number }> {
  if (!isRecord(value)) return fail("Location payload must be an object.");
  const issues: string[] = [];
  const lat = value.lat;
  const lon = value.lon;
  const tz = value.tz;

  if (!isFiniteNumber(lat) || lat < -90 || lat > 90) issues.push("Latitude must be a number between -90 and 90.");
  if (!isFiniteNumber(lon) || lon < -180 || lon > 180) issues.push("Longitude must be a number between -180 and 180.");
  if (!isFiniteNumber(tz) || tz < -12 || tz > 14) issues.push("Timezone must be a number between -12 and 14.");

  if (issues.length) return fail("Invalid location fields.", issues);
  return ok({ lat: lat as number, lon: lon as number, tz: tz as number });
}

export function validateChartData(value: unknown): ValidationResult<ChartData> {
  if (!isRecord(value)) return fail("Chart must be an object.");

  const issues: string[] = [];
  if (typeof value.name !== "string" || value.name.trim().length < 1 || value.name.length > 120) {
    issues.push("Chart name is required and must be under 120 characters.");
  }
  if (!validIsoDate(value.dob)) issues.push("DOB must be a valid date string.");
  if (value.tob !== undefined && !validTime(value.tob)) issues.push("Birth time must use HH:mm format.");
  if (!isFiniteNumber(value.lat) || value.lat < -90 || value.lat > 90) issues.push("Latitude must be between -90 and 90.");
  if (!isFiniteNumber(value.lon) || value.lon < -180 || value.lon > 180) issues.push("Longitude must be between -180 and 180.");
  if (!isFiniteNumber(value.tz) || value.tz < -12 || value.tz > 14) issues.push("Timezone must be between -12 and 14.");
  if (!isFiniteNumber(value.lagnaNum) || value.lagnaNum < 0 || value.lagnaNum > 11) issues.push("Lagna number must be 0-11.");
  if (!isFiniteNumber(value.lagnaLon) || value.lagnaLon < 0 || value.lagnaLon >= 360) issues.push("Lagna longitude must be 0-360.");

  if (!isRecord(value.planets)) {
    issues.push("Chart planets object is required.");
  } else {
    for (const planet of PLANETS) {
      const data = value.planets[planet];
      if (!isRecord(data)) {
        issues.push(`${planet} data is missing.`);
        continue;
      }
      if (!isFiniteNumber(data.house) || data.house < 1 || data.house > 12) issues.push(`${planet}.house must be 1-12.`);
      if (!isFiniteNumber(data.lon) || data.lon < 0 || data.lon >= 360) issues.push(`${planet}.lon must be 0-360.`);
      if (typeof data.sign !== "string" || !data.sign) issues.push(`${planet}.sign is required.`);
    }
  }

  if (issues.length) return fail("Invalid chart data.", issues.slice(0, 12));
  return ok(value as unknown as ChartData);
}
