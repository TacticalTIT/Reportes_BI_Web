"use client"

import { ReportErrorState } from "@/components/report-states"
import { DocumentosKpiCards } from "./kpi-cards"
import { DocumentosMobileDock } from "./mobile-dock"
import { DocumentosSidebarInsights } from "./sidebar-insights"
import { DocumentosTableCard } from "./documentos-table-card"
import {
  useDocNoRelKpisQuery,
  useDocNoRelResumenQuery,
  useDocNoRelTablaQuery,
} from "../queries"
import { useDocumentosStore } from "../store"

export function DocumentosScreen() {
  const { page, pageSize, setPage, setPageSize } = useDocumentosStore()
  const tablaQuery = useDocNoRelTablaQuery({ page, pageSize })
  const kpiQuery = useDocNoRelKpisQuery()
  const resumenQuery = useDocNoRelResumenQuery()

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize)
  }

  const tablaData = tablaQuery.data
  const data = tablaData?.items ?? []
  const pagination =
    tablaData?.pagination ?? {
      page,
      pageSize,
      totalRows: 0,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      prevPage: null,
      nextPage: null,
      visiblePages: [1],
    }
  const currency = tablaData?.currency
  const empty = !tablaQuery.isLoading && data.length === 0

  const tablaErrorMessage =
    tablaQuery.error instanceof Error
      ? tablaQuery.error.message
      : "No se pudo cargar la tabla."

  const kpisErrorMessage =
    kpiQuery.error instanceof Error
      ? kpiQuery.error.message
      : "No se pudieron cargar los KPIs."

  const resumenErrorMessage =
    resumenQuery.error instanceof Error
      ? resumenQuery.error.message
      : "No se pudieron cargar los resúmenes por tipo."

  return (
    <main className="dashboard-surface min-h-screen space-y-10 pb-20 md:pb-0">
      <div className="mx-auto w-full max-w-[1600px] space-y-10 px-2 md:px-4 xl:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-(--color-brand-primary) uppercase">
              Documentos no relacionados
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Control previo financiero con KPIs y trazabilidad por tipo documental.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-(--color-brand-primary) px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Exportar reporte
          </button>
        </div>

        {kpiQuery.isError ? (
          <ReportErrorState
            message={kpisErrorMessage}
            onRetry={() => void kpiQuery.refetch()}
          />
        ) : (
          <DocumentosKpiCards kpis={kpiQuery.data} isPending={kpiQuery.isPending} />
        )}

        {resumenQuery.isError ? (
          <ReportErrorState
            message={resumenErrorMessage}
            onRetry={() => void resumenQuery.refetch()}
          />
        ) : (
          <DocumentosSidebarInsights
            resumen={resumenQuery.data}
            isPending={resumenQuery.isPending}
          />
        )}

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
            currency={currency}
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
