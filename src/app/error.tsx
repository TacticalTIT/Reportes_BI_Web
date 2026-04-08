"use client"

import { ReportErrorState } from "@/components/report-states"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ReportErrorState
        message={error.message || "Ocurrio un error inesperado."}
        onRetry={reset}
      />
    </div>
  )
}
