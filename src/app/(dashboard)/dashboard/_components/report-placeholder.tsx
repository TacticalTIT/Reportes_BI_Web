import { Construction } from "lucide-react"

export function ReportPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Este modulo esta en desarrollo.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Construction className="size-7 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            En construccion
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Estamos trabajando en este reporte. Pronto estara disponible con
            datos en tiempo real.
          </p>
        </div>
      </div>
    </div>
  )
}
