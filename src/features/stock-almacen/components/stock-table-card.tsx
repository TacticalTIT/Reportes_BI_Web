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
import { cn } from "@/lib/utils"
import type {
  ControlPrevioStockAlmacenPagination,
  ControlPrevioStockAlmacenTablaRow,
} from "@/lib/controlprevio-stock-almacen"

type Props = {
  data: ControlPrevioStockAlmacenTablaRow[]
  empty: boolean
  loading?: boolean
  currency?: { code: string; symbol: string }
  pagination: ControlPrevioStockAlmacenPagination
  onPageChange: (page: number) => void
}

function formatMoney(n: number, currencyCode: string) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode.length === 3 ? currencyCode : "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function formatNumber(n: number) {
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 2,
  }).format(n)
}

function formatText(value: string | null | undefined, fallback = "—") {
  if (!value) return fallback
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : fallback
}

export function StockTableCard({
  data,
  empty,
  loading = false,
  currency,
  pagination,
  onPageChange,
}: Props) {
  const totalRows = pagination.totalRows || data.length
  const currencyCode = currency?.code ?? "PEN"
  const currencySymbol = currency?.symbol ?? "S/"

  return (
    <Card className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <CardHeader className="border-b border-border/80 bg-white pb-4">
        <CardTitle className="text-base font-bold tracking-tight text-(--color-brand-primary)">
          Detalle de stock de almacen
        </CardTitle>
        <CardDescription>
          Paginacion por recurso ({currencySymbol} {currencyCode}).
        </CardDescription>
      </CardHeader>
      <CardContent className="relative px-0">
        <div className="overflow-x-auto [scrollbar-gutter:stable]" role="region" aria-label="Tabla de stock almacen">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-1 w-8 bg-linear-to-l from-card to-transparent md:hidden"
            aria-hidden
          />
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-muted/50 text-(--color-brand-primary)">
              <tr>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Recurso
                </th>
                <th className="px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Socio negocio
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Stock
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Ingreso
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Egreso
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Precio promedio
                </th>
                <th className="px-4 py-3.5 text-right text-[10px] font-bold uppercase tracking-wider lg:px-5">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-white">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-row-${i}`}>
                    <td className="px-4 py-3.5 lg:px-5" colSpan={7}>
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              ) : empty ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">
                    No hay filas para mostrar.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={`${row.recurso ?? "recurso"}-${row.sumMontoS}-${i}`}
                    className={cn(
                      "transition-colors hover:bg-muted/30",
                      row.isGrandTotalRowTotal && "bg-muted/40 font-bold text-(--color-brand-primary)"
                    )}
                  >
                    <td className="max-w-80 truncate px-4 py-3.5 align-middle lg:px-5">
                      {formatText(row.recurso, row.isGrandTotalRowTotal ? "Total general" : "—")}
                    </td>
                    <td className="max-w-48 truncate px-4 py-3.5 align-middle text-muted-foreground lg:px-5">
                      {formatText(row.desSocioNegocio)}
                    </td>
                    <td className="px-4 py-3.5 text-right align-middle font-medium tabular-nums lg:px-5">
                      {formatNumber(row.sumStock)}
                    </td>
                    <td className="px-4 py-3.5 text-right align-middle font-medium tabular-nums lg:px-5">
                      {formatNumber(row.sumIngreso)}
                    </td>
                    <td className="px-4 py-3.5 text-right align-middle font-medium tabular-nums lg:px-5">
                      {formatNumber(row.sumEgreso)}
                    </td>
                    <td className="px-4 py-3.5 text-right align-middle font-medium tabular-nums lg:px-5">
                      {formatMoney(row.sumPrecioPromedio, currencyCode)}
                    </td>
                    <td className="px-4 py-3.5 text-right align-middle font-semibold tabular-nums text-(--color-brand-primary) lg:px-5">
                      {formatMoney(row.sumMontoS, currencyCode)}
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
            ? "Sin resultados en esta pagina"
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
