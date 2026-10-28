"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard, CircleDot, Bot, TrendingUp,
  Sparkles, Timer, Layers, Target, BarChart3, Grid3x3,
  Brain, Music, Gem, Home as HomeIcon, ShieldPlus,
  Leaf, Users, FileText, Zap, Calendar, BookOpen,
  History, Star, HeartHandshake, Heart, HelpCircle, Hash,
  Hand, LogOut, type LucideIcon,
  Radar, Globe, ShoppingBag, Sunrise,
  Shield, Database, Dna,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { clearCurrentChart, useUserChart } from "@/lib/user-chart";
import { useUserTier } from "@/context/ChartContext";

type NavItem = { label: string; href: string; Icon: LucideIcon; badge?: string };
type NavGroup = { label: string; items: NavItem[] };

/**
 * Sidebar exposes all user-facing AstroLife engines while keeping them grouped
 * by product intent instead of as one long directory.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Core",
    items: [
      { label: "Dashboard", href: "/dashboard",        Icon: LayoutDashboard },
      { label: "My Kundli", href: "/dashboard/kundli", Icon: CircleDot, badge: "BASIC" },
      { label: "Astro Bank", href: "/dashboard/astro-bank", Icon: Database, badge: "BASIC" },
      { label: "AI Astrologer", href: "/dashboard/chat", Icon: Bot, badge: "BASIC" },
      { label: "Predictions", href: "/dashboard/destiny", Icon: TrendingUp, badge: "PRO" },
      { label: "Report", href: "/dashboard/report", Icon: FileText, badge: "BASIC" },
    ],
  },
  {
    label: "Relationships",
    items: [
      { label: "Kundali Milan",   href: "/dashboard/kundali-milan",   Icon: Users, badge: "PRO" },
      { label: "Marriage Timing", href: "/dashboard/marriage-timing", Icon: Heart, badge: "ELITE" },
      { label: "Family Karma",    href: "/dashboard/family-synastry", Icon: HeartHandshake, badge: "ELITE" },
    ],
  },
  {
    label: "Prediction & Timing",
    items: [
      { label: "Dasha", href: "/dashboard/dasha", Icon: Timer, badge: "BASIC" },
      { label: "Transits", href: "/dashboard/transits", Icon: Globe, badge: "ELITE" },
      { label: "Event Radar", href: "/dashboard/event-radar", Icon: Radar, badge: "BASIC" },
      { label: "KP", href: "/dashboard/kp", Icon: Target, badge: "BASIC" },
      { label: "Prashna", href: "/dashboard/prashna", Icon: HelpCircle, badge: "BASIC" },
      { label: "Panchang", href: "/dashboard/panchang", Icon: Calendar, badge: "BASIC" },
      { label: "Muhurat", href: "/dashboard/muhurat", Icon: Sparkles, badge: "BASIC" },
      { label: "Transit Purchase", href: "/dashboard/transit-purchase", Icon: ShoppingBag, badge: "PRO" },
    ],
  },
  {
    label: "Chart Intelligence",
    items: [
      { label: "Yogas", href: "/dashboard/yogas", Icon: Sparkles, badge: "BASIC" },
      { label: "Shadbala", href: "/dashboard/shadbala", Icon: BarChart3, badge: "BASIC" },
      { label: "Ashtakavarga", href: "/dashboard/ashtakavarga", Icon: Grid3x3, badge: "BASIC" },
      { label: "Divisional Charts", href: "/dashboard/divisional", Icon: Layers, badge: "ELITE" },
      { label: "Special Lagnas", href: "/dashboard/special-lagnas", Icon: Sunrise, badge: "PRO" },
      { label: "Jaimini", href: "/dashboard/jaimini", Icon: Star, badge: "ELITE" },
      { label: "Sarvatobhadra", href: "/dashboard/sarvatobhadra", Icon: Grid3x3, badge: "BASIC" },
    ],
  },
  {
    label: "Wellness & Remedies",
    items: [
      { label: "Lineage Karma", href: "/dashboard/lineage-karma", Icon: Dna, badge: "ELITE" },
      { label: "Psychology", href: "/dashboard/psychology", Icon: Brain, badge: "BASIC" },
      { label: "Health & Vitality", href: "/dashboard/medical", Icon: ShieldPlus, badge: "ELITE" },
      { label: "Gemstone", href: "/dashboard/gemstone", Icon: Gem, badge: "PRO" },
      { label: "Remedies", href: "/dashboard/remedy", Icon: Leaf, badge: "PRO" },
      { label: "Lal Kitab", href: "/dashboard/lalkitab", Icon: BookOpen, badge: "PRO" },
      { label: "Astro-Vastu", href: "/dashboard/vastu", Icon: HomeIcon, badge: "ELITE" },
      { label: "Astro Tattoo", href: "/dashboard/astro-tattoo", Icon: Sparkles, badge: "ELITE" },
      { label: "Astro Sound", href: "/dashboard/astro-sound", Icon: Music, badge: "ELITE" },
    ],
  },
  {
    label: "Personal Tools",
    items: [
      { label: "Numerology", href: "/dashboard/numerology", Icon: Hash, badge: "PRO" },
      { label: "Palmistry", href: "/dashboard/palmistry", Icon: Hand, badge: "PRO" },
      { label: "Birth Rectification", href: "/dashboard/rectify", Icon: Timer, badge: "ELITE" },
      { label: "History", href: "/dashboard/history", Icon: History, badge: "BASIC" },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { birth } = useUserChart();
  const [mounted, setMounted] = useState(false);
  const userName = mounted && birth.name ? birth.name.split(" ")[0] : "Seeker";
  const { isElite, userTier } = useUserTier();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const checkAdmin = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        if (user?.email && !cancelled) {
          const { isAdminUser } = await import("@/lib/access");
          if (isAdminUser(user.email)) {
            setIsAdmin(true);
          }
        }
      } catch {}
    };
    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, []);


  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearCurrentChart();
    router.push("/login");
  };

  return (
    <aside className="dash-sidebar">
      {/* Logo */}
      <div className="dash-logo" style={{ borderBottomColor: 'var(--al-primary)' }}>

        <div className="dash-logo-gem">✦</div>
        <span className="dash-logo-name">AstroLife</span>
      </div>

      {/* Scrollable nav */}
      <nav className="dash-nav" aria-label="Main navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="dash-nav-section">
            <div className="dash-nav-label" aria-hidden="true">{group.label}</div>
            {group.items.map(({ label, href, Icon, badge }) => (
              <Link
                key={href}
                href={href}
                className={`dash-nav-item${pathname === href ? " active" : ""}`}
                style={pathname === href ? { borderLeftColor: 'var(--al-primary)', color: 'var(--al-primary)' } : undefined}
                aria-current={pathname === href ? "page" : undefined}
              >
                <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
                <span style={{ flex: 1 }}>{label}</span>
                {badge && (
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      padding: "1px 5px",
                      borderRadius: "4px",
                      background: badge === "ELITE"
                        ? "linear-gradient(135deg, rgba(168, 85, 247, 0.25), rgba(192, 132, 252, 0.35))"
                        : badge === "PRO"
                        ? "linear-gradient(135deg, rgba(200, 160, 48, 0.2), rgba(160, 120, 32, 0.3))"
                        : "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.25))",
                      color: badge === "ELITE" ? "#c084fc" : badge === "PRO" ? "#c8a030" : "#16a34a",
                      border: badge === "ELITE"
                        ? "1px solid rgba(168, 85, 247, 0.45)"
                        : badge === "PRO"
                        ? "1px solid rgba(200, 160, 48, 0.35)"
                        : "1px solid rgba(34, 197, 94, 0.3)",
                      lineHeight: "1.3",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    {badge === "ELITE" ? "💎 ELITE" : badge === "PRO" ? "👑 PRO" : badge === "BASIC" ? "🌱 BASIC" : badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Fixed Sidebar Footer: Tier Status & Upgrade */}
      <div style={{ borderTop: "1px solid rgba(184,134,11,0.18)", padding: "10px 14px", flexShrink: 0, background: "rgba(0,0,0,0.02)" }}>
        {isElite ? (
          <div
            style={{
              padding: "7px 12px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(192, 132, 252, 0.18))",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              color: "#c084fc",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <Sparkles size={14} style={{ color: "#c084fc" }} />
            <span>💎 Elite Member</span>
          </div>
        ) : userTier === "premium" ? (
          <div
            style={{
              padding: "7px 12px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, rgba(200, 160, 48, 0.12), rgba(160, 120, 32, 0.18))",
              border: "1px solid rgba(200, 160, 48, 0.35)",
              color: "#c8a030",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            <Sparkles size={14} style={{ color: "#c8a030" }} />
            <span>👑 Pro Member</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div
              style={{
                fontSize: "11px",
                color: "#16a34a",
                padding: "5px 10px",
                borderRadius: "6px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.22)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: 600,
              }}
            >
              <span>🌱</span>
              <span>Basic (The Seed / Beej)</span>
            </div>
            <Link
              href="/dashboard/upgrade"
              className={`dash-nav-item dash-upgrade-item${pathname === "/dashboard/upgrade" ? " active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                background: "linear-gradient(135deg, rgba(200,160,48,0.15), rgba(160,120,32,0.2))",
                border: "1px solid rgba(200,160,48,0.4)",
                color: "#c8a030",
              }}
              aria-current={pathname === "/dashboard/upgrade" ? "page" : undefined}
            >
              <Zap size={14} />
              <span>Upgrade to Pro 👑</span>
            </Link>
          </div>
        )}

        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className={`dash-nav-item${pathname === "/dashboard/admin" ? " active" : ""}`}
            style={{
              marginTop: "6px",
              borderLeftColor: "#eab308",
              color: "#eab308",
              background: pathname === "/dashboard/admin" ? "rgba(234,179,8,0.1)" : "transparent",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 10px",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
            }}
            aria-current={pathname === "/dashboard/admin" ? "page" : undefined}
          >
            <Shield size={14} />
            <span>Admin Panel</span>
          </Link>
        )}
      </div>

      {/* User chip */}
      <div className="dash-user">
        <div className="dash-user-av" suppressHydrationWarning>{userName[0]?.toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
          <span className="dash-user-name" suppressHydrationWarning>{userName}</span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.3px",
              color: isElite ? "#c084fc" : userTier === "premium" ? "#c8a030" : "#16a34a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isElite ? "💎 Elite Member" : userTier === "premium" ? "👑 Pro Plan" : "🌱 Basic (The Seed / Beej)"}
          </span>
        </div>
        <button className="dash-logout" onClick={handleLogout} title="Logout" type="button">
          <LogOut size={15} strokeWidth={1.7} />
        </button>
      </div>
    </aside>
  );
}
