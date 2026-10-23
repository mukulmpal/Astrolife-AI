import { NextRequest, NextResponse } from "next/server";
import { getMissingFusionContext, normalizeAstroLifeFusionContext } from "@/lib/palmistry/fusion/fusion-context-normalizer";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";

type BuildFusionContextRequest = {
  raw?: unknown;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateBuildFusionContextBody(value: unknown): ValidationResult<BuildFusionContextRequest> {
  if (!isRecord(value)) return fail("Fusion context payload must be an object.");
  return ok(value as BuildFusionContextRequest);
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "palmistry-build-fusion-context", limit: 60, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateBuildFusionContextBody, { maxBytes: 250_000, routeName: "palmistry-build-fusion-context" });
    if (!parsed.ok) return validationErrorResponse(parsed);
    const body = parsed.data;
    const context = normalizeAstroLifeFusionContext(body.raw ?? body);

    return NextResponse.json({
      ok: true,
      context,
      missingContext: getMissingFusionContext(context),
    });
  } catch (error) {
    console.error("Palmistry build-fusion-context failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry build-fusion-context failed." },
      { status: 500 },
    );
  }
}
