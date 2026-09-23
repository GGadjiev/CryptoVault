import type { Coin } from "../../types";
import type { ReactNode } from "react";
import {
  type Currency,
  formatCompactMoney,
  formatMoney,
  formatPercent,
  getTrend,
} from "@/shared/lib/formatters";
import { Sparkline } from "../Sparkline";
import styles from "./CoinTable.module.scss";

interface CoinRowProps {
  coin: Coin;
  extra?: ReactNode;
  star?: ReactNode;
  onClick?: () => void;
  currency?: Currency;
}

export const CoinRow = (props: CoinRowProps) => {
  const { coin, extra, star, onClick, currency = "USD" } = props;

  const trend = getTrend(coin.priceChange24h);
  const clickable = onClick !== undefined;

  return (
    <tr
      onClick={onClick}
      className={clickable ? styles.rowClickable : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === "Enter") onClick() } : undefined}
    >
      <td className={styles.starCell}>
        {star}
      </td>

      <td className={styles.rank}>
        {coin.marketCapRank ?? "—"}
      </td>

      <td className={styles.nameCell}>
        <img src={coin.image} alt="" width={36} height={36} />
        <div>
          <span className={styles.name}>{coin.name}</span>
          <span className={styles.symbol}>{coin.symbol.toUpperCase()}</span>
        </div>
        {extra}
      </td>

      <td className={styles.num}>
        {formatMoney(coin.currentPrice, currency)}
      </td>
      <td className={`${styles.num} ${styles[trend]}`}>
        {formatPercent(coin.priceChange24h)}
      </td>
      <td className={styles.num}>
        {formatCompactMoney(coin.marketCap, currency)}
      </td>
      <td className={styles.chartCell}>
        {coin.sparkline7d.length > 1 ? (
          <Sparkline
            prices={coin.sparkline7d}
            positive={(coin.priceChange24h ?? 0) >= 0}
          />
        ) : (
          <span className={styles.noChart}>—</span>
        )}
      </td>
    </tr>
  );
};