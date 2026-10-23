import { NextRequest, NextResponse } from "next/server";
import { savePalmistrySession } from "@/lib/palmistry/storage";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, optionalText, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";
import type { PalmAnalyzeInput, PalmRuleReport } from "@/lib/palmistry/types";

type SaveSessionRequest = {
  userId?: string | null;
  imageUrl?: string | null;
  input: PalmAnalyzeInput;
  result: PalmRuleReport;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validateSaveSessionBody(value: unknown): ValidationResult<SaveSessionRequest> {
  if (!isRecord(value)) return fail("Palmistry session payload must be an object.");
  if (!isRecord(value.input) || !isRecord(value.result)) {
    return fail("Missing required fields: input and result are required.");
  }
  return ok({
    userId: optionalText(value.userId, 120) ?? null,
    imageUrl: optionalText(value.imageUrl, 4_000) ?? null,
    input: value.input as unknown as PalmAnalyzeInput,
    result: value.result as unknown as PalmRuleReport,
  });
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "palmistry-save-session", limit: 60, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateSaveSessionBody, { maxBytes: 300_000, routeName: "palmistry-save-session" });
    if (!parsed.ok) return validationErrorResponse(parsed);
    const body = parsed.data;

    const session = await savePalmistrySession({
      userId: body.userId ?? null,
      imageUrl: body.imageUrl ?? null,
      input: body.input,
      result: body.result,
    });

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("Palmistry save-session failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry save-session failed." },
      { status: 500 },
    );
  }
}
