import { NextResponse } from "next/server";
import { savePalmistryFeedback } from "@/lib/palmistry/storage";

type FeedbackRequest = {
  sessionId: string;
  userId?: string | null;
  rating: number;
  accurateSections?: string[];
  inaccurateSections?: string[];
  feedback?: string;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<FeedbackRequest>;

    if (!body?.sessionId) {
      return NextResponse.json({ ok: false, error: "sessionId is required." }, { status: 400 });
    }

    const rating = body.rating;
    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: "rating must be an integer between 1 and 5." }, { status: 400 });
    }

    const feedback = await savePalmistryFeedback({
      sessionId: body.sessionId,
      userId: body.userId ?? null,
      rating,
      accurateSections: body.accurateSections ?? [],
      inaccurateSections: body.inaccurateSections ?? [],
      feedback: body.feedback ?? "",
    });

    return NextResponse.json({ ok: true, feedback });
  } catch (error) {
    console.error("Palmistry feedback failed:", error);

    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Palmistry feedback failed." },
      { status: 500 },
    );
  }
}
