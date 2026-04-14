"use client"

import { useMemo, useState } from "react"
import { ReportErrorState } from "@/components/report-states"
import {
  useIngNoRelKpisQuery,
  useIngNoRelTablaQuery,
  useIngNoRelTop10Query,
} from "../queries"
import { IngresosNoRelKpiCards } from "./kpi-cards"
import { IngresosNoRelTableCard } from "./ingresos-table-card"
import { Top10ProveedoresChart } from "./top10-proveedores-chart"
import type { ControlPrevioIngNoRelTop10Item } from "@/lib/controlprevio-ingresos-no-relacionados"

function formatCompactMoney(n: number, currencyCode: string) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode.length === 3 ? currencyCode : "PEN",
    maximumFractionDigits: 0,
  }).format(n)
}

function ConcentrationBar({
  totalKpi,
  top10Items,
  currencyCode,
}: {
  totalKpi: number
  top10Items: ControlPrevioIngNoRelTop10Item[]
  currencyCode: string
}) {
  const { sumTop10, rest, pctTop } = useMemo(() => {
    const sumTop10 = top10Items.reduce((acc, i) => acc + i.sumMontoS, 0)
    const rest = totalKpi - sumTop10
    const pctTop = totalKpi > 0 ? (sumTop10 / totalKpi) * 100 : 0
    return { sumTop10, rest, pctTop }
  }, [totalKpi, top10Items])

  if (totalKpi <= 0 || rest < 0 || top10Items.length === 0) return null

  const pctRest = Math.max(0, 100 - pctTop)

  return (
    <div className="mt-6 rounded-xl border border-border/60 bg-muted/15 p-4">
      <p className="text-[11px] font-bold tracking-wide text-(--color-brand-primary) uppercase">
        Concentración vs total KPI
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Top 10 acumulado frente al total parcial del panel de KPIs.
      </p>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-(--color-brand-primary) transition-all"
          style={{ width: `${pctTop}%` }}
          title={`Top 10: ${formatCompactMoney(sumTop10, currencyCode)}`}
        />
        <div
          className="h-full bg-(--color-brand-tertiary)/50"
          style={{ width: `${pctRest}%` }}
          title={`Resto: ${formatCompactMoney(rest, currencyCode)}`}
        />
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-2 text-[11px] text-muted-foreground">
        <span>
          Top 10:{" "}
          <strong className="text-foreground">{formatCompactMoney(sumTop10, currencyCode)}</strong>{" "}
          ({pctTop.toFixed(1)}%)
        </span>
        <span>
          Otros:{" "}
          <strong className="text-foreground">{formatCompactMoney(rest, currencyCode)}</strong>{" "}
          ({pctRest.toFixed(1)}%)
        </span>
      </div>
    </div>
  )
}

export function IngresosScreen() {
  const [page, setPage] = useState(1)
  const tablaQuery = useIngNoRelTablaQuery(page)
  const kpiQuery = useIngNoRelKpisQuery()
  const top10Query = useIngNoRelTop10Query()

  const tablaData = tablaQuery.data
  const data = tablaData?.items ?? []
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
  const tablaCurrency = tablaData?.currency
  const kpiCurrency = kpiQuery.data?.currency
  const top10Currency = top10Query.data?.currency
  const currencyCode = kpiCurrency?.code ?? tablaCurrency?.code ?? top10Currency?.code ?? "PEN"

  const empty = !tablaQuery.isLoading && data.length === 0

  const tablaError =
    tablaQuery.error instanceof Error
      ? tablaQuery.error.message
      : "No se pudo cargar la tabla."
  const kpisError =
    kpiQuery.error instanceof Error ? kpiQuery.error.message : "No se pudieron cargar los KPIs."
  const top10Error =
    top10Query.error instanceof Error
      ? top10Query.error.message
      : "No se pudo cargar el ranking."

  return (
    <main className="dashboard-surface min-h-screen pb-12">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-2 py-6 md:px-4 xl:px-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-(--color-brand-primary)/70 uppercase">
              Control previo
            </p>
            <h1 className="text-3xl font-black tracking-tight text-(--color-brand-primary) md:text-4xl">
              Ingresos no relacionados
            </h1>
            <p className="max-w-2xl text-sm font-medium text-muted-foreground">
              Montos, ranking de proveedores y detalle paginado para seguimiento financiero.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-(--color-brand-primary) px-5 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
          >
            Exportar vista
          </button>
        </header>

        {kpiQuery.isError ? (
          <ReportErrorState message={kpisError} onRetry={() => void kpiQuery.refetch()} />
        ) : (
          <IngresosNoRelKpiCards
            kpis={kpiQuery.data?.kpis}
            currencyCode={currencyCode}
            isPending={kpiQuery.isPending}
          />
        )}

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {tablaQuery.isError ? (
              <ReportErrorState message={tablaError} onRetry={() => void tablaQuery.refetch()} />
            ) : (
              <IngresosNoRelTableCard
                data={data}
                empty={empty}
                loading={tablaQuery.isLoading}
                currency={tablaCurrency}
                pagination={pagination}
                onPageChange={(p) => setPage(p)}
              />
            )}
          </div>
          <div className="space-y-6 lg:col-span-4">
            {top10Query.isError ? (
              <ReportErrorState message={top10Error} onRetry={() => void top10Query.refetch()} />
            ) : (
              <>
                <Top10ProveedoresChart
                  items={top10Query.data?.items ?? []}
                  currencyCode={top10Currency?.code ?? currencyCode}
                  isPending={top10Query.isPending}
                />
                {kpiQuery.data?.kpis != null && top10Query.data?.items != null ? (
                  <ConcentrationBar
                    totalKpi={kpiQuery.data.kpis.sumParcial}
                    top10Items={top10Query.data.items}
                    currencyCode={currencyCode}
                  />
                ) : null}
              </>
            )}
          </div>
        </section>
      </div>

      <footer className="mx-auto mt-8 flex w-full max-w-[1600px] flex-col justify-between gap-4 border-t border-border px-2 py-8 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase md:flex-row md:px-4 xl:px-6">
        <span>&copy; 2024 Precision Ledger Executive Suite</span>
        <div className="flex gap-4 md:gap-6">
          <a className="transition-colors hover:text-(--color-brand-primary)" href="#">
            Documentación
          </a>
          <a className="transition-colors hover:text-(--color-brand-primary)" href="#">
            Cumplimiento
          </a>
        </div>
      </footer>
    </main>
  )
}
