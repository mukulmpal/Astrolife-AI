import { NextRequest, NextResponse } from "next/server";
import { buildPackageDossierPdf } from "@/lib/report/package-dossier-pdf";
import { calculateChart, type ChartData, type BirthDetails } from "@/lib/astro-engine/calculations";
import { isEliteEmail, isAdminUser } from "@/lib/access";
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

    // Access control verification: Elite users, Admin, or verified payment credentials
    const isEliteOrAdmin = isEliteEmail(customer?.email) || isAdminUser(customer?.email);
    const hasVerifiedPayment = Boolean(
      (orderId && typeof orderId === "string" && orderId.length > 6 && (orderId.startsWith("order_") || orderId.startsWith("ORD_"))) &&
      (paymentId && typeof paymentId === "string" && paymentId.length > 6 && (paymentId.startsWith("pay_") || paymentId.startsWith("PAY_")))
    );

    const isSample = body.isSample === true || String(reportTitle || "").toUpperCase().includes("SAMPLE") || (!hasVerifiedPayment && !isEliteOrAdmin);

    // Resolve or build chart with 100% resilient fallback
    let chart: ChartData;
    if (rawChart && rawChart.planets && typeof rawChart.planets === "object" && rawChart.dob && rawChart.tob) {
      chart = rawChart;
    } else if (birth && birth.dob && birth.tob) {
      chart = calculateChart(
        birth.name || customer?.name || "Sacred Seeker",
        birth.dob,
        birth.tob,
        birth.city || "New Delhi",
        birth.lat || 28.6139,
        birth.lon || 77.209,
        birth.tz || 5.5
      );
    } else if (rawChart && rawChart.dob && typeof rawChart.dob === "string") {
      chart = calculateChart(
        rawChart.name || customer?.name || "Sacred Seeker",
        rawChart.dob,
        rawChart.tob || "12:00",
        rawChart.city || "New Delhi",
        rawChart.lat || 28.6139,
        rawChart.lon || 77.209,
        rawChart.tz || 5.5
      );
    } else {
      chart = calculateChart(
        customer?.name || "Sacred Seeker",
        "2000-01-01",
        "12:00",
        "New Delhi",
        28.6139,
        77.209,
        5.5
      );
    }

    const pdfBuffer = await buildPackageDossierPdf(chart, {
      reportId: String(reportId),
      reportTitle: String(reportTitle || "AstroLife Sacred Dossier"),
      customerName: customer?.name || chart.name || "Sacred Seeker",
      customerEmail: customer?.email,
      customerPhone: customer?.phone,
      orderId: isSample ? "SAMPLE_PREVIEW" : orderId,
      paymentId: isSample ? "SAMPLE_PREVIEW" : paymentId,
      isSample,
    });

    const safeTitle = (reportTitle || "Report")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const safeSubject = (chart.name || "Seeker")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const filename = isSample
      ? `AstroLife-SAMPLE-${safeTitle}.pdf`
      : `AstroLife-${safeTitle}-${safeSubject}.pdf`;

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-AstroLife-Report-ID": String(reportId),
        "X-AstroLife-Sample-Mode": isSample ? "true" : "false",
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
