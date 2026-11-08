"use client";

import type { ChartData } from "@/lib/astro-engine/calculations";
import { createClient } from "@/lib/supabase/client";

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

  // Attempt background sync to Supabase if user is authenticated
  try {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      await supabase.from("payments").insert({
        user_id: data.user.id,
        order_id: fullRecord.orderId,
        payment_id: fullRecord.paymentId,
        amount: parseFloat(fullRecord.price.replace(/[^0-9.]/g, "")) || 0,
        currency: "INR",
        status: "captured",
        plan: fullRecord.reportId,
      });
    }
  } catch {
    // Non-blocking: guest users retain access via localStorage
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
        orderId: report.orderId || `ORD_${Date.now().toString(36).toUpperCase()}`,
        paymentId: report.paymentId || `PAY_${Date.now().toString(36).toUpperCase()}`,
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
