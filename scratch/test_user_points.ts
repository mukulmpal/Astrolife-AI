import { calculateChart } from "../src/lib/astro-engine/calculations";
import { auditUserWearables } from "../src/lib/astro-engine/bio-wearable-audit-engine";

const chart = calculateChart("Rachna", "1994-04-11", "11:00", "Delhi");
const result = auditUserWearables(chart, [
  { item: "silver", location: "wrist_right" },
  { item: "silver", location: "finger_little" },
  { item: "opal", location: "finger_ring" }
]);
console.log("Keys:", Object.keys(result));
for (const item of result.itemsAudited) {
  console.log(item.item, item.location, item.severity, item.badgeText);
  console.log("  mech:", item.mechanism);
}

