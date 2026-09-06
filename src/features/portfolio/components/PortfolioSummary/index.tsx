import type {PortfolioSummaryData} from "@/features/portfolio";
import {formatMoney, formatPercent, getTrend} from "@/shared/lib/formatters.ts";
import styles from './PortfolioSummary.module.scss'
import {pluralize} from "@/shared/lib/pluralize.ts";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryData
}

export const PortfolioSummary = (props: PortfolioSummaryProps) => {
  const { summary } = props

  const ranked = [...summary.positions].sort(
    (a, b) => (b.priceChange24h ?? 0) - (a.priceChange24h ?? 0)
  )
  const best = ranked[0]
  const worst = ranked.length > 1 ? ranked[ranked.length - 1] : undefined

  const pnlTrend = getTrend(summary.pnl)

  return (
    <section className={styles.summary}>
      <h2 className={styles.title}>Сводка профиля</h2>

      <div className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.label}>Вложено</span>
          <span className={styles.value}>{formatMoney(summary.totalInvested)}</span>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Текущая стоимость</span>
          <span className={styles.value}>{summary.totalValue !== null ? formatMoney(summary.totalValue) : '-'}</span>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Прибыль / убыток</span>
          <span className={`${styles.value} ${styles[pnlTrend]}`}>
            {summary.pnl !== null && summary.pnlPercent !== null ? (
            <>
              {formatMoney(summary.pnl)}
              <span className={styles.pnl}>({formatPercent(summary.pnlPercent)})</span>
            </>
          ) : (
            '-'
          )}
          </span>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Лучший актив (24ч)</span>
          {best ? (
            <span className={`${styles.value} ${styles[getTrend(best.priceChange24h)]}`}>
              {best.coinName} {formatPercent(best.priceChange24h)}
            </span>
          ) : (
            <span className={styles.value}>-</span>
          )}
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Худший актив (24ч)</span>
          {worst ? (
            <span className={`${styles.value} ${styles[getTrend(worst.priceChange24h)]}`}>
              {worst.coinName} {formatPercent(worst.priceChange24h)}
            </span>
          ) : (
            <span className={styles.value}>-</span>
          )}
        </div>

        {summary.missingPrice.length > 0 && (
          <p className={styles.warning}>
            {summary.missingPrice.length}{' '}
            {pluralize(summary.missingPrice.length, 'сделка', 'сделки', 'сделок')}{' '}
            без актульной цены - не учтены в итогах.
          </p>
        )}
      </div>
    </section>
  )
}