import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/access";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

async function verifyAdminCaller() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user.email)) {
    return null;
  }
  return user;
}

interface DiskKundliRecord {
  timestamp: string;
  user_id: string | null;
  user_email: string;
  name: string;
  dob: string;
  tob: string;
  city: string;
  lat: number | null;
  lon: number | null;
  tz: number | string | null;
  gender?: string | null;
  chart_summary?: {
    lagna?: string;
    moon?: string;
  } | null;
}

function readDiskKundlis(): DiskKundliRecord[] {
  const results: DiskKundliRecord[] = [];
  try {
    const dir = path.join(process.cwd(), "data", "kundlis");
    if (!fs.existsSync(dir)) return results;
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".ndjson")).sort().reverse();
    for (const f of files.slice(0, 14)) { // Last 14 days
      const content = fs.readFileSync(path.join(dir, f), "utf8");
      const lines = content.trim().split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line) as DiskKundliRecord;
          if (parsed && parsed.name) {
            results.push(parsed);
          }
        } catch {
          // Skip corrupt line
        }
      }
    }
  } catch (err) {
    console.warn("readDiskKundlis error:", err);
  }
  return results;
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = await verifyAdminCaller();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 403 });
    }

    const admin = createAdminClient();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim() ?? "";
    const limit  = Math.min(Number(searchParams.get("limit") ?? "100"), 500);
    const offset = Number(searchParams.get("offset") ?? "0");

    let dbQuery = admin
      .from("user_charts")
      .select("id, user_id, name, dob, tob, city, lat, lon, tz, chart_data, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      dbQuery = dbQuery.or(`name.ilike.%${search}%,city.ilike.%${search}%`);
    }

    const { data: dbCharts, count: dbCount, error } = await dbQuery;
    if (error) {
      console.warn("user_charts fetch warning:", error.message);
    }

    // Auth user emails
    const uniqueUserIds = [...new Set((dbCharts ?? [])
      .map(c => (c as { user_id: string | null }).user_id)
      .filter((id): id is string => !!id))];

    const emailMap: Record<string, string> = {};
    if (uniqueUserIds.length > 0) {
      try {
        const { data: authData } = await admin.auth.admin.listUsers({ perPage: 500 });
        for (const u of authData?.users ?? []) {
          if (uniqueUserIds.includes(u.id)) {
            emailMap[u.id] = u.email ?? "—";
          }
        }
      } catch (authErr) {
        console.warn("auth listing warning:", authErr);
      }
    }

    const formattedDbCharts = (dbCharts ?? []).map(row => {
      const r = row as {
        id: string;
        user_id: string | null;
        name: string;
        dob: string;
        tob: string;
        city: string;
        lat: number | null;
        lon: number | null;
        tz: string | null;
        chart_data: Record<string, unknown> | null;
        created_at: string;
      };

      const chartData = r.chart_data ?? {};
      const planets = (chartData.planets as Record<string, { sign?: string }> | undefined) ?? {};

      return {
        id: r.id,
        user_id: r.user_id,
        userEmail: r.user_id ? (emailMap[r.user_id] ?? "Registered User") : "Guest (Anonymous)",
        name: r.name,
        dob: r.dob,
        tob: r.tob,
        city: r.city,
        lat: r.lat,
        lon: r.lon,
        tz: r.tz,
        lagna: typeof chartData.lagnaRashi === "string" ? chartData.lagnaRashi : null,
        moon: planets.Moon?.sign ?? null,
        created_at: r.created_at,
        source: "database",
      };
    });

    // Also read disk kundlis to ensure zero loss
    const diskKundlis = readDiskKundlis();
    const diskFormatted = diskKundlis.map((d, idx) => ({
      id: `disk_${d.timestamp}_${idx}`,
      user_id: d.user_id,
      userEmail: d.user_email || "Guest (Anonymous)",
      name: d.name,
      dob: d.dob,
      tob: d.tob,
      city: d.city,
      lat: d.lat,
      lon: d.lon,
      tz: d.tz ? String(d.tz) : null,
      lagna: d.chart_summary?.lagna ?? null,
      moon: d.chart_summary?.moon ?? null,
      created_at: d.timestamp,
      source: "disk_log",
    }));

    // Merge & deduplicate by name + dob + tob + city
    const seen = new Set<string>();
    const merged: typeof formattedDbCharts = [];

    for (const c of [...formattedDbCharts, ...diskFormatted]) {
      const key = `${c.name.toLowerCase()}_${c.dob}_${c.tob}_${c.city.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        if (!search || c.name.toLowerCase().includes(search) || c.city.toLowerCase().includes(search) || c.userEmail.toLowerCase().includes(search)) {
          merged.push(c);
        }
      }
    }

    // Sort by created_at desc
    merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = Math.max(dbCount ?? 0, merged.length);
    const paginated = merged.slice(offset, offset + limit);

    return NextResponse.json({
      charts: paginated,
      total,
    });
  } catch (err) {
    console.error("admin/charts error:", err);
    return NextResponse.json({ error: "Failed to load charts list" }, { status: 500 });
  }
}
