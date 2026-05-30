import { NextRequest, NextResponse } from "next/server";
import { generatePalmistryRuleReport } from "@/lib/palmistry/report-generator";
import { normalizePalmImageQuality } from "@/lib/palmistry/vision/quality-check";
import type { PalmAnalyzeInput } from "@/lib/palmistry/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<PalmAnalyzeInput>;
    if (!body.features || !body.handSide || !body.dominantHand || !body.reportStyle) {
      return NextResponse.json({ ok: false, error: "Missing handSide, dominantHand, reportStyle, or features." }, { status: 400 });
    }

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
