import styles from './CoinDetails.module.scss'

interface ExternalLinkProps {
  homepageUrl: string | null;
}

export const ExternalLink = (props: ExternalLinkProps) => {
  const { homepageUrl } = props

  if (!homepageUrl) return null

  const isSafe = homepageUrl.startsWith('https://') || homepageUrl.startsWith('http://')
  if (!isSafe) return null

  return (
    <section className={styles.links}>
      <h2 className={styles.sectionTitle}>Ссылки</h2>
      <a
        className={styles.link}
        href={homepageUrl}
        target='_blank'
        rel='noreferrer noopener'
      >
        Официальный сайт
      </a>
    </section>
  )
}