import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {Spinner} from "@/shared/components/Spinner.tsx";
import {ErrorState} from "@/shared/components/ErrorState.tsx";
import {useCoin} from "@/features/market";
import styles from './CoinDetailsPage.module.scss'
import {CoinDetailsView} from "@/features/market/components/CoinDetails/CoinDetailsView.tsx";
import {useState} from "react";
import {useMarketChart} from "@/features/market/hooks/useMarketChart.ts";
import { Sparkline } from "@/features/market/components/Sparkline";

interface BackButtonProps {
  onClick: () => void;
}

interface ChartSectionProps {
  coinId: string;
  trend: boolean
}

export const CoinDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const coinId = id ?? ''

  const { data, isLoading, error, refetch } = useCoin(coinId)

  const goBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <BackButton onClick={goBack} />
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <BackButton onClick={goBack} />
        {error.status === 404 ? (
          <div className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>Монета не найдена</h1>
            <p className={styles.notFoundText}>
              Возможно, она была удалена или ссылка не верна.
            </p>
            <Link to='/' className={styles.notFoundLink}>На главную</Link>
          </div>
        ) : (
          <ErrorState message={error.message} onRetry={refetch} />
        )}
      </div>
    )
  }

  if (!data) return null;

  return (
    <div className={styles.page}>
      <BackButton onClick={goBack} />
      <CoinDetailsView details={data} />
      <ChartSection coinId={data.id} trend={(data.priceChange24h ?? 0) >= 0} />
    </div>
  )
}

const BackButton = (props: BackButtonProps) => {
  const { onClick } = props;

  return (
    <button type='button' onClick={onClick} className={styles.backButton}>
      Назад
    </button>
  )
}

const ChartSection = (props: ChartSectionProps) => {
  const { coinId, trend } = props;

  const [days, setDays] = useState(7)
  const { data, isLoading, error } = useMarketChart(coinId, days)

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
        <Sparkline
          prices={data.map(([, price]) => price)}
          positive={trend}
        />
      )}
    </section>
  )
}