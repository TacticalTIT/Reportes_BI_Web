"use client"

import { ReportErrorState } from "@/components/report-states"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ReportErrorState
      message={error.message || "Ocurrio un error al cargar esta seccion."}
      onRetry={reset}
    />
  )
}
