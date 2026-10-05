"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  BirthDetails,
  ChartData,
  EMPTY_BIRTH,
  PLACEHOLDER_BIRTH,
  buildChart,
  getBirthFromChart,
  loadPrimaryChartFromAccount,
  saveCurrentChart,
  getProfileBirth,
  saveChartToAccount,
  loadCurrentChartFromDevice,
  clearCurrentChart,
} from "@/lib/user-chart";
import { createClient } from "@/lib/supabase/client";
import { isEliteEmail, isFullAccessEnabled, normalizeTier, type SubscriptionTier } from "@/lib/access";

export interface ChartContextValue {
  birth: BirthDetails;
  chart: ChartData;
  loading: boolean;
  hasUserChart: boolean;
  isDemoChart: boolean;
  userTier: SubscriptionTier;
  isElite: boolean;
  refreshChart: () => Promise<void>;
  setChartData: (newChart: ChartData) => void;
}

export const ChartContext = createContext<ChartContextValue | null>(null);

let cachedDefaultChart: ChartData | null = null;
function getStaticPlaceholderChart(): ChartData {
  if (!cachedDefaultChart) {
    cachedDefaultChart = buildChart(PLACEHOLDER_BIRTH);
  }
  return cachedDefaultChart;
}

export function ChartProvider({ children }: { children: React.ReactNode }) {
  // Synchronous optimistic read from device cache (localStorage)
  const initialChart = typeof window !== "undefined" ? loadCurrentChartFromDevice() : null;
  const [birth, setBirth] = useState<BirthDetails>(() =>
    initialChart ? getBirthFromChart(initialChart) : EMPTY_BIRTH
  );
  const [chart, setChart] = useState<ChartData>(() => initialChart ?? getStaticPlaceholderChart());
  const [hasUserChart, setHasUserChart] = useState<boolean>(() => Boolean(initialChart));
  const [loading, setLoading] = useState<boolean>(() => !initialChart);
  const [userTier, setUserTier] = useState<SubscriptionTier>(() => (isFullAccessEnabled() ? "elite" : "free"));
  const [isElite, setIsElite] = useState<boolean>(() => isFullAccessEnabled());

  // ── Reactive synchronizer: Catch instant chart switch events across components ──
  useEffect(() => {
    const handleChartUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<ChartData>;
      const nextChart = customEvent.detail;
      if (nextChart && nextChart.planets) {
        setBirth(getBirthFromChart(nextChart));
        setChart(nextChart);
        setHasUserChart(true);
        setLoading(false);
      }
    };

    const handleChartCleared = () => {
      setBirth(EMPTY_BIRTH);
      setChart(getStaticPlaceholderChart());
      setHasUserChart(false);
      setLoading(false);
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "currentChart") {
        if (!e.newValue) {
          handleChartCleared();
        } else {
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed && parsed.planets) {
              const revived = loadCurrentChartFromDevice();
              if (revived) {
                setBirth(getBirthFromChart(revived));
                setChart(revived);
                setHasUserChart(true);
                setLoading(false);
              }
            }
          } catch {}
        }
      }
    };

    window.addEventListener("astrolife:chart-updated", handleChartUpdated);
    window.addEventListener("astrolife:chart-cleared", handleChartCleared);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("astrolife:chart-updated", handleChartUpdated);
      window.removeEventListener("astrolife:chart-cleared", handleChartCleared);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const loadChart = useCallback(async () => {
    try {
      const supabase = createClient();
      let user = null;
      try {
        const authRes = await supabase.auth.getUser();
        user = authRes.data?.user ?? null;
      } catch {
        // Fallback to anonymous/cached state if lock is held
      }

      // ── Resolve user tier globally ──
      let resolvedTier: SubscriptionTier = isFullAccessEnabled() ? "elite" : "free";
      let resolvedElite = isFullAccessEnabled();

      if (user) {
        const userIsElite =
          (user.email && isEliteEmail(user.email)) ||
          (user as any).app_metadata?.subscription_tier === "elite" ||
          (user as any).user_metadata?.subscription_tier === "elite";

        if (userIsElite) {
          resolvedTier = "elite";
          resolvedElite = true;
        } else {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name,dob,tob,city,lat,lon,tz,subscription_tier")
            .eq("id", user.id)
            .maybeSingle();

          resolvedTier = normalizeTier(profile?.subscription_tier, user.email);
          resolvedElite = resolvedTier === "elite";
        }
      }

      setUserTier(resolvedTier);
      setIsElite(resolvedElite);

      if (user) {
        // If device storage already has a user-selected chart, preserve it
        const deviceChart = loadCurrentChartFromDevice();
        if (deviceChart && deviceChart.planets && deviceChart.name) {
          setBirth(getBirthFromChart(deviceChart));
          setChart(deviceChart);
          setHasUserChart(true);
          setLoading(false);
          return;
        }

        const accountChart = await loadPrimaryChartFromAccount(user);
        if (accountChart) {
          saveCurrentChart(accountChart);
          setBirth(getBirthFromChart(accountChart));
          setChart(accountChart);
          setHasUserChart(true);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("name,dob,tob,city,lat,lon,tz")
          .eq("id", user.id)
          .maybeSingle();

        const profileBirth = getProfileBirth(profile);
        if (profileBirth) {
          const nextChart = buildChart(profileBirth);
          await saveChartToAccount(nextChart, { replacePrimary: true });
          setBirth(profileBirth);
          setChart(nextChart);
          setHasUserChart(true);
          setLoading(false);
          return;
        }

        if (deviceChart) {
          await saveChartToAccount(deviceChart, { replacePrimary: true });
          setBirth(getBirthFromChart(deviceChart));
          setChart(deviceChart);
          setHasUserChart(true);
          setLoading(false);
          return;
        }

        clearCurrentChart();
        setHasUserChart(false);
        setLoading(false);
        return;
      }

      // Non-logged-in user
      const storedChart = loadCurrentChartFromDevice();
      if (storedChart) {
        setBirth(getBirthFromChart(storedChart));
        setChart(storedChart);
        setHasUserChart(true);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("ChartProvider load error:", error);
    }

    setHasUserChart(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadChart();
  }, [loadChart]);

  const setChartData = useCallback((newChart: ChartData) => {
    setBirth(getBirthFromChart(newChart));
    setChart(newChart);
    setHasUserChart(true);
    setLoading(false);
    saveCurrentChart(newChart);
  }, []);

  const value = useMemo<ChartContextValue>(() => ({
    birth,
    chart,
    loading,
    hasUserChart,
    isDemoChart: !hasUserChart,
    userTier,
    isElite,
    refreshChart: loadChart,
    setChartData,
  }), [birth, chart, loading, hasUserChart, userTier, isElite, loadChart, setChartData]);

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
}

export function useChartEngine(): ChartContextValue {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartEngine must be used within a ChartProvider");
  }
  return context;
}

export function useUserTier(): { userTier: SubscriptionTier; isElite: boolean } {
  const context = useContext(ChartContext);
  if (!context) {
    const full = isFullAccessEnabled();
    return { userTier: full ? "elite" : "free", isElite: full };
  }
  return { userTier: context.userTier, isElite: context.isElite };
}
