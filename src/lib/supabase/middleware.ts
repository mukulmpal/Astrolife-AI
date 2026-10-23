import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isBillingEnforced, normalizeTier } from "@/lib/access";

const PROTECTED_PREFIXES = ["/dashboard"];
const BILLING_GATED_PREFIXES = ["/onboarding"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isBillingGatedPath(pathname: string) {
  return BILLING_GATED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function getSafeNextPath(value: string | null) {
  if (!value || !value.startsWith("/")) return "/dashboard";
  if (value.startsWith("//") || value.includes("://")) return "/dashboard";
  return value;
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Never intercept API routes with auth checks in middleware
  if (pathname.startsWith("/api/")) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const hasAuthCookie = request.cookies.getAll().some(
    (c) => c.name.includes("auth-token") || c.name.startsWith("sb-")
  );

  if (!hasAuthCookie) {
    if (isProtectedPath(pathname) || isBillingGatedPath(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  let user = null;
  if (hasAuthCookie) {
    try {
      const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
        setTimeout(() => resolve({ data: { user: null } }), 3000)
      );
      const userRes = await Promise.race([supabase.auth.getUser(), timeoutPromise]);
      user = userRes.data.user;
    } catch {
      user = null;
    }
  }

  const billingEnforced = isBillingEnforced();

  if (billingEnforced && isBillingGatedPath(pathname)) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .maybeSingle();

    const tier = normalizeTier(profile?.subscription_tier, user.email);
    if (tier === "free") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/upgrade";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (!user && isProtectedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = getSafeNextPath(request.nextUrl.searchParams.get("next"));
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
