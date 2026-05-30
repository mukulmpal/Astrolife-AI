import { TransitRipplePanelV2 } from "@/components/transit/TransitRipplePanelV2";
import { PremiumFeature } from "@/components/premium-feature";

export const dynamic = "force-dynamic";

export default function DashboardTransitRipplePage() {
  return (
    <PremiumFeature feature="Transit Ripple">
      <TransitRipplePanelV2 />
    </PremiumFeature>
  );
}
