/** Muestras distinct reales de BD; sustituir por fetch a un endpoint de catálogos si existe. */
export const ROPRESUPUESTO_PROYECTO_OPTIONS = [
  "ADP CCTV",
  "ALMACEN CENTRAL",
  "ANA I",
  "CARABAYLLO",
  "CONSORCIO BERNAL SMART",
  "GERENCIA",
] as const

export const ROPRESUPUESTO_PROVEEDOR_OPTIONS = [
  "A & A COPIADORAS S.A.C.",
  "3CLICS S.A.C.",
  "4B CONSULTORES S.A.C.",
  "8 MARES BUFFET E.I.R.L.",
] as const

export const ROPRESUPUESTO_TIPO_DOCUMENTO_OPTIONS = [
  "ANTICIPO PROVEEDORES",
  "COMPROBANTE DE RETENCION ELECTRONICA",
  "AJUSTES",
  "DOCUMENTO DE COBRANZA",
] as const

export const ROPRESUPUESTO_MONEDA_OPTIONS = ["S/.", "SOLES", "U$", "DÓLARES"] as const

export const ROPRESUPUESTO_ESTADO_OPTIONS = [
  "Pagado",
  "Pendiente",
  "Aprobado",
  "Emitido",
  "Anulado",
] as const

export type RopresupuestoFilterParam =
  | "proyecto"
  | "proveedor"
  | "tipoDocumento"
  | "moneda"
  | "estado"

export const ROPRESUPUESTO_FILTER_FIELDS: ReadonlyArray<{
  param: RopresupuestoFilterParam
  label: string
  options: readonly string[]
}> = [
  { param: "proyecto", label: "Proyecto", options: ROPRESUPUESTO_PROYECTO_OPTIONS },
  { param: "proveedor", label: "Proveedor", options: ROPRESUPUESTO_PROVEEDOR_OPTIONS },
  {
    param: "tipoDocumento",
    label: "Tipo documento",
    options: ROPRESUPUESTO_TIPO_DOCUMENTO_OPTIONS,
  },
  { param: "moneda", label: "Moneda", options: ROPRESUPUESTO_MONEDA_OPTIONS },
  { param: "estado", label: "Estado", options: ROPRESUPUESTO_ESTADO_OPTIONS },
]
