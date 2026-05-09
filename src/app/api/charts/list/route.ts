import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("user_charts")
      .select("id, name, dob, tob, city, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ charts: data || [] });
  } catch (error: unknown) {
    console.error("List charts error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to list charts" }, { status: 500 });
  }
}
