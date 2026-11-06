import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PAID_PLANS, isPaidPlan } from "@/lib/plans";
import { createAdminClient } from "@/lib/supabase/admin";
import { monitor } from "@/lib/server-monitoring";

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured on server");
      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    // Must read raw text to accurately verify HMAC signature
    const rawBody = await req.text();

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedBuffer = Buffer.from(signature, "utf8");

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      console.warn("Razorpay webhook signature mismatch");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    let eventPayload: {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            amount?: number;
            currency?: string;
            status?: string;
            notes?: Record<string, string>;
          };
        };
        order?: {
          entity?: {
            id?: string;
            amount?: number;
            currency?: string;
            status?: string;
            notes?: Record<string, string>;
          };
        };
      };
    };

    try {
      eventPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const event = eventPayload.event;
    console.log(`Razorpay webhook received event: ${event}`);

    // We process payment.captured and order.paid
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = eventPayload.payload?.payment?.entity;
      const orderEntity = eventPayload.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      const notes = paymentEntity?.notes || orderEntity?.notes || {};
      const amountPaise = paymentEntity?.amount || orderEntity?.amount || 0;
      const currency = paymentEntity?.currency || orderEntity?.currency || "INR";

      const userId = notes.userId;
      const plan = notes.plan;

      if (!orderId) {
        return NextResponse.json({ status: "ok", message: "No order id found in event" });
      }

      const admin = createAdminClient();

      // Check if already processed
      const { data: existingPayment } = await admin
        .from("payments")
        .select("id, status")
        .eq("provider_order_id", orderId)
        .maybeSingle();

      if (existingPayment?.status === "paid") {
        return NextResponse.json({
          status: "ok",
          message: "Payment already processed",
        });
      }

      // If user and plan are known, fulfill subscription
      if (userId && plan && isPaidPlan(plan)) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        try {
          // 1. Update user profile subscription
          await admin.from("profiles").upsert(
            {
              id: userId,
              subscription_tier: plan,
              subscription_expires_at: expiresAt.toISOString(),
            },
            { onConflict: "id" }
          );

          // 2. Upsert subscriptions table
          const { data: existingSub } = await admin
            .from("subscriptions")
            .select("id")
            .eq("user_id", userId)
            .eq("provider", "razorpay")
            .eq("provider_subscription_id", orderId)
            .maybeSingle();

          if (existingSub?.id) {
            await admin
              .from("subscriptions")
              .update({
                plan,
                status: "active",
                expires_at: expiresAt.toISOString(),
              })
              .eq("id", existingSub.id);
          } else {
            await admin.from("subscriptions").insert({
              user_id: userId,
              plan,
              status: "active",
              provider: "razorpay",
              provider_subscription_id: orderId,
              started_at: new Date().toISOString(),
              expires_at: expiresAt.toISOString(),
            });
          }
        } catch (subErr) {
          monitor.error("webhook.subscription_fulfillment_error", subErr, {
            userId,
            orderId,
            plan,
          });
        }
      }

      // 3. Upsert payments ledger
      const paymentPayload = {
        ...(userId ? { user_id: userId } : {}),
        plan: plan || "custom",
        provider: "razorpay",
        provider_order_id: orderId,
        provider_payment_id: paymentId,
        amount_paise: amountPaise,
        currency,
        status: "paid",
        raw_payload: eventPayload,
      };

      try {
        if (existingPayment?.id) {
          await admin
            .from("payments")
            .update(paymentPayload)
            .eq("id", existingPayment.id);
        } else {
          await admin.from("payments").insert(paymentPayload);
        }
      } catch (ledgerErr) {
        console.warn("Payment ledger insert skipped in webhook:", ledgerErr);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Unhandled Razorpay webhook error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal webhook error" },
      { status: 500 }
    );
  }
}
