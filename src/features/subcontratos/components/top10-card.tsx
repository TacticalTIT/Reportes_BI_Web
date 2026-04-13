import { Skeleton } from "@/components/ui/skeleton"
import type { SubcontratosTop10Item } from "@/lib/biop-subcontratos"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value)
}

type Props = {
  items: SubcontratosTop10Item[]
  isPending?: boolean
}

export function Top10Card({ items, isPending = false }: Props) {
  const max = items.length > 0 ? Math.max(...items.map((i) => i.monto)) : 0

  return (
    <aside className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
      <h3 className="text-xl font-black tracking-tight text-(--color-brand-primary)">
        Subcontratos Top 10
      </h3>

      {isPending ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No hay datos para Top 10.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item, idx) => {
            const width = max > 0 ? Math.max((item.monto / max) * 100, 8) : 8
            return (
              <div key={`${item.nombre}-${idx}`} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-xs font-bold tracking-tight text-muted-foreground uppercase">
                  <span className="truncate">{item.nombre}</span>
                  <span className="shrink-0">{formatCurrency(item.monto)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-(--color-brand-primary)"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </aside>
  )
}
