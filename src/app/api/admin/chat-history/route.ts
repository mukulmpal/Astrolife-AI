import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const admin = createAdminClient();

    const { searchParams } = new URL(req.url);
    const agent  = searchParams.get("agent")  ?? undefined;
    const userId = searchParams.get("userId") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const limit  = Math.min(Number(searchParams.get("limit") ?? "100"), 500);
    const offset = Number(searchParams.get("offset") ?? "0");

    // Fetch user questions
    let query = admin
      .from("chat_messages")
      .select("id, user_id, session_id, agent_id, role, content, chart_name, created_at", { count: "exact" })
      .eq("role", "user")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (agent)  query = query.eq("agent_id", agent);
    if (userId) query = query.eq("user_id", userId);
    if (search) query = query.ilike("content", `%${search}%`);

    const { data: messages, count, error } = await query;

    // Fetch paired AI responses for the same sessions
    const sessionIds = [...new Set((messages ?? []).map((m) => (m as { session_id: string }).session_id))];
    const responseMap: Record<string, string> = {};
    if (sessionIds.length > 0) {
      const { data: responses } = await admin
        .from("chat_messages")
        .select("session_id, content")
        .eq("role", "assistant")
        .in("session_id", sessionIds)
        .order("created_at", { ascending: true });
      for (const r of responses ?? []) {
        const row = r as { session_id: string; content: string };
        responseMap[row.session_id] = row.content;
      }
    }
    if (error) throw error;

    // Get emails for logged-in user_ids (skip nulls)
    const uniqueIds = [...new Set((messages ?? [])
      .map((m) => (m as { user_id: string | null }).user_id)
      .filter((id): id is string => !!id))];
    const emailMap: Record<string, string> = {};
    if (uniqueIds.length > 0) {
      const { data: authData } = await admin.auth.admin.listUsers({ perPage: 500 });
      for (const u of authData?.users ?? []) {
        if (uniqueIds.includes(u.id)) emailMap[u.id] = u.email ?? "—";
      }
    }

    const enriched = (messages ?? []).map((m) => {
      const row = m as {
        id: string; user_id: string | null; session_id: string;
        agent_id: string; role: string; content: string;
        chart_name: string | null; created_at: string;
      };
      const userEmail = row.user_id ? (emailMap[row.user_id] ?? "—") : "Anonymous";
      const aiResponse = responseMap[row.session_id] ?? null;
      return { ...row, userEmail, aiResponse };
    });

    return NextResponse.json({ messages: enriched, total: count ?? 0 });
  } catch (err) {
    console.error("admin/chat-history error:", err);
    return NextResponse.json({ error: "Failed to load chat history" }, { status: 500 });
  }
}
