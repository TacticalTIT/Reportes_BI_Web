"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchBiopDashboardData } from "@/lib/biop-dashboard"
import {
  fetchRopresupuestoTabla,
  type RopresupuestoTablaFilters,
} from "@/lib/ropresupuesto-tabla"
import { reportKeys } from "@/lib/query-keys"

function biopDashboardAllFailedMessage(data: Awaited<
  ReturnType<typeof fetchBiopDashboardData>
>) {
  const parts = [
    data.fechaMasAntigua,
    data.saldoLiquidarAnticipo,
    data.saldoLiquidarEntrega,
    data.cantPendienteRelacionar,
    data.cantPendienteLiquidar,
    data.cantPorTipoLiquidar,
    data.cantPorTipoRelacionar,
  ]
  if (!parts.every((p) => p.kind === "error")) return null
  const first = parts.find((p) => p.kind === "error")
  return first && first.kind === "error"
    ? first.message
    : "Error al cargar el tablero BIOP."
}

export function useBiopDashboardQuery(filters: RopresupuestoTablaFilters) {
  return useQuery({
    queryKey: reportKeys.biop(filters),
    queryFn: async () => {
      const data = await fetchBiopDashboardData(filters)
      const msg = biopDashboardAllFailedMessage(data)
      if (msg) throw new Error(msg)
      return data
    },
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
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
    queryFn: async () => {
      const r = await fetchRopresupuestoTabla({
        page: input.page,
        pageSize: input.pageSize,
        filters: input.filters,
      })
      if (r.kind === "error") throw new Error(r.message)
      return r
    },
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })
}
