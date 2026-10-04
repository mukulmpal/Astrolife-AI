import { TransitRipplePanelV2 } from "@/components/transit/TransitRipplePanelV2";

export default function TransitRippleDirectPage() {
  return (
    <main
      className="w-full min-h-screen py-6 px-4 sm:px-6"
      style={{ background: "var(--al-bg, #FAF7F2)" }}
    >
      <div className="max-w-[1140px] mx-auto">
        <TransitRipplePanelV2 />
      </div>
    </main>
  );
}
