"use client";

import { useState } from "react";

type PalmistryShareButtonProps = {
  sessionId: string;
  userId?: string | null;
};

export function PalmistryShareButton({ sessionId, userId }: PalmistryShareButtonProps) {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createShareLink() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/palmistry/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId: userId ?? null }),
      });

      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.error ?? "Could not create share link.");

      const absoluteUrl = `${window.location.origin}${json.shareUrl}`;
      setShareUrl(absoluteUrl);
      await navigator.clipboard.writeText(absoluteUrl).catch(() => null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Share failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 print:hidden">
      <button
        type="button"
        onClick={createShareLink}
        disabled={loading}
        className="w-full rounded-xl bg-amber-300 px-4 py-3 text-sm font-bold text-black transition hover:bg-amber-200 disabled:opacity-60"
      >
        {loading ? "Creating Link..." : "Create Shareable Report Link"}
      </button>
      {shareUrl ? <p className="mt-3 break-all text-xs text-amber-100">Copied: {shareUrl}</p> : null}
      {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
