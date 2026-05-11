import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, dob, tob, city, lat, lon, tz, chartData } = await req.json();

    const { data, error } = await supabase
      .from("user_charts")
      .insert({
        user_id: user.id,
        name,
        dob,
        tob,
        city,
        lat,
        lon,
        tz,
        chart_data: chartData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, chart: data });
  } catch (error: unknown) {
    console.error("Chart save error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to save chart" }, { status: 500 });
  }
}
