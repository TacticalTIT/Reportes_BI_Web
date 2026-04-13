"use client"

import { useState } from "react"
import { ReportErrorState } from "@/components/report-states"
import { useSubcontratosDashboardQuery } from "@/features/subcontratos/queries"
import { KpiCards } from "./kpi-cards"
import { SubcontratosTableCard } from "./subcontratos-table-card"
import { Top10Card } from "./top10-card"

/** Sin query por defecto: el backend `/api/controlprevio/subcontratos/*` devuelve el universo completo. */
const SUBCONTRATOS_DEFAULT_FILTERS = {}

export function SubcontratosScreen() {
  const [page, setPage] = useState(1)
  const pageSize = 10
  const query = useSubcontratosDashboardQuery(
    SUBCONTRATOS_DEFAULT_FILTERS,
    page,
    pageSize
  )

  const errorMessage =
    query.error instanceof Error
      ? query.error.message
      : "No se pudo cargar el tablero de subcontratos."

  return (
    <main className="dashboard-surface min-h-screen pb-12">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-2 py-6 md:px-4 xl:px-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-(--color-brand-primary)/70 uppercase">
              Strategic Performance
            </p>
            <h1 className="text-3xl font-black tracking-tight text-(--color-brand-primary) md:text-4xl">
              Subcontratos
            </h1>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-(--color-brand-primary) px-5 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition-opacity hover:opacity-90"
          >
            Export Ledger
          </button>
        </header>

        {query.isError ? (
          <ReportErrorState
            message={errorMessage}
            onRetry={() => void query.refetch()}
          />
        ) : (
          <>
            <KpiCards data={query.data} isPending={query.isPending} />
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <SubcontratosTableCard
                  rows={query.data?.tabla ?? []}
                  pagination={query.data?.tablaPagination ?? null}
                  isPending={query.isPending}
                  onPageChange={setPage}
                />
              </div>
              <div className="lg:col-span-4">
                <Top10Card
                  items={query.data?.top10 ?? []}
                  isPending={query.isPending}
                />
              </div>
            </section>
          </>
        )}
      </div>

      <footer className="mx-auto mt-8 flex w-full max-w-[1600px] flex-col justify-between gap-4 border-t border-border px-2 py-8 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase md:flex-row md:px-4 xl:px-6">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <span>&copy; 2024 Precision Ledger Executive Suite</span>
          <span>Contexto: {query.data?.context ?? "subcontratos"}</span>
        </div>
        <div className="flex gap-4 md:gap-6">
          <a
            className="transition-colors hover:text-(--color-brand-primary)"
            href="#"
          >
            Documentation
          </a>
          <a
            className="transition-colors hover:text-(--color-brand-primary)"
            href="#"
          >
            Compliance
          </a>
          <a
            className="transition-colors hover:text-(--color-brand-primary)"
            href="#"
          >
            System Health
          </a>
        </div>
      </footer>
    </main>
  )
}
