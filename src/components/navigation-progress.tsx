"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — Global Route Transition & Click Loading Indicator
 * Solves Issue 4: Immediately displays glowing top progress bar and floating
 * "खुल रहा है... Loading..." pill whenever any route link or action is clicked,
 * so the user always has instant, unmistakable visual feedback.
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
    setProgress(15);

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    // Increment progress in gentle steps
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 12;
        if (prev < 70) return prev + 6;
        if (prev < 88) return prev + 2;
        return prev;
      });
    }, 150);

    // Safety timeout: auto-hide after 8 seconds if navigation aborted
    safetyTimeoutRef.current = setTimeout(() => {
      stopLoading();
    }, 8000);
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
    }, 250);
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

    const handleClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor) {
        // Also check if element or its parent explicitly requests loading feedback
        const trigger = target.closest("[data-loading-trigger='true']");
        if (trigger) {
          startLoading();
        }
        return;
      }

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

      // If it's an internal route change, trigger loading feedback immediately!
      startLoading();
    };

    const handleCustomStart = () => startLoading();
    const handleCustomStop = () => stopLoading();

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("astrolife:loading:start", handleCustomStart);
    window.addEventListener("astrolife:loading:stop", handleCustomStop);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
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
            boxShadow: "0 0 10px rgba(255, 215, 0, 0.7), 0 0 5px rgba(184, 134, 11, 0.5)",
            transition: "width 0.18s ease, opacity 0.2s ease",
            opacity: progress === 100 ? 0 : 1,
            borderRadius: "0 2px 2px 0",
          }}
        />
      </div>

      {/* ── Floating Tactile Pill: खुल रहा है... Loading... ── */}
      <div
        style={{
          position: "fixed",
          top: "14px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 999998,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "999px",
          background: "rgba(255, 255, 255, 0.96)",
          border: "1px solid rgba(184, 134, 11, 0.4)",
          boxShadow: "0 4px 20px rgba(184, 134, 11, 0.18), 0 2px 6px rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(8px)",
          fontSize: "12px",
          fontWeight: 700,
          color: "#1A1A1A",
          animation: "fadeInDown 0.15s ease-out forwards",
        }}
      >
        <svg
          style={{
            width: "14px",
            height: "14px",
            animation: "spin 0.8s linear infinite",
            color: "#B8860B",
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="32"
            strokeLinecap="round"
            style={{ opacity: 0.25 }}
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <span style={{ color: "#B8860B", letterSpacing: "0.2px" }}>
          खुल रहा है...
        </span>
        <span style={{ fontSize: "11px", color: "#6B635B", fontWeight: 500 }}>
          Loading...
        </span>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translate(-50%, -8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

