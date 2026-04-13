"use client"

import { LogOut } from "lucide-react"
import { signOutAction } from "@/lib/sign-out-action"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function initials(name: string | null | undefined) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase()
}

export function NavUser({
  name,
  email,
}: {
  name: string | null | undefined
  email: string | null | undefined
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg p-2 text-sidebar-foreground",
        "outline-none ring-sidebar-ring focus-within:ring-2",
        "group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:py-3"
      )}
    >
      <Avatar className="size-9 shrink-0 rounded-full border border-sidebar-border">
        <AvatarFallback className="rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
        <p className="truncate text-sm font-semibold">{name ?? "Usuario"}</p>
        <p className="truncate text-xs text-muted-foreground">{email ?? ""}</p>
      </div>
      <form action={signOutAction} className="shrink-0 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <Button
          type="submit"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Cerrar sesión"
        >
          <LogOut className="size-4" strokeWidth={1.5} />
        </Button>
      </form>
    </div>
  )
}
