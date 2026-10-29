"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { LanguageProvider } from "@/lib/language-context";
import { ChartProvider } from "@/context/ChartContext";
import { LanguageToggle } from "@/components/language-toggle";
import { Menu } from "lucide-react";
import "@/app/dashboard/shared.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <LanguageProvider>
      <ChartProvider>
        <div className="astro-os-root dash-layout">
          <DashboardSidebar
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />

          <div className="dash-main">
            {/* Mobile Top Header Bar (<=1024px) */}
            <div className="dash-mobile-topbar">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(184, 134, 11, 0.25)",
                    borderRadius: "8px",
                    padding: "6px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1A1A1A",
                    cursor: "pointer",
                  }}
                  aria-label="Open Navigation Menu"
                >
                  <Menu size={18} color="#B8860B" />
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#B8860B", fontSize: "14px", fontWeight: 700 }}>✦</span>
                  <span
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontSize: "19px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      letterSpacing: "0.5px",
                    }}
                  >
                    AstroLife
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <LanguageToggle />
              </div>
            </div>

            {/* Desktop Language Toggle - fixed top-right */}
            <div
              className="dash-desktop-lang"
              style={{
                position: "sticky",
                top: 12,
                zIndex: 50,
                justifyContent: "flex-end",
                padding: "0 20px",
                marginBottom: -32,
              }}
            >
              <LanguageToggle />
            </div>
            <div
              className="dash-page-container"
              style={{ minHeight: "100vh" }}
            >
              {children}
            </div>
            <MobileBottomNav />
          </div>
        </div>
      </ChartProvider>
    </LanguageProvider>
  );
}
