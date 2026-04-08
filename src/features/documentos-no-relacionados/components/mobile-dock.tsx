import { cn } from "@/lib/utils"
import { Wallet } from "lucide-react"

const ITEMS = ["Inicio", "Analítica", "Pagos", "Ajustes"] as const

export function DocumentosMobileDock() {
  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-border bg-card/95 px-4 shadow-[0_-8px_30px_rgb(0_0_0_/_.08)] backdrop-blur-md md:hidden"
      aria-label="Navegación rápida"
    >
      {ITEMS.map((item) => (
        <button
          key={item}
          type="button"
          aria-label={item}
          className={cn(
            "flex flex-col items-center gap-1 text-[10px] font-bold",
            item === "Inicio" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Wallet className="size-4" aria-hidden />
          <span>{item}</span>
        </button>
      ))}
    </nav>
  )
}
