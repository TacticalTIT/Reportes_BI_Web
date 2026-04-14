import { Skeleton } from "@/components/ui/skeleton"
import type { ControlPrevioIngNoRelKpis } from "@/lib/controlprevio-ingresos-no-relacionados"

function formatMoney(n: number, currencyCode: string) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode.length === 3 ? currencyCode : "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

type Props = {
  kpis?: ControlPrevioIngNoRelKpis
  currencyCode?: string
  isPending?: boolean
}

export function IngresosNoRelKpiCards({ kpis, currencyCode = "PEN", isPending = false }: Props) {
  if (isPending && !kpis) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm"
          >
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-4 h-10 w-40" />
            <Skeleton className="mt-2 h-4 w-full max-w-xs" />
          </div>
        ))}
      </section>
    )
  }

  if (!kpis) return null

  const money = (n: number) => formatMoney(n, currencyCode)

  const cards = [
    {
      key: "sum",
      borderClass: "border-(--color-brand-primary)",
      label: "Total parcial (alcance)",
      value: money(kpis.sumParcial),
      hint: "Suma parcial consolidada en control previo.",
    },
    {
      key: "minFecha",
      borderClass: "border-(--color-brand-tertiary)",
      label: "Primera fecha",
      value: kpis.minFecha
        ? new Date(kpis.minFecha).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",
      hint: "Fecha mínima registrada en el conjunto.",
    },
    {
      key: "totServ",
      borderClass: "border-(--color-brand-primary)",
      label: "Total servicios",
      value: money(kpis.newIngTotalServicios),
      hint: "Ingresos por servicios.",
    },
    {
      key: "totMat",
      borderClass: "border-(--color-brand-secondary)",
      label: "Total materiales",
      value: money(kpis.newIngTotalMateriales),
      hint: "Ingresos por materiales.",
    },
    {
      key: "penServ",
      borderClass: "border-(--color-brand-primary)",
      label: "Pendiente servicios",
      value: money(kpis.newIngPendientesServicios),
      hint: "Monto pendiente — servicios.",
    },
    {
      key: "penMat",
      borderClass: "border-(--color-brand-secondary)",
      label: "Pendiente materiales",
      value: money(kpis.newIngPendientesMateriales),
      hint: "Monto pendiente — materiales.",
    },
  ] as const

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.key}
          className={`flex flex-col justify-between rounded-2xl border-l-[6px] bg-card p-6 shadow-sm ${c.borderClass}`}
        >
          <p className="text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
            {c.label}
          </p>
          <div className="mt-3 text-2xl font-extrabold tracking-tight text-(--color-brand-primary) tabular-nums sm:text-3xl">
            {c.value}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{c.hint}</p>
        </div>
      ))}
    </section>
  )
}
