import { useEffect, useState } from "react";
import { fetchMarketChart } from "../api/coins";
import { isApiError } from "../api/client";
import type { ApiError, ChartPoint } from "../types";
import type { Currency } from "@/shared/lib/formatters";

interface UseMarketChartResult {
  data: ChartPoint[] | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

interface ChartCacheEntry {
  points: ChartPoint[];
  timestamp: number;
}

const CHART_TTL = 5 * 60 * 1000;

const chartCache = new Map<string, ChartCacheEntry>();

export function useMarketChart(
  coinId: string,
  currency: Currency,
  days: number,
): UseMarketChartResult {
  const [data, setData] = useState<ChartPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const key = `${coinId}|${currency}|${days}`;
      const cached = chartCache.get(key);
      console.log("useCoin cache:", { key, hit: !!cached, retryCount });

      if (
        retryCount === 0 &&
        cached &&
        Date.now() - cached.timestamp < CHART_TTL
      ) {
        setData(cached.points);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const points = await fetchMarketChart(coinId, currency, days, controller.signal);
        if (controller.signal.aborted) return;

        chartCache.set(key, { points, timestamp: Date.now() });

        setData(points);
        setIsLoading(false);
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(isApiError(e) ? e : { status: null, message: "Неизвестная ошибка" });
        setIsLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [coinId, currency, days, retryCount]);

  const refetch = () => setRetryCount((c) => c + 1);
  return { data, isLoading, error, refetch };
}