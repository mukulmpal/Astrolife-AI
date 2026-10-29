"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — Sacred Om (ॐ) Glowing Loop Indicator
 * Features:
 * 1. Centered luxury sacred medallion with the divine ॐ symbol.
 * 2. 360° Glowing Gold Circular Loop that traces and completes as loading progresses.
 * 3. Orbiting cosmic parikrama light beam with golden drop-shadow glow.
 * 4. Zero-latency instant click/touch detection with auto route transition dismissal.
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
    }, 240);
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

  // Circumference for r=44: 2 * Math.PI * 44 ≈ 276.46
  const circleRadius = 44;
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
            boxShadow: "0 0 12px rgba(255, 215, 0, 0.8), 0 0 6px rgba(184, 134, 11, 0.6)",
            transition: "width 0.16s ease, opacity 0.2s ease",
            opacity: progress === 100 ? 0 : 1,
            borderRadius: "0 2px 2px 0",
          }}
        />
      </div>

      {/* ── Center Sacred ॐ Glowing Loop Modal ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999998,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(10, 8, 5, 0.25)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          animation: "fadeInBackdrop 0.16s ease-out forwards",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "omScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          {/* Sacred Circular Medallion */}
          <div
            style={{
              position: "relative",
              width: "112px",
              height: "112px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(28, 22, 16, 0.95) 0%, rgba(14, 11, 8, 0.98) 100%)",
              border: "1.5px solid rgba(212, 175, 55, 0.35)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4), 0 0 35px rgba(212, 175, 55, 0.25), inset 0 0 20px rgba(184, 134, 11, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* SVG Glowing Progress Loop */}
            <svg
              width="112"
              height="112"
              viewBox="0 0 112 112"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: "rotate(-90deg)",
              }}
            >
              <defs>
                <linearGradient id="omLoopGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2B2" />
                  <stop offset="35%" stopColor="#FFD700" />
                  <stop offset="70%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                <filter id="omLoopGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faint Guide Ring */}
              <circle
                cx="56"
                cy="56"
                r={circleRadius}
                fill="none"
                stroke="rgba(212, 175, 55, 0.16)"
                strokeWidth="3"
              />

              {/* Glowing Loop that completes with progress */}
              <circle
                cx="56"
                cy="56"
                r={circleRadius}
                fill="none"
                stroke="url(#omLoopGold)"
                strokeWidth="3.5"
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
                inset: "2px",
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "rgba(255, 215, 0, 0.9)",
                borderRightColor: "rgba(212, 175, 55, 0.4)",
                animation: "parikramaSpin 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                filter: "drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))",
                pointerEvents: "none",
              }}
            />

            {/* Sacred ॐ Symbol in Center */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                fontSize: "42px",
                lineHeight: 1,
                fontFamily: "'Cormorant Garamond', 'Noto Serif Devanagari', 'Georgia', serif",
                fontWeight: 700,
                background: "linear-gradient(135deg, #FFF9E6 0%, #FFD700 45%, #D4AF37 75%, #B8860B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.65))",
                animation: "omBreathing 1.8s ease-in-out infinite",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              ॐ
            </div>
          </div>

          {/* Ethereal Label Below */}
          <div
            style={{
              marginTop: "12px",
              padding: "5px 14px",
              borderRadius: "999px",
              background: "rgba(24, 19, 14, 0.85)",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#FFD700",
                boxShadow: "0 0 8px #FFD700",
                animation: "dotBlink 1s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                color: "#F5EAD4",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              खुल रहा है... <span style={{ color: "#D4AF37", fontSize: "11px" }}>{Math.min(100, Math.round(progress))}%</span>
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
          from { opacity: 0; transform: scale(0.86); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes parikramaSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes omBreathing {
          0%, 100% { transform: scale(0.97); filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.5)); }
          50% { transform: scale(1.05); filter: drop-shadow(0 0 16px rgba(255, 215, 0, 0.9)); }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
