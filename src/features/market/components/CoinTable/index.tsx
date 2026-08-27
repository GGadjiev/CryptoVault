import type { Coin } from "../../types";
import { type ReactNode } from "react";
import { CoinRow } from "../CoinTable/CoinRow";
import styles from "./CoinTable.module.scss";

interface CoinTableProps {
  coins: Coin[]
  renderExtra?: (coin: Coin) => ReactNode
}

export const CoinTable = (props: CoinTableProps) => {
  const {
    coins,
    renderExtra,
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
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}