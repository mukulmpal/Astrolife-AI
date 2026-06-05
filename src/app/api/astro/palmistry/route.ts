import { NextRequest, NextResponse } from "next/server";
import {
  buildPalmistryPrompt,
  parsePalmistryReport,
  extractJson,
  type BirthContext,
  type PalmistryReport,
} from "@/lib/astro-engine/palmistry-engine";
import { getServerFeatureAccess, premiumBlockedResponse } from "@/lib/server-feature-access";
import { monitor } from "@/lib/server-monitoring";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, optionalText, readJsonWithLimit, sanitizeText, type ValidationResult } from "@/lib/validation/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/jpg", "image/png"];

interface PalmistryRequest {
  image: string;        // data URL or raw base64
  mimeType?: string;    // when image is raw base64
  birth?: BirthContext;
}

interface PalmistryResponse {
  success: boolean;
  error?: string;
  report?: PalmistryReport;
  model?: string;
}

function validatePalmistryBody(value: unknown): ValidationResult<PalmistryRequest> {
  if (!isRecord(value)) return fail("Palmistry payload must be an object.");
  const image = sanitizeText(value.image, 7_200_000);
  const mimeType = optionalText(value.mimeType, 40);
  if (!image) return fail("Missing palm image.");
  if (mimeType && !ALLOWED.includes(mimeType.toLowerCase())) return fail("Only JPG and PNG images are supported.");

  return ok({
    image,
    mimeType,
    birth: isRecord(value.birth) ? value.birth as BirthContext : undefined,
  });
}

function parseDataUrl(image: string, fallbackMime?: string): { mime: string; base64: string } | null {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(image.trim());
  if (match) return { mime: match[1].toLowerCase(), base64: match[2] };
  // Raw base64 — trust provided mime
  if (/^[A-Za-z0-9+/=\s]+$/.test(image.trim()) && fallbackMime) {
    return { mime: fallbackMime.toLowerCase(), base64: image.trim() };
  }
  return null;
}

async function analyzeWithGemini(
  base64: string,
  mime: string,
  prompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mime === "image/jpg" ? "image/jpeg" : mime, data: base64 } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 16384,
        responseMimeType: "application/json",
        // gemini-2.5-flash enables "thinking" by default which consumes the
        // output budget and truncates the JSON. Disable it for full reports.
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Gemini vision error");

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from vision model");
  return text;
}

export async function POST(request: NextRequest): Promise<NextResponse<PalmistryResponse>> {
  try {
    const limit = checkRateLimit(request, { scope: "astro-palmistry", limit: 12, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt) as NextResponse<PalmistryResponse>;

    const access = await getServerFeatureAccess("palmistry");
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

    const parsedBody = await readJsonWithLimit(request, validatePalmistryBody, { maxBytes: 7_500_000, routeName: "astro-palmistry" });
    if (!parsedBody.ok) {
      return NextResponse.json(
        { success: false, error: parsedBody.error },
        { status: 400 },
      );
    }
    const body = parsedBody.data;

    const parsed = parseDataUrl(body.image, body.mimeType);
    if (!parsed) {
      return NextResponse.json(
        { success: false, error: "Invalid image format. Upload a JPG or PNG." },
        { status: 400 }
      );
    }

    if (!ALLOWED.includes(parsed.mime)) {
      return NextResponse.json(
        { success: false, error: "Only JPG and PNG images are supported." },
        { status: 400 }
      );
    }

    // Validate decoded size (base64 → bytes ≈ len * 3/4)
    const approxBytes = Math.floor((parsed.base64.replace(/\s/g, "").length * 3) / 4);
    if (approxBytes > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: "Image too large. Maximum 5MB." },
        { status: 400 }
      );
    }

    const prompt = buildPalmistryPrompt(body.birth);
    const rawText = await analyzeWithGemini(parsed.base64.replace(/\s/g, ""), parsed.mime, prompt);
    const report = parsePalmistryReport(extractJson(rawText));

    monitor.info("palmistry.generated", {
      feature: "palmistry",
      tier: access.tier,
      confidence: report.finalIntelligenceScore?.confidence,
      score: report.finalIntelligenceScore?.score,
    });

    return NextResponse.json({ success: true, report, model: "gemini-2.5-flash" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    monitor.error("palmistry.failed", error, { message });
    return NextResponse.json(
      { success: false, error: "Palm analysis failed. Please try again with a clearer photo." },
      { status: 500 }
    );
  }
}
