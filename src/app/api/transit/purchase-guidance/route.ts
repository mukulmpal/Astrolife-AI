import { NextRequest, NextResponse } from "next/server";
import { calculateTransitReport, type NatalChartForTransit, type TransitBase } from "@/lib/astro-engine/transits";
import { generateCombinedTransitPurchaseGuidance } from "@/lib/astro-engine/transit-purchase-combined";
import type { LalKitabPurchaseInput } from "@/lib/lal-kitab";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";

type RequestBody = {
  chart: NatalChartForTransit;
  base?: TransitBase;
  date?: string;
  lalKitab?: Omit<LalKitabPurchaseInput, "transitHouses">;
};

const BASES = ["lagna", "moon"] as const;

function validateTransitPurchaseBody(value: unknown): ValidationResult<RequestBody> {
  if (!isRecord(value)) return fail("Transit purchase payload must be an object.");
  const issues: string[] = [];
  if (!isRecord(value.chart)) issues.push("A natal chart is required. Generate your kundli first.");
  if (value.base !== undefined && !BASES.includes(value.base as typeof BASES[number])) issues.push("Invalid transit base.");
  if (value.date !== undefined && !Number.isFinite(new Date(String(value.date)).getTime())) issues.push("Invalid date.");
  if (issues.length) return fail("Invalid transit purchase payload.", issues);
  return ok(value as RequestBody);
}

export async function POST(request: NextRequest) {
  try {
    const limit = checkRateLimit(request, { scope: "transit-purchase-guidance", limit: 40, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsedBody = await readJsonWithLimit(request, validateTransitPurchaseBody, { maxBytes: 220_000, routeName: "transit-purchase-guidance" });
    if (!parsedBody.ok) return validationErrorResponse(parsedBody);
    const body = parsedBody.data;

    const transitReport = calculateTransitReport({
      chart: body.chart,
      base: body.base ?? "moon",
      date: body.date ? new Date(body.date) : new Date(),
    });
    const result = generateCombinedTransitPurchaseGuidance({
      transitReport,
      lalKitab: body.lalKitab ?? {},
    });

    return NextResponse.json({
      engine: "Transit Purchase Guidance",
      version: "0.1.0",
      safety:
        "Combines standard Gochar transit timing with derived Lal Kitab object/gift caution. This is not Lal Kitab 35-sala chakra, varshphal, or monthly phal.",
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
