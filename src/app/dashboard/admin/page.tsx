"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { isAdminUser } from "@/lib/access";
import { calculateChart, type ChartData } from "@/lib/astro-engine/calculations";
import {
  downloadReportAsPDF,
  generateReportHTML,
  type ReportOptions,
} from "@/lib/report-html-generator";
import {
  POWER_BUNDLE_DOSSIERS,
  downloadPackageDossierPDF,
  previewPackageDossierHTML,
} from "@/lib/report-package-client";
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
  X,
  ExternalLink,
  Download,
  Eye,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import type { ReportAuditRecord } from "@/lib/report-tracker-types";

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

const ADMIN_FLAGSHIP_REPORTS: Array<{
  type: ReportOptions["type"];
  label: string;
  pages: string;
  desc: string;
  badge: string;
  color: string;
}> = [
  { type: "elite", label: "Elite Luxury Dossier", pages: "94 pages", desc: "Flagship luxury dossier with palmistry fusion, family karma & deep synthesis.", badge: "Top Tier", color: "#C9A961" },
  { type: "full", label: "Full 30-Engine System", pages: "91 pages", desc: "Complete life operating system covering all life areas, dashas & remedies.", badge: "Comprehensive", color: "#7C3AED" },
  { type: "kundli", label: "Classical Kundli & Shadbala", pages: "43 pages", desc: "Traditional Vedic Kundli, Shadbala ranks, Ashtakavarga and all 12 Bhavas.", badge: "Classical", color: "#2563EB" },
  { type: "destiny", label: "90-Year Destiny Curve", pages: "47 pages", desc: "Decade-by-decade chronological destiny curve, transit ripple & event radar.", badge: "Predictive", color: "#D97706" },
  { type: "remedy", label: "Master Remedies Vault", pages: "20 pages", desc: "Consecrated yantras, gemstones, astro-sound frequencies & Lal Kitab upay.", badge: "Upay", color: "#16A34A" },
  { type: "medical", label: "Medical Astrology & Health", pages: "22+ pages", desc: "Ayurvedic tridosha balance, organ audit & vitality defense shield.", badge: "Vitality", color: "#0891B2" },
  { type: "evidence-first", label: "KP Evidence-First Classical", pages: "6 pages", desc: "Krishnamurti Paddhati, 5 ruling planets & dasha evidence nodes.", badge: "Deterministic", color: "#059669" },
  { type: "basic", label: "Basic Foundation", pages: "13 pages", desc: "Starter birth snapshot, planetary dashboard & basic yogas.", badge: "Foundation", color: "#6B635B" },
];

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"chats" | "kundlis" | "users" | "reports">("chats");

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

  // Report Audit states
  const [reportLogs, setReportLogs] = useState<ReportAuditRecord[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportSearch, setReportSearch] = useState("");
  const [reportTypeFilter, setReportTypeFilter] = useState<string>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dossier modal states
  const [selectedKundliForDossier, setSelectedKundliForDossier] = useState<KundliItem | null>(null);
  const [generatingDossierKey, setGeneratingDossierKey] = useState<string | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<"bundles" | "flagship">("bundles");

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDownloadPackageDossier = async (chart: ChartData, pkgId: string, pkgTitle: string) => {
    setGeneratingDossierKey(pkgId);
    try {
      await downloadPackageDossierPDF(chart, pkgId, pkgTitle);
      showToast(`Downloaded ${pkgTitle} successfully!`);
    } catch (err) {
      showToast(`Error generating dossier: ${((err as Error)?.message || "")}`, "error");
    } finally {
      setGeneratingDossierKey(null);
    }
  };

  const handleDownloadFlagshipReport = async (chart: ChartData, type: ReportOptions["type"], label: string) => {
    setGeneratingDossierKey(type);
    try {
      await downloadReportAsPDF(chart, { type, palette: "midnight", cover: "wheel", language: "en" });
      showToast(`Downloaded ${label} successfully!`);
    } catch (err) {
      showToast(`Error generating report: ${((err as Error)?.message || "")}`, "error");
    } finally {
      setGeneratingDossierKey(null);
    }
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

  // 5. Load Report Audit Logs
  const loadReports = async () => {
    setReportsLoading(true);
    try {
      const res = await fetch("/api/admin/reports?limit=250");
      const data = await res.json();
      if (res.ok) {
        setReportLogs(data.reports || []);
      } else {
        showToast(data.error || "Failed to load report audits", "error");
      }
    } catch {
      showToast("Network error loading report audits", "error");
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) {
      loadChats();
      loadKundlis();
      loadUsers();
      loadReports();
    }
  }, [authorized]);

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      showToast(`Copied tracking code: ${code}`);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      showToast("Failed to copy code", "error");
    }
  };

  const openDossierForReport = (r: ReportAuditRecord) => {
    const kundli: KundliItem = {
      id: r.id || r.reportCode,
      user_id: r.userId || null,
      userEmail: r.userEmail,
      name: r.nativeName,
      dob: r.nativeDob,
      tob: r.nativeTob,
      city: r.nativeCity,
      lat: r.nativeLat ?? null,
      lon: r.nativeLon ?? null,
      tz: r.nativeTz !== undefined && r.nativeTz !== null ? String(r.nativeTz) : null,
      lagna: r.lagnaRashi || null,
      moon: r.moonSign || null,
      created_at: r.generatedAt,
      source: "report_audit",
    };
    setSelectedKundliForDossier(kundli);
  };

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

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reportLogs.filter((r) => {
      if (reportTypeFilter !== "all") {
        if (reportTypeFilter === "bundle" && !r.reportType.startsWith("bundle-") && !r.reportType.startsWith("package-")) {
          return false;
        }
        if (reportTypeFilter === "flagship" && (r.reportType.startsWith("bundle-") || r.reportType.startsWith("package-"))) {
          return false;
        }
      }
      if (!reportSearch) return true;
      const q = reportSearch.toLowerCase();
      return (
        r.reportCode.toLowerCase().includes(q) ||
        r.reportTitle.toLowerCase().includes(q) ||
        r.userEmail.toLowerCase().includes(q) ||
        r.nativeName.toLowerCase().includes(q) ||
        (r.nativeCity && r.nativeCity.toLowerCase().includes(q)) ||
        (r.lagnaRashi && r.lagnaRashi.toLowerCase().includes(q)) ||
        (r.moonSign && r.moonSign.toLowerCase().includes(q))
      );
    });
  }, [reportLogs, reportSearch, reportTypeFilter]);

  // Active chart calculation for Dossier Modal
  const modalChart = useMemo(() => {
    if (!selectedKundliForDossier) return null;
    try {
      return calculateChart(
        selectedKundliForDossier.name || "Native",
        selectedKundliForDossier.dob || "2000-01-01",
        selectedKundliForDossier.tob || "12:00",
        selectedKundliForDossier.city || "New Delhi",
        typeof selectedKundliForDossier.lat === "number" ? selectedKundliForDossier.lat : undefined,
        typeof selectedKundliForDossier.lon === "number" ? selectedKundliForDossier.lon : undefined,
        selectedKundliForDossier.tz ? Number(selectedKundliForDossier.tz) : undefined
      );
    } catch (err) {
      console.error("Failed to calculate chart for admin dossier modal:", err);
      return null;
    }
  }, [selectedKundliForDossier]);

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
              else if (activeTab === "users") loadUsers();
              else loadReports();
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
            <RefreshCw size={14} className={chatLoading || kundliLoading || usersLoading || reportsLoading ? "animate-spin" : ""} />
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

        <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#6B635B", fontSize: 13, marginBottom: 6 }}>
            <span>Reports Generated</span>
            <FileText size={18} style={{ color: "#059669" }} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#1A1A1A" }}>{reportLogs.length}</div>
          <div style={{ fontSize: 12, color: "#059669", marginTop: 4 }}>Tracked with ALR-* codes</div>
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

        <button
          onClick={() => setActiveTab("reports")}
          style={{
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            background: "none",
            border: "none",
            borderBottom: activeTab === "reports" ? "3px solid #059669" : "3px solid transparent",
            color: activeTab === "reports" ? "#059669" : "#6B635B",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: -2,
          }}
        >
          <FileText size={16} />
          <span>Report Audits & Tracking ({reportLogs.length})</span>
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
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
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

                          {item.chart_name && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const matched = kundlis.find(
                                  (k) =>
                                    k.name.toLowerCase() === item.chart_name?.toLowerCase() ||
                                    k.userEmail === item.userEmail
                                );
                                if (matched) {
                                  setSelectedKundliForDossier(matched);
                                } else {
                                  setSelectedKundliForDossier({
                                    id: item.id,
                                    user_id: item.user_id,
                                    userEmail: item.userEmail,
                                    name: item.chart_name || "Native",
                                    dob: "2000-01-01",
                                    tob: "12:00",
                                    city: "New Delhi",
                                    lat: 28.6139,
                                    lon: 77.209,
                                    tz: "5.5",
                                    lagna: null,
                                    moon: null,
                                    created_at: item.created_at,
                                    source: "chat",
                                  });
                                }
                              }}
                              style={{
                                background: "rgba(184, 134, 11, 0.14)",
                                border: "1px solid rgba(184, 134, 11, 0.35)",
                                borderRadius: 6,
                                padding: "2px 8px",
                                fontSize: 11,
                                fontWeight: 700,
                                color: "#8A6008",
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <span>📄</span>
                              <span>Dossiers</span>
                            </button>
                          )}
                        </div>
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
                    <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Dossiers &amp; Bundles</th>
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
                      <td style={{ padding: "14px 18px" }}>
                        <button
                          type="button"
                          onClick={() => setSelectedKundliForDossier(k)}
                          style={{
                            background: "linear-gradient(135deg, #B8860B, #8A6008)",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: 8,
                            padding: "6px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: "0 2px 6px rgba(184,134,11,0.25)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <FileSpreadsheet size={13} />
                          <span>Generate Dossiers</span>
                        </button>
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

      {/* TAB 4: Report Audits & Verification Codes */}
      {activeTab === "reports" && (
        <div>
          {/* Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, flex: 1, minWidth: 280 }}>
              <div style={{ flex: 1, minWidth: 260, position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8E877D" }} />
                <input
                  type="text"
                  value={reportSearch}
                  onChange={e => setReportSearch(e.target.value)}
                  placeholder="Search by ALR Code, native name, user email, report title, city, lagna..."
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
                  value={reportTypeFilter}
                  onChange={e => setReportTypeFilter(e.target.value)}
                  style={{
                    padding: "9px 12px",
                    borderRadius: 10,
                    border: "1px solid #D6CEBE",
                    fontSize: 13,
                    background: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  <option value="all">All Report Types</option>
                  <option value="bundle">Specialized Power Bundles</option>
                  <option value="flagship">Flagship Core Editions</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#6B635B" }}>
                Showing <strong>{filteredReports.length}</strong> of {reportLogs.length} tracked reports
              </span>
              <button
                type="button"
                onClick={() => {
                  loadReports();
                  showToast("Report audit logs refreshed!");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  background: "#FAF7F2",
                  border: "1px solid #D6CEBE",
                  color: "#3D362E",
                  cursor: "pointer",
                }}
              >
                <RefreshCw size={13} className={reportsLoading ? "animate-spin" : ""} />
                <span>Sync Logs</span>
              </button>
            </div>
          </div>

          {/* Security & Audit Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, rgba(5,150,105,0.06), rgba(184,134,11,0.06))",
              border: "1px solid rgba(5,150,105,0.25)",
              borderRadius: 12,
              padding: "12px 18px",
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🔒</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>
                  Airtight Cryptographic Tracking & Anti-Spoofing Architecture
                </div>
                <div style={{ fontSize: 12, color: "#5A4E3D" }}>
                  Har report generation par unique server-issued code (ALR-YYYYMMDD-[HEX]) stamp hota hai. Client spoofing impossible hai.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, fontSize: 11, fontWeight: 600 }}>
              <span style={{ background: "#FFFFFF", padding: "4px 8px", borderRadius: 6, border: "1px solid #A7F3D0", color: "#047857" }}>
                ✓ Dual-Layer Persistence (Supabase + Disk)
              </span>
              <span style={{ background: "#FFFFFF", padding: "4px 8px", borderRadius: 6, border: "1px solid #FEF08A", color: "#854D0E" }}>
                ✓ Stamped on PDF Cover & Headers
              </span>
            </div>
          </div>

          {/* Reports Table */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2D9CC", borderRadius: 14, overflowX: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FAF7F2", borderBottom: "1px solid #E2D9CC" }}>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Verification Code</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Report Title & Edition</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Native Person & Chart Snapshot</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Generated By Account</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Engine & Speed</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600 }}>Timestamp</th>
                  <th style={{ padding: "14px 18px", color: "#6B635B", fontWeight: 600, textAlign: "right" }}>Dossier Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center", color: "#8E877D" }}>
                      {reportsLoading ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                          <RefreshCw size={18} className="animate-spin" style={{ color: "#059669" }} />
                          <span>Report audit records sync ho rahe hain...</span>
                        </div>
                      ) : (
                        <div>
                          <FileText size={32} style={{ color: "#D6CEBE", margin: "0 auto 8px" }} />
                          <p style={{ margin: 0, fontWeight: 500 }}>Koi report tracking log nahi mila</p>
                          <p style={{ margin: "4px 0 0", fontSize: 12 }}>Jab koi user ya admin report generate karega, woh real-time yahan code ke sath dikhegi.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((r, idx) => {
                    const isCopied = copiedCode === r.reportCode;
                    const isBundle = r.reportType.startsWith("bundle-") || r.reportType.startsWith("package-");
                    const dateFormatted = new Date(r.generatedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });

                    return (
                      <tr
                        key={r.reportCode + idx}
                        style={{
                          borderBottom: "1px solid #F0EAE1",
                          background: idx % 2 === 0 ? "#FFFFFF" : "#FCFBF9",
                        }}
                      >
                        {/* 1. Verification Code */}
                        <td style={{ padding: "14px 18px", verticalAlign: "top" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <code
                              style={{
                                fontFamily: "monospace",
                                fontSize: 12,
                                fontWeight: 700,
                                background: "#ECFDF5",
                                color: "#047857",
                                padding: "4px 8px",
                                borderRadius: 6,
                                border: "1px solid #A7F3D0",
                                letterSpacing: "0.02em",
                              }}
                            >
                              {r.reportCode}
                            </code>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(r.reportCode)}
                              title="Copy Verification Code"
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 4,
                                color: isCopied ? "#059669" : "#8E877D",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 4,
                              }}
                            >
                              {isCopied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                          {r.isSample && (
                            <div style={{ marginTop: 4 }}>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  background: "#FEF3C7",
                                  color: "#92400E",
                                  border: "1px solid #FDE68A",
                                }}
                              >
                                SAMPLE REPORT
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 2. Report Title & Edition */}
                        <td style={{ padding: "14px 18px", verticalAlign: "top" }}>
                          <div style={{ fontWeight: 600, color: "#1A1A1A", marginBottom: 3 }}>
                            {r.reportTitle}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "1px 6px",
                                borderRadius: 4,
                                background: isBundle ? "rgba(184,134,11,0.12)" : "rgba(124,58,237,0.12)",
                                color: isBundle ? "#8A6008" : "#7C3AED",
                                border: `1px solid ${isBundle ? "rgba(184,134,11,0.3)" : "rgba(124,58,237,0.3)"}`,
                                textTransform: "uppercase",
                              }}
                            >
                              {isBundle ? "Specialized Bundle" : "Flagship Core"}
                            </span>
                            {r.pageCount && (
                              <span style={{ fontSize: 11, color: "#6B635B" }}>
                                📄 {r.pageCount}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 3. Native Person & Snapshot */}
                        <td style={{ padding: "14px 18px", verticalAlign: "top" }}>
                          <div style={{ fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>
                            👤 {r.nativeName}
                          </div>
                          <div style={{ fontSize: 11, color: "#6B635B", marginBottom: 4 }}>
                            📅 {r.nativeDob} · ⏰ {r.nativeTob} · 📍 {r.nativeCity}
                          </div>
                          {(r.lagnaRashi || r.moonSign || r.nakshatra) && (
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {r.lagnaRashi && (
                                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#F5EFE6", color: "#8A6008", border: "1px solid #E2D9CC" }}>
                                  Lagna: {r.lagnaRashi}
                                </span>
                              )}
                              {r.moonSign && (
                                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#EDE9FE", color: "#6D28D9", border: "1px solid #DDD6FE" }}>
                                  Moon: {r.moonSign}
                                </span>
                              )}
                              {r.nakshatra && (
                                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#E0F2FE", color: "#0369A1", border: "1px solid #BAE6FD" }}>
                                  Nak: {r.nakshatra}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* 4. Generated By Account */}
                        <td style={{ padding: "14px 18px", verticalAlign: "top" }}>
                          <div style={{ fontWeight: 500, color: "#1A1A1A", marginBottom: 3 }}>
                            {r.userEmail}
                          </div>
                          <div>
                            {r.isAdminGenerated ? (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  background: "#FEF2F2",
                                  color: "#B91C1C",
                                  border: "1px solid #FECACA",
                                }}
                              >
                                🛡️ Admin Generated
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 600,
                                  padding: "2px 6px",
                                  borderRadius: 4,
                                  background: "#F3F4F6",
                                  color: "#374151",
                                  border: "1px solid #E5E7EB",
                                }}
                              >
                                👤 User Account
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 5. Engine & Speed */}
                        <td style={{ padding: "14px 18px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: r.status === "success" ? "#10B981" : "#EF4444",
                                display: "inline-block",
                              }}
                            />
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                              {r.pdfEngine || "Chromium"}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "#6B635B" }}>
                            ⚡ {r.generationDurationMs ? `${(r.generationDurationMs / 1000).toFixed(2)}s` : "Fast"}
                          </div>
                        </td>

                        {/* 6. Timestamp */}
                        <td style={{ padding: "14px 18px", verticalAlign: "top", color: "#6B635B", fontSize: 12 }}>
                          <div>{dateFormatted}</div>
                        </td>

                        {/* 7. Dossier Actions */}
                        <td style={{ padding: "14px 18px", verticalAlign: "top", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => openDossierForReport(r)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "6px 12px",
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              background: "linear-gradient(135deg, #B8860B, #996515)",
                              border: "none",
                              color: "#FFFFFF",
                              cursor: "pointer",
                              boxShadow: "0 2px 6px rgba(184,134,11,0.25)",
                            }}
                          >
                            <Sparkles size={12} />
                            <span>Dossier Studio ↗</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Admin Dossier Generator Modal ── */}
      {selectedKundliForDossier && modalChart && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 14, 31, 0.7)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 16,
          }}
          onClick={() => setSelectedKundliForDossier(null)}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              width: "100%",
              maxWidth: 980,
              maxHeight: "92vh",
              overflowY: "auto",
              boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
              border: "1px solid rgba(184,134,11,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #E2D9CC",
                background: "#FAF7F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                borderRadius: "20px 20px 0 0",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 22 }}>🕉️</span>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", margin: 0 }}>
                    {selectedKundliForDossier.name} · Dossier Generation Studio
                  </h2>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: "rgba(184,134,11,0.15)",
                      color: "#8A6008",
                      padding: "2px 8px",
                      borderRadius: 999,
                      border: "1px solid rgba(184,134,11,0.35)",
                    }}
                  >
                    ADMIN UNRESTRICTED PASS
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#6B635B", flexWrap: "wrap" }}>
                  <span>📅 {selectedKundliForDossier.dob}</span>
                  <span>•</span>
                  <span>⏰ {selectedKundliForDossier.tob}</span>
                  <span>•</span>
                  <span>📍 {selectedKundliForDossier.city}</span>
                  <span>•</span>
                  <span style={{ color: "#B8860B", fontWeight: 600 }}>Lagna: {modalChart.lagnaRashi}</span>
                  <span>•</span>
                  <span style={{ color: "#7C3AED", fontWeight: 600 }}>Moon: {modalChart.planets.Moon?.sign} ({modalChart.planets.Moon?.nakshatra})</span>
                  <span>•</span>
                  <span>User: {selectedKundliForDossier.userEmail}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <a
                  href={`/dashboard/report?name=${encodeURIComponent(selectedKundliForDossier.name)}&dob=${encodeURIComponent(selectedKundliForDossier.dob)}&tob=${encodeURIComponent(selectedKundliForDossier.tob)}&city=${encodeURIComponent(selectedKundliForDossier.city)}&lat=${selectedKundliForDossier.lat ?? ""}&lon=${selectedKundliForDossier.lon ?? ""}&tz=${selectedKundliForDossier.tz ?? ""}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    background: "#FFFFFF",
                    border: "1px solid #D6CEBE",
                    color: "#3D362E",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Open in Report Studio ↗</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedKundliForDossier(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#8E877D",
                    padding: 6,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: "flex", gap: 10, padding: "16px 24px 0", borderBottom: "1px solid #E2D9CC" }}>
              <button
                type="button"
                onClick={() => setModalActiveTab("bundles")}
                style={{
                  padding: "10px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  background: "none",
                  border: "none",
                  borderBottom: modalActiveTab === "bundles" ? "3px solid #B8860B" : "3px solid transparent",
                  color: modalActiveTab === "bundles" ? "#B8860B" : "#6B635B",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: -1,
                }}
              >
                <span>⚡ 8 Specialized Power Bundles (24 Pages Each)</span>
              </button>
              <button
                type="button"
                onClick={() => setModalActiveTab("flagship")}
                style={{
                  padding: "10px 18px",
                  fontSize: 13,
                  fontWeight: 700,
                  background: "none",
                  border: "none",
                  borderBottom: modalActiveTab === "flagship" ? "3px solid #7C3AED" : "3px solid transparent",
                  color: modalActiveTab === "flagship" ? "#7C3AED" : "#6B635B",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: -1,
                }}
              >
                <span>📄 8 Flagship Core Editions (Up to 94 Pages)</span>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "20px 24px" }}>
              {/* Tab 1: 8 Power Bundles */}
              {modalActiveTab === "bundles" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 14 }}>
                  {POWER_BUNDLE_DOSSIERS.map((pkg) => {
                    const isBusy = generatingDossierKey === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        style={{
                          background: "#FAF7F2",
                          border: "1px solid #E2D9CC",
                          borderRadius: 12,
                          padding: 16,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: `${pkg.color}18`,
                                color: pkg.color,
                                border: `1px solid ${pkg.color}40`,
                                textTransform: "uppercase",
                              }}
                            >
                              {pkg.badge}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#6B635B" }}>
                              📄 {pkg.pages}
                            </span>
                          </div>

                          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>
                            {pkg.title}
                          </h3>

                          <p style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.4, margin: "0 0 10px" }}>
                            {pkg.tagline}
                          </p>

                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                            {pkg.engines.map((eng) => (
                              <span
                                key={eng}
                                style={{
                                  fontSize: 10,
                                  padding: "2px 6px",
                                  borderRadius: 999,
                                  background: "#FFFFFF",
                                  border: "1px solid #D6CEBE",
                                  color: "#5A4E3D",
                                }}
                              >
                                {eng}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 8, borderTop: "1px solid #E2D9CC", paddingTop: 10 }}>
                          <button
                            type="button"
                            onClick={() => previewPackageDossierHTML(modalChart, pkg.id, pkg.title)}
                            disabled={Boolean(generatingDossierKey)}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              fontSize: 12,
                              fontWeight: 600,
                              borderRadius: 8,
                              background: "#FFFFFF",
                              border: "1px solid #D6CEBE",
                              color: "#3D362E",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 5,
                            }}
                          >
                            <Eye size={13} />
                            <span>Preview HTML</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadPackageDossier(modalChart, pkg.id, pkg.title)}
                            disabled={Boolean(generatingDossierKey)}
                            style={{
                              flex: 1.2,
                              padding: "8px 12px",
                              fontSize: 12,
                              fontWeight: 700,
                              borderRadius: 8,
                              background: isBusy
                                ? "#E2D9CC"
                                : `linear-gradient(135deg, ${pkg.color}, ${pkg.color}CC)`,
                              border: "none",
                              color: "#FFFFFF",
                              cursor: isBusy ? "wait" : "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 5,
                              boxShadow: isBusy ? "none" : `0 2px 6px ${pkg.color}33`,
                            }}
                          >
                            <Download size={13} />
                            <span>{isBusy ? "Generating PDF..." : "Download PDF"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Flagship Editions */}
              {modalActiveTab === "flagship" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 14 }}>
                  {ADMIN_FLAGSHIP_REPORTS.map((rep) => {
                    const isBusy = generatingDossierKey === rep.type;
                    return (
                      <div
                        key={rep.type}
                        style={{
                          background: "#FAF7F2",
                          border: "1px solid #E2D9CC",
                          borderRadius: 12,
                          padding: 16,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 6,
                                background: `${rep.color}18`,
                                color: rep.color,
                                border: `1px solid ${rep.color}40`,
                                textTransform: "uppercase",
                              }}
                            >
                              {rep.badge}
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#6B635B" }}>
                              📄 {rep.pages}
                            </span>
                          </div>

                          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px" }}>
                            {rep.label}
                          </h3>

                          <p style={{ fontSize: 12, color: "#6B635B", lineHeight: 1.4, margin: "0 0 12px" }}>
                            {rep.desc}
                          </p>
                        </div>

                        <div style={{ display: "flex", gap: 8, borderTop: "1px solid #E2D9CC", paddingTop: 10 }}>
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                const html = generateReportHTML(modalChart, {
                                  type: rep.type,
                                  palette: "midnight",
                                  cover: "wheel",
                                  language: "en",
                                });
                                const win = window.open("", "_blank");
                                if (win) {
                                  win.document.open();
                                  win.document.write(html);
                                  win.document.close();
                                }
                              } catch (err) {
                                showToast("Error generating preview", "error");
                              }
                            }}
                            disabled={Boolean(generatingDossierKey)}
                            style={{
                              flex: 1,
                              padding: "8px 12px",
                              fontSize: 12,
                              fontWeight: 600,
                              borderRadius: 8,
                              background: "#FFFFFF",
                              border: "1px solid #D6CEBE",
                              color: "#3D362E",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 5,
                            }}
                          >
                            <Eye size={13} />
                            <span>Preview HTML</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadFlagshipReport(modalChart, rep.type, rep.label)}
                            disabled={Boolean(generatingDossierKey)}
                            style={{
                              flex: 1.2,
                              padding: "8px 12px",
                              fontSize: 12,
                              fontWeight: 700,
                              borderRadius: 8,
                              background: isBusy
                                ? "#E2D9CC"
                                : `linear-gradient(135deg, ${rep.color}, ${rep.color}CC)`,
                              border: "none",
                              color: "#FFFFFF",
                              cursor: isBusy ? "wait" : "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 5,
                              boxShadow: isBusy ? "none" : `0 2px 6px ${rep.color}33`,
                            }}
                          >
                            <Download size={13} />
                            <span>{isBusy ? "Generating PDF..." : "Download PDF"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
