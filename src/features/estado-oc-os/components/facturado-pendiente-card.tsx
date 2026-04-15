import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { EstadoFacturadoMontoPendienteRow } from "@/lib/controlprevio-estado-ordenes"

type Props = {
  rows: EstadoFacturadoMontoPendienteRow[]
  isPending?: boolean
}

type MonthGroup = {
  key: string
  label: string
  parcial: number
  sinFacturacion: number
  totalFacturado: number
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value)
}

function normalizeEstado(value: string): "parcial" | "sin" | "total" {
  const text = value.toLowerCase()
  if (text.includes("sin")) return "sin"
  if (text.includes("total")) return "total"
  return "parcial"
}

function groupRows(rows: EstadoFacturadoMontoPendienteRow[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>()
  for (const row of rows) {
    const key = `${row.anio}-${String(row.nroMes).padStart(2, "0")}`
    const label = `${row.mes} ${row.anio}`
    const prev = map.get(key) ?? {
      key,
      label,
      parcial: 0,
      sinFacturacion: 0,
      totalFacturado: 0,
    }
    const estado = normalizeEstado(row.estadoFacturado)
    if (estado === "parcial") prev.parcial += row.sumMontoS
    if (estado === "sin") prev.sinFacturacion += row.sumMontoS
    if (estado === "total") prev.totalFacturado += row.sumMontoS
    map.set(key, prev)
  }
  return Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key))
}

export function FacturadoPendienteCard({ rows, isPending = false }: Props) {
  const months = groupRows(rows)
  const maxTotal = Math.max(
    1,
    ...months.map((month) => month.parcial + month.sinFacturacion + month.totalFacturado)
  )

  return (
    <Card className="rounded-2xl border border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
          Facturado por monto pendiente
        </CardTitle>
        <CardDescription>
          Evolución mensual por estado de facturación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && rows.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : months.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/80 px-4 py-6 text-center text-sm text-muted-foreground">
            No hay datos de facturación para mostrar.
          </p>
        ) : (
          <div className="space-y-3">
            {months.map((month) => {
              const total = month.parcial + month.sinFacturacion + month.totalFacturado
              const parcialPct = (month.parcial / maxTotal) * 100
              const sinPct = (month.sinFacturacion / maxTotal) * 100
              const totalPct = (month.totalFacturado / maxTotal) * 100
              return (
                <article key={month.key} className="rounded-xl border border-border/70 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-(--color-brand-primary)">{month.label}</p>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Total: {formatMoney(total)}
                    </p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="flex h-full w-full">
                      <div
                        className="h-full bg-(--color-brand-primary)"
                        style={{ width: `${parcialPct}%` }}
                        title="Parcialmente Facturado"
                      />
                      <div
                        className="h-full bg-(--color-brand-secondary)"
                        style={{ width: `${sinPct}%` }}
                        title="Sin Facturación"
                      />
                      <div
                        className="h-full bg-(--color-brand-tertiary)"
                        style={{ width: `${totalPct}%` }}
                        title="Totalmente Facturado"
                      />
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-3">
                    <span className="text-(--color-brand-primary)">
                      Parcial: <strong>{formatMoney(month.parcial)}</strong>
                    </span>
                    <span className="text-(--color-brand-secondary)">
                      Sin: <strong>{formatMoney(month.sinFacturacion)}</strong>
                    </span>
                    <span className="text-(--color-brand-tertiary)">
                      Total: <strong>{formatMoney(month.totalFacturado)}</strong>
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
