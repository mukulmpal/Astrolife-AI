import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeDashboardPath(value: string | null) {
  if (!value || !value.startsWith("/dashboard")) return "/dashboard";
  if (value.startsWith("//") || value.includes("://")) return "/dashboard";
  return value;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const next = safeDashboardPath(url.searchParams.get("next"));
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${url.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("next", next);
    loginUrl.searchParams.set("error", error?.message ?? "google_oauth_failed");
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(data.url);
  response.cookies.set("astrolife_auth_next", next, {
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}
