import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type {
  EstadoDocumentoResumenRow,
  EstadoPendienteIngresoRow,
} from "@/lib/controlprevio-estado-ordenes"
import { cn } from "@/lib/utils"

type Props = {
  tablaA: EstadoDocumentoResumenRow[]
  tablaB: EstadoPendienteIngresoRow[]
  isPending?: boolean
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value)
}

function formatInt(value: number) {
  return value.toLocaleString("es-PE")
}

export function EstadoDistribucionCard({
  tablaA,
  tablaB,
  isPending = false,
}: Props) {
  const totalA = tablaA.find((row) => row.isGrandTotalRowTotal)
  const detalleA = tablaA.filter((row) => !row.isGrandTotalRowTotal)
  const totalB = tablaB.find((row) => row.isGrandTotalRowTotal)
  const detalleB = tablaB.filter((row) => !row.isGrandTotalRowTotal)

  return (
    <Card className="rounded-2xl border border-border/70 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
          Distribución por estado
        </CardTitle>
        <CardDescription>
          Conteo de ordenes y montos por estado documental.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPending && tablaA.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <>
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Resumen general
                </h4>
                {totalA ? (
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {formatInt(totalA.distinctCountCodOrden)} ordenes
                  </span>
                ) : null}
              </div>
              <div className="overflow-hidden rounded-xl border border-border/70">
                <table className="w-full text-sm">
                  <thead className="bg-muted/35 text-(--color-brand-primary)">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase">
                        Estado
                      </th>
                      <th className="px-3 py-2 text-right text-[10px] font-bold tracking-wider uppercase">
                        Ordenes
                      </th>
                      <th className="px-3 py-2 text-right text-[10px] font-bold tracking-wider uppercase">
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {detalleA.map((row) => (
                      <tr key={`a-${row.estadoDocumento}`} className="hover:bg-muted/25">
                        <td className="px-3 py-2.5">{row.estadoDocumento}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatInt(row.distinctCountCodOrden)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-(--color-brand-primary)">
                          {formatMoney(row.sumMontoS)}
                        </td>
                      </tr>
                    ))}
                    {totalA ? (
                      <tr className="bg-muted/40 font-bold text-(--color-brand-primary)">
                        <td className="px-3 py-2.5">Total</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatInt(totalA.distinctCountCodOrden)}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatMoney(totalA.sumMontoS)}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Pendiente de ingreso (OC)
              </h4>
              <div className="overflow-hidden rounded-xl border border-border/70">
                <table className="w-full text-sm">
                  <thead className="bg-muted/35 text-(--color-brand-primary)">
                    <tr>
                      <th className="px-3 py-2 text-left text-[10px] font-bold tracking-wider uppercase">
                        Estado
                      </th>
                      <th className="px-3 py-2 text-right text-[10px] font-bold tracking-wider uppercase">
                        Ordenes
                      </th>
                      <th className="px-3 py-2 text-right text-[10px] font-bold tracking-wider uppercase">
                        Pendiente
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {detalleB.map((row) => (
                      <tr
                        key={`b-${row.estadoDocumento}`}
                        className={cn("hover:bg-muted/25", row.newOcPendienteIngreso <= 0 && "opacity-70")}
                      >
                        <td className="px-3 py-2.5">{row.estadoDocumento}</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatInt(row.distinctCountCodOrden)}
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-(--color-brand-primary)">
                          {formatMoney(row.newOcPendienteIngreso)}
                        </td>
                      </tr>
                    ))}
                    {totalB ? (
                      <tr className="bg-muted/40 font-bold text-(--color-brand-primary)">
                        <td className="px-3 py-2.5">Total</td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatInt(totalB.distinctCountCodOrden)}
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">
                          {formatMoney(totalB.newOcPendienteIngreso)}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </CardContent>
    </Card>
  )
}
