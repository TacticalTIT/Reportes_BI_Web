"use client"

import { useMemo } from "react"
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ControlPrevioStockAlmacenInventarioCategoriaItem } from "@/lib/controlprevio-stock-almacen"

type ChartRow = {
  key: string
  label: string
  sumMontoS: number
  fill: string
}

const COLORS = [
  "var(--color-brand-primary)",
  "var(--color-brand-secondary)",
  "var(--color-brand-tertiary)",
  "#4F46E5",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
]

function formatMoney(n: number, currencyCode: string) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode.length === 3 ? currencyCode : "PEN",
    maximumFractionDigits: 0,
  }).format(n)
}

type Props = {
  items: ControlPrevioStockAlmacenInventarioCategoriaItem[]
  currencyCode?: string
  isPending?: boolean
}

export function InventarioCategoriaChart({
  items,
  currencyCode = "PEN",
  isPending = false,
}: Props) {
  const chartData = useMemo<ChartRow[]>(() => {
    return items
      .map((item, idx) => ({
        key: `cat_${idx + 1}`,
        label: item.tipoAlmacenServicio ?? `Categoria ${idx + 1}`,
        sumMontoS: item.sumMontoS,
        fill: COLORS[idx % COLORS.length],
      }))
      .filter((item) => item.sumMontoS > 0)
      .sort((a, b) => b.sumMontoS - a.sumMontoS)
  }, [items])

  const chartConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = {}
    for (const row of chartData) {
      config[row.key] = {
        label: row.label,
        color: row.fill,
      }
    }
    return config
  }, [chartData])

  const total = chartData.reduce((acc, item) => acc + item.sumMontoS, 0)

  return (
    <Card className="rounded-2xl border border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
          Inventario por categoria
        </CardTitle>
        <CardDescription>Distribucion monetaria por tipo de almacen/servicio.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && items.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-4 w-56" />
          </div>
        ) : chartData.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/80 px-4 py-8 text-center text-sm text-muted-foreground">
            No hay datos para el grafico por categoria.
          </p>
        ) : (
          <div className="space-y-4">
            <ChartContainer
              className="mx-auto h-[280px] w-full"
              config={chartConfig}
              initialDimension={{ width: 520, height: 280 }}
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatMoney(Number(value), currencyCode)}
                    />
                  }
                />
                <Pie
                  data={chartData}
                  dataKey="sumMontoS"
                  nameKey="key"
                  innerRadius={72}
                  outerRadius={105}
                  strokeWidth={2}
                />
              </PieChart>
            </ChartContainer>
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Total inventario categorizado: {formatMoney(total, currencyCode)}
              </p>
              <ul className="space-y-1.5">
                {chartData.slice(0, 5).map((row) => (
                  <li key={row.key} className="flex items-center justify-between gap-3 text-xs">
                    <span className="truncate text-muted-foreground">{row.label}</span>
                    <span className="font-semibold tabular-nums text-(--color-brand-primary)">
                      {formatMoney(row.sumMontoS, currencyCode)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
