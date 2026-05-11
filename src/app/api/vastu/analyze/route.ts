import { NextResponse } from "next/server";
import { analyzeVastuPropertyV3 } from "@/lib/vastu-intelligence/engine-v3";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = analyzeVastuPropertyV3(body);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to analyze Vastu property";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
