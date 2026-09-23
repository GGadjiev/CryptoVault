import { useCallback, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { useCoins, CoinTable, CoinSearch, type Coin } from "@/features/market";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { Link, useNavigate } from "react-router-dom";
import { CurrencySwitch } from "@/features/settings/components/CurrencySwitch";
import { FavoriteButton, useWatchlistStore } from "@/features/watchlist";
import { PortfolioBadge } from "@/features/portfolio";
import { useSettingsStore } from "@/features/settings";
import styles from "./DashboardPage.module.scss";

type Tab = "market" | "watchlist";

export const DashboardPage = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("market");
  const isWatchlist = tab === "watchlist";

  const [query, setQuery] = useState("");
  const debouncedValue = useDebouncedValue(query, 1000);

  const currency = useSettingsStore(s => s.currency);

  const watchlistIds = useWatchlistStore(s => s.ids);
  const watchlistCount = useWatchlistStore(s => s.ids.length);

  const {
    data,
    isLoading,
    error,
    refetch,
    hasMore,
    loadMore,
  } = useCoins(
    isWatchlist
      ? { ids: watchlistIds, currency }
      : { search: debouncedValue, currency },
  );

  const searchActive = !isWatchlist && debouncedValue !== "";

  const handleRowClick = useCallback(
    (id: string) => navigate(`/coins/${id}`),
    [navigate],
  );

  const renderRowExtra = useCallback(
    (coin: Coin) => <PortfolioBadge coinId={coin.id} />,
    [],
  );

  const renderStar = useCallback(
    (coin: Coin) => <FavoriteButton coinId={coin.id} />,
    [],
  );

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <h1 className={styles.pageTitle}>Рынок</h1>
        <p className={styles.tagline}>— Ежедневный лист цен цифровых активов —</p>
      </header>

      <div className="rule-heavy" />

      <section className={styles.toolbar}>
        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!isWatchlist}
            className={!isWatchlist ? styles.tabActive : styles.tab}
            onClick={() => setTab("market")}
          >
            Рынок
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isWatchlist}
            className={isWatchlist ? styles.tabActive : styles.tab}
            onClick={() => setTab("watchlist")}
          >
            Избранное
            {watchlistCount > 0 && (
              (<span className={styles.tabBadge}>{watchlistCount}</span>)
            )}
          </button>
        </div>

        <div className={styles.toolbarSearch}>
          {!isWatchlist && (
            <CoinSearch value={query} onChange={setQuery} />
          )}
        </div>

        <CurrencySwitch />

        <Link to="/portfolio" className={styles.portfolioButton}>
          Портфель →
        </Link>
      </section>

      {isLoading && data === null && <Spinner />}

      {error && <ErrorState message={error.message} onRetry={refetch} />}

      {isWatchlist && !isLoading && !error && (!data || data.length === 0) && (
        <EmptyState
          title="В избранном пока пусто"
          description="Добавляй монеты звёздочкой в списке рынка"
        />
      )}

      {!isWatchlist && !isLoading && !error && (!data || data.length === 0) && (
        <EmptyState
          title="Ничего не найдено"
          description={`По запросу «${debouncedValue}» монет не нашлось. Попробуй другое название.`}
        />
      )}

      {!error && data !== null && data.length > 0 && (
        <CoinTable
          coins={data}
          currency={currency}
          onRowClick={handleRowClick}
          renderStar={renderStar}
          renderExtra={renderRowExtra}
        />
      )}

      {!error && (
        <footer className={styles.pageFooter}>
          <p className={styles.footerNote}>
            * Капитализация рассчитана по циркулирующему предложению.
            Источник данных и изображений — CoinGecko.
            Не является индивидуальной инвестиционной рекомендацией.
          </p>

          {!isWatchlist && !searchActive && hasMore && (
            <button
              type="button"
              className={styles.moreButton}
              onClick={loadMore}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка…" : "Показать ещё"}
            </button>
          )}
        </footer>
      )}
    </div>
  );
};