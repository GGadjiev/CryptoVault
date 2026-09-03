import type {Holding} from "@/features/portfolio";
import styles from './HoldingsTable.module.scss'
import {
  HoldingRow
} from "@/features/portfolio/components/HoldingsTable/HoldingRow.tsx";

interface HoldingsTableProps {
  holdings: Holding[]
  onEdit: (holding: Holding) => void
  onRemove: (id: string) => void
}

const HoldingsTable = (props: HoldingsTableProps) => {
  const { holdings, onEdit, onRemove } = props

  if (holdings.length === 0) return null

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Монета</th>
            <th>Количество</th>
            <th>Цена покупки</th>
            <th>Сумма покупки</th>
            <th>Дата</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <HoldingRow key={holding.id} holding={holding} onEdit={onEdit} onRemove={onRemove}></HoldingRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}