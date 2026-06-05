import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";
import { validateChartData } from "@/lib/validation/chart";
import type { ChartData } from "@/lib/astro-engine/calculations";

type SaveChartBody = {
  chartData: ChartData;
};

function validateSaveChartBody(value: unknown): ValidationResult<SaveChartBody> {
  if (!isRecord(value)) return fail("Chart save payload must be an object.");
  const chartResult = validateChartData(value.chartData);
  if (!chartResult.ok) return fail("Invalid chart payload.", chartResult.issues);
  return ok({ chartData: chartResult.data });
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "charts-save", limit: 30, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await readJsonWithLimit(req, validateSaveChartBody, { maxBytes: 850_000, routeName: "charts-save" });
    if (!parsed.ok) return validationErrorResponse(parsed);
    const { chartData } = parsed.data;

    const { data: existing } = await supabase
      .from("charts")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", chartData.name)
      .eq("dob", chartData.dob)
      .eq("tob", chartData.tob)
      .eq("city", chartData.city)
      .maybeSingle();

    if (existing?.id) {
      return NextResponse.json(
        { success: false, duplicate: true, error: "Chart already saved." },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from("charts")
      .insert({
        user_id: user.id,
        chart_type: "self",
        name: chartData.name,
        dob: chartData.dob,
        tob: chartData.tob,
        city: chartData.city,
        lat: chartData.lat,
        lon: chartData.lon,
        chart_json: chartData,
        is_primary: false,
        updated_at: new Date().toISOString(),
      })
      .select("id,name,dob,tob,city,created_at,is_primary")
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, chart: data });
  } catch (error: unknown) {
    console.error("Chart save error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to save chart" }, { status: 500 });
  }
}
