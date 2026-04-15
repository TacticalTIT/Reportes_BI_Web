import {
  fetchReportesJson,
  REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_FACTURADO_PENDIENTE_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_KPIS_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_TABLA_A_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_TABLA_B_PATH,
  REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_TABLA_PATH,
} from "@/lib/reportes-api-client"

type UnknownRecord = Record<string, unknown>

type TablaEnvelope = {
  success: true
  page: number
  pageSize: number
  totalRows: number
  totalPages: number
  items: UnknownRecord[]
}

type ItemsEnvelope = {
  success: true
  items: UnknownRecord[]
}

type FacturadoEnvelope = {
  success: true
  body: UnknownRecord[]
}

type KpisEnvelope = {
  success: true
  kpis: UnknownRecord
}

export type EstadoOrdenesKpis = {
  anulado: number
  porAprobar: number
  aprobado: number
  enSubcontrato: number
  enAlmacen: number
  parcialmenteEnAlmacen: number
  registrado: number
}

export type EstadoOrdenesTablaRow = {
  desSocioNegocio: string | null
  codOrden: string | null
  estadoDocumento: string | null
  fecha: string | null
  tipoAlmacenServicio: string | null
  desMoneda: string | null
  estadoFacturado: string | null
  observacion: string | null
  tipoCambio: number
  isGrandTotalRowTotal: boolean
  sumMontoS: number
  sumFacturado: number
  newOcPendienteIngreso: number | null
  sumMontoTotalOrden: number
  countCodOrden: number
}

export type EstadoOrdenesPagination = {
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

export type EstadoOrdenesTablaData = {
  items: EstadoOrdenesTablaRow[]
  pagination: EstadoOrdenesPagination
}

export type EstadoDocumentoResumenRow = {
  estadoDocumento: string
  isGrandTotalRowTotal: boolean
  distinctCountCodOrden: number
  sumMontoS: number
}

export type EstadoPendienteIngresoRow = {
  estadoDocumento: string
  isGrandTotalRowTotal: boolean
  distinctCountCodOrden: number
  newOcPendienteIngreso: number
}

export type EstadoFacturadoMontoPendienteRow = {
  anio: number
  mes: string
  nroMes: number
  estadoFacturado: string
  sumMontoS: number
  minDate: string | null
  columnIndex: number
}

export type EstadoOrdenesOverviewData = {
  kpis: EstadoOrdenesKpis
  tablaA: EstadoDocumentoResumenRow[]
  tablaB: EstadoPendienteIngresoRow[]
  facturadoPendiente: EstadoFacturadoMontoPendienteRow[]
}

const DEFAULT_KPIS: EstadoOrdenesKpis = {
  anulado: 0,
  porAprobar: 0,
  aprobado: 0,
  enSubcontrato: 0,
  enAlmacen: 0,
  parcialmenteEnAlmacen: 0,
  registrado: 0,
}

function asRecord(value: unknown): UnknownRecord | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null
  }
  return value as UnknownRecord
}

function asItemsArray(value: unknown): UnknownRecord[] {
  if (!Array.isArray(value)) return []
  return value.filter(
    (row): row is UnknownRecord => typeof row === "object" && row !== null
  )
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/,/g, "").trim())
    if (Number.isFinite(parsed)) return parsed
  }
  return 0
}

function toInteger(value: unknown): number {
  return Math.floor(toNumber(value))
}

function toStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function buildVisiblePages(page: number, totalPages: number): number[] {
  const min = Math.max(1, page - 2)
  const max = Math.min(totalPages, page + 2)
  const pages: number[] = []
  for (let p = min; p <= max; p += 1) pages.push(p)
  if (!pages.includes(1)) pages.unshift(1)
  if (!pages.includes(totalPages)) pages.push(totalPages)
  return pages
}

function normalizeTablaRow(row: UnknownRecord): EstadoOrdenesTablaRow {
  return {
    desSocioNegocio: toStringOrNull(row.desSocioNegocio),
    codOrden: toStringOrNull(row.codOrden),
    estadoDocumento: toStringOrNull(row.estadoDocumento),
    fecha: toStringOrNull(row.fecha),
    tipoAlmacenServicio: toStringOrNull(row.tipoAlmacenServicio),
    desMoneda: toStringOrNull(row.desMoneda),
    estadoFacturado: toStringOrNull(row.estadoFacturado),
    observacion: toStringOrNull(row.observacion),
    tipoCambio: toNumber(row.tipoCambio),
    isGrandTotalRowTotal: row.isGrandTotalRowTotal === true,
    sumMontoS: toNumber(row.sumMontoS),
    sumFacturado: toNumber(row.sumFacturado),
    newOcPendienteIngreso:
      row.newOcPendienteIngreso == null ? null : toNumber(row.newOcPendienteIngreso),
    sumMontoTotalOrden: toNumber(row.sumMontoTotalOrden),
    countCodOrden: toInteger(row.countCodOrden),
  }
}

export async function fetchControlPrevioEstadoOrdenesTabla(opts?: {
  page?: number
}): Promise<EstadoOrdenesTablaData> {
  const rawPage = opts?.page ?? 1
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1
  const path = `${REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_TABLA_PATH}?page=${page}`
  const raw = (await fetchReportesJson(path)) as TablaEnvelope
  const items = asItemsArray(raw.items).map(normalizeTablaRow)
  const totalPages = Math.max(1, toInteger(raw.totalPages) || 1)
  const currentPage = Math.min(Math.max(1, toInteger(raw.page) || page), totalPages)
  const pageSize = Math.max(1, toInteger(raw.pageSize) || 10)
  const totalRows = Math.max(0, toInteger(raw.totalRows))
  const pagination: EstadoOrdenesPagination = {
    page: currentPage,
    pageSize,
    totalRows,
    totalPages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    visiblePages: buildVisiblePages(currentPage, totalPages),
  }
  return { items, pagination }
}

export async function fetchControlPrevioEstadoOrdenesKpis(): Promise<EstadoOrdenesKpis> {
  const raw = (await fetchReportesJson(
    REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_KPIS_PATH
  )) as KpisEnvelope
  const source = asRecord(raw.kpis) ?? {}
  return {
    anulado: toInteger(source.anulado),
    porAprobar: toInteger(source.porAprobar),
    aprobado: toInteger(source.aprobado),
    enSubcontrato: toInteger(source.enSubcontrato),
    enAlmacen: toInteger(source.enAlmacen),
    parcialmenteEnAlmacen: toInteger(source.parcialmenteEnAlmacen),
    registrado: toInteger(source.registrado),
  }
}

export async function fetchControlPrevioEstadoOrdenesTablaA(): Promise<
  EstadoDocumentoResumenRow[]
> {
  const raw = (await fetchReportesJson(
    REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_TABLA_A_PATH
  )) as ItemsEnvelope
  return asItemsArray(raw.items).map((row) => ({
    estadoDocumento: toStringOrNull(row.estadoDocumento) ?? "Total",
    isGrandTotalRowTotal: row.isGrandTotalRowTotal === true,
    distinctCountCodOrden: toInteger(row.distinctCountCodOrden),
    sumMontoS: toNumber(row.sumMontoS),
  }))
}

export async function fetchControlPrevioEstadoOrdenesTablaB(): Promise<
  EstadoPendienteIngresoRow[]
> {
  const raw = (await fetchReportesJson(
    REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_TABLA_B_PATH
  )) as ItemsEnvelope
  return asItemsArray(raw.items).map((row) => ({
    estadoDocumento: toStringOrNull(row.estadoDocumento) ?? "Total",
    isGrandTotalRowTotal: row.isGrandTotalRowTotal === true,
    distinctCountCodOrden: toInteger(row.distinctCountCodOrden),
    newOcPendienteIngreso: toNumber(row.newOcPendienteIngreso),
  }))
}

export async function fetchControlPrevioEstadoOrdenesFacturadoPendiente(): Promise<
  EstadoFacturadoMontoPendienteRow[]
> {
  const raw = (await fetchReportesJson(
    REPORTES_PROXY_CONTROL_PREVIO_ESTADO_ORDENES_FACTURADO_PENDIENTE_PATH
  )) as FacturadoEnvelope
  return asItemsArray(raw.body)
    .map((row) => ({
      anio: toInteger(row.anio),
      mes: toStringOrNull(row.mes) ?? "Sin mes",
      nroMes: toInteger(row.nroMes),
      estadoFacturado: toStringOrNull(row.estadoFacturado) ?? "Sin estado",
      sumMontoS: toNumber(row.sumMontoS),
      minDate: toStringOrNull(row.minDate),
      columnIndex: toInteger(row.columnIndex),
    }))
    .sort((a, b) => {
      if (a.anio !== b.anio) return a.anio - b.anio
      if (a.nroMes !== b.nroMes) return a.nroMes - b.nroMes
      return a.columnIndex - b.columnIndex
    })
}

function fulfilledOrUndefined<T>(result: PromiseSettledResult<T>): T | undefined {
  return result.status === "fulfilled" ? result.value : undefined
}

export async function fetchControlPrevioEstadoOrdenesOverview(): Promise<EstadoOrdenesOverviewData> {
  const settled = await Promise.allSettled([
    fetchControlPrevioEstadoOrdenesKpis(),
    fetchControlPrevioEstadoOrdenesTablaA(),
    fetchControlPrevioEstadoOrdenesTablaB(),
    fetchControlPrevioEstadoOrdenesFacturadoPendiente(),
  ])
  return {
    kpis: fulfilledOrUndefined(settled[0]) ?? DEFAULT_KPIS,
    tablaA: fulfilledOrUndefined(settled[1]) ?? [],
    tablaB: fulfilledOrUndefined(settled[2]) ?? [],
    facturadoPendiente: fulfilledOrUndefined(settled[3]) ?? [],
  }
}
