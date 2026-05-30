import { NextResponse } from "next/server";
import { getMissingFusionContext, normalizeAstroLifeFusionContext } from "@/lib/palmistry/fusion/fusion-context-normalizer";

type BuildFusionContextRequest = {
  raw?: unknown;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json() as BuildFusionContextRequest;
    const context = normalizeAstroLifeFusionContext(body.raw ?? body);

    return NextResponse.json({
      ok: true,
      context,
      missingContext: getMissingFusionContext(context),
    });
  } catch (error) {
    console.error("Palmistry build-fusion-context failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry build-fusion-context failed." },
      { status: 500 },
    );
  }
}
