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
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY');
}

const admin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const email = `smoke-${Date.now()}@example.com`;
const password = 'SmokePass123!';

const userId = await (async () => {
  const { data: created, error: createUserError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: 'Smoke User' },
  });

  if (createUserError) throw createUserError;
  if (!created.user) throw new Error('No user returned from createUser');
  return created.user.id;
})();

console.log('Created temp user:', userId);

const anon = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const { data: signInData, error: signInError } = await anon.auth.signInWithPassword({
  email,
  password,
});

if (signInError) throw signInError;
if (!signInData.session) throw new Error('No session created for smoke user');

const testPayload = {
  name: 'Smoke User',
  dob: '1995-05-10',
  tob: '06:30',
  city: 'Delhi',
  lat: 28.6139,
  lon: 77.209,
  tz: 5.5,
  meta: { source: 'smoke-test' },
};

const { data: inserted, error: insertError } = await anon
  .from('saved_charts')
  .insert({
    user_id: userId,
    chart_type: 'self',
    name: 'Smoke User',
    birth_date: '1995-05-10',
    birth_time: '06:30',
    birth_place: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    timezone: '5.5',
    chart_payload: testPayload,
  })
  .select('*')
  .single();

if (insertError) throw insertError;
console.log('Inserted row:', inserted.id);

const { data: rows, error: listError } = await anon
  .from('saved_charts')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });

if (listError) throw listError;
console.log('Listed rows:', rows.length);
console.log(JSON.stringify(rows[0], null, 2));

await admin.from('saved_charts').delete().eq('user_id', userId);
await admin.auth.admin.deleteUser(userId);
console.log('Cleaned up temp user and rows.');
