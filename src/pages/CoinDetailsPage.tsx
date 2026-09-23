import {Link, useParams} from "react-router-dom";
import {Spinner} from "@/shared/components/Spinner.tsx";
import {ErrorState} from "@/shared/components/ErrorState.tsx";
import {
  CoinHeader, DescriptionBlock, ExternalLink,
  PriceChart,
  useCoin,
  useMarketChart
} from "@/features/market";
import styles from './CoinDetailsPage.module.scss'
import {useState} from "react";
import {useSettingsStore} from "@/features/settings";
import type {Currency} from "@/shared/lib/formatters.ts";
import {
  StatsGrid
} from "@/features/market/components/CoinDetails/StatsGrid.tsx";
import {FavoriteButton} from "@/features/watchlist";
import {CurrencySwitch} from "@/features/settings/components/CurrencySwitch";

interface ChartSectionProps {
  coinId: string
  currency: Currency
}

export const CoinDetailsPage = () => {
  const { id } = useParams();
  const coinId = id ?? '';

  const currency = useSettingsStore(s => s.currency);
  const { data, isLoading, error, refetch } = useCoin(coinId, currency);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <PageToolbar />
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <PageToolbar />
        {error.status === 404 ? (
          <div className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>Монета не найдена</h1>
            <p className={styles.notFoundText}>Возможно, она была удалена или ссылка не верна.</p>
            <Link to='/' className={styles.notFoundLink}>На главную</Link>
          </div>
        ) : (
          <ErrorState message={error.message} onRetry={refetch} />
        )}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className={styles.page}>
      <CoinHeader
        details={data}
        currency={currency}
        actions={<FavoriteButton coinId={data.id} />}
      />

      <div className="rule-heavy" />

      <PageToolbar />

      <div className={styles.content}>
        <div className={styles.mainColumn}>
          <ChartSection coinId={data.id} currency={currency} />
          <DescriptionBlock
            text={data.description}
            subtitle={`${data.name} · ${data.symbol.toUpperCase()}`}
          />
        </div>
        <div className={styles.sideColumn}>
          <div className={styles.factsBox}>
            <div className={styles.factsTitle}>Справка эмитента</div>
            <StatsGrid details={data} currency={currency} />
            <ExternalLink homepageUrl={data.homepageUrl} explorerUrl={data.explorerUrl} />
          </div>
        </div>
      </div>

      <footer className={styles.pageFooter}>
        <p className={styles.footerNote}>
          * Капитализация рассчитана по циркулирующему предложению. Источник данных — CoinGecko.
          Не является индивидуальной инвестиционной рекомендацией.
        </p>
        <Link to="/" className="linkButton">← К листу котировок</Link>
      </footer>
    </div>
  );
};

function PageToolbar() {
  return (
    <div className={styles.toolbar}>
      <Link to="/" className="linkButton">← Весь рынок</Link>
      <div className={styles.toolbarRight}>
        <CurrencySwitch />
        <Link to="/portfolio" className="linkButton">Портфель →</Link>
      </div>
    </div>
  );
}

const ChartSection = (props: ChartSectionProps) => {
  const { coinId, currency } = props;

  const [days, setDays] = useState(7)
  const { data, isLoading, error } = useMarketChart(coinId, currency, days)

  return (
    <section className={styles.chartSection}>
      <h2 className={styles.chartSectionTitle}>График цены</h2>

      <div className={styles.rangeButtons}>
        {[1, 7, 30].map(d => (
          <button
            key={d}
            type='button'
            className={days === d ? styles.rangeActive : styles.rangeButton}
            onClick={() => setDays(d)}
          >
            {d === 1 ? '24 часа' : d === 7 ? '7 дней' : '30 дней'}
          </button>
        ))}
      </div>

      {isLoading && <Spinner />}
      {error && <ErrorState message={error.message} />}
      {data && data.length > 1 && (
        <PriceChart points={data} currency={currency} />
      )}
    </section>
  )
}