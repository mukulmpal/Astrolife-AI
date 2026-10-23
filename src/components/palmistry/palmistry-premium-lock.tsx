import type { PalmistryProductFeature } from "@/lib/palmistry/product-gating";
import { getPalmistryUpgradeMessage } from "@/lib/palmistry/product-gating";

type PalmistryPremiumLockProps = {
  feature: PalmistryProductFeature;
  title?: string;
};

export function PalmistryPremiumLock({
  feature,
  title = "Premium Feature Locked",
}: PalmistryPremiumLockProps) {
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-black via-zinc-950 to-stone-950 p-5 shadow-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70">AstroLife Premium</p>
      <h3 className="mt-3 text-xl font-bold text-amber-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{getPalmistryUpgradeMessage(feature)}</p>
      <a href="/dashboard/upgrade" className="mt-5 inline-flex rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-200">
        Upgrade Now
      </a>
    </div>
  );
}
