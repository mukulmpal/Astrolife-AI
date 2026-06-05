import { NextRequest, NextResponse } from "next/server";
import { savePalmistryFeedback } from "@/lib/palmistry/storage";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, optionalText, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";

type FeedbackRequest = {
  sessionId: string;
  userId?: string | null;
  rating: number;
  accurateSections?: string[];
  inaccurateSections?: string[];
  feedback?: string;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function stringArray(value: unknown, maxItems = 20) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").slice(0, maxItems)
    : [];
}

function validateFeedbackBody(value: unknown): ValidationResult<FeedbackRequest> {
  if (!isRecord(value)) return fail("Palmistry feedback payload must be an object.");
  const sessionId = optionalText(value.sessionId, 120);
  const rating = value.rating;
  if (!sessionId) return fail("sessionId is required.");
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return fail("rating must be an integer between 1 and 5.");
  }
  return ok({
    sessionId,
    userId: optionalText(value.userId, 120) ?? null,
    rating,
    accurateSections: stringArray(value.accurateSections),
    inaccurateSections: stringArray(value.inaccurateSections),
    feedback: optionalText(value.feedback, 2_000) ?? "",
  });
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "palmistry-feedback", limit: 80, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateFeedbackBody, { maxBytes: 30_000, routeName: "palmistry-feedback" });
    if (!parsed.ok) return validationErrorResponse(parsed);
    const body = parsed.data;

    const feedback = await savePalmistryFeedback({
      sessionId: body.sessionId,
      userId: body.userId ?? null,
      rating: body.rating,
      accurateSections: body.accurateSections ?? [],
      inaccurateSections: body.inaccurateSections ?? [],
      feedback: body.feedback ?? "",
    });

    return NextResponse.json({ ok: true, feedback });
  } catch (error) {
    console.error("Palmistry feedback failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry feedback failed." },
      { status: 500 },
    );
  }
}
