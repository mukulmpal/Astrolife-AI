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
      { label: "My Kundli", href: "/dashboard/kundli", Icon: CircleDot       },
      { label: "Astro Bank", href: "/dashboard/astro-bank", Icon: Database   },
      { label: "AI Astrologer", href: "/dashboard/chat", Icon: Bot },
      { label: "Predictions", href: "/dashboard/destiny", Icon: TrendingUp, badge: "PRO" },
      { label: "Report", href: "/dashboard/report", Icon: FileText },
    ],
  },
  {
    label: "Relationships",
    items: [
      { label: "Kundali Milan",   href: "/dashboard/kundali-milan",   Icon: Users, badge: "PRO" },
      { label: "Marriage Timing", href: "/dashboard/marriage-timing", Icon: Heart           },
      { label: "Family Karma",    href: "/dashboard/family-synastry", Icon: HeartHandshake  },
    ],
  },
  {
    label: "Prediction & Timing",
    items: [
      { label: "Dasha", href: "/dashboard/dasha", Icon: Timer },
      { label: "Transits", href: "/dashboard/transits", Icon: Globe },
      { label: "Event Radar", href: "/dashboard/event-radar", Icon: Radar },
      { label: "KP", href: "/dashboard/kp", Icon: Target },
      { label: "Prashna", href: "/dashboard/prashna", Icon: HelpCircle },
      { label: "Panchang", href: "/dashboard/panchang", Icon: Calendar },
      { label: "Muhurat", href: "/dashboard/muhurat", Icon: Sparkles },
      { label: "Transit Purchase", href: "/dashboard/transit-purchase", Icon: ShoppingBag, badge: "PRO" },
    ],
  },
  {
    label: "Chart Intelligence",
    items: [
      { label: "Yogas", href: "/dashboard/yogas", Icon: Sparkles },
      { label: "Shadbala", href: "/dashboard/shadbala", Icon: BarChart3 },
      { label: "Ashtakavarga", href: "/dashboard/ashtakavarga", Icon: Grid3x3 },
      { label: "Divisional Charts", href: "/dashboard/divisional", Icon: Layers },
      { label: "Special Lagnas", href: "/dashboard/special-lagnas", Icon: Sunrise },
      { label: "Jaimini", href: "/dashboard/jaimini", Icon: Star },
      { label: "Sarvatobhadra", href: "/dashboard/sarvatobhadra", Icon: Grid3x3 },
    ],
  },
  {
    label: "Wellness & Remedies",
    items: [
      { label: "Lineage Karma", href: "/dashboard/lineage-karma", Icon: Dna },
      { label: "Psychology", href: "/dashboard/psychology", Icon: Brain },
      { label: "Health & Vitality", href: "/dashboard/medical", Icon: ShieldPlus },
      { label: "Gemstone", href: "/dashboard/gemstone", Icon: Gem },
      { label: "Remedies", href: "/dashboard/remedy", Icon: Leaf },
      { label: "Lal Kitab", href: "/dashboard/lalkitab", Icon: BookOpen, badge: "PRO" },
      { label: "Astro-Vastu (Hit Theory)", href: "/dashboard/vastu", Icon: HomeIcon, badge: "PRO" },
      { label: "Astro Sound", href: "/dashboard/astro-sound", Icon: Music },
    ],
  },
  {
    label: "Personal Tools",
    items: [
      { label: "Numerology", href: "/dashboard/numerology", Icon: Hash },
      { label: "Palmistry", href: "/dashboard/palmistry", Icon: Hand, badge: "PRO" },
      { label: "Birth Rectification", href: "/dashboard/rectify", Icon: Timer },
      { label: "History", href: "/dashboard/history", Icon: History },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { birth } = useUserChart();
  const [mounted, setMounted] = useState(false);
  const userName = mounted && birth.name ? birth.name.split(" ")[0] : "Seeker";
  const { isElite } = useUserTier();
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
                      background: "linear-gradient(135deg, rgba(200, 160, 48, 0.2), rgba(160, 120, 32, 0.3))",
                      color: "#c8a030",
                      border: "1px solid rgba(200, 160, 48, 0.35)",
                      lineHeight: "1.3",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}

        <div className="dash-nav-section">
          {isElite ? (
            <div
              className="dash-nav-item"
              style={{
                color: "#c084fc",
                borderLeftColor: "#a855f7",
                background: "rgba(168,85,247,0.08)",
                cursor: "default",
              }}
            >
              <Sparkles size={15} strokeWidth={1.7} aria-hidden="true" style={{ color: "#c084fc" }} />
              <span style={{ fontWeight: 600 }}>✦ Elite Member</span>
            </div>
          ) : (
            <Link
              href="/dashboard/upgrade"
              className={`dash-nav-item dash-upgrade-item${pathname === "/dashboard/upgrade" ? " active" : ""}`}
              aria-current={pathname === "/dashboard/upgrade" ? "page" : undefined}
            >
              <Zap size={15} strokeWidth={1.7} aria-hidden="true" />
              <span>Upgrade to Premium</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              href="/dashboard/admin"
              className={`dash-nav-item${pathname === "/dashboard/admin" ? " active" : ""}`}
              style={
                pathname === "/dashboard/admin"
                  ? { borderLeftColor: "#eab308", color: "#eab308", background: "rgba(234,179,8,0.1)" }
                  : { color: "#eab308" }
              }
              aria-current={pathname === "/dashboard/admin" ? "page" : undefined}
            >
              <Shield size={15} strokeWidth={1.7} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>Admin Panel</span>
            </Link>
          )}
        </div>
      </nav>



      {/* User chip */}
      <div className="dash-user">
        <div className="dash-user-av" suppressHydrationWarning>{userName[0]?.toUpperCase()}</div>
        <span className="dash-user-name" suppressHydrationWarning>{userName}</span>
        <button className="dash-logout" onClick={handleLogout} title="Logout" type="button">
          <LogOut size={15} strokeWidth={1.7} />
        </button>
      </div>
    </aside>
  );
}
