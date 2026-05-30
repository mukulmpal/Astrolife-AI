"use client";

import { useState } from "react";
import type { PalmAnalyzeInput, PalmRuleReport } from "@/lib/palmistry/types";

type PalmistrySaveButtonProps = {
  input: PalmAnalyzeInput;
  result: PalmRuleReport;
  imageUrl?: string | null;
  userId?: string | null;
  onSaved?: (sessionId: string) => void;
};

export function PalmistrySaveButton({
  input,
  result,
  imageUrl,
  userId,
  onSaved,
}: PalmistrySaveButtonProps) {
  const [saving, setSaving] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/palmistry/save-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId ?? null,
          imageUrl: imageUrl ?? null,
          input,
          result,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.ok) {
        throw new Error(json.error ?? "Could not save palmistry report.");
      }

      const savedId = json.session?.id as string | undefined;
      if (!savedId) throw new Error("Palmistry report saved without a session id.");

      setSessionId(savedId);
      onSaved?.(savedId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-black/30 p-4">
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || Boolean(sessionId)}
        className="w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sessionId ? "Report Saved" : saving ? "Saving..." : "Save Palm Report"}
      </button>

      {sessionId ? (
        <p className="mt-3 text-xs text-amber-200/80">
          Saved successfully. Session ID: {sessionId}
        </p>
      ) : null}

      {error ? <p className="mt-3 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
