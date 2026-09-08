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

export const PortfolioPage = () => {
  const holdings = usePortfolioStore(s => s.holdings);
  const add = usePortfolioStore(s => s.add)
  const update = usePortfolioStore(s => s.update)
  const remove = usePortfolioStore(s => s.remove)
  const { data: coins, isLoading: coinsLoading } = useCoins()

  const [editing, setEditing] = useState<Holding | null>(null)

  const summary = usePortfolioSummary();

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

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Портфель</h1>

      <section className={styles.formSection}>
        {coins ? (
          <HoldingForm
            key={editing ? editing.id : 'new'}
            coins={coins}
            editing={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(null)}
          />
        ) : coinsLoading ? (
          <p className={styles.formPlaceholder}>Загружаем список монет...</p>
        ) : (
          <p className={styles.formPlaceholder}>Не удалось загрузить список монет - добавления сделок недоступно.</p>
        )}
      </section>

      {holdings.length > 0 && (
        <>
          <PortfolioSummary summary={summary} />
          <AllocationList summary={summary} />
        </>
      )}

      {holdings.length === 0 ? (
        <EmptyState
          title='Портфель пока пуст'
          description='Добавь первую сделку - и здесь появится твоя статистика.'
        />
      ) : (
        <HoldingsTable
          holdings={holdings}
          onEdit={setEditing}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}