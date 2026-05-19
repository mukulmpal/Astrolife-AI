"use client";

import { useEffect, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────

type Stats = {
  totalUsers: number;
  totalCharts: number;
  totalMessages: number;
  totalQuestions: number;
  todayMessages: number;
  topAgents: Array<{ agent: string; count: number }>;
  recentActivity: Array<{
    user_id: string;
    agent_id: string;
    content: string;
    created_at: string;
  }>;
};

type AdminUser = {
  id: string;
  email: string;
  joinedAt: string;
  lastSignIn: string | null;
  provider: string;
  chartCount: number;
  charts: Array<{ id: string; name: string; created_at: string }>;
  questionCount: number;
  replyCount: number;
};

type ChatMsg = {
  id: string;
  user_id: string;
  userEmail: string;
  session_id: string;
  agent_id: string;
  content: string;
  aiResponse: string | null;
  chart_name: string | null;
  created_at: string;
};

type Tab = "overview" | "users" | "chat";

const AGENT_LABELS: Record<string, string> = {
  career: "Career",
  marriage: "Marriage",
  lalkitab: "Lal Kitab",
  karmic: "Karmic",
  wealth: "Wealth",
  psychology: "Psychology",
  health: "Health",
  remedy: "Remedy",
  spiritual: "Spiritual",
  transit: "Transit",
};

function fmt(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function timeAgo(dt: string | null) {
  if (!dt) return "never";
  const diff = Date.now() - new Date(dt).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Stat Card ─────────────────────────────────────────────────

function StatCard({ label, value, sub, color = "amber" }: { label: string; value: string | number; sub?: string; color?: string }) {
  const border = color === "green" ? "border-green-400/20 bg-green-500/5" :
                 color === "cyan"  ? "border-cyan-400/20 bg-cyan-500/5"  :
                 color === "purple"? "border-purple-400/20 bg-purple-500/5" :
                 "border-amber-400/20 bg-amber-500/5";
  const text   = color === "green" ? "text-green-300" :
                 color === "cyan"  ? "text-cyan-300"  :
                 color === "purple"? "text-purple-300" :
                 "text-amber-300";
  return (
    <div className={`rounded-2xl border p-5 ${border}`}>
      <p className="text-xs uppercase tracking-widest text-white/45">{label}</p>
      <p className={`mt-2 text-4xl font-bold ${text}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [tab, setTab]             = useState<Tab>("overview");
  const [stats, setStats]         = useState<Stats | null>(null);
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [anon, setAnon]           = useState<{ chartCount: number; charts: { id: string; name: string; dob: string; tob: string; city: string; created_at: string }[]; questionCount: number } | null>(null);
  const [chat, setChat]           = useState<ChatMsg[]>([]);
  const [chatTotal, setChatTotal] = useState(0);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [searchChat, setSearchChat] = useState("");
  const [filterAgent, setFilterAgent] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [chatOffset, setChatOffset] = useState(0);
  const CHAT_PAGE = 50;

  // ── Fetch helpers ──────────────────────────────────────────

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error(await res.text());
      setStats(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error(await res.text());
      const d = await res.json();
      setUsers(d.users ?? []);
      setAnon(d.anonymous ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }, []);

  const loadChat = useCallback(async (offset = 0, agent = "", search = "") => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: String(CHAT_PAGE), offset: String(offset) });
      if (agent)  params.set("agent", agent);
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/chat-history?${params}`);
      if (!res.ok) throw new Error(await res.text());
      const d = await res.json();
      setChat(d.messages ?? []);
      setChatTotal(d.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  }, []);

  // ── Tab switch ─────────────────────────────────────────────

  useEffect(() => {
    void Promise.resolve().then(() => {
      if (tab === "overview") loadStats();
      if (tab === "users")    loadUsers();
      if (tab === "chat")     loadChat(0, filterAgent, searchChat);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function applyFilter() {
    setChatOffset(0);
    loadChat(0, filterAgent, searchChat);
  }

  // ── Render ─────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#070515] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <section className="rounded-3xl border border-amber-400/20 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">Admin Only</p>
          <h1 className="mt-1 text-3xl font-bold">AstroLife — User Experience Dashboard</h1>
          <p className="mt-2 text-sm text-white/55">
            Real-time view of users, their charts, and every question they ask the AI.
          </p>
        </section>

        {/* Tabs */}
        <div className="flex gap-2">
          {([["overview", "Overview"], ["users", "Users"], ["chat", "Chat Questions"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                tab === key
                  ? "bg-amber-400 text-black"
                  : "border border-white/15 text-white/60 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error === '{"error":"Forbidden"}' || error.includes("Forbidden")
              ? "Access denied. This page is only for the admin account."
              : error}
          </div>
        )}

        {loading && (
          <div className="py-12 text-center text-white/40 text-sm">Loading…</div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && stats && !loading && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-5">
              <StatCard label="Total Users"     value={stats.totalUsers}     color="amber" />
              <StatCard label="Total Charts"    value={stats.totalCharts}    color="green" />
              <StatCard label="Total Questions" value={stats.totalQuestions} color="cyan"  />
              <StatCard label="AI Replies"      value={stats.totalMessages - stats.totalQuestions} color="purple" />
              <StatCard label="Today Messages"  value={stats.todayMessages}  color="amber" sub="last 24 hours" />
            </div>

            {/* Top Agents */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-bold">Most Used AI Agents</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                {stats.topAgents.map((a) => (
                  <div key={a.agent} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="font-semibold">{AGENT_LABELS[a.agent] ?? a.agent}</p>
                    <p className="mt-1 text-2xl font-bold text-amber-300">{a.count}</p>
                    <p className="text-xs text-white/40">questions</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-bold">Recent Questions</h2>
              <div className="mt-4 space-y-3">
                {stats.recentActivity.length === 0 && (
                  <p className="text-sm text-white/40">No chat activity yet. Run SQL migration first.</p>
                )}
                {stats.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300 font-semibold">
                          {AGENT_LABELS[a.agent_id] ?? a.agent_id}
                        </span>
                        <span>{timeAgo(a.created_at)}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/80 line-clamp-2">{a.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && !loading && (
          <div className="space-y-5">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Users ({users.length})</h2>
              <button
                onClick={loadUsers}
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/60 hover:bg-white/10"
              >
                Refresh
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {users.length === 0 && (
                <p className="text-sm text-white/40">No users found.</p>
              )}
              {users.map((u) => (
                <div key={u.id} className="rounded-2xl border border-white/10 bg-black/20">
                  <button
                    className="flex w-full items-center gap-4 p-4 text-left"
                    onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-white truncate">{u.email}</p>
                        <span className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-white/50">
                          {u.provider}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-white/40">
                        <span>Joined: {fmt(u.joinedAt)}</span>
                        <span>Last seen: {timeAgo(u.lastSignIn)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-3 text-sm">
                      <span className="rounded-full bg-green-500/15 px-3 py-1 text-green-300">
                        {u.chartCount} charts
                      </span>
                      <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-300">
                        {u.questionCount} questions
                      </span>
                    </div>
                    <span className="ml-2 text-white/30">{expandedUser === u.id ? "▲" : "▼"}</span>
                  </button>

                  {expandedUser === u.id && (
                    <div className="border-t border-white/10 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                            Charts ({u.chartCount})
                          </p>
                          {u.charts.length === 0 && <p className="text-sm text-white/30">No charts saved.</p>}
                          {u.charts.map((c) => (
                            <div key={c.id} className="mb-2 rounded-xl border border-white/8 bg-white/[0.03] p-3 text-sm">
                              <p className="font-semibold">{c.name}</p>
                              <p className="text-xs text-white/40">{fmt(c.created_at)}</p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                            Activity
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between rounded-xl border border-white/8 bg-white/[0.03] p-3">
                              <span className="text-white/60">Questions asked</span>
                              <span className="font-bold text-cyan-300">{u.questionCount}</span>
                            </div>
                            <div className="flex justify-between rounded-xl border border-white/8 bg-white/[0.03] p-3">
                              <span className="text-white/60">AI replies received</span>
                              <span className="font-bold text-purple-300">{u.replyCount}</span>
                            </div>
                            <div className="flex justify-between rounded-xl border border-white/8 bg-white/[0.03] p-3">
                              <span className="text-white/60">Last sign in</span>
                              <span className="font-semibold">{timeAgo(u.lastSignIn)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Anonymous visitors block */}
          {anon && (anon.chartCount > 0 || anon.questionCount > 0) && (
            <section className="rounded-3xl border border-orange-400/20 bg-orange-500/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-orange-300">Anonymous Visitors</h2>
                <div className="flex gap-3 text-sm">
                  <span className="rounded-full bg-orange-500/15 px-3 py-1 text-orange-300">{anon.chartCount} charts generated</span>
                  <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-300">{anon.questionCount} questions asked</span>
                </div>
              </div>
              <div className="space-y-2">
                {anon.charts.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-white/10 bg-black/20 p-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className="text-white/40">{c.dob} · {c.tob}</span>
                    <span className="text-white/40">{c.city}</span>
                    <span className="ml-auto text-white/30 text-xs">{fmt(c.created_at)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          </div>
        )}

        {/* ── CHAT QUESTIONS TAB ── */}
        {tab === "chat" && !loading && (
          <div className="space-y-4">
            {/* Filters */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-white/50">Search in questions</label>
                  <input
                    value={searchChat}
                    onChange={(e) => setSearchChat(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyFilter()}
                    placeholder="Type to search..."
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-white/50">Filter by agent</label>
                  <select
                    value={filterAgent}
                    onChange={(e) => setFilterAgent(e.target.value)}
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="">All Agents</option>
                    {Object.entries(AGENT_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={applyFilter}
                  className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-black hover:bg-amber-300"
                >
                  Search
                </button>
              </div>
              <p className="mt-3 text-xs text-white/35">
                Showing {chat.length} of {chatTotal} user questions
              </p>
            </section>

            {/* Messages */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-bold">Chat Questions</h2>

              <div className="mt-4 space-y-3">
                {chat.length === 0 && (
                  <p className="text-sm text-white/40">
                    No chat messages found. Run the SQL migration in Supabase, then users will start chatting and questions will appear here.
                  </p>
                )}
                {chat.map((msg) => (
                  <div
                    key={msg.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-white/70">{msg.userEmail}</span>
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300 font-semibold">
                        {AGENT_LABELS[msg.agent_id] ?? msg.agent_id}
                      </span>
                      {msg.chart_name && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/50">
                          {msg.chart_name}
                        </span>
                      )}
                      <span className="ml-auto text-white/35">{fmt(msg.created_at)}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/80">
                      <span className="text-amber-400/60 text-xs mr-1">Q:</span>{msg.content}
                    </p>
                    {msg.aiResponse && (
                      <p className="mt-2 text-sm text-white/50 border-t border-white/5 pt-2 line-clamp-3">
                        <span className="text-emerald-400/60 text-xs mr-1">AI:</span>{msg.aiResponse}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {chatTotal > CHAT_PAGE && (
                <div className="mt-6 flex justify-between">
                  <button
                    disabled={chatOffset === 0}
                    onClick={() => { const o = chatOffset - CHAT_PAGE; setChatOffset(o); loadChat(o, filterAgent, searchChat); }}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm disabled:opacity-30 hover:bg-white/10"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-white/40">
                    {chatOffset + 1}–{Math.min(chatOffset + CHAT_PAGE, chatTotal)} of {chatTotal}
                  </span>
                  <button
                    disabled={chatOffset + CHAT_PAGE >= chatTotal}
                    onClick={() => { const o = chatOffset + CHAT_PAGE; setChatOffset(o); loadChat(o, filterAgent, searchChat); }}
                    className="rounded-full border border-white/15 px-4 py-2 text-sm disabled:opacity-30 hover:bg-white/10"
                  >
                    Next →
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

      </div>
    </main>
  );
}
