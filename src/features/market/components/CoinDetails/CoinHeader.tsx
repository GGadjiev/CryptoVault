import type {CoinDetails} from "../../types";
import {
  type Currency,
  formatMoney,
  formatPercent,
  getTrend
} from "@/shared/lib/formatters.ts";
import styles from './CoinDetails.module.scss'
import type {ReactNode} from "react";

interface CoinHeaderProps {
  details: CoinDetails;
  currency: Currency
  actions?: ReactNode
}

export const CoinHeader = (props: CoinHeaderProps) => {
  const { details, currency, actions } = props
  const trend = getTrend(details.priceChange24h)

  return (
    <header className={styles.header}>
      <span className={styles.seal}>
        <img src={details.imageLarge} alt="" width={88} height={88} />
      </span>
      <div className={styles.headerText}>
        <h1 className={styles.headerTitle}>{details.name}</h1>
        <div className={styles.headerPriceRow}>
          <span className={styles.headerPrice}>
            {formatMoney(details.currentPrice, currency)}
          </span>
          <span className={`${styles.chg} ${styles[trend]}`}>
            {formatPercent(details.priceChange24h)}
          </span>
          <span className={styles.headerNote}>за 24 часа</span>
          {actions}
        </div>
      </div>
    </header>
  )
}