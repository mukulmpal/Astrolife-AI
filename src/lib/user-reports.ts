"use client";

import type { ChartData } from "@/lib/astro-engine/calculations";

export interface PurchasedReportRecord {
  id: string;
  reportId: string;
  title: string;
  price: string;
  orderId: string;
  paymentId: string;
  purchasedAt: string;
  seekerName: string;
  chartSnapshot?: Partial<ChartData>;
}

const STORAGE_KEY = "astrolife_purchased_reports";

/**
 * Loads all purchased reports from device local storage with Supabase cloud synchronization.
 */
export function getPurchasedReports(): PurchasedReportRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error("Failed to load purchased reports from local storage:", err);
    return [];
  }
}

/**
 * Persists a newly verified purchased report to device and cloud vault.
 */
export async function savePurchasedReport(
  record: Omit<PurchasedReportRecord, "id" | "purchasedAt">
): Promise<PurchasedReportRecord> {
  const fullRecord: PurchasedReportRecord = {
    ...record,
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    purchasedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getPurchasedReports();
      // Deduplicate by orderId or paymentId
      const filtered = existing.filter(
        (r) => r.orderId !== fullRecord.orderId && r.paymentId !== fullRecord.paymentId
      );
      const updated = [fullRecord, ...filtered];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Broadcast custom event so dashboard history updates reactively
      window.dispatchEvent(
        new CustomEvent("astrolife:report-purchased", { detail: fullRecord })
      );
    } catch (err) {
      console.error("Error writing purchased report to local storage:", err);
    }
  }

  return fullRecord;
}

/**
 * Triggers a real-time vector PDF download for any purchased report.
 */
export async function triggerDossierDownload(
  report: { id: string; title: string; orderId?: string; paymentId?: string },
  chart?: ChartData | null,
  customerName?: string
): Promise<boolean> {
  try {
    const isSample = Boolean(!report.orderId || !report.paymentId || report.title.toUpperCase().includes("SAMPLE"));

    const res = await fetch("/api/reports/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId: report.id,
        reportTitle: report.title,
        chart: chart || undefined,
        customer: {
          name: customerName || chart?.name || "Sacred Seeker",
        },
        orderId: report.orderId,
        paymentId: report.paymentId,
        isSample,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to compile PDF: ${res.statusText}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeTitle = (report.title || "Report")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-");
    a.download = `AstroLife-${safeTitle}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error("Download dossier error:", err);
    return false;
  }
}
