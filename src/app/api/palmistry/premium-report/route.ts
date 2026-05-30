import { NextResponse } from "next/server";
import { createAstroPalmFusion } from "@/lib/palmistry/fusion/astro-palm-fusion";
import { buildPremiumPalmReport } from "@/lib/palmistry/report/premium-report-builder";
import type { AstroLifeFusionContext } from "@/lib/palmistry/fusion/fusion-types";
import type {
  PalmReportStyle,
  PalmRuleReport,
  PalmRuleTier,
} from "@/lib/palmistry/types";

type PremiumReportRequest = {
  palmResult: PalmRuleReport;
  astroContext?: AstroLifeFusionContext;
  reportStyle?: PalmReportStyle;
  userTier?: PalmRuleTier;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<PremiumReportRequest>;

    if (!body?.palmResult) {
      return NextResponse.json({ ok: false, error: "palmResult is required." }, { status: 400 });
    }

    const userTier = body.userTier ?? "premium";

    const fusion = createAstroPalmFusion({
      palmResult: body.palmResult,
      astroContext: body.astroContext,
      userTier,
    });

    const report = buildPremiumPalmReport({
      palmResult: body.palmResult,
      fusion,
      style: body.reportStyle ?? "luxury",
    });

    return NextResponse.json({ ok: true, fusion, report });
  } catch (error) {
    console.error("Palmistry premium report failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry premium report failed." },
      { status: 500 },
    );
  }
}
