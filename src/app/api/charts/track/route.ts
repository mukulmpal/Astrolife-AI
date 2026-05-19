import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, dob, tob, city, lat, lon, tz } = await req.json();
    if (!name || !dob || !tob || !city) {
      return NextResponse.json({ ok: false });
    }

    const admin = createAdminClient();
    await admin.from("user_charts").insert({
      user_id:    null,
      name:       String(name).slice(0, 120),
      dob:        String(dob),
      tob:        String(tob),
      city:       String(city).slice(0, 120),
      lat:        lat ?? null,
      lon:        lon ?? null,
      tz:         tz ?? null,
      chart_data: {},
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("chart track error:", e);
    return NextResponse.json({ ok: false });
  }
}
