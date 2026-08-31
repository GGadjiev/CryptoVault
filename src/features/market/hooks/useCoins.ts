import type {ApiError, Coin} from "../types";
import {useEffect, useState} from "react";
import {fetchCoinIds, fetchMarkets} from "../api/coins";
import {isApiError} from "../api/client";

interface UseCoinsResult {
  data: Coin[] | null
  isLoading: boolean
  error: ApiError | null
  refetch: () => void
}

interface UseCoinsOptions {
  search?: string
  ids?: string[]
}

export const useCoins = (options: UseCoinsOptions = {}): UseCoinsResult => {
  const [data, setData] = useState<Coin[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const search= options.search?.trim() || ''
  const ids = options.ids

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let coins: Coin[]
        if (search) {
          const foundIds = await fetchCoinIds(search, controller.signal)

          if (controller.signal.aborted) return

          if (foundIds.length === 0) {
            setData([])
            setIsLoading(false)
            return
          }
          coins = await fetchMarkets({ signal: controller.signal, ids: foundIds })
        } else if (ids && ids.length > 0) {
          coins = await fetchMarkets({ signal: controller.signal, ids })
        } else if (ids) {
          coins = []
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
  }, [retryCount, search, ids])

  const refetch = () => {
    setRetryCount((count) => count + 1)
  }

  return { data, isLoading, error, refetch }
}