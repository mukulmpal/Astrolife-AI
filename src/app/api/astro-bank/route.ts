import { NextRequest, NextResponse } from "next/server";
import astroBankData from "@/data/astroBank.json";

interface RawEntry {
  name: string;
  country: string;
  category: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number | null;
  longitude: number | null;
  tz: number | null;
}

const entries = astroBankData as RawEntry[];

// Precompute metadata once in memory
const countryCountMap = new Map<string, number>();
const catCountMap = new Map<string, Map<string, number>>();

for (const p of entries) {
  const c = p.country || "other";
  countryCountMap.set(c, (countryCountMap.get(c) ?? 0) + 1);

  if (!catCountMap.has(c)) {
    catCountMap.set(c, new Map());
  }
  const innerMap = catCountMap.get(c)!;
  const cat = p.category || "other";
  innerMap.set(cat, (innerMap.get(cat) ?? 0) + 1);
}

const countries = Array.from(countryCountMap.entries())
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count);

const categoriesByCountry: Record<string, Array<{ name: string; count: number }>> = {};
for (const [c, map] of catCountMap.entries()) {
  categoriesByCountry[c] = Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

const cachedMeta = {
  countries,
  categoriesByCountry,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "meta") {
      return NextResponse.json(
        { ok: true, data: cachedMeta },
        {
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
          },
        }
      );
    }

    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim().toLowerCase();

    if (!country && !category && !search) {
      return NextResponse.json({ ok: true, data: [] });
    }

    let filtered = entries;

    if (country) {
      filtered = filtered.filter((p) => p.country === country);
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          (p.birthPlace && p.birthPlace.toLowerCase().includes(search))
      );
    }

    return NextResponse.json(
      { ok: true, data: filtered },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      }
    );
  } catch (error) {
    console.error("Error in /api/astro-bank route:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch astro bank data" },
      { status: 500 }
    );
  }
}
