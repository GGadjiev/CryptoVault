import styles from './CoinSearch.module.scss'

interface CoinSearchProps {
  value: string
  onChange: (value: string) => void
}

export const CoinSearch = (props: CoinSearchProps) => {
  const { onChange, value } = props

  return (
    <label className={styles.search}>
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none"
           stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="9" r="6" />
        <path d="M13.5 13.5 17 17" />
      </svg>
      <input
        className={styles.input}
        type="text"
        value={value}
        placeholder="Поиск монет…"
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}