import { useEffect, useState } from "react";
import { fetchMarketChart } from "../api/coins";
import { isApiError } from "../api/client";
import type { ApiError, ChartPoint } from "../types";

interface UseMarketChartResult {
  data: ChartPoint[] | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export function useMarketChart(coinId: string, days: number): UseMarketChartResult {
  const [data, setData] = useState<ChartPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);
      setData(null);            // смена диапазона — данные сбрасываем, как в useCoin

      try {
        const points = await fetchMarketChart(coinId, days, controller.signal);
        if (controller.signal.aborted) return;
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
  }, [coinId, days, retryCount]);    // ← days в зависимостях!

  const refetch = () => setRetryCount((c) => c + 1);
  return { data, isLoading, error, refetch };
}