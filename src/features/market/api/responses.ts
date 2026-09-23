export interface CoinGeckoMarketRow {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  sparkline_in_7d: { price: number[] }
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
    current_price: CoinGeckoCurrencyMap;
    high_24h: { usd: number; rub: number; eur: number };
    low_24h: { usd: number; rub: number; eur: number };
    market_cap: { usd: number; rub: number; eur: number };
    ath: { usd: number; rub: number; eur: number };
    atl: { usd: number; rub: number; eur: number };
    total_volume: { usd: number; rub: number; eur: number };
    price_change_percentage_24h: number | null;
    ath_change_percentage: CoinGeckoCurrencyMap;
    atl_change_percentage: CoinGeckoCurrencyMap;
    circulating_supply: number | null;
    max_supply: number | null;
  }
}

export interface CoinGeckoCurrencyMap {
  usd: number;
  rub: number;
  eur: number;
}

export interface CoinGeckoGlobalResponse {
  data: {
    active_cryptocurrencies: number;
  }
}