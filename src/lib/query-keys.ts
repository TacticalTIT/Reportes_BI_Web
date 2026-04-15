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

  subcontratos: (
    filters: { desProyecto?: string; tipoAlmacenServicio?: string },
    page: number,
    pageSize: number
  ) => [...reportKeys.all, "subcontratos-dashboard", filters, page, pageSize] as const,

  documentosNoRelacionadosKpis: () =>
    [...reportKeys.all, "documentos-no-relacionados-kpis"] as const,

  documentosNoRelacionadosTabla: (page: number, pageSize: number) =>
    [...reportKeys.all, "documentos-no-relacionados-tabla", page, pageSize] as const,

  documentosNoRelacionadosResumen: () =>
    [...reportKeys.all, "documentos-no-relacionados-resumen"] as const,

  ingresosNoRelacionadosKpis: () =>
    [...reportKeys.all, "ingresos-no-relacionados-kpis"] as const,

  ingresosNoRelacionadosTabla: (page: number) =>
    [...reportKeys.all, "ingresos-no-relacionados-tabla", page] as const,

  ingresosNoRelacionadosTop10: () =>
    [...reportKeys.all, "ingresos-no-relacionados-top10"] as const,

  estadoOrdenesOverview: () =>
    [...reportKeys.all, "estado-ordenes-overview"] as const,

  estadoOrdenesTabla: (page: number) =>
    [...reportKeys.all, "estado-ordenes-tabla", page] as const,

  stockAlmacenTabla: (page: number) =>
    [...reportKeys.all, "stock-almacen-tabla", page] as const,

  stockAlmacenInventarioPorCategoria: () =>
    [...reportKeys.all, "stock-almacen-inventario-por-categoria"] as const,

  stockAlmacenTopRecursos: () =>
    [...reportKeys.all, "stock-almacen-top-recursos"] as const,
}
