import type {
  ControlPrevioDocNoRelCountRow,
  ControlPrevioDocNoRelKpis,
} from "@/lib/controlprevio-documentos-no-relacionados"
import type { EstadoFacturadoMontoPendienteRow, EstadoOrdenesKpis } from "@/lib/controlprevio-estado-ordenes"
import type {
  ControlPrevioIngNoRelKpis,
  ControlPrevioIngNoRelTop10Item,
} from "@/lib/controlprevio-ingresos-no-relacionados"
import type {
  ControlPrevioStockAlmacenInventarioCategoriaItem,
  ControlPrevioStockAlmacenTopRecursosResult,
} from "@/lib/controlprevio-stock-almacen"
import type { SubcontratosDashboardData, SubcontratosTop10Item } from "@/lib/biop-subcontratos"

export type InformeGeneralKpiTone = "primary" | "secondary" | "tertiary" | "neutral"

export type InformeGeneralKpi = {
  id: string
  label: string
  value: string
  hint: string
  tone: InformeGeneralKpiTone
}

export type InformeGeneralTrendPoint = {
  period: string
  pendienteParcial: number
  pendienteSinFacturar: number
  pendienteTotal: number
}

export type InformeGeneralRankingItem = {
  label: string
  amount: number
}

export type InformeGeneralCategoriaItem = {
  key: string
  label: string
  amount: number
  fill: string
}

export type InformeGeneralAlertaRow = {
  tipoDocumento: string
  porLiquidar: number
  porRelacionar: number
  totalPendientes: number
}

export type InformeGeneralDocumentosData = {
  kpis: ControlPrevioDocNoRelKpis
  resumen: {
    porLiquidar: ControlPrevioDocNoRelCountRow[]
    porRelacionar: ControlPrevioDocNoRelCountRow[]
  }
}

export type InformeGeneralIngresosData = {
  kpis: ControlPrevioIngNoRelKpis
  top10: ControlPrevioIngNoRelTop10Item[]
  currency: { code: string; symbol: string }
}

export type InformeGeneralStockData = {
  inventarioCategoria: ControlPrevioStockAlmacenInventarioCategoriaItem[]
  topRecursos: ControlPrevioStockAlmacenTopRecursosResult
}

export type InformeGeneralRawData = {
  estadoKpis: EstadoOrdenesKpis
  tendenciaFacturado: EstadoFacturadoMontoPendienteRow[]
  subcontratos: SubcontratosDashboardData
  documentos: InformeGeneralDocumentosData
  ingresos: InformeGeneralIngresosData
  stock: InformeGeneralStockData
}

export type InformeGeneralInput = Partial<InformeGeneralRawData>

export type InformeGeneralSubcontratoTop = SubcontratosTop10Item
