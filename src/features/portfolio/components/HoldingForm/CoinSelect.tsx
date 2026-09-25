import { useEffect, useRef, useState } from "react";
import type { Coin } from "@/features/market";
import styles from "./HoldingForm.module.scss";

interface CoinSelectProps {
  coins: Coin[];
  value: string;
  onChange: (coinId: string) => void;
  disabled?: boolean;
}

export const CoinSelect = (props: CoinSelectProps) => {
  const { coins, value, onChange, disabled } = props;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = coins.find(c => c.id === value);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.selectRoot} ref={rootRef}>
      <button
        type="button"
        className={styles.selectTrigger}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        {selected
          ? `${selected.name} · ${selected.symbol.toUpperCase()}`
          : "— выбери монету —"}
        <span className={styles.selectArrow}>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <ul className={styles.selectList} role="listbox">
          {coins.map(coin => {
            const active = coin.id === value;
            return (
              <li key={coin.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={active ? styles.selectOptionActive : styles.selectOption}
                  onClick={() => {
                    onChange(coin.id);
                    setOpen(false);
                  }}
                >
                  <span className={styles.selectOptionName}>{coin.name}</span>
                  <span className={styles.selectOptionSym}>
                    {coin.symbol.toUpperCase()}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};