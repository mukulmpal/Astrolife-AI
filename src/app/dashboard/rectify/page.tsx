"use client";

import { BirthRectificationWorkbench } from "@/components/rectify/BirthRectificationWorkbench";
import "@/app/dashboard/shared.css";

export default function RectifyPage() {
  return (
    <div className="page max-w-6xl mx-auto py-6 px-4">
      <BirthRectificationWorkbench />
    </div>
  );
}
