"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchControlPrevioIngNoRelKpis,
  fetchControlPrevioIngNoRelTabla,
  fetchControlPrevioIngNoRelTop10Proveedores,
} from "@/lib/controlprevio-ingresos-no-relacionados"
import { reportKeys } from "@/lib/query-keys"

export function useIngNoRelKpisQuery() {
  return useQuery({
    queryKey: reportKeys.ingresosNoRelacionadosKpis(),
    queryFn: fetchControlPrevioIngNoRelKpis,
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useIngNoRelTablaQuery(page: number) {
  return useQuery({
    queryKey: reportKeys.ingresosNoRelacionadosTabla(page),
    queryFn: async () => fetchControlPrevioIngNoRelTabla({ page }),
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })
}

export function useIngNoRelTop10Query() {
  return useQuery({
    queryKey: reportKeys.ingresosNoRelacionadosTop10(),
    queryFn: fetchControlPrevioIngNoRelTop10Proveedores,
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
