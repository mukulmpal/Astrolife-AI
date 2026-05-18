import { NextRequest, NextResponse } from "next/server";
import {
  generateReportHTML,
  normalizeReportOptions,
  REPORT_PAGE_SIZE,
} from "@/lib/report-html-generator";
import type { ReportOptions } from "@/lib/report-html-generator";
import type { ChartData } from "@/lib/astro-engine/calculations";

export const maxDuration = 60; // Vercel Pro: 60s — set in vercel.json too
export const dynamic = "force-dynamic";

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

export async function POST(request: NextRequest) {
  let browser;
  try {
    const body = await request.json() as { chart: ChartData; options: ReportOptions };
    const { chart, options } = body;

    if (!chart || !chart.name) {
      return NextResponse.json({ error: "Invalid chart data" }, { status: 400 });
    }

    const safeOptions = normalizeReportOptions(options ?? {});

    // Generate the full HTML with real chart data
    const html = generateReportHTML(chart, safeOptions);

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: REPORT_PAGE_SIZE.width, height: REPORT_PAGE_SIZE.height });

    // Load HTML and wait for fonts + network idle
    await page.setContent(html, {
      waitUntil: ["load", "domcontentloaded"],
      timeout: 45_000,
    });
    // Small safety buffer for CSS variable painting after network idle
    await new Promise((r) => setTimeout(r, 1500));

    // Extra render pass — ensures SVG + CSS vars are painted
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      width: `${REPORT_PAGE_SIZE.width}px`,
      height: `${REPORT_PAGE_SIZE.height}px`,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await page.close();

    const safeName = (chart.name || "Report")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

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
    console.error("[generate-pdf]", err);
    return NextResponse.json(
      { error: "PDF generation failed", detail: String(err) },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close();
  }
}
