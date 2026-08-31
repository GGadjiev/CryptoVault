import styles from "./EmptyState.module.scss";
import type {ReactNode} from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode
}

export const EmptyState = (props: EmptyStateProps) => {
  const {
    title,
    description,
    action,
  } = props

  return (
    <div className={styles.emptyState}>
      <h3 className={styles.title}>{title}</h3>
      {description &&
        <p className={styles.description}>
          {description}
        </p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}