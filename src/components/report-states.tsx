import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Inbox, RefreshCw } from "lucide-react"

export function ReportLoadingState({
  message = "Cargando informacion...",
}: {
  message?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24 w-32 rounded-xl" />
        <Skeleton className="h-24 w-32 rounded-xl" />
        <Skeleton className="h-24 w-32 rounded-xl" />
      </div>
      <Skeleton className="h-4 w-48" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export function ReportErrorState({
  message = "Ocurrio un error al cargar los datos.",
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">
          Error al cargar datos
        </p>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <RefreshCw className="size-4" />
          Reintentar
        </button>
      )}
    </div>
  )
}

export function ReportEmptyState({
  message = "No hay datos disponibles.",
}: {
  message?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Inbox className="size-7 text-muted-foreground" />
      </div>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
