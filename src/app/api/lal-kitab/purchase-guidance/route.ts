import { NextRequest, NextResponse } from "next/server";
import {
  getLalKitabPurchaseGuidance,
  type LalKitabPurchaseInput,
} from "@/lib/lal-kitab";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";

function validateLalKitabPurchaseBody(value: unknown): ValidationResult<LalKitabPurchaseInput> {
  if (!isRecord(value)) return fail("Lal Kitab purchase payload must be an object.");
  return ok(value as LalKitabPurchaseInput);
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "lal-kitab-purchase-guidance", limit: 40, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateLalKitabPurchaseBody, { maxBytes: 80_000, routeName: "lal-kitab-purchase-guidance" });
    if (!parsed.ok) return validationErrorResponse(parsed);
    const body = parsed.data;
    const guidance = getLalKitabPurchaseGuidance(body);

    return NextResponse.json({
      engine: "Lal Kitab Purchase Grammar",
      version: "0.1.0",
      safety:
        "Derived/paraphrased rules. Not a verbatim reproduction. Use with chart validation.",
      guidance,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
