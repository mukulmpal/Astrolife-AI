import { NextRequest, NextResponse } from "next/server";
import {
  getLalKitabPurchaseGuidance,
  type LalKitabPurchaseInput,
} from "@/lib/lal-kitab";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LalKitabPurchaseInput;
    const guidance = getLalKitabPurchaseGuidance(body);

    return NextResponse.json({
      engine: "Lal Kitab Purchase Grammar",
      version: "0.1.0",
      safety:
        "Derived/paraphrased rules. Not a verbatim reproduction. Use with chart validation.",
      guidance,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
