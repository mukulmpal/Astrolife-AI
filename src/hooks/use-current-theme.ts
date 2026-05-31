'use client';

import { useEffect, useState } from 'react';
import { getCurrentTheme, getDayInfo } from '@/lib/theme-provider';

export type DayInfo = { graha: string; glyph: string; day: string } | null;

/**
 * Hook to get the current Vedic day theme in React components.
 * Returns the theme class name and the day's graha info.
 *
 * The values are intentionally resolved on mount (client-only) because
 * they depend on the user's local date/timezone — resolving them during
 * render would cause an SSR/client hydration mismatch.
 */
export function useCurrentTheme() {
  const [theme, setTheme] = useState<string>('theme-midnight');
  const [dayInfo, setDayInfo] = useState<DayInfo>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = getCurrentTheme();
    /* eslint-disable react-hooks/set-state-in-effect -- client-only init, see note above */
    setTheme(current);
    setDayInfo(getDayInfo(current) as DayInfo);
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  return { theme, dayInfo, mounted };
}
