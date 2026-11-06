"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — Sacred Om (ॐ) Luxury Glowing Indicator + Top Bar
 * Reassures the user that the next page/engine is loading with the sacred ॐ symbol.
 * Completely safe: listens ONLY to authentic click events on cross-page links.
 * Never listens to touchstart/pointerdown, never blocks user interaction or scrolling.
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

    // Smoothly advance the progress loop
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 45) return prev + 14;
        if (prev < 75) return prev + 7;
        if (prev < 94) return prev + 2;
        return prev;
      });
    }, 120);

    // Safety timeout: auto-hide after 4s
    safetyTimeoutRef.current = setTimeout(() => {
      stopLoading();
    }, 4000);
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

  // Dismiss on route change
  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  // Listen ONLY to authentic clicks on cross-page navigation links
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__startNavigationLoading = startLoading;
      (window as unknown as Record<string, unknown>).__stopNavigationLoading = stopLoading;
    }

    const handleNavigationTrigger = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (!href) return;

        // Ignore external, anchor links, phone, email, or modifier clicks
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

        const currentUrl = window.location.pathname + window.location.search;
        if (href === currentUrl || href === window.location.pathname) {
          return;
        }

        startLoading();
        return;
      }

      const trigger = target.closest("[data-loading-trigger='true']");
      if (trigger) {
        startLoading();
      }
    };

    const handleCustomStart = () => startLoading();
    const handleCustomStop = () => stopLoading();

    // ONLY authentic click — ZERO touch/pointer listeners
    document.addEventListener("click", handleNavigationTrigger, { capture: true });
    window.addEventListener("astrolife:loading:start", handleCustomStart);
    window.addEventListener("astrolife:loading:stop", handleCustomStop);

    return () => {
      document.removeEventListener("click", handleNavigationTrigger, { capture: true });
      window.removeEventListener("astrolife:loading:start", handleCustomStart);
      window.removeEventListener("astrolife:loading:stop", handleCustomStop);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, [startLoading, stopLoading]);

  if (!loading && progress === 0) return null;

  // Compact circular ring parameters
  const circleRadius = 24;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
            boxShadow: "0 0 10px rgba(255, 215, 0, 0.8), 0 0 5px rgba(184, 134, 11, 0.6)",
            transition: "width 0.16s ease, opacity 0.2s ease",
            opacity: progress === 100 ? 0 : 1,
            borderRadius: "0 2px 2px 0",
          }}
        />
      </div>

      {/* ── Center Sacred Om (ॐ) Luxury Feedback Modal ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(10, 8, 6, 0.38)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          pointerEvents: "none", // Never blocks clicks or scroll gestures
          animation: "fadeInOmModal 0.18s ease-out forwards",
        }}
        aria-live="polite"
        aria-busy="true"
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(28, 22, 14, 0.94), rgba(18, 14, 10, 0.96))",
            border: "1px solid rgba(212, 175, 55, 0.4)",
            borderRadius: "18px",
            boxShadow: "0 10px 35px rgba(0, 0, 0, 0.45), 0 0 25px rgba(212, 175, 55, 0.15)",
            animation: "scaleInOmModal 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Circular Glowing Ring with Om in Center */}
          <div
            style={{
              position: "relative",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotate(-90deg)",
              }}
            >
              <defs>
                <linearGradient id="omGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF9E6" />
                  <stop offset="50%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>

              {/* Faint Guide Ring */}
              <circle
                cx="30"
                cy="30"
                r={circleRadius}
                fill="none"
                stroke="rgba(212, 175, 55, 0.2)"
                strokeWidth="2.5"
              />

              {/* Glowing Loop */}
              <circle
                cx="30"
                cy="30"
                r={circleRadius}
                fill="none"
                stroke="url(#omGoldGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition: "stroke-dashoffset 0.14s ease-out",
                }}
              />
            </svg>

            {/* Sacred ॐ Symbol */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                fontSize: "24px",
                lineHeight: 1,
                fontFamily: "'Cormorant Garamond', 'Noto Serif Devanagari', 'Georgia', serif",
                fontWeight: 700,
                background: "linear-gradient(135deg, #FFF9E6 0%, #FFD700 50%, #B8860B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))",
                animation: "omPulse 1.6s ease-in-out infinite",
                userSelect: "none",
              }}
            >
              ॐ
            </div>
          </div>

          {/* Label Below */}
          <div
            style={{
              marginTop: "8px",
              padding: "3px 12px",
              borderRadius: "999px",
              background: "rgba(18, 14, 10, 0.8)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#FFD700",
                boxShadow: "0 0 6px #FFD700",
                animation: "dotBlink 1s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#F5EAD4",
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: "0.3px",
              }}
            >
              खुल रहा है... <span style={{ color: "#FFD700", fontSize: "11px" }}>{Math.min(100, Math.round(progress))}%</span>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInOmModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleInOmModal {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes omPulse {
          0%, 100% { transform: scale(0.96); filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5)); }
          50% { transform: scale(1.06); filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.9)); }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
