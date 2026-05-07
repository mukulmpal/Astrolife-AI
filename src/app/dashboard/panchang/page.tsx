"use client";

import { useMemo } from "react";
import { calculatePanchang } from "@/lib/astro-engine/panchang";
import { useUserChart } from "@/lib/user-chart";
import { buildDashaTreeFromChart, getNavtara, LORD_COLOR, LORD_ICON, type DashaLord } from "@/lib/astro-engine/dasha";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "@/app/dashboard/shared.css";

// ── Nakshatra lord remedies ───────────────────────────────────────────────────
const NAK_LORD_REMEDY: Record<string, { remedy: string; mantra: string; color: string }> = {
  Sun:     { remedy: "Offer water to rising sun with copper vessel. Donate wheat or jaggery.", mantra: "Om Suryaya Namah (108x)", color: "#f97316" },
  Moon:    { remedy: "Offer white flowers and milk. Wear white. Eat sattvic food.", mantra: "Om Chandraya Namah (108x)", color: "#e2e8f0" },
  Mars:    { remedy: "Donate red lentils. Light a ghee lamp. Chant Hanuman Chalisa.", mantra: "Om Mangalaya Namah (108x)", color: "#ef4444" },
  Mercury: { remedy: "Feed green fodder to cows. Donate green items. Read or write.", mantra: "Om Budhaya Namah (108x)", color: "#22c55e" },
  Jupiter: { remedy: "Apply turmeric tilak. Donate yellow sweets. Serve elders.", mantra: "Om Gurave Namah (108x)", color: "#eab308" },
  Venus:   { remedy: "Offer white flowers to Goddess. Wear clean white clothes.", mantra: "Om Shukraya Namah (108x)", color: "#ec4899" },
  Saturn:  { remedy: "Light sesame oil lamp. Donate black cloth. Serve the poor.", mantra: "Om Shanaishcharaya Namah (108x)", color: "#6366f1" },
  Rahu:    { remedy: "Donate black sesame seeds and blue items. Avoid negative thoughts.", mantra: "Om Rahave Namah (108x)", color: "#8b5cf6" },
  Ketu:    { remedy: "Light camphor. Meditate. Donate multi-colored cloth.", mantra: "Om Ketave Namah (108x)", color: "#a78bfa" },
};

// ── Vara (weekday) lord remedies ──────────────────────────────────────────────
const VARA_LORD: Record<string, { lord: string; remedy: string; icon: string }> = {
  Sunday:    { lord: "Sun",     icon: "☀",  remedy: "Offer water to Sun at sunrise. Eat once. Wear red/orange." },
  Monday:    { lord: "Moon",    icon: "☽",  remedy: "Offer milk to Shivling. Wear white. Eat light food." },
  Tuesday:   { lord: "Mars",    icon: "♂",  remedy: "Visit Hanuman temple. Offer red flowers. Fast optional." },
  Wednesday: { lord: "Mercury", icon: "☿",  remedy: "Feed green grass to cows. Donate to students." },
  Thursday:  { lord: "Jupiter", icon: "♃",  remedy: "Offer yellow flowers to Vishnu. Donate to Guru/Brahmin." },
  Friday:    { lord: "Venus",   icon: "♀",  remedy: "Offer white sweets to young girls. Worship Lakshmi/Durga." },
  Saturday:  { lord: "Saturn",  icon: "♄",  remedy: "Light sesame oil lamp at dusk. Serve poor or elderly." },
};

// ── Navtara remedy map ────────────────────────────────────────────────────────
const NAVTARA_REMEDY: Record<string, { remedy: string[]; bestFor: string; avoid: string }> = {
  "Janma":        { remedy: ["Self-care and rest.", "Light a white candle or diya.", "Chant your birth nakshatra mantra."], bestFor: "Self-reflection, health checkups", avoid: "Long journeys" },
  "Sampat":       { remedy: ["Donate to charity for maximum multiplier.", "Start new financial ventures.", "Offer sweets to children."], bestFor: "Investments, deals, wealth work", avoid: "Nothing — enjoy this day!" },
  "Vipat":        { remedy: ["Recite Mahamrityunjaya mantra 108 times.", "Avoid new starts or travel.", "Light a ghee lamp and sit quietly."], bestFor: "Spiritual practice only", avoid: "Travel, new ventures, major decisions" },
  "Kshema":       { remedy: ["Cook and share food with family.", "Do light exercise or yoga.", "Offer green vegetables at temple."], bestFor: "Health activities, family bonding", avoid: "None specific" },
  "Pratyak":      { remedy: ["Be extra patient today.", "Chant Om Namah Shivaya slowly.", "Avoid rushing — delays are karmic today."], bestFor: "Inner work, patience practice", avoid: "Arguments, new partnerships" },
  "Sadhana":      { remedy: ["Work deeply on your most important goal.", "Study or learn a new skill.", "Offer incense while working."], bestFor: "Career, focused work, skill building", avoid: "Social distractions" },
  "Naidhana":     { remedy: ["Rest and recover.", "Recite Mahamrityunjaya mantra.", "Donate black sesame or iron items."], bestFor: "Spiritual surrender, prayer", avoid: "Travel, business, major decisions" },
  "Mitra":        { remedy: ["Connect with a close friend or mentor.", "Resolve pending conflicts.", "Share a meal with someone you care about."], bestFor: "Networking, partnerships, relationships", avoid: "Isolation" },
  "Parama Mitra": { remedy: ["Take your most important action today.", "Start the venture you have been delaying.", "Donate generously — returns multiply."], bestFor: "Everything — peak auspicious day", avoid: "Wasting this day!" },
};

// ── Component ─────────────────────────────────────────────────────────────────

function InfoCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
      <p className="text-xl font-semibold mt-1 text-white">{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: accent ?? "rgba(255,255,255,0.45)" }}>{sub}</p>}
    </div>
  );
}

function RemedyCard({ title, icon, remedies, color, tag }: {
  title: string; icon: string; remedies: string[]; color: string; tag?: string;
}) {
  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: color + "14", border: `1px solid ${color}44` }}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="font-semibold text-white text-sm">{title}</p>
          {tag && <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color }}>{tag}</p>}
        </div>
      </div>
      <ul className="flex flex-col gap-1.5">
        {remedies.map((r, i) => (
          <li key={i} className="text-sm text-white/75 flex gap-2">
            <span style={{ color }} className="mt-0.5 shrink-0">✦</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PanchangPage() {
  const { chart } = useUserChart();
  const tz = typeof chart?.tz === "number" ? chart.tz : 5.5;

  const panchang = useMemo(
    () => calculatePanchang(new Date(), tz, { lat: chart?.lat, lon: chart?.lon }),
    [chart?.lat, chart?.lon, tz]
  );

  const dashaTree = useMemo(() => {
    if (!chart) return null;
    try { return buildDashaTreeFromChart(chart); } catch { return null; }
  }, [chart]);

  const navtara = useMemo(() => {
    if (!dashaTree) return null;
    return getNavtara(dashaTree.birthNakshatra.name, panchang.nakshatra);
  }, [dashaTree, panchang.nakshatra]);

  const weekday = panchang.weekday;
  const varaInfo  = VARA_LORD[weekday];
  const todayNakLord = panchang.nakshatraLord;
  const nakRemedy = NAK_LORD_REMEDY[todayNakLord];

  const tithiKey = panchang.tithi.split(" ")[0]; // remove "(N/30)" part
  const tithiGuide = panchang.tithiGuidance;
  const yogaNature = panchang.yogaGuidance.nature;
  const yogaColor = yogaNature === "Auspicious" ? "#22c55e" : yogaNature === "Sensitive" ? "#ef4444" : "#94a3b8";

  const navtaraRemedyData = navtara ? NAVTARA_REMEDY[navtara.taraName] : null;
  const navtaraColor = navtara
    ? navtara.nature === "malefic" ? "#ef4444"
    : navtara.nature === "highly_benefic" ? "#eab308"
    : "#22c55e"
    : "#94a3b8";

  return (
    <main
      className="min-h-screen text-white"
      style={{
        padding: "32px 24px 110px",
        background:
          "radial-gradient(circle at top left, rgba(14,165,233,0.14), transparent 32%), radial-gradient(circle at top right, rgba(250,204,21,0.09), transparent 30%), #05020f",
      }}
    >
      <div style={{ maxWidth: "1080px", margin: "0 auto", width: "100%" }} className="flex flex-col gap-6">

        {/* Header */}
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Panchang Engine</p>
          <h1 className="text-3xl font-bold mt-1">Daily Panchang</h1>
          <p className="text-white/50 text-sm mt-1">{panchang.weekday}, {panchang.date}</p>
        </section>

        {/* Panchang 5 Elements */}
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <InfoCard label="Tithi"     value={panchang.tithi.split(" ")[0]} sub={`${panchang.paksha} Paksha · ends ${panchang.tithiEnd}`} />
          <InfoCard label="Nakshatra" value={panchang.nakshatra}            sub={`Pada ${panchang.nakshatraPada} · ${todayNakLord} · ends ${panchang.nakshatraEnd}`} accent={LORD_COLOR[todayNakLord as DashaLord]} />
          <InfoCard label="Yoga"      value={panchang.yoga}                 sub={`${yogaNature} · ends ${panchang.yogaEnd}`} accent={yogaColor} />
          <InfoCard label="Karana"    value={panchang.karana}               sub={`ends ${panchang.karanaEnd}`} />
          <InfoCard label="Moon Sign" value={panchang.moonSign}             sub="Chandra Rashi" />
          <InfoCard label="Sun Sign"  value={panchang.sunSign}              sub="Surya Rashi" />
        </section>

        {/* Time Windows */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoCard label="Sunrise" value={panchang.sunrise} sub={panchang.sunriseAssumed.includes("approx") ? "approx local" : "local"} accent="#f97316" />
          <InfoCard label="Sunset" value={panchang.sunset} sub="local" accent="#f59e0b" />
          <InfoCard label="Abhijit" value={`${panchang.abhijitMuhurta.start} – ${panchang.abhijitMuhurta.end}`} sub="fallback shubh muhurta" accent="#22c55e" />
          <InfoCard label="Hora Now" value={panchang.currentHora} sub={`next: ${panchang.nextHoraLord}`} accent={LORD_COLOR[panchang.currentHoraLord as DashaLord]} />
        </section>

        {/* Rahu Kaal & Gulika */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl p-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-xs uppercase tracking-widest text-red-400">Rahu Kaal</p>
            <p className="text-2xl font-bold text-white mt-1">{panchang.rahuKaal.start} – {panchang.rahuKaal.end}</p>
            <p className="text-xs text-white/40 mt-1">Avoid important work in this window</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.3)" }}>
            <p className="text-xs uppercase tracking-widest text-purple-400">Gulika Kaal</p>
            <p className="text-2xl font-bold text-white mt-1">{panchang.gulikaKaal.start} – {panchang.gulikaKaal.end}</p>
            <p className="text-xs text-white/40 mt-1">Inauspicious — avoid new starts</p>
          </div>
          <div className="rounded-2xl p-4" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <p className="text-xs uppercase tracking-widest text-amber-300">Yamaganda</p>
            <p className="text-2xl font-bold text-white mt-1">{panchang.yamaganda.start} – {panchang.yamaganda.end}</p>
            <p className="text-xs text-white/40 mt-1">Avoid risky or irreversible decisions</p>
          </div>
        </section>

        {/* Navtara Card */}
        {navtara && (
          <section
            className="rounded-2xl p-5"
            style={{ background: navtaraColor + "12", border: `1px solid ${navtaraColor}44` }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: navtaraColor }}>
              Your Navtara Today
            </p>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{navtara.icon}</span>
              <div className="flex-1">
                <p className="text-xl font-bold text-white">
                  {navtara.taraName} Tara #{navtara.taraNum}
                  <span className="ml-2 text-sm font-normal text-white/50">— {navtara.meaning}</span>
                </p>
                <p className="text-sm text-white/70 mt-1">{navtara.advice}</p>
                <div className="flex gap-4 mt-2 text-xs text-white/35">
                  <span>Birth: {navtara.janmaNakshatra}</span>
                  <span>Today: {navtara.todayNakshatra}</span>
                  <span>Cycle {navtara.cycleNumber}</span>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-semibold"
                style={{ background: navtaraColor + "25", color: navtaraColor }}>
                {navtara.nature === "highly_benefic" ? "Highly Benefic" :
                 navtara.nature === "benefic" ? "Benefic" :
                 navtara.nature === "malefic" ? "Malefic" : "Neutral"}
              </span>
            </div>
          </section>
        )}

        {/* Remedy Cards */}
        <section>
          <p className="text-xs uppercase tracking-widest text-white/35 mb-3">Today&apos;s Remedies</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            {/* Navtara remedy */}
            {navtaraRemedyData && navtara && (
              <RemedyCard
                title={`${navtara.taraName} Tara Remedy`}
                icon={navtara.icon}
                remedies={navtaraRemedyData.remedy}
                color={navtaraColor}
                tag="Navtara based"
              />
            )}

            {/* Nakshatra lord remedy */}
            {nakRemedy && (
              <RemedyCard
                title={`${todayNakLord} Nakshatra Remedy`}
                icon={LORD_ICON[todayNakLord as DashaLord] ?? "✦"}
                remedies={[nakRemedy.remedy, nakRemedy.mantra, panchang.nakshatraGuidance.remedy]}
                color={nakRemedy.color}
                tag="Today's Nakshatra lord"
              />
            )}

            {/* Vara remedy */}
            {varaInfo && (
              <RemedyCard
                title={`${weekday} — ${varaInfo.lord} Vara`}
                icon={varaInfo.icon}
                remedies={[varaInfo.remedy]}
                color={LORD_COLOR[varaInfo.lord as DashaLord] ?? "#94a3b8"}
                tag="Weekday lord"
              />
            )}

          </div>
        </section>

        {/* Tithi guidance */}
        {tithiGuide && (
          <section className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs uppercase tracking-widest text-white/35 mb-2">Tithi Guidance — {tithiKey}</p>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-white/40 text-xs mb-1">Nature</p>
                <p className="font-semibold" style={{
                  color: tithiGuide.nature === "Auspicious" ? "#22c55e" :
                         tithiGuide.nature === "Sensitive" ? "#ef4444" :
                         tithiGuide.nature === "Caution" ? "#f59e0b" : "#94a3b8"
                }}>{tithiGuide.nature}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">Good For</p>
                <p className="text-white/80">{tithiGuide.goodFor.join(", ")}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">Avoid</p>
                <p className="text-white/80">{tithiGuide.avoid.join(", ")}</p>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed mt-3">{tithiGuide.explanation}</p>
          </section>
        )}

        <section className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl p-4" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.22)" }}>
            <p className="text-xs uppercase tracking-widest text-emerald-300 mb-2">Aaj Shubh Karya</p>
            {panchang.shubhKarya.map((item) => (
              <p key={item} className="text-sm text-white/75 leading-relaxed">✦ {item}</p>
            ))}
          </div>
          <div className="rounded-2xl p-4" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.22)" }}>
            <p className="text-xs uppercase tracking-widest text-red-300 mb-2">Aaj Avoid / Saavdhani</p>
            {panchang.avoidKarya.map((item) => (
              <p key={item} className="text-sm text-white/75 leading-relaxed">✦ {item}</p>
            ))}
          </div>
        </section>

        {/* Panchang notes */}
        {panchang.notes.length > 0 && (
          <section className="rounded-2xl p-4" style={{ background: "rgba(14,165,233,0.07)", border: "1px solid rgba(14,165,233,0.2)" }}>
            <p className="text-xs uppercase tracking-widest text-sky-400 mb-2">Special Notes</p>
            {panchang.notes.map((note, i) => (
              <p key={i} className="text-sm text-white/75 leading-relaxed">✦ {note}</p>
            ))}
          </section>
        )}

      </div>
      <MobileBottomNav />
    </main>
  );
}
