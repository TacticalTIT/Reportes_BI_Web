"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchControlPrevioStockAlmacenInventarioPorCategoria,
  fetchControlPrevioStockAlmacenTabla,
  fetchControlPrevioStockAlmacenTopRecursos,
} from "@/lib/controlprevio-stock-almacen"
import { reportKeys } from "@/lib/query-keys"

export function useStockAlmacenTablaQuery(page: number) {
  return useQuery({
    queryKey: reportKeys.stockAlmacenTabla(page),
    queryFn: async () => fetchControlPrevioStockAlmacenTabla({ page }),
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })
}

export function useStockAlmacenInventarioPorCategoriaQuery() {
  return useQuery({
    queryKey: reportKeys.stockAlmacenInventarioPorCategoria(),
    queryFn: fetchControlPrevioStockAlmacenInventarioPorCategoria,
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useStockAlmacenTopRecursosQuery() {
  return useQuery({
    queryKey: reportKeys.stockAlmacenTopRecursos(),
    queryFn: fetchControlPrevioStockAlmacenTopRecursos,
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
