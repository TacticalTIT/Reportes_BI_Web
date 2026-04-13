import type {
  BiopCountByTipoRow,
  BiopDashboardData,
} from "@/lib/biop-dashboard"

export function biopTipoRowsWithoutGrandTotal(
  result: BiopDashboardData["cantPorTipoRelacionar"]
): BiopCountByTipoRow[] {
  if (result.kind === "error") return []
  return result.value.filter((r) => !r.IsGrandTotalRowTotal)
}

export function biopLiquidarRowsWithoutGrandTotal(
  result: BiopDashboardData["cantPorTipoLiquidar"]
): BiopCountByTipoRow[] {
  if (result.kind === "error") return []
  return result.value.filter((r) => !r.IsGrandTotalRowTotal)
}

export function totalCantidadFromRows(rows: { cantidad: number }[]) {
  return rows.reduce((acc, row) => acc + row.cantidad, 0)
}
