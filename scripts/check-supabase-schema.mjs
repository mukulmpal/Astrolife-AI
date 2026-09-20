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

if (!url || !anonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const client = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const tables = [
  'profiles',
  'saved_charts',
  'charts',
  'usage_limits',
  'ai_conversations',
  'ai_messages',
  'subscriptions',
  'payments',
  'ai_memory',
  'reports',
];

const results = [];

for (const table of tables) {
  try {
    const { error } = await client.from(table).select('id').limit(1);

    if (!error) {
      results.push({ table, status: 'ready', message: 'Table exists and is queryable.' });
      continue;
    }

    const missing = error.message.toLowerCase().includes('does not exist') ||
      error.message.toLowerCase().includes('could not find') ||
      error.code === '42P01';

    results.push({
      table,
      status: missing ? 'missing' : 'unknown',
      message: missing ? 'Schema not applied in the project.' : error.message,
    });
  } catch (err) {
    results.push({
      table,
      status: 'unknown',
      message: err instanceof Error ? err.message : 'Unexpected error',
    });
  }
}

console.log('Supabase schema check');
for (const row of results) {
  console.log(`${row.status.padEnd(7)} | ${row.table.padEnd(18)} | ${row.message}`);
}

const missing = results.filter((row) => row.status === 'missing');
if (missing.length > 0) {
  console.error(`\n${missing.length} table(s) are missing. Run the SQL in SUPABASE-CHARTS-SETUP.sql or supabase/schema.sql in your Supabase SQL editor.`);
  process.exit(1);
}

console.log('\nAll required tables are present for the dashboard health check.');
