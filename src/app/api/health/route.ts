import { NextResponse } from "next/server";
import { createRequestId, monitor } from "@/lib/server-monitoring";

export const dynamic = "force-dynamic";

export function GET() {
  const requestId = createRequestId("health");

  monitor.info("health.ok", { requestId });

  return NextResponse.json({
    ok: true,
    requestId,
    service: "astrolife-ai",
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
}

