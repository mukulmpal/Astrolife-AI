import { NextResponse } from "next/server";
import { savePalmistrySession } from "@/lib/palmistry/storage";
import type { PalmAnalyzeInput, PalmRuleReport } from "@/lib/palmistry/types";

type SaveSessionRequest = {
  userId?: string | null;
  imageUrl?: string | null;
  input: PalmAnalyzeInput;
  result: PalmRuleReport;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<SaveSessionRequest>;

    if (!body?.input || !body?.result) {
      return NextResponse.json({ ok: false, error: "Missing required fields: input and result are required." }, { status: 400 });
    }

    const session = await savePalmistrySession({
      userId: body.userId ?? null,
      imageUrl: body.imageUrl ?? null,
      input: body.input,
      result: body.result,
    });

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error("Palmistry save-session failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry save-session failed." },
      { status: 500 },
    );
  }
}
