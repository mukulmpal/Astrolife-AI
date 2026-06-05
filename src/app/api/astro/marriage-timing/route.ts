import { NextRequest, NextResponse } from "next/server";
import { buildMarriageIntelligenceV2 } from "@/lib/astro-engine/marriage-intelligence-v2";
import type { MarriageTimingInput } from "@/lib/astro-engine/marriage-timing-kn-rao";
import type { DivChart } from "@/lib/astro-engine/divisional";
import type { KPEngineResult } from "@/lib/astro-engine/kp";
import type { EventRadarReport } from "@/lib/astro-engine/event-radar";
import { getServerFeatureAccess, premiumBlockedResponse } from "@/lib/server-feature-access";
import { monitor } from "@/lib/server-monitoring";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, type ValidationResult } from "@/lib/validation/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface MarriageTimingRequest {
  // K.N. Rao Timing Input
  knRaoTiming: MarriageTimingInput;

  // Optional divisional charts
  divs?: DivChart[];

  // Optional KP result
  kp?: KPEngineResult;

  // Optional event radar
  radar?: EventRadarReport;

  // Language preference
  language?: "hinglish" | "hindi" | "english";

  // Output format preference
  outputFormat?: "full" | "json-only" | "narrative-only" | "dashboard" | "pdf" | "chat";
}

interface MarriageTimingResponse {
  success: boolean;
  error?: string;
  report?: unknown;
}

const OUTPUT_FORMATS = ["full", "json-only", "narrative-only", "dashboard", "pdf", "chat"] as const;
const LANGUAGES = ["hinglish", "hindi", "english"] as const;

function validateMarriageTimingBody(value: unknown): ValidationResult<Partial<MarriageTimingRequest> & { knRaoTiming: MarriageTimingInput }> {
  if (!isRecord(value)) return fail("Marriage timing payload must be an object.");
  const issues: string[] = [];
  if (!isRecord(value.knRaoTiming)) issues.push("knRaoTiming is required.");
  if (value.outputFormat !== undefined && !OUTPUT_FORMATS.includes(value.outputFormat as typeof OUTPUT_FORMATS[number])) {
    issues.push("Invalid outputFormat.");
  }
  if (value.language !== undefined && !LANGUAGES.includes(value.language as typeof LANGUAGES[number])) {
    issues.push("Invalid language.");
  }
  if (Array.isArray(value.divs) && value.divs.length > 32) issues.push("Too many divisional charts.");
  if (issues.length) return fail("Invalid marriage timing payload.", issues);
  return ok(value as Partial<MarriageTimingRequest> & { knRaoTiming: MarriageTimingInput });
}

export async function POST(request: NextRequest): Promise<NextResponse<MarriageTimingResponse>> {
  try {
    const limit = checkRateLimit(request, { scope: "marriage-timing", limit: 30, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt) as NextResponse<MarriageTimingResponse>;

    const access = await getServerFeatureAccess("marriage_timing");
    if (!access.allowed) {
      monitor.warn("premium.blocked", {
        feature: access.feature,
        reason: access.reason,
        tier: access.tier,
      });

      return NextResponse.json(
        premiumBlockedResponse(access),
        { status: access.authenticated ? 402 : 401 },
      );
    }

    const parsedBody = await readJsonWithLimit(request, validateMarriageTimingBody, { maxBytes: 400_000, routeName: "marriage-timing" });
    if (!parsedBody.ok) {
      return NextResponse.json(
        { success: false, error: parsedBody.error },
        { status: 400 },
      );
    }
    const body = parsedBody.data;

    // Build the marriage intelligence result with K.N. Rao timing
    const result = buildMarriageIntelligenceV2({
      divs: body.divs,
      kp: body.kp,
      radar: body.radar,
      knRaoTiming: {
        ...body.knRaoTiming,
        language: body.language || "hinglish",
      },
    });

    const outputFormat = body.outputFormat || "full";

    // Format response based on user preference
    let report: unknown = null;

    if (outputFormat === "full") {
      // Complete 3-level output
      report = {
        // LEVEL 1: BACKEND JSON
        backendJson: result.knRaoTiming?.backendJson,

        // LEVEL 2: USER-FACING NARRATIVE
        userFacingNarrative: result.knRaoTiming?.userFacingNarrative,

        // LEVEL 3: FORMAT-SPECIFIC OUTPUTS
        formats: {
          dashboardCard: result.knRaoTiming?.dashboardCard,
          pdfSection: result.knRaoTiming?.pdfSection,
          chatContext: result.knRaoTiming?.chatContext,
        },

        // SUPPORTING INTELLIGENCE
        divisionalAnalysis: result.divisional,
        shodashvargaWisdom: result.shodashvargaWisdom,
        kpValidation: result.kp,
        eventRadarTriggers: result.eventRadar,
        overallIntegration: {
          overallScore: result.overallScore,
          title: result.title,
          narrative: result.narrative,
          safetyBoundary: result.safetyBoundary,
        },
      };
    } else if (outputFormat === "json-only") {
      report = result.knRaoTiming?.backendJson;
    } else if (outputFormat === "narrative-only") {
      report = {
        userFacingNarrative: result.knRaoTiming?.userFacingNarrative,
      };
    } else if (outputFormat === "dashboard") {
      report = result.knRaoTiming?.dashboardCard;
    } else if (outputFormat === "pdf") {
      report = result.knRaoTiming?.pdfSection;
    } else if (outputFormat === "chat") {
      report = result.knRaoTiming?.chatContext;
    }

    monitor.info("marriage_timing.generated", {
      feature: "marriage_timing",
      tier: access.tier,
      outputFormat,
      overallScore: result.overallScore,
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    monitor.error("marriage_timing.failed", error, { errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
