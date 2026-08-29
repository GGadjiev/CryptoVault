import type {CoinDetails} from "@/features/market/types.ts";
import {
  formatCompactMoney,
  formatDate,
  formatMoney
} from "@/shared/lib/formatters.ts";
import styles from "./CoinDetails.module.scss";

interface StatsGridProps {
  details: CoinDetails;
}

interface StatItem {
  label: string;
  value: string;
}

export const StatsGrid = (props: StatsGridProps) => {
  const { details } = props;

  const items: StatItem[] = [
    { label: "Капитализация", value: formatCompactMoney(details.marketCap) },
    { label: "Объём за 24ч", value: formatCompactMoney(details.totalVolume) },
    { label: "Максимум за 24ч", value: formatMoney(details.high24h) },
    { label: "Минимум за 24ч", value: formatMoney(details.low24h) },
    { label: "Абс. максимум", value: formatMoney(details.ath) },
    { label: "Абс. минимум", value: formatMoney(details.atl) },
    ...(details.hashingAlgorithm
      ? [{ label: 'Алгоритм', value: details.hashingAlgorithm }]
      : []),
    ...(details.genesisDate
      ? [{ label: 'Дата создания', value: formatDate(details.genesisDate) }]
      : [])
  ]

  return (
    <dl className={styles.StatsGrid}>
      {items.map((item) => (
        <div key={item.label} className={styles.statCard}>
          <dt className={styles.statLabel}>{item.label}</dt>
          <dd className={styles.statValue}>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}