import { NextRequest, NextResponse } from "next/server";
import { monitor } from "@/lib/server-monitoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    monitor.error("client.runtime_error", new Error(String(body?.message || "Client error")), {
      type: body?.type,
      path: body?.path,
      source: body?.source,
      line: body?.line,
      column: body?.column,
      userAgent: request.headers.get("user-agent"),
    });
  } catch (error) {
    monitor.error("client.runtime_error_parse_failed", error);
  }

  return NextResponse.json({ ok: true });
}
