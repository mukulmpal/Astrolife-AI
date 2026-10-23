"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChartProofChatDrawer } from "@/components/chat/ChartProofChatDrawer";
import { buildChart, type BirthDetails, saveCurrentChart, useChartEngine } from "@/lib/user-chart";
import type { ChartData } from "@/lib/astro-engine/calculations";

interface AstroBankEntry {
  name: string;
  category: "Bollywood" | "Politician" | "Scientist" | "Sport" | "GlobalCelebrity" | "Other" | string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude?: number;
  longitude?: number;
  tz?: number;
}

// Emoji map for countries (keys match JSON data – lowercase/snake_case)
const COUNTRY_EMOJI: Record<string, string> = {
  india: "🇮🇳",
  united_states: "🇺🇸",
  united_kingdom: "🇬🇧",
  canada: "🇨🇦",
  australia: "🇦🇺",
  germany: "🇩🇪",
  france: "🇫🇷",
  japan: "🇯🇵",
  china: "🇨🇳",
  brazil: "🇧🇷",
  russia: "🇷🇺",
  italy: "🇮🇹",
  spain: "🇪🇸",
  mexico: "🇲🇽",
  south_korea: "🇰🇷",
  pakistan: "🇵🇰",
  bangladesh: "🇧🇩",
  sri_lanka: "🇱🇰",
  nepal: "🇳🇵",
  south_africa: "🇿🇦",
  global: "🌍",
};

// Emoji map for categories (keys match JSON data – lowercase/snake_case)
const CATEGORY_EMOJI: Record<string, string> = {
  actor: "🎭",
  film_actor: "🎬",
  television_actor: "📺",
  stage_actor: "🎭",
  film_director: "🎬",
  film_producer: "🎬",
  politician: "🏛️",
  scientist: "🔬",
  physicist: "⚛️",
  mathematician: "📐",
  computer_scientist: "💻",
  neuroscientist: "🧠",
  cricketer: "🏏",
  association_football_player: "⚽",
  american_football_player: "🏈",
  boxer: "🥊",
  athletics_competitor: "🏃",
  volleyball_player: "🏐",
  amateur_wrestler: "🤼",
  musician: "🎵",
  singer: "🎤",
  "singer-songwriter": "🎤",
  songwriter: "🎵",
  composer: "🎼",
  rapper: "🎤",
  writer: "✍️",
  author: "📚",
  novelist: "📖",
  poet: "🪶",
  journalist: "📰",
  businessperson: "💼",
  business_executive: "💼",
  chief_executive_officer: "💼",
  entrepreneur: "🚀",
  youtuber: "▶️",
  model: "👗",
  chef: "👨‍🍳",
  lawyer: "⚖️",
  judge: "⚖️",
  diplomat: "🤝",
  engineer: "⚙️",
  physician: "🩺",
  military_leader: "🎖️",
  revolutionary: "✊",
  monarch: "👑",
  sovereign: "👑",
};

// Format snake_case/lowercase strings for display: "united_states" → "United States"
function formatDisplayName(raw: string): string {
  return raw
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AstroBankPage() {
  const router = useRouter();
  const { setChartData } = useChartEngine();
  const [country, setCountry] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [chatDrawerChart, setChatDrawerChart] = useState<ChartData | null>(null);

  const [meta, setMeta] = useState<{
    countries: Array<{ name: string; count: number }>;
    categoriesByCountry: Record<string, Array<{ name: string; count: number }>>;
  } | null>(null);
  const [personalities, setPersonalities] = useState<AstroBankEntry[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Fetch metadata once on mount
  useEffect(() => {
    fetch("/api/astro-bank?type=meta")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok && json.data) setMeta(json.data);
      })
      .catch((err) => console.error("Failed to load astro bank meta:", err));
  }, []);

  const countryList = meta?.countries ?? [];
  const categoryList = (country && meta ? meta.categoriesByCountry[country] : undefined) ?? [];

  // Fetch filtered personalities on demand
  useEffect(() => {
    if (!country || !category) {
      setPersonalities([]);
      return;
    }
    setLoadingList(true);
    const params = new URLSearchParams({
      country,
      category,
      ...(search ? { search } : {}),
    });
    fetch(`/api/astro-bank?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.ok && json.data) setPersonalities(json.data);
      })
      .catch((err) => console.error("Failed to load personalities:", err))
      .finally(() => setLoadingList(false));
  }, [country, category, search]);

  const filtered = personalities;

  // ── Handlers ──────────────────────────────────────────────────

  const handleOpenKundli = (person: AstroBankEntry) => {
    const birth: BirthDetails = {
      name: person.name,
      dob: person.birthDate,
      tob: person.birthTime ? person.birthTime.slice(0, 5) : "12:00", // "HH:mm:ss" → "HH:mm"
      city: person.birthPlace || "Delhi",
      lat: person.latitude ?? 0,
      lon: person.longitude ?? 0,
      tz: person.tz ?? 5.5,
    };
    try {
      const chart = buildChart(birth);
      setChartData(chart);
      saveCurrentChart(chart);
      router.push("/dashboard/kundli");
    } catch (err) {
      console.error("Failed to build chart for personality:", err);
    }
  };

  const handleOpenChat = (e: React.MouseEvent, person: AstroBankEntry) => {
    e.stopPropagation();
    const birth: BirthDetails = {
      name: person.name,
      dob: person.birthDate,
      tob: person.birthTime ? person.birthTime.slice(0, 5) : "12:00", // "HH:mm:ss" → "HH:mm"
      city: person.birthPlace || "Delhi",
      lat: person.latitude ?? 0,
      lon: person.longitude ?? 0,
      tz: person.tz ?? 5.5,
    };
    try {
      const chart = buildChart(birth);
      setChatDrawerChart(chart);
    } catch (err) {
      console.error("Failed to open chat for personality:", err);
    }
  };

  const handleBack = () => {
    if (category) {
      setCategory("");
      setSearch("");
    } else if (country) {
      setCountry("");
    }
  };

  // ── Determine current view ────────────────────────────────────
  const view: "countries" | "categories" | "names" =
    !country ? "countries" : !category ? "categories" : "names";

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen p-6 text-[#1A1A1A]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-serif text-[#B8860B]">
          AstroBank – Famous Personalities
        </h1>
        <p className="text-xs text-[#6B635B] mt-1 font-medium">
          Explore birth charts of famous personalities across the world.
        </p>
      </div>

      {/* Breadcrumb + Back */}
      {view !== "countries" && (
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.22)] hover:border-[#B8860B] text-sm text-[#B8860B] font-bold transition-colors shadow-sm"
          >
            <span>←</span>
            <span>Back</span>
          </button>
          <div className="flex items-center gap-1.5 text-sm text-[#6B635B] font-medium">
            <button
              onClick={() => { setCountry(""); setCategory(""); setSearch(""); }}
              className="hover:text-[#B8860B] transition-colors"
            >
              🌍 Countries
            </button>
            {country && (
              <>
                <span className="text-[#B8860B]/40">/</span>
                <button
                  onClick={() => { setCategory(""); setSearch(""); }}
                  className="hover:text-[#B8860B] transition-colors"
                >
                  {COUNTRY_EMOJI[country] || "🏳️"} {formatDisplayName(country)}
                </button>
              </>
            )}
            {category && (
              <>
                <span className="text-[#B8860B]/40">/</span>
                <span className="text-[#1A1A1A] font-bold">
                  {CATEGORY_EMOJI[category] || "✨"} {formatDisplayName(category)}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ VIEW: Countries ═══════════ */}
      {view === "countries" && (
        <>
          <h2 className="text-xl font-semibold text-[#B8860B] mb-6" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            🌍 Select a Country
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
            {countryList.map((c) => (
              <button
                key={c.name}
                onClick={() => { setCountry(c.name); setCategory(""); setSearch(""); }}
                className="group flex items-center gap-5 p-6 rounded-2xl border border-[rgba(184,134,11,0.22)] hover:border-[rgba(184,134,11,0.45)] bg-[#FFFFFF] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-sm"
                style={{ transition: "all 0.25s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <span className="text-4xl flex-shrink-0">
                  {COUNTRY_EMOJI[c.name] || "🏳️"}
                </span>
                <div className="text-left">
                  <div className="text-base font-semibold text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {formatDisplayName(c.name)}
                  </div>
                  <div className="text-xs text-[#6B635B] mt-1 font-medium">
                    {c.count} {c.count === 1 ? "personality" : "personalities"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ═══════════ VIEW: Categories ═══════════ */}
      {view === "categories" && (
        <>
          <h2 className="text-xl font-semibold text-[#B8860B] mb-6" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            {COUNTRY_EMOJI[country] || "🏳️"} {formatDisplayName(country)} – Select a Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8">
            {categoryList.map((cat) => (
              <button
                key={cat.name}
                onClick={() => { setCategory(cat.name); setSearch(""); }}
                className="group flex items-center gap-5 p-6 rounded-2xl border border-[rgba(184,134,11,0.22)] hover:border-[rgba(184,134,11,0.45)] bg-[#FFFFFF] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-sm"
                style={{ transition: "all 0.25s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <span className="text-4xl flex-shrink-0">
                  {CATEGORY_EMOJI[cat.name] || "✨"}
                </span>
                <div className="text-left">
                  <div className="text-base font-semibold text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                    {formatDisplayName(cat.name)}
                  </div>
                  <div className="text-xs text-[#6B635B] mt-1 font-medium">
                    {cat.count} {cat.count === 1 ? "personality" : "personalities"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ═══════════ VIEW: Names ═══════════ */}
      {view === "names" && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h2 className="text-xl font-semibold text-[#B8860B]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              {CATEGORY_EMOJI[category] || "✨"} {formatDisplayName(category)} – {formatDisplayName(country)}
              <span className="ml-3 text-sm font-normal text-[#6B635B]">
                ({filtered.length} results)
              </span>
            </h2>
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[rgba(184,134,11,0.25)] focus:border-[#B8860B] text-sm text-[#1A1A1A] placeholder-[#6B635B] outline-none w-72 shadow-sm"
            />
          </div>
          {loadingList ? (
            <div className="p-12 text-center text-[#B8860B] animate-pulse font-medium">
              Loading personalities from AstroBank…
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {filtered.map((person) => (
                <div
                  key={person.name}
                  onClick={() => handleOpenKundli(person)}
                  className="group cursor-pointer rounded-2xl border border-[rgba(184,134,11,0.22)] hover:border-[rgba(184,134,11,0.45)] bg-[#FFFFFF] hover:bg-[#FAF8F5] transition-all overflow-hidden shadow-sm"
                  style={{ transition: "all 0.25s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  {/* Card body */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="text-lg font-semibold text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                        {person.name}
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] flex-shrink-0 font-bold">
                        {formatDisplayName(person.category)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[#3D3834] mt-3 font-medium">
                      <span>📅 {person.birthDate}</span>
                      <span>⏰ {person.birthTime}</span>
                    </div>
                    <div className="text-sm text-[#6B635B] mt-2 font-medium">📍 {person.birthPlace}</div>
                  </div>

                  {/* Card footer */}
                  <div className="px-6 py-4 border-t border-[rgba(184,134,11,0.18)] flex items-center justify-between gap-3 bg-[#FAF8F5]">
                    <span className="text-sm font-semibold text-[#B8860B] group-hover:underline flex items-center gap-1.5">
                      <span>🔯 Open Full Kundli</span>
                      <span>→</span>
                    </span>
                    <button
                      onClick={(e) => handleOpenChat(e, person)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[rgba(184,134,11,0.25)] text-[#1A1A1A] hover:text-[#B8860B] hover:border-[#B8860B] transition-colors font-bold shadow-sm"
                    >
                      💬 Ask AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Floating Chat Drawer if opened directly */}
      {chatDrawerChart && (
        <ChartProofChatDrawer
          chart={chatDrawerChart}
          mode="drawer"
          onClose={() => setChatDrawerChart(null)}
        />
      )}
    </div>
  );
}
