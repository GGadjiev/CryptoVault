import {Link, useNavigate} from "react-router-dom";
import {FavoriteButton, useWatchlistStore} from "@/features/watchlist";
import {CoinTable, useCoins} from "@/features/market";
import styles from './Watchlist.module.scss'
import {Spinner} from "@/shared/components/Spinner.tsx";
import {ErrorState} from "@/shared/components/ErrorState.tsx";
import {EmptyState} from "@/shared/components/EmptyState.tsx";

export const WatchlistPage = () => {
  const navigate = useNavigate();
  const ids = useWatchlistStore(s => s.ids);

  const { data, isLoading, error, refetch } = useCoins({ ids })

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Избранное</h1>

      {isLoading && <Spinner />}
      {error && <ErrorState message={error.message} onRetry={refetch} />}
      {!isLoading && !error && (!data || data.length === 0) && (
        <EmptyState
          title='В избранном пока пусто'
          description='Добавляй монеты звездочкой на главной странице'
          action={<Link to='/' className={styles.cta}>К списку монет</Link>}
        />
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <CoinTable
          coins={data}
          onRowClick={id => navigate(`/coins/${id}`)}
          renderExtra={coin => <FavoriteButton coinId={coin.id} />}
        />
      )}
    </div>
  )
}