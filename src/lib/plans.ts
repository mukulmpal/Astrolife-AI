export type PaidPlanId = "premium" | "elite";

export const PAID_PLANS: Record<PaidPlanId, {
  amount: number;
  currency: "INR";
  name: string;
  description: string;
}> = {
  premium: {
    amount: 49900,
    currency: "INR",
    name: "AstroLife Premium",
    description: "Unlimited AI Chat + All Engines + PDF Reports",
  },
  elite: {
    amount: 199900,
    currency: "INR",
    name: "AstroLife Elite",
    description: "Everything + WhatsApp AI + Business Muhurat",
  },
};

export function isPaidPlan(plan: unknown): plan is PaidPlanId {
  return plan === "premium" || plan === "elite";
}
