import {useState} from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue.ts";
import {useCoins} from "@/features/market";
import {Spinner} from "@/shared/components/Spinner.tsx";
import {ErrorState} from "@/shared/components/ErrorState.tsx";
import {EmptyState} from "@/shared/components/EmptyState.tsx";
import {CoinTable} from "@/features/market/components/CoinTable";
import styles from './DashboardPage.module.scss'
import {CoinSearch} from "@/features/market/components/CoinSearch";

export const DashboardPage = () => {
  const [query, setQuery] = useState("");
  const debouncedValue = useDebouncedValue(query, 1000);
  const { data, isLoading, error, refetch } = useCoins({ search: debouncedValue })

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
        <CoinTable coins={data} />
      )}
    </div>
  )
}