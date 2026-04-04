"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CircleHelp,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  LifeBuoy,
  Package,
  PieChart,
  Settings,
} from "lucide-react"
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
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { cn } from "@/lib/utils"

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/"
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

const menuButtonClass =
  "rounded-lg text-muted-foreground shadow-none hover:bg-secondary/90 hover:text-foreground data-active:bg-card data-active:text-foreground data-active:shadow-sm data-active:font-semibold"

const mainNavItems = [
  { title: "Panel", href: "/dashboard", icon: LayoutDashboard },
  { title: "Estadísticas", href: "/dashboard/ventas", icon: PieChart },
  { title: "Inventario", href: "/dashboard/inventario", icon: Package },
  { title: "Tarjetas", href: "/dashboard/tarjetas", icon: CreditCard },
  { title: "Reportes", href: "/dashboard/reportes", icon: FileBarChart },
] as const

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
}: {
  user: { name?: string | null; email?: string | null }
}) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" appSidebarTheme="light">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-3 px-1">
          <BrandMark />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="text-base font-semibold tracking-tight text-sidebar-foreground">
              Reportes BI
            </p>
            <p className="text-xs text-muted-foreground">Panel corporativo</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-6 px-2 py-4">
        <SidebarGroup className="gap-2">
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground">
            Menú principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
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
            <SidebarMenu className="gap-1">
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
      <SidebarRail />
    </Sidebar>
  )
}
