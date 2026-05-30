import { NextRequest, NextResponse } from "next/server";
import { extractPalmFeaturesWithGemini, fallbackPalmVisionResult } from "@/lib/palmistry/vision/ai-feature-extractor";
import { getServerFeatureAccess, premiumBlockedResponse } from "@/lib/server-feature-access";
import { monitor } from "@/lib/server-monitoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png"];

export async function POST(request: NextRequest) {
  try {
    const access = await getServerFeatureAccess("palmistry");
    if (!access.allowed) {
      return NextResponse.json(premiumBlockedResponse(access), { status: access.authenticated ? 402 : 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing palm image file." }, { status: 400 });
    }

    const mime = file.type.toLowerCase();
    if (!ALLOWED.includes(mime)) {
      return NextResponse.json({ ok: false, error: "Only JPG and PNG images are supported." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Image too large. Maximum 5MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await extractPalmFeaturesWithGemini(buffer.toString("base64"), mime);

    monitor.info("palmistry.features_extracted", {
      feature: "palmistry",
      quality: result.imageQuality.score,
      canAnalyze: result.imageQuality.canAnalyze,
      uncertain: result.uncertainFeatures.length,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Palm feature extraction failed";
    monitor.error("palmistry.feature_extract_failed", error, { message });
    return NextResponse.json({
      ok: true,
      result: fallbackPalmVisionResult("AI vision could not process this image. Please upload a clearer palm photo."),
    });
  }
}
