import type { Coin } from "@/features/market/types.ts";
import type { ReactNode } from "react";
import {
  formatCompactMoney,
  formatMoney,
  formatPercent,
  getTrend
} from "@/shared/lib/formatters.ts";
import styles from './CoinTable.module.scss'

interface CoinRowProps {
  coin: Coin,
  extra?: ReactNode
}

export const CoinRow = (props: CoinRowProps) => {
  const {
    coin,
    extra
  } = props

  const trend = getTrend(coin.priceChange24h)

  return (
    <tr>
      <td className={styles.rank}>
        {coin.marketCapRank}
      </td>
      <td className={styles.nameCell}>
        <img src={coin.image} alt='' width={24} height={24} />
        <div>
          <span className={styles.name}>{coin.name}</span>
          <span className={styles.symbol}>{coin.symbol.toUpperCase()}</span>
        </div>
        {extra}
      </td>
      <td>
        {formatMoney(coin.currentPrice)}
      </td>
      <td className={styles[trend]}>
        {formatPercent(coin.priceChange24h)}
      </td>
      <td>
        {formatCompactMoney(coin.marketCap)}
      </td>
    </tr>
  )
}