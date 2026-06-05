import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, optionalText, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";
import { validateChartData } from "@/lib/validation/chart";
import type { ChartData } from "@/lib/astro-engine/calculations";

type UserChartSaveBody = {
  chartData: ChartData;
  country?: string;
  engines?: unknown;
};

function validateUserChartSaveBody(value: unknown): ValidationResult<UserChartSaveBody> {
  if (!isRecord(value)) return fail("User chart payload must be an object.");
  const chartResult = validateChartData(value.chartData);
  if (!chartResult.ok) return fail("Invalid chart payload.", chartResult.issues);
  return ok({
    chartData: chartResult.data,
    country: optionalText(value.country, 120),
    engines: isRecord(value.engines) ? value.engines : undefined,
  });
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "user-charts-save", limit: 30, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = await readJsonWithLimit(req, validateUserChartSaveBody, { maxBytes: 950_000, routeName: "user-charts-save" });
    if (!parsed.ok) return validationErrorResponse(parsed);
    const { chartData, country, engines } = parsed.data;

    // Preserve legacy user_charts writes for older integrations.
    const { data, error } = await supabase
      .from('user_charts')
      .insert({
        user_id: user.id,
        name: chartData.name,
        dob: chartData.dob,
        tob: chartData.tob,
        city: chartData.city,
        country,
        timezone: chartData.tz,
        latitude: chartData.lat,
        longitude: chartData.lon,
        chart_data: chartData,
        engines_data: engines, // Store all engine calculations
        created_at: new Date().toISOString(),
        is_default: false,
      })
      .select()
      .single();

    if (error) throw error;

    const { data: existingChart } = await supabase
      .from("charts")
      .select("id")
      .eq("user_id", user.id)
      .eq("name", chartData.name)
      .eq("dob", chartData.dob)
      .eq("tob", chartData.tob)
      .eq("city", chartData.city)
      .maybeSingle();

    if (!existingChart?.id) {
      const { error: mirrorError } = await supabase
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
        });

      if (mirrorError) {
        console.warn("Legacy user_charts save succeeded, charts mirror skipped:", mirrorError);
      }
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      message: 'Chart saved successfully',
    });
  } catch (err) {
    console.error('Error saving chart:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save chart' },
      { status: 500 }
    );
  }
}
