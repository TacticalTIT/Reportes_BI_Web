/** Datos ficticios para dashboards y reportes */

export const ventasPorMes = [
  { mes: "Ene", ventas: 4200, meta: 4000 },
  { mes: "Feb", ventas: 3800, meta: 4100 },
  { mes: "Mar", ventas: 5100, meta: 4200 },
  { mes: "Abr", ventas: 4700, meta: 4300 },
  { mes: "May", ventas: 6200, meta: 4500 },
  { mes: "Jun", ventas: 5800, meta: 4600 },
]

export const participacionCategoria = [
  { categoria: "Retail", valor: 38 },
  { categoria: "Mayoreo", valor: 27 },
  { categoria: "Digital", valor: 22 },
  { categoria: "Otros", valor: 13 },
]

export const kpisResumen = {
  ingresosMes: 128_400,
  ingresosVariacion: 12.4,
  pedidosMes: 1842,
  pedidosVariacion: -3.1,
  ticketPromedio: 69.7,
  ticketVariacion: 5.8,
  clientesActivos: 4120,
  clientesVariacion: 8.2,
}

export const topProductos = [
  { sku: "PRD-104", nombre: "Kit estándar A", unidades: 920, ingreso: 46_000 },
  { sku: "PRD-088", nombre: "Módulo premium", unidades: 540, ingreso: 81_000 },
  { sku: "PRD-201", nombre: "Suscripción anual", unidades: 310, ingreso: 62_000 },
  { sku: "PRD-015", nombre: "Accesorio básico", unidades: 1200, ingreso: 24_000 },
]

export const tendenciaInventario = [
  { semana: "S1", stock: 11800, rotacion: 4.1 },
  { semana: "S2", stock: 11200, rotacion: 4.3 },
  { semana: "S3", stock: 10900, rotacion: 4.6 },
  { semana: "S4", stock: 10500, rotacion: 4.8 },
  { semana: "S5", stock: 10200, rotacion: 5.0 },
  { semana: "S6", stock: 9900, rotacion: 5.1 },
]

export const alertasOperacion = [
  { id: 1, tipo: "Stock bajo", detalle: "SKU PRD-332 bajo mínimo en CD Norte", severidad: "alta" },
  { id: 2, tipo: "Demora", detalle: "12 pedidos con SLA > 48h", severidad: "media" },
  { id: 3, tipo: "Calidad", detalle: "Lote L-901 en revisión", severidad: "baja" },
]
