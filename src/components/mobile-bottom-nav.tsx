"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { icon: "🏠", label: "Home", href: "/dashboard" },
  { icon: "🔯", label: "Kundli", href: "/dashboard/kundli" },
  { icon: "🪐", label: "Transits", href: "/dashboard/transits" },
  { icon: "🧿", label: "Yogas", href: "/dashboard/yogas" },
  { icon: "⚖️", label: "Shadbala", href: "/dashboard/shadbala" },
  { icon: "📘", label: "Lal Kitab", href: "/dashboard/lalkitab" },
  { icon: "🧠", label: "Mind", href: "/dashboard/psychology" },
  { icon: "📈", label: "Destiny", href: "/dashboard/destiny" },
  { icon: "⏳", label: "Dasha", href: "/dashboard/dasha" },
  { icon: "🌅", label: "Lagnas", href: "/dashboard/special-lagnas" },
  { icon: "🧮", label: "Ashtak", href: "/dashboard/ashtakavarga" },
  { icon: "🧩", label: "Varga", href: "/dashboard/divisional" },
  { icon: "🔢", label: "Numbers", href: "/dashboard/numerology" },
  { icon: "💑", label: "Milan", href: "/dashboard/kundali-milan" },
  { icon: "🧭", label: "KP", href: "/dashboard/kp" },
  { icon: "📡", label: "Radar", href: "/dashboard/event-radar" },
  { icon: "📅", label: "Panchang", href: "/dashboard/panchang" },
  { icon:"🎵", label:"Astro Sound", href:"/dashboard/astro-sound" },
  { icon:"💎", label:"Gems", href:"/dashboard/gemstone" },
  { icon: "🏠", label: "Vastu", href: "/dashboard/vastu" },
  { icon: "📄", label: "Report", href: "/dashboard/report" },
  { icon: "🤖", label: "Chat", href: "/dashboard/chat" },
  { icon: "💎", label: "Upgrade", href: "/dashboard/upgrade" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-bottom-nav-item ${pathname === item.href ? "active" : ""}`}
          >
            <span className="mobile-bottom-nav-icon">{item.icon}</span>
            <span className="mobile-bottom-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
      <style jsx>{`
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            gap: 4px;
            position: fixed;
            left: 10px;
            right: 10px;
            bottom: 10px;
            overflow-x: auto;
            background: rgba(10, 7, 32, 0.96);
            border: 1px solid #1c1840;
            border-radius: 14px;
            padding: 8px 6px calc(8px + env(safe-area-inset-bottom, 0px));
            backdrop-filter: blur(10px);
            z-index: 140;
            scrollbar-width: none;
          }

          .mobile-bottom-nav::-webkit-scrollbar {
            display: none;
          }

          .mobile-bottom-nav-item {
            text-decoration: none;
            color: #605890;
            display: flex;
            flex: 0 0 58px;
            min-height: 44px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            padding: 5px 2px;
            border-radius: 10px;
          }

          .mobile-bottom-nav-item.active {
            color: #c8a030;
            background: rgba(200, 160, 48, 0.1);
          }

          .mobile-bottom-nav-icon {
            font-size: 16px;
            line-height: 1;
          }

          .mobile-bottom-nav-label {
            font-size: 9px;
            letter-spacing: 0.2px;
          }
        }
      `}</style>
    </>
  );
}
