import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getServerFeatureAccess, premiumBlockedResponse } from "@/lib/server-feature-access";
import { monitor } from "@/lib/server-monitoring";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";
import { validateChartData } from "@/lib/validation/chart";
import { runKPEngine } from "@/lib/astro-engine/kp";
import { buildEvidenceFirstReport } from "@/lib/report/evidence-first-report";
import type { ChartData } from "@/lib/astro-engine/calculations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ReportRequestBody = { chart: ChartData };

function validateRequestBody(value: unknown): ValidationResult<ReportRequestBody> {
  if (!isRecord(value)) return fail("Request body must be an object.");
  const chartResult = validateChartData(value.chart);
  if (!chartResult.ok) return chartResult;
  return ok({ chart: chartResult.data });
}

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, { scope: "api-evidence-first-report", limit: 30, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(request, validateRequestBody, { maxBytes: 500_000, routeName: "evidence-first-report" });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const access = await getServerFeatureAccess("basic_kundli");
    if (!access.allowed) {
      return NextResponse.json(premiumBlockedResponse(access), { status: access.authenticated ? 402 : 401 });
    }

    const { chart } = parsed.data;
    const kpResult = runKPEngine(chart);
    const reportPayload = buildEvidenceFirstReport(chart, kpResult);

    monitor.info("evidence_first_report.fetched", {
      reportId: reportPayload.reportId,
      sectionsCount: reportPayload.sections.length,
      tier: access.tier,
    });

    return NextResponse.json({
      ok: true,
      report: reportPayload,
    }, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-AstroLife-Evidence-Contract": "KP-CONTRACT-V1",
      },
    });
  } catch (err) {
    monitor.error("evidence_first_report.failed", err);
    return NextResponse.json(
      { ok: false, error: "Failed to generate evidence-first report payload", detail: String(err) },
      { status: 500 }
    );
  }
}

