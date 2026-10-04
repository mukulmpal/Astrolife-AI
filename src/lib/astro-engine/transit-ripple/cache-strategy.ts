/**
 * ============================================================================
 * ASTROLIFE — 3-TIER TTL CACHE STRATEGY FOR TRANSIT RIPPLE
 * ============================================================================
 * Caches calculated transit narratives using the Triple Clock methodology:
 * 1. Macro (Dasha): 24 Hours
 * 2. Meso (Outer Transit Planets): 24 Hours
 * 3. Micro (Moon Nakshatra + Navatara): 4 Hours (Intra-day shifts)
 *
 * Hard daily invalidation is naturally enforced via YYYY-MM-DD scanDate in the cache key.
 * ============================================================================
 */

import type { TransitRippleResult } from "./types";

interface CacheEntry {
  data: TransitRippleResult;
  timestamp: number;
  ttlMs: number;
}

const DEFAULT_MICRO_TTL_MS = 4 * 60 * 60 * 1000; // 4 Hours
const MAX_CACHE_ENTRIES = 500;

class TransitRippleCache {
  private cache = new Map<string, CacheEntry>();

  public buildKey(
    chartIdentifier: string,
    scanDate: string,
    selectedPlanet: string,
    language: string
  ): string {
    return `tr:${chartIdentifier}:${scanDate}:${selectedPlanet}:${language}`;
  }

  public get(key: string): TransitRippleResult | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  public set(
    key: string,
    data: TransitRippleResult,
    ttlMs: number = DEFAULT_MICRO_TTL_MS
  ): void {
    // Evict oldest if limit reached
    if (this.cache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs,
    });
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

export const transitRippleCache = new TransitRippleCache();
