import {useCallback, useState} from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import {useCoins, CoinTable, CoinSearch, type Coin} from '@/features/market'
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import styles from './DashboardPage.module.scss'
import {useNavigate} from "react-router-dom";
import {FavoriteButton} from "@/features/watchlist";
import {PortfolioBadge} from "@/features/portfolio";

export const DashboardPage = () => {
  const [query, setQuery] = useState("");
  const debouncedValue = useDebouncedValue(query, 1000);
  const { data, isLoading, error, refetch } = useCoins({ search: debouncedValue })
  const navigate = useNavigate();

  const handleRowClick = useCallback((id: string) => navigate(`/coins/${id}`), [navigate],)

  const renderRowExtra = useCallback((coin: Coin)=> (
    <>
      <FavoriteButton coinId={coin.id} />
      <PortfolioBadge coinId={coin.id} />
    </>
  ), [])

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
          onRowClick={handleRowClick}
          renderExtra={renderRowExtra}
        />
      )}
    </div>
  )
}