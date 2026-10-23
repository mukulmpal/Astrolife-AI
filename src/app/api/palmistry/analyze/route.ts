import { NextRequest, NextResponse } from "next/server";
import { generatePalmistryRuleReport } from "@/lib/palmistry/report-generator";
import { normalizePalmImageQuality } from "@/lib/palmistry/vision/quality-check";
import type { PalmAnalyzeInput } from "@/lib/palmistry/types";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HAND_SIDES = ["left", "right", "both", "unknown"] as const;
const DOMINANT_HANDS = ["left", "right", "unknown"] as const;
const REPORT_STYLES = ["classical", "scientific", "luxury"] as const;

function validatePalmAnalyzeBody(value: unknown): ValidationResult<PalmAnalyzeInput> {
  if (!isRecord(value)) return fail("Palmistry analysis payload must be an object.");
  const issues: string[] = [];
  if (!HAND_SIDES.includes(value.handSide as typeof HAND_SIDES[number])) issues.push("handSide is invalid.");
  if (!DOMINANT_HANDS.includes(value.dominantHand as typeof DOMINANT_HANDS[number])) issues.push("dominantHand is invalid.");
  if (!REPORT_STYLES.includes(value.reportStyle as typeof REPORT_STYLES[number])) issues.push("reportStyle is invalid.");
  if (!isRecord(value.features)) issues.push("features object is required.");
  if (issues.length) return fail("Invalid palmistry analysis payload.", issues);
  return ok(value as unknown as PalmAnalyzeInput);
}

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, { scope: "palmistry-analyze", limit: 60, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsedBody = await readJsonWithLimit(request, validatePalmAnalyzeBody, { maxBytes: 180_000, routeName: "palmistry-analyze" });
    if (!parsedBody.ok) return validationErrorResponse(parsedBody);
    const body = parsedBody.data;

    const result = generatePalmistryRuleReport({
      handSide: body.handSide,
      dominantHand: body.dominantHand,
      reportStyle: body.reportStyle,
      imageQuality: normalizePalmImageQuality(body.imageQuality),
      features: body.features,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry rule analysis failed." },
      { status: 500 },
    );
  }
}
