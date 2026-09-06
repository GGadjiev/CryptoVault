import type {PortfolioSummaryData} from "@/features/portfolio";
import styles from './AllocationList.module.scss'
import {formatMoney, formatPercent} from "@/shared/lib/formatters.ts";

interface AllocationListProps {
  summary: PortfolioSummaryData
}

export const AllocationList = (props: AllocationListProps) => {
  const { summary } = props

  if (summary.positions.length === 0) return null;

  const sorted = [...summary.positions].sort(
    (a, b) => (b.share ?? 0) - (a.share ?? 0)
  )

  return (
    <section className={styles.allocation}>
      <h2 className={styles.title}>Распределение по активам</h2>

      <ul className={styles.list}>
        {sorted.map(position => (
          <li key={position.coinId} className={styles.row}>
            <div className={styles.rowHeader}>
              <span className={styles.coinName}>
                {position.coinName}
                <span className={styles.coinSymbol}>
                  {position.coinSymbol.toUpperCase()}
                </span>
              </span>

              <span className={styles.numbers}>
                <span className={styles.share}>
                  {position.share !== null ? formatPercent(position.share * 100) : '-'}
                </span>

                <span className={styles.value}>
                  {position.currentValue !== null ? formatMoney(position.currentValue) : '-'}
                </span>
              </span>
            </div>

            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${ (position.share ?? 0) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>

      {summary.missingPrice.length > 0 && (
        <p className={styles.missingNote}>
          Еще {summary.missingPrice.length} позиций без цены - не показаны.
        </p>
      )}
    </section>
  )
}