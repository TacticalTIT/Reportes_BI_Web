"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleHelp, LifeBuoy, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { getMainNavForArea } from "@/lib/nav-by-area"
import type { ReportArea } from "@/lib/report-area"
import { cn } from "@/lib/utils"

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

const menuButtonClass =
  "rounded-lg text-muted-foreground shadow-none hover:bg-secondary/90 hover:text-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:font-semibold data-active:ring-1 data-active:ring-sidebar-border/60 group-data-[collapsible=icon]:data-active:ring-2 group-data-[collapsible=icon]:data-active:ring-sidebar-ring/40"

const managementNavItems = [
  { title: "Ayuda", href: "/dashboard/ayuda", icon: CircleHelp },
  { title: "Soporte", href: "/dashboard/soporte", icon: LifeBuoy },
  { title: "Configuración", href: "/dashboard/configuracion", icon: Settings },
] as const

function BrandMark() {
  return (
    <div
      className="relative flex size-10 shrink-0 items-center justify-center rounded-full"
      aria-hidden
    >
      <span
        className="absolute size-6 rounded-full opacity-90"
        style={{ background: "var(--color-brand-tertiary)" }}
      />
      <span
        className="absolute -top-0.5 left-1/2 size-3 -translate-x-1/2 rounded-full"
        style={{ background: "var(--color-brand-primary)" }}
      />
      <span
        className="absolute top-1/2 -right-0.5 size-3 -translate-y-1/2 rounded-full"
        style={{ background: "var(--color-brand-secondary)" }}
      />
      <span
        className="absolute bottom-0 left-0.5 size-2.5 rounded-full"
        style={{ background: "var(--color-brand-primary)" }}
      />
      <span
        className="absolute bottom-0.5 right-1 size-2.5 rounded-full opacity-80"
        style={{ background: "var(--color-brand-tertiary)" }}
      />
    </div>
  )
}

export function AppSidebar({
  user,
  reportArea,
}: {
  user: { name?: string | null; email?: string | null }
  reportArea: ReportArea
}) {
  const pathname = usePathname()
  const mainNavItems = getMainNavForArea(reportArea)

  return (
    <Sidebar collapsible="icon" appSidebarTheme="light">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
        <div className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:px-0">
          <div className="shrink-0 transition-transform group-data-[collapsible=icon]:scale-90">
            <BrandMark />
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="text-base font-semibold tracking-tight text-sidebar-foreground">
              Reportes BI
            </p>
            <p className="text-xs text-muted-foreground">Panel corporativo</p>
          </div>
          <SidebarTrigger
            className="ml-auto hidden shrink-0 text-muted-foreground hover:bg-secondary/90 hover:text-foreground md:inline-flex group-data-[collapsible=icon]:ml-0"
            aria-label="Contraer o expandir menú"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-6 px-2 py-4">
        <SidebarGroup className="gap-2">
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground">
            Menú principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isNavActive(pathname, item.href)}
                    tooltip={item.title}
                    className={cn(menuButtonClass)}
                    render={
                      <Link href={item.href}>
                        <item.icon className="size-4" strokeWidth={1.5} />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="gap-2">
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground">
            Gestión
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
              {managementNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isNavActive(pathname, item.href)}
                    tooltip={item.title}
                    className={cn(menuButtonClass)}
                    render={
                      <Link href={item.href}>
                        <item.icon className="size-4" strokeWidth={1.5} />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <NavUser name={user.name} email={user.email} />
      </SidebarFooter>
    </Sidebar>
  )
}
