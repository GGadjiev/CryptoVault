import type { Holding } from "@/features/portfolio";
import type { Coin } from "@/features/market";
import styles from './HoldingsTable.module.scss';
import { HoldingRow } from "./HoldingRow";
import type { Currency } from "@/shared/lib/formatters";

interface HoldingsTableProps {
  holdings: Holding[];
  coins: Coin[];
  currency: Currency;
  noRates: number;
  onEdit: (holding: Holding) => void;
  onRemove: (id: string) => void;
}

export const HoldingsTable = (props: HoldingsTableProps) => {
  const { holdings, coins, currency, noRates, onEdit, onRemove } = props;

  if (holdings.length === 0) return null;

  const priceMap = new Map(coins.map(c => [c.id, c.currentPrice]));

  return (
    <section className={styles.ledger}>
      <div className={styles.ledgerHead}>
        <h2 className={styles.ledgerTitle}>Книга учёта</h2>
        <span className={styles.ledgerCount}>
          записей: {holdings.length}
          {noRates > 0 && ` · ${noRates} без курса`}
        </span>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>№</th>
              <th className={styles.colDate}>Дата</th>
              <th>Монета</th>
              <th className={styles.num}>Кол-во</th>
              <th className={styles.num}>Покупка</th>
              <th className={`${styles.num} ${styles.colRate}`}>Курс</th>
              <th className={styles.num}>Стоимость</th>
              <th>Прибыль</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => (
              <HoldingRow
                key={h.id}
                index={i + 1}
                holding={h}
                currentPrice={priceMap.get(h.coinId) ?? null}
                currency={currency}
                onEdit={onEdit}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};