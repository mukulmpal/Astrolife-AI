import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { readJsonWithLimit, validationErrorResponse } from "@/lib/validation/api";
import { normalizeSavedChart, validateSavedChartInput } from "./_saved-chart";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("saved_charts")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({
      charts: (data ?? []).map((row) => normalizeSavedChart(row)),
    });
  } catch (error) {
    console.error("Saved charts list error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list charts" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, { scope: "saved-charts-post", limit: 60, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await readJsonWithLimit(request, (value) => validateSavedChartInput(value), {
      maxBytes: 900_000,
      routeName: "charts",
    });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const { data, error } = await supabase
      .from("saved_charts")
      .insert({
        ...parsed.data,
        user_id: user.id,
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ chart: normalizeSavedChart(data), success: true }, { status: 201 });
  } catch (error) {
    console.error("Saved chart create error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save chart" },
      { status: 500 },
    );
  }
}
