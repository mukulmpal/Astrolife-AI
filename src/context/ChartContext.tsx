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

export interface ChartContextValue {
  birth: BirthDetails;
  chart: ChartData;
  loading: boolean;
  hasUserChart: boolean;
  isDemoChart: boolean;
  refreshChart: () => Promise<void>;
  setChartData: (newChart: ChartData) => void;
}

export const ChartContext = createContext<ChartContextValue | null>(null);

export function ChartProvider({ children }: { children: React.ReactNode }) {
  const [birth, setBirth] = useState<BirthDetails>(EMPTY_BIRTH);
  const [chart, setChart] = useState<ChartData>(() => buildChart(PLACEHOLDER_BIRTH));
  const [hasUserChart, setHasUserChart] = useState(false);
  const [loading, setLoading] = useState(true);

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

      const accountChart = await loadPrimaryChartFromAccount(user);
      if (accountChart) {
        saveCurrentChart(accountChart);
        setBirth(getBirthFromChart(accountChart));
        setChart(accountChart);
        setHasUserChart(true);
        setLoading(false);
        return;
      }

      if (user) {
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

        const deviceChart = loadCurrentChartFromDevice();
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
    refreshChart: loadChart,
    setChartData,
  }), [birth, chart, loading, hasUserChart, loadChart, setChartData]);

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
}

export function useChartEngine(): ChartContextValue {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartEngine must be used within a ChartProvider");
  }
  return context;
}
