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

    // 1. Build comprehensive Auth User Email map
    const emailMap: Record<string, string> = {};
    const nameDobToEmail: Record<string, string> = {};

    try {
      const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 });
      for (const u of authData?.users ?? []) {
        if (u.id && u.email) {
          emailMap[u.id] = u.email;
        }
      }
    } catch (authErr) {
      console.warn("auth listing warning:", authErr);
    }

    // 2. Fetch Profiles (contains registered users' primary kundlis)
    const profileCharts: Array<{
      id: string;
      user_id: string | null;
      userEmail: string;
      name: string;
      dob: string;
      tob: string;
      city: string;
      lat: number | null;
      lon: number | null;
      tz: string | null;
      lagna: string | null;
      moon: string | null;
      created_at: string;
      source: string;
    }> = [];

    try {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, name, dob, tob, city, lat, lon, created_at, updated_at");

      for (const p of profiles ?? []) {
        if (p.name && p.dob) {
          const userEmail = emailMap[p.id] ?? "Registered User";
          const key = `${String(p.name).toLowerCase().trim()}_${String(p.dob).trim()}`;
          nameDobToEmail[key] = userEmail;

          profileCharts.push({
            id: `profile_${p.id}`,
            user_id: p.id,
            userEmail,
            name: p.name,
            dob: p.dob,
            tob: p.tob || "12:00",
            city: p.city || "Unknown",
            lat: p.lat ?? null,
            lon: p.lon ?? null,
            tz: null,
            lagna: null,
            moon: null,
            created_at: p.created_at || p.updated_at || new Date().toISOString(),
            source: "profile_kundli",
          });
        }
      }
    } catch (profErr) {
      console.warn("profiles fetch warning:", profErr);
    }

    // 3. Fetch Saved Charts (from charts table)
    const savedAccountCharts: typeof profileCharts = [];
    try {
      const { data: saved } = await admin
        .from("charts")
        .select("id, user_id, name, dob, tob, city, lat, lon, chart_json, created_at");

      for (const c of saved ?? []) {
        if (c.name && c.dob) {
          const userEmail = c.user_id ? (emailMap[c.user_id] ?? "Registered User") : "Guest (Anonymous)";
          const chartJson = (c.chart_json as Record<string, unknown> | null) ?? {};
          const planets = (chartJson.planets as Record<string, { sign?: string }> | undefined) ?? {};

          savedAccountCharts.push({
            id: c.id,
            user_id: c.user_id,
            userEmail,
            name: c.name,
            dob: c.dob,
            tob: c.tob || "12:00",
            city: c.city || "Unknown",
            lat: c.lat ?? null,
            lon: c.lon ?? null,
            tz: null,
            lagna: typeof chartJson.lagnaRashi === "string" ? chartJson.lagnaRashi : null,
            moon: planets.Moon?.sign ?? null,
            created_at: c.created_at || new Date().toISOString(),
            source: "saved_chart",
          });
        }
      }
    } catch (chartErr) {
      console.warn("charts fetch warning:", chartErr);
    }

    // 4. Fetch tracked user_charts table
    let dbQuery = admin
      .from("user_charts")
      .select("id, user_id, name, dob, tob, city, lat, lon, tz, chart_data, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(500);

    const { data: dbCharts, error } = await dbQuery;
    if (error) {
      console.warn("user_charts fetch warning:", error.message);
    }

    const trackedCharts: typeof profileCharts = (dbCharts ?? []).map(row => {
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

      // Match user: 1. by user_id, 2. by name+dob in registered profiles, 3. Guest
      let userEmail = "Guest (Anonymous)";
      if (r.user_id && emailMap[r.user_id]) {
        userEmail = emailMap[r.user_id];
      } else {
        const key = `${r.name.toLowerCase().trim()}_${r.dob.trim()}`;
        if (nameDobToEmail[key]) {
          userEmail = nameDobToEmail[key];
        }
      }

      return {
        id: r.id,
        user_id: r.user_id,
        userEmail,
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
        source: "user_charts",
      };
    });

    // 5. Read disk kundlis
    const diskKundlis = readDiskKundlis();
    const diskFormatted: typeof profileCharts = diskKundlis.map((d, idx) => {
      let email = d.user_email && d.user_email !== "Anonymous" ? d.user_email : "";
      if (!email) {
        const key = `${d.name.toLowerCase().trim()}_${d.dob.trim()}`;
        if (nameDobToEmail[key]) email = nameDobToEmail[key];
      }
      return {
        id: `disk_${d.timestamp}_${idx}`,
        user_id: d.user_id,
        userEmail: email || "Guest (Anonymous)",
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
      };
    });

    // Merge & deduplicate by name + dob + tob + city
    // Give higher precedence to records that have an identified userEmail
    const chartMap = new Map<string, typeof profileCharts[0]>();

    for (const c of [...savedAccountCharts, ...profileCharts, ...trackedCharts, ...diskFormatted]) {
      const key = `${c.name.toLowerCase().trim()}_${c.dob.trim()}_${(c.tob || "").trim()}_${c.city.toLowerCase().trim()}`;
      const existing = chartMap.get(key);

      if (!existing) {
        chartMap.set(key, c);
      } else {
        // If current record has an authenticated email and existing didn't, replace with better record
        if (c.userEmail !== "Guest (Anonymous)" && existing.userEmail === "Guest (Anonymous)") {
          chartMap.set(key, c);
        }
      }
    }

    const merged = Array.from(chartMap.values());

    // Apply search filter if provided
    const filtered = search
      ? merged.filter(c =>
          c.name.toLowerCase().includes(search) ||
          c.city.toLowerCase().includes(search) ||
          c.userEmail.toLowerCase().includes(search) ||
          c.dob.includes(search)
        )
      : merged;

    // Sort by created_at descending
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return NextResponse.json({
      charts: paginated,
      total,
    });
  } catch (err) {
    console.error("admin/charts error:", err);
    return NextResponse.json({ error: "Failed to load charts list" }, { status: 500 });
  }
}
