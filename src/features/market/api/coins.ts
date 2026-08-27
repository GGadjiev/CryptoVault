import type { Coin } from "../types";
import { client } from "../api/client";
import type {
  CoinGeckoMarketRow,
  CoinGeckoSearchResponse
} from "./responses";

interface fetchMarketsOptions {
  signal?: AbortSignal,
  ids?: string[],
}

const toCoin = (row: CoinGeckoMarketRow): Coin => {
  return {
    id: row.id,
    symbol: row.symbol,
    name: row.name,
    image: row.image,
    currentPrice: row.current_price,
    priceChange24h: row.price_change_percentage_24h,
    marketCap: row.market_cap,
    marketCapRank: row.market_cap_rank,
  }
}

export const fetchMarkets = async (options: fetchMarketsOptions): Promise<Coin[]> => {
  const { signal, ids } = options
  const response = await client.get<CoinGeckoMarketRow[]>('/coins/markets', {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 50,
      page: 1,
      ...(ids && ids.length > 0 ? { ids: ids.join(',') } : {}),
    },
    signal,
  })
  return response.data.map(toCoin)
}

export const fetchCoinIds = async (query: string, signal?: AbortSignal): Promise<string[]> => {
  const response = await client.get<CoinGeckoSearchResponse>('/search', {
    params: { query },
    signal,
  })
  return response.data.coins.map(coin => coin.id)
}