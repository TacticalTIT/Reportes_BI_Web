import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
        <p className="text-sm text-muted-foreground">
          Ajustes del portal (placeholder para futuras integraciones).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Entorno de demostración</CardTitle>
          <CardDescription>
            Las credenciales y datos mostrados son ficticios. En producción,
            conecte su proveedor de identidad y fuentes de datos reales.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Variables relevantes: <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AUTH_SECRET</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AUTH_DEMO_USERNAME</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">AUTH_DEMO_PASSWORD_HASH_B64</code>.
          </p>
          <Separator />
          <p>
            Colores de marca configurados como tokens CSS en{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">globals.css</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
