import {usePortfolioStore} from "@/features/portfolio";
import styles from './PortfolioBadge.module.scss'
import {formatAmount} from "@/shared/lib/formatters.ts";

interface PortfolioBadgeProps {
  coinId: string
}

export const PortfolioBadge = (props: PortfolioBadgeProps) => {
  const { coinId } = props;

  const amount = usePortfolioStore(s => (
    s.holdings.filter(h => h.coinId === coinId).reduce((sum, h) => sum + h.amount, 0)
  ))

  const symbol = usePortfolioStore(s => s.holdings.find(h => h.coinId === coinId)?.coinSymbol ?? null)

  if (amount <= 0 || symbol === null) return null

  return (
    <span className={styles.badge}>
      {formatAmount(amount)} {symbol.toUpperCase()}
    </span>
  )
}