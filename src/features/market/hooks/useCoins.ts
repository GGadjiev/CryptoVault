import { useEffect, useState } from "react";
import { fetchCoinIds, fetchMarketGlobal, fetchMarkets } from "../api/coins";
import { isApiError } from "../api/client";
import type { ApiError, Coin } from "../types";
import type { Currency } from "@/shared/lib/formatters";

interface UseCoinsResult {
  data: Coin[] | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => void;
  loadMore: () => void;
  showCount: number;
  totalCount: number | null;
  hasMore: boolean;
}

interface UseCoinsOptions {
  search?: string;
  ids?: string[];
  currency?: Currency;
}

interface CacheEntry {
  coins: Coin[];
  totalCount: number | null;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000;

const cache = new Map<string, CacheEntry>();

const cacheKey = (
  search: string,
  ids: string[] | undefined,
  currency: Currency,
  page: number,
): string =>
  [search, ids?.join(",") ?? "", currency, page].join("|");

export const useCoins = (options: UseCoinsOptions = {}): UseCoinsResult => {
  const [data, setData] = useState<Coin[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const search = options.search?.trim() || "";
  const ids = options.ids;
  const currency = options.currency ?? "USD";

  useEffect(() => {
    setPage(1);
  }, [search, currency, ids]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      const key = cacheKey(search, ids, currency, page);
      const cached = cache.get(key);

      if (
        retryCount === 0 &&
        cached &&
        Date.now() - cached.timestamp < CACHE_TTL
      ) {
        setData(cached.coins);
        setTotalCount((prev) => cached.totalCount ?? prev);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        let coins: Coin[];
        let totalCountFromApi: number | null = null;

        if (search) {
          const foundIds = await fetchCoinIds(search, controller.signal);
          if (controller.signal.aborted) return;

          if (foundIds.length === 0) {
            cache.set(key, { coins: [], totalCount: null, timestamp: Date.now() });
            setData([]);
            setTotalCount(null);
            setIsLoading(false);
            return;
          }
          coins = await fetchMarkets({
            signal: controller.signal,
            ids: foundIds,
            currency,
            withSparkline: false,
          });

        } else if (ids && ids.length > 0) {
          coins = await fetchMarkets({
            signal: controller.signal,
            ids,
            currency,
            withSparkline: true,
          });

        } else if (ids) {
          coins = [];

        } else {
          if (page === 1) {
            const total = await fetchMarketGlobal(controller.signal);
            if (controller.signal.aborted) return;
            totalCountFromApi = total;
          }
          coins = await fetchMarkets({
            signal: controller.signal,
            currency,
            page,
          });
        }

        if (controller.signal.aborted) return;

        cache.set(key, {
          coins,
          totalCount: totalCountFromApi,
          timestamp: Date.now(),
        });

        setData((prev) =>
          page === 1 ? coins : [...(prev ?? []), ...coins],
        );
        setTotalCount((prev) => totalCountFromApi ?? prev);
        setIsLoading(false);

      } catch (error) {
        if (controller.signal.aborted) return;
        setError(
          isApiError(error)
            ? error
            : { status: null, message: "Неизвестная ошибка" },
        );
        setIsLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [retryCount, search, ids, currency, page]);

  const refetch = () => {
    setRetryCount((count) => count + 1);
  };

  const loadMore = () => setPage((p) => p + 1);

  const showCount = data?.length ?? 0;
  const hasMore =
    totalCount !== null && data !== null && data.length < totalCount;

  return { data, isLoading, error, refetch, loadMore, showCount, totalCount, hasMore };
};