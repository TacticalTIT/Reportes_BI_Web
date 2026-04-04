import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { kpisResumen } from "@/lib/mock-data"
import { VentasMetaChart, ParticipacionLineChart } from "@/components/dashboard-charts"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n)
}

function KpiCard({
  title,
  value,
  change,
  invertTrend,
}: {
  title: string
  value: string
  change: number
  invertTrend?: boolean
}) {
  const positive = change >= 0
  const good = invertTrend ? !positive : positive
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            good ? "text-(--color-brand-tertiary)" : "text-destructive"
          )}
        >
          {good ? (
            <TrendingUp className="size-3.5" />
          ) : (
            <TrendingDown className="size-3.5" />
          )}
          {positive ? "+" : ""}
          {change}% vs. mes anterior
        </p>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const k = kpisResumen
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Resumen
        </h1>
        <p className="text-sm text-muted-foreground">
          Indicadores clave y tendencias (datos de demostración).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Ingresos del mes"
          value={formatCurrency(k.ingresosMes)}
          change={k.ingresosVariacion}
        />
        <KpiCard
          title="Pedidos"
          value={k.pedidosMes.toLocaleString("es-MX")}
          change={k.pedidosVariacion}
          invertTrend
        />
        <KpiCard
          title="Ticket promedio"
          value={formatCurrency(k.ticketPromedio)}
          change={k.ticketVariacion}
        />
        <KpiCard
          title="Clientes activos"
          value={k.clientesActivos.toLocaleString("es-MX")}
          change={k.clientesVariacion}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas vs. meta</CardTitle>
            <CardDescription>
              Miles de pesos por mes (ficticio)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VentasMetaChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Participación por canal</CardTitle>
            <CardDescription>Distribución porcentual aproximada</CardDescription>
          </CardHeader>
          <CardContent>
            <ParticipacionLineChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
