export interface Holding {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  amount: number;
  buyPrice: number;
  createdAt: string;
}

export interface UpdateHolding {
  amount?: number;
  buyPrice?: number;
}

export interface NewHolding {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  amount: number;
  buyPrice: number;
}

export interface PositionSummary {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string;
  amount: number;
  avgBuyPrice: number;
  invested: number;
  currentPrice: number | null;
  currentValue: number | null;
  priceChange24h: number | null;
  share: number | null;
}

export interface PortfolioSummaryData {
  positions: PositionSummary[];
  missingPrice: Holding[];
  totalInvested: number;
  totalValue: number | null;
  pnl: number | null;
  pnlPercent: number | null;
}