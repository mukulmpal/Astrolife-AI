import { NextRequest, NextResponse } from "next/server";
import { buildPackageDossierPdf } from "@/lib/report/package-dossier-pdf";
import { generatePackageDossierHTML } from "@/lib/report/package-dossier-html-generator";
import { getActiveDashaState, resolveGender } from "@/lib/report/dossier-shared-helpers";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import { buildDossierEmailHtml, buildDossierEmailText } from "@/lib/email/dossier-email-template";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REPORT_VIEWPORT = { width: 820, height: 1160 };

async function launchBrowser() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;
    const path = await import("path");
    const fs = await import("fs");

    const candidateBinPaths = [
      path.join(process.cwd(), "node_modules/@sparticuz/chromium/bin"),
      path.join(process.cwd(), ".next/server/node_modules/@sparticuz/chromium/bin"),
      "/var/task/node_modules/@sparticuz/chromium/bin",
      "/var/task/.next/server/node_modules/@sparticuz/chromium/bin",
    ];

    let executablePath: string | undefined;
    for (const p of candidateBinPaths) {
      if (fs.existsSync(p)) {
        try {
          executablePath = await chromium.executablePath(p);
          if (executablePath) break;
        } catch {
          // continue checking
        }
      }
    }

    if (!executablePath) {
      executablePath = await chromium.executablePath();
    }

    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: REPORT_VIEWPORT,
      executablePath,
      headless: chromium.headless ?? true,
    });
  } else {
    const puppeteer = (await import("puppeteer-core")).default;
    const execPath =
      process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : "/usr/bin/google-chrome-stable";
    return puppeteer.launch({
      executablePath: execPath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--user-data-dir=/tmp/astrolife-chrome-dev",
      ],
      defaultViewport: REPORT_VIEWPORT,
    });
  }
}

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
      price = "₹499",
      orderId = `ORD_${Date.now().toString(36).toUpperCase()}`,
      paymentId = `PAY_${Date.now().toString(36).toUpperCase()}`,
      chart: rawChart,
      birth,
      customer,
      gender,
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

    const resolvedGender = resolveGender(
      { gender: gender || customer?.gender || birth?.gender },
      rawChart
    );
    if (resolvedGender) {
      (chart as ChartData & { gender?: string }).gender = resolvedGender;
    }

    // 3. Compile high-grade 24-page vector PDF dossier
    const dossierOptions = {
      reportId: String(reportId),
      reportTitle: String(reportTitle),
      customerName: seekerName,
      customerEmail: email,
      orderId,
      paymentId,
      isSample: false,
      gender: resolvedGender,
    };

    let pdfBuffer: Buffer;
    let browser;
    try {
      const html = generatePackageDossierHTML(chart, dossierOptions);
      browser = await launchBrowser();
      const page = await browser.newPage();
      await page.setViewport(REPORT_VIEWPORT);
      await page.emulateMediaType("print");
      await page.setContent(html, {
        waitUntil: "domcontentloaded",
        timeout: 25_000,
      });
      await page.evaluate(() =>
        Promise.race([
          document.fonts.ready,
          new Promise((r) => setTimeout(r, 6000)),
        ])
      );
      const pdf = await page.pdf({
        width: `${REPORT_VIEWPORT.width}px`,
        height: `${REPORT_VIEWPORT.height}px`,
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" },
        tagged: false,
      });
      await page.close();
      pdfBuffer = Buffer.from(pdf);
    } catch (browserErr) {
      console.warn("[reports/send-email] Chromium HTML render fallback to vector PDFKit:", browserErr);
      pdfBuffer = await buildPackageDossierPdf(chart, dossierOptions);
    } finally {
      if (browser) {
        try {
          await browser.close();
        } catch {
          // ignore
        }
      }
    }

    const safeTitle = (reportTitle || "Dossier")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    // 4. Construct rich royal email content
    const activeDashaPlanet = getActiveDashaState(chart).activeDasha;
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
      mahadasha: activeDashaPlanet ? `${activeDashaPlanet} Mahadasha` : "Active Dasha",
      downloadUrl: "https://www.astrolife.io/dashboard/history",
    };

    const htmlContent = buildDossierEmailHtml(emailParams);
    const textContent = buildDossierEmailText(emailParams);

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "AstroLife <onboarding@resend.dev>";

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
          subject: `ॐ Your Sacred Dossier: ${reportTitle} — AstroLife`,
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
