import { buildReportFiltersQueryString, type ReportTablaFilters } from "@/lib/report-filters"

/** Máximo `pageSize` para métricas BIOP tabulares (spec backend). */
export const BIOP_TABLE_MAX_PAGE_SIZE = 200

/** Rutas proxy en Next (mismo origen); el backend real va en REPORTES_API_BASE_URL (servidor). */
export const REPORTES_PROXY_BIOP_ANALYTICS_PATH = "/api/reportes/biop/analytics"
export const REPORTES_PROXY_ROPRESUPUESTO_TABLA_PATH =
  "/api/reportes/ropresupuesto-tabla"

/** Control previo — subcontratos (proxy → `api/controlprevio/subcontratos/*` en el backend). */
export const REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_TABLA_PATH =
  "/api/reportes/controlprevio/subcontratos/tabla"
export const REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_KPIS_PATH =
  "/api/reportes/controlprevio/subcontratos/kpis"
export const REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_TOP10_PATH =
  "/api/reportes/controlprevio/subcontratos/top10"

/** Control previo — documentos no relacionados (proxy → `api/controlprevio/documentonorelacionados/*`). */
export const REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_KPIS_PATH =
  "/api/reportes/controlprevio/documentonorelacionados/kpis"
export const REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_TABLA_PATH =
  "/api/reportes/controlprevio/documentonorelacionados/tabla"
export const REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_TABLA_POR_LIQUIDAR_PATH =
  "/api/reportes/controlprevio/documentonorelacionados/tablaporliquidar"
export const REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_TABLA_POR_RELACIONAR_PATH =
  "/api/reportes/controlprevio/documentonorelacionados/tablaporrelacionar"

/** Control previo — ingresos no relacionados (proxy → `api/controlprevio/ingresosnorelacionados/*`). */
export const REPORTES_PROXY_CONTROL_PREVIO_ING_NO_REL_TABLA_PATH =
  "/api/reportes/controlprevio/ingresosnorelacionados/tabla"
export const REPORTES_PROXY_CONTROL_PREVIO_ING_NO_REL_KPIS_PATH =
  "/api/reportes/controlprevio/ingresosnorelacionados/kpis"
export const REPORTES_PROXY_CONTROL_PREVIO_ING_NO_REL_TOP10_PROVEEDORES_PATH =
  "/api/reportes/controlprevio/ingresosnorelacionados/top10proveedores"

/** @deprecated Alias del proxy de tabla; evita errores de build si quedó un import antiguo en caché. */
export const REPORTES_PROXY_ROPRESUPUESTO_BIOP_SUBCONTRATO_RESUMEN_PATH =
  REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_TABLA_PATH

export type BiopAnalyticsPathOptions = {
  /** Paginación solo aplica a métricas tabulares en `/api/biop/analytics`. */
  page?: number
  pageSize?: number
}

function normalizeBiopPage(page: number | undefined): number | undefined {
  if (page == null || !Number.isFinite(page) || page < 1) return undefined
  return Math.floor(page)
}

function normalizeBiopPageSize(pageSize: number | undefined): number | undefined {
  if (pageSize == null || !Number.isFinite(pageSize) || pageSize < 1)
    return undefined
  return Math.min(Math.floor(pageSize), BIOP_TABLE_MAX_PAGE_SIZE)
}

export function buildBiopAnalyticsPath(
  metric: string,
  filters?: ReportTablaFilters,
  opts?: BiopAnalyticsPathOptions
) {
  const query = new URLSearchParams({ metric })
  const filtersQs = filters ? buildReportFiltersQueryString(filters) : ""
  if (filtersQs) {
    for (const [k, v] of new URLSearchParams(filtersQs).entries()) {
      query.set(k, v)
    }
  }
  const p = normalizeBiopPage(opts?.page)
  const ps = normalizeBiopPageSize(opts?.pageSize)
  if (p !== undefined) query.set("page", String(p))
  if (ps !== undefined) query.set("pageSize", String(ps))
  return `${REPORTES_PROXY_BIOP_ANALYTICS_PATH}?${query.toString()}`
}

/**
 * URL absoluta para `fetch` en SSR; en el navegador basta la ruta relativa al proxy.
 */
export function resolveReportesRequestUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  if (typeof window !== "undefined") return path
  const base =
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  return `${base}${path}`
}

export async function fetchReportesJson(path: string): Promise<unknown> {
  const url = resolveReportesRequestUrl(path)
  const res = await fetch(url, { cache: "no-store" })
  let body: unknown
  try {
    body = await res.json()
  } catch {
    throw new Error(
      res.ok
        ? "La respuesta del servidor no es JSON valido."
        : `Error HTTP ${res.status}: respuesta no JSON.`
    )
  }

  if (!res.ok) {
    if (typeof body === "object" && body !== null) {
      const o = body as Record<string, unknown>
      const msg =
        typeof o.message === "string"
          ? o.message
          : typeof o.Message === "string"
            ? o.Message
            : null
      if (msg) throw new Error(msg)
    }
    throw new Error(`Error HTTP ${res.status}`)
  }

  if (typeof body !== "object" || body === null) {
    throw new Error("Respuesta del API con formato inesperado.")
  }

  const envelope = body as Record<string, unknown>
  const okFlag =
    typeof envelope.success === "boolean"
      ? envelope.success
      : typeof envelope.Success === "boolean"
        ? envelope.Success
        : undefined

  if (typeof okFlag !== "boolean") {
    throw new Error("Respuesta del API con formato inesperado.")
  }

  if (!okFlag) {
    const msg =
      typeof envelope.message === "string"
        ? envelope.message
        : typeof envelope.Message === "string"
          ? envelope.Message
          : "El API devolvio un error."
    throw new Error(msg)
  }

  return body
}
