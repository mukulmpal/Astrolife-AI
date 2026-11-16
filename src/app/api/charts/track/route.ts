import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
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
import fs from "fs/promises";
import path from "path";

type TrackChartBody = {
  name: string;
  dob: string;
  tob: string;
  city: string;
  lat: number | null;
  lon: number | null;
  tz: number | null;
  gender?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  chartData?: Record<string, unknown> | null;
};

async function saveKundliToDisk(entry: Record<string, unknown>) {
  try {
    const base = path.join(process.cwd(), "data", "kundlis");
    await fs.mkdir(base, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const file = path.join(base, `${date}.ndjson`);
    await fs.appendFile(file, JSON.stringify(entry) + "\n", { encoding: "utf8" });
  } catch (err) {
    console.error("saveKundliToDisk error:", err);
  }
}

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
    gender: optionalText(value.gender, 20) ?? null,
    userId: optionalText(value.userId, 100) ?? null,
    userEmail: optionalText(value.userEmail, 150) ?? null,
    chartData: isRecord(value.chartData) ? (value.chartData as Record<string, unknown>) : null,
  });
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "charts-track", limit: 120, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateTrackChartBody, { maxBytes: 150_000, routeName: "charts-track" });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const { name, dob, tob, city, lat, lon, tz, gender, userId: passedUserId, userEmail: passedUserEmail, chartData } = parsed.data;

    // Detect logged in user if available
    let effectiveUserId = passedUserId;
    let effectiveUserEmail = passedUserEmail;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        effectiveUserId = user.id;
        effectiveUserEmail = user.email ?? effectiveUserEmail;
      }
    } catch {
      // Non-fatal if session is not present
    }

    const payload = {
      user_id: effectiveUserId ?? null,
      name,
      dob,
      tob,
      city,
      lat,
      lon,
      tz: tz !== null ? String(tz) : null,
      chart_data: chartData ?? {},
      updated_at: new Date().toISOString(),
    };

    // Save to DB
    try {
      const admin = createAdminClient();
      await admin.from("user_charts").insert(payload);
    } catch (dbErr) {
      console.warn("DB chart track warning:", dbErr);
    }

    // Always log to disk as resilient audit record
    const diskRecord = {
      timestamp: new Date().toISOString(),
      user_id: effectiveUserId ?? null,
      user_email: effectiveUserEmail ?? "Anonymous",
      name,
      dob,
      tob,
      city,
      lat,
      lon,
      tz,
      gender,
      chart_summary: chartData ? {
        lagna: (chartData as Record<string, unknown>).lagnaRashi,
        moon: (chartData as Record<string, unknown>).planets ? ((chartData as Record<string, unknown>).planets as Record<string, { sign?: string }>).Moon?.sign : undefined,
      } : null,
    };
    saveKundliToDisk(diskRecord).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("chart track error:", e);
    return NextResponse.json({ ok: false });
  }
}
