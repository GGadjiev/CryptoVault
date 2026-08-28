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

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  imageLarge: string;
  description: string;
  homepageUrl: string | null;
  hashingAlgorithm: string | null;
  genesisDate: string | null;
  currentPrice: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  totalVolume: number;
  ath: number
  atl: number;
  priceChange24h: number | null;
}

export type ChartPoint = [timestamp: number, price: number];