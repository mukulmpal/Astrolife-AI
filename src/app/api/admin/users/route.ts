import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminUser } from "@/lib/access";

async function verifyAdminCaller() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminUser(user.email)) {
    return null;
  }
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const adminUser = await verifyAdminCaller();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 403 });
    }

    const admin = createAdminClient();

    // 1. Fetch auth users
    const { data: authData, error: authError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // 2. Fetch profiles
    const { data: profiles, error: profileError } = await admin
      .from("profiles")
      .select("id, name, subscription_tier, subscription_expires_at, updated_at");

    if (profileError) {
      console.warn("Profiles fetch error:", profileError.message);
    }

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const users = (authData.users || []).map((u) => {
      const p = profileMap.get(u.id);
      return {
        id: u.id,
        email: u.email ?? "No email",
        name: p?.name ?? u.user_metadata?.full_name ?? u.user_metadata?.name ?? u.email?.split("@")[0] ?? "Seeker",
        subscription_tier: p?.subscription_tier ?? u.app_metadata?.subscription_tier ?? "free",
        subscription_expires_at: p?.subscription_expires_at ?? null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await verifyAdminCaller();
    if (!adminUser) {
      return NextResponse.json({ error: "Unauthorized. Admin access only." }, { status: 403 });
    }

    const body = await req.json();
    const { userId, tier, expiresAt } = body;

    if (!userId || !["free", "premium", "elite"].includes(tier)) {
      return NextResponse.json({ error: "Invalid userId or tier" }, { status: 400 });
    }

    const admin = createAdminClient();

    let finalExpiresAt: string | null = null;
    if (tier === "elite" || tier === "premium") {
      if (expiresAt) {
        finalExpiresAt = new Date(expiresAt).toISOString();
      } else {
        const d = new Date();
        d.setFullYear(d.getFullYear() + (tier === "elite" ? 10 : 1));
        finalExpiresAt = d.toISOString();
      }
    }

    // 1. Update public.profiles
    const { error: profileError } = await admin
      .from("profiles")
      .upsert({
        id: userId,
        subscription_tier: tier,
        subscription_expires_at: finalExpiresAt,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });

    if (profileError) {
      console.error("Failed to update profile:", profileError.message);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // 2. Update auth app_metadata and user_metadata
    await admin.auth.admin.updateUserById(userId, {
      app_metadata: {
        subscription_tier: tier,
        plan: tier,
        role: tier,
      },
      user_metadata: {
        subscription_tier: tier,
        plan: tier,
      },
    });

    return NextResponse.json({
      success: true,
      userId,
      tier,
      expiresAt: finalExpiresAt,
      message: `User tier successfully updated to ${tier.toUpperCase()}`,
    });
  } catch (error) {
    console.error("Admin users POST error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
