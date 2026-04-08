import {
  appendReportFiltersToSearchParams,
  type ReportTablaFilters,
  REPORT_FILTER_PARAM_KEYS,
} from "@/lib/report-filters"
import { fetchReportesJson } from "@/lib/reportes-api-client"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 50
export const MAX_PAGE_SIZE = 502

export type RopresupuestoTablaFilters = ReportTablaFilters

export type RopresupuestoRow = {
  TipoDocumento: string
  NroDocumentoPago: string
  TipoCambio: number
  Fecha: string
  EstadoDocumento: string
  RelacionadoCon: string
  DesMoneda: string
  DesSocioNegocio: string
  SumMontoS: number
  SumMontoD: number
  SumMontoPorLiquidar: number
}

export type RopresupuestoPagination = {
  page: number
  pageSize: number
  itemsOnPage: number
  totalItems: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
  prevPage: number | null
  nextPage: number | null
  visiblePages: number[]
}

type ApiSuccessBody = {
  success: true
  data: RopresupuestoRow[]
  message?: string
  pagination: RopresupuestoPagination
}

export type RopresupuestoTablaResult =
  | {
      kind: "ok"
      data: RopresupuestoRow[]
      pagination: RopresupuestoPagination
      message?: string
    }
  | {
      kind: "error"
      message: string
      devDetail?: string
    }

function normalizePage(raw: number): number {
  if (!Number.isFinite(raw) || raw < 1) return DEFAULT_PAGE
  return Math.floor(raw)
}

function normalizePageSize(raw: number): number {
  if (!Number.isFinite(raw) || raw < 1) return DEFAULT_PAGE_SIZE
  return Math.min(Math.floor(raw), MAX_PAGE_SIZE)
}

export function parsePaginationQuery(
  searchParams: Record<string, string | string[] | undefined>
): { page: number; pageSize: number } {
  const p = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page
  const ps = Array.isArray(searchParams.pageSize)
    ? searchParams.pageSize[0]
    : searchParams.pageSize
  const page = normalizePage(Number.parseInt(p ?? "", 10))
  const pageSize = normalizePageSize(Number.parseInt(ps ?? "", 10))
  return { page, pageSize }
}

function firstSearchParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
): string | undefined {
  const v = searchParams[key]
  const s = Array.isArray(v) ? v[0] : v
  return typeof s === "string" ? s : undefined
}

function trimFilter(raw: string | undefined): string | undefined {
  if (raw == null) return undefined
  const t = raw.trim()
  return t === "" ? undefined : t
}

export function parseRopresupuestoTablaQuery(
  searchParams: Record<string, string | string[] | undefined>
): { page: number; pageSize: number; filters: RopresupuestoTablaFilters } {
  const { page, pageSize } = parsePaginationQuery(searchParams)
  const filters: RopresupuestoTablaFilters = {}
  for (const key of REPORT_FILTER_PARAM_KEYS) {
    const v = trimFilter(firstSearchParam(searchParams, key))
    if (v !== undefined) filters[key] = v
  }
  return { page, pageSize, filters }
}

export function buildRopresupuestoTablaSearchParams(
  page: number,
  pageSize: number,
  filters: RopresupuestoTablaFilters
): URLSearchParams {
  const q = new URLSearchParams()
  q.set("page", String(normalizePage(page)))
  q.set("pageSize", String(normalizePageSize(pageSize)))
  appendReportFiltersToSearchParams(q, filters)
  return q
}

export async function fetchRopresupuestoTabla(input: {
  page?: number
  pageSize?: number
  filters?: RopresupuestoTablaFilters
}): Promise<RopresupuestoTablaResult> {
  const page = normalizePage(input.page ?? DEFAULT_PAGE)
  const pageSize = normalizePageSize(input.pageSize ?? DEFAULT_PAGE_SIZE)
  const filters = input.filters ?? {}

  const path = `/api/ropresupuesto-tabla?${buildRopresupuestoTablaSearchParams(
    page,
    pageSize,
    filters
  ).toString()}`

  let body: unknown
  try {
    body = await fetchReportesJson(path)
  } catch (e) {
    return {
      kind: "error",
      message:
        e instanceof Error
          ? e.message
          : "No se pudo conectar con el servidor de reportes.",
      devDetail:
        process.env.NODE_ENV === "development" && e instanceof Error
          ? e.stack ?? e.message
          : undefined,
    }
  }

  const ok = body as ApiSuccessBody
  const data = Array.isArray(ok.data) ? ok.data : []
  const pagination = ok.pagination

  if (
    !pagination ||
    typeof pagination.page !== "number" ||
    typeof pagination.totalPages !== "number"
  ) {
    return {
      kind: "error",
      message: "Respuesta del API sin datos de paginacion validos.",
      devDetail:
        process.env.NODE_ENV === "development"
          ? JSON.stringify(body)
          : undefined,
    }
  }

  return {
    kind: "ok",
    data,
    pagination,
    message: ok.message,
  }
}
