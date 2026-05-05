import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { PAID_PLANS, isPaidPlan } from "@/lib/plans";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json();

    if (!isPaidPlan(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

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
      console.warn("Payment create log skipped:", error);
    }

    return NextResponse.json({
      orderId: order.id,
      amount: planData.amount,
      currency: planData.currency,
      name: planData.name,
      description: planData.description,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
