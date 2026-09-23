import styles from "./CoinDetails.module.scss";

interface ExternalLinksProps {
  homepageUrl: string | null;
  explorerUrl: string | null;
}

function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function isSafe(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://");
}

export const ExternalLink = (props: ExternalLinksProps) => {
  const { homepageUrl, explorerUrl } = props;

  const links: { label: string; url: string }[] = [];
  if (homepageUrl && isSafe(homepageUrl)) {
    links.push({ label: "Сайт", url: homepageUrl });
  }
  if (explorerUrl && isSafe(explorerUrl)) {
    links.push({ label: "Обозреватель", url: explorerUrl });
  }

  if (links.length === 0) return null;

  return (
    <div className={styles.addr}>
      <div className={styles.addrTitle}>Адреса</div>

      {links.map(({ label, url }) => (
        <a
          key={url}
          className={styles.addrLink}
          href={url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {label}: {host(url)} →
        </a>
      ))}
    </div>
  );
};