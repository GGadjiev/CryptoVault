import type { Coin } from "../../types";
import { type ReactNode } from "react";
import { CoinRow } from "../CoinTable/CoinRow";
import styles from "./CoinTable.module.scss";
import { memo } from "react";
import type {Currency} from "@/shared/lib/formatters.ts";

interface CoinTableProps {
  coins: Coin[]
  renderExtra?: (coin: Coin) => ReactNode
  renderStar?: (coin: Coin) => ReactNode
  onRowClick?: (coinId: string) => void;
  currency?: Currency;
}

const CoinTableInner = (props: CoinTableProps) => {
  const {
    coins,
    renderExtra,
    renderStar,
    onRowClick,
    currency,
  } = props

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.hStar} />
            <th>№</th>
            <th>Наименование</th>
            <th className={styles.num}>Цена</th>
            <th className={styles.num}>Изм. 24ч</th>
            <th className={styles.num}>Капитализация</th>
            <th className={styles.num}>График 7д</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <CoinRow
              key={coin.id}
              coin={coin}
              currency={currency}
              star={renderStar ? renderStar(coin) : undefined}
              extra={renderExtra ? renderExtra(coin) : undefined}
              onClick={onRowClick ? () => onRowClick(coin.id) : undefined}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const CoinTable = memo(CoinTableInner)