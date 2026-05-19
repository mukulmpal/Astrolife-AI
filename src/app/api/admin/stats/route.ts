import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const admin = createAdminClient();

    const [
      { count: totalUsers },
      { count: totalCharts },
      { count: totalMessages },
      { count: totalQuestions },
      { count: todayMessages },
      { data: topAgents },
      { data: recentActivity },
    ] = await Promise.all([
      admin.from("user_charts").select("*", { count: "exact", head: true }),
      admin.from("user_charts").select("*", { count: "exact", head: true }),
      admin.from("chat_messages").select("*", { count: "exact", head: true }),
      admin.from("chat_messages").select("*", { count: "exact", head: true }).eq("role", "user"),
      admin.from("chat_messages")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 86400000).toISOString()),
      admin.from("chat_messages")
        .select("agent_id")
        .eq("role", "user")
        .limit(500),
      admin.from("chat_messages")
        .select("user_id, agent_id, content, created_at")
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Count per agent
    const agentCounts: Record<string, number> = {};
    for (const row of topAgents ?? []) {
      const a = (row as { agent_id: string }).agent_id;
      agentCounts[a] = (agentCounts[a] ?? 0) + 1;
    }
    const topAgentsSorted = Object.entries(agentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([agent, count]) => ({ agent, count }));

    // Auth user count via admin API
    const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1 });
    const totalAuthUsers = (authData && "total" in authData ? authData.total : undefined) ?? totalUsers ?? 0;

    return NextResponse.json({
      totalUsers: totalAuthUsers,
      totalCharts: totalCharts ?? 0,
      totalMessages: totalMessages ?? 0,
      totalQuestions: totalQuestions ?? 0,
      todayMessages: todayMessages ?? 0,
      topAgents: topAgentsSorted,
      recentActivity: recentActivity ?? [],
    });
  } catch (err) {
    console.error("admin/stats error:", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
