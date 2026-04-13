import { Skeleton } from "@/components/ui/skeleton"
import type { SubcontratosDashboardData } from "@/lib/biop-subcontratos"
import {
  ClipboardList,
  Clock,
  FileWarning,
  Landmark,
  Wallet,
  Banknote,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatCount(value: number) {
  return value.toLocaleString("es-PE")
}

type KpiDef = {
  title: string
  value: number
  icon: LucideIcon
  format: "currency" | "count"
}

type Props = {
  data?: SubcontratosDashboardData
  isPending?: boolean
}

export function KpiCards({ data, isPending = false }: Props) {
  const countKpis: KpiDef[] = [
    {
      title: "Cantidad Subcontratos",
      value: data?.cantidadSubcontratos ?? 0,
      icon: ClipboardList,
      format: "count",
    },
    {
      title: "Pendiente Valorizar",
      value: data?.pendienteValorizar ?? 0,
      icon: Clock,
      format: "count",
    },
    {
      title: "Pendiente Facturar",
      value: data?.pendienteFacturar ?? 0,
      icon: FileWarning,
      format: "count",
    },
  ]

  const moneyKpis: KpiDef[] = [
    {
      title: "Adelanto por Amortizar",
      value: data?.adelantoPorAmortizar ?? 0,
      icon: Landmark,
      format: "currency",
    },
    {
      title: "Total Pago a Cuenta",
      value: data?.totalPagoCuenta ?? 0,
      icon: Wallet,
      format: "currency",
    },
    {
      title: "Total Adelanto",
      value: data?.totalAdelanto ?? 0,
      icon: Banknote,
      format: "currency",
    },
  ]

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {countKpis.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} isPending={isPending} />
        ))}
      </section>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {moneyKpis.map((kpi) => (
          <KpiCard key={kpi.title} kpi={kpi} isPending={isPending} />
        ))}
      </section>
    </div>
  )
}

function KpiCard({ kpi, isPending }: { kpi: KpiDef; isPending: boolean }) {
  const Icon = kpi.icon
  return (
    <article className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <span className="inline-flex rounded-xl bg-muted p-2.5 text-(--color-brand-primary)">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
        {kpi.title}
      </p>
      {isPending ? (
        <Skeleton className="mt-2 h-8 w-36" />
      ) : (
        <p className="mt-1.5 text-2xl font-black tracking-tight text-(--color-brand-primary)">
          {kpi.format === "currency"
            ? formatCurrency(kpi.value)
            : formatCount(kpi.value)}
        </p>
      )}
    </article>
  )
}
