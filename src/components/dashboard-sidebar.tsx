"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, CircleDot, Bot, Radar, Globe, TrendingUp,
  Sparkles, Timer, BarChart3, Grid3x3, Layers, Target,
  Brain, BookOpen, Hash, Calendar, Music, Gem, Home as HomeIcon,
  HeartPulse, HelpCircle, Leaf, Users, FileText, Zap,
  Sunrise, History, Star, HeartHandshake, ShoppingBag, Heart,
  Hand, LogOut, type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clearCurrentChart, useUserChart } from "@/lib/user-chart";

type NavItem = { label: string; href: string; Icon: LucideIcon };

const NAV_CORE: NavItem[] = [
  { label: "Dashboard",   href: "/dashboard",             Icon: LayoutDashboard },
  { label: "My Kundli",   href: "/dashboard/kundli",      Icon: CircleDot       },
  { label: "AI Chat",     href: "/dashboard/chat",        Icon: Bot             },
  { label: "Event Radar", href: "/dashboard/event-radar", Icon: Radar           },
  { label: "Transits",    href: "/dashboard/transits",    Icon: Globe           },
  { label: "Purchase Guide", href: "/dashboard/transit-purchase", Icon: ShoppingBag },
  { label: "Destiny",     href: "/dashboard/destiny",     Icon: TrendingUp      },
];

const NAV_ENGINES: NavItem[] = [
  { label: "Yogas",          href: "/dashboard/yogas",          Icon: Sparkles   },
  { label: "Dasha",          href: "/dashboard/dasha",          Icon: Timer      },
  { label: "Shadbala",       href: "/dashboard/shadbala",       Icon: BarChart3  },
  { label: "Ashtakavarga",   href: "/dashboard/ashtakavarga",   Icon: Grid3x3    },
  { label: "Divisional",     href: "/dashboard/divisional",     Icon: Layers     },
  { label: "KP System",      href: "/dashboard/kp",             Icon: Target     },
  { label: "Psychology",     href: "/dashboard/psychology",     Icon: Brain      },
  { label: "Lal Kitab",      href: "/dashboard/lalkitab",       Icon: BookOpen   },
  { label: "Numerology",     href: "/dashboard/numerology",     Icon: Hash       },
  { label: "Panchang",       href: "/dashboard/panchang",       Icon: Calendar   },
  { label: "Astro Sound",    href: "/dashboard/astro-sound",    Icon: Music      },
  { label: "Gemstone",       href: "/dashboard/gemstone",       Icon: Gem        },
  { label: "Vastu",          href: "/dashboard/vastu",          Icon: HomeIcon   },
  { label: "Kundali Milan",  href: "/dashboard/kundali-milan",  Icon: Users           },
  { label: "Marriage Timing",href: "/dashboard/marriage-timing", Icon: Heart           },
  { label: "Palmistry",      href: "/dashboard/palmistry",       Icon: Hand            },
  { label: "Family Karma",   href: "/dashboard/family-synastry", Icon: HeartHandshake  },
  { label: "Jaimini",        href: "/dashboard/jaimini",        Icon: Star       },
  { label: "Medical",        href: "/dashboard/medical",        Icon: HeartPulse },
  { label: "Prashna",        href: "/dashboard/prashna",        Icon: HelpCircle },
  { label: "Remedy",         href: "/dashboard/remedy",         Icon: Leaf       },
  { label: "Sarvatobhadra",  href: "/dashboard/sarvatobhadra",  Icon: Grid3x3    },
  { label: "Special Lagnas", href: "/dashboard/special-lagnas", Icon: Sunrise    },
  { label: "History",        href: "/dashboard/history",        Icon: History    },
  { label: "Report",         href: "/dashboard/report",         Icon: FileText   },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { birth } = useUserChart();
  const userName = birth.name?.split(" ")[0] || "Seeker";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearCurrentChart();
    router.push("/login");
  };

  return (
    <aside className="dash-sidebar">
      {/* Logo */}
      <div className="dash-logo">
        <div className="dash-logo-gem">✦</div>
        <span className="dash-logo-name">AstroLife</span>
      </div>

      {/* Scrollable nav */}
      <nav className="dash-nav" aria-label="Main navigation">
        <div className="dash-nav-section">
          <div className="dash-nav-label" aria-hidden="true">Core</div>
          {NAV_CORE.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`dash-nav-item${pathname === href ? " active" : ""}`}
              aria-current={pathname === href ? "page" : undefined}
            >
              <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="dash-nav-section">
          <div className="dash-nav-label" aria-hidden="true">Engines</div>
          {NAV_ENGINES.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className={`dash-nav-item${pathname === href ? " active" : ""}`}
              aria-current={pathname === href ? "page" : undefined}
            >
              <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

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
