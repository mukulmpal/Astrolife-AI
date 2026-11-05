import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/access";
import { getDiagnosticSheetEntries, type DiagnosticEntry } from "@/lib/server-monitoring";
import * as fs from "fs";
import * as path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function verifyAdminCaller() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user.email)) {
    return null;
  }
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = await verifyAdminCaller();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "100", 10), 1), 500);

    // 1. In-memory buffer
    const inMemoryLogs = getDiagnosticSheetEntries(limit);

    // 2. Read from disk if file exists
    let diskLogs: DiagnosticEntry[] = [];
    try {
      const logFile = path.join(process.cwd(), ".logs", "diagnostic-sheet.jsonl");
      if (fs.existsSync(logFile)) {
        const lines = fs.readFileSync(logFile, "utf8").trim().split("\n").filter(Boolean);
        diskLogs = lines
          .slice(-limit)
          .map((line) => {
            try {
              return JSON.parse(line) as DiagnosticEntry;
            } catch {
              return null;
            }
          })
          .filter((item): item is DiagnosticEntry => item !== null)
          .reverse();
      }
    } catch {
      // Fallback cleanly to in-memory logs
    }

    // Merge & deduplicate by id
    const seen = new Set<string>();
    const combined: DiagnosticEntry[] = [];

    for (const log of [...inMemoryLogs, ...diskLogs]) {
      if (!seen.has(log.id)) {
        seen.add(log.id);
        combined.push(log);
      }
    }

    const recentLogs = combined.slice(0, limit);

    // Summary statistics
    const stats = {
      total: recentLogs.length,
      errors: recentLogs.filter((l) => l.level === "error").length,
      warnings: recentLogs.filter((l) => l.level === "warn").length,
      fallbacks: recentLogs.filter((l) => l.event?.includes("fallback") || l.isFallback).length,
    };

    return NextResponse.json({
      ok: true,
      stats,
      logs: recentLogs,
    });
  } catch (error) {
    console.error("Admin diagnostic sheet error:", error);
    return NextResponse.json({ error: "Failed to fetch diagnostic sheet" }, { status: 500 });
  }
}
