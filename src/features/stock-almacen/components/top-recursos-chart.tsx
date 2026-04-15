"use client"

import { useMemo } from "react"
import { Trophy } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { ControlPrevioStockAlmacenTopRecursoItem } from "@/lib/controlprevio-stock-almacen"

function formatMoney(n: number, currencyCode: string) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode.length === 3 ? currencyCode : "PEN",
    maximumFractionDigits: 0,
  }).format(n)
}

function barWidthPct(monto: number, max: number): number {
  if (max <= 0 || monto <= 0) return 6
  const t = Math.sqrt(monto / max)
  return Math.min(100, Math.max(8, t * 100))
}

type RowProps = {
  rank: number
  name: string
  monto: number
  currencyCode: string
  maxMonto: number
}

function LeaderRow({ rank, name, monto, currencyCode, maxMonto }: RowProps) {
  const width = barWidthPct(monto, maxMonto)
  const rankTone =
    rank === 1
      ? "bg-linear-to-br from-amber-500/90 to-amber-600 text-white shadow-sm"
      : rank === 2
        ? "bg-linear-to-br from-slate-400 to-slate-500 text-white shadow-sm"
        : rank === 3
          ? "bg-linear-to-br from-amber-700/85 to-amber-800 text-white shadow-sm"
          : "bg-muted text-muted-foreground"

  return (
    <li className="group rounded-xl border border-transparent px-2 py-2.5 transition-colors hover:border-border/80 hover:bg-muted/25 sm:px-3">
      <div className="flex gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-xs font-black tabular-nums",
            rankTone
          )}
          aria-label={`Puesto ${rank}`}
        >
          {rank}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <p className="text-[13px] font-semibold leading-snug tracking-tight text-foreground sm:line-clamp-2 sm:pr-2">
              {name}
            </p>
            <p className="shrink-0 text-right text-sm font-bold tabular-nums text-(--color-brand-primary) sm:pt-0.5">
              {formatMoney(monto, currencyCode)}
            </p>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-muted/90 ring-1 ring-border/40"
            role="presentation"
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-(--color-brand-primary)/85 to-(--color-brand-secondary)/80 transition-[width] duration-500 ease-out"
              style={{ width: `${width}%` }}
            />
          </div>
        </div>
      </div>
    </li>
  )
}

type Props = {
  items: ControlPrevioStockAlmacenTopRecursoItem[]
  currencyCode?: string
  isPending?: boolean
}

export function TopRecursosChart({
  items,
  currencyCode = "PEN",
  isPending = false,
}: Props) {
  const ranked = useMemo(() => {
    return [...items].sort((a, b) => b.sumMontoS - a.sumMontoS)
  }, [items])

  const maxMonto = ranked.length > 0 ? Math.max(...ranked.map((row) => row.sumMontoS)) : 0
  const sumTop = ranked.reduce((acc, row) => acc + row.sumMontoS, 0)

  if (isPending && items.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-md ring-1 ring-black/5">
        <div className="border-b border-border/60 bg-linear-to-r from-(--color-brand-primary)/8 via-transparent to-(--color-brand-secondary)/6 px-5 py-4">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-2 h-3 w-64" />
        </div>
        <div className="space-y-4 p-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (ranked.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-md ring-1 ring-black/5">
        <h3 className="text-lg font-bold tracking-tight text-(--color-brand-primary)">
          Top recursos
        </h3>
        <p className="mt-4 text-sm text-muted-foreground">No hay datos para el ranking.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-md ring-1 ring-black/5">
      <div className="relative border-b border-border/60 bg-linear-to-br from-(--color-brand-primary)/10 via-card to-(--color-brand-secondary)/5 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--color-brand-primary)/12 text-(--color-brand-primary)">
            <Trophy className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-(--color-brand-primary) sm:text-xl">
              Top recursos
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Ranking de recursos por valor monetario. Las barras usan escala de raiz cuadrada
              para mantener legibilidad.
            </p>
            <p className="text-[11px] font-semibold tabular-nums text-(--color-brand-primary)/90 sm:text-xs">
              Suma del ranking: {formatMoney(sumTop, currencyCode)}
            </p>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-border/50 px-2 py-2 sm:px-3 sm:py-3" aria-label="Ranking de recursos">
        {ranked.map((item, idx) => (
          <LeaderRow
            key={`${item.recurso ?? "recurso"}-${idx}`}
            rank={idx + 1}
            name={item.recurso ?? `Recurso ${idx + 1}`}
            monto={item.sumMontoS}
            currencyCode={currencyCode}
            maxMonto={maxMonto}
          />
        ))}
      </ul>
    </div>
  )
}
