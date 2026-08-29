import {useState} from "react";
import styles from "./CoinDetails.module.scss"

interface DescriptionBlockProps {
  text: string
}

export const DescriptionBlock = (props: DescriptionBlockProps) => {
  const { text } = props;

  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > 400;

  return (
    <section className={styles.description}>
      <h2 className={styles.sectionTitle}>О монете</h2>
      <p className={
        expanded ? styles.descriptionText : `${styles.descriptionText} ${styles.descriptionCollapsed}`
      }>
        {text}
      </p>
      {isLong && (
        <button
          type='button'
          className={styles.descriptionToggle}
          onClick={() => setExpanded(v => !v)}
        >
          {expanded ? 'Свернуть' : 'Читать полностью'}
        </button>
      )}
    </section>
  )
}