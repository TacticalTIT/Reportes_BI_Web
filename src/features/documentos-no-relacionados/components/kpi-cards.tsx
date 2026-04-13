import type { BiopDashboardData } from "@/lib/biop-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  biop?: BiopDashboardData
  /** Primera carga sin datos en caché. */
  isPending?: boolean
}

export function DocumentosKpiCards({ biop, isPending = false }: Props) {
  if (isPending && !biop) {
    return (
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border-l-[6px] border-(--color-brand-primary) bg-card p-8 shadow-sm">
          <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
            Pendiente por liquidar
          </p>
          <div className="mt-4">
            <Skeleton className="h-12 w-44" />
          </div>
          <Skeleton className="mt-2 h-4 w-full max-w-xs" />
        </div>
        <div className="flex flex-col justify-between rounded-2xl border-l-[6px] border-(--color-brand-tertiary) bg-card p-8 shadow-sm">
          <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
            Pendiente por relacionar
          </p>
          <div className="mt-4">
            <Skeleton className="h-12 w-44" />
          </div>
          <Skeleton className="mt-2 h-4 w-full max-w-xs" />
        </div>
      </section>
    )
  }

  if (!biop) return null

  const kpiPendienteLiquidar =
    biop.cantPendienteLiquidar.kind === "ok"
      ? biop.cantPendienteLiquidar.value.toLocaleString("es-MX")
      : "—"
  const kpiPendienteRelacionar =
    biop.cantPendienteRelacionar.kind === "ok"
      ? biop.cantPendienteRelacionar.value.toLocaleString("es-MX")
      : "—"

  const errLiquidar =
    biop.cantPendienteLiquidar.kind === "error"
      ? biop.cantPendienteLiquidar.message
      : null
  const errRelacionar =
    biop.cantPendienteRelacionar.kind === "error"
      ? biop.cantPendienteRelacionar.message
      : null

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-2xl border-l-[6px] border-(--color-brand-primary) bg-card p-8 shadow-sm">
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Pendiente por liquidar
        </p>
        <div className="mt-4 text-5xl font-extrabold tracking-tight text-(--color-brand-primary) tabular-nums">
          {kpiPendienteLiquidar}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {errLiquidar ?? "Documentos esperando liquidación"}
        </p>
      </div>
      <div className="flex flex-col justify-between rounded-2xl border-l-[6px] border-(--color-brand-tertiary) bg-card p-8 shadow-sm">
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Pendiente por relacionar
        </p>
        <div className="mt-4 text-5xl font-extrabold tracking-tight text-(--color-brand-primary) tabular-nums">
          {kpiPendienteRelacionar}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {errRelacionar ?? "Documentos por vincular en control previo"}
        </p>
      </div>
    </section>
  )
}
