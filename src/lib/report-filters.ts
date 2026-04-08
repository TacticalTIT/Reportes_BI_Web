/** Query keys compartidos entre ropresupuesto-tabla y endpoints BIOP (cuando el API los soporte). */
export const REPORT_FILTER_PARAM_KEYS = [
  "proyecto",
  "proveedor",
  "tipoDocumento",
  "moneda",
  "estado",
] as const

export type ReportFilterParamKey = (typeof REPORT_FILTER_PARAM_KEYS)[number]

export type ReportTablaFilters = Partial<Record<ReportFilterParamKey, string>>

export function appendReportFiltersToSearchParams(
  params: URLSearchParams,
  filters: ReportTablaFilters
): void {
  for (const key of REPORT_FILTER_PARAM_KEYS) {
    const v = filters[key]
    if (v !== undefined && v.trim() !== "") {
      params.set(key, v.trim())
    }
  }
}

export function buildReportFiltersQueryString(
  filters: ReportTablaFilters
): string {
  const q = new URLSearchParams()
  appendReportFiltersToSearchParams(q, filters)
  return q.toString()
}
