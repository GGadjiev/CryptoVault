import { useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useCoins, CoinTable, CoinSearch } from '@/features/market'
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import styles from './DashboardPage.module.scss'
import {useNavigate} from "react-router-dom";
import {FavoriteButton} from "@/features/watchlist";

export const DashboardPage = () => {
  const [query, setQuery] = useState("");
  const debouncedValue = useDebouncedValue(query, 1000);
  const { data, isLoading, error, refetch } = useCoins({ search: debouncedValue })
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Криптовалютный рынок</h1>
      
      <CoinSearch value={query} onChange={setQuery} />
      
      {isLoading && <Spinner />}

      {error && <ErrorState message={error.message} onRetry={refetch} />}

      {!isLoading && !error && (!data || data.length === 0) && (
        <EmptyState title='Ничего не найдено.' description='Попробуй другой запрос.' />
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <CoinTable
          coins={data}
          onRowClick={(id) => navigate(`/coins/${id}`)}
          renderExtra={(coin) => <FavoriteButton coinId={coin.id} /> }
        />
      )}
    </div>
  )
}