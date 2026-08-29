import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {Spinner} from "@/shared/components/Spinner.tsx";
import {ErrorState} from "@/shared/components/ErrorState.tsx";
import {useCoin} from "@/features/market";
import styles from './CoinDetailsPage.module.scss'
import {CoinDetailsView} from "@/features/market/components/CoinDetails/CoinDetailsView.tsx";

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
    </div>
  )
}

const BackButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button type='button' onClick={onClick} className={styles.backButton}>
      Назад
    </button>
  )
}