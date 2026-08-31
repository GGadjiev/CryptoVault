import {create} from "zustand";
import {readStorage, writeStorage} from "@/shared/lib/storage.ts";

const STORAGE_KEY = "cryptovault:watchlist";

interface WatchlistStore {
  ids: string[]
  toggle: (coinId: string) => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  (set) => ({
    ids: readStorage(STORAGE_KEY, [] as string[]),

    toggle: (coinId) => {
      set((state) => {
        const isPresent = state.ids.includes(coinId);
        const next = isPresent ? state.ids.filter(id => id !== coinId) : [...state.ids, coinId];

        writeStorage(STORAGE_KEY, next);

        return {ids: next};
      })
    }
  })
)