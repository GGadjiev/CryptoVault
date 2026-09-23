import { useEffect, useState } from "react";
import { fetchCoinDetails } from "../api/coins";
import { isApiError } from "../api/client";
import type { ApiError, CoinDetails } from "../types";
import type { Currency } from "@/shared/lib/formatters";

interface UseCoinResult {
  data: CoinDetails | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
}

interface CoinCacheEntry {
  details: CoinDetails;
  timestamp: number;
}

const COIN_TTL = 5 * 60 * 1000;

const coinCache = new Map<string, CoinCacheEntry>();

export const useCoin = (coinId: string, currency: Currency): UseCoinResult => {
  const [data, setData] = useState<CoinDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      const key = `${coinId}|${currency}`;
      const cached = coinCache.get(key);

      if (
        retryCount === 0 &&
        cached &&
        Date.now() - cached.timestamp < COIN_TTL
      ) {
        setData(cached.details);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        const details = await fetchCoinDetails(coinId, currency, controller.signal);
        if (controller.signal.aborted) return;

        coinCache.set(key, { details, timestamp: Date.now() });

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
  }, [coinId, currency, retryCount]);

  const refetch = () => setRetryCount((c) => c + 1);
  return { data, isLoading, error, refetch };
};