"use client"

import { LogOut, User, ChevronsUpDown } from "lucide-react"
import { signOutAction } from "@/lib/sign-out-action"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm text-sidebar-foreground outline-none ring-sidebar-ring",
              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              "focus-visible:ring-2 data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
            )}
          >
            <Avatar className="size-8 rounded-lg border border-sidebar-border">
              <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name ?? "Usuario"}</span>
              <span className="truncate text-xs opacity-80">{email ?? ""}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex flex-col space-y-1 px-2 py-1.5">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <User className="size-4 text-muted-foreground" />
                    {name ?? "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground">{email ?? ""}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <form action={signOutAction} className="w-full">
                <button
                  type="submit"
                  className={cn(
                    "group/dropdown-menu-item flex w-full cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm outline-none select-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:bg-accent focus-visible:text-accent-foreground"
                  )}
                >
                  <LogOut className="size-4 shrink-0" />
                  Cerrar sesión
                </button>
              </form>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
