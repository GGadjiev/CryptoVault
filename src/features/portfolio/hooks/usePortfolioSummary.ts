import type {
  Holding,
  PortfolioSummaryData, PositionSummary
} from "@/features/portfolio/types.ts";
import {usePortfolioStore} from "@/features/portfolio";
import {type Coin, useCoins} from "@/features/market";
import {useMemo} from "react";

const buildSummary = (holdings: Holding[], coins: Coin[]): PortfolioSummaryData => {
  const priceMap = new Map<string, Coin>()
  for (const coin of coins) {
    priceMap.set(coin.id, coin);
  }

  interface CoinBucket {
    holding: Holding;
    amount: number;
    cost: number;
  }

  const buckets = new Map<string, CoinBucket>()
  const missingPrice: Holding[] = []

  for (const hold of holdings) {
    const coin = priceMap.get(hold.coinId)

    if (coin === undefined) {
      missingPrice.push(hold)
      continue
    }

    const existing = buckets.get(hold.coinId)
    if (existing) {
      existing.amount += hold.amount
      existing.cost += hold.amount * hold.buyPrice
    } else {
      buckets.set(hold.coinId, {
        holding: hold,
        amount: hold.amount,
        cost: hold.amount * hold.buyPrice,
      })
    }
  }

  let totalInvested = 0
  let totalValue = 0

  for (const bucket of buckets.values()) {
    const coin = priceMap.get(bucket.holding.coinId)!
    totalInvested += bucket.cost
    totalValue += bucket.amount * coin.currentPrice
  }

  const positions: PositionSummary[] = []

  for (const bucket of buckets.values()) {
    const coin = priceMap.get(bucket.holding.coinId)!

    const avgBuyPrice = bucket.cost / bucket.amount
    const share = totalValue > 0 ? (bucket.amount * coin.currentPrice) / totalValue : null

    positions.push({
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      coinImage: coin.image,
      amount: bucket.amount,
      avgBuyPrice,
      invested: bucket.cost,
      currentPrice: coin.currentPrice,
      currentValue: bucket.amount * coin.currentPrice,
      priceChange24h: coin.priceChange24h,
      share
    })
  }

  const pnl = totalValue - totalInvested
  const pnlPercent = totalInvested > 0 ? (pnl / totalInvested) * 100 : null

  return {
    positions,
    missingPrice,
    totalInvested,
    totalValue: positions.length > 0 ? totalValue : null,
    pnl: positions.length > 0 ? pnl : null,
    pnlPercent: positions.length > 0 ? pnlPercent : null,
  }
}

export const usePortfolioSummary = (): PortfolioSummaryData => {
  const holdings = usePortfolioStore(s => s.holdings);
  const { data: coins } = useCoins()

  return useMemo(
    () => buildSummary(holdings, coins ?? []),
    [holdings, coins]
  )
}