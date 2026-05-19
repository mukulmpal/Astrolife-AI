"use client";

import { useEffect, useRef, useState } from "react";

export type CitySearchResult = {
  geonameId: number;
  name: string;
  asciiName: string | null;
  countryCode: string;
  admin1: string | null;
  latitude: number;
  longitude: number;
  timezone: string | null;
  population: number;
  displayName: string;
};

type Props = {
  label?: string;
  value?: CitySearchResult | null;
  onChange: (city: CitySearchResult | null) => void;
  placeholder?: string;
  country?: string;
};

export default function CityAutocomplete({
  label = "Birth Place",
  value,
  onChange,
  placeholder = "Search city, e.g. Delhi, Mumbai, London",
  country,
}: Props) {
  const [query, setQuery] = useState(value?.displayName ?? "");
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  const boxRef = useRef<HTMLDivElement | null>(null);
  const selectedDisplayName = value?.displayName;

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const q = query.trim();

    // Don't re-search when query matches the already-selected city's displayName
    if (selectedDisplayName && q === selectedDisplayName) return;

    if (q.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setErrorText("");

        const params = new URLSearchParams({
          q,
          limit: "10",
        });

        if (country) params.set("country", country);

        const response = await fetch(`/api/locations/search?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          let msg = "City search failed";
          try { msg = (await response.json()).error || msg; } catch { /* ignore */ }
          throw new Error(msg);
        }

        const data = (await response.json()) as CitySearchResult[];
        setResults(data);
        setOpen(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setErrorText(error instanceof Error ? error.message : "City search failed");
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, country, selectedDisplayName]);

  function selectCity(city: CitySearchResult) {
    onChange(city);
    setQuery(city.displayName);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <label className="mb-2 block text-sm font-medium text-white/80">
        {label}
      </label>

      <input
        value={query}
        onChange={(event) => {
          const nextValue = event.target.value;
          setQuery(nextValue);
          setOpen(true);
          if (nextValue.trim().length < 2) {
            setResults([]);
            setErrorText("");
          }
          if (value && nextValue !== value.displayName) onChange(null);
        }}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-300/60"
      />

      {loading && (
        <p className="mt-2 text-xs text-white/45">Searching cities...</p>
      )}

      {errorText && (
        <p className="mt-2 text-xs text-red-300">{errorText}</p>
      )}

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/10 bg-[#100b25] p-2 shadow-2xl">
          {results.map((city) => (
            <button
              key={city.geonameId}
              type="button"
              onClick={() => selectCity(city)}
              className="block w-full rounded-xl px-3 py-3 text-left hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-white">
                  {city.displayName}
                </span>
                <span className="rounded-full bg-amber-300/10 px-2 py-1 text-xs text-amber-200">
                  {city.countryCode}
                </span>
              </div>

              <div className="mt-1 text-xs text-white/45">
                {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
                {city.timezone ? ` · ${city.timezone}` : ""}
              </div>
            </button>
          ))}
        </div>
      )}

      {value && (
        <div className="mt-3 rounded-2xl border border-amber-300/15 bg-amber-300/5 p-3 text-xs text-white/65">
          <div>
            Selected: <span className="font-semibold text-amber-200">{value.displayName}</span>
          </div>
          <div className="mt-1">
            Coordinates: {value.latitude}, {value.longitude}
          </div>
          <div className="mt-1">
            Timezone: {value.timezone ?? "Unknown"}
          </div>
        </div>
      )}
    </div>
  );
}
