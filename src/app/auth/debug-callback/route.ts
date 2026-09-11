import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Temporary debug endpoint to help diagnose OAuth redirect/exchange failures.
// Usage: set this URL as a redirect in Supabase Auth (once), reproduce the
// Google sign-in, and examine the JSON returned here. It returns the
// `code` and any exchange error from Supabase so we can determine the cause.

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  const errorDesc = url.searchParams.get('error_description');

  try {
    if (!code) {
      return NextResponse.json({ ok: false, reason: 'missing_code', error, error_description: errorDesc, state });
    }

    const supabase = await createClient();
    const result = await supabase.auth.exchangeCodeForSession(code);

    return NextResponse.json({ ok: true, code, state, result });
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, code, state, caught: String(err) });
  }
}
