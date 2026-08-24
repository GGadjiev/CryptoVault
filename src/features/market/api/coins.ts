import type { Coin } from "../types.ts";
import {client} from "@/features/market/api/client.ts";
import type {CoinGeckoMarketRow} from "@/features/market/api/response.ts";

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

export const fetchMarkets = async (): Promise<Coin[]> => {
  const response = await client.get<CoinGeckoMarketRow[]>('/coins/markets', {
    params: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 50,
      page: 1,
    }
  })
  return response.data.map(toCoin)
}