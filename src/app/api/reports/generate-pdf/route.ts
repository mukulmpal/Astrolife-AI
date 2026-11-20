import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { buildPackageDossierPdf } from "@/lib/report/package-dossier-pdf";
import { generatePackageDossierHTML } from "@/lib/report/package-dossier-html-generator";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import { isEliteEmail, isAdminUser } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const REPORT_VIEWPORT = { width: 820, height: 1160 };

async function launchBrowser() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;
    const executablePath = await chromium.executablePath();
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: REPORT_VIEWPORT,
      executablePath,
      headless: "shell",
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
      defaultViewport: REPORT_VIEWPORT,
    });
  }
}

export async function POST(request: NextRequest) {
  let browser;
  try {
    const body = await request.json();
    const { reportId, reportTitle, chart: rawChart, birth, customer, orderId, paymentId, signature } = body;

    if (!reportId) {
      return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
    }

    // Server-verified access control: Check authenticated session user
    let isEliteOrAdmin = false;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && (isEliteEmail(user.email) || isAdminUser(user.email))) {
        isEliteOrAdmin = true;
      }
    } catch {
      // Unauthenticated / guest
    }

    // Cryptographic verification: Verify Razorpay HMAC-SHA256 signature
    let hasVerifiedPayment = false;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (orderId && paymentId && signature && keySecret) {
      try {
        const payload = `${orderId}|${paymentId}`;
        const expectedSignature = crypto
          .createHmac("sha256", keySecret)
          .update(payload)
          .digest("hex");

        const expectedBuf = Buffer.from(expectedSignature, "utf8");
        const receivedBuf = Buffer.from(String(signature), "utf8");

        if (
          expectedBuf.length === receivedBuf.length &&
          crypto.timingSafeEqual(expectedBuf, receivedBuf)
        ) {
          hasVerifiedPayment = true;
        }
      } catch (cryptoErr) {
        console.warn("[reports/generate-pdf] Signature validation error:", cryptoErr);
      }
    }

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

    const dossierOptions = {
      reportId: String(reportId),
      reportTitle: String(reportTitle || "AstroLife Sacred Dossier"),
      customerName: customer?.name || chart.name || "Sacred Seeker",
      customerEmail: customer?.email,
      customerPhone: customer?.phone,
      orderId: isSample ? "SAMPLE_PREVIEW" : orderId,
      paymentId: isSample ? "SAMPLE_PREVIEW" : paymentId,
      isSample,
    };

    let pdfBuffer: Buffer;

    // ── Primary Pipeline: High-Elegance HTML-to-PDF via Headless Chromium ──
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

      // Wait for fonts to finish loading with safety timeout
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
    } catch (browserError) {
      console.warn("[reports/generate-pdf] Chromium HTML rendering failed, falling back to vector PDFKit:", browserError);
      pdfBuffer = await buildPackageDossierPdf(chart, dossierOptions);
    }

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

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-AstroLife-Report-ID": String(reportId),
        "X-AstroLife-Sample-Mode": isSample ? "true" : "false",
        "X-AstroLife-Template-Tier": "elite-dossier-v1",
      },
    });
  } catch (err: unknown) {
    console.error("[generate-pdf/route] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate dossier PDF", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // ignore close error
      }
    }
  }
}
