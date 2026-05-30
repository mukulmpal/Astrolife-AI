import { NextResponse } from "next/server";
import { getPalmRuleBankSummary } from "@/lib/palmistry/rules/rule-bank-summary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true, result: getPalmRuleBankSummary() });
}
