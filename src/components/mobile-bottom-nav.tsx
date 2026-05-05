"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { icon: "🏠", label: "Home", href: "/dashboard" },
  { icon: "🔯", label: "Charts", href: "/dashboard/kundli" },
  { icon: "🪐", label: "Transits", href: "/dashboard/transits" },
  { icon:"🎵", label:"Astro Sound", href:"/dashboard/astro-sound" },
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
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            position: fixed;
            left: 10px;
            right: 10px;
            bottom: 10px;
            background: rgba(10, 7, 32, 0.96);
            border: 1px solid #1c1840;
            border-radius: 14px;
            padding: 8px 6px calc(8px + env(safe-area-inset-bottom, 0px));
            backdrop-filter: blur(10px);
            z-index: 140;
          }

          .mobile-bottom-nav-item {
            text-decoration: none;
            color: #605890;
            display: flex;
            flex-direction: column;
            align-items: center;
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
            font-size: 10px;
            letter-spacing: 0.2px;
          }
        }
      `}</style>
    </>
  );
}
