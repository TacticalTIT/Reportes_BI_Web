import {
  fetchReportesJson,
  REPORTES_PROXY_CONTROL_PREVIO_STOCK_ALMACEN_INVENTARIO_POR_CATEGORIA_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_STOCK_ALMACEN_TABLA_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_STOCK_ALMACEN_TOP_RECURSOS_PATH,
} from "@/lib/reportes-api-client"

const DEFAULT_PAGE = 1

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

function asNonNegativeInt(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.floor(value)
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value.trim(), 10)
    if (Number.isFinite(parsed) && parsed >= 0) return parsed
  }
  return fallback
}

function firstArray(...candidates: unknown[]): unknown[] {
  for (const c of candidates) {
    if (Array.isArray(c)) return c
  }
  return []
}

function pickUnknown(row: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(row, k) && row[k] !== undefined) {
      return row[k]
    }
  }
  return undefined
}

function pickString(row: Record<string, unknown>, keys: string[]): string | null {
  const v = pickUnknown(row, keys)
  return typeof v === "string" ? asStringOrNull(v) : null
}

function buildVisiblePages(page: number, totalPages: number): number[] {
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  const pages: number[] = []
  for (let p = start; p <= end; p += 1) pages.push(p)
  if (pages.length === 0) return [1]
  return pages
}

export type ControlPrevioStockAlmacenTablaRow = {
  recurso: string | null
  desSocioNegocio: string | null
  isGrandTotalRowTotal: boolean
  sumMontoS: number
  sumStock: number
  sumIngreso: number
  sumEgreso: number
  sumPrecioPromedio: number
}

export type ControlPrevioStockAlmacenPagination = {
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

export type ControlPrevioStockAlmacenTablaResult = {
  items: ControlPrevioStockAlmacenTablaRow[]
  pagination: ControlPrevioStockAlmacenPagination
}

export type ControlPrevioStockAlmacenInventarioCategoriaItem = {
  tipoAlmacenServicio: string | null
  sumMontoS: number
}

export type ControlPrevioStockAlmacenTopRecursoItem = {
  recurso: string | null
  sumMontoS: number
}

export type ControlPrevioStockAlmacenTopRecursosResult = {
  items: ControlPrevioStockAlmacenTopRecursoItem[]
  kpi: {
    sumMontoS: number
  }
  currency: {
    code: string
    symbol: string
  }
}

function parseTablaRow(raw: unknown): ControlPrevioStockAlmacenTablaRow | null {
  const row = asRecord(raw)
  if (!row) return null

  return {
    recurso: pickString(row, ["recurso", "Recurso"]),
    desSocioNegocio: pickString(row, ["desSocioNegocio", "DesSocioNegocio"]),
    isGrandTotalRowTotal:
      row.isGrandTotalRowTotal === true || row.IsGrandTotalRowTotal === true,
    sumMontoS: asFiniteNumber(pickUnknown(row, ["sumMontoS", "SumMontoS"])),
    sumStock: asFiniteNumber(pickUnknown(row, ["sumStock", "SumStock"])),
    sumIngreso: asFiniteNumber(pickUnknown(row, ["sumIngreso", "SumIngreso"])),
    sumEgreso: asFiniteNumber(pickUnknown(row, ["sumEgreso", "SumEgreso"])),
    sumPrecioPromedio: asFiniteNumber(
      pickUnknown(row, ["sumPrecioPromedio", "SumPrecioPromedio"])
    ),
  }
}

export async function fetchControlPrevioStockAlmacenTabla(input?: {
  page?: number
}): Promise<ControlPrevioStockAlmacenTablaResult> {
  const page = asPositiveInt(input?.page, DEFAULT_PAGE)
  const query = new URLSearchParams({ page: String(page) }).toString()

  const body = asRecord(
    await fetchReportesJson(`${REPORTES_PROXY_CONTROL_PREVIO_STOCK_ALMACEN_TABLA_PATH}?${query}`)
  )
  if (!body) throw new Error("Respuesta de tabla con formato inesperado.")

  const rawItems = firstArray(body.items, body.Items)
  const items = rawItems
    .map(parseTablaRow)
    .filter((row): row is ControlPrevioStockAlmacenTablaRow => row !== null)

  const rawPage = asPositiveInt(pickUnknown(body, ["page", "Page"]), page)
  const rawPageSize = asPositiveInt(pickUnknown(body, ["pageSize", "PageSize"]), 10)
  const totalRows = asNonNegativeInt(pickUnknown(body, ["totalRows", "TotalRows"]), items.length)
  const totalPages = Math.max(
    1,
    asPositiveInt(
      pickUnknown(body, ["totalPages", "TotalPages"]),
      Math.ceil(Math.max(totalRows, 1) / Math.max(rawPageSize, 1))
    )
  )
  const safePage = Math.min(rawPage, totalPages)

  return {
    items,
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

function parseInventarioCategoriaRow(
  raw: unknown
): ControlPrevioStockAlmacenInventarioCategoriaItem | null {
  const row = asRecord(raw)
  if (!row) return null
  return {
    tipoAlmacenServicio: pickString(row, ["tipoAlmacenServicio", "TipoAlmacenServicio"]),
    sumMontoS: asFiniteNumber(pickUnknown(row, ["sumMontoS", "SumMontoS"])),
  }
}

export async function fetchControlPrevioStockAlmacenInventarioPorCategoria(): Promise<
  ControlPrevioStockAlmacenInventarioCategoriaItem[]
> {
  const body = asRecord(
    await fetchReportesJson(REPORTES_PROXY_CONTROL_PREVIO_STOCK_ALMACEN_INVENTARIO_POR_CATEGORIA_PATH)
  )
  if (!body) throw new Error("Respuesta de inventario por categoria con formato inesperado.")

  return firstArray(body.items, body.Items)
    .map(parseInventarioCategoriaRow)
    .filter((row): row is ControlPrevioStockAlmacenInventarioCategoriaItem => row !== null)
}

function parseTopRecursoRow(raw: unknown): ControlPrevioStockAlmacenTopRecursoItem | null {
  const row = asRecord(raw)
  if (!row) return null
  return {
    recurso: pickString(row, ["recurso", "Recurso"]),
    sumMontoS: asFiniteNumber(pickUnknown(row, ["sumMontoS", "SumMontoS"])),
  }
}

export async function fetchControlPrevioStockAlmacenTopRecursos(): Promise<ControlPrevioStockAlmacenTopRecursosResult> {
  const body = asRecord(await fetchReportesJson(REPORTES_PROXY_CONTROL_PREVIO_STOCK_ALMACEN_TOP_RECURSOS_PATH))
  if (!body) throw new Error("Respuesta de top recursos con formato inesperado.")

  const rawItems = firstArray(body.items, body.Items)
  const items = rawItems
    .map(parseTopRecursoRow)
    .filter((row): row is ControlPrevioStockAlmacenTopRecursoItem => row !== null)

  const kpiRaw = asRecord(body.kpi ?? body.Kpi)
  const currencyRaw = asRecord(body.currency ?? body.Currency)

  return {
    items,
    kpi: {
      sumMontoS: asFiniteNumber(
        kpiRaw ? pickUnknown(kpiRaw, ["sumMontoS", "SumMontoS"]) : undefined
      ),
    },
    currency: {
      code: (currencyRaw ? pickString(currencyRaw, ["code", "Code"]) : null) ?? "PEN",
      symbol: (currencyRaw ? pickString(currencyRaw, ["symbol", "Symbol"]) : null) ?? "S/",
    },
  }
}
