import type {CoinDetails} from "../../types";
import {formatMoney, formatPercent, getTrend} from "@/shared/lib/formatters.ts";
import styles from './CoinDetails.module.scss'

interface CoinHeaderProps {
  details: CoinDetails;
}

export const CoinHeader = (props: CoinHeaderProps) => {
  const { details } = props
  const trend = getTrend(details.priceChange24h)

  return (
    <header className={styles.header}>
      <img
        className={styles.headerImage}
        src={details.imageLarge}
        alt=""
        width='48'
        height='48'
      />
      <div>
        <h1 className={styles.headerTitle}>
          {details.name}
          <span className={styles.headerSymbol}>
            {details.symbol.toUpperCase()}
          </span>
        </h1>
        <div className={styles.headerPriceRow}>
          <span className={styles.headerPrice}>
            {formatMoney(details.currentPrice)}
          </span>
          <span className={`${styles.trendBadge} ${styles[trend]}`}>
            {formatPercent(details.priceChange24h)}
          </span>
        </div>
      </div>
    </header>
  )
}