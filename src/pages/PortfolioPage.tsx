import {
  type Holding,
  type NewHolding,
  usePortfolioStore
} from "@/features/portfolio";
import {useCoins} from "@/features/market";
import {useState} from "react";
import styles from './PortfolioPage.module.scss'
import {HoldingForm} from "@/features/portfolio/components/HoldingForm";
import {EmptyState} from "@/shared/components/EmptyState.tsx";
import {HoldingsTable} from "@/features/portfolio/components/HoldingsTable";

export const PortfolioPage = () => {
  const holdings = usePortfolioStore(s => s.holdings);
  const add = usePortfolioStore(s => s.add)
  const update = usePortfolioStore(s => s.update)
  const remove = usePortfolioStore(s => s.remove)
  const { data: coins, isLoading: coinsLoading } = useCoins()

  const [edidting, setEidting] = useState<Holding | null>(null)

  const handleSubmit = (newHolding: NewHolding) => {
    if (edidting) {
      update(edidting.id, {
        amount: newHolding.amount,
        buyPrice: newHolding.buyPrice,
      })
    } else {
      add(newHolding)
    }
    setEidting(null)
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
            key={edidting ? edidting.id : 'new'}
            coins={coins}
            editing={edidting ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => setEidting(null)}
          />
        ) : coinsLoading ? (
          <p className={styles.formPlaceholder}>Загружаем список монет...</p>
        ) : (
          <p className={styles.formPlaceholder}>Не удалось загрузить список монет - добавления сделок недоступно.</p>
        )}
      </section>

      {holdings.length === 0 ? (
        <EmptyState
          title='Портфель пока пуст'
          description='Добавь первую сделку - и здесь появится твоя статистика.'
        />
      ) : (
        <HoldingsTable
          holdings={holdings}
          onEdit={setEidting}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}