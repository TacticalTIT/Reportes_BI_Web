import {
  resolveReportesRequestUrl,
  REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_KPIS_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_TABLA_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_TOP10_PATH,
} from "@/lib/reportes-api-client"

type ApiErr = { message?: string }

/**
 * Igual que fetchReportesJson pero tolera respuestas sin `success` (solo JSON 200 con `data`, `ok`, o array).
 * Necesario para algunos endpoints de control previo.
 */
async function fetchControlPrevioJson(path: string): Promise<unknown> {
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
    if (
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as ApiErr).message === "string"
    ) {
      throw new Error((body as ApiErr).message)
    }
    throw new Error(`Error HTTP ${res.status}`)
  }

  if (Array.isArray(body)) {
    return { success: true as const, data: body }
  }

  if (typeof body !== "object" || body === null) {
    throw new Error("Respuesta del API con formato inesperado.")
  }

  const o = body as Record<string, unknown>

  if ("success" in o && typeof o.success === "boolean") {
    if (!o.success) {
      const msg =
        typeof o.message === "string"
          ? o.message
          : "El API devolvio un error."
      throw new Error(msg)
    }
    return body
  }

  if (o.ok === true) {
    return { success: true as const, ...o }
  }

  return { success: true as const, ...o }
}

export type SubcontratosFilters = {
  desProyecto?: string
  tipoAlmacenServicio?: string
}

export type SubcontratosTop10Item = {
  nombre: string
  monto: number
}

export type SubcontratosTableRow = {
  proveedor: string
  nroOrden: string
  contrato: string
  montoS: number
  montoSubcontrato: number
  facturado: number
  porFacturar: number
  montoRetenido: number
  fondoGarantia: number
  devuelto: number
  adelantoOtorgado: number
  adelantoAmortizado: number
  adelantoPorAmortizar: number
  pagoCuentaSinIgvOtorgado: number
  pagoCuentaPorAmortizar: number
  isGrandTotalRow: boolean
  isProveedorSubtotal: boolean
}

export type SubcontratosPagination = {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
}

export type SubcontratosDashboardData = {
  context: string
  cantidadSubcontratos: number
  pendienteValorizar: number
  pendienteFacturar: number
  adelantoPorAmortizar: number
  totalPagoCuenta: number
  totalAdelanto: number
  top10: SubcontratosTop10Item[]
  tabla: SubcontratosTableRow[]
  tablaPagination: SubcontratosPagination | null
}

function toFiniteNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/,/g, "").trim())
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

function toCleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function toNonNegativeInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const n = Math.floor(value)
    return n >= 0 ? n : null
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Math.floor(Number.parseFloat(value.replace(/,/g, "").trim()))
    if (Number.isFinite(n) && n >= 0) return n
  }
  return null
}

function appendFiltersToSearchParams(
  q: URLSearchParams,
  filters?: SubcontratosFilters
) {
  if (filters?.desProyecto?.trim()) {
    q.set("desProyecto", filters.desProyecto.trim())
  }
  if (filters?.tipoAlmacenServicio?.trim()) {
    q.set("tipoAlmacenServicio", filters.tipoAlmacenServicio.trim())
  }
}

function buildControlprevioTablaPath(
  page: number,
  filters?: SubcontratosFilters
): string {
  const q = new URLSearchParams({ page: String(page) })
  appendFiltersToSearchParams(q, filters)
  return `${REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_TABLA_PATH}?${q}`
}

function buildControlprevioKpisPath(filters?: SubcontratosFilters): string {
  const q = new URLSearchParams()
  appendFiltersToSearchParams(q, filters)
  const qs = q.toString()
  return qs
    ? `${REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_KPIS_PATH}?${qs}`
    : REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_KPIS_PATH
}

function buildControlprevioTop10Path(filters?: SubcontratosFilters): string {
  const q = new URLSearchParams()
  appendFiltersToSearchParams(q, filters)
  const qs = q.toString()
  return qs
    ? `${REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_TOP10_PATH}?${qs}`
    : REPORTES_PROXY_CONTROL_PREVIO_SUBCONTRATOS_TOP10_PATH
}

function objectRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null
  }
  return value as Record<string, unknown>
}

/** Cuerpo con KPIs: admite `{ data: { ... } }`, `{ kpis: { ... } }` o campos en la raíz (tras `success`). */
function kpiSourceObject(body: unknown): Record<string, unknown> {
  const root = objectRecord(body)
  if (!root) return {}
  const nested =
    objectRecord(root.data) ??
    objectRecord(root.kpis) ??
    objectRecord(root.Kpis)
  return nested ?? root
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number {
  for (const k of keys) {
    if (!Object.prototype.hasOwnProperty.call(obj, k)) continue
    const v = obj[k]
    if (v === undefined) continue
    return toFiniteNumber(v)
  }
  return 0
}

function parseSubcontratosKpis(body: unknown): Pick<
  SubcontratosDashboardData,
  | "cantidadSubcontratos"
  | "pendienteValorizar"
  | "pendienteFacturar"
  | "adelantoPorAmortizar"
  | "totalPagoCuenta"
  | "totalAdelanto"
> {
  const o = kpiSourceObject(body)
  return {
    cantidadSubcontratos: pickNumber(o, [
      "cantidadSubcontratos",
      "CantidadSubcontratos",
      "cantidad_subcontratos",
      "countDesSocioNegocio",
      "CountDesSocioNegocio",
    ]),
    pendienteValorizar: pickNumber(o, [
      "pendienteValorizar",
      "PendienteValorizar",
      "pendiente_valorizar",
      "newSubPendienteValorizar",
      "NewSubPendienteValorizar",
    ]),
    pendienteFacturar: pickNumber(o, [
      "pendienteFacturar",
      "PendienteFacturar",
      "pendiente_facturar",
      "newSubPendienteFacturar",
      "NewSubPendienteFacturar",
    ]),
    adelantoPorAmortizar: pickNumber(o, [
      "adelantoPorAmortizar",
      "AdelantoPorAmortizar",
      "adelanto_por_amortizar",
      "sumAdelantoPorAmortizar",
    ]),
    totalPagoCuenta: pickNumber(o, [
      "totalPagoCuenta",
      "TotalPagoCuenta",
      "total_pago_cuenta",
      "sumPagoCuentaOtorgado",
    ]),
    totalAdelanto: pickNumber(o, [
      "totalAdelanto",
      "TotalAdelanto",
      "total_adelanto",
      "sumAdelantoOtorgado",
    ]),
  }
}

function readListPayload(body: unknown): unknown {
  const root = objectRecord(body)
  if (!root) return undefined
  if ("data" in root) return root.data
  if ("items" in root) return root.items
  if ("rows" in root) return root.rows
  return undefined
}

function asObjectArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (row): row is Record<string, unknown> =>
      typeof row === "object" && row !== null
  )
}

function parseTablaPagination(raw: unknown): SubcontratosPagination | null {
  if (typeof raw !== "object" || raw === null) return null
  const p = raw as Record<string, unknown>
  const page = toNonNegativeInt(p.page)
  const limit =
    toNonNegativeInt(p.limit) ?? toNonNegativeInt(p.pageSize) ?? 10
  const total =
    toNonNegativeInt(p.total) ??
    toNonNegativeInt(p.totalItems) ??
    toNonNegativeInt(p.totalRows) ??
    null
  const totalPages = toNonNegativeInt(p.totalPages)
  if (page == null || total == null || totalPages == null) return null
  const hasPrev =
    typeof p.hasPrev === "boolean" ? p.hasPrev : page > 1
  const hasNext =
    typeof p.hasNext === "boolean" ? p.hasNext : page < totalPages
  return {
    page,
    pageSize: limit,
    totalItems: total,
    totalPages,
    hasPrev,
    hasNext,
  }
}

function parseTablaPaginationFromBody(body: unknown): SubcontratosPagination | null {
  const root = objectRecord(body)
  if (!root) return null
  const nested = root.pagination
  if (nested !== undefined && nested !== null) {
    const fromNested = parseTablaPagination(nested)
    if (fromNested) return fromNested
  }
  return parseTablaPagination(body)
}

function pickTablaNumber(row: Record<string, unknown>, keys: string[]): number {
  for (const k of keys) {
    if (!Object.prototype.hasOwnProperty.call(row, k)) continue
    const v = row[k]
    if (v === undefined) continue
    return toFiniteNumber(v)
  }
  return 0
}

function mapTop10FromApi(value: unknown): SubcontratosTop10Item[] {
  return asObjectArray(value)
    .map((row) => ({
      nombre:
        toCleanString(row.nombre) ||
        toCleanString(row.Nombre) ||
        toCleanString(row.descripcion) ||
        toCleanString(row.DesSocioNegocio) ||
        toCleanString(row.desSocioNegocio) ||
        "Sin descripción",
      monto: pickTablaNumber(row, [
        "sumMontoS",
        "SumMontoS",
        "monto",
        "Monto",
        "valor",
        "SumMontoSubcontrato",
        "sumMontoSubcontrato",
      ]),
    }))
    .slice(0, 10)
}

function mapTablaRows(value: unknown): SubcontratosTableRow[] {
  return asObjectArray(value).map((row) => {
    const proveedorRaw =
      toCleanString(row.DesSocioNegocio) ||
      toCleanString(row.desSocioNegocio) ||
      toCleanString(row.proveedor) ||
      toCleanString(row.Proveedor)
    const codOrdenRaw =
      row.CodOrden ?? row.codOrden ?? row.nroOrden ?? row.NroOrden
    const hasOrden =
      codOrdenRaw != null &&
      (typeof codOrdenRaw === "string"
        ? codOrdenRaw.trim() !== ""
        : typeof codOrdenRaw === "number")
    const proveedor = proveedorRaw || "—"
    const isGrandTotalRow =
      row.isGrandTotalRowTotal === true ||
      row.IsGrandTotalRowTotal === true ||
      proveedorRaw.toLowerCase() === "total"
    const observacion =
      row.Observacion ?? row.observacion ?? row.contrato ?? row.Contrato
    return {
      proveedor,
      nroOrden: hasOrden ? String(codOrdenRaw).trim() : "—",
      contrato: toCleanString(observacion) || "—",
      montoS: pickTablaNumber(row, ["SumMontoS", "sumMontoS", "montoS"]),
      montoSubcontrato: pickTablaNumber(row, [
        "SumMontoSubcontrato",
        "sumMontoSubcontrato",
        "montoSubcontrato",
      ]),
      facturado: pickTablaNumber(row, ["SumFacturado", "sumFacturado", "facturado"]),
      porFacturar: pickTablaNumber(row, [
        "SumPorFacturar",
        "sumPorFacturar",
        "porFacturar",
      ]),
      montoRetenido: pickTablaNumber(row, [
        "SumMontoRetenido",
        "sumMontoRetenido",
        "montoRetenido",
      ]),
      fondoGarantia: pickTablaNumber(row, [
        "SumFondoDeGarantia",
        "sumFondoDeGarantia",
        "fondoGarantia",
      ]),
      devuelto: pickTablaNumber(row, ["SumDevuelto", "sumDevuelto", "devuelto"]),
      adelantoOtorgado: pickTablaNumber(row, [
        "SumAdelantoOtorgado",
        "sumAdelantoOtorgado",
        "adelantoOtorgado",
      ]),
      adelantoAmortizado: pickTablaNumber(row, [
        "SumAdelantoAmortizado",
        "sumAdelantoAmortizado",
        "adelantoAmortizado",
      ]),
      adelantoPorAmortizar: pickTablaNumber(row, [
        "SumAdelantoPorAmortizar",
        "sumAdelantoPorAmortizar",
        "adelantoPorAmortizar",
      ]),
      pagoCuentaSinIgvOtorgado: pickTablaNumber(row, [
        "SumPagoCuentaSinIgvOtorgado",
        "sumPagoCuentaSinIgvOtorgado",
        "pagoCuentaSinIgvOtorgado",
      ]),
      pagoCuentaPorAmortizar: pickTablaNumber(row, [
        "SumPagoCuentaPorAmortizar",
        "sumPagoCuentaPorAmortizar",
        "pagoCuentaPorAmortizar",
      ]),
      isGrandTotalRow,
      isProveedorSubtotal: !hasOrden && !isGrandTotalRow,
    }
  })
}

function fulfilledOrUndefined<T>(
  r: PromiseSettledResult<T>
): T | undefined {
  return r.status === "fulfilled" ? r.value : undefined
}

/**
 * Dashboard subcontratos: `api/controlprevio/subcontratos/kpis`, `top10`, `tabla?page=`.
 * Usa `Promise.allSettled` para que un endpoint caído no bloquee el resto.
 */
export async function fetchSubcontratosDashboardData(
  filters?: SubcontratosFilters,
  opts?: { page?: number; pageSize?: number }
): Promise<SubcontratosDashboardData> {
  const page = opts?.page && opts.page > 0 ? Math.floor(opts.page) : 1

  const settled = await Promise.allSettled([
    fetchControlPrevioJson(buildControlprevioKpisPath(filters)),
    fetchControlPrevioJson(buildControlprevioTop10Path(filters)),
    fetchControlPrevioJson(buildControlprevioTablaPath(page, filters)),
  ])

  const kpisBody = fulfilledOrUndefined(settled[0])
  const top10Body = fulfilledOrUndefined(settled[1])
  const tablaBody = fulfilledOrUndefined(settled[2])

  const kpis = kpisBody != null ? parseSubcontratosKpis(kpisBody) : {
    cantidadSubcontratos: 0,
    pendienteValorizar: 0,
    pendienteFacturar: 0,
    adelantoPorAmortizar: 0,
    totalPagoCuenta: 0,
    totalAdelanto: 0,
  }

  const top10 =
    top10Body != null
      ? mapTop10FromApi(readListPayload(top10Body))
      : []

  const tablaData =
    tablaBody != null
      ? readListPayload(tablaBody)
      : undefined
  const tabla =
    tablaData !== undefined ? mapTablaRows(tablaData) : []

  const tablaPagination = parseTablaPaginationFromBody(tablaBody)

  return {
    context: "subcontratos",
    ...kpis,
    top10,
    tabla,
    tablaPagination,
  }
}
