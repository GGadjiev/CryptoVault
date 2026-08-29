import type { Coin } from "../../types";
import type { ReactNode } from "react";
import {
  formatCompactMoney,
  formatMoney,
  formatPercent,
  getTrend
} from "@/shared/lib/formatters";
import styles from './CoinTable.module.scss'

interface CoinRowProps {
  coin: Coin,
  extra?: ReactNode
  onClick?: () => void
}

export const CoinRow = (props: CoinRowProps) => {
  const {
    coin,
    extra,
    onClick,
  } = props

  const trend = getTrend(coin.priceChange24h)

  const clickable = onClick !== undefined

  return (
    <tr
      onClick={onClick}
      className={clickable ? styles.rowClickable : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === "Enter") onClick() } : undefined}
    >
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