export interface ApiError {
  status: number | null;
  message: string;
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  marketCapRank: number;
}