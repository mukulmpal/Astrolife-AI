#!/usr/bin/env node
/**
 * AstroLife Private Access Control CLI
 * Usage: node scripts/grant-tier.mjs <user-email> [free|premium|elite]
 * Example: node scripts/grant-tier.mjs friend@example.com elite
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadAllEnvFiles() {
  const envFiles = [".env", ".env.local", ".env.production", ".env.production.local"];
  for (const file of envFiles) {
    const envPath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx <= 0) continue;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadAllEnvFiles();

const email = process.argv[2]?.trim().toLowerCase();
const tier = (process.argv[3] || "elite").trim().toLowerCase();

if (!email || !email.includes("@")) {
  console.log("\n❌ Please provide a valid email address.");
  console.log("Usage: node scripts/grant-tier.mjs <email> [free|premium|elite]");
  console.log("Example: node scripts/grant-tier.mjs seeker@gmail.com elite\n");
  process.exit(1);
}

if (!["free", "premium", "elite"].includes(tier)) {
  console.log("\n❌ Invalid tier. Must be one of: free, premium, elite");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !serviceKey) {
  console.log("\n⚠️ NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found in local .env files.");
  console.log("💡 To grant access directly without Supabase env keys locally:");
  console.log(`   1. Add "${email}" to ELITE_EMAILS in src/lib/access.ts`);
  console.log(`   2. OR set ELITE_EMAILS on Vercel: ELITE_EMAILS=${email}\n`);
  process.exit(0);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log(`\n🔍 Searching for user profile: ${email}...`);

  // 1. Try finding in profiles table
  const { data: profiles, error: selectErr } = await supabase
    .from("profiles")
    .select("id, email, subscription_tier")
    .ilike("email", email);

  if (selectErr) {
    console.error("❌ Error querying profiles table:", selectErr.message);
    process.exit(1);
  }

  if (profiles && profiles.length > 0) {
    const profile = profiles[0];
    const { error: updateErr } = await supabase
      .from("profiles")
      .update({
        subscription_tier: tier,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    if (updateErr) {
      console.error("❌ Failed to update tier:", updateErr.message);
      process.exit(1);
    }

    console.log(`\n✅ SUCCESS: Granted "${tier.toUpperCase()}" access to ${email}!`);
    console.log(`   Profile ID: ${profile.id}`);
    console.log(`   Previous Tier: ${profile.subscription_tier || "free"}`);
    console.log(`   New Tier: ${tier}\n`);
  } else {
    // If not yet signed up or not found in profiles, note the access
    console.log(`\n⚠️ User ${email} not yet found in Supabase profiles.`);
    console.log(`💡 Pro-tip: You can also add their email to ELITE_EMAILS in src/lib/access.ts`);
    console.log(`   or set ELITE_EMAILS=${email} in your .env.local / Vercel environment variables.\n`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
