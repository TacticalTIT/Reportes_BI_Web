import { Skeleton } from "@/components/ui/skeleton"

function formatMoney(n: number, currencyCode: string) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode.length === 3 ? currencyCode : "PEN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 0,
  }).format(n)
}

type Props = {
  totalInventario: number
  totalFilas: number
  recursosConStock: number
  flujoNeto: number
  currencyCode?: string
  isPending?: boolean
}

export function StockAlmacenKpiCards({
  totalInventario,
  totalFilas,
  recursosConStock,
  flujoNeto,
  currencyCode = "PEN",
  isPending = false,
}: Props) {
  if (isPending) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm"
          >
            <Skeleton className="h-3 w-36" />
            <Skeleton className="mt-4 h-10 w-40" />
            <Skeleton className="mt-2 h-4 w-full max-w-xs" />
          </div>
        ))}
      </section>
    )
  }

  const cards = [
    {
      key: "inventario",
      borderClass: "border-(--color-brand-primary)",
      label: "Valor total inventario",
      value: formatMoney(totalInventario, currencyCode),
      hint: "Consolidado monetario del almacen.",
    },
    {
      key: "filas",
      borderClass: "border-(--color-brand-tertiary)",
      label: "Filas reportadas",
      value: formatNumber(totalFilas),
      hint: "Total de registros en la tabla.",
    },
    {
      key: "recursos",
      borderClass: "border-(--color-brand-secondary)",
      label: "Recursos con stock",
      value: formatNumber(recursosConStock),
      hint: "Recursos unicos con stock mayor a cero.",
    },
    {
      key: "flujo",
      borderClass: "border-(--color-brand-primary)",
      label: "Flujo neto",
      value: formatNumber(flujoNeto),
      hint: "Diferencia entre ingresos y egresos.",
    },
  ] as const

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`flex flex-col justify-between rounded-2xl border-l-[6px] bg-card p-6 shadow-sm ${card.borderClass}`}
        >
          <p className="text-[11px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
            {card.label}
          </p>
          <div className="mt-3 text-2xl font-extrabold tracking-tight text-(--color-brand-primary) tabular-nums sm:text-3xl">
            {card.value}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{card.hint}</p>
        </div>
      ))}
    </section>
  )
}
