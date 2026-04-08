import {
  type ReportTablaFilters,
} from "@/lib/report-filters"
import {
  buildBiopAnalyticsPath,
  fetchReportesJson,
} from "@/lib/reportes-api-client"

type ApiOk<T> = {
  success: true
  metric: string
  sqlEquivalent?: string
  value?: T
  data?: T
}

type BiopResult<T> =
  | { kind: "ok"; value: T }
  | { kind: "error"; message: string; devDetail?: string }

export type BiopCountByTipoRow = {
  TipoDocumento: string | null
  cantidad: number
  IsGrandTotalRowTotal: boolean
}

export type BiopDashboardData = {
  fechaMasAntigua: BiopResult<string>
  saldoLiquidarAnticipo: BiopResult<number>
  saldoLiquidarEntrega: BiopResult<number>
  cantPendienteRelacionar: BiopResult<number>
  cantPendienteLiquidar: BiopResult<number>
  cantPorTipoLiquidar: BiopResult<BiopCountByTipoRow[]>
  cantPorTipoRelacionar: BiopResult<BiopCountByTipoRow[]>
}

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

function asNumberResult(body: unknown): BiopResult<number> {
  if (typeof body !== "object" || body === null) {
    return { kind: "error", message: "Formato de respuesta inesperado." }
  }
  const value = (body as ApiOk<unknown>).value
  if (typeof value !== "number") {
    return { kind: "error", message: "El endpoint no devolvió un número válido." }
  }
  return { kind: "ok", value }
}

function asDateResult(body: unknown): BiopResult<string> {
  if (typeof body !== "object" || body === null) {
    return { kind: "error", message: "Formato de respuesta inesperado." }
  }
  const value = (body as ApiOk<unknown>).value
  if (typeof value !== "string") {
    return { kind: "error", message: "El endpoint no devolvió una fecha válida." }
  }
  return { kind: "ok", value }
}

function asTableResult(body: unknown): BiopResult<BiopCountByTipoRow[]> {
  if (typeof body !== "object" || body === null) {
    return { kind: "error", message: "Formato de respuesta inesperado." }
  }
  const data = (body as ApiOk<unknown>).data
  if (!Array.isArray(data)) {
    return { kind: "error", message: "El endpoint no devolvió una tabla válida." }
  }
  return { kind: "ok", value: data as BiopCountByTipoRow[] }
}

export async function fetchBiopDashboardData(
  filters?: ReportTablaFilters
): Promise<BiopDashboardData> {
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
    fetchReportesJson(buildBiopAnalyticsPath("saldo_liquidar_anticipo", filters))
      .then(asNumberResult)
      .catch(toErrorResult),
    fetchReportesJson(buildBiopAnalyticsPath("saldo_liquidar_entrega", filters))
      .then(asNumberResult)
      .catch(toErrorResult),
    fetchReportesJson(
      buildBiopAnalyticsPath("cant_pendiente_relacionar", filters)
    )
      .then(asNumberResult)
      .catch(toErrorResult),
    fetchReportesJson(buildBiopAnalyticsPath("cant_pendiente_liquidar", filters))
      .then(asNumberResult)
      .catch(toErrorResult),
    fetchReportesJson(buildBiopAnalyticsPath("cant_por_tipo_liquidar", filters))
      .then(asTableResult)
      .catch(toErrorResult),
    fetchReportesJson(
      buildBiopAnalyticsPath("cant_por_tipo_relacionar", filters)
    )
      .then(asTableResult)
      .catch(toErrorResult),
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
