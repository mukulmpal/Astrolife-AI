/**
 * Theme Provider — Vedic day-based color system
 * Detects current day (IST timezone) + applies color palette
 * Auto-updates at midnight
 */

export const DAY_THEMES = {
  0: 'theme-saffron',   // Sunday - Surya (Sun)
  1: 'theme-ivory',     // Monday - Chandra (Moon)
  2: 'theme-maroon',    // Tuesday - Mangal (Mars)
  3: 'theme-forest',    // Wednesday - Budha (Mercury)
  4: 'theme-midnight',  // Thursday - Guru (Jupiter)
  5: 'theme-ivory',     // Friday - Shukra (Venus)
  6: 'theme-twilight',  // Saturday - Shani (Saturn)
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
  'theme-saffron': { graha: 'Sun', glyph: '☉', day: 'Sunday' },
  'theme-ivory': { graha: 'Moon / Venus', glyph: '☽', day: 'Monday / Friday' },
  'theme-maroon': { graha: 'Mars', glyph: '♂', day: 'Tuesday' },
  'theme-forest': { graha: 'Mercury', glyph: '☿', day: 'Wednesday' },
  'theme-midnight': { graha: 'Jupiter', glyph: '♃', day: 'Thursday' },
  'theme-twilight': { graha: 'Saturn', glyph: '♄', day: 'Saturday' },
} as const;

/**
 * Get current theme based on IST time
 * IST = UTC+5:30
 */
export function getCurrentTheme(): (typeof DAY_THEMES)[keyof typeof DAY_THEMES] {
  const now = new Date();

  // Convert to IST (UTC+5:30)
  const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = istTime.getDay(); // 0 = Sunday, 1 = Monday, etc.

  return DAY_THEMES[day as keyof typeof DAY_THEMES];
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
