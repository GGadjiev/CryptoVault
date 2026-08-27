import type {Coin} from "@/features/market/types.ts";
import {type ReactNode} from "react";
import {CoinRow} from "@/features/market/components/CoinTable/CoinRow.tsx";
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