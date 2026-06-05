import { NextRequest, NextResponse } from "next/server";
import {
  calculateLalKitabTimeEngine,
  type LalKitabTimeEngineInput,
} from "@/lib/lal-kitab";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";

function validateLalKitabTimeBody(value: unknown): ValidationResult<LalKitabTimeEngineInput> {
  if (!isRecord(value)) return fail("Lal Kitab time payload must be an object.");
  const issues: string[] = [];
  if (typeof value.dob !== "string" || !value.dob) issues.push("dob is required.");
  if (!isRecord(value.planets)) issues.push("planets are required.");
  if (issues.length) return fail("Invalid Lal Kitab time payload.", issues);
  return ok({
    dob: value.dob as string,
    planets: value.planets as LalKitabTimeEngineInput["planets"],
    lagnaNum: typeof value.lagnaNum === "number" ? value.lagnaNum : undefined,
    targetDate: typeof value.targetDate === "string" || value.targetDate instanceof Date ? value.targetDate : undefined,
  });
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "lal-kitab-time-engine", limit: 40, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateLalKitabTimeBody, { maxBytes: 180_000, routeName: "lal-kitab-time-engine" });
    if (!parsed.ok) return validationErrorResponse(parsed);
    const body = parsed.data;

    return NextResponse.json(calculateLalKitabTimeEngine(body));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
