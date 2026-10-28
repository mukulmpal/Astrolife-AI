"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — Global Route Transition & Click Loading Indicator
 * Center-of-page Loading Modal (Issue 4):
 * Immediately displays an unmistakable, elegant loading sign in the CENTER of the page
 * whenever any route link, option, or action is clicked, so the user knows immediately
 * that the next window is loading.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setProgress(18);

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    // Increment progress in gentle steps
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 45) return prev + 14;
        if (prev < 75) return prev + 7;
        if (prev < 90) return prev + 2;
        return prev;
      });
    }, 140);

    // Safety timeout: auto-hide after 7 seconds if navigation aborted
    safetyTimeoutRef.current = setTimeout(() => {
      stopLoading();
    }, 7000);
  }, []);

  const stopLoading = useCallback(() => {
    setProgress(100);
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 220);
  }, []);

  // When pathname or searchParams change, the new route has arrived
  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  // Global listener for internal links and click triggers
  useEffect(() => {
    // Expose window helper for programmatic triggers
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__startNavigationLoading = startLoading;
      (window as unknown as Record<string, unknown>).__stopNavigationLoading = stopLoading;
    }

    const handleNavigationTrigger = (e: MouseEvent | PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (!href) return;

        // Ignore external links, anchor links (#), mailto, tel, target="_blank", or modifier clicks
        if (
          href.startsWith("http") &&
          !href.startsWith(window.location.origin)
        ) {
          return;
        }
        if (
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          anchor.target === "_blank" ||
          e.ctrlKey ||
          e.metaKey ||
          e.shiftKey ||
          e.altKey
        ) {
          return;
        }

        // Check if clicking the exact current URL
        const currentUrl = window.location.pathname + window.location.search;
        if (href === currentUrl || href === window.location.pathname) {
          return;
        }

        // It's an internal route change: trigger loading feedback immediately!
        startLoading();
        return;
      }

      // Also check if any button or element has data-loading-trigger
      const trigger = target.closest("[data-loading-trigger='true']");
      if (trigger) {
        startLoading();
      }
    };

    const handleCustomStart = () => startLoading();
    const handleCustomStop = () => stopLoading();

    // Listen on pointerdown for instant zero-latency feedback before click bubble
    document.addEventListener("pointerdown", handleNavigationTrigger, { capture: true });
    document.addEventListener("click", handleNavigationTrigger, { capture: true });
    window.addEventListener("astrolife:loading:start", handleCustomStart);
    window.addEventListener("astrolife:loading:stop", handleCustomStop);

    return () => {
      document.removeEventListener("pointerdown", handleNavigationTrigger, { capture: true });
      document.removeEventListener("click", handleNavigationTrigger, { capture: true });
      window.removeEventListener("astrolife:loading:start", handleCustomStart);
      window.removeEventListener("astrolife:loading:stop", handleCustomStop);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, [startLoading, stopLoading]);

  if (!loading && progress === 0) return null;

  return (
    <>
      {/* ── Top Golden Progress Bar ── */}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          zIndex: 999999,
          pointerEvents: "none",
          background: "transparent",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #996515, #B8860B, #FFD700, #F59E0B)",
            boxShadow: "0 0 12px rgba(255, 215, 0, 0.8), 0 0 6px rgba(184, 134, 11, 0.6)",
            transition: "width 0.16s ease, opacity 0.2s ease",
            opacity: progress === 100 ? 0 : 1,
            borderRadius: "0 2px 2px 0",
          }}
        />
      </div>

      {/* ── Center of Page Loading Modal (Requested: Right in the Centre) ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999998,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(15, 12, 8, 0.32)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          animation: "fadeInBackdrop 0.14s ease-out forwards",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            padding: "24px 34px",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.98)",
            border: "1.5px solid rgba(184, 134, 11, 0.45)",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.28), 0 0 40px rgba(184, 134, 11, 0.25)",
            minWidth: "260px",
            maxWidth: "92vw",
            textAlign: "center",
            animation: "centerScaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Dual spinning gold cosmic loader */}
          <div style={{ position: "relative", width: "46px", height: "46px" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "2.5px dashed rgba(184, 134, 11, 0.35)",
                animation: "spinSlow 6s linear infinite",
              }}
            />
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "46px",
                height: "46px",
                animation: "spinFast 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                color: "#B8860B",
              }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="9.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="26"
                strokeLinecap="round"
                style={{ opacity: 0.25 }}
              />
              <path
                d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: "14px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #B8860B, #FFD700)",
                boxShadow: "0 0 10px rgba(255, 215, 0, 0.8)",
                animation: "pulseCenter 1.2s ease-in-out infinite",
              }}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#1A1A1A",
                letterSpacing: "0.2px",
                lineHeight: 1.3,
              }}
            >
              ✦ खुल रहा है... Loading
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#B8860B",
                fontWeight: 600,
                marginTop: "3px",
              }}
            >
              कृपया प्रतीक्षा करें · Window loading soon...
            </div>
          </div>

          {/* Shimmer progress bar */}
          <div
            style={{
              width: "170px",
              height: "4px",
              background: "rgba(184, 134, 11, 0.15)",
              borderRadius: "999px",
              overflow: "hidden",
              marginTop: "2px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #996515, #B8860B, #FFD700)",
                borderRadius: "999px",
                transition: "width 0.16s ease",
                boxShadow: "0 0 8px rgba(255, 215, 0, 0.8)",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes centerScaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinFast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseCenter {
          0%, 100% { transform: scale(0.85); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </>
  );
}
