import { NextResponse } from "next/server";
import { updatePalmistryRuleTuningStatus } from "@/lib/palmistry/rule-tuning";

function isAuthorized(req: Request) {
  const secret = process.env.PALMISTRY_ADMIN_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  return req.headers.get("x-admin-secret") === secret;
}

type StatusRequest = {
  ruleId: string;
  status: "pending" | "approved" | "rejected" | "applied";
};

const VALID_STATUSES = new Set(["pending", "approved", "rejected", "applied"]);

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized." },
        { status: 401 },
      );
    }

    const body = (await req.json()) as StatusRequest;

    if (!body.ruleId || !VALID_STATUSES.has(body.status)) {
      return NextResponse.json(
        { ok: false, error: "ruleId and a valid status are required." },
        { status: 400 },
      );
    }

    const updated = await updatePalmistryRuleTuningStatus({
      ruleId: body.ruleId,
      status: body.status,
    });

    return NextResponse.json({
      ok: true,
      updated,
    });
  } catch (error) {
    console.error("Palmistry tuning status failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Palmistry tuning status failed.",
      },
      { status: 500 },
    );
  }
}
