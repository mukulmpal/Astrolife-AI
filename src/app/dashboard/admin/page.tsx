"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/access";
import Link from "next/link";
import { Shield, ShieldAlert, Sparkles, UserCheck, Search, CheckCircle2, RefreshCw } from "lucide-react";

type UserRecord = {
  id: string;
  email: string;
  name: string;
  subscription_tier: string;
  subscription_expires_at: string | null;
  created_at: string;
  last_sign_in_at: string | null;
};

export default function AdminPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || !isAdminUser(user.email)) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        showToast(data.error || "Failed to load users", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error loading users", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdateTier = async (userId: string, targetTier: "free" | "premium" | "elite") => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tier: targetTier }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(`User updated to ${targetTier.toUpperCase()} successfully!`);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  subscription_tier: targetTier,
                  subscription_expires_at: data.expiresAt,
                }
              : u
          )
        );
      } else {
        showToast(data.error || "Update failed", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Error updating user tier", "error");
    }
    setUpdatingId(null);
  };

  if (authorized === false) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#0d0a22", border: "1px solid #2a2050", borderRadius: 20, padding: 36, textAlign: "center", maxWidth: 440 }}>
          <ShieldAlert size={48} style={{ color: "#ef4444", margin: "0 auto 16px" }} />
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, color: "#f0e8d0", marginBottom: 8 }}>
            Access Restricted
          </h2>
          <p style={{ color: "#8078a8", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Yeh area keval AstroLife Administrator accounts ke liye reserved hai.
          </p>
          <Link href="/dashboard" style={{ display: "inline-block", background: "linear-gradient(135deg,#c8a030,#a07820)", color: "#060410", padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    free: users.filter((u) => u.subscription_tier === "free").length,
    premium: users.filter((u) => u.subscription_tier === "premium").length,
    elite: users.filter((u) => u.subscription_tier === "elite").length,
  };

  return (
    <div style={{ padding: "32px 28px", maxWidth: 1200, margin: "0 auto", color: "#f0e8d0" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 30 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#c8a030", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
            <Shield size={14} /> AstroLife Command Center
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 600, color: "#f0e8d0" }}>
            User Role & Tier Management
          </h1>
          <p style={{ color: "#706898", fontSize: 13, marginTop: 4 }}>
            Manage user entitlements, grant VIP Elite or Premium access, and inspect live Supabase subscribers.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 10,
            background: "#0d0a22",
            border: "1px solid #2a2050",
            color: "#c8a030",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            padding: "12px 20px",
            borderRadius: 12,
            background: toast.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
            border: `1px solid ${toast.type === "success" ? "#22c55e" : "#ef4444"}`,
            color: toast.type === "success" ? "#86efac" : "#fca5a5",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <CheckCircle2 size={16} /> {toast.message}
        </div>
      )}

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#605890", textTransform: "uppercase", letterSpacing: 1.5 }}>Total Registered</div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#f0e8d0", marginTop: 4 }}>{stats.total}</div>
        </div>
        <div style={{ background: "#0d0a22", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#c084fc", textTransform: "uppercase", letterSpacing: 1.5 }}>Elite VIP Members</div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#c084fc", marginTop: 4 }}>{stats.elite}</div>
        </div>
        <div style={{ background: "#0d0a22", border: "1px solid rgba(200,160,48,0.25)", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#c8a030", textTransform: "uppercase", letterSpacing: 1.5 }}>Premium Users</div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#c8a030", marginTop: 4 }}>{stats.premium}</div>
        </div>
        <div style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: 16, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, color: "#605890", textTransform: "uppercase", letterSpacing: 1.5 }}>Free Tier</div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 32, fontWeight: 700, color: "#8078a8", marginTop: 4 }}>{stats.free}</div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#605890" }} />
        <input
          type="text"
          placeholder="Search seekers by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            background: "#0a0720",
            border: "1px solid #1c1840",
            borderRadius: 12,
            padding: "12px 16px 12px 44px",
            color: "#f0e8d0",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      {/* TABLE */}
      <div style={{ background: "#0d0a22", border: "1px solid #1c1840", borderRadius: 16, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1c1840", background: "rgba(10,7,32,0.6)", color: "#605890", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2 }}>
              <th style={{ padding: "16px 20px" }}>Seeker</th>
              <th style={{ padding: "16px 20px" }}>Current Tier</th>
              <th style={{ padding: "16px 20px" }}>Expiration</th>
              <th style={{ padding: "16px 20px" }}>Joined</th>
              <th style={{ padding: "16px 20px", textAlign: "right" }}>Assign Plan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#605890" }}>
                  Loading seekers data from Supabase...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: 40, textAlign: "center", color: "#605890" }}>
                  No users found matching &quot;{search}&quot;.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const isUpdating = updatingId === u.id;
                const tier = u.subscription_tier.toLowerCase();
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid #161234", transition: "background 0.2s" }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: 600, color: "#f0e8d0" }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: "#605890", marginTop: 2 }}>{u.email}</div>
                    </td>

                    <td style={{ padding: "16px 20px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 10.5,
                          fontWeight: 700,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          background:
                            tier === "elite"
                              ? "rgba(168,85,247,0.15)"
                              : tier === "premium"
                              ? "rgba(200,160,48,0.15)"
                              : "rgba(100,100,130,0.15)",
                          color:
                            tier === "elite"
                              ? "#c084fc"
                              : tier === "premium"
                              ? "#c8a030"
                              : "#8078a8",
                          border: `1px solid ${
                            tier === "elite"
                              ? "rgba(168,85,247,0.3)"
                              : tier === "premium"
                              ? "rgba(200,160,48,0.3)"
                              : "rgba(100,100,130,0.2)"
                          }`,
                        }}
                      >
                        {tier === "elite" ? <Sparkles size={11} /> : null}
                        {tier}
                      </span>
                    </td>

                    <td style={{ padding: "16px 20px", color: "#8078a8", fontSize: 12 }}>
                      {u.subscription_expires_at
                        ? new Date(u.subscription_expires_at).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>

                    <td style={{ padding: "16px 20px", color: "#605890", fontSize: 12 }}>
                      {new Date(u.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          onClick={() => handleUpdateTier(u.id, "free")}
                          disabled={isUpdating || tier === "free"}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 500,
                            background: "#0a0720",
                            border: "1px solid #221c48",
                            color: tier === "free" ? "#443c68" : "#8078a8",
                            cursor: tier === "free" || isUpdating ? "default" : "pointer",
                          }}
                        >
                          Free
                        </button>
                        <button
                          onClick={() => handleUpdateTier(u.id, "premium")}
                          disabled={isUpdating || tier === "premium"}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 600,
                            background: tier === "premium" ? "rgba(200,160,48,0.1)" : "#0a0720",
                            border: "1px solid rgba(200,160,48,0.3)",
                            color: "#c8a030",
                            cursor: tier === "premium" || isUpdating ? "default" : "pointer",
                          }}
                        >
                          Premium
                        </button>
                        <button
                          onClick={() => handleUpdateTier(u.id, "elite")}
                          disabled={isUpdating || tier === "elite"}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            background: "linear-gradient(135deg,#a855f7,#7c3aed)",
                            border: "none",
                            color: "#fff",
                            cursor: tier === "elite" || isUpdating ? "default" : "pointer",
                            opacity: tier === "elite" ? 0.4 : 1,
                          }}
                        >
                          ✦ Elite (10y)
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
