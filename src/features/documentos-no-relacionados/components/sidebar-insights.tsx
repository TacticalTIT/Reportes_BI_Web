import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { BiopDashboardData } from "@/lib/biop-dashboard"
import {
  biopLiquidarRowsWithoutGrandTotal,
  biopTipoRowsWithoutGrandTotal,
  totalCantidadFromRows,
} from "../biop-aggregates"
import { formatCompactCurrency, formatFecha } from "../formatters"

type Props = { biop: BiopDashboardData; loading?: boolean }

export function DocumentosSidebarInsights({ biop, loading = false }: Props) {
  const relacionarRows = biopTipoRowsWithoutGrandTotal(biop.cantPorTipoRelacionar)
  const liquidarRows = biopLiquidarRowsWithoutGrandTotal(biop.cantPorTipoLiquidar)
  const totalRelacionar = totalCantidadFromRows(relacionarRows)
  const activosRelacionar = relacionarRows.slice(0, 3)
  const activosLiquidar = liquidarRows.slice(0, 3)

  const kpiFechaMasAntigua =
    biop.fechaMasAntigua.kind === "ok"
      ? formatFecha(biop.fechaMasAntigua.value)
      : "—"
  const kpiSaldoAnticipo =
    biop.saldoLiquidarAnticipo.kind === "ok"
      ? formatCompactCurrency(biop.saldoLiquidarAnticipo.value, "PEN")
      : "—"
  const kpiSaldoEntrega =
    biop.saldoLiquidarEntrega.kind === "ok"
      ? formatCompactCurrency(biop.saldoLiquidarEntrega.value, "PEN")
      : "—"

  if (loading) {
    return (
      <aside className="space-y-5">
        <Card className="shadow-sm ring-1 ring-foreground/5">
          <CardHeader className="border-b border-border/80 pb-3">
            <CardTitle className="text-sm font-bold text-primary">
              Conteo por tipo (relacionar)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </CardContent>
        </Card>
        <Card className="shadow-sm ring-1 ring-foreground/5">
          <CardHeader className="border-b border-border/80 pb-3">
            <CardTitle className="text-sm font-bold text-primary">
              Conteo por tipo (liquidar)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </CardContent>
        </Card>
      </aside>
    )
  }

  return (
    <aside className="space-y-5">
      <Card className="shadow-sm ring-1 ring-foreground/5">
        <CardHeader className="border-b border-border/80 pb-3">
          <CardTitle className="text-sm font-bold text-primary">
            Conteo por tipo (relacionar)
          </CardTitle>
          <CardDescription className="text-xs">
            Vista global del API BIOP.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-5">
            {activosRelacionar.map((row) => {
              const percent =
                totalRelacionar > 0
                  ? Math.max(
                      8,
                      Math.round((row.cantidad / totalRelacionar) * 100)
                    )
                  : 0
              return (
                <div key={row.TipoDocumento ?? "sin-tipo"} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tight">
                    <span className="text-muted-foreground">
                      {row.TipoDocumento ?? "Sin tipo"}
                    </span>
                    <span className="tabular-nums text-primary">
                      {row.cantidad.toLocaleString("es-MX")}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-(--color-brand-tertiary)"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm ring-1 ring-foreground/5">
        <CardHeader className="border-b border-border/80 pb-3">
          <CardTitle className="text-sm font-bold text-primary">
            Conteo por tipo (liquidar)
          </CardTitle>
          <CardDescription className="text-xs">
            Vista global del API BIOP.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <ul className="space-y-1">
            {activosLiquidar.map((row) => (
              <li
                key={row.TipoDocumento ?? "sin-tipo-liquidar"}
                className="flex items-center justify-between gap-3 border-b border-border/50 py-2.5 last:border-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="size-2 shrink-0 rounded-full bg-(--color-brand-secondary)"
                    aria-hidden
                  />
                  <span className="truncate text-sm text-muted-foreground">
                    {row.TipoDocumento ?? "Sin tipo"}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums">
                  {row.cantidad.toLocaleString("es-MX")}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary text-primary-foreground shadow-md ring-1 ring-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground/75">
            Contexto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-semibold leading-relaxed">
            Fecha más antigua: {kpiFechaMasAntigua}
          </p>
          <p className="text-primary-foreground/85">
            Saldo anticipo: {kpiSaldoAnticipo}
          </p>
          <p className="text-primary-foreground/85">
            Saldo entrega: {kpiSaldoEntrega}
          </p>
          <button
            type="button"
            className="mt-3 rounded-full bg-(--color-brand-secondary) px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-tight text-white"
          >
            Ver más
          </button>
        </CardContent>
      </Card>
    </aside>
  )
}
