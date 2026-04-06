import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  ClipboardList,
  Coins,
  FileStack,
  GitBranch,
  LineChart,
  Package,
  PieChart,
  Scale,
  TrendingUp,
  Truck,
  Wallet,
} from "lucide-react"
import type { ReportArea } from "@/lib/report-area"

export type MainNavItem = { title: string; href: string; icon: LucideIcon }

const CONTROL_PREVIO_NAV: MainNavItem[] = [
  {
    title: "Informe General",
    href: "/dashboard/control-previo/informe-general",
    icon: ClipboardList,
  },
  {
    title: "Documento No Relacionados",
    href: "/dashboard/control-previo/documentos-no-relacionados",
    icon: FileStack,
  },
  {
    title: "SubContratos",
    href: "/dashboard/control-previo/subcontratos",
    icon: GitBranch,
  },
  {
    title: "Ingresos no Relacionados",
    href: "/dashboard/control-previo/ingresos-no-relacionados",
    icon: Wallet,
  },
  {
    title: "Estado OC/OS",
    href: "/dashboard/control-previo/estado-oc-os",
    icon: Truck,
  },
  {
    title: "Stock Almacen",
    href: "/dashboard/control-previo/stock-almacen",
    icon: Package,
  },
]

const RO_CIVIL_NAV: MainNavItem[] = [
  {
    title: "Curva S",
    href: "/dashboard/ro-civil/curva-s",
    icon: LineChart,
  },
  {
    title: "Costo R",
    href: "/dashboard/ro-civil/costo-r",
    icon: Coins,
  },
  {
    title: "Costo VS Utilidades",
    href: "/dashboard/ro-civil/costo-vs-utilidades",
    icon: Scale,
  },
  {
    title: "Control Presupuestal",
    href: "/dashboard/ro-civil/control-presupuestal",
    icon: PieChart,
  },
  {
    title: "Desviaciones de Proyecto",
    href: "/dashboard/ro-civil/desviaciones-proyecto",
    icon: BarChart3,
  },
  {
    title: "Avance Contratos",
    href: "/dashboard/ro-civil/avance-contratos",
    icon: TrendingUp,
  },
]

export function getMainNavForArea(area: ReportArea): MainNavItem[] {
  return area === "control_previo" ? CONTROL_PREVIO_NAV : RO_CIVIL_NAV
}

export function defaultDashboardPath(area: ReportArea): string {
  return getMainNavForArea(area)[0].href
}

export const CONTROL_PREVIO_PREFIX = "/dashboard/control-previo"
export const RO_CIVIL_PREFIX = "/dashboard/ro-civil"
