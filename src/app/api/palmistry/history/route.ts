import { NextResponse } from "next/server";
import { listPalmistrySessions } from "@/lib/palmistry/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const limit = Number(url.searchParams.get("limit") ?? 20);

    const sessions = await listPalmistrySessions({
      userId,
      limit: Number.isFinite(limit) ? limit : 20,
    });

    return NextResponse.json({ ok: true, sessions });
  } catch (error) {
    console.error("Palmistry history failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry history failed." },
      { status: 500 },
    );
  }
}
