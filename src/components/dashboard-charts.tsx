"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ventasPorMes, participacionCategoria } from "@/lib/mock-data"

const ventasConfig = {
  ventas: {
    label: "Ventas (miles)",
    color: "var(--color-chart-1)",
  },
  meta: {
    label: "Meta",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

const categoriaConfig = {
  valor: {
    label: "% participación",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig

export function VentasMetaChart() {
  return (
    <ChartContainer config={ventasConfig} className="h-[280px] w-full">
      <BarChart data={ventasPorMes} margin={{ left: 8, right: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="mes"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="ventas"
          fill="var(--color-ventas)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="meta"
          fill="var(--color-meta)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

export function ParticipacionLineChart() {
  return (
    <ChartContainer config={categoriaConfig} className="h-[280px] w-full">
      <LineChart data={participacionCategoria} margin={{ left: 8, right: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="categoria"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="valor"
          stroke="var(--color-valor)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-valor)" }}
        />
      </LineChart>
    </ChartContainer>
  )
}
