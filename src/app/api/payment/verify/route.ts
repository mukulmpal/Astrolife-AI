import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { PAID_PLANS, isPaidPlan } from "@/lib/plans";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, sanitizeText, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

type VerifyPaymentBody = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: keyof typeof PAID_PLANS;
};

function validateVerifyPaymentBody(value: unknown): ValidationResult<VerifyPaymentBody> {
  if (!isRecord(value)) return fail("Payment verification payload must be an object.");
  const razorpay_order_id = sanitizeText(value.razorpay_order_id, 120);
  const razorpay_payment_id = sanitizeText(value.razorpay_payment_id, 120);
  const razorpay_signature = sanitizeText(value.razorpay_signature, 256);
  const issues: string[] = [];

  if (!razorpay_order_id) issues.push("razorpay_order_id is required.");
  if (!razorpay_payment_id) issues.push("razorpay_payment_id is required.");
  if (!razorpay_signature || !/^[a-f0-9]{64}$/i.test(razorpay_signature)) issues.push("razorpay_signature must be a valid SHA-256 hex signature.");
  if (!isPaidPlan(value.plan)) issues.push("Invalid plan.");

  if (issues.length) return fail("Invalid payment payload.", issues);
  return ok({
    razorpay_order_id: razorpay_order_id!,
    razorpay_payment_id: razorpay_payment_id!,
    razorpay_signature: razorpay_signature!,
    plan: value.plan as keyof typeof PAID_PLANS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const limit = checkRateLimit(req, { scope: "payment-verify", limit: 20, windowMs: 15 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateVerifyPaymentBody, { maxBytes: 12_000, routeName: "payment-verify" });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = parsed.data;

    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const planData = PAID_PLANS[plan];
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = order.notes as Record<string, string | undefined> | undefined;

    if (notes?.userId !== user.id || notes?.plan !== plan) {
      return NextResponse.json({ error: "Payment order mismatch" }, { status: 400 });
    }

    if (Number(order.amount) !== planData.amount || order.currency !== planData.currency) {
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    // Calculate subscription end date (30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const admin = createAdminClient();

    // Idempotency: if this order is already marked paid, return success.
    const { data: alreadyPaid } = await admin
      .from("payments")
      .select("id,plan")
      .eq("provider_order_id", razorpay_order_id)
      .eq("status", "paid")
      .maybeSingle();

    if (alreadyPaid?.id) {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
        plan: String(alreadyPaid.plan),
      });
    }

    const { error: profileError } = await admin
      .from("profiles")
      .update({
        subscription_tier: plan,
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq("id", user.id);

    if (profileError) throw profileError;

    const paymentPayload = {
      user_id: user.id,
      plan,
      provider: "razorpay",
      provider_order_id: razorpay_order_id,
      provider_payment_id: razorpay_payment_id,
      amount_paise: planData.amount,
      currency: planData.currency,
      status: "paid",
      raw_payload: {
        order,
        razorpay_payment_id,
      },
    };

    try {
      const { data: existingPayment } = await admin
        .from("payments")
        .select("id")
        .eq("provider_order_id", razorpay_order_id)
        .maybeSingle();

      if (existingPayment?.id) {
        await admin.from("payments").update(paymentPayload).eq("id", existingPayment.id);
      } else {
        await admin.from("payments").insert(paymentPayload);
      }

      const { data: existingSubscription } = await admin
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("provider", "razorpay")
        .eq("provider_subscription_id", razorpay_order_id)
        .maybeSingle();

      if (existingSubscription?.id) {
        await admin
          .from("subscriptions")
          .update({
            plan,
            status: "active",
            started_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
          })
          .eq("id", existingSubscription.id);
      } else {
        await admin.from("subscriptions").insert({
          user_id: user.id,
          plan,
          status: "active",
          provider: "razorpay",
          provider_subscription_id: razorpay_order_id,
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        });
      }
    } catch (error) {
      console.warn("Payment ledger persistence skipped:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      plan,
      expiresAt: expiresAt.toISOString(),
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
