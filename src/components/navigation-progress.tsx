"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — Sleek 3px Golden Progress Bar
 * Non-intrusive, luxury top bar that indicates authentic page transitions.
 * NEVER blocks scrolling, never pops up intrusive full-screen modals.
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

    // Smoothly advance the top progress bar
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 15;
        if (prev < 70) return prev + 8;
        if (prev < 92) return prev + 3;
        return prev;
      });
    }, 130);

    // Safety timeout: auto-hide after 5s if navigation completed or stalled
    safetyTimeoutRef.current = setTimeout(() => {
      stopLoading();
    }, 5000);
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
    }, 200);
  }, []);

  // Dismiss on route change
  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  // Global instantaneous click/touch listener with touch-drag immunity
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__startNavigationLoading = startLoading;
      (window as unknown as Record<string, unknown>).__stopNavigationLoading = stopLoading;
    }

    let isTouching = false;
    let isScrolling = false;
    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isTouching = true;
        isScrolling = false;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTouching || e.touches.length === 0) return;
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      // If user moved more than 4px, it is a scroll gesture — NOT a tap!
      if (dx > 4 || dy > 4) {
        isScrolling = true;
      }
    };

    const onTouchEnd = () => {
      isTouching = false;
      setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    const handleNavigationTrigger = (e: MouseEvent | PointerEvent) => {
      // If user was scrolling or swiping, NEVER trigger loader!
      if (isScrolling) return;

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

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("click", handleNavigationTrigger, { capture: true });
    window.addEventListener("astrolife:loading:start", handleCustomStart);
    window.addEventListener("astrolife:loading:stop", handleCustomStop);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", handleNavigationTrigger, { capture: true });
      window.removeEventListener("astrolife:loading:start", handleCustomStart);
      window.removeEventListener("astrolife:loading:stop", handleCustomStop);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, [startLoading, stopLoading]);

  if (!loading && progress === 0) return null;

  return (
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
  );
}
