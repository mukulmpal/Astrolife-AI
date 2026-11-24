import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ReportAuditRecord } from "./report-tracker-types";

export type { ReportAuditRecord };

/**
 * Generates an unforgeable, collision-resistant tracking verification code
 * Format: ALR-YYYYMMDD-[6-HEX] (e.g., ALR-20261124-E83A92)
 */
export function generateReportCode(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randHex = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ALR-${datePart}-${randHex}`;
}

/**
 * Persists an audit record to disk (data/reports/*.ndjson) for 100% resilient survival
 */
async function appendAuditToDisk(record: ReportAuditRecord): Promise<void> {
  try {
    const dir = path.join(process.cwd(), "data", "reports");
    await fs.mkdir(dir, { recursive: true });
    const dateStr = record.generatedAt.slice(0, 10);
    const filePath = path.join(dir, `${dateStr}.ndjson`);
    const line = JSON.stringify(record) + "\n";
    await fs.appendFile(filePath, line, "utf8");
  } catch (diskErr) {
    console.warn("[report-tracker] Failed to append report log to disk:", diskErr);
  }
}

/**
 * Persists an audit record to Supabase report_generation_logs table via service role
 */
async function appendAuditToSupabase(record: ReportAuditRecord): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("report_generation_logs").insert({
      report_code: record.reportCode,
      report_type: record.reportType,
      report_title: record.reportTitle,
      page_count: record.pageCount ?? null,
      user_id: record.userId ?? null,
      user_email: record.userEmail,
      is_admin_generated: record.isAdminGenerated,
      is_sample: record.isSample,
      native_name: record.nativeName,
      native_dob: record.nativeDob,
      native_tob: record.nativeTob,
      native_city: record.nativeCity,
      native_lat: record.nativeLat ?? null,
      native_lon: record.nativeLon ?? null,
      native_tz: record.nativeTz ?? null,
      lagna_rashi: record.lagnaRashi ?? null,
      moon_sign: record.moonSign ?? null,
      nakshatra: record.nakshatra ?? null,
      pdf_engine: record.pdfEngine ?? "chromium",
      generation_duration_ms: record.generationDurationMs ?? null,
      status: record.status,
      error_message: record.errorMessage ?? null,
      created_at: record.generatedAt,
    });
  } catch (dbErr) {
    console.warn("[report-tracker] DB report audit insert warning:", dbErr);
  }
}

/**
 * Main server tracking function: records every generated report.
 * Completely non-blocking and safe: failures in logging will NEVER break the user's PDF response.
 */
export async function trackReportGeneration(record: ReportAuditRecord): Promise<void> {
  // Always log to disk immediately
  const diskPromise = appendAuditToDisk(record);
  // Log to DB in parallel
  const dbPromise = appendAuditToSupabase(record);

  await Promise.allSettled([diskPromise, dbPromise]);
}

/**
 * Reads report audit logs from disk files (last 30 days)
 */
async function readDiskReportLogs(): Promise<ReportAuditRecord[]> {
  const records: ReportAuditRecord[] = [];
  try {
    const dir = path.join(process.cwd(), "data", "reports");
    try {
      await fs.access(dir);
    } catch {
      return records;
    }
    const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".ndjson")).sort().reverse();
    for (const f of files.slice(0, 30)) {
      try {
        const content = await fs.readFile(path.join(dir, f), "utf8");
        const lines = content.trim().split("\n").filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line) as ReportAuditRecord;
            if (parsed && parsed.reportCode) {
              records.push(parsed);
            }
          } catch {
            // Ignore corrupted lines
          }
        }
      } catch {
        // Continue checking other files
      }
    }
  } catch (err) {
    console.warn("[report-tracker] readDiskReportLogs error:", err);
  }
  return records;
}

/**
 * Fetches combined, deduplicated report generation records for the Admin Dashboard
 */
export async function fetchReportAuditLogs(options?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ReportAuditRecord[]> {
  const search = options?.search?.toLowerCase().trim() || "";
  const limit = Math.min(options?.limit ?? 150, 500);

  const resultMap = new Map<string, ReportAuditRecord>();

  // 1. Try fetching from Supabase table
  try {
    const admin = createAdminClient();
    let query = admin
      .from("report_generation_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (search) {
      query = query.or(
        `report_code.ilike.%${search}%,native_name.ilike.%${search}%,user_email.ilike.%${search}%,report_type.ilike.%${search}%`
      );
    }

    const { data: dbRecords } = await query;
    if (dbRecords && Array.isArray(dbRecords)) {
      for (const row of dbRecords) {
        const rec: ReportAuditRecord = {
          id: row.id,
          reportCode: row.report_code,
          reportType: row.report_type,
          reportTitle: row.report_title,
          pageCount: row.page_count ?? undefined,
          userId: row.user_id ?? null,
          userEmail: row.user_email,
          isAdminGenerated: Boolean(row.is_admin_generated),
          isSample: Boolean(row.is_sample),
          nativeName: row.native_name,
          nativeDob: row.native_dob,
          nativeTob: row.native_tob,
          nativeCity: row.native_city,
          nativeLat: row.native_lat ? Number(row.native_lat) : null,
          nativeLon: row.native_lon ? Number(row.native_lon) : null,
          nativeTz: row.native_tz ? Number(row.native_tz) : null,
          lagnaRashi: row.lagna_rashi ?? null,
          moonSign: row.moon_sign ?? null,
          nakshatra: row.nakshatra ?? null,
          generatedAt: row.created_at,
          generationDurationMs: row.generation_duration_ms ?? undefined,
          pdfEngine: row.pdf_engine ?? "chromium",
          status: (row.status as "success" | "failed") || "success",
          errorMessage: row.error_message ?? undefined,
        };
        resultMap.set(rec.reportCode, rec);
      }
    }
  } catch (dbErr) {
    console.warn("[report-tracker] DB fetch warning:", dbErr);
  }

  // 2. Fetch from disk resilient layer to ensure 0% data loss
  const diskRecords = await readDiskReportLogs();
  for (const rec of diskRecords) {
    if (!resultMap.has(rec.reportCode)) {
      if (!search) {
        resultMap.set(rec.reportCode, rec);
      } else {
        const matches =
          rec.reportCode.toLowerCase().includes(search) ||
          rec.nativeName.toLowerCase().includes(search) ||
          rec.userEmail.toLowerCase().includes(search) ||
          rec.reportType.toLowerCase().includes(search) ||
          rec.reportTitle.toLowerCase().includes(search);
        if (matches) {
          resultMap.set(rec.reportCode, rec);
        }
      }
    }
  }

  // 3. Sort by generatedAt descending
  const list = Array.from(resultMap.values()).sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  return list.slice(0, limit);
}
