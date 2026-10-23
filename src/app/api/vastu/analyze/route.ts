import { NextRequest, NextResponse } from "next/server";
import { analyzeVastuPropertyV3 } from "@/lib/vastu-intelligence/engine-v3";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";

const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "CENTER"] as const;

function validateVastuBody(value: unknown): ValidationResult<Record<string, unknown>> {
  if (!isRecord(value)) return fail("Vastu payload must be an object.");
  const issues: string[] = [];
  if (value.facing !== undefined && !DIRECTIONS.includes(value.facing as typeof DIRECTIONS[number])) {
    issues.push("Facing direction is invalid.");
  }
  if (!Array.isArray(value.rooms) || value.rooms.length < 1 || value.rooms.length > 40) {
    issues.push("rooms must contain 1-40 rooms.");
  } else {
    for (const room of value.rooms) {
      if (!isRecord(room) || typeof room.type !== "string" || !DIRECTIONS.includes(room.direction as typeof DIRECTIONS[number])) {
        issues.push("Each room must include type and valid direction.");
        break;
      }
    }
  }
  if (issues.length) return fail("Invalid Vastu payload.", issues);
  return ok(value);
}

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, { scope: "vastu-analyze", limit: 40, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsedBody = await readJsonWithLimit(request, validateVastuBody, { maxBytes: 180_000, routeName: "vastu-analyze" });
    if (!parsedBody.ok) return validationErrorResponse(parsedBody);

    const body = parsedBody.data;
    const result = analyzeVastuPropertyV3(body);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to analyze Vastu property";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
