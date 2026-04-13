"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchSubcontratosDashboardData,
  type SubcontratosFilters,
} from "@/lib/biop-subcontratos"
import { reportKeys } from "@/lib/query-keys"

/** `pageSize` solo afecta la clave de cache; la tabla usa `tabla?page=` con 10 filas por página en el backend. */
export function useSubcontratosDashboardQuery(
  filters: SubcontratosFilters,
  page: number,
  pageSize: number
) {
  return useQuery({
    queryKey: reportKeys.subcontratos(filters, page, pageSize),
    queryFn: async () => fetchSubcontratosDashboardData(filters, { page, pageSize }),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
