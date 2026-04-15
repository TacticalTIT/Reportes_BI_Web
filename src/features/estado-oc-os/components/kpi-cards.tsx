import { Skeleton } from "@/components/ui/skeleton"
import type { EstadoOrdenesKpis } from "@/lib/controlprevio-estado-ordenes"

type Props = {
  kpis?: EstadoOrdenesKpis
  isPending?: boolean
}

type CardConfig = {
  key: keyof EstadoOrdenesKpis
  label: string
  hint: string
  borderClass: string
}

const CARD_CONFIG: CardConfig[] = [
  {
    key: "porAprobar",
    label: "Por Aprobar",
    hint: "Ordenes pendientes de validación.",
    borderClass: "border-(--color-brand-secondary)",
  },
  {
    key: "aprobado",
    label: "Aprobado",
    hint: "Ordenes con aprobación completada.",
    borderClass: "border-(--color-brand-primary)",
  },
  {
    key: "enSubcontrato",
    label: "En Subcontrato",
    hint: "Ordenes derivadas a subcontrato.",
    borderClass: "border-(--color-brand-tertiary)",
  },
  {
    key: "enAlmacen",
    label: "En Almacen",
    hint: "Ordenes ya ingresadas en almacén.",
    borderClass: "border-emerald-500",
  },
  {
    key: "parcialmenteEnAlmacen",
    label: "Parcialmente en Almacen",
    hint: "Ingresos parciales en proceso.",
    borderClass: "border-sky-500",
  },
  {
    key: "anulado",
    label: "Anulado",
    hint: "Ordenes anuladas en el periodo.",
    borderClass: "border-rose-500",
  },
  {
    key: "registrado",
    label: "Registrado",
    hint: "Estados registrados sin clasificar.",
    borderClass: "border-zinc-500",
  },
]

function formatInt(value: number) {
  return value.toLocaleString("es-PE")
}

export function EstadoOcOsKpiCards({ kpis, isPending = false }: Props) {
  if (isPending && !kpis) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <article
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
          >
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-4 h-9 w-20" />
            <Skeleton className="mt-2 h-3 w-44" />
          </article>
        ))}
      </section>
    )
  }

  if (!kpis) return null

  const totalOrdenes =
    kpis.anulado +
    kpis.porAprobar +
    kpis.aprobado +
    kpis.enSubcontrato +
    kpis.enAlmacen +
    kpis.parcialmenteEnAlmacen +
    kpis.registrado

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article className="flex flex-col justify-between rounded-2xl border-l-[6px] border-(--color-brand-primary) bg-card p-5 shadow-sm xl:col-span-2">
        <p className="text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
          Total de ordenes
        </p>
        <p className="mt-2 text-4xl font-black tracking-tight text-(--color-brand-primary) tabular-nums">
          {formatInt(totalOrdenes)}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Vista consolidada OC/OS para seguimiento operativo.
        </p>
      </article>
      {CARD_CONFIG.map((card) => (
        <article
          key={card.key}
          className={`flex flex-col justify-between rounded-2xl border-l-[6px] bg-card p-5 shadow-sm ${card.borderClass}`}
        >
          <p className="text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
            {card.label}
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight text-(--color-brand-primary) tabular-nums">
            {formatInt(kpis[card.key])}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{card.hint}</p>
        </article>
      ))}
    </section>
  )
}
