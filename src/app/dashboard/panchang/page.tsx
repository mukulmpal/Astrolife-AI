"use client";

import { useMemo } from "react";
import { calculatePanchang } from "@/lib/astro-engine/panchang";
import { useUserChart } from "@/lib/user-chart";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "@/app/dashboard/shared.css";

export default function PanchangPage() {
  const { chart } = useUserChart();
  const tz = typeof chart?.tz === "number" ? chart.tz : 5.5;

  const panchang = useMemo(() => calculatePanchang(new Date(), tz), [tz]);

  return (
    <main
      className="min-h-screen text-white"
      style={{
        padding: "32px 24px 110px",
        background:
          "radial-gradient(circle at top left, rgba(14,165,233,0.16), transparent 32%), radial-gradient(circle at top right, rgba(250,204,21,0.1), transparent 30%), #05020f",
      }}
    >
      <div style={{ maxWidth: "1080px", margin: "0 auto", width: "100%" }}>
        <section className="rounded-3xl border border-white/10 bg-white/[0.04]" style={{ padding: "24px" }}>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Panchang Engine</p>
          <h1 className="text-3xl font-bold mt-2">📅 Daily Panchang</h1>
          <p className="text-white/60 mt-2">
            Date: {panchang.date} · Weekday: {panchang.weekday}
          </p>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[
            { k: "Tithi", v: panchang.tithi, s: panchang.paksha },
            { k: "Nakshatra", v: panchang.nakshatra, s: `Pada ${panchang.nakshatraPada}` },
            { k: "Yoga", v: panchang.yoga, s: "Sun + Moon derived" },
            { k: "Karana", v: panchang.karana, s: "Half tithi unit" },
            { k: "Moon Sign", v: panchang.moonSign, s: "Chandra rashi" },
            { k: "Sun Sign", v: panchang.sunSign, s: "Surya rashi" },
          ].map((item) => (
            <div key={item.k} className="rounded-2xl border border-white/10 bg-black/25" style={{ padding: "18px" }}>
              <p className="text-xs uppercase tracking-wide text-white/45">{item.k}</p>
              <h2 className="text-2xl font-semibold mt-2">{item.v}</h2>
              <p className="text-sm text-sky-200 mt-2">{item.s}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] mt-6" style={{ padding: "24px" }}>
          <h3 className="text-xl font-bold">✨ Guidance</h3>
          <p className="text-white/60 text-sm mt-2">
            Sunrise assumption: {panchang.sunriseAssumed}. Advanced local sunrise correction can be added in next phase.
          </p>
          <div className="mt-4 space-y-2">
            {(panchang.notes.length ? panchang.notes : ["Din balanced hai. Intention clear rakho, communication soft rakho."]).map((note, i) => (
              <p key={i} className="text-sm text-white/80 leading-relaxed">✦ {note}</p>
            ))}
          </div>
        </section>
      </div>
      <MobileBottomNav />
    </main>
  );
}
