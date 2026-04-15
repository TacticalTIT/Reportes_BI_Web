"use client"

import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts"
import { ReportEmptyState, ReportErrorState } from "@/components/report-states"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  formatRankingAmount,
  mapAlertasPriorizadas,
  mapExecutiveKpis,
  mapFacturadoTrend,
  mapInventarioCategorias,
  mapProveedoresTop,
  mapRecursosTop,
  mapSubcontratosTop,
} from "@/features/informe-general/mappers"
import {
  useInformeGeneralDocumentosQuery,
  useInformeGeneralEstadoQuery,
  useInformeGeneralIngresosQuery,
  useInformeGeneralStockQuery,
  useInformeGeneralSubcontratosQuery,
} from "@/features/informe-general/queries"
import type { InformeGeneralKpi, InformeGeneralRankingItem } from "@/features/informe-general/types"

function toneToBorderClass(tone: InformeGeneralKpi["tone"]) {
  if (tone === "primary") return "border-(--color-brand-primary)"
  if (tone === "secondary") return "border-(--color-brand-secondary)"
  if (tone === "tertiary") return "border-(--color-brand-tertiary)"
  return "border-zinc-400"
}

function formatMoney(value: number, currencyCode: string) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode.length === 3 ? currencyCode : "PEN",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCount(value: number) {
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 0,
  }).format(value)
}

function RankingCard({
  title,
  description,
  items,
  currencyCode,
  isPending,
}: {
  title: string
  description: string
  items: InformeGeneralRankingItem[]
  currencyCode: string
  isPending: boolean
}) {
  const maxAmount = items.length > 0 ? Math.max(...items.map((item) => item.amount)) : 0

  return (
    <Card className="rounded-2xl border border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && items.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">
            No hay datos para el ranking.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, idx) => {
              const pct = maxAmount > 0 ? Math.max(8, (item.amount / maxAmount) * 100) : 8
              return (
                <li key={`${item.label}-${idx}`} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <p className="truncate text-muted-foreground">{item.label}</p>
                    <p className="font-semibold tabular-nums text-(--color-brand-primary)">
                      {formatRankingAmount(item.amount, currencyCode)}
                    </p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-(--color-brand-primary) to-(--color-brand-secondary)"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function InformeGeneralScreen() {
  const estadoQuery = useInformeGeneralEstadoQuery()
  const subcontratosQuery = useInformeGeneralSubcontratosQuery()
  const documentosQuery = useInformeGeneralDocumentosQuery()
  const ingresosQuery = useInformeGeneralIngresosQuery()
  const stockQuery = useInformeGeneralStockQuery()

  const currencyCode =
    ingresosQuery.data?.currency.code ?? stockQuery.data?.topRecursos.currency.code ?? "PEN"

  const kpis = useMemo(
    () =>
      mapExecutiveKpis({
        estadoKpis: estadoQuery.data?.kpis,
        subcontratos: subcontratosQuery.data,
        documentosKpis: documentosQuery.data?.kpis,
        ingresosKpis: ingresosQuery.data?.kpis,
        currencyCode,
      }),
    [
      currencyCode,
      documentosQuery.data?.kpis,
      estadoQuery.data?.kpis,
      ingresosQuery.data?.kpis,
      subcontratosQuery.data,
    ]
  )

  const trend = useMemo(() => mapFacturadoTrend(estadoQuery.data?.facturadoPendiente), [estadoQuery.data])

  const subTop = useMemo(() => mapSubcontratosTop(subcontratosQuery.data?.top10), [subcontratosQuery.data])
  const proveedoresTop = useMemo(
    () => mapProveedoresTop(ingresosQuery.data?.top10),
    [ingresosQuery.data]
  )
  const recursosTop = useMemo(
    () => mapRecursosTop(stockQuery.data?.topRecursos.items),
    [stockQuery.data]
  )

  const categorias = useMemo(
    () => mapInventarioCategorias(stockQuery.data?.inventarioCategoria),
    [stockQuery.data]
  )

  const alertas = useMemo(
    () =>
      mapAlertasPriorizadas({
        porLiquidar: documentosQuery.data?.resumen.porLiquidar,
        porRelacionar: documentosQuery.data?.resumen.porRelacionar,
      }),
    [documentosQuery.data]
  )

  const trendTotal = trend.reduce(
    (acc, row) => acc + row.pendienteParcial + row.pendienteSinFacturar + row.pendienteTotal,
    0
  )
  const categoriaTotal = categorias.reduce((acc, row) => acc + row.amount, 0)

  const trendConfig: ChartConfig = {
    pendienteParcial: { label: "Parcial", color: "var(--color-brand-primary)" },
    pendienteSinFacturar: { label: "Sin facturar", color: "var(--color-brand-secondary)" },
    pendienteTotal: { label: "Total", color: "var(--color-brand-tertiary)" },
  }

  const categoriasConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {}
    for (const item of categorias) {
      config[item.key] = {
        label: item.label,
        color: item.fill,
      }
    }
    return config
  }, [categorias])

  const showKpiSkeleton =
    (estadoQuery.isPending ||
      subcontratosQuery.isPending ||
      documentosQuery.isPending ||
      ingresosQuery.isPending) &&
    !estadoQuery.data &&
    !subcontratosQuery.data &&
    !documentosQuery.data &&
    !ingresosQuery.data

  return (
    <main className="dashboard-surface min-h-screen pb-12">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-2 py-6 md:px-4 xl:px-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-(--color-brand-primary)/70 uppercase">
              Control previo
            </p>
            <h1 className="text-3xl font-black tracking-tight text-(--color-brand-primary) md:text-4xl">
              Informe general
            </h1>
            <p className="max-w-3xl text-sm font-medium text-muted-foreground">
              Dashboard ejecutivo con foco en exposición financiera, backlog operativo y
              concentración de riesgo.
            </p>
          </div>
        </header>

        {showKpiSkeleton ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <article
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
              >
                <Skeleton className="h-3 w-32" />
                <Skeleton className="mt-3 h-9 w-28" />
                <Skeleton className="mt-2 h-3 w-full" />
              </article>
            ))}
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <article
                key={kpi.id}
                className={`flex flex-col justify-between rounded-2xl border-l-[6px] bg-card p-5 shadow-sm ${toneToBorderClass(kpi.tone)}`}
              >
                <p className="text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                  {kpi.label}
                </p>
                <p className="mt-2 text-3xl font-black tracking-tight text-(--color-brand-primary) tabular-nums">
                  {kpi.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{kpi.hint}</p>
              </article>
            ))}
          </section>
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {estadoQuery.isError ? (
            <ReportErrorState
              message={
                estadoQuery.error instanceof Error
                  ? estadoQuery.error.message
                  : "No se pudo cargar la tendencia de facturación."
              }
              onRetry={() => void estadoQuery.refetch()}
            />
          ) : (
            <Card className="rounded-2xl border border-border/70 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
                  Tendencia mensual de facturación pendiente
                </CardTitle>
                <CardDescription>
                  Seguimiento temporal de parcial, sin facturar y total facturado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {estadoQuery.isPending && trend.length === 0 ? (
                  <div className="space-y-3">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                ) : trend.length === 0 ? (
                  <ReportEmptyState message="No hay historial de tendencia disponible." />
                ) : (
                  <div className="space-y-3">
                    <ChartContainer
                      className="mx-auto h-[300px] w-full"
                      config={trendConfig}
                      initialDimension={{ width: 640, height: 300 }}
                    >
                      <AreaChart data={trend}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="period" tickLine={false} axisLine={false} minTickGap={16} />
                        <YAxis
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("es-PE", { notation: "compact" }).format(
                              Number(value)
                            )
                          }
                          tickLine={false}
                          axisLine={false}
                          width={70}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              formatter={(value) => formatMoney(Number(value), currencyCode)}
                            />
                          }
                        />
                        <Area
                          type="monotone"
                          dataKey="pendienteParcial"
                          stackId="a"
                          stroke="var(--color-pendienteParcial)"
                          fill="var(--color-pendienteParcial)"
                          fillOpacity={0.8}
                        />
                        <Area
                          type="monotone"
                          dataKey="pendienteSinFacturar"
                          stackId="a"
                          stroke="var(--color-pendienteSinFacturar)"
                          fill="var(--color-pendienteSinFacturar)"
                          fillOpacity={0.8}
                        />
                        <Area
                          type="monotone"
                          dataKey="pendienteTotal"
                          stackId="a"
                          stroke="var(--color-pendienteTotal)"
                          fill="var(--color-pendienteTotal)"
                          fillOpacity={0.8}
                        />
                      </AreaChart>
                    </ChartContainer>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Monto total del histórico: {formatMoney(trendTotal, currencyCode)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {stockQuery.isError ? (
            <ReportErrorState
              message={
                stockQuery.error instanceof Error
                  ? stockQuery.error.message
                  : "No se pudo cargar la composición de inventario."
              }
              onRetry={() => void stockQuery.refetch()}
            />
          ) : (
            <Card className="rounded-2xl border border-border/70 bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
                  Inventario por categoría
                </CardTitle>
                <CardDescription>Distribución monetaria por tipo de almacén/servicio.</CardDescription>
              </CardHeader>
              <CardContent>
                {stockQuery.isPending && categorias.length === 0 ? (
                  <div className="space-y-3">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                ) : categorias.length === 0 ? (
                  <ReportEmptyState message="No hay categorías de inventario para mostrar." />
                ) : (
                  <div className="space-y-3">
                    <ChartContainer
                      className="mx-auto h-[300px] w-full"
                      config={categoriasConfig}
                      initialDimension={{ width: 520, height: 300 }}
                    >
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              formatter={(value) => formatMoney(Number(value), currencyCode)}
                            />
                          }
                        />
                        <Pie
                          data={categorias}
                          dataKey="amount"
                          nameKey="key"
                          innerRadius={72}
                          outerRadius={112}
                          strokeWidth={2}
                        />
                      </PieChart>
                    </ChartContainer>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Total inventario categorizado: {formatMoney(categoriaTotal, currencyCode)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {subcontratosQuery.isError ? (
            <ReportErrorState
              message={
                subcontratosQuery.error instanceof Error
                  ? subcontratosQuery.error.message
                  : "No se pudo cargar el Top de subcontratos."
              }
              onRetry={() => void subcontratosQuery.refetch()}
            />
          ) : (
            <RankingCard
              title="Top subcontratos"
              description="Mayor concentración de monto en contratos."
              items={subTop}
              currencyCode={currencyCode}
              isPending={subcontratosQuery.isPending}
            />
          )}
          {ingresosQuery.isError ? (
            <ReportErrorState
              message={
                ingresosQuery.error instanceof Error
                  ? ingresosQuery.error.message
                  : "No se pudo cargar el Top de proveedores."
              }
              onRetry={() => void ingresosQuery.refetch()}
            />
          ) : (
            <RankingCard
              title="Top proveedores (ingresos no relacionados)"
              description="Proveedores con mayor monto pendiente acumulado."
              items={proveedoresTop}
              currencyCode={currencyCode}
              isPending={ingresosQuery.isPending}
            />
          )}
          {stockQuery.isError ? (
            <ReportErrorState
              message={
                stockQuery.error instanceof Error
                  ? stockQuery.error.message
                  : "No se pudo cargar el Top de recursos."
              }
              onRetry={() => void stockQuery.refetch()}
            />
          ) : (
            <RankingCard
              title="Top recursos de inventario"
              description="Recursos con mayor peso monetario en stock."
              items={recursosTop}
              currencyCode={currencyCode}
              isPending={stockQuery.isPending}
            />
          )}
        </section>

        {documentosQuery.isError ? (
          <ReportErrorState
            message={
              documentosQuery.error instanceof Error
                ? documentosQuery.error.message
                : "No se pudo cargar las alertas documentarias."
            }
            onRetry={() => void documentosQuery.refetch()}
          />
        ) : (
          <Card className="rounded-2xl border border-border/70 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
                Alertas operativas priorizadas
              </CardTitle>
              <CardDescription>
                Tipos de documento con mayor carga pendiente entre liquidar y relacionar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documentosQuery.isPending && alertas.length === 0 ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-10 w-full" />
                  ))}
                </div>
              ) : alertas.length === 0 ? (
                <ReportEmptyState message="No se encontraron alertas operativas." />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/70">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead className="bg-muted/40 text-xs text-muted-foreground uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">Tipo documento</th>
                        <th className="px-4 py-3 text-right">Por liquidar</th>
                        <th className="px-4 py-3 text-right">Por relacionar</th>
                        <th className="px-4 py-3 text-right">Total pendiente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alertas.map((row) => (
                        <tr key={row.tipoDocumento} className="border-t border-border/60">
                          <td className="px-4 py-3 font-medium text-foreground">{row.tipoDocumento}</td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {formatCount(row.porLiquidar)}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {formatCount(row.porRelacionar)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums text-(--color-brand-primary)">
                            {formatCount(row.totalPendientes)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
