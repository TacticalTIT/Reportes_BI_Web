import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type {
  RopresupuestoPagination,
  RopresupuestoRow,
} from "@/lib/ropresupuesto-tabla"
import { CheckCircle2, Circle } from "lucide-react"
import {
  DOCUMENTOS_PAGE_SIZE_OPTIONS,
} from "../constants"
import { formatFecha, formatNumero } from "../formatters"
import { relationshipStatus } from "../relationship-status"
import { DocumentosPaginationNav } from "./pagination-nav"

type Props = {
  data: RopresupuestoRow[]
  empty: boolean
  message?: string
  loading?: boolean
  pagination: RopresupuestoPagination
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function DocumentosTableCard({
  data,
  empty,
  loading = false,
  message,
  pagination,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalRows = pagination.totalItems || data.length

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/80 bg-white pb-4">
        <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
          Recent Transactions
        </CardTitle>
        <CardDescription>
          Detalle paginado desde el API de presupuesto; desplaza horizontalmente
          en pantallas pequeñas.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative px-0">
        <div
          className="overflow-x-auto [scrollbar-gutter:stable]"
          role="region"
          aria-label="Tabla de documentos"
        >
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-1 w-8 bg-linear-to-l from-card to-transparent md:hidden"
            aria-hidden
          />
          <table className="w-full min-w-232 border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-muted/50 text-(--color-brand-primary)">
              <tr>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Tipo doc.
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Nro. doc.
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Relacionado
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Total PEN
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Total USD
                </th>
                <th className="px-4 py-3.5 text-center text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  T. cambio
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Fecha
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Estado
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Proveedor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-white">
              {loading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <tr key={`skeleton-row-${i}`}>
                    <td className="px-4 py-3.5 lg:px-5" colSpan={9}>
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : empty ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-16 text-center text-muted-foreground"
                  >
                    {message || "No hay filas para mostrar."}
                  </td>
                </tr>
              ) : (
                data.map((row, i) => {
                  const related = relationshipStatus(row.RelacionadoCon)
                  return (
                    <tr key={`${row.NroDocumentoPago}-${row.Fecha}-${i}`} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3.5 align-middle text-muted-foreground lg:px-5">
                        {row.TipoDocumento}
                      </td>
                      <td className="px-4 py-3.5 align-middle font-semibold text-(--color-brand-primary) lg:px-5">
                        {row.NroDocumentoPago}
                      </td>
                      <td className="px-4 py-3.5 align-middle lg:px-5">
                        <span className="inline-flex items-center gap-2">
                          {related ? (
                            <CheckCircle2
                              className="size-4 shrink-0 text-(--color-brand-tertiary)"
                              aria-hidden
                            />
                          ) : (
                            <Circle
                              className="size-4 shrink-0 text-muted-foreground/50"
                              aria-hidden
                            />
                          )}
                          <span className="sr-only">
                            {related ? "Relacionado" : "No relacionado"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right align-middle font-black text-(--color-brand-primary) tabular-nums lg:px-5">
                        {formatNumero(row.SumMontoS, 2)}
                      </td>
                      <td className="px-4 py-3.5 text-right align-middle text-sm font-semibold tabular-nums lg:px-5">
                        {formatNumero(row.SumMontoD, 2)}
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle tabular-nums text-muted-foreground lg:px-5">
                        {formatNumero(row.TipoCambio, 2)}
                      </td>
                      <td className="px-4 py-3.5 align-middle tabular-nums text-muted-foreground lg:px-5">
                        {formatFecha(row.Fecha)}
                      </td>
                      <td className="px-4 py-3.5 align-middle lg:px-5">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight",
                            row.EstadoDocumento.toLowerCase().includes("pend")
                              ? "bg-(--color-brand-secondary)/12 text-(--color-brand-secondary)"
                              : "bg-(--color-brand-tertiary)/12 text-(--color-brand-tertiary)"
                          )}
                        >
                          {row.EstadoDocumento}
                        </span>
                      </td>
                      <td className="max-w-56 truncate px-4 py-3.5 align-middle text-muted-foreground lg:max-w-xs lg:px-5">
                        {row.DesSocioNegocio}
                      </td>
                    </tr>
                  )
                })
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
              )} de ${totalRows.toLocaleString("es-MX")} transacciones`}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1" role="group" aria-label="Tamaño de página">
            {DOCUMENTOS_PAGE_SIZE_OPTIONS.map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => onPageSizeChange(n)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                  pageSize === n
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground ring-1 ring-border hover:bg-muted"
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <DocumentosPaginationNav
            pagination={pagination}
            onPageChange={onPageChange}
          />
        </div>
      </CardFooter>
    </Card>
  )
}
