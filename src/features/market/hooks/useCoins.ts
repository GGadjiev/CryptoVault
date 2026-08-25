import type {ApiError, Coin} from "@/features/market/types.ts";
import {useEffect, useState} from "react";
import {fetchCoinIds, fetchMarkets} from "@/features/market/api/coins.ts";
import {isApiError} from "@/features/market/api/client.ts";

interface UseCoinsResult {
  data: Coin[] | null
  isLoading: boolean
  error: ApiError | null
  refetch: () => void
}

interface UseCoinsOptions {
  search?: string
}

export const useCoins = (options: UseCoinsOptions = {}): UseCoinsResult => {
  const [data, setData] = useState<Coin[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const search= options.search?.trim() || ''

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let coins: Coin[]
        if (search) {
          const ids = await fetchCoinIds(search, controller.signal)

          if (controller.signal.aborted) return

          if (ids.length === 0) {
            setData([])
            setIsLoading(false)
            return
          }
          coins = await fetchMarkets({ signal: controller.signal, ids })
        } else {
          coins = await fetchMarkets({ signal: controller.signal })
        }

        if (controller.signal.aborted) return
        setData(coins)
        setIsLoading(false)

      } catch (error) {
        if (controller.signal.aborted) return
        setError(isApiError(error) ? error : { status: null, message: "Неизвестная ошибка" })
        setIsLoading(false)
      }
    }

    load()

    return () => controller.abort()
  }, [retryCount, search])

  const refetch = () => {
    setRetryCount((count) => count + 1)
  }

  return { data, isLoading, error, refetch }
}