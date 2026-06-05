import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("charts")
      .select("id, name, dob, tob, city, chart_type, is_primary, created_at")
      .eq("user_id", user.id)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const charts = (data ?? []).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      dob: String(row.dob),
      tob: String(row.tob),
      city: String(row.city),
      created_at: String(row.created_at),
      is_primary: Boolean(row.is_primary),
    }));

    return NextResponse.json({ charts });
  } catch (error: unknown) {
    console.error("List charts error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list charts" },
      { status: 500 },
    );
  }
}
