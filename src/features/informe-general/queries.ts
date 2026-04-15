"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchSubcontratosDashboardData } from "@/lib/biop-subcontratos"
import {
  fetchControlPrevioDocNoRelKpis,
  fetchControlPrevioDocNoRelResumen,
} from "@/lib/controlprevio-documentos-no-relacionados"
import { fetchControlPrevioEstadoOrdenesOverview } from "@/lib/controlprevio-estado-ordenes"
import {
  fetchControlPrevioIngNoRelKpis,
  fetchControlPrevioIngNoRelTop10Proveedores,
} from "@/lib/controlprevio-ingresos-no-relacionados"
import {
  fetchControlPrevioStockAlmacenInventarioPorCategoria,
  fetchControlPrevioStockAlmacenTopRecursos,
} from "@/lib/controlprevio-stock-almacen"
import { reportKeys } from "@/lib/query-keys"

export function useInformeGeneralEstadoQuery() {
  return useQuery({
    queryKey: reportKeys.informeGeneralEstado(),
    queryFn: fetchControlPrevioEstadoOrdenesOverview,
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useInformeGeneralSubcontratosQuery() {
  return useQuery({
    queryKey: reportKeys.informeGeneralSubcontratos(),
    queryFn: async () => fetchSubcontratosDashboardData(),
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useInformeGeneralDocumentosQuery() {
  return useQuery({
    queryKey: reportKeys.informeGeneralDocumentos(),
    queryFn: async () => {
      const [kpis, resumen] = await Promise.all([
        fetchControlPrevioDocNoRelKpis(),
        fetchControlPrevioDocNoRelResumen(),
      ])
      return { kpis, resumen }
    },
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useInformeGeneralIngresosQuery() {
  return useQuery({
    queryKey: reportKeys.informeGeneralIngresos(),
    queryFn: async () => {
      const [kpisData, top10Data] = await Promise.all([
        fetchControlPrevioIngNoRelKpis(),
        fetchControlPrevioIngNoRelTop10Proveedores(),
      ])
      return {
        kpis: kpisData.kpis,
        currency: kpisData.currency,
        top10: top10Data.items,
      }
    },
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useInformeGeneralStockQuery() {
  return useQuery({
    queryKey: reportKeys.informeGeneralStock(),
    queryFn: async () => {
      const [inventarioCategoria, topRecursos] = await Promise.all([
        fetchControlPrevioStockAlmacenInventarioPorCategoria(),
        fetchControlPrevioStockAlmacenTopRecursos(),
      ])
      return { inventarioCategoria, topRecursos }
    },
    staleTime: 45_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
