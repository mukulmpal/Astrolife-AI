"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, CircleDot, Bot, Radar, Globe, TrendingUp,
  Sparkles, Timer, BarChart3, Grid3x3, Layers, Target,
  Brain, BookOpen, Hash, Calendar, Music, Gem, Home as HomeIcon,
  HelpCircle, Leaf, Users, FileText, Zap, ShieldPlus,
  Sunrise, History, Star, HeartHandshake, ShoppingBag, Heart,
  Hand, LogOut, type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clearCurrentChart, useUserChart } from "@/lib/user-chart";
import { useCurrentTheme } from "@/hooks/use-current-theme";

type NavItem = { label: string; href: string; Icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

/**
 * Sidebar grouping per the AstroLife product picture:
 * Overview → Birth Chart Foundation → Prediction & Timing →
 * Life Areas → Remedies & Guidance → Reports & Tools.
 * Routes, labels and icons are preserved — only the order
 * and grouping changes.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard",        Icon: LayoutDashboard },
      { label: "My Kundli", href: "/dashboard/kundli", Icon: CircleDot       },
    ],
  },
  {
    label: "Birth Chart Foundation",
    items: [
      { label: "Yogas",          href: "/dashboard/yogas",          Icon: Sparkles  },
      { label: "Dasha",          href: "/dashboard/dasha",          Icon: Timer     },
      { label: "Shadbala",       href: "/dashboard/shadbala",       Icon: BarChart3 },
      { label: "Ashtakavarga",   href: "/dashboard/ashtakavarga",   Icon: Grid3x3   },
      { label: "Divisional",     href: "/dashboard/divisional",     Icon: Layers    },
      { label: "Special Lagnas", href: "/dashboard/special-lagnas", Icon: Sunrise   },
    ],
  },
  {
    label: "Prediction & Timing",
    items: [
      { label: "Transits",       href: "/dashboard/transits",         Icon: Globe       },
      { label: "Event Radar",    href: "/dashboard/event-radar",      Icon: Radar       },
      { label: "KP System",      href: "/dashboard/kp",               Icon: Target      },
      { label: "Jaimini",        href: "/dashboard/jaimini",          Icon: Star        },
      { label: "Prashna",        href: "/dashboard/prashna",          Icon: HelpCircle  },
      { label: "Sarvatobhadra",  href: "/dashboard/sarvatobhadra",    Icon: Grid3x3     },
    ],
  },
  {
    label: "Life Areas",
    items: [
      { label: "Destiny",         href: "/dashboard/destiny",         Icon: TrendingUp      },
      { label: "Psychology",      href: "/dashboard/psychology",      Icon: Brain           },
      { label: "Health & Vitality", href: "/dashboard/medical",       Icon: ShieldPlus      },
      { label: "Marriage Timing", href: "/dashboard/marriage-timing", Icon: Heart           },
      { label: "Kundali Milan",   href: "/dashboard/kundali-milan",   Icon: Users           },
      { label: "Family Karma",    href: "/dashboard/family-synastry", Icon: HeartHandshake  },
      { label: "Numerology",      href: "/dashboard/numerology",      Icon: Hash            },
    ],
  },
  {
    label: "Remedies & Guidance",
    items: [
      { label: "Lal Kitab",    href: "/dashboard/lalkitab",    Icon: BookOpen },
      { label: "Remedy",       href: "/dashboard/remedy",      Icon: Leaf     },
      { label: "Gemstone",     href: "/dashboard/gemstone",    Icon: Gem      },
      { label: "Vastu",        href: "/dashboard/vastu",       Icon: HomeIcon },
      { label: "Astro Sound",  href: "/dashboard/astro-sound", Icon: Music    },
      { label: "Panchang",     href: "/dashboard/panchang",    Icon: Calendar },
    ],
  },
  {
    label: "Reports & Tools",
    items: [
      { label: "AI Chat",         href: "/dashboard/chat",             Icon: Bot         },
      { label: "Palmistry",       href: "/dashboard/palmistry",        Icon: Hand        },
      { label: "Report",          href: "/dashboard/report",           Icon: FileText    },
      { label: "Purchase Guide",  href: "/dashboard/transit-purchase", Icon: ShoppingBag },
      { label: "History",         href: "/dashboard/history",          Icon: History     },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { birth } = useUserChart();
  const userName = birth.name?.split(" ")[0] || "Seeker";
  const theme = useCurrentTheme();

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
            {group.items.map(({ label, href, Icon }) => (
              <Link
                key={href}
                href={href}
                className={`dash-nav-item${pathname === href ? " active" : ""}`}
                style={pathname === href ? { borderLeftColor: 'var(--al-primary)', color: 'var(--al-primary)' } : undefined}
                aria-current={pathname === href ? "page" : undefined}
              >
                <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        ))}

        <div className="dash-nav-section">
          <Link
            href="/dashboard/upgrade"
            className={`dash-nav-item dash-upgrade-item${pathname === "/dashboard/upgrade" ? " active" : ""}`}
            aria-current={pathname === "/dashboard/upgrade" ? "page" : undefined}
          >
            <Zap size={15} strokeWidth={1.7} aria-hidden="true" />
            <span>Upgrade to Premium</span>
          </Link>
        </div>
      </nav>

      {/* User chip */}
      <div className="dash-user">
        <div className="dash-user-av">{userName[0]?.toUpperCase()}</div>
        <span className="dash-user-name">{userName}</span>
        <button className="dash-logout" onClick={handleLogout} title="Logout" type="button">
          <LogOut size={15} strokeWidth={1.7} />
        </button>
      </div>
    </aside>
  );
}
