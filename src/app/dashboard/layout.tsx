"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { LanguageProvider } from "@/lib/language-context";
import { LanguageToggle } from "@/components/language-toggle";
import { HindiDomTranslator } from "@/components/hindi-dom-translator";
import "@/app/dashboard/shared.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <LanguageProvider>
      <HindiDomTranslator />
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ minHeight: "100vh" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        <MobileBottomNav />
      </div>
    </LanguageProvider>
  );
}
