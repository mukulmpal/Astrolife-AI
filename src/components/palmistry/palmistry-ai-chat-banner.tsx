"use client";

import { useSyncExternalStore } from "react";

function subscribeToUrlChanges() {
  return () => undefined;
}

function getPalmistryContextActiveSnapshot() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  return Boolean(params.get("palmSessionId")) && params.get("source") === "palmistry";
}

export function PalmistryAiChatBanner() {
  const isActive = useSyncExternalStore(
    subscribeToUrlChanges,
    getPalmistryContextActiveSnapshot,
    () => false,
  );

  if (!isActive) return null;

  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-amber-300/70">
        Palmistry Context Active
      </p>

      <h3 className="mt-2 text-lg font-semibold text-amber-100">
        Ask My Palm is connected to this chat
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        This conversation can use your saved palm report along with Kundli,
        Dasha, Transit and Numerology context from AstroLife.
      </p>
    </div>
  );
}
