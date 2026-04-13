import { parseRopresupuestoTablaQuery } from "@/lib/ropresupuesto-tabla"

/** Convierte `URLSearchParams` del navegador al shape usado por la tabla RoPresupuesto. */
export function parseRopresupuestoTablaFromSearchParams(searchParams: URLSearchParams) {
  const asRecord: Record<string, string | undefined> = {}
  for (const [key, value] of searchParams.entries()) {
    asRecord[key] = value
  }
  return parseRopresupuestoTablaQuery(asRecord)
}
