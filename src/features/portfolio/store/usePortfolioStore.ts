import type {
  Holding,
  NewHolding,
  UpdateHolding
} from "@/features/portfolio/types.ts";
import {create} from "zustand";
import {readStorage, writeStorage} from "@/shared/lib/storage.ts";

const STORAGE_KEY = 'cryptovault:portfolio';

interface PortfolioState {
  holdings: Holding[]
  add: (holding: NewHolding) => void
  update: (id: string, changes: UpdateHolding) => void
  remove: (id: string) => void
}

const loadHoldings = (): Holding[] => {
  const raw = readStorage(STORAGE_KEY, [] as unknown[])
  return raw
    .filter((h): h is Record<string, unknown> => typeof h === "object" && h !== null)
    .map((h) => ({
      ...(h as Omit<Holding, 'buyCurrency'>), buyCurrency: 'USD'
    }));
}

export const usePortfolioStore = create<PortfolioState>()(
  (set) => ({
    holdings: loadHoldings(),

    add: (newHolding) => {
      set((state) => {
        const holding: Holding = {
          ...newHolding,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }

        const next = [...state.holdings, holding];
        writeStorage(STORAGE_KEY, next);
        return {holdings: next};
      })
    },

    update: (id, changes) => {
      set((state) => {
        const next = state.holdings.map(h => h.id === id ? {...h, ...changes} : h);
        writeStorage(STORAGE_KEY, next);
        return {holdings: next};
      })
    },

    remove: (id) => {
      set((state) => {
        const next = state.holdings.filter(h => h.id !== id)
        writeStorage(STORAGE_KEY, next);
        return {holdings: next};
      })
    }
  })
)