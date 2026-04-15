"use client"

import { useState } from "react"
import { ReportErrorState } from "@/components/report-states"
import { useEstadoOrdenesOverviewQuery, useEstadoOrdenesTablaQuery } from "@/features/estado-oc-os/queries"
import { EstadoDistribucionCard } from "./estado-distribucion-card"
import { EstadoOcOsKpiCards } from "./kpi-cards"
import { EstadoOcOsTableCard } from "./estado-oc-os-table-card"
import { FacturadoPendienteCard } from "./facturado-pendiente-card"

export function EstadoOcOsScreen() {
  const [page, setPage] = useState(1)
  const overviewQuery = useEstadoOrdenesOverviewQuery()
  const tablaQuery = useEstadoOrdenesTablaQuery(page)

  const tablaData = tablaQuery.data
  const detailRows = tablaData?.items ?? []
  const pagination =
    tablaData?.pagination ?? {
      page,
      pageSize: 10,
      totalRows: 0,
      totalPages: 1,
      hasPrev: false,
      hasNext: false,
      prevPage: null,
      nextPage: null,
      visiblePages: [1],
    }
  const empty = !tablaQuery.isLoading && detailRows.length === 0

  const tablaError =
    tablaQuery.error instanceof Error
      ? tablaQuery.error.message
      : "No se pudo cargar la tabla de estado OC/OS."
  const overviewError =
    overviewQuery.error instanceof Error
      ? overviewQuery.error.message
      : "No se pudieron cargar los indicadores del tablero."

  return (
    <main className="dashboard-surface min-h-screen pb-12">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-2 py-6 md:px-4 xl:px-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-(--color-brand-primary)/70 uppercase">
              Control previo
            </p>
            <h1 className="text-3xl font-black tracking-tight text-(--color-brand-primary) md:text-4xl">
              Estado OC/OS
            </h1>
            <p className="max-w-2xl text-sm font-medium text-muted-foreground">
              Seguimiento del ciclo documental y facturación de ordenes de compra/servicio.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-(--color-brand-primary) px-5 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
          >
            Exportar vista
          </button>
        </header>

        {overviewQuery.isError ? (
          <ReportErrorState message={overviewError} onRetry={() => void overviewQuery.refetch()} />
        ) : (
          <EstadoOcOsKpiCards kpis={overviewQuery.data?.kpis} isPending={overviewQuery.isPending} />
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            {overviewQuery.isError ? (
              <ReportErrorState message={overviewError} onRetry={() => void overviewQuery.refetch()} />
            ) : (
              <EstadoDistribucionCard
                tablaA={overviewQuery.data?.tablaA ?? []}
                tablaB={overviewQuery.data?.tablaB ?? []}
                isPending={overviewQuery.isPending}
              />
            )}
          </div>
          <div>
            {overviewQuery.isError ? (
              <ReportErrorState message={overviewError} onRetry={() => void overviewQuery.refetch()} />
            ) : (
              <FacturadoPendienteCard
                rows={overviewQuery.data?.facturadoPendiente ?? []}
                isPending={overviewQuery.isPending}
              />
            )}
          </div>
        </section>

        {tablaQuery.isError ? (
          <ReportErrorState message={tablaError} onRetry={() => void tablaQuery.refetch()} />
        ) : (
          <EstadoOcOsTableCard
            data={detailRows}
            empty={empty}
            loading={tablaQuery.isLoading}
            pagination={pagination}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        )}
      </div>
    </main>
  )
}
