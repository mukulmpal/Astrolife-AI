"use client";

import React, { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);

  useEffect(() => {
    // 1. Don't show if already running inside standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Check if user dismissed recently (wait 7 days before prompting again)
    try {
      const dismissedAt = localStorage.getItem("astrolife_pwa_prompt_dismissed");
      if (dismissedAt) {
        const diffDays = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
        if (diffDays < 7) {
          return;
        }
      }
    } catch {
      // ignore localStorage errors
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = isAppleDevice && !/crios|fxios|optios|ucbrowser/.test(userAgent);

    if (isSafari) {
      setIsIOS(true);
      // Show iOS prompt slightly delayed (3 seconds after page loads)
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3500);
      return () => clearTimeout(timer);
    }

    // 4. Capture standard Chromium / Android beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 3 seconds to avoid interrupting the initial experience
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error("Install prompt error:", err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    try {
      localStorage.setItem("astrolife_pwa_prompt_dismissed", Date.now().toString());
    } catch {
      // ignore
    }
  };

  if (!showPrompt) return null;

  return (
    <aside 
      aria-label="App Installation Prompt"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-bounceIn"
    >
      <div className="bg-[#0D0D18]/95 backdrop-blur-md border border-[#D4AF37]/60 rounded-2xl p-4 shadow-2xl text-left relative overflow-hidden text-[#FAF7F2]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          {/* Sacred Om App Icon Thumbnail */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#161626] to-[#080811] border border-[#D4AF37] flex items-center justify-center shrink-0 shadow-md">
            <span className="text-[#D4AF37] text-xl font-bold">ॐ</span>
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="font-serif font-bold text-sm text-[#FAF7F2]">
                Install AstroLife App
              </h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-[#D4AF37]/20 text-[#D4AF37] rounded border border-[#D4AF37]/30">
                PWA
              </span>
            </div>
            <p className="text-xs text-[#C5BFB5] leading-relaxed">
              Add to Home Screen for 1-click Kundli, instant offline access, and fast loading.
            </p>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss install prompt"
            className="text-[#8E887E] hover:text-[#FAF7F2] p-1 transition-colors text-base leading-none"
          >
            ✕
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex items-center justify-end gap-2 relative z-10 pt-2 border-t border-[#D4AF37]/20">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3 py-1.5 rounded-xl text-xs text-[#8E887E] hover:text-[#FAF7F2] font-medium transition-colors"
          >
            Not Now
          </button>

          <button
            type="button"
            onClick={handleInstallClick}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#080811] font-semibold text-xs shadow-md hover:shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <span>📲</span>
            <span>Add to Home Screen</span>
          </button>
        </div>

        {/* iOS Safari Step-by-Step Instruction Popup */}
        {showIOSGuide && (
          <div className="mt-3 p-3 rounded-xl bg-[#161626] border border-[#D4AF37]/40 text-xs text-[#FAF7F2] space-y-1.5 animate-fadeIn">
            <div className="font-semibold text-[#D4AF37] flex items-center gap-1">
              <span>✦</span>
              <span>Install on iPhone / iPad:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#C5BFB5] text-[11px] leading-relaxed">
              <li>Tap the <strong>Share</strong> button at the bottom of Safari (square with arrow ↑).</li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (➕).</li>
              <li>Tap <strong>Add</strong> in the top right corner.</li>
            </ol>
          </div>
        )}
      </div>
    </aside>
  );
}
