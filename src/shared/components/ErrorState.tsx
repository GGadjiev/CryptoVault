import styles from "./ErrorState.module.scss";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = (props: ErrorStateProps) => {
  const {
    message,
    onRetry,
  } = props

  return (
    <div className={styles.errorState}>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryButton} type="button" onClick={onRetry}>
          Попробовать снова
        </button>
      )}
    </div>
  )
}