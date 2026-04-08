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
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-2xl border-l-[6px] border-(--color-brand-primary) bg-card p-8 shadow-sm">
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Pendiente por liquidar
        </p>
        <div className="mt-4 text-5xl font-extrabold tracking-tight text-(--color-brand-primary) tabular-nums">
          {loading ? <Skeleton className="h-12 w-44" /> : kpiPendienteLiquidar}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {biop.cantPendienteLiquidar.kind === "error"
            ? biop.cantPendienteLiquidar.message
            : "Documentos esperando liquidación"}
        </p>
      </div>
      <div className="flex flex-col justify-between rounded-2xl border-l-[6px] border-(--color-brand-tertiary) bg-card p-8 shadow-sm">
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Pendiente por relacionar
        </p>
        <div className="mt-4 text-5xl font-extrabold tracking-tight text-(--color-brand-primary) tabular-nums">
          {loading ? <Skeleton className="h-12 w-44" /> : kpiPendienteRelacionar}
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
