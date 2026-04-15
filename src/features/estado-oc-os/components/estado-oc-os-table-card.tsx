import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DocumentosPaginationNav } from "@/features/documentos-no-relacionados/components/pagination-nav"
import type {
  EstadoOrdenesPagination,
  EstadoOrdenesTablaRow,
} from "@/lib/controlprevio-estado-ordenes"
import { cn } from "@/lib/utils"

type Props = {
  data: EstadoOrdenesTablaRow[]
  loading?: boolean
  empty: boolean
  pagination: EstadoOrdenesPagination
  onPageChange: (page: number) => void
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatText(value: string | null) {
  if (!value) return "—"
  return value
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value)
}

export function EstadoOcOsTableCard({
  data,
  loading = false,
  empty,
  pagination,
  onPageChange,
}: Props) {
  const totalRows = pagination.totalRows || data.length

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/80 bg-white pb-4">
        <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
          Detalle OC/OS
        </CardTitle>
        <CardDescription>Detalle paginado por orden (10 filas por página).</CardDescription>
      </CardHeader>
      <CardContent className="relative px-0">
        <div className="overflow-x-auto [scrollbar-gutter:stable]" role="region" aria-label="Tabla estado OC/OS">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-1 w-8 bg-linear-to-l from-card to-transparent md:hidden"
            aria-hidden
          />
          <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-muted/50 text-(--color-brand-primary)">
              <tr>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Socio de negocio
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  N° orden
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Estado documento
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Fecha
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Tipo
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Estado facturado
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Monto S/.
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Facturado
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Monto total orden
                </th>
                <th className="min-w-52 px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Observación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-white">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-row-${i}`}>
                    <td className="px-4 py-3.5 lg:px-5" colSpan={10}>
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : empty ? (
                <tr>
                  <td colSpan={10} className="px-5 py-16 text-center text-muted-foreground">
                    No hay filas para mostrar.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={`${row.codOrden ?? "o"}-${row.fecha ?? "f"}-${row.sumMontoS}-${i}`}
                    className={cn(
                      "transition-colors hover:bg-muted/30",
                      row.isGrandTotalRowTotal && "bg-muted/40 font-bold text-(--color-brand-primary)"
                    )}
                  >
                    <td className="max-w-52 truncate px-4 py-3.5 align-middle lg:max-w-60 lg:px-5">
                      {formatText(row.desSocioNegocio)}
                    </td>
                    <td className="px-4 py-3.5 align-middle font-mono text-xs lg:px-5">
                      {formatText(row.codOrden)}
                    </td>
                    <td className="max-w-40 px-4 py-3.5 align-middle text-xs lg:px-5">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                          (row.estadoDocumento ?? "").toLowerCase().includes("aprob")
                            ? "bg-(--color-brand-primary)/12 text-(--color-brand-primary)"
                            : (row.estadoDocumento ?? "").toLowerCase().includes("anul")
                              ? "bg-rose-100 text-rose-700"
                              : "bg-muted text-muted-foreground"
                        )}
                      >
                        {formatText(row.estadoDocumento)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 align-middle text-muted-foreground lg:px-5">
                      {formatDate(row.fecha)}
                    </td>
                    <td className="px-4 py-3.5 align-middle text-xs text-muted-foreground lg:px-5">
                      {formatText(row.tipoAlmacenServicio)}
                    </td>
                    <td className="max-w-44 truncate px-4 py-3.5 align-middle text-xs lg:px-5">
                      {formatText(row.estadoFacturado)}
                    </td>
                    <td className="px-4 py-3.5 text-right align-middle font-semibold tabular-nums text-(--color-brand-primary) lg:px-5">
                      {formatMoney(row.sumMontoS)}
                    </td>
                    <td className="px-4 py-3.5 text-right align-middle font-semibold tabular-nums text-(--color-brand-primary) lg:px-5">
                      {formatMoney(row.sumFacturado)}
                    </td>
                    <td className="px-4 py-3.5 text-right align-middle font-semibold tabular-nums text-(--color-brand-primary) lg:px-5">
                      {formatMoney(row.sumMontoTotalOrden)}
                    </td>
                    <td className="max-w-xs px-4 py-3.5 align-middle text-xs text-muted-foreground lg:px-5">
                      <span className="line-clamp-3">{formatText(row.observacion)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-border bg-muted/20 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {empty
            ? "Sin resultados en esta página"
            : `Mostrando ${(pagination.page - 1) * pagination.pageSize + 1} a ${Math.min(
                pagination.page * pagination.pageSize,
                totalRows
              )} de ${totalRows.toLocaleString("es-PE")} filas`}
        </p>
        <DocumentosPaginationNav pagination={pagination} onPageChange={onPageChange} />
      </CardFooter>
    </Card>
  )
}
