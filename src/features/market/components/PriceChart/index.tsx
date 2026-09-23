import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { ChartPoint } from "../../types";
import {type Currency, formatCompactMoney} from "@/shared/lib/formatters";
import { formatMoney, formatDate } from "@/shared/lib/formatters";
import styles from './PriceChart.module.scss'

interface PriceChartProps {
  points: ChartPoint[];
  currency: Currency;
}

const toChartData = (points: ChartPoint[]) =>
  points.map(([ts, price]) => ({ ts, price }));

const dateFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });
const shortDate = (ts: number) => dateFmt.format(new Date(ts));

export const PriceChart = (props: PriceChartProps) => {
  const { points, currency } = props;
  const data = toChartData(points);

  const prices = points.map(([, price]) => price);
  const max = Math.max(...prices);
  const min = Math.min(...prices);

  return (
    <div className={styles.chartBox}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="ts"
            tickFormatter={shortDate}
            minTickGap={48}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(price) => formatCompactMoney(price, currency)}
            width={70}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(price) => [formatMoney(Number(price), currency), "Цена"]}
            labelFormatter={(ts) => formatDate(new Date(Number(ts)).toISOString())}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className={styles.extremes}>
        <span>Минимум: {formatMoney(min, currency)}</span>
        <span>Максимум: {formatMoney(max, currency)}</span>
      </div>
    </div>
  )
}