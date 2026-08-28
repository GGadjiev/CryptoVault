import { useEffect, useState } from "react";
import { fetchCoinDetails } from "../api/coins";
import { isApiError } from "../api/client";
import type { ApiError, CoinDetails } from "../types";

interface UseCoinResult {
  data: CoinDetails | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

export const useCoin = (coinId: string): UseCoinResult => {
  const [data, setData] = useState<CoinDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const details = await fetchCoinDetails(coinId, controller.signal);
        if (controller.signal.aborted) return;
        setData(details);
        setIsLoading(false);
      } catch (e) {
        if (controller.signal.aborted) return;
        setError(isApiError(e) ? e : { status: null, message: "Неизвестная ошибка" });
        setIsLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [coinId, retryCount]);

  const refetch = () => setRetryCount((c) => c + 1);
  return { data, isLoading, error, refetch };
}