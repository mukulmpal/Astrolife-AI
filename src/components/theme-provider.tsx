'use client';

import { useEffect, useState } from 'react';
import { getCurrentTheme, applyTheme, getDayInfo } from '@/lib/theme-provider';
import type { DayInfo } from '@/hooks/use-current-theme';

/**
 * ThemeProvider — wraps entire app
 * Auto-applies day-based Vedic colors at startup + midnight
 * Works on: landing, dashboard, reports, all pages
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [dayInfo, setDayInfo] = useState<DayInfo>(null);

  useEffect(() => {
    // Resolve + apply the day's theme on mount (client-only: depends on local time).
    const theme = getCurrentTheme();
    applyTheme(theme);
    /* eslint-disable react-hooks/set-state-in-effect -- client-only init */
    setDayInfo(getDayInfo(theme) as DayInfo);
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Re-apply at the next IST midnight so the palette rotates automatically.
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const midnight = new Date(istTime);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);

    const timer = setTimeout(() => {
      const newTheme = getCurrentTheme();
      setDayInfo(getDayInfo(newTheme) as DayInfo);
      applyTheme(newTheme);
    }, midnight.getTime() - istTime.getTime());

    return () => clearTimeout(timer);
  }, []);

  // Debug badge (optional — shows current graha)
  if (!mounted) return <>{children}</>;

  return (
    <>
      {children}
      {/* Optional: Debug badge showing current day's graha */}
      {process.env.NODE_ENV === 'development' && dayInfo && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'var(--al-surface)',
            border: '1px solid var(--al-line-strong)',
            color: 'var(--al-text-mute)',
            fontSize: '11px',
            fontWeight: 600,
            zIndex: 9999,
            letterSpacing: '0.1em',
          }}
        >
          <div>{dayInfo.glyph} {dayInfo.graha}</div>
          <div style={{ fontSize: '9px', marginTop: '4px' }}>{dayInfo.day}</div>
        </div>
      )}
    </>
  );
}
