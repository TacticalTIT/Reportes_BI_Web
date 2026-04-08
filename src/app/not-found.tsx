import { ReportEmptyState } from "@/components/report-states"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <ReportEmptyState message="La pagina que buscas no existe o fue movida." />
      <Link
        href="/dashboard"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Volver al dashboard
      </Link>
    </div>
  )
}
