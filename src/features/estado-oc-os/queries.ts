"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchControlPrevioEstadoOrdenesOverview,
  fetchControlPrevioEstadoOrdenesTabla,
} from "@/lib/controlprevio-estado-ordenes"
import { reportKeys } from "@/lib/query-keys"

export function useEstadoOrdenesOverviewQuery() {
  return useQuery({
    queryKey: reportKeys.estadoOrdenesOverview(),
    queryFn: fetchControlPrevioEstadoOrdenesOverview,
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useEstadoOrdenesTablaQuery(page: number) {
  return useQuery({
    queryKey: reportKeys.estadoOrdenesTabla(page),
    queryFn: async () => fetchControlPrevioEstadoOrdenesTabla({ page }),
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })
}
