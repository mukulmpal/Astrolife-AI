import { NextRequest, NextResponse } from "next/server";
import { createAstroPalmFusion } from "@/lib/palmistry/fusion/astro-palm-fusion";
import { normalizeAstroLifeFusionContext } from "@/lib/palmistry/fusion/fusion-context-normalizer";
import { buildPremiumPalmReport } from "@/lib/palmistry/report/premium-report-builder";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";
import type { AstroLifeFusionContext } from "@/lib/palmistry/fusion/fusion-types";
import type {
  PalmReportStyle,
  PalmRuleReport,
  PalmRuleTier,
} from "@/lib/palmistry/types";

type PremiumReportRequest = {
  palmResult: PalmRuleReport;
  astroContext?: AstroLifeFusionContext;
  raw?: unknown;
  birthData?: unknown;
  reportStyle?: PalmReportStyle;
  userTier?: PalmRuleTier;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validatePremiumReportBody(value: unknown): ValidationResult<PremiumReportRequest> {
  if (!isRecord(value)) return fail("Premium palm report payload must be an object.");
  if (!isRecord(value.palmResult)) return fail("palmResult is required.");
  return ok(value as PremiumReportRequest);
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "palmistry-premium-report", limit: 30, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validatePremiumReportBody, { maxBytes: 350_000, routeName: "palmistry-premium-report" });
    if (!parsed.ok) return validationErrorResponse(parsed);
    const body = parsed.data;

    const userTier = body.userTier ?? "premium";
    const astroContext = body.astroContext ?? normalizeAstroLifeFusionContext(body.raw ?? {
      birthData: body.birthData,
    });

    const fusion = createAstroPalmFusion({
      palmResult: body.palmResult,
      astroContext,
      userTier,
    });

    const report = buildPremiumPalmReport({
      palmResult: body.palmResult,
      fusion,
      style: body.reportStyle ?? "luxury",
    });

    return NextResponse.json({ ok: true, astroContext, fusion, report });
  } catch (error) {
    console.error("Palmistry premium report failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry premium report failed." },
      { status: 500 },
    );
  }
}
