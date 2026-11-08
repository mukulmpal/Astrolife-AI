import { NextRequest, NextResponse } from "next/server";
import { buildPackageDossierPdf } from "@/lib/report/package-dossier-pdf";
import { calculateChart, type ChartData, type BirthDetails } from "@/lib/astro-engine/calculations";
import { PLACEHOLDER_BIRTH } from "@/lib/user-chart";

export const maxDuration = 45;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, reportTitle, chart: rawChart, birth, customer, orderId, paymentId } = body;

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }

    // Resolve or build chart
    let chart: ChartData;
    if (rawChart && rawChart.planets && rawChart.planets.length > 0) {
      chart = rawChart;
    } else if (birth && birth.dob && birth.tob) {
      chart = calculateChart(
        birth.dob,
        birth.tob,
        birth.lat || 19.076,
        birth.lon || 72.8777,
        birth.tz || 5.5,
        birth.name || customer?.name || "Sacred Seeker",
        birth.city || "Mumbai"
      );
    } else {
      chart = calculateChart(
        PLACEHOLDER_BIRTH.dob,
        PLACEHOLDER_BIRTH.tob,
        PLACEHOLDER_BIRTH.lat || 19.076,
        PLACEHOLDER_BIRTH.lon || 72.8777,
        PLACEHOLDER_BIRTH.tz || 5.5,
        customer?.name || "Sacred Seeker",
        PLACEHOLDER_BIRTH.city
      );
    }

    const pdfBuffer = await buildPackageDossierPdf(chart, {
      reportId: String(reportId),
      reportTitle: String(reportTitle || "AstroLife Sacred Dossier"),
      customerName: customer?.name || chart.name || "Sacred Seeker",
      customerEmail: customer?.email,
      customerPhone: customer?.phone,
      orderId: orderId || `ORD_${Date.now().toString(36).toUpperCase()}`,
      paymentId: paymentId || `PAY_${Date.now().toString(36).toUpperCase()}`,
    });

    const safeTitle = (reportTitle || "Report")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const safeSubject = (chart.name || "Seeker")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="AstroLife-${safeTitle}-${safeSubject}.pdf"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-AstroLife-Report-ID": String(reportId),
      },
    });
  } catch (err: unknown) {
    console.error("[generate-pdf/route] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate dossier PDF", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
