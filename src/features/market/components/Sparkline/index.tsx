import {useMemo} from "react";
import styles from './Sparkline.module.scss'

interface SparklineProps {
  prices: number[];
  positive: boolean
}

const W = 100;
const H = 36;

const useSparklinePath = (prices: number[]): string => {
  return useMemo(() => {
    if (prices.length < 2) return ''

    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const range = max - min

    const points = prices.map((price, i) => {
      const x = (i / (prices.length - 1)) * W
      const y = range === 0 ? H / 2 : H - ((price - min) / range) * H
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    return `M ${points[0]} L ${points.slice(1).join(' ')}`
  }, [prices])
}

export const Sparkline = (props: SparklineProps) => {
  const { prices, positive } = props;
  const path = useSparklinePath(prices)

  return (
    <svg
      className={styles.chart}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio='none'
      role='img'
      aria-label='График цены'
    >
      <path
        d={path}
        fill='none'
        stroke='currentColor'
        strokeWidth={1.5}
        vectorEffect='non-scaling-stroke'
        className={positive ? styles.up : styles.down}
      />
    </svg>
  )
}