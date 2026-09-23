import type { Holding } from "@/features/portfolio";
import {type Currency, formatDateShort} from "@/shared/lib/formatters";
import {
  formatMoney,
  formatPercent,
  getTrend,
} from "@/shared/lib/formatters";
import styles from './HoldingsTable.module.scss';

interface HoldingRowProps {
  index: number;
  holding: Holding;
  currentPrice: number | null;
  currency: Currency;
  onEdit: (holding: Holding) => void;
  onRemove: (id: string) => void;
}

export const HoldingRow = (props: HoldingRowProps) => {
  const { index, holding, currentPrice, currency, onEdit, onRemove } = props;

  const canComputePnl =
    currentPrice !== null &&
    currentPrice > 0 &&
    holding.buyCurrency === currency;

  const pnl = canComputePnl
    ? (currentPrice - holding.buyPrice) * holding.amount
    : null;
  const pnlPercent = canComputePnl
    ? (currentPrice / holding.buyPrice - 1) * 100
    : null;
  const pnlTrend = getTrend(pnl);

  return (
    <tr>
      <td className={styles.rowIndex}>{index}</td>

      <td className={styles.date}>{formatDateShort(holding.createdAt)}</td>

      <td className={styles.coinCell}>
        <div className={styles.coinInner}>
          <img src={holding.coinImage} alt="" width={34} height={34} />
          <span className={styles.coinName}>{holding.coinName}</span>
          <span className={styles.coinSym}>{holding.coinSymbol.toUpperCase()}</span>
        </div>
      </td>

      <td className={styles.num}>{holding.amount}</td>

      <td className={styles.num}>
        {formatMoney(holding.buyPrice, holding.buyCurrency)}
      </td>

      <td className={styles.num}>
        {currentPrice !== null ? formatMoney(currentPrice, currency) : "—"}
      </td>

      <td className={styles.num}>
        {formatMoney(holding.amount * holding.buyPrice, holding.buyCurrency)}
      </td>

      <td className={styles.pnlCell}>
        {pnl !== null && pnlPercent !== null ? (
          <>
            <span className={`${styles.pnlAmount} ${styles[pnlTrend]}`}>
              {formatMoney(pnl, currency)}
            </span>
            <span className={`${styles.pnlPercent} ${styles[pnlTrend]}`}>
              {formatPercent(pnlPercent)}
            </span>
          </>
        ) : (
          <span className={styles.pnlUnknown}>
            {currentPrice === null ? "курс не получен" : "другая валюта"}
          </span>
        )}
      </td>

      <td className={styles.actions}>
        <button
          type='button'
          onClick={() => onEdit(holding)}
          className={styles.iconButton}
          title='Редактировать'
        >
          ✎
        </button>
        <button
          type='button'
          onClick={() => onRemove(holding.id)}
          className={`${styles.iconButton} ${styles.danger}`}
          title='Удалить'
        >
          ✕
        </button>
      </td>
    </tr>
  );
};