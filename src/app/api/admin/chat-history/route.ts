import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/access";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

async function verifyAdminCaller() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user.email)) {
    return null;
  }
  return user;
}

interface DiskChatRecord {
  ts: string;
  sessionId: string;
  userId: string | null;
  userEmail: string;
  agentId: string;
  chartName: string;
  question: string;
  aiResponse: string;
}

function readDiskChatInteractions(): DiskChatRecord[] {
  const list: DiskChatRecord[] = [];
  try {
    const dir = path.join(process.cwd(), "data", "chat-interactions");
    if (!fs.existsSync(dir)) return list;
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".ndjson")).sort().reverse();
    for (const file of files.slice(0, 14)) { // Last 14 days
      const content = fs.readFileSync(path.join(dir, file), "utf8");
      const lines = content.trim().split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const item = JSON.parse(line) as DiskChatRecord;
          if (item && item.question) list.push(item);
        } catch {
          // Skip corrupt line
        }
      }
    }
  } catch (err) {
    console.warn("readDiskChatInteractions warning:", err);
  }
  return list;
}

interface EnrichedChatMessage {
  id: string;
  user_id: string | null;
  session_id: string;
  agent_id: string;
  role: string;
  content: string;
  chart_name: string;
  created_at: string;
  userEmail: string;
  aiResponse: string | null;
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = await verifyAdminCaller();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 403 });
    }

    const admin = createAdminClient();

    const { searchParams } = new URL(req.url);
    const agent  = searchParams.get("agent")  ?? undefined;
    const userId = searchParams.get("userId") ?? undefined;
    const search = searchParams.get("search")?.toLowerCase().trim() ?? "";
    const limit  = Math.min(Number(searchParams.get("limit") ?? "100"), 500);
    const offset = Number(searchParams.get("offset") ?? "0");

    // Fetch user questions from Supabase
    let query = admin
      .from("chat_messages")
      .select("id, user_id, session_id, agent_id, role, content, chart_name, created_at", { count: "exact" })
      .eq("role", "user")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (agent)  query = query.eq("agent_id", agent);
    if (userId) query = query.eq("user_id", userId);
    if (search) query = query.ilike("content", `%${search}%`);

    const { data: messages, count: dbCount, error } = await query;

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
    if (error) {
      console.warn("chat_messages fetch warning:", error.message);
    }

    // Get emails for logged-in user_ids (skip nulls)
    const uniqueIds = [...new Set((messages ?? [])
      .map((m) => (m as { user_id: string | null }).user_id)
      .filter((id): id is string => !!id))];
    const emailMap: Record<string, string> = {};
    if (uniqueIds.length > 0) {
      try {
        const { data: authData } = await admin.auth.admin.listUsers({ perPage: 500 });
        for (const u of authData?.users ?? []) {
          if (uniqueIds.includes(u.id)) emailMap[u.id] = u.email ?? "—";
        }
      } catch (authErr) {
        console.warn("auth list warning:", authErr);
      }
    }

    const formattedDb: EnrichedChatMessage[] = (messages ?? []).map((m) => {
      const row = m as {
        id: string; user_id: string | null; session_id: string;
        agent_id: string; role: string; content: string;
        chart_name: string | null; created_at: string;
      };
      const userEmail = row.user_id ? (emailMap[row.user_id] ?? "Registered User") : "Guest (Anonymous)";
      const aiResponse = responseMap[row.session_id] ?? null;
      return {
        ...row,
        userEmail,
        chart_name: row.chart_name || "General Query (No Chart Loaded)",
        aiResponse,
      };
    });

    // Also read disk records and merge
    const diskRecords = readDiskChatInteractions();
    const diskFormatted: EnrichedChatMessage[] = diskRecords.map((d, idx) => ({
      id: `disk_${d.sessionId}_${idx}`,
      user_id: d.userId,
      session_id: d.sessionId,
      agent_id: d.agentId,
      role: "user",
      content: d.question,
      chart_name: d.chartName || "General Query (No Chart Loaded)",
      created_at: d.ts,
      userEmail: d.userEmail || "Guest (Anonymous)",
      aiResponse: d.aiResponse || null,
    }));

    // Deduplicate by session_id + question
    const seenSessions = new Set(formattedDb.map(m => `${m.session_id}_${m.content}`));
    const combined: EnrichedChatMessage[] = [...formattedDb];

    for (const d of diskFormatted) {
      const key = `${d.session_id}_${d.content}`;
      if (!seenSessions.has(key)) {
        seenSessions.add(key);
        if (
          (!agent || d.agent_id === agent) &&
          (!search || d.content.toLowerCase().includes(search) || d.chart_name.toLowerCase().includes(search) || d.userEmail.toLowerCase().includes(search))
        ) {
          combined.push(d);
        }
      }
    }

    // Sort by created_at desc
    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = Math.max(dbCount ?? 0, combined.length);
    const paginated = combined.slice(offset, offset + limit);

    return NextResponse.json({ messages: paginated, total });
  } catch (err) {
    console.error("admin/chat-history error:", err);
    return NextResponse.json({ error: "Failed to load chat history" }, { status: 500 });
  }
}
