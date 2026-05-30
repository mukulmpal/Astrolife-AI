import { NextRequest, NextResponse } from "next/server";
import {
  buildPalmistryPrompt,
  parsePalmistryReport,
  extractJson,
  type BirthContext,
  type PalmistryReport,
} from "@/lib/astro-engine/palmistry-engine";

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
    const body = (await request.json()) as Partial<PalmistryRequest>;

    if (!body.image || typeof body.image !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing palm image." },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ success: true, report, model: "gemini-2.5-flash" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[palmistry-api]", message);
    return NextResponse.json(
      { success: false, error: "Palm analysis failed. Please try again with a clearer photo." },
      { status: 500 }
    );
  }
}
