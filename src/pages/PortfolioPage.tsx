import {
  AllocationList,
  type Holding, HoldingForm, HoldingsTable,
  type NewHolding, PortfolioSummary,
  usePortfolioStore, usePortfolioSummary
} from "@/features/portfolio";
import {useCoins} from "@/features/market";
import {useState} from "react";
import styles from './PortfolioPage.module.scss'
import {EmptyState} from "@/shared/components/EmptyState.tsx";
import {useSettingsStore} from "@/features/settings";
import {Link} from "react-router-dom";
import {CurrencySwitch} from "@/features/settings/components/CurrencySwitch";

export const PortfolioPage = () => {
  const holdings = usePortfolioStore(s => s.holdings);
  const add = usePortfolioStore(s => s.add)
  const update = usePortfolioStore(s => s.update)
  const remove = usePortfolioStore(s => s.remove)

  const [editing, setEditing] = useState<Holding | null>(null)

  const currency = useSettingsStore(s => s.currency)

  const { data: coins, isLoading: coinsLoading } = useCoins({ currency })

  const summary = usePortfolioSummary(holdings, coins ?? [], currency);

  const handleSubmit = (newHolding: NewHolding) => {
    if (editing) {
      update(editing.id, {
        amount: newHolding.amount,
        buyPrice: newHolding.buyPrice,
      })
    } else {
      add(newHolding)
    }
    setEditing(null)
  }

  const handleRemove = (id: string) => {
    if (window.confirm('Удалить сделку? Действия не обратимо.')) {
      remove(id)
    }
  }

  const noRates = summary.missingPrice.length;

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <h1 className={styles.pageTitle}>Портфель</h1>
        <p className={styles.tagline}>— Личная книга учёта читателя —</p>
      </header>

      <div className="rule-heavy" />

      <section className={styles.toolbar}>
        <Link to="/" className="linkButton">← Весь рынок</Link>
        <div className={styles.toolbarRight}>
          <CurrencySwitch />
        </div>
      </section>

      {holdings.length > 0 && (
        <PortfolioSummary summary={summary} currency={currency} />
      )}

      <div className={styles.content}>
        {holdings.length > 0 && (
          <div className={styles.mainColumn}>
            <AllocationList summary={summary} currency={currency} />
          </div>
        )}

        {holdings.length === 0 && (
          <div className={styles.mainColumn2}>
            <EmptyState
              title="Портфель пока пуст"
              description="Добавь первую сделку - и здесь появится твоя статистика."
            />
          </div>
        )}


        <div className={styles.sideColumn}>
          {coins ? (
            <HoldingForm
              key={editing ? editing.id : "new"}
              coins={coins}
              currency={currency}
              editing={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setEditing(null)}
            />
          ) : coinsLoading ? (
            <p className={styles.formPlaceholder}>Загружаем список монет...</p>
          ) : (
            <p className={styles.formPlaceholder}>
              Не удалось загрузить список монет — добавление сделок недоступно.
            </p>
          )}
        </div>
      </div>

      <HoldingsTable
        holdings={holdings}
        coins={coins ?? []}
        currency={currency}
        noRates={noRates}
        onEdit={setEditing}
        onRemove={handleRemove}
      />

      <footer className={styles.pageFooter}>
        <p className={styles.footerNote}>
          * Оценка стоимости — по котировкам текущего выпуска.
          Источник данных и изображений — CoinGecko.
          Не является индивидуальной инвестиционной рекомендацией.
        </p>
        <Link to="/" className="linkButton">← К листу котировок</Link>
      </footer>
    </div>
  );
}