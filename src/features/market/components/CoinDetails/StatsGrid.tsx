import type { ReactNode } from "react";
import type { CoinDetails } from "../../types";
import type { Currency } from "@/shared/lib/formatters";
import {
  formatMoney,
  formatCompactMoney,
  formatCompactNumber,
  formatPercent,
  getTrend,
  formatDate,
} from "@/shared/lib/formatters";
import styles from "./CoinDetails.module.scss";

interface StatsGridProps {
  details: CoinDetails;
  currency: Currency;
}

interface FactRow { label: string; value: ReactNode; }

const pct = (v: number | null): ReactNode =>
  v === null ? null : (
    <span className={styles[getTrend(v)]}>{formatPercent(v)}</span>
  );

export const StatsGrid = (props: StatsGridProps) => {
  const { details, currency } = props;
  const sym = details.symbol.toUpperCase();

  const rows: FactRow[] = [
    { label: 'Капитализация', value: formatCompactMoney(details.marketCap, currency) },
    { label: 'Объём торгов, 24ч', value: formatCompactMoney(details.totalVolume, currency) },
    { label: 'Максимум, 24ч', value: formatMoney(details.high24h, currency) },
    { label: 'Минимум, 24ч', value: formatMoney(details.low24h, currency) },
    { label: 'Максимум за историю', value: <>{formatMoney(details.ath, currency)} {pct(details.athChangePercentage)}</> },
    { label: 'Минимум за историю', value: <>{formatMoney(details.atl, currency)} {pct(details.atlChangePercentage)}</> },
    ...(details.hashingAlgorithm ? [{ label: 'Алгоритм', value: details.hashingAlgorithm }] : []),
    ...(details.circulatingSupply !== null ? [{
      label: 'В обращении',
      value: `${formatCompactNumber(details.circulatingSupply)}${details.maxSupply ? ` из ${formatCompactNumber(details.maxSupply)}` : ''} ${sym}`,
    }] : []),
    ...(details.genesisDate ? [{ label: 'Дата рождения', value: formatDate(details.genesisDate) }] : []),
  ];

  return (
    <div className={styles.facts}>
      {rows.map((row) => (
        <div key={row.label} className={styles.factRow}>
          <span className={styles.factLabel}>{row.label}</span>
          <span className={styles.factDots} />
          <span className={styles.factValue}>{row.value}</span>
        </div>
      ))}
    </div>
  );
};