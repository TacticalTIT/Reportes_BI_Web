"use client"

import { useQuery } from "@tanstack/react-query"
import {
  fetchControlPrevioDocNoRelKpis,
  fetchControlPrevioDocNoRelResumen,
  fetchControlPrevioDocNoRelTabla,
} from "@/lib/controlprevio-documentos-no-relacionados"
import { reportKeys } from "@/lib/query-keys"

export function useDocNoRelKpisQuery() {
  return useQuery({
    queryKey: reportKeys.documentosNoRelacionadosKpis(),
    queryFn: fetchControlPrevioDocNoRelKpis,
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useDocNoRelTablaQuery(input: {
  page: number
  pageSize: number
}) {
  return useQuery({
    queryKey: reportKeys.documentosNoRelacionadosTabla(input.page, input.pageSize),
    queryFn: async () =>
      fetchControlPrevioDocNoRelTabla({
        page: input.page,
        pageSize: input.pageSize,
      }),
    staleTime: 20_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })
}

export function useDocNoRelResumenQuery() {
  return useQuery({
    queryKey: reportKeys.documentosNoRelacionadosResumen(),
    queryFn: fetchControlPrevioDocNoRelResumen,
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
