"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { REPORT_AREA_LABEL, type ReportArea } from "@/lib/report-area"
import { cn } from "@/lib/utils"

type ReportAreaModalProps = {
  open: boolean
  /** Si true, Escape y clic fuera no cierran el diálogo */
  requireChoice?: boolean
}

const AREAS: { id: ReportArea; label: string }[] = [
  { id: "control_previo", label: REPORT_AREA_LABEL.control_previo },
  { id: "ro_civil", label: REPORT_AREA_LABEL.ro_civil },
]

export function ReportAreaModal({
  open,
  requireChoice = true,
}: ReportAreaModalProps) {
  const router = useRouter()
  const { update } = useSession()
  const [pending, setPending] = React.useState(false)

  async function selectArea(area: ReportArea) {
    setPending(true)
    try {
      await update({ reportArea: area })
      router.replace("/dashboard")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next, eventDetails) => {
        if (!next && requireChoice) eventDetails.cancel()
      }}
      modal
      disablePointerDismissal={requireChoice}
    >
      <DialogContent className="max-w-md border-border/90 p-6 sm:p-8">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl">Seleccione un área de trabajo</DialogTitle>
          <DialogDescription>
            Elija el módulo que desea utilizar en esta sesión.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-1.5 pt-2">
          {AREAS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              disabled={pending}
              onClick={() => void selectArea(id)}
              className={cn(
                "flex min-h-22 items-center justify-center rounded-xl border border-border bg-card px-2 py-3 text-center text-xs font-semibold uppercase leading-tight tracking-wide text-foreground shadow-sm transition-colors",
                "hover:border-primary/40 hover:bg-secondary/60",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
                "disabled:pointer-events-none disabled:opacity-60"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
