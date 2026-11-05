import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { PAID_PLANS, isPaidPlan } from "@/lib/plans";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { fail, isRecord, ok, readJsonWithLimit, validationErrorResponse, type ValidationResult } from "@/lib/validation/api";
import { monitor } from "@/lib/server-monitoring";

type CreateOrderBody = { plan: keyof typeof PAID_PLANS };

function validateCreateOrderBody(value: unknown): ValidationResult<CreateOrderBody> {
  if (!isRecord(value)) return fail("Payment payload must be an object.");
  const plan = (value as Record<string, unknown>).plan;
  if (!isPaidPlan(plan)) return fail("Invalid plan.");
  return ok({ plan });
}

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId === "rzp_placeholder") {
      monitor.error("payment.gateway_not_configured", new Error("Missing Razorpay credentials"));
      return NextResponse.json(
        { error: "Payment gateway is not configured yet. Please configure Razorpay keys." },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    const limit = checkRateLimit(req, { scope: "payment-create-order", limit: 10, windowMs: 15 * 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.resetAt);

    const parsed = await readJsonWithLimit(req, validateCreateOrderBody, { maxBytes: 8_000, routeName: "payment-create-order" });
    if (!parsed.ok) return validationErrorResponse(parsed);

    const { plan } = parsed.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const planData = PAID_PLANS[plan];

    const order = await razorpay.orders.create({
      amount: planData.amount,
      currency: planData.currency,
      notes: {
        userId: user.id,
        plan,
      },
    });

    try {
      await createAdminClient().from("payments").insert({
        user_id: user.id,
        plan,
        provider: "razorpay",
        provider_order_id: order.id,
        amount_paise: planData.amount,
        currency: planData.currency,
        status: "created",
        raw_payload: order,
      });
    } catch (error) {
      monitor.error("payment.create_order_insert_failed", error, {
        userId: user.id,
        orderId: order.id,
        plan,
      });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: planData.amount,
      currency: planData.currency,
      name: planData.name,
      description: planData.description,
      keyId: keyId,
    });

  } catch (error) {
    monitor.error("payment.create_order_failed", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
