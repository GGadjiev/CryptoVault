import type { Coin } from "../../types";
import { type ReactNode } from "react";
import { CoinRow } from "../CoinTable/CoinRow";
import styles from "./CoinTable.module.scss";
import { memo } from "react";

interface CoinTableProps {
  coins: Coin[]
  renderExtra?: (coin: Coin) => ReactNode
  onRowClick?: (coinId: string) => void;
}

const CoinTableInner = (props: CoinTableProps) => {
  const {
    coins,
    renderExtra,
    onRowClick,
  } = props

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Монета</th>
            <th>Цена</th>
            <th>24ч %</th>
            <th>Капитализация</th>
          </tr>
        </thead>
        <tbody>
          {coins.map(coin => (
            <CoinRow
              key={coin.id}
              coin={coin}
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