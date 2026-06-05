"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PRIMARY_ITEMS = [
  { icon: "🏠", label: "Home", href: "/dashboard" },
  { icon: "🔯", label: "Kundali", href: "/dashboard/kundli" },
  { icon: "📊", label: "History", href: "/dashboard/history" },
  { icon: "🧿", label: "Yogas", href: "/dashboard/yogas" },
];

const ENGINE_ITEMS = [
  { icon: "🪐", label: "Transits", href: "/dashboard/transits" },
  { icon: "⚖️", label: "Shadbala", href: "/dashboard/shadbala" },
  { icon: "📘", label: "Lal Kitab", href: "/dashboard/lalkitab" },
  { icon: "🧠", label: "Psychology", href: "/dashboard/psychology" },
  { icon: "⏳", label: "Dasha", href: "/dashboard/dasha" },
  { icon: "🌅", label: "Special Lagnas", href: "/dashboard/special-lagnas" },
  { icon: "🧮", label: "Ashtakavarga", href: "/dashboard/ashtakavarga" },
  { icon: "🧩", label: "Divisional", href: "/dashboard/divisional" },
  { icon: "🔢", label: "Numerology", href: "/dashboard/numerology" },
  { icon: "💑", label: "Kundali Milan", href: "/dashboard/kundali-milan" },
  { icon: "💍", label: "Marriage Timing", href: "/dashboard/marriage-timing" },
  { icon: "🤚", label: "Palmistry", href: "/dashboard/palmistry" },
  { icon: "🧭", label: "KP System", href: "/dashboard/kp" },
  { icon: "📡", label: "Event Radar", href: "/dashboard/event-radar" },
  { icon: "📅", label: "Panchang", href: "/dashboard/panchang" },
  { icon: "🌿", label: "Health & Vitality", href: "/dashboard/medical" },
  { icon: "🎵", label: "Astro Sound", href: "/dashboard/astro-sound" },
  { icon: "💎", label: "Gemstone", href: "/dashboard/gemstone" },
  { icon: "🕉️", label: "Jaimini", href: "/dashboard/jaimini" },
  { icon: "❓", label: "Prashna", href: "/dashboard/prashna" },
  { icon: "💊", label: "Remedy", href: "/dashboard/remedy" },
  { icon: "🔯", label: "Sarvatobhadra", href: "/dashboard/sarvatobhadra" },
  { icon: "🏠", label: "Vastu", href: "/dashboard/vastu" },
  { icon: "📄", label: "Report", href: "/dashboard/report" },
  { icon: "🤖", label: "Chat", href: "/dashboard/chat" },
  { icon: "💎", label: "Upgrade", href: "/dashboard/upgrade" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const moreActive = ENGINE_ITEMS.some((item) => pathname === item.href);

  return (
    <>
      {open && (
        <button className="mobile-more-backdrop" aria-label="Close engines menu" onClick={() => setOpen(false)} />
      )}
      <section id="mobile-more-sheet" className={`mobile-more-sheet ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-more-head">
          <div>
            <div className="mobile-more-kicker">AstroLife</div>
            <div className="mobile-more-title">Astro Tool Engines</div>
          </div>
          <button className="mobile-more-close" onClick={() => setOpen(false)} aria-label="Close engines menu">
            ✕
          </button>
        </div>
        <div className="mobile-more-grid">
          {ENGINE_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-more-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="mobile-more-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {PRIMARY_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-bottom-nav-item ${pathname === item.href ? "active" : ""}`}
          >
            <span className="mobile-bottom-nav-icon">{item.icon}</span>
            <span className="mobile-bottom-nav-label">{item.label}</span>
          </Link>
        ))}
        <button
          type="button"
          className={`mobile-bottom-nav-item more ${moreActive || open ? "active" : ""}`}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-more-sheet"
        >
          <span className="mobile-bottom-nav-icon">☷</span>
          <span className="mobile-bottom-nav-label">More</span>
        </button>
      </nav>
      <style jsx>{`
        .mobile-bottom-nav {
          display: none;
        }
        .mobile-more-backdrop,
        .mobile-more-sheet {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-more-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 138;
            border: 0;
            background: rgba(0, 0, 0, 0.44);
            backdrop-filter: blur(2px);
          }

          .mobile-more-sheet {
            display: block;
            position: fixed;
            inset: 0;
            height: 100dvh;
            overflow-y: auto;
            z-index: 150;
            border: 0;
            border-radius: 0;
            background:
              radial-gradient(circle at 80% -10%, color-mix(in srgb, var(--app-gold, #c8a030) 12%, transparent), transparent 34%),
              var(--app-bg, #060410);
            box-shadow: none;
            transform: translateY(20px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.18s ease, transform 0.18s ease;
            padding: max(18px, env(safe-area-inset-top, 0px)) 16px calc(92px + env(safe-area-inset-bottom, 0px));
          }

          .mobile-more-sheet.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .mobile-more-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 4px 2px 16px;
            border-bottom: 1px solid color-mix(in srgb, var(--app-gold, #c8a030) 18%, var(--app-border, #1c1840));
          }

          .mobile-more-kicker {
            font-size: 9px;
            letter-spacing: 1.8px;
            text-transform: uppercase;
            color: var(--app-gold, #c8a030);
          }

          .mobile-more-title {
            margin-top: 4px;
            font-size: 24px;
            font-weight: 700;
            color: var(--app-fg, #f0e8d0);
            line-height: 1.1;
            font-family: "Cormorant Garamond", Georgia, serif;
          }

          .mobile-more-close {
            width: 42px;
            height: 42px;
            border-radius: 10px;
            border: 1px solid var(--app-border, #1c1840);
            background: var(--app-card-alt, #0a0720);
            color: var(--app-fg, #f0e8d0);
            font-size: 14px;
          }

          .mobile-more-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: minmax(72px, auto);
            gap: 12px;
            padding: 18px 0 0;
            min-height: calc(100dvh - 160px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
            align-content: start;
          }

          .mobile-more-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 7px;
            min-height: 72px;
            padding: 12px 8px;
            border: 1px solid var(--app-border, #1c1840);
            border-radius: 14px;
            background: var(--app-card-alt, #0a0720);
            color: var(--app-soft, #c8c0a8);
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            line-height: 1.15;
            text-align: center;
          }

          .mobile-more-item.active {
            color: var(--app-gold, #c8a030);
            border-color: color-mix(in srgb, var(--app-gold, #c8a030) 35%, transparent);
            background: color-mix(in srgb, var(--app-gold, #c8a030) 12%, var(--app-card-alt, #0a0720));
          }

          .mobile-more-icon {
            width: 34px;
            height: 34px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            background: color-mix(in srgb, var(--app-gold, #c8a030) 10%, transparent);
            text-align: center;
            font-size: 19px;
            flex-shrink: 0;
          }

          .mobile-bottom-nav {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 5px;
            position: fixed;
            left: 10px;
            right: 10px;
            bottom: 10px;
            background: color-mix(in srgb, var(--app-card-alt, #0a0720) 96%, transparent);
            border: 1px solid var(--app-border, #1c1840);
            border-radius: 14px;
            padding: 8px 6px calc(8px + env(safe-area-inset-bottom, 0px));
            backdrop-filter: blur(10px);
            z-index: 140;
            box-sizing: border-box;
          }

          .mobile-bottom-nav-item {
            appearance: none;
            -webkit-appearance: none;
            text-decoration: none;
            color: var(--app-muted, #605890);
            display: flex;
            width: 100%;
            height: 46px;
            min-width: 0;
            min-height: 46px;
            max-height: 46px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            padding: 4px 2px;
            border-radius: 10px;
            border: 0;
            background: transparent;
            font-family: inherit;
            font-size: 9px;
            line-height: 1;
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
          }

          .mobile-bottom-nav-item.active {
            color: var(--app-gold, #c8a030);
            background: color-mix(in srgb, var(--app-gold, #c8a030) 12%, transparent);
          }

          .mobile-bottom-nav-icon {
            display: block;
            width: 20px;
            height: 18px;
            font-size: 16px;
            line-height: 1;
            text-align: center;
          }

          .mobile-bottom-nav-label {
            display: block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 9px;
            letter-spacing: 0.2px;
            line-height: 1.1;
          }
        }
      `}</style>
    </>
  );
}
