import { NextResponse } from "next/server";
import {
  generatePalmistryRuleTuningSuggestions,
  listPalmistryRuleTuningSuggestions,
  savePalmistryRuleTuningSuggestions,
} from "@/lib/palmistry/rule-tuning";

function isAuthorized(req: Request) {
  const secret = process.env.PALMISTRY_ADMIN_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  return req.headers.get("x-admin-secret") === secret;
}

function safeNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function GET(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") ?? "generated";
    const days = safeNumber(url.searchParams.get("days"), 90);
    const minFeedback = safeNumber(url.searchParams.get("minFeedback"), 2);
    const status = url.searchParams.get("status") as
      | "pending"
      | "approved"
      | "rejected"
      | "applied"
      | null;

    if (mode === "saved") {
      const saved = await listPalmistryRuleTuningSuggestions({
        status: status ?? undefined,
      });

      return NextResponse.json({
        ok: true,
        mode,
        suggestions: saved,
      });
    }

    const suggestions = await generatePalmistryRuleTuningSuggestions({
      days,
      minFeedback,
    });

    return NextResponse.json({
      ok: true,
      mode,
      suggestions,
    });
  } catch (error) {
    console.error("Palmistry tuning GET failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Palmistry tuning failed.",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const days = Number(body.days ?? 90);
    const minFeedback = Number(body.minFeedback ?? 2);

    const suggestions = await generatePalmistryRuleTuningSuggestions({
      days: Number.isFinite(days) ? days : 90,
      minFeedback: Number.isFinite(minFeedback) ? minFeedback : 2,
    });

    const saved = await savePalmistryRuleTuningSuggestions(suggestions);

    return NextResponse.json({
      ok: true,
      generated: suggestions.length,
      saved: saved.length,
      suggestions,
    });
  } catch (error) {
    console.error("Palmistry tuning POST failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Palmistry tuning failed.",
      },
      { status: 500 },
    );
  }
}
