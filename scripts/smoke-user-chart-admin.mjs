import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');

const admin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

(async () => {
  const email = `smoke-admin-${Date.now()}@example.com`;
  const password = 'SmokePass123!';

  // Create user via admin
  const { data: created, error: createUserError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: 'Smoke Admin User' },
  });
  if (createUserError) throw createUserError;
  if (!created.user) throw new Error('No user returned');
  const userId = created.user.id;
  console.log('Created temp user:', userId);

  // Optionally upsert profile row
  let upsertProfileErr = null;
  try {
    const r = await admin.from('profiles').upsert({
      id: userId,
      name: 'Smoke Admin User',
      dob: '1995-05-10',
      tob: '06:30',
      city: 'Delhi',
      lat: 28.6139,
      lon: 77.209,
      onboarding_completed: true,
    }).select('id').maybeSingle();
    upsertProfileErr = r.error;
    if (upsertProfileErr) throw upsertProfileErr;
    console.log('Upserted profile for user (with onboarding_completed)');
  } catch (e) {
    // Retry without onboarding_completed if column doesn't exist
    console.warn('Upsert with onboarding_completed failed, retrying without that column:', String(e));
    const { data: retryProfile, error: retryErr } = await admin.from('profiles').upsert({
      id: userId,
      name: 'Smoke Admin User',
      dob: '1995-05-10',
      tob: '06:30',
      city: 'Delhi',
      lat: 28.6139,
      lon: 77.209,
    }).select('id').maybeSingle();
    if (retryErr) throw retryErr;
    console.log('Upserted profile for user (without onboarding_completed)');
  }

  // Insert saved chart via admin (bypasses RLS)
  const testPayload = {
    tz: 5.5,
    dob: '1995-05-10',
    lat: 28.6139,
    lon: 77.209,
    tob: '06:30',
    city: 'Delhi',
    meta: { source: 'smoke-admin' },
    name: 'Smoke Admin User',
  };

  const { data: inserted, error: insertError } = await admin.from('saved_charts').insert({
    user_id: userId,
    chart_type: 'self',
    name: 'Smoke Admin User',
    birth_date: '1995-05-10',
    birth_time: '06:30',
    birth_place: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: '5.5',
    chart_payload: testPayload,
  }).select('*').single();

  if (insertError) throw insertError;
  console.log('Inserted saved_charts row id:', inserted.id);

  // Read back using admin
  const { data: rows, error: listError } = await admin.from('saved_charts').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (listError) throw listError;
  console.log('Listed rows count:', rows.length);
  console.log(JSON.stringify(rows[0], null, 2));

  // Cleanup
  const { error: delSaved } = await admin.from('saved_charts').delete().eq('user_id', userId);
  if (delSaved) console.warn('Could not delete saved_charts rows:', delSaved.message);
  const { error: delProfile } = await admin.from('profiles').delete().eq('id', userId);
  if (delProfile) console.warn('Could not delete profile row:', delProfile.message);
  const { error: delUserErr } = await admin.auth.admin.deleteUser(userId);
  if (delUserErr) console.warn('Could not delete user:', delUserErr.message);

  console.log('Cleaned up temp user and rows.');
})().catch((err) => {
  console.error('Smoke admin test failed:', err);
  process.exit(1);
});
