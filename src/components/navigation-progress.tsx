"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * NavigationProgress — Sleek 3px Golden Progress Bar
 * Non-intrusive, luxury top bar that indicates authentic page transitions.
 * NEVER intercepts touch or click events.
 * NEVER blocks scrolling, never pops up intrusive full-screen modals.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const startLoading = useCallback(() => {
    setLoading(true);
    setProgress(20);

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    // Smoothly advance the top progress bar
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 50) return prev + 15;
        if (prev < 80) return prev + 8;
        if (prev < 95) return prev + 2;
        return prev;
      });
    }, 120);

    // Safety timeout: auto-hide after 3s if navigation completed or stalled
    safetyTimeoutRef.current = setTimeout(() => {
      stopLoading();
    }, 3000);
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

  // On genuine route transition completion: flash a brief smooth progress indicator
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Route changed
    setLoading(true);
    setProgress(100);
    const timer = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 220);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Safe manual / custom-event triggers — ZERO document click/touch listeners
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as Record<string, unknown>).__startNavigationLoading = startLoading;
      (window as unknown as Record<string, unknown>).__stopNavigationLoading = stopLoading;
    }

    const handleCustomStart = () => startLoading();
    const handleCustomStop = () => stopLoading();

    window.addEventListener("astrolife:loading:start", handleCustomStart);
    window.addEventListener("astrolife:loading:stop", handleCustomStop);

    return () => {
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
