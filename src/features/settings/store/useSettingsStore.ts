import { create } from "zustand";
import { readStorage, writeStorage } from "@/shared/lib/storage";
import type { Currency } from "@/shared/lib/formatters";

const STORAGE_KEY = "cryptovault:currency";

function isCurrency(value: unknown): value is Currency {
  return value === "USD" || value === "RUB" || value === "EUR";
}

function readInitialCurrency(): Currency {
  const stored = readStorage(STORAGE_KEY, "USD");
  return isCurrency(stored) ? stored : "USD";
}

interface SettingsState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  currency: readInitialCurrency(),
  setCurrency: (currency) => {
    set({ currency });
    writeStorage(STORAGE_KEY, currency);
  },
}));