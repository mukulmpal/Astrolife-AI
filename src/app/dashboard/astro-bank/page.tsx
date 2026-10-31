"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChartProofChatDrawer } from "@/components/chat/ChartProofChatDrawer";
import { buildChart, type BirthDetails, saveCurrentChart, useChartEngine } from "@/lib/user-chart";
import type { ChartData } from "@/lib/astro-engine/calculations";

interface AstroBankEntry {
  name: string;
  country?: string;
  category: "Bollywood" | "Politician" | "Scientist" | "Sport" | "GlobalCelebrity" | "Other" | string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude?: number;
  longitude?: number;
  tz?: number;
}

// Popular quick-filter celebrities
const POPULAR_SEARCHES = [
  { label: "Narendra Modi", flag: "🇮🇳" },
  { label: "Elon Musk", flag: "🚀" },
  { label: "Virat Kohli", flag: "🏏" },
  { label: "Shah Rukh Khan", flag: "🎬" },
  { label: "Sachin Tendulkar", flag: "🏏" },
  { label: "Steve Jobs", flag: "🍎" },
  { label: "Lionel Messi", flag: "⚽" },
  { label: "Albert Einstein", flag: "🔬" },
  { label: "Bill Gates", flag: "💻" },
];

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
    const trimmed = search.trim();
    if (!trimmed && (!country || !category)) {
      setPersonalities([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoadingList(true);
      const params = new URLSearchParams();
      if (country) params.set("country", country);
      if (category) params.set("category", category);
      if (trimmed) params.set("search", trimmed);

      fetch(`/api/astro-bank?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.ok && json.data) setPersonalities(json.data);
          else setPersonalities([]);
        })
        .catch((err) => console.error("Failed to load personalities:", err))
        .finally(() => setLoadingList(false));
    }, trimmed ? 200 : 0);

    return () => clearTimeout(timer);
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
    if (search) {
      setSearch("");
    } else if (category) {
      setCategory("");
      setSearch("");
    } else if (country) {
      setCountry("");
    }
  };

  // ── Determine current view ────────────────────────────────────
  const isSearchActive = search.trim().length > 0;
  const view: "search" | "countries" | "categories" | "names" =
    isSearchActive ? "search" : !country ? "countries" : !category ? "categories" : "names";

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 text-[#1A1A1A]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#B8860B]">
          AstroBank – Famous Personalities
        </h1>
        <p className="text-xs text-[#6B635B] mt-1 font-medium">
          Instant Vedic birth charts & verified coordinates of 1,100+ global icons, leaders, scientists & artists.
        </p>
      </div>

      {/* Prominent Global Search Bar */}
      <div className="relative mb-3">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-[#B8860B] text-base sm:text-lg pointer-events-none">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any personality by name, place, category or country..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#FFFFFF] border-2 border-[rgba(184,134,11,0.25)] focus:border-[#B8860B] text-sm sm:text-base text-[#1A1A1A] placeholder-[#6B635B] outline-none shadow-sm transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 text-[#6B635B] hover:text-[#B8860B] font-bold text-sm p-1"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
        <span className="text-[11px] font-bold text-[#8C6508] uppercase tracking-wider flex-shrink-0">
          ⚡ Quick Search:
        </span>
        {POPULAR_SEARCHES.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setSearch(item.label);
              setCountry("");
              setCategory("");
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF5EB] text-[#1A1A1A] border border-[rgba(184,134,11,0.25)] hover:border-[#B8860B] hover:bg-[#FFFFFF] hover:text-[#B8860B] transition-all flex-shrink-0 shadow-2xs"
          >
            <span>{item.flag}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Breadcrumb + Back (When browsing or searching) */}
      {(view !== "countries" || isSearchActive) && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[rgba(184,134,11,0.22)] hover:border-[#B8860B] text-xs sm:text-sm text-[#B8860B] font-bold transition-colors shadow-sm"
          >
            <span>←</span>
            <span>{isSearchActive ? "Back to Browse" : "Back"}</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6B635B] font-medium">
            <button
              onClick={() => { setCountry(""); setCategory(""); setSearch(""); }}
              className="hover:text-[#B8860B] transition-colors"
            >
              🌍 All Countries
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

      {/* ═══════════ VIEW: Global Search Active ═══════════ */}
      {view === "search" && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-[#B8860B]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              🔍 Search Results for &ldquo;{search}&rdquo;
              <span className="ml-2.5 text-xs sm:text-sm font-normal text-[#6B635B]">
                ({filtered.length} {filtered.length === 1 ? "personality" : "personalities"} found)
              </span>
            </h2>
            <button
              onClick={() => setSearch("")}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[rgba(184,134,11,0.22)] hover:border-[#B8860B] text-[#B8860B] font-bold"
            >
              ✕ Clear Search
            </button>
          </div>

          {loadingList ? (
            <div className="p-12 text-center text-[#B8860B] animate-pulse font-medium">
              Searching AstroBank database…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-[rgba(184,134,11,0.22)] bg-[#FFFFFF] my-4">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-lg font-serif font-bold text-[#1A1A1A]">No personalities found</div>
              <p className="text-xs text-[#6B635B] mt-1 max-w-md mx-auto">
                No matching celebrity found for &ldquo;{search}&rdquo;. Try another keyword, check spelling, or explore by country below.
              </p>
              <button
                onClick={() => setSearch("")}
                className="mt-4 px-4 py-2 rounded-xl bg-[#FAF5EB] border border-[rgba(184,134,11,0.25)] text-xs text-[#B8860B] font-bold hover:bg-[#FFFFFF]"
              >
                Clear Search & Browse All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-8">
              {filtered.map((person) => (
                <div
                  key={`${person.name}-${person.birthDate}`}
                  onClick={() => handleOpenKundli(person)}
                  className="group cursor-pointer rounded-2xl border border-[rgba(184,134,11,0.22)] hover:border-[rgba(184,134,11,0.45)] bg-[#FFFFFF] hover:bg-[#FAF8F5] transition-all overflow-hidden shadow-sm"
                  style={{ transition: "all 0.25s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  {/* Card body */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl flex-shrink-0" title={person.country ? formatDisplayName(person.country) : undefined}>
                          {person.country ? COUNTRY_EMOJI[person.country] || "🌍" : "🌍"}
                        </span>
                        <div className="text-base sm:text-lg font-semibold text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                          {person.name}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[rgba(184,134,11,0.12)] text-[#B8860B] border border-[rgba(184,134,11,0.25)] flex-shrink-0 font-bold">
                        {CATEGORY_EMOJI[person.category] || "✨"} {formatDisplayName(person.category)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#3D3834] mt-2 font-medium">
                      <span>📅 {person.birthDate}</span>
                      <span>⏰ {person.birthTime}</span>
                    </div>
                    {person.birthPlace && (
                      <div className="text-xs sm:text-sm text-[#6B635B] mt-1.5 font-medium truncate">
                        📍 {person.birthPlace}
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="px-5 sm:px-6 py-3 sm:py-3.5 border-t border-[rgba(184,134,11,0.18)] flex items-center justify-between gap-3 bg-[#FAF8F5]">
                    <span className="text-xs sm:text-sm font-semibold text-[#B8860B] group-hover:underline flex items-center gap-1.5">
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
                ({filtered.length} {filtered.length === 1 ? "personality" : "personalities"})
              </span>
            </h2>
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
