"use client"

import { create } from "zustand"

type DocumentosStore = {
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
}

export const useDocumentosStore = create<DocumentosStore>((set) => ({
  page: 1,
  pageSize: 10,
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
}))
