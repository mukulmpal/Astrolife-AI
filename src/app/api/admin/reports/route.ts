import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/access";
import { fetchReportAuditLogs } from "@/lib/report-tracker";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminUser(user.email)) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access only." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const limit = Math.min(Number(searchParams.get("limit") || 100), 500);
    const offset = Number(searchParams.get("offset") || 0);

    const reports = await fetchReportAuditLogs({ search, limit, offset });

    return NextResponse.json({ ok: true, reports });
  } catch (err: unknown) {
    console.error("[api/admin/reports] Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch report audit logs", detail: (err as Error)?.message },
      { status: 500 }
    );
  }
}
