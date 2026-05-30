"use client";

import { useRef, useState } from "react";
import { Hand, Loader2, Upload, X } from "lucide-react";
import type { PalmVisionResult } from "@/lib/palmistry/types";

export function PalmistryUpload({
  onPreview,
  onExtracted,
}: {
  onPreview: (dataUrl: string | null) => void;
  onExtracted?: (result: PalmVisionResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPreview(dataUrl);
      onPreview(dataUrl);
    };
    reader.readAsDataURL(file);

    if (onExtracted) {
      setDetecting(true);
      setError(null);
      const formData = new FormData();
      formData.append("image", file);
      fetch("/api/palmistry/extract-features", { method: "POST", body: formData })
        .then((res) => res.json())
        .then((json) => {
          if (!json.ok) throw new Error(json.error || "Could not detect palm features");
          onExtracted(json.result);
        })
        .catch((err) => setError(err instanceof Error ? err.message : "Could not detect palm features"))
        .finally(() => setDetecting(false));
    }
  };

  return (
    <div className="rounded-2xl border border-[#c8a030]/20 bg-black/30 p-4">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#c8a030]/25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Palm preview" className="max-h-72 w-full object-cover" />
          {detecting && (
            <div className="absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-2 rounded-xl border border-[#c8a030]/30 bg-black/80 px-3 py-2 text-xs font-semibold text-[#e6c869]">
              <Loader2 size={14} className="animate-spin" />
              Detecting palm features...
            </div>
          )}
          <button type="button" onClick={() => { setPreview(null); onPreview(null); setError(null); }} className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/70 p-2 text-white/70">
            <X size={15} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed border-[#c8a030]/35 py-10 text-center hover:bg-[#c8a030]/[0.04]">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#c8a030]/10 text-[#e6c869]"><Hand size={26} /></span>
          <span className="text-sm font-semibold text-white/85">Upload palm image for preview</span>
          <span className="inline-flex items-center gap-1 text-xs text-white/45"><Upload size={12} /> JPG or PNG</span>
        </button>
      )}
      {error && <p className="mt-3 rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-100">{error}</p>}
    </div>
  );
}
