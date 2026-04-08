import type { ReportTablaFilters } from "@/lib/report-filters"

export const reportKeys = {
  all: ["reportes"] as const,

  biop: (filters: ReportTablaFilters) =>
    [...reportKeys.all, "biop-dashboard", filters] as const,

  ropresupuestoTabla: (
    page: number,
    pageSize: number,
    filters: ReportTablaFilters
  ) =>
    [...reportKeys.all, "ropresupuesto-tabla", page, pageSize, filters] as const,
}
