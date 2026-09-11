import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readJsonWithLimit, validationErrorResponse } from "@/lib/validation/api";
import { normalizeSavedChart, validateSavedChartInput } from "../_saved-chart";

type Params = Promise<{ id: string }>;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getUserClient() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const { supabase, user } = await getUserClient();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("saved_charts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Chart not found" }, { status: 404 });

    return NextResponse.json({ chart: normalizeSavedChart(data) });
  } catch (error) {
    console.error("Saved chart fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch chart" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const { supabase, user } = await getUserClient();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await readJsonWithLimit(request, (value) => validateSavedChartInput(value, true), {
      maxBytes: 900_000,
      routeName: "charts-id",
    });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const { data, error } = await supabase
      .from("saved_charts")
      .update(parsed.data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Chart not found" }, { status: 404 });

    return NextResponse.json({ chart: normalizeSavedChart(data), success: true });
  } catch (error) {
    console.error("Saved chart update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update chart" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const { supabase, user } = await getUserClient();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { error } = await supabase
      .from("saved_charts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Saved chart delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete chart" },
      { status: 500 },
    );
  }
}
