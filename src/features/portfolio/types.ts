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