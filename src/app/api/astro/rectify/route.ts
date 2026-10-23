import { NextRequest, NextResponse } from "next/server";
import {
  runBirthTimeRectification,
  type BTRInput,
  type BTRResult,
} from "@/lib/astro-engine/birth-rectification-engine";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, type ValidationResult } from "@/lib/validation/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface BTRResponse {
  success: boolean;
  error?: string;
  result?: BTRResult;
}

function validateBTRBody(value: unknown): ValidationResult<BTRInput> {
  if (!isRecord(value)) return fail("Rectification payload must be an object.");
  const issues: string[] = [];

  if (typeof value.city !== "string" || !value.city.trim()) {
    issues.push("city is required.");
  }

  if (!isRecord(value.dateRange)) {
    issues.push("dateRange object is required.");
  } else {
    if (typeof value.dateRange.startDate !== "string") issues.push("dateRange.startDate is required.");
    if (typeof value.dateRange.endDate !== "string") issues.push("dateRange.endDate is required.");
  }

  if (!isRecord(value.timeRange)) {
    issues.push("timeRange object is required.");
  } else {
    if (typeof value.timeRange.startTime !== "string") issues.push("timeRange.startTime is required.");
    if (typeof value.timeRange.endTime !== "string") issues.push("timeRange.endTime is required.");
  }

  if (!Array.isArray(value.events) || value.events.length < 1) {
    issues.push("At least one life event is required for rectification.");
  }

  if (issues.length) return fail("Invalid rectification payload.", issues);
  return ok(value as unknown as BTRInput);
}

export async function POST(request: NextRequest): Promise<NextResponse<BTRResponse>> {
  try {
    const limit = checkRateLimit(request, { scope: "astro-rectify", limit: 20, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt) as NextResponse<BTRResponse>;

    const parsedBody = await readJsonWithLimit(request, validateBTRBody, {
      maxBytes: 150_000,
      routeName: "astro-rectify",
    });

    if (!parsedBody.ok) {
      return NextResponse.json(
        { success: false, error: parsedBody.error },
        { status: 400 }
      );
    }

    const input = parsedBody.data;
    const result = runBirthTimeRectification(input);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Birth time rectification failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
