import styles from './CoinSearch.module.scss'

interface CoinSearchProps {
  value: string
  onChange: (value: string) => void
}

export const CoinSearch = (props: CoinSearchProps) => {
  const { onChange, value } = props

  return (
    <label className={styles.search}>
      <span className={styles.label}>Поиск монет</span>
      <input
        className={styles.input}
        type="text"
        value={value}
        placeholder={'Например: bitcoin'}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}