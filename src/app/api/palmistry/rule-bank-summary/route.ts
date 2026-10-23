import { NextResponse } from "next/server";
import { getPalmRuleBankSummary } from "@/lib/palmistry/rules/rule-bank-summary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  try {
    const summary = getPalmRuleBankSummary();
    return NextResponse.json({ ok: true, summary, result: summary });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Unable to load palmistry rule-bank summary.",
    }, { status: 500 });
  }
}
