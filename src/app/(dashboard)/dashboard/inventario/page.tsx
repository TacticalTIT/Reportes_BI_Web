"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { tendenciaInventario, alertasOperacion } from "@/lib/mock-data"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"

const invConfig = {
  stock: {
    label: "Stock (uds.)",
    color: "var(--color-chart-1)",
  },
  rotacion: {
    label: "Rotación",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig

export default function InventarioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventario</h1>
        <p className="text-sm text-muted-foreground">
          Niveles de stock y alertas operativas (demostración).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendencia de stock y rotación</CardTitle>
          <CardDescription>Últimas semanas (ficticio)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={invConfig} className="h-[300px] w-full">
            <AreaChart data={tendenciaInventario} margin={{ left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="semana"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="stock"
                stroke="var(--color-stock)"
                fill="var(--color-stock)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="rotacion"
                stroke="var(--color-rotacion)"
                fill="var(--color-rotacion)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alertas</CardTitle>
          <CardDescription>Eventos que requieren seguimiento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {alertasOperacion.map((a) => (
            <div
              key={a.id}
              className="flex flex-col gap-1 rounded-lg border border-border bg-card px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{a.tipo}</p>
                <p className="text-sm text-muted-foreground">{a.detalle}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  a.severidad === "alta" &&
                    "bg-(--color-brand-secondary)/15 text-(--color-brand-secondary)",
                  a.severidad === "media" &&
                    "bg-(--color-brand-primary)/10 text-(--color-brand-primary)",
                  a.severidad === "baja" &&
                    "bg-(--color-brand-tertiary)/15 text-(--color-brand-tertiary)"
                )}
              >
                {a.severidad}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
