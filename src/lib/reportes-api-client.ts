import { buildReportFiltersQueryString, type ReportTablaFilters } from "@/lib/report-filters"

type ApiErrorBody = {
  success: false
  message: string
  error?: string
  code?: string
}

function getReportesApiBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_REPORTES_API_BASE_URL ??
    process.env.REPORTES_API_BASE_URL
  return raw?.replace(/\/$/, "")
}

export function buildBiopAnalyticsPath(
  metric: string,
  filters?: ReportTablaFilters
) {
  const query = new URLSearchParams({ metric })
  const filtersQs = filters ? buildReportFiltersQueryString(filters) : ""
  if (filtersQs) {
    for (const [k, v] of new URLSearchParams(filtersQs).entries()) {
      query.set(k, v)
    }
  }
  return `/api/biop/analytics?${query.toString()}`
}

export async function fetchReportesJson(path: string): Promise<unknown> {
  const base = getReportesApiBaseUrl()
  if (!base) {
    throw new Error(
      "Falta NEXT_PUBLIC_REPORTES_API_BASE_URL (o REPORTES_API_BASE_URL) en .env.local."
    )
  }

  const res = await fetch(`${base}${path}`, { cache: "no-store" })
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
      typeof (body as ApiErrorBody).message === "string"
    ) {
      throw new Error((body as ApiErrorBody).message)
    }
    throw new Error(`Error HTTP ${res.status}`)
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("success" in body) ||
    typeof (body as { success: unknown }).success !== "boolean"
  ) {
    throw new Error("Respuesta del API con formato inesperado.")
  }

  if (!(body as { success: boolean }).success) {
    const err = body as ApiErrorBody
    throw new Error(err.message || "El API devolvio un error.")
  }

  return body
}
