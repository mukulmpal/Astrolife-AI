import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const admin = createAdminClient();

    // Anonymous charts (user_id IS NULL) — visible even without login
    const { data: anonCharts } = await admin
      .from("user_charts")
      .select("id, name, dob, tob, city, created_at")
      .is("user_id", null)
      .order("created_at", { ascending: false })
      .limit(200);

    // Anonymous chat count
    const { count: anonChatCount } = await admin
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .is("user_id", null)
      .eq("role", "user");

    // Auth users
    const { data: authData } = await admin.auth.admin.listUsers({ perPage: 500 });
    const authUsers = authData?.users ?? [];

    let registeredUsers: unknown[] = [];

    if (authUsers.length > 0) {
      const userIds = authUsers.map((u) => u.id);

      const { data: charts } = await admin
        .from("user_charts")
        .select("user_id, id, name, created_at")
        .in("user_id", userIds)
        .order("created_at", { ascending: false });

      const { data: msgCounts } = await admin
        .from("chat_messages")
        .select("user_id, role")
        .in("user_id", userIds);

      const chartsByUser: Record<string, Array<{ id: string; name: string; created_at: string }>> = {};
      for (const c of charts ?? []) {
        const uid = (c as { user_id: string; id: string; name: string; created_at: string }).user_id;
        chartsByUser[uid] ??= [];
        chartsByUser[uid].push({ id: c.id, name: c.name, created_at: c.created_at });
      }

      const questionsByUser: Record<string, number> = {};
      for (const m of msgCounts ?? []) {
        const row = m as { user_id: string; role: string };
        if (row.role === "user") questionsByUser[row.user_id] = (questionsByUser[row.user_id] ?? 0) + 1;
      }

      registeredUsers = authUsers.map((u) => ({
        id: u.id, email: u.email ?? "—",
        joinedAt: u.created_at, lastSignIn: u.last_sign_in_at ?? null,
        provider: u.app_metadata?.provider ?? "email",
        chartCount: chartsByUser[u.id]?.length ?? 0,
        charts: chartsByUser[u.id] ?? [],
        questionCount: questionsByUser[u.id] ?? 0,
        isAnonymous: false,
      }));

      (registeredUsers as { lastSignIn: string | null; joinedAt: string }[]).sort((a, b) =>
        new Date(b.lastSignIn ?? b.joinedAt).getTime() - new Date(a.lastSignIn ?? a.joinedAt).getTime()
      );
    }

    return NextResponse.json({
      users: registeredUsers,
      anonymous: {
        chartCount: anonCharts?.length ?? 0,
        charts: (anonCharts ?? []).map((c) => ({
          id: c.id, name: c.name, dob: c.dob, tob: c.tob, city: c.city, created_at: c.created_at,
        })),
        questionCount: anonChatCount ?? 0,
      },
    });
  } catch (err) {
    console.error("admin/users error:", err);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
