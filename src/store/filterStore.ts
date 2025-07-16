import { create } from "zustand";
import type { BatchQueryParams } from "../services/batch";
import { persist } from 'zustand/middleware';

interface FilterState {
  filters: BatchQueryParams;
  setFilters: (filters: BatchQueryParams) => void;
  resetFilters: () => void;
}

const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      filters: {
        page: 0,
        size: 10,
      },
      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: { page: 0, size: 10 } }),
    }),
    {
      name: "filter-storage",
    }
  )
);

export const useFilterState = () => useFilterStore((state) => state.filters);

export const useFilterActions = () => {
  const store = useFilterStore();
  return { setFilters: store.setFilters, resetFilters: store.resetFilters };
};
