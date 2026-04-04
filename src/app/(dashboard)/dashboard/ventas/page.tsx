import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VentasMetaChart } from "@/components/dashboard-charts"
import { topProductos } from "@/lib/mock-data"

export default function VentasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ventas</h1>
        <p className="text-sm text-muted-foreground">
          Evolución y ranking de productos (datos ficticios).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rendimiento mensual</CardTitle>
          <CardDescription>Ventas frente a meta</CardDescription>
        </CardHeader>
        <CardContent>
          <VentasMetaChart />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top productos</CardTitle>
          <CardDescription>Por unidades e ingreso estimado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">SKU</th>
                  <th className="pb-2 pr-4 font-medium">Producto</th>
                  <th className="pb-2 pr-4 font-medium text-right">Unidades</th>
                  <th className="pb-2 font-medium text-right">Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {topProductos.map((row) => (
                  <tr key={row.sku} className="border-b border-border/60">
                    <td className="py-2 pr-4 font-mono text-xs">{row.sku}</td>
                    <td className="py-2 pr-4">{row.nombre}</td>
                    <td className="py-2 pr-4 text-right tabular-nums">
                      {row.unidades.toLocaleString("es-MX")}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                        maximumFractionDigits: 0,
                      }).format(row.ingreso)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
