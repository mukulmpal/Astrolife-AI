import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured on the server" },
        { status: 401 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const { amount, currency = "INR", receipt, notes } = body || {};

    const numericAmount = Number(amount);
    if (!numericAmount || isNaN(numericAmount) || numericAmount < 100) {
      return NextResponse.json(
        { error: "Amount must be at least 100 paise (₹1.00)" },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    try {
      const orderOptions: {
        amount: number;
        currency: string;
        receipt?: string;
        notes?: Record<string, string>;
      } = {
        amount: Math.round(numericAmount),
        currency: typeof currency === "string" ? currency.toUpperCase() : "INR",
        receipt: typeof receipt === "string" ? receipt : `rcpt_${Date.now()}`,
      };

      if (notes && typeof notes === "object" && !Array.isArray(notes)) {
        orderOptions.notes = notes as Record<string, string>;
      }

      const order = await razorpay.orders.create(orderOptions);

      return NextResponse.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: keyId,
      });
    } catch (rzpErr: unknown) {
      const err = rzpErr as {
        statusCode?: number;
        error?: { description?: string; code?: string };
        message?: string;
      };
      console.error("Razorpay API order creation failed:", err);

      const statusCode = err?.statusCode === 401 ? 401 : 500;
      const errorMessage =
        err?.error?.description ||
        err?.message ||
        "Razorpay API order creation failed";

      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Unhandled error in /api/create-order:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
