/**
 * Theme Provider — Vedic day-based color system
 * Detects current day (IST timezone) + applies color palette
 * Auto-updates at midnight
 */

export const DAY_THEMES = {
  0: 'theme-ivory',
  1: 'theme-ivory',
  2: 'theme-ivory',
  3: 'theme-ivory',
  4: 'theme-ivory',
  5: 'theme-ivory',
  6: 'theme-ivory',
} as const;

export const DAY_NAMES = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
} as const;

export const GRAHA_INFO = {
  'theme-saffron': { graha: 'Ivory Parchment', glyph: '✦', day: 'Permanent Warm Theme' },
  'theme-ivory': { graha: 'Ivory Parchment', glyph: '✦', day: 'Permanent Warm Theme' },
  'theme-maroon': { graha: 'Ivory Parchment', glyph: '✦', day: 'Permanent Warm Theme' },
  'theme-forest': { graha: 'Ivory Parchment', glyph: '✦', day: 'Permanent Warm Theme' },
  'theme-midnight': { graha: 'Ivory Parchment', glyph: '✦', day: 'Permanent Warm Theme' },
  'theme-twilight': { graha: 'Ivory Parchment', glyph: '✦', day: 'Permanent Warm Theme' },
} as const;

/**
 * Permanently locked to Warm Cream Parchment (theme-ivory)
 */
export function getCurrentTheme(): (typeof DAY_THEMES)[keyof typeof DAY_THEMES] {
  return 'theme-ivory';
}

/**
 * Get day info (graha + glyph)
 */
export function getDayInfo(theme: string) {
  return GRAHA_INFO[theme as keyof typeof GRAHA_INFO] || null;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: string) {
  if (typeof document === 'undefined') return;

  // Remove all theme classes
  Object.values(DAY_THEMES).forEach((t) => {
    document.documentElement.classList.remove(t);
    document.body.classList.remove(t);
  });

  // Add current theme
  document.documentElement.classList.add(theme);
  document.body.classList.add(theme);
}

/**
 * Initialize theme on page load + set auto-update at midnight
 */
export function initTheme() {
  if (typeof window === 'undefined') return;

  const theme = getCurrentTheme();
  applyTheme(theme);

  // Calculate time until midnight IST
  const now = new Date();
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const midnight = new Date(istTime);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);

  const timeUntilMidnight = midnight.getTime() - istTime.getTime();

  // Schedule theme update at midnight
  setTimeout(() => {
    const newTheme = getCurrentTheme();
    applyTheme(newTheme);
    // Set up next midnight update
    initTheme();
  }, timeUntilMidnight);
}

/**
 * Hook for React components to get current theme
 */
export function useCurrentTheme() {
  'use client';
  // This needs to be in a client component to use React hooks
  // See theme-provider.tsx for the actual hook implementation
  return { theme: 'theme-midnight', dayInfo: null };
}
