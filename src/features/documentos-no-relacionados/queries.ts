"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchBiopDashboardData } from "@/lib/biop-dashboard"
import {
  fetchRopresupuestoTabla,
  type RopresupuestoTablaFilters,
} from "@/lib/ropresupuesto-tabla"
import { reportKeys } from "@/lib/query-keys"

export function useBiopDashboardQuery(filters: RopresupuestoTablaFilters) {
  return useQuery({
    queryKey: reportKeys.biop(filters),
    queryFn: () => fetchBiopDashboardData(filters),
  })
}

export function useRopresupuestoTablaQuery(input: {
  page: number
  pageSize: number
  filters: RopresupuestoTablaFilters
}) {
  return useQuery({
    queryKey: reportKeys.ropresupuestoTabla(
      input.page,
      input.pageSize,
      input.filters
    ),
    queryFn: () =>
      fetchRopresupuestoTabla({
        page: input.page,
        pageSize: input.pageSize,
        filters: input.filters,
      }),
    placeholderData: (prev) => prev,
  })
}
