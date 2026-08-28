import type { ChartPoint, Coin, CoinDetails } from "../types";
import { client } from "../api/client";
import type {
  CoinGeckoDetailsResponse,
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

const toCoinDetails = (raw: CoinGeckoDetailsResponse): CoinDetails => {
  const firstHomepage = raw.links.homepage.find(url => url.trim() !== '')
  const cleanDescription = raw.description.en.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  return {
    id: raw.id,
    symbol: raw.symbol,
    name: raw.name,
    imageLarge: raw.image.large,
    description: cleanDescription,
    homepageUrl: firstHomepage ?? null,
    hashingAlgorithm: raw.hashing_algorithm,
    genesisDate: raw.genesis_date,
    currentPrice: raw.market_data.current_price.usd,
    high24h: raw.market_data.high_24h.usd,
    low24h: raw.market_data.low_24h.usd,
    marketCap: raw.market_data.market_cap.usd,
    totalVolume: raw.market_data.total_volume.usd,
    ath: raw.market_data.ath.usd,
    atl: raw.market_data.atl.usd,
    priceChange24h: raw.market_data.price_change_percentage_24h
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

export const fetchMarketChart = async (coinId: string, signal?: AbortSignal): Promise<ChartPoint[]> => {
  const response = await client.get<{ prices: [number, number][] }>(
    `/coins/${coinId}/market_chart`,
    {
      params: {
        vs_currency: "usd",
        days: 7
      },
      signal,
    }
  )
  return response.data.prices
}

export const fetchCoinDetails = async (coinId: string, signal?: AbortSignal): Promise<CoinDetails> => {
  const response = await client.get<CoinGeckoDetailsResponse>(
    `/coins/${coinId}`,
    {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
      signal,
    }
  )
  return toCoinDetails(response.data)
}