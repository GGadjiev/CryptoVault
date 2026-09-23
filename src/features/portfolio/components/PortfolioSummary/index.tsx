import type {PortfolioSummaryData} from "@/features/portfolio";
import {
  type Currency,
  formatMoney,
  formatPercent,
  getTrend
} from "@/shared/lib/formatters.ts";
import styles from './PortfolioSummary.module.scss'
import {pluralize} from "@/shared/lib/pluralize.ts";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryData
  currency: Currency
}

export const PortfolioSummary = (props: PortfolioSummaryProps) => {
  const { summary, currency } = props

  const pnlTrend = getTrend(summary.pnl)
  const pnlPercentTrend = getTrend(summary.pnlPercent)

  return (
    <section className={styles.summary}>
      <div className={styles.totals}>
        <div className={styles.tot}>
          <span className={styles.label}>Вложено</span>
          <span className={styles.value}>{formatMoney(summary.totalInvested, currency)}</span>
        </div>

        <div className={styles.tot}>
          <span className={styles.label}>Текущая стоимость</span>
          <span className={styles.value}>
          {summary.totalValue !== null ? formatMoney(summary.totalValue, currency) : "—"}
        </span>
        </div>

        <div className={styles.tot}>
          <span className={styles.label}>Прибыль</span>
          <span className={`${styles.value} ${styles[pnlTrend]}`}>
          {summary.pnl !== null ? formatMoney(summary.pnl, currency) : "—"}
        </span>
        </div>

        <div className={styles.tot}>
          <span className={styles.label}>Доходность</span>
          <span className={`${styles.value} ${styles[pnlPercentTrend]}`}>
          {summary.pnlPercent !== null ? formatPercent(summary.pnlPercent) : "—"}
        </span>
        </div>
      </div>

      {summary.missingPrice.length > 0 && (
        <p className={styles.warning}>
          {summary.missingPrice.length}{' '}
          {pluralize(summary.missingPrice.length, 'сделка', 'сделки', 'сделок')}{' '}
          без актуальной цены — не учтены в итогах.
        </p>
      )}

      {summary.foreignCurrency.length > 0 && (
        <p className={styles.warningForeign}>
          {summary.foreignCurrency.length}{' '}
          {pluralize(summary.foreignCurrency.length, 'сделка', 'сделки', 'сделок')}{' '}
          в другой валюте — не учтены в прибыли.
        </p>
      )}
    </section>
  )
}