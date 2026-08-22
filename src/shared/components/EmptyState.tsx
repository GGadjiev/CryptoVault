import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = (props: EmptyStateProps) => {
  const {
    title,
    description,
  } = props

  return (
    <div className={styles.emptyState}>
      <h3 className={styles.title}>{title}</h3>
      {description &&
        <p className={styles.description}>
          {description}
        </p>}
    </div>
  )
}