import type {
  ControlPrevioDocNoRelCountRow,
  ControlPrevioDocNoRelKpis,
} from "@/lib/controlprevio-documentos-no-relacionados"
import type {
  EstadoFacturadoMontoPendienteRow,
  EstadoOrdenesKpis,
} from "@/lib/controlprevio-estado-ordenes"
import type {
  ControlPrevioIngNoRelKpis,
  ControlPrevioIngNoRelTop10Item,
} from "@/lib/controlprevio-ingresos-no-relacionados"
import type {
  ControlPrevioStockAlmacenInventarioCategoriaItem,
  ControlPrevioStockAlmacenTopRecursoItem,
} from "@/lib/controlprevio-stock-almacen"
import type { SubcontratosDashboardData, SubcontratosTop10Item } from "@/lib/biop-subcontratos"
import type {
  InformeGeneralAlertaRow,
  InformeGeneralCategoriaItem,
  InformeGeneralKpi,
  InformeGeneralRankingItem,
  InformeGeneralTrendPoint,
} from "@/features/informe-general/types"

const CHART_COLORS = [
  "var(--color-brand-primary)",
  "var(--color-brand-secondary)",
  "var(--color-brand-tertiary)",
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
]

function formatCount(value: number) {
  return new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 }).format(value)
}

function formatMoney(value: number, currencyCode = "PEN") {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode.length === 3 ? currencyCode : "PEN",
    maximumFractionDigits: 0,
  }).format(value)
}

function normalizeEstadoFacturado(value: string): "parcial" | "sinFacturar" | "total" {
  const state = value.toLowerCase()
  if (state.includes("sin")) return "sinFacturar"
  if (state.includes("total")) return "total"
  return "parcial"
}

export function mapExecutiveKpis(input: {
  estadoKpis?: EstadoOrdenesKpis
  subcontratos?: SubcontratosDashboardData
  documentosKpis?: ControlPrevioDocNoRelKpis
  ingresosKpis?: ControlPrevioIngNoRelKpis
  currencyCode?: string
}): InformeGeneralKpi[] {
  const currencyCode = input.currencyCode ?? "PEN"
  const estadoTotal =
    (input.estadoKpis?.anulado ?? 0) +
    (input.estadoKpis?.porAprobar ?? 0) +
    (input.estadoKpis?.aprobado ?? 0) +
    (input.estadoKpis?.enSubcontrato ?? 0) +
    (input.estadoKpis?.enAlmacen ?? 0) +
    (input.estadoKpis?.parcialmenteEnAlmacen ?? 0) +
    (input.estadoKpis?.registrado ?? 0)

  return [
    {
      id: "estado-total",
      label: "Ordenes OC/OS monitoreadas",
      value: formatCount(estadoTotal),
      hint: "Visibilidad total del flujo documental.",
      tone: "primary",
    },
    {
      id: "estado-por-aprobar",
      label: "Ordenes por aprobar",
      value: formatCount(input.estadoKpis?.porAprobar ?? 0),
      hint: "Backlog pendiente de validación.",
      tone: "secondary",
    },
    {
      id: "sub-por-facturar",
      label: "Subcontratos por facturar",
      value: formatCount(input.subcontratos?.pendienteFacturar ?? 0),
      hint: "Carga pendiente en contratos.",
      tone: "tertiary",
    },
    {
      id: "sub-adelanto",
      label: "Adelanto por amortizar",
      value: formatMoney(input.subcontratos?.adelantoPorAmortizar ?? 0, currencyCode),
      hint: "Exposición financiera aún no amortizada.",
      tone: "primary",
    },
    {
      id: "doc-por-liquidar",
      label: "Docs pendientes por liquidar",
      value: formatCount(input.documentosKpis?.newDocCantPendienteLiquidar ?? 0),
      hint: "Procesos de cierre administrativo pendientes.",
      tone: "secondary",
    },
    {
      id: "doc-por-relacionar",
      label: "Docs pendientes por relacionar",
      value: formatCount(input.documentosKpis?.newDocCantPendienteRelacionar ?? 0),
      hint: "Documentos sin vínculo operativo.",
      tone: "neutral",
    },
    {
      id: "ing-pend-serv",
      label: "Pendiente servicios",
      value: formatMoney(input.ingresosKpis?.newIngPendientesServicios ?? 0, currencyCode),
      hint: "Monto pendiente por ingresos de servicios.",
      tone: "primary",
    },
    {
      id: "ing-pend-mat",
      label: "Pendiente materiales",
      value: formatMoney(input.ingresosKpis?.newIngPendientesMateriales ?? 0, currencyCode),
      hint: "Monto pendiente por ingresos de materiales.",
      tone: "tertiary",
    },
  ]
}

export function mapFacturadoTrend(
  rows: EstadoFacturadoMontoPendienteRow[] | undefined
): InformeGeneralTrendPoint[] {
  const map = new Map<string, InformeGeneralTrendPoint>()
  for (const row of rows ?? []) {
    const key = `${row.anio}-${String(row.nroMes).padStart(2, "0")}`
    const period = `${row.mes} ${row.anio}`
    const prev = map.get(key) ?? {
      period,
      pendienteParcial: 0,
      pendienteSinFacturar: 0,
      pendienteTotal: 0,
    }
    const estado = normalizeEstadoFacturado(row.estadoFacturado)
    if (estado === "parcial") prev.pendienteParcial += row.sumMontoS
    if (estado === "sinFacturar") prev.pendienteSinFacturar += row.sumMontoS
    if (estado === "total") prev.pendienteTotal += row.sumMontoS
    map.set(key, prev)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([, value]) => value)
}

export function mapSubcontratosTop(items: SubcontratosTop10Item[] | undefined): InformeGeneralRankingItem[] {
  return (items ?? [])
    .filter((item) => item.monto > 0)
    .sort((a, b) => b.monto - a.monto)
    .slice(0, 5)
    .map((item, idx) => ({
      label: item.nombre.trim() || `Subcontrato ${idx + 1}`,
      amount: item.monto,
    }))
}

export function mapProveedoresTop(
  items: ControlPrevioIngNoRelTop10Item[] | undefined
): InformeGeneralRankingItem[] {
  return (items ?? [])
    .filter((item) => item.sumMontoS > 0)
    .sort((a, b) => b.sumMontoS - a.sumMontoS)
    .slice(0, 5)
    .map((item, idx) => ({
      label: item.desSocioNegocio?.trim() || `Proveedor ${idx + 1}`,
      amount: item.sumMontoS,
    }))
}

export function mapRecursosTop(
  items: ControlPrevioStockAlmacenTopRecursoItem[] | undefined
): InformeGeneralRankingItem[] {
  return (items ?? [])
    .filter((item) => item.sumMontoS > 0)
    .sort((a, b) => b.sumMontoS - a.sumMontoS)
    .slice(0, 5)
    .map((item, idx) => ({
      label: item.recurso?.trim() || `Recurso ${idx + 1}`,
      amount: item.sumMontoS,
    }))
}

export function mapInventarioCategorias(
  items: ControlPrevioStockAlmacenInventarioCategoriaItem[] | undefined
): InformeGeneralCategoriaItem[] {
  return (items ?? [])
    .filter((item) => item.sumMontoS > 0)
    .sort((a, b) => b.sumMontoS - a.sumMontoS)
    .map((item, idx) => ({
      key: `categoria-${idx + 1}`,
      label: item.tipoAlmacenServicio?.trim() || `Categoria ${idx + 1}`,
      amount: item.sumMontoS,
      fill: CHART_COLORS[idx % CHART_COLORS.length],
    }))
}

export function mapAlertasPriorizadas(input: {
  porLiquidar?: ControlPrevioDocNoRelCountRow[]
  porRelacionar?: ControlPrevioDocNoRelCountRow[]
}): InformeGeneralAlertaRow[] {
  const map = new Map<string, InformeGeneralAlertaRow>()

  for (const item of input.porLiquidar ?? []) {
    if (item.isGrandTotalRowTotal) continue
    const label = item.tipoDocumento?.trim() || "Sin tipo"
    const current = map.get(label) ?? {
      tipoDocumento: label,
      porLiquidar: 0,
      porRelacionar: 0,
      totalPendientes: 0,
    }
    current.porLiquidar = item.cantidad
    current.totalPendientes = current.porLiquidar + current.porRelacionar
    map.set(label, current)
  }

  for (const item of input.porRelacionar ?? []) {
    if (item.isGrandTotalRowTotal) continue
    const label = item.tipoDocumento?.trim() || "Sin tipo"
    const current = map.get(label) ?? {
      tipoDocumento: label,
      porLiquidar: 0,
      porRelacionar: 0,
      totalPendientes: 0,
    }
    current.porRelacionar = item.cantidad
    current.totalPendientes = current.porLiquidar + current.porRelacionar
    map.set(label, current)
  }

  return Array.from(map.values())
    .sort((a, b) => b.totalPendientes - a.totalPendientes)
    .slice(0, 8)
}

export function formatRankingAmount(amount: number, currencyCode: string) {
  return formatMoney(amount, currencyCode)
}
