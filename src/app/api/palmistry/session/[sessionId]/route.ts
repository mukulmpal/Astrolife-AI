import { NextResponse } from "next/server";
import { getPalmistrySession } from "@/lib/palmistry/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { sessionId } = await params;
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "sessionId is required." }, { status: 400 });
    }

    const session = await getPalmistrySession({ sessionId, userId });

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("Palmistry session fetch failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry session fetch failed." },
      { status: 500 },
    );
  }
}
