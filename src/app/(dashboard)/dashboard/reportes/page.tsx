import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ParticipacionLineChart } from "@/components/dashboard-charts"
import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
          <p className="text-sm text-muted-foreground">
            Vistas exportables y comparativas (simuladas).
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="gap-2 border-primary/30 text-primary"
          disabled
        >
          <FileDown className="size-4" />
          Exportar (próximamente)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribución por canal</CardTitle>
          <CardDescription>Base para reportes ejecutivos</CardDescription>
        </CardHeader>
        <CardContent>
          <ParticipacionLineChart />
        </CardContent>
      </Card>
    </div>
  )
}
