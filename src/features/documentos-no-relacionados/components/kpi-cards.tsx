import type { BiopDashboardData } from "@/lib/biop-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

type Props = { biop: BiopDashboardData; loading?: boolean }

export function DocumentosKpiCards({ biop, loading = false }: Props) {
  const kpiPendienteLiquidar =
    biop.cantPendienteLiquidar.kind === "ok"
      ? biop.cantPendienteLiquidar.value.toLocaleString("es-MX")
      : "—"
  const kpiPendienteRelacionar =
    biop.cantPendienteRelacionar.kind === "ok"
      ? biop.cantPendienteRelacionar.value.toLocaleString("es-MX")
      : "—"

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-md ring-1 ring-primary/20">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/70">
          Pendiente por liquidar
        </p>
        <div className="mt-3 text-4xl font-extrabold tracking-tight tabular-nums">
          {loading ? <Skeleton className="h-10 w-28 bg-white/20" /> : kpiPendienteLiquidar}
        </div>
        <p className="mt-2 text-sm text-primary-foreground/75">
          {biop.cantPendienteLiquidar.kind === "error"
            ? biop.cantPendienteLiquidar.message
            : "Documentos esperando liquidación"}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm ring-1 ring-foreground/5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Pendiente por relacionar
        </p>
        <div className="mt-3 text-4xl font-extrabold tracking-tight text-primary tabular-nums">
          {loading ? <Skeleton className="h-10 w-28" /> : kpiPendienteRelacionar}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {biop.cantPendienteRelacionar.kind === "error"
            ? biop.cantPendienteRelacionar.message
            : "Documentos por vincular en control previo"}
        </p>
      </div>
    </section>
  )
}
