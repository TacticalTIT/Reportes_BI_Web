import {
  Card,
  CardContent,
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

type Props = {
  biop?: BiopDashboardData
  /** Primera carga o refetch sin datos anteriores. */
  isPending?: boolean
}

export function DocumentosSidebarInsights({ biop, isPending = false }: Props) {
  if (isPending && !biop) {
    return (
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm ring-1 ring-foreground/5">
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
        <Card className="rounded-2xl shadow-sm ring-1 ring-foreground/5">
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
      </section>
    )
  }

  if (!biop) return null

  const relacionarRows = biopTipoRowsWithoutGrandTotal(biop.cantPorTipoRelacionar)
  const liquidarRows = biopLiquidarRowsWithoutGrandTotal(biop.cantPorTipoLiquidar)
  const fallbackRelacionar =
    biop.cantPendienteRelacionar.kind === "ok"
      ? [{ TipoDocumento: "Total", cantidad: biop.cantPendienteRelacionar.value }]
      : []
  const fallbackLiquidar =
    biop.cantPendienteLiquidar.kind === "ok"
      ? [{ TipoDocumento: "Total", cantidad: biop.cantPendienteLiquidar.value }]
      : []
  const activosRelacionar = (relacionarRows.length ? relacionarRows : fallbackRelacionar).slice(
    0,
    3
  )
  const activosLiquidar = (liquidarRows.length ? liquidarRows : fallbackLiquidar).slice(0, 3)
  const totalRelacionar = totalCantidadFromRows(activosRelacionar)

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="rounded-2xl border border-border border-t-4 border-t-(--color-brand-tertiary) shadow-sm">
        <CardHeader className="border-b border-border/80 pb-3">
          <CardTitle className="text-sm font-black tracking-[0.18em] text-muted-foreground uppercase">
            Docs por relacionar
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {activosRelacionar.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin data disponible.</p>
          ) : (
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
                      <span className="tabular-nums text-(--color-brand-primary)">
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
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-border border-t-4 border-t-(--color-brand-secondary) shadow-sm">
        <CardHeader className="border-b border-border/80 pb-3">
          <CardTitle className="text-sm font-black tracking-[0.18em] text-muted-foreground uppercase">
            Docs por liquidar
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {activosLiquidar.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin data disponible.</p>
          ) : (
            <ul className="space-y-1">
              {activosLiquidar.map((row) => (
                <li
                  key={row.TipoDocumento ?? "sin-tipo-liquidar"}
                  className="flex items-center justify-between gap-3 border-b border-border/50 py-2.5 last:border-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="size-2 shrink-0 rounded-full bg-(--color-brand-secondary)" aria-hidden />
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
          )}
        </CardContent>
      </Card>
    </section>
  )
}
