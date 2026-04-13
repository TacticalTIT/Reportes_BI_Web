export function formatFecha(iso: string | null) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatNumero(n: number, fractionDigits: number) {
  return new Intl.NumberFormat("es-MX", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n)
}

export function formatTexto(value: string | null) {
  if (!value) return "—"
  return value
}

export function formatCompactCurrency(n: number, currency: "PEN" | "USD") {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}
