import { NextRequest, NextResponse } from "next/server";
import {
  calculateLalKitabTimeEngine,
  type LalKitabTimeEngineInput,
} from "@/lib/lal-kitab";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LalKitabTimeEngineInput;

    if (!body.dob || !body.planets) {
      return NextResponse.json(
        { error: "dob and planets are required" },
        { status: 400 },
      );
    }

    return NextResponse.json(calculateLalKitabTimeEngine(body));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
