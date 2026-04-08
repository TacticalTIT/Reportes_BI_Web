"use client"

import { useEffect, useMemo, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { BiopDashboardData } from "@/lib/biop-dashboard"
import {
  buildRopresupuestoTablaSearchParams,
  parseRopresupuestoTablaQuery,
} from "@/lib/ropresupuesto-tabla"
import { DocumentosFiltersCard } from "./filters-card"
import { DocumentosKpiCards } from "./kpi-cards"
import { DocumentosMobileDock } from "./mobile-dock"
import { DocumentosSidebarInsights } from "./sidebar-insights"
import { DocumentosTableCard } from "./documentos-table-card"
import { useBiopDashboardQuery, useRopresupuestoTablaQuery } from "../queries"
import { useDocumentosStore } from "../store"

function parseFromSearchParams(searchParams: URLSearchParams) {
  const asRecord: Record<string, string | undefined> = {}
  for (const [key, value] of searchParams.entries()) {
    asRecord[key] = value
  }
  return parseRopresupuestoTablaQuery(asRecord)
}

export function DocumentosScreen() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { page, pageSize, filters, hydrate, setFilters, setPage, setPageSize } =
    useDocumentosStore()
  const lastSyncedQuery = useRef<string | null>(null)

  const parsed = useMemo(
    () => parseFromSearchParams(searchParams),
    [searchParams]
  )

  const searchParamsString = searchParams.toString()
  useEffect(() => {
    if (lastSyncedQuery.current === searchParamsString) return
    lastSyncedQuery.current = searchParamsString
    hydrate(parsed)
  }, [hydrate, parsed, searchParamsString])

  const tablaQuery = useRopresupuestoTablaQuery({
    page,
    pageSize,
    filters,
  })
  const biopQuery = useBiopDashboardQuery(filters)

  const syncUrl = (next: { page: number; pageSize: number; filters: typeof filters }) => {
    const query = buildRopresupuestoTablaSearchParams(
      next.page,
      next.pageSize,
      next.filters
    )
    router.replace(`${pathname}?${query.toString()}`)
  }

  const handleApplyFilters = (nextFilters: typeof filters) => {
    const next = { page: 1, pageSize, filters: nextFilters }
    setFilters(nextFilters)
    syncUrl(next)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    syncUrl({ page: nextPage, pageSize, filters })
  }

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    syncUrl({ page: 1, pageSize: nextPageSize, filters })
  }

  const tablaResult = tablaQuery.data
  const data = tablaResult?.kind === "ok" ? tablaResult.data : []
  const pagination =
    tablaResult?.kind === "ok"
      ? tablaResult.pagination
      : {
          page,
          pageSize,
          itemsOnPage: 0,
          totalItems: 0,
          totalPages: 1,
          hasPrev: false,
          hasNext: false,
          prevPage: null,
          nextPage: null,
          visiblePages: [1],
        }
  const message = tablaResult?.kind === "ok" ? tablaResult.message : tablaResult?.message
  const empty = data.length === 0
  const biop = biopQuery.data ?? biopFallback

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Documentos no relacionados
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Indicadores y paneles laterales reflejan datos globales del BIOP.
        </p>
      </div>

      <DocumentosKpiCards biop={biop} loading={biopQuery.isLoading} />

      <DocumentosFiltersCard
        pageSize={pageSize}
        filters={filters}
        onApply={handleApplyFilters}
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-4">
        <DocumentosTableCard
          data={data}
          empty={empty}
          loading={tablaQuery.isLoading}
          message={message}
          pagination={pagination}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
        <DocumentosSidebarInsights biop={biop} loading={biopQuery.isLoading} />
      </div>

      <DocumentosMobileDock />
    </div>
  )
}

const biopFallback: BiopDashboardData = {
  fechaMasAntigua: { kind: "error", message: "Cargando..." },
  saldoLiquidarAnticipo: { kind: "error", message: "Cargando..." },
  saldoLiquidarEntrega: { kind: "error", message: "Cargando..." },
  cantPendienteRelacionar: { kind: "error", message: "Cargando..." },
  cantPendienteLiquidar: { kind: "error", message: "Cargando..." },
  cantPorTipoLiquidar: { kind: "error", message: "Cargando..." },
  cantPorTipoRelacionar: { kind: "error", message: "Cargando..." },
}
