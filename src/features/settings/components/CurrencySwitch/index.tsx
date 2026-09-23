import type { Currency } from "@/shared/lib/formatters";
import styles from "./CurrencySwitch.module.scss";
import { useSettingsStore } from "@/features/settings";

const OPTIONS: Currency[] = ["USD", "RUB", "EUR"];

export function CurrencySwitch() {
  const currency = useSettingsStore((s) => s.currency);
  const setCurrency = useSettingsStore((s) => s.setCurrency);

  return (
    <div className={styles.switch} role="group" aria-label="Валюта">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={currency === option ? styles.optionActive : styles.option}
          aria-pressed={currency === option}
          onClick={() => setCurrency(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}