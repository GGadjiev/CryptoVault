import type { ChartPoint, Coin, CoinDetails } from "../types";
import { client } from "../api/client";
import type {
  CoinGeckoCurrencyMap,
  CoinGeckoDetailsResponse, CoinGeckoGlobalResponse,
  CoinGeckoMarketRow,
  CoinGeckoSearchResponse
} from "./responses";
import type {Currency} from "@/shared/lib/formatters.ts";

interface FetchMarketsOptions {
  signal?: AbortSignal,
  ids?: string[],
  currency?: Currency,
  page?: number,
  withSparkline?: boolean,
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
    sparkline7d: row.sparkline_in_7d?.price ?? []
  }
}

const toCoinDetails = (raw: CoinGeckoDetailsResponse, currency: Currency): CoinDetails => {
  const c = raw.market_data
  const firstHomepage = raw.links.homepage.find(url => url.trim() !== '')
  const cleanDescription = raw.description.en.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const apiCurrency = currency.toLowerCase() as keyof CoinGeckoCurrencyMap;
  const firstExplorer = raw.links.blockchain_site.find(url => url.trim() !== '')

  return {
    id: raw.id,
    symbol: raw.symbol,
    name: raw.name,
    imageLarge: raw.image.large,
    description: cleanDescription,
    homepageUrl: firstHomepage ?? null,
    hashingAlgorithm: raw.hashing_algorithm,
    genesisDate: raw.genesis_date,
    currentPrice: c.current_price[apiCurrency],
    high24h: c.high_24h[apiCurrency],
    low24h: c.low_24h[apiCurrency],
    marketCap: c.market_cap[apiCurrency],
    totalVolume: c.total_volume[apiCurrency],
    ath: c.ath[apiCurrency],
    atl: c.atl[apiCurrency],
    priceChange24h: c.price_change_percentage_24h,
    athChangePercentage: c.ath_change_percentage[apiCurrency],
    atlChangePercentage: c.atl_change_percentage[apiCurrency],
    circulatingSupply: c.circulating_supply,
    maxSupply: c.max_supply,
    explorerUrl: firstExplorer ?? null,
  }
}

export const fetchMarkets = async (options: FetchMarketsOptions): Promise<Coin[]> => {
  const { signal, ids, currency = 'USD', page = 1, withSparkline = true } = options
  const response = await client.get<CoinGeckoMarketRow[]>('/coins/markets', {
    params: {
      vs_currency: currency,
      order: "market_cap_desc",
      per_page: 50,
      page,
      ...(ids && ids.length > 0 ? { ids: ids.join(',') } : {}),
      sparkline: withSparkline
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

export const fetchMarketChart = async (coinId: string, currency: Currency, days: number, signal?: AbortSignal): Promise<ChartPoint[]> => {
  const apiCurrency = currency.toLowerCase();
  const response = await client.get<{ prices: [number, number][] }>(
    `/coins/${coinId}/market_chart`,
    {
      params: {
        vs_currency: apiCurrency,
        days
      },
      signal,
    }
  )
  return response.data.prices
}

let globalCache: { value: number; timestamp: number } | null = null;
const GLOBAL_TTL = 30 * 60 * 1000;

export async function fetchMarketGlobal(signal?: AbortSignal): Promise<number> {
  if (globalCache && Date.now() - globalCache.timestamp < GLOBAL_TTL) {
    return globalCache.value;
  }

  const response = await client.get<CoinGeckoGlobalResponse>("/global", { signal });
  const value = response.data.data.active_cryptocurrencies;
  globalCache = { value, timestamp: Date.now() };
  return value;
}

export const fetchCoinDetails = async (coinId: string, currency: Currency, signal?: AbortSignal): Promise<CoinDetails> => {
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
  return toCoinDetails(response.data, currency)
}