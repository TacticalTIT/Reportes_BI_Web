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
import { formatFecha, formatNumero, formatTexto } from "@/features/documentos-no-relacionados/formatters"
import { cn } from "@/lib/utils"
import type {
  ControlPrevioIngNoRelPagination,
  ControlPrevioIngNoRelTablaRow,
} from "@/lib/controlprevio-ingresos-no-relacionados"

type Props = {
  data: ControlPrevioIngNoRelTablaRow[]
  empty: boolean
  loading?: boolean
  currency?: { code: string; symbol: string }
  pagination: ControlPrevioIngNoRelPagination
  onPageChange: (page: number) => void
}

export function IngresosNoRelTableCard({
  data,
  empty,
  loading = false,
  currency,
  pagination,
  onPageChange,
}: Props) {
  const totalRows = pagination.totalRows || data.length
  const sym = currency?.symbol ?? "S/"

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/80 bg-white pb-4">
        <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
          Detalle de ingresos no relacionados
        </CardTitle>
        <CardDescription>
          Paginación de 10 en 10 ({sym} {currency?.code ?? "PEN"}).
        </CardDescription>
      </CardHeader>
      <CardContent className="relative px-0">
        <div
          className="overflow-x-auto [scrollbar-gutter:stable]"
          role="region"
          aria-label="Tabla de ingresos no relacionados"
        >
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-1 w-8 bg-linear-to-l from-card to-transparent md:hidden"
            aria-hidden
          />
          <table className="w-full min-w-[920px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-muted/50 text-(--color-brand-primary)">
              <tr>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Socio de negocio
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Fecha
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Almacén / servicio
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Movimiento
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Moneda / Pago
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Estado / orden
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Parcial
                </th>
                <th className="min-w-40 px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Observación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-white">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-row-${i}`}>
                    <td className="px-4 py-3.5 lg:px-5" colSpan={8}>
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : empty ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center text-muted-foreground"
                  >
                    No hay filas para mostrar.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={`${row.desSocioNegocio ?? "s"}-${row.fecha ?? "f"}-${row.sumParcial}-${i}`}
                    className={cn(
                      "transition-colors hover:bg-muted/30",
                      row.isGrandTotalRowTotal && "bg-muted/40 font-bold text-(--color-brand-primary)"
                    )}
                  >
                    <td className="max-w-48 truncate px-4 py-3.5 align-middle lg:max-w-56 lg:px-5">
                      {formatTexto(row.desSocioNegocio)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 align-middle text-muted-foreground lg:px-5">
                      {formatFecha(row.fecha)}
                    </td>
                    <td className="max-w-40 px-4 py-3.5 align-middle text-xs text-muted-foreground lg:px-5">
                      <div>{formatTexto(row.tipoAlmacenServicio)}</div>
                      {row.codTipoAlmacenServicio ? (
                        <div className="mt-0.5 font-mono text-[10px] opacity-80">
                          {formatTexto(row.codTipoAlmacenServicio)}
                        </div>
                      ) : null}
                    </td>
                    <td className="max-w-44 truncate px-4 py-3.5 align-middle text-xs lg:px-5">
                      {formatTexto(row.desMovimiento)}
                    </td>
                    <td className="px-4 py-3.5 align-middle text-xs text-muted-foreground lg:px-5">
                      <div>{formatTexto(row.desMoneda)}</div>
                      <div className="mt-0.5">{formatTexto(row.formaDePago)}</div>
                    </td>
                    <td className="max-w-44 px-4 py-3.5 align-middle text-xs lg:px-5">
                      <div
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                          (row.estadoDocumento ?? "").toLowerCase().includes("pend")
                            ? "bg-(--color-brand-secondary)/12 text-(--color-brand-secondary)"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {formatTexto(row.estadoDocumento)}
                      </div>
                      <div className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                        {formatTexto(row.codOrden)}
                      </div>
                      <div className="truncate text-[10px] text-muted-foreground">
                        {formatTexto(row.formaRegularizado)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right align-middle font-semibold tabular-nums text-(--color-brand-primary) lg:px-5">
                      {formatNumero(row.sumParcial, 2)}
                    </td>
                    <td className="max-w-52 px-4 py-3.5 align-middle text-xs text-muted-foreground lg:max-w-xs lg:px-5">
                      <span className="line-clamp-3">{formatTexto(row.observacion)}</span>
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
