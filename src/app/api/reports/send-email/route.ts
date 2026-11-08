import { NextRequest, NextResponse } from "next/server";
import { buildPackageDossierPdf } from "@/lib/report/package-dossier-pdf";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import { buildDossierEmailHtml, buildDossierEmailText } from "@/lib/email/dossier-email-template";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting safeguard
    const limit = checkRateLimit(request, {
      scope: "report-email-send",
      limit: 10,
      windowMs: 15 * 60_000,
    });
    if (!limit.allowed) {
      return rateLimitResponse(limit.resetAt);
    }

    const body = await request.json();
    const {
      email,
      seekerName = "Sacred Seeker",
      reportId,
      reportTitle = "Vedic Shastra Dossier",
      price = "₹249",
      orderId = `ORD_${Date.now().toString(36).toUpperCase()}`,
      paymentId = `PAY_${Date.now().toString(36).toUpperCase()}`,
      chart: rawChart,
      birth,
    } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId." }, { status: 400 });
    }

    // 2. Resolve chart with 100% resilient fallback
    let chart: ChartData;
    if (rawChart && rawChart.planets && typeof rawChart.planets === "object" && rawChart.dob && rawChart.tob) {
      chart = rawChart;
    } else if (birth && birth.dob && birth.tob) {
      chart = calculateChart(
        birth.name || seekerName,
        birth.dob,
        birth.tob,
        birth.city || "New Delhi",
        birth.lat || 28.6139,
        birth.lon || 77.209,
        birth.tz || 5.5
      );
    } else if (rawChart && rawChart.dob && typeof rawChart.dob === "string") {
      chart = calculateChart(
        rawChart.name || seekerName,
        rawChart.dob,
        rawChart.tob || "12:00",
        rawChart.city || "New Delhi",
        rawChart.lat || 28.6139,
        rawChart.lon || 77.209,
        rawChart.tz || 5.5
      );
    } else {
      chart = calculateChart(
        seekerName,
        "2000-01-01",
        "12:00",
        "New Delhi",
        28.6139,
        77.209,
        5.5
      );
    }

    // 3. Compile high-grade vector PDF dossier
    const pdfBuffer = await buildPackageDossierPdf(chart, {
      reportId: String(reportId),
      reportTitle: String(reportTitle),
      customerName: seekerName,
      customerEmail: email,
      orderId,
      paymentId,
    });

    const safeTitle = (reportTitle || "Dossier")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    // 4. Construct rich royal email content
    const emailParams = {
      seekerName,
      reportTitle,
      reportId,
      price,
      orderId,
      paymentId,
      lagnaRashi: chart.lagnaRashi || "Ascendant",
      moonSign: chart.planets?.Moon?.sign || "Moon Sign",
      nakshatra: chart.planets?.Moon?.nakshatra || "Janma Nakshatra",
      mahadasha: chart.dashas?.[0] ? `${chart.dashas[0].planet} Mahadasha` : "Active Dasha",
      downloadUrl: "https://astrolife-ai.vercel.app/dashboard/history",
    };

    const htmlContent = buildDossierEmailHtml(emailParams);
    const textContent = buildDossierEmailText(emailParams);

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "AstroLife AI <onboarding@resend.dev>";

    // 5. Dispatch via Resend API if API key is present
    if (resendApiKey) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: `ॐ Your Sacred Dossier: ${reportTitle} — AstroLife AI`,
          html: htmlContent,
          text: textContent,
          attachments: [
            {
              filename: `AstroLife-${safeTitle}.pdf`,
              content: Buffer.from(pdfBuffer).toString("base64"),
            },
          ],
        }),
      });

      if (!resendRes.ok) {
        const errorData = await resendRes.json().catch(() => ({}));
        console.error("[send-email] Resend API error:", errorData);
        return NextResponse.json(
          {
            ok: false,
            error: "Failed to send email via Resend",
            details: errorData,
          },
          { status: 502 }
        );
      }

      const resendData = await resendRes.json();
      return NextResponse.json({
        ok: true,
        sent: true,
        provider: "resend",
        id: resendData.id,
        recipient: email,
      });
    }

    // 6. Graceful Simulation Mode if RESEND_API_KEY is not yet populated
    console.log(`[send-email] [SIMULATED] Email to ${email} for "${reportTitle}" with ${pdfBuffer.length} bytes PDF.`);
    return NextResponse.json({
      ok: true,
      sent: false,
      simulated: true,
      note: "Email generated successfully in simulation mode. Add RESEND_API_KEY in .env.local / Vercel to dispatch live messages.",
      recipient: email,
    });
  } catch (err: unknown) {
    console.error("[reports/send-email] Fatal error:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to process email delivery",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
