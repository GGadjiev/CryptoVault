import type { Coin } from "@/features/market";
import type { Holding, NewHolding } from "@/features/portfolio";
import { useState } from "react";
import styles from './HoldingForm.module.scss';
import { type Currency, getCurrencySymbol } from "@/shared/lib/formatters";
import {
  CoinSelect
} from "@/features/portfolio/components/HoldingForm/CoinSelect.tsx";

interface HoldingFormProps {
  coins: Coin[];
  onSubmit: (holding: NewHolding) => void;
  editing?: Holding;
  onCancel?: () => void;
  currency: Currency;
}

interface FormState {
  coinId: string;
  amount: string;
  buyPrice: string;
  autofilled: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export const HoldingForm = (props: HoldingFormProps) => {
  const { coins, onSubmit, editing, onCancel, currency } = props;

  const effectiveCurrency: Currency = editing?.buyCurrency ?? currency;

  const [form, setForm] = useState<FormState>(
    editing
      ? {
        coinId: editing.coinId,
        amount: String(editing.amount),
        buyPrice: String(editing.buyPrice),
        autofilled: false,
      }
      : { coinId: '', amount: '', buyPrice: '', autofilled: false }
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const [message, setMessage] = useState<string | null>(null);

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
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      autofilled: field === 'buyPrice' ? false : prev.autofilled,
    }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setMessage(null);
  };

  const handleCoinChange = (coinId: string) => {
    const coin = coins.find(c => c.id === coinId);

    const shouldAutofill = coin !== undefined && (form.buyPrice === '' || form.autofilled);

    setForm(prev => ({
      ...prev,
      coinId,
      buyPrice: shouldAutofill
        ? String(coin!.currentPrice)
        : prev.buyPrice,
      autofilled: shouldAutofill,
    }));
    setErrors(prev => ({ ...prev, coinId: undefined }));
    setMessage(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validate(form);

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const selectedCoin = coins.find(coin => coin.id === form.coinId);

    onSubmit({
      coinId: form.coinId,
      coinName: selectedCoin?.name ?? '',
      coinSymbol: selectedCoin?.symbol ?? '',
      coinImage: selectedCoin?.image ?? '',
      amount: Number(form.amount),
      buyPrice: Number(form.buyPrice),
      buyCurrency: effectiveCurrency,
    });

    setMessage(
      editing
        ? `Запись сохранена: ${selectedCoin?.name ?? 'монета'} × ${form.amount}.`
        : `Записано в книгу: ${selectedCoin?.name ?? 'монета'} × ${form.amount} по ${form.buyPrice} ${getCurrencySymbol(effectiveCurrency)}.`
    );

    setForm({ coinId: '', amount: '', buyPrice: '', autofilled: false });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className={styles.coupon}>
      <div className={styles.couponTitle}>Купон заявки</div>
      <div className={styles.couponSub}>внесение записи в книгу учёта</div>

      <label className={styles.field}>
        <span className={styles.label}>Монета</span>
        {/*<select*/}
        {/*  className={*/}
        {/*    errors.coinId*/}
        {/*      ? `${styles.input} ${styles.inputError}`*/}
        {/*      : styles.input*/}
        {/*  }*/}
        {/*  disabled={editing !== undefined}*/}
        {/*  value={form.coinId}*/}
        {/*  onChange={event => handleCoinChange(event.target.value)}*/}
        {/*>*/}
        {/*  <option value="" disabled>— выбери монету —</option>*/}
        {/*  {coins.map((coin) => (*/}
        {/*    <option key={coin.id} value={coin.id}>*/}
        {/*      {coin.name} · {coin.symbol.toUpperCase()}*/}
        {/*    </option>*/}
        {/*  ))}*/}
        {/*</select>*/}

        <CoinSelect
          coins={coins}
          value={form.coinId}
          onChange={handleCoinChange}
          disabled={editing !== undefined}
        />

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
          placeholder='0,00'
        />
        {errors.amount && <span className={styles.error}>{errors.amount}</span>}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>
          Цена покупки, {getCurrencySymbol(effectiveCurrency)}
        </span>
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
          placeholder='0,00'
        />
        {form.autofilled && (
          <span className={styles.autofillNote}>курс подставлен текущий</span>
        )}
        {errors.buyPrice && <span className={styles.error}>{errors.buyPrice}</span>}
      </label>

      <div className={styles.actions}>
        <button type='submit' className={styles.submit}>
          {editing ? 'Сохранить' : 'Внести запись'}
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

      <p className={styles.couponFine}>
        графы заполняются в {getCurrencySymbol(effectiveCurrency)}; <br/>
        курс подставляется текущий
      </p>

      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
};