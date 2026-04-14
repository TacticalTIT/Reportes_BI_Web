import {
  fetchReportesJson,
  REPORTES_PROXY_CONTROL_PREVIO_ING_NO_REL_KPIS_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_ING_NO_REL_TABLA_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_ING_NO_REL_TOP10_PROVEEDORES_PATH,
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

function buildVisiblePages(page: number, totalPages: number): number[] {
  const start = Math.max(1, page - 2)
  const end = Math.min(totalPages, page + 2)
  const pages: number[] = []
  for (let p = start; p <= end; p += 1) pages.push(p)
  if (pages.length === 0) return [1]
  return pages
}

/** Listas del API en camelCase o PascalCase (.NET). */
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

export type ControlPrevioIngNoRelKpis = {
  newIngTotalServicios: number
  newIngTotalMateriales: number
  sumParcial: number
  minFecha: string | null
  newIngPendientesServicios: number
  newIngPendientesMateriales: number
}

export type ControlPrevioIngNoRelTablaRow = {
  desSocioNegocio: string | null
  fecha: string | null
  formaRegularizado: string | null
  estadoDocumento: string | null
  codOrden: string | null
  codTipoAlmacenServicio: string | null
  tipoAlmacenServicio: string | null
  desMovimiento: string | null
  desMoneda: string | null
  formaDePago: string | null
  observacion: string | null
  isGrandTotalRowTotal: boolean
  sumParcial: number
}

export type ControlPrevioIngNoRelPagination = {
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

export type ControlPrevioIngNoRelTablaResult = {
  items: ControlPrevioIngNoRelTablaRow[]
  pagination: ControlPrevioIngNoRelPagination
  currency: { code: string; symbol: string }
}

export type ControlPrevioIngNoRelTop10Item = {
  desSocioNegocio: string | null
  sumMontoS: number
}

export type ControlPrevioIngNoRelTop10Result = {
  items: ControlPrevioIngNoRelTop10Item[]
  currency: { code: string; symbol: string }
}

function parseTablaRow(raw: unknown): ControlPrevioIngNoRelTablaRow | null {
  const row = asRecord(raw)
  if (!row) return null
  const codOrdenRaw = pickUnknown(row, ["codOrden", "CodOrden"])
  const codTipoRaw = pickUnknown(row, ["codTipoAlmacenServicio", "CodTipoAlmacenServicio"])
  return {
    desSocioNegocio: pickString(row, ["desSocioNegocio", "DesSocioNegocio"]),
    fecha: pickString(row, ["fecha", "Fecha"]),
    formaRegularizado: pickString(row, ["formaRegularizado", "FormaRegularizado"]),
    estadoDocumento: pickString(row, ["estadoDocumento", "EstadoDocumento"]),
    codOrden:
      codOrdenRaw === null || codOrdenRaw === undefined || codOrdenRaw === ""
        ? null
        : String(codOrdenRaw).trim() || null,
    codTipoAlmacenServicio:
      codTipoRaw === null || codTipoRaw === undefined || codTipoRaw === ""
        ? null
        : String(codTipoRaw).trim() || null,
    tipoAlmacenServicio: pickString(row, ["tipoAlmacenServicio", "TipoAlmacenServicio"]),
    desMovimiento: pickString(row, ["desMovimiento", "DesMovimiento"]),
    desMoneda: pickString(row, ["desMoneda", "DesMoneda"]),
    formaDePago: pickString(row, ["formaDePago", "FormaDePago"]),
    observacion: pickString(row, ["observacion", "Observacion"]),
    isGrandTotalRowTotal:
      row.isGrandTotalRowTotal === true || row.IsGrandTotalRowTotal === true,
    sumParcial: asFiniteNumber(pickUnknown(row, ["sumParcial", "SumParcial"])),
  }
}

export async function fetchControlPrevioIngNoRelKpis(): Promise<{
  kpis: ControlPrevioIngNoRelKpis
  currency: { code: string; symbol: string }
}> {
  const body = asRecord(await fetchReportesJson(REPORTES_PROXY_CONTROL_PREVIO_ING_NO_REL_KPIS_PATH))
  const kpisRaw = asRecord(body?.kpis ?? body?.Kpis)
  if (!kpisRaw) throw new Error("Respuesta de KPIs con formato inesperado.")

  const currencyRaw = asRecord(body?.currency ?? body?.Currency)
  const currency = {
    code: (currencyRaw ? pickString(currencyRaw, ["code", "Code"]) : null) ?? "PEN",
    symbol: (currencyRaw ? pickString(currencyRaw, ["symbol", "Symbol"]) : null) ?? "S/",
  }

  return {
    currency,
    kpis: {
      newIngTotalServicios: asFiniteNumber(
        pickUnknown(kpisRaw, ["newIngTotalServicios", "NewIngTotalServicios"])
      ),
      newIngTotalMateriales: asFiniteNumber(
        pickUnknown(kpisRaw, ["newIngTotalMateriales", "NewIngTotalMateriales"])
      ),
      sumParcial: asFiniteNumber(pickUnknown(kpisRaw, ["sumParcial", "SumParcial"])),
      minFecha: pickString(kpisRaw, ["minFecha", "MinFecha"]),
      newIngPendientesServicios: asFiniteNumber(
        pickUnknown(kpisRaw, ["newIngPendientesServicios", "NewIngPendientesServicios"])
      ),
      newIngPendientesMateriales: asFiniteNumber(
        pickUnknown(kpisRaw, ["newIngPendientesMateriales", "NewIngPendientesMateriales"])
      ),
    },
  }
}

export async function fetchControlPrevioIngNoRelTabla(input?: {
  page?: number
}): Promise<ControlPrevioIngNoRelTablaResult> {
  const page = asPositiveInt(input?.page, DEFAULT_PAGE)
  const query = new URLSearchParams({ page: String(page) }).toString()

  const body = asRecord(
    await fetchReportesJson(`${REPORTES_PROXY_CONTROL_PREVIO_ING_NO_REL_TABLA_PATH}?${query}`)
  )
  if (!body) throw new Error("Respuesta de tabla con formato inesperado.")
  const rawItems = firstArray(body.items, body.Items)
  const items = rawItems
    .map(parseTablaRow)
    .filter((r): r is ControlPrevioIngNoRelTablaRow => r !== null)

  const rawPage = asPositiveInt(pickUnknown(body, ["page", "Page"]), page)
  const rawPageSize = asPositiveInt(pickUnknown(body, ["pageSize", "PageSize"]), 10)
  const totalRows = asPositiveInt(pickUnknown(body, ["totalRows", "TotalRows"]), items.length)
  const totalPages = Math.max(
    1,
    asPositiveInt(
      pickUnknown(body, ["totalPages", "TotalPages"]),
      Math.ceil(totalRows / rawPageSize)
    )
  )
  const safePage = Math.min(rawPage, totalPages)

  const currencyRaw = asRecord(body?.currency ?? body?.Currency)
  const currency = {
    code: (currencyRaw ? pickString(currencyRaw, ["code", "Code"]) : null) ?? "PEN",
    symbol: (currencyRaw ? pickString(currencyRaw, ["symbol", "Symbol"]) : null) ?? "S/",
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

function parseTop10Row(raw: unknown): ControlPrevioIngNoRelTop10Item | null {
  const row = asRecord(raw)
  if (!row) return null
  const desSocioNegocio = pickString(row, ["desSocioNegocio", "DesSocioNegocio"])
  const sumMontoS = asFiniteNumber(pickUnknown(row, ["sumMontoS", "SumMontoS"]))
  return { desSocioNegocio, sumMontoS }
}

export async function fetchControlPrevioIngNoRelTop10Proveedores(): Promise<ControlPrevioIngNoRelTop10Result> {
  const body = asRecord(
    await fetchReportesJson(REPORTES_PROXY_CONTROL_PREVIO_ING_NO_REL_TOP10_PROVEEDORES_PATH)
  )
  if (!body) throw new Error("Respuesta Top 10 con formato inesperado.")

  const rawItems = firstArray(body.items, body.Items, body.data, body.Data)
  const items: ControlPrevioIngNoRelTop10Item[] = rawItems
    .map(parseTop10Row)
    .filter((r): r is ControlPrevioIngNoRelTop10Item => r !== null)

  const currencyRaw = asRecord(body.currency ?? body.Currency)
  const currency = {
    code: (currencyRaw ? pickString(currencyRaw, ["code", "Code"]) : null) ?? "PEN",
    symbol: (currencyRaw ? pickString(currencyRaw, ["symbol", "Symbol"]) : null) ?? "S/",
  }

  return { items, currency }
}
