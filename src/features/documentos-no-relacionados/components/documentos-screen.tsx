"use client"

import { useEffect, useMemo, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ReportErrorState } from "@/components/report-states"
import {
  buildRopresupuestoTablaSearchParams,
} from "@/lib/ropresupuesto-tabla"
import { parseRopresupuestoTablaFromSearchParams } from "@/lib/url-sync-table-filters"
import { DocumentosFiltersCard } from "./filters-card"
import { DocumentosKpiCards } from "./kpi-cards"
import { DocumentosMobileDock } from "./mobile-dock"
import { DocumentosSidebarInsights } from "./sidebar-insights"
import { DocumentosTableCard } from "./documentos-table-card"
import { useBiopDashboardQuery, useRopresupuestoTablaQuery } from "../queries"
import { useDocumentosStore } from "../store"

export function DocumentosScreen() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { page, pageSize, filters, hydrate, setFilters, setPage, setPageSize } =
    useDocumentosStore()
  const lastSyncedQuery = useRef<string | null>(null)

  const parsed = useMemo(
    () => parseRopresupuestoTablaFromSearchParams(searchParams),
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

  const tablaData = tablaQuery.data
  const data = tablaData?.data ?? []
  const pagination =
    tablaData?.pagination ?? {
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
  const message = tablaData?.message
  const empty = !tablaQuery.isLoading && data.length === 0

  const tablaErrorMessage =
    tablaQuery.error instanceof Error
      ? tablaQuery.error.message
      : "No se pudo cargar la tabla."

  const biopErrorMessage =
    biopQuery.error instanceof Error
      ? biopQuery.error.message
      : "No se pudo cargar el tablero BIOP."

  return (
    <main className="dashboard-surface min-h-screen space-y-10 pb-20 md:pb-0">
      <div className="mx-auto w-full max-w-[1600px] space-y-10 px-2 md:px-4 xl:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-(--color-brand-primary) uppercase">
              Documentos no relacionados
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Precision Ledger Executive View
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-(--color-brand-primary) px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Export Report
          </button>
        </div>

        {biopQuery.isError ? (
          <ReportErrorState
            message={biopErrorMessage}
            onRetry={() => void biopQuery.refetch()}
          />
        ) : (
          <>
            <DocumentosKpiCards
              biop={biopQuery.data}
              isPending={biopQuery.isPending}
            />
            <DocumentosSidebarInsights
              biop={biopQuery.data}
              isPending={biopQuery.isPending}
            />
          </>
        )}

        <DocumentosFiltersCard
          pageSize={pageSize}
          filters={filters}
          onApply={handleApplyFilters}
        />

        {tablaQuery.isError ? (
          <ReportErrorState
            message={tablaErrorMessage}
            onRetry={() => void tablaQuery.refetch()}
          />
        ) : (
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
        )}
      </div>
      <footer className="mx-auto mt-auto flex w-full max-w-[1600px] flex-col justify-between gap-6 border-t border-border px-2 py-10 text-[10px] font-bold tracking-widest text-muted-foreground uppercase md:flex-row md:px-4 xl:px-6">
        <span>© 2023 Precision Ledger Intelligence Systems</span>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <a className="transition-colors hover:text-(--color-brand-primary)" href="#">
            Documentation
          </a>
          <a className="transition-colors hover:text-(--color-brand-primary)" href="#">
            API Status
          </a>
          <a className="transition-colors hover:text-(--color-brand-primary)" href="#">
            Support
          </a>
          <a className="transition-colors hover:text-(--color-brand-primary)" href="#">
            Privacy Policy
          </a>
        </div>
      </footer>
      <DocumentosMobileDock />
    </main>
  )
}
