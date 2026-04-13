import {
  fetchReportesJson,
  REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_KPIS_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_TABLA_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_TABLA_POR_LIQUIDAR_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_TABLA_POR_RELACIONAR_PATH,
} from "@/lib/reportes-api-client"

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function asFiniteNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value.replace(/,/g, ""))
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function asPositiveInt(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value)
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value.trim(), 10)
    if (Number.isFinite(parsed) && parsed > 0) return parsed
  }
  return fallback
}

function buildVisiblePages(page: number, totalPages: number): number[] {
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  const pages: number[] = []
  for (let p = start; p <= end; p += 1) pages.push(p)
  if (pages.length === 0) return [1]
  return pages
}

export type ControlPrevioDocNoRelKpis = {
  newDocCantPendienteRelacionar: number
  newDocCantPendienteLiquidar: number
}

export type ControlPrevioDocNoRelTablaRow = {
  desSocioNegocio: string | null
  tipoDocumento: string | null
  nroDocumentoPago: string | null
  tipoCambio: number
  desMoneda: string | null
  fecha: string | null
  estadoDocumento: string | null
  relacionadoCon: string | null
  isGrandTotalRowTotal: boolean
  sumMontoPorLiquidar: number
  sumMontoS: number
  sumMontoD: number
}

export type ControlPrevioDocNoRelPagination = {
  page: number
  pageSize: number
  totalRows: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
  prevPage: number | null
  nextPage: number | null
  visiblePages: number[]
}

export type ControlPrevioDocNoRelTablaResult = {
  items: ControlPrevioDocNoRelTablaRow[]
  pagination: ControlPrevioDocNoRelPagination
  currency: { code: string; symbol: string }
}

export type ControlPrevioDocNoRelCountRow = {
  tipoDocumento: string | null
  isGrandTotalRowTotal: boolean
  cantidad: number
}

export type ControlPrevioDocNoRelResumenResult = {
  porLiquidar: ControlPrevioDocNoRelCountRow[]
  porRelacionar: ControlPrevioDocNoRelCountRow[]
}

function parseTablaRow(raw: unknown): ControlPrevioDocNoRelTablaRow | null {
  const row = asRecord(raw)
  if (!row) return null
  return {
    desSocioNegocio: asStringOrNull(row.desSocioNegocio),
    tipoDocumento: asStringOrNull(row.tipoDocumento),
    nroDocumentoPago: asStringOrNull(row.nroDocumentoPago),
    tipoCambio: asFiniteNumber(row.tipoCambio),
    desMoneda: asStringOrNull(row.desMoneda),
    fecha: asStringOrNull(row.fecha),
    estadoDocumento: asStringOrNull(row.estadoDocumento),
    relacionadoCon: asStringOrNull(row.relacionadoCon),
    isGrandTotalRowTotal: row.isGrandTotalRowTotal === true,
    sumMontoPorLiquidar: asFiniteNumber(row.sumMontoPorLiquidar),
    sumMontoS: asFiniteNumber(row.sumMontoS),
    sumMontoD: asFiniteNumber(row.sumMontoD),
  }
}

function parseCountRow(
  raw: unknown,
  countKey: "newDocCantPendienteLiquidar" | "newDocCantPendienteRelacionar"
): ControlPrevioDocNoRelCountRow | null {
  const row = asRecord(raw)
  if (!row) return null
  return {
    tipoDocumento: asStringOrNull(row.tipoDocumento),
    isGrandTotalRowTotal: row.isGrandTotalRowTotal === true,
    cantidad: asPositiveInt(row[countKey], 0),
  }
}

export async function fetchControlPrevioDocNoRelKpis(): Promise<ControlPrevioDocNoRelKpis> {
  const body = asRecord(
    await fetchReportesJson(REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_KPIS_PATH)
  )
  const kpis = asRecord(body?.kpis)
  if (!kpis) throw new Error("Respuesta de KPIs con formato inesperado.")
  return {
    newDocCantPendienteRelacionar: asPositiveInt(
      kpis.newDocCantPendienteRelacionar,
      0
    ),
    newDocCantPendienteLiquidar: asPositiveInt(
      kpis.newDocCantPendienteLiquidar,
      0
    ),
  }
}

export async function fetchControlPrevioDocNoRelTabla(input?: {
  page?: number
  pageSize?: number
}): Promise<ControlPrevioDocNoRelTablaResult> {
  const page = asPositiveInt(input?.page, DEFAULT_PAGE)
  const pageSize = asPositiveInt(input?.pageSize, DEFAULT_PAGE_SIZE)
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  }).toString()

  const body = asRecord(
    await fetchReportesJson(
      `${REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_TABLA_PATH}?${query}`
    )
  )
  const rawItems = Array.isArray(body?.items) ? body.items : []
  const items = rawItems
    .map(parseTablaRow)
    .filter((r): r is ControlPrevioDocNoRelTablaRow => r !== null)

  const rawPage = asPositiveInt(body?.page, page)
  const rawPageSize = asPositiveInt(body?.pageSize, pageSize)
  const totalRows = asPositiveInt(body?.totalRows, items.length)
  const totalPages = Math.max(
    1,
    asPositiveInt(body?.totalPages, Math.ceil(totalRows / rawPageSize))
  )
  const safePage = Math.min(rawPage, totalPages)

  const currencyRaw = asRecord(body?.currency)
  const currency = {
    code: asStringOrNull(currencyRaw?.code) ?? "PEN",
    symbol: asStringOrNull(currencyRaw?.symbol) ?? "S/",
  }

  return {
    items,
    currency,
    pagination: {
      page: safePage,
      pageSize: rawPageSize,
      totalRows,
      totalPages,
      hasPrev: safePage > 1,
      hasNext: safePage < totalPages,
      prevPage: safePage > 1 ? safePage - 1 : null,
      nextPage: safePage < totalPages ? safePage + 1 : null,
      visiblePages: buildVisiblePages(safePage, totalPages),
    },
  }
}

async function fetchCountTable(
  path: string,
  countKey: "newDocCantPendienteLiquidar" | "newDocCantPendienteRelacionar"
): Promise<ControlPrevioDocNoRelCountRow[]> {
  const body = asRecord(await fetchReportesJson(path))
  const rows = Array.isArray(body?.items) ? body.items : []
  return rows
    .map((row) => parseCountRow(row, countKey))
    .filter((r): r is ControlPrevioDocNoRelCountRow => r !== null)
}

export async function fetchControlPrevioDocNoRelResumen(): Promise<ControlPrevioDocNoRelResumenResult> {
  const [porLiquidar, porRelacionar] = await Promise.all([
    fetchCountTable(
      REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_TABLA_POR_LIQUIDAR_PATH,
      "newDocCantPendienteLiquidar"
    ),
    fetchCountTable(
      REPORTES_PROXY_CONTROL_PREVIO_DOC_NO_REL_TABLA_POR_RELACIONAR_PATH,
      "newDocCantPendienteRelacionar"
    ),
  ])

  return { porLiquidar, porRelacionar }
}
