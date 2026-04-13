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
  ControlPrevioDocNoRelPagination,
  ControlPrevioDocNoRelTablaRow,
} from "@/lib/controlprevio-documentos-no-relacionados"
import {
  DOCUMENTOS_PAGE_SIZE_OPTIONS,
} from "../constants"
import { formatFecha, formatNumero, formatTexto } from "../formatters"
import { DocumentosPaginationNav } from "./pagination-nav"

type Props = {
  data: ControlPrevioDocNoRelTablaRow[]
  empty: boolean
  loading?: boolean
  currency?: { code: string; symbol: string }
  pagination: ControlPrevioDocNoRelPagination
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function DocumentosTableCard({
  data,
  empty,
  loading = false,
  currency,
  pagination,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalRows = pagination.totalRows || data.length

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/80 bg-white pb-4">
        <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
          Tabla general de documentos
        </CardTitle>
        <CardDescription>
          Detalle paginado de documentos no relacionados ({currency?.symbol ?? "S/"}{" "}
          {currency?.code ?? "PEN"}).
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
                  Socio de negocio
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Tipo doc.
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Nro. doc.
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Por liquidar
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Total PEN
                </th>
                <th className="px-4 py-3.5 text-center text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Total USD
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  T. cambio
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Moneda / Fecha
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Estado / Relacionado
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
                    No hay filas para mostrar.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => {
                  return (
                    <tr
                      key={`${row.nroDocumentoPago ?? "doc"}-${row.fecha ?? "fecha"}-${i}`}
                      className={cn(
                        "transition-colors hover:bg-muted/30",
                        row.isGrandTotalRowTotal && "bg-muted/30 font-bold"
                      )}
                    >
                      <td className="max-w-52 truncate px-4 py-3.5 align-middle text-muted-foreground lg:px-5">
                        {formatTexto(row.desSocioNegocio)}
                      </td>
                      <td className="px-4 py-3.5 align-middle font-semibold text-(--color-brand-primary) lg:px-5">
                        {formatTexto(row.tipoDocumento)}
                      </td>
                      <td className="px-4 py-3.5 align-middle lg:px-5">
                        <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                          {formatTexto(row.nroDocumentoPago)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right align-middle font-black text-(--color-brand-primary) tabular-nums lg:px-5">
                        {formatNumero(row.sumMontoPorLiquidar, 2)}
                      </td>
                      <td className="px-4 py-3.5 text-right align-middle text-sm font-semibold tabular-nums lg:px-5">
                        {formatNumero(row.sumMontoS, 2)}
                      </td>
                      <td className="px-4 py-3.5 text-right align-middle tabular-nums text-muted-foreground lg:px-5">
                        {formatNumero(row.sumMontoD, 2)}
                      </td>
                      <td className="px-4 py-3.5 text-center align-middle tabular-nums text-muted-foreground lg:px-5">
                        {formatNumero(row.tipoCambio, 3)}
                      </td>
                      <td className="px-4 py-3.5 align-middle text-muted-foreground lg:px-5">
                        <div>{formatTexto(row.desMoneda)}</div>
                        <div className="text-xs">{formatFecha(row.fecha)}</div>
                      </td>
                      <td className="max-w-56 px-4 py-3.5 align-middle text-muted-foreground lg:max-w-xs lg:px-5">
                        <div
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-tight",
                            (row.estadoDocumento ?? "").toLowerCase().includes("pend")
                              ? "bg-(--color-brand-secondary)/12 text-(--color-brand-secondary)"
                              : "bg-(--color-brand-tertiary)/12 text-(--color-brand-tertiary)"
                          )}
                        >
                          {formatTexto(row.estadoDocumento)}
                        </div>
                        <div className="mt-1 truncate text-xs">
                          {formatTexto(row.relacionadoCon)}
                        </div>
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
