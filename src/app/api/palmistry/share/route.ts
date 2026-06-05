import { NextRequest, NextResponse } from "next/server";
import { enablePalmistryShare } from "@/lib/palmistry/storage";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, optionalText, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";

type ShareRequest = {
  sessionId: string;
  userId?: string | null;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateShareBody(value: unknown): ValidationResult<ShareRequest> {
  if (!isRecord(value)) return fail("Palmistry share payload must be an object.");
  const sessionId = optionalText(value.sessionId, 120);
  if (!sessionId) return fail("sessionId is required.");
  return ok({ sessionId, userId: optionalText(value.userId, 120) ?? null });
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "palmistry-share", limit: 60, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateShareBody, { maxBytes: 12_000, routeName: "palmistry-share" });
    if (!parsed.ok) return validationErrorResponse(parsed);
    const body = parsed.data;

    const share = await enablePalmistryShare({
      sessionId: body.sessionId,
      userId: body.userId ?? null,
    });

    return NextResponse.json({
      ok: true,
      shareUrl: `/palmistry/share/${share.share_token}`,
      share,
    });
  } catch (error) {
    console.error("Palmistry share failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry share failed." },
      { status: 500 },
    );
  }
}
