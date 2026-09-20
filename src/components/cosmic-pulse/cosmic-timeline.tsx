"use client";

import React from "react";
import type { CosmicForecastEvent } from "@/lib/astro-engine/cosmic-pulse/forecast/forecast-types";
import { CosmicEvent } from "./cosmic-event";

interface CosmicTimelineProps {
  events: CosmicForecastEvent[];
  onOpenDetails: (event: CosmicForecastEvent) => void;
  startDate?: Date;
}

export const CosmicTimeline: React.FC<CosmicTimelineProps> = ({
  events,
  onOpenDetails,
  startDate = new Date(),
}) => {
  if (events.length === 0) {
    return (
      <div
        className="py-12 px-4 text-center rounded-xl border"
        style={{
          background: "var(--app-card)",
          borderColor: "var(--app-border)",
        }}
      >
        <div className="text-3xl mb-3" style={{ color: "var(--app-gold)" }}>✦</div>
        <h4 className="text-base font-serif font-bold" style={{ color: "var(--app-fg)" }}>
          Quiet Celestial Current
        </h4>
        <p className="text-xs sm:text-sm max-w-md mx-auto mt-1 leading-relaxed" style={{ color: "var(--app-muted)" }}>
          No conflicting planetary aspects or exact natal transit hits culminate within this window. 
          Use this period of astrological stability to pursue sustained, focused efforts.
        </p>
      </div>
    );
  }

  // Bucket events by time from now
  const nowMs = startDate.getTime();
  const bucket7Days: CosmicForecastEvent[] = [];
  const bucket30Days: CosmicForecastEvent[] = [];
  const bucket90Days: CosmicForecastEvent[] = [];

  events.forEach((ev) => {
    const time = (ev.timing.exactAt || ev.timing.peakAt || ev.timing.contactAt).getTime();
    const diffDays = (time - nowMs) / 86400000;
    if (diffDays <= 7) {
      bucket7Days.push(ev);
    } else if (diffDays <= 30) {
      bucket30Days.push(ev);
    } else {
      bucket90Days.push(ev);
    }
  });

  const sections = [
    { title: "Immediate Focus · Next 7 Days", items: bucket7Days },
    { title: "Upcoming Alignment · 8 to 30 Days", items: bucket30Days },
    { title: "Extended Radar · 31 to 90 Days", items: bucket90Days },
  ].filter((sec) => sec.items.length > 0);

  return (
    <div className="space-y-8 relative">
      {sections.map((section, secIdx) => (
        <div key={secIdx} className="space-y-3">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--app-gold)" }} />
            <h4
              className="text-xs uppercase tracking-widest font-bold font-mono"
              style={{ color: "var(--app-gold)" }}
            >
              {section.title}
            </h4>
            <div
              className="flex-1 h-[1px]"
              style={{ background: "linear-gradient(to right, var(--app-border), transparent)" }}
            />
            <span className="text-[11px] font-mono" style={{ color: "var(--app-muted)" }}>
              {section.items.length} {section.items.length === 1 ? "event" : "events"}
            </span>
          </div>

          {/* Events List */}
          <div
            className="relative pl-4 sm:pl-6 border-l-2 space-y-4"
            style={{ borderColor: "var(--app-border)" }}
          >
            {section.items.map((event) => (
              <div key={event.id} className="relative">
                {/* Timeline node icon on the vertical line */}
                <div
                  className="absolute -left-[21px] sm:-left-[29px] top-5 w-3 h-3 rounded-full border-2"
                  style={{
                    background: "var(--app-card)",
                    borderColor: "var(--app-gold)",
                  }}
                />
                <CosmicEvent
                  event={event}
                  onOpenDetails={onOpenDetails}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

