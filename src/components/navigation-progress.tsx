"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — Sacred Om (ॐ) Compact Glowing Loop Indicator
 * Sleek, refined, compact luxury jewel in the center of the screen.
 * Traces a 360° golden parikrama loop around the sacred ॐ symbol as pages load.
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

    // Smoothly advance the circular loop
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 15;
        if (prev < 70) return prev + 8;
        if (prev < 92) return prev + 3;
        return prev;
      });
    }, 130);

    // Safety timeout: auto-hide after 6.5s if navigation stalled
    safetyTimeoutRef.current = setTimeout(() => {
      stopLoading();
    }, 6500);
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

  // Global instantaneous click/touch listener
  useEffect(() => {
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

        // Ignore external, hash, tel, mailto, target="_blank", or modifier clicks
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

      // Check if clicked element or button requests loading feedback
      const trigger = target.closest("[data-loading-trigger='true']");
      if (trigger) {
        startLoading();
      }
    };

    const handleCustomStart = () => startLoading();
    const handleCustomStop = () => stopLoading();

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

  // Circumference for compact r=23: 2 * Math.PI * 23 ≈ 144.51
  const circleRadius = 23;
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

      {/* ── Center Sacred ॐ Glowing Loop Modal (Compact & Sleek) ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999998,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(10, 8, 5, 0.16)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
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
            animation: "omScaleIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Compact Sacred Circular Medallion (58px x 58px) */}
          <div
            style={{
              position: "relative",
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(28, 22, 16, 0.96) 0%, rgba(14, 11, 8, 0.98) 100%)",
              border: "1px solid rgba(212, 175, 55, 0.35)",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.45), 0 0 20px rgba(212, 175, 55, 0.25), inset 0 0 10px rgba(184, 134, 11, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* SVG Glowing Progress Loop */}
            <svg
              width="58"
              height="58"
              viewBox="0 0 58 58"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: "rotate(-90deg)",
              }}
            >
              <defs>
                <linearGradient id="omLoopGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF4B8" />
                  <stop offset="40%" stopColor="#FFD700" />
                  <stop offset="75%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <filter id="omLoopGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faint Guide Ring */}
              <circle
                cx="29"
                cy="29"
                r={circleRadius}
                fill="none"
                stroke="rgba(212, 175, 55, 0.18)"
                strokeWidth="2.2"
              />

              {/* Glowing Loop that completes with progress */}
              <circle
                cx="29"
                cy="29"
                r={circleRadius}
                fill="none"
                stroke="url(#omLoopGold)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                filter="url(#omLoopGlow)"
                style={{
                  transition: "stroke-dashoffset 0.16s ease-out",
                }}
              />
            </svg>

            {/* Continuous Orbital Radiant Parikrama Aura */}
            <div
              style={{
                position: "absolute",
                inset: "1.5px",
                borderRadius: "50%",
                border: "1.8px solid transparent",
                borderTopColor: "rgba(255, 215, 0, 0.95)",
                borderRightColor: "rgba(212, 175, 55, 0.4)",
                animation: "parikramaSpin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                filter: "drop-shadow(0 0 5px rgba(255, 215, 0, 0.8))",
                pointerEvents: "none",
              }}
            />

            {/* Sacred ॐ Symbol in Center */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                fontSize: "22px",
                lineHeight: 1,
                fontFamily: "'Cormorant Garamond', 'Noto Serif Devanagari', 'Georgia', serif",
                fontWeight: 700,
                background: "linear-gradient(135deg, #FFF9E6 0%, #FFD700 45%, #D4AF37 75%, #B8860B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))",
                animation: "omBreathing 1.8s ease-in-out infinite",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              ॐ
            </div>
          </div>

          {/* Compact Pill Label Below */}
          <div
            style={{
              marginTop: "8px",
              padding: "3px 10px",
              borderRadius: "999px",
              background: "rgba(20, 16, 12, 0.85)",
              border: "1px solid rgba(212, 175, 55, 0.28)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "5px",
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
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.3px",
                color: "#F5EAD4",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              खुल रहा है... <span style={{ color: "#D4AF37", fontSize: "10px" }}>{Math.min(100, Math.round(progress))}%</span>
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes omScaleIn {
          from { opacity: 0; transform: scale(0.88); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes parikramaSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes omBreathing {
          0%, 100% { transform: scale(0.96); filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.45)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.85)); }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
