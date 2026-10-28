"use client";

import Link from "next/link";
import { isBillingEnforced, isFullAccessEnabled } from "@/lib/access";
import { useUserTier } from "@/context/ChartContext";

type PremiumFeatureProps = {
  children: React.ReactNode;
  feature: string;
  enforceLock?: boolean;
};

export function PremiumFeature({ children, feature, enforceLock }: PremiumFeatureProps) {
  const { userTier } = useUserTier();
  const fullAccess = isFullAccessEnabled();

  if (fullAccess) {
    return <>{children}</>;
  }

  const enforced = enforceLock ?? isBillingEnforced();
  const isPremium = userTier !== "free";
  const isLocked = enforced && !isPremium;
  const planLabel = userTier === "elite" ? "💎 Elite" : userTier === "premium" ? "👑 Pro" : "🌱 Basic";

  return (
    <>
      <style>{`
        .premium-gate{margin-bottom:20px;border-radius:16px;padding:14px 18px;border:1px solid;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
        .premium-gate-copy{display:flex;flex-direction:column;gap:4px}
        .premium-gate-badge{display:inline-flex;align-items:center;width:fit-content;padding:3px 10px;border-radius:999px;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;font-weight:600}
        .premium-gate-title{font-size:13px;color:#1A1A1A}
        .premium-gate-sub{font-size:12px;color:#4A4238;line-height:1.6}
        .premium-gate-cta{display:inline-flex;align-items:center;justify-content:center;padding:10px 16px;border-radius:10px;text-decoration:none;font-size:12px;font-weight:600;white-space:nowrap}
        .premium-gate.soft{background:rgba(200,160,48,0.06);border-color:rgba(200,160,48,0.18)}
        .premium-gate.soft .premium-gate-badge{background:rgba(200,160,48,0.14);color:#f0d898;border:1px solid rgba(200,160,48,0.25)}
        .premium-gate.soft .premium-gate-cta{background:linear-gradient(135deg,#c8a030,#a07820);color:#FAF7F2}
        .premium-gate.unlocked{background:rgba(34,197,94,0.06);border-color:rgba(34,197,94,0.18)}
        .premium-gate.unlocked .premium-gate-badge{background:rgba(34,197,94,0.14);color:#86efac;border:1px solid rgba(34,197,94,0.25)}
        .premium-gate.unlocked .premium-gate-cta{background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.2);color:#86efac}
        .premium-gate.locked{background:rgba(239,68,68,0.06);border-color:rgba(239,68,68,0.18)}
        .premium-gate.locked .premium-gate-badge{background:rgba(239,68,68,0.14);color:#fca5a5;border:1px solid rgba(239,68,68,0.25)}
        .premium-gate.locked .premium-gate-cta{background:linear-gradient(135deg,#c8a030,#a07820);color:#FAF7F2}
        .premium-feature-shell{position:relative}
        .premium-feature-shell.locked .premium-feature-content{filter:blur(8px);opacity:0.35;pointer-events:none;user-select:none}
        .premium-feature-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;z-index:20}
        .premium-feature-card{max-width:420px;text-align:center;background:rgba(18,12,6,0.96);border:1.5px solid rgba(212,175,55,0.45);border-radius:20px;padding:26px;box-shadow:0 12px 40px rgba(0,0,0,0.6);backdrop-filter:blur(10px)}
        .premium-feature-card-title{font-family:"Cormorant Garamond",serif;font-size:24px;font-weight:700;color:#FFFFFF;margin-bottom:8px}
        .premium-feature-card-text{font-size:13px;color:#FEF3C7;line-height:1.65;margin-bottom:18px}
        .premium-feature-card-cta{display:inline-flex;align-items:center;justify-content:center;padding:12px 22px;border-radius:12px;background:linear-gradient(135deg,#c8a030,#a07820);color:#FAF7F2;text-decoration:none;font-size:13px;font-weight:700;box-shadow:0 4px 15px rgba(200,160,48,0.35);transition:all 0.15s ease}
        .premium-feature-card-cta:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(200,160,48,0.5)}
      `}</style>

      <div className={`premium-gate ${isPremium ? "unlocked" : isLocked ? "locked" : "soft"}`}>
        <div className="premium-gate-copy">
          <span className="premium-gate-badge">
            {isPremium ? `${planLabel} Unlocked` : isLocked ? "🔒 Premium Locked" : "Testing Mode"}
          </span>
          <div className="premium-gate-title">{feature} is a premium engine.</div>
          <div className="premium-gate-sub">
            {isPremium
              ? "Full access is active on your account (प्रीमियम सक्रिय है)।"
              : isLocked
                ? "यह मॉड्यूल केवल प्रीमियम और एलीट सदस्यों के लिए उपलब्ध है। अनलॉक करने के लिए अपग्रेड करें।"
                : "Billing enforcement is off, so this premium feature stays open for product testing."}
          </div>
        </div>
        <Link href="/dashboard/upgrade" className="premium-gate-cta">
          {isPremium ? "Manage Plan" : "Upgrade (अपग्रेड करें)"}
        </Link>
      </div>

      <div className={`premium-feature-shell ${isLocked ? "locked" : ""}`}>
        <div className="premium-feature-content">{children}</div>
        {isLocked && (
          <div className="premium-feature-overlay">
            <div className="premium-feature-card">
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
              <div className="premium-feature-card-title">{feature}</div>
              <div className="premium-feature-card-text">
                यह एडवांस्ड एस्ट्रो-वास्तु हिट थ्योरी, 4-सेकंड जीपीएस नेविगेटर, प्लॉट ड्यूल-ग्रिड व सूक्ष्म वास्तु विश्लेषण केवल प्रीमियम व एलीट मेंबर्स के लिए उपलब्ध है।
              </div>
              <Link href="/dashboard/upgrade" className="premium-feature-card-cta">
                ✦ Unlock with Premium (अपग्रेड करें)
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
