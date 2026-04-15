"use client"

import { useMemo, useState } from "react"
import { ReportErrorState } from "@/components/report-states"
import { InventarioCategoriaChart } from "./inventario-categoria-chart"
import { StockAlmacenKpiCards } from "./kpi-cards"
import { StockTableCard } from "./stock-table-card"
import { TopRecursosChart } from "./top-recursos-chart"
import {
  useStockAlmacenInventarioPorCategoriaQuery,
  useStockAlmacenTablaQuery,
  useStockAlmacenTopRecursosQuery,
} from "@/features/stock-almacen/queries"

function uniqueRecursosConStock(items: { recurso: string | null; sumStock: number }[]): number {
  const set = new Set<string>()
  for (const item of items) {
    if (!item.recurso || item.sumStock <= 0) continue
    set.add(item.recurso.trim().toLowerCase())
  }
  return set.size
}

export function StockAlmacenScreen() {
  const [page, setPage] = useState(1)
  const tablaQuery = useStockAlmacenTablaQuery(page)
  const inventarioQuery = useStockAlmacenInventarioPorCategoriaQuery()
  const topRecursosQuery = useStockAlmacenTopRecursosQuery()

  const tablaData = tablaQuery.data
  const rows = tablaData?.items ?? []
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
  const empty = !tablaQuery.isLoading && rows.length === 0

  const currency = topRecursosQuery.data?.currency ?? { code: "PEN", symbol: "S/" }
  const grandTotalRow = rows.find((row) => row.isGrandTotalRowTotal)
  const recursoRows = rows.filter((row) => !row.isGrandTotalRowTotal)

  const derivedKpis = useMemo(() => {
    const flujoNeto = grandTotalRow
      ? grandTotalRow.sumIngreso - grandTotalRow.sumEgreso
      : recursoRows.reduce((acc, row) => acc + (row.sumIngreso - row.sumEgreso), 0)

    return {
      totalInventario: topRecursosQuery.data?.kpi.sumMontoS ?? grandTotalRow?.sumMontoS ?? 0,
      totalFilas: pagination.totalRows,
      recursosConStock: uniqueRecursosConStock(recursoRows),
      flujoNeto,
    }
  }, [grandTotalRow, pagination.totalRows, recursoRows, topRecursosQuery.data?.kpi.sumMontoS])

  const tablaError =
    tablaQuery.error instanceof Error ? tablaQuery.error.message : "No se pudo cargar la tabla."
  const inventarioError =
    inventarioQuery.error instanceof Error
      ? inventarioQuery.error.message
      : "No se pudo cargar el inventario por categoria."
  const topRecursosError =
    topRecursosQuery.error instanceof Error
      ? topRecursosQuery.error.message
      : "No se pudo cargar el ranking de recursos."

  return (
    <main className="dashboard-surface min-h-screen pb-12">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-2 py-6 md:px-4 xl:px-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-(--color-brand-primary)/70 uppercase">
              Control previo
            </p>
            <h1 className="text-3xl font-black tracking-tight text-(--color-brand-primary) md:text-4xl">
              Stock almacen
            </h1>
            <p className="max-w-2xl text-sm font-medium text-muted-foreground">
              Visibilidad del inventario, composicion por categoria y ranking de recursos.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-(--color-brand-primary) px-5 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
          >
            Exportar vista
          </button>
        </header>

        <StockAlmacenKpiCards
          totalInventario={derivedKpis.totalInventario}
          totalFilas={derivedKpis.totalFilas}
          recursosConStock={derivedKpis.recursosConStock}
          flujoNeto={derivedKpis.flujoNeto}
          currencyCode={currency.code}
          isPending={tablaQuery.isPending || topRecursosQuery.isPending}
        />

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div>
            {inventarioQuery.isError ? (
              <ReportErrorState
                message={inventarioError}
                onRetry={() => void inventarioQuery.refetch()}
              />
            ) : (
              <InventarioCategoriaChart
                items={inventarioQuery.data ?? []}
                currencyCode={currency.code}
                isPending={inventarioQuery.isPending}
              />
            )}
          </div>
          <div>
            {topRecursosQuery.isError ? (
              <ReportErrorState
                message={topRecursosError}
                onRetry={() => void topRecursosQuery.refetch()}
              />
            ) : (
              <TopRecursosChart
                items={topRecursosQuery.data?.items ?? []}
                currencyCode={currency.code}
                isPending={topRecursosQuery.isPending}
              />
            )}
          </div>
        </section>

        {tablaQuery.isError ? (
          <ReportErrorState message={tablaError} onRetry={() => void tablaQuery.refetch()} />
        ) : (
          <StockTableCard
            data={rows}
            empty={empty}
            loading={tablaQuery.isLoading}
            currency={currency}
            pagination={pagination}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        )}
      </div>
    </main>
  )
}
