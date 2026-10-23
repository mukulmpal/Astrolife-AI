"use client";

import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { LanguageProvider } from "@/lib/language-context";
import { ChartProvider } from "@/context/ChartContext";
import { LanguageToggle } from "@/components/language-toggle";
import "@/app/dashboard/shared.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <LanguageProvider>
      <ChartProvider>
        <div className="astro-os-root dash-layout">
          <DashboardSidebar />
          <div className="dash-main">
            {/* Language Toggle - fixed top-right */}
            <div style={{
              position: "sticky", top: 12, zIndex: 50,
              display: "flex", justifyContent: "flex-end",
              padding: "0 20px", marginBottom: -32,
            }}>
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
