import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/dashboard")) return "/dashboard";
  if (value.startsWith("//") || value.includes("://")) return "/dashboard";
  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(request.cookies.get("astrolife_auth_next")?.value ?? url.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data) {
      const response = NextResponse.redirect(new URL(next, url.origin));
      response.cookies.delete("astrolife_auth_next");
      return response;
    }

    // Exchange failed — clear the cookie to avoid reuse and include the
    // provider error message in the redirect so the UI can show a helpful
    // diagnostic instead of looping silently.
    const errMsg = error?.message ?? "auth_callback_failed";
    const response = NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent(errMsg)}`, url.origin));
    response.cookies.delete("astrolife_auth_next");
    return response;
  }

  const loginUrl = new URL("/login", url.origin);
  loginUrl.searchParams.set("next", next);
  loginUrl.searchParams.set("error", url.searchParams.get("error_description") ?? "auth_callback_failed");
  return NextResponse.redirect(loginUrl);
}
