"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUserTier } from "@/context/ChartContext";

interface EngineItem {
  icon: string;
  label: string;
  href: string;
  badge?: "BASIC" | "PRO" | "ELITE";
}

const ENGINE_ITEMS: EngineItem[] = [
  // ELITE Tier Engines
  { icon: "🪐", label: "Transits", href: "/dashboard/transits", badge: "ELITE" },
  { icon: "🧩", label: "Divisional Charts", href: "/dashboard/divisional", badge: "ELITE" },
  { icon: "🕉️", label: "Jaimini", href: "/dashboard/jaimini", badge: "ELITE" },
  { icon: "🌿", label: "Health & Vitality", href: "/dashboard/medical", badge: "ELITE" },
  { icon: "💍", label: "Marriage Timing", href: "/dashboard/marriage-timing", badge: "ELITE" },
  { icon: "🤝", label: "Family Karma", href: "/dashboard/family-synastry", badge: "ELITE" },
  { icon: "🧬", label: "Lineage Karma", href: "/dashboard/lineage-karma", badge: "ELITE" },
  { icon: "🏠", label: "Astro-Vastu", href: "/dashboard/vastu", badge: "ELITE" },
  { icon: "✨", label: "Astro Tattoo", href: "/dashboard/astro-tattoo", badge: "ELITE" },
  { icon: "🎵", label: "Astro Sound", href: "/dashboard/astro-sound", badge: "ELITE" },
  { icon: "⏱️", label: "Birth Rectification", href: "/dashboard/rectify", badge: "ELITE" },

  // PRO Tier Engines
  { icon: "🌅", label: "Special Lagnas", href: "/dashboard/special-lagnas", badge: "PRO" },
  { icon: "💎", label: "Gemstone", href: "/dashboard/gemstone", badge: "PRO" },
  { icon: "💊", label: "Remedies", href: "/dashboard/remedy", badge: "PRO" },
  { icon: "📘", label: "Lal Kitab", href: "/dashboard/lalkitab", badge: "PRO" },
  { icon: "🔢", label: "Numerology", href: "/dashboard/numerology", badge: "PRO" },
  { icon: "💑", label: "Kundali Milan", href: "/dashboard/kundali-milan", badge: "PRO" },
  { icon: "🤚", label: "Palmistry", href: "/dashboard/palmistry", badge: "PRO" },
  { icon: "📈", label: "Predictions", href: "/dashboard/destiny", badge: "PRO" },
  { icon: "🛍️", label: "Transit Purchase", href: "/dashboard/transit-purchase", badge: "PRO" },

  // BASIC & Foundational Engines
  { icon: "⚖️", label: "Shadbala", href: "/dashboard/shadbala", badge: "BASIC" },
  { icon: "⏳", label: "Dasha", href: "/dashboard/dasha", badge: "BASIC" },
  { icon: "🧮", label: "Ashtakavarga", href: "/dashboard/ashtakavarga", badge: "BASIC" },
  { icon: "🧠", label: "Psychology", href: "/dashboard/psychology", badge: "BASIC" },
  { icon: "🧭", label: "KP System", href: "/dashboard/kp", badge: "BASIC" },
  { icon: "📡", label: "Event Radar", href: "/dashboard/event-radar", badge: "BASIC" },
  { icon: "❓", label: "Prashna", href: "/dashboard/prashna", badge: "BASIC" },
  { icon: "📅", label: "Panchang", href: "/dashboard/panchang", badge: "BASIC" },
  { icon: "✨", label: "Muhurat", href: "/dashboard/muhurat", badge: "BASIC" },
  { icon: "🔯", label: "Sarvatobhadra", href: "/dashboard/sarvatobhadra", badge: "BASIC" },
  { icon: "🏦", label: "Astro Bank", href: "/dashboard/astro-bank", badge: "BASIC" },
  { icon: "📄", label: "Report", href: "/dashboard/report", badge: "BASIC" },
  { icon: "🤖", label: "AI Astrologer", href: "/dashboard/chat", badge: "BASIC" },
  { icon: "📊", label: "History", href: "/dashboard/history", badge: "BASIC" },
  { icon: "👑", label: "Upgrade Plan", href: "/dashboard/upgrade" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { userTier, isElite } = useUserTier();

  const moreActive = ENGINE_ITEMS.some((item) => pathname === item.href);

  // Dynamic primary items including current Tier / Upgrade quick action
  const tierIcon = isElite ? "💎" : userTier === "premium" ? "👑" : "🌱";
  const tierLabel = isElite ? "Elite" : userTier === "premium" ? "Pro" : "Basic";
  const tierClass = isElite ? "tier-elite" : userTier === "premium" ? "tier-pro" : "tier-basic";

  const primaryItems = [
    { icon: "🏠", label: "Home", href: "/dashboard" },
    { icon: "🔯", label: "Kundali", href: "/dashboard/kundli" },
    { icon: "🧿", label: "Yogas", href: "/dashboard/yogas" },
    {
      icon: tierIcon,
      label: tierLabel,
      href: "/dashboard/upgrade",
      isTier: true,
      customClass: tierClass,
    },
  ];

  return (
    <>
      {open && (
        <button
          className="mobile-more-backdrop"
          aria-label="Close engines menu"
          onClick={() => setOpen(false)}
        />
      )}

      <section id="mobile-more-sheet" className={`mobile-more-sheet ${open ? "open" : ""}`} aria-hidden={!open}>
        {/* Header */}
        <div className="mobile-more-head">
          <div>
            <div className="mobile-more-kicker">AstroLife • 25+ Engines</div>
            <div className="mobile-more-title">Astro Engines</div>
          </div>
          <button className="mobile-more-close" onClick={() => setOpen(false)} aria-label="Close engines menu">
            ✕
          </button>
        </div>

        {/* Mobile Tier Status Card */}
        <div className="mobile-tier-strip">
          {isElite ? (
            <div className="tier-card-mobile elite-card">
              <div className="tcm-badge-row">
                <span className="tcm-badge elite">💎 ELITE MEMBER</span>
                <span className="tcm-tag">Universe Active</span>
              </div>
              <div className="tcm-title">All 25+ Astrology Engines Unlocked</div>
              <p className="tcm-sub">Transits, Jaimini, Medical, Astro-Vastu, Astro Tattoo & priority AI unlocked.</p>
            </div>
          ) : userTier === "premium" ? (
            <div className="tier-card-mobile pro-card">
              <div className="tcm-badge-row">
                <span className="tcm-badge pro">👑 PRO PLAN ACTIVE</span>
                <Link href="/dashboard/upgrade" onClick={() => setOpen(false)} className="tcm-btn elite-btn">
                  Go Elite 💎
                </Link>
              </div>
              <div className="tcm-title">Royal Wisdom & Remedies Unlocked</div>
              <p className="tcm-sub">Special Lagnas, Remedies & Gemstones active. Upgrade to Elite for Transits & Astro-Vastu.</p>
            </div>
          ) : (
            <div className="tier-card-mobile basic-card">
              <div className="tcm-badge-row">
                <span className="tcm-badge basic">🌱 BASIC (THE SEED / BEEJ)</span>
                <Link href="/dashboard/upgrade" onClick={() => setOpen(false)} className="tcm-btn pro-btn">
                  Upgrade 👑
                </Link>
              </div>
              <div className="tcm-title">Foundational Vedic Kundli</div>
              <p className="tcm-sub">Unlock Special Lagnas, Gemstones & Remedies with Pro, or all 25+ engines with Elite.</p>
            </div>
          )}
        </div>

        {/* Engines Grid with Badges */}
        <div className="mobile-more-grid">
          {ENGINE_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-more-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <div className="mobile-more-top-row">
                <span className="mobile-more-icon">{item.icon}</span>
                {item.badge && (
                  <span className={`mobile-badge-pill ${item.badge.toLowerCase()}`}>
                    {item.badge === "ELITE" ? "💎 ELITE" : item.badge === "PRO" ? "👑 PRO" : "🌱 BASIC"}
                  </span>
                )}
              </div>
              <span className="mobile-more-label">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Persistent Bottom Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {primaryItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-bottom-nav-item ${pathname === item.href ? "active" : ""} ${item.customClass || ""}`}
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

        @media (max-width: 1024px) {
          .mobile-more-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 138;
            border: 0;
            background: rgba(0, 0, 0, 0.48);
            backdrop-filter: blur(3px);
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
              var(--app-bg, #FAF7F2);
            box-shadow: none;
            transform: translateY(20px);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.18s ease, transform 0.18s ease;
            padding: max(18px, env(safe-area-inset-top, 0px)) 16px calc(96px + env(safe-area-inset-bottom, 0px));
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
            padding: 4px 2px 14px;
            border-bottom: 1px solid color-mix(in srgb, var(--app-gold, #c8a030) 18%, var(--app-border, #FFFFFF));
          }

          .mobile-more-kicker {
            font-size: 9px;
            letter-spacing: 1.8px;
            text-transform: uppercase;
            color: var(--app-gold, #c8a030);
            font-weight: 700;
          }

          .mobile-more-title {
            margin-top: 3px;
            font-size: 22px;
            font-weight: 700;
            color: var(--app-fg, #1A1A1A);
            line-height: 1.1;
            font-family: "Cormorant Garamond", Georgia, serif;
          }

          .mobile-more-close {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            border: 1px solid var(--app-border, #FFFFFF);
            background: var(--app-card-alt, #FFFFFF);
            color: var(--app-fg, #1A1A1A);
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Mobile Tier Card in Sheet */
          .mobile-tier-strip {
            margin-top: 14px;
            margin-bottom: 8px;
          }

          .tier-card-mobile {
            border-radius: 14px;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .tier-card-mobile.elite-card {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(192, 132, 252, 0.2));
            border: 1px solid rgba(168, 85, 247, 0.4);
          }

          .tier-card-mobile.pro-card {
            background: linear-gradient(135deg, rgba(200, 160, 48, 0.12), rgba(160, 120, 32, 0.18));
            border: 1px solid rgba(200, 160, 48, 0.35);
          }

          .tier-card-mobile.basic-card {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.08), rgba(22, 163, 74, 0.12));
            border: 1px solid rgba(34, 197, 94, 0.28);
          }

          .tcm-badge-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }

          .tcm-badge {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.5px;
            padding: 2px 7px;
            border-radius: 6px;
            line-height: 1.3;
          }

          .tcm-badge.elite {
            color: #a855f7;
            background: rgba(168, 85, 247, 0.18);
            border: 1px solid rgba(168, 85, 247, 0.35);
          }

          .tcm-badge.pro {
            color: #c8a030;
            background: rgba(200, 160, 48, 0.18);
            border: 1px solid rgba(200, 160, 48, 0.35);
          }

          .tcm-badge.basic {
            color: #16a34a;
            background: rgba(34, 197, 94, 0.14);
            border: 1px solid rgba(34, 197, 94, 0.3);
          }

          .tcm-tag {
            font-size: 10px;
            color: #a855f7;
            font-weight: 600;
          }

          .tcm-btn {
            text-decoration: none;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 6px;
            line-height: 1.3;
            transition: opacity 0.15s;
          }

          .tcm-btn.pro-btn {
            background: linear-gradient(135deg, #c8a030, #b08d24);
            color: #FFFFFF;
            box-shadow: 0 2px 6px rgba(200, 160, 48, 0.3);
          }

          .tcm-btn.elite-btn {
            background: linear-gradient(135deg, #a855f7, #9333ea);
            color: #FFFFFF;
            box-shadow: 0 2px 6px rgba(168, 85, 247, 0.3);
          }

          .tcm-title {
            font-family: "Cormorant Garamond", Georgia, serif;
            font-size: 16px;
            font-weight: 700;
            color: var(--app-fg, #1A1A1A);
            line-height: 1.2;
          }

          .tcm-sub {
            font-size: 11px;
            color: var(--app-soft, #5A5248);
            line-height: 1.35;
            margin: 0;
          }

          /* Grid */
          .mobile-more-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: minmax(74px, auto);
            gap: 10px;
            padding: 12px 0 0;
            align-content: start;
          }

          .mobile-more-item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-between;
            gap: 6px;
            min-height: 74px;
            padding: 10px 10px;
            border: 1px solid var(--app-border, #EAE5DE);
            border-radius: 12px;
            background: var(--app-card, #FFFFFF);
            color: var(--app-soft, #4A4238);
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            line-height: 1.2;
            transition: border-color 0.15s, background-color 0.15s;
          }

          .mobile-more-item.active {
            color: var(--app-gold, #c8a030);
            border-color: color-mix(in srgb, var(--app-gold, #c8a030) 40%, transparent);
            background: color-mix(in srgb, var(--app-gold, #c8a030) 10%, #FFFFFF);
          }

          .mobile-more-top-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .mobile-more-icon {
            width: 32px;
            height: 32px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: color-mix(in srgb, var(--app-gold, #c8a030) 10%, transparent);
            text-align: center;
            font-size: 18px;
            flex-shrink: 0;
          }

          .mobile-badge-pill {
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 0.3px;
            padding: 1px 5px;
            border-radius: 4px;
            line-height: 1.3;
            white-space: nowrap;
          }

          .mobile-badge-pill.elite {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(192, 132, 252, 0.28));
            color: #a855f7;
            border: 1px solid rgba(168, 85, 247, 0.38);
          }

          .mobile-badge-pill.pro {
            background: linear-gradient(135deg, rgba(200, 160, 48, 0.18), rgba(160, 120, 32, 0.25));
            color: #c8a030;
            border: 1px solid rgba(200, 160, 48, 0.35);
          }

          .mobile-badge-pill.basic {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.14), rgba(22, 163, 74, 0.22));
            color: #16a34a;
            border: 1px solid rgba(34, 197, 94, 0.3);
          }

          .mobile-more-label {
            font-size: 11.5px;
            font-weight: 600;
            line-height: 1.2;
            color: var(--app-fg, #1A1A1A);
          }

          /* Bottom Nav Bar */
          .mobile-bottom-nav {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 4px;
            position: fixed;
            left: 10px;
            right: 10px;
            bottom: 10px;
            background: color-mix(in srgb, var(--app-card-alt, #FAF7F2) 96%, transparent);
            border: 1px solid rgba(184, 134, 11, 0.22);
            border-radius: 14px;
            padding: 6px 4px calc(6px + env(safe-area-inset-bottom, 0px));
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 140;
            box-sizing: border-box;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
          }

          .mobile-bottom-nav-item {
            appearance: none;
            -webkit-appearance: none;
            text-decoration: none;
            color: var(--app-soft, #6B635B);
            display: flex;
            width: 100%;
            height: 44px;
            min-width: 0;
            min-height: 44px;
            max-height: 44px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2px;
            padding: 3px 2px;
            border-radius: 9px;
            border: 0;
            background: transparent;
            font-family: inherit;
            font-size: 9px;
            line-height: 1;
            text-align: center;
            box-sizing: border-box;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.15s;
          }

          .mobile-bottom-nav-item.active {
            color: var(--app-gold-strong, #c8a030);
            background: color-mix(in srgb, var(--app-gold, #c8a030) 14%, transparent);
            font-weight: 700;
          }

          .mobile-bottom-nav-item.tier-basic {
            color: #16a34a;
          }
          .mobile-bottom-nav-item.tier-pro {
            color: #c8a030;
          }
          .mobile-bottom-nav-item.tier-elite {
            color: #a855f7;
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
            font-weight: 600;
          }
        }
      `}</style>
    </>
  );
}
