import { NextRequest, NextResponse } from "next/server";
import {
  generateReportHTML,
  normalizeReportOptions,
  REPORT_PAGE_SIZE,
} from "@/lib/report-html-generator";
import type { ReportOptions } from "@/lib/report-html-generator";
import type { ChartData } from "@/lib/astro-engine/calculations";
import { getServerFeatureAccess, premiumBlockedResponse } from "@/lib/server-feature-access";
import { monitor } from "@/lib/server-monitoring";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, optionalText, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";
import { validateChartData } from "@/lib/validation/chart";
import { createClient } from "@/lib/supabase/server";
import { getPalmistrySession } from "@/lib/palmistry/storage";
import type { PalmRuleReport } from "@/lib/palmistry/types";

export const maxDuration = 60; // Vercel Pro: 60s — set in vercel.json too
export const dynamic = "force-dynamic";
// Increase memory allocation — Vercel functions get more CPU proportional to memory.
// Max for Pro plan is 3008MB which roughly doubles CPU vs the default 1024MB.
export const runtime = "nodejs";

async function launchBrowser() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    // Production: use bundled Chromium — no runtime download, no GitHub rate-limits
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = (await import("puppeteer-core")).default;
    const executablePath = await chromium.executablePath();
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: REPORT_PAGE_SIZE.width, height: REPORT_PAGE_SIZE.height },
      executablePath,
      headless: "shell",
    });
  } else {
    // Local dev: use installed system Chrome
    const puppeteer = (await import("puppeteer-core")).default;
    const execPath =
      process.platform === "darwin"
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : "/usr/bin/google-chrome-stable";
    return puppeteer.launch({
      executablePath: execPath,
      headless: true,
      defaultViewport: { width: REPORT_PAGE_SIZE.width, height: REPORT_PAGE_SIZE.height },
    });
  }
}

type PdfRequestBody = { chart: ChartData; options: Partial<ReportOptions> };

function validatePdfBody(value: unknown): ValidationResult<PdfRequestBody> {
  if (!isRecord(value)) return fail("PDF payload must be an object.");
  const chartResult = validateChartData(value.chart);
  if (!chartResult.ok) return chartResult;
  const rawOptions = isRecord(value.options) ? value.options : {};
  const options = rawOptions as Partial<ReportOptions>;
  const palmistrySessionId = optionalText(rawOptions.palmistrySessionId, 120);
  if (palmistrySessionId) options.palmistrySessionId = palmistrySessionId;
  return ok({ chart: chartResult.data, options });
}

async function attachPalmistryFusion(options: Partial<ReportOptions>, userId?: string | null): Promise<Partial<ReportOptions>> {
  if (options.type !== "elite" || options.palmistryFusion?.palmResult || !options.palmistrySessionId || !userId) {
    return options;
  }

  const session = await getPalmistrySession({ sessionId: options.palmistrySessionId, userId });
  const result = isRecord(session?.result) ? session.result as unknown as PalmRuleReport : undefined;
  if (!result) return options;

  return {
    ...options,
    palmistryFusion: {
      ...options.palmistryFusion,
      palmResult: result,
    },
  };
}

export async function POST(request: NextRequest) {
  let browser;
  try {
    const limit = checkRateLimit(request, { scope: "api-generate-pdf", limit: 8, windowMs: 60 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(request, validatePdfBody, { maxBytes: 900_000, routeName: "generate-pdf" });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const body = parsed.data;
    const { chart, options } = body;
    const safeOptions = normalizeReportOptions(options ?? {});
    const access = await getServerFeatureAccess(safeOptions.type === "basic" ? "basic_kundli" : "reports");
    if (!access.allowed) {
      monitor.warn("premium.blocked", {
        feature: access.feature,
        reason: access.reason,
        tier: access.tier,
      });

      return NextResponse.json(
        premiumBlockedResponse(access),
        { status: access.authenticated ? 402 : 401 },
      );
    }

    if (safeOptions.type === "elite" && access.enforced && access.tier !== "elite") {
      monitor.warn("premium.blocked", {
        feature: "reports",
        reason: "upgrade_required",
        tier: access.tier,
        reportType: safeOptions.type,
      });

      return NextResponse.json(
        {
          allowed: false,
          feature: "reports",
          tier: access.tier,
          requiredTier: "elite",
          reason: "upgrade_required",
          message: "Elite PDF requires Elite access.",
        },
        { status: 402 },
      );
    }

    // Generate the full HTML with real chart data
    let userId: string | null = null;
    if (options.palmistrySessionId) {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
    }
    const reportOptions = await attachPalmistryFusion({ ...options, ...safeOptions }, userId);
    const html = generateReportHTML(chart, reportOptions);

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: REPORT_PAGE_SIZE.width, height: REPORT_PAGE_SIZE.height });

    // Set print media early so @media print CSS applies during font/layout work
    await page.emulateMediaType("print");

    // Load HTML — domcontentloaded is enough since we'll await fonts.ready explicitly
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });

    // Wait for fonts to actually finish loading instead of a fixed sleep.
    // This is responsive: returns immediately when ready, capped at 8s safety.
    await page.evaluate(() =>
      Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 8000)),
      ])
    );

    const pdf = await page.pdf({
      width: `${REPORT_PAGE_SIZE.width}px`,
      height: `${REPORT_PAGE_SIZE.height}px`,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      // tagged: false reduces PDF metadata overhead
      tagged: false,
    });

    await page.close();

    const safeName = (chart.name || "Report")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    monitor.info("report_pdf.generated", {
      feature: "reports",
      tier: access.tier,
      reportType: safeOptions.type,
      palette: safeOptions.palette,
      cover: safeOptions.cover,
    });

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="AstroLife-${safeName}.pdf"`,
        "Cache-Control": "no-store",
        "X-AstroLife-Report-Template": "cosmic-blueprint-v2",
        "X-AstroLife-Report-Palette": safeOptions.palette,
        "X-AstroLife-Report-Cover": safeOptions.cover,
      },
    });
  } catch (err) {
    monitor.error("report_pdf.failed", err);
    return NextResponse.json(
      { error: "PDF generation failed", detail: String(err) },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close();
  }
}
