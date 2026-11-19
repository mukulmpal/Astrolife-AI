"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/access";
import Link from "next/link";
import {
  Shield,
  ShieldAlert,
  Sparkles,
  Search,
  RefreshCw,
  MessageSquare,
  FileSpreadsheet,
  Users,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  MapPin,
  Calendar,
  Compass,
  CheckCircle2,
  Filter,
} from "lucide-react";

type ChatItem = {
  id: string;
  user_id: string | null;
  session_id: string;
  agent_id: string;
  role: string;
  content: string;
  chart_name: string | null;
  created_at: string;
  userEmail: string;
  aiResponse: string | null;
};

type KundliItem = {
  id: string;
  user_id: string | null;
  userEmail: string;
  name: string;
  dob: string;
  tob: string;
  city: string;
  lat: number | null;
  lon: number | null;
  tz: string | null;
  lagna: string | null;
  moon: string | null;
  created_at: string;
  source: string;
};

type UserRecord = {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  subscription_expires_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
};

const AGENT_LABELS: Record<string, { label: string; emoji: string }> = {
  general: { label: "AstroLife", emoji: "✦" },
  career: { label: "Career", emoji: "📈" },
  marriage: { label: "Marriage", emoji: "💑" },
  karmic: { label: "Karmic", emoji: "☯️" },
  wealth: { label: "Wealth", emoji: "💰" },
  health: { label: "Health", emoji: "🌿" },
  psychology: { label: "Psychology", emoji: "🧠" },
  remedy: { label: "Remedy", emoji: "🕯️" },
  lalkitab: { label: "Lal Kitab", emoji: "📕" },
  spiritual: { label: "Spiritual", emoji: "🙏" },
};

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chats" | "kundlis" | "users">("chats");

  // Data states
  const [chatMessages, setChatMessages] = useState<ChatItem[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSearch, setChatSearch] = useState("");
  const [chatAgentFilter, setChatAgentFilter] = useState("all");
  const [expandedChatId, setExpandedChatId] = useState<string | null>(null);

  const [kundlis, setKundlis] = useState<KundliItem[]>([]);
  const [kundliLoading, setKundliLoading] = useState(false);
  const [kundliSearch, setKundliSearch] = useState("");

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Check Admin Auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !isAdminUser(user.email)) {
          setAuthorized(false);
          return;
        }
        setAuthorized(true);
        setCurrentUserEmail(user.email ?? null);
      } catch {
        setAuthorized(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Load Chats
  const loadChats = async () => {
    setChatLoading(true);
    try {
      const res = await fetch("/api/admin/chat-history?limit=250");
      const data = await res.json();
      if (res.ok) {
        setChatMessages(data.messages || []);
      } else {
        showToast(data.error || "Failed to load chat history", "error");
      }
    } catch {
      showToast("Network error loading chats", "error");
    } finally {
      setChatLoading(false);
    }
  };

  // 3. Load Kundlis
  const loadKundlis = async () => {
    setKundliLoading(true);
    try {
      const res = await fetch("/api/admin/charts?limit=250");
      const data = await res.json();
      if (res.ok) {
        setKundlis(data.charts || []);
      } else {
        showToast(data.error || "Failed to load kundlis", "error");
      }
    } catch {
      showToast("Network error loading kundlis", "error");
    } finally {
      setKundliLoading(false);
    }
  };

  // 4. Load Users
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        showToast(data.error || "Failed to load users", "error");
      }
    } catch {
      showToast("Network error loading users", "error");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadChats();
      loadKundlis();
      loadUsers();
    }
  }, [authorized]);

  const handleUpdateTier = async (userId: string, targetTier: "free" | "premium" | "elite") => {
    setUpdatingUserId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tier: targetTier }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`User updated to ${targetTier.toUpperCase()} successfully!`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscription_tier: targetTier, subscription_expires_at: data.expiresAt } : u));
      } else {
        showToast(data.error || "Update failed", "error");
      }
    } catch {
      showToast("Error updating user tier", "error");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filtered chats
  const filteredChats = useMemo(() => {
    return chatMessages.filter(c => {
      const matchesSearch =
        !chatSearch ||
        c.content.toLowerCase().includes(chatSearch.toLowerCase()) ||
        (c.chart_name && c.chart_name.toLowerCase().includes(chatSearch.toLowerCase())) ||
        c.userEmail.toLowerCase().includes(chatSearch.toLowerCase());
      const matchesAgent = chatAgentFilter === "all" || c.agent_id === chatAgentFilter;
      return matchesSearch && matchesAgent;
    });
  }, [chatMessages, chatSearch, chatAgentFilter]);

  // Filtered kundlis
  const filteredKundlis = useMemo(() => {
    return kundlis.filter(k => {
      if (!kundliSearch) return true;
      const q = kundliSearch.toLowerCase();
      return (
        k.name.toLowerCase().includes(q) ||
        k.city.toLowerCase().includes(q) ||
        k.dob.includes(q) ||
        k.userEmail.toLowerCase().includes(q)
      );
    });
  }, [kundlis, kundliSearch]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (!userSearch) return true;
      const q = userSearch.toLowerCase();
      return u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
    });
  }, [users, userSearch]);

  if (authorized === false) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 20, padding: 36, textAlign: "center", maxWidth: 440, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
          <ShieldAlert size={48} style={{ color: "#ef4444", margin: "0 auto 16px" }} />
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#1A1A1A", marginBottom: 8 }}>
            Access Restricted
          </h2>
          <p style={{ color: "#6B635B", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Yeh section sirf AstroLife Administrator accounts ke liye reserved hai.
          </p>
          <Link href="/dashboard" style={{ display: "inline-block", background: "linear-gradient(135deg,#B8860B,#996515)", color: "#FFFFFF", padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (authorized === null) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RefreshCw size={28} className="animate-spin" style={{ color: "#B8860B" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 24px 60px", maxWidth: 1360, margin: "0 auto" }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            padding: "12px 20px",
            borderRadius: 12,
            background: toast.type === "success" ? "#15803d" : "#b91c1c",
            color: "#FFFFFF",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 24 }}>🛡️</span>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#1A1A1A", margin: 0 }}>
              AstroLife Admin Intelligence
            </h1>
          </div>
          <p style={{ color: "#6B635B", fontSize: 14, margin: 0 }}>
            Real-time visibility: Har user ke questions, active kundli details, aur sabhi generated birth charts.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#6B635B", background: "#F5EFE6", padding: "6px 12px", borderRadius: 8, border: "1px solid #E2D9CC" }}>
            Admin: <strong>{currentUserEmail}</strong>
          </span>
          <button
            onClick={() => {
              if (activeTab === "chats") loadChats();
              else if (activeTab === "kundlis") loadKundlis();
              else loadUsers();
              showToast("Data refreshed!");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#FFFFFF",
              border: "1px solid #D6CEBE",
              padding: "8px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: "#3D362E",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} className={chatLoading || kundliLoading || usersLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6B635B", fontSize: 13, marginBottom: 6 }}>
            <span>AI Questions Asked</span>
            <MessageSquare size={18} style={{ color: "#B8860B" }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#1A1A1A" }}>{chatMessages.length}</div>
          <div style={{ fontSize: 12, color: "#8A6008", marginTop: 4 }}>Log of all user consultations</div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6B635B", fontSize: 13, marginBottom: 6 }}>
            <span>Kundlis Generated</span>
            <FileSpreadsheet size={18} style={{ color: "#7C3AED" }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#1A1A1A" }}>{kundlis.length}</div>
          <div style={{ fontSize: 12, color: "#7C3AED", marginTop: 4 }}>Total birth charts calculated</div>
        </div>

        <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6B635B", fontSize: 13, marginBottom: 6 }}>
            <span>Registered Users</span>
            <Users size={18} style={{ color: "#2563EB" }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#1A1A1A" }}>{users.length}</div>
          <div style={{ fontSize: 12, color: "#2563EB", marginTop: 4 }}>Accounts on platform</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "2px solid #E2D9CC", marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab("chats")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            background: "none",
            border: "none",
            borderBottom: activeTab === "chats" ? "3px solid #B8860B" : "3px solid transparent",
            color: activeTab === "chats" ? "#B8860B" : "#6B635B",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: -2,
          }}
        >
          <MessageSquare size={16} />
          <span>AI Questions & Kundlis ({chatMessages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("kundlis")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            background: "none",
            border: "none",
            borderBottom: activeTab === "kundlis" ? "3px solid #7C3AED" : "3px solid transparent",
            color: activeTab === "kundlis" ? "#7C3AED" : "#6B635B",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: -2,
          }}
        >
          <FileSpreadsheet size={16} />
          <span>All Kundlis Created ({kundlis.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            background: "none",
            border: "none",
            borderBottom: activeTab === "users" ? "3px solid #2563EB" : "3px solid transparent",
            color: activeTab === "users" ? "#2563EB" : "#6B635B",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: -2,
          }}
        >
          <Users size={16} />
          <span>User Tiers ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: AI Questions & Kundlis */}
      {activeTab === "chats" && (
        <div>
          {/* Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8E877D" }} />
              <input
                type="text"
                value={chatSearch}
                onChange={e => setChatSearch(e.target.value)}
                placeholder="Search questions, chart name, or user email..."
                style={{
                  width: "100%",
                  padding: "9px 12px 9px 36px",
                  borderRadius: 10,
                  border: "1px solid #D6CEBE",
                  fontSize: 13,
                  outline: "none",
                  background: "#FFFFFF",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Filter size={15} style={{ color: "#6B635B" }} />
              <select
                value={chatAgentFilter}
                onChange={e => setChatAgentFilter(e.target.value)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid #D6CEBE",
                  fontSize: 13,
                  background: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <option value="all">All Agents ({chatMessages.length})</option>
                {Object.entries(AGENT_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.emoji} {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List of Questions */}
          {chatLoading && chatMessages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#6B635B" }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 12px", color: "#B8860B" }} />
              <p>Loading questions...</p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 14, padding: "40px 20px", textAlign: "center", color: "#6B635B" }}>
              <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>No matching chat consultations found.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredChats.map(item => {
                const isExpanded = expandedChatId === item.id;
                const agentInfo = AGENT_LABELS[item.agent_id] || { label: item.agent_id, emoji: "✦" };

                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2D9CC",
                      borderRadius: 12,
                      padding: "16px 20px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
                      transition: "border-color 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                      {/* Left: User & Kundli Badge */}
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: item.userEmail.includes("@") ? "rgba(37,99,235,0.1)" : "rgba(107,99,91,0.1)",
                            color: item.userEmail.includes("@") ? "#1D4ED8" : "#4A4238",
                            border: `1px solid ${item.userEmail.includes("@") ? "rgba(37,99,235,0.25)" : "rgba(107,99,91,0.25)"}`,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <User size={12} />
                          {item.userEmail}
                        </span>

                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "rgba(184,134,11,0.12)",
                            color: "#8A6008",
                            border: "1px solid rgba(184,134,11,0.3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {agentInfo.emoji} {agentInfo.label}
                        </span>

                        {/* Kundli Details Badge */}
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 6,
                            background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.14))",
                            color: "#6D28D9",
                            border: "1px solid rgba(124,58,237,0.3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <span>📜 Kundli:</span>
                          <strong>{item.chart_name || "General / No Chart"}</strong>
                        </span>
                      </div>

                      {/* Right: Timestamp */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#8E877D", fontSize: 12 }}>
                        <Clock size={12} />
                        <span>
                          {new Date(item.created_at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Question text */}
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", lineHeight: 1.5, marginBottom: 8 }}>
                      <span style={{ color: "#B8860B", marginRight: 6 }}>Q:</span>
                      {item.content}
                    </div>

                    {/* Answer preview or toggle */}
                    {item.aiResponse && (
                      <div style={{ marginTop: 8 }}>
                        <button
                          onClick={() => setExpandedChatId(isExpanded ? null : item.id)}
                          style={{
                            background: "#FAF7F2",
                            border: "1px solid #E2D9CC",
                            borderRadius: 6,
                            padding: "5px 10px",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#6B635B",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          <span>{isExpanded ? "Hide AI Answer" : "View AI Answer"}</span>
                        </button>

                        {isExpanded && (
                          <div
                            style={{
                              marginTop: 10,
                              padding: "14px 16px",
                              background: "#FAF7F2",
                              borderRadius: 8,
                              border: "1px solid #E2D9CC",
                              fontSize: 13,
                              lineHeight: 1.6,
                              color: "#2C261F",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            <div style={{ fontWeight: 600, color: "#8A6008", marginBottom: 6 }}>AI Response ({agentInfo.label}):</div>
                            {item.aiResponse}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: All Kundlis Created */}
      {activeTab === "kundlis" && (
        <div>
          {/* Search */}
          <div style={{ marginBottom: 16, maxWidth: 400, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8E877D" }} />
            <input
              type="text"
              value={kundliSearch}
              onChange={e => setKundliSearch(e.target.value)}
              placeholder="Search by name, city, DOB or user email..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                borderRadius: 10,
                border: "1px solid #D6CEBE",
                fontSize: 13,
                outline: "none",
                background: "#FFFFFF",
              }}
            />
          </div>

          {kundliLoading && kundlis.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#6B635B" }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 12px", color: "#7C3AED" }} />
              <p>Loading generated kundlis...</p>
            </div>
          ) : filteredKundlis.length === 0 ? (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 14, padding: "40px 20px", textAlign: "center", color: "#6B635B" }}>
              <p style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>No kundlis match search criteria.</p>
            </div>
          ) : (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 14, overflowX: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #E2D9CC" }}>
                    <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Person Name</th>
                    <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Date & Time of Birth</th>
                    <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Birth Place (City)</th>
                    <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Lagna & Moon</th>
                    <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Created By</th>
                    <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKundlis.map((k, idx) => (
                    <tr
                      key={k.id || idx}
                      style={{
                        borderBottom: "1px solid #F0EAE1",
                        background: idx % 2 === 0 ? "#FFFFFF" : "#FCFBF9",
                      }}
                    >
                      <td style={{ padding: "14px 18px", fontWeight: 600, color: "#1A1A1A" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span>🕉️</span>
                          <span>{k.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#3D362E" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Calendar size={13} style={{ color: "#B8860B" }} />
                          <span>{k.dob}</span>
                          <span style={{ color: "#8E877D" }}>•</span>
                          <Clock size={13} style={{ color: "#B8860B" }} />
                          <span>{k.tob}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#3D362E" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <MapPin size={13} style={{ color: "#7C3AED" }} />
                          <span>{k.city}</span>
                          {k.lat && k.lon && (
                            <span style={{ fontSize: 11, color: "#8E877D" }}>
                              ({k.lat.toFixed(2)}, {k.lon.toFixed(2)})
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        {k.lagna || k.moon ? (
                          <div style={{ display: "inline-flex", gap: 6 }}>
                            {k.lagna && (
                              <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "rgba(184,134,11,0.1)", color: "#8A6008", fontWeight: 600 }}>
                                Lagna: {k.lagna}
                              </span>
                            )}
                            {k.moon && (
                              <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: "rgba(124,58,237,0.1)", color: "#6D28D9", fontWeight: 600 }}>
                                Moon: {k.moon}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "#A8A29E" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: k.userEmail.includes("@") ? "rgba(37,99,235,0.1)" : "rgba(107,99,91,0.1)",
                            color: k.userEmail.includes("@") ? "#1D4ED8" : "#4A4238",
                            fontWeight: 500,
                          }}
                        >
                          {k.userEmail}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#8E877D", fontSize: 12 }}>
                        {new Date(k.created_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: User Management */}
      {activeTab === "users" && (
        <div>
          <div style={{ marginBottom: 16, maxWidth: 400, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8E877D" }} />
            <input
              type="text"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              placeholder="Search users by name or email..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                borderRadius: 10,
                border: "1px solid #D6CEBE",
                fontSize: 13,
                outline: "none",
                background: "#FFFFFF",
              }}
            />
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 14, overflowX: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #E2D9CC" }}>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>User Email</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Name</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Tier</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Joined Date</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600, textAlign: "right" }}>Update Tier</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, idx) => {
                  const tier = u.subscription_tier || "free";
                  const isUpdating = updatingUserId === u.id;

                  return (
                    <tr key={u.id} style={{ borderBottom: "1px solid #F0EAE1", background: idx % 2 === 0 ? "#FFFFFF" : "#FCFBF9" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 500, color: "#1A1A1A" }}>{u.email}</td>
                      <td style={{ padding: "14px 18px", color: "#4A4238" }}>{u.name}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            background:
                              tier === "elite" ? "rgba(124,58,237,0.12)" : tier === "premium" ? "rgba(184,134,11,0.12)" : "rgba(107,99,91,0.12)",
                            color:
                              tier === "elite" ? "#7C3AED" : tier === "premium" ? "#8A6008" : "#4A4238",
                            border: `1px solid ${
                              tier === "elite" ? "rgba(124,58,237,0.3)" : tier === "premium" ? "rgba(184,134,11,0.3)" : "rgba(107,99,91,0.25)"
                            }`,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          {tier === "elite" ? <Sparkles size={11} /> : null}
                          {tier}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#6B635B", fontSize: 12 }}>
                        {new Date(u.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: 6 }}>
                          <button
                            onClick={() => handleUpdateTier(u.id, "free")}
                            disabled={isUpdating || tier === "free"}
                            style={{
                              padding: "5px 9px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              background: "#FAF7F2",
                              border: "1px solid rgba(184, 134, 11, 0.25)",
                              color: tier === "free" ? "#A8A29E" : "#4A4238",
                              cursor: tier === "free" || isUpdating ? "default" : "pointer",
                            }}
                          >
                            Free
                          </button>
                          <button
                            onClick={() => handleUpdateTier(u.id, "premium")}
                            disabled={isUpdating || tier === "premium"}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              background: tier === "premium" ? "rgba(184,134,11,0.14)" : "#FAF7F2",
                              border: "1px solid rgba(184,134,11,0.35)",
                              color: "#8A6008",
                              cursor: tier === "premium" || isUpdating ? "default" : "pointer",
                            }}
                          >
                            Premium
                          </button>
                          <button
                            onClick={() => handleUpdateTier(u.id, "elite")}
                            disabled={isUpdating || tier === "elite"}
                            style={{
                              padding: "5px 12px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 700,
                              background: "linear-gradient(135deg,#B8860B,#996515)",
                              border: "none",
                              color: "#FFFFFF",
                              cursor: tier === "elite" || isUpdating ? "default" : "pointer",
                            }}
                          >
                            ✦ Elite (10y)
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
