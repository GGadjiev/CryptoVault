import type { PortfolioSummaryData } from "@/features/portfolio";
import styles from './AllocationList.module.scss';
import {
  type Currency,
  formatMoney,
  formatPercent,
} from "@/shared/lib/formatters";

interface AllocationListProps {
  summary: PortfolioSummaryData;
  currency: Currency;
}

interface AllocationRow {
  key: string;
  name: string;
  value: number;
  share: number;
}

export const AllocationList = (props: AllocationListProps) => {
  const { summary, currency } = props;

  if (summary.positions.length === 0) return null;

  const sorted = [...summary.positions].sort(
    (a, b) => (b.currentValue ?? 0) - (a.currentValue ?? 0),
  );

  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  const topValue = top.reduce((s, p) => s + (p.currentValue ?? 0), 0);
  const restValue = rest.reduce((s, p) => s + (p.currentValue ?? 0), 0);
  const totalValue = topValue + restValue;

  if (totalValue <= 0) return null;

  const rows: AllocationRow[] = top.map((p) => ({
    key: p.coinId,
    name: p.coinName,
    value: p.currentValue ?? 0,
    share: (p.currentValue ?? 0) / totalValue,
  }));

  if (rest.length > 0) {
    rows.push({
      key: "_other",
      name: "Прочие",
      value: restValue,
      share: restValue / totalValue,
    });
  }

  return (
    <section className={styles.allocation}>
      <h2 className={styles.title}>Структура портфеля</h2>

      <div className={styles.list}>
        {rows.map((row) => (
          <div key={row.key} className={styles.srow}>
            <div className={styles.srowLine}>
              <span className={styles.name}>{row.name}</span>
              <span className={styles.dots} />
              <span className={styles.value}>
                {formatPercent(row.share * 100)} · {formatMoney(row.value, currency)}
              </span>
            </div>

            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ width: `${Math.max(row.share * 100, 0.8)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {summary.missingPrice.length > 0 && (
        <p className={styles.missingNote}>
          Ещё {summary.missingPrice.length} позиц. без цены — не показаны.
        </p>
      )}
    </section>
  );
};