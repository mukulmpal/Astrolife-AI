"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isBillingEnforced, normalizeTier } from "@/lib/access";

type PremiumFeatureProps = {
  children: React.ReactNode;
  feature: string;
};

export function PremiumFeature({ children, feature }: PremiumFeatureProps) {
  const [supabase] = useState(() => createClient());
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);

  useEffect(() => {
    const loadTier = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", data.user.id)
        .maybeSingle();

      setSubscriptionTier(typeof profile?.subscription_tier === "string" ? profile.subscription_tier : null);
    };

    loadTier();
  }, [supabase]);

  const enforced = isBillingEnforced();
  const currentTier = normalizeTier(subscriptionTier);
  const isPremium = currentTier !== "free";
  const isLocked = enforced && !isPremium;
  const planLabel = currentTier.toUpperCase();

  return (
    <>
      <style>{`
        .premium-gate{margin-bottom:20px;border-radius:16px;padding:14px 18px;border:1px solid;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
        .premium-gate-copy{display:flex;flex-direction:column;gap:4px}
        .premium-gate-badge{display:inline-flex;align-items:center;width:fit-content;padding:3px 10px;border-radius:999px;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;font-weight:600}
        .premium-gate-title{font-size:13px;color:#f0e8d0}
        .premium-gate-sub{font-size:12px;color:#c8c0a8;line-height:1.6}
        .premium-gate-cta{display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:10px;text-decoration:none;font-size:12px;font-weight:600;white-space:nowrap}
        .premium-gate.soft{background:rgba(200,160,48,0.06);border-color:rgba(200,160,48,0.18)}
        .premium-gate.soft .premium-gate-badge{background:rgba(200,160,48,0.14);color:#f0d898;border:1px solid rgba(200,160,48,0.25)}
        .premium-gate.soft .premium-gate-cta{background:linear-gradient(135deg,#c8a030,#a07820);color:#060410}
        .premium-gate.unlocked{background:rgba(34,197,94,0.06);border-color:rgba(34,197,94,0.18)}
        .premium-gate.unlocked .premium-gate-badge{background:rgba(34,197,94,0.14);color:#86efac;border:1px solid rgba(34,197,94,0.25)}
        .premium-gate.unlocked .premium-gate-cta{background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.2);color:#86efac}
        .premium-gate.locked{background:rgba(239,68,68,0.06);border-color:rgba(239,68,68,0.18)}
        .premium-gate.locked .premium-gate-badge{background:rgba(239,68,68,0.14);color:#fca5a5;border:1px solid rgba(239,68,68,0.25)}
        .premium-gate.locked .premium-gate-cta{background:linear-gradient(135deg,#c8a030,#a07820);color:#060410}
        .premium-feature-shell{position:relative}
        .premium-feature-shell.locked .premium-feature-content{filter:blur(6px);opacity:0.45;pointer-events:none;user-select:none}
        .premium-feature-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px}
        .premium-feature-card{max-width:360px;text-align:center;background:rgba(6,4,16,0.92);border:1px solid rgba(200,160,48,0.2);border-radius:18px;padding:20px}
        .premium-feature-card-title{font-family:"Cormorant Garamond",serif;font-size:24px;color:#f0e8d0;margin-bottom:8px}
        .premium-feature-card-text{font-size:13px;color:#c8c0a8;line-height:1.7;margin-bottom:14px}
        .premium-feature-card-cta{display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:10px;background:linear-gradient(135deg,#c8a030,#a07820);color:#060410;text-decoration:none;font-size:12px;font-weight:600}
      `}</style>

      <div className={`premium-gate ${isPremium ? "unlocked" : isLocked ? "locked" : "soft"}`}>
        <div className="premium-gate-copy">
          <span className="premium-gate-badge">
            {isPremium ? `${planLabel} Unlocked` : isLocked ? "Premium Locked" : "Testing Mode"}
          </span>
          <div className="premium-gate-title">{feature} is a premium engine.</div>
          <div className="premium-gate-sub">
            {isPremium
              ? "Full access is active on your account."
              : isLocked
                ? "Billing enforcement is on. Upgrade to continue using this feature."
                : "Billing enforcement is off, so this premium feature stays open for product testing."}
          </div>
        </div>
        <Link href="/dashboard/upgrade" className="premium-gate-cta">
          {isPremium ? "Manage Plan" : "Upgrade"}
        </Link>
      </div>

      <div className={`premium-feature-shell ${isLocked ? "locked" : ""}`}>
        <div className="premium-feature-content">{children}</div>
        {isLocked && (
          <div className="premium-feature-overlay">
            <div className="premium-feature-card">
              <div className="premium-feature-card-title">Premium Preview</div>
              <div className="premium-feature-card-text">
                {feature} will unlock fully after upgrade. Testing mode can be reopened by turning billing enforcement off.
              </div>
              <Link href="/dashboard/upgrade" className="premium-feature-card-cta">Upgrade to Premium</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
