"use client"

import type { RopresupuestoTablaFilters } from "@/lib/ropresupuesto-tabla"
import { create } from "zustand"

type DocumentosStore = {
  page: number
  pageSize: number
  filters: RopresupuestoTablaFilters
  hydrate: (input: {
    page: number
    pageSize: number
    filters: RopresupuestoTablaFilters
  }) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setFilters: (filters: RopresupuestoTablaFilters) => void
}

export const useDocumentosStore = create<DocumentosStore>((set) => ({
  page: 1,
  pageSize: 10,
  filters: {},
  hydrate: ({ page, pageSize, filters }) =>
    set({
      page,
      pageSize,
      filters,
    }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  setFilters: (filters) => set({ filters, page: 1 }),
}))
