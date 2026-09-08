import type { Coin } from "@/features/market";
import type {Holding, NewHolding} from "@/features/portfolio";
import {useState} from "react";
import styles from './HoldingForm.module.scss'

interface HoldingFormProps {
  coins: Coin[],
  onSubmit: (holding: NewHolding) => void

  editing?: Holding
  onCancel?: () => void
}

interface FormState {
  coinId: string
  amount: string
  buyPrice: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

export const HoldingForm = (props: HoldingFormProps) => {
  const { coins, onSubmit, editing, onCancel } = props

  const [form, setForm] = useState<FormState>(
    editing
      ? { coinId: editing.coinId, amount: String(editing.amount), buyPrice: String(editing.buyPrice) }
      : { coinId: '', amount: '', buyPrice: '', }
  )
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (form: FormState): FormErrors => {
    const errors: FormErrors = {};

    if (!form.coinId) {
      errors.coinId = "Выбери монету";
    }

    const amount = Number(form.amount);
    if (form.amount === "") {
      errors.amount = "Введи количество";
    } else if (!Number.isFinite(amount)) {
      errors.amount = "Количество должно быть числом";
    } else if (amount <= 0) {
      errors.amount = "Количество должно быть больше нуля";
    }

    const buyPrice = Number(form.buyPrice);
    if (form.buyPrice === "") {
      errors.buyPrice = "Введи цену покупки";
    } else if (!Number.isFinite(buyPrice)) {
      errors.buyPrice = "Цена должна быть числом";
    } else if (buyPrice <= 0) {
      errors.buyPrice = "Цена должна быть больше нуля";
    }

    return errors;
  }

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validation = validate(form)

    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    const selectedCoin = coins.find(coin => coin.id === form.coinId)

    onSubmit({
      coinId: form.coinId,
      coinName: selectedCoin?.name ?? '',
      coinSymbol: selectedCoin?.symbol ?? '',
      coinImage: selectedCoin?.image ?? '',
      amount: Number(form.amount),
      buyPrice: Number(form.buyPrice),
    })

    setForm({ coinId: '', amount: '', buyPrice: '', })
    setErrors({})
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <label className={styles.field}>
        <span className={styles.label}>Монета</span>
        <select
          className={
            errors.coinId
              ? `${styles.input} ${styles.inputError}`
              : styles.input
          }
          disabled={editing !== undefined}
          value={form.coinId}
          onChange={event => handleChange('coinId', event.target.value)}
        >
          <option value="" disabled>- выбери монету -</option>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </option>
          ))}
        </select>
        {errors.coinId && <span className={styles.error}>{errors.coinId}</span>}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Количество</span>
        <input
          className={
            errors.amount
              ? `${styles.input} ${styles.inputError}`
              : styles.input
          }
          type='text'
          inputMode='decimal'
          value={form.amount}
          onChange={event => handleChange('amount', event.target.value)}
          placeholder='Например: 0.5'
        />
        {errors.amount && <span className={styles.error}>{errors.amount}</span>}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Цена покупки, $</span>
        <input
          className={
            errors.buyPrice
              ? `${styles.input} ${styles.inputError}`
              : styles.input
          }
          type='text'
          inputMode='decimal'
          value={form.buyPrice}
          onChange={event => handleChange('buyPrice', event.target.value)}
          placeholder='Например: 0.5'
        />
        {errors.buyPrice && <span className={styles.error}>{errors.buyPrice}</span>}
      </label>

      <div className={styles.actions}>
        <button
          type='submit'
          className={styles.submit}
        >
          {editing ? 'Сохранить' : 'Добавить сделку'}
        </button>

        {editing && (
          <button
            type='button'
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  )
}