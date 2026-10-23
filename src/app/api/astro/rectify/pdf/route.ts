import { NextRequest, NextResponse } from "next/server";
import { buildBTRDossierPdf } from "@/lib/report/btr-dossier-pdf";
import type { BTRCandidate, BTRInput } from "@/lib/astro-engine/birth-rectification-engine";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, type ValidationResult } from "@/lib/validation/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface BTRPdfRequestBody {
  candidate: BTRCandidate;
  input?: Partial<BTRInput>;
}

function validatePdfBody(value: unknown): ValidationResult<BTRPdfRequestBody> {
  if (!isRecord(value)) return fail("Payload must be an object.");
  if (!isRecord(value.candidate)) return fail("candidate object is required.");

  return ok(value as unknown as BTRPdfRequestBody);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const limit = checkRateLimit(request, { scope: "astro-rectify-pdf", limit: 30, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsedBody = await readJsonWithLimit(request, validatePdfBody, {
      maxBytes: 250_000,
      routeName: "astro-rectify-pdf",
    });

    if (!parsedBody.ok) {
      return NextResponse.json(
        { success: false, error: parsedBody.error },
        { status: 400 }
      );
    }

    const { candidate, input } = parsedBody.data;
    const subjectName = input?.name || "Subject";
    const sanitizedFilename = `AstroLife-BTR-Certificate-${subjectName.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

    const pdfBuffer = await buildBTRDossierPdf(candidate, input, {
      subjectName,
      city: input?.city,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${sanitizedFilename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate BTR PDF dossier";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
