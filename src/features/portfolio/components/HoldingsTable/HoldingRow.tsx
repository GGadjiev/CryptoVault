import type {Holding} from "@/features/portfolio";
import styles from './HoldingsTable.module.scss'
import {formatDate, formatMoney} from "@/shared/lib/formatters.ts";

interface HoldingRowProps {
  holding: Holding
  onEdit: (holding: Holding) => void
  onRemove: (id: string) => void
}

export const HoldingRow = (props: HoldingRowProps) => {
  const { holding, onEdit, onRemove } = props

  return (
    <tr>
      <td className={styles.coinCell}>
        <img
          src={holding.coinImage}
          alt=""
          width={20}
          height={20}
        />
        <span>{holding.coinName}</span>
        <span className={styles.symbol}>{holding.coinSymbol.toUpperCase()}</span>
      </td>
      <td className={styles.num}>{holding.amount}</td>
      <td className={styles.num}>{formatMoney(holding.buyPrice)}</td>
      <td className={styles.num}>{formatMoney(holding.amount * holding.buyPrice)}</td>
      <td className={styles.date}>{formatDate(holding.createdAt)}</td>
      <td className={styles.actions}>
        <button type='button' onClick={() => onEdit(holding)} className={styles.iconButton} title='Редактировать'>
          ✎
        </button>
        <button type='button' onClick={() => onRemove(holding.id)} className={`${styles.iconButton} ${styles.danger}`} title='Удалить'>
          ✕
        </button>
      </td>
    </tr>
  )
}