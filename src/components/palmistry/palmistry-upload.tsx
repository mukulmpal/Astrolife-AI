"use client";

import { useRef, useState } from "react";
import { Hand, Upload, X } from "lucide-react";

export function PalmistryUpload({ onPreview }: { onPreview: (dataUrl: string | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPreview(dataUrl);
      onPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-[#c8a030]/20 bg-black/30 p-4">
      <input ref={inputRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border border-[#c8a030]/25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Palm preview" className="max-h-72 w-full object-cover" />
          <button type="button" onClick={() => { setPreview(null); onPreview(null); }} className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/70 p-2 text-white/70">
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
    </div>
  );
}
