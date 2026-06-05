import { redirect } from "next/navigation";

export default function LegacyTransitRippleRedirect() {
  redirect("/dashboard/transits/ripple");
}
