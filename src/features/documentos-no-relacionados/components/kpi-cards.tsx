import type { ControlPrevioDocNoRelKpis } from "@/lib/controlprevio-documentos-no-relacionados"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  kpis?: ControlPrevioDocNoRelKpis
  /** Primera carga sin datos en caché. */
  isPending?: boolean
}

export function DocumentosKpiCards({ kpis, isPending = false }: Props) {
  if (isPending && !kpis) {
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

  if (!kpis) return null

  return (
    <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col justify-between rounded-2xl border-l-[6px] border-(--color-brand-primary) bg-card p-8 shadow-sm">
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Pendiente por liquidar
        </p>
        <div className="mt-4 text-5xl font-extrabold tracking-tight text-(--color-brand-primary) tabular-nums">
          {kpis.newDocCantPendienteLiquidar.toLocaleString("es-MX")}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Documentos esperando proceso de liquidación.
        </p>
      </div>
      <div className="flex flex-col justify-between rounded-2xl border-l-[6px] border-(--color-brand-tertiary) bg-card p-8 shadow-sm">
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Pendiente por relacionar
        </p>
        <div className="mt-4 text-5xl font-extrabold tracking-tight text-(--color-brand-primary) tabular-nums">
          {kpis.newDocCantPendienteRelacionar.toLocaleString("es-MX")}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Documentos pendientes de relacionar en control previo.
        </p>
      </div>
    </section>
  )
}
