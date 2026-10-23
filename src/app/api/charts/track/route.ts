import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import {
  fail,
  isFiniteNumber,
  isRecord,
  ok,
  optionalText,
  readJsonWithLimit,
  validationErrorResponse,
  type ValidationResult,
} from "@/lib/validation/api";
import { NextRequest, NextResponse } from "next/server";

type TrackChartBody = {
  name: string;
  dob: string;
  tob: string;
  city: string;
  lat: number | null;
  lon: number | null;
  tz: number | null;
};

function validateTrackChartBody(value: unknown): ValidationResult<TrackChartBody> {
  if (!isRecord(value)) return fail("Chart tracking payload must be an object.");

  const issues: string[] = [];
  const name = optionalText(value.name, 120);
  const dob = optionalText(value.dob, 40);
  const tob = optionalText(value.tob, 20);
  const city = optionalText(value.city, 120);

  if (!name) issues.push("Name is required.");
  if (!dob || !Number.isFinite(new Date(dob).getTime())) issues.push("DOB must be a valid date string.");
  if (!tob || !/^([01]\d|2[0-3]):[0-5]\d$/.test(tob)) issues.push("Birth time must use HH:mm format.");
  if (!city) issues.push("City is required.");

  const lat = value.lat ?? null;
  const lon = value.lon ?? null;
  const tz = value.tz ?? null;
  const normalizedLat = isFiniteNumber(lat) ? lat : null;
  const normalizedLon = isFiniteNumber(lon) ? lon : null;
  const normalizedTz = isFiniteNumber(tz) ? tz : null;

  if (lat !== null && (!isFiniteNumber(lat) || lat < -90 || lat > 90)) {
    issues.push("Latitude must be a number between -90 and 90.");
  }
  if (lon !== null && (!isFiniteNumber(lon) || lon < -180 || lon > 180)) {
    issues.push("Longitude must be a number between -180 and 180.");
  }
  if (tz !== null && (!isFiniteNumber(tz) || tz < -12 || tz > 14)) {
    issues.push("Timezone must be a number between -12 and 14.");
  }

  if (issues.length) return fail("Invalid chart tracking payload.", issues);

  return ok({
    name: name as string,
    dob: dob as string,
    tob: tob as string,
    city: city as string,
    lat: normalizedLat,
    lon: normalizedLon,
    tz: normalizedTz,
  });
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "charts-track", limit: 80, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateTrackChartBody, { maxBytes: 24_000, routeName: "charts-track" });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const { name, dob, tob, city, lat, lon, tz } = parsed.data;

    const admin = createAdminClient();
    await admin.from("user_charts").insert({
      user_id:    null,
      name,
      dob,
      tob,
      city,
      lat,
      lon,
      tz,
      chart_data: {},
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("chart track error:", e);
    return NextResponse.json({ ok: false });
  }
}
