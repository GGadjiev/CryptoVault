import {useState} from "react";
import styles from "./CoinDetails.module.scss"

interface DescriptionBlockProps {
  text: string
  subtitle?: string
}

export const DescriptionBlock = (props: DescriptionBlockProps) => {
  const { text, subtitle } = props;

  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > 400;

  return (
    <section className={styles.description}>
      <div className={styles.artHead}>
        <h2 className={styles.artTitle}>О валюте</h2>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>

      <p
        className={
          expanded
            ? styles.descriptionText
            : `${styles.descriptionText} ${styles.descriptionCollapsed}`
        }
      >
        {text}
      </p>

      {isLong && (
        <button
          type="button"
          className={styles.descriptionToggle}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Свернуть" : "Читать полностью"}
        </button>
      )}
    </section>
  )
}