import type { LucideIcon } from "lucide-react"
import {
  Clock3,
  Headset,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ContactItem = {
  title: string
  value: string
  note: string
  href?: string
  icon: LucideIcon
}

const mainContacts: ContactItem[] = [
  {
    title: "Telefono principal",
    value: "+57 300 123 4567",
    note: "Soporte operativo para incidencias y seguimiento.",
    href: "tel:+573001234567",
    icon: Phone,
  },
  {
    title: "Correo de soporte",
    value: "soporte@reportesbi.com",
    note: "Consulta errores, accesos y solicitudes de informacion.",
    href: "mailto:soporte@reportesbi.com",
    icon: Mail,
  },
  {
    title: "WhatsApp empresarial",
    value: "+57 320 987 6543",
    note: "Atencion rapida para dudas de uso diario.",
    href: "https://wa.me/573209876543",
    icon: MessageCircle,
  },
  {
    title: "Horario de atencion",
    value: "Lunes a Viernes - 8:00 AM a 6:00 PM",
    note: "Fuera de horario se atienden incidentes criticos.",
    icon: Clock3,
  },
  {
    title: "Direccion de soporte",
    value: "Calle 100 # 12-34, Bogota, Colombia",
    note: "Atencion presencial solo con cita programada.",
    icon: MapPin,
  },
]

const extraSupportInfo = [
  {
    title: "Canales alternos",
    description:
      "Si no recibes respuesta por un canal, usa cualquiera de estos medios para escalar tu caso.",
    items: [
      "Mesa de ayuda interna: extension 104",
      "Correo de escalamiento: prioridad@reportesbi.com",
      "Coordinacion tecnica: +57 301 555 1122",
    ],
    icon: Headset,
  },
  {
    title: "Tiempos de respuesta",
    description: "Los tiempos pueden variar segun la prioridad del requerimiento.",
    items: [
      "Alta (servicio detenido): 30 minutos",
      "Media (impacto parcial): 2 horas",
      "Baja (consulta general): 1 dia habil",
    ],
    icon: ShieldCheck,
  },
]

export default function SoportePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Soporte</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Encuentra aqui los canales oficiales de contacto para soporte tecnico.
          Los datos son de ejemplo y se pueden reemplazar facilmente cuando tengas
          los definitivos.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mainContacts.map((contact) => (
          <Card
            key={contact.title}
            className="border border-border/60 bg-card/90 shadow-sm transition-colors hover:bg-card"
          >
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="rounded-md bg-secondary p-2">
                  <contact.icon className="size-4" />
                </div>
                <CardTitle>{contact.title}</CardTitle>
              </div>
              <CardDescription>{contact.note}</CardDescription>
            </CardHeader>
            <CardContent>
              {contact.href ? (
                <a
                  href={contact.href}
                  className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  target={contact.href.startsWith("https://") ? "_blank" : undefined}
                  rel={
                    contact.href.startsWith("https://")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {contact.value}
                </a>
              ) : (
                <p className="text-sm font-semibold text-foreground">{contact.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {extraSupportInfo.map((block) => (
          <Card key={block.title} className="border border-border/60 bg-card/80">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="rounded-md bg-secondary p-2">
                  <block.icon className="size-4" />
                </div>
                <CardTitle>{block.title}</CardTitle>
              </div>
              <CardDescription>{block.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {block.items.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
