import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ControlPrevioDocNoRelResumenResult } from "@/lib/controlprevio-documentos-no-relacionados"

type Props = {
  resumen?: ControlPrevioDocNoRelResumenResult
  /** Primera carga o refetch sin datos anteriores. */
  isPending?: boolean
}

function RowTable(props: {
  title: string
  rows: { tipoDocumento: string | null; cantidad: number; isGrandTotalRowTotal: boolean }[]
  accentClass: string
}) {
  const { title, rows, accentClass } = props
  if (rows.length === 0) {
    return (
      <Card className={`rounded-2xl border border-border border-t-4 ${accentClass} shadow-sm`}>
        <CardHeader className="border-b border-border/80 pb-3">
          <CardTitle className="text-sm font-black tracking-[0.18em] text-muted-foreground uppercase">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">Sin data disponible.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`rounded-2xl border border-border border-t-4 ${accentClass} shadow-sm`}>
      <CardHeader className="border-b border-border/80 pb-3">
        <CardTitle className="text-sm font-black tracking-[0.18em] text-muted-foreground uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-96 border-collapse text-sm">
            <thead className="bg-muted/35">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Tipo documento
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Cantidad
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row) => (
                <tr
                  key={`${row.tipoDocumento ?? "total"}-${row.cantidad}`}
                  className={row.isGrandTotalRowTotal ? "bg-muted/30 font-bold" : "hover:bg-muted/20"}
                >
                  <td className="px-5 py-3 text-muted-foreground">
                    {row.tipoDocumento ?? "Total"}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">
                    {row.cantidad.toLocaleString("es-MX")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export function DocumentosSidebarInsights({ resumen, isPending = false }: Props) {
  if (isPending && !resumen) {
    return (
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-sm ring-1 ring-foreground/5">
          <CardHeader className="border-b border-border/80 pb-3">
            <CardTitle className="text-sm font-bold text-primary">
              Conteo por tipo (relacionar)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm ring-1 ring-foreground/5">
          <CardHeader className="border-b border-border/80 pb-3">
            <CardTitle className="text-sm font-bold text-primary">
              Conteo por tipo (liquidar)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!resumen) return null

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <RowTable
        title="Docs por relacionar"
        rows={resumen.porRelacionar}
        accentClass="border-t-(--color-brand-tertiary)"
      />
      <RowTable
        title="Docs por liquidar"
        rows={resumen.porLiquidar}
        accentClass="border-t-(--color-brand-secondary)"
      />
    </section>
  )
}
