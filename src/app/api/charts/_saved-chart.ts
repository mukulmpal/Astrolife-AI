import type { ValidationResult } from "@/lib/validation/api";
import { fail, isFiniteNumber, isRecord, ok, optionalText } from "@/lib/validation/api";

export type SavedChartInput = {
  name: string;
  gender: string | null;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  chart_payload: Record<string, unknown> | null;
};

function normalizeNullableNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function normalizeSavedChart(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    name: String(row.name),
    gender: typeof row.gender === "string" ? row.gender : null,
    birth_date: String(row.birth_date),
    birth_time: String(row.birth_time),
    birth_place: String(row.birth_place),
    latitude: normalizeNullableNumber(row.latitude),
    longitude: normalizeNullableNumber(row.longitude),
    timezone: typeof row.timezone === "string" ? row.timezone : null,
    chart_payload: isRecord(row.chart_payload) ? row.chart_payload : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function validateSavedChartInput(value: unknown, partial = false): ValidationResult<Partial<SavedChartInput>> {
  if (!isRecord(value)) return fail("Chart payload must be an object.");

  const issues: string[] = [];
  const name = optionalText(value.name, 160);
  const gender = optionalText(value.gender, 40) ?? null;
  const birthDate = optionalText(value.birth_date ?? value.dob, 40);
  const birthTime = optionalText(value.birth_time ?? value.tob, 20);
  const birthPlace = optionalText(value.birth_place ?? value.city, 180);
  const timezone = optionalText(value.timezone, 80) ?? null;
  const chartPayload = isRecord(value.chart_payload)
    ? value.chart_payload
    : isRecord(value.chartData)
      ? value.chartData
      : isRecord(value.chart)
        ? value.chart
        : null;

  const hasLatitude = value.latitude !== undefined || value.lat !== undefined;
  const hasLongitude = value.longitude !== undefined || value.lon !== undefined;
  const rawLatitude = hasLatitude ? (value.latitude ?? value.lat ?? null) : null;
  const rawLongitude = hasLongitude ? (value.longitude ?? value.lon ?? null) : null;
  const latitude = isFiniteNumber(rawLatitude) ? rawLatitude : null;
  const longitude = isFiniteNumber(rawLongitude) ? rawLongitude : null;

  if (!partial || value.name !== undefined) {
    if (!name) issues.push("Name is required.");
  }
  if (!partial || value.birth_date !== undefined || value.dob !== undefined) {
    if (!birthDate || !Number.isFinite(new Date(`${birthDate}T00:00:00Z`).getTime())) {
      issues.push("Birth date must be a valid date.");
    }
  }
  if (!partial || value.birth_time !== undefined || value.tob !== undefined) {
    if (!birthTime || !/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(birthTime)) {
      issues.push("Birth time must use HH:mm or HH:mm:ss format.");
    }
  }
  if (!partial || value.birth_place !== undefined || value.city !== undefined) {
    if (!birthPlace) issues.push("Birth place is required.");
  }
  if (hasLatitude && rawLatitude !== null && (!isFiniteNumber(rawLatitude) || rawLatitude < -90 || rawLatitude > 90)) {
    issues.push("Latitude must be between -90 and 90.");
  }
  if (hasLongitude && rawLongitude !== null && (!isFiniteNumber(rawLongitude) || rawLongitude < -180 || rawLongitude > 180)) {
    issues.push("Longitude must be between -180 and 180.");
  }

  if (issues.length) return fail("Invalid saved chart payload.", issues);

  const data: Partial<SavedChartInput> = {};
  if (name) data.name = name;
  if (gender !== null || value.gender !== undefined) data.gender = gender;
  if (birthDate) data.birth_date = birthDate;
  if (birthTime) data.birth_time = birthTime;
  if (birthPlace) data.birth_place = birthPlace;
  if (hasLatitude) data.latitude = latitude;
  if (hasLongitude) data.longitude = longitude;
  if (timezone !== null || value.timezone !== undefined) data.timezone = timezone;
  if (chartPayload !== null || value.chart_payload !== undefined || value.chartData !== undefined || value.chart !== undefined) {
    data.chart_payload = chartPayload;
  }

  return ok(data);
}
