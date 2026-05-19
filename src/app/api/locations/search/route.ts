import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type CityRow = {
  geoname_id: number;
  name: string;
  ascii_name: string | null;
  country_code: string;
  admin1_code: string | null;
  latitude: number;
  longitude: number;
  population: number | null;
  timezone: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabase() {
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

function scoreCity(city: CityRow, q: string) {
  const query = q.toLowerCase();
  const name = city.name.toLowerCase();
  const asciiName = (city.ascii_name ?? "").toLowerCase();
  const population = city.population ?? 0;

  let score = 0;

  if (name === query) score += 100000000;
  if (asciiName === query) score += 90000000;

  if (name.startsWith(query)) score += 50000000;
  if (asciiName.startsWith(query)) score += 40000000;

  if (name.includes(query)) score += 10000000;
  if (asciiName.includes(query)) score += 9000000;

  // India boost because AstroLife primary users are India-heavy.
  if (city.country_code === "IN") score += 2000000;

  score += Math.min(population, 20000000);

  return score;
}

export async function GET(req: NextRequest) {
  try {
    const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
    const country = (req.nextUrl.searchParams.get("country") ?? "").trim().toUpperCase();
    const limitRaw = Number(req.nextUrl.searchParams.get("limit") ?? 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 25) : 10;

    if (q.length < 2) {
      return NextResponse.json([]);
    }

    const supabase = getSupabase();

    let query = supabase
      .from("cities")
      .select("geoname_id,name,ascii_name,country_code,admin1_code,latitude,longitude,population,timezone")
      .or(`name.ilike.${q}%,ascii_name.ilike.${q}%,search_text.ilike.%${q}%`)
      .order("population", { ascending: false })
      .limit(80);

    if (country) {
      query = query.eq("country_code", country);
    }

    const { data, error } = await query;

    if (error) {
      console.error("City search error:", error);
      return NextResponse.json({ error: "City search failed" }, { status: 500 });
    }

    const results = (data ?? [])
      .sort((a: CityRow, b: CityRow) => scoreCity(b, q) - scoreCity(a, q))
      .slice(0, limit)
      .map((city: CityRow) => ({
        geonameId: city.geoname_id,
        name: city.name,
        asciiName: city.ascii_name,
        countryCode: city.country_code,
        admin1: city.admin1_code,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
        population: city.population ?? 0,
        displayName: `${city.name}${city.admin1_code ? ", " + city.admin1_code : ""}, ${city.country_code}`,
      }));

    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error("Location search API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
