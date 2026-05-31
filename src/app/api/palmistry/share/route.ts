import { NextResponse } from "next/server";
import { enablePalmistryShare } from "@/lib/palmistry/storage";

type ShareRequest = {
  sessionId: string;
  userId?: string | null;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<ShareRequest>;

    if (!body.sessionId) {
      return NextResponse.json({ ok: false, error: "sessionId is required." }, { status: 400 });
    }

    const share = await enablePalmistryShare({
      sessionId: body.sessionId,
      userId: body.userId ?? null,
    });

    return NextResponse.json({
      ok: true,
      shareUrl: `/palmistry/share/${share.share_token}`,
      share,
    });
  } catch (error) {
    console.error("Palmistry share failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry share failed." },
      { status: 500 },
    );
  }
}
