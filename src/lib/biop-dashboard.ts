import type { ReportTablaFilters } from "@/lib/report-filters"
import {
  BIOP_TABLE_MAX_PAGE_SIZE,
  buildBiopAnalyticsPath,
  fetchReportesJson,
} from "@/lib/reportes-api-client"

type ApiOkScalar = {
  success: true
  metric: string
  sqlEquivalent?: string
  value?: unknown
}

type ApiOkTable = {
  success: true
  metric: string
  sqlEquivalent?: string
  data?: unknown
  pagination?: unknown
}

type BiopResult<T> =
  | { kind: "ok"; value: T }
  | { kind: "error"; message: string; devDetail?: string }

export type BiopAnalyticsPagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
}

export type BiopCountByTipoRow = {
  TipoDocumento: string | null
  cantidad: number
  IsGrandTotalRowTotal: boolean
}

export type BiopTableResult =
  | {
      kind: "ok"
      value: BiopCountByTipoRow[]
      pagination?: BiopAnalyticsPagination
    }
  | { kind: "error"; message: string; devDetail?: string }

export type BiopDashboardData = {
  fechaMasAntigua: BiopResult<string>
  saldoLiquidarAnticipo: BiopResult<number>
  saldoLiquidarEntrega: BiopResult<number>
  cantPendienteRelacionar: BiopResult<number>
  cantPendienteLiquidar: BiopResult<number>
  cantPorTipoLiquidar: BiopTableResult
  cantPorTipoRelacionar: BiopTableResult
}

export type FetchBiopDashboardOptions = {
  /** Paginación para métricas `cant_por_tipo_*` (máx. pageSize 200 en backend). */
  tipoTablePage?: number
  tipoTablePageSize?: number
}

const DEFAULT_TIPO_TABLE = {
  page: 1,
  pageSize: BIOP_TABLE_MAX_PAGE_SIZE,
} as const

function toErrorResult(e: unknown): BiopResult<never> {
  const isDev = process.env.NODE_ENV === "development"
  if (e instanceof Error) {
    return {
      kind: "error",
      message: e.message || "No se pudo cargar la información.",
      devDetail: isDev ? e.stack || e.message : undefined,
    }
  }
  return {
    kind: "error",
    message: "No se pudo cargar la información.",
    devDetail: isDev ? String(e) : undefined,
  }
}

function toTableErrorResult(e: unknown): BiopTableResult {
  const isDev = process.env.NODE_ENV === "development"
  if (e instanceof Error) {
    return {
      kind: "error",
      message: e.message || "No se pudo cargar la información.",
      devDetail: isDev ? e.stack || e.message : undefined,
    }
  }
  return {
    kind: "error",
    message: "No se pudo cargar la información.",
    devDetail: isDev ? String(e) : undefined,
  }
}

function asNumberResult(body: unknown): BiopResult<number> {
  if (typeof body !== "object" || body === null) {
    return { kind: "error", message: "Formato de respuesta inesperado." }
  }
  const value = (body as ApiOkScalar).value
  if (typeof value !== "number") {
    return { kind: "error", message: "El endpoint no devolvió un número válido." }
  }
  return { kind: "ok", value }
}

function asDateResult(body: unknown): BiopResult<string> {
  if (typeof body !== "object" || body === null) {
    return { kind: "error", message: "Formato de respuesta inesperado." }
  }
  const value = (body as ApiOkScalar).value
  if (typeof value !== "string") {
    return { kind: "error", message: "El endpoint no devolvió una fecha válida." }
  }
  return { kind: "ok", value }
}

function parseBiopTablePagination(raw: unknown): BiopAnalyticsPagination | undefined {
  if (typeof raw !== "object" || raw === null) return undefined
  const p = raw as Record<string, unknown>
  if (
    typeof p.page !== "number" ||
    typeof p.pageSize !== "number" ||
    typeof p.totalItems !== "number" ||
    typeof p.totalPages !== "number" ||
    typeof p.hasPrev !== "boolean" ||
    typeof p.hasNext !== "boolean"
  ) {
    return undefined
  }
  return {
    page: p.page,
    pageSize: p.pageSize,
    totalItems: p.totalItems,
    totalPages: p.totalPages,
    hasPrev: p.hasPrev,
    hasNext: p.hasNext,
  }
}

function asTableResult(body: unknown): BiopTableResult {
  if (typeof body !== "object" || body === null) {
    return { kind: "error", message: "Formato de respuesta inesperado." }
  }
  const data = (body as ApiOkTable).data
  if (!Array.isArray(data)) {
    return { kind: "error", message: "El endpoint no devolvió una tabla válida." }
  }
  const pagination = parseBiopTablePagination(
    (body as ApiOkTable).pagination
  )
  return {
    kind: "ok",
    value: data as BiopCountByTipoRow[],
    pagination,
  }
}

function tipoTableOpts(options?: FetchBiopDashboardOptions) {
  const page =
    options?.tipoTablePage != null &&
    Number.isFinite(options.tipoTablePage) &&
    options.tipoTablePage >= 1
      ? Math.floor(options.tipoTablePage)
      : DEFAULT_TIPO_TABLE.page
  const rawPs = options?.tipoTablePageSize
  const pageSize =
    rawPs != null && Number.isFinite(rawPs) && rawPs >= 1
      ? Math.min(Math.floor(rawPs), BIOP_TABLE_MAX_PAGE_SIZE)
      : DEFAULT_TIPO_TABLE.pageSize
  return { page, pageSize }
}

export async function fetchBiopDashboardData(
  filters?: ReportTablaFilters,
  options?: FetchBiopDashboardOptions
): Promise<BiopDashboardData> {
  const tipoOpts = tipoTableOpts(options)

  const [
    fechaMasAntigua,
    saldoLiquidarAnticipo,
    saldoLiquidarEntrega,
    cantPendienteRelacionar,
    cantPendienteLiquidar,
    cantPorTipoLiquidar,
    cantPorTipoRelacionar,
  ] = await Promise.all([
    fetchReportesJson(buildBiopAnalyticsPath("fecha_mas_antigua", filters))
      .then(asDateResult)
      .catch(toErrorResult),
    fetchReportesJson(
      buildBiopAnalyticsPath("saldo_liquidar_anticipo", filters)
    )
      .then(asNumberResult)
      .catch(toErrorResult),
    fetchReportesJson(
      buildBiopAnalyticsPath("saldo_liquidar_entrega", filters)
    )
      .then(asNumberResult)
      .catch(toErrorResult),
    fetchReportesJson(
      buildBiopAnalyticsPath("cant_pendiente_relacionar", filters)
    )
      .then(asNumberResult)
      .catch(toErrorResult),
    fetchReportesJson(
      buildBiopAnalyticsPath("cant_pendiente_liquidar", filters)
    )
      .then(asNumberResult)
      .catch(toErrorResult),
    fetchReportesJson(
      buildBiopAnalyticsPath("cant_por_tipo_liquidar", filters, {
        page: tipoOpts.page,
        pageSize: tipoOpts.pageSize,
      })
    )
      .then(asTableResult)
      .catch(toTableErrorResult),
    fetchReportesJson(
      buildBiopAnalyticsPath("cant_por_tipo_relacionar", filters, {
        page: tipoOpts.page,
        pageSize: tipoOpts.pageSize,
      })
    )
      .then(asTableResult)
      .catch(toTableErrorResult),
  ])

  return {
    fechaMasAntigua,
    saldoLiquidarAnticipo,
    saldoLiquidarEntrega,
    cantPendienteRelacionar,
    cantPendienteLiquidar,
    cantPorTipoLiquidar,
    cantPorTipoRelacionar,
  }
}
