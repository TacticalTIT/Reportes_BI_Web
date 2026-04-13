import { ReportEmptyState } from "@/components/report-states"
import { Skeleton } from "@/components/ui/skeleton"
import type {
  SubcontratosPagination,
  SubcontratosTableRow,
} from "@/lib/biop-subcontratos"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2,
  }).format(value)
}

const COL_COUNT = 15

const thClass =
  "px-3 py-3 text-[10px] font-bold tracking-[0.12em] uppercase whitespace-nowrap"
const thRight = `${thClass} text-right`
const tdNum = "px-3 py-3 text-right font-semibold tabular-nums whitespace-nowrap"

type Props = {
  rows: SubcontratosTableRow[]
  pagination: SubcontratosPagination | null
  isPending?: boolean
  onPageChange: (next: number) => void
}

export function SubcontratosTableCard({
  rows,
  pagination,
  isPending = false,
  onPageChange,
}: Props) {
  const detailRows = rows.filter((r) => !r.isGrandTotalRow)
  const grandTotalRow = rows.find((r) => r.isGrandTotalRow)

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/80 px-5 py-4">
        <h3 className="text-lg font-black tracking-tight text-(--color-brand-primary)">
          Detalle de Contratos
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-352 border-collapse text-left text-sm">
          <thead className="bg-muted/40 text-(--color-brand-primary)">
            <tr>
              <th className={`${thClass} sticky left-0 z-10 bg-muted/40 pl-5`}>
                Proveedor
              </th>
              <th className={thClass}>N° Orden</th>
              <th className={thClass}>Contrato</th>
              <th className={thRight}>Monto S</th>
              <th className={thRight}>Monto subcontrato</th>
              <th className={thRight}>Facturado</th>
              <th className={thRight}>Por facturar</th>
              <th className={thRight}>Retenido</th>
              <th className={thRight}>F. garantía</th>
              <th className={thRight}>Devuelto</th>
              <th className={thRight}>Adelanto otorgado</th>
              <th className={thRight}>Adelanto amortizado</th>
              <th className={thRight}>Adelanto por amortizar</th>
              <th className={thRight}>P. cuenta s/IGV otorg.</th>
              <th className={`${thRight} pr-5`}>P. cuenta por amortizar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {isPending ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-3 pl-5" colSpan={COL_COUNT}>
                    <Skeleton className="h-7 w-full" />
                  </td>
                </tr>
              ))
            ) : detailRows.length === 0 && !grandTotalRow ? (
              <tr>
                <td colSpan={COL_COUNT}>
                  <ReportEmptyState message="No hay filas para mostrar con el contexto de subcontratos." />
                </td>
              </tr>
            ) : (
              detailRows.map((row, i) => (
                <tr
                  key={`${row.proveedor}-${row.nroOrden}-${i}`}
                  className={
                    row.isProveedorSubtotal
                      ? "bg-muted/15 hover:bg-muted/25"
                      : "hover:bg-muted/20"
                  }
                >
                  <td
                    className={`sticky left-0 z-1 border-r border-border/40 bg-card px-3 py-3 pl-5 font-semibold text-(--color-brand-primary) ${
                      row.isProveedorSubtotal ? "italic" : ""
                    }`}
                  >
                    {row.proveedor}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                    {row.nroOrden}
                  </td>
                  <td className="max-w-48 truncate px-3 py-3 text-muted-foreground">
                    {row.contrato}
                  </td>
                  <td className={tdNum}>{formatCurrency(row.montoS)}</td>
                  <td className={tdNum}>
                    {formatCurrency(row.montoSubcontrato)}
                  </td>
                  <td className={tdNum}>{formatCurrency(row.facturado)}</td>
                  <td className={tdNum}>{formatCurrency(row.porFacturar)}</td>
                  <td className={tdNum}>{formatCurrency(row.montoRetenido)}</td>
                  <td className={tdNum}>{formatCurrency(row.fondoGarantia)}</td>
                  <td className={tdNum}>{formatCurrency(row.devuelto)}</td>
                  <td className={tdNum}>
                    {formatCurrency(row.adelantoOtorgado)}
                  </td>
                  <td className={tdNum}>
                    {formatCurrency(row.adelantoAmortizado)}
                  </td>
                  <td className={tdNum}>
                    {formatCurrency(row.adelantoPorAmortizar)}
                  </td>
                  <td className={tdNum}>
                    {formatCurrency(row.pagoCuentaSinIgvOtorgado)}
                  </td>
                  <td className={`${tdNum} pr-5`}>
                    {formatCurrency(row.pagoCuentaPorAmortizar)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {grandTotalRow && !isPending ? (
            <tfoot>
              <tr className="border-t-2 border-border bg-muted/30 font-black text-(--color-brand-primary)">
                <td className="sticky left-0 bg-muted/30 px-3 py-3 pl-5" colSpan={3}>
                  Total
                </td>
                <td className={tdNum}>{formatCurrency(grandTotalRow.montoS)}</td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.montoSubcontrato)}
                </td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.facturado)}
                </td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.porFacturar)}
                </td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.montoRetenido)}
                </td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.fondoGarantia)}
                </td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.devuelto)}
                </td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.adelantoOtorgado)}
                </td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.adelantoAmortizado)}
                </td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.adelantoPorAmortizar)}
                </td>
                <td className={tdNum}>
                  {formatCurrency(grandTotalRow.pagoCuentaSinIgvOtorgado)}
                </td>
                <td className={`${tdNum} pr-5`}>
                  {formatCurrency(grandTotalRow.pagoCuentaPorAmortizar)}
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
      {pagination ? (
        <div className="flex items-center justify-between border-t border-border/80 px-5 py-3 text-xs text-muted-foreground">
          <span>
            Pagina {pagination.page} de {pagination.totalPages} &middot;{" "}
            {pagination.totalItems.toLocaleString("es-PE")} filas
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!pagination.hasPrev}
              onClick={() => onPageChange(pagination.page - 1)}
              className="rounded-md border border-border px-2.5 py-1 font-semibold disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={!pagination.hasNext}
              onClick={() => onPageChange(pagination.page + 1)}
              className="rounded-md border border-border px-2.5 py-1 font-semibold disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
