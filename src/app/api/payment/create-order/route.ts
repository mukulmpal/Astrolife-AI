import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLANS = {
  premium: {
    amount: 49900, // ₹499 in paise
    currency: "INR",
    name: "AstroLife Premium",
    description: "Unlimited AI Chat + All Engines + PDF Reports",
  },
  elite: {
    amount: 199900, // ₹1999 in paise
    currency: "INR",
    name: "AstroLife Elite",
    description: "Everything + WhatsApp AI + Business Muhurat",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json();

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planData = PLANS[plan as keyof typeof PLANS];

    const order = await razorpay.orders.create({
      amount: planData.amount,
      currency: planData.currency,
      notes: {
        userId,
        plan,
      },
    });

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