export interface CoinGeckoMarketRow {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
}

export interface CoinGeckoSearchResult {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}

export interface CoinGeckoSearchResponse {
  coins: CoinGeckoSearchResult[];
}

export interface CoinGeckoDetailsResponse {
  id: string;
  symbol: string;
  name: string;
  hashing_algorithm: string | null;
  genesis_date: string | null;
  image: {
    thumb: string;
    small: string;
    large: string;
  }
  description: { en: string; };
  links: {
    homepage: string[];
    blockchain_site: string[];
  }
  market_data: {
    current_price: { usd: number; };
    high_24h: { usd: number };
    low_24h: { usd: number };
    market_cap: { usd: number };
    ath: { usd: number };
    atl: { usd: number };
    price_change_percentage_24h: number | null;
    total_volume: { usd: number };
  }
}