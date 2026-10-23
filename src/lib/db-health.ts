"use client";

import { createClient } from "@/lib/supabase/client";

export type DbHealthStatus = "ready" | "missing" | "unknown";

export interface DbHealthItem {
  table: string;
  label: string;
  status: DbHealthStatus;
  message: string;
}

const TABLES = [
  { table: "profiles", label: "Profiles" },
  { table: "charts", label: "Saved Charts" },
  { table: "usage_limits", label: "Usage Limits" },
  { table: "ai_conversations", label: "AI Conversations" },
  { table: "ai_messages", label: "AI Messages" },
] as const;

export async function checkSupabaseHealth(): Promise<DbHealthItem[]> {
  const supabase = createClient();

  return Promise.all(TABLES.map(async ({ table, label }) => {
    try {
      const { error } = await supabase
        .from(table)
        .select("id")
        .limit(1);

      if (!error) {
        return { table, label, status: "ready", message: "Ready" } satisfies DbHealthItem;
      }

      const missing = error.message.toLowerCase().includes("does not exist")
        || error.message.toLowerCase().includes("could not find")
        || error.code === "42P01";

      return {
        table,
        label,
        status: missing ? "missing" : "unknown",
        message: missing ? "Schema not applied" : error.message,
      } satisfies DbHealthItem;
    } catch (error) {
      return {
        table,
        label,
        status: "unknown",
        message: error instanceof Error ? error.message : "Unable to verify",
      } satisfies DbHealthItem;
    }
  }));
}

export function isSupabaseReady(items: DbHealthItem[]) {
  return items.length > 0 && items.every((item) => item.status === "ready");
}
